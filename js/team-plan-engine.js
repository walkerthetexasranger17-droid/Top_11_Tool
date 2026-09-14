(() => {
  const TE=window.TE5=window.TE5||{};const S=TE.Storage,P=TE.Players,F=TE.Formation,TAC=TE.Tactics,M=TE.Mentor,D=TE.Data,SC=TE.SquadCoverage;
  if(!S||!P||!F||!TAC||!M||!SC)throw new Error('team plan dependencies must load first');
  const VERSION=2,KEY='teamplan:current';

  async function load(){return await S.getJSON(KEY,null);}
  async function save(plan){await S.setJSON(KEY,plan);return plan;}
  async function invalidate(){await S.del(KEY);}
  function serialiseFormation(result,squadRevision,mode='bestXI'){
    return{
      version:VERSION,gameDataVersion:D.GAME_DATA_VERSION,formationModel:F.MODEL_VERSION,squadRevision,mode,
      formationTemplateId:result.formation.id,formationName:result.formation.name,
      starters:result.chosen.map(x=>({
        playerKey:x.player.key,assignedRole:x.assignedRole,suitability:x.suitability,
        x:Number(x.x),y:Number(x.y),roleMean:x.roleMean,roleFloor:x.roleFloor,
        playstyleFit:x.playstyleFit,playstyleLevel:x.playstyleLevel,weakest:x.weakest
      })),
      bench:result.remaining.map(p=>p.key),strategic:result.strategic||null,generatedAt:new Date().toISOString()
    };
  }
  function availabilityIsAvailable(value){
    if(value==null||value==='')return true;
    if(typeof value==='boolean')return value;
    return String(value).trim().toLowerCase()==='available';
  }
  async function buildFormation({templateId=null,mode='bestXI',minCondition=60,opponentSlots=null}={}){
    const players=await P.all(),squadRevision=await P.revision();let eligible=players,readinessWarnings=[];
    if(mode==='matchReadyXI'){
      eligible=players.filter(p=>{
        if(!availabilityIsAvailable(p.availability)){readinessWarnings.push(`${p.name||'Player'} unavailable (${String(p.availability)})`);return false;}
        const c=Number(p.condition);
        if(Number.isFinite(c)&&c<Number(minCondition)){readinessWarnings.push(`${p.name||'Player'} below ${minCondition}% condition`);return false;}
        return true;
      });
    }
    const r=F.chooseStrategic(eligible,{templateId,opponentSlots});if(r.error)return r;
    const base={...serialiseFormation(r,squadRevision,mode),minCondition:Number(minCondition),readinessWarnings,opponentSlots:opponentSlots||null,squadCoverage:SC.analyse(players)};
    const old=await load();if(old?.approach)base.approach=old.approach;if(old?.drainLimit)base.drainLimit=old.drainLimit;
    return await save(base);
  }
  async function hydrateStarters(plan){
    const out=[];for(const s of plan?.starters||[]){const p=await P.get(s.playerKey);if(p)out.push({...s,player:p});}return out;
  }
  async function updateRecommendations({approach='balanced',drainLimit='Medium',opponentPassing=null,opponentAttack='unknown',opponentSlots=null,relativeStrength=0,phase='prematch',matchState='level',weakZone=null,setPieceEmphasis=false}={}){
    let plan=await load();const revision=await P.revision();
    // Squad/player changes invalidate the formation dependency. Approach/drain changes do not.
    if(!plan||plan.squadRevision!==revision||plan.formationModel!==F.MODEL_VERSION){
      plan=await buildFormation({templateId:plan?.formationTemplateId||null,mode:plan?.mode||'bestXI',minCondition:plan?.minCondition??60,opponentSlots:opponentSlots||plan?.opponentSlots||null});
      if(plan.error)return plan;
    }
    const starters=await hydrateStarters(plan),tactics=approach==='auto'?TAC.recommendAuto(starters,{drainLimit,opponentAttack,opponentSlots:opponentSlots||plan.opponentSlots,relativeStrength}):TAC.recommend(starters,{approach,drainLimit,opponentAttack,opponentSlots:opponentSlots||plan.opponentSlots,relativeStrength});if(tactics.error)return tactics;
    const mentor=M.recommend(starters,tactics,{opponentPassing,phase,matchState,weakZone,setPieceEmphasis,relativeStrength});
    plan={...plan,approach,drainLimit,opponentSlots:opponentSlots||plan.opponentSlots||null,relativeStrength,tactics,mentor,tacticsModel:TAC.MODEL_VERSION,mentorModel:M.MODEL_VERSION,updatedAt:new Date().toISOString()};
    await save(plan);return plan;
  }
  function hydrateChosen(result){return(result?.chosen||[]).map(s=>({...s,player:s.player}));}
  function jointScore(formation,tactics,mentor){
    const formationScore=Math.max(0,Math.min(100,Number(formation?.strategic?.totalScore)||0)),tacticScore=Math.max(0,Math.min(100,Number(tactics?.decisionScore)||0)),mentorScore=mentor?.best?Math.max(0,Math.min(100,mentor.best.totalScore/9*100)):0;
    const totalScore=formationScore*.45+tacticScore*.40+mentorScore*.15;return{totalScore,components:{formationScore,tacticScore,mentorScore},weights:{formation:.45,tactics:.40,mentor:.15}};
  }
  async function buildOptimalPlan({mode='bestXI',minCondition=60,drainLimit='Medium',opponentSlots=null,opponentAttack='unknown',opponentPassing=null,relativeStrength=0,phase='prematch',matchState='level',weakZone=null,setPieceEmphasis=false}={}){
    const players=await P.all(),squadRevision=await P.revision();let eligible=players,readinessWarnings=[];
    if(mode==='matchReadyXI'){eligible=players.filter(p=>{if(!availabilityIsAvailable(p.availability)){readinessWarnings.push(`${p.name||'Player'} unavailable (${String(p.availability)})`);return false;}const c=Number(p.condition);if(Number.isFinite(c)&&c<Number(minCondition)){readinessWarnings.push(`${p.name||'Player'} below ${minCondition}% condition`);return false;}return true;});}
    const formations=F.rankStrategic(eligible,{opponentSlots}).filter(x=>!x.error),candidates=[];
    for(const formation of formations){const starters=hydrateChosen(formation),tactics=TAC.recommendAuto(starters,{drainLimit,opponentAttack,opponentSlots,relativeStrength});if(tactics.error)continue;const mentor=M.recommend(starters,tactics,{opponentPassing,phase,matchState,weakZone,setPieceEmphasis,relativeStrength}),score=jointScore(formation,tactics,mentor);candidates.push({formation,tactics,mentor,score});}
    candidates.sort((a,b)=>b.score.totalScore-a.score.totalScore||a.formation.formation.templateOrder-b.formation.formation.templateOrder);if(!candidates.length)return{error:'no-complete-plan'};
    const winner=candidates[0],base=serialiseFormation(winner.formation,squadRevision,mode),plan={...base,version:VERSION,minCondition:Number(minCondition),readinessWarnings,squadCoverage:SC.analyse(players),opponentSlots:opponentSlots||null,opponentAttack,opponentPassing,relativeStrength,approach:'auto',drainLimit,tactics:winner.tactics,mentor:winner.mentor,jointPlan:winner.score,alternatives:candidates.slice(1,3).map(x=>({formationTemplateId:x.formation.formation.id,formationName:x.formation.formation.name,score:x.score,tactics:{approach:x.tactics.approach,values:x.tactics.values,drainClass:x.tactics.drainClass},mentor:x.mentor.best?{id:x.mentor.best.mentor.id,name:x.mentor.best.mentor.displayName,totalScore:x.mentor.best.totalScore}:null})),formationModel:F.MODEL_VERSION,tacticsModel:TAC.MODEL_VERSION,mentorModel:M.MODEL_VERSION,updatedAt:new Date().toISOString()};
    await save(plan);return plan;
  }
  async function getOrBuild(options={}){
    let plan=await load(),revision=await P.revision();
    if(!plan||plan.squadRevision!==revision||plan.formationModel!==F.MODEL_VERSION)plan=await buildFormation(options);
    return plan;
  }
  TE.TeamPlan={VERSION,KEY,load,save,invalidate,buildFormation,updateRecommendations,buildOptimalPlan,jointScore,getOrBuild,hydrateStarters,availabilityIsAvailable};
})();
