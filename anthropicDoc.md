Anthropic home pagedark logo
한국어

Search...
Ctrl K
Research
News
Go to claude.ai

환영합니다
API 참조
사용자 가이드
프롬프트 라이브러리
릴리스 노트
개발자 뉴스레터
개발자 콘솔
개발자 Discord
지원
API 사용하기
시작하기
IP 주소
버전
오류
요율 제한
클라이언트 SDK
지원되는 지역
도움 받기
Amazon Bedrock API
Amazon Bedrock API
Vertex AI
Vertex AI API
Anthropic API
메시지
메시지 배치 (베타)
텍스트 완성 (레거시)
API 사용하기
시작하기
​
API 접근하기
API는 웹 Console을 통해 제공됩니다. Workbench에서 브라우저로 API를 시험해볼 수 있으며 계정 설정에서 API 키를 생성할 수 있습니다. 워크스페이스를 사용하여 API 키를 분리하고 사용 사례별로 지출을 제어하세요.

​
인증
Anthropic API에 대한 모든 요청에는 API 키가 포함된 x-api-key 헤더가 포함되어야 합니다. 클라이언트 SDK를 사용하는 경우, 클라이언트를 구성할 때 API를 설정하면 SDK가 모든 요청에서 자동으로 헤더를 전송합니다. API를 직접 통합하는 경우에는 이 헤더를 직접 전송해야 합니다.

​
콘텐츠 유형
Anthropic API는 항상 요청 본문에서 JSON을 받아들이고 응답 본문에서 JSON을 반환합니다. 요청 시 content-type: application/json 헤더를 전송해야 합니다. 클라이언트 SDK를 사용하는 경우 이는 자동으로 처리됩니다.

​
예시
curl
Python
TypeScript
Shell

curl https://api.anthropic.com/v1/messages \
 --header "x-api-key: $ANTHROPIC_API_KEY" \
 --header "anthropic-version: 2023-06-01" \
 --header "content-type: application/json" \
 --data \
'{
"model": "claude-3-5-sonnet-20241022",
"max_tokens": 1024,
"messages": [
{"role": "user", "content": "Hello, world"}
]
}'
IP 주소
x
linkedin
On this page
API 접근하기
인증
콘텐츠 유형
예시
시작하기 - Anthropic

,
Anthropic home pagedark logo
한국어

Search...
Ctrl K
Research
News
Go to claude.ai

환영합니다
API 참조
사용자 가이드
프롬프트 라이브러리
릴리스 노트
개발자 뉴스레터
개발자 콘솔
개발자 Discord
지원
API 사용하기
시작하기
IP 주소
버전
오류
요율 제한
클라이언트 SDK
지원되는 지역
도움 받기
Amazon Bedrock API
Amazon Bedrock API
Vertex AI
Vertex AI API
Anthropic API
메시지
메시지 배치 (베타)
텍스트 완성 (레거시)
API 사용하기
IP 주소
Anthropic 서비스는 고정된 IP 주소 범위에서 운영됩니다. Anthropic API와 콘솔에 접근할 때 최소한의 송신 트래픽 영역을 열기 위해 이 주소들을 방화벽에 추가할 수 있습니다. 이 범위는 사전 공지 없이 변경되지 않습니다.

​
IPv4
160.79.104.0/23

​
IPv6
2607:6bc0::/48

시작하기
버전
x
linkedin
On this page
IPv4
IPv6
IP 주소 - Anthropic

,
Anthropic home pagedark logo
한국어

Search...
Ctrl K
Research
News
Go to claude.ai

환영합니다
API 참조
사용자 가이드
프롬프트 라이브러리
릴리스 노트
개발자 뉴스레터
개발자 콘솔
개발자 Discord
지원
API 사용하기
시작하기
IP 주소
버전
오류
요율 제한
클라이언트 SDK
지원되는 지역
도움 받기
Amazon Bedrock API
Amazon Bedrock API
Vertex AI
Vertex AI API
Anthropic API
메시지
메시지 배치 (베타)
텍스트 완성 (레거시)
API 사용하기
버전
API 요청을 할 때는 anthropic-version 요청 헤더를 보내야 합니다. 예를 들어, anthropic-version: 2023-06-01과 같습니다. 클라이언트 라이브러리를 사용하는 경우 이는 자동으로 처리됩니다.

주어진 API 버전에 대해 다음 사항을 유지합니다:

기존 입력 매개변수
기존 출력 매개변수
하지만 다음과 같은 변경이 있을 수 있습니다:

추가적인 선택적 입력 추가
출력에 추가 값 포함
특정 오류 유형에 대한 조건 변경
enum과 같은 출력 값에 새로운 변형 추가 (예: 스트리밍 이벤트 유형)
일반적으로 이 문서에 설명된 대로 API를 사용하는 경우, 귀하의 사용에 영향을 주지 않을 것입니다.

​
버전 기록
가능한 한 최신 API 버전을 사용하는 것을 항상 권장합니다. 이전 버전은 더 이상 사용되지 않는 것으로 간주되며 새로운 사용자는 사용할 수 없을 수 있습니다.

2023-06-01
스트리밍을 위한 새로운 서버 전송 이벤트(SSE) 형식:
완성은 점진적입니다. 예를 들어, " Hello", " my", " name", " is", " Claude." 대신 " Hello", " Hello my", " Hello my name", " Hello my name is", " Hello my name is Claude."와 같이 표시됩니다.
모든 이벤트는 데이터 전용 이벤트가 아닌 명명된 이벤트입니다.
불필요한 data: [DONE] 이벤트가 제거되었습니다.
응답에서 레거시 exception 및 truncated 값이 제거되었습니다.
2023-01-01: 최초 출시.
IP 주소
오류
x
linkedin
On this page
버전 기록
버전 - Anthropic

,
Anthropic home pagedark logo
한국어

Search...
Ctrl K
Research
News
Go to claude.ai

환영합니다
API 참조
사용자 가이드
프롬프트 라이브러리
릴리스 노트
개발자 뉴스레터
개발자 콘솔
개발자 Discord
지원
API 사용하기
시작하기
IP 주소
버전
오류
요율 제한
클라이언트 SDK
지원되는 지역
도움 받기
Amazon Bedrock API
Amazon Bedrock API
Vertex AI
Vertex AI API
Anthropic API
메시지
메시지 배치 (베타)
텍스트 완성 (레거시)
API 사용하기
오류
​
HTTP 오류
우리의 API는 예측 가능한 HTTP 오류 코드 형식을 따릅니다:

400 - invalid_request_error: 요청의 형식이나 내용에 문제가 있습니다. 아래에 나열되지 않은 다른 4XX 상태 코드에도 이 오류 유형을 사용할 수 있습니다.
401 - authentication_error: API 키에 문제가 있습니다.
403 - permission_error: API 키가 지정된 리소스를 사용할 권한이 없습니다.
404 - not_found_error: 요청한 리소스를 찾을 수 없습니다.
413 - request_too_large: 요청이 최대 허용 바이트 수를 초과합니다.
429 - rate_limit_error: 계정이 속도 제한에 도달했습니다.
500 - api_error: Anthropic 시스템 내부에서 예기치 않은 오류가 발생했습니다.
529 - overloaded_error: Anthropic의 API가 일시적으로 과부하 상태입니다.
SSE를 통해 스트리밍 응답을 받을 때, 200 응답을 반환한 후에 오류가 발생할 수 있으며, 이 경우 오류 처리가 이러한 표준 메커니즘을 따르지 않을 수 있습니다.

​
오류 형태
오류는 항상 JSON으로 반환되며, 최상위 error 객체에는 항상 type과 message 값이 포함됩니다. 예시:

JSON

{
"type": "error",
"error": {
"type": "not_found_error",
"message": "The requested resource could not be found."
}
}
우리의 버전 관리 정책에 따라, 이러한 객체 내의 값을 확장할 수 있으며, type 값이 시간이 지남에 따라 늘어날 수 있습니다.

​
요청 ID
모든 API 응답에는 고유한 request-id 헤더가 포함됩니다. 이 헤더에는 req_018EeWyXxfu5pfWkrYcMdjWG와 같은 값이 포함됩니다. 특정 요청에 대해 지원팀에 문의할 때는 문제를 신속하게 해결할 수 있도록 이 ID를 포함해 주시기 바랍니다.

버전
요율 제한
x
linkedin
On this page
HTTP 오류
오류 형태
요청 ID
오류 - Anthropic

,
Anthropic home pagedark logo
한국어

Search...
Ctrl K
Research
News
Go to claude.ai

환영합니다
API 참조
사용자 가이드
프롬프트 라이브러리
릴리스 노트
개발자 뉴스레터
개발자 콘솔
개발자 Discord
지원
API 사용하기
시작하기
IP 주소
버전
오류
요율 제한
클라이언트 SDK
지원되는 지역
도움 받기
Amazon Bedrock API
Amazon Bedrock API
Vertex AI
Vertex AI API
Anthropic API
메시지
메시지 배치 (베타)
텍스트 완성 (레거시)
API 사용하기
요율 제한
API의 오용을 방지하고 용량을 관리하기 위해, Claude API 사용에 대한 조직별 제한을 구현했습니다.

우리는 두 가지 유형의 제한이 있습니다:

지출 제한은 조직이 API 사용에 대해 발생시킬 수 있는 월간 최대 비용을 설정합니다.
요율 제한은 정해진 시간 동안 조직이 만들 수 있는 최대 API 요청 수를 설정합니다.
우리는 조직 수준에서 서비스 구성 제한을 적용하지만, 조직의 워크스페이스에 대해 사용자 구성 가능한 제한을 설정할 수도 있습니다.

​
제한 사항에 대하여
제한은 일반적인 고객 사용 패턴에 대한 영향을 최소화하면서 API 남용을 방지하도록 설계되었습니다.
제한은 사용 등급별로 정의되며, 각 등급은 서로 다른 지출 및 요율 제한과 연관됩니다.
API를 사용하는 동안 특정 임계값에 도달하면 조직의 등급이 자동으로 상승합니다.
제한은 조직 수준에서 설정됩니다. Anthropic Console의 제한 페이지에서 조직의 제한을 확인할 수 있습니다.
더 짧은 시간 간격으로 요율 제한에 도달할 수 있습니다. 예를 들어, 분당 60개 요청(RPM)의 요율은 초당 1개 요청으로 적용될 수 있습니다. 높은 볼륨의 짧은 요청 버스트는 요율 제한을 초과하여 요율 제한 오류가 발생할 수 있습니다.
아래 설명된 제한은 표준 제한입니다. 더 높은 맞춤형 제한을 원하시면 Anthropic Console을 통해 영업팀에 문의하세요.
우리는 요율 제한을 위해 토큰 버킷 알고리즘을 사용합니다.
여기에 설명된 모든 제한은 보장된 최소값이 아닌 최대 허용 사용량을 나타냅니다. 이러한 제한은 과다 사용을 방지하고 사용자 간의 공정한 자원 분배를 보장하도록 설계되었습니다.
​
지출 제한
각 사용 등급에는 매월 API에 지출할 수 있는 한도가 있습니다. 등급의 지출 한도에 도달하면 다음 등급에 자격이 될 때까지 다음 달까지 기다려야 API를 다시 사용할 수 있습니다.

