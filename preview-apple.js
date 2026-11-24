(() => {
  'use strict';
  const $=(s,root=document)=>root.querySelector(s);
  const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

  const blocks=$$('.reveal');
  if(reduced || !('IntersectionObserver' in window)) {
    blocks.forEach(el=>el.classList.add('in'));
  } else {
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add('in');observer.unobserve(entry.target);}
      });
    },{rootMargin:'0px 0px -28px 0px',threshold:.08});
    blocks.forEach(el=>observer.observe(el));
  }

  const toggle=$('.mobile-toggle');
  const mobile=$('#mobile-nav');
  function menu(open) {
    if(!mobile||!toggle)return;
    mobile.classList.toggle('open',open);
    toggle.setAttribute('aria-expanded',String(open));
    toggle.textContent=open?'×':'☰';
  }
  toggle?.addEventListener('click',()=>menu(!mobile.classList.contains('open')));
  mobile?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>menu(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')menu(false);});

  const poster=$('.film img.poster');
  if(poster) {
    let next=0;
    poster.addEventListener('error',()=>{
      if(next===0){poster.src='https://i.ytimg.com/vi/OkhdnBWKPgQ/sddefault.jpg';next++;}
      else if(next===1){poster.src='https://i.ytimg.com/vi/OkhdnBWKPgQ/hqdefault.jpg';next++;}
      else{poster.style.display='none';}
    });
  }

  const play=$('#film-play'),film=$('#film-player');
  play?.addEventListener('click',()=>{
    if(!film||film.querySelector('iframe'))return;
    const frame=document.createElement('iframe');
    frame.src='https://www.youtube-nocookie.com/embed/OkhdnBWKPgQ?autoplay=1&rel=0';
    frame.title='Road Click — real SketchUp video demonstration';
    frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.allowFullscreen=true;
    frame.referrerPolicy='strict-origin-when-cross-origin';
    film.appendChild(frame);
    play.remove();
  });

  const filmWrap=$('#film-wrap');
  let pending=false;
  function updateFilm() {
    pending=false;
    if(!filmWrap)return;
    if(reduced||window.innerWidth<770){filmWrap.style.transform='';return;}
    const rect=filmWrap.getBoundingClientRect();
    const vh=innerHeight;
    const t=Math.min(1,Math.max(0,(vh-rect.top)/(vh*.9+rect.height*.35)));
    const s=.936+.064*t;
    filmWrap.style.transform='scale('+s.toFixed(4)+')';
  }
  function scrollUpdate(){if(!pending){pending=true;requestAnimationFrame(updateFilm);}}
  window.addEventListener('scroll',scrollUpdate,{passive:true});
  window.addEventListener('resize',scrollUpdate,{passive:true});
  updateFilm();

  const rail=$('#suite-rail');
  const prev=$('#suite-prev'),next=$('#suite-next');
  const getStep=()=>Math.min(420,Math.max(240,rail?.clientWidth*.73||300));
  function move(dir){rail?.scrollBy({left:dir*getStep(),behavior:reduced?'auto':'smooth'});}
  prev?.addEventListener('click',()=>move(-1));
  next?.addEventListener('click',()=>move(1));
  function updateButtons() {
    if(!rail)return;
    if(prev)prev.disabled=rail.scrollLeft<5;
    if(next)next.disabled=rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-6;
  }
  rail?.addEventListener('scroll',updateButtons,{passive:true});
  window.addEventListener('resize',updateButtons,{passive:true});
  updateButtons();
})();