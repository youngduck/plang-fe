import "@testing-library/jest-dom";
import { beforeEach, afterEach } from "vitest";
import { useTimerStore } from "./domains/timer/timer-store";

// Timer 관련 Zustand 스토어를 각 테스트마다 초기 상태로 리셋
const resetTimerStore = () => {
  useTimerStore.setState((state) => ({
    status: "idle",
    elapsedSeconds: 0,
    targetSeconds: null,
    startTime: null,
    pausedElapsedSeconds: 0,
    intervalId: null,
    // dispatch 함수는 기존 인스턴스를 유지
    dispatch: state.dispatch,
  }));
};

beforeEach(() => {
  resetTimerStore();
});

afterEach(() => {
  resetTimerStore();
});