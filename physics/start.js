/* Starts the page with every question from physics/topics/, grouped by topic in course order.
   To add a topic: create its file in physics/topics/, add a <script> line for it in index.html,
   and put its name in TOPICS below (the position sets where it appears in the list). */
(function(){
"use strict";
const TOPICS=["Vectors","Kinematics","Newton's laws","Momentum","Work & energy","Rotation","Oscillations","Waves"];
HL.start({
  id:"physics-practice",
  title:"Physics Midterm 1 Practice",
  levels:PHYS.LEVELS,          /* the difficulty filter at the top: Easy / Medium / Hard */
  levelAll:true,               /* …plus "All", which shows every question */
  groupByTopic:true,           /* topic headings in the question list */
  random:true,
  newAll:true,
  themeToggle:true,
  linkLabel:"Where this comes up",
  questions:PHYS.ordered(TOPICS)
});
})();
