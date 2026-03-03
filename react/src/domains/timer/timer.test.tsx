import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Timer from "./timer";

describe("Timer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  const renderTimer = () => render(<Timer />);

  it("초기 상태가 Idle 이고 시간은 00:00이어야 한다", () => {
    renderTimer();

    expect(screen.getByText("Plang Timer")).toBeInTheDocument();
    expect(screen.getByText("idle")).toBeInTheDocument();
    expect(screen.getByText("00:00")).toBeInTheDocument();

    const startButton = screen.getByRole("button", { name: "Start" });
    const pauseButton = screen.getByRole("button", { name: "Pause" });
    const resetButton = screen.getByRole("button", { name: "Reset" });

    expect(startButton).toBeEnabled();
    expect(pauseButton).toBeDisabled();
    expect(resetButton).toBeDisabled();
  });

  it("Start 버튼 클릭 시 Running 상태가 되고 시간이 증가해야 한다", () => {
    renderTimer();

    const startButton = screen.getByRole("button", { name: "Start" });
    const pauseButton = screen.getByRole("button", { name: "Pause" });
    const resetButton = screen.getByRole("button", { name: "Reset" });

    fireEvent.click(startButton);

    expect(screen.getByText("running")).toBeInTheDocument();
    expect(startButton).toBeDisabled();
    expect(pauseButton).toBeEnabled();
    expect(resetButton).toBeEnabled();

    act(() => {
      vi.advanceTimersByTime(3100);
    });

    expect(screen.getByText("00:03")).toBeInTheDocument();
  });

  it("Pause 버튼 클릭 시 시간 증가가 멈춰야 한다", () => {
    renderTimer();

    const startButton = screen.getByRole("button", { name: "Start" });
    const pauseButton = screen.getByRole("button", { name: "Pause" });

    fireEvent.click(startButton);

    act(() => {
      // 2초대 시간 경과 (2100ms든 2900ms든 상관없이)
      vi.advanceTimersByTime(2999);
    });

    // Pause 버튼 클릭 후 시간 확인
    fireEvent.click(pauseButton);

    screen.debug();

    // Pause 클릭 시점의 시간이 00:02여야 함
    expect(screen.getByText("00:02")).toBeInTheDocument();

    // 아무것도 하지않는 시간 경과 후에도 여전히 00:02여야 함
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText("00:02")).toBeInTheDocument();
  });

  it("Reset 버튼 클릭 시 Idle 상태로 돌아가고 시간이 00:00 이 되어야 한다", () => {
    renderTimer();

    const startButton = screen.getByRole("button", { name: "Start" });
    const resetButton = screen.getByRole("button", { name: "Reset" });

    fireEvent.click(startButton);

    act(() => {
      // 2초대 시간 경과 (2000ms든 2900ms든 상관없이)
      vi.advanceTimersByTime(2600);
    });
    screen.debug();

    // Reset 버튼 클릭 후 상태 확인
    fireEvent.click(resetButton);

    // Reset 클릭 후 Idle 상태와 00:00 확인
    expect(screen.getByText("idle")).toBeInTheDocument();
    expect(screen.getByText("00:00")).toBeInTheDocument();
  });

  it("목표 시간을 설정하고 도달하면 알림이 뜨고 Pause 상태가 되어야 한다", () => {
    renderTimer();

    const input = screen.getByPlaceholderText("목표 시간을 초단위로 입력해주세요.");
    const setButton = screen.getByRole("button", { name: "설정" });
    const startButton = screen.getByRole("button", { name: "Start" });

    fireEvent.change(input, { target: { value: "3" } });
    fireEvent.click(setButton);

    fireEvent.click(startButton);

    act(() => {
      // 목표 시간(3초) 도달을 위해 3초대 시간 경과
      vi.advanceTimersByTime(3100);
    });

    // 목표 시간 도달 후 자동 Pause 상태 확인
    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(screen.getByText("paused")).toBeInTheDocument();
    expect(screen.getByText("00:03")).toBeInTheDocument();
  });
});