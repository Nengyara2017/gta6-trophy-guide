// The Leonida Trophy Guide — tracker logic.
//
// Loads app/data/trophies.json (the 55 official trophies with guides and
// sources) and app/data/roadmap.json (the five stages to the platinum),
// renders the roadmap and the checklist, and keeps the checklist's state:
// earned ticks in localStorage, export to a file, import back, filters by
// kind and grade, a search box, a hide-earned switch, and a spoiler switch
// that hides the names and descriptions of hidden story trophies until
// they are earned. Everything runs from local files; no network request.

const STORAGE_KEY = 'gta6-trophy-guide-progress-v1';
const SPOILER_KEY = 'gta6-trophy-guide-spoilers-v1';

const earnedCount = document.getElementById('earnedCount');
const progressFill = document.getElementById('progressFill');
const progressMeta = document.getElementById('progressMeta');
const gradeCounts = document.getElementById('gradeCounts');
const stagesList = document.getElementById('stages');
const warningsBox = document.getElementById('warnings');
const trophyList = document.getElementById('trophyList');
const listCount = document.getElementById('listCount');
const filterNote = document.getElementById('filterNote');
const emptyNote = document.getElementById('emptyNote');
const searchBox = document.getElementById('searchBox');
const gradeFilter = document.getElementById('gradeFilter');
const hideEarnedBox = document.getElementById('hideEarned');
const spoilerToggle = document.getElementById('spoilerToggle');
const savedNote = document.getElementById('savedNote');

let trophies = [];
let sourceMap = {};
let earned = new Set(loadStored(STORAGE_KEY));
let activeKind = 'all';

function loadStored(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort()));
  savedNote.textContent = 'Progress saved in this browser.';
}

function loadJson(path) {
  return fetch(path).then((response) => {
    if (!response.ok) throw new Error(`could not load ${path}`);
    return response.json();
  });
}

function renderRoadmap(roadmap) {
  for (const stage of roadmap.stages) {
    const item = document.createElement('li');
    const heading = document.createElement('h3');
    heading.textContent = `Stage ${stage.stage}: ${stage.name} `;
    const hours = document.createElement('span');
    hours.className = 'stage-hours';
    hours.textContent = `(${stage.hours})`;
    heading.append(hours);
    const summary = document.createElement('p');
    summary.textContent = stage.summary;
    item.append(heading, summary);
    const tips = document.createElement('ul');
    for (const tip of stage.tips) {
      const tipItem = document.createElement('li');
      tipItem.textContent = tip;
      tips.append(tipItem);
    }
    item.append(tips);
    stagesList.append(item);
  }
  for (const warning of roadmap.warnings) {
    const line = document.createElement('p');
    const mark = document.createElement('strong');
    mark.textContent = 'Watch out: ';
    line.append(mark, document.createTextNode(warning));
    warningsBox.append(line);
  }
}

function gradeBadge(trophy) {
  const badge = document.createElement('span');
  badge.className = `badge ${trophy.grade}`;
  badge.textContent = trophy.grade;
  return badge;
}

function kindLabel(trophy) {
  if (trophy.kind === 'platinum') return 'Platinum';
  if (trophy.kind === 'completion') return '100% completion';
  return trophy.kind;
}

function spoilerHidden(trophy) {
  return spoilerToggle.checked && trophy.hidden && !earned.has(trophy.name);
}

function renderTrophy(trophy) {
  const item = document.createElement('li');
  item.className = 'trophy';
  item.id = `trophy-${trophy.id}`;
  if (earned.has(trophy.name)) item.classList.add('earned');
  if (trophy.missable) item.classList.add('missable-flag');

  const top = document.createElement('div');
  top.className = 'trophy-top';
  const check = document.createElement('input');
  check.type = 'checkbox';
  check.className = 'trophy-check';
  check.checked = earned.has(trophy.name);
  check.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
  check.addEventListener('change', () => {
    if (check.checked) earned.add(trophy.name);
    else earned.delete(trophy.name);
    saveProgress();
    renderAll();
  });
  const head = document.createElement('div');
  head.className = 'trophy-head';
  const name = document.createElement('h3');
  name.className = 'trophy-name';
  if (spoilerHidden(trophy)) {
    const hiddenName = document.createElement('span');
    hiddenName.className = 'hidden-name';
    hiddenName.textContent = 'Hidden trophy — earn it to reveal its name';
    name.append(hiddenName);
  } else {
    name.textContent = trophy.name;
  }
  const desc = document.createElement('p');
  desc.className = 'trophy-desc';
  if (spoilerHidden(trophy)) {
    const hiddenDesc = document.createElement('span');
    hiddenDesc.className = 'hidden-desc';
    hiddenDesc.textContent = 'Its description is hidden until you earn it.';
    desc.append(hiddenDesc);
  } else {
    desc.textContent = trophy.description;
  }
  const badges = document.createElement('div');
  badges.className = 'badges';
  badges.append(gradeBadge(trophy));
  if (trophy.hidden) {
    const hiddenBadge = document.createElement('span');
    hiddenBadge.className = 'badge hidden-badge';
    hiddenBadge.textContent = 'Hidden';
    badges.append(hiddenBadge);
  }
  if (trophy.missable) {
    const missableBadge = document.createElement('span');
    missableBadge.className = 'badge missable-badge';
    missableBadge.textContent = 'Missable';
    badges.append(missableBadge);
  }
  if (trophy.kind !== 'platinum') {
    const kindBadge = document.createElement('span');
    kindBadge.className = 'badge kind-badge';
    kindBadge.textContent = kindLabel(trophy);
    badges.append(kindBadge);
  }
  if (trophy.count) {
    const countBadge = document.createElement('span');
    countBadge.className = 'badge count-badge';
    countBadge.textContent = `Count: ${trophy.count.toLocaleString('en-US')}`;
    badges.append(countBadge);
  }
  head.append(name, desc, badges);
  top.append(check, head);
  item.append(top);

  const guide = document.createElement('p');
  guide.className = 'trophy-guide';
  guide.textContent = trophy.guide;
  item.append(guide);

  const sources = document.createElement('p');
  sources.className = 'trophy-sources';
  sources.append(document.createTextNode('Sources: '));
  trophy.sources.forEach((key, index) => {
    const source = sourceMap[key];
    if (!source) return;
    if (index > 0) sources.append(document.createTextNode(' · '));
    const link = document.createElement('a');
    link.href = source.url;
    link.textContent = source.name;
    link.target = '_blank';
    link.rel = 'noopener';
    sources.append(link);
  });
  item.append(sources);
  return item;
}

