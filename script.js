// Nav scroll + floating CTA
const nav = document.getElementById('nav');
const floatCta = document.getElementById('floatCta');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  floatCta.classList.toggle('visible', window.scrollY > 320);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('.nav__mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  }),
  { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
);
reveals.forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 70}ms`;
  observer.observe(el);
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = document.querySelector('.nav')?.offsetHeight || 72;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - 8, behavior: 'smooth' });
  });
});

// Countdown timer — campaign ends June 15, 2026
(function initCountdown() {
  const CAMPAIGN_END = new Date('2026-06-15T23:59:59+02:00').getTime();
  const elDays    = document.getElementById('cd-days');
  const elHours   = document.getElementById('cd-hours');
  const elMinutes = document.getElementById('cd-minutes');
  const elSeconds = document.getElementById('cd-seconds');
  if (!elDays) return;

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const diff = CAMPAIGN_END - Date.now();
    if (diff <= 0) {
      elDays.textContent = elHours.textContent = elMinutes.textContent = elSeconds.textContent = '00';
      return;
    }
    elDays.textContent    = pad(Math.floor(diff / 86400000));
    elHours.textContent   = pad(Math.floor((diff % 86400000) / 3600000));
    elMinutes.textContent = pad(Math.floor((diff % 3600000) / 60000));
    elSeconds.textContent = pad(Math.floor((diff % 60000) / 1000));
  }

  tick();
  setInterval(tick, 1000);
})();

// Contact form with formsubmit.co
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

const fields = {
  name:    { el: document.getElementById('name'),    validate: v => v.trim().length >= 2 },
  email:   { el: document.getElementById('email'),   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
  service: { el: document.getElementById('service'), validate: v => v !== '' },
  message: { el: document.getElementById('message'), validate: v => v.trim().length >= 10 },
};

function validateField(key) {
  const f = fields[key];
  const ok = f.validate(f.el.value);
  f.el.parentElement.classList.toggle('has-error', !ok);
  f.el.classList.toggle('error', !ok);
  return ok;
}

Object.keys(fields).forEach(key => {
  fields[key].el.addEventListener('blur', () => validateField(key));
  fields[key].el.addEventListener('input', () => {
    if (fields[key].el.classList.contains('error')) validateField(key);
  });
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  const allValid = Object.keys(fields).map(validateField).every(Boolean);
  if (!allValid) return;

  const btnText    = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  btnText.hidden    = true;
  btnLoading.hidden = false;
  submitBtn.disabled = true;

  try {
    const res = await fetch('https://formsubmit.co/ajax/igor.bobusky@gmail.com', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form),
    });
    if (res.ok) {
      form.reset();
      formSuccess.hidden = false;
      submitBtn.hidden = true;
    } else {
      throw new Error();
    }
  } catch {
    btnText.hidden    = false;
    btnLoading.hidden = true;
    submitBtn.disabled = false;
    alert('Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut oder schreiben Sie direkt an igor.bobusky@gmail.com');
  }
});
