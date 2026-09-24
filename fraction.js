const fractionZones = [
  {
    name: "Forest of Halves",
    icon: "🌲",
    rank: "Apprentice",
    goal: 10,
    enemy: "Fraction Slime",
    emoji: "👾",
    skill: "Learn what one half means in different ways",
    fractions: [[1, 2]],
    types: ["picture", "circle", "group", "halfOf", "share", "chooseHalf"]
  },
  {
    name: "Quarter Cavern",
    icon: "🪨",
    rank: "Scout",
    goal: 8,
    enemy: "Quarter Goblin",
    emoji: "👺",
    skill: "Add 1/4 and 3/4",
    fractions: [[1, 2], [1, 4], [3, 4]],
    types: ["picture", "group"]
  },
  {
    name: "Valley of Thirds",
    icon: "🏕️",
    rank: "Adventurer",
    goal: 10,
    enemy: "Thirds Troll",
    emoji: "🧌",
    skill: "Add 1/3 and 2/3",
    fractions: [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]],
    types: ["picture", "group"]
  },
  {
    name: "Equivalent Ruins",
    icon: "🏛️",
    rank: "Hero",
    goal: 12,
    enemy: "Fraction Mimic",
    emoji: "🦇",
    skill: "Discover equivalent fractions",
    fractions: [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]],
    types: ["picture", "group", "equivalent"]
  },
  {
    name: "Dragon Peak",
    icon: "🌋",
    rank: "Fraction Master",
    goal: 15,
    enemy: "Fraction Dragon",
    emoji: "🐲",
    skill: "Mixed fractions up to fifths",
    fractions: [[1, 2], [1, 3], [2, 3], [1, 4], [2, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5]],
    types: ["picture", "group", "equivalent"]
  }
];

const $ = (id) => document.getElementById(id);
const els = {
  rank: $("fractionRank"),
  xp: $("fractionXp"),
  coins: $("fractionCoins"),
  streak: $("fractionStreak"),
  zone: $("fractionZone"),
  skill: $("fractionSkill"),
  enemyName: $("fractionEnemyName"),
  hearts: $("fractionHearts"),
  hero: $("fractionHero"),
  orb: $("fractionOrb"),
  monster: $("fractionMonster"),
  prompt: $("fractionPrompt"),
  visual: $("fractionVisual"),
  answers: $("fractionAnswers"),
  feedback: $("fractionFeedback"),
  hint: $("fractionHint"),
  newProblem: $("fractionNewProblem"),
  reset: $("resetFractionGame"),
  masteryLabel: $("fractionMasteryLabel"),
  masteryBar: $("fractionMasteryBar"),
  map: $("fractionMap")
};

function freshFractionState() {
  return {
    zone: 0,
    xp: 0,
    coins: 0,
    streak: 0,
    mastery: 0,
    hp: 4,
    maxHp: 4,
    locked: false,
    weak: {},
    recent: [],
    current: null
  };
}

