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
  if (file) sec.querySelector(".bg").style.setProperty("--bg-img", `url('${file}')`);
});
$("#detail .bg").style.setProperty("--bg-img", `url('${SITE.backgrounds.detail}')`);

/* ---------- Page 2: current ---------- */
$("#currentList").innerHTML = SITE.current.map((c) => `
  <article class="wide-card"><h3>${c.title}</h3><p>${c.text}</p></article>`).join("");

/* ---------- Page 3: experiences ---------- */
$("#expGrid").innerHTML = EXPERIENCES.map((e) => `
  <button class="card exp-card" data-open="exp/${e.id}">
    <div class="cover" style="${imgStyle(e.cover)}"></div>
    <div class="txt"><h3>${e.title}</h3><p>${e.short}</p></div>
  </button>`).join("");

/* ---------- Page 4: skills ---------- */
$("#skillGrid").innerHTML = SKILLS.map((s, i) => {
  const chips = s.items.map((x) => `<span class="chip">${x}</span>`).join("");
  return s.story
    ? `<button class="card skill-card clickable" data-open="skill/${i}"><h3>${s.title}</h3><div class="chips">${chips}</div><span class="more">Read more →</span></button>`
    : `<div class="card skill-card"><h3>${s.title}</h3><div class="chips">${chips}</div></div>`;
}).join("");

/* ---------- Page 5: awards ---------- */
$("#awardGrid").innerHTML = AWARDS.map((a) => `
  <button class="card award-card" data-open="award/${a.id}">
    <div class="pic" style="${imgStyle(a.image)}"></div>
    <div class="body"><h3>${a.title}</h3><p>${a.short}</p></div>
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
      <h2>What I did and will be doing</h2>
      <ul>${e.did.map((d) => `<li>${d}</li>`).join("")}</ul>
      <div class="skills-learned"><h2>Skills I learned</h2>${chipsOf(e.skills)}</div>`;
    return true;
  }

  if (type === "award") {
    const a = AWARDS.find((x) => x.id === id);
    if (!a) return false;
    detailInner.innerHTML = `${back}
      <h1>${a.title}</h1>
      <p class="meta">${a.org} · ${a.date}</p>
      <div class="hero-shot" style="${imgStyle(a.image)}"></div>
      <p>${a.details}</p>`;
    return true;
  }

  if (type === "skill") {
    const s = SKILLS[Number(id)];
    if (!s) return false;
    detailInner.innerHTML = `${back}
      <h1>${s.title}</h1>
      <p class="meta">What I can do with these</p>
      ${chipsOf(s.items)}
      <h2>My story</h2>
      <p>${s.story}</p>`;
    return true;
  }
  return false;
}

function openDetail(route) {
  if (!renderDetail(route)) return closeDetail(true);
  $("#backBtn").addEventListener("click", () => history.back());
  detail.classList.add("open");
  detail.setAttribute("aria-hidden", "false");
  document.body.classList.add("locked");
  detail.querySelector(".detail-scroll").scrollTop = 0;
}
function closeDetail(silent) {
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

window.addEventListener("wheel", (e) => {
  if (!desktopMode.matches || document.body.classList.contains("locked")) return; // let opened pages scroll normally
  e.preventDefault();
  const now = Date.now();
  const newGesture = now - lastWheelTime > 100;   // ignores trackpad "inertia" events from the same swipe
  lastWheelTime = now;
  if (pageLock || !newGesture || Math.abs(e.deltaY) < 4) return;
  goToPage(currentPage() + (e.deltaY > 0 ? 1 : -1));
}, { passive: false });

window.addEventListener("keydown", (e) => {
  if (!desktopMode.matches || document.body.classList.contains("locked") || pageLock) return;
  if (["ArrowDown", "PageDown", " "].includes(e.key)) { e.preventDefault(); goToPage(currentPage() + 1); }
  if (["ArrowUp", "PageUp"].includes(e.key))          { e.preventDefault(); goToPage(currentPage() - 1); }
});

// Touch swipe (for touchscreens in desktop mode)
let touchStartY = null;
window.addEventListener("touchstart", (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });
window.addEventListener("touchend", (e) => {
  if (!desktopMode.matches || document.body.classList.contains("locked") || pageLock || touchStartY === null) return;
  const dy = touchStartY - e.changedTouches[0].clientY;
  touchStartY = null;
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
      quoteEl = $("#introQuote"), typeBox = $("#introType"), typeText = $("#typeText"),
      startHint = $("#introStart"), skipBtn = $("#introSkip"), musicBtn = $("#musicBtn"), campusImg = $("#introCampus");

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

    // 5) car dissolves and the thank-you message appears in the centre
    typeText.textContent = "Thankyou Everyone";
    typeBox.classList.remove("name-reveal");
    typeBox.classList.add("thankyou-text", "morph-in");
    carEl.style.transition = "transform 900ms ease, opacity 900ms ease, filter 900ms ease";
    carEl.style.transform = carX(0, 0.35);
    carEl.style.opacity = "0";
    carEl.style.filter = "blur(14px)";
    await wait(1500);

    // 6) show the campus photo for about one second
    campusImg.classList.add("show");
    typeBox.classList.remove("morph-in");
    typeBox.style.opacity = "0";
    await wait(1000);
    // 7) Skip the centered name overlay and reveal the actual portfolio page.
    // The JHE photo remains visible behind the intro as it fades away.
    typeBox.classList.remove("thankyou-text", "name-reveal", "caret-on", "morph-in");
    typeBox.style.opacity = "0";
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
  startSong();
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
  startSong();
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