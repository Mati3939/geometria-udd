'use strict';
/* =====================================================================
   Primitivas de animación matemática para las apps de ramo.
   Reglas: se montan en un nodo, se registran con addRelayout, redibujan
   al cambiar tema/tamaño/modo presentación, y NINGUNA guarda colores
   literales — todo sale de colorVar().
   ===================================================================== */
function colorVar(nombre){
  return getComputedStyle(document.documentElement).getPropertyValue(nombre).trim();
}

/* ---------------------------------------------------------------------
   Bucle de animación con tiempo, compartido por Plano y Espacio.

   Por qué existe: hasta la Fase 18 las primitivas solo sabían pintar un
   cuadro fijo (`dibujar`) o reaccionar a un slider. Todo lo que quisiera
   MOVERSE había que escribirlo a mano con requestAnimationFrame en cada
   módulo — y como escribir eso cuesta, los módulos terminaban cayendo en
   derivaciones `Pasos`. Resultado medido sobre los 6 ramos v4: los dos
   últimos habían bajado a 10-12 % de tarjetas visuales contra 45 % de
   tarjetas de desarrollo algebraico. Esto invierte el costo: animar pasa
   a ser una línea.

   Uso:  Plano(mount,{...}).animar((P,t)=>{ ... }, {duracion:6, auto:true})
   `fn(api, t)` recibe el tiempo en segundos desde el último reinicio.
   Con `duracion`, t recorre 0..duracion y vuelve a empezar (ciclo); sin
   ella, t crece indefinidamente.

   Se pausa sola cuando el módulo no está visible: en la SPA los módulos
   inactivos quedan en display:none y su canvas mide 0, así que un bucle
   suelto quemaría CPU de los 19 temas a la vez. Y se desregistra cuando
   su nodo sale del DOM, vía el `dispose` de addRelayout.
   --------------------------------------------------------------------- */
function montarAnimacion(api, L, mount, fn, op){
  op=Object.assign({duracion:0, auto:true, controles:true, velocidad:1}, op||{});
  let t0=performance.now(), t=0, corriendo=false, raf=0, vivo=true;

  const cuadro=()=>{
    L.medir(); api.limpiar(); fn(api, t);
  };
  const paso=(ahora)=>{
    if(!vivo) return;
    if(!corriendo) return;
    /* módulo oculto (display:none) → el canvas mide 0: no hay nada que
       pintar y seguir pidiendo frames es gasto puro. Se despierta solo. */
    if(L.canvas.clientWidth<10){ raf=requestAnimationFrame(paso); return; }
    /* Math.max(0,...): el timestamp que entrega requestAnimationFrame es el del
       COMIENZO del cuadro, y puede ser anterior al performance.now() que jugar()
       guardó en t0 — con lo cual el primer cuadro llegaba con t negativo. Para
       un pintor que solo evalúa funciones da igual, pero uno que saca un índice
       de t (floor(t/paso) % n) recibía -1 y leía fuera del arreglo. */
    t=Math.max(0,(ahora-t0)/1000*op.velocidad);
    if(op.duracion>0) t=t%op.duracion;
    cuadro();
    raf=requestAnimationFrame(paso);
  };

  const A={
    get t(){ return t; },
    jugar(){ if(corriendo)return A; corriendo=true; t0=performance.now()-t*1000/op.velocidad; raf=requestAnimationFrame(paso); sincBoton(); return A; },
    pausar(){ corriendo=false; cancelAnimationFrame(raf); sincBoton(); return A; },
    alternar(){ return corriendo?A.pausar():A.jugar(); },
    reiniciar(){ t=0; t0=performance.now(); cuadro(); return A; },
    fijar(v){ t=v; t0=performance.now()-t*1000/op.velocidad; cuadro(); return A; },
    get corriendo(){ return corriendo; }
  };

  let btnJugar=null;
  function sincBoton(){ if(btnJugar) btnJugar.textContent=corriendo?'⏸ Pausar':'▶ Reproducir'; }

  if(op.controles){
    btnJugar=el('button',{class:'btn primary',onclick:()=>A.alternar()},'▶ Reproducir');
    mount.append(el('div',{class:'stepper'},
      btnJugar,
      el('button',{class:'btn',onclick:()=>{A.pausar();A.reiniciar();}},'⟲ Reiniciar')
    ));
    sincBoton();
  }

  /* redibujar en resize y cambio de tema aunque esté pausada; y soltar el
     rAF cuando el nodo muere (módulo descartado, ejercicio cerrado). */
  addRelayout(L.canvas, ()=>{ if(!corriendo) cuadro(); },
              ()=>{ vivo=false; corriendo=false; cancelAnimationFrame(raf); });
  document.addEventListener('temacambiado', ()=>{ if(!corriendo) cuadro(); });

  cuadro();
  if(op.auto) A.jugar();
  return A;
}

