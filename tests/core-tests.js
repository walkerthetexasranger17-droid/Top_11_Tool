const fs=require('fs'),vm=require('vm'),path=require('path');
global.window=global;
global.localStorage={_m:new Map(),getItem(k){return this._m.has(k)?this._m.get(k):null},setItem(k,v){this._m.set(k,String(v))},removeItem(k){this._m.delete(k)},key(i){return [...this._m.keys()][i]||null},clear(){this._m.clear()},get length(){return this._m.size}};
const ROOT=path.join(__dirname,'..');
const files=['optimizer-data.js','bible-data.js','data.js','scanner-engine.js','storage.js','drill-profile.js','players.js','training-engine.js','team-training-engine.js','recommendations.js','formation.js','tactics-engine.js','mentor-engine.js','team-plan-engine.js'];
for(const f of files)vm.runInThisContext(fs.readFileSync(path.join(ROOT,'js',f),'utf8'),{filename:f});
const {OptimizerData:OD,BibleData:B,Data:D,Scanner:SC,Storage:S,DrillProfile:DP,Players:P,Training:T,TeamTraining:TT,Recommendations:R,Formation:F,Tactics:TAC,Mentor:M,TeamPlan:TP}=global.TE5;
let passed=0;
function ok(c,m){if(!c)throw new Error(m);passed++;}
function eq(a,b,m){ok(JSON.stringify(a)===JSON.stringify(b),`${m}\n${JSON.stringify(a)} != ${JSON.stringify(b)}`)}
function near(a,b,e,m){ok(Math.abs(a-b)<=e,`${m}: ${a} vs ${b}`)}
const ALL_ATTRS=Object.keys(D.ATTRIBUTE_IDS);
function skills(v=100){return Object.fromEntries(ALL_ATTRS.map(a=>[a,v]));}
function player(key,name,roles,overrides={},relatedRoles=[],playstyle=null){return{key,name,age:22,ovr:100,position:roles[0],roles,relatedRoles,skills:{...skills(100),...overrides},specialAbilities:[],playstyle:playstyle||{type:null,level:0}};}
function greedyScore(players,formation){const remaining=[...players];let sum=0;for(const slot of formation.slots){let best=null,bi=-1;for(let i=0;i<remaining.length;i++)for(const role of F.options(slot)){const c=F.candidate(remaining[i],role);if(c&&(!best||c.roleMean>best.roleMean)){best=c;bi=i;}}if(!best)return-Infinity;sum+=best.roleMean;remaining.splice(bi,1);}return sum;}
function inside(role,x,y){const r=B.ROLE_RECTS[role];return x>=r.minX&&x<r.maxX&&y>=r.minY&&y<r.maxY;}
(async()=>{
  // ---------------------------------------------------------------------------
  // Build 30527 canonical roles / attributes / white maps.
  // ---------------------------------------------------------------------------
  const currentRoles=['GK','DL','DC','DR','DMC','ML','MC','MR','AML','AMC','AMR','ST'];
  eq(D.ALL_POSITIONS,currentRoles,'current role list exactly 12');
  ok(!D.ALL_POSITIONS.includes('DML')&&!D.ALL_POSITIONS.includes('DMR'),'DML/DMR are not selectable current roles');
  const expectedIds={Fitness:1,Strength:2,Aggression:3,Speed:4,Creativity:5,Passing:6,Dribbling:7,Crossing:8,Shooting:9,Finishing:10,Tackling:11,Marking:12,Positioning:13,Heading:14,Bravery:15,Reflexes:16,Agility:17,Anticipation:18,'Rushing Out':19,Communication:20,Throwing:21,Kicking:22,Punching:23,'Aerial Reach':24,Concentration:25};
  eq(D.ATTRIBUTE_IDS,expectedIds,'all 25 attribute IDs exact');
  eq(D.ATTRIBUTE_IDS,OD.whiteSkillMap.attribute_ids,'canonical attributes match captured build package');
  for(const r of currentRoles)eq(D.POSITION_WHITE[r],OD.whiteSkillMap.roles[r].key_attributes,`white map exact ${r}`);
  eq(D.whiteSkillsForRoles(['DC','DR']),['Tackling','Marking','Positioning','Heading','Bravery','Fitness','Strength','Aggression','Crossing','Speed'],'multi-natural-role white set is union');

  // ---------------------------------------------------------------------------
  // Non-destructive / idempotent v5.2.4 -> v5.2.x schema migration.
  // ---------------------------------------------------------------------------
  localStorage.clear();
  const oldKey='player:legacy_test';
  const fullPs={type:'BOX_TO_BOX',level:3,points:1234,isTrainingNextLevel:true,nextLevelPrice:17,isNextLevelAvailable:false,nextLevelProgress:0.42,boost:[11,4],opaqueServerField:'preserve-me'};
  const old={name:'Legacy Test',age:21,ovr:111,position:'MC',roles:['MC','AMC','DMC','ML','DML'],relatedRoles:['ST','DMR'],skills:{...skills(111)},playstyle:fullPs,specialAbilities:['Defensive Wall','Long Shots','Playmaker'],photo:'data:image/png;base64,abc',scanner:{version:2,confidence:{overall:.9}},sourceMeta:{scannerVersion:2,importedAt:'2026-09-09T00:00:00Z'}};
  localStorage.setItem('te:'+oldKey,JSON.stringify(old));
  const oldStringKey='player:legacy_string';localStorage.setItem('te:'+oldStringKey,JSON.stringify({name:'Old String',age:20,ovr:100,position:'ST',roles:['ST'],skills:skills(100),playstyle:'Poacher',specialAbilities:[]}));
  const customNormal={gameDataVersion:D.GAME_DATA_VERSION,updatedAt:'old-normal',drills:Object.fromEntries(D.NORMAL_DRILLS.map(d=>[d.drillId,{unlocked:d.drillId!=='STAY_IN_LANE',level:d.drillId==='FAST_COUNTER_ATTACKS'?2:1}]))};
  const customMaster={gameDataVersion:D.GAME_DATA_VERSION,updatedAt:'old-master',stock:{ATTACKING_MASTERCLASS:7,MIDFIELD_MASTERCLASS:2,PHYSICAL_MASTERCLASS:0,DEFENDING_MASTERCLASS:1}};
  localStorage.setItem('te:training:normal-drills:build_30527',JSON.stringify(customNormal));localStorage.setItem('te:training:master-stock:build_30527',JSON.stringify(customMaster));
  ok(await P.migrate(),'migration runs once');ok(!(await P.migrate()),'migration is idempotent');
  const migrated=await P.get(oldKey);
  eq(migrated.roles,['MC','AMC','DMC','ML'],'all current imported natural roles survive; DML removed only from current set');
  eq(migrated.relatedRoles,['ST'],'all current related roles survive; DMR relegated to legacy metadata');
  ok(migrated.legacyRoles.includes('DML')&&migrated.legacyRoles.includes('DMR'),'legacy DML/DMR warning metadata retained');
  eq(migrated.specialAbilities,old.specialAbilities,'more than two abilities survive migration');
  eq(migrated.playstyle.type,'BOX_TO_BOX','full playstyle type preserved');eq(migrated.playstyle.level,3,'full playstyle level preserved');eq(migrated.playstyle.points,1234,'full playstyle points preserved');eq(migrated.playstyle.boost,[11,4],'full playstyle boost preserved');ok(migrated.playstyle.opaqueServerField==='preserve-me','unknown playstyle fields preserved');
  ok(migrated.photo===old.photo&&migrated.scanner.version===2,'image/scanner metadata preserved');
  const migratedString=await P.get(oldStringKey);ok(P.playstyleName(migratedString)==='Poacher'&&migratedString.playstyle.level===0,'legacy playstyle string becomes object without invented level');
  ok((await DP.getNormal()).drills.FAST_COUNTER_ATTACKS.level===2,'drill level survives player migration');ok((await DP.getMaster()).stock.ATTACKING_MASTERCLASS===7,'Master stock survives player migration');
  const mergedRoles=P.mergeVisibleNaturalRoles(['MC','AMC','DMC','ML'],['MC','DMC','AMC'],3);eq(mergedRoles,['MC','DMC','AMC','ML'],'three-role editor preserves imported natural roles beyond visible editor');
  const keptPs=P.mergePlaystyleState(migrated.playstyle,'Box-to-Box');eq(keptPs.boost,[11,4],'same manual playstyle selection preserves full captured state');ok(keptPs.points===1234,'same playstyle preserves points/progress state');
  const changedPs=P.mergePlaystyleState(migrated.playstyle,'Mezzala');ok(changedPs.type==='MEZZALA'&&changedPs.level===0&&changedPs.points===null,'changed manual playstyle does not inherit old progress or invent new level');
  const stringLevel=P.normalisePlaystyle({type:'POACHER',level:'Intermediate',points:99});ok(stringLevel.level===3&&stringLevel.points===99,'known textual playstyle level maps to confirmed enum');

  // ---------------------------------------------------------------------------
  // Current playstyles and special abilities.
  // ---------------------------------------------------------------------------
  const psExpected={2:['ST'],3:['ST','AMC'],4:['ST'],5:['AMC'],6:['AML','AMR'],7:['AML','AMR','ML','MR'],8:['ML','MR'],9:['MC'],10:['MC'],11:['MC','DMC'],12:['DMC'],13:['DMC'],14:['DC'],15:['DC'],16:['DC'],17:['DL','DR'],18:['DL','DR'],19:[],20:['GK'],21:['GK']};
  ok(B.PLAYSTYLES.length===21,'current playstyle enum including No Playstyle contains IDs 1..21');
  B.PLAYSTYLES.forEach((ps,i)=>ok(ps.id===i+1,`playstyle enum id ${i+1} stable`));
  for(const [id,roles] of Object.entries(psExpected))eq(B.PLAYSTYLES.find(x=>x.id===Number(id)).roles,roles,`playstyle ${id} current eligibility exact`);
  ok(B.PLAYSTYLES.find(x=>x.id===19).offer===false,'Ball Playing GK enum remains recorded but not offered');
  ok(!D.PLAYSTYLES.includes('Ball Playing GK'),'Ball Playing GK not selectable');
  eq(D.playstylesForRoles(['MC']).sort(),['Box-to-Box','Mezzala','Regista'].sort(),'MC playstyle chooser exact');
  ok(D.SPECIAL_ABILITIES.length===19,'19 current special abilities');eq(B.SPECIAL_ABILITIES.map(x=>x.id),Array.from({length:19},(_,i)=>i+1),'special ability IDs 1..19 exact');
  ok(!D.SPECIAL_ABILITIES.includes('Shadow Striker'),'Shadow Striker absent');
  const abilityHeavy=P.cleanPlayer({name:'Abilities',position:'ST',roles:['ST'],skills:skills(),specialAbilities:D.SPECIAL_ABILITIES.slice(0,5)});ok(abilityHeavy.specialAbilities.length===5,'special ability storage is not capped at two');

  // ---------------------------------------------------------------------------
  // Scanner v3 Gemini free-tier boundary: no local OCR/template repair and multi-SA storage.
  // ---------------------------------------------------------------------------
  ok(SC.VERSION===3,'Scanner v3 is the production scanner');
  ok(!SC.checkAggregate([100,100,100,100,100],106).ok,'aggregate mismatch remains a visible failing cross-check');
  const scannerSource=fs.readFileSync(path.join(ROOT,'js','scanner-engine.js'),'utf8');
  ok(/Gemini Scanner is not configured/.test(scannerSource),'scanner requires a configured Gemini API key');
  for(const m of ['3.5','3.6','3.7','3.8'])ok(new RegExp(`gemini-${m.replace('.', '\\.')}\\-flash`).test(scannerSource),`scanner includes confirmed Gemini ${m} Flash`);
  ok(!/gemini-3\.4-flash/.test(scannerSource),'scanner does not invent Gemini 3.4 Flash');
  ok(/models\?pageSize=1000/.test(scannerSource),'scanner discovers models from Gemini models.list');
  ok(/ZERO, ONE, TWO, THREE OR MORE abilities/.test(scannerSource),'scanner prompt explicitly supports multiple special abilities');
  ok(/No paid fallback was used/.test(scannerSource),'free-tier exhaustion has no paid fallback');
  ok(!/scanner-templates|reconcileReadToTarget|classifyGlyph|function readNumber/.test(scannerSource),'legacy local digit-template/repair engine is absent from production scanner');
  ok(!fs.existsSync(path.join(ROOT,'js','scanner-templates.json')),'legacy scanner template file is not packaged');

  // ---------------------------------------------------------------------------
  // Exact pitch geometry and target-role Role Score.
  // ---------------------------------------------------------------------------
  const expectedRects={GK:[0,143,250,750],DL:[179,393,0,250],DC:[143,286,250,750],DR:[179,393,750,1000],DMC:[286,429,250,750],ML:[393,607,0,250],MC:[429,572,250,750],MR:[393,607,750,1000],AML:[607,821,0,250],AMC:[572,715,250,750],AMR:[607,821,750,1000],ST:[715,858,250,750]};
  for(const [r,v] of Object.entries(expectedRects)){eq([B.ROLE_RECTS[r].minX,B.ROLE_RECTS[r].maxX,B.ROLE_RECTS[r].minY,B.ROLE_RECTS[r].maxY],v,`role rectangle ${r} exact`);const c=F.candidate(player('p'+r,r,[r]),r),placed=F.applyCoordinates([c])[0];ok(Number.isInteger(placed.x)&&Number.isInteger(placed.y)&&inside(r,placed.x,placed.y),`${r} generated coordinate stored inside half-open role rectangle`);}
  for(const role of currentRoles){for(const n of [2,3]){const cs=Array.from({length:n},(_,i)=>F.candidate(player(`${role}${i}`,`${role}${i}`,[role]),role));const placed=F.applyCoordinates(cs),rr=B.ROLE_RECTS[role],expected=Array.from({length:n},(_,i)=>Math.max(rr.minY,Math.min(rr.maxY-1,Math.round(rr.minY+(i+1)*(rr.maxY-rr.minY)/(n+1)))));eq(placed.map(x=>x.y),expected,`${role} ${n}-player repeated-role spacing exact/deterministic`);ok(placed.every(x=>inside(role,x.x,x.y)),`${role} repeated-role coords stay inside rectangle`);}}
  const rsA=player('r1','R1',['ST'],{Shooting:150,Finishing:140}),rsB={...player('r2','R2',['ST'],{Shooting:150,Finishing:140}),ovr:250};near(F.roleMean(rsA,'ST'),F.roleMean(rsB,'ST'),1e-12,'OVR never affects Role Score');near(F.roleMean(rsA,'ST'),D.POSITION_WHITE.ST.map(a=>rsA.skills[a]).reduce((a,b)=>a+b,0)/D.POSITION_WHITE.ST.length,1e-12,'Role Score is arithmetic mean of exact target-role key skills');
  ok(F.suitability(player('x','X',['MC'],{},['DMC']),'DMC')==='RELATED','related-role candidate comes only from player data');ok(F.suitability(player('x','X',['MC']),'DMC')==='WRONG','unlisted target role is WRONG and excluded');
  const formationSource=fs.readFileSync(path.join(ROOT,'js','formation.js'),'utf8');ok(!/ADJ|adjacen|0\.55|\.55\s*\+|0\.35/.test(formationSource),'old adjacency/OVR weighted formation model does not survive');

  // Global XI assignment beats or equals greedy on a crafted versatile-player case and never duplicates a player.
  const fixed=[player('gk','GK',['GK']),player('dl','DL',['DL']),player('dc1','DC1',['DC']),player('dc2','DC2',['DC']),player('dr','DR',['DR']),player('ml','ML',['ML']),player('mr','MR',['MR'])];
  const vBase=skills(100);for(const a of D.POSITION_WHITE.MC)vBase[a]=180;for(const a of ['Finishing','Heading','Strength'])vBase[a]=400;const versatile={...player('v','Versatile',['MC','ST']),skills:vBase};
  const m1=player('m1','M1',['MC'],Object.fromEntries(D.POSITION_WHITE.MC.map(a=>[a,179]))),m2=player('m2','M2',['MC'],Object.fromEntries(D.POSITION_WHITE.MC.map(a=>[a,178]))),s1=player('s1','S1',['ST'],Object.fromEntries(D.POSITION_WHITE.ST.map(a=>[a,100]))),s2=player('s2','S2',['ST'],Object.fromEntries(D.POSITION_WHITE.ST.map(a=>[a,90])));
  const crafted=[...fixed,versatile,m1,m2,s1,s2],form=F.FORMATIONS.find(x=>x.id==='442'),globalAssign=F.assign(crafted,form),greedy=greedyScore(crafted,form);ok(!globalAssign.error,'global assignment completes');ok(globalAssign.chosen.length===11&&new Set(globalAssign.chosen.map(x=>x.player.key)).size===11,'global assignment cannot assign one player twice');ok(globalAssign.sumMean>=greedy,'global assignment beats/equals greedy baseline');
  eq(F.FORMATIONS.map(x=>x.id),['442','433','4231','352','41212'],'release uses exactly the five documented formation templates');

  // ---------------------------------------------------------------------------
  // Tactics exact recovered enums/drain arithmetic + exhaustive search checksums.
  // ---------------------------------------------------------------------------
  const tacticExpected={
    passing:[['short',0,7],['long',1,0],['mixed',2,5]],shooting:[['sight',0,0],['box',1,7],['balanced',2,5]],focus:[['left',0,0],['right',1,0],['both',2,7],['center',3,0],['balanced',4,5]],cross:[['low',0,0],['medium',1,0],['high',2,0]],lost:[['counterPress',0,7],['regroup',1,5]],won:[['buildup',0,5],['counter',1,7]],mentality:[['hardDefending',0,7],['defending',1,5],['normal',2,0],['attacking',3,5],['hardAttacking',4,7]],marking:[['man',0,7],['zonal',1,5]],pressing:[['low',0,0],['mid',1,5],['high',2,7]],backLine:[['track',0,5],['offside',1,0]],tackling:[['balanced',0,0],['stay',1,7],['aggressive',2,5]]
  };
  for(const [dim,rows] of Object.entries(tacticExpected))eq(B.TACTICS[dim].map(x=>[x.key,x.id,x.drain]),rows,`tactics ${dim} enum IDs/drain exact`);
  ok(TAC.DIMENSIONS.length===11,'tactics engine has all 11 settings');ok(TAC.option('tackling','stay').drain===7,'Stay On Feet recovered High drain contribution preserved');ok(B.TACTICS.cross.every(x=>x.drain===0),'all Cross Tendency choices recovered Low contribution preserved');
  const lowValues={passing:'long',shooting:'sight',focus:'left',cross:'low',lost:'regroup',won:'buildup',mentality:'normal',marking:'zonal',pressing:'low',backLine:'offside',tackling:'balanced'};const lowDrain=TAC.calculateDrain(lowValues);ok(lowDrain.rawScore===30&&lowDrain.normalized===.30&&lowDrain.drainClass==='Low','exact drain formula starts at 15 and sums 0/5/7 contributions');
  ok(TAC.resolveDrainContribution(0,'High')===7&&TAC.resolveDrainContribution(7,null)===7,'drain override architecture accepts known intensities without inventing overrides');
  const chk=TAC.drainChecksums();eq(chk.all,{Low:963,Medium:77823,High:18414},'full drain class checksum exact');ok(chk.total===97200,'full tactic grid contains 97,200 combinations');
  const perMentality={hardDefending:{Low:36,Medium:14388,High:5016},defending:{Low:111,Medium:15606,High:3723},normal:{Low:669,Medium:17835,High:936},attacking:{Low:111,Medium:15606,High:3723},hardAttacking:{Low:36,Medium:14388,High:5016}};
  for(const m of B.TACTICS.mentality){let n=0;TAC.enumerate(()=>n++,m.key);ok(n===19440,`${m.label}: fixed mentality search space is exactly 19,440`);eq(chk.perMentality[m.key],perMentality[m.key],`${m.label}: drain-class checksum exact`);}

  // ---------------------------------------------------------------------------
  // Team Plan dependency: formation -> tactics -> mentor; approach/drain never reshuffle XI.
  // ---------------------------------------------------------------------------
  for(const k of await S.list('player:'))await S.del(k);await S.del(P.MIGRATION_KEY);await S.del(TP.KEY);await P.migrate();
  const squad=[player(null,'GK',['GK']),player(null,'DL',['DL']),player(null,'DC A',['DC']),player(null,'DC B',['DC']),player(null,'DR',['DR']),player(null,'ML',['ML']),player(null,'MC A',['MC']),player(null,'MC B',['MC']),player(null,'MR',['MR']),player(null,'ST A',['ST']),player(null,'ST B',['ST']),player(null,'Bench AM',['AMC'])];
  squad[6].playstyle={type:'BOX_TO_BOX',level:3,points:2000};squad[9].specialAbilities=['Penalty Kick Specialist'];
  for(const sp of squad){const k=await P.save(sp);sp.key=k;}
  let plan=await TP.buildFormation({templateId:'442',mode:'bestXI'});ok(plan.starters.length===11,'Team Plan formation built');ok(plan.bench.length===1,'Team Plan bench stored');ok(plan.starters.every(s=>Number.isInteger(s.x)&&Number.isInteger(s.y)&&inside(s.assignedRole,s.x,s.y)),'Team Plan stores exact integer X/Y inside assigned role rectangles');
  const lineupBefore=plan.starters.map(x=>x.playerKey+'@'+x.assignedRole+'@'+x.x+','+x.y);
  plan=await TP.updateRecommendations({approach:'balanced',drainLimit:'Medium'});eq(plan.starters.map(x=>x.playerKey+'@'+x.assignedRole+'@'+x.x+','+x.y),lineupBefore,'initial tactics/mentor recommendation leaves formation unchanged');ok(plan.tactics.evaluatedCandidates===19440,'chosen mentality actually enumerates all 19,440 tactic candidates');
  plan=await TP.updateRecommendations({approach:'attacking',drainLimit:'High'});eq(plan.starters.map(x=>x.playerKey+'@'+x.assignedRole+'@'+x.x+','+x.y),lineupBefore,'Approach/Drain change recalculates tactics/mentor without reshuffling formation');ok(plan.tactics.values.mentality==='attacking','Approach locks exact corresponding mentality');ok(['Low','Medium','High'].includes(plan.tactics.drainClass),'exact drain class stored in Team Plan');
  ok(plan.mentor.best&&plan.mentor.alternatives.length>=2,'mentor returns best plus at least two alternatives');ok(plan.mentor.alternatives.every(x=>typeof x.reason==='string'&&x.reason.length>0),'mentor alternatives include why-not reasons');

  // Mentor live facts are preserved exactly; recommendation ordering is direct match -> useful coverage -> level -> stable order.
  ok(B.MENTORS.length===7,'exactly seven documented mentors');
  const rawMentors=JSON.stringify(B.MENTORS.map(x=>({id:x.id,t:x.tactic,a:x.attribute,s:x.signature})));const hydrated=await TP.hydrateStarters(plan);M.recommend(hydrated,plan.tactics);eq(JSON.stringify(B.MENTORS.map(x=>({id:x.id,t:x.tactic,a:x.attribute,s:x.signature}))),rawMentors,'mentor raw effect arrays round-trip without interpretation/loss');
  const architect=B.MENTORS.find(x=>x.id==='architect'),analyst=B.MENTORS.find(x=>x.id==='analyst');ok(M.direct(architect,{values:{passing:'short'}},'Balanced',{})===3,'Architect exact Short direct-match score');ok(M.direct(analyst,{values:{passing:'long'}},'Balanced',{})===3,'Analyst exact Long direct-match score');

  // ---------------------------------------------------------------------------
  // Individual Training Bible model.
  // ---------------------------------------------------------------------------
  await DP.resetToCapturedSnapshot();const normal=await DP.getNormal(),stock=await DP.getMaster();
  ok(D.NORMAL_DRILLS.length===29,'normal drill catalogue count = 29');ok(D.MASTER_CAMPUS_DRILLS.length===4,'Master/Campus catalogue count = 4');eq(D.DRILL_LEVELS.levels.map(x=>[x.level_id,x.training_effect_percent]),[[1,10],[2,20],[3,30]],'regular drill level effects exact');
  const intensityExpected=[[1,'Very Easy',1,.75],[2,'Easy',2,1.5],[3,'Medium',3,2.25],[4,'Hard',4,3],[5,'Very Hard',5,3.75]];eq((D.INTENSITY_SYSTEM.levels||D.INTENSITY_SYSTEM.intensities).map(x=>[x.id,x.ui_name,x.xp_per_player,x.condition_drop]),intensityExpected,'intensity XP/condition map exact');
  const fast=D.NORMAL_DRILLS.find(x=>x.drillId==='FAST_COUNTER_ATTACKS');ok(fast.xpPerPlayer===5&&fast.conditionDrop===3.75&&fast.diff==='Very Hard','Fast Counter-Attacks fixed catalogue exact');near(T.levelEffectPct(3),30,0,'World-class +30% exact');
  const attMaster=D.MASTER_CAMPUS_DRILLS.find(x=>x.drillId==='ATTACKING_MASTERCLASS');ok(attMaster.xpPerPlayer===5&&attMaster.conditionDrop===3.75&&attMaster.additionalTrainingEffectPercent===80,'Master fixed catalogue exact');
  const stanek={name:'Jiri Stanek',age:23,ovr:115,position:'GK',roles:['GK'],skills:{Reflexes:127,Agility:159,Anticipation:136,'Rushing Out':128,Communication:141,Throwing:133,Kicking:135,Punching:137,'Aerial Reach':149,Concentration:132,Fitness:168,Strength:34,Aggression:42,Speed:54,Creativity:56}};
  const needs=T.buildNeeds(D.POSITION_WHITE.GK,stanek.skills);near(needs.target,(168+159+149)/3,1e-12,'training target is mean(top 3 white values)');const before=JSON.stringify(stanek.skills),session=T.buildIndividualSession({player:stanek,normalProfile:normal,masterStock:stock});ok(session.drills.length===6&&!session.error,'individual beam search returns exactly six legal slots');ok(session.meta.beamWidth===250&&session.meta.model==='30527-white-beam-v1','individual training model/beam width exact');ok(JSON.stringify(stanek.skills)===before,'individual training does not mutate player');ok(session.meta.greyAttributesAffectScore===false,'grey attributes have zero Individual Training utility');
  const session2=T.buildIndividualSession({player:stanek,normalProfile:normal,masterStock:stock});eq(session.drills.map(x=>x.drillId),session2.drills.map(x=>x.drillId),'individual beam search deterministic');
  const cat=T.evaluateCatalogue({player:stanek,normalProfile:normal,masterStock:stock});const gkRow=cat.rows.find(x=>x.candidate.drillId==='GOALKEEPER_TRAINING'),fcRow=cat.rows.find(x=>x.candidate.drillId==='FAST_COUNTER_ATTACKS');ok(gkRow.metric.whiteCoverageCount===5&&fcRow.metric.whiteCoverageCount===1&&gkRow.metric.score>fcRow.metric.score,'intense multi-white GK drill outranks one-white drill when useful utility is greater');
  const one=T.scoreCandidate({whiteAttributes:['A'],strength:5},{A:10},{}),multi=T.scoreCandidate({whiteAttributes:['A','B'],strength:5},{A:10,B:10},{});ok(multi.score>one.score,'multi-white coverage accumulates useful need rather than averaging it away');
  const allLocked={gameDataVersion:D.GAME_DATA_VERSION,drills:Object.fromEntries(D.NORMAL_DRILLS.map(d=>[d.drillId,{unlocked:false,level:0}]))},masterTwo={stock:{ATTACKING_MASTERCLASS:2,MIDFIELD_MASTERCLASS:0,PHYSICAL_MASTERCLASS:0,DEFENDING_MASTERCLASS:0}},st=player('st','ST',['ST'],Object.fromEntries(D.POSITION_WHITE.ST.map(a=>[a,100])));const ms=T.buildIndividualSession({player:st,normalProfile:allLocked,masterStock:masterTwo});ok(ms.drills.length===2&&ms.meta.masterUsage.ATTACKING_MASTERCLASS===2&&ms.meta.remainingMasterStock.ATTACKING_MASTERCLASS===0,'Master duplicates cannot exceed owned stock');
  const oneNormal={gameDataVersion:D.GAME_DATA_VERSION,drills:Object.fromEntries(D.NORMAL_DRILLS.map(d=>[d.drillId,{unlocked:d.drillId==='SLALOM_DRIBBLE',level:d.drillId==='SLALOM_DRIBBLE'?3:0}]))};const reps=T.buildIndividualSession({player:st,normalProfile:oneNormal,masterStock:{stock:{}}});ok(reps.drills.length===6&&new Set(reps.drills.map(x=>x.drillId)).size===1,'normal drill duplicates remain unlimited/legal');
  ok(session.meta.exactGainPrediction===false,'app explicitly does not predict exact server-side percentage-point gain');

  // ---------------------------------------------------------------------------
  // Team Training: actual players + per-player natural-role white needs + beam 250.
  // ---------------------------------------------------------------------------
  eq(D.TEAM_GROUPS,{defence:{title:'GK & Defence',positions:['GK','DL','DC','DR']},midfield:{title:'Defence & Midfield',positions:['DL','DC','DR','DMC','ML','MC','MR']},attack:{title:'Attacking Mid & Strikers',positions:['AML','AMC','AMR','ST']},all:{title:'All Positions',positions:currentRoles}},'Team Training groups exact');
  const teamPlayers=[player('a','Attacker',['ST'],{Passing:80,Dribbling:80,Shooting:80,Finishing:80,Positioning:80,Heading:80,Strength:80,Speed:80,Creativity:80}),player('keeper','Keeper',['GK'])];
  const tr=TT.buildTeamSession('attack',{normalProfile:normal,players:teamPlayers});ok(tr.drills.length===6&&tr.meta.selectedPlayerCount===1,'Team Training uses actual players in selected group');eq(tr.meta.selectedPlayerKeys,['a'],'Team Training excludes unrelated actual players');ok(tr.meta.beamWidth===250&&tr.meta.model==='30527-team-white-beam-v1','Team Training uses six-slot beam search width 250');ok(tr.meta.greyAttributesAffectScore===false,'Team Training grey attributes have zero utility');ok(tr.meta.apkTeamPlayModeled===false,'protocol TeamPlayTrainingDrill remains explicitly separate/unmodelled');
  const tr2=TT.buildTeamSession('attack',{normalProfile:normal,players:teamPlayers});eq(tr.drills.map(x=>x.drillId),tr2.drills.map(x=>x.drillId),'Team Training beam search deterministic');ok(TT.buildTeamSession('midfield',{normalProfile:normal,players:[teamPlayers[1]]}).error==='no-complete-players','Team Training does not fabricate players for an empty group');

  // ---------------------------------------------------------------------------
  // Specialists remain transparent companion-only logic.
  // ---------------------------------------------------------------------------
  const specA=player('pa','Penalty',['ST'],{Finishing:120,Shooting:120,Creativity:90});specA.specialAbilities=['Penalty Kick Specialist'];const specB=player('pb','Raw Skill',['ST'],{Finishing:200,Shooting:200,Creativity:200});const rr=R.rankPlaymakers([specA,specB]);ok(rr.penalties[0].player.key==='pa','penalty specialist flag is first explicit lexicographic criterion');ok(rr.captain===null&&/No authoritative captain formula/.test(rr.captainNote),'no invented hidden captain formula');

  // ---------------------------------------------------------------------------
  // v5.2.7 provenance-audit regressions: direct build-30527 native corrections.
  // ---------------------------------------------------------------------------
  eq(B.TACTICS.tackling.map(x=>[x.key,x.id,x.drain]),[['balanced',0,0],['stay',1,7],['aggressive',2,5]],'tackling protocol IDs/order match direct APK: Balanced=0, Stay=1, Aggressive=2 while label drain remains 0/7/5');
  ok(TAC.resolveDrainContribution(0,{intensity:0})===0&&TAC.resolveDrainContribution(0,{intensity:1})===5&&TAC.resolveDrainContribution(0,{intensity:2})===7,'numeric native ConditionDrainIntensity overrides map 0/1/2 -> 0/5/7');
  ok(TAC.resolveDrainContribution(0,1)===5&&TAC.resolveDrainContribution(0,2)===7,'raw numeric native intensity override compatibility');
  ok(!/levelSum/.test(String(F.assign))&&!/levelSum/.test(String(F.choose)),'formation whole-XI ranking no longer contains undocumented playstyle-level sum');

  console.log(`PASS ${passed} assertions`);
})().catch(err=>{console.error('FAIL',err.stack||err);process.exit(1)});
