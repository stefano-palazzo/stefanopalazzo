document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js');

const tabButtons = [...document.querySelectorAll('[data-tab]')];
const panels = [...document.querySelectorAll('[data-panel]')];
const knownTabs = new Set(tabButtons.map((button) => button.dataset.tab));

function activateTab(name, { updateHash = true, focus = false } = {}) {
  if (!knownTabs.has(name)) name = 'about';

  tabButtons.forEach((button) => {
    const active = button.dataset.tab === name;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
    if (active && focus) button.focus();
  });

  panels.forEach((panel) => {
    const active = panel.dataset.panel === name;
    panel.classList.toggle('is-active', active);
    panel.hidden = !active;
  });

  if (updateHash) history.replaceState(null, '', name === 'about' ? location.pathname + location.search : `#${name}`);
}

tabButtons.forEach((button, index) => {
  button.addEventListener('click', () => activateTab(button.dataset.tab));
  button.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let target = index;
    if (event.key === 'ArrowLeft') target = (index - 1 + tabButtons.length) % tabButtons.length;
    if (event.key === 'ArrowRight') target = (index + 1) % tabButtons.length;
    if (event.key === 'Home') target = 0;
    if (event.key === 'End') target = tabButtons.length - 1;
    activateTab(tabButtons[target].dataset.tab, { focus: true });
  });
});

window.addEventListener('hashchange', () => activateTab(location.hash.slice(1), { updateHash: false }));
activateTab(location.hash.slice(1) || 'about', { updateHash: false });

const lightboxData = {
  workshop: {
    src: 'assets/workshop.webp',
    alt: 'Stefano Palazzo, Mehmet Emre Bozkurt and Yutong Zheng beside their poster at Diamond Light Source',
    title: 'Advances in X-ray Imaging',
    caption: 'Diamond Light Source · 2026'
  },
  poster: {
    src: 'assets/poster.webp',
    alt: 'Poster about artificial-intelligence-assisted measurement of interdendritic flow during aluminium alloy solidification',
    title: 'Investigating interdendritic flow',
    caption: 'Research poster · 2026'
  }
};

const dialog = document.querySelector('[data-lightbox-dialog]');
const dialogImage = dialog.querySelector('[data-lightbox-image]');
const dialogTitle = dialog.querySelector('[data-lightbox-title]');
const dialogCaption = dialog.querySelector('[data-lightbox-caption]');

document.querySelectorAll('[data-lightbox]').forEach((button) => {
  button.addEventListener('click', () => {
    const item = lightboxData[button.dataset.lightbox];
    dialogImage.src = item.src;
    dialogImage.alt = item.alt;
    dialogTitle.textContent = item.title;
    dialogCaption.textContent = item.caption;
    dialog.showModal();
  });
});

dialog.querySelector('[data-lightbox-close]').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();
