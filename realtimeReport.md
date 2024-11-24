# Pepper 개발 실시간 보고서

## 프로젝트 정보

- **프로젝트명**: Pepper (AI-Powered Note-Taking Application)
- **시작일**: 2024년 11월
- **개발 단계**: Phase 1 - AI 통합

## 작업 로그

### 2024-11-25 (오늘)

#### 오늘의 목표

- [x] 프로젝트 셋업 업데이트
  - [x] 프로젝트 이름을 'Pepper'로 변경
  - [x] Jest 테스트 환경 구성
  - [x] 첫 단위 테스트 작성
- [x] Phase 1: AI 통합 시작
  - [x] Claude API 서비스 클래스 생성
  - [x] AI 타입 정의 추가
  - [x] 환경 변수 설정
- [x] AI 어시스턴트 UI 구현
  - [x] 컴포넌트 타입 정의
  - [x] 기본 컴포넌트 구현
  - [x] 단위 테스트 작성
  - [x] 스타일링 (Tailwind)
- [x] 컨텍스트 관리 시스템 개발
  - [x] 컨텍스트 타입 정의
  - [x] 전역 컨텍스트 Provider 구현
  - [x] 단위 테스트 작성
  - [x] 성능 최적화 (useMemo, useCallback)
- [x] API 응답 캐싱 구현
  - [x] 캐시 타입 정의
  - [x] 메모리 캐시 구현
  - [x] AI 전용 캐시 서비스
  - [x] 단위 테스트 작성

#### 진행 상황

1. **프로젝트 기반 작업**

   - package.json 업데이트
   - Jest 설정 추가
   - 테스트 커버리지 설정

2. **Claude API 서비스 구현**

   - `services/ai/claude.ts` 생성
   - 기본 메서드 구현: analyze, suggest, complete
   - 단위 테스트 작성 (`__tests__/claude.test.ts`)

3. **타입 시스템 구축**

   - `types/ai.ts` 생성
   - 주요 인터페이스 정의 완료

4. **AI 어시스턴트 타입 시스템**

   - `types/assistant.ts` 생성
   - 주요 타입 정의:
     - AssistantPosition (cursor/sidebar/floating)
     - AssistantMode (writing/coding/analysis)
     - AssistantState, Context, Props

5. **Assistant 컴포넌트 구현**

   - `components/assistant/Assistant.tsx` 생성
   - 기능:
     - 위치 변경 (커서/사이드바/플로팅)
     - 모드 전환 (작성/코딩/분석)
     - 제안 표시 및 선택
     - 로딩 상태 처리
     - 다크 모드 지원

6. **테스트 케이스 작성**

   - 컴포넌트 렌더링 테스트
   - 모드 변경 테스트
   - 위치 변경 테스트
   - 제안 선택 테스트
   - 스타일 클래스 테스트

7. **컨텍스트 타입 시스템**

   - `types/context.ts` 생성
   - 주요 타입 정의:
     - EditorState (커서 위치, 선택 영역 등)
     - WorkspaceContext (파일 관리)
     - UserContext (설정, 히스토리)
     - GlobalContext (통합 컨텍스트)

8. **전역 컨텍스트 Provider**

   - `context/GlobalContext.tsx` 생성
   - 기능:
     - 컨텍스트 상태 관리
     - 업데이트 핸들러
     - 선택자 패턴 지원
     - 메모이제이션 최적화

9. **테스트 케이스 작성**

   - Provider 렌더링 테스트
   - 컨텍스트 업데이트 테스트
   - 선택자 패턴 테스트
   - 에러 핸들링 테스트

10. **캐시 타입 시스템**

- `types/cache.ts` 생성
- 주요 타입 정의:
  - CacheEntry (데이터, 타임스탬프, TTL)
  - CacheStorage (get, set, delete 등)
  - AIResponseCache (분석, 제안, 완성)

11. **메모리 캐시 구현**

- `services/cache/MemoryCache.ts` 생성
- 기능:
  - TTL 기반 만료
  - 최대 크기 제한
  - 통계 추적
  - 자동 정리

12. **AI 캐시 서비스**

- `services/cache/AICache.ts` 생성
- 기능:
  - 분석, 제안, 완성 결과 캐싱
  - SHA-256 기반 키 생성
  - 캐시 통계 집계
  - 멀티 캐시 관리

13. **테스트 케이스 작성**

- TTL 기반 만료 테스트
- 키 생성 테스트
- 통계 수집 테스트
- 멀티 캐시 동작 테스트

