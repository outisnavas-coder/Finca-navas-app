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
  .topbar h2{font-family:'Cormorant Garamond',serif;font-size:22px;color:${G.deep};font-weight:600;letter-spacing:.3px}
  .content{padding:24px;flex:1}
  .card{background:#fff;border-radius:14px;border:1px solid ${G.beigeD}}
  .card-h{padding:16px 20px 12px;border-bottom:1px solid ${G.beigeD};display:flex;align-items:center;justify-content:space-between}
  .card-h h3{font-family:'Cormorant Garamond',serif;font-size:16px;color:${G.deep};font-weight:600;letter-spacing:.3px}
  .card-b{padding:18px 20px}
  .sg{display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:14px;margin-bottom:22px}
  .sc{background:#fff;border-radius:13px;padding:18px 20px;border:1px solid ${G.beigeD};display:flex;flex-direction:column;gap:7px;transition:box-shadow .2s}
  .sc:hover{box-shadow:0 4px 18px rgba(27,67,50,.08)}
  .sc.grn{background:linear-gradient(135deg,${G.deep} 0%,${G.mid} 100%);border-left:3px solid ${G.gold};border-color:transparent}
  .sc.grn .sl,.sc.grn .sv,.sc.grn .si,.sc.grn .str{color:rgba(255,255,255,.9)!important}
  .sc.grn .sv{color:#fff!important}
  .si{font-size:20px}.sl{font-size:10.5px;font-weight:600;color:${G.g500};letter-spacing:.7px;text-transform:uppercase}
  .sv{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:700;color:${G.deep}}
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
  .login-emb{width:68px;height:68px;background:${G.deep};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:30px;margin:0 auto 14px}
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
      <div style={{width:80,height:80,margin:"0 auto 14px"}}><img src="data:image/png;base64,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" style={{width:"100%",height:"100%",objectFit:"contain"}} alt="RR"/></div>
      <h1>Gosh Investment</h1>
      <p>Sistema de Gestión Agropecuaria · Panamá</p>
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
  const gF=anio==="todos"?gastos:gastos.filter(g=>g.anio===Number(anio));
  const iF=anio==="todos"?ingresos:ingresos.filter(i=>i.anio===Number(anio));
  const totG=gF.reduce((s,x)=>s+Number(x.monto),0);
  const totI=iF.reduce((s,x)=>s+Number(x.monto),0);

  const modData=[
    {label:"Cerdos 🐷",g:gF.filter(x=>x.modulo==="Cerdos").reduce((s,x)=>s+Number(x.monto),0),i:iF.filter(x=>x.modulo==="Cerdos").reduce((s,x)=>s+Number(x.monto),0)},
    {label:"Ñame 🌿",g:gF.filter(x=>x.modulo==="Ñame").reduce((s,x)=>s+Number(x.monto),0),i:iF.filter(x=>x.modulo==="Ñame").reduce((s,x)=>s+Number(x.monto),0)},
  ];
  const socioData={Roberto:0,Richard:0,Puercos:0};
  gF.forEach(g=>{if(socioData[g.pagado_por]!==undefined)socioData[g.pagado_por]+=Number(g.monto);});
  const catBreak={};gF.forEach(g=>{catBreak[g.categoria]=(catBreak[g.categoria]||0)+Number(g.monto);});
  const catSorted=Object.entries(catBreak).sort((a,b)=>b[1]-a[1]);
  const maxCat=catSorted[0]?.[1]||1;

  // 12-month trend
  const now=new Date();
  const trend=Array.from({length:12},(_,i)=>{
    const d=new Date(now.getFullYear(),now.getMonth()-11+i,1);
    const m=d.getMonth()+1;const y=d.getFullYear();
    return {lab:`${MONTH_NAMES[m]}'${String(y).slice(2)}`,ing:ingresos.filter(x=>x.mes===m&&x.anio===y).reduce((s,x)=>s+Number(x.monto),0),gas:gastos.filter(x=>x.mes===m&&x.anio===y).reduce((s,x)=>s+Number(x.monto),0)};
  });
  const maxT=Math.max(...trend.map(d=>Math.max(d.ing,d.gas)),1);

  const anos=[...new Set([...gastos,...ingresos].map(x=>x.anio))].sort((a,b)=>b-a);

  return <div>
    <div className="fl gap2 mb4">
      {["todos",...anos.map(String)].map(a=><button key={a} className={`btn ${anio===a?"btn-p":"btn-o"} btn-sm`} onClick={()=>setAnio(a)}>{a==="todos"?"Todo":a}</button>)}
    </div>
    <div className="sg">
      <div className="sc grn"><span className="si">💰</span><span className="sl">Ingresos</span><span className="sv">{fmt$(totI)}</span></div>
      <div className="sc"><span className="si">📤</span><span className="sl">Egresos</span><span className="sv" style={{color:G.red}}>{fmt$(totG)}</span></div>
      <div className="sc"><span className="si">📊</span><span className="sl">Balance</span><span className="sv" style={{color:totI-totG>=0?G.deep:G.red}}>{fmt$(totI-totG)}</span></div>
      <div className="sc"><span className="si">💹</span><span className="sl">Margen Rec.</span><span className="sv">{totG>0?((totI/totG)*100).toFixed(1):0}%</span></div>
    </div>
    <div className="card mb4">
      <div className="card-h"><h3>📈 Tendencia Últimos 12 Meses</h3></div>
      <div className="card-b">
        <div style={{display:"flex",gap:16,marginBottom:10}}>
          <span style={{fontSize:11,color:G.g500}}><span style={{display:"inline-block",width:10,height:10,borderRadius:2,background:G.mid,marginRight:3}}></span>Ingresos</span>
          <span style={{fontSize:11,color:G.g500}}><span style={{display:"inline-block",width:10,height:10,borderRadius:2,background:G.beigeD,marginRight:3}}></span>Gastos</span>
        </div>
        <div className="bar-chart" style={{height:160}}>{trend.map((d,i)=><div key={i} className="bar-w"><div style={{display:"flex",alignItems:"flex-end",gap:1,height:140}}><div className="bar" style={{height:`${(d.ing/maxT)*140}px`,background:G.mid}}></div><div className="bar" style={{height:`${(d.gas/maxT)*140}px`,background:G.beigeD}}></div></div><span className="blab" style={{fontSize:9}}>{d.lab}</span></div>)}</div>
      </div>
    </div>
    <div className="g2">
      <div className="card">
        <div className="card-h"><h3>🏭 Por Módulo</h3></div>
        <div className="card-b">
          {modData.map(m=><div key={m.label} style={{marginBottom:18}}>
            <p style={{fontWeight:700,marginBottom:8,fontSize:13.5}}>{m.label}</p>
            <div className="fb" style={{marginBottom:4}}><span style={{fontSize:12,color:G.g500}}>Gastos</span><span style={{fontWeight:700,color:G.red,fontSize:12.5}}>{fmt$(m.g)}</span></div>
            <div className="prog-bar"><div className="prog-fill" style={{width:`${(m.g/Math.max(modData[0].g,modData[1].g,1))*100}%`,background:G.red}}></div></div>
            <div className="fb mt3" style={{marginBottom:4}}><span style={{fontSize:12,color:G.g500}}>Ingresos</span><span style={{fontWeight:700,color:G.deep,fontSize:12.5}}>{fmt$(m.i)}</span></div>
            <div className="prog-bar"><div className="prog-fill" style={{width:`${(m.i/Math.max(modData[0].i||1,modData[1].i||1,1))*100}%`,background:G.mid}}></div></div>
            <p style={{fontSize:11.5,color:m.i-m.g>=0?G.mid:G.red,marginTop:6,fontWeight:600}}>Balance: {fmt$(m.i-m.g)}</p>
            <hr style={{border:"none",borderTop:`1px solid ${G.beigeD}`,marginTop:10}}/>
          </div>)}
        </div>
      </div>
      <div className="card">
        <div className="card-h"><h3>👥 Aportaciones Socios</h3></div>
        <div className="card-b">
          {Object.entries(socioData).map(([s,v])=>{
            const tot=Object.values(socioData).reduce((a,b)=>a+b,1);
            return <div key={s} style={{marginBottom:14}}>
              <div className="fb" style={{marginBottom:4}}><span style={{fontSize:13,fontWeight:600}}>{s}</span><span style={{fontWeight:700,color:G.deep}}>{fmt$(v)} <span style={{fontSize:11,color:G.g500}}>({((v/tot)*100).toFixed(1)}%)</span></span></div>
              <div className="prog-bar"><div className="prog-fill" style={{width:`${(v/tot)*100}%`,background:G.light}}></div></div>
            </div>;
          })}
          <div style={{borderTop:`1px solid ${G.beigeD}`,paddingTop:12,marginTop:4}}><div className="fb"><span style={{fontSize:13,fontWeight:600}}>Total</span><span style={{fontWeight:700,color:G.deep}}>{fmt$(Object.values(socioData).reduce((a,b)=>a+b,0))}</span></div></div>
        </div>
      </div>
    </div>
    <div className="card mt4">
      <div className="card-h"><h3>📋 Desglose por Categoría</h3></div>
      <div className="tw"><table><thead><tr><th>Categoría</th><th>Módulo</th><th>Total</th><th>% del gasto</th></tr></thead>
      <tbody>{catSorted.map(([cat,val])=>{
        const mod=gF.find(g=>g.categoria===cat)?.modulo||"-";
        return <tr key={cat}>
          <td style={{fontSize:12.5}}>{cat}</td>
          <td><span className={`badge ${mod==="Cerdos"?"bg":"bo"}`}>{mod}</span></td>
          <td style={{fontWeight:700,color:G.red}}>{fmt$(val)}</td>
          <td><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:80,height:6,background:G.beige,borderRadius:3,overflow:"hidden"}}><div style={{width:`${(val/maxCat)*100}%`,height:"100%",background:G.red,borderRadius:3}}></div></div><span style={{fontSize:12}}>{totG>0?((val/totG)*100).toFixed(1):0}%</span></div></td>
        </tr>;
      })}</tbody></table></div>
    </div>
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
        <div className="slogo"><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}><img src="data:image/png;base64,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" style={{width:30,height:30,objectFit:"contain"}} alt="RR"/><span style={{fontFamily:"'Playfair Display',serif",color:"#fff",fontSize:17,fontWeight:700}}>Gosh Investment</span></div><span style={{color:"#C9A84C",fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase"}}>Sistema Agropecuario · Panamá</span></div><span style={{color:"#C9A84C",fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase"}}>Sistema Agropecuario · Panamá</span></div>
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
            {(page==="cerdos_m"||page==="name_m")&&<div className="card"><div className="card-b" style={{textAlign:"center",padding:40}}>
              <p style={{fontSize:40,marginBottom:12}}>{page==="cerdos_m"?"🐷":"🌿"}</p>
              <p style={{fontSize:15,fontWeight:600,color:G.deep,marginBottom:8}}>Ver historial en Finanzas</p>
              <p className="muted" style={{marginBottom:16}}>Los datos de {page==="cerdos_m"?"cerdos":"ñame"} están integrados en el módulo de Finanzas con filtro por módulo.<br/>El registro de inventario de animales y lotes se activa con Supabase.</p>
              <button className="btn btn-p" onClick={()=>setPage("finanzas")}>→ Ir a Finanzas</button>
            </div></div>}
          </>}
        </main>

        <footer>
          <span style={{fontSize:12,color:G.g500}}>Gosh Investment — Sistema de Gestión Agropecuaria · Panamá</span>
          <span style={{fontSize:12,color:G.g500}}>{gastos.length} gastos · {ingresos.length} ingresos · Supabase {isConfigured?"✓ conectado":"— pendiente"}</span>
        </footer>
      </div>
    </div>
  </>;
}
