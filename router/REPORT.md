# 일반 에이전트용 스마트 라우팅 도입 검토

작성일: 2026-11-17(11-19 개정: 시뮬레이션을 사내 업무 예시로 바꾸고 전환 손실을 반영) · 대상: 임원 보고 · 범위: Amazon Bedrock의 GPT-6 계열·Claude 5.5 계열

## 1. 요약

| 질문 | 결론 |
|---|---|
| 코딩 툴(Claude Code·Codex)에 스마트 라우터를 붙일 가치가 있나 | **낮음.** 모델이나 effort를 바꾸면 캐시가 무효화되고, 코딩 툴은 이미 자체 라우팅을 갖고 있음. 외부 라우터는 중복이고 역효과가 날 수 있음 |
| 일반 업무 에이전트에는 의미가 있나 | **조건부.** 쉬운 요청과 어려운 요청이 섞인 에이전트에서만 이득이 있음(시뮬레이션에서 사후 최저 고정 모델 대비 −5~54%). 판단 단계가 정해진 워크플로(회의록, 장애 보고서, 주간 보고)에서는 고정 모델과 같거나 7~9% 손해임. 턴마다 라우팅하면 작업이 실패하고, 임의로 전환하면 비용이 최대 7배로 늘어남 |
| 경량 모델로 충분한가 | **기본적인 툴 호출에는 충분할 것으로 보임.** GPT-6 Luna와 Claude Haiku 5.5는 툴 사용을 지원하고, 최상위 모델 대비 단가가 40~100분의 1임. 우리 업무 데이터로 검증은 필요 |
| 라우팅 서버(SDK)를 둘까 | **두지 않는다.** 서버 측 라우팅 SDK는 운영 대비 효율이 낮다고 판단함. 이득의 대부분은 워크플로별로 모델을 미리 지정하는 것(정적 지정)만으로 얻을 수 있음. 판단 엔진은 Bedrock 매니지드 기능이 나오면 그때 붙임 |
| 권고 | ① 비IT 직군의 코딩 툴 사용을 업무 에이전트로 전환 ② 워크플로별 모델 정적 지정(기본은 Luna·Haiku, 판단·고위험 단계만 상위 모델), 작업 중에는 고정하고 실패 시에만 상향 ③ 혼합 트래픽 에이전트에 한해 세션 시작 시 1회 판단을 검토 ④ 실제 로그 리플레이로 효과 측정 |

## 2. 코딩 툴에서 스마트 라우팅의 실효성이 낮은 이유

### 2-1. 모델을 바꾸면 캐시가 전부 무효화된다
- 프롬프트 캐시는 **모델 단위**로 쌓인다. AWS 문서에 *"Prompt caches are per model"*, Claude Code 문서에 *"each model has its own cache. Switching models recomputes the entire request"* 라고 명시돼 있다.
- 코딩 세션은 컨텍스트가 수십만 토큰까지 커진다. 그래서 중간에 모델을 한 번만 바꿔도 비용이 크다.
  - 예: 30만 토큰 세션을 Sonnet 5.5에서 Opus 5.5로 전환하면 캐시 쓰기 30만 × $5/M ≈ **$1.5**가 든다. 같은 세션을 Sonnet에 두고 캐시 읽기로 이어가면 1턴에 약 $0.06(30만 × $0.2/M)이므로, **약 25턴 분량**이다.
- Claude Code도 캐시가 살아 있을 때 `/model`로 모델을 바꾸려 하면 확인 창을 띄운다. 자체 기능인 `opusplan`(계획은 Opus, 실행은 Sonnet)조차 *"each plan-mode toggle is a model switch and starts a fresh cache"* 라고 경고한다.
- 턴마다 모델을 고르는 일반적인 스마트 라우터는 이 비용을 매번 치른다.

### 2-2. effort를 바꾸면 캐시가 깨지고, 모델을 낮추면 툴 맥락이 사라진다
- Claude Code 문서에 따르면 대부분의 모델은 **effort 단계마다 캐시가 따로** 쌓인다. Claude 5.5 계열은 Anthropic API에서만 캐시가 유지되고, **Amazon Bedrock에서는 effort를 바꾸면 캐시가 무효화된다.**
- Claude의 thinking 블록에는 툴 결과를 해석한 추론이 담기는데, 이 블록은 모델에 묶여 있다.
  - Haiku → Sonnet → Opus로 **올라가는 경우**에는 이전 블록을 그대로 읽는다.
  - **내려가는 경우**에는 이전 블록이 버려진다(`model_binding_mismatch`). 요청은 성공하지만, 앞선 툴 호출에서 쌓은 추론의 연속성이 끊긴다.
