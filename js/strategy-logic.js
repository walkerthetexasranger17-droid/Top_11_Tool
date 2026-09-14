(() => {
  const TE=window.TE5=window.TE5||{};const D=TE.Data;
  if(!D)throw new Error('data.js must load before strategy-logic.js');
  const MODEL_VERSION='companion-strategy-v1';
  const EVIDENCE='TOP ELEVEN TOOL CALCULATION';
  const TIER_WEIGHT={S:1.60,A:1.35,B:1.15,C:1.00};

  // COMPANION LOGIC. These tiers rank already-verified white skills; they are not
  // claimed Nordeus match-engine coefficients. Playstyle layers may name an
  // attribute that is grey for a single role; it is ignored unless another
  // natural role makes that attribute white for this player.
  const ROLE_TIERS={
    GK:{S:['Reflexes','Agility','Anticipation','Concentration'],A:['Rushing Out','Communication','Aerial Reach'],B:['Throwing','Kicking','Punching','Fitness']},
    DL:{S:['Tackling','Marking','Positioning','Speed'],A:['Crossing','Fitness','Bravery'],B:['Aggression']},
    DC:{S:['Tackling','Marking','Positioning','Heading'],A:['Strength','Bravery','Fitness'],B:['Aggression']},
    DR:{S:['Tackling','Marking','Positioning','Speed'],A:['Crossing','Fitness','Bravery'],B:['Aggression']},
    DMC:{S:['Tackling','Marking','Positioning','Passing'],A:['Bravery','Strength','Creativity'],B:['Heading','Fitness','Aggression']},
    ML:{S:['Passing','Dribbling','Crossing','Speed'],A:['Positioning','Creativity','Fitness']},
    MC:{S:['Passing','Positioning','Creativity','Fitness'],A:['Dribbling','Tackling','Marking','Speed'],B:['Shooting','Bravery']},
    MR:{S:['Passing','Dribbling','Crossing','Speed'],A:['Positioning','Creativity','Fitness']},
    AML:{S:['Dribbling','Speed','Passing'],A:['Crossing','Shooting','Finishing','Creativity'],B:['Fitness']},
    AMC:{S:['Passing','Dribbling','Creativity'],A:['Shooting','Finishing','Speed'],B:['Heading','Fitness']},
    AMR:{S:['Dribbling','Speed','Passing'],A:['Crossing','Shooting','Finishing','Creativity'],B:['Fitness']},
    ST:{S:['Shooting','Finishing','Positioning'],A:['Speed','Dribbling'],B:['Heading','Strength','Creativity','Passing']}
  };

  const PLAYSTYLE_TIERS={
    'Poacher':{S:['Shooting','Finishing','Positioning','Speed'],A:['Dribbling','Creativity'],B:['Passing','Heading','Strength']},
    'False Nine':{S:['Dribbling','Passing','Creativity'],A:['Positioning','Speed','Shooting','Finishing'],B:['Heading','Strength']},
    'Target Man':{S:['Heading','Strength','Positioning','Finishing'],A:['Shooting','Passing'],B:['Creativity','Dribbling','Speed']},
    'Enganche':{S:['Passing','Creativity','Dribbling'],A:['Shooting','Finishing','Positioning'],B:['Speed','Fitness']},
    'Inside Forward':{S:['Dribbling','Shooting','Finishing','Speed'],A:['Passing','Creativity','Positioning'],B:['Crossing','Fitness']},
    'Winger':{S:['Crossing','Speed','Dribbling','Passing'],A:['Creativity','Positioning','Fitness'],B:['Shooting','Finishing']},
    'False Winger':{S:['Passing','Creativity','Dribbling','Positioning'],A:['Speed','Crossing','Fitness'],B:['Shooting']},
    'Mezzala':{S:['Passing','Dribbling','Creativity','Speed'],A:['Positioning','Shooting','Fitness'],B:['Tackling','Marking']},
    'Box-to-Box':{S:['Fitness','Positioning','Passing','Speed'],A:['Tackling','Marking','Dribbling','Shooting'],B:['Bravery','Creativity']},
    'Regista':{S:['Passing','Creativity','Positioning'],A:['Dribbling','Fitness','Marking'],B:['Tackling','Strength','Bravery']},
    'Ball Winner':{S:['Tackling','Marking','Bravery','Aggression','Positioning'],A:['Fitness','Strength'],B:['Passing','Heading','Creativity']},
    'Anchor Man':{S:['Positioning','Marking','Tackling','Strength'],A:['Heading','Bravery','Fitness'],B:['Passing','Aggression','Creativity']},
    'No-Nonsense DC':{S:['Tackling','Marking','Heading','Strength','Bravery'],A:['Positioning','Fitness'],B:['Aggression']},
    'Stopper':{S:['Tackling','Marking','Bravery','Aggression','Strength'],A:['Positioning','Heading','Fitness']},
    'Ball Playing DC':{S:['Passing','Positioning','Marking'],A:['Tackling','Strength','Heading'],B:['Bravery','Fitness','Aggression']},
    'Full Back':{S:['Marking','Tackling','Positioning','Speed'],A:['Crossing','Fitness','Bravery'],B:['Aggression']},
    'Wing Back':{S:['Crossing','Speed','Fitness','Positioning'],A:['Tackling','Marking','Dribbling'],B:['Bravery','Aggression']},
    'Sweeper Keeper':{S:['Rushing Out','Anticipation','Kicking','Agility'],A:['Reflexes','Concentration','Communication'],B:['Aerial Reach','Throwing','Punching','Fitness']},
    'Box Commander':{S:['Aerial Reach','Communication','Punching','Concentration'],A:['Reflexes','Anticipation','Agility'],B:['Rushing Out','Throwing','Kicking','Fitness']}
  };

  const TACTIC_ATTRIBUTE_BIASES={
    short:['Passing','Creativity','Dribbling'],long:['Passing','Heading','Strength','Positioning'],counter:['Speed','Passing','Dribbling','Finishing','Positioning'],
    flank:['Crossing','Speed','Dribbling','Heading'],center:['Passing','Creativity','Dribbling','Shooting','Finishing'],highPress:['Fitness','Aggression','Tackling','Bravery','Speed'],
    lowBlock:['Tackling','Marking','Positioning','Strength','Heading'],highCross:['Crossing','Heading','Strength','Positioning'],buildup:['Passing','Creativity','Dribbling','Positioning']
  };

  function tierFor(map,attr){for(const tier of ['S','A','B'])if((map?.[tier]||[]).includes(attr))return tier;return'C';}
  function normaliseRoles(player,roles){const raw=Array.isArray(roles)?roles:(Array.isArray(player?.roles)?player.roles:[player?.position]);return[...new Set(raw.map(D.normaliseRole).filter(Boolean))];}
  function playstyleName(player){const p=D.playstyleDefinition(player?.playstyle||player?.playstyleType);return p?.name&&p.name!=='No Playstyle'?p.name:null;}
  function tacticBiases(tactics){const v=tactics?.values||tactics||{},out=[];if(v.passing==='short')out.push('short');if(v.passing==='long')out.push('long');if(v.won==='counter')out.push('counter');if(['left','right','both'].includes(v.focus))out.push('flank');if(v.focus==='center')out.push('center');if(v.pressing==='high')out.push('highPress');if(v.pressing==='low')out.push('lowBlock');if(v.cross==='high')out.push('highCross');if(v.won==='buildup')out.push('buildup');return out;}
  function trainingPriorityProfile(player,{roles=null,tactics=null}={}){
    const resolved=normaliseRoles(player,roles),white=D.whiteSkillsForRoles(resolved),ps=playstyleName(player),psMap=PLAYSTYLE_TIERS[ps]||null,biases=tacticBiases(tactics),rows=[];
    for(const attr of white){
      let baseTier='C',baseWeight=TIER_WEIGHT.C;
      for(const role of resolved){const t=tierFor(ROLE_TIERS[role],attr),w=TIER_WEIGHT[t];if(w>baseWeight){baseWeight=w;baseTier=t;}}
      const psTier=tierFor(psMap,attr),psWeight=psMap?TIER_WEIGHT[psTier]:1;
      const rolePlaystyleWeight=Math.max(baseWeight,psMap?psWeight:1);
      let tacticMultiplier=1;const tacticSignals=[];
      for(const key of biases){if(TACTIC_ATTRIBUTE_BIASES[key].includes(attr)){tacticMultiplier+=0.08;tacticSignals.push(key);}}
      const weight=rolePlaystyleWeight*tacticMultiplier;
      rows.push({attribute:attr,baseTier,playstyleTier:psMap?psTier:null,weight,tacticMultiplier,tacticSignals});
    }
    rows.sort((a,b)=>b.weight-a.weight||a.attribute.localeCompare(b.attribute));
    return{model:MODEL_VERSION,evidence:EVIDENCE,roles:resolved,playstyle:ps,whiteAttributes:white,priorities:rows};
  }

  function roleCountsFromSlots(slots=[]){const counts=Object.fromEntries(D.ALL_POSITIONS.map(r=>[r,0]));for(const raw of slots){const opts=String(raw).split('|').map(D.normaliseRole).filter(Boolean);for(const r of opts)counts[r]++;}return counts;}
  function analyseShape(slots=[]){
    const counts=roleCountsFromSlots(slots),centralMid=(counts.DMC||0)+(counts.MC||0)+(counts.AMC||0),wideMid=(counts.ML||0)+(counts.MR||0)+(counts.AML||0)+(counts.AMR||0),wideAttack=(counts.AML||0)+(counts.AMR||0),wideDef=(counts.DL||0)+(counts.DR||0),centralDef=counts.DC||0;
    return{counts,centralMid,wideMid,wideAttack,wideDef,centralDef,strikers:counts.ST||0,hasDMC:(counts.DMC||0)>0,hasAMC:(counts.AMC||0)>0,hasLeftDef:(counts.DL||0)>0,hasRightDef:(counts.DR||0)>0,hasLeftAttack:(counts.AML||0)+(counts.ML||0)>0,hasRightAttack:(counts.AMR||0)+(counts.MR||0)>0,narrow:wideMid===0,centralHeavy:centralMid>=3};
  }
  function startersShape(starters=[]){return analyseShape(starters.map(s=>s.assignedRole));}

  function scoreFormationStructure(starters=[],opponentSlots=null){
    const own=startersShape(starters),opp=opponentSlots?.length?analyseShape(opponentSlots):null;let score=0;const reasons=[];const add=(pts,reason)=>{score+=pts;reasons.push({points:pts,reason});};
    // General resilience: current research repeatedly favours central protection and two-sided coverage.
    add(own.hasDMC?3:-2,own.hasDMC?'Natural DMC screen available':'No DMC screen in this shape');
    add(own.centralDef>=2?2:-4,own.centralDef>=2?'At least two central defenders':'Insufficient central-defender coverage');
    add(own.hasLeftDef&&own.hasRightDef?2:0,own.hasLeftDef&&own.hasRightDef?'Both defensive flanks covered':'');
    add(own.centralMid>=3?2:own.centralMid>=2?1:-2,`Central midfield presence ${own.centralMid}`);
    add(own.hasLeftAttack&&own.hasRightAttack?2:0,own.hasLeftAttack&&own.hasRightAttack?'Attacking width available on both sides':'');
    if(!opp)return{score,reasons:reasons.filter(x=>x.reason),own,opponent:null};
    if(opp.hasAMC)add(own.hasDMC?4:-5,own.hasDMC?'DMC directly protects against opponent AMC':'Opponent AMC is unshielded by a DMC');
    if(opp.hasLeftAttack)add(own.hasRightDef?3:-4,own.hasRightDef?'Right defensive lane covers opponent left attack':'Opponent left attack lacks direct wide-defender cover');
    if(opp.hasRightAttack)add(own.hasLeftDef?3:-4,own.hasLeftDef?'Left defensive lane covers opponent right attack':'Opponent right attack lacks direct wide-defender cover');
    if(opp.centralHeavy)add(own.centralMid>=opp.centralMid-1?3:-3,own.centralMid>=opp.centralMid-1?'Enough central presence to contest midfield':'Likely central midfield numerical deficit');
    if(!opp.hasDMC&&own.hasAMC)add(3,'AMC can attack the space in front of opponent centre-backs');
    if(opp.narrow&&own.hasLeftAttack&&own.hasRightAttack)add(3,'Two-sided width can exploit a narrow opponent');
    if(!opp.hasLeftDef&&own.hasRightAttack)add(2,'Right attack targets opponent side without a natural DL');
    if(!opp.hasRightDef&&own.hasLeftAttack)add(2,'Left attack targets opponent side without a natural DR');
    if(opp.strikers>=2)add(own.centralDef>=3||own.hasDMC?2:-2,'Extra central protection against multiple strikers');
    return{score,reasons:reasons.filter(x=>x.reason),own,opponent:opp};
  }

  function scoreTacticContext(values,starters=[],context={}){
    const own=startersShape(starters),opp=context.opponentSlots?.length?analyseShape(context.opponentSlots):null,relative=Number(context.relativeStrength||0);let score=0;const reasons=[];const add=(cond,pts,reason)=>{if(cond){score+=pts;reasons.push({points:pts,reason});}};
    const ps=new Set(starters.map(s=>playstyleName(s.player)).filter(Boolean));
    add(opp&&!opp.hasDMC&&own.hasAMC&&values.focus==='center',3,'Opponent has no DMC and our AMC can attack centrally');
    add(opp?.narrow&&own.hasLeftAttack&&own.hasRightAttack&&values.focus==='both',3,'Opponent is narrow; both flanks exploit available width');
    add(opp&&!opp.hasRightDef&&own.hasLeftAttack&&values.focus==='left',2,'Opponent lacks a natural DR; left-flank attack targets that side');
    add(opp&&!opp.hasLeftDef&&own.hasRightAttack&&values.focus==='right',2,'Opponent lacks a natural DL; right-flank attack targets that side');
    add(ps.has('Target Man')&&values.passing==='long',2,'Target Man supports direct/aerial distribution');
    add(ps.has('Target Man')&&values.cross==='high',3,'Target Man supports high-cross/aerial service');
    add(ps.has('Winger')&&['medium','high'].includes(values.cross),2,'Winger supports regular crossing');
    add(ps.has('False Nine')&&values.passing==='short',2,'False Nine supports short combination play');
    add((ps.has('Enganche')||ps.has('Regista'))&&values.passing==='short',2,'Creative passing Playstyle supports short buildup');
    add(relative<=-5&&values.won==='counter',3,'Weaker-side context favours transition opportunities');
    add(relative<=-5&&['defending','hardDefending'].includes(values.mentality),2,'Weaker-side context rewards defensive control');
    add(relative>=5&&['attacking','normal'].includes(values.mentality),2,'Stronger-side context supports territorial initiative');
    add(relative>=5&&values.won==='buildup',1,'Stronger-side context supports controlled buildup');
    add(values.pressing==='low'&&values.lost==='regroup',2,'Low block coheres with regrouping');
    add(values.pressing==='high'&&values.lost==='counterPress',2,'High press coheres with counter-pressing');
    add(values.pressing==='high'&&values.backLine==='offside',1,'High defensive pressure coheres with an offside line');
    add(values.pressing==='low'&&values.backLine==='offside',-4,'Low block and offside trap are structurally contradictory');
    add(values.won==='counter'&&values.passing==='long',1,'Direct passing coheres with counterattacking');
    add(values.won==='buildup'&&values.passing==='short',1,'Short passing coheres with buildup');
    add((!!opp||ps.has('Winger')||ps.has('Target Man'))&&['left','right','both'].includes(values.focus)&&['medium','high'].includes(values.cross),1,'Flank focus coheres with crossing');
    add(values.tackling==='balanced',0.5,'Balanced tackling is the neutral community default');
    return{score,reasons,own,opponent:opp,relativeStrength:relative};
  }

  TE.Strategy={MODEL_VERSION,EVIDENCE,TIER_WEIGHT,ROLE_TIERS,PLAYSTYLE_TIERS,TACTIC_ATTRIBUTE_BIASES,trainingPriorityProfile,analyseShape,startersShape,scoreFormationStructure,scoreTacticContext,playstyleName};
})();
