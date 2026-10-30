/* Waves: the wave equation, strings, sound, the Doppler effect and loudness.
   Every question on this topic is one object in the list below: its numbers, text, hints,
   answer checks, "See it" panel and animation. See ADDING-QUESTIONS.md for how to add one. */
(function(){
"use strict";
const {fmt,pick,mi,up,sb,ssp,OP,FR,SQ,EQ,CALC,HALF,sq2,neg,IMPLIES,AND,PAREN,PI,OMEGA,V0,VI,VF,KE,KEI,KEF,DKE,legend,steps,checkline,finalAns,watch,calcTip,viz}=HL;
const {R3,clean,pr,sumTxt,draw}=PHYS;
const {F,mod,fadeIn,cyclist,speedLines,springScene,block,curvedArrow}=draw;

/* symbols and helpers used below */
const LL=mi("L");
const NN=mi("n");
const LAM1=sb(mi("λ"),"1");
const F1=sb(mi("f"),"1");
const FNs=sb(mi("f"),mi("n"));
const ORD={2:"second",3:"third",4:"fourth"};
const VS=sb(mi("v"),"s");
const VO=sb(mi("v"),"o");
const FT=sb(mi("f"),"toward");
const FA=sb(mi("f"),"away");
const LF=sb(mi("λ"),"front");
const I2=sb(mi("I"),"2");
const PP=mi("P");
const RR=mi("r");
const R2=sb(mi("r"),"2");
const II=mi("I");
const I0=sb(mi("I"),"0");
const BB=mi("β");
const B2=sb(mi("β"),"2");
const TEN12=`10<sup>−12</sup>`;

/* for travelling-wave equations and string tension */
const LAMW=mi("λ"),KWV=mi("k"),TPER=mi("T"),AWV=mi("A"),VWV=mi("v"),UMX=sb(mi("u"),"max"),MUW=mi("μ"),FTEN=sb(mi("F"),"T"),FTEN2=`${sb(mi("F"),"T")}′`,FP=`${mi("f")}′`,LS2=mi("L"),MSTR=mi("m");
/* the wave equation as text; G marks the three numbers when given */
const waveEq=(p,G)=>{const g_=(k,v)=>G?G(k,fmt(v)):fmt(v),A=g_("A",p.A),w=g_("w",p.w),k=g_("k",p.k),t=mi("t"),x=mi("x");
  return `${mi("y")}(${x}, ${t}) = ${A} ${p.form===0?`cos(${w}${t} + ${k}${x})`:p.form===1?`sin(${k}${x} − ${w}${t})`:`cos(${k}${x} − ${w}${t})`}`;};
const waveDir=p=>p.form===0?"towards −x (the signs in the bracket are the same)":"towards +x (the signs in the bracket are opposite)";
const waveGiven=p=>[
  {k:"A",sym:AWV,name:"amplitude",unit:"m",val:p.A,why:"The number in front of cos or sin: the biggest sideways displacement of the string.",look:"The number in front of cos/sin."},
  {k:"w",sym:OMEGA,name:"angular frequency",unit:"rad/s",val:p.w,why:"The number multiplying t inside the bracket.",look:"The number next to t.",gtraps:p.k!==p.w?[[p.k,"That's the number next to x (k). ω multiplies t."]]:[]},
  {k:"k",sym:KWV,name:"wave number",unit:"rad/m",val:p.k,why:"The number multiplying x inside the bracket.",look:"The number next to x.",gtraps:p.k!==p.w?[[p.w,"That's the number next to t (ω). k multiplies x."]]:[]}];
const waveRand=()=>({A:pick([0.02,0.03,0.04,0.05,0.08]),w:pick([1.5,2,3,4,6,8,10,12,20,25]),k:pick([0.5,0.8,1.2,2,2.5,4,6,9.5,12]),form:pick([0,1,2])});
const waveTerms={trans:["Transverse wave","The string moves up and down while the wave travels along it, sideways to the motion of the wave."],si:["SI units","Metres, seconds, kilograms. So x is in m, t in s, and y in m."]};
/* "See it" for the wave questions: the string at any moment, with one marked bit of string */
const waveViz=extra=>({
  html:(p,c)=>`<p class="sec-note">Drag the time. The shape slides ${p.form===0?"left":"right"} at ${fmt(c.v)} m/s, while each bit of string only moves up and down. The orange dot is the bit at x = 0.</p>
    <div class="viz-box"><label class="viz-l" for="wv-s">Time: <output id="wv-so">0</output> s</label><input type="range" id="wv-s" min="0" max="${R3(2*c.T)}" step="${R3(c.T/60)}" value="0">
    <svg class="vsvg" viewBox="0 0 400 170" role="img" aria-label="The string at one moment"><line x1="10" y1="85" x2="390" y2="85" style="stroke:var(--rule);stroke-width:1"/>
    <path id="wv-p" class="v-main"/><circle id="wv-d" r="6" style="fill:var(--heat)"/><text class="v-text" x="390" y="165" text-anchor="end">x → (2 wavelengths shown)</text></svg>
    <p class="viz-read" id="wv-r"></p></div>`,
  setup:(p,c,ctx)=>{const r=ctx.$("#wv-s"),X=x=>10+380*x/(2*c.lam),Y=y=>85-62*y/p.A,yv=(x,t)=>p.form===0?p.A*Math.cos(p.w*t+p.k*x):p.form===1?p.A*Math.sin(p.k*x-p.w*t):p.A*Math.cos(p.k*x-p.w*t);
    const uv=t=>p.form===1?-p.A*p.w*Math.cos(p.w*t):-p.A*p.w*Math.sin(p.w*t);  /* speed of the string at x = 0: dy/dt */
    const upd=()=>{const t=+r.value;ctx.$("#wv-so").textContent=fmt(t);let d="";for(let i=0;i<=200;i++){const x=2*c.lam*i/200;d+=(i?" L":"M")+X(x).toFixed(1)+","+Y(yv(x,t)).toFixed(1);}
      ctx.$("#wv-p").setAttribute("d",d);ctx.$("#wv-d").setAttribute("cx",X(0));ctx.$("#wv-d").setAttribute("cy",Y(yv(0,t)));
      ctx.$("#wv-r").innerHTML=`At t = ${fmt(t)} s the dot is at y = ${fmt(R3(yv(0,t)))} m${extra?extra(p,c,t,uv(t)):""}`;};
    r.addEventListener("input",upd);upd();}
});
const waveScene=marker=>({still:0.6,draw(K,t,p){const dir=p.form===0?-1:1,x0=40,x1=560,y0=110,amp=46,nWaves=2.5,ph=t*1.8;
  K.line(x0,y0,x1,y0,{c:"rule",w:1,dash:[4,5]});const pts=[];for(let i=0;i<=160;i++){const s=i/160;pts.push([x0+(x1-x0)*s,y0-amp*Math.cos(2*Math.PI*nWaves*s-dir*ph)]);}
  K.poly(pts,{c:"blue",w:2.4});if(marker){const s=0.5;K.circle(x0+(x1-x0)*s,y0-amp*Math.cos(2*Math.PI*nWaves*s-dir*ph),7,{fill:"heat",c:"card",w:2});}
  K.arrow(dir>0?470:130,30,dir>0?540:60,30,{c:"ink2",w:2});K.tag(waveEq(p).replace(/<[^>]+>/g,""),300,200,{size:11});}});

PHYS.add("Waves",[
{
  id:"wav-guitar", topic:"Waves", level:"Easy", title:"Guitar string", hw:"Course topic: standing waves",
  base:{L:0.65,v:260,n:3},
  random:()=>{const r=pick([[0.65,260],[0.55,286],[0.8,320],[0.6,240],[0.75,330],[0.9,360],[0.4,176]]);return {L:r[0],v:r[1],n:pick([2,3,4])};},
  calc:p=>{const lam=2*p.L,f1=p.v/lam;return {lam,f1,fn:p.n*f1,lamn:lam/p.n};},
  text:(p,G,T)=>`A guitar string is ${G("L",`${p.L} m`)} long and ${T("fixed","fixed at both ends")}. Waves travel along it at ${G("v",`${p.v} m/s`)}. (a) What is the ${T("lambda","wavelength")} of the ${T("fund","fundamental")}? (b) What is the frequency of the fundamental? (c) What is the frequency of the ${G("n",`${ORD[p.n]} ${T("harm","harmonic")}`)}?`,
  terms:{
    fixed:["Fixed at both ends","The ends can't move, so they are always nodes: points where the string stays still."],
    lambda:["Wavelength","The length of one full wave: one hump up plus one hump down. Symbol λ (lambda), measured in metres."],
    fund:["Fundamental","The simplest way the string can vibrate: one single hump between the ends. It's the lowest note the string can play, also called the first harmonic."],
    harm:["Harmonic","The other ways the string can vibrate. The second harmonic has 2 humps between the ends, the third has 3, and so on."]
  },
  given:p=>[
    {k:"L",sym:LL,name:"length of the string",unit:"m",val:p.L,why:"The distance between the two fixed ends."},
    {k:"v",sym:mi("v"),name:"wave speed",unit:"m/s",val:p.v,why:"How fast waves travel along the string. It depends on the string, not on which harmonic is playing."},
    {k:"n",sym:NN,name:"harmonic number",unit:"",val:p.n,why:"Which harmonic: 1 is the fundamental, 2 is the second harmonic, and so on.",look:"Part (c) names the harmonic with a word. Turn the word into a number."}
  ],
  find:[
    {sym:LAM1,name:"wavelength of the fundamental",unit:"m",why:"Part (a). The small 1 means first harmonic, which is the fundamental."},
    {sym:F1,name:"frequency of the fundamental",unit:"Hz",why:"Part (b)."},
    {sym:FNs,name:"frequency of harmonic n",unit:"Hz",why:"Part (c)."}
  ],
  parts:[
    {id:"lam",label:"(a) Wavelength of the fundamental",sym:LAM1,unit:"m",ans:(p,c)=>c.lam,traps:(p,c)=>[
      [p.L,"One hump is only half a wave (a full wave is one hump up plus one hump down). So the full wavelength is twice the string: λ = 2L."],
      [p.L/2,"Other way round. One hump is half a wavelength, so λ = 2L."],
      [4*p.L,"Too long. One hump is half a wavelength, so λ = 2L."]
    ]},
    {id:"f1",label:"(b) Frequency of the fundamental",sym:F1,unit:"Hz",ans:(p,c)=>c.f1,traps:(p,c)=>[
      [p.v/p.L,"That uses λ = L. The fundamental's wavelength is 2L, so f₁ = v ÷ 2L."],
      [p.v*c.lam,"Divide, don't multiply: f = v ÷ λ."],
      [c.lam/p.v,"Upside down: f = v ÷ λ."]
    ]},
    {id:"fn",label:p=>`(c) Frequency of the ${ORD[p.n]} harmonic`,sym:FNs,unit:"Hz",ans:(p,c)=>c.fn,traps:(p,c)=>[
      [c.f1,"That's the fundamental. The question asks for a higher harmonic: fₙ = n × f₁."],
      [c.f1/p.n,"Higher harmonics have higher frequencies, not lower: fₙ = n × f₁."],
      [p.n*p.v/p.L,"That's n times v ÷ L, which uses the wrong fundamental. Fix part (b) first: f₁ = v ÷ 2L."],
      [c.lamn,"That's the wavelength of that harmonic, not its frequency."]
    ]}
  ],
  idea:(p,c)=>`<p>Both ends of the string are fixed, so they can't move. The string can only vibrate in patterns that fit a whole number of <b>humps</b> between the ends.</p>
    <ul class="plain">
      <li><b>(a)</b> The fundamental is one single hump. One hump is <b>half</b> a wavelength (a full wave is a hump up plus a hump down). So the string is half a wavelength long.</li>
      <li><b>(b)</b> Every wave obeys: <b>speed = frequency × wavelength</b>. You know the speed, and after (a) you know the wavelength.</li>
      <li><b>(c)</b> The ${ORD[p.n]} harmonic has ${p.n} humps. More humps means shorter waves. The speed stays the same, so the frequency goes up by the same factor.</li>
    </ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${sb(mi("λ"),mi("n"))}${OP("=")}${FR(`2${LL}`,NN)}`)+
    EQ(`${mi("v")}${OP("=")}${mi("f")}${mi("λ")}${IMPLIES}${mi("f")}${OP("=")}${FR(mi("v"),mi("λ"))}`)+
    EQ(`${FNs}${OP("=")}${NN}${F1}`)+
    legend([[mi("λ"),"wavelength","m"],[mi("f"),"frequency","Hz"],[mi("v"),"wave speed","m/s"],[LL,"length of the string","m"],[NN,"harmonic number: 1, 2, 3, …",""]],
    `For the fundamental, ${NN} = 1, so ${LAM1} = 2${LL} and ${F1} = ${mi("v")} ÷ 2${LL}. The rule ${mi("v")} = ${mi("f")}${mi("λ")} works for every kind of wave, including sound.`),
  plug:(p,c)=>EQ(`${LAM1}${OP("=")}2${OP("×")}${p.L}`)+
    EQ(`${F1}${OP("=")}${FR(p.v,LAM1)}`)+
    EQ(`${sb(mi("f"),p.n)}${OP("=")}${p.n}${OP("×")}${F1}`)+
    `<p>Each answer feeds into the next one.</p>`+calcTip(`${p.v}/(2*${p.L})`),
  solution:(p,c)=>steps([
      ["Write down what you know",`${LL} = ${p.L} m, &nbsp;${mi("v")} = ${p.v} m/s, &nbsp;${NN} = ${p.n}.`],
      ["(a) One hump is half a wavelength",CALC(`${LAM1} = 2${LL} = 2 × ${p.L} = <b>${fmt(c.lam)} m</b>`)],
      ["(b) Use v = fλ",CALC(`${F1} = ${mi("v")} ÷ ${LAM1} = ${p.v} ÷ ${fmt(c.lam)} = <b>${fmt(c.f1)} Hz</b>`)],
      [`(c) The ${ORD[p.n]} harmonic is ${p.n} times the fundamental`,CALC(`${sb(mi("f"),p.n)} = ${p.n} × ${fmt(c.f1)} = <b>${fmt(c.fn)} Hz</b>`)]
    ])+checkline(`Another way: the ${ORD[p.n]} harmonic has ${p.n} humps, so its wavelength is 2${LL} ÷ ${p.n} = ${fmt(c.lamn)} m, and ${mi("f")} = ${mi("v")} ÷ ${mi("λ")} = ${p.v} ÷ ${fmt(c.lamn)} ≈ ${fmt(c.fn)} Hz ✓<br>Units: (m/s) ÷ m = 1/s = Hz ✓`)+
    finalAns(`${LAM1} = ${fmt(c.lam)} m, &nbsp;${F1} = ${fmt(c.f1)} Hz, &nbsp;${sb(mi("f"),p.n)} = ${fmt(c.fn)} Hz`),
  sheet:[
    {name:"Wave speed",eq:`${mi("v")}${OP("=")}${mi("f")}${mi("λ")}`,note:"True for every wave."},
    {name:"String fixed at both ends",eq:`${sb(mi("λ"),mi("n"))}${OP("=")}${FR(`2${LL}`,NN)}${AND}${FNs}${OP("=")}${FR(`${NN}${mi("v")}`,`2${LL}`)}`,note:"n = 1 is the fundamental."}
  ],
  takeEq:()=>`${mi("v")}${OP("=")}${mi("f")}${mi("λ")}${AND}${FNs}${OP("=")}${NN}${F1}`,
  takeaway:"One hump is half a wavelength, so the fundamental has λ = 2L. Every wave obeys v = fλ, and the nth harmonic is n times the fundamental frequency.",
  link:"There's no homework on waves yet, but standing waves are on your course list under mechanical waves, and a guitar string is the classic exam example. The same v = fλ works for sound waves too.",
  viz:{
    html:(p,c)=>`<p class="sec-note">The string in extreme slow motion. Pick a harmonic: each one fits one more hump between the fixed ends.</p>
      <div class="viz-box">
        <div class="btn-row" role="group" aria-label="Harmonic">${[1,2,3,4].map(n=>`<button class="btn${n===1?" btn-primary":""}" data-harm="${n}" aria-pressed="${n===1}">n = ${n}</button>`).join("")}</div>
        <svg class="vsvg" viewBox="0 0 400 120" role="img" aria-label="A standing wave on a string fixed at both ends">
          <line class="v-wall" x1="20" y1="18" x2="20" y2="102"/><line class="v-wall" x1="380" y1="18" x2="380" y2="102"/>
          <path id="wv-env1" class="v-faint"/><path id="wv-env2" class="v-faint"/>
          <path id="wv-path" class="v-main"/>
          <g id="wv-nodes"></g>
        </svg>
        <p class="viz-read" id="wv-read"></p>
      </div>`,
    setup:(p,c,ctx)=>{
      let n=1,t=0;const x0=20,x1=380,yc=60,amp=34;
      const pathAt=k=>{let d="";for(let i=0;i<=90;i++){const u=i/90,x=x0+u*(x1-x0),y=yc-k*amp*Math.sin(n*Math.PI*u);d+=(i?" L":"M")+x.toFixed(1)+","+y.toFixed(1);}return d;};
      const draw=()=>ctx.$("#wv-path").setAttribute("d",pathAt(ctx.reduceMotion?1:Math.cos(2*Math.PI*0.4*n*t)));
      const setN=k=>{n=k;
        ctx.$$("[data-harm]").forEach(b=>{const on=+b.dataset.harm===n;b.classList.toggle("btn-primary",on);b.setAttribute("aria-pressed",String(on));});
        ctx.$("#wv-env1").setAttribute("d",pathAt(1));ctx.$("#wv-env2").setAttribute("d",pathAt(-1));
        let dots="";for(let j=0;j<=n;j++)dots+=`<circle class="v-dot" cx="${(x0+j*(x1-x0)/n).toFixed(1)}" cy="${yc}" r="3.5"/>`;
        ctx.$("#wv-nodes").innerHTML=dots;
        ctx.$("#wv-read").innerHTML=`n = ${n}: ${n} hump${n>1?"s":""} on the string, so λ = 2L ÷ ${n} = ${fmt(2*p.L/n)} m and f = ${n} × ${fmt(c.f1)} = <b>${fmt(n*c.f1)} Hz</b>. The red dots are nodes: points that never move.`;
        draw();};
      ctx.$$("[data-harm]").forEach(b=>b.addEventListener("click",()=>setN(+b.dataset.harm)));
      setN(1);
      if(!ctx.reduceMotion) ctx.loop(dt=>{t+=dt;draw();});
    }
  },
  scene:{still:0.3,draw(K,t,p){
  const u=mod(t,4.4),x1=110,x2=540,yS=104;
  K.ellipse(120,110,92,72,{fill:"bg",c:"ink",w:2});K.ellipse(205,110,38,30,{fill:"card",c:"ink2",w:1});K.circle(170,110,18,{fill:"ink",c:false,alpha:0.85});
  K.rect(200,96,350,28,{fill:"bg",c:"ink",w:1.6,r:3});for(let k=1;k<9;k++)K.line(200+k*40,96,200+k*40,124,{c:"ink2",w:1,alpha:0.6});
  K.rect(x1-6,92,8,24,{fill:"ink",c:false,r:2});K.rect(x2-2,92,6,24,{fill:"ink",c:false,r:2});
  const damp=Math.exp(-0.7*u),pts=[];for(let i=0;i<=120;i++){const s=i/120;let yy=0;for(let n=1;n<=5;n++)yy+=Math.sin(n*Math.PI*0.2)/(n*n)*Math.sin(n*Math.PI*s)*Math.cos(n*2*Math.PI*1.4*u);pts.push([x1+(x2-x1)*s,yS+26*damp*yy]);}
  K.poly(pts,{c:"heat",w:2});
  K.dim(x1,x2,176,`L = ${p.L} m`);K.tag(`waves travel at ${p.v} m/s`,440,30,{size:11});
}}
},

{
  id:"wav-doppler", topic:"Waves", level:"Medium", title:"Ambulance siren", hw:"Course topic: Doppler effect",
  base:{f:700,vs:25},
  random:()=>({f:pick([500,600,700,800,900]),vs:pick([15,20,25,30,40])}),
  calc:p=>{const v=340;return {v,ft:p.f*v/(v-p.vs),fa:p.f*v/(v+p.vs),lf:(v-p.vs)/p.f,l0:v/p.f};},
  text:(p,G,T)=>`An ambulance siren gives out sound at a ${T("freq","frequency")} of ${G("f",`${p.f} Hz`)}. The ambulance drives at ${G("vs",`${p.vs} m/s`)} while you ${G("vo","stand still")} by the road. The ${T("sos","speed of sound")} in air is ${G("v","340 m/s")}. (a) What frequency do you hear while the ambulance comes towards you? (b) What frequency do you hear after it passes and drives away? (c) What is the ${T("lambda","wavelength")} of the sound in front of the ambulance?`,
  terms:{
    freq:["Frequency","How many wave crests arrive each second, in hertz (Hz). A higher frequency sounds like a higher pitch."],
    sos:["Speed of sound","How fast sound travels through the air. It depends on the air, not on how fast the ambulance moves."],
    lambda:["Wavelength","The distance from one wave crest to the next. Measured in metres."]
  },
  given:p=>[
    {k:"f",sym:mi("f"),name:"siren frequency",unit:"Hz",val:p.f,why:"The frequency the siren actually makes."},
    {k:"vs",sym:VS,name:"speed of the source",unit:"m/s",val:p.vs,why:"The small s means source: the thing making the sound (the ambulance)."},
    {k:"vo",sym:VO,name:"speed of the observer",unit:"m/s",val:0,why:`"Stand still" means your speed is 0. The small o means observer: the one listening.`,look:`You "stand still". What speed is that?`},
    {k:"v",sym:mi("v"),name:"speed of sound",unit:"m/s",val:340,why:"How fast the sound itself travels."}
  ],
  find:[
    {sym:FT,name:"frequency you hear as it comes towards you",unit:"Hz",why:"Part (a)."},
    {sym:FA,name:"frequency you hear as it drives away",unit:"Hz",why:"Part (b)."},
    {sym:LF,name:"wavelength in front of the ambulance",unit:"m",why:"Part (c)."}
  ],
  parts:[
    {id:"ft",label:"(a) Frequency as it comes towards you",sym:FT,unit:"Hz",ans:(p,c)=>c.ft,traps:(p,c)=>[
      [c.fa,"That's the frequency as it drives away. Coming towards you, the waves get squeezed together, so the pitch is higher: divide by (v − vₛ)."],
      [p.f,"That's the siren's own frequency. Because the ambulance moves, you hear a different one."],
      [p.f*(c.v-p.vs)/c.v,"Upside down: the speed of sound goes on top, f × v ÷ (v − vₛ)."],
      [p.f*p.vs/c.v,"Use the speed of sound in the formula: f × v ÷ (v − vₛ)."]
    ]},
    {id:"fa",label:"(b) Frequency as it drives away",sym:FA,unit:"Hz",ans:(p,c)=>c.fa,traps:(p,c)=>[
      [c.ft,"That's the frequency as it comes towards you. Driving away stretches the waves, so the pitch is lower: divide by (v + vₛ)."],
      [p.f,"That's the siren's own frequency. Because the ambulance moves, you hear a different one."],
      [p.f*(c.v+p.vs)/c.v,"Upside down: the speed of sound goes on top, f × v ÷ (v + vₛ)."]
    ]},
    {id:"lf",label:"(c) Wavelength in front of the ambulance",sym:LF,unit:"m",ans:(p,c)=>c.lf,traps:(p,c)=>[
      [c.l0,"That's the wavelength if the ambulance stood still (v ÷ f). In front of it the waves are squeezed closer: λ = (v − vₛ) ÷ f."],
      [(c.v+p.vs)/p.f,"That's the wavelength behind the ambulance. In front, subtract: (v − vₛ) ÷ f."],
      [p.f/(c.v-p.vs),"Upside down: λ = (v − vₛ) ÷ f."],
      [p.vs/p.f,"Use the speed of sound too: λ = (v − vₛ) ÷ f."]
    ]}
  ],
  idea:(p,c)=>`<p>The siren sends out ${p.f} wave crests every second. The sound itself always travels at 340 m/s. What changes is the <b>spacing</b> between the crests.</p>
    <ul class="plain">
      <li><b>(a) Coming towards you:</b> the ambulance chases its own sound, so each new crest starts a bit closer to you. The crests arrive squeezed together, more per second, so you hear a <b>higher</b> pitch.</li>
      <li><b>(b) Driving away:</b> each crest starts a bit further away, so the crests are stretched out and you hear a <b>lower</b> pitch.</li>
      <li><b>(c)</b> Between two crests, the sound moves ahead by v ÷ f, but the ambulance follows it by vₛ ÷ f. The gap that's left in front is the wavelength.</li>
    </ul>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${FT}${OP("=")}${mi("f")}${OP("×")}${FR(mi("v"),`${mi("v")}${OP("−")}${VS}`)}`)+
    EQ(`${FA}${OP("=")}${mi("f")}${OP("×")}${FR(mi("v"),`${mi("v")}${OP("+")}${VS}`)}`)+
    EQ(`${LF}${OP("=")}${FR(`${mi("v")}${OP("−")}${VS}`,mi("f"))}`)+
    legend([[mi("f"),"frequency of the siren","Hz"],[mi("v"),"speed of sound","m/s"],[VS,"speed of the ambulance (source)","m/s"],[FT,"heard as it comes towards you","Hz"],[FA,"heard as it drives away","Hz"],[LF,"wavelength in front","m"]],
    `Memory trick: towards you means a higher pitch, so make the bottom of the fraction smaller (minus). Away means lower, so make the bottom bigger (plus). If you were moving too, the general formula is ${mi("f")}′ = ${mi("f")}(${mi("v")} ± ${VO}) ÷ (${mi("v")} ∓ ${VS}), with the signs picked the same way.`),
  plug:(p,c)=>EQ(`${FT}${OP("=")}${p.f}${OP("×")}${FR("340",`340${OP("−")}${p.vs}`)}`)+
    EQ(`${FA}${OP("=")}${p.f}${OP("×")}${FR("340",`340${OP("+")}${p.vs}`)}`)+
    EQ(`${LF}${OP("=")}${FR(`340${OP("−")}${p.vs}`,p.f)}`)+
    `<p>Do the bracket at the bottom first, then divide.</p>`+calcTip(`${p.f}*340/(340-${p.vs})`),
  solution:(p,c)=>steps([
      ["Write down what you know",`${mi("f")} = ${p.f} Hz, &nbsp;${VS} = ${p.vs} m/s, &nbsp;${VO} = 0, &nbsp;${mi("v")} = 340 m/s.`],
      ["(a) Coming towards you: squeezed waves, higher pitch",CALC(`${FT} = ${p.f} × 340 ÷ (340 − ${p.vs}) = ${p.f} × 340 ÷ ${340-p.vs} = <b>${fmt(c.ft)} Hz</b>`)],
      ["(b) Driving away: stretched waves, lower pitch",CALC(`${FA} = ${p.f} × 340 ÷ (340 + ${p.vs}) = ${p.f} × 340 ÷ ${340+p.vs} = <b>${fmt(c.fa)} Hz</b>`)],
      ["(c) Wavelength in front",CALC(`${LF} = (340 − ${p.vs}) ÷ ${p.f} = ${340-p.vs} ÷ ${p.f} = <b>${fmt(c.lf)} m</b>`)]
    ])+checkline(`Sense check: ${fmt(c.ft)} Hz is higher than ${p.f} Hz, and ${fmt(c.fa)} Hz is lower ✓<br>Check (c) with v = fλ: the sound in front reaches you at 340 m/s with frequency ${fmt(c.ft)} Hz, so λ = 340 ÷ ${fmt(c.ft)} = ${fmt(c.v/c.ft)} m, the same as (c) ✓`)+
    finalAns(`${FT} = ${fmt(c.ft)} Hz, &nbsp;${FA} = ${fmt(c.fa)} Hz, &nbsp;${LF} = ${fmt(c.lf)} m`),
  sheet:[
    {name:"Doppler: source moving, you standing still",eq:`${mi("f")}′${OP("=")}${mi("f")}${OP("×")}${FR(mi("v"),`${mi("v")}${OP("∓")}${VS}`)}`,note:"Minus when it comes towards you (higher pitch), plus when it goes away."},
    {name:"Wavelength in front of a moving source",eq:`${LF}${OP("=")}${FR(`${mi("v")}${OP("−")}${VS}`,mi("f"))}`,note:"Behind it: (v + vₛ) ÷ f."}
  ],
  takeEq:()=>`${mi("f")}′${OP("=")}${mi("f")}${OP("×")}${FR(mi("v"),`${mi("v")}${OP("∓")}${VS}`)}`,
  takeaway:"A moving source squeezes the waves in front (higher pitch) and stretches them behind (lower pitch). The speed of sound itself doesn't change.",
  link:"No homework on this yet, but the Doppler effect is on your course list under mechanical waves. The same idea lets ultrasound scanners measure how fast blood flows, which is also on the list.",
  viz:{
    html:(p,c)=>`<p class="sec-note">Each circle is one wave crest from the siren. Drag the speed and watch the crests bunch up in front and spread out behind. (The drawing is slowed down a lot so you can see it.)</p>
      <div class="viz-box">
        <label class="viz-l" for="dp-s">Ambulance speed: <output id="dp-so">${p.vs}</output> m/s</label>
        <input type="range" id="dp-s" min="0" max="300" step="5" value="${p.vs}">
        <svg class="vsvg" viewBox="0 0 400 160" role="img" aria-label="Wave crests spreading out from a moving siren">
          <g id="dp-waves"></g>
          <circle id="dp-src" class="v-dot" r="5" cx="30" cy="80"/>
          <line class="v-wall" x1="394" y1="70" x2="394" y2="90"/>
          <text class="v-text" x="388" y="64" text-anchor="end">you</text>
        </svg>
        <p class="viz-read" id="dp-read"></p>
      </div>`,
    setup:(p,c,ctx)=>{
      const r=ctx.$("#dp-s"),g=ctx.$("#dp-waves"),src=ctx.$("#dp-src"),out=ctx.$("#dp-so"),read=ctx.$("#dp-read");
      const CV=70,TE=0.45,XA=30,XB=330,Y=80;
      let t=0,lastEmit=-1,waves=[],xs=XA;
      const upd=()=>{const s=+r.value;out.textContent=s;
        read.innerHTML=`At ${s} m/s: in front you hear <b>${fmt(p.f*c.v/(c.v-s))} Hz</b>, behind <b>${fmt(p.f*c.v/(c.v+s))} Hz</b>. The siren itself makes ${p.f} Hz. Wavelength in front: ${fmt((c.v-s)/p.f)} m.`;};
      const step=dt=>{t+=dt;xs+=CV*(+r.value)/c.v*dt;
        if(xs>XB){xs=XA;waves=[];t=0;lastEmit=-1;}
        if(lastEmit<0||t-lastEmit>=TE){waves.push({x:xs,t0:t});lastEmit=t;}
        waves=waves.filter(w=>CV*(t-w.t0)<420);
        g.innerHTML=waves.map(w=>{const rr=CV*(t-w.t0);return `<circle class="v-main" style="stroke-width:1.4;opacity:${Math.max(0.15,1-rr/420).toFixed(2)}" cx="${w.x.toFixed(1)}" cy="${Y}" r="${rr.toFixed(1)}"/>`;}).join("");
        src.setAttribute("cx",xs.toFixed(1));};
      r.addEventListener("input",upd);upd();
      if(ctx.reduceMotion){for(let i=0;i<80;i++)step(0.05);}else ctx.loop(step);
    }
  },
  scene:{still:2.6,draw(K,t,p){
  const y=184,u=mod(t,7.5),x=-70+100*u,px=470;K.ground(y,0,600);
  K.person(px,y,{arms:[[-10,-28],[10,-28]]});K.tag("you",px,y-82,{size:11});
  const bx=x,s=1;K.rect(bx-48,y-52,96,42,{fill:"card",c:"ink",w:1.6,r:6});K.rect(bx+22,y-44,20,16,{fill:"blueSoft",c:"ink2",w:1,r:2});
  K.rect(bx-36,y-40,22,6,{fill:"bad",c:false});K.rect(bx-28,y-48,6,22,{fill:"bad",c:false});K.line(bx-48,y-24,bx+48,y-24,{c:"bad",w:3});
  const on=mod(u*4,1)<0.5;K.rect(bx-14,y-60,12,8,{fill:on?"blue":"bad",c:false,r:2});K.rect(bx+2,y-60,12,8,{fill:on?"bad":"blue",c:false,r:2});
  K.wheel(bx-28,y-9,10,x/10);K.wheel(bx+28,y-9,10,x/10);
  for(let i=0;i<3;i++){const ph=mod(u*1.6+i/3,1);K.arc(bx,y-56,14+ph*40,-0.6,0.6,{c:"heat",w:1.6,alpha:1-ph});K.arc(bx,y-56,14+ph*40,Math.PI-0.6,Math.PI+0.6,{c:"heat",w:1.6,alpha:1-ph});}
  K.tag(`${p.f} Hz`,bx,y-84,{size:11,c:"heat"});K.tag(`${p.vs} m/s`,24,30,{align:"left",size:11});K.arrow(120,30,165,30,{c:"ink",w:2});
}}
},

{
  id:"wav-loudness", topic:"Waves", level:"Medium", title:"Loudness in decibels", hw:"Course topic: wave intensity and sound",
  base:{P:0.4,r:5,r2:10},
  random:()=>{const r=pick([[0.4,5,10],[1,10,20],[0.2,2,4],[2,8,16],[0.5,4,12],[0.1,1,3]]);return {P:r[0],r:r[1],r2:r[2]};},
  calc:p=>{const I=p.P/(4*Math.PI*p.r*p.r),I2=p.P/(4*Math.PI*p.r2*p.r2);return {I,I2,b:10*Math.log10(I/1e-12),b2:10*Math.log10(I2/1e-12)};},
  text:(p,G,T)=>`A small speaker sends out ${G("P",`${p.P} W`)} of sound ${T("evenly","evenly in all directions")}. (a) What is the ${T("int","intensity")} of the sound ${G("r",`${p.r} m`)} away? (b) What is the ${T("level","sound level")} there, in decibels? Use the ${T("i0","threshold of hearing")} I₀ = ${G("I0",`10⁻¹² W/m²`)}. (c) What is the sound level ${G("r2",`${p.r2} m`)} away?`,
  terms:{
    evenly:["Evenly in all directions","The sound spreads out like a growing balloon around the speaker, the same in every direction."],
    int:["Intensity","Sound power per square metre, in W/m². The further away you are, the more the power is spread out, so the lower the intensity."],
    level:["Sound level","A scale that matches how loud sounds seem to us, in decibels (dB). Every time the intensity is multiplied by 10, the level goes up by 10 dB."],
    i0:["Threshold of hearing","The quietest sound a typical person can hear: 10⁻¹² W/m². It's the 0 dB point of the scale."]
  },
  given:p=>[
    {k:"P",sym:PP,name:"sound power",unit:"W",val:p.P,why:"The total sound power from the speaker."},
    {k:"r",sym:RR,name:"distance",unit:"m",val:p.r,why:"How far away you are in parts (a) and (b).",look:"It's the first distance in the question."},
    {k:"I0",sym:I0,name:"threshold of hearing",unit:"W/m²",val:1e-12,why:"The reference intensity for decibels. You can type it as 1e-12 or 10^-12."},
    {k:"r2",sym:R2,name:"second distance",unit:"m",val:p.r2,why:"The distance in part (c).",look:"It's the distance in part (c)."}
  ],
  find:[
    {sym:II,name:"intensity at the first distance",unit:"W/m²",why:"Part (a)."},
    {sym:BB,name:"sound level there",unit:"dB",why:"Part (b). β is the Greek letter beta."},
    {sym:B2,name:"sound level at the second distance",unit:"dB",why:"Part (c)."}
  ],
  parts:[
    {id:"I",label:"(a) Intensity",sym:II,unit:"W/m²",ans:(p,c)=>c.I,traps:(p,c)=>clean([
      [p.P/(4*Math.PI*p.r),"Square the distance: the area of a sphere is 4πr²."],
      [p.P/(Math.PI*p.r*p.r),"πr² is the area of a circle. The sound spreads over a sphere, with area 4πr²."],
      [p.P/(2*Math.PI*p.r*p.r),"The sound goes in all directions, so use the whole sphere: 4πr²."],
      [p.P*4*Math.PI*p.r*p.r,"Divide the power by the area, don't multiply."],
      [p.P/(p.r*p.r),"Include the 4π: the area of a sphere is 4πr²."]
    ],c.I)},
    {id:"b",label:"(b) Sound level",sym:BB,unit:"dB",ans:(p,c)=>c.b,traps:(p,c)=>clean([
      [10*Math.log(c.I/1e-12),"Use log base 10 (the log button), not ln."],
      [Math.log10(c.I/1e-12),"That's in bels. Multiply by 10 to get decibels."],
      [10*Math.log10(c.I),"Divide by I₀ before taking the log: β = 10 log(I ÷ I₀)."],
      [20*Math.log10(c.I/1e-12),"Use 10 × log for intensity."]
    ],c.b)},
    {id:"b2",label:"(c) Sound level at the second distance",sym:B2,unit:"dB",ans:(p,c)=>c.b2,traps:(p,c)=>clean([
      [c.b-10*Math.log10(p.r2/p.r),`Close, but the intensity falls with distance squared. Going ${fmt(p.r2/p.r)} times further makes it ${fmt((p.r2/p.r)**2)} times weaker, so the level drops by 10 log(${fmt((p.r2/p.r)**2)}) dB.`],
      [c.b*p.r/p.r2,"Decibels don't scale like that. Work out the new intensity first, then the new level."],
      [c.b,"It's further away, so it must be quieter."],
      [10*Math.log10(c.I2),"Divide by I₀ before taking the log."]
    ],c.b2)}
  ],
  idea:(p,c)=>`<p><b>(a)</b> The speaker's sound power spreads out over a growing sphere. Intensity is power ÷ area of that sphere, so further away means weaker.</p>
    <p><b>(b)</b> Our ears notice <i>ratios</i> of intensity, not differences, so loudness uses a logarithm. Compare your intensity with the quietest sound we can hear (I₀), take log base 10 of that ratio, and multiply by 10 to get decibels.</p>
    <p><b>(c)</b> Further away, the same power covers more area. ${p.r2/p.r===2?"Twice as far means 4 times the area, so a quarter of the intensity.":`${fmt(p.r2/p.r)} times as far means ${fmt((p.r2/p.r)**2)} times the area.`} Work out the new intensity and its level the same way.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${II}${OP("=")}${FR(PP,`4${PI}${sq2(RR)}`)}`)+
    EQ(`${BB}${OP("=")}10${OP("")}log<sub>10</sub>${OP("")}${FR(II,I0)}${AND}${I0}${OP("=")}${TEN12}${OP("")}W/m²`)+
    EQ(`${B2}${OP("=")}${BB}${OP("−")}20${OP("")}log<sub>10</sub>${OP("")}${FR(R2,RR)}`)+
    legend([[II,"intensity","W/m²"],[PP,"sound power","W"],[RR,"distance","m"],[BB,"sound level","dB"],[I0,"threshold of hearing","W/m²"]],
    `The last line is a shortcut for (c). You can also just repeat (a) and (b) with the new distance. On a calculator, "log" means base 10.`),
  plug:(p,c)=>EQ(`${II}${OP("=")}${FR(p.P,`4${PI}${OP("×")}${sq2(p.r)}`)}`)+
    EQ(`${BB}${OP("=")}10${OP("")}log${OP("")}${FR(II,TEN12)}`)+
    EQ(`${B2}${OP("=")}10${OP("")}log${OP("")}${FR(`${p.P}${OP("÷")}(4${PI}${OP("×")}${sq2(p.r2)})`,TEN12)}`)+
    `<p>Keep plenty of digits in the intensity (it's a small number) before taking the log.</p>`+
    calcTip(`10*log(${p.P}/(4*pi*${p.r}^2)/1e-12)`," The box understands log (base 10), and 1e-12 means 10⁻¹²."),
  solution:(p,c)=>steps([
      ["Write down what you know",`${PP} = ${p.P} W, &nbsp;${RR} = ${p.r} m, &nbsp;${I0} = ${TEN12} W/m², &nbsp;${R2} = ${p.r2} m.`],
      ["(a) Power spread over a sphere",CALC(`${II} = ${p.P} ÷ (4π × ${sq2(p.r)}) = ${p.P} ÷ ${fmt(4*Math.PI*p.r*p.r)} = <b>${fmt(c.I)} W/m²</b>`)],
      ["(b) Compare with the threshold of hearing",CALC(`${BB} = 10 log(${fmt(c.I)} ÷ ${TEN12}) = 10 × log(${fmt(c.I/1e-12)}) = 10 × ${fmt(Math.log10(c.I/1e-12))} = <b>${fmt(c.b)} dB</b>`)],
      ["(c) New intensity further away",CALC(`${sb(mi("I"),"2")} = ${p.P} ÷ (4π × ${sq2(p.r2)}) = ${fmt(c.I2)} W/m²`)],
      ["New sound level",CALC(`${B2} = 10 log(${fmt(c.I2)} ÷ ${TEN12}) = <b>${fmt(c.b2)} dB</b>`)]
    ])+checkline(`Shortcut check: ${fmt(c.b)} − 20 log(${p.r2} ÷ ${p.r}) = ${fmt(c.b)} − ${fmt(20*Math.log10(p.r2/p.r))} = ${fmt(c.b-20*Math.log10(p.r2/p.r))} dB ✓<br>Rule of thumb: twice as far away is about 6 dB quieter.`)+
    finalAns(`${II} = ${fmt(c.I)} W/m², &nbsp;${BB} = ${fmt(c.b)} dB, &nbsp;${B2} = ${fmt(c.b2)} dB`),
  sheet:[
    {name:"Intensity from a point source",eq:`${II}${OP("=")}${FR(PP,`4${PI}${sq2(RR)}`)}`,note:"Power spread over a sphere."},
    {name:"Sound level in decibels",eq:`${BB}${OP("=")}10${OP("")}log${OP("")}${FR(II,I0)}`,note:`I₀ = 10⁻¹² W/m². ×10 intensity = +10 dB.`}
  ],
  takeEq:()=>`${II}${OP("=")}${FR(PP,`4${PI}${sq2(RR)}`)}${AND}${BB}${OP("=")}10${OP("")}log${OP("")}${FR(II,I0)}`,
  takeaway:"Intensity is power spread over 4πr². Decibels compare it with 10⁻¹² W/m² on a log scale: twice as far is about 6 dB quieter.",
  link:"No homework on sound yet, but wave intensity and the objective characteristics of sound are on your course list under mechanical waves.",
  viz:viz.slider((p,c)=>({
    note:"Walk away from the speaker. The intensity drops fast, but the decibel level drops slowly, because it's a log scale.",
    label:"Distance from the speaker",unit:"m",min:0.5,max:50,step:0.5,value:p.r,
    bars:[{label:"Sound level (full bar = 130 dB)",segs:[{cls:"seg-ke",frac:x=>10*Math.log10(p.P/(4*Math.PI*x*x)/1e-12)/130}]}],
    read:x=>{const I=p.P/(4*Math.PI*x*x),b=10*Math.log10(I/1e-12);const feel=b<40?"like a quiet room":b<65?"like normal conversation":b<85?"like a busy street":b<120?"loud enough to damage hearing over time":"painfully loud";
      return `${fmt(x)} m away: ${II} = ${fmt(I)} W/m², ${BB} = <b>${fmt(b)} dB</b> (${feel})`;}
  })),
  scene:{still:1.4,draw(K,t,p){
  const sx=48,sy=104,scale=500/p.r2,x1=sx+p.r*scale,x2=sx+p.r2*scale;
  for(let i=0;i<5;i++){const ph=mod(t*0.45+i/5,1),R=12+ph*560;K.circle(sx,sy,R,{c:"heat",w:1.8,alpha:0.75*(1-ph)});}
  K.rect(sx-26,sy-20,16,40,{fill:"ink2",c:"ink",w:1.4,r:2});K.poly([[sx-10,sy-12],[sx+6,sy-26],[sx+6,sy+26],[sx-10,sy+12]],{fill:"ink",c:false,close:true});
  [x1,x2].forEach(x=>{K.circle(x,sy,9,{fill:"card",c:"ink",w:1.8});K.ellipse(x-8,sy,3,5,{fill:"ink2",c:false});});
  K.dim(sx,x1,170,`${p.r} m`);K.dim(sx,x2,198,`${p.r2} m`);K.tag(`${p.P} W`,sx-6,sy-44,{size:11});
}}
},

/* ===== Reading a wave equation ===== */
{
  id:"wav-equation", level:"Easy", title:"Reading a wave equation", hw:"Course topic: travelling waves",
  base:{A:0.03,w:6,k:2.5,form:1},
  random:waveRand,
  calc:p=>({lam:2*Math.PI/p.k,T:2*Math.PI/p.w,v:p.w/p.k,f:p.w/(2*Math.PI)}),
  text:(p,G,T)=>`A ${T("trans","transverse wave")} on a string is described by ${waveEq(p,G)}, with everything in ${T("si","SI units")}. Find (a) its wavelength λ, (b) its period T, and (c) the speed of the wave along the string.`,
  terms:waveTerms,
  given:waveGiven,
  find:[{sym:LAMW,name:"wavelength",unit:"m",why:"Part (a). The length of one full wave."},{sym:TPER,name:"period",unit:"s",why:"Part (b). The time for one full up-and-down."},{sym:VWV,name:"wave speed",unit:"m/s",why:"Part (c). How fast the wave shape travels."}],
  parts:[
    {id:"lam",label:"(a) Wavelength",sym:LAMW,unit:"m",ans:(p,c)=>c.lam,traps:(p,c)=>clean([[p.k,"That's k itself. The wavelength is λ = 2π ÷ k."],[2*Math.PI*p.k,"Divide 2π by k: λ = 2π ÷ k."],[1/p.k,"Use 2π, not 1: λ = 2π ÷ k."],[c.T,"That's the period: it uses ω, the number next to t. The wavelength uses k, the number next to x."]],c.lam)},
    {id:"T",label:"(b) Period",sym:TPER,unit:"s",ans:(p,c)=>c.T,traps:(p,c)=>clean([[c.f,"That's the frequency f = ω ÷ 2π. The period is the other way up: T = 2π ÷ ω."],[c.lam,"That's the wavelength: it uses k. The period uses ω, the number next to t."],[1/p.w,"Use 2π: T = 2π ÷ ω."],[p.w,"That's ω itself. T = 2π ÷ ω."]],c.T)},
    {id:"v",label:"(c) Speed of the wave",sym:VWV,unit:"m/s",ans:(p,c)=>c.v,traps:(p,c)=>clean([[p.w*p.k,"Divide, don't multiply: v = ω ÷ k (or λ ÷ T)."],[p.k/p.w,"Upside down: v = ω ÷ k."],[p.A*p.w,"That's the fastest the string itself moves up and down (Aω). The wave travels along the string at v = ω ÷ k."]],c.v)}
  ],
  idea:()=>`<p>Every travelling wave has the same shape of equation: y = A cos(kx − ωt) or y = A sin(kx − ωt), sometimes with + instead of −, and with the two terms in either order. So just read off the numbers:</p>
    <ul class="plain"><li><b>A</b>, in front of cos or sin: the amplitude.</li><li><b>k</b>, the number next to x: it sets the wavelength, λ = 2π ÷ k.</li><li><b>ω</b>, the number next to t: it sets the period, T = 2π ÷ ω.</li></ul>
    <p>The wave moves one wavelength every period, so its speed is λ ÷ T, which simplifies to ω ÷ k.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${mi("y")}${OP("=")}${AWV}${OP("")}cos(${KWV}${mi("x")}${OP("−")}${OMEGA}${mi("t")})`)+EQ(`${LAMW}${OP("=")}${FR(`2${PI}`,KWV)}${AND}${TPER}${OP("=")}${FR(`2${PI}`,OMEGA)}${AND}${VWV}${OP("=")}${FR(LAMW,TPER)}${OP("=")}${FR(OMEGA,KWV)}`)+
    legend([[KWV,"wave number: the number next to x","rad/m"],[OMEGA,"angular frequency: the number next to t","rad/s"],[LAMW,"wavelength","m"],[TPER,"period","s"]],"The sign between the two terms only tells you the direction: opposite signs (kx − ωt) move towards +x, the same signs (ωt + kx) towards −x."),
  plug:p=>EQ(`${LAMW}${OP("=")}${FR(`2${PI}`,p.k)}${AND}${TPER}${OP("=")}${FR(`2${PI}`,p.w)}${AND}${VWV}${OP("=")}${FR(p.w,p.k)}`)+calcTip(`2*pi/${p.k}`),
  solution:(p,c)=>steps([
      ["Read off the numbers",`${AWV} = ${p.A} m, &nbsp;${KWV} = ${p.k} rad/m (next to x), &nbsp;${OMEGA} = ${p.w} rad/s (next to t).`],
      ["(a) Wavelength",CALC(`${LAMW} = 2π ÷ ${p.k} = <b>${fmt(c.lam)} m</b>`)],
      ["(b) Period",CALC(`${TPER} = 2π ÷ ${p.w} = <b>${fmt(c.T)} s</b>`)],
      ["(c) Wave speed",CALC(`${VWV} = ${p.w} ÷ ${p.k} = <b>${fmt(c.v)} m/s</b>`)+`<p class="small">It moves ${waveDir(p)}.</p>`]
    ])+checkline(`λ ÷ T = ${fmt(c.lam)} ÷ ${fmt(c.T)} = ${fmt(c.lam/c.T)} m/s, the same speed ✓`)+
    finalAns(`${LAMW} = ${fmt(c.lam)} m, &nbsp;${TPER} = ${fmt(c.T)} s, &nbsp;${VWV} = ${fmt(c.v)} m/s`),
  sheet:[{name:"Reading a travelling wave",eq:`${LAMW}${OP("=")}${FR(`2${PI}`,KWV)},${OP("")}${TPER}${OP("=")}${FR(`2${PI}`,OMEGA)},${OP("")}${VWV}${OP("=")}${FR(OMEGA,KWV)}`,note:"k is next to x, ω is next to t."}],
  takeEq:()=>`${VWV}${OP("=")}${FR(LAMW,TPER)}${OP("=")}${FR(OMEGA,KWV)}`,
  takeaway:"The number next to x is k (λ = 2π/k), the number next to t is ω (T = 2π/ω), and the wave speed is ω/k.",
  link:"Task 5 on your midterm 1 was this kind of equation, y = 0.052 cos(1.89t + 9.5x). Try “The string's own speed” on Medium next.",
  viz:waveViz(),
  scene:waveScene(false)
},

