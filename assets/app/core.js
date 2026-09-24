'use strict';
/* =====================================================================
   Núcleo de la app de Geometría (SPA de un módulo por tema).
   API para módulos:
     registerModule({id, title, unidad, lead, contenidoOficial,
       pendiente, build(section)})
     el(tag, attrs, ...hijos)  $(sel)  fmt(x)  sleep(ms)
     Stepper(mount, steps, reset, modId) — animación paso a paso (← → en teclado)
     codeBox(mount)  btnGroup(mount, items, onpick)
     addRelayout(nodo, fn, dispose?) / relayout() — recalcular medidas; las
       entradas cuyo nodo ya salió del DOM se descartan solas (sin fugas)
     hashId() / hashParams() / setHashParams(obj) — estado en la URL
     activate(id) — muestra un módulo y arma su nav de unidad/tema
     renderMath(nodo) — KaTeX por módulo (se construyen en diferido)
   Convenciones CSS: ver assets/app/app.css
   (.unidad-nav .unidad .unidad-btn .unidad-menu .tema-op .ficha-pendiente .fuente …)
   ===================================================================== */
const $=(s,r=document)=>r.querySelector(s);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function el(tag,attrs={},...kids){
  const n=document.createElement(tag);
  for(const [k,v] of Object.entries(attrs)){
    if(k==='class')n.className=v;
    else if(k==='html')n.innerHTML=v;
    else if(k.startsWith('on'))n.addEventListener(k.slice(2),v);
    else if(k==='style')n.style.cssText=v;
    else n.setAttribute(k,v);
  }
  for(const k of kids.flat(9)){ if(k==null)continue; n.append(k.nodeType?k:document.createTextNode(k)); }
  return n;
}
const fmt=x=>(typeof x==='number'&&!Number.isInteger(x))?x.toFixed(1).replace('.',','):String(x);
/* Relayout: los módulos se construyen ocultos (las medidas dan 0), así que hay
   que recalcular al activarlos. Cada entrada queda ligada a un nodo; cuando ese
   nodo sale del DOM (ejercicio ya descartado) se elimina junto con su observer,
   para que recorrer muchas preguntas no acumule closures ni MutationObservers. */
const RELAYOUT=[];
function addRelayout(node,fn,dispose){ RELAYOUT.push({node,fn,dispose}); }
function relayout(){
  for(let i=RELAYOUT.length-1;i>=0;i--){
    const e=RELAYOUT[i];
    if(!e.node.isConnected){ if(e.dispose)e.dispose(); RELAYOUT.splice(i,1); continue; }
    e.fn();
  }
}

/* Paso a paso con botones y teclado */
let ACTIVE_STEPPER=null;
const STEPPERS_BY_MOD={};
class Stepper{
  /* steps: [{d:descripción html, run:async fn(esUltimo)}] ; reset: fn estado inicial
     modId: registra el stepper para las flechas del teclado en ese módulo */
  constructor(mount,steps,reset,modId){
    this.steps=steps; this.reset=reset; this.i=-1; this._run=0;
    this.cnt=el('span',{class:'cnt'},'inicio');
    this.desc=el('div',{class:'stepdesc',html:'Presiona <b>▶ Siguiente</b> para avanzar paso a paso.'});
    const bPrev=el('button',{class:'btn',onclick:()=>this.go(this.i-1)},'◀ Anterior');
    const bNext=el('button',{class:'btn primary',onclick:()=>this.go(this.i+1)},'▶ Siguiente');
    const bRe=el('button',{class:'btn',onclick:()=>this.go(-1)},'⟲ Reiniciar');
    const bar=el('div',{class:'stepper',onclick:()=>ACTIVE_STEPPER=this},bPrev,bNext,bRe,this.cnt);
    mount.append(bar,this.desc);
    if(modId)(STEPPERS_BY_MOD[modId]=STEPPERS_BY_MOD[modId]||[]).push(this);
  }
  async go(i){
    if(i<-1||i>=this.steps.length)return;
    ACTIVE_STEPPER=this;
    const tok=++this._run;
    this.i=i;
    if(i===-1){ this.reset(); this.cnt.textContent='inicio';
      this.desc.innerHTML='Presiona <b>▶ Siguiente</b> para avanzar paso a paso.'; return; }
    this.reset();
    this.cnt.textContent=`paso ${i+1}/${this.steps.length}`;
    this.desc.innerHTML=this.steps[i].d;
    for(let k=0;k<=i;k++){
      if(this._run!==tok)return; // otro clic interrumpió esta corrida
      await this.steps[k].run(k===i);
    }
  }
}