let state = freshFractionState();

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(items) {
  return items[randomInt(0, items.length - 1)];
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function fractionText(fraction) {
  return fraction[0] + "/" + fraction[1];
}

function fractionValue(fraction) {
  return fraction[0] / fraction[1];
}

function problemKey(fraction, type) {
  return type + ":" + fractionText(fraction);
}

function chooseFraction(zone) {
  const bag = [];
  zone.fractions.forEach((fraction) => {
    const weakness = state.weak[fractionText(fraction)] || 0;
    const weight = 2 + Math.min(weakness, 4);
    for (let i = 0; i < weight; i += 1) bag.push(fraction);
  });
  return pick(bag);
}

function buildProblemDetails(fraction, type) {
  const details = { fraction, type };

  if (type === "group") {
    const multiplier = state.zone === 0 ? pick([2, 3, 4, 5]) : 3;
    details.groupTotal = fraction[1] * multiplier;
    details.groupSelected = fraction[0] * multiplier;
  }

  if (type === "halfOf") {
    details.total = pick([4, 6, 8, 10, 12]);
    details.item = pick(["⭐", "🪙", "🍎", "⚔️"]);
  }

  if (type === "share") {
    details.total = pick([4, 6, 8, 10, 12]);
  }

  if (type === "circle") {
    details.theme = pick(["pizza", "shield", "moon"]);
  }

  if (type === "chooseHalf") {
    const choices = shuffle([
      { label: "A", fraction: [1, 2] },
      { label: "B", fraction: [1, 3] },
      { label: "C", fraction: [2, 3] },
      { label: "D", fraction: [1, 4] }
    ]);
    details.visualChoices = choices;
    details.correctLabel = choices.find((choice) => fractionValue(choice.fraction) === 0.5).label;
  }

  return details;
}

function newFractionProblem() {
  state.locked = false;
  const zone = fractionZones[state.zone];

  let fraction = chooseFraction(zone);
  let type = pick(zone.types);
  let key = problemKey(fraction, type);
  let guard = 0;

  while (state.recent.includes(key) && guard < 12) {
    fraction = chooseFraction(zone);
    type = pick(zone.types);
    key = problemKey(fraction, type);
    guard += 1;
  }

  state.recent.push(key);
  if (state.recent.length > 4) state.recent.shift();

  state.current = buildProblemDetails(fraction, type);
  renderProblem();
  renderFractionAnswers();
  els.feedback.textContent = "Choose the answer that matches the challenge.";
  updateFractionUI();
}

function renderProblem() {
  const current = state.current;
  const { fraction, type } = current;
  els.visual.innerHTML = "";

  if (type === "picture") {
    els.prompt.textContent = "Which fraction matches the picture?";
    renderFractionBar(fraction);
    return;
  }

  if (type === "circle") {
    const names = {
      pizza: "pizza",
      shield: "shield",
      moon: "moon"
    };
    els.prompt.textContent = "What fraction of the " + names[current.theme] + " is highlighted?";
    renderHalfCircle(current.theme);
    return;
  }

  if (type === "group") {
    els.prompt.textContent = "What fraction of these treasures is highlighted?";
    renderGemGroup(current.groupTotal, current.groupSelected);
    return;
  }

  if (type === "halfOf") {
    els.prompt.textContent = "What is half of " + current.total + "?";
    renderHalfOfPile(current.total, current.item);
    return;
  }

  if (type === "share") {
    els.prompt.textContent = "Two adventurers share " + current.total + " gems equally. How many does each get?";
    renderSharingScene(current.total);
    return;
  }

  if (type === "chooseHalf") {
    els.prompt.textContent = "Which picture shows one half?";
    renderChooseHalf(current.visualChoices);
    return;
  }

  els.prompt.textContent = "Which fraction is equal to " + fractionText(fraction) + "?";
  renderEquivalentDisplay(fraction);
}

function renderFractionBar(fraction) {
  const bar = document.createElement("div");
  bar.className = "fraction-bar";

  for (let i = 0; i < fraction[1]; i += 1) {
    const piece = document.createElement("div");
    piece.className = "fraction-piece" + (i < fraction[0] ? " filled" : "");
    piece.textContent = i < fraction[0] ? "⭐" : "";
    bar.appendChild(piece);
  }

  els.visual.appendChild(bar);
}

function renderHalfCircle(theme) {
  const wrap = document.createElement("div");
  wrap.className = "circle-challenge";

  const circle = document.createElement("div");
  circle.className = "fraction-circle " + theme;

  const icon = document.createElement("span");
  icon.className = "circle-icon";
  icon.textContent = theme === "pizza" ? "🍕" : theme === "shield" ? "🛡️" : "🌙";
  circle.appendChild(icon);

  wrap.appendChild(circle);
  els.visual.appendChild(wrap);
}

function renderGemGroup(total, selected) {
  const field = document.createElement("div");
  field.className = "gem-field";

  for (let i = 0; i < total; i += 1) {
    const gem = document.createElement("div");
    gem.className = "fraction-gem" + (i < selected ? " selected" : "");
    gem.textContent = "💎";
    field.appendChild(gem);
  }

  els.visual.appendChild(field);
}

function renderHalfOfPile(total, item) {
  const wrap = document.createElement("div");
  wrap.className = "half-of-pile";
  for (let i = 0; i < total; i += 1) {
    const token = document.createElement("span");
    token.textContent = item;
    wrap.appendChild(token);
  }
  els.visual.appendChild(wrap);
}

function renderSharingScene(total) {
  const wrap = document.createElement("div");
  wrap.className = "sharing-scene";
  wrap.innerHTML =
    '<div class="share-player"><span>🧙</span><small>?</small></div>' +
    '<div class="share-pile"><div>' + "💎".repeat(total) + '</div><strong>' + total + ' gems</strong></div>' +
    '<div class="share-player"><span>🧝</span><small>?</small></div>';
  els.visual.appendChild(wrap);
}

function renderChooseHalf(choices) {
  const grid = document.createElement("div");
  grid.className = "choice-visual-grid";

  choices.forEach((choice) => {
    const card = document.createElement("div");
    card.className = "mini-fraction-card";

    const label = document.createElement("strong");
    label.textContent = choice.label;

    const bar = document.createElement("div");
    bar.className = "mini-bar";

    for (let i = 0; i < choice.fraction[1]; i += 1) {
      const part = document.createElement("span");
      part.className = i < choice.fraction[0] ? "mini-piece filled" : "mini-piece";
      bar.appendChild(part);
    }

    card.append(label, bar);
    grid.appendChild(card);
  });

  els.visual.appendChild(grid);
}

function renderEquivalentDisplay(fraction) {
  const wrap = document.createElement("div");
  wrap.className = "equivalent-display";
  wrap.innerHTML =
    '<div class="big-fraction">' + fractionText(fraction) + '</div>' +
    '<div class="equal-symbol">=</div>' +
    '<div class="big-fraction">?</div>';
  els.visual.appendChild(wrap);
}

function numericOptions(correct) {
  const values = new Set([correct]);
  const nearby = [correct - 2, correct - 1, correct + 1, correct + 2, correct + 3];
  nearby.forEach((value) => {
    if (value > 0 && values.size < 4) values.add(value);
  });
  while (values.size < 4) values.add(randomInt(1, Math.max(6, correct + 3)));
  return shuffle([...values]);
}

function renderFractionAnswers() {
  const current = state.current;
  const { fraction, type } = current;
  let options = [];

  if (type === "halfOf" || type === "share") {
    options = numericOptions(current.total / 2);
  } else if (type === "chooseHalf") {
    options = shuffle(current.visualChoices.map((choice) => choice.label));
  } else if (type === "group") {
    const candidates = [
      fractionText(fraction),
      "1/3",
      "2/3",
      "1/4"
    ];
    options = shuffle([...new Set(candidates)]);
    while (options.length < 4) {
      const denominatorOption = randomInt(2, 6);
      const numeratorOption = randomInt(1, denominatorOption);
      options.push(numeratorOption + "/" + denominatorOption);
      options = [...new Set(options)];
    }
  } else if (type === "equivalent") {
    const correct = [fraction[0] * 2, fraction[1] * 2];
    const wrongA = [Math.max(1, fraction[0]), fraction[1] + 1];
    const wrongB = [Math.min(fraction[1], fraction[0] + 1), fraction[1]];
    const wrongC = [1, Math.max(2, fraction[1] + 2)];
    options = shuffle([fractionText(correct), fractionText(wrongA), fractionText(wrongB), fractionText(wrongC)]);
  } else {
    const denominator = fraction[1];
    const candidates = [
      fractionText(fraction),
      fractionText([Math.max(1, fraction[0] - 1), denominator]),
      fractionText([Math.min(denominator, fraction[0] + 1), denominator]),
      fractionText([fraction[0], Math.min(8, denominator + 1)])
    ];
    options = [...new Set(candidates)];
    while (options.length < 4) {
      const denominatorOption = randomInt(2, 6);
      const numeratorOption = randomInt(1, denominatorOption);
      options.push(numeratorOption + "/" + denominatorOption);
      options = [...new Set(options)];
    }
    options = shuffle(options);
  }

  els.answers.innerHTML = "";

  options.slice(0, 4).forEach((value) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button fraction-answer";
    button.textContent = value;
    button.addEventListener("click", () => checkFractionAnswer(value, button));
    els.answers.appendChild(button);
  });
}

