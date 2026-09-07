const fs=require('fs'),vm=require('vm'),path=require('path');
global.window=global;global.localStorage={_m:new Map(),getItem(k){return this._m.has(k)?this._m.get(k):null},setItem(k,v){this._m.set(k,String(v))},removeItem(k){this._m.delete(k)},key(i){return [...this._m.keys()][i]||null},get length(){return this._m.size}};
for(const f of ['data.js','storage.js','players.js','training-engine.js','team-training-engine.js','recommendations.js'])vm.runInThisContext(fs.readFileSync(path.join(__dirname,'..','js',f),'utf8'),{filename:f});
const {Data:D,Storage:S,Players:P,Training:T,TeamTraining:TT,Recommendations:R}=global.TE5;
let passed=0;function ok(cond,msg){if(!cond)throw new Error(msg);passed++;}function eq(a,b,msg){ok(JSON.stringify(a)===JSON.stringify(b),`${msg}\n${JSON.stringify(a)} != ${JSON.stringify(b)}`)}
(async()=>{
  ok(D.MASTER_DRILLS.length===29,'master drill count');ok(D.ALL_POSITIONS.length===14,'position count');
  for(const pos of D.ALL_POSITIONS){ok((D.POSITION_WHITE[pos]||[]).length>0,`white skills exist for ${pos}`);}

  // Player persistence, normalisation and stable-key editing.
  const playerKey=await P.save({name:'Alpha Test',age:20,ovr:110,position:'MC',roles:['MC','AMC','MC'],skills:{Passing:140,Creativity:130},specialAbilities:['Playmaker','Corner Specialist','Ignored Third']});
  ok(playerKey.startsWith('player:'),'player key created');let p=await P.get(playerKey);eq(p.roles,['MC','AMC'],'roles dedupe and preserve primary');ok(p.specialAbilities.length===2,'special ability max two');
  await P.save({...p,name:'Alpha Renamed',position:'AMC',roles:['AMC','MC']},playerKey);p=await P.get(playerKey);ok(p.key===playerKey,'edit preserves stable player key');ok(p.name==='Alpha Renamed'&&p.position==='AMC','edited player reloads');
  await S.set(`training:session:${playerKey}`,'x');await P.remove(playerKey);ok(await P.get(playerKey)===null,'player delete works');ok(await S.get(`training:session:${playerKey}`)===null,'player delete removes saved training session');

  const stSkills={};D.OUTFIELD_SKILLS.forEach(s=>stSkills[s]=80);stSkills.Shooting=120;stSkills.Finishing=110;stSkills.Positioning=90;stSkills.Heading=85;stSkills.Speed=100;
  const before=JSON.stringify(stSkills);const s1=T.buildIndividualSession({position:'ST',skills:stSkills,maxGrey:1});ok(!s1.error,'ST session builds');ok(s1.drills.length===6,'ST gets six drills');ok(JSON.stringify(stSkills)===before,'training never mutates player skills');
  for(const d of s1.drills){ok(d.fit.grey.length<=1,`${d.name} respects grey cap`);ok(d.fit.white.length>0,`${d.name} trains a white skill`);ok(d.headroom>0,`${d.name} has 180-rule headroom`);}
  const s2=T.buildIndividualSession({position:'ST',skills:stSkills,maxGrey:1});eq(s1.drills.map(d=>d.name),s2.drills.map(d=>d.name),'identical input is deterministic');
  const disabled=s1.drills[0].name;const s3=T.buildIndividualSession({position:'ST',skills:stSkills,maxGrey:1,disabled:[disabled]});ok(!s3.drills.some(d=>d.name===disabled),'disabled drill never returns');
  const zeroGrey=T.buildIndividualSession({position:'ST',skills:stSkills,maxGrey:0});for(const d of zeroGrey.drills)ok(d.fit.grey.length===0,'0-grey mode is strict');
  const maxed={};D.OUTFIELD_SKILLS.forEach(s=>maxed[s]=400);const no=T.buildIndividualSession({position:'ST',skills:maxed,maxGrey:2});ok(no.drills.length===0,'400-capped player produces no fake training');
  ok(T.buildIndividualSession({position:'XYZ',skills:{}}).error==='invalid-position','invalid position rejected');

  const gkSkills={};[...D.GK_SKILLS,...D.GK_PHYSICAL].forEach(s=>gkSkills[s]=70);const gk=T.buildIndividualSession({position:'GK',skills:gkSkills,maxGrey:1});ok(gk.drills.length>0,'GK session builds');for(const d of gk.drills)ok(d.fit.grey.length<=1,'GK grey cap respected');

  for(const group of Object.keys(D.TEAM_GROUPS)){
    const r=TT.buildTeamSession(group,{maxGrey:2,strict:true});ok(r.drills.length>0,`${group} team session builds`);for(const d of r.drills)ok(d.fitGroup.invalidPositions.length===0,`${group}/${d.name} has no hidden grey-limit violation`);
    const expected=[...D.TEAM_GROUPS[group].positions].sort();const covered=[...r.meta.coveredPositions].sort();eq(covered,expected,`${group} six-drill session covers every target role`);
  }

  // Recommendation engines should be deterministic and react to specialist abilities.
  const baseSkills={Passing:100,Creativity:100,Shooting:100,Finishing:100,Crossing:100,Tackling:100,Marking:100,Positioning:100,Bravery:100,Fitness:100,Dribbling:100,Heading:100};
  const squad=[
    {name:'A',age:23,ovr:110,position:'ST',roles:['ST'],skills:{...baseSkills,Finishing:145,Shooting:140},specialAbilities:['Penalty Kick Specialist']},
    {name:'B',age:25,ovr:108,position:'MR',roles:['MR'],skills:{...baseSkills,Crossing:150,Passing:135},specialAbilities:['Corner Specialist']},
    {name:'C',age:26,ovr:112,position:'MC',roles:['MC'],skills:{...baseSkills,Shooting:145,Passing:135},specialAbilities:['Free Kick Specialist']}
  ];
  const ranks=R.rankPlaymakers(squad);ok(ranks.penalties[0].player.name==='A','penalty specialist bonus applied');ok(ranks.corner.player.name==='B','corner specialist selected');ok(ranks.freeKick.player.name==='C','free kick specialist selected');
  const tac1=R.recommendTactics(squad,'balanced'),tac2=R.recommendTactics(squad,'balanced');eq(tac1,tac2,'tactics deterministic for same squad');ok(R.MENTORS.length===7,'seven mentors available');

  console.log(`PASS ${passed} assertions`);console.log('ST session:',s1.drills.map(d=>`${d.name} (${d.diff})`).join(' | '));console.log('GK session:',gk.drills.map(d=>`${d.name} (${d.diff})`).join(' | '));
})().catch(err=>{console.error('FAIL',err.stack||err);process.exit(1)});
