import { create } from 'zustand';

// 핵심 상태 타입
type TimerStatus = 'idle' | 'running' | 'paused';

// 기본 Timer 상태: 도메인에서 필요한 최소 필드만 정의
interface TimerState {
  status: TimerStatus;
  elapsedSeconds: number;
  targetSeconds: number | null;
  startTime: number | null;
  pausedElapsedSeconds: number;
  intervalId: NodeJS.Timeout | null;
}

// 액션 타입 정의 (관계 중심)
type TimerAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'SET_TARGET'; seconds: number | null }
  | { type: 'UPDATE_ELAPSED' }
  | { type: 'CLEAR_TARGET' };

// Reducer 함수 (순서 대신 관계를 드러냄)
const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
  switch (action.type) {
    case 'START': {
      if (state.status === 'running') return state;

      const now = Date.now();
      const startTime =
        state.status === 'paused'
          ? now - state.pausedElapsedSeconds * 1000
          : now;

      // intervalId는 reducer에서 null로 설정하고,
      // 실제 interval 설정은 store 레벨에서 처리
      return {
        ...state,
        status: 'running',
        startTime,
        intervalId: null, // store에서 실제 interval 설정
      };
    }

    case 'PAUSE': {
      if (state.status !== 'running') return state;

      if (state.intervalId) {
        clearInterval(state.intervalId);
      }

      return {
        ...state,
        status: 'paused',
        pausedElapsedSeconds: state.elapsedSeconds,
        intervalId: null,
      };
    }

    case 'RESET': {
      if (state.intervalId) {
        clearInterval(state.intervalId);
      }

      return {
        status: 'idle',
        elapsedSeconds: 0,
        targetSeconds: null,
        startTime: null,
        pausedElapsedSeconds: 0,
        intervalId: null,
      };
    }

    case 'SET_TARGET': {
      return { ...state, targetSeconds: action.seconds };
    }

    case 'UPDATE_ELAPSED': {
      if (state.status !== 'running' || !state.startTime) return state;

      const now = Date.now();
      const elapsedMs = now - state.startTime;
      const elapsedSeconds = Math.floor(elapsedMs / 1000);

      return { ...state, elapsedSeconds };
    }

    case 'CLEAR_TARGET': {
      return { ...state, targetSeconds: null };
    }

    default:
      return state;
  }
};

// Store 타입 정의
type TimerStore = TimerState & {
  dispatch: (action: TimerAction) => void;
};

export const useTimerStore = create<TimerStore>((set) => ({
  // 초기 상태
  status: 'idle',
  elapsedSeconds: 0,
  targetSeconds: null,
  startTime: null,
  pausedElapsedSeconds: 0,
  intervalId: null,

  // 액션 디스패처 (선언적)
  dispatch: (action) => {
    set((state) => {
      const newState = timerReducer(state, action);

      // START 액션 처리 시 interval 설정 (side effect)
      if (action.type === 'START' && newState.status === 'running' && !newState.intervalId) {
        const intervalId = setInterval(() => {
          const currentState = useTimerStore.getState();
          currentState.dispatch({ type: 'UPDATE_ELAPSED' });

          // 목표 시간 도달 체크
          if (
            currentState.targetSeconds !== null &&
            currentState.elapsedSeconds >= currentState.targetSeconds
          ) {
            currentState.dispatch({ type: 'PAUSE' });
            alert(`목표 시간 ${currentState.targetSeconds}초에 도달했습니다!`);
          }
        }, 100);

        return { ...newState, intervalId: intervalId as any };
      }

      return newState;
    });
  },
}));

// 파생값 selector 함수들 (관계 선언) - zustand는 getter가 아닌 selector 함수 사용
export const selectFormattedTime = (state: TimerStore): string => {
  const hours = Math.floor(state.elapsedSeconds / 3600);
  const minutes = Math.floor((state.elapsedSeconds % 3600) / 60);
  const secs = state.elapsedSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const selectFormattedTargetTime = (state: TimerStore): string | null => {
  if (state.targetSeconds === null) return null;

  const hours = Math.floor(state.targetSeconds / 3600);
  const minutes = Math.floor((state.targetSeconds % 3600) / 60);
  const secs = state.targetSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// 선언적 UI 상태 모델: 버튼 가능 상태를 타입으로 제한
export type TimerViewState =
  | { status: 'idle'; canStart: true; canPause: false; canReset: false }
  | { status: 'running'; canStart: false; canPause: true; canReset: true }
  | { status: 'paused'; canStart: true; canPause: false; canReset: true };

// 각 속성을 개별 selector로 분리하여 무한 루프 방지
export const selectStatus = (state: TimerStore): TimerStatus => state.status;

export const selectCanStart = (state: TimerStore): boolean => {
  return state.status === 'idle' || state.status === 'paused';
};

export const selectCanPause = (state: TimerStore): boolean => {
  return state.status === 'running';
};

export const selectCanReset = (state: TimerStore): boolean => {
  return state.status === 'running' || state.status === 'paused';
};

export const selectIsTargetSet = (state: TimerStore): boolean => {
  return state.targetSeconds !== null;
};
