(() => {
  const TE=window.TE5=window.TE5||{};const B=TE.BibleData,D=TE.Data;
  if(!B||!D)throw new Error('bible-data.js and data.js must load before mentor-engine.js');
  const MODEL_VERSION='30527-synergy-v1';

  function direct(m,tactics,approach,metrics,opponentPassing=null){
    const v=tactics.values||tactics;
    switch(m.id){
      case'architect':return v.passing==='short'?3:v.passing==='mixed'?1:0;
      case'analyst':return v.passing==='long'?3:v.passing==='mixed'?1:0;
      case'wing_commander':return Math.min(3,(['left','right','both'].includes(v.focus)?2:0)+(['medium','high'].includes(v.cross)?1:0));
      case'saboteur':return v.won==='counter'?3:0;
      case'iron_guard':return ['Hard Defending','Defending'].includes(approach)?2:0;
      case'enforcer':return opponentPassing==='Short'?3:opponentPassing==='Mixed'?1:0;
      case'deadball_specialist':{
        const attack=[metrics.TechnicalBuild,metrics.ShootingPower,metrics.Finishing,metrics.WideAttack,metrics.AerialTarget,metrics.Transition].filter(Number.isFinite).sort((a,b)=>a-b);
        const median=attack.length?attack[Math.floor(attack.length/2)]:0,dribbling=metrics.DribblingSupport??metrics.TechnicalBuild;
        return Math.min(3,(v.shooting==='box'?2:0)+(dribbling>=median?1:0));
      }
      default:return 0;
    }
  }
  function attributeCoverage(m,starters){
    let hits=0;
    for(const s of starters)for(const a of m.attribute.attributes)if((D.POSITION_WHITE[s.assignedRole]||[]).includes(a))hits++;
    return{hits,coveragePercent:hits/(11*m.attribute.attributes.length)*100};
  }
  function compare(a,b){
    if(a.directTacticMatch!==b.directTacticMatch)return b.directTacticMatch-a.directTacticMatch;
    if(a.attributeCoverage!==b.attributeCoverage)return b.attributeCoverage-a.attributeCoverage;
    if(a.mentor.level!==b.mentor.level)return b.mentor.level-a.mentor.level;
    return a.stableOrder-b.stableOrder;
  }
  function rawEffects(mentor){
    // Preserve the captured values exactly. No unit conversion and no interpretation of
    // multi-value arrays is performed here.
    return {
      tactic:{id:mentor.tactic.id,current:[...mentor.tactic.current],next:[...mentor.tactic.next]},
      attribute:{id:mentor.attribute.id,attributes:[...mentor.attribute.attributes],current:[...mentor.attribute.current],next:[...mentor.attribute.next]},
      signature:{id:mentor.signature.id,current:[...mentor.signature.current],next:[...mentor.signature.next]}
    };
  }
  function tupleText(r){return `${r.directTacticMatch}/3 direct tactic synergy; ${r.attributeCoverage} useful assigned-role attribute hits; mentor level ${r.mentor.level}.`;}
  function whyBelow(row,best){
    if(row.directTacticMatch<best.directTacticMatch)return `Lower direct tactic match (${row.directTacticMatch}/3 vs ${best.directTacticMatch}/3). ${row.attributeCoverage} useful key-attribute hits; level ${row.mentor.level}.`;
    if(row.attributeCoverage<best.attributeCoverage)return `Same direct tactic match, but lower useful key-attribute coverage (${row.attributeCoverage} vs ${best.attributeCoverage} hits). Level ${row.mentor.level}.`;
    if(row.mentor.level<best.mentor.level)return `Same tactic match and useful coverage, but lower mentor level (${row.mentor.level} vs ${best.mentor.level}).`;
    return `Same scored criteria; stable documented mentor order breaks the tie after tactic match, coverage and level.`;
  }
  function recommend(starters,tactics,{opponentPassing=null}={}){
    if(!starters?.length||!tactics?.values)return{error:'missing-plan'};
    const rows=B.MENTORS.map((mentor,stableOrder)=>{
      const coverage=attributeCoverage(mentor,starters);
      return{
        mentor,stableOrder,
        directTacticMatch:direct(mentor,tactics,tactics.approach,tactics.metrics||{},opponentPassing),
        attributeCoverage:coverage.hits,
        coveragePercent:coverage.coveragePercent,
        rawEffects:rawEffects(mentor)
      };
    }).sort(compare);
    const bestRow=rows[0];
    const best={...bestRow,reason:tupleText(bestRow)};
    const alternatives=rows.slice(1,3).map(r=>({...r,reason:whyBelow(r,bestRow)}));
    return{model:MODEL_VERSION,evidence:'TOP ELEVEN TOOL CALCULATION',best,alternatives,all:rows};
  }
  TE.Mentor={MODEL_VERSION,recommend,attributeCoverage,direct,rawEffects,MENTORS:B.MENTORS};
})();
