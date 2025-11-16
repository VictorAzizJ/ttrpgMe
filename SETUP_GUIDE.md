# TTRPG Platform - Quick Setup Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Get Your Groq API Key (FREE)

1. Go to [https://console.groq.com](https://console.groq.com)
2. Sign up with Google/GitHub (takes 30 seconds)
3. Click "Create API Key"
4. Copy your API key

**Free Tier Limits:** 14,400 requests/day - More than enough for MVP!

### Step 2: Set Up Environment Variables

Create `.env.local` in the project root:

```bash
# Required for AI DM
GROQ_API_KEY=your_groq_api_key_here

# Optional for database (can skip for MVP demo)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

**For MVP Demo**: Only GROQ_API_KEY is required! Character data is stored in browser localStorage.

### Step 3: Install and Run

```bash
# Already installed, but if needed:
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ✅ MVP Features

### 1. Character Sheets ✓
- Create D&D 5e characters
- Ability scores with automatic modifiers
- HP, AC, and core stats
- Persistent storage (localStorage)

**Routes:**
- `/character/new` - Create new character
- `/characters` - View all characters
- `/character/[id]` - View specific character

### 2. Dice Rolling ✓
- All standard D&D dice (d4, d6, d8, d10, d12, d20, d100)
- Visual roller with quick buttons
- Roll history/log
- Custom dice notation (e.g., "2d6+3")

**Routes:**
- `/dice` - Standalone dice roller
- Integrated into `/play` game interface

### 3. AI Dungeon Master ✓
- Free Groq AI (Llama 3.1)
- 3 starter campaigns
- Context-aware narration
- Responds to dice rolls
- Adapts to player actions

**Routes:**
- `/play` - Main game interface

---

## 📁 Project Structure

```
ttrpg-platform/
├── app/
│   ├── page.tsx              # Homepage
│   ├── play/page.tsx         # Main game interface
│   ├── dice/page.tsx         # Standalone dice roller
│   ├── characters/page.tsx   # Character list
│   ├── character/
│   │   ├── new/page.tsx      # Create character
│   │   └── [id]/page.tsx     # View character
│   └── api/
│       └── chat/route.ts     # AI chat endpoint
├── components/
│   ├── character/            # Character components
│   ├── dice/                 # Dice roller components
│   └── chat/                 # Chat interface
├── lib/
│   ├── ai/                   # Groq integration
│   ├── storage.ts            # localStorage utilities
│   └── supabase/             # Database (optional)
└── types/                    # TypeScript types
```

---

## 🎮 Demo Walkthrough

### For Investors/Testing:

1. **Homepage** (`/`)
   - Show 3 core features
   - Navigate to character creation

2. **Create Character** (`/character/new`)
   - Fill in character details
   - Show ability score system
   - Save character

3. **View Character** (`/character/[id]`)
   - Display full character sheet
   - Show calculated stats

4. **Start Adventure** (`/play`)
   - Select campaign
   - Demonstrate AI DM narration
   - Show dice rolling integration
   - Player takes actions, DM responds

5. **Highlight Key Points:**
   - AI adapts to player choices
   - Dice rolls affect story
   - All 3 core features work together seamlessly

---

## 🔧 Troubleshooting

### "GROQ_API_KEY environment variable is not set"
- Make sure you created `.env.local` (not `.env`)
- Restart dev server after adding env variables
- Check the file is in project root

### Edge Runtime Error
If you get edge runtime errors, the API route may need Node.js runtime:
- Edit `app/api/chat/route.ts`
- Remove or change `export const runtime = 'edge'` to `'nodejs'`

### localStorage not persisting
- Check browser console for errors
- Some browsers block localStorage in incognito mode
- Clear browser cache and try again

### AI responses are slow
- Switch to faster model in `lib/ai/groq-client.ts`
- Use `LLAMA_3_1_8B` (instant) instead of `LLAMA_3_1_70B`

---

## 🚢 Deployment (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Add `GROQ_API_KEY` to Environment Variables
4. Deploy!

**Free Tier:** Perfect for MVP demo with decent traffic

---

## 📅 Next Steps (Post-MVP)

### Phase 2 Features:
- [ ] User authentication (Supabase Auth)
- [ ] Multiplayer sessions
- [ ] Save/load multiple game sessions
- [ ] Advanced AI features (image generation for scenes)
- [ ] Voice integration
- [ ] Human DM tools
- [ ] Social features (friends, teams)
- [ ] Payment/membership system

### Database Migration:
When ready to move from localStorage to Supabase:
1. Run `lib/supabase/schema.sql` in Supabase dashboard
2. Add Supabase env variables
3. Update storage functions in `lib/storage.ts`

---

## 💡 Tips for Demo

1. **Pre-create a character** before the demo to save time
2. **Use Quick Roll buttons** to show dice integration
3. **Have a test conversation** ready to show AI quality
4. **Prepare 2-3 key actions** that showcase AI adaptability
5. **Mention free tier** - emphasize low operating costs

---

## 🆘 Support

- Check console for errors (F12 in browser)
- Review API logs in terminal
- Test Groq API key at [console.groq.com](https://console.groq.com)

---

## 🎯 Success Metrics for Demo

- [ ] All 3 core features work without errors
- [ ] Character creation takes < 2 minutes
- [ ] AI responds in < 3 seconds
- [ ] Dice rolls integrate smoothly with AI narration
- [ ] No crashes during 10-minute demo session

**Target**: Impress investors with polished MVP in 5-7 minute walkthrough!
