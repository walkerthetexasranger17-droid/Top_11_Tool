(() => {
  const TE=window.TE5=window.TE5||{};const S=TE.Storage,P=TE.Players,F=TE.Formation,TAC=TE.Tactics,M=TE.Mentor,D=TE.Data;
  if(!S||!P||!F||!TAC||!M)throw new Error('team plan dependencies must load first');
  const VERSION=1,KEY='teamplan:current';

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
      bench:result.remaining.map(p=>p.key),generatedAt:new Date().toISOString()
    };
  }
  function availabilityIsAvailable(value){
    if(value==null||value==='')return true;
    if(typeof value==='boolean')return value;
    return String(value).trim().toLowerCase()==='available';
  }
  async function buildFormation({templateId=null,mode='bestXI',minCondition=60}={}){
    const players=await P.all(),squadRevision=await P.revision();let eligible=players,readinessWarnings=[];
    if(mode==='matchReadyXI'){
      eligible=players.filter(p=>{
        if(!availabilityIsAvailable(p.availability)){readinessWarnings.push(`${p.name||'Player'} unavailable (${String(p.availability)})`);return false;}
        const c=Number(p.condition);
        if(Number.isFinite(c)&&c<Number(minCondition)){readinessWarnings.push(`${p.name||'Player'} below ${minCondition}% condition`);return false;}
        return true;
      });
    }
    const r=F.choose(eligible,{templateId});if(r.error)return r;
    const base={...serialiseFormation(r,squadRevision,mode),minCondition:Number(minCondition),readinessWarnings};
    const old=await load();if(old?.approach)base.approach=old.approach;if(old?.drainLimit)base.drainLimit=old.drainLimit;
    return await save(base);
  }
  async function hydrateStarters(plan){
    const out=[];for(const s of plan?.starters||[]){const p=await P.get(s.playerKey);if(p)out.push({...s,player:p});}return out;
  }
  async function updateRecommendations({approach='balanced',drainLimit='Medium',opponentPassing=null}={}){
    let plan=await load();const revision=await P.revision();
    // Squad/player changes invalidate the formation dependency. Approach/drain changes do not.
    if(!plan||plan.squadRevision!==revision||plan.formationModel!==F.MODEL_VERSION){
      plan=await buildFormation({templateId:plan?.formationTemplateId||null,mode:plan?.mode||'bestXI',minCondition:plan?.minCondition??60});
      if(plan.error)return plan;
    }
    const starters=await hydrateStarters(plan),tactics=TAC.recommend(starters,{approach,drainLimit});if(tactics.error)return tactics;
    const mentor=M.recommend(starters,tactics,{opponentPassing});
    plan={...plan,approach,drainLimit,tactics,mentor,tacticsModel:TAC.MODEL_VERSION,mentorModel:M.MODEL_VERSION,updatedAt:new Date().toISOString()};
    await save(plan);return plan;
  }
  async function getOrBuild(options={}){
    let plan=await load(),revision=await P.revision();
    if(!plan||plan.squadRevision!==revision||plan.formationModel!==F.MODEL_VERSION)plan=await buildFormation(options);
    return plan;
  }
  TE.TeamPlan={VERSION,KEY,load,save,invalidate,buildFormation,updateRecommendations,getOrBuild,hydrateStarters,availabilityIsAvailable};
})();
