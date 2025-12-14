# FUT-Style Player Card Generator (MVP)

This project is a **minimal player card generator service** inspired by FUT-style sports cards.

The goal is to **quickly validate market demand** by generating visually appealing, share-worthy player cards using custom inputs and user photos.

This is a **demo-only MVP**, not a full application.

---

## 🚀 Quick Start

```powershell
# 1. Install dependencies
npm install

# 2. Generate card templates
npm run setup

# 3. Start the server
npm start
```

Then open `test.html` in your browser to create cards!

📖 **Full setup guide:** See [SETUP.md](SETUP.md)  
⚖️ **Legal notice:** See [LEGAL.md](LEGAL.md)

---

## 🎯 Goal

- Generate **PNG player cards** on demand
- Accept custom values (name, ratings, tier, photo)
- Output a **FUT-inspired collectible card**
- Enable fast demos, landing pages, and user testing

---

## 🚫 Out of Scope

- No authentication
- No user accounts
- No database
- No matchmaking or rating logic
- No payments
- No official FIFA / EA branding

---

## 🧱 Tech Stack

- **Node.js**
- **Express**
- **node-canvas** (text & layout rendering)
- **sharp** (optional image resizing)
- **multer** (file uploads)

---

## 🖼 Card Design Requirements

- Card size: **1080 × 1620**
- Rounded corners
- Tier-based background:
  - `bronze`
  - `silver`
  - `gold`
- Visual hierarchy:
  - Large rating (top-left)
  - Position (top-right)
  - Player photo (center, cutout style)
  - Player name (uppercase)
  - Stats at bottom (Skill / Manner)
- Country displayed as **flag icon** (future enhancement)

Design inspiration:
> FIFA Ultimate Team cards (visual inspiration only)

---

## 📥 API Endpoint

### `POST /generate-card`

**Request**
- Content-Type: `multipart/form-data`
- Fields:
  - `photo` (file)
  - `name` (string)
  - `tier` (`bronze | silver | gold`)
  - `position` (string)
  - `country` (ISO code, e.g. PT)
  - `overall` (number)
  - `skill` (number)
  - `manner` (number)

**Example Response:**
```json
{
  "success": true,
  "imageUrl": "/output/1690000000000_John_Doe.png",
  "downloadUrl": "http://localhost:3000/output/1690000000000_John_Doe.png",
  "filename": "1690000000000_John_Doe.png"
}
```

---

## 📂 Project Structure

```
futsal/
├── server.js              # Express API server
├── cardGenerator.js       # Canvas-based card generation
├── generateTemplates.js   # Creates bronze/silver/gold templates
├── test.html             # Web testing interface
├── templates/            # Generated card backgrounds
├── uploads/              # Temporary photo storage
└── output/               # Generated cards
```

---

## ✅ Success Criteria

- Upload photo + values → Get downloadable PNG
- Card is good enough to share on social media
- Ready for landing page demos
- Can validate user demand

---

## 🔮 Future Enhancements

- Auto face detection & better cutouts
- Preset rating tiers
- Flag icon rendering
- Custom fonts
- Watermark / branding
- Public card gallery
- Paid high-resolution export

---

## ⚠️ Legal Note

This project uses **generic "Player Card"** terminology only.

**NO use of:** FIFA, EA Sports, or Ultimate Team branding.

See [LEGAL.md](LEGAL.md) for details.
