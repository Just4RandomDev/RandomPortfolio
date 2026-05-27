(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Mobile nav
  const toggle = $('.nav-toggle');
  const menu = $('#nav-menu');

  if (toggle && menu) {
    const setOpen = (open) => {
      menu.dataset.open = String(open);
      toggle.setAttribute('aria-expanded', String(open));
    };

    setOpen(false);

    toggle.addEventListener('click', () => {
      const isOpen = menu.dataset.open === 'true';
      setOpen(!isOpen);
    });

    // Close on link click (mobile)
    $$('.nav-link', menu).forEach((a) => {
      a.addEventListener('click', () => setOpen(false));
    });
  }

  // Year
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Project filter
  const filterButtons = [$('#filterAll'), ...$$('[data-filter]')];
  const projectsGrid = $('#projectsGrid');
  const allProjects = projectsGrid ? $$('.project', projectsGrid) : [];

  const applyFilter = (tag) => {
    allProjects.forEach((p) => {
      const tags = (p.getAttribute('data-tags') || '').split(/\s+/).filter(Boolean);
      const show = tag === 'all' ? true : tags.includes(tag);
      p.style.display = show ? '' : 'none';
    });
  };

  filterButtons
    .filter(Boolean)
    .forEach((btn) => {
      btn.addEventListener('click', () => {
        // reset actives
        filterButtons.forEach((b) => b.classList.remove('is-active'));

        if (btn.id === 'filterAll') {
          btn.classList.add('is-active');
          applyFilter('all');
          return;
        }

        const tag = btn.getAttribute('data-filter');
        btn.classList.add('is-active');
        applyFilter(tag);
      });
    });

  // Contact form validation (front-end only)
  const form = $('#contactForm');
  if (form) {
    const note = $('#formNote');

    const getErrorEl = (name) => form.querySelector(`[data-error-for="${name}"]`);
    const setError = (name, message) => {
      const el = getErrorEl(name);
      if (!el) return;
      el.textContent = message || '';
    };

    const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = {
        name: form.elements['name']?.value?.trim() || '',
        email: form.elements['email']?.value?.trim() || '',
        subject: form.elements['subject']?.value?.trim() || '',
        message: form.elements['message']?.value?.trim() || ''
      };

      let ok = true;
      setError('name', '');
      setError('email', '');
      setError('subject', '');
      setError('message', '');

      if (data.name.length < 2) {
        setError('name', 'Please enter your name.');
        ok = false;
      }

      if (!isEmail(data.email)) {
        setError('email', 'Please enter a valid email.');
        ok = false;
      }

      if (data.subject.length < 3) {
        setError('subject', 'Please add a short subject (min 3 characters).');
        ok = false;
      }

      if (data.message.length < 10) {
        setError('message', 'Message is too short (min 10 characters).');
        ok = false;
      }

      if (!ok) {
        if (note) note.textContent = 'Please fix the highlighted fields.';
        return;
      }

      // No backend hooked: show success state
      if (note) note.textContent = 'Message validated. Connect this form to a backend to send.';
      form.reset();
    });
  }
})();

