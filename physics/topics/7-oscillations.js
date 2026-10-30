/* Oscillations: springs, pendulums, energy in SHM, damping and resonance.
   Every question on this topic is one object in the list below: its numbers, text, hints,
   answer checks, "See it" panel and animation. See ADDING-QUESTIONS.md for how to add one. */
(function(){
"use strict";
const {fmt,pick,mi,up,sb,ssp,OP,FR,SQ,EQ,CALC,HALF,sq2,neg,IMPLIES,AND,PAREN,PI,OMEGA,V0,VI,VF,KE,KEI,KEF,DKE,legend,steps,checkline,finalAns,watch,calcTip,viz}=HL;
const {R3,clean,pr,sumTxt,draw}=PHYS;
const {F,mod,fadeIn,cyclist,speedLines,springScene,block,curvedArrow}=draw;

/* symbols and helpers used below */
const LL=mi("L");
const G9=mi("g");
const TT=mi("T");
const TP=`${mi("T")}′`;
const T2=sb(mi("T"),"2");
const L2=sb(mi("L"),"2");
const EE=mi("E");
const AA=mi("A");
const XX=mi("x");
const BETA=mi("β");
const A0=sb(mi("A"),"0");
const W0=sb(OMEGA,"0");
const LAM=mi("λ");
const F0=sb(mi("F"),"0");
const DE=up("Δ")+mi("E");
const EXP=x=>`${mi("e")}<sup>${x}</sup>`;
const FRES=sb(mi("f"),"res");
const ARES=sb(mi("A"),"res");
const AHALF=sb(mi("A"),"½");
const dampViz=o=>({
  html:(p,c)=>{const q=o(p,c);return `<p class="sec-note">${q.note}</p>
    <div class="viz-box">
      <label class="viz-l" for="dz-s">Damping coefficient β: <output id="dz-so">${fmt(q.value)}</output> s⁻¹</label>
      <input type="range" id="dz-s" min="0" max="${q.max}" step="${q.step}" value="${q.value}">
      <svg class="vsvg" viewBox="0 0 400 180" role="img" aria-label="Graph of a damped oscillation">
        <line x1="20" y1="90" x2="390" y2="90" style="stroke:var(--rule);stroke-width:1"/>
        <line x1="20" y1="12" x2="20" y2="168" style="stroke:var(--rule);stroke-width:1"/>
        <path id="dz-e1" class="v-faint"/><path id="dz-e2" class="v-faint"/>
        <path id="dz-c" class="v-main" style="stroke-width:2"/>
        <text class="v-text" x="390" y="178" text-anchor="end">time →</text>
      </svg>
      <p class="viz-read" id="dz-read"></p>
    </div>`;},
  setup:(p,c,ctx)=>{const q=o(p,c),r=ctx.$("#dz-s"),X=t=>20+370*t/q.tMax,Y=y=>90-74*y;
    const path=f=>{let d="";for(let i=0;i<=360;i++){const t=q.tMax*i/360;d+=(i?" L":"M")+X(t).toFixed(1)+","+Y(f(t)).toFixed(1);}return d;};
    const upd=()=>{const b=+r.value;ctx.$("#dz-so").textContent=fmt(R3(b));
      ctx.$("#dz-c").setAttribute("d",path(t=>q.curve(b,t)));ctx.$("#dz-e1").setAttribute("d",path(t=>Math.exp(-b*t)));ctx.$("#dz-e2").setAttribute("d",path(t=>-Math.exp(-b*t)));
      ctx.$("#dz-read").innerHTML=q.read(b);};
    r.addEventListener("input",upd);upd();}
});

/* for SHM from energy */
const KO=mi("k"),MO=mi("m"),VMX=sb(mi("v"),"max"),FO=mi("f");

PHYS.add("Oscillations",[
{
  id:"osc-spring-period", topic:"Oscillations", level:"Easy", title:"Spring period", hw:"Like HW 3",
  base:{m:0.5,k:200},
  random:()=>{const pr=pick([[0.5,200],[1,16],[2,50],[0.8,80],[0.2,20],[0.4,10],[4,100]]);return {m:pr[0],k:pr[1]};},
  calc:p=>{const r=p.m/p.k,s=Math.sqrt(r),T=2*Math.PI*s;return {r,s,T,f:1/T,w:Math.sqrt(p.k/p.m)};},
  text:(p,G,T)=>`A ${G("m",`${p.m} kg`)} block is attached to a spring with a ${T("k","spring constant")} of ${G("k",`${p.k} N/m`)}. The block bounces back and forth in ${T("shm","simple harmonic motion")}. Find (a) the ${T("per","period")} and (b) the ${T("freq","frequency")} of the motion.`,
  terms:{
    k:["Spring constant","How stiff the spring is. The unit N/m means newtons of force for every metre of stretch. A bigger number means a stiffer spring."],
    shm:["Simple harmonic motion","A smooth back-and-forth motion that repeats the same way every time, like a block bouncing on a spring or a swinging pendulum."],
    per:["Period","The time for one complete back-and-forth (there and back again). Measured in seconds (s)."],
    freq:["Frequency","How many complete back-and-forths happen in one second. Measured in hertz (Hz). 1 Hz means once per second."]
  },
  given:p=>[
    {k:"m",sym:mi("m"),name:"mass",unit:"kg",val:p.m,why:"The mass of the block. A heavier block moves more slowly."},
    {k:"k",sym:mi("k"),name:"spring constant",unit:"N/m",val:p.k,why:"How stiff the spring is. A stiffer spring pulls harder."}
  ],
  find:[
    {sym:mi("T"),name:"period",unit:"s",why:"The time for one full back-and-forth. Part (a)."},
    {sym:mi("f"),name:"frequency",unit:"Hz",why:"How many full back-and-forths happen each second. Part (b)."}
  ],
  parts:[
    {id:"T",label:"(a) Period",sym:mi("T"),unit:"s",ans:(p,c)=>c.T,
      traps:(p,c)=>[
        [c.s,`That's √(m ÷ k). You still need to multiply it by 2π.`],
        [2*Math.PI*Math.sqrt(p.k/p.m),`You have m and k swapped. The mass goes on top: √(m ÷ k). A heavier block should give a longer period.`],
        [2*Math.PI*c.r,`You forgot the square root. Take √ of (m ÷ k) before multiplying by 2π.`],
        [c.w,`That's ω (omega), the angular frequency in rad/s. The period is T = 2π ÷ ω.`],
        [c.f,`That's the frequency. Part (a) asks for the period T.`],
        [Math.PI*c.s,`Use 2π, not just π.`]
      ]},
    {id:"f",label:"(b) Frequency",sym:mi("f"),unit:"Hz",ans:(p,c)=>c.f,
      traps:(p,c)=>[
        [c.T,`That's the period. The frequency is 1 divided by the period: f = 1 ÷ T.`],
        [c.w,`That's ω in rad/s. The frequency is f = 1 ÷ T (or ω ÷ 2π).`]
      ]}
  ],
  idea:(p,c)=>`<p>Think about what makes the block bounce faster or slower:</p>
    <ul class="plain"><li><b>Heavier block</b> → harder to get moving → slower → <b>longer</b> period.</li><li><b>Stiffer spring</b> (bigger ${mi("k")}) → pulls harder → faster → <b>shorter</b> period.</li></ul>
    <p>So the period depends on <b>mass divided by stiffness</b>, with ${mi("m")} on top and ${mi("k")} on the bottom. The formula also has a square root and a 2π in it (you'll see it in the next hint).</p>
    <p>For the frequency: if one bounce takes ${mi("T")} seconds, the number of bounces in one second is 1 ÷ ${mi("T")}.</p>
    <p class="small">Try the question again, or open the next hint for the formulas.</p>`,
  formula:()=>EQ(`${mi("T")}${OP("=")}2${PI}${SQ(FR(mi("m"),mi("k")),true)}`)+EQ(`${mi("f")}${OP("=")}${FR("1",mi("T"))}`)+
    legend([[mi("T"),"period: time for one full back-and-forth","s"],[mi("f"),"frequency: back-and-forths per second","Hz"],[mi("m"),"mass","kg"],[mi("k"),"spring constant","N/m"],[PI,"pi ≈ 3.1416",""]],
    `√ means square root: √0.25 = 0.5, because 0.5 × 0.5 = 0.25. In HW 3 you will also see ${OMEGA} = √(${mi("k")}/${mi("m")}) and ${mi("T")} = 2π/${OMEGA}. That's the same formula written in two steps.`),
  plug:(p,c)=>EQ(`${mi("T")}${OP("=")}2${PI}${SQ(FR(p.m,p.k),true)}`)+EQ(`${mi("f")}${OP("=")}${FR("1",mi("T"))}`)+
    `<p>Work from the inside out:</p><ol class="plain"><li>Divide ${p.m} ÷ ${p.k}.</li><li>Take the square root of that.</li><li>Multiply by 2π (π ≈ 3.1416).</li></ol><p>Then for ${mi("f")}, divide 1 by your ${mi("T")}.</p>`+
    calcTip(`2*pi*sqrt(${p.m}/${p.k})`,` For the frequency: <code>1/(2*pi*sqrt(${p.m}/${p.k}))</code>.`),
  solution:(p,c)=>steps([
      ["Write down what you know",`${mi("m")} = ${p.m} kg, &nbsp;${mi("k")} = ${p.k} N/m. &nbsp;Find ${mi("T")} and ${mi("f")}.`],
      ["Pick the formula",EQ(`${mi("T")}${OP("=")}2${PI}${SQ(FR(mi("m"),mi("k")),true)}`)],
      ["Inside the square root first",CALC(`${mi("m")} ÷ ${mi("k")} = ${p.m} ÷ ${p.k} = ${fmt(c.r)}`)],
      ["Take the square root",CALC(`√${fmt(c.r)} = ${fmt(c.s)}`)+`<p class="small">Check: ${fmt(c.s)} × ${fmt(c.s)} = ${fmt(c.r)} ✓</p>`],
      ["Multiply by 2π",CALC(`${mi("T")} = 2 × 3.1416 × ${fmt(c.s)} = <b>${fmt(c.T)} s</b>`)],
      ["Frequency is 1 divided by the period",CALC(`${mi("f")} = 1 ÷ ${fmt(c.T)} = <b>${fmt(c.f)} Hz</b>`)]
    ])+checkline(`Another way, the way HW 3 does it: ${OMEGA} = √(${mi("k")} ÷ ${mi("m")}) = √(${p.k} ÷ ${p.m}) = √${fmt(p.k/p.m)} = ${fmt(c.w)} rad/s, and then ${mi("T")} = 2π ÷ ${OMEGA} = 2π ÷ ${fmt(c.w)} = ${fmt(c.T)} s ✓`)+
    finalAns(`${mi("T")} = ${fmt(c.T)} s, &nbsp; ${mi("f")} = ${fmt(c.f)} Hz`)+
    `<p>Meaning: the block makes about ${fmt(c.f)} full back-and-forths every second.</p>`,
  sheet:[
    {name:"Period of a block on a spring",eq:`${mi("T")}${OP("=")}2${PI}${SQ(FR(mi("m"),mi("k")),true)}`,note:"Heavier block: slower. Stiffer spring: faster."},
    {name:"Frequency",eq:`${mi("f")}${OP("=")}${FR("1",mi("T"))}`,note:"In hertz (Hz), meaning per second."},
    {name:"Angular frequency",eq:`${OMEGA}${OP("=")}${SQ(FR(mi("k"),mi("m")),true)}${OP("=")}${FR("2"+PI,mi("T"))}`,note:"In rad/s. Used in HW 3."}
  ],
  takeEq:()=>`${mi("T")}${OP("=")}2${PI}${SQ(FR(mi("m"),mi("k")),true)}<span class="op" style="margin:0 .8em">,</span>${mi("f")}${OP("=")}${FR("1",mi("T"))}`,
  takeaway:"Mass on top, spring constant on the bottom, square root, times 2π. Frequency is one over the period.",
  link:"HW 3, task 1: going from one point of zero speed to the next is only half a back-and-forth, so it is half a period. HW 3, task 2 runs this backwards: find ω first, then the mass from m = k ÷ ω².",
  spring:(p,c)=>({T:c.T,label:`${p.m} kg`,note:`Here is your block on its spring. One full back-and-forth takes ${fmt(c.T)} s, so it makes about ${fmt(c.f)} of them every second.`}),
  visual:"spring",
  scene:{still:0.3,draw(K,t,p){
  springScene(K,t,{mass:`${p.m} kg`});K.tag(`k = ${p.k} N/m`,150,96,{size:11});
}}
},

{
  id:"osc-pendulum", topic:"Oscillations", level:"Easy", title:"Pendulum", hw:"Course topic: mathematical pendulum",
  base:{m:0.5,L:0.8,T2:2},
  random:()=>({m:pick([0.2,0.5,1,2]),L:pick([0.25,0.5,0.8,1.2,1.5,2]),T2:pick([1.5,2,2.5,3])}),
  calc:p=>{const g=9.8,T=2*Math.PI*Math.sqrt(p.L/g);return {g,T,L2:g*p.T2*p.T2/(4*Math.PI*Math.PI)};},
  text:(p,G,T)=>`A pendulum is a ${G("m",`${p.m} kg`)} ball (the ${T("bob","bob")}) on a light string ${G("L",`${p.L} m`)} long. It swings back and forth through ${T("small","small angles")}. Use g = ${G("g","9.8 m/s²")}. (a) What is its ${T("per","period")}? (b) If the ball were swapped for one with double the mass, what would the period be? (c) How long would the string need to be for a period of exactly ${G("T2",`${p.T2} s`)}?`,
  terms:{
    bob:["Bob","The weight hanging on the end of a pendulum."],
    small:["Small angles","Swinging less than about 10–15° to each side. The simple pendulum formula is only accurate then."],
    per:["Period","The time for one complete swing: out, back, out the other side and back again. Measured in seconds."]
  },
  given:p=>[
    {k:"m",sym:mi("m"),name:"mass of the ball",unit:"kg",val:p.m,why:"Write it down, but keep an eye on whether you actually need it!"},
    {k:"L",sym:LL,name:"length of the string",unit:"m",val:p.L,why:"From the pivot to the ball."},
    {k:"g",sym:G9,name:"gravity",unit:"m/s²",val:9.8,why:"Given in the question."},
    {k:"T2",sym:T2,name:"wanted period",unit:"s",val:p.T2,why:"The period that part (c) wants.",look:"It's the period in part (c)."}
  ],
  find:[
    {sym:TT,name:"period",unit:"s",why:"Part (a)."},
    {sym:TP,name:"period with double the mass",unit:"s",why:"Part (b)."},
    {sym:L2,name:"string length for the wanted period",unit:"m",why:"Part (c)."}
  ],
  parts:[
    {id:"T",label:"(a) Period",sym:TT,unit:"s",ans:(p,c)=>c.T,traps:(p,c)=>clean([
      [2*Math.PI*Math.sqrt(c.g/p.L),"Upside down. The length goes on top: T = 2π√(L ÷ g). A longer string should give a longer period."],
      [Math.sqrt(p.L/c.g),"You still need to multiply by 2π."],
      [2*Math.PI*p.L/c.g,"You forgot the square root: T = 2π√(L ÷ g)."],
      [2*Math.PI*Math.sqrt(p.m/p.L),"That mixes in the spring formula. A pendulum uses the length and gravity: T = 2π√(L ÷ g)."],
      [Math.PI*Math.sqrt(p.L/c.g),"Use 2π, not just π."]
    ],c.T)},
    {id:"Tp",label:"(b) Period with double the mass",sym:TP,unit:"s",ans:(p,c)=>c.T,traps:(p,c)=>clean([
      [c.T*Math.SQRT2,"Mass isn't in the pendulum formula at all, so the period doesn't change. (√2 would be right for a spring, not a pendulum.)"],
      [2*c.T,"Mass isn't in the pendulum formula, so the period stays the same."],
      [c.T/Math.SQRT2,"Mass isn't in the pendulum formula, so the period stays the same."],
      [c.T/2,"Mass isn't in the pendulum formula, so the period stays the same."]
    ],c.T)},
    {id:"L2",label:"(c) String length for the wanted period",sym:L2,unit:"m",ans:(p,c)=>c.L2,traps:(p,c)=>clean([
      [c.g*p.T2*p.T2/(2*Math.PI),"Square the 2π too: L = g T² ÷ (2π)² = g T² ÷ (4π²)."],
      [c.g*p.T2/(4*Math.PI*Math.PI),"Square the period too: L = g T² ÷ (4π²)."],
      [p.T2*p.T2/(4*Math.PI*Math.PI*c.g),"Upside down with g. L = g T² ÷ (4π²): g goes on top."],
      [c.g*p.T2/(2*Math.PI),"Square both sides of T ÷ 2π = √(L ÷ g) before solving: L = g T² ÷ (4π²)."]
    ],c.L2)}
  ],
  idea:(p,c)=>`<p>A pendulum swings like a block on a spring, but gravity does the pulling instead of a spring.</p>
    <ul class="plain">
      <li><b>Longer string</b> → the ball travels a bigger arc → <b>longer</b> period.</li>
      <li><b>Stronger gravity</b> → pulls back harder → <b>shorter</b> period.</li>
      <li><b>Mass:</b> a heavier ball is pulled harder by gravity, but it's also harder to get moving. The two effects cancel exactly, so <b>mass doesn't change the period</b>. That's part (b).</li>
    </ul>
    <p><b>(c)</b> is part (a) run backwards: you know the period you want and need the length. Rearrange the formula step by step.</p>
    <p class="small">Try it now. The next hint gives you the formula and how to rearrange it.</p>`,
  formula:()=>EQ(`${TT}${OP("=")}2${PI}${SQ(FR(LL,G9),true)}`)+
    EQ(`${FR(TT,`2${PI}`)}${OP("=")}${SQ(FR(LL,G9),true)}${IMPLIES}${FR(sq2(TT),`4${sq2(PI)}`)}${OP("=")}${FR(LL,G9)}${IMPLIES}${LL}${OP("=")}${FR(`${G9}${sq2(TT)}`,`4${sq2(PI)}`)}`)+
    legend([[TT,"period","s"],[LL,"length of the string","m"],[G9,"gravity","m/s²"],[PI,"pi ≈ 3.1416",""]],
    `Rearranging, step by step: divide both sides by 2π, square both sides to remove the root (2π squared is 4π²), then multiply both sides by ${G9}. Notice there's no mass anywhere in these formulas.`),
  plug:(p,c)=>EQ(`${TT}${OP("=")}2${PI}${SQ(FR(p.L,"9.8"),true)}`)+
    EQ(`${TP}${OP("=")}${TT}${OP("")}<span class="op" style="font-size:.7em">(mass isn't in the formula)</span>`)+
    EQ(`${L2}${OP("=")}${FR(`9.8${OP("×")}${sq2(p.T2)}`,`4${sq2(PI)}`)}`)+
    `<p>4π² ≈ 39.48. Work out the top first, then divide.</p>`+
    calcTip(`2*pi*sqrt(${p.L}/9.8)`,` For (c): <code>9.8*${p.T2}^2/(4*pi^2)</code>.`),
  solution:(p,c)=>steps([
      ["Write down what you know",`${mi("m")} = ${p.m} kg, &nbsp;${LL} = ${p.L} m, &nbsp;${G9} = 9.8 m/s², &nbsp;${T2} = ${p.T2} s.`],
      ["(a) Pendulum formula",CALC(`${TT} = 2π√(${p.L} ÷ 9.8) = 2π × √${fmt(p.L/c.g)} = 6.283 × ${fmt(Math.sqrt(p.L/c.g))} = <b>${fmt(c.T)} s</b>`)],
      ["(b) Mass isn't in the formula",CALC(`${TP} = ${TT} = <b>${fmt(c.T)} s</b>`)+`<p class="small">Doubling the mass changes nothing. The ${p.m} kg in the question was a distractor for (a) and (c).</p>`],
      ["(c) Rearrange for L",CALC(`${LL} = ${G9}${sq2(TT)} ÷ (4π²)`)],
      ["Put the numbers in",CALC(`${L2} = 9.8 × ${sq2(p.T2)} ÷ 39.48 = ${fmt(c.g*p.T2*p.T2)} ÷ 39.48 = <b>${fmt(c.L2)} m</b>`)]
    ])+checkline(`Put the answer back in: 2π√(${fmt(c.L2)} ÷ 9.8) = ${fmt(2*Math.PI*Math.sqrt(c.L2/c.g))} s, which is the period we wanted ✓<br>Sense check: ${p.T2>c.T?`a longer period needs a longer string, and ${fmt(c.L2)} m is longer than ${p.L} m ✓`:`a shorter period needs a shorter string, and ${fmt(c.L2)} m is shorter than ${p.L} m ✓`}`)+
    finalAns(`${TT} = ${fmt(c.T)} s, &nbsp;${TP} = ${fmt(c.T)} s, &nbsp;${L2} = ${fmt(c.L2)} m`),
  sheet:[
    {name:"Pendulum period",eq:`${TT}${OP("=")}2${PI}${SQ(FR(LL,G9),true)}`,note:"Small angles only. Mass doesn't matter."},
    {name:"Length for a given period",eq:`${LL}${OP("=")}${FR(`${G9}${sq2(TT)}`,`4${sq2(PI)}`)}`,note:"Divide by 2π, square, multiply by g."}
  ],
  takeEq:()=>`${TT}${OP("=")}2${PI}${SQ(FR(LL,G9),true)}`,
  takeaway:"A pendulum's period depends only on the string length and gravity, never on the mass. To find a length, rearrange: L = gT² ÷ 4π².",
  link:"No homework on pendulums yet, but the mathematical pendulum is on your course list. It's the pendulum version of the spring in HW 3: T = 2π√(L/g) here instead of T = 2π√(m/k).",
  viz:{
    html:(p,c)=>`<p class="sec-note">Drag the string length and switch the mass. A longer string swings more slowly, but the mass makes no difference at all.</p>
      <div class="viz-box">
        <label class="viz-l" for="pd-L">String length: <output id="pd-Lo">${p.L}</output> m</label>
        <input type="range" id="pd-L" min="0.2" max="3" step="0.05" value="${p.L}">
        <div class="btn-row" role="group" aria-label="Mass of the ball"><button class="btn btn-primary" data-mass="1" aria-pressed="true">${p.m} kg ball</button><button class="btn" data-mass="2" aria-pressed="false">${fmt(2*p.m)} kg ball</button></div>
        <svg class="vsvg" viewBox="0 0 400 235" role="img" aria-label="A swinging pendulum">
          <line class="v-wall" x1="150" y1="12" x2="250" y2="12"/>
          <line id="pd-rod" x1="200" y1="12" x2="200" y2="100" style="stroke:var(--ink-2);stroke-width:1.5"/>
          <circle id="pd-bob" class="v-block" cx="200" cy="100" r="10"/>
        </svg>
        <p class="viz-read" id="pd-read"></p>
      </div>`,
    setup:(p,c,ctx)=>{
      const r=ctx.$("#pd-L"),rod=ctx.$("#pd-rod"),bob=ctx.$("#pd-bob"),read=ctx.$("#pd-read");
      let mul=1,t=0;const th0=0.32;
      const period=()=>2*Math.PI*Math.sqrt(+r.value/c.g);
      const draw=()=>{const L=+r.value,th=ctx.reduceMotion?th0:th0*Math.cos(2*Math.PI*t/period()),len=30+L*62,x=200+len*Math.sin(th),y=12+len*Math.cos(th);
        rod.setAttribute("x2",x.toFixed(1));rod.setAttribute("y2",y.toFixed(1));bob.setAttribute("cx",x.toFixed(1));bob.setAttribute("cy",y.toFixed(1));bob.setAttribute("r",(6+6*Math.cbrt(mul*p.m)).toFixed(1));};
      const upd=()=>{const L=+r.value;ctx.$("#pd-Lo").textContent=fmt(L);
        read.innerHTML=`String ${fmt(L)} m, ball ${fmt(mul*p.m)} kg: T = 2π√(${fmt(L)} ÷ 9.8) = <b>${fmt(period())} s</b>. The mass doesn't appear anywhere.`;draw();};
      ctx.$$("[data-mass]").forEach(b=>b.addEventListener("click",()=>{mul=+b.dataset.mass;ctx.$$("[data-mass]").forEach(x=>{const on=x===b;x.classList.toggle("btn-primary",on);x.setAttribute("aria-pressed",String(on));});upd();}));
      r.addEventListener("input",upd);upd();
      if(!ctx.reduceMotion)ctx.loop(dt=>{t+=dt;draw();});
    }
  },
  scene:{still:0,draw(K,t,p){
  const px=300,py=18,len=150,th=0.36*Math.cos(2*Math.PI*t/2.3),r=7+6*Math.cbrt(p.m),bx=px+len*Math.sin(th),by=py+len*Math.cos(th);
  K.ceiling(py,240,360);K.arc(px,py,len,Math.PI/2-0.4,Math.PI/2+0.4,{c:"rule",w:1,dash:[3,5]});
  K.line(px,py,px,py+len+10,{c:"rule",w:1,dash:[2,5]});
  K.line(px,py,bx,by,{w:1.8});K.circle(bx,by,r,{fill:"marker",c:"ink",w:1.6});
  K.tag(`L = ${p.L} m`,px+(bx-px)*0.5-46,py+len*0.5,{size:11});K.tag(`${p.m} kg`,bx+r+26,by,{size:11});
}}
},

{
  id:"osc-energy", topic:"Oscillations", level:"Medium", title:"Energy in SHM", hw:"Like HW 3, task 3",
  base:{m:0.5,k:200,Acm:10},
  random:()=>{const r=pick([[0.5,200,10],[2,50,20],[1,100,5],[0.8,80,12],[4,100,30],[0.2,20,8]]);return {m:r[0],k:r[1],Acm:r[2]};},
  calc:p=>{const A=p.Acm/100,w=Math.sqrt(p.k/p.m);return {A,E:0.5*p.k*A*A,xh:A/Math.SQRT2,w,T:2*Math.PI/w,t:Math.PI/(4*w)};},
  text:(p,G,T)=>`A ${G("m",`${p.m} kg`)} block on a spring (${T("k","spring constant")} ${G("k",`${p.k} N/m`)}) oscillates in simple harmonic motion with an ${T("amp","amplitude")} of ${G("A",`${p.Acm} cm`)}. (a) What is the total energy of the oscillation? (b) How far from the equilibrium position is the block when its ${T("pe","potential energy")} is exactly half of the total energy? Answer in metres. (c) How long does the block take to travel from the equilibrium position to that point?`,
  terms:{
    k:["Spring constant","How stiff the spring is, in newtons per metre of stretch."],
    amp:["Amplitude","The farthest the block gets from the middle. There it stops for an instant before coming back."],
    pe:["Potential energy (spring)","Energy stored in the stretched or squashed spring. It's biggest at the ends of the motion and zero in the middle."]
  },
  given:p=>[
    {k:"m",sym:mi("m"),name:"mass",unit:"kg",val:p.m,why:"The block's mass."},
    {k:"k",sym:mi("k"),name:"spring constant",unit:"N/m",val:p.k,why:"How stiff the spring is."},
    {k:"A",sym:AA,name:"amplitude",unit:"m",val:p.Acm/100,why:`The question gives ${p.Acm} cm. Divide by 100 for metres.`,look:`Start from the ${p.Acm} cm and divide by 100.`,gtraps:[[p.Acm,`${p.Acm} is in centimetres. Divide by 100 to get metres.`]]}
  ],
  find:[
    {sym:EE,name:"total energy",unit:"J",why:"Part (a)."},
    {sym:XX,name:"position where PE is half the total",unit:"m",why:"Part (b)."},
    {sym:mi("t"),name:"time from the middle to that point",unit:"s",why:"Part (c)."}
  ],
  parts:[
    {id:"E",label:"(a) Total energy",sym:EE,unit:"J",ans:(p,c)=>c.E,traps:(p,c)=>clean([
      [p.k*c.A*c.A,"You're missing the ½: E = ½kA²."],
      [0.5*p.k*c.A,"Square the amplitude: ½ × k × A × A."],
      [0.5*p.k*p.Acm*p.Acm,"The amplitude must be in metres. Divide the centimetres by 100 first."],
      [0.5*p.m*c.A*c.A,"Use the spring constant k, not the mass: E = ½kA²."]
    ],c.E)},
    {id:"x",label:"(b) Where the potential energy is half the total",sym:XX,unit:"m",ans:(p,c)=>c.xh,traps:(p,c)=>clean([
      [c.A/2,"Not halfway! Potential energy grows with x squared, so at x = A/2 it's only a quarter of the total. Set ½kx² = ½ × ½kA², which gives x = A ÷ √2."],
      [c.A,"That's the end of the motion, where all the energy is potential energy."],
      [c.A*Math.SQRT2,"Divide by √2, don't multiply. The block never goes further out than the amplitude."],
      [c.xh*100,"That's in centimetres. The question wants metres."],
      [c.E/2,"That's half the energy, in joules. The question asks for a position, in metres."]
    ],c.xh)},
    {id:"t",label:"(c) Time from the middle to that point",sym:mi("t"),unit:"s",ans:(p,c)=>c.t,traps:(p,c)=>clean([
      [c.T/4,"That's the time all the way from the middle to the end (a quarter period). The point x = A/√2 is reached at an eighth of a period."],
      [Math.PI/4,"That's the angle ωt = π/4. Divide by ω to get the time."],
      [45/c.w,"Use radians, not degrees: 45° = π/4."],
      [c.T,"That's a whole period. You only need an eighth of it."],
      [c.T/2,"That's half a period. You only need an eighth of it."]
    ],c.t)}
  ],
  idea:(p,c)=>`<p>In simple harmonic motion the total energy stays the same. It moves back and forth between the spring (potential) and the motion (kinetic).</p>
    <ul class="plain">
      <li><b>(a)</b> At the end of the motion the block stops for an instant, so all of the energy is in the spring. Work it out there, using the amplitude.</li>
      <li><b>(b)</b> The spring's energy at position x is ½kx². Set that equal to half of the total and solve for x. Careful: because x is squared, the answer is <b>not</b> A/2.</li>
      <li><b>(c)</b> Starting from the middle, the position follows a sine wave: x = A sin(ωt). Find when sin(ωt) = 1/√2. That happens at ωt = π/4 (45°), which is one eighth of a full cycle.</li>
    </ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${EE}${OP("=")}${HALF}${mi("k")}${sq2(AA)}`)+
    EQ(`${HALF}${mi("k")}${sq2(XX)}${OP("=")}${HALF}${EE}${IMPLIES}${XX}${OP("=")}${FR(AA,SQ("2"))}`)+
    EQ(`${OMEGA}${OP("=")}${SQ(FR(mi("k"),mi("m")),true)}${AND}${XX}${OP("=")}${AA}${OP("")}sin(${OMEGA}${mi("t")})`)+
    EQ(`sin(${OMEGA}${mi("t")})${OP("=")}${FR("1",SQ("2"))}${IMPLIES}${OMEGA}${mi("t")}${OP("=")}${FR(PI,"4")}${IMPLIES}${mi("t")}${OP("=")}${FR(PI,`4${OMEGA}`)}${OP("=")}${FR(mi("T"),"8")}`)+
    legend([[EE,"total energy","J"],[mi("k"),"spring constant","N/m"],[AA,"amplitude","m"],[XX,"distance from the middle","m"],[OMEGA,"angular frequency","rad/s"],[mi("t"),"time","s"]],
    `Angles in these formulas are in radians: π/4 rad = 45°. Set your calculator to radians if you use sin or sin⁻¹.`),
  plug:(p,c)=>EQ(`${EE}${OP("=")}${HALF}${OP("×")}${p.k}${OP("×")}${sq2(fmt(c.A))}`)+
    EQ(`${XX}${OP("=")}${FR(fmt(c.A),SQ("2"))}`)+
    EQ(`${OMEGA}${OP("=")}${SQ(FR(p.k,p.m),true)}${AND}${mi("t")}${OP("=")}${FR(PI,`4${OP("×")}${OMEGA}`)}`)+
    `<p>Convert the amplitude to metres first. For (c), find ω, then divide π/4 by it.</p>`+calcTip(`pi/(4*sqrt(${p.k}/${p.m}))`),
  solution:(p,c)=>steps([
      ["Write down what you know",`${mi("m")} = ${p.m} kg, &nbsp;${mi("k")} = ${p.k} N/m, &nbsp;${AA} = ${p.Acm} cm = ${fmt(c.A)} m.`],
      ["(a) All the energy is in the spring at the end",CALC(`${EE} = ½ × ${p.k} × ${sq2(fmt(c.A))} = <b>${fmt(c.E)} J</b>`)],
      ["(b) Half the energy in the spring",CALC(`½${mi("k")}${sq2(XX)} = ½ × ½${mi("k")}${sq2(AA)} &nbsp;→&nbsp; ${sq2(XX)} = ${sq2(AA)} ÷ 2 &nbsp;→&nbsp; ${XX} = ${fmt(c.A)} ÷ √2 = <b>${fmt(c.xh)} m</b>`)],
      ["Angular frequency",CALC(`${OMEGA} = √(${p.k} ÷ ${p.m}) = √${fmt(p.k/p.m)} = ${fmt(c.w)} rad/s`)],
      ["(c) Time to get there",CALC(`sin(${OMEGA}${mi("t")}) = 1/√2 &nbsp;→&nbsp; ${OMEGA}${mi("t")} = π/4 &nbsp;→&nbsp; ${mi("t")} = π ÷ (4 × ${fmt(c.w)}) = <b>${fmt(c.t)} s</b>`)]
    ])+checkline(`Energy check: ½ × ${p.k} × ${sq2(fmt(c.xh))} = ${fmt(0.5*p.k*c.xh*c.xh)} J, which is half of ${fmt(c.E)} J ✓<br>Time check: the period is T = 2π ÷ ${fmt(c.w)} = ${fmt(c.T)} s, and T ÷ 8 = ${fmt(c.T/8)} s ✓`)+
    finalAns(`${EE} = ${fmt(c.E)} J, &nbsp;${XX} = ${fmt(c.xh)} m, &nbsp;${mi("t")} = ${fmt(c.t)} s`),
  sheet:[
    {name:"Energy of simple harmonic motion",eq:`${EE}${OP("=")}${HALF}${mi("k")}${sq2(AA)}${OP("=")}${HALF}${mi("k")}${sq2(XX)}${OP("+")}${HALF}${mi("m")}${sq2(mi("v"))}`,note:"Total stays the same: spring energy + motion energy."},
    {name:"Half the energy in the spring",eq:`${XX}${OP("=")}${FR(AA,SQ("2"))}`,note:"Reached T/8 after passing the middle."}
  ],
  takeEq:()=>`${EE}${OP("=")}${HALF}${mi("k")}${sq2(AA)}${AND}${XX}${OP("=")}${FR(AA,SQ("2"))}`,
  takeaway:"Total energy is ½kA². Half of it sits in the spring at x = A/√2 (not A/2), which the block reaches one eighth of a period after the middle.",
  link:"This is HW 3, task 3. There the motion is given as y(t) = 15 cos(πt/3 − π/4), so you read the amplitude and ω straight from the formula. Then do the same two steps: x = A/√2, and the time from the middle is T/8.",
  viz:viz.spring((p,c)=>({T:c.T,label:`${p.m} kg`,mark:1/Math.SQRT2,markLabel:"x = A/√2",note:`The red dashed line is x = A/√2 = ${fmt(c.xh)} m, where the spring holds exactly half the energy. The block gets there from the middle in ${fmt(c.t)} s, one eighth of its ${fmt(c.T)} s period.`})),
  scene:{still:0.2,draw(K,t,p){
  springScene(K,t,{marks:true,mass:`${p.m} kg`});K.tag(`A = ${p.Acm} cm`,430,40,{size:11,c:"heat"});K.tag(`k = ${p.k} N/m`,150,96,{size:11});
}}
},

{
  id:"osc-damped-freq", topic:"Oscillations", level:"Medium", title:"Damped frequency", hw:"Course topic: damped oscillations",
  base:{m:1,k:169,b:5},
  random:()=>{const r=pick([[1,169,5],[1,625,7],[2,200,6],[1,289,8],[4,100,3],[0.5,200,12]]);return {m:r[0],k:r[1],b:r[2]};},
  calc:p=>{const w0=Math.sqrt(p.k/p.m),w=Math.sqrt(w0*w0-p.b*p.b),T=2*Math.PI/w;return {w0,w,T,T0:2*Math.PI/w0,lam:p.b*T};},
  text:(p,G,T)=>`A ${G("m",`${p.m} kg`)} block on a spring (${T("k","spring constant")} ${G("k",`${p.k} N/m`)}) oscillates inside a thick liquid, which gives a ${T("beta","damping coefficient")} of ${G("b",`${p.b} s⁻¹`)}. (a) What is the angular frequency of the damped oscillations? (b) What is their period? (c) What is the ${T("logdec","logarithmic decrement")}?`,
  terms:{
    k:["Spring constant","How stiff the spring is, in newtons per metre of stretch."],
    beta:["Damping coefficient","A number that says how fast the amplitude dies away, measured in 1/s (written s⁻¹). A bigger β means it dies away faster."],
    logdec:["Logarithmic decrement","A number that says how much the amplitude shrinks during one full oscillation: the natural log of (amplitude now ÷ amplitude one period later). It has no unit."]
  },
  given:p=>[
    {k:"m",sym:mi("m"),name:"mass",unit:"kg",val:p.m,why:"The block's mass."},
    {k:"k",sym:mi("k"),name:"spring constant",unit:"N/m",val:p.k,why:"How stiff the spring is."},
    {k:"b",sym:BETA,name:"damping coefficient",unit:"s⁻¹",val:p.b,why:"How strongly the liquid damps the motion. β is the Greek letter beta."}
  ],
  find:[
    {sym:OMEGA,name:"damped angular frequency",unit:"rad/s",why:"Part (a)."},
    {sym:mi("T"),name:"damped period",unit:"s",why:"Part (b)."},
    {sym:LAM,name:"logarithmic decrement",unit:"",why:"Part (c). λ is the Greek letter lambda. No unit."}
  ],
  parts:[
    {id:"w",label:"(a) Angular frequency with damping",sym:OMEGA,unit:"rad/s",ans:(p,c)=>c.w,traps:(p,c)=>clean([
      [c.w0,"That's ω₀, the angular frequency without damping. Damping slows the oscillation down: ω = √(ω₀² − β²)."],
      [c.w0-p.b,"Subtract the squares, not the numbers themselves: ω = √(ω₀² − β²)."],
      [Math.sqrt(c.w0*c.w0+p.b*p.b),"It's a minus: damping makes the oscillation slower, ω = √(ω₀² − β²)."],
      [c.w0*c.w0-p.b*p.b,"Take the square root at the end."],
      [Math.sqrt(p.k/p.m-p.b),"Square β too: ω = √(k/m − β²)."]
    ],c.w)},
    {id:"T",label:"(b) Period with damping",sym:mi("T"),unit:"s",ans:(p,c)=>c.T,traps:(p,c)=>clean([
      [c.T0,"That's the period without damping. Use the damped ω from (a): T = 2π ÷ ω."],
      [2*Math.PI*c.w,"Divide 2π by ω, don't multiply."],
      [c.w/(2*Math.PI),"That's the frequency in Hz. The period is 2π ÷ ω."],
      [1/c.w,"Include the 2π: T = 2π ÷ ω."]
    ],c.T)},
    {id:"lam",label:"(c) Logarithmic decrement",sym:LAM,unit:"",ans:(p,c)=>c.lam,traps:(p,c)=>clean([
      [p.b/c.T,"Multiply β by the period, don't divide: λ = βT."],
      [p.b*c.T0,"Use the damped period from (b): λ = βT."],
      [Math.exp(c.lam),"That's how many times smaller the amplitude gets in one period (e^λ). The logarithmic decrement is the log of that: λ = βT."],
      [p.b,"Multiply β by the period: λ = βT."]
    ],c.lam)}
  ],
  idea:(p,c)=>`<p>Damping does two things. It makes the amplitude shrink (the damped oscillations question), and it makes each swing take a little longer.</p>
    <ul class="plain">
      <li><b>(a)</b> Start from the angular frequency the spring would have with no damping, ω₀ = √(k/m), like in the spring questions. Damping lowers it. ω₀, β and the damped ω fit together like the sides of a right triangle, with ω₀ as the longest side.</li>
      <li><b>(b)</b> Turn the angular frequency into a period, the same way as always.</li>
      <li><b>(c)</b> The logarithmic decrement measures how much the amplitude shrinks in one period, on a log scale. The amplitude is A₀e<sup>−βt</sup>, so one period later it has been multiplied by e<sup>−βT</sup>. Taking the log leaves just β times the period.</li>
    </ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${W0}${OP("=")}${SQ(FR(mi("k"),mi("m")),true)}${AND}${OMEGA}${OP("=")}${SQ(`${sq2(W0)}${OP("−")}${sq2(BETA)}`)}`)+
    EQ(`${mi("T")}${OP("=")}${FR(`2${PI}`,OMEGA)}${AND}${LAM}${OP("=")}ln${OP("")}${FR(`${mi("A")}(${mi("t")})`,`${mi("A")}(${mi("t")}${OP("+")}${mi("T")})`)}${OP("=")}${BETA}${mi("T")}`)+
    legend([[W0,"angular frequency without damping","rad/s"],[OMEGA,"angular frequency with damping","rad/s"],[BETA,"damping coefficient","s⁻¹"],[mi("T"),"period with damping","s"],[LAM,"logarithmic decrement","no unit"]],
    `These come from the equation of damped oscillations, x″ + 2βx′ + ω₀²x = 0. If β is bigger than ω₀ there's no oscillation at all: the block just creeps back to the middle.`),
  plug:(p,c)=>EQ(`${W0}${OP("=")}${SQ(FR(p.k,p.m),true)}${AND}${OMEGA}${OP("=")}${SQ(`${sq2(W0)}${OP("−")}${sq2(p.b)}`)}`)+
    EQ(`${mi("T")}${OP("=")}${FR(`2${PI}`,OMEGA)}${AND}${LAM}${OP("=")}${p.b}${OP("×")}${mi("T")}`)+
    `<p>Find ω₀ first, then ω, then T, then λ. Each step uses the one before.</p>`+calcTip(`sqrt(${p.k}/${p.m}-${p.b}^2)`),
  solution:(p,c)=>steps([
      ["Write down what you know",`${mi("m")} = ${p.m} kg, &nbsp;${mi("k")} = ${p.k} N/m, &nbsp;${BETA} = ${p.b} s⁻¹.`],
      ["Angular frequency without damping",CALC(`${W0} = √(${p.k} ÷ ${p.m}) = √${fmt(p.k/p.m)} = ${fmt(c.w0)} rad/s`)],
      ["(a) Damping lowers it",CALC(`${OMEGA} = √(${sq2(fmt(c.w0))} − ${sq2(p.b)}) = √(${fmt(c.w0*c.w0)} − ${fmt(p.b*p.b)}) = √${fmt(c.w*c.w)} = <b>${fmt(c.w)} rad/s</b>`)],
      ["(b) Period",CALC(`${mi("T")} = 2π ÷ ${fmt(c.w)} = <b>${fmt(c.T)} s</b>`)],
      ["(c) Logarithmic decrement",CALC(`${LAM} = ${BETA}${mi("T")} = ${p.b} × ${fmt(c.T)} = <b>${fmt(c.lam)}</b>`)]
    ])+checkline(`Sense check: ${fmt(c.w)} rad/s is a bit less than ω₀ = ${fmt(c.w0)} rad/s, so the damped oscillation is slower, as it should be ✓<br>What λ means: each period the amplitude is divided by e<sup>${fmt(c.lam)}</sup> ≈ ${fmt(Math.exp(c.lam))}. That's very strong damping, as you'd expect in a thick liquid.`)+
    finalAns(`${OMEGA} = ${fmt(c.w)} rad/s, &nbsp;${mi("T")} = ${fmt(c.T)} s, &nbsp;${LAM} = ${fmt(c.lam)}`),
  sheet:[
    {name:"Damped angular frequency",eq:`${OMEGA}${OP("=")}${SQ(`${sq2(W0)}${OP("−")}${sq2(BETA)}`)}`,note:"Damping makes the oscillation a little slower."},
    {name:"Logarithmic decrement",eq:`${LAM}${OP("=")}${BETA}${mi("T")}`,note:"How much the amplitude shrinks per period, on a log scale."}
  ],
  takeEq:()=>`${OMEGA}${OP("=")}${SQ(`${sq2(W0)}${OP("−")}${sq2(BETA)}`)}${AND}${LAM}${OP("=")}${BETA}${mi("T")}`,
  takeaway:"Damping lowers the angular frequency to ω = √(ω₀² − β²). The logarithmic decrement λ = βT tells you how much the amplitude shrinks each period.",
  link:"No homework on this yet, but damped oscillations and the oscillation differential equation are on your course list. This is the solution of x″ + 2βx′ + ω₀²x = 0.",
  viz:dampViz((p,c)=>({
    note:"Drag the damping coefficient. The oscillation fades faster and each swing gets a little longer. Push β close to ω₀ and it barely swings at all.",
    max:R3(0.95*c.w0),step:R3(c.w0/100),value:p.b,tMax:3*c.T0,
    curve:(b,t)=>Math.exp(-b*t)*Math.cos(Math.sqrt(Math.max(0,c.w0*c.w0-b*b))*t),
    read:b=>{const w=Math.sqrt(Math.max(0,c.w0*c.w0-b*b)),T=2*Math.PI/w;return `β = ${fmt(R3(b))} s⁻¹: ω = <b>${fmt(w)} rad/s</b>, T = <b>${fmt(T)} s</b>, λ = <b>${fmt(b*T)}</b>, so the amplitude is divided by ${fmt(Math.exp(b*T))} each period`;}
  })),
  scene:{still:0.4,draw(K,t,p){
  const u=mod(t,5.6),cx=300,eq=150,y=eq+44*Math.exp(-1.1*u)*Math.cos(6.2*u);
  K.ceiling(14,250,350);
  K.rect(220,96,160,118,{fill:"blueSoft",c:"ink",w:2,r:4});K.line(222,104,378,104,{c:"ink2",w:1,alpha:0.6});
  K.spring(cx,14,cx,y-16,{coils:12,amp:8,c:"blue"});
  K.rect(cx-24,y-16,48,32,{fill:"marker",c:"ink",w:1.6,r:3});K.text(`${p.m} kg`,cx,y,{size:11,bold:true,c:"#14244a"});
  for(let i=0;i<7;i++){const ph=mod(u*0.5+i*0.143,1),bx=232+i*22+4*Math.sin(u*3+i);K.circle(bx,210-ph*100,2+i%2,{c:"ink2",w:1,alpha:0.6*(1-ph)});}
  K.tag(`k = ${p.k} N/m`,120,40,{size:11});K.tag(`β = ${p.b} s⁻¹`,480,150,{size:11,c:"heat"});
  draw.loopFade(K,t,5.6);
}}
},

{
  id:"osc-one-moment", topic:"Oscillations", level:"Hard", title:"SHM from one moment", hw:"Like HW 3, task 2",
  base:{k:200,x:0.03,v:0.8,a:-12},
  random:()=>{const r=pick([[200,0.03,0.8,-12],[450,0.04,0.9,-36],[160,0.06,0.8,-6],[100,0.05,1.2,-5],[250,0.3,2,-7.5],[320,0.12,0.4,-7.68]]);return {k:r[0],x:r[1],v:r[2],a:r[3]};},
  calc:p=>{const w=Math.sqrt(-p.a/p.x),u=p.v/w;return {w,f:w/(2*Math.PI),T:2*Math.PI/w,m:p.k/(w*w),u,A:Math.sqrt(p.x*p.x+u*u)};},
  text:(p,G,T)=>`A block on a spring with a ${T("k","spring constant")} of ${G("k",`${p.k} N/m`)} moves in ${T("shm","simple harmonic motion")}. At one moment the block is ${G("x",`${p.x} m`)} from its ${T("eq","equilibrium position")}, moving at ${G("v",`${p.v} m/s`)}, and its acceleration is ${G("a",`${neg(p.a)} m/s²`)}. Find (a) the ${T("freq","frequency")} of the oscillation, (b) the mass of the block and (c) the ${T("amp","amplitude")}.`,
  terms:{
    k:["Spring constant","How stiff the spring is. The unit N/m means newtons of force for every metre of stretch. A bigger number means a stiffer spring."],
    shm:["Simple harmonic motion","A smooth back-and-forth motion that repeats the same way every time, like a block bouncing on a spring or a swinging pendulum."],
    eq:["Equilibrium position","The resting point in the middle, where the spring is neither stretched nor squashed. Positions (x) are measured from here."],
    freq:["Frequency","How many complete back-and-forths happen in one second. Measured in hertz (Hz). 1 Hz means once per second."],
    amp:["Amplitude","The farthest the block gets from the middle. At that point it stops for an instant, then comes back."]
  },
  given:p=>[
    {k:"k",sym:mi("k"),name:"spring constant",unit:"N/m",val:p.k,why:"How stiff the spring is."},
    {k:"x",sym:mi("x"),name:"position",unit:"m",val:p.x,why:"How far the block is from the middle right now."},
    {k:"v",sym:mi("v"),name:"speed",unit:"m/s",val:p.v,why:"How fast the block is moving right now."},
    {k:"a",sym:mi("a"),name:"acceleration",unit:"m/s²",val:p.a,why:"The acceleration right now. The minus sign means it points back toward the middle, so keep it.",
      gtraps:[[-p.a,"Keep the minus sign. It tells you the acceleration points back toward the middle."]]}
  ],
  find:[
    {sym:mi("f"),name:"frequency",unit:"Hz",why:"Part (a)."},
    {sym:mi("m"),name:"mass of the block",unit:"kg",why:"Part (b)."},
    {sym:mi("A"),name:"amplitude",unit:"m",why:"Part (c). The farthest the block ever gets from the middle."}
  ],
  parts:[
    {id:"f",label:"(a) Frequency",sym:mi("f"),unit:"Hz",ans:(p,c)=>c.f,
      traps:(p,c)=>[
        [c.w,"That's ω (omega), the angular frequency in rad/s. The frequency is f = ω ÷ 2π."],
        [c.w*c.w,"That's ω². Take the square root to get ω, then divide by 2π."],
        [2*Math.PI*c.w,"Divide ω by 2π, don't multiply."],
        [c.T,"That's the period T. The frequency is 1 ÷ T."]
      ]},
    {id:"m",label:"(b) Mass of the block",sym:mi("m"),unit:"kg",ans:(p,c)=>c.m,
      traps:(p,c)=>clean([
        [p.k/c.w,"Divide by ω squared, not just ω: m = k ÷ ω²."],
        [c.w*c.w/p.k,"Upside down. It's m = k ÷ ω²."],
        [p.k/(c.f*c.f),"Use ω (in rad/s), not the frequency f: m = k ÷ ω²."],
        [p.k*c.w*c.w,"Divide, don't multiply: m = k ÷ ω²."]
      ],c.m)},
    {id:"A",label:"(c) Amplitude",sym:mi("A"),unit:"m",ans:(p,c)=>c.A,
      traps:(p,c)=>[
        [p.x+c.u,"You can't just add x and v/ω. They combine like the two short sides of a right triangle: A = √(x² + (v/ω)²)."],
        [p.x,"That's where the block is right now. The amplitude is the farthest it ever gets, which is further out."],
        [c.u,"That's v/ω on its own. Combine it with x: A = √(x² + (v/ω)²)."],
        [Math.sqrt(p.x*p.x+p.v*p.v),"You forgot to divide v by ω inside the square root."],
        [c.A*100,"Right number, but in centimetres. The box wants metres, so divide by 100."]
      ]}
  ],
  idea:(p,c)=>`<p>Three facts about simple harmonic motion do all the work here:</p>
    <ol class="plain">
      <li><b>The acceleration always points back to the middle</b>, and it gets bigger the further out the block is. The number linking acceleration and position is ω² (omega squared). That's why the acceleration is negative here while the position is positive.</li>
      <li><b>ω also links the spring and the mass.</b> A stiffer spring or a lighter block gives a bigger ω. Once you know ω and ${mi("k")}, you can find ${mi("m")}.</li>
      <li><b>Energy is conserved.</b> Right now the energy is split between the stretched spring and the motion. At the amplitude the block stops for an instant, so all the energy is in the spring. Set the two equal and solve for ${mi("A")}.</li>
    </ol>
    <p>The frequency works the same as for any oscillation: divide ω by 2π.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${mi("a")}${OP("=")}−${sq2(OMEGA)}${mi("x")}${IMPLIES}${OMEGA}${OP("=")}${SQ(FR(`−${mi("a")}`,mi("x")),true)}`)+
    EQ(`${mi("f")}${OP("=")}${FR(OMEGA,"2"+PI)}`)+
    EQ(`${OMEGA}${OP("=")}${SQ(FR(mi("k"),mi("m")),true)}${IMPLIES}${mi("m")}${OP("=")}${FR(mi("k"),sq2(OMEGA))}`)+
    EQ(`${HALF}${mi("k")}${sq2(mi("A"))}${OP("=")}${HALF}${mi("k")}${sq2(mi("x"))}${OP("+")}${HALF}${mi("m")}${sq2(mi("v"))}`)+
    EQ(`${mi("A")}${OP("=")}${SQ(`${sq2(mi("x"))}${OP("+")}<span class="paren">(</span>${FR(mi("v"),OMEGA)}<span class="paren">)</span><sup>2</sup>`,true)}`)+
    legend([[OMEGA,"angular frequency","rad/s"],[mi("f"),"frequency","Hz"],[mi("a"),"acceleration","m/s²"],[mi("x"),"position (distance from the middle)","m"],[mi("v"),"speed","m/s"],[mi("k"),"spring constant","N/m"],[mi("m"),"mass","kg"],[mi("A"),"amplitude","m"]],
    `Because ${mi("a")} is negative, −${mi("a")} is positive, so the square root works. The energy line says: spring energy at the turning point = spring energy now + motion energy now. Divide it by ½${mi("k")} and use ${mi("k")}/${mi("m")} = ${sq2(OMEGA)} to get the ${mi("A")} formula.`),
  plug:(p,c)=>EQ(`${OMEGA}${OP("=")}${SQ(FR(neg(-p.a),p.x),true)}`)+
    EQ(`${mi("f")}${OP("=")}${FR(OMEGA,"2"+PI)}`)+
    EQ(`${mi("m")}${OP("=")}${FR(p.k,sq2(OMEGA))}`)+
    EQ(`${mi("A")}${OP("=")}${SQ(`${sq2(p.x)}${OP("+")}<span class="paren">(</span>${FR(p.v,OMEGA)}<span class="paren">)</span><sup>2</sup>`,true)}`)+
    `<p>Find ${OMEGA} first and write it down, because all three answers use it. Note that −${mi("a")} = −(${neg(p.a)}) = ${-p.a}, a positive number.</p>`+
    calcTip(`sqrt(${-p.a}/${p.x})`," Then put your ω into the other formulas."),
  solution:(p,c)=>{const E=0.5*p.k*c.A*c.A,Es=0.5*p.k*p.x*p.x,Ek=0.5*c.m*p.v*p.v;return steps([
      ["Write down what you know",`${mi("k")} = ${p.k} N/m, &nbsp;${mi("x")} = ${p.x} m, &nbsp;${mi("v")} = ${p.v} m/s, &nbsp;${mi("a")} = ${neg(p.a)} m/s². &nbsp;Find ${mi("f")}, ${mi("m")} and ${mi("A")}.`],
      ["Find ω from a = −ω²x",CALC(`${OMEGA} = √(−${mi("a")} ÷ ${mi("x")}) = √(${-p.a} ÷ ${p.x}) = √${fmt(-p.a/p.x)} = <b>${fmt(c.w)} rad/s</b>`)],
      ["(a) Frequency",CALC(`${mi("f")} = ${OMEGA} ÷ 2π = ${fmt(c.w)} ÷ ${fmt(2*Math.PI)} = <b>${fmt(c.f)} Hz</b>`)],
      ["(b) Mass, from ω = √(k/m)",CALC(`${mi("m")} = ${mi("k")} ÷ ${sq2(OMEGA)} = ${p.k} ÷ ${sq2(fmt(c.w))} = ${p.k} ÷ ${fmt(c.w*c.w)} = <b>${fmt(c.m)} kg</b>`)],
      ["Work out v ÷ ω",CALC(`${mi("v")} ÷ ${OMEGA} = ${p.v} ÷ ${fmt(c.w)} = ${fmt(c.u)} m`)],
      ["(c) Amplitude",CALC(`${mi("A")} = √(${sq2(p.x)} + ${sq2(fmt(c.u))}) = √(${fmt(p.x*p.x)} + ${fmt(c.u*c.u)}) = √${fmt(p.x*p.x+c.u*c.u)} = <b>${fmt(c.A)} m</b>`)]
    ])+checkline(`${mi("A")} = ${fmt(c.A)} m is bigger than ${mi("x")} = ${p.x} m, as it must be: the block never gets further out than its amplitude.<br>Energy check: ½${mi("k")}${sq2(mi("A"))} = ${fmt(E)} J, and ½${mi("k")}${sq2(mi("x"))} + ½${mi("m")}${sq2(mi("v"))} = ${fmt(Es)} + ${fmt(Ek)} = ${fmt(Es+Ek)} J ✓`)+
    finalAns(`${mi("f")} = ${fmt(c.f)} Hz, &nbsp;${mi("m")} = ${fmt(c.m)} kg, &nbsp;${mi("A")} = ${fmt(c.A)} m`);},
  sheet:[
    {name:"Acceleration in SHM",eq:`${mi("a")}${OP("=")}−${sq2(OMEGA)}${mi("x")}`,note:"Always points back to the middle."},
    {name:"Mass from ω",eq:`${mi("m")}${OP("=")}${FR(mi("k"),sq2(OMEGA))}`,note:"From ω = √(k/m)."},
    {name:"Amplitude from x and v",eq:`${mi("A")}${OP("=")}${SQ(`${sq2(mi("x"))}${OP("+")}<span class="paren">(</span>${FR(mi("v"),OMEGA)}<span class="paren">)</span><sup>2</sup>`,true)}`,note:"From energy: ½kA² = ½kx² + ½mv²."}
  ],
  takeEq:()=>`${OMEGA}${OP("=")}${SQ(FR(`−${mi("a")}`,mi("x")),true)}`,
  takeaway:"Get ω from a and x first. Then f = ω ÷ 2π, m = k ÷ ω², and A = √(x² + (v/ω)²).",
  link:"This is HW 3, task 2 with friendlier numbers. Same three steps in the same order: ω from a = −ω²x, then the mass, then the amplitude. In the homework the velocity is negative, but it gets squared, so the sign doesn't change A.",
  spring:(p,c)=>({T:c.T,label:`${fmt(c.m)} kg`,mark:p.x/c.A,markLabel:`x = ${p.x} m`,note:`The red dashed line is where the block was "at one moment" (x = ${p.x} m). The dotted lines are the turning points, at the amplitude A = ${fmt(c.A)} m on each side. One full back-and-forth takes ${fmt(c.T)} s.`}),
  visual:"spring",
  scene:{still:0.25,draw(K,t,p){
  springScene(K,t,{after:(x,y,eq)=>{if(Math.abs(x-eq)>8){K.arrow(eq,y-60,x,y-60,{c:"heat",w:2});K.text("x",(eq+x)/2,y-70,{serif:true,italic:true,c:"heat",size:15});}}});
  K.tag(`k = ${p.k} N/m`,150,96,{size:11});
  K.tag(`x = ${p.x} m,  v = ${p.v} m/s,  a = ${String(p.a).replace("-","−")} m/s²`,300,26,{size:11});
}}
},

{
  id:"osc-damped-amp", topic:"Oscillations", level:"Hard", title:"Damped amplitude", hw:"Course topic: damped oscillations",
  base:{m:0.5,k:200,A0:10,A1:5,t1:4,t2:10},
  random:()=>{const r=pick([[0.5,200,10,5,4,10],[1,100,8,4,5,12],[2,50,20,10,6,15],[0.5,80,12,6,3,8],[1,400,6,3,10,25],[0.2,20,15,5,4,6],[1,100,9,6,2,5]]);return {m:r[0],k:r[1],A0:r[2],A1:r[3],t1:r[4],t2:r[5]};},
  calc:p=>{const b=Math.log(p.A0/p.A1)/p.t1,E0=0.5*p.k*(p.A0/100)**2,E1=0.5*p.k*(p.A1/100)**2;return {b,A2:p.A0*Math.exp(-b*p.t2),E0,E1,dE:E0-E1};},
  text:(p,G,T)=>`A ${G("m",`${p.m} kg`)} block on a spring (${T("k","spring constant")} ${G("k",`${p.k} N/m`)}) is pulled out ${G("A0",`${p.A0} cm`)} and let go. Air resistance ${T("damp","damps")} the motion: ${G("t1",`${p.t1} s`)} later, the amplitude has dropped to ${G("A1",`${p.A1} cm`)}. (a) What is the ${T("beta","damping coefficient")} β? (b) What will the amplitude be ${G("t2",`${p.t2} s`)} after the block is let go? Answer in cm. (c) How much energy does the oscillation lose in the first ${p.t1} s?`,
  terms:{
    k:["Spring constant","How stiff the spring is, in newtons per metre of stretch."],
    damp:["Damping","Anything that takes energy out of an oscillation, like air resistance or friction. Each swing is a little smaller than the one before."],
    beta:["Damping coefficient","A number that says how fast the amplitude dies away, measured in 1/s (written s⁻¹). A bigger β means it dies away faster."]
  },
  given:p=>[
    {k:"m",sym:mi("m"),name:"mass",unit:"kg",val:p.m,why:"The block's mass. Keep an eye on whether you actually need it."},
    {k:"k",sym:mi("k"),name:"spring constant",unit:"N/m",val:p.k,why:"How stiff the spring is."},
    {k:"A0",sym:A0,name:"starting amplitude",unit:"cm",val:p.A0,why:"How far it was pulled out at t = 0."},
    {k:"t1",sym:sb(mi("t"),"1"),name:"first time",unit:"s",val:p.t1,why:"When the amplitude was measured again.",look:"It's the first time in the question."},
    {k:"A1",sym:sb(mi("A"),"1"),name:"amplitude at that time",unit:"cm",val:p.A1,why:"The smaller amplitude after the first time.",look:"It's the second amplitude in the question."},
    {k:"t2",sym:sb(mi("t"),"2"),name:"second time",unit:"s",val:p.t2,why:"The time in part (b).",look:"It's the time in part (b)."}
  ],
  find:[
    {sym:BETA,name:"damping coefficient",unit:"s⁻¹",why:"Part (a). β is the Greek letter beta."},
    {sym:sb(mi("A"),"2"),name:"amplitude at the second time",unit:"cm",why:"Part (b)."},
    {sym:DE,name:"energy lost",unit:"J",why:"Part (c)."}
  ],
  parts:[
    {id:"b",label:"(a) Damping coefficient β",sym:BETA,unit:"s⁻¹",ans:(p,c)=>c.b,traps:(p,c)=>clean([
      [(p.A0-p.A1)/p.t1,"The amplitude doesn't drop by the same number of cm every second. It drops by the same fraction every second (exponential decay), so use ln: β = ln(A₀ ÷ A) ÷ t."],
      [Math.log10(p.A0/p.A1)/p.t1,"Use ln (the natural log), not log₁₀."],
      [Math.log(p.A0/p.A1),"Divide by the time too: β = ln(A₀ ÷ A) ÷ t."],
      [p.t1/Math.log(p.A0/p.A1),"Upside down. That's 1/β (called the time constant). β = ln(A₀ ÷ A) ÷ t."],
      [(p.A0/p.A1)/p.t1,"Take ln of the ratio first: β = ln(A₀ ÷ A) ÷ t."]
    ],c.b)},
    {id:"A2",label:"(b) Amplitude at the second time, in cm",sym:sb(mi("A"),"2"),unit:"cm",ans:(p,c)=>c.A2,traps:(p,c)=>clean([
      [c.A2/100,"That's in metres. The question asks for cm."],
      [p.A0-(p.A0-p.A1)/p.t1*p.t2,"The amplitude doesn't fall in a straight line. It decays exponentially: A = A₀e^(−βt)."],
      [p.A0*Math.exp(c.b*p.t2),"The exponent needs a minus sign, A = A₀e^(−βt), because the amplitude shrinks."],
      [p.A1*Math.exp(-c.b*p.t2),`Start from the amplitude at t = 0 (A₀ = ${p.A0} cm), not the one at ${p.t1} s.`],
      [p.A0*Math.exp(-c.b*(p.t2-p.t1)),`Use the whole time since it was let go, ${p.t2} s, in the exponent.`]
    ],c.A2)},
    {id:"dE",label:"(c) Energy lost in the first part",sym:DE,unit:"J",ans:(p,c)=>c.dE,traps:(p,c)=>clean([
      [0.5*p.k*((p.A0-p.A1)/100)**2,"Work out each energy first, then subtract: ½kA₀² − ½kA₁². Don't square the difference."],
      [c.E0,`That's the energy at the start. Subtract the energy that's left after ${p.t1} s.`],
      [c.E1,"That's the energy that's left. The question asks how much was lost."],
      [0.5*p.k*(p.A0**2-p.A1**2),"Convert cm to metres before squaring."],
      [0.5*p.m*((p.A0**2-p.A1**2)/10000),"Use the spring constant k, not the mass: E = ½kA²."]
    ],c.dE)}
  ],
  idea:(p,c)=>`<p>Damping takes a little energy out of every swing, so the amplitude shrinks. It doesn't shrink by the same number of centimetres each second. It shrinks by the <b>same fraction</b> each second, like a phone battery losing the same percentage every hour. That's called <b>exponential decay</b>.</p>
    <ul class="plain">
      <li><b>(a)</b> The decay formula has β inside an exponent of e. To get β out of the exponent, use the natural logarithm ln, which undoes e.</li>
      <li><b>(b)</b> Once you know β, put the new time into the same formula.</li>
      <li><b>(c)</b> A spring's energy is ½kA², like in the SHM energy question. Work it out at the start and after ${p.t1} s, then subtract. Convert cm to m first.</li>
    </ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${AA}(${mi("t")})${OP("=")}${A0}${EXP(`−${BETA}${mi("t")}`)}${IMPLIES}${BETA}${OP("=")}${FR(`ln(${A0}${OP("÷")}${AA})`,mi("t"))}`)+
    EQ(`${mi("E")}${OP("=")}${HALF}${mi("k")}${sq2(AA)}`)+
    legend([[AA,"amplitude at time t","cm or m"],[A0,"amplitude at t = 0","cm or m"],[BETA,"damping coefficient","s⁻¹"],[mi("t"),"time","s"],[mi("e"),"the number e ≈ 2.718",""],[mi("E"),"energy of the oscillation","J"]],
    `ln is the natural logarithm (the ln button on your calculator). It undoes e: ln(e<sup>x</sup>) = x. Here's how to get β: divide both sides by ${A0}, take ln of both sides (which gives −βt = ln(A ÷ A₀)), then divide by −t.`),
  plug:(p,c)=>EQ(`${BETA}${OP("=")}${FR(`ln(${p.A0}${OP("÷")}${p.A1})`,p.t1)}`)+
    EQ(`${sb(mi("A"),"2")}${OP("=")}${p.A0}${OP("×")}${EXP(`−${BETA}${OP("×")}${p.t2}`)}`)+
    EQ(`${DE}${OP("=")}${HALF}${OP("×")}${p.k}${OP("×")}${sq2(fmt(p.A0/100))}${OP("−")}${HALF}${OP("×")}${p.k}${OP("×")}${sq2(fmt(p.A1/100))}`)+
    `<p>The amplitudes in (c) are already converted to metres.</p>`+
    calcTip(`ln(${p.A0}/${p.A1})/${p.t1}`,` For (b) you can type <code>${p.A0}*e^(-${fmt(c.b)}*${p.t2})</code>.`),
  solution:(p,c)=>steps([
      ["Write down what you know",`${A0} = ${p.A0} cm, &nbsp;${sb(mi("A"),"1")} = ${p.A1} cm at ${sb(mi("t"),"1")} = ${p.t1} s, &nbsp;${sb(mi("t"),"2")} = ${p.t2} s, &nbsp;${mi("k")} = ${p.k} N/m. The mass isn't needed.`],
      ["(a) Get β out of the exponent",CALC(`${BETA} = ln(${p.A0} ÷ ${p.A1}) ÷ ${p.t1} = ln(${fmt(p.A0/p.A1)}) ÷ ${p.t1} = ${fmt(Math.log(p.A0/p.A1))} ÷ ${p.t1} = <b>${fmt(c.b)} s⁻¹</b>`)],
      ["(b) Same formula, new time",CALC(`${sb(mi("A"),"2")} = ${p.A0} × ${mi("e")}<sup>−${fmt(c.b)} × ${p.t2}</sup> = ${p.A0} × ${mi("e")}<sup>−${fmt(c.b*p.t2)}</sup> = ${p.A0} × ${fmt(Math.exp(-c.b*p.t2))} = <b>${fmt(c.A2)} cm</b>`)],
      ["Convert to metres for the energy",CALC(`${A0} = ${fmt(p.A0/100)} m, &nbsp; ${sb(mi("A"),"1")} = ${fmt(p.A1/100)} m`)],
      ["(c) Energy before minus energy after",CALC(`${DE} = ½ × ${p.k} × ${sq2(fmt(p.A0/100))} − ½ × ${p.k} × ${sq2(fmt(p.A1/100))} = ${fmt(c.E0)} − ${fmt(c.E1)} = <b>${fmt(c.dE)} J</b>`)]
    ])+checkline(`Shortcut for (b): every ${p.t1} s the amplitude is multiplied by ${p.A1} ÷ ${p.A0} = ${fmt(p.A1/p.A0)}. ${p.t2} s is ${fmt(p.t2/p.t1)} of those steps, so ${p.A0} × ${fmt(p.A1/p.A0)}<sup>${fmt(p.t2/p.t1)}</sup> = ${fmt(p.A0*Math.pow(p.A1/p.A0,p.t2/p.t1))} cm ✓<br>Energy goes with amplitude squared: the amplitude fell to ${fmt(p.A1/p.A0)} of its start, so the energy fell to ${fmt((p.A1/p.A0)**2)} of its start. ${fmt(100*(1-(p.A1/p.A0)**2))}% was lost ✓`)+
    finalAns(`${BETA} = ${fmt(c.b)} s⁻¹, &nbsp;${sb(mi("A"),"2")} = ${fmt(c.A2)} cm, &nbsp;${DE} = ${fmt(c.dE)} J`),
  sheet:[
    {name:"Damped amplitude",eq:`${AA}(${mi("t")})${OP("=")}${A0}${EXP(`−${BETA}${mi("t")}`)}`,note:"Shrinks by the same fraction every second."},
    {name:"Damping coefficient from two amplitudes",eq:`${BETA}${OP("=")}${FR(`ln(${A0}${OP("÷")}${AA})`,mi("t"))}`,note:"Use ln, the natural log."}
  ],
  takeEq:()=>`${AA}(${mi("t")})${OP("=")}${A0}${EXP(`−${BETA}${mi("t")}`)}`,
  takeaway:"A damped amplitude decays exponentially: A = A₀e^(−βt). Use ln to find β. Energy goes with A², so it drops even faster than the amplitude.",
  link:"No homework on this yet, but damped oscillations are on your course list under harmonic oscillations.",
  viz:dampViz((p,c)=>({
    note:"The dotted curves show the amplitude dying away. Drag the damping coefficient: more damping means a faster fade. (The graph shows fewer swings than the real spring makes, so you can see the shape.)",
    max:R3(3*c.b),step:R3(c.b/20),value:R3(c.b),tMax:p.t2,
    curve:(b,t)=>Math.exp(-b*t)*Math.cos(2*Math.PI*10*t/p.t2),
    read:b=>`β = ${fmt(R3(b))} s⁻¹: after ${p.t2} s the amplitude is ${p.A0} × e<sup>−${fmt(R3(b))} × ${p.t2}</sup> = <b>${fmt(p.A0*Math.exp(-b*p.t2))} cm</b>`
  })),
  scene:{still:0,draw(K,t,p){
  const u=mod(t,9),fade=u>8.4?(u-8.4)/0.6:0;
  springScene(K,u,{env:s=>Math.exp(-0.32*s),mass:`${p.m} kg`,after:(x,y,eq)=>{
    K.line(eq+100,y-84,eq+100,y+2,{c:"heat",w:1.2,dash:[3,4]});K.tag(`A₀ = ${p.A0} cm`,eq+100,y-94,{size:11,c:"heat"});
    for(let i=0;i<3;i++){const ph=mod(u*2+i*0.33,1);K.line(x+34+ph*30,y-36+i*12,x+44+ph*30,y-36+i*12,{c:"ink2",w:1.2,alpha:0.6*(1-ph)});}}});
  K.tag(`k = ${p.k} N/m`,150,96,{size:11});
  if(fade>0)K.rect(0,0,600,220,{fill:"bg",c:false,alpha:fade});
}}
},

