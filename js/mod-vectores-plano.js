/* Clase 9: vectores en el plano cartesiano — definición, operaciones (suma,
   resta, producto por escalar) y su interpretación geométrica, y el vector
   entre dos puntos AB = B − A. */
registerModule({
  id:'vectores-plano', title:'Vectores en el plano', unidad:'II',
  lead:'Un vector no es un punto: es un desplazamiento, y eso cambia cómo se suman.',
  build(sec){

    /* ---------- Tarjeta 1: un vector es un desplazamiento (animada) ---------- */
    const c1=el('div',{class:'card'});
    c1.append(el('h3',{},'Un vector es un desplazamiento, no un punto'));
    c1.append(el('p',{},'Al caminar 3 cuadras hacia el noreste, lo que importa es ',el('b',{},'cuánto'),' y hacia ',el('b',{},'dónde'),' se avanzó — no desde qué esquina se partió. Un vector guarda exactamente esa información y nada más: magnitud y dirección.'));

    function suavizar(x){ return x*x*(3-2*x); }
    const ANCLAS=[[-2,-1],[0,0],[1.5,1.5],[-1,1.8]];
    const VD=[2,1];
    const nA=ANCLAS.length, tGlide=1.1, tPausa=0.9, tSeg=tGlide+tPausa;
    const leerC1=el('p',{class:'note'});
    const cajaP1=el('div',{class:'plot'}); c1.append(cajaP1);
    const P1=Plano(cajaP1,{xMin:-2.6,xMax:4,yMin:-1.6,yMax:3.3,alto:340,iso:true});
    P1.animar((P,t)=>{
      const i=Math.floor(t/tSeg)%nA, j=(i+1)%nA, tl=t%tSeg;
      const s=tl<tGlide?suavizar(tl/tGlide):1;
      const ax=ANCLAS[i][0]+(ANCLAS[j][0]-ANCLAS[i][0])*s;
      const ay=ANCLAS[i][1]+(ANCLAS[j][1]-ANCLAS[i][1])*s;
      P.ejes();
      ANCLAS.forEach(([px,py])=>P.punto(px,py,{color:'--grid',r:3}));
      P.punto(ax,ay,{color:'--s4',r:4});
      P.vector(ax,ay,ax+VD[0],ay+VD[1],{color:'--s7',grosor:3,etiqueta:'v'});
      leerC1.textContent='punto de partida = ('+ax.toFixed(2)+', '+ay.toFixed(2)+
        ') · v sigue siendo ('+VD[0]+', '+VD[1]+') en los cuatro casos';
    },{duracion:nA*tSeg});
    c1.append(leerC1);

    c1.append(el('p',{},'Los cuatro puntos grises son puntos de partida distintos, y en los cuatro la flecha es ',el('b',{},'idéntica'),': mismo largo, misma dirección. Eso es lo que se anota'));
    c1.append(el('div',{class:'formula',html:'$$\\vec v=(v_1,v_2),\\qquad \\mathbb{R}^2=\\{(v_1,v_2)\\mid v_1,v_2\\in\\mathbb{R}\\}$$'}));
    c1.append(el('p',{class:'note'},'Por eso un vector se puede mover «punta con cola» sin que deje de ser el mismo vector: lo único que define a $\\vec v$ son sus dos componentes, no dónde está dibujado.'));
    c1.append(el('p',{class:'fuente'},'Fuente: Clase 9 «Vectores en el plano cartesiano», Definición 2.1 (Geometría 2026-2).'));
    sec.append(c1);

    /* ---------- Tarjeta 2: el vector entre dos puntos (deslizadores) ---------- */
    const c2=el('div',{class:'card'});
    c2.append(el('h3',{},'El vector entre dos puntos: $\\vec{AB}=B-A$'));
    c2.append(el('p',{},'Si un vector empieza en $P(x_1,y_1)$ y termina en $Q(x_2,y_2)$, sus componentes son la resta punto final menos punto inicial. Al mover los deslizadores de $A$ y $B$ se observa que la flecha ',el('b',{},'AB'),' —la misma idea que en la tarjeta anterior— es siempre igual apenas se la traslada al origen.'));

    let Ax=1,Ay=1,Bx=4,By=3;
    const leerC2=el('p',{class:'note'});
    const cajaP2=el('div',{class:'plot'}); c2.append(cajaP2);
    const P2=Plano(cajaP2,{xMin:-5,xMax:5,yMin:-5,yMax:5,alto:340,iso:true});
    P2.dibujar(P=>{
      const dx=Bx-Ax, dy=By-Ay;
      P.ejes();
      P.punto(Ax,Ay,{color:'--s4',r:5,etiqueta:'A'});
      P.punto(Bx,By,{color:'--s4',r:5,etiqueta:'B'});
      P.vector(Ax,Ay,Bx,By,{color:'--s7',grosor:3.2,etiqueta:'AB'});
      P.parametrica(s=>[dx*s,dy*s],0,1,{color:'--grid',grosor:2,guiones:true});
      P.punto(dx,dy,{color:'--muted',r:3});
      P.texto(dx,dy,'misma AB, desde O',{color:'--muted',dx:8,dy:-8,tam:11});
    });
    function actualizarC2(){
      const dx=Bx-Ax, dy=By-Ay;
      leerC2.textContent='A=('+Ax+', '+Ay+')  B=('+Bx+', '+By+')  →  AB = B − A = ('+dx+', '+dy+')  ·  ‖AB‖ = '+Math.hypot(dx,dy).toFixed(3);
    }
    c2.append(el('div',{class:'controls'},
      el('label',{},'Ax:'), el('input',{type:'range',min:'-4',max:'4',step:'0.5',value:String(Ax),
        oninput:e=>{Ax=parseFloat(e.target.value); P2.redibujar(); actualizarC2();}}),
      el('label',{},'Ay:'), el('input',{type:'range',min:'-4',max:'4',step:'0.5',value:String(Ay),
        oninput:e=>{Ay=parseFloat(e.target.value); P2.redibujar(); actualizarC2();}}),
      el('label',{},'Bx:'), el('input',{type:'range',min:'-4',max:'4',step:'0.5',value:String(Bx),
        oninput:e=>{Bx=parseFloat(e.target.value); P2.redibujar(); actualizarC2();}}),
      el('label',{},'By:'), el('input',{type:'range',min:'-4',max:'4',step:'0.5',value:String(By),
        oninput:e=>{By=parseFloat(e.target.value); P2.redibujar(); actualizarC2();}})
    ));
    c2.append(leerC2); actualizarC2();

    c2.append(el('p',{class:'note'},'Por ejemplo, con $A(1,1)$ y $B(4,3)$: $\\vec{AB}=B-A=(4-1,\\,3-1)=(3,2)$ — al llevar los cuatro deslizadores a esos valores, el dibujo confirma el número.'));
    c2.append(el('div',{class:'formula',html:'$$\\vec{AB}=\\overrightarrow{PQ}=Q-P=(x_2-x_1,\\ y_2-y_1)$$'}));
    c2.append(el('p',{class:'note'},'La magnitud de $\\vec{AB}$ es simplemente la distancia entre $A$ y $B$: $\\|\\vec{AB}\\|=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$.'));
    c2.append(el('p',{class:'fuente'},'Fuente: Clase 9, Definición 2.2 «Vectores en el plano» y Definición 2.3 «Magnitud» (Geometría 2026-2).'));
    sec.append(c2);

    /* ---------- Tarjeta 3: suma y resta (animada) ---------- */
    const c3=el('div',{class:'card'});
    c3.append(el('h3',{},'Suma y resta: triángulo, paralelogramo y $-\\vec v$'));
    c3.append(el('p',{},'Sumar dos vectores es encadenar sus desplazamientos: primero uno, después el otro. Se observa cómo $\\vec v$ se desliza desde el origen hasta la punta de $\\vec u$ — la ',el('b',{},'regla del triángulo'),' — mientras se cierra un paralelogramo con lados $\\vec u$ y $\\vec v$: son la misma suma, vista de dos formas. Después, la misma flecha $-\\vec v$ arma la resta.'));

    let u1=3,u2=1,v1=1,v2=2.5;
    const leerC3=el('p',{class:'note'});
    const cajaP3=el('div',{class:'plot'}); c3.append(cajaP3);
    const P3=Plano(cajaP3,{xMin:-2,xMax:9,yMin:-2.5,yMax:8.5,alto:380,iso:true});
    P3.animar((P,t)=>{
      const s1_=Math.min(1,t/3);
      const bx=u1*s1_, by=u2*s1_;
      const s2_=Math.min(1,Math.max(0,(t-5)/2));
      const bx2=u1*s2_, by2=u2*s2_;
      P.ejes();
      P.vector(0,0,u1,u2,{color:'--s1',grosor:3,etiqueta:'u'});
      P.vector(bx,by,bx+v1,by+v2,{color:'--s2',grosor:3,etiqueta:t<3?'v':''});
      if(t>=3){
        P.parametrica(k=>[v1*k,v2*k],0,1,{color:'--s2',grosor:1.3,guiones:true});
        P.parametrica(k=>[v1+u1*k,v2+u2*k],0,1,{color:'--s1',grosor:1.3,guiones:true});
        P.vector(0,0,u1+v1,u2+v2,{color:'--s7',grosor:3.4,etiqueta:'u+v'});
      }
      if(t>=5){
        P.vector(bx2,by2,bx2-v1,by2-v2,{color:'--s8',grosor:2.4,etiqueta:t<7?'−v':''});
      }
      if(t>=7){
        P.vector(0,0,u1-v1,u2-v2,{color:'--s6',grosor:3.2,etiqueta:'u−v'});
      }
      leerC3.textContent='u=('+u1+', '+u2+')  v=('+v1+', '+v2+')  →  u+v=('+(u1+v1)+', '+(u2+v2)+')   u−v=('+(u1-v1)+', '+(u2-v2)+')';
    },{duracion:9});
    c3.append(leerC3);

    c3.append(el('div',{class:'controls'},
      el('label',{},'u₁:'), el('input',{type:'range',min:'-4',max:'4',step:'0.5',value:String(u1),
        oninput:e=>{u1=parseFloat(e.target.value); actualizarC3text();}}),
      el('label',{},'u₂:'), el('input',{type:'range',min:'-4',max:'4',step:'0.5',value:String(u2),
        oninput:e=>{u2=parseFloat(e.target.value); actualizarC3text();}}),
      el('label',{},'v₁:'), el('input',{type:'range',min:'-4',max:'4',step:'0.5',value:String(v1),
        oninput:e=>{v1=parseFloat(e.target.value); actualizarC3text();}}),
      el('label',{},'v₂:'), el('input',{type:'range',min:'-4',max:'4',step:'0.5',value:String(v2),
        oninput:e=>{v2=parseFloat(e.target.value); actualizarC3text();}})
    ));
    function actualizarC3text(){
      leerC3.textContent='u=('+u1+', '+u2+')  v=('+v1+', '+v2+')  →  u+v=('+(u1+v1)+', '+(u2+v2)+')   u−v=('+(u1-v1)+', '+(u2-v2)+')';
    }

    c3.append(el('div',{class:'formula',html:'$$\\vec u+\\vec v=(u_1+v_1,\\ u_2+v_2)$$'}));
    c3.append(el('p',{},'Restar es sumar el opuesto: $\\vec u-\\vec v=\\vec u+(-\\vec v)$. En el mismo dibujo, $-\\vec v$ sale de la punta de $\\vec u$ apuntando al revés que $\\vec v$, y su propia punta marca $\\vec u-\\vec v$.'));
    c3.append(el('div',{class:'formula',html:'$$\\vec u-\\vec v=\\vec u+(-\\vec v)=(u_1-v_1,\\ u_2-v_2)$$'}));
    c3.append(el('p',{class:'note'},'Que el triángulo y el paralelogramo den el mismo resultado explica de paso por qué la suma es conmutativa: da lo mismo ir primero por $\\vec u$ y después por $\\vec v$ que al revés — los dos caminos terminan en la misma punta del paralelogramo.'));
    c3.append(el('p',{class:'fuente'},'Fuente: Clase 9, «Operaciones entre vectores» (suma) y Reflexión «¿Qué representa geométricamente la suma entre dos vectores?» (Geometría 2026-2).'));
    sec.append(c3);

    /* ---------- Tarjeta 4: producto por un escalar (deslizador) ---------- */
    const c4=el('div',{class:'card'});
    c4.append(el('h3',{},'Producto por un escalar: estirar, achicar y dar la vuelta'));
    c4.append(el('p',{},'Multiplicar $\\vec v$ por un número real $\\lambda$ escala su largo por $|\\lambda|$ y, si $\\lambda$ es negativo, invierte su sentido $180^\\circ$. Al mover el deslizador por valores negativos se ve al vector ',el('b',{},'dar la vuelta'),' al cruzar $\\lambda=0$.'));

    let lam=1.5; const vFijo=[2,1];
    const leerC4=el('p',{class:'note'});
    const cajaP4=el('div',{class:'plot'}); c4.append(cajaP4);
    const P4=Plano(cajaP4,{xMin:-6.5,xMax:6.5,yMin:-4,yMax:4,alto:340,iso:true});
    P4.dibujar(P=>{
      P.ejes();
      P.vector(0,0,vFijo[0],vFijo[1],{color:'--s1',grosor:2.6,etiqueta:'v'});
      const lx=lam*vFijo[0], ly=lam*vFijo[1];
      if(Math.abs(lam)>1e-6){
        const col=lam<0?'--s8':'--s7';
        P.vector(0,0,lx,ly,{color:col,grosor:3.2,etiqueta:'λv'});
      } else {
        P.punto(0,0,{color:'--muted',r:5,etiqueta:'λv = 0⃗'});
      }
    });
    function actualizarC4(){
      const lx=lam*vFijo[0], ly=lam*vFijo[1];
      const magV=Math.hypot(vFijo[0],vFijo[1]);
      let signo=' · λ>0: mismo sentido que v';
      if(lam<0) signo=' · λ<0: apunta al revés de v';
      else if(Math.abs(lam)<1e-6) signo=' · λ=0: colapsa al origen';
      leerC4.textContent='λ = '+lam.toFixed(1)+'  ·  λv = ('+lx.toFixed(1)+', '+ly.toFixed(1)+')  ·  ‖v‖ = '+magV.toFixed(3)+'  ·  ‖λv‖ = '+Math.abs(lam*magV).toFixed(3)+signo;
    }
    c4.append(el('div',{class:'controls'},
      el('label',{},'λ:'),
      el('input',{type:'range',min:'-3',max:'3',step:'0.1',value:String(lam),
        oninput:e=>{ lam=parseFloat(e.target.value); P4.redibujar(); actualizarC4(); }})
    ));
    c4.append(leerC4); actualizarC4();

    c4.append(el('div',{class:'formula',html:'$$\\lambda\\vec v=(\\lambda v_1,\\ \\lambda v_2),\\qquad \\|\\lambda\\vec v\\|=|\\lambda|\\,\\|\\vec v\\|$$'}));
    c4.append(el('p',{class:'note'},'Con $\\lambda=-1$ el vector no cambia de largo, solo de sentido: es exactamente el $-\\vec v$ que usamos en la tarjeta anterior para armar la resta. Con $\\lambda=0$ no queda ningún vector — colapsa al vector nulo $\\vec 0$.'));
    c4.append(el('p',{class:'fuente'},'Fuente: Clase 9, «Operaciones entre vectores» (multiplicación por un escalar) y Reflexión «¿Qué características de un vector se pueden modificar al multiplicarlo por un escalar?» (Geometría 2026-2).'));
    sec.append(c4);
  }
});