다음 등급으로 자격을 얻으려면 보증금 요구사항과 필수 대기 기간을 충족해야 합니다. 더 높은 등급에는 더 긴 대기 기간이 필요합니다. 참고로, 계정의 과도한 자금 조달 위험을 최소화하기 위해 월간 지출 한도 이상을 입금할 수 없습니다.

​
등급 상승 요구사항
사용 등급 크레딧 구매 첫 구매 후 대기 월 최대 사용량
등급 1 $5 0일 $100
등급 2 $40 7일 $500
등급 3 $200 7일 $1,000
등급 4 $400 14일 $5,000
월간 청구 해당 없음 해당 없음 해당 없음
​
업데이트된 요율 제한
우리의 요율 제한은 각 모델 클래스에 대해 분당 요청 수, 분당 입력 토큰 수, 분당 출력 토큰 수로 측정됩니다. 요율 제한을 초과하면 429 오류가 발생합니다. 관련 요율 제한을 보려면 요율 제한 등급을 클릭하세요.

요율 제한은 모델별로 추적됩니다. 따라서 동일한 등급 내의 모델들은 요율 제한을 공유하지 않습니다.

등급 1
등급 2
등급 3
등급 4
맞춤형
모델 최대 분당 요청 수 (RPM) 최대 분당 입력 토큰 수 (ITPM) 최대 분당 출력 토큰 수 (OTPM)
Claude 3.5 Sonnet
2024-10-22 50 40,000 8,000
Claude 3.5 Sonnet
2024-06-20 50 40,000 8,000
Claude 3.5 Haiku 50 50,000 10,000
Claude 3 Opus 50 20,000 4,000
Claude 3 Sonnet 50 40,000 8,000
Claude 3 Haiku 50 50,000 10,000
​
워크스페이스에 대한 낮은 제한 설정
조직의 워크스페이스가 잠재적 과다 사용으로부터 보호되도록 워크스페이스별로 맞춤형 지출 및 요율 제한을 설정할 수 있습니다.

예시: 조직의 제한이 분당 48,000 토큰(입력 토큰 40,000개와 출력 토큰 8,000개)인 경우, 한 워크스페이스를 분당 30,000 총 토큰으로 제한할 수 있습니다. 이는 다른 워크스페이스를 잠재적 과다 사용으로부터 보호하고 조직 전체에 걸쳐 더 공평한 자원 분배를 보장합니다. 남은 미사용 분당 토큰(또는 해당 워크스페이스가 제한을 사용하지 않는 경우 더 많은 토큰)은 다른 워크스페이스가 사용할 수 있게 됩니다.

참고:

기본 워크스페이스에는 제한을 설정할 수 없습니다.
설정되지 않은 경우, 워크스페이스 제한은 조직의 제한과 일치합니다.
워크스페이스 제한의 합계가 더 크더라도 조직 전체 제한이 항상 적용됩니다.
입력 및 출력 토큰 제한에 대한 워크스페이스 지원은 향후 추가될 예정입니다.
​
응답 헤더
API 응답에는 적용된 요율 제한, 현재 사용량 및 제한이 재설정되는 시기를 보여주는 헤더가 포함됩니다.

다음 헤더가 반환됩니다:

헤더 설명
anthropic-ratelimit-requests-limit 모든 요율 제한 기간 내에 허용되는 최대 요청 수입니다.
anthropic-ratelimit-requests-remaining 요율 제한에 도달하기 전까지 남은 요청 수입니다.
anthropic-ratelimit-requests-reset 요청 요율 제한이 재설정되는 시간으로, RFC 3339 형식으로 제공됩니다.
anthropic-ratelimit-tokens-limit 모든 요율 제한 기간 내에 허용되는 최대 토큰 수입니다.
anthropic-ratelimit-tokens-remaining 요율 제한에 도달하기 전까지 남은 토큰 수(천 단위로 반올림)입니다.
anthropic-ratelimit-tokens-reset 토큰 요율 제한이 재설정되는 시간으로, RFC 3339 형식으로 제공됩니다.
anthropic-ratelimit-input-tokens-limit 모든 요율 제한 기간 내에 허용되는 최대 입력 토큰 수입니다.
anthropic-ratelimit-input-tokens-remaining 요율 제한에 도달하기 전까지 남은 입력 토큰 수(천 단위로 반올림)입니다.
anthropic-ratelimit-input-tokens-reset 입력 토큰 요율 제한이 재설정되는 시간으로, RFC 3339 형식으로 제공됩니다.
anthropic-ratelimit-output-tokens-limit 모든 요율 제한 기간 내에 허용되는 최대 출력 토큰 수입니다.
anthropic-ratelimit-output-tokens-remaining 요율 제한에 도달하기 전까지 남은 출력 토큰 수(천 단위로 반올림)입니다.
anthropic-ratelimit-output-tokens-reset 출력 토큰 요율 제한이 재설정되는 시간으로, RFC 3339 형식으로 제공됩니다.
retry-after 요청을 재시도할 수 있을 때까지의 초 단위 시간입니다.
anthropic-ratelimit-tokens-\* 헤더는 현재 적용 중인 가장 제한적인 제한의 값을 표시합니다. 예를 들어, 워크스페이스 분당 토큰 제한을 초과한 경우, 헤더는 워크스페이스 분당 토큰 요율 제한 값을 포함합니다. 워크스페이스 제한이 적용되지 않는 경우, 헤더는 총 남은 토큰 수를 반환하며, 총 토큰 수는 입력 및 출력 토큰의 합계입니다. 이 접근 방식은 현재 API 사용에 대한 가장 관련성 있는 제약 사항을 볼 수 있도록 보장합니다.

​
레거시 요율 제한
이전에는 요율 제한이 각 모델 클래스에 대해 분당 요청 수, 분당 토큰 수, 일당 토큰 수로 측정되었습니다. 요율 제한을 초과하면 429 오류가 발생합니다. 관련 요율 제한을 보려면 요율 제한 등급을 클릭하세요.

요율 제한은 모델별로 추적되므로 동일한 등급 내의 모델들은 요율 제한을 공유하지 않습니다.

등급 1
등급 2
등급 3
등급 4
맞춤형
모델 최대 분당 요청 수 (RPM) 최대 분당 토큰 수 (TPM) 최대 일당 토큰 수 (TPD)
Claude 3.5 Sonnet
2024-10-22 50 40,000 1,000,000
Claude 3.5 Sonnet
2024-06-20 50 40,000 1,000,000
Claude 3.5 Haiku 50 50,000 5,000,000
Claude 3 Opus 50 20,000 1,000,000
Claude 3 Sonnet 50 40,000 1,000,000
Claude 3 Haiku 50 50,000 5,000,000
오류
클라이언트 SDK
x
linkedin
On this page
제한 사항에 대하여
지출 제한
등급 상승 요구사항
업데이트된 요율 제한
워크스페이스에 대한 낮은 제한 설정
응답 헤더
레거시 요율 제한
요율 제한 - Anthropic

,
Anthropic home pagedark logo
한국어

Search...
Ctrl K
Research
News
Go to claude.ai

환영합니다
API 참조
사용자 가이드
프롬프트 라이브러리
릴리스 노트
개발자 뉴스레터
개발자 콘솔
개발자 Discord
지원
API 사용하기
시작하기
IP 주소
버전
오류
요율 제한
클라이언트 SDK
지원되는 지역
도움 받기
Amazon Bedrock API
Amazon Bedrock API
Vertex AI
Vertex AI API
Anthropic API
메시지
메시지 배치 (베타)
텍스트 완성 (레거시)
API 사용하기
클라이언트 SDK
Python과 TypeScript에서 Anthropic API를 더 쉽게 사용할 수 있게 해주는 라이브러리를 제공합니다.

파트너 플랫폼을 통해 Anthropic의 클라이언트 SDK를 사용하려면 추가 설정이 필요합니다. Amazon Bedrock을 사용하는 경우 이 가이드를 참조하시고, Google Cloud Vertex AI를 사용하는 경우 이 가이드를 참조하세요.

​
Python
Python 라이브러리 GitHub 저장소

예시:

Python

import anthropic

client = anthropic.Anthropic( # defaults to os.environ.get("ANTHROPIC_API_KEY")
api_key="my_api_key",
)
message = client.messages.create(
model="claude-3-5-sonnet-20241022",
max_tokens=1024,
messages=[
{"role": "user", "content": "Hello, Claude"}
]
)
print(message.content)
​
TypeScript
TypeScript 라이브러리 GitHub 저장소

이 라이브러리는 TypeScript로 작성되었지만 JavaScript 라이브러리에서도 사용할 수 있습니다.

예시:

TypeScript

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
apiKey: 'my_api_key', // defaults to process.env["ANTHROPIC_API_KEY"]
});

const msg = await anthropic.messages.create({
model: "claude-3-5-sonnet-20241022",
max_tokens: 1024,
messages: [{ role: "user", content: "Hello, Claude" }],
});
console.log(msg);
요율 제한
지원되는 지역
x
linkedin
On this page
Python
TypeScript
클라이언트 SDK - Anthropic

,

Anthropic home pagedark logo
한국어

Search...
Ctrl K
Research
News
Go to claude.ai

환영합니다
API 참조
사용자 가이드
프롬프트 라이브러리
릴리스 노트
개발자 뉴스레터
개발자 콘솔
개발자 Discord
지원
API 사용하기
시작하기
IP 주소
버전
오류
요율 제한
클라이언트 SDK
지원되는 지역
도움 받기
Amazon Bedrock API
Amazon Bedrock API
Vertex AI
Vertex AI API
Anthropic API
메시지
POST
Create a Message
POST
메시지 토큰 수 계산 (베타)
메시지 스트리밍
텍스트 완성에서 마이그레이션하기
메시지 예시
메시지 배치 (베타)
텍스트 완성 (레거시)
메시지
Create a Message
Send a structured list of input messages with text and/or image content, and the model will generate the next message in the conversation.

The Messages API can be used for either single queries or stateless multi-turn conversations.

POST
/
v1
/
messages
Headers
anthropic-beta
string[]
Optional header to specify the beta version(s) you want to use.

