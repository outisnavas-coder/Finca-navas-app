import { useState, useEffect, useCallback } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─── SUPABASE CONFIG ──────────────────────────────────────────────────────────
// 👇 Reemplaza con tus credenciales de Supabase
// Supabase → Settings → API → Project URL y anon key
const SUPABASE_URL = "https://drfxrtsclgiwgejopjcg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZnhydHNjbGdpd2dlam9wamNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMTI4OTksImV4cCI6MjA5Mjg4ODg5OX0.gAnxoyUCuE_iyt6SYZSAdRIyS-1OctWk2i-IOoKB96Y";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const G = { deep:"#1A1A2E",mid:"#2C2C44",light:"#C9A84C",pale:"#F5EDD0",beige:"#F7F5F0",beigeD:"#E8E4DA",cream:"#FAFAF8",white:"#FFFFFF",g900:"#111118",g700:"#3A3A4A",g500:"#7A7A8A",g300:"#D0CDD8",g100:"#F4F4F6",gold:"#C9A84C",goldL:"#FDF6E3",red:"#991B1B",redL:"#FEE2E2",blue:"#1E40AF",blueL:"#DBEAFE" };

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'DM Sans',sans-serif;background:${G.cream};color:${G.g900}}
  ::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:${G.beige}}::-webkit-scrollbar-thumb{background:${G.light};border-radius:3px}
  .app{display:flex;min-height:100vh}
  .sidebar{width:256px;min-height:100vh;background:${G.deep};display:flex;flex-direction:column;flex-shrink:0;position:fixed;top:0;left:0;z-index:100;transition:transform .3s}
  .sidebar.closed{transform:translateX(-256px)}
  .slogo{padding:24px 20px 18px;border-bottom:1px solid rgba(255,255,255,.1)}
  .slogo h1{font-family:'Playfair Display',serif;color:#fff;font-size:17px;font-weight:700;line-height:1.3}
  .slogo span{color:${G.light};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;display:block;margin-top:3px}
  .nav-sec{padding:10px 0}
  .nav-lbl{color:rgba(255,255,255,.35);font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;padding:6px 20px 3px}
  .nav-item{display:flex;align-items:center;gap:9px;padding:9px 20px;color:rgba(255,255,255,.7);cursor:pointer;font-size:13.5px;transition:all .15s;border-left:3px solid transparent}
  .nav-item:hover{color:#fff;background:rgba(255,255,255,.06)}
  .nav-item.active{color:#fff;background:rgba(201,168,76,.15);border-left-color:${G.light}}
  .sfoot{margin-top:auto;padding:16px 20px;border-top:1px solid rgba(255,255,255,.1)}
  .ubadge{display:flex;align-items:center;gap:9px}
  .uav{width:32px;height:32px;border-radius:50%;background:${G.light};display:flex;align-items:center;justify-content:center;color:${G.deep};font-weight:700;font-size:12px;flex-shrink:0}
  .uinfo p{color:#fff;font-size:12.5px;font-weight:500}
  .uinfo span{color:rgba(255,255,255,.45);font-size:11px;text-transform:capitalize}
  .main{margin-left:256px;flex:1;display:flex;flex-direction:column;transition:margin-left .3s}
  .main.full{margin-left:0}
  .topbar{background:#fff;padding:13px 24px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid ${G.beigeD};position:sticky;top:0;z-index:50}
  .topbar h2{font-family:'Playfair Display',serif;font-size:20px;color:${G.deep};font-weight:600}
  .content{padding:24px;flex:1}
  .card{background:#fff;border-radius:14px;border:1px solid ${G.beigeD}}
  .card-h{padding:16px 20px 12px;border-bottom:1px solid ${G.beigeD};display:flex;align-items:center;justify-content:space-between}
  .card-h h3{font-family:'Playfair Display',serif;font-size:15px;color:${G.deep};font-weight:600}
  .card-b{padding:18px 20px}
  .sg{display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:14px;margin-bottom:22px}
  .sc{background:#fff;border-radius:13px;padding:18px 20px;border:1px solid ${G.beigeD};display:flex;flex-direction:column;gap:7px;transition:box-shadow .2s}
  .sc:hover{box-shadow:0 4px 18px rgba(27,67,50,.08)}
  .sc.grn{background:linear-gradient(135deg,${G.deep} 0%,${G.mid} 100%);border-left:3px solid ${G.gold};border-color:transparent}
  .sc.grn .sl,.sc.grn .sv,.sc.grn .si,.sc.grn .str{color:rgba(255,255,255,.9)!important}
  .sc.grn .sv{color:#fff!important}
  .si{font-size:20px}.sl{font-size:10.5px;font-weight:600;color:${G.g500};letter-spacing:.7px;text-transform:uppercase}
  .sv{font-family:Arial,sans-serif;font-size:24px;font-weight:900;color:${G.deep}}
  .str{font-size:11.5px;color:${G.mid};font-weight:500}.str.neg{color:${G.red}}
  .tw{overflow-x:auto}
  table{width:100%;border-collapse:collapse;font-size:13.5px}
  th{background:${G.beige};color:${G.g700};font-weight:600;font-size:10.5px;text-transform:uppercase;letter-spacing:.5px;padding:9px 13px;text-align:left}
  td{padding:11px 13px;border-bottom:1px solid ${G.beigeD};color:${G.g700}}
  tr:last-child td{border-bottom:none}
  tr:hover td{background:${G.cream}}
  .badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600}
  .bg{background:${G.pale};color:${G.deep}}.br{background:${G.redL};color:${G.red}}.bo{background:${G.goldL};color:${G.gold}}.bk{background:${G.g100};color:${G.g500}}.bb{background:${G.blueL};color:${G.blue}}
  .btn{display:inline-flex;align-items:center;gap:5px;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;border:none;transition:all .15s;font-family:'DM Sans',sans-serif}
  .btn-p{background:${G.deep};color:#fff}.btn-p:hover{background:${G.mid}}
  .btn-o{background:transparent;border:1.5px solid ${G.deep};color:${G.deep}}.btn-o:hover{background:${G.pale}}
  .btn-sm{padding:5px 10px;font-size:12px;border-radius:6px}
  .btn-danger{background:${G.red};color:#fff}
  .fg{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px}
  .fgrp{display:flex;flex-direction:column;gap:5px}
  .fgrp label{font-size:11.5px;font-weight:600;color:${G.g700};text-transform:uppercase;letter-spacing:.4px}
  .fgrp input,.fgrp select,.fgrp textarea{padding:9px 12px;border:1.5px solid ${G.g300};border-radius:8px;font-size:13.5px;font-family:'DM Sans',sans-serif;color:${G.g900};background:#fff;transition:border-color .15s;outline:none}
  .fgrp input:focus,.fgrp select:focus{border-color:${G.mid}}
  .login-screen{min-height:100vh;display:flex;align-items:center;justify-content:center;background:${G.deep};background-image:radial-gradient(ellipse at 20% 50%,rgba(201,168,76,.12) 0%,transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(201,168,76,.08) 0%,transparent 50%);padding:20px}
  .login-card{background:#fff;border-radius:22px;padding:44px 40px;width:100%;max-width:400px;box-shadow:0 40px 80px rgba(0,0,0,.3)}
  .login-logo{text-align:center;margin-bottom:32px}
  .login-emb{width:80px;height:80px;margin:0 auto 14px;display:flex;align-items:center;justify-content:center}
  .login-logo h1{font-family:'Playfair Display',serif;color:${G.deep};font-size:26px;font-weight:700}
  .login-logo p{color:${G.g500};font-size:12.5px;margin-top:3px}
  .lerr{background:${G.redL};color:${G.red};padding:9px 13px;border-radius:8px;font-size:13px;margin-bottom:14px}
  .linfo{background:${G.pale};color:${G.mid};padding:9px 13px;border-radius:8px;font-size:12.5px;margin-bottom:14px}
  .mo{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px}
  .md{background:#fff;border-radius:18px;padding:28px;width:100%;max-width:540px;max-height:90vh;overflow-y:auto}
  .md h3{font-family:'Playfair Display',serif;font-size:19px;color:${G.deep};margin-bottom:22px}
  .tabs{display:flex;gap:3px;background:${G.beige};padding:4px;border-radius:11px;margin-bottom:18px;flex-wrap:wrap}
  .tab{padding:7px 14px;border-radius:8px;font-size:12.5px;font-weight:500;cursor:pointer;color:${G.g500};transition:all .15s;border:none;background:transparent;font-family:'DM Sans',sans-serif}
  .tab.active{background:#fff;color:${G.deep};box-shadow:0 1px 4px rgba(0,0,0,.07)}
  .g2{display:grid;grid-template-columns:1fr 1fr;gap:18px}
  .mt3{margin-top:12px}.mt4{margin-top:16px}.mb4{margin-bottom:16px}
  .fb{display:flex;justify-content:space-between;align-items:center}
  .fl{display:flex;align-items:center}
  .gap2{gap:8px}.gap3{gap:12px}
  .muted{color:${G.g500};font-size:13px}
  .bar-chart{display:flex;align-items:flex-end;gap:6px;height:150px;padding:0 2px}
  .bar-w{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px}
  .bar{width:100%;border-radius:5px 5px 0 0;transition:opacity .2s;min-width:8px}
  .bar:hover{opacity:.8}.blab{font-size:9.5px;color:${G.g500};font-weight:500;text-align:center}
  .prog-bar{height:7px;background:${G.beige};border-radius:4px;overflow:hidden;margin-top:5px}
  .prog-fill{height:100%;border-radius:4px;transition:width .8s ease}
  .loading{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:300px;gap:12px;color:${G.g500}}
  .spinner{width:32px;height:32px;border:3px solid ${G.beigeD};border-top-color:${G.gold};border-radius:50%;animation:spin .8s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  .toast{position:fixed;bottom:24px;right:24px;background:${G.deep};color:#fff;padding:12px 20px;border-radius:12px;font-size:13.5px;font-weight:500;z-index:999;animation:slideUp .3s ease}
  .toast.error{background:${G.red}}
  @keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}
  .config-banner{background:${G.goldL};border:1px solid ${G.gold};border-radius:12px;padding:16px 20px;margin-bottom:20px;font-size:13.5px;color:${G.gold};line-height:1.6}
  .config-banner code{background:rgba(181,134,13,.15);padding:2px 7px;border-radius:5px;font-family:monospace;font-size:12px}
  .fil-row{display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;align-items:center}
  .fil-row select{padding:7px 11px;border:1.5px solid ${G.g300};border-radius:8px;font-size:13px;font-family:'DM Sans',sans-serif;color:${G.g900};background:#fff;outline:none}
  .fil-row select:focus{border-color:${G.mid}}
  footer{padding:14px 24px;border-top:1px solid ${G.beigeD};background:#fff;display:flex;justify-content:space-between;align-items:center}
  @media(max-width:768px){.sidebar{transform:translateX(-256px)}.sidebar.open{transform:translateX(0)}.main{margin-left:0!important}.content{padding:14px}.sg{grid-template-columns:repeat(2,1fr)}.fg{grid-template-columns:1fr}.g2{grid-template-columns:1fr}.login-card{padding:28px 20px}.topbar{padding:11px 14px}}
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt$ = (n) => `$${Number(n||0).toLocaleString("es-PA",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const MONTH_NAMES = ["","Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

const isConfigured = SUPABASE_URL !== "https://TU_PROJECT_ID.supabase.co";

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({msg,type,onDone}){
  useEffect(()=>{const t=setTimeout(onDone,3000);return()=>clearTimeout(t);},[]);
  return <div className={`toast ${type==="error"?"error":""}`}>{type==="ok"?"✓ ":type==="error"?"✕ ":""}{msg}</div>;
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({open,onClose,title,children}){
  if(!open)return null;
  return <div className="mo" onClick={onClose}><div className="md" onClick={e=>e.stopPropagation()}><div className="fb mb4"><h3>{title}</h3><button className="btn btn-o btn-sm" onClick={onClose}>✕</button></div>{children}</div></div>;
}

// ─── CONFIG BANNER ────────────────────────────────────────────────────────────
function ConfigBanner(){
  return <div className="config-banner">
    <strong>⚙️ Configura Supabase para activar la base de datos en la nube</strong><br/>
    1. Crea un proyecto en <strong>app.supabase.com</strong><br/>
    2. Ejecuta el archivo <code>supabase-schema.sql</code> en el SQL Editor<br/>
    3. Ejecuta <code>migration-historico.sql</code> para cargar el historial<br/>
    4. En este archivo, reemplaza <code>SUPABASE_URL</code> y <code>SUPABASE_ANON_KEY</code> con tus credenciales<br/>
    5. Crea usuarios en Authentication → Users: <code>admin@fincanavas.pa</code> / <code>encargado@fincanavas.pa</code>
  </div>;
}


// ─── RR LOGO SVG ─────────────────────────────────────────────────────────────
function RRLogo({size=32,color="#C9A84C"}){
  return <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 15 L8 85 L20 85 L20 58 L32 58 L44 85 L58 85 L44 56 C52 53 58 45 58 35 C58 24 49 15 38 15 Z M20 27 L36 27 C42 27 46 31 46 37 C46 43 42 47 36 47 L20 47 Z" fill={color}/>
    <path d="M56 15 L56 85 L68 85 L68 58 L80 58 L92 85 L106 85 L92 56 C100 53 106 45 106 35 C106 24 97 15 86 15 Z M68 27 L84 27 C90 27 94 31 94 37 C94 43 90 47 84 47 L68 47 Z" fill={color} transform="translate(-8,0) scale(0.88,1)"/>
  </svg>;
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({onLogin}){
  const [email,setEmail]=useState(""),[pass,setPass]=useState(""),[err,setErr]=useState(""),[loading,setLoading]=useState(false);

  const go=async e=>{
    e.preventDefault();
    if(!isConfigured){setErr("Configura Supabase primero (ver banner superior)");return;}
    setLoading(true);setErr("");
    const {data,error}=await supabase.auth.signInWithPassword({email,password:pass});
    if(error){setErr(error.message);setLoading(false);return;}
    // Get profile
    const {data:perfil}=await supabase.from("perfiles").select("*").eq("id",data.user.id).single();
    onLogin({...data.user,perfil});
    setLoading(false);
  };

  return <div className="login-screen"><div className="login-card">
    <div className="login-logo">
      <div className="login-emb"><img src="/Logo.png" style={{width:72,height:72,objectFit:"contain"}}/></div>
      <h1>Gosh Investment</h1>
      <p>Sistema de Gestión GOSH · Panamá</p>
    </div>
    {!isConfigured&&<div className="linfo">⚙️ App en modo demostración — configura Supabase para activar</div>}
    {err&&<div className="lerr">{err}</div>}
    <form onSubmit={go}>
      <div className="fgrp mb4"><label>Email</label><input type="email" placeholder="admin@fincanavas.pa" value={email} onChange={e=>{setEmail(e.target.value);setErr("")}} autoFocus/></div>
      <div className="fgrp mb4"><label>Contraseña</label><input type="password" placeholder="••••••••" value={pass} onChange={e=>{setPass(e.target.value);setErr("")}}/></div>
      <button type="submit" className="btn btn-p" style={{width:"100%",justifyContent:"center",padding:"11px"}} disabled={loading}>
        {loading?"Iniciando...":"Iniciar Sesión"}
      </button>
    </form>
  </div></div>;
}

// ─── LOADING SCREEN ───────────────────────────────────────────────────────────
function Loading({msg="Cargando datos..."}){
  return <div className="loading"><div className="spinner"></div><span>{msg}</span></div>;
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({gastos,ingresos,onAnioChange}){
  const [anio,setAnio]=useState(new Date().getFullYear());
  const anos=[...new Set([...gastos,...ingresos].map(x=>x.anio))].sort((a,b)=>b-a);
  const gF=anio==="todo"?gastos:gastos.filter(g=>g.anio===anio);
  const iF=anio==="todo"?ingresos:ingresos.filter(i=>i.anio===anio);
  const totG=gF.reduce((s,x)=>s+Number(x.monto),0);
  const totI=iF.reduce((s,x)=>s+Number(x.monto),0);
  const net=totI-totG;

  const mChart=Array.from({length:12},(_,i)=>{
    const m=i+1;
    return {m:MONTH_NAMES[m],ing:iF.filter(x=>x.mes===m).reduce((s,x)=>s+Number(x.monto),0),gas:gF.filter(x=>x.mes===m).reduce((s,x)=>s+Number(x.monto),0)};
  }).filter(d=>d.ing>0||d.gas>0);
  const maxC=Math.max(...mChart.map(d=>Math.max(d.ing,d.gas)),1);

  const catG={};gF.forEach(g=>{catG[g.categoria]=(catG[g.categoria]||0)+Number(g.monto);});
  const topCats=Object.entries(catG).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const maxCat=topCats[0]?.[1]||1;

  const totGAll=gastos.reduce((s,g)=>s+Number(g.monto),0);
  const totIAll=ingresos.reduce((s,i)=>s+Number(i.monto),0);

  return <div>
    <div className="fl gap3 mb4 flex-wrap">
      <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:G.deep,fontWeight:600}}>Año:</span>
      <button className={`btn ${anio==="todo"?"btn-p":"btn-o"} btn-sm`} onClick={()=>{setAnio("todo");onAnioChange&&onAnioChange("todo")}}>Todo</button>
      {anos.map(a=><button key={a} className={`btn ${anio===a?"btn-p":"btn-o"} btn-sm`} onClick={()=>{setAnio(a);onAnioChange&&onAnioChange(a)}}>{a}</button>)}
    </div>
    <div className="sg">
      <div className="sc grn"><span className="si">💵</span><span className="sl">Ingresos {anio==="todo"?"Total":anio}</span><span className="sv">{fmt$(totI)}</span><span className="str">{iF.length} transacciones</span></div>
      <div className="sc"><span className="si">📤</span><span className="sl">Gastos {anio==="todo"?"Total":anio}</span><span className="sv" style={{color:G.red}}>{fmt$(totG)}</span><span className="str neg">{gF.length} registros</span></div>
      <div className="sc"><span className="si">📈</span><span className="sl">Balance Neto</span><span className="sv" style={{color:net>=0?G.deep:G.red}}>{fmt$(net)}</span><span className={`str${net<0?" neg":""}`}>{net>=0?"✓ Positivo":"▼ Déficit"}</span></div>
      <div className="sc"><span className="si">🏦</span><span className="sl">Total Invertido</span><span className="sv" style={{fontSize:18}}>{fmt$(totGAll)}</span><span className="str">Acumulado 2024+</span></div>
      <div className="sc"><span className="si">💹</span><span className="sl">Total Recuperado</span><span className="sv" style={{fontSize:18}}>{fmt$(totIAll)}</span><span className="str">Acumulado</span></div>
      <div className="sc"><span className="si">📊</span><span className="sl">ROI Acumulado</span><span className="sv" style={{fontSize:18}}>{totGAll>0?((totIAll/totGAll)*100).toFixed(1):0}%</span><span className="str muted">Ingresos/Inversión</span></div>
    </div>
    <div className="g2">
      <div className="card">
        <div className="card-h"><h3>📊 Flujo {anio}</h3><div className="fl gap3"><span style={{fontSize:11,color:G.g500}}><span style={{display:"inline-block",width:10,height:10,borderRadius:2,background:G.mid,marginRight:3}}></span>Ingresos</span><span style={{fontSize:11,color:G.g500}}><span style={{display:"inline-block",width:10,height:10,borderRadius:2,background:G.beigeD,marginRight:3}}></span>Gastos</span></div></div>
        <div className="card-b">
          {mChart.length===0?<p className="muted">Sin datos para {anio}</p>:
          <div className="bar-chart">{mChart.map((d,i)=><div key={i} className="bar-w"><div style={{display:"flex",alignItems:"flex-end",gap:2,height:130}}><div className="bar" style={{height:`${(d.ing/maxC)*130}px`,background:G.mid}}></div><div className="bar" style={{height:`${(d.gas/maxC)*130}px`,background:G.beigeD}}></div></div><span className="blab">{d.m}</span></div>)}</div>}
        </div>
      </div>
      <div className="card">
        <div className="card-h"><h3>📋 Top Gastos {anio}</h3></div>
        <div className="card-b">
          {topCats.map(([cat,val])=><div key={cat} style={{marginBottom:14}}>
            <div className="fb" style={{marginBottom:4}}><span style={{fontSize:12,fontWeight:600,color:G.g700,maxWidth:"68%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cat}</span><span style={{fontSize:12,fontWeight:700,color:G.red}}>{fmt$(val)}</span></div>
            <div className="prog-bar"><div className="prog-fill" style={{width:`${(val/maxCat)*100}%`,background:G.red}}></div></div>
          </div>)}
          {topCats.length===0&&<p className="muted">Sin gastos en {anio}</p>}
        </div>
      </div>
    </div>
    <div className="card mt4">
      <div className="card-h"><h3>📅 Histórico por Año</h3></div>
      <div className="tw"><table><thead><tr><th>Año</th><th>Ingresos</th><th>Gastos</th><th>Balance</th><th>Cerdos</th><th>Ñame</th></tr></thead>
      <tbody>{[...new Set(gastos.map(g=>g.anio))].sort((a,b)=>b-a).map(y=>{
        const gi=ingresos.filter(x=>x.anio===y).reduce((s,x)=>s+Number(x.monto),0);
        const gg=gastos.filter(x=>x.anio===y).reduce((s,x)=>s+Number(x.monto),0);
        const gc=gastos.filter(x=>x.anio===y&&x.modulo==="Cerdos").reduce((s,x)=>s+Number(x.monto),0);
        const gn=gastos.filter(x=>x.anio===y&&x.modulo==="Ñame").reduce((s,x)=>s+Number(x.monto),0);
        const bal=gi-gg;
        return <tr key={y}><td style={{fontWeight:700}}>{y}</td><td style={{color:G.deep,fontWeight:600}}>{fmt$(gi)}</td><td style={{color:G.red,fontWeight:600}}>{fmt$(gg)}</td><td style={{fontWeight:700,color:bal>=0?G.deep:G.red}}>{fmt$(bal)}</td><td>{fmt$(gc)}</td><td>{fmt$(gn)}</td></tr>;
      })}</tbody></table></div>
    </div>
  </div>;
}

// ─── FINANZAS ─────────────────────────────────────────────────────────────────
function Finanzas({gastos,ingresos,onRefresh,role,toast}){
  const [tab,setTab]=useState("todos");
  const [filtAnio,setFiltAnio]=useState("todos");
  const [filtMod,setFiltMod]=useState("todos");
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const [saving,setSaving]=useState(false);

  const anos=[...new Set([...gastos,...ingresos].map(x=>x.anio))].sort((a,b)=>b-a);
  const filter=arr=>arr.filter(r=>(filtAnio==="todos"||r.anio===Number(filtAnio))&&(filtMod==="todos"||r.modulo===filtMod));
  const fG=filter(gastos);const fI=filter(ingresos);
  const all=[...fI.map(i=>({...i,tipo:"ingreso"})),...fG.map(g=>({...g,tipo:"gasto"}))].sort((a,b)=>b.fecha.localeCompare(a.fecha));
  const shown=tab==="todos"?all:tab==="ingresos"?fI.map(i=>({...i,tipo:"ingreso"})):fG.map(g=>({...g,tipo:"gasto"}));
  const totI=fI.reduce((s,x)=>s+Number(x.monto),0);
  const totG=fG.reduce((s,x)=>s+Number(x.monto),0);

  const save=async tipo=>{
    setSaving(true);
    const entry={fecha:form.fecha,categoria:form.categoria,descripcion:form.descripcion,monto:Number(form.monto),modulo:form.modulo,...(tipo==="gasto"?{pagado_por:form.pagado_por,soporte:form.soporte}:{})};
    const tbl=tipo==="gasto"?"gastos":"ingresos";
    const {error}=await supabase.from(tbl).insert(entry);
    setSaving(false);
    if(error){toast(error.message,"error");}else{toast(`${tipo==="gasto"?"Gasto":"Ingreso"} guardado ✓`);setModal(null);setForm({});onRefresh();}
  };

  const CATSGAS=["Alimento (Crecimiento)","Alimento (Gestación)","Alimento (Lactancia)","Veterinario y Insumos Medicos","Gastos de Parto","Compra de Lechones (Madres New y Verracos)","Infraestructura","Semilla","Mozos","Supervision de proyecto","Herramientas","Quimicos (Fertilizantes - Pestecidas)","Arado Mecanizado","Otro"];
  const CATSING=["Ingresos por ventas (Lechones)","Ingresos por ventas (Cerdas Madres)","Ingresos por Ñame","Otro"];

  return <div>
    <div className="sg">
      <div className="sc grn"><span className="si">📈</span><span className="sl">Ingresos (filtro)</span><span className="sv">{fmt$(totI)}</span></div>
      <div className="sc"><span className="si">📉</span><span className="sl">Gastos (filtro)</span><span className="sv" style={{color:G.red}}>{fmt$(totG)}</span></div>
      <div className="sc"><span className="si">💰</span><span className="sl">Balance</span><span className="sv" style={{color:totI-totG>=0?G.deep:G.red}}>{fmt$(totI-totG)}</span></div>
    </div>
    <div className="fil-row">
      <select value={filtAnio} onChange={e=>setFiltAnio(e.target.value)}><option value="todos">Todos los años</option>{anos.map(a=><option key={a}>{a}</option>)}</select>
      <select value={filtMod} onChange={e=>setFiltMod(e.target.value)}><option value="todos">Todos los módulos</option><option>Cerdos</option><option>Ñame</option><option>General</option></select>
      <span className="muted">{shown.length} registros</span>
    </div>
    <div className="fb mb4">
      <div className="tabs" style={{marginBottom:0,flex:1}}>
        {["todos","ingresos","gastos"].map(t=><button key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)} style={{textTransform:"capitalize"}}>{t}</button>)}
      </div>
      {role==="admin"&&<div className="fl gap2" style={{marginLeft:10}}>
        <button className="btn btn-p btn-sm" onClick={()=>{setModal("ingreso");setForm({fecha:new Date().toISOString().split("T")[0]});}}>+ Ingreso</button>
        <button className="btn btn-o btn-sm" onClick={()=>{setModal("gasto");setForm({fecha:new Date().toISOString().split("T")[0]});}}>+ Gasto</button>
      </div>}
    </div>
    <div className="card">
      <div className="tw"><table>
        <thead><tr><th>Fecha</th><th>Categoría</th><th>Descripción</th><th>Módulo</th><th>Pagado por</th><th>Tipo</th><th>Monto</th></tr></thead>
        <tbody>{shown.slice(0,100).map((r,i)=><tr key={i}>
          <td style={{whiteSpace:"nowrap"}}>{r.fecha}</td>
          <td style={{fontSize:12,maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.categoria}</td>
          <td style={{fontSize:12,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.descripcion}</td>
          <td><span className={`badge ${r.modulo==="Cerdos"?"bg":"bo"}`}>{r.modulo}</span></td>
          <td style={{fontSize:12}}>{r.pagado_por||"-"}</td>
          <td><span className={`badge ${r.tipo==="ingreso"?"bg":"br"}`}>{r.tipo==="ingreso"?"Ingreso":"Gasto"}</span></td>
          <td style={{fontWeight:700,color:r.tipo==="ingreso"?G.deep:G.red,whiteSpace:"nowrap"}}>{r.tipo==="ingreso"?"+":"-"}{fmt$(r.monto)}</td>
        </tr>)}</tbody>
      </table></div>
    </div>

    {["ingreso","gasto"].map(tipo=><Modal key={tipo} open={modal===tipo} onClose={()=>setModal(null)} title={`Registrar ${tipo==="ingreso"?"Ingreso":"Gasto"}`}>
      <div className="fg">
        <div className="fgrp"><label>Fecha</label><input type="date" value={form.fecha||""} onChange={e=>setForm(f=>({...f,fecha:e.target.value}))}/></div>
        <div className="fgrp"><label>Categoría</label><select value={form.categoria||""} onChange={e=>setForm(f=>({...f,categoria:e.target.value}))}><option value="">Seleccionar...</option>{(tipo==="ingreso"?CATSING:CATSGAS).map(c=><option key={c}>{c}</option>)}</select></div>
        <div className="fgrp"><label>Descripción</label><input value={form.descripcion||""} onChange={e=>setForm(f=>({...f,descripcion:e.target.value}))}/></div>
        <div className="fgrp"><label>Monto ($)</label><input type="number" step="0.01" value={form.monto||""} onChange={e=>setForm(f=>({...f,monto:e.target.value}))}/></div>
        <div className="fgrp"><label>Módulo</label><select value={form.modulo||""} onChange={e=>setForm(f=>({...f,modulo:e.target.value}))}><option value="">Seleccionar...</option><option>Cerdos</option><option>Ñame</option><option>General</option></select></div>
        {tipo==="gasto"&&<><div className="fgrp"><label>Pagado por</label><select value={form.pagado_por||""} onChange={e=>setForm(f=>({...f,pagado_por:e.target.value}))}><option value="">Seleccionar...</option><option>Roberto</option><option>Richard</option><option>Puercos</option></select></div>
        <div className="fgrp"><label>Soporte / Comprobante</label><input value={form.soporte||""} onChange={e=>setForm(f=>({...f,soporte:e.target.value}))}/></div></>}
      </div>
      <div className="fl gap2 mt4">
        <button className="btn btn-p" onClick={()=>save(tipo)} disabled={saving}>{saving?"Guardando...":"Guardar"}</button>
        <button className="btn btn-o" onClick={()=>setModal(null)}>Cancelar</button>
      </div>
    </Modal>)}
  </div>;
}

// ─── DEUDAS ───────────────────────────────────────────────────────────────────
function Deudas({deudas,onRefresh,role,toast}){
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({});
  const [saving,setSaving]=useState(false);

  const cobrar=deudas.filter(d=>d.tipo==="cobrar"&&d.estado!=="Pagado");
  const pagar=deudas.filter(d=>d.tipo==="pagar"&&d.estado!=="Pagado");

  const add=async()=>{
    setSaving(true);
    const {error}=await supabase.from("deudas").insert({...form,monto:Number(form.monto)});
    setSaving(false);
    if(error)toast(error.message,"error");else{toast("Deuda registrada ✓");setModal(false);setForm({});onRefresh();}
  };
  const marcar=async(id)=>{
    const {error}=await supabase.from("deudas").update({estado:"Pagado"}).eq("id",id);
    if(error)toast(error.message,"error");else{toast("Marcado como pagado ✓");onRefresh();}
  };

  const Tbl=({items,titulo,col})=><div className="card mb4">
    <div className="card-h"><h3>{titulo}</h3><span style={{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,color:col}}>{fmt$(items.reduce((s,d)=>s+Number(d.monto),0))}</span></div>
    <div className="tw"><table><thead><tr><th>Nombre</th><th>Descripción</th><th>Monto</th><th>Vence</th><th>Estado</th>{role==="admin"&&<th></th>}</tr></thead>
    <tbody>{items.length===0?<tr><td colSpan={6} style={{textAlign:"center",padding:20,color:G.g500}}>Sin registros pendientes</td></tr>:items.map(d=><tr key={d.id}>
      <td style={{fontWeight:600}}>{d.nombre}</td><td style={{fontSize:12}}>{d.descripcion}</td>
      <td style={{fontWeight:700}}>{fmt$(d.monto)}</td><td>{d.fecha_vence||"-"}</td>
      <td><span className={`badge ${d.estado==="Pagado"?"bg":d.estado==="Vencido"?"br":"bo"}`}>{d.estado}</span></td>
      {role==="admin"&&<td>{d.estado!=="Pagado"&&<button className="btn btn-sm btn-p" onClick={()=>marcar(d.id)}>✓</button>}</td>}
    </tr>)}</tbody></table></div>
  </div>;

  return <div>
    <div className="sg mb4">
      <div className="sc"><span className="si">📥</span><span className="sl">Por Cobrar</span><span className="sv" style={{color:G.deep}}>{fmt$(cobrar.reduce((s,d)=>s+Number(d.monto),0))}</span></div>
      <div className="sc"><span className="si">📤</span><span className="sl">Por Pagar</span><span className="sv" style={{color:G.red}}>{fmt$(pagar.reduce((s,d)=>s+Number(d.monto),0))}</span></div>
      <div className="sc"><span className="si">⚠️</span><span className="sl">Vencidas</span><span className="sv" style={{color:G.gold}}>{deudas.filter(d=>d.estado==="Vencido").length}</span></div>
    </div>
    {role==="admin"&&<div className="mb4"><button className="btn btn-p" onClick={()=>{setModal(true);setForm({});}}>+ Registrar Cuenta</button></div>}
    <Tbl items={cobrar} titulo="📥 Cuentas por Cobrar" col={G.deep}/>
    <Tbl items={pagar} titulo="📤 Cuentas por Pagar" col={G.red}/>
    <Modal open={modal} onClose={()=>setModal(false)} title="Nueva Cuenta">
      <div className="fg">
        <div className="fgrp"><label>Tipo</label><select value={form.tipo||""} onChange={e=>setForm(f=>({...f,tipo:e.target.value}))}><option value="">Seleccionar...</option><option value="cobrar">Por Cobrar</option><option value="pagar">Por Pagar</option></select></div>
        <div className="fgrp"><label>Nombre</label><input value={form.nombre||""} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))}/></div>
        <div className="fgrp"><label>Descripción</label><input value={form.descripcion||""} onChange={e=>setForm(f=>({...f,descripcion:e.target.value}))}/></div>
        <div className="fgrp"><label>Monto ($)</label><input type="number" step="0.01" value={form.monto||""} onChange={e=>setForm(f=>({...f,monto:e.target.value}))}/></div>
        <div className="fgrp"><label>Fecha Vencimiento</label><input type="date" value={form.fecha_vence||""} onChange={e=>setForm(f=>({...f,fecha_vence:e.target.value}))}/></div>
      </div>
      <div className="fl gap2 mt4"><button className="btn btn-p" onClick={add} disabled={saving}>{saving?"Guardando...":"Guardar"}</button><button className="btn btn-o" onClick={()=>setModal(false)}>Cancelar</button></div>
    </Modal>
  </div>;
}

// ─── INVENTARIO ───────────────────────────────────────────────────────────────
function Inventario({inventario,onRefresh,role,toast}){
  const [modal,setModal]=useState(false);
  const [form,setForm]=useState({});
  const [saving,setSaving]=useState(false);

  const add=async()=>{
    setSaving(true);
    const {error}=await supabase.from("inventario").insert({...form,cantidad:Number(form.cantidad),minimo:Number(form.minimo),costo_unit:Number(form.costo_unit||0)});
    setSaving(false);
    if(error)toast(error.message,"error");else{toast("Item agregado ✓");setModal(false);setForm({});onRefresh();}
  };
  const cats=[...new Set(inventario.map(i=>i.categoria))];

  return <div>
    <div className="sg mb4">
      <div className="sc"><span className="si">📦</span><span className="sl">Total Items</span><span className="sv">{inventario.length}</span></div>
      <div className="sc"><span className="si">⚠️</span><span className="sl">Stock Bajo</span><span className="sv" style={{color:G.gold}}>{inventario.filter(i=>i.cantidad<=i.minimo).length}</span></div>
      <div className="sc grn"><span className="si">💵</span><span className="sl">Valor Total</span><span className="sv" style={{fontSize:18}}>{fmt$(inventario.reduce((s,i)=>s+i.cantidad*i.costo_unit,0))}</span></div>
    </div>
    {role==="admin"&&<div className="mb4"><button className="btn btn-p" onClick={()=>{setModal(true);setForm({});}}>+ Agregar Item</button></div>}
    {(cats.length===0?["Alimento","Medicina","Herramienta","Insumo Agrícola"]:cats).map(cat=>{
      const items=inventario.filter(i=>i.categoria===cat);
      if(items.length===0)return null;
      const icon=cat==="Alimento"?"🌾":cat==="Medicina"?"💊":cat==="Herramienta"?"🔧":"🌱";
      return <div key={cat} className="card mb4">
        <div className="card-h"><h3>{icon} {cat}</h3></div>
        <div className="tw"><table><thead><tr><th>Item</th><th>Unidad</th><th>Cantidad</th><th>Mínimo</th><th>Costo Unit.</th><th>Valor</th><th>Estado</th></tr></thead>
        <tbody>{items.map(item=><tr key={item.id}>
          <td style={{fontWeight:600}}>{item.item}</td><td className="muted">{item.unidad}</td>
          <td style={{fontWeight:700}}>{item.cantidad}</td><td>{item.minimo}</td>
          <td>{fmt$(item.costo_unit)}</td><td style={{fontWeight:600}}>{fmt$(item.cantidad*item.costo_unit)}</td>
          <td><span className={`badge ${item.cantidad<=item.minimo?"br":item.cantidad<=item.minimo*1.5?"bo":"bg"}`}>{item.cantidad<=item.minimo?"Bajo":item.cantidad<=item.minimo*1.5?"Normal":"OK"}</span></td>
        </tr>)}</tbody></table></div>
      </div>;
    })}
    {inventario.length===0&&<div className="card"><div className="card-b" style={{textAlign:"center",padding:40,color:G.g500}}>Sin items en inventario. Agrega el primero.</div></div>}

    <Modal open={modal} onClose={()=>setModal(false)} title="Nuevo Item de Inventario">
      <div className="fg">
        <div className="fgrp"><label>Categoría</label><select value={form.categoria||""} onChange={e=>setForm(f=>({...f,categoria:e.target.value}))}><option value="">Seleccionar...</option><option>Alimento</option><option>Medicina</option><option>Herramienta</option><option>Insumo Agrícola</option></select></div>
        <div className="fgrp"><label>Item</label><input value={form.item||""} onChange={e=>setForm(f=>({...f,item:e.target.value}))}/></div>
        <div className="fgrp"><label>Unidad</label><input value={form.unidad||""} onChange={e=>setForm(f=>({...f,unidad:e.target.value}))}/></div>
        <div className="fgrp"><label>Cantidad</label><input type="number" step="0.01" value={form.cantidad||""} onChange={e=>setForm(f=>({...f,cantidad:e.target.value}))}/></div>
        <div className="fgrp"><label>Mínimo</label><input type="number" step="0.01" value={form.minimo||""} onChange={e=>setForm(f=>({...f,minimo:e.target.value}))}/></div>
        <div className="fgrp"><label>Costo Unitario ($)</label><input type="number" step="0.01" value={form.costo_unit||""} onChange={e=>setForm(f=>({...f,costo_unit:e.target.value}))}/></div>
      </div>
      <div className="fl gap2 mt4"><button className="btn btn-p" onClick={add} disabled={saving}>{saving?"Guardando...":"Guardar"}</button><button className="btn btn-o" onClick={()=>setModal(false)}>Cancelar</button></div>
    </Modal>
  </div>;
}

// ─── REPORTES ─────────────────────────────────────────────────────────────────
function Reportes({gastos,ingresos}){
  const [anio,setAnio]=useState("todos");
  const [tabR,setTabR]=useState("pl"); // pl | indicadores | tendencia | socios | categorias
  const gF=anio==="todos"?gastos:gastos.filter(g=>g.anio===Number(anio));
  const iF=anio==="todos"?ingresos:ingresos.filter(i=>i.anio===Number(anio));
  const totG=gF.reduce((s,x)=>s+Number(x.monto),0);
  const totI=iF.reduce((s,x)=>s+Number(x.monto),0);
  const balance=totI-totG;
  const margenNeto=totG>0?((balance/totG)*100):0;
  const roi=totG>0?((totI/totG-1)*100):0;

  const anos=[...new Set([...gastos,...ingresos].map(x=>x.anio))].sort((a,b)=>b-a);
  const MESES=["","Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

  // ── P&L data ──
  const CATS_GAS=["Alimento (Crecimiento)","Alimento (Gestación)","Alimento (Lactancia)","Veterinario y Insumos Medicos","Gastos de Parto","Compra de Lechones (Madres New y Verracos)","Infraestructura","Semilla","Mozos","Supervision de proyecto","Herramientas","Quimicos (Fertilizantes - Pestecidas)","Arado Mecanizado","Otro"];
  const CATS_ING=["Ingresos por ventas (Lechones)","Ingresos por ventas (Cerdas Madres)","Ingresos por Ñame","Otro"];
  const anosDisp=anio==="todos"?anos:[Number(anio)];
  const mesesDisp=Array.from({length:12},(_,i)=>i+1);

  const plIng=CATS_ING.map(cat=>({
    cat,
    total:iF.filter(x=>x.categoria===cat).reduce((s,x)=>s+Number(x.monto),0),
    meses:mesesDisp.map(m=>({m,v:iF.filter(x=>x.categoria===cat&&(anio==="todos"||x.mes===m)).reduce((s,x)=>s+Number(x.monto),0)}))
  })).filter(r=>r.total>0||anio!=="todos");

  const plGas=CATS_GAS.map(cat=>({
    cat,
    total:gF.filter(x=>x.categoria===cat).reduce((s,x)=>s+Number(x.monto),0),
    meses:mesesDisp.map(m=>({m,v:gF.filter(x=>x.categoria===cat&&(anio==="todos"||x.mes===m)).reduce((s,x)=>s+Number(x.monto),0)}))
  })).filter(r=>r.total>0||anio!=="todos");

  const plMesTotI=mesesDisp.map(m=>iF.filter(x=>anio==="todos"||x.mes===m).reduce((s,x)=>s+Number(x.monto),0));
  const plMesTotG=mesesDisp.map(m=>gF.filter(x=>anio==="todos"||x.mes===m).reduce((s,x)=>s+Number(x.monto),0));
  const plMesTotN=mesesDisp.map((_,i)=>plMesTotI[i]-plMesTotG[i]);

  // socios
  const socioData={Roberto:0,Richard:0,Puercos:0,"Ñames":0};
  gF.forEach(g=>{if(g.pagado_por&&socioData[g.pagado_por]!==undefined)socioData[g.pagado_por]+=Number(g.monto);});
  const socioMeses=Object.keys(socioData).reduce((acc,s)=>{
    acc[s]=mesesDisp.map(m=>gF.filter(x=>x.pagado_por===s&&(anio==="todos"||x.mes===m)).reduce((sum,x)=>sum+Number(x.monto),0));
    return acc;
  },{});
  const socMesTot=mesesDisp.map(m=>Object.values(socioMeses).reduce((s,arr)=>s+arr[m-1],0));

  // categorias breakdown
  const catBreak={};gF.forEach(g=>{catBreak[g.categoria]=(catBreak[g.categoria]||0)+Number(g.monto);});
  const catSorted=Object.entries(catBreak).sort((a,b)=>b[1]-a[1]);
  const maxCat=catSorted[0]?.[1]||1;

  // 12-month trend
  const now=new Date();
  const trend=Array.from({length:12},(_,i)=>{
    const d=new Date(now.getFullYear(),now.getMonth()-11+i,1);
    const m=d.getMonth()+1;const y=d.getFullYear();
    return {lab:`${MESES[m]}'${String(y).slice(2)}`,ing:ingresos.filter(x=>x.mes===m&&x.anio===y).reduce((s,x)=>s+Number(x.monto),0),gas:gastos.filter(x=>x.mes===m&&x.anio===y).reduce((s,x)=>s+Number(x.monto),0)};
  });
  const maxT=Math.max(...trend.map(d=>Math.max(d.ing,d.gas)),1);

  // indicadores
  const modCerdos={g:gF.filter(x=>x.modulo==="Cerdos").reduce((s,x)=>s+Number(x.monto),0),i:iF.filter(x=>x.modulo==="Cerdos").reduce((s,x)=>s+Number(x.monto),0)};
  const modName={g:gF.filter(x=>x.modulo==="Ñame").reduce((s,x)=>s+Number(x.monto),0),i:iF.filter(x=>x.modulo==="Ñame").reduce((s,x)=>s+Number(x.monto),0)};
  const mesesActivos=trend.filter(t=>t.ing>0||t.gas>0).length||1;
  const promedioMensualGas=totG/mesesActivos;
  const promedioMensualIng=totI/mesesActivos;
  const mesesConBalance=mesesDisp.filter((_,i)=>plMesTotN[i]>0).length;
  const puntoEquilibrio=totG>0&&totI>0?(totG/(totI/mesesActivos)).toFixed(1):"-";

  const cellSt=(v,isTotal)=>({padding:"7px 10px",textAlign:"right",fontWeight:isTotal?700:400,fontSize:isTotal?13:12,color:v<0?G.red:v>0&&isTotal?G.deep:G.g700,background:isTotal?"rgba(201,168,76,0.07)":"transparent",whiteSpace:"nowrap"});
  const fmtCell=v=>v===0?"—":fmt$(v);

  const exportarExcel=(mes,anioSel)=>{
    const MESES_FULL=["","Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    const hoy=new Date();
    const mesLabel=mes?`${MESES_FULL[mes]} ${anioSel}`:"Histórico";
    const gMes=mes?gastos.filter(g=>g.mes===mes&&g.anio===anioSel):gastos;
    const iMes=mes?ingresos.filter(i=>i.mes===mes&&i.anio===anioSel):ingresos;
    const tGMes=gMes.reduce((s,x)=>s+Number(x.monto),0);
    const tIMes=iMes.reduce((s,x)=>s+Number(x.monto),0);
    const balMes=tIMes-tGMes;
    const tGHist=gastos.reduce((s,x)=>s+Number(x.monto),0);
    const tIHist=ingresos.reduce((s,x)=>s+Number(x.monto),0);
    const balHist=tIHist-tGHist;
    const roiMes=tGMes>0?((tIMes/tGMes-1)*100).toFixed(2):0;
    const roiHist=tGHist>0?((tIHist/tGHist-1)*100).toFixed(2):0;

    const catIngMes={};iMes.forEach(x=>{catIngMes[x.categoria]=(catIngMes[x.categoria]||0)+Number(x.monto);});
    const catGasMes={};gMes.forEach(x=>{catGasMes[x.categoria]=(catGasMes[x.categoria]||0)+Number(x.monto);});
    const catIngHist={};ingresos.forEach(x=>{catIngHist[x.categoria]=(catIngHist[x.categoria]||0)+Number(x.monto);});
    const catGasHist={};gastos.forEach(x=>{catGasHist[x.categoria]=(catGasHist[x.categoria]||0)+Number(x.monto);});
    const socMes={Roberto:0,Richard:0,Puercos:0,"Ñames":0};
    gMes.forEach(g=>{if(g.pagado_por&&socMes[g.pagado_por]!==undefined)socMes[g.pagado_por]+=Number(g.monto);});
    const socHist={Roberto:0,Richard:0,Puercos:0,"Ñames":0};
    gastos.forEach(g=>{if(g.pagado_por&&socHist[g.pagado_por]!==undefined)socHist[g.pagado_por]+=Number(g.monto);});

    const esc=v=>`"${String(v).replace(/"/g,'\"')}"`;
    const rows=[];
    rows.push(["FINCA NAVAS — INFORME EJECUTIVO DE CIERRE"]);
    rows.push([`Período: ${mesLabel}`]);
    rows.push([`Generado: ${hoy.toLocaleDateString("es-PA")}`]);
    rows.push([]);
    // KPIs período
    rows.push(["=== RESUMEN "+mesLabel.toUpperCase()+" ==="]);
    rows.push(["Concepto","Monto"]);
    rows.push(["Ingresos",tIMes]);
    rows.push(["Gastos",tGMes]);
    rows.push(["Balance",balMes]);
    rows.push(["ROI (%)",roiMes]);
    rows.push([]);
    // P&L Período
    rows.push(["=== P&L "+mesLabel.toUpperCase()+" ==="]);
    rows.push(["Categoría","Tipo","Monto"]);
    Object.entries(catIngMes).forEach(([c,v])=>rows.push([c,"Ingreso",v]));
    rows.push(["TOTAL INGRESOS","",tIMes]);
    Object.entries(catGasMes).sort((a,b)=>b[1]-a[1]).forEach(([c,v])=>rows.push([c,"Gasto",v]));
    rows.push(["TOTAL GASTOS","",tGMes]);
    rows.push(["RESULTADO NETO","",balMes]);
    rows.push([]);
    // KPIs histórico
    rows.push(["=== RESUMEN HISTÓRICO ACUMULADO ==="]);
    rows.push(["Concepto","Monto"]);
    rows.push(["Ingresos Histórico",tIHist]);
    rows.push(["Gastos Histórico",tGHist]);
    rows.push(["Balance Histórico",balHist]);
    rows.push(["ROI Histórico (%)",roiHist]);
    rows.push([]);
    // P&L Histórico
    rows.push(["=== P&L HISTÓRICO COMPLETO ==="]);
    rows.push(["Categoría","Tipo","Monto"]);
    Object.entries(catIngHist).forEach(([c,v])=>rows.push([c,"Ingreso",v]));
    rows.push(["TOTAL INGRESOS","",tIHist]);
    Object.entries(catGasHist).sort((a,b)=>b[1]-a[1]).forEach(([c,v])=>rows.push([c,"Gasto",v]));
    rows.push(["TOTAL GASTOS","",tGHist]);
    rows.push(["RESULTADO NETO","",balHist]);
    rows.push([]);
    // Comparativo
    if(mes){
      rows.push(["=== COMPARATIVO: "+mesLabel.toUpperCase()+" vs HISTÓRICO ==="]);
      rows.push(["Concepto",mesLabel,"Histórico","Diferencia"]);
      rows.push(["Ingresos",tIMes,tIHist,tIMes-tIHist]);
      rows.push(["Gastos",tGMes,tGHist,tGMes-tGHist]);
      rows.push(["Balance",balMes,balHist,balMes-balHist]);
      rows.push(["ROI (%)",roiMes,roiHist,(Number(roiMes)-Number(roiHist)).toFixed(2)]);
      rows.push([]);
    }
    // Socios
    rows.push(["=== APORTACIONES POR SOCIO / NEGOCIO ==="]);
    rows.push(["Fuente",mesLabel,"Histórico"]);
    Object.entries(socHist).forEach(([s,vh])=>rows.push([s,socMes[s]||0,vh]));
    rows.push([]);
    // Detalle gastos
    rows.push(["=== DETALLE GASTOS "+mesLabel.toUpperCase()+" ==="]);
    rows.push(["Fecha","Categoría","Descripción","Módulo","Pagado por","Monto"]);
    gMes.forEach(g=>rows.push([g.fecha,g.categoria,g.descripcion||"—",g.modulo||"—",g.pagado_por||"—",Number(g.monto)]));
    rows.push([]);
    // Detalle ingresos
    rows.push(["=== DETALLE INGRESOS "+mesLabel.toUpperCase()+" ==="]);
    rows.push(["Fecha","Categoría","Descripción","Módulo","Monto"]);
    iMes.forEach(i=>rows.push([i.fecha,i.categoria,i.descripcion||"—",i.modulo||"—",Number(i.monto)]));

    const csv="\uFEFF"+rows.map(r=>r.map(c=>typeof c==="number"?c:esc(c||"\u2014")).join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;a.download=`FincaNavas_Cierre_${mesLabel.replace(" ","_")}.csv`;
    a.click();URL.revokeObjectURL(url);
  };

  return <div>
    {/* Header filtros */}
    <div className="fl gap2 mb4" style={{flexWrap:"wrap",justifyContent:"space-between"}}>
      <div className="fl gap2" style={{flexWrap:"wrap"}}>
        {["todos",...anos.map(String)].map(a=><button key={a} className={`btn ${anio===a?"btn-p":"btn-o"} btn-sm`} onClick={()=>setAnio(a)}>{a==="todos"?"Todo":a}</button>)}
      </div>
      <div className="fl gap2">
        {anio!=="todos"&&<select style={{padding:"5px 10px",borderRadius:8,border:`1.5px solid ${G.g300}`,fontSize:12,fontFamily:"DM Sans,sans-serif"}} onChange={e=>{const m=Number(e.target.value);if(m)exportarExcel(m,Number(anio));}} defaultValue="">
          <option value="">📊 Exportar mes a Excel...</option>
          {["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"].map((m,i)=><option key={i} value={i+1}>{m}</option>)}
        </select>}
        <button className="btn btn-o btn-sm" onClick={()=>exportarExcel(null,null)} style={{borderColor:G.gold,color:G.gold}}>📊 Histórico Excel</button>
      </div>
    </div>

    {/* KPIs globales */}
    <div className="sg" style={{marginBottom:20}}>
      <div className="sc grn"><span className="si">💰</span><span className="sl">Ingresos</span><span className="sv">{fmt$(totI)}</span></div>
      <div className="sc"><span className="si">📤</span><span className="sl">Egresos</span><span className="sv" style={{color:G.red}}>{fmt$(totG)}</span></div>
      <div className="sc"><span className="si">📊</span><span className="sl">Balance</span><span className="sv" style={{color:balance>=0?G.deep:G.red}}>{fmt$(balance)}</span><span className={`str ${balance<0?"neg":""}`}>{balance>=0?"✓ Positivo":"⚠ Negativo"}</span></div>
      <div className="sc"><span className="si">💹</span><span className="sl">ROI</span><span className="sv" style={{color:roi>=0?G.deep:G.red}}>{roi.toFixed(1)}%</span><span className="str">retorno sobre inversión</span></div>
      <div className="sc"><span className="si">📉</span><span className="sl">Margen Neto</span><span className="sv" style={{color:margenNeto>=0?G.deep:G.red}}>{margenNeto.toFixed(1)}%</span></div>
      <div className="sc"><span className="si">🗓</span><span className="sl">Meses Rentables</span><span className="sv">{mesesConBalance}<span style={{fontSize:14,color:G.g500}}>/12</span></span></div>
    </div>

    {/* Tabs reportes */}
    <div className="tabs mb4">
      {[["pl","📋 P&L"],["indicadores","📐 Indicadores"],["tendencia","📈 Tendencia"],["socios","👥 Socios"],["categorias","🗂 Categorías"]].map(([k,l])=>
        <button key={k} className={`tab ${tabR===k?"active":""}`} onClick={()=>setTabR(k)}>{l}</button>)}
    </div>

    {/* ── TAB: P&L ── */}
    {tabR==="pl"&&<div className="card">
      <div className="card-h"><h3>📋 Estado de Resultados (P&L)</h3><span style={{fontSize:12,color:G.g500}}>{anio==="todos"?"Histórico":anio}</span></div>
      <div className="tw"><table style={{fontSize:12}}>
        <thead><tr>
          <th style={{minWidth:220}}>Concepto</th>
          {anio!=="todos"?mesesDisp.map(m=><th key={m} style={{textAlign:"right",minWidth:70}}>{MESES[m]}</th>):<th style={{textAlign:"right"}}>Total</th>}
          <th style={{textAlign:"right",background:"rgba(201,168,76,0.1)"}}>Total</th>
        </tr></thead>
        <tbody>
          {/* Ingresos */}
          <tr><td colSpan={anio!=="todos"?14:3} style={{background:G.pale,fontWeight:700,fontSize:12,padding:"6px 10px",color:G.deep}}>▲ INGRESOS</td></tr>
          {plIng.map(r=><tr key={r.cat}>
            <td style={{padding:"6px 10px",fontSize:12,color:G.g700,paddingLeft:20}}>{r.cat}</td>
            {anio!=="todos"?r.meses.map(({m,v})=><td key={m} style={cellSt(v,false)}>{fmtCell(v)}</td>):<td style={cellSt(r.total,false)}>{fmtCell(r.total)}</td>}
            <td style={cellSt(r.total,true)}>{fmtCell(r.total)}</td>
          </tr>)}
          <tr style={{borderTop:`2px solid ${G.beigeD}`}}>
            <td style={{padding:"8px 10px",fontWeight:700,fontSize:13}}>Total Ingresos</td>
            {anio!=="todos"?plMesTotI.map((v,i)=><td key={i} style={cellSt(v,true)}>{fmtCell(v)}</td>):<td style={cellSt(totI,true)}>{fmtCell(totI)}</td>}
            <td style={{...cellSt(totI,true),background:"rgba(27,67,50,0.1)",color:G.deep}}>{fmt$(totI)}</td>
          </tr>
          {/* Gastos */}
          <tr><td colSpan={anio!=="todos"?14:3} style={{background:"#FEF2F2",fontWeight:700,fontSize:12,padding:"6px 10px",color:G.red}}>▼ GASTOS</td></tr>
          {plGas.map(r=><tr key={r.cat}>
            <td style={{padding:"6px 10px",fontSize:12,color:G.g700,paddingLeft:20}}>{r.cat}</td>
            {anio!=="todos"?r.meses.map(({m,v})=><td key={m} style={{...cellSt(0,false),color:v>0?G.red:G.g300}}>{v>0?fmt$(v):"—"}</td>):<td style={{...cellSt(0,false),color:r.total>0?G.red:G.g300}}>{r.total>0?fmt$(r.total):"—"}</td>}
            <td style={{...cellSt(r.total,true),color:G.red}}>{r.total>0?fmt$(r.total):"—"}</td>
          </tr>)}
          <tr style={{borderTop:`2px solid ${G.beigeD}`}}>
            <td style={{padding:"8px 10px",fontWeight:700,fontSize:13}}>Total Gastos</td>
            {anio!=="todos"?plMesTotG.map((v,i)=><td key={i} style={{...cellSt(v,true),color:G.red}}>{fmtCell(v)}</td>):<td style={{...cellSt(totG,true),color:G.red}}>{fmtCell(totG)}</td>}
            <td style={{...cellSt(totG,true),background:"rgba(153,27,27,0.07)",color:G.red}}>{fmt$(totG)}</td>
          </tr>
          {/* Total neto */}
          <tr style={{borderTop:`3px solid ${G.deep}`}}>
            <td style={{padding:"10px 10px",fontWeight:900,fontSize:14,color:G.deep}}>💰 RESULTADO NETO</td>
            {anio!=="todos"?plMesTotN.map((v,i)=><td key={i} style={{padding:"10px 10px",textAlign:"right",fontWeight:800,fontSize:13,color:v<0?G.red:v>0?"#0F6E56":G.g500,background:"rgba(201,168,76,0.05)"}}>{v===0?"—":fmt$(v)}</td>):<td style={{padding:"10px",textAlign:"right",fontWeight:800,color:balance<0?G.red:"#0F6E56"}}>{fmt$(balance)}</td>}
            <td style={{padding:"10px",textAlign:"right",fontWeight:900,fontSize:15,color:balance<0?G.red:"#0F6E56",background:"rgba(201,168,76,0.12)"}}>{fmt$(balance)}</td>
          </tr>
          {/* Socios P&L */}
          <tr><td colSpan={anio!=="todos"?14:3} style={{background:G.goldL,fontWeight:700,fontSize:12,padding:"6px 10px",color:G.gold}}>👥 APORTACIONES</td></tr>
          {Object.entries(socioMeses).map(([s,arr])=><tr key={s}>
            <td style={{padding:"6px 10px",fontSize:12,color:G.g700,paddingLeft:20}}>{s}</td>
            {anio!=="todos"?arr.map((v,i)=><td key={i} style={{...cellSt(0,false),color:v>0?G.gold:G.g300}}>{v>0?fmt$(v):"—"}</td>):<td style={{...cellSt(0,false),color:socioData[s]>0?G.gold:G.g300}}>{socioData[s]>0?fmt$(socioData[s]):"—"}</td>}
            <td style={{...cellSt(socioData[s],true),color:G.gold}}>{socioData[s]>0?fmt$(socioData[s]):"—"}</td>
          </tr>)}
          <tr style={{borderTop:`2px solid ${G.beigeD}`}}>
            <td style={{padding:"8px 10px",fontWeight:700,fontSize:13}}>Total Aportaciones</td>
            {anio!=="todos"?socMesTot.map((v,i)=><td key={i} style={{...cellSt(v,true),color:G.gold}}>{v>0?fmt$(v):"—"}</td>):<td style={{...cellSt(Object.values(socioData).reduce((a,b)=>a+b,0),true),color:G.gold}}>{fmt$(Object.values(socioData).reduce((a,b)=>a+b,0))}</td>}
            <td style={{...cellSt(Object.values(socioData).reduce((a,b)=>a+b,0),true),color:G.gold,background:"rgba(201,168,76,0.1)"}}>{fmt$(Object.values(socioData).reduce((a,b)=>a+b,0))}</td>
          </tr>
        </tbody>
      </table></div>
    </div>}

    {/* ── TAB: INDICADORES ── */}
    {tabR==="indicadores"&&<div>
      <div className="sg">
        <div className="sc"><span className="si">🐷</span><span className="sl">Ingresos Cerdos</span><span className="sv">{fmt$(modCerdos.i)}</span><span className="str">Gastos: {fmt$(modCerdos.g)}</span></div>
        <div className="sc"><span className="si">🌿</span><span className="sl">Ingresos Ñame</span><span className="sv">{fmt$(modName.i)}</span><span className="str">Gastos: {fmt$(modName.g)}</span></div>
        <div className="sc"><span className="si">⚖️</span><span className="sl">Balance Cerdos</span><span className="sv" style={{color:modCerdos.i-modCerdos.g>=0?G.deep:G.red}}>{fmt$(modCerdos.i-modCerdos.g)}</span></div>
        <div className="sc"><span className="si">⚖️</span><span className="sl">Balance Ñame</span><span className="sv" style={{color:modName.i-modName.g>=0?G.deep:G.red}}>{fmt$(modName.i-modName.g)}</span></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16,marginTop:4}}>
        <div className="card"><div className="card-h"><h3>📐 Rentabilidad</h3></div><div className="card-b">
          {[
            {l:"ROI General",v:`${roi.toFixed(1)}%`,d:"Retorno sobre cada $ invertido",ok:roi>=0},
            {l:"Margen Neto",v:`${margenNeto.toFixed(1)}%`,d:"Balance / Total gastos",ok:margenNeto>=0},
            {l:"ROI Cerdos",v:modCerdos.g>0?`${((modCerdos.i/modCerdos.g-1)*100).toFixed(1)}%`:"—",d:"Retorno módulo porcino",ok:modCerdos.i>=modCerdos.g},
            {l:"ROI Ñame",v:modName.g>0?`${((modName.i/modName.g-1)*100).toFixed(1)}%`:"—",d:"Retorno módulo ñame",ok:modName.i>=modName.g},
          ].map(({l,v,d,ok})=><div key={l} style={{marginBottom:14,paddingBottom:14,borderBottom:`1px solid ${G.beigeD}`}}>
            <div className="fb"><span style={{fontSize:13,fontWeight:600,color:G.g700}}>{l}</span><span style={{fontWeight:800,fontSize:18,color:ok?G.deep:G.red}}>{v}</span></div>
            <span style={{fontSize:11,color:G.g500}}>{d}</span>
          </div>)}
        </div></div>

        <div className="card"><div className="card-h"><h3>📅 Promedios Mensuales</h3></div><div className="card-b">
          {[
            {l:"Gasto promedio/mes",v:fmt$(promedioMensualGas),d:`Sobre ${mesesActivos} meses activos`},
            {l:"Ingreso promedio/mes",v:fmt$(promedioMensualIng),d:"Ingresos / meses activos"},
            {l:"Balance promedio/mes",v:fmt$(promedioMensualIng-promedioMensualGas),d:"Resultado mensual esperado",ok:(promedioMensualIng-promedioMensualGas)>=0},
            {l:"Meses rentables",v:`${mesesConBalance} / 12`,d:"Meses con balance positivo",ok:mesesConBalance>=6},
          ].map(({l,v,d,ok})=><div key={l} style={{marginBottom:14,paddingBottom:14,borderBottom:`1px solid ${G.beigeD}`}}>
            <div className="fb"><span style={{fontSize:13,fontWeight:600,color:G.g700}}>{l}</span><span style={{fontWeight:800,fontSize:16,color:ok===false?G.red:G.deep}}>{v}</span></div>
            <span style={{fontSize:11,color:G.g500}}>{d}</span>
          </div>)}
        </div></div>

        <div className="card"><div className="card-h"><h3>🎯 Punto de Equilibrio</h3></div><div className="card-b">
          <p style={{fontSize:12,color:G.g500,marginBottom:16}}>¿Cuántos meses de ingresos se necesitan para cubrir todos los gastos?</p>
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:48,fontWeight:900,color:G.deep,lineHeight:1}}>{puntoEquilibrio}</div>
            <div style={{fontSize:13,color:G.g500,marginTop:6}}>meses para cubrir gastos totales</div>
          </div>
          <div style={{borderTop:`1px solid ${G.beigeD}`,paddingTop:14,marginTop:4}}>
            {[
              {l:"Gastos totales",v:fmt$(totG)},
              {l:"Ingreso mensual prom.",v:fmt$(promedioMensualIng)},
              {l:"Gasto mensual prom.",v:fmt$(promedioMensualGas)},
            ].map(({l,v})=><div key={l} className="fb" style={{marginBottom:8}}><span style={{fontSize:12,color:G.g500}}>{l}</span><span style={{fontWeight:600,fontSize:13}}>{v}</span></div>)}
          </div>
        </div></div>

        <div className="card"><div className="card-h"><h3>🏭 Por Módulo</h3></div><div className="card-b">
          {[{label:"Cerdos 🐷",...modCerdos},{label:"Ñame 🌿",...modName}].map(m=><div key={m.label} style={{marginBottom:18}}>
            <p style={{fontWeight:700,marginBottom:8,fontSize:13.5}}>{m.label}</p>
            <div className="fb" style={{marginBottom:4}}><span style={{fontSize:12,color:G.g500}}>Gastos</span><span style={{fontWeight:700,color:G.red,fontSize:12.5}}>{fmt$(m.g)}</span></div>
            <div className="prog-bar"><div className="prog-fill" style={{width:`${(m.g/Math.max(modCerdos.g,modName.g,1))*100}%`,background:G.red}}></div></div>
            <div className="fb mt3" style={{marginBottom:4}}><span style={{fontSize:12,color:G.g500}}>Ingresos</span><span style={{fontWeight:700,color:G.deep,fontSize:12.5}}>{fmt$(m.i)}</span></div>
            <div className="prog-bar"><div className="prog-fill" style={{width:`${(m.i/Math.max(modCerdos.i||1,modName.i||1,1))*100}%`,background:G.mid}}></div></div>
            <p style={{fontSize:11.5,color:m.i-m.g>=0?G.mid:G.red,marginTop:6,fontWeight:600}}>Balance: {fmt$(m.i-m.g)}</p>
            <hr style={{border:"none",borderTop:`1px solid ${G.beigeD}`,marginTop:10}}/>
          </div>)}
        </div></div>
      </div>
    </div>}

    {/* ── TAB: TENDENCIA ── */}
    {tabR==="tendencia"&&<div className="card">
      <div className="card-h"><h3>📈 Tendencia Últimos 12 Meses</h3></div>
      <div className="card-b">
        <div style={{display:"flex",gap:16,marginBottom:14}}>
          <span style={{fontSize:11,color:G.g500,display:"flex",alignItems:"center",gap:4}}><span style={{display:"inline-block",width:12,height:12,borderRadius:2,background:G.mid}}></span>Ingresos</span>
          <span style={{fontSize:11,color:G.g500,display:"flex",alignItems:"center",gap:4}}><span style={{display:"inline-block",width:12,height:12,borderRadius:2,background:G.beigeD}}></span>Gastos</span>
        </div>
        <div className="bar-chart" style={{height:180}}>{trend.map((d,i)=><div key={i} className="bar-w">
          <div style={{display:"flex",alignItems:"flex-end",gap:2,height:155}}>
            <div className="bar" style={{height:`${(d.ing/maxT)*155}px`,background:G.mid}}></div>
            <div className="bar" style={{height:`${(d.gas/maxT)*155}px`,background:G.beigeD}}></div>
          </div>
          <span className="blab" style={{fontSize:9}}>{d.lab}</span>
        </div>)}</div>
        <div style={{marginTop:20}}>
          <table style={{width:"100%",fontSize:12,borderCollapse:"collapse"}}>
            <thead><tr><th style={{textAlign:"left",padding:"6px 8px",background:G.beige}}>Mes</th><th style={{textAlign:"right",padding:"6px 8px",background:G.beige}}>Ingresos</th><th style={{textAlign:"right",padding:"6px 8px",background:G.beige}}>Gastos</th><th style={{textAlign:"right",padding:"6px 8px",background:G.beige}}>Resultado</th></tr></thead>
            <tbody>{trend.map((d,i)=>{const net=d.ing-d.gas;return<tr key={i} style={{borderBottom:`1px solid ${G.beigeD}`}}>
              <td style={{padding:"6px 8px",fontWeight:600}}>{d.lab}</td>
              <td style={{padding:"6px 8px",textAlign:"right",color:G.deep}}>{d.ing>0?fmt$(d.ing):"—"}</td>
              <td style={{padding:"6px 8px",textAlign:"right",color:d.gas>0?G.red:G.g300}}>{d.gas>0?fmt$(d.gas):"—"}</td>
              <td style={{padding:"6px 8px",textAlign:"right",fontWeight:700,color:net<0?G.red:net>0?"#0F6E56":G.g300}}>{net!==0?fmt$(net):"—"}</td>
            </tr>;})}
            </tbody>
          </table>
        </div>
      </div>
    </div>}

    {/* ── TAB: SOCIOS ── */}
    {tabR==="socios"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
      <div className="card"><div className="card-h"><h3>👥 Aportaciones por Socio</h3></div><div className="card-b">
        {(()=>{const socios={Roberto:socioData.Roberto||0,Richard:socioData.Richard||0};const totS=Object.values(socios).reduce((a,b)=>a+b,1);return<>
          {Object.entries(socios).map(([s,v])=><div key={s} style={{marginBottom:16}}>
            <div className="fb" style={{marginBottom:5}}><span style={{fontSize:14,fontWeight:700}}>{s}</span><span style={{fontWeight:800,color:G.deep,fontSize:16}}>{fmt$(v)}<span style={{fontSize:11,color:G.g500,fontWeight:400,marginLeft:4}}>({((v/totS)*100).toFixed(1)}%)</span></span></div>
            <div className="prog-bar" style={{height:10}}><div className="prog-fill" style={{width:`${(v/totS)*100}%`,background:G.light}}></div></div>
          </div>)}
          <div style={{borderTop:`2px solid ${G.beigeD}`,paddingTop:12,marginTop:4}}>
            <div className="fb"><span style={{fontWeight:700}}>Total Socios</span><span style={{fontWeight:900,color:G.deep,fontSize:16}}>{fmt$(Object.values(socios).reduce((a,b)=>a+b,0))}</span></div>
          </div>
        </>})()}
      </div></div>
      <div className="card"><div className="card-h"><h3>💼 Financiado por Negocio</h3></div><div className="card-b">
        {(()=>{const neg={Puercos:socioData.Puercos||0,"Ñames":socioData["Ñames"]||0};const totN=Object.values(neg).reduce((a,b)=>a+b,1);return<>
          {Object.entries(neg).map(([s,v])=><div key={s} style={{marginBottom:16}}>
            <div className="fb" style={{marginBottom:5}}><span style={{fontSize:14,fontWeight:700}}>{s}</span><span style={{fontWeight:800,color:G.gold,fontSize:16}}>{fmt$(v)}<span style={{fontSize:11,color:G.g500,fontWeight:400,marginLeft:4}}>({((v/totN)*100).toFixed(1)}%)</span></span></div>
            <div className="prog-bar" style={{height:10}}><div className="prog-fill" style={{width:`${(v/totN)*100}%`,background:G.gold}}></div></div>
          </div>)}
          <div style={{borderTop:`2px solid ${G.beigeD}`,paddingTop:12,marginTop:4}}>
            <div className="fb"><span style={{fontWeight:700}}>Total Negocios</span><span style={{fontWeight:900,color:G.gold,fontSize:16}}>{fmt$(Object.values(neg).reduce((a,b)=>a+b,0))}</span></div>
          </div>
        </>})()}
      </div></div>
      <div className="card"><div className="card-h"><h3>📊 Resumen General</h3></div><div className="card-b">
        {[
          {l:"Total aportado (socios)",v:fmt$(socioData.Roberto+socioData.Richard),c:G.deep},
          {l:"Total aportado (negocios)",v:fmt$(socioData.Puercos+socioData["Ñames"]),c:G.gold},
          {l:"Total general",v:fmt$(Object.values(socioData).reduce((a,b)=>a+b,0)),c:G.deep},
          {l:"vs. Gastos totales",v:`${totG>0?((Object.values(socioData).reduce((a,b)=>a+b,0)/totG)*100).toFixed(1):0}%`,c:G.mid},
        ].map(({l,v,c})=><div key={l} className="fb" style={{marginBottom:14,paddingBottom:14,borderBottom:`1px solid ${G.beigeD}`}}>
          <span style={{fontSize:13,color:G.g500}}>{l}</span><span style={{fontWeight:800,fontSize:16,color:c}}>{v}</span>
        </div>)}
      </div></div>
    </div>}

    {/* ── TAB: CATEGORÍAS ── */}
    {tabR==="categorias"&&<div className="card">
      <div className="card-h"><h3>🗂 Desglose por Categoría</h3></div>
      <div className="tw"><table><thead><tr><th>Categoría</th><th>Módulo</th><th>Total</th><th>% del gasto</th><th>Barra</th></tr></thead>
      <tbody>{catSorted.map(([cat,val])=>{
        const mod=gF.find(g=>g.categoria===cat)?.modulo||"-";
        return<tr key={cat}>
          <td style={{fontSize:12.5}}>{cat}</td>
          <td><span className={`badge ${mod==="Cerdos"?"bg":"bo"}`}>{mod}</span></td>
          <td style={{fontWeight:700,color:G.red}}>{fmt$(val)}</td>
          <td style={{fontWeight:600}}>{totG>0?((val/totG)*100).toFixed(1):0}%</td>
          <td><div style={{width:120,height:7,background:G.beige,borderRadius:4,overflow:"hidden"}}><div style={{width:`${(val/maxCat)*100}%`,height:"100%",background:G.red,borderRadius:4}}></div></div></td>
        </tr>;
      })}</tbody></table></div>
    </div>}
  </div>;
}


// ─── MÓDULO PRODUCCIÓN PORCINA ────────────────────────────────────────────────
function CerdosModule({role,toast}){
  const [tab,setTab]=useState("timeline");
  const [cerdas,setCerdas]=useState([]);
  const [partos,setPartos]=useState([]);
  const [montas,setMontas]=useState([]);
  const [vacunas,setVacunas]=useState([]);
  const [ventas,setVentas]=useState([]);
  const [loading,setLoading]=useState(true);
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const [saving,setSaving]=useState(false);
  const [editItem,setEditItem]=useState(null);
  const [timelineMeses,setTimelinesMeses]=useState(6);
  const [timelineOffset,setTimelineOffset]=useState(0);

  const fetchPorcino=async(showLoading=true)=>{
    if(showLoading)setLoading(true);
    const [c,p,m,v,vt]=await Promise.all([
      supabase.from("cerdas").select("*").order("codigo"),
      supabase.from("partos").select("*,cerdas(nombre,codigo)").order("fecha_parto",{ascending:false}),
      supabase.from("celos_montas").select("*,cerdas!celos_montas_cerda_id_fkey(nombre,codigo)").order("fecha_monta",{ascending:false}),
      supabase.from("vacunas_cerdas").select("*,cerdas(nombre,codigo)").order("fecha",{ascending:false}),
      supabase.from("ventas_lechones").select("*").order("fecha",{ascending:false}),
    ]);
    setCerdas(c.data||[]);setPartos(p.data||[]);setMontas(m.data||[]);
    setVacunas(v.data||[]);setVentas(vt.data||[]);
    if(showLoading)setLoading(false);
  };

  useEffect(()=>{fetchPorcino();},[]);

  const madres=cerdas.filter(c=>c.tipo==="Madre"&&c.estado==="Activa");
  const verracos=cerdas.filter(c=>c.tipo==="Verraco");
  const totalLechones=partos.reduce((s,p)=>s+p.lechones_vivos,0);
  const totalVentas=ventas.reduce((s,v)=>s+Number(v.total),0);
  const vendidosReales=ventas.filter(v=>(!v.tipo||v.tipo==="Lechon")&&v.estatus!=="Abono").reduce((s,v)=>s+v.cantidad,0);

  // Helpers
  const GEST=114,LACT=28,DESC=21;
  const addD=(d,n)=>{const r=new Date(d);r.setDate(r.getDate()+n);return r;};
  const diffD=(a,b)=>Math.ceil((new Date(b)-new Date(a))/(1000*60*60*24));
  const fmtS=(d)=>d?new Date(d).toLocaleDateString("es-PA",{day:"numeric",month:"short"}):"-";
  const toISO=(d)=>{if(!d)return"";if(typeof d==="string"&&d.length>=10)return d.substring(0,10);const dt=new Date(d);return dt.toISOString().split("T")[0];};
  const fmtDisp=(d)=>{
    if(!d)return"-";
    const dt=new Date(d+"T12:00:00");
    return dt.toLocaleDateString("es-PA",{day:"2-digit",month:"short",year:"2-digit"}).replace(/ /g,"-");
  };
  const calcEdad=(fecha_nac,fecha_fin=null)=>{
    if(!fecha_nac)return"-";
    const desde=new Date(fecha_nac);
    const hasta=fecha_fin?new Date(fecha_fin):new Date();
    const meses=Math.floor((hasta-desde)/(1000*60*60*24*30.44));
    if(meses<1)return"<1 mes";
    if(meses<24)return meses+" meses";
    const anos=Math.floor(meses/12);
    const m=meses%12;
    return anos+"a"+(m>0?" "+m+"m":"");
  };
  const pctPos=(d,start,total)=>Math.max(0,Math.min(100,(new Date(d)-new Date(start))/total*100));
  const TODAY=new Date();
  const ESTADOS=["Activa","Inactiva","Vendida","Muerta"];
  const VACUNAS_TIPOS=["Parvovirus","Erisipela","Leptospira","Influenza","PRRS","Vitaminas","Desparasitante","Hierro lechones","Otro"];

  // CRUD operations
  const saveNew=async(tabla,datos)=>{
    setSaving(true);
    let ok=false;
    try{
      const {error}=await supabase.from(tabla).insert(datos);
      if(error)toast(error.message,"error");
      else{ok=true;toast("Guardado ✓");}
    }catch(e){toast(e.message,"error");}
    finally{setSaving(false);}
    if(ok){setModal(null);setForm({});fetchPorcino(false);}
  };

  const updateRow=async(tabla,id,datos)=>{
    setSaving(true);
    const clean=Object.fromEntries(Object.entries(datos).filter(([k,v])=>v===null||typeof v!=="object"||v instanceof Date));
    let ok=false;
    try{
      const {error}=await supabase.from(tabla).update(clean).eq("id",id);
      if(error){toast(error.message,"error");}
      else{ok=true;toast("Actualizado ✓");}
    }catch(e){toast(e.message,"error");}
    finally{setSaving(false);}
    if(ok){setModal(null);setForm({});setEditItem(null);fetchPorcino(false);}
  };

  const deleteRow=async(tabla,id)=>{
    if(!window.confirm("¿Eliminar este registro?"))return;
    try{
      const {error}=await supabase.from(tabla).delete().eq("id",id);
      if(error)toast(error.message,"error");
      else{toast("Eliminado ✓");fetchPorcino(false);}
    }catch(e){toast(e.message,"error");}
  };

  const openEdit=(tipo,item)=>{setEditItem({tipo,...item});setForm({...item});setModal("edit_"+tipo);};
  const openNew=(tipo,defaults={})=>{setForm({...defaults});setModal("new_"+tipo);};

  if(loading)return <div className="loading"><div className="spinner"></div><span>Cargando datos porcinos...</span></div>;

  // Group data
  const montasByCerda={};
  montas.forEach(m=>{const n=m.cerdas?.nombre||"?";if(!montasByCerda[n])montasByCerda[n]=[];montasByCerda[n].push(m);});
  const partosByCerda={};
  partos.forEach(p=>{const n=p.cerdas?.nombre||"?";if(!partosByCerda[n])partosByCerda[n]=[];partosByCerda[n].push(p);});
  const vacunasByCerda={};
  vacunas.forEach(v=>{const n=v.cerdas?.nombre||"?";if(!vacunasByCerda[n])vacunasByCerda[n]=[];vacunasByCerda[n].push(v);});

  const estadoBadge=(e)=>e==="Activa"?"bg":e==="Muerta"?"br":e==="Vendida"?"bo":"bk";
  const estadoProduccion=(cerda)=>{
    if(cerda.estado!=="Activa")return{label:cerda.estado,color:G.g500,bg:G.g100};
    const cPartos=partos.filter(p=>p.cerda_id===cerda.id).sort((a,b)=>b.fecha_parto.localeCompare(a.fecha_parto));
    const cMontas=montas.filter(m=>m.cerda_id===cerda.id).sort((a,b)=>b.fecha_monta.localeCompare(a.fecha_monta));
    const lastParto=cPartos[0];
    const lastMonta=cMontas[0];
    if(lastParto){
      const dp=diffD(lastParto.fecha_parto,TODAY);
      if(dp>=0&&dp<LACT)return{label:`Lactancia D${dp}`,color:"#0F6E56",bg:"#E1F5EE"};
      if(dp>=LACT&&dp<LACT+DESC)return{label:"Descanso",color:"#534AB7",bg:"#EEEDFE"};
    }
    if(lastMonta){
      const proxParto=addD(lastMonta.fecha_monta,GEST);
      const dm=diffD(TODAY,proxParto);
      if(dm>0&&dm<=GEST){
        const diasGest=GEST-dm;
        return{label:`Gestación D${diasGest}`,color:"#185FA5",bg:"#E6F1FB"};
      }
    }
    return{label:"Activa",color:G.deep,bg:G.pale};
  };

  const buildTimelineData=()=>{
    const meses=timelineMeses;
    const base=new Date(TODAY.getFullYear(),TODAY.getMonth()-Math.floor(meses/3)+timelineOffset,1);
    const tStart=new Date(base);
    const tEnd=new Date(tStart);tEnd.setMonth(tEnd.getMonth()+meses);
    const total=tEnd-tStart;
    const todayPct=pctPos(TODAY,tStart,total);

    const monthLabels=[];
    let cur=new Date(tStart);
    while(cur<tEnd){monthLabels.push(cur.toLocaleDateString("es-PA",{month:"short",year:"2-digit"}));cur.setMonth(cur.getMonth()+1);}

    const rows=cerdas.filter(c=>c.tipo==="Madre"&&c.estado==="Activa").map(c=>{
      const cPartos=partos.filter(p=>p.cerda_id===c.id).sort((a,b)=>a.fecha_parto.localeCompare(b.fecha_parto));
      const cMontas=montas.filter(m=>m.cerda_id===c.id).sort((a,b)=>a.fecha_monta.localeCompare(b.fecha_monta));
      const lastParto=cPartos[cPartos.length-1];
      const lastMonta=cMontas[cMontas.length-1];

      // Calculate projected next cycle
      let proxMonta=null,proxParto=null;
      if(lastParto){
        const destete=addD(lastParto.fecha_parto,LACT);
        const descFin=addD(destete,DESC);
        proxMonta=descFin>TODAY?descFin:addD(TODAY,7);
        proxParto=addD(proxMonta,GEST);
      } else if(lastMonta){
        proxParto=addD(lastMonta.fecha_monta,GEST);
      }

      // Segments
      const segs=[];
      cPartos.forEach(p=>{
        const gS=addD(p.fecha_parto,-GEST),lE=addD(p.fecha_parto,LACT),dE=addD(lE,DESC);
        const gs=pctPos(gS,tStart,total),ge=pctPos(p.fecha_parto,tStart,total);
        const ls=ge,le=pctPos(lE,tStart,total),ds=le,de=pctPos(dE,tStart,total);
        if(ge>gs)segs.push({l:gs,w:ge-gs,color:"#9FE1CB",title:`Gestación → parto ${fmtS(p.fecha_parto)}`});
        if(le>ls)segs.push({l:ls,w:le-ls,color:"#5DCAA5",title:`Lactancia hasta ${fmtS(lE)}`});
        if(de>ds)segs.push({l:ds,w:de-ds,color:"#AFA9EC",title:"Descanso/celo"});
      });
      if(proxMonta&&proxParto){
        const lE=addD(proxParto,LACT);
        const ps=pctPos(proxMonta,tStart,total),pe=pctPos(proxParto,tStart,total);
        const ls=pe,le=pctPos(lE,tStart,total);
        if(pe>ps)segs.push({l:ps,w:pe-ps,color:"#FAC775",proj:true,title:`Gestación proy. → ${fmtS(proxParto)}`});
        if(le>ls)segs.push({l:ls,w:le-ls,color:"#EF9F27",proj:true,title:"Lactancia proyectada"});
      }

      // Dots
      const dots=[];
      cPartos.forEach(p=>{const x=pctPos(p.fecha_parto,tStart,total);if(x>=0&&x<=100)dots.push({x,color:"#378ADD",title:`Parto ${fmtS(p.fecha_parto)} — ${p.lechones_vivos} lech.`});});
      cMontas.forEach(m=>{const x=pctPos(m.fecha_monta,tStart,total);if(x>=0&&x<=100)dots.push({x,color:"#639922",title:`Monta ${fmtS(m.fecha_monta)}`});});
      if(proxMonta){const x=pctPos(proxMonta,tStart,total);if(x>=0&&x<=100)dots.push({x,color:"#EF9F27",title:`Monta proy. ${fmtS(proxMonta)}`});}
      if(proxParto){const x=pctPos(proxParto,tStart,total);if(x>=0&&x<=100)dots.push({x,color:"#E24B4A",title:`Parto proy. ${fmtS(proxParto)}`});}

      // Status
      let sLabel="Activa",sColor=G.deep,sBg=G.pale;
      if(c.estado!=="Activa"){sLabel=c.estado;sColor=G.g500;sBg=G.g100;}
      else if(proxParto){
        const d=diffD(TODAY,proxParto);
        if(d<0&&-d<LACT){sLabel=`Lactancia D${-d}`;sColor="#0F6E56";sBg="#E1F5EE";}
        else if(d>=0&&d<=14){sLabel=`Parto en ${d}d`;sColor=G.red;sBg=G.redL;}
        else if(d>=0&&d<=30){sLabel=`Parto proy. ${fmtS(proxParto)}`;sColor=G.gold;sBg=G.goldL;}
        else if(d>0){sLabel=`Parto: ${fmtS(proxParto)}`;sColor=G.blue;sBg=G.blueL;}
      }

      // Checklist
      const checks=[];
      if(lastParto&&c.estado==="Activa"){
        const dp=diffD(lastParto.fecha_parto,TODAY);
        if(dp>=0&&dp<35){
          if(dp<3)checks.push({l:`Hierro lechones (D${3-dp})`,s:"pending"});
          else checks.push({l:"Hierro lechones ✓",s:"done"});
          if(dp<7)checks.push({l:`Descolmillar (D${7-dp})`,s:"pending"});
          else checks.push({l:"Descolmillar ✓",s:"done"});
          if(dp<21)checks.push({l:`Capar machos (D${21-dp})`,s:"pending"});
          else checks.push({l:"Capar machos ✓",s:"done"});
        }
      }
      const vCerda=vacunas.filter(v=>v.cerda_id===c.id&&v.proxima_dosis);
      vCerda.forEach(v=>{
        const d=diffD(TODAY,v.proxima_dosis);
        if(d<0)checks.push({l:`${v.vacuna} VENCIDA`,s:"alert"});
        else if(d<30)checks.push({l:`${v.vacuna} (${d}d)`,s:"pending"});
      });

      return {c,segs,dots,proxParto,proxMonta,lastParto,sLabel,sColor,sBg,checks,totalLech:cPartos.reduce((s,p)=>s+p.lechones_vivos,0),nPartos:cPartos.length};
    });

    return {rows,monthLabels,todayPct,tStart,total};
  };

  return <div>
    {/* Stats */}
    <div className="sg">
      <div className="sc grn"><span className="si">🐷</span><span className="sl">Cerdas Activas</span><span className="sv">{madres.length}</span><span className="str">En producción</span></div>
      <div className="sc"><span className="si">🐗</span><span className="sl">Verracos</span><span className="sv">{verracos.length}</span><span className="str">{verracos.map(v=>v.nombre).join(", ")||"-"}</span></div>
      <div className="sc"><span className="si">🐣</span><span className="sl">Total Partos</span><span className="sv">{partos.length}</span><span className="str">{totalLechones} lechones histórico</span></div>
      <div className="sc"><span className="si">💰</span><span className="sl">Ventas Lechones</span><span className="sv" style={{fontSize:18}}>{fmt$(totalVentas)}</span><span className="str">{ventas.reduce((s,v)=>s+v.cantidad,0)} vendidos</span></div>
    </div>

    {/* Tabs + Add button */}
    <div className="fl mb4" style={{flexWrap:"wrap",gap:4}}>
      <div className="tabs" style={{marginBottom:0,flex:1}}>
        {[["timeline","📅 Timeline"],["cerdas","🐷 Inventario"],["montas","❤️ Montas"],["partos","🐣 Partos"],["vacunas","💉 Vacunas"],["ventas","🤝 Ventas"]].map(([t,l])=>
          <button key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>{l}</button>
        )}
      </div>
      {role==="admin"&&tab!=="timeline"&&<button className="btn btn-p btn-sm" style={{marginLeft:8}} onClick={()=>openNew(
        tab==="cerdas"?"cerda":tab==="montas"?"monta":tab==="partos"?"parto":tab==="vacunas"?"vacuna":"venta",
        tab==="montas"?{fecha_monta:toISO(TODAY)}:tab==="partos"?{fecha_parto:toISO(TODAY)}:tab==="vacunas"?{fecha:toISO(TODAY)}:tab==="ventas"?{fecha:toISO(TODAY)}:{}
      )}>+ Agregar</button>}
    </div>

    {/* ── TIMELINE ── */}
    {tab==="timeline"&&(()=>{
      const {rows,monthLabels,todayPct}=buildTimelineData();
      return <div>
        {/* Timeline controls */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
            <span style={{fontSize:12,color:G.g500,fontWeight:600}}>Rango:</span>
            {[["6m",6],["12m",12],["18m",18],["24m",24],["Todo",36]].map(([l,v])=>
              <button key={v} className={`btn btn-sm ${timelineMeses===v?"btn-p":"btn-o"}`}
                onClick={()=>{setTimelinesMeses(v);setTimelineOffset(0);}}>{l}</button>
            )}
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <button className="btn btn-sm btn-o" onClick={()=>setTimelineOffset(o=>o-Math.floor(timelineMeses/2))}>« Anterior</button>
            <button className="btn btn-sm btn-o" onClick={()=>setTimelineOffset(0)} style={{fontSize:11}}>Hoy</button>
            <button className="btn btn-sm btn-o" onClick={()=>setTimelineOffset(o=>o+Math.floor(timelineMeses/2))}>Siguiente »</button>
          </div>
        </div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:14}}>
          {[["#9FE1CB","Gestación"],["#5DCAA5","Lactancia"],["#AFA9EC","Descanso"],["#FAC775","Proyectado"]].map(([c,l])=>
            <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:G.g500}}>
              <div style={{width:12,height:12,borderRadius:3,background:c}}></div>{l}
            </div>)}
          {[["#378ADD","Parto real"],["#639922","Monta"],["#E24B4A","Parto proy."]].map(([c,l])=>
            <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:G.g500}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:c}}></div>{l}
            </div>)}
        </div>
        <div style={{display:"flex",marginBottom:4,paddingLeft:90}}>
          {monthLabels.map((m,i)=><div key={i} style={{flex:1,fontSize:10,color:G.g500,textAlign:"center",borderLeft:`0.5px solid ${G.beigeD}`,paddingLeft:2}}>{m}</div>)}
        </div>
        {rows.map(({c,segs,dots,proxParto,sLabel,sColor,sBg,checks,totalLech,nPartos})=><div key={c.id} className="card mb4" style={{overflow:"hidden"}}>
          <div style={{display:"flex",alignItems:"stretch"}}>
            <div style={{width:88,flexShrink:0,padding:"10px",borderRight:`0.5px solid ${G.beigeD}`,display:"flex",flexDirection:"column",justifyContent:"center",gap:4}}>
              <span style={{fontWeight:600,fontSize:13}}>{c.nombre}</span>
              <span style={{fontSize:10,padding:"2px 6px",borderRadius:20,background:sBg,color:sColor,textAlign:"center"}}>{sLabel}</span>
            </div>
            <div style={{flex:1,padding:"10px 8px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"relative",height:24,background:G.beige,borderRadius:4}}>
                {segs.map((s,i)=><div key={i} title={s.title} style={{position:"absolute",left:`${s.l.toFixed(1)}%`,width:`${Math.max(s.w,0.5).toFixed(1)}%`,height:"100%",background:s.color,borderRadius:3,border:s.proj?"1px dashed rgba(0,0,0,.2)":"none"}}></div>)}
                {dots.map((d,i)=><div key={i} title={d.title} style={{position:"absolute",left:`${d.x.toFixed(1)}%`,top:"50%",width:9,height:9,borderRadius:"50%",background:d.color,border:`1.5px solid ${G.white}`,transform:"translate(-50%,-50%)",zIndex:5}}></div>)}
                <div style={{position:"absolute",left:`${todayPct.toFixed(1)}%`,top:-4,bottom:-4,width:2,background:G.red,borderRadius:1,zIndex:10}}>
                  <span style={{position:"absolute",top:-14,fontSize:9,color:G.red,fontWeight:600,transform:"translateX(-50%)",whiteSpace:"nowrap"}}>hoy</span>
                </div>
              </div>
              {checks.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6}}>
                {checks.map((ch,i)=><span key={i} style={{fontSize:10,padding:"2px 7px",borderRadius:20,background:ch.s==="done"?G.pale:ch.s==="alert"?G.redL:G.goldL,color:ch.s==="done"?G.deep:ch.s==="alert"?G.red:G.gold}}>{ch.l}</span>)}
              </div>}
            </div>
            <div style={{width:90,flexShrink:0,padding:"10px 8px",borderLeft:`0.5px solid ${G.beigeD}`,display:"flex",flexDirection:"column",justifyContent:"center",gap:3,fontSize:11,color:G.g500}}>
              <div>Partos: <strong style={{color:G.deep}}>{nPartos}</strong></div>
              <div>Lechones: <strong style={{color:G.deep}}>{totalLech}</strong></div>
              {proxParto&&<div style={{color:diffD(TODAY,proxParto)<14?G.red:G.gold,fontWeight:600,fontSize:10}}>{fmtS(proxParto)}</div>}
            </div>
          </div>
        </div>)}
      </div>;
    })()}

    {/* ── INVENTARIO ── */}
    {tab==="cerdas"&&<div>
      <div className="card mb4">
        <div className="card-h"><h3>🐷 Cerdas Madres Activas</h3><span className="badge bg">{cerdas.filter(c=>c.tipo==="Madre"&&c.estado==="Activa").length}</span></div>
        <div className="tw"><table>
          <thead><tr><th>Código</th><th>Nombre</th><th>Estado</th><th>Producción</th><th>Nacimiento</th><th>Edad</th><th>Peso</th><th>Partos</th><th>Notas</th>{role==="admin"&&<th></th>}</tr></thead>
          <tbody>{cerdas.filter(c=>c.tipo==="Madre"&&c.estado==="Activa").map(c=><tr key={c.id}>
            <td style={{fontFamily:"monospace",fontSize:12}}>{c.codigo}</td>
            <td style={{fontWeight:700}}>{c.nombre}</td>
            <td><span className={`badge ${estadoBadge(c.estado)}`}>{c.estado}</span></td>
            <td>{(()=>{const ep=estadoProduccion(c);return <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:ep.bg,color:ep.color,fontWeight:600,whiteSpace:"nowrap"}}>{ep.label}</span>;})()}</td>
            <td style={{fontSize:12}}>{c.fecha_nacimiento||"-"}</td>
            <td style={{fontSize:12,fontWeight:600,color:G.deep}}>{calcEdad(c.fecha_nacimiento)}</td>
            <td>{c.peso_kg?`${c.peso_kg}kg`:"-"}</td>
            <td style={{fontWeight:600,color:G.deep}}>{partos.filter(p=>p.cerda_id===c.id).length}</td>
            <td style={{fontSize:12,color:G.g500}}>{c.notas||"-"}</td>
            {role==="admin"&&<td><button className="btn btn-sm btn-o" onClick={()=>openEdit("cerda",c)}>✏</button></td>}
          </tr>)}</tbody>
        </table></div>
      </div>
      {cerdas.filter(c=>c.tipo==="Madre"&&c.estado!=="Activa").length>0&&<div className="card mb4">
        <div className="card-h"><h3>📋 Historial Madres</h3><span className="badge bk">{cerdas.filter(c=>c.tipo==="Madre"&&c.estado!=="Activa").length}</span></div>
        <div className="tw"><table>
          <thead><tr><th>Código</th><th>Nombre</th><th>Estado</th><th>Partos</th><th>Notas</th>{role==="admin"&&<th></th>}</tr></thead>
          <tbody>{cerdas.filter(c=>c.tipo==="Madre"&&c.estado!=="Activa").map(c=><tr key={c.id}>
            <td style={{fontFamily:"monospace",fontSize:12}}>{c.codigo}</td>
            <td style={{fontWeight:600,color:G.g500}}>{c.nombre}</td>
            <td><span className={`badge ${estadoBadge(c.estado)}`}>{c.estado}</span></td>
            <td>{partos.filter(p=>p.cerda_id===c.id).length}</td>
            <td style={{fontSize:12,color:G.g500}}>{c.notas||"-"}</td>
            {role==="admin"&&<td><button className="btn btn-sm btn-o" onClick={()=>openEdit("cerda",c)}>✏</button></td>}
          </tr>)}</tbody>
        </table></div>
      </div>}
      <div className="card">
        <div className="card-h"><h3>🐗 Verracos</h3></div>
        <div className="tw"><table>
          <thead><tr><th>Código</th><th>Nombre</th><th>Estado</th><th>Peso</th><th>Notas</th>{role==="admin"&&<th></th>}</tr></thead>
          <tbody>{cerdas.filter(c=>c.tipo==="Verraco").map(c=><tr key={c.id}>
            <td style={{fontFamily:"monospace",fontSize:12}}>{c.codigo}</td>
            <td style={{fontWeight:700}}>{c.nombre}</td>
            <td><span className={`badge ${estadoBadge(c.estado)}`}>{c.estado}</span></td>
            <td>{c.peso_kg?`${c.peso_kg}kg`:"-"}</td>
            <td style={{fontSize:12,color:G.g500}}>{c.notas||"-"}</td>
            {role==="admin"&&<td><button className="btn btn-sm btn-o" onClick={()=>openEdit("cerda",c)}>✏</button></td>}
          </tr>)}</tbody>
        </table></div>
      </div>
    </div>}

    {/* ── MONTAS ── */}
    {tab==="montas"&&<div>
      {Object.entries(montasByCerda).map(([nombre,mts])=><div key={nombre} className="card mb4">
        <div className="card-h">
          <h3>❤️ {nombre}</h3>
          <div className="fl gap2">
            <span className="badge bo">{mts.length} montas</span>
            {role==="admin"&&<button className="btn btn-sm btn-p" onClick={()=>{
              const cerda=cerdas.find(c=>c.nombre===nombre);
              openNew("monta",{cerda_id:cerda?.id||"",fecha_monta:toISO(TODAY)});
            }}>+ Monta</button>}
          </div>
        </div>
        <div className="tw"><table>
          <thead><tr><th>Fecha Monta</th><th>Parto Est. (114d)</th><th>Parto Real</th><th>Días restantes</th><th>Confirmado</th><th>Notas</th>{role==="admin"&&<th></th>}</tr></thead>
          <tbody>{mts.map(m=>{
            const fp=m.fecha_monta?toISO(addD(m.fecha_monta,GEST)):"";
            const partoReal=partos.find(p=>p.cerda_id===m.cerda_id&&Math.abs(diffD(fp,p.fecha_parto))<=30);
            const dias=fp?diffD(TODAY,fp):null;
            return <tr key={m.id}>
              <td style={{fontWeight:600}}>{fmtDisp(m.fecha_monta)}</td>
              <td style={{color:G.gold,fontWeight:600}}>{fp?fmtDisp(fp):"-"}</td>
              <td style={{fontWeight:600,color:partoReal?G.deep:G.g300}}>{partoReal?fmtDisp(partoReal.fecha_parto):"-"}</td>
              <td>{dias!==null?<span style={{fontWeight:700,color:dias<0?G.g500:dias<14?G.red:dias<30?G.gold:G.deep}}>{dias<0?partoReal?"✓ Parto":"No preñada":dias+"d"}</span>:"-"}</td>
              <td><span className={`badge ${m.confirmado?"bg":"bo"}`}>{m.confirmado?"✓ Confirmado":"Pendiente"}</span></td>
              <td style={{fontSize:12,color:G.g500}}>{m.notas||"-"}</td>
              {role==="admin"&&<td style={{display:"flex",gap:4}}>
                <button className="btn btn-sm btn-o" onClick={()=>openEdit("monta",m)}>✏</button>
                <button className="btn btn-sm" style={{background:G.redL,color:G.red,border:"none"}} onClick={()=>deleteRow("celos_montas",m.id)}>✕</button>
              </td>}
            </tr>;
          })}</tbody>
        </table></div>
      </div>)}
    </div>}

    {/* ── PARTOS ── */}
    {tab==="partos"&&<div>
      {Object.entries(partosByCerda).sort((a,b)=>b[1][0].fecha_parto.localeCompare(a[1][0].fecha_parto)).map(([nombre,pts])=>{
        const totV=pts.reduce((s,p)=>s+p.lechones_vivos,0);
        const totM=pts.reduce((s,p)=>s+p.lechones_muertos,0);
        const cerda=cerdas.find(c=>c.nombre===nombre);
        return <div key={nombre} className="card mb4">
          <div className="card-h">
            <h3>🐣 {nombre}</h3>
            <div className="fl gap2">
              <span className="badge bg">{pts.length} partos · {totV} vivos</span>
              {totM>0&&<span className="badge br">{totM} muertos</span>}
              {role==="admin"&&<button className="btn btn-sm btn-p" onClick={()=>openNew("parto",{cerda_id:cerda?.id||"",fecha_parto:toISO(TODAY)})}>+ Parto</button>}
            </div>
          </div>
          <div className="tw"><table>
            <thead><tr><th>Fecha Parto</th><th>Vivos</th><th>Muertos</th><th>Total</th><th>Notas</th>{role==="admin"&&<th></th>}</tr></thead>
            <tbody>{pts.map(p=><tr key={p.id}>
              <td style={{fontWeight:600}}>{fmtDisp(p.fecha_parto)}</td>
              <td style={{fontWeight:700,color:G.deep}}>{p.lechones_vivos}</td>
              <td style={{color:p.lechones_muertos>0?G.red:G.g500}}>{p.lechones_muertos}</td>
              <td style={{fontWeight:700}}>{p.lechones_vivos+p.lechones_muertos}</td>
              <td style={{fontSize:12,color:G.g500}}>{p.notas||"-"}</td>
              {role==="admin"&&<td style={{display:"flex",gap:4}}>
                <button className="btn btn-sm btn-o" onClick={()=>openEdit("parto",p)}>✏</button>
                <button className="btn btn-sm" style={{background:G.redL,color:G.red,border:"none"}} onClick={()=>deleteRow("partos",p.id)}>✕</button>
              </td>}
            </tr>)}</tbody>
          </table></div>
          <div style={{padding:"8px 20px",background:G.beige,display:"flex",gap:20,fontSize:13}}>
            <span>Total partos: <strong>{pts.length}</strong></span>
            <span>Lechones vivos: <strong style={{color:G.deep}}>{totV}</strong></span>
            <span>Promedio/parto: <strong>{(totV/pts.length).toFixed(1)}</strong></span>
          </div>
        </div>;
      })}
    </div>}

    {/* ── VACUNAS ── */}
    {tab==="vacunas"&&<div>
      {Object.entries(vacunasByCerda).map(([nombre,vacs])=>{
        const cerda=cerdas.find(c=>c.nombre===nombre);
        const proxima=vacs.find(v=>v.proxima_dosis&&diffD(TODAY,v.proxima_dosis)>=0);
        const vencida=vacs.find(v=>v.proxima_dosis&&diffD(TODAY,v.proxima_dosis)<0);
        return <div key={nombre} className="card mb4">
          <div className="card-h">
            <h3>💉 {nombre}</h3>
            <div className="fl gap2">
              {proxima&&<span className="badge bo">Próx: {proxima.proxima_dosis} ({diffD(TODAY,proxima.proxima_dosis)}d)</span>}
              {vencida&&<span className="badge br">⚠ Dosis vencida</span>}
              {role==="admin"&&<button className="btn btn-sm btn-p" onClick={()=>openNew("vacuna",{cerda_id:cerda?.id||"",fecha:toISO(TODAY)})}>+ Vacuna</button>}
            </div>
          </div>
          <div className="tw"><table>
            <thead><tr><th>Vacuna</th><th>Fecha</th><th>Próxima Dosis</th><th>Días</th><th>Veterinario</th>{role==="admin"&&<th></th>}</tr></thead>
            <tbody>{vacs.map(v=>{
              const dias=v.proxima_dosis?diffD(TODAY,v.proxima_dosis):null;
              return <tr key={v.id}>
                <td><span className="badge bb">{v.vacuna}</span></td>
                <td>{fmtDisp(v.fecha)}</td>
                <td style={{color:dias!==null&&dias<7?G.red:G.g700,fontWeight:dias!==null&&dias<7?700:400}}>{fmtDisp(v.proxima_dosis)}</td>
                <td>{dias!==null?<span style={{fontWeight:700,color:dias<0?G.g500:dias<7?G.red:dias<30?G.gold:G.deep}}>{dias<0?"Vencida":dias+"d"}</span>:"-"}</td>
                <td style={{fontSize:12}}>{v.veterinario||"-"}</td>
                {role==="admin"&&<td style={{display:"flex",gap:4}}>
                  <button className="btn btn-sm btn-o" onClick={()=>openEdit("vacuna",v)}>✏</button>
                  <button className="btn btn-sm" style={{background:G.redL,color:G.red,border:"none"}} onClick={()=>deleteRow("vacunas_cerdas",v.id)}>✕</button>
                </td>}
              </tr>;
            })}</tbody>
          </table></div>
        </div>;
      })}
      {Object.keys(vacunasByCerda).length===0&&<div className="card"><div className="card-b" style={{textAlign:"center",padding:30,color:G.g500}}>Sin registros de vacunas</div></div>}
    </div>}

    {/* ── VENTAS ── */}
    {tab==="ventas"&&<div>
      {/* Resumen por cerda — lechones disponibles */}
      {(()=>{
        const porCerda=cerdas.filter(c=>c.tipo==="Madre").map(c=>{
          const cPartos=partos.filter(p=>p.cerda_id===c.id);
          const totalNacidos=cPartos.reduce((s,p)=>s+p.lechones_vivos,0);
          const vendidos=ventas.reduce((s,v)=>s+v.cantidad,0); // global for now
          return {nombre:c.nombre,nacidos:totalNacidos,partos:cPartos.length};
        }).filter(c=>c.nacidos>0);
        const totalNacidos=partos.reduce((s,p)=>s+p.lechones_vivos,0);
        const totalVendidos=ventas.filter(v=>(!v.tipo||v.tipo==="Lechon")&&v.estatus!=="Abono").reduce((s,v)=>s+v.cantidad,0);
        const disponibles=totalNacidos-totalVendidos;
        return <div className="card mb4">
          <div className="card-h"><h3>🐷 Lechones — Resumen</h3></div>
          <div className="card-b">
            <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:16}}>
              <div style={{textAlign:"center",padding:"12px 20px",background:G.pale,borderRadius:8}}>
                <div style={{fontSize:11,color:G.g500,textTransform:"uppercase",marginBottom:4}}>Total Nacidos</div>
                <div style={{fontSize:24,fontWeight:700,color:G.deep}}>{totalNacidos}</div>
              </div>
              <div style={{textAlign:"center",padding:"12px 20px",background:G.goldL,borderRadius:8}}>
                <div style={{fontSize:11,color:G.g500,textTransform:"uppercase",marginBottom:4}}>Vendidos</div>
                <div style={{fontSize:24,fontWeight:700,color:G.gold}}>{totalVendidos}</div>
              </div>
              <div style={{textAlign:"center",padding:"12px 20px",background:disponibles>0?"#E1F5EE":G.g100,borderRadius:8}}>
                <div style={{fontSize:11,color:G.g500,textTransform:"uppercase",marginBottom:4}}>Disponibles</div>
                <div style={{fontSize:24,fontWeight:700,color:disponibles>0?"#0F6E56":G.g500}}>{disponibles}</div>
              </div>
            </div>
            <div className="tw"><table>
              <thead><tr><th>Cerda</th><th>Partos</th><th>Lechones Nacidos</th></tr></thead>
              <tbody>{porCerda.map(c=><tr key={c.nombre}>
                <td style={{fontWeight:600}}>{c.nombre}</td>
                <td>{c.partos}</td>
                <td style={{fontWeight:700,color:G.deep}}>{c.nacidos}</td>
              </tr>)}</tbody>
            </table></div>
          </div>
        </div>;
      })()}
      <div className="sg mb4">
        <div className="sc grn"><span className="si">💰</span><span className="sl">Total Ingresos</span><span className="sv">{fmt$(totalVentas)}</span></div>
        <div className="sc"><span className="si">🐷</span><span className="sl">Venta Lechones</span><span className="sv">{fmt$(ventas.filter(v=>!v.tipo||v.tipo==="Lechon").reduce((s,v)=>s+Number(v.total),0))}</span><span className="str">{ventas.filter(v=>(!v.tipo||v.tipo==="Lechon")&&v.estatus!=="Abono").reduce((s,v)=>s+v.cantidad,0)} vendidos</span></div>
        <div className="sc"><span className="si">🐄</span><span className="sl">Venta Cerdas</span><span className="sv" style={{fontSize:18}}>{fmt$(ventas.filter(v=>v.tipo==="Cerda").reduce((s,v)=>s+Number(v.total),0))}</span></div>
        <div className="sc"><span className="si">🐗</span><span className="sl">Ingresos Monta</span><span className="sv" style={{fontSize:18}}>{fmt$(ventas.filter(v=>v.tipo==="Monta").reduce((s,v)=>s+Number(v.total),0))}</span></div>
      </div>
      <div className="card">
        <div className="card-h"><h3>🤝 Ventas de Lechones</h3></div>
        <div className="tw"><table>
          <thead><tr><th>Fecha</th><th>Tipo</th><th>Estatus</th><th>Cantidad</th><th>Total</th><th>Comprador</th><th>Pago</th><th>Notas</th>{role==="admin"&&<th></th>}</tr></thead>
          <tbody>{ventas.map(v=><tr key={v.id}>
            <td>{fmtDisp(v.fecha)}</td>
            <td><span className={`badge ${v.tipo==="Cerda"?"br":v.tipo==="Monta"?"bb":"bg"}`}>{v.tipo||"Lechon"}</span></td>
            <td><span className={`badge ${v.estatus==="Abono"?"bo":v.estatus==="Cancelacion"?"bg":"bk"}`}>{v.estatus||"Venta"}</span></td>
            <td style={{fontWeight:700,color:v.estatus==="Abono"?G.g500:G.deep}}>{v.estatus==="Abono"?"-":v.cantidad}</td>
            <td style={{fontWeight:700,color:G.deep}}>{fmt$(v.total)}</td>
            <td>{v.comprador||"-"}</td><td><span className="badge bk">{v.forma_pago||"-"}</span></td>
            <td style={{fontSize:12,color:G.g500}}>{v.notas||"-"}</td>
            {role==="admin"&&<td style={{display:"flex",gap:4}}>
              <button className="btn btn-sm btn-o" onClick={()=>openEdit("venta",v)}>✏</button>
              <button className="btn btn-sm" style={{background:G.redL,color:G.red,border:"none"}} onClick={()=>deleteRow("ventas_lechones",v.id)}>✕</button>
            </td>}
          </tr>)}</tbody>
        </table></div>
      </div>
    </div>}

    {/* ════════════════ MODALES EDITAR ════════════════ */}

    {/* EDITAR CERDA */}
    {modal==="edit_cerda"&&<div className="mo" onClick={()=>setModal(null)}><div className="md" onClick={e=>e.stopPropagation()}>
      <div className="fb mb4"><h3>✏️ Editar: {editItem?.nombre}</h3><button className="btn btn-o btn-sm" onClick={()=>setModal(null)}>✕</button></div>
      <div className="fg">
        <div className="fgrp"><label>Estado</label><select value={form.estado||""} onChange={e=>setForm(f=>({...f,estado:e.target.value}))}>{ESTADOS.map(s=><option key={s}>{s}</option>)}</select></div>
        <div className="fgrp"><label>Peso (kg)</label><input type="number" step="0.1" value={form.peso_kg||""} onChange={e=>setForm(f=>({...f,peso_kg:e.target.value}))}/></div>
        <div className="fgrp"><label>Raza</label><input value={form.raza||""} onChange={e=>setForm(f=>({...f,raza:e.target.value}))}/></div>
        <div className="fgrp"><label>Fecha Nacimiento</label><input type="date" value={toISO(form.fecha_nacimiento)||""} onChange={e=>setForm(f=>({...f,fecha_nacimiento:e.target.value}))}/></div>
        <div className="fgrp"><label>Notas</label><input value={form.notas||""} onChange={e=>setForm(f=>({...f,notas:e.target.value}))}/></div>
      </div>
      <div className="fl gap2 mt4">
        <button className="btn btn-p" disabled={saving} onClick={()=>updateRow("cerdas",editItem.id,{estado:form.estado,peso_kg:form.peso_kg?Number(form.peso_kg):null,raza:form.raza,fecha_nacimiento:form.fecha_nacimiento||null,notas:form.notas})}>{saving?"Guardando...":"Guardar"}</button>
        <button className="btn btn-o" onClick={()=>setModal(null)}>Cancelar</button>
      </div>
    </div></div>}

    {/* NUEVA CERDA */}
    {modal==="new_cerda"&&<div className="mo" onClick={()=>setModal(null)}><div className="md" onClick={e=>e.stopPropagation()}>
      <div className="fb mb4"><h3>Nueva Cerda / Verraco</h3><button className="btn btn-o btn-sm" onClick={()=>setModal(null)}>✕</button></div>
      <div className="fg">
        <div className="fgrp"><label>Nombre</label><input value={form.nombre||""} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))}/></div>
        <div className="fgrp"><label>Código</label><input value={form.codigo||""} onChange={e=>setForm(f=>({...f,codigo:e.target.value}))}/></div>
        <div className="fgrp"><label>Tipo</label><select value={form.tipo||"Madre"} onChange={e=>setForm(f=>({...f,tipo:e.target.value}))}><option>Madre</option><option>Verraco</option></select></div>
        <div className="fgrp"><label>Peso (kg)</label><input type="number" value={form.peso_kg||""} onChange={e=>setForm(f=>({...f,peso_kg:e.target.value}))}/></div>
        <div className="fgrp"><label>Fecha Nacimiento</label><input type="date" value={form.fecha_nacimiento||""} onChange={e=>setForm(f=>({...f,fecha_nacimiento:e.target.value}))}/></div>
        <div className="fgrp"><label>Notas</label><input value={form.notas||""} onChange={e=>setForm(f=>({...f,notas:e.target.value}))}/></div>
      </div>
      <div className="fl gap2 mt4">
        <button className="btn btn-p" disabled={saving} onClick={()=>saveNew("cerdas",{nombre:form.nombre,codigo:form.codigo,tipo:form.tipo||"Madre",estado:"Activa",peso_kg:form.peso_kg?Number(form.peso_kg):null,fecha_nacimiento:form.fecha_nacimiento||null,notas:form.notas})}>{saving?"Guardando...":"Guardar"}</button>
        <button className="btn btn-o" onClick={()=>setModal(null)}>Cancelar</button>
      </div>
    </div></div>}

    {/* EDITAR/NUEVA MONTA */}
    {(modal==="edit_monta"||modal==="new_monta")&&<div className="mo" onClick={()=>setModal(null)}><div className="md" onClick={e=>e.stopPropagation()}>
      <div className="fb mb4"><h3>{modal==="edit_monta"?"✏️ Editar Monta":"Nueva Monta"}</h3><button className="btn btn-o btn-sm" onClick={()=>setModal(null)}>✕</button></div>
      <div className="fg">
        <div className="fgrp"><label>Cerda</label><select value={form.cerda_id||""} onChange={e=>setForm(f=>({...f,cerda_id:e.target.value}))}><option value="">Seleccionar...</option>{madres.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}</select></div>
        <div className="fgrp"><label>Fecha Monta</label><input type="date" value={form.fecha_monta?toISO(form.fecha_monta):""} onChange={e=>setForm(f=>({...f,fecha_monta:e.target.value}))}/></div>
        <div className="fgrp"><label>Fecha Celo</label><input type="date" value={form.fecha_celo?toISO(form.fecha_celo):""} onChange={e=>setForm(f=>({...f,fecha_celo:e.target.value}))}/></div>
        <div className="fgrp"><label>Verraco</label><select value={form.verraco_id||""} onChange={e=>setForm(f=>({...f,verraco_id:e.target.value}))}><option value="">Seleccionar...</option>{verracos.map(v=><option key={v.id} value={v.id}>{v.nombre}</option>)}</select></div>
        <div className="fgrp"><label>Confirmado</label><select value={form.confirmado?"true":"false"} onChange={e=>setForm(f=>({...f,confirmado:e.target.value==="true"}))}><option value="false">Pendiente</option><option value="true">Confirmado</option></select></div>
        <div className="fgrp"><label>Notas</label><input value={form.notas||""} onChange={e=>setForm(f=>({...f,notas:e.target.value}))}/></div>
      </div>
      {form.fecha_monta&&<div style={{background:G.goldL,padding:"8px 12px",borderRadius:8,marginTop:10,fontSize:13}}>
        📅 Parto estimado (114d): <strong>{toISO(addD(form.fecha_monta,GEST))}</strong>
        {" · "}Destete (142d): <strong>{toISO(addD(form.fecha_monta,GEST+LACT))}</strong>
      </div>}
      <div className="fl gap2 mt4">
        {modal==="edit_monta"
          ?<button className="btn btn-p" disabled={saving} onClick={()=>{const{id}=editItem;updateRow("celos_montas",id,{cerda_id:form.cerda_id,fecha_monta:form.fecha_monta,fecha_celo:form.fecha_celo||null,verraco_id:form.verraco_id||null,confirmado:form.confirmado||false,notas:form.notas||""});} }>{saving?"Guardando...":"Guardar cambios"}</button>
          :<button className="btn btn-p" disabled={saving} onClick={()=>saveNew("celos_montas",{cerda_id:form.cerda_id,fecha_monta:form.fecha_monta,fecha_celo:form.fecha_celo||null,verraco_id:form.verraco_id||null,confirmado:form.confirmado||false,notas:form.notas})}>{saving?"Guardando...":"Guardar"}</button>
        }
        <button className="btn btn-o" onClick={()=>setModal(null)}>Cancelar</button>
      </div>
    </div></div>}

    {/* EDITAR/NUEVO PARTO */}
    {(modal==="edit_parto"||modal==="new_parto")&&<div className="mo" onClick={()=>setModal(null)}><div className="md" onClick={e=>e.stopPropagation()}>
      <div className="fb mb4"><h3>{modal==="edit_parto"?"✏️ Editar Parto":"Nuevo Parto"}</h3><button className="btn btn-o btn-sm" onClick={()=>setModal(null)}>✕</button></div>
      <div className="fg">
        <div className="fgrp"><label>Cerda</label><select value={form.cerda_id||""} onChange={e=>setForm(f=>({...f,cerda_id:e.target.value}))}><option value="">Seleccionar...</option>{madres.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}</select></div>
        <div className="fgrp"><label>Fecha Parto</label><input type="date" value={form.fecha_parto?toISO(form.fecha_parto):""} onChange={e=>setForm(f=>({...f,fecha_parto:e.target.value}))}/></div>
        <div className="fgrp"><label>Lechones Vivos</label><input type="number" value={form.lechones_vivos||""} onChange={e=>setForm(f=>({...f,lechones_vivos:e.target.value}))}/></div>
        <div className="fgrp"><label>Lechones Muertos</label><input type="number" value={form.lechones_muertos||0} onChange={e=>setForm(f=>({...f,lechones_muertos:e.target.value}))}/></div>
        <div className="fgrp"><label>Notas</label><input value={form.notas||""} onChange={e=>setForm(f=>({...f,notas:e.target.value}))}/></div>
      </div>
      {form.fecha_parto&&<div style={{background:G.pale,padding:"8px 12px",borderRadius:8,marginTop:10,fontSize:13}}>
        🐣 Vacuna hierro: <strong>{toISO(addD(form.fecha_parto,3))}</strong>
        {" · "}Descolmillar: <strong>{toISO(addD(form.fecha_parto,7))}</strong>
        {" · "}Capar machos: <strong>{toISO(addD(form.fecha_parto,21))}</strong>
        {" · "}Destete: <strong>{toISO(addD(form.fecha_parto,LACT))}</strong>
        {" · "}Próx. monta: <strong>{toISO(addD(form.fecha_parto,LACT+DESC))}</strong>
      </div>}
      <div className="fl gap2 mt4">
        {modal==="edit_parto"
          ?<button className="btn btn-p" disabled={saving} onClick={()=>{const{id}=editItem;updateRow("partos",id,{cerda_id:form.cerda_id,fecha_parto:form.fecha_parto,lechones_vivos:Number(form.lechones_vivos||0),lechones_muertos:Number(form.lechones_muertos||0),notas:form.notas||""});} }>{saving?"Guardando...":"Guardar cambios"}</button>
          :<button className="btn btn-p" disabled={saving} onClick={()=>saveNew("partos",{cerda_id:form.cerda_id,fecha_parto:form.fecha_parto,lechones_vivos:Number(form.lechones_vivos||0),lechones_muertos:Number(form.lechones_muertos||0),notas:form.notas})}>{saving?"Guardando...":"Guardar"}</button>
        }
        <button className="btn btn-o" onClick={()=>setModal(null)}>Cancelar</button>
      </div>
    </div></div>}

    {/* EDITAR/NUEVA VACUNA */}
    {(modal==="edit_vacuna"||modal==="new_vacuna")&&<div className="mo" onClick={()=>setModal(null)}><div className="md" onClick={e=>e.stopPropagation()}>
      <div className="fb mb4"><h3>{modal==="edit_vacuna"?"✏️ Editar Vacuna":"Nueva Vacuna"}</h3><button className="btn btn-o btn-sm" onClick={()=>setModal(null)}>✕</button></div>
      <div className="fg">
        <div className="fgrp"><label>Animal</label><select value={form.cerda_id||""} onChange={e=>setForm(f=>({...f,cerda_id:e.target.value}))}><option value="">Seleccionar...</option>{cerdas.filter(c=>c.estado==="Activa").map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}</select></div>
        <div className="fgrp"><label>Vacuna</label><select value={form.vacuna||""} onChange={e=>setForm(f=>({...f,vacuna:e.target.value}))}><option value="">Seleccionar...</option>{VACUNAS_TIPOS.map(v=><option key={v}>{v}</option>)}</select></div>
        <div className="fgrp"><label>Fecha</label><input type="date" value={form.fecha?toISO(form.fecha):""} onChange={e=>setForm(f=>({...f,fecha:e.target.value}))}/></div>
        <div className="fgrp"><label>Próxima Dosis</label><input type="date" value={form.proxima_dosis?toISO(form.proxima_dosis):""} onChange={e=>setForm(f=>({...f,proxima_dosis:e.target.value}))}/></div>
        <div className="fgrp"><label>Veterinario</label><input value={form.veterinario||""} onChange={e=>setForm(f=>({...f,veterinario:e.target.value}))}/></div>
        <div className="fgrp"><label>Notas</label><input value={form.notas||""} onChange={e=>setForm(f=>({...f,notas:e.target.value}))}/></div>
      </div>
      <div className="fl gap2 mt4">
        {modal==="edit_vacuna"
          ?<button className="btn btn-p" disabled={saving} onClick={()=>{const{id}=editItem;updateRow("vacunas_cerdas",id,{cerda_id:form.cerda_id,vacuna:form.vacuna,fecha:form.fecha,proxima_dosis:form.proxima_dosis||null,veterinario:form.veterinario,notas:form.notas||""});} }>{saving?"Guardando...":"Guardar cambios"}</button>
          :<button className="btn btn-p" disabled={saving} onClick={()=>saveNew("vacunas_cerdas",{cerda_id:form.cerda_id,vacuna:form.vacuna,fecha:form.fecha,proxima_dosis:form.proxima_dosis||null,veterinario:form.veterinario,notas:form.notas})}>{saving?"Guardando...":"Guardar"}</button>
        }
        <button className="btn btn-o" onClick={()=>setModal(null)}>Cancelar</button>
      </div>
    </div></div>}

    {/* EDITAR/NUEVA VENTA */}
    {(modal==="edit_venta"||modal==="new_venta")&&<div className="mo" onClick={()=>setModal(null)}><div className="md" onClick={e=>e.stopPropagation()}>
      <div className="fb mb4"><h3>{modal==="edit_venta"?"✏️ Editar Venta":"Nueva Venta"}</h3><button className="btn btn-o btn-sm" onClick={()=>setModal(null)}>✕</button></div>
      <div className="fg">
        <div className="fgrp"><label>Fecha</label><input type="date" value={form.fecha?toISO(form.fecha):""} onChange={e=>setForm(f=>({...f,fecha:e.target.value}))}/></div>
        <div className="fgrp"><label>Tipo</label><select value={form.tipo||"Lechon"} onChange={e=>setForm(f=>({...f,tipo:e.target.value}))}><option value="Lechon">Lechon</option><option value="Cerda">Cerda</option><option value="Monta">Monta</option></select></div>
        <div className="fgrp"><label>Estatus</label><select value={form.estatus||"Venta"} onChange={e=>setForm(f=>({...f,estatus:e.target.value}))}><option value="Venta">Venta</option><option value="Abono">Abono</option><option value="Cancelacion">Cancelacion</option></select></div>
        <div className="fgrp"><label>Cantidad</label><input type="number" value={form.cantidad||""} onChange={e=>setForm(f=>({...f,cantidad:e.target.value}))}/></div>
        <div className="fgrp"><label>Precio/u ($)</label><input type="number" step="0.01" value={form.precio_unit||""} onChange={e=>setForm(f=>({...f,precio_unit:e.target.value}))}/></div>
        <div className="fgrp"><label>Comprador</label><input value={form.comprador||""} onChange={e=>setForm(f=>({...f,comprador:e.target.value}))}/></div>
        <div className="fgrp"><label>Forma de Pago</label><select value={form.forma_pago||""} onChange={e=>setForm(f=>({...f,forma_pago:e.target.value}))}><option value="">Seleccionar...</option><option>Efectivo</option><option>Yappy</option><option>Transferencia</option></select></div>
        <div className="fgrp"><label>Notas</label><input value={form.notas||""} onChange={e=>setForm(f=>({...f,notas:e.target.value}))}/></div>
      </div>
      {form.cantidad&&form.precio_unit&&<p style={{fontSize:13,color:G.deep,fontWeight:700,marginTop:10}}>Total: {fmt$(Number(form.cantidad)*Number(form.precio_unit))}</p>}
      <div className="fl gap2 mt4">
        {modal==="edit_venta"
          ?<button className="btn btn-p" disabled={saving} onClick={()=>{const{id}=editItem;updateRow("ventas_lechones",id,{fecha:form.fecha,cantidad:Number(form.cantidad),precio_unit:Number(form.precio_unit),comprador:form.comprador,forma_pago:form.forma_pago,notas:form.notas||"",tipo:form.tipo||"Lechon",estatus:form.estatus||"Venta"});} }>{saving?"Guardando...":"Guardar cambios"}</button>
          :<button className="btn btn-p" disabled={saving} onClick={()=>saveNew("ventas_lechones",{fecha:form.fecha,cantidad:Number(form.cantidad),precio_unit:Number(form.precio_unit),comprador:form.comprador,forma_pago:form.forma_pago,notas:form.notas,tipo:form.tipo||"Lechon",estatus:form.estatus||"Venta"})}>{saving?"Guardando...":"Guardar"}</button>
        }
        <button className="btn btn-o" onClick={()=>setModal(null)}>Cancelar</button>
      </div>
    </div></div>}

  </div>;
}


