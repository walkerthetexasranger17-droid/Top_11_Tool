(() => {
  const TE=window.TE5=window.TE5||{}; const OD=TE.OptimizerData,B=TE.BibleData;
  if(!OD||!B) throw new Error('optimizer-data.js and bible-data.js must load before data.js');
  const OUTFIELD_SKILLS=['Tackling','Marking','Positioning','Heading','Bravery','Passing','Dribbling','Crossing','Shooting','Finishing','Fitness','Strength','Aggression','Speed','Creativity'];
  const GK_SKILLS=['Reflexes','Agility','Anticipation','Rushing Out','Communication','Throwing','Kicking','Punching','Aerial Reach','Concentration'];
  const GK_PHYSICAL=['Fitness','Strength','Aggression','Speed','Creativity'];
  const GROUPS_OUTFIELD={Defence:['Tackling','Marking','Positioning','Heading','Bravery'],Attack:['Passing','Dribbling','Crossing','Shooting','Finishing'],Physical:['Fitness','Strength','Aggression','Speed','Creativity']};
  const GROUPS_GK={Goalkeeping:GK_SKILLS,Physical:GK_PHYSICAL};
  const ALL_POSITIONS=[...B.CURRENT_ROLES], POSITION_ORDER={...B.POSITION_ORDER};
  const POSITION_WHITE=Object.fromEntries(ALL_POSITIONS.map(role=>[role,[...(OD.whiteSkillMap.roles[role]?.key_attributes||[])]]));
  const ATTRIBUTE_IDS={...OD.whiteSkillMap.attribute_ids};
  const ATTRIBUTE_NAMES_BY_ID=Object.fromEntries(Object.entries(ATTRIBUTE_IDS).map(([name,id])=>[String(id),name]));
  function normaliseRole(role){const r=String(role||'').trim().toUpperCase();return ALL_POSITIONS.includes(r)?r:'';}
  function whiteSkillsForRoles(roles){const out=[];for(const role of Array.isArray(roles)?roles:[roles]){const r=normaliseRole(role);if(!r)continue;for(const skill of POSITION_WHITE[r]||[])if(!out.includes(skill))out.push(skill);}return out;}
  function isGoalkeeperRoles(roles){return (Array.isArray(roles)?roles:[roles]).map(normaliseRole).includes('GK');}
  function applicableSkillsForRoles(roles){return isGoalkeeperRoles(roles)?[...GK_SKILLS,...GK_PHYSICAL]:[...OUTFIELD_SKILLS];}
  const NORMAL_DRILLS=OD.normalDrills.drills.map((d,index)=>({index,assetId:d.asset_id,drillId:d.drill_id,name:d.name,cat:d.type,diff:d.intensity,intensityId:d.intensity_id,conditionDrop:d.condition_drop,xpPerPlayer:d.xp_per_player,attributeIds:[...d.affected_attribute_ids],skills:[...d.affected_attributes],orderingPriority:d.ordering_priority,visibility:d.visibility,capturedLevelId:d.captured_level_id,capturedUnlocked:!!d.captured_unlocked}));
  const MASTER_CAMPUS_DRILLS=OD.masterDrills.drills.map((d,index)=>({index,drillId:d.drill_id,name:d.display_name,displayName:d.display_name,cat:d.type,diff:d.intensity,intensityId:d.intensity_id,conditionDrop:d.condition_drop,xpPerPlayer:d.xp_per_player,attributeIds:[...d.affected_attribute_ids],skills:[...d.affected_attributes],additionalTrainingEffectPercent:d.additional_training_effect_percent,description:d.description,originText:d.origin_text,isMaster:true}));
  const SPECIAL_ABILITY_DISPLAY_ALIASES={'Long Shots':'Shadow Striker'};
  const SPECIAL_ABILITIES=B.SPECIAL_ABILITIES.map(x=>SPECIAL_ABILITY_DISPLAY_ALIASES[x.name]||x.name);
  const PLAYSTYLES=B.PLAYSTYLES.filter(x=>x.id!==1&&x.offer!==false).map(x=>x.name);
  const LEGACY_PLAYSTYLES=['Complete Forward','Holding Midfielder','Playmaker','Ball Playing GK'];
  function playstylesForRoles(roles){const set=new Set((Array.isArray(roles)?roles:[roles]).map(normaliseRole).filter(Boolean));return B.PLAYSTYLES.filter(x=>x.id!==1&&x.offer!==false&&x.roles.some(r=>set.has(r))).map(x=>x.name);}
  function playstyleDefinition(value){if(!value)return B.PLAYSTYLES[0];const s=typeof value==='object'?(value.type||value.name):value;return B.PLAYSTYLES.find(x=>x.type===s||x.name===s)||null;}
  const TEAM_GROUPS={defence:{title:'GK & Defence',positions:['GK','DL','DC','DR']},midfield:{title:'Defence & Midfield',positions:['DL','DC','DR','DMC','ML','MC','MR']},attack:{title:'Attacking Mid & Strikers',positions:['AML','AMC','AMR','ST']},all:{title:'All Positions',positions:[...ALL_POSITIONS]}};
  TE.Data={GAME_DATA_VERSION:B.GAME_DATA_VERSION,OUTFIELD_SKILLS,GK_SKILLS,GK_PHYSICAL,GROUPS_OUTFIELD,GROUPS_GK,POSITION_WHITE,ATTRIBUTE_IDS,ATTRIBUTE_NAMES_BY_ID,NORMAL_DRILLS,MASTER_CAMPUS_DRILLS,POSITION_ORDER,ALL_POSITIONS,SPECIAL_ABILITIES,SPECIAL_ABILITY_DISPLAY_ALIASES,PLAYSTYLES,LEGACY_PLAYSTYLES,PLAYSTYLE_LEVELS:B.PLAYSTYLE_LEVELS,TEAM_GROUPS,normaliseRole,whiteSkillsForRoles,isGoalkeeperRoles,applicableSkillsForRoles,playstylesForRoles,playstyleDefinition,DRILL_LEVELS:OD.drillLevels,INTENSITY_SYSTEM:OD.intensitySystem,ROLE_RECTS:B.ROLE_RECTS,ROLE_IDS:B.ROLE_IDS};
})();
