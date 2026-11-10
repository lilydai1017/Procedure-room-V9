# La Chambre des Procédures

Interactive medical simulation game. **Room 01 — Central access**: ultrasound-guided right internal jugular central venous catheter insertion (Seldinger technique), based on the Merck Manual Professional Edition article *How To Do Internal Jugular Vein Cannulation (Ultrasound-Guided)* (full review September 2026).

The project is plain HTML, CSS and JavaScript. There is **no build step and nothing to install** to play it.

---

## 1. Open and play it on your Mac

### Option A — the simplest (no installation)
1. Unzip `la-chambre-des-procedures.zip` (double-click it in Finder).
2. Open the folder `la-chambre-des-procedures`.
3. Double-click `index.html`. It opens in your default browser.
   Chrome, Safari, Edge and Firefox all work. Use a desktop window; a mouse or trackpad is expected.

You need an internet connection only for the two typefaces (Saira, Spectral). Offline, the game still runs with system fonts.

### Option B — Visual Studio Code (recommended while you edit)
1. Open VS Code → **File → Open Folder…** → choose `la-chambre-des-procedures`.
2. Click the **Extensions** icon (four squares, left bar) → search **Live Server** (by Ritwick Dey) → **Install**.
3. Right-click `index.html` in the file list → **Open with Live Server**.
   The game opens in your browser and **reloads automatically every time you save a file**.

### Option C — Terminal (only if Node.js is installed)
```bash
cd ~/Downloads/la-chambre-des-procedures   # adjust to where you unzipped it
npm start                                   # then open http://localhost:5173
npm run check                               # checks that every file exists and has no syntax error
```
Install Node.js from https://nodejs.org (LTS version) if you want this option.

### What to test after any change
Play from the dark room to the open doorway. In particular:
- the opening bubbles appear one at a time and the monitor beeps;
- you can drag the probe on the neck and see the vein compress when you raise probe pressure;
- the needle step works in short and long axis, and entering the carotid triggers the arterial-puncture recovery;
- the guidewire stops at 4.5 cm (resistance) and causes ectopy beyond 16 cm;
- all three lumens turn green; the chest radiograph accepts a click on the catheter tip, then the lung apex.

If something stops working, open the browser console (Chrome: **View → Developer → JavaScript Console**). The game prints which step failed.

---

## 2. Where things are (and which file to change)

```
index.html                      page shell; loads the CSS and scripts in order
css/
  base.css                      colours (tokens at the top), stage, top bar, accessibility
  dialogue.css                  story bubbles, holographic panels, feedback line, title cards
  workspace.css                 close-up panels, instrument buttons, sliders, equipment tray
js/
  core/utils.js                 small helpers + G (shared game state: tilt, depth, attempts…)
  core/i18n.js                  language switch (LANG)
  core/audio.js                 all sounds (synthesised; no audio files)
  core/rooms.js                 list of installed rooms
  core/workspace.js             close-up workspace, buttons, sliders, hold-to-act, dragging
  environment/room-scene.js     the room illustration (walls, lights, cart, IV pole, monitor, bed, ultrasound machine)
  environment/camera.js         camera views and moves
  patient/patient.js            patient illustration + breathing
  patient/monitor.js            ECG/pleth traces, vital signs, alarms, ectopy
  dialogue/dialogue.js          bubble(), holo(), say(), titleCard(), checklists
  anatomy/anatomy.js            neck/chest close-up and sagittal cutaway drawings, gloved hand
  ultrasound/ultrasound.js      the ultrasound simulator (anatomy, compression, needle/wire/catheter echoes)
  ultrasound/scanning.js        probe placement, orientation check, vein-suitability checks
  equipment/equipment.js        instrument icons, catheter, syringes, needle, guidewire geometry
  main.js                       starts the room
rooms/
  room01/content.js             ALL Room 01 text: bubble prompts + teaching text with Merck section names
  room01/room.js                the ORDER of steps (the state machine)
  room01/steps/00-opening.js    scenes 01–07 (darkness → "Your task")
  room01/steps/01-assessment.js steps 1–4
  room01/steps/02-equipment.js  step 5
  room01/steps/03-sterile.js    steps 6–10
  room01/steps/04-access.js     steps 11–14 (+ arterial puncture recovery)
  room01/steps/05-seldinger.js  steps 15–23
  room01/steps/06-finish.js     steps 24–27
  _template/                    starting point for a new room (not loaded)
scripts/check.js                health check (npm run check)
```

| I want to… | Change only |
|---|---|
| Edit a bubble prompt | `rooms/room01/content.js` → `STRINGS` |
| Edit teaching text or its reference | `rooms/room01/content.js` → `MEDICAL_CONTENT` |
| Change the patient’s vital signs or story text | `rooms/room01/steps/00-opening.js` |
| Reorder, add or remove a step | `rooms/room01/room.js` |
| Change how a procedure step plays | the matching file in `rooms/room01/steps/` |
| Change vessel size, depth, position | `js/ultrasound/ultrasound.js` → `anatomyAt()` |
| Change colours or fonts | `css/base.css` (tokens at the top) |
| Change bubble look | `css/dialogue.css` |
| Change sounds | `js/core/audio.js` |
| Change the room illustration | `js/environment/room-scene.js` |

**Load order matters.** Files share their functions through the page, so `index.html` loads the engine first, then the room. If you add a file, add a `<script src="…">` line in `index.html` above `js/main.js`.

---

## 3. Add a new room
1. Copy `rooms/_template` to `rooms/room02`.
2. In the copied files, keep the `r02_` prefix on every function (avoids name clashes with Room 01).
3. In `index.html`, above `js/main.js`, add:
   ```html
   <script src="rooms/room02/content.js"></script>
   <script src="rooms/room02/steps/00-example.js"></script>
   <script src="rooms/room02/room.js"></script>
   ```
4. Open `index.html?room=room02`. Without `?room=…`, Room 01 starts.

## 4. French
Add a French block to `STRINGS` in `rooms/room01/content.js` (`STRINGS.fr = { b_whats:"Que se passe-t-il ?", … }`, same keys), then set `LANG = "fr"` in `js/core/i18n.js`. Keys missing in French fall back to English. Note: narrative panels and instrument labels inside the step files are still written in English directly; moving them into `STRINGS` is the next localisation task.

## 5. Save to GitHub (no command line)
1. Install **GitHub Desktop** (https://desktop.github.com) and sign in.
2. **File → Add Local Repository…** → choose the project folder → it offers to create a repository → **Create**.
3. **Publish repository** (keep it private if the content is unpublished research).
4. After each change: write a short summary bottom-left → **Commit to main** → **Push origin**.

## 6. Deploy on Vercel
1. Sign in at https://vercel.com with your GitHub account → **Add New… → Project** → import the repository.
2. Framework preset: **Other**. Build command: *leave empty*. Output directory: `.` (the project root).
3. **Deploy**. Every later push to GitHub redeploys automatically.

---

## Medical notes and known simplifications
- Order follows Merck where it differs from the original game brief: maximal barrier precautions precede handling sterile kit (catheter priming happens after gowning and draping); the chlorhexidine disk is placed before suturing.
- Antiseptic drying (≥ 1 min) and arterial-puncture compression (10 min) are time-accelerated and labelled as such.
- Planned catheter depth (15 cm) is a case parameter, not a universal value; verify against your local protocol.
- Port hub colours (proximal white, medial blue, distal brown) vary by manufacturer.
- A thrombosed internal jugular vein is not simulated (it would disqualify the site and end the case); the suitability check relies on full compressibility.
