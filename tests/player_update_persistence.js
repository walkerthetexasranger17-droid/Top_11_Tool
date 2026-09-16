const fs=require('fs'),vm=require('vm'),path=require('path');
global.window=global;
global.localStorage={_m:new Map(),getItem(k){return this._m.has(k)?this._m.get(k):null},setItem(k,v){this._m.set(k,String(v))},removeItem(k){this._m.delete(k)},key(i){return [...this._m.keys()][i]||null},clear(){this._m.clear()},get length(){return this._m.size}};
const ROOT=path.join(__dirname,'..');
for(const f of ['optimizer-data.js','bible-data.js','data.js','storage.js','players.js'])vm.runInThisContext(fs.readFileSync(path.join(ROOT,'js',f),'utf8'),{filename:f});
const {Data:D,Players:P,Storage:S}=global.TE5;
let n=0;function ok(c,m){if(!c)throw new Error(m);n++}function eq(a,b,m){ok(JSON.stringify(a)===JSON.stringify(b),`${m}: ${JSON.stringify(a)} != ${JSON.stringify(b)}`)}
(async()=>{
  localStorage.clear();
  const skills=Object.fromEntries(D.OUTFIELD_SKILLS.map(k=>[k,50]));
  const original={name:'Persistence Test',age:21,ovr:144,position:'MC',roles:['MC'],relatedRoles:['AMC'],skills,playstyle:{type:'MEZZALA',level:3,opaque:'keep'},specialAbilities:['Playmaker'],scanner:{version:12,identity:'keep'}};
  const key=await P.save(original,'player:persistence_test');
  const rev0=await P.revision();
  const nextSkills=Object.fromEntries(D.OUTFIELD_SKILLS.map((k,i)=>[k,101+i]));
  const updated=await P.updateAgeSkillsOnly(key,{age:22,skills:nextSkills,scannerLastUpdate:{scope:'test',writeReadbackVerified:true}});
  const stored=await P.get(key),rev1=await P.revision();
  ok(stored&&updated,'updated player can be reloaded');
  ok(stored.age===22,'age persisted');
  eq(stored.skills,nextSkills,'all 15 outfield skills persisted exactly');
  eq(stored.attributes,nextSkills,'attributes mirror updated skills');
  ok(stored.name===original.name,'name preserved');
  const expectedOvr=Math.round(Object.values(nextSkills).reduce((a,b)=>a+b,0)/D.OUTFIELD_SKILLS.length);
  ok(stored.ovr===expectedOvr,'OVR recalculated from the complete updated outfield skill set');
  ok(D.overallFromSkills(nextSkills,['MC'])===expectedOvr,'shared OVR helper matches arithmetic rounded outfield mean');
  eq(stored.roles,original.roles,'natural roles preserved');
  eq(stored.relatedRoles,original.relatedRoles,'related roles preserved');
  ok(P.playstyleName(stored)==='Mezzala','playstyle identity preserved');
  ok(Number(stored.playstyle.level)===3&&stored.playstyle.opaque==='keep','playstyle state preserved');
  eq(stored.specialAbilities,original.specialAbilities,'Special Abilities preserved');
  ok(stored.scanner.identity==='keep','prior scanner metadata preserved');
  ok(stored.scanner.lastUpdate?.writeReadbackVerified===true,'new update audit metadata persisted');
  ok(rev1===rev0+1,'squad revision increments exactly once');
  let rejected=false;try{const broken={...nextSkills};delete broken.Passing;await P.updateAgeSkillsOnly(key,{age:23,skills:broken});}catch(e){rejected=/Passing/.test(String(e.message));}
  ok(rejected,'missing skill cannot partially overwrite player');
  const afterReject=await P.get(key);ok(afterReject.age===22,'failed update leaves existing age untouched');eq(afterReject.skills,nextSkills,'failed update leaves existing skills untouched');ok(afterReject.ovr===expectedOvr,'failed update leaves derived OVR untouched');
  const gkSkills=Object.fromEntries([...D.GK_SKILLS,...D.GK_PHYSICAL].map((k,i)=>[k,80+i]));
  ok(D.overallFromSkills(gkSkills,['GK'])===Math.round(Object.values(gkSkills).reduce((a,b)=>a+b,0)/15),'shared OVR helper uses all 15 goalkeeper-visible skills');
  console.log(`PASS player update persistence: ${n} assertions`);
})().catch(e=>{console.error(e.stack||e);process.exit(1)});