function isFractionAnswerCorrect(value) {
  const current = state.current;
  const { fraction, type } = current;

  if (type === "halfOf" || type === "share") {
    return Number(value) === current.total / 2;
  }

  if (type === "chooseHalf") {
    return value === current.correctLabel;
  }

  if (type === "group") {
    return value === fractionText(fraction);
  }

  if (type === "equivalent") {
    const parts = String(value).split("/").map(Number);
    return parts.length === 2 && parts[1] !== 0 && Math.abs((parts[0] / parts[1]) - fractionValue(fraction)) < 0.0001;
  }

  return value === fractionText(fraction);
}

function checkFractionAnswer(value, button) {
  if (state.locked) return;

  const fraction = state.current.fraction;
  const weaknessKey = fractionText(fraction);

  if (isFractionAnswerCorrect(value)) {
    state.locked = true;
    state.streak += 1;
    const gain = 10 + Math.min(state.streak, 5) * 2;
    state.xp += gain;
    state.coins += 3;
    state.mastery += 1;
    state.hp -= 1;
    state.weak[weaknessKey] = Math.max(0, (state.weak[weaknessKey] || 0) - 1);

    animateFractionHit();
    els.feedback.textContent = "⚔️ Direct hit! " + explanation() + " +" + gain + " XP";

    if (state.hp <= 0) {
      state.xp += 25;
      state.coins += 10;

      const zone = fractionZones[state.zone];
      if (state.mastery >= zone.goal && state.zone < fractionZones.length - 1) {
        state.zone += 1;
        state.mastery = 0;
        state.maxHp = Math.min(4 + state.zone, 8);
        els.feedback.textContent = "🗺️ New region unlocked: " + fractionZones[state.zone].name + "!";
      } else {
        els.feedback.textContent = "🏆 Monster defeated! +25 XP and 10 coins!";
      }

      state.hp = state.maxHp;
    }

    updateFractionUI();
    window.setTimeout(newFractionProblem, 1000);
    return;
  }

  state.streak = 0;
  state.weak[weaknessKey] = (state.weak[weaknessKey] || 0) + 1;
  button.disabled = true;
  els.feedback.textContent = "Not quite. " + hintText() + " No XP lost.";
  updateFractionUI();
}

