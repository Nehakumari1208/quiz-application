"use client";

import { motion } from "framer-motion";

type SavedQuiz = any;

type Props = {
    open: boolean;
    onClose: () => void;
    savedQuiz?: SavedQuiz | null;
    onStartFresh: () => void;
    onContinue: () => void;
};

export default function ContinueQuizModal({ open, onClose, savedQuiz, onStartFresh, onContinue }: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
            <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-md rounded-3xl bg-[#0b1025] border border-white/10 shadow-2xl p-7 text-white"
            >
                <h2 className="text-xl font-semibold mb-2">Resume Quiz?</h2>
                <p className="text-sm text-zinc-400 mb-5">We found a quiz in progress. Would you like to continue from where you left off?</p>

                {savedQuiz && (
                    <div className="bg-white/5 rounded-xl p-4 mb-6 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-zinc-400">Questions Answered</span>
                            <span className="text-white font-medium">{Object.keys(savedQuiz.answers).length} / 15</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-400">Last Saved</span>
                            <span className="text-white font-medium">{new Date(savedQuiz.timestamp).toLocaleTimeString()}</span>
                        </div>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={onStartFresh}
                        className="flex-1 rounded-xl border border-white/20 py-2.5 text-sm hover:bg-white/10 transition"
                    >
                        Start Fresh
                    </button>

                    <button
                        onClick={onContinue}
                        className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 py-2.5 text-sm font-medium shadow-md transition"
                    >
                        Continue Quiz
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
