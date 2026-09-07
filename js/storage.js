(() => {
  const TE=window.TE5=window.TE5||{};
  const PREFIX='te:'; // Preserve v4 data so v5 opens the existing squad.
  const storage={
    async get(key){const v=localStorage.getItem(PREFIX+key);return v==null?null:v;},
    async set(key,value){localStorage.setItem(PREFIX+key,String(value));},
    async del(key){localStorage.removeItem(PREFIX+key);},
    async list(prefix=''){const keys=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith(PREFIX)){const bare=k.slice(PREFIX.length);if(!prefix||bare.startsWith(prefix))keys.push(bare);}}return keys.sort();}
  };
  TE.Storage=storage;
})();
