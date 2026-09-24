const divisionLoot = [
  { icon: "🪄", name: "Slimewood Wand", description: "Carved from the Beginner Woods. Proof that the first division spells are yours." },
  { icon: "🧤", name: "Goblin Counting Gloves", description: "A pair of lucky gloves from Goblin Camp." },
  { icon: "🛡️", name: "Keeper's Rune Shield", description: "Recovered from Stone Castle after mastering mixed division." },
  { icon: "🔮", name: "Mimic's Number Orb", description: "A strange orb from the Shadow Cave that glows around tricky numbers." },
  { icon: "🐉", name: "Dragon Division Crown", description: "The final trophy of Division Quest. Worn by a true Division Master." }
];

const zones = [
  { name: "Beginner Woods", icon: "🌲", divs: [2, 5, 10], goal: 8, monster: "Number Slime", emoji: "👾", rank: "Rookie", skill: "Master ÷2, ÷5 and ÷10" },
  { name: "Goblin Camp", icon: "⛺", divs: [2, 3, 4, 5, 10], goal: 10, monster: "Counting Goblin", emoji: "👺", rank: "Scout", skill: "Add ÷3 and ÷4" },
  { name: "Stone Castle", icon: "🏰", divs: [2, 3, 4, 5, 6, 10], goal: 12, monster: "Bone Keeper", emoji: "💀", rank: "Knight", skill: "Add ÷6 and mixed review" },
  { name: "Shadow Cave", icon: "🕳️", divs: [2, 3, 4, 5, 6, 7, 8, 9, 10], goal: 15, monster: "Math Mimic", emoji: "🦇", rank: "Hero", skill: "Add ÷7, ÷8 and ÷9" },
  { name: "Dragon Peak", icon: "🌋", divs: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], goal: 18, monster: "Division Dragon", emoji: "🐲", rank: "Master", skill: "Full mixed practice through ÷12" }
];

const $ = (id) => document.getElementById(id);
const els = {
  rank: $("rank"),
  xp: $("xp"),
  coins: $("coins"),
  streak: $("streak"),
  zoneName: $("zoneName"),
  zoneGoal: $("zoneGoal"),
  enemyName: $("enemyName"),
  enemyHearts: $("enemyHearts"),
  hero: $("hero"),
  monster: $("monster"),
  spellOrb: $("spellOrb"),
  question: $("question"),
  visualLabel: $("visualLabel"),
  groups: $("groups"),
  answers: $("answers"),
  feedback: $("feedback"),
  masteryLabel: $("masteryLabel"),
  masteryBar: $("masteryBar"),
  adventureMap: $("adventureMap"),
  weapon: $("weapon"),
  shield: $("shield"),
  nextLoot: $("nextLoot"),
  showGroups: $("showGroups"),
  hintButton: $("hintButton"),
  newProblemButton: $("newProblemButton"),
  resetGame: $("resetGame"),
  inventory: $("lootInventory"),
  inventoryCount: $("inventoryCount"),
  lootDrop: $("lootDrop"),
  lootDropIcon: $("lootDropIcon"),
  lootDropName: $("lootDropName"),
  lootDropDescription: $("lootDropDescription"),
  lootContinue: $("lootContinue")
};

let state = freshState();

