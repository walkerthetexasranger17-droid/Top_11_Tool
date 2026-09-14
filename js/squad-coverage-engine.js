(() => {
  const TE=window.TE5=window.TE5||{};const D=TE.Data,STRAT=TE.Strategy;
  if(!D||!STRAT)throw new Error('data.js and strategy-logic.js must load before squad-coverage-engine.js');
  const MODEL_VERSION='squad-coverage-v1';
  // FLEXIBILITY BLUEPRINT (COMPANION LOGIC), not a claimed Nordeus roster formula.
  // Multi-role players can satisfy several targets simultaneously.
  const TARGETS={GK:1,DL:1,DC:3,DR:1,DMC:1,ML:1,MC:2,MR:1,AML:1,AMC:1,AMR:1,ST:2};
  const IMPORTANCE={GK:1,DL:1,DC:1.3,DR:1,DMC:1.4,ML:.8,MC:1.3,MR:.8,AML:1,AMC:1.2,AMR:1,ST:1.2};
  const DUAL_PROFILES=[['DL','DC'],['DC','DR'],['DC','DMC'],['DMC','MC'],['ML','AML'],['MC','AMC'],['MR','AMR'],['AMC','ST']];
  function naturalRoles(p){const raw=Array.isArray(p?.roles)?p.roles:[p?.position];return[...new Set(raw.map(D.normaliseRole).filter(Boolean))];}
  function relatedRoles(p){return[...new Set((p?.relatedRoles||[]).map(D.normaliseRole).filter(Boolean))];}
  function roleQuality(p,role){const keys=D.POSITION_WHITE[role]||[],vals=keys.map(a=>Number(p?.skills?.[a])).filter(Number.isFinite);return vals.length===keys.length&&vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:null;}
  function analyse(players=[]){
    const rows=[];let weightedHave=0,weightedNeed=0;
    for(const role of D.ALL_POSITIONS){
      const natural=players.filter(p=>naturalRoles(p).includes(role)),related=players.filter(p=>!naturalRoles(p).includes(role)&&relatedRoles(p).includes(role)),target=TARGETS[role]||1,importance=IMPORTANCE[role]||1;
      const qualities=natural.map(p=>({playerKey:p.key,name:p.name||p.key,quality:roleQuality(p,role)})).filter(x=>Number.isFinite(x.quality)).sort((a,b)=>b.quality-a.quality),covered=Math.min(target,natural.length);
      weightedHave+=covered*importance;weightedNeed+=target*importance;
      rows.push({role,target,naturalCount:natural.length,relatedCount:related.length,deficit:Math.max(0,target-natural.length),status:natural.length>=target?'covered':natural.length?'shallow':'missing',bestQuality:qualities[0]?.quality??null,players:qualities});
    }
    const roleMap=Object.fromEntries(rows.map(r=>[r.role,r])),suggestedProfiles=[];
    for(const pair of DUAL_PROFILES){const deficit=pair.reduce((s,r)=>s+(roleMap[r]?.deficit||0),0);if(!deficit)continue;suggestedProfiles.push({roles:pair,label:pair.join('/'),priority:deficit+pair.reduce((s,r)=>s+(IMPORTANCE[r]||1),0)/pair.length,reasons:pair.filter(r=>roleMap[r]?.deficit).map(r=>`${r} needs ${roleMap[r].deficit} more natural cover`)});}
    suggestedProfiles.sort((a,b)=>b.priority-a.priority||a.label.localeCompare(b.label));
    const recruitmentPriorities=rows.filter(r=>r.deficit>0).map(r=>({...r,priority:(r.deficit*(IMPORTANCE[r]||1))})).sort((a,b)=>b.priority-a.priority||a.role.localeCompare(b.role));
    return{model:MODEL_VERSION,evidence:'TOP ELEVEN TOOL CALCULATION',coveragePercent:weightedNeed?weightedHave/weightedNeed*100:100,targets:{...TARGETS},roles:rows,recruitmentPriorities,suggestedProfiles};
  }
  TE.SquadCoverage={MODEL_VERSION,TARGETS,IMPORTANCE,DUAL_PROFILES,analyse,naturalRoles,relatedRoles,roleQuality};
})();
