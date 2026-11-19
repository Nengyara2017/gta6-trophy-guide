// Filtering and the spoiler rule for the trophy list.
export const KIND_LABELS = {
  story: "Story",
  side: "Side story",
  collectible: "Collectible",
  activity: "Activity",
  crime: "Crime",
  world: "World",
  platinum: "Platinum",
};

// A trophy is spoiler-hidden when spoiler-free mode is on, it is a story trophy,
// and the player has not earned it yet.
export function isSpoilerHidden(trophy, earned, spoilerOn) {
  return spoilerOn && trophy.kind === "story" && !earned.has(trophy.id);
}

export function filterTrophies(trophies, { kind, grade, query }) {
  const q = (query || "").trim().toLowerCase();
  return trophies.filter((t) => {
    if (kind === "missable" && !t.missable) return false;
    if (kind === "crime" && t.kind !== "crime" && t.kind !== "world") return false;
    if (kind !== "all" && kind !== "missable" && kind !== "crime" && t.kind !== kind) return false;
    if (grade !== "all" && t.grade !== grade) return false;
    if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))) return false;
    return true;
  });
}

// Next up: the first unearned trophies in roadmap order (stage, then id).
export function nextUpTrophies(trophies, earned, limit = 3) {
  return [...trophies]
    .filter((t) => !earned.has(t.id))
    .sort((a, b) => (a.stage - b.stage) || (a.id - b.id))
    .slice(0, limit);
}
