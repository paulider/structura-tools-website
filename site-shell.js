(()=>{
  const page=document.body.dataset.page||'home';
  const header=document.querySelector('[data-site-header]');
  const footer=document.querySelector('[data-site-footer]');
  const navItems=[
    ['products','/products','Products'],
    ['suite','/suite','Suite'],
    ['learn','/learn','Learn'],
    ['support','/support','Support']
  ];
  if(header){
    header.innerHTML='<header class="site-nav"><div class="wrap site-nav-inner navin">'+
      '<a class="site-brand" href="/"><img src="/assets/structura-logo-final.png" alt="Structura Tools"><span>STRUCTURA<br>TOOLS</span></a>'+
      '<nav class="site-links" aria-label="Primary">'+navItems.map(([id,href,label])=>'<a href="'+href+'"'+(page===id?' aria-current="page"':'')+'>'+label+'</a>').join('')+'</nav>'+
      '<a class="site-cta nav-launch" href="/floor-wall#download">Floor &amp; Wall — Free ↓</a>'+
    '</div></header>';
  }
  if(footer){
    footer.innerHTML='<footer class="site-footer"><div class="wrap">'+
      '<div class="footer-grid">'+
        '<div><a class="footer-brand" href="/"><img src="/assets/structura-logo-final.png" alt=""><span>STRUCTURA TOOLS</span></a></div>'+
        '<div class="footer-col"><h4>Products</h4><a href="/floor-wall">Floor &amp; Wall</a><a href="/windows">Windows</a><a href="/doors">Doors</a><a href="/kitchen">Kitchen</a><a href="/road-click">Road Click</a><a href="/buildings">Buildings</a></div>'+
        '<div class="footer-col"><h4>Resources</h4><a href="/learn">Getting Started</a><a href="/tutorials">Tutorials</a><a href="/docs">Documentation</a><a href="/changelog">Changelog</a><a href="/support">Support</a></div>'+
        '<div class="footer-col"><h4>Structura</h4><a href="/#about">About</a><a href="/products">Products</a><a href="https://structuratools.gumroad.com/" target="_blank" rel="noopener">Plugin Store</a></div>'+
      '</div>'+
      '<div class="footer-bottom"><span>© 2026 Structura Tools</span><span>Barcelona · Firenze</span></div>'+
    '</div></footer>';
  }
  if(!document.querySelector('script[src="/ecosystem-i18n.js"]')){const i=document.createElement("script");i.src="/ecosystem-i18n.js";i.defer=true;document.head.appendChild(i);} if(!document.querySelector('script[src="/site-metrics.js"]')){const m=document.createElement("script");m.src="/site-metrics.js";m.defer=true;document.head.appendChild(m);}
})();