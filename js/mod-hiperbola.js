/* La hipérbola: lugar geométrico, ecuación canónica en sus dos orientaciones,
   elementos, asíntotas, lado recto y excentricidad. Las curvas se trazan
   parametrizadas con cosh/senh (nunca con y=f(x)) para que no queden huecos
   cerca de los vértices, donde la pendiente crece muy rápido. Las cuentas de
   las tarjetas están verificadas aparte con Node antes de publicarse. */
registerModule({
  id:'hiperbola',
  title:'La hipérbola',
  unidad:'II',
  lead:'Los puntos cuya diferencia de distancias a dos focos se mantiene constante.',
  build(sec){

    /* Formatea con dos decimales sin dejar pasar un «-0.00» por error de
       redondeo de punto flotante. */
    function fmt2(x){ const v=Math.abs(x)<1e-9?0:x; return v.toFixed(2); }

    /* Una rama de hipérbola con eje transverso HORIZONTAL, centrada en (h,k):
       x=h+rama·a·cosh(u), y=k+b·senh(u). rama=1 (derecha) o −1 (izquierda). */
    function ramaH(P,h,k,a,b,rama,uMax,op){
      P.parametrica(u=>[h+rama*a*Math.cosh(u), k+b*Math.sinh(u)], -uMax, uMax, op);
    }
    /* Misma curva con eje transverso VERTICAL: los papeles de x e y se
       intercambian respecto de ramaH. */
    function ramaV(P,h,k,a,b,rama,uMax,op){
      P.parametrica(u=>[h+b*Math.sinh(u), k+rama*a*Math.cosh(u)], -uMax, uMax, op);
    }
    /* Recta de pendiente m por (h,k), trazada de borde a borde de la ventana
       visible (las asíntotas nunca son verticales ni horizontales acá). */
    function rectaPendiente(P,h,k,m,op){
      const w=P.ventana();
      P.parametrica(s=>{ const x=w.xMin+(w.xMax-w.xMin)*s; return [x, k+m*(x-h)]; },0,1,op);
    }
    function leyenda(mount,items){
      const L=el('div',{class:'legend'});
      items.forEach(([col,txt])=>L.append(el('span',{},
        el('i',{class:'sw',style:'background:var('+col+')'}),txt)));
      mount.append(L);
    }

    /* ---------- Tarjeta 1: definición como lugar geométrico (animada) ---------- */
    const c1=el('div',{class:'card'});
    c1.append(el('h3',{},'La diferencia de distancias que no cambia'));
    c1.append(el('p',{},'Con dos focos fijos $F_1$ y $F_2$, una hipérbola es el conjunto de puntos $P$ del plano para los que la diferencia de distancias a los focos, en valor absoluto, es siempre la misma. El punto violeta recorre primero la rama derecha y después la izquierda; en las dos, la diferencia que marca la lectura de abajo no cambia.'));

    const a1=2, b1=1.5, c1f=2.5;   /* c²=a²+b²=6,25=2,5² */
    const F1a=[-c1f,0], F2a=[c1f,0];
    const cajaP1=el('div',{class:'plot'}); c1.append(cajaP1);
    const P1=Plano(cajaP1,{xMin:-5,xMax:5,yMin:-3.2,yMax:3.2,alto:360,iso:true});
    const leerC1=lectura(c1);
    P1.animar((P,t)=>{
      const D=10, fase=(t%D)/D*2;               /* 0..1 rama derecha, 1..2 rama izquierda */
      const rama = fase<1 ? 1 : -1;
      const loc = fase<1 ? fase : fase-1;
      const u=1.3*Math.sin(Math.PI*(loc-0.5));  /* barre −1,3..1,3 de forma monótona */
      const x=rama*a1*Math.cosh(u), y=b1*Math.sinh(u);
      P.ejes();
      ramaH(P,0,0,a1,b1,1,1.3,{color:'--s1',grosor:2.2});
      ramaH(P,0,0,a1,b1,-1,1.3,{color:'--s1',grosor:2.2});
      P.punto(F1a[0],F1a[1],{color:'--s6',r:4,etiqueta:'F1'});
      P.punto(F2a[0],F2a[1],{color:'--s6',r:4,etiqueta:'F2'});
      P.parametrica(s=>[F1a[0]+(x-F1a[0])*s, F1a[1]+(y-F1a[1])*s],0,1,{color:'--s2',grosor:2});
      P.parametrica(s=>[F2a[0]+(x-F2a[0])*s, F2a[1]+(y-F2a[1])*s],0,1,{color:'--s4',grosor:2});
      P.punto(x,y,{color:'--s7',r:5});
      const d1=Math.hypot(x-F1a[0],y-F1a[1]), d2=Math.hypot(x-F2a[0],y-F2a[1]);
      leerC1.set([
        ['d1 = d(P,F1)', d1.toFixed(2)],
        ['d2 = d(P,F2)', d2.toFixed(2)],
        ['|d1 − d2|', Math.abs(d1-d2).toFixed(2)]
      ]);
    },{duracion:10});

    leyenda(c1,[['--s1','hipérbola'],['--s6','focos'],['--s2','d1'],['--s4','d2'],['--s7','punto P']]);

    c1.append(el('p',{class:'note'},'La lectura marca $4{,}00$ en todo momento, en las dos ramas: cerca de un vértice esa diferencia ya se nota a simple vista, y lejos de los focos los dos segmentos casi se emparejan en dirección, pero su diferencia de largo se mantiene.'));
    c1.append(el('div',{class:'formula',html:'$$|d(P,F_1)-d(P,F_2)|=2a$$'}));
    c1.append(el('p',{class:'note'},'El valor constante es $2a$: el doble de la distancia del centro a un vértice. En este ejemplo $a=2$, así que la diferencia vale $4$, exactamente lo que muestra el contador.'));
    sec.append(c1);

    /* ---------- Tarjeta 2: ecuación canónica, centro y orientación ---------- */
    const c2=el('div',{class:'card'});
    c2.append(el('h3',{},'La ecuación canónica, con centro en $(h,k)$'));
    c2.append(el('p',{},'Al desplazar el centro desde el origen hasta un punto $(h,k)$ cualquiera, cada coordenada de la ecuación se corre en lo mismo: $x$ pasa a $x-h$ e $y$ pasa a $y-k$. La orientación —cuál de las dos variables lleva el signo positivo— depende de si el eje transverso queda horizontal o vertical. Los botones cambian la orientación y el deslizador desplaza el centro en $x$.'));

    let orient2='h', hG2=1;
    const kFijo2=-1, a2=2, b2=1.5, c2f=2.5;
    const cajaP2=el('div',{class:'plot'}); c2.append(cajaP2);
    const P2=Plano(cajaP2,{xMin:-6,xMax:6,yMin:-5,yMax:3,alto:380,iso:true});
    function pintarC2(P){
      const h=hG2, k=kFijo2;
      P.ejes();
      let V1,V2,F1,F2;
      if(orient2==='h'){
        ramaH(P,h,k,a2,b2,1,1.3,{color:'--s1',grosor:2.2});
        ramaH(P,h,k,a2,b2,-1,1.3,{color:'--s1',grosor:2.2});
        V1=[h-a2,k]; V2=[h+a2,k]; F1=[h-c2f,k]; F2=[h+c2f,k];
      } else {
        ramaV(P,h,k,a2,b2,1,1.3,{color:'--s1',grosor:2.2});
        ramaV(P,h,k,a2,b2,-1,1.3,{color:'--s1',grosor:2.2});
        V1=[h,k-a2]; V2=[h,k+a2]; F1=[h,k-c2f]; F2=[h,k+c2f];
      }
      P.punto(h,k,{color:'--s4',r:4}); P.texto(h,k,'C',{color:'--s4',dx:8,dy:-8});
      P.punto(V1[0],V1[1],{color:'--s2',r:4}); P.punto(V2[0],V2[1],{color:'--s2',r:4});
      P.punto(F1[0],F1[1],{color:'--s6',r:4}); P.punto(F2[0],F2[1],{color:'--s6',r:4});
      P.texto(V1[0],V1[1],'V1',{color:'--s2',dx:-20,dy:14});
      P.texto(V2[0],V2[1],'V2',{color:'--s2',dx:8,dy:14});
      P.texto(F1[0],F1[1],'F1',{color:'--s6',dx:-20,dy:-10});
      P.texto(F2[0],F2[1],'F2',{color:'--s6',dx:8,dy:-10});
      return {V1,V2,F1,F2};
    }
    let ultimaC2=null;
    P2.dibujar(P=>{ ultimaC2=pintarC2(P); });
    const leerC2=lectura(c2);
    function actualizarC2(){
      P2.redibujar();
      const {V1,V2,F1,F2}=ultimaC2;
      leerC2.set([
        ['orientación', orient2==='h'?'horizontal':'vertical'],
        ['centro', '('+fmt2(hG2)+', '+fmt2(kFijo2)+')'],
        ['V1', '('+fmt2(V1[0])+', '+fmt2(V1[1])+')'],
        ['V2', '('+fmt2(V2[0])+', '+fmt2(V2[1])+')'],
        ['F1', '('+fmt2(F1[0])+', '+fmt2(F1[1])+')'],
        ['F2', '('+fmt2(F2[0])+', '+fmt2(F2[1])+')']
      ]);
    }
    btnGroup(c2,[{label:'Eje transverso horizontal',value:'h'},{label:'Eje transverso vertical',value:'v'}],
      v=>{ orient2=v; actualizarC2(); });
    controlValor(c2,{label:'h (centro en x)',min:-2,max:2,paso:0.1,valor:hG2,unidad:'',
      onChange:v=>{ hG2=v; actualizarC2(); }});
    actualizarC2();

    leyenda(c2,[['--s1','hipérbola'],['--s4','centro C'],['--s2','vértices'],['--s6','focos']]);

    c2.append(el('p',{class:'note'},'El centro $(h,k)$ no está sobre la curva: es el punto medio entre los dos vértices y también entre los dos focos, el que queda fijo al reflejar una rama sobre la otra.'));
    c2.append(el('p',{},el('b',{},'Eje transverso horizontal:')));
    c2.append(el('div',{class:'formula',html:'$$\\dfrac{(x-h)^2}{a^2}-\\dfrac{(y-k)^2}{b^2}=1$$'}));
    c2.append(el('p',{},el('b',{},'Eje transverso vertical:')));
    c2.append(el('div',{class:'formula',html:'$$\\dfrac{(y-k)^2}{a^2}-\\dfrac{(x-h)^2}{b^2}=1$$'}));
    c2.append(el('p',{class:'note'},'La variable que va primero, con signo positivo, es la del eje transverso. Con $h=1$, $k=-1$, $a=2$ y $b=1{,}5$, la forma horizontal queda $\\dfrac{(x-1)^2}{4}-\\dfrac{(y+1)^2}{2{,}25}=1$.'));
    c2.append(el('p',{class:'note'},'Al desarrollar los cuadrados y agrupar, cualquiera de las dos formas se reescribe como ecuación general $Ax^2+Cy^2+Dx+Ey+F=0$, con $A$ y $C$ de signos opuestos: es la marca de una hipérbola frente a otras cónicas.'));
    sec.append(c2);

    /* ---------- Tarjeta 3: elementos ---------- */
    const c3=el('div',{class:'card'});
    c3.append(el('h3',{},'Los elementos de la hipérbola'));
    c3.append(el('p',{},'Sobre una hipérbola centrada en el origen, con $a=3$ y $b=4$, se ubican todos sus elementos: el centro, los dos vértices —sobre la curva, en los extremos del eje transverso—, los dos focos —más alejados que los vértices, siempre del lado de adentro de cada rama— y el eje conjugado, perpendicular al transverso y del mismo largo que este mediría con $b$ en vez de $a$.'));

    const a3=3, b3=4, c3f=5;   /* c²=9+16=25=5² */
    const cajaP3=el('div',{class:'plot'}); c3.append(cajaP3);
    const P3=Plano(cajaP3,{xMin:-7,xMax:7,yMin:-6.5,yMax:6.5,alto:400,iso:true});
    P3.dibujar(P=>{
      P.ejes();
      ramaH(P,0,0,a3,b3,1,1.2,{color:'--s7',grosor:2.2});
      ramaH(P,0,0,a3,b3,-1,1.2,{color:'--s7',grosor:2.2});
      P.parametrica(s=>[-a3+2*a3*s,0],0,1,{color:'--s1',grosor:3});      /* eje transverso */
      P.parametrica(s=>[0,-b3+2*b3*s],0,1,{color:'--s2',grosor:2.4,guiones:true}); /* eje conjugado */
      P.punto(0,0,{color:'--s4',r:4}); P.texto(0,0,'C',{color:'--s4',dx:9,dy:16});
      P.punto(-a3,0,{color:'--s1',r:5}); P.texto(-a3,0,'V1',{color:'--s1',dx:-24,dy:16});
      P.punto(a3,0,{color:'--s1',r:5}); P.texto(a3,0,'V2',{color:'--s1',dx:8,dy:16});
      P.punto(-c3f,0,{color:'--s6',r:4}); P.texto(-c3f,0,'F1',{color:'--s6',dx:-10,dy:-12});
      P.punto(c3f,0,{color:'--s6',r:4}); P.texto(c3f,0,'F2',{color:'--s6',dx:2,dy:-12});
    });

    leyenda(c3,[['--s7','hipérbola'],['--s1','eje transverso y vértices'],['--s2','eje conjugado'],['--s6','focos'],['--s4','centro']]);

    c3.append(el('p',{class:'note'},'El eje conjugado —trazo segmentado— no toca la curva en ningún punto: sus extremos sirven para armar el rectángulo de las asíntotas, pero no son vértices. Los únicos puntos de la hipérbola sobre los ejes son $V_1$ y $V_2$.'));
    c3.append(el('div',{class:'formula',html:'$$c^2=a^2+b^2$$'}));
    c3.append(el('p',{class:'note'},'Ojo con el signo: en la elipse era $c^2=a^2-b^2$, con $c$ menor que $a$; acá es una suma, y por eso el foco siempre queda más lejos del centro que el vértice — nunca entre el centro y el vértice, como pasaría si el signo fuera el de la elipse.'));
    sec.append(c3);

    /* ---------- Tarjeta 4: asíntotas y el rectángulo 2a×2b (deslizadores) ---------- */
    const c4=el('div',{class:'card'});
    c4.append(el('h3',{},'Las asíntotas, desde un rectángulo'));
    c4.append(el('p',{},'Un rectángulo de $2a$ de ancho por $2b$ de alto, centrado en el centro de la hipérbola, tiene sus diagonales sobre las dos asíntotas: rectas de las que la curva se acerca cada vez más sin llegar a tocarlas. Al mover $a$ o $b$ el rectángulo cambia de proporción y las asíntotas —y con ellas, cuánto se abren las ramas— cambian con él.'));

    let aG4=2, bG4=1.5;
    const cajaP4=el('div',{class:'plot'}); c4.append(cajaP4);
    const P4=Plano(cajaP4,{xMin:-8,xMax:8,yMin:-8,yMax:8,alto:420,iso:true});
    function pintarC4(P){
      const a=aG4, b=bG4, m=b/a;
      P.ejes();
      /* rectángulo 2a×2b */
      P.parametrica(s=>[-a+2*a*s,-b],0,1,{color:'--s4',grosor:1.6,guiones:true});
      P.parametrica(s=>[-a+2*a*s, b],0,1,{color:'--s4',grosor:1.6,guiones:true});
      P.parametrica(s=>[-a,-b+2*b*s],0,1,{color:'--s4',grosor:1.6,guiones:true});
      P.parametrica(s=>[ a,-b+2*b*s],0,1,{color:'--s4',grosor:1.6,guiones:true});
      rectaPendiente(P,0,0,m,{color:'--s6',grosor:2});
      rectaPendiente(P,0,0,-m,{color:'--s6',grosor:2});
      ramaH(P,0,0,a,b,1,1.5,{color:'--s1',grosor:2.4});
      ramaH(P,0,0,a,b,-1,1.5,{color:'--s1',grosor:2.4});
      P.punto(a,0,{color:'--s1',r:4}); P.punto(-a,0,{color:'--s1',r:4});
      P.texto(a*0.7,b*0.85,'pendiente b/a',{color:'--s6',tam:11,dx:6});
    }
    P4.dibujar(pintarC4);
    const leerC4=lectura(c4);
    function actualizarC4(){
      P4.redibujar();
      const a=aG4,b=bG4, c=Math.hypot(a,b);
      leerC4.set([
        ['a', a.toFixed(2)], ['b', b.toFixed(2)], ['c', c.toFixed(2)],
        ['pendiente', (b/a).toFixed(3)]
      ]);
    }
    controlValor(c4,{label:'a',min:0.5,max:3,paso:0.1,valor:aG4,unidad:'',
      onChange:v=>{ aG4=v; actualizarC4(); }});
    controlValor(c4,{label:'b',min:0.5,max:3,paso:0.1,valor:bG4,unidad:'',
      onChange:v=>{ bG4=v; actualizarC4(); }});
    actualizarC4();

    leyenda(c4,[['--s1','hipérbola'],['--s4','rectángulo 2a×2b'],['--s6','asíntotas']]);

    c4.append(el('p',{class:'note'},'Cuanto más lejos del centro, más se pega cada rama a su asíntota, aunque nunca llega a tocarla: la distancia entre curva y recta tiende a cero, pero no se anula para ningún punto de la hipérbola.'));
    c4.append(el('p',{},'Con centro en el origen:'));
    c4.append(el('div',{class:'formula',html:'$$y=\\pm\\dfrac{b}{a}x$$'}));
    c4.append(el('p',{},'Con centro en $(h,k)$:'));
    c4.append(el('div',{class:'formula',html:'$$y-k=\\pm\\dfrac{b}{a}(x-h)$$'}));
    c4.append(el('p',{class:'note'},'Con eje transverso vertical la pendiente se invierte: las asíntotas quedan $y-k=\\pm\\dfrac{a}{b}(x-h)$, porque ahí es $a$ el semieje que corre en $y$.'));
    sec.append(c4);

    /* ---------- Tarjeta 5: lado recto y excentricidad (deslizador) ---------- */
    const c5=el('div',{class:'card'});
    c5.append(el('h3',{},'Lado recto y excentricidad'));
    c5.append(el('p',{},'El lado recto es la cuerda que pasa por un foco, perpendicular al eje transverso; su largo depende solo de $a$ y $b$. La excentricidad $e=c/a$ compara qué tan separado está el foco del centro frente al vértice: en toda hipérbola $e>1$, y al mover el deslizador se ve que valores cercanos a $1$ dan ramas angostas y pegadas al eje, mientras que valores grandes las abren y las acercan a sus asíntotas.'));

    let eG5=1.5;
    const aFijo5=2;
    const cajaP5=el('div',{class:'plot'}); c5.append(cajaP5);
    const P5=Plano(cajaP5,{xMin:-6.5,xMax:6.5,yMin:-8,yMax:8,alto:420,iso:true});
    function pintarC5(P){
      const a=aFijo5, e=eG5, c=a*e, b=Math.sqrt(c*c-a*a);
      const L=2*b*b/a;
      P.ejes();
      ramaH(P,0,0,a,b,1,1.4,{color:'--s1',grosor:2.2});
      ramaH(P,0,0,a,b,-1,1.4,{color:'--s1',grosor:2.2});
      P.punto(-c,0,{color:'--s6',r:4}); P.texto(-c,0,'F1',{color:'--s6',dx:-16,dy:-10});
      P.punto(c,0,{color:'--s6',r:4}); P.texto(c,0,'F2',{color:'--s6',dx:6,dy:-10});
      const yr=b*b/a;
      P.parametrica(s=>[c,-yr+2*yr*s],0,1,{color:'--s2',grosor:2.6});
      P.texto(c,yr,'L',{color:'--s2',dx:6,dy:-4});
      return {a,e,c,b,L};
    }
    let ultimaC5=null;
    P5.dibujar(P=>{ ultimaC5=pintarC5(P); });
    const leerC5=lectura(c5);
    function actualizarC5(){
      P5.redibujar();
      const {a,e,c,b,L}=ultimaC5;
      leerC5.set([
        ['a', a.toFixed(2)], ['e', e.toFixed(2)], ['c', c.toFixed(2)],
        ['b', b.toFixed(2)], ['lado recto', L.toFixed(2)]
      ]);
    }
    controlValor(c5,{label:'e',min:1.05,max:2,paso:0.05,valor:eG5,unidad:'',
      onChange:v=>{ eG5=v; actualizarC5(); }});
    actualizarC5();

    leyenda(c5,[['--s1','hipérbola'],['--s6','focos'],['--s2','lado recto']]);

    c5.append(el('div',{class:'formula',html:'$$e=\\dfrac{c}{a}\\gt1 \\qquad\\qquad L=\\dfrac{2b^2}{a}$$'}));
    c5.append(el('p',{class:'note'},'Con $a=2$ y $e=1{,}5$ resulta $c=3$, $b=\\sqrt5\\approx2{,}24$ y $L=5$: los mismos números que marca la lectura en la posición inicial del deslizador.'));
    sec.append(c5);

    /* ---------- Tarjeta 6: una aplicación de la definición ---------- */
    const c6=el('div',{class:'card'});
    c6.append(el('h3',{},'Ubicar una posición por diferencia de distancias'));
    c6.append(el('p',{},'La definición misma de la hipérbola resuelve un problema práctico: si dos emisores fijos $A$ y $B$ mandan una señal al mismo tiempo y un receptor mide cuánto más tarda en llegarle una que la otra, esa diferencia de tiempos —multiplicada por la velocidad de la señal— es una diferencia de distancias constante. Eso ubica al receptor sobre una rama de una hipérbola con focos en $A$ y $B$, sin saber todavía en qué punto exacto de ella está.'));

    const cajaP6=el('div',{class:'plot'}); c6.append(cajaP6);
    const P6=Plano(cajaP6,{xMin:-6,xMax:6,yMin:-4,yMax:4,alto:340,iso:true});
    P6.dibujar(P=>{
      const a=1.6, b=1.6, c=Math.hypot(a,b);
      P.ejes();
      ramaH(P,0,0,a,b,1,1.3,{color:'--s1',grosor:2.2});
      ramaH(P,0,0,a,b,-1,1.3,{color:'--s1',grosor:2.2});
      P.punto(-c,0,{color:'--s6',r:5}); P.texto(-c,0,'A',{color:'--s6',dx:-14,dy:16});
      P.punto(c,0,{color:'--s6',r:5}); P.texto(c,0,'B',{color:'--s6',dx:8,dy:16});
      const th=0.9;
      const px=a*Math.cosh(th), py=b*Math.sinh(th);
      P.punto(px,py,{color:'--s7',r:5}); P.texto(px,py,'receptor',{color:'--s7',dx:8,dy:-8,tam:11});
    });

    leyenda(c6,[['--s1','hipérbola'],['--s6','emisores A y B'],['--s7','un receptor posible']]);

    c6.append(el('p',{class:'note'},'Con una segunda pareja de emisores se traza una segunda hipérbola con otros focos, y la posición real del receptor queda fija en el punto donde las dos ramas se cruzan. Es el principio detrás de varios sistemas de navegación por diferencia de tiempo de llegada de una señal, y también el de los espejos hiperbólicos: un rayo dirigido hacia un foco se refleja como si viniera del otro.'));
    sec.append(c6);
  }
});
