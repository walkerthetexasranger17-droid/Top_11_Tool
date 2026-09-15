const fs=require('fs'),vm=require('vm'),path=require('path');global.window=global;const ROOT=path.join(__dirname,'..');for(const f of ['optimizer-data.js','bible-data.js','data.js','strategy-data.js','strategy-logic.js','formation.js'])vm.runInThisContext(fs.readFileSync(path.join(ROOT,'js',f),'utf8'),{filename:f});
const {Data:D,Formation:F}=TE5,A=Object.keys(D.ATTRIBUTE_IDS);let failures=[],assertions=0;function ok(c,m){assertions++;if(!c)failures.push(m)}
function mk(k,r,v=150){return{key:k,name:k,position:Array.isArray(r)?r[0]:r,roles:Array.isArray(r)?r:[r],relatedRoles:[],skills:Object.fromEntries(A.map(a=>[a,v])),ovr:v,specialAbilities:[],playstyle:null}}
let p=[['gk','GK'],['dl','DL'],['dc1','DC'],['dc2','DC'],['dr','DR'],['dmc','DMC'],['amc','AMC'],['amr','AMR'],['st','ST']].map(x=>mk(...x));let p1=mk('p1',['MC','AML'],100),p2=mk('p2',['MC','AML'],100);
Object.assign(p1.skills,{Bravery:125,Creativity:62,Crossing:84,Dribbling:155,Finishing:66,Fitness:150,Marking:158,Passing:194,Positioning:129,Shooting:131,Speed:163,Tackling:169});
Object.assign(p2.skills,{Bravery:143,Creativity:144,Crossing:96,Dribbling:180,Finishing:48,Fitness:54,Marking:97,Passing:82,Positioning:121,Shooting:189,Speed:88,Tackling:172});p.push(p1,p2);
const chosen=F.assign(p,F.FORMATIONS.find(x=>x.id==='41131'));ok(!chosen.error,'adversarial assignment failed');const map=Object.fromEntries(chosen.chosen.map(x=>[x.assignedRole,x.player.key]));ok(map.MC==='p2'&&map.AML==='p1','solver sacrificed a huge weak-link improvement for a microscopic mean gain');const weak=Math.min(...chosen.chosen.map(x=>x.roleMean));ok(weak>125,'balanced assignment did not protect the weak link');
// Unique-player invariant remains non-negotiable.
ok(new Set(chosen.chosen.map(x=>x.player.key)).size===11,'assignment duplicated a player');
console.log(JSON.stringify({assertions,failures,roles:{MC:map.MC,AML:map.AML},weak},null,2));if(failures.length)process.exitCode=1;