{
  id:"osc-resonance", topic:"Oscillations", level:"Hard", title:"Resonance", hw:"Course topic: forced oscillations and resonance",
  base:{m:2,k:800,b:0.5,F:4},
  random:()=>{const r=pick([[2,800,0.5,4],[1,400,0.4,2],[0.5,50,0.2,0.5],[4,400,1,8],[1,900,1,6],[2,200,0.25,1]]);return {m:r[0],k:r[1],b:r[2],F:r[3]};},
  calc:p=>{const w0=Math.sqrt(p.k/p.m),w=w0/2;return {w0,f0:w0/(2*Math.PI),Ar:p.F/(2*p.m*p.b*w0),w,Ah:(p.F/p.m)/Math.sqrt((w0*w0-w*w)**2+4*p.b*p.b*w*w)};},
  text:(p,G,T)=>`A ${G("m",`${p.m} kg`)} block hangs on a spring (${T("k","spring constant")} ${G("k",`${p.k} N/m`)}) with a ${T("beta","damping coefficient")} of ${G("b",`${p.b} s⁻¹`)}. A motor pushes it up and down with a ${T("forced","periodic force")} of amplitude ${G("F",`${p.F} N`)}. (a) At what driving frequency, in Hz, does ${T("res","resonance")} happen? (b) What is the amplitude of the block when the motor drives it at its natural angular frequency ω₀? (c) What is the amplitude when the motor drives it at half of ω₀?`,
  terms:{
    k:["Spring constant","How stiff the spring is, in newtons per metre of stretch."],
    beta:["Damping coefficient","A number that says how strongly the motion is damped, measured in 1/s (written s⁻¹)."],
    forced:["Periodic force","A push that repeats over and over, like F₀cos(ωt). After a while the block oscillates at the motor's frequency, not its own."],
    res:["Resonance","When the driving frequency matches the natural frequency, each push arrives at just the right moment, and the oscillation grows very large. Only damping limits it."]
  },
  given:p=>[
    {k:"m",sym:mi("m"),name:"mass",unit:"kg",val:p.m,why:"The block's mass."},
    {k:"k",sym:mi("k"),name:"spring constant",unit:"N/m",val:p.k,why:"How stiff the spring is."},
    {k:"b",sym:BETA,name:"damping coefficient",unit:"s⁻¹",val:p.b,why:"How strongly the motion is damped."},
    {k:"F",sym:F0,name:"force amplitude",unit:"N",val:p.F,why:"The biggest push the motor gives."}
  ],
  find:[
    {sym:FRES,name:"resonance frequency",unit:"Hz",why:"Part (a)."},
    {sym:ARES,name:"amplitude when driven at ω₀",unit:"m",why:"Part (b)."},
    {sym:AHALF,name:"amplitude when driven at ω₀/2",unit:"m",why:"Part (c)."}
  ],
  parts:[
    {id:"f",label:"(a) Resonance frequency",sym:FRES,unit:"Hz",ans:(p,c)=>c.f0,traps:(p,c)=>clean([
      [c.w0,"That's ω₀ in rad/s. The question asks for hertz: divide by 2π."],
      [2*Math.PI*c.w0,"Divide by 2π, don't multiply: f = ω₀ ÷ 2π."],
      [p.k/p.m,"That's ω₀². Take the square root, then divide by 2π."],
      [1/c.f0,"That's the period. The frequency is ω₀ ÷ 2π."]
    ],c.f0)},
    {id:"Ar",label:"(b) Amplitude when driven at ω₀",sym:ARES,unit:"m",ans:(p,c)=>c.Ar,traps:(p,c)=>clean([
      [p.F/p.k,"That's how far the force would stretch the spring if it pushed steadily. At resonance the amplitude grows much bigger: A = F₀ ÷ (2mβω₀)."],
      [p.F/(p.m*p.b*c.w0),"You're missing the 2: A = F₀ ÷ (2mβω₀)."],
      [p.F/(2*p.b*c.w0),"Divide by the mass too: A = F₀ ÷ (2mβω₀)."],
      [p.F/(2*p.m*p.b*c.w0*c.w0),"Use ω₀ once, not squared: A = F₀ ÷ (2mβω₀)."]
    ],c.Ar)},
    {id:"Ah",label:"(c) Amplitude when driven at half of ω₀",sym:AHALF,unit:"m",ans:(p,c)=>c.Ah,traps:(p,c)=>clean([
      [c.Ar/2,"The amplitude doesn't just halve. Away from resonance it drops a lot. Use the full formula."],
      [p.F/p.k,"That would be the answer for very slow pushing (ω close to 0). At half of ω₀, use the full formula."],
      [(p.F/p.m)/Math.sqrt((c.w0-c.w)**2+4*p.b*p.b*c.w*c.w),"Square the frequencies inside the bracket: (ω₀² − ω²)², not (ω₀ − ω)²."],
      [(p.F/p.m)/Math.sqrt(c.w0*c.w0-c.w*c.w),"Square the bracket (ω₀² − ω²) inside the square root, and add the 4β²ω² term."]
    ],c.Ah)}
  ],
  idea:(p,c)=>`<p>Think of pushing someone on a swing. Push at random moments and not much happens. Push <b>in time with the swing's own rhythm</b>, and every push adds energy, so the swing goes higher and higher. That's <b>resonance</b>.</p>
    <ul class="plain">
      <li><b>(a)</b> Resonance happens when the motor's frequency matches the block's natural frequency: the one it would have on its own, from k and m. With small damping they're practically the same. Convert from rad/s to Hz.</li>
      <li><b>(b)</b> At resonance every push adds energy, and only damping stops the amplitude from growing forever. So the amplitude depends on the force, the mass, the damping and ω₀.</li>
      <li><b>(c)</b> Away from resonance, many pushes fight the motion instead of helping it, so the amplitude is much smaller. Use the general amplitude formula for forced oscillations.</li>
    </ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${W0}${OP("=")}${SQ(FR(mi("k"),mi("m")),true)}${AND}${FRES}${OP("≈")}${FR(W0,`2${PI}`)}`)+
    EQ(`${AA}(${OMEGA})${OP("=")}${FR(`${F0}${OP("÷")}${mi("m")}`,SQ(`(${sq2(W0)}${OP("−")}${sq2(OMEGA)})<sup>2</sup>${OP("+")}4${sq2(BETA)}${sq2(OMEGA)}`))}`)+
    EQ(`${OMEGA}${OP("=")}${W0}${IMPLIES}${ARES}${OP("=")}${FR(F0,`2${mi("m")}${BETA}${W0}`)}`)+
    legend([[W0,"natural angular frequency","rad/s"],[OMEGA,"driving angular frequency (the motor's)","rad/s"],[F0,"force amplitude","N"],[BETA,"damping coefficient","s⁻¹"],[AA,"amplitude of the forced oscillation","m"]],
    `Strictly, the peak of the amplitude is at ω = √(ω₀² − 2β²), but with small damping that's practically ω₀. These come from the forced oscillation equation x″ + 2βx′ + ω₀²x = (F₀/m)cos(ωt).`),
  plug:(p,c)=>EQ(`${W0}${OP("=")}${SQ(FR(p.k,p.m),true)}${AND}${FRES}${OP("=")}${FR(W0,`2${PI}`)}`)+
    EQ(`${ARES}${OP("=")}${FR(p.F,`2${OP("×")}${p.m}${OP("×")}${p.b}${OP("×")}${W0}`)}`)+
    EQ(`${AHALF}${OP("=")}${FR(`${p.F}${OP("÷")}${p.m}`,SQ(`(${sq2(W0)}${OP("−")}${sq2(OMEGA)})<sup>2</sup>${OP("+")}4${OP("×")}${sq2(p.b)}${OP("×")}${sq2(OMEGA)}`))}${AND}${OMEGA}${OP("=")}${FR(W0,"2")}`)+
    `<p>Find ω₀ first. For (c), work out ω₀² − ω² and square it, then add the damping term, take the square root, and divide.</p>`+
    calcTip(`${p.F}/(2*${p.m}*${p.b}*sqrt(${p.k}/${p.m}))`),
  solution:(p,c)=>steps([
      ["Write down what you know",`${mi("m")} = ${p.m} kg, &nbsp;${mi("k")} = ${p.k} N/m, &nbsp;${BETA} = ${p.b} s⁻¹, &nbsp;${F0} = ${p.F} N.`],
      ["Natural angular frequency",CALC(`${W0} = √(${p.k} ÷ ${p.m}) = √${fmt(p.k/p.m)} = ${fmt(c.w0)} rad/s`)],
      ["(a) Resonance frequency in Hz",CALC(`${FRES} = ${fmt(c.w0)} ÷ 2π = <b>${fmt(c.f0)} Hz</b>`)],
      ["(b) Amplitude at resonance",CALC(`${ARES} = ${p.F} ÷ (2 × ${p.m} × ${p.b} × ${fmt(c.w0)}) = ${p.F} ÷ ${fmt(2*p.m*p.b*c.w0)} = <b>${fmt(c.Ar)} m</b>`)],
      ["(c) Driven at half of ω₀",CALC(`${OMEGA} = ${fmt(c.w)} rad/s, &nbsp; ${sq2(W0)} − ${sq2(OMEGA)} = ${fmt(c.w0*c.w0)} − ${fmt(c.w*c.w)} = ${fmt(c.w0*c.w0-c.w*c.w)}, &nbsp; 4${sq2(BETA)}${sq2(OMEGA)} = ${fmt(4*p.b*p.b*c.w*c.w)}`)+
        CALC(`${AHALF} = (${p.F} ÷ ${p.m}) ÷ √(${sq2(fmt(c.w0*c.w0-c.w*c.w))} + ${fmt(4*p.b*p.b*c.w*c.w)}) = ${fmt(p.F/p.m)} ÷ ${fmt(Math.sqrt((c.w0*c.w0-c.w*c.w)**2+4*p.b*p.b*c.w*c.w))} = <b>${fmt(c.Ah)} m</b>`)]
    ])+checkline(`Compare: driven at resonance, the amplitude is ${fmt(c.Ar)} ÷ ${fmt(c.Ah)} ≈ ${fmt(c.Ar/c.Ah)} times bigger than at half the frequency. That's why soldiers break step on bridges, and why a washing machine shakes hard at one particular spin speed.<br>Units: N ÷ (kg × s⁻¹ × s⁻¹) = (kg·m/s²) ÷ (kg/s²) = m ✓`)+
    finalAns(`${FRES} = ${fmt(c.f0)} Hz, &nbsp;${ARES} = ${fmt(c.Ar)} m, &nbsp;${AHALF} = ${fmt(c.Ah)} m`),
  sheet:[
    {name:"Forced oscillation amplitude",eq:`${AA}${OP("=")}${FR(`${F0}${OP("÷")}${mi("m")}`,SQ(`(${sq2(W0)}${OP("−")}${sq2(OMEGA)})<sup>2</sup>${OP("+")}4${sq2(BETA)}${sq2(OMEGA)}`))}`,note:"ω is the driving angular frequency."},
    {name:"Amplitude at resonance",eq:`${ARES}${OP("=")}${FR(F0,`2${mi("m")}${BETA}${W0}`)}`,note:"Resonance at ω ≈ ω₀ = √(k/m). Less damping means a taller peak."}
  ],
  takeEq:()=>`${ARES}${OP("=")}${FR(F0,`2${mi("m")}${BETA}${W0}`)}`,
  takeaway:"Resonance: driving at the natural frequency ω₀ = √(k/m) gives a huge amplitude, limited only by damping. Away from ω₀ the amplitude is much smaller.",
  link:"No homework on this yet, but forced oscillations and resonance are on your course list. The amplitude formula is the solution of x″ + 2βx′ + ω₀²x = (F₀/m)cos(ωt).",
  viz:{
    html:(p,c)=>`<p class="sec-note">This is the resonance curve: amplitude against the motor's frequency. Drag the frequency, then try more damping. The peak gets lower and wider.</p>
      <div class="viz-box">
        <label class="viz-l" for="rs-w">Motor's angular frequency: <output id="rs-wo">${fmt(c.w0)}</output> rad/s</label>
        <input type="range" id="rs-w" min="0" max="${R3(2*c.w0)}" step="${R3(c.w0/100)}" value="${R3(c.w0)}">
        <div class="btn-row" role="group" aria-label="Damping">${[1,2,4].map(k=>`<button class="btn${k===1?" btn-primary":""}" data-damp="${k}" aria-pressed="${k===1}">β × ${k}</button>`).join("")}</div>
        <svg class="vsvg" viewBox="0 0 400 200" role="img" aria-label="Resonance curve">
          <line x1="30" y1="180" x2="390" y2="180" style="stroke:var(--ink-2);stroke-width:1"/>
          <line x1="30" y1="12" x2="30" y2="180" style="stroke:var(--ink-2);stroke-width:1"/>
          <line x1="210" y1="12" x2="210" y2="180" class="v-faint"/>
          <text class="v-text" x="210" y="194" text-anchor="middle">ω₀</text>
          <text class="v-text" x="390" y="194" text-anchor="end">frequency →</text>
          <text class="v-text" x="26" y="20" text-anchor="end">A</text>
          <path id="rs-c" class="v-main"/>
          <circle id="rs-d" r="5" style="fill:var(--bad)"/>
        </svg>
        <p class="viz-read" id="rs-read"></p>
      </div>`,
    setup:(p,c,ctx)=>{
      const r=ctx.$("#rs-w");let mul=1;
      const A=(w,b)=>(p.F/p.m)/Math.sqrt((c.w0*c.w0-w*w)**2+4*b*b*w*w);
      const X=w=>30+360*w/(2*c.w0),Y=a=>180-160*Math.min(a/c.Ar,1.05);
      const curve=()=>{let d="";for(let i=0;i<=300;i++){const w=2*c.w0*i/300;d+=(i?" L":"M")+X(w).toFixed(1)+","+Y(A(w,p.b*mul)).toFixed(1);}ctx.$("#rs-c").setAttribute("d",d);};
      const upd=()=>{const w=+r.value,a=A(w,p.b*mul);ctx.$("#rs-wo").textContent=fmt(R3(w));
        const d=ctx.$("#rs-d");d.setAttribute("cx",X(w).toFixed(1));d.setAttribute("cy",Y(a).toFixed(1));
        ctx.$("#rs-read").innerHTML=`Driven at ${fmt(R3(w))} rad/s (${fmt(w/(2*Math.PI))} Hz) with β = ${fmt(p.b*mul)} s⁻¹: amplitude <b>${fmt(a)} m</b>${Math.abs(w-c.w0)<c.w0/100?" (resonance)":""}`;};
      ctx.$$("[data-damp]").forEach(b=>b.addEventListener("click",()=>{mul=+b.dataset.damp;ctx.$$("[data-damp]").forEach(x=>{const on=x===b;x.classList.toggle("btn-primary",on);x.setAttribute("aria-pressed",String(on));});curve();upd();}));
      r.addEventListener("input",upd);curve();upd();
    }
  },
  scene:{still:5,draw(K,t,p){
  const u=mod(t,9),w=2*Math.PI/1.1,fade=u>8.4?(u-8.4)/0.6:0,env=38*(1-Math.exp(-u/2.6)),cx=300;
  const mx=cx,my=24,cr=10,ca=w*u,pinx=mx+cr*Math.cos(ca),piny=my+cr*Math.sin(ca),top=48+cr*Math.sin(ca);
  K.rect(mx-24,my-16,48,32,{fill:"bg",c:"ink",w:1.6,r:4});K.circle(mx,my,cr+3,{c:"ink2",w:1.4});K.line(mx,my,pinx,piny,{w:2.4});K.circle(pinx,piny,3,{fill:"heat",c:false});
  K.line(pinx,piny,cx,top,{c:"ink2",w:2});K.rect(cx-10,top-3,20,6,{fill:"ink2",c:false,r:2});
  const by=152+env*Math.sin(ca-Math.PI/2);
  K.spring(cx,top+3,cx,by-18,{coils:12,amp:8});K.rect(cx-26,by-18,52,36,{fill:"marker",c:"ink",w:1.6,r:3});K.text(`${p.m} kg`,cx,by,{size:11,bold:true,c:"#14244a"});
  K.tag(`F₀ = ${p.F} N`,mx+44,my,{align:"left",size:11,c:"heat"});K.tag(`k = ${p.k} N/m`,120,110,{size:11});K.tag(`β = ${p.b} s⁻¹`,480,110,{size:11});
  if(fade>0)K.rect(0,0,600,220,{fill:"bg",c:false,alpha:fade});
}}
},

