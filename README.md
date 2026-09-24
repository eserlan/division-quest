# Math Quest

A small browser game that turns maths practice into visual RPG adventures.

## Quests

### Division Quest

- Starts with easy divisor families: ÷2, ÷5 and ÷10
- Unlocks ÷3, ÷4, ÷6, ÷7, ÷8, ÷9, ÷11 and ÷12 over time
- Shows division visually by splitting gems into equal chests
- Repeats divisor families that cause mistakes more often

### Fraction Quest

- Starts with halves
- Adds quarters, thirds, equivalent fractions and fifths over time
- Uses visual fraction bars and groups of gems
- Introduces equivalent fractions visually before mixed practice
- Repeats difficult fraction concepts more often

## Shared learning principles

- Mastery-based progression instead of speed
- No timers
- Wrong answers never remove XP
- Older skills stay in rotation for review
- XP, coins, enemies and regions provide game progression
- Practice adapts during the current play session

## Run locally

No build step is required.

Open `index.html` directly in a browser, or serve the folder with any static web server.

For example:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Pages

- `index.html` — quest launcher
- `division.html` — Division Quest
- `fraction.html` — Fraction Quest

## Main files

- `styles.css` — shared and Division Quest styles
- `app.js` — Division Quest logic
- `fraction.css` — Fraction Quest visuals
- `fraction.js` — Fraction Quest progression and adaptive practice
- `launcher.css` — launcher layout

## Next ideas

- Persist progress locally between sessions
- Player avatar selection
- Sound effects and music toggle
- Boss encounters
- Cosmetic loot shop using earned coins
- Parent dashboard showing mastery by skill
- More visual models: arrays, number lines and circles
- Optional remainders for Division Quest
