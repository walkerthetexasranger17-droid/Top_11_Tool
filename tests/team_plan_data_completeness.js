const fs=require('fs'),vm=require('vm'),path=require('path');
global.window=global;global.localStorage={_m:new Map(),getItem(k){return this._m.has(k)?this._m.get(k):null},setItem(k,v){this._m.set(k,String(v))},removeItem(k){this._m.delete(k)},key(i){return [...this._m.keys()][i]||null},clear(){this._m.clear()},get length(){return this._m.size}};
const ROOT=path.join(__dirname,'..');for(const f of ['optimizer-data.js','bible-data.js','data.js','strategy-data.js','strategy-logic.js','squad-coverage-engine.js','storage.js','players.js','recommendations.js','formation.js','tactics-engine.js','mentor-engine.js','team-plan-engine.js'])vm.runInThisContext(fs.readFileSync(path.join(ROOT,'js',f),'utf8'),{filename:f});
const {Data:D,Players:P,Formation:F,TeamPlan:TP}=TE5,A=Object.keys(D.ATTRIBUTE_IDS);let assertions=0,failures=[];function ok(c,m){assertions++;if(!c)failures.push(m)}
function mk(k,r,v=120){return{key:k,name:k,position:r,roles:[r],relatedRoles:[],age:20,ovr:v,skills:Object.fromEntries(A.map(a=>[a,v])),specialAbilities:[],playstyle:null}}
(async()=>{
  const complete=mk('complete-st','ST',130),incomplete=mk('incomplete-st','ST',200);incomplete.skills.Aggression=null; // Aggression is visible outfield data but not an ST role-white.
  ok(F.roleStats(incomplete,'ST')!==null,'Fixture failed: missing non-role-white skill should not invalidate ST role-quality calculation');
  const c1=TP.profileCompleteness(complete),c2=TP.profileCompleteness(incomplete);
  ok(c1.complete===true,'Complete outfield profile was rejected by Team Plan completeness gate');
  ok(c2.complete===false&&c2.missing.includes('Aggression'),'Team Plan completeness gate missed explicit-null visible outfield data');
  const originalAll=P.all;P.all=async()=>[complete,incomplete];
  try{
    const pool=await TP.eligibleSquad('bestXI',60);
    ok(pool.eligible.length===1&&pool.eligible[0].key==='complete-st','Team Plan eligible squad retained an incomplete player');
    ok(pool.readinessWarnings.some(x=>x.includes('incomplete-st')&&x.includes('Aggression')),'Team Plan did not expose an actionable incomplete-profile warning');
  }finally{P.all=originalAll;}
  console.log(JSON.stringify({assertions,failures},null,2));if(failures.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
