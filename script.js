/* Builds the page from data.js — you normally don't need to edit this file. */

const $ = (sel) => document.querySelector(sel);
const imgStyle = (src) => `background-image: url('${src}'), var(--ph)`;   // placeholder shows if the file is missing

/* ---------- Fill the static parts ---------- */
document.title = `${SITE.name} | Portfolio`;
$("#navName").textContent = SITE.name;
$("#heroName").textContent = SITE.name;
$("#heroTagline").textContent = SITE.tagline + " ";
$("#uniName").textContent = SITE.school;
$("#uniLink").href = SITE.schoolUrl;
$("#uniTip").textContent = SITE.schoolTip + " ↗";
$("#heroIntro").textContent = SITE.intro;
$("#profilePic").style.cssText = imgStyle(SITE.profileImage);
$("#thanksTitle").textContent = SITE.thanks.title;
$("#thanksText").textContent = SITE.thanks.text;
$("#interests").innerHTML = (SITE.interests || []).map((t) => `<li>${t}</li>`).join("");

/* ---------- Photography page ---------- */
$("#photoLead").textContent = PHOTOGRAPHY.lead;
$("#photoText").innerHTML = PHOTOGRAPHY.paragraphs.map((p) => `<p>${p}</p>`).join("");
$("#photoFacts").innerHTML = PHOTOGRAPHY.facts.map((f) => `<div><dt>${f.label}</dt><dd>${f.value}</dd></div>`).join("");
$("#photoLink").href = PHOTOGRAPHY.url;
$("#photoTiles").innerHTML = PHOTOGRAPHY.tiles.map((t) => `
  <a class="tile" href="${PHOTOGRAPHY.url}" target="_blank" rel="noopener" aria-label="${t.label} - open my photography website">
    <div class="tile-img" style="${imgStyle(t.src)}"></div><span class="tile-label">${t.label}</span>
  </a>`).join("");

// Backgrounds
document.querySelectorAll("[data-bg]").forEach((sec) => {
  const file = SITE.backgrounds[sec.dataset.bg];
  if (file) {
    sec.querySelector(".bg").style.setProperty("--bg-img", `url('${file}')`);
    sec.classList.add("has-photo");                  // lets style.css show this page's photo instead of the space canvas
  }
});

/* ---------- Page 2: current ---------- */
$("#currentList").innerHTML = SITE.current.map((c, i) => {
  let title = c.title;
  if (c.club21 && title.includes(c.club21)) {           // e.g. "Mac RoboMaster" becomes a link to the official page
    const link = `<a class="uni" href="${c.club21Url}" target="_blank" rel="noopener">${c.club21}<span class="tip">${c.clubTip21 || "Visit the official page"} ↗</span></a>`;
    title = title.replace(c.club21, link);
  }
  return `<article class="wide-card"><span class="num">0${i + 1}</span><div><h3>${title}</h3><p>${c.text}</p></div></article>`;
}).join("");

/* ---------- Page 3: projects and experiences (sideways carousel) ---------- */
const hRegion = $("#hRegion");
hRegion.innerHTML = EXPERIENCES.map((e, i) => `
  <button type="button" class="proj-card" data-idx="${i}" data-open="exp/${e.id}">
    <div class="proj-img" style="${imgStyle(e.cover)}"><span class="proj-num">${String(i + 1).padStart(2, "0")}</span></div>
    <div class="proj-body">
      <p class="proj-meta">${e.role} · ${e.date}</p>
      <h3>${e.title}</h3>
      <p class="proj-short">${e.short}</p>
      <p class="proj-stack"><b>Skills:</b> ${e.skills.slice(0, 4).join(" · ")}</p>
      <span class="proj-more">View details →</span>
    </div>
  </button>`).join("");
$("#hDots").innerHTML = EXPERIENCES.map((e, i) => `<button type="button" class="dot" data-go="${i}" aria-label="Go to ${e.title}"></button>`).join("");

