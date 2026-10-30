/* Work and energy: kinetic and potential energy, work, friction, power and springs.
   Every question on this topic is one object in the list below: its numbers, text, hints,
   answer checks, "See it" panel and animation. See ADDING-QUESTIONS.md for how to add one. */
(function(){
"use strict";
const {fmt,pick,mi,up,sb,ssp,OP,FR,SQ,EQ,CALC,HALF,sq2,neg,IMPLIES,AND,PAREN,PI,OMEGA,V0,VI,VF,KE,KEI,KEF,DKE,legend,steps,checkline,finalAns,watch,calcTip,viz}=HL;
const {R3,clean,pr,sumTxt,draw}=PHYS;
const {F,mod,fadeIn,cyclist,speedLines,springScene,block,curvedArrow}=draw;

/* symbols and helpers used below */
const FFR=sb(mi("F"),"fr");
const PE=up("PE");
const H1=sb(mi("h"),"1");
const H2=sb(mi("h"),"2");
const VB=sb(mi("v"),"b");
const V2=sb(mi("v"),"2");
const G9=mi("g");
const WW=mi("W");
const PA=sb(mi("P"),"avg");
const PC=sb(mi("P"),"cruise");
const FD=sb(mi("F"),"resist");
const VC=sb(mi("v"),"cruise");

/* for the spring launcher */
const gE=9.8,KS=mi("k"),XS=mi("x"),ES=sb(mi("E"),"s"),MUS=sb(mi("μ"),"k"),DS=mi("d"),HS=mi("h"),MS=mi("m"),VS2=mi("v"),QH=sb(mi("E"),"heat"),KEafter=sb(up("KE"),"after");

PHYS.add("Work & energy",[
{
  id:"en-car-ke", topic:"Work & energy", level:"Easy", title:"Car speeding up", hw:"Like HW 1 & HW 2",
  base:{m:1000,vi:5,vf:15},
  random:()=>{const pr=pick([[5,15],[10,30],[4,12],[10,25],[6,18],[8,20]]);return {m:pick([800,1000,1200,1500]),vi:pr[0],vf:pr[1]};},
  calc:p=>{const Ki=0.5*p.m*p.vi*p.vi,Kf=0.5*p.m*p.vf*p.vf;return {Ki,Kf,dK:Kf-Ki};},
  text:(p,G,T)=>`A car with a ${T("mass","mass")} of ${G("m",`${fmt(p.m)} kg`)} speeds up from ${G("vi",`${p.vi} m/s`)} to ${G("vf",`${p.vf} m/s`)}. By how much does its ${T("ke","kinetic energy")} increase?`,
  terms:{
    mass:["Mass","How much matter something has: basically how heavy it is. Measured in kilograms (kg)."],
    ke:["Kinetic energy","The energy something has because it is moving. The heavier and the faster it is, the more kinetic energy it has. Measured in joules (J)."]
  },
  given:p=>[
    {k:"m",sym:mi("m"),name:"mass",unit:"kg",val:p.m,why:"How heavy the car is."},
    {k:"vi",sym:VI,name:"initial speed",unit:"m/s",val:p.vi,why:`The speed at the start. The small i stands for "initial".`},
    {k:"vf",sym:VF,name:"final speed",unit:"m/s",val:p.vf,why:`The speed at the end. The small f stands for "final".`}
  ],
  find:[{sym:DKE,name:"increase in kinetic energy",unit:"J",why:`Δ is the Greek letter "delta". It means "change in", which is final minus initial. Energy is measured in joules (J).`}],
  parts:[{id:"dk",label:"Increase in kinetic energy",sym:DKE,unit:"J",ans:(p,c)=>c.dK,
    traps:(p,c)=>[
      [0.5*p.m*(p.vf-p.vi)*(p.vf-p.vi),`You squared the <b>change</b> in speed. Kinetic energy uses the speed squared, so work out the energy at each speed first, then subtract.`],
      [c.Kf,`That's the car's kinetic energy at the end. Subtract the energy it already had at the start.`],
      [c.Ki,`That's the kinetic energy at the start. You need the energy at the end minus the energy at the start.`],
      [p.m*(p.vf*p.vf-p.vi*p.vi),`Almost! You forgot the ½ in ½ m v².`],
      [c.dK/1000,`Right number, but in kilojoules. The box wants joules, so multiply by 1000.`]
    ]}],
  idea:(p,c)=>{
    const r=p.vf/p.vi;
    return `<p><b>Kinetic energy</b> is the energy of motion. To find how much it increased:</p>
    <ol class="plain"><li>Work out the car's kinetic energy at the start (speed ${p.vi} m/s).</li><li>Work out its kinetic energy at the end (speed ${p.vf} m/s).</li><li>Increase = energy at the end − energy at the start.</li></ol>
    <div class="watch"><b>Watch out:</b> kinetic energy depends on the speed <b>squared</b> (speed × speed). Here the speed goes up ${fmt(r)} times, so the energy goes up ${fmt(r*r)} times. That's why you can't just use the change in speed.</div>
    <p class="small">Try the question again. The next hint gives you the formula for kinetic energy.</p>`;
  },
  formula:()=>EQ(`${KE}${OP("=")}${HALF}${mi("m")}${sq2(mi("v"))}`)+EQ(`${DKE}${OP("=")}${KEF}${OP("−")}${KEI}`)+
    legend([[KE,"kinetic energy","J"],[mi("m"),"mass","kg"],[mi("v"),"speed","m/s"],[up("Δ"),"“change in” = final − initial",""]],
    `${HALF} ${mi("m")}${sq2(mi("v"))} means ½ × ${mi("m")} × ${mi("v")} × ${mi("v")}. Only the speed is squared, not the mass.`),
  plug:(p,c)=>EQ(`${KEI}${OP("=")}${HALF}${OP("×")}${fmt(p.m)}${OP("×")}${sq2(p.vi)}`)+EQ(`${KEF}${OP("=")}${HALF}${OP("×")}${fmt(p.m)}${OP("×")}${sq2(p.vf)}`)+EQ(`${DKE}${OP("=")}${KEF}${OP("−")}${KEI}`)+
    `<p>Square the speed first (${p.vi}² = ${p.vi} × ${p.vi}), then multiply by ½ and by the mass. Do the same for ${p.vf} m/s, then subtract.</p>`+
    calcTip(`0.5*${p.m}*${p.vf}^2 - 0.5*${p.m}*${p.vi}^2`),
  solution:(p,c)=>steps([
      ["Write down what you know",`${mi("m")} = ${fmt(p.m)} kg, &nbsp;${VI} = ${p.vi} m/s, &nbsp;${VF} = ${p.vf} m/s. &nbsp;Find ${DKE}.`],
      ["Kinetic energy at the start",CALC(`${KEI} = ½ × ${fmt(p.m)} × ${sq2(p.vi)} = ½ × ${fmt(p.m)} × ${p.vi*p.vi} = <b>${fmt(c.Ki)} J</b>`)],
      ["Kinetic energy at the end",CALC(`${KEF} = ½ × ${fmt(p.m)} × ${sq2(p.vf)} = ½ × ${fmt(p.m)} × ${p.vf*p.vf} = <b>${fmt(c.Kf)} J</b>`)],
      ["Subtract: end minus start",CALC(`${DKE} = ${fmt(c.Kf)} − ${fmt(c.Ki)} = <b>${fmt(c.dK)} J</b>`)+`<p class="small">That's ${fmt(c.dK/1000)} kJ (kilojoules).</p>`]
    ])+checkline(`Units: kg × (m/s)² = kg·m²/s², and that is exactly a joule (J). ✓`)+
    watch(`½ × ${fmt(p.m)} × (${p.vf} − ${p.vi})² = ${fmt(0.5*p.m*(p.vf-p.vi)*(p.vf-p.vi))} J is wrong, because ${p.vf}² − ${p.vi}² is not the same as (${p.vf} − ${p.vi})².`)+
    finalAns(`${DKE} = ${fmt(c.dK)} J`),
  sheet:[
    {name:"Kinetic energy",eq:`${KE}${OP("=")}${HALF}${mi("m")}${sq2(mi("v"))}`,note:"Energy of motion, in joules (J)."},
    {name:"Change in kinetic energy",eq:`${DKE}${OP("=")}${HALF}${mi("m")}${ssp(mi("v"),"f","2")}${OP("−")}${HALF}${mi("m")}${ssp(mi("v"),"i","2")}`,note:"Speeds must be in m/s. To convert km/h to m/s, divide by 3.6."}
  ],
  takeEq:()=>`${DKE}${OP("=")}${HALF}${mi("m")}${ssp(mi("v"),"f","2")}${OP("−")}${HALF}${mi("m")}${ssp(mi("v"),"i","2")}`,
  takeaway:"Find the kinetic energy at each speed, then subtract. Never square the change in speed.",
  link:"HW 1, task 2(a) (the truck) and HW 2, task 1 use exactly this. In the truck problem the speeds are in km/h, so divide them by 3.6 to get m/s before you square them.",
  visual:"ke",
  scene:{still:2.5,draw(K,t,p){
  const y=184,u=Math.min(mod(t,5.4),4),x=60+45*u+18.75*u*u;
  K.ground(y,0,600);
  K.tag(`${p.vi} m/s`,60,y-70,{size:11});K.line(60,y-62,60,y+2,{c:"ink2",w:1.2,dash:[4,4]});
  K.tag(`${p.vf} m/s`,540,y-70,{size:11});K.line(540,y-62,540,y+2,{c:"ink2",w:1.2,dash:[4,4]});
  speedLines(K,x-40,y-20,3,10+u*7,0.5);
  K.car(x,y,{ang:x/9});K.tag(`${F(p.m)} kg`,x,y-58,{size:11});
  draw.loopFade(K,t,5.4);
}}
},

{
  id:"en-skate", topic:"Work & energy", level:"Easy", title:"Skateboard in a bowl", hw:"Course topic: mechanical energy conservation",
  base:{m:50,h1:10,h2:3.6},
  random:()=>{const r=pick([[10,3.6],[10,7.5],[6.4,4.8],[3.6,2.7],[2.5,0.9],[14.4,4.4]]);return {m:pick([40,50,60,70]),h1:r[0],h2:r[1]};},
  calc:p=>{const g=9.8,dh=R3(p.h1-p.h2);return {g,PE:p.m*g*p.h1,v1:Math.sqrt(2*g*p.h1),dh,v2:Math.sqrt(2*g*dh)};},
  text:(p,G,T)=>`A ${G("m",`${p.m} kg`)} skateboarder ${G("v0","starts from rest")} at the top of a ${T("fric","frictionless")} ramp, ${G("h1",`${p.h1} m`)} above the ground. She rolls down to ground level and then up a second ramp on the other side. Use ${T("g","g")} = ${G("g","9.8 m/s²")}. (a) What is her ${T("pe","potential energy")} at the top, measured from the ground? (b) How fast is she going at the bottom? (c) How fast is she going when she is ${G("h2",`${p.h2} m`)} up the second ramp?`,
  terms:{
    fric:["Frictionless","No friction, so no energy is lost as heat. The total energy stays the same the whole time."],
    g:["g","The acceleration due to gravity. Anything falling freely gets 9.8 m/s faster every second."],
    pe:["Potential energy","Energy stored because of height. The higher and heavier something is, the more it has. Measured in joules (J)."]
  },
  given:p=>[
    {k:"m",sym:mi("m"),name:"mass",unit:"kg",val:p.m,why:"The skateboarder's mass."},
    {k:"v0",sym:V0,name:"starting speed",unit:"m/s",val:0,why:`"Starts from rest" means she isn't moving at the top, so this is 0.`,look:`Read the start of the question: what speed does "starts from rest" mean?`},
    {k:"h1",sym:H1,name:"starting height",unit:"m",val:p.h1,why:"How high the top of the first ramp is above the ground."},
    {k:"g",sym:G9,name:"gravity",unit:"m/s²",val:9.8,why:"The question gives this value. Always use the one the question gives."},
    {k:"h2",sym:H2,name:"height on the second ramp",unit:"m",val:p.h2,why:"Her height in part (c).",look:"It's the height in part (c)."}
  ],
  find:[
    {sym:PE,name:"potential energy at the top",unit:"J",why:"Part (a)."},
    {sym:VB,name:"speed at the bottom",unit:"m/s",why:"Part (b). The small b means bottom."},
    {sym:V2,name:"speed at height h₂",unit:"m/s",why:"Part (c)."}
  ],
  parts:[
    {id:"PE",label:"(a) Potential energy at the top",sym:PE,unit:"J",ans:(p,c)=>c.PE,traps:(p,c)=>[
      [p.m*p.h1,"You forgot g. Potential energy is m × g × h."],
      [p.m*c.g,"You forgot the height: PE = m × g × h."],
      [c.g*p.h1,"You forgot the mass: PE = m × g × h."],
      [0.5*c.PE,"No ½ here. The ½ belongs to kinetic energy (½mv²). Potential energy is mgh."]
    ]},
    {id:"vb",label:"(b) Speed at the bottom",sym:VB,unit:"m/s",ans:(p,c)=>c.v1,traps:(p,c)=>[
      [Math.sqrt(c.g*p.h1),"You lost the 2. From mgh = ½mv², multiply both sides by 2: v² = 2gh."],
      [2*c.g*p.h1,"That's v². Take the square root to get v."],
      [Math.sqrt(2*c.PE),"You kept the mass in. It cancels: mgh = ½mv² gives v = √(2gh), the same for any mass."],
      [c.g*p.h1,"Set the energies equal, mgh = ½mv², then solve for v: v = √(2gh)."],
      [Math.sqrt(2*p.h1),"You forgot g: v = √(2gh)."]
    ]},
    {id:"v2",label:"(c) Speed on the second ramp",sym:V2,unit:"m/s",ans:(p,c)=>c.v2,traps:(p,c)=>[
      [Math.sqrt(2*c.g*p.h2),`That uses her height ${p.h2} m. What matters is how far she has dropped from the start: h₁ − h₂.`],
      [c.v1-Math.sqrt(2*c.g*p.h2),"You can't subtract speeds like that. Use energy: ½mv² = mg(h₁ − h₂)."],
      [Math.sqrt(2*c.g*(p.h1+p.h2)),"Subtract the heights, don't add them: she has dropped h₁ − h₂ from the start."],
      [c.v1,"That's her speed at the bottom. Going up the second ramp she slows down."],
      [Math.sqrt(c.g*c.dh),"You lost the 2: v = √(2g(h₁ − h₂))."]
    ]}
  ],
  idea:(p,c)=>`<p>Energy can change form, but with no friction the <b>total stays the same</b>. Think of it as two buckets that pour into each other:</p>
    <ul class="plain">
      <li><b>Height energy</b> (potential): depends on mass, gravity and height.</li>
      <li><b>Motion energy</b> (kinetic): depends on mass and speed.</li>
    </ul>
    <p><b>(a)</b> At the top she isn't moving, so all her energy is height energy.</p>
    <p><b>(b)</b> At the bottom her height is 0, so all of that energy has become motion energy. Set the two equal and solve for the speed.</p>
    <p><b>(c)</b> On the second ramp she is still ${p.h2} m up, so only the energy from dropping ${p.h1} − ${p.h2} m has turned into motion.</p>
    <p>Notice that the mass appears on both sides, so it cancels: the speed doesn't depend on how heavy she is.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${PE}${OP("=")}${mi("m")}${G9}${mi("h")}${AND}${KE}${OP("=")}${HALF}${mi("m")}${sq2(mi("v"))}`)+
    EQ(`${mi("m")}${G9}${H1}${OP("=")}${HALF}${mi("m")}${sq2(VB)}${IMPLIES}${VB}${OP("=")}${SQ(`2${G9}${H1}`)}`)+
    EQ(`${mi("m")}${G9}${H1}${OP("=")}${mi("m")}${G9}${H2}${OP("+")}${HALF}${mi("m")}${sq2(V2)}`)+
    EQ(`${V2}${OP("=")}${SQ(`2${G9}(${H1}${OP("−")}${H2})`)}`)+
    legend([[PE,"potential energy","J"],[KE,"kinetic energy","J"],[mi("m"),"mass","kg"],[G9,"gravity","m/s²"],[mi("h"),"height above the ground","m"],[mi("v"),"speed","m/s"]],
    `Each line says: total energy at the start = total energy now. To get ${VB} from the second line: divide both sides by ${mi("m")} (it cancels), multiply by 2, then take the square root.`),
  plug:(p,c)=>EQ(`${PE}${OP("=")}${p.m}${OP("×")}9.8${OP("×")}${p.h1}`)+
    EQ(`${VB}${OP("=")}${SQ(`2${OP("×")}9.8${OP("×")}${p.h1}`)}`)+
    EQ(`${V2}${OP("=")}${SQ(`2${OP("×")}9.8${OP("×")}(${p.h1}${OP("−")}${p.h2})`)}`)+
    `<p>Work inside the square root first, then take the root.</p>`+calcTip(`sqrt(2*9.8*${p.h1})`),
  solution:(p,c)=>steps([
      ["Write down what you know",`${mi("m")} = ${p.m} kg, &nbsp;${V0} = 0, &nbsp;${H1} = ${p.h1} m, &nbsp;${G9} = 9.8 m/s², &nbsp;${H2} = ${p.h2} m.`],
      ["(a) Potential energy at the top",CALC(`${PE} = ${mi("m")}${G9}${H1} = ${p.m} × 9.8 × ${p.h1} = <b>${fmt(c.PE)} J</b>`)],
      ["(b) All of it becomes kinetic energy",CALC(`½${mi("m")}${sq2(VB)} = ${mi("m")}${G9}${H1} &nbsp;→&nbsp; ${VB} = √(2 × 9.8 × ${p.h1}) = √${fmt(2*c.g*p.h1)} = <b>${fmt(c.v1)} m/s</b>`)+`<p class="small">The mass cancelled, so it doesn't matter how heavy she is.</p>`],
      ["(c) How far has she dropped?",CALC(`${H1} − ${H2} = ${p.h1} − ${p.h2} = ${fmt(c.dh)} m`)],
      ["Same idea with that drop",CALC(`${V2} = √(2 × 9.8 × ${fmt(c.dh)}) = √${fmt(2*c.g*c.dh)} = <b>${fmt(c.v2)} m/s</b>`)]
    ])+checkline(`Energy check: at the bottom her kinetic energy is ½ × ${p.m} × ${sq2(fmt(c.v1))} = ${fmt(0.5*p.m*c.v1*c.v1)} J, the same as her potential energy at the top ✓<br>Sense check: ${fmt(c.v2)} m/s is less than ${fmt(c.v1)} m/s, because she has climbed back up a bit ✓`)+
    finalAns(`${PE} = ${fmt(c.PE)} J, &nbsp;${VB} = ${fmt(c.v1)} m/s, &nbsp;${V2} = ${fmt(c.v2)} m/s`),
  sheet:[
    {name:"Potential energy",eq:`${PE}${OP("=")}${mi("m")}${G9}${mi("h")}`,note:"Energy stored by height."},
    {name:"Energy conservation (no friction)",eq:`${mi("m")}${G9}${H1}${OP("+")}${HALF}${mi("m")}${sq2(sb(mi("v"),"1"))}${OP("=")}${mi("m")}${G9}${H2}${OP("+")}${HALF}${mi("m")}${sq2(sb(mi("v"),"2"))}`,note:"Total energy at one point = total energy at another."},
    {name:"Speed after a drop h",eq:`${mi("v")}${OP("=")}${SQ(`2${G9}${mi("h")}`)}`,note:"Starting from rest. The mass cancels."}
  ],
  takeEq:()=>`${mi("m")}${G9}${mi("h")}${OP("=")}${HALF}${mi("m")}${sq2(mi("v"))}${IMPLIES}${mi("v")}${OP("=")}${SQ(`2${G9}${mi("h")}`)}`,
  takeaway:"With no friction, height energy and motion energy swap but the total stays the same. Speed depends on how far you've dropped, not on your mass.",
  link:"No homework uses this yet, but energy conservation is a core exam topic. HW 3, task 3 uses the same idea for a spring: energy moves between potential and kinetic while the total stays the same.",
  viz:viz.slider((p,c)=>({
    note:"Drag her height. The energy bar never changes length: height energy just turns into motion energy and back.",
    label:"Her height",unit:"m",min:0,max:p.h1,step:0.1,value:p.h2,
    bars:[{label:"Her energy",segs:[{cls:"seg-alt",name:"potential (height)",frac:x=>x/p.h1},{cls:"seg-ke",name:"kinetic (motion)",frac:x=>(p.h1-x)/p.h1}]}],
    read:x=>{const d=Math.max(0,R3(p.h1-x));return `At ${fmt(x)} m: ${PE} = ${fmt(p.m*c.g*x)} J, ${KE} = ${fmt(p.m*c.g*d)} J, speed = <b>${fmt(Math.sqrt(2*c.g*d))} m/s</b>`;}
  })),
  scene:{still:0.6,draw(K,t,p){
  const top=40,bot=186,cx=300,half=240,Y=x=>bot-(bot-top)*Math.pow((x-cx)/half,2),dY=x=>-(bot-top)*2*(x-cx)/(half*half);
  const pts=[];for(let x=cx-half;x<=cx+half;x+=6)pts.push([x,Y(x)]);K.poly(pts.concat([[cx+half,206],[cx-half,206]]),{fill:"bg",c:false,close:true});K.poly(pts,{c:"ink",w:3});
  const yh2=bot-(bot-top)*(p.h2/p.h1),xh2=cx+half*Math.sqrt(p.h2/p.h1);
  K.line(30,top,cx-half,top,{c:"ink2",w:1.2,dash:[4,4]});K.tag(`h₁ = ${p.h1} m`,34,top-14,{align:"left",size:11});
  K.line(xh2,yh2,592,yh2,{c:"heat",w:1.2,dash:[4,4]});K.tag(`h₂ = ${p.h2} m`,592,yh2-14,{align:"right",size:11,c:"heat"});K.circle(xh2,yh2,4,{fill:"heat",c:false});
  K.line(20,bot,580,bot,{c:"rule",w:1});
  const x=cx-half*Math.cos(2*Math.PI*t/4.4),y=Y(x),a=Math.atan(dY(x)),nx=Math.sin(a),ny=-Math.cos(a),bx=x+nx*4,by=y+ny*4;
  K.line(bx-11*Math.cos(a),by-11*Math.sin(a),bx+11*Math.cos(a),by+11*Math.sin(a),{w:3.2});
  K.line(bx+nx*2,by+ny*2,bx+nx*24,by+ny*24,{w:2.4});K.circle(bx+nx*31,by+ny*31,6,{fill:"card",w:2});
  K.tag(`${p.m} kg`,cx,24,{size:11});
}}
},

{
  id:"en-push-friction", topic:"Work & energy", level:"Medium", title:"Pushing with friction", hw:"Like HW 2, task 1",
  base:{m:20,F:60,d:5,vi:1,vf:3},
  random:()=>{const r=pick([[20,60,5,1,3],[25,50,6,1,3],[10,40,5,2,4],[20,80,4,1,4],[30,90,5,2,3],[15,45,8,1,3]]);return {m:r[0],F:r[1],d:r[2],vi:r[3],vf:r[4]};},
  calc:p=>{const W=p.F*p.d,Ki=0.5*p.m*p.vi*p.vi,Kf=0.5*p.m*p.vf*p.vf,dK=Kf-Ki,Q=W-dK;return {W,Ki,Kf,dK,Q,Ff:Q/p.d};},
  text:(p,G,T)=>`A worker pushes a ${G("m",`${p.m} kg`)} box across a rough floor with a constant horizontal ${T("force","force")} of ${G("F",`${p.F} N`)}. While the box moves ${G("d",`${p.d} m`)}, its speed increases from ${G("vi",`${p.vi} m/s`)} to ${G("vf",`${p.vf} m/s`)}. (a) How much ${T("work","work")} does the worker do? (b) How much energy does ${T("fric","friction")} turn into heat? (c) How big is the friction force?`,
  terms:{
    force:["Force","A push or a pull. Measured in newtons (N)."],
    work:["Work","The energy you transfer by pushing something over a distance. Work = force × distance. Measured in joules (J)."],
    fric:["Friction","A force between two surfaces that rub against each other. It always acts against the motion, and it turns kinetic energy into heat."]
  },
  given:p=>[
    {k:"m",sym:mi("m"),name:"mass",unit:"kg",val:p.m,why:"How heavy the box is."},
    {k:"F",sym:mi("F"),name:"pushing force",unit:"N",val:p.F,why:"How hard the worker pushes."},
    {k:"d",sym:mi("d"),name:"distance",unit:"m",val:p.d,why:"How far the box moves while being pushed."},
    {k:"vi",sym:VI,name:"initial speed",unit:"m/s",val:p.vi,why:"The speed at the start (i for initial).",look:"It's the first speed in the question."},
    {k:"vf",sym:VF,name:"final speed",unit:"m/s",val:p.vf,why:"The speed at the end (f for final).",look:"It's the second speed in the question."}
  ],
  find:[
    {sym:mi("W"),name:"work done by the worker",unit:"J",why:"Part (a)."},
    {sym:mi("Q"),name:"heat from friction",unit:"J",why:"Part (b). Physicists often use Q for heat."},
    {sym:FFR,name:"friction force",unit:"N",why:"Part (c). The small fr stands for friction."}
  ],
  parts:[
    {id:"W",label:"(a) Work done by the worker",sym:mi("W"),unit:"J",ans:(p,c)=>c.W,
      traps:(p,c)=>[
        [p.F/p.d,"Work is force × distance, so multiply."],
        [p.m*9.8*p.d,"That uses the box's weight (m × g). The worker's work uses the worker's push F."],
        [c.dK,"That's the kinetic energy the box gained. The work done by the worker is force × distance."]
      ]},
    {id:"Q",label:"(b) Heat from friction",sym:mi("Q"),unit:"J",ans:(p,c)=>c.Q,
      traps:(p,c)=>clean([
        [c.dK,"That's the kinetic energy the box gained. The heat is the rest of the work: Q = W − ΔKE."],
        [c.W,"That's all of the work. Part of it went into speeding up the box, so subtract the kinetic energy gained."],
        [c.W-c.Kf,`You forgot that the box already had kinetic energy at the start (it was moving at ${p.vi} m/s). Use ΔKE = ½mv<sub>f</sub>² − ½mv<sub>i</sub>².`],
        [c.W-0.5*p.m*(p.vf-p.vi)*(p.vf-p.vi),"You squared the change in speed, a classic trap. Use ½mv<sub>f</sub>² − ½mv<sub>i</sub>²."],
        [c.W+c.dK,"Add or subtract? The work splits into kinetic energy and heat, so heat = W − ΔKE."]
      ],c.Q)},
    {id:"Ff",label:"(c) Friction force",sym:FFR,unit:"N",ans:(p,c)=>c.Ff,
      traps:(p,c)=>[
        [c.Q*p.d,"Divide by the distance, don't multiply: F<sub>fr</sub> = Q ÷ d."],
        [p.F,"That's the worker's push. The friction force comes from the heat: F<sub>fr</sub> = Q ÷ d."],
        [c.dK/p.d,"Use the heat Q, not the kinetic energy: F<sub>fr</sub> = Q ÷ d."]
      ]}
  ],
  idea:(p,c)=>`<p>Think of energy like money. The worker <b>pays in</b> energy by pushing: that's the work. The energy goes to two places:</p>
    <ol class="plain"><li>Making the box faster: the kinetic energy gained.</li><li>Heat, because friction rubs the box against the floor.</li></ol>
    <p>So <b>work = kinetic energy gained + heat</b>. Once you know the work and the kinetic energy gained, the heat is whatever is left over.</p>
    <p>For (c): friction made that heat over the ${p.d} m. Just like work, heat from friction = friction force × distance.</p>
    <div class="watch"><b>Remember the easier car question:</b> the box was already moving at the start, so the kinetic energy gained is the energy at the end minus the energy at the start.</div>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${mi("W")}${OP("=")}${mi("F")}${mi("d")}`)+
    EQ(`${DKE}${OP("=")}${HALF}${mi("m")}${ssp(mi("v"),"f","2")}${OP("−")}${HALF}${mi("m")}${ssp(mi("v"),"i","2")}`)+
    EQ(`${mi("W")}${OP("=")}${DKE}${OP("+")}${mi("Q")}${IMPLIES}${mi("Q")}${OP("=")}${mi("W")}${OP("−")}${DKE}`)+
    EQ(`${mi("Q")}${OP("=")}${FFR}${mi("d")}${IMPLIES}${FFR}${OP("=")}${FR(mi("Q"),mi("d"))}`)+
    legend([[mi("W"),"work done by the worker","J"],[mi("F"),"pushing force","N"],[mi("d"),"distance","m"],[DKE,"kinetic energy gained","J"],[mi("Q"),"heat from friction","J"],[FFR,"friction force","N"]],
    `${mi("W")} = ${DKE} + ${mi("Q")} is energy conservation: every joule the worker puts in ends up either as speed or as heat.`),
  plug:(p,c)=>EQ(`${mi("W")}${OP("=")}${p.F}${OP("×")}${p.d}`)+
    EQ(`${DKE}${OP("=")}${HALF}${OP("×")}${p.m}${OP("×")}${sq2(p.vf)}${OP("−")}${HALF}${OP("×")}${p.m}${OP("×")}${sq2(p.vi)}`)+
    EQ(`${mi("Q")}${OP("=")}${mi("W")}${OP("−")}${DKE}`)+
    EQ(`${FFR}${OP("=")}${FR(mi("Q"),p.d)}`)+
    `<p>Do them in order. Each answer feeds into the next one.</p>`+
    calcTip(`${p.F}*${p.d} - (0.5*${p.m}*${p.vf}^2 - 0.5*${p.m}*${p.vi}^2)`," That one line gives you the heat Q."),
  solution:(p,c)=>{const acc=(p.vf*p.vf-p.vi*p.vi)/(2*p.d);return steps([
      ["Write down what you know",`${mi("m")} = ${p.m} kg, &nbsp;${mi("F")} = ${p.F} N, &nbsp;${mi("d")} = ${p.d} m, &nbsp;${VI} = ${p.vi} m/s, &nbsp;${VF} = ${p.vf} m/s.`],
      ["(a) Work = force × distance",CALC(`${mi("W")} = ${p.F} × ${p.d} = <b>${fmt(c.W)} J</b>`)],
      ["Kinetic energy gained",CALC(`${DKE} = ½ × ${p.m} × ${sq2(p.vf)} − ½ × ${p.m} × ${sq2(p.vi)} = ${fmt(c.Kf)} − ${fmt(c.Ki)} = ${fmt(c.dK)} J`)],
      ["(b) Heat is what's left",CALC(`${mi("Q")} = ${mi("W")} − ${DKE} = ${fmt(c.W)} − ${fmt(c.dK)} = <b>${fmt(c.Q)} J</b>`)],
      ["(c) Friction force",CALC(`${FFR} = ${mi("Q")} ÷ ${mi("d")} = ${fmt(c.Q)} ÷ ${p.d} = <b>${fmt(c.Ff)} N</b>`)]
    ])+checkline(`Units: N × m = J, and J ÷ m = N ✓<br>Sense check: friction (${fmt(c.Ff)} N) is smaller than the push (${p.F} N). That fits, because the box speeds up.<br>Another way, with Newton's second law: the box's acceleration is (${sq2(p.vf)} − ${sq2(p.vi)}) ÷ (2 × ${p.d}) = ${fmt(acc)} m/s², so the net force is ${p.m} × ${fmt(acc)} = ${fmt(p.m*acc)} N, and friction = ${p.F} − ${fmt(p.m*acc)} = ${fmt(c.Ff)} N ✓`)+
    finalAns(`${mi("W")} = ${fmt(c.W)} J, &nbsp;${mi("Q")} = ${fmt(c.Q)} J, &nbsp;${FFR} = ${fmt(c.Ff)} N`);},
  sheet:[
    {name:"Work",eq:`${mi("W")}${OP("=")}${mi("F")}${mi("d")}`,note:"Force × distance, in joules (J)."},
    {name:"Energy bookkeeping",eq:`${mi("W")}${OP("=")}${DKE}${OP("+")}${mi("Q")}`,note:"Energy in = kinetic energy gained + heat."},
    {name:"Heat from friction",eq:`${mi("Q")}${OP("=")}${FFR}${mi("d")}`,note:"Friction force × distance."}
  ],
  takeEq:()=>`${mi("W")}${OP("=")}${DKE}${OP("+")}${mi("Q")}`,
  takeaway:"Energy in = kinetic energy gained + heat. The heat from friction is the friction force times the distance.",
  link:"HW 2, task 1 is this exact bookkeeping. There the box slows down, so ΔKE is negative and the heat Q = W − ΔKE comes out bigger than the work. Same formula, just keep the minus sign.",
  visual:"split",
  scene:{still:2.2,draw(K,t,p){
  const y=170,u=Math.min(mod(t,6),4.4),m=u/4.4,xb=150+300*(0.35*m+0.65*m*m);
  K.ground(y,20,580);for(let x=26;x<580;x+=9)K.circle(x,y-1.2,1,{fill:"ink2",c:false,alpha:0.5});
  K.dim(150,450,y+30,`${p.d} m`);
  block(K,xb,y,62,50,`${p.m} kg`);
  K.person(xb-56,y,{lean:10,arms:[[22,-34],[22,-28]]});
  K.arrow(xb-30,y-66,xb+18,y-66,{c:"blue",w:2.6});K.tag(`${p.F} N`,xb+22,y-66,{align:"left",size:11});
  K.arrow(xb+26,y+9,xb-14,y+9,{c:"heat",w:2.2});
  for(let i=0;i<3;i++){const hx=xb-20+i*18,ph=mod(t*1.6+i*0.33,1);K.poly([0,1,2,3,4,5].map(k=>[hx+3*Math.sin(k*1.4+t*6),y-4-ph*26-k*3]),{c:"heat",w:1.3,alpha:0.7*(1-ph)});}
  K.tag(`${p.vi} → ${p.vf} m/s`,520,40,{size:11});
  draw.loopFade(K,t,6);
}}
},

{
  id:"en-power", topic:"Work & energy", level:"Medium", title:"Power of a car", hw:"Course topic: power (with work and energy)",
  base:{m:1200,v:20,t:8,vc:25,Fd:600},
  random:()=>{const r=pick([[1200,20,8,25,600],[1000,15,6,30,500],[1500,20,10,20,800],[800,12,4,25,400],[2000,15,5,20,1000],[1100,18,9,30,450]]);return {m:r[0],v:r[1],t:r[2],vc:r[3],Fd:r[4]};},
  calc:p=>{const W=0.5*p.m*p.v*p.v;return {W,P:W/p.t,Pc:p.Fd*p.vc,F:p.m*p.v/p.t};},
  text:(p,G,T)=>`A ${G("m",`${fmt(p.m)} kg`)} car ${G("v0","starts from rest")} and speeds up to ${G("v",`${p.v} m/s`)} in ${G("t",`${p.t} s`)} on a flat road. Ignore friction and air resistance for this part. (a) How much ${T("work","work")} does the engine do? (b) What is the engine's average ${T("power","power")}? (c) Later the car cruises at a ${T("steady","steady")} ${G("vc",`${p.vc} m/s`)}, while air resistance and friction together push back with ${G("Fd",`${p.Fd} N`)}. What power must the engine deliver now?`,
  terms:{
    work:["Work","Energy transferred by a force. Here all of the engine's work goes into the car's kinetic energy."],
    power:["Power","How fast work is done: joules per second. 1 watt (W) = 1 J/s, and 1 kW = 1000 W."],
    steady:["Steady speed","Not speeding up or slowing down. Then the forces on the car balance (Newton's first law), so the engine pushes forward exactly as hard as the resistance pushes back."]
  },
  given:p=>[
    {k:"m",sym:mi("m"),name:"mass",unit:"kg",val:p.m,why:"The car's mass."},
    {k:"v0",sym:V0,name:"starting speed",unit:"m/s",val:0,why:`"Starts from rest" means 0.`,look:`What speed does "starts from rest" mean?`},
    {k:"v",sym:mi("v"),name:"speed after speeding up",unit:"m/s",val:p.v,why:"The speed at the end of part (a).",look:"It's the first speed in the question."},
    {k:"t",sym:mi("t"),name:"time to speed up",unit:"s",val:p.t,why:"How long the speeding up takes."},
    {k:"vc",sym:VC,name:"cruising speed",unit:"m/s",val:p.vc,why:"The steady speed in part (c).",look:"It's the speed in part (c)."},
    {k:"Fd",sym:FD,name:"resistance force",unit:"N",val:p.Fd,why:"Air resistance plus friction, pushing backwards in part (c)."}
  ],
  find:[
    {sym:WW,name:"work done by the engine",unit:"J",why:"Part (a)."},
    {sym:PA,name:"average power while speeding up",unit:"W",why:"Part (b)."},
    {sym:PC,name:"power while cruising",unit:"W",why:"Part (c)."}
  ],
  parts:[
    {id:"W",label:"(a) Work done by the engine",sym:WW,unit:"J",ans:(p,c)=>c.W,traps:(p,c)=>clean([
      [p.m*p.v*p.v,"You're missing the ½: kinetic energy is ½mv²."],
      [0.5*p.m*p.v,"Square the speed: ½ × m × v × v."],
      [c.W/1000,"Right number, but in kJ. The box wants joules: multiply by 1000."],
      [c.F,"That's the average force (m × a). Work is the kinetic energy gained, ½mv²."]
    ],c.W)},
    {id:"P",label:"(b) Average power",sym:PA,unit:"W",ans:(p,c)=>c.P,traps:(p,c)=>clean([
      [c.W*p.t,"Divide by the time, don't multiply: P = W ÷ t."],
      [c.W,"That's the work. Power is work per second: W ÷ t."],
      [c.P/1000,"Right number, but in kW. The box wants watts: multiply by 1000."],
      [c.F,"That's the force (m × a). Power is work ÷ time."],
      [2*c.P,"That's the power at the very end (force × final speed). The average is work ÷ time."]
    ],c.P)},
    {id:"Pc",label:"(c) Power while cruising",sym:PC,unit:"W",ans:(p,c)=>c.Pc,traps:(p,c)=>clean([
      [p.Fd/p.vc,"Multiply force by speed, don't divide: P = F × v."],
      [c.Pc/1000,"Right number, but in kW. The box wants watts."],
      [p.Fd,"That's the force. Power = force × speed."],
      [0.5*p.Fd*p.vc,"No ½ here: P = F × v."]
    ],c.Pc)}
  ],
  idea:(p,c)=>`<p><b>Power</b> is how fast work is done: the number of joules delivered every second.</p>
    <ul class="plain">
      <li><b>(a)</b> With no friction, all of the engine's work goes into kinetic energy. The car starts at rest, so the work equals its kinetic energy at the end.</li>
      <li><b>(b)</b> That energy was delivered over ${p.t} seconds. Divide to get joules per second.</li>
      <li><b>(c)</b> At a steady speed nothing speeds up, so the engine's push exactly balances the ${p.Fd} N resistance. Every second the car moves ${p.vc} metres against that force. Work per second = force × distance per second = force × speed.</li>
    </ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${WW}${OP("=")}${HALF}${mi("m")}${sq2(mi("v"))}${OP("−")}${HALF}${mi("m")}${sq2(V0)}`)+
    EQ(`${PA}${OP("=")}${FR(WW,mi("t"))}${AND}${PC}${OP("=")}${mi("F")}${mi("v")}`)+
    legend([[WW,"work","J"],[mi("m"),"mass","kg"],[mi("v"),"speed","m/s"],[mi("t"),"time","s"],[mi("P"),"power","W"],[mi("F"),"force the engine pushes with","N"]],
    `In (c) the engine's force equals the resistance, because at a steady speed the forces balance. Watts are joules per second.`),
  plug:(p,c)=>EQ(`${WW}${OP("=")}${HALF}${OP("×")}${fmt(p.m)}${OP("×")}${sq2(p.v)}`)+
    EQ(`${PA}${OP("=")}${FR(WW,p.t)}${AND}${PC}${OP("=")}${p.Fd}${OP("×")}${p.vc}`)+
    `<p>Square the speed first, then multiply. Use your ${WW} from (a) in (b).</p>`+calcTip(`0.5*${p.m}*${p.v}^2`),
  solution:(p,c)=>steps([
      ["Write down what you know",`${mi("m")} = ${fmt(p.m)} kg, &nbsp;${V0} = 0, &nbsp;${mi("v")} = ${p.v} m/s, &nbsp;${mi("t")} = ${p.t} s, &nbsp;${VC} = ${p.vc} m/s, &nbsp;${FD} = ${p.Fd} N.`],
      ["(a) Work = kinetic energy gained",CALC(`${WW} = ½ × ${fmt(p.m)} × ${sq2(p.v)} − 0 = <b>${fmt(c.W)} J</b>`)],
      ["(b) Average power",CALC(`${PA} = ${fmt(c.W)} ÷ ${p.t} = <b>${fmt(c.P)} W</b>`)+`<p class="small">That's ${fmt(c.P/1000)} kW.</p>`],
      ["(c) Steady speed: engine force = resistance",CALC(`${PC} = ${mi("F")} × ${mi("v")} = ${p.Fd} × ${p.vc} = <b>${fmt(c.Pc)} W</b>`)+`<p class="small">That's ${fmt(c.Pc/1000)} kW.</p>`]
    ])+checkline(`Another way to do (b): the acceleration is ${p.v} ÷ ${p.t} = ${fmt(p.v/p.t)} m/s², so the force is ${fmt(p.m)} × ${fmt(p.v/p.t)} = ${fmt(c.F)} N. The average speed is ${p.v} ÷ 2 = ${fmt(p.v/2)} m/s, and force × average speed = ${fmt(c.F*p.v/2)} W ✓<br>Units: J ÷ s = W, and N × m/s = J/s = W ✓`)+
    finalAns(`${WW} = ${fmt(c.W)} J, &nbsp;${PA} = ${fmt(c.P)} W, &nbsp;${PC} = ${fmt(c.Pc)} W`),
  sheet:[
    {name:"Average power",eq:`${mi("P")}${OP("=")}${FR(WW,mi("t"))}`,note:"Work (or energy) per second, in watts."},
    {name:"Power at a given speed",eq:`${mi("P")}${OP("=")}${mi("F")}${mi("v")}`,note:"Force × speed. At steady speed the engine force equals the resistance."}
  ],
  takeEq:()=>`${mi("P")}${OP("=")}${FR(WW,mi("t"))}${AND}${mi("P")}${OP("=")}${mi("F")}${mi("v")}`,
  takeaway:"Power is work per second. Use P = W ÷ t for energy delivered over a time, and P = F × v for a force pushing at a speed.",
  link:"No homework on power yet, but it's on your course list right next to work and energy. It builds on HW 2, task 1: there you found the work done by a force, and power is that work per second.",
  viz:viz.slider((p,c)=>({
    note:`Same car, same final speed of ${p.v} m/s. The quicker you want to get there, the more power you need.`,
    label:`Time to reach ${p.v} m/s`,unit:"s",min:2,max:20,step:1,value:p.t,
    bars:[{label:"Average power needed (full bar = reaching it in 2 s)",segs:[{cls:"seg-ke",frac:x=>2/x}]}],
    read:x=>`In ${fmt(x)} s: ${PA} = ${fmt(c.W)} J ÷ ${fmt(x)} s = <b>${fmt(c.W/x)} W</b> (${fmt(c.W/x/1000)} kW)`
  })),
  scene:{still:4.5,draw(K,t,p){
  const y=184,u=mod(t,7.2),cruise=u>=3;K.ground(y,0,600);
  let x;if(!cruise){x=60+240*(u/3)*(u/3);}else x=300;
  const off=cruise?mod((u-3)*170,60):0;for(let k=-1;k<12;k++){const mx=k*60-off;K.line(mx,y+8,mx+26,y+8,{c:"ink2",w:2,alpha:0.5});}
  if(cruise){for(let i=0;i<5;i++){const wx=mod(600-(u-3)*260-i*130,640)-20;K.line(wx,60+i*16,wx+40,60+i*16,{c:"ink2",w:1.4,alpha:0.45});}
    K.arrow(x+64,y-26,x+38,y-26,{c:"heat",w:2.4});K.tag(`${p.Fd} N`,x+70,y-26,{align:"left",size:11,c:"heat"});K.tag(`steady ${p.vc} m/s`,x,y-64,{size:11});}
  else{speedLines(K,x-40,y-20,3,8+u*9,0.5);K.tag(`0 → ${p.v} m/s`,x,y-64,{size:11});}
  K.car(x,y,{ang:cruise?u*12:x/9});K.tag(`${F(p.m)} kg`,60,30,{align:"left",size:11});
  draw.loopFade(K,t,7.2);
}}
},

/* ===== Spring launcher with a rough patch ===== */
{
  id:"en-spring", level:"Hard", title:"Spring launcher", hw:"Course topic: work, energy and friction",
  base:{k:400,xcm:15,m:0.5,mu:0.2,d:1},
  random:()=>{for(;;){const p={k:pick([200,300,400,500,800]),xcm:pick([8,10,12,15,20]),m:pick([0.2,0.25,0.4,0.5]),mu:pick([0.1,0.2,0.25,0.3]),d:pick([0.5,0.8,1,1.5])};
    const Es=0.5*p.k*Math.pow(p.xcm/100,2),Q=p.mu*p.m*gE*p.d;if(Q<=0.6*Es&&Q>=0.08*Es)return p;}},
  calc:p=>{const x=p.xcm/100,Es=0.5*p.k*x*x,Q=p.mu*p.m*gE*p.d,KEa=Es-Q;return {x,Es,Q,KEa,v:Math.sqrt(2*KEa/p.m),h:KEa/(p.m*gE)};},
  text:(p,G,T)=>`A spring with ${G("k",`k = ${p.k} N/m`)} is squeezed by ${G("x",`${p.xcm} cm`)}, with a ${G("m",`${p.m} kg`)} block pressed against it. When it's let go, the block slides across a rough patch ${G("d",`${p.d} m`)} long (${T("kinetic","coefficient of kinetic friction")} ${G("mu",`${p.mu}`)}), then up a smooth ramp. Find (a) the energy stored in the squeezed spring, (b) the block's speed just after the rough patch, and (c) how high up the ramp it gets.`,
  terms:{kinetic:["Coefficient of kinetic friction","μ_k. Friction on a sliding object is μ_k × the normal force; on flat ground that's μ_k × mg."]},
  given:p=>[
    {k:"k",sym:KS,name:"spring constant",unit:"N/m",val:p.k,why:"How stiff the spring is.",look:"The number measured in N/m."},
    {k:"x",sym:XS,name:"how far it's squeezed",unit:"m",val:p.xcm/100,why:`Convert to metres: ${p.xcm} cm = ${p.xcm/100} m.`,look:"The squeeze is in cm. Convert to metres.",gtraps:[[p.xcm,`Convert to metres first: ${p.xcm} cm = ${p.xcm/100} m.`]]},
    {k:"m",sym:MS,name:"mass of the block",unit:"kg",val:p.m,why:"",look:"The number measured in kg."},
    {k:"d",sym:DS,name:"length of the rough patch",unit:"m",val:p.d,why:"Friction acts only over this distance.",look:"The length in m."},
    {k:"mu",sym:MUS,name:"coefficient of kinetic friction",unit:"",val:p.mu,why:"No unit.",look:"The plain number with no unit."}
  ],
  find:[{sym:ES,name:"energy in the spring",unit:"J",why:"Part (a)."},{sym:VS2,name:"speed after the rough patch",unit:"m/s",why:"Part (b)."},{sym:HS,name:"height reached on the ramp",unit:"m",why:"Part (c)."}],
  parts:[
    {id:"Es",label:"(a) Energy stored in the spring",sym:ES,unit:"J",ans:(p,c)=>c.Es,traps:(p,c)=>clean([[0.5*p.k*p.xcm*p.xcm,`Change cm to m first: ${p.xcm} cm = ${c.x} m.`],[p.k*c.x*c.x,"Spring energy has a ½ in it: ½kx²."],[0.5*p.k*c.x,"Square the squeeze: ½kx²."],[p.k*c.x,"That's the spring's force, kx. Its energy is ½kx²."]],c.Es)},
    {id:"v",label:"(b) Speed just after the rough patch",sym:VS2,unit:"m/s",ans:(p,c)=>c.v,traps:(p,c)=>clean([[Math.sqrt(2*c.Es/p.m),"That's the speed before the rough patch. Friction turns μmgd into heat first."],[Math.sqrt(c.KEa/p.m),"Kinetic energy is ½mv², so v = √(2 × KE ÷ m)."],[2*c.KEa/p.m,"That's v². Take the square root."],[Math.sqrt(2*(c.Es-p.mu*gE*p.d)/p.m),"Friction is μ × normal force = μmg: include the mass."]],c.v)},
    {id:"h",label:"(c) Height reached on the ramp",sym:HS,unit:"m",ans:(p,c)=>c.h,traps:(p,c)=>clean([[c.Es/(p.m*gE),"Friction already took some energy on the rough patch: use what's left, ½kx² − μmgd."],[c.KEa/p.m,"Potential energy is mgh: divide by m × g."],[c.KEa,"That's the energy in J. Height: h = energy ÷ (mg)."]],c.h)}
  ],
  idea:()=>`<p>Follow the energy from start to finish. Nothing is created; some is lost to friction as heat.</p>
    <ul class="plain"><li><b>Squeezed spring:</b> stores ½kx² of energy.</li><li><b>Let go:</b> all of it becomes kinetic energy of the block.</li><li><b>Rough patch:</b> friction (μmg) does work against the block over the distance d, turning μmgd into heat. What's left is the kinetic energy after the patch.</li><li><b>Smooth ramp:</b> no more losses; the remaining kinetic energy becomes potential energy mgh at the highest point.</li></ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${ES}${OP("=")}${HALF}${KS}${sq2(XS)}${AND}${QH}${OP("=")}${MUS}${MS}${mi("g")}${DS}`)+EQ(`${KEafter}${OP("=")}${ES}${OP("−")}${QH}${OP("=")}${HALF}${MS}${sq2(VS2)}${OP("=")}${MS}${mi("g")}${HS}`)+
    legend([[ES,"energy stored in the spring","J"],[QH,"energy turned into heat by friction","J"],[KEafter,"kinetic energy after the rough patch","J"]],"Convert the squeeze to metres before squaring it."),
  plug:(p,c)=>EQ(`${ES}${OP("=")}${HALF}${OP("×")}${p.k}${OP("×")}${c.x}<sup>2</sup>${AND}${QH}${OP("=")}${p.mu}${OP("×")}${p.m}${OP("×")}9.8${OP("×")}${p.d}`)+EQ(`${VS2}${OP("=")}${SQ(FR(`2(${ES}${OP("−")}${QH})`,p.m),true)}${AND}${HS}${OP("=")}${FR(`${ES}${OP("−")}${QH}`,`${p.m}${OP("×")}9.8`)}`),
  solution:(p,c)=>steps([
      ["(a) Spring energy",CALC(`${ES} = ½ × ${p.k} × ${c.x}² = <b>${fmt(c.Es)} J</b>`)],
      ["Heat on the rough patch",CALC(`${QH} = ${p.mu} × ${p.m} × 9.8 × ${p.d} = ${fmt(c.Q)} J &nbsp;→&nbsp; left: ${fmt(c.Es)} − ${fmt(c.Q)} = ${fmt(c.KEa)} J`)],
      ["(b) Speed from what's left",CALC(`½ × ${p.m} × ${sq2(VS2)} = ${fmt(c.KEa)} &nbsp;→&nbsp; ${VS2} = √(2 × ${fmt(c.KEa)} ÷ ${p.m}) = <b>${fmt(c.v)} m/s</b>`)],
      ["(c) All of it becomes height",CALC(`${p.m} × 9.8 × ${HS} = ${fmt(c.KEa)} &nbsp;→&nbsp; ${HS} = <b>${fmt(c.h)} m</b>`)]
    ])+checkline(`Energy at the top of the ramp: mgh = ${p.m} × 9.8 × ${fmt(c.h)} = ${fmt(p.m*gE*c.h)} J, and heat ${fmt(c.Q)} J. Together ${fmt(p.m*gE*c.h+c.Q)} J, the spring's ${fmt(c.Es)} J ✓`)+
    finalAns(`${ES} = ${fmt(c.Es)} J, &nbsp;${VS2} = ${fmt(c.v)} m/s, &nbsp;${HS} = ${fmt(c.h)} m`),
  sheet:[{name:"Spring energy",eq:`${ES}${OP("=")}${HALF}${KS}${sq2(XS)}`,note:"x in metres."},{name:"Energy lost to friction",eq:`${QH}${OP("=")}${MUS}${MS}${mi("g")}${DS}`,note:"On flat ground. Subtract it from the energy you had."}],
  takeEq:()=>`${HALF}${KS}${sq2(XS)}${OP("−")}${MUS}${MS}${mi("g")}${DS}${OP("=")}${MS}${mi("g")}${HS}`,
  takeaway:"Follow the energy: ½kx² from the spring, minus μmgd lost as heat, and whatever is left becomes speed and then height.",
  link:"HW 3, task 3 uses spring energy ½kx² for an oscillating block. Here the same energy launches the block once.",
  viz:viz.slider((p,c)=>({note:"Drag the squeeze. Friction always takes the same amount of heat, so squeezing harder leaves much more for the climb (energy grows with x²).",label:"Squeeze",unit:"cm",min:1,max:2*p.xcm,step:1,value:p.xcm,
    bars:[{label:"Spring energy (full bar = at the biggest squeeze)",segs:[{cls:"seg-heat",name:"heat from friction",frac:x=>Math.min(c.Q,0.5*p.k*Math.pow(x/100,2))/(0.5*p.k*Math.pow(2*p.xcm/100,2))},{cls:"seg-ke",name:"left for the climb",frac:x=>Math.max(0,0.5*p.k*Math.pow(x/100,2)-c.Q)/(0.5*p.k*Math.pow(2*p.xcm/100,2))}]}],
    read:x=>{const E=0.5*p.k*Math.pow(x/100,2),L=E-c.Q;return L<=0?`Spring energy ${fmt(R3(E))} J: friction takes it all, and the block stops on the rough patch.`:`Spring energy <b>${fmt(R3(E))} J</b>: the block climbs <b>${fmt(R3(L/(p.m*gE)))} m</b>`;}})),
  scene:{still:2.4,draw(K,t,p){const u=mod(t,6),y=180,wx=40,rx0=210,rx1=330,top=74;
    K.ground(y,20,rx1+10);K.wall(wx,y-56,y);K.poly([[rx1,y],[560,y],[560,top]],{fill:"bg",c:"ink",w:2,close:true});
    for(let x=rx0;x<rx1;x+=10)K.line(x,y+2,x+5,y+7,{c:"heat",w:1.4,alpha:0.7});K.dim(rx0,rx1,y+24,`${p.d} m`);
    const rest=150,sq=56;let bx,on=false,a=0;
    if(u<0.8){bx=rest-sq*Math.min(1,u/0.5);}else if(u<1.0){bx=rest-sq+(sq)*((u-0.8)/0.2);}else if(u<2.2){bx=rest+(rx1-rest)*((u-1)/1.2);}else if(u<3.6){const s=(u-2.2)/1.4,e=1-Math.pow(1-s,2);const L=Math.hypot(560-rx1,y-top)*0.62*e;a=Math.atan2(y-top,560-rx1);bx=rx1+L*Math.cos(a);on=true;}else{const L=Math.hypot(560-rx1,y-top)*0.62;a=Math.atan2(y-top,560-rx1);bx=rx1+L*Math.cos(a);on=true;}
    const by=on?y-(bx-rx1)*Math.tan(a):y;K.spring(wx,y-18,Math.min(bx,rest)-22,y-18,{coils:12,amp:8});
    if(on){const c2=Math.cos(a),s2=Math.sin(a),P=(uu,vv)=>[bx+uu*c2-vv*s2,by-uu*s2-vv*c2];K.poly([P(-22,0),P(22,0),P(22,32),P(-22,32)],{fill:"marker",c:"ink",w:1.6,close:true});}
    else block(K,bx,y,44,32,"");
    K.tag(`k = ${p.k} N/m`,96,y-82,{size:11});K.tag(`${p.m} kg`,bx,on?by-48:y-46,{size:11});K.tag(`μ = ${p.mu}`,(rx0+rx1)/2,y-46,{size:11,c:"heat"});
    if(u>5.4)K.rect(0,0,600,220,{fill:"bg",c:false,alpha:(u-5.4)/0.6});}}
}
]);
})();