function explanation() {
  const current = state.current;
  const { fraction, type } = current;

  if (type === "halfOf") {
    return "Half of " + current.total + " is " + (current.total / 2) + ".";
  }

  if (type === "share") {
    return current.total + " shared equally between two adventurers gives " + (current.total / 2) + " each.";
  }

  if (type === "chooseHalf") {
    return "One half means one of two equal parts.";
  }

  if (type === "group") {
    return current.groupSelected + " of " + current.groupTotal + " items is " + fractionText(fraction) + ".";
  }

  if (type === "equivalent") {
    return "Equivalent fractions can look different but have the same value.";
  }

  return fractionText(fraction) + " means " + fraction[0] + " of " + fraction[1] + " equal parts.";
}

function hintText() {
  const current = state.current;
  const { type } = current;

  if (type === "halfOf") {
    return "Split the items into two equal groups.";
  }

  if (type === "share") {
    return "Make two equal piles. Each adventurer must get the same number.";
  }

  if (type === "chooseHalf") {
    return "Look for a picture split into two equal parts with exactly one part filled.";
  }

  if (type === "group") {
    return "Count all the treasures, then count the highlighted ones. Is exactly half highlighted?";
  }

  if (type === "equivalent") {
    return "Multiply the top and bottom by the same number.";
  }

  return "Count the total equal parts first, then count the highlighted parts.";
}

function animateFractionHit() {
  els.hero.classList.remove("cast");
  els.monster.classList.remove("hit");
  els.orb.classList.remove("go");
  void els.hero.offsetWidth;
  els.hero.classList.add("cast");
  els.orb.classList.add("go");
  window.setTimeout(() => els.monster.classList.add("hit"), 260);
}

function updateFractionUI() {
  const zone = fractionZones[state.zone];
  els.rank.textContent = zone.rank;
  els.xp.textContent = state.xp;
  els.coins.textContent = state.coins;
  els.streak.textContent = state.streak;
  els.zone.textContent = zone.icon + " " + zone.name;
  els.skill.textContent = zone.skill;
  els.enemyName.textContent = zone.enemy;
  els.monster.textContent = zone.emoji;
  els.hearts.textContent =
    "❤️".repeat(Math.max(0, state.hp)) +
    "🖤".repeat(Math.max(0, state.maxHp - state.hp));

  els.masteryLabel.textContent = Math.min(state.mastery, zone.goal) + " / " + zone.goal;
  els.masteryBar.style.width = Math.min(100, (state.mastery / zone.goal) * 100) + "%";

  renderFractionMap();
}

function renderFractionMap() {
  els.map.innerHTML = "";

  fractionZones.forEach((zone, index) => {
    const node = document.createElement("div");
    node.className = "map-node " + (index < state.zone ? "done" : index === state.zone ? "current" : "");

    const icon = index > state.zone ? "🔒" : zone.icon;
    node.innerHTML =
      '<div class="map-icon">' + icon + '</div>' +
      '<strong>' + zone.name + '</strong>';

    els.map.appendChild(node);
  });
}

els.hint.addEventListener("click", () => {
  els.feedback.textContent = "💡 " + hintText();
});

els.newProblem.addEventListener("click", newFractionProblem);

els.reset.addEventListener("click", () => {
  state = freshFractionState();
  newFractionProblem();
});

newFractionProblem();