const carousel = (() => {
  const cards = [...hRegion.querySelectorAll(".proj-card")];
  const dots = [...document.querySelectorAll("#hDots .dot")];
  const prevBtn = $("#hPrev"), nextBtn = $("#hNext"), hint = $("#hHint");
  let current = 0, lockUntil = 0, ignoreScrollUntil = 0, settleTimer;

  const targetLeft = (i) => cards[i].offsetLeft - (hRegion.clientWidth - cards[i].offsetWidth) / 2;

  function paint() {
    cards.forEach((c, i) => c.classList.toggle("active", i === current));
    dots.forEach((d, i) => d.classList.toggle("on", i === current));
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === cards.length - 1;
    hint.innerHTML = current === cards.length - 1
      ? "That&rsquo;s everything &mdash; scroll once more to continue to Skills &darr;"
      : "Move to the right to see more &rarr;";
  }

  function goTo(i, smooth = true) {
    current = Math.max(0, Math.min(cards.length - 1, i));
    ignoreScrollUntil = Date.now() + 700;            // don't let the scroll event fight the animation
    hRegion.scrollTo({ left: targetLeft(current), behavior: smooth ? "smooth" : "auto" });
    paint();
  }

  // swiping with a finger / dragging the scrollbar: work out which card is nearest the middle
  function settle() {
    const mid = hRegion.scrollLeft + hRegion.clientWidth / 2;
    let best = 0, bestD = Infinity;
    cards.forEach((c, i) => { const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bestD) { bestD = d; best = i; } });
    if (best !== current) { current = best; paint(); }
  }
  hRegion.addEventListener("scroll", () => {
    if (Date.now() < ignoreScrollUntil) return;
    clearTimeout(settleTimer); settleTimer = setTimeout(settle, 80);
  }, { passive: true });

  prevBtn.addEventListener("click", () => goTo(current - 1));
  nextBtn.addEventListener("click", () => goTo(current + 1));
  dots.forEach((d) => d.addEventListener("click", () => goTo(+d.dataset.go)));

  // clicking a side card brings it to the middle; clicking the middle card opens its page
  cards.forEach((c, i) => c.addEventListener("click", (ev) => { if (i !== current) { ev.stopPropagation(); goTo(i); } }));

  window.addEventListener("resize", () => goTo(current, false));
  paint();
  requestAnimationFrame(() => goTo(0, false));

  return {
    canStep: (dir) => current + dir >= 0 && current + dir < cards.length,
    step: (dir) => { if (Date.now() < lockUntil) return; lockUntil = Date.now() + 450; goTo(current + dir); }
  };
})();

/* ---------- Page 4: skills ---------- */
// Top half: tool icons. The set is repeated 3 times so the slide-right loop never shows a gap.
const toolHtml = TOOLS.map((t) => `<div class="tool"><img src="${t.icon}" alt="${t.name}" draggable="false"><span>${t.name}</span></div>`).join("");
$("#toolTrack").innerHTML = toolHtml + toolHtml + toolHtml;

// Bottom half: soft skills -> which experiences use them (built automatically from EXPERIENCES)
const norm = (x) => String(x).trim().toLowerCase();
$("#softGrid").innerHTML = SOFT_SKILLS.map((s) => {
  const wanted = (s.match || []).map(norm);
  const found = EXPERIENCES
    .filter((e) => (s.ids || []).includes(e.id) || e.skills.some((k) => wanted.includes(norm(k))))
    .map((e) => e.title);
  const list = found.concat(s.extra || []);
  return `<div class="soft-card" tabindex="0"><div class="soft-panel">
      <h4>${s.name}</h4><span class="count">${list.length} ${list.length === 1 ? "place" : "places"}</span>
      <ul class="soft-list">${list.map((x) => `<li>${x}</li>`).join("") || "<li>Coming soon</li>"}</ul>
    </div></div>`;
}).join("");

/* ---------- Page 5: awards ---------- */
// If an award photo is missing, a small trophy icon shows instead (layers: photo, trophy, gradient)
const awardStyle = (src) => `background-image: url('${src}'), url('images/icons/trophy.svg'), var(--ph); background-size: cover, 5.6rem, cover`;
$("#awardGrid").innerHTML = AWARDS.map((a) => `
  <button class="award-panel" data-open="award/${a.id}">
    <div class="pic" style="${awardStyle(a.image)}"></div>
    <div class="a-content">
      <h3>${a.title}</h3>
      <div class="a-extra">
        <p class="a-meta">${a.org} · ${a.date}</p>
        <p class="a-short">${a.short}</p>
        <span class="a-more">Click to read more →</span>
      </div>
    </div>
  </button>`).join("");

