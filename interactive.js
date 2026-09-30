(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const filters = document.querySelector('.project-filters');
  const projects = [...document.querySelectorAll('.project[data-category]')];
  const search = document.querySelector('#project-search');
  const reset = document.querySelector('#clear-project-search');
  const empty = document.querySelector('#project-empty');
  const activeTech = document.querySelector('#active-technology');
  const normalize = value => value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const content = new Map(projects.map(card => [card, normalize(card.textContent)]));
  const tags = new Map(projects.map(card => [card, [...card.querySelectorAll('.tags span')].map(tag => normalize(tag.textContent))]));
  let category = 'all';
  let technology = '';
  function applyFilters() {
    const words = normalize(search.value).split(' ').filter(Boolean);
    filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item.dataset.filter === category)));
    let count = 0;
    projects.forEach(project => {
      const visible = (category === 'all' || project.dataset.category === category)
        && (!technology || tags.get(project).includes(normalize(technology)))
        && words.every(word => content.get(project).includes(word));
      project.hidden = !visible;
      if (visible) count++;
    });
    const restricted = Boolean(search.value.trim() || technology || category !== 'all');
    reset.hidden = !restricted;
    activeTech.hidden = !technology;
    activeTech.textContent = technology ? `Technology: ${technology} · Remove` : '';
    empty.hidden = count > 0;
    document.querySelector('#filter-status').textContent = `${count} of ${projects.length} projects${restricted ? ' match your selection' : ' available'}`;
    document.dispatchEvent(new Event('projectsfiltered'));
  }
  function clearFilters() {
    category = 'all'; technology = ''; search.value = ''; applyFilters();
  }
  document.querySelector('.project-explorer').hidden = false;
  filters.hidden = false;
  filters.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    category = button.dataset.filter;
    applyFilters();
  });
  search.addEventListener('input', applyFilters);
  reset.addEventListener('click', () => {clearFilters(); search.focus({preventScroll:true});});
  activeTech.addEventListener('click', () => {technology = ''; applyFilters(); search.focus({preventScroll:true});});
  document.querySelector('#reset-empty-search').addEventListener('click', () => {clearFilters(); search.focus({preventScroll:true});});
  projects.forEach(project => project.querySelectorAll('.tags span').forEach(tag => {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = tag.textContent;
    button.setAttribute('aria-label', `Show projects using ${tag.textContent}`);
    button.addEventListener('click', () => {
      technology = tag.textContent; category = 'all'; search.value = ''; applyFilters();
      search.focus({preventScroll:true});
    });
    tag.replaceWith(button);
  }));
  document.addEventListener('portfolio:project', event => {
    const card = projects.find(project => project.id === event.detail.id);
    if (!card) return;
    clearFilters();
    requestAnimationFrame(() => document.dispatchEvent(new CustomEvent('projectfocus', {detail:{id:card.id}})));
  });
  document.querySelector('#filter-status').textContent = `${projects.length} projects available · Select a technology tag to find related work.`;
  const title = document.querySelector('#role-text');
  const toggle = document.querySelector('#role-toggle');
  const roles = ['Aspiring Data Scientist', 'AI & ML Enthusiast', 'Computer Science Student'];
  let index = 0;
  let paused = false;
  let timer;
  let effect;
  toggle.hidden = false;
  function sync() {
    clearInterval(timer);
    if (effect) effect.cancel();
    toggle.hidden = reduce.matches;
    if (paused || reduce.matches || document.hidden) return;
    timer = setInterval(() => {
      index = (index + 1) % roles.length;
      title.textContent = roles[index];
      if (title.animate) effect = title.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,easing:'ease-out'});
    }, 3600);
  }
  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.textContent = paused ? '▶' : 'Ⅱ';
    toggle.setAttribute('aria-label', paused ? 'Resume rotating title' : 'Pause rotating title');
    toggle.setAttribute('aria-pressed', String(paused));
    sync();
  });
  reduce.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  sync();
})();