#### 기술적 발견

```typescript
// 테스트 주도 개발 예시
describe('ClaudeService', () => {
  it('should successfully analyze content', async () => {
    const result = await service.analyze('test content');
    expect(result).toEqual(mockResponse);
  });
});

// 위치별 스타일 클래스 관리
const positionClasses = {
  cursor: 'absolute',
  sidebar: 'fixed right-0 top-0 h-full',
  floating: 'fixed bottom-4 right-4',
};

// 선택자 패턴을 통한 성능 최적화
export const useContextSelector = <T,>(selector: ContextSelector<T>): T => {
  const { select } = useGlobalContext();
  return select(selector);
};

// 캐시 키 생성 로직
private generateKey({ type, content, context = {} }: CacheKeyParams): string {
  const data = JSON.stringify({ content, context });
  return createHash('sha256').update(data).digest('hex');
}
```

#### 발생한 문제

- API 키 보안
  - 원인: 환경 변수에 민감한 정보 저장
  - 해결: .env 파일 사용 및 .gitignore에 추가
- 테스트 환경 설정
  - 원인: Next.js와 Jest 통합 필요
  - 해결: next/jest 설정 추가
- 컴포넌트 위치 계산
  - 원인: 커서 모드에서 정확한 위치 계산 필요
  - 해결: 절대 위치 사용 및 오프셋 계산
- 다크 모드 전환
  - 원인: 테마 변경 시 부드러운 전환 필요
  - 해결: Tailwind 전환 클래스 사용
- 컨텍스트 업데이트 성능
  - 원인: 불필요한 리렌더링
  - 해결: 선택자 패턴과 메모이제이션 적용
- 캐시 일관성
  - 원인: 동시 접근 시 경쟁 상태
  - 해결: Promise 기반 비동기 작업
- 메모리 관리
  - 원인: 무제한 캐시 크기
  - 해결: LRU 기반 크기 제한

#### 진행률

- 전체 진행률: 18%
- Phase 1 진행률: 55%

#### 학습 내용

- Jest와 Next.js 통합 방법
- 테스트 주도 개발 실천
- TypeScript 타입 시스템 활용
- React 컴포넌트 테스트 기법
- Tailwind 다크 모드 구현
- TypeScript 고급 타입 활용
- React Context 최적화 기법
- 선택자 패턴과 메모이제이션
- 캐시 정책 설계
- 비동기 작업 최적화
- TypeScript 제네릭 활용
- 테스트 패턴 적용

#### 다음 작업

- [ ] 키보드 단축키 지원
  - [ ] 단축키 매핑 설계
  - [ ] 이벤트 핸들러 구현
- [ ] 크로스 플랫폼 동기화 연구
- [ ] 성능 모니터링 도구 통합

#### 아이디어/제안

- 테스트 자동화 파이프라인 구축
- 성능 모니터링 도구 통합
- 개발 문서 자동화
- 키보드 내비게이션 추가
- 제안 필터링 기능
- 컨텍스트 변경 히스토리 추적
- 실시간 협업 지원을 위한 확장
- 플러그인 시스템 도입 검토
- 영구 캐시 저장소 도입
- 캐시 프리페칭 구현
- 분산 캐시 시스템 검토

#### 원본 요구사항 체크

- [x] AI 통합 기본 구조
- [x] 실시간 상호작용 UI
- [x] 컨텍스트 관리 시스템
- [x] API 응답 캐싱
- [ ] 크로스 플랫폼 동기화
- [ ] 개인화된 학습

---

## 작업 템플릿

### YYYY-MM-DD

#### 오늘의 목표

- [ ] 목표 1
- [ ] 목표 2
- [ ] 목표 3

#### 진행 상황

1. **작업 항목 1**

   - 세부 진행 사항
   - 발생한 문제
   - 해결 방법

2. **작업 항목 2**
   - 세부 진행 사항
   - 발생한 문제
   - 해결 방법

#### 기술적 발견

```typescript
// 코드 예시나 중요한 발견
```

#### 발생한 문제

- 문제 1
  - 원인:
  - 해결 방법:
- 문제 2
  - 원인:
  - 해결 방법:

#### 진행률

- 전체 진행률: XX%
- 단계별 진행률: Phase X - XX%

#### 학습 내용

- 새로 배운 내용 1
- 새로 배운 내용 2

#### 다음 작업

- [ ] 다음 작업 1
- [ ] 다음 작업 2

