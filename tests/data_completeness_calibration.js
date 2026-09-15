const fs=require('fs'),vm=require('vm'),path=require('path');
global.window=global;const ROOT=path.join(__dirname,'..');
for(const f of ['optimizer-data.js','bible-data.js','data.js','strategy-data.js','strategy-logic.js','training-engine.js','team-training-engine.js'])vm.runInThisContext(fs.readFileSync(path.join(ROOT,'js',f),'utf8'),{filename:f});
const {Data:D,Training:T,TeamTraining:TT}=TE5;const attrs=Object.keys(D.ATTRIBUTE_IDS);let assertions=0,failures=[];
function ok(c,m){assertions++;if(!c)failures.push(m)}
function p(key,role,v=150){return{key,name:key,position:role,roles:[role],relatedRoles:[],age:18,ovr:v,skills:Object.fromEntries(attrs.map(a=>[a,v])),specialAbilities:[],playstyle:role==='ST'?{type:'Poacher',level:3}:null}}
const normal={drills:Object.fromEntries(D.NORMAL_DRILLS.map(d=>[d.drillId,{unlocked:true,level:3}]))};
const incomplete=p('incomplete','ST');delete incomplete.skills.Finishing;
const individual=T.buildIndividualSession({player:incomplete,normalProfile:normal,masterStock:{},slots:6,mode:'maxGrowth'});
ok(individual.error==='missing-white-attributes','Individual Training must block an incomplete white-skill profile');
ok(individual.drills.length===0,'Incomplete Individual Training must not emit drills');
ok(Array.isArray(individual.missingAttributes)&&individual.missingAttributes.includes('Finishing'),'Individual Training must report the actual missing white skill');
const catalogue=T.evaluateCatalogue({player:incomplete,normalProfile:normal,masterStock:{}});
ok(catalogue.error==='missing-white-attributes'&&catalogue.rows.length===0,'Training catalogue evaluation must not rank drills from an incomplete player profile');
ok(catalogue.missingAttributes.includes('Finishing'),'Training catalogue evaluation must expose its missing white skill');
const onlyIncomplete=TT.buildTeamSession('attack',{normalProfile:normal,players:[incomplete],slots:6});
ok(onlyIncomplete.error==='no-complete-players','Team Training must not treat an incomplete player as a zero-skill training target');
ok(onlyIncomplete.meta?.excludedPlayers?.some(x=>x.player?.key==='incomplete'&&x.missing?.includes('Finishing')),'Team Training must expose the excluded player and missing white skill');
const complete=p('complete','ST');const mixed=TT.buildTeamSession('attack',{normalProfile:normal,players:[complete,incomplete],slots:6});
ok(!mixed.error&&mixed.drills.length===6,'Team Training should still build from complete players when one group member is incomplete');
ok(mixed.meta.selectedPlayerKeys.length===1&&mixed.meta.selectedPlayerKeys[0]==='complete','Incomplete player must not contribute to Team Training utility');
ok(mixed.meta.excludedPlayers.some(x=>x.player?.key==='incomplete'),'Incomplete Team Training player must remain visible as excluded');
console.log(JSON.stringify({assertions,failures},null,2));if(failures.length)process.exitCode=1;
