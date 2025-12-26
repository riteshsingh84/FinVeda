(function(){
  /**
   * Detects the correct site base path and builds component URLs robustly.
   * Avoids hardcoded origins and fixes case sensitivity issues (Finveda vs finveda).
   */
  function detectBasePath() {
    // Prefer <base href="...">
    const baseEl = document.querySelector('base[href]');
    if (baseEl) {
      try {
        const href = baseEl.getAttribute('href');
        const u = new URL(href, window.location.origin);
        return u.pathname.endsWith('/') ? u.pathname : u.pathname + '/';
      } catch (_) {}
    }

    // Try to infer from the current location (case-insensitive match)
    const segments = window.location.pathname.split('/').filter(Boolean);
    const idx = segments.findIndex(s => s.toLowerCase() === 'finveda');
    if (idx >= 0) {
      return `/${segments[idx].toLowerCase()}/`;
    }

    // Fallback to root
    return '/';
  }

  function buildURL(relativePath) {
    const basePath = detectBasePath();
    return new URL(relativePath, window.location.origin + basePath).toString();
  }

  // Example: include header/footer (adjust selectors as needed)
  async function includeFragment(targetSelector, relativePath) {
    const url = buildURL(relativePath);
    try {
      const res = await fetch(url, { credentials: 'same-origin' });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      const html = await res.text();
      const el = document.querySelector(targetSelector);
      if (el) el.innerHTML = html;
      else console.warn(`[include.js] Target not found: ${targetSelector}`);
    } catch (err) {
      console.error(`[include.js] Failed to load "${url}": ${err.message}`);
    }
  }

  function getBasePath(){
    const p = window.location.pathname || '/';
    const firstSeg = (p.replace(/^\/+/,'').split('/')[0] || '').trim();
    if(firstSeg && firstSeg.toLowerCase() === 'finveda'){
      // Preserve actual casing from URL segment
      return '/' + firstSeg + '/';
    }
    return '/';
  }
  const BASE = getBasePath();

  function applyBase(scope){
    const root = scope || document;
    // Links with data-path
    root.querySelectorAll('[data-path]').forEach(el => {
      const rel = el.getAttribute('data-path');
      if(!rel) return;
      const target = BASE + rel.replace(/^\//,'');
      if(el.tagName && el.tagName.toLowerCase() === 'a'){
        el.setAttribute('href', target);
      } else {
        // Avoid binding multiple times if applyBase runs again
        if(!el.__fvBound){
          el.__fvBound = true;
          el.addEventListener('click', () => { window.location.href = target; });
          // Improve accessibility if element is not inherently clickable
          if(!('tabIndex' in el)) el.tabIndex = 0;
          el.setAttribute('role', el.getAttribute('role') || 'button');
          el.addEventListener('keydown', (e) => {
            if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.href = target; }
          });
        }
      }
    });
    // Images with data-src
    root.querySelectorAll('img[data-src]').forEach(img => {
      const rel = img.getAttribute('data-src');
      if(rel){ img.setAttribute('src', BASE + rel.replace(/^\//,'')); }
    });
  }

  async function fetchFirst(paths){
    for(const p of paths){
      try{
        const res = await fetch(p, {cache:'no-cache'});
        if(res.ok){ return await res.text(); }
      }catch(e){ /* ignore */ }
    }
    return null;
  }
  function candidates(url){
    // Normalize leading ./ and remove redundant prefixes
    const norm = url.replace(/^\.\/+/,'');
    const relClean = url.startsWith('/') ? url : './' + url;
    const underBase = BASE + norm.replace(/^\//,'');

    const list = [
      // Absolute under detected base
      underBase,
      // Canonical casing variants for case-sensitive hosts
      '/FinVeda/' + norm.replace(/^\//,''),
      '/finveda/' + norm.replace(/^\//,''),
      // Root absolute (no base)
      '/' + norm.replace(/^\//,''),
      // Relative fallbacks (browser resolves against current page)
      relClean,
      relClean.replace(/^\//,''),
      '../' + relClean.replace(/^\//,''),
      '../../' + relClean.replace(/^\//,'')
    ];
    // De-duplicate while preserving order
    return Array.from(new Set(list));
  }
  async function loadIncludes(){
    const nodes = document.querySelectorAll('[data-include]');
    for(const node of nodes){
      const url = node.getAttribute('data-include');
      const html = await fetchFirst(candidates(url));
      if(html){
        node.innerHTML = html;
        applyBase(node);
      } else {
        // Helpful error to surface exact attempted resolutions
        try {
          console.error('[include.js] Failed to resolve include for', url, 'from', window.location.pathname);
        } catch(_) {}
      }
    }
    // Also apply to existing markup in case includes aren't used
    applyBase(document);

    // After includes load, set dynamic page title in the app header
    try { updateHeaderTitle(); } catch(e) {}
    try { markActiveNav(); } catch(e) {}
    try { setupMobileNav(); } catch(e) {}
    try { setupHeaderMenu(); } catch(e) {}
    try { adjustFooterPadding(); } catch(e) {}
    try { adjustHeaderPadding(); } catch(e) {}
  }
  document.addEventListener('DOMContentLoaded', loadIncludes);
  
  // Derive a friendly page title from the current path
  function derivePageName(){
    const file = (window.location.pathname.split('/').pop() || '').toLowerCase();
    const map = {
      'dashboard.html': 'Dashboard',
      'portfolio.html': 'Portfolio',
      'transactions.html': 'Transactions',
      'behavioral.html': 'Behavioral Finance',
      'projections.html': 'Projections',
      'risk.html': 'Risk Profiling',
      'tax.html': 'Tax Optimization',
      'goals.html': 'Financial Goals',
      'settings.html': 'User Settings',
      'alerts.html': 'Alerts'
    };
    return map[file] || (document.title || 'FinVeda').replace(/\s*-.*$/, '').trim();
  }

  // Populate header title placeholders if present
  function updateHeaderTitle(){
    const title = derivePageName();
    document.querySelectorAll('.fv-page-title').forEach(el => { el.textContent = title; });
  }

  // Highlight the active nav link in the sidebar based on current page
  function markActiveNav(){
    const curr = (new URL(window.location.href)).pathname.toLowerCase();
    const currFile = curr.split('/').pop();
    const anchors = document.querySelectorAll('aside a[href]');
    anchors.forEach(a => {
      const hrefPath = (new URL(a.getAttribute('href'), window.location.href)).pathname.toLowerCase();
      const hrefFile = hrefPath.split('/').pop();
      const isActive = hrefPath === curr || hrefFile === currFile;
      // Base classes expected on links
      const baseClasses = [
        'flex','items-center','gap-3','px-3','py-2.5','rounded-lg','transition-all'
      ];
      baseClasses.forEach(c => a.classList.add(c));
      // Remove any previous active styling
      a.classList.remove('bg-[#27353a]','text-white','border','border-[#2f3e44]');
      a.classList.remove('fv-active');
      // Apply active styling when matched
      if(isActive){
        a.classList.add('bg-[#27353a]','text-white','border','border-[#2f3e44]');
        a.classList.add('fv-active');
      }
    });
  }

  // Mobile sidebar toggle (drawer) setup
  function setupMobileNav(){
    const aside = document.querySelector('aside');
    const toggleBtn = document.querySelector('[data-nav-toggle]');
    if(!aside || !toggleBtn) return;

    // Create overlay
    let overlay = document.querySelector('.fv-overlay');
    if(!overlay){
      overlay = document.createElement('div');
      overlay.className = 'fv-overlay';
      overlay.setAttribute('aria-hidden','true');
      document.body.appendChild(overlay);
    }

    const mq = window.matchMedia('(min-width: 1024px)');
    function close(){
      aside.classList.remove('fv-mobile-open');
      overlay.classList.remove('fv-show');
      document.body.classList.remove('fv-no-scroll');
    }
    function open(){
      aside.classList.add('fv-mobile-open');
      overlay.classList.add('fv-show');
      document.body.classList.add('fv-no-scroll');
    }

    function applyMode(){
      if(mq.matches){
        // Desktop: ensure drawer behavior disabled, sidebar shown via lg:flex
        aside.classList.remove('fv-nav-mobile');
        close();
      } else {
        // Mobile: enable drawer, remove hidden to allow off-canvas
        aside.classList.add('fv-nav-mobile');
        aside.classList.remove('hidden');
      }
    }
    applyMode();

    toggleBtn.addEventListener('click', () => {
      if(mq.matches){ return; }
      const isOpen = aside.classList.contains('fv-mobile-open');
      isOpen ? close() : open();
    });
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape') close(); });
    mq.addEventListener('change', applyMode);
  }

  // Ensure content clears the fixed footer by applying actual footer height as padding
  function adjustFooterPadding(){
    const footer = document.querySelector('.fv-fixed-footer');
    if(!footer) return;
    function apply(){
      const h = footer.offsetHeight || 0;
      document.querySelectorAll('.fv-pad-footer').forEach(el => { el.style.paddingBottom = h + 'px'; });
    }
    apply();
    let t;
    const onResize = () => { clearTimeout(t); t = setTimeout(apply, 100); };
    window.addEventListener('resize', onResize);
  }

  // Ensure content clears the fixed header by applying actual header height as top padding
  function adjustHeaderPadding(){
    const header = document.querySelector('.fv-fixed-header');
    if(!header) return;
    function apply(){
      const h = header.offsetHeight || 0;
      document.querySelectorAll('.fv-pad-header').forEach(el => { el.style.paddingTop = h + 'px'; });
    }
    apply();
    let t;
    const onResize = () => { clearTimeout(t); t = setTimeout(apply, 100); };
    window.addEventListener('resize', onResize);
  }

  // Header mobile menu (hamburger) setup
  function setupHeaderMenu(){
    const header = document.querySelector('.fv-fixed-header');
    const toggleBtn = document.querySelector('#fv-header-menu-toggle');
    if(!header || !toggleBtn) return;

    // Reuse global overlay if present or create one
    let overlay = document.querySelector('.fv-overlay');
    if(!overlay){
      overlay = document.createElement('div');
      overlay.className = 'fv-overlay';
      overlay.setAttribute('aria-hidden','true');
      document.body.appendChild(overlay);
    }

    // Create header menu panel if not present
    let panel = document.querySelector('#fv-header-mobile-menu');
    if(!panel){
      panel = document.createElement('div');
      panel.id = 'fv-header-mobile-menu';
      panel.className = 'fv-header-panel';

      const linksWrap = document.createElement('nav');
      linksWrap.className = 'fv-header-links';

      // Clone desktop header links
      const desktopNav = header.querySelector('nav');
      const anchors = desktopNav ? Array.from(desktopNav.querySelectorAll('a')) : [];
      if(anchors.length){
        anchors.forEach(a => {
          const clone = document.createElement('a');
          // Prefer data-path for consistent BASE handling
          const rel = a.getAttribute('data-path');
          const href = a.getAttribute('href');
          if(rel){ clone.setAttribute('data-path', rel); }
          else if(href){ clone.setAttribute('href', href); }
          clone.textContent = a.textContent || '';
          linksWrap.appendChild(clone);
        });
      }

      panel.appendChild(linksWrap);
      document.body.appendChild(panel);

      // Apply base bindings to clones
      applyBase(panel);
    }

    // Utility: set panel top equal to header height
    function positionPanel(){
      const h = header.offsetHeight || 56;
      panel.style.top = h + 'px';
    }
    positionPanel();
    window.addEventListener('resize', () => { positionPanel(); });

    // Open/close helpers
    function setOpen(open){
      overlay.classList.toggle('fv-show', open);
      panel.classList.toggle('fv-open', open);
      document.body.classList.toggle('fv-no-scroll', open);
      toggleBtn.setAttribute('aria-expanded', String(open));
      const icon = toggleBtn.querySelector('.material-symbols-outlined');
      if(icon){ icon.textContent = open ? 'close' : 'menu'; }
      toggleBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if(open){
        const first = panel.querySelector('.fv-header-links a');
        if(first) try{ first.focus({preventScroll:true}); }catch(_){ first.focus(); }
      } else {
        try{ toggleBtn.focus({preventScroll:true}); }catch(_){ toggleBtn.focus(); }
      }
    }

    function isDesktop(){
      // Match md breakpoint (~768px). Our header uses md classes to hide button on desktop.
      return window.matchMedia('(min-width: 768px)').matches;
    }

    // Click to toggle
    toggleBtn.addEventListener('click', () => {
      if(isDesktop()){ return; }
      const open = panel.classList.contains('fv-open');
      setOpen(!open);
    });

    // Close on overlay click
    overlay.addEventListener('click', () => { setOpen(false); });

    // Close on Escape
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape') setOpen(false); });

    // Close when clicking a link
    panel.addEventListener('click', (e) => {
      const a = e.target && e.target.closest('a');
      if(a) setOpen(false);
    });

    // Ensure correct state on breakpoint changes
    window.matchMedia('(min-width: 768px)').addEventListener('change', () => { setOpen(false); });
  }
})();