/* Canvas con DPR correcto. Devuelve {canvas, ctx, w, h, medir}. */
function lienzo(mount, alto){
  const canvas=el('canvas',{class:'lienzo'});
  mount.append(canvas);
  const ctx=canvas.getContext('2d');
  const api={canvas,ctx,w:0,h:0};
  api.medir=function(){
    const dpr=window.devicePixelRatio||1;
    let w=canvas.clientWidth;
    if(!w||w<10)w=(mount.clientWidth||720);
    const h=alto||320;
    canvas.width=Math.round(w*dpr); canvas.height=Math.round(h*dpr);
    canvas.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    api.w=w; api.h=h;
  };
  api.medir();
  return api;
}

/* Plano cartesiano 2D. Todo se dibuja en coordenadas matemáticas; el mapeo a
   píxeles lo hace la primitiva. */
function Plano(mount, opts){
  const o=Object.assign({xMin:-5,xMax:5,yMin:-5,yMax:5,alto:320,iso:false},opts||{});
  const L=lienzo(mount,o.alto);
  const P={canvas:L.canvas, ctx:L.ctx};
  let pintor=null;

  /* Ventana EFECTIVA (v) contra la PEDIDA (o).
     El alto de un lienzo es fijo en px y el ancho es fluido, así que la escala
     en x y la escala en y no coinciden: sin corregir, una circunferencia sale
     ovalada y un angulo recto no se ve recto. En Geometria eso enseña mal.
     Con `iso:true` se usa una sola escala —la mas chica de las dos, para que la
     ventana pedida nunca quede recortada— y se ensancha el lado que sobre,
     centrado en el medio de la ventana pedida. Se recalcula en cada medir()
     porque el ancho cambia con la ventana del navegador. */
  let v={x0:o.xMin,x1:o.xMax,y0:o.yMin,y1:o.yMax};
  function ajustar(){
    if(!o.iso){ v={x0:o.xMin,x1:o.xMax,y0:o.yMin,y1:o.yMax}; return; }
    const cx=(o.xMin+o.xMax)/2, cy=(o.yMin+o.yMax)/2;
    const esc=Math.min(L.w/(o.xMax-o.xMin), L.h/(o.yMax-o.yMin)); /* px por unidad */
    const aw=L.w/esc/2, ah=L.h/esc/2;
    v={x0:cx-aw,x1:cx+aw,y0:cy-ah,y1:cy+ah};
  }
  const medirBase=L.medir;
  L.medir=function(){ medirBase(); ajustar(); };
  L.medir();

  const X=x=>( (x-v.x0)/(v.x1-v.x0) )*L.w;
  const Y=y=>L.h-( (y-v.y0)/(v.y1-v.y0) )*L.h;
  P.X=X; P.Y=Y;
  /* rango realmente visible — sirve para trazar algo de borde a borde */
  P.ventana=()=>({xMin:v.x0,xMax:v.x1,yMin:v.y0,yMax:v.y1});

  P.limpiar=function(){ L.ctx.clearRect(0,0,L.w,L.h); };

  P.ejes=function(){
    const c=L.ctx;
    c.save();
    c.strokeStyle=colorVar('--grid'); c.lineWidth=1;
    const pasoX=(v.x1-v.x0)/10, pasoY=(v.y1-v.y0)/10;
    for(let i=0;i<=10;i++){
      const x=v.x0+i*pasoX, y=v.y0+i*pasoY;
      c.beginPath(); c.moveTo(X(x),0); c.lineTo(X(x),L.h); c.stroke();
      c.beginPath(); c.moveTo(0,Y(y)); c.lineTo(L.w,Y(y)); c.stroke();
    }
    c.strokeStyle=colorVar('--axis'); c.lineWidth=1.5;
    if(v.y0<=0&&v.y1>=0){c.beginPath();c.moveTo(0,Y(0));c.lineTo(L.w,Y(0));c.stroke();}
    if(v.x0<=0&&v.x1>=0){c.beginPath();c.moveTo(X(0),0);c.lineTo(X(0),L.h);c.stroke();}
    c.restore();
  };

  P.curva=function(f,op){
    op=op||{}; const c=L.ctx;
    c.save(); c.strokeStyle=colorVar(op.color||'--s1'); c.lineWidth=op.grosor||2;
    if(op.guiones)c.setLineDash([5,4]);
    c.beginPath();
    const n=240; let primero=true;
    for(let i=0;i<=n;i++){
      const x=v.x0+(v.x1-v.x0)*i/n, y=f(x);
      if(!isFinite(y)){primero=true;continue;}
      if(primero){c.moveTo(X(x),Y(y));primero=false;} else c.lineTo(X(x),Y(y));
    }
    c.stroke(); c.restore();
  };

  P.parametrica=function(f,t0,t1,op){
    op=op||{}; const c=L.ctx;
    c.save(); c.strokeStyle=colorVar(op.color||'--s1'); c.lineWidth=op.grosor||2;
    c.beginPath();
    const n=op.n||300;
    for(let i=0;i<=n;i++){
      const p=f(t0+(t1-t0)*i/n);
      if(i===0)c.moveTo(X(p[0]),Y(p[1])); else c.lineTo(X(p[0]),Y(p[1]));
    }
    c.stroke(); c.restore();
  };

  P.vector=function(x0,y0,x1,y1,op){
    op=op||{}; const c=L.ctx, col=colorVar(op.color||'--s4');
    c.save(); c.strokeStyle=col; c.fillStyle=col; c.lineWidth=op.grosor||2;
    c.beginPath(); c.moveTo(X(x0),Y(y0)); c.lineTo(X(x1),Y(y1)); c.stroke();
    const ang=Math.atan2(Y(y1)-Y(y0),X(x1)-X(x0)), l=op.punta||9;
    c.beginPath(); c.moveTo(X(x1),Y(y1));
    c.lineTo(X(x1)-l*Math.cos(ang-0.4),Y(y1)-l*Math.sin(ang-0.4));
    c.lineTo(X(x1)-l*Math.cos(ang+0.4),Y(y1)-l*Math.sin(ang+0.4));
    c.closePath(); c.fill();
    if(op.etiqueta)P.texto(x1,y1,op.etiqueta,{color:op.color||'--s4',dx:8,dy:-8});
    c.restore();
  };

  P.punto=function(x,y,op){
    op=op||{}; const c=L.ctx;
    c.save(); c.fillStyle=colorVar(op.color||'--s2');
    c.beginPath(); c.arc(X(x),Y(y),op.r||4,0,6.2832); c.fill(); c.restore();
    if(op.etiqueta)P.texto(x,y,op.etiqueta,{color:op.color||'--s2',dx:7,dy:-7});
  };

  P.region=function(f1,f2,a,b,op){
    op=op||{}; const c=L.ctx;
    c.save(); c.fillStyle=colorVar(op.color||'--s1'); c.globalAlpha=op.alpha||0.18;
    c.beginPath(); const n=120;
    for(let i=0;i<=n;i++){const x=a+(b-a)*i/n; if(i===0)c.moveTo(X(x),Y(f1(x))); else c.lineTo(X(x),Y(f1(x)));}
    for(let i=n;i>=0;i--){const x=a+(b-a)*i/n; c.lineTo(X(x),Y(f2(x)));}
    c.closePath(); c.fill(); c.restore();
  };

  /* campo de direcciones: f(x,y) devuelve la pendiente y' en ese punto */
  P.campo=function(f,op){
    op=op||{}; const c=L.ctx, nx=op.nx||16, ny=op.ny||12, largo=op.largo||11;
    c.save(); c.strokeStyle=colorVar(op.color||'--muted'); c.lineWidth=1.2;
    for(let i=0;i<=nx;i++)for(let j=0;j<=ny;j++){
      const x=v.x0+(v.x1-v.x0)*i/nx, y=v.y0+(v.y1-v.y0)*j/ny;
      const m=f(x,y); if(!isFinite(m))continue;
      const ang=Math.atan(m), dx=largo*Math.cos(ang), dy=largo*Math.sin(ang);
      c.beginPath(); c.moveTo(X(x)-dx,Y(y)+dy); c.lineTo(X(x)+dx,Y(y)-dy); c.stroke();
    }
    c.restore();
  };

  P.texto=function(x,y,s,op){
    op=op||{}; const c=L.ctx;
    c.save(); c.fillStyle=colorVar(op.color||'--ink2');
    c.font=(op.tam||12)+'px ui-monospace, Consolas, monospace';
    c.fillText(s,X(x)+(op.dx||0),Y(y)+(op.dy||0)); c.restore();
  };

  /* fn se guarda y se vuelve a correr en resize y cambio de tema */
  P.dibujar=function(fn){
    pintor=fn;
    const correr=()=>{L.medir(); P.limpiar(); pintor(P);};
    correr();
    addRelayout(L.canvas,correr);
    document.addEventListener('temacambiado',correr);
    return P;
  };
  P.redibujar=function(){ if(pintor){L.medir(); P.limpiar(); pintor(P);} };
  P.animar=function(fn,op){ return montarAnimacion(P,L,mount,fn,op); };
  return P;
}

