const fs=require('fs'),vm=require('vm'),path=require('path');
global.window=global;
global.localStorage={_m:new Map(),getItem(k){return this._m.has(k)?this._m.get(k):null},setItem(k,v){this._m.set(k,String(v))},removeItem(k){this._m.delete(k)}};
const ROOT=path.join(__dirname,'..');
for(const f of ['optimizer-data.js','bible-data.js','data.js','scanner-engine.js'])vm.runInThisContext(fs.readFileSync(path.join(ROOT,'js',f),'utf8'),{filename:f});
const SC=global.TE5.Scanner;let n=0;function ok(v,m){if(!v)throw new Error(m);n++;}
function response(status,retryAfter=null){return{status,headers:{get(k){return k==='Retry-After'?retryAfter:null}}};}
let e=SC._classifyApiError(response(503),{error:{message:'Model overloaded. Please try again later.'}},'gemini-3.8-flash');
ok(e.kind==='temporary'&&e.retryable,'503 overload is retryable inside bounded 3-attempt cycle');
e=SC._classifyApiError(response(429),{error:{message:'Quota exceeded. Please retry in 17s.',details:[{'@type':'type.googleapis.com/google.rpc.RetryInfo',retryDelay:'17s'},{'@type':'type.googleapis.com/google.rpc.QuotaFailure',violations:[{quotaId:'GenerateRequestsPerMinutePerProjectPerModel-FreeTier'}]}]}},'gemini-3.8-flash');
ok(e.kind==='rate_limit'&&e.retryable,'per-minute 429 is retryable inside bounded cycle');ok(e.retryAfterMs>=17000,'RetryInfo retryDelay is parsed');
e=SC._classifyApiError(response(429),{error:{message:'Daily quota exhausted',details:[{'@type':'type.googleapis.com/google.rpc.QuotaFailure',violations:[{quotaId:'GenerateRequestsPerDayPerProjectPerModel-FreeTier'}]}]}},'gemini-3.8-flash');
ok(e.kind==='quota_daily'&&!e.retryable,'per-day quota hard-stops instead of looping');
e=SC._classifyApiError(response(400),{error:{message:'Invalid request payload'}},'gemini-3.8-flash');
ok(e.kind==='request'&&e.scanFailure,'bad request is an actual failure');
ok(SC._parseDurationMs('1.5s')===1500&&SC._parseDurationMs('250ms')===250,'retry duration parser');
ok(JSON.stringify(SC.DOCUMENTED_MODELS)===JSON.stringify(['gemini-3.8-flash']),'Gemini 3.8 is the only scanner model');
ok(SC.REQUEST_TIMEOUT_MS===20000,'each Gemini request times out at 20 seconds');
ok(JSON.stringify(SC.REQUEST_RETRY_DELAYS_MS)===JSON.stringify([0,3000,8000]),'bounded retry delays are 0s/3s/8s');
for(const m of ['gemini-3.4-flash','gemini-3.5-flash','gemini-3.6-flash','gemini-3.7-flash'])ok(!SC.DOCUMENTED_MODELS.includes(m),`${m} fallback is absent`);
console.log(`PASS scanner bounded Gemini 3.8 tests: ${n} assertions`);
