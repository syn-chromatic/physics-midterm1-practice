/* Question scenes: an always-on animation of each question's situation.
   They only show the set-up and the numbers already given in the question: no timings, results or hints.
   Keyed by question id, or id/level for questions with an easier and a harder version.
   Each scene draws on a 600 × 220 canvas: draw(K, t, p, c), where K is the engine's drawing kit and t is time in seconds. */
(function(){
"use strict";
const S={};
let F=String;
const mod=(a,b)=>((a%b)+b)%b;
const fadeIn=(u,a,b)=>Math.max(0,Math.min(1,(u-a)/(b-a)));

/* ---------- shared pieces ---------- */
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
function block(K,x,y,w,h,label,o={}){K.rect(x-w/2,y-h,w,h,{fill:o.fill||"marker",c:"ink",w:1.6,r:3});if(label)K.text(label,x,y-h/2,{size:o.size||12,bold:true,c:"#14244a"});}
function curvedArrow(K,cx,cy,r,a0,a1,o={}){const c=o.c||"heat",dir=a1>a0?1:-1;K.arc(cx,cy,r,a0,a1,{c,w:2,ccw:dir<0});
  const x=cx+r*Math.cos(a1),y=cy+r*Math.sin(a1),tx=-Math.sin(a1)*dir,ty=Math.cos(a1)*dir;K.arrow(x-tx*6,y-ty*6,x+tx*5,y+ty*5,{c,head:9});}

/* ===== Kinematics, easier: cyclist speeding up ===== */
S["s1q1/Easier"]={still:3,draw(K,t,p){
  const y=184,u=Math.min(mod(t,5.2),4),pos=k=>50+35*k+17*k*k,x=pos(u);
  K.ground(y,0,600);
  for(let k=0;k<=u+1e-9;k+=0.5)K.circle(pos(k),y-4,2.4,{fill:"ink2",c:false,alpha:0.55});
  K.line(50,y-96,50,y+2,{c:"ink2",w:1.2,dash:[4,4]});K.tag(`${F(p.v0)} m/s`,50,y-106,{size:11});
  speedLines(K,x-26,y-30,3,10+u*8,0.5);
  cyclist(K,x,y,x/13);
  K.arrow(x-8,y-84,x+40,y-84,{c:"heat",w:2.4});K.tag(`${F(p.a)} m/s²`,x+16,y-108,{c:"heat",size:11});
}};

/* ===== Kinematics, harder: braking car ===== */
S["s1q1/Harder"]={still:2.5,draw(K,t,p){
  const y=184,u=mod(t,6.2);let x,br=false;
  if(u<1){x=60+120*u;}else if(u<4){const s=u-1;x=180+120*s-20*s*s;br=true;}else{x=360;br=u<4.8;}
  K.ground(y,0,600);
  K.line(180,y-86,180,y+2,{c:"bad",w:1.4,dash:[4,4]});K.tag("brakes on",180,y-96,{size:11,c:"bad"});
  if(u<1)speedLines(K,x-40,y-20,3,22,0.5);
  K.car(x,y,{brake:br,ang:x/9});
  if(u<1)K.tag(`${p.kmh} km/h`,x,y-64,{size:11});
  if(br&&u<4){K.arrow(x+18,y-66,x-24,y-66,{c:"heat",w:2.4});K.tag(`${p.dec} m/s²`,x+24,y-66,{align:"left",c:"heat",size:11});}
}};

/* ===== Work & energy, easier: car speeding up ===== */
S["s1q2/Easier"]={still:2.5,draw(K,t,p){
  const y=184,u=Math.min(mod(t,5.4),4),x=60+45*u+18.75*u*u;
  K.ground(y,0,600);
  K.tag(`${p.vi} m/s`,60,y-70,{size:11});K.line(60,y-62,60,y+2,{c:"ink2",w:1.2,dash:[4,4]});
  K.tag(`${p.vf} m/s`,540,y-70,{size:11});K.line(540,y-62,540,y+2,{c:"ink2",w:1.2,dash:[4,4]});
  speedLines(K,x-40,y-20,3,10+u*7,0.5);
  K.car(x,y,{ang:x/9});K.tag(`${F(p.m)} kg`,x,y-58,{size:11});
}};

/* ===== Work & energy, harder: pushing a box across a rough floor ===== */
S["s1q2/Harder"]={still:2.2,draw(K,t,p){
  const y=170,u=Math.min(mod(t,6),4.4),m=u/4.4,xb=150+300*(0.35*m+0.65*m*m);
  K.ground(y,20,580);for(let x=26;x<580;x+=9)K.circle(x,y-1.2,1,{fill:"ink2",c:false,alpha:0.5});
  K.dim(150,450,y+30,`${p.d} m`);
  block(K,xb,y,62,50,`${p.m} kg`);
  K.person(xb-56,y,{lean:10,arms:[[22,-34],[22,-28]]});
  K.arrow(xb-30,y-66,xb+18,y-66,{c:"blue",w:2.6});K.tag(`${p.F} N`,xb+22,y-66,{align:"left",size:11});
  K.arrow(xb+26,y+9,xb-14,y+9,{c:"heat",w:2.2});
  for(let i=0;i<3;i++){const hx=xb-20+i*18,ph=mod(t*1.6+i*0.33,1);K.poly([0,1,2,3,4,5].map(k=>[hx+3*Math.sin(k*1.4+t*6),y-4-ph*26-k*3]),{c:"heat",w:1.3,alpha:0.7*(1-ph)});}
  K.tag(`${p.vi} → ${p.vf} m/s`,520,40,{size:11});
}};

/* ===== Oscillations, easier: block on a spring ===== */
S["s1q3/Easier"]={still:0.3,draw(K,t,p){
  springScene(K,t,{mass:`${p.m} kg`});K.tag(`k = ${p.k} N/m`,150,96,{size:11});
}};

/* ===== Oscillations, harder: the block at one moment ===== */
S["s1q3/Harder"]={still:0.25,draw(K,t,p){
  springScene(K,t,{after:(x,y,eq)=>{if(Math.abs(x-eq)>8){K.arrow(eq,y-60,x,y-60,{c:"heat",w:2});K.text("x",(eq+x)/2,y-70,{serif:true,italic:true,c:"heat",size:15});}}});
  K.tag(`k = ${p.k} N/m`,150,96,{size:11});
  K.tag(`x = ${p.x} m,  v = ${p.v} m/s,  a = ${String(p.a).replace("-","−")} m/s²`,300,26,{size:11});
}};

/* ===== Changing acceleration: robot on a track ===== */
S["s4q3"]={still:2,draw(K,t,p){
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
}};

/* ===== Vectors: two arrows in 3D, slowly turning ===== */
S["s5q1"]={still:1,draw(K,t,p){
  const M=Math.max(Math.hypot(...p.a),Math.hypot(...p.b)),s=88/M,cx=300,cy=128,phi=0.6+0.32*t,e=0.42;
  const P=v=>{const xr=v[0]*Math.cos(phi)-v[1]*Math.sin(phi),yr=v[0]*Math.sin(phi)+v[1]*Math.cos(phi);return [cx+s*xr,cy-s*(v[2]*Math.cos(e)+yr*Math.sin(e))];};
  const L=M*1.15;[["x",[L,0,0]],["y",[0,L,0]],["z",[0,0,L]]].forEach(([n,v])=>{const o=P([0,0,0]),q=P(v),qn=P(v.map(z=>-z*0.5));K.line(o[0],o[1],qn[0],qn[1],{c:"rule",w:1.2});K.arrow(o[0],o[1],q[0],q[1],{c:"ink2",w:1.4,head:7});K.text(n,q[0]+(q[0]-o[0])*0.08,q[1]+(q[1]-o[1])*0.08,{serif:true,italic:true,c:"ink2",size:13});});
  const o=P([0,0,0]),A=P(p.a),B=P(p.b);
  K.arrow(o[0],o[1],A[0],A[1],{c:"blue",w:3,head:11});K.arrow(o[0],o[1],B[0],B[1],{c:"heat",w:3,head:11});
  K.text("a",A[0]+10,A[1]-8,{serif:true,italic:true,bold:true,c:"blue",size:16});K.text("b",B[0]+10,B[1]-8,{serif:true,italic:true,bold:true,c:"heat",size:16});
  const vt=(v,n)=>`${n} = (${v.map(z=>String(z).replace("-","−")).join(", ")})`;
  K.tag(vt(p.a,"a"),24,26,{align:"left",size:11,c:"blue"});K.tag(vt(p.b,"b"),24,52,{align:"left",size:11,c:"heat"});
}};

/* ===== Momentum: clay sticks to a block on ice ===== */
S["s3q1"]={still:0.9,draw(K,t,p){
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
}};

/* ===== Elastic collision: a ball rolls into a resting ball ===== */
S["s5q2"]={still:1.2,draw(K,t,p){
  const y=172,u=mod(t,4.6),r1=8+7*Math.cbrt(p.m1),r2=8+7*Math.cbrt(p.m2),x2=360,xs=50,xc=x2-r1-r2,x1=u<2?xs+(xc-xs)*(u/2):xc;
  K.ground(y,20,580);
  K.circle(x2,y-r2,r2,{fill:"blueSoft",c:"ink",w:1.6});K.text(`${p.m2} kg`,x2,y-r2,{size:11,bold:true});
  K.circle(x1,y-r1,r1,{fill:"marker",c:"ink",w:1.6});K.text(`${p.m1} kg`,x1,y-r1,{size:11,bold:true,c:"#14244a"});
  if(u<2){speedLines(K,x1-r1-4,y-r1+12,3,18,0.55);K.arrow(x1-16,y-2*r1-16,x1+26,y-2*r1-16,{c:"heat",w:2.2});K.tag(`${p.v1} m/s`,x1+30,y-2*r1-16,{align:"left",size:11,c:"heat"});}
  else{const k=Math.min(1,(u-2)/0.5);K.circle(x2-r2,y-Math.max(r1,r2),12+30*k,{c:"heat",w:2,alpha:1-k});K.text("?",x2-r2,y-2*Math.max(r1,r2)-34,{size:30,bold:true,c:"heat",alpha:Math.min(1,(u-2.2)/0.4)});}
  if(u>4)K.rect(0,0,600,220,{fill:"bg",c:false,alpha:(u-4)/0.6});
}};

/* ===== Centre of mass: three balls on a triangle ===== */
S["s6q1"]={still:6,draw(K,t,p){
  const u=mod(t,8),O=[220,190],B=[400,190],C=[310,190-180*Math.sqrt(3)/2],rad=m=>6+6*Math.cbrt(m);
  K.arrow(190,190,500,190,{c:"ink2",w:1.2,head:7});K.text("x",510,190,{serif:true,italic:true,c:"ink2"});
  K.arrow(220,208,220,14,{c:"ink2",w:1.2,head:7});K.text("y",232,14,{serif:true,italic:true,c:"ink2"});
  const e=fadeIn(u,0,1.6),seg=(a,b,k)=>K.line(a[0],a[1],a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,{c:"blue",w:2.2});
  seg(O,B,Math.min(1,e*3));seg(B,C,K.clamp(e*3-1,0,1));seg(C,O,K.clamp(e*3-2,0,1));
  [[O,p.m1,"1",[-34,10]],[B,p.m2,"2",[34,10]],[C,p.m3,"3",[34,-4]]].forEach(([P,m,n,off],i)=>{const k=fadeIn(u,1.6+i*0.35,2+i*0.35);if(k<=0)return;
    K.circle(P[0],P[1],rad(m)*k,{fill:"marker",c:"ink",w:1.6});K.tag(`${m} kg`,P[0]+off[0],P[1]+off[1]-12,{size:11,alpha:k});});
  K.tag(`${p.lc} cm`,310,206,{size:11,alpha:fadeIn(u,1,1.6)});
  if(u>7.4)K.rect(0,0,600,220,{fill:"bg",c:false,alpha:(u-7.4)/0.6});
}};

/* ===== Energy conservation: skateboarder in a bowl ===== */
S["s4q1"]={still:0.6,draw(K,t,p){
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
}};

/* ===== Power: speeding up, then cruising against resistance ===== */
S["s6q2"]={still:4.5,draw(K,t,p){
  const y=184,u=mod(t,7.2),cruise=u>=3;K.ground(y,0,600);
  let x;if(!cruise){x=60+240*(u/3)*(u/3);}else x=300;
  const off=cruise?mod((u-3)*170,60):0;for(let k=-1;k<12;k++){const mx=k*60-off;K.line(mx,y+8,mx+26,y+8,{c:"ink2",w:2,alpha:0.5});}
  if(cruise){for(let i=0;i<5;i++){const wx=mod(600-(u-3)*260-i*130,640)-20;K.line(wx,60+i*16,wx+40,60+i*16,{c:"ink2",w:1.4,alpha:0.45});}
    K.arrow(x+64,y-26,x+38,y-26,{c:"heat",w:2.4});K.tag(`${p.Fd} N`,x+70,y-26,{align:"left",size:11,c:"heat"});K.tag(`steady ${p.vc} m/s`,x,y-64,{size:11});}
  else{speedLines(K,x-40,y-20,3,8+u*9,0.5);K.tag(`0 → ${p.v} m/s`,x,y-64,{size:11});}
  K.car(x,y,{ang:cruise?u*12:x/9});K.tag(`${F(p.m)} kg`,60,30,{align:"left",size:11});
}};

/* ===== Rotation: a spinning flywheel and a brake ===== */
S["s3q2"]={still:1,draw(K,t,p){
  const u=mod(t,6.4),cx=250,cy=112,R=78;let th,braking=false;
  if(u<2)th=6*u;else if(u<5){const s=u-2;th=12+6*s-s*s;braking=true;}else th=21;
  K.circle(cx,cy,R,{fill:"blueSoft",c:"ink",w:2.4});K.circle(cx,cy,R-10,{c:"ink2",w:1});
  for(let i=0;i<6;i++){const a=th+i*Math.PI/3;K.line(cx,cy,cx+(R-10)*Math.cos(a),cy+(R-10)*Math.sin(a),{w:2});}
  K.circle(cx,cy,7,{fill:"ink",c:false});
  const ra=-0.6;K.line(cx,cy,cx+R*Math.cos(ra),cy+R*Math.sin(ra),{c:"heat",w:1.6,dash:[4,3]});K.tag(`R = ${p.R} m`,cx+R*Math.cos(ra)+8,cy+R*Math.sin(ra)-14,{align:"left",size:11});
  const bx=braking?cx+R+2:cx+R+18;K.rect(bx,cy-18,14,36,{fill:"ink2",c:"ink",w:1.4,r:3});K.line(bx+14,cy,bx+44,cy,{w:3});
  if(braking){for(let i=0;i<4;i++){const k=mod(u*5+i*0.25,1);K.line(cx+R+2,cy+12+i*2,cx+R+2+12*k,cy+16+18*k,{c:"heat",w:1.4,alpha:1-k});}}
  if(u<2)curvedArrow(K,cx,cy,R+16,-2.3,-1.2);
  K.tag(`${p.M} kg`,cx,cy+R+18,{size:11});K.tag(u<2?`${p.w} rad/s`:braking?`stops in ${p.t} s`:"stopped",520,40,{size:11,c:braking?"bad":"ink"});
}};

/* ===== Angular momentum: student on a spinning stool (seen from above) ===== */
S["s6q3"]=(function(){let th=0,last=0;return {still:1,reset(){th=0;last=0;},draw(K,t,p){
  const dt=Math.max(0,Math.min(0.05,t-last));last=t;const u=mod(t,9);
  const f=u<2.8?1:u<3.8?1-(u-2.8):u<6.6?0:u<7.6?u-6.6:1,w=1.3*(1+0.8*(1-f));th+=w*dt;
  const cx=300,cy=112;K.circle(cx,cy,92,{c:"rule",w:1,dash:[3,5]});K.circle(cx,cy,34,{fill:"bg",c:"ink2",w:1.2});
  const R=30+56*f;[0,Math.PI].forEach(o=>{const a=th+o,x=cx+R*Math.cos(a),y=cy+R*Math.sin(a);K.line(cx,cy,x,y,{c:"ink",w:5});K.circle(x,y,10,{fill:"marker",c:"ink",w:1.6});});
  K.ellipse(cx,cy,16,24,{rot:th,fill:"blueSoft",c:"ink",w:1.8});K.circle(cx,cy,10,{fill:"card",c:"ink",w:1.8});
  K.tag(f>0.5?`I = ${p.I1} kg·m²`:`I = ${p.I2} kg·m²`,470,96,{size:11});if(f>0.99&&u<2.8)K.tag(`${p.w1} rad/s`,470,124,{size:11});
  K.text("seen from above",470,160,{size:11,c:"ink2"});
}};})();

/* ===== Parallel axis theorem: a rod turning about its centre, then about its end ===== */
S["s6q4"]={still:1.2,draw(K,t,p){
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
}};

/* ===== Energy in SHM: block on a spring with its amplitude marked ===== */
S["s6q5"]={still:0.2,draw(K,t,p){
  springScene(K,t,{marks:true,mass:`${p.m} kg`});K.tag(`A = ${p.Acm} cm`,430,40,{size:11,c:"heat"});K.tag(`k = ${p.k} N/m`,150,96,{size:11});
}};

/* ===== Pendulum ===== */
S["s5q3"]={still:0,draw(K,t,p){
  const px=300,py=18,len=150,th=0.36*Math.cos(2*Math.PI*t/2.3),r=7+6*Math.cbrt(p.m),bx=px+len*Math.sin(th),by=py+len*Math.cos(th);
  K.ceiling(py,240,360);K.arc(px,py,len,Math.PI/2-0.4,Math.PI/2+0.4,{c:"rule",w:1,dash:[3,5]});
  K.line(px,py,px,py+len+10,{c:"rule",w:1,dash:[2,5]});
  K.line(px,py,bx,by,{w:1.8});K.circle(bx,by,r,{fill:"marker",c:"ink",w:1.6});
  K.tag(`L = ${p.L} m`,px+(bx-px)*0.5-46,py+len*0.5,{size:11});K.tag(`${p.m} kg`,bx+r+26,by,{size:11});
}};

/* ===== Damped oscillations: amplitude dying away ===== */
S["s7q1"]={still:0,draw(K,t,p){
  const u=mod(t,9),fade=u>8.4?(u-8.4)/0.6:0;
  springScene(K,u,{env:s=>Math.exp(-0.32*s),mass:`${p.m} kg`,after:(x,y,eq)=>{
    K.line(eq+100,y-84,eq+100,y+2,{c:"heat",w:1.2,dash:[3,4]});K.tag(`A₀ = ${p.A0} cm`,eq+100,y-94,{size:11,c:"heat"});
    for(let i=0;i<3;i++){const ph=mod(u*2+i*0.33,1);K.line(x+34+ph*30,y-36+i*12,x+44+ph*30,y-36+i*12,{c:"ink2",w:1.2,alpha:0.6*(1-ph)});}}});
  K.tag(`k = ${p.k} N/m`,150,96,{size:11});
  if(fade>0)K.rect(0,0,600,220,{fill:"bg",c:false,alpha:fade});
}};

/* ===== Damped frequency: block on a spring in a thick liquid ===== */
S["s7q2"]={still:0.4,draw(K,t,p){
  const u=mod(t,5.6),cx=300,eq=150,y=eq+44*Math.exp(-1.1*u)*Math.cos(6.2*u);
  K.ceiling(14,250,350);
  K.rect(220,96,160,118,{fill:"blueSoft",c:"ink",w:2,r:4});K.line(222,104,378,104,{c:"ink2",w:1,alpha:0.6});
  K.spring(cx,14,cx,y-16,{coils:12,amp:8,c:"blue"});
  K.rect(cx-24,y-16,48,32,{fill:"marker",c:"ink",w:1.6,r:3});K.text(`${p.m} kg`,cx,y,{size:11,bold:true,c:"#14244a"});
  for(let i=0;i<7;i++){const ph=mod(u*0.5+i*0.143,1),bx=232+i*22+4*Math.sin(u*3+i);K.circle(bx,210-ph*100,2+i%2,{c:"ink2",w:1,alpha:0.6*(1-ph)});}
  K.tag(`k = ${p.k} N/m`,120,40,{size:11});K.tag(`β = ${p.b} s⁻¹`,480,150,{size:11,c:"heat"});
}};

/* ===== Resonance: a motor shaking a block on a spring ===== */
S["s7q3"]={still:5,draw(K,t,p){
  const u=mod(t,9),w=2*Math.PI/1.1,fade=u>8.4?(u-8.4)/0.6:0,env=38*(1-Math.exp(-u/2.6)),cx=300;
  const mx=cx,my=24,cr=10,ca=w*u,pinx=mx+cr*Math.cos(ca),piny=my+cr*Math.sin(ca),top=48+cr*Math.sin(ca);
  K.rect(mx-24,my-16,48,32,{fill:"bg",c:"ink",w:1.6,r:4});K.circle(mx,my,cr+3,{c:"ink2",w:1.4});K.line(mx,my,pinx,piny,{w:2.4});K.circle(pinx,piny,3,{fill:"heat",c:false});
  K.line(pinx,piny,cx,top,{c:"ink2",w:2});K.rect(cx-10,top-3,20,6,{fill:"ink2",c:false,r:2});
  const by=152+env*Math.sin(ca-Math.PI/2);
  K.spring(cx,top+3,cx,by-18,{coils:12,amp:8});K.rect(cx-26,by-18,52,36,{fill:"marker",c:"ink",w:1.6,r:3});K.text(`${p.m} kg`,cx,by,{size:11,bold:true,c:"#14244a"});
  K.tag(`F₀ = ${p.F} N`,mx+44,my,{align:"left",size:11,c:"heat"});K.tag(`k = ${p.k} N/m`,120,110,{size:11});K.tag(`β = ${p.b} s⁻¹`,480,110,{size:11});
  if(fade>0)K.rect(0,0,600,220,{fill:"bg",c:false,alpha:fade});
}};

/* ===== Standing waves: a plucked guitar string ===== */
S["s3q3"]={still:0.3,draw(K,t,p){
  const u=mod(t,4.4),x1=110,x2=540,yS=104;
  K.ellipse(120,110,92,72,{fill:"bg",c:"ink",w:2});K.ellipse(205,110,38,30,{fill:"card",c:"ink2",w:1});K.circle(170,110,18,{fill:"ink",c:false,alpha:0.85});
  K.rect(200,96,350,28,{fill:"bg",c:"ink",w:1.6,r:3});for(let k=1;k<9;k++)K.line(200+k*40,96,200+k*40,124,{c:"ink2",w:1,alpha:0.6});
  K.rect(x1-6,92,8,24,{fill:"ink",c:false,r:2});K.rect(x2-2,92,6,24,{fill:"ink",c:false,r:2});
  const damp=Math.exp(-0.7*u),pts=[];for(let i=0;i<=120;i++){const s=i/120;let yy=0;for(let n=1;n<=5;n++)yy+=Math.sin(n*Math.PI*0.2)/(n*n)*Math.sin(n*Math.PI*s)*Math.cos(n*2*Math.PI*1.4*u);pts.push([x1+(x2-x1)*s,yS+26*damp*yy]);}
  K.poly(pts,{c:"heat",w:2});
  K.dim(x1,x2,176,`L = ${p.L} m`);K.tag(`waves travel at ${p.v} m/s`,440,30,{size:11});
}};

/* ===== Doppler effect: an ambulance driving past ===== */
S["s4q2"]={still:2.6,draw(K,t,p){
  const y=184,u=mod(t,7.5),x=-70+100*u,px=470;K.ground(y,0,600);
  K.person(px,y,{arms:[[-10,-28],[10,-28]]});K.tag("you",px,y-82,{size:11});
  const bx=x,s=1;K.rect(bx-48,y-52,96,42,{fill:"card",c:"ink",w:1.6,r:6});K.rect(bx+22,y-44,20,16,{fill:"blueSoft",c:"ink2",w:1,r:2});
  K.rect(bx-36,y-40,22,6,{fill:"bad",c:false});K.rect(bx-28,y-48,6,22,{fill:"bad",c:false});K.line(bx-48,y-24,bx+48,y-24,{c:"bad",w:3});
  const on=mod(u*4,1)<0.5;K.rect(bx-14,y-60,12,8,{fill:on?"blue":"bad",c:false,r:2});K.rect(bx+2,y-60,12,8,{fill:on?"bad":"blue",c:false,r:2});
  K.wheel(bx-28,y-9,10,x/10);K.wheel(bx+28,y-9,10,x/10);
  for(let i=0;i<3;i++){const ph=mod(u*1.6+i/3,1);K.arc(bx,y-56,14+ph*40,-0.6,0.6,{c:"heat",w:1.6,alpha:1-ph});K.arc(bx,y-56,14+ph*40,Math.PI-0.6,Math.PI+0.6,{c:"heat",w:1.6,alpha:1-ph});}
  K.tag(`${p.f} Hz`,bx,y-84,{size:11,c:"heat"});K.tag(`${p.vs} m/s`,24,30,{align:"left",size:11});K.arrow(120,30,165,30,{c:"ink",w:2});
}};

/* ===== Sound intensity: a speaker and two listeners ===== */
S["s6q6"]={still:1.4,draw(K,t,p){
  const sx=48,sy=104,scale=500/p.r2,x1=sx+p.r*scale,x2=sx+p.r2*scale;
  for(let i=0;i<5;i++){const ph=mod(t*0.45+i/5,1),R=12+ph*560;K.circle(sx,sy,R,{c:"heat",w:1.8,alpha:0.75*(1-ph)});}
  K.rect(sx-26,sy-20,16,40,{fill:"ink2",c:"ink",w:1.4,r:2});K.poly([[sx-10,sy-12],[sx+6,sy-26],[sx+6,sy+26],[sx-10,sy+12]],{fill:"ink",c:false,close:true});
  [x1,x2].forEach(x=>{K.circle(x,sy,9,{fill:"card",c:"ink",w:1.8});K.ellipse(x-8,sy,3,5,{fill:"ink2",c:false});});
  K.dim(sx,x1,170,`${p.r} m`);K.dim(sx,x2,198,`${p.r2} m`);K.tag(`${p.P} W`,sx-6,sy-44,{size:11});
}};

Object.keys(S).forEach(k=>{const d=S[k].draw;S[k].draw=function(K,t,p,c){F=K.fmt;return d.call(this,K,t,p,c);};});
window.HL_SCENES=S;
})();
