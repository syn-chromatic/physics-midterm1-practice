/* Momentum: impulse, collisions and the centre of mass.
   Every question on this topic is one object in the list below: its numbers, text, hints,
   answer checks, "See it" panel and animation. See ADDING-QUESTIONS.md for how to add one. */
(function(){
"use strict";
const {fmt,pick,mi,up,sb,ssp,OP,FR,SQ,EQ,CALC,HALF,sq2,neg,IMPLIES,AND,PAREN,PI,OMEGA,V0,VI,VF,KE,KEI,KEF,DKE,legend,steps,checkline,finalAns,watch,calcTip,viz}=HL;
const {R3,clean,pr,sumTxt,draw}=PHYS;
const {F,mod,fadeIn,cyclist,speedLines,springScene,block,curvedArrow}=draw;

/* symbols and helpers used below */
const M1=sb(mi("m"),"1");
const M2=sb(mi("m"),"2");
const V1=sb(mi("v"),"1");
const V2=sb(mi("v"),"2");
const VV=mi("V");
const DT=up("Δ")+mi("t");
const JJ=mi("J");
const FF=mi("F");
const V1P=`${sb(mi("v"),"1")}′`;
const V2P=`${sb(mi("v"),"2")}′`;
const M3=sb(mi("m"),"3");
const XC=sb(mi("x"),"cm");
const YC=sb(mi("y"),"cm");
const LS=mi("l");
const HH=mi("h");
const DD=mi("d");

/* for the bouncing ball */
const PB=mi("p"),MB=mi("m"),FAV=sb(mi("F"),"avg");

PHYS.add("Momentum",[
{
  id:"mom-clay", topic:"Momentum", level:"Medium", title:"Clay hits a block", hw:"Like HW 1, task 3",
  base:{m1:0.2,v1:15,m2:0.8,dt:0.01},
  random:()=>{const r=pick([[0.2,15,0.8],[0.5,12,1.5],[0.1,20,0.4],[0.3,10,1.2],[0.25,16,0.75],[0.4,9,0.8]]);return {m1:r[0],v1:r[1],m2:r[2],dt:pick([0.01,0.02,0.005])};},
  calc:p=>{const M=p.m1+p.m2,p0=p.m1*p.v1,V=p0/M,J=p.m1*(p.v1-V);return {M,p0,V,J,F:J/p.dt,KE0:0.5*p.m1*p.v1*p.v1,KE1:0.5*M*V*V};},
  text:(p,G,T)=>`A ${G("m1",`${p.m1} kg`)} lump of clay flies horizontally at ${G("v1",`${p.v1} m/s`)} and hits a ${G("m2",`${p.m2} kg`)} wooden block that is ${G("v2","resting")} on smooth ${T("ice","ice")}. The clay sticks to the block. (a) How fast do they move together after the hit? (b) What is the size of the ${T("imp","impulse")} on the clay? (c) The collision lasts ${G("dt",`${p.dt} s`)}. What is the average force between the clay and the block?`,
  terms:{
    ice:["Smooth ice","No friction. So nothing outside pushes sideways on the clay and the block, and their total momentum stays the same."],
    imp:["Impulse","How much an object's momentum changes: momentum after − momentum before. Measured in N·s, which is the same as kg·m/s."]
  },
  given:p=>[
    {k:"m1",sym:M1,name:"mass of the clay",unit:"kg",val:p.m1,why:"Object 1 is the clay.",look:"The first mass in the question belongs to the clay."},
    {k:"v1",sym:V1,name:"speed of the clay before",unit:"m/s",val:p.v1,why:"How fast the clay flies before the hit."},
    {k:"m2",sym:M2,name:"mass of the block",unit:"kg",val:p.m2,why:"Object 2 is the block.",look:"The second mass in the question belongs to the block."},
    {k:"v2",sym:V2,name:"speed of the block before",unit:"m/s",val:0,why:`"Resting" means not moving, so this is 0. Another number hidden in words.`,look:`The block is "resting". What speed is that?`},
    {k:"dt",sym:DT,name:"collision time",unit:"s",val:p.dt,why:`How long the clay and block push on each other. Δ means "change in", so Δt is a stretch of time.`}
  ],
  find:[
    {sym:VV,name:"speed together after the hit",unit:"m/s",why:"Part (a). Capital V, because it's one shared speed."},
    {sym:JJ,name:"impulse on the clay",unit:"N·s",why:"Part (b)."},
    {sym:FF,name:"average force",unit:"N",why:"Part (c)."}
  ],
  parts:[
    {id:"V",label:"(a) Speed together after the hit",sym:VV,unit:"m/s",ans:(p,c)=>c.V,traps:(p,c)=>[
      [c.p0/p.m2,`You divided by the block's mass only. After the hit the clay and block move as one object, so divide by the total mass (${p.m1} + ${p.m2}).`],
      [p.v1*p.m2/c.M,"The masses are swapped. It's the clay's momentum (m₁v₁) divided by the total mass."],
      [p.v1/2,"Averaging the speeds doesn't work, because the masses are different. Use momentum: m₁v₁ = (m₁ + m₂)V."],
      [p.v1*Math.sqrt(p.m1/c.M),"It looks like you used kinetic energy. When objects stick together, kinetic energy is not conserved (some turns into heat). Momentum is: m₁v₁ = (m₁ + m₂)V."],
      [p.v1,"If the speed stayed the same, the pair would have gained momentum from nowhere. Use m₁v₁ = (m₁ + m₂)V."]
    ]},
    {id:"J",label:"(b) Size of the impulse on the clay",sym:JJ,unit:"N·s",ans:(p,c)=>c.J,traps:(p,c)=>[
      [c.p0,"That's the clay's momentum before the hit. Impulse is the change in momentum: m₁V − m₁v₁."],
      [p.m1*c.V,"That's the clay's momentum after the hit. Impulse is the change: after − before."],
      [p.m1*(p.v1+c.V),"Subtract the speeds, don't add them: J = m₁V − m₁v₁."]
    ]},
    {id:"F",label:"(c) Average force",sym:FF,unit:"N",ans:(p,c)=>c.F,traps:(p,c)=>[
      [c.J*p.dt,"Divide by the time, don't multiply: F = J ÷ Δt."],
      [c.p0/p.dt,"Use the change in the clay's momentum (the impulse), not its momentum before the hit."],
      [p.m1*9.8,"That's the clay's weight. The collision force comes from the impulse: F = J ÷ Δt."]
    ]}
  ],
  idea:(p,c)=>`<p><b>Momentum</b> is mass × velocity: how much "oomph" a moving object has. When two objects hit and nothing outside pushes on them (the ice has no friction), <b>total momentum before = total momentum after</b>.</p>
    <ul class="plain"><li><b>Before:</b> only the clay moves. The block is resting, so its momentum is 0.</li><li><b>After:</b> clay and block move together as one object with the combined mass.</li></ul>
    <p><b>(b)</b> Impulse is how much the clay's own momentum changed: its momentum after minus its momentum before.</p>
    <p><b>(c)</b> A force acting for a short time changes momentum. Newton's second law in momentum form: force = change in momentum ÷ time.</p>
    <div class="watch"><b>Watch out:</b> kinetic energy is <b>not</b> conserved when things stick together. Some of it turns into heat and squashing the clay. Use momentum.</div>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${M1}${V1}${OP("+")}${M2}${V2}${OP("=")}(${M1}${OP("+")}${M2})${VV}`)+
    EQ(`${JJ}${OP("=")}${M1}${VV}${OP("−")}${M1}${V1}`)+
    EQ(`${FF}${OP("=")}${FR(JJ,DT)}`)+
    legend([[M1,"mass of the clay","kg"],[V1,"speed of the clay before","m/s"],[M2,"mass of the block","kg"],[V2,"speed of the block before","m/s"],[VV,"shared speed after","m/s"],[JJ,"impulse on the clay","N·s"],[DT,"collision time","s"],[FF,"average force","N"]],
    `Momentum is mass × velocity (${mi("p")} = ${mi("m")}${mi("v")}). The first line says: total momentum before = total momentum after. In (b) the impulse comes out negative because the clay slows down. The question asks for its size, so drop the minus sign.`),
  plug:(p,c)=>EQ(`${p.m1}${OP("×")}${p.v1}${OP("+")}${p.m2}${OP("×")}0${OP("=")}(${p.m1}${OP("+")}${p.m2})${OP("×")}${VV}`)+
    EQ(`${JJ}${OP("=")}${p.m1}${OP("×")}${VV}${OP("−")}${p.m1}${OP("×")}${p.v1}`)+
    EQ(`${FF}${OP("=")}${FR(JJ,p.dt)}`)+
    `<p>Solve the first line for ${VV}: work out the left side, then divide by the total mass. Use your ${VV} in the second line, and your ${JJ} (without the minus sign) in the third.</p>`+
    calcTip(`${p.m1}*${p.v1}/(${p.m1}+${p.m2})`),
  solution:(p,c)=>steps([
      ["Write down what you know",`${M1} = ${p.m1} kg, &nbsp;${V1} = ${p.v1} m/s, &nbsp;${M2} = ${p.m2} kg, &nbsp;${V2} = 0, &nbsp;${DT} = ${p.dt} s.`],
      ["Total momentum before",CALC(`${M1}${V1} + ${M2}${V2} = ${p.m1} × ${p.v1} + ${p.m2} × 0 = <b>${fmt(c.p0)} kg·m/s</b>`)],
      ["(a) Momentum after = momentum before",CALC(`(${p.m1} + ${p.m2}) × ${VV} = ${fmt(c.p0)}, &nbsp;so&nbsp; ${VV} = ${fmt(c.p0)} ÷ ${fmt(c.M)} = <b>${fmt(c.V)} m/s</b>`)],
      ["(b) Change in the clay's momentum",CALC(`${JJ} = ${p.m1} × ${fmt(c.V)} − ${p.m1} × ${p.v1} = ${fmt(p.m1*c.V)} − ${fmt(c.p0)} = −${fmt(c.J)} N·s`)+`<p class="small">The minus sign means the push on the clay points backwards: it slows the clay down. The size is <b>${fmt(c.J)} N·s</b>.</p>`],
      ["(c) Average force",CALC(`${FF} = ${fmt(c.J)} ÷ ${p.dt} = <b>${fmt(c.F)} N</b>`)]
    ])+checkline(`Newton's third law: the block gets an impulse of the same size the other way: ${M2}${VV} = ${p.m2} × ${fmt(c.V)} = ${fmt(p.m2*c.V)} N·s ✓<br>Energy: before ½ × ${p.m1} × ${sq2(p.v1)} = ${fmt(c.KE0)} J, after ½ × ${fmt(c.M)} × ${sq2(fmt(c.V))} = ${fmt(c.KE1)} J. So ${fmt(c.KE0-c.KE1)} J turned into heat and squashing, which is normal when things stick together.`)+
    finalAns(`${VV} = ${fmt(c.V)} m/s, &nbsp;${JJ} = ${fmt(c.J)} N·s, &nbsp;${FF} = ${fmt(c.F)} N`),
  sheet:[
    {name:"Momentum conservation (objects stick)",eq:`${M1}${V1}${OP("+")}${M2}${V2}${OP("=")}(${M1}${OP("+")}${M2})${VV}`,note:"Works when nothing outside pushes. Kinetic energy is NOT conserved when they stick."},
    {name:"Impulse",eq:`${JJ}${OP("=")}${up("Δ")}${mi("p")}${OP("=")}${mi("m")}${sb(mi("v"),"after")}${OP("−")}${mi("m")}${sb(mi("v"),"before")}`,note:"In N·s, the same as kg·m/s."},
    {name:"Average force (Newton's second law)",eq:`${FF}${OP("=")}${FR(`${up("Δ")}${mi("p")}`,DT)}`,note:"Force = change in momentum ÷ time."}
  ],
  takeEq:()=>`${M1}${V1}${OP("+")}${M2}${V2}${OP("=")}(${M1}${OP("+")}${M2})${VV}`,
  takeaway:"When things stick together, total momentum stays the same but kinetic energy doesn't. Impulse is the change in one object's momentum, and force = impulse ÷ time.",
  link:"HW 1, task 3 asks for this impulse in two cases. The completely inelastic case works exactly like this. The completely elastic case is different: the objects bounce apart, and both momentum and kinetic energy are conserved.",
  viz:viz.slider((p,c)=>({
    note:"Try different block masses. A heavier block means a slower pair after the hit, and more of the clay's energy lost to heat and squashing.",
    label:"Mass of the block",unit:"kg",min:0.05,max:Math.round(p.m2*4*100)/100,step:0.05,value:p.m2,
    bars:[
      {label:"Speed after the hit, compared with the clay's speed before",segs:[{cls:"seg-ke",frac:x=>p.m1/(p.m1+x)}]},
      {label:"Where the clay's kinetic energy goes",segs:[{cls:"seg-ke",name:"stays as motion",frac:x=>p.m1/(p.m1+x)},{cls:"seg-heat",name:"heat and squashing",frac:x=>x/(p.m1+x)}]}
    ],
    read:x=>`Block of ${fmt(x)} kg: ${VV} = ${fmt(c.p0)} ÷ ${fmt(p.m1+x)} = <b>${fmt(c.p0/(p.m1+x))} m/s</b>, and <b>${fmt(100*x/(p.m1+x))}%</b> of the kinetic energy is lost.`
  })),
  scene:{still:0.9,draw(K,t,p){
  const y=168,u=mod(t,5.4),bw=84,bh=44,bx0=330;
  K.rect(0,y,600,52,{fill:"blueSoft",c:false});K.line(0,y,600,y,{c:"ink2",w:1.5});
  for(let i=0;i<6;i++){const gx=mod(40+i*110-0,600);K.line(gx,y+14,gx+28,y+14,{c:"card",w:2,alpha:0.8});}
  let bx=bx0,cx,squash=false;
  if(u<1.5){cx=20+((bx0-bw/2-9)-20)*(u/1.5);}else{const s=Math.min(u,4.6)-1.5;bx=bx0+48*s;cx=bx-bw/2-5;squash=true;}
  block(K,bx,y,bw,bh,`${p.m2} kg`,{fill:"card"});
  if(!squash){speedLines(K,cx-12,y-10,3,24,0.55);K.circle(cx,y-22,9,{fill:"heat",c:"ink",w:1.4});K.tag(`${p.m1} kg · ${p.v1} m/s`,cx,y-50,{size:11});}
  else K.ellipse(cx,y-22,6,11,{fill:"heat",c:"ink",w:1.4});
  if(u>1.45&&u<1.9){const k=(u-1.45)/0.45;K.circle(bx0-bw/2,y-22,10+26*k,{c:"heat",w:2,alpha:1-k});}
  if(u>=1.5&&u<4.8)K.tag(`collision lasts ${p.dt} s`,bx0-bw/2,40,{size:11,alpha:u<2.6?1:Math.max(0,1-(u-2.6)/0.6)});
  if(u>4.8)K.rect(0,0,600,220,{fill:"bg",c:false,alpha:(u-4.8)/0.6});
}}
},

{
  id:"mom-com", topic:"Momentum", level:"Medium", title:"Centre of mass", hw:"Like HW 1, task 1",
  base:{m1:2,m2:3,m3:1,lc:120},
  random:()=>{const r=pick([[2,3,1,120],[1,2,3,90],[4,1,1,60],[2,2,4,150],[3,1,2,100],[1.5,2.5,1,80]]);return {m1:r[0],m2:r[1],m3:r[2],lc:r[3]};},
  calc:p=>{const l=p.lc/100,h=l*Math.sqrt(3)/2,M=p.m1+p.m2+p.m3,xc=(p.m2*l+p.m3*l/2)/M,yc=p.m3*h/M;return {l,h,M,xc,yc,d:Math.hypot(xc,yc)};},
  text:(p,G,T)=>`Three small balls sit at the corners of an ${T("eqt","equilateral triangle")} with sides ${G("l",`${p.lc} cm`)} long. Ball 1 (${G("m1",`${p.m1} kg`)}) is at the ${T("origin","origin")}. Ball 2 (${G("m2",`${p.m2} kg`)}) is at the other end of the bottom side, which lies along the x-axis. Ball 3 (${G("m3",`${p.m3} kg`)}) is at the top corner. Find (a) the x-coordinate and (b) the y-coordinate of the ${T("cm","centre of mass")}, in metres. (c) How far is the centre of mass from ball 1?`,
  terms:{
    eqt:["Equilateral triangle","A triangle with all three sides the same length and all three angles 60°."],
    origin:["Origin","The point (0, 0), where the x-axis and y-axis cross."],
    cm:["Centre of mass","The balance point of a group of objects: an average position where heavier objects count more."]
  },
  given:p=>[
    {k:"m1",sym:M1,name:"mass of ball 1",unit:"kg",val:p.m1,why:"The ball at the origin."},
    {k:"m2",sym:M2,name:"mass of ball 2",unit:"kg",val:p.m2,why:"The ball at the other end of the bottom side."},
    {k:"m3",sym:M3,name:"mass of ball 3",unit:"kg",val:p.m3,why:"The ball at the top corner."},
    {k:"l",sym:LS,name:"side length",unit:"m",val:p.lc/100,why:`The question gives ${p.lc} cm, but the answer is wanted in metres, so divide by 100.`,look:`Start from the ${p.lc} cm in the question and divide by 100.`,gtraps:[[p.lc,`${p.lc} is in centimetres. Divide by 100 to get metres.`]]}
  ],
  find:[
    {sym:XC,name:"x-coordinate of the centre of mass",unit:"m",why:"Part (a)."},
    {sym:YC,name:"y-coordinate of the centre of mass",unit:"m",why:"Part (b)."},
    {sym:DD,name:"distance from ball 1",unit:"m",why:"Part (c)."}
  ],
  parts:[
    {id:"xc",label:"(a) x-coordinate of the centre of mass",sym:XC,unit:"m",ans:(p,c)=>c.xc,traps:(p,c)=>clean([
      [c.l/2,"That's the plain average of the three x positions. Heavier balls count more: multiply each x by its mass, add, then divide by the total mass."],
      [(p.m2*c.l+p.m3*c.l)/c.M,"Ball 3's x-coordinate is l/2, not l. The top corner sits right above the middle of the bottom side."],
      [p.m2*c.l+p.m3*c.l/2,"Divide by the total mass at the end."],
      [c.xc*100,"That's in centimetres. The question wants metres."]
    ],c.xc)},
    {id:"yc",label:"(b) y-coordinate of the centre of mass",sym:YC,unit:"m",ans:(p,c)=>c.yc,traps:(p,c)=>clean([
      [p.m3*c.l/c.M,"The top corner's height isn't l. Use Pythagoras: the height of an equilateral triangle is (√3 ÷ 2) × l."],
      [c.h/3,"That's the plain average of the three y positions. Weight each one by its mass."],
      [p.m3*c.h,"Divide by the total mass at the end."],
      [c.h,"That's the height of the top corner. The centre of mass is lower, because balls 1 and 2 sit at y = 0."],
      [c.yc*100,"That's in centimetres. The question wants metres."]
    ],c.yc)},
    {id:"d",label:"(c) Distance from ball 1",sym:DD,unit:"m",ans:(p,c)=>c.d,traps:(p,c)=>clean([
      [c.xc+c.yc,"Use Pythagoras, not addition: d = √(x² + y²)."],
      [c.xc,"Include the y-coordinate too: d = √(x² + y²)."],
      [c.xc*c.xc+c.yc*c.yc,"That's d². Take the square root."]
    ],c.d)}
  ],
  idea:(p,c)=>`<p>The centre of mass is an <b>average position where heavier balls count more</b>. Do the x and y directions separately.</p>
    <p>First, find each ball's coordinates. Drawing the triangle helps:</p>
    <ul class="plain">
      <li>Ball 1 is at the origin: (0, 0).</li>
      <li>Ball 2 is at the other end of the bottom side: (l, 0).</li>
      <li>Ball 3 is at the top corner, which sits right above the middle of the bottom side. So its x is l/2, and its y is the height of the triangle.</li>
    </ul>
    <p>The height comes from Pythagoras: the side l is the long side of a right triangle whose short side is l/2.</p>
    <p><b>(c)</b> The two coordinates of the centre of mass are the two short sides of another right triangle. The distance is its long side.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${XC}${OP("=")}${FR(`${M1}${sb(mi("x"),"1")}${OP("+")}${M2}${sb(mi("x"),"2")}${OP("+")}${M3}${sb(mi("x"),"3")}`,`${M1}${OP("+")}${M2}${OP("+")}${M3}`)}`)+
    EQ(`${YC}${OP("=")}${FR(`${M1}${sb(mi("y"),"1")}${OP("+")}${M2}${sb(mi("y"),"2")}${OP("+")}${M3}${sb(mi("y"),"3")}`,`${M1}${OP("+")}${M2}${OP("+")}${M3}`)}`)+
    EQ(`${HH}${OP("=")}${FR(SQ("3"),"2")}${LS}${AND}${DD}${OP("=")}${SQ(`${sq2(XC)}${OP("+")}${sq2(YC)}`)}`)+
    `<div class="tbl-wrap"><table class="tbl"><tr><th scope="row">Ball</th><td>1</td><td>2</td><td>3</td></tr><tr><th scope="row">x</th><td>0</td><td>${LS}</td><td>${LS}/2</td></tr><tr><th scope="row">y</th><td>0</td><td>0</td><td>${HH}</td></tr></table></div>`+
    legend([[XC,"x of the centre of mass","m"],[YC,"y of the centre of mass","m"],[LS,"side length","m"],[HH,"height of the triangle","m"],[DD,"distance from the origin","m"]],
    `√3 ÷ 2 ≈ 0.866, so the height is about 0.866 × the side. Any ball at x = 0 or y = 0 adds nothing to that top line, but its mass still counts in the total at the bottom.`),
  plug:(p,c)=>EQ(`${XC}${OP("=")}${FR(`${p.m1}${OP("×")}0${OP("+")}${p.m2}${OP("×")}${fmt(c.l)}${OP("+")}${p.m3}${OP("×")}${fmt(c.l/2)}`,`${p.m1}${OP("+")}${p.m2}${OP("+")}${p.m3}`)}`)+
    EQ(`${YC}${OP("=")}${FR(`${p.m1}${OP("×")}0${OP("+")}${p.m2}${OP("×")}0${OP("+")}${p.m3}${OP("×")}${HH}`,`${p.m1}${OP("+")}${p.m2}${OP("+")}${p.m3}`)}${AND}${HH}${OP("=")}0.866${OP("×")}${fmt(c.l)}`)+
    `<p>Work out the height first, then the two coordinates, then Pythagoras for (c).</p>`+calcTip(`(${p.m2}*${fmt(c.l)}+${p.m3}*${fmt(c.l/2)})/(${p.m1}+${p.m2}+${p.m3})`),
  solution:(p,c)=>steps([
      ["Convert and find the corners",CALC(`${LS} = ${p.lc} cm = ${fmt(c.l)} m, &nbsp; ${HH} = 0.866 × ${fmt(c.l)} = ${fmt(c.h)} m`)+`<p class="small">Ball 1 at (0, 0), ball 2 at (${fmt(c.l)}, 0), ball 3 at (${fmt(c.l/2)}, ${fmt(c.h)}).</p>`],
      ["(a) Weighted average of x",CALC(`${XC} = (${p.m1} × 0 + ${p.m2} × ${fmt(c.l)} + ${p.m3} × ${fmt(c.l/2)}) ÷ ${fmt(c.M)} = ${fmt(p.m2*c.l+p.m3*c.l/2)} ÷ ${fmt(c.M)} = <b>${fmt(c.xc)} m</b>`)],
      ["(b) Weighted average of y",CALC(`${YC} = (${p.m1} × 0 + ${p.m2} × 0 + ${p.m3} × ${fmt(c.h)}) ÷ ${fmt(c.M)} = ${fmt(p.m3*c.h)} ÷ ${fmt(c.M)} = <b>${fmt(c.yc)} m</b>`)],
      ["(c) Pythagoras",CALC(`${DD} = √(${sq2(fmt(c.xc))} + ${sq2(fmt(c.yc))}) = √${fmt(c.d*c.d)} = <b>${fmt(c.d)} m</b>`)]
    ])+checkline(`The centre of mass must be inside the triangle: 0 < ${fmt(c.xc)} < ${fmt(c.l)} and 0 < ${fmt(c.yc)} < ${fmt(c.h)} ✓<br>It sits closer to the heavier balls. Ball ${[p.m1,p.m2,p.m3].indexOf(Math.max(p.m1,p.m2,p.m3))+1} is the heaviest here.`)+
    finalAns(`${XC} = ${fmt(c.xc)} m, &nbsp;${YC} = ${fmt(c.yc)} m, &nbsp;${DD} = ${fmt(c.d)} m`),
  sheet:[
    {name:"Centre of mass",eq:`${XC}${OP("=")}${FR(`Σ${mi("m")}${mi("x")}`,`Σ${mi("m")}`)}${AND}${YC}${OP("=")}${FR(`Σ${mi("m")}${mi("y")}`,`Σ${mi("m")}`)}`,note:"Σ means \"add them all up\". Do x and y separately."},
    {name:"Height of an equilateral triangle",eq:`${HH}${OP("=")}${FR(SQ("3"),"2")}${LS}${OP("≈")}0.866${LS}`,note:"From Pythagoras."}
  ],
  takeEq:()=>`${XC}${OP("=")}${FR(`Σ${mi("m")}${mi("x")}`,`Σ${mi("m")}`)}`,
  takeaway:"Find every object's coordinates first, then take mass-weighted averages of x and y separately.",
  link:"This is HW 1, task 1 with different numbers: same triangle, same setup. For the homework, also mark the centre of mass on your drawing.",
  viz:{
    html:(p,c)=>`<p class="sec-note">The balls are drawn to match their masses, and the red cross is the centre of mass. Make ball 3 heavier or lighter and watch the balance point move.</p>
      <div class="viz-box">
        <label class="viz-l" for="cm-m">Mass of ball 3: <output id="cm-mo">${p.m3}</output> kg</label>
        <input type="range" id="cm-m" min="0.5" max="8" step="0.5" value="${p.m3}">
        <svg class="vsvg" viewBox="0 0 400 225" role="img" aria-label="Three balls on a triangle and their centre of mass">
          <polygon points="100,205 300,205 200,31.8" class="v-faint"/>
          <circle id="cm-b1" class="v-block" cx="100" cy="205"/><circle id="cm-b2" class="v-block" cx="300" cy="205"/><circle id="cm-b3" class="v-block" cx="200" cy="31.8"/>
          <text class="v-text" x="80" y="222">1</text><text class="v-text" x="314" y="222">2</text><text class="v-text" x="216" y="24">3</text>
          <path id="cm-x" style="stroke:var(--bad);stroke-width:2.5;fill:none"/>
        </svg>
        <p class="viz-read" id="cm-read"></p>
      </div>`,
    setup:(p,c,ctx)=>{
      const r=ctx.$("#cm-m"),rad=m=>5+5*Math.cbrt(m);
      ctx.$("#cm-b1").setAttribute("r",rad(p.m1).toFixed(1));ctx.$("#cm-b2").setAttribute("r",rad(p.m2).toFixed(1));
      const upd=()=>{const m3=+r.value,M=p.m1+p.m2+m3,xc=(p.m2*c.l+m3*c.l/2)/M,yc=m3*c.h/M,X=100+200*xc/c.l,Y=205-200*yc/c.l;
        ctx.$("#cm-mo").textContent=fmt(m3);ctx.$("#cm-b3").setAttribute("r",rad(m3).toFixed(1));
        ctx.$("#cm-x").setAttribute("d",`M${(X-7).toFixed(1)},${(Y-7).toFixed(1)} L${(X+7).toFixed(1)},${(Y+7).toFixed(1)} M${(X-7).toFixed(1)},${(Y+7).toFixed(1)} L${(X+7).toFixed(1)},${(Y-7).toFixed(1)}`);
        ctx.$("#cm-read").innerHTML=`Ball 3 of ${fmt(m3)} kg: centre of mass at (<b>${fmt(R3(xc))} m</b>, <b>${fmt(R3(yc))} m</b>)`;};
      r.addEventListener("input",upd);upd();
    }
  },
  scene:{still:6,draw(K,t,p){
  const u=mod(t,8),O=[220,190],B=[400,190],C=[310,190-180*Math.sqrt(3)/2],rad=m=>6+6*Math.cbrt(m);
  K.arrow(190,190,500,190,{c:"ink2",w:1.2,head:7});K.text("x",510,190,{serif:true,italic:true,c:"ink2"});
  K.arrow(220,208,220,14,{c:"ink2",w:1.2,head:7});K.text("y",232,14,{serif:true,italic:true,c:"ink2"});
  const e=fadeIn(u,0,1.6),seg=(a,b,k)=>K.line(a[0],a[1],a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,{c:"blue",w:2.2});
  seg(O,B,Math.min(1,e*3));seg(B,C,K.clamp(e*3-1,0,1));seg(C,O,K.clamp(e*3-2,0,1));
  [[O,p.m1,"1",[-34,10]],[B,p.m2,"2",[34,10]],[C,p.m3,"3",[34,-4]]].forEach(([P,m,n,off],i)=>{const k=fadeIn(u,1.6+i*0.35,2+i*0.35);if(k<=0)return;
    K.circle(P[0],P[1],rad(m)*k,{fill:"marker",c:"ink",w:1.6});K.tag(`${m} kg`,P[0]+off[0],P[1]+off[1]-12,{size:11,alpha:k});});
  K.tag(`${p.lc} cm`,310,206,{size:11,alpha:fadeIn(u,1,1.6)});
  if(u>7.4)K.rect(0,0,600,220,{fill:"bg",c:false,alpha:(u-7.4)/0.6});
}}
},

{
  id:"mom-elastic", topic:"Momentum", level:"Hard", title:"Elastic collision", hw:"Like HW 1, task 3(a)",
  base:{m1:2,v1:6,m2:4},
  random:()=>{const r=pick([[2,6,4],[1,9,2],[3,8,1],[2,10,3],[4,5,1],[1,8,3]]);return {m1:r[0],v1:r[1],m2:r[2]};},
  calc:p=>{const M=p.m1+p.m2,u1=(p.m1-p.m2)/M*p.v1,u2=2*p.m1/M*p.v1,V=p.m1*p.v1/M;return {M,u1,u2,V,J:Math.abs(p.m1*(u1-p.v1)),Jst:p.m1*(p.v1-V)};},
  text:(p,G,T)=>`A ${G("m1",`${p.m1} kg`)} ball rolling at ${G("v1",`${p.v1} m/s`)} hits a ${G("m2",`${p.m2} kg`)} ball that is ${G("v2","at rest")}, ${T("head","head-on")}. The collision is ${T("elastic","perfectly elastic")}. Take the first ball's starting direction as positive. (a) What is the velocity of the first ball after the collision? Give the sign: negative means it bounces back. (b) What is the velocity of the second ball after the collision? (c) What is the size of the ${T("imp","impulse")} on the first ball?`,
  terms:{
    head:["Head-on","Both balls move along the same straight line, before and after. So one direction is + and the other is −."],
    elastic:["Perfectly elastic","The balls bounce off without losing any kinetic energy. So both momentum AND kinetic energy are the same before and after."],
    imp:["Impulse","How much an object's momentum changes: momentum after − momentum before. Measured in N·s."]
  },
  given:p=>[
    {k:"m1",sym:M1,name:"mass of ball 1",unit:"kg",val:p.m1,why:"The ball that is rolling.",look:"The first mass in the question."},
    {k:"v1",sym:V1,name:"velocity of ball 1 before",unit:"m/s",val:p.v1,why:"Positive, because its direction is the one we called positive."},
    {k:"m2",sym:M2,name:"mass of ball 2",unit:"kg",val:p.m2,why:"The ball that gets hit.",look:"The second mass in the question."},
    {k:"v2",sym:V2,name:"velocity of ball 2 before",unit:"m/s",val:0,why:`"At rest" means not moving, so 0.`,look:`Ball 2 is "at rest". What velocity is that?`}
  ],
  find:[
    {sym:V1P,name:"velocity of ball 1 after",unit:"m/s",why:"Part (a). The little dash ′ means \"after\". Keep the sign."},
    {sym:V2P,name:"velocity of ball 2 after",unit:"m/s",why:"Part (b)."},
    {sym:JJ,name:"impulse on ball 1",unit:"N·s",why:"Part (c). Only its size."}
  ],
  parts:[
    {id:"u1",label:"(a) Velocity of ball 1 after (with sign)",sym:V1P,unit:"m/s",ans:(p,c)=>c.u1,traps:(p,c)=>clean([
      [c.V,"That's the speed if the balls stuck together. In an elastic collision they bounce apart."],
      [p.v1,"Its velocity must change: it hands some momentum to ball 2."],
      [c.u2,"That's ball 2's velocity after. Ball 1 uses (m₁ − m₂) ÷ (m₁ + m₂) × v₁."],
      [0,"Ball 1 only stops dead when the two masses are equal. Use v₁′ = (m₁ − m₂) ÷ (m₁ + m₂) × v₁."]
    ],c.u1)},
    {id:"u2",label:"(b) Velocity of ball 2 after",sym:V2P,unit:"m/s",ans:(p,c)=>c.u2,traps:(p,c)=>clean([
      [p.m1*p.v1/p.m2,"That gives ball 2 all of the momentum, but ball 1 still has some after the hit. Use v₂′ = 2m₁ ÷ (m₁ + m₂) × v₁."],
      [c.V,"That's the speed if they stuck together. Elastic means they bounce apart."],
      [p.v1,"Ball 2 only takes over ball 1's full speed when the masses are equal."],
      [c.u1,"That's ball 1's velocity. Ball 2 uses 2m₁ ÷ (m₁ + m₂) × v₁."]
    ],c.u2)},
    {id:"J",label:"(c) Size of the impulse on ball 1",sym:JJ,unit:"N·s",ans:(p,c)=>c.J,traps:(p,c)=>clean([
      c.u1<0?[p.m1*(p.v1-Math.abs(c.u1)),`Watch the direction. Ball 1 goes from +${p.v1} to ${fmt(c.u1)} m/s, which is a change of ${fmt(p.v1-c.u1)} m/s, not ${fmt(p.v1+c.u1)}.`]:null,
      [p.m1*p.v1,"That's ball 1's momentum before. Impulse is the change: m₁v₁′ − m₁v₁."],
      [Math.abs(p.m1*c.u1),"That's ball 1's momentum after. Impulse is the change: m₁v₁′ − m₁v₁."],
      [c.Jst,"That's the impulse if the balls had stuck together (like the clay question). Bouncing apart changes the momentum more."]
    ],c.J)}
  ],
  idea:(p,c)=>`<p>In an elastic collision, <b>two</b> things stay the same: the total momentum, and the total kinetic energy. Two facts, two unknowns (the two velocities after), so you can solve for both.</p>
    <p>Solving those two equations by hand takes a while, so physicists keep the result as two ready-made formulas (next hint). It helps to know what they say:</p>
    <ul class="plain">
      <li>If ball 1 is <b>lighter</b> than ball 2, it bounces back (negative velocity).</li>
      <li>If ball 1 is <b>heavier</b>, it keeps rolling forward, just slower.</li>
      <li>If they have the <b>same</b> mass, ball 1 stops and ball 2 takes over its full speed.</li>
    </ul>
    <p><b>(c)</b> Impulse on ball 1 = its momentum after − its momentum before. Watch the signs if it bounces back.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${V1P}${OP("=")}${FR(`${M1}${OP("−")}${M2}`,`${M1}${OP("+")}${M2}`)}${V1}`)+
    EQ(`${V2P}${OP("=")}${FR(`2${M1}`,`${M1}${OP("+")}${M2}`)}${V1}`)+
    EQ(`${JJ}${OP("=")}${M1}${V1P}${OP("−")}${M1}${V1}`)+
    legend([[M1,"mass of ball 1","kg"],[M2,"mass of ball 2","kg"],[V1,"velocity of ball 1 before","m/s"],[V1P,"velocity of ball 1 after","m/s"],[V2P,"velocity of ball 2 after","m/s"],[JJ,"impulse on ball 1","N·s"]],
    `These formulas are for ball 2 starting at rest. They come from solving momentum conservation (${M1}${V1} = ${M1}${V1P} + ${M2}${V2P}) together with kinetic energy conservation (½${M1}${sq2(V1)} = ½${M1}${sq2(V1P)} + ½${M2}${sq2(V2P)}).`),
  plug:(p,c)=>EQ(`${V1P}${OP("=")}${FR(`${p.m1}${OP("−")}${p.m2}`,`${p.m1}${OP("+")}${p.m2}`)}${OP("×")}${p.v1}`)+
    EQ(`${V2P}${OP("=")}${FR(`2${OP("×")}${p.m1}`,`${p.m1}${OP("+")}${p.m2}`)}${OP("×")}${p.v1}`)+
    EQ(`${JJ}${OP("=")}${p.m1}${OP("×")}${V1P}${OP("−")}${p.m1}${OP("×")}${p.v1}`)+
    `<p>Keep the sign of ${V1P} when you use it in the impulse. The question asks for the size of ${JJ}, so drop its minus sign at the very end.</p>`+
    calcTip(`(${p.m1}-${p.m2})/(${p.m1}+${p.m2})*${p.v1}`),
  solution:(p,c)=>steps([
      ["Write down what you know",`${M1} = ${p.m1} kg, &nbsp;${V1} = ${p.v1} m/s, &nbsp;${M2} = ${p.m2} kg, &nbsp;${V2} = 0.`],
      ["(a) Ball 1 after",CALC(`${V1P} = (${p.m1} − ${p.m2}) ÷ (${p.m1} + ${p.m2}) × ${p.v1} = ${fmt(p.m1-p.m2)} ÷ ${fmt(c.M)} × ${p.v1} = <b>${fmt(c.u1)} m/s</b>`)+`<p class="small">${c.u1<0?"Negative: ball 1 bounces back.":"Positive: ball 1 keeps rolling forward, just slower."}</p>`],
      ["(b) Ball 2 after",CALC(`${V2P} = 2 × ${p.m1} ÷ (${p.m1} + ${p.m2}) × ${p.v1} = <b>${fmt(c.u2)} m/s</b>`)],
      ["(c) Change in ball 1's momentum",CALC(`${JJ} = ${p.m1} × ${pr(c.u1)} − ${p.m1} × ${p.v1} = ${fmt(p.m1*c.u1)} − ${fmt(p.m1*p.v1)} = −${fmt(c.J)} N·s`)+`<p class="small">The size is <b>${fmt(c.J)} N·s</b>. The minus sign means the push on ball 1 points backwards.</p>`]
    ])+checkline(`Momentum before: ${p.m1} × ${p.v1} = ${fmt(p.m1*p.v1)}. After: ${p.m1} × ${pr(c.u1)} + ${p.m2} × ${fmt(c.u2)} = ${fmt(p.m1*c.u1+p.m2*c.u2)} ✓<br>Kinetic energy before: ½ × ${p.m1} × ${sq2(p.v1)} = ${fmt(0.5*p.m1*p.v1*p.v1)} J. After: ½ × ${p.m1} × ${sq2(pr(c.u1))} + ½ × ${p.m2} × ${sq2(fmt(c.u2))} = ${fmt(0.5*p.m1*c.u1*c.u1+0.5*p.m2*c.u2*c.u2)} J ✓<br>Fun fact: this impulse is exactly twice what it would be if the balls stuck together (${fmt(c.Jst)} N·s).`)+
    finalAns(`${V1P} = ${fmt(c.u1)} m/s, &nbsp;${V2P} = ${fmt(c.u2)} m/s, &nbsp;${JJ} = ${fmt(c.J)} N·s`),
  sheet:[
    {name:"Elastic collision, ball 2 at rest: ball 1",eq:`${V1P}${OP("=")}${FR(`${M1}${OP("−")}${M2}`,`${M1}${OP("+")}${M2}`)}${V1}`,note:"Negative means it bounces back."},
    {name:"Elastic collision, ball 2 at rest: ball 2",eq:`${V2P}${OP("=")}${FR(`2${M1}`,`${M1}${OP("+")}${M2}`)}${V1}`,note:"Momentum AND kinetic energy are conserved."}
  ],
  takeEq:()=>`${V1P}${OP("=")}${FR(`${M1}${OP("−")}${M2}`,`${M1}${OP("+")}${M2}`)}${V1}${AND}${V2P}${OP("=")}${FR(`2${M1}`,`${M1}${OP("+")}${M2}`)}${V1}`,
  takeaway:"Elastic: momentum and kinetic energy are both conserved. A lighter ball bounces back, a heavier one keeps going, and equal masses swap velocities.",
  link:"HW 1, task 3(a) is exactly this: the impulse on particle 1 in a completely elastic collision. Part (b) of that task is the sticking case from the clay question. Compare the two answers: the elastic one is twice as big.",
  viz:{
    html:(p,c)=>`<p class="sec-note">Watch the collision, then try other masses for ball 2. A lighter ball 1 bounces back, a heavier one keeps rolling, and equal masses swap speeds.</p>
      <div class="viz-box">
        <label class="viz-l" for="el-m">Mass of ball 2: <output id="el-mo">${p.m2}</output> kg</label>
        <input type="range" id="el-m" min="0.5" max="${Math.max(6,p.m2*2)}" step="0.5" value="${p.m2}">
        <svg class="vsvg" viewBox="0 0 400 110" role="img" aria-label="Two balls colliding">
          <line x1="0" y1="100" x2="400" y2="100" style="stroke:var(--rule);stroke-width:2"/>
          <circle id="el-b1" class="v-block"/><circle id="el-b2" style="fill:var(--blue)"/>
          <text id="el-t1" class="v-text" text-anchor="middle">1</text><text id="el-t2" class="v-text" text-anchor="middle">2</text>
        </svg>
        <p class="viz-read" id="el-read"></p>
      </div>`,
    setup:(p,c,ctx)=>{
      const r=ctx.$("#el-m"),b1=ctx.$("#el-b1"),b2=ctx.$("#el-b2"),t1=ctx.$("#el-t1"),t2=ctx.$("#el-t2"),read=ctx.$("#el-read");
      let t=0;const rad=m=>7+7*Math.cbrt(m),TC=1.4;
      const place=(el,lab,x,rr)=>{el.setAttribute("cx",x.toFixed(1));el.setAttribute("cy",(100-rr).toFixed(1));el.setAttribute("r",rr.toFixed(1));lab.setAttribute("x",x.toFixed(1));lab.setAttribute("y",(100-2*rr-5).toFixed(1));};
      const draw=()=>{const m2=+r.value,r1=rad(p.m1),r2=rad(m2),M=p.m1+m2,u1=(p.m1-m2)/M*p.v1,u2=2*p.m1/M*p.v1;
        const x2s=230,x1s=30,gap=x2s-x1s-r1-r2,k=gap/(TC*p.v1);let x1,x2;
        if(t<TC){x1=x1s+k*p.v1*t;x2=x2s;}else{const d=t-TC;x1=x1s+gap+k*u1*d;x2=x2s+k*u2*d;}
        place(b1,t1,x1,r1);place(b2,t2,x2,r2);};
      const upd=()=>{const m2=+r.value,M=p.m1+m2,u1=(p.m1-m2)/M*p.v1,u2=2*p.m1/M*p.v1;ctx.$("#el-mo").textContent=fmt(m2);t=0;
        read.innerHTML=`Ball 2 of ${fmt(m2)} kg: ball 1 ends at <b>${fmt(Math.round(u1*1000)/1000)} m/s</b> (${Math.abs(u1)<1e-9?"stops dead":u1<0?"bounces back":"keeps rolling forward"}), ball 2 at <b>${fmt(u2)} m/s</b>.`;draw();};
      r.addEventListener("input",upd);upd();
      if(ctx.reduceMotion){t=3;draw();}else ctx.loop(dt=>{t+=dt;if(t>4.2)t=0;draw();});
    }
  },
  scene:{still:1.2,draw(K,t,p){
  const y=172,u=mod(t,4.6),r1=8+7*Math.cbrt(p.m1),r2=8+7*Math.cbrt(p.m2),x2=360,xs=50,xc=x2-r1-r2,x1=u<2?xs+(xc-xs)*(u/2):xc;
  K.ground(y,20,580);
  K.circle(x2,y-r2,r2,{fill:"blueSoft",c:"ink",w:1.6});K.text(`${p.m2} kg`,x2,y-r2,{size:11,bold:true});
  K.circle(x1,y-r1,r1,{fill:"marker",c:"ink",w:1.6});K.text(`${p.m1} kg`,x1,y-r1,{size:11,bold:true,c:"#14244a"});
  if(u<2){speedLines(K,x1-r1-4,y-r1+12,3,18,0.55);K.arrow(x1-16,y-2*r1-16,x1+26,y-2*r1-16,{c:"heat",w:2.2});K.tag(`${p.v1} m/s`,x1+30,y-2*r1-16,{align:"left",size:11,c:"heat"});}
  else{const k=Math.min(1,(u-2)/0.5);K.circle(x2-r2,y-Math.max(r1,r2),12+30*k,{c:"heat",w:2,alpha:1-k});K.text("?",x2-r2,y-2*Math.max(r1,r2)-34,{size:30,bold:true,c:"heat",alpha:Math.min(1,(u-2.2)/0.4)});}
  if(u>4)K.rect(0,0,600,220,{fill:"bg",c:false,alpha:(u-4)/0.6});
}}
},

/* ===== Ball bounces off a wall ===== */
{
  id:"mom-bounce", level:"Easy", title:"Ball bounces off a wall", hw:"Like HW 1, task 3",
  base:{m:0.4,v1:12,v2:8,dt:0.02},
  random:()=>{const v1=pick([6,8,10,12,15,20]);return {m:pick([0.15,0.2,0.25,0.3,0.4,0.5]),v1,v2:R3(v1*pick([0.5,0.6,0.75,0.8,1])),dt:pick([0.01,0.02,0.025,0.04,0.05])};},
  calc:p=>{const J=p.m*(p.v1+p.v2);return {p1:p.m*p.v1,J,F:J/p.dt};},
  text:(p,G,T)=>`A ${G("m",`${p.m} kg`)} ball hits a wall head-on at ${G("v1",`${p.v1} m/s`)} and bounces straight back at ${G("v2",`${p.v2} m/s`)}. It touches the wall for ${G("dt",`${p.dt} s`)}. Find (a) the size of the ball's ${T("mom","momentum")} just before it hits, (b) the size of the ${T("imp","impulse")} on the ball, and (c) the average force of the wall on the ball.`,
  terms:{
    mom:["Momentum","Mass × velocity, p = mv. It has a direction: the same direction as the velocity."],
    imp:["Impulse","How much the momentum changes: momentum after − momentum before. Measured in N·s (the same as kg·m/s)."]
  },
  given:p=>[
    {k:"m",sym:MB,name:"mass of the ball",unit:"kg",val:p.m,why:"",look:"The number measured in kg."},
    {k:"v1",sym:V1,name:"speed towards the wall",unit:"m/s",val:p.v1,why:"Before the bounce. Call this direction +.",look:"The first speed."},
    {k:"v2",sym:V2,name:"speed away from the wall",unit:"m/s",val:p.v2,why:"After the bounce, in the opposite direction, so its velocity is −v₂.",look:"The speed after it bounces."},
    {k:"dt",sym:DT,name:"contact time",unit:"s",val:p.dt,why:"How long the wall pushes on the ball.",look:"The time in s."}
  ],
  find:[{sym:PB,name:"momentum before",unit:"kg·m/s",why:"Part (a)."},{sym:JJ,name:"impulse",unit:"N·s",why:"Part (b). Only its size."},{sym:FAV,name:"average force",unit:"N",why:"Part (c)."}],
  parts:[
    {id:"p1",label:"(a) Momentum just before it hits",sym:PB,unit:"kg·m/s",ans:(p,c)=>c.p1,traps:(p,c)=>clean([[p.m*p.v2,"That's the momentum after the bounce. Before, it moves at v₁."],[p.v1/p.m,"Multiply mass by velocity: p = mv."]],c.p1)},
    {id:"J",label:"(b) Impulse on the ball",sym:JJ,unit:"N·s",ans:(p,c)=>c.J,traps:(p,c)=>clean([[p.m*(p.v1-p.v2),"The ball turns around, so its velocity goes from +v₁ to −v₂. The change is v₁ + v₂, not v₁ − v₂."],[c.p1,"That's the momentum before. The impulse is the whole change: it loses that momentum and also gains momentum the other way."],[p.m*p.v2,"That's the momentum after. The impulse is the change from before to after."]],c.J)},
    {id:"F",label:"(c) Average force from the wall",sym:FAV,unit:"N",ans:(p,c)=>c.F,traps:(p,c)=>clean([[p.m*(p.v1-p.v2)/p.dt,"Watch the direction: the change in velocity is v₁ + v₂, because the ball turns around."],[c.J*p.dt,"Divide the impulse by the contact time: F = J ÷ Δt."],[c.p1/p.dt,"Use the whole impulse from part (b), not just the momentum before."]],c.F)}
  ],
  idea:()=>`<p><b>Impulse = change in momentum</b>, and momentum has a direction. Call the direction towards the wall positive.</p>
    <ul class="plain"><li>Before: momentum +m v₁.</li><li>After: the ball moves the other way, so its momentum is −m v₂.</li><li>Change = after − before = −m v₂ − m v₁. Its size is m(v₁ + v₂): bouncing back changes the momentum more than just stopping would.</li></ul>
    <p>The wall delivers that impulse in a short time Δt, so the average force is impulse ÷ time.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${PB}${OP("=")}${MB}${mi("v")}`)+EQ(`${JJ}${OP("=")}${PB}<sub>after</sub>${OP("−")}${PB}<sub>before</sub>${OP("=")}(${OP("−")}${MB}${V2})${OP("−")}${MB}${V1}`)+EQ(`|${JJ}|${OP("=")}${MB}(${V1}${OP("+")}${V2})`)+EQ(`${FAV}${OP("=")}${FR(JJ,DT)}`)+
    legend([[V1,"speed before (towards the wall)","m/s"],[V2,"speed after (away from the wall)","m/s"],[JJ,"impulse: change in momentum","N·s"],[DT,"contact time","s"]]),
  plug:p=>EQ(`${PB}${OP("=")}${p.m}${OP("×")}${p.v1}`)+EQ(`${JJ}${OP("=")}${p.m}${OP("×")}(${p.v1}${OP("+")}${p.v2})`)+EQ(`${FAV}${OP("=")}${FR(JJ,p.dt)}`),
  solution:(p,c)=>steps([
      ["(a) Momentum before",CALC(`${PB} = ${p.m} × ${p.v1} = <b>${fmt(c.p1)} kg·m/s</b>`)],
      ["(b) Change in momentum",CALC(`after − before = ${p.m} × (−${p.v2}) − ${p.m} × ${p.v1} = ${fmt(-p.m*p.v2)} − ${fmt(c.p1)} = −${fmt(c.J)} kg·m/s`)+`<p class="small">Size: <b>${fmt(c.J)} N·s</b>. The minus sign means the wall pushes the ball away from itself.</p>`],
      ["(c) Average force",CALC(`${FAV} = ${fmt(c.J)} ÷ ${p.dt} = <b>${fmt(c.F)} N</b>`)]
    ])+checkline(`If the ball had stopped dead instead of bouncing, the impulse would be only ${fmt(c.p1)} N·s. Bouncing back adds another ${fmt(p.m*p.v2)} N·s ✓`)+
    finalAns(`${PB} = ${fmt(c.p1)} kg·m/s, &nbsp;${JJ} = ${fmt(c.J)} N·s, &nbsp;${FAV} = ${fmt(c.F)} N`),
  sheet:[{name:"Impulse",eq:`${JJ}${OP("=")}${mi("p")}<sub>after</sub>${OP("−")}${mi("p")}<sub>before</sub>${OP("=")}${FAV}${DT}`,note:"Momentum has a direction: a bounce changes it by m(v₁ + v₂)."}],
  takeEq:()=>`${JJ}${OP("=")}${MB}(${V1}${OP("+")}${V2})${AND}${FAV}${OP("=")}${FR(JJ,DT)}`,
  takeaway:"Impulse is the change in momentum, with signs. A bounce reverses the velocity, so the change is m(v₁ + v₂). Average force = impulse ÷ contact time.",
  link:"HW 1, task 3 uses the same impulse idea for a collision. Try “Clay hits a block” on Medium next.",
  viz:viz.slider((p,c)=>({note:"Drag the bounce-back speed. At 0 the ball just stops; the harder it bounces back, the bigger the impulse (and the force).",label:"Speed after the bounce",unit:"m/s",min:0,max:p.v1,step:0.5,value:p.v2,
    bars:[{label:"Impulse (full bar = a perfect bounce, back at v₁)",segs:[{cls:"seg-ke",frac:x=>(p.v1+x)/(2*p.v1)}]}],read:x=>`${JJ} = ${p.m} × (${p.v1} + ${fmt(x)}) = <b>${fmt(R3(p.m*(p.v1+x)))} N·s</b>, average force <b>${fmt(R3(p.m*(p.v1+x)/p.dt))} N</b>`})),
  scene:{still:1,draw(K,t,p){const u=mod(t,4.4),wx=470,y=150,r=12;K.ground(y+r,20,wx);K.wall(wx,40,y+r+2);
    let x,sq=0;const vin=p.v1,vout=p.v2,tin=1.6,tout=1.6*vin/vout*0.8;
    if(u<tin){x=80+(wx-r-80)*(u/tin);}else if(u<tin+0.18){x=wx-r;sq=Math.sin(Math.PI*(u-tin)/0.18);}else{const s=(u-tin-0.18)/tout;x=wx-r-(wx-r-80)*Math.min(1,s);}
    K.ellipse(x+sq*3,y,r-sq*4,r+sq*3,{fill:"marker",c:"ink",w:1.4});
    if(u<tin){speedLines(K,x-r-2,y+10,3,16,0.5);K.tag(`${p.v1} m/s`,x,y-30,{size:11});}else if(u>tin+0.3&&u<4)K.tag(`${p.v2} m/s`,x,y-30,{size:11});
    K.tag(`${p.m} kg`,120,40,{size:11});if(u>3.8)K.rect(0,0,600,220,{fill:"bg",c:false,alpha:(u-3.8)/0.6});}}
}
]);
})();