/* Derivación algebraica revelada línea a línea por el Stepper.
   lineas: [{tex:'x^2=4', nota:'Se resta 1 a ambos lados.'}]
   El LaTeX va SIN delimitadores: la primitiva agrega $$…$$. */
function Pasos(mount, lineas, opts){
  opts=opts||{};
  const caja=el('div',{class:'pasos'});
  if(opts.titulo)mount.append(el('p',{class:'note',style:'font-weight:600'},opts.titulo));
  const filas=lineas.map(L=>{
    const f=el('div',{class:'pasos-linea'},
      el('div',{class:'pasos-tex',html:'$$'+L.tex+'$$'}),
      el('div',{class:'pasos-nota',html:L.nota||''}));
    caja.append(f); return f;
  });
  mount.append(caja);
  const reset=()=>filas.forEach(f=>{f.classList.remove('vista','actual');});
  const steps=lineas.map((L,i)=>({
    d:L.nota||'',
    run:async(esUltimo)=>{
      filas[i].classList.add('vista');
      filas[i].classList.toggle('actual',esUltimo);
    }
  }));
  const stepper=new Stepper(mount,steps,reset,opts.modId);
  reset();
  return {stepper,filas};
}

/* Wireframe 3D con proyección ortográfica y rotación por arrastre.
   Todos los puntos son arrays [x,y,z]. Dimensionar: el rango que entra en el
   canvas es aprox. ±(alto/2)/escala unidades de mundo alrededor del origen
   (más ancho en X si el canvas es más ancho que alto); una coordenada de
   magnitud mayor que eso —incluida la punta de un eje o una etiqueta— queda
   recortada fuera del lienzo. Si algo se corta arriba/abajo, subí `alto`
   o bajá `escala` (o ambos) hasta que quepa. */
