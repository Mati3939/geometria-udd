/* Ecuaciones trigonometricas: familias de soluciones,
   elementales con su solución general, y ecuaciones factorizables (incluido el
   cambio de variable). */
registerModule({
  id:'ecuaciones-trigonometricas',
  title:'Ecuaciones trigonométricas',
  unidad:'I',
  lead:'Una ecuación con senos y cosenos casi nunca tiene una sola solución: tiene familias enteras.',
  build(sec){

    /* ---------- Tarjeta 1: sen x = a, la recta que sube y baja ---------- */
    const c1=el('div',{class:'card'});
    c1.append(el('h3',{},'sen x = a: la recta que sube y baja'));
    c1.append(el('p',{},'Una ',el('b',{},'ecuación trigonométrica'),' es una igualdad de la forma $E(x)=0$ que se cumple solo para ciertos valores de $x$ — a diferencia de una ',el('b',{},'identidad'),', que vale para todo $x$ del dominio. Resolverla es hallar ese conjunto de valores, respetando el dominio y la periodicidad de la función involucrada.'));
    c1.append(el('p',{},'El esquema para resolverla es siempre el mismo: se identifica el dominio y las restricciones, se reduce con identidades a una expresión con una sola función trigonométrica, se resuelve esa ecuación elemental considerando la periodicidad, y se verifica. La tarjeta de abajo muestra el paso central para $\\operatorname{sen}x=a$: la recta horizontal $y=a$ sube y baja sola, y corta la curva $y=\\operatorname{sen}x$ una vez por cada vuelta en la que la ecuación tiene solución.'));

    const cajaC1=el('div',{class:'plot'}); c1.append(cajaC1);
    const P1=Plano(cajaC1,{xMin:-3*Math.PI,xMax:3*Math.PI,yMin:-1.7,yMax:1.7,alto:340});
    const leerC1=lectura(c1);
    const avisoC1=textoVivo(c1,'note').calibrar([
      'Los cortes marcados son los de este tramo; las dos familias siguen fuera de él, de vuelta en vuelta.',
      'Con $|a|\\gt 1$ la recta no llega a tocar la curva en ningún punto: la ecuación no tiene solución.'
    ]);
    P1.animar((P,t)=>{
      const a=1.3*Math.sin(t*Math.PI/4);
      P.ejes();
      P.curva(x=>Math.sin(x),{color:'--muted',grosor:1.6});
      P.curva(()=>a,{color:'--s4',grosor:2.2});
      let n=0;
      if(Math.abs(a)<=1){
        const al=Math.asin(a);
        for(let k=-4;k<=4;k++){
          const x1=al+2*k*Math.PI;
          if(x1>=-3*Math.PI&&x1<=3*Math.PI){ P.punto(x1,a,{color:'--s2',r:5}); n++; }
          const x2=(Math.PI-al)+2*k*Math.PI;
          if(x2>=-3*Math.PI&&x2<=3*Math.PI){ P.punto(x2,a,{color:'--s7',r:5}); n++; }
        }
      }
      /* rótulos y valores cortos, y de largo parejo entre los dos casos: la
         lectura tiene que medir lo mismo con y sin solución, o la tarjeta
         late mientras la recta sube y baja */
      leerC1.set(Math.abs(a)<=1
        ? [['a', a.toFixed(2)],['cortes a la vista', String(n)]]
        : [['a', a.toFixed(2)],['cortes a la vista', 'ninguno']]);
      avisoC1.set(Math.abs(a)<=1
        ? 'Los cortes marcados son los de este tramo; las dos familias siguen fuera de él, de vuelta en vuelta.'
        : 'Con $|a|\\gt 1$ la recta no llega a tocar la curva en ningún punto: la ecuación no tiene solución.');
    },{duracion:8});

    c1.append(el('p',{},'Cuando $|a|\\le 1$ aparecen ',el('b',{},'dos'),' familias de cortes, una por cada vuelta: una nace en $\\operatorname{arcsen} a$ y avanza de a $2\\pi$ (puntos verdes), la otra nace en $\\pi-\\operatorname{arcsen} a$ y avanza también de a $2\\pi$ (puntos violeta). Cuando $|a|\\gt1$ la recta queda por completo arriba o por completo abajo de la curva: no hay ningún corte, y la ecuación no tiene solución.'));
    c1.append(el('div',{class:'formula',html:'$$\\operatorname{sen}(x)=a,\\ |a|\\le 1 \\;\\Longrightarrow\\; x=\\operatorname{arcsen} a+2k\\pi \\quad\\text{ó}\\quad x=\\pi-\\operatorname{arcsen} a+2k\\pi,\\qquad k\\in\\mathbb{Z}$$'}));
    c1.append(el('p',{class:'note'},'Las dos familias hacen falta: quedarse solo con $x=\\operatorname{arcsen} a+2k\\pi$ deja fuera la mitad de las soluciones, que son justamente los puntos violeta del dibujo. $\\operatorname{arcsen} a$ entrega un único ángulo —el de $\\left[-\\tfrac\\pi2,\\tfrac\\pi2\\right]$—, y la simetría de la circunferencia respecto del eje $y$ aporta el segundo.'));
    c1.append(el('p',{class:'note'},'Ejemplo: $2\\operatorname{sen}(x)+1=0$ da $\\operatorname{sen}x=-\\tfrac12$, y con $\\operatorname{arcsen}(-\\tfrac12)=-\\pi/6$ las dos familias caen en $x=\\tfrac{7\\pi}{6}+2k\\pi$ y $x=\\tfrac{11\\pi}{6}+2k\\pi$.'));
    sec.append(c1);

    /* ---------- Tarjeta 2: por qué dos familias — el círculo unitario ---------- */
    const c2=el('div',{class:'card'});
    c2.append(el('h3',{},'Por qué dos familias: los puntos gemelos del círculo unitario'));
    c2.append(el('p',{},'Sobre la circunferencia $x^2+y^2=1$, dos ángulos distintos pueden compartir el mismo seno o el mismo coseno. Ahí nacen las dos familias de la tarjeta anterior.'));

    let modoC2='sen', thC2=40;
    const cajaC2=el('div',{class:'plot'}); c2.append(cajaC2);
    const P2=Plano(cajaC2,{xMin:-1.35,xMax:1.35,yMin:-1.35,yMax:1.35,alto:340,iso:true});
    P2.dibujar(P=>{
      const th=thC2*Math.PI/180, cx=Math.cos(th), cy=Math.sin(th);
      const w=P.ventana();
      P.ejes();
      P.parametrica(a=>[Math.cos(a),Math.sin(a)],0,2*Math.PI,{color:'--grid',grosor:1.4});
      if(modoC2==='sen'){
        P.parametrica(s=>[w.xMin+(w.xMax-w.xMin)*s,cy],0,1,{color:'--grid',grosor:1.4,guiones:true});
        P.punto(cx,cy,{color:'--s7',r:5}); P.texto(cx,cy,'θ',{color:'--s7',dx:9,dy:-9});
        P.punto(-cx,cy,{color:'--s2',r:5}); P.texto(-cx,cy,'π−θ',{color:'--s2',dx:-42,dy:-9});
      } else {
        P.parametrica(s=>[cx,w.yMin+(w.yMax-w.yMin)*s],0,1,{color:'--grid',grosor:1.4,guiones:true});
        P.punto(cx,cy,{color:'--s7',r:5}); P.texto(cx,cy,'θ',{color:'--s7',dx:9,dy:-9});
        P.punto(cx,-cy,{color:'--s1',r:5}); P.texto(cx,-cy,'−θ',{color:'--s1',dx:9,dy:16});
      }
    });
    function actualizarC2(){
      const th=thC2*Math.PI/180, cx=Math.cos(th), cy=Math.sin(th);
      if(modoC2==='sen'){
        leerC2.set([['θ', thC2+'°'],['sen θ', cy.toFixed(3)],['mismo seno', '180°−θ = '+(180-thC2)+'°']]);
      } else {
        leerC2.set([['θ', thC2+'°'],['cos θ', cx.toFixed(3)],['ángulo con el mismo coseno', '−θ = '+(-thC2)+'°']]);
      }
    }
    controlValor(c2,{label:'θ',min:-150,max:150,paso:1,valor:thC2,
      onChange:v=>{ thC2=v; P2.redibujar(); actualizarC2(); }});
    btnGroup(c2,[{label:'Mismo seno',value:'sen'},{label:'Mismo coseno',value:'cos'}],v=>{ modoC2=v; P2.redibujar(); actualizarC2(); });
    const leerC2=lectura(c2);
    actualizarC2();

    c2.append(el('p',{},'El seno es la altura: dos puntos a la misma altura son simétricos respecto del eje $y$, y sus ángulos suman $\\pi$. El coseno es la base: dos puntos con la misma base son simétricos respecto del eje $x$, y sus ángulos son opuestos. Con el mismo argumento salen las soluciones generales de coseno y tangente:'));
    c2.append(el('div',{class:'formula',html:'$$\\cos(x)=a,\\ |a|\\le 1 \\;\\Longrightarrow\\; x=2k\\pi\\pm\\arccos a,\\ k\\in\\mathbb{Z}$$'}));
    c2.append(el('div',{class:'formula',html:'$$\\tan(x)=b \\;\\Longrightarrow\\; x=k\\pi+\\arctan b,\\ k\\in\\mathbb{Z}$$'}));
    c2.append(el('p',{class:'note'},'La tangente tiene ',el('b',{},'una sola'),' familia porque su período es $\\pi$, no $2\\pi$: en el círculo, los ángulos $\\theta$ y $\\theta+\\pi$ son puntos opuestos, y un punto y su opuesto dan la misma razón $\\operatorname{sen}/\\cos$.'));
    sec.append(c2);

    /* ---------- Tarjeta 3: el cambio de variable ---------- */
    const c3=el('div',{class:'card'});
    c3.append(el('h3',{},'El cambio de variable: la ecuación se vuelve un polinomio'));
    c3.append(el('p',{},'Cuando la ecuación tiene una sola función trigonométrica repetida en distintas potencias, conviene nombrarla con una variable auxiliar y tratarla como un polinomio común. Con la identidad pitagórica $\\operatorname{sen}^2x=1-\\cos^2x$, la ecuación'));
    c3.append(el('div',{class:'formula',html:'$$-2\\operatorname{sen}^2x-3\\cos x+3=0$$'}));
    c3.append(el('p',{},'se reescribe entera en términos del coseno, y con $u=\\cos x$ queda un polinomio de segundo grado en $u$:'));

    const cajaC3=el('div',{class:'plot'}); c3.append(cajaC3);
    const P3=Plano(cajaC3,{xMin:-0.6,xMax:1.6,yMin:-0.6,yMax:2.2,alto:300});
    const leerC3=lectura(c3);
    P3.animar((P,t)=>{
      const u=0.5+1.1*Math.sin(t*Math.PI/3);
      const y=2*u*u-3*u+1;
      P.ejes();
      P.curva(uu=>2*uu*uu-3*uu+1,{color:'--s1',grosor:2.4});
      P.punto(0.5,0,{color:'--s2',r:6}); P.texto(0.5,0,'u = 1/2',{color:'--s2',dx:-14,dy:18});
      P.punto(1,0,{color:'--s7',r:6}); P.texto(1,0,'u = 1',{color:'--s7',dx:8,dy:-10});
      P.parametrica(s=>[u,y*s],0,1,{color:'--muted',grosor:1.2,guiones:true});
      P.punto(u,y,{color:'--s4',r:5});
      leerC3.set([['u', u.toFixed(2)],['2u² − 3u + 1', y.toFixed(2)+(Math.abs(y)<0.03?' ← cero':'')]]);
    },{duracion:6});

    c3.append(el('div',{class:'formula',html:'$$2u^2-3u+1=0 \\;\\Longleftrightarrow\\; (2u-1)(u-1)=0$$'}));
    c3.append(el('p',{},'Es decir, $u=\\tfrac12$ o $u=1$. Deshaciendo el cambio, $\\cos x=\\tfrac12$ o $\\cos x=1$ — dos ecuaciones elementales, cada una con su propia familia:'));
    c3.append(el('div',{class:'formula',html:'$$\\cos x=1 \\;\\Longrightarrow\\; x=2k\\pi$$'}));
    c3.append(el('div',{class:'formula',html:'$$\\cos x=\\tfrac12 \\;\\Longrightarrow\\; x=\\pm\\frac{\\pi}{3}+2k\\pi,\\quad k\\in\\mathbb{Z}$$'}));
    c3.append(el('p',{class:'note'},'El cambio de variable no resuelve nada por sí solo: solo hace visible que, debajo del disfraz trigonométrico, hay un polinomio común y conocido. Con $t=\\operatorname{sen}x$, $v=\\tan x$, etc. el mismo recurso sirve para otras formas.'));
    sec.append(c3);

    /* ---------- Tarjeta 4: la solución es la unión de los ceros ---------- */
    const c4=el('div',{class:'card'});
    c4.append(el('h3',{},'Factorizable: la solución es la unión de los ceros'));
    c4.append(el('p',{},'Si la ecuación ya quedó como un producto igualado a cero, no hace falta resolver nada nuevo: un producto se anula exactamente cuando alguno de sus factores se anula. Para'));
    c4.append(el('div',{class:'formula',html:'$$(2\\operatorname{sen}x-1)\\cos x=0$$'}));
    c4.append(el('p',{},'basta dibujar cada factor por separado y juntar sus ceros. El barrido de abajo los va marcando a medida que los encuentra.'));

    const cajaC4=el('div',{class:'plot'}); c4.append(cajaC4);
    const xMinC4=-0.6, xMaxC4=6.9;
    const cerosF1=[Math.PI/6,5*Math.PI/6,Math.PI/6+2*Math.PI].filter(x=>x>=xMinC4&&x<=xMaxC4);
    const cerosF2=[Math.PI/2,Math.PI/2+Math.PI,Math.PI/2+2*Math.PI].filter(x=>x>=xMinC4&&x<=xMaxC4);
    const P4=Plano(cajaC4,{xMin:xMinC4,xMax:xMaxC4,yMin:-3.3,yMax:3.3,alto:320});
    const leerC4=lectura(c4);
    P4.animar((P,t)=>{
      const sweepX=xMinC4+(xMaxC4-xMinC4)*(t/7);
      P.ejes();
      P.curva(x=>2*Math.sin(x)-1,{color:'--s2',grosor:2.2});
      P.curva(x=>Math.cos(x),{color:'--s1',grosor:2.2});
      const w=P.ventana();
      P.parametrica(s=>[sweepX,w.yMin+(w.yMax-w.yMin)*s],0,1,{color:'--muted',grosor:1.4,guiones:true});
      let n1=0,n2=0;
      cerosF1.forEach(x=>{ const listo=x<=sweepX; if(listo)n1++; P.punto(x,0,{color:'--s2',r:listo?6:2.5}); });
      cerosF2.forEach(x=>{ const listo=x<=sweepX; if(listo)n2++; P.punto(x,0,{color:'--s1',r:listo?6:2.5}); });
      leerC4.set([
        ['ceros de 2 sen x − 1 encontrados', n1+'/'+cerosF1.length],
        ['ceros de cos x encontrados', n2+'/'+cerosF2.length],
        ['unión hasta acá', (n1+n2)+' soluciones']
      ]);
    },{duracion:7});

    c4.append(el('p',{class:'note'},'El verde se anula donde $\\operatorname{sen}x=\\tfrac12$; el azul, donde $\\cos x=0$. Son puntos distintos: la ecuación completa vale cero en todos ellos, no solo en los que comparten los dos factores — por eso la solución final es la unión, nunca la intersección.'));
    c4.append(el('div',{class:'formula',html:'$$2\\operatorname{sen}x-1=0 \\;\\Longrightarrow\\; x=\\frac{\\pi}{6}+2k\\pi\\ \\text{ó}\\ x=\\frac{5\\pi}{6}+2k\\pi$$'}));
    c4.append(el('div',{class:'formula',html:'$$\\cos x=0 \\;\\Longrightarrow\\; x=\\frac{\\pi}{2}+k\\pi,\\quad k\\in\\mathbb{Z}$$'}));
    c4.append(el('p',{class:'note'},'Esto vale para cualquier ecuación factorizable, venga ya factorizada o llegue ahí después de un cambio de variable: se identifica cada factor, se resuelve su ecuación elemental por separado, y se unen los resultados.'));
    sec.append(c4);
  }
});
