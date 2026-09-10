(() => {
  const TE=window.TE5=window.TE5||{};const B=TE.BibleData,D=TE.Data;
  if(!B||!D)throw new Error('bible-data.js and data.js must load before tactics-engine.js');
  const MODEL_VERSION='30527-drain-fit-v1';
  const DIMENSIONS=['passing','shooting','focus','cross','lost','won','mentality','marking','pressing','backLine','tackling'];
  const SEARCH_DIMS=DIMENSIONS.filter(x=>x!=='mentality');
  const DRAIN_RANK={Low:0,Medium:1,High:2};
  function option(dim,key){return B.TACTICS[dim]?.find(x=>x.key===key)||null;}
  function resolveDrainContribution(defaultContribution,override){
    if(override==null)return defaultContribution;
    let raw=override,kind='auto';
    if(typeof override==='object'&&override!==null){
      if(override.intensity!=null){raw=override.intensity;kind='intensity';}
      else if(override.contribution!=null){raw=override.contribution;kind='contribution';}
      else if(override.value!=null)raw=override.value;
      else return defaultContribution;
    }
    if(typeof raw==='string'){
      const key=raw.trim().toLowerCase();
      if(key==='low')return 0;if(key==='medium')return 5;if(key==='high')return 7;
    }
    const n=Number(raw);
    // Native TacticsDrainOverrides stores nullable ConditionDrainIntensity enum values:
    // Low=0, Medium=1, High=2. Keep legacy/direct contribution inputs 0/5/7 too.
    if(kind==='intensity'||(kind==='auto'&&(n===1||n===2)))return n===0?0:n===1?5:n===2?7:defaultContribution;
    return [0,5,7].includes(n)?n:defaultContribution;
  }
  function calculateDrain(values,overrides={}){
    let raw=15;
    for(const dim of DIMENSIONS){
      const o=option(dim,values?.[dim]);if(!o)throw new Error(`Missing tactic ${dim}`);
      const override=overrides?.[dim]?.[o.key];raw+=resolveDrainContribution(o.drain,override);
    }
    const normalized=raw/100,drainClass=normalized>.65?'High':normalized>.40?'Medium':'Low';
    return{rawScore:raw,normalized,drainClass};
  }
  function enumerate(callback,mentalityKey=null){let count=0;const dims=mentalityKey?SEARCH_DIMS:DIMENSIONS;const vals={};function rec(i){if(i===dims.length){if(mentalityKey)vals.mentality=mentalityKey;count++;callback?.({...vals});return;}const dim=dims[i];for(const o of B.TACTICS[dim]){vals[dim]=o.key;rec(i+1);}}rec(0);return count;}
  function drainChecksums(){const all={Low:0,Medium:0,High:0},perMentality={};enumerate(v=>all[calculateDrain(v).drainClass]++);for(const m of B.TACTICS.mentality){const c={Low:0,Medium:0,High:0};enumerate(v=>c[calculateDrain(v).drainClass]++,m.key);perMentality[m.key]=c;}return{total:Object.values(all).reduce((a,b)=>a+b,0),all,perMentality};}
  function mean(a){const v=a.filter(Number.isFinite);return v.length?v.reduce((x,y)=>x+y,0)/v.length:0;}
  function isKey(starter,attr){return (D.POSITION_WHITE[starter.assignedRole]||[]).includes(attr);}
  function metric(starters,attrs,{roles=null,lane=null}={}){let pool=starters;if(roles)pool=pool.filter(s=>roles.includes(s.assignedRole));if(lane)pool=pool.filter(s=>lane==='left'?s.y<250:lane==='right'?s.y>750:s.y>=250&&s.y<=750);let vals=[];for(const s of pool)for(const a of attrs){const v=Number(s.player?.skills?.[a]);if(isKey(s,a)&&Number.isFinite(v))vals.push(v);}if(!vals.length){for(const s of starters)for(const a of attrs){const v=Number(s.player?.skills?.[a]);if(Number.isFinite(v))vals.push(v);}}return mean(vals);}
  function lineupMetrics(starters){
    const m={};m.TechnicalBuild=metric(starters,['Passing','Creativity','Dribbling']);m.ShootingPower=metric(starters,['Shooting']);m.Finishing=metric(starters,['Shooting','Finishing']);m.WideAttack=metric(starters,['Crossing','Dribbling','Speed'],{roles:['DL','DR','ML','MR','AML','AMR']});m.AerialTarget=metric(starters,['Heading','Strength','Positioning'],{roles:['DC','DMC','AMC','ST']});m.Transition=metric(starters,['Speed','Passing','Dribbling','Finishing']);m.PressingUnit=metric(starters,['Fitness','Aggression','Tackling','Bravery']);m.DefensiveUnit=metric(starters,['Tackling','Marking','Positioning','Bravery']);m.LineControl=metric(starters,['Positioning','Speed','Bravery'],{roles:['DL','DC','DR','DMC']});m.DribblingSupport=metric(starters,['Dribbling']);m.FitnessMean=metric(starters,['Fitness']);m.TacklingMean=metric(starters,['Tackling']);m.PositioningMean=metric(starters,['Positioning']);m.BraveryMean=metric(starters,['Bravery']);m.AggressionMean=metric(starters,['Aggression']);
    // Bible's lane score is "relevant attacking/build attributes". This explicit companion implementation
    // uses the union of the named build/attacking attributes already defined in §11.2, not a hidden game weight.
    const laneAttrs=['Passing','Creativity','Dribbling','Crossing','Shooting','Finishing','Speed'];m.LeftLane=metric(starters,laneAttrs,{lane:'left'});m.CenterLane=metric(starters,laneAttrs,{lane:'center'});m.RightLane=metric(starters,laneAttrs,{lane:'right'});return m;
  }
  function rawSupports(m){const av=(...x)=>mean(x);return{
    passing:{short:m.TechnicalBuild,long:av(m.Transition,m.AerialTarget),mixed:av(m.TechnicalBuild,av(m.Transition,m.AerialTarget))},
    shooting:{sight:m.ShootingPower,box:av(m.TechnicalBuild,m.Finishing),balanced:av(m.ShootingPower,av(m.TechnicalBuild,m.Finishing))},
    focus:{left:m.LeftLane,right:m.RightLane,both:av(m.LeftLane,m.RightLane),center:m.CenterLane,balanced:av(m.LeftLane,m.CenterLane,m.RightLane)},
    cross:{low:m.TechnicalBuild,high:av(m.WideAttack,m.AerialTarget),medium:av(m.TechnicalBuild,av(m.WideAttack,m.AerialTarget))},
    lost:{counterPress:m.PressingUnit,regroup:m.DefensiveUnit},won:{buildup:m.TechnicalBuild,counter:m.Transition},
    marking:{man:av(m.DefensiveUnit,m.FitnessMean),zonal:av(m.DefensiveUnit,m.LineControl)},pressing:{low:m.DefensiveUnit,mid:av(m.DefensiveUnit,m.PressingUnit),high:m.PressingUnit},
    backLine:{track:m.DefensiveUnit,offside:m.LineControl},tackling:{stay:av(m.TacklingMean,m.PositioningMean),aggressive:av(m.TacklingMean,m.BraveryMean,m.AggressionMean),balanced:av(av(m.TacklingMean,m.PositioningMean),av(m.TacklingMean,m.BraveryMean,m.AggressionMean))}
  };}
  function optionFits(starters,approachKey){const approach=B.APPROACHES[approachKey]||B.APPROACHES.balanced,m=lineupMetrics(starters),raw=rawSupports(m),fits={};for(const dim of SEARCH_DIMS){const vals=B.TACTICS[dim].map(o=>raw[dim][o.key]),lo=Math.min(...vals),hi=Math.max(...vals);fits[dim]={};for(const o of B.TACTICS[dim]){const squadFit=hi===lo?1:(raw[dim][o.key]-lo)/(hi-lo),approachFit=1-Math.abs(o.style-approach.index);fits[dim][o.key]={rawSupport:raw[dim][o.key],squadFit,approachFit,optionFit:(squadFit+approachFit)/2,maxSquadFit:squadFit===Math.max(...B.TACTICS[dim].map(x=>hi===lo?1:(raw[dim][x.key]-lo)/(hi-lo)))};}}return{approach,metrics:m,raw,fits};}
  function recommend(starters,{approach='balanced',drainLimit='Medium',overrides={}}={}){
    if(!starters?.length)return{error:'no-lineup'};
    const calc=optionFits(starters,approach),mentality=calc.approach.mentality,limit=DRAIN_RANK[drainLimit]??1;
    let best=null,ordinal=0,eligibleCandidates=0;
    const evaluatedCandidates=enumerate(values=>{
      const drain=calculateDrain(values,overrides);
      if(DRAIN_RANK[drain.drainClass]>limit){ordinal++;return;}
      eligibleCandidates++;
      const fitVals=SEARCH_DIMS.map(dim=>calc.fits[dim][values[dim]]),tacticFit=mean(fitVals.map(x=>x.optionFit)),maxCount=fitVals.filter(x=>x.maxSquadFit).length,cand={values:{...values},...drain,tacticFit,maxSquadFitDimensions:maxCount,ordinal};
      if(!best||tacticFit>best.tacticFit+1e-12||Math.abs(tacticFit-best.tacticFit)<=1e-12&&(drain.rawScore<best.rawScore||drain.rawScore===best.rawScore&&(maxCount>best.maxSquadFitDimensions||maxCount===best.maxSquadFitDimensions&&ordinal<best.ordinal)))best=cand;
      ordinal++;
    },mentality);
    if(!best)return{error:'no-drain-compatible-plan',evaluatedCandidates,eligibleCandidates};
    const reasons={};
    for(const dim of SEARCH_DIMS){
      const o=option(dim,best.values[dim]),f=calc.fits[dim][o.key];
      const effectiveContribution=resolveDrainContribution(o.drain,overrides?.[dim]?.[o.key]);
      reasons[dim]=`${o.label}: lineup support ${f.rawSupport.toFixed(1)}, squad fit ${(f.squadFit*100).toFixed(0)}%, approach fit ${(f.approachFit*100).toFixed(0)}%; drain contribution ${effectiveContribution}.`;
    }
    reasons.mentality=`${option('mentality',mentality).label} is locked by the ${calc.approach.label} approach.`;
    return{model:MODEL_VERSION,evidence:'TOP ELEVEN TOOL CALCULATION',approach:calc.approach.label,drainLimit,metrics:calc.metrics,evaluatedCandidates,eligibleCandidates,...best,reasons};
  }
  TE.Tactics={MODEL_VERSION,DIMENSIONS,SEARCH_DIMS,calculateDrain,resolveDrainContribution,enumerate,drainChecksums,lineupMetrics,rawSupports,optionFits,recommend,option};
})();