/* ---------- Page 6: contact ---------- */
$("#contactRow").innerHTML = SITE.thanks.contacts.map((c) => `
  <a class="contact-link" href="${c.href}" target="_blank" rel="noopener"><small>${c.label}</small>${c.value}</a>`).join("");

/* ---------- Detail pages ---------- */
const detail = $("#detail");
const detailInner = $("#detailInner");
const back = `<button class="back-btn" id="backBtn">← Back</button>`;
const chipsOf = (arr) => `<div class="chips">${arr.map((x) => `<span class="chip">${x}</span>`).join("")}</div>`;

function renderDetail(route) {
  const [type, id] = route.split("/");

  if (type === "exp") {
    const e = EXPERIENCES.find((x) => x.id === id);
    if (!e) return false;
    detailInner.innerHTML = `${back}
      <h1>${e.title}</h1>
      <p class="meta">${e.role} · ${e.date}</p>
      <p>${e.description}</p>
      <div class="gallery">${e.images.map((im) =>
        `<figure><div class="shot" style="${imgStyle(im.src)}"></div><figcaption>${im.caption || ""}</figcaption></figure>`).join("")}</div>
      ${e.video ? `<figure class="video-wrap"><video controls preload="metadata" playsinline src="${e.video.src}"></video><figcaption>${e.video.caption || ""}</figcaption></figure>` : ""}
      <h2>What I did and will be doing</h2>
      <ul>${e.did.map((d) => `<li>${d}</li>`).join("")}</ul>
      ${e.report ? `<div class="project-report"><h2>Project report</h2><div class="pdf-frame-wrap"><iframe class="pdf-frame" src="${e.report}#view=FitH" title="${e.title} project report"></iframe></div></div>` : ""}
      <div class="skills-learned"><h2>Skills I learned</h2>${chipsOf(e.skills)}</div>`;
    return true;
  }

  if (type === "award") {
    const a = AWARDS.find((x) => x.id === id);
    if (!a) return false;
    detailInner.innerHTML = `${back}
      <h1>${a.title}</h1>
      <p class="meta">${a.org} · ${a.date}</p>
      <div class="award-gallery">${[a.image, ...(a.images || [])].map((src, i) => `<figure><div class="award-detail-shot" style="${awardStyle(src)}"></div><figcaption>${i === 0 ? "Award photo" : "Additional photo"}</figcaption></figure>`).join("")}</div>
      <p>${a.details}</p>`;
    return true;
  }

  if (type === "doc") {
    const docs = {
      transcript: { title: "Unofficial Transcript", src: "images/unofficial-transcript.pdf" },
      resume: { title: "Resume", src: "images/resume.pdf" }
    };
    const d = docs[id];
    if (!d) return false;
    detailInner.innerHTML = `${back}<h1>${d.title}</h1>
      <p class="meta">Document preview · displayed within this website</p>
      <div class="pdf-frame-wrap"><iframe class="pdf-frame" src="${d.src}#view=FitH" title="${d.title} PDF preview"></iframe></div>
      <p class="pdf-fallback">If the preview does not load, check that <code>${d.src}</code> exists in your images folder and that your host serves PDF files.</p>`;
    return true;
  }

  return false;
}

function openDetail(route) {
  if (!renderDetail(route)) return closeDetail(true);
  $("#backBtn").addEventListener("click", () => history.back());
  clearTimeout(detailCloseTimer);
  document.body.classList.add("detail-open");
  detail.classList.add("open");
  detail.setAttribute("aria-hidden", "false");
  document.body.classList.add("locked");
  detail.querySelector(".detail-scroll").scrollTop = 0;
}
let detailCloseTimer;
function closeDetail(silent) {
  clearTimeout(detailCloseTimer);
  detailCloseTimer = setTimeout(() => document.body.classList.remove("detail-open"), 650);   // after the fade-out
  detail.classList.remove("open");
  detail.setAttribute("aria-hidden", "true");
  document.body.classList.remove("locked");
}

