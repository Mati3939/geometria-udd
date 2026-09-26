/* La recta en el espacio: ecuación vectorial, paramétrica y simétrica, y la
   recta que pasa por dos puntos. Extensión directa de la recta en el plano
   (misma lógica de P0 + t·v), ahora con una tercera coordenada.

   Nota técnica para quien retome esto: Espacio.texto3 (assets/app/math.js)
   no admite dx/dy/tam como sí lo hace Plano.texto -- el corrimiento del
   rótulo viene fijo en +5/-5 px. Para separar rótulos que se pisaban se usa
   acá texto3dx(), un envoltorio liviano sobre E.ctx/E.proy que sí acepta
   dx/dy/tam, sin tocar math.js. */
registerModule({
  id:'recta-espacio',
  title:'La recta en el espacio',
  unidad:'III',
  lead:'Un punto y una dirección siguen determinando una recta entera, ahora con tres coordenadas: las mismas tres formas de escribirla valen, con un matiz nuevo cuando alguna componente del director se anula.',
  build(sec){

    /* Envoltorio sobre E.texto3 con dx/dy/tam, que la primitiva no ofrece. */
    function texto3dx(E,p,s,op){
      op=op||{};
      const c=E.ctx, P=E.proy(p);
      c.save();
      c.fillStyle=colorVar(op.color||'--muted');
      c.font=(op.tam||12)+'px ui-monospace, Consolas, monospace';
      c.fillText(s, P[0]+(op.dx!=null?op.dx:5), P[1]+(op.dy!=null?op.dy:-5));
      c.restore();
    }

    const num=n=>(n<0?'−'+(-n):String(n));

    function leyenda(mount,items){
      const L=el('div',{class:'legend'});
      items.forEach(([col,txt])=>L.append(el('span',{},
        el('i',{class:'sw',style:'background:var('+col+')'}),txt)));
      mount.append(L);
    }

    /* Dibuja el director como tres catetos en escalera -avance en x, en y,
       en z- desde P0, más la flecha del propio vector v. Mismo espíritu que
       en la recta del plano: se ve de qué está hecho (a,b,c), no solo
       nombrado en la fórmula. */
    function dibujarDirector3(E,P0,v){
      const p1=[P0[0]+v[0], P0[1], P0[2]];
      const p2=[P0[0]+v[0], P0[1]+v[1], P0[2]];
      const p3=[P0[0]+v[0], P0[1]+v[1], P0[2]+v[2]];
      E.linea3(P0,p1,{color:'--s1',grosor:3});
      E.linea3(p1,p2,{color:'--s2',grosor:3});
      E.linea3(p2,p3,{color:'--s8',grosor:3});
      E.vector3(P0,v,{color:'--s4',grosor:2.2});
      E.punto3(P0,{color:'--s4',r:4});
      texto3dx(E,[P0[0]+v[0]/2, P0[1], P0[2]],'a = '+num(v[0]),{color:'--s1',dy:15});
      texto3dx(E,[p1[0], P0[1]+v[1]/2, P0[2]],'b = '+num(v[1]),{color:'--s2',dx:8});
      texto3dx(E,[p2[0], p2[1], P0[2]+v[2]/2],'c = '+num(v[2]),{color:'--s8',dx:8,dy:-18});
      texto3dx(E,P0,'P0',{color:'--s4',dx:-26,dy:15});
      /* El rótulo de v se ubica en el lado de la diagonal P0→p3 CONTRARIO a
         donde cae la esquina p2 -misma idea que en la recta del plano-, para
         no pisar nunca los rótulos de a, b y c, incluso cuando c=0 deja a p2
         y p3 en el mismo punto. Se calcula en coordenadas de PANTALLA (ya
         proyectadas), porque un desplazamiento perpendicular en 3D no tiene
         por qué seguir siendo perpendicular una vez proyectado. */
      const A=E.proy(P0), B=E.proy(p3), C=E.proy(p2);
      const ddx=B[0]-A[0], ddy=B[1]-A[1], largo=Math.hypot(ddx,ddy)||1;
      const px=-ddy/largo, py=ddx/largo;
      const lado=((C[0]-A[0])*px+(C[1]-A[1])*py)>=0 ? -1 : 1;
      const c=E.ctx;
      c.save(); c.fillStyle=colorVar('--s4'); c.font='12px ui-monospace, Consolas, monospace';
      c.fillText('v = ('+num(v[0])+', '+num(v[1])+', '+num(v[2])+')',
        (A[0]+B[0])/2+lado*px*32, (A[1]+B[1])/2+lado*py*32);
      c.restore();
    }

    const P0G=[1,1,0], vG=[2,-2,1];

    /* ---------- Tarjeta 1: la ecuación vectorial (animada) ---------- */
    const c1=el('div',{class:'card'});
    c1.append(el('h3',{},'La recta como conjunto de puntos: la ecuación vectorial'));
    c1.append(el('p',{},'Un punto conocido $P_0$ y una dirección $\\vec v=(a,b,c)$ determinan la recta entera: cada valor de $t$ da un punto distinto, y el conjunto de todos ellos —para todo $t$ real— es la recta. Es la misma fórmula que en el plano, con una tercera coordenada.'));

    const cajaP1=el('div',{class:'plot'}); c1.append(cajaP1);
    const E1=Espacio(cajaP1,{alto:380,escala:38});
    const leerC1=lectura(c1);
    E1.animar((E,t)=>{
      const tm=t-1.5;
      const P=[P0G[0]+vG[0]*tm, P0G[1]+vG[1]*tm, P0G[2]+vG[2]*tm];
      E.ejes3({largo:5});
      E.linea3(
        [P0G[0]+vG[0]*-1.8, P0G[1]+vG[1]*-1.8, P0G[2]+vG[2]*-1.8],
        [P0G[0]+vG[0]*1.8,  P0G[1]+vG[1]*1.8,  P0G[2]+vG[2]*1.8],
        {color:'--grid',grosor:1.6,guiones:true});
      dibujarDirector3(E,P0G,vG);
      E.linea3(P0G,P,{color:'--s7',grosor:1.6,guiones:true});
      E.punto3(P,{color:'--s7',r:5});
      leerC1.set([
        ['t', tm.toFixed(2)],
        ['P(t)', '('+P[0].toFixed(2)+', '+P[1].toFixed(2)+', '+P[2].toFixed(2)+')']
      ]);
    },{duracion:3});

    leyenda(c1,[['--s4','P0 y el director v'],['--s1','a (avance en x)'],['--s2','b (avance en y)'],['--s8','c (avance en z)'],['--s7','trayecto y P(t)']]);

    c1.append(el('p',{class:'note'},'El punto violeta recorre la recta a medida que $t$ cambia; un $t$ negativo queda al otro lado de $P_0$, sobre la misma dirección. El dibujo se puede girar arrastrando, para ver la escalera de catetos desde otro ángulo.'));
    c1.append(el('div',{class:'formula',html:'$$(x,y,z)=P_0+t\\vec v \\qquad t\\in\\mathbb{R}$$'}));
    c1.append(el('p',{class:'note'},'En la figura, $P_0=(1,1,0)$ y $\\vec v=(2,-2,1)$. El tramo azul mide la componente $a$ del director (avance en $x$), el verde mide $b$ (avance en $y$) y el rojo mide $c$ (avance en $z$): son los tres catetos de una escalera que lleva de $P_0$ al otro extremo de $\\vec v$.'));
    sec.append(c1);

    /* ---------- Tarjeta 2: tres formas, un mismo punto (deslizador) ---------- */
    const c2=el('div',{class:'card'});
    c2.append(el('h3',{},'Tres formas, un mismo punto'));
    c2.append(el('p',{},'La ecuación vectorial contiene a las otras dos: separar $(x,y,z)$ en sus tres coordenadas da las ecuaciones paramétricas, y despejar $t$ de cada una e igualarlas da la ecuación simétrica, cuando ninguna componente del director es cero. Al mover $t$ en el siguiente control, las tres escrituras señalan siempre el mismo punto.'));

    let tG2=1.2;
    /* Las tres cifras que cambian con t alargan o acortan el texto (un signo
       menos de más), y eso alcanza a mover el renglón a dos líneas en algún
       punto del recorrido. Por eso van en textoVivo, calibrado con varios
       valores de t (incluidos los dos extremos) para que la tarjeta no lata
       al arrastrar el deslizador. */
    const vecHTML=tv=>{
      const x=P0G[0]+vG[0]*tv, y=P0G[1]+vG[1]*tv, z=P0G[2]+vG[2]*tv;
      return 'Vectorial: $(x,y,z)=(1,1,0)+'+tv.toFixed(2)+'(2,-2,1)=('+x.toFixed(2)+',\\ '+y.toFixed(2)+',\\ '+z.toFixed(2)+')$';
    };
    const parHTML=tv=>{
      const x=P0G[0]+vG[0]*tv, y=P0G[1]+vG[1]*tv, z=P0G[2]+vG[2]*tv;
      /* una coordenada por línea: en 3D la versión en un solo renglón (como
         en el plano) alcanza a envolver de forma distinta según el signo de
         t, y eso es justo lo que hace latir la tarjeta */
      return 'Paramétricas:<br>$x=1+2('+tv.toFixed(2)+')='+x.toFixed(2)+'\\quad y=1-2('+tv.toFixed(2)+')='+y.toFixed(2)+'$<br>$z=0+'+tv.toFixed(2)+'='+z.toFixed(2)+'$';
    };
    const simHTML=tv=>{
      const x=P0G[0]+vG[0]*tv, y=P0G[1]+vG[1]*tv, z=P0G[2]+vG[2]*tv;
      return 'Simétrica: $\\dfrac{'+x.toFixed(2)+'-1}{2}=\\dfrac{'+y.toFixed(2)+'-1}{-2}=\\dfrac{'+z.toFixed(2)+'-0}{1}='+tv.toFixed(2)+'$';
    };
    const MUESTRAS_T2=[-1.5,-0.75,0,0.75,1.5];
    const cajaP2=el('div',{class:'plot'}); c2.append(cajaP2);
    const E2=Espacio(cajaP2,{alto:380,escala:38});
    function pintarC2(E){
      const P=[P0G[0]+vG[0]*tG2, P0G[1]+vG[1]*tG2, P0G[2]+vG[2]*tG2];
      E.ejes3({largo:5});
      E.linea3(
        [P0G[0]+vG[0]*-1.8, P0G[1]+vG[1]*-1.8, P0G[2]+vG[2]*-1.8],
        [P0G[0]+vG[0]*1.8,  P0G[1]+vG[1]*1.8,  P0G[2]+vG[2]*1.8],
        {color:'--grid',grosor:1.6,guiones:true});
      dibujarDirector3(E,P0G,vG);
      E.punto3(P,{color:'--s7',r:5});
    }
    E2.dibujar(pintarC2);
    function actualizarC2(){
      E2.redibujar();
      leerVec2.set(vecHTML(tG2));
      leerPar2.set(parHTML(tG2));
      leerSim2.set(simHTML(tG2));
    }
    controlValor(c2,{label:'t',min:-1.5,max:1.5,paso:0.1,valor:tG2,unidad:'',
      onChange:v=>{ tG2=v; actualizarC2(); }});

    leyenda(c2,[['--s4','P0 y el director v'],['--s1','a (avance en x)'],['--s2','b (avance en y)'],['--s8','c (avance en z)'],['--s7','P(t)']]);

    const leerVec2=textoVivo(c2).calibrar(MUESTRAS_T2.map(vecHTML));
    const leerPar2=textoVivo(c2).calibrar(MUESTRAS_T2.map(parHTML));
    const leerSim2=textoVivo(c2).calibrar(MUESTRAS_T2.map(simHTML));
    actualizarC2();

    c2.append(el('p',{class:'note'},'Las tres líneas anteriores son la misma cuenta escrita de tres formas distintas: cambiar $t$ mueve el punto sobre la recta y actualiza las tres a la vez, porque describen exactamente lo mismo.'));
    c2.append(el('div',{class:'formula',html:'$$(x,y,z)=P_0+t\\vec v \\qquad \\begin{cases}x=x_0+at\\\\ y=y_0+bt\\\\ z=z_0+ct\\end{cases} \\qquad \\dfrac{x-x_0}{a}=\\dfrac{y-y_0}{b}=\\dfrac{z-z_0}{c}$$'}));
    c2.append(el('p',{class:'note'},'La forma simétrica exige $a\\neq0$, $b\\neq0$ y $c\\neq0$: si alguna de las tres es cero, esa fracción no existe.'));
    sec.append(c2);

    /* ---------- Tarjeta 3: una componente del director en cero ---------- */
    const c3=el('div',{class:'card'});
    c3.append(el('h3',{},'Cuando una componente del director es cero'));
    c3.append(el('p',{},'La forma simétrica exige que ninguna componente del director sea cero, porque cada una queda en un denominador. Si una lo es, la coordenada correspondiente del punto no cambia con $t$ y queda fija; la recta se escribe entonces con una igualdad entre dos fracciones y una condición aparte.'));

    const P0G3=[-1,1,2], vG3=[1,-1,0];
    const cajaP3=el('div',{class:'plot'}); c3.append(cajaP3);
    const E3=Espacio(cajaP3,{alto:380,escala:38});
    const leerC3=lectura(c3);
    E3.animar((E,t)=>{
      const tm=t-2;
      const P=[P0G3[0]+vG3[0]*tm, P0G3[1]+vG3[1]*tm, P0G3[2]+vG3[2]*tm];
      E.ejes3({largo:5});
      E.linea3(
        [P0G3[0]+vG3[0]*-2.5, P0G3[1]+vG3[1]*-2.5, P0G3[2]+vG3[2]*-2.5],
        [P0G3[0]+vG3[0]*2.5,  P0G3[1]+vG3[1]*2.5,  P0G3[2]+vG3[2]*2.5],
        {color:'--grid',grosor:1.6,guiones:true});
      dibujarDirector3(E,P0G3,vG3);
      E.linea3(P0G3,P,{color:'--s7',grosor:1.6,guiones:true});
      E.punto3(P,{color:'--s7',r:5});
      leerC3.set([
        ['t', tm.toFixed(2)],
        ['P(t)', '('+P[0].toFixed(2)+', '+P[1].toFixed(2)+', '+P[2].toFixed(2)+')'],
        ['z', P[2].toFixed(2)]
      ]);
    },{duracion:4});

    leyenda(c3,[['--s4','P0 y el director v'],['--s1','a (avance en x)'],['--s2','b (avance en y)'],['--s8','c = 0 (sin avance en z)'],['--s7','trayecto y P(t)']]);

    c3.append(el('p',{class:'note'},'Acá $\\vec v=(1,-1,0)$: la tercera componente es nula, así que $z$ nunca cambia. En la lectura de arriba, el valor de $z$ queda fijo en $2$ mientras el punto recorre toda la recta.'));
    c3.append(el('div',{class:'formula',html:'$$\\dfrac{x-x_0}{a}=\\dfrac{y-y_0}{b}=\\dfrac{z-z_0}{c}\\ \\ (a,b,c\\neq0) \\qquad\\qquad c=0:\\ \\ z=z_0,\\ \\ \\dfrac{x-x_0}{a}=\\dfrac{y-y_0}{b}$$'}));
    c3.append(el('p',{class:'note'},'Con $P_0=(-1,1,2)$ y $\\vec v=(1,-1,0)$ la recta queda $z=2$ junto con $\\dfrac{x+1}{1}=\\dfrac{y-1}{-1}$. Lo mismo ocurre si la componente nula es $a$ o $b$: la coordenada que le corresponde se congela, y la igualdad simétrica queda entre las dos fracciones restantes.'));
    sec.append(c3);

    /* ---------- Tarjeta 4: la recta por dos puntos ---------- */
    const c4=el('div',{class:'card'});
    c4.append(el('h3',{},'La recta que pasa por dos puntos'));
    c4.append(el('p',{},'Cuando se conocen dos puntos $P_1$ y $P_2$ de una recta —y no un punto más un director— el director se obtiene restándolos: $\\vec v=P_2-P_1$. Con ese vector y cualquiera de los dos puntos, la recta se escribe igual que antes.'));

    const P1G4=[2,-1,3], P2G4=[0,1,1];
    const vG4=[P2G4[0]-P1G4[0], P2G4[1]-P1G4[1], P2G4[2]-P1G4[2]];
    const cajaP4=el('div',{class:'plot'}); c4.append(cajaP4);
    const E4=Espacio(cajaP4,{alto:380,escala:38});
    const leerC4=lectura(c4);
    E4.animar((E,t)=>{
      const tm=t-0.5;
      const P=[P1G4[0]+vG4[0]*tm, P1G4[1]+vG4[1]*tm, P1G4[2]+vG4[2]*tm];
      E.ejes3({largo:5});
      E.linea3(
        [P1G4[0]+vG4[0]*-0.8, P1G4[1]+vG4[1]*-0.8, P1G4[2]+vG4[2]*-0.8],
        [P1G4[0]+vG4[0]*1.8,  P1G4[1]+vG4[1]*1.8,  P1G4[2]+vG4[2]*1.8],
        {color:'--grid',grosor:1.6,guiones:true});
      E.vector3(P1G4,vG4,{color:'--s4',grosor:2.2});
      E.punto3(P1G4,{color:'--s4',r:5});
      E.punto3(P2G4,{color:'--s8',r:5});
      texto3dx(E,P1G4,'P1',{color:'--s4',dx:-24,dy:15});
      texto3dx(E,P2G4,'P2',{color:'--s8',dx:8,dy:-8});
      E.punto3(P,{color:'--s7',r:5});
      leerC4.set([
        ['t', tm.toFixed(2)],
        ['P(t)', '('+P[0].toFixed(2)+', '+P[1].toFixed(2)+', '+P[2].toFixed(2)+')']
      ]);
    },{duracion:2});

    leyenda(c4,[['--s4','P1 (t=0) y v = P2−P1'],['--s8','P2 (t=1)'],['--s7','trayecto y P(t)']]);

    c4.append(el('p',{class:'note'},'El punto violeta pasa por $P_1$ en $t=0$ y por $P_2$ en $t=1$, y sigue de largo en los dos sentidos: los puntos dados quedan sobre la recta, pero no son sus únicos puntos.'));
    c4.append(el('div',{class:'formula',html:'$$\\vec v=P_2-P_1=(x_2-x_1,\\ y_2-y_1,\\ z_2-z_1) \\qquad (x,y,z)=P_1+t\\vec v$$'}));
    c4.append(el('p',{class:'note'},'Con $P_1=(2,-1,3)$ y $P_2=(0,1,1)$ resulta $\\vec v=(-2,2,-2)$. Restar en el orden contrario, $P_1-P_2$, da el vector opuesto y sirve igual de director: solo cambia el signo de $t$ que corresponde a cada punto. La posición de esta recta respecto de otra recta o de un plano es un análisis aparte.'));
    sec.append(c4);
  }
});