#### 아이디어/제안

- 향후 개선사항
- 추가 기능 제안

---

## 주간 요약 템플릿

### YYYY-MM-DD ~ YYYY-MM-DD

#### 주간 성과

- 주요 완료 항목
- 달성한 마일스톤

#### 다음 주 계획

- 예정된 작업
- 목표 설정

#### 진행 상황

- 전체 진행률
- 각 Phase별 진행률

#### 리스크/이슈

- 현재 직면한 문제
- 해결 필요 사항

---

## 월간 리뷰 템플릿

### YYYY-MM

#### 월간 성과

- 주요 완료 기능
- 달성한 목표

#### 성과 지표

- 코드 품질
- 성능 지표
- 사용자 피드백

#### 다음 달 계획

- 주요 목표
- 우선순위

#### 개선사항

- 프로세스 개선점
- 기술적 개선점

---

## Supabase 데이터베이스 통합 계획

### 데이터베이스 스키마

#### 테이블 구조

1. folders

   ```sql
   create table folders (
     id uuid default uuid_generate_v4() primary key,
     title text not null,
     parent_id uuid references folders(id),
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
     user_id uuid references auth.users(id) not null
   );
   ```

2. notes
   ```sql
   create table notes (
     id uuid default uuid_generate_v4() primary key,
     title text not null,
     content text default '',
     folder_id uuid references folders(id) not null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
     user_id uuid references auth.users(id) not null
   );
   ```

#### RLS (Row Level Security) 정책

```sql
-- folders 테이블
alter table folders enable row level security;
create policy "Users can only access their own folders"
  on folders for all
  using (auth.uid() = user_id);

-- notes 테이블
alter table notes enable row level security;
create policy "Users can only access their own notes"
  on notes for all
  using (auth.uid() = user_id);
```

### 수정해야 할 파일 목록

1. `app/lib/supabase.ts` (신규 생성)

   - Supabase 클라이언트 초기화
   - 데이터베이스 타입 정의

2. `app/types/database.ts` (신규 생성)

   - Supabase 데이터베이스 타입 정의

3. `app/services/folders/FolderService.ts` (수정)

   - Prisma 대신 Supabase 클라이언트 사용
   - 폴더 CRUD 작업 구현

4. `app/services/notes/NoteService.ts` (수정)

   - Prisma 대신 Supabase 클라이언트 사용
   - 노트 CRUD 작업 구현

5. `app/api/folders/route.ts` (수정)

   - Supabase 클라이언트를 사용하도록 API 엔드포인트 수정

6. `app/api/notes/route.ts` (수정)

   - Supabase 클라이언트를 사용하도록 API 엔드포인트 수정

7. `.env` (수정)

   - Prisma DATABASE_URL 제거
   - Supabase URL과 API 키만 유지

8. 제거할 파일들:
   - `prisma/` 디렉토리 전체
   - `package.json`에서 Prisma 관련 의존성

### 구현 순서

1. Supabase 프로젝트에서 SQL 에디터를 사용하여 테이블 생성 및 RLS 정책 설정
2. 신규 파일 생성 (`supabase.ts`, `database.ts`)
3. 서비스 레이어 수정 (FolderService, NoteService)
4. API 엔드포인트 수정
5. Prisma 관련 파일 및 의존성 제거
6. 테스트 및 검증

---

# Claude API 통합 문제 해결 보고서

## 문제 상황

- Claude API 호출 시 401 Unauthorized 에러 발생
- AI 어시스턴트에서 마크다운 포맷팅 요청이 실패함

## 원인 분석

1. 인증 헤더 문제

   - 잘못된 헤더 키 사용: `anthropic-api-key` 대신 `x-api-key` 사용해야 함
   - Anthropic API 문서에 따르면 모든 요청에 `x-api-key` 헤더가 필요함

2. API 응답 처리 문제
   - 응답 데이터 구조가 변경됨: `data.content[0].text`로 접근해야 함

## 해결 방안

1. API 라우트 수정

   ```typescript
   headers: {
     'Content-Type': 'application/json',
     'x-api-key': apiKey,
     'anthropic-version': '2023-06-01'
   }
   ```

2. 응답 처리 수정
   ```typescript
   return new NextResponse(JSON.stringify({ content: data.content[0].text }), { status: 200 });
   ```

## 개선사항

1. 에러 처리

   - 상세한 에러 로깅 추가
   - API 응답 상태 코드에 따른 구체적인 에러 메시지