function freshState() {
  return {
    zone: 0,
    xp: 0,
    coins: 0,
    streak: 0,
    mastery: 0,
    hp: 4,
    maxHp: 4,
    divisor: 5,
    answer: 4,
    dividend: 20,
    locked: false,
    weak: {},
    groupsShown: false,
    recent: [],
    inventory: [],
    claimedZones: [],
    lootPending: false
  };
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function weightedDivisor() {
  const allowed = zones[state.zone].divs;
  const bag = [];
  allowed.forEach((d) => {
    const weight = 2 + Math.min(state.weak[d] || 0, 4);
    for (let i = 0; i < weight; i += 1) bag.push(d);
  });
  return bag[rand(0, bag.length - 1)];
}

function newProblem() {
  state.locked = false;
  state.groupsShown = false;

  let divisor = weightedDivisor();
  let answer = rand(2, state.zone === 4 ? 15 : 12);
  let key = divisor + "x" + answer;
  let guard = 0;

  while (state.recent.includes(key) && guard < 10) {
    divisor = weightedDivisor();
    answer = rand(2, state.zone === 4 ? 15 : 12);
    key = divisor + "x" + answer;
    guard += 1;
  }

  state.recent.push(key);
  if (state.recent.length > 4) state.recent.shift();

  state.divisor = divisor;
  state.answer = answer;
  state.dividend = divisor * answer;

  els.question.textContent = `${state.dividend} ÷ ${state.divisor} = ?`;
  els.visualLabel.textContent = `${state.dividend} gems shared between ${state.divisor} chests`;
  els.feedback.textContent = "Choose a rune to cast your spell.";
  els.showGroups.textContent = "Show groups";

  renderUngroupedGems();
  renderChoices();
  updateUI();
}

function renderUngroupedGems() {
  const shown = Math.min(state.dividend, 32);
  els.groups.innerHTML = `<div class="gem-cloud" aria-label="${state.dividend} gems">${"💎".repeat(shown)}${state.dividend > shown ? " …" : ""}</div>`;
}

function renderGroupedGems() {
  els.groups.innerHTML = "";
  for (let i = 0; i < state.divisor; i += 1) {
    const chest = document.createElement("div");
    chest.className = "chest";
    const shown = Math.min(state.answer, 10);
    chest.innerHTML = `
      <div aria-hidden="true">🧰</div>
      <div class="chest-gems">${"💎".repeat(shown)}${state.answer > shown ? "…" : ""}</div>
      <strong>${state.answer}</strong>
    `;
    els.groups.appendChild(chest);
  }
}

function renderChoices() {
  const options = new Set([state.answer]);
  while (options.size < 4) {
    options.add(Math.max(1, state.answer + rand(-3, 3)));
  }

  els.answers.innerHTML = "";
  [...options].sort(() => Math.random() - 0.5).forEach((value) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";
    button.textContent = "✦ " + value;
    button.addEventListener("click", () => checkAnswer(value, button));
    els.answers.appendChild(button);
  });
}

function checkAnswer(value, button) {
  if (state.locked) return;

  if (value === state.answer) {
    state.locked = true;
    state.streak += 1;
    const gain = 10 + Math.min(state.streak, 5) * 2;
    state.xp += gain;
    state.coins += 3;
    state.mastery += 1;
    state.hp -= 1;
    state.weak[state.divisor] = Math.max(0, (state.weak[state.divisor] || 0) - 1);

    animateHit();
    els.feedback.textContent = `⚔️ Direct hit! ${state.divisor} × ${state.answer} = ${state.dividend}. +${gain} XP`;

    const completedZone = state.mastery >= zones[state.zone].goal && !state.claimedZones.includes(state.zone);

    if (completedZone) {
      const completedZoneIndex = state.zone;
      state.xp += 30;
      state.coins += 15;
      awardDivisionLoot(completedZoneIndex);

      if (completedZoneIndex < zones.length - 1) {
        state.zone += 1;
        state.mastery = 0;
        state.maxHp = Math.min(4 + state.zone, 8);
        state.hp = state.maxHp;
        els.feedback.textContent = `🗺️ Region complete! ${zones[state.zone].name} unlocked — and loot dropped!`;
      } else {
        state.hp = state.maxHp;
        els.feedback.textContent = "🐉 Division Quest complete! Legendary loot dropped!";
      }
    } else if (state.hp <= 0) {
      state.xp += 30;
      state.coins += 15;
      state.hp = state.maxHp;
      els.feedback.textContent = "🏆 Monster defeated! +30 XP and 15 coins!";
    }

    updateUI();
    if (!state.lootPending) window.setTimeout(newProblem, 850);
    return;
  }

  state.streak = 0;
  state.weak[state.divisor] = (state.weak[state.divisor] || 0) + 1;
  button.disabled = true;
  els.feedback.textContent = `🛡️ The spell missed. Try ${state.divisor} × ? = ${state.dividend}. No XP lost.`;
  updateUI();
}

function awardDivisionLoot(zoneIndex) {
  if (state.claimedZones.includes(zoneIndex)) return false;

  const item = divisionLoot[zoneIndex];
  state.claimedZones.push(zoneIndex);
  state.inventory.push(item);
  state.lootPending = true;
  renderInventory();

  els.lootDropIcon.textContent = item.icon;
  els.lootDropName.textContent = item.name;
  els.lootDropDescription.textContent = item.description;
  els.lootDrop.classList.remove("hidden");
  els.lootContinue.focus();
  return true;
}