// Clicking any card opens its page (uses the URL hash so the browser Back button works)
document.addEventListener("click", (ev) => {
  const t = ev.target.closest("[data-open]");
  if (t) location.hash = "#/" + t.dataset.open;
});
window.addEventListener("hashchange", routeFromHash);
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && detail.classList.contains("open")) history.back(); });

function routeFromHash() {
  const h = location.hash;
  if (h.startsWith("#/")) openDetail(h.slice(2));
  else closeDetail();
}
routeFromHash();

/* ---------- Fade transition between pages ---------- */
const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav nav a");

const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => en.target.classList.toggle("in-view", en.isIntersecting));
}, { threshold: 0.35 });
sections.forEach((s) => io.observe(s));

// Highlight the current nav item
const navIO = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
    document.body.classList.toggle("on-dark", en.target.classList.contains("hero"));
  });
}, { threshold: 0.5 });
sections.forEach((s) => navIO.observe(s));

/* ---------- One scroll = one page (desktop only) ---------- */
const desktopMode = window.matchMedia("(min-width: 1001px) and (min-height: 560px)");
let pageLock = false;
let lastWheelTime = 0;

function currentPage() {
  return Math.round(window.scrollY / window.innerHeight);
}

function goToPage(index) {
  index = Math.max(0, Math.min(sections.length - 1, index));
  if (index === currentPage()) return;
  pageLock = true;
  sections[index].scrollIntoView({ behavior: "smooth" });
  setTimeout(() => { pageLock = false; }, 900);
}

const projectsSection = $("#projects");
const projectsPage = [...sections].indexOf(projectsSection);

window.addEventListener("wheel", (e) => {
  if (!desktopMode.matches || document.body.classList.contains("locked")) return; // let opened pages scroll normally
  e.preventDefault();
  const now = Date.now();
  const newGesture = now - lastWheelTime > 100;   // ignores trackpad "inertia" events from the same swipe
  lastWheelTime = now;

  // Cursor over the project cards (on the Projects page) -> scroll sideways.
  // Cursor anywhere else -> straight on to the next / previous page.
  const overCards = currentPage() === projectsPage && e.target.closest && e.target.closest("#hRegion");
  const delta = overCards && Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  if (pageLock || !newGesture || Math.abs(delta) < 4) return;
  const dir = delta > 0 ? 1 : -1;

  if (overCards && carousel.canStep(dir)) { carousel.step(dir); return; }
  goToPage(currentPage() + dir);                  // also used at the first / last card
}, { passive: false });

window.addEventListener("keydown", (e) => {
  if (document.body.classList.contains("locked")) return;
  if (projectsSection.classList.contains("in-view") && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
    const dir = e.key === "ArrowRight" ? 1 : -1;
    if (carousel.canStep(dir)) { e.preventDefault(); carousel.step(dir); }
    return;
  }
  if (!desktopMode.matches || document.body.classList.contains("locked") || pageLock) return;
  if (["ArrowDown", "PageDown", " "].includes(e.key)) { e.preventDefault(); goToPage(currentPage() + 1); }
  if (["ArrowUp", "PageUp"].includes(e.key))          { e.preventDefault(); goToPage(currentPage() - 1); }
});

// Touch swipe (for touchscreens in desktop mode)
let touchStartY = null, touchStartX = 0;
window.addEventListener("touchstart", (e) => { touchStartY = e.touches[0].clientY; touchStartX = e.touches[0].clientX; }, { passive: true });
window.addEventListener("touchend", (e) => {
  if (!desktopMode.matches || document.body.classList.contains("locked") || pageLock || touchStartY === null) return;
  const dy = touchStartY - e.changedTouches[0].clientY;
  const dx = touchStartX - e.changedTouches[0].clientX;
  touchStartY = null;
  if (Math.abs(dx) > Math.abs(dy)) return;        // sideways swipe = moving the project cards
  if (Math.abs(dy) > 50) goToPage(currentPage() + (dy > 0 ? 1 : -1));
}, { passive: true });


