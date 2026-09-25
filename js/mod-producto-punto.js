/* Componentes cartesianas y producto punto: unitarios y canonicos, componentes de un
   vector, módulo, y el producto escalar (o producto punto) en sus dos formas
   equivalentes, el ángulo entre vectores y la perpendicularidad. */
registerModule({
  id:'producto-punto', title:'Componentes cartesianas y producto punto', unidad:'II',
  lead:'El producto punto mide cuánto apuntan dos vectores en la misma dirección — y de ahí sale el ángulo entre ellos.',
  build(sec){

    /* ---------- Tarjeta 1: canónicos y componentes cartesianas (animada) ---------- */
    const c1=el('div',{class:'card'});
    c1.append(el('h3',{},'Vectores canónicos y componentes cartesianas'));
    c1.append(el('p',{},'Los vectores canónicos son los vectores unitarios que apuntan a lo largo de cada eje: $\\hat\\imath=(1,0)$ hacia la derecha, $\\hat\\jmath=(0,1)$ hacia arriba. Cualquier otro vector del plano se arma sumando un múltiplo de cada uno.'));

    let rA=2.2;
    const leerC1=el('p',{class:'note'});
    const cajaP1=el('div',{class:'plot'}); c1.append(cajaP1);
    const P1=Plano(cajaP1,{xMin:-3.6,xMax:3.6,yMin:-3.2,yMax:3.2,alto:340,iso:true});
    P1.animar((P,t)=>{
      const th=(t/8)*2*Math.PI;
      const ax=rA*Math.cos(th), ay=rA*Math.sin(th);
      P.ejes();
      P.vector(0,0,1,0,{color:'--grid',grosor:1.6,etiqueta:'î'});
      P.vector(0,0,0,1,{color:'--grid',grosor:1.6,etiqueta:'ĵ'});
      P.parametrica(s=>[ax*s,0],0,1,{color:'--s1',grosor:3});
      P.parametrica(s=>[ax,ay*s],0,1,{color:'--s2',grosor:3});
      P.vector(0,0,ax,ay,{color:'--s7',grosor:3,etiqueta:'A'});
      P.texto(ax/2,0,'Ax',{color:'--s1',dy:16,dx:-10});
      P.texto(ax,ay/2,'Ay',{color:'--s2',dx:8});
      leerC1.textContent='θ = '+(((th*180/Math.PI)%360)).toFixed(0)+'°  ·  A = (‖A‖cos θ, ‖A‖sen θ) = ('+ax.toFixed(2)+', '+ay.toFixed(2)+') = '+ax.toFixed(2)+' î + '+ay.toFixed(2)+' ĵ';
    },{duracion:8});
    c1.append(leerC1);
    c1.append(el('div',{class:'controls'},
      el('label',{},'‖A‖:'),
      el('input',{type:'range',min:'0.8',max:'3',step:'0.1',value:String(rA),
        oninput:e=>{ rA=parseFloat(e.target.value); }})
    ));

    c1.append(el('p',{},'Las dos componentes son las proyecciones de $\\vec A$ sobre cada eje, y con un poco de trigonometría se escriben en términos de su módulo y su dirección $\\theta$:'));
    c1.append(el('div',{class:'formula',html:'$$\\vec A=A_x\\hat\\imath+A_y\\hat\\jmath,\\qquad (A_x,A_y)=(\\|\\vec A\\|\\cos\\theta,\\ \\|\\vec A\\|\\operatorname{sen}\\theta)$$'}));
    c1.append(el('p',{class:'note'},'Es la misma idea del círculo unitario de la Unidad I, solo que ahora el radio no tiene que ser 1: el deslizador cambia $\\|\\vec A\\|$ y el segmento azul y el verde —las dos componentes— se estiran o se achican junto con él.'));
    sec.append(c1);

    /* ---------- Tarjeta 2: el vector unitario (animada + deslizador) ---------- */
    const c2=el('div',{class:'card'});
    c2.append(el('h3',{},'El vector unitario: misma dirección, largo 1'));
    c2.append(el('p',{},'Un vector unitario es un vector cuya magnitud es exactamente $1$. Dado un vector $\\vec v$ no nulo, $\\hat v=\\vec v/\\|\\vec v\\|$ conserva su dirección pero fija el largo en $1$.'));

    let angC2=40;
    const leerC2=el('p',{class:'note'});
    const cajaP2=el('div',{class:'plot'}); c2.append(cajaP2);
    const P2=Plano(cajaP2,{xMin:-3.6,xMax:3.6,yMin:-3.6,yMax:3.6,alto:340,iso:true});
    P2.animar((P,t)=>{
      const mag=1.8+1.5*Math.sin(2*Math.PI*t/6);
      const th=angC2*Math.PI/180;
      const vx=mag*Math.cos(th), vy=mag*Math.sin(th);
      const ux=Math.cos(th), uy=Math.sin(th);
      P.ejes();
      P.parametrica(a=>[Math.cos(a),Math.sin(a)],0,2*Math.PI,{color:'--grid',grosor:1.4});
      P.vector(0,0,vx,vy,{color:'--s1',grosor:3,etiqueta:'v'});
      P.vector(0,0,ux,uy,{color:'--s7',grosor:2.6,etiqueta:'v̂'});
      leerC2.textContent='‖v‖ = '+mag.toFixed(2)+'  ·  v̂ = v/‖v‖ = ('+ux.toFixed(3)+', '+uy.toFixed(3)+')  ·  ‖v̂‖ = '+Math.hypot(ux,uy).toFixed(3);
    },{duracion:6});
    c2.append(leerC2);
    c2.append(el('div',{class:'controls'},
      el('label',{},'dirección de v:'),
      el('input',{type:'range',min:'0',max:'360',step:'1',value:String(angC2),
        oninput:e=>{ angC2=parseFloat(e.target.value); }})
    ));

    c2.append(el('div',{class:'formula',html:'$$\\hat v=\\dfrac{\\vec v}{\\|\\vec v\\|},\\qquad \\|\\hat v\\|=1$$'}));
    c2.append(el('p',{class:'note'},'Mientras $\\vec v$ crece y se achica, $\\hat v$ queda clavado sobre la circunferencia de radio $1$: el deslizador cambia la dirección de los dos a la vez, porque $\\hat v$ solo copia hacia dónde apunta $\\vec v$, nunca cuánto mide.'));
    sec.append(c2);

    /* ---------- Tarjeta 3: el producto punto y la proyección (animada) ---------- */
    const c3=el('div',{class:'card'});
    c3.append(el('h3',{},'El producto punto y la proyección'));
    c3.append(el('p',{},'El producto punto de $\\vec u=(u_1,u_2)$ y $\\vec v=(v_1,v_2)$ tiene dos formas equivalentes: una algebraica, con las componentes, y una geométrica, con los módulos y el ángulo entre ambos. La proyección de $\\vec v$ sobre $\\vec u$ —la sombra que $\\vec v$ deja sobre la recta de $\\vec u$— es lo que conecta las dos.'));

    let u1p=4,u2p=3,rv=5;
    const leerC3=el('p',{class:'note'});
    const cajaP3=el('div',{class:'plot'}); c3.append(cajaP3);
    const P3=Plano(cajaP3,{xMin:-8,xMax:8,yMin:-8,yMax:8,alto:380,iso:true});
    P3.animar((P,t)=>{
      const th=(t/12)*2*Math.PI;
      const vx=rv*Math.cos(th), vy=rv*Math.sin(th);
      const magU=Math.hypot(u1p,u2p);
      const dot=u1p*vx+u2p*vy;
      const angU=Math.atan2(u2p,u1p);
      let delta=th-angU;
      delta=((delta+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;
      const angDeg=Math.abs(delta)*180/Math.PI;
      const cosAng=Math.cos(delta);
      const k=dot/(magU*magU), px=k*u1p, py=k*u2p;
      const colProj=dot>0.3?'--s7':(dot<-0.3?'--s8':'--muted');
      P.ejes();
      P.parametrica(a=>[0.9*Math.cos(a),0.9*Math.sin(a)],angU,angU+delta,{color:'--s4',grosor:2.2});
      P.vector(0,0,u1p,u2p,{color:'--s1',grosor:3.2,etiqueta:'u'});
      P.vector(0,0,vx,vy,{color:'--s2',grosor:2.6,etiqueta:'v'});
      P.parametrica(s=>[px*s,py*s],0,1,{color:colProj,grosor:3.6});
      P.parametrica(s=>[vx+(px-vx)*s,vy+(py-vy)*s],0,1,{color:'--grid',grosor:1.6,guiones:true});
      P.punto(px,py,{color:colProj,r:3.5});
      leerC3.textContent='θ = '+angDeg.toFixed(0)+'°  ·  u·v = u₁v₁+u₂v₂ = '+dot.toFixed(2)+
        '  ·  ‖u‖‖v‖cos θ = '+(magU*rv*cosAng).toFixed(2)+
        (dot>0.3?'  (agudo: apuntan parecido)':(dot<-0.3?'  (obtuso: se oponen)':'  (≈ perpendiculares)'));
    },{duracion:12});
    c3.append(leerC3);
    c3.append(el('div',{class:'controls'},
      el('label',{},'u₁:'), el('input',{type:'range',min:'-5',max:'5',step:'0.5',value:String(u1p),
        oninput:e=>{u1p=parseFloat(e.target.value);}}),
      el('label',{},'u₂:'), el('input',{type:'range',min:'-5',max:'5',step:'0.5',value:String(u2p),
        oninput:e=>{u2p=parseFloat(e.target.value);}}),
      el('label',{},'‖v‖:'), el('input',{type:'range',min:'1',max:'6',step:'0.5',value:String(rv),
        oninput:e=>{rv=parseFloat(e.target.value);}})
    ));

    c3.append(el('div',{class:'formula',html:'$$\\vec u\\cdot\\vec v=u_1v_1+u_2v_2=\\|\\vec u\\|\\,\\|\\vec v\\|\\cos\\theta$$'}));
    c3.append(el('p',{class:'note'},'Las dos lecturas de arriba coinciden en todo momento porque son el mismo número calculado de dos maneras distintas. Con $\\vec u=(4,3)$ y $\\vec v=(0,5)$ —el instante en que $\\vec v$ apunta derecho hacia arriba, con los deslizadores en su posición inicial— queda $\\vec u\\cdot\\vec v=4\\cdot0+3\\cdot5=15$ y $\\|\\vec u\\|\\|\\vec v\\|\\cos\\theta=5\\cdot5\\cdot0{,}6=15$, porque el ángulo entre ambos mide $53{,}13^\\circ$.'));
    c3.append(el('p',{class:'note'},'El segmento de la proyección cambia de color con el signo del producto punto: apunta hacia adelante en $\\vec u$ cuando el ángulo es agudo, se reduce a un punto cuando son perpendiculares, y apunta hacia atrás cuando el ángulo es obtuso.'));
    sec.append(c3);

    /* ---------- Tarjeta 4: ángulo entre vectores y perpendicularidad (deslizadores) ---------- */
    const c4=el('div',{class:'card'});
    c4.append(el('h3',{},'Ángulo entre vectores y perpendicularidad'));
    c4.append(el('p',{},'De la forma geométrica del producto punto se despeja el ángulo entre dos vectores. Al mover la dirección de $\\vec v$ alrededor de $\\vec u$, conviene observar en qué momento el producto punto se acerca a cero: ahí aparece la marquita de ángulo recto.'));

    let u1q=4,u2q=3,rvq=5,angQ=306.9;
    const leerC4=el('p',{class:'note'});
    const cajaP4=el('div',{class:'plot'}); c4.append(cajaP4);
    const P4=Plano(cajaP4,{xMin:-7,xMax:7,yMin:-7,yMax:7,alto:360,iso:true});
    P4.dibujar(P=>{
      const th=angQ*Math.PI/180;
      const vx=rvq*Math.cos(th), vy=rvq*Math.sin(th);
      const magU=Math.hypot(u1q,u2q);
      const dot=u1q*vx+u2q*vy;
      const perp=Math.abs(dot)<0.25*Math.max(1,magU*rvq*0.05);
      P.ejes();
      P.vector(0,0,u1q,u2q,{color:'--s1',grosor:3.2,etiqueta:'u'});
      P.vector(0,0,vx,vy,{color:perp?'--s2':'--s7',grosor:3,etiqueta:'v'});
      if(perp && magU>1e-6 && rvq>1e-6){
        const uu=[u1q/magU,u2q/magU], vv=[vx/rvq,vy/rvq], s=0.5;
        const p0=[uu[0]*s,uu[1]*s], p1=[uu[0]*s+vv[0]*s,uu[1]*s+vv[1]*s], p2=[vv[0]*s,vv[1]*s];
        P.parametrica(k=>[p0[0]+(p1[0]-p0[0])*k,p0[1]+(p1[1]-p0[1])*k],0,1,{color:'--s2',grosor:1.6});
        P.parametrica(k=>[p1[0]+(p2[0]-p1[0])*k,p1[1]+(p2[1]-p1[1])*k],0,1,{color:'--s2',grosor:1.6});
      }
    });
    function actualizarC4(){
      const th=angQ*Math.PI/180;
      const vx=rvq*Math.cos(th), vy=rvq*Math.sin(th);
      const magU=Math.hypot(u1q,u2q);
      const dot=u1q*vx+u2q*vy;
      const perp=Math.abs(dot)<0.25*Math.max(1,magU*rvq*0.05);
      leerC4.textContent='u=('+u1q+', '+u2q+')  v=('+vx.toFixed(2)+', '+vy.toFixed(2)+')  ·  u·v = '+dot.toFixed(2)+
        (perp?'  →  u·v ≈ 0: u y v son perpendiculares':(dot>0?'  →  ángulo agudo':'  →  ángulo obtuso'));
    }
    c4.append(el('div',{class:'controls'},
      el('label',{},'u₁:'), el('input',{type:'range',min:'-5',max:'5',step:'0.5',value:String(u1q),
        oninput:e=>{u1q=parseFloat(e.target.value); P4.redibujar(); actualizarC4();}}),
      el('label',{},'u₂:'), el('input',{type:'range',min:'-5',max:'5',step:'0.5',value:String(u2q),
        oninput:e=>{u2q=parseFloat(e.target.value); P4.redibujar(); actualizarC4();}}),
      el('label',{},'‖v‖:'), el('input',{type:'range',min:'1',max:'6',step:'0.5',value:String(rvq),
        oninput:e=>{rvq=parseFloat(e.target.value); P4.redibujar(); actualizarC4();}}),
      el('label',{},'dirección de v:'), el('input',{type:'range',min:'0',max:'360',step:'1',value:String(angQ),
        oninput:e=>{angQ=parseFloat(e.target.value); P4.redibujar(); actualizarC4();}})
    ));
    c4.append(leerC4); actualizarC4();

    c4.append(el('div',{class:'formula',html:'$$\\theta=\\arccos\\!\\left(\\dfrac{\\vec u\\cdot\\vec v}{\\|\\vec u\\|\\,\\|\\vec v\\|}\\right)$$'}));
    c4.append(el('p',{},'Un caso particular de esa fórmula es el más usado de todos: cuando $\\theta=90^\\circ$, el coseno es cero, así que el producto punto también lo es. Y al revés: si el producto punto da cero, los vectores son perpendiculares.'));
    c4.append(el('div',{class:'formula',html:'$$\\vec u\\cdot\\vec v=0 \\iff \\vec u\\perp\\vec v$$'}));
    c4.append(el('p',{class:'note'},'Con $\\vec u=(4,3)$, la posición inicial de $\\vec v$ es $(3,-4)$: $\\vec u\\cdot\\vec v=4\\cdot3+3\\cdot(-4)=12-12=0$, así que arrancan perpendiculares y aparece la marca de ángulo recto.'));
    sec.append(c4);
  }
});
