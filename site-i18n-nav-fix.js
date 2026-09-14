(()=>{
  const languages=[['en','EN'],['ca','CAT'],['es','ES'],['it','IT'],['fr','FR'],['de','DE'],['pt','PT']];
  function repairLanguageLinks(){
    const nav=document.querySelector('.lang-nav');
    if(!nav)return;
    const links=nav.querySelectorAll('a');
    links.forEach((link,index)=>{
      const item=languages[index];
      if(!item)return;
      const code=item[0];
      const url=new URL(location.href);
      if(code==='en')url.searchParams.delete('lang');
      else url.searchParams.set('lang',code);
      link.href=url.pathname+url.search+url.hash;
      link.dataset.lang=code;
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',repairLanguageLinks,{once:true});
  else repairLanguageLinks();
})();
