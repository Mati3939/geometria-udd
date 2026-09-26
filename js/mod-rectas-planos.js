/* Intersección de una recta con un plano y de dos planos entre sí, el ángulo
   entre una recta y un plano, y la proyección ortogonal de una recta sobre un
   plano. Las cuentas de las tarjetas están verificadas aparte con Node antes
   de publicarse. */
registerModule({
  id:'rectas-planos',
  title:'Relaciones entre rectas y planos',
  unidad:'III',
  lead:'Cómo se cruzan, se apoyan y se proyectan las rectas y los planos entre sí.',
  build(sec){

    function leyenda(mount,items){
      const L=el('div',{class:'legend'});
      items.forEach(([col,txt])=>L.append(el('span',{},
        el('i',{class:'sw',style:'background:var('+col+')'}),txt)));
      mount.append(L);
    }

    /* Álgebra vectorial mínima en R³, y un helper para parametrizar un plano
       a partir de un punto y dos direcciones ortonormales dentro de él. */
    const dot3=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
    const cross3=(a,b)=>[a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
    const norm3=a=>Math.sqrt(dot3(a,a));
    const add3=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
    const sub3=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
    const esc3=(a,k)=>[a[0]*k,a[1]*k,a[2]*k];
    const pt3=p=>'('+p.map(x=>x.toFixed(2)).join(', ')+')';
    function plano3(base,e1,e2){
      return (u,v)=>[base[0]+e1[0]*u+e2[0]*v, base[1]+e1[1]*u+e2[1]*v, base[2]+e1[2]*u+e2[2]*v];
    }
    /* Arco entre dos direcciones UNITARIAS u1,u2, centrado en `centro` y de
       radio r: interpolación esférica (slerp) para que quede sobre el círculo
       que las contiene, no sobre la cuerda recta entre ambas. */
    function slerp3(u1,u2,t){
      const om=Math.acos(Math.max(-1,Math.min(1,dot3(u1,u2))));
      if(om<1e-6)return u1;
      const s=Math.sin(om), a=Math.sin((1-t)*om)/s, b=Math.sin(t*om)/s;
      return [u1[0]*a+u2[0]*b,u1[1]*a+u2[1]*b,u1[2]*a+u2[2]*b];
    }
    function arco3(E,centro,u1,u2,r,op){
      E.curva3(t=>{const d=slerp3(u1,u2,t); return [centro[0]+d[0]*r,centro[1]+d[1]*r,centro[2]+d[2]*r];},0,1,op);
    }
    /* E.texto3 de math.js ignora cualquier dx/dy que se le pase: siempre usa
       un desplazamiento fijo (+5,-5) en píxeles de pantalla (a diferencia de
       Plano.texto, que sí respeta dx/dy). Con dos vectores que en algún
       momento coinciden exactamente —v y n a los 90° de la tarjeta 3, P y Q
       en el instante en que la recta cruza el plano en la tarjeta 4— sus
       etiquetas quedan apiladas una encima de la otra. Se rodea acá con un
       texto propio que sí admite un desplazamiento cualquiera. */
    function textoDesp(E,p,s,dx,dy,color){
      const P=E.proy(p), c=E.ctx;
      c.save(); c.fillStyle=colorVar(color||'--muted');
      c.font='12px ui-monospace, Consolas, monospace';
      c.fillText(s,P[0]+dx,P[1]+dy);
      c.restore();
    }

    /* El plano π: x+y+z=2 se usa en las tarjetas 1, 3 y 4, con normal n y un
       punto A sobre él; e1,e2 son una base ortonormal DENTRO del plano (⟂ n
       entre sí y con n), y sirven tanto para dibujar un parche del plano como
       para descomponer un vector en su parte «dentro del plano» y su parte
       «a lo largo de la normal». Verificado aparte: e1·n=0, e2·n=0, e1·e2=0,
       los tres son unitarios. */
    const nP=[1,1,1], dP=2, A=[2,0,0];
    const nHat=[1/Math.sqrt(3),1/Math.sqrt(3),1/Math.sqrt(3)];
    const e1=[1/Math.SQRT2,-1/Math.SQRT2,0];
    const e2=[1/Math.sqrt(6),1/Math.sqrt(6),-2/Math.sqrt(6)];
    /* dirección unitaria que va de «tangente al plano» (α=0) a «normal al
       plano» (α=90°); útil en las tarjetas 1 y 3. */
    function vAngulo(aGrad){
      const a=aGrad*Math.PI/180;
      return add3(esc3(e1,Math.cos(a)), esc3(nHat,Math.sin(a)));
    }

    /* ---------- Tarjeta 1: intersección entre una recta y un plano ---------- */
    const c1=el('div',{class:'card'});
    c1.append(el('h3',{},'Intersección entre una recta y un plano'));
    c1.append(el('p',{},'Sustituir las ecuaciones paramétricas de la recta, $(x,y,z)=P_0+t\\vec v$, en la ecuación del plano $ax+by+cz=d$ deja una sola ecuación con una sola incógnita, $t$. Según cuántas soluciones tenga esa ecuación, la recta y el plano quedan en una de tres relaciones. El deslizador inclina la dirección de la recta; el botón cambia si su punto de partida está sobre el plano o fuera de él.'));

    let alphaC1=22, origenC1='fuera';
    const P0fuera=[0,0,0], P0plano=A;   /* A ya está sobre π */
    function estadoC1(){
      const P0=origenC1==='fuera'?P0fuera:P0plano;
      const v=vAngulo(alphaC1);
      const nv=dot3(nP,v);
      if(Math.abs(nv)<1e-6){
        const enPlano=Math.abs(dot3(nP,P0)-dP)<1e-6;
        return {tipo:enPlano?'contenida':'paralela', P0, v};
      }
      const t=(dP-dot3(nP,P0))/nv;
      return {tipo:Math.abs(t)<=4.4?'secante':'secante-lejos', t, P0, v};
    }
    const cajaE1=el('div',{class:'plot'}); c1.append(cajaE1);
    const E1=Espacio(cajaE1,{alto:380,escala:42});
    E1.dibujar(E=>{
      const st=estadoC1();
      E.ejes3({largo:3});
      E.superficie(plano3(A,e1,e2),{uMin:-3.6,uMax:3.6,vMin:-3.6,vMax:3.6,nu:7,nv:7,color:'--axis'});
      const col=st.tipo==='paralela'?'--s6':(st.tipo==='contenida'?'--s2':'--s7');
      E.curva3(t=>add3(st.P0,esc3(st.v,t)),-4.5,4.5,{color:col,grosor:2.4});
      E.punto3(st.P0,{color:col,r:3.5});
      if(st.tipo==='secante'){
        const P=add3(st.P0,esc3(st.v,st.t));
        E.punto3(P,{color:'--s8',r:5});
        textoDesp(E,P,'punto de corte',12,-18,'--s8');
      }
    });
    const leerC1=lectura(c1);
    const reglaC1=textoVivo(c1);
    function actualizarC1(){
      E1.redibujar();
      const st=estadoC1();
      const puntoTxt=st.tipo==='secante'?'('+add3(st.P0,esc3(st.v,st.t)).map(x=>x.toFixed(1)).join(', ')+')':'—';
      leerC1.set([
        ['α', alphaC1+'°'],
        ['P0', origenC1==='fuera'?'fuera del plano':'sobre el plano'],
        ['v·n', dot3(nP,st.v).toFixed(3)],
        ['t de corte', st.t!==undefined?st.t.toFixed(2):'—'],
        ['corte', puntoTxt]
      ]);
      if(st.tipo==='secante'){
        reglaC1.set('La ecuación en $t$ queda $t=(d-P_0\\cdot\\vec n)/(\\vec v\\cdot\\vec n)$, con una única solución: la recta corta al plano en un solo punto, marcado en rojo.');
      } else if(st.tipo==='secante-lejos'){
        reglaC1.set('Sigue habiendo un único punto de corte —$\\vec v\\cdot\\vec n$ no es cero—, pero al acercar la dirección de la recta a la del plano ese punto se aleja cada vez más, hasta salir de la vista.');
      } else if(st.tipo==='paralela'){
        reglaC1.set('La dirección de la recta quedó dentro del plano ($\\vec v\\cdot\\vec n=0$) pero el punto de partida no está en él: la ecuación en $t$ se reduce a una igualdad falsa, así que no hay ningún punto en común.');
      } else {
        reglaC1.set('La dirección de la recta quedó dentro del plano y además el punto de partida sí está en él: la ecuación en $t$ se cumple para cualquier valor, así que la recta entera queda contenida en el plano.');
      }
    }
    controlValor(c1,{label:'α (inclinación de v)',min:-40,max:40,paso:1,valor:alphaC1,unidad:'°',
      onChange:v=>{ alphaC1=v; actualizarC1(); }});
    btnGroup(c1,[{label:'P0 fuera del plano',value:'fuera'},{label:'P0 sobre el plano',value:'plano'}],
      v=>{ origenC1=v; actualizarC1(); });
    reglaC1.calibrar([
      'La ecuación en $t$ queda $t=(d-P_0\\cdot\\vec n)/(\\vec v\\cdot\\vec n)$, con una única solución: la recta corta al plano en un solo punto, marcado en rojo.',
      'Sigue habiendo un único punto de corte —$\\vec v\\cdot\\vec n$ no es cero—, pero al acercar la dirección de la recta a la del plano ese punto se aleja cada vez más, hasta salir de la vista.',
      'La dirección de la recta quedó dentro del plano ($\\vec v\\cdot\\vec n=0$) pero el punto de partida no está en él: la ecuación en $t$ se reduce a una igualdad falsa, así que no hay ningún punto en común.',
      'La dirección de la recta quedó dentro del plano y además el punto de partida sí está en él: la ecuación en $t$ se cumple para cualquier valor, así que la recta entera queda contenida en el plano.'
    ]);
    actualizarC1();

    leyenda(c1,[['--axis','plano π'],['--s7','recta secante'],['--s6','recta paralela'],['--s2','recta contenida'],['--s8','punto de corte']]);

    c1.append(el('div',{class:'formula',html:'$$(\\vec v\\cdot\\vec n)\\,t=d-P_0\\cdot\\vec n$$'}));
    c1.append(el('p',{class:'note'},'Los tres casos salen directo de esa ecuación lineal en $t$: coeficiente distinto de cero y hay una solución (secante); coeficiente cero y el lado derecho también, cualquier $t$ sirve (contenida); coeficiente cero y el lado derecho no, ninguna solución (paralela).'));
    sec.append(c1);

    /* ---------- Tarjeta 2: intersección de dos planos ---------- */
    const c2=el('div',{class:'card'});
    c2.append(el('h3',{},'Intersección de dos planos'));
    c2.append(el('p',{},'Dos planos no paralelos se cortan en una recta completa, no en un punto. Su dirección es perpendicular a las dos normales a la vez, así que se obtiene con un producto cruz: $\\vec v=\\vec n_1\\times\\vec n_2$. El deslizador mueve un punto a lo largo de esa recta común, y la lectura confirma que satisface las dos ecuaciones al mismo tiempo, para cualquier posición.'));

    const n1C2=nP, d1C2=dP;                 /* retoma el plano π de la tarjeta 1 */
    const n2C2=[1,-1,2], d2C2=1;            /* un segundo plano σ */
    const dirC2=cross3(n1C2,n2C2);          /* (3,−1,−2), verificado aparte */
    const PcC2=[0,1,1];                     /* un punto de π ∩ σ, verificado aparte */
    const f2e1=[1/Math.SQRT2,1/Math.SQRT2,0];
    const f2e2=[-1/Math.sqrt(3),1/Math.sqrt(3),1/Math.sqrt(3)];
    let tC2=0;
    const cajaE2=el('div',{class:'plot'}); c2.append(cajaE2);
    const E2=Espacio(cajaE2,{alto:380,escala:46});
    E2.dibujar(E=>{
      E.ejes3({largo:3});
      E.superficie(plano3(PcC2,e1,e2),{uMin:-2.2,uMax:2.2,vMin:-2.2,vMax:2.2,nu:6,nv:6,color:'--s1'});
      E.superficie(plano3(PcC2,f2e1,f2e2),{uMin:-2.2,uMax:2.2,vMin:-2.2,vMax:2.2,nu:6,nv:6,color:'--s6'});
      E.curva3(t=>add3(PcC2,esc3(dirC2,t)),-1.4,1.4,{color:'--s8',grosor:2.6});
      E.punto3(add3(PcC2,esc3(dirC2,tC2)),{color:'--s4',r:5.5});
    });
    const leerC2=lectura(c2);
    function actualizarC2(){
      E2.redibujar();
      const P=add3(PcC2,esc3(dirC2,tC2));
      leerC2.set([
        ['t', tC2.toFixed(2)],
        ['punto', pt3(P)],
        ['n1 · punto', dot3(n1C2,P).toFixed(2)+' (= '+d1C2+')'],
        ['n2 · punto', dot3(n2C2,P).toFixed(2)+' (= '+d2C2+')']
      ]);
    }
    controlValor(c2,{label:'t',min:-1.4,max:1.4,paso:0.05,valor:tC2,unidad:'',
      onChange:v=>{ tC2=v; actualizarC2(); }});
    actualizarC2();

    leyenda(c2,[['--s1','plano π: x+y+z=2'],['--s6','plano σ: x−y+2z=1'],['--s8','recta π ∩ σ'],['--s4','punto sobre la recta común']]);

    c2.append(el('div',{class:'formula',html:'$$\\vec v=\\vec n_1\\times\\vec n_2$$'}));
    c2.append(el('p',{class:'note'},'Con $\\vec n_1=(1,1,1)$ y $\\vec n_2=(1,-1,2)$ queda $\\vec v=(1\\cdot2-1\\cdot(-1),\\ 1\\cdot1-1\\cdot2,\\ 1\\cdot(-1)-1\\cdot1)=(3,-1,-2)$. Falta un punto cualquiera de la recta: resolviendo las dos ecuaciones juntas —dos ecuaciones y tres incógnitas, así que queda una variable libre— uno de los puntos posibles es $(0,1,1)$, que en la lectura de arriba cumple las dos ecuaciones para cualquier $t$.'));
    c2.append(el('p',{class:'note'},'Si $\\vec n_1$ y $\\vec n_2$ fueran paralelos, $\\vec v$ daría el vector nulo: los planos serían paralelos entre sí (o el mismo plano) y no tendrían una recta en común.'));
    sec.append(c2);

    /* ---------- Tarjeta 3: ángulo entre una recta y un plano ---------- */
    const c3=el('div',{class:'card'});
    c3.append(el('h3',{},'Ángulo entre una recta y un plano'));
    c3.append(el('p',{},'El ángulo $\\varphi$ entre una recta y un plano se mide contra la sombra que la recta proyecta sobre el plano —el ángulo verde del dibujo—, no contra la normal. Como el producto punto da directamente el ángulo $\\theta$ contra la normal —el ángulo gris—, y $\\varphi$ y $\\theta$ son complementarios, la fórmula usa seno en vez de coseno.'));

    let alphaC3=35;
    const cajaE3=el('div',{class:'plot'}); c3.append(cajaE3);
    const E3=Espacio(cajaE3,{alto:380,escala:48});
    E3.dibujar(E=>{
      E.ejes3({largo:2.4});
      E.superficie(plano3(A,e1,e2),{uMin:-2,uMax:2,vMin:-2,vMax:2,nu:6,nv:6,color:'--axis'});
      const v=vAngulo(alphaC3);
      const a=alphaC3*Math.PI/180;
      const vEsc=esc3(v,1.7);
      const nEsc=esc3(nHat,1.7);
      const projEsc=esc3(e1,1.7*Math.cos(a));
      /* v y n coinciden exactamente en α=90°, y v y su proyección coinciden
         exactamente en α=0°: se dibujan sin la etiqueta propia de vector3
         (que usa un offset fijo) y se rotulan aparte, cada una con un
         desplazamiento distinto, para que las tres etiquetas no queden
         apiladas cuando dos flechas se superponen. */
      E.vector3(A,vEsc,{color:'--s7'});
      E.vector3(A,nEsc,{color:'--s6'});
      arco3(E,A,nHat,v,0.55,{color:'--muted'});
      if(Math.cos(a)>0.02){
        E.vector3(A,projEsc,{color:'--s2'});
        E.linea3(add3(A,vEsc),add3(A,projEsc),{color:'--axis',guiones:true});
        arco3(E,A,e1,v,0.85,{color:'--s4'});
        textoDesp(E,add3(A,projEsc),'proyección de v',-30,20,'--s2');
      }
      textoDesp(E,add3(A,vEsc),'v',-22,8,'--s7');
      textoDesp(E,add3(A,nEsc),'n',12,-10,'--s6');
    });
    const leerC3=lectura(c3);
    function actualizarC3(){
      E3.redibujar();
      const v=vAngulo(alphaC3);
      const sinPhi=Math.abs(dot3(v,nP))/(norm3(v)*norm3(nP));
      const phi=Math.asin(Math.min(1,sinPhi))*180/Math.PI;
      leerC3.set([
        ['α (dibujo)', alphaC3+'°'],
        ['sen φ (fórmula)', sinPhi.toFixed(3)],
        ['φ (fórmula)', phi.toFixed(1)+'°'],
        ['θ = 90°−φ', (90-phi).toFixed(1)+'°']
      ]);
    }
    controlValor(c3,{label:'α',min:0,max:90,paso:1,valor:alphaC3,unidad:'°',
      onChange:v=>{ alphaC3=v; actualizarC3(); }});
    actualizarC3();

    leyenda(c3,[['--axis','plano π'],['--s7','v (dirección de la recta)'],['--s6','n (normal del plano)'],['--s2','proyección de v sobre π'],['--s4','φ (recta–plano)'],['--muted','θ (v, n)']]);

    c3.append(el('div',{class:'formula',html:'$$\\operatorname{sen}\\varphi=\\dfrac{|\\vec v\\cdot\\vec n|}{\\|\\vec v\\|\\,\\|\\vec n\\|}$$'}));
    c3.append(el('p',{class:'note'},'El ángulo $\\varphi$ (dibujo) y el que entrega la fórmula coinciden en todo el recorrido del deslizador. En $\\alpha=0°$ la recta queda acostada sobre el plano y $\\varphi=0°$; en $\\alpha=90°$ la recta queda perpendicular al plano, su sombra se reduce a un punto —el vector verde desaparece— y $\\varphi=90°$.'));
    sec.append(c3);

    /* ---------- Tarjeta 4: proyección de una recta sobre un plano ---------- */
    const c4=el('div',{class:'card'});
    c4.append(el('h3',{},'Proyección de una recta sobre un plano'));
    c4.append(el('p',{},'La sombra de una recta sobre un plano, dejada por una luz perpendicular al plano, es otra recta —salvo que la original sea perpendicular al plano, caso en que la sombra se reduce a un punto—. Cada punto de la recta se proyecta restándole la parte de su posición que corre a lo largo de la normal, la necesaria para que la coordenada quede exactamente sobre $\\pi$: $\\operatorname{proy}_\\pi(X)=X-\\frac{\\vec n\\cdot X-d}{\\|\\vec n\\|^2}\\vec n$. Al aplicar esa misma resta a dos puntos cualesquiera de la recta, la parte que depende de $t$ se comporta igual en los dos, así que la sombra completa es otra recta.'));

    const P0C4=[0,0,0], wC4=[2,1,-1];
    function proyC4(X){
      const k=(dot3(nP,X)-dP)/dot3(nP,nP);
      return sub3(X,esc3(nP,k));
    }
    const wProyC4=sub3(wC4,esc3(nP,dot3(wC4,nP)/dot3(nP,nP)));
    const QbaseC4=proyC4(P0C4);
    let tC4=0.6;
    const cajaE4=el('div',{class:'plot'}); c4.append(cajaE4);
    const E4=Espacio(cajaE4,{alto:380,escala:36});
    E4.dibujar(E=>{
      E.ejes3({largo:2.6});
      E.superficie(plano3(A,e1,e2),{uMin:-4,uMax:4,vMin:-4,vMax:4,nu:8,nv:8,color:'--axis'});
      E.curva3(t=>add3(P0C4,esc3(wC4,t)),-1.3,1.9,{color:'--s7',grosor:2.2});
      E.curva3(t=>add3(QbaseC4,esc3(wProyC4,t)),-1.3,1.9,{color:'--s2',grosor:2.6});
      const P=add3(P0C4,esc3(wC4,tC4)), Q=add3(QbaseC4,esc3(wProyC4,tC4));
      E.linea3(P,Q,{color:'--axis',guiones:true});
      E.punto3(P,{color:'--s7',r:5});
      E.punto3(Q,{color:'--s2',r:5});
      /* P y Q coinciden exactamente en el instante en que la recta cruza el
         plano (t=1 acá): offsets distintos para que las etiquetas no queden
         una encima de la otra en ese instante. */
      textoDesp(E,P,'P',-18,-12,'--s7');
      textoDesp(E,Q,'Q',12,16,'--s2');
    });
    const leerC4=lectura(c4);
    function actualizarC4(){
      E4.redibujar();
      const P=add3(P0C4,esc3(wC4,tC4)), Q=add3(QbaseC4,esc3(wProyC4,tC4));
      leerC4.set([
        ['t', tC4.toFixed(2)],
        ['P (en la recta)', pt3(P)],
        ['Q = proy(P)', pt3(Q)],
        ['n · Q', dot3(nP,Q).toFixed(2)+' (= '+dP+')']
      ]);
    }
    controlValor(c4,{label:'t',min:-1.1,max:1.5,paso:0.1,valor:tC4,unidad:'',
      onChange:v=>{ tC4=v; actualizarC4(); }});
    actualizarC4();

    leyenda(c4,[['--axis','plano π · segmento de proyección'],['--s7','recta original (P)'],['--s2','recta proyectada (Q)']]);

    c4.append(el('div',{class:'formula',html:'$$\\vec v_\\pi=\\vec v-\\dfrac{\\vec v\\cdot\\vec n}{\\|\\vec n\\|^2}\\,\\vec n$$'}));
    c4.append(el('p',{class:'note'},'Con $P_0=(0,0,0)$ sobre la recta y $\\vec n=(1,1,1)$, $d=2$: $\\operatorname{proy}_\\pi(P_0)=(0,0,0)-\\frac{0-2}{3}(1,1,1)=(\\frac23,\\frac23,\\frac23)$, el punto de partida de la recta proyectada. Con $\\vec v=(2,1,-1)$, su dirección proyectada es $\\vec v_\\pi=(2,1,-1)-\\frac{2}{3}(1,1,1)=(\\frac43,\\frac13,-\\frac53)$: la componente de $\\vec v$ que ya vivía dentro del plano.'));
    c4.append(el('p',{class:'note'},'Al mover $t$, $P$ recorre la recta original y $Q$ su sombra, siempre unidos por el segmento perpendicular al plano. En el instante en que $P$ cruza el propio plano —acá, $t=1$— la sombra pasa exactamente por debajo de él: $Q$ coincide con $P$.'));
    sec.append(c4);
  }
});