function renderInventory() {
  els.inventory.innerHTML = "";
  els.inventoryCount.textContent = state.inventory.length + (state.inventory.length === 1 ? " item" : " items");

  if (!state.inventory.length) {
    els.inventory.innerHTML = '<div class="empty-inventory">Beat a region to earn your first item.</div>';
    return;
  }

  state.inventory.forEach((item) => {
    const card = document.createElement("div");
    card.className = "inventory-item";
    card.innerHTML =
      '<div class="inventory-item-icon">' + item.icon + '</div>' +
      '<strong>' + item.name + '</strong>' +
      '<small>Region trophy</small>';
    els.inventory.appendChild(card);
  });
}

function animateHit() {
  els.hero.classList.remove("cast");
  els.monster.classList.remove("hit");
  els.spellOrb.classList.remove("go");
  void els.hero.offsetWidth;
  els.hero.classList.add("cast");
  els.spellOrb.classList.add("go");
  window.setTimeout(() => els.monster.classList.add("hit"), 260);
}

function toggleGroups() {
  state.groupsShown = !state.groupsShown;
  if (state.groupsShown) {
    renderGroupedGems();
    els.showGroups.textContent = "Hide groups";
  } else {
    renderUngroupedGems();
    els.showGroups.textContent = "Show groups";
  }
}

function showHint() {
  const values = [];
  for (let i = 1; i <= Math.min(state.answer, 8); i += 1) {
    values.push(i * state.divisor);
  }
  els.feedback.textContent = `💡 Count in ${state.divisor}s: ${values.join(", ")}${state.answer > 8 ? "…" : ""}. Which count lands on ${state.dividend}?`;
}

function updateUI() {
  const zone = zones[state.zone];
  els.rank.textContent = zone.rank;
  els.xp.textContent = state.xp;
  els.coins.textContent = state.coins;
  els.streak.textContent = state.streak;
  els.zoneName.textContent = `${zone.icon} ${zone.name}`;
  els.zoneGoal.textContent = zone.skill;
  els.enemyName.textContent = zone.monster;
  els.monster.textContent = zone.emoji;
  els.enemyHearts.textContent = "❤️".repeat(Math.max(0, state.hp)) + "🖤".repeat(Math.max(0, state.maxHp - state.hp));

  els.masteryLabel.textContent = `${Math.min(state.mastery, zone.goal)} / ${zone.goal}`;
  els.masteryBar.style.width = `${Math.min(100, (state.mastery / zone.goal) * 100)}%`;

  els.weapon.textContent = state.zone < 2 ? "Wooden Wand" : state.zone < 4 ? "Silver Staff" : "Dragon Wand";
  els.shield.textContent = state.zone < 2 ? "Training Shield" : state.zone < 4 ? "Rune Shield" : "Hero Shield";
  const nextReward = divisionLoot[Math.min(state.zone, divisionLoot.length - 1)];
  els.nextLoot.textContent = state.claimedZones.includes(state.zone) ? "All region loot claimed" : nextReward.name + " for clearing " + zone.name;

  renderMap();
}

function renderMap() {
  els.adventureMap.innerHTML = "";
  zones.forEach((zone, index) => {
    const node = document.createElement("div");
    node.className = "map-node " + (index < state.zone ? "done" : index === state.zone ? "current" : "");
    const icon = index > state.zone ? "🔒" : zone.icon;
    node.innerHTML = `
      <div class="map-icon">${icon}</div>
      <strong>${zone.name}</strong>
    `;
    els.adventureMap.appendChild(node);
  });
}

els.showGroups.addEventListener("click", toggleGroups);
els.hintButton.addEventListener("click", showHint);
els.newProblemButton.addEventListener("click", newProblem);
els.lootContinue.addEventListener("click", () => {
  state.lootPending = false;
  els.lootDrop.classList.add("hidden");
  renderInventory();
  newProblem();
});

els.resetGame.addEventListener("click", () => {
  state = freshState();
  renderInventory();
  newProblem();
});

newProblem();
