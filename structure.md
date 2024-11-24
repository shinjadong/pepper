# Web-Obsi 프로젝트 구조 상세 분석 보고서

## 1. 프로젝트 개요

Web-Obsi는 Obsidian 스타일의 웹 기반 노트 작성 애플리케이션입니다. Next.js와 TypeScript를 기반으로 구축되었으며, 현대적인 웹 개발 도구와 기술들을 활용하고 있습니다.

## 2. 기술 스택

- **프레임워크**: Next.js (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **데이터베이스**: PostgreSQL + Prisma ORM
- **개발 도구**: ESLint, Prettier
- **컨테이너화**: Docker
- **상태 관리**: React Context
- **마크다운 처리**: 커스텀 마크다운 렌더러

## 3. 상세 디렉토리 구조

### 3.1 핵심 디렉토리

```
/app/                        # Next.js App Router
  ├─ api/                   # API 엔드포인트
  │  ├─ ai/                # AI 관련 API
  │  ├─ folders/           # 폴더 관리 API
  │  ├─ notes/             # 노트 관리 API
  │  ├─ moveNote/          # 노트 이동 API
  │  └─ removeNoteFromFolder/ # 노트 제거 API
  ├─ context/              # React Context
  ├─ data/                 # 데이터 관련
  ├─ docs/                 # 문서
  ├─ hooks/                # 커스텀 Hooks
  ├─ notes/                # 노트 관련 페이지
  ├─ error.tsx             # 에러 페이지
  ├─ layout.tsx            # 레이아웃
  ├─ page.tsx              # 메인 페이지
  └─ not-found.tsx         # 404 페이지

/components/               # UI 컴포넌트
  ├─ Folders/             # 폴더 관련 컴포넌트
  ├─ Notes/               # 노트 관련 컴포넌트
  ├─ breadcrumbs/         # 네비게이션 경로
  │  └─ Breadcrumbs.tsx   # 브레드크럼 컴포넌트
  ├─ context-menu/        # 우클릭 메뉴
  │  ├─ ContextMenu.tsx   # 컨텍스트 메뉴 컴포넌트
  │  └─ MenuItems.tsx     # 메뉴 아이템 컴포넌트
  ├─ draggable/           # 드래그 앤 드롭
  │  ├─ DragHandle.tsx    # 드래그 핸들
  │  ├─ Draggable.tsx     # 드래그 가능 컴포넌트
  │  └─ DropZone.tsx      # 드롭 영역 컴포넌트
  ├─ folder/              # 폴더 컴포넌트
  │  ├─ FolderIcon.tsx    # 폴더 아이콘
  │  ├─ FolderItem.tsx    # 폴더 아이템
  │  └─ FolderList.tsx    # 폴더 목록
  ├─ loader/              # 로딩 컴포넌트
  ├─ markdown-renderer/    # 마크다운 렌더링
  ├─ modal/               # 모달 컴포넌트
  ├─ note/                # 노트 컴포넌트
  │  ├─ NoteEditor.tsx    # 노트 에디터
  │  ├─ NoteList.tsx      # 노트 목록
  │  └─ NoteView.tsx      # 노트 뷰어
  ├─ note-edit/           # 노트 편집
  ├─ popover/             # 팝오버 컴포넌트
  ├─ sidebar/             # 사이드바
  │  ├─ Sidebar.tsx       # 메인 사이드바
  │  ├─ Navigation.tsx    # 네비게이션
  │  └─ TreeView.tsx      # 트리 뷰
  └─ ui/                  # 기본 UI 컴포넌트
      ├─ Button.tsx       # 버튼
      ├─ Input.tsx        # 입력 필드
      └─ Icons/           # 아이콘 컴포넌트

/lib/                     # 유틸리티 라이브러리
  ├─ ai.ts               # AI 기능 통합
  ├─ calendar.ts         # 캘린더 기능
  ├─ markdown.ts         # 마크다운 처리
  ├─ prisma.ts           # Prisma 클라이언트
  └─ sync.ts             # 데이터 동기화

/prisma/                  # Prisma ORM
  ├─ schema.prisma       # 데이터베이스 스키마
  └─ dev.db              # 개발용 데이터베이스

/services/               # 비즈니스 로직
  └─ prisma-client.ts    # Prisma 클라이언트 서비스

/types/                  # TypeScript 타입
  ├─ index.ts           # 메인 타입 정의
  └─ types.ts           # 추가 타입 정의
```

### 3.2 설정 파일

- `.env`: 환경 변수 설정
  - DATABASE_URL: PostgreSQL 연결 문자열
  - 기타 환경 설정
- `next.config.mjs`: Next.js 설정
  - 빌드 설정
  - 환경 설정
- `tsconfig.json`: TypeScript 설정
  - 컴파일러 옵션
  - 경로 별칭
- `tailwind.config.ts`: Tailwind CSS 설정
  - 테마 설정
  - 커스텀 스타일
- `.eslintrc.json`: ESLint 설정
  - 코드 스타일
  - 린트 규칙
- `.prettierrc`: Prettier 설정
  - 코드 포맷팅 규칙
- `Dockerfile` & `docker-compose.yaml`:
  - 컨테이너 설정
  - 개발/배포 환경 설정

## 4. 데이터베이스 구조

### 4.1 Prisma 스키마

```prisma
model Folder {
    id        String    @id @default(uuid())
    title     String
    parentId  String?
    parent    Folder?   @relation("FolderToFolder", fields: [parentId], references: [id])
    children  Folder[]  @relation("FolderToFolder")
    notes     Note[]
    createdAt DateTime  @default(now())
    updatedAt DateTime  @updatedAt
}

model Note {
    id        String   @id @default(uuid())
    title     String
    content   String   @default("")
    folderId  String
    folder    Folder   @relation(fields: [folderId], references: [id])
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}
```

### 4.2 데이터 관계

- **Folder 모델**:
  - 자기 참조 관계로 폴더 계층 구조 구현
  - 부모-자식 폴더 관계 (`parent`/`children`)
  - 폴더-노트 일대다 관계 (`notes`)
- **Note 모델**:
  - 폴더에 속한 노트 (`folder` 관계)
  - 마크다운 콘텐츠 저장
  - 생성/수정 시간 자동 추적

## 5. API 구조

### 5.1 엔드포인트

- `/api/folders/`: 폴더 CRUD 작업
- `/api/notes/`: 노트 CRUD 작업
- `/api/moveNote/`: 노트 이동
- `/api/removeNoteFromFolder/`: 노트 제거
- `/api/ai/`: AI 관련 기능

### 5.2 주요 기능

- 폴더 생성, 수정, 삭제, 조회
- 노트 생성, 수정, 삭제, 조회
- 노트 이동 및 조직화
- AI 통합 기능

## 6. 주요 기능

### 6.1 노트 관리

- 마크다운 기반 노트 작성
- 실시간 마크다운 프리뷰
- 폴더 구조를 통한 노트 조직화
- 드래그 앤 드롭으로 노트/폴더 관리

### 6.2 사용자 인터페이스

- 반응형 사이드바 네비게이션
- 컨텍스트 메뉴 (우클릭 메뉴)
- 브레드크럼 네비게이션
- 트리 뷰 폴더 구조
- 모달 및 팝오버 컴포넌트

### 6.3 고급 기능

- AI 기반 노트 분석 및 제안
- 캘린더 통합
- 실시간 데이터 동기화
- 자동 저장

## 7. 개발 환경

- TypeScript 기반 타입 안정성
- ESLint + Prettier 코드 품질 관리
- Docker 기반 개발/배포 환경
- PostgreSQL 데이터베이스

## 8. 결론

이 프로젝트는 현대적인 웹 개발 기술과 도구를 적극 활용하여 구축된 견고한 노트 작성 애플리케이션입니다. Next.js의 App Router와 TypeScript를 기반으로 하며, Prisma ORM을 통한 데이터베이스 관리, 컴포넌트 기반의 UI 구조, 그리고 AI 통합까지 포함하고 있습니다. 모듈화된 구조와 명확한 관심사 분리를 통해 유지보수성과 확장성을 확보하고 있습니다.

## 9. 개발 계획 및 수정 전략

### 9.1 프로젝트 목표

- 기존 Web-Obsi 프로젝트를 기반으로 AI 통합 노트 앱으로 확장
- Claude API를 활용한 지능형 어시스턴트 구현
- 크로스 플랫폼 동기화 및 오프라인 지원
- 개인화된 데이터 분석 및 학습 기능

### 9.2 단계별 구현 계획

#### Phase 1: AI 통합 (2-3주)

1. **Claude API 통합**

   ```typescript
   // services/ai/claude.ts
   interface ClaudeService {
     analyze: (content: string) => Promise<Analysis>;
     suggest: (context: EditorContext) => Promise<Suggestion>;
     complete: (prompt: string) => Promise<Completion>;
   }
   ```

   - Claude API 클라이언트 구현
   - 토큰 관리 및 요청 최적화
   - 에러 처리 및 재시도 로직

2. **실시간 AI 어시스턴트**

   ```typescript
   // components/ai/Assistant.tsx
   interface AIAssistant {
     mode: 'writing' | 'coding' | 'analysis';
     context: EditorContext;
     suggestions: Suggestion[];
   }
   ```

   - 커서 기반 상호작용
   - 컨텍스트 인식 시스템
   - 실시간 제안 엔진

3. **AI 컨텍스트 관리**
   ```typescript
   // lib/ai/context.ts
   interface ContextManager {
     track: (action: UserAction) => void;
     analyze: () => AIContext;
     predict: () => Prediction;
   }
   ```
   - 사용자 행동 추적
   - 컨텍스트 분석
   - 예측 모델

#### Phase 2: 동기화 시스템 (2주)

1. **Supabase 실시간 동기화**

   ```typescript
   // lib/sync/realtime.ts
   interface SyncManager {
     subscribe: (channel: string) => void;
     push: (change: Change) => Promise<void>;
     resolve: (conflict: Conflict) => Resolution;
   }
   ```

   - 실시간 구독 설정
   - 변경 사항 전파
   - 충돌 해결

2. **오프라인 지원**
   ```typescript
   // lib/sync/offline.ts
   interface OfflineManager {
     queue: ChangeQueue;
     storage: LocalStorage;
     sync: () => Promise<void>;
   }
   ```
   - 로컬 저장소
   - 변경 사항 큐
   - 동기화 관리

#### Phase 3: UI/UX 개선 (2-3주)

1. **AI 어시스턴트 UI**

   ```typescript
   // components/ai/Interface.tsx
   interface AIInterface {
     position: 'cursor' | 'sidebar' | 'floating';
     state: AIState;
     actions: AIActions;
   }
   ```

   - 반응형 디자인
   - 애니메이션
   - 접근성

2. **고급 편집기능**
   ```typescript
   // components/editor/Advanced.tsx
   interface AdvancedEditor {
     plugins: Plugin[];
     commands: Command[];
     shortcuts: Shortcut[];
   }
   ```
   - 커스텀 마크다운 확장
   - 단축키 시스템
   - 플러그인 아키텍처

#### Phase 4: 데이터 관리 (2주)

1. **태그 시스템**

   ```prisma
   model Tag {
     id        String   @id @default(uuid())
     name      String
     color     String?
     notes     Note[]
     createdAt DateTime @default(now())
   }
   ```

   - 태그 CRUD
   - 자동 태깅
   - 태그 기반 검색

2. **AI 기반 분석**
   ```typescript
   // lib/analytics/engine.ts
   interface AnalyticsEngine {
     analyze: (data: UserData) => Analysis;
     predict: (pattern: Pattern) => Prediction;
     suggest: (context: Context) => Suggestion;
   }
   ```
   - 사용 패턴 분석
   - 인사이트 생성
   - 추천 시스템

### 9.3 기술적 고려사항

#### 보안

- Claude API 키 관리
- 데이터 암호화
- 권한 관리

#### 성능

- AI 요청 최적화
- 동기화 효율성
- 캐싱 전략

#### 확장성

- 모듈식 설계
- 플러그인 시스템
- API 버전 관리

### 9.4 리소스 요구사항

#### 개발 환경

- Node.js 18+
- TypeScript 5+
- Docker

#### 외부 서비스

- Claude API
- Supabase
- Google Calendar API

#### 모니터링

- 에러 추적
- 성능 모니터링
- 사용량 분석

### 9.5 위험 요소 및 완화 전략

1. **기술적 위험**

   - AI API 한계: 로컬 폴백 구현
   - 동기화 충돌: 버전 관리 시스템
   - 성능 문제: 최적화 및 캐싱

2. **사용자 경험**
   - 학습 곡선: 직관적 UI/튜토리얼
   - 오프라인 접근성: 로컬 저장소
   - 동기화 지연: 상태 표시기

### 9.6 성공 지표

1. **기술적 지표**

   - API 응답 시간 < 500ms
   - 오프라인 가용성 > 99%
   - 동기화 성공률 > 99.9%

2. **사용자 지표**
   - 일일 활성 사용자
   - AI 상호작용 빈도
   - 사용자 만족도

### 9.7 유지보수 계획

1. **정기 업데이트**

   - 주간 버그 수정
   - 월간 기능 업데이트
   - 분기별 주요 릴리스

2. **모니터링**

   - 실시간 에러 추적
   - 성능 모니터링
   - 사용자 피드백

3. **백업 전략**

   - 일일 증분 백업
   - 주간 전체 백업
   - 재해 복구 계획

   C:\projects\temp\web-obsi>tree
   폴더 PATH의 목록입니다.
   볼륨 일련 번호는 F422-6036입니다.
   C:.
   ├─.next
   │ ├─cache
   │ │ ├─swc
   │ │ │ └─plugins
   │ │ │ └─v7*windows_x86_64_0.106.15
   │ │ └─webpack
   │ │ ├─client-development
   │ │ ├─client-development-fallback
   │ │ ├─edge-server-development
   │ │ └─server-development
   │ ├─server
   │ │ ├─app
   │ │ ├─static
   │ │ │ └─webpack
   │ │ └─vendor-chunks
   │ ├─static
   │ │ ├─chunks
   │ │ │ └─app
   │ │ ├─css
   │ │ │ └─app
   │ │ ├─development
   │ │ ├─media
   │ │ └─webpack
   │ │ └─app
   │ └─types
   │ └─app
   ├─api-calls
   ├─app
   │ ├─api
   │ │ ├─ai
   │ │ ├─folders
   │ │ ├─moveNote
   │ │ ├─notes
   │ │ │ └─[id]
   │ │ │ └─breadcrumbs
   │ │ └─removeNoteFromFolder
   │ ├─auth
   │ │ └─callback
   │ ├─components
   │ │ ├─auth
   │ │ ├─providers
   │ │ ├─shortcuts
   │ │ └─sidebar
   │ ├─constants
   │ ├─context
   │ ├─data
   │ ├─docs
   │ │ └─[name]
   │ ├─hooks
   │ ├─lib
   │ ├─notes
   │ │ ├─edit
   │ │ │ └─[id]
   │ │ └─[id]
   │ ├─services
   │ │ ├─folders
   │ │ ├─notes
   │ │ └─shortcuts
   │ ├─stores
   │ └─types
   ├─components
   │ ├─AI
   │ ├─assistant
   │ │ └─**tests**
   │ ├─breadcrumbs
   │ ├─context-menu
   │ ├─draggable
   │ ├─Editor
   │ ├─folder
   │ ├─Folders
   │ ├─loader
   │ ├─markdown-renderer
   │ ├─modal
   │ ├─note
   │ ├─note-edit
   │ ├─Notes
   │ ├─popover
   │ ├─shortcuts
   │ ├─sidebar
   │ └─ui
   │ └─skeletons
   ├─config
   ├─constants
   ├─context
   │ └─**tests**
   ├─lib
   ├─node_modules
   │ ├─.bin
   │ ├─.cache
   │ │ └─prisma
   │ │ └─master
   │ │ └─605197351a3c8bdd595af2d2a9bc3025bca48ea2
   │ │ └─windows
   │ ├─.prisma
   │ │ └─client
   │ │ └─deno
   │ ├─@aashutoshrathi
   │ │ └─word-wrap
   │ ├─@adobe
   │ │ └─css-tools
   │ │ └─dist
   │ ├─@alloc
   │ │ └─quick-lru
   │ ├─@ampproject
   │ │ └─remapping
   │ │ └─dist
   │ │ └─types
   │ ├─@anthropic-ai
   │ │ └─sdk
   │ │ ├─internal
   │ │ │ └─decoders
   │ │ ├─lib
   │ │ ├─node_modules
   │ │ │ ├─@types
   │ │ │ │ └─node
   │ │ │ │ ├─assert
   │ │ │ │ ├─compatibility
   │ │ │ │ ├─dns
   │ │ │ │ ├─fs
   │ │ │ │ ├─readline
   │ │ │ │ ├─stream
   │ │ │ │ ├─timers
   │ │ │ │ └─ts5.6
   │ │ │ └─undici-types
   │ │ ├─resources
   │ │ │ └─beta
   │ │ │ ├─messages
   │ │ │ └─prompt-caching
   │ │ ├─shims
   │ │ ├─src
   │ │ │ ├─internal
   │ │ │ │ └─decoders
   │ │ │ ├─lib
   │ │ │ ├─resources
   │ │ │ │ └─beta
   │ │ │ │ ├─messages
   │ │ │ │ └─prompt-caching
   │ │ │ ├─shims
   │ │ │ ├─_shims
   │ │ │ │ └─auto
   │ │ │ └─_vendor
   │ │ │ └─partial-json-parser
   │ │ ├─_shims
   │ │ │ └─auto
   │ │ └─_vendor
   │ │ └─partial-json-parser
   │ ├─@babel
   │ │ ├─code-frame
   │ │ │ └─lib
   │ │ ├─compat-data
   │ │ │ └─data
   │ │ ├─core
   │ │ │ ├─lib
   │ │ │ │ ├─config
   │ │ │ │ │ ├─files
   │ │ │ │ │ ├─helpers
   │ │ │ │ │ └─validation
   │ │ │ │ ├─errors
   │ │ │ │ ├─gensync-utils
   │ │ │ │ ├─parser
   │ │ │ │ │ └─util
   │ │ │ │ ├─tools
   │ │ │ │ ├─transformation
   │ │ │ │ │ ├─file
   │ │ │ │ │ └─util
   │ │ │ │ └─vendor
   │ │ │ ├─node_modules
   │ │ │ │ ├─.bin
   │ │ │ │ ├─json5
   │ │ │ │ │ ├─dist
   │ │ │ │ │ └─lib
   │ │ │ │ └─semver
   │ │ │ │ └─bin
   │ │ │ └─src
   │ │ │ └─config
   │ │ │ └─files
   │ │ ├─generator
   │ │ │ └─lib
   │ │ │ ├─generators
   │ │ │ └─node
   │ │ ├─helper-compilation-targets
   │ │ │ ├─lib
   │ │ │ └─node_modules
   │ │ │ ├─.bin
   │ │ │ ├─lru-cache
   │ │ │ ├─semver
   │ │ │ │ └─bin
   │ │ │ └─yallist
   │ │ ├─helper-module-imports
   │ │ │ └─lib
   │ │ ├─helper-module-transforms
   │ │ │ └─lib
   │ │ ├─helper-plugin-utils
   │ │ │ └─lib
   │ │ ├─helper-string-parser
   │ │ │ └─lib
   │ │ ├─helper-validator-identifier
   │ │ │ └─lib
   │ │ ├─helper-validator-option
   │ │ │ └─lib
   │ │ ├─helpers
   │ │ │ └─lib
   │ │ │ └─helpers
   │ │ ├─parser
   │ │ │ ├─bin
   │ │ │ ├─lib
   │ │ │ └─typings
   │ │ ├─plugin-syntax-async-generators
   │ │ │ └─lib
   │ │ ├─plugin-syntax-bigint
   │ │ │ └─lib
   │ │ ├─plugin-syntax-class-properties
   │ │ │ └─lib
   │ │ ├─plugin-syntax-class-static-block
   │ │ │ └─lib
   │ │ ├─plugin-syntax-import-attributes
   │ │ │ └─lib
   │ │ ├─plugin-syntax-import-meta
   │ │ │ └─lib
   │ │ ├─plugin-syntax-json-strings
   │ │ │ └─lib
   │ │ ├─plugin-syntax-jsx
   │ │ │ └─lib
   │ │ ├─plugin-syntax-logical-assignment-operators
   │ │ │ └─lib
   │ │ ├─plugin-syntax-nullish-coalescing-operator
   │ │ │ └─lib
   │ │ ├─plugin-syntax-numeric-separator
   │ │ │ └─lib
   │ │ ├─plugin-syntax-object-rest-spread
   │ │ │ └─lib
   │ │ ├─plugin-syntax-optional-catch-binding
   │ │ │ └─lib
   │ │ ├─plugin-syntax-optional-chaining
   │ │ │ └─lib
   │ │ ├─plugin-syntax-private-property-in-object
   │ │ │ └─lib
   │ │ ├─plugin-syntax-top-level-await
   │ │ │ └─lib
   │ │ ├─plugin-syntax-typescript
   │ │ │ └─lib
   │ │ ├─runtime
   │ │ │ ├─helpers
   │ │ │ │ └─esm
   │ │ │ └─regenerator
   │ │ ├─template
   │ │ │ └─lib
   │ │ ├─traverse
   │ │ │ ├─lib
   │ │ │ │ ├─path
   │ │ │ │ │ ├─inference
   │ │ │ │ │ └─lib
   │ │ │ │ └─scope
   │ │ │ │ └─lib
   │ │ │ └─node_modules
   │ │ │ └─globals
   │ │ └─types
   │ │ └─lib
   │ │ ├─asserts
   │ │ │ └─generated
   │ │ ├─ast-types
   │ │ │ └─generated
   │ │ ├─builders
   │ │ │ ├─flow
   │ │ │ ├─generated
   │ │ │ ├─react
   │ │ │ └─typescript
   │ │ ├─clone
   │ │ ├─comments
   │ │ ├─constants
   │ │ │ └─generated
   │ │ ├─converters
   │ │ ├─definitions
   │ │ ├─modifications
   │ │ │ ├─flow
   │ │ │ └─typescript
   │ │ ├─retrievers
   │ │ ├─traverse
   │ │ ├─utils
   │ │ │ └─react
   │ │ └─validators
   │ │ ├─generated
   │ │ └─react
   │ ├─@bcoe
   │ │ └─v8-coverage
   │ │ ├─dist
   │ │ │ └─lib
   │ │ │ └─_src
   │ │ └─src
   │ │ ├─lib
   │ │ └─test
   │ ├─@dnd-kit
   │ │ ├─accessibility
   │ │ │ └─dist
   │ │ │ ├─components
   │ │ │ │ ├─HiddenText
   │ │ │ │ └─LiveRegion
   │ │ │ └─hooks
   │ │ ├─core
   │ │ │ └─dist
   │ │ │ ├─components
   │ │ │ │ ├─Accessibility
   │ │ │ │ │ └─components
   │ │ │ │ ├─DndContext
   │ │ │ │ │ └─hooks
   │ │ │ │ ├─DndMonitor
   │ │ │ │ └─DragOverlay
   │ │ │ │ ├─components
   │ │ │ │ │ ├─AnimationManager
   │ │ │ │ │ ├─NullifiedContextProvider
   │ │ │ │ │ └─PositionedOverlay
   │ │ │ │ └─hooks
   │ │ │ ├─hooks
   │ │ │ │ └─utilities
   │ │ │ ├─modifiers
   │ │ │ ├─sensors
   │ │ │ │ ├─keyboard
   │ │ │ │ ├─mouse
   │ │ │ │ ├─pointer
   │ │ │ │ ├─touch
   │ │ │ │ └─utilities
   │ │ │ ├─store
   │ │ │ ├─types
   │ │ │ └─utilities
   │ │ │ ├─algorithms
   │ │ │ ├─coordinates
   │ │ │ ├─nodes
   │ │ │ ├─other
   │ │ │ ├─rect
   │ │ │ ├─scroll
   │ │ │ └─transform
   │ │ └─utilities
   │ │ └─dist
   │ │ ├─coordinates
   │ │ ├─event
   │ │ ├─execution-context
   │ │ ├─focus
   │ │ ├─hooks
   │ │ └─type-guards
   │ ├─@eslint
   │ │ ├─eslintrc
   │ │ │ ├─conf
   │ │ │ ├─dist
   │ │ │ └─lib
   │ │ │ ├─config-array
   │ │ │ └─shared
   │ │ └─js
   │ │ └─src
   │ │ └─configs
   │ ├─@eslint-community
   │ │ ├─eslint-utils
   │ │ └─regexpp
   │ ├─@humanwhocodes
   │ │ ├─config-array
   │ │ ├─module-importer
   │ │ │ ├─dist
   │ │ │ └─src
   │ │ └─object-schema
   │ │ └─src
   │ ├─@isaacs
   │ │ └─cliui
   │ │ ├─build
   │ │ │ └─lib
   │ │ └─node_modules
   │ │ ├─ansi-regex
   │ │ └─strip-ansi
   │ ├─@istanbuljs
   │ │ ├─load-nyc-config
   │ │ │ └─node_modules
   │ │ │ ├─.bin
   │ │ │ ├─argparse
   │ │ │ │ └─lib
   │ │ │ │ ├─action
   │ │ │ │ │ ├─append
   │ │ │ │ │ └─store
   │ │ │ │ ├─argument
   │ │ │ │ └─help
   │ │ │ ├─find-up
   │ │ │ ├─js-yaml
   │ │ │ │ ├─bin
   │ │ │ │ ├─dist
   │ │ │ │ └─lib
   │ │ │ │ └─js-yaml
   │ │ │ │ ├─schema
   │ │ │ │ └─type
   │ │ │ │ └─js
   │ │ │ ├─locate-path
   │ │ │ ├─p-limit
   │ │ │ ├─p-locate
   │ │ │ └─resolve-from
   │ │ └─schema
   │ ├─@jest
   │ │ ├─console
   │ │ │ └─build
   │ │ ├─core
   │ │ │ ├─build
   │ │ │ │ ├─cli
   │ │ │ │ ├─lib
   │ │ │ │ └─plugins
   │ │ │ └─node_modules
   │ │ │ ├─ansi-styles
   │ │ │ ├─pretty-format
   │ │ │ │ └─build
   │ │ │ │ └─plugins
   │ │ │ │ └─lib
   │ │ │ └─react-is
   │ │ │ ├─cjs
   │ │ │ └─umd
   │ │ ├─environment
   │ │ │ └─build
   │ │ ├─expect
   │ │ │ └─build
   │ │ ├─expect-utils
   │ │ │ └─build
   │ │ ├─fake-timers
   │ │ │ └─build
   │ │ ├─globals
   │ │ │ └─build
   │ │ ├─reporters
   │ │ │ ├─assets
   │ │ │ ├─build
   │ │ │ └─node_modules
   │ │ │ └─glob
   │ │ ├─schemas
   │ │ │ └─build
   │ │ ├─source-map
   │ │ │ └─build
   │ │ ├─test-result
   │ │ │ └─build
   │ │ ├─test-sequencer
   │ │ │ └─build
   │ │ ├─transform
   │ │ │ └─build
   │ │ └─types
   │ │ └─build
   │ ├─@jridgewell
   │ │ ├─gen-mapping
   │ │ │ └─dist
   │ │ │ └─types
   │ │ ├─resolve-uri
   │ │ │ └─dist
   │ │ │ └─types
   │ │ ├─set-array
   │ │ │ └─dist
   │ │ │ └─types
   │ │ ├─sourcemap-codec
   │ │ │ └─dist
   │ │ │ └─types
   │ │ └─trace-mapping
   │ │ └─dist
   │ │ └─types
   │ ├─@monaco-editor
   │ │ ├─loader
   │ │ │ ├─lib
   │ │ │ │ ├─cjs
   │ │ │ │ │ ├─config
   │ │ │ │ │ ├─loader
   │ │ │ │ │ ├─utils
   │ │ │ │ │ ├─validators
   │ │ │ │ │ └─_virtual
   │ │ │ │ ├─es
   │ │ │ │ │ ├─config
   │ │ │ │ │ ├─loader
   │ │ │ │ │ ├─utils
   │ │ │ │ │ ├─validators
   │ │ │ │ │ └─_virtual
   │ │ │ │ └─umd
   │ │ │ └─playground
   │ │ └─react
   │ │ ├─.github
   │ │ │ └─ISSUE_TEMPLATE
   │ │ └─dist
   │ ├─@next
   │ │ ├─env
   │ │ │ └─dist
   │ │ ├─eslint-plugin-next
   │ │ │ └─dist
   │ │ │ ├─rules
   │ │ │ └─utils
   │ │ └─swc-win32-x64-msvc
   │ ├─@nodelib
   │ │ ├─fs.scandir
   │ │ │ └─out
   │ │ │ ├─adapters
   │ │ │ ├─providers
   │ │ │ ├─types
   │ │ │ └─utils
   │ │ ├─fs.stat
   │ │ │ └─out
   │ │ │ ├─adapters
   │ │ │ ├─providers
   │ │ │ └─types
   │ │ └─fs.walk
   │ │ └─out
   │ │ ├─providers
   │ │ ├─readers
   │ │ └─types
   │ ├─@panva
   │ │ └─hkdf
   │ │ └─dist
   │ │ ├─node
   │ │ │ ├─cjs
   │ │ │ │ └─runtime
   │ │ │ └─esm
   │ │ │ └─runtime
   │ │ ├─types
   │ │ └─web
   │ │ └─runtime
   │ ├─@pkgjs
   │ │ └─parseargs
   │ │ ├─examples
   │ │ └─internal
   │ ├─@pkgr
   │ │ └─core
   │ │ └─lib
   │ ├─@prisma
   │ ├─@radix-ui
   │ │ ├─primitive
   │ │ │ └─dist
   │ │ ├─react-compose-refs
   │ │ │ └─dist
   │ │ ├─react-context
   │ │ │ └─dist
   │ │ ├─react-dialog
   │ │ │ └─dist
   │ │ ├─react-dismissable-layer
   │ │ │ └─dist
   │ │ ├─react-focus-guards
   │ │ │ └─dist
   │ │ ├─react-focus-scope
   │ │ │ └─dist
   │ │ ├─react-id
   │ │ │ └─dist
   │ │ ├─react-portal
   │ │ │ └─dist
   │ │ ├─react-presence
   │ │ │ └─dist
   │ │ ├─react-primitive
   │ │ │ └─dist
   │ │ ├─react-slot
   │ │ │ └─dist
   │ │ ├─react-use-callback-ref
   │ │ │ └─dist
   │ │ ├─react-use-controllable-state
   │ │ │ └─dist
   │ │ ├─react-use-escape-keydown
   │ │ │ └─dist
   │ │ └─react-use-layout-effect
   │ │ └─dist
   │ ├─@rushstack
   │ │ └─eslint-patch
   │ │ └─lib
   │ │ ├─eslint-bulk-suppressions
   │ │ │ └─cli
   │ │ │ └─utils
   │ │ └─exports
   │ ├─@sinclair
   │ │ └─typebox
   │ │ ├─compiler
   │ │ ├─errors
   │ │ ├─system
   │ │ └─value
   │ ├─@sinonjs
   │ │ ├─commons
   │ │ │ ├─lib
   │ │ │ │ └─prototypes
   │ │ │ └─types
   │ │ │ └─prototypes
   │ │ └─fake-timers
   │ │ └─src
   │ ├─@supabase
   │ │ ├─auth-helpers-nextjs
   │ │ │ ├─.turbo
   │ │ │ ├─dist
   │ │ │ └─src
   │ │ ├─auth-helpers-shared
   │ │ │ └─dist
   │ │ ├─auth-js
   │ │ │ ├─dist
   │ │ │ │ ├─main
   │ │ │ │ │ └─lib
   │ │ │ │ └─module
   │ │ │ │ └─lib
   │ │ │ └─src
   │ │ │ └─lib
   │ │ ├─functions-js
   │ │ │ ├─dist
   │ │ │ │ ├─main
   │ │ │ │ └─module
   │ │ │ └─src
   │ │ ├─node-fetch
   │ │ │ └─lib
   │ │ ├─postgrest-js
   │ │ │ ├─dist
   │ │ │ │ ├─cjs
   │ │ │ │ └─esm
   │ │ │ └─src
   │ │ ├─realtime-js
   │ │ │ ├─dist
   │ │ │ │ ├─main
   │ │ │ │ │ └─lib
   │ │ │ │ └─module
   │ │ │ │ └─lib
   │ │ │ └─src
   │ │ │ └─lib
   │ │ ├─storage-js
   │ │ │ ├─dist
   │ │ │ │ ├─main
   │ │ │ │ │ ├─lib
   │ │ │ │ │ └─packages
   │ │ │ │ ├─module
   │ │ │ │ │ ├─lib
   │ │ │ │ │ └─packages
   │ │ │ │ └─umd
   │ │ │ └─src
   │ │ │ ├─lib
   │ │ │ └─packages
   │ │ └─supabase-js
   │ │ ├─dist
   │ │ │ ├─main
   │ │ │ │ └─lib
   │ │ │ ├─module
   │ │ │ │ └─lib
   │ │ │ └─umd
   │ │ └─src
   │ │ └─lib
   │ ├─@swc
   │ │ ├─counter
   │ │ └─helpers
   │ │ ├─cjs
   │ │ ├─esm
   │ │ ├─scripts
   │ │ ├─src
   │ │ └─*
   │ │ ├─index
   │ │ ├─*apply_decorated_descriptor
   │ │ ├─_apply_decs_2203_r
   │ │ ├─_array_like_to_array
   │ │ ├─_array_without_holes
   │ │ ├─_array_with_holes
   │ │ ├─_assert_this_initialized
   │ │ ├─_async_generator
   │ │ ├─_async_generator_delegate
   │ │ ├─_async_iterator
   │ │ ├─_async_to_generator
   │ │ ├─_await_async_generator
   │ │ ├─_await_value
   │ │ ├─_check_private_redeclaration
   │ │ ├─_class_apply_descriptor_destructure
   │ │ ├─_class_apply_descriptor_get
   │ │ ├─_class_apply_descriptor_set
   │ │ ├─_class_apply_descriptor_update
   │ │ ├─_class_call_check
   │ │ ├─_class_check_private_static_access
   │ │ ├─_class_check_private_static_field_descriptor
   │ │ ├─_class_extract_field_descriptor
   │ │ ├─_class_name_tdz_error
   │ │ ├─_class_private_field_destructure
   │ │ ├─_class_private_field_get
   │ │ ├─_class_private_field_init
   │ │ ├─_class_private_field_loose_base
   │ │ ├─_class_private_field_loose_key
   │ │ ├─_class_private_field_set
   │ │ ├─_class_private_field_update
   │ │ ├─_class_private_method_get
   │ │ ├─_class_private_method_init
   │ │ ├─_class_private_method_set
   │ │ ├─_class_static_private_field_destructure
   │ │ ├─_class_static_private_field_spec_get
   │ │ ├─_class_static_private_field_spec_set
   │ │ ├─_class_static_private_field_update
   │ │ ├─_class_static_private_method_get
   │ │ ├─_construct
   │ │ ├─_create_class
   │ │ ├─_create_for_of_iterator_helper_loose
   │ │ ├─_create_super
   │ │ ├─_decorate
   │ │ ├─_defaults
   │ │ ├─_define_enumerable_properties
   │ │ ├─_define_property
   │ │ ├─_dispose
   │ │ ├─_export_star
   │ │ ├─_extends
   │ │ ├─_get
   │ │ ├─_get_prototype_of
   │ │ ├─_inherits
   │ │ ├─_inherits_loose
   │ │ ├─_initializer_define_property
   │ │ ├─_initializer_warning_helper
   │ │ ├─_instanceof
   │ │ ├─_interop_require_default
   │ │ ├─_interop_require_wildcard
   │ │ ├─_is_native_function
   │ │ ├─_is_native_reflect_construct
   │ │ ├─_iterable_to_array
   │ │ ├─_iterable_to_array_limit
   │ │ ├─_iterable_to_array_limit_loose
   │ │ ├─_jsx
   │ │ ├─_new_arrow_check
   │ │ ├─_non_iterable_rest
   │ │ ├─_non_iterable_spread
   │ │ ├─_object_destructuring_empty
   │ │ ├─_object_spread
   │ │ ├─_object_spread_props
   │ │ ├─_object_without_properties
   │ │ ├─_object_without_properties_loose
   │ │ ├─_possible_constructor_return
   │ │ ├─_read_only_error
   │ │ ├─_set
   │ │ ├─_set_prototype_of
   │ │ ├─_skip_first_generator_next
   │ │ ├─_sliced_to_array
   │ │ ├─_sliced_to_array_loose
   │ │ ├─_super_prop_base
   │ │ ├─_tagged_template_literal
   │ │ ├─_tagged_template_literal_loose
   │ │ ├─_throw
   │ │ ├─_to_array
   │ │ ├─_to_consumable_array
   │ │ ├─_to_primitive
   │ │ ├─_to_property_key
   │ │ ├─_ts_decorate
   │ │ ├─_ts_generator
   │ │ ├─_ts_metadata
   │ │ ├─_ts_param
   │ │ ├─_ts_values
   │ │ ├─_type_of
   │ │ ├─_unsupported_iterable_to_array
   │ │ ├─_update
   │ │ ├─_using
   │ │ ├─_wrap_async_generator
   │ │ ├─_wrap_native_super
   │ │ └─_write_only_error
   │ ├─@tailwindcss
   │ │ └─typography
   │ │ ├─node_modules
   │ │ │ └─postcss-selector-parser
   │ │ │ └─dist
   │ │ │ ├─selectors
   │ │ │ └─util
   │ │ └─src
   │ ├─@testing-library
   │ │ ├─dom
   │ │ │ ├─dist
   │ │ │ │ ├─@testing-library
   │ │ │ │ └─queries
   │ │ │ ├─node_modules
   │ │ │ │ ├─ansi-styles
   │ │ │ │ ├─aria-query
   │ │ │ │ │ └─lib
   │ │ │ │ │ ├─etc
   │ │ │ │ │ │ └─roles
   │ │ │ │ │ │ ├─abstract
   │ │ │ │ │ │ ├─dpub
   │ │ │ │ │ │ ├─graphics
   │ │ │ │ │ │ └─literal
   │ │ │ │ │ └─util
   │ │ │ │ ├─dom-accessibility-api
   │ │ │ │ │ └─dist
   │ │ │ │ │ └─polyfills
   │ │ │ │ ├─pretty-format
   │ │ │ │ │ └─build
   │ │ │ │ │ └─plugins
   │ │ │ │ │ └─lib
   │ │ │ │ └─react-is
   │ │ │ │ ├─cjs
   │ │ │ │ └─umd
   │ │ │ └─types
   │ │ ├─jest-dom
   │ │ │ ├─dist
   │ │ │ ├─node_modules
   │ │ │ │ └─chalk
   │ │ │ │ └─source
   │ │ │ └─types
   │ │ │ └─**tests**
   │ │ │ ├─bun
   │ │ │ ├─jest
   │ │ │ ├─jest-globals
   │ │ │ └─vitest
   │ │ └─react
   │ │ ├─dist
   │ │ │ └─@testing-library
   │ │ └─types
   │ ├─@tootallnate
   │ │ └─once
   │ │ └─dist
   │ ├─@types
   │ │ ├─aria-query
   │ │ ├─babel**core
   │ │ ├─babel**generator
   │ │ ├─babel**template
   │ │ ├─babel**traverse
   │ │ ├─debug
   │ │ ├─estree
   │ │ ├─estree-jsx
   │ │ ├─graceful-fs
   │ │ ├─hast
   │ │ ├─istanbul-lib-coverage
   │ │ ├─istanbul-lib-report
   │ │ ├─istanbul-reports
   │ │ ├─jest
   │ │ │ └─node_modules
   │ │ │ ├─ansi-styles
   │ │ │ ├─pretty-format
   │ │ │ │ └─build
   │ │ │ │ └─plugins
   │ │ │ │ └─lib
   │ │ │ └─react-is
   │ │ │ ├─cjs
   │ │ │ └─umd
   │ │ ├─jsdom
   │ │ ├─json5
   │ │ ├─mdast
   │ │ ├─ms
   │ │ ├─node
   │ │ │ ├─assert
   │ │ │ ├─compatibility
   │ │ │ ├─dns
   │ │ │ ├─fs
   │ │ │ ├─readline
   │ │ │ ├─stream
   │ │ │ ├─timers
   │ │ │ └─ts5.6
   │ │ ├─node-fetch
   │ │ ├─phoenix
   │ │ ├─prismjs
   │ │ │ └─components
   │ │ ├─prop-types
   │ │ ├─react
   │ │ │ └─ts5.0
   │ │ ├─react-dom
   │ │ │ └─test-utils
   │ │ ├─react-syntax-highlighter
   │ │ ├─stack-utils
   │ │ ├─tough-cookie
   │ │ ├─unist
   │ │ ├─uuid
   │ │ ├─ws
   │ │ ├─yargs
   │ │ └─yargs-parser
   │ ├─@typescript-eslint
   │ │ ├─eslint-plugin
   │ │ │ ├─dist
   │ │ │ │ ├─configs
   │ │ │ │ ├─rules
   │ │ │ │ │ ├─enum-utils
   │ │ │ │ │ ├─naming-convention-utils
   │ │ │ │ │ └─prefer-optional-chain-utils
   │ │ │ │ └─util
   │ │ │ └─docs
   │ │ │ └─rules
   │ │ ├─parser
   │ │ │ └─dist
   │ │ ├─scope-manager
   │ │ │ └─dist
   │ │ │ ├─definition
   │ │ │ ├─lib
   │ │ │ ├─referencer
   │ │ │ ├─scope
   │ │ │ └─variable
   │ │ ├─type-utils
   │ │ │ └─dist
   │ │ ├─types
   │ │ │ └─dist
   │ │ │ └─generated
   │ │ ├─typescript-estree
   │ │ │ ├─dist
   │ │ │ │ ├─create-program
   │ │ │ │ ├─jsx
   │ │ │ │ ├─parseSettings
   │ │ │ │ └─ts-estree
   │ │ │ └─node_modules
   │ │ │ ├─brace-expansion
   │ │ │ │ └─.github
   │ │ │ └─minimatch
   │ │ │ └─dist
   │ │ │ ├─commonjs
   │ │ │ └─esm
   │ │ ├─utils
   │ │ │ └─dist
   │ │ │ ├─ast-utils
   │ │ │ │ └─eslint-utils
   │ │ │ ├─eslint-utils
   │ │ │ ├─ts-eslint
   │ │ │ │ └─eslint
   │ │ │ └─ts-utils
   │ │ └─visitor-keys
   │ │ └─dist
   │ ├─@uiw
   │ │ ├─copy-to-clipboard
   │ │ │ └─dist
   │ │ │ ├─css
   │ │ │ ├─js
   │ │ │ └─lcov-report
   │ │ └─react-markdown-preview
   │ │ ├─dist
   │ │ ├─esm
   │ │ │ ├─nodes
   │ │ │ ├─plugins
   │ │ │ └─styles
   │ │ ├─lib
   │ │ │ ├─nodes
   │ │ │ ├─plugins
   │ │ │ └─styles
   │ │ └─src
   │ │ ├─nodes
   │ │ ├─plugins
   │ │ └─styles
   │ ├─@ungap
   │ │ └─structured-clone
   │ │ ├─.github
   │ │ │ └─workflows
   │ │ ├─cjs
   │ │ └─esm
   │ ├─abab
   │ │ └─lib
   │ ├─abort-controller
   │ │ └─dist
   │ ├─acorn
   │ │ ├─bin
   │ │ └─dist
   │ ├─acorn-globals
   │ ├─acorn-jsx
   │ ├─acorn-walk
   │ │ └─dist
   │ ├─agent-base
   │ │ ├─dist
   │ │ │ └─src
   │ │ └─src
   │ ├─agentkeepalive
   │ │ └─lib
   │ ├─ajv
   │ │ ├─dist
   │ │ ├─lib
   │ │ │ ├─compile
   │ │ │ ├─dot
   │ │ │ ├─dotjs
   │ │ │ └─refs
   │ │ └─scripts
   │ ├─ansi-escapes
   │ │ └─node_modules
   │ │ └─type-fest
   │ │ ├─source
   │ │ └─ts41
   │ ├─ansi-regex
   │ ├─ansi-styles
   │ ├─any-promise
   │ │ └─register
   │ ├─anymatch
   │ ├─arg
   │ ├─argparse
   │ │ └─lib
   │ ├─aria-hidden
   │ │ └─dist
   │ │ ├─es2015
   │ │ ├─es2019
   │ │ └─es5
   │ ├─aria-query
   │ │ └─lib
   │ │ ├─etc
   │ │ │ └─roles
   │ │ │ ├─abstract
   │ │ │ ├─dpub
   │ │ │ ├─graphics
   │ │ │ └─literal
   │ │ └─util
   │ ├─array-buffer-byte-length
   │ │ ├─.github
   │ │ └─test
   │ ├─array-includes
   │ │ ├─.github
   │ │ └─test
   │ ├─array-union
   │ ├─array.prototype.findlast
   │ │ ├─.github
   │ │ └─test
   │ ├─array.prototype.findlastindex
   │ │ ├─.github
   │ │ └─test
   │ ├─array.prototype.flat
   │ │ ├─.github
   │ │ └─test
   │ ├─array.prototype.flatmap
   │ │ ├─.github
   │ │ └─test
   │ ├─array.prototype.toreversed
   │ │ ├─.github
   │ │ └─test
   │ ├─array.prototype.tosorted
   │ │ ├─.github
   │ │ └─test
   │ ├─arraybuffer.prototype.slice
   │ │ └─test
   │ ├─ast-types-flow
   │ │ └─lib
   │ ├─asynckit
   │ │ └─lib
   │ ├─available-typed-arrays
   │ │ ├─.github
   │ │ └─test
   │ ├─axe-core
   │ │ └─locales
   │ ├─axios
   │ │ ├─dist
   │ │ │ ├─browser
   │ │ │ ├─esm
   │ │ │ └─node
   │ │ └─lib
   │ │ ├─adapters
   │ │ ├─cancel
   │ │ ├─core
   │ │ ├─defaults
   │ │ ├─env
   │ │ │ └─classes
   │ │ ├─helpers
   │ │ └─platform
   │ │ ├─browser
   │ │ │ └─classes
   │ │ ├─common
   │ │ └─node
   │ │ └─classes
   │ ├─axobject-query
   │ │ └─lib
   │ │ ├─etc
   │ │ │ └─objects
   │ │ └─util
   │ ├─babel-jest
   │ │ └─build
   │ ├─babel-plugin-istanbul
   │ │ ├─lib
   │ │ └─node_modules
   │ │ ├─.bin
   │ │ ├─istanbul-lib-instrument
   │ │ │ └─src
   │ │ └─semver
   │ │ └─bin
   │ ├─babel-plugin-jest-hoist
   │ │ └─build
   │ ├─babel-preset-current-node-syntax
   │ │ ├─.github
   │ │ │ └─workflows
   │ │ └─src
   │ ├─babel-preset-jest
   │ ├─bail
   │ ├─balanced-match
   │ │ └─.github
   │ ├─bcp-47-match
   │ ├─binary-extensions
   │ ├─boolbase
   │ ├─brace-expansion
   │ ├─braces
   │ │ └─lib
   │ ├─browserslist
   │ ├─bser
   │ ├─buffer-from
   │ ├─busboy
   │ │ ├─.github
   │ │ │ └─workflows
   │ │ ├─bench
   │ │ ├─lib
   │ │ │ └─types
   │ │ └─test
   │ ├─call-bind
   │ │ ├─.github
   │ │ └─test
   │ ├─callsites
   │ ├─camelcase
   │ ├─camelcase-css
   │ ├─caniuse-lite
   │ │ ├─data
   │ │ │ ├─features
   │ │ │ └─regions
   │ │ └─dist
   │ │ ├─lib
   │ │ └─unpacker
   │ ├─ccount
   │ ├─chalk
   │ │ └─source
   │ ├─char-regex
   │ ├─character-entities
   │ ├─character-entities-html4
   │ ├─character-entities-legacy
   │ ├─character-reference-invalid
   │ ├─chokidar
   │ │ ├─lib
   │ │ ├─node_modules
   │ │ │ └─glob-parent
   │ │ └─types
   │ ├─ci-info
   │ ├─cjs-module-lexer
   │ │ └─dist
   │ ├─class-variance-authority
   │ │ ├─dist
   │ │ └─node_modules
   │ │ └─clsx
   │ │ └─dist
   │ ├─client-only
   │ ├─cliui
   │ │ ├─build
   │ │ │ └─lib
   │ │ └─node_modules
   │ │ ├─emoji-regex
   │ │ │ └─es2015
   │ │ ├─string-width
   │ │ └─wrap-ansi
   │ ├─clsx
   │ │ └─dist
   │ ├─co
   │ ├─collect-v8-coverage
   │ ├─color-convert
   │ ├─color-name
   │ ├─combined-stream
   │ │ └─lib
   │ ├─comma-separated-tokens
   │ ├─commander
   │ │ └─typings
   │ ├─concat-map
   │ │ ├─example
   │ │ └─test
   │ ├─convert-source-map
   │ ├─cookie
   │ ├─create-jest
   │ │ ├─bin
   │ │ └─build
   │ ├─cross-spawn
   │ │ └─lib
   │ │ └─util
   │ ├─css-selector-parser
   │ │ └─dist
   │ │ ├─cjs
   │ │ └─mjs
   │ ├─css.escape
   │ ├─cssesc
   │ │ ├─bin
   │ │ └─man
   │ ├─cssom
   │ │ └─lib
   │ ├─cssstyle
   │ │ ├─lib
   │ │ │ ├─properties
   │ │ │ └─utils
   │ │ └─node_modules
   │ │ └─cssom
   │ │ └─lib
   │ ├─csstype
   │ ├─damerau-levenshtein
   │ │ ├─scripts
   │ │ └─test
   │ ├─data-urls
   │ │ ├─lib
   │ │ └─node_modules
   │ │ ├─tr46
   │ │ │ └─lib
   │ │ ├─webidl-conversions
   │ │ │ └─lib
   │ │ └─whatwg-url
   │ │ └─lib
   │ ├─data-view-buffer
   │ │ ├─.github
   │ │ └─test
   │ ├─data-view-byte-length
   │ │ ├─.github
   │ │ └─test
   │ ├─data-view-byte-offset
   │ │ ├─.github
   │ │ └─test
   │ ├─date-fns
   │ │ ├─docs
   │ │ ├─fp
   │ │ │ └─_lib
   │ │ ├─locale
   │ │ │ ├─af
   │ │ │ │ └─_lib
   │ │ │ ├─ar
   │ │ │ │ └─_lib
   │ │ │ ├─ar-DZ
   │ │ │ │ └─_lib
   │ │ │ ├─ar-EG
   │ │ │ │ └─_lib
   │ │ │ ├─ar-MA
   │ │ │ │ └─_lib
   │ │ │ ├─ar-SA
   │ │ │ │ └─_lib
   │ │ │ ├─ar-TN
   │ │ │ │ └─_lib
   │ │ │ ├─az
   │ │ │ │ └─_lib
   │ │ │ ├─be
   │ │ │ │ └─_lib
   │ │ │ ├─be-tarask
   │ │ │ │ └─_lib
   │ │ │ ├─bg
   │ │ │ │ └─_lib
   │ │ │ ├─bn
   │ │ │ │ └─_lib
   │ │ │ ├─bs
   │ │ │ │ └─_lib
   │ │ │ ├─ca
   │ │ │ │ └─_lib
   │ │ │ ├─ckb
   │ │ │ │ └─_lib
   │ │ │ ├─cs
   │ │ │ │ └─_lib
   │ │ │ ├─cy
   │ │ │ │ └─_lib
   │ │ │ ├─da
   │ │ │ │ └─_lib
   │ │ │ ├─de
   │ │ │ │ └─_lib
   │ │ │ ├─de-AT
   │ │ │ │ └─_lib
   │ │ │ ├─el
   │ │ │ │ └─_lib
   │ │ │ ├─en-AU
   │ │ │ │ └─_lib
   │ │ │ ├─en-CA
   │ │ │ │ └─_lib
   │ │ │ ├─en-GB
   │ │ │ │ └─_lib
   │ │ │ ├─en-IE
   │ │ │ ├─en-IN
   │ │ │ │ └─_lib
   │ │ │ ├─en-NZ
   │ │ │ │ └─_lib
   │ │ │ ├─en-US
   │ │ │ │ └─_lib
   │ │ │ ├─en-ZA
   │ │ │ │ └─_lib
   │ │ │ ├─eo
   │ │ │ │ └─_lib
   │ │ │ ├─es
   │ │ │ │ └─_lib
   │ │ │ ├─et
   │ │ │ │ └─_lib
   │ │ │ ├─eu
   │ │ │ │ └─_lib
   │ │ │ ├─fa-IR
   │ │ │ │ └─_lib
   │ │ │ ├─fi
   │ │ │ │ └─_lib
   │ │ │ ├─fr
   │ │ │ │ └─_lib
   │ │ │ ├─fr-CA
   │ │ │ │ └─_lib
   │ │ │ ├─fr-CH
   │ │ │ │ └─_lib
   │ │ │ ├─fy
   │ │ │ │ └─_lib
   │ │ │ ├─gd
   │ │ │ │ └─_lib
   │ │ │ ├─gl
   │ │ │ │ └─_lib
   │ │ │ ├─gu
   │ │ │ │ └─_lib
   │ │ │ ├─he
   │ │ │ │ └─_lib
   │ │ │ ├─hi
   │ │ │ │ └─_lib
   │ │ │ ├─hr
   │ │ │ │ └─_lib
   │ │ │ ├─ht
   │ │ │ │ └─_lib
   │ │ │ ├─hu
   │ │ │ │ └─_lib
   │ │ │ ├─hy
   │ │ │ │ └─_lib
   │ │ │ ├─id
   │ │ │ │ └─_lib
   │ │ │ ├─is
   │ │ │ │ └─_lib
   │ │ │ ├─it
   │ │ │ │ └─_lib
   │ │ │ ├─it-CH
   │ │ │ │ └─_lib
   │ │ │ ├─ja
   │ │ │ │ └─_lib
   │ │ │ ├─ja-Hira
   │ │ │ │ └─_lib
   │ │ │ ├─ka
   │ │ │ │ └─_lib
   │ │ │ ├─kk
   │ │ │ │ └─_lib
   │ │ │ ├─km
   │ │ │ │ └─_lib
   │ │ │ ├─kn
   │ │ │ │ └─_lib
   │ │ │ ├─ko
   │ │ │ │ └─_lib
   │ │ │ ├─lb
   │ │ │ │ └─_lib
   │ │ │ ├─lt
   │ │ │ │ └─_lib
   │ │ │ ├─lv
   │ │ │ │ └─_lib
   │ │ │ ├─mk
   │ │ │ │ └─_lib
   │ │ │ ├─mn
   │ │ │ │ └─_lib
   │ │ │ ├─ms
   │ │ │ │ └─_lib
   │ │ │ ├─mt
   │ │ │ │ └─_lib
   │ │ │ ├─nb
   │ │ │ │ └─_lib
   │ │ │ ├─nl
   │ │ │ │ └─_lib
   │ │ │ ├─nl-BE
   │ │ │ │ └─_lib
   │ │ │ ├─nn
   │ │ │ │ └─_lib
   │ │ │ ├─oc
   │ │ │ │ └─_lib
   │ │ │ ├─pl
   │ │ │ │ └─_lib
   │ │ │ ├─pt
   │ │ │ │ └─_lib
   │ │ │ ├─pt-BR
   │ │ │ │ └─_lib
   │ │ │ ├─ro
   │ │ │ │ └─_lib
   │ │ │ ├─ru
   │ │ │ │ └─_lib
   │ │ │ ├─se
   │ │ │ │ └─_lib
   │ │ │ ├─sk
   │ │ │ │ └─_lib
   │ │ │ ├─sl
   │ │ │ │ └─_lib
   │ │ │ ├─sq
   │ │ │ │ └─_lib
   │ │ │ ├─sr
   │ │ │ │ └─_lib
   │ │ │ ├─sr-Latn
   │ │ │ │ └─_lib
   │ │ │ ├─sv
   │ │ │ │ └─_lib
   │ │ │ ├─ta
   │ │ │ │ └─_lib
   │ │ │ ├─te
   │ │ │ │ └─_lib
   │ │ │ ├─th
   │ │ │ │ └─_lib
   │ │ │ ├─tr
   │ │ │ │ └─_lib
   │ │ │ ├─ug
   │ │ │ │ └─_lib
   │ │ │ ├─uk
   │ │ │ │ └─_lib
   │ │ │ ├─uz
   │ │ │ │ └─_lib
   │ │ │ ├─uz-Cyrl
   │ │ │ │ └─_lib
   │ │ │ ├─vi
   │ │ │ │ └─_lib
   │ │ │ ├─zh-CN
   │ │ │ │ └─_lib
   │ │ │ ├─zh-HK
   │ │ │ │ └─_lib
   │ │ │ ├─zh-TW
   │ │ │ │ └─_lib
   │ │ │ └─_lib
   │ │ ├─parse
   │ │ │ └─_lib
   │ │ │ └─parsers
   │ │ └─_lib
   │ │ └─format
   │ ├─debug
   │ │ └─src
   │ ├─decimal.js
   │ ├─decode-named-character-reference
   │ ├─dedent
   │ │ └─dist
   │ ├─deep-equal
   │ │ ├─example
   │ │ └─test
   │ ├─deep-is
   │ │ ├─example
   │ │ └─test
   │ ├─deepmerge
   │ │ └─dist
   │ ├─define-data-property
   │ │ ├─.github
   │ │ └─test
   │ ├─define-properties
   │ │ └─.github
   │ ├─delayed-stream
   │ │ └─lib
   │ ├─dequal
   │ │ ├─dist
   │ │ └─lite
   │ ├─detect-newline
   │ ├─detect-node-es
   │ │ ├─es5
   │ │ └─esm
   │ ├─devlop
   │ │ └─lib
   │ ├─didyoumean
   │ ├─diff-sequences
   │ │ └─build
   │ ├─dir-glob
   │ ├─direction
   │ ├─dlv
   │ │ └─dist
   │ ├─doctrine
   │ │ └─lib
   │ ├─dom-accessibility-api
   │ │ └─dist
   │ │ └─polyfills
   │ ├─domexception
   │ │ ├─lib
   │ │ └─node_modules
   │ │ └─webidl-conversions
   │ │ └─lib
   │ ├─eastasianwidth
   │ ├─electron-to-chromium
   │ ├─emittery
   │ ├─emoji-regex
   │ │ └─es2015
   │ ├─enhanced-resolve
   │ │ └─lib
   │ │ └─util
   │ ├─entities
   │ │ └─lib
   │ │ ├─esm
   │ │ │ └─generated
   │ │ └─generated
   │ ├─error-ex
   │ ├─es-abstract
   │ │ ├─2015
   │ │ │ └─tables
   │ │ ├─2016
   │ │ │ └─tables
   │ │ ├─2017
   │ │ │ └─tables
   │ │ ├─2018
   │ │ │ └─tables
   │ │ ├─2019
   │ │ │ └─tables
   │ │ ├─2020
   │ │ │ ├─BigInt
   │ │ │ ├─Number
   │ │ │ └─tables
   │ │ ├─2021
   │ │ │ ├─BigInt
   │ │ │ ├─Number
   │ │ │ └─tables
   │ │ ├─2022
   │ │ │ ├─BigInt
   │ │ │ ├─Number
   │ │ │ └─tables
   │ │ ├─2023
   │ │ │ ├─BigInt
   │ │ │ ├─Number
   │ │ │ └─tables
   │ │ ├─2024
   │ │ │ ├─BigInt
   │ │ │ ├─Number
   │ │ │ └─tables
   │ │ ├─5
   │ │ ├─helpers
   │ │ │ └─records
   │ │ └─operations
   │ ├─es-define-property
   │ │ ├─.github
   │ │ └─test
   │ ├─es-errors
   │ │ ├─.github
   │ │ └─test
   │ ├─es-get-iterator
   │ │ ├─.github
   │ │ └─test
   │ ├─es-iterator-helpers
   │ │ ├─.github
   │ │ ├─aos
   │ │ ├─Iterator
   │ │ ├─Iterator.from
   │ │ ├─Iterator.prototype
   │ │ ├─Iterator.prototype.constructor
   │ │ ├─Iterator.prototype.drop
   │ │ ├─Iterator.prototype.every
   │ │ ├─Iterator.prototype.filter
   │ │ ├─Iterator.prototype.find
   │ │ ├─Iterator.prototype.flatMap
   │ │ ├─Iterator.prototype.forEach
   │ │ ├─Iterator.prototype.map
   │ │ ├─Iterator.prototype.reduce
   │ │ ├─Iterator.prototype.some
   │ │ ├─Iterator.prototype.take
   │ │ ├─Iterator.prototype.toArray
   │ │ ├─IteratorHelperPrototype
   │ │ ├─test
   │ │ │ └─helpers
   │ │ └─WrapForValidIteratorPrototype
   │ ├─es-object-atoms
   │ │ ├─.github
   │ │ └─test
   │ ├─es-set-tostringtag
   │ │ └─test
   │ ├─es-shim-unscopables
   │ │ ├─.github
   │ │ └─test
   │ ├─es-to-primitive
   │ │ ├─.github
   │ │ ├─helpers
   │ │ └─test
   │ ├─escalade
   │ │ ├─dist
   │ │ └─sync
   │ ├─escape-string-regexp
   │ ├─escodegen
   │ │ └─bin
   │ ├─eslint
   │ │ ├─bin
   │ │ ├─conf
   │ │ ├─lib
   │ │ │ ├─cli-engine
   │ │ │ │ └─formatters
   │ │ │ ├─config
   │ │ │ ├─eslint
   │ │ │ ├─linter
   │ │ │ │ └─code-path-analysis
   │ │ │ ├─rule-tester
   │ │ │ ├─rules
   │ │ │ │ └─utils
   │ │ │ │ ├─patterns
   │ │ │ │ └─unicode
   │ │ │ ├─shared
   │ │ │ └─source-code
   │ │ │ └─token-store
   │ │ └─messages
   │ ├─eslint-config-next
   │ │ └─node_modules
   │ │ ├─@typescript-eslint
   │ │ │ ├─parser
   │ │ │ │ └─dist
   │ │ │ ├─scope-manager
   │ │ │ │ └─dist
   │ │ │ │ ├─definition
   │ │ │ │ ├─lib
   │ │ │ │ ├─referencer
   │ │ │ │ ├─scope
   │ │ │ │ └─variable
   │ │ │ ├─types
   │ │ │ │ └─dist
   │ │ │ │ └─generated
   │ │ │ ├─typescript-estree
   │ │ │ │ └─dist
   │ │ │ │ ├─create-program
   │ │ │ │ ├─jsx
   │ │ │ │ ├─parseSettings
   │ │ │ │ └─ts-estree
   │ │ │ └─visitor-keys
   │ │ │ └─dist
   │ │ ├─brace-expansion
   │ │ │ └─.github
   │ │ └─minimatch
   │ │ └─dist
   │ │ ├─cjs
   │ │ └─mjs
   │ ├─eslint-config-prettier
   │ │ └─bin
   │ ├─eslint-import-resolver-node
   │ │ └─node_modules
   │ │ └─debug
   │ │ └─src
   │ ├─eslint-import-resolver-typescript
   │ │ └─lib
   │ ├─eslint-module-utils
   │ │ └─node_modules
   │ │ └─debug
   │ │ └─src
   │ ├─eslint-plugin-import
   │ │ ├─config
   │ │ ├─docs
   │ │ │ └─rules
   │ │ ├─lib
   │ │ │ ├─core
   │ │ │ └─rules
   │ │ ├─memo-parser
   │ │ └─node_modules
   │ │ ├─.bin
   │ │ ├─debug
   │ │ │ └─src
   │ │ ├─doctrine
   │ │ │ └─lib
   │ │ └─semver
   │ │ └─bin
   │ ├─eslint-plugin-jsx-a11y
   │ │ ├─docs
   │ │ │ └─rules
   │ │ ├─lib
   │ │ │ ├─rules
   │ │ │ └─util
   │ │ │ └─implicitRoles
   │ │ ├─**mocks**
   │ │ └─**tests**
   │ │ ├─src
   │ │ │ ├─rules
   │ │ │ └─util
   │ │ │ └─implicitRoles
   │ │ └─**util**
   │ │ └─helpers
   │ ├─eslint-plugin-prettier
   │ ├─eslint-plugin-react
   │ │ ├─configs
   │ │ ├─lib
   │ │ │ ├─rules
   │ │ │ └─util
   │ │ └─node_modules
   │ │ ├─.bin
   │ │ ├─doctrine
   │ │ │ └─lib
   │ │ ├─resolve
   │ │ │ ├─.github
   │ │ │ ├─bin
   │ │ │ ├─example
   │ │ │ ├─lib
   │ │ │ └─test
   │ │ │ ├─dotdot
   │ │ │ │ └─abc
   │ │ │ ├─module_dir
   │ │ │ │ ├─xmodules
   │ │ │ │ │ └─aaa
   │ │ │ │ ├─ymodules
   │ │ │ │ │ └─aaa
   │ │ │ │ └─zmodules
   │ │ │ │ └─bbb
   │ │ │ ├─node_path
   │ │ │ │ ├─x
   │ │ │ │ │ ├─aaa
   │ │ │ │ │ └─ccc
   │ │ │ │ └─y
   │ │ │ │ ├─bbb
   │ │ │ │ └─ccc
   │ │ │ ├─pathfilter
   │ │ │ │ └─deep_ref
   │ │ │ ├─precedence
   │ │ │ │ ├─aaa
   │ │ │ │ └─bbb
   │ │ │ ├─resolver
   │ │ │ │ ├─baz
   │ │ │ │ ├─browser_field
   │ │ │ │ ├─dot_main
   │ │ │ │ ├─dot_slash_main
   │ │ │ │ ├─empty_main
   │ │ │ │ ├─false_main
   │ │ │ │ ├─incorrect_main
   │ │ │ │ ├─invalid_main
   │ │ │ │ ├─missing_index
   │ │ │ │ ├─missing_main
   │ │ │ │ ├─multirepo
   │ │ │ │ │ └─packages
   │ │ │ │ │ ├─package-a
   │ │ │ │ │ └─package-b
   │ │ │ │ ├─nested_symlinks
   │ │ │ │ │ └─mylib
   │ │ │ │ ├─null_main
   │ │ │ │ ├─other_path
   │ │ │ │ │ └─lib
   │ │ │ │ ├─quux
   │ │ │ │ │ └─foo
   │ │ │ │ ├─same_names
   │ │ │ │ │ └─foo
   │ │ │ │ ├─symlinked
   │ │ │ │ │ ├─package
   │ │ │ │ │ └─*
   │ │ │ │ │ ├─node*modules
   │ │ │ │ │ └─symlink_target
   │ │ │ │ └─without_basedir
   │ │ │ └─shadowed_core
   │ │ │ └─node_modules
   │ │ │ └─util
   │ │ └─semver
   │ │ └─bin
   │ ├─eslint-plugin-react-hooks
   │ │ └─cjs
   │ ├─eslint-scope
   │ │ ├─dist
   │ │ └─lib
   │ ├─eslint-visitor-keys
   │ │ ├─dist
   │ │ └─lib
   │ ├─espree
   │ │ ├─dist
   │ │ └─lib
   │ ├─esprima
   │ │ ├─bin
   │ │ └─dist
   │ ├─esquery
   │ │ └─dist
   │ ├─esrecurse
   │ ├─estraverse
   │ ├─estree-util-is-identifier-name
   │ │ └─lib
   │ ├─esutils
   │ │ └─lib
   │ ├─event-target-shim
   │ │ └─dist
   │ ├─execa
   │ │ ├─lib
   │ │ └─node_modules
   │ │ └─signal-exit
   │ ├─exit
   │ │ ├─lib
   │ │ └─test
   │ │ └─fixtures
   │ ├─expect
   │ │ └─build
   │ ├─extend
   │ ├─fast-deep-equal
   │ │ └─es6
   │ ├─fast-diff
   │ ├─fast-glob
   │ │ ├─node_modules
   │ │ │ └─glob-parent
   │ │ └─out
   │ │ ├─managers
   │ │ ├─providers
   │ │ │ ├─filters
   │ │ │ ├─matchers
   │ │ │ └─transformers
   │ │ ├─readers
   │ │ ├─types
   │ │ └─utils
   │ ├─fast-json-stable-stringify
   │ │ ├─.github
   │ │ ├─benchmark
   │ │ ├─example
   │ │ └─test
   │ ├─fast-levenshtein
   │ ├─fastq
   │ │ ├─.github
   │ │ │ └─workflows
   │ │ └─test
   │ ├─fault
   │ ├─fb-watchman
   │ ├─file-entry-cache
   │ ├─fill-range
   │ ├─find-up
   │ ├─flat-cache
   │ │ └─src
   │ ├─flatted
   │ │ ├─cjs
   │ │ ├─esm
   │ │ ├─php
   │ │ ├─python
   │ │ │ └─**pycache**
   │ │ └─types
   │ ├─follow-redirects
   │ ├─for-each
   │ │ └─test
   │ ├─foreground-child
   │ │ └─dist
   │ │ ├─cjs
   │ │ └─mjs
   │ ├─form-data
   │ │ └─lib
   │ ├─form-data-encoder
   │ │ ├─@type
   │ │ │ └─util
   │ │ └─lib
   │ │ ├─cjs
   │ │ │ └─util
   │ │ └─esm
   │ │ └─util
   │ ├─format
   │ ├─formdata-node
   │ │ ├─@type
   │ │ └─lib
   │ │ ├─cjs
   │ │ └─esm
   │ ├─fs.realpath
   │ ├─function-bind
   │ │ ├─.github
   │ │ └─test
   │ ├─function.prototype.name
   │ │ ├─.github
   │ │ ├─helpers
   │ │ └─test
   │ ├─functions-have-names
   │ │ ├─.github
   │ │ └─test
   │ ├─gensync
   │ │ └─test
   │ ├─get-caller-file
   │ ├─get-intrinsic
   │ │ ├─.github
   │ │ └─test
   │ ├─get-nonce
   │ │ └─dist
   │ │ ├─es2015
   │ │ └─es5
   │ ├─get-package-type
   │ ├─get-stream
   │ ├─get-symbol-description
   │ │ ├─.github
   │ │ └─test
   │ ├─get-tsconfig
   │ │ └─dist
   │ ├─github-slugger
   │ ├─glob
   │ │ ├─dist
   │ │ │ ├─commonjs
   │ │ │ └─esm
   │ │ └─node_modules
   │ │ ├─brace-expansion
   │ │ │ └─.github
   │ │ └─minimatch
   │ │ └─dist
   │ │ ├─commonjs
   │ │ └─esm
   │ ├─glob-parent
   │ ├─globals
   │ ├─globalthis
   │ │ └─test
   │ ├─globby
   │ ├─gopd
   │ │ ├─.github
   │ │ └─test
   │ ├─graceful-fs
   │ ├─graphemer
   │ │ └─lib
   │ ├─has-bigints
   │ │ ├─.github
   │ │ └─test
   │ ├─has-flag
   │ ├─has-property-descriptors
   │ │ ├─.github
   │ │ └─test
   │ ├─has-proto
   │ │ ├─.github
   │ │ └─test
   │ ├─has-symbols
   │ │ ├─.github
   │ │ └─test
   │ │ └─shams
   │ ├─has-tostringtag
   │ │ ├─.github
   │ │ └─test
   │ │ └─shams
   │ ├─hasown
   │ │ └─.github
   │ ├─hast-util-from-html
   │ │ └─lib
   │ ├─hast-util-from-parse5
   │ │ ├─lib
   │ │ └─node_modules
   │ │ ├─hast-util-parse-selector
   │ │ │ └─lib
   │ │ └─hastscript
   │ │ └─lib
   │ ├─hast-util-has-property
   │ │ └─lib
   │ ├─hast-util-heading-rank
   │ │ └─lib
   │ ├─hast-util-is-element
   │ │ └─lib
   │ ├─hast-util-parse-selector
   │ ├─hast-util-raw
   │ │ └─lib
   │ ├─hast-util-select
   │ │ └─lib
   │ ├─hast-util-to-jsx-runtime
   │ │ └─lib
   │ ├─hast-util-to-parse5
   │ │ └─lib
   │ ├─hast-util-to-string
   │ │ └─lib
   │ ├─hast-util-whitespace
   │ │ └─lib
   │ ├─hastscript
   │ │ └─node_modules
   │ │ ├─@types
   │ │ │ ├─hast
   │ │ │ └─unist
   │ │ ├─comma-separated-tokens
   │ │ ├─property-information
   │ │ │ └─lib
   │ │ │ └─util
   │ │ └─space-separated-tokens
   │ ├─highlight.js
   │ │ ├─lib
   │ │ │ └─languages
   │ │ ├─scss
   │ │ ├─styles
   │ │ └─types
   │ ├─html-encoding-sniffer
   │ │ └─lib
   │ ├─html-escaper
   │ │ ├─cjs
   │ │ ├─esm
   │ │ └─test
   │ ├─html-url-attributes
   │ │ └─lib
   │ ├─html-void-elements
   │ ├─http-proxy-agent
   │ │ └─dist
   │ ├─https-proxy-agent
   │ │ └─dist
   │ ├─human-signals
   │ │ └─build
   │ │ └─src
   │ ├─humanize-ms
   │ ├─iconv-lite
   │ │ ├─.github
   │ │ ├─.idea
   │ │ │ ├─codeStyles
   │ │ │ └─inspectionProfiles
   │ │ ├─encodings
   │ │ │ └─tables
   │ │ └─lib
   │ ├─ignore
   │ ├─import-fresh
   │ ├─import-local
   │ │ └─fixtures
   │ ├─imurmurhash
   │ ├─indent-string
   │ ├─inflight
   │ ├─inherits
   │ ├─inline-style-parser
   │ │ └─dist
   │ ├─internal-slot
   │ │ ├─.github
   │ │ └─test
   │ ├─invariant
   │ ├─is-alphabetical
   │ ├─is-alphanumerical
   │ ├─is-arguments
   │ │ ├─.github
   │ │ └─test
   │ ├─is-array-buffer
   │ │ ├─.github
   │ │ └─test
   │ ├─is-arrayish
   │ ├─is-async-function
   │ │ └─test
   │ ├─is-bigint
   │ │ ├─.github
   │ │ └─test
   │ ├─is-binary-path
   │ ├─is-boolean-object
   │ │ ├─.github
   │ │ └─test
   │ ├─is-callable
   │ │ ├─.github
   │ │ └─test
   │ ├─is-core-module
   │ │ └─test
   │ ├─is-data-view
   │ │ ├─.github
   │ │ └─test
   │ ├─is-date-object
   │ │ ├─.github
   │ │ └─test
   │ ├─is-decimal
   │ ├─is-extglob
   │ ├─is-finalizationregistry
   │ │ ├─.github
   │ │ └─test
   │ ├─is-fullwidth-code-point
   │ ├─is-generator-fn
   │ ├─is-generator-function
   │ │ └─test
   │ ├─is-glob
   │ ├─is-hexadecimal
   │ ├─is-map
   │ │ ├─.github
   │ │ └─test
   │ ├─is-negative-zero
   │ │ ├─.github
   │ │ └─test
   │ ├─is-number
   │ ├─is-number-object
   │ │ ├─.github
   │ │ └─test
   │ ├─is-path-inside
   │ ├─is-plain-obj
   │ ├─is-potential-custom-element-name
   │ ├─is-regex
   │ │ └─test
   │ ├─is-set
   │ │ ├─.github
   │ │ └─test
   │ ├─is-shared-array-buffer
   │ │ ├─.github
   │ │ └─test
   │ ├─is-stream
   │ ├─is-string
   │ │ ├─.github
   │ │ └─test
   │ ├─is-symbol
   │ │ ├─.github
   │ │ └─test
   │ ├─is-typed-array
   │ │ ├─.github
   │ │ └─test
   │ ├─is-weakmap
   │ │ ├─.github
   │ │ └─test
   │ ├─is-weakref
   │ │ ├─.github
   │ │ └─test
   │ ├─is-weakset
   │ │ ├─.github
   │ │ └─test
   │ ├─isarray
   │ ├─isexe
   │ │ └─test
   │ ├─istanbul-lib-coverage
   │ │ └─lib
   │ ├─istanbul-lib-instrument
   │ │ └─src
   │ ├─istanbul-lib-report
   │ │ └─lib
   │ ├─istanbul-lib-source-maps
   │ │ └─lib
   │ ├─istanbul-reports
   │ │ └─lib
   │ │ ├─clover
   │ │ ├─cobertura
   │ │ ├─html
   │ │ │ └─assets
   │ │ │ └─vendor
   │ │ ├─html-spa
   │ │ │ ├─assets
   │ │ │ └─src
   │ │ ├─json
   │ │ ├─json-summary
   │ │ ├─lcov
   │ │ ├─lcovonly
   │ │ ├─none
   │ │ ├─teamcity
   │ │ ├─text
   │ │ ├─text-lcov
   │ │ └─text-summary
   │ ├─iterator.prototype
   │ │ ├─.github
   │ │ └─test
   │ ├─jackspeak
   │ │ └─dist
   │ │ ├─commonjs
   │ │ └─esm
   │ ├─jest
   │ │ ├─bin
   │ │ └─build
   │ ├─jest-changed-files
   │ │ └─build
   │ ├─jest-circus
   │ │ ├─build
   │ │ │ └─legacy-code-todo-rewrite
   │ │ └─node_modules
   │ │ ├─ansi-styles
   │ │ ├─pretty-format
   │ │ │ └─build
   │ │ │ └─plugins
   │ │ │ └─lib
   │ │ └─react-is
   │ │ ├─cjs
   │ │ └─umd
   │ ├─jest-cli
   │ │ ├─bin
   │ │ └─build
   │ ├─jest-config
   │ │ ├─build
   │ │ └─node_modules
   │ │ ├─ansi-styles
   │ │ ├─glob
   │ │ ├─pretty-format
   │ │ │ └─build
   │ │ │ └─plugins
   │ │ │ └─lib
   │ │ └─react-is
   │ │ ├─cjs
   │ │ └─umd
   │ ├─jest-diff
   │ │ ├─build
   │ │ └─node_modules
   │ │ ├─ansi-styles
   │ │ ├─pretty-format
   │ │ │ └─build
   │ │ │ └─plugins
   │ │ │ └─lib
   │ │ └─react-is
   │ │ ├─cjs
   │ │ └─umd
   │ ├─jest-docblock
   │ │ └─build
   │ ├─jest-each
   │ │ ├─build
   │ │ │ └─table
   │ │ └─node_modules
   │ │ ├─ansi-styles
   │ │ ├─pretty-format
   │ │ │ └─build
   │ │ │ └─plugins
   │ │ │ └─lib
   │ │ └─react-is
   │ │ ├─cjs
   │ │ └─umd
   │ ├─jest-environment-jsdom
   │ │ └─build
   │ ├─jest-environment-node
   │ │ └─build
   │ ├─jest-get-type
   │ │ └─build
   │ ├─jest-haste-map
   │ │ └─build
   │ │ ├─crawlers
   │ │ ├─lib
   │ │ └─watchers
   │ ├─jest-leak-detector
   │ │ ├─build
   │ │ └─node_modules
   │ │ ├─ansi-styles
   │ │ ├─pretty-format
   │ │ │ └─build
   │ │ │ └─plugins
   │ │ │ └─lib
   │ │ └─react-is
   │ │ ├─cjs
   │ │ └─umd
   │ ├─jest-matcher-utils
   │ │ ├─build
   │ │ └─node_modules
   │ │ ├─ansi-styles
   │ │ ├─pretty-format
   │ │ │ └─build
   │ │ │ └─plugins
   │ │ │ └─lib
   │ │ └─react-is
   │ │ ├─cjs
   │ │ └─umd
   │ ├─jest-message-util
   │ │ ├─build
   │ │ └─node_modules
   │ │ ├─ansi-styles
   │ │ ├─pretty-format
   │ │ │ └─build
   │ │ │ └─plugins
   │ │ │ └─lib
   │ │ └─react-is
   │ │ ├─cjs
   │ │ └─umd
   │ ├─jest-mock
   │ │ └─build
   │ ├─jest-pnp-resolver
   │ ├─jest-regex-util
   │ │ └─build
   │ ├─jest-resolve
   │ │ └─build
   │ ├─jest-resolve-dependencies
   │ │ └─build
   │ ├─jest-runner
   │ │ └─build
   │ ├─jest-runtime
   │ │ ├─build
   │ │ └─node_modules
   │ │ ├─glob
   │ │ └─strip-bom
   │ ├─jest-snapshot
   │ │ ├─build
   │ │ └─node_modules
   │ │ ├─ansi-styles
   │ │ ├─pretty-format
   │ │ │ └─build
   │ │ │ └─plugins
   │ │ │ └─lib
   │ │ └─react-is
   │ │ ├─cjs
   │ │ └─umd
   │ ├─jest-util
   │ │ └─build
   │ ├─jest-validate
   │ │ ├─build
   │ │ └─node_modules
   │ │ ├─ansi-styles
   │ │ ├─camelcase
   │ │ ├─pretty-format
   │ │ │ └─build
   │ │ │ └─plugins
   │ │ │ └─lib
   │ │ └─react-is
   │ │ ├─cjs
   │ │ └─umd
   │ ├─jest-watcher
   │ │ └─build
   │ │ └─lib
   │ ├─jest-worker
   │ │ ├─build
   │ │ │ ├─base
   │ │ │ └─workers
   │ │ └─node_modules
   │ │ └─supports-color
   │ ├─jiti
   │ │ ├─bin
   │ │ ├─dist
   │ │ │ └─plugins
   │ │ └─lib
   │ ├─jose
   │ │ └─dist
   │ │ ├─browser
   │ │ │ ├─jwe
   │ │ │ │ ├─compact
   │ │ │ │ ├─flattened
   │ │ │ │ └─general
   │ │ │ ├─jwk
   │ │ │ ├─jwks
   │ │ │ ├─jws
   │ │ │ │ ├─compact
   │ │ │ │ ├─flattened
   │ │ │ │ └─general
   │ │ │ ├─jwt
   │ │ │ ├─key
   │ │ │ ├─lib
   │ │ │ ├─runtime
   │ │ │ └─util
   │ │ ├─node
   │ │ │ ├─cjs
   │ │ │ │ ├─jwe
   │ │ │ │ │ ├─compact
   │ │ │ │ │ ├─flattened
   │ │ │ │ │ └─general
   │ │ │ │ ├─jwk
   │ │ │ │ ├─jwks
   │ │ │ │ ├─jws
   │ │ │ │ │ ├─compact
   │ │ │ │ │ ├─flattened
   │ │ │ │ │ └─general
   │ │ │ │ ├─jwt
   │ │ │ │ ├─key
   │ │ │ │ ├─lib
   │ │ │ │ ├─runtime
   │ │ │ │ └─util
   │ │ │ └─esm
   │ │ │ ├─jwe
   │ │ │ │ ├─compact
   │ │ │ │ ├─flattened
   │ │ │ │ └─general
   │ │ │ ├─jwk
   │ │ │ ├─jwks
   │ │ │ ├─jws
   │ │ │ │ ├─compact
   │ │ │ │ ├─flattened
   │ │ │ │ └─general
   │ │ │ ├─jwt
   │ │ │ ├─key
   │ │ │ ├─lib
   │ │ │ ├─runtime
   │ │ │ └─util
   │ │ └─types
   │ │ ├─jwe
   │ │ │ ├─compact
   │ │ │ ├─flattened
   │ │ │ └─general
   │ │ ├─jwk
   │ │ ├─jwks
   │ │ ├─jws
   │ │ │ ├─compact
   │ │ │ ├─flattened
   │ │ │ └─general
   │ │ ├─jwt
   │ │ ├─key
   │ │ └─util
   │ ├─js-tokens
   │ ├─js-yaml
   │ │ ├─bin
   │ │ ├─dist
   │ │ └─lib
   │ │ ├─schema
   │ │ └─type
   │ ├─jsdom
   │ │ ├─lib
   │ │ │ └─jsdom
   │ │ │ ├─browser
   │ │ │ │ ├─parser
   │ │ │ │ └─resources
   │ │ │ ├─level2
   │ │ │ ├─level3
   │ │ │ └─living
   │ │ │ ├─aborting
   │ │ │ ├─attributes
   │ │ │ ├─constraint-validation
   │ │ │ ├─crypto
   │ │ │ ├─cssom
   │ │ │ ├─custom-elements
   │ │ │ ├─domparsing
   │ │ │ ├─events
   │ │ │ ├─fetch
   │ │ │ ├─file-api
   │ │ │ ├─generated
   │ │ │ ├─helpers
   │ │ │ │ └─svg
   │ │ │ ├─hr-time
   │ │ │ ├─mutation-observer
   │ │ │ ├─navigator
   │ │ │ ├─nodes
   │ │ │ ├─range
   │ │ │ ├─selection
   │ │ │ ├─svg
   │ │ │ ├─traversal
   │ │ │ ├─websockets
   │ │ │ ├─webstorage
   │ │ │ ├─window
   │ │ │ └─xhr
   │ │ └─node_modules
   │ │ ├─tr46
   │ │ │ └─lib
   │ │ ├─webidl-conversions
   │ │ │ └─lib
   │ │ └─whatwg-url
   │ │ └─lib
   │ ├─jsesc
   │ │ ├─bin
   │ │ └─man
   │ ├─json-buffer
   │ │ └─test
   │ ├─json-parse-even-better-errors
   │ ├─json-schema-traverse
   │ │ └─spec
   │ │ └─fixtures
   │ ├─json-stable-stringify-without-jsonify
   │ │ ├─example
   │ │ └─test
   │ ├─json5
   │ │ ├─dist
   │ │ └─lib
   │ ├─jsx-ast-utils
   │ │ ├─.github
   │ │ ├─lib
   │ │ │ └─values
   │ │ │ └─expressions
   │ │ ├─src
   │ │ │ └─values
   │ │ │ └─expressions
   │ │ └─**tests**
   │ │ └─src
   │ ├─keyv
   │ │ └─src
   │ ├─kleur
   │ ├─language-subtag-registry
   │ │ └─data
   │ │ └─json
   │ ├─language-tags
   │ │ └─lib
   │ ├─leven
   │ ├─levn
   │ │ └─lib
   │ ├─lilconfig
   │ │ └─dist
   │ ├─lines-and-columns
   │ │ └─build
   │ ├─locate-path
   │ ├─lodash
   │ │ └─fp
   │ ├─lodash.castarray
   │ ├─lodash.isplainobject
   │ ├─lodash.merge
   │ ├─longest-streak
   │ ├─loose-envify
   │ ├─lowlight
   │ │ └─lib
   │ ├─lru-cache
   │ │ └─dist
   │ │ ├─commonjs
   │ │ └─esm
   │ ├─lucide-react
   │ │ └─dist
   │ │ ├─cjs
   │ │ ├─esm
   │ │ │ ├─icons
   │ │ │ └─shared
   │ │ │ └─src
   │ │ └─umd
   │ ├─lz-string
   │ │ ├─bin
   │ │ ├─libs
   │ │ ├─reference
   │ │ ├─tests
   │ │ │ └─lib
   │ │ │ └─jasmine-1.3.1
   │ │ └─typings
   │ ├─make-dir
   │ ├─makeerror
   │ │ └─lib
   │ ├─markdown-table
   │ ├─mdast-util-find-and-replace
   │ │ ├─lib
   │ │ └─node_modules
   │ │ └─escape-string-regexp
   │ ├─mdast-util-from-markdown
   │ │ ├─dev
   │ │ │ └─lib
   │ │ └─lib
   │ ├─mdast-util-gfm
   │ │ └─lib
   │ ├─mdast-util-gfm-autolink-literal
   │ │ └─lib
   │ ├─mdast-util-gfm-footnote
   │ │ └─lib
   │ ├─mdast-util-gfm-strikethrough
   │ │ └─lib
   │ ├─mdast-util-gfm-table
   │ │ └─lib
   │ ├─mdast-util-gfm-task-list-item
   │ │ └─lib
   │ ├─mdast-util-mdx-expression
   │ │ └─lib
   │ ├─mdast-util-mdx-jsx
   │ │ └─lib
   │ ├─mdast-util-mdxjs-esm
   │ │ └─lib
   │ ├─mdast-util-phrasing
   │ │ └─lib
   │ ├─mdast-util-to-hast
   │ │ └─lib
   │ │ └─handlers
   │ ├─mdast-util-to-markdown
   │ │ └─lib
   │ │ ├─handle
   │ │ └─util
   │ ├─mdast-util-to-string
   │ │ └─lib
   │ ├─merge-stream
   │ ├─merge2
   │ ├─micromark
   │ │ ├─dev
   │ │ │ └─lib
   │ │ │ └─initialize
   │ │ └─lib
   │ │ └─initialize
   │ ├─micromark-core-commonmark
   │ │ ├─dev
   │ │ │ └─lib
   │ │ └─lib
   │ ├─micromark-extension-gfm
   │ ├─micromark-extension-gfm-autolink-literal
   │ │ ├─dev
   │ │ │ └─lib
   │ │ └─lib
   │ ├─micromark-extension-gfm-footnote
   │ │ ├─dev
   │ │ │ └─lib
   │ │ └─lib
   │ ├─micromark-extension-gfm-strikethrough
   │ │ ├─dev
   │ │ │ └─lib
   │ │ └─lib
   │ ├─micromark-extension-gfm-table
   │ │ ├─dev
   │ │ │ └─lib
   │ │ └─lib
   │ ├─micromark-extension-gfm-tagfilter
   │ │ └─lib
   │ ├─micromark-extension-gfm-task-list-item
   │ │ ├─dev
   │ │ │ └─lib
   │ │ └─lib
   │ ├─micromark-factory-destination
   │ │ └─dev
   │ ├─micromark-factory-label
   │ │ └─dev
   │ ├─micromark-factory-space
   │ │ └─dev
   │ ├─micromark-factory-title
   │ │ └─dev
   │ ├─micromark-factory-whitespace
   │ │ └─dev
   │ ├─micromark-util-character
   │ │ └─dev
   │ ├─micromark-util-chunked
   │ │ └─dev
   │ ├─micromark-util-classify-character
   │ │ └─dev
   │ ├─micromark-util-combine-extensions
   │ ├─micromark-util-decode-numeric-character-reference
   │ │ └─dev
   │ ├─micromark-util-decode-string
   │ │ └─dev
   │ ├─micromark-util-encode
   │ ├─micromark-util-html-tag-name
   │ ├─micromark-util-normalize-identifier
   │ │ └─dev
   │ ├─micromark-util-resolve-all
   │ ├─micromark-util-sanitize-uri
   │ │ └─dev
   │ ├─micromark-util-subtokenize
   │ │ ├─dev
   │ │ │ └─lib
   │ │ └─lib
   │ ├─micromark-util-symbol
   │ │ └─lib
   │ ├─micromark-util-types
   │ ├─micromatch
   │ ├─mime-db
   │ ├─mime-types
   │ ├─mimic-fn
   │ ├─min-indent
   │ ├─minimatch
   │ ├─minimist
   │ │ ├─.github
   │ │ ├─example
   │ │ └─test
   │ ├─minipass
   │ │ └─dist
   │ │ ├─commonjs
   │ │ └─esm
   │ ├─monaco-editor
   │ │ ├─dev
   │ │ │ └─vs
   │ │ │ ├─base
   │ │ │ │ ├─browser
   │ │ │ │ │ └─ui
   │ │ │ │ │ └─codicons
   │ │ │ │ │ └─codicon
   │ │ │ │ └─worker
   │ │ │ ├─basic-languages
   │ │ │ │ ├─abap
   │ │ │ │ ├─apex
   │ │ │ │ ├─azcli
   │ │ │ │ ├─bat
   │ │ │ │ ├─bicep
   │ │ │ │ ├─cameligo
   │ │ │ │ ├─clojure
   │ │ │ │ ├─coffee
   │ │ │ │ ├─cpp
   │ │ │ │ ├─csharp
   │ │ │ │ ├─csp
   │ │ │ │ ├─css
   │ │ │ │ ├─cypher
   │ │ │ │ ├─dart
   │ │ │ │ ├─dockerfile
   │ │ │ │ ├─ecl
   │ │ │ │ ├─elixir
   │ │ │ │ ├─flow9
   │ │ │ │ ├─freemarker2
   │ │ │ │ ├─fsharp
   │ │ │ │ ├─go
   │ │ │ │ ├─graphql
   │ │ │ │ ├─handlebars
   │ │ │ │ ├─hcl
   │ │ │ │ ├─html
   │ │ │ │ ├─ini
   │ │ │ │ ├─java
   │ │ │ │ ├─javascript
   │ │ │ │ ├─julia
   │ │ │ │ ├─kotlin
   │ │ │ │ ├─less
   │ │ │ │ ├─lexon
   │ │ │ │ ├─liquid
   │ │ │ │ ├─lua
   │ │ │ │ ├─m3
   │ │ │ │ ├─markdown
   │ │ │ │ ├─mdx
   │ │ │ │ ├─mips
   │ │ │ │ ├─msdax
   │ │ │ │ ├─mysql
   │ │ │ │ ├─objective-c
   │ │ │ │ ├─pascal
   │ │ │ │ ├─pascaligo
   │ │ │ │ ├─perl
   │ │ │ │ ├─pgsql
   │ │ │ │ ├─php
   │ │ │ │ ├─pla
   │ │ │ │ ├─postiats
   │ │ │ │ ├─powerquery
   │ │ │ │ ├─powershell
   │ │ │ │ ├─protobuf
   │ │ │ │ ├─pug
   │ │ │ │ ├─python
   │ │ │ │ ├─qsharp
   │ │ │ │ ├─r
   │ │ │ │ ├─razor
   │ │ │ │ ├─redis
   │ │ │ │ ├─redshift
   │ │ │ │ ├─restructuredtext
   │ │ │ │ ├─ruby
   │ │ │ │ ├─rust
   │ │ │ │ ├─sb
   │ │ │ │ ├─scala
   │ │ │ │ ├─scheme
   │ │ │ │ ├─scss
   │ │ │ │ ├─shell
   │ │ │ │ ├─solidity
   │ │ │ │ ├─sophia
   │ │ │ │ ├─sparql
   │ │ │ │ ├─sql
   │ │ │ │ ├─st
   │ │ │ │ ├─swift
   │ │ │ │ ├─systemverilog
   │ │ │ │ ├─tcl
   │ │ │ │ ├─twig
   │ │ │ │ ├─typescript
   │ │ │ │ ├─typespec
   │ │ │ │ ├─vb
   │ │ │ │ ├─wgsl
   │ │ │ │ ├─xml
   │ │ │ │ └─yaml
   │ │ │ ├─editor
   │ │ │ └─language
   │ │ │ ├─css
   │ │ │ ├─html
   │ │ │ ├─json
   │ │ │ └─typescript
   │ │ ├─esm
   │ │ │ └─vs
   │ │ │ ├─base
   │ │ │ │ ├─browser
   │ │ │ │ │ ├─dompurify
   │ │ │ │ │ └─ui
   │ │ │ │ │ ├─actionbar
   │ │ │ │ │ ├─aria
   │ │ │ │ │ ├─breadcrumbs
   │ │ │ │ │ ├─button
   │ │ │ │ │ ├─codicons
   │ │ │ │ │ │ └─codicon
   │ │ │ │ │ ├─contextview
   │ │ │ │ │ ├─countBadge
   │ │ │ │ │ ├─dialog
   │ │ │ │ │ ├─dropdown
   │ │ │ │ │ ├─findinput
   │ │ │ │ │ ├─highlightedlabel
   │ │ │ │ │ ├─hover
   │ │ │ │ │ ├─iconLabel
   │ │ │ │ │ ├─inputbox
   │ │ │ │ │ ├─keybindingLabel
   │ │ │ │ │ ├─list
   │ │ │ │ │ ├─menu
   │ │ │ │ │ ├─mouseCursor
   │ │ │ │ │ ├─progressbar
   │ │ │ │ │ ├─radio
   │ │ │ │ │ ├─resizable
   │ │ │ │ │ ├─sash
   │ │ │ │ │ ├─scrollbar
   │ │ │ │ │ │ └─media
   │ │ │ │ │ ├─selectBox
   │ │ │ │ │ ├─splitview
   │ │ │ │ │ ├─table
   │ │ │ │ │ ├─toggle
   │ │ │ │ │ ├─toolbar
   │ │ │ │ │ └─tree
   │ │ │ │ │ └─media
   │ │ │ │ ├─common
   │ │ │ │ │ ├─diff
   │ │ │ │ │ ├─marked
   │ │ │ │ │ ├─naturalLanguage
   │ │ │ │ │ ├─observableInternal
   │ │ │ │ │ └─worker
   │ │ │ │ └─parts
   │ │ │ │ └─storage
   │ │ │ │ └─common
   │ │ │ ├─basic-languages
   │ │ │ │ ├─abap
   │ │ │ │ ├─apex
   │ │ │ │ ├─azcli
   │ │ │ │ ├─bat
   │ │ │ │ ├─bicep
   │ │ │ │ ├─cameligo
   │ │ │ │ ├─clojure
   │ │ │ │ ├─coffee
   │ │ │ │ ├─cpp
   │ │ │ │ ├─csharp
   │ │ │ │ ├─csp
   │ │ │ │ ├─css
   │ │ │ │ ├─cypher
   │ │ │ │ ├─dart
   │ │ │ │ ├─dockerfile
   │ │ │ │ ├─ecl
   │ │ │ │ ├─elixir
   │ │ │ │ ├─flow9
   │ │ │ │ ├─freemarker2
   │ │ │ │ ├─fsharp
   │ │ │ │ ├─go
   │ │ │ │ ├─graphql
   │ │ │ │ ├─handlebars
   │ │ │ │ ├─hcl
   │ │ │ │ ├─html
   │ │ │ │ ├─ini
   │ │ │ │ ├─java
   │ │ │ │ ├─javascript
   │ │ │ │ ├─julia
   │ │ │ │ ├─kotlin
   │ │ │ │ ├─less
   │ │ │ │ ├─lexon
   │ │ │ │ ├─liquid
   │ │ │ │ ├─lua
   │ │ │ │ ├─m3
   │ │ │ │ ├─markdown
   │ │ │ │ ├─mdx
   │ │ │ │ ├─mips
   │ │ │ │ ├─msdax
   │ │ │ │ ├─mysql
   │ │ │ │ ├─objective-c
   │ │ │ │ ├─pascal
   │ │ │ │ ├─pascaligo
   │ │ │ │ ├─perl
   │ │ │ │ ├─pgsql
   │ │ │ │ ├─php
   │ │ │ │ ├─pla
   │ │ │ │ ├─postiats
   │ │ │ │ ├─powerquery
   │ │ │ │ ├─powershell
   │ │ │ │ ├─protobuf
   │ │ │ │ ├─pug
   │ │ │ │ ├─python
   │ │ │ │ ├─qsharp
   │ │ │ │ ├─r
   │ │ │ │ ├─razor
   │ │ │ │ ├─redis
   │ │ │ │ ├─redshift
   │ │ │ │ ├─restructuredtext
   │ │ │ │ ├─ruby
   │ │ │ │ ├─rust
   │ │ │ │ ├─sb
   │ │ │ │ ├─scala
   │ │ │ │ ├─scheme
   │ │ │ │ ├─scss
   │ │ │ │ ├─shell
   │ │ │ │ ├─solidity
   │ │ │ │ ├─sophia
   │ │ │ │ ├─sparql
   │ │ │ │ ├─sql
   │ │ │ │ ├─st
   │ │ │ │ ├─swift
   │ │ │ │ ├─systemverilog
   │ │ │ │ ├─tcl
   │ │ │ │ ├─twig
   │ │ │ │ ├─typescript
   │ │ │ │ ├─typespec
   │ │ │ │ ├─vb
   │ │ │ │ ├─wgsl
   │ │ │ │ ├─xml
   │ │ │ │ └─yaml
   │ │ │ ├─editor
   │ │ │ │ ├─browser
   │ │ │ │ │ ├─config
   │ │ │ │ │ ├─controller
   │ │ │ │ │ ├─services
   │ │ │ │ │ │ └─hoverService
   │ │ │ │ │ ├─view
   │ │ │ │ │ ├─viewParts
   │ │ │ │ │ │ ├─blockDecorations
   │ │ │ │ │ │ ├─contentWidgets
   │ │ │ │ │ │ ├─currentLineHighlight
   │ │ │ │ │ │ ├─decorations
   │ │ │ │ │ │ ├─editorScrollbar
   │ │ │ │ │ │ ├─glyphMargin
   │ │ │ │ │ │ ├─indentGuides
   │ │ │ │ │ │ ├─lineNumbers
   │ │ │ │ │ │ ├─lines
   │ │ │ │ │ │ ├─linesDecorations
   │ │ │ │ │ │ ├─margin
   │ │ │ │ │ │ ├─marginDecorations
   │ │ │ │ │ │ ├─minimap
   │ │ │ │ │ │ ├─overlayWidgets
   │ │ │ │ │ │ ├─overviewRuler
   │ │ │ │ │ │ ├─rulers
   │ │ │ │ │ │ ├─scrollDecoration
   │ │ │ │ │ │ ├─selections
   │ │ │ │ │ │ ├─viewCursors
   │ │ │ │ │ │ ├─viewZones
   │ │ │ │ │ │ └─whitespace
   │ │ │ │ │ └─widget
   │ │ │ │ │ ├─codeEditor
   │ │ │ │ │ ├─diffEditor
   │ │ │ │ │ │ ├─components
   │ │ │ │ │ │ │ └─diffEditorViewZones
   │ │ │ │ │ │ ├─features
   │ │ │ │ │ │ └─utils
   │ │ │ │ │ ├─markdownRenderer
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ └─multiDiffEditor
   │ │ │ │ ├─common
   │ │ │ │ │ ├─commands
   │ │ │ │ │ ├─config
   │ │ │ │ │ ├─core
   │ │ │ │ │ ├─cursor
   │ │ │ │ │ ├─diff
   │ │ │ │ │ │ └─defaultLinesDiffComputer
   │ │ │ │ │ │ └─algorithms
   │ │ │ │ │ ├─languages
   │ │ │ │ │ │ └─supports
   │ │ │ │ │ ├─model
   │ │ │ │ │ │ ├─bracketPairsTextModelPart
   │ │ │ │ │ │ │ └─bracketPairsTree
   │ │ │ │ │ │ └─pieceTreeTextBuffer
   │ │ │ │ │ ├─services
   │ │ │ │ │ │ └─textModelSync
   │ │ │ │ │ ├─standalone
   │ │ │ │ │ ├─tokens
   │ │ │ │ │ ├─viewLayout
   │ │ │ │ │ └─viewModel
   │ │ │ │ ├─contrib
   │ │ │ │ │ ├─anchorSelect
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─bracketMatching
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─caretOperations
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─clipboard
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─codeAction
   │ │ │ │ │ │ ├─browser
   │ │ │ │ │ │ └─common
   │ │ │ │ │ ├─codelens
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─colorPicker
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─comment
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─contextmenu
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─cursorUndo
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─diffEditorBreadcrumbs
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─dnd
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─documentSymbols
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─dropOrPasteInto
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─editorState
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─find
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─folding
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─fontZoom
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─format
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─gotoError
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ │ └─media
   │ │ │ │ │ ├─gotoSymbol
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ │ ├─link
   │ │ │ │ │ │ └─peek
   │ │ │ │ │ ├─hover
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─indentation
   │ │ │ │ │ │ ├─browser
   │ │ │ │ │ │ └─common
   │ │ │ │ │ ├─inlayHints
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─inlineCompletions
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ │ ├─controller
   │ │ │ │ │ │ ├─hintsWidget
   │ │ │ │ │ │ ├─model
   │ │ │ │ │ │ └─view
   │ │ │ │ │ ├─inlineEdit
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─inlineEdits
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─inlineProgress
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─inPlaceReplace
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─lineSelection
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─linesOperations
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─linkedEditing
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─links
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─longLinesHelper
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─message
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─multicursor
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─parameterHints
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─peekView
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ │ └─media
   │ │ │ │ │ ├─placeholderText
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─quickAccess
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─readOnlyMessage
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─rename
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─sectionHeaders
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─semanticTokens
   │ │ │ │ │ │ ├─browser
   │ │ │ │ │ │ └─common
   │ │ │ │ │ ├─smartSelect
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─snippet
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─stickyScroll
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─suggest
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ │ └─media
   │ │ │ │ │ ├─symbolIcons
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─toggleTabFocusMode
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─tokenization
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─unicodeHighlighter
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─unusualLineTerminators
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─wordHighlighter
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─wordOperations
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ ├─wordPartOperations
   │ │ │ │ │ │ └─browser
   │ │ │ │ │ └─zoneWidget
   │ │ │ │ │ └─browser
   │ │ │ │ └─standalone
   │ │ │ │ ├─browser
   │ │ │ │ │ ├─inspectTokens
   │ │ │ │ │ ├─iPadShowKeyboard
   │ │ │ │ │ ├─quickAccess
   │ │ │ │ │ ├─quickInput
   │ │ │ │ │ ├─referenceSearch
   │ │ │ │ │ └─toggleHighContrast
   │ │ │ │ └─common
   │ │ │ │ └─monarch
   │ │ │ ├─language
   │ │ │ │ ├─css
   │ │ │ │ ├─html
   │ │ │ │ ├─json
   │ │ │ │ └─typescript
   │ │ │ └─platform
   │ │ │ ├─accessibility
   │ │ │ │ ├─browser
   │ │ │ │ └─common
   │ │ │ ├─accessibilitySignal
   │ │ │ │ └─browser
   │ │ │ ├─action
   │ │ │ │ └─common
   │ │ │ ├─actions
   │ │ │ │ ├─browser
   │ │ │ │ └─common
   │ │ │ ├─actionWidget
   │ │ │ │ ├─browser
   │ │ │ │ └─common
   │ │ │ ├─clipboard
   │ │ │ │ ├─browser
   │ │ │ │ └─common
   │ │ │ ├─commands
   │ │ │ │ └─common
   │ │ │ ├─configuration
   │ │ │ │ └─common
   │ │ │ ├─contextkey
   │ │ │ │ ├─browser
   │ │ │ │ └─common
   │ │ │ ├─contextview
   │ │ │ │ └─browser
   │ │ │ ├─dialogs
   │ │ │ │ └─common
   │ │ │ ├─dnd
   │ │ │ │ └─browser
   │ │ │ ├─editor
   │ │ │ │ └─common
   │ │ │ ├─environment
   │ │ │ │ └─common
   │ │ │ ├─extensions
   │ │ │ │ └─common
   │ │ │ ├─files
   │ │ │ │ └─common
   │ │ │ ├─history
   │ │ │ │ └─browser
   │ │ │ ├─hover
   │ │ │ │ └─browser
   │ │ │ ├─instantiation
   │ │ │ │ └─common
   │ │ │ ├─jsonschemas
   │ │ │ │ └─common
   │ │ │ ├─keybinding
   │ │ │ │ └─common
   │ │ │ ├─label
   │ │ │ │ └─common
   │ │ │ ├─layout
   │ │ │ │ └─browser
   │ │ │ ├─list
   │ │ │ │ └─browser
   │ │ │ ├─log
   │ │ │ │ └─common
   │ │ │ ├─markers
   │ │ │ │ └─common
   │ │ │ ├─notification
   │ │ │ │ └─common
   │ │ │ ├─observable
   │ │ │ │ └─common
   │ │ │ ├─opener
   │ │ │ │ ├─browser
   │ │ │ │ └─common
   │ │ │ ├─policy
   │ │ │ │ └─common
   │ │ │ ├─progress
   │ │ │ │ └─common
   │ │ │ ├─quickinput
   │ │ │ │ ├─browser
   │ │ │ │ │ └─media
   │ │ │ │ └─common
   │ │ │ ├─registry
   │ │ │ │ └─common
   │ │ │ ├─severityIcon
   │ │ │ │ └─browser
   │ │ │ │ └─media
   │ │ │ ├─storage
   │ │ │ │ └─common
   │ │ │ ├─telemetry
   │ │ │ │ └─common
   │ │ │ ├─theme
   │ │ │ │ ├─browser
   │ │ │ │ └─common
   │ │ │ │ └─colors
   │ │ │ ├─undoRedo
   │ │ │ │ └─common
   │ │ │ └─workspace
   │ │ │ └─common
   │ │ ├─min
   │ │ │ └─vs
   │ │ │ ├─base
   │ │ │ │ ├─browser
   │ │ │ │ │ └─ui
   │ │ │ │ │ └─codicons
   │ │ │ │ │ └─codicon
   │ │ │ │ └─worker
   │ │ │ ├─basic-languages
   │ │ │ │ ├─abap
   │ │ │ │ ├─apex
   │ │ │ │ ├─azcli
   │ │ │ │ ├─bat
   │ │ │ │ ├─bicep
   │ │ │ │ ├─cameligo
   │ │ │ │ ├─clojure
   │ │ │ │ ├─coffee
   │ │ │ │ ├─cpp
   │ │ │ │ ├─csharp
   │ │ │ │ ├─csp
   │ │ │ │ ├─css
   │ │ │ │ ├─cypher
   │ │ │ │ ├─dart
   │ │ │ │ ├─dockerfile
   │ │ │ │ ├─ecl
   │ │ │ │ ├─elixir
   │ │ │ │ ├─flow9
   │ │ │ │ ├─freemarker2
   │ │ │ │ ├─fsharp
   │ │ │ │ ├─go
   │ │ │ │ ├─graphql
   │ │ │ │ ├─handlebars
   │ │ │ │ ├─hcl
   │ │ │ │ ├─html
   │ │ │ │ ├─ini
   │ │ │ │ ├─java
   │ │ │ │ ├─javascript
   │ │ │ │ ├─julia
   │ │ │ │ ├─kotlin
   │ │ │ │ ├─less
   │ │ │ │ ├─lexon
   │ │ │ │ ├─liquid
   │ │ │ │ ├─lua
   │ │ │ │ ├─m3
   │ │ │ │ ├─markdown
   │ │ │ │ ├─mdx
   │ │ │ │ ├─mips
   │ │ │ │ ├─msdax
   │ │ │ │ ├─mysql
   │ │ │ │ ├─objective-c
   │ │ │ │ ├─pascal
   │ │ │ │ ├─pascaligo
   │ │ │ │ ├─perl
   │ │ │ │ ├─pgsql
   │ │ │ │ ├─php
   │ │ │ │ ├─pla
   │ │ │ │ ├─postiats
   │ │ │ │ ├─powerquery
   │ │ │ │ ├─powershell
   │ │ │ │ ├─protobuf
   │ │ │ │ ├─pug
   │ │ │ │ ├─python
   │ │ │ │ ├─qsharp
   │ │ │ │ ├─r
   │ │ │ │ ├─razor
   │ │ │ │ ├─redis
   │ │ │ │ ├─redshift
   │ │ │ │ ├─restructuredtext
   │ │ │ │ ├─ruby
   │ │ │ │ ├─rust
   │ │ │ │ ├─sb
   │ │ │ │ ├─scala
   │ │ │ │ ├─scheme
   │ │ │ │ ├─scss
   │ │ │ │ ├─shell
   │ │ │ │ ├─solidity
   │ │ │ │ ├─sophia
   │ │ │ │ ├─sparql
   │ │ │ │ ├─sql
   │ │ │ │ ├─st
   │ │ │ │ ├─swift
   │ │ │ │ ├─systemverilog
   │ │ │ │ ├─tcl
   │ │ │ │ ├─twig
   │ │ │ │ ├─typescript
   │ │ │ │ ├─typespec
   │ │ │ │ ├─vb
   │ │ │ │ ├─wgsl
   │ │ │ │ ├─xml
   │ │ │ │ └─yaml
   │ │ │ ├─editor
   │ │ │ └─language
   │ │ │ ├─css
   │ │ │ ├─html
   │ │ │ ├─json
   │ │ │ └─typescript
   │ │ └─min-maps
   │ │ └─vs
   │ │ ├─base
   │ │ │ └─worker
   │ │ └─editor
   │ ├─ms
   │ ├─mz
   │ ├─nanoid
   │ │ ├─async
   │ │ ├─bin
   │ │ ├─non-secure
   │ │ └─url-alphabet
   │ ├─natural-compare
   │ ├─next
   │ │ ├─compat
   │ │ ├─dist
   │ │ │ ├─api
   │ │ │ ├─bin
   │ │ │ ├─build
   │ │ │ │ ├─analysis
   │ │ │ │ ├─babel
   │ │ │ │ │ ├─loader
   │ │ │ │ │ └─plugins
   │ │ │ │ ├─jest
   │ │ │ │ │ └─**mocks**
   │ │ │ │ ├─manifests
   │ │ │ │ │ └─formatter
   │ │ │ │ ├─output
   │ │ │ │ ├─polyfills
   │ │ │ │ │ ├─fetch
   │ │ │ │ │ └─object.assign
   │ │ │ │ ├─swc
   │ │ │ │ ├─templates
   │ │ │ │ ├─turborepo-access-trace
   │ │ │ │ ├─webpack
   │ │ │ │ │ ├─alias
   │ │ │ │ │ ├─config
   │ │ │ │ │ │ └─blocks
   │ │ │ │ │ │ ├─css
   │ │ │ │ │ │ │ └─loaders
   │ │ │ │ │ │ └─images
   │ │ │ │ │ ├─loaders
   │ │ │ │ │ │ ├─css-loader
   │ │ │ │ │ │ │ └─src
   │ │ │ │ │ │ │ ├─plugins
   │ │ │ │ │ │ │ └─runtime
   │ │ │ │ │ │ ├─lightningcss-loader
   │ │ │ │ │ │ │ └─src
   │ │ │ │ │ │ ├─metadata
   │ │ │ │ │ │ ├─next-edge-app-route-loader
   │ │ │ │ │ │ ├─next-edge-ssr-loader
   │ │ │ │ │ │ ├─next-flight-loader
   │ │ │ │ │ │ ├─next-font-loader
   │ │ │ │ │ │ ├─next-image-loader
   │ │ │ │ │ │ ├─next-route-loader
   │ │ │ │ │ │ ├─next-style-loader
   │ │ │ │ │ │ │ └─runtime
   │ │ │ │ │ │ ├─postcss-loader
   │ │ │ │ │ │ │ └─src
   │ │ │ │ │ │ └─resolve-url-loader
   │ │ │ │ │ │ └─lib
   │ │ │ │ │ └─plugins
   │ │ │ │ │ ├─next-types-plugin
   │ │ │ │ │ ├─terser-webpack-plugin
   │ │ │ │ │ │ └─src
   │ │ │ │ │ └─wellknown-errors-plugin
   │ │ │ │ ├─webpack-build
   │ │ │ │ └─webpack-config-rules
   │ │ │ ├─cli
   │ │ │ ├─client
   │ │ │ │ ├─compat
   │ │ │ │ ├─components
   │ │ │ │ │ ├─react-dev-overlay
   │ │ │ │ │ │ ├─app
   │ │ │ │ │ │ ├─internal
   │ │ │ │ │ │ │ ├─components
   │ │ │ │ │ │ │ │ ├─CodeFrame
   │ │ │ │ │ │ │ │ ├─Dialog
   │ │ │ │ │ │ │ │ ├─hot-linked-text
   │ │ │ │ │ │ │ │ ├─LeftRightDialogHeader
   │ │ │ │ │ │ │ │ ├─Overlay
   │ │ │ │ │ │ │ │ ├─Terminal
   │ │ │ │ │ │ │ │ ├─Toast
   │ │ │ │ │ │ │ │ └─VersionStalenessInfo
   │ │ │ │ │ │ │ ├─container
   │ │ │ │ │ │ │ │ └─RuntimeError
   │ │ │ │ │ │ │ ├─helpers
   │ │ │ │ │ │ │ ├─hooks
   │ │ │ │ │ │ │ ├─icons
   │ │ │ │ │ │ │ └─styles
   │ │ │ │ │ │ ├─pages
   │ │ │ │ │ │ └─server
   │ │ │ │ │ └─router-reducer
   │ │ │ │ │ └─reducers
   │ │ │ │ ├─dev
   │ │ │ │ │ └─error-overlay
   │ │ │ │ ├─legacy
   │ │ │ │ ├─portal
   │ │ │ │ └─tracing
   │ │ │ ├─compiled
   │ │ │ │ ├─@ampproject
   │ │ │ │ │ └─toolbox-optimizer
   │ │ │ │ ├─@babel
   │ │ │ │ │ └─runtime
   │ │ │ │ │ ├─helpers
   │ │ │ │ │ │ └─esm
   │ │ │ │ │ └─regenerator
   │ │ │ │ ├─@edge-runtime
   │ │ │ │ │ ├─cookies
   │ │ │ │ │ ├─ponyfill
   │ │ │ │ │ └─primitives
   │ │ │ │ ├─@hapi
   │ │ │ │ │ └─accept
   │ │ │ │ ├─@mswjs
   │ │ │ │ │ └─interceptors
   │ │ │ │ │ └─ClientRequest
   │ │ │ │ ├─@napi-rs
   │ │ │ │ │ └─triples
   │ │ │ │ ├─@next
   │ │ │ │ │ ├─font
   │ │ │ │ │ │ ├─dist
   │ │ │ │ │ │ │ ├─fontkit
   │ │ │ │ │ │ │ ├─google
   │ │ │ │ │ │ │ └─local
   │ │ │ │ │ │ ├─google
   │ │ │ │ │ │ └─local
   │ │ │ │ │ └─react-refresh-utils
   │ │ │ │ │ └─dist
   │ │ │ │ │ └─internal
   │ │ │ │ ├─@opentelemetry
   │ │ │ │ │ └─api
   │ │ │ │ ├─@vercel
   │ │ │ │ │ ├─nft
   │ │ │ │ │ └─og
   │ │ │ │ │ ├─emoji
   │ │ │ │ │ ├─figma
   │ │ │ │ │ ├─language
   │ │ │ │ │ └─satori
   │ │ │ │ ├─acorn
   │ │ │ │ ├─amphtml-validator
   │ │ │ │ ├─anser
   │ │ │ │ ├─arg
   │ │ │ │ ├─assert
   │ │ │ │ ├─async-retry
   │ │ │ │ ├─async-sema
   │ │ │ │ ├─babel
   │ │ │ │ ├─babel-packages
   │ │ │ │ ├─browserify-zlib
   │ │ │ │ ├─browserslist
   │ │ │ │ ├─buffer
   │ │ │ │ ├─bytes
   │ │ │ │ ├─ci-info
   │ │ │ │ ├─cli-select
   │ │ │ │ ├─client-only
   │ │ │ │ ├─commander
   │ │ │ │ ├─comment-json
   │ │ │ │ ├─compression
   │ │ │ │ ├─conf
   │ │ │ │ ├─constants-browserify
   │ │ │ │ ├─content-disposition
   │ │ │ │ ├─content-type
   │ │ │ │ ├─cookie
   │ │ │ │ ├─cross-spawn
   │ │ │ │ ├─crypto-browserify
   │ │ │ │ ├─css.escape
   │ │ │ │ ├─cssnano-simple
   │ │ │ │ ├─data-uri-to-buffer
   │ │ │ │ ├─debug
   │ │ │ │ ├─devalue
   │ │ │ │ ├─domain-browser
   │ │ │ │ ├─edge-runtime
   │ │ │ │ ├─events
   │ │ │ │ ├─find-cache-dir
   │ │ │ │ ├─find-up
   │ │ │ │ ├─fresh
   │ │ │ │ ├─get-orientation
   │ │ │ │ ├─glob
   │ │ │ │ ├─gzip-size
   │ │ │ │ ├─http-proxy
   │ │ │ │ ├─http-proxy-agent
   │ │ │ │ ├─https-browserify
   │ │ │ │ ├─https-proxy-agent
   │ │ │ │ ├─icss-utils
   │ │ │ │ ├─ignore-loader
   │ │ │ │ ├─image-size
   │ │ │ │ ├─is-animated
   │ │ │ │ ├─is-docker
   │ │ │ │ ├─is-wsl
   │ │ │ │ ├─jest-worker
   │ │ │ │ ├─json5
   │ │ │ │ ├─jsonwebtoken
   │ │ │ │ ├─loader-runner
   │ │ │ │ ├─loader-utils2
   │ │ │ │ ├─loader-utils3
   │ │ │ │ ├─lodash.curry
   │ │ │ │ ├─lru-cache
   │ │ │ │ ├─mini-css-extract-plugin
   │ │ │ │ │ └─hmr
   │ │ │ │ ├─nanoid
   │ │ │ │ ├─native-url
   │ │ │ │ ├─neo-async
   │ │ │ │ ├─next-server
   │ │ │ │ ├─node-fetch
   │ │ │ │ ├─node-html-parser
   │ │ │ │ ├─ora
   │ │ │ │ ├─os-browserify
   │ │ │ │ ├─p-limit
   │ │ │ │ ├─path-browserify
   │ │ │ │ ├─path-to-regexp
   │ │ │ │ ├─picomatch
   │ │ │ │ ├─platform
   │ │ │ │ ├─postcss-flexbugs-fixes
   │ │ │ │ ├─postcss-modules-extract-imports
   │ │ │ │ ├─postcss-modules-local-by-default
   │ │ │ │ ├─postcss-modules-scope
   │ │ │ │ ├─postcss-modules-values
   │ │ │ │ ├─postcss-plugin-stub-for-cssnano-simple
   │ │ │ │ ├─postcss-preset-env
   │ │ │ │ ├─postcss-safe-parser
   │ │ │ │ ├─postcss-scss
   │ │ │ │ ├─postcss-value-parser
   │ │ │ │ ├─process
   │ │ │ │ ├─punycode
   │ │ │ │ ├─querystring-es3
   │ │ │ │ ├─raw-body
   │ │ │ │ ├─react
   │ │ │ │ │ └─cjs
   │ │ │ │ ├─react-dom
   │ │ │ │ │ └─cjs
   │ │ │ │ ├─react-dom-experimental
   │ │ │ │ │ └─cjs
   │ │ │ │ ├─react-experimental
   │ │ │ │ │ └─cjs
   │ │ │ │ ├─react-is
   │ │ │ │ │ ├─cjs
   │ │ │ │ │ └─umd
   │ │ │ │ ├─react-refresh
   │ │ │ │ │ └─cjs
   │ │ │ │ ├─react-server-dom-turbopack
   │ │ │ │ │ └─cjs
   │ │ │ │ ├─react-server-dom-turbopack-experimental
   │ │ │ │ │ └─cjs
   │ │ │ │ ├─react-server-dom-webpack
   │ │ │ │ │ └─cjs
   │ │ │ │ ├─react-server-dom-webpack-experimental
   │ │ │ │ │ └─cjs
   │ │ │ │ ├─regenerator-runtime
   │ │ │ │ ├─sass-loader
   │ │ │ │ ├─scheduler
   │ │ │ │ │ └─cjs
   │ │ │ │ ├─scheduler-experimental
   │ │ │ │ │ └─cjs
   │ │ │ │ ├─schema-utils2
   │ │ │ │ ├─schema-utils3
   │ │ │ │ ├─semver
   │ │ │ │ ├─send
   │ │ │ │ ├─server-only
   │ │ │ │ ├─setimmediate
   │ │ │ │ ├─shell-quote
   │ │ │ │ ├─source-map
   │ │ │ │ ├─source-map08
   │ │ │ │ ├─stacktrace-parser
   │ │ │ │ ├─stream-browserify
   │ │ │ │ ├─stream-http
   │ │ │ │ ├─string-hash
   │ │ │ │ ├─string_decoder
   │ │ │ │ ├─strip-ansi
   │ │ │ │ ├─superstruct
   │ │ │ │ ├─tar
   │ │ │ │ ├─terser
   │ │ │ │ ├─text-table
   │ │ │ │ ├─timers-browserify
   │ │ │ │ ├─tty-browserify
   │ │ │ │ ├─ua-parser-js
   │ │ │ │ ├─unistore
   │ │ │ │ ├─util
   │ │ │ │ ├─vm-browserify
   │ │ │ │ ├─watchpack
   │ │ │ │ ├─web-vitals
   │ │ │ │ ├─web-vitals-attribution
   │ │ │ │ ├─webpack
   │ │ │ │ ├─webpack-sources1
   │ │ │ │ ├─webpack-sources3
   │ │ │ │ ├─ws
   │ │ │ │ └─zod
   │ │ │ ├─esm
   │ │ │ │ ├─api
   │ │ │ │ ├─build
   │ │ │ │ │ ├─analysis
   │ │ │ │ │ ├─babel
   │ │ │ │ │ │ ├─loader
   │ │ │ │ │ │ └─plugins
   │ │ │ │ │ ├─manifests
   │ │ │ │ │ │ └─formatter
   │ │ │ │ │ ├─output
   │ │ │ │ │ ├─polyfills
   │ │ │ │ │ │ ├─fetch
   │ │ │ │ │ │ └─object.assign
   │ │ │ │ │ ├─swc
   │ │ │ │ │ ├─templates
   │ │ │ │ │ ├─turborepo-access-trace
   │ │ │ │ │ ├─webpack
   │ │ │ │ │ │ ├─alias
   │ │ │ │ │ │ ├─config
   │ │ │ │ │ │ │ └─blocks
   │ │ │ │ │ │ │ ├─css
   │ │ │ │ │ │ │ │ └─loaders
   │ │ │ │ │ │ │ └─images
   │ │ │ │ │ │ ├─loaders
   │ │ │ │ │ │ │ ├─css-loader
   │ │ │ │ │ │ │ │ └─src
   │ │ │ │ │ │ │ │ ├─plugins
   │ │ │ │ │ │ │ │ └─runtime
   │ │ │ │ │ │ │ ├─lightningcss-loader
   │ │ │ │ │ │ │ │ └─src
   │ │ │ │ │ │ │ ├─metadata
   │ │ │ │ │ │ │ ├─next-edge-app-route-loader
   │ │ │ │ │ │ │ ├─next-edge-ssr-loader
   │ │ │ │ │ │ │ ├─next-flight-loader
   │ │ │ │ │ │ │ ├─next-font-loader
   │ │ │ │ │ │ │ ├─next-image-loader
   │ │ │ │ │ │ │ ├─next-route-loader
   │ │ │ │ │ │ │ ├─next-style-loader
   │ │ │ │ │ │ │ │ └─runtime
   │ │ │ │ │ │ │ ├─postcss-loader
   │ │ │ │ │ │ │ │ └─src
   │ │ │ │ │ │ │ └─resolve-url-loader
   │ │ │ │ │ │ │ └─lib
   │ │ │ │ │ │ └─plugins
   │ │ │ │ │ │ ├─next-types-plugin
   │ │ │ │ │ │ ├─terser-webpack-plugin
   │ │ │ │ │ │ │ └─src
   │ │ │ │ │ │ └─wellknown-errors-plugin
   │ │ │ │ │ ├─webpack-build
   │ │ │ │ │ └─webpack-config-rules
   │ │ │ │ ├─client
   │ │ │ │ │ ├─compat
   │ │ │ │ │ ├─components
   │ │ │ │ │ │ ├─react-dev-overlay
   │ │ │ │ │ │ │ ├─app
   │ │ │ │ │ │ │ ├─internal
   │ │ │ │ │ │ │ │ ├─components
   │ │ │ │ │ │ │ │ │ ├─CodeFrame
   │ │ │ │ │ │ │ │ │ ├─Dialog
   │ │ │ │ │ │ │ │ │ ├─hot-linked-text
   │ │ │ │ │ │ │ │ │ ├─LeftRightDialogHeader
   │ │ │ │ │ │ │ │ │ ├─Overlay
   │ │ │ │ │ │ │ │ │ ├─Terminal
   │ │ │ │ │ │ │ │ │ ├─Toast
   │ │ │ │ │ │ │ │ │ └─VersionStalenessInfo
   │ │ │ │ │ │ │ │ ├─container
   │ │ │ │ │ │ │ │ │ └─RuntimeError
   │ │ │ │ │ │ │ │ ├─helpers
   │ │ │ │ │ │ │ │ ├─hooks
   │ │ │ │ │ │ │ │ ├─icons
   │ │ │ │ │ │ │ │ └─styles
   │ │ │ │ │ │ │ ├─pages
   │ │ │ │ │ │ │ └─server
   │ │ │ │ │ │ └─router-reducer
   │ │ │ │ │ │ └─reducers
   │ │ │ │ │ ├─dev
   │ │ │ │ │ │ └─error-overlay
   │ │ │ │ │ ├─legacy
   │ │ │ │ │ ├─portal
   │ │ │ │ │ └─tracing
   │ │ │ │ ├─export
   │ │ │ │ │ ├─helpers
   │ │ │ │ │ └─routes
   │ │ │ │ ├─lib
   │ │ │ │ │ ├─eslint
   │ │ │ │ │ ├─fs
   │ │ │ │ │ ├─helpers
   │ │ │ │ │ ├─memory
   │ │ │ │ │ ├─metadata
   │ │ │ │ │ │ ├─generate
   │ │ │ │ │ │ ├─resolvers
   │ │ │ │ │ │ └─types
   │ │ │ │ │ └─typescript
   │ │ │ │ ├─pages
   │ │ │ │ ├─server
   │ │ │ │ │ ├─api-utils
   │ │ │ │ │ │ └─node
   │ │ │ │ │ ├─app-render
   │ │ │ │ │ │ ├─rsc
   │ │ │ │ │ │ └─static
   │ │ │ │ │ ├─async-storage
   │ │ │ │ │ ├─base-http
   │ │ │ │ │ ├─dev
   │ │ │ │ │ │ └─turbopack
   │ │ │ │ │ ├─future
   │ │ │ │ │ │ ├─helpers
   │ │ │ │ │ │ │ └─module-loader
   │ │ │ │ │ │ ├─normalizers
   │ │ │ │ │ │ │ ├─built
   │ │ │ │ │ │ │ │ ├─app
   │ │ │ │ │ │ │ │ └─pages
   │ │ │ │ │ │ │ └─request
   │ │ │ │ │ │ ├─route-definitions
   │ │ │ │ │ │ ├─route-matcher-managers
   │ │ │ │ │ │ ├─route-matcher-providers
   │ │ │ │ │ │ │ ├─dev
   │ │ │ │ │ │ │ │ └─helpers
   │ │ │ │ │ │ │ │ └─file-reader
   │ │ │ │ │ │ │ └─helpers
   │ │ │ │ │ │ │ └─manifest-loaders
   │ │ │ │ │ │ ├─route-matchers
   │ │ │ │ │ │ ├─route-matches
   │ │ │ │ │ │ └─route-modules
   │ │ │ │ │ │ ├─app-page
   │ │ │ │ │ │ │ └─vendored
   │ │ │ │ │ │ │ ├─contexts
   │ │ │ │ │ │ │ ├─rsc
   │ │ │ │ │ │ │ └─ssr
   │ │ │ │ │ │ ├─app-route
   │ │ │ │ │ │ │ └─helpers
   │ │ │ │ │ │ ├─helpers
   │ │ │ │ │ │ ├─pages
   │ │ │ │ │ │ │ ├─builtin
   │ │ │ │ │ │ │ └─vendored
   │ │ │ │ │ │ │ └─contexts
   │ │ │ │ │ │ └─pages-api
   │ │ │ │ │ ├─lib
   │ │ │ │ │ │ ├─incremental-cache
   │ │ │ │ │ │ ├─router-utils
   │ │ │ │ │ │ ├─server-ipc
   │ │ │ │ │ │ ├─squoosh
   │ │ │ │ │ │ │ ├─avif
   │ │ │ │ │ │ │ ├─mozjpeg
   │ │ │ │ │ │ │ ├─png
   │ │ │ │ │ │ │ ├─resize
   │ │ │ │ │ │ │ └─webp
   │ │ │ │ │ │ └─trace
   │ │ │ │ │ ├─og
   │ │ │ │ │ ├─response-cache
   │ │ │ │ │ ├─stream-utils
   │ │ │ │ │ ├─typescript
   │ │ │ │ │ │ └─rules
   │ │ │ │ │ └─web
   │ │ │ │ │ ├─exports
   │ │ │ │ │ ├─sandbox
   │ │ │ │ │ └─spec-extension
   │ │ │ │ │ └─adapters
   │ │ │ │ └─shared
   │ │ │ │ └─lib
   │ │ │ │ ├─i18n
   │ │ │ │ ├─isomorphic
   │ │ │ │ ├─lazy-dynamic
   │ │ │ │ ├─page-path
   │ │ │ │ ├─router
   │ │ │ │ │ └─utils
   │ │ │ │ └─utils
   │ │ │ ├─experimental
   │ │ │ │ └─testmode
   │ │ │ │ ├─playwright
   │ │ │ │ └─proxy
   │ │ │ ├─export
   │ │ │ │ ├─helpers
   │ │ │ │ └─routes
   │ │ │ ├─lib
   │ │ │ │ ├─eslint
   │ │ │ │ ├─fs
   │ │ │ │ ├─helpers
   │ │ │ │ ├─memory
   │ │ │ │ ├─metadata
   │ │ │ │ │ ├─generate
   │ │ │ │ │ ├─resolvers
   │ │ │ │ │ └─types
   │ │ │ │ └─typescript
   │ │ │ ├─pages
   │ │ │ ├─server
   │ │ │ │ ├─api-utils
   │ │ │ │ │ └─node
   │ │ │ │ ├─app-render
   │ │ │ │ │ ├─rsc
   │ │ │ │ │ └─static
   │ │ │ │ ├─async-storage
   │ │ │ │ ├─base-http
   │ │ │ │ ├─dev
   │ │ │ │ │ └─turbopack
   │ │ │ │ ├─future
   │ │ │ │ │ ├─helpers
   │ │ │ │ │ │ └─module-loader
   │ │ │ │ │ ├─normalizers
   │ │ │ │ │ │ ├─built
   │ │ │ │ │ │ │ ├─app
   │ │ │ │ │ │ │ └─pages
   │ │ │ │ │ │ └─request
   │ │ │ │ │ ├─route-definitions
   │ │ │ │ │ ├─route-matcher-managers
   │ │ │ │ │ ├─route-matcher-providers
   │ │ │ │ │ │ ├─dev
   │ │ │ │ │ │ │ └─helpers
   │ │ │ │ │ │ │ └─file-reader
   │ │ │ │ │ │ └─helpers
   │ │ │ │ │ │ └─manifest-loaders
   │ │ │ │ │ ├─route-matchers
   │ │ │ │ │ ├─route-matches
   │ │ │ │ │ └─route-modules
   │ │ │ │ │ ├─app-page
   │ │ │ │ │ │ └─vendored
   │ │ │ │ │ │ ├─contexts
   │ │ │ │ │ │ ├─rsc
   │ │ │ │ │ │ └─ssr
   │ │ │ │ │ ├─app-route
   │ │ │ │ │ │ └─helpers
   │ │ │ │ │ ├─helpers
   │ │ │ │ │ ├─pages
   │ │ │ │ │ │ ├─builtin
   │ │ │ │ │ │ └─vendored
   │ │ │ │ │ │ └─contexts
   │ │ │ │ │ └─pages-api
   │ │ │ │ ├─lib
   │ │ │ │ │ ├─incremental-cache
   │ │ │ │ │ ├─router-utils
   │ │ │ │ │ ├─server-ipc
   │ │ │ │ │ ├─squoosh
   │ │ │ │ │ │ ├─avif
   │ │ │ │ │ │ ├─mozjpeg
   │ │ │ │ │ │ ├─png
   │ │ │ │ │ │ ├─resize
   │ │ │ │ │ │ ├─rotate
   │ │ │ │ │ │ └─webp
   │ │ │ │ │ └─trace
   │ │ │ │ ├─og
   │ │ │ │ ├─response-cache
   │ │ │ │ ├─stream-utils
   │ │ │ │ ├─typescript
   │ │ │ │ │ └─rules
   │ │ │ │ └─web
   │ │ │ │ ├─exports
   │ │ │ │ ├─sandbox
   │ │ │ │ └─spec-extension
   │ │ │ │ └─adapters
   │ │ │ ├─shared
   │ │ │ │ └─lib
   │ │ │ │ ├─i18n
   │ │ │ │ ├─isomorphic
   │ │ │ │ ├─lazy-dynamic
   │ │ │ │ ├─page-path
   │ │ │ │ ├─router
   │ │ │ │ │ └─utils
   │ │ │ │ └─utils
   │ │ │ ├─src
   │ │ │ │ └─compiled
   │ │ │ │ └─@ampproject
   │ │ │ │ └─toolbox-optimizer
   │ │ │ ├─styled-jsx
   │ │ │ │ └─types
   │ │ │ ├─telemetry
   │ │ │ │ └─events
   │ │ │ └─trace
   │ │ │ └─report
   │ │ ├─experimental
   │ │ │ └─testmode
   │ │ │ └─playwright
   │ │ ├─font
   │ │ │ ├─google
   │ │ │ └─local
   │ │ ├─image-types
   │ │ ├─legacy
   │ │ ├─navigation-types
   │ │ │ └─compat
   │ │ ├─node_modules
   │ │ │ └─postcss
   │ │ │ └─lib
   │ │ └─types
   │ ├─next-auth
   │ │ ├─client
   │ │ │ └─**tests**
   │ │ │ └─helpers
   │ │ ├─core
   │ │ │ ├─lib
   │ │ │ │ ├─email
   │ │ │ │ └─oauth
   │ │ │ ├─pages
   │ │ │ └─routes
   │ │ ├─css
   │ │ ├─jwt
   │ │ ├─next
   │ │ ├─node_modules
   │ │ │ ├─.bin
   │ │ │ └─uuid
   │ │ │ └─dist
   │ │ │ ├─bin
   │ │ │ ├─esm-browser
   │ │ │ ├─esm-node
   │ │ │ └─umd
   │ │ ├─providers
   │ │ ├─react
   │ │ ├─src
   │ │ │ ├─client
   │ │ │ │ └─**tests**
   │ │ │ │ └─helpers
   │ │ │ ├─core
   │ │ │ │ ├─lib
   │ │ │ │ │ ├─email
   │ │ │ │ │ └─oauth
   │ │ │ │ ├─pages
   │ │ │ │ └─routes
   │ │ │ ├─css
   │ │ │ ├─jwt
   │ │ │ ├─next
   │ │ │ ├─providers
   │ │ │ ├─react
   │ │ │ └─utils
   │ │ └─utils
   │ ├─node-domexception
   │ │ └─.history
   │ ├─node-fetch
   │ │ └─lib
   │ ├─node-int64
   │ ├─node-releases
   │ │ └─data
   │ │ ├─processed
   │ │ └─release-schedule
   │ ├─normalize-path
   │ ├─npm-run-path
   │ ├─nth-check
   │ │ └─lib
   │ │ └─esm
   │ ├─nwsapi
   │ │ ├─dist
   │ │ └─src
   │ │ └─modules
   │ ├─oauth
   │ │ ├─examples
   │ │ │ └─express-gdata
   │ │ │ └─views
   │ │ ├─lib
   │ │ └─tests
   │ ├─object-assign
   │ ├─object-hash
   │ │ └─dist
   │ ├─object-inspect
   │ │ ├─.github
   │ │ ├─example
   │ │ └─test
   │ │ └─browser
   │ ├─object-is
   │ │ └─test
   │ ├─object-keys
   │ │ └─test
   │ ├─object.assign
   │ │ ├─.github
   │ │ ├─dist
   │ │ └─test
   │ ├─object.entries
   │ │ └─test
   │ ├─object.fromentries
   │ │ └─test
   │ ├─object.groupby
   │ │ ├─.github
   │ │ └─test
   │ ├─object.hasown
   │ │ ├─.github
   │ │ └─test
   │ ├─object.values
   │ │ └─test
   │ ├─oidc-token-hash
   │ │ └─lib
   │ ├─once
   │ ├─onetime
   │ ├─openai
   │ │ ├─bin
   │ │ ├─helpers
   │ │ ├─internal
   │ │ │ ├─decoders
   │ │ │ └─qs
   │ │ ├─lib
   │ │ ├─node_modules
   │ │ │ ├─@types
   │ │ │ │ └─node
   │ │ │ │ ├─assert
   │ │ │ │ ├─compatibility
   │ │ │ │ ├─dns
   │ │ │ │ ├─fs
   │ │ │ │ ├─readline
   │ │ │ │ ├─stream
   │ │ │ │ ├─timers
   │ │ │ │ └─ts5.6
   │ │ │ └─undici-types
   │ │ ├─resources
   │ │ │ ├─audio
   │ │ │ ├─beta
   │ │ │ │ ├─chat
   │ │ │ │ ├─threads
   │ │ │ │ │ └─runs
   │ │ │ │ └─vector-stores
   │ │ │ ├─chat
   │ │ │ ├─fine-tuning
   │ │ │ │ └─jobs
   │ │ │ └─uploads
   │ │ ├─shims
   │ │ ├─src
   │ │ │ ├─helpers
   │ │ │ ├─internal
   │ │ │ │ ├─decoders
   │ │ │ │ └─qs
   │ │ │ ├─lib
   │ │ │ ├─resources
   │ │ │ │ ├─audio
   │ │ │ │ ├─beta
   │ │ │ │ │ ├─chat
   │ │ │ │ │ ├─threads
   │ │ │ │ │ │ └─runs
   │ │ │ │ │ └─vector-stores
   │ │ │ │ ├─chat
   │ │ │ │ ├─fine-tuning
   │ │ │ │ │ └─jobs
   │ │ │ │ └─uploads
   │ │ │ ├─shims
   │ │ │ ├─_shims
   │ │ │ │ └─auto
   │ │ │ └─_vendor
   │ │ │ ├─partial-json-parser
   │ │ │ └─zod-to-json-schema
   │ │ │ └─parsers
   │ │ ├─_shims
   │ │ │ └─auto
   │ │ └─_vendor
   │ │ ├─partial-json-parser
   │ │ └─zod-to-json-schema
   │ │ └─parsers
   │ ├─openid-client
   │ │ ├─lib
   │ │ │ └─helpers
   │ │ ├─node_modules
   │ │ │ ├─lru-cache
   │ │ │ └─object-hash
   │ │ │ └─dist
   │ │ └─types
   │ ├─optionator
   │ │ └─lib
   │ ├─p-limit
   │ ├─p-locate
   │ ├─p-try
   │ ├─parent-module
   │ ├─parse-entities
   │ │ ├─lib
   │ │ └─node_modules
   │ │ └─@types
   │ │ └─unist
   │ ├─parse-json
   │ ├─parse-numeric-range
   │ │ └─test
   │ ├─parse5
   │ │ └─dist
   │ │ ├─cjs
   │ │ │ ├─common
   │ │ │ ├─parser
   │ │ │ ├─serializer
   │ │ │ ├─tokenizer
   │ │ │ └─tree-adapters
   │ │ ├─common
   │ │ ├─parser
   │ │ ├─serializer
   │ │ ├─tokenizer
   │ │ └─tree-adapters
   │ ├─path-exists
   │ ├─path-is-absolute
   │ ├─path-key
   │ ├─path-parse
   │ ├─path-scurry
   │ │ └─dist
   │ │ ├─commonjs
   │ │ └─esm
   │ ├─path-type
   │ ├─picocolors
   │ ├─picomatch
   │ │ └─lib
   │ ├─pify
   │ ├─pirates
   │ │ └─lib
   │ ├─pkg-dir
   │ │ └─node_modules
   │ │ ├─find-up
   │ │ ├─locate-path
   │ │ ├─p-limit
   │ │ └─p-locate
   │ ├─possible-typed-array-names
   │ │ ├─.github
   │ │ └─test
   │ ├─postcss
   │ │ └─lib
   │ ├─postcss-import
   │ │ └─lib
   │ ├─postcss-js
   │ ├─postcss-load-config
   │ │ ├─node_modules
   │ │ │ └─lilconfig
   │ │ │ └─src
   │ │ └─src
   │ ├─postcss-nested
   │ ├─postcss-selector-parser
   │ │ └─dist
   │ │ ├─selectors
   │ │ └─util
   │ ├─postcss-value-parser
   │ │ └─lib
   │ ├─preact
   │ │ ├─compat
   │ │ │ ├─dist
   │ │ │ └─src
   │ │ ├─debug
   │ │ │ ├─dist
   │ │ │ └─src
   │ │ ├─devtools
   │ │ │ ├─dist
   │ │ │ └─src
   │ │ ├─dist
   │ │ ├─hooks
   │ │ │ ├─dist
   │ │ │ └─src
   │ │ ├─jsx-runtime
   │ │ │ ├─dist
   │ │ │ └─src
   │ │ ├─src
   │ │ │ └─diff
   │ │ └─test-utils
   │ │ ├─dist
   │ │ └─src
   │ ├─preact-render-to-string
   │ │ ├─dist
   │ │ └─src
   │ ├─prelude-ls
   │ │ └─lib
   │ ├─prettier
   │ │ ├─bin
   │ │ ├─internal
   │ │ └─plugins
   │ ├─prettier-linter-helpers
   │ │ ├─.github
   │ │ ├─.vscode
   │ │ └─test
   │ ├─pretty-format
   │ │ └─plugins
   │ ├─prismjs
   │ │ ├─components
   │ │ ├─plugins
   │ │ │ ├─autolinker
   │ │ │ ├─autoloader
   │ │ │ ├─command-line
   │ │ │ ├─copy-to-clipboard
   │ │ │ ├─custom-class
   │ │ │ ├─data-uri-highlight
   │ │ │ ├─diff-highlight
   │ │ │ ├─download-button
   │ │ │ ├─file-highlight
   │ │ │ ├─filter-highlight-all
   │ │ │ ├─highlight-keywords
   │ │ │ ├─inline-color
   │ │ │ ├─jsonp-highlight
   │ │ │ ├─keep-markup
   │ │ │ ├─line-highlight
   │ │ │ ├─line-numbers
   │ │ │ ├─match-braces
   │ │ │ ├─normalize-whitespace
   │ │ │ ├─previewers
   │ │ │ ├─remove-initial-line-feed
   │ │ │ ├─show-invisibles
   │ │ │ ├─show-language
   │ │ │ ├─toolbar
   │ │ │ ├─treeview
   │ │ │ ├─unescaped-markup
   │ │ │ └─wpd
   │ │ └─themes
   │ ├─prompts
   │ │ ├─dist
   │ │ │ ├─dateparts
   │ │ │ ├─elements
   │ │ │ └─util
   │ │ └─lib
   │ │ ├─dateparts
   │ │ ├─elements
   │ │ └─util
   │ ├─prop-types
   │ │ └─lib
   │ ├─property-information
   │ │ └─lib
   │ │ └─util
   │ ├─proxy-from-env
   │ ├─psl
   │ │ ├─data
   │ │ ├─dist
   │ │ └─types
   │ ├─punycode
   │ ├─pure-rand
   │ │ └─lib
   │ │ ├─distribution
   │ │ │ └─internals
   │ │ ├─esm
   │ │ │ ├─distribution
   │ │ │ │ └─internals
   │ │ │ ├─generator
   │ │ │ └─types
   │ │ │ ├─distribution
   │ │ │ │ └─internals
   │ │ │ └─generator
   │ │ ├─generator
   │ │ └─types
   │ │ ├─distribution
   │ │ │ └─internals
   │ │ └─generator
   │ ├─querystringify
   │ ├─queue-microtask
   │ ├─react
   │ │ ├─cjs
   │ │ └─umd
   │ ├─react-dom
   │ │ ├─cjs
   │ │ └─umd
   │ ├─react-is
   │ │ ├─cjs
   │ │ └─umd
   │ ├─react-markdown
   │ │ └─lib
   │ ├─react-remove-scroll
   │ │ ├─dist
   │ │ │ ├─es2015
   │ │ │ ├─es2019
   │ │ │ └─es5
   │ │ ├─sidecar
   │ │ └─UI
   │ ├─react-remove-scroll-bar
   │ │ ├─constants
   │ │ └─dist
   │ │ ├─es2015
   │ │ ├─es2019
   │ │ └─es5
   │ ├─react-style-singleton
   │ │ └─dist
   │ │ ├─es2015
   │ │ ├─es2019
   │ │ └─es5
   │ ├─react-syntax-highlighter
   │ │ ├─.github
   │ │ │ ├─ISSUE_TEMPLATE
   │ │ │ └─workflows
   │ │ ├─dist
   │ │ │ ├─cjs
   │ │ │ │ ├─async-languages
   │ │ │ │ ├─languages
   │ │ │ │ │ ├─hljs
   │ │ │ │ │ └─prism
   │ │ │ │ └─styles
   │ │ │ │ ├─hljs
   │ │ │ │ └─prism
   │ │ │ └─esm
   │ │ │ ├─async-languages
   │ │ │ ├─languages
   │ │ │ │ ├─hljs
   │ │ │ │ └─prism
   │ │ │ └─styles
   │ │ │ ├─hljs
   │ │ │ └─prism
   │ │ ├─scripts
   │ │ └─src
   │ │ ├─async-languages
   │ │ ├─languages
   │ │ │ ├─hljs
   │ │ │ └─prism
   │ │ └─styles
   │ │ ├─hljs
   │ │ └─prism
   │ ├─react-toastify
   │ │ ├─addons
   │ │ │ └─use-notification-center
   │ │ ├─dist
   │ │ │ ├─components
   │ │ │ ├─core
   │ │ │ ├─hooks
   │ │ │ └─utils
   │ │ └─scss
   │ │ └─animations
   │ ├─read-cache
   │ ├─readdirp
   │ ├─redent
   │ ├─reflect.getprototypeof
   │ │ └─test
   │ ├─refractor
   │ │ ├─lang
   │ │ └─node_modules
   │ │ ├─character-entities
   │ │ ├─character-entities-legacy
   │ │ ├─character-reference-invalid
   │ │ ├─is-alphabetical
   │ │ ├─is-alphanumerical
   │ │ ├─is-decimal
   │ │ ├─is-hexadecimal
   │ │ ├─parse-entities
   │ │ │ └─types
   │ │ └─prismjs
   │ │ ├─components
   │ │ ├─plugins
   │ │ │ ├─autolinker
   │ │ │ ├─autoloader
   │ │ │ ├─command-line
   │ │ │ ├─copy-to-clipboard
   │ │ │ ├─custom-class
   │ │ │ ├─data-uri-highlight
   │ │ │ ├─diff-highlight
   │ │ │ ├─download-button
   │ │ │ ├─file-highlight
   │ │ │ ├─filter-highlight-all
   │ │ │ ├─highlight-keywords
   │ │ │ ├─inline-color
   │ │ │ ├─jsonp-highlight
   │ │ │ ├─keep-markup
   │ │ │ ├─line-highlight
   │ │ │ ├─line-numbers
   │ │ │ ├─match-braces
   │ │ │ ├─normalize-whitespace
   │ │ │ ├─previewers
   │ │ │ ├─remove-initial-line-feed
   │ │ │ ├─show-invisibles
   │ │ │ ├─show-language
   │ │ │ ├─toolbar
   │ │ │ ├─treeview
   │ │ │ ├─unescaped-markup
   │ │ │ └─wpd
   │ │ └─themes
   │ ├─regenerator-runtime
   │ ├─regexp.prototype.flags
   │ │ └─test
   │ ├─rehype-attr
   │ │ ├─lib
   │ │ └─src
   │ ├─rehype-autolink-headings
   │ │ └─lib
   │ ├─rehype-ignore
   │ │ ├─lib
   │ │ └─src
   │ │ └─**test**
   │ ├─rehype-parse
   │ │ └─lib
   │ ├─rehype-prism-plus
   │ │ ├─dist
   │ │ └─node_modules
   │ │ ├─@types
   │ │ │ ├─hast
   │ │ │ └─unist
   │ │ ├─hast-util-parse-selector
   │ │ │ └─lib
   │ │ ├─hastscript
   │ │ │ ├─html
   │ │ │ ├─lib
   │ │ │ └─svg
   │ │ └─refractor
   │ │ ├─lang
   │ │ └─lib
   │ ├─rehype-raw
   │ │ └─lib
   │ ├─rehype-rewrite
   │ │ ├─lib
   │ │ └─src
   │ │ └─**tests**
   │ ├─rehype-slug
   │ │ └─lib
   │ ├─remark-gfm
   │ │ └─lib
   │ ├─remark-github-blockquote-alert
   │ │ ├─lib
   │ │ └─src
   │ ├─remark-parse
   │ │ └─lib
   │ ├─remark-rehype
   │ │ └─lib
   │ ├─remark-stringify
   │ │ └─lib
   │ ├─require-directory
   │ ├─requires-port
   │ ├─resolve
   │ │ ├─.github
   │ │ ├─bin
   │ │ ├─example
   │ │ ├─lib
   │ │ └─test
   │ │ ├─dotdot
   │ │ │ └─abc
   │ │ ├─module_dir
   │ │ │ ├─xmodules
   │ │ │ │ └─aaa
   │ │ │ ├─ymodules
   │ │ │ │ └─aaa
   │ │ │ └─zmodules
   │ │ │ └─bbb
   │ │ ├─node_path
   │ │ │ ├─x
   │ │ │ │ ├─aaa
   │ │ │ │ └─ccc
   │ │ │ └─y
   │ │ │ ├─bbb
   │ │ │ └─ccc
   │ │ ├─pathfilter
   │ │ │ └─deep_ref
   │ │ ├─precedence
   │ │ │ ├─aaa
   │ │ │ └─bbb
   │ │ ├─resolver
   │ │ │ ├─baz
   │ │ │ ├─browser_field
   │ │ │ ├─dot_main
   │ │ │ ├─dot_slash_main
   │ │ │ ├─false_main
   │ │ │ ├─incorrect_main
   │ │ │ ├─invalid_main
   │ │ │ ├─multirepo
   │ │ │ │ └─packages
   │ │ │ │ ├─package-a
   │ │ │ │ └─package-b
   │ │ │ ├─nested_symlinks
   │ │ │ │ └─mylib
   │ │ │ ├─other_path
   │ │ │ │ └─lib
   │ │ │ ├─quux
   │ │ │ │ └─foo
   │ │ │ ├─same_names
   │ │ │ │ └─foo
   │ │ │ ├─symlinked
   │ │ │ │ ├─package
   │ │ │ │ └─*
   │ │ │ │ ├─node_modules
   │ │ │ │ └─symlink_target
   │ │ │ └─without_basedir
   │ │ └─shadowed_core
   │ │ └─node_modules
   │ │ └─util
   │ ├─resolve-cwd
   │ │ └─node_modules
   │ │ └─resolve-from
   │ ├─resolve-from
   │ ├─resolve-pkg-maps
   │ │ └─dist
   │ ├─resolve.exports
   │ │ └─dist
   │ ├─reusify
   │ │ └─benchmarks
   │ ├─rimraf
   │ │ └─node_modules
   │ │ └─glob
   │ ├─run-parallel
   │ ├─safe-array-concat
   │ │ ├─.github
   │ │ └─test
   │ ├─safe-regex-test
   │ │ ├─.github
   │ │ └─test
   │ ├─safer-buffer
   │ ├─saxes
   │ ├─scheduler
   │ │ ├─cjs
   │ │ └─umd
   │ ├─semver
   │ │ ├─bin
   │ │ ├─classes
   │ │ ├─functions
   │ │ ├─internal
   │ │ └─ranges
   │ ├─set-cookie-parser
   │ │ └─lib
   │ ├─set-function-length
   │ │ └─.github
   │ ├─set-function-name
   │ │ └─.github
   │ ├─shebang-command
   │ ├─shebang-regex
   │ ├─side-channel
   │ │ ├─.github
   │ │ └─test
   │ ├─signal-exit
   │ │ └─dist
   │ │ ├─cjs
   │ │ └─mjs
   │ ├─sisteransi
   │ │ └─src
   │ ├─slash
   │ ├─source-map
   │ │ ├─dist
   │ │ └─lib
   │ ├─source-map-js
   │ │ └─lib
   │ ├─source-map-support
   │ ├─space-separated-tokens
   │ ├─sprintf-js
   │ │ ├─demo
   │ │ ├─dist
   │ │ ├─src
   │ │ └─test
   │ ├─stack-utils
   │ │ └─node_modules
   │ │ └─escape-string-regexp
   │ ├─state-local
   │ │ └─lib
   │ │ ├─cjs
   │ │ ├─es
   │ │ └─umd
   │ ├─stop-iteration-iterator
   │ │ ├─.github
   │ │ └─test
   │ ├─streamsearch
   │ │ ├─.github
   │ │ │ └─workflows
   │ │ ├─lib
   │ │ └─test
   │ ├─string-length
   │ ├─string-width
   │ │ └─node_modules
   │ │ ├─ansi-regex
   │ │ └─strip-ansi
   │ ├─string-width-cjs
   │ │ └─node_modules
   │ │ └─emoji-regex
   │ │ └─es2015
   │ ├─string.prototype.matchall
   │ │ ├─.github
   │ │ └─test
   │ ├─string.prototype.trim
   │ │ └─test
   │ ├─string.prototype.trimend
   │ │ └─test
   │ ├─string.prototype.trimstart
   │ │ └─test
   │ ├─stringify-entities
   │ │ └─lib
   │ │ ├─constant
   │ │ └─util
   │ ├─strip-ansi
   │ ├─strip-ansi-cjs
   │ ├─strip-bom
   │ ├─strip-final-newline
   │ ├─strip-indent
   │ ├─strip-json-comments
   │ ├─style-to-object
   │ │ ├─cjs
   │ │ ├─dist
   │ │ ├─esm
   │ │ └─src
   │ ├─styled-jsx
   │ │ ├─dist
   │ │ │ ├─babel
   │ │ │ ├─index
   │ │ │ └─webpack
   │ │ └─lib
   │ ├─sucrase
   │ │ ├─bin
   │ │ ├─dist
   │ │ │ ├─esm
   │ │ │ │ ├─parser
   │ │ │ │ │ ├─plugins
   │ │ │ │ │ │ └─jsx
   │ │ │ │ │ ├─tokenizer
   │ │ │ │ │ ├─traverser
   │ │ │ │ │ └─util
   │ │ │ │ ├─transformers
   │ │ │ │ └─util
   │ │ │ ├─parser
   │ │ │ │ ├─plugins
   │ │ │ │ │ └─jsx
   │ │ │ │ ├─tokenizer
   │ │ │ │ ├─traverser
   │ │ │ │ └─util
   │ │ │ ├─transformers
   │ │ │ ├─types
   │ │ │ │ ├─parser
   │ │ │ │ │ ├─plugins
   │ │ │ │ │ │ └─jsx
   │ │ │ │ │ ├─tokenizer
   │ │ │ │ │ ├─traverser
   │ │ │ │ │ └─util
   │ │ │ │ ├─transformers
   │ │ │ │ └─util
   │ │ │ └─util
   │ │ ├─register
   │ │ └─ts-node-plugin
   │ ├─supports-color
   │ ├─supports-preserve-symlinks-flag
   │ │ ├─.github
   │ │ └─test
   │ ├─swr
   │ │ ├─dist
   │ │ │ ├─core
   │ │ │ ├─immutable
   │ │ │ ├─infinite
   │ │ │ ├─mutation
   │ │ │ ├─subscription
   │ │ │ └─_internal
   │ │ ├─immutable
   │ │ ├─infinite
   │ │ ├─mutation
   │ │ ├─subscription
   │ │ └─_internal
   │ ├─symbol-tree
   │ │ └─lib
   │ ├─synckit
   │ │ └─lib
   │ ├─tailwind-merge
   │ │ ├─dist
   │ │ │ └─es5
   │ │ └─src
   │ │ └─lib
   │ ├─tailwindcss
   │ │ ├─lib
   │ │ │ ├─cli
   │ │ │ │ ├─build
   │ │ │ │ ├─help
   │ │ │ │ └─init
   │ │ │ ├─css
   │ │ │ ├─lib
   │ │ │ ├─postcss-plugins
   │ │ │ │ └─nesting
   │ │ │ ├─public
   │ │ │ ├─util
   │ │ │ └─value-parser
   │ │ ├─nesting
   │ │ ├─peers
   │ │ ├─scripts
   │ │ ├─src
   │ │ │ ├─cli
   │ │ │ │ ├─build
   │ │ │ │ ├─help
   │ │ │ │ └─init
   │ │ │ ├─css
   │ │ │ ├─lib
   │ │ │ ├─postcss-plugins
   │ │ │ │ └─nesting
   │ │ │ ├─public
   │ │ │ ├─util
   │ │ │ └─value-parser
   │ │ ├─stubs
   │ │ └─types
   │ │ └─generated
   │ ├─tapable
   │ │ └─lib
   │ ├─test-exclude
   │ │ └─node_modules
   │ │ └─glob
   │ ├─text-table
   │ │ ├─example
   │ │ └─test
   │ ├─thenify
   │ ├─thenify-all
   │ ├─tmpl
   │ │ └─lib
   │ ├─to-regex-range
   │ ├─tough-cookie
   │ │ └─lib
   │ ├─tr46
   │ │ └─lib
   │ ├─trim-lines
   │ ├─trough
   │ │ └─lib
   │ ├─ts-api-utils
   │ │ └─lib
   │ ├─ts-interface-checker
   │ │ └─dist
   │ ├─tsconfig-paths
   │ │ ├─lib
   │ │ │ └─**tests**
   │ │ │ └─data
   │ │ └─src
   │ │ └─**tests**
   │ │ └─data
   │ ├─tslib
   │ │ └─modules
   │ ├─type-check
   │ │ └─lib
   │ ├─type-detect
   │ ├─type-fest
   │ │ ├─source
   │ │ └─ts41
   │ ├─typed-array-buffer
   │ │ ├─.github
   │ │ └─test
   │ ├─typed-array-byte-length
   │ │ ├─.github
   │ │ └─test
   │ ├─typed-array-byte-offset
   │ │ ├─.github
   │ │ └─test
   │ ├─typed-array-length
   │ │ ├─.github
   │ │ └─test
   │ ├─typescript
   │ │ ├─bin
   │ │ └─lib
   │ │ ├─cs
   │ │ ├─de
   │ │ ├─es
   │ │ ├─fr
   │ │ ├─it
   │ │ ├─ja
   │ │ ├─ko
   │ │ ├─pl
   │ │ ├─pt-br
   │ │ ├─ru
   │ │ ├─tr
   │ │ ├─zh-cn
   │ │ └─zh-tw
   │ ├─unbox-primitive
   │ │ ├─.github
   │ │ └─test
   │ ├─undici-types
   │ ├─unified
   │ │ └─lib
   │ ├─unist-util-filter
   │ │ └─lib
   │ ├─unist-util-is
   │ │ └─lib
   │ ├─unist-util-position
   │ │ └─lib
   │ ├─unist-util-remove-position
   │ │ └─lib
   │ ├─unist-util-stringify-position
   │ │ └─lib
   │ ├─unist-util-visit
   │ │ └─lib
   │ ├─unist-util-visit-parents
   │ │ └─lib
   │ ├─universalify
   │ ├─update-browserslist-db
   │ ├─uri-js
   │ │ └─dist
   │ │ ├─es5
   │ │ └─esnext
   │ │ └─schemes
   │ ├─url-parse
   │ │ └─dist
   │ ├─use-callback-ref
   │ │ └─dist
   │ │ ├─es2015
   │ │ ├─es2019
   │ │ └─es5
   │ ├─use-sidecar
   │ │ └─dist
   │ │ ├─es2015
   │ │ ├─es2019
   │ │ └─es5
   │ ├─use-sync-external-store
   │ │ ├─cjs
   │ │ │ └─use-sync-external-store-shim
   │ │ └─shim
   │ ├─util-deprecate
   │ ├─uuid
   │ │ └─dist
   │ │ ├─bin
   │ │ ├─commonjs-browser
   │ │ ├─esm-browser
   │ │ └─esm-node
   │ ├─v8-to-istanbul
   │ │ └─lib
   │ ├─vfile
   │ │ └─lib
   │ ├─vfile-location
   │ │ └─lib
   │ ├─vfile-message
   │ │ └─lib
   │ ├─w3c-xmlserializer
   │ │ └─lib
   │ ├─walker
   │ │ └─lib
   │ ├─web-namespaces
   │ ├─web-streams-polyfill
   │ │ ├─dist
   │ │ ├─es5
   │ │ ├─polyfill
   │ │ │ └─es5
   │ │ └─types
   │ ├─webidl-conversions
   │ │ └─lib
   │ ├─whatwg-encoding
   │ │ └─lib
   │ ├─whatwg-mimetype
   │ │ └─lib
   │ ├─whatwg-url
   │ │ └─lib
   │ ├─which
   │ │ └─bin
   │ ├─which-boxed-primitive
   │ │ ├─.github
   │ │ └─test
   │ ├─which-builtin-type
   │ │ └─test
   │ ├─which-collection
   │ │ ├─.github
   │ │ └─test
   │ ├─which-typed-array
   │ │ ├─.github
   │ │ └─test
   │ ├─wrap-ansi
   │ │ └─node_modules
   │ │ ├─ansi-regex
   │ │ ├─ansi-styles
   │ │ └─strip-ansi
   │ ├─wrap-ansi-cjs
   │ │ └─node_modules
   │ │ ├─emoji-regex
   │ │ │ └─es2015
   │ │ └─string-width
   │ ├─wrappy
   │ ├─write-file-atomic
   │ │ ├─lib
   │ │ └─node_modules
   │ │ └─signal-exit
   │ ├─ws
   │ │ └─lib
   │ ├─xml-name-validator
   │ │ └─lib
   │ ├─xmlchars
   │ │ ├─xml
   │ │ │ ├─1.0
   │ │ │ └─1.1
   │ │ └─xmlns
   │ │ └─1.0
   │ ├─xtend
   │ ├─y18n
   │ │ └─build
   │ │ └─lib
   │ │ └─platform-shims
   │ ├─yallist
   │ ├─yaml
   │ │ ├─browser
   │ │ │ └─dist
   │ │ │ ├─compose
   │ │ │ ├─doc
   │ │ │ ├─nodes
   │ │ │ ├─node_modules
   │ │ │ │ └─tslib
   │ │ │ ├─parse
   │ │ │ ├─schema
   │ │ │ │ ├─common
   │ │ │ │ ├─core
   │ │ │ │ ├─json
   │ │ │ │ └─yaml-1.1
   │ │ │ └─stringify
   │ │ └─dist
   │ │ ├─compose
   │ │ ├─doc
   │ │ ├─nodes
   │ │ ├─parse
   │ │ ├─schema
   │ │ │ ├─common
   │ │ │ ├─core
   │ │ │ ├─json
   │ │ │ └─yaml-1.1
   │ │ └─stringify
   │ ├─yargs
   │ │ ├─build
   │ │ │ └─lib
   │ │ │ ├─typings
   │ │ │ └─utils
   │ │ ├─helpers
   │ │ ├─lib
   │ │ │ └─platform-shims
   │ │ ├─locales
   │ │ └─node_modules
   │ │ ├─emoji-regex
   │ │ │ └─es2015
   │ │ └─string-width
   │ ├─yargs-parser
   │ │ └─build
   │ │ └─lib
   │ ├─yocto-queue
   │ ├─zustand
   │ │ ├─esm
   │ │ │ ├─middleware
   │ │ │ ├─react
   │ │ │ └─vanilla
   │ │ ├─middleware
   │ │ ├─react
   │ │ └─vanilla
   │ └─zwitch
   ├─provider
   ├─public
   │ └─docs
   ├─services
   │ ├─ai
   │ │ └─**tests**
   │ ├─cache
   │ │ └─**tests**
   │ └─shortcuts
   │ └─**tests**
   ├─styles
   ├─supabase
   ├─types
   └─utils
