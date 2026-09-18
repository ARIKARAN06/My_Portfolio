(() => {
  const key = 'arikaran-portfolio-theme';
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let chosen = null;
  try {
    const saved = localStorage.getItem(key);
    if (saved === 'light' || saved === 'dark') chosen = saved;
  } catch (_) { /* Storage may be unavailable in private browsing. */ }
  function apply(mode) {
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.colorScheme = mode;
    const button = document.getElementById('theme-toggle');
    if (!button) return;
    const dark = mode === 'dark';
    button.hidden = false;
    button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    button.setAttribute('aria-pressed', String(dark));
    document.getElementById('theme-label').textContent = dark ? 'Light' : 'Dark';
  }
  apply(chosen || (system.matches ? 'dark' : 'light'));
  document.addEventListener('DOMContentLoaded', () => {
    apply(document.documentElement.dataset.theme);
    document.getElementById('theme-toggle').addEventListener('click', () => {
      chosen = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, chosen); } catch (_) {}
      apply(chosen);
    });
  });
  system.addEventListener('change', event => {
    if (!chosen) apply(event.matches ? 'dark' : 'light');
  });
})();
