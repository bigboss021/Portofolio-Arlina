/* ============================================
   PORTFOLIO — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Cursor Blob Follower ---
  const blob = document.getElementById('cursorBlob');
  if (blob && window.innerWidth > 768) {
    let blobX = 0, blobY = 0, mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateBlob() {
      blobX += (mouseX - blobX) * 0.08;
      blobY += (mouseY - blobY) * 0.08;
      blob.style.left = blobX + 'px';
      blob.style.top = blobY + 'px';
      requestAnimationFrame(animateBlob);
    }
    animateBlob();
  }

  // --- Navbar Scroll Effect ---
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.navbar-links a:not(.navbar-cta)');

  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlight
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // --- Mobile Menu Toggle ---
  const menuToggle = document.getElementById('menuToggle');
  const navLinksContainer = document.getElementById('navLinks');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('open');
    document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  navLinksContainer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinksContainer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // --- Counter Animation ---
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      el.textContent = current + '+';

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((el) => counterObserver.observe(el));

  // --- Portfolio Filters ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioCards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;

        card.style.transition = 'opacity 0.3s, transform 0.3s';

        if (shouldShow) {
          card.style.display = '';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // --- Contact Form ---
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Mengirim... ⏳';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    // Simulate submission
    setTimeout(() => {
      submitBtn.textContent = 'Terkirim! ✅';
      submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.background = '';
        contactForm.reset();
      }, 2500);
    }, 1500);
  });

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.length > 1 && href.startsWith('#')) {
        try {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        } catch (err) {
          console.warn('Anchor scroll warning:', err);
        }
      }
    });
  });

  // --- Typing Effect for Hero (subtle) ---
  const highlight = document.querySelector('.hero h1 .highlight');
  if (highlight) {
    const text = highlight.textContent;
    highlight.textContent = '';
    highlight.style.borderRight = '2px solid var(--coral-500)';

    let i = 0;
    function typeChar() {
      if (i < text.length) {
        highlight.textContent += text.charAt(i);
        i++;
        setTimeout(typeChar, 80);
      } else {
        // Remove cursor after typing done
        setTimeout(() => {
          highlight.style.borderRight = 'none';
        }, 600);
      }
    }

    // Delay start
    setTimeout(typeChar, 800);
  }

  // --- Parallax on Hero Image (subtle) ---
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual && window.innerWidth > 1024) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroVisual.style.transform = `translateY(${scrolled * 0.08}px)`;
      }
    }, { passive: true });
  }
});

// --- Marketing Creator Detail Modal ---
function openMarketingDetail() {
  const modal = document.getElementById('marketingModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modal.scrollTop = 0;
  }
}

function closeMarketingDetail() {
  const modal = document.getElementById('marketingModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// --- TikTok Detail Modal ---
function openTiktokDetail() {
  const modal = document.getElementById('tiktokModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modal.scrollTop = 0;
  }
}

function closeTiktokDetail() {
  const modal = document.getElementById('tiktokModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// --- Brand Collab Detail Modal ---
function openCollabDetail() {
  const modal = document.getElementById('collabModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modal.scrollTop = 0;
  }
}

function closeCollabDetail() {
  const modal = document.getElementById('collabModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// --- Certification Detail Modal ---
function openCertDetail() {
  const modal = document.getElementById('certModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modal.scrollTop = 0;
  }
}

function closeCertDetail() {
  const modal = document.getElementById('certModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close any active modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMarketingDetail();
    closeTiktokDetail();
    closeCollabDetail();
    closeCertDetail();
  }
});

// Close modal on overlay click (outside modal content)
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('tiktok-modal-overlay')) {
    closeMarketingDetail();
    closeTiktokDetail();
    closeCollabDetail();
    closeCertDetail();
  }
});
