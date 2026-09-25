/* Aplicaciones de la trigonometria: del enunciado al dibujo.

   - Tarjeta 1 anima ángulo de elevación / depresión con un deslizador: el
     mismo ángulo, medido siempre desde la horizontal del observador.
   - Tarjeta 2 es el método (del enunciado al dibujo) y la distinción entre
     problemas sin y con contexto verbal — sin figura, texto puro.
   - Tarjeta 3 es una escena de elevación (observador + torre) con dos
     deslizadores: distancia y ángulo, mostrando qué dato fija qué.
   - Tarjeta 4 es "distancia inaccesible": dos puntos de observación en una
     orilla y un objetivo en la otra, con tres deslizadores que muestran
     cómo el triángulo queda completamente determinado (caso ASA).
   Todos los planos van con iso:true: son ángulos y triángulos. Nada de
   ejercicios ni de desarrollos paso a paso — se ve cómo se arma el
   triángulo, no cómo se resuelve la cuenta final. */
registerModule({
  id:'aplicaciones',
  title:'Aplicaciones de la trigonometría',
  unidad:'I',
  lead:'El paso que realmente cuesta en estos problemas no es la cuenta final: es decidir qué triángulo dibujar. Acá se ve cómo se pasa del enunciado al dibujo, con los ángulos de elevación y depresión como caso base.',
  build(sec){

    /* ---------- Tarjeta 1: ángulo de elevación y de depresión (deslizador) ---------- */
    const t1=el('div',{class:'card'});
    t1.append(el('h3',{},'Ángulo de elevación y ángulo de depresión'));
    t1.append(el('p',{},'Los dos se miden siempre desde la ',el('b',{},'horizontal'),' del observador, nunca desde la vertical. Si el objetivo queda más arriba que la horizontal es un ',el('b',{},'ángulo de elevación'),'; si queda más abajo, un ',el('b',{},'ángulo de depresión'),'.'));

    let phiT1=25;
    const nombreT1=el('p',{class:'note'});
    const cajaT1=el('div',{class:'plot'}); t1.append(cajaT1);
    const PT1=Plano(cajaT1,{xMin:-1,xMax:3.6,yMin:-2.8,yMax:2.8,alto:300,iso:true});
    controlValor(t1,{label:'φ',min:-60,max:60,paso:1,valor:phiT1,unidad:'°',
      onChange:v=>{ phiT1=v; PT1.redibujar(); actualizarT1(); }});
    t1.append(nombreT1);
    const leerT1=lectura(t1);
    PT1.dibujar(P=>{
      P.ejes();
      const rad=phiT1*Math.PI/180;
      const O=[0,0];
      const objetivo=[3*Math.cos(rad),3*Math.sin(rad)];
      const colorLinea=phiT1>=0?'--s2':'--s6';
      P.parametrica(s=>[3*s,0],0,1,{color:'--muted',grosor:1.6,guiones:true});
      P.parametrica(s=>[objetivo[0]*s,objetivo[1]*s],0,1,{color:colorLinea,grosor:2.8});
      const rArco=0.6;
      P.parametrica(a=>[rArco*Math.cos(a),rArco*Math.sin(a)],0,rad,{color:'--s4',grosor:2.2});
      P.punto(objetivo[0],objetivo[1],{color:colorLinea,r:5});
      P.punto(O[0],O[1],{color:'--ink',r:4});
      P.texto(O[0],O[1],'observador',{dx:-8,dy:20,tam:11});
      P.texto(objetivo[0],objetivo[1],'objetivo',{dx:8,dy:phiT1>=0?-8:16,tam:11});
      P.texto(rArco*Math.cos(rad/2),rArco*Math.sin(rad/2),'φ',{color:'--s4',dx:8,dy:phiT1>=0?-6:14});
      leerT1.set([['φ', phiT1+'°'],['tipo', phiT1>=0?'elevación':'depresión']]);
    });
    function actualizarT1(){
      nombreT1.textContent = phiT1>=0
        ? 'φ = '+phiT1+'° de elevación: el objetivo está arriba de la horizontal.'
        : 'φ = '+Math.abs(phiT1)+'° de depresión: el objetivo está abajo de la horizontal.';
    }
    actualizarT1();
    t1.append(el('p',{class:'note'},'La línea punteada es la mirada al frente, φ = 0°. Levantar la vista da un ángulo de elevación; bajarla, uno de depresión. Por ángulos alternos internos entre paralelas, el ángulo de elevación medido desde abajo es igual al ángulo de depresión medido desde arriba hacia el mismo punto — el mismo número, dos nombres según quién mira.'));
    sec.append(t1);

    /* ---------- Tarjeta 2: del enunciado al dibujo (sin figura) ---------- */
    const t2=el('div',{class:'card'});
    t2.append(el('h3',{},'Del enunciado al dibujo'));
    t2.append(el('p',{},'La parte difícil de estos problemas casi nunca es la cuenta: es decidir qué triángulo dibujar. El método es siempre el mismo, en este orden:'));
    t2.append(el('ol',{},
      el('li',{},el('b',{},'Rotular lo fijo.'),' El punto de observación, el objetivo, y todo segmento vertical u horizontal cuya medida se conozca.'),
      el('li',{},el('b',{},'Ubicar el ángulo respecto de la horizontal.'),' Elevación si mira hacia arriba, depresión si mira hacia abajo — nunca respecto de la vertical ni del segmento que se busca.'),
      el('li',{},el('b',{},'Cerrar el triángulo.'),' Con esos datos, ¿qué triángulo queda determinado? A veces es uno solo; otras veces —dos puntos de observación, por ejemplo— hace falta resolver un triángulo para conseguir el dato que alimenta al siguiente.'),
      el('li',{},el('b',{},'Elegir el teorema según el triángulo, no al revés.'),' Si hay un ángulo recto explícito (la torre es vertical, el suelo es horizontal), alcanza con las razones trigonométricas básicas. Si el triángulo que se formó no tiene ángulo recto, ahí entran el teorema del seno o del coseno.')
    ));
    t2.append(el('p',{},'Hay además dos estilos de enunciado, que se trabajan distinto:'));
    t2.append(el('p',{},el('b',{},'Sin contexto verbal'),' — el problema ya viene en símbolos: una ecuación o identidad trigonométrica para manipular con las herramientas de los temas anteriores (suma y diferencia de ángulos, ángulo doble, funciones inversas). No hay nada que dibujar; el enunciado ',el('i',{},'es'),' la cuenta.'));
    t2.append(el('p',{},el('b',{},'Con contexto verbal'),' — el problema describe una situación (un observador, una torre, dos puntos de observación) y el paso previo a cualquier cuenta es justamente construir el dibujo con los cuatro pasos de arriba. Las dos tarjetas que siguen son de este segundo tipo.'));
    sec.append(t2);

    /* ---------- Tarjeta 3: ángulo de elevación, qué dato fija qué (2 deslizadores) ---------- */
    const t3=el('div',{class:'card'});
    t3.append(el('h3',{},'Ángulo de elevación: qué dato fija qué'));
    t3.append(el('p',{},'Un observador mira la punta de una torre vertical, parado a una distancia $d$ de la base. El ángulo de elevación $\\theta$ y la distancia $d$ son los datos que se miden en terreno; la altura $h$ de la torre es la que se calcula.'));

    let dT3=6, thetaT3=35;
    const cajaT3=el('div',{class:'plot'}); t3.append(cajaT3);
    const PT3=Plano(cajaT3,{xMin:-1,xMax:10,yMin:-1.5,yMax:13,alto:360,iso:true});
    t3.append(el('div',{class:'controls'},
      el('label',{},'d:'),
      el('input',{type:'range',min:'3',max:'8',step:'0.2',value:String(dT3),
        oninput:e=>{dT3=parseFloat(e.target.value); PT3.redibujar();}})
    ));
    controlValor(t3,{label:'θ',min:15,max:55,paso:1,valor:thetaT3,unidad:'°',
      onChange:v=>{ thetaT3=v; PT3.redibujar(); }});
    const leerT3=lectura(t3);
    PT3.dibujar(P=>{
      P.ejes();
      const rad=thetaT3*Math.PI/180;
      const h=dT3*Math.tan(rad);
      const O=[0,0], punta=[dT3,h];
      P.parametrica(s=>[dT3*s,0],0,1,{color:'--grid',grosor:2.2});
      P.parametrica(s=>[dT3,h*s],0,1,{color:'--s2',grosor:3});
      P.parametrica(s=>[dT3*s,h*s],0,1,{color:'--s7',grosor:2.2,guiones:true});
      const arcoR=Math.min(1.1,dT3*0.3);
      P.parametrica(a=>[arcoR*Math.cos(a),arcoR*Math.sin(a)],0,rad,{color:'--s4',grosor:2.2});
      P.punto(O[0],O[1],{color:'--ink',r:4}); P.punto(punta[0],punta[1],{color:'--s2',r:4});
      P.texto(O[0],O[1],'observador',{dx:-10,dy:18,tam:11});
      P.texto(dT3/2,0,'d',{color:'--grid',dy:16});
      P.texto(dT3,h/2,'h',{color:'--s2',dx:10});
      P.texto(arcoR*Math.cos(rad/2),arcoR*Math.sin(rad/2),'θ',{color:'--s4',dx:8,dy:6});
      leerT3.set([['d', dT3.toFixed(1)],['θ', thetaT3+'°'],['h = d·tan θ', h.toFixed(2)]]);
    });
    t3.append(el('p',{class:'note'},'Acá $d$ y $\\theta$ son los datos libres — cada deslizador es independiente del otro, como los dos datos que se miden en terreno — y $h$ es el que queda determinado por ellos: no hace falta un tercer deslizador para $h$, porque una vez fijados $d$ y $\\theta$ no puede ser otra cosa.'));
    t3.append(el('div',{class:'formula',html:'$$h=d\\cdot\\tan\\theta$$'}));
    t3.append(el('p',{class:'note'},'Es la razón trigonométrica básica de un triángulo rectángulo, todavía no el teorema del seno o del coseno: acá el ángulo recto lo pone la torre (vertical) contra el suelo (horizontal). Esos dos teoremas hacen falta cuando el triángulo que se forma no tiene ese ángulo recto de regalo — como en la tarjeta que sigue.'));
    sec.append(t3);

    /* ---------- Tarjeta 4: distancia inaccesible, dos puntos de observación (3 deslizadores) ---------- */
    const t4=el('div',{class:'card'});
    t4.append(el('h3',{},'Distancia inaccesible: dos puntos de observación'));
    t4.append(el('p',{},'Cuando el objetivo no se puede alcanzar en línea recta —la otra orilla de un río, un barco en el mar— se toman dos observaciones desde una línea de base $d$ que sí se puede medir. Los ángulos $\\theta_1$ y $\\theta_2$ que cada punto forma con esa base determinan el triángulo entero, y con él, la distancia al objetivo.'));

    let dT4=5, th1T4=45, th2T4=50;
    const cajaT4=el('div',{class:'plot'}); t4.append(cajaT4);
    const PT4=Plano(cajaT4,{xMin:-1,xMax:9,yMin:-1.5,yMax:9,alto:380,iso:true});
    t4.append(el('div',{class:'controls'},
      el('label',{},'d:'),
      el('input',{type:'range',min:'3',max:'7',step:'0.2',value:String(dT4),
        oninput:e=>{dT4=parseFloat(e.target.value); PT4.redibujar();}})
    ));
    controlValor(t4,{label:'θ1',min:25,max:65,paso:1,valor:th1T4,unidad:'°',
      onChange:v=>{ th1T4=v; PT4.redibujar(); }});
    controlValor(t4,{label:'θ2',min:25,max:65,paso:1,valor:th2T4,unidad:'°',
      onChange:v=>{ th2T4=v; PT4.redibujar(); }});
    const leerT4=lectura(t4);
    PT4.dibujar(P=>{
      P.ejes();
      const A1=th1T4*Math.PI/180, A2=th2T4*Math.PI/180;
      const P2=[dT4,0];
      const t=dT4*Math.sin(A2)/Math.sin(A1+A2);
      const T=[t*Math.cos(A1),t*Math.sin(A1)];
      P.parametrica(s=>[dT4*s,0],0,1,{color:'--grid',grosor:2.4});
      P.parametrica(s=>[T[0]*s,T[1]*s],0,1,{color:'--s2',grosor:2.4});
      P.parametrica(s=>[P2[0]+(T[0]-P2[0])*s,T[1]*s],0,1,{color:'--s7',grosor:2.4});
      const r1=0.7, r2=0.7;
      P.parametrica(a=>[r1*Math.cos(a),r1*Math.sin(a)],0,A1,{color:'--s4',grosor:2});
      P.parametrica(a=>[dT4-r2*Math.cos(a),r2*Math.sin(a)],0,A2,{color:'--s6',grosor:2});
      P.punto(0,0,{color:'--ink',r:4}); P.punto(P2[0],P2[1],{color:'--ink',r:4}); P.punto(T[0],T[1],{color:'--s2',r:5});
      P.texto(0,0,'P1',{dx:-16,dy:14});
      P.texto(P2[0],P2[1],'P2',{dx:8,dy:14});
      P.texto(T[0],T[1],'objetivo',{dx:8,dy:-8,tam:11});
      P.texto(dT4/2,0,'d',{color:'--grid',dy:16});
      P.texto(r1*Math.cos(A1/2),r1*Math.sin(A1/2),'θ1',{color:'--s4',dx:-4,dy:14});
      P.texto(dT4-r2*Math.cos(A2/2),r2*Math.sin(A2/2),'θ2',{color:'--s6',dx:8,dy:14});
      const altura=t*Math.sin(A1);
      leerT4.set([
        ['d', dT4.toFixed(1)],
        ['θ1', th1T4+'°'],
        ['θ2', th2T4+'°'],
        ['P1-objetivo', t.toFixed(2)],
        ['altura', altura.toFixed(2)]
      ]);
    });
    t4.append(el('p',{class:'note'},'Al mover cualquiera de los tres deslizadores, el triángulo entero se reacomoda: con $d,\\theta_1,\\theta_2$ fijos no queda ningún grado de libertad — el triángulo $P_1P_2(\\text{objetivo})$ queda completamente determinado, exactamente el caso ASA del teorema del seno.'));
    t4.append(el('div',{class:'formula',html:'$$\\overline{P_1\\,\\text{objetivo}}=\\dfrac{d\\cdot\\operatorname{sen}\\theta_2}{\\operatorname{sen}(\\theta_1+\\theta_2)}$$'}));
    t4.append(el('p',{class:'note'},'Sale de aplicar el teorema del seno en el triángulo $P_1P_2(\\text{objetivo})$: el ángulo en el objetivo es $180°-\\theta_1-\\theta_2$ porque los tres ángulos suman $180°$, y $\\operatorname{sen}(180°-\\theta_1-\\theta_2)=\\operatorname{sen}(\\theta_1+\\theta_2)$.'));
    sec.append(t4);
  }
});
