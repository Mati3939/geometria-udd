/* La circunferencia: lugar geométrico, ecuación canónica y general, centro y
   radio por completación de cuadrados, y posición relativa con una recta.
   Las cuentas de las tarjetas están verificadas aparte con Node antes de
   publicarse. */
registerModule({
  id:'circunferencia',
  title:'La circunferencia',
  unidad:'II',
  lead:'La primera de las cónicas: el lugar de los puntos que están a la misma distancia de un centro.',
  build(sec){

    function leyenda(mount,items){
      const L=el('div',{class:'legend'});
      items.forEach(([col,txt])=>L.append(el('span',{},
        el('i',{class:'sw',style:'background:var('+col+')'}),txt)));
      mount.append(L);
    }

    /* ---------- Tarjeta 1: la circunferencia como lugar geométrico (animada) ---------- */
    const c1=el('div',{class:'card'});
    c1.append(el('h3',{},'La circunferencia como lugar geométrico'));
    c1.append(el('p',{},'Una circunferencia es el conjunto de puntos del plano que están a una misma distancia $r$ —el ',el('b',{},'radio'),'— de un punto fijo $C(h,k)$ —el ',el('b',{},'centro'),'—. Esa distancia constante es la única condición: no importa hacia qué lado se mida.'));

    const hC1=2, kC1=1, rC1=3;
    const cajaP1=el('div',{class:'plot'}); c1.append(cajaP1);
    const P1=Plano(cajaP1,{xMin:-2,xMax:6,yMin:-3,yMax:5,alto:340,iso:true});
    const leerC1=lectura(c1);
    P1.animar((P,t)=>{
      const a=t*(2*Math.PI/6);
      const px=hC1+rC1*Math.cos(a), py=kC1+rC1*Math.sin(a);
      P.ejes();
      P.parametrica(ang=>[hC1+rC1*Math.cos(ang),kC1+rC1*Math.sin(ang)],0,2*Math.PI,{color:'--s1',grosor:2.4});
      P.parametrica(s=>[hC1+(px-hC1)*s,kC1+(py-kC1)*s],0,1,{color:'--s4',grosor:2.6});
      P.punto(hC1,kC1,{color:'--s2',r:4});
      P.punto(px,py,{color:'--s7',r:5});
      P.texto(hC1,kC1,'C',{color:'--s2',dx:-16,dy:14});
      P.texto(hC1+(px-hC1)*0.5,kC1+(py-kC1)*0.5,'r',{color:'--s4',dx:8,dy:-6});
      const dist=Math.hypot(px-hC1,py-kC1);
      leerC1.set([
        ['C', '('+hC1+', '+kC1+')'],
        ['P', '('+px.toFixed(2)+', '+py.toFixed(2)+')'],
        ['dist(P, C)', dist.toFixed(2)],
        ['r', rC1.toFixed(2)]
      ]);
    },{duracion:6});

    leyenda(c1,[['--s2','centro C'],['--s4','radio r'],['--s7','punto P que recorre la circunferencia'],['--s1','la circunferencia']]);

    c1.append(el('p',{class:'note'},'Aunque $P$ recorre toda la vuelta, la distancia de la tabla no cambia: es exactamente $r$ en cada instante. El punto también se puede escribir en función del ángulo $t$ que se ve arriba: $(x,y)=(h+r\\cos t,\\ k+r\\operatorname{sen} t)$.'));
    c1.append(el('p',{},'Escribir esa condición con la fórmula de la distancia entre dos puntos, $(x,y)$ y $C(h,k)$, da la ecuación de la circunferencia.'));
    c1.append(el('div',{class:'formula',html:'$$\\sqrt{(x-h)^2+(y-k)^2}=r$$'}));
    c1.append(el('p',{class:'note'},'Elevando al cuadrado los dos lados —ninguno es negativo, así que no se agregan soluciones de más— se llega a la ',el('b',{},'ecuación canónica'),':'));
    c1.append(el('div',{class:'formula',html:'$$(x-h)^2+(y-k)^2=r^2$$'}));
    c1.append(el('p',{class:'note'},'Para el centro y el radio del dibujo, $C(2,1)$ y $r=3$, la ecuación canónica queda $(x-2)^2+(y-1)^2=9$.'));
    sec.append(c1);

    /* ---------- Tarjeta 2: de la canónica a la general ---------- */
    const c2=el('div',{class:'card'});
    c2.append(el('h3',{},'De la ecuación canónica a la general'));
    c2.append(el('p',{},'Al desarrollar los cuadrados de la ecuación canónica y agrupar los términos se llega a la ',el('b',{},'ecuación general'),' de la circunferencia: otra forma de escribir exactamente el mismo conjunto de puntos.'));
    c2.append(el('div',{class:'formula',html:'$$(x-h)^2+(y-k)^2=r^2 \\;\\Longrightarrow\\; x^2+y^2+Dx+Ey+F=0$$'}));
    c2.append(el('p',{class:'note'},'con $D=-2h$, $E=-2k$ y $F=h^2+k^2-r^2$: tres números que dependen del centro y del radio, no al revés.'));

    let rG2=3;
    const cajaP2=el('div',{class:'plot'}); c2.append(cajaP2);
    const P2=Plano(cajaP2,{xMin:-3,xMax:7,yMin:-4,yMax:6,alto:340,iso:true});
    function pintarC2(P){
      P.ejes();
      P.parametrica(a=>[2+rG2*Math.cos(a),1+rG2*Math.sin(a)],0,2*Math.PI,{color:'--s1',grosor:2.4});
      P.punto(2,1,{color:'--s2',r:4});
      P.texto(2,1,'C(2, 1)',{color:'--s2',dx:-14,dy:16});
    }
    P2.dibujar(pintarC2);
    const leerC2=lectura(c2);
    function actualizarC2(){
      P2.redibujar();
      const D=-4, E=-2, F=5-rG2*rG2;
      leerC2.set([
        ['r', rG2.toFixed(2)],
        ['D', D.toFixed(2)],
        ['E', E.toFixed(2)],
        ['F', F.toFixed(2)]
      ]);
    }
    controlValor(c2,{label:'r',min:0.5,max:4,paso:0.1,valor:rG2,unidad:'',
      onChange:v=>{ rG2=v; actualizarC2(); }});
    actualizarC2();

    c2.append(el('p',{class:'note'},'Al mover $r$ cambian el tamaño de la circunferencia y el valor de $F$, pero $D$ y $E$ no se mueven: son los que fijan el centro, y el centro no cambió.'));
    sec.append(c2);

    /* ---------- Tarjeta 3: de la general a centro y radio (deslizador con el caso r²≤0) ---------- */
    const c3=el('div',{class:'card'});
    c3.append(el('h3',{},'De la ecuación general a centro y radio'));
    c3.append(el('p',{},'El camino inverso —de la ecuación general a centro y radio— se hace completando el cuadrado en $x$ y en $y$ por separado: se suma y resta lo necesario para armar $(x+\\tfrac{D}{2})^2$ y $(y+\\tfrac{E}{2})^2$.'));
    c3.append(el('div',{class:'formula',html:'$$x^2+Dx+y^2+Ey+F=0 \\;\\Longrightarrow\\; \\left(x+\\frac{D}{2}\\right)^2+\\left(y+\\frac{E}{2}\\right)^2=\\left(\\frac{D}{2}\\right)^2+\\left(\\frac{E}{2}\\right)^2-F$$'}));
    c3.append(el('p',{},'Comparando con la ecuación canónica, el centro y el radio quedan determinados por $D$, $E$ y $F$:'));
    c3.append(el('div',{class:'formula',html:'$$h=-\\frac{D}{2}\\qquad k=-\\frac{E}{2}\\qquad r^2=\\left(\\frac{D}{2}\\right)^2+\\left(\\frac{E}{2}\\right)^2-F$$'}));
    c3.append(el('p',{class:'note'},'El lado derecho no siempre es positivo. Con $D=-4$ y $E=-2$ fijos —mismo centro $(2,1)$ de siempre— el siguiente control mueve solo $F$ y muestra las tres situaciones posibles para $r^2$.'));

    let FG3=1;
    const cajaP3=el('div',{class:'plot'}); c3.append(cajaP3);
    const P3=Plano(cajaP3,{xMin:-2,xMax:6,yMin:-3,yMax:5,alto:340,iso:true});
    function pintarC3(P){
      P.ejes();
      const r2=5-FG3;
      P.punto(2,1,{color:'--s2',r:4});
      P.texto(2,1,'C',{color:'--s2',dx:-16,dy:14});
      if(r2>1e-6){
        const r=Math.sqrt(r2);
        P.parametrica(a=>[2+r*Math.cos(a),1+r*Math.sin(a)],0,2*Math.PI,{color:'--s1',grosor:2.4});
      }
    }
    P3.dibujar(pintarC3);
    const leerC3=lectura(c3);
    let reglaC3=null;
    const DG3=-4, EG3=-2;
    function actualizarC3(){
      P3.redibujar();
      const r2=5-FG3;
      leerC3.set([
        ['D', DG3.toFixed(2)],
        ['E', EG3.toFixed(2)],
        ['F', FG3.toFixed(2)],
        ['centro', '(2, 1)'],
        ['r²', r2.toFixed(2)],
        ['r', r2>1e-6?Math.sqrt(r2).toFixed(2):'no existe']
      ]);
      if(r2>1e-6){
        reglaC3.set('Con $F='+FG3.toFixed(2)+'$ se obtiene $r^2='+r2.toFixed(2)+'\\gt0$: sí hay circunferencia real, de radio $r='+Math.sqrt(r2).toFixed(2)+'$.');
      } else if(Math.abs(r2)<1e-6){
        reglaC3.set('Con $F='+FG3.toFixed(2)+'$ se obtiene $r^2=0$: la ecuación ya no describe una circunferencia, sino un único punto, el centro $(2,1)$.');
      } else {
        reglaC3.set('Con $F='+FG3.toFixed(2)+'$ se obtiene $r^2='+r2.toFixed(2)+'\\lt0$: no existe ninguna circunferencia real que cumpla esa ecuación.');
      }
    }
    controlValor(c3,{label:'F',min:-4,max:9,paso:0.5,valor:FG3,unidad:'',
      onChange:v=>{ FG3=v; actualizarC3(); }});
    reglaC3=textoVivo(c3);
    /* los tres mensajes posibles, medidos una sola vez para que la tarjeta no
       cambie de alto al arrastrar F */
    reglaC3.calibrar([
      'Con $F=-4.00$ se obtiene $r^2=9.00\\gt0$: sí hay circunferencia real, de radio $r=3.00$.',
      'Con $F=5.00$ se obtiene $r^2=0.00$: la ecuación ya no describe una circunferencia, sino un único punto, el centro $(2,1)$.',
      'Con $F=9.00$ se obtiene $r^2=-4.00\\lt0$: no existe ninguna circunferencia real que cumpla esa ecuación.'
    ]);
    actualizarC3();

    c3.append(el('p',{class:'note'},'El punto donde $r^2$ cruza por cero —$F=5$ en este ejemplo— no es un caso raro que se pueda ignorar: antes de calcular un radio con una ecuación general conviene comprobar que $\\left(\\frac{D}{2}\\right)^2+\\left(\\frac{E}{2}\\right)^2-F$ efectivamente sea positivo.'));
    sec.append(c3);

    /* ---------- Tarjeta 4: posición relativa entre una recta y la circunferencia ---------- */
    const c4=el('div',{class:'card'});
    c4.append(el('h3',{},'Posición relativa entre una recta y la circunferencia'));
    c4.append(el('p',{},'Una recta y una circunferencia pueden no tocarse, tocarse en un solo punto o cruzarse en dos, según qué tan cerca pase la recta del centro. Comparar la distancia $d$ del centro a la recta con el radio $r$ dice cuál de las tres situaciones ocurre.'));

    let cG4=0;
    const rC4=2;
    function calcularC4(c){
      const d=Math.abs(c)/Math.sqrt(2);
      const A=2, B=2*c, Cc=c*c-4;
      const disc=B*B-4*A*Cc;
      const TOL=0.03;
      let estado, puntos=[];
      if(d<rC4-TOL) estado='secante';
      else if(d>rC4+TOL) estado='exterior';
      else estado='tangente';
      if(estado==='secante'){
        const raiz=Math.sqrt(Math.max(disc,0));
        const x1=(-B+raiz)/(2*A), x2=(-B-raiz)/(2*A);
        puntos=[[x1,x1+c],[x2,x2+c]];
      } else if(estado==='tangente'){
        const x1=-B/(2*A);
        puntos=[[x1,x1+c]];
      }
      return {d,disc,estado,puntos};
    }
    const cajaP4=el('div',{class:'plot'}); c4.append(cajaP4);
    const P4=Plano(cajaP4,{xMin:-5,xMax:5,yMin:-5,yMax:5,alto:360,iso:true});
    function pintarC4(P){
      const w=P.ventana();
      const {d,estado,puntos}=calcularC4(cG4);
      const foot=[-cG4/2,cG4/2];
      P.ejes();
      P.parametrica(a=>[rC4*Math.cos(a),rC4*Math.sin(a)],0,2*Math.PI,{color:'--s1',grosor:2.4});
      P.parametrica(s=>{const x=w.xMin+(w.xMax-w.xMin)*s; return [x,x+cG4];},0,1,{color:'--s6',grosor:2.4});
      if(d>0.08){
        P.parametrica(s=>[foot[0]*s,foot[1]*s],0,1,{color:'--s4',grosor:2.2,guiones:true});
        P.texto(foot[0]*0.5,foot[1]*0.5,'d',{color:'--s4',dx:8,dy:8});
      }
      P.punto(0,0,{color:'--muted',r:3});
      puntos.forEach(([x,y])=>P.punto(x,y,{color:'--s7',r:5}));
      if(estado==='tangente'&&puntos.length===1){
        P.texto(puntos[0][0],puntos[0][1],'tangencia',{color:'--s7',dx:8,dy:-8,tam:12});
      }
    }
    P4.dibujar(pintarC4);
    const leerC4=lectura(c4);
    let reglaC4=null;
    function actualizarC4(){
      P4.redibujar();
      const {d,disc,estado,puntos}=calcularC4(cG4);
      leerC4.set([
        ['c', cG4.toFixed(2)],
        ['d', d.toFixed(2)],
        ['r', rC4.toFixed(2)],
        ['Δ', disc.toFixed(2)],
        ['estado', estado],
        ['puntos', String(puntos.length)]
      ]);
      if(estado==='secante'){
        reglaC4.set('La recta pasa a distancia $d='+d.toFixed(2)+'$ del centro, menor que $r=2$: es <b>secante</b> y corta a la circunferencia en dos puntos.');
      } else if(estado==='tangente'){
        reglaC4.set('La recta pasa a distancia $d='+d.toFixed(2)+'$ del centro, igual a $r=2$: es <b>tangente</b> y toca a la circunferencia en un solo punto.');
      } else {
        reglaC4.set('La recta pasa a distancia $d='+d.toFixed(2)+'$ del centro, mayor que $r=2$: es <b>exterior</b> y no corta a la circunferencia.');
      }
    }
    controlValor(c4,{label:'c',min:-4.5,max:4.5,paso:0.05,valor:cG4,unidad:'',
      onChange:v=>{ cG4=v; actualizarC4(); }});
    reglaC4=textoVivo(c4);
    reglaC4.calibrar([
      'La recta pasa a distancia $d=3.18$ del centro, menor que $r=2$: es <b>secante</b> y corta a la circunferencia en dos puntos.',
      'La recta pasa a distancia $d=2.00$ del centro, igual a $r=2$: es <b>tangente</b> y toca a la circunferencia en un solo punto.',
      'La recta pasa a distancia $d=3.18$ del centro, mayor que $r=2$: es <b>exterior</b> y no corta a la circunferencia.'
    ]);
    actualizarC4();

    leyenda(c4,[['--s1','circunferencia x²+y²=4'],['--s6','recta y = x + c'],['--s4','distancia d'],['--s7','puntos de corte']]);

    c4.append(el('p',{},'La recta del dibujo es $y=x+c$ y la circunferencia es $x^2+y^2=4$ (centro en el origen, $r=2$); mover $c$ desplaza la recta en paralelo, alejándola o acercándola al centro.'));
    c4.append(el('div',{class:'formula',html:'$$d\\lt r \\Leftrightarrow \\text{secante} \\qquad d=r \\Leftrightarrow \\text{tangente} \\qquad d\\gt r \\Leftrightarrow \\text{exterior}$$'}));
    c4.append(el('p',{class:'note'},'Lo mismo se puede leer sustituyendo la recta en la ecuación de la circunferencia: queda una ecuación cuadrática en una variable, y el signo de su discriminante $\\Delta$ —columna de la tabla— sigue exactamente el mismo criterio: positivo si es secante, cero si es tangente y negativo si es exterior.'));
    sec.append(c4);
  }
});
