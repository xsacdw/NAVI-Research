const SESSIONS = [
    {
        id: 1, date: '2026-03-13', topic: '미래 기술 혁신과 사회 구조',
        volume: '퀵', type: 'Research Paper', lang: '한국어',
        words: 1294, citations: 8, ptcs: 78, srcs: { a: 6, b: 2, c: 0 },
        path: 'future-tech-society_2026-03-13', diagrams: 1,
    },
    {
        id: 2, date: '2026-03-13', topic: 'LLM 에이전트 아키텍처 서베이',
        volume: '퀵', type: 'Literature Review', lang: '영어',
        words: 4600, citations: 15, ptcs: 72, srcs: { a: 10, b: 4, c: 1 },
        path: 'llm-agents-survey', diagrams: 2,
    },
];

const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

// Nav
function navigate(page) {
    $$('.page').forEach(p => p.classList.remove('active'));
    $$('.nav-item').forEach(n => n.classList.remove('active'));
    $(`#page-${page}`).classList.add('active');
    $(`#nav-${page}`).classList.add('active');
    $('#page-title').textContent = page === 'dashboard' ? '대시보드' : '세션 목록';
}
$$('.nav-item').forEach(i => i.addEventListener('click', e => { e.preventDefault(); navigate(i.dataset.page); }));
$('#view-all')?.addEventListener('click', e => { e.preventDefault(); navigate('sessions'); });

// Stats
function updateStats() {
    const w = SESSIONS.reduce((s, x) => s + x.words, 0);
    const c = SESSIONS.reduce((s, x) => s + x.citations, 0);
    const p = SESSIONS.length ? Math.round(SESSIONS.reduce((s, x) => s + x.ptcs, 0) / SESSIONS.length) : 0;
    animate($('#total-sessions'), SESSIONS.length);
    animate($('#total-words'), w);
    animate($('#total-citations'), c);
    $('#avg-ptcs').textContent = p + '%';
}
function animate(el, target) {
    let cur = 0; const step = Math.ceil(target / 25);
    const t = setInterval(() => { cur += step; if (cur >= target) { cur = target; clearInterval(t); } el.textContent = cur.toLocaleString(); }, 30);
}

// Sessions
function renderSessions(id, list) {
    $(id).innerHTML = `
        <div class="session-row-header"><span>#</span><span>주제</span><span>분량</span><span>PTCS</span><span>출처</span><span>언어</span></div>
    ` + list.map((s, i) => `
        <div class="session-row">
            <span class="idx">${i + 1}</span>
            <span class="topic">${s.topic}<span class="date">${s.date} · ${s.words.toLocaleString()} words · ${s.citations} citations · ${s.diagrams} fig</span></span>
            <span class="meta">${s.volume}</span>
            <span><span class="ptcs-badge ${s.ptcs >= 80 ? 'ptcs-high' : s.ptcs >= 60 ? 'ptcs-mid' : 'ptcs-low'}">${s.ptcs}%</span></span>
            <span class="meta">A:${s.srcs.a} B:${s.srcs.b} C:${s.srcs.c}</span>
            <span class="meta">${s.lang}</span>
        </div>
    `).join('');
}

// QA
function renderQA() {
    const s = SESSIONS[0]; if (!s) return;
    const bars = [
        { label: 'GRA (근거 검증)', value: 90, color: 'var(--success)' },
        { label: 'PTCS (투고 가능성)', value: s.ptcs, color: 'var(--accent)' },
        { label: 'SRCS (출처 신뢰도)', value: Math.round(s.srcs.a / (s.srcs.a + s.srcs.b + s.srcs.c) * 100), color: '#f093fb' },
    ];
    $('#qa-dashboard').innerHTML = bars.map(b => `
        <div class="qa-bar">
            <div class="qa-bar-header"><span class="qa-bar-label">${b.label}</span><span class="qa-bar-value">${b.value}%</span></div>
            <div class="qa-bar-track"><div class="qa-bar-fill" style="width:${b.value}%;background:${b.color};"></div></div>
        </div>
    `).join('') + `<div style="margin-top:12px;font-size:12px;color:var(--text-muted)">최근: ${s.topic} (${s.date})</div>`;
}

// Init
updateStats();
renderSessions('#recent-sessions', SESSIONS);
renderSessions('#all-sessions', SESSIONS);
renderQA();