function trophyMatches(trophy) {
  if (activeKind === 'story' && trophy.kind !== 'story') return false;
  if (activeKind === 'missable' && !trophy.missable) return false;
  if (activeKind === 'collectibles' && trophy.kind !== 'collectibles') return false;
  if (activeKind === 'activities' && trophy.kind !== 'activities') return false;
  if (activeKind === 'online') return false;
  if (gradeFilter.value !== 'all' && trophy.grade !== gradeFilter.value) return false;
  if (hideEarnedBox.checked && earned.has(trophy.name)) return false;
  const query = searchBox.value.trim().toLowerCase();
  if (query) {
    const haystack = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  return true;
}

function renderAll() {
  const shown = trophies.filter(trophyMatches);
  trophyList.replaceChildren();
  for (const trophy of shown) trophyList.append(renderTrophy(trophy));

  earnedCount.textContent = String(earned.size);
  const percent = Math.round((earned.size / trophies.length) * 100);
  progressFill.style.width = `${percent}%`;
  progressMeta.textContent = `${percent}% · about 200 hours to the platinum`;
  const byGrade = {};
  for (const trophy of trophies) {
    if (earned.has(trophy.name)) byGrade[trophy.grade] = (byGrade[trophy.grade] ?? 0) + 1;
  }
  const totals = { platinum: 1, gold: 2, silver: 6, bronze: 46 };
  gradeCounts.textContent = ['platinum', 'gold', 'silver', 'bronze']
    .map((grade) => `${byGrade[grade] ?? 0}/${totals[grade]} ${grade}`)
    .join(' · ');

  listCount.textContent = `Showing ${shown.length} of ${trophies.length} trophies · ${earned.size} earned`;
  if (activeKind === 'online') {
    emptyNote.hidden = false;
    emptyNote.textContent = 'No online trophies: all 55 of GTA VI\u2019s trophies are single-player, so there is nothing to show here.';
    filterNote.textContent = 'Filter: online — 0 trophies.';
  } else if (shown.length === 0) {
    emptyNote.hidden = false;
    emptyNote.textContent = 'No trophies match these filters. Try clearing the search or choosing another kind.';
    filterNote.textContent = '';
  } else {
    emptyNote.hidden = true;
    filterNote.textContent =
      activeKind === 'missable'
        ? 'Filter: missable — only one trophy in the game can be missed. Get it in Chapter 1.'
        : activeKind === 'all'
          ? ''
          : `Filter: ${activeKind}.`;
  }
}

function exportProgress() {
  const blob = new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned].sort() }, null, 2)], {
    type: 'application/json',
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'gta6-trophy-progress.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

function importProgress(file) {
  file
    .text()
    .then((text) => {
      const parsed = JSON.parse(text);
      const names = Array.isArray(parsed) ? parsed : parsed.earned;
      if (!Array.isArray(names)) throw new Error('not a progress file');
      const known = new Set(trophies.map((trophy) => trophy.name));
      earned = new Set(names.filter((name) => known.has(name)));
      saveProgress();
      renderAll();
      savedNote.textContent = `Imported ${earned.size} earned trophies.`;
    })
    .catch(() => {
      savedNote.textContent = 'That file could not be imported — it is not a progress export from this guide.';
    });
}

document.getElementById('exportBtn').addEventListener('click', exportProgress);
document.getElementById('importFile').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) importProgress(file);
  event.target.value = '';
});
document.getElementById('resetBtn').addEventListener('click', () => {
  if (window.confirm('Clear all earned trophies? This cannot be undone.')) {
    earned = new Set();
    saveProgress();
    renderAll();
  }
});
document.getElementById('kindFilters').addEventListener('click', (event) => {
  const button = event.target.closest('button[data-kind]');
  if (!button) return;
  activeKind = button.dataset.kind;
  for (const sibling of document.querySelectorAll('#kindFilters button')) {
    sibling.classList.toggle('active', sibling === button);
  }
  renderAll();
});
searchBox.addEventListener('input', renderAll);
gradeFilter.addEventListener('change', renderAll);
hideEarnedBox.addEventListener('change', renderAll);
spoilerToggle.addEventListener('change', () => {
  localStorage.setItem(SPOILER_KEY, JSON.stringify(spoilerToggle.checked));
  renderAll();
});

try {
  spoilerToggle.checked = JSON.parse(localStorage.getItem(SPOILER_KEY) ?? 'true');
} catch {
  spoilerToggle.checked = true;
}

Promise.all([loadJson('data/trophies.json'), loadJson('data/roadmap.json')])
  .then(([trophyDoc, roadmapDoc]) => {
    trophies = trophyDoc.trophies;
    sourceMap = trophyDoc.sources;
    renderRoadmap(roadmapDoc);
    renderAll();
  })
  .catch((error) => {
    emptyNote.hidden = false;
    emptyNote.textContent = `The guide's data could not be loaded: ${error.message}`;
  });