2. 디버깅
   - API 요청/응답 로깅 강화
   - 환경 변수 검증 로직 추가

## 다음 단계

1. 전체 API 통합 테스트
2. 에러 복구 메커니즘 구현
3. 사용자 피드백 개선
4. 성능 모니터링 추가

## 보안 고려사항

1. API 키 보안

   - 환경 변수를 통한 안전한 키 관리
   - 에러 메시지에서 민감한 정보 제외

2. 요청/응답 검증
   - 입력 데이터 검증
   - 응답 데이터 구조 확인

## 결론

Claude API 인증 문제가 해결되었으며, 이제 AI 어시스턴트가 정상적으로 작동할 것으로 예상됩니다. 추가적인 모니터링과 에러 처리를 통해 안정성을 더욱 향상시킬 수 있습니다.

---

## 📅 2024-02-25 개발 현황

### 🎯 오늘의 주요 구현 사항

1. 마크다운 편집기 개선

   - 실시간 미리보기 기능
   - 마크다운 도구모음 (굵게, 기울임, 링크 등)
   - 코드 블록 하이라이팅
   - 수식 지원 (KaTeX)
   - 옵시디언 스타일 내부 링크 (`[[]]`)
   - 드래그 앤 드롭 이미지 업로드

2. AI Assistant 기능 안정화
   - 대화 내용 로컬 스토리지 저장
   - "Apply to Note" 버튼으로 명시적 적용
   - 에러 처리 개선

### 🚀 다음 단계 계획

1. 성능 최적화 (우선순위: 높음)

   - 마크다운 렌더링 성능 개선
   - 대용량 노트 처리 최적화
   - 메모리 사용량 모니터링 및 최적화
   - 이미지 최적화 (압축, 캐싱)

2. Google Calendar 통합 (우선순위: 중간)

   - Google Calendar API 연동
   - 노트에서 일정 생성/수정
   - 캘린더 이벤트와 노트 연결
   - 일정 알림 기능

3. 생산성 기능 추가 (우선순위: 중간)

   - 포모도로 타이머
   - 할 일 목록 관리
   - 프로젝트 관리 기능
   - 태그 시스템 개선

4. 데이터 동기화 (우선순위: 높음)

   - 실시간 동기화 구현
   - 오프라인 지원
   - 충돌 해결 시스템
   - 백업 및 복원 기능

5. 검색 및 필터링 개선 (우선순위: 중간)

   - 전문 검색 엔진 도입
   - 태그 기반 필터링
   - 고급 검색 구문 지원
   - 검색 결과 하이라이팅

6. UI/UX 개선 (우선순위: 낮음)
   - 다크 모드 지원
   - 사용자 정의 테마
   - 반응형 디자인 개선
   - 접근성 향상

### 💡 추천 기능

1. 지식 관리

   - Zettelkasten 방식 지원
   - 지식 그래프 시각화
   - 자동 관련 노트 추천
   - 스마트 태깅

2. 협업 기능

   - 실시간 공동 편집
   - 노트 공유 및 권한 관리
   - 댓글 및 토론
   - 버전 관리

3. 자동화

   - 템플릿 시스템
   - 스크립팅 지원
   - 웹 클리핑
   - 자동 백업

4. 통합 기능
   - Notion 가져오기/내보내기
   - Evernote 마이그레이션
   - Obsidian 호환성
   - API 제공

### 🎯 다음 스프린트 목표

1. Google Calendar 통합 시작

   - API 연동 설정
   - 기본 일정 조회/생성 기능
   - 노트-일정 연결 구조 설계

2. 성능 최적화

   - 마크다운 렌더링 최적화
   - 메모리 사용량 분석
   - 성능 메트릭 수집

3. 데이터 동기화 기반 작업
   - 실시간 동기화 아키텍처 설계
   - 오프라인 지원 구현 시작
   - 충돌 해결 전략 수립

### 📊 현재 상태

- 완료된 기능: 35%
- 진행 중인 기능: 15%
- 계획된 기능: 50%

### 🔍 다음 업데이트 내용

다음 업데이트에서는 Google Calendar 통합과 성능 최적화에 집중할 예정입니다. 특히 다음 사항들을 중점적으로 다룰 것입니다:

1. Google Calendar

   - OAuth 인증 구현
   - 캘린더 이벤트 CRUD
   - 노트와 일정 연동 UI

2. 성능 최적화
   - 코드 스플리팅
   - 이미지 레이지 로딩
   - 캐싱 전략 구현
