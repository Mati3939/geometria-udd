/* Ecuaciones de la recta: vectorial, parametrica y simetrica.

   La idea central: un punto y una dirección fijan la recta completa, y las
   tres formas de escribirla son la misma información contada de tres modos.
   El ejemplo del dron (P0(2,1), v=(3,-1) por minuto) se usa en las tres
   primeras tarjetas para que el parámetro t se lea, literalmente, como
   tiempo. Las cuentas de las tarjetas están verificadas aparte con Node. */
registerModule({
  id:'recta',
  title:'Ecuaciones de la recta',
  unidad:'II',
  lead:'Un punto y una dirección: con eso queda fijada una recta entera, y las tres formas de escribirla dicen lo mismo.',
  build(sec){

    /* Traza una recta de borde a borde de la ventana visible, sea cual sea
       su dirección (incluida la vertical, con a=0). */
    function rectaCompleta(P,P0,v,op){
      const w=P.ventana();
      if(Math.abs(v[0])<1e-9){
        P.parametrica(s=>[P0[0], w.yMin+(w.yMax-w.yMin)*s],0,1,op);
      } else {
        const t0=(w.xMin-P0[0])/v[0], t1=(w.xMax-P0[0])/v[0];
        P.parametrica(s=>{const t=t0+(t1-t0)*s; return [P0[0]+v[0]*t, P0[1]+v[1]*t];},0,1,op);
      }
    }

    const num=n=>(n<0?'−'+(-n):String(n));

    /* Dibuja el vector director como flecha desde P0, y además sus dos
       catetos: el tramo horizontal mide a (avance en x, azul) y el tramo
       vertical mide b (avance en y, verde). Es la respuesta directa a «¿qué
       es a y qué es b?»: quedan a la vista como los lados de un triángulo,
       no solo nombrados en una fórmula. */
    function dibujarDirector(P,P0,v){
      const esq=[P0[0]+v[0],P0[1]];
      P.parametrica(s=>[P0[0]+v[0]*s,P0[1]],0,1,{color:'--s1',grosor:3});
      P.parametrica(s=>[esq[0],P0[1]+v[1]*s],0,1,{color:'--s2',grosor:3});
      P.vector(P0[0],P0[1],P0[0]+v[0],P0[1]+v[1],{color:'--s4',grosor:2.4});
      const arriba=v[1]<0;
      /* «a» se rotula cerca de la esquina (no del lado de P0), para no
         pisarse con el rótulo de P0. */
      P.texto(P0[0]+v[0]*0.62,P0[1],'a = '+num(v[0]),{color:'--s1',dx:-10,dy:arriba?-10:17});
      P.texto(esq[0],P0[1]+v[1]/2,'b = '+num(v[1]),{color:'--s2',dx:v[0]>=0?9:-42,dy:4});
      /* la etiqueta de v se aleja del triángulo (a,b), hacia el lado opuesto
         a la esquina, para no quedar encima de esos catetos */
      const cornerCross=-v[1]*v[0];
      const perp=cornerCross>0?[v[1],-v[0]]:[-v[1],v[0]];
      const magPerp=Math.hypot(perp[0],perp[1])||1;
      const mv=[P0[0]+v[0]*0.5+0.9*perp[0]/magPerp, P0[1]+v[1]*0.5+0.9*perp[1]/magPerp];
      P.texto(mv[0],mv[1],'v = ('+num(v[0])+', '+num(v[1])+')',{color:'--s4',dx:-42,dy:4});
      P.texto(P0[0],P0[1],'P0',{color:'--s4',dx:-30,dy:arriba?18:-12});
    }

    function leyenda(mount,items){
      const L=el('div',{class:'legend'});
      items.forEach(([col,txt])=>L.append(el('span',{},
        el('i',{class:'sw',style:'background:var('+col+')'}),txt)));
      mount.append(L);
    }

    const P0G=[2,1], vG=[3,-1];   /* el dron: P0(2,1), v=(3,-1) por minuto */

    /* ---------- Tarjeta 1: la ecuación vectorial, con t como el tiempo ---------- */
    const c1=el('div',{class:'card'});
    c1.append(el('h3',{},'La recta como un recorrido: la ecuación vectorial'));
    c1.append(el('p',{},'Un dron despega y avanza siempre en línea recta: parte del punto $P_0(2,1)$ y cada minuto se desplaza $\\vec v=(3,-1)$. Al minuto $t$ está en $P(t)=P_0+t\\vec v$, y esa fórmula es la recta entera: no solo el tramo ya recorrido, también los minutos anteriores al despegue y los que vienen después.'));

    const cajaP1=el('div',{class:'plot'}); c1.append(cajaP1);
    const P1=Plano(cajaP1,{xMin:-9,xMax:13,yMin:-4,yMax:6,alto:340,iso:true});
    const leerC1=lectura(c1);
    P1.animar((P,t)=>{
      const tm=t-3;   /* t recorre −3..3: el dron existía antes de t=0 también */
      const x=P0G[0]+vG[0]*tm, y=P0G[1]+vG[1]*tm;
      P.ejes();
      rectaCompleta(P,P0G,vG,{color:'--grid',grosor:1.6});
      dibujarDirector(P,P0G,vG);
      P.parametrica(s=>[P0G[0]+vG[0]*tm*s, P0G[1]+vG[1]*tm*s],0,1,{color:'--s7',grosor:1.6,guiones:true});
      P.punto(P0G[0],P0G[1],{color:'--s4',r:4});
      P.punto(x,y,{color:'--s7',r:5});
      leerC1.set([
        ['t (min)', tm.toFixed(2)],
        ['P(t)', '('+x.toFixed(2)+', '+y.toFixed(2)+')']
      ]);
    },{duracion:6});

    leyenda(c1,[['--s4','P0 y el director v'],['--s1','a (avance en x)'],['--s2','b (avance en y)'],['--s7','trayecto y P(t)']]);

    c1.append(el('p',{class:'note'},'Un valor negativo de $t$ no queda fuera de la recta: corresponde al lado opuesto de $P_0$, sobre la misma dirección. Por eso un punto y un vector director fijan la recta completa, no solo un rayo que parte de $P_0$.'));
    c1.append(el('div',{class:'formula',html:'$$(x,y)=P_0+t\\vec v \\qquad P_0=(2,1),\\ \\ \\vec v=(3,-1),\\ \\ t\\in\\mathbb{R}$$'}));
    c1.append(el('p',{class:'note'},'$P_0$ es un punto conocido de la recta y $\\vec v=(a,b)$ es el vector director, la dirección en la que avanza. En el dibujo, el tramo azul —el cateto horizontal— mide $a$, y el tramo verde —el vertical— mide $b$: son exactamente el avance en $x$ y el avance en $y$ que separan a $P_0$ del otro extremo de $\\vec v$. Con esos dos datos la recta queda completamente determinada.'));
    sec.append(c1);

    /* ---------- Tarjeta 2: las tres formas, actualizándose juntas ---------- */
    const c2=el('div',{class:'card'});
    c2.append(el('h3',{},'Tres formas, un mismo punto'));
    c2.append(el('p',{},'La ecuación vectorial contiene a las otras dos: separar $(x,y)$ en sus dos coordenadas da las ecuaciones paramétricas, y despejar $t$ de cada una e igualarlas da la ecuación simétrica. Al mover $t$ en el siguiente control, las tres escrituras señalan siempre el mismo punto.'));

    let tG2=1.5;
    const leerVec2=el('p',{}), leerPar2=el('p',{}), leerSim2=el('p',{});
    const cajaP2=el('div',{class:'plot'}); c2.append(cajaP2);
    const P2=Plano(cajaP2,{xMin:-9,xMax:13,yMin:-4,yMax:6,alto:340,iso:true});
    function pintarC2(P){
      const x=P0G[0]+vG[0]*tG2, y=P0G[1]+vG[1]*tG2;
      P.ejes();
      rectaCompleta(P,P0G,vG,{color:'--grid',grosor:1.6});
      dibujarDirector(P,P0G,vG);
      P.punto(P0G[0],P0G[1],{color:'--s4',r:4});
      P.punto(x,y,{color:'--s7',r:5});
    }
    P2.dibujar(pintarC2);
    function actualizarC2(){
      P2.redibujar();
      const x=P0G[0]+vG[0]*tG2, y=P0G[1]+vG[1]*tG2;
      leerVec2.innerHTML='Vectorial: $(x,y)=(2,1)+'+tG2.toFixed(2)+'(3,-1)=('+x.toFixed(2)+',\\ '+y.toFixed(2)+')$';
      leerPar2.innerHTML='Paramétricas: $x=2+3('+tG2.toFixed(2)+')='+x.toFixed(2)+' \\quad y=1-('+tG2.toFixed(2)+')='+y.toFixed(2)+'$';
      leerSim2.innerHTML='Simétrica: $\\dfrac{'+x.toFixed(2)+'-2}{3}=\\dfrac{'+y.toFixed(2)+'-1}{-1}='+tG2.toFixed(2)+'$';
      renderMath(leerVec2); renderMath(leerPar2); renderMath(leerSim2);
    }
    controlValor(c2,{label:'t',min:-3,max:3,paso:0.1,valor:tG2,unidad:'',
      onChange:v=>{ tG2=v; actualizarC2(); }});

    leyenda(c2,[['--s4','P0 y el director v'],['--s1','a (avance en x)'],['--s2','b (avance en y)'],['--s7','P(t)']]);

    c2.append(leerVec2); c2.append(leerPar2); c2.append(leerSim2);
    actualizarC2();

    c2.append(el('p',{class:'note'},'Las tres líneas anteriores son la misma cuenta escrita de tres formas distintas: cambiar $t$ mueve el punto sobre la recta y actualiza las tres a la vez, porque describen exactamente lo mismo.'));
    c2.append(el('div',{class:'formula',html:'$$(x,y)=P_0+t\\vec v \\qquad \\begin{cases}x=x_0+at\\\\ y=y_0+bt\\end{cases} \\qquad \\dfrac{x-x_0}{a}=\\dfrac{y-y_0}{b}$$'}));
    c2.append(el('p',{class:'note'},'Las tres formas usan las mismas letras minúsculas $a$ y $b$ para las componentes del director, los catetos azul y verde del dibujo. La forma simétrica exige $a\\neq0$ y $b\\neq0$: si alguno de los dos es cero, esa fracción no existe.'));
    sec.append(c2);

    /* ---------- Tarjeta 3: el vector director no es único ---------- */
    const c3=el('div',{class:'card'});
    c3.append(el('h3',{},'El vector director no es único'));
    c3.append(el('p',{},'Cualquier múltiplo distinto de cero de $\\vec v$ sirve igual de director: $\\lambda\\vec v$ apunta en la misma dirección — o en la opuesta, si $\\lambda$ es negativo — y recorre exactamente la misma recta, solo que con otro parámetro. El siguiente control cambia $\\lambda$: el punto continúa moviéndose con $\\vec v$ a velocidad constante, y junto a él se indica qué valor de $t\'$ produciría el mismo punto usando $\\lambda\\vec v$ en su lugar.'));

    let lamG3=2;
    const leerC3=lectura(c3);
    const cajaP3=el('div',{class:'plot'}); c3.append(cajaP3);
    const P3=Plano(cajaP3,{xMin:-9,xMax:13,yMin:-4,yMax:6,alto:340,iso:true});
    P3.animar((P,t)=>{
      const tm=t-3;
      const x=P0G[0]+vG[0]*tm, y=P0G[1]+vG[1]*tm;
      P.ejes();
      rectaCompleta(P,P0G,vG,{color:'--grid',grosor:1.6});
      dibujarDirector(P,P0G,vG);
      if(Math.abs(lamG3)>0.15){
        P.vector(P0G[0],P0G[1],P0G[0]+lamG3*vG[0],P0G[1]+lamG3*vG[1],{color:'--s6',grosor:2.2,etiqueta:'λv'});
      }
      P.punto(P0G[0],P0G[1],{color:'--s4',r:4});
      P.punto(x,y,{color:'--s7',r:5});
      const tPrime = Math.abs(lamG3)>0.15 ? (tm/lamG3) : NaN;
      leerC3.set([
        ['λ', lamG3.toFixed(2)],
        ['t (con v)', tm.toFixed(2)],
        ['t\' (con λv)', isNaN(tPrime)?'indef. (λ=0)':tPrime.toFixed(2)],
        ['P(t)', '('+x.toFixed(2)+', '+y.toFixed(2)+')']
      ]);
    },{duracion:6});
    controlValor(c3,{label:'λ',min:-3,max:3,paso:0.25,valor:lamG3,unidad:'',
      onChange:v=>{ lamG3=v; }});

    leyenda(c3,[['--s4','P0 y el director v'],['--s1','a (avance en x)'],['--s2','b (avance en y)'],['--s6','λv'],['--s7','P(t)']]);

    c3.append(el('p',{class:'note'},'Con $\\lambda$ negativo el vector naranjo se invierte, pero el punto violeta sigue recorriendo la misma recta: cambia el sentido en que crece el parámetro, no la recta en sí.'));
    c3.append(el('div',{class:'formula',html:'$$P_0+t\\vec v=P_0+t\'(\\lambda\\vec v) \\qquad t\'=\\dfrac{t}{\\lambda},\\ \\ \\lambda\\neq0$$'}));
    c3.append(el('p',{class:'note'},'Por eso una recta no tiene «el» vector director: tiene una familia entera de ellos, todos múltiplos entre sí.'));
    sec.append(c3);

    /* ---------- Tarjeta 4: rectas verticales y horizontales ---------- */
    const c4=el('div',{class:'card'});
    c4.append(el('h3',{},'Casos particulares: rectas verticales y horizontales'));
    c4.append(el('p',{},'Cuando el director tiene una componente nula, la recta queda pegada a un eje. Si $a=0$ el punto solo se mueve en $y$: la recta es vertical, $x=x_0$. Si $b=0$ el punto solo se mueve en $x$: la recta es horizontal, $y=y_0$.'));

    const P0v=[4,-1], vV=[0,1];
    const P0h=[-3,2], vH=[1,0];
    const cajaP4=el('div',{class:'plot'}); c4.append(cajaP4);
    const P4=Plano(cajaP4,{xMin:-7,xMax:6,yMin:-5,yMax:4,alto:340,iso:true});
    const leerC4=lectura(c4);
    P4.animar((P,t)=>{
      const s1=3*Math.sin(2*Math.PI*t/8);
      const s2=3*Math.cos(2*Math.PI*t/8);
      const xv=P0v[0], yv=P0v[1]+s1;
      const xh=P0h[0]+s2, yh=P0h[1];
      P.ejes();
      rectaCompleta(P,P0v,vV,{color:'--s1',grosor:2});
      rectaCompleta(P,P0h,vH,{color:'--s2',grosor:2});
      P.texto(P0v[0],3.6,'x = 4',{color:'--s1',dx:6});
      P.texto(-6.6,P0h[1],'y = 2',{color:'--s2',dy:-8});
      P.punto(xv,yv,{color:'--s1',r:5});
      P.punto(xh,yh,{color:'--s2',r:5});
      leerC4.set([
        ['sobre x = 4', '('+xv.toFixed(2)+', '+yv.toFixed(2)+')'],
        ['sobre y = 2', '('+xh.toFixed(2)+', '+yh.toFixed(2)+')']
      ]);
    },{duracion:8});

    c4.append(el('p',{class:'note'},'En ninguna de las dos rectas existe la forma simétrica, porque su fórmula divide por $a$ y por $b$: con cualquiera de los dos en cero, esa división no está definida. La forma paramétrica, en cambio, sigue funcionando sin problema.'));
    c4.append(el('div',{class:'formula',html:'$$a=0 \\implies x=x_0 \\qquad\\qquad b=0 \\implies y=y_0$$'}));
    sec.append(c4);
  }
});
