(() => {
  const TE=window.TE5=window.TE5||{};
  const CURRENT_ROLES=['GK','DL','DC','DR','DMC','ML','MC','MR','AML','AMC','AMR','ST'];
  const POSITION_ORDER=Object.fromEntries(CURRENT_ROLES.map((r,i)=>[r,i+1]));
  const ROLE_RECTS={
    GK:{minX:0,maxX:143,minY:250,maxY:750},DL:{minX:179,maxX:393,minY:0,maxY:250},DC:{minX:143,maxX:286,minY:250,maxY:750},DR:{minX:179,maxX:393,minY:750,maxY:1000},
    DMC:{minX:286,maxX:429,minY:250,maxY:750},ML:{minX:393,maxX:607,minY:0,maxY:250},MC:{minX:429,maxX:572,minY:250,maxY:750},MR:{minX:393,maxX:607,minY:750,maxY:1000},
    AML:{minX:607,maxX:821,minY:0,maxY:250},AMC:{minX:572,maxX:715,minY:250,maxY:750},AMR:{minX:607,maxX:821,minY:750,maxY:1000},ST:{minX:715,maxX:858,minY:250,maxY:750}
  };
  const ROLE_IDS={GK:{football:0,communication:1},DL:{football:1,communication:2},DC:{football:2,communication:3},DR:{football:3,communication:4},DMC:{football:5,communication:5},ML:{football:7,communication:6},MC:{football:8,communication:7},MR:{football:9,communication:8},AML:{football:10,communication:9},AMC:{football:11,communication:10},AMR:{football:12,communication:11},ST:{football:13,communication:12}};
  const PLAYSTYLES=[
    {id:1,type:'NO_PLAYSTYLE',name:'No Playstyle',roles:[]},{id:2,type:'POACHER',name:'Poacher',roles:['ST']},{id:3,type:'FALSE_NINE',name:'False Nine',roles:['ST','AMC']},{id:4,type:'TARGET_MAN',name:'Target Man',roles:['ST']},{id:5,type:'ENGANCHE',name:'Enganche',roles:['AMC']},
    {id:6,type:'INSIDE_FORWARD',name:'Inside Forward',roles:['AML','AMR']},{id:7,type:'WINGER',name:'Winger',roles:['AML','AMR','ML','MR']},{id:8,type:'FALSE_WINGER',name:'False Winger',roles:['ML','MR']},{id:9,type:'MEZZALA',name:'Mezzala',roles:['MC']},{id:10,type:'BOX_TO_BOX',name:'Box-to-Box',roles:['MC']},
    {id:11,type:'REGISTA',name:'Regista',roles:['MC','DMC']},{id:12,type:'BALL_WINNER',name:'Ball Winner',roles:['DMC']},{id:13,type:'ANCHOR_MAN',name:'Anchor Man',roles:['DMC']},{id:14,type:'NO_NONSENSE_DC',name:'No-Nonsense DC',roles:['DC']},{id:15,type:'STOPPER',name:'Stopper',roles:['DC']},
    {id:16,type:'BALL_PLAYING_DC',name:'Ball Playing DC',roles:['DC']},{id:17,type:'FULL_BACK',name:'Full Back',roles:['DL','DR']},{id:18,type:'WING_BACK',name:'Wing Back',roles:['DL','DR']},{id:19,type:'BALL_PLAYING_GK',name:'Ball Playing GK',roles:[],offer:false},{id:20,type:'SWEEPER_KEEPER',name:'Sweeper Keeper',roles:['GK']},{id:21,type:'BOX_COMMANDER',name:'Box Commander',roles:['GK']}
  ];
  const PLAYSTYLE_LEVELS=[{id:0,name:'No Playstyle Level'},{id:1,name:'Locked'},{id:2,name:'Standard'},{id:3,name:'Intermediate'},{id:4,name:'Advanced'},{id:5,name:'Master'}];
  const SPECIAL_ABILITIES=[
    {id:1,name:'Penalty Kick Stopper'},{id:2,name:'One-on-One Stopper'},{id:3,name:'Aerial Defender'},{id:4,name:'Defensive Wall'},{id:5,name:'Playmaker'},{id:6,name:'One-on-One Scorer'},{id:7,name:'Long Shots'},{id:8,name:'Dribbler'},{id:9,name:'Penalty Kick Specialist'},{id:10,name:'Free Kick Specialist'},
    {id:11,name:'Corner Specialist'},{id:12,name:'Set Piece Taker'},{id:13,name:'Versatile Attacker'},{id:14,name:'Intercepting Specialist'},{id:15,name:'Set Piece Stopper'},{id:16,name:'Blocker'},{id:17,name:'Rebound Specialist'},{id:18,name:'Cross Expert'},{id:19,name:'Counter Attack Stopper'}
  ];
  const FORMATION_TEMPLATES=[
    {id:'442',name:'4-4-2',slots:['GK','DL','DC','DC','DR','ML','MC','MC','MR','ST','ST']},
    {id:'433',name:'4-3-3',slots:['GK','DL','DC','DC','DR','MC','MC','MC','AML','ST','AMR']},
    {id:'4231',name:'4-2-3-1',slots:['GK','DL','DC','DC','DR','DMC|MC','DMC|MC','AML','AMC','AMR','ST']},
    {id:'352',name:'3-5-2',slots:['GK','DC','DC','DC','ML','MC','MC','MC','MR','ST','ST']},
    {id:'41212',name:'4-1-2-1-2',slots:['GK','DL','DC','DC','DR','DMC','MC','MC','AMC','ST','ST']}
  ];
  const tactics={
    passing:[['short','Short',0,7,.50],['long','Long',1,0,.50],['mixed','Mixed',2,5,.50]],
    shooting:[['sight','Shoot On Sight',0,0,.80],['box','Work It Into The Box',1,7,.70],['balanced','Balanced',2,5,.50]],
    focus:[['left','Left Flank',0,0,.50],['right','Right Flank',1,0,.50],['both','Both Flanks',2,7,.50],['center','Center',3,0,.50],['balanced','Balanced',4,5,.50]],
    cross:[['low','Low',0,0,.35],['medium','Medium',1,0,.50],['high','High',2,0,.75]],
    lost:[['counterPress','Counter Press',0,7,.75],['regroup','Regroup',1,5,.25]],
    won:[['buildup','Focus On Buildup',0,5,.45],['counter','Force Counter Attack',1,7,.75]],
    mentality:[['hardDefending','Hard Defending',0,7,0],['defending','Defending',1,5,.25],['normal','Normal',2,0,.50],['attacking','Attacking',3,5,.75],['hardAttacking','Hard Attacking',4,7,1]],
    marking:[['man','Man-to-Man',0,7,.65],['zonal','Zonal',1,5,.40]],
    pressing:[['low','Low Block',0,0,.20],['mid','Mid Press',1,5,.50],['high','High Press',2,7,.85]],
    backLine:[['track','Track Opponent',0,5,.30],['offside','Set Offside Trap',1,0,.75]],
    tackling:[['balanced','Balanced',0,0,.50],['stay','Stay On Feet',1,7,.30],['aggressive','Aggressive',2,5,.80]]
  };
  const TACTICS=Object.fromEntries(Object.entries(tactics).map(([dim,rows])=>[dim,rows.map(([key,label,id,drain,style])=>({key,label,id,drain,style}))]));
  const APPROACHES={hardDefending:{label:'Hard Defending',index:0,mentality:'hardDefending'},defending:{label:'Defending',index:.25,mentality:'defending'},balanced:{label:'Balanced',index:.5,mentality:'normal'},attacking:{label:'Attacking',index:.75,mentality:'attacking'},hardAttacking:{label:'Hard Attacking',index:1,mentality:'hardAttacking'}};
  const MENTORS=[
    {id:'saboteur',displayName:'Rubén Herrera',title:'The Saboteur',asset:'ruben-herrera.png',level:7,xp:40,xpNext:400,tactic:{id:'tacticCounterAttackEffectiveness',current:[30],next:[30]},attribute:{id:'attributeCreativityPassing',attributes:['Creativity','Passing'],current:[20],next:[25]},signature:{id:'signatureBlindSide',current:[30],next:[35]},mapping:'LIVE-CONFIRMED'},
    {id:'wing_commander',displayName:'Lewis Green',title:'The Wing Commander',asset:'lewis-green.png',level:8,xp:230,xpNext:800,tactic:{id:'tacticWingAttacksEffectiveness',current:[30],next:[30]},attribute:{id:'attributeCrossingHeading',attributes:['Crossing','Heading'],current:[20],next:[40]},signature:{id:'signatureAerialDominance',current:[80],next:[81]},mapping:'LIVE-CONFIRMED'},
    {id:'analyst',displayName:'Jonas Brown',title:'The Analyst',asset:'jonas-brown.png',level:4,xp:40,xpNext:50,tactic:{id:'tacticLongPassEffectiveness',current:[30],next:[30]},attribute:{id:'attributeStrengthPositioning',attributes:['Strength','Positioning'],current:[5],next:[10]},signature:{id:'signatureAdaptiveBlueprint',current:[20],next:[21]},mapping:'LIVE-CONFIRMED'},
    {id:'architect',displayName:'Cesc Fàbregas',title:'The Architect',asset:'cesc-fabregas.png',level:6,xp:120,xpNext:200,tactic:{id:'tacticShortPassEffectiveness',current:[30],next:[30]},attribute:{id:'attributeDribblingShooting',attributes:['Dribbling','Shooting'],current:[10],next:[15]},signature:{id:'signatureMomentumChain',current:[15,8],next:[15,6]},mapping:'APP-ASSET/DISPLAY MAPPING'},
    {id:'deadball_specialist',displayName:'Alan Shearer',title:'The Finisher',asset:'alan-shearer.png',level:8,xp:710,xpNext:800,tactic:{id:'tacticSoloDribbleEffectiveness',current:[30],next:[30]},attribute:{id:'attributeStrengthShooting',attributes:['Strength','Shooting'],current:[20],next:[25]},signature:{id:'signatureAnkleBreaker',current:[25,10],next:[30,10]},mapping:'LIVE-CONFIRMED'},
    {id:'iron_guard',displayName:'Nemanja Vidić',title:'The Iron Guard',asset:'nemanja-vidic.png',level:6,xp:100,xpNext:200,tactic:{id:'tacticDefensiveActionsEffectivenessWithStaminaPenalty',current:[25],next:[25]},attribute:{id:'attributeTacklingBravery',attributes:['Tackling','Bravery'],current:[15],next:[20]},signature:{id:'signatureIronCheck',current:[2,10],next:[5,8]},mapping:'APP-ASSET/DISPLAY MAPPING'},
    {id:'enforcer',displayName:'Claude Makélélé',title:'The Enforcer',asset:'claude-makelele.png',level:7,xp:0,xpNext:400,tactic:{id:'tacticDefensiveActionsEffectivenessAgainstShortPasses',current:[25],next:[25]},attribute:{id:'attributeBraveryPositioning',attributes:['Bravery','Positioning'],current:[20],next:[25]},signature:{id:'signatureParkingTheBus',current:[15,10],next:[20,10]},mapping:'APP-ASSET/DISPLAY MAPPING'}
  ];
  TE.BibleData={VERSION:'1.0',GAME_DATA_VERSION:'build_30527',CURRENT_ROLES,POSITION_ORDER,ROLE_RECTS,ROLE_IDS,PLAYSTYLES,PLAYSTYLE_LEVELS,SPECIAL_ABILITIES,FORMATION_TEMPLATES,TACTICS,APPROACHES,MENTORS,EVIDENCE:{GAME:'GAME FACT',LIVE:'LIVE FACT',COMPANION:'TOP ELEVEN TOOL CALCULATION',UNRESOLVED:'UNRESOLVED'}};
})();
