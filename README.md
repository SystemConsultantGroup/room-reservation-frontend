# 성균관대학교 공간 예약 서비스 프론트엔드

![Next.js](https://img.shields.io/badge/Next.js-16.2.1-black?logo=nextdotjs&logoColor=white) ![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)

성균관대학교 교내 공간 예약을 위한 Next.js 프론트엔드 애플리케이션입니다.

## 핵심 기능

- Google OAuth2 로그인 진입 및 쿠키 기반 인증 상태 유지
- 공간 목록, 주간 예약 현황, 내 예약 조회
- 공간 예약 생성 및 취소
- 전공 등록 신청 및 신청 상태 조회
- 관리자용 공간, 사용자, 전공 신청, 공지 관리 화면
- 접속 도메인에 따른 공간, 메타데이터, 공지 노출

## 시작하기

### 1. 요구 사항

- Node.js 24
- npm

### 2. 환경 변수 설정

로컬 구동 시 필요한 최소한의 환경 변수입니다.

| 변수명                | 설명                 | 예시                    |
| :-------------------- | :------------------- | :---------------------- |
| `NEXT_PUBLIC_API_URL` | 백엔드 API 서버 주소 | `http://localhost:8000` |

### 3. 로컬 서버 실행

```bash
npm ci
npm run dev
```

> 개발 서버는 기본적으로 `3000` 포트에서 구동됩니다.

### 4. 프로덕션 빌드

```bash
npm run build
npm run start
```

### 5. Docker 실행

```bash
docker build -t room-reservation-frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8000 \
  room-reservation-frontend
```

## API 요청 및 캐시 전략

본 프로젝트는 클라이언트 요청과 서버사이드 요청을 분리해서 처리합니다.

- **클라이언트 요청:** `axios` 인스턴스(`src/lib/api.ts`)와 `@tanstack/react-query`를 사용합니다. Axios는 `NEXT_PUBLIC_API_URL`을 기준으로 API를 호출하고, `withCredentials: true`로 인증 쿠키를 함께 전달합니다.
- **클라이언트 캐시:** React Query가 화면 단위 조회 데이터를 캐싱하며, 생성/수정/삭제 Mutation 성공 후 관련 Query를 무효화합니다.
- **서버사이드 요청:** 서버 컴포넌트와 메타데이터 생성에 필요한 데이터는 `serverFetch()`(`src/lib/serverApi.ts`)로 요청합니다.
- **서버사이드 캐시:** Next.js `fetch`의 `revalidate`와 `tags`를 사용하며, 필요한 경우 `revalidateTag()`로 태그 기반 캐시를 갱신합니다.

## 서버사이드 Origin 프록시 구조

백엔드는 공개 API 요청의 `Origin` 헤더로 관리 단위(`ManagementUnit`)를 식별합니다. 브라우저에서 직접 발생하는 요청은 브라우저가 `Origin`을 자동으로 전달하지만, Next.js 서버에서 백엔드로 보내는 서버사이드 요청은 원래 사용자가 접근한 출처를 별도로 복원해야 합니다.

이를 위해 프론트엔드는 서버사이드 API 요청 시 현재 요청의 호스트, 프로토콜, 포트 정보를 읽어 백엔드에 전달합니다.

전달되는 주요 헤더는 다음과 같습니다.

| 헤더명              | 설명                                   |
| :------------------ | :------------------------------------- |
| `Origin`            | 백엔드가 테넌트를 식별하는 원본 Origin |
| `X-Forwarded-Host`  | 원래 요청의 Host                       |
| `X-Forwarded-Proto` | 원래 요청의 프로토콜                   |
| `X-Forwarded-Port`  | 원래 요청의 포트                       |
| `Content-Type`      | JSON 요청 명시                         |

## 인증 및 라우팅

- 로그인은 `redirectToGoogleLogin()`에서 `NEXT_PUBLIC_API_URL/auth/login/google`로 이동합니다.
- 인증 쿠키는 백엔드가 발급하며, 프론트엔드는 `withCredentials`로 쿠키를 포함해 API를 호출합니다.
- `AuthGuard`는 비로그인 사용자를 `/login`으로 이동시킵니다.
- `OnboardingGuard`는 `GUEST` 사용자를 `/onboarding`으로 유도합니다.
- `AdminGuard`는 `managingUnitIds`가 있는 사용자만 관리자 화면에 접근하게 합니다.

## 프로젝트 구조

```text
src
├── actions
│   └── cache.ts
├── app
│   ├── (user)
│   ├── admin
│   ├── layout.tsx
│   └── providers.tsx
├── components
│   ├── admin
│   ├── auth
│   ├── home
│   ├── layout
│   ├── reservation
│   └── ui
├── constants
│   └── cacheTags.ts
├── hooks
│   └── queries
├── lib
│   ├── api.ts
│   ├── prefetch.ts
│   └── serverApi.ts
└── types
```

## 주요 화면

| 경로                   | 설명                  |
| :--------------------- | :-------------------- |
| `/`                    | 홈 및 예약 현황       |
| `/login`               | 로그인 화면           |
| `/onboarding`          | 신규 사용자 정보 등록 |
| `/reservation`         | 공간 예약             |
| `/reservation/[id]`    | 예약 상세             |
| `/profile`             | 내 정보               |
| `/registration`        | 전공 등록 신청        |
| `/admin`               | 관리자 홈             |
| `/admin/spaces`        | 공간 관리             |
| `/admin/users`         | 사용자 관리           |
| `/admin/registrations` | 전공 신청 관리        |
| `/admin/notices`       | 공지 관리             |
| `/admin/majors`        | 전공 관리             |
