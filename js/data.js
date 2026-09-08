(() => {
  const TE=window.TE5=window.TE5||{};
  const OD=TE.OptimizerData;
  if(!OD) throw new Error('optimizer-data.js must load before data.js');

  const OUTFIELD_SKILLS=["Tackling","Marking","Positioning","Heading","Bravery","Passing","Dribbling","Crossing","Shooting","Finishing","Fitness","Strength","Aggression","Speed","Creativity"];
  const GK_SKILLS=["Reflexes","Agility","Anticipation","Rushing Out","Communication","Throwing","Kicking","Punching","Aerial Reach","Concentration"];
  const GK_PHYSICAL=["Fitness","Strength","Aggression","Speed","Creativity"];
  const GROUPS_OUTFIELD={Defence:["Tackling","Marking","Positioning","Heading","Bravery"],Attack:["Passing","Dribbling","Crossing","Shooting","Finishing"],Physical:["Fitness","Strength","Aggression","Speed","Creativity"]};
  const GROUPS_GK={Goalkeeping:GK_SKILLS,Physical:GK_PHYSICAL};

  const POSITION_ORDER={GK:1,DL:2,DC:3,DR:4,DML:5,DMC:6,DMR:7,ML:8,MC:9,MR:10,AML:11,AMC:12,AMR:13,ST:14};
  const ALL_POSITIONS=Object.keys(POSITION_ORDER);
  const POSITION_WHITE=Object.fromEntries(Object.entries(OD.whiteSkillMap.roles).map(([role,v])=>[role,[...v.key_attributes]]));
  const ATTRIBUTE_IDS={...OD.whiteSkillMap.attribute_ids};
  const ATTRIBUTE_NAMES_BY_ID=Object.fromEntries(Object.entries(ATTRIBUTE_IDS).map(([name,id])=>[String(id),name]));

  function normaliseRole(role){const r=String(role||'').trim().toUpperCase();return ALL_POSITIONS.includes(r)?r:'';}
  function whiteSkillsForRoles(roles){
    const out=[];
    for(const role of Array.isArray(roles)?roles:[roles]){
      const r=normaliseRole(role);if(!r)continue;
      for(const skill of POSITION_WHITE[r]||[]) if(!out.includes(skill)) out.push(skill);
    }
    return out;
  }
  function isGoalkeeperRoles(roles){return (Array.isArray(roles)?roles:[roles]).map(normaliseRole).includes('GK');}
  function applicableSkillsForRoles(roles){
    // Contract build_30527: outfield uses attribute IDs 1-15; GK uses the GK key pool.
    return isGoalkeeperRoles(roles)?[...POSITION_WHITE.GK]:[...OUTFIELD_SKILLS];
  }

  const NORMAL_DRILLS=OD.normalDrills.drills.map((d,index)=>({
    index,assetId:d.asset_id,drillId:d.drill_id,name:d.name,cat:d.type,diff:d.intensity,
    intensityId:d.intensity_id,conditionDrop:d.condition_drop,xpPerPlayer:d.xp_per_player,
    attributeIds:[...d.affected_attribute_ids],skills:[...d.affected_attributes],orderingPriority:d.ordering_priority,
    visibility:d.visibility,capturedLevelId:d.captured_level_id,capturedUnlocked:!!d.captured_unlocked
  }));
  const MASTER_CAMPUS_DRILLS=OD.masterDrills.drills.map((d,index)=>({
    index,drillId:d.drill_id,name:d.display_name,displayName:d.display_name,cat:d.type,diff:d.intensity,
    intensityId:d.intensity_id,conditionDrop:d.condition_drop,xpPerPlayer:d.xp_per_player,
    attributeIds:[...d.affected_attribute_ids],skills:[...d.affected_attributes],additionalTrainingEffectPercent:d.additional_training_effect_percent,
    description:d.description,originText:d.origin_text,isMaster:true
  }));

  const SPECIAL_ABILITIES=["Penalty Kick Stopper","Defensive Wall","Aerial Defender","Dribbler","Corner Specialist","Shadow Striker","One-on-One Scorer","One-on-One Stopper","Playmaker","Free Kick Specialist","Penalty Kick Specialist"];
  const PLAYSTYLES=["Poacher","False Nine","Target Man","Enganche","Inside Forward","Winger","False Winger","Mezzala","Box-to-Box","Regista","Ball Winner","Anchor Man","No-Nonsense DC","Stopper","Ball Playing DC","Full Back","Wing Back","Ball Playing GK","Sweeper Keeper","Box Commander"];
  const LEGACY_PLAYSTYLES=["Complete Forward","Holding Midfielder","Playmaker"];
  const PLAYSTYLE_LEVELS=["Locked","Standard","Intermediate","Advanced","Master"];
  const PLAYSTYLE_POINTS_TYPES=["DefenderPoints","MidfielderPoints","AttackerPoints"];

  const TEAM_GROUPS={
    defence:{title:'GK & Defence',positions:['GK','DL','DC','DR','DML','DMR']},
    midfield:{title:'Defensive Midfield & Midfield',positions:['DML','DMR','DMC','ML','MC','MR']},
    attack:{title:'Attacking Midfield & Striking',positions:['AML','AMC','AMR','ST']},
    all:{title:'All Positions',positions:ALL_POSITIONS}
  };

  TE.Data={
    GAME_DATA_VERSION:OD.gameDataVersion,OUTFIELD_SKILLS,GK_SKILLS,GK_PHYSICAL,GROUPS_OUTFIELD,GROUPS_GK,
    POSITION_WHITE,ATTRIBUTE_IDS,ATTRIBUTE_NAMES_BY_ID,NORMAL_DRILLS,MASTER_CAMPUS_DRILLS,POSITION_ORDER,ALL_POSITIONS,
    SPECIAL_ABILITIES,PLAYSTYLES,LEGACY_PLAYSTYLES,PLAYSTYLE_LEVELS,PLAYSTYLE_POINTS_TYPES,TEAM_GROUPS,
    normaliseRole,whiteSkillsForRoles,isGoalkeeperRoles,applicableSkillsForRoles,
    DRILL_LEVELS:OD.drillLevels,INTENSITY_SYSTEM:OD.intensitySystem
  };
})();
