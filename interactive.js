(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const filters = document.querySelector('.project-filters');
  const projects = [...document.querySelectorAll('.project[data-category]')];
  filters.hidden = false;
  filters.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    projects.forEach(project => {
      const visible = button.dataset.filter === 'all' || project.dataset.category === button.dataset.filter;
      project.hidden = !visible;
      if (visible) {
        count++;

      }
    });
    document.querySelector('#filter-status').textContent = `${count} ${count === 1 ? 'project' : 'projects'} shown`;
    document.dispatchEvent(new Event('projectsfiltered'));
  });
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
