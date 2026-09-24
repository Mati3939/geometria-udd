# Geometría — apuntes animados

Material de apoyo para las **monitorías de Geometría** (IIG127A). Cada tema del
ramo explicado con figuras que se mueven: elegís la unidad, elegís el tema que te
complica, y lo ves armarse.

**→ https://mati3939.github.io/geometria-udd/**

## Qué es y qué no es

Es una página sola, sin instalar nada, que funciona igual en el teléfono y en el
computador. Cada tema arranca con el dibujo y la fórmula aparece **después**, como
conclusión de lo que se acaba de ver.

- **No** tiene ejercicios resueltos paso a paso. Para eso están las guías y las
  pautas del curso en Canvas: en papel se siguen mejor.
- **No** tiene calendario, fechas de control ni ponderaciones. Eso vive en Canvas,
  que es donde se actualiza.
- **No** incluye material oficial del curso (PDF de clases, guías, evaluaciones ni
  listas de estudiantes). Solo contenido escrito para esta página.

## Estado

Escritos los temas de trigonometría y de vectores y rectas en el plano. Cónicas y
la Unidad III (rectas y planos en el espacio) están como fichas: se ve qué van a
cubrir, todavía sin animar.

## Cómo se usa

- Las unidades están arriba; al pasar por una se abre su lista de temas.
- Teclas `1`–`9`: saltar entre temas de la unidad en la que estés. `Inicio`: volver
  al mapa del ramo.
- Botón 🌗: claro / oscuro / automático.
- Cada tema tiene su propia dirección (`#identidades-fundamentales`), así que se
  puede mandar el enlace de un tema puntual.

## Cómo está hecho

HTML, CSS y JavaScript a mano, sin frameworks, sin CDN y sin pedir nada por red:
una vez cargada, funciona sin conexión. Las figuras son `<canvas>` dibujado con
primitivas propias (`assets/app/math.js`); las fórmulas las compone
[KaTeX](https://katex.org/) (incluido en `assets/vendor/`, MIT).

```
index.html            ← el shell: header, nav de unidades y los <script defer>
assets/app/core.js    ← SPA: registerModule, activate, navegación, tema claro/oscuro
assets/app/math.js    ← primitivas de dibujo: Plano, Espacio, animar()
assets/app/app.css    ← sistema de diseño
js/curso.js           ← unidades y bibliografía del ramo
js/mod-<tema>.js      ← un archivo por tema; el que no está escrito lleva pendiente:true
```

Para verlo en local basta abrir `index.html` en el navegador — no necesita servidor.

## Licencia

Código bajo licencia MIT (ver `LICENSE`). El contenido de los temas es material de
estudio de elaboración propia; las fuentes de cada tarjeta están citadas al pie de
la misma tarjeta.
