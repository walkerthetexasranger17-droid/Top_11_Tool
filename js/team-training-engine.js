(() => {
  const TE=window.TE5=window.TE5||{};const D=TE.Data;
  if(!D)throw new Error('data.js must load before team-training-engine.js');
  function settingFor(profile,d){return profile?.drills?.[d.drillId]||{unlocked:!!d.capturedUnlocked,level:Number(d.capturedLevelId||0)};}
  function effect(level){const row=(D.DRILL_LEVELS.levels||[]).find(x=>Number(x.level_id)===Number(level));return row?Number(row.training_effect_percent):0;}
  function buildTeamSession(groupKey,{normalProfile,slots=6}={}){
    const group=D.TEAM_GROUPS[groupKey];if(!group)return{drills:[],error:'invalid-group'};
    const keySet=new Set(group.positions.flatMap(p=>D.POSITION_WHITE[p]||[]));
    const candidates=D.NORMAL_DRILLS.map(d=>{const s=settingFor(normalProfile,d);if(!s.unlocked||Number(s.level)<1)return null;const applicable=d.skills.filter(a=>keySet.has(a));if(!applicable.length)return null;const strength=Number(d.xpPerPlayer)*(1+effect(s.level)/100);return {...d,level:Number(s.level),effectPct:effect(s.level),strength,keyHits:applicable,base:strength*applicable.length/Math.max(1,d.skills.length)};}).filter(Boolean);
    const selected=[],covered=new Set();for(let i=0;i<slots;i++){let best=null,bestScore=-Infinity;for(const c of candidates){const newHits=c.keyHits.filter(a=>!covered.has(a)).length;const repeats=selected.filter(x=>x.drillId===c.drillId).length;const score=c.base+newHits*2.5-repeats*.5;if(score>bestScore){best=c;bestScore=score;}}if(!best)break;selected.push({...best,slot:i+1,recommendationScore:bestScore});best.keyHits.forEach(a=>covered.add(a));}
    return{drills:selected,error:null,meta:{groupKey,title:group.title,coveredSkills:[...covered],model:'normal-drill-group-prep',apkTeamPlayModeled:false,limitations:['TeamPlayTrainingDrill is a separate protocol type and is not mixed into this normal-drill group planner.']}};
  }
  TE.TeamTraining={buildTeamSession};
})();
