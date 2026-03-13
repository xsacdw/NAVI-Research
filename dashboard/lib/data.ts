export interface SectionContent {
  heading: string;
  content: string;
}

export interface FigureContent {
  src: string;
  caption: string;
  afterSection?: number;
}

export interface LocalizedContent {
  title: string;
  subtitle?: string;
  abstract: string;
  sections?: SectionContent[];
  references?: string[];
  figures?: FigureContent[];
}

export interface Session {
  id: string;
  date: string;
  type: "Literature Review" | "Research Paper" | "Report";
  words: number;
  citations: number;
  ptcs: number;
  diagrams: number;
  // Localized content
  ko: LocalizedContent;
  en: LocalizedContent;
}

export const sessions: Session[] = [
  {
    id: "future-tech-society",
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
];

// Full session data with localized content
export const sessionDetails: Record<string, Session> = {
  "future-tech-society": {
    ...sessions[0],
    ko: {
      title: "미래 기술 혁신이 사회 구조에 미치는 영향",
      subtitle: "AI, 6G, 바이오 기술을 중심으로",
      abstract:
        "본 연구는 인공지능(AI), 6G 통신, 바이오 기술 등 미래 핵심 기술이 사회 구조에 미치는 영향을 다층적으로 분석한다. 최근 5년간 발표된 주요 문헌을 체계적으로 검토하여, 기술 발전이 의료·노동시장·교육·거버넌스·환경 분야에 가져올 변화를 정리하고, 정책적 대응 방향을 제시한다.",
      sections: [
        {
          heading: "1. 서론",
          content:
            "21세기 기술 혁신의 속도는 전례 없는 수준에 이르렀다. 인공지능(AI), 사물인터넷(IoT), 6G 통신, 양자컴퓨팅, 바이오 기술 등 파괴적 기술이 동시다발적으로 발전하면서, 이들이 사회 구조에 미치는 영향은 과거 어떤 산업 혁명보다도 광범위하고 심대할 것으로 전망된다.\n\n특히 AI 기술은 의료 진단, 자율주행, 금융 분석, 교육 개인화 등 거의 모든 산업 분야에 침투하고 있으며, 2030년까지 전 세계 GDP의 14%($15.7조)를 추가로 창출할 것으로 예측된다 (Dhar et al., 2024).",
        },
        {
          heading: "2. 기술 동인 분석",
          content:
            "AI 기술의 발전은 크게 세 가지 축으로 진행되고 있다. 첫째, 대규모 언어 모델(LLM)의 등장으로 자연어 처리, 코드 생성, 과학적 추론 등의 영역에서 인간 수준의 성능이 달성되고 있다. 둘째, 자율 에이전트 기술은 AI가 단순 응답을 넘어 환경을 인식하고 목표를 달성하기 위해 자율적으로 행동하는 단계로 진화하고 있다.\n\n6G 통신 기술은 테라헤르츠(THz) 대역을 활용하여 1Tbps 이상의 전송 속도를 구현하고, 0.1ms 이하의 초저지연을 달성할 것으로 전망된다 (You et al., 2023).\n\n유전체 편집(CRISPR), mRNA 백신 플랫폼, AI 기반 신약 개발 등의 바이오 기술은 정밀 의학의 시대를 열고 있다.",
        },
        {
          heading: "3. 사회적 영향 분석",
          content:
            "AI 기반 의료 시스템은 진단 정확도 향상, 개인 맞춤 치료, 의료 접근성 개선의 세 가지 차원에서 혁신을 가져오고 있다.\n\nOECD 추정에 따르면 선진국 일자리의 약 14%가 자동화에 의해 직접적으로 대체될 위험에 처해 있으며, 추가 32%가 상당한 수준의 변화를 겪을 것으로 예상된다.\n\n디지털 전환 시대의 교육은 '무엇을 아는가'에서 '어떻게 배우는가'로의 패러다임 전환을 요구한다.",
        },
        {
          heading: "4. 기술-사회 역학 프레임워크",
          content:
            "본 연구는 미래 기술의 사회적 영향을 체계적으로 분석하기 위한 '기술-사회 역학 프레임워크'를 제안한다. 이 프레임워크는 세 가지 기둥으로 구성된다: 기술 동인(AI, 6G, 바이오, 양자), 사회 영향 영역(의료, 노동, 교육, 거버넌스, 환경), 정책 대응(규제, 디지털 리터러시, 윤리 프레임워크, 국제 협력).",
        },
        {
          heading: "5. 결론 및 제언",
          content:
            "AI와 자동화는 노동 시장의 구조적 변화를 촉발하되, 적절한 재교육 시스템이 수반될 경우 순고용 효과는 긍정적일 수 있다. 6G와 초연결 기술은 의료·교육 접근성을 혁신적으로 개선할 잠재력을 보유하나, 디지털 격차 확대의 위험도 동시에 존재한다.",
        },
      ],
      figures: [
        {
          src: "/figures/future-tech-society_fig1.png",
          caption: "Figure 1. 기술-사회 역학 프레임워크: 기술 동인, 사회 영향, 정책 대응의 3축 구조",
          afterSection: 3,
        },
      ],
      references: [
        "Burton, M.J., et al. (2021). The Lancet Global Health Commission on Global Eye Health. The Lancet Global Health, 9(4).",
        "Dhar, T., et al. (2024). Leveraging AI for sustainable development. Frontiers in AI.",
        "Haenlein, M. & Kaplan, A. (2019). A Brief History of AI. California Management Review, 61(4).",
        "Jobin, A., et al. (2022). Ethical principles for AI in education. EAIT.",
        "You, X., et al. (2023). On the Road to 6G. IEEE COMST, 25(1).",
        "Yurtsever, E., et al. (2020). A Survey of Autonomous Driving. IEEE Access, 8.",
      ],
    },
    en: {
      title: "Impact of Future Technology Innovation on Social Structures",
      subtitle: "Focusing on AI, 6G, and Biotechnology",
      abstract:
        "This study conducts a multi-layered analysis of the impact of key future technologies—AI, 6G communications, and biotechnology—on social structures. By systematically reviewing major publications from the past five years, it summarizes the changes that technological advances will bring to healthcare, labor markets, education, governance, and the environment, and proposes policy directions.",
      sections: [
        {
          heading: "1. Introduction",
          content:
            "The pace of technological innovation in the 21st century has reached unprecedented levels. As disruptive technologies—AI, IoT, 6G communications, quantum computing, and biotechnology—advance simultaneously, their impact on social structures is expected to be broader and more profound than any previous industrial revolution.\n\nAI technology in particular is penetrating virtually every industry, from medical diagnostics and autonomous driving to financial analysis and personalized education, and is projected to generate an additional 14% ($15.7 trillion) of global GDP by 2030 (Dhar et al., 2024).",
        },
        {
          heading: "2. Technology Driver Analysis",
          content:
            "AI technology is advancing along three major axes. First, the emergence of Large Language Models (LLMs) has achieved human-level performance in natural language processing, code generation, and scientific reasoning. Second, autonomous agent technology is evolving AI beyond simple responses to a stage where it perceives environments and acts autonomously to achieve goals.\n\n6G communication technology is expected to utilize terahertz (THz) bands to achieve transmission speeds exceeding 1Tbps and ultra-low latency below 0.1ms (You et al., 2023).\n\nBiotechnologies including genome editing (CRISPR), mRNA vaccine platforms, and AI-based drug discovery are ushering in an era of precision medicine.",
        },
        {
          heading: "3. Social Impact Analysis",
          content:
            "AI-based healthcare systems are driving innovation across three dimensions: improved diagnostic accuracy, personalized treatment, and enhanced healthcare accessibility.\n\nAccording to OECD estimates, approximately 14% of jobs in advanced economies are at direct risk of automation, with an additional 32% expected to undergo significant changes.\n\nEducation in the digital transformation era demands a paradigm shift from 'what you know' to 'how you learn'.",
        },
        {
          heading: "4. Technology-Society Dynamics Framework",
          content:
            "This study proposes a 'Technology-Society Dynamics Framework' for systematically analyzing the social impacts of future technologies. The framework consists of three pillars: Technology Drivers (AI, 6G, Bio, Quantum), Social Impact Domains (Healthcare, Labor, Education, Governance, Environment), and Policy Responses (Regulation, Digital Literacy, Ethics Frameworks, International Cooperation).",
        },
        {
          heading: "5. Conclusions and Recommendations",
          content:
            "While AI and automation will trigger structural changes in labor markets, net employment effects can be positive if accompanied by appropriate retraining systems. 6G and hyper-connectivity technologies hold the potential to revolutionize access to healthcare and education, though the risk of widening the digital divide simultaneously exists.",
        },
      ],
      figures: [
        {
          src: "/figures/future-tech-society_fig1.png",
          caption: "Figure 1. Technology-Society Dynamics Framework: Three-pillar structure of Technology Drivers, Social Impact, and Policy Response",
          afterSection: 3,
        },
      ],
      references: [
        "Burton, M.J., et al. (2021). The Lancet Global Health Commission on Global Eye Health. The Lancet Global Health, 9(4).",
        "Dhar, T., et al. (2024). Leveraging AI for sustainable development. Frontiers in AI.",
        "Haenlein, M. & Kaplan, A. (2019). A Brief History of AI. California Management Review, 61(4).",
        "Jobin, A., et al. (2022). Ethical principles for AI in education. EAIT.",
        "You, X., et al. (2023). On the Road to 6G. IEEE COMST, 25(1).",
        "Yurtsever, E., et al. (2020). A Survey of Autonomous Driving. IEEE Access, 8.",
      ],
    },
  },
  "llm-agents-survey": {
    ...sessions[1],
    ko: {
      title: "LLM 기반 자율 에이전트에 대한 서베이",
      subtitle: "아키텍처, 협업, 응용",
      abstract:
        "본 서베이는 LLM 기반 자율 에이전트의 아키텍처와 협업 패턴을 검토하며, 프로파일링, 메모리, 계획, 행동 모듈을 다룬다.",
      sections: [
        {
          heading: "1. 서론",
          content: "대규모 언어 모델은 인공지능의 지형을 변화시켰다. 본 서베이는 LLM 기반 자율 에이전트의 신흥 분야를 체계적으로 검토한다.",
        },
        {
          heading: "2. 에이전트 아키텍처",
          content: "일반적인 아키텍처는 프로파일링, 메모리, 계획, 행동의 네 가지 모듈로 구성된다. 각 모듈은 자율적 행동을 가능하게 하는 데 중요한 역할을 한다.",
        },
      ],
      figures: [
        { src: "/figures/llm-agents_fig1.png", caption: "Figure 1. LLM 기반 에이전트 아키텍처: 프로파일링, 메모리, 계획, 행동 모듈", afterSection: 1 },
        { src: "/figures/llm-agents_fig2.png", caption: "Figure 2. 멀티 에이전트 협업 패턴", afterSection: 1 },
      ],
      references: [
        "Wang, L., et al. (2023). A Survey on LLM-based Autonomous Agents. arXiv:2308.11432.",
        "Park, J.S., et al. (2023). Generative Agents. arXiv:2304.03442.",
      ],
    },
    en: {
      title: "A Survey on LLM-based Autonomous Agents",
      subtitle: "Architecture, Collaboration, and Applications",
      abstract:
        "This survey reviews the architecture and collaboration patterns of LLM-based autonomous agents, covering profiling, memory, planning, and action modules.",
      sections: [
        {
          heading: "1. Introduction",
          content: "Large Language Models have transformed the landscape of artificial intelligence. This survey systematically reviews the emerging field of LLM-based autonomous agents.",
        },
        {
          heading: "2. Agent Architecture",
          content: "The typical architecture consists of four modules: Profiling, Memory, Planning, and Action. Each module plays a crucial role in enabling autonomous behavior.",
        },
      ],
      figures: [
        { src: "/figures/llm-agents_fig1.png", caption: "Figure 1. LLM-based Agent Architecture: Profiling, Memory, Planning, and Action modules", afterSection: 1 },
        { src: "/figures/llm-agents_fig2.png", caption: "Figure 2. Multi-Agent Collaboration Patterns", afterSection: 1 },
      ],
      references: [
        "Wang, L., et al. (2023). A Survey on LLM-based Autonomous Agents. arXiv:2308.11432.",
        "Park, J.S., et al. (2023). Generative Agents. arXiv:2304.03442.",
      ],
    },
  },
};