function Espacio(mount, opts){
  const o=Object.assign({alto:360,escala:60,theta:0.6,phi:0.35,rotable:true},opts||{});
  const L=lienzo(mount,o.alto);
  const E={canvas:L.canvas,ctx:L.ctx};
  let th=o.theta, ph=o.phi, pintor=null;

  /* proyección: giro en Z por th, luego inclinación por ph, luego ortográfica */
  function proy(p){
    const ct=Math.cos(th), st=Math.sin(th), cp=Math.cos(ph), sp=Math.sin(ph);
    const x1=p[0]*ct-p[1]*st, y1=p[0]*st+p[1]*ct;
    return [L.w/2+x1*o.escala, L.h/2-(p[2]*cp-y1*sp)*o.escala];
  }
  E.proy=proy;

  E.limpiar=function(){ L.ctx.clearRect(0,0,L.w,L.h); };

  E.linea3=function(a,b,op){
    op=op||{}; const c=L.ctx, A=proy(a), B=proy(b);
    c.save(); c.strokeStyle=colorVar(op.color||'--grid'); c.lineWidth=op.grosor||1;
    if(op.guiones)c.setLineDash([4,4]);
    c.beginPath(); c.moveTo(A[0],A[1]); c.lineTo(B[0],B[1]); c.stroke(); c.restore();
  };

  E.ejes3=function(op){
    op=op||{}; const r=op.largo||3;
    E.linea3([0,0,0],[r,0,0],{color:'--axis',grosor:1.5});
    E.linea3([0,0,0],[0,r,0],{color:'--axis',grosor:1.5});
    E.linea3([0,0,0],[0,0,r],{color:'--axis',grosor:1.5});
    E.texto3([r,0,0],'x'); E.texto3([0,r,0],'y'); E.texto3([0,0,r],'z');
  };

  E.curva3=function(f,t0,t1,op){
    op=op||{}; const c=L.ctx, n=op.n||220;
    c.save(); c.strokeStyle=colorVar(op.color||'--s1'); c.lineWidth=op.grosor||2;
    c.beginPath();
    for(let i=0;i<=n;i++){
      const P=proy(f(t0+(t1-t0)*i/n));
      if(i===0)c.moveTo(P[0],P[1]); else c.lineTo(P[0],P[1]);
    }
    c.stroke(); c.restore();
  };

  /* f(u,v) -> [x,y,z]; se dibuja como malla de líneas en ambas direcciones */
  E.superficie=function(f,op){
    op=op||{};
    const uMin=op.uMin!==undefined?op.uMin:-2, uMax=op.uMax!==undefined?op.uMax:2;
    const vMin=op.vMin!==undefined?op.vMin:-2, vMax=op.vMax!==undefined?op.vMax:2;
    const nu=op.nu||14, nv=op.nv||14, col=op.color||'--s7';
    for(let i=0;i<=nu;i++){
      const u=uMin+(uMax-uMin)*i/nu;
      for(let j=0;j<nv;j++){
        const v1=vMin+(vMax-vMin)*j/nv, v2=vMin+(vMax-vMin)*(j+1)/nv;
        E.linea3(f(u,v1),f(u,v2),{color:col,grosor:1});
      }
    }
    for(let j=0;j<=nv;j++){
      const v=vMin+(vMax-vMin)*j/nv;
      for(let i=0;i<nu;i++){
        const u1=uMin+(uMax-uMin)*i/nu, u2=uMin+(uMax-uMin)*(i+1)/nu;
        E.linea3(f(u1,v),f(u2,v),{color:col,grosor:1});
      }
    }
  };

  E.vector3=function(p,v,op){
    op=op||{}; const c=L.ctx, col=colorVar(op.color||'--s4');
    const A=proy(p), B=proy([p[0]+v[0],p[1]+v[1],p[2]+v[2]]);
    c.save(); c.strokeStyle=col; c.fillStyle=col; c.lineWidth=op.grosor||2;
    c.beginPath(); c.moveTo(A[0],A[1]); c.lineTo(B[0],B[1]); c.stroke();
    const ang=Math.atan2(B[1]-A[1],B[0]-A[0]), l=9;
    c.beginPath(); c.moveTo(B[0],B[1]);
    c.lineTo(B[0]-l*Math.cos(ang-0.4),B[1]-l*Math.sin(ang-0.4));
    c.lineTo(B[0]-l*Math.cos(ang+0.4),B[1]-l*Math.sin(ang+0.4));
    c.closePath(); c.fill(); c.restore();
    if(op.etiqueta){
      c.save(); c.fillStyle=col; c.font='12px ui-monospace, Consolas, monospace';
      c.fillText(op.etiqueta,B[0]+7,B[1]-7); c.restore();
    }
  };

  E.punto3=function(p,op){
    op=op||{}; const c=L.ctx, P=proy(p);
    c.save(); c.fillStyle=colorVar(op.color||'--s2');
    c.beginPath(); c.arc(P[0],P[1],op.r||4,0,6.2832); c.fill(); c.restore();
  };

  E.texto3=function(p,s,op){
    op=op||{}; const c=L.ctx, P=proy(p);
    c.save(); c.fillStyle=colorVar(op.color||'--muted');
    c.font=(op.tam||12)+'px ui-monospace, Consolas, monospace';
    c.fillText(s,P[0]+(op.dx??5),P[1]+(op.dy??-5)); c.restore();
  };

  E.girar=function(dth,dph){ th+=dth; ph=Math.max(-1.4,Math.min(1.4,ph+dph)); E.redibujar(); };

  E.dibujar=function(fn){
    pintor=fn;
    const correr=()=>{L.medir(); E.limpiar(); pintor(E);};
    correr();
    addRelayout(L.canvas,correr);
    document.addEventListener('temacambiado',correr);
    if(o.rotable){
      let arrastrando=false,px=0,py=0;
      L.canvas.style.cursor='grab';
      L.canvas.addEventListener('pointerdown',e=>{arrastrando=true;px=e.clientX;py=e.clientY;L.canvas.setPointerCapture(e.pointerId);});
      L.canvas.addEventListener('pointermove',e=>{
        if(!arrastrando)return;
        E.girar((e.clientX-px)*0.01,(e.clientY-py)*0.006);
        px=e.clientX; py=e.clientY;
      });
      L.canvas.addEventListener('pointerup',()=>{arrastrando=false;});
    }
    return E;
  };
  E.redibujar=function(){ if(pintor){E.limpiar(); pintor(E);} };
  /* Igual que en Plano: fn(E,t) por cuadro. Si el espacio es `rotable`, el
     arrastre sigue funcionando mientras la animación corre — se puede girar
     el sólido mientras se genera. Ver montarAnimacion arriba. */
  E.animar=function(fn,op){
    if(o.rotable && !E._arrastreListo){
      E._arrastreListo=true;
      let arrastrando=false,px=0,py=0;
      L.canvas.style.cursor='grab';
      L.canvas.addEventListener('pointerdown',e=>{arrastrando=true;px=e.clientX;py=e.clientY;L.canvas.setPointerCapture(e.pointerId);});
      L.canvas.addEventListener('pointermove',e=>{
        if(!arrastrando)return;
        th+=(e.clientX-px)*0.01; ph=Math.max(-1.4,Math.min(1.4,ph+(e.clientY-py)*0.006));
        px=e.clientX; py=e.clientY;
      });
      L.canvas.addEventListener('pointerup',()=>{arrastrando=false;});
    }
    return montarAnimacion(E,L,mount,fn,op);
  };
  return E;
}

