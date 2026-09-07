(() => {
  const TE=window.TE5=window.TE5||{};
  const D=TE.Data;
  if(!D)throw new Error('data.js must load first');
  const MENTORS=[
    {name:'Alan Shearer',title:'The Finisher',style:'attack',asset:'alan-shearer.png'},
    {name:'Claude Makélélé',title:'The Enforcer',style:'defence',asset:'claude-makelele.png'},
    {name:'Nemanja Vidić',title:'The Iron Guard',style:'defence',asset:'nemanja-vidic.png'},
    {name:'Cesc Fàbregas',title:'The Architect',style:'control',asset:'cesc-fabregas.png'},
    {name:'Lewis Green',title:'The Wing Commander',style:'width',asset:'lewis-green.png'},
    {name:'Jonas Brown',title:'The Analyst',style:'adaptive',asset:'jonas-brown.png'},
    {name:'Rubén Herrera',title:'The Saboteur',style:'structure',asset:'ruben-herrera.png'}
  ];
  const abilities=p=>Array.isArray(p?.specialAbilities)?p.specialAbilities:(p?.specialAbility?[p.specialAbility]:[]);
  const val=(p,s)=>Number(p?.skills?.[s]||0);
  const avg=(p,names)=>{const a=names.map(n=>val(p,n)).filter(n=>n>0);return a.length?a.reduce((x,y)=>x+y,0)/a.length:0;};
  function scorePenalty(p){return val(p,'Finishing')*.62+val(p,'Shooting')*.20+val(p,'Creativity')*.08+Number(p.ovr||0)*.10+(abilities(p).includes('Penalty Kick Specialist')?20:0);}
  function scoreCorner(p){return val(p,'Crossing')*.62+val(p,'Passing')*.20+val(p,'Creativity')*.10+Number(p.ovr||0)*.08+(abilities(p).includes('Corner Specialist')?20:0);}
  function scoreFreeKick(p){return val(p,'Shooting')*.62+val(p,'Finishing')*.14+val(p,'Passing')*.14+val(p,'Creativity')*.06+Number(p.ovr||0)*.04+(abilities(p).includes('Free Kick Specialist')?20:0);}
  function scoreCaptain(p){const age=Number(p.age||0),experience=Math.min(24,Math.max(0,age-19)*1.15),broad=avg(p,['Tackling','Marking','Positioning','Passing','Creativity','Shooting','Finishing','Bravery','Fitness']);return Number(p.ovr||0)*.58+broad*.30+experience*.12;}
  function rankPlaymakers(players){
    // Do not arbitrarily exclude keepers; if a GK genuinely has the best relevant
    // attributes or specialist ability, the recommendation engine can surface them.
    const rank=fn=>players.map(p=>({player:p,score:fn(p)})).sort((a,b)=>b.score-a.score);
    return {penalties:rank(scorePenalty).slice(0,5),corner:rank(scoreCorner)[0]||null,freeKick:rank(scoreFreeKick)[0]||null,captain:rank(scoreCaptain)[0]||null};
  }
  function roles(p){return Array.isArray(p.roles)&&p.roles.length?p.roles:[p.position].filter(Boolean);}
  function metric(players,names,filter=()=>true){const vals=players.filter(filter).map(p=>avg(p,names)).filter(v=>v>0);return vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0;}
  function squadMetrics(players){
    const roleCounts={};players.forEach(p=>roles(p).forEach(r=>roleCounts[r]=(roleCounts[r]||0)+1));
    const wide=p=>roles(p).some(r=>['DL','DR','DML','DMR','ML','MR','AML','AMR'].includes(r));
    return {roleCounts,def:metric(players,['Tackling','Marking','Positioning','Bravery','Heading']),mid:metric(players,['Passing','Creativity','Dribbling','Positioning']),attack:metric(players,['Shooting','Finishing','Dribbling','Creativity']),cross:metric(players,['Crossing'],wide),ovr:players.length?players.reduce((s,p)=>s+Number(p.ovr||0),0)/players.length:0};
  }
  function mentorScore(mode,m,mentor){const base={defending:{defence:100,structure:94,adaptive:82,control:68,width:55,attack:48},balanced:{control:100,adaptive:94,defence:86,structure:82,width:80,attack:76},attacking:{attack:100,width:96,control:90,adaptive:84,defence:66,structure:62}};let s=base[mode]?.[mentor.style]||60;if(mentor.name==='Lewis Green')s+=m.cross/20;if(mentor.name==='Alan Shearer')s+=m.attack/20;if(mentor.name==='Cesc Fàbregas')s+=m.mid/20;if(mentor.name==='Claude Makélélé')s+=(m.def+m.mid)/45;if(mentor.name==='Nemanja Vidić')s+=m.def/18;if(mentor.name==='Rubén Herrera')s+=m.def/20;if(mentor.name==='Jonas Brown')s+=(m.def+m.mid+m.attack)/70;return s;}
  function recommendTactics(players,mode='balanced'){
    const m=squadMetrics(players),has=r=>m.roleCounts[r]||0;const mentor=[...MENTORS].map(x=>({...x,score:mentorScore(mode,m,x)})).sort((a,b)=>b.score-a.score)[0];
    const plans={
      defending:{shoot:'Balanced',pass:'Mixed',focus:'Balanced',cross:'Medium',lost:'Regroup',won:'Focus on Buildup',mentality:'Defending',mark:'Zonal',press:'Mid Press',back:'Balanced',tackle:'Stay on Feet'},
      balanced:{shoot:'Balanced',pass:'Mixed',focus:'Balanced',cross:'Medium',lost:'Counter Press',won:'Focus on Buildup',mentality:'Normal',mark:'Zonal',press:'Mid Press',back:'Balanced',tackle:'Balanced'},
      attacking:{shoot:'Work it into the Box',pass:'Short',focus:has('AML')+has('AMR')+has('ML')+has('MR')>=2?'Both Flanks':'Through the Middle',cross:m.cross>=110?'High':'Medium',lost:'Counter Press',won:'Counter Attack',mentality:'Attacking',mark:'Zonal',press:'High Press',back:'Set Offside Trap',tackle:'Aggressive'}
    };
    return {...plans[mode],mode,mentor,metrics:m,kind:'app-recommendation'};
  }
  TE.Recommendations={MENTORS,scorePenalty,scoreCorner,scoreFreeKick,scoreCaptain,rankPlaymakers,squadMetrics,recommendTactics};
})();