/* ===== The string's own speed (midterm 1, task 5) ===== */
{
  id:"wav-transverse", level:"Medium", title:"The string's own speed", hw:"Midterm 1, task 5",
  base:{A:0.052,w:1.89,k:9.5,form:0},
  random:waveRand,
  calc:p=>({lam:2*Math.PI/p.k,T:2*Math.PI/p.w,v:p.w/p.k,u:p.A*p.w}),
  text:(p,G,T)=>`A ${T("trans","transverse wave")} travelling along a string is given by ${waveEq(p,G)}, where all constants are in ${T("si","SI units")}. What are (a) the wavelength λ, (b) the period T, and (c) the maximal ${T("tv","transverse velocity")} of the string elements?`,
  terms:Object.assign({tv:["Transverse velocity","How fast a bit of the string itself moves up and down. Not the same as the speed of the wave along the string."]},waveTerms),
  given:waveGiven,
  find:[{sym:LAMW,name:"wavelength",unit:"m",why:"Part (a)."},{sym:TPER,name:"period",unit:"s",why:"Part (b)."},{sym:UMX,name:"fastest up-and-down speed of the string",unit:"m/s",why:"Part (c). u for the string itself, to keep it apart from the wave speed v."}],
  parts:[
    {id:"lam",label:"(a) Wavelength",sym:LAMW,unit:"m",ans:(p,c)=>c.lam,traps:(p,c)=>clean([[2*Math.PI*p.k,"Divide 2π by k: λ = 2π ÷ k."],[1/p.k,"Use 2π: λ = 2π ÷ k."],[c.T,"That uses ω (next to t). The wavelength uses k, the number next to x."]],c.lam)},
    {id:"T",label:"(b) Period",sym:TPER,unit:"s",ans:(p,c)=>c.T,traps:(p,c)=>clean([[p.w/(2*Math.PI),"That's the frequency f. The period is T = 2π ÷ ω."],[c.lam,"That uses k (next to x). The period uses ω, the number next to t."],[1/p.w,"Use 2π: T = 2π ÷ ω."]],c.T)},
    {id:"u",label:"(c) Maximal transverse velocity",sym:UMX,unit:"m/s",ans:(p,c)=>c.u,traps:(p,c)=>clean([[c.v,"That's the wave speed ω ÷ k: how fast the shape travels along the string. The string itself moves up and down, fastest at u_max = Aω."],[p.A*p.k,"Use ω (the number next to t), not k: u_max = Aω."],[p.A*p.w*p.w,"That's the maximum acceleration, Aω². The maximum speed is Aω."],[p.A,"That's the amplitude, a distance. The speed is Aω."]],c.u)}
  ],
  idea:()=>`<p>Parts (a) and (b): read the numbers off the equation. The number next to x is k, so λ = 2π ÷ k; the number next to t is ω, so T = 2π ÷ ω.</p>
    <p>Part (c) is about the string itself, not the wave. Each bit of string just moves up and down in simple harmonic motion, with amplitude A and angular frequency ω. In SHM the fastest speed is <b>Aω</b> (as it passes the middle).</p>
    <p>Don't mix this up with the wave speed ω ÷ k, which is how fast the shape moves along the string.</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${LAMW}${OP("=")}${FR(`2${PI}`,KWV)}${AND}${TPER}${OP("=")}${FR(`2${PI}`,OMEGA)}${AND}${UMX}${OP("=")}${AWV}${OMEGA}`)+
    legend([[AWV,"amplitude: the number in front of cos/sin","m"],[KWV,"the number next to x","rad/m"],[OMEGA,"the number next to t","rad/s"],[UMX,"fastest up-and-down speed of the string","m/s"]],`For comparison, the wave speed is ${VWV} = ω ÷ k.`),
  plug:p=>EQ(`${LAMW}${OP("=")}${FR(`2${PI}`,p.k)}${AND}${TPER}${OP("=")}${FR(`2${PI}`,p.w)}${AND}${UMX}${OP("=")}${p.A}${OP("×")}${p.w}`),
  solution:(p,c)=>steps([
      ["Read off the numbers",`${AWV} = ${p.A} m, &nbsp;${KWV} = ${p.k} rad/m (next to x), &nbsp;${OMEGA} = ${p.w} rad/s (next to t).`],
      ["(a) Wavelength",CALC(`${LAMW} = 2π ÷ ${p.k} = <b>${fmt(c.lam)} m</b>`)],
      ["(b) Period",CALC(`${TPER} = 2π ÷ ${p.w} = <b>${fmt(c.T)} s</b>`)],
      ["(c) The string's fastest speed",CALC(`${UMX} = ${AWV}${OMEGA} = ${p.A} × ${p.w} = <b>${fmt(c.u)} m/s</b>`)]
    ])+checkline(`For comparison, the wave travels at ω ÷ k = ${fmt(c.v)} m/s, ${waveDir(p)}. That's a different speed from the string's own up-and-down motion, ${fmt(c.u)} m/s.`)+
    finalAns(`${LAMW} = ${fmt(c.lam)} m, &nbsp;${TPER} = ${fmt(c.T)} s, &nbsp;${UMX} = ${fmt(c.u)} m/s`),
  sheet:[{name:"String elements in a wave",eq:`${UMX}${OP("=")}${AWV}${OMEGA},${OP("")}${sb(mi("a"),"max")}${OP("=")}${AWV}${sq2(OMEGA)}`,note:"How the string itself moves. The wave speed is ω/k."}],
  takeEq:()=>`${UMX}${OP("=")}${AWV}${OMEGA}`,
  takeaway:"Read k (next to x) and ω (next to t). Wavelength 2π/k, period 2π/ω. Each bit of string moves in SHM, so its fastest speed is Aω.",
  link:"This is task 5 of your midterm 1, y = 0.052 cos(1.89t + 9.5x), which you got right. The first numbers on this page are exactly those.",
  viz:waveViz((p,c,t,u)=>`, moving at <b>${fmt(R3(u))} m/s</b> (fastest: ±${fmt(c.u)} m/s, as it passes y = 0)`),
  scene:waveScene(true)
},

