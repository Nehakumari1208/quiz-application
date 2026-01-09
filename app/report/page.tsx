"use client";

import { useEffect, useState } from "react";
import { useQuiz } from "../context/QuizContext";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Trophy, WifiOff } from "lucide-react";
import confetti from "canvas-confetti"
import { decodeHtml } from "../lib/utils";

export default function ReportPage() {
    const { questions, answers, isOffline } = useQuiz();
    const [displayPercent, setDisplayPercent] = useState(0);

    if (!questions?.length) {
        return <div className="h-screen p-10 text-center text-white">No results available</div>;
    }

    const score = questions.reduce(
        (s, q, i) => (answers[i] === q.correct_answer ? s + 1 : s),
        0
    );

    const percent = Math.round((score / questions.length) * 100);

    useEffect(() => {
        let current = 0;
        const interval = setInterval(() => {
            current += 1;
            setDisplayPercent(current);
            if (current >= percent) clearInterval(interval);
        }, 20);

        if (percent >= 80) {
            setTimeout(() => {
                confetti({ particleCount: 180, spread: 80, origin: { y: 0.6 } });
            }, 900);
        }
    }, [percent]);

    return (
        <div className="min-h-screen px-4 py-8 sm:px-10 bg-linear-to-br from-[#020617] to-[#0a1020] text-white">
            {isOffline && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed top-4 left-4 right-4 z-40 flex items-center gap-3 bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-300 mx-4"
                >
                    <WifiOff size={18} />
                    <span className="text-sm font-medium">No internet connection</span>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-6xl space-y-8"
            >

                <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl p-8 text-center"
                >
                    <motion.div
                        animate={{ rotate: [0, -12, 12, 0] }}
                        transition={{ duration: 1 }}
                        className="mx-auto mb-3 text-yellow-400"
                    >
                        <Trophy size={56} />
                    </motion.div>

                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                        Quiz Completed!
                    </h1>

                    <p className="text-zinc-300 text-lg mb-3">
                        You scored <span className="text-white font-semibold">{score}</span> / {questions.length}
                    </p>

                    <div className="text-5xl font-extrabold text-blue-400 mb-4">
                        {displayPercent}%
                    </div>

                    <div className="relative h-4 w-full rounded-full bg-white/20 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 1 }}
                            className="absolute h-full bg-blue-600"
                        />
                    </div>

                    <p className="mt-2 text-sm text-zinc-400">Accuracy</p>
                </motion.div>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
                    <table className="w-full text-sm">
                        <thead className="bg-white/10 text-zinc-300">
                            <tr>
                                <th className="px-4 py-3 text-left">No.</th>
                                <th className="px-4 py-3 text-left">Question</th>
                                <th className="px-4 py-3 text-left">Your Answer</th>
                                <th className="px-4 py-3 text-left">Correct Answer</th>
                                <th className="px-4 py-3 text-center">Result</th>
                            </tr>
                        </thead>

                        <tbody>
                            {questions.map((q, i) => {
                                const isCorrect = answers[i] === q.correct_answer;

                                return (
                                    <tr key={i} className="border-t border-white/10 hover:bg-white/5 transition">
                                        <td className="px-4 py-3 text-zinc-400">{i + 1}</td>

                                        <td className="px-4 py-3 max-w-75">
                                            <div className="font-medium text-white leading-relaxed">
                                                {decodeHtml(q.question)}
                                            </div>
                                        </td>

                                        <td className={`px-4 py-3 font-medium ${isCorrect ? "text-emerald-400" : "text-red-400"}`}>
                                            {answers[i] ? decodeHtml(answers[i]) : (
                                                <span className="text-zinc-500 italic">Not answered</span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3 text-emerald-400 font-medium">
                                            {decodeHtml(q.correct_answer)}
                                        </td>

                                        <td className="px-4 py-3 text-center">
                                            {isCorrect ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-400 px-3 py-1 text-xs font-semibold">
                                                    <CheckCircle className="w-4 h-4" /> Correct
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 text-red-400 px-3 py-1 text-xs font-semibold">
                                                    <XCircle className="w-4 h-4" /> Incorrect
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

            </motion.div>
        </div>
    );
}
