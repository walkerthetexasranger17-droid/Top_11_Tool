(() => {
  const TE=window.TE5=window.TE5||{}; const D=TE.Data,S=TE.Storage;
  if(!D||!S)throw new Error('data.js and storage.js must load first');
  function normPos(p){return String(p||'').toUpperCase().trim();}
  function normaliseRoles(data){
    const raw=Array.isArray(data?.roles)?data.roles:(data?.position?[data.position]:[]);const out=[];
    for(const r of raw){const p=normPos(r);if(D.ALL_POSITIONS.includes(p)&&!out.includes(p))out.push(p);}const primary=normPos(data?.position);if(primary&&D.ALL_POSITIONS.includes(primary)&&!out.includes(primary))out.unshift(primary);return out.slice(0,3);
  }
  function cleanPlayer(data){const roles=normaliseRoles(data);return {...data,position:roles[0]||normPos(data?.position),roles,specialAbilities:Array.isArray(data?.specialAbilities)?data.specialAbilities.slice(0,2):data?.specialAbility?[data.specialAbility]:[],playstyle:data?.playstyle||'',skills:{...(data?.skills||{})}};}
  async function all(){const keys=await S.list('player:');const rows=[];for(const key of keys){try{const raw=await S.get(key);if(raw)rows.push({...cleanPlayer(JSON.parse(raw)),key});}catch(_){}}rows.sort((a,b)=>(D.POSITION_ORDER[a.position]||99)-(D.POSITION_ORDER[b.position]||99)||String(a.name||'').localeCompare(String(b.name||'')));return rows;}
  async function get(key){const raw=await S.get(key);return raw?{...cleanPlayer(JSON.parse(raw)),key}:null;}
  function slug(s){return String(s||'player').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')||'player';}
  async function save(data,key=null){const p=cleanPlayer(data);if(!p.name?.trim())throw new Error('Player name is required');if(!D.ALL_POSITIONS.includes(p.position))throw new Error('A valid primary role is required');const outKey=key||`player:${slug(p.name)}_${Date.now().toString(36)}`;await S.set(outKey,JSON.stringify({...p,updatedAt:new Date().toISOString()}));return outKey;}
  async function remove(key){await S.del(key);await S.del(`training:session:${key}`);}
  function roleGroup(pos){if(pos==='GK')return'gk';if(pos==='ST')return'st';if(['AML','AMC','AMR'].includes(pos))return'am';if(['DML','DMC','DMR'].includes(pos))return'dm';if(['DL','DC','DR'].includes(pos))return'd';return'm';}
  TE.Players={all,get,save,remove,cleanPlayer,normaliseRoles,roleGroup};
})();
