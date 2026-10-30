/* Kinematics: motion with constant or changing acceleration, free fall and projectiles.
   Every question on this topic is one object in the list below: its numbers, text, hints,
   answer checks, "See it" panel and animation. See ADDING-QUESTIONS.md for how to add one. */
(function(){
"use strict";
const {fmt,pick,mi,up,sb,ssp,OP,FR,SQ,EQ,CALC,HALF,sq2,neg,IMPLIES,AND,PAREN,PI,OMEGA,V0,VI,VF,KE,KEI,KEF,DKE,legend,steps,checkline,finalAns,watch,calcTip,viz}=HL;
const {R3,clean,pr,sumTxt,draw}=PHYS;
const {F,mod,fadeIn,cyclist,speedLines,springScene,block,curvedArrow}=draw;

/* symbols and helpers used below */
const X0=sb(mi("x"),"0");
const TT=mi("t");
const INT=ssp(`<span class="mu" style="font-size:1.35em">∫</span>`,"0",mi("t"));
const tp=n=>n===0?"":n===1?mi("t"):`${mi("t")}<sup>${n}</sup>`;
function join(list){let s="";list.forEach(([k,b])=>{if(!k)return;if(!s)s=(k<0?"−":"")+b;else s+=` ${k<0?"−":"+"} ${b}`;});return s||"0";}
const poly=terms=>join(terms.map(([k,n])=>[k,Math.abs(k)===1&&n>0?tp(n):`${fmt(Math.abs(k))}${tp(n)}`]));
const polyAt=(terms,T)=>join(terms.map(([k,n])=>[k,n===0?fmt(Math.abs(k)):`${Math.abs(k)===1?"":`${fmt(Math.abs(k))} × `}${n===1?T:`${T}<sup>${n}</sup>`}`]));
const polyVals=(terms,T)=>join(terms.map(([k,n])=>{const v=k*Math.pow(T,n);return [v,fmt(Math.abs(v))];}));
const aT=p=>[[p.A,1],[-p.B,0]];
const vT=p=>[[p.v0,0],[p.A/2,2],[-p.B,1]];
const xT=p=>[[p.x0,0],[p.v0,1],[p.A/6,3],[-p.B/2,2]];

/* for free fall and projectiles */
const g=9.8,rad=d=>d*Math.PI/180,sinD=d=>Math.sin(rad(d)),cosD=d=>Math.cos(rad(d));
const G9=mi("g"),HH=mi("h"),VV=mi("v"),TIME=mi("t"),XD=mi("x"),RG=mi("R"),THETA=mi("θ"),HMAX=sb(mi("H"),"max"),TFL=sb(mi("t"),"flight"),VYk=sb(mi("v"),"y"),V0k=sb(mi("v"),"0");
const radTrapK=v=>[v,"Your calculator is in radians. Switch it to degrees (DEG) and work it out again."];
const fade=(K,u,a,b)=>{if(u>a)K.rect(0,0,600,220,{fill:"bg",c:false,alpha:Math.min(1,(u-a)/(b-a))});};

PHYS.add("Kinematics",[
{
  id:"kin-speed-up", topic:"Kinematics", level:"Easy", title:"Speeding up", hw:"Builds toward HW 2",
  base:{v0:4,a:1.5,t:6},
  random:()=>({v0:pick([2,3,4,5,6]),a:pick([0.5,1.5,2,2.5,3]),t:pick([4,5,6,8,10])}),
  calc:p=>({gain:p.a*p.t,v:p.v0+p.a*p.t}),
  text:(p,G,T)=>`A cyclist is riding at ${G("v0",`${p.v0} m/s`)}. She then speeds up with a ${T("acc","constant acceleration")} of ${G("a",`${p.a} m/s²`)} for ${G("t",`${p.t} s`)}. What is her speed at the end?`,
  terms:{acc:["Constant acceleration",`Acceleration is how much the speed changes every second. "Constant" means it changes by the same amount every second. For example, 2 m/s² means the speed goes up by 2 m/s each second.`]},
  given:p=>[
    {k:"v0",sym:V0,name:"starting speed",unit:"m/s",val:p.v0,why:`Her speed at the very beginning. The small 0 means "at time zero".`},
    {k:"a",sym:mi("a"),name:"acceleration",unit:"m/s²",val:p.a,why:`How much speed she gains every second. Read the unit as "metres per second, every second".`},
    {k:"t",sym:mi("t"),name:"time",unit:"s",val:p.t,why:"How long she keeps speeding up."}
  ],
  find:[{sym:mi("v"),name:"final speed",unit:"m/s",why:"Her speed at the end. This is what the question asks for."}],
  parts:[{id:"v",label:"Her speed at the end",sym:mi("v"),unit:"m/s",ans:(p,c)=>c.v,
    traps:(p,c)=>[
      [c.gain,`That's the speed she <b>gained</b> (${p.a} × ${p.t}). Now add the ${p.v0} m/s she already had at the start.`],
      [p.v0+p.a,`That's her speed after only 1 second. She speeds up for ${p.t} seconds, so multiply the acceleration by the time.`],
      [(p.v0+p.a)*p.t,`Multiply first, then add: work out ${p.a} × ${p.t} first, then add ${p.v0}.`]
    ]}],
  idea:(p,c)=>{
    const cols=[0,1,2,3].map(n=>({t:n,v:p.v0+p.a*n}));
    return `<p>Every second, she gets <b>${p.a} m/s faster</b>. Look at the pattern:</p>
    <div class="tbl-wrap"><table class="tbl"><tr><th scope="row">Time (s)</th>${cols.map(x=>`<td>${x.t}</td>`).join("")}<td>…</td><td>${p.t}</td></tr>
    <tr><th scope="row">Speed (m/s)</th>${cols.map(x=>`<td>${fmt(x.v)}</td>`).join("")}<td>…</td><td class="q">?</td></tr></table></div>
    <p>In words: <b>speed at the end = starting speed + (speed gained each second) × (number of seconds)</b>.</p>
    <p class="small">Try the question again. The next hint turns this sentence into a formula.</p>`;
  },
  formula:()=>EQ(`${mi("v")}${OP("=")}${V0}${OP("+")}${mi("a")}${mi("t")}`)+
    legend([[mi("v"),"final speed","m/s"],[V0,"starting speed","m/s"],[mi("a"),"acceleration","m/s²"],[mi("t"),"time","s"]],
    `<b>${mi("a")}${mi("t")}</b> means ${mi("a")} × ${mi("t")}. In physics, two letters written next to each other are multiplied.`),
  plug:(p,c)=>EQ(`${mi("v")}${OP("=")}${p.v0}${OP("+")}${p.a}${OP("×")}${p.t}`)+
    `<p>Order of operations: <b>multiply first</b> (${p.a} × ${p.t}), then add ${p.v0}.</p>`+calcTip(`${p.v0}+${p.a}*${p.t}`),
  solution:(p,c)=>steps([
      ["Write down what you know",`${V0} = ${p.v0} m/s, &nbsp;${mi("a")} = ${p.a} m/s², &nbsp;${mi("t")} = ${p.t} s. &nbsp;Find ${mi("v")}.`],
      ["Pick the formula",EQ(`${mi("v")}${OP("=")}${V0}${OP("+")}${mi("a")}${mi("t")}`)],
      ["Put the numbers in",CALC(`${mi("v")} = ${p.v0} + ${p.a} × ${p.t}`)],
      ["Multiply first",CALC(`${p.a} × ${p.t} = <b>${fmt(c.gain)} m/s</b>`)+`<p class="small">This is the speed she gained.</p>`],
      ["Then add the starting speed",CALC(`${mi("v")} = ${p.v0} + ${fmt(c.gain)} = <b>${fmt(c.v)} m/s</b>`)]
    ])+checkline(`Units: ${mi("a")} × ${mi("t")} gives m/s² × s = m/s, which is a speed. ✓`)+finalAns(`${mi("v")} = ${fmt(c.v)} m/s`),
  sheet:[{name:"Speed with constant acceleration",eq:`${mi("v")}${OP("=")}${V0}${OP("+")}${mi("a")}${mi("t")}`,note:`If something "starts from rest", then v₀ = 0.`}],
  takeEq:()=>`${mi("v")}${OP("=")}${V0}${OP("+")}${mi("a")}${mi("t")}`,
  takeaway:"With constant acceleration: speed at the end = starting speed + acceleration × time.",
  link:"HW 2, task 2 is the harder version of this. There the (angular) acceleration changes with time, so you integrate instead of multiplying. When the acceleration is constant, that integral gives exactly this formula.",
  visual:"speed",
  scene:{still:3,draw(K,t,p){
  const y=184,u=Math.min(mod(t,5.2),4),pos=k=>50+35*k+17*k*k,x=pos(u);
  K.ground(y,0,600);
  for(let k=0;k<=u+1e-9;k+=0.5)K.circle(pos(k),y-4,2.4,{fill:"ink2",c:false,alpha:0.55});
  K.line(50,y-96,50,y+2,{c:"ink2",w:1.2,dash:[4,4]});K.tag(`${F(p.v0)} m/s`,50,y-106,{size:11});
  speedLines(K,x-26,y-30,3,10+u*8,0.5);
  cyclist(K,x,y,x/13);
  K.arrow(x-8,y-84,x+40,y-84,{c:"heat",w:2.4});K.tag(`${F(p.a)} m/s²`,x+16,y-108,{c:"heat",size:11});
}}
},

{
  id:"kin-braking", topic:"Kinematics", level:"Medium", title:"Braking car", hw:"Classic exam task · km/h like HW 1",
  base:{kmh:72,dec:4},
  random:()=>{const r=pick([[72,4],[54,2.5],[36,2],[90,5],[72,2.5],[54,3],[36,2.5],[108,5]]);return {kmh:r[0],dec:r[1]};},
  calc:p=>{const v0=p.kmh*10/36,a=-p.dec,t=v0/p.dec;return {v0,a,t,x:v0*t+0.5*a*t*t};},
  text:(p,G,T)=>`A car is driving at ${G("v0",T("kmh",`${p.kmh} km/h`))} when the driver brakes. The car slows down with a constant ${T("dec","deceleration")} of ${G("a",`${p.dec} m/s²`)} until it ${G("v","comes to a stop")}. (a) How long does it take to stop? (b) How far does the car travel while braking?`,
  terms:{
    kmh:["km/h","Kilometres per hour. Physics formulas need metres per second (m/s). To convert, divide by 3.6, because 1 km/h = 1000 m ÷ 3600 s."],
    dec:["Deceleration","Slowing down. A deceleration of 4 m/s² means the speed drops by 4 m/s every second. In formulas you write it as a negative acceleration: a = −4 m/s²."]
  },
  given:p=>{const v0=p.kmh*10/36;return [
    {k:"v0",sym:V0,name:"starting speed",unit:"m/s",val:v0,why:`The speed when braking starts. The question gives ${p.kmh} km/h, but the formulas need m/s. Divide by 3.6 and type the result.`,look:`Start from the ${p.kmh} km/h in the question and divide by 3.6.`,
      gtraps:[[p.kmh,`${p.kmh} is in km/h. The formulas need m/s, so divide by 3.6.`],[p.kmh*3.6,"Divide by 3.6, don't multiply. The number in m/s is smaller than the number in km/h."]]},
    {k:"v",sym:mi("v"),name:"final speed",unit:"m/s",val:0,why:`"Comes to a stop" means the speed at the end is 0. Exam questions often hide a number in words like this.`,look:`Read the end of the question. What speed does "comes to a stop" mean?`},
    {k:"a",sym:mi("a"),name:"acceleration",unit:"m/s²",val:-p.dec,why:"Braking means the speed goes down, so the acceleration is negative. Include the minus sign.",
      gtraps:[[p.dec,"The car is slowing down, so the acceleration is negative. Put a minus sign in front."]]}
  ];},
  find:[
    {sym:mi("t"),name:"stopping time",unit:"s",why:"How long the braking lasts. Part (a)."},
    {sym:mi("x"),name:"braking distance",unit:"m",why:"How far the car moves while braking. Part (b)."}
  ],
  parts:[
    {id:"t",label:"(a) Time to stop",sym:mi("t"),unit:"s",ans:(p,c)=>c.t,
      traps:(p,c)=>[
        [p.kmh/p.dec,`It looks like you used ${p.kmh} km/h directly. Convert to m/s first: ${p.kmh} ÷ 3.6.`],
        [p.kmh*3.6/p.dec,"To get m/s, divide km/h by 3.6. Don't multiply."],
        [p.dec/c.v0,`Upside down. The car loses ${p.dec} m/s every second. How many seconds to lose all ${fmt(c.v0)} m/s? That's ${fmt(c.v0)} ÷ ${p.dec}.`]
      ]},
    {id:"x",label:"(b) Braking distance",sym:mi("x"),unit:"m",ans:(p,c)=>c.x,
      traps:(p,c)=>[
        [c.v0*c.t,`That would be the distance if the car kept going at ${fmt(c.v0)} m/s the whole time. It slows down, so it covers less. Include the ½ a t² part, with a negative a.`],
        [c.v0*c.t+0.5*p.dec*c.t*c.t,"The acceleration is negative (the car is slowing down), so the ½ a t² part should be subtracted, not added."],
        [p.kmh*p.kmh/(2*p.dec),"It looks like you used the speed in km/h. Convert to m/s first."]
      ]}
  ],
  idea:(p,c)=>`<p>This is the same kind of motion as the easier cyclist question (constant acceleration), except the car is slowing down. Notice two things first:</p>
    <ul class="plain"><li>The speed is in km/h. Physics formulas need m/s, so convert first.</li><li>"Comes to a stop" tells you the final speed: 0.</li></ul>
    <p><b>(a)</b> The car loses ${p.dec} m/s of speed every second. How many seconds does it take to lose <i>all</i> of its starting speed?</p>
    <p><b>(b)</b> The speed drops steadily from the starting speed down to 0. So on average, the car moves at <b>half</b> its starting speed. Distance = average speed × time.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${mi("v")}${OP("=")}${V0}${OP("+")}${mi("a")}${mi("t")}${IMPLIES}${mi("t")}${OP("=")}${FR(`${mi("v")}${OP("−")}${V0}`,mi("a"))}`)+
    EQ(`${mi("x")}${OP("=")}${V0}${mi("t")}${OP("+")}${HALF}${mi("a")}${sq2(mi("t"))}`)+
    legend([[V0,"starting speed","m/s"],[mi("v"),"final speed","m/s"],[mi("a"),"acceleration (negative when slowing down)","m/s²"],[mi("t"),"time","s"],[mi("x"),"distance travelled","m"]],
    `To get ${mi("t")} on its own from ${mi("v")} = ${V0} + ${mi("a")}${mi("t")}: subtract ${V0} from both sides, then divide both sides by ${mi("a")}. To convert km/h to m/s, divide by 3.6. Shortcut for anything that stops: distance = average speed × time = ½ × ${V0} × ${mi("t")}.`),
  plug:(p,c)=>CALC(`${V0} = ${p.kmh} ÷ 3.6 = ${fmt(c.v0)} m/s`)+
    EQ(`${mi("t")}${OP("=")}${FR(`0${OP("−")}${fmt(c.v0)}`,`−${p.dec}`)}`)+
    EQ(`${mi("x")}${OP("=")}${fmt(c.v0)}${OP("×")}${mi("t")}${OP("+")}${HALF}${OP("×")}(−${p.dec})${OP("×")}${sq2(mi("t"))}`)+
    `<p>Work out ${mi("t")} first, then use it in the distance formula. A minus divided by a minus gives a plus, and ½ × (−${p.dec}) is negative.</p>`+
    calcTip(`(0-${fmt(c.v0)})/(-${p.dec})`),
  solution:(p,c)=>steps([
      ["Convert the speed to m/s",CALC(`${V0} = ${p.kmh} ÷ 3.6 = <b>${fmt(c.v0)} m/s</b>`)],
      ["Write down what you know",`${V0} = ${fmt(c.v0)} m/s, &nbsp;${mi("v")} = 0 (it stops), &nbsp;${mi("a")} = −${p.dec} m/s². &nbsp;Find ${mi("t")} and ${mi("x")}.`],
      ["(a) Get t on its own",EQ(`${mi("t")}${OP("=")}${FR(`${mi("v")}${OP("−")}${V0}`,mi("a"))}`)],
      ["Put the numbers in",CALC(`${mi("t")} = (0 − ${fmt(c.v0)}) ÷ (−${p.dec}) = (−${fmt(c.v0)}) ÷ (−${p.dec}) = <b>${fmt(c.t)} s</b>`)],
      ["(b) Distance formula",CALC(`${mi("x")} = ${V0}${mi("t")} + ½${mi("a")}${sq2(mi("t"))} = ${fmt(c.v0)} × ${fmt(c.t)} + ½ × (−${p.dec}) × ${sq2(fmt(c.t))}`)],
      ["Work it out",CALC(`${mi("x")} = ${fmt(c.v0*c.t)} − ${fmt(0.5*p.dec*c.t*c.t)} = <b>${fmt(c.x)} m</b>`)]
    ])+checkline(`Average speed × time: (${fmt(c.v0)} + 0) ÷ 2 = ${fmt(c.v0/2)} m/s, and ${fmt(c.v0/2)} m/s × ${fmt(c.t)} s = ${fmt(c.x)} m ✓`)+
    finalAns(`${mi("t")} = ${fmt(c.t)} s, &nbsp; ${mi("x")} = ${fmt(c.x)} m`),
  sheet:[
    {name:"Time from two speeds",eq:`${mi("t")}${OP("=")}${FR(`${mi("v")}${OP("−")}${V0}`,mi("a"))}`,note:"Rearranged from v = v₀ + at. When slowing down, a is negative."},
    {name:"Distance with constant acceleration",eq:`${mi("x")}${OP("=")}${V0}${mi("t")}${OP("+")}${HALF}${mi("a")}${sq2(mi("t"))}`,note:"km/h ÷ 3.6 = m/s."}
  ],
  takeEq:()=>`${mi("x")}${OP("=")}${V0}${mi("t")}${OP("+")}${HALF}${mi("a")}${sq2(mi("t"))}`,
  takeaway:"Convert km/h to m/s first. Braking means a negative acceleration. Something that stops has a final speed of 0.",
  link:"Stopping time and braking distance, with a km/h conversion, is a classic kinematics exam task. The same km/h conversion shows up in HW 1, task 2 (the truck).",
  visual:"brake",
  scene:{still:2.5,draw(K,t,p){
  const y=184,u=mod(t,6.2);let x,br=false;
  if(u<1){x=60+120*u;}else if(u<4){const s=u-1;x=180+120*s-20*s*s;br=true;}else{x=360;br=u<4.8;}
  K.ground(y,0,600);
  K.line(180,y-86,180,y+2,{c:"bad",w:1.4,dash:[4,4]});K.tag("brakes on",180,y-96,{size:11,c:"bad"});
  if(u<1)speedLines(K,x-40,y-20,3,22,0.5);
  K.car(x,y,{brake:br,ang:x/9});
  if(u<1)K.tag(`${p.kmh} km/h`,x,y-64,{size:11});
  if(br&&u<4){K.arrow(x+18,y-66,x-24,y-66,{c:"heat",w:2.4});K.tag(`${p.dec} m/s²`,x+24,y-66,{align:"left",c:"heat",size:11});}
}}
},

{
  id:"kin-changing-a", topic:"Kinematics", level:"Hard", title:"Changing acceleration", hw:"Like HW 2, task 2",
  base:{A:6,B:2,v0:1,x0:0,T:3},
  random:()=>{const r=pick([[6,2,1,0,3],[6,4,3,2,2],[12,2,0,1,2],[6,8,5,0,3],[12,4,2,0,3],[6,2,4,1,2]]);return {A:r[0],B:r[1],v0:r[2],x0:r[3],T:r[4]};},
  calc:p=>{const T=p.T;return {a:p.A*T-p.B,v:R3(p.v0+p.A/2*T*T-p.B*T),x:R3(p.x0+p.v0*T+p.A/6*T*T*T-p.B/2*T*T)};},
  text:(p,G,T)=>`A small robot moves along a straight track. Its ${T("acc","acceleration")} ${T("chg","changes with time")}: ${mi("a")}(${mi("t")}) = ${poly(aT(p))}, with ${mi("a")} in m/s² and ${mi("t")} in seconds. At ${mi("t")} = 0 it ${p.v0===0?`starts ${G("v0","from rest")}`:`has a velocity of ${G("v0",`${p.v0} m/s`)}`} at position ${G("x0",`${p.x0} m`)}. Find (a) its acceleration, (b) its velocity and (c) its position ${G("T",`${p.T} s`)} after the start.`,
  terms:{
    acc:["Acceleration","How fast the velocity changes. Here it isn't constant: the formula gives a different value at each moment."],
    chg:["Changes with time","Because the acceleration keeps changing, simple formulas like v = v₀ + at don't work. You have to add up the changes bit by bit, which is what integrating means. Hint 2 explains it in plain words."]
  },
  given:p=>[
    {k:"v0",sym:V0,name:"starting velocity",unit:"m/s",val:p.v0,why:"The velocity at t = 0.",look:p.v0===0?`"From rest" means not moving. What velocity is that?`:undefined},
    {k:"x0",sym:X0,name:"starting position",unit:"m",val:p.x0,why:"Where the robot is at t = 0."},
    {k:"T",sym:mi("t"),name:"time",unit:"s",val:p.T,why:"The moment the question asks about."}
  ],
  find:[
    {sym:mi("a"),name:"acceleration at that moment",unit:"m/s²",why:"Part (a)."},
    {sym:mi("v"),name:"velocity at that moment",unit:"m/s",why:"Part (b)."},
    {sym:mi("x"),name:"position at that moment",unit:"m",why:"Part (c)."}
  ],
  parts:[
    {id:"a",label:p=>`(a) Acceleration at t = ${p.T} s`,sym:mi("a"),unit:"m/s²",ans:(p,c)=>c.a,traps:(p,c)=>[
      [p.A-p.B,`That's the acceleration at t = 1 s. Put t = ${p.T} into ${p.A}t − ${p.B}.`],
      [p.A*p.T,`Don't forget the − ${p.B}: a = ${p.A} × ${p.T} − ${p.B}.`],
      [p.A*p.T+p.B,`Check the sign. It's ${p.A} × ${p.T} minus ${p.B}.`]
    ]},
    {id:"v",label:p=>`(b) Velocity at t = ${p.T} s`,sym:mi("v"),unit:"m/s",ans:(p,c)=>c.v,traps:(p,c)=>[
      p.v0?[c.v-p.v0,`You forgot the starting velocity. Add ${V0} = ${p.v0} m/s at the end.`]:null,
      [p.v0+c.a*p.T,`That's v₀ + a·t with the acceleration at the end (it's also what you get if you wrote ${p.A}t² instead of ${fmt(p.A/2)}t²). The acceleration keeps changing, so integrate each term: ${p.A}t → ${fmt(p.A/2)}t² and −${p.B} → −${p.B}t.`],
      [c.a,"That's the acceleration at that moment. The question asks for the velocity, so integrate a(t) first."]
    ].filter(Boolean)},
    {id:"x",label:p=>`(c) Position at t = ${p.T} s`,sym:mi("x"),unit:"m",ans:(p,c)=>c.x,traps:(p,c)=>[
      p.x0?[c.x-p.x0,`You forgot the starting position. Add ${X0} = ${p.x0} m.`]:null,
      p.v0?[c.x-p.v0*p.T,`You forgot the ${p.v0}t term. The starting velocity ${p.v0} integrates to ${p.v0}t.`]:null,
      [p.x0+c.v*p.T,`That's x₀ + v·t with the velocity at the end (it's also what you get if you don't divide the powers). The velocity keeps changing, so integrate each term of v(t): ${fmt(p.A/2)}t² → ${fmt(p.A/6)}t³ and −${p.B}t → −${fmt(p.B/2)}t².`],
      [c.v,"That's the velocity. Position needs one more integration step."]
    ].filter(Boolean)}
  ],
  idea:(p,c)=>`<p>When the acceleration changes, the simple formulas don't work. Go step by step instead:</p>
    <ol class="plain">
      <li><b>(a)</b> Acceleration: just put t = ${p.T} into the formula.</li>
      <li><b>(b)</b> Velocity: acceleration is how fast the velocity changes. To go backwards from a to v, ask for each term: <b>"what has this as its derivative?"</b> Then add the starting velocity.</li>
      <li><b>(c)</b> Position: velocity is how fast the position changes. Do the same again with your v(t), then add the starting position.</li>
    </ol>
    <p>Derivative reminder: bring the power down in front and lower it by 1. So t² → 2t, t³ → 3t², t → 1, and a plain number → 0.</p>
    <p class="small">Try it now. The next hint shows the rule for going backwards.</p>`,
  formula:()=>EQ(`${mi("v")}(${TT})${OP("=")}${V0}${OP("+")}${INT}${mi("a")}${OP("")}d${TT}${AND}${mi("x")}(${TT})${OP("=")}${X0}${OP("+")}${INT}${mi("v")}${OP("")}d${TT}`)+
    `<p>Going backwards, term by term ("what has this derivative?"):</p>
    <div class="tbl-wrap"><table class="tbl"><tr><th scope="row">Term you have</th><td>a number ${mi("k")}</td><td>${mi("k")}${TT}</td><td>${mi("k")}${sq2(TT)}</td></tr>
    <tr><th scope="row">Becomes</th><td>${mi("k")}${TT}</td><td>${FR(mi("k"),"2")}${sq2(TT)}</td><td>${FR(mi("k"),"3")}${TT}<sup>3</sup></td></tr></table></div>`+
    legend([[mi("a"),"acceleration","m/s²"],[mi("v"),"velocity","m/s"],[mi("x"),"position","m"],[V0,"velocity at t = 0","m/s"],[X0,"position at t = 0","m"],[TT,"time","s"]],
    `The rule: raise the power by 1, then divide by the new power. The ∫ … d${TT} just means "add up over time". You never calculate with the d${TT} itself.`),
  plug:(p,c)=>EQ(`${mi("v")}(${TT})${OP("=")}${poly(vT(p))}`)+EQ(`${mi("x")}(${TT})${OP("=")}${poly(xT(p))}`)+
    `<p>These are the two formulas after integrating. Check one yourself: the derivative of ${mi("v")}(${TT}) should give back ${poly(aT(p))}. Now put ${TT} = ${p.T} into each one.</p>`+
    calcTip(`${polyAt(vT(p),p.T).replace(/<sup>(\d)<\/sup>/g,"^$1").replace(/ × /g,"*").replace(/ − /g,"-").replace(/ \+ /g,"+").replace(/^−/,"-")}`),
  solution:(p,c)=>steps([
      ["Write down what you know",`${mi("a")}(${TT}) = ${poly(aT(p))}, &nbsp;${V0} = ${p.v0} m/s, &nbsp;${X0} = ${p.x0} m, &nbsp;${TT} = ${p.T} s.`],
      ["(a) Put t into a(t)",CALC(`${mi("a")} = ${polyAt(aT(p),p.T)} = <b>${fmt(c.a)} m/s²</b>`)],
      ["Integrate a(t) term by term",CALC(`${p.A}${TT} → ${fmt(p.A/2)}${sq2(TT)}, &nbsp; −${p.B} → −${p.B}${TT}, &nbsp;so&nbsp; ${mi("v")}(${TT}) = ${poly(vT(p))}`)],
      ["(b) Put t into v(t)",CALC(`${mi("v")} = ${polyAt(vT(p),p.T)} = ${polyVals(vT(p),p.T)} = <b>${fmt(c.v)} m/s</b>`)],
      ["Integrate v(t) term by term",CALC(`${mi("x")}(${TT}) = ${poly(xT(p))}`)+`<p class="small">Each power goes up by 1 and you divide by the new power. The starting position ${X0} is added at the front.</p>`],
      ["(c) Put t into x(t)",CALC(`${mi("x")} = ${polyAt(xT(p),p.T)} = ${polyVals(xT(p),p.T)} = <b>${fmt(c.x)} m</b>`)]
    ])+checkline(`Differentiate backwards: the derivative of ${mi("x")}(${TT}) = ${poly(xT(p))} is ${poly(xT(p).filter(t=>t[1]>0).map(([k,n])=>[k*n,n-1]))}, which is ${mi("v")}(${TT}) ✓<br>At ${TT} = 0 the formulas give ${mi("v")} = ${p.v0} and ${mi("x")} = ${p.x0}, the starting values ✓`)+
    finalAns(`${mi("a")} = ${fmt(c.a)} m/s², &nbsp;${mi("v")} = ${fmt(c.v)} m/s, &nbsp;${mi("x")} = ${fmt(c.x)} m`),
  sheet:[
    {name:"Velocity from changing acceleration",eq:`${mi("v")}(${TT})${OP("=")}${V0}${OP("+")}${INT}${mi("a")}${OP("")}d${TT}`,note:"Integrate a(t), then add the starting velocity."},
    {name:"Position from velocity",eq:`${mi("x")}(${TT})${OP("=")}${X0}${OP("+")}${INT}${mi("v")}${OP("")}d${TT}`,note:"Integrate v(t), then add the starting position."},
    {name:"Integrating a power of t",eq:`${mi("k")}${TT}<sup>${mi("n")}</sup>${IMPLIES}${FR(mi("k"),`${mi("n")}${OP("+")}1`)}${TT}<sup>${mi("n")}+1</sup>`,note:"Raise the power by 1, divide by the new power."}
  ],
  takeEq:()=>`${mi("v")}(${TT})${OP("=")}${V0}${OP("+")}${INT}${mi("a")}${OP("")}d${TT}`,
  takeaway:"When acceleration changes, integrate term by term (raise the power, divide by the new power) and add the starting value. Do it twice to get from acceleration to position.",
  link:"This is HW 2, task 2 with different letters. There it's angular acceleration α(t) → angular velocity ω(t) → angle θ(t), with ω₀ and θ₀ as the starting values. The steps are exactly the same.",
  viz:{
    html:(p,c)=>`<p class="sec-note">Drag the time. The blue curve is the velocity and the grey curve is the position. Where the velocity is bigger, the position curve climbs faster.</p>
      <div class="viz-box">
        <label class="viz-l" for="pl-t">Time: <output id="pl-to">${p.T}</output> s</label>
        <input type="range" id="pl-t" min="0" max="${p.T}" step="0.05" value="${p.T}">
        <svg class="vsvg" viewBox="0 0 400 200" role="img" aria-label="Graphs of velocity and position against time">
          <line id="pl-axis" x1="40" x2="390" y1="180" y2="180" style="stroke:var(--ink-2);stroke-width:1"/>
          <line x1="40" y1="10" x2="40" y2="180" style="stroke:var(--ink-2);stroke-width:1"/>
          <path id="pl-v" class="v-main"/><path id="pl-x" class="v-main" style="stroke:var(--ink-2)"/>
          <line id="pl-cur" x1="40" x2="40" y1="10" y2="180" class="v-faint"/>
          <circle id="pl-vd" r="4" style="fill:var(--blue)"/><circle id="pl-xd" r="4" style="fill:var(--ink-2)"/>
          <text class="v-text" x="390" y="196" text-anchor="end">time (s)</text>
          <text id="pl-zero" class="v-text" x="34" y="184" text-anchor="end">0</text>
        </svg>
        <div class="legend-row"><span><i class="sw sw-ke"></i>velocity v (m/s)</span><span><i class="sw sw-alt"></i>position x (m)</span></div>
        <p class="viz-read" id="pl-read"></p>
      </div>`,
    setup:(p,c,ctx)=>{
      const fa=t=>p.A*t-p.B,fv=t=>p.v0+p.A/2*t*t-p.B*t,fx=t=>p.x0+p.v0*t+p.A/6*t*t*t-p.B/2*t*t;
      let lo=0,hi=0;for(let i=0;i<=60;i++){const t=p.T*i/60;lo=Math.min(lo,fv(t),fx(t));hi=Math.max(hi,fv(t),fx(t));}
      if(hi-lo<1e-9)hi=lo+1;
      const X=t=>40+350*t/p.T,Y=y=>180-165*(y-lo)/(hi-lo);
      const path=f=>{let d="";for(let i=0;i<=80;i++){const t=p.T*i/80;d+=(i?" L":"M")+X(t).toFixed(1)+","+Y(f(t)).toFixed(1);}return d;};
      ctx.$("#pl-v").setAttribute("d",path(fv));ctx.$("#pl-x").setAttribute("d",path(fx));
      const y0=Y(0).toFixed(1),ax=ctx.$("#pl-axis");ax.setAttribute("y1",y0);ax.setAttribute("y2",y0);ctx.$("#pl-zero").setAttribute("y",(+y0+4).toFixed(1));
      const r=ctx.$("#pl-t");
      const upd=()=>{const t=+r.value,cx=X(t).toFixed(1),cur=ctx.$("#pl-cur");
        ctx.$("#pl-to").textContent=fmt(t);cur.setAttribute("x1",cx);cur.setAttribute("x2",cx);
        ctx.$("#pl-vd").setAttribute("cx",cx);ctx.$("#pl-vd").setAttribute("cy",Y(fv(t)).toFixed(1));
        ctx.$("#pl-xd").setAttribute("cx",cx);ctx.$("#pl-xd").setAttribute("cy",Y(fx(t)).toFixed(1));
        ctx.$("#pl-read").innerHTML=`At t = ${fmt(t)} s: a = ${fmt(R3(fa(t)))} m/s², <b>v = ${fmt(R3(fv(t)))} m/s</b>, <b>x = ${fmt(R3(fx(t)))} m</b>`;};
      r.addEventListener("input",upd);upd();
    }
  },
  scene:{still:2,draw(K,t,p){
  const y=168,T=p.T,u=Math.min(mod(t,5.6),4),tau=u/4*T;
  const X=s=>p.v0*s+p.A/6*s*s*s-p.B/2*s*s;
  let lo=0,hi=0;for(let i=0;i<=60;i++){const v=X(T*i/60);lo=Math.min(lo,v);hi=Math.max(hi,v);}
  const sx=v=>90+430*(v-lo)/((hi-lo)||1),x=sx(X(tau)),a=p.A*tau-p.B;
  K.ground(y,20,580);for(let k=0;k<=10;k++){const tx=90+43*k;K.line(tx,y,tx,y+7,{c:"ink2",w:1.2});}
  K.line(sx(0),y-56,sx(0),y+2,{c:"ink2",w:1.2,dash:[4,4]});
  K.rect(x-22,y-36,44,26,{fill:"blueSoft",c:"ink",w:1.6,r:6});K.circle(x-8,y-26,3,{fill:"ink",c:false});K.circle(x+8,y-26,3,{fill:"ink",c:false});
  K.line(x,y-36,x,y-48,{w:1.6});K.circle(x,y-50,3,{fill:"heat",c:false});
  K.wheel(x-13,y-6,6,x/6);K.wheel(x+13,y-6,6,x/6);
  const L=Math.max(-60,Math.min(60,a*6));if(Math.abs(L)>4)K.arrow(x,y-66,x+L,y-66,{c:"heat",w:2.4});
  K.tag(`a(t) = ${p.A}t − ${p.B}`,30,28,{align:"left",size:12});K.tag(`v₀ = ${p.v0} m/s`,30,56,{align:"left",size:11});K.tag(`x₀ = ${p.x0} m`,30,84,{align:"left",size:11});
}}
},

/* ===== Dropped from a height (free fall) ===== */
{
  id:"kin-free-fall", level:"Easy", title:"Dropped from a height", hw:"Course topic: free fall",
  base:{h:20},
  random:()=>({h:pick([5,10,15,20,30,45,60,80])}),
  calc:p=>{const t=Math.sqrt(2*p.h/g);return {t,v:g*t};},
  text:(p,G,T)=>`A stone is ${G("v0","dropped")} from the top of a building ${G("h",`${p.h} m`)} tall. Ignore air resistance. (a) How long does it take to reach the ground? (b) How fast is it going just before it lands?`,
  terms:{},
  given:p=>[
    {k:"h",sym:HH,name:"height of the fall",unit:"m",val:p.h,why:"How far it falls.",look:"The number measured in m."},
    {k:"v0",sym:V0k,name:"starting speed",unit:"m/s",val:0,why:"\"Dropped\" means let go, not thrown: it starts from rest.",look:"\"Dropped\" means it starts from rest. What speed is that?"},
    {k:"g",sym:G9,name:"acceleration of free fall",unit:"m/s²",val:9.8,why:"Every falling object speeds up by 9.8 m/s every second (no air resistance). It isn't written in the question: you're expected to know it.",look:"Not in the question: the acceleration of free fall near the Earth."}
  ],
  find:[{sym:TIME,name:"time to fall",unit:"s",why:"Part (a)."},{sym:VV,name:"speed just before landing",unit:"m/s",why:"Part (b)."}],
  parts:[
    {id:"t",label:"(a) Time to reach the ground",sym:TIME,unit:"s",ans:(p,c)=>c.t,traps:(p,c)=>clean([[2*p.h/g,"That's t². Take the square root: t = √(2h ÷ g)."],[Math.sqrt(p.h/g),"h = ½gt², so t² = 2h ÷ g. Don't forget the 2."],[p.h/g,"Use h = ½gt² and solve for t: t = √(2h ÷ g)."],[Math.sqrt(2*p.h*g),"Divide by g, don't multiply: t = √(2h ÷ g)."]],c.t)},
    {id:"v",label:"(b) Speed just before landing",sym:VV,unit:"m/s",ans:(p,c)=>c.v,traps:(p,c)=>clean([[2*g*p.h,"That's v². Take the square root: v = √(2gh)."],[Math.sqrt(g*p.h),"v² = 2gh. Don't forget the 2."],[p.h/c.t,"That's the average speed on the way down. It keeps speeding up, so the final speed is twice that: v = gt."],[g*p.h,"Use v = g × t (with the time from part a), or v = √(2gh)."]],c.v)}
  ],
  idea:()=>`<p>A dropped object is in <b>free fall</b>: it starts at rest and speeds up by 9.8 m/s every second, all the way down. That's motion with a constant acceleration g, so the usual formulas work with a = g and v₀ = 0:</p>
    <ul class="plain"><li>Distance fallen after time t: h = ½gt². Solve this for t.</li><li>Speed after time t: v = gt.</li></ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${HH}${OP("=")}${HALF}${G9}${sq2(TIME)}${IMPLIES}${TIME}${OP("=")}${SQ(FR(`2${HH}`,G9),true)}`)+EQ(`${VV}${OP("=")}${G9}${TIME}${OP("=")}${SQ(`2${G9}${HH}`)}`)+
    legend([[HH,"height fallen","m"],[G9,"9.8, the acceleration of free fall","m/s²"],[TIME,"time","s"],[VV,"speed","m/s"]]),
  plug:p=>EQ(`${TIME}${OP("=")}${SQ(FR(`2${OP("×")}${p.h}`,"9.8"),true)}`)+EQ(`${VV}${OP("=")}9.8${OP("×")}${TIME}`)+calcTip(`sqrt(2*${p.h}/9.8)`),
  solution:(p,c)=>steps([
      ["(a) Time from h = ½gt²",CALC(`${sq2(TIME)} = 2 × ${p.h} ÷ 9.8 = ${fmt(2*p.h/g)} &nbsp;→&nbsp; ${TIME} = √${fmt(2*p.h/g)} = <b>${fmt(c.t)} s</b>`)],
      ["(b) Speed from v = gt",CALC(`${VV} = 9.8 × ${fmt(c.t)} = <b>${fmt(c.v)} m/s</b>`)]
    ])+checkline(`The other way: v = √(2 × 9.8 × ${p.h}) = √${fmt(2*g*p.h)} = ${fmt(Math.sqrt(2*g*p.h))} m/s ✓`)+
    finalAns(`${TIME} = ${fmt(c.t)} s, &nbsp;${VV} = ${fmt(c.v)} m/s`),
  sheet:[{name:"Free fall from rest",eq:`${HH}${OP("=")}${HALF}${G9}${sq2(TIME)},${OP("")}${VV}${OP("=")}${G9}${TIME}${OP("=")}${SQ(`2${G9}${HH}`)}`,note:"g = 9.8 m/s². The mass doesn't matter."}],
  takeEq:()=>`${HH}${OP("=")}${HALF}${G9}${sq2(TIME)}`,
  takeaway:"Free fall is constant acceleration g from rest: h = ½gt² for the time, then v = gt for the speed.",
  link:"The same two formulas run the up-and-down part of any projectile. Try “Thrown horizontally” on Medium next.",
  viz:viz.slider((p,c)=>({note:"Drag the time. The stone covers more ground every second, because it keeps speeding up.",label:"Time",unit:"s",min:0,max:R3(c.t),step:0.01,value:R3(c.t),
    bars:[{label:"Distance fallen",segs:[{cls:"seg-alt",frac:x=>0.5*g*x*x/p.h}]},{label:"Speed",segs:[{cls:"seg-ke",frac:x=>x/c.t}]}],read:x=>`After ${fmt(x)} s: fallen <b>${fmt(R3(0.5*g*x*x))} m</b>, speed <b>${fmt(R3(g*x))} m/s</b>`})),
  scene:{still:1.2,draw(K,t,p){const u=mod(t,3.6),top=24,bot=196,k=(bot-top-14)/(1.6*1.6),y=u<1.6?top+0.5*k*u*u:bot-7;
    K.ground(bot,20,580);K.rect(150,top,90,bot-top,{fill:"bg",c:"ink",w:2});for(let i=0;i<5;i++)for(let j=0;j<2;j++)K.rect(166+j*38,top+14+i*32,20,18,{fill:"blueSoft",c:false});
    K.vdim(120,top,bot,`${p.h} m`);K.circle(262,y,7,{fill:"ink2",c:"ink",w:1.4});
    for(let k2=1;k2<=4;k2++){const tt=k2*0.4;if(tt<u&&tt<1.6)K.circle(262,top+0.5*k*tt*tt,3,{fill:"ink2",c:false,alpha:0.4});}
    fade(K,u,3,3.6);}}
},

/* ===== Thrown horizontally ===== */
{
  id:"kin-horizontal", level:"Medium", title:"Thrown horizontally", hw:"Course topic: projectile motion",
  base:{h:20,v0:8},
  random:()=>({h:pick([5,10,15,20,30,45]),v0:pick([4,5,6,8,10,12,15])}),
  calc:p=>{const t=Math.sqrt(2*p.h/g),vy=g*t;return {t,x:p.v0*t,vy,v:Math.hypot(p.v0,vy)};},
  text:(p,G,T)=>`A ball rolls off the edge of a cliff ${G("h",`${p.h} m`)} high, moving ${G("v0",`horizontally at ${p.v0} m/s`)}. Ignore air resistance. (a) How long is it in the air? (b) How far from the foot of the cliff does it land? (c) How fast is it going when it lands?`,
  terms:{},
  given:p=>[
    {k:"h",sym:HH,name:"height of the cliff",unit:"m",val:p.h,why:"How far it falls.",look:"The number measured in m."},
    {k:"v0",sym:V0k,name:"starting speed (sideways)",unit:"m/s",val:p.v0,why:"It leaves the edge moving only sideways: its downward speed starts at 0.",look:"The speed in m/s."}
  ],
  find:[{sym:TIME,name:"time in the air",unit:"s",why:"Part (a)."},{sym:XD,name:"distance from the cliff",unit:"m",why:"Part (b). Measured along the ground."},{sym:VV,name:"landing speed",unit:"m/s",why:"Part (c)."}],
  parts:[
    {id:"t",label:"(a) Time in the air",sym:TIME,unit:"s",ans:(p,c)=>c.t,traps:(p,c)=>clean([[p.h/p.v0,"The time in the air depends only on the fall: t = √(2h ÷ g). The sideways speed doesn't change it."],[2*p.h/g,"That's t². Take the square root."],[Math.sqrt(p.h/g),"h = ½gt², so t = √(2h ÷ g): don't forget the 2."]],c.t)},
    {id:"x",label:"(b) Distance from the foot of the cliff",sym:XD,unit:"m",ans:(p,c)=>c.x,traps:(p,c)=>clean([[p.h,"That's the height it falls. Sideways it moves at a steady v₀ for the whole time: x = v₀t."],[p.v0*c.t/2,"Sideways there's no acceleration, so no ½: x = v₀t."],[p.v0*p.h,"Multiply the sideways speed by the time in the air: x = v₀t."]],c.x)},
    {id:"v",label:"(c) Speed when it lands",sym:VV,unit:"m/s",ans:(p,c)=>c.v,traps:(p,c)=>clean([[p.v0+c.vy,"The two parts of the velocity are at 90° to each other, so combine them with Pythagoras, not by adding."],[c.vy,"That's only the downward part. Combine it with the sideways v₀: v = √(v₀² + v_y²)."],[p.v0,"That's only the sideways part. It also picks up speed downwards."]],c.v)}
  ],
  idea:()=>`<p>Split the motion into two parts that don't affect each other:</p>
    <ul class="plain"><li><b>Sideways:</b> nothing pushes it sideways (no air resistance), so it keeps moving at a steady v₀.</li><li><b>Downwards:</b> free fall, starting with no downward speed, exactly like a dropped stone.</li></ul>
    <p>The fall decides the time in the air. Then the sideways distance is v₀ × time. At the end, the velocity has a sideways part v₀ and a downward part gt, at 90° to each other: combine them with Pythagoras.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${TIME}${OP("=")}${SQ(FR(`2${HH}`,G9),true)}${AND}${XD}${OP("=")}${V0k}${TIME}`)+EQ(`${VYk}${OP("=")}${G9}${TIME}${AND}${VV}${OP("=")}${SQ(`${sq2(V0k)}${OP("+")}${sq2(VYk)}`)}`)+
    legend([[V0k,"sideways speed (stays the same)","m/s"],[VYk,"downward speed at landing","m/s"],[XD,"distance along the ground","m"]]),
  plug:p=>EQ(`${TIME}${OP("=")}${SQ(FR(`2${OP("×")}${p.h}`,"9.8"),true)}${AND}${XD}${OP("=")}${p.v0}${OP("×")}${TIME}`)+EQ(`${VV}${OP("=")}${SQ(`${sq2(p.v0)}${OP("+")}(9.8${TIME})<sup>2</sup>`)}`),
  solution:(p,c)=>steps([
      ["(a) The fall sets the time",CALC(`${TIME} = √(2 × ${p.h} ÷ 9.8) = <b>${fmt(c.t)} s</b>`)],
      ["(b) Sideways at a steady speed",CALC(`${XD} = ${p.v0} × ${fmt(c.t)} = <b>${fmt(c.x)} m</b>`)],
      ["(c) Combine the two speeds",CALC(`${VYk} = 9.8 × ${fmt(c.t)} = ${fmt(c.vy)} m/s &nbsp;→&nbsp; ${VV} = √(${sq2(p.v0)} + ${sq2(fmt(c.vy))}) = <b>${fmt(c.v)} m/s</b>`)]
    ])+checkline(`With energy instead: v = √(v₀² + 2gh) = √(${sq2(p.v0)} + 2 × 9.8 × ${p.h}) = ${fmt(Math.sqrt(p.v0*p.v0+2*g*p.h))} m/s ✓`)+
    finalAns(`${TIME} = ${fmt(c.t)} s, &nbsp;${XD} = ${fmt(c.x)} m, &nbsp;${VV} = ${fmt(c.v)} m/s`),
  sheet:[{name:"Thrown horizontally",eq:`${TIME}${OP("=")}${SQ(FR(`2${HH}`,G9),true)},${OP("")}${XD}${OP("=")}${V0k}${TIME}`,note:"Sideways: steady speed. Downwards: free fall. Combine speeds with Pythagoras."}],
  takeEq:()=>`${XD}${OP("=")}${V0k}${SQ(FR(`2${HH}`,G9),true)}`,
  takeaway:"Sideways and downwards are separate: the fall gives the time, the steady sideways speed gives the distance, Pythagoras gives the landing speed.",
  link:"HW 1 and HW 2 practise constant-acceleration motion; this is the same thing in two directions at once.",
  viz:viz.slider((p,c)=>({note:"Drag the time. Sideways the ball covers the same distance every second; downwards it falls further every second.",label:"Time",unit:"s",min:0,max:R3(c.t),step:0.01,value:R3(c.t),
    bars:[{label:"Sideways distance",segs:[{cls:"seg-ke",frac:x=>x/c.t}]},{label:"Distance fallen",segs:[{cls:"seg-alt",frac:x=>x*x/(c.t*c.t)}]}],read:x=>`After ${fmt(x)} s: <b>${fmt(R3(p.v0*x))} m</b> out, <b>${fmt(R3(0.5*g*x*x))} m</b> down`})),
  scene:{still:2.2,draw(K,t,p){const u=mod(t,4.2),c0=Math.sqrt(2*p.h/g),ex=118,top=34,bot=196,sc=Math.min(420/(p.v0*c0),(bot-top)/p.h);
    K.ground(bot,20,580);K.rect(20,top,ex-20,bot-top,{fill:"bg",c:"ink",w:2});K.line(20,top,ex,top,{w:3});K.vdim(36,top,bot,`${p.h} m`);
    const tt=Math.min(u/2.6,1)*c0,X=ex+8+p.v0*tt*sc,Y=top-7+0.5*g*tt*tt*sc;
    for(let k2=1;k2<8;k2++){const ti=k2*c0/8;if(ti<tt)K.circle(ex+8+p.v0*ti*sc,top-7+0.5*g*ti*ti*sc,2.6,{fill:"ink2",c:false,alpha:0.45});}
    K.circle(X,Math.min(Y,bot-7),7,{fill:"marker",c:"ink",w:1.4});
    if(u<0.4){K.arrow(ex+16,top-24,ex+56,top-24,{c:"heat",w:2.2});K.tag(`${p.v0} m/s`,ex+62,top-24,{align:"left",size:11,c:"heat"});}
    fade(K,u,3.6,4.2);}}
},

/* ===== Projectile at an angle ===== */
{
  id:"kin-angle", level:"Hard", title:"Projectile at an angle", hw:"Course topic: projectile motion",
  base:{v0:20,th:40},
  random:()=>({v0:pick([10,12,15,18,20,25]),th:pick([25,30,35,40,50,55,60])}),
  calc:p=>{const vy=p.v0*sinD(p.th),vx=p.v0*cosD(p.th),tu=vy/g;return {vx,vy,tu,H:vy*vy/(2*g),T:2*tu,R:vx*2*tu};},
  text:(p,G,T)=>`A ball is kicked from flat ground at ${G("v0",`${p.v0} m/s`)}, at ${G("th",`θ = ${p.th}°`)} above the horizontal. Ignore air resistance. Find (a) the greatest height it reaches, (b) how long it is in the air, and (c) how far away it lands (its range).`,
  terms:{},
  given:p=>[
    {k:"v0",sym:V0k,name:"launch speed",unit:"m/s",val:p.v0,why:"The full speed along the launch direction.",look:"The speed in m/s."},
    {k:"th",sym:THETA,name:"launch angle",unit:"°",val:p.th,why:"Measured up from the horizontal.",look:"The angle in degrees."}
  ],
  find:[{sym:HMAX,name:"greatest height",unit:"m",why:"Part (a)."},{sym:TFL,name:"time in the air",unit:"s",why:"Part (b)."},{sym:RG,name:"range",unit:"m",why:"Part (c). Distance along the ground."}],
  parts:[
    {id:"H",label:"(a) Greatest height",sym:HMAX,unit:"m",ans:(p,c)=>c.H,traps:(p,c)=>clean([[p.v0*p.v0/(2*g),"Only the upward part of the speed, v₀ sin θ, lifts the ball."],[c.vx*c.vx/(2*g),"The upward part uses sin θ, not cos θ."],[c.vy/(2*g),"Square the upward speed: H = (v₀ sin θ)² ÷ 2g."],radTrapK(Math.pow(p.v0*Math.sin(p.th),2)/(2*g))],c.H)},
    {id:"T",label:"(b) Time in the air",sym:TFL,unit:"s",ans:(p,c)=>c.T,traps:(p,c)=>clean([[c.tu,"That's the time to reach the top. Coming back down takes just as long: double it."],[2*c.vx/g,"Use the upward part of the speed, v₀ sin θ."],radTrapK(2*p.v0*Math.sin(p.th)/g)],c.T)},
    {id:"R",label:"(c) Range",sym:RG,unit:"m",ans:(p,c)=>c.R,traps:(p,c)=>clean([[p.v0*p.v0*sinD(p.th)/g,"It's sin 2θ (twice the angle), or work it out as R = v₀ cos θ × t_flight."],[p.v0*p.v0/g,"That's the longest possible range (at 45°). For your angle multiply by sin 2θ."],[c.vx*c.tu,"Sideways it keeps moving for the whole flight, not just to the top: R = v₀ cos θ × t_flight."],[c.vy*c.T,"Sideways distance uses the sideways speed v₀ cos θ."],radTrapK(p.v0*p.v0*Math.sin(2*p.th)/g)],c.R)}
  ],
  idea:()=>`<p>Split the launch speed into two parts, using the angle:</p>
    <ul class="plain"><li><b>Sideways:</b> v₀ cos θ. It stays the same the whole flight.</li><li><b>Upwards:</b> v₀ sin θ. Gravity slows it by 9.8 m/s every second, until it's 0 at the top, then the ball falls back.</li></ul>
    <p>The upward part behaves exactly like a ball thrown straight up: it reaches the top after t = v₀ sin θ ÷ g, at height (v₀ sin θ)² ÷ 2g, and takes as long again to come down. The range is the sideways speed × the whole time in the air.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${HMAX}${OP("=")}${FR(`(${V0k}${OP("")}sin${OP("")}${THETA})<sup>2</sup>`,`2${G9}`)}${AND}${TFL}${OP("=")}${FR(`2${V0k}${OP("")}sin${OP("")}${THETA}`,G9)}`)+EQ(`${RG}${OP("=")}${V0k}${OP("")}cos${OP("")}${THETA}${OP("·")}${TFL}${OP("=")}${FR(`${sq2(V0k)}${OP("")}sin${OP("")}2${THETA}`,G9)}`)+
    legend([[V0k,"launch speed","m/s"],[THETA,"launch angle above the horizontal","°"],[HMAX,"greatest height","m"],[TFL,"time in the air","s"],[RG,"range","m"]],"Set your calculator to degrees (DEG). These formulas are for landing at the same height you started from."),
  plug:p=>EQ(`${HMAX}${OP("=")}${FR(`(${p.v0}${OP("")}sin${OP("")}${p.th}°)<sup>2</sup>`,`2${OP("×")}9.8`)}${AND}${TFL}${OP("=")}${FR(`2${OP("×")}${p.v0}${OP("")}sin${OP("")}${p.th}°`,"9.8")}`)+EQ(`${RG}${OP("=")}${p.v0}${OP("")}cos${OP("")}${p.th}°${OP("×")}${TFL}`),
  solution:(p,c)=>steps([
      ["Split the launch speed",CALC(`up: ${p.v0} × sin ${p.th}° = ${fmt(c.vy)} m/s &nbsp;·&nbsp; sideways: ${p.v0} × cos ${p.th}° = ${fmt(c.vx)} m/s`)],
      ["(a) Up to the top",CALC(`${HMAX} = ${sq2(fmt(c.vy))} ÷ (2 × 9.8) = <b>${fmt(c.H)} m</b>`)],
      ["(b) Up and back down",CALC(`time to the top = ${fmt(c.vy)} ÷ 9.8 = ${fmt(c.tu)} s &nbsp;→&nbsp; ${TFL} = 2 × ${fmt(c.tu)} = <b>${fmt(c.T)} s</b>`)],
      ["(c) Sideways for the whole flight",CALC(`${RG} = ${fmt(c.vx)} × ${fmt(c.T)} = <b>${fmt(c.R)} m</b>`)]
    ])+checkline(`With the range formula: ${sq2(p.v0)} × sin ${2*p.th}° ÷ 9.8 = ${fmt(p.v0*p.v0*sinD(2*p.th)/g)} m ✓`)+
    finalAns(`${HMAX} = ${fmt(c.H)} m, &nbsp;${TFL} = ${fmt(c.T)} s, &nbsp;${RG} = ${fmt(c.R)} m`),
  sheet:[{name:"Projectile on flat ground",eq:`${HMAX}${OP("=")}${FR(`(${V0k}sin${THETA})<sup>2</sup>`,`2${G9}`)},${OP("")}${RG}${OP("=")}${FR(`${sq2(V0k)}sin2${THETA}`,G9)}`,note:"Up: v₀ sin θ. Sideways: v₀ cos θ. Flight time = 2v₀ sin θ ÷ g."}],
  takeEq:()=>`${RG}${OP("=")}${FR(`${sq2(V0k)}${OP("")}sin${OP("")}2${THETA}`,G9)}`,
  takeaway:"Split v₀ into v₀ sin θ (up) and v₀ cos θ (sideways). The up part gives the height and the time; the sideways part × the time gives the range.",
  link:"Try the same launch speed at 45° in “See it”: that's the angle with the longest range.",
  viz:viz.slider((p,c)=>({note:"Drag the launch angle. The range is biggest at 45°; steeper launches go higher but not as far.",label:"Launch angle",unit:"°",min:5,max:85,step:1,value:p.th,
    bars:[{label:"Range (full bar = the range at 45°)",segs:[{cls:"seg-ke",frac:x=>sinD(2*x)}]},{label:"Greatest height (full bar = straight up)",segs:[{cls:"seg-alt",frac:x=>sinD(x)*sinD(x)}]}],
    read:x=>`At ${x}°: range <b>${fmt(R3(p.v0*p.v0*sinD(2*x)/g))} m</b>, greatest height <b>${fmt(R3(Math.pow(p.v0*sinD(x),2)/(2*g)))} m</b>`})),
  scene:{still:2,draw(K,t,p){const u=mod(t,4.4),c=(function(){const vy=p.v0*sinD(p.th),vx=p.v0*cosD(p.th);return {vx,vy,T:2*vy/g,R:2*vx*vy/g,H:vy*vy/(2*g)};})(),bot=196,x0=60,sc=Math.min(480/c.R,150/c.H);
    K.ground(bot,20,580);const tt=Math.min(u/2.8,1)*c.T,X=x0+c.vx*tt*sc,Y=bot-6-(c.vy*tt-0.5*g*tt*tt)*sc;
    for(let k2=1;k2<12;k2++){const ti=k2*c.T/12;if(ti<tt)K.circle(x0+c.vx*ti*sc,bot-6-(c.vy*ti-0.5*g*ti*ti)*sc,2.6,{fill:"ink2",c:false,alpha:0.45});}
    K.circle(X,Y,7,{fill:"marker",c:"ink",w:1.4});
    if(u<0.5){const a=rad(p.th);K.arrow(x0,bot-6,x0+60*Math.cos(a),bot-6-60*Math.sin(a),{c:"heat",w:2.4});K.tag(`${p.v0} m/s`,x0+70*Math.cos(a)+10,bot-6-70*Math.sin(a),{align:"left",size:11,c:"heat"});}
    K.arc(x0,bot-6,30,-rad(p.th),0,{c:"heat",w:1.4});K.tag(`${p.th}°`,x0+48,bot-18,{size:11,c:"heat"});
    fade(K,u,3.8,4.4);}}
}
]);
})();
