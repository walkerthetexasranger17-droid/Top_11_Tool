(() => {
  const TE=window.TE5=window.TE5||{};
  const PREFIX='te:';
  const cloud=()=>TE.Cloud;
  async function syncSet(key,value){try{if(cloud()?.state?.status==='ready'&&cloud().shouldSyncKey(key))await cloud().writeKey(key,value)}catch(err){console.warn('Cloud write deferred',key,err)}}
  async function syncDel(key){try{if(cloud()?.state?.status==='ready'&&cloud().shouldSyncKey(key))await cloud().deleteKey(key)}catch(err){console.warn('Cloud delete deferred',key,err)}}
  const storage={
    PREFIX,
    async get(key){const v=localStorage.getItem(PREFIX+key);return v==null?null:v;},
    async set(key,value){const s=String(value);localStorage.setItem(PREFIX+key,s);await syncSet(key,s);},
    async del(key){localStorage.removeItem(PREFIX+key);await syncDel(key);},
    async list(prefix=''){const keys=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith(PREFIX)){const bare=k.slice(PREFIX.length);if(!prefix||bare.startsWith(prefix))keys.push(bare);}}return keys.sort();},
    async getJSON(key,fallback=null){const raw=await this.get(key);if(raw==null)return fallback;try{return JSON.parse(raw);}catch(_){return fallback;}},
    async setJSON(key,value){await this.set(key,JSON.stringify(value));return value;}
  };
  TE.Storage=storage;
})();
