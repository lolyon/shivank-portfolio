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

// Backgrounds
document.querySelectorAll("[data-bg]").forEach((sec) => {
  const file = SITE.backgrounds[sec.dataset.bg];
  if (file) {
    sec.querySelector(".bg").style.setProperty("--bg-img", `url('${file}')`);
    sec.classList.add("has-photo");                  // lets style.css show this page's photo instead of the space canvas
  }
});

/* ---------- Page 2: current ---------- */
$("#currentList").innerHTML = SITE.current.map((c) => {
  let title = c.title;
  if (c.club21 && title.includes(c.club21)) {           // e.g. "Mac RoboMaster" becomes a link to the official page
    const link = `<a class="uni" href="${c.club21Url}" target="_blank" rel="noopener">${c.club21}<span class="tip">${c.clubTip21 || "Visit the official page"} ↗</span></a>`;
    title = title.replace(c.club21, link);
  }
  return `<article class="wide-card"><h3>${title}</h3><p>${c.text}</p></article>`;
}).join("");

/* ---------- Page 3: projects and experiences (sideways carousel) ---------- */
const hRegion = $("#hRegion");
hRegion.innerHTML = EXPERIENCES.map((e, i) => `
  <button type="button" class="proj-card" data-idx="${i}" data-open="exp/${e.id}">
    <div class="proj-img" style="${imgStyle(e.cover)}"></div>
    <div class="proj-body">
      <p class="proj-meta">${e.role} · ${e.date}</p>
      <h3>${e.title}</h3>
      <p class="proj-short">${e.short}</p>
      <div class="chips">${e.skills.slice(0, 4).map((k) => `<span class="chip">${k}</span>`).join("")}</div>
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
   OPENING INTRO
   ===================================================================== */
const INTRO = {
  songId: "0KOZ3VbPB0k", songStart: 72,                               // song from 1:12
  videoStart: 12, videoEnd: null,                                  // loop from 0:12 through the end of the downloaded video
  videoFade: 1000,                                                    // ms cross-fade used to hide the loop point
  firstQuoteDelay: 2500,                                              // video starts -> first quote (ms)
  quoteGap: 2000,                                                     // gap between quotes (ms)
  endPause: 2000,                                                     // last quote gone -> video ends (ms)
  quotes: [
    { text: "You are truly alive if you carry restlessness and dreams in your heart, and learn to live free like the wind and river.", show: 4600 },
    { text: "A part of who I am will always be a reflection of the people I choose to walk through life with.",                         show: 5500 }
  ]
};

const introEl = $("#intro"), carEl = $("#introCar"), vidWrap = $("#introVideoWrap"),
      quoteEl = $("#introQuote"),
      startHint = $("#introStart"), skipBtn = $("#introSkip"), musicBtn = $("#musicBtn");

document.body.classList.add("locked");          // no scrolling while the intro plays

/* Stacking fix: the video copies must stay UNDER the dark overlay and the quotes */
const fixCss = document.createElement("style");
fixCss.textContent = `
  .intro-video .intro-loop-video { z-index: 1; }
  .intro-video::after { z-index: 5; }
  .intro-quote { z-index: 6; }
  .song-player { z-index: 0; }
`;
document.head.appendChild(fixCss);

/* ---------- helpers ---------- */
let skipped = false, started = false, ended = false;
const skipSignals = new Set();
const wait = (ms) => new Promise((resolve, reject) => {
  const t = setTimeout(resolve, ms);
  skipSignals.add(() => { clearTimeout(t); reject("skip"); });
});
const carX = (x, s = 1) => `translate(calc(-50% + ${x}px), -50%) scale(${s})`;
const carWidth = () => carEl.getBoundingClientRect().width;   // (SVG elements have no offsetWidth!)
function moveCar(x, ms, ease) {
  carEl.style.transition = `transform ${ms}ms ${ease}`;
  carEl.style.transform = carX(x);
  return wait(ms);
}
carEl.style.transform = carX(0);

/* ---------- skid marks + smoke (drawn on a canvas under the car) ---------- */
const dpr = window.devicePixelRatio || 1;
const fx = document.createElement("canvas");        // what you see
const marks = document.createElement("canvas");     // permanent skid marks (off-screen)
fx.style.cssText = "position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none;opacity:1;";
fx.width = marks.width = Math.round(window.innerWidth * dpr);
fx.height = marks.height = Math.round(window.innerHeight * dpr);
introEl.insertBefore(fx, vidWrap);
const fctx = fx.getContext("2d"), mctx = marks.getContext("2d");

let fxRunning = false, driving = false, lastPts = null, lastT = 0;
let particles = [];

function rearWheels() {                              // positions of the two rear tyres on screen
  const r = carEl.getBoundingClientRect();
  const x = r.left + r.width * (82 / 380);
  return { r, pts: [{ x, y: r.top + r.height * (26 / 140) }, { x, y: r.top + r.height * (114 / 140) }] };
}

function fxFrame(now) {
  if (!fxRunning) return;
  const dt = Math.min(50, now - (lastT || now)); lastT = now;

  if (driving) {
    const { r, pts } = rearWheels();
    if (lastPts) {
      mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mctx.strokeStyle = "rgba(25,25,25,.8)";
      mctx.lineWidth = r.height * (28 / 140) * 0.6;
      pts.forEach((p, i) => {
        const q = lastPts[i];
        mctx.beginPath(); mctx.moveTo(q.x, q.y); mctx.lineTo(p.x, p.y); mctx.stroke();
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        const steps = Math.min(40, Math.ceil(dist / 14));
        for (let s = 1; s <= steps && particles.length < 700; s++) {          // smoke along the path
          const f = s / steps;
          particles.push({
            x: q.x + (p.x - q.x) * f, y: q.y + (p.y - q.y) * f,
            vx: -(Math.random() * 0.03), vy: (i === 0 ? -1 : 1) * Math.random() * 0.03,
            r0: 8 + Math.random() * 6, grow: 0.025 + Math.random() * 0.03,
            age: 0, max: 1600 + Math.random() * 900
          });
        }
      });
    }
    lastPts = pts;
  }

  fctx.setTransform(1, 0, 0, 1, 0, 0);
  fctx.clearRect(0, 0, fx.width, fx.height);
  fctx.drawImage(marks, 0, 0);
  fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  particles = particles.filter((p) => (p.age += dt) < p.max);
  for (const p of particles) {
    p.x += p.vx * dt; p.y += p.vy * dt;
    const rad = p.r0 + p.age * p.grow;
    const a = 0.45 * Math.pow(1 - p.age / p.max, 1.3);
    const g = fctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
    g.addColorStop(0, `rgba(120,120,120,${a})`);
    g.addColorStop(1, "rgba(120,120,120,0)");
    fctx.fillStyle = g;
    fctx.beginPath(); fctx.arc(p.x, p.y, rad, 0, Math.PI * 2); fctx.fill();
  }
  requestAnimationFrame(fxFrame);
}
function startFx() { fxRunning = true; driving = true; lastPts = null; lastT = 0; requestAnimationFrame(fxFrame); }
function stopFx()  { fxRunning = false; driving = false; }

/* ---------- local audio + video players ---------- */
const songPlayer = $("#bg-music");
let songStarted = false, userPaused = false;
const videoA = $("#videoPlayer");
const videoB = document.createElement("video");
videoB.id = "videoPlayerB";
videoB.className = "intro-loop-video";
videoB.src = "Video1.mp4";
videoB.playsInline = true;
videoB.preload = "auto";
videoB.muted = true;
videoB.setAttribute("aria-hidden", "true");
videoA.after(videoB);
const vp = [videoA, videoB];
let activeV = 0, crossing = false, loopTimer = null;
const loopTimeouts = new Set();

vp.forEach((video, i) => {
  video.muted = true;
  video.controls = false;
  video.style.opacity = i === 0 ? "1" : "0";
  video.style.zIndex = i === 0 ? "2" : "1";
  video.addEventListener("loadedmetadata", () => {
    // Every playback pass begins at exactly 12 seconds.
    if (video.duration > INTRO.videoStart) {
      try { video.currentTime = INTRO.videoStart; } catch (e) {}
    }
  });
});

function updateMusicButton(playing) {
  musicBtn.classList.toggle("playing", playing);
  musicBtn.setAttribute("aria-label", playing ? "Pause music" : "Play music");
  musicBtn.title = playing ? "Pause music" : "Play music";
}
songPlayer.addEventListener("play", () => updateMusicButton(true));
songPlayer.addEventListener("pause", () => updateMusicButton(false));
songPlayer.addEventListener("ended", () => {
  // The audio element also has loop=true as a fallback.
  if (!userPaused) {
    songPlayer.currentTime = 0;
    songPlayer.play().catch(() => {});
  }
});

function prepVideo(i) {
  const video = vp[i];
  try {
    video.muted = true;
    video.currentTime = INTRO.videoStart;
    const promise = video.play();
    if (promise) promise.then(() => {
      video.pause();
      video.currentTime = INTRO.videoStart;
    }).catch(() => {});
  } catch (e) {}
}

function startSong() {
  musicBtn.hidden = false;
  if (songStarted && !songPlayer.paused) return;
  userPaused = false;
  songPlayer.loop = true;
  const promise = songPlayer.play();
  if (promise) promise.then(() => {
    songStarted = true;
    updateMusicButton(true);
  }).catch((err) => {
    console.warn("Audio playback was blocked or the file could not be loaded:", err);
    updateMusicButton(false);
  });
}

function stopSongOnLanding() {
  userPaused = true;
  songPlayer.pause();
  songPlayer.currentTime = 0;
  musicBtn.hidden = false;                             // the button stays so you can press play yourself
  updateMusicButton(false);
}

function later(fn, ms) {
  const t = setTimeout(() => { loopTimeouts.delete(t); fn(); }, ms);
  loopTimeouts.add(t);
}
function crossfade() {
  if (crossing) return;
  crossing = true;
  const out = activeV, inn = 1 - activeV;
  const incoming = vp[inn], outgoing = vp[out];
  const LEAD = 200;
  try {
    incoming.currentTime = INTRO.videoStart;
    incoming.muted = true;
    const p = incoming.play();
    if (p) p.catch(() => {});
  } catch (e) {}
  later(() => {
    incoming.style.zIndex = "3";
    outgoing.style.zIndex = "2";
    incoming.style.transition = `opacity ${INTRO.videoFade}ms linear`;
    incoming.style.opacity = "1";
  }, LEAD);
  later(() => {
    outgoing.style.transition = "none";
    outgoing.style.opacity = "0";
    outgoing.pause();
    try { outgoing.currentTime = INTRO.videoStart; } catch (e) {}
    activeV = inn;
    crossing = false;
  }, LEAD + INTRO.videoFade + 60);
}
function startVideo() {
  try {
    clearInterval(loopTimer);
    loopTimeouts.forEach(clearTimeout);
    loopTimeouts.clear();
    vp.forEach((video, i) => {
      video.pause();
      video.style.transition = "none";
      video.style.opacity = i === 0 ? "1" : "0";
      video.style.zIndex = i === 0 ? "2" : "1";
      video.currentTime = INTRO.videoStart;
    });
    activeV = 0;
    crossing = false;
    const p = vp[0].play();
    if (p) p.catch((err) => console.warn("Intro video could not play:", err));
    loopTimer = setInterval(() => {
      if (crossing) return;
      const video = vp[activeV];
      if (video.paused && !video.ended) video.play().catch(() => {});
      const loopEnd = Number.isFinite(video.duration) ? video.duration : INTRO.videoEnd;
      if (loopEnd && loopEnd > INTRO.videoStart && video.currentTime >= loopEnd - (INTRO.videoFade + 200) / 1000) crossfade();
    }, 60);
  } catch (e) {}
}
function stopVideo() {
  clearInterval(loopTimer);
  loopTimeouts.forEach(clearTimeout);
  loopTimeouts.clear();
  vp.forEach((video) => {
    video.pause();
    video.style.transition = "none";
  });
}

/* ---------- the timeline ---------- */
async function runIntro() {
  try {
    startHint.classList.add("gone");
    startSong();                                      // song starts right on the click and loops until paused
    prepVideo(0); prepVideo(1);
    const W = window.innerWidth, carW = carWidth();

    // 1) car drives from the middle off the right edge, leaving skid marks + smoke
    await wait(250);
    startFx();
    await moveCar(W / 2 + carW, 2200, "cubic-bezier(.6,0,.9,.5)");
    driving = false;

    // 2) skid marks + smoke slowly fade away
    await wait(500);
    fx.style.transition = "opacity 2200ms ease";
    fx.style.opacity = 0;
    await wait(2300);
    stopFx();

    // 3) video starts, first quote after 2.5 s, 2 s gap, second quote, then 2 s more of video
    vidWrap.classList.add("on");
    startVideo();
    await wait(INTRO.firstQuoteDelay);
    for (let i = 0; i < INTRO.quotes.length; i++) {
      if (i > 0) await wait(INTRO.quoteGap);
      quoteEl.textContent = INTRO.quotes[i].text; quoteEl.classList.add("show");
      await wait(INTRO.quotes[i].show);
      quoteEl.classList.remove("show");
    }
    await wait(INTRO.endPause);
    vidWrap.classList.remove("on");
    await wait(900);
    stopVideo();

    // 4) white screen, car comes in from the left and stops in the middle
    carEl.style.transition = "none";
    carEl.style.transform = carX(-(W / 2 + carW));
    void carEl.getBoundingClientRect();               // apply the jump before animating
    await moveCar(0, 1800, "cubic-bezier(.1,.65,.25,1)");
    await wait(500);

    // 5) car has stopped in the middle -> straight to the About page (JHE photo background)
    await wait(600);
    document.body.classList.add("intro-reveal");
  } catch (err) {
    if (err !== "skip") console.error(err);
  }
  endIntro();
}

function endIntro() {                                 // fade the white screen away -> your site
  if (ended) return;
  ended = true;
  stopFx();
  stopVideo();
  stopSongOnLanding();                                 // music stops as soon as the About page appears
  introEl.classList.add("leaving");
  setTimeout(() => {
    introEl.remove();
    if (!detail.classList.contains("open")) document.body.classList.remove("locked");
  }, 1300);
}

/* ---------- controls ---------- */
introEl.addEventListener("click", () => { if (!started) { started = true; runIntro(); } });

skipBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  skipped = true;
  if (started) { skipSignals.forEach((s) => s()); skipSignals.clear(); }
  else { started = true; endIntro(); }
});

musicBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (songPlayer.paused) {
    userPaused = false;
    startSong();
  } else {
    userPaused = true;
    songPlayer.pause();
  }
});

/* =====================================================================
   SPACE BACKGROUND  (every page except About)
   Bright twinkling stars + vivid nebula. Near the cursor the sky zooms in
   (stars and nebula are magnified) and lights up.
   Tweak the numbers in SPACE below.
   ===================================================================== */
const SPACE = {
  density: 2300,        // lower = more stars (one star per N square pixels)
  lensRadius: 190,      // size of the zoom area around the cursor (px)
  lensZoom: 2.3,        // how much the sky is magnified under the cursor
  glow: 0.34,           // brightness of the light around the cursor
  dim: 0.3,             // darkens the whole space background (0 = original brightness, 1 = black)
  shootingEvery: [3500, 7500]   // ms between shooting stars (min, max)
};

(function startSpace() {
  const cv = document.getElementById("space");
  if (!cv) return;
  const ctx = cv.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const COLORS = [[255,255,255],[190,215,255],[255,236,190],[255,190,225],[170,245,255],[210,190,255]];

  let W = 0, H = 0, dpr = 1, stars = [], neb = null, sprites = [];
  const lens = { x: -9999, y: -9999, tx: -9999, ty: -9999, power: 0, target: 0 };
  let lensCv = null, lensCtx = null, shooting = [], nextShoot = 0;

  function makeSprites() {              // soft glowing dot per colour, drawn once and re-used
    sprites = COLORS.map(([r, g, b]) => {
      const c = document.createElement("canvas"); c.width = c.height = 64;
      const x = c.getContext("2d"), g2 = x.createRadialGradient(32, 32, 0, 32, 32, 32);
      g2.addColorStop(0, "rgba(255,255,255,1)");
      g2.addColorStop(0.16, `rgba(${r},${g},${b},0.95)`);
      g2.addColorStop(0.45, `rgba(${r},${g},${b},0.28)`);
      g2.addColorStop(1, `rgba(${r},${g},${b},0)`);
      x.fillStyle = g2; x.fillRect(0, 0, 64, 64);
      return c;
    });
  }

  function makeNebula() {               // bright, colourful backdrop, painted once
    neb = document.createElement("canvas");
    neb.width = Math.round(W * dpr); neb.height = Math.round(H * dpr);
    const n = neb.getContext("2d"); n.scale(dpr, dpr);
    const bg = n.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0b1040"); bg.addColorStop(0.5, "#160a45"); bg.addColorStop(1, "#06214a");
    n.fillStyle = bg; n.fillRect(0, 0, W, H);
    n.globalCompositeOperation = "lighter";
    const blobs = [
      [0.15, 0.25, 0.55, "123,47,247", 0.42], [0.82, 0.18, 0.5, "0,170,255", 0.38],
      [0.55, 0.78, 0.6, "255,47,160", 0.30], [0.08, 0.85, 0.45, "0,229,192", 0.28],
      [0.92, 0.82, 0.5, "255,150,60", 0.20], [0.5, 0.4, 0.4, "90,90,255", 0.22]
    ];
    blobs.forEach(([bx, by, br, rgb, a]) => {
      const R = br * Math.max(W, H) * 0.6, cx = bx * W, cy = by * H;
      const g = n.createRadialGradient(cx, cy, 0, cx, cy, R);
      g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(0.5, `rgba(${rgb},${a * 0.35})`); g.addColorStop(1, `rgba(${rgb},0)`);
      n.fillStyle = g; n.fillRect(0, 0, W, H);
    });
    // faint dusty band of tiny stars (Milky-Way feel)
    for (let i = 0; i < W * H / 900; i++) {
      const t = Math.random(), x = t * W, y = H * (0.75 - t * 0.5) + (Math.random() - 0.5) * H * 0.28;
      n.fillStyle = `rgba(255,255,255,${0.05 + Math.random() * 0.22})`; n.fillRect(x, y, 1.1, 1.1);
    }
  }

  function makeStars() {
    const count = Math.round((W * H) / SPACE.density);
    stars = [];
    for (let i = 0; i < count; i++) {
      const big = Math.random() < 0.07;
      stars.push({
        x: Math.random() * W, y: Math.random() * H,
        r: big ? 2.2 + Math.random() * 2.2 : 0.5 + Math.random() * 1.5,
        a: big ? 0.85 + Math.random() * 0.15 : 0.4 + Math.random() * 0.6,
        c: Math.floor(Math.random() * COLORS.length),
        sp: 0.6 + Math.random() * 2.2, ph: Math.random() * 6.28,
        spike: big && Math.random() < 0.6, depth: 0.3 + Math.random() * 0.7
      });
    }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    lensCv = document.createElement("canvas");
    lensCv.width = lensCv.height = Math.round(SPACE.lensRadius * 2 * dpr);
    lensCtx = lensCv.getContext("2d");
    makeNebula(); makeStars();
  }

  window.addEventListener("mousemove", (e) => {
    lens.tx = e.clientX; lens.ty = e.clientY; lens.target = 1;
    if (lens.x < -9000) { lens.x = lens.tx; lens.y = lens.ty; }
  }, { passive: true });
  document.addEventListener("mouseleave", () => { lens.target = 0; });
  window.addEventListener("blur", () => { lens.target = 0; });
  window.addEventListener("resize", resize);

  function drawStar(s, x, y, size, alpha, t) {
    const sp = sprites[s.c];
    ctx.globalAlpha = Math.min(1, alpha);
    const d = size * 7;                                        // glow diameter
    ctx.drawImage(sp, x - d / 2, y - d / 2, d, d);
    if (s.spike) {                                             // 4-point sparkle on the brightest stars
      const L = size * 9 * (0.8 + 0.2 * Math.sin(t * s.sp + s.ph));
      ctx.globalAlpha = Math.min(1, alpha) * 0.85;
      ctx.fillStyle = "#fff";
      ctx.fillRect(x - L / 2, y - 0.5, L, 1);
      ctx.fillRect(x - 0.5, y - L / 2, 1, L);
    }
  }

  function shoot() {
    const fromLeft = Math.random() < 0.5;
    shooting.push({ x: fromLeft ? Math.random() * W * 0.6 : W * (0.4 + Math.random() * 0.6), y: Math.random() * H * 0.45,
      vx: (fromLeft ? 1 : -1) * (7 + Math.random() * 5), vy: 3 + Math.random() * 3, life: 0, max: 55 + Math.random() * 25 });
  }

  let last = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    if (document.hidden) return;
    const dt = Math.min(50, now - last); last = now;
    const t = now / 1000;

    lens.x += (lens.tx - lens.x) * 0.16; lens.y += (lens.ty - lens.y) * 0.16;
    lens.power += (lens.target - lens.power) * 0.1;
    const P = lens.power, R = SPACE.lensRadius, Z = 1 + (SPACE.lensZoom - 1) * P;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.drawImage(neb, 0, 0, W, H);

    // zoomed + feathered copy of the nebula under the cursor
    if (P > 0.02) {
      const L = lensCtx, S = lensCv.width;
      L.setTransform(1, 0, 0, 1, 0, 0);
      L.globalCompositeOperation = "source-over"; L.clearRect(0, 0, S, S);
      const sw = (2 * R / Z) * dpr;
      L.drawImage(neb, lens.x * dpr - sw / 2, lens.y * dpr - sw / 2, sw, sw, 0, 0, S, S);
      L.globalCompositeOperation = "destination-in";
      const m = L.createRadialGradient(S / 2, S / 2, S * 0.18, S / 2, S / 2, S / 2);
      m.addColorStop(0, "rgba(0,0,0,1)"); m.addColorStop(1, "rgba(0,0,0,0)");
      L.fillStyle = m; L.fillRect(0, 0, S, S);
      ctx.drawImage(lensCv, lens.x - R, lens.y - R, 2 * R, 2 * R);
    }

    // stars
    ctx.globalCompositeOperation = "lighter";
    for (const s of stars) {
      if (!reduce) { s.x -= 0.006 * s.depth * dt; if (s.x < -10) s.x = W + 10; }   // very slow drift
      const tw = reduce ? 1 : 0.65 + 0.35 * Math.sin(t * s.sp + s.ph);
      let x = s.x, y = s.y, size = s.r, alpha = s.a * tw;
      if (P > 0.02) {
        const dx = x - lens.x, dy = y - lens.y, d = Math.hypot(dx, dy);
        if (d < R && d > 0.001) {
          const u = d / R, k = 1 + (Z - 1) * (1 - u) * (1 - u);          // magnification: strongest at the centre
          x = lens.x + (dx / d) * d * k; y = lens.y + (dy / d) * d * k;
          size *= k * 0.95; alpha = Math.min(1, alpha * (1 + 1.8 * (1 - u) * P));
        }
      }
      drawStar(s, x, y, size, alpha, t);
    }

    // soft light around the cursor
    if (P > 0.02) {
      const g = ctx.createRadialGradient(lens.x, lens.y, 0, lens.x, lens.y, R * 1.25);
      g.addColorStop(0, `rgba(255,244,214,${SPACE.glow * P})`);
      g.addColorStop(0.4, `rgba(190,170,255,${SPACE.glow * 0.45 * P})`);
      g.addColorStop(1, "rgba(120,120,255,0)");
      ctx.globalAlpha = 1; ctx.fillStyle = g;
      ctx.fillRect(lens.x - R * 1.25, lens.y - R * 1.25, R * 2.5, R * 2.5);
    }

    // shooting stars
    if (!reduce) {
      if (now > nextShoot) { shoot(); nextShoot = now + SPACE.shootingEvery[0] + Math.random() * (SPACE.shootingEvery[1] - SPACE.shootingEvery[0]); }
      shooting = shooting.filter((q) => q.life < q.max);
      for (const q of shooting) {
        q.life++; q.x += q.vx; q.y += q.vy;
        const f = 1 - q.life / q.max, tx = q.x - q.vx * 9, ty = q.y - q.vy * 9;
        const g = ctx.createLinearGradient(q.x, q.y, tx, ty);
        g.addColorStop(0, `rgba(255,255,255,${f})`); g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.globalAlpha = 1; ctx.strokeStyle = g; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(tx, ty); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";

    // dim the whole sky a little
    ctx.fillStyle = `rgba(3, 4, 16, ${SPACE.dim})`;
    ctx.fillRect(0, 0, W, H);
  }

  makeSprites(); resize();
  nextShoot = performance.now() + 2500;
  requestAnimationFrame(frame);
})();