- 대화 기록을 고치는 방식의 라우팅(요약, 리마인더 삽입)도 Bedrock에서 400 오류를 내거나 캐시를 깬다.

### 2-3. 코딩 툴은 이미 자체 라우팅을 갖고 있다

| 기능 | Claude Code | Codex |
|---|---|---|
| 단계별 모델 | `opusplan`(계획 Opus, 실행 Sonnet), advisor tool(어려운 순간에 상위 모델에 자문. Bedrock에서는 미지원) | 모델과 reasoning effort 프리셋(Luna Low부터 Astra Extra high까지) |
| 하위 에이전트 | 서브에이전트마다 모델 지정(`model: haiku`), 전체 강제(`CLAUDE_CODE_SUBAGENT_MODEL`) | 서브에이전트마다 `model`·`model_reasoning_effort` 지정. 문서 예시: "`gpt-6-luna` for fast scans" |
| 리뷰 | `/code-review`, 멀티에이전트 ultrareview, PR 자동 리뷰 | `review_model` 별도 지정, 클라우드 자동 리뷰 |
| 장애·안전 | fallback 모델 체인, auto mode 분류기(별도 모델) | Fast/Ultrafast 모드 |
| 관리 | `availableModels`, 조직 기본 모델, `maxEffortLevel`, 지출 한도 | 관리형 설정(`requirements.toml`), 워크스페이스별 모델 허용 |

- 툴 내부에서 이미 "어느 단계에 어떤 모델을 쓸지"를 결정한다. 그 바깥에 라우터를 하나 더 두면 **판단이 이중으로 이루어지고**, 툴이 의도한 캐시 전략과 충돌한다.
- 중간에 프록시 라우터를 끼우는 것도 위험하다. Claude Code 문서에 따르면 게이트웨이가 캐시 마커를 지우면 *"your entire conversation history bills as uncached input on every turn"*, 즉 매 턴 전체 대화가 캐시 없이 과금된다.

### 2-4. 코딩 트래픽은 라우팅으로 얻을 것이 적다
- 세션이 길고 컨텍스트가 크며 대부분 어려운 작업이다. 작은 모델로 잘못 보내면 잘못된 코드, 재작업, 리뷰 비용이 생기고, 이 비용이 토큰 절감분보다 크다.
- Anthropic이 밝힌 기업 평균 비용은 개발자 1인당 활동일 약 $13, 월 $150~250이다. 개발자 인건비에 비하면 작아서 품질을 낮춰가며 아낄 대상이 아니다.
- 공개된 코딩 라우팅 수치(NVIDIA Switchyard, DeepSWE 벤치마크: 정답률 −1.4%p에 비용 −35%)는 툴 벤더가 라우팅을 **내부에 통합했을 때**의 결과다. 우리가 바깥에서 붙여서 재현할 수 있는 구조가 아니다.

## 3. 일반 업무 에이전트용 모델 공급으로 전환해야 하는 이유

### 3-1. 트래픽 구조와 워크플로를 미리 알 수 있다
- 사내 업무 에이전트(문서 검색, 일정, 규정 Q&A, 회의록, 보고서)는 **짧은 작업이 대부분**이고, 어떤 단계가 있는지 미리 정해져 있다.
- 업무 흐름이 미리 정해져 있어서 첫 요청만으로 판단해야 하는 약점을 **워크플로 정보로 보완**할 수 있다. 예: "액션 아이템 추출 단계가 있으면 최소 중간 티어"
- 호출 계층을 우리가 직접 소유한다. 그래서 세션 고정, 캐시 마커, 감사 로그, 데이터 경로를 직접 통제할 수 있다.

### 3-2. 설계 원칙 (코딩 툴의 실패 요인을 피하는 방법)
1. **작업 시작 시 한 번만** 티어와 effort를 정하고, 작업 중에는 고정한다.
2. **워크플로 하한:** 고위험이거나 판단이 필요한 단계는 정책으로 최소 티어를 정한다. 판단 모델이 그 아래로 내리지 못한다.
3. **올리는 방향으로만 전환:** 툴 오류가 2회 연속 나거나 거절되면 한 단계 위로 올리고 effort는 유지한다. 캐시가 살아 있는 동안에는 내리지 않는다.
4. **계열별 네이티브 API 유지:** Claude는 Converse, GPT는 Responses로 호출하고, 계열마다 별도의 퓨전 모델로 제공한다.

