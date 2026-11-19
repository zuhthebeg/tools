// Demo agent workflows (internal workplace agents). `steps` in a task are hidden ground truth for
// the mock model: `needs` = lowest tier rank that calls the tool correctly, `refuseBelow` = ranks below refuse.
// Task texts deliberately include misleading cases for the rule decider (an easy request with a
// "hard" keyword, a hard request without one), so the router is not graded on its own answer key.

const policy = (title, n) => `${title}\n` + Array.from({ length: n }, (_, i) => `${i + 1}. 사내 업무 지침 ${i + 1}: 사내 시스템 권한 범위 안에서 처리하고, 근거 문서와 처리 결과를 남긴다.`).join('\n');

export const SCENARIOS = [
  {
    id: 'assistant-mix',
    title: ['사내 업무 비서 (혼합 트래픽)', 'Workplace assistant (mixed traffic)'],
    desc: ['단순 조회 위주에 가끔 어려운 요청이 섞여요. 규칙 판단이 틀리는 요청(쉬운데 "보고서"가 들어간 요청, 어려운데 키워드가 없는 요청)도 있어요.', 'Mostly lookups with occasional hard requests, including ones the rule decider misjudges.'],
    system: policy('너는 사내 업무 비서 에이전트다.', 200),
    workflow: {
      name: 'workplace-assistant',
      description: '사내 문서 검색·일정 비서',
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
      { text: '내일 오전 회의 일정 알려줘', steps: [{ tool: 'calendar' }], answer: '10시 주간회의, 11시 30분 파트 회의가 있어요.' },
      { gapBefore: 420, text: '연차 신청 절차 문서 찾아줘', steps: [{ tool: 'search_docs' }], answer: '인사포털 > 근태 > 연차 신청 문서예요.' },
      { gapBefore: 400, text: '이번 분기 장애 보고서 3건을 비교해서 공통 원인과 재발 방지 계획을 정리해줘', steps: [{ tool: 'search_docs', needs: 2 }], answer: '세 건 모두 배포 직후 설정 누락이 원인이라 배포 체크리스트 자동화를 제안해요.' },
      { gapBefore: 2000, text: '주간 보고서 양식 파일 어디 있어?', steps: [{ tool: 'search_docs' }], answer: '공유 드라이브 > 양식 > 주간보고.docx 예요.' },
      { gapBefore: 360, text: '다음 주 팀원 일정이 겹치지 않는 날로 워크숍 날짜 골라줘', steps: [{ tool: 'calendar', needs: 1 }], answer: '다음 주 목요일 오후가 전원 가능해요.' },
      { gapBefore: 330, text: '보안 교육 이수 기한 알려줘', steps: [{ tool: 'search_docs' }], answer: '이번 달 말까지예요.' },
    ],
  },
  {
    id: 'meeting-notes',
    title: ['회의록 정리·액션 아이템 공지', 'Meeting notes & action items'],
    desc: ['긴 녹취록 조회 → 액션 아이템 추출(판단) → 메신저 공지(부작용). 짧은 간격으로 후속 요청이 이어져서 모델을 바꾸면 큰 컨텍스트를 매번 다시 써요.', 'Long transcript → extract actions → post to messenger, with quick follow-ups: every switch rewrites a large context.'],
    system: policy('너는 회의록 정리 에이전트다.', 150),
    workflow: {
      name: 'meeting-notes',
      description: '회의록 정리 및 액션 아이템 공지 에이전트',
      steps: [
        { name: 'read_transcript', kind: 'observe', description: '회의 녹취록 조회' },
        { name: 'extract_actions', kind: 'plan', description: '담당자·마감일별 액션 아이템 추출', minTier: 1 },
        { name: 'post_actions', kind: 'mutate', description: '사내 메신저에 공지', risk: 'high' },
      ],
    },
    tools: [
      { name: 'read_transcript', description: '회의 녹취록 조회', resultChars: 12000 },
      { name: 'extract_actions', description: '액션 아이템 구조화', resultChars: 1500 },
      { name: 'post_actions', description: '사내 메신저 공지 등록', resultChars: 300 },
    ],
    tasks: [
      { text: '오늘 주간회의 녹취록 정리해서 액션 아이템을 담당자별로 메신저에 공지해줘', steps: [{ tool: 'read_transcript' }, { tool: 'extract_actions', needs: 1 }, { tool: 'post_actions' }], answer: '액션 아이템 7건을 담당자별로 공지했어요.' },
      { gapBefore: 90, text: '마감일 빠진 항목만 다시 확인해서 보완 공지해줘', steps: [{ tool: 'read_transcript' }, { tool: 'extract_actions', needs: 1 }, { tool: 'post_actions' }], answer: '마감일이 빠진 2건을 보완해서 공지했어요.' },
      { gapBefore: 120, text: '참석자별 발언 요약을 한 줄씩 추가해줘', steps: [{ tool: 'read_transcript' }, { tool: 'extract_actions', needs: 1 }], answer: '참석자 6명의 발언 요약을 추가했어요.' },
    ],
  },
  {
    id: 'incident-report',
    title: ['장애 회고 보고서 작성', 'Incident postmortem draft'],
    desc: ['로그 검색 → 타임라인 → 원인 분석(고위험) → 문서 작성. 처음부터 끝까지 어려운 작업이라 라우팅으로 아낄 여지가 거의 없어요.', 'Logs → timeline → root cause (high risk) → draft. Hard end to end, so routing has little to save.'],
    system: policy('너는 장애 회고 보고서 작성 에이전트다.', 150),
    workflow: {
      name: 'incident-postmortem',
      description: '장애 회고 보고서 작성 에이전트',
      steps: [
        { name: 'search_logs', kind: 'observe', description: '장애 시간대 로그 검색' },
        { name: 'build_timeline', kind: 'observe', description: '타임라인 구성' },
        { name: 'analyze_cause', kind: 'plan', description: '근본 원인 분석', minTier: 2, risk: 'high' },
        { name: 'draft_doc', kind: 'mutate', description: '위키에 보고서 초안 작성' },
      ],
    },
    tools: [
      { name: 'search_logs', description: '로그 검색', resultChars: 9000 },
      { name: 'build_timeline', description: '이벤트 타임라인 구성', resultChars: 2400 },
      { name: 'analyze_cause', description: '근본 원인 분석', resultChars: 1500 },
      { name: 'draft_doc', description: '위키 문서 작성', resultChars: 300 },
    ],
    tasks: [
      { text: '어제 결제 API 지연 장애 회고 보고서 초안 써줘', steps: [{ tool: 'search_logs' }, { tool: 'build_timeline', needs: 1 }, { tool: 'analyze_cause', needs: 2 }, { tool: 'draft_doc' }], answer: 'DB 커넥션 풀 고갈이 원인이라는 초안을 위키에 올렸어요.' },
      { gapBefore: 150, text: '재발 방지 항목에 담당 팀과 일정도 넣어줘', steps: [{ tool: 'analyze_cause', needs: 2 }, { tool: 'draft_doc' }], answer: '재발 방지 4건에 담당 팀과 일정을 넣었어요.' },
    ],
  },
  {
    id: 'weekly-report',
    title: ['주간 업무 보고 취합', 'Weekly status roll-up'],
    desc: ['티켓·문서 목록 조회 → 정리. 전부 경량 모델로 충분한 작업이라 라우터는 판단 비용만 더해요.', 'Ticket and doc lookups, then a roll-up. All of it fits the light tier; a router only adds decision cost.'],
    system: policy('너는 주간 업무 보고 취합 에이전트다.', 120),
    workflow: {
      name: 'weekly-report',
      description: '주간 업무 보고 취합 에이전트',
      steps: [
        { name: 'list_tickets', kind: 'observe', description: '이번 주 티켓 조회' },
        { name: 'list_docs', kind: 'observe', description: '이번 주 작성 문서 조회' },
        { name: 'reply', kind: 'respond', description: '보고 초안' },
      ],
    },
    tools: [
      { name: 'list_tickets', description: '이슈 트래커 티켓 조회', resultChars: 3000 },
      { name: 'list_docs', description: '위키 문서 목록 조회', resultChars: 1800 },
    ],
    tasks: [
      { text: '이번 주 내가 완료한 티켓 목록 뽑아줘', steps: [{ tool: 'list_tickets' }], answer: '완료 티켓 9건이에요.' },
      { gapBefore: 60, text: '이번 주 내가 작성한 위키 문서 목록도 뽑아줘', steps: [{ tool: 'list_docs' }], answer: '문서 4건이에요.' },
      { gapBefore: 60, text: '둘을 합쳐서 주간 보고 초안 만들어줘', steps: [{ tool: 'list_tickets' }, { tool: 'list_docs' }], answer: '완료 9건, 문서 4건으로 주간 보고 초안을 만들었어요.' },
    ],
  },
  {
    id: 'policy-qa',
    title: ['사내 규정 Q&A', 'HR / policy Q&A'],
    desc: ['규정 검색 → 답변. 가끔 비교형 질문이 섞여요. Claude는 캐시(5분)가 식으면 다시 내려가고, GPT(30분)는 유지돼요.', 'Policy search → answer with an occasional comparison. Claude (5m cache) can drop back down; GPT (30m) stays.'],
    system: policy('너는 사내 규정 안내 에이전트다.', 100),
    workflow: {
      name: 'policy-qa',
      description: '사내 규정 안내 에이전트',
      steps: [
        { name: 'search_policy', kind: 'observe', description: '사내 규정 검색' },
        { name: 'reply', kind: 'respond', description: '답변' },
      ],
    },
    tools: [{ name: 'search_policy', description: '사내 규정 문서 검색', resultChars: 1800 }],
    tasks: [
      { text: '출장비 정산 기한 알려줘', steps: [{ tool: 'search_policy' }], answer: '출장 종료 후 14일 이내예요.' },
      { gapBefore: 30, text: '육아휴직 중에 단축근무로 전환하면 급여가 어떻게 달라지는지 비교해줘', steps: [{ tool: 'search_policy', needs: 1 }], answer: '단축근무 전환 시 통상임금 비례로 지급되고 휴직급여는 중단돼요.' },
      { gapBefore: 600, text: '법인카드 분실 신고 절차 알려줘', steps: [{ tool: 'search_policy' }], answer: '재무팀 포털에서 즉시 정지 후 신고서를 제출해요.' },
    ],
  },
];