/* ===== SHM from its energy (midterm 1, task 4) ===== */
{
  id:"osc-from-energy", level:"Medium", title:"SHM from its energy", hw:"Midterm 1, task 4",
  base:{E:1,Acm:10,vm:1.2},
  random:()=>({E:pick([0.5,0.8,1,1.5,2,2.5,3]),Acm:pick([5,8,10,12,15,20]),vm:pick([0.8,1,1.2,1.5,2,2.5])}),
  calc:p=>{const A=p.Acm/100,k=2*p.E/(A*A),m=2*p.E/(p.vm*p.vm),w=Math.sqrt(k/m);return {A,k,m,w,f:w/(2*Math.PI),T:2*Math.PI/w};},
  text:(p,G,T)=>`An oscillating block-spring system has a ${T("mech","mechanical energy")} of ${G("E",`${p.E} J`)}, an ${T("amp","amplitude")} of ${G("A",`${p.Acm} cm`)} and a maximum speed of ${G("vm",`${p.vm} m/s`)}. Find (a) the spring constant, (b) the mass of the block, and (c) the frequency of oscillation.`,
  terms:{
    mech:["Mechanical energy","The total energy of the oscillation: spring energy + kinetic energy. Without friction it stays the same the whole time."],
    amp:["Amplitude","How far the block gets from the middle, at its turning points."]
  },
  given:p=>[
    {k:"E",sym:EE,name:"total mechanical energy",unit:"J",val:p.E,why:"Stays the same during the whole oscillation.",look:"The number measured in J."},
    {k:"A",sym:AA,name:"amplitude",unit:"m",val:p.Acm/100,why:`Convert to metres: ${p.Acm} cm = ${p.Acm/100} m.`,look:"The amplitude is in cm. Convert to metres.",gtraps:[[p.Acm,`Convert to metres first: ${p.Acm} cm = ${p.Acm/100} m.`]]},
    {k:"vm",sym:VMX,name:"maximum speed",unit:"m/s",val:p.vm,why:"Reached in the middle, where the spring is relaxed.",look:"The speed in m/s."}
  ],
  find:[{sym:KO,name:"spring constant",unit:"N/m",why:"Part (a)."},{sym:MO,name:"mass of the block",unit:"kg",why:"Part (b)."},{sym:FO,name:"frequency",unit:"Hz",why:"Part (c). Oscillations per second."}],
  parts:[
    {id:"k",label:"(a) Spring constant",sym:KO,unit:"N/m",ans:(p,c)=>c.k,traps:(p,c)=>clean([[2*p.E/(p.Acm*p.Acm),`Change cm to m first: ${p.Acm} cm = ${c.A} m.`],[p.E/(c.A*c.A),"E = ½kA², so k = 2E ÷ A². Don't forget the 2."],[2*p.E/c.A,"Square the amplitude: k = 2E ÷ A²."]],c.k)},
    {id:"m",label:"(b) Mass of the block",sym:MO,unit:"kg",ans:(p,c)=>c.m,traps:(p,c)=>clean([[p.E/(p.vm*p.vm),"E = ½mv², so m = 2E ÷ v². Don't forget the 2."],[2*p.E/p.vm,"Square the speed: m = 2E ÷ v²."]],c.m)},
    {id:"f",label:"(c) Frequency",sym:FO,unit:"Hz",ans:(p,c)=>c.f,traps:(p,c)=>clean([[c.w,"That's the angular frequency ω = √(k/m), in rad/s. Divide by 2π to get f in Hz."],[2*Math.PI*c.w,"Divide by 2π, don't multiply: f = √(k/m) ÷ 2π."],[c.T,"That's the period T (seconds per oscillation). The frequency is 1 ÷ T."]],c.f)}
  ],
  idea:()=>`<p>The total energy stays the same, but it keeps moving between the spring and the block's motion. Look at the two extreme moments:</p>
    <ul class="plain"><li><b>At a turning point</b> (x = ±A) the block stops for an instant, so all the energy is in the spring: E = ½kA². That gives k.</li><li><b>In the middle</b> (x = 0) the spring is relaxed and the block is fastest, so all the energy is kinetic: E = ½mv_max². That gives m.</li></ul>
    <p>Then the frequency comes from k and m: ω = √(k/m), and f = ω ÷ 2π.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${EE}${OP("=")}${HALF}${KO}${sq2(AA)}${IMPLIES}${KO}${OP("=")}${FR(`2${EE}`,sq2(AA))}`)+EQ(`${EE}${OP("=")}${HALF}${MO}${sq2(VMX)}${IMPLIES}${MO}${OP("=")}${FR(`2${EE}`,sq2(VMX))}`)+EQ(`${FO}${OP("=")}${FR("1",`2${PI}`)}${SQ(FR(KO,MO),true)}`)+
    legend([[EE,"total mechanical energy","J"],[AA,"amplitude","m"],[VMX,"maximum speed","m/s"],[FO,"frequency (oscillations per second)","Hz"]],"Shortcut you can use as a check: v_max = Aω, so f = v_max ÷ (2πA)."),
  plug:(p,c)=>EQ(`${KO}${OP("=")}${FR(`2${OP("×")}${p.E}`,`${c.A}<sup>2</sup>`)}${AND}${MO}${OP("=")}${FR(`2${OP("×")}${p.E}`,`${p.vm}<sup>2</sup>`)}`)+EQ(`${FO}${OP("=")}${FR("1",`2${PI}`)}${SQ(FR(KO,MO),true)}`)+calcTip(`2*${p.E}/${c.A}^2`),
  solution:(p,c)=>steps([
      ["(a) All in the spring at the turning point",CALC(`${KO} = 2 × ${p.E} ÷ ${c.A}² = <b>${fmt(c.k)} N/m</b>`)],
      ["(b) All kinetic in the middle",CALC(`${MO} = 2 × ${p.E} ÷ ${p.vm}² = <b>${fmt(c.m)} kg</b>`)],
      ["(c) Frequency",CALC(`ω = √(${fmt(c.k)} ÷ ${fmt(c.m)}) = ${fmt(c.w)} rad/s &nbsp;→&nbsp; ${FO} = ${fmt(c.w)} ÷ 2π = <b>${fmt(c.f)} Hz</b>`)]
    ])+checkline(`With the shortcut: f = v_max ÷ (2πA) = ${p.vm} ÷ (2π × ${c.A}) = ${fmt(p.vm/(2*Math.PI*c.A))} Hz ✓`)+
    finalAns(`${KO} = ${fmt(c.k)} N/m, &nbsp;${MO} = ${fmt(c.m)} kg, &nbsp;${FO} = ${fmt(c.f)} Hz`),
  sheet:[{name:"Energy in SHM",eq:`${EE}${OP("=")}${HALF}${KO}${sq2(AA)}${OP("=")}${HALF}${MO}${sq2(VMX)}`,note:"All spring energy at the ends, all kinetic in the middle."},{name:"Frequency of a spring",eq:`${FO}${OP("=")}${FR("1",`2${PI}`)}${SQ(FR(KO,MO),true)}`,note:"Period T = 1 ÷ f."}],
  takeEq:()=>`${EE}${OP("=")}${HALF}${KO}${sq2(AA)}${OP("=")}${HALF}${MO}${sq2(VMX)}`,
  takeaway:"At the ends all the energy is in the spring (½kA²); in the middle it's all kinetic (½mv_max²). Then f = √(k/m) ÷ 2π.",
  link:"This is task 4 of your midterm 1 (E = 1 J, A = 10 cm, v_max = 1.2 m/s), which you got right. The first numbers on this page are exactly those.",
  viz:viz.spring((p,c)=>({T:c.T,label:`${fmt(c.m)} kg`,note:`Your block on its spring. It's fastest (${p.vm} m/s) as it passes the middle and stops for an instant at ±A (${p.Acm} cm). One full back-and-forth takes ${fmt(c.T)} s.`})),
  scene:{still:0.2,draw(K,t,p){springScene(K,t,{marks:true});K.tag(`A = ${p.Acm} cm`,430,40,{size:11,c:"heat"});K.tag(`E = ${p.E} J`,150,70,{size:11});K.tag(`v_max = ${p.vm} m/s`,150,100,{size:11});}}
}
]);
})();