To use multiple betas, use a comma separated list like beta1,beta2 or specify the header multiple times for each beta.

anthropic-version
string
required
The version of the Anthropic API you want to use.

Read more about versioning and our version history here.

x-api-key
string
required
Your unique API key for authentication.

This key is required in the header of all API requests, to authenticate your account and access Anthropic's services. Get your API key through the Console. Each key is scoped to a Workspace.

Body
application/json
model
string
required
The model that will complete your prompt.

See models for additional details and options.

messages
object[]
required
Input messages.

Our models are trained to operate on alternating user and assistant conversational turns. When creating a new Message, you specify the prior conversational turns with the messages parameter, and the model then generates the next Message in the conversation. Consecutive user or assistant turns in your request will be combined into a single turn.

Each input message must be an object with a role and content. You can specify a single user-role message, or you can include multiple user and assistant messages.

If the final message uses the assistant role, the response content will continue immediately from the content in that message. This can be used to constrain part of the model's response.

Example with a single user message:

[{"role": "user", "content": "Hello, Claude"}]
Example with multiple conversational turns:

[
{"role": "user", "content": "Hello there."},
{"role": "assistant", "content": "Hi, I'm Claude. How can I help you?"},
{"role": "user", "content": "Can you explain LLMs in plain English?"},
]
Example with a partially-filled response from Claude:

[
{"role": "user", "content": "What's the Greek name for Sun? (A) Sol (B) Helios (C) Sun"},
{"role": "assistant", "content": "The best answer is ("},
]
Each input message content may be either a single string or an array of content blocks, where each block has a specific type. Using a string for content is shorthand for an array of one content block of type "text". The following input messages are equivalent:

{"role": "user", "content": "Hello, Claude"}
{"role": "user", "content": [{"type": "text", "text": "Hello, Claude"}]}
Starting with Claude 3 models, you can also send image content blocks:

{"role": "user", "content": [
{
"type": "image",
"source": {
"type": "base64",
"media_type": "image/jpeg",
"data": "/9j/4AAQSkZJRg...",
}
},
{"type": "text", "text": "What is in this image?"}
]}
We currently support the base64 source type for images, and the image/jpeg, image/png, image/gif, and image/webp media types.

See examples for more input examples.

Note that if you want to include a system prompt, you can use the top-level system parameter — there is no "system" role for input messages in the Messages API.

Show child attributes

max_tokens
integer
required
The maximum number of tokens to generate before stopping.

Note that our models may stop before reaching this maximum. This parameter only specifies the absolute maximum number of tokens to generate.

Different models have different maximum values for this parameter. See models for details.

metadata
object
An object describing metadata about the request.

Show child attributes

stop_sequences
string[]
Custom text sequences that will cause the model to stop generating.

Our models will normally stop when they have naturally completed their turn, which will result in a response stop_reason of "end_turn".

If you want the model to stop generating when it encounters custom strings of text, you can use the stop_sequences parameter. If the model encounters one of the custom sequences, the response stop_reason value will be "stop_sequence" and the response stop_sequence value will contain the matched stop sequence.

stream
boolean
Whether to incrementally stream the response using server-sent events.

See streaming for details.

system

string
System prompt.

A system prompt is a way of providing context and instructions to Claude, such as specifying a particular goal or role. See our guide to system prompts.

temperature
number
Amount of randomness injected into the response.

Defaults to 1.0. Ranges from 0.0 to 1.0. Use temperature closer to 0.0 for analytical / multiple choice, and closer to 1.0 for creative and generative tasks.

Note that even with temperature of 0.0, the results will not be fully deterministic.

tool_choice
object
How the model should use the provided tools. The model can use a specific tool, any available tool, or decide by itself.

Auto
Any
Tool

Show child attributes

tools
object[]
Definitions of tools that the model may use.

If you include tools in your API request, the model may return tool_use content blocks that represent the model's use of those tools. You can then run those tools using the tool input generated by the model and then optionally return results back to the model using tool_result content blocks.

Each tool definition includes:

name: Name of the tool.
description: Optional, but strongly-recommended description of the tool.
input_schema: JSON schema for the tool input shape that the model will produce in tool_use output content blocks.
For example, if you defined tools as:

[
{
"name": "get_stock_price",
"description": "Get the current stock price for a given ticker symbol.",
"input_schema": {
"type": "object",
"properties": {
"ticker": {
"type": "string",
"description": "The stock ticker symbol, e.g. AAPL for Apple Inc."
}
},
"required": ["ticker"]
}
}
]
And then asked the model "What's the S&P 500 at today?", the model might produce tool_use content blocks in the response like this:

[
{
"type": "tool_use",
"id": "toolu_01D7FLrfh4GYq7yT1ULFeyMV",
"name": "get_stock_price",
"input": { "ticker": "^GSPC" }
}
]
You might then run your get_stock_price tool with {"ticker": "^GSPC"} as an input, and return the following back to the model in a subsequent user message:

[
{
"type": "tool_result",
"tool_use_id": "toolu_01D7FLrfh4GYq7yT1ULFeyMV",
"content": "259.75 USD"
}
]
Tools can be used for workflows that include running client-side tools and functions, or more generally whenever you want the model to produce a particular JSON structure of output.

See our guide for more details.

Tool
ComputerUseTool_20241022
BashTool_20241022
TextEditor_20241022

Show child attributes

top_k
integer
Only sample from the top K options for each subsequent token.

Used to remove "long tail" low probability responses. Learn more technical details here.

Recommended for advanced use cases only. You usually only need to use temperature.

top_p
number
Use nucleus sampling.

In nucleus sampling, we compute the cumulative distribution over all the options for each subsequent token in decreasing probability order and cut it off once it reaches a particular probability specified by top_p. You should either alter temperature or top_p, but not both.

Recommended for advanced use cases only. You usually only need to use temperature.

Response
200 - application/json
id
string
required
Unique object identifier.

The format and length of IDs may change over time.

type
enum<string>
default: message
required
Object type.

For Messages, this is always "message".

Available options: message
role
enum<string>
default: assistant
required
Conversational role of the generated message.

This will always be "assistant".

Available options: assistant
content
object[]
required
Content generated by the model.

This is an array of content blocks, each of which has a type that determines its shape.

Example:

[{"type": "text", "text": "Hi, I'm Claude."}]
If the request input messages ended with an assistant turn, then the response content will continue directly from that last turn. You can use this to constrain the model's output.

For example, if the input messages were:

[
{"role": "user", "content": "What's the Greek name for Sun? (A) Sol (B) Helios (C) Sun"},
{"role": "assistant", "content": "The best answer is ("}
]
Then the response content might be:

[{"type": "text", "text": "B)"}]
Text
Tool Use

Show child attributes

model
string
required
The model that handled the request.

stop_reason
enum<string> | null
required
The reason that we stopped.

This may be one the following values:

"end_turn": the model reached a natural stopping point
"max_tokens": we exceeded the requested max_tokens or the model's maximum
"stop_sequence": one of your provided custom stop_sequences was generated
"tool_use": the model invoked one or more tools
In non-streaming mode this value is always non-null. In streaming mode, it is null in the message_start event and non-null otherwise.

Available options: end_turn, max_tokens, stop_sequence, tool_use
stop_sequence
string | null
required
Which custom stop sequence was generated, if any.

This value will be a non-null string if one of your custom stop sequences was generated.

usage
object
required
Billing and rate-limit usage.

Anthropic's API bills and rate-limits by token counts, as tokens represent the underlying cost to our systems.

Under the hood, the API transforms requests into a format suitable for the model. The model's output then goes through a parsing stage before becoming an API response. As a result, the token counts in usage will not match one-to-one with the exact visible content of an API request or response.

For example, output_tokens will be non-zero, even for an empty string response from Claude.

Show child attributes

Vertex AI API
메시지 토큰 수 계산 (베타)
x
linkedin

cURL

Python

JavaScript

import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

await anthropic.messages.create({
model: "claude-3-5-sonnet-20241022",
max_tokens: 1024,
messages: [
{"role": "user", "content": "Hello, world"}
]
});

200

4XX

{
"content": [
{
"text": "Hi! My name is Claude.",
"type": "text"
}
],
"id": "msg_013Zva2CMHLNnXjNJJKqJ2EF",
"model": "claude-3-5-sonnet-20241022",
"role": "assistant",
"stop_reason": "end_turn",
"stop_sequence": null,
"type": "message",
"usage": {
"input_tokens": 2095,
"output_tokens": 503
}
}
Create a Message - Anthropic

,
Anthropic home pagedark logo
한국어

Search...
Ctrl K
Research
News
Go to claude.ai

환영합니다
API 참조
사용자 가이드
프롬프트 라이브러리
릴리스 노트
개발자 뉴스레터
개발자 콘솔
개발자 Discord
지원
API 사용하기
시작하기
IP 주소
버전
오류
요율 제한
클라이언트 SDK
지원되는 지역
도움 받기
Amazon Bedrock API
Amazon Bedrock API
Vertex AI
Vertex AI API
Anthropic API
메시지
POST
Create a Message
POST
메시지 토큰 수 계산 (베타)
메시지 스트리밍
텍스트 완성에서 마이그레이션하기
메시지 예시
메시지 배치 (베타)
텍스트 완성 (레거시)
메시지
메시지 토큰 수 계산 (베타)
Count the number of tokens in a Message.

The Token Count API can be used to count the number of tokens in a Message, including tools, images, and documents, without creating it.

POST
/
v1
/
messages
/
count_tokens
베타 기간 동안, 이 엔드포인트는 anthropic-beta 헤더에 token-counting-2024-11-01 값을 전달해야 합니다
Headers
anthropic-beta
string[]
Optional header to specify the beta version(s) you want to use.

To use multiple betas, use a comma separated list like beta1,beta2 or specify the header multiple times for each beta.

anthropic-version
string
required
The version of the Anthropic API you want to use.

Read more about versioning and our version history here.

x-api-key
string
required
Your unique API key for authentication.

This key is required in the header of all API requests, to authenticate your account and access Anthropic's services. Get your API key through the Console. Each key is scoped to a Workspace.

Body
application/json
tool_choice
object
How the model should use the provided tools. The model can use a specific tool, any available tool, or decide by itself.

Tool Choice
Tool Choice
Tool Choice

Show child attributes

tools
object[]
Definitions of tools that the model may use.

If you include tools in your API request, the model may return tool_use content blocks that represent the model's use of those tools. You can then run those tools using the tool input generated by the model and then optionally return results back to the model using tool_result content blocks.

Each tool definition includes:

name: Name of the tool.
description: Optional, but strongly-recommended description of the tool.
input_schema: JSON schema for the tool input shape that the model will produce in tool_use output content blocks.
For example, if you defined tools as:

