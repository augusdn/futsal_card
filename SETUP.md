# Getting Started

Follow these steps to run the FUT-Style Player Card Generator:

## 1. Install Dependencies

```powershell
npm install
```

This will install:
- `express` - Web server framework
- `multer` - File upload handling
- `canvas` - Image generation library
- `sharp` - Image processing

## 2. Generate Card Templates

**IMPORTANT:** Run this before starting the server for the first time:

```powershell
npm run setup
```

This creates the bronze, silver, and gold card templates in the `templates/` folder.

## 3. Start the Server

```powershell
npm start
```

The server will start on `http://localhost:3000`

## 3. Test the API

### Option A: Use the Web Interface

Open `test.html` in your browser (or visit it via a local server):

```powershell
start test.html
```

Fill in the form and upload a player photo to generate your card.

### Option B: Use cURL

```powershell
curl -X POST http://localhost:3000/generate-card `
  -F "photo=@path/to/your/photo.jpg" `
  -F "name=John Doe" `
  -F "tier=gold" `
  -F "position=ST" `
  -F "country=PT" `
  -F "overall=92" `
  -F "skill=95" `
  -F "manner=88"
```

### Option C: Use Postman

1. Create a new POST request to `http://localhost:3000/generate-card`
2. Set Body type to `form-data`
3. Add the following fields:
   - `photo` (file) - Select an image file
   - `name` (text) - e.g., "John Doe"
   - `tier` (text) - "bronze", "silver", or "gold"
   - `position` (text) - e.g., "ST"
   - `country` (text) - e.g., "PT"
   - `overall` (text) - e.g., "92"
   - `skill` (text) - e.g., "95"
   - `manner` (text) - e.g., "88"

## 4. View Generated Cards

Generated cards are saved in the `output/` directory and can be accessed via:
- Direct URL: `http://localhost:3000/output/card-[timestamp].png`
- The API response includes the download URL

## API Reference

### POST /generate-card

**Content-Type:** `multipart/form-data`

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| photo | file | Yes | Player photo (jpeg, jpg, or png) |
| name | string | Yes | Player name |
| tier | string | Yes | Card tier: "bronze", "silver", or "gold" |
| position | string | Yes | Player position (e.g., "ST", "GK") |
| country | string | No | ISO country code (default: "XX") |
| overall | number | Yes | Overall rating (1-99) |
| skill | number | Yes | Skill rating (1-99) |
| manner | number | Yes | Manner rating (1-99) |

**Response:**
```json
{
  "success": true,
  "imageUrl": "/output/1690000000000_John_Doe.png",
  "downloadUrl": "http://localhost:3000/output/1690000000000_John_Doe.png",
  "filename": "1690000000000_John_Doe.png"
}
```

## Troubleshooting

### Canvas Installation Issues (Windows)

If you encounter errors installing `canvas` on Windows:

1. Install Windows Build Tools:
```powershell
npm install --global windows-build-tools
```

2. Or use a pre-built version:
```powershell
npm install canvas --build-from-source=false
```

### Port Already in Use

If port 3000 is already in use, set a different port:

```powershell
$env:PORT=3001; npm start
```

## Project Structure

```
futsal/
├── server.js              # Express server & API endpoints
├── cardGenerator.js       # Card generation logic
├── generateTemplates.js   # Template generator script
├── package.json           # Dependencies
├── test.html             # Web testing interface
├── templates/            # Card background templates
│   ├── bronze.png
│   ├── silver.png
│   └── gold.png
├── fonts/                # Custom fonts (future)
├── uploads/              # Temporary photo storage
├── output/               # Generated cards
├── SETUP.md              # Setup guide
├── LEGAL.md              # Legal notice
└── README.md             # Project documentation
```

## Next Steps

This is a minimal MVP for testing. Future enhancements could include:

### Phase 2 Features
- **Auto face detection** - Better photo cropping and centering
- **Preset rating tiers** - Quick selection for common player types
- **Flag icon rendering** - Display country flags instead of codes
- **Custom fonts** - Better typography with FUT-style fonts
- **Watermark/branding** - Add your brand to cards

### Phase 3 Features  
- **Public card gallery** - Showcase best cards
- **Social sharing** - One-click share to WhatsApp/Instagram
- **Paid high-res export** - Premium quality downloads
- **Card collections** - Save and organize multiple cards
- **Team branding** - Custom team logos and colors

### Success Criteria ✅

Upload a photo + custom values → Receive a downloadable PNG card

**Card should be good enough to:**
- ✅ Share on WhatsApp / Instagram  
- ✅ Place on a landing page  
- ✅ Demo to early users

---

## ⚠️ Important Legal Note

See `LEGAL.md` for important information about:
- Trademark usage
- Copyright compliance  
- Commercial use guidelines

**Remember:** This uses generic "Player Card" / "Skill Card" terminology only.  
No FIFA, EA Sports, or Ultimate Team branding is used.
