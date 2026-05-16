const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('.nav__mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
reveals.forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  observer.observe(el);
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});

const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

const fields = {
  name:    { el: document.getElementById('name'),    err: document.getElementById('nameError'),    validate: v => v.trim().length >= 2 },
  email:   { el: document.getElementById('email'),   err: document.getElementById('emailError'),   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
  service: { el: document.getElementById('service'), err: document.getElementById('serviceError'), validate: v => v !== '' },
  message: { el: document.getElementById('message'), err: document.getElementById('messageError'), validate: v => v.trim().length >= 10 },
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
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  btnText.hidden = true;
  btnLoading.hidden = false;
  submitBtn.disabled = true;
  await new Promise(r => setTimeout(r, 1200));
  form.reset();
  formSuccess.hidden = false;
  submitBtn.hidden = true;
});