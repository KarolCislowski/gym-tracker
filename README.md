# Gym Tracker

## Case Study

This project came from a very specific need.

I needed software that combines three things that rarely appear together:

- fast, low-friction data entry on mobile,
- enough flexibility to model training sessions in whatever structure I actually use,
- and enough awareness of the many variables that affect training and progress to let me study their impact over time.

In practice, that meant building a tool that could be, at the same time:

- a lightweight daily logging system,
- a flexible workout logger,
- a place to organize hypotheses,
- and a foundation for creating different personal “cases” to examine how specific factors influence progress.

So this was never meant to be just another app for checking off sets. The goal was to build a system that helps answer questions like:

- does better sleep actually improve my recovery and training quality,
- does a certain macro split lead to more stable body weight and better energy,
- does a given supplement stack change anything meaningful,
- does higher volume for a muscle group drive progress or only increase fatigue,
- which combination of habits, training, and recovery works best for me in practice.

## The Problem This Project Solves

Most fitness tools handle only one slice of the problem well:

- some are strong at workout logging but ignore day-to-day context,
- some are good at tracking habits but do not support more complex training structures,
- some show a few charts but do not produce data clean enough for your own analysis.

This project started from a different assumption:

1. the phone should primarily be used for fast data capture,
2. the larger screen should primarily be used for exploration, comparison, and analysis,
3. the data should be structured enough to support personal interpretation rather than just passive archiving.

## Product Approach

### 1. Mobile-first for input

The most important actions need to be fast:

- add a daily report,
- log a workout,
- record supplementation,
- correct the latest entry.

That is why the mobile experience is intentionally simpler. It does not try to behave like a full analytical workstation.

### 2. Desktop-first for analysis

Trend analysis, charts, comparisons, and large tables naturally need more space. The app therefore separates:

- `mobile = input + quick status`
- `desktop = exploration + deep analysis`

### 3. A flexible workout model

Workouts are not forced into one flat list of exercises. The model supports:

- blocks,
- single exercises,
- supersets,
- circuits,
- dropsets,
- sets with different trackable metrics.

That matters because real training rarely looks like a perfectly uniform template.

### 4. Data as material for observation, not just storage

The app does not store only the completed workout. It also captures surrounding context:

- sleep,
- steps,
- hydration,
- macros,
- wellbeing,
- body weight,
- resting heart rate,
- supplementation.

That makes it possible to build a more meaningful picture of progress than a single load or body-weight chart ever could.

## What Is Inside

The system currently consists of several major areas:

- `auth` – sign in, registration, password reset, authenticated user snapshot,
- `profile` – personal context needed to interpret results,
- `healthy-habits` – goals for sleep, steps, hydration, macros, and activity,
- `daily-reports` – daily check-ins with execution and wellbeing,
- `workouts` – templates and logged workout sessions,
- `supplementation` – stacks and supplementation history,
- `dashboard` – context, summaries, and analytics,
- `exercises` and `supplements` – reference atlases,
- `onboarding` – guided introductions to key screens.

Each of these areas is documented further in its own `README.md` under `features/*`.

## Current Stage

This is a deliberately shaped MVP. Its goal is not to “cover everything,” but to provide a strong foundation for:

- consistent data collection,
- building a real training history,
- testing different approaches,
- and observing how recovery, nutrition, supplementation, and training interact over time.

Already implemented:

- structured workout reports and workout templates,
- daily reporting,
- healthy habit goals,
- supplementation logging and supplement stacks,
- a dashboard with lighter mobile UX and deeper analysis on larger screens,
- onboarding,
- clear feedback for save, edit, and delete operations,
- basic protection against accidental loss of unsaved changes.

## Tech Stack

- Next.js
- React
- TypeScript
- Material UI
- MongoDB
- Vitest
- Cypress

## Running Locally

Install dependencies:

```bash
npm install
```

This repository also includes a `docker-compose.yml` file with a local MongoDB service.
If you want to run the database in Docker, start it with:

```bash
docker compose up -d
```

Start the development server:

```bash
npm run dev
```

By default, the app will be available at:

```text
http://localhost:3000
```

## Seeding Local Data

If you want a usable local dataset instead of an empty app, seed the reference atlases first:

```bash
npm run db:seed:atlas
npm run db:seed:supplements
```

These scripts use:

```text
example.env.local
```

If you also want a ready-to-use demo account with sample tenant data, create your local environment file and then run:

```bash
npm run db:seed:demo-user
```

This script uses:

```text
.env.local
```

The demo-user seed populates sample data such as:

- profile and settings,
- healthy habits,
- daily reports,
- workout reports.

Seeded demo account credentials:

```text
Email: user@test.com
Password: pass1234
```

## Useful Commands

```bash
npx tsc --noEmit
npm test
npm run build
```

An example environment file is available here:

```text
example.env.local
```

## Why This Project Matters

In short, this is not a “training app” in the narrow sense. It is a tool for structuring and interpreting an ongoing process.

If training, recovery, nutrition, and supplementation influence one another, then it makes sense to use a system that does not artificially separate them, but instead allows them to be observed as one connected whole.

That is what this project is trying to provide.
