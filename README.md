# 📝 나만의 글을 작성하고 공유하는 SNS 플랫폼 만들기
SNS Clone Coding (Nomad Coders Project - X 클론코딩)

## 👋 1. 자기소개

안녕하세요!
업무 특성상 개발과 거리가 생긴 상황에서도 개발 감각을 잃지 않기 위해 Nomad Coders를 중심으로 꾸준히 학습하고 있는 직장인입니다.
<br /><br />
이번 프로젝트는 단순한 연습을 넘어, 제대로 된 클론 코딩을 통해 저만의 포트폴리오를 완성하는 것을 목표로 하고 있습니다. 기능 구현뿐만 아니라 구조와 흐름을 이해하며, 결과물의 완성도를 높이는 데 집중해보고 싶습니다.

## 🧩 2. 메인 페이지 와이어프레임
![1. Sign In Page](./images/design/01.%20Sign%20In%20Page.png)
![2. Main Page](./images/design/02.%20Main%20Page.png)
![3. Main Page - Create Post](./images/design/03.%20Main%20Page%20-%20Create%20Post.png)
![4. Main Page - Edit, Delete Post](./images/design/04.%20Main%20Page%20-%20Edit,%20Delete%20Post.png)
![5. Profile Page](./images/design/05.%20Profile%20Page.png)

## 🎨 3. 디자인 포인트 & 구현 목표

### 🎯 포인트 색상 및 로고
- 아직 SNS 커뮤니티의 주제가 확정되지 않아, 주제가 정해지는 대로 전체 분위기에 맞춰 포인트 색상과 로고를 선정할 예정입니다.

### ⚙️ 구현하고 싶은 기능
- 가독성을 고려한 **카드 형태의 게시물** 디자인
- UI를 최대한 심플하게 유지하기 위해 **아이콘 중심 구성** (hover 시 설명 표시)
- **라이트 / 다크 모드** 옵션 구현

## 🤔 4. 고민 & 공유하고 싶은 팁

### 고민
- X나 트위터 사용 경험이 없어 **클론 코딩 과정에서 어려움을 느낄 수 있음**
- **2주 안에 원하는 기능 범위를 구현할 수 있을지 걱정**

### 공유하고 싶은 팁
- 개발 진행하며 팁이 생기면 적어둘게요^^

## 📂 5. 소스코드 구조
- components: 재사용 UI
- pages: 라우팅 단위 화면
- lib: Firebase 및 인증 로직
```bash
src/
├── App.tsx                      # 전체 라우팅 및 앱의 루트 컴포넌트
├── assets                       # 정적 파일(이미지 등) 보관
│   └── react.svg                # React 로고 이미지
├── components                   # 재사용 가능한 UI 컴포넌트 모음
│   ├── auth                     # 인증 관련 컴포넌트
│   │   ├── GithubButton.tsx     # GitHub OAuth 로그인 버튼
│   │   └── ProtectedRoute.tsx   # 인증된 사용자만 접근 가능한 라우트 가드
│   ├── layout                   # 공통 레이아웃 컴포넌트
│   │   └── Layout.tsx           # Header/Footer 등을 포함한 기본 페이지 레이아웃
│   └── loading.tsx              # 로딩 상태 표시 컴포넌트
├── lib                          # 외부 서비스 및 설정 관련 로직
│   ├── auth.ts                  # 인증 관련 유틸 함수
│   └── firebase.ts              # Firebase 초기화 및 설정
├── main.tsx                     # React 앱 엔트리 포인트 (ReactDOM 렌더링)
└── pages                        # 라우팅 단위의 페이지 컴포넌트
    ├── Home.tsx                 # 메인(홈) 페이지
    ├── Profile.tsx              # 사용자 프로필 페이지
    ├── SignIn.tsx               # 로그인 페이지
    └── SignUp.tsx               # 회원가입 페이지
```

## 📃 6. 메인 페이지 구현 중간 공유 (Post Timeline)
26.02.14
![6. Post Timeline](./images/06.%20Post%20Timeline.png)