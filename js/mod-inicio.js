/* Mapa del ramo: índice por unidad, en el orden en que se dictan los temas.
   No hay calendario: el lector entra buscando el tema que lo complica. Los temas
   en gris todavía no están escritos (core.js les pinta una ficha con lo que van
   a cubrir). */
registerModule({
  id:'inicio', title:'Mapa del ramo', unidad:'inicio',
  lead:'Todos los temas de Geometría, agrupados por unidad. Entrá al que te complique: cada uno arranca con la idea dibujada y en movimiento, no con la fórmula.',
  build(sec){
    const C=window.CURSO;

    const intro=el('div',{class:'card'});
    intro.append(el('h3',{},'Cómo usar esto'));
    intro.append(el('p',{},'Elegí una unidad arriba y, dentro, el tema. Cada tema es una pantalla sola: las figuras se mueven con ',el('b',{},'▶ Reproducir'),' y los deslizadores cambian los datos del dibujo, así que conviene mover todo y ver qué cambia.'));
    intro.append(el('p',{class:'note'},'Atajos de teclado: las teclas $1$ a $9$ saltan entre los temas de la unidad en la que estés, y ',el('b',{},'Inicio'),' vuelve acá. El botón 🌗 de arriba a la derecha cambia entre claro y oscuro.'));
    intro.append(el('p',{class:'note'},'Acá no hay ejercicios resueltos paso a paso: para eso están las guías y las pautas del curso en Canvas, que en papel se siguen mejor. Esto es para ',el('b',{},'ver'),' de dónde sale cada fórmula.'));
    sec.append(intro);

    const unidades=[...new Set(window.MODULES.map(m=>m.unidad))].filter(u=>u!=='inicio');
    unidades.forEach(u=>{
      const temas=window.MODULES.filter(m=>m.unidad===u);
      if(!temas.length)return;
      const card=el('div',{class:'card'});
      card.append(el('h3',{},'Unidad '+u+(C.unidades[u]?' · '+C.unidades[u]:'')));
      const listos=temas.filter(m=>!m.pendiente).length;
      if(listos<temas.length){
        card.append(el('p',{class:'note'},listos+' de '+temas.length+' temas animados; los grises están en camino.'));
      }
      const lista=el('div',{class:'temas-lista'});
      temas.forEach(m=>{
        lista.append(el('a',{
          class:'tema-item'+(m.pendiente?' pend':''),
          href:'#'+m.id,
          onclick:e=>{e.preventDefault();activate(m.id);}
        },m.title));
      });
      card.append(lista);
      sec.append(card);
    });

    sec.append(el('p',{class:'fuente suelta'},'Bibliografía del ramo: '+C.bibliografia));
  }
});