/* =====================================================================
   MUSIC  (plays only when you press the button, top left)
   ===================================================================== */
const song = $("#bg-music"), musicBtn = $("#musicBtn");
const showPlaying = (on) => {
  musicBtn.classList.toggle("playing", on);
  musicBtn.setAttribute("aria-label", on ? "Pause music" : "Play music");
  musicBtn.title = on ? "Pause music" : "Play music";
};
song.addEventListener("play", () => showPlaying(true));
song.addEventListener("pause", () => showPlaying(false));
musicBtn.addEventListener("click", () => {
  if (song.paused) song.play().catch((err) => console.warn("Could not play song1.mp3:", err));
  else song.pause();
});

/* =====================================================================
   CAR  (drawn as SVG; used in the nav and on the contact page)
   ===================================================================== */
function carSVG() {
  const wheel = (x) => `
    <g transform="translate(${x} 90)">
      <circle r="22" fill="#1b1b20"/>
      <g class="spin">
        <circle r="14" fill="#fdbf57"/>
        <circle r="10.5" fill="#26262c"/>
        <path d="M0 -10.5V10.5M-10.5 0H10.5M-7.4 -7.4L7.4 7.4M-7.4 7.4L7.4 -7.4" stroke="#fdbf57" stroke-width="2.2" stroke-linecap="round"/>
        <circle r="3" fill="#fdbf57"/>
      </g>
    </g>`;
  return `<svg class="car" viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 86 C12 72 20 66 44 62 L100 54 C118 36 150 28 182 28 C214 28 236 40 252 54 L292 62 C306 64 312 72 312 86 L312 90 L267 90 A27 27 0 0 0 213 90 L107 90 A27 27 0 0 0 53 90 L12 90 Z" fill="#7a003c"/>
    <path d="M108 52 C124 38 150 34 180 34 C206 34 226 42 240 54 Z" fill="#dfe9f2"/>
    <path d="M176 34 L176 54" stroke="#7a003c" stroke-width="4"/>
    <path d="M20 74 L300 74" stroke="#fdbf57" stroke-width="3" stroke-linecap="round"/>
    <rect x="296" y="66" width="14" height="7" rx="3.5" fill="#fff3c4"/>
    <rect x="11" y="66" width="9" height="7" rx="3" fill="#ff5a5a"/>
    ${wheel(80)}${wheel(240)}
  </svg>`;
}

// little car on the nav road: its position follows how far down the site you are
const nav = $("#nav"), miniCar = $("#miniCar");
miniCar.innerHTML = carSVG();
const miniSvg = miniCar.querySelector("svg");
let lastP = 0, driveTimer;
function updateRoad() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  nav.style.setProperty("--p", p.toFixed(4));
  if (Math.abs(p - lastP) > 0.004) {
    miniSvg.classList.add("drive");                    // wheels spin while it moves
    clearTimeout(driveTimer);
    driveTimer = setTimeout(() => miniSvg.classList.remove("drive"), 700);
  }
  lastP = p;
}
window.addEventListener("scroll", updateRoad, { passive: true });
window.addEventListener("resize", updateRoad);
updateRoad();

// big car on the contact page: click it and it drives off, then comes back
const sceneCar = $("#sceneCar");
sceneCar.innerHTML = carSVG();
let carBusy = false;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
sceneCar.addEventListener("click", async () => {
  if (carBusy) return;
  carBusy = true;
  sceneCar.classList.add("parked", "driving");
  sceneCar.style.transition = "transform 1.1s cubic-bezier(.5,0,1,.6)";
  sceneCar.style.transform = "translateX(110vw)";
  await sleep(1150);
  sceneCar.style.transition = "none";
  sceneCar.style.transform = "translateX(-75vw)";
  sceneCar.offsetWidth;                                // apply the jump before animating back
  sceneCar.style.transition = "transform 2s cubic-bezier(.16,.84,.3,1)";
  sceneCar.style.transform = "none";
  await sleep(2050);
  sceneCar.classList.remove("driving");
  sceneCar.style.transition = sceneCar.style.transform = "";
  carBusy = false;
});

