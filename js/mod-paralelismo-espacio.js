/* Paralelismo y perpendicularidad en el espacio: entre dos rectas (comparando
   sus directores), entre una recta y un plano (director contra normal) y
   entre dos planos (comparando sus normales) — y, aparte, las cuatro
   posiciones relativas que puede tener un par de rectas, incluida la que no
   existe en el plano: dos rectas que no se cortan sin ser paralelas. Todas
   las cuentas de las tarjetas están verificadas aparte con Node antes de
   publicarse. */
registerModule({
  id:'paralelismo-espacio',
  title:'Paralelismo y perpendicularidad entre rectas',
  unidad:'III',
  lead:'Dos rectas en el espacio pueden ser paralelas, la misma recta, cortarse en un punto o cruzarse sin tocarse nunca — un cuarto caso que no existe en el plano. La misma comparación de direcciones sirve entre una recta y un plano, y entre dos planos.',
  build(sec){

    /* ---------- utilidades vectoriales y de dibujo, compartidas por las 4 tarjetas ---------- */
    function cruz(a,b){return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];}
    function norma(a){return Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]);}
    function puntoP(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];}
    function normalizar(a){const n=norma(a)||1; return [a[0]/n,a[1]/n,a[2]/n];}
    function porEscalar(a,s){return [a[0]*s,a[1]*s,a[2]*s];}
    function sumar(a,b){return [a[0]+b[0],a[1]+b[1],a[2]+b[2]];}
    function restar(a,b){return [a[0]-b[0],a[1]-b[1],a[2]-b[2]];}
    const num=n=>{ const r=Math.round(n*100)/100; return (r<0?'−'+(-r):String(r)); };
    const punto3str=p=>'('+p.map(x=>num(Math.round(x*100)/100)).join(', ')+')';

    function leyenda(mount,items){
      const L=el('div',{class:'legend'});
      items.forEach(([col,txt])=>L.append(el('span',{},
        el('i',{class:'sw',style:'background:var('+col+')'}),txt)));
      mount.append(L);
    }

    /* E.texto3 no admite dx/dy/tam (a diferencia de Plano.texto): este
       envoltorio liviano sobre E.ctx/E.proy sí, para separar rótulos que se
       pisarían con el corrimiento fijo de la primitiva. */
    function texto3dx(E,p,s,op){
      op=op||{};
      const c=E.ctx, P=E.proy(p);
      c.save();
      c.fillStyle=colorVar(op.color||'--muted');
      c.font=(op.tam||12)+'px ui-monospace, Consolas, monospace';
      c.fillText(s, P[0]+(op.dx!=null?op.dx:6), P[1]+(op.dy!=null?op.dy:-6));
      c.restore();
    }

    /* Traza la recta como un segmento de largo 2L centrado en P0, en la
       dirección de "dir" (no hace falta que venga normalizado). */
    function segmentoRecta(E,P0,dir,L,op){
      const u=normalizar(dir);
      const A=restar(P0,porEscalar(u,L)), B=sumar(P0,porEscalar(u,L));
      E.linea3(A,B,op);
    }

    /* Marca de ángulo recto en 3D: mismo espíritu que la del plano, con dos
       tramos que arrancan de O en las direcciones unitarias u1,u2. */
    function marcaRecta3(E,O,u1,u2,largo,op){
      const A=sumar(O,porEscalar(u1,largo));
      const B=sumar(O,porEscalar(u2,largo));
      const C=sumar(A,porEscalar(u2,largo));
      E.linea3(A,C,op); E.linea3(B,C,op);
    }

    /* Dos vectores unitarios que junto con la normal n forman una base
       ortogonal: sirven tanto para "barrer" un plano con E.superficie como
       para rotar un director dentro de él. */
    function baseDelPlano(n){
      const nh=normalizar(n);
      const arb=Math.abs(nh[2])<0.9 ? [0,0,1] : [1,0,0];
      const e1=normalizar(cruz(nh,arb));
      const e2=normalizar(cruz(nh,e1));
      return [e1,e2];
    }

    function dibujarPlano(E,P0,e1,e2,dom,op){
      E.superficie((a,b)=>sumar(P0,sumar(porEscalar(e1,a),porEscalar(e2,b))),
        Object.assign({uMin:-dom,uMax:dom,vMin:-dom,vMax:dom,nu:6,nv:6},op||{}));
    }

    /* ---------- Tarjeta 1: ángulo entre dos rectas (deslizador) ---------- */
    const c1=el('div',{class:'card'});
    c1.append(el('h3',{},'Ángulo entre dos rectas: paralelas y perpendiculares, dos casos particulares'));
    c1.append(el('p',{},'Para comparar la dirección de dos rectas basta mirar sus vectores directores $\\vec v$ y $\\vec w$: da lo mismo por dónde pase cada una. El siguiente control gira $\\vec w$ alrededor del origen, separándolo de $\\vec v$ en un ángulo $\\theta$; el paralelismo y la perpendicularidad resultan ser apenas dos valores particulares de $\\theta$, no dos propiedades sueltas.'));

    const v1C1=[2,1,2];                       /* ‖v1‖ = 3 */
    const vhatC1=normalizar(v1C1);
    const nperpC1=normalizar(cruz(v1C1,[1,0,0]));
    function wDirC1(thetaDeg){
      const th=thetaDeg*Math.PI/180;
      return sumar(porEscalar(vhatC1,Math.cos(th)), porEscalar(nperpC1,Math.sin(th)));
    }
    let thG1=55;
    const cajaP1=el('div',{class:'plot'}); c1.append(cajaP1);
    const E1=Espacio(cajaP1,{alto:370,escala:75,theta:0.7,phi:0.35,rotable:true});
    function pintarC1(E){
      const w=porEscalar(wDirC1(thG1),3);
      E.ejes3({largo:2});
      segmentoRecta(E,[0,0,0],v1C1,2,{color:'--s1',grosor:2.6});
      segmentoRecta(E,[0,0,0],w,2,{color:'--s6',grosor:2.6});
      E.vector3([0,0,0],porEscalar(vhatC1,1.25),{color:'--s1',grosor:2.6,etiqueta:'v'});
      E.vector3([0,0,0],porEscalar(normalizar(w),1.25),{color:'--s6',grosor:2.6,etiqueta:'w'});
      const thRad=thG1*Math.PI/180;
      E.curva3(a=>porEscalar(sumar(porEscalar(vhatC1,Math.cos(a)),porEscalar(nperpC1,Math.sin(a))),0.85),
        0,Math.max(thRad,1e-6),{color:'--s4',grosor:2.2});
      if(thG1===90) marcaRecta3(E,[0,0,0],vhatC1,normalizar(w),0.32,{color:'--s7',grosor:2});
      E.punto3([0,0,0],{color:'--muted',r:3});
    }
    E1.dibujar(pintarC1);
    let reglaC1=null;
    const leerC1=lectura(c1);
    function actualizarC1(){
      E1.redibujar();
      const w=porEscalar(wDirC1(thG1),3);
      const d=puntoP(v1C1,w), cr=norma(cruz(v1C1,w));
      leerC1.set([
        ['θ', thG1+'°'],
        ['v·w', num(d)],
        ['‖v×w‖', num(cr)]
      ]);
      if(thG1===0||thG1===180){
        reglaC1.set('En $\\theta='+thG1+'^\\circ$ los directores son proporcionales, $\\vec w=k\\vec v$: las dos rectas son <b>paralelas</b> (o la misma recta, si además comparten un punto).');
      } else if(thG1===90){
        reglaC1.set('En $\\theta=90^\\circ$ el producto punto se anula, $\\vec v\\cdot\\vec w=0$: las dos rectas son <b>perpendiculares</b>.');
      } else {
        reglaC1.set('Para este $\\theta$ los directores no son proporcionales ni ortogonales: las rectas no son paralelas ni perpendiculares — el caso más frecuente en el espacio.');
      }
    }
    controlValor(c1,{label:'θ',min:0,max:180,paso:1,valor:thG1,unidad:'°',
      onChange:v=>{ thG1=v; actualizarC1(); }});
    reglaC1=textoVivo(c1);
    reglaC1.calibrar([
      'En $\\theta=0^\\circ$ los directores son proporcionales, $\\vec w=k\\vec v$: las dos rectas son <b>paralelas</b> (o la misma recta, si además comparten un punto).',
      'En $\\theta=90^\\circ$ el producto punto se anula, $\\vec v\\cdot\\vec w=0$: las dos rectas son <b>perpendiculares</b>.',
      'Para este $\\theta$ los directores no son proporcionales ni ortogonales: las rectas no son paralelas ni perpendiculares — el caso más frecuente en el espacio.'
    ]);
    actualizarC1();

    leyenda(c1,[['--s1','v, director de r1'],['--s6','w, director de r2'],['--s4','ángulo θ entre v y w']]);

    c1.append(el('p',{class:'note'},'Las dos rectas se dibujaron pasando por el origen solo para que compartan vértice y el arco del ángulo se vea directo; el paralelismo y la perpendicularidad dependen únicamente de $\\vec v$ y $\\vec w$, no de por dónde pase cada recta — eso se trata aparte, en la tarjeta siguiente.'));
    c1.append(el('div',{class:'formula',html:'$$\\vec v\\parallel\\vec w \\iff \\vec w=k\\vec v,\\ k\\neq0 \\qquad\\qquad \\vec v\\perp\\vec w \\iff \\vec v\\cdot\\vec w=0$$'}));
    c1.append(el('p',{class:'note'},'El ángulo entre dos rectas se reporta siempre agudo, por convención; si el que forman los directores resulta obtuso —como ocurre acá entre $\\theta=90^\\circ$ y $180^\\circ$— se toma su suplementario, lo mismo que asegura el valor absoluto en $\\cos\\theta=\\dfrac{|\\vec v\\cdot\\vec w|}{\\|\\vec v\\|\\,\\|\\vec w\\|}$.'));
    sec.append(c1);

    /* ---------- Tarjeta 2: posición relativa de dos rectas (4 casos) ---------- */
    const c2=el('div',{class:'card'});
    c2.append(el('h3',{},'Posición relativa de dos rectas: cuatro casos, no tres'));
    c2.append(el('p',{},'En el plano, dos rectas no paralelas siempre se cortan. En el espacio no: pueden no ser paralelas y aun así no tener ningún punto en común, porque viven en planos distintos que nunca se juntan — se les llama ',el('b',{},'alabeadas'),'. Los botones recorren un ejemplo de cada una de las cuatro situaciones posibles, siempre comparando la misma recta $r_1$ con una segunda recta $r_2$ distinta en cada caso.'));

    const CASOS_C2=[
      {nombre:'secantes',     P0:[0,0,0], v:[1,1,1], Q0:[2,2,0],     w:[-1,-1,1]},
      {nombre:'paralelas',    P0:[0,0,0], v:[1,1,1], Q0:[0,0,2],     w:[2,2,2]},
      {nombre:'coincidentes', P0:[0,0,0], v:[1,1,1], Q0:[1.5,1.5,1.5], w:[-2,-2,-2]},
      {nombre:'alabeadas',    P0:[0,0,0], v:[1,1,1], Q0:[1,0,0],     w:[0,1,0]}
    ];
    function clasificarC2(P0,v,Q0,w){
      const cr=cruz(v,w), crMag=norma(cr), dif=restar(Q0,P0);
      if(crMag<1e-6){
        return norma(cruz(dif,v))<1e-6 ? {tipo:'coincidentes'} : {tipo:'paralelas'};
      }
      const triple=puntoP(dif,cr);
      if(Math.abs(triple)<1e-6){
        const t=puntoP(cruz(dif,w),cr)/(crMag*crMag);
        return {tipo:'secantes', punto:sumar(P0,porEscalar(v,t)), triple};
      }
      return {tipo:'alabeadas', triple};
    }
    const MSG_C2={
      secantes:'Los directores no son proporcionales y $\\overrightarrow{P_0Q_0}\\cdot(\\vec v\\times\\vec w)=0$: las dos rectas quedan en un mismo plano y se cortan en un único punto.',
      paralelas:'Los directores son proporcionales, $\\vec w=k\\vec v$, pero ningún punto de $r_2$ está en $r_1$: son paralelas y nunca se tocan.',
      coincidentes:'Los directores son proporcionales y, además, $Q_0$ está sobre $r_1$: son la misma recta, escrita con otro punto y otro director.',
      alabeadas:'Los directores no son proporcionales y $\\overrightarrow{P_0Q_0}\\cdot(\\vec v\\times\\vec w)\\neq0$: no existe ningún plano que contenga a las dos. Arrastra la figura para comprobar, desde otro ángulo, que nunca llegan a tocarse.'
    };
    let iC2=0;
    const cajaP2=el('div',{class:'plot'}); c2.append(cajaP2);
    const E2=Espacio(cajaP2,{alto:380,escala:55,theta:0.7,phi:0.35,rotable:true});
    function pintarC2(E){
      const c=CASOS_C2[iC2], r=clasificarC2(c.P0,c.v,c.Q0,c.w);
      E.ejes3({largo:1.6});
      segmentoRecta(E,c.P0,c.v,2.5,{color:'--s1',grosor:2.6});
      segmentoRecta(E,c.Q0,c.w,2.5,{color:'--s6',grosor:2.6});
      E.vector3(c.P0,porEscalar(normalizar(c.v),1),{color:'--s1',grosor:2.2,etiqueta:'v'});
      E.vector3(c.Q0,porEscalar(normalizar(c.w),1),{color:'--s6',grosor:2.2,etiqueta:'w'});
      E.punto3(c.P0,{color:'--s1',r:4}); texto3dx(E,c.P0,'P0',{color:'--s1',dx:-20,dy:14});
      E.punto3(c.Q0,{color:'--s6',r:4}); texto3dx(E,c.Q0,'Q0',{color:'--s6',dx:8,dy:14});
      if(r.tipo==='secantes'){
        E.punto3(r.punto,{color:'--s7',r:5});
        texto3dx(E,r.punto,'corte',{color:'--s7',dx:8,dy:-8});
      }
    }
    E2.dibujar(pintarC2);
    const pasoC2=el('span',{class:'cnt'});
    let reglaC2=null;
    const leerC2=lectura(c2);
    function irC2(d){
      iC2=(iC2+d+CASOS_C2.length)%CASOS_C2.length;
      const c=CASOS_C2[iC2], r=clasificarC2(c.P0,c.v,c.Q0,c.w);
      pasoC2.textContent=(iC2+1)+' de '+CASOS_C2.length+': '+c.nombre;
      E2.redibujar();
      const filas=[['caso', c.nombre], ['v', punto3str(c.v)], ['w', punto3str(c.w)]];
      if(r.tipo==='secantes') filas.push(['punto de corte', punto3str(r.punto)], ['(Q0−P0)·(v×w)', num(r.triple)]);
      else if(r.tipo==='alabeadas') filas.push(['(Q0−P0)·(v×w)', num(r.triple)]);
      else filas.push(['v×w', '(0, 0, 0)']);
      leerC2.set(filas);
      reglaC2.set(MSG_C2[r.tipo]);
    }
    c2.append(el('div',{class:'stepper'},
      el('button',{class:'btn',onclick:()=>irC2(-1)},'◀ Anterior'),
      el('button',{class:'btn primary',onclick:()=>irC2(1)},'Siguiente ▶'),
      pasoC2));
    reglaC2=textoVivo(c2);
    reglaC2.calibrar(Object.values(MSG_C2));
    irC2(0);

    leyenda(c2,[['--s1','r1: P0 y director v'],['--s6','r2: Q0 y director w'],['--s7','punto de corte (solo si es secante)']]);

    c2.append(el('p',{class:'note'},'La clave para distinguir secantes de alabeadas es si el vector $\\overrightarrow{P_0Q_0}$ queda en el mismo plano que $\\vec v$ y $\\vec w$: eso es exactamente lo que mide el producto mixto $\\overrightarrow{P_0Q_0}\\cdot(\\vec v\\times\\vec w)$.'));
    c2.append(el('div',{class:'formula',html:'$$\\vec v\\times\\vec w=\\vec 0 \\iff r_1\\parallel r_2\\ \\text{(paralelas o coincidentes)} \\qquad\\qquad \\overrightarrow{P_0Q_0}\\cdot(\\vec v\\times\\vec w)\\neq0 \\iff r_1,r_2\\ \\text{alabeadas}$$'}));
    c2.append(el('p',{class:'note'},'Cuando el producto mixto da cero pero los directores no son proporcionales, las rectas son secantes: viven en un mismo plano y ese punto de corte se puede despejar con los propios $\\vec v$ y $\\vec w$.'));
    sec.append(c2);

    /* ---------- Tarjeta 3: recta y plano (deslizador) ---------- */
    const c3=el('div',{class:'card'});
    c3.append(el('h3',{},'Paralelismo y perpendicularidad entre una recta y un plano'));
    c3.append(el('p',{},'Acá se compara el director $\\vec v$ de una recta con la normal $\\vec n$ de un plano. El siguiente control gira $\\vec v$ desde estar alineado con $\\vec n$ hasta quedar contenido en el plano, pasando por todos los ángulos intermedios.'));

    const nC3=[1,1,1];                        /* normal del plano x+y+z=3, ‖n‖=√3 */
    const nhatC3=normalizar(nC3);
    const [e1C3,e2C3]=baseDelPlano(nC3);
    const P0planoC3=[1,1,1];                  /* punto del plano: 1+1+1=3 */
    const QrectaC3=[0,0,0];                   /* punto de la recta, fuera del plano: 0≠3 */
    function vDirC3(thetaDeg){
      const th=thetaDeg*Math.PI/180;
      return sumar(porEscalar(nhatC3,Math.cos(th)), porEscalar(e1C3,Math.sin(th)));
    }
    let thG3=55;
    const cajaP3=el('div',{class:'plot'}); c3.append(cajaP3);
    const E3=Espacio(cajaP3,{alto:400,escala:42,theta:0.7,phi:0.35,rotable:true});
    function pintarC3(E){
      const v=porEscalar(vDirC3(thG3),Math.sqrt(3));
      E.ejes3({largo:1.8});
      dibujarPlano(E,P0planoC3,e1C3,e2C3,1.3,{color:'--grid'});
      E.vector3(P0planoC3,porEscalar(nhatC3,1.1),{color:'--s2',grosor:2.2,etiqueta:'n'});
      segmentoRecta(E,QrectaC3,v,2,{color:'--s6',grosor:2.6});
      E.vector3(QrectaC3,porEscalar(normalizar(v),1.15),{color:'--s6',grosor:2.6,etiqueta:'v'});
      E.punto3(QrectaC3,{color:'--s6',r:4});
      if(thG3===90) marcaRecta3(E,QrectaC3,nhatC3,normalizar(v),0.32,{color:'--s7',grosor:2});
    }
    E3.dibujar(pintarC3);
    let reglaC3=null;
    const leerC3=lectura(c3);
    function actualizarC3(){
      E3.redibujar();
      const v=porEscalar(vDirC3(thG3),Math.sqrt(3));
      const d=puntoP(v,nC3);
      leerC3.set([
        ['θ', thG3+'°'],
        ['v·n', num(d)]
      ]);
      if(thG3===0||thG3===180){
        reglaC3.set('En $\\theta='+thG3+'^\\circ$ el director es proporcional a la normal, $\\vec v=k\\vec n$: la recta es <b>perpendicular</b> al plano — lo atraviesa de lleno.');
      } else if(thG3===90){
        reglaC3.set('En $\\theta=90^\\circ$ el director es ortogonal a la normal, $\\vec v\\cdot\\vec n=0$: la recta es <b>paralela</b> al plano — nunca lo toca, salvo que ya esté contenida en él.');
      } else {
        reglaC3.set('Para este $\\theta$ la recta corta al plano en un único punto, sin ser paralela ni perpendicular a él.');
      }
    }
    controlValor(c3,{label:'θ',min:0,max:180,paso:1,valor:thG3,unidad:'°',
      onChange:v=>{ thG3=v; actualizarC3(); }});
    reglaC3=textoVivo(c3);
    reglaC3.calibrar([
      'En $\\theta=0^\\circ$ el director es proporcional a la normal, $\\vec v=k\\vec n$: la recta es <b>perpendicular</b> al plano — lo atraviesa de lleno.',
      'En $\\theta=90^\\circ$ el director es ortogonal a la normal, $\\vec v\\cdot\\vec n=0$: la recta es <b>paralela</b> al plano — nunca lo toca, salvo que ya esté contenida en él.',
      'Para este $\\theta$ la recta corta al plano en un único punto, sin ser paralela ni perpendicular a él.'
    ]);
    actualizarC3();

    leyenda(c3,[['--grid','el plano'],['--s2','n, normal del plano'],['--s6','v, director de la recta']]);

    c3.append(el('p',{class:'note'},'Es la relación inversa de la que hay entre dos rectas: acá que el director sea ',el('b',{},'ortogonal'),' a la normal ($\\vec v\\cdot\\vec n=0$) es lo que deja a la recta paralela al plano, y que sea ',el('b',{},'proporcional'),' a la normal ($\\vec v=k\\vec n$) es lo que la deja perpendicular a él.'));
    c3.append(el('div',{class:'formula',html:'$$r\\parallel\\pi \\iff \\vec v\\cdot\\vec n=0 \\qquad\\qquad r\\perp\\pi \\iff \\vec v=k\\vec n,\\ k\\neq0$$'}));
    c3.append(el('p',{class:'note'},'Por ejemplo, con $\\vec n=(1,1,1)$: el director $\\vec v=(1,1,-2)$ da $\\vec v\\cdot\\vec n=1+1-2=0$ (recta paralela al plano) y el director $\\vec v=(2,2,2)=2\\vec n$ es proporcional a $\\vec n$ (recta perpendicular al plano).'));
    sec.append(c3);

    /* ---------- Tarjeta 4: dos planos (deslizador) ---------- */
    const c4=el('div',{class:'card'});
    c4.append(el('h3',{},'Paralelismo y perpendicularidad entre dos planos'));
    c4.append(el('p',{},'Entre dos planos se comparan sus normales $\\vec n_1$ y $\\vec n_2$, igual que se compararían dos rectas comparando sus directores. Acá $\\pi_1$ es el plano horizontal $z=0$ y el control gira la normal de $\\pi_2$, que siempre pasa por el punto $(0,0,2)$.'));

    const n1C4=[0,0,1];
    const [f1C4,f2C4]=baseDelPlano(n1C4);
    const P1planoC4=[0,0,0], P2planoC4=[0,0,2];
    function n2AtC4(thetaDeg){ const th=thetaDeg*Math.PI/180; return [Math.sin(th),0,Math.cos(th)]; }
    let thG4=55;
    const cajaP4=el('div',{class:'plot'}); c4.append(cajaP4);
    const E4=Espacio(cajaP4,{alto:400,escala:45,theta:0.7,phi:0.35,rotable:true});
    function pintarC4(E){
      const n2=n2AtC4(thG4), [g1,g2]=baseDelPlano(n2);
      E.ejes3({largo:1.8});
      dibujarPlano(E,P1planoC4,f1C4,f2C4,1.3,{color:'--s1'});
      dibujarPlano(E,P2planoC4,g1,g2,1.3,{color:'--s6'});
      E.vector3(P1planoC4,porEscalar(n1C4,1.2),{color:'--s1',grosor:2.2,etiqueta:'n1'});
      E.vector3(P2planoC4,porEscalar(n2,1.2),{color:'--s6',grosor:2.2,etiqueta:'n2'});
      if(thG4===90) marcaRecta3(E,P1planoC4,n1C4,n2,0.32,{color:'--s7',grosor:2});
    }
    E4.dibujar(pintarC4);
    let reglaC4=null;
    const leerC4=lectura(c4);
    function actualizarC4(){
      E4.redibujar();
      const n2=n2AtC4(thG4);
      const d=puntoP(n1C4,n2);
      leerC4.set([
        ['θ', thG4+'°'],
        ['n1·n2', num(d)]
      ]);
      if(thG4===0||thG4===180){
        reglaC4.set('En $\\theta='+thG4+'^\\circ$ las normales son proporcionales, $\\vec n_1=k\\vec n_2$: los planos son <b>paralelos</b> (acá, dos planos horizontales distintos).');
      } else if(thG4===90){
        reglaC4.set('En $\\theta=90^\\circ$ las normales son ortogonales, $\\vec n_1\\cdot\\vec n_2=0$: los planos son <b>perpendiculares</b>.');
      } else {
        reglaC4.set('Para este $\\theta$ los planos no son paralelos ni perpendiculares: se cortan en una recta, formando con ella un ángulo distinto de $90^\\circ$.');
      }
    }
    controlValor(c4,{label:'θ',min:0,max:180,paso:1,valor:thG4,unidad:'°',
      onChange:v=>{ thG4=v; actualizarC4(); }});
    reglaC4=textoVivo(c4);
    reglaC4.calibrar([
      'En $\\theta=0^\\circ$ las normales son proporcionales, $\\vec n_1=k\\vec n_2$: los planos son <b>paralelos</b> (acá, dos planos horizontales distintos).',
      'En $\\theta=90^\\circ$ las normales son ortogonales, $\\vec n_1\\cdot\\vec n_2=0$: los planos son <b>perpendiculares</b>.',
      'Para este $\\theta$ los planos no son paralelos ni perpendiculares: se cortan en una recta, formando con ella un ángulo distinto de $90^\\circ$.'
    ]);
    actualizarC4();

    leyenda(c4,[['--s1','π1: z = 0, normal n1'],['--s6','π2, normal n2'],['--s7','ángulo recto (si corresponde)']]);

    c4.append(el('p',{class:'note'},'En $\\theta=90^\\circ$, $\\pi_2$ queda siendo el plano $x=0$: la figura confirma algo ya conocido, que los planos coordenados $x=0$, $y=0$ y $z=0$ son perpendiculares entre sí dos a dos. Ese es el caso extremo de la fórmula, no una excepción.'));
    c4.append(el('div',{class:'formula',html:'$$\\pi_1\\parallel\\pi_2 \\iff \\vec n_1=k\\vec n_2,\\ k\\neq0 \\qquad\\qquad \\pi_1\\perp\\pi_2 \\iff \\vec n_1\\cdot\\vec n_2=0$$'}));
    c4.append(el('p',{class:'note'},'Si no son paralelos, dos planos siempre se cortan en una recta contenida en ambos; el ángulo entre los planos se toma, por convención, como el agudo entre sus normales — la misma convención de la primera tarjeta.'));
    sec.append(c4);

    /* ---------- Tarjeta 5: las tres comparaciones, juntas (tabla, sin animar) ---------- */
    const c5=el('div',{class:'card'});
    c5.append(el('h3',{},'Las tres comparaciones, una junto a la otra'));
    c5.append(el('p',{},'Las tres situaciones anteriores comparan un par de vectores con la misma herramienta —proporcionalidad para el paralelismo, producto punto para la perpendicularidad—, pero conviene tenerlas juntas: en la fila del medio los dos papeles quedan invertidos respecto de las otras dos.'));

    Tabla(c5,{columnas:['Comparación','Vectores que se comparan','Paralelismo','Perpendicularidad'],
      filas:[
        ['Dos rectas', 'directores $\\vec v,\\vec w$', '$\\vec w=k\\vec v$', '$\\vec v\\cdot\\vec w=0$'],
        ['Recta y plano', 'director $\\vec v$, normal $\\vec n$', '$\\vec v\\cdot\\vec n=0$', '$\\vec v=k\\vec n$'],
        ['Dos planos', 'normales $\\vec n_1,\\vec n_2$', '$\\vec n_1=k\\vec n_2$', '$\\vec n_1\\cdot\\vec n_2=0$']
      ]});

    c5.append(el('p',{class:'note'},'Entre dos rectas o entre dos planos, un producto punto nulo señala perpendicularidad. Entre una recta y un plano es al revés: el producto punto nulo ($\\vec v\\cdot\\vec n=0$) es lo que deja a la recta paralela al plano, y es la proporcionalidad ($\\vec v=k\\vec n$) la que la deja perpendicular a él.'));
    sec.append(c5);
  }
});
