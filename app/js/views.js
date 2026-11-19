// Rendering: checklist rows, the guide detail pane, roadmap and missables views.
import { KIND_LABELS, isSpoilerHidden } from "./filters.js";

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

export function gradeMedal(grade) {
  return `<span class="medal ${escapeHtml(grade)}" title="${escapeHtml(grade)}"></span>`;
}

export function trophyRowHtml(t, earned, spoilerOn) {
  const hidden = isSpoilerHidden(t, earned, spoilerOn);
  const name = hidden ? "Hidden story trophy" : t.name;
  const desc = hidden ? "Earn it to reveal its name and description." : t.description;
  const tags = [`<span class="tag grade">${escapeHtml(t.grade)}</span>`];
  if (t.kind !== "platinum") tags.push(`<span class="tag">${escapeHtml(KIND_LABELS[t.kind] || t.kind)}</span>`);
  if (t.missable) tags.push(`<span class="tag missable">Missable</span>`);
  if (t.hidden) tags.push(`<span class="tag">Hidden on PSN</span>`);
  const count = t.count ? `<span class="trophy-count"><b>0 / ${t.count}</b><br>PSN target</span>` : `<span class="trophy-count">${escapeHtml(t.time || "")}</span>`;
  return `<li><button type="button" class="trophy-row${earned.has(t.id) ? " is-earned" : ""}" data-id="${t.id}">
    <input type="checkbox" tabindex="-1" ${earned.has(t.id) ? "checked" : ""} aria-label="Earned: ${escapeHtml(name)}">
    ${gradeMedal(t.grade)}
    <span><span class="trophy-name">${escapeHtml(name)}</span>
    <span class="trophy-desc">${escapeHtml(desc)}</span>
    <span class="trophy-tags">${tags.join("")}</span></span>
    ${count}
  </button></li>`;
}

export function renderChecklist(listEl, noteEl, trophies, earned, spoilerOn) {
  listEl.innerHTML = trophies.map((t) => trophyRowHtml(t, earned, spoilerOn)).join("");
  noteEl.textContent = trophies.length === 0
    ? "No trophies match these filters."
    : `Showing ${trophies.length} of 55 trophies — tick a trophy when you earn it; click a row to open its guide.`;
}

export function renderDetail(paneEl, trophy, earned, spoilerOn) {
  if (!trophy) { paneEl.innerHTML = `<p class="empty-note">Pick a trophy to open its guide.</p>`; return; }
  const hidden = isSpoilerHidden(trophy, earned, spoilerOn);
  if (hidden) {
    paneEl.innerHTML = `<p class="detail-grade">Story trophy · ${escapeHtml(trophy.grade)}</p>
      <h2>Hidden story trophy</h2>
      <p class="spoiler-hidden">Spoiler-free mode is on. Earn this trophy in the game to reveal its name, description and guide — or switch spoiler-free off above.</p>`;
    return;
  }
  const warn = trophy.missable
    ? `<div class="warn-box"><strong>Missable — read before Chapter 1 ends.</strong> One meditation spot, at Jason's house in Chapter 1, disappears once the chapter ends. There is no mission replay. Do it during Chapter 1.</div>`
    : "";
  const steps = (trophy.steps || []).map((s) => `<li>${escapeHtml(s)}</li>`).join("");
  const sources = (trophy.sources || []).map((s) => `<li><a href="${escapeHtml(s.url)}" target="_blank" rel="noopener">${escapeHtml(s.name)}</a></li>`).join("");
  paneEl.innerHTML = `<p class="detail-grade">${escapeHtml(trophy.grade)} · ${escapeHtml(KIND_LABELS[trophy.kind] || trophy.kind)}${trophy.hidden ? " · hidden on PSN" : ""}</p>
    <h2>${escapeHtml(trophy.name)}</h2>
    <p class="detail-desc">“${escapeHtml(trophy.description)}” — official PlayStation description.</p>
    ${warn}
    <p class="detail-guide">${escapeHtml(trophy.guide)}</p>
    <p><span class="time-chip">Time: ${escapeHtml(trophy.time || "—")}</span>${trophy.count ? ` <span class="time-chip">PSN target: ${trophy.count}</span>` : ""}</p>
    <h3>How to do it</h3>
    <ol class="steps">${steps}</ol>
    <h3>Sources</h3>
    <ul class="sources">${sources}</ul>
    <p class="spoiler-hidden">Guides are written for this entry, in our own words. Sources are cited, never copied.</p>`;
}

export function renderRoadmap(paneEl, roadmap, trophies, earned) {
  const byId = new Map(trophies.map((t) => [t.id, t]));
  const stages = roadmap.stages.map((s) => {
    const chips = s.trophies.map((id) => {
      const t = byId.get(id);
      if (!t) return "";
      return `<span class="${earned.has(id) ? "done" : ""}">${earned.has(id) ? "✓ " : ""}${escapeHtml(t.name)}</span>`;
    }).join("");
    return `<section class="stage"><h3><span class="stage-num">Stage ${s.n}.</span> ${escapeHtml(s.title)}</h3>
      <p class="stage-meta">${escapeHtml(s.time)} · ${escapeHtml(s.goal)}</p>
      <ul>${s.notes.map((n) => `<li>${escapeHtml(n)}</li>`).join("")}</ul>
      <div class="stage-trophies">${chips}</div></section>`;
  }).join("");
  paneEl.innerHTML = `<div class="roadmap-intro"><h2>${escapeHtml(roadmap.title)}</h2>
    <p>${escapeHtml(roadmap.total)}</p>
    <div class="warn-box"><strong>Save discipline:</strong> ${escapeHtml(roadmap.saveRule)}</div>
    <p>Sources: ${roadmap.sources.map((s) => `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener">${escapeHtml(s.name)}</a>`).join(" · ")}</p></div>${stages}`;
}

export function renderMissables(paneEl, trophies) {
  const missable = trophies.filter((t) => t.missable);
  const hiddenOnes = trophies.filter((t) => t.hidden && !t.missable);
  const cards = missable.map((t) => `<section class="stage missable-card"><h3><span class="stage-num">Missable.</span> ${escapeHtml(t.name)}</h3>
    <p class="stage-meta">${escapeHtml(t.grade)} · ${escapeHtml(t.description)}</p>
    <p>${escapeHtml(t.guide)}</p>
    <ol class="steps">${(t.steps || []).map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ol></section>`).join("");
  paneEl.innerHTML = `<div class="missables-intro"><h2>Missables — read this first</h2>
    <p><strong>Good news: there is exactly 1 missable trophy in GTA 6.</strong> The launch-day guides (PowerPyx, Output Lag) confirm it: Positive Mental Attitude, because one meditation spot in Chapter 1 disappears after that chapter. There is no mission replay and no New Game Plus at launch, so a manual save at the start of every chapter is your insurance.</p>
    <p>Every other trophy stays earnable after the credits — story finales, activities, collectibles and the 100% checklist all remain open in free roam.</p></div>
    ${cards}
    <section class="stage"><h3>Hidden on PSN — not missable, just secret</h3>
    <p>${hiddenOnes.length} trophies are hidden on PlayStation until you earn them. They are not missable: they stay available after the story. Spoiler-free mode hides story trophies until earned; use it if you want the story fresh.</p>
    <div class="stage-trophies">${hiddenOnes.map((t) => `<span>${escapeHtml(t.name)}</span>`).join("")}</div></section>`;
}
