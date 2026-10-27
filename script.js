const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const homeScreen = $("#home-screen");
const appScreen = $("#app-screen");
const appContent = $("#app-content");
const appTitle = $("#app-title");
const toastBox = $("#toast");

let activeApp = null;
let calendarOffset = 0;
let musicPlaying = false;
let toastTimer = null;

const appNames = {
  kakao: "KakaoTalk", photos: "Photos", notes: "Notes", instagram: "Instagram",
  calendar: "Calendar", settings: "Settings", music: "Music", safari: "Safari", phone: "Phone"
};

function showToast(message) {
  toastBox.textContent = message;
  toastBox.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastBox.classList.remove("show"), 2300);
}
function updateClock() {
  const now = new Date();
  $("#status-time").textContent = now.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", hour12: false });
  $("#weekday").textContent = now.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
  $("#date-number").textContent = now.getDate();
  $("#date-month").innerHTML = `${now.toLocaleDateString("en-US", { month: "long" }).toUpperCase()}<br><small>make today lovely</small>`;
}
updateClock();
setInterval(updateClock, 30000);

function openApp(app) {
  if (!appNames[app]) return;
  activeApp = app;
  homeScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");
  appTitle.textContent = appNames[app];
  renderApp(app);
}
function goHome() {
  activeApp = null;
  appScreen.classList.add("hidden");
  homeScreen.classList.remove("hidden");
}
function renderApp(app) {
  const renderers = {
    kakao: renderKakao, photos: renderPhotos, notes: renderNotes, instagram: renderInstagram,
    calendar: renderCalendar, settings: renderSettings, music: renderMusic, safari: renderSafari, phone: renderPhone
  };
  (renderers[app] || (() => {}))();
}

$$("[data-app]").forEach(button => button.addEventListener("click", () => openApp(button.dataset.app)));
$("#back-button").addEventListener("click", goHome);
$("#close-button").addEventListener("click", goHome);

