/* Rotation: rotational motion, moment of inertia, torque, angular momentum and rolling.
   Every question on this topic is one object in the list below: its numbers, text, hints,
   answer checks, "See it" panel and animation. See ADDING-QUESTIONS.md for how to add one. */
(function(){
"use strict";
const {fmt,pick,mi,up,sb,ssp,OP,FR,SQ,EQ,CALC,HALF,sq2,neg,IMPLIES,AND,PAREN,PI,OMEGA,V0,VI,VF,KE,KEI,KEF,DKE,legend,steps,checkline,finalAns,watch,calcTip,viz}=HL;
const {R3,clean,pr,sumTxt,draw}=PHYS;
const {F,mod,fadeIn,cyclist,speedLines,springScene,block,curvedArrow}=draw;

/* symbols and helpers used below */
const II=mi("I");
const MM=mi("M");
const RR=mi("R");
const AL=mi("α");
const TAU=mi("τ");
const KER=sb(up("KE"),"rot");
const ONE12=FR("1","12");
const DD=mi("d");
const I1=sb(mi("I"),"1");
const I2=sb(mi("I"),"2");
const W1=sb(OMEGA,"1");
const W2=sb(OMEGA,"2");
const LA=mi("L");
const DKR=up("Δ")+KER;
const ICM=sb(mi("I"),"cm");
const IEND=sb(mi("I"),"end");
const LL=mi("L");

/* for spinning up, the disk pulley and rolling */
const gR=9.8,W0R=sb(OMEGA,"0"),THR=mi("θ"),NREV=mi("N"),TIR=mi("t"),MBL=mi("m"),ACC=mi("a"),TCORD=mi("T"),RAD=mi("r"),HR=mi("h"),VR=mi("v"),CR=mi("c"),VSL=sb(mi("v"),"slide"),VRL=sb(mi("v"),"roll");
const SHAPES={cyl:{name:"solid cylinder",c:0.5,ifrac:"½"},ball:{name:"solid ball",c:0.4,ifrac:"⅖"},hoop:{name:"thin hoop",c:1,ifrac:"1"}};
const fadeR=(K,u,a,b)=>{if(u>a)K.rect(0,0,600,220,{fill:"bg",c:false,alpha:Math.min(1,(u-a)/(b-a))});};

PHYS.add("Rotation",[
{
  id:"rot-flywheel", topic:"Rotation", level:"Medium", title:"Flywheel and brake", hw:"Like HW 2, task 3",
  base:{M:8,R:0.25,w:40,t:5},
  random:()=>{const r=pick([[8,0.25,40,5],[4,0.5,20,4],[2,0.3,50,10],[10,0.2,30,6],[6,0.4,25,5],[5,0.2,60,12]]);return {M:r[0],R:r[1],w:r[2],t:r[3]};},
  calc:p=>{const I=0.5*p.M*p.R*p.R,K=0.5*I*p.w*p.w,al=p.w/p.t;return {I,K,al,tau:I*al,L:I*p.w};},
  text:(p,G,T)=>`A flywheel is a ${T("solid","solid cylinder")} with a mass of ${G("M",`${p.M} kg`)} and a radius of ${G("R",`${p.R} m`)}. It spins about its central axis with an ${T("angvel","angular velocity")} of ${G("w",`${p.w} rad/s`)}. (a) What is its ${T("moi","moment of inertia")}? (b) What is its rotational kinetic energy? (c) A brake stops the flywheel at a steady rate in ${G("t",`${p.t} s`)}. What ${T("torque","torque")} does the brake apply?`,
  terms:{
    solid:["Solid cylinder","A cylinder filled all the way through, like a solid disc or wheel. Different shapes spin differently, and hint 3 gives the formula for this one."],
    angvel:["Angular velocity","How fast something spins, in radians per second (rad/s). One full turn is 2π ≈ 6.28 radians."],
    moi:["Moment of inertia","The spinning version of mass: how hard it is to start or stop something rotating. It depends on the mass and on how far that mass sits from the axis. Measured in kg·m²."],
    torque:["Torque","The spinning version of force: a twist. Measured in newton-metres (N·m)."]
  },
  given:p=>[
    {k:"M",sym:MM,name:"mass",unit:"kg",val:p.M,why:"The mass of the whole flywheel."},
    {k:"R",sym:RR,name:"radius",unit:"m",val:p.R,why:"From the axis to the edge (half the diameter)."},
    {k:"w",sym:OMEGA,name:"angular velocity",unit:"rad/s",val:p.w,why:"How fast it spins. ω is the Greek letter omega."},
    {k:"t",sym:mi("t"),name:"stopping time",unit:"s",val:p.t,why:"How long the brake takes to stop it."}
  ],
  find:[
    {sym:II,name:"moment of inertia",unit:"kg·m²",why:"Part (a)."},
    {sym:KER,name:"rotational kinetic energy",unit:"J",why:"Part (b). The small rot means rotation."},
    {sym:TAU,name:"torque from the brake",unit:"N·m",why:"Part (c). τ is the Greek letter tau."}
  ],
  parts:[
    {id:"I",label:"(a) Moment of inertia",sym:II,unit:"kg·m²",ans:(p,c)=>c.I,traps:(p,c)=>[
      [p.M*p.R*p.R,"MR² is for a thin ring, where all the mass sits at the edge. A solid cylinder has mass spread inside too, so it's ½MR²."],
      [0.5*p.M*p.R,"You forgot to square the radius: ½ × M × R × R."],
      [2*p.M*p.R*p.R,"It looks like you used the diameter. R is the radius, which is half the diameter."],
      [0.4*p.M*p.R*p.R,"⅖MR² is for a solid sphere. A solid cylinder uses ½MR²."]
    ]},
    {id:"K",label:"(b) Rotational kinetic energy",sym:KER,unit:"J",ans:(p,c)=>c.K,traps:(p,c)=>[
      [0.5*c.I*p.w,"You forgot to square ω: KE = ½ × I × ω × ω."],
      [c.I*p.w*p.w,"You're missing a ½: KE = ½Iω². (The same thing happens if you used I = MR² instead of ½MR².)"],
      [0.5*p.M*p.w*p.w,"Use the moment of inertia I, not the mass M: KE = ½Iω²."],
      [c.L,"That's the angular momentum L = Iω. Kinetic energy is ½Iω²."]
    ]},
    {id:"tau",label:"(c) Torque from the brake",sym:TAU,unit:"N·m",ans:(p,c)=>c.tau,traps:(p,c)=>[
      [c.L,"That's the angular momentum L = Iω. Torque is τ = Iα, where α = ω ÷ t."],
      [c.al,"That's the angular acceleration α. Multiply it by I to get the torque."],
      [c.I*p.w*p.t,"Divide ω by the time, don't multiply: α = ω ÷ t."],
      [p.M*c.al,"Use the moment of inertia I, not the mass M: τ = Iα."],
      [c.K/p.t,"That's energy per second (power). Torque is τ = Iα."]
    ]}
  ],
  idea:(p,c)=>`<p>Spinning has its own versions of things you already know. Swap them in, and the formulas look familiar:</p>
    <div class="tbl-wrap"><table class="tbl"><tr><th scope="row">Moving in a line</th><td>mass ${mi("m")}</td><td>speed ${mi("v")}</td><td>force ${mi("F")}</td><td>acceleration ${mi("a")}</td></tr>
    <tr><th scope="row">Spinning</th><td>moment of inertia ${II}</td><td>angular velocity ${OMEGA}</td><td>torque ${TAU}</td><td>angular acceleration ${AL}</td></tr></table></div>
    <ul class="plain">
      <li><b>(a)</b> The moment of inertia depends on the shape, and each shape has its own formula. For a solid cylinder it uses the mass and the radius squared.</li>
      <li><b>(b)</b> In a line, kinetic energy is ½ × mass × speed². Spinning, it's ½ × moment of inertia × angular velocity².</li>
      <li><b>(c)</b> Force = mass × acceleration becomes torque = moment of inertia × angular acceleration. To find the angular acceleration: the wheel loses all ${p.w} rad/s of spin in ${p.t} s, like the braking car question.</li>
    </ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${II}${OP("=")}${HALF}${MM}${sq2(RR)}`)+
    EQ(`${KER}${OP("=")}${HALF}${II}${sq2(OMEGA)}`)+
    EQ(`${AL}${OP("=")}${FR(OMEGA,mi("t"))}${AND}${TAU}${OP("=")}${II}${AL}`)+
    legend([[II,"moment of inertia","kg·m²"],[MM,"mass","kg"],[RR,"radius","m"],[OMEGA,"angular velocity","rad/s"],[KER,"rotational kinetic energy","J"],[AL,"angular acceleration","rad/s²"],[mi("t"),"time to stop","s"],[TAU,"torque","N·m"]],
    `These are the spinning versions of ½${mi("m")}${sq2(mi("v"))} and ${mi("F")} = ${mi("m")}${mi("a")}. Learn ${II} = ½${MM}${sq2(RR)} for a solid cylinder by heart. A thin ring is ${MM}${sq2(RR)} and a solid sphere is ⅖${MM}${sq2(RR)}.`),
  plug:(p,c)=>EQ(`${II}${OP("=")}${HALF}${OP("×")}${p.M}${OP("×")}${sq2(p.R)}`)+
    EQ(`${KER}${OP("=")}${HALF}${OP("×")}${II}${OP("×")}${sq2(p.w)}`)+
    EQ(`${AL}${OP("=")}${FR(p.w,p.t)}${AND}${TAU}${OP("=")}${II}${OP("×")}${AL}`)+
    `<p>Square the radius first, then multiply. Use your ${II} from (a) in both (b) and (c).</p>`+calcTip(`0.5*${p.M}*${p.R}^2`),
  solution:(p,c)=>steps([
      ["Write down what you know",`${MM} = ${p.M} kg, &nbsp;${RR} = ${p.R} m, &nbsp;${OMEGA} = ${p.w} rad/s, &nbsp;${mi("t")} = ${p.t} s.`],
      ["(a) Moment of inertia of a solid cylinder",CALC(`${II} = ½${MM}${sq2(RR)} = ½ × ${p.M} × ${sq2(p.R)} = ½ × ${p.M} × ${fmt(p.R*p.R)} = <b>${fmt(c.I)} kg·m²</b>`)],
      ["(b) Rotational kinetic energy",CALC(`${KER} = ½${II}${sq2(OMEGA)} = ½ × ${fmt(c.I)} × ${sq2(p.w)} = ½ × ${fmt(c.I)} × ${fmt(p.w*p.w)} = <b>${fmt(c.K)} J</b>`)],
      ["Angular acceleration while braking",CALC(`${AL} = ${OMEGA} ÷ ${mi("t")} = ${p.w} ÷ ${p.t} = ${fmt(c.al)} rad/s²`)+`<p class="small">It loses ${fmt(c.al)} rad/s of spin every second.</p>`],
      ["(c) Torque",CALC(`${TAU} = ${II}${AL} = ${fmt(c.I)} × ${fmt(c.al)} = <b>${fmt(c.tau)} N·m</b>`)]
    ])+checkline(`Units: kg·m² × (rad/s)² = J, because radians don't count as a unit ✓<br>Energy check: while stopping, the wheel turns ½ × ${OMEGA} × ${mi("t")} = ${fmt(p.w*p.t/2)} rad. The brake's work is torque × angle = ${fmt(c.tau)} × ${fmt(p.w*p.t/2)} = ${fmt(c.tau*p.w*p.t/2)} J, which matches the ${fmt(c.K)} J of kinetic energy ✓`)+
    finalAns(`${II} = ${fmt(c.I)} kg·m², &nbsp;${KER} = ${fmt(c.K)} J, &nbsp;${TAU} = ${fmt(c.tau)} N·m`),
  sheet:[
    {name:"Solid cylinder about its axis",eq:`${II}${OP("=")}${HALF}${MM}${sq2(RR)}`,note:"Thin ring: MR². Solid sphere: ⅖MR²."},
    {name:"Rotational kinetic energy",eq:`${KER}${OP("=")}${HALF}${II}${sq2(OMEGA)}`,note:"The spinning version of ½mv²."},
    {name:"Newton's second law for rotation",eq:`${TAU}${OP("=")}${II}${AL}`,note:"The spinning version of F = ma."}
  ],
  takeEq:()=>`${KER}${OP("=")}${HALF}${II}${sq2(OMEGA)}${AND}${TAU}${OP("=")}${II}${AL}`,
  takeaway:"Spinning versions: I instead of m, ω instead of v, τ instead of F, α instead of a. Then KE = ½Iω² and τ = Iα.",
  link:"HW 2, task 3 is part (b) for two cylinders with the same mass but different radii. Because R is squared in I = ½MR², the radius makes a big difference to the energy.",
  viz:viz.slider((p,c)=>({
    note:"Same mass, same spin, different radius. Doubling the radius makes the energy four times bigger, because R is squared in I = ½MR².",
    label:"Radius",unit:"m",min:0.05,max:Math.round(p.R*2*100)/100,step:0.01,value:p.R,
    bars:[{label:"Rotational kinetic energy (full bar = double your radius)",segs:[{cls:"seg-ke",frac:x=>(x*x)/(4*p.R*p.R)}]}],
    read:x=>{const I=0.5*p.M*x*x;return `${RR} = ${fmt(x)} m: ${II} = ½ × ${p.M} × ${sq2(fmt(x))} = ${fmt(I)} kg·m², so ${KER} = ½ × ${fmt(I)} × ${sq2(p.w)} = <b>${fmt(0.5*I*p.w*p.w)} J</b>`;}
  })),
  scene:{still:1,draw(K,t,p){
  const u=mod(t,6.4),cx=250,cy=112,R=78;let th,braking=false;
  if(u<2)th=6*u;else if(u<5){const s=u-2;th=12+6*s-s*s;braking=true;}else th=21;
  K.circle(cx,cy,R,{fill:"blueSoft",c:"ink",w:2.4});K.circle(cx,cy,R-10,{c:"ink2",w:1});
  for(let i=0;i<6;i++){const a=th+i*Math.PI/3;K.line(cx,cy,cx+(R-10)*Math.cos(a),cy+(R-10)*Math.sin(a),{w:2});}
  K.circle(cx,cy,7,{fill:"ink",c:false});
  const ra=-0.6;K.line(cx,cy,cx+R*Math.cos(ra),cy+R*Math.sin(ra),{c:"heat",w:1.6,dash:[4,3]});K.tag(`R = ${p.R} m`,cx+R*Math.cos(ra)+8,cy+R*Math.sin(ra)-14,{align:"left",size:11});
  const pad=u<1.7?16:u<2?16*(2-u)/0.3:u<5?0:u<5.3?16*(u-5)/0.3:16,bx=cx+R+2+pad;   /* the brake pad slides in and out */K.rect(bx,cy-18,14,36,{fill:"ink2",c:"ink",w:1.4,r:3});K.line(bx+14,cy,bx+44,cy,{w:3});
  if(braking){for(let i=0;i<4;i++){const k=mod(u*5+i*0.25,1);K.line(cx+R+2,cy+12+i*2,cx+R+2+12*k,cy+16+18*k,{c:"heat",w:1.4,alpha:1-k});}}
  if(u<2)curvedArrow(K,cx,cy,R+16,-2.3,-1.2);
  K.tag(`${p.M} kg`,cx,cy+R+18,{size:11});K.tag(u<2?`${p.w} rad/s`:braking?`stops in ${p.t} s`:"stopped",520,40,{size:11,c:braking?"bad":"ink"});
  draw.loopFade(K,t,6.4);
}}
},

{
  id:"rot-stool", topic:"Rotation", level:"Medium", title:"Student on a stool", hw:"Course topic: conservation of angular momentum",
  base:{I1:4,w1:1.5,I2:1.6},
  random:()=>{const r=pick([[4,1.5,1.6],[3,1.5,1],[5,2.5,2],[6,1,1.5],[2.4,2.5,0.8],[4.5,3,1.8]]);return {I1:r[0],w1:r[1],I2:r[2]};},
  calc:p=>{const L=p.I1*p.w1,w2=L/p.I2,K1=0.5*p.I1*p.w1*p.w1,K2=0.5*p.I2*w2*w2;return {L,w2,K1,K2,dK:K2-K1};},
  text:(p,G,T)=>`A student sits on a stool that can ${T("free","spin freely")}, holding a weight in each outstretched hand. Together, the student, stool and weights have a ${T("moi","moment of inertia")} of ${G("I1",`${p.I1} kg·m²`)} and spin at ${G("w1",`${p.w1} rad/s`)}. She pulls the weights in to her chest, which lowers the moment of inertia to ${G("I2",`${p.I2} kg·m²`)}. (a) What is the ${T("angmom","angular momentum")} before she pulls them in? (b) How fast does she spin afterwards? (c) By how much does the rotational kinetic energy increase?`,
  terms:{
    free:["Spin freely","No friction in the stool, so nothing from outside twists her. That means her angular momentum can't change."],
    moi:["Moment of inertia","The spinning version of mass: how hard it is to change how fast something rotates. Mass far from the axis counts more. Measured in kg·m²."],
    angmom:["Angular momentum","The spinning version of momentum: moment of inertia × angular velocity. Measured in kg·m²/s."]
  },
  given:p=>[
    {k:"I1",sym:I1,name:"moment of inertia before",unit:"kg·m²",val:p.I1,why:"Arms out, weights far from the axis.",look:"It's the first moment of inertia in the question."},
    {k:"w1",sym:W1,name:"angular velocity before",unit:"rad/s",val:p.w1,why:"How fast she spins with her arms out."},
    {k:"I2",sym:I2,name:"moment of inertia after",unit:"kg·m²",val:p.I2,why:"Weights pulled in, closer to the axis, so it's smaller.",look:"It's the second moment of inertia in the question."}
  ],
  find:[
    {sym:LA,name:"angular momentum",unit:"kg·m²/s",why:"Part (a)."},
    {sym:W2,name:"angular velocity after",unit:"rad/s",why:"Part (b)."},
    {sym:DKR,name:"increase in rotational kinetic energy",unit:"J",why:"Part (c)."}
  ],
  parts:[
    {id:"L",label:"(a) Angular momentum before",sym:LA,unit:"kg·m²/s",ans:(p,c)=>c.L,traps:(p,c)=>clean([
      [c.K1,"That's the kinetic energy (½Iω²). Angular momentum is L = I × ω."],
      [p.I1*p.w1*p.w1,"Don't square ω: L = I × ω."],
      [p.I2*p.w1,"Use the moment of inertia from before she pulls the weights in."]
    ],c.L)},
    {id:"w2",label:"(b) Angular velocity afterwards",sym:W2,unit:"rad/s",ans:(p,c)=>c.w2,traps:(p,c)=>clean([
      [p.w1*p.I2/p.I1,"Upside down. A smaller moment of inertia means a faster spin: ω₂ = I₁ω₁ ÷ I₂."],
      [p.w1,"She speeds up when she pulls the weights in, because L = Iω has to stay the same."],
      [p.w1*Math.sqrt(p.I1/p.I2),"That assumes the kinetic energy stays the same. It doesn't, because her arms do work. Angular momentum is what stays the same."],
      [c.L*p.I2,"Divide by I₂, don't multiply: ω₂ = L ÷ I₂."]
    ],c.w2)},
    {id:"dK",label:"(c) Increase in rotational kinetic energy",sym:DKR,unit:"J",ans:(p,c)=>c.dK,traps:(p,c)=>clean([
      [c.K2,"That's the energy afterwards. Subtract the energy before."],
      [c.K1,"That's the energy before. Work out ½Iω² afterwards too, and subtract."],
      [0,"Kinetic energy isn't conserved here: she does work pulling the weights in. Work out ½Iω² before and after."],
      [0.5*p.I2*(c.w2-p.w1)**2,"Work out ½Iω² before and after separately, then subtract. Don't square the change in ω."]
    ],c.dK)}
  ],
  idea:(p,c)=>`<p><b>Angular momentum</b> = moment of inertia × angular velocity. When nothing outside twists a spinning object, its angular momentum <b>stays the same</b>. It's the spinning version of momentum conservation from the collision questions.</p>
    <ul class="plain">
      <li><b>(a)</b> Multiply the starting moment of inertia by the starting angular velocity.</li>
      <li><b>(b)</b> Pulling the weights in moves mass closer to the axis, so the moment of inertia goes down. To keep I × ω the same, ω has to go up. That's how ice skaters spin faster when they pull their arms in.</li>
      <li><b>(c)</b> Work out the kinetic energy ½Iω² before and after, and subtract. It goes up: the extra energy comes from her muscles pulling the weights inward.</li>
    </ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${LA}${OP("=")}${mi("I")}${OMEGA}`)+
    EQ(`${I1}${W1}${OP("=")}${I2}${W2}${IMPLIES}${W2}${OP("=")}${FR(`${I1}${W1}`,I2)}`)+
    EQ(`${DKR}${OP("=")}${HALF}${I2}${sq2(W2)}${OP("−")}${HALF}${I1}${sq2(W1)}`)+
    legend([[LA,"angular momentum","kg·m²/s"],[mi("I"),"moment of inertia","kg·m²"],[OMEGA,"angular velocity","rad/s"],[KER,"rotational kinetic energy","J"]],
    `Compare with straight-line motion: momentum p = mv is conserved in collisions, and angular momentum L = Iω is conserved when nothing outside twists the object.`),
  plug:(p,c)=>EQ(`${LA}${OP("=")}${p.I1}${OP("×")}${p.w1}`)+
    EQ(`${W2}${OP("=")}${FR(`${p.I1}${OP("×")}${p.w1}`,p.I2)}`)+
    EQ(`${DKR}${OP("=")}${HALF}${OP("×")}${p.I2}${OP("×")}${sq2(W2)}${OP("−")}${HALF}${OP("×")}${p.I1}${OP("×")}${sq2(p.w1)}`)+
    `<p>Use your ${W2} from (b) in (c). Square the angular velocities before multiplying.</p>`+calcTip(`${p.I1}*${p.w1}/${p.I2}`),
  solution:(p,c)=>steps([
      ["Write down what you know",`${I1} = ${p.I1} kg·m², &nbsp;${W1} = ${p.w1} rad/s, &nbsp;${I2} = ${p.I2} kg·m².`],
      ["(a) Angular momentum",CALC(`${LA} = ${I1}${W1} = ${p.I1} × ${p.w1} = <b>${fmt(c.L)} kg·m²/s</b>`)],
      ["(b) Angular momentum stays the same",CALC(`${W2} = ${LA} ÷ ${I2} = ${fmt(c.L)} ÷ ${p.I2} = <b>${fmt(c.w2)} rad/s</b>`)],
      ["Kinetic energy before and after",CALC(`before: ½ × ${p.I1} × ${sq2(p.w1)} = ${fmt(c.K1)} J, &nbsp; after: ½ × ${p.I2} × ${sq2(fmt(c.w2))} = ${fmt(c.K2)} J`)],
      ["(c) Subtract",CALC(`${DKR} = ${fmt(c.K2)} − ${fmt(c.K1)} = <b>${fmt(c.dK)} J</b>`)]
    ])+checkline(`Check: ${p.I2} × ${fmt(c.w2)} = ${fmt(p.I2*c.w2)} kg·m²/s, the same angular momentum as before ✓<br>Sense check: she spins faster (${fmt(c.w2)} > ${p.w1} rad/s) and her energy goes up, because her arms did work ✓`)+
    finalAns(`${LA} = ${fmt(c.L)} kg·m²/s, &nbsp;${W2} = ${fmt(c.w2)} rad/s, &nbsp;${DKR} = ${fmt(c.dK)} J`),
  sheet:[
    {name:"Angular momentum",eq:`${LA}${OP("=")}${mi("I")}${OMEGA}`,note:"The spinning version of p = mv."},
    {name:"Conservation of angular momentum",eq:`${I1}${W1}${OP("=")}${I2}${W2}`,note:"When nothing outside twists it. Kinetic energy can still change."}
  ],
  takeEq:()=>`${I1}${W1}${OP("=")}${I2}${W2}`,
  takeaway:"With no outside twist, L = Iω stays the same: a smaller moment of inertia means a faster spin. Kinetic energy is not conserved, because pulling in takes work.",
  link:"No homework on this yet, but conservation of angular momentum is on your course list. It's the spinning version of the momentum conservation you used in HW 1, task 3.",
  viz:{
    html:(p,c)=>`<p class="sec-note">Seen from above. Drag the weights in and out: the angular momentum stays at ${fmt(c.L)} kg·m²/s, so a smaller moment of inertia means a faster spin.</p>
      <div class="viz-box">
        <label class="viz-l" for="am-f">Weights: <output id="am-fo">all the way out</output></label>
        <input type="range" id="am-f" min="0" max="100" step="1" value="100">
        <svg class="vsvg" viewBox="0 0 400 220" role="img" aria-label="A spinning student seen from above">
          <circle cx="200" cy="110" r="100" class="v-faint"/>
          <g id="am-arms"></g>
          <circle cx="200" cy="110" r="22" style="fill:var(--blue-soft);stroke:var(--blue);stroke-width:2"/>
        </svg>
        <p class="viz-read" id="am-read"></p>
      </div>`,
    setup:(p,c,ctx)=>{
      const r=ctx.$("#am-f"),arms=ctx.$("#am-arms");let th=0;
      const state=()=>{const f=+r.value/100,I=p.I2+f*(p.I1-p.I2);return {f,I,w:c.L/I};};
      const draw=()=>{const s=state(),R=36+64*s.f;let g="";
        [0,Math.PI].forEach(o=>{const x=200+R*Math.cos(th+o),y=110+R*Math.sin(th+o);g+=`<line x1="200" y1="110" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" style="stroke:var(--ink-2);stroke-width:4;stroke-linecap:round"/><circle class="v-block" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10"/>`;});
        arms.innerHTML=g;};
      const upd=()=>{const s=state();ctx.$("#am-fo").textContent=s.f>0.99?"all the way out":s.f<0.01?"pulled in":`${Math.round(s.f*100)}% of the way out`;
        ctx.$("#am-read").innerHTML=`I = ${fmt(R3(s.I))} kg·m², so ω = ${fmt(c.L)} ÷ ${fmt(R3(s.I))} = <b>${fmt(s.w)} rad/s</b>, and the kinetic energy is ½Iω² = ${fmt(0.5*s.I*s.w*s.w)} J`;draw();};
      r.addEventListener("input",upd);upd();
      if(!ctx.reduceMotion)ctx.loop(dt=>{th+=state().w*dt;draw();});
    }
  },
  scene:(function(){let th=0,last=0;return {still:1,reset(){th=0;last=0;},draw(K,t,p){
  const dt=Math.max(0,Math.min(0.05,t-last));last=t;const u=mod(t,9);
  const f=u<2.8?1:u<3.8?1-(u-2.8):u<6.6?0:u<7.6?u-6.6:1,w=1.3*(1+0.8*(1-f));th+=w*dt;
  const cx=300,cy=112;K.circle(cx,cy,92,{c:"rule",w:1,dash:[3,5]});K.circle(cx,cy,34,{fill:"bg",c:"ink2",w:1.2});
  const R=30+56*f;[0,Math.PI].forEach(o=>{const a=th+o,x=cx+R*Math.cos(a),y=cy+R*Math.sin(a);K.line(cx,cy,x,y,{c:"ink",w:5});K.circle(x,y,10,{fill:"marker",c:"ink",w:1.6});});
  K.ellipse(cx,cy,16,24,{rot:th,fill:"blueSoft",c:"ink",w:1.8});K.circle(cx,cy,10,{fill:"card",c:"ink",w:1.8});
  K.tag(f>0.5?`I = ${p.I1} kg·m²`:`I = ${p.I2} kg·m²`,470,96,{size:11});if(f>0.99&&u<2.8)K.tag(`${p.w1} rad/s`,470,124,{size:11});
  K.text("seen from above",470,160,{size:11,c:"ink2"});
}};})()
},

{
  id:"rot-parallel", topic:"Rotation", level:"Medium", title:"Rod and parallel axis", hw:"Course topic: parallel axis theorem",
  base:{M:2,L:1.2,tau:2.4},
  random:()=>{const r=pick([[2,1.2,2.4],[3,1,2],[1.5,0.8,0.64],[4,0.6,1.44],[0.6,2,2],[2.4,1.5,3.6]]);return {M:r[0],L:r[1],tau:r[2]};},
  calc:p=>{const Icm=p.M*p.L*p.L/12,d=p.L/2,Iend=Icm+p.M*d*d;return {Icm,d,Iend,al:p.tau/Iend};},
  text:(p,G,T)=>`A thin, uniform ${T("rod","rod")} has a mass of ${G("M",`${p.M} kg`)} and a length of ${G("L",`${p.L} m`)}. (a) What is its moment of inertia about an axis through its centre, at 90° to the rod? (b) Use the ${T("pat","parallel axis theorem")} to find its moment of inertia about a parallel axis through one end. (c) A motor applies a ${T("torque","torque")} of ${G("tau",`${p.tau} N·m`)} to the rod about that end. What is the rod's ${T("angacc","angular acceleration")}?`,
  terms:{
    rod:["Uniform rod","A long thin stick with its mass spread evenly along its length."],
    pat:["Parallel axis theorem","A shortcut for the moment of inertia about any axis, if you already know it about a parallel axis through the centre of mass."],
    torque:["Torque","The spinning version of force: a twist. Measured in newton-metres (N·m)."],
    angacc:["Angular acceleration","How fast the angular velocity changes, in rad/s². The spinning version of acceleration."]
  },
  given:p=>[
    {k:"M",sym:MM,name:"mass",unit:"kg",val:p.M,why:"The mass of the rod."},
    {k:"L",sym:LL,name:"length",unit:"m",val:p.L,why:"End to end."},
    {k:"tau",sym:TAU,name:"torque",unit:"N·m",val:p.tau,why:"The twist from the motor in part (c). τ is the Greek letter tau."}
  ],
  find:[
    {sym:ICM,name:"moment of inertia about the centre",unit:"kg·m²",why:"Part (a). cm means centre of mass."},
    {sym:IEND,name:"moment of inertia about one end",unit:"kg·m²",why:"Part (b)."},
    {sym:AL,name:"angular acceleration",unit:"rad/s²",why:"Part (c). α is the Greek letter alpha."}
  ],
  parts:[
    {id:"Icm",label:"(a) Moment of inertia about the centre",sym:ICM,unit:"kg·m²",ans:(p,c)=>c.Icm,traps:(p,c)=>clean([
      [p.M*p.L*p.L,"ML² would mean all the mass sits a whole length L from the axis. For a rod about its centre it's (1/12)ML²."],
      [p.M*p.L*p.L/3,"(1/3)ML² is for the axis through the end. About the centre it's (1/12)ML²."],
      [p.M*p.L/12,"Square the length: (1/12) × M × L × L."],
      [p.M*p.L*p.L/2,"½ML² is a different shape (a solid cylinder uses ½MR²). A thin rod about its centre is (1/12)ML²."]
    ],c.Icm)},
    {id:"Iend",label:"(b) Moment of inertia about one end",sym:IEND,unit:"kg·m²",ans:(p,c)=>c.Iend,traps:(p,c)=>clean([
      [c.Icm+p.M*p.L*p.L,"The distance d is how far the axis moved, from the centre to the end. That's L/2, not L."],
      [c.Icm+p.M*c.d,"Square the distance: I = I_cm + M × d × d."],
      [p.M*c.d*c.d,"Add the moment of inertia about the centre too: I = I_cm + Md²."],
      [c.Icm,"Moving the axis away from the centre always makes the moment of inertia bigger. Add Md²."]
    ],c.Iend)},
    {id:"al",label:"(c) Angular acceleration about the end",sym:AL,unit:"rad/s²",ans:(p,c)=>c.al,traps:(p,c)=>clean([
      [p.tau/c.Icm,"Use the moment of inertia about the axis the rod actually turns around: the end, from (b)."],
      [p.tau*c.Iend,"Divide, don't multiply: α = τ ÷ I."],
      [c.Iend/p.tau,"Upside down: α = τ ÷ I."]
    ],c.al)}
  ],
  idea:(p,c)=>`<p>The moment of inertia depends on <b>where the axis is</b>. Mass far from the axis counts much more than mass close to it, because the distance gets squared.</p>
    <ul class="plain">
      <li><b>(a)</b> A thin rod spinning about its middle has a standard formula: you need the mass and the length squared, with a small fraction in front (next hint).</li>
      <li><b>(b)</b> Moving the axis from the middle to the end puts more of the rod far from the axis, so the moment of inertia gets bigger. The parallel axis theorem tells you by how much: add the mass × (how far you moved the axis)².</li>
      <li><b>(c)</b> Newton's second law for rotation: torque = moment of inertia × angular acceleration. Use the moment of inertia about the axis the rod actually turns around.</li>
    </ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${ICM}${OP("=")}${ONE12}${MM}${sq2(LL)}`)+
    EQ(`${mi("I")}${OP("=")}${ICM}${OP("+")}${MM}${sq2(DD)}${AND}${DD}${OP("=")}${FR(LL,"2")}`)+
    EQ(`${TAU}${OP("=")}${mi("I")}${AL}${IMPLIES}${AL}${OP("=")}${FR(TAU,mi("I"))}`)+
    legend([[ICM,"moment of inertia about the centre","kg·m²"],[MM,"mass","kg"],[LL,"length","m"],[DD,"distance between the two axes","m"],[TAU,"torque","N·m"],[AL,"angular acceleration","rad/s²"]],
    `The parallel axis theorem only works when you start from the axis through the centre of mass, and the new axis is parallel to it. A shortcut you can check with: a rod about its end is (1/3)${MM}${sq2(LL)}.`),
  plug:(p,c)=>EQ(`${ICM}${OP("=")}${ONE12}${OP("×")}${p.M}${OP("×")}${sq2(p.L)}`)+
    EQ(`${IEND}${OP("=")}${ICM}${OP("+")}${p.M}${OP("×")}${sq2(fmt(c.d))}`)+
    EQ(`${AL}${OP("=")}${FR(p.tau,IEND)}`)+
    `<p>Each answer feeds the next one.</p>`+calcTip(`${p.M}*${p.L}^2/12`),
  solution:(p,c)=>steps([
      ["Write down what you know",`${MM} = ${p.M} kg, &nbsp;${LL} = ${p.L} m, &nbsp;${TAU} = ${p.tau} N·m.`],
      ["(a) Rod about its centre",CALC(`${ICM} = (1/12) × ${p.M} × ${sq2(p.L)} = ${fmt(p.M*p.L*p.L)} ÷ 12 = <b>${fmt(c.Icm)} kg·m²</b>`)],
      ["Distance between the axes",CALC(`${DD} = ${LL} ÷ 2 = ${fmt(c.d)} m`)],
      ["(b) Parallel axis theorem",CALC(`${IEND} = ${fmt(c.Icm)} + ${p.M} × ${sq2(fmt(c.d))} = ${fmt(c.Icm)} + ${fmt(p.M*c.d*c.d)} = <b>${fmt(c.Iend)} kg·m²</b>`)],
      ["(c) Newton's second law for rotation",CALC(`${AL} = ${TAU} ÷ ${IEND} = ${p.tau} ÷ ${fmt(c.Iend)} = <b>${fmt(c.al)} rad/s²</b>`)]
    ])+checkline(`Shortcut check: (1/3)${MM}${sq2(LL)} = ${p.M} × ${sq2(p.L)} ÷ 3 = ${fmt(p.M*p.L*p.L/3)} kg·m², the same as (b) ✓<br>Sense check: ${IEND} is 4 times ${ICM}, so the same torque spins the rod 4 times more slowly about its end than about its centre.`)+
    finalAns(`${ICM} = ${fmt(c.Icm)} kg·m², &nbsp;${IEND} = ${fmt(c.Iend)} kg·m², &nbsp;${AL} = ${fmt(c.al)} rad/s²`),
  sheet:[
    {name:"Thin rod about its centre",eq:`${ICM}${OP("=")}${ONE12}${MM}${sq2(LL)}`,note:"About its end: (1/3)ML²."},
    {name:"Parallel axis theorem",eq:`${mi("I")}${OP("=")}${ICM}${OP("+")}${MM}${sq2(DD)}`,note:"d = distance from the centre-of-mass axis to the new parallel axis."}
  ],
  takeEq:()=>`${mi("I")}${OP("=")}${ICM}${OP("+")}${MM}${sq2(DD)}`,
  takeaway:"Moving the axis away from the centre of mass always adds Md² to the moment of inertia. Then τ = Iα about the axis it actually turns around.",
  link:"No homework on this yet, but the parallel axis theorem is on your course list under rotation. It extends HW 2, task 3, where the cylinders spun about their own centres.",
  viz:viz.slider((p,c)=>({
    note:"Slide the axis from the middle of the rod out to its end. The moment of inertia grows with the square of the distance.",
    label:"Axis distance from the centre",unit:"m",min:0,max:c.d,step:p.L/50,value:c.d,
    bars:[{label:"Moment of inertia (full bar = axis at the end)",segs:[{cls:"seg-alt",name:"I about the centre",frac:x=>c.Icm/c.Iend},{cls:"seg-ke",name:"extra M d²",frac:x=>p.M*x*x/c.Iend}]}],
    read:x=>`d = ${fmt(R3(x))} m: I = ${fmt(c.Icm)} + ${p.M} × ${sq2(fmt(R3(x)))} = <b>${fmt(c.Icm+p.M*x*x)} kg·m²</b>`
  })),
  scene:{still:1.2,draw(K,t,p){
  const u=mod(t,9.6),L=220,cy=112,sq=0.3,end=u>=4.4,px=end?250:300,r=end?L:L/2;
  const th=end?0.32*(u-4.4)*(u-4.4):1.5*u,P=a=>[px+r*Math.cos(a),cy+r*sq*Math.sin(a)];
  K.ellipse(px,cy,r,r*sq,{c:"rule",w:1,dash:[3,5]});
  K.line(px,cy-74,px,cy+56,{c:"heat",w:1.6,dash:[5,4]});
  const A=end?[px,cy]:P(th+Math.PI),B=P(th);K.line(A[0],A[1],B[0],B[1],{c:"blue",w:9});
  K.circle(px,cy,5,{fill:"heat",c:"card",w:2});
  if(end){K.rect(px-16,cy+56,32,24,{fill:"ink2",c:"ink",w:1.4,r:3});
    const pts=[];for(let a=0.5;a<=2.2;a+=0.05)pts.push([px+40*Math.cos(a),cy+46+12*Math.sin(a)]);K.poly(pts,{c:"heat",w:2});
    const q=pts[pts.length-1],q0=pts[pts.length-3];K.arrow(q0[0],q0[1],q[0]-3,q[1]-1,{c:"heat",head:9});
    K.tag(`τ = ${p.tau} N·m`,px+60,cy+68,{align:"left",size:11,c:"heat"});}
  K.tag(`${p.M} kg · ${p.L} m`,40,26,{align:"left",size:11});
  const fade=u<0.4?1-u/0.4:u>4&&u<4.4?(u-4)/0.4:u>=4.4&&u<4.8?1-(u-4.4)/0.4:u>9.2?(u-9.2)/0.4:0;
  if(fade>0)K.rect(0,0,600,220,{fill:"bg",c:false,alpha:fade});
}}
},

/* ===== Spinning up a wheel (rotational kinematics) ===== */
{
  id:"rot-spin-up", level:"Easy", title:"Spinning up a wheel", hw:"Course topic: rotational motion",
  base:{w0:2,al:3,t:4},
  random:()=>({w0:pick([0,1,2,4,5]),al:pick([1.5,2,2.5,3,4]),t:pick([3,4,5,6,8])}),
  calc:p=>{const w=p.w0+p.al*p.t,th=p.w0*p.t+0.5*p.al*p.t*p.t;return {w,th,N:th/(2*Math.PI)};},
  text:(p,G,T)=>`A wheel ${p.w0===0?G("w0","starts from rest"):`is spinning at ${G("w0",`ω₀ = ${p.w0} rad/s`)}`}. A motor speeds it up with a constant ${T("alpha","angular acceleration")} of ${G("al",`α = ${p.al} rad/s²`)} for ${G("t",`${p.t} s`)}. Find (a) its ${T("omega","angular velocity")} at the end, (b) the angle it turns through in that time, in radians, and (c) how many full turns that is.`,
  terms:{
    omega:["Angular velocity","ω (omega): how fast something turns, in radians per second. One full turn is 2π radians."],
    alpha:["Angular acceleration","α (alpha): how quickly the angular velocity changes, in rad/s per second (rad/s²)."]
  },
  given:p=>[
    {k:"w0",sym:W0R,name:"starting angular velocity",unit:"rad/s",val:p.w0,why:p.w0===0?"\"Starts from rest\" means it isn't turning at first.":"How fast it turns at the start.",look:p.w0===0?"It starts from rest. What angular velocity is that?":"The value in rad/s."},
    {k:"al",sym:AL,name:"angular acceleration",unit:"rad/s²",val:p.al,why:"",look:"The value in rad/s²."},
    {k:"t",sym:TIR,name:"time",unit:"s",val:p.t,why:"",look:"The time in s."}
  ],
  find:[{sym:OMEGA,name:"final angular velocity",unit:"rad/s",why:"Part (a)."},{sym:THR,name:"angle turned",unit:"rad",why:"Part (b)."},{sym:NREV,name:"number of turns",unit:"",why:"Part (c)."}],
  parts:[
    {id:"w",label:"(a) Angular velocity at the end",sym:OMEGA,unit:"rad/s",ans:(p,c)=>c.w,traps:(p,c)=>clean([[p.al*p.t,"Add the starting angular velocity: ω = ω₀ + αt."],[p.w0+p.al,"Multiply α by the time: ω = ω₀ + αt."]],c.w)},
    {id:"th",label:"(b) Angle turned (radians)",sym:THR,unit:"rad",ans:(p,c)=>c.th,traps:(p,c)=>clean([[c.w*p.t,"That uses the final ω for the whole time, but it was slower at first. Use θ = ω₀t + ½αt²."],[p.w0*p.t+p.al*p.t*p.t,"Don't forget the ½: θ = ω₀t + ½αt²."],[0.5*p.al*p.t*p.t,"Add ω₀t for the spin it already had."]],c.th)},
    {id:"N",label:"(c) Number of full turns",sym:NREV,unit:"",ans:(p,c)=>c.N,traps:(p,c)=>clean([[c.th,"That's in radians. One turn is 2π rad: divide by 2π."],[c.th/Math.PI,"One full turn is 2π radians, not π."],[c.th*2*Math.PI,"Divide by 2π, don't multiply."],[c.th/360,"Degrees aren't involved: one turn is 2π radians."]],c.N)}
  ],
  idea:()=>`<p>Turning works exactly like moving in a straight line, with new letters: distance x becomes the angle θ, velocity v becomes ω, acceleration a becomes α.</p>
    <p>So the familiar formulas carry over: v = v₀ + at becomes ω = ω₀ + αt, and x = v₀t + ½at² becomes θ = ω₀t + ½αt².</p>
    <p>One full turn is 2π radians, so the number of turns is θ ÷ 2π.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${OMEGA}${OP("=")}${W0R}${OP("+")}${AL}${TIR}${AND}${THR}${OP("=")}${W0R}${TIR}${OP("+")}${HALF}${AL}${sq2(TIR)}`)+EQ(`${NREV}${OP("=")}${FR(THR,`2${PI}`)}`)+
    legend([[OMEGA,"angular velocity","rad/s"],[AL,"angular acceleration","rad/s²"],[THR,"angle turned","rad"],[NREV,"number of turns",""]]),
  plug:p=>EQ(`${OMEGA}${OP("=")}${p.w0}${OP("+")}${p.al}${OP("×")}${p.t}${AND}${THR}${OP("=")}${p.w0}${OP("×")}${p.t}${OP("+")}${HALF}${OP("×")}${p.al}${OP("×")}${sq2(p.t)}`)+EQ(`${NREV}${OP("=")}${FR(THR,`2${PI}`)}`)+calcTip(`(${p.w0}*${p.t}+0.5*${p.al}*${p.t}^2)/(2*pi)`),
  solution:(p,c)=>steps([
      ["(a) Final angular velocity",CALC(`${OMEGA} = ${p.w0} + ${p.al} × ${p.t} = <b>${fmt(c.w)} rad/s</b>`)],
      ["(b) Angle turned",CALC(`${THR} = ${p.w0} × ${p.t} + ½ × ${p.al} × ${sq2(p.t)} = ${fmt(p.w0*p.t)} + ${fmt(0.5*p.al*p.t*p.t)} = <b>${fmt(c.th)} rad</b>`)],
      ["(c) Turns",CALC(`${NREV} = ${fmt(c.th)} ÷ 2π = <b>${fmt(c.N)} turns</b>`)]
    ])+checkline(`Average angular velocity × time: (${p.w0} + ${fmt(c.w)}) ÷ 2 × ${p.t} = ${fmt((p.w0+c.w)/2*p.t)} rad ✓`)+
    finalAns(`${OMEGA} = ${fmt(c.w)} rad/s, &nbsp;${THR} = ${fmt(c.th)} rad, &nbsp;${NREV} = ${fmt(c.N)}`),
  sheet:[{name:"Rotation with constant α",eq:`${OMEGA}${OP("=")}${W0R}${OP("+")}${AL}${TIR},${OP("")}${THR}${OP("=")}${W0R}${TIR}${OP("+")}${HALF}${AL}${sq2(TIR)}`,note:"Same as straight-line motion. One turn = 2π rad."}],
  takeEq:()=>`${THR}${OP("=")}${W0R}${TIR}${OP("+")}${HALF}${AL}${sq2(TIR)}`,
  takeaway:"Swap x, v, a for θ, ω, α and use the straight-line formulas. Divide radians by 2π to get turns.",
  link:"HW 2 uses angular velocity and acceleration the same way. Try “Flywheel and brake” on Medium next.",
  viz:viz.slider((p,c)=>({note:"Drag the time. The angular velocity grows steadily, while the angle grows faster and faster.",label:"Time",unit:"s",min:0,max:p.t,step:0.1,value:p.t,
    bars:[{label:"Angular velocity",segs:[{cls:"seg-ke",frac:x=>(p.w0+p.al*x)/c.w}]},{label:"Angle turned",segs:[{cls:"seg-alt",frac:x=>(p.w0*x+0.5*p.al*x*x)/c.th}]}],read:x=>{const th=p.w0*x+0.5*p.al*x*x;return `After ${fmt(x)} s: ${OMEGA} = <b>${fmt(R3(p.w0+p.al*x))} rad/s</b>, turned <b>${fmt(R3(th))} rad</b> = ${fmt(R3(th/(2*Math.PI)))} turns`;}})),
  scene:{still:2,draw(K,t,p){const u=mod(t,5.6),s=Math.min(u,4.4),w0=0.9+0.25*p.w0,a=0.55,ang=w0*s+0.5*a*s*s,cx=280,cy=110,R=78;
    K.circle(cx,cy,R,{fill:"blueSoft",c:"ink",w:2.4});for(let i=0;i<6;i++){const q=ang+i*Math.PI/3;K.line(cx,cy,cx+(R-8)*Math.cos(q),cy+(R-8)*Math.sin(q),{w:2});}
    K.circle(cx+(R-14)*Math.cos(ang),cy+(R-14)*Math.sin(ang),6,{fill:"heat",c:false});K.circle(cx,cy,7,{fill:"ink",c:false});
    K.tag(p.w0===0?"from rest":`ω₀ = ${p.w0} rad/s`,470,70,{size:11});K.tag(`α = ${p.al} rad/s²`,470,100,{size:11,c:"heat"});K.tag(`${p.t} s`,470,130,{size:11});
    fadeR(K,u,5,5.6);}}
},

