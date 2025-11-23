# Flownote - 자동 음성 문서화 서비스

녹음 한 번 하면 완성되는 자동 문서

## 프로젝트 개요

Flownote는 음성 녹음을 자동으로 텍스트로 변환하고, AI가 정리하여 Notion에 저장하고 Slack으로 알림을 보내주는 자동화 서비스입니다.

### 주요 기능

- **원클릭 녹음**: 웹에서 바로 녹음 시작 (최대 120분)
- **자동 STT**: WhisperAPI를 통한 고품질 음성-텍스트 변환
- **AI 문서 정리**: GPT-4o-mini로 회의록/인터뷰/강의 형식으로 자동 정리
- **Notion 연동**: 정리된 문서를 Notion 페이지로 자동 생성
- **Slack 알림**: 처리 완료 시 Slack 메시지 전송
- **PWA 지원**: 모바일 홈 화면에 추가 가능

## 기술 스택

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS** (Glassmorphism 디자인)

### Backend
- **Next.js API Routes** (서버리스)
- **Supabase** (PostgreSQL + Auth + Storage)

### 외부 API
- **WhisperAPI.com** (STT)
- **OpenAI GPT-4o-mini** (문서 정리)
- **Notion API** (페이지 생성)
- **Slack API** (메시지 전송)

## 빠른 시작

자세한 설정 방법은 [SETUP.md](SETUP.md)를 참조하세요.

### 1. 환경 변수 설정

`.env.example`을 복사하여 `.env`를 생성하고 다음 값들을 설정하세요:

```bash
cp .env.example .env
```

#### 필수 환경 변수:

