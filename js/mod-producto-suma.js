/* Producto a suma y suma a producto. */
registerModule({
  id:'producto-suma',
  title:'Producto a suma y suma a producto',
  unidad:'I',
  lead:'Un producto de senos y cosenos se puede reescribir como una suma, y una suma como un producto. La segunda dirección es la que más resuelve: convierte una suma —difícil de igualar a cero— en un producto, donde los ceros quedan a la vista.',
  build(sec){

    /* ---------- Tarjeta 1: un producto que se abre en una suma (deslizadores) ---------- */
    const c1=el('div',{class:'card'});
    c1.append(el('h3',{},'Un producto que se abre en una suma'));
    c1.append(el('p',{},'Multiplicar dos ondas de distinta frecuencia da una curva que parece modulada: más alta acá, casi plana allá. Esa curva no es más que la suma de otras dos ondas puras. La línea llena es el producto; la punteada, la suma que lo reemplaza — se dibujan exactamente una encima de la otra.'));

    let mC1=5, nC1=2;
    const cajaP1=el('div',{}); c1.append(cajaP1);
    const P1=Plano(cajaP1,{xMin:0,xMax:2*Math.PI,yMin:-1.2,yMax:1.2,alto:280,iso:false});
    P1.dibujar(P=>{
      P.ejes();
      P.curva(x=>Math.sin(mC1*x)*Math.cos(nC1*x),{color:'--s1',grosor:2.6});
      P.curva(x=>0.5*(Math.sin((mC1+nC1)*x)+Math.sin((mC1-nC1)*x)),{color:'--s6',grosor:1.8,guiones:true});
    });
    function actualizarC1(){
      const x0=1.3;
      const a=Math.sin(mC1*x0)*Math.cos(nC1*x0);
      const b=0.5*(Math.sin((mC1+nC1)*x0)+Math.sin((mC1-nC1)*x0));
      leerC1.set([
        ['m', mC1], ['n', nC1],
        ['en x = 1,3: sen(mx)cos(nx)', a.toFixed(3)],
        ['½[sen((m+n)x)+sen((m−n)x)]', b.toFixed(3)]
      ]);
    }
    controlValor(c1,{label:'m',min:1,max:6,paso:1,valor:mC1,unidad:'',
      onChange:v=>{ mC1=v; P1.redibujar(); actualizarC1(); }});
    controlValor(c1,{label:'n',min:1,max:6,paso:1,valor:nC1,unidad:'',
      onChange:v=>{ nC1=v; P1.redibujar(); actualizarC1(); }});
    const leerC1=lectura(c1); actualizarC1();

    c1.append(el('p',{},'La curva azul es el producto $\\operatorname{sen}(mx)\\cos(nx)$; la naranja discontinua es la fórmula de producto a suma con $A=mx$ y $B=nx$. Coinciden en cada punto porque son la misma función escrita de dos formas distintas.'));
    c1.append(el('div',{class:'formula',html:'$$\\operatorname{sen}(A)\\cos(B)=\\frac{1}{2}\\big[\\operatorname{sen}(A+B)+\\operatorname{sen}(A-B)\\big]$$'}));
    c1.append(el('p',{class:'note'},'Con m y n enteros, mx y nx dan una vuelta completa m y n veces en $[0,2\\pi]$: al subir n, la modulación —los «bultos» de la envolvente— se vuelve más angosta.'));
    sec.append(c1);

    /* ---------- Tarjeta 2: las cuatro fórmulas de producto a suma ---------- */
    const c2=el('div',{class:'card'});
    c2.append(el('h3',{},'Las cuatro fórmulas de producto a suma'));
    c2.append(el('p',{},'Salen de sumar y restar las fórmulas de la suma y la diferencia de ángulos, $\\operatorname{sen}(A\\pm B)$ y $\\cos(A\\pm B)$, y despejar el término cruzado.'));
    c2.append(el('div',{class:'formula',html:'$$\\operatorname{sen}(A)\\cos(B)=\\frac{1}{2}\\big[\\operatorname{sen}(A+B)+\\operatorname{sen}(A-B)\\big]$$'}));
    c2.append(el('div',{class:'formula',html:'$$\\cos(A)\\operatorname{sen}(B)=\\frac{1}{2}\\big[\\operatorname{sen}(A+B)-\\operatorname{sen}(A-B)\\big]$$'}));
    c2.append(el('div',{class:'formula',html:'$$\\cos(A)\\cos(B)=\\frac{1}{2}\\big[\\cos(A+B)+\\cos(A-B)\\big]$$'}));
    c2.append(el('div',{class:'formula',html:'$$\\operatorname{sen}(A)\\operatorname{sen}(B)=\\frac{1}{2}\\big[\\cos(A-B)-\\cos(A+B)\\big]$$'}));
    c2.append(el('p',{class:'note'},'Sirven, por ejemplo, para calcular productos como $\\cos(20°)\\cos(40°)\\cos(80°)$ sin pasar por ángulos notables: cada producto se abre en una suma que sí se simplifica.'));
    sec.append(c2);

    /* ---------- Tarjeta 3: para qué sirve — factorizar para encontrar ceros ---------- */
    const c3=el('div',{class:'card'});
    c3.append(el('h3',{},'Para qué sirve en la práctica: factorizar'));
    c3.append(el('p',{},'Una expresión como $\\operatorname{sen}3x+\\operatorname{sen}x$ no deja ver a simple vista dónde vale cero. La fórmula de suma a producto la reescribe como un producto —$2\\operatorname{sen}2x\\cos x$— y un producto se anula apenas se anula alguno de sus factores. Las dos curvas de abajo son la misma función escrita de las dos formas: se superponen exactamente.'));

    let nC3=2;
    const cajaP3=el('div',{}); c3.append(cajaP3);
    const P3=Plano(cajaP3,{xMin:0,xMax:2*Math.PI,yMin:-2.3,yMax:2.3,alto:300,iso:false});
    P3.dibujar(P=>{
      const n=nC3, A=n+1, B=n-1;
      P.ejes();
      P.curva(x=>Math.sin(A*x)+Math.sin(B*x),{color:'--s1',grosor:2.6});
      P.curva(x=>2*Math.sin(n*x)*Math.cos(x),{color:'--s6',grosor:1.6,guiones:true});
      /* ceros de sen(nx): un factor del producto */
      for(let k=0;k*Math.PI/n<=2*Math.PI+1e-9;k++)P.punto(k*Math.PI/n,0,{color:'--s2',r:5});
      /* ceros de cos x: el otro factor */
      for(let k=0;Math.PI/2+k*Math.PI<=2*Math.PI+1e-9;k++)P.punto(Math.PI/2+k*Math.PI,0,{color:'--s7',r:5});
    });
    function actualizarC3(){
      const n=nC3, A=n+1, B=n-1, x0=1.3;
      const a=Math.sin(A*x0)+Math.sin(B*x0);
      const b=2*Math.sin(n*x0)*Math.cos(x0);
      leerC3.set([
        ['A = n+1', A], ['B = n−1', B],
        ['en x = 1,3: sen(Ax)+sen(Bx)', a.toFixed(3)],
        ['2 sen(nx) cos x', b.toFixed(3)]
      ]);
    }
    controlValor(c3,{label:'n',min:1,max:5,paso:1,valor:nC3,unidad:'',
      onChange:v=>{ nC3=v; P3.redibujar(); actualizarC3(); }});
    const leerC3=lectura(c3); actualizarC3();

    c3.append(el('p',{},'Con $n=2$ (el ejemplo de arriba) la identidad se reduce a $\\operatorname{sen}3x+\\operatorname{sen}x=2\\operatorname{sen}2x\\cos x$. Los puntos verdes marcan dónde se anula $\\operatorname{sen}(nx)$ y los violeta, dónde se anula $\\cos x$: juntos son ',el('b',{},'todos'),' los ceros de la suma original, porque el producto se anula exactamente cuando lo hace alguno de sus dos factores.'));
    c3.append(el('div',{class:'formula',html:'$$\\operatorname{sen}\\big((n+1)x\\big)+\\operatorname{sen}\\big((n-1)x\\big)=2\\operatorname{sen}(nx)\\cos x$$'}));
    c3.append(el('p',{class:'note'},'Antes de factorizar, resolver $\\operatorname{sen}3x+\\operatorname{sen}x=0$ no tiene un camino directo. Después de factorizar, es la ecuación elemental de siempre aplicada dos veces: $\\operatorname{sen}2x=0$ o $\\cos x=0$.'));
    sec.append(c3);

    /* ---------- Tarjeta 4: las cuatro fórmulas de suma a producto ---------- */
    const c4=el('div',{class:'card'});
    c4.append(el('h3',{},'Las cuatro fórmulas de suma a producto'));
    c4.append(el('p',{},'Salen de sumar y restar los pares de fórmulas de producto a suma de la tarjeta 2. Son las que más resuelven: convierten una suma o resta de senos y cosenos —difícil de factorizar tal cual— en un producto, que sí se simplifica o se iguala a cero.'));
    c4.append(el('div',{class:'formula',html:'$$\\operatorname{sen}(A)+\\operatorname{sen}(B)=2\\operatorname{sen}\\!\\left(\\frac{A+B}{2}\\right)\\cos\\!\\left(\\frac{A-B}{2}\\right)$$'}));
    c4.append(el('div',{class:'formula',html:'$$\\operatorname{sen}(A)-\\operatorname{sen}(B)=2\\cos\\!\\left(\\frac{A+B}{2}\\right)\\operatorname{sen}\\!\\left(\\frac{A-B}{2}\\right)$$'}));
    c4.append(el('div',{class:'formula',html:'$$\\cos(A)+\\cos(B)=2\\cos\\!\\left(\\frac{A+B}{2}\\right)\\cos\\!\\left(\\frac{A-B}{2}\\right)$$'}));
    c4.append(el('div',{class:'formula',html:'$$\\cos(A)-\\cos(B)=-2\\operatorname{sen}\\!\\left(\\frac{A+B}{2}\\right)\\operatorname{sen}\\!\\left(\\frac{A-B}{2}\\right)$$'}));
    c4.append(el('p',{class:'note'},'La última lleva un signo menos que las otras tres no tienen — es el error más común al usarla: $\\cos A-\\cos B$ nunca da $+2\\operatorname{sen}(\\cdot)\\operatorname{sen}(\\cdot)$. La tarjeta siguiente lo aterriza con un número.'));
    sec.append(c4);

    /* ---------- Tarjeta 5: cos A + cos B, y el signo de cos A − cos B ---------- */
    const c5=el('div',{class:'card'});
    c5.append(el('h3',{},'cos A + cos B con la misma idea — y el signo de cos A − cos B'));
    c5.append(el('p',{},'La misma superposición de curvas, ahora con cosenos: $\\cos(\\omega_1x)+\\cos(\\omega_2x)$ (azul) contra la fórmula de suma a producto (naranja discontinuo). $\\omega_1$ queda fijo en 6; el deslizador mueve $\\Delta=\\omega_1-\\omega_2$.'));

    let deltaC5=2;
    const baseC5=6;
    const cajaP5=el('div',{}); c5.append(cajaP5);
    const P5=Plano(cajaP5,{xMin:0,xMax:2*Math.PI,yMin:-2.3,yMax:2.3,alto:280,iso:false});
    P5.dibujar(P=>{
      P.ejes();
      const w2=baseC5-deltaC5, avg=(baseC5+w2)/2, half=deltaC5/2;
      P.curva(x=>Math.cos(baseC5*x)+Math.cos(w2*x),{color:'--s1',grosor:2.4});
      P.curva(x=>2*Math.cos(avg*x)*Math.cos(half*x),{color:'--s6',grosor:1.4,guiones:true});
    });
    function actualizarC5(){
      const w2=baseC5-deltaC5, x0=1;
      const a=Math.cos(baseC5*x0)+Math.cos(w2*x0);
      const b=2*Math.cos((baseC5+w2)/2*x0)*Math.cos(deltaC5/2*x0);
      leerC5.set([
        ['ω₁', baseC5], ['ω₂', w2], ['Δ = ω₁ − ω₂', deltaC5],
        ['en x = 1: cos(ω₁x)+cos(ω₂x)', a.toFixed(3)],
        ['fórmula de suma a producto', b.toFixed(3)]
      ]);
    }
    controlValor(c5,{label:'Δ = ω₁ − ω₂',min:0.5,max:5,paso:0.5,valor:deltaC5,unidad:'',
      onChange:v=>{ deltaC5=v; P5.redibujar(); actualizarC5(); }});
    const leerC5=lectura(c5); actualizarC5();

    c5.append(el('p',{},'La curva azul es la suma real; la naranja discontinua es la misma suma calculada con $\\cos(A)+\\cos(B)=2\\cos\\!\\left(\\frac{A+B}{2}\\right)\\cos\\!\\left(\\frac{A-B}{2}\\right)$ — se superponen, igual que con los senos.'));
    c5.append(el('p',{class:'note'},'La fórmula gemela, $\\cos A-\\cos B=-2\\operatorname{sen}\\!\\left(\\frac{A+B}{2}\\right)\\operatorname{sen}\\!\\left(\\frac{A-B}{2}\\right)$, lleva ese signo menos que rompe el patrón de las otras tres. Por ejemplo: $\\cos(70°)-\\cos(10°)=-2\\operatorname{sen}(40°)\\operatorname{sen}(30°)\\approx-0{,}643$ — sin el signo menos, el resultado quedaría con el signo cambiado.'));
    sec.append(c5);
  }
});
