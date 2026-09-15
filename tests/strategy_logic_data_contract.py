import json, re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
idx=ROOT/'data/build_30527/index'
logic=json.loads((idx/'decision_logic_v2.json').read_text(encoding='utf-8'))
strings=json.loads((idx/'strategy_strings_v2.json').read_text(encoding='utf-8'))['strings']
white=json.loads((ROOT/'data/build_30527/white_skill_map_30527.json').read_text(encoding='utf-8'))
ps=json.loads((ROOT/'data/build_30527/playstyles_30527.json').read_text(encoding='utf-8'))
tactics=json.loads((ROOT/'data/build_30527/tactics_30527.json').read_text(encoding='utf-8'))

role_white={r:set(v['key_attributes']) for r,v in white['roles'].items() if r in logic['training']['role_profiles']}
assert set(role_white)==set(logic['training']['role_profiles']), (set(role_white)^set(logic['training']['role_profiles']))

# Every role profile must partition only real white skills.
for role,prof in logic['training']['role_profiles'].items():
    seen=[]
    for tier in ('S','A','B','C'):
        seen += prof.get(tier,[])
    assert len(seen)==len(set(seen)), (role,'duplicates')
    assert set(seen)<=role_white[role], (role,set(seen)-role_white[role])
    assert set(seen)==role_white[role], (role,'missing',role_white[role]-set(seen))

# Every offered playstyle-role pair must have a role-specific hierarchy.
# playstyles_30527 is authoritative for current offer/role eligibility.
entries=ps.get('playstyles',ps if isinstance(ps,list) else [])
missing=[]
for p in entries:
    if p.get('id')==1 or (p.get('offer') is False or p.get('offered') is False): continue
    name=p['name']
    for role in p.get('roles',[]):
        if role not in role_white: continue
        if role not in logic['training']['playstyle_role_profiles'].get(name,{}): missing.append((name,role))
assert not missing, missing

for name,rolemap in logic['training']['playstyle_role_profiles'].items():
    for role,prof in rolemap.items():
        seen=[]
        for tier in ('S','A','B','C'): seen+=prof.get(tier,[])
        assert len(seen)==len(set(seen)), (name,role,'duplicates')
        assert set(seen)<=role_white[role], (name,role,set(seen)-role_white[role])
        # Latent attrs are intentionally NOT required to be white in this role.
        latent=set(prof.get('latent_if_white_via_secondary_role',[]))
        assert not (latent & set(seen)), (name,role,'latent repeated')
        assert set(seen)==role_white[role], (name,role,'profile must rank every white skill',role_white[role]-set(seen))

# Formation templates must be 11-slot and use known roles/options only.
roles=set(role_white)
ids=set()
for f in logic['formation']['candidates']:
    assert f['id'] not in ids; ids.add(f['id'])
    assert len(f['slots'])==11,(f['id'],len(f['slots']))
    for slot in f['slots']:
        opts=slot.split('|')
        assert all(x in roles for x in opts),(f['id'],slot)

# Blueprint IDs unique.
for key in ('core_slots','flexibility_slots'):
    vals=logic['squad_blueprint'][key]
    assert len({x['id'] for x in vals})==len(vals)
    for x in vals: assert all(r in roles for r in x['roles'])

# Tactic rules must reference real options/dimensions.
# tactics_30527 uses 'options' grouped by dimension in current package.
dimopts={}
if 'dimensions' in tactics:
    for d in tactics['dimensions']:
        dimopts[d['key']]={o['key'] for o in d.get('options',[])}
else:
    for k,v in tactics.items():
        if isinstance(v,list) and v and isinstance(v[0],dict) and 'key' in v[0]: dimopts[k]={o['key'] for o in v}
# fall back to known browser data shape if JSON is descriptive
if not dimopts:
    dimopts={
      'passing':{'short','long','mixed'},'shooting':{'sight','box','balanced'},'focus':{'left','right','both','center','balanced'},
      'cross':{'low','medium','high'},'lost':{'counterPress','regroup'},'won':{'buildup','counter'},
      'mentality':{'hardDefending','defending','normal','attacking','hardAttacking'},'marking':{'man','zonal'},
      'pressing':{'low','mid','high'},'backLine':{'track','offside'},'tackling':{'balanced','stay','aggressive'} }
for r in logic['tactics']['rules']:
    assert r['dimension'] in dimopts,r['id']
    assert r['option'] in dimopts[r['dimension']],(r['id'],r['dimension'],r['option'])

# Mentors: all 7, all three families, level gates exactly as contract.
assert len(logic['mentors']['mentors'])==7
for mid,m in logic['mentors']['mentors'].items():
    assert m['unlock_levels']=={'tactical':1,'attribute':5,'signature':10}
    for fam in ('tactical','attribute','signature'): assert fam in m

# Every referenced message must exist.
refs=[]
def walk(v):
    if isinstance(v,dict):
        for k,x in v.items():
            if k.startswith('message') and isinstance(x,str): refs.append(x)
            else: walk(x)
    elif isinstance(v,list):
        for x in v: walk(x)
walk(logic)
missing_strings=sorted(set(refs)-set(strings))
assert not missing_strings,missing_strings
assert len(strings)>=len(set(refs)), (len(strings),len(set(refs)))


