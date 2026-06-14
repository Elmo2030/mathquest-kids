# MathQuest Kids 🌟

> A fully-featured, bilingual (English / Arabic) math learning game for children in Kindergarten through Grade 3. Built with React 19, Vite, Tailwind CSS 4, and Framer Motion. No backend or database required — all progress is stored in the browser's `localStorage`.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Feature List](#feature-list)
3. [Tech Stack](#tech-stack)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Running the Development Server](#running-the-development-server)
7. [Building for Production](#building-for-production)
8. [Folder Structure](#folder-structure)
9. [Architecture Overview](#architecture-overview)
10. [Localization (i18n)](#localization-i18n)
11. [Math Engine](#math-engine)
12. [Adding a New Grade Level](#adding-a-new-grade-level)
13. [Design System](#design-system)
14. [Known Limitations & Next Steps](#known-limitations--next-steps)

---

## Project Overview

**MathQuest Kids** is a single-page React application that guides children aged 4–10 through four grade-level zones of math practice. Each zone contains multiple **sub-levels** (operation types). The child must answer **5 questions correctly** to pass a sub-level and unlock the next one. Rounds award up to **3 stars** based on accuracy.

A **Parents Dashboard** — protected by a simple arithmetic math-gate to keep kids out — shows per-operation accuracy, areas to improve, play time, and a reset-progress option.

The entire app works **offline** after the first load. No API keys, no database, no server setup required.

---

## Feature List

| Feature | Details |
|---|---|
| **4 Grade Zones** | KG, Grade 1, Grade 2, Grade 3 |
| **10 Operation Sub-levels** | Counting, Number ID, Addition (easy/hard), Subtraction (easy/hard), Multiplication (basic/full), Division, Fractions |
| **Visual Question Types** | Emoji counting grids, large numeral display, arithmetic equations, SVG pie-chart fractions |
| **4-Choice Answers** | 1 correct + 3 calibrated distractors within ±4 of the answer |
| **Immediate Feedback** | Green scale-burst + "Great Job!" / Red shake + "Try Again!" |
| **Mascot (Ollie the Owl)** | Idle float, celebrate, oops, thinking, happy moods |
| **Sound Engine** | Web Audio API — correct ding, wrong buzz, star chime, round fanfare (no external files) |
| **Stars & Progression** | 3-star rating per round; sub-level pass requires 5 correct; unlocks next sub-level |
| **localStorage Persistence** | Stars, unlocked levels, answer history, play time survive page reloads |
| **Parents Dashboard** | Per-operation accuracy bars, Areas to Improve, recent activity log, Reset Progress |
| **Math Gate** | Random adult arithmetic question blocks kids from entering the dashboard |
| **Arabic / English i18n** | Full RTL layout switch; Tajawal font for Arabic; Western numerals always preserved |
| **Responsive Design** | Mobile-first; tested at 375 px, 768 px, 1280 px |
| **Framer Motion Transitions** | Slide-in/out between all screens; spring animations on answer buttons |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 19](https://react.dev/) + [Vite 7](https://vitejs.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Animation | [Framer Motion 12](https://www.framer.com/motion/) |
| Routing | [Wouter 3](https://github.com/molefrog/wouter) (context-driven, no URL routing needed) |
| UI Primitives | [shadcn/ui](https://ui.shadcn.com/) (Radix UI under the hood) |
| Icons | [Lucide React](https://lucide.dev/) |
| State | React Context + `useReducer` |
| Persistence | Browser `localStorage` |
| Fonts | [Fredoka One](https://fonts.google.com/specimen/Fredoka+One), [Nunito](https://fonts.google.com/specimen/Nunito), [Tajawal](https://fonts.google.com/specimen/Tajawal) (Google Fonts CDN) |
| Sound | Web Audio API (synthesised in-browser, zero external files) |
| Package Manager | [pnpm](https://pnpm.io/) |

---

## Prerequisites

- **Node.js** ≥ 18.0.0 ([download](https://nodejs.org/))
- **pnpm** ≥ 9.0.0

Install pnpm globally if you don't have it:

```bash
npm install -g pnpm
```

> **Note:** You can also use `npm` or `yarn` — just replace `pnpm` with your preferred package manager in the commands below.

---

## Installation

```bash
# 1. Clone the repository (or extract the downloaded ZIP)
git clone <your-repo-url> mathquest-kids
cd mathquest-kids

# 2. Install all dependencies
pnpm install
# or: npm install
# or: yarn install
```

All dependencies are declared in `package.json`. No `.env` file is required for local development.

---

## Running the Development Server

```bash
pnpm dev
# or: npm run dev
# or: yarn dev
```

The app will be available at **http://localhost:3000** (or the next available port if 3000 is in use).

The dev server uses **Vite HMR** — changes to any source file are reflected in the browser instantly without a full reload.

---

## Building for Production

```bash
# Build the client bundle
pnpm build
# or: npm run build

# Preview the production build locally
pnpm preview
# or: npm run preview
```

The production output is written to `dist/`. The `dist/public/` directory contains the static HTML, CSS, and JS files that can be deployed to any static host (Netlify, Vercel, GitHub Pages, S3, etc.).

---

## Folder Structure

```
mathquest-kids/
├── client/
│   ├── index.html                  # HTML entry point (Google Fonts loaded here)
│   ├── public/                     # Static config files only (favicon, robots.txt)
│   └── src/
│       ├── App.tsx                 # Root component: providers + screen router
│       ├── main.tsx                # React DOM entry point
│       ├── index.css               # Global design tokens (Tailwind theme, custom classes)
│       │
│       ├── components/             # Reusable UI components
│       │   ├── ErrorBoundary.tsx   # React error boundary (catches render crashes)
│       │   ├── FloatingDecorations.tsx  # Animated background stars/shapes
│       │   ├── LanguageToggle.tsx  # EN ↔ AR toggle button
│       │   ├── LtrNum.tsx          # Wraps numbers in dir="ltr" for RTL safety
│       │   ├── MascotOwl.tsx       # Ollie the Owl with mood animations
│       │   ├── MathGate.tsx        # Arithmetic challenge modal (parents only)
│       │   └── ui/                 # shadcn/ui primitive components
│       │
│       ├── contexts/
│       │   ├── GameContext.tsx     # Global game state (levels, round, progress, history)
│       │   ├── LanguageContext.tsx # i18n state (language, t(), isRTL, dir)
│       │   └── ThemeContext.tsx    # Light/dark theme provider
│       │
│       ├── hooks/
│       │   ├── useSoundEngine.ts   # Web Audio API sound synthesiser
│       │   ├── useComposition.ts   # IME composition helper
│       │   ├── useMobile.tsx       # Viewport breakpoint hook
│       │   └── usePersistFn.ts     # Stable callback reference helper
│       │
│       ├── i18n/
│       │   └── translations.ts     # Full EN + AR translation dictionaries (160+ keys)
│       │
│       ├── lib/
│       │   ├── mathEngine.ts       # Question generator for all 4 grade levels
│       │   └── utils.ts            # Tailwind class merge utility (cn)
│       │
│       └── pages/
│           ├── HomeScreen.tsx      # Welcome screen with Play + Parents buttons
│           ├── LevelSelectScreen.tsx  # Grade zone cards with sub-level progress
│           ├── GameScreen.tsx      # Active game: HUD, question, answers, feedback
│           ├── SummaryScreen.tsx   # Round-end: star award, score breakdown, confetti
│           └── ParentsScreen.tsx   # Analytics dashboard (math-gated)
│
├── server/
│   └── index.ts                    # Minimal Express server (serves static build in prod)
│
├── shared/
│   └── const.ts                    # Shared constants placeholder
│
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite build configuration
└── README.md                       # This file
```

---

## Architecture Overview

### Screen Navigation

The app uses **context-driven navigation** rather than URL routing. The `GameContext` holds a `screen` field (`"home" | "levels" | "game" | "parents" | "summary"`). `App.tsx` renders the correct page component based on this value, wrapped in a Framer Motion `AnimatePresence` for smooth slide transitions.

```
HomeScreen ──► LevelSelectScreen ──► GameScreen ──► SummaryScreen
     │                                                    │
     └──► ParentsScreen (math-gated)         ◄────────────┘
```

### State Management

All game state lives in `GameContext` (`contexts/GameContext.tsx`), implemented with `useReducer`. The state shape is:

```typescript
{
  screen: ScreenType;
  selectedLevel: GradeZone | null;    // "KG" | "G1" | "G2" | "G3"
  levels: LevelInfo[];                // Unlocked status + star ratings
  subLevelProgress: SubLevelProgress[]; // Per-operation correct/total counts
  answerHistory: AnswerRecord[];      // Full log of every answered question
  round: RoundState;                  // Current round: questions, score, lives, index
  totalPlaySeconds: number;           // Accumulated play time
  totalQuestionsAnswered: number;
  activeSubLevelId: string | null;
}
```

The entire state is **persisted to `localStorage`** on every change and rehydrated on app load. A `resetProgress` action wipes all data.

---

## Localization (i18n)

The app supports **English** and **Arabic** with full RTL layout switching.

### How it works

1. `LanguageContext` stores the current `language` ("en" | "ar") and exposes a `t(key)` translation helper.
2. On language change, `dir` and `lang` attributes are set on `<html>` — this flips the entire document to RTL automatically.
3. The Tajawal font is loaded for Arabic; Fredoka One + Nunito for English.

### Critical: Western Numeral Preservation

All math equations and numeric values are wrapped in the `<LtrNum>` component:

```tsx
import LtrNum from "@/components/LtrNum";

// Renders as: <span dir="ltr" style={{unicodeBidi:"isolate"}}>3 + 5 = ?</span>
<LtrNum>3 + 5 = ?</LtrNum>
```

This prevents the Arabic RTL context from reversing operator order (e.g. `? = 5 + 3`).

### Adding a New Language

1. Open `client/src/i18n/translations.ts`.
2. Add a new `export const fr: Translations = { ... }` object with all 160+ keys translated.
3. Add `"fr"` to the `Language` union type.
4. Update the `translations` record: `export const translations = { en, ar, fr }`.
5. Add a toggle option in `LanguageToggle.tsx`.

---

## Math Engine

The `MathEngine` (`client/src/lib/mathEngine.ts`) is a **pure, stateless utility** — no side effects, no React dependencies. It exports:

| Export | Description |
|---|---|
| `SUB_LEVELS` | Array of all 10 sub-level definitions with metadata |
| `PASS_THRESHOLD` | Number of correct answers required to pass a sub-level (default: 5) |
| `generateQuestionForSubLevel(subLevelId)` | Returns a `Question` object for the given operation |
| `generateRound(gradeZone, subLevelId?)` | Returns an array of 10 `Question` objects for a full round |

### Question Object Shape

```typescript
interface Question {
  id: string;
  type: QuestionType;       // e.g. "addition_easy", "counting", "fraction"
  prompt: string;           // Display text: "What is 3 + 5?"
  choices: AnswerChoice[];  // 4 shuffled choices, exactly 1 with correct: true
  operandA?: number;
  operandB?: number;
  countingAmount?: number;
  countingIcon?: { emoji: string; name: string };
  fractionVisual?: { numerator: number; denominator: number };
  mascotHint?: string;
  category: string;
}
```

---

## Adding a New Grade Level

1. **Define sub-levels** in `SUB_LEVELS` array in `mathEngine.ts`:
   ```typescript
   { id: "g4_algebra", gradeZone: "G4", label: "Algebra Basics", ... }
   ```
2. **Write a generator function** following the existing pattern (e.g. `generateAlgebraQuestion()`).
3. **Add the case** in `generateQuestionForSubLevel()`.
4. **Add the grade zone** to the `GradeZone` type in `GameContext.tsx`.
5. **Add a card** in `LevelSelectScreen.tsx` with the new zone's color and emoji.
6. **Add translations** for the new level name in `translations.ts`.

---

## Design System

The visual identity is **"Sunny Storybook"** — a warm, hand-illustrated picture-book aesthetic.

| Token | Value |
|---|---|
| Primary yellow | `oklch(0.82 0.17 85)` — Sunshine Yellow |
| Primary blue | `oklch(0.58 0.19 250)` — Sky Blue |
| Primary green | `oklch(0.65 0.2 145)` — Meadow Green |
| Primary red | `oklch(0.62 0.22 25)` — Coral Red |
| Dark ink | `oklch(0.18 0.04 270)` — Near-black for borders and text |
| Background | `oklch(0.985 0.025 90)` — Warm cream |
| Display font | Fredoka One (EN) / Tajawal (AR) |
| Body font | Nunito (EN) / Tajawal (AR) |
| Border style | 2.5–3 px solid ink with 3 px offset shadow (storybook ink effect) |
| Border radius | `1.25rem` (buttons), `1.5rem` (cards) |

All design tokens are defined in `client/src/index.css` under `@theme inline` and `:root`.

---

## Known Limitations & Next Steps

| Item | Notes |
|---|---|
| **No user accounts** | Progress is per-browser. Multiple children share one device's progress. |
| **No backend** | Intentional — the app is fully self-contained. Add a backend with `web-db-user` if multi-device sync is needed. |
| **Sound requires user gesture** | Web Audio API requires a user interaction before audio can play. The first button click activates the audio context. |
| **Grade 2 & 3 locked by default** | KG and G1 are unlocked; G2 unlocks after G1 sub-levels are passed; G3 after G2. |
| **Fractions limited to 1/2, 1/3, 1/4** | Extend `generateFractionQuestion()` in `mathEngine.ts` for more fractions. |
| **No timer mode** | A countdown timer for G2/G3 would increase challenge. |
| **No confetti library** | Confetti is CSS/Framer Motion particles. Replace with `canvas-confetti` for richer effects. |
