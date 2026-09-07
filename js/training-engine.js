(() => {
  const TE = window.TE5 = window.TE5 || {};
  const D = TE.Data;
  if(!D) throw new Error('TE5.Data must load before training-engine.js');

  const EFFICIENCY_RULE = 180;
  const ATTRIBUTE_CAP = 400;
  const DIFFICULTY_WEIGHT = {"Very Easy":0.86,"Easy":1.00,"Medium":1.20,"Hard":1.45,"Very Hard":1.72};

  function skillsFor(pos){ return pos==='GK' ? [...D.GK_SKILLS,'Fitness'] : D.OUTFIELD_SKILLS; }

  function fitDrill(drill,pos){
    const white=D.POSITION_WHITE[pos]||[];
    const pool=skillsFor(pos);
    const fit={white:[],grey:[],na:[]};
    for(const skill of drill.skills){
      if(white.includes(skill)) fit.white.push(skill);
      else if(pool.includes(skill)) fit.grey.push(skill);
      else fit.na.push(skill);
    }
    return fit;
  }

  function priorityFor(pos,skill){ return Number((D.POSITION_PRIORITY[pos]||{})[skill]||1); }

  function evaluateDrill(drill,pos,skills,maxGrey=1){
    const fit=fitDrill(drill,pos);
    if(!fit.white.length || fit.grey.length>maxGrey) return {...drill,fit,viable:false,reason:'grey-limit'};
    const values=fit.white.map(s=>Number(skills?.[s]||0));
    const ruleCap=EFFICIENCY_RULE*fit.white.length;
    const whiteTotal=values.reduce((a,b)=>a+b,0);
    const headroom=Math.max(0,ruleCap-whiteTotal);
    const capRoom=fit.white.reduce((sum,s)=>sum+Math.max(0,ATTRIBUTE_CAP-Number(skills?.[s]||0)),0);
    const weightedNeed=fit.white.reduce((sum,s)=>sum+Math.max(0,EFFICIENCY_RULE-Number(skills?.[s]||0))*priorityFor(pos,s),0);
    const priorityMass=fit.white.reduce((sum,s)=>sum+priorityFor(pos,s),0);
    const efficiency=headroom/Math.max(1,ruleCap);
    const difficulty=DIFFICULTY_WEIGHT[drill.diff]||1;
    const viable=headroom>0 && capRoom>0;
    const greyPenalty=fit.grey.length*12;
    // Recommendation score only. It is deliberately not presented as an official XP formula.
    const core=(weightedNeed*1.10)+(headroom*0.52)+(priorityMass*13)+(efficiency*45)-greyPenalty;
    const baseScore=core*difficulty;
    return {...drill,fit,viable,ruleCap,whiteTotal,headroom,capRoom,weightedNeed,efficiency,difficulty,baseScore,
      nearWall: viable && headroom<=Math.max(10,ruleCap*.12)};
  }

  function getEligibleDrills(pos,skills,maxGrey=1,disabled=[]){
    const off=new Set(disabled||[]);
    return D.MASTER_DRILLS
      .filter(d=>!off.has(d.name))
      .map(d=>evaluateDrill(d,pos,skills,maxGrey))
      .filter(d=>d.viable)
      .sort((a,b)=>b.baseScore-a.baseScore || a.name.localeCompare(b.name));
  }

  function slotScore(candidate,pos,coverage,useCount){
    let novelty=0, reinforcement=0;
    for(const skill of candidate.fit.white){
      const c=coverage.get(skill)||0;
      const p=priorityFor(pos,skill);
      if(c===0) novelty+=32*p;
      else if(c===1) reinforcement+=10*p;
      else if(c===2) reinforcement+=3*p;
    }
    const repeats=useCount.get(candidate.name)||0;
    const repeatMultiplier=repeats===0?1:(repeats===1?.80:repeats===2?.62:repeats===3?.48:.38);
    return (candidate.baseScore+novelty+reinforcement)*repeatMultiplier;
  }

  function buildIndividualSession({position,skills,maxGrey=1,disabled=[],slots=6}={}){
    if(!D.ALL_POSITIONS.includes(position)) return {drills:[],error:'invalid-position'};
    const candidates=getEligibleDrills(position,skills,maxGrey,disabled);
    if(!candidates.length) return {drills:[],error:'no-eligible-drills',candidates:[]};

    const selected=[];
    const coverage=new Map();
    const useCount=new Map();
    for(let slot=0;slot<slots;slot++){
      let best=null,bestScore=-Infinity;
      let bestUnique=null,bestUniqueScore=-Infinity;
      for(const c of candidates){
        const repeatsAlready=useCount.get(c.name)||0;
        const anyUnused=candidates.some(x=>!(useCount.get(x.name)||0));
        if(repeatsAlready>=2 && anyUnused) continue;
        const score=slotScore(c,position,coverage,useCount);
        if(score>bestScore){best=c;bestScore=score;}
        if(!(useCount.get(c.name)||0) && score>bestUniqueScore){bestUnique=c;bestUniqueScore=score;}
      }
      // Prefer a new drill whenever it remains reasonably competitive. Repeats are allowed
      // only when the repeated drill is clearly more useful than every unused alternative.
      if(bestUnique && bestUniqueScore>=bestScore*.82){best=bestUnique;bestScore=bestUniqueScore;}
      if(!best) break;
      const repeatsBefore=useCount.get(best.name)||0;
      const reasons=[];
      if(best.difficulty>=DIFFICULTY_WEIGHT.Hard) reasons.push('high difficulty');
      if(best.headroom>best.ruleCap*.45) reasons.push('strong 180-rule headroom');
      const newSkills=best.fit.white.filter(s=>!(coverage.get(s)||0));
      if(newSkills.length) reasons.push(`new coverage: ${newSkills.join(', ')}`);
      if(repeatsBefore) reasons.push('repeat still outscored alternatives');
      selected.push({...best,slot:slot+1,recommendationScore:bestScore,reasons,repeated:repeatsBefore>0});
      useCount.set(best.name,repeatsBefore+1);
      for(const s of best.fit.white) coverage.set(s,(coverage.get(s)||0)+1);
    }
    return {
      drills:selected,
      error:null,
      meta:{position,maxGrey,slotsRequested:slots,eligibleCount:candidates.length,coveredWhiteSkills:[...coverage.keys()],rule:EFFICIENCY_RULE,attributeCap:ATTRIBUTE_CAP}
    };
  }

  TE.Training={EFFICIENCY_RULE,ATTRIBUTE_CAP,DIFFICULTY_WEIGHT,fitDrill,evaluateDrill,getEligibleDrills,buildIndividualSession};
})();
