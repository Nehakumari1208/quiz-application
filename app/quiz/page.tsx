"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuiz } from "../context/QuizContext";
import Timer from "../components/Timer";
import QuestionCard from "../components/QuestionCard";
import OverviewPanel from "../components/OverviewPanel";
import { WifiOff } from "lucide-react";
import SubmitModal from "../components/SubmitModal";

function QuizLoader() {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0b1025] text-white">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent mb-6"
            />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center space-y-1"
            >
                <p className="text-lg font-medium">Preparing your quiz</p>
                <p className="text-sm text-zinc-400">Loading questions & timer…</p>
            </motion.div>
        </div>
    );
}

export default function QuizPage() {
    const { questions, currentIndex, goTo, submit, answers, visited, isOffline, hasTimerExpired } = useQuiz();
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (hasTimerExpired) return;

            if (e.key === "ArrowLeft") {
                e.preventDefault();
                goTo(Math.max(0, currentIndex - 1));
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                goTo(Math.min(questions.length - 1, currentIndex + 1));
            } else if (e.key === "Enter" && !showSubmitModal) {
                e.preventDefault();
                setShowSubmitModal(true);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentIndex, questions.length, goTo, hasTimerExpired, showSubmitModal]);

    if (!questions?.length) {
        return <QuizLoader />;
    }

    const answeredCount = Object.values(answers).filter(Boolean).length;
    const visitedButNotAnswered = visited.filter((i) => !answers[i]).length;
    const unvisitedCount = questions.length - visited.length;

    const answeredPercent = (answeredCount / questions.length) * 100;
    const visitedPercent = (visitedButNotAnswered / questions.length) * 100;
    const unvisitedPercent = (unvisitedCount / questions.length) * 100;

    const handleSubmitClick = () => {
        if (isSubmitting) return; 
        setShowSubmitModal(true);
    };

    const handleConfirmSubmit = () => {
        if (isSubmitting) return; 
        setIsSubmitting(true);
        setShowSubmitModal(false);
        submit();
    };

    return (
        <div className="h-screen px-4 py-6 sm:px-8 text-white bg-[#0b1025]">
            {isOffline && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed top-4 left-4 right-4 z-40 flex items-center gap-3 bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-300"
                >
                    <WifiOff size={18} />
                    <span className="text-sm font-medium">No internet connection - Your progress is saved locally</span>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-6xl space-y-6"
            >
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-lg">
                    <div className="flex-1">
                        <h2 className="text-lg sm:text-xl font-semibold">
                            Question {currentIndex + 1} of {questions.length}
                        </h2>

                        <div className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all duration-300"
                                style={{ width: `${answeredPercent}%` }}
                            />
                        </div>

                        <div className="text-xs text-zinc-400 mt-1">
                            {answeredCount} answered / {visitedButNotAnswered} visited / {unvisitedCount} not visited
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Timer />
                        <button
                            onClick={handleSubmitClick}
                            disabled={isSubmitting || hasTimerExpired}
                            className="rounded-xl bg-red-600 px-4 py-2 text-white font-semibold shadow hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                    <QuestionCard index={currentIndex} />
                    <OverviewPanel />
                </div>

                <SubmitModal
                    open={showSubmitModal}
                    onClose={() => setShowSubmitModal(false)}
                    onConfirm={handleConfirmSubmit}
                    isSubmitting={isSubmitting}
                    answeredCount={answeredCount}
                    visitedButNotAnswered={visitedButNotAnswered}
                    unvisitedCount={unvisitedCount}
                    questionsLength={questions.length}
                />
            </motion.div>
        </div>
    );
}
