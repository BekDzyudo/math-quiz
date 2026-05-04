import React, { useEffect, useRef, useState, useMemo } from "react";
import { readQuizState, writeQuizState } from "../utils/quizStorage";

const Time = React.memo(({showResult, isFinished, onTimeUp, initialTime, quizId }) => {
  const timerRef = useRef(null);
  const updateTimeCountRef = useRef(0);

  // Ref'lar orqali volatile qiymatlarni saqlash — interval qayta boshlanmaydi
  const onTimeUpRef = useRef(onTimeUp);
  const showResultRef = useRef(showResult);
  const isFinishedRef = useRef(isFinished);

  useEffect(() => { onTimeUpRef.current = onTimeUp; }, [onTimeUp]);
  useEffect(() => { showResultRef.current = showResult; }, [showResult]);
  useEffect(() => { isFinishedRef.current = isFinished; }, [isFinished]);

  const [remainingTime, setRemainingTime] = useState(() => {
    const saved = Number(readQuizState(quizId).remainingTime) || 0;
    return saved > 0 ? saved : initialTime;
  });

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev - 1000;
        if (newTime <= 0) {
          clearInterval(timerRef.current);
          onTimeUpRef.current();
          writeQuizState(quizId, { remainingTime: null });
          return 0;
        }
        if(showResultRef.current || (isFinishedRef.current == "true")){
          clearInterval(timerRef.current);
          writeQuizState(quizId, { remainingTime: null });
          return newTime;
        }
        else{
          updateTimeCountRef.current++;
          if (updateTimeCountRef.current % 10 === 0) {
            writeQuizState(quizId, { remainingTime: newTime });
          }

          return newTime;
        }
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []); // ← bo'sh: interval faqat bir marta boshlanadi

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
    <div className="flex justify-center md:m-5">
      <span className="countdown font-mono text-md md:text-3xl text-slate-700">
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
