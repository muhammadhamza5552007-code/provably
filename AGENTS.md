\# Provably



\## What this is

A mobile app (React Native + Expo) that checks whether a developer actually understands AI-generated code, not just accepted it. Users paste code, the app generates one comprehension question via Claude API, grades the answer, and tracks a running "Ownership Score" over time.



\## Stack

\- Frontend: React Native (Expo), TypeScript

\- Backend: Supabase (Postgres + Auth + Edge Functions)

\- AI: Claude API (Sonnet), never called directly from the app



\## Conventions

\- Keep functions small and readable — this project is a beginner's learning tool, prioritize clarity over cleverness

\- Always explain non-obvious code with a short comment

\- Never put API keys or secrets in frontend code — only in Supabase Edge Function secrets

\- MVP scope only for now: paste-code screen, question generation, answer grading, running score. No dashboards, streaks, or sharing yet.

