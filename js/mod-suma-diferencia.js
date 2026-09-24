/* Clase 2 del curso: fórmulas para el seno, el coseno y la tangente de la
   suma y la diferencia de dos ángulos.

   La idea grande: sen(a+b) NO es sen a + sen b (tarjeta 1, el error). Lo que
   sí es correcto sale de una construcción geométrica sobre el círculo
   unitario (tarjetas 2 y 3): un punto Q a distancia cos b del origen, sobre
   la dirección del ángulo a, y desde ahí un segmento perpendicular de largo
   sen b que llega al punto P = (cos(a+b), sen(a+b)). Las coordenadas de Q y P
   son exactamente los cuatro productos de las fórmulas — no hay nada que
   memorizar aparte. La diferencia (b negativo) usa el mismo dibujo, sin
   rehacerlo. La tangente sale de dividir seno por coseno. */
registerModule({
  id:'suma-diferencia',
  title:'Suma y diferencia de ángulos',
  unidad:'I',
  lead:'El seno de una suma no es la suma de los senos. Lo que sí es, sale de un dibujo.',
  build(sec){

    /* Q = cos b · (cos a, sen a)  — sobre el rayo del ángulo a, a distancia cos b.
       P = Q + sen b · (−sen a, cos a) — perpendicular a ese rayo, largo sen b.
       Da exactamente P = (cos(a+b), sen(a+b)); verificado aparte con Node. */
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
    c1.append(el('p',{class:'note'},'Lo que sí es correcto sale de un dibujo, no de repartir el seno: las dos tarjetas siguientes muestran de dónde salen los productos $\\operatorname{sen}a\\cos b$ y $\\cos a\\operatorname{sen}b$.'));
    c1.append(el('p',{class:'fuente'},'Fuente: motivación de la Clase 2 «Fórmulas para la suma y diferencia de ángulos» (Geometría 2026-2); la comparación de curvas es elaboración propia.'));
    sec.append(c1);

    /* ---------- Tarjeta 2: la construcción del seno (animada + slider de a) ---------- */
    const c2=el('div',{class:'card'});
    c2.append(el('h3',{},'De dónde sale el seno de la suma'));
    c2.append(el('p',{},'Sobre el círculo unitario, el punto $Q$ está a distancia $\\cos b$ del origen, en la dirección del ángulo $a$. Desde $Q$, un segmento perpendicular de largo $\\operatorname{sen}b$ llega al punto $P$ del ángulo $a+b$. La altura de $Q$ es $\\operatorname{sen}a\\cos b$ y el tramo que le falta a $P$ es $\\cos a\\operatorname{sen}b$ — la franja de la izquierda los apila.'));

    let aG2=40;
    const leerC2=el('p',{class:'note'});
    const cajaP2=el('div',{class:'plot'}); c2.append(cajaP2);
    const P2=Plano(cajaP2,{xMin:-1.9,xMax:1.5,yMin:-1.3,yMax:1.75,alto:380,iso:true});
    P2.animar((P,t)=>{
      const bDeg=70*Math.sin(2*Math.PI*t/10);
      const {ar,br,Qx,Qy,Px,Py}=construir(aG2,bDeg);
      P.ejes();
      P.parametrica(a=>[Math.cos(a),Math.sin(a)],0,2*Math.PI,{color:'--grid',grosor:1.4});
      /* arcos de a y de a+b, medidos siempre desde el eje x */
      P.parametrica(s=>[0.22*Math.cos(ar*s),0.22*Math.sin(ar*s)],0,1,{color:'--s4',grosor:2});
      P.parametrica(s=>[0.34*Math.cos(ar+br*s),0.34*Math.sin(ar+br*s)],0,1,{color:'--s6',grosor:2});
      /* los dos segmentos de la construcción */
      P.parametrica(s=>[Qx*s,Qy*s],0,1,{color:'--s1',grosor:3.2});
      P.parametrica(s=>[Qx+(Px-Qx)*s,Qy+(Py-Qy)*s],0,1,{color:'--s2',grosor:3.2});
      P.punto(Qx,Qy,{color:'--s1',r:4});
      P.punto(Px,Py,{color:'--s7',r:5});
      P.texto(0.3*Math.cos(ar/2),0.3*Math.sin(ar/2),'a',{color:'--s4',tam:12});
      P.texto(0.42*Math.cos(ar+br/2),0.42*Math.sin(ar+br/2),'b',{color:'--s6',tam:12});
      /* franja de alturas a la izquierda, en escalera para que el segundo tramo
         nunca tape al primero cuando "retrocede" (b negativo o a obtuso):
         columna 1 = sen a cos b, columna 2 (corrida) = cos a sen b */
      const bx1=-1.62, bx2=-1.42;
      P.parametrica(s=>[bx1,Qy*s],0,1,{color:'--s1',grosor:6});
      P.parametrica(s=>[bx2,Qy+(Py-Qy)*s],0,1,{color:'--s2',grosor:6});
      P.parametrica(s=>[bx1+(bx2-bx1)*s,Qy],0,1,{color:'--muted',grosor:1});
      P.parametrica(s=>[bx1+(Qx-bx1)*s,Qy],0,1,{color:'--muted',grosor:1,guiones:true});
      P.parametrica(s=>[bx2+(Px-bx2)*s,Py],0,1,{color:'--muted',grosor:1,guiones:true});
      P.texto(bx1-0.02,1.55,'sen a cos b',{color:'--s1',tam:11,dx:-70});
      P.texto(bx1-0.02,1.32,'cos a sen b',{color:'--s2',tam:11,dx:-70});
      leerC2.textContent='a = '+aG2+'° · b = '+bDeg.toFixed(0)+'° · sen a cos b = '+(Math.sin(ar)*Math.cos(br)).toFixed(3)
        +' · cos a sen b = '+(Math.cos(ar)*Math.sin(br)).toFixed(3)+' · suma = '+Py.toFixed(3)
        +' · sen(a+b) = '+Math.sin(ar+br).toFixed(3);
    },{duracion:10});
    c2.append(leerC2);
    c2.append(el('div',{class:'controls'},
      el('label',{},'a:'),
      el('input',{type:'range',min:'-60',max:'150',step:'1',value:String(aG2),
        oninput:e=>{ aG2=parseInt(e.target.value,10); }})
    ));

    c2.append(el('p',{class:'note'},'La franja izquierda es literalmente la suma: el tramo azul de abajo mide $\\operatorname{sen}a\\cos b$ y el verde de arriba mide $\\cos a\\operatorname{sen}b$; juntos llegan exactamente a la altura de $P$, que es $\\operatorname{sen}(a+b)$. En la animación $b$ también pasa por negativos — ahí el mismo dibujo da la resta, porque $\\operatorname{sen}(-b)=-\\operatorname{sen}b$ y $\\cos(-b)=\\cos b$.'));
    c2.append(el('div',{class:'formula',html:'$$\\operatorname{sen}(a+b)=\\operatorname{sen}a\\cos b+\\cos a\\operatorname{sen}b \\qquad \\operatorname{sen}(a-b)=\\operatorname{sen}a\\cos b-\\cos a\\operatorname{sen}b$$'}));
    c2.append(el('p',{class:'note'},'Ejemplo: $\\operatorname{sen}(75°)=\\operatorname{sen}(45°+30°)=\\tfrac{\\sqrt6+\\sqrt2}{4}\\approx0{,}966$ — el mismo valor que da una calculadora para $75°$, sin tabla para ese ángulo.'));
    c2.append(el('p',{class:'fuente'},'Fuente: Clase 2 «Fórmulas para la suma y diferencia de ángulos», Teorema 2.1 (Geometría 2026-2); la construcción geométrica con $Q$ y $P$ es elaboración propia sobre el mismo círculo unitario.'));
    sec.append(c2);

    /* ---------- Tarjeta 3: la construcción del coseno (animada + slider de a) ---------- */
    const c3=el('div',{class:'card'});
    c3.append(el('h3',{},'De dónde sale el coseno de la suma'));
    c3.append(el('p',{},'Es el mismo dibujo, mirado por su ancho en vez de por su alto. $Q$ está a distancia $\\cos a\\cos b$ del eje $y$; el tramo que falta hasta $P$ vale $-\\operatorname{sen}a\\operatorname{sen}b$ — un retroceso, no un avance, y de ahí sale el signo menos.'));

    let aG3=35;
    const leerC3=el('p',{class:'note'});
    const cajaP3=el('div',{class:'plot'}); c3.append(cajaP3);
    const P3=Plano(cajaP3,{xMin:-1.4,xMax:1.4,yMin:-2.35,yMax:1.5,alto:380,iso:true});
    P3.animar((P,t)=>{
      const bDeg=70*Math.sin(2*Math.PI*t/10);
      const {ar,br,Qx,Qy,Px,Py}=construir(aG3,bDeg);
      P.ejes();
      P.parametrica(a=>[Math.cos(a),Math.sin(a)],0,2*Math.PI,{color:'--grid',grosor:1.4});
      P.parametrica(s=>[0.22*Math.cos(ar*s),0.22*Math.sin(ar*s)],0,1,{color:'--s4',grosor:2});
      P.parametrica(s=>[0.34*Math.cos(ar+br*s),0.34*Math.sin(ar+br*s)],0,1,{color:'--s6',grosor:2});
      P.parametrica(s=>[Qx*s,Qy*s],0,1,{color:'--s1',grosor:3.2});
      P.parametrica(s=>[Qx+(Px-Qx)*s,Qy+(Py-Qy)*s],0,1,{color:'--s2',grosor:3.2});
      P.punto(Qx,Qy,{color:'--s1',r:4});
      P.punto(Px,Py,{color:'--s7',r:5});
      P.texto(0.3*Math.cos(ar/2),0.3*Math.sin(ar/2),'a',{color:'--s4',tam:12});
      P.texto(0.42*Math.cos(ar+br/2),0.42*Math.sin(ar+br/2),'b',{color:'--s6',tam:12});
      /* franja de anchos, en escalera (misma razón que en la tarjeta del seno):
         fila 1 = cos a cos b, fila 2 (corrida hacia abajo) = −sen a sen b */
      const by1=-1.55, by2=-1.78;
      P.parametrica(s=>[Qx*s,by1],0,1,{color:'--s1',grosor:6});
      P.parametrica(s=>[Qx+(Px-Qx)*s,by2],0,1,{color:'--s2',grosor:6});
      P.parametrica(s=>[Qx,by1+(by2-by1)*s],0,1,{color:'--muted',grosor:1});
      P.parametrica(s=>[Qx,by1+(Qy-by1)*s],0,1,{color:'--muted',grosor:1,guiones:true});
      P.parametrica(s=>[Px,by2+(Py-by2)*s],0,1,{color:'--muted',grosor:1,guiones:true});
      P.texto(-1.3,by2-0.14,'cos a cos b',{color:'--s1',tam:11});
      P.texto(-1.3,by2-0.32,'−sen a sen b',{color:'--s2',tam:11});
      leerC3.textContent='a = '+aG3+'° · b = '+bDeg.toFixed(0)+'° · cos a cos b = '+(Math.cos(ar)*Math.cos(br)).toFixed(3)
        +' · −sen a sen b = '+(-Math.sin(ar)*Math.sin(br)).toFixed(3)+' · suma = '+Px.toFixed(3)
        +' · cos(a+b) = '+Math.cos(ar+br).toFixed(3);
    },{duracion:10});
    c3.append(leerC3);
    c3.append(el('div',{class:'controls'},
      el('label',{},'a:'),
      el('input',{type:'range',min:'-60',max:'150',step:'1',value:String(aG3),
        oninput:e=>{ aG3=parseInt(e.target.value,10); }})
    ));

    c3.append(el('p',{class:'note'},'Cuando $b$ crece desde $0°$, $Q$ y $P$ se acercan y el tramo verde se acorta cada vez más — por eso resta y no suma. La franja de abajo termina exactamente en la coordenada horizontal de $P$, que es $\\cos(a+b)$.'));
    c3.append(el('div',{class:'formula',html:'$$\\cos(a+b)=\\cos a\\cos b-\\operatorname{sen}a\\operatorname{sen}b \\qquad \\cos(a-b)=\\cos a\\cos b+\\operatorname{sen}a\\operatorname{sen}b$$'}));
    c3.append(el('p',{class:'note'},'La diferencia cambia el signo del segundo término porque $\\operatorname{sen}(-b)=-\\operatorname{sen}b$: el retroceso se vuelve avance, y el "menos" del teorema pasa a "más".'));
    c3.append(el('p',{class:'fuente'},'Fuente: Clase 2, Teorema 2.2 (Geometría 2026-2); la construcción geométrica es elaboración propia sobre el mismo círculo unitario de la tarjeta anterior.'));
    sec.append(c3);

    /* ---------- Tarjeta 4: comprobación numérica con dos deslizadores ---------- */
    const c4=el('div',{class:'card'});
    c4.append(el('h3',{},'Comprobación en vivo, para cualquier $a$ y $b$'));
    c4.append(el('p',{},'Al mover $a$ y $b$ con total libertad — incluido $b$ negativo, que es la resta — se leen en vivo, abajo, los dos lados de cada una de las tres identidades. Que coincidan siempre, para cualquier valor, es lo que las hace identidades y no solo una igualdad de casualidad.'));

    let aG4=50, bG4=-25;
    const leerSenC4=el('p',{class:'note'}), leerCosC4=el('p',{class:'note'}), leerTanC4=el('p',{class:'note'});
    const cajaP4=el('div',{class:'plot'}); c4.append(cajaP4);
    const P4=Plano(cajaP4,{xMin:-1.9,xMax:1.5,yMin:-1.9,yMax:1.75,alto:380,iso:true});
    function pintarC4(P){
      const {ar,br,Qx,Qy,Px,Py}=construir(aG4,bG4);
      P.ejes();
      P.parametrica(a=>[Math.cos(a),Math.sin(a)],0,2*Math.PI,{color:'--grid',grosor:1.4});
      P.parametrica(s=>[Qx*s,Qy*s],0,1,{color:'--s1',grosor:3});
      P.parametrica(s=>[Qx+(Px-Qx)*s,Qy+(Py-Qy)*s],0,1,{color:'--s2',grosor:3});
      P.punto(Qx,Qy,{color:'--s1',r:4});
      P.punto(Px,Py,{color:'--s7',r:5});
      /* franja de alturas (izquierda, sen) y de anchos (abajo, cos), a la vez —
         en escalera para que el segundo tramo no tape al primero al retroceder */
      const bx1=-1.62,bx2=-1.44, by1=-1.62,by2=-1.8;
      P.parametrica(s=>[bx1,Qy*s],0,1,{color:'--s1',grosor:5});
      P.parametrica(s=>[bx2,Qy+(Py-Qy)*s],0,1,{color:'--s2',grosor:5});
      P.parametrica(s=>[Qx*s,by1],0,1,{color:'--s1',grosor:5});
      P.parametrica(s=>[Qx+(Px-Qx)*s,by2],0,1,{color:'--s2',grosor:5});
    }
    P4.dibujar(pintarC4);
    function actualizarC4(){
      P4.redibujar();
      const ar=aG4*Math.PI/180, br=bG4*Math.PI/180;
      const senI=Math.sin(ar+br), senD=Math.sin(ar)*Math.cos(br)+Math.cos(ar)*Math.sin(br);
      const cosI=Math.cos(ar+br), cosD=Math.cos(ar)*Math.cos(br)-Math.sin(ar)*Math.sin(br);
      const ta=Math.tan(ar), tb=Math.tan(br);
      const tanI=Math.tan(ar+br), tanD=(ta+tb)/(1-ta*tb);
      leerSenC4.textContent='sen(a+b) = '+fmt(senI)+'  ·  sen a cos b + cos a sen b = '+fmt(senD);
      leerCosC4.textContent='cos(a+b) = '+fmt(cosI)+'  ·  cos a cos b − sen a sen b = '+fmt(cosD);
      leerTanC4.textContent='tan(a+b) = '+fmt(tanI)+'  ·  (tan a + tan b) / (1 − tan a tan b) = '+fmt(tanD);
    }
    c4.append(el('div',{class:'controls'},
      el('label',{},'a:'),
      el('input',{type:'range',min:'-170',max:'170',step:'1',value:String(aG4),
        oninput:e=>{ aG4=parseInt(e.target.value,10); actualizarC4(); }}),
      el('label',{},'b:'),
      el('input',{type:'range',min:'-170',max:'170',step:'1',value:String(bG4),
        oninput:e=>{ bG4=parseInt(e.target.value,10); actualizarC4(); }})
    ));
    c4.append(leerSenC4); c4.append(leerCosC4); c4.append(leerTanC4);
    actualizarC4();

    c4.append(el('p',{class:'note'},'Cerca de $a+b=\\pm90°$ la tangente se dispara y el deslizador puede mostrar "indef." de un lado nada más por redondeo — es el mismo aviso de la Clase 1, no un error de la fórmula.'));
    c4.append(el('p',{class:'fuente'},'Fuente: Clase 2, Teoremas 2.1, 2.2 y 2.3 (Geometría 2026-2).'));
    sec.append(c4);

    /* ---------- Tarjeta 5: la tangente, dividiendo seno por coseno ---------- */
    const c5=el('div',{class:'card'});
    c5.append(el('h3',{},'La tangente sale de dividir'));
    c5.append(el('p',{},'$\\tan(a+b)$ es, por definición, $\\operatorname{sen}(a+b)/\\cos(a+b)$. Reemplazando las dos fórmulas anteriores y dividiendo arriba y abajo por $\\cos a\\cos b$, cada término queda en tangentes: $\\operatorname{sen}a\\operatorname{sen}b/(\\cos a\\cos b)=\\tan a\\tan b$, y por eso ese producto aparece restando en el denominador.'));

    let aG5=15, bG5=18;
    const leerC5=el('p',{class:'note'});
    const cajaP5=el('div',{class:'plot'}); c5.append(cajaP5);
    const P5=Plano(cajaP5,{xMin:-1.3,xMax:1.9,yMin:-1.6,yMax:1.6,alto:380,iso:true});
    function pintarC5(P){
      const ar=aG5*Math.PI/180, br=bG5*Math.PI/180, ab=ar+br;
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
      leerC5.textContent='a = '+aG5+'° · b = '+bG5+'° · tan a = '+ta.toFixed(3)+' · tan b = '+tb.toFixed(3)
        +' · (tan a+tan b)/(1−tan a tan b) = '+((ta+tb)/(1-ta*tb)).toFixed(3)
        +' · tan(a+b) medido = '+tab.toFixed(3);
    }
    P5.dibujar(pintarC5);
    c5.append(leerC5);
    c5.append(el('div',{class:'controls'},
      el('label',{},'a:'),
      el('input',{type:'range',min:'-25',max:'25',step:'1',value:String(aG5),
        oninput:e=>{ aG5=parseInt(e.target.value,10); P5.redibujar(); }}),
      el('label',{},'b:'),
      el('input',{type:'range',min:'-25',max:'25',step:'1',value:String(bG5),
        oninput:e=>{ bG5=parseInt(e.target.value,10); P5.redibujar(); }})
    ));

    c5.append(el('p',{class:'note'},'Los tres puntos son donde el rayo de cada ángulo cruza la recta $x=1$: su altura ahí es, por definición, la tangente. El rayo violeta (la suma) siempre cae donde predice la fórmula, incluso con $b$ negativo: basta mover $a$ y $b$ para comprobarlo.'));
    c5.append(el('div',{class:'formula',html:'$$\\tan(a+b)=\\frac{\\tan a+\\tan b}{1-\\tan a\\tan b} \\qquad \\tan(a-b)=\\frac{\\tan a-\\tan b}{1+\\tan a\\tan b}$$'}));
    c5.append(el('p',{class:'note'},'La diferencia solo cambia el signo del término $\\tan a\\tan b$, arriba y abajo: sale de reemplazar $b$ por $-b$ y usar que $\\tan(-b)=-\\tan b$.'));
    c5.append(el('p',{class:'fuente'},'Fuente: Clase 2, Teorema 2.3 «Fórmulas para la tangente de la suma y diferencia de ángulos» (Geometría 2026-2); la lectura geométrica sobre la recta $x=1$ es elaboración propia, en la línea de la tangente de la Clase 1.'));
    sec.append(c5);
  }
});
