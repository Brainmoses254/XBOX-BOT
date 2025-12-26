
<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=speech&height=200&color=gradient&text=WE'LL%20COME%20🥳&animation=blinking&fontAlign=36&fontAlignY=36&descAlign=62&reversal=false&textBg=false" width="100%">
</div>

<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Black+Ops+One&size=70&pause=500&color=00FF00&center=true&width=1150&height=200&lines=PLEASE-FORK-STAR-BOT-REPO" alt="Typing SVG" /></a>
  </div>
<a><img src='https://files.catbox.moe/8iqspb.jpg'/></a>
# WhatsApp Pairing Bot — virus

# WhatsApp Bot (Baileys) — Background Image & Song

This repository is a minimal WhatsApp bot scaffold using Baileys. It supports simple text commands:

- `!help` — show commands
- `!background` — bot sends the configured background image
- `!song` — bot sends the configured song (MP3)

Setup
1. Add your files:
   - Place your background image at `assets/background.jpg`
   - Place your song at `assets/song.mp3`

2. Install dependencies:
```bash
npm install
```

3. Start the bot:
```bash
npm start
```

4. On first run the terminal will display a QR code — scan it with WhatsApp (Settings > Linked devices > Link a device) to authenticate.

Notes
- The bot stores its session in `auth_info.json` (ignored by .gitignore).
- To run on Heroku, push this repository and use `app.json` as a manifest. Ensure `SESSION_FILE` env var and persistent storage for sessions (Heroku ephemeral filesystem will lose auth on dyno restart).

Files
- `index.js` — entrypoint and Baileys connection
- `inbox.js` — message handling (commands)
- `Setting.js` — settings loader/saver (stores defaults in `settings.json`)
- `assets/` — place your `background.jpg` and `song.mp3` here