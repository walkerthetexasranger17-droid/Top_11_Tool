(() => {
  const TE=window.TE5=window.TE5||{};const D=TE.Data,B=TE.BibleData;
  if(!D||!B)throw new Error('data.js and bible-data.js must load before formation.js');
  // Build 30527 role/rectangle evidence stays authoritative for legality and scoring.
  // These extra shapes are current community candidates (2026) only; the app still
  // chooses by the user's actual squad role means/floors rather than declaring a
  // universal meta formation.
  const COMMUNITY_FORMATIONS=[
    {id:'4141',name:'4-1-4-1',slots:['GK','DL','DC','DC','DR','DMC','ML','MC','MC','MR','ST'],source:'community-2026'},
    {id:'31411',name:'3-1-4-1-1',slots:['GK','DC','DC','DC','DMC','ML','MC','MC','MR','AMC','ST'],source:'community-2026'},
    {id:'31213',name:'3-1-2-1-3',slots:['GK','DC','DC','DC','DMC','MC','MC','AMC','AML','ST','AMR'],source:'community-2026'}
  ];
  const MODEL_VERSION='30527-role-v2',FORMATION_SOURCE=[...B.FORMATION_TEMPLATES,...COMMUNITY_FORMATIONS],FORMATIONS=FORMATION_SOURCE.map((f,i)=>({...f,templateOrder:i}));
  function options(slot){return String(slot).split('|').map(D.normaliseRole).filter(Boolean);}
  function naturalRoles(p){return Array.isArray(p?.roles)?p.roles.map(D.normaliseRole).filter(Boolean):[D.normaliseRole(p?.position)].filter(Boolean);}
  function relatedRoles(p){return Array.isArray(p?.relatedRoles)?p.relatedRoles.map(D.normaliseRole).filter(Boolean):[];}
  function suitability(p,role){if(naturalRoles(p).includes(role))return'NATURAL';if(relatedRoles(p).includes(role))return'RELATED';return'WRONG';}
  function mean(vals){return vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:null;}
  function roleStats(player,role){const keys=D.POSITION_WHITE[role]||[],values=keys.map(k=>Number(player?.skills?.[k]));if(!keys.length||values.some(v=>!Number.isFinite(v)))return null;const roleMean=mean(values),low=[...values].sort((a,b)=>a-b).slice(0,3),roleFloor=mean(low),ps=D.playstyleDefinition(player?.playstyle),playstyleFit=ps&&ps.roles?.includes(role)?1:0,playstyleLevel=Number(player?.playstyle?.level)||0;return{roleMean,roleFloor,playstyleFit,playstyleLevel,keys,weakest:keys.map((k,i)=>({attribute:k,value:values[i]})).sort((a,b)=>a.value-b.value||a.attribute.localeCompare(b.attribute)).slice(0,3)};}
  function candidate(player,role){const suit=suitability(player,role);if(suit==='WRONG')return null;const stats=roleStats(player,role);if(!stats)return null;return{player,assignedRole:role,suitability:suit,naturalFlag:suit==='NATURAL'?1:0,...stats};}
  function compareCandidateTie(a,b){const eps=1e-9;if(Math.abs(a.roleMean-b.roleMean)>eps)return a.roleMean>b.roleMean?1:-1;if(a.naturalFlag!==b.naturalFlag)return a.naturalFlag>b.naturalFlag?1:-1;if(Math.abs(a.roleFloor-b.roleFloor)>eps)return a.roleFloor>b.roleFloor?1:-1;if(a.playstyleFit!==b.playstyleFit)return a.playstyleFit>b.playstyleFit?1:-1;if(a.playstyleLevel!==b.playstyleLevel)return a.playstyleLevel>b.playstyleLevel?1:-1;return String(b.player?.key||b.player?.name||'').localeCompare(String(a.player?.key||a.player?.name||''));}
  function compareTuple(a,b){const eps=1e-9;if(Math.abs(a.sumMean-b.sumMean)>eps)return a.sumMean>b.sumMean?1:-1;if(a.natural!==b.natural)return a.natural>b.natural?1:-1;if(Math.abs(a.sumFloor-b.sumFloor)>eps)return a.sumFloor>b.sumFloor?1:-1;if(a.playstyleFits!==b.playstyleFits)return a.playstyleFits>b.playstyleFits?1:-1;for(let i=0;i<Math.min(a.assignments.length,b.assignments.length);i++){const c=compareCandidateTie(a.assignments[i],b.assignments[i]);if(c)return c;}return b.stable.localeCompare(a.stable);}
  function addState(s,c,index){return{mask:s.mask|(1n<<BigInt(index)),assignments:[...s.assignments,c],sumMean:s.sumMean+c.roleMean,natural:s.natural+c.naturalFlag,sumFloor:s.sumFloor+c.roleFloor,playstyleFits:s.playstyleFits+c.playstyleFit,stable:s.stable+'|'+String(c.player.key||c.player.name||index)};}
  function assign(players,formation){
    if(players.length>40)return{error:'Squad too large for local optimiser'};let states=new Map([[0n,{mask:0n,assignments:[],sumMean:0,natural:0,sumFloor:0,playstyleFits:0,stable:''}]]);
    for(const slot of formation.slots){const next=new Map();for(const s of states.values()){for(let i=0;i<players.length;i++){if(s.mask&(1n<<BigInt(i)))continue;for(const role of options(slot)){const c=candidate(players[i],role);if(!c)continue;const ns=addState(s,c,i),old=next.get(ns.mask);if(!old||compareTuple(ns,old)>0)next.set(ns.mask,ns);}}}states=next;if(!states.size)return{error:`No legal assignment for ${slot}`,formation};}
    let best=null;for(const s of states.values())if(!best||compareTuple(s,best)>0)best=s;const used=new Set(best.assignments.map(a=>a.player.key||a.player)),remaining=players.filter(p=>!used.has(p.key||p));return{formation,chosen:applyCoordinates(best.assignments),remaining,exact:best.natural,total:best.sumMean,sumMean:best.sumMean,sumFloor:best.sumFloor,playstyleFits:best.playstyleFits,tuple:best};
  }
  function applyCoordinates(assignments){
    const groups={};assignments.forEach((a,i)=>(groups[a.assignedRole]??=[]).push({a,i}));
    const out=new Array(assignments.length);
    for(const [role,items] of Object.entries(groups)){
      const r=B.ROLE_RECTS[role];
      const rawX=r.minX+(r.maxX-r.minX)/2;
      items.forEach(({a,i},j)=>{
        const rawY=r.minY+(j+1)*(r.maxY-r.minY)/(items.length+1);
        // Bible §4.4: round only at the final storage/render boundary and keep the
        // coordinate inside the half-open confirmed role rectangle.
        const x=Math.max(r.minX,Math.min(r.maxX-1,Math.round(rawX)));
        const y=Math.max(r.minY,Math.min(r.maxY-1,Math.round(rawY)));
        out[i]={...a,x,y,xy:[y/10,(1-x/1000)*100]};
      });
    }
    return out;
  }
  function compareFormation(a,b){if(a.error&&!b.error)return 1;if(b.error&&!a.error)return-1;if(a.error&&b.error)return a.formation.templateOrder-b.formation.templateOrder;const eps=1e-9;if(Math.abs(a.sumMean-b.sumMean)>eps)return b.sumMean-a.sumMean;if(a.exact!==b.exact)return b.exact-a.exact;if(Math.abs(a.sumFloor-b.sumFloor)>eps)return b.sumFloor-a.sumFloor;if(a.playstyleFits!==b.playstyleFits)return b.playstyleFits-a.playstyleFits;return a.formation.templateOrder-b.formation.templateOrder;}
  function choose(players,{templateId=null}={}){if(players.length<11)return{error:`You need at least 11 players. You currently have ${players.length}.`};const forms=templateId?FORMATIONS.filter(f=>f.id===templateId):FORMATIONS;const ranked=forms.map(f=>assign(players,f)).sort(compareFormation);return ranked.find(x=>!x.error)||ranked[0];}
  function roleMean(player,role){return roleStats(player,role)?.roleMean??null;}
  TE.Formation={MODEL_VERSION,FORMATIONS,COMMUNITY_FORMATIONS,options,suitability,roleStats,roleMean,candidate,assign,choose,applyCoordinates,compareFormation};
})();
