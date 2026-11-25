# Settlers of the Gang of Four

Design patterns taught as a settlement board game: draw a rule card, feel the pain in the code, name the pattern.
A 45 minute talk for juniors, bootcamps and workshops, plus six hands-on C# exercises.

**Deck:** https://laoujin.github.io/SettlersOfTheGangOfFour/

## Deck

```sh
bun install
bun run dev      # http://localhost:3000
bun run check    # walks every slide and animation step at 1600×900 in Chromium
bun run build    # dist/ for GitHub Pages
```

Keys: `→`/space next step · `←` back · `↑↓` slide · `N` notes · `F` fullscreen · `R` replay · deep link `#21.3`.

Pushing to `main` runs the check and deploys `deck/` to GitHub Pages (`.github/workflows/pages.yml`).

## Workshop

Every exercise is a rule card. `exercises/start` holds the naive code: the tests for the current rules pass, and the test for the new rule card is skipped.

1. Remove the `Skip` from the rule-card test (or set its constant in `start/Rules.cs` to `null`).
2. Make it green **without growing a switch or an if-chain**.
3. Compare with `exercises/solution`.

| # | Exercise | Rule card | Pattern |
|---|---|---|---|
| 1 | Scoring | Add a tower: 3 points | polymorphism (open/closed) |
| 2 | The turn | Every turn checks the bandit first | Template Method; stretch: return a result per turn type (Factory Method) |
| 3 | Bots | Add a trader bot | Strategy |
| 4 | Dice | Log every roll to the chat, without touching `Dice` | Observer |
| 5 | Buildings | Walls on settlements and cities | Decorator |
| 6 | Undo & save | Undo the last move · save the game | Command · Memento |

```sh
dotnet test exercises
```

Ported from the itenium [Talk-DesignPatterns](https://github.com/itenium-be/Talk-DesignPatterns) exercises (2012/2019).

All artwork is drawn for this deck: generic hex tiles and our own names. No game names, box art, logos or rules text from any real game.

## License

MIT
