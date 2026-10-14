# My personal website

## Run it (pick one)
1. **VS Code Live Server (easiest):** install the "Live Server" extension, right-click `index.html` -> "Open with Live Server".
2. **Node:** in the VS Code terminal run `node server.js`, then open http://localhost:3000
3. **Python:** `python -m http.server 3000`, then open http://localhost:3000

## Edit it
- **All text, links, image file names, skills, soft skills:** `data.js`
- **Look (colours, fonts, sizes):** `style.css`
- **Space background (star density, zoom size/strength, glow, shooting stars):** the `SPACE` block near the bottom of `script.js`
- **Images:** drop them in `images/` using the file names listed in `data.js`

## What is in `images/`
- `JHE_Pic.jpg` - About page background (the only page that uses a photo)
- `Profile.jpg`, `logo_master.jpg`, `SentryRobot.jpg` - your own images
- `icons/` - skill icons shown on the Skills page (python, cpp, java, html, sql, autocad,
  inventor, solidworks, github, linux). To use an official logo, replace the file keeping the same name.
  `icons/trophy.svg` is shown on the Awards page until you add a real photo for an award.

## Skills page
- Top half: the icons scroll left -> right in a loop. Edit the `TOOLS` list in `data.js`.
- Bottom half: soft skills. Hovering one lists the experiences that use it. The list is built
  automatically from the "skills" of each experience in `EXPERIENCES`; edit `SOFT_SKILLS` to change the matching.
