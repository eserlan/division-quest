# Division Quest

A small browser game that turns division practice into a visual RPG battle.

## What it does

- Starts with easy divisor families: ÷2, ÷5 and ÷10
- Unlocks ÷3, ÷4, ÷6, ÷7, ÷8, ÷9, ÷11 and ÷12 over time
- Uses mastery-based progression instead of a timer
- Repeats skills that cause mistakes more often
- Keeps older skills in rotation for review
- Shows division visually by splitting gems into equal chests
- Uses enemies, XP, coins, loot and an adventure map as motivation
- Never removes XP for wrong answers

## Run locally

No build step is required.

Open `index.html` directly in a browser, or serve the folder with any static web server.

For example:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## GitHub Pages

The project is fully static and can be published directly from the `main` branch using GitHub Pages.

Repository settings → Pages → Deploy from a branch → `main` / root.

## Files

- `index.html` — game UI
- `styles.css` — visual design and animations
- `app.js` — game rules, progression and adaptive practice

## Next ideas

- Persist progress locally between sessions
- Player avatar selection
- Sound effects and music toggle
- Boss encounters
- Cosmetic loot shop using earned coins
- Parent dashboard with mastery by divisor family
- More visual models for division: groups, arrays and number lines
- Optional remainders after core division is mastered
