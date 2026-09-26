/* La elipse: definición focal, ecuación canónica y general, elementos,
   excentricidad, posición relativa con una recta y la propiedad de
   reflexión foco-foco. Las cuentas de las tarjetas están verificadas
   aparte con Node antes de publicarse. */
registerModule({
  id:'elipse',
  title:'La elipse',
  unidad:'II',
  lead:'Los puntos cuya suma de distancias a dos focos se mantiene constante.',
  build(sec){

    function leyenda(mount,items){
      const L=el('div',{class:'legend'});
      items.forEach(([col,txt])=>L.append(el('span',{},
        el('i',{class:'sw',style:'background:var('+col+')'}),txt)));
      mount.append(L);
    }
    function fmtPt(pt){ return pt?('('+pt[0].toFixed(2)+', '+pt[1].toFixed(2)+')'):'—'; }
    /* término con signo para armar una ecuación general dinámica: omite el
       término si el coeficiente es 0, y omite el "1" cuando acompaña a una
       variable ("+ x", no "+ 1x"), pero no en el término constante. */
    function signTerm(coef,sym){
      if(coef===0)return '';
      const s=coef<0?' - ':' + ';
      const m=Math.abs(coef);
      return s+((sym&&m===1)?'':m)+sym;
    }

    /* ---------- Tarjeta 1: la elipse como lugar geométrico (animada) ---------- */
    const c1=el('div',{class:'card'});
    c1.append(el('h3',{},'La elipse como lugar geométrico'));
    c1.append(el('p',{},'Una elipse es el conjunto de los puntos del plano cuya suma de distancias a dos puntos fijos —los ',el('b',{},'focos'),'— se mantiene constante. Es el método del jardinero: un hilo de largo fijo, atado a dos estacas clavadas en el suelo, traza la curva al mantenerse siempre tenso mientras se lo hace girar.'));

    const F1=[-4,0], F2=[4,0], aC1=5, bC1=3;   /* a=5, b=3, c=4 */
    const cajaC1=el('div',{class:'plot'}); c1.append(cajaC1);
    const P1=Plano(cajaC1,{xMin:-7.5,xMax:7.5,yMin:-4.6,yMax:4.6,alto:340,iso:true});
    const leerC1=lectura(c1);
    P1.animar((P,t)=>{
      const th=t*Math.PI/4;   /* una vuelta completa cada 8 s */
      const Px=aC1*Math.cos(th), Py=bC1*Math.sin(th);
      P.ejes();
      P.parametrica(a=>[aC1*Math.cos(a),bC1*Math.sin(a)],0,2*Math.PI,{color:'--s7',grosor:2.2});
      P.parametrica(s=>[F1[0]+(Px-F1[0])*s,F1[1]+(Py-F1[1])*s],0,1,{color:'--s1',grosor:2.4});
      P.parametrica(s=>[F2[0]+(Px-F2[0])*s,F2[1]+(Py-F2[1])*s],0,1,{color:'--s2',grosor:2.4});
      P.punto(F1[0],F1[1],{color:'--s4',r:5}); P.texto(F1[0],F1[1],'F1',{color:'--s4',dx:-8,dy:18});
      P.punto(F2[0],F2[1],{color:'--s4',r:5}); P.texto(F2[0],F2[1],'F2',{color:'--s4',dx:2,dy:18});
      P.punto(Px,Py,{color:'--s8',r:5});
      const d1=Math.hypot(Px-F1[0],Py-F1[1]), d2=Math.hypot(Px-F2[0],Py-F2[1]);
      leerC1.set([
        ['d(P, F1)', d1.toFixed(2)],
        ['d(P, F2)', d2.toFixed(2)],
        ['suma', (d1+d2).toFixed(2)]
      ]);
    },{duracion:8});

    leyenda(c1,[['--s7','la elipse'],['--s4','focos F1, F2'],['--s1','d(P, F1)'],['--s2','d(P, F2)'],['--s8','P, el punto que traza la curva']]);

    c1.append(el('p',{class:'note'},'El contador de arriba lo confirma en cada instante: aunque $d(P,F_1)$ y $d(P,F_2)$ cambian por separado a medida que $P$ recorre la curva, su suma no se mueve.'));
    c1.append(el('div',{class:'formula',html:'$$d(P,F_1)+d(P,F_2)=2a$$'}));
    c1.append(el('p',{class:'note'},'La constante es $2a$: el doble del semieje mayor, la distancia del centro a cualquiera de los dos vértices sobre el eje que contiene a los focos. En este ejemplo $a=5$, así que la suma se mantiene en $10$.'));
    sec.append(c1);

    /* ---------- Tarjeta 2: ecuación canónica con centro en el origen ---------- */
    const c2=el('div',{class:'card'});
    c2.append(el('h3',{},'Ecuación canónica con centro en el origen'));
    c2.append(el('p',{},'Si el centro de la elipse está en el origen y sus ejes coinciden con los ejes cartesianos, la ecuación queda en su forma más simple. Por convención, $a$ es siempre el semieje ',el('b',{},'mayor'),' y $b$ el menor, así que $a\\ge b$; lo que cambia según la orientación es bajo qué variable queda $a^2$.'));

    let aC2=5, bC2=3, orC2='h';
    const cajaC2=el('div',{class:'plot'}); c2.append(cajaC2);
    const P2=Plano(cajaC2,{xMin:-6,xMax:6,yMin:-6,yMax:6,alto:340,iso:true});
    P2.dibujar(P=>{
      const sx=orC2==='h'?aC2:bC2, sy=orC2==='h'?bC2:aC2;
      const colX=orC2==='h'?'--s1':'--s2', colY=orC2==='h'?'--s2':'--s1';
      P.ejes();
      P.parametrica(t=>[sx*Math.cos(t),sy*Math.sin(t)],0,2*Math.PI,{color:'--s7',grosor:2.2});
      P.parametrica(s=>[sx*s,0],0,1,{color:colX,grosor:3});
      P.parametrica(s=>[0,sy*s],0,1,{color:colY,grosor:3});
      P.texto(sx/2,0,orC2==='h'?'a':'b',{color:colX,dy:16});
      P.texto(0,sy/2,orC2==='h'?'b':'a',{color:colY,dx:9});
    });
    const leerC2=lectura(c2);
    const formulaC2=el('div',{class:'formula'});
    function actualizarC2(){
      P2.redibujar();
      const A2=(aC2*aC2).toFixed(2).replace(/\.?0+$/,'').replace('.','{,}');
      const B2=(bC2*bC2).toFixed(2).replace(/\.?0+$/,'').replace('.','{,}');
      formulaC2.innerHTML=orC2==='h'
        ?'$$\\dfrac{x^2}{'+A2+'}+\\dfrac{y^2}{'+B2+'}=1$$'
        :'$$\\dfrac{x^2}{'+B2+'}+\\dfrac{y^2}{'+A2+'}=1$$';
      renderMath(formulaC2);
      leerC2.set([['a',aC2.toFixed(1)],['b',bC2.toFixed(1)],['eje mayor',orC2==='h'?'horizontal':'vertical']]);
    }
    btnGroup(c2,[{label:'Eje mayor horizontal',value:'h'},{label:'Eje mayor vertical',value:'v'}],
      v=>{ orC2=v; actualizarC2(); });
    controlValor(c2,{label:'a',min:3,max:5,paso:0.1,valor:aC2,unidad:'',onChange:v=>{aC2=v;actualizarC2();}});
    controlValor(c2,{label:'b',min:1,max:3,paso:0.1,valor:bC2,unidad:'',onChange:v=>{bC2=v;actualizarC2();}});
    leyenda(c2,[['--s7','la elipse'],['--s1','a, semieje mayor'],['--s2','b, semieje menor']]);
    actualizarC2();

    c2.append(el('p',{class:'note'},'El eje mayor es el del denominador más grande. Con $a=b$ los dos semiejes son iguales y la curva es una circunferencia de radio $a$.'));
    c2.append(el('div',{class:'formula',html:'$$\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}=1\\ \\ \\text{(eje mayor horizontal)}\\qquad\\dfrac{x^2}{b^2}+\\dfrac{y^2}{a^2}=1\\ \\ \\text{(eje mayor vertical)}$$'}));
    c2.append(el('p',{class:'note'},'Con los valores del dibujo:'));
    c2.append(formulaC2);
    sec.append(c2);

    /* ---------- Tarjeta 3: el centro (h,k) y la ecuación general ---------- */
    const c3=el('div',{class:'card'});
    c3.append(el('h3',{},'El centro (h, k) y la ecuación general'));
    c3.append(el('p',{},'Trasladar el centro a un punto $(h,k)$ cualquiera no cambia ni la forma ni el tamaño de la elipse: solo la corre. Alcanza con reemplazar $x$ por $x-h$ e $y$ por $y-k$ en la ecuación canónica. De acá en adelante se trabaja con el caso de eje mayor horizontal, $a=5$ y $b=3$ —el mismo de la tarjeta anterior con $a\\gt b$.'));

    let hC3=2, kC3=-1; const aC3=5, bC3=3;
    const cajaC3=el('div',{class:'plot'}); c3.append(cajaC3);
    const P3=Plano(cajaC3,{xMin:-10,xMax:10,yMin:-7,yMax:7,alto:360,iso:true});
    P3.dibujar(P=>{
      P.ejes();
      P.punto(0,0,{color:'--muted',r:3});
      P.parametrica(a=>[aC3*Math.cos(a),bC3*Math.sin(a)],0,2*Math.PI,{color:'--grid',grosor:1.6,guiones:true});
      P.parametrica(a=>[hC3+aC3*Math.cos(a),kC3+bC3*Math.sin(a)],0,2*Math.PI,{color:'--s7',grosor:2.4});
      P.parametrica(s=>[hC3*s,kC3*s],0,1,{color:'--muted',grosor:1.4,guiones:true});
      P.punto(hC3,kC3,{color:'--s4',r:4}); P.texto(hC3,kC3,'(h, k)',{color:'--s4',dx:8,dy:-8});
    });
    const leerC3=lectura(c3);
    const ecC3=el('div',{class:'formula'});
    function actualizarC3(){
      P3.redibujar();
      const A=bC3*bC3, C=aC3*aC3, D=-2*bC3*bC3*hC3, E=-2*aC3*aC3*kC3, F=bC3*bC3*hC3*hC3+aC3*aC3*kC3*kC3-aC3*aC3*bC3*bC3;
      ecC3.innerHTML='$$'+A+'x^2 + '+C+'y^2'+signTerm(D,'x')+signTerm(E,'y')+signTerm(F,'')+' = 0$$';
      renderMath(ecC3);
      leerC3.set([['h',hC3.toFixed(0)],['k',kC3.toFixed(0)],['centro','('+hC3.toFixed(0)+', '+kC3.toFixed(0)+')']]);
    }
    controlValor(c3,{label:'h',min:-4,max:4,paso:1,valor:hC3,unidad:'',onChange:v=>{hC3=v;actualizarC3();}});
    controlValor(c3,{label:'k',min:-3,max:3,paso:1,valor:kC3,unidad:'',onChange:v=>{kC3=v;actualizarC3();}});
    leyenda(c3,[['--grid','elipse con centro en el origen'],['--s7','la misma elipse trasladada'],['--s4','el nuevo centro (h, k)']]);
    actualizarC3();

    c3.append(el('div',{class:'formula',html:'$$\\dfrac{(x-h)^2}{a^2}+\\dfrac{(y-k)^2}{b^2}=1$$'}));
    c3.append(ecC3);
    c3.append(el('p',{class:'note'},'Al desarrollar los cuadrados y agrupar términos se llega a la ecuación general $Ax^2+Cy^2+Dx+Ey+F=0$, con $A$ y $C$ del mismo signo y distintos entre sí —si fueran iguales, sería una circunferencia—. Es la misma elipse, escrita sin fracciones ni paréntesis.'));
    sec.append(c3);

    /* ---------- Tarjeta 4: elementos de la elipse ---------- */
    const c4=el('div',{class:'card'});
    c4.append(el('h3',{},'Elementos: centro, focos, vértices y lado recto'));
    c4.append(el('p',{},'Sobre una elipse de eje mayor horizontal con semiejes $a=5$ y $b=3$, centrada en el origen, cada elemento tiene un lugar preciso.'));

    const cajaC4=el('div',{class:'plot'}); c4.append(cajaC4);
    const P4=Plano(cajaC4,{xMin:-7,xMax:7,yMin:-4.5,yMax:4.5,alto:340,iso:true});
    const aC4=5, bC4=3, cC4=Math.sqrt(aC4*aC4-bC4*bC4);   /* c=4 */
    P4.dibujar(P=>{
      const lr=bC4*bC4/aC4;   /* semi-lado recto = 1,8 */
      P.ejes();
      P.parametrica(s=>[-aC4+2*aC4*s,0],0,1,{color:'--s1',grosor:1.6,guiones:true});
      P.parametrica(s=>[0,-bC4+2*bC4*s],0,1,{color:'--s2',grosor:1.6,guiones:true});
      P.parametrica(a=>[aC4*Math.cos(a),bC4*Math.sin(a)],0,2*Math.PI,{color:'--s7',grosor:2.2});
      P.parametrica(s=>[cC4,-lr+2*lr*s],0,1,{color:'--s6',grosor:3});
      P.punto(0,0,{color:'--muted',r:4}); P.texto(0,0,'centro',{color:'--muted',dx:6,dy:16});
      P.punto(-cC4,0,{color:'--s4',r:5}); P.texto(-cC4,0,'F1',{color:'--s4',dx:-8,dy:18});
      P.punto(cC4,0,{color:'--s4',r:5}); P.texto(cC4,0,'F2',{color:'--s4',dx:2,dy:18});
      P.punto(-aC4,0,{color:'--s1',r:5}); P.texto(-aC4,0,'V1',{color:'--s1',dx:-18,dy:-10});
      P.punto(aC4,0,{color:'--s1',r:5}); P.texto(aC4,0,'V2',{color:'--s1',dx:6,dy:-10});
      P.punto(0,-bC4,{color:'--s2',r:5}); P.texto(0,-bC4,'B1',{color:'--s2',dx:8,dy:16});
      P.punto(0,bC4,{color:'--s2',r:5}); P.texto(0,bC4,'B2',{color:'--s2',dx:8,dy:-8});
      P.texto(cC4,lr,'lado recto',{color:'--s6',dx:8,dy:-4});
    });
    leyenda(c4,[['--s7','la elipse'],['--s4','focos F1, F2'],['--s1','vértices principales V1, V2 y eje mayor'],['--s2','vértices secundarios B1, B2 y eje menor'],['--s6','lado recto, por F2']]);

    c4.append(el('p',{class:'note'},'Los vértices principales están sobre el eje mayor, a distancia $a$ del centro; los secundarios están sobre el eje menor, a distancia $b$. Los focos quedan siempre ',el('b',{},'dentro'),' de la elipse, sobre el eje mayor, a distancia $c$ del centro.'));
    c4.append(el('div',{class:'formula',html:'$$c^2=a^2-b^2 \\qquad L=\\dfrac{2b^2}{a}$$'}));
    c4.append(el('p',{class:'note'},'Con $a=5$ y $b=3$: $c=\\sqrt{25-9}=4$, y el lado recto mide $L=2(9)/5=3{,}6$ — el segmento naranjo del dibujo, perpendicular al eje mayor y que pasa por un foco.'));
    sec.append(c4);

    /* ---------- Tarjeta 5: excentricidad ---------- */
    const c5=el('div',{class:'card'});
    c5.append(el('h3',{},'Excentricidad: qué tan achatada es la elipse'));
    c5.append(el('p',{},'La excentricidad mide qué tan lejos están los focos del centro, en proporción al semieje mayor. Con $a$ fijo, mover $e$ cambia $b$ y $c$, y con ellos la forma completa de la curva.'));

    let eC5=0.6; const aC5=4;
    const cajaC5=el('div',{class:'plot'}); c5.append(cajaC5);
    const P5=Plano(cajaC5,{xMin:-5.5,xMax:5.5,yMin:-5.5,yMax:5.5,alto:340,iso:true});
    P5.dibujar(P=>{
      const bC5=aC5*Math.sqrt(1-eC5*eC5), cC5=eC5*aC5;
      P.ejes();
      P.parametrica(a=>[aC5*Math.cos(a),bC5*Math.sin(a)],0,2*Math.PI,{color:'--s7',grosor:2.4});
      if(cC5>0.05){
        P.punto(-cC5,0,{color:'--s4',r:5});
        P.punto(cC5,0,{color:'--s4',r:5});
      }
    });
    const leerC5=lectura(c5);
    function actualizarC5(){
      P5.redibujar();
      const bC5=aC5*Math.sqrt(1-eC5*eC5), cC5=eC5*aC5;
      leerC5.set([['e',eC5.toFixed(2)],['a',aC5.toFixed(1)],['b',bC5.toFixed(2)],['c',cC5.toFixed(2)]]);
    }
    controlValor(c5,{label:'e',min:0,max:0.95,paso:0.01,valor:eC5,unidad:'',onChange:v=>{eC5=v;actualizarC5();}});
    leyenda(c5,[['--s7','la elipse'],['--s4','focos']]);
    actualizarC5();

    c5.append(el('p',{class:'note'},'En $e=0$ los dos focos coinciden en el centro y la curva es una circunferencia. A medida que $e$ crece hacia $1$, los focos se separan, la elipse se acerca cada vez más al segmento del eje mayor y se aplana; en $e=1$ dejaría de ser una elipse.'));
    c5.append(el('div',{class:'formula',html:'$$e=\\dfrac{c}{a}, \\qquad 0\\le e\\lt 1$$'}));
    sec.append(c5);

    /* ---------- Tarjeta 6: posición relativa entre una elipse y una recta ---------- */
    const c6=el('div',{class:'card'});
    c6.append(el('h3',{},'Posición relativa entre una elipse y una recta'));
    c6.append(el('p',{},'Igual que con una circunferencia, una recta y una elipse pueden no tocarse, tocarse en un solo punto o cruzarse en dos. Al sustituir la recta en la ecuación de la elipse queda una ecuación de segundo grado en una sola variable, y el signo de su discriminante decide cuál de las tres situaciones es.'));

    const aC6=5, bC6=3;
    /* La recta se describe por su dirección φ (ángulo de su vector director
       con el eje x) y por d, la distancia con signo del centro a la recta.
       A diferencia de (m,n), este par sí cubre la recta vertical sin caso
       aparte: en φ=90° el director es (0,1) y la recta queda vertical.
       Sustituyendo (x,y)=(d·senφ+t·cosφ, −d·cosφ+t·senφ) en x²/a²+y²/b²=1
       queda At²+Bt+C=0 con las A,B,C de abajo (verificado aparte con Node,
       incluyendo φ=90° exacto y ángulos arbitrariamente cercanos). */
    let phiC6=60, dC6=2;

    function interseccionesC6(phiDeg,d){
      const phi=phiDeg*Math.PI/180, si=Math.sin(phi), co=Math.cos(phi);
      const Qx=d*si, Qy=-d*co;
      const A=co*co/(aC6*aC6)+si*si/(bC6*bC6);
      const B=2*(Qx*co/(aC6*aC6)+Qy*si/(bC6*bC6));
      const C=(Qx*Qx)/(aC6*aC6)+(Qy*Qy)/(bC6*bC6)-1;
      const disc=B*B-4*A*C;
      const EPS=0.01;   /* afinado con Node: alcanza para que TODO φ entero
                            tenga, dentro de la grilla de 0,1 del deslizador
                            d, un valor que caiga en la franja "tangente" */
      const punto=t=>[Qx+t*co,Qy+t*si];
      if(disc<-EPS)return {tipo:'exterior',pts:[]};
      if(Math.abs(disc)<EPS){ const t=-B/(2*A); return {tipo:'tangente',pts:[punto(t)]}; }
      const s=Math.sqrt(disc);
      return {tipo:'secante',pts:[punto((-B+s)/(2*A)),punto((-B-s)/(2*A))]};
    }

    const cajaC6=el('div',{class:'plot'}); c6.append(cajaC6);
    const P6=Plano(cajaC6,{xMin:-8,xMax:8,yMin:-7,yMax:7,alto:360,iso:true});
    P6.dibujar(P=>{
      const phi=phiC6*Math.PI/180, si=Math.sin(phi), co=Math.cos(phi);
      const Qx=dC6*si, Qy=-dC6*co, L=14;
      P.ejes();
      P.parametrica(a=>[aC6*Math.cos(a),bC6*Math.sin(a)],0,2*Math.PI,{color:'--s7',grosor:2.2});
      P.parametrica(s=>[Qx+(s*2-1)*L*co,Qy+(s*2-1)*L*si],0,1,{color:'--s6',grosor:2.4});
      interseccionesC6(phiC6,dC6).pts.forEach(([x,y])=>P.punto(x,y,{color:'--s8',r:6}));
    });

    controlValor(c6,{label:'φ',min:0,max:180,paso:1,valor:phiC6,unidad:'°',
      onChange:v=>{ phiC6=v; actualizarC6(); }});
    controlValor(c6,{label:'d',min:-7,max:7,paso:0.1,valor:dC6,unidad:'',
      onChange:v=>{ dC6=v; actualizarC6(); }});

    leyenda(c6,[['--s7','la elipse'],['--s6','la recta'],['--s8','puntos de corte']]);
    const leerC6=lectura(c6);
    const mensajeC6=textoVivo(c6);
    mensajeC6.calibrar([
      'Con φ = 180° y d = −7,00: la recta <b>no toca</b> la elipse (exterior).',
      'Con φ = 180° y d = −7,00: la recta <b>toca</b> la elipse en un solo punto (tangente).',
      'Con φ = 180° y d = −7,00: la recta <b>corta</b> la elipse en dos puntos (secante).'
    ]);
    function actualizarC6(){
      P6.redibujar();
      const res=interseccionesC6(phiC6,dC6);
      const base='Con φ = '+phiC6+'° y d = '+dC6.toFixed(2).replace('.',',')+': la recta ';
      let desc;
      if(res.tipo==='secante') desc=base+'<b>corta</b> la elipse en dos puntos (secante).';
      else if(res.tipo==='tangente') desc=base+'<b>toca</b> la elipse en un solo punto (tangente).';
      else desc=base+'<b>no toca</b> la elipse (exterior).';
      mensajeC6.set(desc);
      leerC6.set([
        ['φ', phiC6+'°'],
        ['d', dC6.toFixed(2)],
        ['clasificación', res.tipo],
        ['P1', fmtPt(res.pts[0])],
        ['P2', fmtPt(res.pts[1])]
      ]);
    }
    actualizarC6();

    c6.append(el('p',{class:'note'},'Para la elipse $\\dfrac{x^2}{a^2}+\\dfrac{y^2}{b^2}=1$ y la recta $y=mx+n$, sustituir $y$ da una cuadrática en $x$ cuyo discriminante se simplifica a un solo factor con signo:'));
    c6.append(el('div',{class:'formula',html:'$$(b^2+a^2m^2)\\,x^2+2a^2mn\\,x+a^2(n^2-b^2)=0 \\qquad \\Delta=4a^2b^2\\,(a^2m^2+b^2-n^2)$$'}));
    c6.append(el('p',{class:'note'},'Si $n^2\\lt a^2m^2+b^2$ la recta es secante, si $n^2=a^2m^2+b^2$ es tangente y si $n^2\\gt a^2m^2+b^2$ es exterior. La recta vertical $x=p$ no tiene pendiente y va aparte: es secante si $|p|\\lt a$, tangente si $|p|=a$ y exterior si $|p|\\gt a$. Con el centro en $(h,k)$ vale lo mismo trasladando antes la recta al origen.'));
    c6.append(el('p',{class:'note'},'Por ejemplo, con $a=5$ y $b=3$, la recta $y=0{,}5x+n$ es tangente cuando $n^2=0{,}25(25)+9=15{,}25$, es decir $n=\\pm\\sqrt{15{,}25}\\approx\\pm3{,}91$. El deslizador de arriba explora lo mismo con $\\varphi$ y $d$ en vez de $m$ y $n$, porque ese segundo par sí describe la recta vertical sin necesitar un caso aparte.'));
    sec.append(c6);

    /* ---------- Tarjeta 7: la propiedad de reflexión foco-foco (animada) ---------- */
    const c7=el('div',{class:'card'});
    c7.append(el('h3',{},'Aplicación: la propiedad de reflexión foco-foco'));
    c7.append(el('p',{},'La tangente a la elipse en cualquier punto forma el mismo ángulo con los dos segmentos que van a los focos. Por eso un rayo —de luz o de sonido— que sale de un foco y rebota en la curva llega siempre, sin excepción, al otro foco.'));

    const aC7=5, bC7=3, cC7=4;
    const F1C7=[-cC7,0], F2C7=[cC7,0];
    const cajaC7=el('div',{class:'plot'}); c7.append(cajaC7);
    const P7=Plano(cajaC7,{xMin:-7.5,xMax:7.5,yMin:-4.6,yMax:4.6,alto:340,iso:true});
    const leerC7=lectura(c7);
    P7.animar((P,t)=>{
      const th=t*Math.PI/4;
      const x0=aC7*Math.cos(th), y0=bC7*Math.sin(th);
      /* dirección tangente a la elipse en (x0,y0): (a²y0, −b²x0), verificada aparte */
      let Tx=aC7*aC7*y0, Ty=-bC7*bC7*x0;
      const Tl=Math.hypot(Tx,Ty)||1; Tx/=Tl; Ty/=Tl;
      P.ejes();
      P.parametrica(a=>[aC7*Math.cos(a),bC7*Math.sin(a)],0,2*Math.PI,{color:'--s7',grosor:2.2});
      P.parametrica(s=>[x0+Tx*(s*2-1)*2.6,y0+Ty*(s*2-1)*2.6],0,1,{color:'--s6',grosor:2,guiones:true});
      P.parametrica(s=>[F1C7[0]+(x0-F1C7[0])*s,F1C7[1]+(y0-F1C7[1])*s],0,1,{color:'--s1',grosor:2.2});
      P.parametrica(s=>[F2C7[0]+(x0-F2C7[0])*s,F2C7[1]+(y0-F2C7[1])*s],0,1,{color:'--s2',grosor:2.2});
      P.punto(F1C7[0],F1C7[1],{color:'--s4',r:5}); P.texto(F1C7[0],F1C7[1],'F1',{color:'--s4',dx:-8,dy:18});
      P.punto(F2C7[0],F2C7[1],{color:'--s4',r:5}); P.texto(F2C7[0],F2C7[1],'F2',{color:'--s4',dx:2,dy:18});
      P.punto(x0,y0,{color:'--s8',r:5});
      const v1=[F1C7[0]-x0,F1C7[1]-y0], v2=[F2C7[0]-x0,F2C7[1]-y0];
      const m1=Math.hypot(v1[0],v1[1])||1, m2=Math.hypot(v2[0],v2[1])||1;
      const cosA1=Math.min(1,Math.abs(v1[0]*Tx+v1[1]*Ty)/m1);
      const cosA2=Math.min(1,Math.abs(v2[0]*Tx+v2[1]*Ty)/m2);
      const ang1=Math.acos(cosA1)*180/Math.PI, ang2=Math.acos(cosA2)*180/Math.PI;
      leerC7.set([
        ['ángulo con F1', ang1.toFixed(1)+'°'],
        ['ángulo con F2', ang2.toFixed(1)+'°']
      ]);
    },{duracion:8});

    leyenda(c7,[['--s7','la elipse'],['--s4','focos'],['--s1','segmento a F1'],['--s2','segmento a F2'],['--s6','la tangente en P'],['--s8','P']]);

    c7.append(el('p',{class:'note'},'Los dos ángulos del contador —el que forma la tangente con el segmento a $F_1$ y el que forma con el segmento a $F_2$— coinciden en todo momento, sin importar dónde esté $P$: esa igualdad es la propiedad de reflexión.'));
    c7.append(el('div',{class:'formula',html:'$$\\theta_{F_1}=\\theta_{F_2} \\qquad \\text{(ángulos medidos contra la tangente en }P\\text{)}$$'}));
    c7.append(el('p',{class:'note'},'Se aplica, por ejemplo, en salas con techo elíptico: un sonido emitido en un foco se escucha nítido en el otro, porque cada rayo de sonido que sale de él rebota en el techo y converge exactamente en el segundo foco.'));
    sec.append(c7);
  }
});
