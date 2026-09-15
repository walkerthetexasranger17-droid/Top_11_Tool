const fs=require('fs'),vm=require('vm'),path=require('path');global.window=global;const ROOT=path.join(__dirname,'..');for(const f of ['optimizer-data.js','bible-data.js','data.js','strategy-data.js','strategy-logic.js','formation.js'])vm.runInThisContext(fs.readFileSync(path.join(ROOT,'js',f),'utf8'),{filename:f});
const {Data:D,Formation:F}=TE5,A=Object.keys(D.ATTRIBUTE_IDS);let failures=[],assertions=0;function ok(c,m){assertions++;if(!c)failures.push(m)}
function mk(k,r,v=100){return{key:k,name:k,position:r,roles:[r],relatedRoles:[],ovr:v,skills:Object.fromEntries(A.map(a=>[a,v])),specialAbilities:[],playstyle:null}}
function squad(){return [['gk','GK'],['dl','DL'],['dc1','DC'],['dc2','DC'],['dc3','DC'],['dr','DR'],['dmc','DMC'],['ml','ML'],['mc1','MC'],['mc2','MC'],['mc3','MC'],['mr','MR'],['aml','AML'],['amc','AMC'],['amr','AMR'],['st1','ST'],['st2','ST']].map(x=>mk(...x))}
function ranked(s){return F.rankStrategic(s).filter(x=>!x.error)}
const base=ranked(squad()),tinySquad=squad();tinySquad.find(x=>x.key==='aml').skills.Dribbling+=.001;const tiny=ranked(tinySquad);
ok(base[0].formation.id===tiny[0].formation.id,'+0.001 skill nudge flipped best formation');
const byId=new Map(tiny.map(x=>[x.formation.id,x]));let maxDelta=0;for(const x of base){const y=byId.get(x.formation.id);if(y)maxDelta=Math.max(maxDelta,Math.abs(x.strategic.totalScore-y.strategic.totalScore));}ok(maxDelta<.01,'+0.001 skill nudge caused excessive formation-score movement: '+maxDelta);
// A genuinely poor specialist must be avoidable when clean alternative shapes exist.
let weak=squad(),aml=weak.find(x=>x.key==='aml');for(const a of D.POSITION_WHITE.AML)aml.skills[a]=60;aml.ovr=60;const weakRank=ranked(weak);ok(!weakRank[0].chosen.some(c=>c.player.key==='aml'),'Formation winner retained a severely weak AML despite clean alternatives');ok(weakRank.find(x=>x.formation.id==='41131').strategic.totalScore<weakRank[0].strategic.totalScore-10,'Severely weak AML did not create meaningful formation separation');
// A genuinely elite AML should be used by at least the top winner and not be erased by stability/structure heuristics.
let elite=squad();aml=elite.find(x=>x.key==='aml');for(const a of D.POSITION_WHITE.AML)aml.skills[a]=180;aml.ovr=180;const eliteRank=ranked(elite);ok(eliteRank[0].chosen.some(c=>c.player.key==='aml'),'Formation winner ignored an elite AML');
// Versatility is a tie-break/coverage property, not additive match strength.
let versatile=squad();versatile.find(x=>x.key==='mc1').roles=['MC','DMC','AMC'];const v=ranked(versatile),plain=ranked(squad());const plainMap=new Map(plain.map(x=>[x.formation.id,x]));for(const x of v){const p=plainMap.get(x.formation.id);if(p&&Math.abs(x.strategic.avgMean-p.strategic.avgMean)<1e-12&&Math.abs(x.strategic.components.coreStructureScore-p.strategic.components.coreStructureScore)<1e-12)ok(Math.abs(x.strategic.totalScore-p.strategic.totalScore)<1e-9,`Versatility leaked additive points into ${x.formation.id}`)}

// Global structure calibration must preserve the proven entire legal-shape raw range without saturation.
ok(Math.abs(F.structureComponent(-13)-0)<1e-12,'Structure raw minimum -13 must map to 0/30');
ok(Math.abs(F.structureComponent(0)-15)<1e-12,'Structure raw neutral 0 must map to 15/30');
ok(Math.abs(F.structureComponent(30)-30)<1e-12,'Structure raw maximum +30 must map to 30/30');
ok(Math.abs(F.structureComponent(29)-29.5)<1e-12,'Raw +29 should remain distinguishable at 29.5/30');
ok(Math.abs(F.structureComponent(20)-25)<1e-12,'Raw +20 should map to 25/30 rather than saturating');
ok(F.structureComponent(29)>F.structureComponent(20),'Better raw structure must remain better after calibration');
// Explicit null/blank key skills are unknown data, not numeric zero, and must make that player ineligible for the affected role.
{
  for(const bad of [null,'']){
    const p=mk('null-dc','DC',200);p.skills.Marking=bad;
    ok(F.roleStats(p,'DC')===null,`Formation treated ${JSON.stringify(bad)} key skill as a real numeric value`);
    ok(F.candidate(p,'DC')===null,`Formation allowed a DC with ${JSON.stringify(bad)} Marking into role assignment`);
  }
}
console.log(JSON.stringify({assertions,failures,maxTinyDelta:maxDelta},null,2));if(failures.length)process.exitCode=1;
