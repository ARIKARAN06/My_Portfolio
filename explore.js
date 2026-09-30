(() => {
  const dialog = document.querySelector('#quick-jump-dialog');
  const open = document.querySelector('#quick-jump-open');
  const search = document.querySelector('#quick-jump-search');
  const list = document.querySelector('#quick-jump-results');
  const status = document.querySelector('#quick-jump-status');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const sections = [
    ['home', 'Home', 'Introduction and resume'],
    ['projects', 'Projects', 'Machine learning, Android and research'],
    ['experience', 'Experience', 'Internships and practical work'],
    ['about', 'About me', 'Computer Science at SASTRA'],
    ['skills', 'Skills', 'Languages, libraries and methods'],
    ['activities', 'Beyond code', 'Organizing and volunteering'],
    ['contact', 'Contact', 'Email, phone and social profiles']
  ].map(([id,title,description]) => ({id,title,description,kind:'Section'}));
  const projects = [...document.querySelectorAll('.project[data-category]')].map(card => ({
    id:card.id, title:card.querySelector('h3').textContent,
    description:card.querySelector('.tags').textContent, kind:'Project'
  }));
  const items = [...sections, ...projects];
  let returnFocus;
  let previousOverflow = '';
  function navigate(item) {
    dialog.close();
    const target = document.getElementById(item.kind === 'Project' ? 'projects' : item.id);
    target.scrollIntoView({behavior:reduced.matches ? 'auto' : 'smooth',block:'start'});
    if (item.kind === 'Project') {
      document.dispatchEvent(new CustomEvent('portfolio:project', {detail:{id:item.id}}));
    } else {
      if (!target.hasAttribute('tabindex')) target.tabIndex = -1;
      target.focus({preventScroll:true});
    }
  }
  function render() {
    const query = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const matches = items.filter(item => query.every(word => `${item.title} ${item.description} ${item.kind}`.toLowerCase().includes(word)));
    list.replaceChildren();
    for (const item of matches) {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      const title = document.createElement('strong'); title.textContent = item.title;
      const meta = document.createElement('span'); meta.textContent = item.kind === 'Project' ? 'Project' : item.description;
      button.append(title,meta); button.addEventListener('click', () => navigate(item));
      li.append(button); list.append(li);
    }
    if (!matches.length) {
      const empty = document.createElement('li'); empty.className = 'quick-jump-empty';
      empty.textContent = 'No matches. Try “projects”, “skills” or “contact”.'; list.append(empty);
    }
    status.textContent = `${matches.length} destinations found`;
  }
  function show() {
    if (dialog.open) return;
    returnFocus = document.activeElement;
    previousOverflow = document.body.style.overflow;
    search.value = ''; render(); dialog.showModal();
    document.body.style.overflow = 'hidden'; search.focus();
  }
  if (typeof dialog.showModal === 'function') {
    open.hidden = false;
    open.addEventListener('click',show);
    if (/Mac|iPhone|iPad/.test(navigator.platform)) open.querySelector('kbd').textContent = '⌘ K';
    document.addEventListener('keydown', event => {
      if ((event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === 'k') {
        event.preventDefault(); if (dialog.open) dialog.close(); else show();
      }
    });
  }
  search.addEventListener('input',render);
  dialog.querySelector('#quick-jump-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{
    document.body.style.overflow = previousOverflow;
    if (document.activeElement === document.body || dialog.contains(document.activeElement)) returnFocus?.focus({preventScroll:true});
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  dialog.addEventListener('keydown', event => {
    if (!['ArrowDown','ArrowUp','Enter'].includes(event.key)) return;
    const buttons = [...list.querySelectorAll('button')];
    if (!buttons.length) return;
    if (event.key === 'Enter') {
      if (event.target === search) {event.preventDefault(); buttons[0].click();}
      return;
    }
    if (event.target !== search && !list.contains(event.target)) return;
    event.preventDefault();
    const index = buttons.indexOf(document.activeElement);
    const next = index < 0 ? (event.key === 'ArrowDown' ? 0 : buttons.length - 1)
      : (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
    buttons[next].focus();
  });
  const copy = document.querySelector('#copy-email');
  const feedback = document.querySelector('#contact-feedback');
  const emailLink = document.querySelector('.contact-details a[href^="mailto:"]');
  let resetTimer;
  copy.hidden = false;
  copy.addEventListener('click', async () => {
    clearTimeout(resetTimer);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(emailLink.textContent.trim());
      copy.textContent = 'Email copied';
      feedback.textContent = 'Email address copied. Paste it into your email app.';
    } catch {
      copy.textContent = 'Copy email';
      feedback.textContent = `Copy unavailable in this browser. You can select ${emailLink.textContent.trim()} or use Email me.`;
      const selection = window.getSelection();
      if (selection) {const range = document.createRange(); range.selectNodeContents(emailLink); selection.removeAllRanges(); selection.addRange(range);}
    }
    resetTimer = setTimeout(()=>{copy.textContent = 'Copy email';},3500);
  });
})();
