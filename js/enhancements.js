/* ============================================
   ENHANCEMENTS JS — All interactive features
   ============================================ */

(function () {
  'use strict';

  /* ==========================================
     1. PRELOADER
  ========================================== */
  window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(function () {
        preloader.classList.add('hidden');
      }, 1800);
    }
  });

  /* ==========================================
     2. DARK / LIGHT MODE TOGGLE
  ========================================== */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon   = document.getElementById('theme-icon');

  function applyTheme(mode) {
    if (mode === 'light') {
      document.body.classList.add('light-mode');
      if (themeIcon) themeIcon.className = 'fas fa-moon';
    } else {
      document.body.classList.remove('light-mode');
      if (themeIcon) themeIcon.className = 'fas fa-sun';
    }
    localStorage.setItem('theme', mode);
  }

  // Load saved preference
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const current = document.body.classList.contains('light-mode') ? 'light' : 'dark';
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  /* ==========================================
     3. HERO CANVAS PARTICLE ANIMATION
  ========================================== */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resizeCanvas() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function Particle() {
      this.x     = Math.random() * canvas.width;
      this.y     = Math.random() * canvas.height;
      this.size  = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    Particle.prototype.update = function () {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width)  this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    };

    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(201,169,110,' + this.opacity + ')';
      ctx.fill();
    };

    function initParticles() {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 12000);
      for (let i = 0; i < Math.min(count, 80); i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(201,169,110,' + (0.08 * (1 - dist / 120)) + ')';
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p) { p.update(); p.draw(); });
      connectParticles();
      animFrame = requestAnimationFrame(animate);
    }

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', function () {
      resizeCanvas();
      initParticles();
    });
  }

  /* ==========================================
     4. TYPED TEXT EFFECT
  ========================================== */
  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    const words = ['Websites', 'Web Apps', 'Cloud Solutions', 'Digital Experiences'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 120;

    function type() {
      const current = words[wordIndex];
      if (isDeleting) {
        typedEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 60;
      } else {
        typedEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 120;
      }

      if (!isDeleting && charIndex === current.length) {
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typingSpeed = 400;
      }

      setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
  }

  /* ==========================================
     5. SCROLL REVEAL
  ========================================== */
  function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    reveals.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // run once on load

  /* ==========================================
     6. SKILL BARS ANIMATION
  ========================================== */
  function animateSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill');
    bars.forEach(function (bar) {
      const rect = bar.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50 && !bar.classList.contains('animated')) {
        bar.classList.add('animated');
        bar.style.width = bar.getAttribute('data-width') + '%';
      }
    });
  }

  window.addEventListener('scroll', animateSkillBars);
  animateSkillBars();

  /* ==========================================
     7. STATS COUNTER ANIMATION
  ========================================== */
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    counters.forEach(function (counter) {
      const rect = counter.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50 && !counter.classList.contains('counted')) {
        counter.classList.add('counted');
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(function () {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          counter.textContent = Math.floor(current) + (counter.getAttribute('data-suffix') || '');
        }, 16);
      }
    });
  }

  window.addEventListener('scroll', animateCounters);
  animateCounters();

  /* ==========================================
     8. LAZY LOADING IMAGES
  ========================================== */
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imgObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          img.addEventListener('load', function () {
            img.classList.add('loaded');
          });
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });

    lazyImages.forEach(function (img) { imgObserver.observe(img); });
  } else {
    // Fallback: load all images immediately
    document.querySelectorAll('img[data-src]').forEach(function (img) {
      img.src = img.getAttribute('data-src');
      img.classList.add('loaded');
    });
  }

  /* ==========================================
     9. CONTACT FORM VALIDATION
  ========================================== */
  const contactForm = document.getElementById('mainContactForm');
  if (contactForm) {
    const nameInput    = document.getElementById('cname');
    const emailInput   = document.getElementById('cemail');
    const messageInput = document.getElementById('cmessage');

    function showError(input, errorId, message) {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      const err = document.getElementById(errorId);
      if (err) { err.textContent = message; err.classList.add('show'); }
    }

    function showValid(input, errorId) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      const err = document.getElementById(errorId);
      if (err) err.classList.remove('show');
    }

    function validateName() {
      const val = nameInput.value.trim();
      if (val.length < 2) {
        showError(nameInput, 'name-error', 'Name must be at least 2 characters.');
        return false;
      }
      showValid(nameInput, 'name-error');
      return true;
    }

    function validateEmail() {
      const val = emailInput.value.trim();
      const re  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(val)) {
        showError(emailInput, 'email-error', 'Please enter a valid email address.');
        return false;
      }
      showValid(emailInput, 'email-error');
      return true;
    }

    function validateMessage() {
      const val = messageInput.value.trim();
      if (val.length < 10) {
        showError(messageInput, 'message-error', 'Message must be at least 10 characters.');
        return false;
      }
      showValid(messageInput, 'message-error');
      return true;
    }

    // Live validation
    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    messageInput.addEventListener('blur', validateMessage);

    contactForm.addEventListener('submit', function (e) {
      const n = validateName();
      const em = validateEmail();
      const m = validateMessage();
      if (!n || !em || !m) {
        e.preventDefault();
        return;
      }
      // Show success message after short delay (web3forms handles actual submission)
      const btn = contactForm.querySelector('.form-control-submit-button');
      if (btn) {
        btn.textContent = 'Sending...';
        btn.disabled = true;
      }
    });
  }

  /* ==========================================
     10. SKILL TAGS INTERACTIVE
  ========================================== */
  document.querySelectorAll('.skill-tag').forEach(function (tag) {
    tag.addEventListener('click', function () {
      document.querySelectorAll('.skill-tag').forEach(function (t) {
        t.classList.remove('active');
      });
      tag.classList.add('active');
    });
  });

  /* ==========================================
     11. SERVICE CARDS FLOAT ON HOVER STOP
  ========================================== */
  document.querySelectorAll('.basic-2 .text-box').forEach(function (box) {
    box.addEventListener('mouseenter', function () {
      box.style.animationPlayState = 'paused';
    });
    box.addEventListener('mouseleave', function () {
      box.style.animationPlayState = 'running';
    });
  });

  /* ==========================================
     12. SMOOTH SCROLL FOR ALL ANCHOR LINKS
  ========================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ==========================================
     13. NAVBAR ACTIVE LINK ON SCROLL
  ========================================== */
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.navbar .nav-link');

  window.addEventListener('scroll', function () {
    let current = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });

})();
