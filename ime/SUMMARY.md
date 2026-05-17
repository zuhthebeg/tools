# IME Manager 프로젝트 구현 현황

## 1. 개요
한국어 → 번체중국어 웹툰 번역 작업을 위한 개인용 생산성 도구. Microsoft Bopomofo(新注音) 사용자 사전 관리 및 번역 지식베이스(KB) 기능을 제공함.

## 2. 기술 스택
- **Backend**: Hono (on Cloudflare Workers)
- **Database**: Cloudflare D1 (SQLite)
- **Frontend**: Single Page Application (HTML/JS/Tailwind CSS)
- **Deployment**: Cloudflare Workers & Pages

## 3. 구현된 기능
### Module A: IME 사전 관리
- [x] 작품(Project) 단위 관리 및 활성화/비활성화 토글
- [x] IME 단어 등록 (원본, 주음부호, 약칭)
- [x] 자동 약칭 생성 로직 (마지막 2글자 추출)
- [x] Microsoft Bopomofo 호환 TXT Export (UTF-8, Tab 구분)
- [x] 대량 Import (텍스트 붙여넣기 방식)

### Module B: 번역 지식베이스
- [x] 용어/표현 등록 (한국어, 중국어, 카테고리, 태그, 메모)
- [x] 통합 검색 (실시간 필터링)

### UI/UX
- [x] 3패널 레이아웃 (좌: 작품 / 중: 사전 / 우: 지식베이스)
- [x] 반응형 및 고효율 작업 환경 제공

## 4. 설치 및 실행 방법
1. `npx wrangler d1 create ime_db` 실행 후 ID를 `wrangler.toml`에 기입
2. `npx wrangler d1 execute ime_db --local --file=./schema.sql` (로컬 DB 초기화)
3. `npm run dev` (로컬 테스트)
4. `npm run deploy` (Cloudflare 배포)
