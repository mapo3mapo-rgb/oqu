"use strict";
const valid = new Set(IDS);
function load(k) {
  try {
    const a = JSON.parse(localStorage.getItem(k) || "[]");
    if (!Array.isArray(a)) return [];
    return [...new Set(a.map(String))].filter(x => valid.has(x));
  } catch (e) { return []; }
}
let s = load("oqusaved");
let c = load("oqucompare").slice(0, 3);
let timer;
function message(t) {
  const a = document.getElementById("message");
  a.textContent = t; a.hidden = false;
  clearTimeout(timer); timer = setTimeout(() => a.hidden = true, 3500);
}
function store() {
  try {
    localStorage.setItem("oqusaved", JSON.stringify(s));
    localStorage.setItem("oqucompare", JSON.stringify(c));
  } catch (e) { message("Хранилище недоступно: список сохранится только до обновления страницы."); }
}
function update() {
  document.getElementById("savedcount").textContent = s.length;
  document.getElementById("comparecount").textContent = c.length;
  const u = "/compare?ids=" + c.join(",");
  document.getElementById("comparelink").href = u;
  document.getElementById("barlink").href = u;
  document.getElementById("bar").hidden = !c.length;
  document.getElementById("bartext").textContent = "Выбрано " + c.length + " из 3 курсов";
  document.querySelectorAll("[data-save]").forEach(a => {
    const b = s.includes(a.dataset.save);
    a.setAttribute("aria-pressed", String(b));
    a.textContent = a.classList.contains("save") ? (b ? "♥" : "♡") : (b ? "В избранном ✓" : "В избранное");
  });
  document.querySelectorAll("[data-compare]").forEach(a => {
    const b = c.includes(a.dataset.compare);
    a.setAttribute("aria-pressed", String(b));
    a.textContent = b ? "В сравнении ✓" : "＋ Сравнить";
  });
  if (document.querySelector('[data-saved="yes"]')) {
    let n = 0;
    document.querySelectorAll("[data-card]").forEach(a => {
      a.hidden = !s.includes(a.dataset.card); if (!a.hidden) n++;
    });
    document.getElementById("resultcount").textContent = n + " вариантов";
    document.getElementById("empty").hidden = n > 0;
  }
}
document.querySelectorAll("[data-save]").forEach(a => a.addEventListener("click", () => {
  const n = a.dataset.save;
  if (s.includes(n)) s = s.filter(x => x !== n); else s.push(n);
  store(); update();
}));
document.querySelectorAll("[data-compare]").forEach(a => a.addEventListener("click", () => {
  const n = a.dataset.compare;
  if (c.includes(n)) c = c.filter(x => x !== n);
  else if (c.length < 3) c.push(n);
  else { message("Можно сравнить до трёх курсов. Уберите один из выбранных."); return; }
  store(); update();
}));
document.querySelectorAll("[data-remove]").forEach(a => a.addEventListener("click", () => {
  const q = new URLSearchParams(location.search);
  c = [...new Set((q.get("ids") || "").split(","))].filter(x => valid.has(x) && x !== a.dataset.remove).slice(0,3);
  store(); location.href = "/compare?ids=" + c.join(",");
}));
document.getElementById("clearcompare").addEventListener("click", () => {
  c = []; store(); update();
  if (location.pathname === "/compare") location.href = "/compare";
});
if (location.pathname === "/compare") {
  c = [...new Set((new URLSearchParams(location.search).get("ids") || "").split(","))].filter(x => valid.has(x)).slice(0,3);
  store();
}
const box = document.querySelector(".filterbox");
if (box && window.matchMedia("(max-width:760px)").matches) box.open = false;
window.addEventListener("storage", () => { s = load("oqusaved"); c = load("oqucompare").slice(0,3); update(); });
update();