/* =====================================================================
   GUITARS  (hover or click a string and it vibrates; click also plays a note)
   Colours are set where mountGuitar() is called at the bottom of this block.
   ===================================================================== */
function guitarSVG(c) {
  const nutY = 62, bridgeY = 440;
  const nutX = (i) => 91 + i * 3.6, brX = (i) => 84 + i * 6.4;
  const widths = [1.9, 1.6, 1.35, 1.05, .9, .8];
  // fret lines + dot inlays along the neck
  let frets = "", dots = "", prev = nutY;
  for (let n = 1; n <= 12; n++) {
    const y = nutY + (bridgeY - nutY) * (1 - Math.pow(2, -n / 12));
    const hw = 12 + 4 * (y - 58) / 204;
    frets += `<line x1="${100 - hw}" x2="${100 + hw}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#d8d1c6" stroke-width="1.2"/>`;
    if ([3, 5, 7, 9].includes(n)) dots += `<circle cx="100" cy="${((y + prev) / 2).toFixed(1)}" r="2.2" fill="#e9e2d3"/>`;
    if (n === 12) dots = dots.replace(/$/, `<circle cx="95" cy="${((y + prev) / 2).toFixed(1)}" r="2.2" fill="#e9e2d3"/><circle cx="105" cy="${((y + prev) / 2).toFixed(1)}" r="2.2" fill="#e9e2d3"/>`);
    prev = y;
  }
  const pegs = [18, 32, 46].map((y) => `<rect x="70" y="${y}" width="10" height="5" rx="2" fill="#d8d1c6"/><rect x="120" y="${y}" width="10" height="5" rx="2" fill="#d8d1c6"/>`).join("");
  const strings = [0, 1, 2, 3, 4, 5].map((i) => `
    <path class="string" data-i="${i}" d="M${nutX(i)} ${nutY} L${brX(i)} ${bridgeY}" stroke="#efe9dc" stroke-width="${widths[i]}" fill="none" stroke-linecap="round"/>`).join("");
  return `<svg viewBox="-10 -6 220 530" xmlns="http://www.w3.org/2000/svg">
    <path d="M86 58 L114 58 L118 12 Q100 -4 82 12 Z" fill="${c.body}" stroke="${c.edge}" stroke-width="2"/>
    ${pegs}
    <path d="M88 56 L112 56 L116 270 L84 270 Z" fill="#33201a"/>
    ${frets}${dots}
    <path d="M100 255 C135 255 148 285 142 315 C138 335 130 342 132 360 C135 380 170 395 170 440 C170 490 135 508 100 508 C65 508 30 490 30 440 C30 395 65 380 68 360 C70 342 62 335 58 315 C52 285 65 255 100 255 Z" fill="${c.body}" stroke="${c.trim}" stroke-width="3"/>
    <path d="M70 300 C74 285 84 272 96 268" stroke="rgba(255,255,255,.28)" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="100" cy="335" r="25" fill="#1a0710" stroke="${c.trim}" stroke-width="2.5"/>
    <circle cx="100" cy="335" r="29.5" fill="none" stroke="${c.edge}" stroke-width="1.5"/>
    <rect x="76" y="436" width="48" height="12" rx="3" fill="#2a1a14"/>
    <rect x="80" y="434" width="40" height="3" rx="1.5" fill="#e9e2d3"/>
    <rect x="86" y="58" width="28" height="4" fill="#efe9dc"/>
    ${strings}
    <rect class="strum" x="78" y="${nutY}" width="44" height="${bridgeY - nutY}" fill="transparent"/>
  </svg>`;
}

