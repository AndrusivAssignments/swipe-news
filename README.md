# Stimme Swipe

A swipe-based news prototype for the **Heilbronner Stimme**, designed for young readers. Stories are condensed to ~60-word summaries; readers swipe right for "more like this", left for "less", or tap to read the full article. The feed personalises itself from those signals.

> Prototype only — built to explore product direction, not production-ready.

---

## Features

- **Swipe deck** with three-card stack, drag gestures, and like / skip feedback
- **Personalised feed** that re-ranks stories by the categories you engage with
- **Heute** — a vertical "story of the day" scroll with snap behaviour
- **Entdecken** — category radar to jump into a topic
- **Meine Liste** — saved articles with an evening-briefing card
- **Mein Profil** — interests, signal counts, and personalisation transparency
- **Intro splash** — short branded splash on app open, followed by onboarding
- **Onboarding** — pick interests to seed the first feed
- Mobile-first layout, framed as a phone on desktop

---

## Tech stack

- **Framework**: [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router) (file-based routing)
- **Runtime**: React 19
- **Build**: Vite 7
- **Styling**: Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com) primitives (Radix under the hood)
- **Motion**: Framer Motion
- **Icons**: lucide-react
- **Language**: TypeScript

---

## Getting started

### Prerequisites

- Node.js 20+ (or Bun, if you prefer)
- npm, pnpm, or bun

### Install

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

The app starts on **http://localhost:8080/**.

### Other scripts

| Command             | Purpose                            |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Start the Vite dev server          |
| `npm run build`     | Production build                   |
| `npm run build:dev` | Build in development mode          |
| `npm run preview`   | Preview the production build       |
| `npm run lint`      | Run ESLint                         |
| `npm run format`    | Format the codebase with Prettier  |

---

## Project structure

```
src/
├── components/
│   ├── ArticleSheet.tsx     # Full-article bottom sheet
│   ├── SavedSheet.tsx       # Saved-list bottom sheet
│   ├── SwipeCard.tsx        # Draggable news card
│   └── ui/                  # shadcn/ui primitives
├── data/
│   └── news.ts              # Mock news items + categories
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities
├── routes/
│   ├── __root.tsx           # App shell
│   ├── index.tsx            # Main screen (splash, tabs, all views)
│   └── README.md            # Routing conventions
├── routeTree.gen.ts         # Auto-generated — do not edit
├── router.tsx               # Router setup
├── start.ts                 # TanStack Start entry
└── styles.css               # Tailwind + design tokens
```

### Key concepts

- **Single-page prototype** — all five tabs (Swipe, Heute, Entdecken, Liste, Profil) live in `src/routes/index.tsx` and switch via local state, not router navigation.
- **Mock data** — articles live in `src/data/news.ts`. Replace with a real API to wire up production content.
- **Personalisation** — the deck and Heute feed re-rank based on liked/skipped categories; logic is in the `useMemo` blocks inside `Index()`.
- **Routing** — TanStack Start uses file-based routes. See `src/routes/README.md` before adding new pages.

---

## Design

- **Brand colour**: Heilbronner Stimme red (`--primary`)
- **Typography**: a display font for headlines, system stack for body
- **Layout**: framed as a phone on `sm+` screens, full-bleed on mobile
- **Motion**: Framer Motion for the swipe deck, view transitions, and the intro splash

The intro splash uses a soft cream background with pastel gradient blobs for a modern, editorial feel; brand red is reserved for small accents inside the app.

---

## Status

This is a **prototype**. It uses mock data, has no backend, no auth, no analytics, and no tests. Use it to evaluate the swipe-driven reading experience, not as a starting point for production code.

---

## License

Internal prototype — not licensed for redistribution.
