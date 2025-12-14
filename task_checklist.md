
---

# ✅ TASK CHECKLIST (FOR AI OR YOU)

## Phase 1 — Project Setup
- [x] Initialize Node.js project
- [x] Install dependencies (express, multer, canvas, sharp)
- [x] Create project folder structure
- [x] Add placeholder templates for bronze/silver/gold
- [ ] Add one bold font for ratings & name *(using Arial, custom fonts optional)*

---

## Phase 2 — API Foundation
- [x] Create Express server
- [x] Enable CORS
- [x] Configure multer for photo uploads
- [x] Implement `POST /generate-card` endpoint
- [x] Parse multipart form data correctly

---

## Phase 3 — Card Rendering Logic
- [x] Load tier background template
- [x] Create canvas (1080 × 1620)
- [x] Draw background template
- [x] Render player photo:
  - Centered
  - Cropped / masked (circle or soft rectangle)
- [x] Draw overall rating (top-left)
- [x] Draw position (top-right)
- [x] Draw player name (uppercase)
- [x] Draw Skill & Manner stats (bottom)

---

## Phase 4 — Output & Response
- [x] Export canvas to PNG
- [x] Save image to `/output`
- [x] Return image URL or buffer
- [x] Handle basic errors gracefully

---

## Phase 5 — MVP Polish
- [x] Improve text spacing & alignment
- [x] Ensure readable contrast on all tiers
- [ ] Test with multiple photos
- [ ] Verify images look good on mobile screens

---

## Phase 6 — Demo Readiness
- [ ] Generate 5–10 demo cards
- [ ] Add temporary watermark (optional)
- [ ] Prepare screenshots for landing page
- [ ] Share with early users for feedback

---

## 🚦 Stop Rule
If it:
- Generates cards
- Looks good
- Is shareable

👉 **STOP BUILDING AND VALIDATE**

---

## FINAL NOTE (IMPORTANT)
Do not over-engineer this.

This MVP exists to answer **one question only**:

> “Do people want to generate and share cards like this?”

Everything else comes later.