function renderKakao() {
  appContent.innerHTML = `
    <h2 class="app-heading">KakaoTalk ♡</h2>
    <p class="app-subheading">your little messages with Yuushi</p>
    <div class="chat-list" id="chat-list">
      <div><div class="chat-bubble">วันนี้เป็นยังไงบ้าง? อย่าลืมพักผ่อนด้วยนะ ♡</div><div class="chat-meta">Yuushi · 09:12</div></div>
      <div><div class="chat-bubble">คิดถึงนะ 🌷</div><div class="chat-meta">Riku · 09:15</div></div>
      <div><div class="chat-bubble mine">เราก็คิดถึงเหมือนกัน!</div><div class="chat-meta" style="text-align:right">You · 09:16</div></div>
    </div>
    <form class="chat-form" id="chat-form"><input class="text-input" id="chat-input" placeholder="พิมพ์ข้อความ..." maxlength="300" autocomplete="off" required><button class="primary-btn">ส่ง</button></form>`;
  $("#chat-form").addEventListener("submit", event => {
    event.preventDefault();
    const input = $("#chat-input");
    const message = input.value.trim();
    if (!message) return;
    const bubble = document.createElement("div");
    bubble.innerHTML = `<div class="chat-bubble mine"></div><div class="chat-meta" style="text-align:right">You · now</div>`;
    $(".chat-bubble", bubble).textContent = message;
    $("#chat-list").appendChild(bubble);
    input.value = "";
    bubble.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

function renderPhotos() {
  appContent.innerHTML = `
    <h2 class="app-heading">Little memories ✿</h2>
    <p class="app-subheading">a tiny album of lovely things</p>
    <div class="photo-grid">
      <div class="photo-tile"><span class="emoji">🌷</span><div><strong>spring day</strong><br><small>soft and slow</small></div></div>
      <div class="photo-tile"><span class="emoji">☁️</span><div><strong>cloud watching</strong><br><small>somewhere peaceful</small></div></div>
      <div class="photo-tile"><span class="emoji">🍵</span><div><strong>little break</strong><br><small>tea time</small></div></div>
      <div class="photo-tile"><span class="emoji">🎀</span><div><strong>pink things</strong><br><small>favorite colors</small></div></div>
    </div>
    <p class="app-subheading" style="margin:18px 0 0">These are decorative placeholders. You can replace them with your own pictures later.</p>`;
}

function renderNotes() {
  appContent.innerHTML = `
    <h2 class="app-heading">My Notes 📝</h2>
    <p class="app-subheading">your thoughts, saved on this device</p>
    <textarea id="notes-text" class="text-area" placeholder="เขียนอะไรเก็บไว้ตรงนี้..."></textarea>
    <div style="display:flex;gap:9px;margin-top:12px;flex-wrap:wrap"><button class="primary-btn" id="save-note">Save note</button><button class="soft-btn" id="clear-note">Clear</button></div>
    <p class="app-subheading" style="margin:14px 0 0">โน้ตจะบันทึกไว้ในเบราว์เซอร์เครื่องนี้ด้วย localStorage</p>`;
  const notes = $("#notes-text");
  notes.value = localStorage.getItem("yuushi-notes") || "";
  $("#save-note").addEventListener("click", () => {
    localStorage.setItem("yuushi-notes", notes.value);
    showToast("บันทึกโน้ตแล้ว ♡");
  });
  $("#clear-note").addEventListener("click", () => {
    if (confirm("ต้องการล้างข้อความในโน้ตไหม?")) {
      notes.value = "";
      localStorage.removeItem("yuushi-notes");
      showToast("ล้างโน้ตแล้ว");
    }
  });
}

function renderInstagram() {
  appContent.innerHTML = `
    <h2 class="app-heading">Instagram ◎</h2>
    <p class="app-subheading">@yuushi.diary · little moments</p>
    <article class="feed-card"><div class="feed-art">🌸</div><div class="feed-caption"><strong>yuushi.diary ♡</strong> a little flower for your day. don't forget to smile!<br><span style="color:#c77b9b">♡ 128 likes</span></div></article>
    <article class="feed-card"><div class="feed-art">☕</div><div class="feed-caption"><strong>yuushi.diary ♡</strong> slow mornings, warm drinks, and peaceful thoughts.<br><span style="color:#c77b9b">♡ 96 likes</span></div></article>
    <button class="soft-btn" id="like-post">♡ Like a post</button>`;
  $("#like-post").addEventListener("click", () => showToast("liked ♡ (demo)"));
}

function renderCalendar() {
  const base = new Date();
  const monthDate = new Date(base.getFullYear(), base.getMonth() + calendarOffset, 1);
  const year = monthDate.getFullYear(), month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const cells = [];
  ["SUN","MON","TUE","WED","THU","FRI","SAT"].forEach(d => cells.push(`<span class="day-name">${d}</span>`));
  for (let i = 0; i < firstDay; i++) cells.push("<span></span>");
  for (let day = 1; day <= days; day++) {
    const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
    const hasEvent = day === 14 || day === 22;
    cells.push(`<span class="${isToday ? "today" : hasEvent ? "has-event" : ""}" title="${hasEvent ? "a little memory ♡" : ""}">${day}</span>`);
  }
  appContent.innerHTML = `
    <h2 class="app-heading">Calendar ♡</h2><p class="app-subheading">make room for lovely days</p>
    <div class="calendar-month"><button id="prev-month" aria-label="Previous month">‹</button><strong>${monthDate.toLocaleDateString("en-US",{month:"long",year:"numeric"})}</strong><button id="next-month" aria-label="Next month">›</button></div>
    <div class="calendar-grid">${cells.join("")}</div>
    <p class="app-subheading" style="margin:20px 0 0">♡ วันที่มีพื้นหลังสีม่วงเป็นวันที่ทำเครื่องหมายไว้ในตัวอย่าง</p>`;
  $("#prev-month").addEventListener("click", () => { calendarOffset--; renderCalendar(); });
  $("#next-month").addEventListener("click", () => { calendarOffset++; renderCalendar(); });
}

function renderSettings() {
  appContent.innerHTML = `
    <h2 class="app-heading">Settings ⚙</h2><p class="app-subheading">make your little phone feel like you</p>
    <div class="setting-row"><span>Device name</span><strong>Yuushi's phone</strong></div>
    <div class="setting-row"><span>Wallpaper theme</span><div class="swatches">
      <button class="swatch" style="background:linear-gradient(135deg,#f9e6ed,#e6e0f5)" data-theme="pink" aria-label="Pink theme" aria-pressed="true"></button>
      <button class="swatch" style="background:linear-gradient(135deg,#e8e2fa,#d8e8f4)" data-theme="lavender" aria-label="Lavender theme" aria-pressed="false"></button>
      <button class="swatch" style="background:linear-gradient(135deg,#d8eee1,#d4eaf0)" data-theme="mint" aria-label="Mint theme" aria-pressed="false"></button>
      <button class="swatch" style="background:linear-gradient(135deg,#332c49,#55405b)" data-theme="night" aria-label="Night theme" aria-pressed="false"></button>
    </div></div>
    <div class="setting-row"><span>Sound</span><button class="soft-btn" id="sound-demo">Test sound</button></div>
    <div class="setting-row"><span>About</span><span style="color:var(--muted)">Virtual Phone v1.0</span></div>`;
  const savedTheme = localStorage.getItem("yuushi-theme") || "pink";
  $$("[data-theme]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.theme === savedTheme));
    button.addEventListener("click", () => {
      setTheme(button.dataset.theme);
      $$("[data-theme]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
      showToast("เปลี่ยนธีมแล้ว ✦");
    });
  });
  $("#sound-demo").addEventListener("click", () => showToast("นี่เป็นเว็บจำลอง ไม่มีเสียงระบบ"));
}
function setTheme(theme) {
  document.body.classList.remove("theme-lavender", "theme-mint", "theme-night");
  if (theme !== "pink") document.body.classList.add(`theme-${theme}`);
  localStorage.setItem("yuushi-theme", theme);
}
setTheme(localStorage.getItem("yuushi-theme") || "pink");

const tracks = [
  { title: "Soft Daydream", artist: "Yuushi's playlist", icon: "🌷" },
  { title: "Clouds & Tea", artist: "little afternoon", icon: "☁️" },
  { title: "Sweet Memory", artist: "for you ♡", icon: "🎀" }
];
let trackIndex = 0;
function renderMusic() {
  const track = tracks[trackIndex];
  appContent.innerHTML = `
    <h2 class="app-heading">Music ♫</h2><p class="app-subheading">a playlist for a softer day</p>
    <div class="music-player"><div class="album-art">${track.icon}</div><p class="track-title">${track.title}</p><p class="track-artist">${track.artist}</p>
    <div class="music-controls"><button id="previous-track" aria-label="Previous track">◀</button><button class="play-btn" id="toggle-music" aria-label="Play or pause">${musicPlaying ? "Ⅱ" : "▶"}</button><button id="next-track" aria-label="Next track">▶</button></div>
    <p class="app-subheading" style="margin:18px 0 0">${musicPlaying ? "Playing demo animation…" : "เลือกเพลงแล้วกดเล่น"}</p></div>
    <p class="app-subheading">หมายเหตุ: ปุ่มเล่นเป็นการจำลองสถานะ ยังไม่ได้เล่นไฟล์เสียงจริง</p>`;
  $("#toggle-music").addEventListener("click", () => { musicPlaying = !musicPlaying; renderMusic(); });
  $("#previous-track").addEventListener("click", () => { trackIndex = (trackIndex + tracks.length - 1) % tracks.length; renderMusic(); });
  $("#next-track").addEventListener("click", () => { trackIndex = (trackIndex + 1) % tracks.length; renderMusic(); });
}

function renderSafari() {
  appContent.innerHTML = `
    <h2 class="app-heading">Safari ◉</h2><p class="app-subheading">a tiny browser window</p>
    <form class="browser-bar" id="browser-form"><input class="search-input" id="browser-query" placeholder="ค้นหาหรือใส่ URL..." value="https://example.com"><button class="primary-btn">Go</button></form>
    <div class="browser-page" id="browser-page"><div style="color:var(--muted);font-size:11px">WELCOME TO</div><div class="browser-logo">your little web ✦</div><p style="font-size:13px;line-height:1.7">พิมพ์ URL แล้วกด Go เพื่อเปิดเว็บไซต์ในแท็บใหม่ หรือเลือกเว็บตัวอย่างด้านล่าง</p>
      <div class="browser-links"><button data-url="https://www.google.com">Google</button><button data-url="https://www.youtube.com">YouTube</button><button data-url="https://www.pinterest.com">Pinterest</button></div></div>
    <p class="app-subheading" style="margin:15px 0 0">เพื่อความปลอดภัย เว็บไซต์จะเปิดในแท็บใหม่ ไม่แสดงหน้าเว็บภายนอกภายในโทรศัพท์นี้</p>`;
  const navigate = raw => {
    let value = raw.trim();
    if (!value) return;
    if (!/^https?:\\/\\//i.test(value)) value = value.includes(".") && !value.includes(" ") ? `https://${value}` : `https://www.google.com/search?q=${encodeURIComponent(value)}`;
    try {
      const url = new URL(value);
      if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("invalid");
      window.open(url.href, "_blank", "noopener,noreferrer");
    } catch { showToast("URL นี้ไม่ถูกต้อง ลองใหม่อีกครั้ง"); }
  };
  $("#browser-form").addEventListener("submit", event => { event.preventDefault(); navigate($("#browser-query").value); });
  $$("[data-url]").forEach(button => button.addEventListener("click", () => navigate(button.dataset.url)));
}

function renderPhone() {
  appContent.innerHTML = `
    <h2 class="app-heading">Phone ☎</h2><p class="app-subheading">recent calls · simulated</p>
    <div class="call-list">
      <div class="call-person"><div class="avatar">🌷</div><div class="person-info"><strong>Tokuno Yuushi</strong><small>Incoming call · Today, 09:41</small></div><button data-call="Tokuno Yuushi" aria-label="Call Yuushi">☎</button></div>
      <div class="call-person"><div class="avatar">🐰</div><div class="person-info"><strong>Riku</strong><small>Outgoing call · Yesterday</small></div><button data-call="Riku" aria-label="Call Riku">☎</button></div>
      <div class="call-person"><div class="avatar">☁️</div><div class="person-info"><strong>Unknown</strong><small>Missed call · Monday</small></div><button data-call="Unknown" aria-label="Call unknown">☎</button></div>
    </div>
    <p class="app-subheading" style="margin:18px 0 0">นี่เป็นประวัติการโทรจำลอง ไม่ได้โทรออกจริง</p>`;
  $$("[data-call]").forEach(button => button.addEventListener("click", () => showToast(`จำลองการโทรหา ${button.dataset.call} ♡`)));
}
