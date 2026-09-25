/* Teoremas del seno y del coseno: resolver triangulos
   cualquiera (no necesariamente rectángulos).

   - Tarjeta 1 anima la demostración del teorema del seno (altura desde A).
   - Tarjeta 2 es la flagship: tres deslizadores de lados reconstruyen el
     triángulo y comprueban en vivo que a/senA = b/senB = c/senC = 2R por
     cuatro caminos independientes (tres razones + el radio circunscrito
     medido por coordenadas). Avisa si los lados no cierran un triángulo.
   - Tarjeta 3 anima el ángulo C para mostrar el área ½ab senC.
   - Tarjeta 4 anima el ángulo C pasando por 90° para ver el término
     −2ab cosC anularse: el teorema del coseno generaliza a Pitágoras.
   - Tarjeta 5 es la otra flagship: el caso ambiguo (SSA), con un deslizador
     que mueve el radio del arco y hace aparecer/desaparecer dos triángulos.
   - Tarjeta 6 resume qué datos pide cada teorema (sin figura, como la
     tarjeta 2 del módulo de referencia).
   Todos los planos van con iso:true: son triángulos y circunferencias. */
registerModule({
  id:'seno-coseno',
  title:'Teoremas del seno y del coseno',
  unidad:'I',
  lead:'Hasta acá, todo triángulo que resolvimos tenía un ángulo recto de regalo. Estos dos teoremas sueltan esa condición: sirven para cualquier triángulo, y entre los dos cubren todas las combinaciones de datos posibles.',
  build(sec){

    /* ---------- Tarjeta 1: la demostración del teorema del seno (animada) ---------- */
    const t1=el('div',{class:'card'});
    t1.append(el('h3',{},'El teorema del seno, en su propia demostración'));
    t1.append(el('p',{},'Para un triángulo $ABC$ cualquiera, con $a=BC$, $b=AC$ y $c=AB$, trazamos la altura $h$ desde $A$ hasta el lado $BC$. Eso parte al triángulo en dos triángulos rectángulos, uno con el ángulo $\\beta$ y otro con el ángulo $\\gamma$ — y ahí sí sabemos trabajar.'));

    const leerT1=el('p',{class:'note'});
    const cajaT1=el('div',{class:'plot'}); t1.append(cajaT1);
    const PT1=Plano(cajaT1,{xMin:-2.4,xMax:2.7,yMin:-0.5,yMax:2.7,alto:340,iso:true});
    const B1=[-1.6,0], C1=[1.8,0];
    PT1.animar((P,t)=>{
      const ax=0.35*Math.sin(2*Math.PI*t/8);
      const ay=1.5+0.55*Math.sin(2*Math.PI*t/4+1.1);
      const A=[ax,ay];
      const cLen=Math.hypot(A[0]-B1[0],A[1]-B1[1]);   /* c = AB */
      const bLen=Math.hypot(A[0]-C1[0],A[1]-C1[1]);   /* b = AC */
      const beta=Math.atan2(A[1]-B1[1],A[0]-B1[0]);          /* ángulo en B, desde BC (+x) */
      const angCA=Math.atan2(A[1]-C1[1],A[0]-C1[0]);         /* ángulo absoluto de CA */
      const gamma=Math.PI-angCA;                              /* ángulo en C, desde CB (−x) */
      P.ejes();
      P.parametrica(s=>[B1[0]+(C1[0]-B1[0])*s,0],0,1,{color:'--s1',grosor:2.8});
      P.parametrica(s=>[B1[0]+(A[0]-B1[0])*s,(A[1]-B1[1])*s],0,1,{color:'--s4',grosor:2.6});
      P.parametrica(s=>[C1[0]+(A[0]-C1[0])*s,(A[1]-C1[1])*s],0,1,{color:'--s2',grosor:2.6});
      /* altura, punteada, y su pie H */
      P.parametrica(s=>[A[0],A[1]*(1-s)],0,1,{color:'--muted',grosor:1.6,guiones:true});
      P.punto(A[0],0,{color:'--muted',r:3});
      P.texto(A[0],0,'H',{color:'--muted',dx:6,dy:16});
      /* arcos de los ángulos β (en B) y γ (en C) */
      const r=0.45;
      P.parametrica(a=>[B1[0]+r*Math.cos(a),B1[1]+r*Math.sin(a)],0,beta,{color:'--s4',grosor:2});
      P.parametrica(a=>[C1[0]+r*Math.cos(a),C1[1]+r*Math.sin(a)],angCA,Math.PI,{color:'--s2',grosor:2});
      P.punto(A[0],A[1],{color:'--ink',r:3.5}); P.punto(B1[0],B1[1],{color:'--ink',r:3.5}); P.punto(C1[0],C1[1],{color:'--ink',r:3.5});
      P.texto(A[0],A[1],'A',{dy:-10});
      P.texto(B1[0],B1[1],'B',{dx:-14,dy:14});
      P.texto(C1[0],C1[1],'C',{dx:8,dy:14});
      P.texto(B1[0]+0.7*Math.cos(beta/2),0.7*Math.sin(beta/2),'β',{color:'--s4',tam:13});
      P.texto(C1[0]+0.7*Math.cos((angCA+Math.PI)/2),0.7*Math.sin((angCA+Math.PI)/2),'γ',{color:'--s2',tam:13});
      P.texto((B1[0]+C1[0])/2,0,'a',{color:'--s1',dy:18});
      leerT1.textContent='h = '+A[1].toFixed(3)+' · c·sen β = '+(cLen*Math.sin(beta)).toFixed(3)
        +' · b·sen γ = '+(bLen*Math.sin(gamma)).toFixed(3);
    },{duracion:8});
    t1.append(leerT1);

    t1.append(el('p',{},'En el triángulo rectángulo de la izquierda, $h=c\\operatorname{sen}\\beta$; en el de la derecha, $h=b\\operatorname{sen}\\gamma$. Es la misma altura medida dos veces, así que esos dos productos son siempre iguales — el contador de arriba no se despega nunca, sin importar dónde esté $A$. Trazando la altura desde otro vértice se consigue la tercera igualdad, y queda el teorema completo:'));
    t1.append(el('div',{class:'formula',html:'$$\\frac{a}{\\operatorname{sen}A}=\\frac{b}{\\operatorname{sen}B}=\\frac{c}{\\operatorname{sen}C}$$'}));
    t1.append(el('p',{class:'note'},'Es una sola relación con tres caras, no tres fórmulas para memorizar por separado: cada lado dividido por el seno del ángulo opuesto a ese lado da siempre el mismo número.'));
    sec.append(t1);

    /* ---------- Tarjeta 2: reconstruir el triángulo + radio circunscrito (3 deslizadores) ---------- */
    const t2=el('div',{class:'card'});
    t2.append(el('h3',{},'Reconstruir el triángulo, y el radio de la circunferencia circunscrita'));
    t2.append(el('p',{},'Al fijar los tres lados $a=BC$, $b=AC$ y $c=AB$, el triángulo se arma solo, y con él su circunferencia circunscrita. Abajo se comparan cuatro números que deberían coincidir siempre: las tres razones del teorema del seno, y el diámetro $2R$ medido directo desde el centro de esa circunferencia — un camino que no usa senos para nada.'));

    let ladoA=3.5, ladoB=3.0, ladoC=2.6;
    const avisoT2=el('p',{class:'note'});
    const leerT2=el('p',{class:'note'});
    const cajaT2=el('div',{class:'plot'}); t2.append(cajaT2);
    const PT2=Plano(cajaT2,{xMin:-2,xMax:6,yMin:-3,yMax:5,alto:380,iso:true});
    PT2.dibujar(P=>{
      P.ejes();
      const a=ladoA,b=ladoB,c=ladoC;
      if(a+b<=c||a+c<=b||b+c<=a){
        avisoT2.innerHTML='<b>Esos tres lados no cierran un triángulo.</b> Cada lado tiene que ser menor que la suma de los otros dos (desigualdad triangular) — conviene ajustar los deslizadores.';
        leerT2.textContent='';
        return;
      }
      avisoT2.textContent='';
      const B=[0,0], C=[a,0];
      const x=(a*a+c*c-b*b)/(2*a);
      const y=Math.sqrt(Math.max(0,c*c-x*x));
      const A=[x,y];
      const beta=Math.atan2(y,x);
      const angCA=Math.atan2(y,x-a);
      const gamma=Math.PI-angCA;
      const alpha=Math.PI-beta-gamma;
      /* circuncentro: sobre x=a/2 (mediatriz de BC) y sobre la mediatriz de AB */
      const ycen=(x*x+y*y-a*x)/(2*y);
      const O=[a/2,ycen];
      const R=Math.hypot(O[0],O[1]);
      P.parametrica(ang=>[O[0]+R*Math.cos(ang),O[1]+R*Math.sin(ang)],0,2*Math.PI,{color:'--s7',grosor:1.6,guiones:true});
      P.punto(O[0],O[1],{color:'--s7',r:3});
      P.parametrica(s=>[B[0]+(C[0]-B[0])*s,0],0,1,{color:'--s1',grosor:2.8});
      P.parametrica(s=>[B[0]+(A[0]-B[0])*s,(A[1])*s],0,1,{color:'--s4',grosor:2.8});
      P.parametrica(s=>[C[0]+(A[0]-C[0])*s,(A[1])*s],0,1,{color:'--s2',grosor:2.8});
      P.punto(A[0],A[1],{color:'--ink',r:3.5}); P.punto(B[0],B[1],{color:'--ink',r:3.5}); P.punto(C[0],C[1],{color:'--ink',r:3.5});
      P.texto(A[0],A[1],'A',{dy:-10});
      P.texto(B[0],B[1],'B',{dx:-14,dy:14});
      P.texto(C[0],C[1],'C',{dx:8,dy:14});
      P.texto((B[0]+C[0])/2,0,'a',{color:'--s1',dy:18});
      P.texto((B[0]+A[0])/2,(A[1])/2,'c',{color:'--s4',dx:-14});
      P.texto((C[0]+A[0])/2,(A[1])/2,'b',{color:'--s2',dx:10});
      const r1=a/Math.sin(alpha), r2=b/Math.sin(beta), r3=c/Math.sin(gamma);
      leerT2.textContent='a/sen A = '+r1.toFixed(3)+'  ·  b/sen B = '+r2.toFixed(3)
        +'  ·  c/sen C = '+r3.toFixed(3)+'  ·  2R = '+(2*R).toFixed(3);
    });
    t2.append(el('div',{class:'controls'},
      el('label',{},'a:'),
      el('input',{type:'range',min:'1.5',max:'4',step:'0.1',value:String(ladoA),
        oninput:e=>{ladoA=parseFloat(e.target.value); PT2.redibujar();}}),
      el('label',{},'b:'),
      el('input',{type:'range',min:'1.5',max:'4',step:'0.1',value:String(ladoB),
        oninput:e=>{ladoB=parseFloat(e.target.value); PT2.redibujar();}}),
      el('label',{},'c:'),
      el('input',{type:'range',min:'1.5',max:'4',step:'0.1',value:String(ladoC),
        oninput:e=>{ladoC=parseFloat(e.target.value); PT2.redibujar();}})
    ));
    t2.append(avisoT2); t2.append(leerT2);
    t2.append(el('p',{},'La circunferencia que pasa por los tres vértices se llama circunscrita, y su radio $R$ tiene una relación directa con cada lado y su ángulo opuesto:'));
    t2.append(el('div',{class:'formula',html:'$$\\frac{a}{\\operatorname{sen}A}=\\frac{b}{\\operatorname{sen}B}=\\frac{c}{\\operatorname{sen}C}=2R$$'}));
    t2.append(el('p',{class:'note'},'Al achicar $a$ manteniendo $b$ y $c$ casi iguales entre sí, $R$ crece rápido: cuanto más aplanado el triángulo, más grande la circunferencia que hace falta para pasar por los tres vértices.'));
    sec.append(t2);

    /* ---------- Tarjeta 3: el área con dos lados y el ángulo comprendido (animada) ---------- */
    const t3=el('div',{class:'card'});
    t3.append(el('h3',{},'El área con dos lados y el ángulo comprendido'));
    t3.append(el('p',{},'Con dos lados $a$ y $b$ fijos desde el vértice $C$, la altura del triángulo medida desde $A$ es $b\\operatorname{sen}C$: el área sigue siendo base por altura sobre dos, solo que la altura queda escrita en términos del ángulo entre los dos lados.'));

    const leerT3=el('p',{class:'note'});
    const cajaT3=el('div',{class:'plot'}); t3.append(cajaT3);
    const PT3=Plano(cajaT3,{xMin:-2.6,xMax:3.4,yMin:-1,yMax:2.8,alto:340,iso:true});
    const aT3=3, bT3=2.2;
    PT3.animar((P,t)=>{
      const u=t/6;
      const th=(90+85*Math.sin(2*Math.PI*u))*Math.PI/180;   /* oscila entre 5° y 175° */
      const C=[0,0], B=[aT3,0];
      const A=[bT3*Math.cos(th),bT3*Math.sin(th)];
      P.ejes();
      P.parametrica(s=>[C[0]+(B[0]-C[0])*s,0],0,1,{color:'--s1',grosor:2.8});
      P.parametrica(s=>[C[0]+A[0]*s,A[1]*s],0,1,{color:'--s2',grosor:2.8});
      P.parametrica(s=>[B[0]+(A[0]-B[0])*s,A[1]*s],0,1,{color:'--s7',grosor:2});
      /* altura desde A, punteada, hasta la recta que contiene a C-B */
      P.parametrica(s=>[A[0],A[1]*(1-s)],0,1,{color:'--muted',grosor:1.6,guiones:true});
      const r=0.5;
      P.parametrica(a=>[C[0]+r*Math.cos(a),C[1]+r*Math.sin(a)],0,th,{color:'--s4',grosor:2.2});
      P.punto(A[0],A[1],{color:'--ink',r:3.5}); P.punto(B[0],B[1],{color:'--ink',r:3.5}); P.punto(C[0],C[1],{color:'--ink',r:3.5});
      P.texto(A[0],A[1],'A',{dy:-10});
      P.texto(B[0],B[1],'B',{dx:8,dy:14});
      P.texto(C[0],C[1],'C',{dx:-16,dy:14});
      P.texto(C[0]+0.65*Math.cos(th/2),C[1]+0.65*Math.sin(th/2),'C',{color:'--s4',tam:12});
      const area=0.5*aT3*bT3*Math.sin(th);
      leerT3.textContent='ángulo C = '+(th*180/Math.PI).toFixed(0)+'° · altura = b·sen C = '
        +(bT3*Math.sin(th)).toFixed(3)+' · área = ½·a·b·sen C = '+area.toFixed(3);
    },{duracion:6});
    t3.append(leerT3);

    t3.append(el('p',{class:'note'},'Si el ángulo $C$ es obtuso, el pie de la altura queda fuera del lado $CB$ — igual que en la demostración del teorema del coseno — pero la fórmula no cambia: $\\operatorname{sen}C$ ya es positivo en todo $(0°,180°)$, así que el área nunca da negativa. El área máxima, con $a$ y $b$ fijos, se da exactamente en $C=90°$.'));
    t3.append(el('div',{class:'formula',html:'$$\\text{Área}=\\tfrac12\\,ab\\operatorname{sen}C$$'}));
    sec.append(t3);

    /* ---------- Tarjeta 4: el teorema del coseno generaliza a Pitágoras (animada) ---------- */
    const t4=el('div',{class:'card'});
    t4.append(el('h3',{},'Por qué el teorema del coseno generaliza a Pitágoras'));
    t4.append(el('p',{},'Con dos lados $a,b$ fijos desde $C$ y el ángulo $C$ entre ellos, el tercer lado cumple $c^2=a^2+b^2-2ab\\operatorname{cos}C$. El término $-2ab\\operatorname{cos}C$ es la corrección respecto de Pitágoras — observa qué le pasa cuando $C$ pasa por $90°$.'));

    const leerT4=el('p',{class:'note'});
    const cajaT4=el('div',{class:'plot'}); t4.append(cajaT4);
    const PT4=Plano(cajaT4,{xMin:-2.4,xMax:3.4,yMin:-1,yMax:2.3,alto:340,iso:true});
    const aT4=3, bT4=2.5;
    PT4.animar((P,t)=>{
      const u=t/7;
      const th=(90+52*Math.sin(2*Math.PI*u))*Math.PI/180;   /* oscila 38°..142°, cruza 90° */
      const C=[0,0], B=[aT4,0];
      const A=[bT4*Math.cos(th),bT4*Math.sin(th)];
      const c2coords=(A[0]-B[0])*(A[0]-B[0])+A[1]*A[1];
      const term=-2*aT4*bT4*Math.cos(th);
      const c2formula=aT4*aT4+bT4*bT4+term;
      P.ejes();
      P.parametrica(s=>[C[0]+(B[0]-C[0])*s,0],0,1,{color:'--s1',grosor:2.8});
      P.parametrica(s=>[C[0]+A[0]*s,A[1]*s],0,1,{color:'--s2',grosor:2.8});
      P.parametrica(s=>[B[0]+(A[0]-B[0])*s,A[1]*s],0,1,{color:'--s7',grosor:2.6});
      const r=0.45;
      P.parametrica(a=>[C[0]+r*Math.cos(a),C[1]+r*Math.sin(a)],0,th,{color:'--s4',grosor:2.2});
      P.punto(A[0],A[1],{color:'--ink',r:3.5}); P.punto(B[0],B[1],{color:'--ink',r:3.5}); P.punto(C[0],C[1],{color:'--ink',r:3.5});
      P.texto(A[0],A[1],'A',{dy:-10});
      P.texto(B[0],B[1],'B',{dx:8,dy:14});
      P.texto(C[0],C[1],'C',{dx:-16,dy:14});
      P.texto((C[0]+B[0])/2,0,'a',{color:'--s1',dy:18});
      P.texto((C[0]+A[0])/2,(A[1])/2,'b',{color:'--s2',dx:-14});
      P.texto((B[0]+A[0])/2,(A[1])/2,'c',{color:'--s7',dx:8});
      const gdeg=th*180/Math.PI;
      const marca=Math.abs(gdeg-90)<1.5?'  ←  ¡c² = a²+b²!':'';
      leerT4.textContent='C = '+gdeg.toFixed(0)+'° · c² (coordenadas) = '+c2coords.toFixed(3)
        +' · a²+b² = '+(aT4*aT4+bT4*bT4).toFixed(3)+' · −2ab·cos C = '+term.toFixed(3)+marca;
    },{duracion:7});
    t4.append(leerT4);

    t4.append(el('p',{},'Cuando $C=90°$, $\\cos C=0$ y el término $-2ab\\operatorname{cos}C$ se anula solo: el teorema del coseno se convierte exactamente en Pitágoras. Para cualquier otro ángulo, ese término es la diferencia entre $c^2$ y $a^2+b^2$: negativo si $C$ es agudo, positivo si es obtuso.'));
    t4.append(el('div',{class:'formula',html:'$$c^2=a^2+b^2-2ab\\operatorname{cos}C$$'}));
    t4.append(el('p',{class:'note'},'La misma relación vale para los otros dos lados, rotando las letras: $a^2=b^2+c^2-2bc\\operatorname{cos}A$ y $b^2=a^2+c^2-2ac\\operatorname{cos}B$.'));
    sec.append(t4);

    /* ---------- Tarjeta 5: el caso ambiguo, SSA (deslizador) ---------- */
    const t5=el('div',{class:'card'});
    t5.append(el('h3',{},'El caso ambiguo: dos lados y un ángulo no comprendido'));
    t5.append(el('p',{},'Fijamos el ángulo $A$ y el lado $b$ que sale de él. El otro dato es el lado $a$, opuesto a $A$ — no comprendido entre los dos datos anteriores. El vértice $C$ ya quedó fijo; $B$ tiene que estar sobre el rayo que marca el ángulo $A$ ',el('b',{},'y'),' a distancia $a$ de $C$: son los cortes de una circunferencia de radio $a$ centrada en $C$ con ese rayo.'));

    let aT5=2.4;
    const AdegT5=40, bT5=3;
    const umbralT5=bT5*Math.sin(AdegT5*Math.PI/180);
    const leerT5=el('p',{class:'note'});
    const cajaT5=el('div',{class:'plot'}); t5.append(cajaT5);
    const PT5=Plano(cajaT5,{xMin:-2,xMax:8,yMin:-2,yMax:6,alto:380,iso:true});
    PT5.dibujar(P=>{
      P.ejes();
      const Arad=AdegT5*Math.PI/180;
      const Ap=[0,0], Cp=[bT5,0];
      P.parametrica(s=>[Ap[0]+(Cp[0]-Ap[0])*s,0],0,1,{color:'--s1',grosor:2.8});
      P.parametrica(s=>[7*Math.cos(Arad)*s,7*Math.sin(Arad)*s],0,1,{color:'--muted',grosor:1.6,guiones:true});
      const rArco=0.5;
      P.parametrica(a=>[rArco*Math.cos(a),rArco*Math.sin(a)],0,Arad,{color:'--s4',grosor:2.2});
      P.texto(0.7*Math.cos(Arad/2),0.7*Math.sin(Arad/2),'A',{color:'--s4',tam:12});
      P.parametrica(a=>[Cp[0]+aT5*Math.cos(a),Cp[1]+aT5*Math.sin(a)],0,2*Math.PI,{color:'--s6',grosor:1.6,guiones:true});
      P.punto(Ap[0],Ap[1],{color:'--ink',r:4}); P.punto(Cp[0],Cp[1],{color:'--ink',r:4});
      P.texto(Ap[0],Ap[1],'A',{dx:-16,dy:16});
      P.texto(Cp[0],Cp[1],'C',{dx:8,dy:16});
      P.texto(bT5/2,0,'b',{color:'--s1',dy:18});

      const D=aT5*aT5-bT5*bT5*Math.sin(Arad)*Math.sin(Arad);
      let sols=[];
      if(D>=-1e-9){
        const sq=Math.sqrt(Math.max(0,D));
        const t1=bT5*Math.cos(Arad)-sq, t2=bT5*Math.cos(Arad)+sq;
        [t1,t2].forEach(tv=>{ if(tv>1e-6) sols.push(tv); });
        if(sols.length===2 && Math.abs(sols[0]-sols[1])<1e-4) sols=[sols[0]];
      }
      const col=['--s2','--s7'];
      sols.forEach((tv,i)=>{
        const B=[tv*Math.cos(Arad),tv*Math.sin(Arad)];
        P.parametrica(s=>[Ap[0]+B[0]*s,B[1]*s],0,1,{color:col[i],grosor:2.4});
        P.parametrica(s=>[Cp[0]+(B[0]-Cp[0])*s,Cp[1]+B[1]*s],0,1,{color:col[i],grosor:2.4});
        P.punto(B[0],B[1],{color:col[i],r:5});
        P.texto(B[0],B[1],'B'+(sols.length>1?String(i+1):''),{color:col[i],dx:8,dy:-8});
      });

      if(sols.length===0) leerT5.textContent='a = '+aT5.toFixed(2)+' · ningún triángulo: el arco no llega a tocar el rayo.';
      else if(sols.length===1) leerT5.textContent='a = '+aT5.toFixed(2)+' · un solo triángulo.';
      else leerT5.textContent='a = '+aT5.toFixed(2)+' · DOS triángulos posibles, B1 y B2 — los dos cumplen los mismos tres datos (A, b y a).';
    });
    t5.append(el('div',{class:'controls'},
      el('label',{},'a:'),
      el('input',{type:'range',min:'1.2',max:'4',step:'0.02',value:String(aT5),
        oninput:e=>{aT5=parseFloat(e.target.value); PT5.redibujar();}})
    ));
    t5.append(leerT5);

    t5.append(el('p',{},'Al bajar $a$ de a poco desde un valor grande, primero hay un solo triángulo (el arco cruza el rayo una sola vez del lado positivo); al entrar en la franja ambigua aparecen dos; cuando el arco queda justo tangente al rayo, los dos se juntan en uno solo, con ángulo recto en $B$; y más abajo de esa tangencia el arco ya no llega a tocar el rayo — ningún triángulo posible.'));
    t5.append(el('div',{class:'formula',html:'$$a=b\\operatorname{sen}A\\ \\text{(tangencia)}$$'}));
    t5.append(el('p',{class:'note'},'Con $A=40°$ y $b=3$ ese umbral de tangencia es $a\\approx'+umbralT5.toFixed(2)+'$. Entre ese valor y $b=3$ hay dos triángulos; por encima de $b$, la circunferencia ya solo cruza el rayo del lado positivo una vez, y vuelve a haber uno solo.'));
    sec.append(t5);

    /* ---------- Tarjeta 6: qué datos pide cada teorema (sin figura) ---------- */
    const t6=el('div',{class:'card'});
    t6.append(el('h3',{},'Qué datos pide cada teorema'));
    t6.append(el('p',{},'Los dos teoremas resuelven triángulos con datos distintos. La regla práctica: conviene fijarse si el ángulo conocido queda ',el('b',{},'opuesto'),' a un lado también conocido (seno), o ',el('b',{},'comprendido'),' entre dos lados conocidos — o si directamente no hay ningún ángulo entre los datos (coseno, con los tres lados).'));
    t6.append(el('p',{},el('b',{},'Teorema del seno'),' — sirve con:'));
    t6.append(el('ul',{},
      el('li',{},'dos ángulos y un lado cualquiera (AAS o ASA): el tercer ángulo sale de que los tres suman $180°$, y de ahí los lados que falten;'),
      el('li',{},'dos lados y el ángulo opuesto a uno de ellos (SSA): es el caso ambiguo de la tarjeta anterior — puede dar cero, uno o dos triángulos.')
    ));
    t6.append(el('p',{},el('b',{},'Teorema del coseno'),' — sirve con:'));
    t6.append(el('ul',{},
      el('li',{},'los tres lados (SSS): sin ningún ángulo de partida, pero el coseno despeja cualquiera de los tres sin ambigüedad;'),
      el('li',{},'dos lados y el ángulo comprendido entre ellos (SAS): el que queda entre los dos lados dados, no el opuesto a ninguno.')
    ));
    t6.append(el('p',{class:'note'},'Con SAS conviene encadenarlos: primero el coseno, para sacar el tercer lado (con eso ya son los tres lados, SSS), y recién ahí el seno para los ángulos que falten. Usar el seno directamente con un ángulo comprendido no tiene sentido, porque el seno necesita un ángulo opuesto a un lado conocido.'));
    t6.append(el('p',{class:'note'},'Con SSS también conviene el coseno para el primer ángulo: si se despeja con el seno, $\\operatorname{sen}^{-1}$ no distingue un ángulo agudo de su suplementario obtuso, y ahí sí hay riesgo real de ambigüedad — el coseno no tiene ese problema porque es inyectivo en $(0°,180°)$.'));
    sec.append(t6);
  }
});
