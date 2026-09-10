(() => {
  const TE=window.TE5=window.TE5||{};const D=TE.Data,B=TE.BibleData;
  if(!D||!B)throw new Error('data.js and bible-data.js must load first');
  const abilities=p=>Array.isArray(p?.specialAbilities)?p.specialAbilities:[];
  const val=(p,s)=>{const n=Number(p?.skills?.[s]);return Number.isFinite(n)?n:0;};
  const mean=(p,names)=>names.reduce((s,n)=>s+val(p,n),0)/names.length;
  const stable=(p)=>String(p?.key||p?.name||'');
  function lexSort(rows,fields){return rows.sort((a,b)=>{for(const [k,dir=1] of fields){if(a[k]!==b[k])return (a[k]>b[k]?-1:1)*dir;}return stable(a.player).localeCompare(stable(b.player));});}
  function rankPenalty(players){return lexSort(players.map(player=>({player,specialist:abilities(player).includes('Penalty Kick Specialist')?1:0,skill:mean(player,['Finishing','Shooting']),creativity:val(player,'Creativity'),score:mean(player,['Finishing','Shooting'])})),[['specialist'],['skill'],['creativity']]);}
  function rankFreeKick(players){return lexSort(players.map(player=>({player,specialist:abilities(player).includes('Free Kick Specialist')?1:0,skill:mean(player,['Shooting','Finishing','Passing','Creativity']),score:mean(player,['Shooting','Finishing','Passing','Creativity'])})),[['specialist'],['skill']]);}
  function rankCorner(players){return lexSort(players.map(player=>({player,specialist:abilities(player).includes('Corner Specialist')?2:abilities(player).includes('Set Piece Taker')?1:0,skill:mean(player,['Crossing','Passing','Creativity']),score:mean(player,['Crossing','Passing','Creativity'])})),[['specialist'],['skill']]);}
  function rankPlaymakers(players){const penalties=rankPenalty(players),corners=rankCorner(players),free=rankFreeKick(players);return{penalties:penalties.slice(0,5),corner:corners[0]||null,freeKick:free[0]||null,captain:null,captainNote:'No authoritative captain formula is known; captain is user-selected.',evidence:'TOP ELEVEN TOOL CALCULATION'};}
  TE.Recommendations={rankPlaymakers,rankPenalty,rankFreeKick,rankCorner,MENTORS:B.MENTORS};
})();
