/* Vectors: adding them, and the dot and cross products.
   Every question on this topic is one object in the list below: its numbers, text, hints,
   answer checks, "See it" panel and animation. See ADDING-QUESTIONS.md for how to add one. */
(function(){
"use strict";
const {fmt,pick,mi,up,sb,ssp,OP,FR,SQ,EQ,CALC,HALF,sq2,neg,IMPLIES,AND,PAREN,PI,OMEGA,V0,VI,VF,KE,KEI,KEF,DKE,legend,steps,checkline,finalAns,watch,calcTip,viz}=HL;
const {R3,clean,pr,sumTxt,draw}=PHYS;
const {F,mod,fadeIn,cyclist,speedLines,springScene,block,curvedArrow}=draw;

/* symbols and helpers used below */
const VA=`<b class="mu">a</b>`;
const VB=`<b class="mu">b</b>`;
const UI=`<b class="mu">i</b>`;
const UJ=`<b class="mu">j</b>`;
const UK=`<b class="mu">k</b>`;
const UV=[UI,UJ,UK];
const AX=["x","y","z"];
const comp=(n,i)=>sb(mi(n),AX[i]);
const vecTxt=(v,name,G)=>{let s="";v.forEach((x,i)=>{if(x===0)return;const ab=Math.abs(x),body=`${ab===1?"":ab}${UV[i]}`,key=name+AX[i];
  if(!s)s=G(key,`${x<0?"−":""}${body}`);else s+=` ${x<0?"−":"+"} ${G(key,body)}`;});return s;};
const vecPlain=v=>`(${v.map(x=>x<0?`−${-x}`:x).join(", ")})`;

/* for adding vectors */
const SX=sb(mi("S"),"x"),SY=sb(mi("S"),"y"),SUMV=`${VA} + ${VB}`,SUMLEN=`|${VA} + ${VB}|`;

PHYS.add("Vectors",[
{
  id:"vec-products", topic:"Vectors", level:"Medium", title:"Dot and cross product", hw:"Like HW 1, tasks 4 and 5",
  base:{a:[2,2,1],b:[2,-1,2]},
  random:()=>{const r=pick([[[2,2,1],[2,-1,2]],[[3,4,0],[0,3,4]],[[2,3,6],[6,2,3]],[[1,2,2],[4,0,3]],[[2,-2,1],[3,4,0]],[[1,-2,2],[2,3,6]]]);return {a:r[0],b:r[1]};},
  calc:p=>{const [ax,ay,az]=p.a,[bx,by,bz]=p.b;const dot=ax*bx+ay*by+az*bz,A=Math.hypot(ax,ay,az),B=Math.hypot(bx,by,bz),cos=dot/(A*B),th=Math.acos(cos)*180/Math.PI;
    const cx=ay*bz-az*by,cy=az*bx-ax*bz,cz=ax*by-ay*bx;return {dot,A,B,cos,th,sin:Math.sin(Math.acos(cos)),cx,cy,cz,cr:Math.hypot(cx,cy,cz)};},
  text:(p,G,T)=>`Two vectors are ${VA} = ${vecTxt(p.a,"a",G)} and ${VB} = ${vecTxt(p.b,"b",G)}, where ${T("ijk","i, j and k")} point along the x, y and z axes. (a) Find their ${T("dot","dot product")} ${VA} · ${VB}. (b) Find the angle between them, in degrees. (c) Find the ${T("mag","magnitude")} of their ${T("cross","cross product")}, |${VA} × ${VB}|.`,
  terms:{
    ijk:["i, j and k","Arrows of length 1 pointing along the x, y and z axes. So 2i + 3j means: 2 steps along x, 3 steps along y. A missing letter means 0 steps that way, and a letter on its own (like k) means 1 step."],
    dot:["Dot product","One way to multiply two vectors. The answer is a plain number, not a vector. It's big when the vectors point the same way and 0 when they are at 90°."],
    mag:["Magnitude","The length of a vector, always positive."],
    cross:["Cross product","The other way to multiply two vectors. The answer is a new vector at 90° to both of them. Its length equals the area of the parallelogram the two vectors make."]
  },
  given:p=>{const rows=[];["a","b"].forEach(n=>p[n].forEach((x,i)=>{const u=["i","j","k"][i];
    rows.push({k:n+AX[i],sym:comp(n,i),name:`${AX[i]}-component of ${n}`,unit:"",val:x,
      why:`The number in front of ${u} in ${n}.`,
      look:x===0?`There is no ${u} term in ${n}, so this component is 0.`:Math.abs(x)===1?`"${u}" on its own means 1${u}. Check the sign in front of it too.`:`Find the ${u} term of ${n}, and check the sign in front of it.`,
      gtraps:x<0?[[-x,`Watch the sign in front of it: it's a minus, so this component is negative.`]]:[]});}));return rows;},
  find:[
    {sym:`${VA} · ${VB}`,name:"dot product",unit:"",why:"Part (a). A plain number."},
    {sym:mi("θ"),name:"angle between the vectors",unit:"°",why:"Part (b). θ is the Greek letter theta."},
    {sym:`|${VA} × ${VB}|`,name:"magnitude of the cross product",unit:"",why:"Part (c). The bars | | mean length."}
  ],
  parts:[
    {id:"dot",label:"(a) Dot product a · b",sym:`${VA} · ${VB}`,unit:"",ans:(p,c)=>c.dot,traps:(p,c)=>clean([
      [p.a[0]*p.b[0]+p.a[1]*p.b[1],"You left out the z (k) parts. Multiply all three matching pairs and add."],
      [c.A*c.B,"That's |a| × |b|. The dot product is |a||b|cos θ, which is usually smaller. Multiply matching components instead."],
      [(p.a[0]+p.a[1]+p.a[2])*(p.b[0]+p.b[1]+p.b[2]),"Don't add each vector's components first. Multiply x with x, y with y, z with z, then add those three products."],
      [Math.abs(p.a[0]*p.b[0])+Math.abs(p.a[1]*p.b[1])+Math.abs(p.a[2]*p.b[2]),"Check the signs. A negative component makes that product negative."]
    ],c.dot)},
    {id:"th",label:"(b) Angle between them",sym:mi("θ"),unit:"°",ans:(p,c)=>c.th,traps:(p,c)=>clean([
      [c.cos,"That's cos θ. Now take the inverse cosine (cos⁻¹ or arccos on your calculator) to get the angle."],
      [Math.acos(c.cos),"That's the angle in radians. Multiply by 180 ÷ π to get degrees, or set your calculator to degrees."],
      [90-c.th,"That's 90° minus the angle. The dot product goes with cos θ, not sin θ."],
      [Math.acos(c.dot/(c.A+c.B))*180/Math.PI,"Divide by |a| × |b| (multiply the lengths), not |a| + |b|."]
    ],c.th)},
    {id:"cr",label:"(c) Magnitude of the cross product",sym:`|${VA} × ${VB}|`,unit:"",ans:(p,c)=>c.cr,traps:(p,c)=>clean([
      [c.A*c.B,"You forgot sin θ: |a × b| = |a||b| sin θ."],
      [Math.abs(c.dot),"That's the dot product. The cross product's size uses sin θ, not cos θ."],
      [c.cx*c.cx+c.cy*c.cy+c.cz*c.cz,"That's the length squared. Take the square root."],
      [Math.abs(c.cx+c.cy+c.cz),"Don't add the components. The length is √(x² + y² + z²)."]
    ],c.cr)}
  ],
  idea:(p,c)=>`<p>There are two ways to multiply vectors, and they answer different questions:</p>
    <ul class="plain">
      <li><b>Dot product:</b> multiply the matching components (x with x, y with y, z with z) and add the three results. You get a plain number. It also equals length × length × cos(angle), so it tells you the angle.</li>
      <li><b>Cross product:</b> gives a new vector at 90° to both. Its length is length × length × sin(angle).</li>
    </ul>
    <p>So the order is: <b>(a)</b> dot product from the components → find each vector's length → <b>(b)</b> the angle → <b>(c)</b> the cross product's length.</p>
    <p>A vector's length works like Pythagoras in 3D: square each component, add them up, take the square root.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${VA}·${VB}${OP("=")}${comp("a",0)}${comp("b",0)}${OP("+")}${comp("a",1)}${comp("b",1)}${OP("+")}${comp("a",2)}${comp("b",2)}`)+
    EQ(`|${VA}|${OP("=")}${SQ(`${sq2(comp("a",0))}${OP("+")}${sq2(comp("a",1))}${OP("+")}${sq2(comp("a",2))}`)}`)+
    EQ(`${VA}·${VB}${OP("=")}|${VA}||${VB}|${OP("")}cos${OP("")}${mi("θ")}${IMPLIES}cos${OP("")}${mi("θ")}${OP("=")}${FR(`${VA}·${VB}`,`|${VA}||${VB}|`)}`)+
    EQ(`|${VA}${OP("×")}${VB}|${OP("=")}|${VA}||${VB}|${OP("")}sin${OP("")}${mi("θ")}`)+
    legend([[comp("a",0),"x-component of a (the number in front of i)",""],[`|${VA}|`,"length (magnitude) of a",""],[mi("θ"),"angle between the vectors","°"]],
    `To get θ from cos θ, use the inverse cosine (cos⁻¹) on your calculator, set to degrees. You can also find the cross product from its components: ${VA} × ${VB} = (${comp("a",1)}${comp("b",2)} − ${comp("a",2)}${comp("b",1)})${UI} + (${comp("a",2)}${comp("b",0)} − ${comp("a",0)}${comp("b",2)})${UJ} + (${comp("a",0)}${comp("b",1)} − ${comp("a",1)}${comp("b",0)})${UK}, and then take its length.`),
  plug:(p,c)=>EQ(`${VA}·${VB}${OP("=")}${pr(p.a[0])}${OP("×")}${pr(p.b[0])}${OP("+")}${pr(p.a[1])}${OP("×")}${pr(p.b[1])}${OP("+")}${pr(p.a[2])}${OP("×")}${pr(p.b[2])}`)+
    EQ(`|${VA}|${OP("=")}${SQ(p.a.map(x=>sq2(pr(x))).join(OP("+")))}${AND}|${VB}|${OP("=")}${SQ(p.b.map(x=>sq2(pr(x))).join(OP("+")))}`)+
    EQ(`cos${OP("")}${mi("θ")}${OP("=")}${FR(`${VA}·${VB}`,`|${VA}||${VB}|`)}${AND}|${VA}${OP("×")}${VB}|${OP("=")}|${VA}||${VB}|${OP("")}sin${OP("")}${mi("θ")}`)+
    `<p>Remember: a missing component is 0, and a minus times a minus is a plus.</p>`+
    `<p class="tip"><b>Tip:</b> the answer box can work out <code>${c.dot}/(${fmt(c.A)}*${fmt(c.B)})</code> for you, but the inverse cosine (cos⁻¹) needs your calculator. Set it to degrees, then type the angle into the box.</p>`,
  solution:(p,c)=>steps([
      ["Write the components as lists",`${VA} = ${vecPlain(p.a)}, &nbsp;${VB} = ${vecPlain(p.b)}. A missing letter means 0.`],
      ["(a) Multiply matching components and add",CALC(`${VA}·${VB} = ${pr(p.a[0])} × ${pr(p.b[0])} + ${pr(p.a[1])} × ${pr(p.b[1])} + ${pr(p.a[2])} × ${pr(p.b[2])} = ${sumTxt(p.a.map((x,i)=>x*p.b[i]))} = <b>${fmt(c.dot)}</b>`)],
      ["Find each length",CALC(`|${VA}| = √(${p.a.map(x=>sq2(pr(x))).join(" + ")}) = √${fmt(c.A*c.A)} = ${fmt(c.A)}`)+CALC(`|${VB}| = √(${p.b.map(x=>sq2(pr(x))).join(" + ")}) = √${fmt(c.B*c.B)} = ${fmt(c.B)}`)],
      ["(b) Angle from the dot product",CALC(`cos ${mi("θ")} = ${fmt(c.dot)} ÷ (${fmt(c.A)} × ${fmt(c.B)}) = ${fmt(c.cos)} &nbsp;→&nbsp; ${mi("θ")} = cos⁻¹(${fmt(c.cos)}) = <b>${fmt(c.th)}°</b>`)+(c.dot<0?`<p class="small">The dot product is negative, so the angle is more than 90°.</p>`:"")],
      ["(c) Size of the cross product",CALC(`|${VA} × ${VB}| = ${fmt(c.A)} × ${fmt(c.B)} × sin ${fmt(c.th)}° = ${fmt(c.A*c.B)} × ${fmt(c.sin)} = <b>${fmt(c.cr)}</b>`)]
    ])+checkline(`With the component formula: ${VA} × ${VB} = ${vecPlain([c.cx,c.cy,c.cz])}, and its length is √(${[c.cx,c.cy,c.cz].map(x=>sq2(pr(x))).join(" + ")}) = √${fmt(c.cr*c.cr)} = ${fmt(c.cr)} ✓`)+
    finalAns(`${VA}·${VB} = ${fmt(c.dot)}, &nbsp;${mi("θ")} = ${fmt(c.th)}°, &nbsp;|${VA} × ${VB}| = ${fmt(c.cr)}`),
  sheet:[
    {name:"Dot product",eq:`${VA}·${VB}${OP("=")}${comp("a",0)}${comp("b",0)}${OP("+")}${comp("a",1)}${comp("b",1)}${OP("+")}${comp("a",2)}${comp("b",2)}${OP("=")}|${VA}||${VB}|${OP("")}cos${OP("")}${mi("θ")}`,note:"A plain number. Zero when the vectors are at 90°."},
    {name:"Length of a vector",eq:`|${VA}|${OP("=")}${SQ(`${sq2(comp("a",0))}${OP("+")}${sq2(comp("a",1))}${OP("+")}${sq2(comp("a",2))}`)}`,note:"Pythagoras in 3D."},
    {name:"Cross product size",eq:`|${VA}${OP("×")}${VB}|${OP("=")}|${VA}||${VB}|${OP("")}sin${OP("")}${mi("θ")}`,note:"Area of the parallelogram made by a and b."}
  ],
  takeEq:()=>`cos${OP("")}${mi("θ")}${OP("=")}${FR(`${VA}·${VB}`,`|${VA}||${VB}|`)}`,
  takeaway:"Dot product: multiply matching components and add. Divide by both lengths to get cos θ. Cross product size: |a||b| sin θ.",
  link:"HW 1, task 5 is part (b) backwards: you're given the dot product and both lengths, and you find the angle with cos θ = a·b ÷ (|a||b|). HW 1, task 4 asks for a + b (add matching components) and a × b (use the component formula from hint 3).",
  viz:{
    html:(p,c)=>`<p class="sec-note">Two arrows with the same lengths as your vectors (${fmt(c.A)} and ${fmt(c.B)}). Drag the angle between them. The dot product drops to 0 at 90° and turns negative after that. The cross product's size is the shaded area.</p>
      <div class="viz-box">
        <label class="viz-l" for="vc-a">Angle between them: <output id="vc-ao">${Math.round(c.th)}</output>°</label>
        <input type="range" id="vc-a" min="0" max="180" step="1" value="${Math.round(c.th)}">
        <svg class="vsvg" viewBox="0 0 400 190" role="img" aria-label="Two vectors and the parallelogram they make">
          <polygon id="vc-par" style="fill:var(--blue-soft);stroke:none"/>
          <line id="vc-la" class="v-main" x1="200" y1="170" y2="170"/>
          <line id="vc-lb" class="v-main" x1="200" y1="170" style="stroke:var(--heat)"/>
          <circle id="vc-ta" r="4" cy="170" style="fill:var(--blue)"/><circle id="vc-tb" r="4" style="fill:var(--heat)"/>
          <text id="vc-xa" class="v-text" y="184">a</text><text id="vc-xb" class="v-text">b</text>
        </svg>
        <p class="viz-read" id="vc-read"></p>
      </div>`,
    setup:(p,c,ctx)=>{
      const r=ctx.$("#vc-a"),s=95/Math.max(c.A,c.B),la=c.A*s,lb=c.B*s,ox=200,oy=170;
      const upd=()=>{const deg=+r.value,t=deg*Math.PI/180,ax=ox+la,bx=ox+lb*Math.cos(t),by=oy-lb*Math.sin(t);
        ctx.$("#vc-ao").textContent=deg;
        ctx.$("#vc-la").setAttribute("x2",ax.toFixed(1));ctx.$("#vc-ta").setAttribute("cx",ax.toFixed(1));ctx.$("#vc-xa").setAttribute("x",(ax+6).toFixed(1));
        const lb_=ctx.$("#vc-lb");lb_.setAttribute("x2",bx.toFixed(1));lb_.setAttribute("y2",by.toFixed(1));
        ctx.$("#vc-tb").setAttribute("cx",bx.toFixed(1));ctx.$("#vc-tb").setAttribute("cy",by.toFixed(1));
        const xb=ctx.$("#vc-xb");xb.setAttribute("x",(bx+6).toFixed(1));xb.setAttribute("y",(by-6).toFixed(1));
        ctx.$("#vc-par").setAttribute("points",`${ox},${oy} ${ax.toFixed(1)},${oy} ${(ax+bx-ox).toFixed(1)},${by.toFixed(1)} ${bx.toFixed(1)},${by.toFixed(1)}`);
        const d=c.A*c.B*Math.cos(t),x=c.A*c.B*Math.sin(t);
        ctx.$("#vc-read").innerHTML=`At ${deg}°: dot product = ${fmt(c.A)} × ${fmt(c.B)} × cos ${deg}° = <b>${fmt(Math.round(d*1000)/1000)}</b>, cross product size = ${fmt(c.A)} × ${fmt(c.B)} × sin ${deg}° = <b>${fmt(Math.round(x*1000)/1000)}</b>${Math.abs(deg-c.th)<0.6?" (your vectors)":""}`;};
      r.addEventListener("input",upd);upd();
    }
  },
  scene:{still:1,draw(K,t,p){
  const M=Math.max(Math.hypot(...p.a),Math.hypot(...p.b)),s=88/M,cx=300,cy=128,phi=0.6+0.32*t,e=0.42;
  const P=v=>{const xr=v[0]*Math.cos(phi)-v[1]*Math.sin(phi),yr=v[0]*Math.sin(phi)+v[1]*Math.cos(phi);return [cx+s*xr,cy-s*(v[2]*Math.cos(e)+yr*Math.sin(e))];};
  const L=M*1.15;[["x",[L,0,0]],["y",[0,L,0]],["z",[0,0,L]]].forEach(([n,v])=>{const o=P([0,0,0]),q=P(v),qn=P(v.map(z=>-z*0.5));K.line(o[0],o[1],qn[0],qn[1],{c:"rule",w:1.2});K.arrow(o[0],o[1],q[0],q[1],{c:"ink2",w:1.4,head:7});K.text(n,q[0]+(q[0]-o[0])*0.08,q[1]+(q[1]-o[1])*0.08,{serif:true,italic:true,c:"ink2",size:13});});
  const o=P([0,0,0]),A=P(p.a),B=P(p.b);
  K.arrow(o[0],o[1],A[0],A[1],{c:"blue",w:3,head:11});K.arrow(o[0],o[1],B[0],B[1],{c:"heat",w:3,head:11});
  K.text("a",A[0]+10,A[1]-8,{serif:true,italic:true,bold:true,c:"blue",size:16});K.text("b",B[0]+10,B[1]-8,{serif:true,italic:true,bold:true,c:"heat",size:16});
  const vt=(v,n)=>`${n} = (${v.map(z=>String(z).replace("-","−")).join(", ")})`;
  K.tag(vt(p.a,"a"),24,26,{align:"left",size:11,c:"blue"});K.tag(vt(p.b,"b"),24,52,{align:"left",size:11,c:"heat"});
}}
},

/* ===== Adding vectors ===== */
{
  id:"vec-add", level:"Easy", title:"Adding vectors", hw:"Like HW 1, task 4",
  base:{a:[3,-2],b:[1,5]},
  random:()=>{const n=()=>{let x;do{x=Math.floor(Math.random()*13)-6;}while(x===0);return x;};for(;;){const a=[n(),n()],b=[n(),n()];if(a[0]+b[0]!==0&&a[1]+b[1]!==0)return {a,b};}},
  calc:p=>{const sx=p.a[0]+p.b[0],sy=p.a[1]+p.b[1];return {sx,sy,len:Math.hypot(sx,sy),la:Math.hypot(...p.a),lb:Math.hypot(...p.b)};},
  text:(p,G,T)=>`Two vectors are ${VA} = ${vecTxt(p.a,"a",G)} and ${VB} = ${vecTxt(p.b,"b",G)}, where ${T("ij","i and j")} point along the x and y axes. Find (a) the x-component and (b) the y-component of ${SUMV}, and (c) its ${T("mag","magnitude")} |${SUMV}|.`,
  terms:{
    ij:["i and j","Arrows of length 1 pointing along the x and y axes. So 3i − 2j means: 3 steps along x and 2 steps down y. A letter on its own (like j) means 1 step."],
    mag:["Magnitude","The length of a vector, always positive. Bars | | around a vector mean its length."]
  },
  given:p=>{const rows=[];["a","b"].forEach(n=>p[n].forEach((x,i)=>{const u=["i","j"][i];
    rows.push({k:n+AX[i],sym:comp(n,i),name:`${AX[i]}-component of ${n}`,unit:"",val:x,why:`The number in front of ${u} in ${n}.`,
      look:Math.abs(x)===1?`"${u}" on its own means 1${u}. Check the sign in front of it too.`:`Find the ${u} term of ${n}, and check the sign in front of it.`,
      gtraps:x<0?[[-x,"Watch the sign in front of it: it's a minus, so this component is negative."]]:[]});}));return rows;},
  find:[{sym:SX,name:"x-component of a + b",unit:"",why:"Part (a)."},{sym:SY,name:"y-component of a + b",unit:"",why:"Part (b)."},{sym:SUMLEN,name:"length of a + b",unit:"",why:"Part (c)."}],
  parts:[
    {id:"sx",label:"(a) x-component of a + b",sym:SX,unit:"",ans:(p,c)=>c.sx,traps:(p,c)=>clean([[p.a[0]-p.b[0],"Add the two x-components: aₓ + bₓ."],[p.a[0]+p.a[1],"Add the x-component of a to the x-component of b (not to a's own y)."],[p.a[0]*p.b[0],"Add, don't multiply."]],c.sx)},
    {id:"sy",label:"(b) y-component of a + b",sym:SY,unit:"",ans:(p,c)=>c.sy,traps:(p,c)=>clean([[p.a[1]-p.b[1],"Add the two y-components: a_y + b_y."],[p.b[0]+p.b[1],"Add the y-component of a to the y-component of b."],[p.a[1]*p.b[1],"Add, don't multiply."]],c.sy)},
    {id:"len",label:"(c) Magnitude of a + b",sym:SUMLEN,unit:"",ans:(p,c)=>c.len,traps:(p,c)=>clean([[c.la+c.lb,"Lengths only add like that when the vectors point the same way. Add the components first, then use Pythagoras."],[Math.abs(c.sx)+Math.abs(c.sy),"Use Pythagoras: √(Sₓ² + S_y²), not Sₓ + S_y."],[c.sx*c.sx+c.sy*c.sy,"That's the length squared. Take the square root."]],c.len)}
  ],
  idea:()=>`<p>To add vectors, add matching components: x with x, y with y. The result is a new vector.</p>
    <p>Its length (magnitude) comes from Pythagoras: the x-component and the y-component are the two short sides of a right-angled triangle, and the vector is the long side.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${SX}${OP("=")}${comp("a",0)}${OP("+")}${comp("b",0)}${AND}${SY}${OP("=")}${comp("a",1)}${OP("+")}${comp("b",1)}`)+EQ(`${SUMLEN}${OP("=")}${SQ(`${sq2(SX)}${OP("+")}${sq2(SY)}`)}`)+
    legend([[comp("a",0),"x-component of a (the number in front of i)",""],[SX,"x-component of the sum",""]]),
  plug:p=>EQ(`${SX}${OP("=")}${pr(p.a[0])}${OP("+")}${pr(p.b[0])}${AND}${SY}${OP("=")}${pr(p.a[1])}${OP("+")}${pr(p.b[1])}`)+EQ(`${SUMLEN}${OP("=")}${SQ(`${sq2(SX)}${OP("+")}${sq2(SY)}`)}`),
  solution:(p,c)=>steps([
      ["(a) Add the x-components",CALC(`${SX} = ${pr(p.a[0])} + ${pr(p.b[0])} = <b>${fmt(c.sx)}</b>`)],
      ["(b) Add the y-components",CALC(`${SY} = ${pr(p.a[1])} + ${pr(p.b[1])} = <b>${fmt(c.sy)}</b>`)],
      ["(c) Pythagoras",CALC(`${SUMLEN} = √(${sq2(pr(c.sx))} + ${sq2(pr(c.sy))}) = √${fmt(c.sx*c.sx+c.sy*c.sy)} = <b>${fmt(c.len)}</b>`)]
    ])+checkline(`So ${SUMV} = ${vecPlain([c.sx,c.sy])}. Its length (${fmt(c.len)}) is at most |a| + |b| = ${fmt(c.la)} + ${fmt(c.lb)} = ${fmt(c.la+c.lb)} ✓`)+
    finalAns(`${SX} = ${fmt(c.sx)}, &nbsp;${SY} = ${fmt(c.sy)}, &nbsp;${SUMLEN} = ${fmt(c.len)}`),
  sheet:[{name:"Adding vectors",eq:`${SUMV}${OP("=")}(${comp("a",0)}${OP("+")}${comp("b",0)}, ${comp("a",1)}${OP("+")}${comp("b",1)})`,note:"Add matching components. Length: Pythagoras."}],
  takeEq:()=>`${SUMLEN}${OP("=")}${SQ(`${sq2(SX)}${OP("+")}${sq2(SY)}`)}`,
  takeaway:"Add x with x and y with y, then use Pythagoras for the length.",
  link:"HW 1, task 4 asks for a + b in 3D: the same idea with a third (z) component.",
  viz:{
    html:(p,c)=>{const s=14,ox=200,oy=110,P=(x,y)=>`${ox+x*s},${oy-y*s}`,ax=p.a[0],ay=p.a[1];
      return `<p class="sec-note">Put b's tail on a's tip (blue then orange). The sum (green) goes from the start of a to the tip of b: ${fmt(c.sx)} across and ${fmt(c.sy)} up.</p>
      <div class="viz-box"><svg class="vsvg" viewBox="0 0 400 220" role="img" aria-label="Vectors a and b added tip to tail">
        ${[...Array(27)].map((_,i)=>`<line x1="${ox+(i-13)*s}" y1="12" x2="${ox+(i-13)*s}" y2="208" style="stroke:var(--rule);stroke-width:${i===13?1.4:0.5}"/>`).join("")}
        ${[...Array(15)].map((_,j)=>`<line x1="18" y1="${oy+(j-7)*s}" x2="382" y2="${oy+(j-7)*s}" style="stroke:var(--rule);stroke-width:${j===7?1.4:0.5}"/>`).join("")}
        <line x1="${ox}" y1="${oy}" x2="${ox+ax*s}" y2="${oy-ay*s}" style="stroke:var(--blue);stroke-width:3"/>
        <line x1="${ox+ax*s}" y1="${oy-ay*s}" x2="${ox+(ax+p.b[0])*s}" y2="${oy-(ay+p.b[1])*s}" style="stroke:var(--heat);stroke-width:3"/>
        <line x1="${ox}" y1="${oy}" x2="${ox+c.sx*s}" y2="${oy-c.sy*s}" style="stroke:var(--ok);stroke-width:3;stroke-dasharray:6 4"/>
        <circle cx="${ox+c.sx*s}" cy="${oy-c.sy*s}" r="4" style="fill:var(--ok)"/>
      </svg><p class="viz-read">${SUMV} = ${vecPlain([c.sx,c.sy])}, length ${fmt(c.len)}</p></div>`;}
  },
  scene:{still:3,draw(K,t,p){const u=mod(t,6),cx=300,cy=110,sc=14,ga=K.clamp(u/1.1,0,1),gb=K.clamp((u-1)/1.1,0,1);
    for(let i=-10;i<=10;i++)K.line(cx+i*sc,cy-7*sc,cx+i*sc,cy+7*sc,{c:"rule",w:i===0?1.4:0.6,alpha:i===0?1:0.6});
    for(let j=-7;j<=7;j++)K.line(cx-10*sc,cy+j*sc,cx+10*sc,cy+j*sc,{c:"rule",w:j===0?1.4:0.6,alpha:j===0?1:0.6});
    if(ga>0.05){K.arrow(cx,cy,cx+p.a[0]*sc*ga,cy-p.a[1]*sc*ga,{c:"blue",w:3,head:10});if(ga>=1)K.text("a",cx+p.a[0]*sc+10,cy-p.a[1]*sc-8,{serif:true,italic:true,bold:true,c:"blue",size:16});}
    if(gb>0.05){K.arrow(cx,cy,cx+p.b[0]*sc*gb,cy-p.b[1]*sc*gb,{c:"heat",w:3,head:10});if(gb>=1)K.text("b",cx+p.b[0]*sc+10,cy-p.b[1]*sc-8,{serif:true,italic:true,bold:true,c:"heat",size:16});}
    if(u>5.4)K.rect(0,0,600,220,{fill:"bg",c:false,alpha:(u-5.4)/0.6});}}
}
]);
})();
