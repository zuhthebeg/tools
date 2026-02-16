# Recipe App Backend Design

## Overview
`tool.cocy.io/recipe/` → `recipe.cocy.io` (별도 CF Pages 프로젝트)
Travly와 동일 스택: Cloudflare Pages + D1 + Google OAuth

## 현재 상태
- 프론트엔드 only (index.html + localStorage)
- 데이터: `{id, name, category, ingredients, steps, createdAt}`

## 새 스택
- **Frontend**: React + Vite + TypeScript + TailwindCSS
- **Backend**: CF Pages Functions (TypeScript)
- **DB**: D1 (SQLite)
- **Auth**: Google Login (Travly와 동일 패턴)
- **Storage**: CF R2 (레시피 사진)

---

## D1 Schema

```sql
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    google_id TEXT UNIQUE,
    email TEXT,
    picture TEXT,
    auth_provider TEXT DEFAULT 'google',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    category TEXT,
    description TEXT,           -- 한줄 소개
    ingredients TEXT NOT NULL,   -- JSON array: [{name, amount, unit}]
    steps TEXT NOT NULL,         -- JSON array: [{order, text, image_url?}]
    servings INTEGER,            -- 인분
    cook_time INTEGER,           -- 조리시간 (분)
    difficulty TEXT,             -- 쉬움/보통/어려움
    image_url TEXT,              -- 대표 이미지
    is_public BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    recipe_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, recipe_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_recipes_user ON recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);
CREATE INDEX IF NOT EXISTS idx_recipes_public ON recipes(is_public);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
```

---

## API Endpoints

### Auth (Travly 그대로)
```
POST /api/auth/google    Google 로그인 (credential → user)
```

### Recipes
```
GET    /api/recipes              목록 (public + 내 것)
GET    /api/recipes/:id          상세
POST   /api/recipes              생성 (auth 필요)
PUT    /api/recipes/:id          수정 (본인만)
DELETE /api/recipes/:id          삭제 (본인만)
```

**GET /api/recipes 쿼리파라미터:**
- `?mine=true` — 내 레시피만
- `?category=한식` — 카테고리 필터
- `?q=김치` — 검색 (title, ingredients)
- `?sort=latest|popular` — 정렬
- `?page=1&limit=20` — 페이지네이션

### Favorites
```
POST   /api/recipes/:id/favorite     즐겨찾기 토글
GET    /api/favorites                 내 즐겨찾기 목록
```

### Image Upload
```
POST   /api/upload                이미지 업로드 (R2)
```

---

## CF Pages Functions 파일 구조

```
functions/
├── types.ts
├── api/
│   ├── auth/
│   │   └── google.ts            # POST - Google 로그인
│   ├── recipes/
│   │   ├── index.ts             # GET 목록, POST 생성
│   │   └── [id]/
│   │       ├── index.ts         # GET/PUT/DELETE 개별
│   │       └── favorite.ts      # POST 즐겨찾기 토글
│   ├── favorites/
│   │   └── index.ts             # GET 내 즐겨찾기
│   └── upload.ts                # POST 이미지
```

---

## Frontend 주요 페이지

```
src/
├── pages/
│   ├── MainPage.tsx             # 레시피 목록 (검색, 필터, 카테고리)
│   ├── RecipeDetailPage.tsx     # 레시피 상세
│   ├── CreateRecipePage.tsx     # 레시피 작성
│   └── MyPage.tsx               # 내 레시피 + 즐겨찾기
├── components/
│   ├── RecipeCard.tsx
│   ├── RecipeForm.tsx
│   ├── CategoryFilter.tsx
│   ├── SearchBar.tsx
│   └── GoogleLoginButton.tsx
```

---

## 기존 데이터 마이그레이션

로그인 후 localStorage에 `cocy_recipes` 있으면:
1. "기존 레시피 N개를 클라우드로 옮길까요?" 프롬프트
2. 각 레시피를 POST /api/recipes로 업로드
3. 완료 후 localStorage 정리

---

## MVP 범위 (Phase 1)

**포함:**
- [x] Google 로그인
- [x] 레시피 CRUD
- [x] 카테고리 필터 + 검색
- [x] 반응형 모바일 UI
- [x] localStorage → 클라우드 마이그레이션

**Phase 2 (나중):**
- [ ] 이미지 업로드 (R2)
- [ ] 즐겨찾기
- [ ] 공개/비공개 설정
- [ ] 다른 유저 레시피 탐색

---

## Cloudflare 설정

```toml
# wrangler.toml
name = "recipe-app"
compatibility_date = "2024-12-01"

[[d1_databases]]
binding = "DB"
database_name = "recipe-db"
database_id = "TBD"

# Phase 2
# [[r2_buckets]]
# binding = "IMAGES"
# bucket_name = "recipe-images"
```

**환경 변수:**
- `VITE_GOOGLE_CLIENT_ID` (Travly와 동일 Google OAuth 클라이언트)

---

## 도메인
- 개발: `recipe-app.pages.dev`
- 프로덕션: `recipe.cocy.io` (CNAME 추가)
- 또는 기존 `tool.cocy.io/recipe/` 유지 (GitHub Pages이므로 불가 → 별도 도메인 필수)
