export interface LocalizedMeta {
  title: string;
  subtitle?: string;
  abstract: string;
}

export interface Session {
  id: string;
  folder: string; // docs/sessions/ folder name
  date: string;
  type: "Literature Review" | "Research Paper" | "Report";
  words: number;
  citations: number;
  ptcs: number;
  diagrams: number;
  ko: LocalizedMeta;
  en: LocalizedMeta;
}

export const sessions: Session[] = [
  {
    id: "future-tech-society",
    folder: "future-tech-society_2026-03-13",
    date: "2026-03-13",
    type: "Research Paper",
    words: 1294,
    citations: 8,
    ptcs: 78,
    diagrams: 1,
    ko: {
      title: "미래 기술 혁신이 사회 구조에 미치는 영향",
      subtitle: "AI, 6G, 바이오 기술을 중심으로",
      abstract:
        "본 연구는 인공지능(AI), 6G 통신, 바이오 기술 등 미래 핵심 기술이 사회 구조에 미치는 영향을 다층적으로 분석한다.",
    },
    en: {
      title: "Impact of Future Technology Innovation on Social Structures",
      subtitle: "Focusing on AI, 6G, and Biotechnology",
      abstract:
        "This study analyzes the multi-layered impact of key future technologies—including AI, 6G communications, and biotechnology—on social structures.",
    },
  },
  {
    id: "llm-agents-survey",
    folder: "llm-agents-survey_2026-03-13",
    date: "2026-03-13",
    type: "Literature Review",
    words: 4600,
    citations: 15,
    ptcs: 72,
    diagrams: 2,
    ko: {
      title: "LLM 기반 자율 에이전트에 대한 서베이",
      subtitle: "아키텍처, 협업, 응용",
      abstract:
        "본 서베이는 LLM 기반 자율 에이전트의 아키텍처와 협업 패턴을 검토하며, 프로파일링, 메모리, 계획, 행동 모듈을 다룬다.",
    },
    en: {
      title: "A Survey on LLM-based Autonomous Agents",
      subtitle: "Architecture, Collaboration, and Applications",
      abstract:
        "This survey reviews the architecture and collaboration patterns of LLM-based autonomous agents, covering profiling, memory, planning, and action modules.",
    },
  },
  {
    id: "ai-economy-future",
    folder: "ai-economy-future_2026-03-13",
    date: "2026-03-13",
    type: "Research Paper",
    words: 28364,
    citations: 23,
    ptcs: 85,
    diagrams: 2,
    ko: {
      title: "AI 시대의 경제 미래",
      subtitle: "거시경제, 노동시장, 산업구조의 전환에 관한 연구",
      abstract:
        "인공지능(AI) 기술은 18세기 산업혁명 이래 가장 근본적인 경제 패러다임의 전환을 예고하고 있다. 본 연구는 AI가 거시경제, 노동시장, 산업구조, 소득 분배에 미치는 다차원적 영향을 체계적으로 분석한다.",
    },
    en: {
      title: "The Economic Future in the Age of AI",
      subtitle: "A Study on Macroeconomic, Labor Market, and Industrial Structure Transformation",
      abstract:
        "AI technology heralds the most fundamental economic paradigm shift since the Industrial Revolution. This study systematically analyzes the multidimensional impact of AI on macroeconomics, labor markets, industrial structure, and income distribution.",
    },
  },
  {
    id: "sleep-cycle",
    folder: "sleep-cycle_2026-03-13",
    date: "2026-03-13",
    type: "Research Paper",
    words: 3113,
    citations: 5,
    ptcs: 75,
    diagrams: 0,
    ko: {
      title: "수면 사이클의 메커니즘과 건강에 미치는 영향",
      subtitle: "최신 연구 동향",
      abstract:
        "본 연구는 수면 사이클의 생리학적 메커니즘과 건강에 미치는 영향을 체계적으로 고찰한다. NREM과 REM 단계로 구성된 약 90분 주기의 반복 과정과 이중 조절 모델을 분석한다.",
    },
    en: {
      title: "Mechanisms of Sleep Cycles and Their Health Impact",
      subtitle: "Recent Research Trends",
      abstract:
        "This study systematically reviews the physiological mechanisms of sleep cycles and their health effects, analyzing the ~90-minute NREM-REM cycle and the dual regulatory model.",
    },
  },
];
