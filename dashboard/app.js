// ===== Data =====
const SESSIONS = [
    {
        id: 1,
        date: '2026-03-13',
        topic: '미래 기술 혁신과 사회 구조',
        volume: '퀵',
        type: 'Research Paper',
        lang: '한국어',
        words: 1294,
        citations: 8,
        ptcs: 78,
        srcs: { a: 6, b: 2, c: 0 },
        path: 'future-tech-society_2026-03-13',
        diagrams: 1,
    },
    {
        id: 2,
        date: '2026-03-13',
        topic: 'LLM 에이전트 아키텍처 서베이',
        volume: '퀵',
        type: 'Literature Review',
        lang: '영어',
        words: 4600,
        citations: 15,
        ptcs: 72,
        srcs: { a: 10, b: 4, c: 1 },
        path: 'llm-agents-survey',
        diagrams: 2,
    },
];

const WORKFLOWS = [
    { name: '/research-simulate', desc: '논문 시뮬레이션 (전체 파이프라인)', trigger: '메인' },
    { name: '/paper-drafting', desc: 'OpenDraft 6단계 논문 초안', trigger: '집필' },
    { name: '/brainstorming', desc: '아이디어 → 설계 변환', trigger: '설계' },
    { name: '/writing-plans', desc: '설계 → 구현 계획', trigger: '계획' },
    { name: '/executing-plans', desc: '계획 실행 + TDD', trigger: '실행' },
    { name: '/tdd', desc: 'RED-GREEN-REFACTOR', trigger: 'TDD' },
    { name: '/debugging', desc: '근본 원인 추적 4단계', trigger: '디버깅' },
];

const SYSTEM_INFO = [
    { key: 'LLM Engine', val: 'Antigravity (무료)' },
    { key: 'Search APIs', val: '5개 (OpenAlex, Semantic Scholar, arXiv, CORE, Crossref)' },
    { key: 'Test Suite', val: '14/14 PASS' },
    { key: 'QA System', val: '3중 (GRA + PTCS + SRCS)' },
    { key: 'Diagram Engine', val: 'PaperBanana 5-Agent' },
    { key: 'Project', val: 'NAVI-PJ (github.com/xsacdw/NAVI-PJ)' },
    { key: 'Python', val: '3.12' },
    { key: 'Framework', val: 'Pydantic + httpx + Rich' },
];

// ===== DOM =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ===== Navigation =====
function navigate(pageName) {
    $$('.page').forEach(p => p.classList.remove('active'));
    $$('.nav-item').forEach(n => n.classList.remove('active'));
    $(`#page-${pageName}`).classList.add('active');
    $(`#nav-${pageName}`).classList.add('active');

    const titles = { dashboard: '대시보드', sessions: '세션 목록', search: '문헌 검색', settings: '설정' };
    $('#page-title').textContent = titles[pageName] || pageName;
}

$$('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        navigate(item.dataset.page);
    });
});

$('#view-all-sessions')?.addEventListener('click', (e) => { e.preventDefault(); navigate('sessions'); });

// ===== Stats =====
function updateStats() {
    const totalWords = SESSIONS.reduce((s, x) => s + x.words, 0);
    const totalCitations = SESSIONS.reduce((s, x) => s + x.citations, 0);
    const avgPtcs = SESSIONS.length ? Math.round(SESSIONS.reduce((s, x) => s + x.ptcs, 0) / SESSIONS.length) : 0;

    animateNumber($('#total-sessions'), SESSIONS.length);
    animateNumber($('#total-words'), totalWords);
    animateNumber($('#total-citations'), totalCitations);
    $('#avg-ptcs').textContent = `${avgPtcs}%`;
}

function animateNumber(el, target) {
    let current = 0;
    const step = Math.ceil(target / 30);
    const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current.toLocaleString();
    }, 30);
}

// ===== Sessions Table =====
function renderSessions(containerId, sessions) {
    const container = $(containerId);
    let html = `
        <div class="session-row-header">
            <span>#</span><span>주제</span><span>분량</span><span>PTCS</span><span>출처</span><span>언어</span><span></span>
        </div>
    `;

    sessions.forEach((s, i) => {
        const ptcsClass = s.ptcs >= 80 ? 'ptcs-high' : s.ptcs >= 60 ? 'ptcs-mid' : 'ptcs-low';
        html += `
            <div class="session-row" onclick="openSession('${s.path}')">
                <span class="idx">${i + 1}</span>
                <span class="topic">
                    ${s.topic}
                    <span class="date">${s.date} · ${s.words.toLocaleString()} words · ${s.citations} citations · ${s.diagrams} fig</span>
                </span>
                <span class="volume">${s.volume}</span>
                <span><span class="ptcs-badge ${ptcsClass}">${s.ptcs}%</span></span>
                <span class="srcs-text">A:${s.srcs.a} B:${s.srcs.b} C:${s.srcs.c}</span>
                <span class="lang">${s.lang}</span>
                <span class="link">→</span>
            </div>
        `;
    });

    container.innerHTML = html;
}

