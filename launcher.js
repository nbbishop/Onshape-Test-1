function buildSearchUrl(term){
 const s=encodeURIComponent(term.trim()).replace(/%20/g,'+');
 return `https://www.mcmaster.com/products/?s=${s}`;
}
const q=document.getElementById('q'),go=document.getElementById('go'),status=document.getElementById('status');
function launch(){
 const term=q.value.trim();
 if(!term){status.textContent='Enter a search term.';return;}
 window.open(buildSearchUrl(term),'_blank','noopener');
 status.textContent='Opened McMaster in a new tab.';
}
go.addEventListener('click',launch);
q.addEventListener('keydown',e=>{if(e.key==='Enter')launch();});
(function(){
 const root=document.documentElement,toggle=document.getElementById('theme');
 let current='light';
 function apply(t){
  current=t;root.setAttribute('data-theme',t);
  toggle.textContent=t==='dark'?'🌙':'☀️';
 }
 apply('dark');
 toggle.addEventListener('click',()=>apply(current==='dark'?'light':'dark'));
})();