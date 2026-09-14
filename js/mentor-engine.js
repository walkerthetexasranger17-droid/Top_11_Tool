(() => {
  const TE=window.TE5=window.TE5||{};const B=TE.BibleData,D=TE.Data;
  if(!B||!D)throw new Error('bible-data.js and data.js must load before mentor-engine.js');
  const MODEL_VERSION='mentor-synergy-v4-level-gated';
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
  function signatureContext(m,starters,tactics,{phase='prematch',matchState='level',weakZone=null,setPieceEmphasis=false,relativeStrength=0}={}){
    if(!activeFamilies(m).signature)return{score:0,reason:`Signature locked until Level ${UNLOCK_LEVELS.signature}`};
    const v=tactics.values||tactics,ps=new Set((starters||[]).map(s=>D.playstyleDefinition(s.player?.playstyle||s.player?.playstyleType)?.name).filter(Boolean));
    switch(m.id){
      case'saboteur':return v.won==='counter'?{score:3,reason:'Blind Side is relevant to the selected counterattack plan'}:{score:0,reason:'Blind Side needs a counterattack context'};
      case'wing_commander':{let score=0;const why=[];if(['left','right','both'].includes(v.focus)){score++;why.push('flank focus');}if(['medium','high'].includes(v.cross)){score++;why.push('regular/high crossing');}if(ps.has('Target Man')){score++;why.push('Target Man aerial outlet');}return{score:Math.min(3,score),reason:why.length?`Aerial Dominance context: ${why.join(' + ')}`:'No strong crossing/aerial context'};}
      case'analyst':return phase==='halftime'?{score:weakZone?3:2,reason:weakZone?`Adaptive Blueprint can target the observed ${weakZone} weak zone`:'Adaptive Blueprint is a halftime adaptation effect'}:{score:0,reason:'Adaptive Blueprint is primarily a halftime effect'};
      case'architect':return v.passing==='short'&&v.won==='buildup'?{score:3,reason:'Momentum Chain fits sustained short-passing buildup'}:v.passing==='short'?{score:2,reason:'Momentum Chain fits a short-passing plan'}:{score:0,reason:'No sustained short-passing context for Momentum Chain'};
      case'deadball_specialist':return setPieceEmphasis?{score:3,reason:'Ankle Breaker receives explicit set-piece emphasis'}:{score:0,reason:'Set-piece opportunity rate is unknown pre-match'};
      case'iron_guard':{let score=0;const why=[];if(['defending','hardDefending'].includes(v.mentality)){score+=2;why.push('defensive mentality');}if(Number(relativeStrength)<=-5){score++;why.push('stronger opponent');}return{score:Math.min(3,score),reason:why.length?`Iron Check context: ${why.join(' + ')}`:'No exceptional defensive-disruption context'};}
      case'enforcer':return matchState==='leading'?{score:3,reason:'Parking the Bus is active while protecting a lead'}:{score:0,reason:'Parking the Bus depends on being in front'};
      default:return{score:0,reason:'No signature context rule'};
    }
  }
  function nextUnlock(m){const level=Number(m.level)||1;if(!m.unlocked)return{family:'mentor',level:1};if(level<UNLOCK_LEVELS.attribute)return{family:'attribute',level:UNLOCK_LEVELS.attribute};if(level<UNLOCK_LEVELS.signature)return{family:'signature',level:UNLOCK_LEVELS.signature};return null;}
  function compare(a,b){
    if(Math.abs(a.totalScore-b.totalScore)>1e-12)return b.totalScore-a.totalScore;
    if(a.directTacticMatch!==b.directTacticMatch)return b.directTacticMatch-a.directTacticMatch;
    if(a.signatureScore!==b.signatureScore)return b.signatureScore-a.signatureScore;
    if(a.attributeCoverage!==b.attributeCoverage)return b.attributeCoverage-a.attributeCoverage;
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
  function tupleText(r){const f=r.activeFamilies,n=r.nextUnlock;return `${r.totalScore.toFixed(2)} plan score; tactic ${r.directTacticMatch}/3; attribute ${(r.attributeScore).toFixed(2)}/3; signature ${r.signatureScore}/3. Active: ${[f.tactic&&'Tactical',f.attribute&&'Attribute',f.signature&&'Signature'].filter(Boolean).join(' + ')||'none'}${n?`; next unlock ${n.family} at Level ${n.level}`:''}.`;}
  function whyBelow(row,best){return `Plan score ${row.totalScore.toFixed(2)} vs ${best.totalScore.toFixed(2)}: tactic ${row.directTacticMatch}/3, attribute ${row.attributeScore.toFixed(2)}/3, signature ${row.signatureScore}/3.`;}
  function recommend(starters,tactics,{opponentPassing=null,phase='prematch',matchState='level',weakZone=null,setPieceEmphasis=false,relativeStrength=0}={}){
    if(!starters?.length||!tactics?.values)return{error:'missing-plan'};
    const rows=B.MENTORS.map((rawMentor,stableOrder)=>{
      const mentor=effectiveMentor(rawMentor),active=activeFamilies(mentor),coverage=attributeCoverage(mentor,starters),directTacticMatch=direct(mentor,tactics,tactics.approach,tactics.metrics||{},opponentPassing),signature=signatureContext(mentor,starters,tactics,{phase,matchState,weakZone,setPieceEmphasis,relativeStrength}),attributeScore=active.attribute?Math.min(3,coverage.coveragePercent/100*3):0,totalScore=directTacticMatch+attributeScore+signature.score;
      return{mentor,stableOrder,activeFamilies:active,directTacticMatch,attributeCoverage:coverage.hits,coveragePercent:coverage.coveragePercent,attributeScore,signatureAvailable:active.signature,signatureScore:signature.score,signatureReason:signature.reason,totalScore,nextUnlock:nextUnlock(mentor),rawEffects:rawEffects(mentor)};
    }).filter(r=>r.mentor.unlocked).sort(compare);
    if(!rows.length)return{model:MODEL_VERSION,evidence:'TOP ELEVEN TOOL CALCULATION',error:'no-unlocked-mentors',best:null,alternatives:[],all:[]};
    const bestRow=rows[0],best={...bestRow,reason:tupleText(bestRow)},alternatives=rows.slice(1,3).map(r=>({...r,reason:whyBelow(r,bestRow)}));
    return{model:MODEL_VERSION,evidence:'TOP ELEVEN TOOL CALCULATION',best,alternatives,all:rows};
  }
  TE.Mentor={MODEL_VERSION,UNLOCK_LEVELS,recommend,attributeCoverage,direct,signatureContext,nextUnlock,rawEffects,activeFamilies,setStateOverrides,getStateOverrides,setLevelOverrides,getLevelOverrides,effectiveMentor,MENTORS:B.MENTORS};
})();
