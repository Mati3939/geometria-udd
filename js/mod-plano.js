/* Ecuaciones del plano: por un punto y una normal, por tres puntos no
   colineales (producto cruz), la ecuación cartesiana, la forma vectorial y
   paramétrica, y las trazas con los ejes coordenados. Las cinco tarjetas
   comparten el mismo plano de referencia, x+y+z=1, para que las distintas
   maneras de describirlo se lean como una sola idea contada de varias formas. */
registerModule({
  id:'plano', title:'Ecuaciones del plano', unidad:'III',
  lead:'Un punto y un vector normal alcanzan para fijar un plano entero.',
  build(sec){

    function leyenda(mount,items){
      const L=el('div',{class:'legend'});
      items.forEach(([col,txt])=>L.append(el('span',{},
        el('i',{class:'sw',style:'background:var('+col+')'}),txt)));
      mount.append(L);
    }

    /* álgebra vectorial en R^3, compartida por las cinco tarjetas */
    function cruz(a,b){return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];}
    function puntoEsc(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];}
    function resta(a,b){return [a[0]-b[0],a[1]-b[1],a[2]-b[2]];}
    function norma(a){return Math.hypot(a[0],a[1],a[2]);}
    function vecStr(v){return '('+v.join(', ')+')';}

    /* Dos vectores unitarios u,v que abren el plano perpendicular a n (con n
       no nulo): Gram-Schmidt con una referencia que nunca sea casi paralela
       a n, para que el primer producto cruz no se anule. */
    function baseDelPlano(n){
      const nn=norma(n);
      const nu=[n[0]/nn,n[1]/nn,n[2]/nn];
      const ref=Math.abs(nu[0])<0.9?[1,0,0]:[0,1,0];
      let u=cruz(nu,ref); const um=norma(u); u=[u[0]/um,u[1]/um,u[2]/um];
      const v=cruz(nu,u);
      return {u,v};
    }

    /* ---------- Tarjeta 1: un punto y una normal (animada) ---------- */
    const c1=el('div',{class:'card'});
    c1.append(el('h3',{},'Un punto y un vector normal fijan el plano'));
    c1.append(el('p',{},'Un plano queda determinado por un punto conocido $P_0$ y un vector $\\vec n=(a,b,c)$ —el vector normal— perpendicular a él. Un punto $P$ pertenece al plano exactamente cuando el vector $P-P_0$, que vive dentro del plano, resulta perpendicular a $\\vec n$.'));

    const P0_1=[1,0,0], n1=[1,1,1];
    const base1=baseDelPlano(n1);
    const cajaE1=el('div',{class:'plot'}); c1.append(cajaE1);
    const E1=Espacio(cajaE1,{alto:380,escala:56,theta:0.7,phi:0.4});
    const leerC1=lectura(c1);
    E1.animar((E,t)=>{
      const ang=(t/8)*2*Math.PI, r=1.15;
      const s=r*Math.cos(ang), tt=r*Math.sin(ang);
      const Q=[P0_1[0]+s*base1.u[0]+tt*base1.v[0], P0_1[1]+s*base1.u[1]+tt*base1.v[1], P0_1[2]+s*base1.u[2]+tt*base1.v[2]];
      E.ejes3({largo:2.2});
      E.superficie((uu,vv)=>[P0_1[0]+uu*base1.u[0]+vv*base1.v[0], P0_1[1]+uu*base1.u[1]+vv*base1.v[1], P0_1[2]+uu*base1.u[2]+vv*base1.v[2]],
        {uMin:-1.3,uMax:1.3,vMin:-1.3,vMax:1.3,nu:8,nv:8,color:'--grid'});
      const nUnit=[n1[0]/norma(n1),n1[1]/norma(n1),n1[2]/norma(n1)];
      E.vector3(P0_1,[nUnit[0]*1.3,nUnit[1]*1.3,nUnit[2]*1.3],{color:'--s6',grosor:2.6,etiqueta:'n'});
      E.linea3(P0_1,Q,{color:'--s7',grosor:2.2});
      E.punto3(P0_1,{color:'--s4',r:5}); E.texto3(P0_1,'P0');
      E.punto3(Q,{color:'--s7',r:5}); E.texto3(Q,'P');
      const dif=resta(Q,P0_1);
      leerC1.set([
        ['n', '(1, 1, 1)'],
        ['P', '('+Q[0].toFixed(2)+', '+Q[1].toFixed(2)+', '+Q[2].toFixed(2)+')'],
        ['n·(P−P0)', puntoEsc(n1,dif).toFixed(3)]
      ]);
    },{duracion:8});

    leyenda(c1,[['--s4','P0'],['--s6','n (normal)'],['--s7','P y el segmento P−P0']]);

    c1.append(el('p',{class:'note'},'El punto violeta recorre el plano entero —arrastrando el dibujo se ve desde otro ángulo—, pero el segmento que lo une con $P_0$ nunca deja de formar $90°$ con $\\vec n$: el producto punto de la lectura se mantiene en $0$ en todo momento.'));
    c1.append(el('div',{class:'formula',html:'$$\\vec n\\cdot(P-P_0)=0$$'}));
    c1.append(el('p',{},'Escribiendo $P=(x,y,z)$, $P_0=(x_0,y_0,z_0)$ y $\\vec n=(a,b,c)$, y desarrollando el producto punto, esa misma condición queda en función de las coordenadas:'));
    c1.append(el('div',{class:'formula',html:'$$a(x-x_0)+b(y-y_0)+c(z-z_0)=0 \\ \\Longrightarrow\\ ax+by+cz=d,\\qquad d=ax_0+by_0+cz_0$$'}));
    c1.append(el('p',{class:'note'},'En el dibujo, $P_0=(1,0,0)$ y $\\vec n=(1,1,1)$, así que $d=1\\cdot1+1\\cdot0+1\\cdot0=1$: el plano de la animación es $x+y+z=1$.'));
    sec.append(c1);

    /* ---------- Tarjeta 2: la ecuación cartesiana y el vector normal (deslizadores) ---------- */
    const c2=el('div',{class:'card'});
    c2.append(el('h3',{},'La ecuación cartesiana y el vector normal'));
    c2.append(el('p',{},'En $ax+by+cz=d$, los coeficientes que acompañan a $x$, $y$, $z$ son directamente las componentes del vector normal $\\vec n=(a,b,c)$. El valor de $d$ fija a qué distancia del origen queda el plano: esa distancia es $|d|/\\|\\vec n\\|$, y se alcanza en el punto del plano más cercano al origen, sobre la misma recta de $\\vec n$.'));

    let coefA=2, coefB=-1, coefC=1, coefD=3;
    const cajaE2=el('div',{class:'plot'}); c2.append(cajaE2);
    const E2=Espacio(cajaE2,{alto:380,escala:44,theta:0.7,phi:0.4});
    E2.dibujar(E=>{
      E.ejes3({largo:2.2});
      const nn=coefA*coefA+coefB*coefB+coefC*coefC;
      if(nn<1e-6)return;   /* a=b=c=0: sin normal no hay plano que dibujar */
      const nvec=[coefA,coefB,coefC];
      const pie=[coefA*coefD/nn, coefB*coefD/nn, coefC*coefD/nn];   /* punto del plano más cercano al origen */
      const base=baseDelPlano(nvec);
      E.superficie((uu,vv)=>[pie[0]+uu*base.u[0]+vv*base.v[0], pie[1]+uu*base.u[1]+vv*base.v[1], pie[2]+uu*base.u[2]+vv*base.v[2]],
        {uMin:-1.4,uMax:1.4,vMin:-1.4,vMax:1.4,nu:8,nv:8,color:'--grid'});
      const nm=Math.sqrt(nn);
      E.vector3(pie,[coefA/nm*1.3,coefB/nm*1.3,coefC/nm*1.3],{color:'--s6',grosor:2.6,etiqueta:'n'});
      E.linea3([0,0,0],pie,{color:'--s8',grosor:1.8,guiones:true});
      E.punto3([0,0,0],{color:'--muted',r:4}); E.texto3([0,0,0],'O');
      E.punto3(pie,{color:'--s8',r:4});
    });
    const leerC2=lectura(c2);
    function actualizarC2(){
      E2.redibujar();
      const nn=coefA*coefA+coefB*coefB+coefC*coefC;
      const nm=Math.sqrt(nn);
      leerC2.set([
        ['n = (a, b, c)', '('+coefA+', '+coefB+', '+coefC+')'],
        ['d', String(coefD)],
        ['‖n‖', nn<1e-6?'0':nm.toFixed(2)],
        ['distancia al origen', nn<1e-6?'sin definir':(Math.abs(coefD)/nm).toFixed(2)]
      ]);
    }
    controlValor(c2,{label:'a',min:-3,max:3,paso:1,valor:coefA,unidad:'',onChange:v=>{coefA=v;actualizarC2();}});
    controlValor(c2,{label:'b',min:-3,max:3,paso:1,valor:coefB,unidad:'',onChange:v=>{coefB=v;actualizarC2();}});
    controlValor(c2,{label:'c',min:-3,max:3,paso:1,valor:coefC,unidad:'',onChange:v=>{coefC=v;actualizarC2();}});
    controlValor(c2,{label:'d',min:-3,max:3,paso:1,valor:coefD,unidad:'',onChange:v=>{coefD=v;actualizarC2();}});
    actualizarC2();

    leyenda(c2,[['--s6','n (normal)'],['--s8','O y el punto del plano más cercano']]);

    c2.append(el('p',{class:'note'},'Al mover $d$ dejando $a,b,c$ fijos, el plano se desplaza en bloque a lo largo de $\\vec n$, sin cambiar de inclinación. Al mover $a$, $b$ o $c$, en cambio, lo que cambia es la dirección de $\\vec n$ y con ella la inclinación del plano.'));
    c2.append(el('div',{class:'formula',html:'$$ax+by+cz=d,\\qquad \\vec n=(a,b,c)$$'}));
    c2.append(el('p',{class:'note'},'Si los tres deslizadores $a$, $b$ y $c$ llegan a $0$ a la vez, $\\vec n=\\vec 0$ y no queda ningún plano definido: el dibujo se vacía en ese instante.'));
    sec.append(c2);

    /* ---------- Tarjeta 3: el plano por tres puntos (producto cruz) ---------- */
    const c3=el('div',{class:'card'});
    c3.append(el('h3',{},'El plano por tres puntos no colineales'));
    c3.append(el('p',{},'Tres puntos $P_1,P_2,P_3$ que no estén sobre una misma recta determinan un único plano. Los vectores $\\vec u=P_2-P_1$ y $\\vec v=P_3-P_1$ viven dentro de ese plano, así que su producto cruz $\\vec n=\\vec u\\times\\vec v$ —perpendicular a los dos— sirve de vector normal.'));

    const EJ3=[
      {P1:[1,0,0],P2:[0,1,0],P3:[0,0,1]},
      {P1:[0,0,0],P2:[2,0,0],P3:[0,3,0]},
      {P1:[0,0,0],P2:[1,1,1],P3:[2,2,2]}
    ];
    let iC3=0;
    const cajaE3=el('div',{class:'plot'}); c3.append(cajaE3);
    const E3=Espacio(cajaE3,{alto:380,escala:50,theta:0.7,phi:0.4});
    E3.dibujar(E=>{
      const {P1,P2,P3}=EJ3[iC3];
      const u=resta(P2,P1), v=resta(P3,P1), n=cruz(u,v);
      E.ejes3({largo:2.2});
      E.linea3(P1,P2,{color:'--s1',grosor:2.6});
      E.linea3(P1,P3,{color:'--s2',grosor:2.6});
      E.punto3(P1,{color:'--s4',r:5}); E.texto3(P1,'P1');
      E.punto3(P2,{color:'--s1',r:4}); E.texto3(P2,'P2');
      E.punto3(P3,{color:'--s2',r:4}); E.texto3(P3,'P3');
      if(norma(n)>1e-6){
        const base=baseDelPlano(n);
        E.superficie((uu,vv)=>[P1[0]+uu*base.u[0]+vv*base.v[0], P1[1]+uu*base.u[1]+vv*base.v[1], P1[2]+uu*base.u[2]+vv*base.v[2]],
          {uMin:-1.5,uMax:1.5,vMin:-1.5,vMax:1.5,nu:8,nv:8,color:'--grid'});
        const nn=norma(n);
        E.vector3(P1,[n[0]/nn*1.3,n[1]/nn*1.3,n[2]/nn*1.3],{color:'--s6',grosor:2.6,etiqueta:'n'});
      }
    });

    leyenda(c3,[['--s4','P1'],['--s1','P2 y u = P2−P1'],['--s2','P3 y v = P3−P1'],['--s6','n = u×v']]);

    function irC3(d){
      iC3=(iC3+d+EJ3.length)%EJ3.length;
      pasoC3.textContent=(iC3+1)+' de '+EJ3.length;
      E3.redibujar();
      const {P1,P2,P3}=EJ3[iC3];
      const u=resta(P2,P1), v=resta(P3,P1), n=cruz(u,v);
      leerC3.set([
        ['P1', vecStr(P1)], ['P2', vecStr(P2)], ['P3', vecStr(P3)],
        ['u = P2−P1', vecStr(u)], ['v = P3−P1', vecStr(v)], ['n = u×v', vecStr(n)]
      ]);
      mensajeC3.set(norma(n)>1e-6?
        'Los tres puntos no son colineales: $\\vec u$ y $\\vec v$ no son paralelos, así que $\\vec n=\\vec u\\times\\vec v$ no se anula y queda un plano bien definido.' :
        'Estos tres puntos son colineales: $\\vec v$ resulta múltiplo de $\\vec u$, así que $\\vec u\\times\\vec v=\\vec 0$. Con puntos alineados no hay un plano determinado, solo la recta que los contiene.');
    }
    const pasoC3=el('span',{class:'cnt'});
    c3.append(el('div',{class:'stepper'},
      el('button',{class:'btn',onclick:()=>irC3(-1)},'◀ Otro ejemplo'),
      el('button',{class:'btn primary',onclick:()=>irC3(1)},'Otro ejemplo ▶'),
      pasoC3));
    const leerC3=lectura(c3);
    const mensajeC3=textoVivo(c3);
    mensajeC3.calibrar([
      'Los tres puntos no son colineales: $\\vec u$ y $\\vec v$ no son paralelos, así que $\\vec n=\\vec u\\times\\vec v$ no se anula y queda un plano bien definido.',
      'Estos tres puntos son colineales: $\\vec v$ resulta múltiplo de $\\vec u$, así que $\\vec u\\times\\vec v=\\vec 0$. Con puntos alineados no hay un plano determinado, solo la recta que los contiene.'
    ]);
    irC3(0);

    c3.append(el('div',{class:'formula',html:'$$\\vec n=\\vec u\\times\\vec v=(u_2v_3-u_3v_2,\\ u_3v_1-u_1v_3,\\ u_1v_2-u_2v_1)$$'}));
    c3.append(el('p',{class:'note'},'Con $\\vec n$ ya calculado, el plano queda igual que en la primera tarjeta: $\\vec n\\cdot(P-P_1)=0$, usando cualquiera de los tres puntos como $P_1$.'));
    sec.append(c3);

    /* ---------- Tarjeta 4: la forma vectorial y las ecuaciones paramétricas ---------- */
    const c4=el('div',{class:'card'});
    c4.append(el('h3',{},'La forma vectorial y las ecuaciones paramétricas'));
    c4.append(el('p',{},'Con un punto $P_0$ del plano y dos vectores $\\vec u,\\vec v$ que estén dentro de él y no sean paralelos, cualquier punto del plano se escribe como $P=P_0+s\\vec u+t\\vec v$, barriendo $s$ y $t$ sobre todos los reales. Con $P_0=(1,0,0)$, $\\vec u=(-1,1,0)$ y $\\vec v=(-1,0,1)$ —el mismo plano $x+y+z=1$ de la primera tarjeta—, los controles mueven $s$ y $t$ por separado.'));

    const P0_4=[1,0,0], u4=[-1,1,0], v4=[-1,0,1];
    let sG=0.4, tG=0.3;
    const cajaE4=el('div',{class:'plot'}); c4.append(cajaE4);
    const E4=Espacio(cajaE4,{alto:380,escala:50,theta:0.7,phi:0.4});
    E4.dibujar(E=>{
      E.ejes3({largo:2.2});
      E.superficie((uu,vv)=>[P0_4[0]+uu*u4[0]+vv*v4[0], P0_4[1]+uu*u4[1]+vv*v4[1], P0_4[2]+uu*u4[2]+vv*v4[2]],
        {uMin:-1.5,uMax:1.5,vMin:-1.5,vMax:1.5,nu:8,nv:8,color:'--grid'});
      const A=[P0_4[0]+sG*u4[0], P0_4[1]+sG*u4[1], P0_4[2]+sG*u4[2]];
      const Pf=[A[0]+tG*v4[0], A[1]+tG*v4[1], A[2]+tG*v4[2]];
      E.punto3(P0_4,{color:'--s4',r:5}); E.texto3(P0_4,'P0');
      E.vector3(P0_4,[sG*u4[0],sG*u4[1],sG*u4[2]],{color:'--s1',grosor:2.6,etiqueta:'su'});
      E.vector3(A,[tG*v4[0],tG*v4[1],tG*v4[2]],{color:'--s2',grosor:2.6,etiqueta:'tv'});
      E.punto3(Pf,{color:'--s7',r:5}); E.texto3(Pf,'P');
    });
    const leerC4=lectura(c4);
    function actualizarC4(){
      E4.redibujar();
      const x=P0_4[0]+sG*u4[0]+tG*v4[0], y=P0_4[1]+sG*u4[1]+tG*v4[1], z=P0_4[2]+sG*u4[2]+tG*v4[2];
      leerC4.set([
        ['s', sG.toFixed(2)], ['t', tG.toFixed(2)],
        ['P = P0+su+tv', '('+x.toFixed(2)+', '+y.toFixed(2)+', '+z.toFixed(2)+')'],
        ['x+y+z', (x+y+z).toFixed(2)]
      ]);
    }
    controlValor(c4,{label:'s',min:-1.5,max:1.5,paso:0.1,valor:sG,unidad:'',onChange:v=>{sG=v;actualizarC4();}});
    controlValor(c4,{label:'t',min:-1.5,max:1.5,paso:0.1,valor:tG,unidad:'',onChange:v=>{tG=v;actualizarC4();}});
    actualizarC4();

    leyenda(c4,[['--s4','P0'],['--s1','su'],['--s2','tv'],['--s7','P = P0+su+tv']]);

    c4.append(el('p',{class:'note'},'Cualesquiera que sean $s$ y $t$, el punto violeta se queda sobre el plano: la lectura de $x+y+z$ da siempre $1$, porque $\\vec u$ y $\\vec v$ se construyeron perpendiculares a $\\vec n=(1,1,1)$.'));
    c4.append(el('div',{class:'formula',html:'$$P=P_0+s\\vec u+t\\vec v,\\qquad s,t\\in\\mathbb{R}$$'}));
    c4.append(el('p',{},'Separando esa igualdad en sus tres coordenadas se obtienen las ecuaciones paramétricas del plano:'));
    c4.append(el('div',{class:'formula',html:'$$x=x_0+su_1+tv_1 \\qquad y=y_0+su_2+tv_2 \\qquad z=z_0+su_3+tv_3$$'}));
    sec.append(c4);

    /* ---------- Tarjeta 5: las trazas con los ejes coordenados ---------- */
    const c5=el('div',{class:'card'});
    c5.append(el('h3',{},'Las trazas: dónde el plano corta a los ejes'));
    c5.append(el('p',{},'Una manera rápida de bosquejar un plano a mano es ubicar dónde corta a cada eje coordenado —sus trazas— y unir esos tres puntos. Para el plano $2x+3y+z=d$, el corte con el eje $x$ se obtiene poniendo $y=z=0$, y de manera análoga con los otros dos ejes.'));

    const coefT=[2,3,1];
    let dT=6;
    const cajaE5=el('div',{class:'plot'}); c5.append(cajaE5);
    const E5=Espacio(cajaE5,{alto:420,escala:30,theta:0.5,phi:0.3});
    E5.dibujar(E=>{
      const [aT,bT,cT]=coefT;
      const Ax=[dT/aT,0,0], By=[0,dT/bT,0], Cz=[0,0,dT/cT];
      E.ejes3({largo:1.1});
      E.linea3(Ax,By,{color:'--s7',grosor:2.2});
      E.linea3(By,Cz,{color:'--s7',grosor:2.2});
      E.linea3(Cz,Ax,{color:'--s7',grosor:2.2});
      E.punto3(Ax,{color:'--s1',r:5}); E.texto3(Ax,'x');
      E.punto3(By,{color:'--s2',r:5}); E.texto3(By,'y');
      E.punto3(Cz,{color:'--s4',r:5}); E.texto3(Cz,'z');
    });
    const leerC5=lectura(c5);
    function actualizarC5(){
      E5.redibujar();
      const [aT,bT,cT]=coefT;
      leerC5.set([
        ['d', dT.toFixed(1)],
        ['corte con eje x', '('+(dT/aT).toFixed(2)+', 0, 0)'],
        ['corte con eje y', '(0, '+(dT/bT).toFixed(2)+', 0)'],
        ['corte con eje z', '(0, 0, '+(dT/cT).toFixed(2)+')']
      ]);
    }
    controlValor(c5,{label:'d',min:1,max:6,paso:0.5,valor:dT,unidad:'',onChange:v=>{dT=v;actualizarC5();}});
    actualizarC5();

    leyenda(c5,[['--s1','traza con el eje x'],['--s2','traza con el eje y'],['--s4','traza con el eje z'],['--s7','triángulo que une las tres']]);

    c5.append(el('p',{class:'note'},'Al aumentar $d$ el plano se aleja del origen sin cambiar de inclinación —$a,b,c$ quedan fijos—, y el triángulo de trazas crece de manera proporcional: cada corte es $d$ dividido por el coeficiente de esa variable.'));
    c5.append(el('div',{class:'formula',html:'$$y=z=0\\Rightarrow x=\\dfrac{d}{a} \\qquad x=z=0\\Rightarrow y=\\dfrac{d}{b} \\qquad x=y=0\\Rightarrow z=\\dfrac{d}{c}$$'}));
    c5.append(el('p',{class:'note'},'El truco solo funciona tal cual cuando $a$, $b$ y $c$ son todos distintos de $0$: si algún coeficiente se anula, el plano queda paralelo al eje correspondiente —o lo contiene— y no hay corte que marcar en él.'));
    sec.append(c5);
  }
});
