/* Shared tools for the physics questions.
   Each file in physics/topics/ adds its questions with PHYS.add("Topic", [ ...questions ]).
   physics/start.js then starts the page with every question, in course order.
   See ADDING-QUESTIONS.md for how to add a question or a topic. */
window.PHYS=(function(){
"use strict";
const {fmt,mi,viz,KE}=HL;

/* ---------- small helpers for writing questions ---------- */
const R3=n=>Math.round(n*1000)/1000;
/* Mistake checks ("traps") are [wrong value, message]. clean() drops traps that are too close to the right answer to ever fire. */
const clean=(list,ans)=>list.filter(t=>t&&Number.isFinite(t[0])&&Math.abs(t[0]-ans)>0.03*Math.abs(ans)+1e-9);
/* a number in brackets when it's negative: (−3) */
const pr=x=>x<0?`(−${fmt(-x)})`:fmt(x);
/* a list of numbers written as a sum: 3 − 2 + 5 */
const sumTxt=vals=>{let s="";vals.forEach((v,i)=>{if(i===0)s=(v<0?"−":"")+fmt(Math.abs(v));else s+=` ${v<0?"−":"+"} ${fmt(Math.abs(v))}`;});return s;};

/* ---------- "See it" panels shared by several questions (a question picks one with visual:"name") ---------- */
const VIZ={
  speed:q=>viz.slider((p,c)=>({note:`Drag the time slider and watch her speed grow by ${p.a} m/s every second.`,label:"Time",unit:"s",min:0,max:p.t,step:0.1,value:p.t,
    bars:[{label:"Speed",segs:[{cls:"seg-ke",frac:x=>(p.v0+p.a*x)/c.v}]}],read:x=>`${mi("v")} = ${p.v0} + ${p.a} × ${fmt(R3(x))} = <b>${fmt(R3(p.v0+p.a*x))} m/s</b>`})),
  ke:q=>viz.slider((p,c)=>({note:"Drag the speed slider. Double the speed and the energy goes up four times.",label:"Speed",unit:"m/s",min:0,max:2*p.vf,step:0.5,value:p.vf,
    bars:[{label:"Kinetic energy (full bar = double the final speed)",segs:[{cls:"seg-ke",frac:x=>(x*x)/(4*p.vf*p.vf)}]}],
    read:x=>`At ${fmt(x)} m/s: ${KE} = ½ × ${fmt(p.m)} × ${fmt(x)}² = <b>${fmt(0.5*p.m*x*x)} J</b>${x>0?`, which is ${fmt(x*x/(p.vi*p.vi))} times the energy at ${p.vi} m/s`:""}`})),
  brake:q=>viz.slider((p,c)=>({note:"Drag the time slider through the braking. The car covers most of the distance early on, while it's still fast.",label:"Time since braking started",unit:"s",min:0,max:c.t,step:0.1,value:0,
    bars:[{label:"Speed",segs:[{cls:"seg-ke",frac:x=>Math.max(0,c.v0+c.a*x)/c.v0}]},{label:"Distance so far",segs:[{cls:"seg-alt",frac:x=>(c.v0*x+0.5*c.a*x*x)/c.x}]}],
    read:x=>`Speed: <b>${fmt(R3(Math.max(0,c.v0+c.a*x)))} m/s</b> · distance so far: <b>${fmt(R3(c.v0*x+0.5*c.a*x*x))} m</b> of ${fmt(c.x)} m`})),
  split:q=>viz.slider((p,c)=>({note:"Where does the worker's energy go? Drag the push force. Friction takes the same amount of heat every time, so a harder push leaves more energy for speed.",label:"Push force",unit:"N",min:Math.ceil(c.Ff),max:2*p.F,step:1,value:p.F,
    bars:[{label:"The worker's work (full bar = double the push)",segs:[{cls:"seg-heat",name:"heat from friction",frac:x=>c.Q/(2*p.F*p.d)},{cls:"seg-ke",name:"kinetic energy gained",frac:x=>Math.max(0,x*p.d-c.Q)/(2*p.F*p.d)}]}],
    read:x=>{const W=x*p.d,dK=Math.max(0,R3(W-c.Q));return `Work = ${fmt(x)} × ${p.d} = <b>${fmt(W)} J</b>: ${fmt(c.Q)} J becomes heat and ${fmt(dK)} J speeds the box up. Final speed: <b>${fmt(Math.sqrt(p.vi*p.vi+2*dK/p.m))} m/s</b>`;}})),
  spring:q=>viz.spring(q.spring)
};

/* ---------- drawing helpers for the question animations ---------- */
const F=x=>fmt(x);
const mod=(a,b)=>((a%b)+b)%b;
const fadeIn=(u,a,b)=>Math.max(0,Math.min(1,(u-a)/(b-a)));
function cyclist(K,x,y,ang){
  const r=13;K.wheel(x-19,y-r,r,ang);K.wheel(x+19,y-r,r,ang);
  K.poly([[x-19,y-r],[x-4,y-r],[x+6,y-34],[x-9,y-34],[x-19,y-r]],{c:"blue",w:2.2});
  K.line(x-4,y-r,x-9,y-36,{c:"blue",w:2.2});K.line(x+6,y-34,x+19,y-r,{c:"blue",w:2.2});K.line(x+6,y-34,x+9,y-41,{c:"blue",w:2});
  K.line(x-12,y-37,x-5,y-37,{w:3});K.line(x+5,y-41,x+12,y-41,{w:2.4});
  K.line(x-8,y-38,x+2,y-58,{w:2.6});K.circle(x+5,y-65,6.5,{fill:"card",w:2});
  K.line(x+1,y-54,x+10,y-42,{w:2});
  const pa=ang*0.6;K.line(x-8,y-38,x-4+6*Math.cos(pa),y-r+6*Math.sin(pa),{w:2.2});
}
function speedLines(K,x,y,n,len,alpha){for(let i=0;i<n;i++)K.line(x-len-i*3,y-8-i*9,x-6-i*3,y-8-i*9,{c:"ink2",w:1.4,alpha});}
function springScene(K,t,o){
  const y=172,wallX=40,eq=330,A=o.A||100,T=o.period||1.9;
  const env=o.env?o.env(t):1;const x=eq+A*env*Math.cos(2*Math.PI*t/T)+(o.drift||0);
  K.ground(y,20,580);K.wall(wallX,y-70,y);
  K.line(eq,y-92,eq,y+4,{c:"ink2",w:1.2,dash:[4,5]});K.text("0",eq,y+14,{c:"ink2",size:12});
  if(o.marks){[-1,1].forEach(sg=>{K.line(eq+sg*A,y-86,eq+sg*A,y+2,{c:"heat",w:1.2,dash:[3,4],alpha:0.85});});K.text("−A",eq-A,y+14,{c:"heat",size:12,serif:true,italic:true});K.text("A",eq+A,y+14,{c:"heat",size:12,serif:true,italic:true});}
  K.spring(wallX,y-22,x-28,y-22,{coils:14,amp:9});
  K.rect(x-28,y-44,56,44,{fill:"marker",c:"ink",w:1.6,r:4});
  if(o.mass)K.text(o.mass,x,y-22,{size:12,bold:true,c:"#14244a"});
  if(o.after)o.after(x,y,eq);
  return {x,y,eq};
}
/* hides a loop's restart: the picture fades out over the last `out` seconds of each loop and back in over the first `inn` */
function loopFade(K,t,period,out=0.5,inn=0.3){const u=mod(t,period),a=u<inn?1-u/inn:u>period-out?(u-(period-out))/out:0;if(a>0)K.rect(0,0,K.W||600,K.H||220,{fill:"bg",c:false,alpha:Math.min(1,a)});}
function block(K,x,y,w,h,label,o={}){K.rect(x-w/2,y-h,w,h,{fill:o.fill||"marker",c:"ink",w:1.6,r:3});if(label)K.text(label,x,y-h/2,{size:o.size||12,bold:true,c:"#14244a"});}
function curvedArrow(K,cx,cy,r,a0,a1,o={}){const c=o.c||"heat",dir=a1>a0?1:-1;K.arc(cx,cy,r,a0,a1,{c,w:2,ccw:dir<0});
  const x=cx+r*Math.cos(a1),y=cy+r*Math.sin(a1),tx=-Math.sin(a1)*dir,ty=Math.cos(a1)*dir;K.arrow(x-tx*6,y-ty*6,x+tx*5,y+ty*5,{c,head:9});}

/* ---------- the question list ---------- */
const LEVELS=["Easy","Medium","Hard"],registry=[];
function add(topic,list){
  list.forEach(q=>{
    q.topic=q.topic||topic;
    if(!LEVELS.includes(q.level))throw new Error(`${q.id}: level must be one of ${LEVELS.join(", ")}`);
    if(registry.some(r=>r.id===q.id))throw new Error(`two questions have the id "${q.id}"`);
    if(q.visual){q.viz=VIZ[q.visual](q);delete q.visual;}
    registry.push(q);
  });
}
/* every question, sorted by topic (in the order given), then Easy → Medium → Hard, then the order they were added */
const ordered=topics=>registry.map((q,i)=>({q,i})).sort((a,b)=>(topics.indexOf(a.q.topic)-topics.indexOf(b.q.topic))||(LEVELS.indexOf(a.q.level)-LEVELS.indexOf(b.q.level))||(a.i-b.i)).map(x=>x.q);

return {add,ordered,LEVELS,R3,clean,pr,sumTxt,VIZ,draw:{F,mod,fadeIn,loopFade,cyclist,speedLines,springScene,block,curvedArrow}};
})();
