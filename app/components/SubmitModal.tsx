"use client";

import { motion } from "framer-motion";
import { CheckCircle, Eye, EyeOff, AlertCircle } from "lucide-react";

type Props = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isSubmitting: boolean;
    answeredCount: number;
    visitedButNotAnswered: number;
    unvisitedCount: number;
    questionsLength: number;
};

function SummaryRow({ label, value, percent, color, icon }: any) {
    const colors: any = {
        green: ["bg-green-900/30", "bg-green-800", "bg-green-400", "text-green-400"],
        yellow: ["bg-yellow-900/30", "bg-yellow-800", "bg-yellow-400", "text-yellow-400"],
        zinc: ["bg-zinc-900/30", "bg-zinc-700", "bg-zinc-400", "text-zinc-400"],
    };

    const [bg, track, fill, text] = colors[color];

    return (
        <div className={`flex items-center gap-3 ${bg} rounded-xl p-3`}>
            <div className={`${text}`}>{icon}</div>
            <div className="flex-1">
                <div className={`text-sm font-medium ${text}`}>{label}</div>
                <div className={`h-2 w-full ${track} rounded-full mt-1 overflow-hidden`}>
                    <div className={`h-full ${fill} transition-all`} style={{ width: `${percent}%` }} />
                </div>
            </div>
            <div className={`text-sm font-semibold ${text}`}>{value}</div>
        </div>
    );
}

export default function SubmitModal({
    open,
    onClose,
    onConfirm,
    isSubmitting,
    answeredCount,
    visitedButNotAnswered,
    unvisitedCount,
    questionsLength,
}: Props) {
    if (!open) return null;

    const answeredPercent = (answeredCount / questionsLength) * 100;
    const visitedPercent = (visitedButNotAnswered / questionsLength) * 100;
    const unvisitedPercent = (unvisitedCount / questionsLength) * 100;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md rounded-3xl bg-[#020617] border border-white/10 p-6 shadow-2xl text-white"
            >
                <h3 className="text-xl font-bold mb-4 text-center">Submit Quiz?</h3>
                <p className="text-sm text-zinc-400 text-center mb-6">Review your quiz progress before submitting</p>

                <div className="space-y-4">
                    <SummaryRow label="Answered" value={answeredCount} percent={answeredPercent} color="green" icon={<CheckCircle />} />
                    <SummaryRow label="Visited" value={visitedButNotAnswered} percent={visitedPercent} color="yellow" icon={<Eye />} />
                    <SummaryRow label="Not Visited" value={unvisitedCount} percent={unvisitedPercent} color="zinc" icon={<EyeOff />} />
                </div>

                {answeredCount < questionsLength && (
                    <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex gap-3 text-yellow-300 text-sm">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        <span>{questionsLength - answeredCount} question(s) unanswered. Continue?</span>
                    </div>
                )}

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-xl border border-white/20 px-4 py-2 hover:bg-white/10 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="rounded-xl bg-red-600 px-4 py-2 font-semibold hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Submitting..." : "Confirm Submit"}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
