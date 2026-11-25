const CARDS = {
  fm: { fam: 'cre', rule: 'Pieces cost resources.', pat: 'Factory Method' },
  af: { fam: 'cre', rule: 'Sea scenario: ships instead of roads.', pat: 'Abstract Factory' },
  si: { fam: 'cre', rule: 'There is only one bandit.', pat: 'Singleton' },
  bu: { fam: 'cre', rule: 'Set up a tournament board, step by step.', pat: 'Builder' },
  pr: { fam: 'cre', rule: 'Rematch: same start position.', pat: 'Prototype' },
  ad: { fam: 'str', rule: 'An overseas bot wants a seat.', pat: 'Adapter' },
  de: { fam: 'str', rule: 'Upgrade a settlement to a city.', pat: 'Decorator' },
  co: { fam: 'str', rule: 'Longest road is worth two points.', pat: 'Composite' },
  fa: { fam: 'str', rule: 'One counter for the bank.', pat: 'Facade' },
  px: { fam: 'str', rule: 'A player joins over the network.', pat: 'Proxy' },
  fw: { fam: 'str', rule: 'Nineteen tiles, five terrains.', pat: 'Flyweight' },
  br: { fam: 'str', rule: 'Same game on cardboard and in a browser.', pat: 'Bridge' },
  cm: { fam: 'beh', rule: 'I misclicked. Can I undo?', pat: 'Command' },
  st: { fam: 'beh', rule: 'Setup goes 1-2-3-3-2-1. A 7 moves the bandit.', pat: 'State' },
  ob: { fam: 'beh', rule: 'Whenever someone rolls…', pat: 'Observer' },
  sg: { fam: 'beh', rule: 'Can I play against a bot?', pat: 'Strategy' },
  vi: { fam: 'beh', rule: 'Who won?', pat: 'Visitor' },
  me: { fam: 'beh', rule: 'Save the game. We finish next week.', pat: 'Memento' },
  tm: { fam: 'beh', rule: 'Every turn: roll, trade, build.', pat: 'Template Method' },
  it: { fam: 'beh', rule: 'Next player, clockwise.', pat: 'Iterator' },
  cr: { fam: 'beh', rule: 'Offer a trade around the table.', pat: 'Chain of Responsibility' },
  md: { fam: 'beh', rule: 'Players never talk directly.', pat: 'Mediator' },
  in: { fam: 'beh', rule: 'Our house rules.', pat: 'Interpreter' },
};
const cards = keys => keys.split(' ').map(k => CARDS[k]);