# v0.5.15 calibration architecture boundary: active contract accepts no external-team, relative-strength or live-state symbols.
assert logic['version']=='v0.5.15-calibration'
assert 'strength_bands' not in logic
assert 'opponent_features' not in logic['feature_model']
assert logic['formation']['score_components']=={'lineup_quality':40,'playstyle_role_fit':10,'weak_link':20,'core_structure':30,'formation_flexibility':0}
assert logic['formation']['structure_raw_range']['min']==-13 and logic['formation']['structure_raw_range']['neutral']==0 and logic['formation']['structure_raw_range']['max']==30
assert logic['tactics']['score_components']=={'native_lineup_fit':32,'own_squad_structure':26,'internal_coherence':18,'playstyle_and_sa_fit':14,'drain_efficiency':10}
assert len(logic['formation']['candidates'])==12
assert {r.get('bucket') for r in logic['tactics']['rules']}<={'own_squad_structure','internal_coherence','playstyle_and_sa_fit'}
serialized=json.dumps(logic)
for forbidden in ('opponentSlots','opponentAttack','opponentPassing','relativeStrength','strength.band','matchState','cardRisk','weakZoneKnown'):
    assert forbidden not in serialized, forbidden
assert logic['mentors']['mentors']['enforcer']['tactical']['scoring']=='unavailable_in_prematch_own_squad_mode'
assert logic['mentors']['mentors']['enforcer']['tactical']['prematch_points']==0

# v2 deep-contract checks: exact tactic domains, unique rule IDs, formal features and output contract.
expected_domains={
  'passing':{'short','long','mixed'},'shooting':{'sight','box','balanced'},'focus':{'left','right','both','center','balanced'},
  'cross':{'low','medium','high'},'lost':{'counterPress','regroup'},'won':{'buildup','counter'},
  'mentality':{'hardDefending','defending','normal','attacking','hardAttacking'},'marking':{'man','zonal'},
  'pressing':{'low','mid','high'},'backLine':{'track','offside'},'tackling':{'balanced','stay','aggressive'} }
assert {k:set(v) for k,v in logic['tactics']['option_domains'].items()}==expected_domains
rule_ids=[r['id'] for r in logic['tactics']['rules']]
assert len(rule_ids)==len(set(rule_ids)), 'duplicate tactic rule id'
formation_rule_ids=[r['id'] for r in logic['formation']['rules']]
assert len(formation_rule_ids)==len(set(formation_rule_ids)), 'duplicate formation rule id'
assert logic['feature_model']['status']=='AUTHORITATIVE OWN-SQUAD FEATURE DEFINITIONS'
for req in ('aerialOutlet','counterOutlet','directOutlet','technicalBuild','pressCapacity','lineSpeed','markerCapacity','boxFinishing','longShotThreat','dribbleReliance','defensiveActionDemand'):
    assert req in logic['feature_model']['quality_features'], req
assert logic['formation']['assignment_policy']['best_available']
assert logic['formation']['component_normalization']['lineup_quality']
assert logic['tactics']['component_normalization']['native_lineup_fit']
assert logic['mentors']['state_policy']['unlock_gate']
assert logic['mentors']['scoring']['formula']['attribute']
assert logic['recommendation_output']['explainability']

# v0.5.15 calibration target-shape Training contract deliberately tilts higher-value white skills.
target=logic['training']['target_shape']
assert target['tier_target_ratios']=={'S':1.18,'A':1.05,'B':0.92,'C':0.85}
assert target['secondary_role_only_ratio']<target['tier_target_ratios']['C']
assert target['tier_target_ratios']['S']>target['tier_target_ratios']['A']>target['tier_target_ratios']['B']>target['tier_target_ratios']['C']
assert 'absolute' in target['no_absolute_cap'].lower()
scoring=logic['training']['drill_scoring']
assert scoring['verified_intensity_xp_per_player']=={'Very Easy':1,'Easy':2,'Medium':3,'Hard':4,'Very Hard':5}
assert scoring['verified_condition_drop']=={'Very Easy':0.75,'Easy':1.5,'Medium':2.25,'Hard':3.0,'Very Hard':3.75}
assert scoring['regular_level_effect_percent']=={'Semi-pro':10,'Pro':20,'World-class':30}
assert 'strictly higher max-growth utility' in scoring['harder_drill_policy']
assert 'server-authoritative' in scoring['exact_gain_boundary']

# Complete set-piece package is part of the candidate plan but only as a late tie-break.
sp=logic['set_pieces']
assert 'captain' in sp['slots'] and sp['captain']['status'].startswith('GAMEPLAY-NEUTRAL') and sp['captain']['gameplay_effect_points']==0
assert 'late deterministic tie-break' in sp['team_plan_influence'] and 'Captain is explicitly excluded' in sp['team_plan_influence']
assert any('higher set-piece readiness tuple' in x for x in logic['joint_selection']['tie_break_order'])
assert logic['recommendation_output']['set_pieces']
# All coverage layers must use distinct IDs and known roles.
coverage_ids=[]
for key in ('core_slots','flexibility_slots','availability_depth_slots'):
    for x in logic['squad_blueprint'][key]:
        coverage_ids.append(x['id']); assert all(r in roles for r in x['roles'])
assert len(coverage_ids)==len(set(coverage_ids)), 'duplicate coverage slot id'
# All current offered Playstyles must appear in semantic affinities and training profiles.
offered={p['name'] for p in entries if p.get('id')!=1 and p.get('offer') is not False and p.get('offered') is not False}
assert offered<=set(logic['tactics']['playstyle_affinities']), offered-set(logic['tactics']['playstyle_affinities'])
assert offered<=set(logic['training']['playstyle_role_profiles']), offered-set(logic['training']['playstyle_role_profiles'])

print(f"PASS strategy logic data contract: {len(role_white)} roles, {sum(len(v) for v in logic['training']['playstyle_role_profiles'].values())} role+Playstyle profiles, {len(logic['formation']['rules'])} formation rules, {len(logic['tactics']['rules'])} tactic rules, {len(strings)} strings")
