# Farewell '25 — Class Tribute Website

A polished, responsive farewell tribute built with HTML, CSS, and vanilla JavaScript.

---

## Folder Structure

```
farewell/
├── index.html          ← Main page (hero, classmates, gallery)
├── videos.html         ← Video tribute page
├── css/
│   └── style.css       ← All styles + design system (CSS variables)
├── js/
│   └── script.js       ← All JavaScript (modular, commented)
├── images/             ← Drop ALL photos here
│   ├── memories1.jpg   ← Hero scattered photos (memories1–4)
│   ├── memories2.jpg
│   ├── memories3.jpg
│   ├── memories4.jpg
│   ├── muddusir.jpg    ← Classmate portraits (one per person)
│   ├── imran.jpg
│   ├── abdul-nafay.jpg
│   ├── usman.jpg
│   ├── rehman.jpg
│   ├── danial-ahmed.jpg
│   ├── ehtesham.jpg
│   ├── zakkarriya-hashmi.jpg
│   ├── usama.jpg
│   ├── hammad-siddique.jpg
│   ├── ibrahim-zubair.jpg
│   ├── gallery1.jpg    ← Gallery photos (gallery1–9, add more if needed)
│   ├── gallery2.jpg
│   │   ... etc
│   ├── video1-thumb.jpg ← Video poster/thumbnail images
│   ├── video2-thumb.jpg
│   └── ...
├── videos/             ← Drop video files here
│   ├── farewell-reel.mp4
│   ├── year-one.mp4
│   ├── messages.mp4
│   └── last-day.mp4
└── audio/              ← Drop background music here
    └── background.mp3
```

---

## Swapping In Your Content

### 1. Photos
- **Hero cluster** → name files `memories1.jpg` through `memories4.jpg`
- **Classmate portraits** → name files exactly as shown above (lowercase, hyphenated)
- **Gallery** → name files `gallery1.jpg`, `gallery2.jpg`, etc.

All images go in the `/images/` folder. The HTML is already wired up — just drop the files in and they appear automatically.

Best aspect ratios:
- Classmate portraits: tall/portrait (3:4 or 2:3)
- Hero memory photos: any
- Gallery: landscape 4:3 or 3:2

### 2. Videos
Drop `.mp4` files in the `/videos/` folder. The `videos.html` page references:
- `videos/farewell-reel.mp4`
- `videos/year-one.mp4`
- `videos/messages.mp4`
- `videos/last-day.mp4`

To add more videos: duplicate a `<article class="video-entry">` block in `videos.html` and update the `src`, `poster`, title, and description.

### 3. Background Music
Drop your `.mp3` file into `/audio/` and name it `background.mp3`.
To use a different filename, update the `<source src="audio/background.mp3">` line in both `index.html` and `videos.html`.

Update the track name displayed in the floating player by changing the text inside `<span class="audio-title">` in both HTML files.

### 4. Tribute Text
Each classmate card has a `<p class="classmate-tribute">` paragraph. Edit these in `index.html` to write personal messages for each person.

---

## Customizing the Design

All visual decisions live in **CSS variables** at the top of `css/style.css`.

```css
:root {
  --color-olive:  #4a5240;   /* depth, accents, dark surfaces */
  --color-camel:  #c09a6b;   /* warmth, highlights */
  --color-bone:   #f5f0e8;   /* light backgrounds, text on dark */
  --font-heading: 'Big Shoulders Display', sans-serif;
  --font-body:    'Jost', sans-serif;
  /* ... more variables ... */
}
```

Change the hex values to retheme the entire site. The `[data-theme="dark"]` block below controls dark mode.

---

## Features

| Feature | How it works |
|---|---|
| Light / Dark mode | Toggle button in nav; preference saved in `localStorage` |
| Classmates carousel | Prev/next buttons, dot indicators, keyboard arrows, touch swipe, autoplay (pauses on hover) |
| Scroll animations | `IntersectionObserver` — elements fade in as they enter the viewport |
| Background music | Tries autoplay on load; if blocked, starts on first click/tap anywhere |
| Responsive layout | Mobile-first; single column on phones, full layout on desktop |
| Reduced motion | All animations disabled when system preference is set |

---

## Running Locally

Because of browser security (CORS), the site works best when served from a local server rather than opened directly as a file.

**Quickest option — Python:**
```bash
cd farewell
python3 -m http.server 8000
# then open http://localhost:8000
```

**VS Code:** Use the "Live Server" extension (right-click `index.html` → "Open with Live Server").

---

## Browser Support
Chrome, Firefox, Safari, Edge — all modern versions. Audio autoplay behaviour varies by browser; the fallback (start on first interaction) handles this gracefully.
