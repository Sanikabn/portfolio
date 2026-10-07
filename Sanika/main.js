/* ================================================================
   main.js — Sanika Lingayat Portfolio
   Handles: theme toggle, mobile nav, typewriter, scroll animations,
            active nav highlighting, copyright year
   ================================================================ */

'use strict';


/* ────────────────────────────────────────────────────────────────
   SIDEBAR NAV — collapse / expand toggle
   ──────────────────────────────────────────────────────────────── */
(function initSideNav () {
  var sideNav    = document.getElementById('side-nav');
  var toggleBtn  = document.getElementById('side-nav-toggle');
  var currentEl  = document.getElementById('side-nav-current');

  if (!sideNav || !toggleBtn) return;

  // Restore collapse state from localStorage
  var isCollapsed = localStorage.getItem('sidenav-collapsed') === 'true';
  if (isCollapsed) {
    sideNav.classList.add('collapsed');
    document.body.style.paddingLeft = 'var(--sidenav-collapsed-w)';
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  toggleBtn.addEventListener('click', function () {
    var collapsed = sideNav.classList.toggle('collapsed');
    localStorage.setItem('sidenav-collapsed', String(collapsed));
    document.body.style.paddingLeft = collapsed
      ? 'var(--sidenav-collapsed-w)'
      : 'var(--sidenav-w)';
    toggleBtn.setAttribute('aria-expanded', String(!collapsed));
  });

  // Scroll-spy: highlight active link in sidebar + update section name strip
  var sections   = document.querySelectorAll('section[id]');
  var sideLinks  = document.querySelectorAll('.side-nav__link');
  var topLinks   = document.querySelectorAll('.nav-link');

  if (!sections.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var id = entry.target.id;

      // Update sidebar links
      sideLinks.forEach(function (link) {
        var matches = link.getAttribute('data-section') === id
                   || link.getAttribute('href') === '#' + id;
        link.classList.toggle('active', matches);
      });

      // Update top navbar links
      topLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });

      // Update the section name strip at the bottom of the sidebar
      if (currentEl) {
        var activeLink = sideNav.querySelector('.side-nav__link.active .side-nav__label');
        currentEl.textContent = activeLink ? activeLink.textContent : id;
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' });

  sections.forEach(function (sec) { observer.observe(sec); });
})();



/* ────────────────────────────────────────────────────────────────
   THEME TOGGLE
   The [data-theme] attribute on <html> drives all CSS variables.
   localStorage persists the user's explicit choice.
   On first visit the inline script in <head> reads prefers-color-scheme
   so no JS is needed here for the initial default — only for the toggle.
   ──────────────────────────────────────────────────────────────── */
(function initTheme () {
  const html        = document.documentElement;
  const toggleBtn   = document.getElementById('theme-toggle');
  const themeIcon   = document.getElementById('theme-icon');

  if (!toggleBtn) return;

  /** Return the currently active theme ('light' | 'dark') */
  function getTheme () {
    return html.getAttribute('data-theme') || 'light';
  }

  /** Apply theme and update the button icon */
  function applyTheme (theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  // Sync icon with whatever theme was restored by the inline script
  applyTheme(getTheme());

  // Click → flip theme
  toggleBtn.addEventListener('click', function () {
    applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
  });

  // Also react if OS theme changes while the page is open (and user hasn't set a preference)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
})();


/* ────────────────────────────────────────────────────────────────
   TYPEWRITER EFFECT
   Cycles through role titles in the hero h2.
   ──────────────────────────────────────────────────────────────── */
(function initTypewriter () {
  var el = document.getElementById('typewriter-text');
  if (!el) return;

  var roles = [
    'Software Engineer',
    'Full-Stack Developer',
    'Problem Solver',
    'Open-Source Enthusiast'
  ];

  var roleIndex  = 0;
  var charIndex  = 0;
  var isDeleting = false;
  var typingSpeed = 90;

  function type () {
    var current = roles[roleIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === current.length) {
      // Pause at end of word
      setTimeout(function () { isDeleting = true; type(); }, 1800);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex  = (roleIndex + 1) % roles.length;
    }

    setTimeout(type, isDeleting ? 45 : typingSpeed);
  }

  // Small initial delay before starting
  setTimeout(type, 800);
})();


/* ────────────────────────────────────────────────────────────────
   MOBILE NAV TOGGLE
   ──────────────────────────────────────────────────────────────── */
(function initMobileNav () {
  var menuToggle = document.getElementById('menu-toggle');
  var mobileNav  = document.getElementById('mobile-nav');
  var navLinks   = document.querySelectorAll('#nav-links .nav-link');

  if (!menuToggle || !mobileNav) return;

  // Clone desktop links into mobile drawer
  if (mobileNav.children.length === 0) {
    var ul = document.createElement('ul');
    ul.style.cssText = 'list-style:none;display:flex;flex-direction:column;gap:0.5rem';
    navLinks.forEach(function (link) {
      var li = document.createElement('li');
      var a  = link.cloneNode(true);
      li.appendChild(a);
      ul.appendChild(li);
    });
    mobileNav.appendChild(ul);
  }

  function toggleMenu () {
    var open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    mobileNav.setAttribute('aria-hidden', String(open));
    mobileNav.style.display = open ? 'none' : 'flex';
  }

  menuToggle.addEventListener('click', toggleMenu);

  // Close on link click
  mobileNav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') toggleMenu();
  });
})();


/* ────────────────────────────────────────────────────────────────
   ACTIVE NAV LINK HIGHLIGHTING (scroll spy)
   ──────────────────────────────────────────────────────────────── */
(function initScrollSpy () {
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (link) {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(function (sec) { observer.observe(sec); });
})();


/* ────────────────────────────────────────────────────────────────
   HEADER SHADOW ON SCROLL
   ──────────────────────────────────────────────────────────────── */
(function initHeaderScroll () {
  var header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', function () {
    header.style.boxShadow = window.scrollY > 10
      ? '0 3px 0 var(--clr-primary)'
      : '0 3px 0 var(--clr-border)';
  }, { passive: true });
})();


/* ────────────────────────────────────────────────────────────────
   SCROLL-REVEAL ANIMATIONS
   Adds .visible class to elements with [data-reveal] as they enter viewport.
   ──────────────────────────────────────────────────────────────── */
(function initReveal () {
  var els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(function (el) { observer.observe(el); });
})();


/* ────────────────────────────────────────────────────────────────
   DYNAMIC COPYRIGHT YEAR
   ──────────────────────────────────────────────────────────────── */
(function initCopyrightYear () {
  var el = document.getElementById('copyright-year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ────────────────────────────────────────────────────────────────
   CONTACT FORM (basic client-side validation)
   ──────────────────────────────────────────────────────────────── */
(function initContactForm () {
  var form   = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;

    ['contact-name', 'contact-email', 'contact-message'].forEach(function (id) {
      var input = document.getElementById(id);
      var error = document.getElementById(id.replace('contact-', '') + '-error');
      if (input && !input.value.trim()) {
        if (error) error.textContent = 'This field is required.';
        valid = false;
      } else {
        if (error) error.textContent = '';
      }
    });

    if (!valid) return;

    // PLACEHOLDER: Replace with actual fetch to your form endpoint
    // e.g. fetch(form.action, { method:'POST', body: new FormData(form) })
    status.style.display = 'block';
    status.style.borderColor = 'var(--clr-accent-2)';
    status.style.color = 'var(--clr-accent-2)';
    status.textContent = '✓ Message sent! I\'ll get back to you soon.';
    form.reset();
  });
})();