### 3-3. 시뮬레이션 결과 (https://tool.cocy.io/router/)
목업 API 기준이다. "최저 고정"은 결과를 미리 알고 고른, 전 작업을 성공하는 가장 싼 고정 모델(effort low)이다. 실제로는 달성하기 어려운 하한선이다.

**세션 고정 라우터(작업 시작 시 1회 판단, 실패 시 상향) vs 최저 고정**

| 사내 업무 시나리오 | Claude | GPT |
|---|---|---|
| 사내 업무 비서(혼합 6건) | $0.146, Opus 고정 $0.320 대비 **−54%** | $0.066, Sol 고정 $0.089 대비 **−26%** |
| 사내 규정 Q&A(혼합 3건) | $0.015, Sonnet 고정 $0.030 대비 **−52%** | $0.0098, Terra 고정 $0.0103 대비 −5% |
| 회의록 정리·액션 아이템 공지 | $0.077, Sonnet 고정 $0.072 대비 **+7%** | $0.035, Terra 고정 $0.033 대비 **+7%** |
| 장애 회고 보고서(고위험) | $0.085, Opus 고정 $0.078 대비 **+9%** | $0.042, Sol 고정 $0.039 대비 **+9%** |
| 주간 업무 보고 취합(경량) | Haiku 고정과 같음 | Luna 고정과 같음. LLM 판단을 쓰면 판단 비용만큼 +7% |

**모델을 바꾸는 방식에 따른 손실**

| 전략 | 결과 |
|---|---|
| 턴마다 라우팅(호출마다 그 입력만 보고 다시 고름) | 사내 업무 비서에서 6건 중 **4건만 성공**. 툴 결과를 받는 턴은 쉬워 보여서 작은 모델로 내려가고, 그 모델이 다음 툴 호출에 실패함 |
| 임의 전환 | 회의록 정리에서 Claude는 Sonnet 고정 대비 **+176%**(전환 12회, 캐시 재작성 9만 토큰, thinking 2,214 토큰 유실), GPT는 Terra 고정 대비 **약 7배**. 장애 보고서에서는 Claude가 1건 실패 |

- **해석:**
  - 라우팅으로 이득을 보는 경우는 **쉬운 요청과 어려운 요청이 섞이고, 작업 사이에 캐시가 식는** 에이전트(업무 비서, 규정 Q&A)뿐이다.
  - 판단 단계가 정해진 워크플로는 라우터가 결국 워크플로 하한을 따라갈 뿐이다. 판단 단계 effort 하한이나 판단 호출 비용만 더해져 고정보다 조금 비싸다. **워크플로별 정적 지정으로 충분하다.**
  - 모델이나 effort를 바꿀 때마다 새 모델의 캐시를 처음부터 다시 쓴다. Claude는 하향하면 진행 중인 툴 루프의 thinking까지 잃는다. 그래서 작업 중 전환은 거의 항상 손해다.
- 혼합 트래픽에서도 최저 고정은 결과를 알아야 고를 수 있다. 결과를 모르는 상태에서 Sonnet이나 Terra로 고정하면 6건 중 5건만 성공한다.

### 3-4. 경량 최신 모델로도 기본 툴 호출이 가능하다
- Anthropic 문서: *"All current models support … tool use"*. Haiku 5.5는 "Fastest" 등급이고, Anthropic API 정가 기준 입력 $0.10, 출력 $0.50(/1M 토큰)부터다. Opus 5.5($4/$20)의 1/40이다.
- OpenAI 문서: GPT-6 Luna는 *"most efficient model for focused, high-volume tasks"* 이다. 권장 용도 중 하나가 "Luna · Extra high: 여러 앱에서 맥락을 찾고, 업무 우선순위를 정하고, 조건이 명확한 문제를 해결"이다. Bedrock 단가는 $0.10/$0.50으로 Astra($10/$50)의 1/100이다.
- 조회 → 판단 → 답변으로 이어지는 일반 업무 툴 호출은 경량 모델을 기본으로 두고, 필요할 때만 상향하는 구조로 대부분 처리할 수 있을 것으로 본다. **단, 우리 업무 데이터로 리플레이 검증한 뒤 확정**한다.

