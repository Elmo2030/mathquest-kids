# MathQuest Kids — Design Brainstorm

## Three Stylistic Approaches

### 1. Candy Kingdom
Saturated pastel-candy colors, bubbly rounded shapes, and a sugary-sweet aesthetic inspired by mobile match-3 games. Every element feels soft, bouncy, and edible.
**Probability:** 0.07

### 2. Cosmic Explorer
Deep-space dark background with neon star clusters, floating planets, and a sense of galactic adventure. Kids are astronaut-mathematicians solving equations to fuel their rocket.
**Probability:** 0.04

### 3. Sunny Storybook ✅ CHOSEN
Warm, hand-illustrated storybook feel — thick ink outlines, textured paper-like backgrounds, and chunky primary-color fills. Inspired by classic children's picture books. Feels familiar, safe, and joyful.
**Probability:** 0.09

---

## Chosen Direction: Sunny Storybook

### Design Movement
Neo-Naive / Children's Picture Book Illustration — bold outlines, flat fills with subtle texture, deliberate imperfection.

### Core Principles
1. **Bold & Chunky**: Everything is oversized — buttons, text, icons. Nothing is delicate or thin.
2. **Warm & Inviting**: A warm cream/yellow background base that feels like paper, not a cold white screen.
3. **Tactile Depth**: Thick drop shadows (offset, not blurred) give buttons and cards a "press-able" physical feel.
4. **Joyful Contrast**: Bright primary colors (sky blue, sunshine yellow, grass green, coral red) pop against the warm background.

### Color Philosophy
- **Background**: Warm cream `#FFFBEF` — feels like aged paper, not clinical white
- **Primary Blue**: `#3B82F6` → sky blue for primary actions
- **Sunshine Yellow**: `#FBBF24` → energy, warmth, highlights
- **Grass Green**: `#22C55E` → success, correct answers
- **Coral Red**: `#EF4444` → wrong answers, alerts
- **Deep Ink**: `#1E1B4B` → outlines, text, borders
- **Signature Brand Color**: `#FBBF24` (Sunshine Yellow)

### Layout Paradigm
Asymmetric stacked cards with a floating mascot character. Screens are divided into distinct "zones" (top HUD, center content, bottom actions) rather than a uniform grid. Decorative floating shapes (stars, dots, clouds) fill negative space.

### Signature Elements
1. **Thick Ink Border**: 3px solid `#1E1B4B` on all cards and buttons, with a 4px offset shadow in the same color
2. **Bouncy Stars**: Animated star decorations scattered in the background
3. **Chunky Rounded Corners**: `border-radius: 20px` minimum on all interactive elements

### Interaction Philosophy
Every tap/click should feel physical and satisfying. Buttons press down (scale + shadow collapse). Correct answers burst with confetti. Wrong answers shake gently. The mascot reacts emotionally to game events.

### Animation
- Button press: `scale(0.95)` + shadow shrinks, 120ms ease-out
- Screen transitions: slide-in from right, 250ms ease-out
- Mascot idle: gentle float up/down, 3s infinite
- Correct answer: scale burst to 1.15 then back, green flash, 300ms
- Wrong answer: horizontal shake, 200ms
- Stars in background: slow rotation + drift, 8-12s infinite

### Typography System
- **Display / Headlines**: `Fredoka One` — round, friendly, bold. Used for titles, question text, score.
- **Body / Labels**: `Nunito` — rounded sans-serif, highly readable for children. Used for instructions, button labels.
- **Hierarchy**: Display 48-64px, H1 36px, H2 28px, Body 18px, Button 20px bold

### Brand Essence
MathQuest Kids — a storybook adventure that makes math feel like play, for ages 4–9.
**Personality**: Joyful · Encouraging · Adventurous

### Brand Voice
Headlines sound like a friendly teacher cheering you on. CTAs are action-packed and exciting.
- Example headline: "Ready to become a Math Hero?"
- Example CTA: "Let's Go! 🚀" / "Pick Your Quest!"

### Wordmark & Logo
A chunky star with a graduation cap, rendered as a bold graphic symbol. No text in the logo itself — the star IS the brand mark.

### Signature Brand Color
`#FBBF24` — Sunshine Yellow. Unmistakably MathQuest.
