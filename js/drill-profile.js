(() => {
  const TE=window.TE5=window.TE5||{};const S=TE.Storage,D=TE.Data,OD=TE.OptimizerData;
  if(!S||!D||!OD)throw new Error('optimizer data, data.js and storage.js must load before drill-profile.js');
  const VERSION=D.GAME_DATA_VERSION;
  const NORMAL_KEY=`training:normal-drills:${VERSION}`;
  const MASTER_KEY=`training:master-stock:${VERSION}`;

  function normalSeed(){
    const rows=OD.seedNormalProfile.profile||[];const byId={};
    for(const d of D.NORMAL_DRILLS){const row=rows.find(x=>x.drill_id===d.drillId);byId[d.drillId]={unlocked:row?!!row.unlocked:!!d.capturedUnlocked,level:row?Number(row.level_id||0):Number(d.capturedLevelId||0)};}
    return {gameDataVersion:VERSION,updatedAt:new Date().toISOString(),drills:byId};
  }
  function masterSeed(){
    const rows=OD.seedMasterStock.stock||[];const byId={};
    for(const d of D.MASTER_CAMPUS_DRILLS){const row=rows.find(x=>x.drill_id===d.drillId);byId[d.drillId]=Math.max(0,Math.trunc(Number(row?.quantity||0)));}
    return {gameDataVersion:VERSION,updatedAt:new Date().toISOString(),stock:byId};
  }
  async function readJson(key){const raw=await S.get(key);if(!raw)return null;try{return JSON.parse(raw);}catch(_){return null;}}
  function validObject(value){return !!value&&typeof value==='object'&&!Array.isArray(value);}
  function repairNormal(value){
    const seed=normalSeed();
    if(!validObject(value)||value.gameDataVersion!==VERSION||!validObject(value.drills))return {data:seed,changed:true};
    const drills={...seed.drills};let changed=false;
    for(const d of D.NORMAL_DRILLS){
      const row=value.drills[d.drillId];
      if(!validObject(row)){changed=true;continue;}
      const unlocked=!!row.unlocked;let level=Math.trunc(Number(row.level)||0);
      if(unlocked)level=Math.max(1,Math.min(3,level||1));else level=Math.max(0,Math.min(3,level));
      drills[d.drillId]={unlocked,level};
      if(row.unlocked!==unlocked||Number(row.level)!==level)changed=true;
    }
    if(Object.keys(value.drills).some(id=>!Object.prototype.hasOwnProperty.call(drills,id)))changed=true;
    return {data:{...value,gameDataVersion:VERSION,drills,updatedAt:value.updatedAt||seed.updatedAt},changed};
  }
  function repairMaster(value){
    const seed=masterSeed();
    if(!validObject(value)||value.gameDataVersion!==VERSION||!validObject(value.stock))return {data:seed,changed:true};
    const stock={...seed.stock};let changed=false;
    for(const d of D.MASTER_CAMPUS_DRILLS){
      const raw=value.stock[d.drillId];const q=Math.max(0,Math.trunc(Number(raw)||0));stock[d.drillId]=q;
      if(raw==null||Number(raw)!==q)changed=true;
    }
    if(Object.keys(value.stock).some(id=>!Object.prototype.hasOwnProperty.call(stock,id)))changed=true;
    return {data:{...value,gameDataVersion:VERSION,stock,updatedAt:value.updatedAt||seed.updatedAt},changed};
  }
  async function ensure(){
    const nr=repairNormal(await readJson(NORMAL_KEY));let n=nr.data;if(nr.changed){n.updatedAt=new Date().toISOString();await S.set(NORMAL_KEY,JSON.stringify(n));}
    const mr=repairMaster(await readJson(MASTER_KEY));let m=mr.data;if(mr.changed){m.updatedAt=new Date().toISOString();await S.set(MASTER_KEY,JSON.stringify(m));}
    return {normal:n,master:m};
  }
  async function getNormal(){return (await ensure()).normal;}
  async function getMaster(){return (await ensure()).master;}
  async function invalidateAllSessions(){const keys=await S.list('training:session:');for(const key of keys)await S.del(key);return keys.length;}
  async function setNormal(drillId,{unlocked,level}){
    const data=await getNormal();if(!D.NORMAL_DRILLS.some(d=>d.drillId===drillId))throw new Error('Unknown normal drill');
    const isUnlocked=!!unlocked;let lv=Math.trunc(Number(level||0));if(isUnlocked)lv=Math.max(1,Math.min(3,lv||1));else lv=Math.max(0,Math.min(3,lv));
    data.drills[drillId]={unlocked:isUnlocked,level:lv};data.updatedAt=new Date().toISOString();await S.set(NORMAL_KEY,JSON.stringify(data));await invalidateAllSessions();return data.drills[drillId];
  }
  async function setMasterStock(drillId,quantity){
    const data=await getMaster();if(!D.MASTER_CAMPUS_DRILLS.some(d=>d.drillId===drillId))throw new Error('Unknown Master drill');
    const q=Math.max(0,Math.trunc(Number(quantity)||0));data.stock[drillId]=q;data.updatedAt=new Date().toISOString();await S.set(MASTER_KEY,JSON.stringify(data));await invalidateAllSessions();return q;
  }
  async function deductMasterUsage(usage){
    const data=await getMaster();for(const [id,countRaw] of Object.entries(usage||{})){const count=Math.max(0,Math.trunc(Number(countRaw)||0));data.stock[id]=Math.max(0,Math.trunc(Number(data.stock[id]||0))-count);}data.updatedAt=new Date().toISOString();await S.set(MASTER_KEY,JSON.stringify(data));await invalidateAllSessions();return data;
  }
  async function resetToCapturedSnapshot(){const n=normalSeed(),m=masterSeed();await S.set(NORMAL_KEY,JSON.stringify(n));await S.set(MASTER_KEY,JSON.stringify(m));await invalidateAllSessions();return {normal:n,master:m};}
  function effectPctForLevel(level){const lv=Math.trunc(Number(level)||0);const row=(D.DRILL_LEVELS.levels||[]).find(x=>Number(x.level_id)===lv);return row?Number(row.training_effect_percent):0;}
  function levelName(level){const row=(D.DRILL_LEVELS.levels||[]).find(x=>Number(x.level_id)===Number(level));return row?.name||'Locked';}
  TE.DrillProfile={VERSION,NORMAL_KEY,MASTER_KEY,ensure,getNormal,getMaster,invalidateAllSessions,setNormal,setMasterStock,deductMasterUsage,resetToCapturedSnapshot,effectPctForLevel,levelName,normalSeed,masterSeed};
})();
