/* Funciones trigonometricas inversas: definicion, dominio y
   recorrido de arcsen, arccos y arctan; ecuaciones con inversas; e identidades
   con inversas. */
registerModule({
  id:'funciones-inversas',
  title:'Funciones trigonométricas inversas',
  unidad:'I',
  lead:'Para poder invertir el seno hay que recortarle el dominio — y ese recorte explica casi todos los errores con arcoseno.',
  build(sec){

    /* ---------- Tarjeta 1: recortar el dominio del seno ---------- */
    const c1=el('div',{class:'card'});
    c1.append(el('h3',{},'El seno no es inyectivo: hay que recortarle el dominio'));
    c1.append(el('p',{},'El seno repite cada valor infinitas veces — $\\operatorname{sen}(0)=\\operatorname{sen}(\\pi)=\\operatorname{sen}(2\\pi)=0$, por ejemplo — así que no tiene una inversa sobre todo su dominio: para un mismo $y$ habría muchos $x$ posibles entre los cuales elegir. La solución es recortar el dominio a un tramo donde el seno sea monótono y siga cubriendo todo $[-1,1]$: el tramo elegido es $[-\\pi/2,\\pi/2]$.'));

    const cajaC1a=el('div',{class:'plot'}); c1.append(cajaC1a);
    const P1a=Plano(cajaC1a,{xMin:-2*Math.PI,xMax:2*Math.PI,yMin:-1.4,yMax:1.4,alto:260});
    const cajaC1b=el('div',{class:'plot'}); c1.append(cajaC1b);
    const P1b=Plano(cajaC1b,{xMin:-1.6,xMax:1.6,yMin:-1.6,yMax:1.6,alto:300,iso:true});
    const leerC1=lectura(c1);

    P1a.animar((P,t)=>{
      const x0=(Math.PI/2)*Math.sin(t*Math.PI/3);
      P.ejes();
      P.curva(x=>Math.sin(x),{color:'--muted',grosor:1.6});
      P.curva(x=>(x>=-Math.PI/2&&x<=Math.PI/2)?Math.sin(x):NaN,{color:'--s2',grosor:2.6});
      P.punto(x0,Math.sin(x0),{color:'--s7',r:5});
      P.texto(-Math.PI/2,-1.25,'[−π/2,',{color:'--s2',dx:-6});
      P.texto(Math.PI/2,-1.25,'π/2]',{color:'--s2',dx:2});
    },{duracion:6,controles:false});

    P1b.animar((P,t)=>{
      const x0=(Math.PI/2)*Math.sin(t*Math.PI/3);
      const y0=Math.sin(x0);
      P.ejes();
      P.parametrica(s=>[-1.6+3.2*s,-1.6+3.2*s],0,1,{color:'--grid',grosor:1.2,guiones:true});
      P.curva(x=>(x>=-1&&x<=1)?Math.asin(x):NaN,{color:'--s1',grosor:2.6});
      P.punto(y0,x0,{color:'--s7',r:5});
      leerC1.set([
        ['x', x0.toFixed(2)],
        ['sen x', y0.toFixed(2)],
        ['arcsen(sen x)', x0.toFixed(2)]
      ]);
    },{duracion:6});

    c1.append(el('div',{class:'formula',html:'$$y=\\operatorname{sen}x,\\quad x\\in\\left[-\\tfrac{\\pi}{2},\\tfrac{\\pi}{2}\\right]$$'}));
    c1.append(el('div',{class:'formula',html:'$$\\Longrightarrow\\quad x=\\operatorname{arcsen} y,\\quad y\\in[-1,1]$$'}));
    c1.append(el('p',{class:'note'},'Dominio de $\\operatorname{arcsen}$: $[-1,1]$ (todo lo que el seno recortado alcanza a producir). Recorrido de $\\operatorname{arcsen}$: $[-\\pi/2,\\pi/2]$ (el mismo tramo que se recortó). El punto violeta de arriba y el de abajo son el mismo dato leído en los dos sentidos: cada $x$ del tramo recortado corresponde a un único punto de la curva de $\\operatorname{arcsen}$, y viceversa.'));
    sec.append(c1);

    /* ---------- Tarjeta 2: por qué aplicar arcsen a los dos lados da una sola solución ---------- */
    const c2=el('div',{class:'card'});
    c2.append(el('h3',{},'Por qué aplicar $\\operatorname{arcsen}$ a los dos lados no da todas las soluciones'));
    c2.append(el('p',{},'Al resolver una ecuación como $\\operatorname{sen}x=a$, aplicar $\\operatorname{arcsen}$ a los dos lados parece despejar $x$ directamente. Pero $\\operatorname{arcsen}$ solo puede devolver un valor de su recorrido, $[-\\pi/2,\\pi/2]$ —el recorte de la tarjeta anterior—, así que ese paso entrega ',el('b',{},'un único'),' ángulo, nunca los demás que también cumplen la ecuación. El deslizador compara $x$ con $\\operatorname{arcsen}(\\operatorname{sen}x)$ en cada punto para ver exactamente qué devuelve ese paso.'));

    let xC2=1.0;
    let leerC2a=null;
    const MSG_DENTRO='x cae dentro de $[-\\pi/2,\\pi/2]$: ahí, y solo ahí, aplicar $\\operatorname{arcsen}$ recupera exactamente x.';
    const MSG_FUERA='x cae fuera de $[-\\pi/2,\\pi/2]$: aplicar $\\operatorname{arcsen}$ no devuelve x, sino el ángulo de esa franja que comparte su mismo seno — la otra solución de la ecuación queda pendiente.';
    const cajaC2=el('div',{class:'plot'}); c2.append(cajaC2);
    const xMinC2=-5*Math.PI/2, xMaxC2=5*Math.PI/2;
    const P2=Plano(cajaC2,{xMin:xMinC2,xMax:xMaxC2,yMin:-2.1,yMax:2.1,alto:320});
    function arcsinSen(x){ return Math.asin(Math.sin(x)); }
    P2.dibujar(P=>{
      P.ejes();
      /* UNA sola franja, y es el recorrido de arcsen: [−π/2, π/2]. Ahí y solo
         ahí la curva azul se apoya en la diagonal. Las repeticiones cada 2π
         tienen el mismo seno, pero arcsen devuelve siempre el representante de
         esta franja, así que ahí el diente de sierra NO toca la diagonal. */
      P.region(()=>2.1,()=>-2.1,-Math.PI/2,Math.PI/2,{color:'--s2',alpha:0.12});
      P.curva(x=>x,{color:'--grid',grosor:1.4,guiones:true});
      P.curva(arcsinSen,{color:'--s1',grosor:2.4});
      const y0=arcsinSen(xC2);
      P.punto(xC2,y0,{color:'--s7',r:6});
    });
    controlValor(c2,{label:'x',min:-7.85,max:7.85,paso:0.02,valor:xC2,unidad:'',
      onChange:v=>{ xC2=v; P2.redibujar(); actualizarC2(); }});
    /* los dos mensajes tienen largos muy distintos: se calibra con ambos
       para que la tarjeta no cambie de alto al arrastrar */
    leerC2a=textoVivo(c2).calibrar([MSG_DENTRO,MSG_FUERA]);
    const leerC2b=lectura(c2);
    function actualizarC2(){
      const y0=arcsinSen(xC2);
      const coincide=Math.abs(y0-xC2)<1e-9;
      leerC2a.set(coincide?MSG_DENTRO:MSG_FUERA);
      leerC2b.set([
        ['x', xC2.toFixed(2)],
        ['arcsen(sen x)', y0.toFixed(2)]
      ]);
    }
    actualizarC2();

    c2.append(el('p',{},'La curva azul es $\\operatorname{arcsen}(\\operatorname{sen}x)$: un diente de sierra que se apoya en la diagonal $y=x$ únicamente dentro de la franja verde, y que fuera de ella sube y baja entre $-\\tfrac\\pi2$ y $\\tfrac\\pi2$ sin volver a tocarla nunca. Ese diente de sierra es, mirado de otra forma, el motivo por el que aplicar $\\operatorname{arcsen}$ a los dos lados de una ecuación es un paso incompleto: siempre aterriza en la franja verde, nunca fuera de ella.'));
    c2.append(el('p',{class:'note'},'Ejemplo concreto: $\\operatorname{arcsen}(\\operatorname{sen}2\\pi)=0$, no $2\\pi$, porque $2\\pi$ queda lejos de $\\left[-\\tfrac\\pi2,\\tfrac\\pi2\\right]$ y $\\operatorname{arcsen}$ devuelve el único ángulo de esa franja que comparte seno con $2\\pi$. Por eso, al resolver $\\operatorname{sen}x=a$ aplicando $\\operatorname{arcsen}$ a ambos lados, $x=\\operatorname{arcsen}a$ es solo una de las dos familias de solución — la otra, la que queda fuera de $\\left[-\\tfrac\\pi2,\\tfrac\\pi2\\right]$, se recupera aparte con la simetría de la circunferencia respecto del eje $y$.'));
    sec.append(c2);

    /* ---------- Tarjeta 3: dominio y recorrido de arccos y arctan ---------- */
    const c3=el('div',{class:'card'});
    c3.append(el('h3',{},'Dominio y recorrido de arccos y arctan'));
    c3.append(el('p',{},'El mismo recurso —recortar hasta que la función sea monótona y no pierda alcance— define a las otras dos inversas, cada una con su propio tramo.'));

    const cajaC3=el('div',{class:'plot'}); c3.append(cajaC3);
    const P3=Plano(cajaC3,{xMin:-5,xMax:5,yMin:-2.2,yMax:3.4,alto:320});
    P3.dibujar(P=>{
      P.ejes();
      P.curva(x=>(x>=-1&&x<=1)?Math.acos(x):NaN,{color:'--s2',grosor:2.6});
      P.curva(x=>Math.atan(x),{color:'--s1',grosor:2.4});
      const w=P.ventana();
      [0,Math.PI,-Math.PI/2,Math.PI/2].forEach(y=>P.parametrica(s=>[w.xMin+(w.xMax-w.xMin)*s,y],0,1,{color:'--grid',grosor:1,guiones:true}));
      P.texto(-4.85,Math.PI+0.18,'π',{color:'--s2'});
      P.texto(-4.85,0.2,'0',{color:'--s2'});
      P.texto(4.4,Math.PI/2+0.2,'π/2',{color:'--s1'});
      P.texto(4.4,-Math.PI/2-0.3,'−π/2',{color:'--s1'});
      P.texto(-0.95,3.15,'arccos x',{color:'--s2',tam:12});
      P.texto(2.1,1.65,'arctan x',{color:'--s1',tam:12});
    });
    c3.append(el('div',{class:'formula',html:'$$\\arccos:[-1,1]\\to[0,\\pi]$$'}));
    c3.append(el('div',{class:'formula',html:'$$\\arctan:\\mathbb{R}\\to\\left(-\\tfrac{\\pi}{2},\\tfrac{\\pi}{2}\\right)$$'}));
    c3.append(el('p',{class:'note'},'$\\arccos$ recorta el coseno a $[0,\\pi]$, donde es monótono decreciente y sigue tocando todo $[-1,1]$: por eso su curva (verde) es tan angosta, ya que su dominio es apenas $[-1,1]$. $\\arctan$ recorta la tangente a $(-\\pi/2,\\pi/2)$: como ese tramo ya cubre todo $\\mathbb{R}$ sin repetirse, $\\arctan$ queda definida para cualquier real, pero nunca alcanza $\\pm\\pi/2$ — son asíntotas, no valores del recorrido.'));
    sec.append(c3);

    /* ---------- Tarjeta 4: ecuaciones con funciones inversas ---------- */
    const c4=el('div',{class:'card'});
    c4.append(el('h3',{},'Ecuaciones con funciones inversas'));
    c4.append(el('p',{},'Para resolverlas se aísla la función inversa y se aplica su definición: si $\\arccos(y)=\\alpha$, entonces $y=\\cos\\alpha$. Como $\\arccos$ ya es una función (biyectiva sobre su recorrido), la recta horizontal la corta ',el('b',{},'a lo sumo una vez'),', a diferencia de lo que ocurre con las funciones trigonométricas directas, que toman cada valor infinitas veces.'));

    let alturaC4=0.9;
    const cajaC4=el('div',{class:'plot'}); c4.append(cajaC4);
    const P4=Plano(cajaC4,{xMin:-1.3,xMax:1.3,yMin:-0.5,yMax:3.6,alto:300});
    P4.dibujar(P=>{
      P.ejes();
      P.curva(x=>(x>=-1&&x<=1)?Math.acos(x):NaN,{color:'--s2',grosor:2.6});
      P.curva(()=>alturaC4,{color:'--s4',grosor:2});
      if(alturaC4>=0&&alturaC4<=Math.PI){
        const x0=Math.cos(alturaC4);
        P.punto(x0,alturaC4,{color:'--s7',r:6});
      }
    });
    function actualizarC4(){
      if(alturaC4>=0&&alturaC4<=Math.PI){
        leerC4.set([['altura', alturaC4.toFixed(2)],['único corte en x', Math.cos(alturaC4).toFixed(3)]]);
      } else {
        leerC4.set([['altura', alturaC4.toFixed(2)],['corte', 'no hay — fuera de [0, π]']]);
      }
    }
    controlValor(c4,{label:'altura',min:-0.4,max:3.5,paso:0.02,valor:alturaC4,unidad:'',
      onChange:v=>{ alturaC4=v; P4.redibujar(); actualizarC4(); }});
    const leerC4=lectura(c4); actualizarC4();

    c4.append(el('p',{},'Ejemplo verificado: para resolver $\\arccos(2x+\\sqrt2)=\\pi/4$ se aplica la definición y queda $2x+\\sqrt2=\\cos(\\pi/4)=\\tfrac{\\sqrt2}{2}$, de donde:'));
    c4.append(el('div',{class:'formula',html:'$$x=\\frac{\\frac{\\sqrt2}{2}-\\sqrt2}{2}=-\\frac{\\sqrt2}{4}$$'}));
    c4.append(el('p',{class:'note'},'Al final conviene validar que el argumento quede dentro de $[-1,1]$ (dominio de $\\arccos$): $2\\left(-\\tfrac{\\sqrt2}{4}\\right)+\\sqrt2=\\tfrac{\\sqrt2}{2}\\approx 0{,}71$, que sí queda adentro. Si el argumento hubiera quedado fuera, esa solución no serviría — es la restricción de dominio de la inversa, aplicada al argumento.'));
    sec.append(c4);

    /* ---------- Tarjeta 5: identidades con inversas — el triángulo ---------- */
    const c5=el('div',{class:'card'});
    c5.append(el('h3',{},'Identidades con inversas: el triángulo que las conecta'));
    c5.append(el('p',{},'Varias identidades entre funciones inversas se leen directo de un triángulo rectángulo. Para $x\\in(0,1)$, se arma uno con hipotenusa $1$, cateto adyacente $x$ y cateto opuesto $\\sqrt{1-x^2}$:'));

    let xC5=0.6;
    const cajaC5=el('div',{class:'plot'}); c5.append(cajaC5);
    const P5=Plano(cajaC5,{xMin:-0.25,xMax:1.25,yMin:-0.25,yMax:1.25,alto:340,iso:true});
    P5.dibujar(P=>{
      const y=Math.sqrt(1-xC5*xC5);
      P.ejes();
      P.parametrica(s=>[xC5*s,0],0,1,{color:'--s4',grosor:3.2});
      P.parametrica(s=>[xC5,y*s],0,1,{color:'--s6',grosor:3.2});
      P.parametrica(s=>[xC5*s,y*s],0,1,{color:'--s7',grosor:2.4});
      const thO=Math.acos(xC5);
      P.parametrica(a=>[0.2*Math.cos(a),0.2*Math.sin(a)],0,thO,{color:'--s2',grosor:2.2});
      const thB=Math.atan(xC5/y);
      P.parametrica(a=>[xC5-0.2*Math.sin(a),y-0.2*Math.cos(a)],0,thB,{color:'--s1',grosor:2.2});
      P.punto(xC5,y,{color:'--s7',r:4}); P.punto(0,0,{color:'--muted',r:3});
      P.texto(xC5/2,0,'x',{color:'--s4',dy:16});
      P.texto(xC5,y/2,'√(1−x²)',{color:'--s6',dx:8});
      P.texto(xC5/2,y/2,'1',{color:'--s7',dx:-16,dy:-8});
      P.texto(0.12,0.05,'arccos x',{color:'--s2',tam:11});
      P.texto(xC5,y-0.14,'arctan …',{color:'--s1',tam:11,dx:-78});
    });
    function actualizarC5(){
      const y=Math.sqrt(1-xC5*xC5), thO=Math.acos(xC5), thB=Math.atan(xC5/y);
      leerC5.set([
        ['x', xC5.toFixed(2)],
        ['ángulo en el origen (arccos x)', thO.toFixed(3)+' rad'],
        ['ángulo de arriba (arctan)', thB.toFixed(3)+' rad'],
        ['suma', (thO+thB).toFixed(3)+' (π/2 ≈ '+(Math.PI/2).toFixed(3)+')']
      ]);
    }
    controlValor(c5,{label:'x',min:0.05,max:0.95,paso:0.01,valor:xC5,unidad:'',
      onChange:v=>{ xC5=v; P5.redibujar(); actualizarC5(); }});
    const leerC5=lectura(c5); actualizarC5();

    c5.append(el('div',{class:'formula',html:'$$\\arccos x+\\arctan\\frac{x}{\\sqrt{1-x^2}}=\\frac{\\pi}{2}$$'}));
    c5.append(el('p',{class:'note'},'Los dos ángulos agudos de un triángulo rectángulo suman $\\pi/2$: no hace falta más que eso. El ángulo en el origen es $\\arccos x$ por construcción (cateto adyacente $x$, hipotenusa $1$); el de arriba es $\\arctan\\frac{x}{\\sqrt{1-x^2}}$ porque ahí el cateto opuesto al ángulo es $x$ y el adyacente es $\\sqrt{1-x^2}$. El contador de arriba confirma que la suma da $\\pi/2$ para cualquier $x$ del deslizador.'));
    sec.append(c5);
  }
});