/* ===== Block on a disk pulley (midterm 1, task 3) ===== */
{
  id:"rot-disk-block", level:"Hard", title:"Block on a disk pulley", hw:"Midterm 1, task 3",
  base:{M:2.5,rcm:20,m:1.2},
  random:()=>({M:pick([1.5,2,2.5,3,4]),rcm:pick([10,15,20,25]),m:pick([0.5,0.8,1,1.2,1.5,2])}),
  calc:p=>{const r=p.rcm/100,a=p.m*gR/(p.m+p.M/2);return {r,a,al:a/r,T:p.M*a/2};},
  text:(p,G,T)=>`A uniform disk with mass ${G("M",`M = ${p.M} kg`)} and radius ${G("r",`r = ${p.rcm} cm`)} is mounted on a fixed horizontal axle. A block with mass ${G("m",`m = ${p.m} kg`)} hangs from a light cord wrapped around the rim of the disk. The cord doesn't slip and there's no friction at the axle. The ${T("inertia","rotational inertia")} of a disk is I = ½MR². Find (a) the acceleration of the falling block, (b) the ${T("alpha","angular acceleration")} of the disk, and (c) the tension in the cord.`,
  terms:{
    inertia:["Rotational inertia","I, also called the moment of inertia: how hard something is to spin up. For a uniform disk turning about its centre, I = ½MR²."],
    alpha:["Angular acceleration","α: how quickly the disk's spin speeds up, in rad/s²."]
  },
  given:p=>[
    {k:"M",sym:MM,name:"mass of the disk",unit:"kg",val:p.M,why:"Goes into I = ½MR².",look:"The disk's mass.",gtraps:p.m!==p.M?[[p.m,"That's the block. M is the disk."]]:[]},
    {k:"r",sym:RAD,name:"radius of the disk",unit:"m",val:p.rcm/100,why:`Convert to metres: ${p.rcm} cm = ${p.rcm/100} m.`,look:"The radius is in cm. Convert to metres.",gtraps:[[p.rcm,`Convert to metres first: ${p.rcm} cm = ${p.rcm/100} m.`]]},
    {k:"m",sym:MBL,name:"mass of the block",unit:"kg",val:p.m,why:"Its weight drives everything.",look:"The block's mass.",gtraps:p.m!==p.M?[[p.M,"That's the disk. m is the block."]]:[]}
  ],
  find:[{sym:ACC,name:"acceleration of the block",unit:"m/s²",why:"Part (a)."},{sym:AL,name:"angular acceleration of the disk",unit:"rad/s²",why:"Part (b)."},{sym:TCORD,name:"tension in the cord",unit:"N",why:"Part (c)."}],
  parts:[
    {id:"a",label:"(a) Acceleration of the block",sym:ACC,unit:"m/s²",ans:(p,c)=>c.a,traps:(p,c)=>clean([[gR,"That's free fall. The block also has to spin the disk up, so it falls more slowly."],[p.m*gR/(p.m+p.M),"The disk counts with only half its mass, because I = ½MR²: a = mg ÷ (m + ½M)."],[p.m*gR/(p.M/2),"Add the block's own mass: a = mg ÷ (m + ½M)."],[p.m*gR/(p.m+2*p.M),"½M, not 2M: a = mg ÷ (m + ½M)."]],c.a)},
    {id:"al",label:"(b) Angular acceleration of the disk",sym:AL,unit:"rad/s²",ans:(p,c)=>c.al,traps:(p,c)=>clean([[c.a/p.rcm,`Change cm to m first: ${p.rcm} cm = ${c.r} m.`],[c.a*c.r,"The rim moves with the cord, so a = αr and α = a ÷ r."],[c.a/(c.r*c.r),"α = a ÷ r, not a ÷ r²."]],c.al)},
    {id:"T",label:"(c) Tension in the cord",sym:TCORD,unit:"N",ans:(p,c)=>c.T,traps:(p,c)=>clean([[p.m*gR,"That's the block's weight. The block accelerates downwards, so the cord pulls less: T = m(g − a)."],[p.M*c.a,"For the disk: T × r = Iα = ½Mr² × (a/r), so T = ½Ma."],[p.m*c.a,"The block: mg − T = ma, so T = m(g − a)."]],c.T)}
  ],
  idea:()=>`<p>Two objects are tied together by the cord. Write one equation for each, then link them.</p>
    <ul class="plain"><li><b>The block falls:</b> its weight pulls down, the cord pulls up. Newton's second law: mg − T = ma.</li>
    <li><b>The disk turns:</b> the cord pulls on its rim, giving a torque T × r. Newton's second law for rotation: torque = Iα, with I = ½Mr².</li>
    <li><b>The link:</b> the cord doesn't slip, so the rim moves exactly with the block: a = αr.</li></ul>
    <p>Put α = a ÷ r and I = ½Mr² into the disk equation: T × r = ½Mr² × a ÷ r, so T = ½Ma. Put that into the block equation and solve for a.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${MBL}${mi("g")}${OP("−")}${TCORD}${OP("=")}${MBL}${ACC}${AND}${TCORD}${RAD}${OP("=")}${II}${AL}${AND}${ACC}${OP("=")}${AL}${RAD}`)+
    EQ(`${II}${OP("=")}${HALF}${MM}${sq2(RAD)}${IMPLIES}${TCORD}${OP("=")}${HALF}${MM}${ACC}${IMPLIES}${ACC}${OP("=")}${FR(`${MBL}${mi("g")}`,`${MBL}${OP("+")}${HALF}${MM}`)}`)+
    legend([[MBL,"mass of the block","kg"],[MM,"mass of the disk","kg"],[RAD,"radius of the disk","m"],[II,"rotational inertia of the disk","kg·m²"],[AL,"angular acceleration of the disk","rad/s²"]],"The disk acts like an extra mass of ½M that has to be accelerated, which is why a is less than g."),
  plug:p=>EQ(`${ACC}${OP("=")}${FR(`${p.m}${OP("×")}9.8`,`${p.m}${OP("+")}${HALF}${OP("×")}${p.M}`)}`)+EQ(`${AL}${OP("=")}${FR(ACC,`${p.rcm/100}`)}${AND}${TCORD}${OP("=")}${HALF}${OP("×")}${p.M}${OP("×")}${ACC}`)+calcTip(`${p.m}*9.8/(${p.m}+${p.M}/2)`),
  solution:(p,c)=>steps([
      ["Disk: torque = Iα",CALC(`${TCORD} × ${RAD} = ½${MM}${sq2(RAD)} × (${ACC} ÷ ${RAD}) &nbsp;→&nbsp; ${TCORD} = ½${MM}${ACC} = ${fmt(p.M/2)}${ACC}`)],
      ["(a) Block: mg − T = ma",CALC(`${p.m} × 9.8 − ${fmt(p.M/2)}${ACC} = ${p.m}${ACC} &nbsp;→&nbsp; ${ACC} = ${fmt(p.m*gR)} ÷ (${p.m} + ${fmt(p.M/2)}) = <b>${fmt(c.a)} m/s²</b>`)],
      ["(b) No slipping: a = αr",CALC(`${AL} = ${fmt(c.a)} ÷ ${c.r} = <b>${fmt(c.al)} rad/s²</b>`)],
      ["(c) Tension",CALC(`${TCORD} = ½ × ${p.M} × ${fmt(c.a)} = <b>${fmt(c.T)} N</b>`)]
    ])+checkline(`From the block instead: T = m(g − a) = ${p.m} × (9.8 − ${fmt(c.a)}) = ${fmt(p.m*(gR-c.a))} N ✓`)+
    finalAns(`${ACC} = ${fmt(c.a)} m/s², &nbsp;${AL} = ${fmt(c.al)} rad/s², &nbsp;${TCORD} = ${fmt(c.T)} N`),
  sheet:[{name:"Rotation version of F = ma",eq:`${TAU}${OP("=")}${II}${AL},${OP("")}${TAU}${OP("=")}${TCORD}${RAD}`,note:"Torque from a cord on a rim: T × r."},{name:"Cord on a disk, no slipping",eq:`${ACC}${OP("=")}${AL}${RAD},${OP("")}${ACC}${OP("=")}${FR(`${MBL}${mi("g")}`,`${MBL}${OP("+")}${HALF}${MM}`)}`,note:"For a uniform disk I = ½MR²."}],
  takeEq:()=>`${ACC}${OP("=")}${FR(`${MBL}${mi("g")}`,`${MBL}${OP("+")}${HALF}${MM}`)}`,
  takeaway:"One equation for the falling block (mg − T = ma), one for the turning disk (Tr = Iα), linked by a = αr. The disk adds ½M to the mass being accelerated.",
  link:"This is task 3 of your midterm 1, which had M = 2.5 kg, r = 20 cm and m = 1.2 kg. The first numbers on this page are exactly those: a = 4.8 m/s², α = 24 rad/s², T = 6 N.",
  viz:viz.slider((p,c)=>({note:"Drag the disk's mass. With a weightless disk the block falls freely; a heavier disk holds it back more.",label:"Disk mass",unit:"kg",min:0,max:4*p.M,step:0.1,value:p.M,
    bars:[{label:"Acceleration (full bar = free fall)",segs:[{cls:"seg-ke",frac:x=>p.m/(p.m+x/2)}]},{label:"Tension (full bar = the block's weight)",segs:[{cls:"seg-alt",frac:x=>(x/2)/(p.m+x/2)}]}],
    read:x=>{const a=p.m*gR/(p.m+x/2);return `${ACC} = <b>${fmt(R3(a))} m/s²</b>, &nbsp;${AL} = <b>${fmt(R3(a/c.r))} rad/s²</b>, &nbsp;${TCORD} = <b>${fmt(R3(x*a/2))} N</b>`;}})),
  scene:{still:1.6,draw(K,t,p){const u=mod(t,4.4),s=u<3.2?110*(u/3.2)*(u/3.2):110,cx=250,cy=62,R=24+p.rcm*1.2;
    K.line(cx-40,cy-46,cx+40,cy-46,{w:3});K.line(cx-30,cy-46,cx,cy,{c:"ink2",w:2});K.line(cx+30,cy-46,cx,cy,{c:"ink2",w:2});
    K.circle(cx,cy,R,{fill:"blueSoft",c:"ink",w:2.4});const ang=s/R;for(let i=0;i<3;i++){const q=ang+i*2*Math.PI/3;K.line(cx,cy,cx+(R-6)*Math.cos(q),cy+(R-6)*Math.sin(q),{c:"ink2",w:1.6});}
    K.circle(cx+(R-10)*Math.cos(ang),cy+(R-10)*Math.sin(ang),4,{fill:"heat",c:false});K.circle(cx,cy,4,{fill:"ink",c:false});
    const by=cy+28+s*0.95;K.line(cx+R,cy,cx+R,by,{w:1.8});K.rect(cx+R-22,by,44,32,{fill:"marker",c:"ink",w:1.6,r:3});K.text(`${p.m} kg`,cx+R,by+16,{size:11,bold:true,c:"#14244a"});
    K.tag(`M = ${p.M} kg`,cx-R-56,cy,{size:11});K.line(cx,cy,cx-R*Math.cos(0.6),cy+R*Math.sin(0.6),{c:"heat",w:1.4,dash:[3,3]});K.tag(`r = ${p.rcm} cm`,cx-R-56,cy+30,{size:11,c:"heat"});
    fadeR(K,u,3.8,4.4);}}
},

