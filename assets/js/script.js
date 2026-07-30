// ----- Typewriter effect -----
const roles = [
  "ERP Manager",
  "Frappe / ERPNext Developer",
  "AI Agent Developer",
  "Full Stack Developer"
];
const typeEl = document.getElementById('typewriter');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const current = roles[roleIndex];
  if (!deleting) {
    charIndex++;
    typeEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    typeEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 40 : 80);
}
typeLoop();

// ----- Scroll reveal -----
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ----- Active nav link on scroll -----
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-link');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(sec => navObserver.observe(sec));

// ----- Navbar background + scroll progress -----
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 20 ? '0 8px 24px -12px rgba(0,0,0,0.5)' : 'none';
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
  scrollProgress.style.width = pct + '%';
});

// ----- Mobile nav toggle -----
const navToggle = document.getElementById('navToggle');
const navLinksList = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinksList.classList.toggle('open');
});
navLinksList.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinksList.classList.remove('open');
  });
});

// ----- Project gallery lightbox -----
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCounter = document.getElementById('lightboxCounter');

let galleryImgs = [];
let galleryIndex = 0;

function updateLightbox() {
  const img = galleryImgs[galleryIndex];
  if (!img) return;
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  const card = img.closest('.project-card');
  lightboxTitle.textContent = card ? (card.querySelector('h3')?.textContent.trim() || '') : '';
  lightboxCaption.textContent = img.alt || '';
  const multi = galleryImgs.length > 1;
  lightboxCounter.textContent = multi ? `${galleryIndex + 1} / ${galleryImgs.length}` : '';
  lightboxPrev.style.display = multi ? 'flex' : 'none';
  lightboxNext.style.display = multi ? 'flex' : 'none';
}
function openLightbox(imgs, index) {
  galleryImgs = imgs;
  galleryIndex = index;
  updateLightbox();
  lightbox.classList.add('open');
}
function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxImg.src = '';
}
document.querySelectorAll('.project-gallery').forEach(gallery => {
  const imgs = Array.from(gallery.querySelectorAll('img'));
  imgs.forEach((img, i) => {
    img.addEventListener('click', () => openLightbox(imgs, i));
  });
});
if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => {
  e.stopPropagation();
  galleryIndex = (galleryIndex - 1 + galleryImgs.length) % galleryImgs.length;
  updateLightbox();
});
if (lightboxNext) lightboxNext.addEventListener('click', (e) => {
  e.stopPropagation();
  galleryIndex = (galleryIndex + 1) % galleryImgs.length;
  updateLightbox();
});
if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}
document.addEventListener('keydown', (e) => {
  if (!lightbox || !lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lightboxPrev.click();
  if (e.key === 'ArrowRight') lightboxNext.click();
});

// ----- Project card "Read more" (collapses long descriptions so cards
// in the same grid row line up regardless of content length) -----
function refreshReadMoreVisibility() {
  document.querySelectorAll('.project-card').forEach(card => {
    const body = card.querySelector('.project-body');
    const btn = card.querySelector('.read-more-btn');
    if (!body || !btn) return;
    if (card.classList.contains('expanded')) return;
    btn.classList.toggle('visible', body.scrollHeight > body.clientHeight + 4);
  });
}
document.querySelectorAll('.project-card').forEach(card => {
  const btn = card.querySelector('.read-more-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const expanded = card.classList.toggle('expanded');
    btn.querySelector('.label').textContent = expanded ? 'Read less' : 'Read more';
  });
});
// Text can reflow once webfonts swap in, so re-measure after fonts settle
// and after full page load, not just on the first requestAnimationFrame.
requestAnimationFrame(refreshReadMoreVisibility);
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(refreshReadMoreVisibility);
}
window.addEventListener('load', refreshReadMoreVisibility);
window.addEventListener('resize', refreshReadMoreVisibility);

// ----- Theme toggle -----
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });
}

// ----- Character-by-character scroll reveal -----
const charRevealEl = document.getElementById('aboutQuote');
if (charRevealEl) {
  const text = charRevealEl.textContent;
  charRevealEl.textContent = '';
  const chars = [...text].map(ch => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch;
    charRevealEl.appendChild(span);
    return span;
  });
  const updateCharReveal = () => {
    const rect = charRevealEl.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = vh * 0.85;
    const end = vh * 0.35;
    const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
    const revealCount = Math.floor(progress * chars.length);
    chars.forEach((span, i) => {
      span.style.opacity = i < revealCount ? '1' : '0.15';
    });
  };
  window.addEventListener('scroll', updateCharReveal, { passive: true });
  window.addEventListener('resize', updateCharReveal);
  updateCharReveal();
}

// ----- Magnetic hover on hero avatar -----
const magnetWrap = document.querySelector('.hero-visual');
const magnetEl = document.querySelector('.avatar-core');
if (magnetWrap && magnetEl) {
  const strength = 5;
  const padding = 60;
  magnetWrap.addEventListener('mousemove', (e) => {
    const rect = magnetWrap.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    magnetEl.style.transition = 'transform 0.3s ease-out';
    magnetEl.style.transform = `translate(calc(-50% + ${dx / strength}px), calc(-50% + ${dy / strength}px))`;
  });
  magnetWrap.addEventListener('mouseleave', () => {
    magnetEl.style.transition = 'transform 0.6s ease-in-out';
    magnetEl.style.transform = 'translate(-50%, -50%)';
  });
}

// ----- Cursor spotlight -----
window.addEventListener('mousemove', (e) => {
  document.documentElement.style.setProperty('--mx', e.clientX + 'px');
  document.documentElement.style.setProperty('--my', e.clientY + 'px');
});

// ----- Footer year -----
document.getElementById('year').textContent = new Date().getFullYear();

// ----- 3D tilt on project / skill cards -----
const tiltCards = document.querySelectorAll('.project-card, .stat-card, .timeline-card, .module-card, .skill-cat');
tiltCards.forEach(card => {
  card.style.transformStyle = 'preserve-3d';
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -8;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
