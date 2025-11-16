# ⚡ QUICKSTART - Get Running NOW

## 1. Get Groq API Key (2 minutes)

1. Open [https://console.groq.com/keys](https://console.groq.com/keys)
2. Sign in with Google/GitHub
3. Click "Create API Key"
4. Copy the key

## 2. Set Environment Variable (30 seconds)

Create a file named `.env.local` in this folder:

```
GROQ_API_KEY=paste_your_key_here
```

## 3. Run (1 minute)

```bash
npm run dev
```

Visit **http://localhost:3000**

---

## First Test

1. Click **"Create Your First Character"**
2. Fill in name: "Test Hero"
3. Leave defaults, click **"Create Character"**
4. Click **"Start Adventure"**
5. Choose any campaign
6. Type: **"I look around"**
7. Watch the AI respond!

**If it works**: You're ready to demo! 🎉

---

## Troubleshooting

### Error: "GROQ_API_KEY is not set"
- Did you create `.env.local` (not `.env`)?
- Is it in the project root folder?
- Restart the dev server after adding it

### Error: "Edge runtime failed"
Edit `app/api/chat/route.ts`, remove line 4: `export const runtime = 'edge';`

### Port already in use
Next.js will auto-use 3001 or 3002. Check terminal output for the actual port.

---

## Demo Prep Checklist

- [ ] Server running without errors
- [ ] Created one test character
- [ ] Started one test adventure
- [ ] Verified AI responds (takes 2-5 seconds)
- [ ] Tested dice roller
- [ ] Practiced 5-minute demo flow

**You're ready for November 21!** 🚀
