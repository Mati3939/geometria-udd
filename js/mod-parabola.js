/* La parábola: lugar geométrico, ecuaciones canónica y general, elementos
   (vértice, foco, directriz, eje, lado recto) y la propiedad de reflexión.
   Las cuentas de las tarjetas están verificadas aparte con Node antes de
   publicarse. */
registerModule({
  id:'parabola',
  title:'La parábola',
  unidad:'II',
  lead:'Los puntos que están a la misma distancia de un foco y de una recta directriz.',
  build(sec){

    const num=n=>(n<0?'−'+(-n):String(n));

    function leyenda(mount,items){
      const L=el('div',{class:'legend'});
      items.forEach(([col,txt])=>L.append(el('span',{},
        el('i',{class:'sw',style:'background:var('+col+')'}),txt)));
      mount.append(L);
    }

    /* Un p muy cercano a 0 da una "parábola" degenerada (el eje mismo);
       se aleja lo justo para que la curva y el lado recto sigan teniendo
       sentido en el dibujo, sin cambiar el valor que se lee en la casilla. */
    function pSeguro(p){ return Math.abs(p)<0.12 ? (p<0?-0.12:0.12) : p; }

    /* Traza la parábola de eje vertical (x-h)²=4p(y-k) de borde a borde de
       la ventana visible. */
    function parabolaV(P,h,k,p,op){
      P.curva(x=>k+(x-h)*(x-h)/(4*p),op);
    }
    /* Traza la parábola de eje horizontal (y-k)²=4p(x-h), recorriendo y en
       vez de x porque x no es función de y en el sentido usual. */
    function parabolaH(P,h,k,p,op){
      const w=P.ventana();
      P.parametrica(s=>{const y=w.yMin+(w.yMax-w.yMin)*s; return [h+(y-k)*(y-k)/(4*p),y];},0,1,op);
    }
    function directrizV(P,k,p,op){ const w=P.ventana(); P.parametrica(s=>[w.xMin+(w.xMax-w.xMin)*s,k-p],0,1,op); }
    function directrizH(P,h,p,op){ const w=P.ventana(); P.parametrica(s=>[h-p,w.yMin+(w.yMax-w.yMin)*s],0,1,op); }

    /* ---------- Tarjeta 1: la parábola como lugar geométrico (animada) ---------- */
    const c1=el('div',{class:'card'});
    c1.append(el('h3',{},'La parábola como lugar geométrico'));
    c1.append(el('p',{},'Una ',el('b',{},'parábola'),' es el conjunto de los puntos del plano que están a la misma distancia de un punto fijo, el foco, y de una recta fija que no lo contiene, la directriz. El punto rojo del siguiente dibujo recorre la curva mientras se trazan sus dos distancias: al foco y a la directriz.'));

    const pC1=1.3;   /* vértice en el origen, eje vertical */
    const cajaP1=el('div',{class:'plot'}); c1.append(cajaP1);
    const P1=Plano(cajaP1,{xMin:-4,xMax:4,yMin:-2.4,yMax:3.2,alto:360,iso:true});
    const leerC1=lectura(c1);
    P1.animar((P,t)=>{
      const u=(t/8)%1, tri=1-Math.abs(1-2*u);
      const x=-3.2+6.4*tri;
      const y=x*x/(4*pC1);
      const dFoco=Math.hypot(x-0,y-pC1);
      const dDir=y+pC1;   /* y - (-p), siempre positivo porque y>=0 */
      const w=P.ventana();
      P.ejes();
      parabolaV(P,0,0,pC1,{color:'--s1',grosor:2.4});
      P.parametrica(s=>[w.xMin+(w.xMax-w.xMin)*s,-pC1],0,1,{color:'--s6',grosor:1.8,guiones:true});
      P.texto(w.xMin,-pC1,'directriz',{color:'--s6',dx:4,dy:-6});
      P.punto(0,pC1,{color:'--s2',r:5});
      P.texto(0,pC1,'foco',{color:'--s2',dx:8,dy:-8});
      P.punto(0,0,{color:'--s7',r:4});
      P.texto(0,0,'V',{color:'--s7',dx:-16,dy:14});
      P.parametrica(s=>[x*(1-s),y+(pC1-y)*s],0,1,{color:'--s2',grosor:1.8});
      P.parametrica(s=>[x,y+(-pC1-y)*s],0,1,{color:'--s6',grosor:1.8});
      P.punto(x,y,{color:'--s8',r:5});
      leerC1.set([
        ['P','('+x.toFixed(2)+', '+y.toFixed(2)+')'],
        ['d(P, foco)',dFoco.toFixed(3)],
        ['d(P, directriz)',dDir.toFixed(3)]
      ]);
    },{duracion:8});

    leyenda(c1,[['--s7','vértice'],['--s2','foco y distancia al foco'],['--s6','directriz y distancia a ella'],['--s8','P sobre la curva']]);

    c1.append(el('p',{class:'note'},'Los dos números de la lectura coinciden en todo momento, sin importar dónde esté $P$ sobre la curva: esa igualdad no es una propiedad más de la parábola, es su definición.'));
    c1.append(el('div',{class:'formula',html:'$$x^2=4py \\qquad \\text{(vértice en el origen, eje vertical, foco en }(0,p)\\text{, directriz }y=-p\\text{)}$$'}));
    c1.append(el('p',{class:'note'},'$p$ es la distancia (con signo) del vértice al foco, y también la distancia del vértice a la directriz, medida hacia el lado contrario. Con $p>0$ la curva abre hacia arriba, porque el foco queda por encima del vértice.'));
    sec.append(c1);

    /* ---------- Tarjeta 2: elementos, con deslizador en p ---------- */
    const c2=el('div',{class:'card'});
    c2.append(el('h3',{},'Elementos: vértice, foco, directriz y lado recto'));
    c2.append(el('p',{},'Con el vértice en el origen y eje vertical, un solo número $p$ fija toda la curva: su signo decide hacia dónde abre, y su tamaño decide qué tan abierta o cerrada queda. El segmento ámbar es el ',el('b',{},'lado recto'),': la cuerda que pasa por el foco, perpendicular al eje, y mide $|4p|$.'));

    let pG2=1.3;
    const cajaP2=el('div',{class:'plot'}); c2.append(cajaP2);
    const P2=Plano(cajaP2,{xMin:-6.5,xMax:6.5,yMin:-3.8,yMax:3.8,alto:360,iso:true});
    function pintarC2(P){
      const p=pSeguro(pG2);
      P.ejes();
      parabolaV(P,0,0,p,{color:'--s1',grosor:2.4});
      directrizV(P,0,p,{color:'--s6',grosor:1.8,guiones:true});
      const w=P.ventana();
      P.texto(w.xMin,-p,'directriz',{color:'--s6',dx:4,dy:p>=0?-6:14});
      P.parametrica(s=>[-2*p+4*p*s,p],0,1,{color:'--s4',grosor:3});
      P.punto(-2*p,p,{color:'--s4',r:4});
      P.punto(2*p,p,{color:'--s4',r:4});
      P.texto(-2*p,p,'lado recto',{color:'--s4',dx:6,dy:p>=0?-10:16});
      P.punto(0,p,{color:'--s2',r:5});
      P.texto(0,p,'foco',{color:'--s2',dx:8,dy:p>=0?14:-16});
      P.punto(0,0,{color:'--s7',r:4});
      P.texto(0,0,'V',{color:'--s7',dx:-16,dy:14});
    }
    P2.dibujar(pintarC2);
    const leerC2=lectura(c2);
    function actualizarC2(){
      P2.redibujar();
      const p=pSeguro(pG2);
      leerC2.set([
        ['p',p.toFixed(2)],
        ['vértice','(0, 0)'],
        ['foco','(0, '+p.toFixed(2)+')'],
        ['directriz','y = '+(-p).toFixed(2)],
        ['lado recto',Math.abs(4*p).toFixed(2)],
        ['abre hacia',p>=0?'arriba':'abajo']
      ]);
    }
    controlValor(c2,{label:'p',min:-3,max:3,paso:0.1,valor:pG2,unidad:'',
      onChange:v=>{ pG2=v; actualizarC2(); }});
    actualizarC2();

    leyenda(c2,[['--s7','vértice'],['--s2','foco'],['--s6','directriz'],['--s4','lado recto']]);

    c2.append(el('p',{class:'note'},'Al arrastrar $p$ hacia valores negativos, el foco y la directriz cambian de lado y la curva se da vuelta: la apertura siempre queda del lado del foco. Con $|p|$ chico el foco está cerca del vértice y la curva se cierra; con $|p|$ grande el foco se aleja y la curva se abre.'));
    c2.append(el('div',{class:'formula',html:'$$\\text{foco}=(0,p) \\qquad \\text{directriz: }y=-p \\qquad \\text{lado recto}=|4p|$$'}));
    sec.append(c2);

    /* ---------- Tarjeta 3: vértice trasladado, eje horizontal o vertical ---------- */
    const c3=el('div',{class:'card'});
    c3.append(el('h3',{},'Vértice fuera del origen: los dos ejes posibles'));
    c3.append(el('p',{},'Trasladar el vértice a un punto $(h,k)$ cualquiera no cambia la forma de la curva, solo su ubicación. Y el eje de la parábola puede ser vertical —la variable elevada al cuadrado es $x$— u horizontal —la variable elevada al cuadrado es $y$—. Los botones cambian el eje; el control cambia $p$.'));

    const hC3=2, kC3=-1;
    let orientC3='v', pG3=1.4;
    const cajaP3=el('div',{class:'plot'}); c3.append(cajaP3);
    const P3=Plano(cajaP3,{xMin:-4,xMax:9,yMin:-7,yMax:5,alto:380,iso:true});
    function pintarC3(P){
      const p=pSeguro(pG3);
      P.ejes();
      if(orientC3==='v'){
        parabolaV(P,hC3,kC3,p,{color:'--s1',grosor:2.4});
        directrizV(P,kC3,p,{color:'--s6',grosor:1.8,guiones:true});
        P.punto(hC3,kC3+p,{color:'--s2',r:5});
        P.texto(hC3,kC3+p,'foco',{color:'--s2',dx:8,dy:-8});
      } else {
        parabolaH(P,hC3,kC3,p,{color:'--s1',grosor:2.4});
        directrizH(P,hC3,p,{color:'--s6',grosor:1.8,guiones:true});
        P.punto(hC3+p,kC3,{color:'--s2',r:5});
        P.texto(hC3+p,kC3,'foco',{color:'--s2',dx:8,dy:-8});
      }
      P.punto(hC3,kC3,{color:'--s7',r:4});
      P.texto(hC3,kC3,'V',{color:'--s7',dx:-16,dy:14});
    }
    P3.dibujar(pintarC3);
    const leerC3=lectura(c3);
    function actualizarC3(){
      P3.redibujar();
      const p=pSeguro(pG3);
      if(orientC3==='v'){
        leerC3.set([
          ['eje','vertical'],
          ['vértice','('+num(hC3)+', '+num(kC3)+')'],
          ['foco','('+num(hC3)+', '+(kC3+p).toFixed(2)+')'],
          ['directriz','y = '+(kC3-p).toFixed(2)]
        ]);
      } else {
        leerC3.set([
          ['eje','horizontal'],
          ['vértice','('+num(hC3)+', '+num(kC3)+')'],
          ['foco','('+(hC3+p).toFixed(2)+', '+num(kC3)+')'],
          ['directriz','x = '+(hC3-p).toFixed(2)]
        ]);
      }
    }
    btnGroup(c3,[{label:'Eje vertical',value:'v'},{label:'Eje horizontal',value:'h'}],
      v=>{ orientC3=v; actualizarC3(); });
    controlValor(c3,{label:'p',min:-3,max:3,paso:0.1,valor:pG3,unidad:'',
      onChange:v=>{ pG3=v; actualizarC3(); }});
    actualizarC3();

    leyenda(c3,[['--s7','vértice'],['--s2','foco'],['--s6','directriz']]);

    c3.append(el('p',{class:'note'},'El eje de la parábola es siempre la recta que pasa por el vértice y el foco: vertical cuando la variable al cuadrado es $x$, horizontal cuando es $y$. Cambiar de eje no es un caso especial aparte, es la misma ecuación con los papeles de $x$ y de $y$ intercambiados.'));
    c3.append(el('div',{class:'formula',html:'$$(x-h)^2=4p(y-k)\\ \\text{(eje vertical)} \\qquad\\qquad (y-k)^2=4p(x-h)\\ \\text{(eje horizontal)}$$'}));
    sec.append(c3);

    /* ---------- Tarjeta 4: de la canónica a la general ---------- */
    const c4=el('div',{class:'card'});
    c4.append(el('h3',{},'De la ecuación canónica a la general'));
    c4.append(el('p',{},'Al desarrollar el cuadrado de binomio en la ecuación canónica y agrupar todo de un lado, queda la ',el('b',{},'ecuación general'),' de la parábola: un polinomio de segundo grado en el que aparece ',el('b',{},'una sola'),' variable al cuadrado, nunca las dos —eso es justamente lo que la distingue de la circunferencia y la elipse.'));

    const cajaP4=el('div',{class:'plot'}); c4.append(cajaP4);
    const P4=Plano(cajaP4,{xMin:-2,xMax:6,yMin:-4,yMax:3,alto:340,iso:true});
    P4.dibujar(P=>{
      P.ejes();
      parabolaV(P,2,-1,1.5,{color:'--s1',grosor:2.4});
      directrizV(P,-1,1.5,{color:'--s6',grosor:1.8,guiones:true});
      P.punto(2,0.5,{color:'--s2',r:5});
      P.texto(2,0.5,'foco',{color:'--s2',dx:8,dy:-8});
      P.punto(2,-1,{color:'--s7',r:4});
      P.texto(2,-1,'V(2, −1)',{color:'--s7',dx:-40,dy:16});
    });

    c4.append(el('p',{class:'note'},'Vértice $(2,-1)$, eje vertical, $p=1{,}5$: la canónica $(x-2)^2=6(y+1)$ se desarrolla y se agrupa así.'));
    c4.append(el('div',{class:'formula',html:'$$(x-2)^2=6(y+1) \\ \\ \\Longrightarrow\\ \\ x^2-4x+4=6y+6 \\ \\ \\Longrightarrow\\ \\ x^2-4x-6y-2=0$$'}));
    c4.append(el('p',{class:'note'},'En general, para vértice $(h,k)$ y parámetro $p$, la forma general de eje vertical es $x^2+Dx+Ey+F=0$ con $D=-2h$, $E=-4p$ y $F=h^2+4pk$ —para el ejemplo de arriba, $D=-4$, $E=-6$, $F=-2$, tal como aparece en la ecuación. La de eje horizontal es la misma idea con $x$ e $y$ intercambiadas: $y^2+Dy+Ex+F=0$.'));
    sec.append(c4);

    /* ---------- Tarjeta 5: la propiedad de reflexión (animada) ---------- */
    const c5=el('div',{class:'card'});
    c5.append(el('h3',{},'Aplicaciones: la propiedad de reflexión'));
    c5.append(el('p',{},'Todo rayo paralelo al eje de la parábola se refleja en la curva de manera que pasa exactamente por el foco —y, en sentido contrario, todo rayo que sale del foco se refleja paralelo al eje. Esta propiedad es la que usan las antenas parabólicas y los faros reflectores: lo que sale del foco (o entra en paralelo) se concentra siempre en un mismo punto o en una misma dirección.'));

    const pC5=1.2;
    const cajaP5=el('div',{class:'plot'}); c5.append(cajaP5);
    const P5=Plano(cajaP5,{xMin:-3.2,xMax:3.2,yMin:-0.6,yMax:3.6,alto:360,iso:true});
    const leerC5=lectura(c5);
    P5.animar((P,t)=>{
      const u=(t/7)%1, tri=1-Math.abs(1-2*u);
      const x0=-2.7+5.4*tri;
      const y0=x0*x0/(4*pC5);
      const m=x0/(2*pC5);            /* pendiente de la tangente en (x0,y0) */
      let nx=-m, ny=1; const nl=Math.hypot(nx,ny); nx/=nl; ny/=nl;
      let fx=0-x0, fy=pC5-y0; const fl=Math.hypot(fx,fy); fx/=fl; fy/=fl;
      const dotIn=Math.min(1,Math.max(-1,ny));  /* (-D)·N con D=(0,-1): -D=(0,1) */
      const angIn=Math.acos(dotIn)*180/Math.PI;
      const dotOut=Math.min(1,Math.max(-1,fx*nx+fy*ny));
      const angOut=Math.acos(dotOut)*180/Math.PI;
      const w=P.ventana();
      P.ejes();
      parabolaV(P,0,0,pC5,{color:'--s1',grosor:2.4});
      P.punto(0,pC5,{color:'--s2',r:5});
      P.texto(0,pC5,'foco',{color:'--s2',dx:8,dy:-8});
      P.parametrica(s=>[x0,w.yMax-(w.yMax-y0)*s],0,1,{color:'--s6',grosor:2});
      P.parametrica(s=>[x0+(0-x0)*s,y0+(pC5-y0)*s],0,1,{color:'--s2',grosor:2});
      P.punto(x0,y0,{color:'--s8',r:5});
      leerC5.set([
        ['x',x0.toFixed(2)],
        ['ángulo de entrada',angIn.toFixed(1)+'°'],
        ['ángulo de salida',angOut.toFixed(1)+'°']
      ]);
    },{duracion:7});

    leyenda(c5,[['--s6','rayo entrante (paralelo al eje)'],['--s2','foco y rayo reflejado'],['--s8','punto de incidencia']]);

    c5.append(el('p',{class:'note'},'Los dos ángulos de la lectura —el que forma el rayo entrante con la curva y el que forma el rayo reflejado— coinciden siempre: es la ley de reflexión aplicada en cada punto de la parábola, y por eso todos los rayos paralelos terminan juntándose en el foco, sin importar en qué punto de la curva entren.'));
    c5.append(el('div',{class:'formula',html:'$$\\theta_{\\text{entrada}}=\\theta_{\\text{salida}} \\qquad \\text{(ángulos medidos contra la normal a la curva)}$$'}));
    sec.append(c5);
  }
});
