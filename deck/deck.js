(() => {
  const { Player, scenes, highlight } = Deck;
  const deckEl = document.getElementById('deck');
  const notesEl = document.getElementById('notes');
  const progressEl = document.getElementById('progress');
  const counterEl = document.getElementById('counter');
  const slides = Deck.slides;
  let si = 0, st = 0, player = null, slideEl = null;

  const CAT = { cre: 'Creational', str: 'Structural', beh: 'Behavioral', cs: 'C#' };
  const chips = l => (l ? String(l).split(' ').map(x => `<span class="chip ${x}">${CAT[x] || x}</span>`).join('') : '');
  const hexes = `<svg class="title-hexes" viewBox="0 0 520 600">${[[1,0,'timber'],[2,0,'clay'],[0.5,1,'grain'],[1.5,1,'ore'],[2.5,1,'wool'],[1,2,'timber'],[2,2,'grain'],[1.5,3,'clay']].map(([c, r, t], i) => {
    const w = 150, h = 173, x = 20 + c * w - w / 2 + 75, y = 30 + r * h * 0.75;
    return `<polygon class="hx t-${t}" style="animation-delay:${i * 90}ms" points="${x + w / 2},${y} ${x + w},${y + h / 4} ${x + w},${y + h * 3 / 4} ${x + w / 2},${y + h} ${x},${y + h * 3 / 4} ${x},${y + h / 4}"/>`;
  }).join('')}</svg>`;

  const stepsOf = s => (s.type === 'viz' ? scenes[s.scene].steps.length : s.reveal ? (s.items || s.rows || s.cards).length : 1);
  const FAM = { cre: 'Settle', str: 'Build', beh: 'Play' };
  const ruleCard = (c, s) => `<div class="rcard ${c.fam}${s.reveal ? ' rv' : ''}"><div class="rc-k">${FAM[c.fam]} · rule card</div><div class="rc-q">${c.rule}</div><div class="rc-p">${s.flip ? c.pat : 'which pattern?'}</div></div>`;

  function header(s) {
    return `<header>${s.kicker ? `<div class="kicker">${s.kicker}</div>` : ''}<h2>${s.title || ''}</h2><div class="chips">${chips(s.lang)}</div></header>`;
  }

  function codeBlock(code, lang, hl = []) {
    return highlight(code, lang).map((l, i) => `<div class="ln ${hl.includes(i + 1) ? 'on' : ''} ${hl.length && !hl.includes(i + 1) ? 'dim' : ''}">${l}</div>`).join('');
  }

  const render = {
    title: s => `<div class="title-wrap">
        <div class="kicker">${s.kicker || ''}</div>
        <h1>${s.title}</h1>
        <div class="subtitle">${s.subtitle || ''}</div>
        ${s.chips ? `<div class="vs">${s.chips}</div>` : ''}
        ${s.footer ? `<div class="footer">${s.footer}</div>` : ''}
      </div>${s.hexes === false ? '' : hexes}`,
    section: s => `<div class="section-wrap"><div class="num">${s.n}</div><h1>${s.title}</h1><div class="subtitle">${s.subtitle || ''}</div></div>`,
    statement: s => `${s.kicker ? header(s) : ''}<div class="statement"><div class="big">${s.big}</div><div class="small">${s.small || ''}</div></div>`,
    bullets: s => `${header(s)}<div class="bullets-wrap ${s.cols ? 'cols' : ''}"><ul class="bullets">${s.items.map(i => `<li>${i}</li>`).join('')}</ul>${s.aside ? `<div class="aside-box">${s.aside}</div>` : ''}</div>`,
    compare: s => `${header(s)}<div class="compare">${['left', 'right'].map(k => `
        <div class="col ${k}"><div class="col-h"><span class="chip ${k}">${s[k].chip}</span>${s[k].title ? `<span>${s[k].title}</span>` : ''}</div>
        ${s[k].code ? `<pre class="code">${codeBlock(s[k].code, 'cs')}</pre>` : ''}
        ${s[k].html ? `<div class="col-body">${s[k].html}</div>` : ''}</div>`).join('')}</div>
        ${s.footer ? `<div class="compare-foot">${s.footer}</div>` : ''}`,
    table: s => `${header(s)}<table class="cmp"><thead><tr>${s.head.map(h => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${s.rows.map((r, k) => `<tr class="${s.reveal ? 'rv' : ''}">${r.map((c, j) => (j ? `<td>${c}</td>` : `<th>${c}</th>`)).join('')}</tr>`).join('')}</tbody></table>
        ${s.footer ? `<div class="compare-foot">${s.footer}</div>` : ''}`,
    cards: s => `${header(s)}<div class="cards ${s.compact ? 'compact' : ''}" style="--cols:${s.cols || s.cards.length}">${s.cards.map(c => ruleCard(c, s)).join('')}</div>
        ${s.footer ? `<div class="compare-foot">${s.footer}</div>` : ''}`,
    viz: s => {
      const sc = scenes[s.scene];
      return `${header(s)}<div class="viz-body">
        <div class="stage-wrap"><svg class="stage"></svg></div>
        <aside>
          <div class="stepbar"></div>
          <div class="caption"></div>
          ${sc.code ? `<div class="code-h">${sc.codeTitle || ''}</div><pre class="code"></pre>` : ''}
          ${sc.legend ? `<div class="legend">${sc.legend.map(([c, t]) => `<span><i class="sw ${c}"></i>${t}</span>`).join('')}</div>` : ''}
        </aside></div>`;
    },
  };

  function updateViz(s, animate) {
    const sc = scenes[s.scene];
    const step = sc.steps[st];
    player.goto(st, animate);
    slideEl.querySelector('.caption').innerHTML = step.t || '';
    slideEl.querySelector('.stepbar').innerHTML = sc.steps.map((_, i) => `<i class="${i < st ? 'done' : i === st ? 'cur' : ''}"></i>`).join('');
    const pre = slideEl.querySelector('pre.code');
    if (pre) pre.innerHTML = codeBlock(step.code || sc.code, sc.lang || 'cs', step.hl || []);
  }

  function show(i, s, animate = true) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    const slide = slides[i];
    const n = stepsOf(slide);
    s = s < 0 ? n - 1 : Math.max(0, Math.min(n - 1, s));
    const changed = i !== si || !slideEl;
    si = i; st = s;
    if (changed) {
      if (slideEl) slideEl.remove();
      slideEl = document.createElement('section');
      slideEl.className = `slide t-${slide.type} ${slide.cls || ''}`;
      slideEl.innerHTML = render[slide.type](slide);
      deckEl.appendChild(slideEl);
      player = null;
      if (slide.type === 'viz') player = new Player(scenes[slide.scene], slideEl.querySelector('svg.stage'));
      notesEl.innerHTML = slide.notes ? slide.notes.replace(/\n/g, '<br>') : '<em>no notes</em>';
    }
    if (slide.type === 'viz') updateViz(slide, animate && !changed);
    if (slide.reveal) slideEl.querySelectorAll('.bullets li, tr.rv, .rcard.rv').forEach((li, k) => li.classList.toggle('hidden', k > st));
    progressEl.style.width = `${((i + (st + 1) / n) / slides.length) * 100}%`;
    counterEl.textContent = `${i + 1} / ${slides.length}`;
    history.replaceState(null, '', `#${i + 1}.${st + 1}`);
  }

  const next = () => (st < stepsOf(slides[si]) - 1 ? show(si, st + 1) : si < slides.length - 1 && show(si + 1, 0));
  const prev = () => (st > 0 ? show(si, st - 1) : si > 0 && show(si - 1, -1));

  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); e.shiftKey ? show(si + 1, 0) : next(); }
    else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); e.shiftKey ? show(si - 1, 0) : prev(); }
    else if (k === 'ArrowDown') show(si + 1, 0);
    else if (k === 'ArrowUp') show(si - 1, 0);
    else if (k === 'Home') show(0, 0);
    else if (k === 'End') show(slides.length - 1, 0);
    else if (k === 'n' || k === 'N') document.body.classList.toggle('show-notes');
    else if (k === 'f' || k === 'F') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
    else if (k === 'r' || k === 'R') slides[si].type === 'viz' && show(si, 0, false);
  });
  deckEl.addEventListener('click', e => { if (!e.target.closest('a')) (e.clientX < innerWidth * 0.25 ? prev() : next()); });

  function fit() {
    const sc = Math.min(innerWidth / 1600, innerHeight / 900);
    deckEl.style.transform = `translate(-50%, -50%) scale(${sc})`;
  }
  addEventListener('resize', fit);
  fit();

  const m = location.hash.match(/^#(\d+)(?:\.(\d+))?/);
  show(m ? +m[1] - 1 : 0, m && m[2] ? +m[2] - 1 : 0, false);
})();
