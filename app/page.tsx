"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuiz } from "./context/QuizContext";
import InstructionModal from "./components/InstructionModal";
import ContinueQuizModal from "./components/ContinueQuizModal";

export default function Home() {
  const { startQuiz, getSavedQuiz, clearSavedQuiz } = useQuiz();

  const [email, setEmail] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [savedQuiz, setSavedQuiz] = useState<any>(null);
  const [showContinueModal, setShowContinueModal] = useState(false);

  useEffect(() => {
    const saved = getSavedQuiz();
    if (saved) {
      setSavedQuiz(saved);
      setEmail(saved.email);
    }
  }, [getSavedQuiz]);

  return (
    <div className="relative min-h-screen bg-linear-to-br from-[#020617] via-[#050b1f] to-[#0a1230] overflow-hidden">
      <div className="absolute -top-40 -left-40 w-90 h-90 bg-blue-900/25 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-90 h-90 bg-indigo-900/20 rounded-full blur-[100px]" />

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-lg rounded-3xl bg-white/[0.07] backdrop-blur-xl border border-white/10 shadow-xl p-7 sm:p-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-3xl sm:text-4xl font-semibold text-white mb-3"
          >
            Quiz
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-zinc-300 mb-7 text-sm sm:text-base"
          >
            Enter your email to begin the quiz.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            onSubmit={(e) => {
              e.preventDefault();
              if (email.trim()) {
                if (savedQuiz && savedQuiz.email === email.trim()) {
                  setShowContinueModal(true);
                } else {
                  setShowConfirm(true);
                }
              }
            }}
            className="space-y-4"
          >
            <input
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm sm:text-base text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/70 transition"
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white py-3 text-sm sm:text-base font-medium transition shadow-md"
              type="submit"
            >
              Start Quiz
            </motion.button>
          </motion.form>
        </motion.div>
      </main>

      <InstructionModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onBegin={() => startQuiz(email.trim())}
      />

      <ContinueQuizModal
        open={showContinueModal}
        onClose={() => setShowContinueModal(false)}
        savedQuiz={savedQuiz}
        onStartFresh={() => {
          setShowContinueModal(false);
          clearSavedQuiz();
          setShowConfirm(true);
        }}
        onContinue={() => {
          setShowContinueModal(false);
          startQuiz(email.trim(), true);
        }}
      />
    </div>
  );
}