## 4. 비IT 직군의 Claude Code·Codex 사용: 토큰 낭비 문제와 대안

### 4-1. 문제
- 코딩 에이전트는 시스템 프롬프트, 툴 정의, 파일 읽기, 서브에이전트, 안전 분류기 호출 때문에 **기본 컨텍스트 자체가 무겁다.** 문서 요약이나 메일 작성 같은 업무에 쓰면 과잉이다.
- Claude Code 문서도 비용 급증의 주원인을 *"long sessions that were never cleared or … Opus left as the default model"* 로 꼽는다. 비IT 직군은 `/clear`, `/compact`, 모델·effort 선택을 다루기 어렵다.
- 결과적으로 단순 업무가 최상위 모델과 긴 세션으로 처리되고, 그만큼 토큰이 낭비된다.

### 4-2. 대안
1. **업무형 에이전트로 전환:** 사내 포털이나 메신저에서 쓰는 업무 에이전트에 라우팅된 퓨전 모델을 제공한다(기본 Luna·Haiku, 워크플로 하한, 실패 시 상향). 사용자는 모델을 고를 필요가 없다.
2. **코딩 툴은 개발 직군에 한정하고 관리형 설정을 적용한다.** Claude Code는 `availableModels`, 조직 기본 모델, `maxEffortLevel`, 서브에이전트 Haiku 지정, 게이트웨이 지출 한도를 쓰고, Codex는 관리형 `requirements.toml`, 워크스페이스별 모델 허용, 서브에이전트 Luna 기본값을 쓴다.
3. **사용량 가시화:** 사용자·업무별 토큰과 캐시 적중률 대시보드를 만들고, 이상 사용을 알린다.

## 5. 검토한 후보와 장단점

| 후보 | 형태 | 장점 | 단점 | 판단 |
|---|---|---|---|---|
| **워크플로별 정적 모델 지정** | 에이전트 정의에 모델·effort 하한을 선언, 작업 중 고정, 실패 시 상향 | 별도 서버가 필요 없고, 캐시와 thinking 손실이 없으며, 결과가 재현됨 | 혼합 트래픽에서는 라우팅만큼 아끼지 못함 | **1차 채택 권고** |
| 자체 라우팅 SDK(bedrock_fusion) | 서버 측 Python 계층, 판단 엔진 교체 가능 | 계열별 네이티브 API·캐시 전략·감사 로그를 직접 통제 | 서버 운영 부담 대비 이득이 혼합 트래픽에 한정됨. 라이브 검증 필요 | 보류. 시뮬레이터와 설계 근거로만 유지 |
| Bedrock Intelligent Prompt Routing | AWS 매니지드, 요청 단위 | 데이터가 Bedrock 안에 머묾 | GPT-6·Claude 5.5 미지원(모델 카드에 "Not supported"), 2개 모델 중 선택만 가능, 영어 최적화 | 현재 불가. 지원되면 재검토 |
| OpenRouter Auto / Jev Router | 매니지드 라우터 | 모델과 effort를 함께 선택, 캐시 상태 반영 | 트래픽이 OpenRouter를 경유 → 금융권 데이터 경로 요건 충족이 어려움 | 참고 |
| OpenRouter Decisions API (Jev) | 매니지드 판단 API | 워크플로 설명을 넣고 확률을 받는 구조라 설계가 맞음 | Alpha 단계, Bedrock 밖 | 판단 엔진 후보로 추적 |
| NVIDIA NeMo Switchyard | 오픈소스, 임베드형(Python 바인딩) | 세션 시작 시 판단 + 툴 결과로 보정, 툴 의미(조회/변경/계획) 선언 가능 → 설계가 거의 같음 | 2티어 중심, 공개 수치는 코딩 벤치마크뿐 | 2차 판단 엔진 후보 |
| vLLM Semantic Router | 오픈소스, 정책 DSL + 자체 판단 모델 | 세션 연속성, 정책 기반 | 셀프호스팅 인프라 부담이 큼 | 보류 |
| Plano / Arch-Router | 1.5B 라우팅 모델 | 업무를 자연어로 기술하면 모델에 매칭 | 영어 중심, 직접 운영 필요 | 보류 |
| Azure Foundry Model Router | 매니지드, 요청 단위 | 별도 운영 부담 없음 | 캐시 상태를 보지 않음(문서 명시), Azure 전용 | 참고 |
| 코딩 툴 내장 기능 | `opusplan`, 서브에이전트 모델, `review_model` | 툴 벤더가 캐시까지 고려해 최적화 | 코딩 용도 한정 | 개발 직군에는 이것을 사용 |
| 단일 모델 고정 + effort만 조절 | 설정만 변경 | 가장 단순, 캐시 손실 없음(GPT) | 계열 내 가격 차이(최대 40~100배)를 활용하지 못함. Bedrock의 Claude는 effort만 바꿔도 캐시가 깨짐 | 고위험 전용 플로에 적용 |

