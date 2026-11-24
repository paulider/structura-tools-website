(()=>{
  const PRODUCT={
    road:{title:"Road Click",status:"Early Access · €59,40",description:"Procedural roads over terrain with relief, connected intersections, road markings and urban infrastructure.",features:["Terrain adaptation","Connected intersections","Road markings","Urban infrastructure"],url:"/road-click",logo:"/assets/road-click-safe.png"},
    floor:{title:"Floor & Wall",status:"Free",description:"Procedural floors and wall coverings with real geometry, pattern control, clipping and materials.",features:["Patterns","Material library","Real geometry","Clipping"],url:"/floor-wall",logo:"/assets/floor-wall-logo-current.png"},
    windows:{title:"Windows",status:"Early Access",description:"Complete procedural window systems with configurable frames, hardware, materials and regeneration.",features:["Frames","Hardware","Materials","Editable"],url:"/windows",logo:"/assets/structura-windows-logo-official.png"},
    doors:{title:"Doors",status:"In development",description:"An architectural door system following the visual, procedural workflow of Structura.",features:["Door systems","Hardware","Openings","Reuse"],url:"/doors",logo:"/assets/structura-doors-logo-official.png"},
    kitchen:{title:"Kitchen",status:"In development",description:"Parametric cabinetry, module layouts and appliance workflows for SketchUp interiors.",features:["Cabinet modules","Appliances","Layout","Materials"],url:"/kitchen",logo:"/assets/structura-kitchen-logo-official.png"},
    buildings:{title:"Buildings",status:"In development",description:"Generate building systems from footprints with facades, roofs and architectural style rules.",features:["Footprints","Facades","Roofs","Styles"],url:"/buildings",logo:"/assets/buildings-safe.png"}
  };
  function stopPlayer(root){
    root.querySelectorAll("iframe").forEach(el=>el.remove());
    root.querySelectorAll("[data-demo-play]").forEach(el=>el.hidden=false);
  }
  document.addEventListener("click",event=>{
    const button=event.target.closest("[data-demo-play]");
    if(!button)return;
    const root=button.closest("[data-video-player]");
    if(!root)return;
    button.hidden=true;
    const f=document.createElement("iframe");
    f.src="https://www.youtube-nocookie.com/embed/OkhdnBWKPgQ?autoplay=1&rel=0";
    f.title="Structura Road Click — SketchUp demonstration";
    f.allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share";
    f.allowFullscreen=true;f.referrerPolicy="strict-origin-when-cross-origin";
    root.appendChild(f);
  });
  const tabs=[...document.querySelectorAll("[data-select-product]")];
  const stage=document.getElementById("selector-panel");
  if(!stage)return;
  const title=document.getElementById("selector-title");
  const status=document.getElementById("selector-status");
  const summary=document.getElementById("selector-summary");
  const features=document.getElementById("selector-features");
  const link=document.getElementById("selector-link");
  const logo=document.getElementById("selector-logo");
  const demo=document.getElementById("selector-demo");
  const caption=document.getElementById("selector-art-caption");
  const choose=(id,focus=false)=>{
    const p=PRODUCT[id];if(!p)return;
    tabs.forEach(t=>{const on=t.dataset.selectProduct===id;t.setAttribute("aria-selected",String(on));t.tabIndex=on?0:-1;if(on&&focus)t.focus();});
    title.textContent=p.title;status.textContent=p.status;summary.textContent=p.description;
    features.replaceChildren(...p.features.map(v=>{const s=document.createElement("span");s.textContent=v;return s;}));
    link.href=p.url;link.textContent="Explore "+p.title+" ↗";
    logo.src=p.logo;logo.alt="Structura "+p.title;
    stopPlayer(demo);
    const onRoad=id==="road";
    demo.classList.toggle("hidden",!onRoad);
    logo.hidden=onRoad;
    caption.textContent=onRoad?"Road Click · SketchUp demo":p.title+" · Official product logo";
  };
  tabs.forEach((tab,i)=>{
    tab.addEventListener("click",()=>choose(tab.dataset.selectProduct));
    tab.addEventListener("keydown",e=>{
      if(!["ArrowLeft","ArrowRight","Home","End"].includes(e.key))return;
      e.preventDefault();
      const idx=e.key==="Home"?0:e.key==="End"?tabs.length-1:(i+(e.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length;
      choose(tabs[idx].dataset.selectProduct,true);
    });
  });
})();