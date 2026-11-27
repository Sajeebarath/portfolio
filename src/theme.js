const toggle = document.getElementById('theme');
function setTheme(light) {
  document.body.classList.toggle('light', light);
  toggle.textContent = light ? '☾' : '☀';
  toggle.title = light ? 'Switch to dark mode' : 'Switch to light mode';
  toggle.setAttribute('aria-label', toggle.title);
}
let light = false;
try { light = localStorage.getItem('sajee-theme') === 'light'; } catch {}
setTheme(light);
toggle.addEventListener('click', () => {
  const next = !document.body.classList.contains('light');
  setTheme(next);
  try { localStorage.setItem('sajee-theme', next ? 'light' : 'dark'); } catch {}
});

const messageForm = document.querySelector('#message-form');
messageForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(messageForm);
  const sender = data.get('sender').trim();
  const email = data.get('reply').trim();
  const subject = data.get('topic').trim();
  const body = data.get('message').trim() + '\n\n' + sender + '\n' + email;
  if (event.submitter?.value === 'email') {
    location.href = 'mailto:sajeebarathsuntharalingam@gmail.com?subject='
      + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  } else {
    window.open('https://wa.me/94750475386?text=' + encodeURIComponent(subject + '\n\n' + body), '_blank', 'noopener');
  }
});

// Build the download from the bundled PDF in the click gesture, including offline.
const pdfData = document.querySelector('#cv-data').textContent.trim();
let cvUrl;
for (const link of document.querySelectorAll('a[download]')) {
  link.addEventListener('click', event => {
    event.preventDefault();
    if (!cvUrl) {
      const bytes = Uint8Array.from(atob(pdfData), char => char.charCodeAt(0));
      cvUrl = URL.createObjectURL(new Blob([bytes], { type: 'application/octet-stream' }));
    }
    const save = document.createElement('a');
    save.href = cvUrl;
    save.download = link.download;
    document.body.append(save);
    save.click();
    save.remove();
  });
}

const popup = document.querySelector('#popover');
const photo = popup.querySelector('.popphoto');
const action = popup.querySelector('.poplink');
// Use one preview for each destination, including alternate links to the same profile.
const destinations = new Map();
for (const item of document.querySelectorAll('a[data-title]')) destinations.set(item.href, item);
for (const link of document.querySelectorAll('a[href]:not([download]):not([data-title])')) {
  const original = destinations.get(link.href);
  if (original) {
    Object.assign(link.dataset, original.dataset);
  } else {
    link.dataset.title = link.textContent.trim();
    link.dataset.note = link.hash && link.origin === location.origin
      ? 'Jump to this section of my portfolio.' : 'Continue to ' + link.dataset.title + '.';
    if (link.getAttribute('href').startsWith('#')) link.dataset.section = 'true';
  }
  link.setAttribute('aria-haspopup', 'dialog');
}
for (const trigger of document.querySelectorAll('[data-title], [data-profile], [data-project]')) {  trigger.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const profile = trigger.hasAttribute('data-profile');
    const project = trigger.closest('.card');
    const caseContent = popup.querySelector('.case-content');
    caseContent.replaceChildren();
    const slug = trigger.dataset.project;
    const caseTitle = slug ? project.querySelector('h3').textContent : '';
    if (slug) caseContent.append(document.getElementById('case-' + slug).content.cloneNode(true));
    popup.classList.toggle('case-popup', Boolean(slug));
    popup.querySelector('h2').textContent = profile ? 'Sajeebarath Suntharalingam' : caseTitle || trigger.dataset.title;
    popup.querySelector('.popnote').textContent = profile
      ? 'Cyber Security undergraduate at SLIIT, exploring application security, network defence and digital forensics.'
      : slug ? project.querySelector('p').textContent : trigger.dataset.note;
    const preview = popup.querySelector('.certpreview');
    preview.hidden = !trigger.dataset.preview;
    if (!preview.hidden) preview.src = trigger.dataset.preview;
    photo.hidden = !profile;
    const destination = slug ? project.querySelector('.repo')?.href : trigger.href;
    action.hidden = !destination && !profile;
    if (!action.hidden) {
      action.href = profile ? '#contact' : destination;
      action.textContent = profile ? 'Get in touch' : slug ? 'View team repository' : trigger.dataset.section ? 'Go to section' : trigger.dataset.title === 'Email' ? 'Compose email' : trigger.dataset.preview ? 'View certificate PDF' : 'Open ' + trigger.dataset.title;
      action.target = profile || trigger.dataset.section || trigger.protocol === 'mailto:' ? '_self' : '_blank';
      action.rel = 'noopener';
    }
    popup.showModal();
  });
}
popup.querySelector('.closepop').addEventListener('click', () => popup.close());
action.addEventListener('click', () => popup.close());
popup.addEventListener('click', event => {
  const bounds = popup.getBoundingClientRect();
  if (event.target === popup && (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom)) popup.close();
});

const composer = document.getElementById('composer');
document.getElementById('compose').addEventListener('click', () => composer.showModal());
composer.querySelector('.closepop').addEventListener('click', () => composer.close());
function shine(element) {
  if (!element || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  element.classList.remove('glint');
  void element.offsetWidth;
  element.classList.add('glint');
}
document.addEventListener('pointerdown', event => {
  shine(event.target.closest('.skill, .cert, .portrait, .hero-name, .identity, .message-invite, .footlinks a, .message button'));
});
document.addEventListener('animationend', event => {
  if (event.animationName === 'touchglow') event.target.classList.remove('glint');
});
