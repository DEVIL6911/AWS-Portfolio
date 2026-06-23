/**
 * AWS Cloud Club — NextWeb
 * Minimal interactions
 */

(function () {
  'use strict';

  var navbar = document.getElementById('navbar');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  var body = document.body;

  function isHomePage() {
    var path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
    return path === '/' || path === '/index.html' || path.endsWith('/index.html');
  }

  function normalizePath(path) {
    return path.replace(/\\/g, '/').replace(/\/$/, '').toLowerCase();
  }

  function setLoaded() {
    body.classList.add('is-loaded');
  }

  function setActiveLinks() {
    if (!navLinks) return;

    var currentPath = normalizePath(window.location.pathname);
    var homePage = isHomePage();

    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      var linkUrl = new URL(link.href, window.location.href);
      var linkPath = normalizePath(linkUrl.pathname);
      var href = link.getAttribute('href') || '';
      var active = false;

      if (homePage) {
        if (href.indexOf('#') === 0) {
          var sectionId = href;
          active = !window.location.hash ? sectionId === '#home' : sectionId === window.location.hash;
        } else {
          active = linkPath === currentPath || (linkPath === '/index.html' && currentPath === '');
        }
      } else {
        active = linkPath === currentPath || (currentPath === '/index.html' && linkPath === '/index.html');
      }

      link.classList.toggle('active', active);

      if (active) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function navigateWithFade(url) {
    body.classList.add('is-leaving');
    window.setTimeout(function () {
      window.location.href = url;
    }, 160);
  }

  /* Navbar scroll state */
  function onScroll() {
    if (!isHomePage()) return;

    navbar.classList.toggle('scrolled', window.scrollY > 20);

    var scrollPos = window.scrollY + 120;
    var sections = document.querySelectorAll('section[id], header[id]');
    var links = document.querySelectorAll('.nav-link:not(.nav-link--cta)');

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        links.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  window.addEventListener('DOMContentLoaded', function () {
    setLoaded();
    setActiveLinks();
    onScroll();
  });

  window.addEventListener('load', function () {
    setLoaded();
    setActiveLinks();
    onScroll();
  });

  /* Mobile menu */
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active', open);
      navToggle.setAttribute('aria-expanded', open);
    });

    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* Smooth page transitions */
  document.querySelectorAll('a[href]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || this.target === '_blank') return;

      var href = this.getAttribute('href') || '';
      if (!href || href.charAt(0) === '#') return;

      var targetUrl = new URL(this.href, window.location.href);
      if (targetUrl.origin !== window.location.origin) return;

      if (targetUrl.pathname === window.location.pathname && targetUrl.hash) return;

      e.preventDefault();
      navigateWithFade(targetUrl.href);
    });
  });

  /* Fade-in cards */
  var cards = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    cards.forEach(function (card, i) {
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      card.style.transitionDelay = i * 0.08 + 's';
      observer.observe(card);
    });
  } else {
    cards.forEach(function (card) {
      card.classList.add('visible');
    });
  }
})();
