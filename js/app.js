(() => {
  const TE=window.TE5; const D=TE.Data,P=TE.Players,S=TE.Storage,T=TE.Training,TT=TE.TeamTraining,SC=TE.Scanner,R=TE.Recommendations;
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const state={page:'dashboard',squadFilter:'ALL',search:'',scan:null,scanAbilities:[],playerKey:'',profileAbilities:[],trainingKey:'',maxGrey:1,disabledDrills:new Set(),session:null,tacticMode:'balanced'};

  function toast(msg,type='ok'){const el=$('#toast');el.textContent=msg;el.className='toast show'+(type==='err'?' err':'');clearTimeout(toast.t);toast.t=setTimeout(()=>el.className='toast',2600);}
  function roleAsset(pos){return `assets/roles/${P.roleGroup(pos)}.webp`;}
  function drillAsset(name='',cat=''){
    const n=name.toLowerCase(),c=cat.toLowerCase();
    if(/one[- ]?on[- ]?one|1v1|attacker|defender/.test(n))return'assets/drills/one-v-one.webp';
    if(/shoot|finish|free kick|penalt|set piece/.test(n))return'assets/drills/shoot.webp';
    if(/pass|possession|piggy|video analysis/.test(n))return'assets/drills/pass.webp';
    if(/head|aerial|cross|corner|press the play/.test(n))return'assets/drills/aerial.webp';
    if(/sprint|agility|fitness|stretch|warm|condition|shuttle|gym|fast/.test(n)||c.includes('physical'))return'assets/drills/agility.webp';
    return'assets/drills/dribble.webp';
  }
  function diffClass(d){return String(d||'').replace(/\s+/g,'');}
  function go(page){
    if(!document.getElementById('page-'+page))page='dashboard';state.page=page;
    $$('.page').forEach(p=>p.classList.toggle('active',p.dataset.page===page));
    $$('.nav-btn[data-go]').forEach(b=>b.classList.toggle('active',b.dataset.go===page));
    $('#moreBackdrop').classList.remove('open');window.scrollTo({top:0,behavior:'instant'});
    if(page==='dashboard')renderDashboard();if(page==='squad')renderSquad();if(page==='player')renderPlayerProfile();if(page==='training')renderTrainingPicker();if(page==='team-training')renderTeamTraining();if(page==='tactics')renderTactics();if(page==='playmakers')renderPlaymakers();
  }
  document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g){go(g.dataset.go);return;}});
  $('#moreBtn').addEventListener('click',()=>$('#moreBackdrop').classList.toggle('open'));
  $('#moreBackdrop').addEventListener('click',e=>{if(e.target===$('#moreBackdrop'))$('#moreBackdrop').classList.remove('open');});

  async function renderDashboard(){
    const players=await P.all(),avg=players.length?players.reduce((a,p)=>a+Number(p.ovr||0),0)/players.length:0,high=players.length?Math.max(...players.map(p=>Number(p.ovr||0))):0;
    $('#dashboardStats').innerHTML=`<div class="stat lime"><b>${players.length}</b><span>Players</span></div><div class="stat"><b>${players.length?Math.round(avg):'—'}</b><span>Avg OVR</span></div><div class="stat"><b>${players.length?high:'—'}</b><span>Highest</span></div>`;
  }

  function category(pos){if(pos==='GK')return'GK';if(['DL','DC','DR','DML','DMC','DMR'].includes(pos))return'DEF';if(['ML','MC','MR'].includes(pos))return'MID';return'ATT';}
  async function renderSquad(){
    const players=await P.all();const counts={ALL:players.length,GK:0,DEF:0,MID:0,ATT:0};players.forEach(p=>counts[category(p.position)]++);
    $('#squadFilters').innerHTML=['ALL','GK','DEF','MID','ATT'].map(x=>`<button class="chip ${state.squadFilter===x?'active':''}" data-squad-filter="${x}">${x} ${counts[x]}</button>`).join('');
    const q=state.search.trim().toLowerCase();
    const filtered=players.filter(p=>{
      const inFilter=state.squadFilter==='ALL'||category(p.position)===state.squadFilter;
      const matches=!q||String(p.name||'').toLowerCase().includes(q)||P.normaliseRoles(p).join(' ').toLowerCase().includes(q);
      return inFilter&&matches;
    });
    $('#squadList').innerHTML=filtered.length?filtered.map(p=>`<button class="player-row" data-player-key="${esc(p.key)}" style="width:100%;text-align:left;color:inherit"><img class="player-art" src="${roleAsset(p.position)}"><div><div class="player-name">${esc(p.name||'Unnamed Player')}</div><div class="player-meta"><span class="pos-tag">${esc(p.position||'?')}</span>${esc(P.normaliseRoles(p).slice(1).join(' · '))}${p.age?` · Age ${esc(p.age)}`:''}</div></div><div class="ovr"><b>${esc(p.ovr||'—')}</b><span>OVR</span></div></button>`).join(''):`<div class="empty"><b>No players here</b>${players.length?'Change the search or filter.':'Add your first player with Scanner v2.'}</div>`;
  }
  $('#squadSearch').addEventListener('input',e=>{state.search=e.target.value;renderSquad();});
  $('#clearSearchBtn').addEventListener('click',()=>{$('#squadSearch').value='';state.search='';renderSquad();});
  $('#refreshSquadBtn').addEventListener('click',renderSquad);
  document.addEventListener('click',e=>{const f=e.target.closest('[data-squad-filter]');if(f){state.squadFilter=f.dataset.squadFilter;renderSquad();}const row=e.target.closest('[data-player-key]');if(row){state.playerKey=row.dataset.playerKey;go('player');}});

  // ---------------- Player profile ----------------
  function profileGroups(player){return player.position==='GK'?D.GROUPS_GK:D.GROUPS_OUTFIELD;}
  function topSkills(player,limit=6){
    const white=new Set(D.POSITION_WHITE[player.position]||[]);
    return Object.entries(player.skills||{}).filter(([name,v])=>white.has(name)&&Number(v)>0).sort((a,b)=>Number(b[1])-Number(a[1])).slice(0,limit);
  }
  function renderProfileAbilities(){
    $('#profileAbilityPicker').innerHTML=D.SPECIAL_ABILITIES.map(a=>`<button type="button" class="chip profile-ability-chip ${state.profileAbilities.includes(a)?'active':''}" data-profile-ability="${esc(a)}">${esc(a)}</button>`).join('');
  }
  function fillRoleSelect(id,value,allowBlank=false,allowed=D.ALL_POSITIONS){
    $(id).innerHTML=(allowBlank?'<option value="">None</option>':'')+allowed.map(r=>`<option value="${r}" ${r===value?'selected':''}>${r}</option>`).join('');
  }
  async function renderPlayerProfile(){
    if(!state.playerKey){go('squad');return;}
    const p=await P.get(state.playerKey);if(!p){toast('Player could not be loaded','err');state.playerKey='';go('squad');return;}
    const roles=P.normaliseRoles(p),white=new Set(D.POSITION_WHITE[p.position]||[]);
    $('#profileRoleArt').src=roleAsset(p.position);$('#profileRoleArt').alt=`${P.roleGroup(p.position).toUpperCase()} role artwork`;
    $('#profileName').textContent=p.name||'Player';$('#profileOvr').textContent=p.ovr||'—';$('#profileEyebrow').textContent=`${p.position} · Player Profile`;
    $('#profileMeta').innerHTML=`${roles.map(r=>`<span>${esc(r)}</span>`).join('')}${p.age?`<span>Age ${esc(p.age)}</span>`:''}`;
    const badges=[];if(p.playstyle)badges.push(`<div class="profile-badge"><strong>PLAYSTYLE</strong> · ${esc(p.playstyle)}</div>`);for(const a of (p.specialAbilities||[]))badges.push(`<div class="profile-badge gold"><strong>ABILITY</strong> · ${esc(a)}</div>`);if(p.scanner?.version)badges.push(`<div class="profile-badge"><strong>SCAN</strong> · v${esc(p.scanner.version)} ${p.scanner.confidence?.overall?Math.round(p.scanner.confidence.overall*100)+'%':''}</div>`);$('#profileBadges').innerHTML=badges.join('')||'<div class="profile-badge">No playstyle or special ability selected</div>';
    const top=topSkills(p);$('#profileKeySkills').innerHTML=top.length?top.map(([name,v])=>`<div class="profile-key"><span>${esc(name)}</span><div class="track"><i style="width:${Math.max(2,Math.min(100,Number(v)/2.5))}%"></i></div><b>${esc(v)}</b></div>`).join(''):'<div class="empty"><b>No skill data</b>Update this player from a scan to populate attributes.</div>';
    $('#profileSkills').innerHTML=Object.entries(profileGroups(p)).map(([group,names])=>`<div class="skill-group"><h3>${esc(group)}</h3><div class="skill-grid">${names.map(name=>`<div class="skill ${white.has(name)?'white':'grey'}"><span>${esc(name)}</span><b>${esc(p.skills?.[name]??'—')}</b></div>`).join('')}</div></div>`).join('');
    $('#profileEditCard').style.display='none';$('#profileEditBtn').textContent='Edit Player';$('#profileEditNote').textContent='';
  }
  async function openProfileEdit(){
    const p=await P.get(state.playerKey);if(!p)return;const roles=P.normaliseRoles(p);state.profileAbilities=[...(p.specialAbilities||[])].slice(0,2);
    $('#profileEditName').value=p.name||'';$('#profileEditAge').value=p.age??'';$('#profileEditOvr').value=p.ovr??'';
    const allowed=p.position==='GK'?['GK']:D.ALL_POSITIONS.filter(r=>r!=='GK');
    fillRoleSelect('#profileEditRole1',roles[0]||p.position,false,allowed);fillRoleSelect('#profileEditRole2',roles[1]||'',true,p.position==='GK'?[]:allowed);fillRoleSelect('#profileEditRole3',roles[2]||'',true,p.position==='GK'?[]:allowed);
    $('#profileEditRole2').disabled=p.position==='GK';$('#profileEditRole3').disabled=p.position==='GK';
    $('#profileEditPlaystyle').innerHTML='<option value="">No playstyle</option>'+D.PLAYSTYLES.map(x=>`<option value="${esc(x)}" ${x===p.playstyle?'selected':''}>${esc(x)}</option>`).join('');renderProfileAbilities();$('#profileEditCard').style.display='block';$('#profileEditBtn').textContent='Editing';$('#profileEditCard').scrollIntoView({behavior:'smooth',block:'start'});
  }
  $('#profileBackBtn').addEventListener('click',()=>go('squad'));
  $('#profileTrainBtn').addEventListener('click',()=>{if(!state.playerKey)return;state.trainingKey=state.playerKey;go('training');});
  $('#profileEditBtn').addEventListener('click',openProfileEdit);$('#profileCancelEditBtn').addEventListener('click',()=>{$('#profileEditCard').style.display='none';$('#profileEditBtn').textContent='Edit Player';});
  document.addEventListener('click',e=>{const b=e.target.closest('[data-profile-ability]');if(!b)return;const a=b.dataset.profileAbility;if(state.profileAbilities.includes(a))state.profileAbilities=state.profileAbilities.filter(x=>x!==a);else if(state.profileAbilities.length<2)state.profileAbilities.push(a);else{toast('Maximum two special abilities','err');return;}renderProfileAbilities();});
  $('#profileSaveBtn').addEventListener('click',async()=>{
    const existing=await P.get(state.playerKey);if(!existing)return;const name=$('#profileEditName').value.trim(),age=Number($('#profileEditAge').value),ovr=Number($('#profileEditOvr').value),primary=$('#profileEditRole1').value;
    if(!name||!primary){toast('Name and primary role are required','err');return;}if(!Number.isFinite(age)||age<15||age>60){toast('Age must be between 15 and 60','err');return;}if(!Number.isFinite(ovr)||ovr<1||ovr>520){toast('OVR must be between 1 and 520','err');return;}const duplicate=(await P.all()).find(x=>x.key!==state.playerKey&&String(x.name||'').trim().toLowerCase()===name.toLowerCase());if(duplicate){toast('Another player already uses that name','err');return;}
    const roles=[primary,$('#profileEditRole2').value,$('#profileEditRole3').value].filter((r,i,a)=>r&&a.indexOf(r)===i).slice(0,3);if(existing.position==='GK'&&roles.some(r=>r!=='GK')){toast('GK profiles cannot use outfield roles','err');return;}if(existing.position!=='GK'&&roles.includes('GK')){toast('Outfield profiles cannot use GK','err');return;}
    await P.save({...existing,name,age,ovr,position:primary,roles,playstyle:$('#profileEditPlaystyle').value,specialAbilities:[...state.profileAbilities]},state.playerKey);toast('Player updated');await renderDashboard();await renderPlayerProfile();
  });
  $('#profileDeleteBtn').addEventListener('click',async()=>{const b=$('#profileDeleteBtn');if(!b.dataset.armed){b.dataset.armed='1';b.textContent='Tap again to delete';$('#profileEditNote').textContent='This permanently removes the player and their saved training session.';setTimeout(()=>{delete b.dataset.armed;b.textContent='Delete Player';},3500);return;}const p=await P.get(state.playerKey);await P.remove(state.playerKey);state.playerKey='';state.trainingKey='';delete b.dataset.armed;b.textContent='Delete Player';toast(`${p?.name||'Player'} deleted`);await renderDashboard();go('squad');});

  // ---------------- Scanner v2 ----------------
  function resetScanner(){state.scan=null;state.scanAbilities=[];$('#scanFile').value='';$('#scanWindow').className='scan-window';$('#scanPreview').removeAttribute('src');$('#scanReview').style.display='none';$('#scanProgressBar').style.width='0%';$('#scanProgressText').textContent='Waiting for screenshot';$('#scanPercent').textContent='0%';$('#scanSaveNote').textContent='';}
  $('#rescanBtn').addEventListener('click',resetScanner);
  function progress(p){const pct=Math.round((p.progress||0)*100);$('#scanProgressBar').style.width=pct+'%';$('#scanProgressText').textContent=p.label||'Scanning';$('#scanPercent').textContent=pct+'%';}
  function confidenceBadge(v){const n=Math.round((v||0)*100);return `<span class="chip active">${n}% confidence</span>`;}
  function renderAbilityPicker(){
    $('#abilityPicker').innerHTML=D.SPECIAL_ABILITIES.map(a=>`<button class="chip ${state.scanAbilities.includes(a)?'active':''}" data-ability="${esc(a)}">${esc(a)}</button>`).join('');
  }
  document.addEventListener('click',e=>{const b=e.target.closest('[data-ability]');if(!b)return;const a=b.dataset.ability;if(state.scanAbilities.includes(a))state.scanAbilities=state.scanAbilities.filter(x=>x!==a);else if(state.scanAbilities.length<2)state.scanAbilities.push(a);else{toast('Maximum two special abilities','err');return;}renderAbilityPicker();});
  function renderScanSkills(scan){
    const groups=scan.layout==='gk'?D.GROUPS_GK:D.GROUPS_OUTFIELD;
    $('#scanSkills').innerHTML=Object.entries(groups).map(([g,names])=>`<div class="skill-group"><h3>${esc(g)}</h3><div class="skill-grid">${names.map(s=>`<div class="skill"><span>${esc(s)}</span><b>${esc(scan.skills[s]??'—')}</b></div>`).join('')}</div></div>`).join('');
  }
  function populateScanReview(scan){
    state.scan=scan;$('#scanReview').style.display='block';$('#scanConfidence').innerHTML=confidenceBadge(scan.confidence.overall);
    const checks=Object.entries(scan.checks||{});$('#scanChecks').innerHTML=checks.map(([name,c])=>`<div class="verify ${c.ok?'ok':'warn'}"><strong>${c.ok?'✓':'!'} ${esc(name)}</strong><span>${c.error==null?'No aggregate available':`difference ${Number(c.error).toFixed(1)}`}</span></div>`).join('');
    $('#scanName').value=scan.name||'';$('#scanAge').value=scan.age??'';$('#scanOvr').value=scan.ovr??'';
    const allowedRoles=scan.layout==='gk'?['GK']:D.ALL_POSITIONS.filter(r=>r!=='GK');
    const fillScanRole=(id,value,blankLabel)=>{$(id).innerHTML=`<option value="">${blankLabel}</option>`+allowedRoles.map(r=>`<option value="${r}" ${r===value?'selected':''}>${r}</option>`).join('');};
    fillScanRole('#scanRole',scan.roles?.[0]||scan.position,'Choose role');fillScanRole('#scanRole2',scan.roles?.[1]||'','None');fillScanRole('#scanRole3',scan.roles?.[2]||'','None');
    if(scan.layout==='gk'){$('#scanRole2').disabled=true;$('#scanRole3').disabled=true;}else{$('#scanRole2').disabled=false;$('#scanRole3').disabled=false;}
    $('#detectedRoles').innerHTML=(scan.roles||[]).map((r,i)=>`<span class="chip ${i===0?'active':''}">${esc(r)}${i===0?' · primary':''}</span>`).join('')+(scan.roles?.length?'':'<span style="font-size:10px;color:var(--muted)">Role needs review.</span>');
    $('#scanPlaystyle').innerHTML='<option value="">No playstyle</option>'+D.PLAYSTYLES.map(x=>`<option>${esc(x)}</option>`).join('');
    renderAbilityPicker();renderScanSkills(scan);
    $('#scanSaveNote').textContent=(scan.repairNotes||[]).join(' · ')||'Numeric attributes were parsed locally and cross-checked against the displayed group totals.';
  }
  $('#scanFile').addEventListener('change',async e=>{
    const file=e.target.files?.[0];if(!file)return;const url=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file);});
    $('#scanPreview').src=url;$('#scanWindow').classList.add('has-image','scanning');$('#scanReview').style.display='none';progress({progress:.02,label:'Preparing scanner'});
    try{const scan=await SC.scan(url,progress);$('#scanWindow').classList.remove('scanning');populateScanReview(scan);toast(`Scan complete · ${Math.round(scan.confidence.overall*100)}% confidence`);}catch(err){$('#scanWindow').classList.remove('scanning');$('#scanProgressText').textContent='Scan failed';toast(err.message||'Scanner failed','err');console.error(err);}
  });
  $('#saveScannedPlayer').addEventListener('click',async()=>{
    if(!state.scan)return;const name=$('#scanName').value.trim(),age=Number($('#scanAge').value),ovr=Number($('#scanOvr').value),position=$('#scanRole').value;
    if(!name||!position){toast('Check the name and primary role before saving','err');return;}
    if(!Number.isFinite(age)||age<15||age>60){toast('Check the player age before saving','err');return;}
    if(!Number.isFinite(ovr)||ovr<1||ovr>520){toast('Check the OVR before saving','err');return;}
    const roles=[position,$('#scanRole2').value,$('#scanRole3').value].filter((r,i,a)=>r&&a.indexOf(r)===i).slice(0,3);
    if(state.scan.layout==='gk'&&roles.some(r=>r!=='GK')){toast('GK scans can only be saved as GK','err');return;}
    if(state.scan.layout!=='gk'&&roles.includes('GK')){toast('Outfield scans cannot be saved as GK','err');return;}
    const existing=(await P.all()).find(p=>String(p.name||'').trim().toLowerCase()===name.toLowerCase());
    if(existing){$('#scanSaveNote').innerHTML=`A player named <b>${esc(name)}</b> already exists. Change the name or edit that player from My Squad.`;toast('Duplicate player detected','err');return;}
    try{await P.save({name,age,ovr,position,roles,skills:state.scan.skills,playstyle:$('#scanPlaystyle').value,specialAbilities:[...state.scanAbilities],scanner:{version:2,confidence:state.scan.confidence,checks:state.scan.checks}});toast(`${name} saved to My Squad`);resetScanner();await renderDashboard();go('squad');}catch(err){toast(err.message||'Save failed','err');}
  });

  // ---------------- Individual training ----------------
  async function renderTrainingPicker(){
    const players=await P.all();$('#trainingPlayer').innerHTML='<option value="">Select a player</option>'+players.map(p=>`<option value="${esc(p.key)}" ${p.key===state.trainingKey?'selected':''}>${esc(p.name)} · ${esc(p.position)} · ${esc(p.ovr||'—')} OVR</option>`).join('');
    if(state.trainingKey&&!players.some(p=>p.key===state.trainingKey)){state.trainingKey='';state.session=null;}
    if(state.trainingKey)await restoreTrainingSession();
  }
  async function persistTraining(){if(!state.trainingKey||!state.session)return;await S.set(`training:session:${state.trainingKey}`,JSON.stringify({session:state.session,maxGrey:state.maxGrey,disabled:[...state.disabledDrills],done:state.session.done||[],savedAt:new Date().toISOString()}));}
  async function restoreTrainingSession(){
    const raw=await S.get(`training:session:${state.trainingKey}`);if(!raw)return;try{const x=JSON.parse(raw);state.maxGrey=Number.isFinite(x.maxGrey)?x.maxGrey:1;state.disabledDrills=new Set(x.disabled||[]);state.session=x.session||null;if(state.session){state.session.done=x.done||state.session.done||[];renderSession();renderAvailability();}}catch(_){}
    updateGreyButtons();
  }
  function updateGreyButtons(){$$('.grey-choice').forEach(b=>{const active=Number(b.dataset.grey)===state.maxGrey;b.classList.toggle('primary',active);b.classList.toggle('ghost',!active);});}
  $$('.grey-choice').forEach(b=>b.addEventListener('click',()=>{state.maxGrey=Number(b.dataset.grey);updateGreyButtons();}));
  $('#trainingPlayer').addEventListener('change',async e=>{state.trainingKey=e.target.value;state.session=null;state.disabledDrills.clear();$('#trainingResults').style.display='none';$('#availabilitySection').style.display='none';if(state.trainingKey)await restoreTrainingSession();});
  async function buildTraining(){
    if(!state.trainingKey){toast('Select a player first','err');return;}const player=await P.get(state.trainingKey);if(!player){toast('Player could not be loaded','err');return;}
    const result=T.buildIndividualSession({position:player.position,skills:player.skills,maxGrey:state.maxGrey,disabled:[...state.disabledDrills],slots:6});
    state.session={...result,playerKey:state.trainingKey,playerName:player.name,position:player.position,done:new Array(result.drills.length).fill(false)};renderSession();renderAvailability();await persistTraining();
    $('#trainingStatus').textContent=result.error==='no-eligible-drills'?'No viable drills remain inside this grey limit. Enable more drills or increase the grey limit.':`Built ${result.drills.length}/6 drills · ${result.meta?.eligibleCount||0} viable candidates · real skills unchanged.`;
  }
  $('#buildSessionBtn').addEventListener('click',buildTraining);$('#rebuildBtn').addEventListener('click',buildTraining);
  function renderSession(){
    const r=state.session;if(!r)return;$('#trainingResults').style.display='block';$('#sessionList').innerHTML=r.drills?.length?r.drills.map((d,i)=>`<div class="drill-row ${r.done?.[i]?'done':''}" data-session-slot="${i}"><img src="${drillAsset(d.name,d.cat)}"><div class="drill-copy"><b>${r.done?.[i]?'✓ ':''}${esc(d.name)}</b><small>${esc(d.cat)} · ${esc(d.fit.white.join(', '))}${d.repeated?' · repeat justified':''}</small></div><span class="diff ${diffClass(d.diff)}">${esc(d.diff)}</span></div>`).join(''):`<div class="empty"><b>No viable six</b>Adjust the grey limit or enable more drills.</div>`;
  }
  $('#sessionList').addEventListener('click',async e=>{const row=e.target.closest('[data-session-slot]');if(!row||!state.session)return;const i=Number(row.dataset.sessionSlot);state.session.done=state.session.done||[];state.session.done[i]=!state.session.done[i];renderSession();await persistTraining();});
  async function renderAvailability(){
    if(!state.trainingKey||!state.session)return;const player=await P.get(state.trainingKey);if(!player)return;$('#availabilitySection').style.display='block';const candidates=T.getEligibleDrills(player.position,player.skills,state.maxGrey,[]);
    $('#drillAvailability').innerHTML=candidates.map(d=>`<div class="avail-row"><div><b style="font-size:11px">${esc(d.name)}</b><div style="font-size:9px;color:var(--muted)">${esc(d.diff)} · ${d.fit.grey.length} grey</div></div><button class="switch ${state.disabledDrills.has(d.name)?'':'on'}" data-toggle-drill="${esc(d.name)}" aria-label="Toggle ${esc(d.name)}"></button></div>`).join('');
  }
  $('#drillAvailability').addEventListener('click',e=>{const b=e.target.closest('[data-toggle-drill]');if(!b)return;const name=b.dataset.toggleDrill;if(state.disabledDrills.has(name))state.disabledDrills.delete(name);else state.disabledDrills.add(name);renderAvailability();persistTraining();});

  // ---------------- Team training ----------------
  function renderTeamTraining(){
    $('#teamTrainingCards').innerHTML=Object.entries(D.TEAM_GROUPS).map(([key,g])=>{const r=TT.buildTeamSession(key,{maxGrey:2,strict:true});return `<div class="card" style="margin-bottom:12px"><div class="card-inner"><div class="section-kicker">2-grey strict · ${r.drills.length} drills</div><div class="section-title">${esc(g.title)}</div><div class="divider"></div><div class="session-list">${r.drills.map(d=>`<div style="display:flex;justify-content:space-between;gap:10px;font-size:11px;padding:7px 0;border-bottom:1px solid rgba(70,140,190,.12)"><b>${esc(d.name)}</b><span style="color:var(--muted)">${esc(d.diff)}</span></div>`).join('')}</div><p style="font-size:9px;color:var(--muted)">Covered roles: ${esc(r.meta.coveredPositions.join(' · '))}</p></div></div>`;}).join('');
  }

  // ---------------- Tactics / mentors ----------------
  async function renderTactics(){
    const players=await P.all();$$('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===state.tacticMode));
    if(!players.length){$('#mentorStrip').innerHTML='<div class="empty"><b>Add players first</b>Mentor and tactic recommendations need squad data.</div>';$('#tacticPlan').innerHTML='';return;}
    const plan=R.recommendTactics(players,state.tacticMode);
    $('#mentorStrip').innerHTML=R.MENTORS.map(m=>`<div class="mentor ${m.name===plan.mentor.name?'active':''}"><img src="assets/mentors/${m.asset}"><div class="mentor-copy"><b>${esc(m.name)}</b><span>${esc(m.title)}</span></div></div>`).join('');
    const items={'Shooting':plan.shoot,'Passing':plan.pass,'Focus':plan.focus,'Crossing':plan.cross,'Possession Lost':plan.lost,'Possession Won':plan.won,'Mentality':plan.mentality,'Marking':plan.mark,'Pressing':plan.press,'Back Line':plan.back,'Tackling':plan.tackle};
    $('#tacticPlan').innerHTML=Object.entries(items).map(([k,v])=>`<div class="plan-item"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('');
  }
  $$('[data-mode]').forEach(b=>b.addEventListener('click',()=>{state.tacticMode=b.dataset.mode;renderTactics();}));

  // ---------------- Playmakers ----------------
  function rankRow(x,i,label=''){const p=x.player;return `<div class="rank-card"><div class="rank-num">${label||i+1}</div><img src="${roleAsset(p.position)}"><div><div class="rank-name">${esc(p.name)}</div><div class="rank-meta">${esc(P.normaliseRoles(p).join(' / '))} · ${esc(p.ovr||'—')} OVR</div></div><div class="rank-score">${Math.round(x.score)}</div></div>`;}
  async function renderPlaymakers(){const players=await P.all();if(!players.length){$('#penaltyRank').innerHTML='<div class="empty"><b>No squad yet</b>Add players to rank specialists.</div>';$('#specialistRank').innerHTML='';return;}const r=R.rankPlaymakers(players);$('#penaltyRank').innerHTML=r.penalties.map((x,i)=>rankRow(x,i)).join('');const specs=[['C',r.corner],['FK',r.freeKick],['★',r.captain]].filter(x=>x[1]);$('#specialistRank').innerHTML=specs.map(x=>rankRow(x[1],0,x[0])).join('');}

  // ---------------- Settings ----------------
  $('#clearDataBtn').addEventListener('click',async()=>{const b=$('#clearDataBtn');if(!b.dataset.armed){b.dataset.armed='1';b.textContent='Tap again to confirm';setTimeout(()=>{delete b.dataset.armed;b.textContent='Clear all squad data';},3500);return;}for(const k of await S.list('player:'))await S.del(k);for(const k of await S.list('training:session:'))await S.del(k);delete b.dataset.armed;b.textContent='Clear all squad data';toast('Squad data cleared');renderDashboard();});

  // PWA
  if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).catch(console.warn));
  resetScanner();updateGreyButtons();renderDashboard();
})();
