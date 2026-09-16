(() => {
  const TE=window.TE5=window.TE5||{},D=TE.Data,F=TE.Formation,TAC=TE.Tactics,M=TE.Mentor,R=TE.Recommendations,STRAT=TE.Strategy,DATA=TE.BestInSlotData;
  if(!D||!F||!TAC||!M||!R||!STRAT||!DATA)throw new Error('Best-in-Slot dependencies must load first');
  const MODEL_VERSION='best-in-slot-goal-v2-role-identity-only';
  const SQUAD_GAP_MODEL='best-in-slot-squad-gap-v2-actionable-identity';
  const MAX_SPECIAL_ABILITIES=2;
  function clone(x){return JSON.parse(JSON.stringify(x));}
  function naturalRoles(player){return [...new Set((Array.isArray(player?.roles)?player.roles:[player?.position]).map(D.normaliseRole).filter(Boolean))];}
  function levelName(id){const row=(D.PLAYSTYLE_LEVELS||[]).find(x=>Number(x?.id)===Number(id));return row?.name||null;}
  function identityFacts(player,slot){
    const targetPlaystyle=slot?.playstyle||null,currentPlaystyle=STRAT.playstyleName(player),playstyleActive=STRAT.playstyleActive(player),playstyleLevel=STRAT.playstyleLevelId(player),playstyleExact=!!targetPlaystyle&&playstyleActive&&currentPlaystyle===targetPlaystyle;
    const owned=STRAT.abilityNames(player),ownedAbilities=[...owned],targetAbilities=[...(slot?.specialAbilities||[])],matchedAbilities=targetAbilities.filter(sa=>owned.has(D.canonicalSpecialAbilityName(sa)||sa)),missingAbilities=targetAbilities.filter(sa=>!owned.has(D.canonicalSpecialAbilityName(sa)||sa)),abilitySlotsUsed=Math.min(MAX_SPECIAL_ABILITIES,ownedAbilities.length),abilitySlotsFree=Math.max(0,MAX_SPECIAL_ABILITIES-abilitySlotsUsed),canAddMissingAbilities=missingAbilities.length<=abilitySlotsFree;
    const playstyleMaster=playstyleExact&&Number(playstyleLevel)===5;
    return{targetPlaystyle,currentPlaystyle,playstyleActive,playstyleLevel,playstyleLevelName:levelName(playstyleLevel),playstyleExact,playstyleMaster,targetAbilities,ownedAbilities,matchedAbilities,missingAbilities,abilitySlotsUsed,abilitySlotsFree,canAddMissingAbilities,abilityComplete:missingAbilities.length===0,identityComplete:playstyleExact&&missingAbilities.length===0,masterReady:playstyleMaster&&missingAbilities.length===0};
  }
  function assignmentWeight(player,slot){
    const role=D.normaliseRole(slot?.role);if(!role||!naturalRoles(player).includes(role))return-1000000000;
    const f=identityFacts(player,slot);let score=1000000;
    if(f.playstyleExact){score+=10000;score+=Math.max(0,Math.min(5,Number(f.playstyleLevel)||0))*100;}
    score+=f.matchedAbilities.length*10;
    if(f.abilityComplete&&f.targetAbilities.length)score+=1;
    return score;
  }
  function maximiseAssignment(weights){
    const n=weights.length,m=weights[0]?.length||0;if(!n||m<n)return[];
    let maxW=0;for(const row of weights)for(const w of row)if(Number.isFinite(w))maxW=Math.max(maxW,w);
    const u=Array(n+1).fill(0),v=Array(m+1).fill(0),p=Array(m+1).fill(0),way=Array(m+1).fill(0);
    for(let i=1;i<=n;i++){
      p[0]=i;let j0=0;const minv=Array(m+1).fill(Infinity),used=Array(m+1).fill(false);
      do{used[j0]=true;const i0=p[j0];let delta=Infinity,j1=0;for(let j=1;j<=m;j++){if(used[j])continue;const w=weights[i0-1][j-1],cur=(maxW-w)-u[i0]-v[j];if(cur<minv[j]-1e-9){minv[j]=cur;way[j]=j0;}if(minv[j]<delta-1e-9){delta=minv[j];j1=j;}}for(let j=0;j<=m;j++){if(used[j]){u[p[j]]+=delta;v[j]-=delta;}else minv[j]-=delta;}j0=j1;}while(p[j0]!==0);
      do{const j1=way[j0];p[j0]=p[j1];j0=j1;}while(j0!==0);
    }
    const out=Array(n).fill(-1);for(let j=1;j<=m;j++)if(p[j]>0)out[p[j]-1]=j-1;return out;
  }
  function squadGap(players=[],goal=null){
    const g=goal||getGoal();if(!g||g.error)return{model:SQUAD_GAP_MODEL,error:'goal-unavailable',slots:[],summary:{naturalCovered:0,identityComplete:0,masterReady:0,missing:11}};
    const roster=(Array.isArray(players)?players:[]).filter(Boolean),slots=g.slots||[],dummyCount=slots.length,columns=roster.length+dummyCount;
    const weights=slots.map(slot=>Array.from({length:columns},(_,j)=>j<roster.length?assignmentWeight(roster[j],slot):0)),assignment=maximiseAssignment(weights);
    const rows=slots.map((slot,i)=>{const col=assignment[i],player=col>=0&&col<roster.length&&weights[i][col]>0?roster[col]:null;if(!player)return{slot:i+1,role:slot.role,target:clone(slot),player:null,status:'missing-natural-role',naturalRoleCovered:false,identityComplete:false,masterReady:false,playstyle:null,abilities:{matched:[],missing:[...(slot.specialAbilities||[])]}};const facts=identityFacts(player,slot);let status='playstyle-development';if(facts.masterReady)status='master-ready';else if(facts.identityComplete)status='playstyle-upgrade';else if(facts.playstyleExact)status=facts.canAddMissingAbilities?'sa-development':'sa-capacity-gap';else if(facts.currentPlaystyle&&facts.currentPlaystyle!==facts.targetPlaystyle)status='playstyle-identity-gap';return{slot:i+1,role:slot.role,target:clone(slot),player:{key:player.key,name:player.name||'Player',roles:naturalRoles(player)},status,naturalRoleCovered:true,identityComplete:facts.identityComplete,masterReady:facts.masterReady,trainableDevelopment:['playstyle-development','playstyle-upgrade','sa-development'].includes(status),identityGap:['playstyle-identity-gap','sa-capacity-gap'].includes(status),playstyle:{target:facts.targetPlaystyle,current:facts.currentPlaystyle,active:facts.playstyleActive,level:facts.playstyleLevel,levelName:facts.playstyleLevelName,exact:facts.playstyleExact,master:facts.playstyleMaster},abilities:{target:facts.targetAbilities,owned:facts.ownedAbilities,matched:facts.matchedAbilities,missing:facts.missingAbilities,slotsUsed:facts.abilitySlotsUsed,slotsFree:facts.abilitySlotsFree,canAddMissing:facts.canAddMissingAbilities}};});
    const naturalCovered=rows.filter(x=>x.naturalRoleCovered).length,identityComplete=rows.filter(x=>x.identityComplete).length,masterReady=rows.filter(x=>x.masterReady).length,trainableDevelopment=rows.filter(x=>x.trainableDevelopment).length,identityGaps=rows.filter(x=>x.identityGap).length,missing=rows.length-naturalCovered;
    return{model:SQUAD_GAP_MODEL,policy:'Natural-role coverage first; among legal natural-role assignments, exact active Playstyle then Playstyle level then target-SA matches are used only to choose the closest existing player. No skills or OVR are read. Wrong Playstyle identities and full two-SA capacity conflicts are separated from normal trainable development.',formation:{id:g.formation.id,name:g.formation.name},slots:rows,summary:{total:rows.length,naturalCovered,identityComplete,masterReady,trainableDevelopment,identityGaps,development:trainableDevelopment,missing,coveragePercent:rows.length?100*naturalCovered/rows.length:0,masterReadyPercent:rows.length?100*masterReady/rows.length:0}};
  }
  function validate(){
    const errors=[];if(DATA.model!==MODEL_VERSION)errors.push('model-version');
    const src=DATA.sourceModels||{};if(src.gameData!==D.GAME_DATA_VERSION)errors.push('game-data-version');if(src.strategy!==STRAT.MODEL_VERSION)errors.push('strategy-model');if(src.formation!==F.MODEL_VERSION)errors.push('formation-model');if(src.tactics!==TAC.MODEL_VERSION)errors.push('tactics-model');if(src.mentor!==M.MODEL_VERSION)errors.push('mentor-model');if(src.setPieces!==R.SET_PIECE_MODEL)errors.push('set-piece-model');
    const formation=F.formationById(DATA.formation?.id);if(!formation)errors.push('formation-id');const slots=Array.isArray(DATA.slots)?DATA.slots:[];if(slots.length!==11)errors.push('slot-count');
    for(const [i,s] of slots.entries()){
      const role=D.normaliseRole(s.role),formationSlot=formation?.slots?.[i];
      if(!role)errors.push(`slot-${i}-role`);
      if(formationSlot&&!F.options(formationSlot).includes(role))errors.push(`slot-${i}-formation-role`);
      if(s.playstyle&&!D.playstylesForRoles([role]).includes(s.playstyle))errors.push(`slot-${i}-playstyle`);
      if((s.specialAbilities||[]).length>2)errors.push(`slot-${i}-sa-count`);
      for(const sa of s.specialAbilities||[])if(!D.isSpecialAbilityEligibleForRoles(sa,[role]))errors.push(`slot-${i}-sa-${sa}`);
      if(!Number.isFinite(Number(s.x))||!Number.isFinite(Number(s.y)))errors.push(`slot-${i}-coords`);
    }
    return{valid:errors.length===0,errors};
  }
  function getGoal(){const check=validate();return check.valid?clone(DATA):{error:'best-in-slot-data-invalid',validation:check};}
  function tacticLabel(dimension,key){return TAC.option(dimension,key)?.label||key||'—';}
  TE.BestInSlot={MODEL_VERSION,SQUAD_GAP_MODEL,MAX_SPECIAL_ABILITIES,validate,getGoal,tacticLabel,squadGap,identityFacts,assignmentWeight};
})();
