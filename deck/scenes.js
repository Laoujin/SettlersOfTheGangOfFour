(() => {
  const { scene } = Deck;
  const RC = q => `<span class="rule-q">${q}</span>`;
  const rule = (h, id, q, x = 590, y = 20, w = 390) => h.add(id, { x, y, w, h: 64, label: q, sub: 'RULE CARD', cls: 'rule' });
  const HW = 104, HH = 120;
  const hex = (h, id, x, y, terrain, num, p = {}) => h.add(id, { shape: 'hex', x, y, w: HW, h: HH, label: terrain, badge: num ?? '', cls: 't-' + terrain, ...p });
  const card = (h, id, x, y, res, p = {}) => h.add(id, { x, y, w: 150, h: 44, label: res, cls: 'card c-' + res, ...p });
  const piece = (h, id, x, y, player, label = '', p = {}) => h.add(id, { x, y, w: 30, h: 30, label, cls: 'p-' + player, ...p });

  const ISLAND = [
    ['timber', 6], ['grain', 9], ['ore', 4], ['wool', 11],
    ['clay', 8], ['wool', 3], ['desert', null], ['timber', 10], ['grain', 5],
    ['ore', 2], ['timber', 12], ['clay', 6], ['grain', 9],
  ];
  const ISLAND_ROWS = [4, 5, 4];
  const IW = 135, IH = 156;
  const islandPos = () => {
    const out = [];
    ISLAND_ROWS.forEach((n, r) => {
      for (let i = 0; i < n; i++) out.push([500 - (n * IW) / 2 + i * IW, 90 + r * 117]);
    });
    return out;
  };

  scene('island', {
    legend: [['t-timber', 'timber'], ['t-clay', 'clay'], ['t-wool', 'wool'], ['t-grain', 'grain'], ['t-ore', 'ore']],
    init: h => h.region('sea', { x: 30, y: 30, w: 940, h: 580, label: 'the table', cls: 'queue' }),
    steps: [
      { t: '<b>An empty table.</b> Every game starts the same way.' },
      {
        t: 'Tiles go down. <b>A different island every game.</b>',
        do: h => islandPos().forEach(([x, y], i) => hex(h, 'h' + i, x, y, ISLAND[i][0], '', { w: IW, h: IH })),
      },
      {
        t: 'Numbers go on the tiles: <b>what</b> produces, and <b>how often</b>.',
        do: h => ISLAND.forEach(([, n], i) => h.set('h' + i, { badge: n ?? '' })),
      },
      {
        t: 'Three players settle. Where you put your <b>first piece</b> decides the next hour.<small>These three are bots, playing on their own. Remember them.</small>',
        do: h => {
          const P = islandPos();
          piece(h, 'sR', P[0][0] + IW - 17, P[0][1] + IH * 0.75 - 17, 'red', '', { w: 34, h: 34 });
          piece(h, 'sB', P[7][0] + IW - 17, P[7][1] + IH * 0.25 - 17, 'blue', '', { w: 34, h: 34 });
          piece(h, 'sW', P[11][0] - 17, P[11][1] + IH * 0.75 - 17, 'white', '', { w: 34, h: 34 });
        },
      },
      {
        t: 'Roads connect what you built. <b>Trade</b> connects you to everyone else.',
        do: h => {
          const P = islandPos();
          h.add('rR', { x: P[0][0] + IW - 7, y: P[0][1] + IH * 0.25 + 4, w: 14, h: IH / 2 - 30, label: '', cls: 'road' });
          h.add('rB', { x: P[7][0] + IW - 7, y: P[7][1] + IH * 0.25 + 26, w: 14, h: IH / 2 - 30, label: '', cls: 'road p-blue' });
        },
      },
      {
        t: 'Same rulebook. Different island. Every game.<br><em>That is software.</em><small>Your codebase is the island. The rule cards are your requirements, and they arrive one at a time.</small>',
        do: h => {
          h.text('rb', { x: 500, y: 585, label: 'roll · produce · trade · build · next player', size: 28, anchor: 'middle', cls: 'grain' });
        },
      },
    ],
  });

  scene('factory', {
    codeTitle: 'C#',
    code: 'interface IPieceKit {\n  Settlement Settlement(Player p);\n  Road Road(Player p);\n}\n\nclass BuildingYard(IPieceKit kit) {\n  public Piece Build(Player p, Blueprint b) {\n    p.Hand.Pay(b.Cost);\n    return b.Create(kit, p);\n  }\n}',
    legend: [['t-timber', 'timber'], ['t-clay', 'clay'], ['t-wool', 'wool'], ['t-grain', 'grain'], ['p-red', 'your pieces']],
    init: h => {
      h.region('hand', { x: 30, y: 40, w: 220, h: 560, label: 'your hand' });
      h.region('board', { x: 720, y: 40, w: 250, h: 560, label: 'board' });
      [['c1', 'timber'], ['c2', 'clay'], ['c3', 'wool'], ['c4', 'grain'], ['c5', 'timber'], ['c6', 'clay']].forEach(([id, r], i) => card(h, id, 65, 90 + i * 70, r));
      h.add('yard', { x: 360, y: 250, w: 240, h: 110, label: 'BuildingYard', sub: 'Build(p, blueprint)', cls: 'pat cre' });
      h.add('kit', { x: 390, y: 450, w: 180, h: 60, label: 'ClassicKit', sub: 'IPieceKit', cls: 'feat' });
      h.ref('yard', 'kit', { cls: 'muted' });
    },
    steps: [
      { t: `${RC('Pieces cost resources.')}<br>You don’t <code>new</code> a settlement. You <b>pay</b> for one.` },
      {
        hl: [7, 8, 9], t: 'Four cards in, one settlement out. The caller says <em>what</em>; the yard decides <em>how</em>.<small><b>Factory Method</b>: creation behind a method you can override.</small>',
        do: h => {
          h.set('c1 c2 c3 c4', { x: 405, y: 283, o: 0 });
          h.set('yard', { cls: 'pat cre hot' });
          h.add('set', { x: 775, y: 120, w: 140, h: 70, label: 'Settlement', cls: 'p-red', spawn: 'yard' });
        },
      },
      {
        hl: [3], t: 'Timber and clay: a <b>road</b>. Same yard, different blueprint.',
        do: h => {
          h.set('c5 c6', { x: 405, y: 283, o: 0 });
          h.set('yard', { cls: 'pat cre' });
          h.add('road', { x: 780, y: 260, w: 130, h: 40, label: 'Road', cls: 'road', spawn: 'yard' });
        },
      },
      {
        hl: [1, 2, 3, 4], t: `${RC('Sea scenario: ships instead of roads.')}<br>Swap the <b>whole kit</b>. Everything it makes still fits together.<small><b>Abstract Factory</b>: families of objects that must match.</small>`,
        do: h => {
          h.set('kit', { label: 'SeaKit', cls: 'feat hot' });
          h.set('road', { label: 'Ship', sub: 'same slot', cls: 'p-blue' });
        },
      },
      {
        code: 'var kit = scenario.HasSea\n  ? new SeaKit()\n  : new ClassicKit();\n\nservices.AddSingleton<IPieceKit>(kit);\nservices.AddScoped<BuildingYard>();',
        hl: [1], t: 'In a real app you pick the kit <b>once</b>, at startup.<small>Usually a line in the DI container. The yard never knows which kit it got: that is the point.</small>',
        do: h => h.set('kit', { cls: 'feat' }),
      },
    ],
  });

  scene('bandit', {
    codeTitle: 'C#',
    code: 'public sealed class Bandit {\n  public static Bandit Instance { get; } = new();\n  public Tile Location { get; set; }\n  private Bandit() { }\n}\n\nBandit.Instance.Location = tile;',
    legend: [['bandit', 'the bandit'], ['pat', 'game code']],
    init: h => {
      hex(h, 'tile', 448, 60, 'ore', 4);
      h.add('bandit', { x: 425, y: 250, w: 150, h: 70, label: 'Bandit', sub: '.Instance', cls: 'bandit' });
      h.ref('bandit', 'tile', { cls: 'muted', label: 'sits on' });
    },
    steps: [
      { hl: [1, 2, 4], t: `${RC('There is only one bandit.')}<br>Someone in the room shouts <b>Singleton!</b> Textbook.` },
      {
        hl: [7], t: 'Everyone can reach it. So everyone does.',
        do: h => {
          [['Dice', 60, 200], ['Player', 60, 380], ['TradeRules', 780, 200], ['Scoring', 780, 380], ['Harbour', 420, 470]].forEach(([id, x, y]) => {
            h.add(id, { x, y, w: 160, h: 56, cls: 'pat' });
            h.ref(id, 'bandit', { cls: 'weak' });
          });
        },
      },
      {
        t: 'Now run <b>two games</b> in one process: parallel tests, a server hosting tables.<br><em>One bandit, every table.</em>',
        do: h => {
          h.region('gA', { x: 30, y: 150, w: 330, h: 330, label: 'game A', cls: 'dim' });
          h.region('gB', { x: 640, y: 150, w: 330, h: 330, label: 'game B', cls: 'dim' });
          h.set('bandit', { cls: 'bandit hot' });
          h.each(it => { if (it.kind === 'obj' && it.id !== 'bandit' && it.id !== 'tile') h.edge(it.id, 'bandit', { cls: 'dead' }); });
        },
      },
      {
        code: 'services.AddScoped<Bandit>();\n\nclass Dice(Bandit bandit) { … }\nclass Scoring(Bandit bandit) { … }',
        hl: [1], t: 'It was never “one per process”. It was <b>one per game</b>.<small>Singleton: the pattern juniors learn first and seniors remove first. Ask for the bandit; let one place decide how many exist.</small>',
        do: h => {
          h.del('Harbour');
          h.set('bandit', { x: 205, y: 500, w: 150, h: 60, sub: 'game A', cls: 'bandit' });
          h.add('bandit2', { x: 645, y: 500, w: 150, h: 60, label: 'Bandit', sub: 'game B', cls: 'bandit' });
          h.ref('Dice', 'bandit', { cls: 'live' }); h.ref('Player', 'bandit', { cls: 'live' });
          h.ref('TradeRules', 'bandit2', { cls: 'live' }); h.ref('Scoring', 'bandit2', { cls: 'live' });
          h.unref('bandit'); h.unref('TradeRules', 'bandit'); h.unref('Scoring', 'bandit');
          h.set('gA gB', { cls: '', h: 440 });
        },
      },
    ],
  });

  scene('adapter', {
    codeTitle: 'C#',
    code: 'interface IPlayer { Move TakeTurn(GameView v); }\n\n\nclass OverseasBot {\n  public string Suggest(string boardJson);\n}\n\nclass OverseasBotAdapter(OverseasBot bot) : IPlayer {\n  public Move TakeTurn(GameView v) =>\n    Move.Parse(bot.Suggest(Json.Serialize(v)));\n}',
    legend: [['p-red', 'player'], ['pat', 'adapter']],
    init: h => {
      h.add('table', { x: 60, y: 270, w: 170, h: 90, label: 'Table', sub: 'calls IPlayer', cls: 'feat' });
      [['red', 60], ['blue', 190], ['white', 320]].forEach(([c, y]) => {
        h.add(c, { x: 470, y, w: 150, h: 60, label: c[0].toUpperCase() + c.slice(1), sub: 'IPlayer', cls: 'p-' + c });
        h.ref('table', c, { cls: 'live' });
      });
    },
    steps: [
      { hl: [1], t: 'The table talks to every seat through one interface: <code>IPlayer</code>.' },
      {
        hl: [4, 5, 6], t: `${RC('An overseas bot wants a seat.')}<br>Strong player. Speaks <b>JSON over HTTP</b>.`,
        do: h => {
          h.add('bot', { x: 760, y: 470, w: 190, h: 70, label: 'OverseasBot', sub: 'Suggest(json)', cls: 'bandit' });
          h.ref('table', 'bot', { cls: 'dead', label: 'TakeTurn? ✗', c: [0, 80] });
        },
      },
      {
        hl: [8, 9, 10], t: 'Don’t teach the table a new language. Build a <b>harbour</b>: it converts what they have into what you accept.<small><b>Adapter</b>.</small>',
        do: h => {
          h.unref('table', 'bot');
          h.add('adp', { x: 440, y: 470, w: 220, h: 70, label: 'BotAdapter', sub: 'IPlayer → Suggest()', cls: 'pat' });
          h.ref('table', 'adp', { cls: 'live' });
          h.ref('adp', 'bot', { cls: 'hot', label: 'json' });
        },
      },
      {
        t: 'Every integration you will ever write is one of these.<br><em>Wrap it at the border.</em><small>Payment providers, legacy SOAP, an LLM API: the inside of your game keeps speaking its own language.</small>',
        do: h => h.set('adp', { cls: 'pat hot' }),
      },
    ],
  });

  scene('decorator', {
    codeTitle: 'C#',
    code: 'interface IBuilding {\n  int Yield { get; }  int Points { get; }\n}\nclass Settlement : IBuilding {\n  public int Yield => 1;  public int Points => 1;\n}\nclass City(IBuilding inner) : IBuilding {\n  public int Yield => inner.Yield * 2;\n  public int Points => inner.Points + 1;\n}\nclass Walls(IBuilding inner) : IBuilding {\n  public int Yield => inner.Yield;\n  public int Points => inner.Points;\n}',
    legend: [['p-red', 'building'], ['hot', 'wrapper']],
    init: h => {
      h.add('s', { x: 390, y: 290, w: 220, h: 80, label: 'Settlement', sub: 'yield 1 · 1 VP', cls: 'p-red' });
    },
    steps: [
      { hl: [4, 5, 6], t: `${RC('Upgrade a settlement to a city.')}<br>A settlement: produces <b>1</b> card, worth <b>1</b> point.` },
      {
        hl: [7, 8, 9, 10], t: 'Upgrade to a city: <b>wrap</b> it. Same interface, double yield.',
        do: h => {
          h.region('city', { x: 340, y: 230, w: 320, h: 190, label: 'City', sub: 'yield 2 · 2 VP', cls: 'active' });
        },
      },
      {
        hl: [11, 12, 13, 14], t: 'Walls around the city: <b>wrap again</b>. Nothing inside had to change.',
        do: h => {
          h.region('walls', { x: 290, y: 170, w: 420, h: 310, label: 'Walls', sub: 'safe from the bandit', cls: 'surv' });
          h.set('city', { cls: '' });
        },
      },
      {
        t: 'The tile only asks <code>building.Yield</code>. It has no idea how many layers answer.<small><b>Decorator</b>: add behaviour without touching the thing.</small>',
        do: h => {
          hex(h, 'tile', 60, 60, 'grain', 8, { cls: 't-grain hot' });
          h.ref('tile', 'walls', { cls: 'hot', label: '.Yield → 2' });
        },
      },
      {
        t: 'You use this every day: ASP.NET middleware, <code>HttpClient</code> handlers, <code>Stream</code> wrappers.<br><em>Six layers deep, good luck with the stack trace.</em>',
        do: h => {
          h.unref('tile');
          h.set('tile', { cls: 't-grain' });
          h.text('mw', { x: 500, y: 560, label: 'Logging(Retry(Auth(Cache(handler))))', size: 24, anchor: 'middle', cls: 'mono grain' });
        },
      },
    ],
  });

  scene('composite', {
    codeTitle: 'C#',
    code: 'interface IRoad { int Segments(); }\n\nclass Segment : IRoad {\n  public int Segments() => 1;\n}\nclass Network(List<IRoad> parts) : IRoad {\n  public int Segments() =>\n    parts.Sum(p => p.Segments());\n}',
    legend: [['p-red', 'segment'], ['pat', 'network']],
    init: h => {},
    steps: [
      {
        hl: [3, 4, 5], t: `${RC('Longest road is worth two points.')}<br>Road segments. Each one knows exactly one thing: <b>I am 1</b>.`,
        do: h => [0, 1, 2].forEach(i => h.add('s' + i, { x: 80 + i * 130, y: 500, w: 110, h: 34, label: '', badge: 1, cls: 'road' })),
      },
      {
        t: 'The road forks.',
        do: h => [3, 4].forEach(i => h.add('s' + i, { x: 470 + (i - 3) * 130, y: 500, w: 110, h: 34, label: '', badge: 1, cls: 'road' })),
      },
      {
        hl: [6, 7, 8], t: 'Group segments into <b>networks</b>. A network is also an <code>IRoad</code>.',
        do: h => {
          h.add('east', { x: 175, y: 330, w: 170, h: 60, label: 'east road', cls: 'pat' });
          h.add('fork', { x: 525, y: 330, w: 170, h: 60, label: 'north fork', cls: 'pat' });
          [0, 1, 2].forEach(i => h.ref('east', 's' + i, { cls: 'muted' }));
          [3, 4].forEach(i => h.ref('fork', 's' + i, { cls: 'muted' }));
        },
      },
      {
        t: 'Ask the top. It asks its children. They ask theirs. A segment answers <b>1</b>.',
        do: h => {
          h.add('all', { x: 350, y: 150, w: 200, h: 64, label: 'all roads', cls: 'pat hot', badge: 5 });
          h.ref('all', 'east', { cls: 'hot' }); h.ref('all', 'fork', { cls: 'hot' });
          h.set('east', { badge: 3 }); h.set('fork', { badge: 2 });
        },
      },
      {
        t: 'Grow the fork; nobody above it changes a line.<small><b>Composite</b>: treat one and many the same. UI trees, file systems, ASTs, org charts.</small>',
        do: h => {
          [5, 6].forEach(i => { h.add('s' + i, { x: 730 + (i - 5) * 130, y: 500, w: 110, h: 34, label: '', badge: 1, cls: 'road' }); h.ref('fork', 's' + i, { cls: 'muted' }); });
          h.set('fork', { badge: 4 }); h.set('all', { badge: 7, cls: 'pat' });
          h.text('lr', { x: 450, y: 100, label: 'longest road: 7', size: 28, anchor: 'middle', cls: 'grain' });
        },
      },
    ],
  });

  const OBS = [['o0', 360, 90, 'timber', 8], ['o1', 464, 90, 'clay', 5], ['o2', 568, 90, 'grain', 8], ['o3', 412, 180, 'wool', 3], ['o4', 516, 180, 'ore', 10]];
  scene('observer', {
    codeTitle: 'C#',
    code: 'class Dice {\n  public event Action<int> Rolled;\n  public void Roll() =>\n    Rolled?.Invoke(D6() + D6());\n}\n\nforeach (var tile in island.Tiles)\n  dice.Rolled += n => {\n    if (n == tile.Number) tile.Produce();\n  };',
    legend: [['p-red', 'red'], ['p-blue', 'blue'], ['p-white', 'white'], ['hot', 'notified']],
    init: h => {
      h.add('dice', { x: 60, y: 120, w: 140, h: 100, label: 'Dice', sub: '–', cls: 'feat' });
      OBS.forEach(([id, x, y, t, n]) => hex(h, id, x, y, t, n));
      piece(h, 'pR', 449, 165, 'red'); piece(h, 'pB', 657, 105, 'blue'); piece(h, 'pW', 345, 105, 'white');
      [['hR', 'red', 250], ['hB', 'blue', 500], ['hW', 'white', 750]].forEach(([id, c, x]) => h.region(id, { x: x - 110, y: 430, w: 220, h: 170, label: c + ' hand' }));
    },
    steps: [
      { t: `${RC('Whenever someone rolls…')}<br>Five tiles, three players, one pair of dice. Who needs to know about a roll?` },
      { hl: [3, 4], t: 'Roll: <b>8</b>. The dice raises one event. Then it is done.', do: h => h.set('dice', { label: '8', sub: 'rolled', cls: 'feat hot' }) },
      {
        hl: [7, 8, 9], t: 'Every tile subscribed. The ones showing <b>8</b> wake up.',
        do: h => {
          h.set('o0', { cls: 't-timber hot' }); h.set('o2', { cls: 't-grain hot' });
          h.ref('dice', 'o0', { cls: 'beh' }); h.ref('dice', 'o2', { cls: 'beh', c: [0, -130] });
        },
      },
      {
        t: 'Each producing tile notifies the buildings on its corners.',
        do: h => {
          h.ref('o0', 'pR', { cls: 'hot' }); h.ref('o0', 'pW', { cls: 'hot' }); h.ref('o2', 'pB', { cls: 'hot' });
          h.set('pR', { cls: 'p-red hot' }); h.set('pB', { cls: 'p-blue hot' }); h.set('pW', { cls: 'p-white hot' });
        },
      },
      {
        t: 'Cards land in hands. The dice never heard of players.<small><b>Observer</b>.</small>',
        do: h => {
          card(h, 'k1', 175, 480, 'timber', { spawn: 'o0' });
          card(h, 'k2', 675, 480, 'timber', { spawn: 'o0' });
          card(h, 'k3', 425, 480, 'grain', { spawn: 'o2' });
          h.edges = h.edges.filter(e => e.a === 'dice');
        },
      },
      {
        hl: [2], t: 'A 7 moves the bandit: <em>just another subscriber</em>. The dice didn’t change.<small>You already use this: C# <code>event</code>, JS <code>addEventListener</code>. Classic bug: forgetting to unsubscribe.</small>',
        do: h => {
          h.add('bandit', { x: 60, y: 300, w: 140, h: 60, label: 'Bandit', sub: 'n == 7', cls: 'bandit' });
          h.ref('dice', 'bandit', { cls: 'beh' });
          h.set('o0', { cls: 't-timber' }); h.set('o2', { cls: 't-grain' });
          h.set('pR', { cls: 'p-red' }); h.set('pB', { cls: 'p-blue' }); h.set('pW', { cls: 'p-white' });
        },
      },
    ],
  });

  scene('strategy', {
    codeTitle: 'C#',
    code: 'interface IStrategy { Move Next(GameView v); }\n\nclass BotPlayer(IStrategy strategy) : IPlayer {\n  public Move TakeTurn(GameView v) =>\n    strategy.Next(v);\n}\n\nclass CitiesFirst : IStrategy { … }\nclass RoadRush : IStrategy { … }',
    legend: [['p-blue', 'bot'], ['pat', 'strategy']],
    init: h => {
      h.add('bot', { x: 600, y: 270, w: 200, h: 100, label: 'BotPlayer', sub: 'TakeTurn()', cls: 'p-blue' });
      [['cf', 'CitiesFirst', 'ore + grain'], ['rr', 'RoadRush', 'timber + clay'], ['tr', 'Trader', 'harbours']].forEach(([id, l, s], i) => h.add(id, { x: 80, y: 120 + i * 160, w: 220, h: 80, label: l, sub: s, cls: 'pat beh' }));
    },
    steps: [
      { hl: [3, 4, 5, 6], t: `${RC('Can I play against a bot?')}<br>One bot. It has no opinion about how to win.` },
      {
        hl: [8], t: 'Plug in <b>CitiesFirst</b>: hoard ore and grain, upgrade early.',
        do: h => { h.ref('bot', 'cf', { cls: 'beh', label: 'strategy' }); h.set('cf', { cls: 'pat beh hot' }); h.text('out', { x: 700, y: 440, label: '→ builds cities', size: 24, anchor: 'middle', cls: 'muted' }); },
      },
      {
        hl: [9], t: 'Losing? Swap to <b>RoadRush</b> mid-game. The bot didn’t change.<small><b>Strategy</b>: the algorithm is a parameter.</small>',
        do: h => { h.unref('bot'); h.ref('bot', 'rr', { cls: 'beh', label: 'strategy' }); h.set('cf', { cls: 'pat beh' }); h.set('rr', { cls: 'pat beh hot' }); h.set('out', { label: '→ races for the longest road' }); },
      },
      {
        t: 'Remember the three players on the island, since minute one?<br><em>They were BotPlayers all along.</em><small>You have been watching this pattern for the whole talk.</small>',
        do: h => {
          h.set('rr', { cls: 'pat beh' });
          [['red', 600, 440], ['blue', 700, 440], ['white', 800, 440]].forEach(([c, x, y]) => { h.add('b' + c, { x: x - 30, y: y + 30, w: 80, h: 44, label: c, cls: 'p-' + c }); });
          h.ref('bred', 'cf', { cls: 'muted' }); h.ref('bblue', 'rr', { cls: 'muted' }); h.ref('bwhite', 'tr', { cls: 'muted' });
          h.del('out');
        },
      },
      {
        code: 'class BotPlayer(Func<GameView, Move> next) : IPlayer {\n  public Move TakeTurn(GameView v) => next(v);\n}\n\nnew BotPlayer(v => v.Cheapest(Piece.City));\nnew BotPlayer(v => v.Cheapest(Piece.Road));',
        hl: [1, 5, 6], t: 'A strategy with <b>one method</b> can be a plain function.<small>Same pattern, less ceremony. Reach for the interface when the strategy needs a name, state or several methods.</small>',
        do: h => {
          h.set('cf', { label: 'v => …City', sub: 'Func<>', cls: 'feat' });
          h.set('rr', { label: 'v => …Road', sub: 'Func<>', cls: 'feat hot' });
          h.set('tr', { label: 'v => …Trade', sub: 'Func<>', cls: 'feat' });
        },
      },
    ],
  });

  scene('command', {
    codeTitle: 'C#',
    code: 'interface ICommand {\n  void Execute(Game g);\n  void Undo(Game g);\n}\nrecord RoadCrew(Player P) : ICommand { … }\nrecord Harvest(Player P, Resource R) : ICommand { … }\n\nhistory.Push(card); card.Execute(game);\nhistory.Pop().Undo(game);',
    legend: [['cmd', 'action card'], ['hot', 'executing']],
    init: h => {
      h.region('hand', { x: 30, y: 40, w: 260, h: 560, label: 'hand' });
      h.region('hist', { x: 360, y: 40, w: 260, h: 560, label: 'history' });
      h.region('board', { x: 690, y: 40, w: 280, h: 560, label: 'game' });
      [['Scout'], ['RoadCrew'], ['Harvest'], ['Embargo']].forEach(([l], i) => h.add('c' + i, { x: 60, y: 90 + i * 100, w: 200, h: 70, label: l, cls: 'cmd' }));
    },
    steps: [
      { hl: [1, 2, 3, 4], t: `${RC('I misclicked. Can I undo?')}<br>Turn every move into a card: something you <b>hold</b>, <b>play</b> and <b>take back</b>.` },
      {
        hl: [5, 8], t: 'Play <b>RoadCrew</b>: it goes on the history, then executes. Two free roads.',
        do: h => {
          h.set('c1', { x: 390, y: 480, cls: 'cmd hot' });
          h.add('r1', { x: 740, y: 120, w: 130, h: 30, label: '', cls: 'road', spawn: 'c1' });
          h.add('r2', { x: 780, y: 170, w: 130, h: 30, label: '', cls: 'road', spawn: 'c1' });
        },
      },
      {
        hl: [6, 8], t: 'Play <b>Harvest</b>: take all the grain.',
        do: h => {
          h.set('c1', { cls: 'cmd' });
          h.set('c2', { x: 390, y: 390, cls: 'cmd hot' });
          card(h, 'g1', 760, 300, 'grain', { spawn: 'c2' }); card(h, 'g2', 760, 355, 'grain', { spawn: 'c2' });
        },
      },
      {
        hl: [9], t: '“Wait, I misclicked.” Pop and <b>undo</b>.<small>It is an object, so you can queue it, log it, send it, undo it: <b>Command</b>.</small>',
        do: h => {
          h.set('c2', { x: 60, y: 290, cls: 'cmd' });
          h.del('g1 g2');
        },
      },
      {
        t: 'Bonus: replay the history from an empty board and you get the same game.<br><em>Replays and multiplayer sync for free.</em><small>Send the moves, not the screen. Undo stacks, job queues, Redux actions: all Command.</small>',
        do: h => h.text('es', { x: 490, y: 628, label: 'replay ▸', size: 22, anchor: 'middle', cls: 'warn' }),
      },
    ],
  });

  scene('turn-state', {
    codeTitle: 'C#',
    code: 'abstract record TurnState {\n  public virtual TurnState Roll(Game g) => Nope();\n  public virtual TurnState Build(Piece p) => Nope();\n  public virtual TurnState End() => Nope();\n}\nrecord Rolling : TurnState {\n  public override TurnState Roll(Game g) =>\n    g.Dice.Roll() == 7\n      ? new MovingBandit()\n      : new Trading();\n}',
    legend: [['state', 'state'], ['hot', 'current']],
    init: h => {
      const S = [['roll', 'Rolling', 120, 120], ['trade', 'Trading', 640, 120], ['build', 'Building', 640, 420], ['end', 'Next player', 120, 420]];
      S.forEach(([id, l, x, y]) => h.add(id, { x, y, w: 220, h: 80, label: l, cls: 'state' }));
      h.add('setup', { x: 120, y: 10, w: 220, h: 64, label: 'Setup', sub: '1-2-3-3-2-1', cls: 'state cur' });
      h.ref('setup', 'roll', { cls: 'muted', label: 'round 2 done' });
      h.add('bnd', { x: 380, y: 270, w: 220, h: 80, label: 'MovingBandit', cls: 'state', o: 0.35 });
      h.ref('roll', 'trade', { cls: 'muted', label: 'roll' }); h.ref('trade', 'build', { cls: 'muted' }); h.ref('build', 'end', { cls: 'muted', label: 'end' }); h.ref('end', 'roll', { cls: 'muted' });
    },
    steps: [
      {
        code: 'record Setup(int Round, int Seat) : TurnState {\n  public override TurnState Build(Piece p) =>\n    p is Settlement or Road\n      ? Next()\n      : Nope();\n\n  TurnState Next() => (Round, Seat) switch {\n    (1, 3) => new Setup(2, 3),\n    (1, _) => this with { Seat = Seat + 1 },\n    (2, 1) => new Rolling(),\n    (2, _) => this with { Seat = Seat - 1 },\n  };\n}',
        hl: [7, 8, 9, 10, 11], t: `${RC('Setup goes 1-2-3-3-2-1. A 7 moves the bandit.')}<br>Setup first: snake order, free pieces. Its <b>own state</b>, its own rules.`,
      },
      { hl: [6, 7, 8, 9], t: 'Then a turn has phases. Right now: <b>Rolling</b>.', do: h => { h.set('setup', { cls: 'state' }); h.set('roll', { cls: 'state cur' }); h.edge('setup', 'roll', { cls: 'hot' }); } },
      {
        hl: [3], t: 'Build before rolling? <em>Not now.</em> The state rejects it; no <code>if</code> in the caller.',
        do: h => h.edge('setup', 'roll', { cls: 'muted' }) && h.text('no', { x: 230, y: 250, label: 'Build() ✗', size: 26, anchor: 'middle', cls: 'danger' }),
      },
      { t: 'Roll a 6: <b>Trading</b>.', do: h => { h.del('no'); h.set('roll', { cls: 'state' }); h.set('trade', { cls: 'state cur' }); h.edge('roll', 'trade', { cls: 'hot' }); } },
      { t: 'Then <b>Building</b>. Then <b>next player</b>.', do: h => { h.set('trade', { cls: 'state' }); h.set('end', { cls: 'state cur' }); h.edge('roll', 'trade', { cls: 'muted' }); h.edge('trade', 'build', { cls: 'hot' }); h.edge('build', 'end', { cls: 'hot' }); } },
      {
        hl: [8, 9, 10], t: 'Roll a 7: a whole extra phase. One new class, no edits to the others.<small><b>State</b>: behaviour follows the phase.</small>',
        do: h => {
          h.edge('trade', 'build', { cls: 'muted' }); h.edge('build', 'end', { cls: 'muted' });
          h.set('end', { cls: 'state' }); h.set('bnd', { o: 1, cls: 'state cur' });
          h.ref('roll', 'bnd', { cls: 'hot', label: '7' }); h.ref('bnd', 'trade', { cls: 'muted' });
        },
      },
      {
        t: 'Three states: a <code>switch</code> on an enum is fine. Twelve, with rules per state: objects, or a state-machine library.<br><em>You’ll meet it in checkout flows, workflows and game loops.</em>',
        do: h => h.set('bnd', { cls: 'state' }),
      },
    ],
  });

  const SW1 = 'class Game {\n  Phase phase = Phase.Roll;\n\n  public void Click(Tile tile) {\n    switch (phase) {\n      case Phase.Roll:\n        board.Produce(dice.Roll());\n        phase = Phase.Build;\n        break;\n      case Phase.Build:\n        board.Settle(current, tile);\n        phase = Phase.Roll;\n        break;\n    }\n  }\n}';
  const SW2 = 'switch (phase) {\n  case Phase.Roll:\n    board.Produce(dice.Roll());\n    phase = Phase.Build;\n    break;\n  case Phase.Build:\n    if (undoClicked && last != null) {\n      board.Remove(last);\n      current.Hand.Refund(last.Cost);\n      last = null;\n      break;\n    }\n    last = board.Settle(current, tile);\n    phase = Phase.Roll;\n    break;\n}';
  const SW3 = 'switch (phase) {\n  case Phase.Setup:\n    last = board.Settle(current, tile, free: true);\n    seat = round == 1 ? seat + 1 : seat - 1;\n    if (seat == 4) { round = 2; seat = 3; }\n    if (seat == 0) phase = Phase.Roll;\n    break;\n  case Phase.Roll:\n    var n = dice.Roll();\n    if (n == 7) { phase = Phase.MoveBandit; break; }\n    board.Produce(n);\n    phase = Phase.Build;\n    break;\n  case Phase.MoveBandit: …\n  case Phase.Build:\n    if (undoClicked && last != null) { … }\n';
  scene('switch', {
    codeTitle: 'C# · Game.cs',
    code: SW1,
    legend: [['feat', 'the Game class'], ['rule', 'rule card'], ['p-red', 'a settlement']],
    init: h => {
      OBS.forEach(([id, x, y, t, n]) => hex(h, id, x - 260, y + 120, t, n));
      h.add('dice', { x: 40, y: 40, w: 120, h: 80, label: 'Dice', sub: '–', cls: 'feat' });
      h.add('game', { x: 660, y: 470, w: 280, h: 90, label: 'Game', sub: 'switch (phase) · 2 cases', cls: 'feat' });
    },
    steps: [
      { hl: [5], t: 'Cold open. One class, one <code>switch</code> on the phase.<br>Let’s play.' },
      {
        hl: [6, 7, 8, 9], t: 'Click: roll an <b>8</b>. The tiles showing 8 produce.',
        do: h => { h.set('dice', { label: '8', sub: 'rolled', cls: 'feat hot' }); h.set('o0', { cls: 't-timber hot' }); h.set('o2', { cls: 't-grain hot' }); },
      },
      {
        hl: [10, 11, 12, 13], t: 'Click: build a settlement.<br><em>It works. Ship it.</em>',
        do: h => { h.set('dice', { cls: 'feat' }); h.set('o0', { cls: 't-timber' }); h.set('o2', { cls: 't-grain' }); piece(h, 'pR', 189, 285, 'red', '', { w: 34, h: 34 }); },
      },
      {
        code: SW2, hl: [7, 8, 9, 10, 11, 12], t: `First rule card: ${RC('I misclicked. Can I undo?')}<br>A flag, a field, an <code>if</code>. Fine.`,
        do: h => { rule(h, 'r1', 'I misclicked. Can I undo?'); h.set('game', { sub: 'switch (phase) · 2 cases · 1 flag' }); },
      },
      {
        code: SW3, hl: [2, 3, 4, 5, 6, 7, 10, 14], t: `Two more: ${RC('Setup goes 1-2-3-3-2-1.')} ${RC('A 7 moves the bandit.')}<br>More cases, more counters, and every case knows about the others.`,
        do: h => {
          rule(h, 'r2', 'Setup goes 1-2-3-3-2-1.', 590, 100); rule(h, 'r3', 'A 7 moves the bandit.', 590, 180);
          h.set('game', { sub: 'switch (phase) · 4 cases · 5 fields', cls: 'feat hot' });
        },
      },
      {
        code: SW3, t: 'Nothing is broken. But every new rule hurts more than the last.<br><em>That pain is a pressure.</em><small>Tonight we draw rule cards one at a time, and let each pressure pick its pattern.</small>',
        do: h => { h.text('pain', { x: 800, y: 440, label: 'next card: ???', size: 24, anchor: 'middle', cls: 'danger' }); },
      },
    ],
  });

  const PIECES = [['v0', 'Settlement', 'red', 1], ['v1', 'City', 'red', 2], ['v2', 'Road', 'red', 0], ['v3', 'Settlement', 'blue', 1], ['v4', 'Longest road', 'blue', 2], ['v5', 'Point card', 'blue', 1]];
  scene('visitor', {
    codeTitle: 'C#',
    code: 'interface IPieceVisitor {\n  void Visit(Settlement s);  void Visit(City c);\n  void Visit(Road r);        void Visit(Card c);\n}\nclass City : Piece {\n  public override void Accept(IPieceVisitor v) => v.Visit(this);\n}\n\nclass ScoreVisitor : IPieceVisitor {\n  public Dictionary<Player, int> Points = new();\n  public void Visit(Settlement s) => Points[s.Owner] += 1;\n  public void Visit(City c)       => Points[c.Owner] += 2;\n  public void Visit(Road r)       { }\n  public void Visit(Card c)       => Points[c.Owner] += c.Points;\n}',
    legend: [['p-red', 'red'], ['p-blue', 'blue'], ['pat', 'visitor']],
    init: h => {
      PIECES.forEach(([id, l, c], i) => h.add(id, { x: 40 + i * 157, y: 300, w: 140, h: 70, label: l, cls: 'p-' + c }));
      h.text('sr', { x: 250, y: 560, label: 'red: –', size: 30, anchor: 'middle', cls: 'muted' });
      h.text('sb', { x: 750, y: 560, label: 'blue: –', size: 30, anchor: 'middle', cls: 'muted' });
    },
    steps: [
      { hl: [5, 6, 7], t: `${RC('Who won?')}<br>Points from settlements, cities, cards and the longest road. Every piece scores differently.` },
      {
        hl: [9, 10, 11, 12], t: 'A <b>ScoreVisitor</b> walks the pieces. Each piece says “visit me as what I am”.',
        do: h => {
          h.add('vis', { x: 40, y: 150, w: 140, h: 60, label: 'ScoreVisitor', cls: 'pat beh hot' });
          h.ref('vis', 'v0', { cls: 'beh' });
          h.set('sr', { label: 'red: 1', cls: '' });
        },
      },
      {
        hl: [12, 13], t: 'City: 2. Road: 0. Red has <b>3</b>.',
        do: h => { h.set('vis', { x: 354 }); h.unref('vis'); h.ref('vis', 'v2', { cls: 'beh' }); h.set('sr', { label: 'red: 3' }); },
      },
      {
        hl: [11, 14], t: 'Blue: settlement, longest road, a point card: <b>4</b>. Blue wins.',
        do: h => { h.set('vis', { x: 825 }); h.unref('vis'); h.ref('vis', 'v5', { cls: 'beh' }); h.set('sb', { label: 'blue: 4 ★', cls: 'grain' }); },
      },
      {
        hl: [1, 2, 3, 4], t: 'Next question about the same pieces: <em>“how good is this position, for the bot?”</em> A new visitor. <b>No piece changes.</b><small><b>Visitor</b>: add operations to a stable set of classes.</small>',
        do: h => {
          h.set('vis', { x: 40, cls: 'pat beh' }); h.unref('vis');
          h.add('vis2', { x: 40, y: 60, w: 160, h: 60, label: 'BotEvalVisitor', cls: 'pat beh hot' });
          h.ref('vis2', 'v0', { cls: 'beh' });
        },
      },
      {
        code: 'int Points(Piece p) => p switch {\n  Settlement => 1,\n  City       => 2,\n  Card c     => c.Points,\n  _          => 0,\n};\n\nvar red = pieces\n  .Where(p => p.Owner == Red)\n  .Sum(Points);',
        hl: [1, 2, 3, 4, 5, 6], t: 'Honest moment: for one or two operations, a <code>switch</code> and a lambda do the job.<small>Visitor pays off when the <em>operations</em> keep coming and the pieces don’t: compilers, analyzers, document trees.</small>',
        do: h => { h.set('vis2', { cls: 'pat beh' }); h.unref('vis2'); },
      },
    ],
  });

  scene('memento', {
    codeTitle: 'C#',
    code: 'class Game {\n  Board board; Hands hands; int turn;\n\n  public Snapshot Save() =>\n    new(board.Clone(), hands.Clone(), turn);\n\n  public void Restore(Snapshot s) =>\n    (board, hands, turn) = (s.Board, s.Hands, s.Turn);\n\n  public sealed class Snapshot(Board b, Hands h, int t) {\n    internal Board Board => b;\n    internal Hands Hands => h;\n    internal int Turn => t;\n  }\n}',
    legend: [['feat', 'game'], ['locked', 'snapshot (opaque)'], ['cmd', 'command log']],
    init: h => {
      h.add('game', { x: 60, y: 60, w: 300, h: 110, label: 'Game', sub: 'turn 14 · red 5 · blue 4', cls: 'feat' });
      h.region('slots', { x: 560, y: 40, w: 400, h: 220, label: 'save slots' });
      h.region('mini', { x: 60, y: 230, w: 300, h: 180, label: 'board' });
      [0, 1, 2].forEach(i => piece(h, 'm' + i, 100 + i * 80, 300, i % 2 ? 'blue' : 'red'));
    },
    steps: [
      { hl: [2], t: `${RC('Save the game. We finish next week.')}<br>The game’s state is private, and should stay that way.` },
      {
        hl: [4, 5], t: '<b>Save()</b>: the game packs its own state into a snapshot.',
        do: h => h.add('snap', { x: 610, y: 100, w: 300, h: 90, label: 'Snapshot', sub: 'turn 14 · 🔒', cls: 'locked', spawn: 'game' }),
      },
      {
        hl: [10, 11, 12, 13], t: 'Outside code can store it, but can’t read or edit it. Only the game can.',
        do: h => h.set('snap', { cls: 'locked hot' }),
      },
      {
        t: 'Play on. Turn 17. Things go badly for red.',
        do: h => {
          h.set('snap', { cls: 'locked' });
          h.set('game', { sub: 'turn 17 · red 5 · blue 7' });
          [3, 4].forEach(i => piece(h, 'm' + i, 100 + i * 80 - 160, 360, 'blue'));
        },
      },
      {
        hl: [7, 8], t: '<b>Restore()</b>: back to turn 14.<small><b>Memento</b>: capture and restore state without exposing the internals.</small>',
        do: h => {
          h.del('m3 m4');
          h.set('game', { sub: 'turn 14 · red 5 · blue 4', cls: 'feat hot' });
          h.ref('snap', 'game', { cls: 'hot', label: 'restore' });
        },
      },
      {
        t: 'Wait. We already keep a <b>command log</b>. Replay it from an empty board: that is a save file too.<br><em>Patterns work together.</em><small>Snapshot every few turns, replay the rest: how many games, and event-sourced systems, load fast.</small>',
        do: h => {
          h.unref('snap'); h.set('game', { cls: 'feat' });
          h.region('log', { x: 560, y: 300, w: 400, h: 300, label: 'command log' });
          [['RoadCrew', 0], ['Build', 1], ['Trade', 2], ['Build', 3]].forEach(([l, i]) => h.add('lc' + i, { x: 590 + (i % 2) * 180, y: 350 + Math.floor(i / 2) * 100, w: 160, h: 64, label: l, cls: 'cmd' }));
          h.ref('lc0', 'game', { cls: 'beh', label: 'replay', c: [-40, 60] });
        },
      },
    ],
  });

  const SOCKETS = [['kit', 'IPieceKit', 'Abstract Factory', 60, 60, 'cre'], ['bld', 'IBuilding', 'Decorator', 60, 280, 'str'], ['dice', 'Dice.Rolled', 'Observer', 60, 500, 'beh'], ['turn', 'TurnState', 'State', 700, 60, 'beh'], ['strat', 'IStrategy', 'Strategy', 700, 280, 'beh'], ['vis', 'IPieceVisitor', 'Visitor', 700, 500, 'beh']];
  scene('expansion', {
    legend: [['feat', 'base game'], ['pat', 'pattern seam'], ['hot', 'new from the box']],
    init: h => {
      h.add('core', { x: 390, y: 270, w: 220, h: 100, label: 'Game', sub: 'base rules', cls: 'feat' });
      SOCKETS.forEach(([id, l, s, x, y, f]) => { h.add(id, { x, y, w: 240, h: 64, label: l, sub: s, cls: 'pat ' + f }); h.ref('core', id, { cls: 'muted' }); });
    },
    steps: [
      { t: 'The <b>expansion box</b> arrives: sea tiles, ships, pirates, a sailing phase.<br>Do the new rules plug in, or do we rewrite?' },
      {
        t: 'Ships: a new <b>kit</b>. The building yard doesn’t notice.',
        do: h => { h.add('x1', { x: 340, y: 60, w: 160, h: 64, label: 'SeaKit', cls: 'feat hot', spawn: 'kit' }); h.ref('x1', 'kit', { cls: 'hot' }); },
      },
      {
        t: 'Harbour towns: one more <b>wrapper</b> around a settlement.',
        do: h => { h.set('x1', { cls: 'feat' }); h.add('x2', { x: 340, y: 160, w: 160, h: 64, label: 'HarbourTown', cls: 'feat hot', spawn: 'bld' }); h.ref('x2', 'bld', { cls: 'hot' }); },
      },
      {
        t: 'Pirates on a 7: one more <b>subscriber</b> on the dice.',
        do: h => { h.set('x2', { cls: 'feat' }); h.add('x3', { x: 340, y: 500, w: 160, h: 64, label: 'Pirate', cls: 'feat hot', spawn: 'dice' }); h.ref('x3', 'dice', { cls: 'hot' }); },
      },
      {
        t: 'A sailing phase, a bot that explores, points for the longest fleet: a <b>state</b>, a <b>strategy</b>, a <b>visitor</b>.',
        do: h => {
          h.set('x3', { cls: 'feat' });
          [['x4', 'Sailing', 'turn', 60], ['x5', 'Explorer', 'strat', 280], ['x6', 'FleetScore', 'vis', 500]].forEach(([id, l, to, y]) => { h.add(id, { x: 520, y, w: 160, h: 64, label: l, cls: 'feat hot', spawn: to }); h.ref(id, to, { cls: 'hot' }); });
        },
      },
      {
        t: 'Edits to existing classes: <em>zero</em>. The rules plugged in.<small>That is what the pressures bought you. With the switch from the cold open, this box was a rewrite.</small>',
        do: h => { ['x4', 'x5', 'x6'].forEach(id => h.set(id, { cls: 'feat' })); h.set('core', { cls: 'feat hot', sub: '0 lines changed' }); },
      },
    ],
  });

  scene('overbuilt', {
    codeTitle: 'C#',
    code: 'class Game {\n  public int Roll() => D6() + D6();\n  int D6() => Random.Shared.Next(1, 7);\n}',
    legend: [['pat', 'class'], ['hot', 'the actual dice roll']],
    init: h => h.add('game', { x: 400, y: 280, w: 200, h: 70, label: 'Game', sub: 'Roll()', cls: 'feat' }),
    steps: [
      { hl: [2, 3], t: 'One class. It rolls dice. Base game.' },
      {
        t: '“We might need another game one day.” <b>Expansion one.</b>',
        do: h => {
          h.add('ig', { x: 400, y: 160, w: 200, h: 56, label: 'IGame', cls: 'pat' });
          h.add('gf', { x: 80, y: 160, w: 240, h: 56, label: 'GameFactory', cls: 'pat cre' });
          h.add('igf', { x: 80, y: 60, w: 240, h: 56, label: 'IGameFactory', cls: 'pat cre' });
          h.ref('game', 'ig', { cls: 'muted' }); h.ref('gf', 'igf', { cls: 'muted' }); h.ref('gf', 'game', { cls: 'muted' });
        },
      },
      {
        t: '“Dice might change. We might need logging.” <b>Expansion two.</b>',
        do: h => {
          h.add('ds', { x: 680, y: 160, w: 260, h: 56, label: 'IDiceStrategy', cls: 'pat beh' });
          h.add('dsd', { x: 680, y: 60, w: 260, h: 56, label: 'LoggingDiceDecorator', cls: 'pat' });
          h.add('dsp', { x: 680, y: 280, w: 260, h: 56, label: 'DiceStrategyProvider', cls: 'pat cre' });
          h.ref('game', 'dsp', { cls: 'muted' }); h.ref('dsp', 'ds', { cls: 'muted' }); h.ref('dsd', 'ds', { cls: 'muted' });
        },
      },
      {
        t: '“Rolling should be an event.” <b>Expansion three.</b>',
        do: h => {
          h.add('rc', { x: 80, y: 420, w: 240, h: 56, label: 'RollDiceCommand', cls: 'cmd' });
          h.add('rch', { x: 80, y: 520, w: 240, h: 56, label: 'RollDiceHandler', cls: 'cmd' });
          h.add('roa', { x: 680, y: 420, w: 260, h: 56, label: 'RolledObserverAdapter', cls: 'pat beh' });
          h.add('mb', { x: 400, y: 520, w: 200, h: 56, label: 'IMediator', cls: 'pat beh' });
          h.ref('rc', 'rch', { cls: 'muted' }); h.ref('rch', 'mb', { cls: 'muted' }); h.ref('mb', 'roa', { cls: 'muted' }); h.ref('roa', 'game', { cls: 'muted' });
          h.set('game', { label: 'GameImpl', sub: '' });
        },
      },
      {
        t: 'Day one of the new joiner:<br><em>“Where do the dice get rolled?”</em><small>Every box was justified on its own. Together, nobody can find the dice.</small>',
        do: h => { h.ptr('nj', { x: 500, y: 410, label: 'new joiner', cls: 'danger' }); h.set('dsd', { cls: 'pat hot' }); },
      },
      {
        t: '<b>Patterns without pressure.</b> Every box answered a rule card nobody drew.<br><em>Wait for the second card.</em><small>The first time, write the simple thing. The second time it hurts, you know which pattern and where.</small>',
        do: h => {
          h.del('ig gf igf ds dsd dsp rc rch roa mb nj');
          h.set('game', { label: 'Game', sub: 'Roll()', cls: 'feat hot' });
        },
      },
    ],
  });
})();