/* Estado en la URL: #merge?how=outer — compartible por WhatsApp.
   hashId() da el id sin parámetros; hashParams() el objeto {k:v};
   setHashParams(obj) los escribe sin recargar ni re-activar. */
const hashId=()=>decodeURIComponent(location.hash.slice(1).split('?')[0]);
function hashParams(){
  const q=location.hash.split('?')[1]||'';
  return Object.fromEntries(new URLSearchParams(q));
}
function setHashParams(obj){
  const clean=Object.fromEntries(Object.entries(obj).filter(([,v])=>v!=null&&v!==''));
  const q=new URLSearchParams(clean).toString();
  history.replaceState(null,'','#'+hashId()+(q?'?'+q:''));
}

/* ================= app shell ================= */
/* Un módulo = un TEMA. m = {
     id            slug ASCII, es el ancla en la URL
     title         nombre visible
     unidad        'inicio' | 'I' | 'II' | 'III'
     lead          una frase de orientación
     contenidoOficial  ['...','...'] — bullets del temario del tema; se listan en
                   la ficha de los temas todavía sin escribir
     pendiente     true = tema todavía no escrito; no lleva build(), se pinta la ficha
     build(sec)    construye el contenido; ausente si pendiente
   Esta app no lleva calendario: ni semanas, ni fechas, ni evaluaciones. */
const MODULES=[];
function registerModule(m){MODULES.push(m);}
const unidadesDe=()=>[...new Set(MODULES.map(m=>m.unidad))];
const temasDe=u=>MODULES.filter(m=>m.unidad===u);
const moduloPorId=id=>MODULES.find(m=>m.id===id);

/* Ficha de un tema todavía sin escribir: qué va a cubrir cuando lo esté.
   Sin calendario de ningún tipo — el lector busca la unidad y el tema que lo
   complica, no en qué fecha se dicta. */
function fichaPendiente(m){
  const caja=el('div',{class:'ficha-pendiente'},
    el('h3',{},'Este tema todavía no está animado'));
  if(m.contenidoOficial&&m.contenidoOficial.length){
    caja.append(el('p',{class:'note'},'Cuando lo esté, va a cubrir:'));
    caja.append(el('ul',{},m.contenidoOficial.map(t=>el('li',{},t))));
  }
  return caja;
}

/* ---- Nav de unidades con panel desplegable ----
   Una sola fila: las unidades se reparten TODO el ancho del header y cada una
   despliega un panel en grilla con sus temas numerados (el número es el mismo
   atajo de teclado 1–9 de más abajo). Reemplaza a la fila permanente
   .tema-nav, que obligaba al header a tener dos filas de botones apretadas
   contra el borde derecho, con el nombre del ramo solo a la izquierda.

   Apertura: hover en punteros que lo tienen, y :focus-within para el teclado
   (ambas cosas viven en CSS). En táctil no hay hover, así que el propio botón
   de la unidad alterna la clase .abierto — por eso el handler pregunta por
   (hover:hover) en vez de asumir escritorio. Nota: esto es un puente para que
   el teléfono siga siendo usable; el menú móvil propiamente dicho se diseña
   aparte. */
const UNIDAD_NODOS={};
const hayHover=()=>window.matchMedia('(hover:hover)').matches;
function cerrarMenus(){
  for(const u in UNIDAD_NODOS)UNIDAD_NODOS[u].caja.classList.remove('abierto');
}
/* --hdr-h: alto real del header sticky. En móvil el panel es position:fixed
   (para escapar del recorte de la fila con overflow-x) y necesita saber desde
   qué altura colgar; el header no mide siempre lo mismo porque el nombre del
   ramo puede ocupar una o dos líneas según el ancho. */
function medirHeader(){
  const h=document.querySelector('header'); if(!h)return;
  document.documentElement.style.setProperty('--hdr-h',h.offsetHeight+'px');
}

