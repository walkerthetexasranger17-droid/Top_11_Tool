const fs=require('fs'),vm=require('vm'),path=require('path');global.window=global;const ROOT=path.join(__dirname,'..');for(const f of ['optimizer-data.js','bible-data.js','data.js','strategy-data.js','strategy-logic.js','formation.js'])vm.runInThisContext(fs.readFileSync(path.join(ROOT,'js',f),'utf8'),{filename:f});
const {Data:D,Formation:F}=TE5,A=Object.keys(D.ATTRIBUTE_IDS);let failures=[],assertions=0;function ok(c,m){assertions++;if(!c)failures.push(m)}
function mk(k,r,rel=[]){return{key:k,name:k,position:r,roles:[r],relatedRoles:rel,skills:Object.fromEntries(A.map(a=>[a,100])),ovr:100,specialAbilities:[],playstyle:null}}
const p=[mk('gk','GK'),mk('dl','DL'),mk('dc','DC'),mk('dr','DR'),mk('dmc1','DMC',['DC']),mk('dmc2','DMC'),mk('mc','MC'),mk('aml','AML'),mk('amc','AMC'),mk('amr','AMR'),mk('st','ST')];
ok(!F.FORMATIONS.some(f=>F.canAssignNaturally(p,f)),'Adversarial squad unexpectedly fields a curated formation naturally');
const ranked=F.rankStrategic(p).filter(x=>!x.error);ok(ranked.some(x=>x.formation.dynamic),'Natural dynamic fallback was suppressed by a related-role curated formation');
const dyn=ranked.find(x=>x.formation.dynamic);ok(dyn.chosen.every(x=>x.suitability==='NATURAL'),'Dynamic fallback used a non-natural assignment');
ok(ranked.some(x=>!x.formation.dynamic&&x.chosen.some(x=>x.suitability==='RELATED')),'Related-role curated candidates were incorrectly discarded rather than allowed to compete');
console.log(JSON.stringify({assertions,failures,winner:ranked[0]?.formation.id,dynamic:dyn?.formation.id,candidateCount:ranked.length},null,2));if(failures.length)process.exitCode=1;
