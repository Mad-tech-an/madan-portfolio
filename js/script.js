// Interactive features for Madan Tiwari's portfolio
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const themeToggle = document.getElementById('themeToggle');
  const progressBar = document.getElementById('progressBar');
  const backToTop = document.getElementById('backToTop');
  const year = document.getElementById('year');

  year.textContent = new Date().getFullYear();

  // Mobile navigation
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  // Theme preference, saved locally when browser storage is available
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('madan-theme'); } catch (_) {}
  if (savedTheme === 'light') body.classList.add('light');
  themeToggle.textContent = body.classList.contains('light') ? '☀' : '☾';
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light');
    const theme = body.classList.contains('light') ? 'light' : 'dark';
    themeToggle.textContent = theme === 'light' ? '☀' : '☾';
    try { localStorage.setItem('madan-theme', theme); } catch (_) {}
  });

  // Scroll progress and back-to-top button
  const handleScroll = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
    backToTop.classList.toggle('visible', window.scrollY > 500);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Reveal sections as they enter the viewport
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  // Animated hero role text
  const typedText = document.getElementById('typedText');
  const phrases = ['work better', 'stay secure', 'connect people', 'run smoothly'];
  let phraseIndex = 0, charIndex = phrases[0].length, deleting = true;
  function typeLoop() {
    const phrase = phrases[phraseIndex];
    if (deleting) {
      charIndex--;
      typedText.textContent = phrase.slice(0, Math.max(0, charIndex));
      if (charIndex <= 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typeLoop, 350);
        return;
      }
    } else {
      const next = phrases[phraseIndex];
      charIndex++;
      typedText.textContent = next.slice(0, charIndex);
      if (charIndex >= next.length) {
        deleting = true;
        setTimeout(typeLoop, 1500);
        return;
      }
    }
    setTimeout(typeLoop, deleting ? 45 : 75);
  }
  setTimeout(typeLoop, 1500);

  // Project category filters
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    filterButtons.forEach(item => item.classList.toggle('active', item === button));
    const filter = button.dataset.filter;
    projectCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !show);
    });
  }));

  // Accessible project detail modal
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const closeModal = () => modal.close();
  document.querySelectorAll('.project-details').forEach(button => button.addEventListener('click', () => {
    modalTitle.textContent = button.dataset.title;
    modalBody.textContent = button.dataset.detail;
    modal.showModal();
  }));
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalDone').addEventListener('click', closeModal);
  modal.addEventListener('click', event => {
    if (event.target === modal) closeModal();
  });
});