// ─── APP SHELL ────────────────────────────────────────────────────────────────
export default function App(){
  const [user,setUser]=useState(null);
  const [page,setPage]=useState("dashboard");
  const [sideOpen,setSideOpen]=useState(true);
  const [mobile,setMobile]=useState(false);
  const [gastos,setGastos]=useState([]);
  const [ingresos,setIngresos]=useState([]);
  const [deudas,setDeudas]=useState([]);
  const [inventario,setInventario]=useState([]);
  const [loading,setLoading]=useState(false);
  const [toast,setToast]=useState(null);

  const showToast=(msg,type="ok")=>{setToast({msg,type});};

  useEffect(()=>{
    const check=()=>{const m=window.innerWidth<768;setMobile(m);if(m)setSideOpen(false);else setSideOpen(true);};
    check();window.addEventListener("resize",check);return()=>window.removeEventListener("resize",check);
  },[]);

  // Auth check
  useEffect(()=>{
    if(!isConfigured)return;
    supabase.auth.getSession().then(async({data:{session}})=>{
      if(session){
        const {data:perfil}=await supabase.from("perfiles").select("*").eq("id",session.user.id).single();
        setUser({...session.user,perfil});
      }
    });
    const {data:{subscription}}=supabase.auth.onAuthStateChange(async(_,session)=>{
      if(session){
        const {data:perfil}=await supabase.from("perfiles").select("*").eq("id",session.user.id).single();
        setUser({...session.user,perfil});
      } else setUser(null);
    });
    return()=>subscription.unsubscribe();
  },[]);

  const fetchAll=useCallback(async()=>{
    if(!user)return;
    setLoading(true);
    const [g,i,d,inv]=await Promise.all([
      supabase.from("gastos").select("*").order("fecha",{ascending:false}),
      supabase.from("ingresos").select("*").order("fecha",{ascending:false}),
      supabase.from("deudas").select("*").order("created_at",{ascending:false}),
      supabase.from("inventario").select("*").order("categoria"),
    ]);
    setGastos(g.data||[]);setIngresos(i.data||[]);setDeudas(d.data||[]);setInventario(inv.data||[]);
    setLoading(false);
  },[user]);

  useEffect(()=>{fetchAll();},[fetchAll]);

  const logout=async()=>{await supabase.auth.signOut();setUser(null);};

  const nav=[
    {id:"dashboard",label:"Dashboard",icon:"◼",group:"Principal"},
    {id:"cerdos_m",label:"Producción Porcina",icon:"🐷",group:"Producción"},
    {id:"name_m",label:"Producción de Ñame",icon:"🌿",group:"Producción"},
    {id:"finanzas",label:"Finanzas",icon:"💰",group:"Gestión"},
    {id:"deudas",label:"Deudas",icon:"📋",group:"Gestión"},
    {id:"inventario",label:"Inventario",icon:"📦",group:"Gestión"},
    {id:"reportes",label:"Reportes",icon:"📊",group:"Análisis"},
  ];
  const groups=[...new Set(nav.map(n=>n.group))];
  const titles={dashboard:"Dashboard General",cerdos_m:"Producción Porcina",name_m:"Producción de Ñame",finanzas:"Finanzas",deudas:"Deudas & Cuentas",inventario:"Inventario",reportes:"Reportes & Análisis"};
  const role=user?.perfil?.rol||"encargado";
  const nombre=user?.perfil?.nombre||user?.email||"Usuario";
  const initials=nombre.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();

  const [dashAnio,setDashAnio]=useState(new Date().getFullYear());
  const totG2026=(dashAnio==="todo"?gastos:gastos.filter(g=>g.anio===dashAnio)).reduce((s,g)=>s+Number(g.monto),0);
  const totI2026=(dashAnio==="todo"?ingresos:ingresos.filter(i=>i.anio===dashAnio)).reduce((s,i)=>s+Number(i.monto),0);

  if(!user)return<><style>{CSS}</style>{!isConfigured&&<div style={{position:"fixed",top:0,left:0,right:0,zIndex:999,background:G.goldL,borderBottom:`1px solid ${G.gold}`,padding:"8px 20px",fontSize:13,color:G.gold}}><strong>⚙️ Modo demo</strong> — Configura SUPABASE_URL y SUPABASE_ANON_KEY en el código para activar la base de datos real</div>}<Login onLogin={setUser}/></>;

  return<>
    <style>{CSS}</style>
    {toast&&<Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
    <div className="app">
      {mobile&&sideOpen&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:99}} onClick={()=>setSideOpen(false)}/>}
      <nav className={`sidebar ${!sideOpen?"closed":""}`}>
        <div className="slogo"><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}><img src="/Logo.png" style={{width:28,height:28,objectFit:"contain"}}/><span style={{fontFamily:"'Playfair Display',serif",color:"#fff",fontSize:17,fontWeight:700}}>Gosh Investment</span></div><span style={{color:"#C9A84C",fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase"}}>Sistema GOSH · Panamá</span></div>
        <div style={{overflowY:"auto",flex:1}}>
          {groups.map(g=><div key={g} className="nav-sec">
            <div className="nav-lbl">{g}</div>
            {nav.filter(n=>n.group===g).map(n=><div key={n.id} className={`nav-item ${page===n.id?"active":""}`} onClick={()=>{setPage(n.id);if(mobile)setSideOpen(false);}}>
              <span style={{fontSize:15}}>{n.icon}</span>{n.label}
            </div>)}
          </div>)}
        </div>
        <div className="sfoot">
          <div className="ubadge"><div className="uav">{initials}</div><div className="uinfo"><p>{nombre}</p><span>{role}</span></div></div>
          <button className="btn btn-sm mt3" style={{width:"100%",justifyContent:"center",background:"rgba(255,255,255,.08)",color:"rgba(255,255,255,.7)",border:"1px solid rgba(255,255,255,.1)"}} onClick={logout}>↩ Cerrar Sesión</button>
        </div>
      </nav>

      <div className={`main ${!sideOpen&&!mobile?"full":""}`}>
        <header className="topbar">
          <div className="fl gap3"><button style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:G.g700}} onClick={()=>setSideOpen(s=>!s)}>☰</button><h2>{titles[page]}</h2></div>
          <div className="fl gap3">
            <div style={{fontSize:12,color:G.g500}}>{dashAnio==="todo"?"Total":"Balance "+dashAnio}: <span style={{fontWeight:700,color:totI2026-totG2026>=0?G.deep:G.red}}>{fmt$(totI2026-totG2026)}</span></div>
            <button className="btn btn-o btn-sm" onClick={fetchAll} disabled={loading}>{loading?"↺":"↺ Sync"}</button>
          </div>
        </header>

        <main className="content">
          {!isConfigured&&<ConfigBanner/>}
          {loading&&<Loading/>}
          {!loading&&<>
            {page==="dashboard"&&<Dashboard gastos={gastos} ingresos={ingresos} onAnioChange={setDashAnio}/>}
            {page==="finanzas"&&<Finanzas gastos={gastos} ingresos={ingresos} onRefresh={fetchAll} role={role} toast={showToast}/>}
            {page==="deudas"&&<Deudas deudas={deudas} onRefresh={fetchAll} role={role} toast={showToast}/>}
            {page==="inventario"&&<Inventario inventario={inventario} onRefresh={fetchAll} role={role} toast={showToast}/>}
            {page==="reportes"&&<Reportes gastos={gastos} ingresos={ingresos}/>}
            {page==="cerdos_m"&&<CerdosModule role={role} toast={showToast}/>}
            {page==="name_m"&&<div className="card"><div className="card-b" style={{textAlign:"center",padding:40}}>
              <p style={{fontSize:40,marginBottom:12}}>🌿</p>
              <p style={{fontSize:15,fontWeight:600,color:G.deep,marginBottom:8}}>Módulo Ñame</p>
              <p className="muted" style={{marginBottom:16}}>Los datos de ñame están integrados en Finanzas. Módulo detallado próximamente.</p>
              <button className="btn btn-p" onClick={()=>setPage("finanzas")}>→ Ver en Finanzas</button>
            </div></div>}
          </>}
        </main>

        <footer>
          <span style={{fontSize:12,color:G.g500}}>Gosh Investment — Sistema de Gestión GOSH · Panamá</span>
          <span style={{fontSize:12,color:G.g500}}>{gastos.length} gastos · {ingresos.length} ingresos · Supabase {isConfigured?"✓ conectado":"— pendiente"}</span>
        </footer>
      </div>
    </div>
  </>;
}
