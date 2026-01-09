"use client";

import { useQuiz } from "../context/QuizContext";
import { Star } from "lucide-react";

export default function OverviewPanel() {
  const {
    questions,
    visited,
    attempted,
    markedForReview,
    goTo,
    currentIndex,
  } = useQuiz();

  return (
    <div className="rounded-3xl bg-white/10 backdrop-blur-2xl shadow-2xl border border-white/10 p-5 text-white">
      <div className="mb-4 text-lg font-semibold tracking-wide">Overview</div>

      <div className="grid grid-cols-5 gap-2 mb-5">
        {questions.map((_, i) => {
          const active = currentIndex === i;
          const isAttempted = attempted.includes(i);
          const isVisited = visited.includes(i);
          const isMarked = markedForReview.includes(i);

          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`
                relative h-9 w-9 rounded-lg text-sm font-semibold transition-all
                ${active
                  ? "bg-blue-600 text-white scale-110 shadow-lg"
                  : isMarked
                    ? "bg-purple-600 text-white"
                    : isAttempted
                      ? "bg-emerald-500 text-white"
                      : isVisited
                        ? "bg-yellow-400 text-black"
                        : "bg-white/10 hover:bg-white/20"}
              `}
            >
              {i + 1}

              {isMarked && !active && (
                <Star
                  size={12}
                  className="absolute -top-1 -right-1 text-purple-300"
                  fill="currentColor"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="space-y-2 text-sm text-zinc-300">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-blue-600"></span>
          <span>Current Question</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-emerald-500"></span>
          <span>Attempted</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-yellow-400"></span>
          <span>Visited</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-purple-600"></span>
          <span>Marked for Review</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-white/20"></span>
          <span>Not Visited</span>
        </div>
      </div>
    </div>
  );
}
