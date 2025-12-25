(function(){
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
    const clean = url.startsWith('/') ? url : '/' + url;
    return [clean, clean.replace(/^\//,''), '../' + clean.replace(/^\//,''), '../../' + clean.replace(/^\//,'')];
  }
  async function loadIncludes(){
    const nodes = document.querySelectorAll('[data-include]');
    for(const node of nodes){
      const url = node.getAttribute('data-include');
      const html = await fetchFirst(candidates(url));
      if(html){ node.innerHTML = html; }
    }
  }
  document.addEventListener('DOMContentLoaded', loadIncludes);
})();