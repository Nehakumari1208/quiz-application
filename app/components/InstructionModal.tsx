"use client";

import { motion } from "framer-motion";

type Props = {
    open: boolean;
    onClose: () => void;
    onBegin: () => void;
};

export default function InstructionModal({ open, onClose, onBegin }: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
            <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-md rounded-3xl bg-[#0b1025] border border-white/10 shadow-2xl p-7 text-white"
            >
                <h2 className="text-xl font-semibold mb-1">Quiz Instructions</h2>
                <p className="text-sm text-zinc-400 mb-5">Please read carefully before starting the test.</p>

                <div className="space-y-4 text-sm text-zinc-300">
                    <div className="flex justify-between">
                        <span>Total Questions</span>
                        <span className="text-white font-medium">15</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Time Limit</span>
                        <span className="text-white font-medium">30 minutes</span>
                    </div>

                    <div className="border-t border-white/10 pt-4 space-y-3">
                        <p className="text-white font-medium">Question Status Guide</p>

                        <div className="flex items-center gap-3">
                            <span className="w-4 h-4 rounded bg-blue-600 shadow" />
                            <span>Current Question</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="w-4 h-4 rounded bg-emerald-500 shadow" />
                            <span>Answered</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="w-4 h-4 rounded bg-yellow-400 shadow" />
                            <span>Visited (Not Answered)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-4 h-4 rounded bg-purple-500" /> Marked for Review
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="w-4 h-4 rounded bg-zinc-500 shadow" />
                            <span>Not Visited</span>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-4 text-xs text-zinc-400 leading-relaxed">
                        ⚠ Once the quiz begins, the timer cannot be paused.
                        Your progress will be automatically submitted when time expires.
                    </div>
                </div>

                <div className="mt-7 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-white/20 py-2.5 text-sm hover:bg-white/10 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onBegin}
                        className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 py-2.5 text-sm font-medium shadow-md transition"
                    >
                        Begin Test
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
