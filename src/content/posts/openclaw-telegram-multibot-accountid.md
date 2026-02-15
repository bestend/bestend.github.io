---
title: "OpenClaw Telegram 멀티봇 + accountId 라우팅 삽질기 (세션 꼬임/인바운드 드랍/패치 검증 루틴)"
description: "Telegram 멀티봇을 accountId로 라우팅하면서 DM 세션이 섞이거나 인바운드가 드랍되던 문제를 어떻게 재현/진단/패치 검증으로 해결했는지 정리."
date: 2026-02-15
---

Telegram 봇을 역할별로 쪼개면(OpenClaw 기준 multi-account), 운영이 진짜 편해진다.

- control: 대화/설정/짧은 요청
- code: 긴 작업/툴 실행(승인 포함)
- alerts: cron 결과/시스템 알림(읽기 전용)

근데 봇을 2~3개로 늘리는 순간부터는 단순 설정이 아니라 **라우팅(accountId) + 세션 스코프** 설계 문제가 된다.

이 글은 내가 실제로 겪은 삽질 포인트(세션 꼬임, 인바운드 드랍처럼 보임, 커맨드 메뉴 폭발)와 최종적으로 안정화한 루틴을 정리한 기록이다.

## TL;DR

- 멀티봇은 `accountId`로 agent 라우팅을 분리해야 한다.
- DM은 반드시 **per-account**로 세션을 분리해야 한다(안 그러면 컨텍스트가 섞임).
- `Session file path must be within sessions directory`가 보이면, 단순 로그 에러가 아니라 **핸들러 실패 → 인바운드 드랍**로 이어질 수 있다.
- 재현이 되면 "설정 삽질"만 하지 말고, 업스트림 PR 패치를 받아 **패치 버전으로 먼저 검증**하고 릴리즈로 따라가는 게 가장 빠르다.

---

## 1) 목표: 봇 3개를 역할로 분리하고, 세션까지 완전 분리

내가 원했던 목표는 이거였다.

- Telegram bot `control` → agent `main`
- Telegram bot `code` → agent `code`
- Telegram bot `alerts` → agent `alerts`

그리고 제일 중요한 운영 원칙:

- control/code/alerts는 **절대 같은 DM 세션을 공유하면 안 됨**

## 2) accountId 기반 라우팅 (기본 뼈대)

OpenClaw Telegram은 multi-account 구성이 가능하고, 계정은 `accountId`로 구분된다.

토큰 같은 민감값은 생략하고, 형태만 보면 아래처럼 간다.

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

여기까지만 하면 “대부분은” 되는 것처럼 보인다.

하지만 DM에서 바로 문제가 터진다.

## 3) 삽질 A: DM 세션이 봇끼리 섞임 (컨텍스트 유출)

증상:

- control 봇에서 하던 대화가 code 봇에도 이어진다
- code 봇 컨텍스트가 alerts 봇으로 새어 들어간다

원인:

- Telegram에서 같은 사용자와의 DM은 peer(상대)가 동일하게 보인다
- 세션 키가 `channel + peer` 수준이면, 봇 계정이 달라도 세션이 겹친다

해결:

- DM 세션 키에 봇 account를 포함시키는 설정이 필요하다
- 개념적으로는 이렇게:

```
DM session key = (channel + peer)
X
DM session key = (channel + accountId + peer)
O
```

내 환경에서는 `session.dmScope = per-account-channel-peer` 쪽으로 정리해서 해결했다.

## 4) 삽질 B: 인바운드가 드랍되는 것처럼 보임

이건 진짜 헷갈린다.

증상:

- 어떤 봇은 메시지가 잘 들어오는데,
- 어떤 봇은 “인바운드가 안 들어오는 것처럼” 보인다.

이럴 때 로그에서 자주 보이던 게 이거:

- `Session file path must be within sessions directory`

이게 중요한 이유:

- 단순 경고가 아니라, 핸들러가 실패하면서 해당 인바운드가 실제로 처리되지 않을 수 있다.

내가 했던 진단 루틴:

1) 채널 상태로 lastInboundAt을 먼저 본다(감으로 판단 금지)

```bash
openclaw status
openclaw channels status --json
```

2) 실패가 찍히는 순간의 에러를 로그로 잡는다

```bash
openclaw logs --follow
```

3) 의심 포인트는 “세션/라우팅/agentId”다

- dmScope가 per-account로 분리되어 있는지
- bindings가 accountId별로 분리되어 있는지
- 해당 accountId가 기대하는 agent로 라우팅되는지

## 5) 삽질 C: Telegram 커맨드 메뉴(setMyCommands) 폭발

Telegram은 봇 메뉴에 등록 가능한 커맨드 수가 제한되어 있고,
멀티봇 + 멀티에이전트 + 스킬 커맨드까지 섞이면 쉽게 한도를 밟는다.

운영 팁:

- 메뉴에 "자주 쓰는 것"만 최소 등록
- 나머지는 typed command(직접 입력)로 쓰는 전략이 현실적
- agent 스코프/계정 스코프를 분리해서 커맨드가 한 봇에 몰리지 않게 한다

## 6) 왜 “PR 패치 검증” 이야기를 꼭 해야 하나

이런 문제는 운영자가 보기엔 설정 삽질처럼 보이는데,
실제로는 **업스트림 버그 + 특정 구성 조합**일 때가 많다.

나도 실제로:

- 재현 가능한 증상 정리
- 패치 PR 적용 버전(또는 테스트 빌드)로 먼저 확인
- 해결 확인 후 릴리즈 버전으로 따라가기

이 루트가 제일 빨랐다.

실무적으로는 이게 제일 중요했다:

- “내가 뭘 잘못했나”에만 매몰되면 며칠을 날린다.
- 재현이 되면 패치로 검증해서 **원인이 내 설정인지, 업스트림인지 분리**하는 게 먼저다.

## 7) 최종 체크리스트

- [ ] Telegram accounts를 명확한 `accountId`로 분리
- [ ] bindings.match.accountId로 agent 라우팅 분리
- [ ] DM 세션을 per-account로 분리(컨텍스트 섞임 방지)
- [ ] `openclaw channels status --json`로 account별 lastInboundAt 확인
- [ ] 문제 재현 시 로그에서 `Session file path must be within sessions directory` 같은 핸들러 실패 신호 확인
- [ ] 업스트림 패치로 재현/해결 여부를 먼저 분리 검증

## 마무리

멀티봇 구성은 “봇을 하나 더 만드는 작업”이 아니라,

- 라우팅(accountId)
- 세션 스코프(dmScope)
- 검증 루틴(상태/로그)

까지 포함한 운영 설계다.

한 번 안정화해두면, 이후부터는 control/code/alerts가 서로 간섭하지 않고,
운영 체감이 확 좋아진다.