[
{
"name": "get_stock_price",
"description": "Get the current stock price for a given ticker symbol.",
"input_schema": {
"type": "object",
"properties": {
"ticker": {
"type": "string",
"description": "The stock ticker symbol, e.g. AAPL for Apple Inc."
}
},
"required": ["ticker"]
}
}
]
And then asked the model "What's the S&P 500 at today?", the model might produce tool_use content blocks in the response like this:

[
{
"type": "tool_use",
"id": "toolu_01D7FLrfh4GYq7yT1ULFeyMV",
"name": "get_stock_price",
"input": { "ticker": "^GSPC" }
}
]
You might then run your get_stock_price tool with {"ticker": "^GSPC"} as an input, and return the following back to the model in a subsequent user message:

[
{
"type": "tool_result",
"tool_use_id": "toolu_01D7FLrfh4GYq7yT1ULFeyMV",
"content": "259.75 USD"
}
]
Tools can be used for workflows that include running client-side tools and functions, or more generally whenever you want the model to produce a particular JSON structure of output.

See our guide for more details.

Tool
ComputerUseTool_20241022
BashTool_20241022
TextEditor_20241022

Show child attributes

messages
object[]
required
Input messages.

Our models are trained to operate on alternating user and assistant conversational turns. When creating a new Message, you specify the prior conversational turns with the messages parameter, and the model then generates the next Message in the conversation. Consecutive user or assistant turns in your request will be combined into a single turn.

Each input message must be an object with a role and content. You can specify a single user-role message, or you can include multiple user and assistant messages.

If the final message uses the assistant role, the response content will continue immediately from the content in that message. This can be used to constrain part of the model's response.

Example with a single user message:

[{"role": "user", "content": "Hello, Claude"}]
Example with multiple conversational turns:

[
{"role": "user", "content": "Hello there."},
{"role": "assistant", "content": "Hi, I'm Claude. How can I help you?"},
{"role": "user", "content": "Can you explain LLMs in plain English?"},
]
Example with a partially-filled response from Claude:

[
{"role": "user", "content": "What's the Greek name for Sun? (A) Sol (B) Helios (C) Sun"},
{"role": "assistant", "content": "The best answer is ("},
]
Each input message content may be either a single string or an array of content blocks, where each block has a specific type. Using a string for content is shorthand for an array of one content block of type "text". The following input messages are equivalent:

{"role": "user", "content": "Hello, Claude"}
{"role": "user", "content": [{"type": "text", "text": "Hello, Claude"}]}
Starting with Claude 3 models, you can also send image content blocks:

{"role": "user", "content": [
{
"type": "image",
"source": {
"type": "base64",
"media_type": "image/jpeg",
"data": "/9j/4AAQSkZJRg...",
}
},
{"type": "text", "text": "What is in this image?"}
]}
We currently support the base64 source type for images, and the image/jpeg, image/png, image/gif, and image/webp media types.

See examples for more input examples.

Note that if you want to include a system prompt, you can use the top-level system parameter — there is no "system" role for input messages in the Messages API.

Show child attributes

system

string
System prompt.

A system prompt is a way of providing context and instructions to Claude, such as specifying a particular goal or role. See our guide to system prompts.

model
string
required
The model that will complete your prompt.

See models for additional details and options.

Response
200 - application/json
input_tokens
integer
required
The total number of tokens across the provided list of messages, system prompt, and tools.

Create a Message
메시지 스트리밍
x
linkedin

cURL

Python

JavaScript

import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

await anthropic.beta.messages.countTokens({
model: "claude-3-5-sonnet-20241022",
messages: [
{"role": "user", "content": "Hello, world"}
]
});

200

4XX

{
"input_tokens": 2095
}
메시지 토큰 수 계산 (베타) - Anthropic

,
Anthropic home pagedark logo
한국어

Search...
Ctrl K
Research
News
Go to claude.ai

환영합니다
API 참조
사용자 가이드
프롬프트 라이브러리
릴리스 노트
개발자 뉴스레터
개발자 콘솔
개발자 Discord
지원
API 사용하기
시작하기
IP 주소
버전
오류
요율 제한
클라이언트 SDK
지원되는 지역
도움 받기
Amazon Bedrock API
Amazon Bedrock API
Vertex AI
Vertex AI API
Anthropic API
메시지
POST
Create a Message
POST
메시지 토큰 수 계산 (베타)
메시지 스트리밍
텍스트 완성에서 마이그레이션하기
메시지 예시
메시지 배치 (베타)
텍스트 완성 (레거시)
메시지
메시지 스트리밍
메시지를 생성할 때 "stream": true를 설정하여 서버 전송 이벤트(SSE)를 사용해 응답을 점진적으로 스트리밍할 수 있습니다.

​
SDK를 사용한 스트리밍
Python과 TypeScript SDK는 여러 가지 스트리밍 방법을 제공합니다. Python SDK는 동기 및 비동기 스트림을 모두 지원합니다. 자세한 내용은 각 SDK의 문서를 참조하세요.

Python

TypeScript

import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
max_tokens=1024,
messages=[{"role": "user", "content": "Hello"}],
model="claude-3-5-sonnet-20241022",
) as stream:
for text in stream.text_stream:
print(text, end="", flush=True)
​
이벤트 유형
각 서버 전송 이벤트는 명명된 이벤트 유형과 관련 JSON 데이터를 포함합니다. 각 이벤트는 SSE 이벤트 이름(예: event: message_stop)을 사용하고, 데이터에 일치하는 이벤트 type을 포함합니다.

각 스트림은 다음과 같은 이벤트 흐름을 사용합니다:

message_start: 빈 content가 있는 Message 객체를 포함합니다.
일련의 콘텐츠 블록으로, 각각 content_block_start, 하나 이상의 content_block_delta 이벤트, 그리고 content_block_stop 이벤트를 가집니다. 각 콘텐츠 블록은 최종 Message content 배열의 해당 인덱스에 대응하는 index를 가집니다.
하나 이상의 message_delta 이벤트로, 최종 Message 객체의 최상위 변경 사항을 나타냅니다.
최종 message_stop 이벤트.
​
Ping 이벤트
이벤트 스트림에는 임의의 수의 ping 이벤트가 포함될 수 있습니다.

​
오류 이벤트
때때로 이벤트 스트림에서 오류가 전송될 수 있습니다. 예를 들어, 사용량이 많은 기간 동안 overloaded_error를 받을 수 있는데, 이는 일반적으로 비스트리밍 상황에서 HTTP 529에 해당합니다:

오류 예시

event: error
data: {"type": "error", "error": {"type": "overloaded_error", "message": "Overloaded"}}
​
기타 이벤트
버전 관리 정책에 따라 새로운 이벤트 유형이 추가될 수 있으며, 코드는 알 수 없는 이벤트 유형을 원활하게 처리해야 합니다.

​
델타 유형
각 content_block_delta 이벤트는 주어진 index에서 content 블록을 업데이트하는 유형의 delta를 포함합니다.

​
텍스트 델타
text 콘텐츠 블록 델타는 다음과 같습니다:

텍스트 델타

event: content*block_delta
data: {"type": "content_block_delta","index": 0,"delta": {"type": "text_delta", "text": "ello frien"}}
​
입력 JSON 델타
tool_use 콘텐츠 블록의 델타는 블록의 input 필드에 대한 업데이트에 해당합니다. 최대한의 세분화를 지원하기 위해 델타는 *부분 JSON 문자열*인 반면, 최종 tool_use.input은 항상 *객체\_입니다.

content_block_stop 이벤트를 받을 때까지 문자열 델타를 누적하고 Pydantic과 같은 라이브러리를 사용하여 JSON을 파싱하거나, 파싱된 증분 값에 접근하기 위한 헬퍼를 제공하는 SDK를 사용할 수 있습니다.

tool_use 콘텐츠 블록 델타는 다음과 같습니다:

입력 JSON 델타

event: content_block_delta
data: {"type": "content_block_delta","index": 1,"delta": {"type": "input_json_delta","partial_json": "{\"location\": \"San Fra"}}}
참고: 현재 모델은 input에서 하나의 완전한 키와 값 속성만 방출하는 것을 지원합니다. 따라서 도구를 사용할 때 모델이 작업하는 동안 스트리밍 이벤트 사이에 지연이 있을 수 있습니다. input 키와 값이 누적되면, 향후 모델에서 더 세밀한 세분화를 자동으로 지원할 수 있도록 여러 content_block_delta 이벤트로 청크화된 부분 json으로 방출됩니다.

​
Raw HTTP 스트림 응답
스트리밍 모드를 사용할 때는 클라이언트 SDK를 사용하는 것을 강력히 권장합니다. 하지만 직접 API 통합을 구축하는 경우에는 이러한 이벤트를 직접 처리해야 합니다.

스트림 응답은 다음으로 구성됩니다:

message_start 이벤트
잠재적으로 여러 콘텐츠 블록이 포함되며, 각각은 다음을 포함합니다: a. content_block_start 이벤트 b. 잠재적으로 여러 content_block_delta 이벤트 c. content_block_stop 이벤트
message_delta 이벤트
message_stop 이벤트
응답 전체에 ping 이벤트가 분산되어 있을 수 있습니다. 형식에 대한 자세한 내용은 이벤트 유형을 참조하세요.

​
기본 스트리밍 요청
요청

curl https://api.anthropic.com/v1/messages \
 --header "anthropic-version: 2023-06-01" \
 --header "content-type: application/json" \
 --header "x-api-key: $ANTHROPIC_API_KEY" \
 --data \
'{
"model": "claude-3-5-sonnet-20241022",
"messages": [{"role": "user", "content": "Hello"}],
"max_tokens": 256,
"stream": true
}'
응답

event: message_start
data: {"type": "message_start", "message": {"id": "msg_1nZdL29xx5MUA1yADyHTEsnR8uuvGzszyY", "type": "message", "role": "assistant", "content": [], "model": "claude-3-5-sonnet-20241022", "stop_reason": null, "stop_sequence": null, "usage": {"input_tokens": 25, "output_tokens": 1}}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

event: ping
data: {"type": "ping"}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "Hello"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "!"}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn", "stop_sequence":null}, "usage": {"output_tokens": 15}}

event: message_stop
data: {"type": "message_stop"}
​
도구 사용이 포함된 스트리밍 요청
이 요청에서는 Claude에게 도구를 사용하여 날씨를 알려달라고 요청합니다.

요청

curl https://api.anthropic.com/v1/messages \
 -H "content-type: application/json" \
 -H "x-api-key: $ANTHROPIC_API_KEY" \
 -H "anthropic-version: 2023-06-01" \
 -d '{
