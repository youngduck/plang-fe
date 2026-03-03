# plang-fe


## 사전과제 : 알고리즘

### algorithms 결과 테스트케이스를 테스트 해볼 수 있도록 구축 해 두었습니다.

- **1 폴더 이동**
  - `cd ./plang/algorithms`

- **2 의존성 설치**
  - `pnpm install`

- **3 알고리즘 파일 실행 (번호로 실행)**
  - `pnpm dev -- 1` → `1.js` 실행
  - `pnpm dev -- 2` → `2.js` 실행
  - `pnpm dev -- 3` → `3.js` 실행


## 사전과제 : 타이머 구현

### 타이머 React 초기세팅 및 실행방법 설명

- **사용 스택**
  - React + TypeScript + Vite
  - TailwindCSS (v4) + `@tailwindcss/vite`
  - UI: `@youngduck/yd-ui`
  - 상태관리: `zustand`
  - 품질: ESLint(flat config) + Prettier + Vitest
  - 테스트 코드 : `Vitest`

- **1 폴더 이동**
  - `cd ./plang/react`

- **2 의존성 설치**
  - `pnpm install`

- **3 개발 서버 실행**
  - `pnpm dev`



### 설계 요구사항 답변

#### 1. 상태 모델
- 어떤 상태들이 존재하며 왜 그렇게 나누었나요?

> 제 설계 방식은 요구사항속에 나온 “가능한 상태 조합을 **타입 수준에서 제한**하고, UI는 그 관계만 **선언적으로 사용**하게 만드는 것”이었습니다.

> 왜냐하면 시간 상태들을 파생값으로 만들면서 제어하는것이 아니라 선언적 코드로 작성함으로써 UI가 무엇을 보여줄지만 기술하게 되어 가독성과 테스트 용이성을 높이고자 했습니다. 아래는 참고한 기술블로그 입니다.

[기술블로그](https://evan-moon.github.io/2025/09/07/declarative-programming-misconceptions-and-essence/)


- **액션 기반 전이 (`TimerAction` + `timerReducer`)** – 상태 변화는 모두 액션으로만 일어납니다.
  - `START` : `idle`/`paused` → `running` (처음 시작 또는 정지 후 다시 시작했을때)
  - `PAUSE` : `running` → `paused` (현재 시간을 저장하고 interval 정리)
  - `RESET` : 어떤 상태에서든 → 완전 초기 상태 (`idle`, `00:00`)
  - `SET_TARGET` / `CLEAR_TARGET` : 목표 시간 설정 / 해제
  - `UPDATE_ELAPSED` : `running`일 때만 `Date.now() - startTime`으로 경과 시간 재계산

- **파생 UI 상태 (selector)** – UI는 “관계”만 사용합니다.
  - 예: `selectCanStart`, `selectCanPause`, `selectCanReset`, `selectFormattedTime`, `selectIsTargetSet` ...
  - 버튼은 `canStart / canPause / canReset` 같은 파생값만 보고 **활성/비활성**을 결정하고,
  - 컴포넌트 안에서는 `status === 'running'` 같은 조건식을 직접 쓰지 않도록 해서,
    - “도메인 상태는 store에서, UI 로직은 selector에서, 화면은 선언적으로” 분리했습니다.


#### 2. 시간 계산 방식
`setInterval`이 정확하게 동작하지 않는 문제가 있다는 것을 하단에 첨부한 블로그글을 통해 확인한 후, **`Date.now()` 차이로 시간을 계산하는 방식**을 선택했습니다.

- **구현 방식**
  - `START` 시
    - `startTime = Date.now()` (또는 `paused`에서 재시작 시 `now - pausedElapsedSeconds * 1000`)
  - `UPDATE_ELAPSED` 액션
    - `elapsedMs = Date.now() - startTime`
    - `elapsedSeconds = Math.floor(elapsedMs / 1000)`
    - 이 값을 상태에 저장하고, UI에서는 `MM:SS` / `HH:MM:SS` 로 포맷해서 표시합니다.
  - `setInterval(…, 100)` 은 단순히 `UPDATE_ELAPSED`를 주기적으로 트리거하는 역할만 하고,
    - “매 tick마다 1초를 더한다”는 식으로 사용하지 않습니다.

- **왜 이 방식을 선택했는가?**
  1. **`setInterval`의 근본적인 오차 문제**
     - JS의 `setInterval`/`setTimeout`은 이벤트 루프 부하, 탭 비활성화, 브라우저/Node 런타임 차이 등으로 인해
       요청한 간격(예: 1000ms)보다 실제 호출 간격이 길어지거나 불규칙해질 수 있습니다.
     - 단순히 카운터를 1씩 증가시키는 방식으로 초를 세면, 이런 지연이 **누적 drift**로 이어진다고 합니다.
     - 실제 서비스 사례(예: Next.js 환경에서의 타이머 구현기)를 참고했을 때도, 런타임에 따라 `setInterval` 오차가 눈에 띄게 발생할 수 있음을 확인했습니다.
       (참고: [런타임을 고려해 타이머 구현하기](https://cksxkr5193.tistory.com/42))
  2. **일시정지/재시작 처리의 자연스러운 동작**
     - `paused` 시점의 `elapsedSeconds`를 `pausedElapsedSeconds`에 저장해 두고,
     - 재시작 시 `startTime = now - pausedElapsedSeconds * 1000` 으로 역산하면,
       - 문제없이 경과 시간을 진행 시킬 수 있습니다.
     - 이 구조는 `idle / running / paused` 상태 간 관계와 시간 계산 방식을 분리해서 동작하기에도 자연스럽습니다.

- **대안(단순 카운터 방식)을 선택하지 않은 이유**
  - 예시 (선택하지 않은 방식)
    ```ts
    let count = 0;
    setInterval(() => {
      count += 1;
      setElapsedSeconds(count);
    }, 1000);
    ```
  - 이 방식은:
    - 탭 비활성화 / CPU 부하 / 백그라운드에서 `setInterval`이 지연되면 tick 수와 실제 경과 시간이 엇갈리고,
    - 1분 이상 실행 시 “눈에 띄는 오차”가 발생할 수 있습니다.
  - 반면 현재 구현은 항상 `Date.now()` 기반으로 **실제 경과 시간**을 재계산하므로,
    - 과제 요구사항인 “1분 이상 실행해도 눈에 띄는 시간 오차가 없어야 함”을 만족할 수 있습니다.
    - 테스트코드와 실제 휴대폰으로 테스트를 해보면서 오차없는 컴포넌트를 만들었음을 확인할 수 있었습니다.