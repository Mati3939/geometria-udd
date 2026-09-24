/* Clase 4 del curso: fórmulas de producto a suma y de suma a producto. */
registerModule({
  id:'producto-suma',
  title:'Producto a suma y suma a producto',
  unidad:'I',
  lead:'Un producto de senos y cosenos se puede reescribir como una suma, y una suma como un producto. La segunda dirección es la que más resuelve — y es la que explica el batido: lo que pasa cuando se suman dos ondas de frecuencias parecidas.',
  build(sec){

    /* ---------- Tarjeta 1: un producto que se abre en una suma (deslizadores) ---------- */
    const c1=el('div',{class:'card'});
    c1.append(el('h3',{},'Un producto que se abre en una suma'));
    c1.append(el('p',{},'Multiplicar dos ondas de distinta frecuencia da una curva que parece modulada: más alta acá, casi plana allá. Esa curva no es más que la suma de otras dos ondas puras. La línea llena es el producto; la punteada, la suma que lo reemplaza — se dibujan exactamente una encima de la otra.'));

    let mC1=5, nC1=2;
    const leerC1=el('p',{class:'note'});
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
      leerC1.textContent='m = '+mC1+' · n = '+nC1+' · en x = 1,3: sen(mx)cos(nx) = '+a.toFixed(3)
        +' · ½[sen((m+n)x)+sen((m−n)x)] = '+b.toFixed(3)+' — mismo trazo en todo el dominio.';
    }
    c1.append(el('div',{class:'controls'},
      el('label',{},'m:'),
      el('input',{type:'range',min:'1',max:'6',step:'1',value:String(mC1),
        oninput:e=>{ mC1=parseInt(e.target.value,10); P1.redibujar(); actualizarC1(); }}),
      el('label',{},'n:'),
      el('input',{type:'range',min:'1',max:'6',step:'1',value:String(nC1),
        oninput:e=>{ nC1=parseInt(e.target.value,10); P1.redibujar(); actualizarC1(); }})
    ));
    c1.append(leerC1); actualizarC1();

    c1.append(el('p',{},'La curva azul es el producto $\\operatorname{sen}(mx)\\cos(nx)$; la naranja discontinua es la fórmula de producto a suma con $A=mx$ y $B=nx$. Coinciden en cada punto porque son la misma función escrita de dos formas distintas.'));
    c1.append(el('div',{class:'formula',html:'$$\\operatorname{sen}(A)\\cos(B)=\\frac{1}{2}\\big[\\operatorname{sen}(A+B)+\\operatorname{sen}(A-B)\\big]$$'}));
    c1.append(el('p',{class:'note'},'Con m y n enteros, mx y nx dan una vuelta completa m y n veces en $[0,2\\pi]$: al subir n, la modulación —los «bultos» de la envolvente— se vuelve más angosta.'));
    c1.append(el('p',{class:'fuente'},'Fuente: Clase 4 «Fórmulas de producto a suma y suma a producto», Teorema 2.1, fórmula 1 (Geometría 2026-2).'));
    sec.append(c1);

    /* ---------- Tarjeta 2: las cuatro fórmulas de producto a suma ---------- */
    const c2=el('div',{class:'card'});
    c2.append(el('h3',{},'Las cuatro fórmulas de producto a suma'));
    c2.append(el('p',{},'Salen de sumar y restar las fórmulas de la suma y la diferencia de ángulos, $\\operatorname{sen}(A\\pm B)$ y $\\cos(A\\pm B)$ (Clase 2), y despejar el término cruzado.'));
    c2.append(el('div',{class:'formula',html:'$$\\operatorname{sen}(A)\\cos(B)=\\frac{1}{2}\\big[\\operatorname{sen}(A+B)+\\operatorname{sen}(A-B)\\big]$$'}));
    c2.append(el('div',{class:'formula',html:'$$\\cos(A)\\operatorname{sen}(B)=\\frac{1}{2}\\big[\\operatorname{sen}(A+B)-\\operatorname{sen}(A-B)\\big]$$'}));
    c2.append(el('div',{class:'formula',html:'$$\\cos(A)\\cos(B)=\\frac{1}{2}\\big[\\cos(A+B)+\\cos(A-B)\\big]$$'}));
    c2.append(el('div',{class:'formula',html:'$$\\operatorname{sen}(A)\\operatorname{sen}(B)=\\frac{1}{2}\\big[\\cos(A-B)-\\cos(A+B)\\big]$$'}));
    c2.append(el('p',{class:'note'},'Sirven, por ejemplo, para calcular productos como $\\cos(20°)\\cos(40°)\\cos(80°)$ sin pasar por ángulos notables: cada producto se abre en una suma que sí se simplifica.'));
    c2.append(el('p',{class:'fuente'},'Fuente: Clase 4, Teorema 2.1 «Fórmulas de producto a suma» (Geometría 2026-2).'));
    sec.append(c2);

    /* ---------- Tarjeta 3: el batido (deslizadores de frecuencia) ---------- */
    const c3=el('div',{class:'card'});
    c3.append(el('h3',{},'El batido: qué pasa cuando se suman dos frecuencias parecidas'));
    c3.append(el('p',{},'Al sumar dos ondas puras de frecuencias cercanas, $\\operatorname{sen}(\\omega_1x)$ y $\\operatorname{sen}(\\omega_2x)$, el resultado no se ve como una onda simple: la amplitud sube y baja despacio, como un latido. Esa envolvente —las dos curvas ámbar punteadas— es exactamente la fórmula de suma a producto.'));

    let w1C3=6, w2C3=5;
    const leerC3=el('p',{class:'note'});
    const cajaP3=el('div',{}); c3.append(cajaP3);
    const P3=Plano(cajaP3,{xMin:0,xMax:20,yMin:-2.3,yMax:2.3,alto:300,iso:false});
    P3.dibujar(P=>{
      P.ejes();
      const half=(w1C3-w2C3)/2, avg=(w1C3+w2C3)/2;
      P.curva(x=>2*Math.cos(half*x),{color:'--s4',grosor:1.3,guiones:true});
      P.curva(x=>-2*Math.cos(half*x),{color:'--s4',grosor:1.3,guiones:true});
      P.curva(x=>Math.sin(w1C3*x)+Math.sin(w2C3*x),{color:'--s1',grosor:2.4});
      P.curva(x=>2*Math.sin(avg*x)*Math.cos(half*x),{color:'--s6',grosor:1.4,guiones:true});
    });
    function actualizarC3(){
      const x0=3;
      const y=Math.sin(w1C3*x0)+Math.sin(w2C3*x0);
      const yf=2*Math.sin((w1C3+w2C3)/2*x0)*Math.cos((w1C3-w2C3)/2*x0);
      const diff=Math.abs(w1C3-w2C3);
      const nodos=diff>1e-9?(2*Math.PI/(diff/2)).toFixed(1):'∞';
      leerC3.textContent='ω₁ = '+w1C3+' · ω₂ = '+w2C3+' · en x = 3: sen(ω₁x)+sen(ω₂x) = '+y.toFixed(3)
        +' · fórmula de suma a producto = '+yf.toFixed(3)+' · distancia entre nodos de la envolvente ≈ '+nodos;
    }
    c3.append(el('div',{class:'controls'},
      el('label',{},'ω₁:'),
      el('input',{type:'range',min:'3',max:'9',step:'0.5',value:String(w1C3),
        oninput:e=>{ w1C3=parseFloat(e.target.value); P3.redibujar(); actualizarC3(); }}),
      el('label',{},'ω₂:'),
      el('input',{type:'range',min:'3',max:'9',step:'0.5',value:String(w2C3),
        oninput:e=>{ w2C3=parseFloat(e.target.value); P3.redibujar(); actualizarC3(); }})
    ));
    c3.append(leerC3); actualizarC3();

    c3.append(el('p',{},'La curva azul es la suma real; la naranja discontinua es la misma curva calculada con la fórmula de abajo — se superponen en todo punto. Las curvas ámbar de arriba y abajo son la envolvente: el coeficiente que multiplica a la oscilación rápida.'));
    c3.append(el('div',{class:'formula',html:'$$\\operatorname{sen}(A)+\\operatorname{sen}(B)=2\\operatorname{sen}\\!\\left(\\frac{A+B}{2}\\right)\\cos\\!\\left(\\frac{A-B}{2}\\right)$$'}));
    c3.append(el('p',{class:'note'},'Con $A=\\omega_1x$ y $B=\\omega_2x$: $\\operatorname{sen}\\!\\big(\\tfrac{\\omega_1+\\omega_2}{2}x\\big)$ es la oscilación rápida —el promedio de las dos frecuencias— y $2\\cos\\!\\big(\\tfrac{\\omega_1-\\omega_2}{2}x\\big)$ es la envolvente lenta: cuanto más parecidas son $\\omega_1$ y $\\omega_2$, más separados quedan sus nodos y más lento se siente el batido.'));
    c3.append(el('p',{class:'note'},'Si $\\omega_1=\\omega_2$ no hay batido: la envolvente queda fija en 2 y la suma es, simplemente, el doble de una onda pura.'));
    c3.append(el('p',{class:'fuente'},'Fuente: fórmula de suma a producto, Clase 4, Teorema 2.2, fórmula 1 (Geometría 2026-2); la lectura como fenómeno de batido (envolvente) es elaboración propia sobre esa misma fórmula.'));
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
    c4.append(el('p',{class:'fuente'},'Fuente: Clase 4, Teorema 2.2 «Fórmulas de suma a producto» (Geometría 2026-2).'));
    sec.append(c4);

    /* ---------- Tarjeta 5: cos A + cos B, y el signo de cos A − cos B ---------- */
    const c5=el('div',{class:'card'});
    c5.append(el('h3',{},'cos A + cos B con la misma idea — y el signo de cos A − cos B'));
    c5.append(el('p',{},'La misma superposición de curvas, ahora con cosenos: $\\cos(\\omega_1x)+\\cos(\\omega_2x)$ (azul) contra la fórmula de suma a producto (naranja discontinuo). $\\omega_1$ queda fijo en 6; el deslizador mueve $\\Delta=\\omega_1-\\omega_2$.'));

    let deltaC5=2;
    const baseC5=6;
    const leerC5=el('p',{class:'note'});
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
      leerC5.textContent='ω₁ = '+baseC5+' · ω₂ = '+w2+' (Δ = '+deltaC5+') · en x = 1: cos(ω₁x)+cos(ω₂x) = '+a.toFixed(3)
        +' · fórmula de suma a producto = '+b.toFixed(3)+' — mismo trazo en todo el dominio.';
    }
    c5.append(el('div',{class:'controls'},
      el('label',{},'Δ = ω₁ − ω₂:'),
      el('input',{type:'range',min:'0.5',max:'5',step:'0.5',value:String(deltaC5),
        oninput:e=>{ deltaC5=parseFloat(e.target.value); P5.redibujar(); actualizarC5(); }})
    ));
    c5.append(leerC5); actualizarC5();

    c5.append(el('p',{},'La curva azul es la suma real; la naranja discontinua es la misma suma calculada con $\\cos(A)+\\cos(B)=2\\cos\\!\\left(\\frac{A+B}{2}\\right)\\cos\\!\\left(\\frac{A-B}{2}\\right)$ — se superponen, igual que con los senos.'));
    c5.append(el('p',{class:'note'},'La fórmula gemela, $\\cos A-\\cos B=-2\\operatorname{sen}\\!\\left(\\frac{A+B}{2}\\right)\\operatorname{sen}\\!\\left(\\frac{A-B}{2}\\right)$, lleva ese signo menos que rompe el patrón de las otras tres. Por ejemplo: $\\cos(70°)-\\cos(10°)=-2\\operatorname{sen}(40°)\\operatorname{sen}(30°)\\approx-0{,}643$ — sin el signo menos, el resultado quedaría con el signo cambiado.'));
    c5.append(el('p',{class:'fuente'},'Fuente: Clase 4, Teorema 2.2, fórmulas 3 y 4 (Geometría 2026-2).'));
    sec.append(c5);
  }
});
