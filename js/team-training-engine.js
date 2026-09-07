(() => {
  const TE=window.TE5=window.TE5||{};
  const D=TE.Data, T=TE.Training;
  if(!D||!T) throw new Error('data.js and training-engine.js must load first');

  function evaluateForGroup(drill,groupKey,maxGrey=2){
    const group=D.TEAM_GROUPS[groupKey];
    if(!group) return null;
    const perPosition=group.positions.map(position=>({position,fit:T.fitDrill(drill,position)}));
    // v5 integrity rule: a drill only represents a group if EVERY position it claims
    // to cover stays inside the grey limit. Positions with zero white skills are not
    // silently counted as covered.
    const applicable=perPosition.filter(x=>x.fit.white.length>0);
    if(!applicable.length) return null;
    const compliant=applicable.filter(x=>x.fit.grey.length<=maxGrey);
    const invalid=applicable.filter(x=>x.fit.grey.length>maxGrey);
    const coveredPositions=compliant.map(x=>x.position);
    const uniqueWhite=[...new Set(compliant.flatMap(x=>x.fit.white))];
    const priority=compliant.reduce((sum,x)=>sum+x.fit.white.reduce((a,s)=>a+Number((D.POSITION_PRIORITY[x.position]||{})[s]||1),0),0);
    const greyCost=compliant.reduce((sum,x)=>sum+x.fit.grey.length,0);
    const coverageRatio=coveredPositions.length/Math.max(1,applicable.length);
    const score=uniqueWhite.length*8+coveredPositions.length*6+priority*2.2+coverageRatio*20-greyCost*2.5;
    return {drill,applicablePositions:applicable.map(x=>x.position),coveredPositions,invalidPositions:invalid.map(x=>x.position),uniqueWhite,score,coverageRatio};
  }

  function buildTeamSession(groupKey,{maxGrey=2,slots=6,strict=true}={}){
    const group=D.TEAM_GROUPS[groupKey];
    if(!group) return {drills:[],error:'invalid-group'};
    let candidates=D.MASTER_DRILLS.map(d=>evaluateForGroup(d,groupKey,maxGrey)).filter(Boolean);
    if(strict){
      // Strict means every position for which the drill has any white relevance must
      // stay within the grey cap. This fixes the old "valid for one role, bad for another" issue.
      candidates=candidates.filter(c=>c.invalidPositions.length===0);
    }
    const selected=[]; const used=new Set(); const coveredSkills=new Set(); const coveredPositions=new Set();
    for(let i=0;i<slots;i++){
      let best=null,bestScore=-Infinity;
      for(const c of candidates){
        if(used.has(c.drill.name)) continue;
        const newSkills=c.uniqueWhite.filter(s=>!coveredSkills.has(s)).length;
        const newPositions=c.coveredPositions.filter(p=>!coveredPositions.has(p)).length;
        const score=c.score+newSkills*11+newPositions*14;
        if(score>bestScore){best=c;bestScore=score;}
      }
      if(!best) break;
      selected.push({...best.drill,fitGroup:best,slot:i+1,recommendationScore:bestScore});
      used.add(best.drill.name);
      best.uniqueWhite.forEach(s=>coveredSkills.add(s));
      best.coveredPositions.forEach(p=>coveredPositions.add(p));
    }
    return {drills:selected,error:null,meta:{groupKey,title:group.title,maxGrey,strict,coveredPositions:[...coveredPositions],coveredSkills:[...coveredSkills]}};
  }

  TE.TeamTraining={evaluateForGroup,buildTeamSession};
})();
