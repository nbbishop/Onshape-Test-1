
function buildSearchUrl(term){
 const s=encodeURIComponent(term.trim()).replace(/%20/g,'+');
 return `https://www.mcmaster.com/products/?s=${s}`;
}
const q=document.getElementById('q');
const go=document.getElementById('go');
const status=document.getElementById('status');

function launch(){
 const term=q.value.trim();
 if(!term){status.textContent='Enter a search term.';return;}
 const url=buildSearchUrl(term);
 const w=window.open(url,'_blank','noopener');
 if(!w){
   const a=document.createElement('a');
   a.href=url;a.target='_blank';a.click();
 }
 status.textContent='Opened McMaster-Carr in a new tab.';
}
go.addEventListener('click',launch);
q.addEventListener('keydown',e=>{if(e.key==='Enter')launch();});
q.focus();

(function(){
 const root=document.documentElement;
 const btn=document.getElementById('theme');

 function apply(theme){
   root.setAttribute('data-theme',theme);
   try{localStorage.setItem('mc-theme',theme);}catch(e){}
 }

 const params=new URLSearchParams(location.search);
 const onshape=params.get('theme');
 let saved=null;
 try{saved=localStorage.getItem('mc-theme');}catch(e){}
 const dark=window.matchMedia('(prefers-color-scheme: dark)').matches;
 apply(onshape || saved || (dark?'dark':'light'));

 btn.addEventListener('click',()=>{
   const next=root.getAttribute('data-theme')==='dark'?'light':'dark';
   apply(next);
 });
})();
