const fs=require('fs'),path=require('path'),vm=require('vm');
const ROOT=path.resolve(__dirname,'..');global.window=global;global.localStorage={getItem(){return null},setItem(){},removeItem(){}};global.fetch=async()=>({ok:true,json:async()=>({models:[{name:'models/gemini-3.6-flash',supportedGenerationMethods:['generateContent']}]})});
for(const f of ['optimizer-data.js','bible-data.js','data.js','scanner-engine.js'])vm.runInThisContext(fs.readFileSync(path.join(ROOT,'js',f),'utf8'),{filename:f});
const SC=global.TE5.Scanner;let n=0;function ok(v,m){if(!v)throw new Error(m);n++;}function response(status,headers={}){return{status,headers:{get:k=>headers[k]||null}};}
let e=SC._classifyApiError(response(503),{error:{message:'Model overloaded. Please try again later.'}},'gemini-3.6-flash');ok(e.retryable&&e.kind==='temporary','503 is retryable');
e=SC._classifyApiError(response(429),{error:{message:'Quota exceeded. Please retry in 17s.',details:[{'@type':'type.googleapis.com/google.rpc.RetryInfo',retryDelay:'17s'},{'@type':'type.googleapis.com/google.rpc.QuotaFailure',violations:[{quotaId:'GenerateRequestsPerMinutePerProjectPerModel-FreeTier'}]}]}},'gemini-3.6-flash');ok(e.retryable&&e.kind==='rate_limit'&&e.retryAfterMs>=17000,'per-minute quota retries');
e=SC._classifyApiError(response(429),{error:{message:'Daily quota exhausted',details:[{'@type':'type.googleapis.com/google.rpc.QuotaFailure',violations:[{quotaId:'GenerateRequestsPerDayPerProjectPerModel-FreeTier'}]}]}},'gemini-3.6-flash');ok(!e.retryable&&e.kind==='quota_daily','daily quota stops');
ok(JSON.stringify(SC.DOCUMENTED_MODELS)===JSON.stringify(['gemini-3.6-flash']),'Gemini 3.6 is the only scanner model');
ok(SC._buildPrompt().includes('DO NOT analyse, identify, locate or return playstyles'),'playstyle recognition removed');
ok(SC._buildPrompt().includes('DO NOT analyse, identify, locate or return special abilities'),'ability recognition removed');
console.log(`PASS scanner simplified retry contract: ${n} assertions`);
