import React, { useEffect, useRef, useState, useMemo } from "react";

const Time = React.memo(({ onTimeUp, initialTime }) => {
  const timerRef = useRef(null);
  const updateTimeCountRef = useRef(0);

  const [remainingTime, setRemainingTime] = useState(() => {
    const saved = localStorage.getItem("remainingTime");
    return saved ? parseInt(saved) : initialTime;
  });

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev - 1000;
        if (newTime <= 0) {
          clearInterval(timerRef.current);
          onTimeUp();
          return 0;
        }

        updateTimeCountRef.current++;
        if (updateTimeCountRef.current % 10 === 0) {
          localStorage.setItem("remainingTime", newTime);
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [onTimeUp]);

  const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor(
      (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

  const counter = useMemo(() => {
    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor(
      (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    return `${hours} hours ${minutes} minutes ${seconds} seconds`;
  }, [remainingTime]);

  return (
    <div className="flex justify-center m-5">
      <span className="countdown font-mono text-3xl">
        <span
          style={{ "--value": hours }}
          aria-live="polite"
          aria-label={counter}
        >
          {hours}
        </span>
        :
        <span
          style={{ "--value": minutes }}
          aria-live="polite"
          aria-label={counter}
        >
          {minutes}
        </span>
        :
        <span
          style={{ "--value": seconds }}
          aria-live="polite"
          aria-label={counter}
        >
          {seconds}
        </span>
      </span>{" "}
    </div>
  );
});

export default Time;
