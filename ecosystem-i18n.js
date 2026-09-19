(()=>{
const lang=(new URLSearchParams(location.search).get('lang')||'en').toLowerCase();
if(lang==='en')return;
const D={
ca:{
'Products':'Productes','Learn':'Aprèn','Support':'Suport','Floor & Wall — Free ↓':'Floor & Wall — Gratis ↓',
'Procedural tools for SketchUp.':'Eines procedurals per a SketchUp.',
'Build architectural elements faster with editable procedural tools designed for real production workflows.':'Crea elements arquitectònics més ràpid amb eines procedurals editables dissenyades per a fluxos de producció reals.',
'Download Floor & Wall — Free':'Descarrega Floor & Wall — Gratis','Explore Structura Tools':'Explora Structura Tools',
'Product ecosystem':'Ecosistema de productes','One workflow. Multiple tools.':'Un flux. Múltiples eines.',
'Free':'Gratis','Early Access':'Accés anticipat','Coming soon':'Properament','Preview':'Vista prèvia','In development':'En desenvolupament',
'Why Structura':'Per què Structura','Built for production. Not demos.':'Creat per a producció. No per a demos.',
'Shared workflow':'Flux compartit','Same logic across Structura.':'La mateixa lògica a tot Structura.',
'Select':'Selecciona','Configure':'Configura','Materials':'Materials','Generate':'Genera',
'Start free':'Comença gratis','Get Floor & Wall — Free':'Aconsegueix Floor & Wall — Gratis',
'Free. No trial. No subscription.':'Gratis. Sense prova. Sense subscripció.',
'Commercial release':'Llançament comercial','Get Structura Windows':'Aconsegueix Structura Windows','Learn more':'Més informació',
"What's next":'Què ve després','Advanced systems':'Sistemes avançats','Built for SketchUp':'Creat per a SketchUp',
'Documentation':'Documentació','Start with Structura':'Comença amb Structura','Floor & Wall is free.':'Floor & Wall és gratis.'
},
es:{
'Products':'Productos','Learn':'Aprender','Support':'Soporte','Floor & Wall — Free ↓':'Floor & Wall — Gratis ↓',
'Procedural tools for SketchUp.':'Herramientas procedurales para SketchUp.',
'Build architectural elements faster with editable procedural tools designed for real production workflows.':'Crea elementos arquitectónicos más rápido con herramientas procedurales editables diseñadas para flujos reales de producción.',
'Download Floor & Wall — Free':'Descargar Floor & Wall — Gratis','Explore Structura Tools':'Explorar Structura Tools',
'Product ecosystem':'Ecosistema de productos','One workflow. Multiple tools.':'Un flujo. Múltiples herramientas.',
'Free':'Gratis','Early Access':'Acceso anticipado','Coming soon':'Próximamente','Preview':'Vista previa','In development':'En desarrollo',
'Why Structura':'Por qué Structura','Built for production. Not demos.':'Creado para producción. No para demos.',
'Shared workflow':'Flujo compartido','Same logic across Structura.':'La misma lógica en todo Structura.',
'Select':'Seleccionar','Configure':'Configurar','Materials':'Materiales','Generate':'Generar',
'Start free':'Empieza gratis','Get Floor & Wall — Free':'Obtener Floor & Wall — Gratis',
'Free. No trial. No subscription.':'Gratis. Sin prueba. Sin suscripción.',
'Commercial release':'Lanzamiento comercial','Get Structura Windows':'Obtener Structura Windows','Learn more':'Más información',
"What's next":'Lo siguiente','Advanced systems':'Sistemas avanzados','Built for SketchUp':'Creado para SketchUp',
'Documentation':'Documentación','Start with Structura':'Empieza con Structura','Floor & Wall is free.':'Floor & Wall es gratis.'
},
it:{
'Products':'Prodotti','Learn':'Impara','Support':'Supporto','Floor & Wall — Free ↓':'Floor & Wall — Gratis ↓',
'Procedural tools for SketchUp.':'Strumenti procedurali per SketchUp.',
'Download Floor & Wall — Free':'Scarica Floor & Wall — Gratis','Explore Structura Tools':'Esplora Structura Tools',
'Product ecosystem':'Ecosistema prodotti','One workflow. Multiple tools.':'Un workflow. Più strumenti.',
'Free':'Gratis','Early Access':'Accesso anticipato','Coming soon':'Prossimamente','Preview':'Anteprima','In development':'In sviluppo',
'Why Structura':'Perché Structura','Built for production. Not demos.':'Creato per la produzione. Non per le demo.',
'Shared workflow':'Workflow condiviso','Same logic across Structura.':'La stessa logica in tutta Structura.',
'Select':'Seleziona','Configure':'Configura','Materials':'Materiali','Generate':'Genera',
'Start free':'Inizia gratis','Get Floor & Wall — Free':'Ottieni Floor & Wall — Gratis',
'Free. No trial. No subscription.':'Gratis. Nessuna prova. Nessun abbonamento.',
'Commercial release':'Release commerciale','Get Structura Windows':'Ottieni Structura Windows','Learn more':'Scopri di più',
"What's next":'Prossimamente','Advanced systems':'Sistemi avanzati','Built for SketchUp':'Creato per SketchUp',
'Documentation':'Documentazione','Start with Structura':'Inizia con Structura','Floor & Wall is free.':'Floor & Wall è gratis.'
},
fr:{
'Products':'Produits','Learn':'Apprendre','Support':'Support','Floor & Wall — Free ↓':'Floor & Wall — Gratuit ↓',
'Procedural tools for SketchUp.':'Outils procéduraux pour SketchUp.',
'Download Floor & Wall — Free':'Télécharger Floor & Wall — Gratuit','Explore Structura Tools':'Explorer Structura Tools',
'Product ecosystem':'Écosystème produits','One workflow. Multiple tools.':'Un workflow. Plusieurs outils.',
'Free':'Gratuit','Early Access':'Accès anticipé','Coming soon':'Prochainement','Preview':'Aperçu','In development':'En développement',
'Why Structura':'Pourquoi Structura','Built for production. Not demos.':'Conçu pour la production. Pas pour les démos.',
'Shared workflow':'Workflow partagé','Same logic across Structura.':'La même logique dans tout Structura.',
'Select':'Sélectionner','Configure':'Configurer','Materials':'Matériaux','Generate':'Générer',
'Start free':'Commencer gratuitement','Get Floor & Wall — Free':'Obtenir Floor & Wall — Gratuit',
'Free. No trial. No subscription.':'Gratuit. Sans essai. Sans abonnement.',
'Commercial release':'Version commerciale','Get Structura Windows':'Obtenir Structura Windows','Learn more':'En savoir plus',
"What's next":'À venir','Advanced systems':'Systèmes avancés','Built for SketchUp':'Conçu pour SketchUp',
'Documentation':'Documentation','Start with Structura':'Commencer avec Structura','Floor & Wall is free.':'Floor & Wall est gratuit.'
},
de:{
'Products':'Produkte','Learn':'Lernen','Support':'Support','Floor & Wall — Free ↓':'Floor & Wall — Kostenlos ↓',
'Procedural tools for SketchUp.':'Prozedurale Werkzeuge für SketchUp.',
'Download Floor & Wall — Free':'Floor & Wall kostenlos herunterladen','Explore Structura Tools':'Structura Tools entdecken',
'Product ecosystem':'Produkt-Ökosystem','One workflow. Multiple tools.':'Ein Workflow. Mehrere Werkzeuge.',
'Free':'Kostenlos','Early Access':'Early Access','Coming soon':'Demnächst','Preview':'Vorschau','In development':'In Entwicklung',
'Why Structura':'Warum Structura','Built for production. Not demos.':'Für Produktion gebaut. Nicht für Demos.',
'Shared workflow':'Gemeinsamer Workflow','Same logic across Structura.':'Dieselbe Logik in ganz Structura.',
'Select':'Auswählen','Configure':'Konfigurieren','Materials':'Materialien','Generate':'Generieren',
'Start free':'Kostenlos starten','Get Floor & Wall — Free':'Floor & Wall kostenlos erhalten',
'Free. No trial. No subscription.':'Kostenlos. Keine Testphase. Kein Abo.',
'Commercial release':'Kommerzielle Version','Get Structura Windows':'Structura Windows erhalten','Learn more':'Mehr erfahren',
"What's next":'Als Nächstes','Advanced systems':'Erweiterte Systeme','Built for SketchUp':'Für SketchUp entwickelt',
'Documentation':'Dokumentation','Start with Structura':'Mit Structura starten','Floor & Wall is free.':'Floor & Wall ist kostenlos.'
},
pt:{
'Products':'Produtos','Learn':'Aprender','Support':'Suporte','Floor & Wall — Free ↓':'Floor & Wall — Grátis ↓',
'Procedural tools for SketchUp.':'Ferramentas procedurais para SketchUp.',
'Download Floor & Wall — Free':'Descarregar Floor & Wall — Grátis','Explore Structura Tools':'Explorar Structura Tools',
'Product ecosystem':'Ecossistema de produtos','One workflow. Multiple tools.':'Um workflow. Várias ferramentas.',
'Free':'Grátis','Early Access':'Acesso antecipado','Coming soon':'Em breve','Preview':'Pré-visualização','In development':'Em desenvolvimento',
'Why Structura':'Porquê Structura','Built for production. Not demos.':'Criado para produção. Não para demos.',
'Shared workflow':'Workflow partilhado','Same logic across Structura.':'A mesma lógica em toda a Structura.',
'Select':'Selecionar','Configure':'Configurar','Materials':'Materiais','Generate':'Gerar',
'Start free':'Começar grátis','Get Floor & Wall — Free':'Obter Floor & Wall — Grátis',
'Free. No trial. No subscription.':'Grátis. Sem teste. Sem subscrição.',
'Commercial release':'Lançamento comercial','Get Structura Windows':'Obter Structura Windows','Learn more':'Saber mais',
"What's next":'A seguir','Advanced systems':'Sistemas avançados','Built for SketchUp':'Criado para SketchUp',
'Documentation':'Documentação','Start with Structura':'Começar com Structura','Floor & Wall is free.':'Floor & Wall é grátis.'
}};
const dict=D[lang]||{};
function run(){
  document.documentElement.lang=lang;
  const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  const nodes=[];while(w.nextNode())nodes.push(w.currentNode);
  nodes.forEach(n=>{const raw=n.nodeValue,t=raw.trim();if(t&&dict[t])n.nodeValue=raw.replace(t,dict[t]);});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,0),{once:true});else setTimeout(run,0);
})();