function openSession(path) {
    alert(`세션 열기: docs/sessions/${path}/output/\n\nAntigravity에서 열려면:\n"${path} 세션 결과 보여줘"라고 말하세요.`);
}

// ===== Workflows =====
function renderWorkflows() {
    const container = $('#workflow-list');
    container.innerHTML = WORKFLOWS.map(w => `
        <div class="workflow-item">
            <div>
                <div class="wf-name">${w.name}</div>
                <div class="wf-desc">${w.desc}</div>
            </div>
            <span class="wf-badge">${w.trigger}</span>
        </div>
    `).join('');
}

// ===== QA Dashboard =====
function renderQA() {
    const latest = SESSIONS[0];
    if (!latest) return;

    const bars = [
        { label: 'GRA (근거 검증)', value: 90, color: 'var(--success)' },
        { label: 'PTCS (투고 가능성)', value: latest.ptcs, color: 'var(--accent)' },
        { label: 'SRCS (출처 신뢰도)', value: Math.round((latest.srcs.a / (latest.srcs.a + latest.srcs.b + latest.srcs.c)) * 100), color: '#f093fb' },
    ];

    $('#qa-dashboard').innerHTML = bars.map(b => `
        <div class="qa-bar">
            <div class="qa-bar-header">
                <span class="qa-bar-label">${b.label}</span>
                <span class="qa-bar-value">${b.value}%</span>
            </div>
            <div class="qa-bar-track">
                <div class="qa-bar-fill" style="width: ${b.value}%; background: ${b.color};"></div>
            </div>
        </div>
    `).join('') + `
        <div style="margin-top: 16px; font-size: 12px; color: var(--text-muted);">
            최근 세션: ${latest.topic} (${latest.date})
        </div>
    `;
}

// ===== Settings =====
function renderSettings() {
    $('#system-info').innerHTML = SYSTEM_INFO.map(s => `
        <div class="settings-item">
            <span class="settings-key">${s.key}</span>
            <span class="settings-val">${s.val}</span>
        </div>
    `).join('');
}

// ===== Modal =====
const modal = $('#modal-overlay');
$('#new-simulation-btn').addEventListener('click', () => { modal.classList.add('active'); updatePreview(); });
$('#modal-close').addEventListener('click', () => modal.classList.remove('active'));
$('#modal-cancel').addEventListener('click', () => modal.classList.remove('active'));
modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

function updatePreview() {
    const mode = $('#sim-mode').value;
    const vol = $('#sim-volume').value;
    const type = $('#sim-type').value;
    const lang = $('#sim-lang').value;
    const topic = $('#sim-topic').value || '주제';
    $('#command-preview').innerHTML = `<code>대화창에서 실행: "${topic} 논문 시뮬레이션 해줘" → ${mode}-${vol}-${type}-${lang}</code>`;
}

['sim-mode', 'sim-volume', 'sim-type', 'sim-lang', 'sim-topic'].forEach(id => {
    $(`#${id}`)?.addEventListener('change', updatePreview);
    $(`#${id}`)?.addEventListener('input', updatePreview);
});

$('#modal-copy').addEventListener('click', () => {
    const mode = $('#sim-mode').value;
    const vol = $('#sim-volume').value;
    const type = $('#sim-type').value;
    const lang = $('#sim-lang').value;
    const topic = $('#sim-topic').value || '주제';
    const text = `${topic} 논문 시뮬레이션 해줘\n${mode}-${vol}-${type}-${lang}`;
    navigator.clipboard.writeText(text).then(() => {
        $('#modal-copy').textContent = '✅ 복사됨!';
        setTimeout(() => { $('#modal-copy').textContent = '📋 명령어 복사'; }, 2000);
    });
});

// ===== Mobile Menu =====
$('#menu-toggle').addEventListener('click', () => {
    $('#sidebar').classList.toggle('open');
});

// ===== Init =====
function init() {
    updateStats();
    renderSessions('#recent-sessions', SESSIONS);
    renderSessions('#all-sessions', SESSIONS);
    renderWorkflows();
    renderQA();
    renderSettings();
}

init();
