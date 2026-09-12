const fs=require('fs'),vm=require('vm'),path=require('path');
const ROOT=path.resolve(__dirname,'..');
class LS{constructor(){this.m=new Map()}get length(){return this.m.size}key(i){return [...this.m.keys()][i]??null}getItem(k){return this.m.has(k)?this.m.get(k):null}setItem(k,v){this.m.set(String(k),String(v))}removeItem(k){this.m.delete(String(k))}}
global.window=global;global.localStorage=new LS();global.sessionStorage=new LS();global.CustomEvent=class{constructor(type,opts={}){this.type=type;this.detail=opts.detail}};
global.document={addEventListener(){},querySelector(){return null},querySelectorAll(){return[]},body:{classList:{add(){},remove(){}}}};
global.setTimeout=setTimeout;global.clearTimeout=clearTimeout;
vm.runInThisContext(fs.readFileSync(path.join(ROOT,'js/cloud.js'),'utf8'),{filename:'cloud.js'});
vm.runInThisContext(fs.readFileSync(path.join(ROOT,'js/storage.js'),'utf8'),{filename:'storage.js'});
const C=global.TE5.Cloud,S=global.TE5.Storage;
C.state.user={uid:'user-test'};C.state.status='ready';
(async()=>{
  await S.set('player:test','{"name":"Test"}');
  if(localStorage.getItem('te:player:test')!=='{"name":"Test"}')throw new Error('local write was not immediate');
  let box=JSON.parse(localStorage.getItem('te:cloud:outbox:user-test:v1')||'{}');
  if(box['player:test']?.op!=='set')throw new Error('player write was not queued in durable outbox');
  await S.del('player:test');
  if(localStorage.getItem('te:player:test')!==null)throw new Error('local delete was not immediate');
  box=JSON.parse(localStorage.getItem('te:cloud:outbox:user-test:v1')||'{}');
  if(box['player:test']?.op!=='delete')throw new Error('player delete did not replace pending set with tombstone');
  console.log('PASS cloud local-first runtime: immediate local writes + durable set/delete outbox');
})().catch(e=>{console.error(e);process.exit(1)});
