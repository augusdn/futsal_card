# Quick Start Guide

## 🚀 Get Running in 3 Steps

### 1️⃣ Install
```powershell
npm install
```

### 2️⃣ Setup Templates
```powershell
npm run setup
```

### 3️⃣ Start Server
```powershell
npm start
```

### 4️⃣ Test
Open `test.html` in your browser and create your first card!

---

## 📋 Checklist Progress

Based on `task_checklist.md`:

### ✅ Phase 1 — Project Setup
- [x] Initialize Node.js project
- [x] Install dependencies (express, multer, canvas, sharp)
- [x] Create project folder structure
- [x] Add placeholder templates for bronze/silver/gold
- [ ] Add one bold font for ratings & name *(using Arial for now)*

### ✅ Phase 2 — API Foundation
- [x] Create Express server
- [x] Enable CORS
- [x] Configure multer for photo uploads
- [x] Implement `POST /generate-card` endpoint
- [x] Parse multipart form data correctly

### ✅ Phase 3 — Card Rendering Logic
- [x] Load tier background template
- [x] Create canvas (1080 × 1620)
- [x] Draw background template
- [x] Render player photo (centered, circular cutout)
- [x] Draw overall rating (top-left)
- [x] Draw position (below rating)
- [x] Draw player name (uppercase)
- [x] Draw Skill & Manner stats (bottom)

### ✅ Phase 4 — Output & Response
- [x] Export canvas to PNG
- [x] Save image to `/output`
- [x] Return image URL in response format
- [x] Handle basic errors gracefully

### ⏳ Phase 5 — MVP Polish
- [x] Improve text spacing & alignment
- [x] Ensure readable contrast on all tiers
- [ ] Test with multiple photos *(ready to test)*
- [ ] Verify images look good on mobile screens

### ⏳ Phase 6 — Demo Readiness
- [ ] Generate 5–10 demo cards
- [ ] Add temporary watermark (optional)
- [ ] Prepare screenshots for landing page
- [ ] Share with early users for feedback

---

## 🎯 Ready to Validate!

The MVP is **functional and demo-ready**.

Next step: **Create some sample cards and gather feedback!**

Remember the stop rule:
> If it generates cards, looks good, and is shareable → **STOP BUILDING AND VALIDATE**
