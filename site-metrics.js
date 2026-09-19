(()=>{
  const q=new URLSearchParams(location.search);
  const keys=['ref','utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
  const saved={};
  keys.forEach(k=>{
    const v=q.get(k);
    if(v){ try{localStorage.setItem('structura_'+k,v);}catch(e){} saved[k]=v; }
    else { try{const s=localStorage.getItem('structura_'+k); if(s)saved[k]=s;}catch(e){} }
  });

  // Preserve acquisition context across internal navigation.
  document.querySelectorAll('a[href]').forEach(a=>{
    try{
      const u=new URL(a.href,location.href);
      if(u.origin===location.origin){
        keys.forEach(k=>{if(saved[k]&&!u.searchParams.has(k))u.searchParams.set(k,saved[k]);});
        a.href=u.href;
      }
      if(u.hostname==='structuratools.gumroad.com'){
        if(saved.ref&&!u.searchParams.has('utm_source'))u.searchParams.set('utm_source',saved.ref);
        if(!u.searchParams.has('utm_medium'))u.searchParams.set('utm_medium','structura_website');
        if(!u.searchParams.has('utm_campaign'))u.searchParams.set('utm_campaign','structura_funnel');
        a.href=u.href;
        a.addEventListener('click',()=>{
          if(typeof window.va==='function'){
            window.va('event',{name:'Store CTA',data:{product:u.pathname.includes('StructuraWindows')?'windows':'store',source:saved.ref||'website'}});
          }
        });
      }
    }catch(e){}
  });

  // Vercel Web Analytics for static HTML.
  window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments);};
  if(!document.querySelector('script[data-structura-analytics]')){
    const s=document.createElement('script');
    s.defer=true;s.src='/_vercel/insights/script.js';s.dataset.structuraAnalytics='1';
    document.head.appendChild(s);
  }
})();