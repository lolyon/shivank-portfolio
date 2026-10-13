# My personal website

## Run it (pick one)
1. **VS Code Live Server (easiest):** install the "Live Server" extension, right-click `index.html` -> "Open with Live Server".
2. **Node:** in the VS Code terminal run `node server.js`, then open http://localhost:3000
3. **Python:** `python -m http.server 3000`, then open http://localhost:3000

## Edit it
- **All text, links, image file names:** `data.js`
- **Look (colours, dimness of backgrounds, fonts, sizes):** `style.css` (see the variables at the top, `--dim` controls how dark the backgrounds are)
- **Images:** drop them in `images/` using the file names listed in `data.js` (profile.jpg, bg-hero.jpg, ...)

Missing images show a coloured placeholder, so the site always works while you fill it in.
