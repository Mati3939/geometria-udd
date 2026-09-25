/* Relaciones entre rectas: equivalencia entre las formas de
   una misma recta y la perpendicularidad entre su director y su normal, la
   distancia de un punto a una recta, la posición relativa entre dos rectas
   (secantes, paralelas, coincidentes) y el ángulo entre rectas. Las cuentas
   de las tarjetas están verificadas aparte con Node antes de publicarse. */
registerModule({
  id:'relaciones-rectas',
  title:'Relaciones entre rectas',
  unidad:'II',
  lead:'Dos rectas en el plano se cortan o son paralelas — y cuánto se inclinan una respecto de la otra tiene fórmula.',
  build(sec){

    /* Traza una recta de borde a borde de la ventana visible, sea cual sea
       su dirección (incluida la vertical, con a=0). */
    function rectaCompleta(P,P0,v,op){
      const w=P.ventana();
      if(Math.abs(v[0])<1e-9){
        P.parametrica(s=>[P0[0], w.yMin+(w.yMax-w.yMin)*s],0,1,op);
      } else {
        const t0=(w.xMin-P0[0])/v[0], t1=(w.xMax-P0[0])/v[0];
        P.parametrica(s=>{const t=t0+(t1-t0)*s; return [P0[0]+v[0]*t, P0[1]+v[1]*t];},0,1,op);
      }
    }

    /* Marca de ángulo recto: un cuadradito pequeño entre dos direcciones
       unitarias u1,u2, apoyado en el punto O. */
    function marcaRecta(P,O,u1,u2,largo,op){
      const A=[O[0]+u1[0]*largo,O[1]+u1[1]*largo];
      const B=[O[0]+u2[0]*largo,O[1]+u2[1]*largo];
      const C=[A[0]+u2[0]*largo,A[1]+u2[1]*largo];
      P.parametrica(s=>[A[0]+(C[0]-A[0])*s,A[1]+(C[1]-A[1])*s],0,1,op);
      P.parametrica(s=>[B[0]+(C[0]-B[0])*s,B[1]+(C[1]-B[1])*s],0,1,op);
    }

    const num=n=>(n<0?'−'+(-n):String(n));

    function leyenda(mount,items){
      const L=el('div',{class:'legend'});
      items.forEach(([col,txt])=>L.append(el('span',{},
        el('i',{class:'sw',style:'background:var('+col+')'}),txt)));
      mount.append(L);
    }

    /* ---------- Tarjeta 1: de la vectorial a la general, y el director ⟂ normal ---------- */
    const c1=el('div',{class:'card'});
    c1.append(el('h3',{},'De la vectorial a la general: la misma recta, cinco formas'));
    c1.append(el('p',{},'Al despejar $y$ en la ecuación simétrica se llega a la forma principal, $y=mx+n$; al igualar esa expresión a cero se llega a la forma general, $Ax+By+C=0$. Las cinco escrituras describen la misma recta. Además, el vector director $(a,b)$ y el vector normal $(A,B)$ de la forma general son siempre perpendiculares entre sí, sin importar en qué punto de la recta se dibujen.'));

    const P0G1=[1,2], vG1=[2,3], nG1=[3,-2];   /* v·n = 0, verificado aparte */
    let sG1=0;
    const cajaP1=el('div',{class:'plot'}); c1.append(cajaP1);
    const P1=Plano(cajaP1,{xMin:-4,xMax:7,yMin:-4,yMax:9,alto:360,iso:true});
    function pintarC1(P){
      const O=[P0G1[0]+vG1[0]*sG1, P0G1[1]+vG1[1]*sG1];
      const esq=[O[0]+vG1[0],O[1]];
      P.ejes();
      rectaCompleta(P,P0G1,vG1,{color:'--grid',grosor:1.6});
      /* los dos catetos del director: horizontal = a, vertical = b */
      P.parametrica(s=>[O[0]+vG1[0]*s,O[1]],0,1,{color:'--s1',grosor:3});
      P.parametrica(s=>[esq[0],O[1]+vG1[1]*s],0,1,{color:'--s2',grosor:3});
      P.vector(O[0],O[1],O[0]+vG1[0],O[1]+vG1[1],{color:'--s4',grosor:2.4});
      P.vector(O[0],O[1],O[0]+nG1[0],O[1]+nG1[1],{color:'--s6',grosor:2.4});
      const magV=Math.hypot(vG1[0],vG1[1]), magN=Math.hypot(nG1[0],nG1[1]);
      const uV=[vG1[0]/magV,vG1[1]/magV], uN=[nG1[0]/magN,nG1[1]/magN];
      marcaRecta(P,O,uV,uN,0.32,{color:'--s7',grosor:2});
      /* «a» va arriba del cateto horizontal (no abajo): abajo pasa el
         vector normal n, y ahí chocarían las dos etiquetas. */
      P.texto(O[0]+vG1[0]*0.35,O[1],'a = '+num(vG1[0]),{color:'--s1',dx:-8,dy:-10});
      P.texto(esq[0],O[1]+vG1[1]/2,'b = '+num(vG1[1]),{color:'--s2',dx:9,dy:4});
      /* la etiqueta de v se aleja del triángulo (a,b), hacia el lado opuesto
         a la esquina, igual que en el módulo de la recta */
      const cornerCross=-vG1[1]*vG1[0];
      const perp=cornerCross>0?[vG1[1],-vG1[0]]:[-vG1[1],vG1[0]];
      const magPerp=Math.hypot(perp[0],perp[1])||1;
      const mv=[O[0]+vG1[0]*0.5+1.1*perp[0]/magPerp, O[1]+vG1[1]*0.5+1.1*perp[1]/magPerp];
      P.texto(mv[0],mv[1],'v = ('+num(vG1[0])+', '+num(vG1[1])+')',{color:'--s4',dx:-48,dy:4});
      P.texto(O[0]+nG1[0]*0.85,O[1]+nG1[1]*0.85,'n = ('+num(nG1[0])+', '+num(nG1[1])+')',{color:'--s6',dx:6,dy:-6});
      P.punto(O[0],O[1],{color:'--s7',r:4});
      P.texto(O[0],O[1],'O',{color:'--s7',dx:-18,dy:-10});
    }
    P1.dibujar(pintarC1);
    const leerC1=lectura(c1);
    function actualizarC1(){
      P1.redibujar();
      const dot=vG1[0]*nG1[0]+vG1[1]*nG1[1];
      leerC1.set([
        ['v (director)', '('+vG1[0]+', '+vG1[1]+')'],
        ['n (normal)', '('+nG1[0]+', '+nG1[1]+')'],
        ['v · n', dot.toFixed(2)]
      ]);
    }
    controlValor(c1,{label:'O en la recta',min:-1,max:1,paso:0.05,valor:sG1,unidad:'',
      onChange:v=>{ sG1=v; actualizarC1(); }});
    actualizarC1();

    leyenda(c1,[['--s4','v = (a, b), director'],['--s1','a (avance en x)'],['--s2','b (avance en y)'],['--s6','n = (A, B), normal'],['--s7','O y el ángulo recto']]);

    c1.append(el('p',{},'Recta de ejemplo, por $P_0(1,2)$ con director $\\vec v=(2,3)$:'));
    c1.append(el('div',{class:'formula',html:'$$(x,y)=(1,2)+t(2,3) \\qquad \\begin{cases}x=1+2t\\\\y=2+3t\\end{cases}$$'}));
    c1.append(el('div',{class:'formula',html:'$$\\dfrac{x-1}{2}=\\dfrac{y-2}{3} \\qquad y=1{,}5x+0{,}5 \\qquad 3x-2y+1=0$$'}));
    c1.append(el('p',{class:'note'},'Ojo con las letras, porque es la confusión más frecuente del tema: en la forma general $Ax+By+C=0$, $A$ y $B$ mayúsculas nombran las componentes del vector normal —naranjo en el dibujo—; en las formas vectorial, paramétrica y simétrica, $a$ y $b$ minúsculas nombran las del vector director —los catetos azul y verde—. Son dos parejas de números distintas, aunque relacionadas: el normal $(A,B)=(3,-2)$ sale de girar el director $(a,b)=(2,3)$ en $90°$, ya que la pareja $(-b,a)$ —o su opuesta— siempre cumple $aA+bB=0$.'));
    sec.append(c1);

    /* ---------- Tarjeta 2: distancia de un punto a una recta ---------- */
    const c2=el('div',{class:'card'});
    c2.append(el('h3',{},'Distancia de un punto a una recta'));
    c2.append(el('p',{},'La distancia de un punto a una recta es la del segmento perpendicular que los une: cualquier otro segmento hacia la recta es más largo. Un punto $P$ recorre una órbita alrededor de la recta y el pie de la perpendicular lo sigue; un segundo punto $Q$, controlado por el siguiente control, se puede ubicar en cualquier lugar de la recta para comparar su distancia a $P$ con la distancia perpendicular.'));

    const P0G2=[3,-2], vG2=[3,1];   /* recta r */
    const centroC2=[6,-1], R2=3.5;  /* centro sobre la recta: (6,-1) = P0+1·v */
    let qG2=0.5;
    const leerC2=lectura(c2);
    const cajaP2=el('div',{class:'plot'}); c2.append(cajaP2);
    const P2=Plano(cajaP2,{xMin:-1,xMax:13,yMin:-6,yMax:4,alto:380,iso:true});
    P2.animar((P,t)=>{
      const th=2*Math.PI*t/10;
      const Px=centroC2[0]+R2*Math.cos(th), Py=centroC2[1]+R2*Math.sin(th);
      const tStar=((Px-P0G2[0])*vG2[0]+(Py-P0G2[1])*vG2[1])/(vG2[0]*vG2[0]+vG2[1]*vG2[1]);
      const Fx=P0G2[0]+vG2[0]*tStar, Fy=P0G2[1]+vG2[1]*tStar;
      const dPerp=Math.hypot(Px-Fx,Py-Fy);
      const Qx=P0G2[0]+vG2[0]*qG2, Qy=P0G2[1]+vG2[1]*qG2;
      const dQ=Math.hypot(Px-Qx,Py-Qy);
      P.ejes();
      rectaCompleta(P,P0G2,vG2,{color:'--grid',grosor:1.6});
      P.parametrica(s=>[Px+(Qx-Px)*s,Py+(Qy-Py)*s],0,1,{color:'--s6',grosor:2,guiones:true});
      P.parametrica(s=>[Px+(Fx-Px)*s,Py+(Fy-Py)*s],0,1,{color:'--s2',grosor:3});
      P.punto(Fx,Fy,{color:'--s2',r:4,etiqueta:'pie'});
      P.punto(Qx,Qy,{color:'--s6',r:4,etiqueta:'Q'});
      P.punto(Px,Py,{color:'--s7',r:5,etiqueta:'P'});
      const igual=Math.abs(dQ-dPerp)<0.03;
      leerC2.set([
        ['d(P, recta)', dPerp.toFixed(2)],
        ['d(P, Q)', dQ.toFixed(2)+(igual?' (= pie)':'')]
      ]);
    },{duracion:10});
    controlValor(c2,{label:'Q sobre la recta',min:-1,max:3,paso:0.1,valor:qG2,unidad:'',
      onChange:v=>{ qG2=v; }});

    c2.append(el('p',{class:'note'},'Cuando $Q$ coincide con el pie de la perpendicular, el segmento verde y el segmento naranjo miden lo mismo; en cualquier otra posición, el segmento naranjo es más largo. Ese es el motivo por el que la distancia de un punto a una recta se mide siempre en perpendicular.'));
    c2.append(el('div',{class:'formula',html:'$$d(P_1,r)=\\dfrac{\\lvert(x_1-x_0)b-(y_1-y_0)a\\rvert}{\\sqrt{a^2+b^2}}$$'}));
    c2.append(el('p',{class:'note'},'Los $a$ y $b$ de la fórmula son las mismas componentes del director $\\vec v=(3,1)$ de esta recta —el mismo par de catetos azul y verde de la primera tarjeta—, no dos números nuevos. Con $P_0=(3,-2)$, $\\vec v=(3,1)$ y $P_1=(0,0)$ la fórmula da $d=9\\sqrt{10}/10\\approx2{,}85$.'));
    sec.append(c2);

    /* ---------- Tarjeta 3: posición relativa entre rectas ---------- */
    const c3=el('div',{class:'card'});
    c3.append(el('h3',{},'Posición relativa entre rectas'));
    c3.append(el('p',{},'Dos rectas del plano solo pueden estar en tres situaciones entre sí: si sus directores no son múltiplos entre sí, se cruzan en un único punto (secantes); si los directores son múltiplos pero pasan por puntos distintos, nunca se tocan (paralelas); y si además pasan por el mismo punto, son la misma recta (coincidentes). La animación siguiente traslada y gira una recta hasta hacerla coincidir con la otra, pasando por las tres situaciones.'));

    const P1G3=[0,-1], v1G3=[2,1];
    function interseccionG3(P1,v1,P2,v2){
      const det=v2[0]*v1[1]-v1[0]*v2[1];
      if(Math.abs(det)<1e-6) return null;
      const t1=((P2[0]-P1[0])*(-v2[1])-(P2[1]-P1[1])*(-v2[0]))/det;
      return [P1[0]+v1[0]*t1, P1[1]+v1[1]*t1];
    }
    const leerC3=lectura(c3);
    const cajaP3=el('div',{class:'plot'}); c3.append(cajaP3);
    const P3=Plano(cajaP3,{xMin:-6,xMax:8,yMin:-6,yMax:6,alto:380,iso:true});
    P3.animar((P,t)=>{
      const D=10, trian=1-Math.abs(1-2*(t/D));
      const angOff=(40*Math.PI/180)*Math.pow(1-trian,5);
      const g=2.5*(1-trian);
      const ang1=Math.atan2(v1G3[1],v1G3[0]);
      const ang2=ang1+angOff;
      const v2=[Math.cos(ang2),Math.sin(ang2)];
      const perp1=[-Math.sin(ang1),Math.cos(ang1)];
      const P2=[P1G3[0]+g*perp1[0], P1G3[1]+g*perp1[1]];
      const angDeg=angOff*180/Math.PI;
      P.ejes();
      rectaCompleta(P,P1G3,v1G3,{color:'--s1',grosor:2.4});
      rectaCompleta(P,P2,v2,{color:'--s6',grosor:2.4});
      let estado;
      if(angDeg>1.5){
        const pt=interseccionG3(P1G3,v1G3,P2,v2);
        if(pt) P.punto(pt[0],pt[1],{color:'--s7',r:5});
        estado='secantes';
      } else if(g>0.06){
        estado='paralelas';
      } else {
        estado='coincidentes';
      }
      leerC3.set([
        ['estado', estado],
        ['ángulo', angDeg.toFixed(1)+'°'],
        ['desplaz.', g.toFixed(2)]
      ]);
    },{duracion:10});

    c3.append(el('p',{class:'note'},'Las rectas son paralelas cuando $\\vec v=k\\vec u$ para algún $k$ real, y perpendiculares cuando $\\vec v\\cdot\\vec u=0$.'));
    c3.append(el('div',{class:'formula',html:'$$r_1\\parallel r_2 \\iff \\vec v=k\\vec u \\qquad\\qquad r_1\\perp r_2 \\iff \\vec v\\cdot\\vec u=0$$'}));
    sec.append(c3);

    /* ---------- Tarjeta 4: ángulo entre rectas ---------- */
    const c4=el('div',{class:'card'});
    c4.append(el('h3',{},'Ángulo entre rectas'));
    c4.append(el('p',{},'Dos rectas con pendientes $m_1$ y $m_2$ forman, en su punto de cruce, dos pares de ángulos opuestos: uno agudo y uno obtuso — o los cuatro rectos, si son perpendiculares. Por convención se reporta el agudo, y por eso la fórmula lleva valor absoluto. Los siguientes controles cambian $m_1$ y $m_2$; el arco marca el ángulo agudo medido directamente en el dibujo, y la lectura de abajo lo compara con lo que da la fórmula.'));

    let m1G4=1, m2G4=-2;
    const leerC4=lectura(c4);
    const cajaP4=el('div',{class:'plot'}); c4.append(cajaP4);
    const P4=Plano(cajaP4,{xMin:-3.2,xMax:3.2,yMin:-3.2,yMax:3.2,alto:360,iso:true});
    function pintarC4(P){
      P.ejes();
      P.curva(x=>m1G4*x,{color:'--s1',grosor:2.4});
      P.curva(x=>m2G4*x,{color:'--s6',grosor:2.4});
      const ang1=Math.atan2(m1G4,1);
      const ang2=Math.atan2(m2G4,1);
      let diff=Math.atan2(Math.sin(ang2-ang1),Math.cos(ang2-ang1));
      if(Math.abs(diff)>Math.PI/2){ diff = diff>0 ? diff-Math.PI : diff+Math.PI; }
      const perpendicular=Math.abs(1+m1G4*m2G4)<0.03;
      const dir2=ang1+diff;
      P.vector(0,0,1.3*Math.cos(ang1),1.3*Math.sin(ang1),{color:'--s1',grosor:2,etiqueta:'d1'});
      P.vector(0,0,1.3*Math.cos(dir2),1.3*Math.sin(dir2),{color:'--s6',grosor:2,etiqueta:'d2'});
      if(perpendicular){
        const u1=[Math.cos(ang1),Math.sin(ang1)], u2=[Math.cos(dir2),Math.sin(dir2)];
        marcaRecta(P,[0,0],u1,u2,0.28,{color:'--s4',grosor:2.2});
      } else {
        P.parametrica(a=>[0.9*Math.cos(a),0.9*Math.sin(a)], ang1, dir2, {color:'--s4',grosor:2.4});
      }
      P.punto(0,0,{color:'--muted',r:3});
    }
    P4.dibujar(pintarC4);
    function actualizarC4(){
      P4.redibujar();
      const ang1=Math.atan2(m1G4,1), ang2=Math.atan2(m2G4,1);
      let diff=Math.atan2(Math.sin(ang2-ang1),Math.cos(ang2-ang1));
      if(Math.abs(diff)>Math.PI/2){ diff = diff>0 ? diff-Math.PI : diff+Math.PI; }
      const medidoDeg=Math.abs(diff)*180/Math.PI;
      const denom=1+m1G4*m2G4;
      let angFormula;
      if(Math.abs(denom)<0.03){
        angFormula='90°';
      } else {
        const tanTheta=Math.abs((m2G4-m1G4)/denom);
        angFormula=(Math.atan(tanTheta)*180/Math.PI).toFixed(1)+'°';
      }
      leerC4.set([
        ['m1', m1G4.toFixed(2)],
        ['m2', m2G4.toFixed(2)],
        ['θ (dibujo)', medidoDeg.toFixed(1)+'°'],
        ['θ (fórmula)', angFormula]
      ]);
    }
    controlValor(c4,{label:'m1',min:-4,max:4,paso:0.1,valor:m1G4,unidad:'',
      onChange:v=>{ m1G4=v; actualizarC4(); }});
    controlValor(c4,{label:'m2',min:-4,max:4,paso:0.1,valor:m2G4,unidad:'',
      onChange:v=>{ m2G4=v; actualizarC4(); }});
    actualizarC4();

    c4.append(el('p',{class:'note'},'Al elegir para la segunda recta el vector director opuesto, $-\\vec u$ en vez de $\\vec u$, el ángulo que se mide entre vectores pasa a ser el obtuso: la recta es la misma, pero el vector apunta hacia el otro lado. La fórmula con pendientes evita esa ambigüedad tomando siempre el valor absoluto.'));
    c4.append(el('div',{class:'formula',html:'$$\\tan\\theta=\\left\\lvert\\dfrac{m_2-m_1}{1+m_1m_2}\\right\\rvert$$'}));
    c4.append(el('p',{class:'note'},'Cuando $1+m_1m_2=0$ la fracción se indefine — no porque el ángulo no exista, sino porque en ese caso las rectas son perpendiculares y el ángulo mide exactamente $90°$.'));
    sec.append(c4);
  }
});
