(() => {
  const TE=window.TE5=window.TE5||{};const D=TE.Data,CFG=TE.StrategyData;
  if(!D||!CFG)throw new Error('data.js and strategy-data.js must load before strategy-logic.js');
  const MODEL_VERSION='companion-strategy-v2-own-squad-runtime-v0515';
  const EVIDENCE='TOP ELEVEN TOOL CALCULATION';
  const TIER_WEIGHT={...CFG.training.tier_weights};
  const ROLE_TIERS=CFG.training.role_profiles;
  const PLAYSTYLE_TIERS=CFG.training.playstyle_role_profiles;
  const TARGET_SHAPE=CFG.training.target_shape||{};
  const TARGET_RATIOS={S:1.18,A:1.05,B:.92,C:.85,...(TARGET_SHAPE.tier_target_ratios||{})};
  const SECONDARY_TARGET_RATIO=Number(TARGET_SHAPE.secondary_role_only_ratio??.82);

  function tierFor(profile,attr){for(const tier of ['S','A','B','C'])if((profile?.[tier]||[]).includes(attr))return tier;return'C';}
  function normaliseRoles(player,roles){const raw=Array.isArray(roles)?roles:(Array.isArray(player?.roles)?player.roles:[player?.position]);return[...new Set(raw.map(D.normaliseRole).filter(Boolean))];}
  function playstyleName(player){const p=D.playstyleDefinition(player?.playstyle||player?.playstyleType);return p?.name&&p.name!=='No Playstyle'?p.name:null;}
  function playstyleLevelId(player){
    const raw=player?.playstyle;if(!raw||typeof raw!=='object')return null;
    if(raw.level==null||String(raw.level).trim()==='')return null;
    const numeric=Number(raw.level);if(Number.isFinite(numeric))return numeric;
    const key=String(raw.level).trim().replace(/[_-]+/g,' ').toLowerCase();
    const row=(D.PLAYSTYLE_LEVELS||[]).find(x=>String(x?.name||'').trim().toLowerCase()===key);
    return row?Number(row.id):null;
  }
  function playstyleActive(player){const name=playstyleName(player);if(!name)return false;const raw=player?.playstyle;if(!raw||typeof raw!=='object')return true;const level=playstyleLevelId(player);return level==null?true:level>=2;}
  function developmentRoleFor(player,roles,requested=null){const resolved=normaliseRoles(player,roles),req=D.normaliseRole(requested);if(req&&resolved.includes(req))return req;const primary=D.normaliseRole(player?.position);if(primary&&resolved.includes(primary))return primary;const ps=playstyleName(player),roleMap=CFG.training.playstyle_role_profiles?.[ps]||{};const psRole=resolved.find(r=>roleMap[r]);return psRole||resolved[0]||'';}
  function abilityNames(player){const arr=Array.isArray(player?.specialAbilities)?player.specialAbilities:(player?.specialAbility?[player.specialAbility]:[]);return new Set(arr.map(D.canonicalSpecialAbilityName).filter(Boolean));}
  function tacticValues(tactics){return tactics?.values||tactics||{};}
  function inList(v,raw){return raw.split(',').map(x=>x.trim()).includes(String(v));}
  function simpleClause(clause,v){const s=clause.trim();let m=s.match(/^(\w+)\s*==\s*(\w+)$/);if(m)return String(v[m[1]])===m[2];m=s.match(/^(\w+)\s+in\s+\[([^\]]+)\]$/);if(m)return inList(v[m[1]],m[2]);return false;}
  function tacticConditionMatches(expr,v){if(!expr)return false;return String(expr).split('&&').every(x=>simpleClause(x,v));}
  function tacticTrainingSignals(role,attr,tactics){const v=tacticValues(tactics),signals=[];let rawAdd=0;for(const rule of CFG.training.tactic_modifiers||[]){if(!(rule.roles||[]).includes(role))continue;if(!(rule.skills||[]).includes(attr))continue;if(tacticConditionMatches(rule.when,v)){rawAdd+=Number(rule.multiplier_add)||0;signals.push(rule.id);}}const cap=Number(CFG.training.context_caps?.max_tactic_multiplier_add??.20),add=Math.min(cap,Math.max(0,rawAdd));return{add,rawAdd,cap,capped:rawAdd>add+1e-12,signals};}
  function abilityTrainingSignals(player,attr){const abilities=abilityNames(player),signals=[];let rawAdd=0;for(const [name,row] of Object.entries(CFG.training.special_ability_modifiers||{})){if(!row.active||!abilities.has(name)||!(row.skills||[]).includes(attr))continue;rawAdd+=Number(row.multiplier_add)||0;signals.push(name);}const cap=Number(CFG.training.context_caps?.max_special_ability_multiplier_add??.08),add=Math.min(cap,Math.max(0,rawAdd));return{add,rawAdd,cap,capped:rawAdd>add+1e-12,signals};}
  function profileFor(player,developmentRole){const ps=playstyleName(player),roleBase=ROLE_TIERS[developmentRole]||{S:[],A:[],B:[],C:[]};if(!ps||!playstyleActive(player))return{profile:roleBase,playstyle:null,source:'role'};const p=PLAYSTYLE_TIERS?.[ps]?.[developmentRole];return p?{profile:p,playstyle:ps,source:'playstyle-role'}:{profile:roleBase,playstyle:ps,source:'role-fallback'};}
  function trainingPriorityProfile(player,{roles=null,tactics=null,developmentRole=null}={}){
    const resolved=normaliseRoles(player,roles),white=D.whiteSkillsForRoles(resolved),requestedDevelopmentRole=D.normaliseRole(developmentRole),devRole=developmentRoleFor(player,resolved,developmentRole),developmentRoleFallbackReason=requestedDevelopmentRole&&requestedDevelopmentRole!==devRole?'assigned-role-not-natural':null,selected=profileFor(player,devRole),rows=[];
    for(const attr of white){
      const inPrimary=(selected.profile?.S||[]).includes(attr)||(selected.profile?.A||[]).includes(attr)||(selected.profile?.B||[]).includes(attr)||(selected.profile?.C||[]).includes(attr);
      const tier=inPrimary?tierFor(selected.profile,attr):'C';
      let weight=Number(TIER_WEIGHT[tier]||1);
      // Secondary-role white skills remain trainable but do not silently replace the selected development-role hierarchy.
      const secondaryOnly=!inPrimary;
      if(secondaryOnly)weight=Number(TIER_WEIGHT.C||1);
      const targetRatio=secondaryOnly?SECONDARY_TARGET_RATIO:Number(TARGET_RATIOS[tier]||1);
      const tact=tacticTrainingSignals(devRole,attr,tactics),sa=abilityTrainingSignals(player,attr),contextMultiplier=1+tact.add+sa.add;
      weight*=contextMultiplier;
      rows.push({attribute:attr,tier,baseTier:tier,playstyleTier:selected.source==='playstyle-role'?tier:null,weight,baseWeight:Number(TIER_WEIGHT[tier]||1),targetRatio,contextMultiplier,tacticSignals:tact.signals,specialAbilitySignals:sa.signals,secondaryRoleOnly:secondaryOnly,developmentRole:devRole,profileSource:selected.source});
    }
    rows.sort((a,b)=>b.weight-a.weight||a.secondaryRoleOnly-b.secondaryRoleOnly||a.attribute.localeCompare(b.attribute));
    return{model:MODEL_VERSION,evidence:EVIDENCE,roles:resolved,requestedDevelopmentRole:requestedDevelopmentRole||null,developmentRole:devRole,developmentRoleFallbackReason,playstyle:selected.playstyle,playstyleActive:!!selected.playstyle&&playstyleActive(player),profileSource:selected.source,whiteAttributes:white,targetShape:{tierRatios:{...TARGET_RATIOS},secondaryRoleOnlyRatio:SECONDARY_TARGET_RATIO,provenance:TARGET_SHAPE.provenance||'Top Eleven Tool companion target-shape model'},priorities:rows};
  }

  function roleCountsFromSlots(slots=[]){const counts=Object.fromEntries(D.ALL_POSITIONS.map(r=>[r,0]));for(const raw of slots){const opts=String(raw).split('|').map(D.normaliseRole).filter(Boolean);for(const r of opts)counts[r]++;}return counts;}
  function analyseShape(slots=[]){
    const counts=roleCountsFromSlots(slots),centralMid=(counts.DMC||0)+(counts.MC||0)+(counts.AMC||0),centralSupport=(counts.DMC||0)+(counts.MC||0),wideMid=(counts.ML||0)+(counts.MR||0)+(counts.AML||0)+(counts.AMR||0),wideDef=(counts.DL||0)+(counts.DR||0),centralDef=counts.DC||0,strikers=counts.ST||0;
    const hasLeftProgression=(counts.AML||0)+(counts.ML||0)>0,hasRightProgression=(counts.AMR||0)+(counts.MR||0)>0;
    return{counts,centralMid,centralSupport,wideMid,centralDef,wideDef,strikers,advancedScorers:strikers+(counts.AMC||0)+(counts.AML||0)+(counts.AMR||0),restDefense:centralDef+wideDef+(counts.DMC||0),hasDMC:(counts.DMC||0)>0,hasAMC:(counts.AMC||0)>0,hasLeftDef:(counts.DL||0)>0,hasRightDef:(counts.DR||0)>0,hasLeftProgression,hasRightProgression,leftThreat:hasLeftProgression,rightThreat:hasRightProgression,narrow:wideMid===0,centralHeavy:centralMid>=3};
  }
  function startersShape(starters=[]){return analyseShape(starters.map(s=>s.assignedRole));}
  function mean(vals){const a=vals.filter(Number.isFinite);return a.length?a.reduce((x,y)=>x+y,0)/a.length:0;}
  function median(vals){const a=vals.filter(Number.isFinite).sort((x,y)=>x-y);if(!a.length)return 0;const m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2;}
  function percentile(vals,p=.67){const a=vals.filter(Number.isFinite).sort((x,y)=>x-y);if(!a.length)return 0;if(a.length===1)return a[0];const i=(a.length-1)*p,lo=Math.floor(i),hi=Math.ceil(i),f=i-lo;return a[lo]*(1-f)+a[hi]*f;}
  function alias(name){return String(name||'').replace(/[^A-Za-z0-9]/g,'');}
  function skillMean(starter,skills){const vals=(skills||[]).map(k=>D.skillValue(starter?.player?.skills,k)).filter(v=>v!==null);return vals.length?mean(vals):null;}
  function assignedRoleMean(starter){return skillMean(starter,D.POSITION_WHITE[starter?.assignedRole]||[]);}
  function eligible(starters,roles){return starters.filter(s=>(roles||[]).includes(s.assignedRole));}
  function band(value,base,margin=5){if(!Number.isFinite(value)||!Number.isFinite(base))return'medium';return value<base-margin?'low':value>base+margin?'high':'medium';}
  function activeEligiblePlaystyleName(starter){if(!playstyleActive(starter?.player))return null;const def=D.playstyleDefinition(starter?.player?.playstyle||starter?.player?.playstyleType),role=D.normaliseRole(starter?.assignedRole);if(!def?.name||!role||!(def.roles||[]).includes(role))return null;return def.name;}
  function activePlaystyleCounts(starters){const out={};for(const s of starters){const name=activeEligiblePlaystyleName(s);if(!name)continue;out[alias(name)]=(out[alias(name)]||0)+1;}return out;}
  function activeAbilityCounts(starters){const out={};for(const s of starters)for(const n of abilityNames(s.player)){const k=alias(n);out[k]=(out[k]||0)+1;}return out;}
  function clusterRows(starters,roles,skills){return eligible(starters,roles).map(s=>({starter:s,value:skillMean(s,skills)})).filter(x=>Number.isFinite(x.value));}
  function strongRows(rows,xiMedian){if(!rows.length)return[];const threshold=rows.length<3?xiMedian-10:percentile(rows.map(x=>x.value),.67);return rows.filter(x=>x.value>=threshold&&x.value>=xiMedian-10);}
  function speedAtLeast(starter,floor){const v=D.skillValue(starter?.player?.skills,'Speed');return v!==null&&v>=floor;}
  function ownFeatures(starters=[],values=null){
    const shape=startersShape(starters),roleMeans=starters.map(assignedRoleMean).filter(Number.isFinite),xiMedian=median(roleMeans),margin=Number(CFG.feature_model?.skill_reference?.comparison_margin_points)||5,playstyles=activePlaystyleCounts(starters),abilities=activeAbilityCounts(starters);
    const aerialRows=clusterRows(starters,['ST','AMC'],['Heading','Strength','Positioning']),aerialCredible=strongRows(aerialRows,xiMedian),targetManCredible=!!playstyles.TargetMan&&aerialCredible.length>0,aerialOutlet=targetManCredible||aerialCredible.length>0,aerialOutletStrong=targetManCredible||aerialRows.some(x=>x.value>xiMedian+margin);
    const transitionRows=clusterRows(starters,['ST','AMC','AML','AMR'],['Speed','Dribbling','Passing','Finishing','Positioning']),transitionCredible=strongRows(transitionRows,xiMedian);
    const semanticRunner=eligible(starters,['ST','AMC','AML','AMR']).some(s=>{const n=activeEligiblePlaystyleName(s);return['Poacher','Inside Forward'].includes(n)&&speedAtLeast(s,xiMedian-10);});
    const counterOutlet=transitionCredible.length>0||semanticRunner,counterOutletStrong=semanticRunner||transitionRows.some(x=>x.value>xiMedian+margin);
    const stDirectRows=clusterRows(starters,['ST'],['Strength','Positioning','Heading']),stDirectCredible=strongRows(stDirectRows,xiMedian).length>0,stDirectStrong=stDirectRows.some(x=>x.value>xiMedian+margin),directOutlet=aerialOutlet||stDirectCredible||counterOutlet,directOutletStrong=aerialOutletStrong||stDirectStrong||counterOutletStrong;
    const technicalRows=clusterRows(starters,['DMC','MC','AMC','ML','MR','AML','AMR'],['Passing','Creativity','Dribbling']),technicalBuildValue=mean(technicalRows.map(x=>x.value));
    const pressRows=clusterRows(starters,['DL','DC','DR','DMC','ML','MC','MR','AML','AMC','AMR','ST'],['Fitness','Aggression','Tackling','Bravery','Speed']),pressValue=mean(pressRows.map(x=>x.value));
    const lineRows=clusterRows(starters,['DL','DC','DR','DMC'],['Speed','Positioning','Bravery']),lineValue=mean(lineRows.map(x=>x.value));
    const markerRows=clusterRows(starters,['DL','DC','DR','DMC'],['Marking','Speed','Strength','Positioning']),markerValue=mean(markerRows.map(x=>x.value));
    const finishRows=clusterRows(starters,['ST','AMC','AML','AMR'],['Shooting','Finishing','Positioning','Dribbling']).map(x=>x.value).sort((a,b)=>b-a),longRows=clusterRows(starters,['ST','AMC','AML','AMR','MC'],['Shooting','Creativity']).map(x=>x.value).sort((a,b)=>b-a);
    const boxFinishing=mean(finishRows.slice(0,2)),longShotThreat=mean(longRows.slice(0,2));
    const advanced=eligible(starters,['AMC','AML','AMR','ST']),dribbleReliance=advanced.filter(s=>{const dr=D.skillValue(s.player?.skills,'Dribbling'),rm=assignedRoleMean(s),n=activeEligiblePlaystyleName(s);return dr!==null&&Number.isFinite(rm)&&dr>=rm||['False Nine','Enganche','Inside Forward'].includes(n);}).length>=2;
    const directValues=[...aerialRows.map(x=>x.value),...transitionRows.map(x=>x.value)].filter(Number.isFinite).sort((a,b)=>b-a),directSupport=mean(directValues.slice(0,2));
    const attackUnitQuality=mean(eligible(starters,['AML','AMC','AMR','ST']).map(assignedRoleMean)),defenseUnitQuality=mean(eligible(starters,['GK','DL','DC','DR','DMC']).map(assignedRoleMean)),attackDefenseDelta=attackUnitQuality-defenseUnitQuality;
    const v=values||{},defensiveActionDemand=['defending','hardDefending'].includes(v.mentality)||(v.pressing==='high'&&v.lost==='counterPress')?'high':(v.pressing==='mid'||v.tackling==='aggressive')?'medium':'low';
    return{...shape,xiQualityMedian:xiMedian,aerialOutlet,aerialOutletStrong,counterOutlet,counterOutletStrong,directOutlet,directOutletStrong,technicalBuildValue,technicalBuild:band(technicalBuildValue,xiMedian,margin),pressCapacity:band(pressValue,xiMedian,margin),lineSpeed:band(lineValue,xiMedian,margin),markerCapacity:band(markerValue,xiMedian,margin),boxFinishing,longShotThreat,dribbleReliance,defensiveActionDemand,directSupport,attackUnitQuality,defenseUnitQuality,attackDefenseDelta,playstyles,abilities,margin};
  }

  // Small deterministic expression parser for the v2 rule catalogue. It deliberately avoids eval/new Function.
  const TOKEN_CACHE=new Map();
  function tokenize(expr){
    const key=String(expr);if(TOKEN_CACHE.has(key))return TOKEN_CACHE.get(key);const out=[],re=/\s*(>=|<=|==|!=|&&|\|\||\bin\b|[()!\[\],+\-><]|\d+(?:\.\d+)?|[A-Za-z_][A-Za-z0-9_.-]*)/gy;let i=0;
    while(i<key.length){re.lastIndex=i;const m=re.exec(key);if(!m)throw new Error(`Unsupported rule token near: ${key.slice(i,i+24)}`);out.push(m[1]);i=re.lastIndex;}TOKEN_CACHE.set(key,out);return out;
  }
  function resolveIdentifier(name,ctx){if(name==='true')return true;if(name==='false')return false;const parts=name.split('.');let cur=ctx;for(const p of parts){if(cur==null||!Object.prototype.hasOwnProperty.call(cur,p)){if(parts[0]==='playstyles'||parts[0]==='abilities')return 0;return name;}cur=cur[p];}return cur;}
  function comparable(v){const rank={low:0,medium:1,high:2};return typeof v==='string'&&Object.prototype.hasOwnProperty.call(rank,v)?rank[v]:v;}
  function eqVal(a,b){return comparable(a)===comparable(b);}
  function parseExpression(expr,ctx={}){
    const toks=tokenize(expr),st={i:0};const peek=()=>toks[st.i],take=()=>toks[st.i++];
    function primary(){const t=take();if(t==='('){const v=or();if(take()!==')')throw new Error('Missing )');return v;}if(t==='['){const a=[];while(peek()!==']'){a.push(or());if(peek()===',')take();else break;}if(take()!==']')throw new Error('Missing ]');return a;}if(/^\d/.test(t))return Number(t);if(t==='abs'){if(take()!=='(')throw new Error('abs(');const v=or();if(take()!==')')throw new Error('abs )');return Math.abs(Number(v)||0);}return resolveIdentifier(t,ctx);}
    function unary(){if(peek()==='!'){take();return !unary();}if(peek()==='-'){take();return -Number(unary());}return primary();}
    function add(){let v=unary();while(peek()==='+'||peek()==='-'){const op=take(),r=unary();v=op==='+'?Number(v)+Number(r):Number(v)-Number(r);}return v;}
    function cmp(){let v=add(),op=peek();if(!['==','!=','>=','<=','>','<','in'].includes(op))return v;take();const r=add();if(op==='in')return Array.isArray(r)&&r.some(x=>eqVal(v,x));const a=comparable(v),b=comparable(r);if(op==='==')return eqVal(v,r);if(op==='!=')return !eqVal(v,r);if(op==='>=')return a>=b;if(op==='<=')return a<=b;if(op==='>')return a>b;return a<b;}
    function and(){let v=cmp();while(peek()==='&&'){take();const r=cmp();v=!!v&&!!r;}return v;}
    function or(){let v=and();while(peek()==='||'){take();const r=and();v=!!v||!!r;}return v;}
    const value=or();if(st.i!==toks.length)throw new Error(`Unexpected rule token ${peek()}`);return value;
  }
  function conditionMatches(expr,ctx){if(expr==null||expr==='')return true;return !!parseExpression(String(expr),ctx);}
  function pathValue(path,ctx){return resolveIdentifier(String(path),ctx);}
  function rulePoints(rule,ctx){
    if(rule.kind==='scaled'){const v=pathValue(rule.feature,ctx),table=rule.table||{};if(Object.prototype.hasOwnProperty.call(table,String(v)))return Number(table[String(v)])||0;const nums=Object.keys(table).map(Number).filter(Number.isFinite).sort((a,b)=>a-b);if(!nums.length)return 0;let key=nums[0];for(const n of nums)if(Number(v)>=n)key=n;return Number(table[String(key)])||0;}
    if(rule.kind==='banded'){const v=Number(pathValue(rule.feature,ctx));for(const b of rule.bands||[]){if((b.min==null||v>=b.min)&&(b.max==null||v<=b.max))return Number(b.points)||0;}return 0;}
    return Number(rule.points)||0;
  }
  function ruleMessage(rule){return TE.StrategyStrings?.[rule.message]||rule.message||rule.id;}
  function evaluateRules(rules=[],ctx={},filter=null){const contributions=[];let score=0;for(const rule of rules){if(filter&&!filter(rule))continue;let matched=false;try{matched=rule.kind==='scaled'||rule.kind==='banded'?true:conditionMatches(rule.when,ctx);}catch(error){contributions.push({id:rule.id,points:0,matched:false,error:error.message,message:ruleMessage(rule),bucket:rule.bucket||rule.scope||'general'});continue;}if(!matched)continue;const points=rulePoints(rule,ctx);score+=points;contributions.push({id:rule.id,points,matched:true,message:ruleMessage(rule),bucket:rule.bucket||rule.scope||'general'});}return{score,contributions};}
  function contextualOwn(baseOwn,values=null){const v=values||{},defensiveActionDemand=['defending','hardDefending'].includes(v.mentality)||(v.pressing==='high'&&v.lost==='counterPress')?'high':(v.pressing==='mid'||v.tackling==='aggressive')?'medium':'low';return{...baseOwn,defensiveActionDemand};}
  function buildContext(starters,values=null,baseOwn=null){const own=contextualOwn(baseOwn||ownFeatures(starters),values);return{own,values:values||{},playstyles:own.playstyles,abilities:own.abilities,margin:own.margin};}
  function scoreFormationStructure(starters=[]){const context=buildContext(starters),ev=evaluateRules(CFG.formation.rules||[],context);return{score:ev.score,reasons:ev.contributions.map(x=>({points:x.points,reason:x.message,id:x.id})),own:context.own,contributions:ev.contributions};}
  function activePlaystylePlacements(starters=[],name){
    const wanted=alias(name),rows=[];
    for(const s of starters){
      if(!playstyleActive(s.player))continue;
      const def=D.playstyleDefinition(s.player?.playstyle||s.player?.playstyleType),role=D.normaliseRole(s?.assignedRole);
      if(!def?.name||alias(def.name)!==wanted||!role||!(def.roles||[]).includes(role))continue;
      rows.push({starter:s,role});
    }
    return rows;
  }
  function directionalFocusOptions(name,starters=[]){
    if(!['Winger','Wing Back'].includes(name))return null;
    const placements=activePlaystylePlacements(starters,name),allowed=new Set();
    for(const {role} of placements){
      if(['DL','ML','AML'].includes(role)){allowed.add('left');allowed.add('both');}
      if(['DR','MR','AMR'].includes(role)){allowed.add('right');allowed.add('both');}
    }
    return allowed.size?allowed:null;
  }
  function explicitIdentityAffinityCoverage(){
    const out=new Set();
    for(const rule of CFG.tactics.rules||[]){
      if((Number(rule?.points)||0)<=0||!rule?.dimension||!rule?.option)continue;
      const branches=String(rule?.when||'').split('||').map(x=>x.trim().replace(/^\(+|\)+$/g,'').trim()).filter(Boolean);
      if(!branches.length)continue;
      const refs=[];let identityOnly=true;
      for(const branch of branches){
        const m=branch.match(/^(playstyles|abilities)\.([A-Za-z0-9]+)\s*>\s*0$/);
        if(!m){identityOnly=false;break;}
        refs.push({kind:m[1]==='playstyles'?'PS':'SA',name:m[2]});
      }
      if(!identityOnly)continue;
      for(const ref of refs)out.add(`${ref.kind}|${ref.name}|${rule.dimension}|${rule.option}`);
    }
    return out;
  }
  const EXPLICIT_IDENTITY_AFFINITY_COVERAGE=explicitIdentityAffinityCoverage();
  function tacticAffinityByChoice(starters=[],baseOwn=null){
    const own=baseOwn||ownFeatures(starters),out={};
    const push=(kind,name,entry,relation,optionFilter=null)=>{
      const points=Number(entry?.points)||0;if(!entry?.dimension||!Array.isArray(entry?.options)||!points)return;
      for(const opt of entry.options){
        if(optionFilter&&!optionFilter(opt))continue;
        // A pure identity-only explicit tactic rule already represents this exact semantic relationship.
        // Keep the established explicit weighting and suppress only the duplicate generic affinity; contextual rules remain additive.
        if(relation==='support'&&EXPLICIT_IDENTITY_AFFINITY_COVERAGE.has(`${kind}|${alias(name)}|${entry.dimension}|${opt}`))continue;
        const key=`${entry.dimension}:${opt}`;(out[key]??=[]).push({id:`AFF-${kind}-${alias(name)}-${entry.dimension}-${opt}-${relation}`,points,matched:true,message:`${name} ${relation==='support'?'supports':'opposes'} ${entry.dimension} ${opt}.`,bucket:'playstyle_and_sa_fit'});
      }
    };
    for(const [name,row] of Object.entries(CFG.tactics.playstyle_affinities||{})){
      if((own.playstyles?.[alias(name)]||0)<=0)continue;
      const directionalFocus=directionalFocusOptions(name,starters);
      const filter=entry=>entry?.dimension==='focus'&&directionalFocus?(opt=>directionalFocus.has(opt)):null;
      for(const entry of row.supports||[])push('PS',name,entry,'support',filter(entry));
      for(const entry of row.opposes||[])push('PS',name,entry,'oppose',filter(entry));
    }
    for(const [name,row] of Object.entries(CFG.tactics.special_ability_affinities||{})){if(!row?.active||(own.abilities?.[alias(name)]||0)<=0)continue;for(const entry of row.supports||[])push('SA',name,entry,'support');for(const entry of row.opposes||[])push('SA',name,entry,'oppose');}
    return out;
  }
  const TACTIC_RULE_ORDER=new Map(),TACTIC_RULES_BY_CHOICE=(()=>{const out={};for(const [i,rule] of (CFG.tactics.rules||[]).entries()){TACTIC_RULE_ORDER.set(rule.id,i);const key=`${rule.dimension}:${rule.option}`;(out[key]??=[]).push(rule);}return out;})();
  function ruleDependsOnTacticValues(rule){return String(rule?.when||'').includes('values.')||String(rule?.feature||'').startsWith('values.');}
  function selectedTacticRules(values={},dynamicOnly=null){const out=[];for(const [dimension,option] of Object.entries(values)){const rows=TACTIC_RULES_BY_CHOICE[`${dimension}:${option}`]||[];for(const rule of rows){const dynamic=ruleDependsOnTacticValues(rule);if(dynamicOnly===null||dynamic===dynamicOnly)out.push(rule);}}return out;}
  function prepareTacticRuleContext(starters=[],baseOwn=null){
    const own=baseOwn||ownFeatures(starters),context=buildContext(starters,{},own),staticByChoice={},dynamicDimensions=new Set(),affinityByChoice=tacticAffinityByChoice(starters,own);
    for(const [choice,rows] of Object.entries(TACTIC_RULES_BY_CHOICE)){const ev=evaluateRules(rows.filter(r=>!ruleDependsOnTacticValues(r)),context);staticByChoice[choice]=ev.contributions;for(const rule of rows.filter(ruleDependsOnTacticValues)){dynamicDimensions.add(rule.dimension);for(const m of String(rule.when||'').matchAll(/values\.([A-Za-z0-9_]+)/g))dynamicDimensions.add(m[1]);}}
    return{own,staticByChoice,affinityByChoice,dynamicDimensions:[...dynamicDimensions].sort(),dynamicCache:new Map()};
  }
  function scoreTacticContextSummary(values,starters=[],baseOwn=null,prepared=null){
    if(!prepared){const full=scoreTacticContext(values,starters,baseOwn,null);return{score:full.score,buckets:full.buckets,contradictionCount:(full.contributions||[]).filter(x=>x.points<0).length,own:full.own};}
    const prep=prepared,buckets={own_squad_structure:0,internal_coherence:0,playstyle_and_sa_fit:0};let score=0,contradictionCount=0,context=null;
    const addRows=rows=>{for(const c of rows||[]){const points=Number(c.points)||0;score+=points;buckets[c.bucket]=(buckets[c.bucket]||0)+c.points;if(points<0)contradictionCount++;}};
    for(const [dimension,option] of Object.entries(values)){const key=`${dimension}:${option}`;addRows(prep.staticByChoice?.[key]);addRows(prep.affinityByChoice?.[key]);}
    const dynamicKey=prep.dynamicDimensions.map(d=>`${d}=${values?.[d]??''}`).join('|');let dynamicRows=prep.dynamicCache.get(dynamicKey);
    if(!dynamicRows){context=buildContext(starters,values,prep.own||baseOwn);dynamicRows=evaluateRules(selectedTacticRules(values,true),context).contributions;prep.dynamicCache.set(dynamicKey,dynamicRows);}
    addRows(dynamicRows);return{score,buckets,contradictionCount,own:prep.own||context?.own||baseOwn};
  }
  function scoreTacticContext(values,starters=[],baseOwn=null,prepared=null){
    const prep=prepared||null,contributions=[];let context=null;
    if(prep){
      // Static rule/affinity rows were already evaluated when the prepared context was built.
      // Building the full contextual feature object for every one of ~20k tactic combinations
      // was pure duplicate work. Only construct it when a dynamic-rule cache miss actually
      // needs evaluation; the cache key already contains every tactic dimension referenced by
      // a dynamic rule. This is an exact performance optimisation, not a scoring change.
      for(const [dimension,option] of Object.entries(values)){const key=`${dimension}:${option}`,rows=prep.staticByChoice?.[key],aff=prep.affinityByChoice?.[key];if(rows)contributions.push(...rows);if(aff)contributions.push(...aff);}
      const dynamicKey=prep.dynamicDimensions.map(d=>`${d}=${values?.[d]??''}`).join('|');let dynamicRows=prep.dynamicCache.get(dynamicKey);
      if(!dynamicRows){context=buildContext(starters,values,prep.own||baseOwn);dynamicRows=evaluateRules(selectedTacticRules(values,true),context).contributions;prep.dynamicCache.set(dynamicKey,dynamicRows);}
      contributions.push(...dynamicRows);contributions.sort((a,b)=>(TACTIC_RULE_ORDER.get(a.id)??1e9)-(TACTIC_RULE_ORDER.get(b.id)??1e9)||String(a.id).localeCompare(String(b.id)));
    }
    else{context=buildContext(starters,values,baseOwn);contributions.push(...evaluateRules(selectedTacticRules(values),context).contributions);const aff=tacticAffinityByChoice(starters,context.own);for(const [dimension,option] of Object.entries(values))contributions.push(...(aff[`${dimension}:${option}`]||[]));}
    const buckets={own_squad_structure:0,internal_coherence:0,playstyle_and_sa_fit:0};let score=0;for(const c of contributions){score+=Number(c.points)||0;buckets[c.bucket]=(buckets[c.bucket]||0)+c.points;}
    return{score,buckets,reasons:contributions.map(x=>({points:x.points,reason:x.message,id:x.id,bucket:x.bucket})),own:prep?.own||context?.own||baseOwn,contributions};
  }

  TE.Strategy={MODEL_VERSION,EVIDENCE,TIER_WEIGHT,ROLE_TIERS,PLAYSTYLE_TIERS,TARGET_SHAPE,TARGET_RATIOS,SECONDARY_TARGET_RATIO,trainingPriorityProfile,tacticTrainingSignals,abilityTrainingSignals,analyseShape,startersShape,ownFeatures,contextualOwn,buildContext,tokenize,parseExpression,conditionMatches,evaluateRules,scoreFormationStructure,activeEligiblePlaystyleName,activePlaystylePlacements,directionalFocusOptions,tacticAffinityByChoice,prepareTacticRuleContext,scoreTacticContextSummary,scoreTacticContext,playstyleName,playstyleLevelId,developmentRoleFor,playstyleActive,abilityNames,CONFIG:CFG};
})();
