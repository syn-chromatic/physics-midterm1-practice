/* Newton's laws: forces, F = ma, weight, normal force, tension and friction.
   Every question on this topic is one object in the list below: its numbers, text, hints,
   answer checks, "See it" panel and animation. See ADDING-QUESTIONS.md for how to add one. */
(function(){
"use strict";
const {fmt,pick,mi,up,sb,ssp,OP,FR,SQ,EQ,CALC,HALF,sq2,neg,IMPLIES,AND,PAREN,PI,OMEGA,V0,VI,VF,KE,KEI,KEF,DKE,legend,steps,checkline,finalAns,watch,calcTip,viz}=HL;
const {R3,clean,pr,sumTxt,draw}=PHYS;
const {F,mod,fadeIn,cyclist,speedLines,springScene,block,curvedArrow}=draw;

/* symbols and helpers used below */
const g=9.8,rad=d=>d*Math.PI/180,sin=d=>Math.sin(rad(d)),cos=d=>Math.cos(rad(d));
const G9=mi("g"),MM=mi("m"),M1=sb(mi("m"),"1"),M2=sb(mi("m"),"2"),AA=mi("a"),TT=mi("T"),FF=mi("F"),VV=mi("v"),DD=mi("d");
const FG=sb(mi("F"),"g"),FN=sb(mi("F"),"N"),FK=sb(mi("f"),"k"),MU=sb(mi("μ"),"k"),AL=mi("α"),FNET=sb(mi("F"),"net");
const T1=sb(mi("T"),"1"),T2=sb(mi("T"),"2"),T3=sb(mi("T"),"3");
const SIN=x=>`sin${OP("")}${x}`,COS=x=>`cos${OP("")}${x}`;
const DEG="Set your calculator to degrees (DEG) before using sin and cos.";
const radTrap=v=>[v,"Your calculator is in radians. Switch it to degrees (DEG) and work it out again."];
const TERMS={
  smooth:["Smooth","No friction. Nothing rubs against the object to slow it down."],
  weight:["Weight","The pull of gravity on an object: mass × g, where g = 9.8 m/s². It's a force, so it's measured in newtons (N), not kilograms."],
  normal:["Normal force","The push of a surface on whatever rests on it, straight out of the surface. \"Normal\" means at 90° to the surface."],
  tension:["Tension","The pull along a rope, cord or cable. It can only pull, never push, and in a light cord it's the same all along its length."],
  pulley:["Frictionless pulley","A wheel that only changes the direction of the cord. It doesn't slow the cord down, so the tension is the same on both sides."],
  atwood:["Atwood machine","Two weights hanging on one cord over a pulley. The heavier one goes down, the lighter one goes up, both with the same size of acceleration."],
  kinetic:["Coefficient of kinetic friction","μ_k (Greek letter mu). Friction on a sliding object is μ_k × the normal force. It always points against the sliding."],
  incline:["Inclined plane","A ramp. The angle α is measured between the ramp and the horizontal ground."]
};
/* drawing helpers for this topic's animations */
function pulley(K,x,y,r,ang){K.circle(x,y,r,{fill:"card",c:"ink",w:2});for(let i=0;i<3;i++){const a=ang+i*2*Math.PI/3;K.line(x,y,x+r*0.78*Math.cos(a),y+r*0.78*Math.sin(a),{c:"ink2",w:1.4});}K.circle(x,y,3.5,{fill:"ink",c:false});}
/* a box sitting on a slope: centre of its bottom edge at (x,y), slope angle a (radians, rising to the right) */
function rbox(K,x,y,w,h,a,label){const c=Math.cos(a),s=Math.sin(a),P=(u,v)=>[x+u*c-v*s,y-u*s-v*c];  /* u along the slope, v straight out of it */
  K.poly([P(-w/2,0),P(w/2,0),P(w/2,h),P(-w/2,h)],{fill:"marker",c:"ink",w:1.6,close:true});
  if(label){const m=P(0,h/2);K.text(label,m[0],m[1],{size:11,bold:true,c:"#14244a"});}return P;}
/* a ramp rising to the right from (x0,y0) at angle deg; returns the point at distance s along it */
function ramp(K,x0,y0,deg,len){const a=rad(deg),x1=x0+len*Math.cos(a),y1=y0-len*Math.sin(a);
  K.poly([[x0,y0],[x1,y0],[x1,y1]],{fill:"bg",c:"ink",w:2,close:true});K.line(x0-20,y0,x1+40,y0,{w:2});
  return {a,x1,y1,at:s=>[x0+s*Math.cos(a),y0-s*Math.sin(a)]};}

PHYS.add("Newton's laws",[

/* ===== 1. Push across a smooth floor ===== */
{
  id:"nl-push", level:"Easy", title:"Push across the floor", hw:"Course topic: Newton's second law",
  base:{m:4,F:10},
  random:()=>({m:pick([2,3,4,5,6,8,10,12]),F:pick([6,8,10,12,15,18,20,24,30,36])}),
  calc:p=>({Fg:p.m*g,FN:p.m*g,a:p.F/p.m}),
  text:(p,G,T)=>`A ${G("m",`${p.m} kg`)} box sits on a ${T("smooth","smooth")}, flat floor. You push it sideways with a force of ${G("F",`${p.F} N`)}. (a) What is the box's ${T("weight","weight")}? (b) How hard does the floor push up on the box (the ${T("normal","normal force")})? (c) What is the box's acceleration?`,
  terms:{smooth:TERMS.smooth,weight:TERMS.weight,normal:TERMS.normal},
  given:p=>[
    {k:"m",sym:MM,name:"mass of the box",unit:"kg",val:p.m,why:"How much matter is in the box.",look:"The number measured in kg."},
    {k:"F",sym:FF,name:"your push",unit:"N",val:p.F,why:"A force, so it's in newtons (N). It points sideways.",look:"The number measured in N."}
  ],
  find:[{sym:FG,name:"weight",unit:"N",why:"Part (a). The pull of gravity."},{sym:FN,name:"normal force",unit:"N",why:"Part (b). The floor pushing up."},{sym:AA,name:"acceleration",unit:"m/s²",why:"Part (c)."}],
  parts:[
    {id:"Fg",label:"(a) Weight of the box",sym:FG,unit:"N",ans:(p,c)=>c.Fg,traps:(p,c)=>clean([[p.m,"That's the mass in kg. Weight is a force: multiply by g = 9.8 m/s²."],[p.F,"That's your push. The weight is the pull of gravity: m × g."],[p.m/g,"Multiply by g, don't divide: weight = m × g."]],c.Fg)},
    {id:"FN",label:"(b) Normal force from the floor",sym:FN,unit:"N",ans:(p,c)=>c.FN,traps:(p,c)=>clean([[c.Fg+p.F,"Your push is sideways, so it doesn't press the box into the floor. Only gravity does, so the floor pushes back with exactly mg."],[p.F,"Your push is sideways. The floor pushes up, against gravity: F_N = mg."],[p.m,"Use newtons: the normal force is m × g."]],c.FN)},
    {id:"a",label:"(c) Acceleration",sym:AA,unit:"m/s²",ans:(p,c)=>c.a,traps:(p,c)=>clean([[p.F*p.m,"Divide the force by the mass: a = F ÷ m."],[p.m/p.F,"Upside down: a = F ÷ m."],[p.F/c.Fg,"Divide by the mass in kg, not by the weight in N."]],c.a)}
  ],
  idea:()=>`<p>Newton's second law: the <b>total</b> force on something equals its mass × its acceleration (F = ma). Use it one direction at a time.</p>
    <ul class="plain"><li><b>Up and down:</b> gravity pulls the box down with its weight, mg. The floor pushes up with the normal force. The box doesn't sink or fly up, so these two cancel: the floor pushes up exactly as hard as gravity pulls down.</li>
    <li><b>Sideways:</b> only your push acts (there's no friction), so it is the whole total force: a = F ÷ m.</li></ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${FG}${OP("=")}${MM}${G9}`)+EQ(`${FN}${OP("=")}${FG}`)+EQ(`${FNET}${OP("=")}${MM}${AA}${IMPLIES}${AA}${OP("=")}${FR(FF,MM)}`)+
    legend([[FG,"weight (the pull of gravity)","N"],[FN,"normal force (the floor pushing up)","N"],[G9,"9.8, the acceleration of free fall","m/s²"],[FNET,"total (net) force in one direction","N"]],"The normal force equals the weight only when the floor is flat and nothing else pushes up or down."),
  plug:p=>EQ(`${FG}${OP("=")}${p.m}${OP("×")}9.8`)+EQ(`${FN}${OP("=")}${FG}`)+EQ(`${AA}${OP("=")}${FR(p.F,p.m)}`)+calcTip(`${p.F}/${p.m}`),
  solution:(p,c)=>steps([
      ["(a) Weight",CALC(`${FG} = ${MM}${G9} = ${p.m} × 9.8 = <b>${fmt(c.Fg)} N</b>`)],
      ["(b) Up and down cancel",CALC(`${FN} = ${FG} = <b>${fmt(c.FN)} N</b>`)+`<p class="small">The box stays on the floor, so the up and down forces balance.</p>`],
      ["(c) Sideways: F = ma",CALC(`${AA} = ${FF} ÷ ${MM} = ${p.F} ÷ ${p.m} = <b>${fmt(c.a)} m/s²</b>`)]
    ])+checkline(`F = ma: ${p.m} × ${fmt(c.a)} = ${fmt(p.m*c.a)} N, which is your push ✓`)+
    finalAns(`${FG} = ${fmt(c.Fg)} N, &nbsp;${FN} = ${fmt(c.FN)} N, &nbsp;${AA} = ${fmt(c.a)} m/s²`),
  sheet:[{name:"Weight",eq:`${FG}${OP("=")}${MM}${G9}`,note:"g = 9.8 m/s². Weight is a force, in newtons."},{name:"Newton's second law",eq:`${FNET}${OP("=")}${MM}${AA}`,note:"Use it one direction at a time."}],
  takeEq:()=>`${FNET}${OP("=")}${MM}${AA}`,
  takeaway:"Up and down: weight and normal force cancel on a flat floor. Sideways: the push alone gives a = F ÷ m.",
  link:"Task 2 on your midterm 1 used the same three ideas on a ramp: the weight, the normal force, and F = ma along the motion. Try “Pulled up a ramp” on Medium next.",
  viz:viz.slider((p,c)=>({note:"Drag the push. The acceleration grows in step with it: double the push, double the acceleration.",label:"Push",unit:"N",min:0,max:2*p.F,step:1,value:p.F,
    bars:[{label:"Acceleration",segs:[{cls:"seg-ke",frac:x=>x/(2*p.F)}]}],read:x=>`${AA} = ${fmt(x)} ÷ ${p.m} = <b>${fmt(R3(x/p.m))} m/s²</b>`})),
  scene:{still:2,draw(K,t,p){const y=172,u=Math.min(mod(t,5.2),4),xb=150+300*(u/4)*(u/4);
    K.ground(y,20,580);block(K,xb,y,64,50,`${p.m} kg`);K.person(xb-58,y,{lean:10,arms:[[22,-34],[22,-28]]});
    K.arrow(xb-32,y-70,xb+18,y-70,{c:"blue",w:2.6});K.tag(`${p.F} N`,xb+22,y-70,{align:"left",size:11});
    if(mod(t,5.2)>4.6)K.rect(0,0,600,220,{fill:"bg",c:false,alpha:(mod(t,5.2)-4.6)/0.6});}}
},

/* ===== 2. Lift cable ===== */
{
  id:"nl-lift", level:"Easy", title:"Lift cable", hw:"Course topic: Newton's second law",
  base:{m:600,a:1.5},
  random:()=>({m:pick([400,450,500,600,700,800,1000,1200]),a:pick([0.5,0.8,1,1.2,1.5,2,2.5])}),
  calc:p=>({up:p.m*(g+p.a),steady:p.m*g,slow:p.m*(g-p.a)}),
  text:(p,G,T)=>`A lift and its passengers have a total mass of ${G("m",`${p.m} kg`)} and hang from one cable. The lift is going up. Find the ${T("tension","tension")} in the cable while it is (a) speeding up at ${G("a",`${p.a} m/s²`)}, (b) moving at a steady speed, and (c) slowing down at ${p.a} m/s², just before it stops at the top floor.`,
  terms:{tension:TERMS.tension},
  given:p=>[
    {k:"m",sym:MM,name:"mass of the lift and passengers",unit:"kg",val:p.m,why:"Everything the cable holds up.",look:"The number measured in kg."},
    {k:"a",sym:AA,name:"size of the acceleration",unit:"m/s²",val:p.a,why:"How quickly the speed changes in parts (a) and (c). You'll decide its direction (sign) yourself.",look:"The number measured in m/s²."}
  ],
  find:[{sym:T1,name:"tension while speeding up",unit:"N",why:"Part (a)."},{sym:T2,name:"tension at steady speed",unit:"N",why:"Part (b)."},{sym:T3,name:"tension while slowing down",unit:"N",why:"Part (c)."}],
  parts:[
    {id:"up",label:"(a) Speeding up on the way up",sym:T1,unit:"N",ans:(p,c)=>c.up,traps:(p,c)=>clean([[c.steady,"That's the tension at steady speed. While speeding up, the cable has to pull harder than the weight: T = m(g + a)."],[c.slow,"Speeding up on the way up needs more pull, not less: T = m(g + a)."],[p.m*p.a,"The cable also has to hold the lift up against gravity: T − mg = ma, so T = m(g + a)."]],c.up)},
    {id:"steady",label:"(b) Steady speed",sym:T2,unit:"N",ans:(p,c)=>c.steady,traps:(p,c)=>clean([[c.up,"At a steady speed the acceleration is 0, so the cable pulls exactly the weight: T = mg."],[0,"The cable still holds the lift up against gravity: T = mg."],[p.m,"Use newtons: T = m × g."]],c.steady)},
    {id:"slow",label:"(c) Slowing down on the way up",sym:T3,unit:"N",ans:(p,c)=>c.slow,traps:(p,c)=>clean([[c.up,"The lift is going up but slowing down, so its acceleration points down. Use a negative a: T = m(g − a)."],[c.steady,"It isn't moving steadily: it's slowing down, so the cable pulls less than the weight: T = m(g − a)."],[p.m*p.a,"The cable holds the weight too: T = m(g − a)."]],c.slow)}
  ],
  idea:()=>`<p>Two forces act on the lift: the cable pulls <b>up</b> with the tension T, and gravity pulls <b>down</b> with mg. Take up as positive. Newton's second law then says T − mg = ma.</p>
    <ul class="plain"><li><b>Speeding up while going up:</b> the acceleration points up, so a is positive.</li><li><b>Steady speed:</b> no acceleration, a = 0.</li><li><b>Slowing down while going up:</b> it still moves up, but the speed is shrinking, so the acceleration points <b>down</b>: a is negative.</li></ul>
    <p>Rearranged: T = m(g + a), with the right sign of a each time.</p>
    <p class="small">Try it now. The next hint gives you the formula.</p>`,
  formula:()=>EQ(`${TT}${OP("−")}${MM}${G9}${OP("=")}${MM}${AA}${IMPLIES}${TT}${OP("=")}${MM}(${G9}${OP("+")}${AA})`)+
    legend([[TT,"tension in the cable","N"],[MM,"mass of the lift","kg"],[AA,"acceleration, + when it points up, − when it points down","m/s²"]],"Velocity tells you which way it moves; acceleration tells you which way the velocity is changing. Going up and slowing down means the acceleration points down."),
  plug:p=>EQ(`${T1}${OP("=")}${p.m}${OP("×")}(9.8${OP("+")}${p.a})`)+EQ(`${T2}${OP("=")}${p.m}${OP("×")}(9.8${OP("+")}0)`)+EQ(`${T3}${OP("=")}${p.m}${OP("×")}(9.8${OP("−")}${p.a})`),
  solution:(p,c)=>steps([
      ["Forces and Newton's law",`Up: tension ${TT}. Down: weight ${MM}${G9} = ${p.m} × 9.8 = ${fmt(c.steady)} N. So ${TT} − ${fmt(c.steady)} = ${p.m}${AA}.`],
      ["(a) Speeding up: a = +"+p.a,CALC(`${T1} = ${p.m} × (9.8 + ${p.a}) = <b>${fmt(c.up)} N</b>`)],
      ["(b) Steady: a = 0",CALC(`${T2} = ${p.m} × 9.8 = <b>${fmt(c.steady)} N</b>`)],
      ["(c) Slowing on the way up: a = −"+p.a,CALC(`${T3} = ${p.m} × (9.8 − ${p.a}) = <b>${fmt(c.slow)} N</b>`)]
    ])+checkline(`The cable pulls hardest while speeding up, exactly the weight at steady speed, and least while slowing down: ${fmt(c.up)} > ${fmt(c.steady)} > ${fmt(c.slow)} N ✓`)+
    finalAns(`${T1} = ${fmt(c.up)} N, &nbsp;${T2} = ${fmt(c.steady)} N, &nbsp;${T3} = ${fmt(c.slow)} N`),
  sheet:[{name:"Hanging on a cable",eq:`${TT}${OP("=")}${MM}(${G9}${OP("+")}${AA})`,note:"a is + when the acceleration points up, − when it points down. Steady speed: a = 0."}],
  takeEq:()=>`${TT}${OP("=")}${MM}(${G9}${OP("+")}${AA})`,
  takeaway:"Tension = m(g + a), with a positive when the acceleration points up and negative when it points down. Steady speed means a = 0.",
  link:"The same equation, T − mg = ma, is one half of the Atwood machine: task 1 on your midterm 1. Try “Atwood machine” on Medium next.",
  viz:viz.slider((p,c)=>({note:"Drag the acceleration (up is +). The cable pulls exactly the weight at 0, more when accelerating up, less when accelerating down.",label:"Acceleration",unit:"m/s²",min:-2*p.a,max:2*p.a,step:0.1,value:p.a,
    bars:[{label:"Tension (full bar = the tension at the top of the slider)",segs:[{cls:"seg-ke",frac:x=>(g+x)/(g+2*p.a)}]}],read:x=>`${TT} = ${p.m} × (9.8 ${x<0?"−":"+"} ${fmt(Math.abs(R3(x)))}) = <b>${fmt(R3(p.m*(g+x)))} N</b>${Math.abs(x)<0.05?" (exactly the weight)":""}`})),
  scene:{still:2.4,draw(K,t,p){const u=mod(t,6.2),k=25.4;let s,ph;
    if(u<1.6){s=0.5*k*u*u;ph="speeding up";}else if(u<3.2){s=1.28*k+1.6*k*(u-1.6);ph="steady speed";}else if(u<4.8){const w=u-3.2;s=3.84*k+1.6*k*w-0.5*k*w*w;ph="slowing down";}else{s=5.12*k;ph="stopped";}
    const top=150-s,x=300;K.line(250,8,250,214,{c:"rule",w:2});K.line(350,8,350,214,{c:"rule",w:2});K.ceiling(8,240,360);
    K.line(x,8,x,top,{c:"ink",w:2});K.rect(x-38,top,76,62,{fill:"blueSoft",c:"ink",w:2,r:4});K.rect(x-12,top+10,24,40,{fill:"card",c:"ink2",w:1,r:2});
    K.tag(`${p.m} kg`,x,top+74>205?top-12:top+76,{size:11});K.tag(ph,470,110,{size:11});K.arrow(470,90,470,60,{c:"ink2",w:1.6});
    if(u>5.6)K.rect(0,0,600,220,{fill:"bg",c:false,alpha:(u-5.6)/0.6});}}
},

/* ===== 3. Atwood machine (midterm 1, task 1) ===== */
{
  id:"nl-atwood", level:"Medium", title:"Atwood machine", hw:"Midterm 1, task 1",
  base:{m1:1.8,m2:2.2},
  random:()=>{const m1=pick([1.2,1.5,1.6,1.8,2,2.4,2.5,3]),d=pick([0.2,0.4,0.5,0.6,0.8,1,1.2]);return {m1,m2:R3(m1+d)};},
  calc:p=>{const M=p.m1+p.m2,a=(p.m2-p.m1)*g/M;return {M,a,T:p.m1*(g+a)};},
  text:(p,G,T)=>`Two blocks are connected by a light cord that passes over a ${T("pulley","frictionless pulley")} (an ${T("atwood","Atwood machine")}). One block has a mass of ${G("m1",`m₁ = ${p.m1} kg`)}, the other ${G("m2",`m₂ = ${p.m2} kg`)}. What are (a) the size of the acceleration of the blocks and (b) the ${T("tension","tension")} in the cord?`,
  terms:{pulley:TERMS.pulley,atwood:TERMS.atwood,tension:TERMS.tension},
  given:p=>[
    {k:"m1",sym:M1,name:"mass of the lighter block",unit:"kg",val:p.m1,why:"This one will move up.",look:"The first mass.",gtraps:[[p.m2,"That's the heavier block. Call the lighter one m₁."]]},
    {k:"m2",sym:M2,name:"mass of the heavier block",unit:"kg",val:p.m2,why:"This one will move down.",look:"The second mass.",gtraps:[[p.m1,"That's the lighter block. m₂ is the heavier one."]]}
  ],
  find:[{sym:AA,name:"acceleration of the blocks",unit:"m/s²",why:"Part (a). Both blocks have the same size of acceleration, because the cord doesn't stretch."},{sym:TT,name:"tension in the cord",unit:"N",why:"Part (b). The same all along the cord."}],
  parts:[
    {id:"a",label:"(a) Acceleration of the blocks",sym:AA,unit:"m/s²",ans:(p,c)=>c.a,traps:(p,c)=>clean([[g,"That's free fall. The lighter block holds the heavier one back, so the acceleration is much smaller."],[(p.m2-p.m1)*g,"Divide by the total mass m₁ + m₂: both blocks are being accelerated."],[(p.m2-p.m1)*g/p.m2,"Divide by the total mass m₁ + m₂: the pull has to accelerate both blocks."],[(p.m2-p.m1)/c.M,"Multiply by g = 9.8: the driving force is the difference in weights, (m₂ − m₁)g."],[(p.m2+p.m1)*g/(p.m2-p.m1),"Upside down: a = (m₂ − m₁)g ÷ (m₁ + m₂)."]],c.a)},
    {id:"T",label:"(b) Tension in the cord",sym:TT,unit:"N",ans:(p,c)=>c.T,traps:(p,c)=>clean([[p.m1*g,"That's the lighter block's weight. The cord pulls harder than that, because it also accelerates that block upwards: T = m₁(g + a)."],[p.m2*g,"That's the heavier block's weight. The cord pulls less than that, because the heavy block accelerates downwards: T = m₂(g − a)."],[p.m1*c.a,"T − m₁g = m₁a: the cord also holds up the block's weight. T = m₁(g + a)."],[(p.m1+p.m2)*g,"That's the total weight. Each block feels the tension separately: T = m₁(g + a)."]],c.T)}
  ],
  idea:()=>`<p>One cord, so both blocks move together with the same size of acceleration: the heavier block goes down, the lighter one goes up. The tension T is the same on both sides of the pulley.</p>
    <p>Write Newton's second law for <b>each block on its own</b>, taking its own direction of motion as positive:</p>
    <ul class="plain"><li>Lighter block (going up): the cord pulls up, gravity pulls down, so T − m₁g = m₁a.</li><li>Heavier block (going down): gravity pulls down, the cord pulls up, so m₂g − T = m₂a.</li></ul>
    <p>Add the two equations: the T's cancel, leaving (m₂ − m₁)g = (m₁ + m₂)a. That gives a. Then put a back into either equation to get T.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${TT}${OP("−")}${M1}${G9}${OP("=")}${M1}${AA}${AND}${M2}${G9}${OP("−")}${TT}${OP("=")}${M2}${AA}`)+
    EQ(`${AA}${OP("=")}${FR(`(${M2}${OP("−")}${M1})${G9}`,`${M1}${OP("+")}${M2}`)}${AND}${TT}${OP("=")}${M1}(${G9}${OP("+")}${AA})`)+
    legend([[M1,"lighter block (goes up)","kg"],[M2,"heavier block (goes down)","kg"],[AA,"size of each block's acceleration","m/s²"],[TT,"tension, the same on both sides","N"]],`You can also write T in one go: ${TT} = 2${M1}${M2}${G9} ÷ (${M1} + ${M2}).`),
  plug:p=>EQ(`${AA}${OP("=")}${FR(`(${p.m2}${OP("−")}${p.m1})${OP("×")}9.8`,`${p.m1}${OP("+")}${p.m2}`)}`)+EQ(`${TT}${OP("=")}${p.m1}${OP("×")}(9.8${OP("+")}${AA})`)+calcTip(`(${p.m2}-${p.m1})*9.8/(${p.m1}+${p.m2})`),
  solution:(p,c)=>steps([
      ["One equation per block",CALC(`${TT} − ${p.m1} × 9.8 = ${p.m1}${AA}`)+CALC(`${p.m2} × 9.8 − ${TT} = ${p.m2}${AA}`)],
      ["(a) Add them: T cancels",CALC(`(${p.m2} − ${p.m1}) × 9.8 = (${p.m1} + ${p.m2})${AA} &nbsp;→&nbsp; ${AA} = ${fmt((p.m2-p.m1)*g)} ÷ ${fmt(c.M)} = <b>${fmt(c.a)} m/s²</b>`)],
      ["(b) Tension from the lighter block",CALC(`${TT} = ${p.m1} × (9.8 + ${fmt(c.a)}) = <b>${fmt(c.T)} N</b>`)]
    ])+checkline(`From the heavier block instead: ${TT} = ${p.m2} × (9.8 − ${fmt(c.a)}) = ${fmt(p.m2*(g-c.a))} N ✓. The tension sits between the two weights (${fmt(p.m1*g)} N and ${fmt(p.m2*g)} N), as it must.`)+
    finalAns(`${AA} = ${fmt(c.a)} m/s², &nbsp;${TT} = ${fmt(c.T)} N`),
  sheet:[{name:"Atwood machine",eq:`${AA}${OP("=")}${FR(`(${M2}${OP("−")}${M1})${G9}`,`${M1}${OP("+")}${M2}`)},${OP("")}${TT}${OP("=")}${M1}(${G9}${OP("+")}${AA})`,note:"One F = ma equation per block, then add them so T cancels."}],
  takeEq:()=>`${AA}${OP("=")}${FR(`(${M2}${OP("−")}${M1})${G9}`,`${M1}${OP("+")}${M2}`)}`,
  takeaway:"Write F = ma for each block in its own direction of motion, add the equations so the tension cancels, then put a back in to find T.",
  link:(p)=>`This is task 1 of your midterm 1, which had m₁ = 1.8 kg and m₂ = 2.2 kg. The first numbers on this page are exactly those: a = 0.98 m/s², T = 19.4 N.`,
  viz:viz.slider((p,c)=>({note:"Drag the heavier mass. Equal masses don't move at all; a very heavy block falls almost freely, and the tension tends to 2m₁g.",label:"Heavier mass m₂",unit:"kg",min:p.m1,max:R3(4*p.m1),step:0.1,value:p.m2,
    bars:[{label:"Acceleration (full bar = free fall, 9.8 m/s²)",segs:[{cls:"seg-ke",frac:x=>(x-p.m1)/(x+p.m1)}]},{label:"Tension (full bar = 2m₁g)",segs:[{cls:"seg-alt",frac:x=>x/(x+p.m1)}]}],
    read:x=>{const a=(x-p.m1)*g/(x+p.m1);return `${AA} = <b>${fmt(R3(a))} m/s²</b>, &nbsp;${TT} = <b>${fmt(R3(p.m1*(g+a)))} N</b>`;}})),
  scene:{still:1.4,draw(K,t,p){const u=mod(t,4.6),s=u<3.2?40*(u/3.2)*(u/3.2):40,px=300,py=44,r=36,h1=26+6*p.m1,h2=26+6*p.m2,w=48;
    K.ceiling(10,262,338);K.line(px,10,px,py,{w:2.4});
    const y1=122-s,y2=122+s;K.line(px-r,py,px-r,y1,{w:1.8});K.line(px+r,py,px+r,y2,{w:1.8});pulley(K,px,py,r,s/r);
    K.rect(px-r-w/2,y1,w,h1,{fill:"marker",c:"ink",w:1.6,r:3});K.text(`${p.m1} kg`,px-r,y1+h1/2,{size:11,bold:true,c:"#14244a"});
    K.rect(px+r-w/2,y2,w,h2,{fill:"marker",c:"ink",w:1.6,r:3});K.text(`${p.m2} kg`,px+r,y2+h2/2,{size:11,bold:true,c:"#14244a"});
    if(u>4)K.rect(0,0,600,220,{fill:"bg",c:false,alpha:(u-4)/0.6});}}
},

/* ===== 4. Pulled up a ramp (midterm 1, task 2) ===== */
{
  id:"nl-ramp-pull", level:"Medium", title:"Pulled up a ramp", hw:"Midterm 1, task 2",
  base:{m:3.5,al:35,T:35},
  random:()=>{const m=pick([2,2.5,3,3.5,4,5]),al=pick([20,25,30,35,40]);return {m,al,T:Math.round(m*g*sin(al)+m*pick([1,1.5,2,3,4]))};},
  calc:p=>{const Fg=p.m*g,FNv=Fg*cos(p.al),along=Fg*sin(p.al);return {Fg,FN:FNv,along,a:(p.T-along)/p.m};},
  text:(p,G,T)=>`A ${G("m",`${p.m} kg`)} box is pulled by a cord along a ${T("smooth","frictionless")} ${T("incline","plane inclined")} at ${G("al",`α = ${p.al}°`)}. The cord runs parallel to the ramp and pulls with ${G("T",`T = ${p.T} N`)}. What are the sizes of all the forces on the box: (a) its weight and (b) the ${T("normal","normal force")} from the ramp (the cord's pull is ${p.T} N)? (c) What is the box's acceleration along the ramp?`,
  terms:{smooth:TERMS.smooth,incline:TERMS.incline,normal:TERMS.normal},
  given:p=>[
    {k:"m",sym:MM,name:"mass of the box",unit:"kg",val:p.m,why:"Gives the weight and goes into F = ma.",look:"The number measured in kg."},
    {k:"al",sym:AL,name:"angle of the ramp",unit:"°",val:p.al,why:"Measured from the horizontal.",look:"The angle in degrees."},
    {k:"T",sym:TT,name:"pull of the cord",unit:"N",val:p.T,why:"A force along the ramp, pointing up the slope.",look:"The force measured in N."}
  ],
  find:[{sym:FG,name:"weight",unit:"N",why:"Part (a)."},{sym:FN,name:"normal force",unit:"N",why:"Part (b). The ramp pushing straight out of its surface."},{sym:AA,name:"acceleration along the ramp",unit:"m/s²",why:"Part (c). Positive means up the slope."}],
  parts:[
    {id:"Fg",label:"(a) Weight of the box",sym:FG,unit:"N",ans:(p,c)=>c.Fg,traps:(p,c)=>clean([[p.m,"That's the mass. Weight is a force: m × g."],[c.FN,"That's the normal force. The weight is the full pull of gravity: m × g."]],c.Fg)},
    {id:"FN",label:"(b) Normal force from the ramp",sym:FN,unit:"N",ans:(p,c)=>c.FN,traps:(p,c)=>clean([[c.Fg,"On a ramp the surface only holds back the part of the weight that presses into it: F_N = mg cos α."],[c.along,"That's the part of the weight along the ramp (sin). The normal force balances the part pressing into the ramp: mg cos α."],radTrap(c.Fg*Math.cos(p.al)),[c.Fg*cos(p.al)+p.T,"The cord pulls along the ramp, not into it, so it doesn't change the normal force."]],c.FN)},
    {id:"a",label:"(c) Acceleration along the ramp",sym:AA,unit:"m/s²",ans:(p,c)=>c.a,traps:(p,c)=>clean([[(p.T-c.FN)/p.m,"Use the part of the weight along the ramp: mg sin α (sin, not cos)."],[p.T/p.m,"Gravity also pulls the box back down the slope: subtract mg sin α."],[(p.T+c.along)/p.m,"Gravity's part along the ramp points down the slope, against the pull: T − mg sin α."],[(p.T-c.Fg)/p.m,"Only part of the weight acts along the ramp: mg sin α."],radTrap((p.T-c.Fg*Math.sin(p.al))/p.m)],c.a)}
  ],
  idea:()=>`<p>On a ramp, tilt your directions to match it: one direction <b>along</b> the ramp, one <b>straight out of</b> the ramp. Then split the weight mg into two parts:</p>
    <ul class="plain"><li><b>mg sin α</b> along the ramp, pulling the box down the slope.</li><li><b>mg cos α</b> into the ramp, pressing the box onto it.</li></ul>
    <p>Out of the ramp: the box doesn't sink or lift off, so the normal force balances the part pressing in: F_N = mg cos α.</p>
    <p>Along the ramp: the cord pulls up the slope with T, gravity's part pulls down the slope, so T − mg sin α = ma.</p>
    <p>So the forces on the box are its weight, the normal force and the cord's pull, and nothing else (the ramp is frictionless).</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${FG}${OP("=")}${MM}${G9}`)+EQ(`${FN}${OP("=")}${MM}${G9}${OP("")}${COS(AL)}`)+EQ(`${TT}${OP("−")}${MM}${G9}${OP("")}${SIN(AL)}${OP("=")}${MM}${AA}${IMPLIES}${AA}${OP("=")}${FR(`${TT}${OP("−")}${MM}${G9}${OP("")}${SIN(AL)}`,MM)}`)+
    legend([[FG,"weight","N"],[FN,"normal force (out of the ramp)","N"],[TT,"pull of the cord (up the slope)","N"],[AL,"angle of the ramp","°"]],`${DEG} A trick to remember which is which: at α = 0 (flat ground) the normal force must be the whole weight, and cos 0° = 1.`),
  plug:p=>EQ(`${FG}${OP("=")}${p.m}${OP("×")}9.8`)+EQ(`${FN}${OP("=")}${p.m}${OP("×")}9.8${OP("×")}${COS(`${p.al}°`)}`)+EQ(`${AA}${OP("=")}${FR(`${p.T}${OP("−")}${p.m}${OP("×")}9.8${OP("×")}${SIN(`${p.al}°`)}`,p.m)}`)+`<p class="tip"><b>Tip:</b> ${DEG}</p>`,
  solution:(p,c)=>steps([
      ["(a) Weight",CALC(`${FG} = ${p.m} × 9.8 = <b>${fmt(c.Fg)} N</b>`)],
      ["Split the weight",CALC(`along the ramp: ${fmt(c.Fg)} × sin ${p.al}° = ${fmt(c.along)} N &nbsp;·&nbsp; into the ramp: ${fmt(c.Fg)} × cos ${p.al}° = ${fmt(c.FN)} N`)],
      ["(b) Out of the ramp: forces balance",CALC(`${FN} = ${MM}${G9} cos ${AL} = <b>${fmt(c.FN)} N</b>`)],
      ["(c) Along the ramp: F = ma",CALC(`${AA} = (${p.T} − ${fmt(c.along)}) ÷ ${p.m} = ${fmt(p.T-c.along)} ÷ ${p.m} = <b>${fmt(c.a)} m/s²</b>`)+`<p class="small">Positive: the box speeds up going up the slope.</p>`]
    ])+checkline(`All the forces on the box: weight ${fmt(c.Fg)} N, normal force ${fmt(c.FN)} N, and the cord's ${p.T} N. Check the split of the weight: √(${fmt(c.along)}² + ${fmt(c.FN)}²) = ${fmt(Math.hypot(c.along,c.FN))} N, the full weight ✓`)+
    finalAns(`${FG} = ${fmt(c.Fg)} N, &nbsp;${FN} = ${fmt(c.FN)} N, &nbsp;${TT} = ${p.T} N, &nbsp;${AA} = ${fmt(c.a)} m/s²`),
  sheet:[{name:"Box on a ramp",eq:`${FN}${OP("=")}${MM}${G9}${OP("")}${COS(AL)},${OP("")}along:${OP("")}${MM}${G9}${OP("")}${SIN(AL)}`,note:"cos goes into the ramp, sin goes along it. Calculator in degrees."}],
  takeEq:()=>`${TT}${OP("−")}${MM}${G9}${OP("")}${SIN(AL)}${OP("=")}${MM}${AA}`,
  takeaway:"Tilt your directions with the ramp. Into the ramp: F_N = mg cos α. Along the ramp: T − mg sin α = ma.",
  link:"This is task 2 of your midterm 1, which had 3.5 kg, α = 35° and T = 35 N. The first numbers on this page are exactly those.",
  viz:viz.slider((p,c)=>({note:"Drag the angle. As the ramp gets steeper, more of the weight pulls down the slope (sin) and less presses into it (cos).",label:"Ramp angle",unit:"°",min:0,max:80,step:1,value:p.al,
    bars:[{label:"Part of the weight along the ramp, mg sin α",segs:[{cls:"seg-heat",frac:x=>sin(x)}]},{label:"Part of the weight into the ramp, mg cos α (= the normal force)",segs:[{cls:"seg-ke",frac:x=>cos(x)}]}],
    read:x=>{const a=(p.T-p.m*g*sin(x))/p.m;return `At ${x}°: ${FN} = <b>${fmt(R3(p.m*g*cos(x)))} N</b>, &nbsp;${AA} = <b>${fmt(R3(a))} m/s²</b>${a<0?" (the cord can't hold it: it slides back down)":""}`;}})),
  scene:{still:1.8,draw(K,t,p){const L=Math.min(470,160/Math.tan(rad(p.al)))/Math.cos(rad(p.al)),R=ramp(K,70,194,p.al,L),u=Math.min(mod(t,5),3.6),s=L*(0.12+0.55*(u/3.6)*(u/3.6));
    const P=R.at(s),Q=rbox(K,P[0],P[1],52,34,R.a,`${p.m} kg`),front=Q(26,17),e0=R.at(L+30),end=[e0[0]-17*Math.sin(R.a),e0[1]-17*Math.cos(R.a)];
    K.line(front[0],front[1],end[0],end[1],{c:"ink",w:1.8});K.circle(end[0],end[1],4,{fill:"ink",c:false});
    K.arc(70,194,46,-R.a,0,{c:"heat",w:1.6});K.tag(`${p.al}°`,70+62*Math.cos(R.a/2),194-62*Math.sin(R.a/2),{size:11,c:"heat"});
    K.tag(`${p.T} N`,(front[0]+end[0])/2,(front[1]+end[1])/2-28,{size:11});
    if(mod(t,5)>4.4)K.rect(0,0,600,220,{fill:"bg",c:false,alpha:(mod(t,5)-4.4)/0.6});}}
},

/* ===== 5. Block on a table pulled by a hanging block ===== */
{
  id:"nl-table", level:"Hard", title:"Table and hanging block", hw:"Course topic: Newton's laws with friction",
  base:{m1:3,m2:2,mu:0.2},
  random:()=>{for(;;){const m1=pick([2,2.5,3,4,5]),m2=pick([1,1.5,2,2.5,3]),mu=pick([0.1,0.15,0.2,0.25,0.3]),a=(m2-mu*m1)*g/(m1+m2);if(a>=0.5)return {m1,m2,mu};}},
  calc:p=>{const f=p.mu*p.m1*g,a=(p.m2*g-f)/(p.m1+p.m2);return {f,a,T:p.m2*(g-a)};},
  text:(p,G,T)=>`A ${G("m1",`m₁ = ${p.m1} kg`)} block rests on a table. A light cord pulls it towards the edge, runs over a ${T("pulley","frictionless pulley")} there, and holds a ${G("m2",`m₂ = ${p.m2} kg`)} block hanging below. The ${T("kinetic","coefficient of kinetic friction")} between the table and the block is ${G("mu",`${p.mu}`)}. Find (a) the friction force on the block on the table, (b) the acceleration of the blocks, and (c) the ${T("tension","tension")} in the cord.`,
  terms:{pulley:TERMS.pulley,kinetic:TERMS.kinetic,tension:TERMS.tension},
  given:p=>[
    {k:"m1",sym:M1,name:"mass of the block on the table",unit:"kg",val:p.m1,why:"Friction acts on this one.",look:"The block on the table."},
    {k:"m2",sym:M2,name:"mass of the hanging block",unit:"kg",val:p.m2,why:"Its weight pulls the whole system.",look:"The block hanging below.",gtraps:p.m1!==p.m2?[[p.m1,"That's the block on the table."]]:[]},
    {k:"mu",sym:MU,name:"coefficient of kinetic friction",unit:"",val:p.mu,why:"No unit: it's a ratio.",look:"The plain number with no unit."}
  ],
  find:[{sym:FK,name:"friction force",unit:"N",why:"Part (a)."},{sym:AA,name:"acceleration",unit:"m/s²",why:"Part (b). The same size for both blocks."},{sym:TT,name:"tension",unit:"N",why:"Part (c)."}],
  parts:[
    {id:"f",label:"(a) Friction force on the block on the table",sym:FK,unit:"N",ans:(p,c)=>c.f,traps:(p,c)=>clean([[p.mu*p.m2*g,"Friction acts on the block on the table, so use its mass m₁."],[p.mu*p.m1,"Friction is μ × normal force, and the normal force is m₁g. Multiply by g."],[p.mu*(p.m1+p.m2)*g,"Only the block on the table rubs on the table: f = μm₁g."]],c.f)},
    {id:"a",label:"(b) Acceleration of the blocks",sym:AA,unit:"m/s²",ans:(p,c)=>c.a,traps:(p,c)=>clean([[p.m2*g/(p.m1+p.m2),"You left out friction. It holds the blocks back: a = (m₂g − f) ÷ (m₁ + m₂)."],[(p.m2*g-c.f)/p.m2,"Both blocks move together, so divide by the total mass m₁ + m₂."],[(p.m2*g-c.f)/p.m1,"Both blocks move together, so divide by the total mass m₁ + m₂."],[(p.m2*g+c.f)/(p.m1+p.m2),"Friction points against the motion, so subtract it."],[g,"That's free fall. The block on the table holds the hanging one back."]],c.a)},
    {id:"T",label:"(c) Tension in the cord",sym:TT,unit:"N",ans:(p,c)=>c.T,traps:(p,c)=>clean([[p.m2*g,"That's the hanging block's weight. It accelerates downwards, so the cord pulls less than that: T = m₂(g − a)."],[p.m1*c.a,"That's only the part that accelerates m₁. The cord also has to beat friction: T = m₁a + f."],[c.f,"That's friction alone. The cord also accelerates the block: T = m₁a + f."]],c.T)}
  ],
  idea:()=>`<p>Same plan as the Atwood machine: one cord, so both blocks share the same size of acceleration. Write F = ma for each block in its own direction of motion.</p>
    <ul class="plain"><li><b>Block on the table</b> (moving towards the pulley): the cord pulls it forward with T, friction pulls it back with f. So T − f = m₁a.</li>
    <li><b>Friction:</b> f = μ × the normal force. The table holds up the block's weight, so the normal force is m₁g, and f = μm₁g.</li>
    <li><b>Hanging block</b> (moving down): its weight pulls down, the cord pulls up. So m₂g − T = m₂a.</li></ul>
    <p>Add the two equations so T cancels: m₂g − f = (m₁ + m₂)a.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${FK}${OP("=")}${MU}${M1}${G9}`)+EQ(`${TT}${OP("−")}${FK}${OP("=")}${M1}${AA}${AND}${M2}${G9}${OP("−")}${TT}${OP("=")}${M2}${AA}`)+
    EQ(`${AA}${OP("=")}${FR(`${M2}${G9}${OP("−")}${FK}`,`${M1}${OP("+")}${M2}`)}${AND}${TT}${OP("=")}${M2}(${G9}${OP("−")}${AA})`)+
    legend([[FK,"kinetic friction on the block on the table","N"],[MU,"coefficient of kinetic friction",""],[M1,"block on the table","kg"],[M2,"hanging block","kg"]]),
  plug:p=>EQ(`${FK}${OP("=")}${p.mu}${OP("×")}${p.m1}${OP("×")}9.8`)+EQ(`${AA}${OP("=")}${FR(`${p.m2}${OP("×")}9.8${OP("−")}${FK}`,`${p.m1}${OP("+")}${p.m2}`)}`)+EQ(`${TT}${OP("=")}${p.m2}${OP("×")}(9.8${OP("−")}${AA})`),
  solution:(p,c)=>steps([
      ["(a) Friction",CALC(`${FK} = ${p.mu} × ${p.m1} × 9.8 = <b>${fmt(c.f)} N</b>`)],
      ["One equation per block",CALC(`${TT} − ${fmt(c.f)} = ${p.m1}${AA}`)+CALC(`${p.m2} × 9.8 − ${TT} = ${p.m2}${AA}`)],
      ["(b) Add them: T cancels",CALC(`${fmt(p.m2*g)} − ${fmt(c.f)} = ${fmt(p.m1+p.m2)}${AA} &nbsp;→&nbsp; ${AA} = <b>${fmt(c.a)} m/s²</b>`)],
      ["(c) Tension from the hanging block",CALC(`${TT} = ${p.m2} × (9.8 − ${fmt(c.a)}) = <b>${fmt(c.T)} N</b>`)]
    ])+checkline(`From the block on the table instead: ${TT} = ${p.m1} × ${fmt(c.a)} + ${fmt(c.f)} = ${fmt(p.m1*c.a+c.f)} N ✓`)+
    finalAns(`${FK} = ${fmt(c.f)} N, &nbsp;${AA} = ${fmt(c.a)} m/s², &nbsp;${TT} = ${fmt(c.T)} N`),
  sheet:[{name:"Kinetic friction",eq:`${FK}${OP("=")}${MU}${FN}`,note:"On flat ground F_N = mg. Friction points against the sliding."}],
  takeEq:()=>`${AA}${OP("=")}${FR(`${M2}${G9}${OP("−")}${MU}${M1}${G9}`,`${M1}${OP("+")}${M2}`)}`,
  takeaway:"One F = ma equation per block, friction f = μm₁g against the motion, then add the equations so the tension cancels.",
  link:"This is the Atwood machine (midterm 1, task 1) with one block lying on a table instead of hanging, plus friction.",
  viz:viz.slider((p,c)=>({note:"Drag the friction coefficient. With more friction the blocks speed up more slowly, and above a certain μ they don't move at all.",label:"Friction coefficient μ",unit:"",min:0,max:R3(Math.min(1,p.m2/p.m1)),step:0.01,value:p.mu,
    bars:[{label:"Acceleration (full bar = no friction)",segs:[{cls:"seg-ke",frac:x=>Math.max(0,p.m2-x*p.m1)/p.m2}]}],
    read:x=>{const a=Math.max(0,(p.m2-x*p.m1)*g/(p.m1+p.m2));return a<=0.001?"The blocks don't move: friction can hold the hanging weight.":`${AA} = <b>${fmt(R3(a))} m/s²</b>, &nbsp;${TT} = <b>${fmt(R3(p.m2*(g-a)))} N</b>`;}})),
  scene:{still:1.6,draw(K,t,p){const u=Math.min(mod(t,5),3.6),s=150*(u/3.6)*(u/3.6),ty=112,px=440,r=16;
    K.line(40,ty,px,ty,{w:3});K.line(70,ty,70,212,{w:3});K.line(410,ty,410,212,{w:3});K.ground(212,20,580);
    const bx=170+s;block(K,bx,ty,62,40,`${p.m1} kg`);
    for(let i=0;i<4;i++){const x=bx-24+i*14;K.line(x,ty+2,x+6,ty+7,{c:"heat",w:1.4,alpha:0.7});}
    const hy=120+s*0.55;K.line(bx+31,ty-20,px,ty-20+0,{w:1.8});K.line(px+r,ty-20+r,px+r,hy,{w:1.8});pulley(K,px,ty-20+r,r,s/r);
    K.rect(px+r-22,hy,44,34+4*p.m2,{fill:"marker",c:"ink",w:1.6,r:3});K.text(`${p.m2} kg`,px+r,hy+(34+4*p.m2)/2,{size:11,bold:true,c:"#14244a"});
    K.tag(`μ = ${p.mu}`,120,ty+28,{size:11,c:"heat"});
    if(mod(t,5)>4.4)K.rect(0,0,600,220,{fill:"bg",c:false,alpha:(mod(t,5)-4.4)/0.6});}}
},

