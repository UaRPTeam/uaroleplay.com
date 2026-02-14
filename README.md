# UaRP

UaRP is a Ukrainian-language platform for text role-playing communities.
The project helps players discover active role-play groups, find co-players, and learn through practical guides.

## Project Vision

UaRP aims to grow and support the Ukrainian text role-play space by providing:

- a clear entry point for newcomers,
- a searchable catalog of active role-play groups,
- educational content and practical advice for both beginners and experienced players.

## What the Platform Contains

### 1. Catalog Experience
The Catalog page introduces the core idea of text role-playing and explains how the platform works.
It describes text role-play as collaborative storytelling with improvisation, where each participant writes actions, dialogue, and character thoughts.

### 2. Role-Play Group Catalog
UaRP is building a structured catalog of active Ukrainian-language role-play groups.
The planned direction includes filtering by genre, tone, platform, and age limits.

### 3. Guides and Articles
The platform includes a posts section with tips, guides, and community-driven materials.
Its goal is to make onboarding easier and share real experience from organizers and players.

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Content/Data:** Sanity CMS + GROQ
- **Language:** TypeScript

## Repository Structure

- `frontend/` — Next.js user-facing website
- `studio/` — Sanity Studio for content management

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Sanity Studio

```bash
cd studio
npm install
npm run dev
```

## Notes

- This repository also includes `LICENSE.txt` and `SECURITY.md`.
- Brand/media assets (including hero and catalog section images) are stored in the frontend public assets.