function buildShell(){
  const nav=$('#nav'), main=$('#main');
  if(!MODULES.length)return;
  MODULES.forEach(m=>{
    const sec=el('section',{class:'module',id:'mod-'+m.id},
      el('h2',{},m.title), el('p',{class:'lead'},m.lead||''));
    main.append(sec); m._built=false; m._sec=sec;
  });
  const fila=el('div',{class:'unidad-nav'});
  nav.append(fila);
  unidadesDe().forEach(u=>{
    const temas=temasDe(u);
    const et=u==='inicio'?'🏠 Inicio':('Unidad '+u+(window.CURSO.unidades[u]?' · '+window.CURSO.unidades[u]:''));
    const sub=el('span',{class:'u-tema'});
    const btn=el('button',{class:'unidad-btn',type:'button'},el('span',{class:'u-nombre'},et),sub);
    /* 2 columnas hasta 6 temas, 3 de ahí en adelante: así ningún panel pasa de
       tres filas de alto (el máximo hoy son los 9 temas de la Unidad II de
       Base de Datos). Va como custom property y no como style inline suelto
       para que la grilla siga definida en la hoja de estilos. */
    const menu=el('div',{class:'unidad-menu'});
    menu.style.setProperty('--cols',temas.length>6?3:2);
    temas.forEach((m,i)=>{
      const b=el('button',{class:'tema-op'+(m.pendiente?' pend':''),type:'button',
        onclick:()=>{cerrarMenus();activate(m.id);}},
        el('span',{class:'n'},i<9?String(i+1):'·'),el('span',{class:'t'},m.title));
      b.dataset.mod=m.id; menu.append(b);
    });
    const caja=el('div',{class:'unidad'},btn,menu);
    caja.dataset.unidad=u;
    /* El panel cuelga a la izquierda de su unidad; si con eso se pasa del borde
       derecho de la pantalla, se ancla a la derecha (.der). Se mide en vez de
       decidirlo por posición en la fila porque el ancho del panel depende de
       cuántos temas tenga la unidad y de qué tan largos sean sus títulos: con
       5 unidades, la penúltima (9 temas en 3 columnas) ya se salía.
       Va en rAF porque en 'pointerenter' el :hover que muestra el panel todavía
       puede no estar aplicado, y un panel en display:none mide 0. */
    const ubicar=()=>requestAnimationFrame(()=>{
      /* en móvil el panel es position:fixed a todo el ancho (ver app.css): no
         hay nada que anclar ni que recortar */
      if(getComputedStyle(menu).position==='fixed')return;
      menu.classList.remove('der');
      menu.style.removeProperty('max-width');
      const c=caja.getBoundingClientRect(), aire=8;
      /* espacio útil de cada anclaje: colgando a la izquierda el panel crece
         hacia el borde derecho de la ventana; colgando a la derecha (.der)
         crece hacia la izquierda desde el borde derecho de SU unidad —no desde
         el de la ventana, que fue el error de la primera versión: el clamp
         calculado contra innerWidth dejaba el panel ancho de la Unidad II
         saliéndose por la izquierda en anchos intermedios (760–1024px). */
      const espIzq=window.innerWidth-aire-c.left, espDer=c.right-aire;
      const ancho=menu.getBoundingClientRect().width;
      if(ancho>espIzq&&espDer>espIzq)menu.classList.add('der');
      const disp=menu.classList.contains('der')?espDer:espIzq;
      /* si aun así no entra, se recorta al espacio disponible: las columnas se
         aprietan y los títulos envuelven, pero nada queda fuera de pantalla */
      if(ancho>disp)menu.style.maxWidth=Math.max(180,disp)+'px';
    });
    caja.addEventListener('pointerenter',ubicar);
    caja.addEventListener('focusin',ubicar);
    btn.onclick=()=>{
      if(hayHover()){
        /* el panel ya está a la vista por hover: el clic en la cabecera es un
           atajo al primer tema. blur() para que :focus-within no lo deje
           abierto encima del contenido después de navegar. */
        cerrarMenus();
        const primero=temas[0]; if(primero)activate(primero.id);
        btn.blur();
      }else{
        const abierto=caja.classList.contains('abierto');
        cerrarMenus();
        caja.classList.toggle('abierto',!abierto);
        if(!abierto)ubicar();
      }
    };
    fila.append(caja);
    UNIDAD_NODOS[u]={caja,btn,sub,menu};
  });
  /* tocar fuera cierra el panel abierto en táctil (en escritorio lo cierra el
     propio hover, así que esto no molesta) */
  document.addEventListener('click',e=>{ if(!e.target.closest('.unidad'))cerrarMenus(); });
  medirHeader();
  const buscado=hashId();
  activate(moduloPorId(buscado)?buscado:MODULES[0].id);
  window.addEventListener('hashchange',()=>{
    const id=hashId();
    if(moduloPorId(id)&&!document.getElementById('mod-'+id).classList.contains('active'))activate(id);
  });
}