## 6. 권고 로드맵

| 단계 | 기간(제안) | 내용 | 완료 기준 |
|---|---|---|---|
| 0. 측정 | 2~4주 | 실제 에이전트 로그 500~1,000건을 각 티어로 리플레이하고 품질(LLM 심사 + 표본 검수)과 비용 측정 | 최상위 고정 대비 품질 97% 유지 시 비용 30~40% 이상 절감 |
| 1. 파일럿 | 4~6주 | 업무 에이전트 1~2종에 워크플로별 모델 지정 적용(기본 경량 모델, 판단·고위험 단계는 상위 모델, 실패 시 상향). 비IT 직군 코딩 툴 사용 전환 시작 | 비용·성공률 대시보드, 감사 로그 |
| 2. 선별 적용 | 이후 | 혼합 트래픽 에이전트에만 세션 시작 1회 판단(Haiku·Luna 분류기)을 붙여 정적 지정과 A/B 비교 | 정적 지정 대비 비용 절감이 판단 비용과 실패율 증가분보다 클 때만 유지 |
| 3. 전환 | 출시 시 | Bedrock 매니지드 라우팅·decision 기능이 나오면 판단 부분만 교체 | 정책·로그 계층은 그대로 유지 |

## 7. 리스크와 미검증 사항
- **데이터 경로:** 서울 리전에서 GPT-6와 Claude 5.5는 Global 교차 리전으로만 쓸 수 있고, GPT-6.1 Sol은 US 교차 리전 전용이다. 컴플라이언스 검토가 필요하다.
- **라이브 미검증:** Responses API의 캐시 옵션 필드와 usage 내 캐시 토큰 위치, Bedrock 경로에서 Claude effort를 바꿀 때의 실제 캐시 동작은 라이브로 확인하지 못했다.
- **가격:** Claude 5.5는 Bedrock 모델 카드에 단가가 없어 Anthropic API 정가를 썼다. 시뮬레이션은 목업 API와 단순화한 토큰 계산 기준이다.
- **시뮬레이션 가정:** Claude가 하향해 thinking을 잃으면 직전 툴을 한 번 다시 호출한다고 가정했다. effort는 비용에만 반영하고 품질에는 반영하지 않았다. GPT의 reasoning 손실은 근거가 없어 반영하지 않았다.
- **품질:** 경량 모델의 충분성은 문서상 근거와 시뮬레이션에 기반한 판단이다. 우리 업무 데이터로 리플레이 평가가 필요하다.

## 8. 근거 자료
- AWS Bedrock User Guide: 모델 카드(GPT-6, Claude 5.5), Prompt caching, Intelligent Prompt Routing
- Claude Code 문서: [Prompt caching](https://code.claude.com/docs/en/prompt-caching), [Model configuration](https://code.claude.com/docs/en/model-config), [Subagents](https://code.claude.com/docs/en/sub-agents), [Costs](https://code.claude.com/docs/en/costs)
- Codex 문서: [Model selection](https://learn.chatgpt.com/docs/model-selection), [Models](https://learn.chatgpt.com/docs/models), [Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents), [Code review](https://learn.chatgpt.com/docs/code-review), [Amazon Bedrock](https://learn.chatgpt.com/docs/amazon-bedrock)
- Anthropic: [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview)
- NVIDIA NeMo Switchyard, OpenRouter Auto Router / Decisions API, vLLM Semantic Router, Plano Arch-Router, Azure Foundry Model Router 공개 문서
- 시뮬레이터: https://tool.cocy.io/router/
