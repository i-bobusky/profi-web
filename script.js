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

// Smooth scroll — guard against href="#" to prevent page-top jump
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const navH = document.querySelector('.nav')?.offsetHeight || 72;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - 8, behavior: 'smooth' });
  });
});

// Contact form — Web3Forms AJAX
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
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form),
    });
    const data = await res.json();
    if (data.success) {
      form.reset();
      submitBtn.hidden = true;
      formSuccess.hidden = false;
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      throw new Error(data.message);
    }
  } catch {
    btnText.hidden    = false;
    btnLoading.hidden = true;
    submitBtn.disabled = false;
    alert('Etwas ist schiefgelaufen. Bitte schreiben Sie direkt an igor.bobusky@gmail.com');
  }
});
