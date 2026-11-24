(() => {
  'use strict';
  const reduced=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $=(q,r=document)=>r.querySelector(q), $$=(q,r=document)=>[...r.querySelectorAll(q)];
  const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
  let winH=window.innerHeight, buildProgress=0, buildPhase=-1, queued=false;
  const bar=$('.scroll-progress'), buildSection=$('.build-scroll');
  function updateBuild(){
    if(!buildSection)return;
    const rect=buildSection.getBoundingClientRect();
    const total=Math.max(1,rect.height-winH);
    buildProgress=clamp((-rect.top+winH*.12)/total);
    const phase=Math.min(3,Math.floor(buildProgress*4));
    if(phase===buildPhase)return;
    buildPhase=phase;
    $$('.build-phase').forEach((el,i)=>el.classList.toggle('is-active',i===phase));
    const labels=['01 / CONFIGURE','02 / DRAW ROUTE','03 / CONNECT','04 / ROAD MARKINGS'];
    const title=$('.build-phase-display b'),caption=$('.build-phase-display span');
    if(title)title.textContent=labels[phase];
    if(caption)caption.textContent='STAGE '+(phase+1)+' / 04';
  }
  function scrollUpdate(){
    winH=window.innerHeight;
    const max=Math.max(1,document.documentElement.scrollHeight-winH);
    if(bar)bar.style.transform='scaleX('+clamp(window.scrollY/max)+')';
    updateBuild();queued=false;
  }
  window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(scrollUpdate);}}, {passive:true});
  window.addEventListener('resize',scrollUpdate,{passive:true});
  if(reduced || !('IntersectionObserver' in window)) $$('.reveal').forEach(e=>e.classList.add('visible'));
  else{
    const ob=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');ob.unobserve(e.target);}}),{rootMargin:'0px 0px -35px 0px',threshold:.08});
    $$('.reveal').forEach(e=>ob.observe(e));
  }
  const toggle=$('.head-menu'),drawer=$('.mobile-drawer');
  toggle?.addEventListener('click',()=>{
    const open=drawer.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'×':'☰';
  });
  if(drawer)$$('a',drawer).forEach(a=>a.addEventListener('click',()=>{
    drawer.classList.remove('open');toggle?.setAttribute('aria-expanded','false');if(toggle)toggle.textContent='☰';
  }));
  $$('[data-video-play]').forEach(b=>b.addEventListener('click',()=>{
    const box=b.closest('.video-frame');if(!box||box.querySelector('iframe'))return;
    const f=document.createElement('iframe');
    f.src='https://www.youtube-nocookie.com/embed/OkhdnBWKPgQ?autoplay=1&rel=0';
    f.title='Road Click SketchUp demonstration';
    f.allow='accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share';
    f.allowFullscreen=true;f.referrerPolicy='strict-origin-when-cross-origin';
    box.appendChild(f);b.remove();
  }));
  if(!reduced)$$('[data-preview-link]').forEach(a=>a.addEventListener('click',e=>{
    if(e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    e.preventDefault();const url=a.href;
    const layer=document.createElement('div');layer.style.cssText='position:fixed;inset:0;background:#00c7e8;z-index:9999;pointer-events:none;transform:translateY(101%);transition:transform .42s cubic-bezier(.2,.8,.2,1)';
    document.body.appendChild(layer);requestAnimationFrame(()=>layer.style.transform='translateY(0)');
    window.setTimeout(()=>window.location.assign(url),440);
  }));

  // A deterministic three-quarter-view height field. Visual concept, not footage from SketchUp.
  const NX=40,NY=29,W=900,H=650;
  function ht(x,y){
    const a=17*Math.sin(x*.22+1.2)*Math.cos(y*.21+.3);
    const b=9*Math.sin((x+y)*.17)+7*Math.cos(x*.41-y*.19);
    const dx=(x-14)/14,dy=(y-17)/12;
    return a+b+32*Math.exp(-(dx*dx+dy*dy)*1.2)+14*Math.exp(-Math.pow((x-29)/9,2)-Math.pow((y-7)/5,2));
  }
  function proj(x,y,z){z=z===undefined?ht(x,y):z;return{x:450+(x-y)*13.3,y:160+(x+y)*5.65-z*.78};}
  function rgba(r,g,b,a){return 'rgba('+Math.round(r)+','+Math.round(g)+','+Math.round(b)+','+(a||1)+')';}
  function curve1(a,b,c,d,t){
    const t2=t*t,t3=t2*t;
    return .5*(2*b+(-a+c)*t+(2*a-5*b+4*c-d)*t2+(-a+3*b-3*c+d)*t3);
  }
  function polyline(waypoints,per){
    const points=[];
    for(let i=0;i<waypoints.length-1;i++){
      const a=waypoints[Math.max(0,i-1)],b=waypoints[i],c=waypoints[i+1],d=waypoints[Math.min(waypoints.length-1,i+2)];
      for(let j=0;j<per;j++){const t=j/per;points.push([curve1(a[0],b[0],c[0],d[0],t),curve1(a[1],b[1],c[1],d[1],t)]);}
    }
    return points.concat([waypoints[waypoints.length-1]]);
  }
  const road=polyline([[2,26],[6,24],[11,22],[16,19],[20,16],[25,15],[30,12],[36,8],[39,5]],15).map(p=>proj(p[0],p[1],ht(p[0],p[1])+2.5));
  const branch=polyline([[15,10],[17,12],[19,14],[20,16],[22,19],[25,23]],9).map(p=>proj(p[0],p[1],ht(p[0],p[1])+2.5));
  function path(c,pts,frac){
    const total=Math.max(1,Math.floor((pts.length-1)*clamp(frac)));
    c.beginPath();c.moveTo(pts[0].x,pts[0].y);
    for(let i=1;i<=total;i++)c.lineTo(pts[i].x,pts[i].y);
  }
  function drawRoad(c,pts,frac,width,marks){
    if(frac<=0)return;
    c.lineCap='round';c.lineJoin='round';
    path(c,pts,frac);c.strokeStyle='rgba(0,10,16,.68)';c.lineWidth=width+18;c.stroke();
    path(c,pts,frac);c.strokeStyle='#b3d8da';c.lineWidth=width+8;c.stroke();
    path(c,pts,frac);c.strokeStyle='#263c48';c.lineWidth=width;c.stroke();
    if(marks){path(c,pts,frac);c.strokeStyle='#f7ffff';c.lineWidth=2;c.setLineDash([12,17]);c.stroke();c.setLineDash([]);}
  }
  function quad(c,a,b,d,e,fill,stroke){
    c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.lineTo(d.x,d.y);c.lineTo(e.x,e.y);c.closePath();
    c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=.65;c.stroke();}
  }
  function terrain(c){
    for(let i=0;i<NX;i++){
      const a=proj(i,NY),b=proj(i+1,NY);
      quad(c,a,b,{x:b.x,y:b.y+55},{x:a.x,y:a.y+55},'#092b37','rgba(108,218,237,.08)');
    }
    for(let j=0;j<NY;j++){
      const a=proj(NX,j),b=proj(NX,j+1);
      quad(c,a,b,{x:b.x,y:b.y+55},{x:a.x,y:a.y+55},'#092a35','rgba(108,218,237,.08)');
    }
    for(let sum=0;sum<NX+NY;sum++)for(let x=Math.max(0,sum-NY);x<=Math.min(NX-1,sum);x++){
      const y=sum-x;if(y>=NY)continue;
      const z=ht(x+.5,y+.5),dx=ht(x+1,y)-ht(x,y),dy=ht(x,y+1)-ht(x,y);
      const light=clamp(.5+(dx-dy)*.02),lift=(z+35)*.27;
      quad(c,proj(x,y),proj(x+1,y),proj(x+1,y+1),proj(x,y+1),
        rgba(8+light*10+lift*.21,58+light*27+lift*.5,74+light*28+lift*.55,1),
        ((x+y)%4===0)?'rgba(105,219,238,.16)':null);
    }
    c.lineWidth=1;
    for(let k=0;k<=NY;k+=4){
      c.beginPath();for(let x=0;x<=NX;x+=.5){const p=proj(x,k);if(x===0)c.moveTo(p.x,p.y);else c.lineTo(p.x,p.y);}
      c.strokeStyle='rgba(119,234,239,.22)';c.stroke();
    }
    for(let k=0;k<=NX;k+=4){
      c.beginPath();for(let y=0;y<=NY;y+=.5){const p=proj(k,y);if(y===0)c.moveTo(p.x,p.y);else c.lineTo(p.x,p.y);}
      c.strokeStyle='rgba(111,226,237,.20)';c.stroke();
    }
  }
  function draw(c,p,time,opts){
    p=clamp(p);c.clearRect(0,0,W,H);
    const bg=c.createRadialGradient(480,270,90,450,350,620);
    bg.addColorStop(0,'#153f51');bg.addColorStop(.58,'#071e2b');bg.addColorStop(1,'#03121d');
    c.fillStyle=bg;c.fillRect(0,0,W,H);
    const mx=opts.mx||0,my=opts.my||0;
    c.save();c.translate(450,320);c.rotate(mx*.022);c.translate(-450+mx*7,-320+my*5);
    terrain(c);
    const routeFraction=clamp(p*2.6);
    if(routeFraction){
      path(c,road,routeFraction);c.strokeStyle='rgba(17,221,250,.9)';c.lineWidth=4;c.lineCap='round';
      c.shadowColor='#22ecff';c.shadowBlur=18;c.stroke();c.shadowBlur=0;
    }
    if(p>.23)drawRoad(c,road,clamp((p-.23)/.44),23,p>.84);
    if(p>.58)drawRoad(c,branch,clamp((p-.58)/.28),19,p>.87);
    if(p>.83){
      const node=proj(20,16,ht(20,16)+3);
      c.beginPath();c.arc(node.x,node.y,11,0,2*Math.PI);c.fillStyle='rgba(255,255,255,.15)';c.fill();
      c.beginPath();c.arc(node.x,node.y,4,0,2*Math.PI);c.fillStyle='#affaff';c.fill();
      for(let k=0;k<6;k++){
        const x=18.6+k*.35,y=15.2-k*.11,q=proj(x,y,ht(x,y)+3.1);
        c.strokeStyle='rgba(255,255,255,.88)';c.lineWidth=2.5;c.beginPath();c.moveTo(q.x-4,q.y-8);c.lineTo(q.x+6,q.y+6);c.stroke();
      }
    }
    if(p>.67&&!opts.staticFrame){
      const q=(time*.00006)%1,pt=road[Math.floor(q*(road.length-1))];
      c.beginPath();c.arc(pt.x,pt.y,9,0,2*Math.PI);c.fillStyle='rgba(0,220,255,.18)';c.fill();
      c.beginPath();c.arc(pt.x,pt.y,3,0,2*Math.PI);c.fillStyle='#e7ffff';c.fill();
    }
    c.restore();
    c.font='700 10px ui-monospace,monospace';c.textBaseline='middle';
    c.fillStyle='rgba(155,224,236,.7)';c.fillText('STRUCTURA / TERRAIN STUDY',34,H-27);
    c.fillText('CONCEPT GRAPHIC — NOT SKETCHUP FOOTAGE',W-318,H-27);
  }
  const renderers=[];
  $$('canvas[data-terrain]').forEach(canvas=>{
    const c=canvas.getContext('2d',{alpha:false,desynchronized:true});if(!c)return;
    const r={canvas,c,mode:canvas.dataset.terrain||'auto',
      fixed:canvas.dataset.progress!==undefined?Number(canvas.dataset.progress):null,
      visible:true,mx:0,my:0,resize:true,last:-1,start:performance.now()};
    const ob='IntersectionObserver' in window?new IntersectionObserver(es=>r.visible=es[0].isIntersecting,{rootMargin:'180px'}):null;
    ob?.observe(canvas);
    function size(){
      const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;
      const dpr=Math.min(window.devicePixelRatio||1,1.75);
      canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);
      c.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);r.resize=false;r.last=-1;
    }
    r.size=size;size();
    if(!reduced){
      canvas.parentElement?.addEventListener('pointermove',e=>{
        const b=canvas.getBoundingClientRect();
        r.mx=clamp((e.clientX-b.left)/b.width)*2-1;
        r.my=clamp((e.clientY-b.top)/b.height)*2-1;
      },{passive:true});
      canvas.parentElement?.addEventListener('pointerleave',()=>{r.mx=0;r.my=0;});
    }
    renderers.push(r);
  });
  window.addEventListener('resize',()=>renderers.forEach(r=>r.resize=true),{passive:true});
  let lastFrame=0;
  function animate(now){
    if(now-lastFrame>32||reduced){
      lastFrame=now;
      for(const r of renderers){
        if(!r.visible&&!r.resize)continue;
        if(r.resize)r.size();
        const p=r.fixed!==null?r.fixed:r.mode==='scroll'?buildProgress:reduced?1:clamp((now-r.start)/3900);
        const animated=!reduced&&(r.fixed===null&&r.mode==='auto'||Math.abs(r.mx)>.01||Math.abs(r.my)>.01);
        if(r.last<0||Math.abs(p-r.last)>.002||animated){draw(r.c,p,now,{mx:r.mx,my:r.my,staticFrame:reduced||r.fixed!==null});r.last=p;}
      }
      const sticky=$('.build-sticky');if(sticky)sticky.style.setProperty('--build-progress',(buildProgress*100)+'%');
    }
    if(!reduced)requestAnimationFrame(animate);
  }
  if(renderers.length)requestAnimationFrame(animate);
  if(reduced)requestAnimationFrame(animate);

  const compare=$('.compare-frame');
  if(compare){
    const slider=$('input[type="range"]',compare),after=$('.compare-after',compare),line=$('.compare-divider',compare),handle=$('.compare-handle',compare);
    function change(){
      const n=Number(slider.value);
      after.style.clipPath='inset(0 0 0 '+n+'%)';line.style.left=n+'%';handle.style.left=n+'%';
      slider.setAttribute('aria-valuetext',n+'% terrain-only, '+(100-n)+'% road system');
    }
    slider.addEventListener('input',change);change();
  }

  // Product orbit — proper perspective transforms, interactive rotation and touch controls.
  const orbit=$('.orbit-view');
  if(orbit){
    const system=$('.orbit-system',orbit),cards=$$('.orbit-product',orbit);
    let selected=0,downX=null;
    const degree=360/cards.length;
    const radius=()=>window.innerWidth<440?195:window.innerWidth<730?220:window.innerWidth<1200?305:355;
    const names=[
      ['Road Click','Early Access / €59,40','Road networks on terrain with relief, intersections and road markings.','/road-click'],
      ['Windows','Early Access','Configurable procedural windows, hardware and architectural detail.','/windows'],
      ['Floor & Wall','Free','Procedural surfaces, clipping, geometry and material workflows.','/floor-wall'],
      ['Doors','In development','Architectural doors following the Structura workflow.','/doors'],
      ['Kitchen','In development','Parametric modules and appliance workflows for SketchUp.','/kitchen'],
      ['Buildings','In development','Generate building systems from footprints.','/buildings']
    ];
    function update(motion=true){
      system.style.transition=motion&&!reduced?'transform .8s cubic-bezier(.2,.8,.17,1)':'none';
      system.style.transform='rotateY('+(-selected*degree)+'deg)';
      cards.forEach((c,i)=>{c.setAttribute('aria-current',String(i===selected));c.tabIndex=i===selected?0:-1;});
      const p=names[selected];
      const n=$('#orbit-name'),s=$('#orbit-status'),d=$('#orbit-description'),l=$('#orbit-link'),idx=$('#orbit-count'),top=$('#orbit-count-top');
      if(n)n.textContent=p[0];if(s)s.textContent=p[1];if(d)d.textContent=p[2];
      if(l){l.href=p[3];l.textContent='Explore '+p[0]+' ↗';}
      if(idx)idx.textContent=String(selected+1).padStart(2,'0')+' / 06';
      if(top)top.textContent=String(selected+1).padStart(2,'0')+' — '+p[0].toUpperCase();
    }
    function arrange(){
      const r=radius();cards.forEach((c,i)=>c.style.transform='rotateY('+(i*degree)+'deg) translateZ('+r+'px)');
      update(false);
    }
    function shift(n){selected=(selected+n+cards.length)%cards.length;update(true);}
    $('.orbit-prev')?.addEventListener('click',()=>shift(-1));
    $('.orbit-next')?.addEventListener('click',()=>shift(1));
    cards.forEach((c,i)=>c.addEventListener('click',()=>{selected=i;update();}));
    orbit.addEventListener('pointerdown',e=>downX=e.clientX);
    orbit.addEventListener('pointerup',e=>{if(downX===null)return;const delta=e.clientX-downX;downX=null;if(Math.abs(delta)>34)shift(delta<0?1:-1);});
    orbit.addEventListener('pointercancel',()=>downX=null);
    orbit.addEventListener('keydown',e=>{
      if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();shift(e.key==='ArrowRight'?1:-1);cards[selected]?.focus({preventScroll:true});}
    });
    window.addEventListener('resize',arrange,{passive:true});arrange();
  }
  scrollUpdate();
})();