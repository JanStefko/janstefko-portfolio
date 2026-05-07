// Nav: switch dark/light based on scroll position
const nav = document.getElementById('nav');
const hero = document.querySelector('.hero');
const contact = document.querySelector('.contact');

function updateNav() {
  const heroBottom = hero.offsetTop + hero.offsetHeight;
  const contactTop = contact.offsetTop;
  const y = window.scrollY + 80;
  if (y < heroBottom || y > contactTop) {
    nav.classList.add('dark-mode');
    nav.classList.remove('light-mode');
  } else {
    nav.classList.add('light-mode');
    nav.classList.remove('dark-mode');
  }
}
window.addEventListener('scroll', updateNav, { passive: true });
window.addEventListener('resize', updateNav);
updateNav();

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));