/* Marca la unidad activa y, dentro de su botón, el tema en el que estás: sin la
   fila .tema-nav esta es la única pista permanente de dónde está uno parado.
   Se omite en unidades de un solo tema (Inicio), donde repetiría la etiqueta. */
function marcarUnidad(m){
  for(const u in UNIDAD_NODOS){
    const n=UNIDAD_NODOS[u], on=(u===m.unidad);
    n.caja.classList.toggle('on',on);
    n.sub.textContent=(on&&temasDe(u).length>1)?m.title:'';
    n.menu.querySelectorAll('.tema-op').forEach(b=>b.classList.toggle('on',b.dataset.mod===m.id));
  }
}

function activate(id){
  const m=moduloPorId(id); if(!m)return;
  window._unidadActiva=m.unidad;
  marcarUnidad(m);
  document.querySelectorAll('.module').forEach(s=>s.classList.toggle('active',s.id==='mod-'+id));
  /* en pantallas angostas la fila de unidades scrollea horizontal: traer la
     activa al centro para que nunca quede fuera de vista */
  const on=document.querySelector('.unidad.on');
  if(on)on.scrollIntoView({inline:'center',block:'nearest'});
  const keep=(hashId()===id);
  if(!keep)history.replaceState(null,'','#'+id);
  if(!m._built){
    if(m.pendiente)m._sec.append(fichaPendiente(m));
    else m.build(m._sec);
    m._built=true;
    renderMath(m._sec); // los módulos se construyen en diferido: KaTeX va acá
  }
  relayout();
  ACTIVE_STEPPER=(STEPPERS_BY_MOD[id]||[null])[0];
  window.scrollTo({top:0});
}

/* KaTeX por módulo. Si se renderizara una sola vez al cargar, las fórmulas de
   las pestañas nunca visitadas quedarían crudas. */
function renderMath(nodo){
  if(!window.renderMathInElement)return;
  window.renderMathInElement(nodo,{
    delimiters:[
      {left:'$$',right:'$$',display:true},
      {left:'$',right:'$',display:false}
    ],
    throwOnError:false
  });
}

/* helpers UI */
function codeBox(mount){const c=el('pre',{class:'code'});mount.append(c);return c;}
function btnGroup(mount,items,onpick,activeFirst=true){
  /* items: [{label,value}] — botones excluyentes; devuelve los botones */
  const wrap=el('div',{class:'controls'});
  const btns=items.map((it,i)=>el('button',{class:'btn'+((activeFirst&&i===0)?' on':''),onclick:()=>{
    btns.forEach(b=>b.classList.remove('on')); btns[i].classList.add('on'); onpick(it.value);
  }},it.label));
  wrap.append(...btns); mount.append(wrap); return btns;
}

/* tema, presentación y teclado */
/* Modo "dentro del libro": la estantería (estanteria.html) embebe estas páginas
   en un <iframe> con ?libro en la URL. En ese modo se ocultan header, nav y
   footer y el contenido se pega al borde, para que el libro muestre el tema y
   no un navegador dentro de otro. Se marca en <html> ANTES de pintar nada.
   Va con location.search y no con el hash porque el hash ya lo usa el id del
   tema (…/index.html?libro#normalizacion). */
if(/(^|[?&])libro($|[=&])/.test(location.search))document.documentElement.classList.add('enlibro');