Deck.slides = [
  {
    type: 'title', kicker: 'design patterns 101 · talk or workshop', title: 'Settlers of the<br>Gang of Four', subtitle: 'Learn the design patterns one rule card at a time',
    chips: '<span class="chip cre big">Settle</span><span class="chip str big">Build</span><span class="chip beh big">Play</span>',
    footer: 'Use → or a clicker. Most diagrams are step-by-step animations.',
    notes: '[0:00] Say nothing yet. Let the tiles land, then click straight into the cold open. No agenda slide.',
  },
  {
    type: 'viz', kicker: 'cold open', title: 'One class, one switch', scene: 'switch', lang: 'cs',
    notes: '[0:30] Cold open. Show working code first, then show it hurting.\nStep 1–3: roll, produce, settle. "It works. Ship it." Get a laugh.\nStep 4–5: rule cards arrive. Read each card aloud like a game master. The switch grows: flags, counters, cases that know about each other.\nLast step: "Nothing is broken. But every new rule hurts more than the last. That pain has a name: a pressure." Then the hook.',
  },
  {
    type: 'statement', big: 'You don’t pick patterns.<br><em>The rules force them on you.</em>', small: 'Every rule card tonight adds a pain point to that switch. A design pattern is the name for the move that makes the pain go away.',
    notes: '[3:00] The hook. Slow down. This is the sentence people should repeat at the coffee machine.\nFor juniors: you don’t need to memorise 23 patterns. You need to recognise 23 kinds of pain.',
  },
  {
    type: 'viz', kicker: 'the game in 60 seconds', title: 'How to play', scene: 'island',
    notes: '[3:30] For anyone who never played a settlement game. One minute, no more.\nStep 4: point at the three players: "These are bots. They play on their own. Remember them." The Strategy round pays this off.\nLast step: the codebase is the island, the rule cards are your requirements, and they arrive in random order.',
  },
  {
    type: 'table', kicker: 'what’s in the box', title: 'Three phases, twenty-three patterns',
    head: ['phase', 'family', 'the question', 'count'],
    rows: [
      ['<span class="chip cre">Settle</span>', 'Creational', 'Who builds it, and from what?', '5'],
      ['<span class="chip str">Build</span>', 'Structural', 'How do the pieces connect?', '7'],
      ['<span class="chip beh">Play</span>', 'Behavioral', 'Who does what, on whose turn?', '11'],
    ],
    footer: 'Gamma, Helm, Johnson, Vlissides, <i>Design Patterns</i> (1994): the “Gang of Four”. We draw a rule card for fourteen of them and give the rest one line each.',
    notes: '[5:00] The box contents. The three GoF families map onto the three phases of a turn: you settle, you build, you play.\nThe order of the rounds follows the game; inside a round the room picks the order.',
  },
  {
    type: 'bullets', kicker: 'how every round works', title: 'Draw, feel the pain, name it', reveal: true,
    items: [
      '<b>Draw a rule card</b><small>the room votes between two; any order has to work, just like real requirements</small>',
      '<b>Feel the pain</b><small>what the naive code would have to do</small>',
      '<b>You name the pattern</b><small>shout it before I reveal it; someone will shout “Singleton!”</small>',
      '<b>Before and after</b><small>a small diff, no live coding</small>',
      '<b>The board keeps playing</b><small>every pattern lands on the same game</small>',
    ],
    notes: '[6:00] The rules of the talk, as a game. Set up the vote: two cards on screen, hands up (or QR poll). Use ↓ or a deep link (#slide.step) to jump to the winning card; every scene stands on its own.',
  },
  {
    type: 'bullets', kicker: 'take home', title: 'Four things to remember', reveal: true,
    items: [
      '<b>Pressure first, pattern second</b><small>a rule card makes the code hurt; the pattern is the relief</small>',
      '<b>A pattern is a name</b><small>say “Command” in a review and the whole team sees the shape</small>',
      '<b>Patterns work together</b><small>one command log gives you undo, replays and save games</small>',
      '<b>Wait for the second card</b><small>a pattern without pressure is just more boxes</small>',
    ],
    notes: '[7:00] Message map. One sentence each, we come back to this list at the end.',
  },

  { type: 'section', n: '01', title: 'Settle', subtitle: 'creational patterns: who builds it, and from what?', notes: '[7:30] Round one. In the game you never conjure pieces: you pay for them.' },
  {
    type: 'cards', kicker: 'round one', title: 'Settle: the rule cards', reveal: true, cards: cards('fm af si bu pr'),
    notes: '[8:00] Deal the cards one by one. For each, ask: "what would hurt in the switch?" Don’t reveal the pattern yet; the scenes do that.',
  },
  {
    type: 'viz', kicker: 'settle', title: 'The building yard', scene: 'factory', lang: 'cre cs',
    notes: '[9:00] Factory Method, then Abstract Factory.\nKey line: the caller says WHAT, the factory decides HOW.\nSea kit: everything a kit makes must fit together (ships and harbours, not ships and roads). Classic textbook version: UI widget families per OS.\nLast step: in real apps the kit is chosen once, usually in the DI container.',
  },
  {
    type: 'viz', kicker: 'settle', title: 'One bandit to rule them all', scene: 'bandit', lang: 'cre cs',
    notes: '[11:30] Singleton. Let the room shout it.\nThe bandit is unique per game. Singleton mixes "exactly one" with "reachable from everywhere" and "lives forever".\nFailure: two games in one process (parallel tests, a game server). Fix: one per game is a lifetime, decided in one place.',
  },
  {
    type: 'compare', kicker: 'settle', title: 'Builder & Prototype: setting up the board', lang: 'cre cs',
    left: { chip: 'Builder', title: 'step by step, validated at the end', code: 'var board = new BoardBuilder()\n  .WithTiles(19)\n  .WithHarbours(9)\n  .WithBanditOn(Terrain.Desert)\n  .Build();\n\npublic Board Build() =>\n  harbours > tiles\n    ? throw new InvalidBoard()\n    : new Board(tiles, harbours, bandit);' },
    right: { chip: 'Prototype', title: 'copy a finished thing, then tweak', code: 'var start = board.Clone();\n\nvar rematch = start.Clone();\nvar practice = start.Clone();\npractice.Seats = 2;\n\nrecord Board(int Tiles, int Harbours);\nvar big = start with { Tiles = 30 };' },
    footer: '<b>Builder</b>: construction with steps and rules. <b>Prototype</b>: “like that one, but…”. Test-data builders are the best everyday use of both.',
    notes: '[13:30] Quick slide. Cards: "Set up a tournament board" → Builder. "Rematch: same start position" → Prototype.\nBuilder earns its place when construction has steps and invariants. Prototype: clone a configured object instead of rebuilding it; in C# records give you `with`.',
  },

  { type: 'section', n: '02', title: 'Build', subtitle: 'structural patterns: how do the pieces connect?', notes: '[15:00] Round two. Structural patterns are about borders and connections.' },
  {
    type: 'cards', kicker: 'round two', title: 'Build: the rule cards', reveal: true, cards: cards('ad de co'),
    footer: 'Plus four quick ones at the end of the round: Facade, Proxy, Flyweight, Bridge.',
    notes: '[15:30] Three big cards. Room votes which one first.',
  },
  {
    type: 'viz', kicker: 'build', title: 'The harbour', scene: 'adapter', lang: 'str cs',
    notes: '[16:00] Adapter. A harbour converts what you have into what the bank accepts. In code: an overseas bot that speaks JSON.\nThe table must not learn every foreign dialect. Wrap the foreigner at the border.\nJuniors meet this on day one: every SDK, every payment provider, every legacy service.',
  },
  {
    type: 'viz', kicker: 'build', title: 'From settlement to city', scene: 'decorator', lang: 'str cs',
    notes: '[18:30] Decorator. Upgrading is wrapping: same interface, more behaviour.\nThe tile asks building.Yield and doesn’t care how many layers there are.\nWhere they’ll meet it: ASP.NET Core middleware, HttpClient handlers, Stream wrappers (the old Talk-DesignPatterns stream example).\nThe cost: debugging an onion.',
  },
  {
    type: 'viz', kicker: 'build', title: 'Longest road', scene: 'composite', lang: 'str cs',
    notes: '[21:00] Composite. One segment and a whole network answer the same question.\nHonesty note: the real longest-road rule is a longest path, not a sum. The sum keeps the slide simple; whoever calls it out wins a prize.\nWhere they’ll meet it: the DOM, React trees, file systems, expression trees.',
  },
  {
    type: 'bullets', kicker: 'build', title: 'The rest of the structural box', cols: true,
    items: [
      '<b>Facade</b> — the bank<small>“one counter for the bank”: one door in front of the decks, the stock and the trade rules</small>',
      '<b>Proxy</b> — the remote player<small>“a player joins over the network”: looks local, lives elsewhere; also lazy loading, caching</small>',
      '<b>Flyweight</b> — terrain types<small>“nineteen tiles, five terrains”: share what is identical</small>',
      '<b>Bridge</b> — rules vs. renderer<small>“cardboard and browser”: two things that vary independently</small>',
    ],
    aside: '<b>Where you meet them</b><br>Facade: every service class in front of three repositories.<br><br>Proxy: ORMs, HTTP clients, mocking libraries generate them for you.<br><br>Flyweight: string interning.<br><br>Bridge: drivers and renderers.',
    notes: '[23:30] Fast round, one sentence each.',
  },

  { type: 'section', n: '03', title: 'Play', subtitle: 'behavioral patterns: who does what, on whose turn?', notes: '[24:30] Round three. The biggest family, and where the cold-open switch hurts most.' },
  {
    type: 'cards', kicker: 'round three', title: 'Play: the rule cards', reveal: true, cols: 3, cards: cards('cm st ob sg vi me'),
    notes: '[25:00] Six cards, the heart of the talk. Hold up two at a time and let the room vote. Every order works; the Memento scene is strongest right after Command, so if the room picks it early, say "hold that thought".',
  },
  {
    type: 'viz', kicker: 'play', title: 'Action cards', scene: 'command', lang: 'beh cs',
    notes: '[25:30] Command: the first rule card from the cold open. A move you hold now and play later.\nBecause it is an object: queue it, log it, send it over the wire, undo it.\nBonus: replaying commands from an empty board rebuilds the game. Replays and multiplayer sync for free.',
  },
  {
    type: 'viz', kicker: 'play', title: 'Whose turn is it?', scene: 'turn-state', lang: 'beh cs',
    notes: '[28:00] State: the second and third cold-open cards. Setup in snake order and the bandit phase each become one class.\nThe win: invalid moves are rejected by the current state, not by ifs scattered across the switch.\nBe honest: for three states an enum and a switch are fine. The pattern pays off as states and rules grow.',
  },
  {
    type: 'viz', kicker: 'play', title: 'Roll the dice', scene: 'observer', lang: 'beh cs',
    notes: '[31:00] Observer. The dice doesn’t know about players. It raises one event.\nSubject (dice), observers (tiles), observers of observers (buildings). The bandit is just another subscriber.\nLongest road works the same way: every RoadBuilt event, the scorer recounts.\nPitfall: forgetting to unsubscribe keeps listeners alive (memory leak).',
  },
  {
    type: 'viz', kicker: 'play', title: 'How the bot plays', scene: 'strategy', lang: 'beh cs',
    notes: '[33:30] Strategy. The bot has no opinion; the strategy does. Swap mid-game.\nThe reveal: the bots on the island since minute one were running this code. Pause on that step.\nLast step: a one-method strategy can be a plain lambda.\nAudience option: split the room into four colours; each colour picks the move for its bot for two or three decisions.',
  },
  {
    type: 'viz', kicker: 'play', title: 'Final scoring', scene: 'visitor', lang: 'beh cs',
    notes: '[36:00] Visitor. Walk the pieces, ask each one to "visit me as what I am" (double dispatch).\nNew operation (bot evaluation) = new visitor, no piece changes.\nHonest moment on the last step: a lambda and a switch would do for one operation. Visitor is for when operations keep coming.',
  },
  {
    type: 'viz', kicker: 'play', title: 'Save the game', scene: 'memento', lang: 'beh cs',
    notes: '[38:00] Memento. Save without exposing internals.\nLast step is the payoff of the message map: the command log from the Command round is already a save file. Patterns work together.',
  },
  {
    type: 'bullets', kicker: 'play', title: 'The rest of the behavioral box', cols: true,
    items: [
      '<b>Template Method</b> — the turn<small>roll, trade, build: fixed skeleton, variable steps</small>',
      '<b>Iterator</b> — turn order<small>“next player, clockwise”; in C#: <code>foreach</code></small>',
      '<b>Chain of Responsibility</b> — trade offer<small>passed around the table until someone accepts</small>',
      '<b>Mediator</b> — the table itself<small>players never talk directly</small>',
      '<b>Interpreter</b> — house rules<small>a tiny rules language; mostly: don’t</small>',
    ],
    notes: '[40:00] Rapid fire. Laugh on Interpreter: every table has house rules, and every house-rules language becomes a second job.\nTemplate Method is exercise 2 in the workshop.',
  },

  { type: 'section', n: '04', title: 'The expansion', subtitle: 'do the new rules plug in, or do we rewrite?', notes: '[41:00] The payoff.' },
  {
    type: 'viz', kicker: 'the expansion', title: 'A new box on the table', scene: 'expansion',
    notes: '[41:30] Every new rule lands on a seam a pattern already made. Count the edits to existing classes: zero.\nContrast with the cold-open switch: there, this box was a rewrite.',
  },
  {
    type: 'viz', kicker: 'the expansion', title: 'Buying every expansion up front', scene: 'overbuilt',
    notes: '[43:00] The flip side, for juniors who just fell in love with patterns.\nEach box is reasonable on its own. Together, the new joiner can’t find the dice.\nRule of thumb: the second time a rule card hurts, not the first.',
  },
  {
    type: 'statement', big: 'A pattern is a name for a pressure in your code,<br><em>not a goal.</em>',
    small: 'Feel the pain first. Name the move. Wait for the second card.',
    notes: '[44:00] Closing line. Slow down.',
  },
  {
    type: 'cards', kicker: 'your rulebook', title: 'Twenty-three rule cards', flip: true, compact: true, cols: 6,
    cards: cards('fm af si bu pr ad de co fa px fw br cm st ob sg vi me tm it cr md in'),
    notes: '[44:30] The cheat sheet: every pressure with its pattern. Leave it up during Q&A; it is also the handout.',
  },
  {
    type: 'bullets', kicker: 'keep playing', title: 'Where to go next', cls: 'more',
    items: [
      '<b>Where did half the book go?</b><small>the companion talk <i>They Became Birds</i>: how lambdas, events, DI and pattern matching absorbed the patterns</small>',
      '<b>Patterns without pressure</b><small><i>Hello World, Enterprise Edition</i>: what happens when you skip the pain</small>',
      '<b>Play it yourself</b><small>the hands-on exercises in C#: every exercise is a rule card</small>',
    ],
    notes: '[45:00] The one slide that points to the Birds talk. Don’t make its argument here.',
  },
  {
    type: 'title', kicker: 'thank you', title: 'Your turn', subtitle: 'Questions, objections, house rules.', hexes: true,
    notes: 'Q&A. Likely questions:\n- "Should I learn all 23?" Learn the pains; the names follow.\n- "Isn’t this just SOLID?" Patterns are SOLID applied to specific pains. Workshop exercise 1 is the open/closed principle.\n- "What about functional patterns?" Same idea, different rulebook.',
  },

  { type: 'section', n: 'W', title: 'Workshop', subtitle: 'hands-on, C#: every exercise is a rule card', notes: 'Workshop format only. Skip from here in the conference version.' },
  {
    type: 'table', kicker: 'workshop', title: 'Six rule cards to play',
    head: ['exercise', 'rule card', 'pattern'],
    rows: [
      ['1 · Scoring', 'Add a tower: 3 points', 'polymorphism (open/closed)'],
      ['2 · The turn', 'Every turn checks the bandit first', 'Template Method · Factory Method'],
      ['3 · Bots', 'Add a trader bot', 'Strategy'],
      ['4 · Dice', 'Log every roll to the chat', 'Observer'],
      ['5 · Buildings', 'Walls on settlements and cities', 'Decorator'],
      ['6 · Undo & save', 'Undo the last move · save the game', 'Command · Memento'],
    ],
    footer: '<code>dotnet test</code>: the tests for the current rules pass. Un-skip the test for the new rule card and make it green <b>without growing a switch</b>. Solutions in <code>exercises/solution</code>.',
    notes: 'Ported from the itenium Talk-DesignPatterns exercises (area calculator → scoring, uploaders → turns, Observer/Decorator examples → dice/buildings). Pairs, 15–20 minutes per exercise, discuss after each.\nStretch: the FormBuilder exercise from the old Handout (JavaScript) for groups that want a bigger design problem.',
  },
  {
    type: 'bullets', kicker: 'about this deck', title: 'Source & credits', cls: 'about',
    items: [
      '<b>Talk idea</b><small><a href="https://github.com/Laoujin/obsidian/blob/main/Conferences/Talks/Settlers%20of%20the%20Gang%20of%20Four.md">Laoujin/obsidian · Conferences/Talks/Settlers of the Gang of Four.md</a></small>',
      '<b>Exercises</b><small>ported from itenium-be/Talk-DesignPatterns (2012/2019)</small>',
      '<b>Deck engine</b><small>adapted from the itenium-be/Talk-GC deck</small>',
      '<b>Artwork</b><small>all SVG/CSS drawn for this deck: generic hex tiles and our own names; no game names, box art, logos or rules text</small>',
      '<b>Reference</b><small>Gamma, Helm, Johnson, Vlissides, <i>Design Patterns</i> (1994)</small>',
    ],
    notes: 'Backup slide, not presented.',
  },
];
