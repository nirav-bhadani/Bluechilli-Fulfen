# Fulfen Primary School — Immersive 3D Website
## Master Build Plan (v1)

> Goal: An Awwwards-level scroll-driven 3D journey through a stylized school world.
> Feel: Apple launch polish + Bruno Simon playfulness + primary-school warmth.

---

## 1. Creative Direction

**One-line thesis:** The whole homepage is a single continuous camera flight through a miniature "storybook diorama" of Fulfen — like flying through a child's pop-up book brought to life.

**Signature element:** The Learning Journey path (Pre-School → Year 6) rendered as a glowing ribbon road that the camera physically travels along, with each year group as a tiny diorama island.

**Palette (warm, child-friendly, premium):**
- Sky Dawn `#FDE8C8` — hero sky / warm light
- Meadow `#7FB86A` — grass, nature
- Fulfen Blue `#2B5CAD` — brand anchor (matches school branding)
- Sunbeam `#F6B93B` — accents, glow, CTAs
- Deep Twilight `#141B2E` — opening scene, night-sky sections
- Cloud White `#F8F7F3` — UI panels, text on dark

**Type:**
- Display: `Fraunces` (warm, storybook, characterful serif)
- Body: `Nunito Sans` (rounded, friendly, highly readable)
- UI/labels: `Space Grotesk` (small caps eyebrows, counters)

**Tone of copy:** Written to parents, warm and plain. No corporate jargon.

---

## 2. Tech Stack & Key Decisions

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15, App Router, TypeScript | As specified |
| 3D | React Three Fiber + Drei + Three.js | Declarative scene graph |
| Post FX | `@react-three/postprocessing` | Bloom, DOF, SSAO, God Rays, Vignette |
| Scroll | Lenis + GSAP ScrollTrigger | Smooth scroll drives camera timeline |
| UI motion | Framer Motion | Panels, text reveals, chat UI |
| State | Zustand | Scroll progress, quality tier, chat state |
| AI | OpenRouter (server route, streaming) | Key stays server-side, never in browser |
| Models | Procedural geometry + a few Draco GLBs | No heavy downloads; everything stylized low-poly |
| Icons | React Icons | As specified |

**Important decision — no external 3D asset downloads:** The school, trees, islands, trophies and door are built procedurally (low-poly primitives + custom shaders). This keeps it fast, license-clean, and fully controllable.

---

## 3. Scene-by-Scene Breakdown

### Scene 0 — Opening (scroll 0 → 5%)
- Deep twilight, floating dust particles, logo fades in
- Camera flies forward through volumetric cloud layers (shader planes)
- Sun rises → god rays → school revealed on a green hill
- Headline: **"Welcome to Fulfen Primary School — Where Learning Comes Alive"**
- CTAs: `Book a Visit` (magnetic button) / `Explore` (starts scroll)

### Scene 1 — The School (5 → 20%)
- Stylized low-poly school building, waving grass (instanced + vertex shader wind)
- Butterflies (instanced, sine-wave flight), birds (curved flight paths)
- Children silhouettes walking (simple animated billboards)
- Falling leaves, drifting clouds, moving sun

### Scene 2 — Values Islands (20 → 35%)
- Four floating glowing islands orbiting gently:
  **Love of Learning · Encouraging · Adaptable · Determination**
- Hover → island lifts, glows, glass info card animates in

### Scene 3 — Learning Journey (35 → 55%) ⭐ signature
- Glowing ribbon path: Pre-School → Reception → Y1…Y6
- Camera travels the path; each stop is a mini diorama:
  books, science flasks, art easel, music notes, sports field, tech/robots

### Scene 4 — School Life (55 → 65%)
- Floating holographic photo frames + children's artwork drifting
- Hover → frame enlarges, short story caption appears

### Scene 5 — Community Globe (65 → 75%)
- Stylized glowing globe/map, animated arc lines to community points

### Scene 6 — Achievements (75 → 85%)
- Floating 3D trophies, stars, certificates
- Animated counters (pupils, years, awards) triggered on entry

### Scene 7 — Admissions Door (85 → 100%)
- Giant magical glowing door; approaches → opens with light burst
- Inside: `Arrange a Visit` · `Admissions` · `Prospectus` · `Contact`

### Always-on — AI Assistant
- Floating crystal orb (breathing glow + particle trail), bottom-right
- Opens frosted-glass panel: streaming chat, suggested prompts, markdown,
  typing indicator
- Models: `deepseek/deepseek-v4-flash` (default), `openai/gpt-5.4-mini`
- Server route `/api/chat` → OpenRouter (streaming); system prompt loaded
  with Fulfen knowledge base (values, admissions, term dates, contact)

---

## 4. Architecture / Folder Structure

```
src/
  app/
    layout.tsx, page.tsx, api/chat/route.ts
  components/
    canvas/        # Experience.tsx, CameraRig, Effects, QualityManager
    scenes/        # Opening, School, Values, Journey, Life, Globe,
                   # Achievements, Door
    world/         # Trees, Grass, Butterflies, Birds, Clouds, Leaves,
                   # SchoolBuilding, Island, PathRibbon
    ui/            # Hero overlay, section text, MagneticButton, Loader
    assistant/     # Orb, ChatPanel, Message, useChat
  lib/             # scroll timeline map, quality detection, shaders/
  store/           # useExperienceStore (Zustand)
  content/         # fulfen.ts (all copy + knowledge base in one file)
```

