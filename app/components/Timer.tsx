"use client";

import { useEffect, useState, useContext } from "react";
import { Clock } from "lucide-react";
import { useQuiz } from "../context/QuizContext";

export default function Timer() {
  const { submit } = useQuiz();
  const [endTime, setEndTime] = useState(0);
  const [remaining, setRemaining] = useState(1800);

  useEffect(() => {
    try {
      const savedEndTime = parseInt(localStorage.getItem("quiz_timer") || "0", 10);
      if (savedEndTime && savedEndTime > Date.now()) {
        setEndTime(savedEndTime);
      } else {
        const newEndTime = Date.now() + 1800 * 1000;
        setEndTime(newEndTime);
        localStorage.setItem("quiz_timer", newEndTime.toString());
      }
    } catch (error) {
      const newEndTime = Date.now() + 1800 * 1000;
      setEndTime(newEndTime);
    }
  }, []);

  useEffect(() => {
    if (endTime === 0) return;

    const t = setInterval(() => {
      const sec = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setRemaining(sec);
      
      if (sec === 0) {
        clearInterval(t);
        submit();
      }
    }, 1000);

    return () => clearInterval(t);
  }, [endTime, submit]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  const isLow = remaining <= 60;
  const isExpired = remaining === 0;

  return (
    <div
      className={`
        flex items-center gap-2 rounded-xl px-4 py-2 font-semibold shadow-lg
        backdrop-blur-xl border border-white/10
        ${isExpired 
          ? "bg-red-700 text-white"
          : isLow
          ? "bg-red-600/80 text-white animate-pulse"
          : "bg-white/10 text-white"}
      `}
      title={isExpired ? "Time's up! Submitting..." : "Time remaining"}
    >
      <Clock className="w-4 h-4 opacity-80" />
      <span className="tracking-widest">
        {isExpired ? "Time's up!" : `Time Left - ${mm}:${ss}`}
      </span>
    </div>
  );
}
