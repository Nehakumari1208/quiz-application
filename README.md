
# Quiz Application

Small, modular quiz app built with Next.js. It fetches 15 questions from API and presents a timed quiz with an overview panel and per-question navigation.

## Features

- Start screen collecting user email
- 15 questions fetched from `https://opentdb.com/api.php?amount=15`
- 30-minute timer with automatic submission at expiry
- Overview panel with question status (current, answered, visited, marked)
- Keyboard navigation and small accessibility improvements

## Quick Start

Requirements: Node.js 18+ (recommended) and npm/yarn/pnpm.

1. Install dependencies

```bash
npm install
```

2. Run development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

Other scripts

```bash
npm run build   # build for production
npm start       # start production server after build
npm run lint    # run eslint
```

## Project structure (important files)

- `app/page.tsx` — Landing / start flow
- `app/quiz/page.tsx` — Main quiz UI (QuestionCard, Timer, OverviewPanel)
- `app/report/page.tsx` — Final report screen
- `app/components` — Reusable components (QuestionCard, Timer, OverviewPanel, modals)
- `app/context/QuizContext.tsx` — Central quiz state and persistence
- `app/lib` — small utilities

## Notes

- Questions from the API may contain HTML entities; these are decoded client-side before display.
- Quiz progress is auto-saved to `localStorage` and can be continued if the same email is used.

## Approach

- Centralized state in `QuizContext` and a `useQuiz()` hook for simple access across components.
- Small, focused UI components (`QuestionCard`, `Timer`, `OverviewPanel`) to keep responsibilities clear and enable reuse.
- Persistence implemented with `localStorage` (saved quiz state + timer end timestamp) so users can resume on reload.
- Utility and type sharing via `app/lib` and `app/types` to avoid duplication and improve type-safety.

## Assumptions

- The API endpoint (`https://opentdb.com/api.php?amount=15`) returns valid questions and remains available.
- Persistence is local-only and not secure for sensitive data.

## Challenges & how they were solved

- Timer persistence: storing the absolute end timestamp in `localStorage` and restoring it on mount keeps the timer accurate across reloads.
- Overview panel layout: buttons changed size when the container grew; solution was to set a fixed panel width on larger screens and make the grid scrollable (`max-h-64 overflow-auto`).
- Repeated modal markup: extracted `SubmitModal`, `InstructionModal`, and `ContinueQuizModal` to reduce duplication and improve maintainability.
- Keyboard navigation and accessibility: added keyboard handlers (Arrow keys, number keys for options) and prevents actions when the timer expires to avoid inconsistent state.

## Next steps / Improvements

- Extract more UI primitives into `app/components/ui/` for reusability
- Add unit/integration tests and run type checking in CI
- Improve ARIA attributes and keyboard focus management for better accessibility

## Deployment
