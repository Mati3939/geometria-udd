/* Distancias en el espacio: de un punto a una recta, entre rectas paralelas,
   entre rectas que se cruzan, de un punto a un plano y entre planos paralelos.
   Todas se miden por el mismo criterio: el largo del segmento perpendicular
   más corto entre los dos objetos. Las cuentas de cada tarjeta están
   verificadas aparte con Node antes de publicarse. */
registerModule({
  id:'distancias-espacio',
  title:'Distancias en el espacio',
  unidad:'III',
  lead:'Cuánto se separan un punto y una recta, dos rectas, un punto y un plano, o dos planos — siempre por el camino perpendicular, que es el más corto de todos.',
  build(sec){

    const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
    const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
    const norm=a=>Math.sqrt(dot(a,a));
    const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
    const add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
    const mul=(a,k)=>[a[0]*k,a[1]*k,a[2]*k];
    const unit=a=>{const m=norm(a); return [a[0]/m,a[1]/m,a[2]/m];};

    function leyenda(mount,items){
      const L=el('div',{class:'legend'});
      items.forEach(([col,txt])=>L.append(el('span',{},
        el('i',{class:'sw',style:'background:var('+col+')'}),txt)));
      mount.append(L);
    }

    /* ---------- Tarjeta 1: distancia entre dos puntos (deslizadores) ---------- */
    const c1=el('div',{class:'card'});
    c1.append(el('h3',{},'Distancia entre dos puntos'));
    c1.append(el('p',{},'La distancia entre dos puntos del espacio es el largo del segmento que los une, y se calcula igual que en el plano: con Pitágoras, ahora en dos pasos. Primero se cruza la diferencia dentro del plano $xy$; después se suma o resta la diferencia en $z$.'));

    const Qc1=[3,4,5];
    const cajaE1=el('div',{class:'plot'}); c1.append(cajaE1);
    const E1=Espacio(cajaE1,{alto:380,escala:12});
    const leerE1=lectura(c1);
    function pintarE1(E){
      const P=[0,0,0], Q=Qc1, M=[Q[0],Q[1],0];
      E.ejes3({largo:6});
      E.linea3(P,M,{color:'--s1',grosor:3});
      E.linea3(M,Q,{color:'--s2',grosor:3});
      E.linea3(P,Q,{color:'--s7',grosor:2.6});
      E.punto3(P,{color:'--muted',r:4}); E.texto3(P,'P',{color:'--muted'});
      E.punto3(M,{color:'--muted',r:3});
      E.punto3(Q,{color:'--s7',r:5}); E.texto3(Q,'Q',{color:'--s7'});
      E.texto3([(P[0]+M[0])/2,(P[1]+M[1])/2,(P[2]+M[2])/2],'d(P,M)',{color:'--s1'});
      E.texto3([(M[0]+Q[0])/2,(M[1]+Q[1])/2,(M[2]+Q[2])/2],'d(M,Q)',{color:'--s2'});
    }
    E1.dibujar(pintarE1);
    function actualizarE1(){
      E1.redibujar();
      const P=[0,0,0], Q=Qc1, M=[Q[0],Q[1],0];
      leerE1.set([
        ['Q', '('+Q[0]+', '+Q[1]+', '+Q[2]+')'],
        ['d(P, M)', norm(sub(M,P)).toFixed(2)],
        ['d(M, Q)', Math.abs(Q[2]).toFixed(2)],
        ['d(P, Q)', norm(sub(Q,P)).toFixed(2)]
      ]);
    }
    controlValor(c1,{label:'Qx',min:-6,max:6,paso:.5,valor:Qc1[0],unidad:'',
      onChange:v=>{Qc1[0]=v; actualizarE1();}});
    controlValor(c1,{label:'Qy',min:-6,max:6,paso:.5,valor:Qc1[1],unidad:'',
      onChange:v=>{Qc1[1]=v; actualizarE1();}});
    controlValor(c1,{label:'Qz',min:-12,max:12,paso:.5,valor:Qc1[2],unidad:'',
      onChange:v=>{Qc1[2]=v; actualizarE1();}});
    actualizarE1();

    leyenda(c1,[['--s1','d(P, M): diferencia en el plano xy'],['--s2','d(M, Q): diferencia en z'],['--s7','d(P, Q): distancia total']]);

    c1.append(el('p',{},'El triángulo rectángulo $P$-$M$-$Q$ tiene catetos $d(P,M)$ y $d(M,Q)$, e hipotenusa $d(P,Q)$. Aplicar Pitágoras ahí, y reemplazar $d(P,M)$ por lo que da Pitágoras dentro del plano $xy$, deja la fórmula con las tres coordenadas:'));
    c1.append(el('div',{class:'formula',html:'$$d(P_1,P_2)=\\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}$$'}));
    c1.append(el('p',{class:'note'},'Con $Q_x=3$, $Q_y=4$ y $Q_z=12$ la distancia da $13$: el mismo $5$-$12$-$13$ de siempre, ahora como la diagonal de una caja de $3\\times4\\times12$ en vez del lado de un triángulo plano.'));
    sec.append(c1);

    /* ---------- Tarjeta 2: distancia de un punto a una recta (deslizador) ---------- */
    const c2=el('div',{class:'card'});
    c2.append(el('h3',{},'Distancia de un punto a una recta'));
    c2.append(el('p',{},'El segmento perpendicular entre un punto y una recta es, otra vez, el más corto de todos los que se pueden trazar hasta la recta. El punto $M$ recorre la recta con el control; el segmento hacia $Q$ se acorta hasta calzar con el pie de la perpendicular, y ahí queda mínimo.'));

    const P0_2=[0,0,0], vDir_2=[1,1,0], Qext_2=[3,3,5];
    const P0Q_2=sub(Qext_2,P0_2);
    const cr_2=cross(vDir_2,P0Q_2);
    const dPerp_2=norm(cr_2)/norm(vDir_2);
    const tStar_2=dot(P0Q_2,vDir_2)/dot(vDir_2,vDir_2);
    const foot_2=add(P0_2,mul(vDir_2,tStar_2));
    let s_2=-1;
    const cajaE2=el('div',{class:'plot'}); c2.append(cajaE2);
    const E2=Espacio(cajaE2,{alto:380,escala:20});
    const leerE2=lectura(c2);
    function pintarE2(E){
      const M=add(P0_2,mul(vDir_2,s_2));
      E.ejes3({largo:4});
      E.linea3(add(P0_2,mul(vDir_2,-2)), add(P0_2,mul(vDir_2,5)), {color:'--grid',grosor:2});
      /* el paralelogramo que arman v y P0Q: su área es ‖v×P0Q‖ (base × altura) */
      E.superficie((u,w)=>add(P0_2, add(mul(vDir_2,u), mul(P0Q_2,w))),
        {uMin:0,uMax:1,vMin:0,vMax:1,nu:1,nv:1,color:'--s4'});
      E.linea3(foot_2,Qext_2,{color:'--s2',grosor:3});
      E.linea3(M,Qext_2,{color:'--s6',grosor:2.2,guiones:true});
      E.punto3(foot_2,{color:'--s2',r:4}); E.texto3(foot_2,'pie',{color:'--s2'});
      E.punto3(M,{color:'--s6',r:4}); E.texto3(M,'M',{color:'--s6'});
      E.punto3(Qext_2,{color:'--s7',r:5}); E.texto3(Qext_2,'Q',{color:'--s7'});
    }
    E2.dibujar(pintarE2);
    function actualizarE2(){
      E2.redibujar();
      const M=add(P0_2,mul(vDir_2,s_2));
      leerE2.set([
        ['s', s_2.toFixed(1)],
        ['d(Q, M)', norm(sub(Qext_2,M)).toFixed(2)],
        ['d(Q, recta)', dPerp_2.toFixed(2)]
      ]);
    }
    controlValor(c2,{label:'M en la recta',min:-2,max:5,paso:.1,valor:s_2,unidad:'',
      onChange:v=>{s_2=v; actualizarE2();}});
    actualizarE2();

    leyenda(c2,[['--s4','paralelogramo de v y P₀Q'],['--s2','pie de la perpendicular'],['--s6','segmento hacia M (se compara)'],['--s7','Q, el punto exterior']]);

    c2.append(el('p',{},'El área de ese paralelogramo —el módulo del producto cruz $\\vec v\\times\\overrightarrow{P_0Q}$— es base por altura: la base es $\\|\\vec v\\|$ y la altura es exactamente la distancia buscada. Despejar la altura deja la fórmula:'));
    c2.append(el('div',{class:'formula',html:'$$d(Q,r)=\\dfrac{\\left\\|\\vec v\\times\\overrightarrow{P_0Q}\\right\\|}{\\|\\vec v\\|}$$'}));
    c2.append(el('p',{class:'note'},'Con $P_0=(0,0,0)$, $\\vec v=(1,1,0)$ y $Q=(3,3,5)$: $\\overrightarrow{P_0Q}=(3,3,5)$, $\\vec v\\times\\overrightarrow{P_0Q}=(5,-5,0)$, de módulo $5\\sqrt2$, y $\\|\\vec v\\|=\\sqrt2$, así que $d=5$. El pie de la perpendicular queda en $(3,3,0)$, y el control lo confirma: ahí el segmento hacia $M$ mide lo mismo que el de $Q$ al pie.'));
    sec.append(c2);

    /* ---------- Tarjeta 3: distancia entre rectas paralelas (deslizador) ---------- */
    const c3=el('div',{class:'card'});
    c3.append(el('h3',{},'Distancia entre rectas paralelas'));
    c3.append(el('p',{},'Si dos rectas son paralelas, la separación entre ellas es la misma sin importar qué punto se use para medirla: basta tomar un punto cualquiera de una y calcular su distancia perpendicular a la otra, con la misma fórmula de la tarjeta anterior. El control mueve el punto $R$ a lo largo de la segunda recta.'));

    const P0_3=[0,0,0], vDir_3=[1,1,0], Rbase_3=[0,0,3];
    let u_3=0;
    const cajaE3=el('div',{class:'plot'}); c3.append(cajaE3);
    const E3=Espacio(cajaE3,{alto:380,escala:20});
    const leerE3=lectura(c3);
    function calcularC3(){
      const R=add(Rbase_3,mul(vDir_3,u_3));
      const P0R=sub(R,P0_3);
      const cr=cross(vDir_3,P0R);
      const d=norm(cr)/norm(vDir_3);
      const t=dot(P0R,vDir_3)/dot(vDir_3,vDir_3);
      const foot=add(P0_3,mul(vDir_3,t));
      return {R,foot,d};
    }
    function pintarE3(E){
      const {R,foot}=calcularC3();
      E.ejes3({largo:4});
      E.linea3(add(P0_3,mul(vDir_3,-3)), add(P0_3,mul(vDir_3,3)), {color:'--s1',grosor:2.4});
      E.linea3(add(Rbase_3,mul(vDir_3,-3)), add(Rbase_3,mul(vDir_3,3)), {color:'--s8',grosor:2.4});
      E.linea3(foot,R,{color:'--s2',grosor:3});
      E.punto3(foot,{color:'--s2',r:4}); E.texto3(foot,'pie',{color:'--s2'});
      E.punto3(R,{color:'--s8',r:5}); E.texto3(R,'R',{color:'--s8'});
    }
    E3.dibujar(pintarE3);
    function actualizarE3(){
      E3.redibujar();
      const {d}=calcularC3();
      leerE3.set([
        ['u (posición de R)', u_3.toFixed(1)],
        ['d(R, r1)', d.toFixed(2)]
      ]);
    }
    controlValor(c3,{label:'R sobre r2',min:-3,max:3,paso:.1,valor:u_3,unidad:'',
      onChange:v=>{u_3=v; actualizarE3();}});
    actualizarE3();

    leyenda(c3,[['--s1','r1'],['--s8','r2, paralela a r1'],['--s2','segmento perpendicular, siempre el mismo largo']]);

    c3.append(el('p',{},'La lectura no cambia al arrastrar el control: la distancia entre dos rectas paralelas es una sola, y no depende de qué punto de la segunda recta se use para medirla.'));
    c3.append(el('div',{class:'formula',html:'$$d(r_1,r_2)=d(R,r_1),\\qquad R\\ \\text{un punto cualquiera de }r_2$$'}));
    c3.append(el('p',{class:'note'},'Con $r_1$ por el origen con director $(1,1,0)$ y $r_2$ por $(0,0,3)$ con el mismo director: para cualquier punto de $r_2$ la fórmula de la tarjeta anterior da $d=3$, porque el desplazamiento entre las dos rectas, $(0,0,3)$, ya es perpendicular al director —no tiene componente a lo largo de él—.'));
    sec.append(c3);

    /* ---------- Tarjeta 4: distancia entre rectas que se cruzan (2 deslizadores) ---------- */
    const c4=el('div',{class:'card'});
    c4.append(el('h3',{},'Distancia entre dos rectas que se cruzan'));
    c4.append(el('p',{},'Dos rectas que no son paralelas y tampoco se cortan —se cruzan en el espacio sin tocarse— igual tienen una separación mínima bien definida: existe un único segmento perpendicular a las dos a la vez, y ese es el más corto de todos los que se pueden trazar entre un punto de una y un punto de la otra. Los controles mueven un punto por cada recta; conviene buscar la posición que hace mínima la lectura de abajo y comparar con el segmento fijo que marca el mínimo real.'));

    const P1_4=[0,0,0], v1_4=[1,1,0];
    const P2_4=[0,0,3], v2_4=[1,-1,1];
    const cr_4=cross(v1_4,v2_4);
    const P1P2_4=sub(P2_4,P1_4);
    const dMin_4=Math.abs(dot(P1P2_4,cr_4))/norm(cr_4);
    /* pie común, hallado por minimización directa aparte y verificado con Node */
    const foot1_4=[0,0,0], foot2_4=[-1,1,2];
    let t_4=1.5, s_4=1;
    const cajaE4=el('div',{class:'plot'}); c4.append(cajaE4);
    const E4=Espacio(cajaE4,{alto:380,escala:18});
    const leerE4=lectura(c4);
    function pintarE4(E){
      const A=add(P1_4,mul(v1_4,t_4));
      const B=add(P2_4,mul(v2_4,s_4));
      E.ejes3({largo:4});
      E.linea3(add(P1_4,mul(v1_4,-2)), add(P1_4,mul(v1_4,3)), {color:'--s1',grosor:2.4});
      E.linea3(add(P2_4,mul(v2_4,-2)), add(P2_4,mul(v2_4,3)), {color:'--s8',grosor:2.4});
      E.linea3(foot1_4,foot2_4,{color:'--s2',grosor:3});
      E.linea3(A,B,{color:'--s6',grosor:2.2,guiones:true});
      E.punto3(foot1_4,{color:'--s2',r:4});
      E.punto3(foot2_4,{color:'--s2',r:4}); E.texto3(foot2_4,'mínimo real',{color:'--s2'});
      E.punto3(A,{color:'--s6',r:4}); E.texto3(A,'A',{color:'--s6'});
      E.punto3(B,{color:'--s6',r:4}); E.texto3(B,'B',{color:'--s6'});
    }
    E4.dibujar(pintarE4);
    function actualizarE4(){
      E4.redibujar();
      const A=add(P1_4,mul(v1_4,t_4));
      const B=add(P2_4,mul(v2_4,s_4));
      leerE4.set([
        ['d(A, B)', norm(sub(B,A)).toFixed(3)],
        ['mínimo real', dMin_4.toFixed(3)]
      ]);
    }
    controlValor(c4,{label:'A sobre r1',min:-3,max:3,paso:.1,valor:t_4,unidad:'',
      onChange:v=>{t_4=v; actualizarE4();}});
    controlValor(c4,{label:'B sobre r2',min:-3,max:3,paso:.1,valor:s_4,unidad:'',
      onChange:v=>{s_4=v; actualizarE4();}});
    actualizarE4();

    leyenda(c4,[['--s1','r1'],['--s8','r2'],['--s6','A, B y el segmento entre ambos'],['--s2','el segmento mínimo, perpendicular a las dos rectas']]);

    c4.append(el('p',{},'Ninguna posición de $A$ y $B$ deja una distancia menor que la del segmento verde: es el único segmento perpendicular a las dos rectas a la vez. Su largo se calcula con el producto cruz de las dos direcciones, sin necesidad de recorrer todas las posiciones:'));
    c4.append(el('div',{class:'formula',html:'$$d(r_1,r_2)=\\dfrac{\\left\\lvert\\overrightarrow{P_1P_2}\\cdot(\\vec v_1\\times\\vec v_2)\\right\\rvert}{\\|\\vec v_1\\times\\vec v_2\\|}$$'}));
    c4.append(el('p',{class:'note'},'Con $r_1$ por el origen con $\\vec v_1=(1,1,0)$ y $r_2$ por $(0,0,3)$ con $\\vec v_2=(1,-1,1)$: $\\vec v_1\\times\\vec v_2=(1,-1,-2)$, $\\overrightarrow{P_1P_2}=(0,0,3)$, y su producto punto vale $-6$, así que $d=6/\\sqrt6=\\sqrt6\\approx2{,}45$ — el mismo valor que arroja recorrer $A$ y $B$ con los controles.'));
    sec.append(c4);

    /* ---------- Tarjeta 5: distancia de un punto a un plano (deslizador) ---------- */
    const c5=el('div',{class:'card'});
    c5.append(el('h3',{},'Distancia de un punto a un plano'));
    c5.append(el('p',{},'La distancia de un punto a un plano es, de nuevo, la del segmento perpendicular: el más corto entre el punto y cualquier punto del plano. Ese segmento es paralelo al vector normal $\\vec n=(a,b,c)$, así que se puede medir proyectando sobre él. El punto $M$ se puede desplazar dentro del plano con el control; solo coincide con el pie de la perpendicular cuando el segmento hacia $Q$ es mínimo.'));

    const n_5=[1,2,2], dPlano_5=6, Qext_5=[3,3,3];
    const nu_5=unit(n_5);
    const arb_5=Math.abs(nu_5[0])<0.9?[1,0,0]:[0,1,0];
    let e1_5=cross(nu_5,arb_5); e1_5=unit(e1_5);
    const e2_5=cross(nu_5,e1_5);
    const val_5=dot(n_5,Qext_5)-dPlano_5;
    const foot_5=sub(Qext_5, mul(n_5, val_5/dot(n_5,n_5)));
    const dPerp_5=Math.abs(val_5)/norm(n_5);
    let s_5=1.5;
    const cajaE5=el('div',{class:'plot'}); c5.append(cajaE5);
    const E5=Espacio(cajaE5,{alto:380,escala:24});
    const leerE5=lectura(c5);
    function pintarE5(E){
      const M=add(foot_5, mul(e1_5,s_5));
      E.ejes3({largo:4});
      E.superficie((u,w)=>add(foot_5, add(mul(e1_5,u), mul(e2_5,w))),
        {uMin:-2.2,uMax:2.2,vMin:-2.2,vMax:2.2,nu:5,nv:5,color:'--s1'});
      E.vector3(foot_5, mul(nu_5,2.4), {color:'--s4',etiqueta:'n'});
      E.linea3(foot_5, Qext_5, {color:'--s2',grosor:3});
      E.linea3(M, Qext_5, {color:'--s6',grosor:2.2,guiones:true});
      E.punto3(foot_5,{color:'--s2',r:4}); E.texto3(foot_5,'pie',{color:'--s2'});
      E.punto3(M,{color:'--s6',r:4}); E.texto3(M,'M',{color:'--s6'});
      E.punto3(Qext_5,{color:'--s7',r:5}); E.texto3(Qext_5,'Q',{color:'--s7'});
    }
    E5.dibujar(pintarE5);
    function actualizarE5(){
      E5.redibujar();
      const M=add(foot_5, mul(e1_5,s_5));
      leerE5.set([
        ['s', s_5.toFixed(1)],
        ['d(Q, M)', norm(sub(Qext_5,M)).toFixed(2)],
        ['d(Q, plano)', dPerp_5.toFixed(2)]
      ]);
    }
    controlValor(c5,{label:'M en el plano',min:-3,max:3,paso:.1,valor:s_5,unidad:'',
      onChange:v=>{s_5=v; actualizarE5();}});
    actualizarE5();

    leyenda(c5,[['--s1','el plano'],['--s4','n, normal al plano'],['--s2','pie de la perpendicular'],['--s6','segmento hacia M (se compara)'],['--s7','Q, el punto exterior']]);

    c5.append(el('p',{},'Escribiendo esa proyección con las coordenadas del punto y la ecuación general del plano queda:'));
    c5.append(el('div',{class:'formula',html:'$$d(P_1,\\pi)=\\dfrac{\\lvert ax_1+by_1+cz_1-d\\rvert}{\\sqrt{a^2+b^2+c^2}}$$'}));
    c5.append(el('p',{class:'note'},'Con el plano $x+2y+2z=6$ ($\\vec n=(1,2,2)$) y $Q=(3,3,3)$: $d=\\lvert3+6+6-6\\rvert/3=9/3=3$. El pie de la perpendicular queda en $(2,1,1)$, que en efecto cumple $2+2+2=6$.'));
    sec.append(c5);

    /* ---------- Tarjeta 6: distancia entre planos paralelos (deslizador) ---------- */
    const c6=el('div',{class:'card'});
    c6.append(el('h3',{},'Distancia entre planos paralelos'));
    c6.append(el('p',{},'Dos planos paralelos comparten el mismo vector normal y nunca se cortan. Igual que con las rectas paralelas, la distancia entre ambos es la de un punto cualquiera de uno de ellos al otro plano, con la fórmula de la tarjeta anterior.'));

    const n_6=n_5;                 /* mismo vector normal, plano 1 = π del punto-plano */
    const d1_6=dPlano_5;
    let d2_6=15;
    function calcularC6(){
      const P1=mul(nu_5, d1_6/norm(n_6));
      const P2=mul(nu_5, d2_6/norm(n_6));
      const distv=Math.abs(d2_6-d1_6)/norm(n_6);
      return {P1,P2,distv};
    }
    const cajaE6=el('div',{class:'plot'}); c6.append(cajaE6);
    const E6=Espacio(cajaE6,{alto:380,escala:14});
    const leerE6=lectura(c6);
    function pintarE6(E){
      const {P1,P2}=calcularC6();
      E.ejes3({largo:4});
      E.superficie((u,w)=>add(P1, add(mul(e1_5,u), mul(e2_5,w))),
        {uMin:-3,uMax:3,vMin:-3,vMax:3,nu:6,nv:6,color:'--s1'});
      E.superficie((u,w)=>add(P2, add(mul(e1_5,u), mul(e2_5,w))),
        {uMin:-3,uMax:3,vMin:-3,vMax:3,nu:6,nv:6,color:'--s8'});
      E.linea3(P1,P2,{color:'--s2',grosor:3});
      E.punto3(P1,{color:'--s1',r:4});
      E.punto3(P2,{color:'--s8',r:4});
    }
    E6.dibujar(pintarE6);
    function actualizarE6(){
      E6.redibujar();
      const {distv}=calcularC6();
      leerE6.set([
        ['d₂ (constante de π2)', d2_6.toFixed(1)],
        ['d(π1, π2)', distv.toFixed(2)]
      ]);
    }
    controlValor(c6,{label:'d₂ (plano 2)',min:6,max:18,paso:.5,valor:d2_6,unidad:'',
      onChange:v=>{d2_6=v; actualizarE6();}});
    actualizarE6();

    leyenda(c6,[['--s1','π1: x+2y+2z=6'],['--s2','segmento perpendicular entre los dos planos'],['--s8','π2, paralelo a π1']]);

    c6.append(el('div',{class:'formula',html:'$$d(\\pi_1,\\pi_2)=\\dfrac{\\lvert d_2-d_1\\rvert}{\\sqrt{a^2+b^2+c^2}},\\qquad ax+by+cz=d_1,\\ \\ ax+by+cz=d_2$$'}));
    c6.append(el('p',{class:'note'},'Los dos planos comparten $\\vec n=(1,2,2)$: solo cambia la constante del lado derecho. Con $d_1=6$ y $d_2=15$: $d=\\lvert15-6\\rvert/3=3$ — el mismo $3$ que ya dio, en la tarjeta anterior, la distancia de $Q=(3,3,3)$ al plano $\\pi_1$, porque $Q$ resulta estar sobre $\\pi_2$: $3+6+6=15$.'));
    sec.append(c6);
  }
});
