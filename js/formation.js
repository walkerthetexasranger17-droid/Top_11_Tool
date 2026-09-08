(() => {
  const TE=window.TE5=window.TE5||{};const D=TE.Data;
  if(!D)throw new Error('data.js must load before formation.js');
  const FORMATIONS=[
    {name:'4-4-2',slots:['GK','DL','DC','DC','DR','ML','MC','MC','MR','ST','ST'],layout:[[50,91],[13,73],[37,78],[63,78],[87,73],[12,51],[38,55],[62,55],[88,51],[39,19],[61,19]]},
    {name:'4-3-3',slots:['GK','DL','DC','DC','DR','MC','MC','MC','AML','ST','AMR'],layout:[[50,91],[13,73],[37,78],[63,78],[87,73],[24,53],[50,58],[76,53],[17,28],[50,15],[83,28]]},
    {name:'4-2-3-1',slots:['GK','DL','DC','DC','DR','DMC/MC','DMC/MC','AML','AMC','AMR','ST'],layout:[[50,91],[13,73],[37,78],[63,78],[87,73],[35,61],[65,61],[16,35],[50,32],[84,35],[50,13]]},
    {name:'3-5-2',slots:['GK','DC','DC','DC','ML','MC','MC','MC','MR','ST','ST'],layout:[[50,91],[25,78],[50,81],[75,78],[10,52],[32,56],[50,60],[68,56],[90,52],[40,18],[60,18]]},
    {name:'4-1-2-1-2',slots:['GK','DL','DC','DC','DR','DMC','MC','MC','AMC','ST','ST'],layout:[[50,91],[13,73],[37,78],[63,78],[87,73],[50,64],[34,52],[66,52],[50,31],[40,15],[60,15]]}
  ];
  const ADJ={GK:[],DL:['DR','DML'],DR:['DL','DMR'],DC:['DMC','DL','DR'],DML:['DL','DMC','ML'],DMR:['DR','DMC','MR'],DMC:['MC','DC','DML','DMR'],ML:['MR','MC','DML','AML'],MR:['ML','MC','DMR','AMR'],MC:['DMC','ML','MR','AMC'],AML:['AMR','ML','AMC'],AMR:['AML','MR','AMC'],AMC:['MC','AML','AMR','ST'],ST:['AMC','AMR','AML']};
  function options(slot){return String(slot).split('/').map(D.normaliseRole).filter(Boolean);}
  function roles(player){const raw=Array.isArray(player?.roles)?player.roles:[player?.position];const out=[];for(const r of raw){const n=D.normaliseRole(r);if(n&&!out.includes(n))out.push(n);}return out;}
  function positionFit(player,slot){const rr=roles(player),opts=options(slot);if(rr.some(r=>opts.includes(r)))return 1;const primary=rr[0]||'';return opts.some(o=>(ADJ[primary]||[]).includes(o))?.25:.02;}
  function slotSkill(player,slot){const keys=D.whiteSkillsForRoles(options(slot)),vals=keys.map(k=>Number(player?.skills?.[k])).filter(Number.isFinite);return vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0;}
  function playerSlotScore(player,slot){const fit=positionFit(player,slot),ovr=Number(player?.ovr)||0,skill=slotSkill(player,slot),opts=options(slot),exactPrimary=opts.includes(D.normaliseRole(player?.position));const posBonus=fit===1?(exactPrimary?220:195):fit>.2?18:-40;return posBonus+fit*(ovr*.55+skill*.35);}
  function assign(players,formation){const remaining=[...players],assignments=new Array(formation.slots.length);const order=formation.slots.map((slot,index)=>({slot,index,candidates:players.filter(p=>positionFit(p,slot)===1).length})).sort((a,b)=>a.candidates-b.candidates||a.index-b.index);for(const item of order){let bestIndex=-1,bestScore=-Infinity;remaining.forEach((p,i)=>{const s=playerSlotScore(p,item.slot);if(s>bestScore){bestScore=s;bestIndex=i;}});if(bestIndex>=0){assignments[item.index]={player:remaining[bestIndex],slot:item.slot,score:bestScore,xy:formation.layout[item.index]};remaining.splice(bestIndex,1);}}const chosen=assignments.filter(Boolean),exact=chosen.filter(x=>positionFit(x.player,x.slot)===1).length,total=chosen.reduce((a,x)=>a+x.score,0);return{formation,chosen,remaining,exact,total};}
  function choose(players){if(players.length<11)return{error:`You need at least 11 players. You currently have ${players.length}.`};const ranked=FORMATIONS.map(f=>assign(players,f)).sort((a,b)=>b.exact-a.exact||b.total-a.total);return ranked[0];}
  TE.Formation={FORMATIONS,options,positionFit,playerSlotScore,choose};
})();
