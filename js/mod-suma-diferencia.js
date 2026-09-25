/* Formulas para el seno, el coseno y la tangente de la
   suma y la diferencia de dos ángulos.

   La idea grande: sen(a+b) NO es sen a + sen b (tarjeta 1, el error). Lo que
   sí es correcto sale de una construcción geométrica sobre el círculo
   unitario (tarjeta 2): un punto Q a distancia cos b del origen, sobre la
   dirección del ángulo a, y desde ahí un segmento perpendicular de largo
   sen b que llega al punto P = (cos(a+b), sen(a+b)). Las coordenadas de Q y
   P son exactamente los cuatro productos de las fórmulas — no hay nada que
   memorizar aparte. Un selector alterna entre leer esa construcción por su
   alto (seno) o por su ancho (coseno), sin rehacer el dibujo. La diferencia
   (b negativo) usa el mismo dibujo. La tangente sale de dividir seno por
   coseno. */
registerModule({
  id:'suma-diferencia',
  title:'Suma y diferencia de ángulos',
  unidad:'I',
  lead:'El seno de una suma no es la suma de los senos. Lo que sí es, sale de un dibujo.',
  build(sec){

    /* Q = cos b · (cos a, sen a)  — sobre el rayo del ángulo a, a distancia cos b.
       P = Q + sen b · (−sen a, cos a) — perpendicular a ese rayo, largo sen b.
       Da exactamente P = (cos(a+b), sen(a+b)); verificado aparte con Node, junto
       con que Qx = cos a cos b, Qy = sen a cos b, Px−Qx = −sen a sen b y
       Py−Qy = cos a sen b: los mismos dos segmentos codifican los cuatro
       productos, leídos por alto (seno) o por ancho (coseno). */
    function construir(aDeg,bDeg){
      const ar=aDeg*Math.PI/180, br=bDeg*Math.PI/180;
      const Qx=Math.cos(ar)*Math.cos(br), Qy=Math.sin(ar)*Math.cos(br);
      const Px=Qx-Math.sin(br)*Math.sin(ar), Py=Qy+Math.sin(br)*Math.cos(ar);
      return {ar,br,Qx,Qy,Px,Py};
    }
    function fmt(x){ return (isFinite(x)&&Math.abs(x)<1e4) ? x.toFixed(3) : 'indef.'; }

    /* ---------- Tarjeta 1: el error clásico (animada) ---------- */
    const c1=el('div',{class:'card'});
    c1.append(el('h3',{},'$\\operatorname{sen}(a+b)$ no es $\\operatorname{sen}a+\\operatorname{sen}b$'));
    c1.append(el('p',{},'Es tentador "repartir" el seno sobre la suma, como si fuera una multiplicación. No se puede: abajo $a=50°$ queda fijo y $b$ se mueve solo; la curva azul es $\\operatorname{sen}(a+b)$ y la ámbar es $\\operatorname{sen}a+\\operatorname{sen}b$. Son dos alturas distintas para el mismo $b$, salvo en el caso trivial.'));

    const leerC1=el('p',{class:'note'});
    const cajaP1=el('div',{class:'plot'}); c1.append(cajaP1);
    const P1=Plano(cajaP1,{xMin:-Math.PI,xMax:Math.PI,yMin:-2.3,yMax:2.3,alto:300});
    P1.animar((P,t)=>{
      const aFix=50*Math.PI/180;
      const bCur=Math.PI*Math.sin(2*Math.PI*t/8);
      P.ejes();
      P.curva(b=>Math.sin(aFix+b),{color:'--s1',grosor:2.6});
      P.curva(b=>Math.sin(aFix)+Math.sin(b),{color:'--s6',grosor:2.6});
      P.texto(-Math.PI+0.15,2.05,'sen(a+b)',{color:'--s1',tam:12});
      P.texto(-Math.PI+0.15,1.78,'sen a + sen b',{color:'--s6',tam:12});
      const y1=Math.sin(aFix+bCur), y2=Math.sin(aFix)+Math.sin(bCur);
      P.parametrica(s=>[bCur,y2+(y1-y2)*s],0,1,{color:'--muted',grosor:1.4,guiones:true});
      P.punto(bCur,y1,{color:'--s1',r:5});
      P.punto(bCur,y2,{color:'--s6',r:5});
      leerC1.textContent='b = '+(bCur*180/Math.PI).toFixed(0)+'° · sen(a+b) = '+y1.toFixed(3)
        +' · sen a + sen b = '+y2.toFixed(3)+' · diferencia = '+(y1-y2).toFixed(3);
    },{duracion:8});
    c1.append(leerC1);

    c1.append(el('p',{class:'note'},'Las dos curvas se tocan una sola vez por vuelta, justo en $b=0°$: ahí "sen a + sen 0" y "sen(a+0)" son la misma cosa por definición, no una coincidencia de la suma. En cualquier otro $b$ el hueco entre las dos alturas es real y no se cierra.'));
    c1.append(el('p',{class:'note'},'Lo que sí es correcto sale de un dibujo, no de repartir el seno: la tarjeta siguiente muestra de dónde salen los productos $\\operatorname{sen}a\\cos b$ y $\\cos a\\operatorname{sen}b$, para el seno y para el coseno.'));
    sec.append(c1);

    /* ---------- Tarjeta 2: la construcción, con selector seno/coseno (deslizadores) ---------- */
    const c2=el('div',{class:'card'});
    c2.append(el('h3',{},'De dónde salen el seno y el coseno de la suma'));
    c2.append(el('p',{},'Sobre el círculo unitario, el punto $Q$ queda a distancia $\\cos b$ del origen, en la dirección del ángulo $a$; desde $Q$, un segmento perpendicular de largo $\\operatorname{sen}b$ llega al punto $P$, que es el ángulo $a+b$. El selector cambia qué proyección de ese mismo dibujo queda resaltada.'));

    let modo2='sen', aG2=40, bG2=30;
    btnGroup(c2,[{label:'seno',value:'sen'},{label:'coseno',value:'cos'}],v=>{ modo2=v; render2(); });

    const cajaP2=el('div',{class:'plot'}); c2.append(cajaP2);
    const P2=Plano(cajaP2,{xMin:-1.95,xMax:1.9,yMin:-2.4,yMax:1.9,alto:400,iso:true});
    function pintarC2(P){
      const {ar,br,Qx,Qy,Px,Py}=construir(aG2,bG2);
      P.ejes();
      P.parametrica(a=>[Math.cos(a),Math.sin(a)],0,2*Math.PI,{color:'--grid',grosor:1.4});
      /* arcos de a y de a+b, medidos siempre desde el eje x */
      P.parametrica(s=>[0.22*Math.cos(ar*s),0.22*Math.sin(ar*s)],0,1,{color:'--s4',grosor:2});
      P.parametrica(s=>[0.34*Math.cos(ar+br*s),0.34*Math.sin(ar+br*s)],0,1,{color:'--s6',grosor:2});
      /* los dos segmentos de la construcción: origen→Q y Q→P */
      P.parametrica(s=>[Qx*s,Qy*s],0,1,{color:'--s1',grosor:3.2});
      P.parametrica(s=>[Qx+(Px-Qx)*s,Qy+(Py-Qy)*s],0,1,{color:'--s2',grosor:3.2});
      P.punto(Qx,Qy,{color:'--s1',r:5});
      P.punto(Px,Py,{color:'--s7',r:5});
      P.texto(Qx,Qy,'Q',{color:'--s1',tam:13,dx:Qx>=0?12:-22,dy:Qy>=0?-12:19});
      P.texto(Px,Py,'P',{color:'--s7',tam:13,dx:Px>=0?12:-22,dy:Py>=0?-12:19});
      P.texto(0.3*Math.cos(ar/2),0.3*Math.sin(ar/2),'a',{color:'--s4',tam:12});
      P.texto(0.42*Math.cos(ar+br/2),0.42*Math.sin(ar+br/2),'b',{color:'--s6',tam:12});
      if(modo2==='sen'){
        /* barra de la izquierda, en escalera para que el segundo tramo no
           tape al primero cuando "retrocede" (b negativo o a obtuso):
           columna 1 = sen a cos b (altura de Q), columna 2 = cos a sen b */
        const bx1=-1.72, bx2=-1.52;
        P.parametrica(s=>[bx1,Qy*s],0,1,{color:'--s1',grosor:6});
        P.parametrica(s=>[bx2,Qy+(Py-Qy)*s],0,1,{color:'--s2',grosor:6});
        P.parametrica(s=>[bx1+(bx2-bx1)*s,Qy],0,1,{color:'--muted',grosor:1});
        P.parametrica(s=>[bx1+(Qx-bx1)*s,Qy],0,1,{color:'--muted',grosor:1,guiones:true});
        P.parametrica(s=>[bx2+(Px-bx2)*s,Py],0,1,{color:'--muted',grosor:1,guiones:true});
      }else{
        /* barra de abajo, misma lógica: fila 1 = cos a cos b (ancho de Q),
           fila 2 = −sen a sen b */
        const by1=-1.68, by2=-1.9;
        P.parametrica(s=>[Qx*s,by1],0,1,{color:'--s1',grosor:6});
        P.parametrica(s=>[Qx+(Px-Qx)*s,by2],0,1,{color:'--s2',grosor:6});
        P.parametrica(s=>[Qx,by1+(by2-by1)*s],0,1,{color:'--muted',grosor:1});
        P.parametrica(s=>[Qx,by1+(Qy-by1)*s],0,1,{color:'--muted',grosor:1,guiones:true});
        P.parametrica(s=>[Px,by2+(Py-by2)*s],0,1,{color:'--muted',grosor:1,guiones:true});
      }
    }
    P2.dibujar(pintarC2);

    controlValor(c2,{label:'a',min:-60,max:150,paso:1,valor:aG2,unidad:'°',
      onChange:v=>{ aG2=v; render2(); }});
    controlValor(c2,{label:'b',min:-70,max:70,paso:1,valor:bG2,unidad:'°',
      onChange:v=>{ bG2=v; render2(); }});

    const leyendaC2=el('div',{class:'legend'}); c2.append(leyendaC2);
    const notaC2=el('p',{class:'note'}); c2.append(notaC2);
    const leerC2=lectura(c2);
    const formulaC2=el('div',{class:'formula'}); c2.append(formulaC2);

    function render2(){
      P2.redibujar();
      const {ar,br,Qx,Qy,Px,Py}=construir(aG2,bG2);
      leyendaC2.textContent='';
      if(modo2==='sen'){
        leyendaC2.append(
          el('span',{},el('span',{class:'sw',style:'background:var(--s1)'}),el('b',{},'sen a · cos b'),' — altura de Q'),
          el('span',{},el('span',{class:'sw',style:'background:var(--s2)'}),el('b',{},'cos a · sen b'),' — tramo de Q a P')
        );
        notaC2.innerHTML='La barra de la izquierda apila las dos alturas: el tramo azul, desde el eje hasta la altura de $Q$, y el verde encima, desde esa altura hasta la de $P$. Juntas llegan exactamente a la altura de $P$, que es $\\operatorname{sen}(a+b)$.';
        renderMath(notaC2);
        formulaC2.innerHTML='$$\\operatorname{sen}(a+b)=\\operatorname{sen}a\\cos b+\\cos a\\operatorname{sen}b \\qquad \\operatorname{sen}(a-b)=\\operatorname{sen}a\\cos b-\\cos a\\operatorname{sen}b$$';
        renderMath(formulaC2);
        leerC2.set([
          ['a', aG2+'°'], ['b', bG2+'°'],
          ['sen a · cos b', (Math.sin(ar)*Math.cos(br)).toFixed(3)],
          ['cos a · sen b', (Math.cos(ar)*Math.sin(br)).toFixed(3)],
          ['suma de las dos', Py.toFixed(3)],
          ['sen(a+b)', Math.sin(ar+br).toFixed(3)]
        ]);
      }else{
        leyendaC2.append(
          el('span',{},el('span',{class:'sw',style:'background:var(--s1)'}),el('b',{},'cos a · cos b'),' — ancho de Q'),
          el('span',{},el('span',{class:'sw',style:'background:var(--s2)'}),el('b',{},'−sen a · sen b'),' — tramo de Q a P')
        );
        notaC2.innerHTML='La barra de abajo apila los dos anchos: el tramo azul, desde el eje hasta el ancho de $Q$, y el verde a continuación, que retrocede porque $\\operatorname{sen}a\\operatorname{sen}b$ resta en vez de sumar. Juntos llegan exactamente al ancho de $P$, que es $\\cos(a+b)$.';
        renderMath(notaC2);
        formulaC2.innerHTML='$$\\cos(a+b)=\\cos a\\cos b-\\operatorname{sen}a\\operatorname{sen}b \\qquad \\cos(a-b)=\\cos a\\cos b+\\operatorname{sen}a\\operatorname{sen}b$$';
        renderMath(formulaC2);
        leerC2.set([
          ['a', aG2+'°'], ['b', bG2+'°'],
          ['cos a · cos b', (Math.cos(ar)*Math.cos(br)).toFixed(3)],
          ['−sen a · sen b', (-Math.sin(ar)*Math.sin(br)).toFixed(3)],
          ['suma de las dos', Px.toFixed(3)],
          ['cos(a+b)', Math.cos(ar+br).toFixed(3)]
        ]);
      }
    }
    render2();

    c2.append(el('p',{class:'note'},'El punto $Q$ y el punto $P$ son los mismos para las dos opciones del selector: lo único que cambia es cuál de sus dos coordenadas —la altura o el ancho— queda resaltada en la barra y en la fórmula. Con $b$ negativo el dibujo no cambia de forma: da directamente la resta, porque $\\operatorname{sen}(-b)=-\\operatorname{sen}b$ y $\\cos(-b)=\\cos b$.'));
    c2.append(el('p',{class:'note'},'Ejemplo: $\\operatorname{sen}(75°)=\\operatorname{sen}(45°+30°)=\\tfrac{\\sqrt6+\\sqrt2}{4}\\approx0{,}966$ — el mismo valor que da una calculadora para $75°$, sin tabla para ese ángulo.'));
    sec.append(c2);

    /* ---------- Tarjeta 3: comprobación numérica con dos deslizadores ---------- */
    const c3=el('div',{class:'card'});
    c3.append(el('h3',{},'Comprobación en vivo, para cualquier $a$ y $b$'));
    c3.append(el('p',{},'Al mover $a$ y $b$ con total libertad —incluido $b$ negativo, que es la resta— se leen abajo, en vivo, los dos lados de cada una de las tres identidades. Que coincidan siempre, para cualquier valor, es lo que las hace identidades y no solo una igualdad de casualidad.'));

    let aG3=50, bG3=-25;
    const cajaP3=el('div',{class:'plot'}); c3.append(cajaP3);
    const P3=Plano(cajaP3,{xMin:-1.9,xMax:1.5,yMin:-1.9,yMax:1.75,alto:380,iso:true});
    function pintarC3(P){
      const {ar,br,Qx,Qy,Px,Py}=construir(aG3,bG3);
      P.ejes();
      P.parametrica(a=>[Math.cos(a),Math.sin(a)],0,2*Math.PI,{color:'--grid',grosor:1.4});
      P.parametrica(s=>[Qx*s,Qy*s],0,1,{color:'--s1',grosor:3});
      P.parametrica(s=>[Qx+(Px-Qx)*s,Qy+(Py-Qy)*s],0,1,{color:'--s2',grosor:3});
      P.punto(Qx,Qy,{color:'--s1',r:4});
      P.punto(Px,Py,{color:'--s7',r:5});
      P.texto(Qx,Qy,'Q',{color:'--s1',tam:12,dx:Qx>=0?9:-18,dy:Qy>=0?-9:15});
      P.texto(Px,Py,'P',{color:'--s7',tam:12,dx:Px>=0?9:-18,dy:Py>=0?-9:15});
      /* franja de alturas (izquierda, sen) y de anchos (abajo, cos), a la vez —
         en escalera para que el segundo tramo no tape al primero al retroceder */
      const bx1=-1.62,bx2=-1.44, by1=-1.62,by2=-1.8;
      P.parametrica(s=>[bx1,Qy*s],0,1,{color:'--s1',grosor:5});
      P.parametrica(s=>[bx2,Qy+(Py-Qy)*s],0,1,{color:'--s2',grosor:5});
      P.parametrica(s=>[Qx*s,by1],0,1,{color:'--s1',grosor:5});
      P.parametrica(s=>[Qx+(Px-Qx)*s,by2],0,1,{color:'--s2',grosor:5});
    }
    P3.dibujar(pintarC3);
    function actualizarC3(){
      P3.redibujar();
      const ar=aG3*Math.PI/180, br=bG3*Math.PI/180;
      const senI=Math.sin(ar+br), senD=Math.sin(ar)*Math.cos(br)+Math.cos(ar)*Math.sin(br);
      const cosI=Math.cos(ar+br), cosD=Math.cos(ar)*Math.cos(br)-Math.sin(ar)*Math.sin(br);
      const ta=Math.tan(ar), tb=Math.tan(br);
      const tanI=Math.tan(ar+br), tanD=(ta+tb)/(1-ta*tb);
      leerC3.set([
        ['sen(a+b)', fmt(senI)],
        ['sen a cos b + cos a sen b', fmt(senD)],
        ['cos(a+b)', fmt(cosI)],
        ['cos a cos b − sen a sen b', fmt(cosD)],
        ['tan(a+b)', fmt(tanI)],
        ['(tan a+tan b)/(1−tan a tan b)', fmt(tanD)]
      ]);
    }
    controlValor(c3,{label:'a',min:-170,max:170,paso:1,valor:aG3,unidad:'°',
      onChange:v=>{ aG3=v; actualizarC3(); }});
    controlValor(c3,{label:'b',min:-170,max:170,paso:1,valor:bG3,unidad:'°',
      onChange:v=>{ bG3=v; actualizarC3(); }});
    const leerC3=lectura(c3);
    actualizarC3();

    c3.append(el('p',{class:'note'},'Cerca de $a+b=\\pm90°$ la tangente se dispara y el valor puede mostrar «indef.» de un lado nada más por redondeo —es redondeo, no un error de la fórmula.'));
    sec.append(c3);

    /* ---------- Tarjeta 4: la tangente, dividiendo seno por coseno ---------- */
    const c4=el('div',{class:'card'});
    c4.append(el('h3',{},'La tangente sale de dividir'));
    c4.append(el('p',{},'$\\tan(a+b)$ es, por definición, $\\operatorname{sen}(a+b)/\\cos(a+b)$. Reemplazando las dos fórmulas anteriores y dividiendo arriba y abajo por $\\cos a\\cos b$, cada término queda en tangentes: $\\operatorname{sen}a\\operatorname{sen}b/(\\cos a\\cos b)=\\tan a\\tan b$, y por eso ese producto aparece restando en el denominador.'));

    let aG4=15, bG4=18;
    const cajaP4=el('div',{class:'plot'}); c4.append(cajaP4);
    const P4=Plano(cajaP4,{xMin:-1.3,xMax:1.9,yMin:-1.6,yMax:1.6,alto:380,iso:true});
    function pintarC4(P){
      const ar=aG4*Math.PI/180, br=bG4*Math.PI/180, ab=ar+br;
      const ta=Math.tan(ar), tb=Math.tan(br), tab=Math.tan(ab);
      P.ejes();
      P.parametrica(a=>[Math.cos(a),Math.sin(a)],0,2*Math.PI,{color:'--grid',grosor:1.4});
      const w=P.ventana();
      P.parametrica(s=>[1,w.yMin+(w.yMax-w.yMin)*s],0,1,{color:'--grid',grosor:1.6,guiones:true});
      P.texto(1,w.yMax*0.92,'x = 1',{color:'--muted',dx:6});
      /* los tres rayos desde el origen, extendidos hasta la recta x=1 */
      P.parametrica(s=>[s,s*ta],0,1,{color:'--s1',grosor:2.4});
      P.parametrica(s=>[s,s*tb],0,1,{color:'--s6',grosor:2.4});
      P.parametrica(s=>[s,s*tab],0,1,{color:'--s7',grosor:2.8});
      P.punto(1,ta,{color:'--s1',r:4});
      P.punto(1,tb,{color:'--s6',r:4});
      P.punto(1,tab,{color:'--s7',r:5});
      P.texto(1,ta,'tan a',{color:'--s1',dx:8,dy:ta>=0?-6:14});
      P.texto(1,tb,'tan b',{color:'--s6',dx:8,dy:tb>=0?14:-6});
      P.texto(1,tab,'tan(a+b)',{color:'--s7',dx:8,dy:tab>=0?-6:14});
    }
    P4.dibujar(pintarC4);
    function actualizarC4(){
      P4.redibujar();
      const ar=aG4*Math.PI/180, br=bG4*Math.PI/180;
      const ta=Math.tan(ar), tb=Math.tan(br), tab=Math.tan(ar+br);
      leerC4.set([
        ['a', aG4+'°'], ['b', bG4+'°'],
        ['tan a', ta.toFixed(3)], ['tan b', tb.toFixed(3)],
        ['(tan a+tan b)/(1−tan a tan b)', ((ta+tb)/(1-ta*tb)).toFixed(3)],
        ['tan(a+b) medido', tab.toFixed(3)]
      ]);
    }
    controlValor(c4,{label:'a',min:-25,max:25,paso:1,valor:aG4,unidad:'°',
      onChange:v=>{ aG4=v; actualizarC4(); }});
    controlValor(c4,{label:'b',min:-25,max:25,paso:1,valor:bG4,unidad:'°',
      onChange:v=>{ bG4=v; actualizarC4(); }});
    const leerC4=lectura(c4);
    actualizarC4();

    c4.append(el('p',{class:'note'},'Los tres puntos son donde el rayo de cada ángulo cruza la recta $x=1$: su altura ahí es, por definición, la tangente. El rayo violeta (la suma) siempre cae donde predice la fórmula, incluso con $b$ negativo.'));
    c4.append(el('div',{class:'formula',html:'$$\\tan(a+b)=\\frac{\\tan a+\\tan b}{1-\\tan a\\tan b} \\qquad \\tan(a-b)=\\frac{\\tan a-\\tan b}{1+\\tan a\\tan b}$$'}));
    c4.append(el('p',{class:'note'},'La diferencia solo cambia el signo del término $\\tan a\\tan b$, arriba y abajo: sale de reemplazar $b$ por $-b$ y usar que $\\tan(-b)=-\\tan b$.'));
    sec.append(c4);
  }
});
