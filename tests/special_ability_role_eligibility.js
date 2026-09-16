const fs=require('fs'),vm=require('vm'),path=require('path');
global.window=global;
const ROOT=path.join(__dirname,'..');
for(const f of ['optimizer-data.js','bible-data.js','data.js']) vm.runInThisContext(fs.readFileSync(path.join(ROOT,'js',f),'utf8'),{filename:f});
const D=TE5.Data,B=TE5.BibleData;
let n=0;function ok(v,m){if(!v)throw new Error('FAIL: '+m);n++;}
const outfield=B.CURRENT_ROLES.filter(r=>r!=='GK');
const expected={
  'One-on-One Stopper':['GK'],
  'Penalty Kick Stopper':['GK'],
  'Aerial Defender':['DC','DMC'],
  'Blocker':['DC','DL','DR'],
  'Defensive Wall':['DC','DL','DR','DMC'],
  'Intercepting Specialist':['DC','DMC'],
  'Counter Attack Stopper':['DMC','MC'],
  'Playmaker':['DMC','MC','AMC'],
  'Dribbler':['MC','ML','MR','AMC','AML','AMR'],
  'Corner Specialist':['DL','DR','ML','MR','MC'],
  'Cross Expert':['DL','DR','ML','MR','AML','AMR'],
  'Shadow Striker':['AMC','AML','AMR'],
  'One-on-One Scorer':['AMC','AML','AMR','ST'],
  'Versatile Attacker':['AMC','AML','AMR','ST'],
  'Free Kick Specialist':outfield,
  'Penalty Kick Specialist':outfield,
  'Set Piece Taker':outfield,
  'Set Piece Stopper':B.CURRENT_ROLES,
  'Rebound Specialist':outfield
};
ok(D.SPECIAL_ABILITIES.length===19,'catalogue remains 19 current abilities');
ok(Object.keys(D.SPECIAL_ABILITY_ROLE_ELIGIBILITY).length===19,'every current ability has an eligibility row');
for(const name of D.SPECIAL_ABILITIES){
  ok(!!expected[name],`expected row exists for ${name}`);
  const got=[...(D.SPECIAL_ABILITY_ROLE_ELIGIBILITY[name]||[])].sort();
  const want=[...expected[name]].sort();
  ok(JSON.stringify(got)===JSON.stringify(want),`${name} exact role eligibility`);
}
const gk=D.specialAbilitiesForRoles(['GK']);
ok(JSON.stringify(gk)===JSON.stringify(['Penalty Kick Stopper','One-on-One Stopper','Set Piece Stopper']),'GK only sees GK-valid abilities');
const dldc=D.specialAbilitiesForRoles(['DL','DC']);
for(const a of ['Aerial Defender','Blocker','Defensive Wall','Intercepting Specialist','Corner Specialist','Cross Expert','Free Kick Specialist','Penalty Kick Specialist','Set Piece Taker','Set Piece Stopper','Rebound Specialist'])ok(dldc.includes(a),`DL/DC union includes ${a}`);
for(const a of ['Playmaker','Dribbler','Shadow Striker','One-on-One Scorer','Versatile Attacker','Counter Attack Stopper','One-on-One Stopper','Penalty Kick Stopper'])ok(!dldc.includes(a),`DL/DC union excludes ${a}`);
ok(D.isSpecialAbilityEligibleForRoles('Shadow Striker',['AMC']),'Shadow Striker valid for AMC');
ok(!D.isSpecialAbilityEligibleForRoles('Shadow Striker',['MC']),'Shadow Striker invalid for MC');
ok(D.isSpecialAbilityEligibleForRoles('Playmaker',['MC','AMC']),'multi-role union grants Playmaker');
ok(!D.isSpecialAbilityEligibleForRoles('One-on-One Stopper',['DL','DC']),'outfield does not grant GK stopper');
ok(D.specialAbilitiesForRoles([]).length===0,'no natural role yields no new SA choices');
console.log(`Special Ability role eligibility: PASS — ${n} assertions`);
