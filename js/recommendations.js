(() => {
  const TE=window.TE5=window.TE5||{};const D=TE.Data,B=TE.BibleData;
  if(!D||!B)throw new Error('data.js and bible-data.js must load first');
  const abilities=p=>Array.isArray(p?.specialAbilities)?p.specialAbilities:[];
  const val=(p,s)=>{const n=Number(p?.skills?.[s]);return Number.isFinite(n)?n:0;};
  const mean=(p,names)=>names.reduce((s,n)=>s+val(p,n),0)/names.length;
  const stable=(p)=>String(p?.key||p?.name||'');
  const SET_PIECE_KEYS=['cornerRight','freeRight','penalty1','freeLeft','cornerLeft','penalty2','penalty3','penalty4','penalty5','captain'];
  const AUTO_SET_PIECE_KEYS=SET_PIECE_KEYS.filter(k=>k!=='captain');
  function lexSort(rows,fields){return rows.sort((a,b)=>{for(const [k,dir=1] of fields){if(a[k]!==b[k])return (a[k]>b[k]?-1:1)*dir;}return stable(a.player).localeCompare(stable(b.player));});}
  function rankPenalty(players){return lexSort(players.map(player=>({player,specialist:abilities(player).includes('Penalty Kick Specialist')?1:0,skill:mean(player,['Finishing','Shooting']),creativity:val(player,'Creativity'),score:mean(player,['Finishing','Shooting'])})),[['specialist'],['skill'],['creativity']]);}
  function rankFreeKick(players){return lexSort(players.map(player=>({player,specialist:abilities(player).includes('Free Kick Specialist')?1:0,skill:mean(player,['Shooting','Finishing','Passing','Creativity']),score:mean(player,['Shooting','Finishing','Passing','Creativity'])})),[['specialist'],['skill']]);}
  function rankCorner(players){return lexSort(players.map(player=>({player,specialist:abilities(player).includes('Corner Specialist')?2:abilities(player).includes('Set Piece Taker')?1:0,skill:mean(player,['Crossing','Passing','Creativity']),score:mean(player,['Crossing','Passing','Creativity'])})),[['specialist'],['skill']]);}
  function rankPlaymakers(players){const penalties=rankPenalty(players),corners=rankCorner(players),free=rankFreeKick(players);return{penalties:penalties.slice(0,5),corner:corners[0]||null,freeKick:free[0]||null,captain:null,captainNote:'No authoritative captain formula is known; captain is user-selected.',evidence:'TOP ELEVEN TOOL CALCULATION'};}
  function recommendedSetPieces(players){
    const ranked=rankPlaymakers(players),penalties=ranked.penalties||[];
    return{
      cornerRight:ranked.corner?.player?.key||'',
      freeRight:ranked.freeKick?.player?.key||'',
      penalty1:penalties[0]?.player?.key||'',
      freeLeft:ranked.freeKick?.player?.key||'',
      cornerLeft:ranked.corner?.player?.key||'',
      penalty2:penalties[1]?.player?.key||'',
      penalty3:penalties[2]?.player?.key||'',
      penalty4:penalties[3]?.player?.key||'',
      penalty5:penalties[4]?.player?.key||'',
      captain:''
    };
  }
  function normaliseSetPieceState(stored,players){
    const recommendations=recommendedSetPieces(players),starterKeys=new Set(players.map(p=>String(p?.key||'')).filter(Boolean));
    let assignments={},sources={};
    if(stored?.version===4&&stored.assignments&&typeof stored.assignments==='object'){
      assignments={...stored.assignments};sources={...(stored.sources||{})};
    }else if(stored&&typeof stored==='object'){
      const legacy={...stored};if(legacy.penalty&&!legacy.penalty1)legacy.penalty1=legacy.penalty;delete legacy.penalty;
      for(const key of SET_PIECE_KEYS){const value=String(legacy[key]||'');assignments[key]=value;sources[key]=value?'legacy':(key==='captain'?'manual':'auto');}
    }else{
      assignments={...recommendations};for(const key of AUTO_SET_PIECE_KEYS)sources[key]='auto';sources.captain='manual';
    }
    for(const key of SET_PIECE_KEYS){
      let source=['auto','manual','legacy'].includes(sources[key])?sources[key]:(assignments[key]?'legacy':(key==='captain'?'manual':'auto'));
      let playerKey=String(assignments[key]||'');
      if(playerKey&&!starterKeys.has(playerKey)){playerKey='';source=key==='captain'?'manual':'auto';}
      if(source==='auto')playerKey=String(recommendations[key]||'');
      assignments[key]=playerKey;sources[key]=source;
    }
    sources.captain=sources.captain==='auto'?'manual':sources.captain;
    return{version:4,assignments,sources};
  }
  function setManualSetPiece(state,key,playerKey,players){
    const next=normaliseSetPieceState(state,players);if(!SET_PIECE_KEYS.includes(key))return next;
    next.assignments[key]=String(playerKey||'');next.sources[key]='manual';return next;
  }
  function refreshSetPieceRecommendations(state,players){
    const next=normaliseSetPieceState(state,players),recommendations=recommendedSetPieces(players);
    for(const key of AUTO_SET_PIECE_KEYS){next.assignments[key]=String(recommendations[key]||'');next.sources[key]='auto';}
    return next;
  }
  TE.Recommendations={rankPlaymakers,rankPenalty,rankFreeKick,rankCorner,recommendedSetPieces,normaliseSetPieceState,setManualSetPiece,refreshSetPieceRecommendations,SET_PIECE_KEYS,AUTO_SET_PIECE_KEYS,MENTORS:B.MENTORS};
})();