---

## 5. Performance Plan (60fps target)

- **Quality tiers:** auto-detect GPU (drei `<Detect>` / renderer caps + FPS probe)
  - **Full:** all post-fx, ~6k particles
  - **Lite:** no SSAO/DOF, bloom only, ~1k particles, simpler shaders
- Instanced meshes for grass, leaves, butterflies, fireflies
- Single canvas, scenes mounted/unmounted by scroll range
- Dynamic imports for chat panel + heavy scenes
- Compressed textures (KTX2), Draco for any GLBs
- `demand` frameloop off-screen, capped DPR (max 2)
- Mobile: touch scroll drives same timeline; reduced motion respected

---

## 6. Accessibility & SEO

- Full HTML content layer underneath the canvas (screen-reader readable)
- `prefers-reduced-motion` → static hero + normal scroll page
- Semantic headings, meta/OG tags, sitemap; Lighthouse ≥ 90 target

---

## 7. Build Order (milestones)

1. Project scaffold + Lenis/GSAP scroll timeline + camera rig
2. Opening scene + school world (grass, trees, sky, lighting)
3. Post-processing + quality tiers
4. Scenes 2–7 one by one
5. AI assistant (orb + panel + streaming API)
6. Polish pass: micro-interactions, audio-ready hooks, copy
7. Performance + accessibility + Lighthouse audit

---

## 8. Locked Decisions ✅

1. **Images:** School logo ONLY + custom 3D visuals. No photos copied
   from the school website (privacy/safeguarding — real children).
   Photo frames in "School Life" show stylized 3D artwork instead.
2. **Colors:** Extract the exact brand colors from the school logo
   (`https://www.fulfen.staffs.sch.uk/themes/fulfen/img/logo.png`)
   and use them as the primary palette. Blend with the warm palette
   in Section 1 (logo blue replaces `Fulfen Blue #2B5CAD` if different).
3. **Content:** Real information from the live site (see Section 9).
4. **AI Assistant:** User HAS an OpenRouter API key. Wire it via
   `.env.local` → `OPENROUTER_API_KEY=...` — server-side only, never
   exposed to the browser. Include `.env.example` in the project.
5. **Project location:** `D:\B - Fulfen`

---

## 9. Real School Content (use this everywhere + in AI knowledge base)

**School:** Fulfen Primary School
**Headteacher:** Miss Jane Davies
**Address:** Rugeley Road, Burntwood, Staffordshire, WS7 9BJ
**Phone:** 01543 226070
**Email:** office@fulfen.staffs.sch.uk
**Website:** https://www.fulfen.staffs.sch.uk

**Values (the LEAD values — Scene 2 islands):**
- **L**ove of Learning
- **E**ncouraging
- **A**daptable
- **D**etermination

**Headteacher welcome (tone reference):** Warm message welcoming
families, proud of a caring school where every child is valued and
learning comes alive. (Paraphrase warmly — write original copy in
this spirit; do not copy the site text word-for-word.)

**Classes (Scene 3 journey stops):**
Pre-School → Reception → Year 1 → Year 2 → Year 3 → Year 4 →
Year 5 → Year 6

**Curriculum themes for mini-dioramas:**
English/Books · Maths · Science · Art & Design · Music ·
PE/Sports · Computing/Technology · Geography/History

**Awards (Scene 6 — floating trophies):**
- Dyslexia Friendly School
- Healthy Schools
- International School Award
- Primary Science Quality Mark (PSQM)

**Admissions door links (Scene 7):**
Arrange a Visit · Admissions · Prospectus · Contact
(link to the matching pages on the live school site)

**AI Assistant knowledge base:** all of the above + term dates,
uniform, school day times, clubs — store in `src/content/fulfen.ts`
so the school can easily edit one file.

---

## 10. Step-by-Step Build Instructions

**Step 1 — Setup**
`npx create-next-app@latest` (TypeScript, Tailwind, App Router) in
`D:\B - Fulfen`. Install: three, @react-three/fiber, @react-three/drei,
@react-three/postprocessing, gsap, @studio-freight/lenis, framer-motion,
zustand, react-icons, react-use, react-markdown.

**Step 2 — Foundation**
Lenis smooth scroll + GSAP ScrollTrigger timeline → drives one shared
`scrollProgress` value in Zustand → camera rig reads it.

**Step 3 — World**
Build Scene 0 + 1 (opening flight, school, grass wind shader,
butterflies, birds, clouds, leaves — all instanced).

**Step 4 — Post FX + Quality tiers**
Bloom, God Rays, DOF, SSAO, vignette. Auto Lite Mode on weak devices
(GPU detect + FPS probe): bloom only, fewer particles.

**Step 5 — Scenes 2–7** in order (islands → journey path → school life
→ globe → achievements → admissions door).

**Step 6 — AI Assistant**
Crystal orb + glass chat panel. `/api/chat` route → OpenRouter,
streaming. Models: `deepseek/deepseek-v4-flash` (default),
`openai/gpt-5.4-mini` (switchable). Suggested prompts, markdown,
typing animation.

**Step 7 — Polish & audit**
Magnetic buttons, hover ripples, mouse parallax, reduced-motion
fallback, SEO meta, Lighthouse ≥ 90, test on mobile.
