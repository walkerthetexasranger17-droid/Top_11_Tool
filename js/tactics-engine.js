(() => {
  const TE=window.TE5=window.TE5||{};const B=TE.BibleData,D=TE.Data;
  if(!B||!D)throw new Error('bible-data.js and data.js must load before tactics-engine.js');
  const MODEL_VERSION='30527-drain-fit-v2';
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
    // Current shipped Top Eleven tooltip text says marking style counters the OPPONENT'S attack type:
    // man-to-man helps against faster attacks; zonal helps against longer-distance attacks.
    // There is therefore no evidence-based reason to rank these from our own XI's fitness/line control.
    // Keep own-team support neutral and let explicit opponent context (when supplied) act only as a tie signal.
    marking:{man:m.DefensiveUnit,zonal:m.DefensiveUnit},pressing:{low:m.DefensiveUnit,mid:av(m.DefensiveUnit,m.PressingUnit),high:m.PressingUnit},
    backLine:{track:m.DefensiveUnit,offside:m.LineControl},tackling:{stay:av(m.TacklingMean,m.PositioningMean),aggressive:av(m.TacklingMean,m.BraveryMean,m.AggressionMean),balanced:av(av(m.TacklingMean,m.PositioningMean),av(m.TacklingMean,m.BraveryMean,m.AggressionMean))}
  };}
  function optionFits(starters,approachKey){
    const approach=B.APPROACHES[approachKey]||B.APPROACHES.balanced,m=lineupMetrics(starters),raw=rawSupports(m),fits={};
    for(const dim of SEARCH_DIMS){
      const vals=B.TACTICS[dim].map(o=>raw[dim][o.key]),lo=Math.min(...vals),hi=Math.max(...vals),normalised=B.TACTICS[dim].map(o=>hi===lo?1:(raw[dim][o.key]-lo)/(hi-lo)),mx=Math.max(...normalised);
      fits[dim]={};
      B.TACTICS[dim].forEach((o,i)=>{const squadFit=normalised[i];fits[dim][o.key]={rawSupport:raw[dim][o.key],squadFit,optionFit:squadFit,maxSquadFit:Math.abs(squadFit-mx)<=1e-12};});
    }
    return{approach,metrics:m,raw,fits};
  }
  const NEUTRAL_TIES={passing:'mixed',shooting:'balanced',cross:'medium',lost:'regroup',won:'buildup',pressing:'mid',backLine:'track',tackling:'balanced'};
  function near(a,b,eps=1e-9){return Math.abs(a-b)<=eps;}
  function playstyleTypes(starters){return new Set((starters||[]).map(s=>s.player?.playstyle?.type||s.player?.playstyleType||'').filter(Boolean));}
  function abilityNames(starters){const out=new Set();for(const s of starters||[]){for(const a of s.player?.specialAbilities||[])out.add(String(a));}return out;}
  function semanticTieScore(values,calc,starters,{opponentAttack='unknown'}={}){
    let score=0;const signals=[];const add=(condition,reason,points=1)=>{if(condition){score+=points;signals.push(reason);}};
    // Neutral fallback is deliberately a COMPANION policy: when the XI gives equal support, avoid an arbitrary enum-first extreme.
    for(const [dim,key] of Object.entries(NEUTRAL_TIES)){
      const rows=B.TACTICS[dim].map(o=>calc.fits[dim][o.key]?.squadFit??0),allEqual=rows.every(x=>near(x,rows[0]));
      add(allEqual&&values[dim]===key,`${dim}: neutral fallback on equal XI support`);
    }
    // Focus-passing ties need a lane-aware fallback. Equal wings should select Both Flanks, not whichever enum appears first.
    const L=calc.raw.focus.left,R=calc.raw.focus.right,C=calc.raw.focus.center;
    if(near(L,R)&&near(R,C))add(values.focus==='balanced','focus: all lanes equal -> balanced',3);
    else if(near(L,R)&&L>C)add(values.focus==='both','focus: both flanks equally strongest',3);
    // Marking is explicitly opponent-dependent in current shipped game text. Unknown context uses a neutral lower-drain fallback.
    if(opponentAttack==='fast')add(values.marking==='man','marking: game guidance says man-to-man helps vs faster attacks',3);
    else if(opponentAttack==='longDistance')add(values.marking==='zonal','marking: game guidance says zonal helps vs longer-distance attacks',3);
    else add(values.marking==='zonal','marking: opponent attack type unknown -> neutral fallback');
    // Current shipped assistant/game guidance repeatedly couples these concepts. They are tie-break signals only, not match-engine weights.
    add(values.won==='counter'&&values.passing==='long','long passing complements counter-attacking game guidance');
    add(values.won==='buildup'&&values.passing==='short','short passing complements buildup/possession guidance');
    add(['left','right','both'].includes(values.focus)&&['medium','high'].includes(values.cross),'flank focus coheres with crossing frequency');
    add(['attacking','hardAttacking'].includes(calc.approach.mentality)&&values.backLine==='offside','attacking mentality + offside trap appears together in shipped assistant guidance');
    // Playstyles/SAs influence ties only. Their existence/names are game facts; this semantic relevance is explicit companion logic.
    const ps=playstyleTypes(starters),sa=abilityNames(starters);
    add((ps.has('WINGER')||ps.has('WING_BACK'))&&['left','right','both'].includes(values.focus),'Winger/Wing Back semantic fit with flank focus');
    add((ps.has('WINGER')||ps.has('WING_BACK'))&&values.cross==='high','Winger/Wing Back semantic fit with more crosses');
    add(ps.has('TARGET_MAN')&&values.passing==='long','Target Man semantic fit with long passes');
    add(ps.has('TARGET_MAN')&&values.cross==='high','Target Man semantic fit with crosses/aerial delivery');
    add((ps.has('REGISTA')||ps.has('ENGANCHE')||ps.has('BALL_PLAYING_DC'))&&values.passing==='short','creative/build playstyle semantic fit with short combinations');
    add(ps.has('BALL_WINNER')&&values.lost==='counterPress','Ball Winner semantic fit with immediate ball recovery');
    add(sa.has('Cross Expert')&&values.cross==='high','Cross Expert semantic fit with higher crossing tendency');
    add(sa.has('Long Shots')&&values.shooting==='sight','Long Shots semantic fit with Shoot On Sight');
    add(sa.has('Playmaker')&&values.passing==='short','Playmaker semantic fit with short combination play');
    return{score,signals};
  }
  function recommend(starters,{approach='balanced',drainLimit='Medium',overrides={},opponentAttack='unknown'}={}){
    if(!starters?.length)return{error:'no-lineup'};
    const calc=optionFits(starters,approach),mentality=calc.approach.mentality,limit=DRAIN_RANK[drainLimit]??1;
    let best=null,ordinal=0,eligibleCandidates=0;
    const evaluatedCandidates=enumerate(values=>{
      const drain=calculateDrain(values,overrides);
      if(DRAIN_RANK[drain.drainClass]>limit){ordinal++;return;}
      eligibleCandidates++;
      const fitVals=SEARCH_DIMS.map(dim=>calc.fits[dim][values[dim]]),tacticFit=mean(fitVals.map(x=>x.optionFit)),maxCount=fitVals.filter(x=>x.maxSquadFit).length,semantic=semanticTieScore(values,calc,starters,{opponentAttack}),cand={values:{...values},...drain,tacticFit,maxSquadFitDimensions:maxCount,semanticTieScore:semantic.score,semanticSignals:semantic.signals,ordinal};
      const fitTie=best&&Math.abs(tacticFit-best.tacticFit)<=1e-12;
      if(!best||tacticFit>best.tacticFit+1e-12||fitTie&&(
        semantic.score>best.semanticTieScore||semantic.score===best.semanticTieScore&&(
          drain.rawScore<best.rawScore||drain.rawScore===best.rawScore&&(
            maxCount>best.maxSquadFitDimensions||maxCount===best.maxSquadFitDimensions&&ordinal<best.ordinal
          )
        )
      ))best=cand;
      ordinal++;
    },mentality);
    if(!best)return{error:'no-drain-compatible-plan',evaluatedCandidates,eligibleCandidates};
    const reasons={};
    for(const dim of SEARCH_DIMS){
      const o=option(dim,best.values[dim]),f=calc.fits[dim][o.key],effectiveContribution=resolveDrainContribution(o.drain,overrides?.[dim]?.[o.key]);
      reasons[dim]=`${o.label}: lineup support ${f.rawSupport.toFixed(1)}, squad fit ${(f.squadFit*100).toFixed(0)}%; drain contribution ${effectiveContribution}.`;
    }
    if(opponentAttack==='unknown')reasons.marking+=` Opponent attack profile is unknown; marking style is not inferred from our own XI.`;
    else reasons.marking+=` Opponent profile '${opponentAttack}' was supplied and used only as a game-guidance tie-break.`;
    reasons.mentality=`${option('mentality',mentality).label} is locked by the ${calc.approach.label} approach.`;
    return{model:MODEL_VERSION,evidence:'TOP ELEVEN TOOL CALCULATION',evidencePolicy:'Exact build-30527 drain + XI attribute fit; shipped game semantics only as deterministic tie-breaks. No claimed private match-engine weights.',approach:calc.approach.label,drainLimit,opponentAttack,metrics:calc.metrics,evaluatedCandidates,eligibleCandidates,...best,reasons};
  }
  TE.Tactics={MODEL_VERSION,DIMENSIONS,SEARCH_DIMS,calculateDrain,resolveDrainContribution,enumerate,drainChecksums,lineupMetrics,rawSupports,optionFits,semanticTieScore,recommend,option};
})();
