# Halo.bio

Circadian rhythm tracking & nutrition optimization webapp built with Next.js 16, React 19, and Tailwind CSS 4.

## Stack

- **Frontend**: Next.js 16 (Turbopack), React 19, Tailwind CSS 4
- **Database**: SQLite (better-sqlite3) - local-first
- **Auth**: Session-based (local)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI**: Optional Gemini API for Pantry Vision

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

### Core
- Sign in with username (local session)
- Dashboard with temporal state & circadian guide
- Sleep logging with quality tracking
- Light exposure logging
- Bio-metrics dashboard

### Food & Nutrition (/food)
- **Meal Recommendations**: Dynamic based on your sleep/circadian data
- **Pantry Vision**: Upload/capture ingredients, AI suggests recipes
- **Nearby Healthy**: Find healthy restaurants near you
- **Diet Preferences**: keto, vegan, paleo, balanced

### Voice Assistant
- "Talk to Aura" button - ask meal/sleep advice

### Settings (/settings)
- Profile, sleep schedule, goals
- Notifications toggles
- Data export

## Optional API Keys

For enhanced features, copy `.env.example` to `.env.local` and add:

```bash
# Gemini API - for AI Pantry Vision
# Get free key: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_key_here

# Google Maps API - for real nearby restaurant data
# Get free key: https://console.cloud.google.com/google/maps-apis
GOOGLE_MAPS_API_KEY=your_key_here
```

Without API keys, the app uses mock/demonstration data.

## Build

```bash
npm run build
```