"use client";

import { motion } from "framer-motion";
import { useQuiz } from "../context/QuizContext";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { decodeHtml } from "../lib/utils";

export default function QuestionCard({ index }: { index: number }) {
    const {
        questions,
        answers,
        setAnswer,
        markedForReview,
        toggleMarkForReview,
        hasTimerExpired,
        goTo,
    } = useQuiz();

    const q = questions[index];
    const isMarked = markedForReview.includes(index);
    const isFirstQuestion = index === 0;
    const isLastQuestion = index === questions.length - 1;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (hasTimerExpired) return;

            const keyNum = parseInt(e.key);
            if (keyNum >= 1 && keyNum <= 4 && keyNum <= q.choices.length) {
                e.preventDefault();
                const selectedChoice = q.choices[keyNum - 1];
                setAnswer(index, selectedChoice);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [index, q.choices, setAnswer, hasTimerExpired]);

    return (
        <div className="space-y-4">
            <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`rounded-3xl backdrop-blur-2xl border shadow-2xl p-6 sm:p-8 text-white transition-opacity ${hasTimerExpired
                    ? "bg-white/5 border-white/5 opacity-60"
                    : "bg-white/10 border-white/10"
                    }`}
            >
                <div className="flex items-center justify-between mb-5">
                    <div className="text-lg sm:text-xl font-semibold leading-relaxed">
                        {decodeHtml(q.question)}
                    </div>

                    <button
                        onClick={() => toggleMarkForReview(index)}
                        disabled={hasTimerExpired}
                        className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg transition
            ${isMarked
                                ? "bg-purple-600/20 text-purple-300 border border-purple-500/40"
                                : "bg-white/5 text-zinc-300 border border-white/10 hover:bg-white/10"}
            ${hasTimerExpired ? "opacity-50 cursor-not-allowed" : ""}
          `}
                    >
                        <Star size={16} fill={isMarked ? "currentColor" : "none"} />
                        {isMarked ? "Marked" : "Mark"}
                    </button>
                </div>


                <div className="grid gap-3">
                    {q.choices.map((c, i) => {
                        const selected = answers[index] === c;

                        return (
                            <motion.button
                                key={i}
                                whileHover={!hasTimerExpired ? { scale: 1.01 } : {}}
                                whileTap={!hasTimerExpired ? { scale: 0.97 } : {}}
                                onClick={() => !hasTimerExpired && setAnswer(index, c)}
                                disabled={hasTimerExpired}
                                className={`
                rounded-xl border px-4 py-3 text-left font-medium transition-all
                ${selected
                                        ? "bg-blue-600 border-blue-500 text-white shadow-lg scale-[1.02]"
                                        : "bg-white/5 border-white/10 hover:bg-white/10"}
                ${hasTimerExpired ? "opacity-50 cursor-not-allowed" : ""}
              `}
                            >
                                <span className="mr-3 font-bold text-blue-400">
                                    {String.fromCharCode(49 + i)}.
                                </span>
                                {decodeHtml(c)}
                            </motion.button>
                        );
                    })}
                </div>

                {hasTimerExpired && (
                    <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm text-center">
                        ⏱️ Time has expired. Your answers are being submitted...
                    </div>
                )}
            </motion.div>

            <div className="flex justify-between gap-4">
                <motion.button
                    onClick={() => !isFirstQuestion && goTo(Math.max(0, index - 1))}
                    disabled={isFirstQuestion || hasTimerExpired}
                    whileHover={!isFirstQuestion && !hasTimerExpired ? { scale: 1.05 } : {}}
                    whileTap={!isFirstQuestion && !hasTimerExpired ? { scale: 0.95 } : {}}
                    className="flex items-center gap-1 rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium"
                >
                    <ChevronLeft size={16} />
                    Previous
                </motion.button>

                <motion.button
                    onClick={() => !isLastQuestion && goTo(Math.min(questions.length - 1, index + 1))}
                    disabled={isLastQuestion || hasTimerExpired}
                    whileHover={!isLastQuestion && !hasTimerExpired ? { scale: 1.05 } : {}}
                    whileTap={!isLastQuestion && !hasTimerExpired ? { scale: 0.95 } : {}}
                    className="flex items-center gap-1 rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium"
                >
                    Next
                    <ChevronRight size={16} />
                </motion.button>
            </div>
        </div>
    );
}
