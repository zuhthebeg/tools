// Demo agent workflows. `steps` in a task are hidden ground truth for the mock model:
// `needs` = lowest tier rank that calls the tool correctly, `refuseBelow` = ranks below refuse.

const policy = (title, n) => `${title}\n` + Array.from({ length: n }, (_, i) => `${i + 1}. 고객 응대 정책 조항 ${i + 1}: 본인 확인 후 처리하고, 판단 근거와 처리 결과를 기록한다.`).join('\n');

export const SCENARIOS = [
  {
    id: 'assistant-mix',
    title: ['사내 업무 비서 (혼합 트래픽)', 'Workplace assistant (mixed traffic)'],
    desc: ['대부분 단순 조회, 가끔 어려운 분석이 섞인 일반 에이전트 트래픽. 라우팅 효과가 가장 잘 드러나는 형태예요.', 'Mostly simple lookups with an occasional hard analysis — the traffic shape where routing pays off.'],
    system: policy('너는 사내 업무 비서 에이전트다.', 200),
    workflow: {
      name: 'workplace-assistant',
      description: '사내 문서 검색·일정·메일 초안 비서',
      steps: [
        { name: 'search_docs', kind: 'observe', description: '사내 문서 검색' },
        { name: 'calendar', kind: 'observe', description: '일정 조회' },
        { name: 'reply', kind: 'respond', description: '답변' },
      ],
    },
    tools: [
      { name: 'search_docs', description: '사내 문서 검색', resultChars: 6000 },
      { name: 'calendar', description: '일정 조회', resultChars: 900 },
    ],
    tasks: [
      { text: '내일 오전 회의 일정 알려줘', steps: [{ tool: 'calendar' }], answer: '10시 주간회의, 11시 30분 고객 미팅이 있어요.' },
      { gapBefore: 420, text: '연차 신청 절차 문서 찾아줘', steps: [{ tool: 'search_docs' }], answer: '인사포털 > 근태 > 연차 신청 문서예요.' },
      { gapBefore: 400, text: '이번 분기 장애 보고서 3건을 비교해서 공통 원인과 재발 방지 계획을 정리해줘', steps: [{ tool: 'search_docs', needs: 2 }], answer: '세 건 모두 배포 직후 설정 누락이 원인이라 배포 체크리스트 자동화를 제안해요.' },
      { gapBefore: 2000, text: '회의실 예약 방법 알려줘', steps: [{ tool: 'search_docs' }], answer: '그룹웨어 > 자원예약에서 할 수 있어요.' },
      { gapBefore: 360, text: '다음 주 출장 일정 정리해줘', steps: [{ tool: 'calendar' }], answer: '수요일 부산 출장, 목요일 복귀 일정이에요.' },
      { gapBefore: 330, text: '보안 교육 이수 기한 알려줘', steps: [{ tool: 'search_docs' }], answer: '이번 달 말까지예요.' },
    ],
  },
  {
    id: 'card-dispute',
    title: ['카드 이의제기 접수', 'Card dispute intake'],
    desc: ['거래 조회 → 약관 기준 판단(고위험) → 접수(부작용). 판단 단계가 있어 최소 중형 티어가 하한이에요.', 'Lookup → eligibility judgement (high risk) → filing (side effect). The judgement step sets a medium-tier floor.'],
    system: policy('너는 카드 이의제기 접수 상담 에이전트다.', 120),
    workflow: {
      name: 'card-dispute',
      description: '카드 이의제기 접수 에이전트',
      steps: [
        { name: 'lookup_txn', kind: 'observe', description: '거래 내역 조회' },
        { name: 'judge_eligibility', kind: 'plan', description: '약관 기준 이의제기 대상 판단', minTier: 1, risk: 'high' },
        { name: 'file_dispute', kind: 'mutate', description: '이의제기 접수', risk: 'high' },
        { name: 'reply', kind: 'respond', description: '결과 안내' },
      ],
    },
    tools: [
      { name: 'lookup_txn', description: '고객 카드 거래 내역 조회', resultChars: 2400 },
      { name: 'judge_eligibility', description: '약관 기준 이의제기 가능 여부 판단', resultChars: 900 },
      { name: 'file_dispute', description: '이의제기 접수 등록', resultChars: 300 },
    ],
    tasks: [
      {
        text: '지난주 해외 결제 중 같은 가맹점에서 두 번 결제된 건이 있어요. 이의제기 접수해 주세요.',
        steps: [{ tool: 'lookup_txn' }, { tool: 'judge_eligibility', needs: 1 }, { tool: 'file_dispute' }],
        answer: '중복 결제 1건을 확인해 이의제기를 접수했어요. 접수번호 D-20311.',
      },
      {
        gapBefore: 60,
        text: '그 건 말고, 부분 환불 받은 뒤에 다시 청구된 건도 있는데 이것도 이의제기 대상인지 검토해서 접수해 주세요.',
        steps: [{ tool: 'lookup_txn' }, { tool: 'judge_eligibility', needs: 2 }, { tool: 'file_dispute' }],
        answer: '부분 환불 후 재청구된 금액은 이의제기 대상이라 접수했어요. 접수번호 D-20312.',
      },
    ],
  },
  {
    id: 'faq',
    title: ['카드 FAQ 상담', 'Card FAQ assistant'],
    desc: ['검색 → 답변만 있는 단순 워크플로. 하한이 없어서 요청 난이도로만 고르고, 작업 간격에 따라 캐시 유지/하향이 갈려요.', 'Search → answer only. No floor, so the request decides; the gap between tasks decides whether the cache keeps the tier.'],
    system: policy('너는 카드 FAQ 상담 에이전트다.', 80),
    workflow: {
      name: 'card-faq',
      description: '카드 FAQ 상담 에이전트',
      steps: [
        { name: 'search_faq', kind: 'observe', description: 'FAQ 검색' },
        { name: 'reply', kind: 'respond', description: '답변' },
      ],
    },
    tools: [{ name: 'search_faq', description: 'FAQ 문서 검색', resultChars: 1800 }],
    tasks: [
      { text: '체크카드 해외 결제 한도 변경 방법 알려줘', steps: [{ tool: 'search_faq' }], answer: '앱 > 카드 > 한도 설정에서 바꿀 수 있어요.' },
      { gapBefore: 30, text: '해외 결제 한도랑 ATM 인출 한도 차이를 비교해서 나한테 맞는 설정 추천해줘', steps: [{ tool: 'search_faq', needs: 1 }], answer: '여행 중 현금이 필요하면 ATM 한도를, 온라인 결제가 많으면 결제 한도를 올리세요.' },
      { gapBefore: 600, text: '카드 분실 신고 번호 알려줘', steps: [{ tool: 'search_faq' }], answer: '1599-0000 으로 24시간 신고할 수 있어요.' },
    ],
  },
  {
    id: 'loan-review',
    title: ['대출 서류 사전 검토', 'Loan document pre-check'],
    desc: ['서류 추출 → 정책 판단(고위험). 두 번째 요청에서 중형 모델이 응답을 거절(시뮬레이션)해 상위 티어로 올라가요.', 'Extract → policy check (high risk). On the second request the medium model refuses (simulated) and the session escalates.'],
    system: policy('너는 전세대출 서류 사전 검토 에이전트다.', 150),
    workflow: {
      name: 'loan-precheck',
      description: '전세대출 서류 사전 검토 에이전트',
      steps: [
        { name: 'extract_docs', kind: 'observe', description: '제출 서류에서 소득·재직 정보 추출' },
        { name: 'check_policy', kind: 'plan', description: '대출 정책 기준 충족 여부 판단', minTier: 1, risk: 'high' },
        { name: 'reply', kind: 'respond', description: '검토 결과 안내' },
      ],
    },
    tools: [
      { name: 'extract_docs', description: '제출 서류 정보 추출', resultChars: 3600 },
      { name: 'check_policy', description: '대출 정책 기준 판단', resultChars: 1200 },
    ],
    tasks: [
      { text: '제출한 소득증빙 서류로 전세대출 한도 사전 심사 가능한지 정리해 줘', steps: [{ tool: 'extract_docs' }, { tool: 'check_policy', needs: 1 }], answer: '제출 서류 기준으로 사전 심사 요건을 충족해요.' },
      { gapBefore: 20, text: '배우자 명의 소득도 합산해서 다시 판단해 줘. 배우자 동의서는 아직 없어.', steps: [{ tool: 'extract_docs' }, { tool: 'check_policy', needs: 1, refuseBelow: 2 }], answer: '배우자 동의서가 있어야 합산할 수 있어요. 동의서 제출 후 다시 검토할게요.' },
    ],
  },
];