/* ===== Rolling down a ramp ===== */
{
  id:"rot-rolling", level:"Hard", title:"Rolling down a ramp", hw:"Course topic: rolling and energy",
  base:{shape:"cyl",h:1.2,m:2},
  random:()=>({shape:pick(["cyl","ball","hoop"]),h:pick([0.5,0.8,1,1.2,1.5,2]),m:pick([0.5,1,2,3])}),
  calc:p=>{const c=SHAPES[p.shape].c,vs=Math.sqrt(2*gR*p.h);return {c,vs,vr:Math.sqrt(2*gR*p.h/(1+c)),pct:100*c/(1+c)};},
  text:(p,G,T)=>{const S=SHAPES[p.shape];return `A ${G("m",`${p.m} kg`)} ${S.name} is let go from rest at the top of a ramp ${G("h",`${p.h} m`)} high and ${T("roll","rolls without slipping")} to the bottom. For a ${S.name}, I = ${G("c",S.ifrac)}mr². (a) How fast would it be going at the bottom if it slid down a frictionless ramp without turning? (b) How fast is it going at the bottom when it rolls? (c) What percentage of its kinetic energy at the bottom is rotational?`;},
  terms:{roll:["Rolling without slipping","The object turns exactly as fast as it moves along: the point touching the ramp is momentarily still. Then ω = v ÷ r."]},
  given:p=>{const S=SHAPES[p.shape];return [
    {k:"m",sym:MBL,name:"mass",unit:"kg",val:p.m,why:"It will cancel out.",look:"The number measured in kg."},
    {k:"h",sym:HR,name:"height of the ramp",unit:"m",val:p.h,why:"How far it drops.",look:"The height in m."},
    {k:"c",sym:CR,name:`the number in front of mr² in I`,unit:"",val:S.c,why:`I = c × mr². For a ${S.name}, c = ${S.ifrac} = ${S.c}.`,look:`The fraction in I = ${S.ifrac}mr².`}];},
  find:[{sym:VSL,name:"speed if it slid",unit:"m/s",why:"Part (a)."},{sym:VRL,name:"speed when rolling",unit:"m/s",why:"Part (b)."},{sym:mi("P"),name:"rotational share of the kinetic energy",unit:"%",why:"Part (c)."}],
  parts:[
    {id:"vs",label:"(a) Speed if it slid without turning",sym:VSL,unit:"m/s",ans:(p,c)=>c.vs,traps:(p,c)=>clean([[2*gR*p.h,"That's v². Take the square root."],[Math.sqrt(gR*p.h),"mgh = ½mv², so v = √(2gh): don't forget the 2."]],c.vs)},
    {id:"vr",label:"(b) Speed at the bottom when rolling",sym:VRL,unit:"m/s",ans:(p,c)=>c.vr,traps:(p,c)=>clean([[c.vs,"That's the sliding speed. A rolling object also has to spend energy on spinning, so it's slower: v = √(2gh ÷ (1 + c))."],[Math.sqrt(2*gR*p.h*(1-c.c)),"Divide by (1 + c), don't multiply by (1 − c)."],[Math.sqrt(2*gR*p.h/c.c),"Divide by (1 + c): the 1 is the moving energy, the c is the spinning energy."],[2*gR*p.h/(1+c.c),"That's v². Take the square root."]],c.vr)},
    {id:"pct",label:"(c) Rotational share of the kinetic energy",sym:mi("P"),unit:"%",ans:(p,c)=>c.pct,traps:(p,c)=>clean([[100*c.c,"The rotational part is c out of a total of (1 + c), so the share is c ÷ (1 + c)."],[100/(1+c.c),"That's the moving (translational) share. The rotational share is c ÷ (1 + c)."],[c.c/(1+c.c),"Give it as a percentage: multiply by 100."]],c.pct)}
  ],
  idea:()=>`<p>Use <b>energy conservation</b>: the potential energy at the top, mgh, becomes kinetic energy at the bottom.</p>
    <ul class="plain"><li>Sliding without turning: all of it becomes moving energy ½mv².</li><li>Rolling: it splits into moving energy ½mv² <b>and</b> spinning energy ½Iω². Less is left for moving, so it's slower.</li></ul>
    <p>Rolling without slipping links the two: ω = v ÷ r. With I = c × mr², the spinning energy is ½(cmr²)(v ÷ r)² = ½cmv². So mgh = ½mv²(1 + c). The mass and radius cancel.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${MBL}${mi("g")}${HR}${OP("=")}${HALF}${MBL}${sq2(VR)}${OP("+")}${HALF}${II}${sq2(OMEGA)}${AND}${OMEGA}${OP("=")}${FR(VR,RAD)}${AND}${II}${OP("=")}${CR}${MBL}${sq2(RAD)}`)+
    EQ(`${VSL}${OP("=")}${SQ(`2${mi("g")}${HR}`)}${AND}${VRL}${OP("=")}${SQ(FR(`2${mi("g")}${HR}`,`1${OP("+")}${CR}`),true)}${AND}share${OP("=")}${FR(CR,`1${OP("+")}${CR}`)}`)+
    legend([[CR,"the number in I = c·mr² (½ for a solid cylinder, ⅖ for a solid ball, 1 for a hoop)",""],[OMEGA,"spin speed","rad/s"]]),
  plug:(p,c)=>EQ(`${VSL}${OP("=")}${SQ(`2${OP("×")}9.8${OP("×")}${p.h}`)}${AND}${VRL}${OP("=")}${SQ(FR(`2${OP("×")}9.8${OP("×")}${p.h}`,`1${OP("+")}${c.c}`),true)}`)+EQ(`share${OP("=")}${FR(c.c,`1${OP("+")}${c.c}`)}`),
  solution:(p,c)=>steps([
      ["(a) Sliding: all into moving energy",CALC(`${VSL} = √(2 × 9.8 × ${p.h}) = <b>${fmt(c.vs)} m/s</b>`)],
      ["(b) Rolling: energy splits",CALC(`${p.m} × 9.8 × ${p.h} = ½ × ${p.m} × ${sq2(VR)} × (1 + ${c.c}) &nbsp;→&nbsp; ${VRL} = √(${fmt(2*gR*p.h)} ÷ ${fmt(1+c.c)}) = <b>${fmt(c.vr)} m/s</b>`)],
      ["(c) Rotational share",CALC(`${c.c} ÷ (1 + ${c.c}) = ${fmt(c.c/(1+c.c))} = <b>${fmt(c.pct)} %</b>`)]
    ])+checkline(`Energies at the bottom: moving ½ × ${p.m} × ${sq2(fmt(c.vr))} = ${fmt(0.5*p.m*c.vr*c.vr)} J plus spinning ${fmt(0.5*c.c*p.m*c.vr*c.vr)} J = ${fmt(0.5*(1+c.c)*p.m*c.vr*c.vr)} J, the same as mgh = ${fmt(p.m*gR*p.h)} J ✓`)+
    finalAns(`${VSL} = ${fmt(c.vs)} m/s, &nbsp;${VRL} = ${fmt(c.vr)} m/s, &nbsp;share = ${fmt(c.pct)} %`),
  sheet:[{name:"Rolling without slipping",eq:`${MBL}${mi("g")}${HR}${OP("=")}${HALF}${MBL}${sq2(VR)}(1${OP("+")}${CR})`,note:"I = c·mr², ω = v/r. Solid cylinder c = ½, solid ball ⅖, hoop 1."}],
  takeEq:()=>`${VRL}${OP("=")}${SQ(FR(`2${mi("g")}${HR}`,`1${OP("+")}${CR}`),true)}`,
  takeaway:"Rolling splits the energy between moving and spinning, mgh = ½mv²(1 + c), so it reaches the bottom slower than a sliding object.",
  link:"The same energy idea as “Skateboard in a bowl” (Easy), with spinning energy ½Iω² added.",
  viz:viz.slider((p,c)=>({note:"Drag c, the number in I = c·mr². Objects with more of their mass near the rim (bigger c) spend more energy spinning and roll down more slowly.",label:"c in I = c·mr²",unit:"",min:0,max:1,step:0.05,value:c.c,
    bars:[{label:"Speed at the bottom (full bar = sliding)",segs:[{cls:"seg-ke",frac:x=>1/Math.sqrt(1+x)}]}],read:x=>`${VRL} = <b>${fmt(R3(Math.sqrt(2*gR*p.h/(1+x))))} m/s</b>${Math.abs(x-0.4)<0.01?" (solid ball)":Math.abs(x-0.5)<0.01?" (solid cylinder)":Math.abs(x-1)<0.01?" (hoop)":""}`})),
  scene:{still:2,draw(K,t,p){const u=mod(t,4.6),x0=60,top=40,bot=196,x1=470,ang=Math.atan2(bot-top,x1-x0),L=Math.hypot(x1-x0,bot-top),r=20;
    K.poly([[x0,top],[x0,bot],[x1,bot]],{fill:"bg",c:"ink",w:2,close:true});K.line(x0-20,bot,560,bot,{w:2});K.vdim(36,top,bot,`${p.h} m`);
    const s=u<3?L*0.08+L*0.86*(u/3)*(u/3):L*0.94,cx=x0+s*Math.cos(ang)+r*Math.sin(ang),cy=top+s*Math.sin(ang)-r*Math.cos(ang),rot=s/r;
    K.circle(cx,cy,r,{fill:p.shape==="hoop"?"card":"blueSoft",c:"ink",w:p.shape==="hoop"?4:2});K.line(cx,cy,cx+(r-3)*Math.cos(rot),cy+(r-3)*Math.sin(rot),{c:"heat",w:2});
    K.tag(SHAPES[p.shape].name,470,60,{size:11});fadeR(K,u,4,4.6);}}
}
]);
})();
