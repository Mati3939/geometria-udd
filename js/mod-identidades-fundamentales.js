/* Identidades fundamentales, círculo unitario y reducción al primer cuadrante.

   MÓDULO DE REFERENCIA — el resto de los temas sigue esta forma:
   - cada tarjeta es un <div class="card"> que arranca con su <h3>;
   - lo que se pueda mostrar moviéndose, se muestra moviéndose: acá 4 de las 5
     tarjetas llevan un Plano (animado o con deslizador), y la fórmula aparece
     DESPUÉS del dibujo que la explica, no antes;
   - NO hay ejercicios ni desarrollos paso a paso: se ve de dónde sale cada
     fórmula, no cómo se resuelve un enunciado;
   - el texto visible no cita material del ramo ni lleva pie de fuente;
   - los planos que dibujan circunferencias o ángulos van con `iso:true`, si no
     el círculo sale ovalado y un ángulo recto no se ve recto. */
registerModule({
  id:'identidades-fundamentales',
  title:'Identidades fundamentales y círculo unitario',
  unidad:'I',
  lead:'Todo el resto de la unidad se apoya en un solo dibujo: un punto girando sobre una circunferencia de radio 1. De ahí salen el seno, el coseno, las tres identidades pitagóricas y los signos por cuadrante.',
  build(sec){

    /* ---------- Tarjeta 1: el círculo unitario (animada) ---------- */
    const c1=el('div',{class:'card'});
    c1.append(el('h3',{},'El círculo unitario'));
    c1.append(el('p',{},'Sobre la circunferencia $x^2+y^2=1$, un ángulo $\\theta$ medido desde el eje $x$ positivo determina un punto. Ese punto ',el('b',{},'es'),' el par $(\\cos\\theta,\\ \\operatorname{sen}\\theta)$: el coseno es su coordenada horizontal y el seno su coordenada vertical.'));

    const cajaP1=el('div',{class:'plot'}); c1.append(cajaP1);
    const P1=Plano(cajaP1,{xMin:-1.35,xMax:1.35,yMin:-1.35,yMax:1.35,alto:340,iso:true});
    const leerC1=lectura(c1);
    P1.animar((P,t)=>{
      const th=t*Math.PI/4;                 /* una vuelta completa cada 8 s */
      const cx=Math.cos(th), cy=Math.sin(th);
      P.ejes();
      P.parametrica(a=>[Math.cos(a),Math.sin(a)],0,2*Math.PI,{color:'--grid',grosor:1.4});
      /* el arco del ángulo, junto al origen */
      P.parametrica(a=>[0.26*Math.cos(a),0.26*Math.sin(a)],0,th,{color:'--s4',grosor:2.2});
      /* cateto horizontal = cos, cateto vertical = sen */
      P.parametrica(s=>[cx*s,0],0,1,{color:'--s1',grosor:3.4});
      P.parametrica(s=>[cx,cy*s],0,1,{color:'--s2',grosor:3.4});
      P.parametrica(s=>[cx*s,cy*s],0,1,{color:'--s7',grosor:2});
      P.punto(cx,cy,{color:'--s7',r:5});
      P.texto(cx/2,0,'cos θ',{color:'--s1',dy:16,dx:-14});
      P.texto(cx,cy/2,'sen θ',{color:'--s2',dx:9});
      P.texto(0.3*Math.cos(th/2),0.3*Math.sin(th/2),'θ',{color:'--s4',tam:13});
      const g=(th*180/Math.PI)%360;
      leerC1.set([
        ['θ', g.toFixed(0)+'°'],
        ['cos θ', cx.toFixed(3)],
        ['sen θ', cy.toFixed(3)],
        ['cos²θ + sen²θ', (cx*cx+cy*cy).toFixed(3)]
      ]);
    },{duracion:8});

    c1.append(el('p',{},'En el triángulo que forman el radio, el cateto azul y el cateto verde, la hipotenusa mide $1$ porque es un radio. Pitágoras sobre ese triángulo ',el('b',{},'es'),' la primera identidad pitagórica, y por eso vale para todo $\\theta$:'));
    c1.append(el('div',{class:'formula',html:'$$\\operatorname{sen}^2\\theta+\\cos^2\\theta=1$$'}));
    c1.append(el('p',{class:'note'},'Por eso el contador de arriba marca $1{,}000$ en todo momento, sin importar en qué cuadrante esté el punto: no es una fórmula que haya que memorizar aparte, es la ecuación de la circunferencia escrita con otros nombres.'));
    c1.append(el('p',{class:'note'},'De paso se ve por qué $\\operatorname{sen}\\theta$ y $\\cos\\theta$ nunca se salen de $[-1,1]$ — son coordenadas de un punto que vive sobre la circunferencia — y por qué cambian de signo al cruzar de cuadrante: es la coordenada la que cambia de signo.'));
    sec.append(c1);

    /* ---------- Tarjeta 2: las identidades fundamentales ---------- */
    const c2=el('div',{class:'card'});
    c2.append(el('h3',{},'Las identidades fundamentales'));
    c2.append(el('p',{},'Una ',el('b',{},'identidad trigonométrica'),' es una igualdad válida para todos los reales en los que los dos lados están definidos. Las fundamentales se agrupan en tres familias.'));
    c2.append(el('p',{},el('b',{},'Recíprocas'),' — cada una nombra al inverso multiplicativo de otra:'));
    c2.append(el('div',{class:'formula',html:'$$\\csc\\theta=\\frac{1}{\\operatorname{sen}\\theta}\\qquad \\sec\\theta=\\frac{1}{\\cos\\theta}\\qquad \\cot\\theta=\\frac{1}{\\tan\\theta}$$'}));
    c2.append(el('p',{},el('b',{},'De cociente'),' — definen la tangente y la cotangente a partir del seno y el coseno:'));
    c2.append(el('div',{class:'formula',html:'$$\\tan\\theta=\\frac{\\operatorname{sen}\\theta}{\\cos\\theta}\\qquad \\cot\\theta=\\frac{\\cos\\theta}{\\operatorname{sen}\\theta}$$'}));
    c2.append(el('p',{},el('b',{},'Pitagóricas'),' — la primera es el dibujo de arriba; las otras dos salen de dividirla:'));
    c2.append(el('div',{class:'formula',html:'$$\\operatorname{sen}^2\\theta+\\cos^2\\theta=1\\qquad 1+\\tan^2\\theta=\\sec^2\\theta\\qquad 1+\\cot^2\\theta=\\csc^2\\theta$$'}));
    c2.append(el('p',{class:'note'},'Dividir $\\operatorname{sen}^2\\theta+\\cos^2\\theta=1$ por $\\cos^2\\theta$ da la segunda, y dividirla por $\\operatorname{sen}^2\\theta$ da la tercera. O sea: hay ',el('b',{},'una'),' identidad pitagórica y dos reescrituras — no tres cosas distintas que aprender.'));
    c2.append(el('p',{class:'note'},'Son las que se usan para simplificar una expresión o para verificar otra identidad: casi siempre conviene pasar todo a seno y coseno, simplificar, y recién al final volver a tangentes o secantes.'));
    sec.append(c2);

    /* ---------- Tarjeta 3: tangente y secante, también Pitágoras (animada) ---------- */
    const c3=el('div',{class:'card'});
    c3.append(el('h3',{},'Por qué $1+\\tan^2\\theta=\\sec^2\\theta$ también es Pitágoras'));
    c3.append(el('p',{},'Al prolongar el radio hasta la recta vertical $x=1$, tangente a la circunferencia, el punto donde la corta tiene altura $\\tan\\theta$, y la distancia del origen hasta ahí es exactamente $\\sec\\theta$.'));

    const cajaP3=el('div',{class:'plot'}); c3.append(cajaP3);
    const P3=Plano(cajaP3,{xMin:-1.3,xMax:2.7,yMin:-2.2,yMax:2.2,alto:360,iso:true});
    const leerC3=lectura(c3);
    P3.animar((P,t)=>{
      /* θ va de −1,15 a 1,15 rad y vuelve: no se cruza ±π/2, donde tan y sec
         se van al infinito y no habría nada que dibujar */
      const u=t/5, th=1.15*Math.sin(2*Math.PI*u);
      const cx=Math.cos(th), cy=Math.sin(th);
      const tg=Math.tan(th), se=1/Math.cos(th);
      P.ejes();
      P.parametrica(a=>[Math.cos(a),Math.sin(a)],0,2*Math.PI,{color:'--grid',grosor:1.4});
      const w3=P.ventana();   /* con iso la ventana visible es mas alta que la pedida */
      P.parametrica(s=>[1,w3.yMin+(w3.yMax-w3.yMin)*s],0,1,{color:'--grid',grosor:1.6,guiones:true});
      P.texto(1,w3.yMax*0.9,'x = 1',{color:'--muted',dx:6});
      /* el triángulo grande: cateto 1 sobre el eje x, cateto tan θ vertical,
         hipotenusa sec θ desde el origen */
      P.parametrica(s=>[s,0],0,1,{color:'--s4',grosor:3.4});
      P.parametrica(s=>[1,tg*s],0,1,{color:'--s6',grosor:3.4});
      P.parametrica(s=>[s,tg*s],0,1,{color:'--s7',grosor:2.2});
      P.punto(cx,cy,{color:'--grid',r:4});
      P.punto(1,tg,{color:'--s6',r:5});
      P.texto(0.5,0,'1',{color:'--s4',dy:16});
      P.texto(1,tg/2,'tan θ',{color:'--s6',dx:9});
      P.texto(0.55,tg*0.55,'sec θ',{color:'--s7',dx:-6,dy:-9});
      leerC3.set([
        ['θ', (th*180/Math.PI).toFixed(0)+'°'],
        ['tan θ', tg.toFixed(3)],
        ['sec θ', se.toFixed(3)],
        ['1 + tan²θ', (1+tg*tg).toFixed(3)],
        ['sec²θ', (se*se).toFixed(3)]
      ]);
    },{duracion:5});

    c3.append(el('p',{},'El triángulo naranja-rojo tiene catetos $1$ y $\\tan\\theta$ e hipotenusa $\\sec\\theta$. Pitágoras ahí da, otra vez sin memorizar nada:'));
    c3.append(el('div',{class:'formula',html:'$$1+\\tan^2\\theta=\\sec^2\\theta$$'}));
    c3.append(el('p',{class:'note'},'Los dos últimos números del contador coinciden siempre. Y se ve por qué $\\sec\\theta$ nunca vale menos que $1$ en valor absoluto: es una hipotenusa de un triángulo que ya tiene un cateto de largo $1$.'));
    c3.append(el('p',{class:'note'},'También se ve qué pasa cerca de $\\theta=90°$: el radio se acuesta casi paralelo a la recta $x=1$ y el corte se va hacia arriba sin límite. Eso es $\\tan(90°)$ indefinida, no un capricho de la tabla.'));
    sec.append(c3);

    /* ---------- Tarjeta 4: ángulo de referencia (deslizador) ---------- */
    const c4=el('div',{class:'card'});
    c4.append(el('h3',{},'Ángulo de referencia y reducción al primer cuadrante'));
    c4.append(el('p',{},'Para un $\\theta$ cuyo lado terminal no cae sobre un eje, el ',el('b',{},'ángulo de referencia'),' $\\theta_r$ es el ángulo agudo que ese lado terminal forma con el eje $x$. Al mover $\\theta$ se ve que $\\theta_r$ se mide siempre contra el eje horizontal, nunca contra el vertical.'));

    let thG=210;
    const reglaC4=el('p',{});
    const cajaP4=el('div',{class:'plot'}); c4.append(cajaP4);
    const P4=Plano(cajaP4,{xMin:-1.35,xMax:1.35,yMin:-1.35,yMax:1.35,alto:340,iso:true});
    P4.dibujar(P=>{
      const th=thG*Math.PI/180;
      const cx=Math.cos(th), cy=Math.sin(th);
      /* el ángulo de referencia contra el eje x: el agudo entre el lado
         terminal y el eje horizontal, sea el positivo o el negativo */
      const thr=Math.atan2(Math.abs(cy),Math.abs(cx));
      const ejeX=cx>=0?0:Math.PI;            /* hacia qué lado del eje x se mide */
      P.ejes();
      P.parametrica(a=>[Math.cos(a),Math.sin(a)],0,2*Math.PI,{color:'--grid',grosor:1.4});
      /* θ desde el eje x positivo, acotado a UNA vuelta: dibujar 720° encima de
         sí mismo no agrega información, solo tapa el arco de θr */
      const thVuelta=(((thG%360)+360)%360)*Math.PI/180;
      P.parametrica(a=>[0.5*Math.cos(a),0.5*Math.sin(a)],0,thVuelta,{color:'--s4',grosor:2});
      /* θr, pegado al eje x más cercano */
      const signo=cy>=0?1:-1;
      P.parametrica(a=>[0.26*Math.cos(ejeX+signo*a*(cx>=0?1:-1)),0.26*Math.sin(ejeX+signo*a*(cx>=0?1:-1))],0,thr,{color:'--s2',grosor:3});
      P.parametrica(s=>[cx*s,cy*s],0,1,{color:'--s7',grosor:2.4});
      P.punto(cx,cy,{color:'--s7',r:5});
      P.texto(0.56*Math.cos(thVuelta/2),0.56*Math.sin(thVuelta/2),'θ',{color:'--s4',tam:13});
      /* la etiqueta de θr sale por fuera de su arco (0,26) y del lado contrario
         al lado terminal, para no quedar encima del radio violeta */
      const angR=ejeX+signo*thr*0.45*(cx>=0?1:-1);
      P.texto(0.40*Math.cos(angR),0.40*Math.sin(angR),'θr',{color:'--s2',tam:13,dx:cx>=0?4:-18,dy:cy>=0?14:-6});
    });
    function actualizarC4(){
      const th=thG*Math.PI/180;
      const cx=Math.cos(th), cy=Math.sin(th);
      const n=((thG%360)+360)%360;
      const thrG=Math.atan2(Math.abs(cy),Math.abs(cx))*180/Math.PI;
      /* Caso aparte, y es el de la propia definición: si el lado terminal cae
         sobre un eje NO hay ángulo de referencia (la definición pide un ángulo
         agudo contra el eje x, y ahí no queda ninguno que formar). El valor se
         lee directo del punto sobre la circunferencia. */
      if(n%90===0){
        const par=['(1, 0)','(0, 1)','(−1, 0)','(0, −1)'][n/90];
        reglaC4.innerHTML='El lado terminal cae sobre un eje, así que <b>no hay ángulo de referencia</b>: la definición pide un ángulo agudo contra el eje $x$ y acá no queda ninguno. El valor se lee directo del punto sobre la circunferencia.';
        renderMath(reglaC4);
        leerC4.set([
          ['θ', thG+'°'],
          ['equivale a', n+'°'],
          ['(cos θ, sen θ)', par],
          ['θr', 'no definido']
        ]);
        return;
      }
      let cuad, regla;
      if(n<90){ cuad='I';   regla='\\theta_r=\\theta'; }
      else if(n<180){ cuad='II';  regla='\\theta_r=180^\\circ-\\theta'; }
      else if(n<270){ cuad='III'; regla='\\theta_r=\\theta-180^\\circ'; }
      else { cuad='IV';  regla='\\theta_r=360^\\circ-\\theta'; }
      const sg=v=>v>=0?'positivo':'negativo';
      reglaC4.innerHTML='Cuadrante '+cuad+', así que la regla que corresponde es $'+regla+'$, y da $\\theta_r='+thrG.toFixed(0)+'^\\circ$.';
      renderMath(reglaC4);
      leerC4.set([
        ['θ', thG+'°'],
        ['equivale a', n+'°'],
        ['θr', thrG.toFixed(0)+'°'],
        ['cuadrante', cuad],
        ['signo de sen θ', sg(cy)],
        ['signo de cos θ', sg(cx)],
        ['signo de tan θ', sg(cy/cx)]
      ]);
    }
    controlValor(c4,{label:'θ',min:-360,max:720,paso:1,valor:thG,
      onChange:v=>{ thG=v; P4.redibujar(); actualizarC4(); }});
    c4.append(reglaC4);
    const leerC4=lectura(c4);
    actualizarC4();

    c4.append(el('p',{},'Con eso, calcular una función trigonométrica de un ángulo cualquiera son tres pasos: el ángulo de referencia, el signo que le toca según el cuadrante, y el valor conocido de $\\theta_r$.'));
    c4.append(el('div',{class:'formula',html:'$$\\theta_r=\\theta \\quad\\mid\\quad 180^\\circ-\\theta \\quad\\mid\\quad \\theta-180^\\circ \\quad\\mid\\quad 360^\\circ-\\theta$$'}));
    c4.append(el('p',{class:'note'},'Las cuatro reglas están en ese orden: cuadrantes I, II, III y IV. Si $\\theta$ se pasa de una vuelta (o es negativo), primero se le suman o restan vueltas completas de $360^\\circ$ hasta caer en $[0^\\circ,360^\\circ)$ — al llevar el deslizador más allá de $360^\\circ$, el dibujo se repite idéntico.'));
    c4.append(el('p',{class:'note'},'El error clásico es medir $\\theta_r$ contra el eje $y$ cuando el punto queda cerca de la vertical. El arco verde del dibujo siempre nace en el eje horizontal: es la definición.'));
    sec.append(c4);

    /* ---------- Tarjeta 5: los ángulos notables (paso a paso) ---------- */
    const c5=el('div',{class:'card'});
    c5.append(el('h3',{},'Los ángulos notables, uno por uno'));
    c5.append(el('p',{},'El tercer paso de la reducción pide los valores exactos de $30^\\circ$, $45^\\circ$, $60^\\circ$ y $90^\\circ$. Con los botones se avanza de a un ángulo notable por la vuelta completa, con las coordenadas exactas que le corresponden.'));

    const NOT=[
      [0,'(1, 0)'],[30,'(√3/2, 1/2)'],[45,'(√2/2, √2/2)'],[60,'(1/2, √3/2)'],[90,'(0, 1)'],
      [120,'(−1/2, √3/2)'],[135,'(−√2/2, √2/2)'],[150,'(−√3/2, 1/2)'],[180,'(−1, 0)'],
      [210,'(−√3/2, −1/2)'],[225,'(−√2/2, −√2/2)'],[240,'(−1/2, −√3/2)'],[270,'(0, −1)'],
      [300,'(1/2, −√3/2)'],[315,'(√2/2, −√2/2)'],[330,'(√3/2, −1/2)']
    ];
    let iC5=1;   /* arranca en 30°: el 0° no muestra nada interesante */
    const cajaP5=el('div',{class:'plot'}); c5.append(cajaP5);
    const P5=Plano(cajaP5,{xMin:-1.45,xMax:1.45,yMin:-1.45,yMax:1.45,alto:340,iso:true});
    P5.dibujar(P=>{
      const [gr,txt]=NOT[iC5];
      const th=gr*Math.PI/180, cx=Math.cos(th), cy=Math.sin(th);
      P.ejes();
      P.parametrica(a=>[Math.cos(a),Math.sin(a)],0,2*Math.PI,{color:'--grid',grosor:1.4});
      /* todos los notables en gris, para ver la retícula completa */
      NOT.forEach(([g])=>{
        const a=g*Math.PI/180;
        P.punto(Math.cos(a),Math.sin(a),{color:'--grid',r:3});
      });
      P.parametrica(a=>[0.3*Math.cos(a),0.3*Math.sin(a)],0,th,{color:'--s4',grosor:2.2});
      P.parametrica(s=>[cx*s,cy*s],0,1,{color:'--s7',grosor:2.2});
      P.punto(cx,cy,{color:'--s2',r:6});
      P.texto(cx,cy,txt,{color:'--s2',dx:cx>=0?10:-72,dy:cy>=0?-10:18,tam:12});
    });
    const pasoC5=el('span',{class:'cnt'});
    function irC5(d){
      iC5=(iC5+d+NOT.length)%NOT.length;
      const [gr,txt]=NOT[iC5];
      const th=gr*Math.PI/180;
      pasoC5.textContent=(iC5+1)+' de '+NOT.length;
      P5.redibujar();
      leerC5.set([
        ['θ', gr+'°'],
        ['(cos θ, sen θ)', txt],
        ['cos θ', Math.cos(th).toFixed(3)],
        ['sen θ', Math.sin(th).toFixed(3)]
      ]);
    }
    c5.append(el('div',{class:'stepper'},
      el('button',{class:'btn',onclick:()=>irC5(-1)},'◀ Anterior'),
      el('button',{class:'btn primary',onclick:()=>irC5(1)},'Siguiente ▶'),
      pasoC5));
    const leerC5=lectura(c5);
    irC5(0);

    c5.append(el('p',{},'Los dieciséis puntos grises son los notables de la vuelta completa. Todos son el mismo par de valores $\\tfrac12$, $\\tfrac{\\sqrt2}{2}$, $\\tfrac{\\sqrt3}{2}$ repetido, cambiando de lugar y de signo — eso es la reducción al primer cuadrante vista de golpe.'));
    c5.append(el('p',{class:'note'},'Para no confundir $30^\\circ$ con $60^\\circ$: en $30^\\circ$ el seno vale $\\tfrac12$ y el coseno $\\tfrac{\\sqrt3}{2}$, y en $60^\\circ$ los dos valores se intercambian; en $45^\\circ$ coinciden. Ante la duda, el dibujo lo resuelve: en $30^\\circ$ el punto está cerca del eje horizontal, de modo que su altura —el seno— es necesariamente el menor de los dos valores.'));
    sec.append(c5);
  }
});
