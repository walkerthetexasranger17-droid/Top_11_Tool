from pathlib import Path
root=Path(__file__).resolve().parents[1]
app=(root/'js/app.js').read_text(encoding='utf-8')
idx=(root/'index.html').read_text(encoding='utf-8')
scanner=(root/'js/scanner-engine.js').read_text(encoding='utf-8')
checks=[]
def need(cond,msg):
    if not cond: raise AssertionError(msg)
    checks.append(msg)
need('abilityChoicesForRoles' in app,'shared UI role-filter helper exists')
need('D.specialAbilitiesForRoles?.(roles)' in app,'picker uses shared strict eligibility data')
need('kept.has(a)' in app,'existing/detected abilities remain visible outside the current role filter')
need("renderProfileRelated();renderProfileAbilities();" in app,'profile role changes refresh SA picker')
need('renderAbilityPicker();persistCurrentQueueDraft()' in app,'scan role changes refresh SA picker')
need("[...currentEditRoles(),...state.profilePreservedRoles]" in app,'all natural profile roles, including preserved imported roles, contribute')
need('scanNaturalRoles()' in app,'scan filtering uses natural roles')
need('Related roles' in idx and "Filtered by the player's natural roles" in idx,'profile explains natural-role filtering')
need("Choices are filtered by the player's natural roles" in idx,'scanner review explains role filtering')
need('Never infer a playstyle or Special Ability from position, role, stats, OVR, player name, or football semantics.' in scanner,'scanner identity recognition remains role-independent')
need('const ABILITIES=[...D.SPECIAL_ABILITIES]' in scanner,'scanner still compares against full 19-ability identity catalogue')
print(f'Special Ability picker contract: PASS — {len(checks)} assertions')
