export type RawQuestion = {
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
};

export type Question = RawQuestion & { choices: string[] };

export type SavedQuizState = {
    email: string;
    questions: Question[];
    currentIndex: number;
    answers: Record<number, string>;
    visited: number[];
    attempted: number[];
    markedForReview: number[];
    timestamp: number;
    endTime: number;
};

export type QuizContextType = {
    email?: string;
    questions: Question[];
    currentIndex: number;
    answers: Record<number, string>;
    visited: number[];
    attempted: number[];
    markedForReview: number[];
    startQuiz: (email: string, useExisting?: boolean) => Promise<void>;
    setAnswer: (index: number, answer: string) => void;
    goTo: (index: number) => void;
    toggleMarkForReview: (index: number) => void;
    isMarked: (index: number) => boolean;
    submit: () => void;
    submitted: boolean;
    hasTimerExpired: boolean;
    isOffline: boolean;
    clearSavedQuiz: () => void;
    getSavedQuiz: () => SavedQuizState | null;
};
