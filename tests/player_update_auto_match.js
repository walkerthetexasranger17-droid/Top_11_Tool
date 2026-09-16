const fs=require('fs'),vm=require('vm'),path=require('path');
global.window=global;
global.localStorage={getItem(){return null},setItem(){},removeItem(){},key(){return null},get length(){return 0}};
const ROOT=path.join(__dirname,'..');
for(const f of ['optimizer-data.js','bible-data.js','data.js','storage.js','players.js']) vm.runInThisContext(fs.readFileSync(path.join(ROOT,'js',f),'utf8'),{filename:f});
const P=global.TE5.Players;let n=0;
function ok(v,msg){n++;if(!v)throw new Error(`FAIL ${n}: ${msg}`)}
const squad=[
 {key:'david',name:'David Andrews',position:'MC',roles:['MC']},
 {key:'remus',name:'Remus Iacob',position:'DL',roles:['DL']},
 {key:'luiu',name:'Stefano Luiu',position:'MC',roles:['MC']},
 {key:'accent',name:'José Núñez',position:'ST',roles:['ST']},
 {key:'cyr',name:'Алекс Иванов',position:'DC',roles:['DC']}
];
ok(P.normalisePlayerName('  José-Núñez ')===P.normalisePlayerName('Jose Nunez'),'accent/punctuation normalisation');
ok(P.normalisePlayerName('Алекс Иванов')==='алекс иванов','unicode names are preserved');
let m=P.matchPlayerByName(squad,'David Andrews');ok(m.player?.key==='david'&&m.kind==='exact'&&m.score===1,'exact name match');
m=P.matchPlayerByName(squad,'DAVID   ANDREWS');ok(m.player?.key==='david'&&m.kind==='exact','case/space insensitive exact match');
m=P.matchPlayerByName(squad,'Jose Nunez');ok(m.player?.key==='accent'&&m.kind==='exact','accent-insensitive exact match');
m=P.matchPlayerByName(squad,'Алекс Иванов');ok(m.player?.key==='cyr'&&m.kind==='exact','unicode exact match');
m=P.matchPlayerByName(squad,'David Andraws');ok(m.player?.key==='david'&&m.kind==='fuzzy'&&m.score>=.90,'single OCR error fuzzy match');
m=P.matchPlayerByName(squad,'Completely Different');ok(!m.player&&m.kind==='not-found','unrelated name rejected');
m=P.matchPlayerByName([...squad,{key:'david2',name:'David Andrews',position:'ST',roles:['ST']}],'David Andrews');ok(!m.player&&m.kind==='ambiguous','duplicate exact names never guessed');
m=P.matchPlayerByName([{key:'a',name:'Mark Stone'},{key:'b',name:'Mark Stowe'}],'Mark Stome',{threshold:.80,margin:.08});ok(!m.player&&m.kind==='ambiguous','near-tie fuzzy names never guessed');
m=P.matchPlayerByName(squad,'');ok(!m.player&&m.kind==='missing','blank detected name rejected');
console.log(`PASS automatic update name matcher: ${n} assertions`);
