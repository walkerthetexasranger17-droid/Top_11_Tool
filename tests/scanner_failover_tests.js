const fs=require('fs'),path=require('path'),vm=require('vm');
const ROOT=path.resolve(__dirname,'..');global.window=global;global.localStorage={_m:new Map(),getItem(k){return this._m.get(k)||null},setItem(k,v){this._m.set(k,String(v))},removeItem(k){this._m.delete(k)}};
for(const f of ['optimizer-data.js','bible-data.js','data.js','scanner-engine.js'])vm.runInThisContext(fs.readFileSync(path.join(ROOT,'js',f),'utf8'),{filename:f});
const SC=global.TE5.Scanner;let n=0;function ok(v,m){if(!v)throw new Error(m);n++;}
const src=fs.readFileSync(path.join(ROOT,'js/scanner-engine.js'),'utf8');
ok(SC.VERSION===4,'Scanner v4');
ok(SC.MODEL==='gemini-3.1-flash-live-preview','Gemini 3.1 Flash Live only');
ok(SC.REQUEST_TIMEOUT_MS===90000,'90s Live task timeout');
ok(/thinkingLevel:'HIGH'/.test(src),'HIGH thinking configured');
ok(/BidiGenerateContent/.test(src),'Live WebSocket transport configured');
ok(/clientContent/.test(src)&&/turnComplete:true/.test(src),'static images sent as a complete Live client turn');
ok(/submit_core_scan/.test(src),'core function pass');
ok(/submit_playstyle_identity/.test(src),'playstyle identity function pass');
ok(/submit_playstyle_level_segments/.test(src),'playstyle level function pass');
ok(/submit_ability_slot_scan/.test(src),'per-slot ability function pass');
ok(SC._canonicalPlaystyle('No Nonsense DC')==='No-Nonsense DC','canonical No-Nonsense mapping');
ok(SC._playstyleFamily('Box To Box')==='midfield','Box To Box family');
console.log(`PASS scanner v4 Live contract: ${n} assertions`);
