const fs=require('fs'),vm=require('vm'),path=require('path');
global.window=global;global.localStorage={_m:new Map(),getItem(k){return this._m.has(k)?this._m.get(k):null},setItem(k,v){this._m.set(k,String(v))},removeItem(k){this._m.delete(k)},key(i){return [...this._m.keys()][i]||null},clear(){this._m.clear()},get length(){return this._m.size}};
const ROOT=path.join(__dirname,'..');for(const f of ['optimizer-data.js','bible-data.js','data.js','strategy-data.js','strategy-logic.js','squad-coverage-engine.js','scanner-engine.js','storage.js','drill-profile.js','players.js','training-engine.js','team-training-engine.js','recommendations.js','formation.js','tactics-engine.js','mentor-engine.js','team-plan-engine.js'])vm.runInThisContext(fs.readFileSync(path.join(ROOT,'js',f),'utf8'),{filename:f});
const {Data:D,Strategy:S,Training:T}=global.TE5;const attrs=Object.keys(D.ATTRIBUTE_IDS);
function player(role,ps,val=100){return{key:`${role}-${ps||'BASE'}`,name:`${role} ${ps||'Base'}`,position:role,roles:[role],relatedRoles:[],age:18,ovr:val,skills:Object.fromEntries(attrs.map(a=>[a,val])),specialAbilities:[],playstyle:ps?{type:ps,level:3}:null}}
const normalProfile={drills:Object.fromEntries(D.NORMAL_DRILLS.map(d=>[d.drillId,{unlocked:true,level:3}]))};
const playstylePairs=[];for(const [ps,roles] of Object.entries(S.PLAYSTYLE_TIERS))for(const role of Object.keys(roles))playstylePairs.push([role,ps]);
const basePairs=Object.keys(S.ROLE_TIERS).map(role=>[role,null]);
const pairs=[...basePairs,...playstylePairs];
const tierOrder={S:0,A:1,B:2,C:3};let failures=[];let rows=[];
for(const [role,ps] of pairs){const p=player(role,ps);const h=S.trainingPriorityProfile(p,{developmentRole:role});const needs=T.buildNeeds(h.whiteAttributes,p.skills,h.priorities,D.POSITION_WHITE[role]);const byTier={S:[],A:[],B:[],C:[]};for(const r of h.priorities)byTier[r.tier].push({attr:r.attribute,ratio:r.targetRatio,need:needs.need[r.attribute],gap:needs.gaps[r.attribute]});
  const av=t=>byTier[t].length?byTier[t].reduce((a,x)=>a+x.need,0)/byTier[t].length:null;
  const avs={S:av('S'),A:av('A'),B:av('B'),C:av('C')};
  const present=['S','A','B','C'].filter(t=>byTier[t].length);for(let i=0;i<present.length-1;i++){if(!(avs[present[i]]>avs[present[i+1]]+1e-9))failures.push(`${role}+${ps}: flat need ${present[i]} !> ${present[i+1]} (${avs[present[i]]} vs ${avs[present[i+1]]})`)}
  // Put the first S skill exactly at its first-pass target, then verify catch-up pressure collapses.
  const firstS=byTier.S[0]?.attr;let maintenance=null;if(firstS){const p2=player(role,ps);p2.skills[firstS]=needs.targets[firstS];const h2=S.trainingPriorityProfile(p2,{developmentRole:role});const n2=T.buildNeeds(h2.whiteAttributes,p2.skills,h2.priorities,D.POSITION_WHITE[role]);maintenance=n2.need[firstS];if(!(maintenance<avs.S*.20))failures.push(`${role}+${ps}: developed S ${firstS} still has excessive need ${maintenance} vs flat S avg ${avs.S}`);}
  // One freak non-S white must not move the whole player's target shape. Use the last
  // available lower-tier attribute so this probes the anchor rather than an S skill.
  const nonS=h.priorities.filter(x=>x.tier!=='S'&&!x.secondaryRoleOnly);if(nonS.length>=3){const outlier=nonS[nonS.length-1].attribute,p3=player(role,ps);p3.skills[outlier]=200;const h3=S.trainingPriorityProfile(p3,{developmentRole:role});const n3=T.buildNeeds(h3.whiteAttributes,p3.skills,h3.priorities,D.POSITION_WHITE[role]);const delta=Math.abs(n3.normalizedReference-needs.normalizedReference);if(delta>1e-6)failures.push(`${role}+${ps}: one non-S outlier ${outlier} moved target anchor by ${delta}`);}
  const sess=T.buildIndividualSession({player:p,roles:[role],position:role,skills:p.skills,normalProfile,masterStock:{},slots:6,mode:'maxGrowth',developmentRole:role});if(sess.error)failures.push(`${role}+${ps}: session error ${sess.error}`);
  const credits={S:0,A:0,B:0,C:0};const tierBy=Object.fromEntries(h.priorities.map(x=>[x.attribute,x.tier]));for(const [a,c] of Object.entries(sess.meta?.sessionCredit||{}))credits[tierBy[a]||'C']+=Number(c)||0;
  if(!(credits.S>0))failures.push(`${role}+${ps}: six-drill session gives zero S-tier credit`);
  rows.push({role,ps,S:avs.S,A:avs.A,B:avs.B,C:avs.C,maintenance,credits,drills:(sess.drills||[]).map(x=>`${x.name||x.drillName||x.drillId}[${x.intensity||x.difficulty||''}]`)})
}
console.log(JSON.stringify({profiles:pairs.length,baseProfiles:basePairs.length,playstyleProfiles:playstylePairs.length,failures,rows},null,2));if(failures.length)process.exitCode=1;
