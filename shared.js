// ── OVR weight map — EA FC community-verified, single source of truth ─────────
const OVR_W={
  GK: {"Reactions":12,"GK Diving":22,"GK Handling":22,"GK Kicking":6,"GK Positioning":22,"GK Reflexes":22},
  CB: {"Heading Accuracy":11,"Short Passing":6,"Ball Control":5,"Acceleration":6,"Sprint Speed":3,"Jumping":4,"Strength":11,"Def Awareness":15,"Stand Tackle":18,"Slide Tackle":11,"Aggression":8,"Interceptions":14,"Reactions":6},
  LB: {"Crossing":10,"Finishing":5,"Heading Accuracy":5,"Short Passing":8,"Ball Control":8,"Acceleration":6,"Sprint Speed":8,"Reactions":6,"Stamina":9,"Def Awareness":9,"Stand Tackle":12,"Slide Tackle":15,"Interceptions":12},
  RB: {"Crossing":10,"Finishing":5,"Heading Accuracy":5,"Short Passing":8,"Ball Control":8,"Acceleration":6,"Sprint Speed":8,"Reactions":6,"Stamina":9,"Def Awareness":9,"Stand Tackle":12,"Slide Tackle":15,"Interceptions":12},
  CDM:{"Short Passing":15,"Ball Control":11,"Reactions":8,"Stamina":7,"Strength":5,"Def Awareness":10,"Stand Tackle":13,"Slide Tackle":6,"Aggression":6,"Interceptions":15,"Long Passing":11,"Vision":5},
  CM: {"Finishing":3,"Short Passing":18,"Dribbling":8,"Ball Control":15,"Reactions":9,"Stamina":7,"Long Shots":5,"Stand Tackle":6,"Interceptions":6,"Positioning":7,"Long Passing":14,"Vision":5},
  LM: {"Crossing":11,"Finishing":7,"Short Passing":12,"Dribbling":16,"Ball Control":14,"Acceleration":8,"Sprint Speed":7,"Reactions":8,"Stamina":6,"Interceptions":6,"Positioning":7,"Long Passing":6,"Vision":14},
  LW: {"Crossing":11,"Finishing":7,"Short Passing":12,"Dribbling":16,"Ball Control":14,"Acceleration":8,"Sprint Speed":7,"Reactions":8,"Stamina":6,"Interceptions":6,"Positioning":7,"Long Passing":6,"Vision":14},
  RW: {"Crossing":10,"Finishing":11,"Short Passing":10,"Dribbling":17,"Ball Control":15,"Acceleration":8,"Sprint Speed":7,"Agility":4,"Reactions":8,"Long Shots":5,"Positioning":10,"Vision":15},
  CAM:{"Finishing":8,"Short Passing":17,"Dribbling":14,"Ball Control":16,"Acceleration":5,"Sprint Speed":4,"Agility":4,"Reactions":8,"Long Shots":6,"Positioning":9,"Long Passing":5,"Vision":8},
  CF: {"Finishing":12,"Heading Accuracy":3,"Short Passing":10,"Dribbling":15,"Ball Control":16,"Acceleration":6,"Sprint Speed":6,"Reactions":10,"Shot Power":6,"Long Shots":5,"Positioning":14,"Vision":9},
  ST: {"Positioning":24.07,"Heading Accuracy":19.83,"Finishing":14.06,"Sprint Speed":12.27,"Reactions":8.89,"Acceleration":8.36,"Long Shots":4.45,"Dribbling":4.14,"Short Passing":3.52},
};

// ── OVR calculation ───────────────────────────────────────────────────────────
function calcOVR(p){
  if(!p)return 0;
  if(p.manualOVR){const m=parseInt(p.manualOVR);if(m)return m;}
  if(!p.stats||!p.position)return 0;
  const w=OVR_W[p.position];if(!w)return 0;
  const t=Object.values(w).reduce((a,b)=>a+b,0);
  return Math.round(Object.entries(w).reduce((s,[k,wi])=>s+(p.stats[k]||0)*wi/t,0));
}

// ── Player colour helpers ─────────────────────────────────────────────────────
const AVC=['#3d7eff','#22c55e','#f59e0b','#ef4444','#a855f7','#ec4899','#14b8a6','#f97316'];
function avc(n){let h=0;for(const c of n||'')h=(h+c.charCodeAt(0))%AVC.length;return AVC[h];}
function ini(n){return(n||'?').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);}

// ── Date helpers ──────────────────────────────────────────────────────────────
function localISODate(d){const m=d.getMonth()+1,dy=d.getDate();return d.getFullYear()+'-'+(m<10?'0':'')+m+'-'+(dy<10?'0':'')+dy;}
function fmtDate(d){if(!d)return'—';const dt=new Date(d+'T00:00:00');return dt.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});}
function fmtShort(d){if(!d)return'—';const dt=new Date(d+'T00:00:00');return dt.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});}

// ── Position constants ────────────────────────────────────────────────────────
const POSITIONS=['GK','CB','LB','RB','CDM','CM','CAM','LM','RW','LW','ST','CF'];
const PC={GK:'#f59e0b',CB:'#3b82f6',LB:'#3b82f6',RB:'#3b82f6',CDM:'#10b981',CM:'#10b981',CAM:'#10b981',LM:'#ef4444',RW:'#ef4444',LW:'#ef4444',ST:'#ef4444',CF:'#ef4444'};

// ── Rating colour (green ≥8, blue ≥7, amber ≥6, red <6) ──────────────────────
function rcol(r){const v=parseFloat(r);if(!v)return'var(--text2)';if(v>=8)return'#22c55e';if(v>=7)return'#3d7eff';if(v>=6)return'#f59e0b';return'#ef4444';}

// ── localStorage data loaders ─────────────────────────────────────────────────
function loadSquad(){
  let sq=[];
  try{const d=JSON.parse(localStorage.getItem('eafc26v12')||'null');if(d?.players)sq=d.players;}catch{}
  if(!sq.length)['eafc26v11','eafc26v10','eafc26v9'].forEach(k=>{
    if(!sq.length)try{const d=JSON.parse(localStorage.getItem(k)||'null');if(d?.players?.length)sq=d.players;}catch{}
  });
  return sq;
}
function loadMatches(){try{const d=JSON.parse(localStorage.getItem('eafc26_matches')||'[]');return Array.isArray(d)?d:[];}catch{return[];}}
function loadTransfers(){try{const d=JSON.parse(localStorage.getItem('eafc26_transfers')||'[]');return Array.isArray(d)?d:[];}catch{return[];}}
