/* Coordenadas cartesianas en el espacio, vectores en R^3 (definición, suma,
   resta, producto por escalar, norma) y el producto cruz: definición por
   determinante, perpendicularidad, regla de la mano derecha y su norma como
   área del paralelogramo. Primer tema de este repo que usa la primitiva
   Espacio (wireframe 3D que se gira arrastrando). */
registerModule({
  id:'vectores-espacio', title:'Vectores en el espacio', unidad:'III',
  lead:'Todo lo del plano, más una tercera coordenada — y un producto nuevo que solo existe acá.',
  build(sec){

    function leyenda(mount,items){
      const L=el('div',{class:'legend'});
      items.forEach(([col,txt])=>L.append(el('span',{},
        el('i',{class:'sw',style:'background:var('+col+')'}),txt)));
      mount.append(L);
    }
    const num=n=>{ const r=Math.round(n*100)/100; return (r<0?'−'+(-r):String(r)); };
    const cruz=(a,b)=>[a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
    const norma=a=>Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]);
    const puntoP=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];

    /* ---------- Tarjeta 1: coordenadas cartesianas y la "caja" (deslizadores) ---------- */
    const c1=el('div',{class:'card'});
    c1.append(el('h3',{},'Coordenadas cartesianas en el espacio'));
    c1.append(el('p',{},'Un punto $P(x_0,y_0,z_0)$ queda determinado por tres distancias con signo, una por cada eje. Al levantar una caja rectangular desde el origen hasta $P$, sus tres aristas que salen del origen miden exactamente $x_0$, $y_0$ y $z_0$, y las caras de la caja son las proyecciones de $P$ sobre cada uno de los tres planos coordenados.'));

    let x0=2, y0=1.5, z0=2;
    const cajaP1=el('div',{class:'plot'}); c1.append(cajaP1);
    const P1=Espacio(cajaP1,{alto:380,escala:38,theta:0.7,phi:0.35,rotable:true});
    function dibujarC1(E){
      E.ejes3({largo:4});
      /* las tres aristas desde el origen: proyecciones sobre cada eje */
      E.linea3([0,0,0],[x0,0,0],{color:'--s1',grosor:3});
      E.linea3([0,0,0],[0,y0,0],{color:'--s2',grosor:3});
      E.linea3([0,0,0],[0,0,z0],{color:'--s4',grosor:3});
      /* el resto de la caja: las tres proyecciones sobre los planos coordenados */
      E.linea3([x0,0,0],[x0,y0,0],{color:'--grid',grosor:1.4,guiones:true});
      E.linea3([0,y0,0],[x0,y0,0],{color:'--grid',grosor:1.4,guiones:true});
      E.linea3([x0,0,0],[x0,0,z0],{color:'--grid',grosor:1.4,guiones:true});
      E.linea3([0,0,z0],[x0,0,z0],{color:'--grid',grosor:1.4,guiones:true});
      E.linea3([0,y0,0],[0,y0,z0],{color:'--grid',grosor:1.4,guiones:true});
      E.linea3([0,0,z0],[0,y0,z0],{color:'--grid',grosor:1.4,guiones:true});
      E.linea3([x0,y0,0],[x0,y0,z0],{color:'--grid',grosor:1.4,guiones:true});
      E.linea3([x0,0,z0],[x0,y0,z0],{color:'--grid',grosor:1.4,guiones:true});
      E.linea3([0,y0,z0],[x0,y0,z0],{color:'--grid',grosor:1.4,guiones:true});
      E.vector3([0,0,0],[x0,y0,z0],{color:'--s7',grosor:2.6,etiqueta:'P'});
      /* el rótulo va a mitad de camino de cada arista, no en la punta: ahí se
         cruzaría con la etiqueta del eje cuando el deslizador llega al máximo */
      E.texto3([x0/2,0,0],'x₀ = '+num(x0),{color:'--s1'});
      E.texto3([0,y0/2,0],'y₀ = '+num(y0),{color:'--s2'});
      E.texto3([0,0,z0/2],'z₀ = '+num(z0),{color:'--s4'});
    }
    P1.dibujar(dibujarC1);
    const leerC1=lectura(c1);
    function actualizarC1(){
      leerC1.set([
        ['x₀', num(x0)], ['y₀', num(y0)], ['z₀', num(z0)],
        ['distancia OP', norma([x0,y0,z0]).toFixed(3)]
      ]);
    }
    controlValor(c1,{label:'x₀',min:-3,max:3,paso:0.5,valor:x0,unidad:'',
      onChange:v=>{x0=v; P1.redibujar(); actualizarC1();}});
    controlValor(c1,{label:'y₀',min:-3,max:3,paso:0.5,valor:y0,unidad:'',
      onChange:v=>{y0=v; P1.redibujar(); actualizarC1();}});
    controlValor(c1,{label:'z₀',min:-3,max:3,paso:0.5,valor:z0,unidad:'',
      onChange:v=>{z0=v; P1.redibujar(); actualizarC1();}});
    actualizarC1();

    leyenda(c1,[['--s1','x₀ (eje x)'],['--s2','y₀ (eje y)'],['--s4','z₀ (eje z)'],
      ['--s7','P (diagonal de la caja)'],['--grid','caja (proyecciones sobre los planos)']]);

    c1.append(el('p',{class:'note'},'La figura se gira arrastrando con el mouse o el dedo, para ver la caja desde otro ángulo.'));
    c1.append(el('p',{},'La diagonal de la caja —el segmento violeta, desde el origen hasta $P$— se arma con dos aplicaciones de Pitágoras: primero la diagonal de la base, $\\sqrt{x_0^2+y_0^2}$, y después la hipotenusa del triángulo que esa diagonal forma con la arista vertical $z_0$. El resultado es la distancia de $P$ al origen:'));
    c1.append(el('div',{class:'formula',html:'$$\\overline{OP}=\\sqrt{x_0^2+y_0^2+z_0^2}$$'}));
    c1.append(el('p',{class:'note'},'Con $x_0=2$, $y_0=1{,}5$ y $z_0=2$ —los valores iniciales de los controles— la caja tiene diagonal $\\sqrt{4+2{,}25+4}=\\sqrt{10{,}25}\\approx3{,}202$, el número que marca el contador de arriba.'));
    sec.append(c1);

    /* ---------- Tarjeta 2: vectores en el espacio (animada) ---------- */
    const c2=el('div',{class:'card'});
    c2.append(el('h3',{},'Vectores en el espacio: componentes y traslación'));
    c2.append(el('p',{},'Un vector en el espacio guarda tres componentes, $\\vec v=(v_1,v_2,v_3)$, y sigue sin importarle desde qué punto se dibuje: es un desplazamiento, no una posición. Al recorrer los cuatro puntos de partida se observa la misma flecha, idéntica en largo y dirección.'));

    function suavizar(x){ return x*x*(3-2*x); }
    const ANCLAS3=[[-2,-1,-1],[0,0,0],[1.4,1,1.2],[-1,1.4,-0.8]];
    const VD3=[2,1,1.3];
    const nA3=ANCLAS3.length, tGlide3=1.1, tPausa3=0.9, tSeg3=tGlide3+tPausa3;
    const cajaP2=el('div',{class:'plot'}); c2.append(cajaP2);
    const P2=Espacio(cajaP2,{alto:360,escala:44,theta:0.7,phi:0.35,rotable:true});
    const leerC2=lectura(c2);
    P2.animar((E,t)=>{
      const i=Math.floor(t/tSeg3)%nA3, j=(i+1)%nA3, tl=t%tSeg3;
      const s=tl<tGlide3?suavizar(tl/tGlide3):1;
      const A=ANCLAS3[i], B=ANCLAS3[j];
      const ax=A[0]+(B[0]-A[0])*s, ay=A[1]+(B[1]-A[1])*s, az=A[2]+(B[2]-A[2])*s;
      E.ejes3({largo:3});
      ANCLAS3.forEach(p=>E.punto3(p,{color:'--grid',r:3}));
      E.punto3([ax,ay,az],{color:'--s4',r:4});
      E.vector3([ax,ay,az],VD3,{color:'--s7',grosor:3,etiqueta:'v'});
      leerC2.set([
        ['partida', '('+ax.toFixed(1)+', '+ay.toFixed(1)+', '+az.toFixed(1)+')'],
        ['v', '('+VD3[0]+', '+VD3[1]+', '+VD3[2]+')']
      ]);
    },{duracion:nA3*tSeg3});

    leyenda(c2,[['--grid','puntos de partida posibles'],['--s7','v (la misma flecha)']]);

    c2.append(el('p',{},'Los cuatro puntos grises son puntos de partida distintos y en los cuatro la flecha es la misma. Con eso, un vector en el espacio se anota:'));
    c2.append(el('div',{class:'formula',html:'$$\\vec v=(v_1,v_2,v_3),\\qquad \\mathbb{R}^3=\\{(v_1,v_2,v_3)\\mid v_1,v_2,v_3\\in\\mathbb{R}\\}$$'}));
    c2.append(el('p',{class:'note'},'Igual que en el plano, lo único que define a $\\vec v$ son sus tres componentes — no el punto en que está dibujado.'));
    sec.append(c2);

    /* ---------- Tarjeta 3: suma y resta (animada, con deslizadores) ---------- */
    const c3=el('div',{class:'card'});
    c3.append(el('h3',{},'Suma y resta de vectores'));
    c3.append(el('p',{},'Sumar $\\vec u$ y $\\vec v$ sigue siendo encadenar desplazamientos: $\\vec v$ se traslada hasta la punta de $\\vec u$ y la flecha que cierra el recorrido, desde el origen, es $\\vec u+\\vec v$. La resta usa la misma idea con $-\\vec v$, el mismo vector apuntando al revés.'));

    let u1=2,u2=1,u3=1, v1=1,v2=-1,v3=1.5;
    const cajaP3=el('div',{class:'plot'}); c3.append(cajaP3);
    const P3=Espacio(cajaP3,{alto:380,escala:40,theta:0.7,phi:0.35,rotable:true});
    const leerC3=lectura(c3);
    P3.animar((E,t)=>{
      const u=[u1,u2,u3], v=[v1,v2,v3];
      E.ejes3({largo:3.6});
      E.vector3([0,0,0],u,{color:'--s1',grosor:3,etiqueta:'u'});
      if(t<3){
        E.vector3([0,0,0],v,{color:'--s2',grosor:2.6,etiqueta:'v'});
      }
      if(t>=3){
        E.linea3(u,[u[0]+v[0],u[1]+v[1],u[2]+v[2]],{color:'--s2',grosor:2,guiones:true});
        E.vector3([0,0,0],[u[0]+v[0],u[1]+v[1],u[2]+v[2]],{color:'--s7',grosor:3.2,etiqueta:'u+v'});
      }
      if(t>=5){
        E.linea3(u,[u[0]-v[0],u[1]-v[1],u[2]-v[2]],{color:'--s8',grosor:2,guiones:true});
      }
      if(t>=7){
        E.vector3([0,0,0],[u[0]-v[0],u[1]-v[1],u[2]-v[2]],{color:'--s6',grosor:3,etiqueta:'u−v'});
      }
      leerC3.set([
        ['u', '('+u1+', '+u2+', '+u3+')'],
        ['v', '('+v1+', '+v2+', '+v3+')'],
        ['u + v', '('+(u1+v1)+', '+(u2+v2)+', '+(u3+v3)+')'],
        ['u − v', '('+(u1-v1)+', '+(u2-v2)+', '+(u3-v3)+')']
      ]);
    },{duracion:9});

    controlValor(c3,{label:'u₁',min:-3,max:3,paso:0.5,valor:u1,unidad:'',onChange:v=>{u1=v;}});
    controlValor(c3,{label:'u₂',min:-3,max:3,paso:0.5,valor:u2,unidad:'',onChange:v=>{u2=v;}});
    controlValor(c3,{label:'u₃',min:-3,max:3,paso:0.5,valor:u3,unidad:'',onChange:v=>{u3=v;}});
    controlValor(c3,{label:'v₁',min:-3,max:3,paso:0.5,valor:v1,unidad:'',onChange:v=>{v1=v;}});
    controlValor(c3,{label:'v₂',min:-3,max:3,paso:0.5,valor:v2,unidad:'',onChange:v=>{v2=v;}});
    controlValor(c3,{label:'v₃',min:-3,max:3,paso:0.5,valor:v3,unidad:'',onChange:v=>{v3=v;}});

    leyenda(c3,[['--s1','u'],['--s2','v'],['--s7','u + v'],['--s6','u − v']]);

    c3.append(el('div',{class:'formula',html:'$$\\vec u+\\vec v=(u_1+v_1,\\ u_2+v_2,\\ u_3+v_3)$$'}));
    c3.append(el('p',{class:'note'},'Restar es sumar el opuesto: $\\vec u-\\vec v=\\vec u+(-\\vec v)$, componente a componente.'));
    c3.append(el('div',{class:'formula',html:'$$\\vec u-\\vec v=(u_1-v_1,\\ u_2-v_2,\\ u_3-v_3)$$'}));
    sec.append(c3);

    /* ---------- Tarjeta 4: producto por un escalar y norma (deslizador) ---------- */
    const c4=el('div',{class:'card'});
    c4.append(el('h3',{},'Producto por un escalar y norma'));
    c4.append(el('p',{},'Multiplicar $\\vec v$ por $\\lambda\\in\\mathbb{R}$ escala cada componente y, con eso, el largo completo del vector por $|\\lambda|$. Si $\\lambda$ es negativo el vector invierte su sentido, igual que en el plano.'));

    let lam=1.5; const vFijo3=[2,1,1.5];
    const cajaP4=el('div',{class:'plot'}); c4.append(cajaP4);
    const P4=Espacio(cajaP4,{alto:360,escala:34,theta:0.7,phi:0.35,rotable:true});
    P4.dibujar(E=>{
      E.ejes3({largo:3.4});
      E.vector3([0,0,0],vFijo3,{color:'--s1',grosor:2.6,etiqueta:'v'});
      const lv=[lam*vFijo3[0],lam*vFijo3[1],lam*vFijo3[2]];
      if(Math.abs(lam)>1e-6){
        E.vector3([0,0,0],lv,{color:lam<0?'--s8':'--s7',grosor:3.2,etiqueta:'λv'});
      } else {
        E.punto3([0,0,0],{color:'--muted',r:5});
      }
    });
    const leerC4=lectura(c4);
    function actualizarC4(){
      P4.redibujar();
      const lv=[lam*vFijo3[0],lam*vFijo3[1],lam*vFijo3[2]];
      const magV=norma(vFijo3);
      let sentido='mismo que v';
      if(lam<0) sentido='opuesto a v'; else if(Math.abs(lam)<1e-6) sentido='nulo';
      leerC4.set([
        ['λ', lam.toFixed(1)],
        ['λv', '('+lv[0].toFixed(2)+', '+lv[1].toFixed(2)+', '+lv[2].toFixed(2)+')'],
        ['‖v‖', magV.toFixed(3)],
        ['‖λv‖', Math.abs(lam*magV).toFixed(3)],
        ['sentido', sentido]
      ]);
    }
    controlValor(c4,{label:'λ',min:-2,max:2,paso:0.1,valor:lam,unidad:'',
      onChange:v=>{ lam=v; actualizarC4(); }});
    actualizarC4();

    leyenda(c4,[['--s1','v'],['--s7','λv (λ > 0)'],['--s8','λv (λ < 0)']]);

    c4.append(el('div',{class:'formula',html:'$$\\lambda\\vec v=(\\lambda v_1,\\ \\lambda v_2,\\ \\lambda v_3),\\qquad \\|\\lambda\\vec v\\|=|\\lambda|\\,\\|\\vec v\\|$$'}));
    c4.append(el('p',{class:'note'},'La norma de cualquier vector del espacio es la misma diagonal de la caja de la primera tarjeta, aplicada a sus componentes:'));
    c4.append(el('div',{class:'formula',html:'$$\\|\\vec v\\|=\\sqrt{v_1^2+v_2^2+v_3^2}$$'}));
    c4.append(el('p',{class:'note'},'Con $\\vec v=(2,1,1{,}5)$, $\\|\\vec v\\|=\\sqrt{4+1+2{,}25}=\\sqrt{7{,}25}\\approx2{,}693$. Con $\\lambda=-1$ el vector no cambia de largo, solo de sentido, y con $\\lambda=0$ colapsa al vector nulo.'));
    sec.append(c4);

    /* ---------- Tarjeta 5: producto cruz (deslizadores + botón de orden) ---------- */
    const c5=el('div',{class:'card'});
    c5.append(el('h3',{},'Producto cruz: perpendicularidad, orden y área'));
    c5.append(el('p',{},'El producto cruz $\\vec u\\times\\vec v$ es, a diferencia del producto punto, otro ',el('b',{},'vector'),' — y uno con dos propiedades que no tiene ningún otro producto de este curso: es perpendicular a $\\vec u$ y a $\\vec v$ a la vez, y su sentido depende del orden de los factores.'));

    let cu1=3,cu2=0,cu3=1, cv1=0,cv2=3,cv3=1, orden=true;
    const cajaP5=el('div',{class:'plot'}); c5.append(cajaP5);
    const P5=Espacio(cajaP5,{alto:420,escala:30,theta:0.7,phi:0.35,rotable:true});
    function calcC5(){
      const u=[cu1,cu2,cu3], v=[cv1,cv2,cv3];
      const n=orden?cruz(u,v):cruz(v,u);
      return {u,v,n};
    }
    P5.dibujar(E=>{
      const {u,v,n}=calcC5();
      E.ejes3({largo:4});
      E.vector3([0,0,0],u,{color:'--s1',grosor:3,etiqueta:'u'});
      E.vector3([0,0,0],v,{color:'--s2',grosor:3,etiqueta:'v'});
      E.superficie((a,b)=>[a*u[0]+b*v[0],a*u[1]+b*v[1],a*u[2]+b*v[2]],
        {uMin:0,uMax:1,vMin:0,vMax:1,nu:6,nv:6,color:'--grid'});
      const normaN=norma(n);
      if(normaN>1e-6){
        const c=[(u[0]+v[0])/2,(u[1]+v[1])/2,(u[2]+v[2])/2];
        const Lvis=2.4, k=Lvis/normaN;
        E.vector3(c,[n[0]*k,n[1]*k,n[2]*k],{color:'--s7',grosor:3,etiqueta:orden?'u×v':'v×u'});
      }
    });
    const leerC5=lectura(c5);
    let reglaC5=null;
    function actualizarC5(){
      P5.redibujar();
      const {u,v,n}=calcC5();
      const normaN=norma(n), magU=norma(u), magV=norma(v);
      const cosT=magU>1e-9&&magV>1e-9?puntoP(u,v)/(magU*magV):0;
      const th=Math.acos(Math.max(-1,Math.min(1,cosT)))*180/Math.PI;
      leerC5.set([
        ['u', '('+u[0]+', '+u[1]+', '+u[2]+')'],
        ['v', '('+v[0]+', '+v[1]+', '+v[2]+')'],
        [orden?'u×v':'v×u', '('+n[0].toFixed(2)+', '+n[1].toFixed(2)+', '+n[2].toFixed(2)+')'],
        ['‖'+(orden?'u×v':'v×u')+'‖', normaN.toFixed(3)],
        ['u·n y v·n', puntoP(u,n).toFixed(3)+' , '+puntoP(v,n).toFixed(3)],
        ['‖u‖‖v‖sen θ', (magU*magV*Math.sin(th*Math.PI/180)).toFixed(3)]
      ]);
      reglaC5.set(orden
        ?'Con este orden, <b>u × v</b> apunta hacia el lado que da la regla de la mano derecha al girar los dedos desde u hacia v.'
        :'Al invertir el orden, <b>v × u</b> apunta exactamente al lado contrario: incluso siendo los mismos dos vectores, el resultado cambió de signo.');
    }
    controlValor(c5,{label:'u₁',min:-3,max:3,paso:0.5,valor:cu1,unidad:'',onChange:v=>{cu1=v; actualizarC5();}});
    controlValor(c5,{label:'u₂',min:-3,max:3,paso:0.5,valor:cu2,unidad:'',onChange:v=>{cu2=v; actualizarC5();}});
    controlValor(c5,{label:'u₃',min:-3,max:3,paso:0.5,valor:cu3,unidad:'',onChange:v=>{cu3=v; actualizarC5();}});
    controlValor(c5,{label:'v₁',min:-3,max:3,paso:0.5,valor:cv1,unidad:'',onChange:v=>{cv1=v; actualizarC5();}});
    controlValor(c5,{label:'v₂',min:-3,max:3,paso:0.5,valor:cv2,unidad:'',onChange:v=>{cv2=v; actualizarC5();}});
    controlValor(c5,{label:'v₃',min:-3,max:3,paso:0.5,valor:cv3,unidad:'',onChange:v=>{cv3=v; actualizarC5();}});
    const btnOrden=el('button',{class:'btn',onclick:()=>{ orden=!orden; btnOrden.textContent='Mostrar '+(orden?'v × u':'u × v'); actualizarC5(); }},'Mostrar v × u');
    c5.append(el('div',{class:'stepper'},btnOrden));
    reglaC5=textoVivo(c5);
    reglaC5.calibrar([
      'Con este orden, <b>u × v</b> apunta hacia el lado que da la regla de la mano derecha al girar los dedos desde u hacia v.',
      'Al invertir el orden, <b>v × u</b> apunta exactamente al lado contrario: incluso siendo los mismos dos vectores, el resultado cambió de signo.'
    ]);
    actualizarC5();

    leyenda(c5,[['--s1','u'],['--s2','v'],['--grid','paralelogramo que forman u y v'],['--s7','u×v o v×u (a escala fija, para que quepa)']]);

    c5.append(el('p',{class:'note'},'La flecha violeta se dibuja siempre del mismo largo visual para que quepa en el recuadro; su magnitud real es la que muestra el contador «‖u×v‖», arriba.'));
    c5.append(el('p',{},'Por definición, el producto cruz se calcula con un determinante cuya primera fila son los vectores canónicos:'));
    c5.append(el('div',{class:'formula',html:'$$\\vec u\\times\\vec v=\\begin{vmatrix}\\hat\\imath&\\hat\\jmath&\\hat k\\\\ u_1&u_2&u_3\\\\ v_1&v_2&v_3\\end{vmatrix}=(u_2v_3-u_3v_2,\\ u_3v_1-u_1v_3,\\ u_1v_2-u_2v_1)$$'}));
    c5.append(el('p',{class:'note'},'Con $\\vec u=(2,-1,1)$ y $\\vec v=(1,2,2)$: $\\vec u\\times\\vec v=((-1)(2)-(1)(2),\\ (1)(1)-(2)(2),\\ (2)(2)-(-1)(1))=(-4,-3,5)$, y en efecto $\\vec u\\cdot(\\vec u\\times\\vec v)=2(-4)+(-1)(-3)+1(5)=0$ y lo mismo con $\\vec v$: el resultado es perpendicular a los dos factores.'));
    c5.append(el('p',{},'Cambiar el orden de los factores invierte el signo de las tres componentes, así que el vector resultante apunta al lado contrario sin cambiar de largo:'));
    c5.append(el('div',{class:'formula',html:'$$\\vec v\\times\\vec u=-\\,\\vec u\\times\\vec v$$'}));
    c5.append(el('p',{},'La malla gris es el paralelogramo que arman $\\vec u$ y $\\vec v$ como lados. Su área es exactamente la norma del producto cruz, y esa norma se puede escribir con el ángulo $\\theta$ entre ambos vectores —la misma forma geométrica que en el producto punto, pero con seno en vez de coseno:'));
    c5.append(el('div',{class:'formula',html:'$$\\|\\vec u\\times\\vec v\\|=\\|\\vec u\\|\\,\\|\\vec v\\|\\operatorname{sen}\\theta=\\text{área del paralelogramo}$$'}));
    c5.append(el('p',{class:'note'},'Las dos últimas filas del contador —la norma calculada directo y $\\|\\vec u\\|\\|\\vec v\\|\\operatorname{sen}\\theta$— coinciden en todo momento, muevan o no los deslizadores: son la misma área vista de dos maneras. Cuando $\\vec u$ y $\\vec v$ quedan paralelos, el paralelogramo se aplana, el área cae a $0$ y el producto cruz se anula junto con ella.'));
    sec.append(c5);
  }
});
