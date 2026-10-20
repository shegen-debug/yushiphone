
let code = "";

function updateTime() {
  const now = new Date();

  const time = now.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  document.getElementById("clock").textContent = time;
  document.getElementById("time").textContent = time;

  document.getElementById("date").textContent =
    now.toLocaleDateString("th-TH", {
      weekday: "long",
      day: "numeric",
      month: "long"
    });
}

updateTime();
setInterval(updateTime, 1000);

function unlock() {
  document.getElementById("lock").classList.add("hidden");
  document.getElementById("passcode").classList.remove("hidden");
}

function press(number) {
  if (code.length >= 4) return;

  code += number;

  document.getElementById("dots").textContent =
    [...Array(4)].map((_, i) =>
      i < code.length ? "●" : "○"
    ).join(" ");

  if (code.length === 4) {
    setTimeout(checkCode, 200);
  }
}

function clearCode() {
  code = "";
  document.getElementById("dots").textContent = "○ ○ ○ ○";
  document.getElementById("message").textContent = "";
}

function checkCode() {
  if (code === "4503") {
    document.getElementById("passcode").classList.add("hidden");
    document.getElementById("home").classList.remove("hidden");
  } else {
    document.getElementById("message").textContent =
      "รหัสผิด ลองอีกครั้งนะ ♡";
    clearCode();
  }
}

function openApp(title, content) {
  document.getElementById("home").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  document.getElementById("app-title").textContent = title;
  document.getElementById("app-content").textContent = content;
}

function goHome() {
  document.getElementById("app").classList.add("hidden");
  document.getElementById("home").classList.remove("hidden");
}