document.addEventListener('DOMContentLoaded',()=>{
  const btnTheme=$('#btnTheme');
  const THEMES=[['','🌗 Auto'],['light','☀️ Claro'],['dark','🌙 Oscuro']];
  const TKEY='bib_tema';
  const leerTema=()=>{try{return localStorage.getItem(TKEY)||'';}catch(_){return '';}};
  const guardarTema=v=>{try{localStorage.setItem(TKEY,v);}catch(_){/* modo incógnito */}};
  const aplicarTema=v=>{
    if(v)document.documentElement.dataset.theme=v; else delete document.documentElement.dataset.theme;
    btnTheme.textContent=(THEMES.find(t=>t[0]===v)||THEMES[0])[1];
    /* mismo patrón que assets/js/observatorio.js:34 — Plano (math.js) escucha
       este evento para volver a leer colorVar() y redibujar el canvas; sin
       este dispatch el lienzo queda pintado con el tema anterior hasta el
       próximo resize. Se dispara también en la aplicación inicial (carga):
       en ese momento todavía no hay canvases con addRelayout (los módulos
       se construyen recién al activarlos), así que es inocuo, y deja un
       único punto de disparo en vez de duplicar la llamada. */
    document.dispatchEvent(new CustomEvent('temacambiado'));
  };
  /* el tema elegido sobrevive a la recarga: en una sala clara no hay que reclicar */
  let themeIdx=Math.max(0,THEMES.findIndex(t=>t[0]===leerTema()));
  aplicarTema(THEMES[themeIdx][0]);
  btnTheme.onclick=()=>{
    themeIdx=(themeIdx+1)%3;
    const v=THEMES[themeIdx][0];
    aplicarTema(v); guardarTema(v);
  };
  /* Modo presentación (proyector): agranda tipografía y celdas vía :root.presenta.
     El botón se sacó del header a pedido de Matías —la barra quedaba cargada y
     la función casi no se usa—, pero la implementación queda acá entera para
     reactivarla: basta con devolver al HTML un <button onclick="togglePresentacion()">
     (y, si se quiere, que su texto alterne con el booleano que devuelve). */
  window.togglePresentacion=()=>{
    const on=document.documentElement.classList.toggle('presenta');
    relayout();
    return on;
  };
  document.addEventListener('keydown',e=>{
    if(e.target.matches('input,select,textarea'))return;
    if(e.shiftKey&&/^[!@#$]$/.test(e.key)){ // Shift+1..4
      const u=unidadesDe()[' !@#$'.indexOf(e.key)-0];
      if(u){const t=temasDe(u)[0]; if(t)activate(t.id);}
      e.preventDefault(); return;
    }
    if(e.key==='ArrowRight'&&ACTIVE_STEPPER){ACTIVE_STEPPER.go(ACTIVE_STEPPER.i+1);e.preventDefault();}
    else if(e.key==='ArrowLeft'&&ACTIVE_STEPPER){ACTIVE_STEPPER.go(ACTIVE_STEPPER.i-1);e.preventDefault();}
    else if(/^[1-9]$/.test(e.key)){
      const t=temasDe(window._unidadActiva||MODULES[0].unidad)[+e.key-1];
      if(t)activate(t.id);
    }
    else if(e.key==='Home'&&MODULES[0]){activate(MODULES[0].id);}
  });
  /* relayout() remide y repinta TODOS los canvases/árboles registrados via
     addRelayout — dispararlo en cada evento 'resize' (decenas por segundo
     durante un arrastre de ventana o una rotación de pantalla) sería carísimo
     y redundante. 150ms es el clásico "esperar a que el usuario termine de
     mover/rotar" antes de remedir: imperceptible como demora, pero evita
     recalcular en cada píxel intermedio. */
  let resizeTO=null;
  window.addEventListener('resize',()=>{
    clearTimeout(resizeTO);
    resizeTO=setTimeout(()=>{ medirHeader(); relayout(); },150);
  });
  buildShell();
});

/* Lo que consumen los mod-*.js de los ramos y el gate probar-app.mjs */
window.MODULES=MODULES;
window.STEPPERS_BY_MOD=STEPPERS_BY_MOD;
window.activate=activate;
window.registerModule=registerModule;
window.renderMath=renderMath;
