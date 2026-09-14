(() => {
  const TE=window.TE5=window.TE5||{};const B=TE.BibleData,D=TE.Data;
  if(!B||!D)throw new Error('bible-data.js and data.js must load before mentor-engine.js');
  const MODEL_VERSION='mentor-synergy-v3';
  const UNLOCK_LEVELS={tactic:1,attribute:5,signature:10};
  let STATE_OVERRIDES={};
  function clampLevel(v){return Math.max(1,Math.min(10,Math.round(Number(v)||1)));}
  function normaliseState(raw){return{unlocked:!!raw?.unlocked,level:clampLevel(raw?.level)};}
  function setStateOverrides(map={}){STATE_OVERRIDES=Object.fromEntries(Object.entries(map).map(([id,v])=>[id,normaliseState(v)]));}
  function getStateOverrides(){return JSON.parse(JSON.stringify(STATE_OVERRIDES));}
  // Backward API name retained for callers/tests, but values are now state objects rather than screenshot levels.
  function setLevelOverrides(map={}){setStateOverrides(map);}
  function getLevelOverrides(){return getStateOverrides();}
  function effectiveMentor(raw){const state=normaliseState(STATE_OVERRIDES[raw.id]);return{...raw,...state};}
  function activeFamilies(mentor){return{tactic:!!mentor.unlocked&&mentor.level>=UNLOCK_LEVELS.tactic,attribute:!!mentor.unlocked&&mentor.level>=UNLOCK_LEVELS.attribute,signature:!!mentor.unlocked&&mentor.level>=UNLOCK_LEVELS.signature};}

  function direct(m,tactics,approach,metrics,opponentPassing=null){
    if(!activeFamilies(m).tactic)return 0;
    const v=tactics.values||tactics;
    switch(m.id){
      case'architect':return v.passing==='short'?3:v.passing==='mixed'?1:0;
      case'analyst':return v.passing==='long'?3:v.passing==='mixed'?1:0;
      case'wing_commander':return ['left','right','both'].includes(v.focus)?3:0;
      case'saboteur':return v.won==='counter'?3:0;
      case'iron_guard':return ['Hard Defending','Defending'].includes(approach)?2:0;
      case'enforcer':return opponentPassing==='Short'?3:opponentPassing==='Mixed'?1:0;
      case'deadball_specialist':{
        const attack=[metrics.TechnicalBuild,metrics.ShootingPower,metrics.Finishing,metrics.WideAttack,metrics.AerialTarget,metrics.Transition].filter(Number.isFinite).sort((a,b)=>a-b);
        const median=attack.length?attack[Math.floor(attack.length/2)]:0,dribbling=metrics.DribblingSupport??metrics.TechnicalBuild;
        return dribbling>=median?3:1;
      }
      default:return 0;
    }
  }
  function attributeCoverage(m,starters){
    if(!activeFamilies(m).attribute)return{hits:0,coveragePercent:0};
    let hits=0;for(const s of starters)for(const a of m.attribute.attributes)if((D.POSITION_WHITE[s.assignedRole]||[]).includes(a))hits++;
    return{hits,coveragePercent:hits/(11*m.attribute.attributes.length)*100};
  }
  function compare(a,b){
    if(a.directTacticMatch!==b.directTacticMatch)return b.directTacticMatch-a.directTacticMatch;
    if(a.attributeCoverage!==b.attributeCoverage)return b.attributeCoverage-a.attributeCoverage;
    if(a.signatureAvailable!==b.signatureAvailable)return Number(b.signatureAvailable)-Number(a.signatureAvailable);
    return a.stableOrder-b.stableOrder;
  }
  function rawEffects(mentor){
    const active=activeFamilies(mentor);
    return{
      tactic:{id:mentor.tactic.id,active:active.tactic,magnitude:'UNRESOLVED FOR SELECTED LEVEL'},
      attribute:{id:mentor.attribute.id,attributes:[...mentor.attribute.attributes],active:active.attribute,magnitude:'UNRESOLVED FOR SELECTED LEVEL'},
      signature:{id:mentor.signature.id,active:active.signature,magnitude:'UNRESOLVED FOR SELECTED LEVEL'}
    };
  }
  function tupleText(r){const f=r.activeFamilies;return `${r.directTacticMatch}/3 direct tactic synergy; ${r.attributeCoverage} useful assigned-role attribute hits; active families: ${[f.tactic&&'Tactical',f.attribute&&'Attribute',f.signature&&'Signature'].filter(Boolean).join(' + ')||'none'}. Exact level magnitude is unresolved.`;}
  function whyBelow(row,best){
    if(row.directTacticMatch<best.directTacticMatch)return `Lower direct tactic match (${row.directTacticMatch}/3 vs ${best.directTacticMatch}/3).`;
    if(row.attributeCoverage<best.attributeCoverage)return `Same direct tactic match, but lower active Attribute coverage (${row.attributeCoverage} vs ${best.attributeCoverage} key-skill hits).`;
    if(!row.signatureAvailable&&best.signatureAvailable)return `Same tactic/attribute fit, but this Mentor has no active Signature family at the selected level.`;
    return `Same evidence-backed criteria; stable documented Mentor order breaks the tie. Exact level magnitudes are unresolved.`;
  }
  function recommend(starters,tactics,{opponentPassing=null}={}){
    if(!starters?.length||!tactics?.values)return{error:'missing-plan'};
    const rows=B.MENTORS.map((rawMentor,stableOrder)=>{
      const mentor=effectiveMentor(rawMentor),active=activeFamilies(mentor),coverage=attributeCoverage(mentor,starters);
      return{mentor,stableOrder,activeFamilies:active,directTacticMatch:direct(mentor,tactics,tactics.approach,tactics.metrics||{},opponentPassing),attributeCoverage:coverage.hits,coveragePercent:coverage.coveragePercent,signatureAvailable:active.signature,rawEffects:rawEffects(mentor)};
    }).filter(r=>r.mentor.unlocked).sort(compare);
    if(!rows.length)return{model:MODEL_VERSION,evidence:'TOP ELEVEN TOOL CALCULATION',error:'no-unlocked-mentors',best:null,alternatives:[],all:[]};
    const bestRow=rows[0],best={...bestRow,reason:tupleText(bestRow)},alternatives=rows.slice(1,3).map(r=>({...r,reason:whyBelow(r,bestRow)}));
    return{model:MODEL_VERSION,evidence:'TOP ELEVEN TOOL CALCULATION',best,alternatives,all:rows};
  }
  TE.Mentor={MODEL_VERSION,UNLOCK_LEVELS,recommend,attributeCoverage,direct,rawEffects,activeFamilies,setStateOverrides,getStateOverrides,setLevelOverrides,getLevelOverrides,effectiveMentor,MENTORS:B.MENTORS};
})();
