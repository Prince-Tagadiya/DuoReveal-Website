/* DuoReveal Marketing Site · main.js · Creato4 Lab 2026 */

/* ── Nav scroll effect ──────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
}, { passive: true });

/* ── Scroll reveal ──────────────────────────────────────────── */
const reveals = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => revealObserver.observe(el));

/* ── MacBook lid tilt on scroll ─────────────────────────────── */
const lid = document.getElementById('macbook-lid');
const foldGlow = document.getElementById('fold-glow');

window.addEventListener('scroll', () => {
  const heroH = document.querySelector('.hero').offsetHeight;
  const pct = Math.min(window.scrollY / (heroH * 0.5), 1);
  // Tilt lid more as user scrolls
  const tilt = -8 - pct * 22;
  if (lid) lid.style.transform = `rotateX(${tilt}deg)`;
  if (foldGlow) foldGlow.style.opacity = 0.6 + pct * 0.4;
}, { passive: true });

/* ── Stats counter animation ────────────────────────────────── */
function animateCount(el, target, suffix, decimals = 0, duration = 1200) {
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = (ease * target).toFixed(decimals);
    el.textContent = val + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsBar = document.querySelector('.stats-bar');
let statsAnimated = false;
const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    const nums = document.querySelectorAll('.stat-num');
    // 0.0%, 120, 0.01°, 6, 100%
    const data = [
      { target: 0.0, suffix: '%', decimals: 1 },
      { target: 120, suffix: '', decimals: 0 },
      { target: 0.01, suffix: '°', decimals: 2 },
      { target: 6, suffix: '', decimals: 0 },
      { target: 100, suffix: '%', decimals: 0 },
    ];
    nums.forEach((el, i) => {
      const d = data[i];
      if (d) animateCount(el, d.target, d.suffix, d.decimals);
    });
  }
}, { threshold: 0.5 });
if (statsBar) statsObserver.observe(statsBar);

/* ── FAQ accordion ──────────────────────────────────────────── */
document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      document.querySelectorAll('.faq-item[open]').forEach(other => {
        if (other !== item) other.removeAttribute('open');
      });
    }
  });
});

/* ── Smooth anchor scroll ───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Cursor glow on hero ────────────────────────────────────── */
const hero = document.querySelector('.hero');
if (hero) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const a1 = hero.querySelector('.aurora-1');
    const a2 = hero.querySelector('.aurora-2');
    if (a1) a1.style.transform = `translate(${(x - 50) * 0.1}px, ${(y - 50) * 0.08}px)`;
    if (a2) a2.style.transform = `translate(${(x - 50) * -0.08}px, ${(y - 50) * 0.06}px)`;
  }, { passive: true });
}

/* ── Theme Switcher (Dark & Light Mode) ─────────────────────── */
const themeToggleBtn = document.getElementById('theme-toggle');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('duoreveal-theme', theme);
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'light' ? '#f8f9fa' : '#030305');
  }
  if (themeToggleBtn) {
    themeToggleBtn.setAttribute('aria-label', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    themeToggleBtn.innerHTML = theme === 'light' 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  }
}

const savedTheme = localStorage.getItem('duoreveal-theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
setTheme(savedTheme);

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current === 'light' ? 'dark' : 'light');
  });
}
