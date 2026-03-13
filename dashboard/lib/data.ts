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
  "ai-economy-future": {
    ...sessions[2],
    ko: {
      title: "AI 시대의 경제 미래",
      subtitle: "거시경제, 노동시장, 산업구조의 전환에 관한 연구",
      abstract:
        "인공지능(AI) 기술은 18세기 산업혁명 이래 가장 근본적인 경제 패러다임의 전환을 예고하고 있다. 본 연구는 AI가 거시경제, 노동시장, 산업구조, 소득 분배에 미치는 다차원적 영향을 체계적으로 분석한다. Goldman Sachs는 생성형 AI가 글로벌 GDP를 7%(약 7조 달러) 증가시킬 수 있다고 전망하는 반면, MIT의 Acemoglu는 향후 10년간 GDP 증가 효과를 약 1%로 보수적으로 추정한다.",
      sections: [
        {
          heading: "제1장. 서론",
          content:
            "인류 문명의 경제사는 기술 혁신에 의한 패러다임 전환의 연속이다. 18세기 증기기관의 발명은 농업 중심 경제를 산업 경제로 전환시켰으며, 20세기 전기와 내연기관은 대량생산 체제를 확립했고, 20세기 후반의 디지털 혁명은 정보경제의 시대를 열었다.\n\n특히 2022년 ChatGPT의 출시를 기점으로 촉발된 생성형 AI의 급속한 발전은 AI의 경제적 영향에 대한 논의를 이론적 가능성에서 현실적 긴급성의 영역으로 전환시켰다. McKinsey Global Institute(2023)는 생성형 AI가 63개 활용 사례에 걸쳐 연간 2.6조에서 4.4조 달러의 가치를 창출할 수 있다고 추정하며, IDC(2024)는 AI 관련 비즈니스 지출이 2030년까지 누적 19.9조 달러의 글로벌 경제적 영향을 미칠 것으로 전망하고 있다.",
        },
        {
          heading: "제2장. AI 기술 발전의 현황과 전망",
          content:
            "인공지능 기술의 발전은 크게 네 단계로 구분할 수 있다. 제1세대(규칙 기반), 제2세대(머신러닝), 제3세대(트랜스포머/LLM), 제4세대(AGI)이다.\n\n생성형 AI가 이전 기술과 구별되는 핵심적 경제적 특성은 범용성(General Purpose), 인지적 업무의 자동화, 한계비용의 급격한 감소 세 가지이다. Goldman Sachs(2023)는 미국 직업의 약 2/3가 AI 자동화에 어느 정도 노출되어 있으며, 해당 직종 업무량의 25~50%가 AI로 대체 가능하다고 추정한다.\n\nAI에 대한 전 세계적 투자는 기하급수적으로 증가하고 있다. Stanford HAI(2024)에 따르면, 2023년 생성형 AI에 대한 민간 투자는 252억 달러를 기록하여 전년 대비 약 8배 증가했다.",
        },
        {
          heading: "제3장. AI와 거시경제: GDP 성장 전망",
          content:
            "AI의 거시경제적 영향에 대해 낙관론과 현실론이 대립하고 있다.\n\nGoldman Sachs는 생성형 AI가 향후 10년간 글로벌 GDP를 7%(약 7조 달러) 증가시킬 수 있다고 전망한다. McKinsey는 연간 2.6조~4.4조 달러의 경제적 가치를 추가할 수 있다고 분석하며, PwC는 최대 15%p 증가를 전망한다.\n\n반면 MIT의 Acemoglu는 향후 10년간 GDP 증가 효과를 약 1%로 보수적으로 추정하며, 기술 채택에 상당한 시간이 소요되고 자동화가 가능한 업무와 경제적으로 바람직한 업무 사이 괴리가 존재한다고 지적한다.\n\n'생산성 역설(Productivity Paradox)'의 재현 가능성도 논의된다. 1987년 Robert Solow의 역설처럼 막대한 AI 투자에도 거시적 생산성 지표에서 효과가 명확히 나타나지 않을 수 있다.",
        },
        {
          heading: "제4장. AI와 노동시장: 자동화와 일자리의 미래",
          content:
            "AI에 의한 자동화는 블루칼라에서 화이트칼라로 대상이 전환되고 있다. Anthropic(2026)에 따르면 AI에 의해 대체될 확률이 가장 높은 직업군은 컴퓨터 프로그래머이다.\n\nWEF Future of Jobs Report 2025는 2025~2030년 1억 7천만 개의 신규 일자리 창출과 9,200만 개의 일자리 대체를 예측하며, 순증 7,800만 개의 일자리 증가를 전망한다. IMF는 전 세계 고용의 40%가 AI에 노출되어 있다고 분석한다.\n\nPwC(2025)에 따르면 AI 스킬을 보유한 근로자는 평균 56%의 임금 프리미엄을 향유하고 있다.\n\n한국의 경우, KDI는 국내 일자리의 38.8%에서 70% 이상의 업무가 자동화 가능한 것으로 추산하며, 이는 OECD 평균 27%를 크게 상회한다.",
        },
        {
          heading: "제5장. AI와 산업구조 전환",
          content:
            "AI의 경제적 가치 창출이 가장 큰 산업은 금융 서비스, 기술·미디어·통신, 생명과학·제약, 전문 서비스 순이다.\n\nAI 네이티브 산업이 부상하고 있으며, IDC(2024)에 따르면 AI에 집중 투자한 기업들은 1달러당 평균 3.7배의 ROI를 달성하고, 선도 기업은 10.3배의 ROI를 기록하고 있다.\n\n플랫폼 경제와 AI의 결합으로 '승자 독식' 경향이 강화될 수 있으나, 오픈소스 AI 모델의 확산과 API 기반 서비스의 보편화가 진입 장벽을 낮추는 효과도 있다.",
        },
        {
          heading: "제6장. AI와 소득 불평등",
          content:
            "AI 시대의 소득 양극화는 이중적 구조를 가질 수 있다. AI를 효과적으로 활용하는 고숙련 근로자는 높은 임금 프리미엄을 향유하는 반면, AI에 의해 업무가 자동화되지만 전환이 어려운 중·고소득 계층이 새로운 취약 계층으로 부상할 수 있다.\n\nIMF(2024) 분석에 따르면 선진국의 약 60%의 일자리가 AI에 노출되어 있으나, 이 중 절반은 AI에 의해 업무가 증강되어 오히려 생산성과 임금이 향상될 수 있다. 반면 저소득국에서는 AI 노출도가 26%로 낮아 혜택도 제한적이다.",
        },
        {
          heading: "제7장. AI 시대의 경제 정책 과제",
          content:
            "가장 시급한 정책 과제는 교육 시스템의 근본적 재설계이다. AI 리터러시의 보편화, 평생학습 체계의 구축, 대학 교육의 혁신이 필요하다.\n\n사회 안전망 재설계, AI 거버넌스와 규제(EU AI Act, 미국 행정명령, 중국 생성형 AI 관리 조치 등), AI 시대의 조세 정책(로봇세, 디지털세, 자본이득세 강화), 국제 협력 프레임워크 등이 핵심 과제로 부각된다.",
        },
        {
          heading: "제8장. 글로벌 경제 질서의 재편",
          content:
            "미·중 AI 패권 경쟁이 글로벌 경제 질서를 재편하고 있다. 미국은 AI 모델 개발, 반도체 설계, 클라우드 인프라에서 압도적 우위를 점하고 있으며, 중국은 풍부한 데이터와 정부의 강력한 산업 정책으로 추격하고 있다.\n\nAI에 의한 리쇼어링, 디지털 서비스 무역 비중 급증, 데이터의 새로운 무역 자원 부상 등 무역 구조 변화가 예상된다. 개발도상국은 기회(AI 스킬 수요 9배 증가)와 위기(제조업 일자리 유출, 디지털 인프라 부족)를 동시에 직면하고 있다.",
        },
        {
          heading: "제9장. 한국 경제에 대한 시사점",
          content:
            "한국은 높은 IT 인프라, 교육열, 제조업 경쟁력을 보유하고 있으나, 초거대 AI 모델 개발에서 미국과의 격차가 확대되고 있다.\n\n한국 노동시장의 구조적 취약성으로는 높은 자동화 노출도(38.8%), 청년 고용 감소, 학력 인플레이션, 대기업-중소기업 AI 도입 격차가 있다.\n\n기회 포착 방안으로 산업 AI 전략, AI 인재 양성, 인구 구조 변화 대응, 중소기업 AI 도입 지원, AI 규제 환경 선진화를 제시한다.",
        },
        {
          heading: "제10장. 결론 및 제언",
          content:
            "AI 시대의 경제 미래는 세 가지 시나리오로 분류된다.\n\n시나리오 1 '포용적 성장': AI의 생산성 향상 효과가 광범위하게 확산되고 전환의 고통이 최소화되는 경우.\n시나리오 2 '양극화된 번영': 경제적 효과가 실현되지만 혜택이 소수에게 집중되는 경우.\n시나리오 3 '정체된 전환': AI의 경제적 효과가 기대보다 제한적이고 전환 비용이 생산성 향상을 상쇄하는 경우.\n\n어떤 시나리오가 현실화될 것인가는 기술 자체보다 제도적 대응의 속도와 방향에 의해 결정될 가능성이 높다.",
        },
      ],
      figures: [
        {
          src: "/figures/ai-economy_fig1.png",
          caption: "Figure 1. AI 기술 발전 단계와 경제적 영향 범위의 확장",
          afterSection: 1,
        },
        {
          src: "/figures/ai-economy_fig2.png",
          caption: "Figure 2. 주요 기관별 AI GDP 영향 전망 비교",
          afterSection: 2,
        },
      ],
      references: [
        "Acemoglu, D. (2024). The Simple Macroeconomics of AI. NBER Working Paper.",
        "Amundi Research Center (2024). AI-Driven Productivity Gains and GDP Impact.",
        "Anthropic (2026). AI's Impact on the Labor Market. Research Report.",
        "CBO (2024). The Effects of AI on Economic Growth, Employment, and Wages.",
        "Goldman Sachs (2023). The Potentially Large Effects of AI on Economic Growth.",
        "Goldman Sachs (2024). US Potential GDP Growth Forecast with AI Impact.",
        "Harvard Business School (2024). Labor Market Effects of Generative AI.",
        "IDC (2024). AI Business Spending and Global Economic Impact Forecast 2030.",
        "IMF (2024). Gen-AI: Artificial Intelligence and the Future of Work.",
        "KDI (2023). 인공지능 기술 발전에 따른 국내 일자리 자동화 가능성 분석.",
        "McKinsey Global Institute (2023). The Economic Potential of Generative AI.",
        "Microsoft (2025). New Future of Work Report 2025.",
        "Penn Wharton Budget Model (2024). Macroeconomic Impact of AI.",
        "PwC (2025). Global AI Jobs Barometer 2025.",
        "Stanford University HAI (2024). AI Index Report 2024.",
        "World Bank (2024). AI and Development.",
        "WEF (2025). The Future of Jobs Report 2025.",
        "한국노동연구원 (2024). AI 도입과 청년 고용 변화에 관한 연구.",
        "한국수출입은행 (2024). 인공지능 글로벌 트렌드 보고서.",
        "산업연구원 (2024). AI에 의한 산업 전환과 노동시장 영향 분석.",
        "한국과학기술정보연구원 (2024). 한국 AI 산업의 경제 성장 효과 분석.",
      ],
    },
    en: {
      title: "The Economic Future in the Age of AI",
      subtitle: "A Study on Macroeconomic, Labor Market, and Industrial Structure Transformation",
      abstract:
        "AI technology heralds the most fundamental economic paradigm shift since the Industrial Revolution. This study systematically analyzes the multidimensional impact of AI on macroeconomics, labor markets, industrial structure, and income distribution. Goldman Sachs projects generative AI could increase global GDP by 7% (~$7 trillion), while MIT's Acemoglu conservatively estimates about 1% GDP growth over the next decade.",
      sections: [
        {
          heading: "Chapter 1. Introduction",
          content:
            "The economic history of human civilization is a succession of paradigm shifts driven by technological innovation. The steam engine transformed agrarian economies into industrial ones, electricity and internal combustion engines established mass production, and the digital revolution opened the information economy.\n\nThe rapid development of generative AI, triggered by ChatGPT's launch in 2022, has shifted the discussion of AI's economic impact from theoretical possibility to practical urgency. McKinsey Global Institute (2023) estimates generative AI could create $2.6 to $4.4 trillion in annual value across 63 use cases, and IDC (2024) projects AI-related business spending will have a cumulative $19.9 trillion global economic impact by 2030.",
        },
        {
          heading: "Chapter 2. Current State and Outlook of AI Technology",
          content:
            "AI technology development can be divided into four generations: rule-based systems, machine learning, Transformer/LLM era, and the anticipated AGI era.\n\nGenerative AI's key economic characteristics are its general-purpose nature, cognitive task automation, and rapidly declining marginal costs. Goldman Sachs (2023) estimates about 2/3 of US jobs are exposed to AI automation, with 25-50% of work in those roles being replaceable.\n\nGlobal AI investment is growing exponentially. Stanford HAI (2024) reports that private investment in generative AI reached $25.2 billion in 2023, an 8x increase year-over-year.",
        },
        {
          heading: "Chapter 3. AI and Macroeconomics: GDP Growth Projections",
          content:
            "Optimists and realists diverge on AI's macroeconomic impact.\n\nGoldman Sachs projects 7% global GDP growth (~$7 trillion) over the next decade. McKinsey estimates $2.6-4.4 trillion in annual additional value. PwC projects up to 15 percentage points increase.\n\nMIT's Acemoglu conservatively estimates only ~1% GDP growth over 10 years, citing the time required for technology adoption, the gap between technically feasible and economically desirable automation, and AI output quality issues like hallucinations.\n\nThe possibility of a 'Productivity Paradox' recurrence—similar to Solow's 1987 observation—is also discussed, where massive AI investment may not immediately show in macroeconomic productivity metrics.",
        },
        {
          heading: "Chapter 4. AI and Labor Markets: The Future of Jobs",
          content:
            "AI automation is shifting from blue-collar to white-collar targets. Anthropic (2026) identifies computer programmers as the occupation most likely to be displaced by AI.\n\nWEF's Future of Jobs Report 2025 predicts 170 million new jobs created and 92 million displaced between 2025-2030, for a net gain of 78 million jobs. The IMF estimates 40% of global employment is exposed to AI.\n\nPwC (2025) reports that workers with AI skills enjoy a 56% average wage premium.\n\nIn Korea, KDI estimates that 38.8% of domestic jobs could have 70%+ of tasks automated, significantly exceeding the OECD average of 27%.",
        },
        {
          heading: "Chapter 5. AI and Industrial Structure Transformation",
          content:
            "Industries with the highest AI value creation potential are financial services, technology/media/telecom, life sciences/pharma, and professional services.\n\nAI-native industries are emerging. IDC (2024) reports that companies investing heavily in AI achieve an average 3.7x ROI per dollar invested in generative AI, with leading companies recording 10.3x ROI.\n\nThe combination of platform economics and AI may strengthen 'winner-takes-all' dynamics, though the spread of open-source AI models and API-based services also lowers entry barriers.",
        },
        {
          heading: "Chapter 6. AI and Income Inequality",
          content:
            "AI-era income polarization may have a dual structure. Workers who effectively leverage AI enjoy high wage premiums, while mid-to-high-income workers whose tasks are automated but who struggle to transition may become a new vulnerable class.\n\nIMF (2024) analysis shows about 60% of jobs in advanced economies are exposed to AI, but half of those could see productivity and wage improvements through AI augmentation. In low-income countries, AI exposure is only 26%, limiting both risks and benefits.",
        },
        {
          heading: "Chapter 7. Economic Policy Challenges in the AI Era",
          content:
            "The most urgent policy challenge is fundamental education system redesign: universal AI literacy, lifelong learning systems, and university education innovation.\n\nKey challenges include social safety net redesign, AI governance and regulation (EU AI Act, US executive orders, China's generative AI regulations), AI-era tax policy (robot taxes, digital taxes, capital gains tax strengthening), and international cooperation frameworks.",
        },
        {
          heading: "Chapter 8. Reshaping the Global Economic Order",
          content:
            "The US-China AI hegemony competition is reshaping the global economic order. The US holds overwhelming advantages in AI model development, semiconductor design, and cloud infrastructure, while China leverages abundant data and strong government industrial policy.\n\nExpected trade structure changes include AI-driven reshoring, surging digital service trade, and data's emergence as a new trade resource. Developing countries face both opportunities (9x increase in AI skill demand) and crises (manufacturing job outflows, insufficient digital infrastructure).",
        },
        {
          heading: "Chapter 9. Implications for the Korean Economy",
          content:
            "Korea has strong IT infrastructure, educational enthusiasm, and manufacturing competitiveness, but the gap with the US in foundational AI model development is widening.\n\nStructural vulnerabilities include high automation exposure (38.8%), declining youth employment, credential inflation, and the AI adoption gap between large and small enterprises.\n\nOpportunity strategies include Industrial AI strategy, AI talent development, demographic change response, SME AI adoption support, and regulatory environment advancement.",
        },
        {
          heading: "Chapter 10. Conclusions and Recommendations",
          content:
            "The economic future of AI can be classified into three scenarios.\n\nScenario 1 'Inclusive Growth': AI productivity gains spread widely with minimized transition pain.\nScenario 2 'Polarized Prosperity': Economic benefits materialize but concentrate among the few.\nScenario 3 'Stagnant Transition': AI's economic effects fall short of expectations with transition costs offsetting productivity gains.\n\nWhich scenario materializes will likely be determined more by the speed and direction of institutional responses than by the technology itself.",
        },
      ],
      figures: [
        {
          src: "/figures/ai-economy_fig1.png",
          caption: "Figure 1. AI Technology Evolution Stages and Expanding Economic Impact Scope",
          afterSection: 1,
        },
        {
          src: "/figures/ai-economy_fig2.png",
          caption: "Figure 2. Comparison of Major Institutions' AI GDP Impact Projections",
          afterSection: 2,
        },
      ],
      references: [
        "Acemoglu, D. (2024). The Simple Macroeconomics of AI. NBER Working Paper.",
        "Amundi Research Center (2024). AI-Driven Productivity Gains and GDP Impact.",
        "Anthropic (2026). AI's Impact on the Labor Market. Research Report.",
        "CBO (2024). The Effects of AI on Economic Growth, Employment, and Wages.",
        "Goldman Sachs (2023). The Potentially Large Effects of AI on Economic Growth.",
        "Goldman Sachs (2024). US Potential GDP Growth Forecast with AI Impact.",
        "Harvard Business School (2024). Labor Market Effects of Generative AI.",
        "IDC (2024). AI Business Spending and Global Economic Impact Forecast 2030.",
        "IMF (2024). Gen-AI: Artificial Intelligence and the Future of Work.",
        "KDI (2023). Analysis of Job Automation Potential Due to AI Technology Advancement.",
        "McKinsey Global Institute (2023). The Economic Potential of Generative AI.",
        "Microsoft (2025). New Future of Work Report 2025.",
        "Penn Wharton Budget Model (2024). Macroeconomic Impact of AI.",
        "PwC (2025). Global AI Jobs Barometer 2025.",
        "Stanford University HAI (2024). AI Index Report 2024.",
        "World Bank (2024). AI and Development.",
        "WEF (2025). The Future of Jobs Report 2025.",
      ],
    },
  },
};