const GUITAR_NOTES = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63];   // E A D G B E
let audioCtx = null;
const noteCache = {};
function playNote(i) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    if (!noteCache[i]) {                                  // plucked-string sound (Karplus-Strong)
      const sr = audioCtx.sampleRate, N = Math.round(sr / GUITAR_NOTES[i]), len = Math.round(sr * 1.8);
      const buf = audioCtx.createBuffer(1, len, sr), d = buf.getChannelData(0);
      for (let n = 0; n < N; n++) d[n] = Math.random() * 2 - 1;
      for (let n = N; n < len; n++) d[n] = (d[n - N] + (d[n - N - 1] || 0)) * 0.4975;
      noteCache[i] = buf;
    }
    const src = audioCtx.createBufferSource(), gain = audioCtx.createGain(), lp = audioCtx.createBiquadFilter();
    src.buffer = noteCache[i]; gain.gain.value = 0.35; lp.type = "lowpass"; lp.frequency.value = 3200;
    src.connect(lp); lp.connect(gain); gain.connect(audioCtx.destination); src.start();
  } catch (e) { /* no audio available - the strings still vibrate */ }
}

function mountGuitar(host, colors) {
  host.innerHTML = guitarSVG(colors);
  const strings = [...host.querySelectorAll(".string")];
  const geo = strings.map((el) => {                       // string end points, read from the path
    const m = el.getAttribute("d").match(/-?\d+\.?\d*/g).map(Number);
    return { x1: m[0], y1: m[1], x2: m[2], y2: m[3] };
  });
  const state = strings.map((_, i) => ({ amp: 0, t0: 0, f: 11 + i * 1.3 }));
  let running = false;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function frame(now) {
    let any = false;
    state.forEach((s, i) => {
      if (s.amp < 0.05) return;
      const t = (now - s.t0) / 1000;
      const amp = s.amp * Math.exp(-3.4 * t);
      const g = geo[i];
      if (amp < 0.05) { s.amp = 0; strings[i].setAttribute("d", `M${g.x1} ${g.y1} L${g.x2} ${g.y2}`); return; }
      const off = 2 * amp * Math.sin(2 * Math.PI * s.f * t);     // curve control point = 2 x visible bend
      strings[i].setAttribute("d", `M${g.x1} ${g.y1} Q${(g.x1 + g.x2) / 2 + off} ${(g.y1 + g.y2) / 2} ${g.x2} ${g.y2}`);
      any = true;
    });
    if (any) requestAnimationFrame(frame); else running = false;
  }
  function pluck(i, strength) {
    if (reduce) return;
    state[i].amp = 4.5 * strength; state[i].t0 = performance.now();
    if (!running) { running = true; requestAnimationFrame(frame); }
  }
  // One invisible strum zone over all six strings. We turn the pointer position into a
  // "string number" (0 = low E ... 5 = high E) and pluck every string the pointer crosses.
  const svg = host.querySelector("svg"), zone = host.querySelector(".strum");
  const NUT = 62, BRIDGE = 440;
  const toSvg = (e) => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); };
  const stringPos = (p) => {
    const f = (p.y - NUT) / (BRIDGE - NUT);
    const x0 = 91 + (84 - 91) * f, x5 = 109 + (116 - 109) * f;
    return (p.x - x0) / (x5 - x0) * 5;
  };
  const nearest = (pos) => Math.max(0, Math.min(5, Math.round(pos)));
  let last = null;
  zone.addEventListener("pointerenter", (e) => { last = stringPos(toSvg(e)); pluck(nearest(last), 0.6); });
  zone.addEventListener("pointerleave", () => { last = null; });
  zone.addEventListener("pointermove", (e) => {
    const pos = stringPos(toSvg(e));
    if (last !== null) {
      const a = Math.min(last, pos), b = Math.max(last, pos);
      for (let i = Math.ceil(a); i <= Math.floor(b); i++) if (i >= 0 && i <= 5) pluck(i, 0.8);
    }
    last = pos;
  });
  zone.addEventListener("pointerdown", (e) => { const i = nearest(stringPos(toSvg(e))); pluck(i, 1); playNote(i); });
}
// maroon + gold guitar on the right, gold + maroon on the left (colours are easy to change here)
mountGuitar($("#guitarR"), { body: "#7a003c", edge: "#4a0224", trim: "#fdbf57" });
mountGuitar($("#guitarL"), { body: "#fdbf57", edge: "#b9801a", trim: "#7a003c" });