/* ===== 6. Sliding down a rough ramp ===== */
{
  id:"nl-rough-ramp", level:"Hard", title:"Sliding down a rough ramp", hw:"Course topic: friction on an inclined plane",
  base:{m:5,al:35,mu:0.25,d:2},
  random:()=>{for(;;){const al=pick([30,35,40,45,50]),mu=pick([0.1,0.15,0.2,0.25,0.3,0.35]),a=g*(sin(al)-mu*cos(al));if(a>=0.8)return {m:pick([2,3,4,5,6,8]),al,mu,d:pick([1,1.5,2,2.5,3,4])};}},
  calc:p=>{const FNv=p.m*g*cos(p.al),f=p.mu*FNv,a=g*(sin(p.al)-p.mu*cos(p.al));return {FN:FNv,f,a,v:Math.sqrt(2*a*p.d),along:p.m*g*sin(p.al)};},
  text:(p,G,T)=>`A ${G("m",`${p.m} kg`)} box slides down a ramp inclined at ${G("al",`α = ${p.al}°`)}. The ${T("kinetic","coefficient of kinetic friction")} between the box and the ramp is ${G("mu",`${p.mu}`)}. Find (a) the ${T("normal","normal force")} on the box, (b) the friction force, (c) the box's acceleration down the ramp, and (d) its speed after sliding ${G("d",`${p.d} m`)} from rest.`,
  terms:{kinetic:TERMS.kinetic,normal:TERMS.normal},
  given:p=>[
    {k:"m",sym:MM,name:"mass of the box",unit:"kg",val:p.m,why:"It cancels in the end, but you need it for the forces.",look:"The number measured in kg."},
    {k:"al",sym:AL,name:"angle of the ramp",unit:"°",val:p.al,why:"From the horizontal.",look:"The angle in degrees."},
    {k:"mu",sym:MU,name:"coefficient of kinetic friction",unit:"",val:p.mu,why:"No unit.",look:"The plain number with no unit."},
    {k:"d",sym:DD,name:"distance slid",unit:"m",val:p.d,why:"For part (d). It starts from rest.",look:"The distance in m."}
  ],
  find:[{sym:FN,name:"normal force",unit:"N",why:"Part (a)."},{sym:FK,name:"friction force",unit:"N",why:"Part (b)."},{sym:AA,name:"acceleration down the ramp",unit:"m/s²",why:"Part (c)."},{sym:VV,name:"speed after the distance d",unit:"m/s",why:"Part (d)."}],
  parts:[
    {id:"FN",label:"(a) Normal force",sym:FN,unit:"N",ans:(p,c)=>c.FN,traps:(p,c)=>clean([[p.m*g,"On a ramp the normal force is only the part of the weight pressing into it: mg cos α."],[c.along,"That's the part along the ramp (sin). Into the ramp is mg cos α."],radTrap(p.m*g*Math.cos(p.al))],c.FN)},
    {id:"f",label:"(b) Friction force",sym:FK,unit:"N",ans:(p,c)=>c.f,traps:(p,c)=>clean([[p.mu*p.m*g,"Friction is μ × the normal force, and on a ramp that's mg cos α, not mg."],[p.mu*c.along,"Use the normal force (cos), not the part along the ramp (sin)."]],c.f)},
    {id:"a",label:"(c) Acceleration down the ramp",sym:AA,unit:"m/s²",ans:(p,c)=>c.a,traps:(p,c)=>clean([[g*sin(p.al),"That's with no friction. Friction slows it: subtract μg cos α."],[g*(sin(p.al)+p.mu*cos(p.al)),"Friction points up the slope, against the sliding: subtract it."],[g*(cos(p.al)-p.mu*sin(p.al)),"sin and cos are swapped: along the ramp is g sin α, friction uses g cos α."],[g*(sin(p.al)-p.mu),"Friction is μ × normal force = μmg cos α, so a = g(sin α − μ cos α)."],[c.along-c.f,"That's the net force in N. Divide by the mass to get the acceleration."]],c.a)},
    {id:"v",label:"(d) Speed after sliding the distance",sym:VV,unit:"m/s",ans:(p,c)=>c.v,traps:(p,c)=>clean([[2*c.a*p.d,"That's v². Take the square root."],[c.a*p.d,"v² = 2ad, so v = √(2ad)."],[Math.sqrt(2*g*sin(p.al)*p.d),"That's the speed without friction. Use the acceleration from part (c)."]],c.v)}
  ],
  idea:()=>`<p>Tilt your directions with the ramp, as for any ramp: along it and straight out of it. The weight splits into mg sin α along the ramp (down the slope) and mg cos α into the ramp.</p>
    <ul class="plain"><li><b>Out of the ramp:</b> nothing moves that way, so F_N = mg cos α.</li><li><b>Friction:</b> f = μ × F_N, pointing up the slope (against the sliding).</li><li><b>Along the ramp:</b> mg sin α − f = ma. The mass cancels: a = g(sin α − μ cos α).</li></ul>
    <p>For (d), the acceleration is constant, so use the kinematics formula without time: v² = v₀² + 2ad, with v₀ = 0.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${FN}${OP("=")}${MM}${G9}${OP("")}${COS(AL)}${AND}${FK}${OP("=")}${MU}${FN}`)+EQ(`${MM}${G9}${OP("")}${SIN(AL)}${OP("−")}${FK}${OP("=")}${MM}${AA}${IMPLIES}${AA}${OP("=")}${G9}(${SIN(AL)}${OP("−")}${MU}${OP("")}${COS(AL)})`)+EQ(`${sq2(VV)}${OP("=")}2${AA}${DD}`)+
    legend([[FN,"normal force","N"],[FK,"kinetic friction (up the slope)","N"],[AA,"acceleration down the slope","m/s²"],[DD,"distance slid from rest","m"]],DEG),
  plug:p=>EQ(`${FN}${OP("=")}${p.m}${OP("×")}9.8${OP("×")}${COS(`${p.al}°`)}`)+EQ(`${FK}${OP("=")}${p.mu}${OP("×")}${FN}`)+EQ(`${AA}${OP("=")}9.8${OP("×")}(${SIN(`${p.al}°`)}${OP("−")}${p.mu}${OP("×")}${COS(`${p.al}°`)})`)+EQ(`${VV}${OP("=")}${SQ(`2${OP("×")}${AA}${OP("×")}${p.d}`)}`),
  solution:(p,c)=>steps([
      ["(a) Into the ramp",CALC(`${FN} = ${p.m} × 9.8 × cos ${p.al}° = <b>${fmt(c.FN)} N</b>`)],
      ["(b) Friction",CALC(`${FK} = ${p.mu} × ${fmt(c.FN)} = <b>${fmt(c.f)} N</b>`)],
      ["(c) Along the ramp",CALC(`${MM}${AA} = ${fmt(c.along)} − ${fmt(c.f)} = ${fmt(c.along-c.f)} N &nbsp;→&nbsp; ${AA} = ${fmt(c.along-c.f)} ÷ ${p.m} = <b>${fmt(c.a)} m/s²</b>`)],
      ["(d) Speed after "+p.d+" m",CALC(`${VV} = √(2 × ${fmt(c.a)} × ${p.d}) = √${fmt(2*c.a*p.d)} = <b>${fmt(c.v)} m/s</b>`)]
    ])+checkline(`With the formula that skips the mass: a = 9.8 × (sin ${p.al}° − ${p.mu} × cos ${p.al}°) = 9.8 × (${fmt(sin(p.al))} − ${fmt(p.mu*cos(p.al))}) = ${fmt(c.a)} m/s² ✓`)+
    finalAns(`${FN} = ${fmt(c.FN)} N, &nbsp;${FK} = ${fmt(c.f)} N, &nbsp;${AA} = ${fmt(c.a)} m/s², &nbsp;${VV} = ${fmt(c.v)} m/s`),
  sheet:[{name:"Sliding down a rough ramp",eq:`${AA}${OP("=")}${G9}(${SIN(AL)}${OP("−")}${MU}${OP("")}${COS(AL)})`,note:"F_N = mg cos α, friction = μF_N up the slope."}],
  takeEq:()=>`${AA}${OP("=")}${G9}(${SIN(AL)}${OP("−")}${MU}${OP("")}${COS(AL)})`,
  takeaway:"Into the ramp: F_N = mg cos α. Friction = μF_N, against the sliding. Along the ramp: mg sin α − f = ma.",
  link:"This is task 2 of your midterm 1 turned around: the box slides down by itself, and friction takes the place of the cord.",
  viz:viz.slider((p,c)=>({note:"Drag the friction coefficient. When μ reaches tan α, friction balances gravity's pull along the ramp and the box slides at a steady speed.",label:"Friction coefficient μ",unit:"",min:0,max:R3(Math.tan(rad(p.al))),step:0.01,value:p.mu,
    bars:[{label:"Acceleration (full bar = no friction, g sin α)",segs:[{cls:"seg-ke",frac:x=>1-x/Math.tan(rad(p.al))}]}],read:x=>`${AA} = 9.8 × (sin ${p.al}° − ${fmt(x)} × cos ${p.al}°) = <b>${fmt(R3(g*(sin(p.al)-x*cos(p.al))))} m/s²</b>`})),
  scene:{still:1.8,draw(K,t,p){const L=Math.min(470,160/Math.tan(rad(p.al)))/Math.cos(rad(p.al)),R=ramp(K,70,194,p.al,L),u=Math.min(mod(t,4.8),3.4),s=L*(0.85-0.62*(u/3.4)*(u/3.4));
    const P=R.at(s);rbox(K,P[0],P[1],52,34,R.a,`${p.m} kg`);
    for(let i=0;i<3;i++){const q=R.at(s+10+i*12);K.line(q[0],q[1]+1,q[0]+5,q[1]+6,{c:"heat",w:1.4,alpha:0.7});}
    K.arc(70,194,46,-R.a,0,{c:"heat",w:1.6});K.tag(`${p.al}°`,70+62*Math.cos(R.a/2),194-62*Math.sin(R.a/2),{size:11,c:"heat"});K.tag(`μ = ${p.mu}`,R.x1-30,206,{size:11,c:"heat"});
    if(mod(t,4.8)>4.2)K.rect(0,0,600,220,{fill:"bg",c:false,alpha:(mod(t,4.8)-4.2)/0.6});}}
}

]);
})();
