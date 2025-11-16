# TTRPG Platform MVP

🎲 AI-powered tabletop role-playing game platform with character sheets, dice rolling, and AI Dungeon Master.

**Status**: ✅ MVP Complete - Ready for November 21 Demo

## ⚡ Quick Start (5 Minutes)

### 1. Get Free Groq API Key
Visit [console.groq.com](https://console.groq.com) → Sign up → Create API Key (FREE!)

### 2. Configure Environment
```bash
# Create .env.local
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Run
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**📖 Full Setup Guide**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## Core Features (MVP)

1. **Character Sheet System** - Create and manage D&D 5e characters
2. **Dice Rolling Engine** - Visual dice roller with logging
3. **AI DM Chat** - Play with AI Dungeon Master (Groq/Llama 3.1)

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Supabase (Auth + Database)
- **AI**: Groq API (Free Llama 3.1)
- **State**: Zustand

## Project Structure

```
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── character/       # Character creation/management
│   ├── play/           # Game session interface
│   └── api/            # API routes
├── components/
│   ├── character/      # Character sheet components
│   ├── dice/          # Dice roller components
│   └── chat/          # Chat interface
├── lib/
│   ├── supabase/      # Supabase client and utilities
│   ├── ai/            # AI integration (Groq)
│   └── game/          # Game mechanics and rules
└── types/             # TypeScript types
```

## Development Timeline

- **Day 1-2**: Character Sheet System
- **Day 3-4**: Dice Rolling Engine
- **Day 5-6**: AI DM Integration
- **Day 7**: Polish and deploy

## Deployment

Deploy to Vercel:
```bash
npm run build
vercel deploy
```

---

## ✅ MVP Checklist

### Core Features (COMPLETE)
- [x] Character creation with D&D 5e stats
- [x] Character sheet display (full & compact)
- [x] Character persistence (localStorage)
- [x] All D&D dice types (d4-d100)
- [x] Visual dice roller with animation
- [x] Dice roll history/logging
- [x] Custom dice notation (2d6+3)
- [x] AI Dungeon Master integration (Groq)
- [x] 3 starter campaigns
- [x] Context-aware AI narration
- [x] Chat interface with history
- [x] Dice rolls integrated with AI
- [x] Game session management

### Polish (COMPLETE)
- [x] Responsive design
- [x] Dark theme optimized for TTRPG
- [x] Smooth animations
- [x] Error handling
- [x] Loading states

### Documentation (COMPLETE)
- [x] Setup guide
- [x] API documentation
- [x] Demo walkthrough
- [x] Deployment instructions

**Estimated Demo Time**: 5-7 minutes
**Build Time**: ~7 days (Nov 14-21)
**Budget**: $0-50 for MVP testing

---

## 🎯 Demo Flow

1. Homepage → Show 3 features
2. Create Character → 2 minutes
3. Start Adventure → Select campaign
4. Play Session → 3-4 AI interactions with dice rolls
5. Highlight: Free API, scalable, full-stack

**Total Demo Duration**: 5-7 minutes
