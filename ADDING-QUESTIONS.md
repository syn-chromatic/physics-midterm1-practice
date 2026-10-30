# Adding questions

## How the files fit together

```
index.html                 loads everything below, in this order
engine.js / engine.css     the page itself: hints, answer checks, levels, formula sheet, theme
                           (the math page uses the same two files)
physics/kit.js             shared physics helpers: PHYS.add, levels, "See it" presets, drawing helpers
physics/topics/1-vectors.js … 8-waves.js
                           one file per topic; each holds that topic's questions
physics/start.js           the topic order, and starts the page
```

Questions are shown grouped by topic (in the order of `TOPICS` in `start.js`), then Easy → Medium → Hard inside each topic. The filter at the top shows every question (All) or one level; each level has a colour (Easy green, Medium blue, Hard orange) that also marks its questions in the list.

## Add a question to an existing topic

Open the topic's file in `physics/topics/` and add one object to the list inside `PHYS.add("Topic", [ … ])`. The easiest start is to copy a question at the same level and change it. `nl-push` in `3-newtons-laws.js` is the shortest complete example.

```js
{
  id:"nl-push",                     // unique across the whole site
  level:"Easy",                     // "Easy", "Medium" or "Hard"
  title:"Push across the floor",    // the name in the question list
  hw:"Course topic: Newton's second law",   // small label above the question

  base:{m:4,F:10},                                          // the first numbers shown
  random:()=>({m:pick([2,3,4,5,6]),F:pick([6,8,10,12])}),   // new numbers ("New numbers" button)
  calc:p=>({Fg:p.m*g,FN:p.m*g,a:p.F/p.m}),                  // every result, worked out once

  // G("m", …) marks a number the student lists in hint 1; T("weight", …) is a tappable word
  text:(p,G,T)=>`A ${G("m",`${p.m} kg`)} box … the box's ${T("weight","weight")}? …`,
  terms:{weight:["Weight","The pull of gravity: mass × 9.8 m/s²."]},

  given:p=>[      // hint 1: what the student should list (k matches the G("…") keys in text)
    {k:"m",sym:MM,name:"mass of the box",unit:"kg",val:p.m,why:"…",look:"…",
     gtraps:[[wrongValue,"message if they type this"]]}      // optional
  ],
  find:[{sym:AA,name:"acceleration",unit:"m/s²",why:"Part (c)."}],

  parts:[         // the answer boxes
    {id:"a",label:"(c) Acceleration",sym:AA,unit:"m/s²",
     ans:(p,c)=>c.a,
     traps:(p,c)=>clean([[p.F*p.m,"Divide the force by the mass: a = F ÷ m."]],c.a)}
  ],              // optional per part: tol (relative, default 0.02), abs, fmt, closeMsg

  idea:()=>`<p>…the physics in plain words…</p>`,           // hint 2
  formula:()=>EQ(…)+legend([[sym,"meaning","unit"],…]),     // hint 3 (also fills the formula sheet)
  plug:p=>EQ(…)+calcTip(`${p.F}/${p.m}`),                  // hint 4
  solution:(p,c)=>steps([["Title",CALC(`…`)],…])+checkline(`…`)+finalAns(`…`),  // hint 5

  sheet:[{name:"Newton's second law",eq:`${FNET}${OP("=")}${MM}${AA}`,note:"…"}],
  takeEq:()=>`…`,  takeaway:"One line to remember.",
  link:"Where this comes up (a string, or (p,c)=>string).",

  viz:viz.slider(…),        // "See it" panel, or visual:"spring" etc. to use a preset from kit.js
  scene:{still:2,draw(K,t,p){ … }}   // the animation: K draws, t is the time in seconds
}
```

Rules that keep things working:

- Traps are `[wrong value, message]`. Wrap the list in `clean(list, rightAnswer)` so a trap that lands on the right answer is dropped.
- The animation must not give away the answer. It shows the situation, not the result.
- Symbols (like `MM`, `AA`) and `const g=9.8` sit at the top of each topic file; add new ones there.

## Add a new topic

1. Create `physics/topics/9-your-topic.js`. Copy the first 8 lines of any topic file (the imports), then:
   ```js
   PHYS.add("Your topic",[ { …question… }, { …question… } ]);
   })();
   ```
2. In `index.html`, add `<script src="physics/topics/9-your-topic.js?v=10"></script>` before `physics/start.js`.
3. In `physics/start.js`, add `"Your topic"` to `TOPICS` where it should appear in the list.

## Check your work

Open the page, then in the browser console run:

```js
HL.selfTest()
```

It tries every question with its first numbers and 60 random sets, and lists anything wrong: a missing field, a number that isn't a number, a trap equal to the right answer, a marked number with no matching `given` entry. An empty list `[]` means all good.

When you change a file, raise the `?v=10` in `index.html` (for example to `?v=11`) so browsers load the new version.
