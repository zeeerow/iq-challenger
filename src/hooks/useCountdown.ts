import { useState, useEffect, useRef, useCallback } from 'react';

interface UseCountdownProps {
  initialSeconds: number;
  onComplete?: () => void;
}

export function useCountdown({ initialSeconds, onComplete }: UseCountdownProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const onCompleteCalled = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stop = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback((newSeconds?: number) => {
    stop();
    setRemainingSeconds(newSeconds ?? initialSeconds);
    onCompleteCalled.current = false;
  }, [initialSeconds, stop]);

  const start = useCallback(() => {
    setIsActive(true);
    onCompleteCalled.current = false;
  }, []);

  useEffect(() => {
    if (isActive && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => prev - 1);
      }, 1000);
    } else if (remainingSeconds === 0 && !onCompleteCalled.current) {
      stop();
      onCompleteCalled.current = true;
      onComplete?.();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, remainingSeconds, onComplete, stop]);

  return {
    remainingSeconds,
    start,
    stop,
    reset,
    isActive
  };
}
