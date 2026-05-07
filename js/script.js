// =====================================================
// NAV: switch dark/light based on scroll position
// =====================================================
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

// =====================================================
// REVEAL on scroll
// =====================================================
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// =====================================================
// GALLERY: Show more / Hide
// =====================================================
const galleryToggles = document.querySelectorAll('.gallery-toggle');

galleryToggles.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const target = document.getElementById(targetId);
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
      target.classList.add('gallery-hidden');
      btn.setAttribute('aria-expanded', 'false');

      // Pokud zavírám "more-1", schovej i toggle pro "more-2"
      if (targetId === 'gallery-more-1') {
        const toggle2 = document.querySelector('[data-target="gallery-more-2"]');
        const more2 = document.getElementById('gallery-more-2');
        if (toggle2) {
          toggle2.classList.remove('gallery-toggle-visible');
          toggle2.setAttribute('aria-expanded', 'false');
        }
        if (more2) {
          more2.classList.add('gallery-hidden');
        }
      }
    } else {
      target.classList.remove('gallery-hidden');
      btn.setAttribute('aria-expanded', 'true');

      // Pokud otevírám "more-1", zobrazím i toggle pro "more-2"
      if (targetId === 'gallery-more-1') {
        const toggle2 = document.querySelector('[data-target="gallery-more-2"]');
        if (toggle2) {
          toggle2.classList.add('gallery-toggle-visible');
        }
      }
    }
  });
});

// =====================================================
// LIGHTBOX
// =====================================================
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('.lightbox-img');
const lightboxCaption = lightbox.querySelector('.lightbox-caption');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const lightboxPrev = lightbox.querySelector('.lightbox-prev');
const lightboxNext = lightbox.querySelector('.lightbox-next');

let currentLightboxIndex = 0;
let lightboxItems = [];

function refreshLightboxItems() {
  // Sběr pouze viditelných obrázků (nejsou v gallery-hidden)
  lightboxItems = Array.from(document.querySelectorAll('.gallery:not(.gallery-hidden) figure[data-full]'));
}

function openLightbox(index) {
  refreshLightboxItems();
  if (lightboxItems.length === 0) return;
  currentLightboxIndex = index;
  showLightboxImage();
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function showLightboxImage() {
  const fig = lightboxItems[currentLightboxIndex];
  if (!fig) return;
  const fullSrc = fig.dataset.full;
  const caption = fig.querySelector('figcaption')?.textContent || '';
  lightboxImg.src = fullSrc;
  lightboxImg.alt = caption;
  lightboxCaption.textContent = caption;
}

function lightboxNextHandler() {
  currentLightboxIndex = (currentLightboxIndex + 1) % lightboxItems.length;
  showLightboxImage();
}

function lightboxPrevHandler() {
  currentLightboxIndex = (currentLightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
  showLightboxImage();
}

// Klik na figure -> otevře lightbox
document.querySelectorAll('.gallery figure[data-full]').forEach(fig => {
  fig.addEventListener('click', () => {
    refreshLightboxItems();
    const index = lightboxItems.indexOf(fig);
    if (index !== -1) {
      openLightbox(index);
    }
  });
});

// Ovládání lightboxu
lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); lightboxNextHandler(); });
lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); lightboxPrevHandler(); });

// Klik mimo obrázek -> zavřít
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Klávesy: ESC, šipky
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') lightboxNextHandler();
  if (e.key === 'ArrowLeft') lightboxPrevHandler();
});