/* Decodifica entidades HTML ('&part;' -> '∂') a texto plano, sin dependencias.
   Uso: contenido de <text> en SVG, que no interpreta HTML como innerHTML. */
function decodificarEntidad(s){
  const d=document.createElement('textarea');
  d.innerHTML=s;
  return d.value;
}

/* Árbol de cajas y flechas en DOM+SVG. nodos: [{id,texto,fila,col}] con fila/col
   en una grilla lógica; aristas: [[idA,idB,'etiqueta']]. La etiqueta admite la
   misma clase de marcado que el texto de nodo (entidades HTML tipo '&part;'):
   como el nodo va por el() con html: y la arista es un <text> SVG (que no
   decodifica entidades via textContent), acá se decodifica antes de asignarla. */
function Arbol(mount, opts){
  const o=Object.assign({alto:260},opts||{});
  const wrap=el('div',{class:'arbol',style:'position:relative'});
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('style','position:absolute;inset:0;width:100%;height:100%;pointer-events:none');
  wrap.append(svg);
  const filas=Math.max(...o.nodos.map(n=>n.fila))+1;
  /* grid-column exige enteros, pero un padre centrado sobre un número PAR de
     hijos cae en una columna ".5" (p.ej. una raíz sobre 4 hojas en 0,1,2,3
     está en la columna 1.5). En vez de forzar a los módulos a inventar columnas
     enteras, acá se detecta si algún nodo pide una columna fraccionaria y, solo
     en ese caso, se duplica la resolución interna de la grilla (todo *2): los
     enteros existentes pasan a números pares y las mitades caen exactas en las
     columnas impares intermedias. Con cols enteras (caso mayoritario, y el que
     usa el fixture) el factor queda en 1 y el layout no cambia un píxel. */
  const colFactor=o.nodos.some(n=>Math.abs(n.col-Math.round(n.col))>1e-9)?2:1;
  const colEsc=n=>Math.round(n.col*colFactor);
  const cols=Math.max(...o.nodos.map(colEsc))+1;
  const grid=el('div',{style:`display:grid;grid-template-rows:repeat(${filas},1fr);`+
    `grid-template-columns:repeat(${cols},1fr);gap:.6rem 1rem;min-height:${o.alto}px;position:relative`});
  const porId={};
  o.nodos.forEach(n=>{
    const d=el('div',{class:'arbol-nodo',html:n.texto,
      style:`grid-row:${n.fila+1};grid-column:${colEsc(n)+1};justify-self:center;align-self:center`});
    porId[n.id]=d; grid.append(d);
  });
  wrap.append(grid); mount.append(wrap);

  const A={nodos:porId};
  function trazar(){
    svg.textContent='';
    const rw=wrap.getBoundingClientRect();
    (o.aristas||[]).forEach(([a,b,etq])=>{
      const ra=porId[a].getBoundingClientRect(), rb=porId[b].getBoundingClientRect();
      const x1=ra.left+ra.width/2-rw.left, y1=ra.bottom-rw.top;
      const x2=rb.left+rb.width/2-rw.left, y2=rb.top-rw.top;
      const l=document.createElementNS('http://www.w3.org/2000/svg','line');
      l.setAttribute('x1',x1); l.setAttribute('y1',y1);
      l.setAttribute('x2',x2); l.setAttribute('y2',y2);
      l.setAttribute('stroke',colorVar('--axis')); l.setAttribute('stroke-width','1.5');
      svg.append(l);
      if(etq){
        const t=document.createElementNS('http://www.w3.org/2000/svg','text');
        t.setAttribute('x',(x1+x2)/2+4); t.setAttribute('y',(y1+y2)/2);
        t.setAttribute('fill',colorVar('--muted')); t.setAttribute('font-size','11');
        t.textContent=decodificarEntidad(etq); svg.append(t);
      }
    });
  }
  A.resaltar=function(ids){
    Object.values(porId).forEach(d=>d.classList.remove('hl'));
    (ids||[]).forEach(id=>{ if(porId[id])porId[id].classList.add('hl'); });
  };
  A.limpiarMarcas=()=>A.resaltar([]);
  addRelayout(wrap,trazar);
  document.addEventListener('temacambiado',trazar);
  requestAnimationFrame(trazar);
  return A;
}

