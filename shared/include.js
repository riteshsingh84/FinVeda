(function(){
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
    const clean = url.startsWith('/') ? url : './' + url;
    return [clean, clean.replace(/^\//,''), '../' + clean.replace(/^\//,''), '../../' + clean.replace(/^\//,'')];
  }
  async function loadIncludes(){
    const nodes = document.querySelectorAll('[data-include]');
    for(const node of nodes){
      const url = node.getAttribute('data-include');
      const html = await fetchFirst(candidates(url));
      if(html){
        node.innerHTML = html;
        applyBase(node);
      }
    }
    // Also apply to existing markup in case includes aren't used
    applyBase(document);
  }
  document.addEventListener('DOMContentLoaded', loadIncludes);
})();