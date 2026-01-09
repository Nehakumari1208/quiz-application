"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RawQuestion, Question, SavedQuizState, QuizContextType } from "../types";

const QuizContext = createContext<QuizContextType | null>(null);

const QUIZ_STORAGE_KEY = "quiz_progress";
const TIMER_STORAGE_KEY = "quiz_timer";

function shuffle<T>(arr: T[]) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();

    const [email, setEmail] = useState<string>();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [visited, setVisited] = useState<number[]>([]);
    const [attempted, setAttempted] = useState<number[]>([]);
    const [markedForReview, setMarkedForReview] = useState<number[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [hasTimerExpired, setHasTimerExpired] = useState(false);
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        if (questions.length > 0 && email && !submitted) {
            try {
                const state: SavedQuizState = {
                    email,
                    questions,
                    currentIndex,
                    answers,
                    visited,
                    attempted,
                    markedForReview,
                    timestamp: Date.now(),
                    endTime: parseInt(localStorage.getItem(TIMER_STORAGE_KEY) || "0", 10),
                };
                localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(state));
            } catch (error) {
                console.error("Failed to save quiz progress:", error);
            }
        }
    }, [currentIndex, answers, visited, attempted, markedForReview, questions, email, submitted]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (questions.length > 0 && !submitted) {
                e.preventDefault();
                e.returnValue = "";
                return "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [questions.length, submitted]);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        setIsOffline(!navigator.onLine);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    async function startQuiz(userEmail: string, useExisting: boolean = false) {
        setEmail(userEmail);

        let qs: Question[] = [];

        if (useExisting) {
            try {
                const saved = localStorage.getItem(QUIZ_STORAGE_KEY);
                if (saved) {
                    const state: SavedQuizState = JSON.parse(saved);
                    if (state.email === userEmail) {
                        setQuestions(state.questions);
                        setCurrentIndex(state.currentIndex);
                        setAnswers(state.answers);
                        setVisited(state.visited);
                        setAttempted(state.attempted);
                        setMarkedForReview(state.markedForReview);
                        if (state.endTime) {
                            localStorage.setItem(TIMER_STORAGE_KEY, state.endTime.toString());
                        }
                        setSubmitted(false);
                        router.push("/quiz");
                        return;
                    }
                }
            } catch (error) {
                console.error("Failed to restore quiz from localStorage:", error);
            }
        }

        let data: any = null;
        try {
            const res = await fetch("https://opentdb.com/api.php?amount=15", {
                signal: AbortSignal.timeout(5000), 
            });
            if (!res.ok) throw new Error(`API Error: ${res.status}`);
            data = await res.json();
        } catch (error) {
            console.error("Failed to fetch questions:", error);
            alert("Failed to load questions. Please check your internet connection and try again.");
            return;
        }

        qs = (data?.results || []).map((q: RawQuestion) => ({
            ...q,
            choices: shuffle([q.correct_answer, ...q.incorrect_answers]),
        }));

        if (qs.length === 0) {
            alert("No questions loaded. Please try again.");
            return;
        }

        setQuestions(qs);
        setCurrentIndex(0);
        setAnswers({});
        setVisited([0]);
        setAttempted([]);
        setMarkedForReview([]);
        setSubmitted(false);
        setHasTimerExpired(false);

        const endTime = Date.now() + 1800 * 1000; 
        localStorage.setItem(TIMER_STORAGE_KEY, endTime.toString());

        router.push("/quiz");
    }

    function setAnswer(index: number, answer: string) {
        if (hasTimerExpired) return;
        setAnswers((s) => ({ ...s, [index]: answer }));
        setAttempted((a) => (a.includes(index) ? a : [...a, index]));
    }

    function goTo(index: number) {
        if (hasTimerExpired) return; 
        setCurrentIndex(index);
        setVisited((v) => (v.includes(index) ? v : [...v, index]));
    }

    function toggleMarkForReview(index: number) {
        if (hasTimerExpired) return; 
        setMarkedForReview((m) =>
            m.includes(index) ? m.filter((i) => i !== index) : [...m, index]
        );
    }

    function isMarked(index: number) {
        return markedForReview.includes(index);
    }

    function submit() {
        setSubmitted(true);
        try {
            localStorage.removeItem(QUIZ_STORAGE_KEY);
            localStorage.removeItem(TIMER_STORAGE_KEY);
        } catch (error) {
            console.error("Failed to clear localStorage:", error);
        }
        router.push("/report");
    }

    function clearSavedQuiz() {
        try {
            localStorage.removeItem(QUIZ_STORAGE_KEY);
            localStorage.removeItem(TIMER_STORAGE_KEY);
        } catch (error) {
            console.error("Failed to clear localStorage:", error);
        }
    }

    function getSavedQuiz(): SavedQuizState | null {
        try {
            const saved = localStorage.getItem(QUIZ_STORAGE_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error("Failed to get saved quiz:", error);
            return null;
        }
    }

    return (
        <QuizContext.Provider
            value={{
                email,
                questions,
                currentIndex,
                answers,
                visited,
                attempted,
                markedForReview,
                startQuiz,
                setAnswer,
                goTo,
                toggleMarkForReview,
                isMarked,
                submit,
                submitted,
                hasTimerExpired,
                isOffline,
                clearSavedQuiz,
                getSavedQuiz,
            }}
        >
            {children}
        </QuizContext.Provider>
    );
};

export function useQuiz() {
    const ctx = useContext(QuizContext);
    if (!ctx) throw new Error("useQuiz must be used within QuizProvider");
    return ctx;
}
