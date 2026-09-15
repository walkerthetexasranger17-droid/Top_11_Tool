const fs=require('fs'),vm=require('vm'),path=require('path');
global.window=global;
global.localStorage={_m:new Map(),getItem(k){return this._m.has(k)?this._m.get(k):null},setItem(k,v){this._m.set(k,String(v))},removeItem(k){this._m.delete(k)},key(i){return [...this._m.keys()][i]||null},clear(){this._m.clear()},get length(){return this._m.size}};
const ROOT=path.join(__dirname,'..');
for(const f of ['optimizer-data.js','bible-data.js','data.js','strategy-data.js','strategy-logic.js','squad-coverage-engine.js','scanner-engine.js','storage.js','drill-profile.js','players.js','training-engine.js','team-training-engine.js','recommendations.js','formation.js','tactics-engine.js','mentor-engine.js','team-plan-engine.js']) vm.runInThisContext(fs.readFileSync(path.join(ROOT,'js',f),'utf8'),{filename:f});
const T=global.TE5.Tactics,B=global.TE5.BibleData;
let n=0;const ok=(c,m)=>{if(!c)throw new Error(m);n++;};
const min={passing:'long',shooting:'sight',focus:'left',cross:'low',lost:'regroup',won:'buildup',mentality:'normal',marking:'zonal',pressing:'low',backLine:'offside',tackling:'stay'};
const max={passing:'short',shooting:'box',focus:'both',cross:'low',lost:'counterPress',won:'counter',mentality:'hardAttacking',marking:'man',pressing:'high',backLine:'track',tackling:'aggressive'};
ok(T.calculateDrain(min,{},T.DRAIN_PROFILE_LIVE).mediumCount===0&&T.calculateDrain(min,{},T.DRAIN_PROFILE_LIVE).highCount===0,'live all-low profile has zero Medium/High choices');
ok(T.calculateDrain(max,{},T.DRAIN_PROFILE_LIVE).highCount>0,'live max-intensity profile contains High choices');
ok(T.liveDrainContribution('tackling','stay')===0,'Stay On Feet live cost 0');
ok(T.liveDrainContribution('tackling','balanced')===1,'Balanced tackling live cost 1');
ok(T.liveDrainContribution('tackling','aggressive')===2,'Aggressive tackling live intensity High');
const expectedLive={
  shooting:{sight:0,balanced:1,box:2},passing:{long:0,mixed:1,short:2},focus:{left:0,right:0,center:0,balanced:1,both:2},
  cross:{low:0,medium:0,high:0},lost:{regroup:0,counterPress:1},won:{buildup:0,counter:1},
  mentality:{normal:0,defending:1,attacking:1,hardDefending:2,hardAttacking:2},marking:{zonal:0,man:1},
  pressing:{low:0,mid:1,high:2},backLine:{offside:0,track:1},tackling:{stay:0,balanced:1,aggressive:2}
};
for(const [dim,map] of Object.entries(expectedLive))for(const [key,cost] of Object.entries(map))ok(T.liveDrainContribution(dim,key)===cost,`${dim}.${key} live cost ${cost}`);
ok(B.TACTICS.cross.every(o=>T.liveDrainContribution('cross',o.key)===0),'cross tendency is live cost-neutral');
ok(T.calculateDrain(min,{},T.DRAIN_PROFILE_LIVE).drainClass==='Low','all-low live profile is observed Low');
const med3={...min,shooting:'balanced',passing:'mixed',focus:'balanced'};
const med2={...min,shooting:'balanced',passing:'mixed'};
ok(T.calculateDrain(med2,{},T.DRAIN_PROFILE_LIVE).drainClass==='Low','two Medium-intensity changes remain Low in live observation');
ok(T.calculateDrain(med3,{},T.DRAIN_PROFILE_LIVE).drainClass==='Medium','three Medium-intensity changes reach Medium in live observation');
const high1={...min,shooting:'box'};
const high2={...min,shooting:'box',passing:'short'};
ok(T.calculateDrain(high1,{},T.DRAIN_PROFILE_LIVE).drainClass==='Low','one High-intensity change remains Low in live observation');
ok(T.calculateDrain(high2,{},T.DRAIN_PROFILE_LIVE).drainClass==='Medium','two High-intensity changes reach Medium in live observation');
const med9={...min,shooting:'balanced',passing:'mixed',focus:'balanced',lost:'counterPress',won:'counter',mentality:'attacking',marking:'man',pressing:'mid',backLine:'track'};
ok(T.calculateDrain(med9,{},T.DRAIN_PROFILE_LIVE).drainClass==='High','nine Medium-intensity changes reach High in live observation');
const high6={...min,shooting:'box',passing:'short',focus:'both',mentality:'hardAttacking',pressing:'high',tackling:'aggressive'};
ok(T.calculateDrain(high6,{},T.DRAIN_PROFILE_LIVE).drainClass==='High','six High-intensity changes reach High in live observation');
const mixed={...min,shooting:'box',passing:'mixed'};
ok(T.calculateDrain(mixed,{},T.DRAIN_PROFILE_LIVE).drainClass==='Unclassified','mixed Medium/High package remains unresolved');
ok(T.drainEfficiency(null,'High',{},T.DRAIN_PROFILE_LIVE)===5,'live unresolved numeric drain contributes neutral 5/10 during calibration');
ok(T.liveDrainDominatesCheaper({mediumCount:1,highCount:0},{mediumCount:2,highCount:1}),'component-wise cheaper live intensity profile is recognized');
ok(!T.liveDrainDominatesCheaper({mediumCount:0,highCount:1},{mediumCount:2,highCount:0}),'High-vs-Medium tradeoff is not guessed');
ok(T.compareRecommendationRows({decisionScore:70,contradictionCount:0,drainProfile:T.DRAIN_PROFILE_LIVE,mediumCount:1,highCount:0,neutralChoices:0,approachKey:'b'},{decisionScore:70,contradictionCount:0,drainProfile:T.DRAIN_PROFILE_LIVE,mediumCount:2,highCount:1,neutralChoices:10,approachKey:'a'})<0,'Auto-approach tie-break ignored a provably cheaper live intensity profile');
ok(T.compareRecommendationRows({decisionScore:70,contradictionCount:0,drainProfile:T.DRAIN_PROFILE_LIVE,mediumCount:0,highCount:1,neutralChoices:0,approachKey:'b'},{decisionScore:70,contradictionCount:0,drainProfile:T.DRAIN_PROFILE_LIVE,mediumCount:2,highCount:0,neutralChoices:10,approachKey:'a'})>0,'Auto-approach tie-break guessed an unresolved High-vs-Medium exchange instead of falling through to neutral/stable ordering');
console.log(`PASS ${n} live-drain assertions`);
