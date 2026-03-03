/**
 * 작성자: KYD
 * 기능: 타이머 컴포넌트
 */
import React, { useState } from 'react';
import { Button } from '@youngduck/yd-ui';
import {
  useTimerStore,
  selectFormattedTime,
  selectFormattedTargetTime,
  selectStatus,
  selectCanStart,
  selectCanPause,
  selectCanReset,
  selectIsTargetSet,
} from './timer-store';

interface TimerProps {}

const Timer: React.FC<TimerProps> = () => {
  //SECTION HOOK호출 영역
  // 파생값과 선언적 뷰 상태를 selector로 구독 (개별 selector로 무한 루프 방지)
  const formattedTime = useTimerStore(selectFormattedTime);
  const formattedTargetTime = useTimerStore(selectFormattedTargetTime);
  const isTargetSet = useTimerStore(selectIsTargetSet);
  const status = useTimerStore(selectStatus);
  const canStart = useTimerStore(selectCanStart);
  const canPause = useTimerStore(selectCanPause);
  const canReset = useTimerStore(selectCanReset);

  // 액션 디스패처
  const dispatch = useTimerStore((state) => state.dispatch);

  const [targetInput, setTargetInput] = useState<string>('');
  //!SECTION HOOK호출 영역

  //SECTION 메서드 영역
  // 선언적 핸들러 (무엇을 할지만 기술)
  const handleStart = (): void => {
    dispatch({ type: 'START' });
  };

  const handlePause = (): void => {
    dispatch({ type: 'PAUSE' });
  };

  const handleReset = (): void => {
    dispatch({ type: 'RESET' });
    setTargetInput('');
  };

  const handleTargetInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setTargetInput(value);
  };

  const handleSetTarget = (): void => {
    const seconds = parseInt(targetInput, 10);
    if (!isNaN(seconds) && seconds > 0) {
      dispatch({ type: 'SET_TARGET', seconds });
    } else {
      dispatch({ type: 'CLEAR_TARGET' });
      setTargetInput('');
    }
  };

  const handleClearTarget = (): void => {
    dispatch({ type: 'CLEAR_TARGET' });
    setTargetInput('');
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-primary px-4 py-8">
      <div className="card-navy-200 bg-background-tertiary flex w-full max-w-sm sm:max-w-md md:max-w-lg flex-col gap-8">
        <h1 className="text-yds-h2 text-center text-primary-200">Plang Timer</h1>

        {/* 상태 표시 */}
        <div className="text-center">
          <span className="inline-block px-4 py-2 rounded-full text-yds-b1">
            {status}
          </span>
        </div>

        {/* 시간 표시 */}
        <div className="text-center flex flex-col gap-2 items-center">
          <div className="text-yds-h1 text-primary-200 font-mono">{formattedTime}</div>
          {isTargetSet && formattedTargetTime && (
            <div className="text-yds-b2 text-primary-100">{formattedTargetTime} 에 도달하면 알람이 뜹니다.</div>
          )}
        </div>

        {/* 목표 시간 설정 */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="number"
              value={targetInput}
              onChange={handleTargetInputChange}
              placeholder="목표 시간을 초단위로 입력해주세요."
              className="flex-1 px-4 py-2 bg-background-secondary border-secondary-50 text-white rounded-md focus:outline-none w-[100px] sm:w-full"
              min="1"
              disabled={status === 'running'}
            />
            {!isTargetSet ? (
              <Button
                variant="fill"
                color="primary"
                onClick={handleSetTarget}
                disabled={status === 'running' || !targetInput || parseInt(targetInput, 10) <= 0}
              >
                설정
              </Button>
            ) : (
              <Button variant="outlined" color="primary" onClick={handleClearTarget}>
                초기화
              </Button>
            )}
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex gap-3 justify-center">
          <Button variant="fill" size="full" onClick={handleStart} disabled={!canStart}>
            Start
          </Button>
          <Button variant="outlined" size="full" onClick={handlePause} disabled={!canPause}>
            Pause
          </Button>
          <Button variant="outlined" size="full" onClick={handleReset} disabled={!canReset}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Timer;