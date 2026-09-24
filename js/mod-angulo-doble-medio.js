/* Clase 3 del curso: fórmulas para el ángulo doble y el ángulo medio. */
registerModule({
  id:'angulo-doble-medio',
  title:'Ángulo doble y ángulo medio',
  unidad:'I',
  lead:'Duplicar un ángulo o partirlo a la mitad son casos particulares de la suma y la diferencia: el mismo círculo unitario de siempre explica por qué $\\operatorname{sen}(2x)$ no es $2\\operatorname{sen}(x)$, y por qué el signo ± de las fórmulas de ángulo medio lo decide el cuadrante de $x/2$, nunca el de $x$.',
  build(sec){

    /* ---------- Tarjeta 1: x y 2x a la vez en el círculo (deslizador) ---------- */
    const c1=el('div',{class:'card'});
    c1.append(el('h3',{},'x y 2x a la vez en el mismo círculo'));
    c1.append(el('p',{},'Al mover un solo ángulo $x$, el dibujo pone dos puntos sobre la circunferencia: uno en $x$ (azul) y otro en $2x$ (naranja). Cada punto deja caer su propia altura: esa altura ',el('b',{},'es'),' el seno.'));

    let xg1=50;
    const leerC1=el('p',{class:'note'});
    const cajaP1=el('div',{class:'plot'}); c1.append(cajaP1);
    const P1=Plano(cajaP1,{xMin:-1.35,xMax:1.35,yMin:-1.35,yMax:1.35,alto:340,iso:true});
    P1.dibujar(P=>{
      const th=xg1*Math.PI/180, th2=2*th;
      const cx=Math.cos(th), cy=Math.sin(th);
      const cx2=Math.cos(th2), cy2=Math.sin(th2);
      P.ejes();
      P.parametrica(a=>[Math.cos(a),Math.sin(a)],0,2*Math.PI,{color:'--grid',grosor:1.4});
      /* arcos de x (chico) y 2x (grande, punteado) desde el origen */
      P.parametrica(a=>[0.22*Math.cos(a),0.22*Math.sin(a)],0,th,{color:'--s4',grosor:2.2});
      P.parametrica(a=>[0.36*Math.cos(a),0.36*Math.sin(a)],0,th2,{color:'--s7',grosor:2,guiones:true});
      /* radios hasta cada punto */
      P.parametrica(s=>[cx*s,cy*s],0,1,{color:'--s1',grosor:1.4});
      P.parametrica(s=>[cx2*s,cy2*s],0,1,{color:'--s6',grosor:1.4});
      /* la altura de cada punto: el seno */
      P.parametrica(s=>[cx,cy*s],0,1,{color:'--s1',grosor:3.6});
      P.parametrica(s=>[cx2,cy2*s],0,1,{color:'--s6',grosor:3.6});
      P.punto(cx,cy,{color:'--s1',r:5});
      P.punto(cx2,cy2,{color:'--s6',r:5});
      P.texto(cx,cy/2,'sen x',{color:'--s1',dx:cx>=0?8:-58,tam:12});
      P.texto(cx2,cy2/2,'sen 2x',{color:'--s6',dx:cx2>=0?8:-64,tam:12});
      P.texto(0.16*Math.cos(th/2),0.16*Math.sin(th/2),'x',{color:'--s4',tam:11});
      P.texto(0.46*Math.cos(th2/2),0.46*Math.sin(th2/2),'2x',{color:'--s7',tam:11});
    });
    function actualizarC1(){
      const th=xg1*Math.PI/180;
      const s2x=Math.sin(2*th), dos_sc=2*Math.sin(th)*Math.cos(th), dos_s=2*Math.sin(th);
      leerC1.textContent='x = '+xg1+'° · sen(2x) = '+s2x.toFixed(3)+' · 2 sen(x) cos(x) = '+dos_sc.toFixed(3)
        +' → el mismo número · 2 sen(x) = '+dos_s.toFixed(3)+' ≠ sen(2x): multiplicar el seno por 2 no es duplicar el ángulo.';
    }
    c1.append(el('div',{class:'controls'},
      el('label',{},'x:'),
      el('input',{type:'range',min:'0',max:'180',step:'1',value:String(xg1),
        oninput:e=>{ xg1=parseInt(e.target.value,10); P1.redibujar(); actualizarC1(); }})
    ));
    c1.append(leerC1); actualizarC1();

    c1.append(el('p',{},'El segmento naranja (sen 2x) no es el doble del azul (sen x): son alturas de puntos distintos sobre la misma circunferencia, y crecen y decrecen a ritmos distintos. Lo que sí coincide, siempre, es sen(2x) con $2\\operatorname{sen}(x)\\cos(x)$: mueve el deslizador y compara los dos números de arriba.'));
    c1.append(el('p',{class:'note'},'Cerca de $x=90°$ se ve el caso más claro: sen(x) llega a su máximo (1), pero 2x ya pasó los 180° y sen(2x) va camino a 0 — las dos curvas no tienen por qué ir en la misma dirección.'));
    c1.append(el('p',{class:'fuente'},'Fuente: Clase 3 «Fórmulas para el ángulo doble y medio», Teorema 2.1 (Geometría 2026-2).'));
    sec.append(c1);

    /* ---------- Tarjeta 2: fórmulas del ángulo doble (sen y tan) ---------- */
    const c2=el('div',{class:'card'});
    c2.append(el('h3',{},'Las fórmulas del ángulo doble'));
    c2.append(el('p',{},'Duplicar el ángulo es el caso particular de la suma donde los dos sumandos son iguales: en $\\operatorname{sen}(\\alpha+\\beta)$ y $\\cos(\\alpha+\\beta)$ (Clase 2) se reemplaza $\\beta$ por $\\alpha$ y se agrupa. Eso es exactamente lo que se comprobó arriba con el deslizador.'));
    c2.append(el('div',{class:'formula',html:'$$\\operatorname{sen}(2\\alpha)=2\\operatorname{sen}(\\alpha)\\cos(\\alpha)$$'}));
    c2.append(el('p',{},'El coseno del ángulo doble tiene tres formas equivalentes — la tarjeta siguiente muestra por qué son la misma fórmula y cuándo conviene cada una. La tangente sale de dividir seno por coseno:'));
    c2.append(el('div',{class:'formula',html:'$$\\tan(2\\alpha)=\\frac{2\\tan(\\alpha)}{1-\\tan^2(\\alpha)}$$'}));
    c2.append(el('p',{class:'note'},'Definida solo donde $\\tan\\alpha$ existe y $1-\\tan^2\\alpha\\neq0$, es decir $\\alpha\\neq\\dfrac{\\pi}{4}+k\\dfrac{\\pi}{2}$, $k\\in\\mathbb{Z}$.'));
    c2.append(el('p',{class:'fuente'},'Fuente: Clase 3, Teorema 2.1 «Fórmulas para ángulo doble» (Geometría 2026-2).'));
    sec.append(c2);

    /* ---------- Tarjeta 3: las tres caras de cos(2x) (deslizador + gráfico) ---------- */
    const c3=el('div',{class:'card'});
    c3.append(el('h3',{},'Las tres caras de $\\cos(2x)$'));
    c3.append(el('p',{},'Las tres expresiones de $\\cos(2x)$ no son tres fórmulas distintas: son la misma función escrita de tres maneras. El gráfico las traza a las cuatro (la definición y las tres reescrituras) y las cuatro caen exactamente en el mismo trazo.'));

    let x0c3=40;
    const leerC3=el('p',{class:'note'});
    const cajaP3=el('div',{class:'plot'}); c3.append(cajaP3);
    const P3=Plano(cajaP3,{xMin:0,xMax:360,yMin:-1.3,yMax:1.3,alto:300,iso:false});
    P3.dibujar(P=>{
      P.ejes();
      P.curva(xd=>Math.cos(2*xd*Math.PI/180),{color:'--s1',grosor:2.8});
      P.curva(xd=>{const r=xd*Math.PI/180; return Math.cos(r)*Math.cos(r)-Math.sin(r)*Math.sin(r);},{color:'--s6',grosor:1.6,guiones:true});
      P.curva(xd=>{const r=xd*Math.PI/180; return 1-2*Math.sin(r)*Math.sin(r);},{color:'--s2',grosor:1.6,guiones:true});
      P.curva(xd=>{const r=xd*Math.PI/180; return 2*Math.cos(r)*Math.cos(r)-1;},{color:'--s7',grosor:1.6,guiones:true});
      const y0=Math.cos(2*x0c3*Math.PI/180);
      const w=P.ventana();
      P.parametrica(s=>[x0c3,w.yMin+(w.yMax-w.yMin)*s],0,1,{color:'--muted',grosor:1,guiones:true});
      P.punto(x0c3,y0,{color:'--s1',r:5});
    });
    function actualizarC3(){
      const r=x0c3*Math.PI/180;
      const a=Math.cos(2*r), b=Math.cos(r)*Math.cos(r)-Math.sin(r)*Math.sin(r), c=1-2*Math.sin(r)*Math.sin(r), d=2*Math.cos(r)*Math.cos(r)-1;
      leerC3.textContent='x = '+x0c3+'° · cos²x−sen²x = '+b.toFixed(3)+' · 1−2sen²x = '+c.toFixed(3)
        +' · 2cos²x−1 = '+d.toFixed(3)+' · cos(2x) = '+a.toFixed(3)+' — las cuatro coinciden.';
    }
    c3.append(el('div',{class:'controls'},
      el('label',{},'x:'),
      el('input',{type:'range',min:'0',max:'360',step:'1',value:String(x0c3),
        oninput:e=>{ x0c3=parseInt(e.target.value,10); P3.redibujar(); actualizarC3(); }})
    ));
    c3.append(leerC3); actualizarC3();

    c3.append(el('p',{},'Las tres reescrituras salen de $\\operatorname{sen}^2\\alpha+\\cos^2\\alpha=1$ aplicada sobre $\\cos^2\\alpha-\\operatorname{sen}^2\\alpha$: reemplazando $\\cos^2\\alpha$ o $\\operatorname{sen}^2\\alpha$ se llega a las otras dos. Ninguna es más «correcta» — se elige según el dato disponible.'));
    c3.append(el('div',{class:'formula',html:'$$\\cos(2\\alpha)=\\cos^2\\alpha-\\operatorname{sen}^2\\alpha=1-2\\operatorname{sen}^2\\alpha=2\\cos^2\\alpha-1$$'}));
    c3.append(el('p',{class:'note'},'Si solo se conoce $\\operatorname{sen}\\alpha$, conviene la del medio; si solo se conoce $\\cos\\alpha$, la de la derecha; si se tienen los dos, la de la izquierda es la más directa.'));
    c3.append(el('p',{class:'fuente'},'Fuente: Clase 3, Teorema 2.1 «Fórmulas para ángulo doble» (Geometría 2026-2).'));
    sec.append(c3);

    /* ---------- Tarjeta 4: el signo del ángulo medio (deslizador) ---------- */
    const c4=el('div',{class:'card'});
    c4.append(el('h3',{},'El signo del ángulo medio: lo decide el cuadrante de x/2'));
    c4.append(el('p',{},'El punto grande está en $x/2$ — el ángulo del que en realidad se calcula el seno y el coseno. El punto gris chico marca $x$, solo como referencia. El segmento vertical (verde si es positivo, rojo si es negativo) es $\\operatorname{sen}(x/2)$; el horizontal, $\\cos(x/2)$.'));

    let xg4=250;
    const reglaC4=el('p',{});
    const leerC4=el('p',{class:'note'});
    const cajaP4=el('div',{class:'plot'}); c4.append(cajaP4);
    const P4=Plano(cajaP4,{xMin:-1.35,xMax:1.35,yMin:-1.35,yMax:1.35,alto:340,iso:true});
    function cuadrante(deg){
      const n=((deg%360)+360)%360;
      if(n<90)return 'I'; if(n<180)return 'II'; if(n<270)return 'III'; return 'IV';
    }
    P4.dibujar(P=>{
      const half=xg4/2, hRad=half*Math.PI/180;
      const xNorm=((xg4%360)+360)%360, xRad=xNorm*Math.PI/180;
      const hx=Math.cos(hRad), hy=Math.sin(hRad);
      const xx=Math.cos(xRad), xy=Math.sin(xRad);
      P.ejes();
      P.parametrica(a=>[Math.cos(a),Math.sin(a)],0,2*Math.PI,{color:'--grid',grosor:1.4});
      P.punto(xx,xy,{color:'--muted',r:4});
      P.texto(xx,xy,'x',{color:'--muted',dx:8,dy:-8,tam:11});
      P.parametrica(s=>[hx*s,hy*s],0,1,{color:'--s7',grosor:1.4});
      P.parametrica(s=>[hx,hy*s],0,1,{color:hy>=0?'--s2':'--s8',grosor:3.4});
      P.parametrica(s=>[hx*s,0],0,1,{color:hx>=0?'--s2':'--s8',grosor:3.4});
      P.punto(hx,hy,{color:'--s7',r:6});
      P.texto(hx,hy,'x/2',{color:'--s7',dx:8,dy:-8});
    });
    function actualizarC4(){
      const half=xg4/2, hRad=half*Math.PI/180;
      const senH=Math.sin(hRad), cosH=Math.cos(hRad);
      const cqx=cuadrante(xg4), cqh=cuadrante(half);
      reglaC4.innerHTML='x/2 = '+half.toFixed(1)+'°, que cae en el cuadrante '+cqh+', así que $\\operatorname{sen}(x/2)$ es '
        +(Math.abs(senH)<1e-9?'cero':(senH>0?'positivo':'negativo'))+' y $\\cos(x/2)$ es '
        +(Math.abs(cosH)<1e-9?'cero':(cosH>0?'positivo':'negativo'))
        +'. (El cuadrante de x —'+cqx+'— no interviene en esta decisión.)';
      renderMath(reglaC4);
      leerC4.textContent='x = '+xg4+'° · x/2 = '+half.toFixed(1)+'° · sen(x/2) = '+senH.toFixed(3)+' · cos(x/2) = '+cosH.toFixed(3);
    }
    c4.append(el('div',{class:'controls'},
      el('label',{},'x:'),
      el('input',{type:'range',min:'0',max:'720',step:'1',value:String(xg4),
        oninput:e=>{ xg4=parseInt(e.target.value,10); P4.redibujar(); actualizarC4(); }})
    ));
    c4.append(reglaC4); c4.append(leerC4); actualizarC4();

    c4.append(el('p',{},'Es fácil razonar «x está en el cuadrante III, así que el seno es negativo» — pero la fórmula habla de $x/2$, no de $x$. Al mover el deslizador hasta un tramo donde el cuadrante de x y el de x/2 no coincidan, se ve con claridad qué segmento manda.'));
    c4.append(el('p',{class:'note'},'Por eso el deslizador llega hasta 720°: como x/2 avanza a la mitad de velocidad que x, mientras x completa dos vueltas completas, x/2 completa exactamente una — y pasa por los cuatro cuadrantes una sola vez.'));
    c4.append(el('p',{class:'fuente'},'Fuente: Clase 3, Teorema 2.2 «Fórmulas para ángulo medio»: «debemos determinar qué signo emplear, según la ubicación del lado terminal del ángulo α/2» (Geometría 2026-2).'));
    sec.append(c4);

    /* ---------- Tarjeta 5: fórmulas del ángulo medio ---------- */
    const c5=el('div',{class:'card'});
    c5.append(el('h3',{},'Las fórmulas del ángulo medio'));
    c5.append(el('p',{},'Salen de despejar $\\operatorname{sen}\\beta$ y $\\cos\\beta$ en las reescrituras de $\\cos(2\\beta)$ de la tarjeta 3, con $\\beta=\\alpha/2$. El $\\pm$ se resuelve como en la tarjeta anterior: con el cuadrante de $\\alpha/2$, nunca con el de $\\alpha$.'));
    c5.append(el('div',{class:'formula',html:'$$\\operatorname{sen}\\left(\\frac{\\alpha}{2}\\right)=\\pm\\sqrt{\\frac{1-\\cos\\alpha}{2}}\\qquad \\cos\\left(\\frac{\\alpha}{2}\\right)=\\pm\\sqrt{\\frac{1+\\cos\\alpha}{2}}$$'}));
    c5.append(el('div',{class:'formula',html:'$$\\tan\\left(\\frac{\\alpha}{2}\\right)=\\pm\\sqrt{\\frac{1-\\cos\\alpha}{1+\\cos\\alpha}}$$'}));
    c5.append(el('p',{class:'note'},'Por ejemplo, con $\\alpha=45°$: $\\cos(22{,}5°)=\\sqrt{(1+\\cos 45°)/2}\\approx0{,}924$, con signo + porque $22{,}5°$ cae en el cuadrante I.'));
    c5.append(el('p',{class:'fuente'},'Fuente: Clase 3, Teorema 2.2 «Fórmulas para ángulo medio» (Geometría 2026-2).'));
    sec.append(c5);
  }
});
