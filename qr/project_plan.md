# QR Tool + Gemma 3n OCR-WiFi 프로젝트

## 📋 프로젝트 개요
QR 코드 생성/스캔 도구에 Gemma 3n 모델을 활용한 OCR-WiFi 기능 추가

## 🎯 주요 기능
- **QR 생성**: 텍스트/URL → QR 코드
- **WiFi QR**: 수동 입력 + OCR 이미지 추출
- **QR 스캔**: 카메라/이미지 업로드
- **AI OCR**: Gemma 3n으로 WiFi 정보 자동 추출

## 🗂️ 프로젝트 구조
```
tools/
├── models/
│   └── model-manager.js      ✅ 완료
├── qr/
│   ├── index.html           ✅ 완료
│   ├── qr-app.js            ✅ 완료  
│   ├── ocr-wifi.js          🔧 수정 필요
│   └── project_plan.md      ✅ 생성됨
```

## ✅ 완료된 작업

### 1. 모델 관리 시스템 (model-manager.js)
- Cache API 기반 브라우저 모델 캐싱
- 청크 단위 병렬 다운로드 시스템
- 진행률 표시 UI
- Gemma 3n 4B/2B 모델 지원

### 2. QR 도구 기본 기능
- QR 코드 생성/다운로드
- WiFi QR 코드 생성 (수동 입력)
- QR 코드 스캔 (카메라/이미지)
- 다크모드, 반응형 UI

### 3. UI/UX 완성
- 테일윈드 기반 반응형 디자인
- 탭 기반 인터페이스
- 국제화 준비 (data-translate-key)
- SEO 최적화 메타태그

## 🔧 진행 중인 작업

### OCR-WiFi 시스템 문제점 및 해결 필요
1. **MediaPipe 연동 문제**
   - `FilesetResolver`, `LlmInference` 임포트 오류
   - 올바른 MediaPipe Gemma 3n API 사용법 필요

2. **모델 로딩 시스템 개선**
   - ModelManager와 OCR-WiFi 간 연동 수정
   - Gemma 3n 4B 모델 정확한 URL 및 포맷 확인

## 📝 다음 해야 할 일

### 1. 우선 순위 1: OCR-WiFi 수정
- [ ] MediaPipe Gemma 3n 올바른 API 사용법 연구
- [ ] ocr-wifi.js 모델 로딩 부분 수정
- [ ] 이미지 → 텍스트 추출 테스트

### 2. 우선 순위 2: 통합 테스트
- [ ] localhost 환경에서 전체 기능 테스트
- [ ] 각 탭별 동작 확인
- [ ] 모바일 반응성 테스트

### 3. 우선 순위 3: 최적화
- [ ] 모델 다운로드 UX 개선
- [ ] 오류 처리 강화
- [ ] 로그 시스템 구축

## 🚨 현재 차단 요소
1. **MediaPipe Gemma 3n API 미확정**
   - 올바른 라이브러리 CDN 및 사용법 필요
   - Gemma 3n 모델 파일 형식 및 URL 확인 필요

## 💡 기술 스택
- **Frontend**: HTML5, TailwindCSS, Vanilla JS
- **AI 모델**: Gemma 3n (4B Multimodal)
- **캐싱**: Browser Cache API
- **QR 라이브러리**: QRCode.js, QR-Scanner

## 🎯 목표
OCR-WiFi 기능으로 카페/레스토랑 WiFi 정보 이미지에서 자동 QR 생성