/* ===== Tuning a string (tension and wave speed) ===== */
{
  id:"wav-tension", level:"Hard", title:"Tuning a string", hw:"Course topic: waves on a string",
  base:{L:0.65,mg:3,F:80,fp:120},
  random:()=>{const L=pick([0.6,0.65,0.7,0.8,1]),mg=pick([2,3,4,5,6]),F=pick([40,50,60,80,100,120]),v=Math.sqrt(F/(mg/1000/L)),f1=v/(2*L);return {L,mg,F,fp:Math.round(f1*pick([0.8,0.9,1.1,1.2,1.25])/5)*5};},
  calc:p=>{const mu=p.mg/1000/p.L,v=Math.sqrt(p.F/mu),f1=v/(2*p.L);return {mu,v,f1,F2:p.F*Math.pow(p.fp/f1,2)};},
  text:(p,G,T)=>`A string is ${G("L",`${p.L} m`)} long between its two fixed ends and has a mass of ${G("m",`${p.mg} g`)}. It is stretched with a tension of ${G("F",`${p.F} N`)}. Find (a) the speed of waves on the string, (b) the frequency of its ${T("fund","fundamental")}, and (c) the tension needed to make the fundamental ${G("fp",`${p.fp} Hz`)}.`,
  terms:{fund:["Fundamental","The lowest note the string can play: the whole string swings in one hump, with half a wavelength between the fixed ends."]},
  given:p=>[
    {k:"L",sym:LS2,name:"length between the fixed ends",unit:"m",val:p.L,why:"",look:"The length in m."},
    {k:"m",sym:MSTR,name:"mass of the string",unit:"kg",val:p.mg/1000,why:`Convert to kilograms: ${p.mg} g = ${p.mg/1000} kg.`,look:"The mass is in grams. Convert to kilograms.",gtraps:[[p.mg,`Convert to kilograms first: ${p.mg} g = ${p.mg/1000} kg.`]]},
    {k:"F",sym:FTEN,name:"tension",unit:"N",val:p.F,why:"How hard the string is pulled tight.",look:"The force in N."},
    {k:"fp",sym:FP,name:"the frequency you want",unit:"Hz",val:p.fp,why:"For part (c).",look:"The frequency in Hz."}
  ],
  find:[{sym:VWV,name:"wave speed",unit:"m/s",why:"Part (a)."},{sym:F1,name:"fundamental frequency",unit:"Hz",why:"Part (b)."},{sym:FTEN2,name:"new tension",unit:"N",why:"Part (c)."}],
  parts:[
    {id:"v",label:"(a) Wave speed",sym:VWV,unit:"m/s",ans:(p,c)=>c.v,traps:(p,c)=>clean([[Math.sqrt(p.F/(p.mg/p.L)),`Change grams to kilograms first: ${p.mg} g = ${p.mg/1000} kg.`],[Math.sqrt(p.F/(p.mg/1000)),"Use the mass per metre, μ = m ÷ L, not the whole mass."],[p.F/c.mu,"Take the square root: v = √(F ÷ μ)."],[Math.sqrt(p.F*c.mu),"Divide the tension by μ: v = √(F ÷ μ)."]],c.v)},
    {id:"f1",label:"(b) Fundamental frequency",sym:F1,unit:"Hz",ans:(p,c)=>c.f1,traps:(p,c)=>clean([[c.v/p.L,"In the fundamental, half a wavelength fits on the string: λ = 2L, so f = v ÷ 2L."],[c.v/(4*p.L),"Both ends are fixed, so λ = 2L (not 4L): f = v ÷ 2L."],[c.v*2*p.L,"Divide: f = v ÷ λ = v ÷ 2L."]],c.f1)},
    {id:"F2",label:"(c) Tension for the new frequency",sym:FTEN2,unit:"N",ans:(p,c)=>c.F2,traps:(p,c)=>clean([[p.F*p.fp/c.f1,"The frequency grows with the square root of the tension, so the tension grows with the frequency squared: F′ = F(f′/f)²."],[p.F*Math.sqrt(p.fp/c.f1),"Square the frequency ratio, don't take its root: F′ = F(f′/f)²."],[p.F*Math.pow(c.f1/p.fp,2),"Upside down: a higher note needs more tension, F′ = F(f′/f)²."]],c.F2)}
  ],
  idea:()=>`<p>The speed of a wave on a string depends on how tight it is and how heavy each metre of it is: v = √(F ÷ μ), where μ = m ÷ L is the mass per metre (in kg/m).</p>
    <p>The fundamental is the lowest standing wave: with both ends fixed, half a wavelength fits on the string, so λ = 2L and f = v ÷ 2L.</p>
    <p>For part (c), notice that f is proportional to v, and v to √F. So doubling the frequency needs four times the tension: F′ = F × (f′ ÷ f)².</p>
    <p class="small">Try it now. The next hint gives you the formulas.</p>`,
  formula:()=>EQ(`${MUW}${OP("=")}${FR(MSTR,LS2)}${AND}${VWV}${OP("=")}${SQ(FR(FTEN,MUW),true)}`)+EQ(`${F1}${OP("=")}${FR(VWV,`2${LS2}`)}${AND}${FTEN2}${OP("=")}${FTEN}${PAREN(FR(FP,F1))}<sup>2</sup>`)+
    legend([[MUW,"mass per metre of string","kg/m"],[FTEN,"tension","N"],[F1,"fundamental frequency","Hz"],[FP,"the new frequency","Hz"]],"Convert grams to kilograms before working out μ."),
  plug:(p,c)=>EQ(`${MUW}${OP("=")}${FR(p.mg/1000,p.L)}${AND}${VWV}${OP("=")}${SQ(FR(p.F,MUW),true)}`)+EQ(`${F1}${OP("=")}${FR(VWV,`2${OP("×")}${p.L}`)}${AND}${FTEN2}${OP("=")}${p.F}${OP("×")}${PAREN(FR(p.fp,F1))}<sup>2</sup>`),
  solution:(p,c)=>steps([
      ["Mass per metre",CALC(`${MUW} = ${p.mg/1000} ÷ ${p.L} = ${fmt(c.mu)} kg/m`)],
      ["(a) Wave speed",CALC(`${VWV} = √(${p.F} ÷ ${fmt(c.mu)}) = <b>${fmt(c.v)} m/s</b>`)],
      ["(b) Fundamental: λ = 2L",CALC(`${F1} = ${fmt(c.v)} ÷ (2 × ${p.L}) = <b>${fmt(c.f1)} Hz</b>`)],
      ["(c) Tension for "+p.fp+" Hz",CALC(`${FTEN2} = ${p.F} × (${p.fp} ÷ ${fmt(c.f1)})² = <b>${fmt(c.F2)} N</b>`)]
    ])+checkline(`With the new tension: v = √(${fmt(c.F2)} ÷ ${fmt(c.mu)}) = ${fmt(Math.sqrt(c.F2/c.mu))} m/s, and f = v ÷ 2L = ${fmt(Math.sqrt(c.F2/c.mu)/(2*p.L))} Hz ✓`)+
    finalAns(`${VWV} = ${fmt(c.v)} m/s, &nbsp;${F1} = ${fmt(c.f1)} Hz, &nbsp;${FTEN2} = ${fmt(c.F2)} N`),
  sheet:[{name:"Waves on a string",eq:`${VWV}${OP("=")}${SQ(FR(FTEN,MUW),true)},${OP("")}${MUW}${OP("=")}${FR(MSTR,LS2)}`,note:"Tighter or lighter string: faster waves, higher notes."},{name:"Fundamental (both ends fixed)",eq:`${F1}${OP("=")}${FR(VWV,`2${LS2}`)}`,note:"Frequency grows with √tension."}],
  takeEq:()=>`${F1}${OP("=")}${FR("1",`2${LS2}`)}${SQ(FR(FTEN,MUW),true)}`,
  takeaway:"v = √(F/μ) with μ = m/L, the fundamental has λ = 2L, and since f ∝ √F the tension scales with f².",
  link:"“Guitar string” (Easy) uses the same f = v ÷ 2L with the wave speed given. Here you work the speed out from the tension.",
  viz:viz.slider((p,c)=>({note:"Drag the tension. Four times the tension only doubles the frequency.",label:"Tension",unit:"N",min:Math.round(p.F/4),max:4*p.F,step:1,value:p.F,
    bars:[{label:"Fundamental frequency (full bar = at the highest tension)",segs:[{cls:"seg-ke",frac:x=>Math.sqrt(x/(4*p.F))}]}],read:x=>`${F1} = <b>${fmt(R3(Math.sqrt(x/c.mu)/(2*p.L)))} Hz</b>`})),
  scene:{still:0.3,draw(K,t,p){const x0=60,x1=470,y0=96,px=490,r=14;
    K.rect(x0-10,y0-30,10,60,{fill:"ink2",c:false});K.line(x1,y0-6,x1,y0+50,{c:"ink2",w:3});
    const amp=26*Math.cos(2*Math.PI*1.6*t),pts=[];for(let i=0;i<=80;i++){const s=i/80;pts.push([x0+(x1-x0)*s,y0+amp*Math.sin(Math.PI*s)]);}
    K.poly(pts,{c:"heat",w:2});K.line(x1,y0,px,y0-0,{w:1.6});K.circle(px,y0+r,r,{fill:"card",c:"ink",w:2});K.line(px+r,y0+r,px+r,150,{w:1.6});
    K.rect(px+r-18,150,36,40,{fill:"marker",c:"ink",w:1.6,r:3});K.text(`${p.F} N`,px+r,170,{size:10,bold:true,c:"#14244a"});
    K.dim(x0,x1,176,`${p.L} m`);K.tag(`${p.mg} g`,(x0+x1)/2,40,{size:11});}}
}
]);
})();
