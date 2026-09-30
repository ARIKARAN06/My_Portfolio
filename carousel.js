(() => {
  const track = document.querySelector('#project-carousel');
  if (!track) return;
  const cards = [...track.querySelectorAll('.project')];
  const controls = document.querySelector('.carousel-controls');
  const previous = document.querySelector('#project-prev');
  const next = document.querySelector('#project-next');
  const status = document.querySelector('#project-position');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const selectors = document.querySelector('#project-selectors');
  const selectorsByCard = new Map(cards.map((card, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = String(index + 1).padStart(2, '0');
    button.setAttribute('aria-label', `Show ${card.querySelector('h3').textContent}`);
    button.setAttribute('aria-controls', card.id);
    button.addEventListener('click', () => go(card));
    selectors.append(button);
    return [card, button];
  }));
  let active = null;
  let pending = false;
  let target = null;
  const visible = () => cards.filter(card => !card.hidden);
  // offsetLeft measures layout geometry, unaffected by the receding scale.
  const position = card => card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2;
  function select(card) {
    const list = visible();
    controls.hidden = !list.length;
    selectors.hidden = !list.length;
    selectorsByCard.forEach((button, item) => {
      button.hidden = item.hidden;
      button.setAttribute('aria-pressed', String(item === card));
    });
    if (!card) {
      cards.forEach(item => item.classList.remove('is-active'));
      active = null; target = null;
      previous.disabled = true; next.disabled = true;
      status.textContent = ''; status.dataset.total = '0';
      return;
    }
    const index = list.indexOf(card);
    cards.forEach(item => item.classList.toggle('is-active', item === card));
    previous.disabled = index <= 0;
    next.disabled = index >= list.length - 1;
    if (active !== card || status.dataset.total !== String(list.length)) {
      status.textContent = `${index + 1} / ${list.length} · ${card.querySelector('h3').textContent}`;
      status.dataset.total = String(list.length);
    }
    active = card;
  }
  function sync() {
    pending = false;
    const nearest = visible().reduce((best, card) => !best || Math.abs(position(card) - track.scrollLeft) < Math.abs(position(best) - track.scrollLeft) ? card : best, null);
    select(nearest);
  }
  function go(card, instant = false) {
    if (!card) {select(null); return;}
    target = card;
    select(card);
    track.scrollTo({left: position(card), behavior: instant || reduced.matches ? 'instant' : 'smooth'});
    if (instant || reduced.matches) sync();
  }
  function move(delta) {
    const list = visible();
    const from = target && list.includes(target) ? target : active;
    go(list[Math.max(0, Math.min(list.length - 1, list.indexOf(from) + delta))]);
  }
  controls.hidden = false;
  track.classList.add('carousel-ready');
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('scroll', () => {
    if (!pending) {pending = true; requestAnimationFrame(sync);}
  }, {passive:true});
  track.addEventListener('scrollend', () => {target = null; sync();});
  track.addEventListener('pointerdown', () => {target = null;}, {passive:true});
  track.addEventListener('wheel', () => {target = null;}, {passive:true});
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault(); const list = visible(); go(event.key === 'Home' ? list[0] : list[list.length - 1]);
    }
  });
  track.addEventListener('focusin', event => {
    const card = event.target.closest('.project');
    if (card && card !== active) go(card, true);
  });
  track.addEventListener('click', event => {
    if (event.target.closest('a,button,summary,details')) return;
    const card = event.target.closest('.project');
    if (card && card !== active) go(card);
  });
  document.addEventListener('projectsfiltered', () => {
    target = null;
    go(visible()[0], true);
  });
  document.addEventListener('projectfocus', event => {
    const card = cards.find(item => item.id === event.detail.id && !item.hidden);
    if (!card) return;
    go(card, true);
    card.querySelector('summary')?.focus({preventScroll:true});
  });
  let width = track.clientWidth;
  if ('ResizeObserver' in window) new ResizeObserver(() => {
    if (width === track.clientWidth) return;
    width = track.clientWidth;
    go(active && !active.hidden ? active : visible()[0], true);
  }).observe(track);
  go(visible()[1] || visible()[0], true);
})();

(() => {
 const ticker = document.querySelector('.ticker');
 const button = ticker?.querySelector('.ticker-pause');
 if (!button) return;
 button.addEventListener('click', () => {
  const paused = ticker.classList.toggle('is-paused');
  button.textContent = paused ? '▶' : 'Ⅱ';
  button.setAttribute('aria-label', paused ? 'Resume running skills strip' : 'Pause running skills strip');
  button.setAttribute('aria-pressed', String(paused));
 });
})();
