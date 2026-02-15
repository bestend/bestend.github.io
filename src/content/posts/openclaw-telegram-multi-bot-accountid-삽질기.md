---
title: "OpenClaw Telegram 멀티봇 + accountId 라우팅 삽질기 (세션 꼬임/인바운드 드랍 해결)"
date: 2026-02-15
---

OpenClaw를 좀 제대로 운영해보려면 결국 **봇을 역할별로 쪼개는 순간**이 온다.

- 컨트롤용 봇(대화/설정/명령)
- 코드/작업용 봇(긴 실행/툴 사용)
- 알림 전용 봇(cron 결과, 시스템 알림)

나도 똑같은 이유로 Telegram 봇을 여러 개로 분리했고, 결론적으로는 운영이 훨씬 편해졌다.

근데… 분리하는 과정에서 **accountId 라우팅 + 세션 스코프**를 제대로 잡지 않으면, 진짜 이상한 문제가 나온다.

- 어떤 봇은 인바운드가 안 들어오는 것처럼 보이고
- 어떤 봇은 세션이 섞여서 엉뚱한 컨텍스트로 답하고
- 심지어는 에러로 메시지가 드랍된다

이 글은 그 삽질기와 해결 기록이다.

## 목표: 봇 3개를 역할로 분리해서 안전하게 운영

내가 원했던 구조는 이거였다.

1) Telegram bot A: 컨트롤(기본)
2) Telegram bot B: 코드/작업
3) Telegram bot C: 알림

그리고 가장 중요한 건:

- **각 봇이 들어오는 메시지를 서로 다른 agent / session으로 확실히 분리**

즉, “봇만 여러 개”가 아니라 **라우팅/세션까지 분리**가 핵심이다.

## 접근: accountId 기반 라우팅

OpenClaw의 Telegram은 multi-account 구성이 가능하고, 각 계정을 `accountId`로 식별한다.

대략 이런 식의 형태로 라우팅을 잡을 수 있다(토큰 등 민감값은 생략).

```yaml
channels:
  telegram:
    accounts:
      - accountId: control
        # token: ...
      - accountId: code
      - accountId: alerts

agents:
  list:
    - id: main
    - id: code
    - id: alerts

bindings:
  - match:
      channel: telegram
      accountId: control
    route:
      agentId: main
  - match:
      channel: telegram
      accountId: code
    route:
      agentId: code
  - match:
      channel: telegram
      accountId: alerts
    route:
      agentId: alerts
```

여기까지는 “그럴싸”하다.

문제는 여기서 끝이 아니었다.

## 삽질 1: DM 세션이 봇끼리 섞이면서 지옥문 열림

처음에는 봇을 분리했는데도, 이상한 현상이 나왔다.

- control 봇에서 하던 대화가 code 봇에도 이어진다
- 반대로 code 봇에서 하던 컨텍스트가 alerts 봇으로 새어 들어간다

이때 깨달은 포인트:

- Telegram에서 **같은 사용자(나)와의 DM**은 “peer(상대)”가 동일하다
- 세션 키를 `channel + peer`만으로 만들면, 봇을 여러 개 써도 세션이 겹칠 수 있다

### 해결: DM 스코프를 per-account로 고정

OpenClaw에는 DM 세션 스코프를 더 세밀하게 자를 수 있는 옵션이 있고,
나는 **봇 계정(account)까지 포함해서 세션 키를 분리**하도록 설정을 바꿨다.

핵심 아이디어는 이거:

- DM 세션 키 = (채널 + 상대) 가 아니라
- DM 세션 키 = (채널 + 봇 account + 상대)

이걸 적용하고 나서야 “봇이 역할대로 분리되는 느낌”이 났다.

## 삽질 2: 인바운드가 드랍되는 것처럼 보임

이상 현상 중 제일 골치 아팠던 건 이거였다.

- alerts 봇은 lastInboundAt이 갱신되는데
- default/control/code 봇은 lastInboundAt이 null로 남아있거나,
- 특정 구간에서 인바운드가 처리되지 않는 느낌

로그를 까보면 이런 계열의 에러가 찍히는 케이스가 있었다.

- `Session file path must be within sessions directory`

이게 뜨면, 말 그대로 “세션 파일 경로가 안전한 범위 안에 없다”는 이유로 핸들러가 실패하고 메시지가 드랍될 수 있다.

### 해결: 세션 분리 재적용 + (버전업으로) 경로 해석 안정화

내가 했던 조치는 두 가지였다.

1) 위에서 말한 DM 스코프(per-account) 분리를 다시 강제 적용
2) 게이트웨이 리로드 후 실제 인바운드가 들어오는지 채널별로 테스트

그리고 OpenClaw 쪽에서도 이후 버전에서 **agentId를 포함한 transcript path resolve** 경로가 안정화되면서,
이런 종류의 세션 경로 문제는 재발 가능성이 줄었다.

## 삽질 3: setMyCommands / 커맨드 등록 폭발

Telegram은 봇 메뉴에 등록할 수 있는 커맨드가 제한이 있는데,
멀티봇 + 멀티에이전트를 섞으면 커맨드가 예상보다 많이 등록돼서 경고/에러가 나기도 한다.

실제 운영 팁:

- “보여줄 커맨드”와 “그냥 타이핑하면 되는 커맨드”를 분리하는 게 좋다
- 커맨드 수가 많으면, 메뉴 등록은 제한하고(또는 agent 스코프를 좁히고) 필요하면 직접 입력한다

## 운영 팁: 역할 분리하면 UX도 분리해라

봇을 여러 개로 나누면 사용자 입장(=나)에서도 습관이 정리된다.

- control: 설정/대화/짧은 질의
- code: 길게 돌리는 작업
- alerts: 알림만 받기 (대화하지 않기)

여기서 특히 alerts 봇은 “읽기 전용”으로 취급하는 게 정신 건강에 좋다.

## 체크리스트 (다시 한다면)

- [ ] Telegram accounts는 명확한 `accountId`로 분리
- [ ] bindings.match.accountId로 agent 라우팅 분리
- [ ] DM 세션 스코프를 per-account로 분리(세션 섞임 방지)
- [ ] 인바운드 테스트는 계정별로 실제 전송해서 lastInboundAt 갱신 확인
- [ ] Telegram 커맨드 메뉴는 과하게 욕심내지 말기

## 마무리

멀티봇 구성은 “그냥 봇을 하나 더 만들면 끝”이 아니다.

**라우팅(accountId) + 세션 스코프**까지 같이 설계해야 진짜로 안정적으로 분리된다.

그리고 한 번 제대로 분리해놓으면,

- 실수로 알림봇에 대화하는 일도 줄고
- 작업봇이 무거운 컨텍스트 먹고 있는 것도 덜 불안하고
- 운영이 훨씬 단단해진다.
