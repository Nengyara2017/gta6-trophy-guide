// Leonida Ledger boot: load the trophy data, wire the tracker, render the views.
import { loadEarned, saveEarned, toggleEarned, exportProgress, importProgressFile } from "./store.js";
import { filterTrophies, nextUpTrophies } from "./filters.js";
import { renderChecklist, renderDetail, renderRoadmap, renderMissables, escapeHtml } from "./views.js";

const state = {
  trophies: [],
  roadmap: null,
  earned: loadEarned(),
  view: "checklist",
  kind: "all",
  grade: "all",
  query: "",
  spoiler: false,
  selectedId: 28,
};

const $ = (id) => document.getElementById(id);
const listEl = $("trophyList");
const noteEl = $("listNote");
const detailEl = $("detailPane");
const roadmapEl = $("roadmapPane");
const missablesEl = $("missablesPane");

function selectedTrophy() {
  return state.trophies.find((t) => t.id === state.selectedId) || state.trophies[0];
}

function renderProgress() {
  const n = state.earned.size;
  const pct = Math.round((n / 55) * 100);
  $("earnedCount").textContent = `${n} / 55`;
  $("earnedPct").textContent = `${pct}% to the platinum`;
  $("earnedBar").style.width = `${pct}%`;
  const next = nextUpTrophies(state.trophies, state.earned, 3);
  $("nextUp").innerHTML = next.length
    ? `Next up: ${next.map((t) => `<b>${escapeHtml(t.name)}</b>`).join(" · ")}`
    : `Platinum earned — you're a Leonida Legend.`;
}

function renderAll() {
  renderProgress();
  const filtered = filterTrophies(state.trophies, state);
  renderChecklist(listEl, noteEl, filtered, state.earned, state.spoiler);
  renderDetail(detailEl, selectedTrophy(), state.earned, state.spoiler);
  if (state.roadmap) renderRoadmap(roadmapEl, state.roadmap, state.trophies, state.earned);
  renderMissables(missablesEl, state.trophies);
  document.querySelectorAll(".trophy-row").forEach((row) => {
    if (Number(row.dataset.id) === state.selectedId) row.classList.add("is-selected");
  });
}

function setView(view) {
  state.view = view;
  document.querySelectorAll(".view-tab").forEach((b) => b.classList.toggle("is-active", b.dataset.view === view));
  const showList = view === "checklist";
  document.querySelector(".layout").hidden = !showList;
  document.querySelector(".controls").hidden = !showList;
  roadmapEl.hidden = view !== "roadmap";
  missablesEl.hidden = view !== "missables";
}

function wireEvents() {
  document.querySelectorAll(".view-tab").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));
  document.querySelectorAll("#kindChips .chip").forEach((chip) => chip.addEventListener("click", () => {
    state.kind = chip.dataset.kind;
    document.querySelectorAll("#kindChips .chip").forEach((c) => c.classList.toggle("is-active", c === chip));
    renderAll();
  }));
  $("gradeSelect").addEventListener("change", (e) => { state.grade = e.target.value; renderAll(); });
  $("searchInput").addEventListener("input", (e) => { state.query = e.target.value; renderAll(); });
  $("spoilerToggle").addEventListener("change", (e) => { state.spoiler = e.target.checked; renderAll(); });
  $("exportBtn").addEventListener("click", () => exportProgress(state.earned));
  $("importInput").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      state.earned = await importProgressFile(file);
      saveEarned(state.earned);
      renderAll();
    } catch (err) {
      alert(`Could not import that file: ${err.message}`);
    }
    e.target.value = "";
  });
  $("resetBtn").addEventListener("click", () => {
    if (!confirm("Clear all earned trophies?")) return;
    state.earned = new Set();
    saveEarned(state.earned);
    renderAll();
  });
  listEl.addEventListener("click", (e) => {
    const row = e.target.closest(".trophy-row");
    if (!row) return;
    const id = Number(row.dataset.id);
    if (e.target.matches("input[type=checkbox]")) {
      e.preventDefault();
      state.earned = toggleEarned(state.earned, id);
      state.selectedId = id;
      renderAll();
      return;
    }
    state.selectedId = id;
    renderAll();
  });
}

async function bootLeonidaLedger() {
  const [trophiesRes, roadmapRes] = await Promise.all([
    fetch("data/trophies.json"),
    fetch("data/roadmap.json"),
  ]);
  const trophiesDoc = await trophiesRes.json();
  state.trophies = trophiesDoc.trophies;
  state.roadmap = await roadmapRes.json();
  const hash = new URLSearchParams(location.hash.slice(1));
  const hashId = Number(hash.get("t"));
  if (hashId && state.trophies.some((t) => t.id === hashId)) state.selectedId = hashId;
  if (hash.get("spoiler") === "1") { state.spoiler = true; $("spoilerToggle").checked = true; }
  if (hash.get("view") === "roadmap" || hash.get("view") === "missables") setView(hash.get("view"));
  wireEvents();
  renderAll();
}

bootLeonidaLedger();