"model": "claude-3-5-sonnet-20241022",
"max_tokens": 1024,
"tools": [
{
"name": "get_weather",
"description": "Get the current weather in a given location",
"input_schema": {
"type": "object",
"properties": {
"location": {
"type": "string",
"description": "The city and state, e.g. San Francisco, CA"
}
},
"required": ["location"]
}
}
],
"tool_choice": {"type": "any"},
"messages": [
{
"role": "user",
"content": "What is the weather like in San Francisco?"
}
],
"stream": true
}'
응답

event: message_start
data: {"type":"message_start","message":{"id":"msg_014p7gG3wDgGV9EUtLvnow3U","type":"message","role":"assistant","model":"claude-3-haiku-20240307","stop_sequence":null,"usage":{"input_tokens":472,"output_tokens":2},"content":[],"stop_reason":null}}

event: content_block_start
data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}

event: ping
data: {"type": "ping"}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"Okay"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":","}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" let"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"'s"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" check"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" the"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" weather"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" for"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" San"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" Francisco"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":","}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":" CA"}}

event: content_block_delta
data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":":"}}

event: content_block_stop
data: {"type":"content_block_stop","index":0}

event: content_block_start
data: {"type":"content_block_start","index":1,"content_block":{"type":"tool_use","id":"toolu_01T1x1fJ34qAmk2tNTrN7Up6","name":"get_weather","input":{}}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":""}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"{\"location\":"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" \"San"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" Francisc"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"o,"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":" CA\""}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":", "}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"\"unit\": \"fah"}}

event: content_block_delta
data: {"type":"content_block_delta","index":1,"delta":{"type":"input_json_delta","partial_json":"renheit\"}"}}

event: content_block_stop
data: {"type":"content_block_stop","index":1}

event: message_delta
data: {"type":"message_delta","delta":{"stop_reason":"tool_use","stop_sequence":null},"usage":{"output_tokens":89}}

event: message_stop
data: {"type":"message_stop"}
메시지 토큰 수 계산 (베타)
텍스트 완성에서 마이그레이션하기
x
linkedin
On this page
SDK를 사용한 스트리밍
이벤트 유형
Ping 이벤트
오류 이벤트
기타 이벤트
델타 유형
텍스트 델타
입력 JSON 델타
Raw HTTP 스트림 응답
기본 스트리밍 요청
도구 사용이 포함된 스트리밍 요청
메시지 스트리밍 - Anthropic

,

Anthropic home pagedark logo
한국어

Search...
Ctrl K
Research
News
Go to claude.ai

환영합니다
API 참조
사용자 가이드
프롬프트 라이브러리
릴리스 노트
개발자 뉴스레터
개발자 콘솔
개발자 Discord
지원
API 사용하기
시작하기
IP 주소
버전
오류
요율 제한
클라이언트 SDK
지원되는 지역
도움 받기
Amazon Bedrock API
Amazon Bedrock API
Vertex AI
Vertex AI API
Anthropic API
메시지
POST
Create a Message
POST
메시지 토큰 수 계산 (베타)
메시지 스트리밍
텍스트 완성에서 마이그레이션하기
메시지 예시
메시지 배치 (베타)
텍스트 완성 (레거시)
메시지
텍스트 완성에서 마이그레이션하기
텍스트 완성에서 메시지로 마이그레이션하기

텍스트 완성에서 메시지로 마이그레이션할 때 다음과 같은 변경 사항을 고려하세요.

​
입력과 출력
텍스트 완성과 메시지 간의 가장 큰 차이점은 모델 입력을 지정하고 모델로부터 출력을 받는 방식입니다.

텍스트 완성에서는 입력이 원시 문자열입니다:

Python

prompt = "\n\nHuman: Hello there\n\nAssistant: Hi, I'm Claude. How can I help?\n\nHuman: Can you explain Glycolysis to me?\n\nAssistant:"
메시지에서는 원시 프롬프트 대신 입력 메시지 목록을 지정합니다:

Shorthand

Expanded

messages = [
{"role": "user", "content": "Hello there."},
{"role": "assistant", "content": "Hi, I'm Claude. How can I help?"},
{"role": "user", "content": "Can you explain Glycolysis to me?"},
]
각 입력 메시지는 role과 content를 가집니다.

역할 이름

텍스트 완성 API는 \n\nHuman:과 \n\nAssistant:가 번갈아 나타나는 것을 기대하지만, 메시지 API는 user와 assistant 역할을 기대합니다. “human” 또는 “user” 턴을 언급하는 문서를 보실 수 있습니다. 이들은 동일한 역할을 의미하며, 앞으로는 “user”로 통일됩니다.

텍스트 완성에서는 모델이 생성한 텍스트가 응답의 completion 값으로 반환됩니다:

Python

> > > response = anthropic.completions.create(...)
> > > response.completion
> > > " Hi, I'm Claude"
> > > 메시지에서는 응답이 콘텐츠 블록 목록인 content 값입니다:

Python

> > > response = anthropic.messages.create(...)
> > > response.content
> > > [{"type": "text", "text": "Hi, I'm Claude"}]
> > > ​
> > > Claude의 말을 미리 채우기
> > > 텍스트 완성에서는 Claude의 응답 일부를 미리 채울 수 있습니다:

Python

prompt = "\n\nHuman: Hello\n\nAssistant: Hello, my name is"
메시지에서는 마지막 입력 메시지에 assistant 역할을 부여하여 동일한 결과를 얻을 수 있습니다:

Python

messages = [
{"role": "human", "content": "Hello"},
{"role": "assistant", "content": "Hello, my name is"},
]
이렇게 하면 응답 content가 마지막 입력 메시지 content에서 이어집니다:

JSON

{
"role": "assistant",
"content": [{"type": "text", "text": " Claude. How can I assist you today?" }],
...
}
​
시스템 프롬프트
텍스트 완성에서는 첫 번째 \n\nHuman: 턴 이전에 텍스트를 추가하여 시스템 프롬프트를 지정합니다:

Python

prompt = "Today is January 1, 2024.\n\nHuman: Hello, Claude\n\nAssistant:"
메시지에서는 system 매개변수로 시스템 프롬프트를 지정합니다:

Python

anthropic.Anthropic().messages.create(
model="claude-3-opus-20240229",
max_tokens=1024,
system="Today is January 1, 2024.", # <-- 시스템 프롬프트
messages=[
{"role": "user", "content": "Hello, Claude"}
]
)
​
모델 이름
메시지 API는 전체 모델 버전을 지정해야 합니다(예: claude-3-opus-20240229).

이전에는 주 버전 번호만 지정하는 것을 지원했으며(예: claude-2), 이는 부 버전으로 자동 업그레이드되었습니다. 하지만 이제는 이러한 통합 패턴을 더 이상 권장하지 않으며, 메시지는 이를 지원하지 않습니다.

​
중단 이유
텍스트 완성은 항상 다음 중 하나의 stop_reason을 가집니다:

"stop_sequence": 모델이 자연스럽게 턴을 종료했거나, 사용자가 지정한 중단 시퀀스 중 하나가 생성되었습니다.
"max_tokens": 모델이 지정된 max_tokens만큼의 콘텐츠를 생성했거나, 절대 최대값에 도달했습니다.
메시지는 다음 값 중 하나의 stop_reason을 가집니다:

"end_turn": 대화 턴이 자연스럽게 종료되었습니다.
"stop_sequence": 지정된 사용자 정의 중단 시퀀스 중 하나가 생성되었습니다.
"max_tokens": (변경 없음)
​
최대 토큰 지정
텍스트 완성: max_tokens_to_sample 매개변수. 유효성 검사는 없지만 모델별로 상한값이 있습니다.
메시지: max_tokens 매개변수. 모델이 지원하는 것보다 높은 값을 전달하면 유효성 검사 오류가 반환됩니다.
​
스트리밍 형식
텍스트 완성에서 "stream": true를 사용할 때, 응답에는 completion, ping, error 서버 전송 이벤트가 포함되었습니다. 자세한 내용은 텍스트 완성 스트리밍을 참조하세요.

메시지는 여러 유형의 콘텐츠 블록을 포함할 수 있으므로 스트리밍 형식이 다소 더 복잡합니다. 자세한 내용은 메시지 스트리밍을 참조하세요.

메시지 스트리밍
메시지 예시
x
linkedin
On this page
입력과 출력
Claude의 말을 미리 채우기
시스템 프롬프트
모델 이름
중단 이유
최대 토큰 지정
스트리밍 형식
텍스트 완성에서 마이그레이션하기 - Anthropic

,
Anthropic home pagedark logo
한국어

Search...
Ctrl K
Research
News
Go to claude.ai

환영합니다
API 참조
사용자 가이드
프롬프트 라이브러리
릴리스 노트
개발자 뉴스레터
개발자 콘솔
개발자 Discord
지원
API 사용하기
시작하기
IP 주소
버전
오류
요율 제한
클라이언트 SDK
지원되는 지역
도움 받기
Amazon Bedrock API
Amazon Bedrock API
Vertex AI
Vertex AI API
Anthropic API
메시지
POST
Create a Message
POST
메시지 토큰 수 계산 (베타)
메시지 스트리밍
텍스트 완성에서 마이그레이션하기
메시지 예시
메시지 배치 (베타)
텍스트 완성 (레거시)
메시지
메시지 예시
메시지 API의 요청 및 응답 예시

전체 매개변수 문서는 API 참조를 참조하세요.

​
기본 요청 및 응답

Shell

Python

TypeScript

#!/bin/sh
curl https://api.anthropic.com/v1/messages \
 --header "x-api-key: $ANTHROPIC_API_KEY" \
 --header "anthropic-version: 2023-06-01" \
 --header "content-type: application/json" \
 --data \
'{
"model": "claude-3-5-sonnet-20241022",
"max_tokens": 1024,
"messages": [
{"role": "user", "content": "Hello, Claude"}
]
}'
JSON

{
"id": "msg_01XFDUDYJgAACzvnptvVoYEL",
"type": "message",
"role": "assistant",
"content": [
{
"type": "text",
"text": "Hello!"
}
],
"model": "claude-3-5-sonnet-20241022",
"stop_reason": "end_turn",
"stop_sequence": null,
"usage": {
"input_tokens": 12,
"output_tokens": 6
}
}
​
다중 대화 턴
메시지 API는 상태를 저장하지 않으므로, API에 항상 전체 대화 기록을 전송해야 합니다. 이 패턴을 사용하여 시간이 지남에 따라 대화를 구축할 수 있습니다. 이전 대화 턴이 반드시 Claude에서 실제로 시작될 필요는 없으며, 합성 assistant 메시지를 사용할 수 있습니다.

Shell

#!/bin/sh
curl https://api.anthropic.com/v1/messages \
 --header "x-api-key: $ANTHROPIC_API_KEY" \
 --header "anthropic-version: 2023-06-01" \
 --header "content-type: application/json" \
 --data \
