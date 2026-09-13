(()=>{
  const targets=[...document.querySelectorAll('[data-structura-windows-logo]')];
  if(!targets.length)return;
  const parts=['00','01','02','03','04','05'].map(n=>`/assets/windows-logo-source-v2/${n}.txt?v=20260913-3`);
  Promise.all(parts.map(url=>fetch(url,{cache:'force-cache'}).then(r=>{if(!r.ok)throw new Error(`Logo part ${r.status}`);return r.text()})))
    .then(chunks=>{
      const src='data:image/webp;base64,'+chunks.join('').replace(/\s+/g,'');
      targets.forEach(img=>{img.src=src;});
    })
    .catch(err=>{console.error('Structura Windows logo load failed',err);});
})();
