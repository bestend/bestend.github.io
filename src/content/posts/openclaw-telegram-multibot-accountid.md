---
title: "OpenClaw Telegram 멀티봇 + accountId 라우팅 삽질기 (세션 꼬임/인바운드 드랍/PR 패치 테스트까지)"
date: 2026-02-15
---

OpenClaw를 조금만 진지하게 운영하면 결국 Telegram 봇을 역할별로 분리하고 싶어진다.

- 컨트롤 봇: 설정/대화/짧은 요청
- 코드 봇: 긴 작업/툴 실행(승인 플로우 포함)
- 알림 봇: cron 결과/시스템 알림(읽기 전용)

문제는 **봇만 여러 개** 만들면 끝이 아니라는 거다.

- accountId 라우팅이 애매하면 메시지가 엉뚱한 agent로 간다.
- DM 세션 스코프가 겹치면 컨텍스트가 섞인다.
- 경로 검증 에러가 터지면 인바운드가 “드랍된 것처럼” 보인다.

이 글은 내가 실제로 겪었던 삽질과, 최종적으로 안정화한 설정/검증 루틴을 정리한 기록이다.

## TL;DR

1) Telegram multi-bot은 `accountId`로 라우팅해야 한다.
2) DM 세션은 **per-account**로 분리해야 한다(세션 섞임 방지).
3) `Session file path must be within sessions directory` 류 에러가 보이면, 대부분 “세션 키/agentId/경로 해석”이 꼬인 거라 **세션 스코프/라우팅을 먼저 의심**해야 한다.
4) 이 계열의 이슈는 업스트림에서도 패치가 계속 들어오니, 재현이 되면 PR 패치 빌드로 먼저 검증하고 릴리즈로 따라가는 게 제일 빠르다.

---

## 목표: 봇 3개를 역할로 분리하고, 세션까지 완전 분리

내가 원했던 구조는 이거였다.

- Telegram bot A (control) → agent `main`
- Telegram bot B (code) → agent `code`
- Telegram bot C (alerts) → agent `alerts`

핵심은 “봇 3개”가 아니라,

- **봇 계정(accountId)별로 routing**
- **봇 계정(accountId)별로 DM 세션 분리**

이 2개를 동시에 만족하는 것이다.

## 1) accountId 기반 라우팅 (기본 뼈대)

OpenClaw Telegram은 multi-account 구성이 가능하고, 각 계정은 `accountId`로 식별된다.

토큰/민감값은 생략하고 형태만 적으면:

```yaml
channels:
  telegram:
    accounts:
      - accountId: control
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

여기까지만 하면 “대부분은” 동작한다.

근데 DM에서는 여기서부터 지옥이 열린다.

## 2) 삽질: DM 세션이 봇끼리 섞임

처음 증상은 단순했다.

- control 봇에서 하던 대화가 code 봇에 이어진다
- code 봇에서 하던 컨텍스트가 alerts 봇으로 새어 들어간다

원인은 세션 키 설계였다.

- Telegram에서 **같은 사용자(나)와의 DM peer**는 봇이 달라도 동일해 보일 수 있다
- 세션 키가 `channel + peer` 정도로만 구성되면, 봇을 늘려도 세션이 겹친다

### 해결: DM 세션 스코프를 per-account로 분리

나는 DM 세션 스코프를 “봇 account 포함”으로 강제했다.

개념적으로는 이렇게:

- DM 세션 키 = (채널 + 상대) 가 아니라
- DM 세션 키 = (채널 + 봇 accountId + 상대)

이렇게 해야 멀티봇이 진짜로 분리된다.

(내 운영에서는 `session.dmScope = per-account-channel-peer` 형태로 적용해서 해결했다.)

## 3) 삽질: 인바운드가 드랍되는 것처럼 보임

가장 골치 아팠던 건 이거였다.

- alerts 봇은 잘 들어오는데
- control/code 봇은 lastInboundAt이 null이거나 갱신이 안 되는 것처럼 보인다

이때 로그에서 종종 보이던 에러가:

- `Session file path must be within sessions directory`

이 에러는 “세션 파일 경로가 안전한 sessions 디렉토리 밖”으로 해석되었다는 뜻이라,
해당 턴 처리가 실패하고 메시지가 드랍된 것처럼 보일 수 있다.

### 내가 했던 조치 (재현 → 분리 → 검증)

1) DM 스코프(per-account) 설정을 다시 강제 적용
2) 게이트웨이 hot reload / 재시작 후, 각 봇에 실제로 메시지 보내서 라우팅 확인
3) 상태 확인은 감으로 하지 말고 명령으로 했다

```bash
openclaw status
openclaw channels status --json
openclaw logs --follow
```

(여기서 “어느 accountId의 lastInboundAt이 움직이는지”를 보고 실제로 드랍인지/라우팅 문제인지 구분했다.)

## 4) 왜 PR 패치 이야기를 꼭 넣어야 하냐

이런 류 문제는 운영자 입장에선 설정 삽질처럼 보이지만,
실제로는 **업스트림 버그 + 설정 조합**인 경우가 많다.

내 케이스도 그랬다.

- 멀티 account / 멀티 agent 구성에서
- transcript path resolve 과정에 agentId가 누락되거나,
- 세션 키가 기대와 다르게 만들어지면,
- 결국 “sessions directory 밖 경로”로 판정되는 순간이 생긴다.

그래서 나는:

1) 이슈를 재현 가능한 형태로 정리
2) 업스트림 PR 패치 빌드(v3 같은 형태)를 받아서 먼저 테스트
3) 해결 확인 후 릴리즈 버전으로 따라가기

이 루트가 제일 빨랐다.

(참고로 OpenClaw changelog에도 멀티 에이전트에서 transcript path resolve를 안정화하는 수정들이 들어온다. 이런 걸 보면 “내가 삽질한 게 100% 내 탓은 아니구나”가 보인다.)

## 5) 운영 팁: 알림 봇은 읽기 전용으로 취급

멀티봇을 진짜로 잘 쓰려면 UX도 분리해야 한다.

- control: 설정/짧은 대화
- code: 길게 돌리는 작업(툴 실행)
- alerts: 알림만

특히 alerts 봇은 “대화 안 하는 봇”으로 취급하는 게 운영 난이도를 확 낮춘다.

## 체크리스트 (다시 한다면)

- [ ] Telegram accounts를 명확한 `accountId`로 분리
- [ ] bindings.match.accountId로 agent 라우팅 분리
- [ ] DM 세션 스코프를 per-account로 분리(세션 섞임 방지)
- [ ] 각 봇에 실제 DM을 보내서 lastInboundAt 갱신/세션 분리 확인
- [ ] `Session file path must be within sessions directory`가 보이면 “설정만”이 아니라 업스트림 패치도 같이 확인

## 마무리

멀티봇 구성은 “봇을 하나 더 만드는 작업”이 아니라,

- 라우팅(accountId)
- 세션 스코프
- 검증 루틴

까지 포함한 운영 설계다.

한 번 안정화해두면, 그 다음부터는 진짜 편해진다.