**Supabase** (https://supabase.com)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**OpenAI** (https://platform.openai.com)
```env
OPENAI_API_KEY=your_openai_api_key
```

**WhisperAPI** (https://whisperapi.com)
```env
WHISPER_API_KEY=your_whisper_api_key
```

**Notion** (https://developers.notion.com)
```env
NOTION_CLIENT_ID=your_notion_client_id
NOTION_CLIENT_SECRET=your_notion_client_secret
NOTION_REDIRECT_URI=http://localhost:3000/api/auth/notion/callback
```

**Slack** (https://api.slack.com/apps)
```env
SLACK_CLIENT_ID=your_slack_client_id
SLACK_CLIENT_SECRET=your_slack_client_secret
SLACK_REDIRECT_URI=http://localhost:3000/api/auth/slack/callback
```

**App URL**
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. 데이터베이스 설정

Supabase 대시보드에서 SQL 에디터를 열고 `database/schema.sql` 파일의 내용을 실행하세요.

이 스크립트는 다음을 생성합니다:
- `users` 테이블
- `recordings` 테이블
- `custom_formats` 테이블
- Row Level Security (RLS) 정책
- Storage bucket 정책

### 3. Supabase Storage 설정

Supabase 대시보드에서 Storage > Create bucket:
- Bucket name: `recordings`
- Public: `false`

### 4. Google OAuth 설정

Supabase 대시보드에서:
1. Authentication > Providers > Google 활성화
2. Google Cloud Console에서 OAuth 2.0 클라이언트 생성
3. 인증된 리디렉션 URI 추가: `https://[your-project-ref].supabase.co/auth/v1/callback`

### 5. 패키지 설치 및 실행

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:3000을 열어 확인하세요.

## 프로젝트 구조

```
.
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── dashboard/         # 대시보드
│   ├── onboarding/        # 온보딩
│   ├── history/           # 녹음 히스토리
│   ├── settings/          # 설정
│   └── page.tsx           # 랜딩 페이지
├── components/            # React 컴포넌트
│   └── recorder/          # 녹음 관련 컴포넌트
├── lib/                   # 유틸리티
│   ├── supabase/         # Supabase 클라이언트
│   ├── auth.ts           # 인증 헬퍼
│   └── utils.ts          # 공통 유틸리티
├── types/                 # TypeScript 타입 정의
├── database/              # 데이터베이스 스키마
└── public/                # 정적 파일
```

## 주요 페이지

### 랜딩 페이지 (`/`)
- 서비스 소개
- Google 로그인 버튼
- 3가지 사용 사례 (회의록/인터뷰/강의)

### 온보딩 (`/onboarding`)
- **Step 1**: 환영 메시지
- **Step 2**: Notion/Slack 연동
- **Step 3**: 기본 문서 포맷 선택

### 대시보드 (`/dashboard`)
- 녹음 컨트롤 (시작/일시정지/중지)
- 타이머 표시
- 포맷 선택
- 사용량 표시

### 히스토리 (`/history`)
- 최근 녹음 목록
- 처리 상태 (처리중/완료/실패)
- Notion 링크 바로가기

### 설정 (`/settings`)
- 계정 정보
- 연결된 통합 관리
- 데이터 삭제

## API 엔드포인트

### 인증
- `GET /api/auth/callback` - OAuth 콜백
- `POST /api/auth/signout` - 로그아웃

### 녹음
- `POST /api/recordings` - 녹음 생성 및 업로드
- `GET /api/recordings` - 녹음 목록 조회
- `GET /api/recordings/[id]` - 녹음 상세 조회
- `DELETE /api/recordings/[id]` - 녹음 삭제

### 사용자
- `GET /api/user/usage` - 사용량 조회
- `DELETE /api/user/data` - 모든 데이터 삭제

### 포맷
- `GET /api/formats` - 커스텀 포맷 목록
- `POST /api/formats` - 커스텀 포맷 생성
- `PUT /api/formats/[id]` - 커스텀 포맷 수정
- `DELETE /api/formats/[id]` - 커스텀 포맷 삭제

## 개발 현황

### ✅ MVP 완료
- [x] Next.js 14 프로젝트 초기화 (App Router, TypeScript)
- [x] Tailwind CSS 및 Glassmorphism 디자인 시스템
- [x] Supabase 설정 및 데이터베이스 스키마
- [x] Google OAuth 인증 시스템
- [x] 랜딩 페이지
- [x] 온보딩 플로우 (3단계)
- [x] 대시보드 페이지 및 녹음 컨트롤
- [x] 웹 오디오 녹음 기능 (MediaRecorder API)
- [x] API Routes (recordings, user, formats)
- [x] WhisperAPI.com STT 연동
- [x] OpenAI GPT-4o-mini 문서 정리 (3가지 기본 프롬프트)
- [x] Notion API 연동 (OAuth + 페이지 생성)
- [x] Slack API 연동 (OAuth + 메시지 전송)
- [x] 히스토리 페이지
- [x] 설정 페이지 및 포맷 설정
- [x] PWA 설정 (manifest.json, service worker)
- [x] Vercel 배포 설정

### 📋 향후 개선 사항
- [ ] 에러 핸들링 강화
- [ ] WebSocket 기반 실시간 진행 상황 표시
- [ ] 성능 최적화 (이미지 최적화, 코드 스플리팅)
- [ ] 단위 테스트 및 E2E 테스트
- [ ] Sentry 에러 트래킹
- [ ] 다국어 지원 (i18n)
- [ ] 녹음 편집 기능
- [ ] 팀 공유 기능

## 배포

자세한 배포 방법은 [DEPLOYMENT.md](DEPLOYMENT.md)를 참조하세요.

### 빠른 배포 (Vercel)

1. GitHub 리포지토리 생성 및 푸시
2. [Vercel Dashboard](https://vercel.com)에서 프로젝트 임포트
3. 환경 변수 설정
4. 배포

```bash
# 또는 CLI 사용
npm install -g vercel
vercel
```

## 라이선스

ISC

## 문서

- [SETUP.md](SETUP.md) - 로컬 개발 환경 설정 가이드
- [DEPLOYMENT.md](DEPLOYMENT.md) - Vercel 배포 가이드
- [docs/prd.md](docs/prd.md) - 제품 요구사항 문서 (PRD)

## 개발 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 린트 검사
npm run lint

# 타입 체크
npx tsc --noEmit
```

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 문의

이슈나 질문은 GitHub Issues를 이용해주세요.

## 제작

이 프로젝트는 Claude Code와 함께 개발되었습니다.
