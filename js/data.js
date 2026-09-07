(() => {
  const TE = window.TE5 = window.TE5 || {};

  const OUTFIELD_SKILLS = ["Tackling","Marking","Positioning","Heading","Bravery","Passing","Dribbling","Crossing","Shooting","Finishing","Fitness","Strength","Aggression","Speed","Creativity"];
  const GK_SKILLS = ["Reflexes","Agility","Anticipation","Rushing Out","Communication","Throwing","Kicking","Punching","Aerial Reach","Concentration"];
  const GK_PHYSICAL = ["Fitness","Strength","Aggression","Speed","Creativity"];

  const GROUPS_OUTFIELD = {
    Defence:["Tackling","Marking","Positioning","Heading","Bravery"],
    Attack:["Passing","Dribbling","Crossing","Shooting","Finishing"],
    Physical:["Fitness","Strength","Aggression","Speed","Creativity"]
  };
  const GROUPS_GK = {Goalkeeping:GK_SKILLS, Physical:GK_PHYSICAL};

  const POSITION_WHITE = {
    GK:[...GK_SKILLS,"Fitness"],
    DR:["Tackling","Marking","Positioning","Bravery","Crossing","Fitness","Aggression","Speed"],
    DL:["Tackling","Marking","Positioning","Bravery","Crossing","Fitness","Aggression","Speed"],
    DC:["Tackling","Marking","Positioning","Heading","Bravery","Fitness","Strength","Aggression"],
    DMR:["Tackling","Marking","Positioning","Bravery","Passing","Crossing","Strength","Aggression"],
    DML:["Tackling","Marking","Positioning","Bravery","Passing","Crossing","Strength","Aggression"],
    DMC:["Tackling","Marking","Positioning","Heading","Bravery","Passing","Fitness","Strength","Aggression","Creativity"],
    MR:["Positioning","Passing","Dribbling","Crossing","Fitness","Speed","Creativity"],
    ML:["Positioning","Passing","Dribbling","Crossing","Fitness","Speed","Creativity"],
    MC:["Tackling","Marking","Positioning","Bravery","Passing","Dribbling","Shooting","Fitness","Speed","Creativity"],
    AMR:["Passing","Dribbling","Crossing","Shooting","Finishing","Fitness","Speed","Creativity"],
    AML:["Passing","Dribbling","Crossing","Shooting","Finishing","Fitness","Speed","Creativity"],
    AMC:["Heading","Passing","Dribbling","Shooting","Finishing","Fitness","Speed","Creativity"],
    ST:["Positioning","Heading","Passing","Dribbling","Shooting","Finishing","Strength","Speed","Creativity"]
  };

  const POSITION_PRIORITY = {
    GK:{"Reflexes":1.35,"Agility":1.25,"Anticipation":1.2,"Rushing Out":1.15,"Aerial Reach":1.1,"Concentration":1.05,"Communication":1.0,"Kicking":0.95,"Throwing":0.95,"Punching":0.95,"Fitness":0.9},
    DL:{Tackling:1.2,Marking:1.15,Positioning:1.25,Crossing:1.1,Speed:1.1,Bravery:1.0,Fitness:.95,Aggression:.9},
    DR:{Tackling:1.2,Marking:1.15,Positioning:1.25,Crossing:1.1,Speed:1.1,Bravery:1.0,Fitness:.95,Aggression:.9},
    DC:{Marking:1.3,Positioning:1.3,Tackling:1.2,Heading:1.15,Strength:1.1,Bravery:1.05,Fitness:.95,Aggression:.9},
    DML:{Tackling:1.15,Marking:1.1,Positioning:1.15,Passing:1.1,Crossing:1.1,Strength:1.0,Bravery:.95,Aggression:.9},
    DMR:{Tackling:1.15,Marking:1.1,Positioning:1.15,Passing:1.1,Crossing:1.1,Strength:1.0,Bravery:.95,Aggression:.9},
    DMC:{Tackling:1.2,Marking:1.2,Positioning:1.2,Passing:1.2,Creativity:1.05,Heading:1.0,Fitness:.95,Strength:.95,Aggression:.9,Bravery:1.0},
    ML:{Crossing:1.25,Passing:1.15,Dribbling:1.15,Speed:1.15,Creativity:1.1,Positioning:1.0,Fitness:.95},
    MR:{Crossing:1.25,Passing:1.15,Dribbling:1.15,Speed:1.15,Creativity:1.1,Positioning:1.0,Fitness:.95},
    MC:{Passing:1.3,Creativity:1.25,Positioning:1.15,Dribbling:1.1,Tackling:1.05,Shooting:1.0,Fitness:.95,Speed:.95,Bravery:.9},
    AML:{Dribbling:1.2,Shooting:1.25,Finishing:1.25,Crossing:1.15,Passing:1.1,Speed:1.1,Creativity:1.05,Fitness:.95},
    AMR:{Dribbling:1.2,Shooting:1.25,Finishing:1.25,Crossing:1.15,Passing:1.1,Speed:1.1,Creativity:1.05,Fitness:.95},
    AMC:{Shooting:1.25,Finishing:1.25,Creativity:1.3,Passing:1.25,Dribbling:1.15,Positioning:1.1,Speed:1.0,Heading:.95,Fitness:.9},
    ST:{Shooting:1.4,Finishing:1.4,Positioning:1.2,Heading:1.1,Strength:1.1,Speed:1.05,Dribbling:1.05,Passing:.9,Creativity:.85}
  };

  const MASTER_DRILLS = [
    {name:"Slalom Dribble", skills:["Dribbling","Speed","Fitness","Passing"], diff:"Hard", cat:"Attack"},
    {name:"Wing Play", skills:["Punching","Heading","Crossing","Finishing","Shooting"], diff:"Hard", cat:"Attack"},
    {name:"Fast Counter-Attacks", skills:["Communication","Creativity","Passing","Crossing","Finishing"], diff:"Very Hard", cat:"Attack"},
    {name:"Warm-Up", skills:["Aggression","Fitness","Heading","Reflexes"], diff:"Very Easy", cat:"Physical"},
    {name:"Stretch", skills:["Strength","Speed","Agility","Fitness"], diff:"Easy", cat:"Physical"},
    {name:"Carioca With Ladders", skills:["Speed","Aggression","Agility","Concentration"], diff:"Easy", cat:"Physical"},
    {name:"Long Run", skills:["Fitness","Speed","Concentration"], diff:"Medium", cat:"Physical"},
    {name:"Contact Play", skills:["Dribbling","Aggression","Marking","Strength","Bravery"], diff:"Medium", cat:"Possession"},
    {name:"Passes Before Shot", skills:["Anticipation","Creativity","Passing","Positioning","Finishing"], diff:"Hard", cat:"Possession"},
    {name:"Stay In Lane", skills:["Speed","Positioning","Fitness","Aerial Reach"], diff:"Medium", cat:"Possession"},
    {name:"Video Analysis", skills:["Bravery","Positioning","Communication","Creativity"], diff:"Very Easy", cat:"Defence"},
    {name:"Use Your Head", skills:["Creativity","Positioning","Heading","Passing"], diff:"Easy", cat:"Defence"},
    {name:"Hold The Line", skills:["Concentration","Positioning","Marking","Communication"], diff:"Medium", cat:"Defence"},
    {name:"Stop The Attacker", skills:["Dribbling","Marking","Tackling","Strength","Bravery"], diff:"Medium", cat:"Defence"},
    {name:"Defending Crosses", skills:["Heading","Marking","Aerial Reach","Crossing","Bravery"], diff:"Medium", cat:"Defence"},
    {name:"Press The Play", skills:["Aggression","Marking","Tackling","Positioning","Bravery"], diff:"Hard", cat:"Defence"},
    {name:"Goalkeeper Training", skills:["Agility","Kicking","Aerial Reach","Throwing","Reflexes"], diff:"Hard", cat:"Defence"},
    {name:"Ball Control", skills:["Dribbling","Concentration","Heading","Creativity"], diff:"Very Easy", cat:"Possession"},
    {name:"Piggy In The Middle", skills:["Aggression","Fitness","Tackling","Passing","Positioning"], diff:"Easy", cat:"Possession"},
    {name:"First Touch Play", skills:["Dribbling","Throwing","Fitness","Passing"], diff:"Easy", cat:"Possession"},
    {name:"Rapid Side Switch", skills:["Creativity","Crossing","Speed","Communication","Passing","Positioning"], diff:"Medium", cat:"Possession"},
    {name:"1-on-1 Finishing", skills:["Anticipation","Tackling","Rushing Out","Finishing","Dribbling"], diff:"Easy", cat:"Attack"},
    {name:"Pass, Go and Shoot!", skills:["Speed","Anticipation","Shooting","Passing"], diff:"Easy", cat:"Attack"},
    {name:"Set-Piece Delivery", skills:["Heading","Marking","Crossing","Rushing Out","Shooting"], diff:"Medium", cat:"Attack"},
    {name:"Shooting Technique", skills:["Agility","Strength","Reflexes","Finishing","Shooting"], diff:"Medium", cat:"Attack"},
    {name:"Shuttle Runs", skills:["Strength","Speed","Bravery","Agility"], diff:"Hard", cat:"Physical"},
    {name:"Hurdle Jumps", skills:["Speed","Bravery","Aggression","Kicking"], diff:"Hard", cat:"Physical"},
    {name:"Gym", skills:["Strength","Throwing","Fitness","Kicking"], diff:"Very Hard", cat:"Physical"},
    {name:"Sprint", skills:["Dribbling","Speed","Fitness","Rushing Out"], diff:"Very Hard", cat:"Physical"}
  ];

  const POSITION_ORDER={GK:1,DL:2,DC:3,DR:4,DML:5,DMC:6,DMR:7,ML:8,MC:9,MR:10,AML:11,AMC:12,AMR:13,ST:14};
  const ALL_POSITIONS=Object.keys(POSITION_ORDER);

  const SPECIAL_ABILITIES=["Penalty Kick Stopper","Defensive Wall","Aerial Defender","Dribbler","Corner Specialist","Shadow Striker","One-on-One Scorer","One-on-One Stopper","Playmaker","Free Kick Specialist","Penalty Kick Specialist"];
  const PLAYSTYLES=["Poacher","False Nine","Target Man","Inside Forward","Winger","Enganche","False Winger","Complete Forward","Box-to-Box","Mezzala","Ball Winner","Anchor Man","Playmaker","Regista","Holding Midfielder","Wing Back","Box Commander","Ball Playing DC","Stopper","Sweeper Keeper","Full Back","No-Nonsense DC"];

  const TEAM_GROUPS={
    defence:{title:'GK & Defence',positions:['GK','DL','DC','DR','DML','DMR']},
    midfield:{title:'Defensive Midfield & Midfield',positions:['DML','DMR','DMC','ML','MC','MR']},
    attack:{title:'Attacking Midfield & Striking',positions:['AML','AMC','AMR','ST']},
    all:{title:'All Positions',positions:ALL_POSITIONS}
  };

  TE.Data={OUTFIELD_SKILLS,GK_SKILLS,GK_PHYSICAL,GROUPS_OUTFIELD,GROUPS_GK,POSITION_WHITE,POSITION_PRIORITY,MASTER_DRILLS,POSITION_ORDER,ALL_POSITIONS,SPECIAL_ABILITIES,PLAYSTYLES,TEAM_GROUPS};
})();
