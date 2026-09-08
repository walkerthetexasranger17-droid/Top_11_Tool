(() => {
  const TE=window.TE5=window.TE5||{};
  const D=TE.Data;
  if(!D) throw new Error('data.js must load before scanner-engine.js');

  const REF={panelW:1050,panelH:625};
  const ROW_Y=[297,341,385,429,473];
  const RECTS={
    name:{x:210,y:0,w:390,h:65}, roles:{x:585,y:112,w:270,h:68},
    ovr:{x:252,y:65,w:70,h:54}, age:{x:282,y:125,w:50,h:50},
    defTotal:{x:432,y:250,w:60,h:45}, attTotal:{x:705,y:250,w:57,h:45}, physTotal:{x:977,y:250,w:58,h:45},
    section:{x:245,y:245,w:320,h:55}
  };
  const COLS={def:{x:432,w:60},att:{x:705,w:57},phys:{x:977,w:58}};

  let templatePromise=null;
  function loadTemplates(){
    if(!templatePromise) templatePromise=fetch('./js/scanner-templates.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw new Error('Scanner digit templates failed to load');return r.json();});
    return templatePromise;
  }

  function imageFromUrl(url){return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(new Error('Could not load screenshot'));i.src=url;});}
  function luminance(r,g,b){return .299*r+.587*g+.114*b;}

  function detectPanelBounds(img){
    const c=document.createElement('canvas'); c.width=img.naturalWidth||img.width; c.height=img.naturalHeight||img.height;
    const ctx=c.getContext('2d',{willReadFrequently:true}); ctx.drawImage(img,0,0,c.width,c.height);
    const {data,width:w,height:h}=ctx.getImageData(0,0,c.width,c.height);
    const stride=Math.max(1,Math.floor(w/768));
    const yStart=Math.floor(h*.03),yEnd=Math.floor(h*.96);
    const scores=[];
    for(let x=0;x<w;x+=stride){
      let bright=0,total=0;
      for(let y=yStart;y<yEnd;y+=stride){const k=(y*w+x)*4; if(luminance(data[k],data[k+1],data[k+2])>100)bright++;total++;}
      scores.push({x,score:bright/Math.max(1,total)});
    }
    const runs=[]; let start=null,last=null;
    for(const s of scores){
      if(s.score>.55){if(start===null)start=s.x;last=s.x;}
      else if(start!==null){runs.push({x1:start,x2:last+stride,w:last+stride-start});start=null;}
    }
    if(start!==null)runs.push({x1:start,x2:last+stride,w:last+stride-start});
    runs.sort((a,b)=>b.w-a.w);
    let x1,x2;
    if(runs[0]&&runs[0].w>w*.45){const half=Math.floor(stride/2);x1=Math.max(0,runs[0].x1-half);x2=Math.min(w,runs[0].x2-half);}else{x1=Math.round(w*.158);x2=Math.round(w*.842);}

    // Header colour changes by tier, so brightness cannot reliably find its top edge.
    // Use vertical edge energy across the detected panel instead.
    const rowEnergy=new Float64Array(h-1);
    for(let y=0;y<h-1;y+=stride){
      let sum=0,n=0;
      for(let x=x1;x<x2;x+=stride){
        let k=(y*w+x)*4,k2=((y+1)*w+x)*4;
        sum+=Math.abs(luminance(data[k],data[k+1],data[k+2])-luminance(data[k2],data[k2+1],data[k2+2]));n++;
      }
      rowEnergy[y]=sum/Math.max(1,n);
    }
    let top=Math.round(h*.05),topScore=-1;
    for(let y=Math.floor(h*.015);y<Math.floor(h*.2);y++){if(rowEnergy[y]>topScore){topScore=rowEnergy[y];top=y+1;}}
    let bottom=Math.round(h*.95),bottomScore=-1;
    for(let y=Math.floor(h*.75);y<h-2;y++){if(rowEnergy[y]>bottomScore){bottomScore=rowEnergy[y];bottom=y+1;}}
    if(stride>1) bottom=Math.min(h,bottom+Math.floor(stride/2));
    if(bottom-top<h*.6){top=Math.round(h*.05);bottom=Math.round(h*.95);}
    return {x:x1,y:top,w:x2-x1,h:bottom-top,sourceW:w,sourceH:h};
  }

  function normalizePanel(img,bounds){
    const c=document.createElement('canvas');c.width=REF.panelW;c.height=REF.panelH;
    c.getContext('2d',{willReadFrequently:true}).drawImage(img,bounds.x,bounds.y,bounds.w,bounds.h,0,0,c.width,c.height);
    return c;
  }

  function cropData(ctx,rect){return ctx.getImageData(rect.x,rect.y,rect.w,rect.h);}
  function cropUrl(canvas,rect,scale=2){const c=document.createElement('canvas');c.width=rect.w*scale;c.height=rect.h*scale;c.getContext('2d').drawImage(canvas,rect.x,rect.y,rect.w,rect.h,0,0,c.width,c.height);return c.toDataURL('image/png');}

  function componentsFromImageData(imageData,{mode='dark',threshold=95,minArea=12,minHeight=12}={}){
    const {data,width:w,height:h}=imageData; const mask=new Uint8Array(w*h);
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const k=(y*w+x)*4,lum=luminance(data[k],data[k+1],data[k+2]);
      mask[y*w+x]=(mode==='dark'?lum<threshold:lum>threshold)?1:0;
    }
    const seen=new Uint8Array(w*h), comps=[]; const qx=new Int16Array(w*h),qy=new Int16Array(w*h);
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const idx=y*w+x;if(!mask[idx]||seen[idx])continue;
      let head=0,tail=0;qx[tail]=x;qy[tail]=y;tail++;seen[idx]=1;
      let minX=x,maxX=x,minY=y,maxY=y,area=0;
      while(head<tail){const cx=qx[head],cy=qy[head++];area++;if(cx<minX)minX=cx;if(cx>maxX)maxX=cx;if(cy<minY)minY=cy;if(cy>maxY)maxY=cy;
        for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=w||ny>=h)continue;const ni=ny*w+nx;if(mask[ni]&&!seen[ni]){seen[ni]=1;qx[tail]=nx;qy[tail]=ny;tail++;}}
      }
      const cw=maxX-minX+1,ch=maxY-minY+1;if(area>=minArea&&ch>=minHeight&&cw>=2)comps.push({x:minX,y:minY,w:cw,h:ch,area});
    }
    comps.sort((a,b)=>a.x-b.x);return {mask,width:w,height:h,components:comps};
  }

  function normalizeGlyph(seg,comp,targetW,targetH){
    const srcW=comp.w,srcH=comp.h;const scale=Math.min((targetW-2)/srcW,(targetH-2)/srcH);
    const nw=Math.max(1,Math.round(srcW*scale)),nh=Math.max(1,Math.round(srcH*scale));
    const out=new Uint8Array(targetW*targetH),x0=Math.floor((targetW-nw)/2),y0=Math.floor((targetH-nh)/2);
    for(let oy=0;oy<nh;oy++)for(let ox=0;ox<nw;ox++){
      const sx=comp.x+Math.min(srcW-1,Math.floor(ox/Math.max(scale,.001)));
      const sy=comp.y+Math.min(srcH-1,Math.floor(oy/Math.max(scale,.001)));
      if(seg.mask[sy*seg.width+sx])out[(y0+oy)*targetW+x0+ox]=1;
    }
    return out;
  }

  const hexCache=new Map();
  function hexBits(hex,count){
    const key=hex+':'+count;if(hexCache.has(key))return hexCache.get(key);
    const out=new Uint8Array(count);let at=0;
    for(let i=0;i<hex.length&&at<count;i+=2){const b=parseInt(hex.slice(i,i+2),16);for(let bit=7;bit>=0&&at<count;bit--)out[at++]=(b>>bit)&1;}
    hexCache.set(key,out);return out;
  }
  function hamming(a,b){let d=0;for(let i=0;i<a.length;i++)if(a[i]!==b[i])d++;return d/a.length;}

  function classifyGlyph(bits,kindTemplates){
    const byDigit=[];
    for(const [digit,list] of Object.entries(kindTemplates.digits)){
      let best=Infinity;
      for(const hex of list){best=Math.min(best,hamming(bits,hexBits(hex,bits.length)));}
      byDigit.push({digit,score:best});
    }
    byDigit.sort((a,b)=>a.score-b.score);
    return byDigit.slice(0,3);
  }

  function readNumber(ctx,rect,kind,templates,overrides={}){
    const spec=templates[kind];
    const opts=kind==='ovr'?{mode:'bright',threshold:templates.meta.ovrThreshold,minArea:30,minHeight:18}:
      kind==='age'?{mode:'dark',threshold:templates.meta.ageThreshold,minArea:20,minHeight:15}:
      {mode:'dark',threshold:templates.meta.skillThreshold,minArea:12,minHeight:12};
    if(Number.isFinite(Number(overrides.threshold)))opts.threshold=Number(overrides.threshold);
    const seg=componentsFromImageData(cropData(ctx,rect),opts);
    if(!seg.components.length||seg.components.length>3)return {value:null,confidence:0,candidates:[],components:seg.components.length};
    const digitChoices=seg.components.map(c=>classifyGlyph(normalizeGlyph(seg,c,spec.width,spec.height),spec));
    let combos=[{text:'',score:0}];
    for(const choices of digitChoices){
      const next=[];for(const combo of combos)for(const ch of choices.slice(0,2))next.push({text:combo.text+ch.digit,score:combo.score+ch.score});
      combos=next.sort((a,b)=>a.score-b.score).slice(0,12);
    }
    const candidates=[];const seen=new Set();
    for(const c of combos){const value=Number(c.text);if(!Number.isFinite(value)||seen.has(value))continue;seen.add(value);candidates.push({value,score:c.score/digitChoices.length});}
    candidates.sort((a,b)=>a.score-b.score);
    const best=candidates[0];const second=candidates[1];
    if(!best)return {value:null,confidence:0,candidates:[],components:seg.components.length};
    const margin=second?Math.max(0,second.score-best.score):.2;
    const confidence=Math.max(0,Math.min(1,(1-best.score/.24)*.72+Math.min(1,margin/.06)*.28));
    return {value:best.value,confidence,candidates,components:seg.components.length};
  }

  function rereadNumberCandidates(ctx,rect,kind,templates){
    const baseThreshold=kind==='ovr'?templates.meta.ovrThreshold:kind==='age'?templates.meta.ageThreshold:templates.meta.skillThreshold;
    const offsets=kind==='ovr'?[-28,-18,-10,0,10,18,28]:[-24,-14,-8,0,8,14,24];
    const reads=offsets.map(offset=>readNumber(ctx,rect,kind,templates,{threshold:baseThreshold+offset}));
    const byValue=new Map();
    for(const r of reads){
      const seenThisPass=new Set();
      for(const c of (r.candidates||[])){
        const value=Number(c.value);if(!Number.isFinite(value)||seenThisPass.has(value))continue;seenThisPass.add(value);
        const item=byValue.get(value)||{value,bestScore:Infinity,scoreTotal:0,scoreCount:0,votes:0,primaryVotes:0};
        item.bestScore=Math.min(item.bestScore,Number(c.score));item.scoreTotal+=Number(c.score);item.scoreCount++;item.votes++;
        if(value===r.value)item.primaryVotes++;
        byValue.set(value,item);
      }
    }
    const validReads=reads.filter(r=>r.value!=null).length;
    const candidates=[...byValue.values()].map(x=>({
      value:x.value,
      score:x.bestScore,
      avgScore:x.scoreCount?x.scoreTotal/x.scoreCount:x.bestScore,
      votes:x.votes,
      primaryVotes:x.primaryVotes,
      stability:validReads?x.primaryVotes/validReads:0
    })).sort((a,b)=>b.primaryVotes-a.primaryVotes||a.avgScore-b.avgScore||a.bestScore-b.bestScore).slice(0,12);
    const best=candidates[0];
    if(!best)return reads.find(r=>r.value!=null)||{value:null,confidence:0,candidates:[],components:0,stability:0};
    const second=candidates[1];const margin=second?Math.max(0,second.avgScore-best.avgScore):.2;
    const confidence=Math.max(0,Math.min(1,(1-best.avgScore/.24)*.58+Math.min(1,margin/.06)*.17+Math.min(1,best.stability)*.25));
    return {value:best.value,confidence,candidates,components:reads.find(r=>r.value===best.value)?.components||0,stability:best.stability};
  }

  function deepReadNumber(ctx,rect,kind,templates){
    const first=readNumber(ctx,rect,kind,templates);
    const multi=rereadNumberCandidates(ctx,rect,kind,templates);
    if(first.value==null)return multi;
    if(multi.value==null)return first;
    // A stable seven-threshold consensus is stronger than a one-pass read. If the
    // passes disagree without a strong consensus, keep the original value and lower
    // confidence rather than forcing a different digit.
    if(first.value===multi.value)return {...multi,confidence:Math.max(first.confidence,multi.confidence)};
    if((multi.stability||0)>=.57&&multi.confidence>=first.confidence-.08)return multi;
    return {...first,confidence:Math.min(first.confidence,.64),candidates:multi.candidates,stability:multi.stability||0};
  }

  function reconcileReadToTarget(read,target,tolerance=1.5){
    if(!read||target==null||!Number.isFinite(Number(target)))return {read,changed:false};
    const currentError=read.value==null?Infinity:Math.abs(Number(read.value)-Number(target));
    if(currentError<=tolerance)return {read,changed:false};
    const viable=(read.candidates||[]).filter(c=>Math.abs(Number(c.value)-Number(target))<=tolerance).sort((a,b)=>a.score-b.score);
    if(!viable.length)return {read,changed:false};
    const chosen=viable[0];
    // Only switch to a value actually produced by the digit recogniser. Never synthesize
    // a number merely to force the visible OVR and attribute average to agree.
    return {read:{...read,value:chosen.value,candidates:read.candidates},changed:chosen.value!==read.value};
  }

  function chooseGroup(reads,target){
    const original=reads.map(r=>r.value);
    if(target==null||!reads.length||original.some(v=>!Number.isFinite(Number(v))))return {values:original,repaired:false,error:null};
    const originalAvg=groupAverage(original),originalError=Math.abs(originalAvg-target);
    // Important: displayed group totals are rounded from hidden values. If the direct
    // digit reads already agree within the normal tolerance, do not mutate individual
    // attributes merely to make the rounded aggregate look closer.
    if(originalError<=1.25)return {values:original,repaired:false,error:originalError};
    let states=[{values:[],score:0,changes:0}];
    for(const r of reads){
      const confident=Number(r.confidence)>=.78&&r.value!=null;
      const opts=confident?[{value:r.value,score:0}]:(r.candidates&&r.candidates.length?r.candidates.slice(0,3):[{value:r.value,score:0}]);
      const next=[];
      for(const st of states)for(const o of opts)next.push({values:[...st.values,o.value],score:st.score+Number(o.score||0),changes:st.changes+(o.value===r.value?0:1)});
      states=next.sort((a,b)=>a.score-b.score||a.changes-b.changes).slice(0,96);
    }
    for(const st of states){const avg=groupAverage(st.values);st.aggregateError=Math.abs(avg-target);st.objective=st.aggregateError*2+st.score*.35+st.changes*.18;}
    states.sort((a,b)=>a.objective-b.objective);
    const best=states[0];
    // Only repair genuinely unresolved groups, and only when recognised alternatives
    // bring the aggregate inside tolerance. Otherwise surface the mismatch for review.
    if(!best||best.aggregateError>1.25||best.aggregateError>=originalError-.15)return {values:original,repaired:false,error:originalError};
    return {values:best.values,repaired:best.values.some((v,i)=>v!==original[i]),error:best.aggregateError};
  }

  let tesseractPromise=null;
  function ensureTesseract(){
    if(typeof Tesseract!=='undefined')return Promise.resolve(true);
    if(tesseractPromise)return tesseractPromise;
    tesseractPromise=new Promise(resolve=>{
      const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';s.async=true;
      s.onload=()=>resolve(typeof Tesseract!=='undefined');s.onerror=()=>resolve(false);document.head.appendChild(s);
    });
    return tesseractPromise;
  }
  async function ocrText(url,{whitelist='',psm='7'}={}){
    if(!(await ensureTesseract()))return {text:'',confidence:0};
    try{
      const config={tessedit_pageseg_mode:psm};if(whitelist)config.tessedit_char_whitelist=whitelist;
      const r=await Tesseract.recognize(url,'eng',{logger:()=>{},config});
      const conf=Number(r.data?.confidence||0)/100;
      return {text:String(r.data?.text||'').trim(),confidence:Math.max(0,Math.min(1,conf))};
    }catch(_){return {text:'',confidence:0};}
  }
  async function ocrNumber(url,min=0,max=520){
    const r=await ocrText(url,{whitelist:'0123456789',psm:'7'});const text=String(r.text||'').replace(/\D+/g,'');const value=text?Number(text):null;
    return {value:Number.isFinite(value)&&value>=min&&value<=max?value:null,confidence:r.confidence};
  }
  function cleanName(text){
    return String(text||'').replace(/[\r\n]+/g,' ').replace(/[^A-Za-zÀ-ž'’\- ]+/g,' ').replace(/\s+/g,' ').trim();
  }
  function parseRoles(text){
    const raw=String(text||'').toUpperCase();
    let matches=raw.match(/\b(?:DML|DMC|DMR|AML|AMC|AMR|GK|DL|DC|DR|ML|MC|MR|ST)\b/g)||[];
    if(!matches.length){
      const compact=raw.replace(/ROLES?/g,'').replace(/[^A-Z]/g,'');
      matches=compact.match(/(?:DML|DMC|DMR|AML|AMC|AMR|GK|DL|DC|DR|ML|MC|MR|ST)/g)||[];
    }
    return [...new Set(matches)].slice(0,3);
  }

  function groupAverage(vals){return vals.reduce((a,b)=>a+Number(b||0),0)/Math.max(1,vals.length);}
  function checkAggregate(vals,total){if(total==null)return {ok:false,error:null,average:groupAverage(vals)};const avg=groupAverage(vals),error=Math.abs(avg-total);return {ok:error<=1.25,error,average:avg};}

  async function scan(dataUrl,onProgress=()=>{}){
    const templates=await loadTemplates();onProgress({step:'load',progress:.06,label:'Loading screenshot'});
    const img=await imageFromUrl(dataUrl);const bounds=detectPanelBounds(img);const panel=normalizePanel(img,bounds);const ctx=panel.getContext('2d',{willReadFrequently:true});
    onProgress({step:'align',progress:.18,label:'Player panel aligned'});

    // Deliberately spend a little more local CPU time on the numeric grid. Every
    // number is read across multiple thresholds before reconciliation; this is still
    // fully on-device and avoids returning a fast but fragile single-pass result.
    onProgress({step:'numbers',progress:.28,label:'Deep-reading numerical values'});
    const ovr=deepReadNumber(ctx,RECTS.ovr,'ovr',templates);const age=deepReadNumber(ctx,RECTS.age,'age',templates);
    const columns={};
    for(const [key,col] of Object.entries(COLS)) columns[key]=ROW_Y.map(y=>deepReadNumber(ctx,{x:col.x,y,w:col.w,h:45},'skill',templates));
    const totals={def:deepReadNumber(ctx,RECTS.defTotal,'skill',templates),att:deepReadNumber(ctx,RECTS.attTotal,'skill',templates),phys:deepReadNumber(ctx,RECTS.physTotal,'skill',templates)};
    // GK is also identifiable structurally: the combined GOALKEEPING heading has no
    // separate Defence total in the left header slot, while its combined total sits
    // in the middle slot. This keeps GK numeric parsing working even if text OCR is offline.
    const numericGk=totals.def.value==null&&totals.att.value!=null;
    onProgress({step:'skills',progress:.64,label:'Numeric passes compared'});
    const [nameOcr,roleOcr,sectionOcr]=await Promise.all([
      ocrText(cropUrl(panel,RECTS.name,2),{psm:'7'}),
      ocrText(cropUrl(panel,RECTS.roles,3),{whitelist:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',psm:'11'}),
      ocrText(cropUrl(panel,RECTS.section,2),{whitelist:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',psm:'7'})
    ]);
    let roles=parseRoles(roleOcr.text);const gk=numericGk||roles.includes('GK')||/GOAL/.test(sectionOcr.text.toUpperCase());if(gk&&!roles.includes('GK'))roles=['GK'];
    onProgress({step:'header',progress:.82,label:'Header and role read'});

    let skills={},checks={},repairNotes=[];
    if(gk){
      const gkReads=[...columns.def,...columns.att];
      const gkTotal=totals.att.value;
      const repairedGK=chooseGroup(gkReads,gkTotal);const repairedPhys=chooseGroup(columns.phys,totals.phys.value);
      const names=[...D.GK_SKILLS];repairedGK.values.forEach((v,i)=>skills[names[i]]=v);D.GK_PHYSICAL.forEach((s,i)=>skills[s]=repairedPhys.values[i]);
      if(repairedGK.repaired)repairNotes.push('Goalkeeping values cross-checked against the displayed total');if(repairedPhys.repaired)repairNotes.push('Physical values cross-checked against the displayed total');
      checks.goalkeeping=checkAggregate(repairedGK.values,gkTotal);checks.physical=checkAggregate(repairedPhys.values,totals.phys.value);
    }else{
      const rd=chooseGroup(columns.def,totals.def.value),ra=chooseGroup(columns.att,totals.att.value),rp=chooseGroup(columns.phys,totals.phys.value);
      D.GROUPS_OUTFIELD.Defence.forEach((s,i)=>skills[s]=rd.values[i]);D.GROUPS_OUTFIELD.Attack.forEach((s,i)=>skills[s]=ra.values[i]);D.GROUPS_OUTFIELD.Physical.forEach((s,i)=>skills[s]=rp.values[i]);
      if(rd.repaired)repairNotes.push('Defence values cross-checked against the displayed total');if(ra.repaired)repairNotes.push('Attack values cross-checked against the displayed total');if(rp.repaired)repairNotes.push('Physical values cross-checked against the displayed total');
      checks.defence=checkAggregate(rd.values,totals.def.value);checks.attack=checkAggregate(ra.values,totals.att.value);checks.physical=checkAggregate(rp.values,totals.phys.value);
    }
    const skillValues=Object.values(skills).filter(v=>Number.isFinite(v));const overallAvg=groupAverage(skillValues);
    let finalOvr=ovr;
    if(ovr.value==null||Math.abs(overallAvg-ovr.value)>1.5){
      const expandedOvr=rereadNumberCandidates(ctx,RECTS.ovr,'ovr',templates);
      const reconciled=reconcileReadToTarget(expandedOvr,overallAvg,1.5);
      if(reconciled.changed){
        finalOvr=reconciled.read;
        repairNotes.push(`OVR multi-pass re-read resolved ${ovr.value??'—'} → ${finalOvr.value} using recognised digit candidates`);
      }else if(expandedOvr.value!=null){
        finalOvr=ovr.value==null?expandedOvr:ovr;
      }
      if(finalOvr.value==null||Math.abs(overallAvg-finalOvr.value)>1.5){
        onProgress({step:'ovr-retry',progress:.90,label:'Double-checking OVR'});
        const ocrOvr=await ocrNumber(cropUrl(panel,RECTS.ovr,5),1,520);
        if(ocrOvr.value!=null&&Math.abs(overallAvg-ocrOvr.value)<=1.5){
          repairNotes.push(`OVR secondary local OCR resolved ${finalOvr.value??'—'} → ${ocrOvr.value}`);
          finalOvr={...finalOvr,value:ocrOvr.value,confidence:Math.max(finalOvr.confidence||0,ocrOvr.confidence||0)};
        }
      }
    }
    checks.ovr={average:overallAvg,error:finalOvr.value==null?null:Math.abs(overallAvg-finalOvr.value),ok:finalOvr.value!=null&&Math.abs(overallAvg-finalOvr.value)<=1.5};
    const numericReads=[finalOvr,age,...columns.def,...columns.att,...columns.phys];const numericConf=numericReads.filter(r=>r.value!=null).reduce((a,r)=>a+r.confidence,0)/Math.max(1,numericReads.filter(r=>r.value!=null).length);
    const checksList=Object.values(checks);const verifiedRatio=checksList.filter(c=>c.ok).length/Math.max(1,checksList.length);
    const overallConfidence=Math.max(0,Math.min(1,numericConf*.70+verifiedRatio*.22+(roles.length?.05:0)+(nameOcr.text?.03:0)));
    const unresolvedChecks=Object.entries(checks).filter(([,c])=>!c.ok).map(([name,c])=>({name,error:c.error,average:c.average}));
    onProgress({step:'verify',progress:1,label:'Scan verified'});
    return {
      name:cleanName(nameOcr.text),age:age.value,ovr:finalOvr.value,roles,position:roles[0]||'',skills,
      confidence:{overall:overallConfidence,numeric:numericConf,name:nameOcr.confidence,roles:roles.length?Math.max(.75,roleOcr.confidence):0},
      checks,repairNotes,validation:{resolved:unresolvedChecks.length===0,unresolvedChecks},panelBounds:bounds,layout:gk?'gk':'outfield',raw:{roleText:roleOcr.text,sectionText:sectionOcr.text,initialOvr:ovr.value,totals:{def:totals.def.value,att:totals.att.value,phys:totals.phys.value}}
    };
  }

  TE.Scanner={loadTemplates,ensureTesseract,detectPanelBounds,scan,readNumber,rereadNumberCandidates,deepReadNumber,reconcileReadToTarget,checkAggregate,chooseGroup,RECTS,COLS,ROW_Y};
})();
