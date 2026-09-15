const fs=require('fs'),vm=require('vm'),path=require('path');
global.window=global;const ROOT=path.join(__dirname,'..');
for(const f of ['optimizer-data.js','bible-data.js','data.js','strategy-data.js','strategy-logic.js','squad-coverage-engine.js'])vm.runInThisContext(fs.readFileSync(path.join(ROOT,'js',f),'utf8'),{filename:f});
const {Data:D,SquadCoverage:C}=TE5;const attrs=Object.keys(D.ATTRIBUTE_IDS);let assertions=0,failures=[];
function ok(c,m){assertions++;if(!c)failures.push(m)}
function p(key,roles,v=150){roles=Array.isArray(roles)?roles:[roles];return{key,name:key,position:roles[0],roles,relatedRoles:[],ovr:v,skills:Object.fromEntries(attrs.map(a=>[a,v])),specialAbilities:[],playstyle:null}}
const base=[p('gk','GK'),p('dl','DL'),p('dc1','DC'),p('dc2','DC'),p('dr','DR'),p('dmc','DMC'),p('mc','MC'),p('aml','AML'),p('amc','AMC'),p('amr','AMR'),p('st','ST')];
const a=C.analyse(base),coreA=a.coreSlots.map(x=>`${x.slotId}:${x.player?.playerKey||'-'}`);
const weak=p('weak-bench','ST',20),b=C.analyse([...base,weak]),coreB=b.coreSlots.map(x=>`${x.slotId}:${x.player?.playerKey||'-'}`);
ok(Math.abs(b.coverageScore-a.coverageScore)<1e-12||b.coverageScore>a.coverageScore,'Adding a weak reserve must never reduce Blueprint coverage');
ok(JSON.stringify(coreB)===JSON.stringify(coreA),'Adding an unused weak reserve must not reshuffle the Blueprint core assignment');
const incomplete=p('incomplete-dc','DC',200);delete incomplete.skills.Marking;const c=C.analyse([...base,incomplete]);
ok(c.coverageScore+1e-12>=a.coverageScore,'Adding an incomplete reserve must never reduce Blueprint coverage');
ok(!c.coreSlots.some(x=>x.player?.playerKey==='incomplete-dc'),'Incomplete reserve must not displace a complete core player via an implicit zero/missing skill');
const utility=p('utility',['DC','DMC','MC'],160),d=C.analyse([...base,utility]);
ok(d.coverageScore+1e-12>=a.coverageScore,'Adding a strong utility reserve must not reduce Blueprint coverage');
ok(d.flexibilitySlots.filter(x=>x.player).every(x=>!new Set(d.coreSlots.map(y=>y.player?.playerKey).filter(Boolean)).has(x.player.playerKey)),'Flexibility layer must not reuse a core player');
ok(d.availabilityDepthSlots.filter(x=>x.player).every(x=>!new Set(d.coreSlots.map(y=>y.player?.playerKey).filter(Boolean)).has(x.player.playerKey)),'Availability/depth layer must not reuse a core player');
for(const layer of [d.coreSlots,d.flexibilitySlots,d.availabilityDepthSlots]){const keys=layer.map(x=>x.player?.playerKey).filter(Boolean);ok(new Set(keys).size===keys.length,'A simultaneous Blueprint layer must use unique players');}

// Smooth quality-credit anchors: preserve the old 10-point=60% calibration without a hard cliff or permanent 60% floor.
ok(Math.abs(C.qualityCredit(0)-1)<1e-12,'Blueprint quality credit must be 1.0 at the core median');
ok(Math.abs(C.qualityCredit(10)-.6)<1e-12,'Blueprint quality credit must preserve the existing 10-point=0.6 anchor');
ok(C.qualityCredit(130)<.02,'An extremely weak nominal reserve must approach zero quality credit');
// Assignment objective must respect functional-slot importance rather than chasing a microscopic raw quality-sum edge.
function dual(key,common,mcUnique,amlUnique){const x=p(key,['MC','AML'],common);for(const a of ['Tackling','Marking','Positioning','Bravery'])x.skills[a]=mcUnique;for(const a of ['Crossing','Finishing'])x.skills[a]=amlUnique;return x;}
const fixed=[p('agk','GK'),p('adl','DL'),p('adc1','DC'),p('adc2','DC'),p('adr','DR'),p('admc','DMC'),p('aamc','AMC'),p('aamr','AMR'),p('ast','ST')],p1=dual('ap1',130,126.25,145.6),p2=dual('ap2',150,145.75,166.8),adv=C.analyse([...fixed,p1,p2]);
const controller=adv.coreSlots.find(x=>x.slotId==='controller'),leftProg=adv.coreSlots.find(x=>x.slotId==='left_progression');
ok(controller?.player?.playerKey==='ap2'&&leftProg?.player?.playerKey==='ap1','Blueprint must prefer the importance-weighted balanced MC/AML assignment over a tiny raw-sum edge');
ok(controller.quality>140&&leftProg.quality>130,'Blueprint adversarial assignment must protect the high-importance controller without collapsing the wing slot');

// Related-role cover is legal information for Formation, but it must not masquerade as natural recruitment coverage in Blueprint.
{
  const noNaturalDL=base.filter(x=>x.key!=='dl').map(x=>({...x,roles:[...x.roles],relatedRoles:[...(x.relatedRoles||[])],skills:{...x.skills}}));
  const rel=noNaturalDL.find(x=>x.key==='dc1');rel.relatedRoles=['DL'];
  const z=C.analyse(noNaturalDL),left=z.coreSlots.find(x=>x.slotId==='left_defender'),roleRow=z.roles.find(x=>x.role==='DL');
  ok(left?.status==='missing'&&!left.player,'A Related-only DL incorrectly satisfied the natural Blueprint left-defender core slot');
  ok(roleRow?.naturalCount===0&&roleRow?.relatedCount===1,'Blueprint role summary did not preserve Related cover separately from natural DL coverage');
  ok(z.recruitmentPriorities.some(x=>x.slotId==='left_defender'&&x.kind==='missing_core'),'Related-only DL cover incorrectly removed the natural left-defender recruitment priority');
}

// Explicit null is unknown, not zero: an otherwise elite player with a null core-role key skill cannot satisfy Blueprint natural coverage.
{
  const nullDl=p('null-dl','DL',220);nullDl.skills.Marking=null;
  ok(C.roleQuality(nullDl,'DL')===null,'Blueprint coerced null Marking to numeric zero');
  const noDl=base.filter(x=>x.key!=='dl'),z=C.analyse([...noDl,nullDl]),left=z.coreSlots.find(x=>x.slotId==='left_defender');
  ok(left?.status==='missing'&&!left.player,'Blueprint let an explicit-null DL satisfy the core left-defender slot');
  const row=z.roles.find(x=>x.role==='DL');ok(row?.naturalCount===1&&row?.usableNaturalCount===0&&row?.incompleteNaturalCount===1&&row?.status==='missing','Blueprint role summary falsely reported an incomplete natural DL as usable coverage');
}
console.log(JSON.stringify({assertions,failures,baseCoverage:a.coveragePercent,weakCoverage:b.coveragePercent,incompleteCoverage:c.coveragePercent,utilityCoverage:d.coveragePercent,adversarialCoverage:adv.coveragePercent},null,2));if(failures.length)process.exitCode=1;