'{
"model": "claude-3-5-sonnet-20241022",
"max_tokens": 1024,
"messages": [
{"role": "user", "content": "Hello, Claude"},
{"role": "assistant", "content": "Hello!"},
{"role": "user", "content": "Can you describe LLMs to me?"}
]
}'
Python

import anthropic

message = anthropic.Anthropic().messages.create(
model="claude-3-5-sonnet-20241022",
max_tokens=1024,
messages=[
{"role": "user", "content": "Hello, Claude"},
{"role": "assistant", "content": "Hello!"},
{"role": "user", "content": "Can you describe LLMs to me?"}
],
)
print(message)
TypeScript

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

await anthropic.messages.create({
model: 'claude-3-5-sonnet-20241022',
max_tokens: 1024,
messages: [
{"role": "user", "content": "Hello, Claude"},
{"role": "assistant", "content": "Hello!"},
{"role": "user", "content": "Can you describe LLMs to me?"}
]
});
JSON

{
"id": "msg_018gCsTGsXkYJVqYPxTgDHBU",
"type": "message",
"role": "assistant",
"content": [
{
"type": "text",
"text": "Sure, I'd be happy to provide..."
}
],
"stop_reason": "end_turn",
"stop_sequence": null,
"usage": {
"input_tokens": 30,
"output_tokens": 309
}
}
​
Claude의 답변 미리 채우기
입력 메시지 목록의 마지막 위치에 Claude의 응답 일부를 미리 채울 수 있습니다. 이를 통해 Claude의 응답을 형성할 수 있습니다. 아래 예시는 "max_tokens": 1을 사용하여 Claude로부터 단일 객관식 답변을 얻습니다.

Shell

Python

TypeScript

#!/bin/sh
curl https://api.anthropic.com/v1/messages \
 --header "x-api-key: $ANTHROPIC_API_KEY" \
 --header "anthropic-version: 2023-06-01" \
 --header "content-type: application/json" \
 --data \
'{
"model": "claude-3-5-sonnet-20241022",
"max_tokens": 1,
"messages": [
{"role": "user", "content": "What is latin for Ant? (A) Apoidea, (B) Rhopalocera, (C) Formicidae"},
{"role": "assistant", "content": "The answer is ("}
]
}'
JSON

{
"id": "msg_01Q8Faay6S7QPTvEUUQARt7h",
"type": "message",
"role": "assistant",
"content": [
{
"type": "text",
"text": "C"
}
],
"model": "claude-3-5-sonnet-20241022",
"stop_reason": "max_tokens",
"stop_sequence": null,
"usage": {
"input_tokens": 42,
"output_tokens": 1
}
}
​
비전
Claude는 요청에서 텍스트와 이미지를 모두 읽을 수 있습니다. 현재 이미지에 대해 base64 소스 유형과 image/jpeg, image/png, image/gif, image/webp 미디어 유형을 지원합니다. 자세한 내용은 비전 가이드를 참조하세요.

Shell

Python

TypeScript

#!/bin/sh

IMAGE_URL="https://upload.wikimedia.org/wikipedia/commons/a/a7/Camponotus_flavomarginatus_ant.jpg"
IMAGE_MEDIA_TYPE="image/jpeg"
IMAGE_BASE64=$(curl "$IMAGE_URL" | base64)

curl https://api.anthropic.com/v1/messages \
 --header "x-api-key: $ANTHROPIC_API_KEY" \
     --header "anthropic-version: 2023-06-01" \
     --header "content-type: application/json" \
     --data \
'{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 1024,
    "messages": [
        {"role": "user", "content": [
            {"type": "image", "source": {
                "type": "base64",
                "media_type": "'$IMAGE_MEDIA_TYPE'",
"data": "'$IMAGE_BASE64'"
}},
{"type": "text", "text": "What is in the above image?"}
]}
]
}'
JSON

{
"id": "msg_01EcyWo6m4hyW8KHs2y2pei5",
"type": "message",
"role": "assistant",
"content": [
{
"type": "text",
"text": "This image shows an ant, specifically a close-up view of an ant. The ant is shown in detail, with its distinct head, antennae, and legs clearly visible. The image is focused on capturing the intricate details and features of the ant, likely taken with a macro lens to get an extreme close-up perspective."
}
],
"model": "claude-3-5-sonnet-20241022",
"stop_reason": "end_turn",
"stop_sequence": null,
"usage": {
"input_tokens": 1551,
"output_tokens": 71
}
}
​
도구 사용, JSON 모드 및 컴퓨터 사용 (베타)
메시지 API에서 도구를 사용하는 방법에 대한 예시는 가이드를 참조하세요. 메시지 API로 데스크톱 컴퓨터 환경을 제어하는 방법에 대한 예시는 컴퓨터 사용 (베타) 가이드를 참조하세요.

텍스트 완성에서 마이그레이션하기
메시지 배치 생성하기 (베타)
x
linkedin
On this page
기본 요청 및 응답
다중 대화 턴
Claude의 답변 미리 채우기
비전
도구 사용, JSON 모드 및 컴퓨터 사용 (베타)
메시지 예시 - Anthropic

,
Anthropic home pagedark logo
한국어

Search...
Ctrl K
Research
News
Go to claude.ai

환영합니다
API 참조
사용자 가이드
프롬프트 라이브러리
릴리스 노트
개발자 뉴스레터
개발자 콘솔
개발자 Discord
지원
API 사용하기
시작하기
IP 주소
버전
오류
요율 제한
클라이언트 SDK
지원되는 지역
도움 받기
Amazon Bedrock API
Amazon Bedrock API
Vertex AI
Vertex AI API
Anthropic API
메시지
POST
Create a Message
POST
메시지 토큰 수 계산 (베타)
메시지 스트리밍
텍스트 완성에서 마이그레이션하기
메시지 예시
메시지 배치 (베타)
POST
메시지 배치 생성하기 (베타)
GET
메시지 배치 검색 (베타)
GET
메시지 배치 결과 검색 (베타)
GET
메시지 배치 목록 조회 (베타)
POST
메시지 배치 취소하기 (베타)
메시지 배치 예제
텍스트 완성 (레거시)
메시지 배치 (베타)
메시지 배치 생성하기 (베타)
Send a batch of Message creation requests.

The Message Batches API can be used to process multiple Messages API requests at once. Once a Message Batch is created, it begins processing immediately. Batches can take up to 24 hours to complete.

POST
/
v1
/
messages
/
batches
베타 기간 동안 이 엔드포인트를 사용하려면 anthropic-beta 헤더에 message-batches-2024-09-24 값을 전달해야 합니다
​
기능 지원
메시지 배치 API는 다음 모델들을 지원합니다: Claude 3 Haiku, Claude 3 Opus, 그리고 Claude 3.5 Sonnet. 메시지 API에서 사용 가능한 모든 기능들은 베타 기능을 포함하여 메시지 배치 API를 통해 사용할 수 있습니다.

베타 기간 동안, 배치는 최대 10,000개의 요청을 포함할 수 있으며 총 크기는 32 MB까지 가능합니다.

Headers
anthropic-beta
string[]
Optional header to specify the beta version(s) you want to use.

To use multiple betas, use a comma separated list like beta1,beta2 or specify the header multiple times for each beta.

anthropic-version
string
required
The version of the Anthropic API you want to use.

Read more about versioning and our version history here.

x-api-key
string
required
Your unique API key for authentication.

This key is required in the header of all API requests, to authenticate your account and access Anthropic's services. Get your API key through the Console. Each key is scoped to a Workspace.

Body
application/json
requests
object[]
required
List of requests for prompt completion. Each is an individual request to create a Message.

Show child attributes

Response
200 - application/json
id
string
required
Unique object identifier.

The format and length of IDs may change over time.

type
enum<string>
default: message_batch
required
Object type.

For Message Batches, this is always "message_batch".

Available options: message_batch
processing_status
enum<string>
required
Processing status of the Message Batch.

Available options: in_progress, canceling, ended
request_counts
object
required
Tallies requests within the Message Batch, categorized by their status.

Requests start as processing and move to one of the other statuses only once processing of the entire batch ends. The sum of all values always matches the total number of requests in the batch.

Show child attributes

ended_at
string | null
required
RFC 3339 datetime string representing the time at which processing for the Message Batch ended. Specified only once processing ends.

Processing ends when every request in a Message Batch has either succeeded, errored, canceled, or expired.

created_at
string
required
RFC 3339 datetime string representing the time at which the Message Batch was created.

expires_at
string
required
RFC 3339 datetime string representing the time at which the Message Batch will expire and end processing, which is 24 hours after creation.

archived_at
string | null
required
RFC 3339 datetime string representing the time at which the Message Batch was archived and its results became unavailable.

cancel_initiated_at
string | null
required
RFC 3339 datetime string representing the time at which cancellation was initiated for the Message Batch. Specified only if cancellation was initiated.

results_url
string | null
required
URL to a .jsonl file containing the results of the Message Batch requests. Specified only once processing ends.

Results in the file are not guaranteed to be in the same order as requests. Use the custom_id field to match results to requests.

메시지 예시
메시지 배치 검색 (베타)
x
linkedin

cURL

Python

JavaScript

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

await anthropic.beta.messages.batches.create({
requests: [{
custom_id: "my-first-request",
params: {
model: "claude-3-5-sonnet-20241022",
max_tokens: 1024,
messages: [
{"role": "user", "content": "Hello, world"}
]
}
}, {
custom_id: "my-second-request",
params: {
model: "claude-3-5-sonnet-20241022",
max_tokens: 1024,
messages: [
{"role": "user", "content": "Hi again, friend"}
]
}
}]
});

200

4XX

{
"id": "msgbatch_013Zva2CMHLNnXjNJJKqJ2EF",
"type": "message_batch",
"processing_status": "in_progress",
"request_counts": {
"processing": 100,
"succeeded": 50,
"errored": 30,
"canceled": 10,
"expired": 10
},
"ended_at": "2024-08-20T18:37:24.100435Z",
"created_at": "2024-08-20T18:37:24.100435Z",
"expires_at": "2024-08-20T18:37:24.100435Z",
"archived_at": "2024-08-20T18:37:24.100435Z",
"cancel_initiated_at": "2024-08-20T18:37:24.100435Z",
"results_url": "https://api.anthropic.com/v1/messages/batches/msgbatch_013Zva2CMHLNnXjNJJKqJ2EF/results"
}
메시지 배치 생성하기 (베타) - Anthropic

,
Anthropic home pagedark logo
한국어

Search...
Ctrl K
Research
News
Go to claude.ai

