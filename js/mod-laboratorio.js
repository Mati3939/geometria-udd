/* Laboratorio: un plano libre donde se agregan rectas, vectores y cónicas, con
   sus ecuaciones, sus elementos y las relaciones entre cada par. Muestra
   resultados, nunca el desarrollo. */
registerModule({
  id:'laboratorio', title:'Laboratorio', unidad:'lab',
  lead:'Rectas, vectores y cónicas en un mismo plano. Se agregan con un clic o escribiendo su ecuación general, y la app indica sus elementos y cómo se relacionan entre sí.',
  build(sec){
    const TIPOS={
      recta:{t:'Recta',n:'r'}, vector:{t:'Vector',n:'v'}, circ:{t:'Circunferencia',n:'C'},
      elipse:{t:'Elipse',n:'E'}, parabola:{t:'Parábola',n:'P'}, hiperbola:{t:'Hipérbola',n:'H'}
    };
    const DEF={
      recta:{m:1,n:0}, vector:{vx:2,vy:1}, circ:{h:0,k:0,r:2},
      elipse:{h:0,k:0,a:3,b:2,orient:'h'}, parabola:{h:0,k:0,p:1,orient:'v'}, hiperbola:{h:0,k:0,a:2,b:1.5,orient:'h'}
    };
    const CONTROLES={
      recta:[['m',-5,5,.1],['n',-6,6,.5]],
      vector:[['vx',-6,6,.5],['vy',-6,6,.5]],
      circ:[['h',-8,8,.5],['k',-6,6,.5],['r',.5,6,.1]],
      elipse:[['h',-8,8,.5],['k',-6,6,.5],['a',1,6,.1],['b',.5,6,.1]],
      parabola:[['h',-8,8,.5],['k',-6,6,.5],['p',-3,3,.1]],
      hiperbola:[['h',-8,8,.5],['k',-6,6,.5],['a',.5,5,.1],['b',.5,5,.1]]
    };
    const COLORES=['--s7','--s6','--s1','--s2','--s3','--s5','--s4'];
    let objs=[], sel=null, ci=0, rels=[];
    const cuenta={};

    /* ---------- formato ---------- */
    const redondo=v=>{ if(Math.abs(v)<5e-9)v=0; const r=Math.round(v*100)/100; return Object.is(r,-0)?0:r; };
    const fmt=v=>String(redondo(v)).replace('-','−').replace('.',',');
    const fmtT=v=>String(redondo(v)).replace('.','{,}');
    const pt=p=>'('+fmt(p[0])+'; '+fmt(p[1])+')';

    function nuevo(tipo,params){
      cuenta[tipo]=(cuenta[tipo]||0)+1;
      const o=Object.assign({id:tipo+cuenta[tipo], tipo, nombre:TIPOS[tipo].n+(cuenta[tipo]>1?cuenta[tipo]:''),
        color:COLORES[ci++%COLORES.length], vis:true}, DEF[tipo], params||{});
      objs.push(o); sel=o.id; return o;
    }

    /* ---------- geometría ---------- */
    const semiejes=o=>o.orient==='h'?[o.a,o.b]:[o.b,o.a];
    function param(o){
      const h=o.h, k=o.k;
      switch(o.tipo){
        case 'recta': return [[-40,40,t=>[t,o.m*t+o.n]]];
        case 'circ': return [[0,2*Math.PI,t=>[h+o.r*Math.cos(t),k+o.r*Math.sin(t)]]];
        case 'elipse': { const [sx,sy]=semiejes(o); return [[0,2*Math.PI,t=>[h+sx*Math.cos(t),k+sy*Math.sin(t)]]]; }
        case 'parabola': return o.orient==='v'?[[-14,14,t=>[h+t,k+t*t/(4*o.p)]]]:[[-14,14,t=>[h+t*t/(4*o.p),k+t]]];
        case 'hiperbola': return o.orient==='h'
          ? [[-3,3,u=>[h+o.a*Math.cosh(u),k+o.b*Math.sinh(u)]],[-3,3,u=>[h-o.a*Math.cosh(u),k+o.b*Math.sinh(u)]]]
          : [[-3,3,u=>[h+o.b*Math.sinh(u),k+o.a*Math.cosh(u)]],[-3,3,u=>[h+o.b*Math.sinh(u),k-o.a*Math.cosh(u)]]];
      }
      return [];
    }
    function implicita(o){
      const h=o.h, k=o.k;
      switch(o.tipo){
        case 'recta': return (x,y)=>y-o.m*x-o.n;
        case 'circ': return (x,y)=>(x-h)**2+(y-k)**2-o.r**2;
        case 'elipse': { const [sx,sy]=semiejes(o); return (x,y)=>(x-h)**2/sx**2+(y-k)**2/sy**2-1; }
        case 'parabola': return o.orient==='v'?(x,y)=>(x-h)**2-4*o.p*(y-k):(x,y)=>(y-k)**2-4*o.p*(x-h);
        case 'hiperbola': return o.orient==='h'?(x,y)=>(x-h)**2/o.a**2-(y-k)**2/o.b**2-1:(x,y)=>(y-k)**2/o.a**2-(x-h)**2/o.b**2-1;
      }
    }
    /* cortes entre una curva paramétrica A y la curva implícita B: cambios de
       signo de F_B a lo largo de A, afinados por bisección */
    function cortesNumericos(A,B){
      const F=implicita(B), pts=[];
      for(const [t0,t1,f] of param(A)){
        const N=4000; let tp=t0, vp=F(...f(t0));
        for(let i=1;i<=N;i++){
          const t=t0+(t1-t0)*i/N, v=F(...f(t));
          if(vp===0) pts.push(f(tp));
          else if(vp*v<0){
            let lo=tp, hi=t, flo=vp;
            for(let j=0;j<50;j++){ const m=(lo+hi)/2, fm=F(...f(m)); if(flo*fm<=0)hi=m; else{lo=m;flo=fm;} }
            pts.push(f((lo+hi)/2));
          }
          tp=t; vp=v;
        }
      }
      return pts.filter((p,i)=>pts.findIndex(q=>Math.hypot(p[0]-q[0],p[1]-q[1])<1e-4)===i);
    }
    /* recta y=mx+n contra (x-h)²/sx²+(y-k)²/sy²=1, exacto por discriminante */
    function rectaOvalo(r,sx,sy,h,k){
      const A=1/sx**2+r.m**2/sy**2, B=-2*h/sx**2+2*r.m*(r.n-k)/sy**2, C=h*h/sx**2+(r.n-k)**2/sy**2-1;
      const D=B*B-4*A*C;
      if(Math.abs(D)<1e-9*Math.max(1,B*B)){ const x=-B/(2*A); return {tipo:'tangente',pts:[[x,r.m*x+r.n]]}; }
      if(D<0) return {tipo:'exterior',pts:[]};
      const s=Math.sqrt(D);
      return {tipo:'secante',pts:[(-B+s)/(2*A),(-B-s)/(2*A)].map(x=>[x,r.m*x+r.n])};
    }
    const anguloAgudo=(u,w)=>Math.acos(Math.min(1,Math.abs(u[0]*w[0]+u[1]*w[1])/(Math.hypot(...u)*Math.hypot(...w))))*180/Math.PI;

    function relacion(A,B){
      if(B.tipo==='recta'&&A.tipo!=='recta') [A,B]=[B,A];
      if(A.tipo==='vector'||B.tipo==='vector'){
        const v=A.tipo==='vector'?A:B, o=A.tipo==='vector'?B:A;
        if(Math.hypot(v.vx,v.vy)<1e-9) return {estado:'nada',txt:'vector nulo: sin dirección',pts:[]};
        if(o.tipo==='vector'){
          if(Math.hypot(o.vx,o.vy)<1e-9) return {estado:'nada',txt:'vector nulo: sin dirección',pts:[]};
          const c=(v.vx*o.vx+v.vy*o.vy)/(Math.hypot(v.vx,v.vy)*Math.hypot(o.vx,o.vy));
          return {estado:'nada',txt:'ángulo entre ellos: '+fmt(Math.acos(Math.max(-1,Math.min(1,c)))*180/Math.PI)+'°',pts:[]};
        }
        if(o.tipo==='recta'){
          const ang=anguloAgudo([v.vx,v.vy],[1,o.m]);
          return ang<1e-6?{estado:'toca',txt:'paralelo a la recta',pts:[]}:{estado:'nada',txt:'ángulo con la recta: '+fmt(ang)+'°',pts:[]};
        }
        return null;
      }
      if(A.tipo==='recta'&&B.tipo==='recta'){
        if(Math.abs(A.m-B.m)<1e-9) return Math.abs(A.n-B.n)<1e-9
          ? {estado:'toca',txt:'coincidentes',pts:[]} : {estado:'nada',txt:'paralelas',pts:[]};
        const x=(B.n-A.n)/(A.m-B.m);
        return {estado:'corta',txt:'secantes · ángulo '+fmt(anguloAgudo([1,A.m],[1,B.m]))+'°',pts:[[x,A.m*x+A.n]]};
      }
      if(A.tipo==='recta'&&(B.tipo==='circ'||B.tipo==='elipse')){
        const [sx,sy]=B.tipo==='circ'?[B.r,B.r]:semiejes(B);
        const r=rectaOvalo(A,sx,sy,B.h,B.k);
        return {estado:{secante:'corta',tangente:'toca',exterior:'nada'}[r.tipo], txt:r.tipo, pts:r.pts};
      }
      const claves=['h','k','r','a','b','p','orient'];
      if(A.tipo===B.tipo&&claves.every(c=>A[c]===undefined||(typeof A[c]==='string'?A[c]===B[c]:Math.abs(A[c]-B[c])<1e-9)))
        return {estado:'toca',txt:'coinciden: son la misma curva',pts:[]};
      const pts=cortesNumericos(A,B);
      if(pts.length>8) return {estado:'toca',txt:'se superponen en un tramo',pts:[]};
      return {estado:pts.length?'corta':'nada', txt:pts.length?(pts.length===1?'un punto en común':pts.length+' puntos en común'):'sin puntos en común', pts};
    }
    function calcular(){
      rels=[];
      const vis=objs.filter(o=>o.vis);
      for(let i=0;i<vis.length;i++) for(let j=i+1;j<vis.length;j++){
        const r=relacion(vis[i],vis[j]); if(r) rels.push({A:vis[i],B:vis[j],...r});
      }
    }

    /* ---------- ecuaciones en LaTeX ---------- */
    function poli(terms){
      let s='';
      for(const [c,v] of terms){
        if(Math.abs(redondo(c))===0) continue;
        const cuerpo=(v&&Math.abs(Math.abs(c)-1)<1e-9)?v:fmtT(Math.abs(c))+v;
        s+= s===''?(c<0?'-':'')+cuerpo:(c<0?'-':'+')+cuerpo;
      }
      return s||'0';
    }
    const cuad=(v,c)=>Math.abs(redondo(c))===0?v+'^2':'('+v+(c>0?'-':'+')+fmtT(Math.abs(c))+')^2';
    const lin=(v,c)=>Math.abs(redondo(c))===0?v:'('+v+(c>0?'-':'+')+fmtT(Math.abs(c))+')';
    const fr=(n,d)=>'\\dfrac{'+n+'}{'+d+'}';
    function general(o){
      const h=o.h, k=o.k;
      switch(o.tipo){
        case 'recta': return [[o.m,'x'],[-1,'y'],[o.n,'']];
        case 'circ': return [[1,'x^2'],[1,'y^2'],[-2*h,'x'],[-2*k,'y'],[h*h+k*k-o.r**2,'']];
        case 'elipse': { const [sx,sy]=semiejes(o), X=sx*sx, Y=sy*sy;
          return [[Y,'x^2'],[X,'y^2'],[-2*Y*h,'x'],[-2*X*k,'y'],[Y*h*h+X*k*k-X*Y,'']]; }
        case 'parabola': return o.orient==='v'
          ? [[1,'x^2'],[-2*h,'x'],[-4*o.p,'y'],[h*h+4*o.p*k,'']]
          : [[1,'y^2'],[-4*o.p,'x'],[-2*k,'y'],[k*k+4*o.p*h,'']];
        case 'hiperbola': { const A2=o.a*o.a, B2=o.b*o.b; return o.orient==='h'
          ? [[B2,'x^2'],[-A2,'y^2'],[-2*B2*h,'x'],[2*A2*k,'y'],[B2*h*h-A2*k*k-A2*B2,'']]
          : [[-B2,'x^2'],[A2,'y^2'],[2*B2*h,'x'],[-2*A2*k,'y'],[A2*k*k-B2*h*h-A2*B2,'']]; }
      }
    }
    function canonica(o){
      const h=o.h, k=o.k;
      switch(o.tipo){
        case 'recta': return 'y='+poli([[o.m,'x'],[o.n,'']]);
        case 'circ': return cuad('x',h)+'+'+cuad('y',k)+'='+fmtT(o.r**2);
        case 'elipse': { const [sx,sy]=semiejes(o); return fr(cuad('x',h),fmtT(sx*sx))+'+'+fr(cuad('y',k),fmtT(sy*sy))+'=1'; }
        case 'parabola': return o.orient==='v'?cuad('x',h)+'='+fmtT(4*o.p)+lin('y',k):cuad('y',k)+'='+fmtT(4*o.p)+lin('x',h);
        case 'hiperbola': return o.orient==='h'
          ? fr(cuad('x',h),fmtT(o.a*o.a))+'-'+fr(cuad('y',k),fmtT(o.b*o.b))+'=1'
          : fr(cuad('y',k),fmtT(o.a*o.a))+'-'+fr(cuad('x',h),fmtT(o.b*o.b))+'=1';
        case 'vector': return '\\vec v=('+fmtT(o.vx)+',\\ '+fmtT(o.vy)+')';
      }
    }
    function elementos(o){
      const h=o.h, k=o.k;
      switch(o.tipo){
        case 'recta': return [['m',fmt(o.m)],['n',fmt(o.n)],['inclinación',fmt(Math.atan(o.m)*180/Math.PI)+'°'],['director',pt([1,o.m])]];
        case 'vector': return [['v',pt([o.vx,o.vy])],['norma',fmt(Math.hypot(o.vx,o.vy))],['dirección',fmt(Math.atan2(o.vy,o.vx)*180/Math.PI)+'°']];
        case 'circ': return [['centro',pt([h,k])],['radio',fmt(o.r)]];
        case 'elipse': { const c=Math.sqrt(o.a**2-o.b**2), f=o.orient==='h'?[[h-c,k],[h+c,k]]:[[h,k-c],[h,k+c]];
          return [['centro',pt([h,k])],['a',fmt(o.a)],['b',fmt(o.b)],['c',fmt(c)],['e',fmt(c/o.a)],['lado recto',fmt(2*o.b*o.b/o.a)],['F₁',pt(f[0])],['F₂',pt(f[1])]]; }
        case 'parabola': return o.orient==='v'
          ? [['vértice',pt([h,k])],['p',fmt(o.p)],['foco',pt([h,k+o.p])],['directriz','y = '+fmt(k-o.p)],['lado recto',fmt(Math.abs(4*o.p))]]
          : [['vértice',pt([h,k])],['p',fmt(o.p)],['foco',pt([h+o.p,k])],['directriz','x = '+fmt(h-o.p)],['lado recto',fmt(Math.abs(4*o.p))]];
        case 'hiperbola': { const c=Math.hypot(o.a,o.b), f=o.orient==='h'?[[h-c,k],[h+c,k]]:[[h,k-c],[h,k+c]], m=o.orient==='h'?o.b/o.a:o.a/o.b;
          return [['centro',pt([h,k])],['a',fmt(o.a)],['b',fmt(o.b)],['c',fmt(c)],['e',fmt(c/o.a)],['asíntotas','m = ±'+fmt(m)],['F₁',pt(f[0])],['F₂',pt(f[1])]]; }
      }
    }

    /* ---------- reconocer Ax²+Cy²+Dx+Ey+F=0 ---------- */
    function coeficientes(txt){
      const lados=txt.toLowerCase().replace(/\s+/g,'').replace(/[−–]/g,'-').replace(/²/g,'^2').replace(/,/g,'.').split('=');
      if(lados.length>2) throw 'La ecuación tiene más de un signo =.';
      const c={x2:0,y2:0,x:0,y:0,c:0};
      lados.forEach((lado,li)=>{
        if(lado==='') throw 'Falta uno de los dos lados de la ecuación.';
        for(const t of lado.replace(/-/g,'+-').split('+').filter(Boolean)){
          if(/xy|yx/.test(t)) throw 'Por ahora no se reconocen términos con xy (cónicas rotadas).';
          const m=t.match(/^(-?)(\d*\.?\d*)\*?(x\^2|y\^2|x|y)?$/);
          if(!m||(m[2]===''&&!m[3])) throw 'No se reconoce el término «'+t+'».';
          const val=(m[1]?-1:1)*(m[2]===''?1:parseFloat(m[2]))*(li===1?-1:1);
          c[{'x^2':'x2','y^2':'y2','x':'x','y':'y'}[m[3]]||'c']+=val;
        }
      });
      return c;
    }
    function reconocer(txt){
      const q=coeficientes(txt), A=q.x2, C=q.y2, D=q.x, E=q.y, F=q.c, e=1e-12;
      if(Math.abs(A)<e&&Math.abs(C)<e){
        if(Math.abs(E)>e) return {tipo:'recta',p:{m:-D/E,n:-F/E},txt:'Recta'};
        throw Math.abs(D)>e?'Las rectas verticales todavía no están en el laboratorio.':'La ecuación no tiene variables.';
      }
      if(Math.abs(A)>e&&Math.abs(C)>e){
        const h=-D/(2*A), k=-E/(2*C), R=A*h*h+C*k*k-F;
        if(Math.abs(A-C)<e){
          const r2=R/A;
          if(r2>1e-12) return {tipo:'circ',p:{h,k,r:Math.sqrt(r2)},txt:'Circunferencia'};
          throw r2>-1e-12?'Al completar cuadrados queda r² = 0: la ecuación representa un solo punto, '+pt([h,k])+'.'
                         :'Al completar cuadrados queda r² = '+fmt(r2)+', negativo: no hay ninguna circunferencia real.';
        }
        if(A*C>0){
          const X=R/A, Y=R/C;
          if(X>0&&Y>0) return X>=Y
            ? {tipo:'elipse',p:{h,k,a:Math.sqrt(X),b:Math.sqrt(Y),orient:'h'},txt:'Elipse de eje mayor horizontal'}
            : {tipo:'elipse',p:{h,k,a:Math.sqrt(Y),b:Math.sqrt(X),orient:'v'},txt:'Elipse de eje mayor vertical'};
          throw Math.abs(R)<1e-12?'La ecuación representa un solo punto, '+pt([h,k])+'.'
                                 :'Al completar cuadrados el lado derecho queda negativo: no hay ninguna elipse real.';
        }
        if(Math.abs(R)<1e-12) throw 'Es una hipérbola degenerada: dos rectas que se cortan en '+pt([h,k])+'.';
        return R/A>0
          ? {tipo:'hiperbola',p:{h,k,a:Math.sqrt(R/A),b:Math.sqrt(-R/C),orient:'h'},txt:'Hipérbola de eje transverso horizontal'}
          : {tipo:'hiperbola',p:{h,k,a:Math.sqrt(R/C),b:Math.sqrt(-R/A),orient:'v'},txt:'Hipérbola de eje transverso vertical'};
      }
      if(Math.abs(A)>e){
        if(Math.abs(E)<e) throw 'Sin término en y no es una parábola: son rectas verticales o nada.';
        const h=-D/(2*A); return {tipo:'parabola',p:{h,k:(A*h*h-F)/E,p:-E/(4*A),orient:'v'},txt:'Parábola de eje vertical'};
      }
      if(Math.abs(D)<e) throw 'Sin término en x no es una parábola: son rectas horizontales o nada.';
      const k=-E/(2*C); return {tipo:'parabola',p:{h:(C*k*k-F)/D,k,p:-D/(4*C),orient:'h'},txt:'Parábola de eje horizontal'};
    }

    /* ---------- tarjeta de entrada ---------- */
    const c0=el('div',{class:'card'});
    c0.append(el('h3',{},'Agregar objetos'));
    const barra=el('div',{class:'controls'});
    Object.keys(TIPOS).forEach(t=>barra.append(el('button',{class:'btn',type:'button',
      onclick:()=>{ nuevo(t); todo(true); }},'+ '+TIPOS[t].t)));
    c0.append(barra);
    const inEc=el('input',{type:'text',value:'x² − 6x − 8y + 1 = 0','aria-label':'Ecuación general',autocomplete:'off'});
    const form=el('form',{class:'lab-ec'},inEc,el('button',{class:'btn primary',type:'submit'},'Reconocer y agregar'));
    c0.append(form);
    const ejemplos=el('p',{class:'lab-ej'},'Ejemplos: ');
    ['x² + y² + 4x − 6y + 9 = 0','9x² − 4y² − 36 = 0','4x² + 9y² − 16x + 18y − 11 = 0','x² + y² + 2x + 5 = 0'].forEach((ej,i)=>{
      if(i) ejemplos.append(' · ');
      ejemplos.append(el('button',{type:'button',onclick:()=>{ inEc.value=ej; inEc.focus(); }},ej));
    });
    c0.append(ejemplos);
    const msg=el('p',{class:'msg'});
    c0.append(msg);
    form.addEventListener('submit',ev=>{
      ev.preventDefault();
      try{
        const r=reconocer(inEc.value), o=nuevo(r.tipo,r.p);
        msg.className='msg okc'; msg.textContent=r.txt+' · agregada como '+o.nombre+'.';
        todo(true);
      }catch(err){
        msg.className='msg err'; msg.textContent=typeof err==='string'?err:'No se pudo leer la ecuación.';
      }
    });
    c0.append(el('p',{class:'note'},'Se reconoce cualquier ecuación de la forma ${Ax^2+Cy^2+Dx+Ey+F=0}$: la app completa cuadrados, decide qué cónica es y, si la ecuación no representa ninguna curva real, lo dice.'));
    sec.append(c0);

    /* ---------- plano y relaciones ---------- */
    const grid=el('div',{class:'lab-grid'});
    const cP=el('div',{class:'card'});
    cP.append(el('h3',{},'Plano'));
    const caja=el('div'); cP.append(caja);
    const P=Plano(caja,{xMin:-9.5,xMax:9.5,yMin:-6.5,yMax:6.5,alto:440,iso:true});
    cP.append(el('p',{class:'note'},'Los puntos rojos son las intersecciones. El objeto elegido se dibuja más grueso y con sus puntos notables.'));
    const relBox=el('div',{class:'lab-rel'});
    cP.append(relBox);

    const cO=el('div',{class:'card'});
    cO.append(el('h3',{},'Objetos'));
    const lista=el('div',{class:'lab-lista'});
    const det=el('div',{class:'lab-det'});
    cO.append(lista,det);
    grid.append(cP,cO);
    sec.append(grid);

    /* ---------- dibujo ---------- */
    function trazo(Q,pts,col,g,guiones){
      const c=Q.ctx; c.save(); c.strokeStyle=colorVar(col); c.lineWidth=g;
      if(guiones)c.setLineDash([6,5]);
      c.beginPath(); let ab=false;
      for(const [x,y] of pts){
        const px=Q.X(x), py=Q.Y(y);
        if(!isFinite(py)||Math.abs(py)>1e5){ ab=false; continue; }
        if(ab)c.lineTo(px,py); else c.moveTo(px,py); ab=true;
      }
      c.stroke(); c.restore();
    }
    function reticula(Q){
      const w=Q.ventana(), c=Q.ctx;
      c.save(); c.lineWidth=1;
      for(let i=Math.ceil(w.xMin);i<=w.xMax;i++){ c.strokeStyle=colorVar(i===0?'--axis':'--grid'); c.beginPath(); c.moveTo(Q.X(i),Q.Y(w.yMin)); c.lineTo(Q.X(i),Q.Y(w.yMax)); c.stroke(); }
      for(let j=Math.ceil(w.yMin);j<=w.yMax;j++){ c.strokeStyle=colorVar(j===0?'--axis':'--grid'); c.beginPath(); c.moveTo(Q.X(w.xMin),Q.Y(j)); c.lineTo(Q.X(w.xMax),Q.Y(j)); c.stroke(); }
      c.restore();
      for(let i=Math.ceil(w.xMin/2)*2;i<=w.xMax;i+=2) if(i) Q.texto(i,0,String(i).replace('-','−'),{color:'--muted',tam:11,dx:-4,dy:13});
      for(let j=Math.ceil(w.yMin/2)*2;j<=w.yMax;j+=2) if(j) Q.texto(0,j,String(j).replace('-','−'),{color:'--muted',tam:11,dx:5,dy:4});
    }
    P.dibujar(Q=>{
      reticula(Q);
      for(const o of objs.filter(x=>x.vis)){
        const g=o.id===sel?3.2:2;
        if(o.tipo==='vector'){
          if(Math.hypot(o.vx,o.vy)>1e-9) Q.vector(0,0,o.vx,o.vy,{color:o.color,grosor:g,punta:11});
          Q.texto(o.vx,o.vy,o.nombre,{color:o.color,tam:13,dx:7,dy:-7});
          continue;
        }
        for(const [t0,t1,f] of param(o)){ const pts=[]; for(let i=0;i<=600;i++) pts.push(f(t0+(t1-t0)*i/600)); trazo(Q,pts,o.color,g); }
        const et={recta:()=>[7,o.m*7+o.n],circ:()=>param(o)[0][2](.8),elipse:()=>param(o)[0][2](.8),
          parabola:()=>param(o)[0][2](2.5),hiperbola:()=>param(o)[0][2](.9)}[o.tipo]();
        Q.texto(et[0],et[1],o.nombre,{color:o.color,tam:13,dx:7,dy:-7});
        if(o.id!==sel) continue;
        const h=o.h, k=o.k;
        if(o.tipo==='circ') Q.punto(h,k,{color:'--muted',r:3.5});
        if(o.tipo==='elipse'||o.tipo==='hiperbola'){
          const c=o.tipo==='elipse'?Math.sqrt(o.a**2-o.b**2):Math.hypot(o.a,o.b);
          Q.punto(h,k,{color:'--muted',r:3.5});
          (o.orient==='h'?[[h-c,k],[h+c,k]]:[[h,k-c],[h,k+c]]).forEach(([x,y],i)=>{
            Q.punto(x,y,{color:o.color,r:4}); Q.texto(x,y,'F'+(i+1),{color:o.color,dx:-8,dy:18});
          });
          if(o.tipo==='hiperbola'){ const m=o.orient==='h'?o.b/o.a:o.a/o.b; [m,-m].forEach(s=>trazo(Q,[[h-30,k-30*s],[h+30,k+30*s]],'--muted',1,true)); }
        }
        if(o.tipo==='parabola'){
          Q.punto(h,k,{color:'--muted',r:3.5});
          const F=o.orient==='v'?[h,k+o.p]:[h+o.p,k];
          Q.punto(F[0],F[1],{color:o.color,r:4}); Q.texto(F[0],F[1],'F',{color:o.color,dx:8,dy:4});
          trazo(Q,o.orient==='v'?[[-40,k-o.p],[40,k-o.p]]:[[h-o.p,-40],[h-o.p,40]],'--muted',1,true);
        }
      }
      for(const r of rels) r.pts.forEach(p=>Q.punto(p[0],p[1],{color:'--s8',r:4.5}));
    });

    /* ---------- lista, detalle y relaciones ---------- */
    const sw=o=>el('span',{class:'sw',style:'background:var('+o.color+')'});
    function pintarLista(){
      lista.textContent='';
      objs.forEach(o=>{
        const elegir=()=>{ sel=o.id; todo(true); };
        const ojo=el('button',{class:'btn',type:'button',onclick:ev=>{ ev.stopPropagation(); o.vis=!o.vis; todo(); }},o.vis?'ocultar':'mostrar');
        const fila=el('div',{class:'lab-obj'+(o.id===sel?' on':'')+(o.vis?'':' oculto'),role:'button',tabindex:'0',
          onclick:elegir,onkeydown:ev=>{ if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); elegir(); } }},
          sw(o),el('span',{class:'nm'},o.nombre),el('span',{class:'tp'},TIPOS[o.tipo].t),ojo);
        lista.append(fila);
      });
    }
    let refs={};
    function pintarDetalle(){
      det.textContent=''; refs={};
      const o=objs.find(x=>x.id===sel);
      if(!o){ det.append(el('p',{class:'note'},'No hay objetos. Se agregan con los botones de arriba o escribiendo una ecuación.')); return; }
      det.append(el('h4',{},sw(o),o.nombre+' · '+TIPOS[o.tipo].t));
      if(['elipse','parabola','hiperbola'].includes(o.tipo)){
        const ops=o.tipo==='parabola'?[['v','Eje vertical'],['h','Eje horizontal']]:[['h','Eje horizontal'],['v','Eje vertical']];
        const btns=btnGroup(det,ops.map(([value,label])=>({label,value})),v=>{ o.orient=v; todo(); },false);
        btns.forEach((b,i)=>b.classList.toggle('on',ops[i][0]===o.orient));
      }
      if(o.tipo==='vector'){
        det.append(el('p',{class:'etq'},'Componentes'));
        refs.can=el('div',{class:'formula'}); det.append(refs.can);
      }else{
        det.append(el('p',{class:'etq'},o.tipo==='recta'?'Pendiente y coeficiente de posición':'Forma canónica'));
        refs.can=el('div',{class:'formula'}); det.append(refs.can);
        det.append(el('p',{class:'etq'},'Forma general'));
        refs.gen=el('div',{class:'formula'}); det.append(refs.gen);
      }
      refs.lect=lectura(det);
      refs.ctl={};
      for(const [key,min,max,paso] of CONTROLES[o.tipo]){
        refs.ctl[key]=controlValor(det,{label:key,min,max,paso,valor:o[key],unidad:'',onChange:v=>{
          o[key]=v;
          if(o.tipo==='elipse'&&o.b>o.a){ if(key==='a') refs.ctl.b.fijar(o.a); else { refs.ctl.b.fijar(o.a); return; } }
          if(o.tipo==='parabola'&&Math.abs(o.p)<.1){ refs.ctl.p.fijar(o.p<0?-.1:.1); return; }
          todo();
        }});
      }
      det.append(el('button',{class:'btn',type:'button',onclick:()=>{
        objs=objs.filter(x=>x!==o); sel=objs.length?objs[objs.length-1].id:null; todo(true);
      }},'Quitar '+o.nombre));
    }
    function actualizarDetalle(){
      const o=objs.find(x=>x.id===sel); if(!o||!refs.lect) return;
      refs.can.innerHTML='$$'+canonica(o)+'$$'; renderMath(refs.can);
      if(refs.gen){ refs.gen.innerHTML='$$'+poli(general(o))+'=0$$'; renderMath(refs.gen); }
      refs.lect.set(elementos(o));
    }
    function pintarRelaciones(){
      relBox.textContent='';
      relBox.append(el('h4',{},'Relaciones'));
      if(!rels.length){ relBox.append(el('p',{class:'note'},'Con dos objetos visibles o más, aquí aparece cómo se relaciona cada par.')); return; }
      const etq={corta:'se cortan',toca:'se tocan',nada:'no se cortan'};
      for(const r of rels){
        relBox.append(el('div',{class:'lab-fila'},
          el('span',{class:'par'},el('i',{style:'color:var('+r.A.color+')'},r.A.nombre),' y ',el('i',{style:'color:var('+r.B.color+')'},r.B.nombre)),
          el('span',{},el('span',{class:'lab-estado '+r.estado},etq[r.estado]),r.txt),
          el('span',{class:'pts'},r.pts.length?r.pts.map(pt).join('   '):'—')));
      }
    }
    function todo(rehacer){
      calcular();
      pintarLista();
      if(rehacer) pintarDetalle();
      actualizarDetalle();
      pintarRelaciones();
      P.redibujar();
    }

    nuevo('elipse',{h:2,k:-1,a:3,b:2,orient:'h'});
    nuevo('recta',{m:.5,n:-1.5});
    nuevo('circ',{h:-4,k:2.5,r:2});
    nuevo('vector',{vx:2,vy:3});
    sel=objs[0].id;
    todo(true);
  }
});
