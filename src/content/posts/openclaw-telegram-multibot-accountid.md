---
title: "OpenClaw Telegram 멀티봇 운영 기록: accountId 라우팅, DM 세션 분리, Cron 알림봇 고정"
description: "Telegram 멀티봇을 accountId로 라우팅하고 DM 세션을 계정별로 분리한 뒤, Cron 알림이 alerts 봇으로 고정되도록(미릴리즈 PR #16259 수동 패치 포함) 안정화한 기록."
date: 2026-02-15
---

이 문서는 OpenClaw를 Telegram 멀티봇(멀티 account)으로 운영하면서 했던 변경을 **운영 기록 형태로 정리**한 것이다.

목표는 단순하다.

- 봇을 역할별로 분리(control / code / alerts)
- 메시지 라우팅을 accountId로 고정
- DM 세션이 봇끼리 섞이지 않게 분리
- Cron 알림이 항상 alerts 봇으로 나가게 고정

## 환경

- OpenClaw: 2026.2.13 계열에서 작업
- 채널: Telegram multi-account
- 구성: control / code / alerts 3계정(토큰/핸들 등 민감값은 생략)

## 최종 구조(의도)

역할 분리를 먼저 확정했다.

- `control` account: 대화/설정/짧은 요청
- `code` account: 긴 작업/툴 실행(승인 플로우 포함)
- `alerts` account: cron 결과/시스템 알림(읽기 전용)

핵심 원칙:

- **alerts 봇은 자동 알림 전용**
- 대화 중 결과/파일은 “현재 대화 중인 봇(accountId)”으로 보낸다

## 1) Telegram multi-account 구성에서 헷갈리는 포인트

OpenClaw Telegram 설정은 계층이 2개다.

1) top-level `channels.telegram.botToken`
   - 암묵적 `accountId: "default"` 계정이 생긴다
2) `channels.telegram.accounts.*`
   - 명시적 named accounts (`control`, `code`, `alerts` 등)

### 운영 규칙 A: 토큰 중복 금지

top-level botToken과 named account botToken이 같으면 안 된다.

- Telegram Bot API polling 충돌 → 인바운드 누락/드랍처럼 보이는 현상
- `lastInboundAt: null`이 지속되면 토큰 중복부터 의심

### 운영 규칙 B: 모든 accountId에 binding 필요

named account만 binding 해두면 top-level default 계정이 들어온 메시지가 떠돌 수 있다.

즉, “account가 있으면 binding도 반드시 있어야 한다.”

## 2) accountId 기반 라우팅(에이전트 분리)

accountId로 agent를 고정 라우팅했다.

예시(형태만):

```yaml
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

## 3) DM 세션 분리: per-account-channel-peer

멀티봇을 쓰면 DM에서 세션이 섞이기 쉽다.

원인 요약:

- 같은 사용자와의 DM은 peer가 같게 보일 수 있다
- 세션 키가 (channel + peer)만으로 만들어지면 봇이 달라도 세션이 겹친다

해결:

- DM 세션 스코프를 “봇 계정까지 포함”하도록 강제
- 내 구성에서는 아래 옵션으로 안정화했다

- `session.dmScope = per-account-channel-peer`

효과:

- control/code/alerts 간 컨텍스트가 서로 섞이지 않음

## 4) 인바운드가 드랍되는 것처럼 보일 때 확인 루틴

증상이 애매할 때는 감으로 판단하지 말고 아래 순서로 확인했다.

1) 채널별 수신 갱신 확인

```bash
openclaw status
openclaw channels status --json
```

2) 실패 시점 로그 확인

```bash
openclaw logs --follow
```

특히 아래 에러가 보이면 “그냥 경고”가 아니라 해당 턴이 실패했을 수 있다.

- `Session file path must be within sessions directory`

이 경우 우선순위는:

- dmScope / accountId bindings / agentId 경로 해석이 꼬였는지부터 확인

## 5) Cron 알림이 alerts 봇으로 안 가는 문제(핵심)

### 현상

Cron 알림이 `alerts` 봇이 아니라,
마지막으로 사용했던 봇 또는 default 봇으로 가는 케이스가 있었다.

### 원인

OpenClaw v2026.2.13 시점에서 cron delivery가 `delivery.accountId`를 무시하고,
main session의 `lastAccountId`를 따라가는 문제가 있었다.

### 해결: PR #16259가 릴리즈에 반영되기 전, 로컬 수동 패치

중요 포인트:

- 이건 “공식 릴리즈로 해결된 것”이 아니라
- **PR #16259(미머지)를 로컬에 수동 패치**해서 해결한 기록이다

로컬 패치 개요:

- `resolveCronDeliveryPlan()`에서 delivery config의 `accountId`를 추출
- `resolveDeliveryTarget()`에 explicit override로 전달

패치 적용 방식(2026-02-15):

- PR #16259의 변경사항을 로컬 설치본의 dist 산출물에 **수동 반영**
- 각 파일은 `.bak.20260215`로 백업

패치된 파일(기록):

- `dist/gateway-cli-BJOtKnN4.js` (런타임에서 실제로 쓰던 파일)
- `dist/gateway-cli-BcCUuVIr.js` (CLI용 복사본)
- `dist/pi-embedded-CmuLZYU2.js`
- `dist/pi-embedded-KOoEAxbq.js`
- `dist/client-DV6vI7ic.js`
- `dist/client-CEto0Pf6.js`
- `dist/plugin-sdk/index.js`

주의:

- `openclaw update`를 실행하면 패치가 덮어써진다
- PR #16259가 공식 릴리즈에 들어오면 로컬 패치를 제거하는 게 맞다
- 런타임 파일은 `gateway-cli-BJOtKnN4.js`였고, 다른 파일만 패치하면 효과가 없었다

### Cron job 설정 예시

```json
{
  "delivery": {
    "mode": "announce",
    "channel": "telegram",
    "to": "<my-telegram-id>",
    "accountId": "alerts"
  }
}
```

## 6) 검증(내가 쓴 체크리스트)

- [ ] 각 봇에 DM을 보내서 accountId별 세션이 분리되는지 확인
- [ ] `channels status --json`에서 계정별 lastInboundAt이 갱신되는지 확인
- [ ] cron job을 1회 실행해서 alerts 봇으로 고정 전달되는지 확인
- [ ] `openclaw update` 이후에도 동작하는지(=수동 패치가 덮일 수 있음을 고려)

## 현재 상태

- 멀티봇/라우팅/세션 분리: 안정화
- cron 알림봇 고정: PR #16259 수동 패치로 동작 확인
- 다음 할 일: PR #16259가 공식 릴리즈로 들어오면 로컬 패치 제거