환영합니다
API 참조
사용자 가이드
프롬프트 라이브러리
릴리스 노트
개발자 뉴스레터
개발자 콘솔
개발자 Discord
지원
API 사용하기
시작하기
IP 주소
버전
오류
요율 제한
클라이언트 SDK
지원되는 지역
도움 받기
Amazon Bedrock API
Amazon Bedrock API
Vertex AI
Vertex AI API
Anthropic API
메시지
POST
Create a Message
POST
메시지 토큰 수 계산 (베타)
메시지 스트리밍
텍스트 완성에서 마이그레이션하기
메시지 예시
메시지 배치 (베타)
POST
메시지 배치 생성하기 (베타)
GET
메시지 배치 검색 (베타)
GET
메시지 배치 결과 검색 (베타)
GET
메시지 배치 목록 조회 (베타)
POST
메시지 배치 취소하기 (베타)
메시지 배치 예제
텍스트 완성 (레거시)
메시지 배치 (베타)
메시지 배치 검색 (베타)
This endpoint is idempotent and can be used to poll for Message Batch completion. To access the results of a Message Batch, make a request to the results_url field in the response.

GET
/
v1
/
messages
/
batches
/
{message_batch_id}
베타 기간 동안 이 엔드포인트를 사용하려면 anthropic-beta 헤더에 message-batches-2024-09-24 값을 전달해야 합니다
Headers
anthropic-beta
string[]
Optional header to specify the beta version(s) you want to use.

To use multiple betas, use a comma separated list like beta1,beta2 or specify the header multiple times for each beta.

anthropic-version
string
required
The version of the Anthropic API you want to use.

Read more about versioning and our version history here.

x-api-key
string
required
Your unique API key for authentication.

This key is required in the header of all API requests, to authenticate your account and access Anthropic's services. Get your API key through the Console. Each key is scoped to a Workspace.

Path Parameters
message_batch_id
string
required
ID of the Message Batch.

Response
200 - application/json
id
string
required
Unique object identifier.

The format and length of IDs may change over time.

type
enum<string>
default: message_batch
required
Object type.

For Message Batches, this is always "message_batch".

Available options: message_batch
processing_status
enum<string>
required
Processing status of the Message Batch.

Available options: in_progress, canceling, ended
request_counts
object
required
Tallies requests within the Message Batch, categorized by their status.

Requests start as processing and move to one of the other statuses only once processing of the entire batch ends. The sum of all values always matches the total number of requests in the batch.

Show child attributes

ended_at
string | null
required
RFC 3339 datetime string representing the time at which processing for the Message Batch ended. Specified only once processing ends.

Processing ends when every request in a Message Batch has either succeeded, errored, canceled, or expired.

created_at
string
required
RFC 3339 datetime string representing the time at which the Message Batch was created.

expires_at
string
required
RFC 3339 datetime string representing the time at which the Message Batch will expire and end processing, which is 24 hours after creation.

archived_at
string | null
required
RFC 3339 datetime string representing the time at which the Message Batch was archived and its results became unavailable.

cancel_initiated_at
string | null
required
RFC 3339 datetime string representing the time at which cancellation was initiated for the Message Batch. Specified only if cancellation was initiated.

results_url
string | null
required
URL to a .jsonl file containing the results of the Message Batch requests. Specified only once processing ends.

Results in the file are not guaranteed to be in the same order as requests. Use the custom_id field to match results to requests.

메시지 배치 생성하기 (베타)
메시지 배치 결과 검색 (베타)
x
linkedin

cURL

Python

JavaScript

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

await anthropic.beta.messages.batches.retrieve(
"msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d",
);

200

4XX

{
"id": "msgbatch_013Zva2CMHLNnXjNJJKqJ2EF",
"type": "message_batch",
"processing_status": "in_progress",
"request_counts": {
"processing": 100,
"succeeded": 50,
"errored": 30,
"canceled": 10,
"expired": 10
},
"ended_at": "2024-08-20T18:37:24.100435Z",
"created_at": "2024-08-20T18:37:24.100435Z",
"expires_at": "2024-08-20T18:37:24.100435Z",
"archived_at": "2024-08-20T18:37:24.100435Z",
"cancel_initiated_at": "2024-08-20T18:37:24.100435Z",
"results_url": "https://api.anthropic.com/v1/messages/batches/msgbatch_013Zva2CMHLNnXjNJJKqJ2EF/results"
}
메시지 배치 검색 (베타) - Anthropic

,

Anthropic home pagedark logo
한국어

Search...
Ctrl K
Research
News
Go to claude.ai

환영합니다
API 참조
사용자 가이드
프롬프트 라이브러리
릴리스 노트
개발자 뉴스레터
개발자 콘솔
개발자 Discord
지원
API 사용하기
시작하기
IP 주소
버전
오류
요율 제한
클라이언트 SDK
지원되는 지역
도움 받기
Amazon Bedrock API
Amazon Bedrock API
Vertex AI
Vertex AI API
Anthropic API
메시지
POST
Create a Message
POST
메시지 토큰 수 계산 (베타)
메시지 스트리밍
텍스트 완성에서 마이그레이션하기
메시지 예시
메시지 배치 (베타)
POST
메시지 배치 생성하기 (베타)
GET
메시지 배치 검색 (베타)
GET
메시지 배치 결과 검색 (베타)
GET
메시지 배치 목록 조회 (베타)
POST
메시지 배치 취소하기 (베타)
메시지 배치 예제
텍스트 완성 (레거시)
메시지 배치 (베타)
메시지 배치 결과 검색 (베타)
Streams the results of a Message Batch as a .jsonl file.

Each line in the file is a JSON object containing the result of a single request in the Message Batch. Results are not guaranteed to be in the same order as requests. Use the custom_id field to match results to requests.

GET
/
v1
/
messages
/
batches
/
{message_batch_id}
/
results
베타 기간 동안 이 엔드포인트는 anthropic-beta 헤더에 message-batches-2024-09-24 값을 전달해야 합니다
메시지 배치 결과를 검색하기 위한 경로는 배치의 results_url에서 가져와야 합니다. 이 경로는 가정되어서는 안 되며 변경될 수 있습니다.
Headers
anthropic-beta
string[]
Optional header to specify the beta version(s) you want to use.

To use multiple betas, use a comma separated list like beta1,beta2 or specify the header multiple times for each beta.

anthropic-version
string
required
The version of the Anthropic API you want to use.

Read more about versioning and our version history here.

x-api-key
string
required
Your unique API key for authentication.

This key is required in the header of all API requests, to authenticate your account and access Anthropic's services. Get your API key through the Console. Each key is scoped to a Workspace.

Path Parameters
message_batch_id
string
required
ID of the Message Batch.

Response
200 - application/x-jsonl
The response is of type file.

메시지 배치 검색 (베타)
메시지 배치 목록 조회 (베타)
x
linkedin

cURL

Python

JavaScript

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

for await (const result of await anthropic.beta.messages.batches.results(
"msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d",
)) {
console.log(result);
}

200

4XX

This response does not have an example.
메시지 배치 결과 검색 (베타) - Anthropic

,
Anthropic home pagedark logo
한국어

Search...
Ctrl K
Research
News
Go to claude.ai

환영합니다
API 참조
사용자 가이드
프롬프트 라이브러리
릴리스 노트
개발자 뉴스레터
개발자 콘솔
개발자 Discord
지원
API 사용하기
시작하기
IP 주소
버전
오류
요율 제한
클라이언트 SDK
지원되는 지역
도움 받기
Amazon Bedrock API
Amazon Bedrock API
Vertex AI
Vertex AI API
Anthropic API
메시지
POST
Create a Message
POST
메시지 토큰 수 계산 (베타)
메시지 스트리밍
텍스트 완성에서 마이그레이션하기
메시지 예시
메시지 배치 (베타)
POST
메시지 배치 생성하기 (베타)
GET
메시지 배치 검색 (베타)
GET
메시지 배치 결과 검색 (베타)
GET
메시지 배치 목록 조회 (베타)
POST
메시지 배치 취소하기 (베타)
메시지 배치 예제
텍스트 완성 (레거시)
메시지 배치 (베타)
메시지 배치 목록 조회 (베타)
List all Message Batches within a Workspace. Most recently created batches are returned first.

GET
/
v1
/
messages
/
batches
베타 기간 동안 이 엔드포인트를 사용하려면 anthropic-beta 헤더에 message-batches-2024-09-24 값을 전달해야 합니다
Headers
anthropic-beta
string[]
Optional header to specify the beta version(s) you want to use.

To use multiple betas, use a comma separated list like beta1,beta2 or specify the header multiple times for each beta.

anthropic-version
string
required
The version of the Anthropic API you want to use.

Read more about versioning and our version history here.

x-api-key
string
required
Your unique API key for authentication.

This key is required in the header of all API requests, to authenticate your account and access Anthropic's services. Get your API key through the Console. Each key is scoped to a Workspace.

Query Parameters
before_id
string
ID of the object to use as a cursor for pagination. When provided, returns the page of results immediately before this object.

after_id
string
ID of the object to use as a cursor for pagination. When provided, returns the page of results immediately after this object.

limit
integer
default: 20
Number of items to return per page.

Defaults to 20. Ranges from 1 to 100.

Response
200 - application/json
data
object[]
required

Show child attributes

has_more
boolean
required
Indicates if there are more results in the requested page direction.

first_id
string | null
required
First ID in the data list. Can be used as the before_id for the previous page.

last_id
string | null
required
Last ID in the data list. Can be used as the after_id for the next page.

메시지 배치 결과 검색 (베타)
메시지 배치 취소하기 (베타)
x
linkedin

cURL

Python

JavaScript

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

await anthropic.beta.messages.batches.list({
limit: 20,
});

200

4XX

{
"data": [
{
"id": "msgbatch_013Zva2CMHLNnXjNJJKqJ2EF",
"type": "message_batch",
"processing_status": "in_progress",
"request_counts": {
"processing": 100,
"succeeded": 50,
"errored": 30,
"canceled": 10,
"expired": 10
},
"ended_at": "2024-08-20T18:37:24.100435Z",
"created_at": "2024-08-20T18:37:24.100435Z",
"expires_at": "2024-08-20T18:37:24.100435Z",
"archived_at": "2024-08-20T18:37:24.100435Z",
"cancel_initiated_at": "2024-08-20T18:37:24.100435Z",
"results_url": "https://api.anthropic.com/v1/messages/batches/msgbatch_013Zva2CMHLNnXjNJJKqJ2EF/results"
}
],
"has_more": true,
"first_id": "msgbatch_013Zva2CMHLNnXjNJJKqJ2EF",
"last_id": "msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d"
}
메시지 배치 목록 조회 (베타) - Anthropic

,
Anthropic home pagedark logo
한국어

