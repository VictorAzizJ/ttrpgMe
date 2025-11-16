# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Choose a database password (save it securely)
4. Wait for the project to be provisioned (~2 minutes)

## 2. Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 4. Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the contents of `lib/supabase/schema.sql`
4. Click **Run** to execute the schema

This will create:
- `characters` table
- `game_sessions` table
- `dice_rolls` table
- Row Level Security policies
- Necessary indexes and triggers

## 5. Enable Authentication (Optional for MVP)

For the MVP, we can skip authentication and use anonymous sessions. To enable proper auth later:

1. Go to **Authentication** → **Providers**
2. Enable Email/Password authentication
3. Configure email templates if needed

## 6. Verify Setup

Run this SQL query to verify tables were created:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

You should see: `characters`, `game_sessions`, `dice_rolls`

## Quick Start (No Auth Version)

For the demo, we can bypass authentication:
- Store character data in localStorage
- Use Supabase only for future features
- This allows faster development for the Nov 21 deadline

To enable this, we'll use a hybrid approach where localStorage is the primary storage for MVP.
