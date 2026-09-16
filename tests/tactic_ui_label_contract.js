const assert=require('assert');
const fs=require('fs'), path=require('path');
global.window={};
require('../js/bible-data.js');
const T=window.TE5.BibleData.TACTICS;
const expected={
  passing:{short:'Short',long:'Long',mixed:'Mixed'},
  shooting:{sight:'Shoot On Sight',box:'Work It Into The Box',balanced:'Balanced'},
  focus:{left:'Left Flank',right:'Right Flank',both:'Both Flanks',center:'Through the Middle',balanced:'Balanced'},
  cross:{low:'Low',medium:'Medium',high:'High'},
  lost:{counterPress:'Counter Press',regroup:'Regroup'},
  won:{buildup:'Focus On Buildup',counter:'Force Counter Attack'},
  mentality:{hardDefending:'Hard Defending',defending:'Defending',normal:'Normal',attacking:'Attacking',hardAttacking:'Hard Attacking'},
  marking:{man:'Man-to-Man',zonal:'Zonal'},
  pressing:{low:'Low Block',mid:'Mid Press',high:'High Press'},
  backLine:{track:'Track Opponent',offside:'Set Offside Trap'},
  tackling:{balanced:'Balanced',stay:'Stay On Feet',aggressive:'Aggressive'}
};
let count=0;
for(const [dim,opts] of Object.entries(expected)){
  assert(T[dim],`missing tactic dimension ${dim}`);
  const actual=Object.fromEntries(T[dim].map(o=>[o.key,o.label]));
  assert.deepStrictEqual(actual,opts,`${dim} user-facing labels drifted from current Top Eleven selection labels`);
  count+=Object.keys(opts).length;
}
assert.strictEqual(count,33,'expected 33 selectable tactic options');
assert.strictEqual(T.focus.find(o=>o.key==='center').label,'Through the Middle','internal center key must render as Through the Middle');
assert(!T.focus.some(o=>o.label==='Center'),'Center must not be exposed as a Focus Passing selection');
const app=fs.readFileSync(path.join(__dirname,'../js/app.js'),'utf8');
assert(/function renderTacticsFromPlan\(plan\)[\s\S]*?TAC\.option\(dim,t\.values\[dim\]\)[\s\S]*?o\?\.label/.test(app),'Team Plan tactic cards must render the option display label rather than the raw internal key');
console.log(`PASS tactic UI label contract: ${count} selectable labels; internal center -> Through the Middle`);