Search...
Ctrl K
Research
News
Go to claude.ai

환영합니다
API 참조
사용자 가이드
프롬프트 라이브러리
릴리스 노트
개발자 뉴스레터
개발자 콘솔
개발자 Discord
지원
API 사용하기
시작하기
IP 주소
버전
오류
요율 제한
클라이언트 SDK
지원되는 지역
도움 받기
Amazon Bedrock API
Amazon Bedrock API
Vertex AI
Vertex AI API
Anthropic API
메시지
POST
Create a Message
POST
메시지 토큰 수 계산 (베타)
메시지 스트리밍
텍스트 완성에서 마이그레이션하기
메시지 예시
메시지 배치 (베타)
POST
메시지 배치 생성하기 (베타)
GET
메시지 배치 검색 (베타)
GET
메시지 배치 결과 검색 (베타)
GET
메시지 배치 목록 조회 (베타)
POST
메시지 배치 취소하기 (베타)
메시지 배치 예제
텍스트 완성 (레거시)
메시지 배치 (베타)
메시지 배치 취소하기 (베타)
Batches may be canceled any time before processing ends. Once cancellation is initiated, the batch enters a canceling state, at which time the system may complete any in-progress, non-interruptible requests before finalizing cancellation.

The number of canceled requests is specified in request_counts. To determine which requests were canceled, check the individual results within the batch. Note that cancellation may not result in any canceled requests if they were non-interruptible.

POST
/
v1
/
messages
/
batches
/
{message_batch_id}
/
cancel
베타 기간 동안 이 엔드포인트를 사용하려면 anthropic-beta 헤더에 message-batches-2024-09-24 값을 전달해야 합니다
Headers
anthropic-beta
string[]
Optional header to specify the beta version(s) you want to use.

To use multiple betas, use a comma separated list like beta1,beta2 or specify the header multiple times for each beta.

anthropic-version
string
required
The version of the Anthropic API you want to use.

Read more about versioning and our version history here.

x-api-key
string
required
Your unique API key for authentication.

This key is required in the header of all API requests, to authenticate your account and access Anthropic's services. Get your API key through the Console. Each key is scoped to a Workspace.

Path Parameters
message_batch_id
string
required
ID of the Message Batch.

Response
200 - application/json
id
string
required
Unique object identifier.

The format and length of IDs may change over time.

type
enum<string>
default: message_batch
required
Object type.

For Message Batches, this is always "message_batch".

Available options: message_batch
processing_status
enum<string>
required
Processing status of the Message Batch.

Available options: in_progress, canceling, ended
request_counts
object
required
Tallies requests within the Message Batch, categorized by their status.

Requests start as processing and move to one of the other statuses only once processing of the entire batch ends. The sum of all values always matches the total number of requests in the batch.

Show child attributes

ended_at
string | null
required
RFC 3339 datetime string representing the time at which processing for the Message Batch ended. Specified only once processing ends.

Processing ends when every request in a Message Batch has either succeeded, errored, canceled, or expired.

created_at
string
required
RFC 3339 datetime string representing the time at which the Message Batch was created.

expires_at
string
required
RFC 3339 datetime string representing the time at which the Message Batch will expire and end processing, which is 24 hours after creation.

archived_at
string | null
required
RFC 3339 datetime string representing the time at which the Message Batch was archived and its results became unavailable.

cancel_initiated_at
string | null
required
RFC 3339 datetime string representing the time at which cancellation was initiated for the Message Batch. Specified only if cancellation was initiated.

results_url
string | null
required
URL to a .jsonl file containing the results of the Message Batch requests. Specified only once processing ends.

Results in the file are not guaranteed to be in the same order as requests. Use the custom_id field to match results to requests.

메시지 배치 목록 조회 (베타)
메시지 배치 예제
x
linkedin

cURL

Python

JavaScript

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

await anthropic.beta.messages.batches.cancel(
"msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d",
);

200

4XX

{
"id": "msgbatch_013Zva2CMHLNnXjNJJKqJ2EF",
"type": "message_batch",
"processing_status": "in_progress",
"request_counts": {
"processing": 100,
"succeeded": 50,
"errored": 30,
"canceled": 10,
"expired": 10
},
"ended_at": "2024-08-20T18:37:24.100435Z",
"created_at": "2024-08-20T18:37:24.100435Z",
"expires_at": "2024-08-20T18:37:24.100435Z",
"archived_at": "2024-08-20T18:37:24.100435Z",
"cancel_initiated_at": "2024-08-20T18:37:24.100435Z",
"results_url": "https://api.anthropic.com/v1/messages/batches/msgbatch_013Zva2CMHLNnXjNJJKqJ2EF/results"
}
메시지 배치 취소하기 (베타) - Anthropic

,
Anthropic home pagedark logo
한국어

Search...
Ctrl K
Research
News
Go to claude.ai

환영합니다
API 참조
사용자 가이드
프롬프트 라이브러리
릴리스 노트
개발자 뉴스레터
개발자 콘솔
개발자 Discord
지원
API 사용하기
시작하기
IP 주소
버전
오류
요율 제한
클라이언트 SDK
지원되는 지역
도움 받기
Amazon Bedrock API
Amazon Bedrock API
Vertex AI
Vertex AI API
Anthropic API
메시지
POST
Create a Message
POST
메시지 토큰 수 계산 (베타)
메시지 스트리밍
텍스트 완성에서 마이그레이션하기
메시지 예시
메시지 배치 (베타)
POST
메시지 배치 생성하기 (베타)
GET
메시지 배치 검색 (베타)
GET
메시지 배치 결과 검색 (베타)
GET
메시지 배치 목록 조회 (베타)
POST
메시지 배치 취소하기 (베타)
메시지 배치 예제
텍스트 완성 (레거시)
메시지 배치 (베타)
메시지 배치 예제
메시지 배치 API 사용 예제

메시지 배치 API는 메시지 API와 동일한 기능 세트를 지원합니다. 이 페이지는 메시지 배치 API 사용 방법에 중점을 두고 있으며, 메시지 API 기능 세트의 예제는 메시지 API 예제를 참조하세요.

​
메시지 배치 생성하기

Python

TypeScript

Shell

import anthropic
from anthropic.types.beta.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.beta.messages.batch_create_params import Request

client = anthropic.Anthropic()

message_batch = client.beta.messages.batches.create(
requests=[
Request(
custom_id="my-first-request",
params=MessageCreateParamsNonStreaming(
model="claude-3-5-sonnet-20241022",
max_tokens=1024,
messages=[{
"role": "user",
"content": "Hello, world",
}]
)
),
Request(
custom_id="my-second-request",
params=MessageCreateParamsNonStreaming(
model="claude-3-5-sonnet-20241022",
max_tokens=1024,
messages=[{
"role": "user",
"content": "Hi again, friend",
}]
)
)
]
)
print(message_batch)
JSON

{
"id": "msgbatch_013Zva2CMHLNnXjNJJKqJ2EF",
"type": "message_batch",
"processing_status": "in_progress",
"request_counts": {
"processing": 2,
"succeeded": 0,
"errored": 0,
"canceled": 0,
"expired": 0
},
"ended_at": null,
"created_at": "2024-09-24T18:37:24.100435Z",
"expires_at": "2024-09-25T18:37:24.100435Z",
"cancel_initiated_at": null,
"results_url": null
}
​
메시지 배치 완료 폴링하기
메시지 배치를 폴링하려면 생성 요청이나 배치 목록에서 제공되는 id가 필요합니다. 예시 id: msgbatch_013Zva2CMHLNnXjNJJKqJ2EF.

Python

TypeScript

Shell

import anthropic

client = anthropic.Anthropic()

message_batch = None
while True:
message_batch = client.beta.messages.batches.retrieve(
MESSAGE_BATCH_ID
)
if message_batch.processing_status == "ended":
break

    print(f"Batch {MESSAGE_BATCH_ID} is still processing...")
    time.sleep(60)

print(message_batch)
​
워크스페이스의 모든 메시지 배치 나열하기

Python

TypeScript

Shell

import anthropic

client = anthropic.Anthropic()

# 필요에 따라 자동으로 더 많은 페이지를 가져옵니다.

for message_batch in client.beta.messages.batches.list(
limit=20
):
print(message_batch)
Output

{
"id": "msgbatch_013Zva2CMHLNnXjNJJKqJ2EF",
"type": "message_batch",
...
}
{
"id": "msgbatch_01HkcTjaV5uDC8jWR4ZsDV8d",
"type": "message_batch",
...
}
​
메시지 배치 결과 검색하기
메시지 배치 상태가 ended가 되면 배치의 results_url을 확인하고 .jsonl 파일 형식으로 결과를 검색할 수 있습니다.

Python

TypeScript

Shell

import anthropic

client = anthropic.Anthropic()

# 메모리 효율적인 청크로 결과 파일을 스트리밍하여 한 번에 하나씩 처리

for result in client.beta.messages.batches.results(
MESSAGE_BATCH_ID,
):
print(result)
Output

{
"id": "my-second-request",
"result": {
"type": "succeeded",
"message": {
"id": "msg_018gCsTGsXkYJVqYPxTgDHBU",
"type": "message",
...
}
}
}
{
"custom_id": "my-first-request",
"result": {
"type": "succeeded",
"message": {
"id": "msg_01XFDUDYJgAACzvnptvVoYEL",
"type": "message",
...
}
}
}
​
메시지 배치 취소하기
취소 직후에는 배치의 processing_status가 canceling이 됩니다. 취소된 배치도 결국 ended 상태가 되고 결과를 포함할 수 있으므로, 동일한 배치 완료 폴링 기술을 사용하여 취소가 완료되었는지 폴링할 수 있습니다.

Python

TypeScript

Shell

import anthropic

client = anthropic.Anthropic()

message_batch = client.beta.messages.batches.cancel(
MESSAGE_BATCH_ID,
)
print(message_batch)
JSON

{
"id": "msgbatch_013Zva2CMHLNnXjNJJKqJ2EF",
"type": "message_batch",
"processing_status": "canceling",
"request_counts": {
"processing": 2,
"succeeded": 0,
"errored": 0,
"canceled": 0,
"expired": 0
},
"ended_at": null,
"created_at": "2024-09-24T18:37:24.100435Z",
"expires_at": "2024-09-25T18:37:24.100435Z",
"cancel_initiated_at": "2024-09-24T18:39:03.114875Z",
"results_url": null
}
메시지 배치 취소하기 (베타)
Create a Text Completion
x
linkedin
On this page
메시지 배치 생성하기
메시지 배치 완료 폴링하기
워크스페이스의 모든 메시지 배치 나열하기
메시지 배치 결과 검색하기
메시지 배치 취소하기
메시지 배치 예제 - Anthropic

,