/* Tabla animable: celdas marcables por paso. */
function Tabla(mount, opts){
  const wrap=el('div',{class:'tabla-va'});
  const tabla=el('table');
  const thead=el('thead'), trh=el('tr');
  opts.columnas.forEach(c=>trh.append(el('th',{html:c})));
  thead.append(trh); tabla.append(thead);
  const tbody=el('tbody'); const celdas=[];
  opts.filas.forEach(fila=>{
    const tr=el('tr'), fs=[];
    fila.forEach(v=>{const td=el('td',{html:String(v)}); fs.push(td); tr.append(td);});
    celdas.push(fs); tbody.append(tr);
  });
  tabla.append(tbody); wrap.append(tabla); mount.append(wrap);
  return {
    celda:(f,c)=>celdas[f][c],
    marcar:(f,c,cls)=>{celdas[f][c].className=cls||'hl';},
    setTexto:(f,c,t)=>{celdas[f][c].innerHTML=String(t);},
    limpiarMarcas:()=>celdas.forEach(fs=>fs.forEach(td=>{td.className='';}))
  };
}

/* Gráfico de barras para distribuciones discretas. */
function Barras(mount, opts){
  const o=Object.assign({alto:240,formato:x=>x.toFixed(3)},opts||{});
  const L=lienzo(mount,o.alto);
  let valores=(o.valores||[]).slice(), marcas={};
  function pintar(){
    L.medir(); const c=L.ctx; c.clearRect(0,0,L.w,L.h);
    const n=valores.length; if(!n)return;
    const maxV=Math.max(...valores)||1;
    const mIzq=34, mAb=26, mArr=12;
    const ancho=(L.w-mIzq-8)/n, hUtil=L.h-mAb-mArr;
    c.save();
    c.strokeStyle=colorVar('--axis'); c.lineWidth=1;
    c.beginPath(); c.moveTo(mIzq,mArr); c.lineTo(mIzq,L.h-mAb); c.lineTo(L.w-4,L.h-mAb); c.stroke();
    c.font='11px ui-monospace, Consolas, monospace';
    valores.forEach((v,i)=>{
      const h=hUtil*v/maxV, x=mIzq+i*ancho+ancho*0.15, w=ancho*0.7, y=L.h-mAb-h;
      c.fillStyle=colorVar(marcas[i]==='ok'?'--s2':(marcas[i]==='hl'?'--s4':'--s1'));
      c.globalAlpha=marcas[i]?1:0.75;
      c.fillRect(x,y,w,h); c.globalAlpha=1;
      c.fillStyle=colorVar('--muted'); c.textAlign='center';
      c.fillText(String((o.etiquetas||[])[i]!==undefined?o.etiquetas[i]:i),x+w/2,L.h-mAb+13);
      if(marcas[i]){c.fillStyle=colorVar('--ink'); c.fillText(o.formato(v),x+w/2,y-4);}
    });
    c.restore();
  }
  pintar(); addRelayout(L.canvas,pintar);
  document.addEventListener('temacambiado',pintar);
  return {
    setValores:v=>{valores=v.slice(); pintar();},
    marcar:(i,cls)=>{marcas[i]=cls||'hl'; pintar();},
    limpiarMarcas:()=>{marcas={}; pintar();},
    canvas:L.canvas
  };
}
