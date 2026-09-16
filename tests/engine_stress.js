const fs=require('fs'),vm=require('vm'),path=require('path');
global.window=global;
global.localStorage={_m:new Map(),getItem(k){return this._m.has(k)?this._m.get(k):null},setItem(k,v){this._m.set(k,String(v))},removeItem(k){this._m.delete(k)},key(i){return [...this._m.keys()][i]||null},clear(){this._m.clear()},get length(){return this._m.size}};
const ROOT=path.join(__dirname,'..');
for(const f of ['optimizer-data.js','bible-data.js','data.js','strategy-data.js','strategy-logic.js','squad-coverage-engine.js','storage.js','drill-profile.js','players.js','recommendations.js','formation.js','tactics-engine.js','mentor-engine.js','team-plan-engine.js','training-engine.js']) vm.runInThisContext(fs.readFileSync(path.join(ROOT,'js',f),'utf8'),{filename:f});
const {Data:D,BibleData:B,Players:P,Mentor:M,TeamPlan:TP,Tactics:T,Training:TR}=TE5;
const attrs=Object.keys(D.ATTRIBUTE_IDS),roles=['GK','DL','DC','DR','DMC','ML','MC','MR','AML','AMC','AMR','ST'];
let assertions=0;const failures=[];function ok(v,m){assertions++;if(!v)failures.push(m)}
function mk(key,role,seed){let x=(seed*2654435761)>>>0,skills={};for(const a of attrs){x=(x*1664525+1013904223)>>>0;skills[a]=90+(x%61);}const vals=Object.values(skills);return{key,name:key,position:role,roles:[role],relatedRoles:[],age:18+(seed%10),ovr:Math.round(vals.reduce((a,b)=>a+b,0)/vals.length),condition:100,availability:'available',skills,playstyle:null,specialAbilities:[]};}
let squad=roles.map((r,i)=>mk(`${r}-${i}`,r,i+1));squad.push(mk('DC-extra','DC',30),mk('DMC-extra','DMC',31),mk('MC-extra','MC',32),mk('ST-extra','ST',33),mk('AML-extra','AML',34),mk('AMR-extra','AMR',35));
let revision=1;P.all=async()=>squad;P.revision=async()=>String(revision);
M.setStateOverrides(Object.fromEntries(B.MENTORS.map(m=>[m.id,{unlocked:m.id==='wing_commander',level:m.id==='wing_commander'?10:1}])));
function sig(plan){return JSON.stringify({f:plan.formationTemplateId,s:plan.starters.map(x=>`${x.assignedRole}:${x.playerKey}`).sort(),t:plan.tactics?.values||null,m:plan.mentor?.best?.mentor?.id||null});}
(async()=>{
  const configs=[['auto','Low'],['auto','Medium'],['auto','High'],['balanced','Medium'],['attacking','Medium'],['defending','Medium'],['hardAttacking','High'],['hardDefending','High']];
  const first=new Map();const t0=Date.now();
  // Force fresh revision keys so this exercises the real engines rather than only the plan cache.
  for(let round=0;round<2;round++){
    for(const [approach,drainLimit] of configs){revision++;const plan=await TP.buildOptimalPlan({mode:'bestXI',minCondition:60,approach,drainLimit});ok(!plan.error,`Team Plan builds for ${approach}/${drainLimit}`);if(plan.error)continue;ok(plan.starters.length===11,`Team Plan has 11 starters for ${approach}/${drainLimit}`);const k=`${approach}/${drainLimit}`,s=sig(plan);if(round===0)first.set(k,s);else ok(s===first.get(k),`Team Plan deterministic for ${k}`);}
  }
  const normalProfile={drills:Object.fromEntries(D.NORMAL_DRILLS.map(d=>[d.drillId,{unlocked:true,level:3}]))};
  const modes=['maxGrowth','balancedDevelopment','conditionEfficient'];
  for(let seed=1;seed<=1;seed++)for(const role of roles)for(const mode of modes){const p=mk(`train-${role}-${seed}`,role,100+seed*20+roles.indexOf(role));const r=TR.buildIndividualSession({player:p,roles:[role],developmentRole:role,normalProfile,masterStock:{},slots:6,mode});ok(!r.error&&r.drills.length===6,`Training ${mode} builds six for ${role} seed ${seed}`);}
  // Repeated persistence mutations must preserve identity while updating age/skills/OVR.
  const saved=mk('persist-stress','MC',777),savedKey=await P.save(saved);for(let i=0;i<40;i++){const skills=Object.fromEntries(attrs.map((a,j)=>[a,70+((i*7+j*11)%111)]));const expected=D.overallFromSkills(skills,['MC']);const out=await P.updateAgeSkillsOnly(savedKey,{age:18+(i%15),skills});ok(!!out,`Persistence verification cycle ${i}`);const got=await P.get(savedKey);ok(got.ovr===expected,`Derived OVR persists cycle ${i}`);ok(got.name===saved.name&&got.position===saved.position,`Identity preserved cycle ${i}`);}
  const elapsed=Date.now()-t0;ok(elapsed<120000,`Stress pass completes in a non-catastrophic window (${elapsed}ms)`);
  if(failures.length){console.error(`ENGINE STRESS FAIL — ${failures.length}/${assertions}`);for(const f of failures)console.error('-',f);process.exit(1)}
  console.log(`ENGINE STRESS PASS — ${assertions} assertions; ${configs.length*2} fresh Team Plans, ${roles.length*modes.length} Training builds, 40 verified persistence cycles; ${elapsed}ms`);
})().catch(e=>{console.error(e);process.exit(1)});
