const fs=require('fs'),vm=require('vm'),path=require('path');
global.window=global;
global.localStorage={_m:new Map(),getItem(k){return this._m.has(k)?this._m.get(k):null},setItem(k,v){this._m.set(k,String(v))},removeItem(k){this._m.delete(k)},key(i){return [...this._m.keys()][i]||null},clear(){this._m.clear()},get length(){return this._m.size}};
const ROOT=path.join(__dirname,'..');
for(const f of ['optimizer-data.js','bible-data.js','data.js','strategy-data.js','strategy-logic.js','squad-coverage-engine.js','storage.js','players.js','recommendations.js','formation.js','tactics-engine.js','mentor-engine.js','team-plan-engine.js']){
  vm.runInThisContext(fs.readFileSync(path.join(ROOT,'js',f),'utf8'),{filename:f});
}
const {Data:D,BibleData:B,Players:P,Mentor:M,TeamPlan:TP,Tactics:T}=TE5;
const attrs=Object.keys(D.ATTRIBUTE_IDS);let assertions=0,failures=[];
function ok(c,m){assertions++;if(!c)failures.push(m);}
function mk(key,role,value=120,playstyle=null,abilities=[]){return{key,name:key,position:role,roles:[role],relatedRoles:[],age:20,ovr:value,condition:100,availability:'available',skills:Object.fromEntries(attrs.map(a=>[a,value])),playstyle:playstyle?{type:playstyle.type||playstyle,level:playstyle.level??3}:null,specialAbilities:[...abilities]};}
function base(){return[
  mk('gk','GK',118),mk('dl','DL',120),mk('dc1','DC',124),mk('dc2','DC',122),mk('dr','DR',121),
  mk('dmc','DMC',125),mk('mc','MC',126),mk('aml','AML',130),mk('amc','AMC',128),mk('amr','AMR',129),mk('st','ST',132)
];}
// Keep one context-sensitive Mentor unlocked so hidden semantic signals are tested through the full chain.
M.setStateOverrides(Object.fromEntries(B.MENTORS.map(m=>[m.id,{unlocked:m.id==='deadball_specialist',level:m.id==='deadball_specialist'?10:1}])));
let current=base(),revision=1;P.all=async()=>current;P.revision=async()=>String(revision);
const opts={mode:'matchReadyXI',minCondition:60,drainLimit:'High',approach:'auto',drainProfile:T.DRAIN_PROFILE_LIVE};
function decisionSignature(plan){return JSON.stringify({formation:plan.formationTemplateId,starters:plan.starters.map(x=>`${x.assignedRole}:${x.playerKey}`).sort(),tactics:{approach:plan.tactics.approachKey,values:plan.tactics.values,score:+plan.tactics.decisionScore.toFixed(9)},mentor:plan.mentor.best?{id:plan.mentor.best.mentor.id,adjustment:+plan.mentor.best.planAdjustment.toFixed(9)}:null,setPieces:plan.setPieces.assignments});}
(async()=>{
  const baseline=await TP.buildOptimalPlan(opts);ok(!baseline.error,'Baseline all-in-one plan failed to build');const sig=decisionSignature(baseline);

  // Locked Playstyle is owned metadata only: it must not influence Formation/Tactics/Mentor choice.
  current=base();current.find(p=>p.key==='st').playstyle={type:'POACHER',level:1};revision++;
  let got=await TP.buildOptimalPlan(opts);ok(decisionSignature(got)===sig,'Locked Poacher changed the all-in-one Team Plan decision');

  // A genuinely unused weak reserve must not leak into downstream XI-only systems.
  current=[...base(),mk('weak-amr','AMR',5,{type:'WINGER',level:3},['Shadow Striker'])];revision++;
  got=await TP.buildOptimalPlan(opts);ok(decisionSignature(got)===sig,'Unused weak reserve changed the all-in-one Team Plan decision');

  // Match-ready filtering happens before Formation and must protect every downstream system.
  const unavailable=mk('elite-unavailable','ST',250,{type:'POACHER',level:3},['Shadow Striker']);unavailable.availability='injured';
  current=[...base(),unavailable];revision++;
  got=await TP.buildOptimalPlan(opts);ok(decisionSignature(got)===sig,'Unavailable elite player leaked into the Match Ready all-in-one plan');

  const incomplete=mk('elite-incomplete','ST',250,{type:'POACHER',level:3},['Shadow Striker']);incomplete.skills.Aggression=null;
  current=[...base(),incomplete];revision++;
  got=await TP.buildOptimalPlan(opts);ok(decisionSignature(got)===sig,'Incomplete elite player leaked into the all-in-one plan');

  console.log(JSON.stringify({assertions,failures,baseline:{formation:baseline.formationTemplateId,tactics:baseline.tactics.values,mentor:baseline.mentor.best?.mentor.id||null}},null,2));if(failures.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
