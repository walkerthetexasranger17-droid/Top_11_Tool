const fs=require('fs'),vm=require('vm'),path=require('path');
global.window=global;global.localStorage={getItem(){return null},setItem(){},removeItem(){},key(){return null},get length(){return 0}};
const ROOT=path.join(__dirname,'..');for(const f of ['optimizer-data.js','bible-data.js','data.js','strategy-data.js','strategy-logic.js','mentor-engine.js'])vm.runInThisContext(fs.readFileSync(path.join(ROOT,'js',f),'utf8'),{filename:f});
const {Data:D,BibleData:B,Mentor:M}=TE5,attrs=Object.keys(D.ATTRIBUTE_IDS);let failures=[],assertions=0;
function ok(c,m){assertions++;if(!c)failures.push(m)}
function p(key,role,base=120){return{key,name:key,position:role,roles:[role],ovr:base,skills:Object.fromEntries(attrs.map(a=>[a,base])),specialAbilities:[],playstyle:null};}
const roles=['GK','DL','DC','DC','DR','DMC','MC','AML','AMC','AMR','ST'];const starters=roles.map((r,i)=>({player:p('p'+i,r),assignedRole:r}));
const tactics={values:{passing:'long',shooting:'box',focus:'both',cross:'high',lost:'counterPress',won:'counter',mentality:'attacking',marking:'zonal',pressing:'high',backLine:'offside',tackling:'aggressive'},drainLimit:'Medium'};
function stateOnly(id,level,unlocked=true){M.setStateOverrides(Object.fromEntries(B.MENTORS.map(m=>[m.id,{unlocked:m.id===id&&unlocked,level:m.id===id?level:1}])));}
// No unlocked mentor must be explicit, never silently rank locked mentors.
M.setStateOverrides(Object.fromEntries(B.MENTORS.map(m=>[m.id,{unlocked:false,level:1}])));let r=M.recommend(starters,tactics);ok(r.error==='no-unlocked-mentors'&&r.best===null,'Locked mentors leaked into recommendation');
// Unlock families exactly at 1 / 5 / 10.
stateOnly('wing_commander',1);r=M.recommend(starters,tactics);ok(r.best?.mentor.id==='wing_commander','Level-1 fixture did not return only unlocked mentor');ok(r.best.activeFamilies.tactic&&!r.best.activeFamilies.attribute&&!r.best.activeFamilies.signature,'Level 1 family gating incorrect');ok(r.best.attributeScore===0&&r.best.signaturePoints===0,'Locked Level-1 families contributed score');
stateOnly('wing_commander',5);r=M.recommend(starters,tactics);ok(r.best.activeFamilies.tactic&&r.best.activeFamilies.attribute&&!r.best.activeFamilies.signature,'Level 5 family gating incorrect');ok(r.best.attributeScore>0&&r.best.signaturePoints===0,'Level-5 Attribute/Signature contribution incorrect');
stateOnly('wing_commander',10);r=M.recommend(starters,tactics);ok(r.best.activeFamilies.tactic&&r.best.activeFamilies.attribute&&r.best.activeFamilies.signature,'Level 10 family gating incorrect');ok(r.best.attributeScore>0,'Level-10 attribute relevance missing');
// Server/opponent-context effects unavailable in own-squad pre-match mode remain exactly zero.
stateOnly('enforcer',10);r=M.recommend(starters,tactics);ok(r.best.tacticalPoints===0,'Makélélé unavailable opponent-context Tactical effect received speculative points');ok(r.best.signaturePoints===0,'Makélélé unavailable Signature effect received speculative points');ok(r.best.attributeScore>0,'Makélélé valid own-XI Attribute family was incorrectly zeroed');
// Special Ability training modifiers must never leak into Mentor Attribute relevance.
stateOnly('wing_commander',10);const before=M.recommend(starters,tactics).best.attributeRawRelevance;starters[7].player.specialAbilities=['Corner Specialist','Dribbler'];const after=M.recommend(starters,tactics).best.attributeRawRelevance;ok(Math.abs(before-after)<1e-12,'Special Ability changed Mentor attribute relevance');starters[7].player.specialAbilities=[];
// Known stamina/condition tradeoffs become less punitive as the user accepts a higher drain budget.
stateOnly('iron_guard',10);const low=M.recommend(starters,tactics,{drainLimit:'Low'}).best,med=M.recommend(starters,tactics,{drainLimit:'Medium'}).best,high=M.recommend(starters,tactics,{drainLimit:'High'}).best;ok(low.tradeoffPoints<=med.tradeoffPoints&&med.tradeoffPoints<=high.tradeoffPoints,'Vidić drain tradeoff is not monotonic Low -> Medium -> High');
// Plan adjustment remains bounded 0..10 regardless of raw relevance.
M.setStateOverrides(Object.fromEntries(B.MENTORS.map(m=>[m.id,{unlocked:true,level:10}])));r=M.recommend(starters,tactics);ok(r.all.every(x=>x.planAdjustment>=0&&x.planAdjustment<=10),'Mentor plan adjustment escaped 0..10 bound');
console.log(JSON.stringify({assertions,failures},null,2));if(failures.length)process.exitCode=1;
