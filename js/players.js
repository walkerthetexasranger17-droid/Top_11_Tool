(() => {
  const TE=window.TE5=window.TE5||{}; const D=TE.Data,S=TE.Storage,B=TE.BibleData;
  if(!D||!S||!B)throw new Error('data.js, bible-data.js and storage.js must load first');

  const SCHEMA_VERSION=3;
  const MIGRATION_KEY='schema:players:v525';
  const SQUAD_REVISION_KEY='squad:revision';
  const LEGACY_CURRENT_ROLES=['DML','DMR'];

  function normPos(p){return String(p||'').toUpperCase().trim();}
  function uniqueCurrent(list){
    const out=[];
    for(const raw of list||[]){const r=D.normaliseRole(raw);if(r&&!out.includes(r))out.push(r);}
    return out;
  }
  function legacyRoles(data){
    const raw=[
      ...(Array.isArray(data?.roles)?data.roles:[]),
      ...(Array.isArray(data?.positions)?data.positions:[]),
      ...(Array.isArray(data?.relatedRoles)?data.relatedRoles:[]),
      data?.position
    ].map(normPos);
    return [...new Set([...(data?.legacyRoles||[]),...raw.filter(r=>LEGACY_CURRENT_ROLES.includes(r))])];
  }
  function normaliseRoles(data){
    const raw=Array.isArray(data?.roles)?data.roles:(Array.isArray(data?.positions)?data.positions:(data?.position?[data.position]:[]));
    const out=uniqueCurrent(raw);
    const primary=D.normaliseRole(data?.position);
    if(primary){const i=out.indexOf(primary);if(i>0)out.splice(i,1);if(!out.includes(primary))out.unshift(primary);}
    return out;
  }
  function normaliseRelatedRoles(data){
    const natural=normaliseRoles(data);
    return uniqueCurrent(Array.isArray(data?.relatedRoles)?data.relatedRoles:[]).filter(r=>!natural.includes(r));
  }

  function blankPlaystyle(type=null){
    return {type,level:0,points:null,isTrainingNextLevel:null,nextLevelPrice:null,isNextLevelAvailable:null,nextLevelProgress:null,boost:null};
  }
  function normalisePlaystyle(raw){
    if(raw&&typeof raw==='object'&&!Array.isArray(raw)){
      const def=D.playstyleDefinition(raw);
      const type=def?.type??raw.type??raw.name??null;
      // Preserve unknown/imported fields as well as the full Bible state. Canonical fields
      // are normalised without inventing absent values.
      return {
        ...raw,
        type,
        level:(()=>{const n=Number(raw.level);if(Number.isFinite(n))return n;const key=String(raw.level??'').trim().replace(/[_-]+/g,' ').toLowerCase();const row=B.PLAYSTYLE_LEVELS.find(x=>String(x.name).toLowerCase()===key);return row?.id??0;})(),
        points:raw.points??null,
        isTrainingNextLevel:raw.isTrainingNextLevel??null,
        nextLevelPrice:raw.nextLevelPrice??null,
        isNextLevelAvailable:raw.isNextLevelAvailable??null,
        nextLevelProgress:raw.nextLevelProgress??null,
        boost:raw.boost??null
      };
    }
    const def=D.playstyleDefinition(raw);
    return blankPlaystyle(def?.type||(raw?String(raw):null));
  }
  function playstyleName(player){
    const ps=player?.playstyle;if(!ps)return'';
    const def=D.playstyleDefinition(ps);if(def)return def.id===1?'':def.name;
    return typeof ps==='object'?String(ps.type||''):String(ps);
  }
  function mergePlaystyleState(existing,selection){
    const old=normalisePlaystyle(existing);
    if(selection&&typeof selection==='object'&&!Array.isArray(selection))return normalisePlaystyle(selection);
    const selected=String(selection??'').trim();
    if(!selected)return blankPlaystyle(null);
    const def=D.playstyleDefinition(selected);
    const selectedType=def?.type||selected;
    if(old.type===selectedType || playstyleName({playstyle:old})===selected){return {...old,type:selectedType};}
    // A different manually selected playstyle cannot inherit the previous playstyle's
    // level/points/progress. Unknown state stays unknown/null rather than being guessed.
    return blankPlaystyle(selectedType);
  }
  function mergeVisibleNaturalRoles(existingRoles,editedVisibleRoles,visibleCount=3){
    const edited=uniqueCurrent(editedVisibleRoles);
    const extras=uniqueCurrent(existingRoles).slice(visibleCount).filter(r=>!edited.includes(r));
    return [...edited,...extras];
  }

  function cleanPlayer(data){
    const roles=normaliseRoles(data),legacy=legacyRoles(data),position=roles[0]||'';
    const abilities=(Array.isArray(data?.specialAbilities)?[...data.specialAbilities]:(data?.specialAbility?[data.specialAbility]:[])).map(a=>String(a||'').trim()==='Long Shots'?'Shadow Striker':a);
    const skills={...(data?.skills||data?.attributes||{})};
    return {
      ...data,
      schemaVersion:SCHEMA_VERSION,
      gameDataVersion:D.GAME_DATA_VERSION,
      position,roles,
      relatedRoles:normaliseRelatedRoles(data),
      legacyRoles:legacy,
      playstyle:normalisePlaystyle(data?.playstyle),
      specialAbilities:[...new Set(abilities.filter(Boolean))],
      availableTrainingAbilities:data?.availableTrainingAbilities??null,
      skills,attributes:{...skills},
      sourceMeta:{build:'30527',scannerVersion:data?.sourceMeta?.scannerVersion??data?.scanner?.version??null,importedAt:data?.sourceMeta?.importedAt??null,...(data?.sourceMeta||{})}
    };
  }

  async function bumpRevision(){const n=Number(await S.get(SQUAD_REVISION_KEY)||0)+1;await S.set(SQUAD_REVISION_KEY,String(n));return n;}
  async function revision(){return Number(await S.get(SQUAD_REVISION_KEY)||0);}
  async function migrate(){
    if(await S.get(MIGRATION_KEY))return false;
    const keys=await S.list('player:');let changed=0;
    for(const key of keys){
      const raw=await S.get(key);if(!raw)continue;
      try{
        const old=JSON.parse(raw);
        // Preserve the exact pre-migration record before validating/writing the migrated copy.
        await S.set(`migration:v525:backup:${key}`,raw);
        const p=cleanPlayer({...old});
        p.updatedAt=old.updatedAt||new Date().toISOString();
        await S.set(key,JSON.stringify(p));changed++;
      }catch(_){}
    }
    // The old recommendation caches used superseded models and must not survive migration.
    for(const key of await S.list('teamplan:'))await S.del(key);
    for(const key of await S.list('formation:'))await S.del(key);
    for(const key of await S.list('tactics:'))await S.del(key);
    await S.set(MIGRATION_KEY,JSON.stringify({schemaVersion:SCHEMA_VERSION,gameDataVersion:D.GAME_DATA_VERSION,migratedAt:new Date().toISOString(),players:changed}));
    return true;
  }
  async function all(){
    await migrate();const keys=await S.list('player:'),rows=[];
    for(const key of keys){try{const raw=await S.get(key);if(raw)rows.push({...cleanPlayer(JSON.parse(raw)),key});}catch(_){}}
    rows.sort((a,b)=>(D.POSITION_ORDER[a.position]||99)-(D.POSITION_ORDER[b.position]||99)||String(a.name||'').localeCompare(String(b.name||'')));
    return rows;
  }
  async function get(key){await migrate();const raw=await S.get(key);return raw?{...cleanPlayer(JSON.parse(raw)),key}:null;}
  function slug(s){return String(s||'player').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')||'player';}
  async function invalidateTeamPlan(){for(const key of await S.list('teamplan:'))await S.del(key);}
  async function save(data,key=null){
    await migrate();const p=cleanPlayer(data);
    if(!p.name?.trim())throw new Error('Player name is required');
    if(!D.ALL_POSITIONS.includes(p.position))throw new Error('A valid current primary role is required');
    const outKey=key||`player:${slug(p.name)}_${Date.now().toString(36)}`;
    await S.set(outKey,JSON.stringify({...p,updatedAt:new Date().toISOString()}));
    if(key)await S.del(`training:session:${outKey}`);
    await bumpRevision();await invalidateTeamPlan();return outKey;
  }
  async function remove(key){await S.del(key);await S.del(`training:session:${key}`);await bumpRevision();await invalidateTeamPlan();}
  function roleGroup(pos){if(pos==='GK')return'gk';if(pos==='ST')return'st';if(['AML','AMC','AMR'].includes(pos))return'am';if(pos==='DMC')return'dm';if(['DL','DC','DR'].includes(pos))return'd';return'm';}

  TE.Players={SCHEMA_VERSION,MIGRATION_KEY,all,get,save,remove,cleanPlayer,normaliseRoles,normaliseRelatedRoles,normalisePlaystyle,mergePlaystyleState,mergeVisibleNaturalRoles,playstyleName,roleGroup,migrate,revision};
})();
