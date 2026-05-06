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
  .sidebar{width:256px;height:100vh;background:${G.deep};display:flex;flex-direction:column;flex-shrink:0;position:fixed;top:0;left:0;z-index:100;transition:transform .3s;overflow:hidden}
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
  .ventas-stats-grid{display:flex!important;gap:16px;flex-wrap:wrap;margin-bottom:16px}
  .ventas-stats-grid>div{padding:12px 20px!important}
  .fil-row select{padding:7px 11px;border:1.5px solid ${G.g300};border-radius:8px;font-size:13px;font-family:'DM Sans',sans-serif;color:${G.g900};background:#fff;outline:none}
  .fil-row select:focus{border-color:${G.mid}}
  footer{padding:14px 24px;border-top:1px solid ${G.beigeD};background:#fff;display:flex;justify-content:space-between;align-items:center}
  *{box-sizing:border-box}
  .app{overflow-x:hidden;max-width:100vw}
  .main{overflow-x:hidden;max-width:100vw}
  .content{overflow-x:hidden}
  img{max-width:100%}
  @media(max-width:768px){
    .sidebar{transform:translateX(-256px)}.sidebar.open{transform:translateX(0)}
    .main{margin-left:0!important}.content{padding:10px}
    .sg{grid-template-columns:repeat(2,1fr)!important}.fg{grid-template-columns:1fr}.g2{grid-template-columns:1fr}
    .login-card{padding:28px 20px}.topbar{padding:11px 14px}
    .card-h{flex-wrap:wrap;gap:8px}
    .card-h h3{font-size:14px}
    .tabs{overflow-x:auto;flex-wrap:nowrap;-webkit-overflow-scrolling:touch}
    .tab{white-space:nowrap;font-size:12px;padding:7px 12px}
    .tw{overflow-x:auto;-webkit-overflow-scrolling:touch}
    .tw table{min-width:520px}
    td{padding:8px 10px;vertical-align:middle}
    th{padding:8px 10px;font-size:10px}
    .montas-table td{padding:7px 8px!important;font-size:12px}
    .montas-table th{padding:7px 8px!important;font-size:10px}
    .ventas-stats-grid{display:grid!important;grid-template-columns:1fr 1fr!important;gap:10px!important}
    .ventas-stats-grid>div{padding:10px 12px!important}
    .fecha-col{white-space:nowrap;font-size:11.5px;font-variant-numeric:tabular-nums}
    .hide-mobile{display:none!important}
    .badge{font-size:10px;padding:2px 7px}
    .btn{font-size:12px;padding:7px 12px}
    .btn-sm{font-size:11px;padding:4px 8px}
    .md{padding:18px;max-height:95vh;border-radius:14px 14px 0 0;position:fixed;bottom:0;left:0;right:0;width:100%;max-width:100%}
    .fl{flex-wrap:wrap}
    .sc{padding:14px}
    .si{font-size:22px}
    .sv{font-size:20px}
  }
  @media(max-width:480px){
    .sg{grid-template-columns:1fr}
    .topbar h1{font-size:16px}
    .content{padding:8px}
    .card-b{padding:12px}
    .card-h{padding:10px 12px}
    .sc{padding:12px 10px}
    .si{font-size:18px}
    .sv{font-size:18px}
    .sl{font-size:10px}
    .btn{font-size:11px;padding:6px 10px}
    .tw table{font-size:11px}
    h2{font-size:15px!important}
    h3{font-size:13px!important}
  }
  .alerta-item{display:flex;align-items:flex-start;gap:12px;padding:12px 16px;border-radius:10px;margin-bottom:8px;border-left:4px solid transparent}
  .alerta-item.critica{background:#FEF2F2;border-left-color:${G.red}}
  .alerta-item.advertencia{background:${G.goldL};border-left-color:${G.gold}}
  .alerta-item.info{background:#EEF2FF;border-left-color:#4F46E5}
  .alerta-item.ok{background:#E1F5EE;border-left-color:#0F6E56}
  .alerta-icon{font-size:20px;flex-shrink:0;margin-top:1px}
  .alerta-body{flex:1;min-width:0}
  .alerta-titulo{font-size:13px;font-weight:700;color:${G.g900};line-height:1.3}
  .alerta-sub{font-size:11.5px;color:${G.g500};margin-top:2px}
  .alerta-badge{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:${G.red};color:#fff;font-size:10px;font-weight:700;flex-shrink:0}
  .nav-badge{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;border-radius:9px;background:${G.red};color:#fff;font-size:10px;font-weight:700;padding:0 4px;margin-left:auto}
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt$ = (n) => `$${Number(n||0).toLocaleString("es-PA",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const MONTH_NAMES = ["","Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

const isConfigured = SUPABASE_URL !== "https://TU_PROJECT_ID.supabase.co";

// ─── SISTEMA DE PERMISOS ──────────────────────────────────────────────────────
// Roles: admin | socio | supervisor | operativo
const ROLES_LABEL={admin:"Administrador",socio:"Socio",supervisor:"Supervisor",operativo:"Operativo"};
const ROLES_COLOR={admin:G.deep,socio:"#0F6E56",supervisor:"#534AB7",operativo:G.gold};

const PERMS={
  // Navegación — qué páginas puede ver
  verDashboard:    r=>["admin","socio"].includes(r),
  verFinanzas:     r=>["admin","socio"].includes(r),
  verDeudas:       r=>["admin","socio"].includes(r),
  verInventario:   r=>["admin","socio"].includes(r),
  verReportes:     r=>["admin","socio"].includes(r),
  verAlertas:      r=>true, // todos
  verCerdos:       r=>true, // todos
  verName:         r=>true, // todos
  verUsuarios:     r=>r==="admin",
  verAuditoria:    r=>["admin","socio"].includes(r),

  // Finanzas
  registrarGastos: r=>["admin","socio","supervisor"].includes(r),
  registrarIngresos:r=>["admin","socio"].includes(r),
  verMontos:       r=>["admin","socio","supervisor"].includes(r),

  // Cerdos — operaciones
  editarCerdas:    r=>["admin","socio"].includes(r),
  registrarMontas: r=>["admin","socio","supervisor"].includes(r),
  registrarPartos: r=>["admin","socio","supervisor"].includes(r),
  registrarVacunas:r=>["admin","socio","supervisor"].includes(r),
  registrarVentas: r=>["admin","socio"].includes(r),
  completarActCerdos:r=>["admin","socio","supervisor","operativo"].includes(r),

  // Ñame
  editarSiembras:  r=>["admin","socio"].includes(r),
  registrarGastosName:r=>["admin","socio","supervisor"].includes(r),
  completarActName:r=>["admin","socio","supervisor","operativo"].includes(r),

  // Admin
  gestionUsuarios: r=>r==="admin",
  eliminar:        r=>r==="admin",
};

// ─── AUDITORÍA ────────────────────────────────────────────────────────────────
async function logAudit({userId,userName,accion,tabla,registroId,datosPrev=null,datosNuevos=null}){
  try{
    await supabase.from("auditoria").insert({
      user_id:userId,
      user_nombre:userName,
      accion,
      tabla,
      registro_id:String(registroId||""),
      datos_prev:datosPrev?JSON.stringify(datosPrev):null,
      datos_nuevos:datosNuevos?JSON.stringify(datosNuevos):null,
      created_at:new Date().toISOString(),
    });
  }catch(e){console.warn("Audit log failed:",e.message);}
}

// ─── CALC ALERTAS ─────────────────────────────────────────────────────────────
function calcAlertas({cerdas=[],partos=[],montas=[],vacunas=[],ventas=[],deudas=[],inventario=[],siembras=[],actividadesName=[]}){
  const TODAY=new Date();
  const addD=(d,n)=>{const r=new Date(d+"T12:00:00");r.setDate(r.getDate()+n);return r;};
  const diffD=(a,b)=>Math.ceil((new Date(typeof b==="string"?b+"T12:00:00":b)-new Date(typeof a==="string"?a+"T12:00:00":a))/(1000*60*60*24));
  const toISO=d=>{if(!d)return"";if(typeof d==="string"&&d.length>=10)return d.substring(0,10);return new Date(d).toISOString().split("T")[0];};
  const GEST=114,LACT=28,DESC=21;
  const alertas=[];

  // ── 1. PARTOS INMINENTES (gestación ≥100d = faltan ≤14d) ──────────────────
  cerdas.filter(c=>c.tipo==="Madre"&&c.estado==="Activa").forEach(c=>{
    const cMontas=montas.filter(m=>m.cerda_id===c.id).sort((a,b)=>b.fecha_monta.localeCompare(a.fecha_monta));
    const lastMonta=cMontas[0];
    if(!lastMonta)return;
    const proxParto=addD(lastMonta.fecha_monta,GEST);
    const diasFalta=diffD(TODAY,proxParto);
    // Verificar que no haya parto real ya registrado después de esta monta
    const partoYaRegistrado=partos.find(p=>p.cerda_id===c.id&&diffD(lastMonta.fecha_monta,p.fecha_parto)>=0&&diffD(lastMonta.fecha_monta,p.fecha_parto)<=130);
    if(partoYaRegistrado)return;
    if(diasFalta>=0&&diasFalta<=14){
      alertas.push({id:`parto-${c.id}`,tipo:"critica",icono:"🐣",titulo:`Parto inminente — ${c.nombre}`,sub:`Estimado: ${proxParto.toLocaleDateString("es-PA",{day:"2-digit",month:"short"})} · Faltan ${diasFalta}d`,modulo:"cerdos_m",orden:1});
    } else if(diasFalta>14&&diasFalta<=30){
      alertas.push({id:`parto-prox-${c.id}`,tipo:"advertencia",icono:"🐷",titulo:`Parto próximo — ${c.nombre}`,sub:`Estimado en ${diasFalta} días · ${proxParto.toLocaleDateString("es-PA",{day:"2-digit",month:"short"})}`,modulo:"cerdos_m",orden:3});
    }
  });

  // ── 2. CERDAS LISTAS PARA MONTA (descanso completado) ────────────────────
  cerdas.filter(c=>c.tipo==="Madre"&&c.estado==="Activa").forEach(c=>{
    const cPartos=partos.filter(p=>p.cerda_id===c.id).sort((a,b)=>b.fecha_parto.localeCompare(a.fecha_parto));
    const cMontas=montas.filter(m=>m.cerda_id===c.id).sort((a,b)=>b.fecha_monta.localeCompare(a.fecha_monta));
    const lastParto=cPartos[0];
    const lastMonta=cMontas[0];
    if(!lastParto)return;
    const destete=addD(lastParto.fecha_parto,LACT);
    const descFin=addD(destete,DESC);
    const diasDesdeParto=diffD(lastParto.fecha_parto,TODAY);
    // Lista para monta si ya completó descanso y no tiene monta posterior al último parto
    const montaPost=lastMonta&&diffD(lastParto.fecha_parto,lastMonta.fecha_monta)>0;
    if(diasDesdeParto>=(LACT+DESC)&&!montaPost){
      const diasLista=diasDesdeParto-(LACT+DESC);
      alertas.push({id:`monta-${c.id}`,tipo:diasLista>14?"advertencia":"info",icono:"❤️",titulo:`Lista para monta — ${c.nombre}`,sub:`Lleva ${diasLista}d disponible desde el ${descFin.toLocaleDateString("es-PA",{day:"2-digit",month:"short"})}`,modulo:"cerdos_m",orden:2});
    }
  });

  // ── 3. VACUNAS VENCIDAS / PRÓXIMAS ───────────────────────────────────────
  vacunas.filter(v=>v.proxima_dosis).forEach(v=>{
    const cerda=cerdas.find(c=>c.id===v.cerda_id);
    const nombre=cerda?.nombre||"Cerda";
    const dias=diffD(TODAY,v.proxima_dosis);
    if(dias<0){
      alertas.push({id:`vac-venc-${v.id}`,tipo:"critica",icono:"💉",titulo:`Vacuna VENCIDA — ${nombre}`,sub:`${v.vacuna} · Venció hace ${Math.abs(dias)}d`,modulo:"cerdos_m",orden:1});
    } else if(dias<=7){
      alertas.push({id:`vac-prox-${v.id}`,tipo:"advertencia",icono:"💉",titulo:`Vacuna próxima — ${nombre}`,sub:`${v.vacuna} · En ${dias}d (${new Date(v.proxima_dosis+"T12:00:00").toLocaleDateString("es-PA",{day:"2-digit",month:"short"})})`,modulo:"cerdos_m",orden:2});
    }
  });

  // ── 4. INVENTARIO BAJO ───────────────────────────────────────────────────
  inventario.forEach(item=>{
    if(item.cantidad<=item.minimo){
      alertas.push({id:`inv-${item.id}`,tipo:"advertencia",icono:"📦",titulo:`Inventario bajo — ${item.item}`,sub:`Stock: ${item.cantidad} ${item.unidad} · Mínimo: ${item.minimo} ${item.unidad}`,modulo:"inventario",orden:3});
    }
  });

  // ── 5. DEUDAS VENCIDAS ───────────────────────────────────────────────────
  deudas.filter(d=>d.estado!=="Pagado"&&d.fecha_vence).forEach(d=>{
    const dias=diffD(TODAY,d.fecha_vence);
    if(dias<0){
      alertas.push({id:`deuda-${d.id}`,tipo:"critica",icono:"📋",titulo:`Deuda vencida — ${d.nombre}`,sub:`${d.tipo==="pagar"?"Por pagar":"Por cobrar"} · ${fmt$(d.monto)} · Venció hace ${Math.abs(dias)}d`,modulo:"deudas",orden:1});
    } else if(dias<=7){
      alertas.push({id:`deuda-prox-${d.id}`,tipo:"advertencia",icono:"📋",titulo:`Deuda próxima — ${d.nombre}`,sub:`${d.tipo==="pagar"?"Por pagar":"Por cobrar"} · ${fmt$(d.monto)} · Vence en ${dias}d`,modulo:"deudas",orden:2});
    }
  });

  // ── 6. LECHONES DISPONIBLES SIN VENDER (>30 días desde último parto) ─────
  const totalNacidos=partos.reduce((s,p)=>s+p.lechones_vivos,0);
  const totalVendidos=ventas.filter(v=>v.tipo!=="transferencia"&&v.estatus!=="Abono").reduce((s,v)=>s+v.cantidad,0);
  const totalTransf=ventas.filter(v=>v.tipo==="transferencia").reduce((s,v)=>s+v.cantidad,0);
  const disponibles=totalNacidos-totalVendidos-totalTransf;
  if(disponibles>0){
    const ultimoParto=partos.sort((a,b)=>b.fecha_parto.localeCompare(a.fecha_parto))[0];
    if(ultimoParto){
      const diasDesde=diffD(ultimoParto.fecha_parto,TODAY);
      if(diasDesde>30){
        alertas.push({id:"lechones-disp",tipo:"info",icono:"🐽",titulo:`${disponibles} lechones disponibles sin vender`,sub:`Último parto hace ${diasDesde}d · Revisar ventas pendientes`,modulo:"cerdos_m",orden:4});
      }
    }
  }

  // ── 7. SIEMBRAS ACTIVAS — COSECHA PRÓXIMA / VENCIDA ─────────────────────
  siembras.filter(s=>s.estado==="activa").forEach(s=>{
    const actsS=actividadesName.filter(a=>a.siembra_id===s.id);
    const totalActs=actsS.length;
    const completadasActs=actsS.filter(a=>a.estado==="completado").length;
    // Si todas las actividades están completadas, esta siembra no genera alertas
    if(totalActs>0&&completadasActs===totalActs)return;

    const actCosecha=actsS.find(a=>
      a.actividad==="Cosecha"||a.actividad?.toLowerCase().includes("cosecha")
    );
    // Solo alertar cosecha si sigue PENDIENTE (no completada)
    if(actCosecha&&actCosecha.estado!=="completado"&&actCosecha.fecha_estimada){
      const dias=diffD(TODAY,actCosecha.fecha_estimada);
      if(dias>=0&&dias<=21){
        alertas.push({id:`cosecha-${s.id}`,tipo:dias<=7?"critica":"advertencia",icono:"🌿",titulo:`Cosecha próxima — ${s.nombre}`,sub:`Estimada el ${new Date(actCosecha.fecha_estimada+"T12:00:00").toLocaleDateString("es-PA",{day:"2-digit",month:"short"})} · En ${dias}d · ${s.hectareas} ha`,modulo:"name_m",orden:dias<=7?1:2});
      } else if(dias<0){
        alertas.push({id:`cosecha-venc-${s.id}`,tipo:"critica",icono:"🌿",titulo:`Cosecha VENCIDA — ${s.nombre}`,sub:`Estimada hace ${Math.abs(dias)}d · Actividad pendiente sin completar · ${s.hectareas} ha`,modulo:"name_m",orden:1});
      }
    }

    // ── 8. ACTIVIDADES DE ÑAME VENCIDAS (pendientes con fecha pasada) ─────
    const actsVencidas=actsS.filter(a=>
      a.estado==="pendiente"&&a.fecha_estimada&&diffD(TODAY,a.fecha_estimada)<0
    );
    if(actsVencidas.length>0){
      alertas.push({id:`acts-venc-${s.id}`,tipo:"advertencia",icono:"📋",titulo:`${actsVencidas.length} actividad${actsVencidas.length>1?"es":""} vencida${actsVencidas.length>1?"s":""} — ${s.nombre}`,sub:actsVencidas.slice(0,2).map(a=>`${a.actividad} (D${a.dias_estimado})`).join(", ")+(actsVencidas.length>2?` y ${actsVencidas.length-2} más`:""),modulo:"name_m",orden:3});
    }

    // ── 9. ACTIVIDADES PRÓXIMAS PENDIENTES (≤7 días) ──────────────────────
    const actsProximas=actsS.filter(a=>
      a.estado==="pendiente"&&a.fecha_estimada&&
      diffD(TODAY,a.fecha_estimada)>=0&&diffD(TODAY,a.fecha_estimada)<=7
    );
    actsProximas.forEach(a=>{
      const dias=diffD(TODAY,a.fecha_estimada);
      alertas.push({id:`act-prox-${a.id}`,tipo:"info",icono:"🗓️",titulo:`Actividad próxima — ${s.nombre}`,sub:`${a.actividad} · En ${dias}d (${new Date(a.fecha_estimada+"T12:00:00").toLocaleDateString("es-PA",{day:"2-digit",month:"short"})}) · Día ${a.dias_estimado} del ciclo`,modulo:"name_m",orden:4});
    });

    // ── 10. PRODUCCIÓN REAL NO REGISTRADA (>230 días desde siembra) ───────
    const diasSiembra=diffD(s.fecha_siembra,TODAY);
    if(diasSiembra>230&&!s.produccion_real_qq&&completadasActs<totalActs){
      alertas.push({id:`prod-falta-${s.id}`,tipo:"advertencia",icono:"📊",titulo:`Producción no registrada — ${s.nombre}`,sub:`Lleva ${diasSiembra} días desde siembra · Registrar quintales cosechados`,modulo:"name_m",orden:3});
    }
  });

  return alertas.sort((a,b)=>a.orden-b.orden);
}

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
  const [modo,setModo]=useState("login"); // login | nueva_pass
  const [nuevaPass,setNuevaPass]=useState(""),[nuevaPass2,setNuevaPass2]=useState("");
  const [passOk,setPassOk]=useState(false);

  // Detectar si viene de link de invitación o reset
  useEffect(()=>{
    const hash=window.location.hash;
    if(hash.includes("type=invite")||hash.includes("type=recovery")){
      setModo("nueva_pass");
      // Supabase procesa el token del hash automáticamente
      supabase.auth.getSession().then(({data:{session}})=>{
        if(session)setPassOk(true);
      });
    }
  },[]);

  const go=async e=>{
    e.preventDefault();
    if(!isConfigured){setErr("Configura Supabase primero");return;}
    setLoading(true);setErr("");
    try{
      const {data,error}=await supabase.auth.signInWithPassword({email,password:pass});
      if(error){setErr(error.message);setLoading(false);return;}
      let perfil=null;
      try{const {data:p}=await supabase.from("perfiles").select("*").eq("id",data.user.id).single();perfil=p;}catch(e){}
      onLogin({...data.user,perfil});
    }catch(e){setErr("Error de conexión. Verifica tu internet.");}
    setLoading(false);
  };

  const guardarPass=async e=>{
    e.preventDefault();
    if(nuevaPass.length<6){setErr("La contraseña debe tener al menos 6 caracteres");return;}
    if(nuevaPass!==nuevaPass2){setErr("Las contraseñas no coinciden");return;}
    setLoading(true);setErr("");
    const{data,error}=await supabase.auth.updateUser({password:nuevaPass});
    if(error){setErr(error.message);setLoading(false);return;}
    // Login automático después de crear contraseña
    let perfil=null;
    try{const {data:p}=await supabase.from("perfiles").select("*").eq("id",data.user.id).single();perfil=p;}catch(e){}
    setLoading(false);
    onLogin({...data.user,perfil});
  };

  if(modo==="nueva_pass") return <div className="login-screen"><div className="login-card">
    <div className="login-logo">
      <div className="login-emb"><img src="/Logo.png" style={{width:72,height:72,objectFit:"contain"}}/></div>
      <h1>Gosh Investment</h1>
      <p>Crea tu contraseña de acceso</p>
    </div>
    {!passOk&&<div className="linfo" style={{background:"#FEF2F2",color:G.red,borderColor:G.red}}>⏳ Procesando invitación...</div>}
    {err&&<div className="lerr">{err}</div>}
    {passOk&&<form onSubmit={guardarPass}>
      <div className="fgrp mb4">
        <label>Nueva Contraseña</label>
        <input type="password" placeholder="Mínimo 6 caracteres" value={nuevaPass} onChange={e=>{setNuevaPass(e.target.value);setErr("");}} autoFocus/>
      </div>
      <div className="fgrp mb4">
        <label>Confirmar Contraseña</label>
        <input type="password" placeholder="Repite la contraseña" value={nuevaPass2} onChange={e=>{setNuevaPass2(e.target.value);setErr("");}}/>
      </div>
      <button type="submit" className="btn btn-p" style={{width:"100%",justifyContent:"center",padding:"11px"}} disabled={loading||!passOk}>
        {loading?"Guardando...":"Crear Contraseña y Entrar"}
      </button>
    </form>}
  </div></div>;

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
function Loading({msg="Cargando datos...",onRetry=null}){
  const [slow,setSlow]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setSlow(true),8000);return()=>clearTimeout(t);},[]);
  return <div className="loading">
    <div className="spinner"></div>
    <span>{msg}</span>
    {slow&&<div style={{marginTop:16,textAlign:"center"}}>
      <p style={{fontSize:12,color:"#999",marginBottom:8}}>Tomando más tiempo de lo usual...</p>
      {onRetry&&<button className="btn btn-o btn-sm" onClick={onRetry}>↺ Reintentar</button>}
    </div>}
  </div>;
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
      {(()=>{
        const gastosNegocios=gastos.filter(g=>g.pagado_por==="Puercos"||g.pagado_por==="Ñames").reduce((s,g)=>s+Number(g.monto),0);
        const totIAll2=ingresos.reduce((s,i)=>s+Number(i.monto),0);
        const disponible=totIAll2-gastosNegocios;
        const ok=disponible>=0;
        return <div className="sc" style={{background:ok?"#E1F5EE":"#FEE2E2",border:`1.5px solid ${ok?"#0F6E56":"#991B1B"}`}}>
          <span className="si">💰</span>
          <span className="sl" style={{color:ok?"#0F6E56":"#991B1B"}}>Liquidez Actual</span>
          <span className="sv" style={{color:ok?"#0F6E56":"#991B1B",fontSize:18}}>{fmt$(Math.abs(disponible))}</span>
          <span className="str" style={{color:ok?"#0F6E56":"#991B1B"}}>{ok?"✓ Disponible en caja":"⚠ Sin liquidez"}</span>
        </div>;
      })()}
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
      {(PERMS.registrarGastos(role)||PERMS.registrarIngresos(role))&&<div className="fl gap2" style={{marginLeft:10}}>
        {PERMS.registrarIngresos(role)&&<button className="btn btn-p btn-sm" onClick={()=>{setModal("ingreso");setForm({fecha:new Date().toISOString().split("T")[0]});}}>+ Ingreso</button>}
        {PERMS.registrarGastos(role)&&<button className="btn btn-o btn-sm" onClick={()=>{setModal("gasto");setForm({fecha:new Date().toISOString().split("T")[0]});}}>+ Gasto</button>}
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
    <div className="tw"><table><thead><tr><th>Nombre</th><th>Descripción</th><th>Monto</th><th>Vence</th><th>Estado</th>{PERMS.eliminar(role)&&<th></th>}</tr></thead>
    <tbody>{items.length===0?<tr><td colSpan={6} style={{textAlign:"center",padding:20,color:G.g500}}>Sin registros pendientes</td></tr>:items.map(d=><tr key={d.id}>
      <td style={{fontWeight:600}}>{d.nombre}</td><td style={{fontSize:12}}>{d.descripcion}</td>
      <td style={{fontWeight:700}}>{fmt$(d.monto)}</td><td>{d.fecha_vence||"-"}</td>
      <td><span className={`badge ${d.estado==="Pagado"?"bg":d.estado==="Vencido"?"br":"bo"}`}>{d.estado}</span></td>
      {PERMS.eliminar(role)&&<td>{d.estado!=="Pagado"&&<button className="btn btn-sm btn-p" onClick={()=>marcar(d.id)}>✓</button>}</td>}
    </tr>)}</tbody></table></div>
  </div>;

  return <div>
    <div className="sg mb4">
      <div className="sc"><span className="si">📥</span><span className="sl">Por Cobrar</span><span className="sv" style={{color:G.deep}}>{fmt$(cobrar.reduce((s,d)=>s+Number(d.monto),0))}</span></div>
      <div className="sc"><span className="si">📤</span><span className="sl">Por Pagar</span><span className="sv" style={{color:G.red}}>{fmt$(pagar.reduce((s,d)=>s+Number(d.monto),0))}</span></div>
      <div className="sc"><span className="si">⚠️</span><span className="sl">Vencidas</span><span className="sv" style={{color:G.gold}}>{deudas.filter(d=>d.estado==="Vencido").length}</span></div>
    </div>
    {PERMS.eliminar(role)&&<div className="mb4"><button className="btn btn-p" onClick={()=>{setModal(true);setForm({});}}>+ Registrar Cuenta</button></div>}
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
    {PERMS.eliminar(role)&&<div className="mb4"><button className="btn btn-p" onClick={()=>{setModal(true);setForm({});}}>+ Agregar Item</button></div>}
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
        {(()=>{
          const totalAportaciones=Object.values(socioData).reduce((a,b)=>a+b,0);
          const cajaDisponible=totI-totalAportaciones;
          const seSostiene=cajaDisponible>=0;
          return <>
            {[
              {l:"Total aportado (socios)",v:fmt$(socioData.Roberto+socioData.Richard),c:G.deep},
              {l:"Total aportado (negocios)",v:fmt$(socioData.Puercos+socioData["Ñames"]),c:G.gold},
              {l:"Total aportaciones",v:fmt$(totalAportaciones),c:G.deep},
              {l:"vs. Gastos totales",v:`${totG>0?((totalAportaciones/totG)*100).toFixed(1):0}%`,c:G.mid},
            ].map(({l,v,c})=><div key={l} className="fb" style={{marginBottom:14,paddingBottom:14,borderBottom:`1px solid ${G.beigeD}`}}>
              <span style={{fontSize:13,color:G.g500}}>{l}</span><span style={{fontWeight:800,fontSize:16,color:c}}>{v}</span>
            </div>)}
            {/* Indicador Liquidez */}
            {(()=>{
              const gastosNegocios=socioData.Puercos+socioData["Ñames"];
              const disponible=totI-gastosNegocios;
              const ok=disponible>=0;
              return <div style={{marginTop:8,padding:16,borderRadius:10,background:ok?"#E1F5EE":"#FEE2E2",border:`1.5px solid ${ok?"#0F6E56":G.red}`}}>
                <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px",color:ok?"#0F6E56":G.red,marginBottom:12}}>
                  💰 Liquidez Actual
                </div>
                <div className="fb" style={{marginBottom:8}}><span style={{fontSize:13,color:G.g500}}>Ingresos a la fecha</span><span style={{fontWeight:700,color:G.deep}}>{fmt$(totI)}</span></div>
                <div className="fb" style={{marginBottom:12}}><span style={{fontSize:13,color:G.g500}}>Gastos cubiertos por ingresos</span><span style={{fontWeight:700,color:G.red}}>{fmt$(gastosNegocios)}</span></div>
                <div style={{height:1,background:"rgba(0,0,0,0.1)",marginBottom:12}}></div>
                <div className="fb">
                  <span style={{fontSize:15,fontWeight:800,color:ok?"#0F6E56":G.red}}>Disponible</span>
                  <span style={{fontSize:24,fontWeight:900,color:ok?"#0F6E56":G.red}}>{fmt$(Math.abs(disponible))}</span>
                </div>
                <div style={{marginTop:8,fontSize:11,color:ok?"#0F6E56":G.red}}>
                  {ok?"✓ El negocio se sostiene con los ingresos actuales":"⚠ Los ingresos no alcanzan a cubrir los gastos"}
                </div>
              </div>;
            })()}
          </>;
        })()}
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



// ─── MÓDULO ÑAME ─────────────────────────────────────────────────────────────
function NameModule({role,toast,gastos,ingresos,userId,userName}){
  const [siembras,setSiembras]=useState([]);
  const [actividades,setActividades]=useState([]);
  const [loading,setLoading]=useState(true);
  const [tab,setTab]=useState("timeline");
  const [selSiembra,setSelSiembra]=useState(null);
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const [saving,setSaving]=useState(false);

  const fetch=async()=>{
    setLoading(true);
    try{
      const[{data:s},{data:a}]=await Promise.all([
        supabase.from("siembras").select("*").order("fecha_siembra",{ascending:false}),
        supabase.from("actividades_name").select("*").order("dias_estimado"),
      ]);
      setSiembras(s||[]);setActividades(a||[]);
      if(!selSiembra&&s&&s.length)setSelSiembra(s[0].id);
    }catch(e){
      console.warn("NameModule fetch error:",e.message);
    }finally{
      setLoading(false);
    }
  };
  useEffect(()=>{fetch();},[]);

  const TODAY=new Date();
  const fmtD=d=>{if(!d)return"-";const dt=new Date(d+"T12:00:00");return dt.toLocaleDateString("es-PA",{day:"2-digit",month:"short",year:"2-digit"});};
  const diffD=(a,b)=>Math.ceil((new Date(b)-new Date(a))/(1000*60*60*24));

  const [actEdit,setActEdit]=useState(null); // actividad seleccionada para marcar

  const abrirMarcar=(act)=>{
    setActEdit(act);
    setForm({fecha_real:new Date().toISOString().split("T")[0],costo:act.costo||"",mozos:act.mozos||""});
    setModal("marcar_act");
  };

  const marcarCompletado=async()=>{
    if(!actEdit)return;
    setSaving(true);
    const{error}=await supabase.from("actividades_name").update({
      fecha_real:form.fecha_real,
      estado:"completado",
      costo:Number(form.costo)||0,
      mozos:Number(form.mozos)||0
    }).eq("id",actEdit.id);
    if(!error){
      await logAudit({userId,userName,accion:"completar_actividad",tabla:"actividades_name",registroId:actEdit.id,datosPrev:{estado:"pendiente"},datosNuevos:{estado:"completado",fecha_real:form.fecha_real,costo:form.costo,mozos:form.mozos}});
    }
    setSaving(false);
    if(error){toast(error.message,"error");}
    else{toast("Actividad completada ✓");await fetch();setModal(null);setActEdit(null);setForm({});}
  };

  if(loading)return<Loading msg="Cargando producción de Ñame..." onRetry={fetch}/>;

  const siembraActual=siembras.find(s=>s.id===selSiembra);
  const actsActual=actividades.filter(a=>a.siembra_id===selSiembra);
  const pendientes=actsActual.filter(a=>a.estado==="pendiente");
  const vencidas=actsActual.filter(a=>a.estado==="pendiente"&&new Date(a.fecha_estimada)<TODAY);
  const completadas=actsActual.filter(a=>a.estado==="completado");
  const proxima=pendientes.filter(a=>new Date(a.fecha_estimada)>=TODAY).sort((a,b)=>a.fecha_estimada.localeCompare(b.fecha_estimada))[0];

  // Financiero del módulo ñame
  const gastosName=gastos.filter(g=>g.modulo==="Ñame");
  const ingresosName=ingresos.filter(i=>i.modulo==="Ñame");
  const totGastos=gastosName.reduce((s,g)=>s+Number(g.monto),0);
  const totIngresos=ingresosName.reduce((s,i)=>s+Number(i.monto),0);
  const costoActividades=actsActual.reduce((s,a)=>s+Number(a.costo||0),0);
  const roiName=totGastos>0?((totIngresos/totGastos-1)*100).toFixed(1):0;

  // Timeline de actividades
  const diasTotal=siembraActual?diffD(siembraActual.fecha_siembra,new Date(siembraActual.fecha_siembra+"T00:00:00").setDate(new Date(siembraActual.fecha_siembra+"T00:00:00").getDate()+240)):240;
  const pctPos=dias=>(dias/240)*100;

  const catColor={quimico:"#4F46E5",abono:"#0F6E56",labor:"#C9A84C",cosecha:"#E24B4A"};
  const catBg={quimico:"#EEF2FF",abono:"#E1F5EE",labor:"#FDF6E3",cosecha:"#FEE2E2"};

  return <div>
    {/* Selector siembra */}
    <div className="fl gap2 mb4" style={{flexWrap:"wrap",justifyContent:"space-between"}}>
      <div className="fl gap2">
        {siembras.map(s=><button key={s.id} className={`btn ${selSiembra===s.id?"btn-p":"btn-o"} btn-sm`}
          onClick={()=>setSelSiembra(s.id)}>{s.nombre}</button>)}
        {PERMS.editarSiembras(role)&&<button className="btn btn-o btn-sm" onClick={()=>{setForm({nombre:"",fecha_siembra:"",hectareas:1,estado:"activa"});setModal("siembra");}}>+ Siembra</button>}
      </div>
      <div className="fl gap2">
        {[["timeline","📅 Timeline"],["actividades","📋 Actividades"],...(PERMS.verMontos(role)?[["financiero","💰 Financiero"]]:[])]
          .map(([k,l])=><button key={k} className={`btn btn-sm ${tab===k?"btn-p":"btn-o"}`} onClick={()=>setTab(k)}>{l}</button>)}
      </div>
    </div>

    {siembraActual&&<>
      {/* KPIs */}
      <div className="sg" style={{marginBottom:16}}>
        <div className="sc grn"><span className="si">🌿</span><span className="sl">{siembraActual.nombre}</span><span className="sv">{siembraActual.hectareas} ha</span><span className="str">{fmtD(siembraActual.fecha_siembra)}</span></div>
        <div className="sc"><span className="si">✅</span><span className="sl">Completadas</span><span className="sv">{completadas.length}</span><span className="str">de {actsActual.length} actividades</span></div>
        <div className="sc"><span className="si">⏳</span><span className="sl">Pendientes</span><span className="sv" style={{color:vencidas.length>0?G.red:G.gold}}>{pendientes.length}</span><span className="str">{vencidas.length>0?`${vencidas.length} vencidas`:"Al día"}</span></div>
        <div className="sc"><span className="si">📅</span><span className="sl">Próxima actividad</span><span className="sv" style={{fontSize:13}}>{proxima?proxima.actividad.slice(0,20)+"...":"—"}</span><span className="str">{proxima?fmtD(proxima.fecha_estimada):"Sin pendientes"}</span></div>
        <div className="sc"><span className="si">📅</span><span className="sl">Cosecha estimada</span><span className="sv" style={{color:G.deep}}>{fmtD(actsActual.find(a=>a.actividad==="Cosecha")?.fecha_estimada)}</span><span className="str">Día 230 desde siembra</span></div>
      </div>

      {/* Panel de Producción */}
      {(siembraActual.quintales_semilla||siembraActual.produccion_estimada_qq)&&(()=>{
        const qqSemilla=siembraActual.quintales_semilla||30;
        const semillas=siembraActual.semillas_total||(qqSemilla*500);
        const plantasProducen=Math.round(semillas*0.60);
        const plantasSemilla=Math.round(semillas*0.20);
        const plantasMerma=Math.round(semillas*0.20);
        const qqEst=siembraActual.produccion_estimada_qq||225;
        const qqReal=siembraActual.produccion_real_qq;
        const precioLb=siembraActual.precio_libra||0.40;
        const ingEst=qqEst*100*precioLb;
        const ingReal=qqReal?qqReal*100*precioLb:null;
        const pct=qqReal?Math.min((qqReal/qqEst)*100,100):0;
        return <div className="card mb4">
          <div className="card-h"><h3>🌾 Panel de Producción</h3><span style={{fontSize:12,color:G.g500}}>{qqSemilla} qq semilla · {semillas.toLocaleString()} semillas</span></div>
          <div className="card-b">
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:20}}>
              {/* Desglose semilla */}
              <div style={{padding:16,background:G.pale,borderRadius:10}}>
                <p style={{fontSize:12,fontWeight:700,color:G.g500,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:12}}>Desglose de Semilla</p>
                {[
                  {l:"Total semillas",v:semillas.toLocaleString(),c:G.deep},
                  {l:"Producción (60%)",v:plantasProducen.toLocaleString()+" plantas",c:"#0F6E56"},
                  {l:"Semilla reservada (20%)",v:plantasSemilla.toLocaleString()+" plantas",c:G.gold},
                  {l:"Merma estimada (20%)",v:plantasMerma.toLocaleString()+" plantas",c:G.red},
                ].map(({l,v,c})=><div key={l} className="fb" style={{marginBottom:8}}>
                  <span style={{fontSize:12,color:G.g500}}>{l}</span>
                  <span style={{fontWeight:700,fontSize:12,color:c}}>{v}</span>
                </div>)}
              </div>
              {/* Producción en quintales */}
              <div style={{padding:16,background:"#F0FBF7",borderRadius:10}}>
                <p style={{fontSize:12,fontWeight:700,color:G.g500,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:12}}>Producción en Quintales</p>
                {[
                  {l:"Peso prom. por planta",v:"2.5 lbs"},
                  {l:"Producción estimada",v:`${qqEst} qq`,c:"#0F6E56"},
                  {l:"Ingreso estimado",v:`$${ingEst.toLocaleString()}`,c:G.deep},
                  {l:"Precio por libra",v:`$${precioLb.toFixed(2)}`},
                ].map(({l,v,c})=><div key={l} className="fb" style={{marginBottom:8}}>
                  <span style={{fontSize:12,color:G.g500}}>{l}</span>
                  <span style={{fontWeight:700,fontSize:12,color:c||G.g700}}>{v}</span>
                </div>)}
              </div>
              {/* Real vs Estimado */}
              <div style={{padding:16,background:qqReal?"#E1F5EE":G.g100,borderRadius:10}}>
                <p style={{fontSize:12,fontWeight:700,color:G.g500,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:12}}>Real vs Estimado</p>
                <div style={{textAlign:"center",marginBottom:12}}>
                  <div style={{fontSize:36,fontWeight:900,color:qqReal?"#0F6E56":G.g300}}>{qqReal?`${qqReal} qq`:"—"}</div>
                  <div style={{fontSize:12,color:G.g500}}>cosechado real</div>
                </div>
                {qqReal&&<>
                  <div className="prog-bar" style={{height:8,marginBottom:6}}><div className="prog-fill" style={{width:`${pct}%`,background:"#0F6E56"}}></div></div>
                  <div className="fb">
                    <span style={{fontSize:11,color:G.g500}}>{pct.toFixed(0)}% del estimado</span>
                    <span style={{fontSize:11,fontWeight:700,color:"#0F6E56"}}>${ingReal?.toLocaleString()}</span>
                  </div>
                  {qqReal>qqEst&&<p style={{fontSize:11,color:"#0F6E56",fontWeight:600,marginTop:6}}>🎉 Superó el estimado por {qqReal-qqEst} qq</p>}
                  {qqReal<qqEst&&<p style={{fontSize:11,color:G.red,fontWeight:600,marginTop:6}}>⚠ {qqEst-qqReal} qq por debajo del estimado</p>}
                </>}
                {!qqReal&&<p style={{fontSize:11,color:G.g500,textAlign:"center"}}>Cosecha pendiente</p>}
              </div>
            </div>
          </div>
        </div>;
      })()}

      {/* ── TAB TIMELINE ── */}
      {tab==="timeline"&&<div className="card">
        <div className="card-h"><h3>📅 Timeline del Ciclo — {siembraActual.nombre}</h3><span style={{fontSize:12,color:G.g500}}>Siembra: {fmtD(siembraActual.fecha_siembra)} → Cosecha: {fmtD(actsActual.find(a=>a.actividad==="Cosecha")?.fecha_estimada)}</span></div>
        <div className="card-b">
          {/* Barra principal */}
          <div style={{position:"relative",height:32,background:G.beige,borderRadius:8,marginBottom:8,overflow:"visible"}}>
            {/* Barra de progreso */}
            {siembraActual&&(()=>{
              const diasHoy=Math.max(0,Math.min(240,diffD(siembraActual.fecha_siembra,TODAY)));
              const pct=(diasHoy/240)*100;
              return <div style={{position:"absolute",left:0,width:`${pct}%`,height:"100%",background:"linear-gradient(90deg,#9FE1CB,#5DCAA5)",borderRadius:8,opacity:0.5}}></div>;
            })()}
            {/* Marcadores de actividades */}
            {actsActual.map((a,i)=>{
              const pct=pctPos(a.dias_estimado);
              const done=a.estado==="completado";
              const venc=a.estado==="pendiente"&&new Date(a.fecha_estimada)<TODAY;
              const col=done?"#0F6E56":venc?G.red:catColor[a.categoria]||G.gold;
              return <div key={a.id} title={`${a.actividad}
${done?"✓ "+fmtD(a.fecha_real):"Est: "+fmtD(a.fecha_estimada)}`}
                style={{position:"absolute",left:`${pct}%`,top:0,bottom:0,width:3,background:col,zIndex:5,cursor:"pointer",borderRadius:2}}
                onClick={()=>setTab("actividades")}>
                <div style={{position:"absolute",top:-18,left:"50%",transform:"translateX(-50%)",fontSize:8,color:col,fontWeight:700,whiteSpace:"nowrap"}}>
                  {a.dias_estimado}d
                </div>
              </div>;
            })}
            {/* Línea de hoy */}
            {siembraActual&&(()=>{
              const diasHoy=diffD(siembraActual.fecha_siembra,TODAY);
              if(diasHoy<0||diasHoy>240)return null;
              const pct=(diasHoy/240)*100;
              return <div style={{position:"absolute",left:`${pct}%`,top:-8,bottom:-8,width:2,background:G.red,zIndex:10,borderRadius:1}}>
                <span style={{position:"absolute",top:-16,fontSize:9,color:G.red,fontWeight:700,transform:"translateX(-50%)",whiteSpace:"nowrap"}}>hoy D{diasHoy}</span>
              </div>;
            })()}
          </div>
          {/* Etiquetas de días */}
          <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:G.g500,marginBottom:20,paddingTop:4}}>
            {[0,15,18,45,60,120,138,150,180,210,230].map(d=><span key={d} style={{textAlign:"center"}}>{d}d</span>)}
          </div>
          {/* Leyenda categorias */}
          <div className="fl gap2" style={{flexWrap:"wrap",marginBottom:16}}>
            {Object.entries(catColor).map(([k,v])=><span key={k} style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:catBg[k],color:v,fontWeight:600,textTransform:"capitalize"}}>{k}</span>)}
            <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:G.redL,color:G.red,fontWeight:600}}>Hoy</span>
          </div>
          {/* Lista próximas actividades */}
          <div style={{borderTop:`1px solid ${G.beigeD}`,paddingTop:16}}>
            <p style={{fontWeight:700,fontSize:13,marginBottom:12,color:G.g700}}>Próximas actividades pendientes</p>
            {pendientes.filter(a=>new Date(a.fecha_estimada)>=TODAY).slice(0,4).map(a=>{
              const dias=diffD(TODAY,a.fecha_estimada);
              return <div key={a.id} className="fb" style={{marginBottom:10,padding:"10px 14px",background:catBg[a.categoria]||G.goldL,borderRadius:8,borderLeft:`3px solid ${catColor[a.categoria]||G.gold}`,gap:8}}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:13,color:G.g700}}>{a.actividad}</div>
                  <div style={{fontSize:11,color:G.g500,marginTop:2}}>Estimado: {fmtD(a.fecha_estimada)} — Día {a.dias_estimado}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                  <span style={{fontWeight:700,color:catColor[a.categoria]||G.gold,fontSize:13}}>D{dias}</span>
                  <div style={{fontSize:10,color:G.g500}}>días</div>
                  {PERMS.completarActCerdos(role)&&<button className="btn btn-sm btn-p" style={{fontSize:11,padding:"3px 8px"}} onClick={()=>abrirMarcar(a)}>✓</button>}
                </div>
              </div>;
            })}
            {vencidas.length>0&&<div style={{marginTop:12}}>
              <p style={{fontWeight:700,fontSize:12,color:G.red,marginBottom:8}}>⚠ Actividades vencidas ({vencidas.length})</p>
              {vencidas.map(a=><div key={a.id} className="fb" style={{marginBottom:8,padding:"8px 14px",background:G.redL,borderRadius:8,borderLeft:`3px solid ${G.red}`,gap:8}}>
                <div style={{flex:1,minWidth:0}}>
                  <span style={{fontSize:12,color:G.red,fontWeight:600}}>{a.actividad}</span>
                  <div style={{fontSize:11,color:G.red,marginTop:2}}>Vencida: {fmtD(a.fecha_estimada)}</div>
                </div>
                {PERMS.completarActCerdos(role)&&<button className="btn btn-sm btn-p" style={{fontSize:11,padding:"3px 8px",flexShrink:0}} onClick={()=>abrirMarcar(a)}>✓</button>}
              </div>)}
            </div>}
          </div>
        </div>
      </div>}

      {/* ── TAB ACTIVIDADES ── */}
      {tab==="actividades"&&<div className="card">
        <div className="card-h"><h3>📋 Actividades — {siembraActual.nombre}</h3>
          <div className="fl gap2">
            <span className="badge bg">{completadas.length} completadas</span>
            {vencidas.length>0&&<span className="badge br">{vencidas.length} vencidas</span>}
            {pendientes.length>0&&<span className="badge bo">{pendientes.length} pendientes</span>}
          </div>
        </div>
        <div className="tw"><table>
          <thead><tr><th>Día</th><th>Actividad</th><th>Categoría</th><th>F. Estimada</th><th>F. Real</th>{PERMS.verMontos(role)&&<th>Costo</th>}<th>Mozos</th><th>Estado</th>{PERMS.completarActName(role)&&<th></th>}</tr></thead>
          <tbody>{actsActual.map(a=>{
            const venc=a.estado==="pendiente"&&new Date(a.fecha_estimada)<TODAY;
            return <tr key={a.id} style={{background:a.estado==="completado"?"#F8FFFB":venc?"#FFF5F5":"white"}}>
              <td style={{fontWeight:700,color:catColor[a.categoria]||G.gold,textAlign:"center"}}>{a.dias_estimado}d</td>
              <td style={{fontSize:12,fontWeight:600}}>{a.actividad}</td>
              <td><span style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:catBg[a.categoria]||G.goldL,color:catColor[a.categoria]||G.gold,fontWeight:600,textTransform:"capitalize"}}>{a.categoria}</span></td>
              <td style={{fontSize:12}}>{fmtD(a.fecha_estimada)}</td>
              <td style={{fontSize:12,color:"#0F6E56",fontWeight:a.fecha_real?600:400}}>{a.fecha_real?fmtD(a.fecha_real):"—"}</td>
              {PERMS.verMontos(role)&&<td style={{fontWeight:600,color:a.costo>0?G.red:G.g300}}>{a.costo>0?`$${Number(a.costo).toFixed(2)}`:"—"}</td>}
              <td style={{textAlign:"center"}}>{a.mozos>0?a.mozos:"—"}</td>
              <td>{a.estado==="completado"?<span className="badge bg">✓ Listo</span>:venc?<span className="badge br">⚠ Vencida</span>:<span className="badge bo">Pendiente</span>}</td>
              {PERMS.completarActName(role)&&<td>{a.estado!=="completado"&&<button className="btn btn-sm btn-p" onClick={()=>abrirMarcar(a)}>✓ Marcar</button>}</td>}
            </tr>;
          })}</tbody>
        </table></div>
      </div>}

      {/* ── TAB FINANCIERO ── */}
      {tab==="financiero"&&<div>
        <div className="sg" style={{marginBottom:16}}>
          <div className="sc"><span className="si">📤</span><span className="sl">Gastos Módulo</span><span className="sv" style={{color:G.red}}>{`$${totGastos.toFixed(2)}`}</span><span className="str">Finanzas Ñame</span></div>
          <div className="sc"><span className="si">💰</span><span className="sl">Ingresos Módulo</span><span className="sv" style={{color:G.deep}}>{`$${totIngresos.toFixed(2)}`}</span><span className="str">Ventas Ñame</span></div>
          <div className="sc"><span className="si">📊</span><span className="sl">Balance</span><span className="sv" style={{color:totIngresos-totGastos>=0?G.deep:G.red}}>{`$${(totIngresos-totGastos).toFixed(2)}`}</span></div>
          <div className="sc"><span className="si">💹</span><span className="sl">ROI</span><span className="sv" style={{color:Number(roiName)>=0?G.deep:G.red}}>{roiName}%</span></div>
          <div className="sc"><span className="si">🔧</span><span className="sl">Costo Actividades</span><span className="sv" style={{color:G.red}}>{`$${costoActividades.toFixed(2)}`}</span><span className="str">Registrado en actividades</span></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div className="card"><div className="card-h"><h3>📤 Gastos por Categoría</h3></div>
            <div className="card-b">
              {(()=>{
                const cats={};gastosName.forEach(g=>{cats[g.categoria]=(cats[g.categoria]||0)+Number(g.monto);});
                const max=Math.max(...Object.values(cats),1);
                return Object.entries(cats).sort((a,b)=>b[1]-a[1]).map(([c,v])=><div key={c} style={{marginBottom:12}}>
                  <div className="fb" style={{marginBottom:4}}><span style={{fontSize:12,color:G.g700}}>{c}</span><span style={{fontWeight:700,color:G.red,fontSize:12}}>${v.toFixed(2)}</span></div>
                  <div className="prog-bar"><div className="prog-fill" style={{width:`${(v/max)*100}%`,background:G.red}}></div></div>
                </div>);
              })()}
            </div>
          </div>
          <div className="card"><div className="card-h"><h3>💰 Ingresos por Mes</h3></div>
            <div className="card-b">
              {ingresosName.length===0?<p style={{color:G.g500,fontSize:13}}>Sin ingresos registrados</p>:
                ingresosName.map(i=><div key={i.id} className="fb" style={{marginBottom:10,paddingBottom:10,borderBottom:`1px solid ${G.beigeD}`}}>
                  <div><div style={{fontSize:13,fontWeight:600}}>{i.descripcion||i.categoria}</div><div style={{fontSize:11,color:G.g500}}>{fmtD(i.fecha)}</div></div>
                  <span style={{fontWeight:700,color:G.deep}}>${Number(i.monto).toFixed(2)}</span>
                </div>)
              }
            </div>
          </div>
        </div>
      </div>}
    </>}

    {/* ── MODAL MARCAR ACTIVIDAD COMPLETADA ── */}
    {modal==="marcar_act"&&actEdit&&<div className="mo" onClick={()=>setModal(null)}><div className="md" onClick={e=>e.stopPropagation()}>
      <div className="fb mb4">
        <h3>✓ Completar Actividad</h3>
        <button className="btn btn-o btn-sm" onClick={()=>setModal(null)}>✕</button>
      </div>
      <div style={{background:G.pale,borderRadius:8,padding:"10px 14px",marginBottom:16}}>
        <div style={{fontWeight:700,fontSize:14,color:G.deep}}>{actEdit.actividad}</div>
        <div style={{fontSize:12,color:G.g500,marginTop:3}}>Día {actEdit.dias_estimado} del ciclo · Estimado: {fmtD(actEdit.fecha_estimada)}</div>
      </div>
      <div className="fg">
        <div className="fgrp">
          <label>Fecha Real de Ejecución</label>
          <input type="date" value={form.fecha_real||""} onChange={e=>setForm(f=>({...f,fecha_real:e.target.value}))}/>
        </div>
        {PERMS.verMontos(role)&&<div className="fgrp">
          <label>Costo Real ($)</label>
          <input type="number" step="0.01" placeholder="0.00" value={form.costo||""} onChange={e=>setForm(f=>({...f,costo:e.target.value}))}/>
        </div>}
        <div className="fgrp">
          <label>Mozos Utilizados</label>
          <input type="number" placeholder="0" value={form.mozos||""} onChange={e=>setForm(f=>({...f,mozos:e.target.value}))}/>
        </div>
      </div>
      <div className="fl gap2 mt4">
        <button className="btn btn-p" disabled={saving||!form.fecha_real} onClick={marcarCompletado}>
          {saving?"Guardando...":"✓ Marcar como Completada"}
        </button>
        <button className="btn btn-o" onClick={()=>setModal(null)}>Cancelar</button>
      </div>
    </div></div>}

    {/* ── MODAL NUEVA SIEMBRA ── */}
    {modal==="siembra"&&<div className="mo" onClick={()=>setModal(null)}><div className="md" onClick={e=>e.stopPropagation()}>
      <div className="fb mb4"><h3>🌿 Nueva Siembra</h3><button className="btn btn-o btn-sm" onClick={()=>setModal(null)}>✕</button></div>
      <div className="fg">
        <div className="fgrp"><label>Nombre</label><input placeholder="Siembra 2026" value={form.nombre||""} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))}/></div>
        <div className="fgrp"><label>Fecha Siembra</label><input type="date" value={form.fecha_siembra||""} onChange={e=>setForm(f=>({...f,fecha_siembra:e.target.value}))}/></div>
        <div className="fgrp"><label>Hectáreas</label><input type="number" step="0.1" value={form.hectareas||""} onChange={e=>setForm(f=>({...f,hectareas:e.target.value}))}/></div>
      </div>
      <div className="fl gap2 mt4">
        <button className="btn btn-p" disabled={saving} onClick={async()=>{
          setSaving(true);
          const{error}=await supabase.from("siembras").insert({nombre:form.nombre,fecha_siembra:form.fecha_siembra,hectareas:Number(form.hectareas)||1,estado:"activa"});
          setSaving(false);
          if(error)toast(error.message,"error");else{toast("Siembra creada ✓");setModal(null);setForm({});fetch();}
        }}>{saving?"Guardando...":"Guardar"}</button>
        <button className="btn btn-o" onClick={()=>setModal(null)}>Cancelar</button>
      </div>
    </div></div>}

  </div>;
}

// ─── MÓDULO PRODUCCIÓN PORCINA ────────────────────────────────────────────────
function CerdosModule({role,toast,userId,userName}){
  const [tab,setTab]=useState("timeline");
  const [cerdas,setCerdas]=useState([]);
  const [partos,setPartos]=useState([]);
  const [montas,setMontas]=useState([]);
  const [vacunas,setVacunas]=useState([]);
  const [ventas,setVentas]=useState([]);
  const [protocolo,setProtocolo]=useState([]);
  const [loading,setLoading]=useState(true);
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const [saving,setSaving]=useState(false);
  const [editItem,setEditItem]=useState(null);
  const [timelineMeses,setTimelinesMeses]=useState(6);
  const [timelineOffset,setTimelineOffset]=useState(0);

  const fetchPorcino=async(showLoading=true)=>{
    if(showLoading)setLoading(true);
    try{
      const [c,p,m,v,vt,pr]=await Promise.all([
        supabase.from("cerdas").select("*").order("codigo"),
        supabase.from("partos").select("*").order("fecha_parto",{ascending:false}),
        supabase.from("celos_montas").select("*").order("fecha_monta",{ascending:false}),
        supabase.from("vacunas_cerdas").select("*").order("fecha",{ascending:false}),
        supabase.from("ventas_lechones").select("*").order("fecha",{ascending:false}),
        supabase.from("protocolo_partos").select("*").order("fecha_estimada",{ascending:true}),
      ]);
      setCerdas(c.data||[]);setPartos(p.data||[]);setMontas(m.data||[]);
      setVacunas(v.data||[]);setVentas(vt.data||[]);setProtocolo(pr.data||[]);
    }catch(e){
      console.warn("fetchPorcino error:",e.message);
    }finally{
      if(showLoading)setLoading(false);
    }
  };

  useEffect(()=>{fetchPorcino();},[]);

  const madres=cerdas.filter(c=>c.tipo==="Madre"&&c.estado==="Activa");
  const verracos=cerdas.filter(c=>c.tipo==="Verraco");
  const totalLechones=partos.reduce((s,p)=>s+p.lechones_vivos,0);
  const totalVentas=ventas.reduce((s,v)=>s+Number(v.total),0);
  const vendidosReales=ventas.filter(v=>v.tipo!=="transferencia"&&(v.estatus!=="Abono")).reduce((s,v)=>s+v.cantidad,0);

  // Helpers
  const GEST=114,LACT=28,DESC=21;
  const addD=(d,n)=>{const r=typeof d==="string"?new Date(d+"T12:00:00"):new Date(d);r.setDate(r.getDate()+n);return r;};
  const diffD=(a,b)=>Math.ceil((new Date(b)-new Date(a))/(1000*60*60*24));
  const fmtS=(d)=>d?new Date(d).toLocaleDateString("es-PA",{day:"numeric",month:"short"}):"-";
  const toISO=(d)=>{if(!d)return"";if(typeof d==="string"&&d.length>=10)return d.substring(0,10);const dt=new Date(d);return dt.toISOString().split("T")[0];};
  const fmtDisp=(d)=>{
    if(!d)return"-";
    const dt=new Date(d+"T12:00:00");
    return dt.toLocaleDateString("es-PA",{day:"2-digit",month:"short",year:"2-digit"}).replace(/ /g,"-");
  };
  // TODAY normalizado a mediodía para evitar problemas de timezone
  const _todayRaw=new Date();
  const TODAY=new Date(_todayRaw.getFullYear(),_todayRaw.getMonth(),_todayRaw.getDate(),12,0,0);

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
    let ok=false,newId=null;
    try{
      const {data,error}=await supabase.from(tabla).insert(datos).select().single();
      if(error)toast(error.message,"error");
      else{ok=true;newId=data?.id;toast("Guardado ✓");}
    }catch(e){toast(e.message,"error");}
    finally{setSaving(false);}
    if(ok){
      await logAudit({userId,userName,accion:"insertar",tabla,registroId:newId,datosNuevos:datos});
      await fetchPorcino(false);
      setModal(null);setForm({});
    }
  };

  const updateRow=async(tabla,id,datos,datosPrev=null)=>{
    setSaving(true);
    const clean=Object.fromEntries(Object.entries(datos).filter(([k,v])=>v===null||typeof v!=="object"||v instanceof Date));
    let ok=false;
    try{
      const {error}=await supabase.from(tabla).update(clean).eq("id",id);
      if(error){toast(error.message,"error");}
      else{ok=true;toast("Actualizado ✓");}
    }catch(e){toast(e.message,"error");}
    finally{setSaving(false);}
    if(ok){
      await logAudit({userId,userName,accion:"actualizar",tabla,registroId:id,datosPrev,datosNuevos:clean});
      await fetchPorcino(false);
      setModal(null);setForm({});setEditItem(null);
    }
  };

  const deleteRow=async(tabla,id)=>{
    if(!window.confirm("¿Eliminar este registro?"))return;
    try{
      const {error}=await supabase.from(tabla).delete().eq("id",id);
      if(error)toast(error.message,"error");
      else{
        await logAudit({userId,userName,accion:"eliminar",tabla,registroId:id});
        toast("Eliminado ✓");
        await fetchPorcino(false);
      }
    }catch(e){toast(e.message,"error");}
  };

  const openEdit=(tipo,item)=>{setEditItem({tipo,...item});setForm({...item});setModal("edit_"+tipo);};
  const openNew=(tipo,defaults={})=>{setForm({...defaults});setModal("new_"+tipo);};

  if(loading)return <Loading msg="Cargando datos porcinos..." onRetry={()=>fetchPorcino()}/>;

  // Group data
  const montasByCerda={};
  const getCerdaNombre=id=>cerdas.find(c=>c.id===id)?.nombre||"?";
  montas.forEach(m=>{const n=getCerdaNombre(m.cerda_id);if(!montasByCerda[n])montasByCerda[n]=[];montasByCerda[n].push(m);});
  const partosByCerda={};
  partos.forEach(p=>{const n=getCerdaNombre(p.cerda_id);if(!partosByCerda[n])partosByCerda[n]=[];partosByCerda[n].push(p);});
  const vacunasByCerda={};
  vacunas.forEach(v=>{const n=getCerdaNombre(v.cerda_id);if(!vacunasByCerda[n])vacunasByCerda[n]=[];vacunasByCerda[n].push(v);});

  const estadoBadge=(e)=>e==="Activa"?"bg":e==="Muerta"?"br":e==="Vendida"?"bo":"bk";

  // ─── FUNCIÓN UNIFICADA DE ESTADO DE CERDA ────────────────────────────────
  // Una sola función usada en Inventario, Timeline Estado Actual, y Timeline Histórico
  const normDate=(d)=>{
    if(!d)return null;
    if(typeof d==="string")return d.substring(0,10);
    if(d instanceof Date)return d.toISOString().substring(0,10);
    return null;
  };
  const normMs=(d)=>{const s=normDate(d);return s?new Date(s+"T12:00:00").getTime():0;};
  const diasDesde=(fecha)=>Math.floor((TODAY.getTime()-normMs(fecha))/(1000*60*60*24));

  const calcEstadoCerda=(cerda)=>{
    if(cerda.estado!=="Activa")return{label:cerda.estado,color:G.g500,bg:G.g100,pct:0,detalle:"",barColor:G.g300,esProyectado:false};
    const cPartos=partos.filter(p=>p.cerda_id===cerda.id).sort((a,b)=>normMs(b.fecha_parto)-normMs(a.fecha_parto));
    const cMontas=montas.filter(m=>m.cerda_id===cerda.id).sort((a,b)=>normMs(b.fecha_monta)-normMs(a.fecha_monta));
    const lastParto=cPartos[0];
    const lastMonta=cMontas[0];

    // Si hay monta posterior al parto (o solo monta sin parto) → gestación
    const montaActiva=lastMonta&&(!lastParto||normMs(lastMonta.fecha_monta)>normMs(lastParto.fecha_parto));

    if(montaActiva){
      const dg=diasDesde(lastMonta.fecha_monta);
      const proxParto=normDate(addD(normDate(lastMonta.fecha_monta),GEST));
      const fmtFecha=d=>d?new Date(d+"T12:00:00").toLocaleDateString("es-PA",{day:"2-digit",month:"short",year:"2-digit"}):"-";
      if(dg>=0&&dg<=GEST)return{label:`Gestación D${dg}`,color:"#185FA5",bg:"#E6F1FB",pct:(dg/GEST)*100,barColor:"#FAC775",esProyectado:false,
        detalle:`Monta ${fmtFecha(normDate(lastMonta.fecha_monta))} · Parto est. ${fmtFecha(proxParto)}`};
      if(dg>GEST)return{label:"Parto pendiente",color:G.red,bg:G.redL,pct:100,barColor:G.red,esProyectado:false,
        detalle:`Monta ${fmtFecha(normDate(lastMonta.fecha_monta))} · Parto est. vencido ${fmtFecha(proxParto)}`};
    }

    if(lastParto){
      const fmtFecha=d=>d?new Date((typeof d==="string"?d+"T12:00:00":d)).toLocaleDateString("es-PA",{day:"2-digit",month:"short",year:"2-digit"}):"-";
      const protoUltParto=protocolo.filter(x=>x.parto_id===lastParto.id);
      const desteteProto=protoUltParto.find(x=>x.procedimiento==="Destete");
      const fechaDestete=desteteProto?.fecha_real||desteteProto?.fecha_estimada||null;
      const destete=fechaDestete?new Date(normMs(fechaDestete)):addD(normDate(lastParto.fecha_parto),LACT);
      const descFin=addD(destete,DESC);
      const dp=diasDesde(lastParto.fecha_parto);
      const dd=Math.floor((TODAY.getTime()-destete.getTime())/(1000*60*60*24));
      const LACT_REAL=Math.ceil((destete.getTime()-normMs(lastParto.fecha_parto))/(1000*60*60*24));

      if(TODAY<destete){
        return{label:`Lactancia D${dp}`,color:"#0F6E56",bg:"#E1F5EE",pct:(dp/LACT_REAL)*100,barColor:"#5DCAA5",esProyectado:false,
          detalle:`Parió ${fmtFecha(lastParto.fecha_parto)} · ${lastParto.lechones_vivos} lechones · Destete ${desteteProto?.fecha_real?"real":"est."} ${fmtFecha(destete)}`};
      }
      if(dd>=0&&TODAY<descFin){
        const proxMonta=addD(descFin,0);
        return{label:`Descanso D${dd}`,color:"#7B6FC4",bg:"#EEF0FF",pct:(dd/DESC)*100,barColor:"#AFA9EC",esProyectado:false,
          detalle:`Descanso/celo · Destete ${fmtFecha(destete)} · Próx. monta est. ${fmtFecha(proxMonta)}`};
      }
      // Descanso terminó, gestación proyectada
      const proxMonta=new Date(Math.max(descFin.getTime(),TODAY.getTime()));
      const proxParto=addD(proxMonta,GEST);
      const dg=Math.floor((TODAY.getTime()-proxMonta.getTime())/(1000*60*60*24));
      return{label:`Gestación D${dg}`,color:"#3BA57A",bg:G.pale,pct:Math.min((dg/GEST)*100,100),barColor:"#9FE1CB",esProyectado:true,
        detalle:`Gestación estimada · Parto proyectado ${fmtFecha(proxParto)}`};
    }

    return{label:"Sin datos",color:G.g300,bg:G.g100,pct:0,barColor:G.g300,esProyectado:false,detalle:""};
  };

  const estadoProduccion=(cerda)=>{
    const r=calcEstadoCerda(cerda);
    return{label:r.label,color:r.color,bg:r.bg};
  };

  const buildTimelineData=()=>{
    const meses=timelineMeses;
    // Una sola función de conversión para TODO el timeline
    const MS_DAY=86400000;
    const diasRango=Math.round(meses*30.44);
    const tStartMs=TODAY.getTime()-Math.floor(diasRango/2)*MS_DAY+timelineOffset*diasRango*MS_DAY;
    const tEndMs=tStartMs+diasRango*MS_DAY;
    const tStart=new Date(tStartMs);
    const tEnd=new Date(tEndMs);
    const total=tEndMs-tStartMs;
    // Función única: fecha (string o Date) → porcentaje en el timeline
    const toMs=d=>{if(typeof d==="string")return new Date(d+"T12:00:00").getTime();if(d instanceof Date){// If date has no time component (midnight UTC), add 12h to avoid timezone shift
return d.getTime()+(d.getHours()===0&&d.getTimezoneOffset()!==0?12*3600000:0);}return new Date(d).getTime();};
    const dateToPct=d=>((toMs(d)-tStartMs)/total)*100;
    const todayPct=dateToPct(TODAY);

    const monthLabels=[];
    let cur=new Date(tStart.getFullYear(),tStart.getMonth(),1);
    while(cur<tEnd){const y=cur.getFullYear();const mo=cur.getMonth();const days=new Date(y,mo+1,0).getDate();monthLabels.push({m:cur.toLocaleDateString("es-PA",{month:"short",year:"2-digit"}),year:y,month:mo,daysInMonth:days,startPct:dateToPct(new Date(y,mo,1)),widthPct:((new Date(y,mo+1,1)-new Date(y,mo,1))/total)*100});cur.setMonth(cur.getMonth()+1);}

    const rows=cerdas.filter(c=>c.tipo==="Madre"&&c.estado==="Activa").map(c=>{
      const cPartos=partos.filter(p=>p.cerda_id===c.id).sort((a,b)=>a.fecha_parto.localeCompare(b.fecha_parto));
      const cMontas=montas.filter(m=>m.cerda_id===c.id).sort((a,b)=>a.fecha_monta.localeCompare(b.fecha_monta));
      const lastParto=cPartos[cPartos.length-1];
      const lastMonta=cMontas[cMontas.length-1];

      // Calculate projected next cycle
      // Si hay monta posterior al último parto, usar esa monta para proyectar
      const montaPostParto=lastMonta&&(!lastParto||lastMonta.fecha_monta>lastParto.fecha_parto);
      let proxMonta=null,proxParto=null;
      if(montaPostParto){
        // Ya tiene monta real → proyectar parto desde esa monta
        proxParto=addD(lastMonta.fecha_monta,GEST);
      } else if(lastParto){
        // Aún en lactancia/descanso → proyectar próxima monta
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
        const gs=dateToPct(gS),ge=dateToPct(p.fecha_parto);
        const ls=ge,le=dateToPct(lE),ds=le,de=dateToPct(dE);
        if(ge>gs)segs.push({l:gs,w:ge-gs,color:"#9FE1CB",title:`Gestación → parto ${fmtS(p.fecha_parto)}`});
        if(le>ls)segs.push({l:ls,w:le-ls,color:"#5DCAA5",title:`Lactancia hasta ${fmtS(lE)}`});
        if(de>ds)segs.push({l:ds,w:de-ds,color:"#AFA9EC",title:"Descanso/celo"});
      });
      // Segmento de gestación real o proyectada
      if(montaPostParto&&proxParto){
        // Gestación real desde la monta registrada
        const gs=dateToPct(lastMonta.fecha_monta),ge=dateToPct(proxParto);
        const lE=addD(proxParto,LACT);
        const ls=ge,le=dateToPct(lE);
        if(ge>gs)segs.push({l:gs,w:ge-gs,color:"#FAC775",proj:true,title:`Gestación → parto est. ${fmtS(proxParto)}`});
        if(le>ls)segs.push({l:ls,w:le-ls,color:"#EF9F27",proj:true,title:"Lactancia proyectada"});
      } else if(proxMonta&&proxParto){
        const lE=addD(proxParto,LACT);
        const ps=dateToPct(proxMonta),pe=dateToPct(proxParto);
        const ls=pe,le=dateToPct(lE);
        if(pe>ps)segs.push({l:ps,w:pe-ps,color:"#FAC775",proj:true,title:`Gestación proy. → ${fmtS(proxParto)}`});
        if(le>ls)segs.push({l:ls,w:le-ls,color:"#EF9F27",proj:true,title:"Lactancia proyectada"});
      }

      // Dots
      const dots=[];
      cPartos.forEach(p=>{const x=dateToPct(p.fecha_parto);if(x>=0&&x<=100)dots.push({x,color:"#378ADD",title:`Parto ${fmtS(p.fecha_parto)} — ${p.lechones_vivos} lech.`});});
      cMontas.forEach(m=>{const x=dateToPct(m.fecha_monta);if(x>=0&&x<=100)dots.push({x,color:"#639922",title:`Monta ${fmtS(m.fecha_monta)}`});});
      if(proxMonta){const x=dateToPct(proxMonta);if(x>=0&&x<=100)dots.push({x,color:"#EF9F27",title:`Monta proy. ${fmtS(proxMonta)}`});}
      if(proxParto){const x=dateToPct(proxParto);if(x>=0&&x<=100)dots.push({x,color:"#E24B4A",title:`Parto proy. ${fmtS(proxParto)}`});}

      // Status — prioriza monta posterior al parto
      let sLabel="Activa",sColor=G.deep,sBg=G.pale;
      if(c.estado!=="Activa"){sLabel=c.estado;sColor=G.g500;sBg=G.g100;}
      else if(montaPostParto&&proxParto){
        const d=diffD(TODAY,proxParto);
        const diasGest=GEST-d;
        if(d>=0&&d<=14){sLabel=`Parto en ${d}d`;sColor=G.red;sBg=G.redL;}
        else if(diasGest>=0&&diasGest<=GEST){sLabel=`Gestación D${diasGest}`;sColor="#185FA5";sBg="#E6F1FB";}
        else{sLabel=`Parto: ${fmtS(proxParto)}`;sColor="#185FA5";sBg="#E6F1FB";}
      } else if(lastParto&&!montaPostParto){
        const diasDesdeParto=Math.ceil((TODAY-new Date(lastParto.fecha_parto+"T12:00:00"))/(1000*60*60*24));
        const desteteReal=addD(lastParto.fecha_parto,LACT);
        const descFinReal=addD(desteteReal,DESC);
        if(diasDesdeParto>=0&&diasDesdeParto<LACT){sLabel=`Lactancia D${diasDesdeParto}`;sColor="#0F6E56";sBg="#E1F5EE";}
        else if(diasDesdeParto>=LACT&&TODAY<new Date(descFinReal+"T12:00:00")){sLabel="Descanso/Celo";sColor="#7B6FC4";sBg="#EEF0FF";}
        else if(proxParto){
          const d=diffD(TODAY,proxParto);
          if(d>=0&&d<=14){sLabel=`Parto en ${d}d`;sColor=G.red;sBg=G.redL;}
          else if(d>=0&&d<=60){sLabel=`Gestación`;sColor="#185FA5";sBg="#E6F1FB";}
          else{sLabel=`Parto: ${fmtS(proxParto)}`;sColor=G.deep;sBg=G.pale;}
        }
      } else if(proxParto){
        const d=diffD(TODAY,proxParto);
        if(d>=0&&d<=14){sLabel=`Parto en ${d}d`;sColor=G.red;sBg=G.redL;}
        else{sLabel=`Parto: ${fmtS(proxParto)}`;sColor=G.deep;sBg=G.pale;}
      }

      // Checklist — usa protocolo_partos real
      const checks=[];
      if(lastParto&&c.estado==="Activa"){
        const dp=diffD(lastParto.fecha_parto,TODAY);
        if(dp>=0&&dp<45){
          const protoP=protocolo.filter(x=>x.parto_id===lastParto.id);
          const PROCS=["Descolmillado","Hierro 1ra dosis","Hierro 2da dosis","Capadura machos","Desparasitación","Vitaminación","Destete"];
          PROCS.forEach(proc=>{
            const pr=protoP.find(x=>x.procedimiento===proc);
            if(!pr)return;
            if(pr.estado==="completado"){
              checks.push({l:`${proc} ✓`,s:"done"});
            } else {
              const diasFalta=diffD(TODAY,pr.fecha_estimada);
              if(diasFalta<0)checks.push({l:`${proc} ⚠ vencido`,s:"alert"});
              else checks.push({l:`${proc} (D${diasFalta})`,s:"pending"});
            }
          });
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
      <div className="sc">
        <span className="si">💰</span><span className="sl">Ventas Lechones</span>
        {PERMS.verMontos(role)
          ?<span className="sv" style={{fontSize:18}}>{fmt$(totalVentas)}</span>
          :<span className="sv">{ventas.filter(v=>v.tipo!=="transferencia"&&v.tipo!=="Cerda"&&v.tipo!=="Monta"&&v.estatus!=="Abono").reduce((s,v)=>s+v.cantidad,0)} uds</span>}
        <span className="str">{ventas.filter(v=>v.tipo!=="transferencia"&&v.tipo!=="Cerda"&&v.tipo!=="Monta"&&v.estatus!=="Abono").reduce((s,v)=>s+v.cantidad,0)} lechones · {ventas.filter(v=>v.tipo==="Cerda").reduce((s,v)=>s+v.cantidad,0)} cerdas · {ventas.filter(v=>v.tipo==="Monta").reduce((s,v)=>s+v.cantidad,0)} montas</span>
      </div>
    </div>

    {/* Tabs + Add button */}
    <div className="fl mb4" style={{flexWrap:"wrap",gap:4}}>
      <div className="tabs" style={{marginBottom:0,flex:1}}>
        {[["timeline","📅 Timeline"],["cerdas","🐷 Inventario"],["montas","❤️ Montas"],["partos","🐣 Partos"],["vacunas","💉 Vacunas"],["ventas","🤝 Ventas"]].map(([t,l])=>
          <button key={t} className={`tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>{l}</button>
        )}
      </div>
      {PERMS.editarCerdas(role)&&tab!=="timeline"&&<button className="btn btn-p btn-sm" style={{marginLeft:8}} onClick={()=>openNew(
        tab==="cerdas"?"cerda":tab==="montas"?"monta":tab==="partos"?"parto":tab==="vacunas"?"vacuna":"venta",
        tab==="montas"?{fecha_monta:toISO(TODAY)}:tab==="partos"?{fecha_parto:toISO(TODAY)}:tab==="vacunas"?{fecha:toISO(TODAY)}:tab==="ventas"?{fecha:toISO(TODAY)}:{}
      )}>+ Agregar</button>}
    </div>

    {/* ── TIMELINE ── */}
    {tab==="timeline"&&(()=>{
      const GEST=114,LACT=28,DESC=21;
      const MS_DAY=86400000;
      const toMs=d=>typeof d==="string"?new Date(d+"T12:00:00").getTime():d instanceof Date?d.getTime():new Date(d).getTime();
      const addDays=(d,n)=>{const dt=new Date(toMs(d));dt.setDate(dt.getDate()+n);return dt;};
      const dateToPct=(d,tS,tot)=>((toMs(d)-tS)/tot)*100;
      const fmtLabel=d=>{if(!d)return"";const dt=new Date(toMs(d));return dt.toLocaleDateString("es-PA",{day:"2-digit",month:"short",year:"2-digit"});};

      // helpers de fecha robustos para el timeline
      const tDate=(d)=>{if(!d)return null;if(typeof d==="string"){if(/^\d{4}-\d{2}-\d{2}$/.test(d))return d;return d.substring(0,10);}if(d instanceof Date)return d.toISOString().substring(0,10);return null;};
      const tDateMs=(d)=>{const s=tDate(d);return s?new Date(s+"T12:00:00").getTime():0;};

      // ── SECCIÓN 1: ESTADO ACTUAL — usa calcEstadoCerda unificado ──
      const estadoActual=cerdas.filter(c=>c.estado==="Activa"&&c.tipo==="Madre").map(c=>{
        const r=calcEstadoCerda(c);
        const lastParto=partos.filter(p=>p.cerda_id===c.id).sort((a,b)=>normMs(b.fecha_parto)-normMs(a.fecha_parto))[0];
        const lastMonta=montas.filter(m=>m.cerda_id===c.id).sort((a,b)=>normMs(b.fecha_monta)-normMs(a.fecha_monta))[0];
        return{c,estado:r.label,color:r.color,bg:r.bg,pct:r.pct,detalle:r.detalle,barColor:r.barColor,esProyectado:r.esProyectado,lastParto,lastMonta};
      });

      // ── SECCIÓN 2: HISTÓRICO (rango configurable) ──
      const diasRango=Math.round(timelineMeses*30.44);
      // Usar mediodía como referencia consistente para todo el timeline
      const todayNoon=new Date(TODAY.getFullYear(),TODAY.getMonth(),TODAY.getDate(),12,0,0);
      const tStartMs=todayNoon.getTime()-(diasRango/2)*MS_DAY+(timelineOffset*diasRango/2)*MS_DAY;
      const tEndMs=tStartMs+diasRango*MS_DAY;
      const tTot=tEndMs-tStartMs;
      // Convierte cualquier fecha a ms usando mediodía para strings
      const toMsL=d=>{
        if(typeof d==="string")return new Date(d+"T12:00:00").getTime();
        if(d instanceof Date)return new Date(d.getFullYear(),d.getMonth(),d.getDate(),12,0,0).getTime();
        return new Date(d).getTime();
      };
      const dPct=d=>((toMsL(d)-tStartMs)/tTot)*100;
      const todayPct=((todayNoon.getTime()-tStartMs)/tTot)*100; // siempre 50% con offset=0

      // Generar etiquetas de meses
      const monthLabels=[];
      let cur=new Date(new Date(tStartMs).getFullYear(),new Date(tStartMs).getMonth(),1);
      while(cur.getTime()<tEndMs){
        const y=cur.getFullYear(),mo=cur.getMonth();
        const days=new Date(y,mo+1,0).getDate();
        const mStart=new Date(y,mo,1,12,0,0),mEnd=new Date(y,mo+1,1,12,0,0);
        monthLabels.push({m:cur.toLocaleDateString("es-PA",{month:"short",year:"2-digit"}),daysInMonth:days,startPct:dPct(mStart),widthPct:(mEnd-mStart)/tTot*100});
        cur.setMonth(cur.getMonth()+1);
      }

      // Filas históricas — solo cerdas activas
      const histRows=cerdas.filter(c=>c.estado==="Activa"&&c.tipo==="Madre").map(c=>{
        const cPartos=partos.filter(p=>p.cerda_id===c.id).sort((a,b)=>toMsL(a.fecha_parto)-toMsL(b.fecha_parto));
        const cMontas=montas.filter(m=>m.cerda_id===c.id).sort((a,b)=>toMsL(a.fecha_monta)-toMsL(b.fecha_monta));
        const lastParto=cPartos[cPartos.length-1];
        const lastMonta=cMontas[cMontas.length-1];
        const segs=[];const dots=[];

        // Segmentos por cada parto real — cortar lactancia/descanso si hay monta posterior
        cPartos.forEach((p,pi)=>{
          const gS=addDays(p.fecha_parto,-GEST);
          const lE=addDays(p.fecha_parto,LACT);
          const dE=addDays(lE,DESC);
          // Buscar si hay monta real que interrumpe la lactancia o descanso de este parto
          const montaInterrupcion=cMontas.find(m=>toMsL(m.fecha_monta)>toMsL(p.fecha_parto)&&toMsL(m.fecha_monta)<toMsL(dE));
          const corteLactDesc=montaInterrupcion?new Date(toMsL(montaInterrupcion.fecha_monta)):null;
          const lEreal=corteLactDesc&&toMsL(corteLactDesc)<toMsL(lE)?corteLactDesc:lE;
          const dEreal=corteLactDesc?corteLactDesc:dE;

          const gs=dPct(gS),ge=dPct(p.fecha_parto);
          const ls=ge,le=dPct(lEreal),ds=dPct(lE),de=dPct(dEreal);
          if(ge>gs&&ge>0&&gs<100)segs.push({l:Math.max(gs,0),w:Math.min(ge,100)-Math.max(gs,0),color:"#9FE1CB",title:`Gestación → Parto ${fmtLabel(p.fecha_parto)}`});
          if(le>ls&&le>0&&ls<100)segs.push({l:Math.max(ls,0),w:Math.min(le,100)-Math.max(ls,0),color:"#5DCAA5",title:`Lactancia ${fmtLabel(p.fecha_parto)} → ${fmtLabel(lEreal)} · ${p.lechones_vivos} lechones`});
          // Solo mostrar descanso si NO fue interrumpido por monta
          if(!corteLactDesc||toMsL(corteLactDesc)>toMsL(lE)){
            if(de>ds&&de>0&&ds<100)segs.push({l:Math.max(ds,0),w:Math.min(de,100)-Math.max(ds,0),color:"#AFA9EC",title:`Descanso hasta ${fmtLabel(dEreal)}`});
          }
          const xp=dPct(p.fecha_parto);if(xp>=0&&xp<=100)dots.push({x:xp,color:"#378ADD",title:`Parto ${fmtLabel(p.fecha_parto)} · ${p.lechones_vivos} lech.`});
        });
        cMontas.forEach(m=>{const x=dPct(m.fecha_monta);if(x>=0&&x<=100)dots.push({x,color:"#639922",title:`Monta ${fmtLabel(m.fecha_monta)}`});});

        // Próximo ciclo — si hay monta posterior al parto (o sin parto), usar esa monta real
        const montaPostPartoH=lastMonta&&(!lastParto||toMsL(lastMonta.fecha_monta)>toMsL(lastParto.fecha_parto));
        if(montaPostPartoH){
          // Gestación real desde la monta registrada
          const proxParto=addDays(lastMonta.fecha_monta,GEST);
          const proxLact=addDays(proxParto,LACT);
          const ms=dPct(lastMonta.fecha_monta),pe=dPct(proxParto),le=dPct(proxLact);
          if(pe>ms&&pe>0&&ms<100)segs.push({l:Math.max(ms,0),w:Math.min(pe,100)-Math.max(ms,0),color:"#FAC775",proj:true,title:`Gestación → ${fmtLabel(proxParto)}`});
          if(le>pe&&le>0&&pe<100)segs.push({l:Math.max(pe,0),w:Math.min(le,100)-Math.max(pe,0),color:"#EF9F27",proj:true,title:`Lactancia proyectada`});
          const xpp=dPct(proxParto);if(xpp>=0&&xpp<=100)dots.push({x:xpp,color:"#E24B4A",title:`Parto proyectado ${fmtLabel(proxParto)}`});
        } else if(lastParto){
          const destete=addDays(lastParto.fecha_parto,LACT);
          const descFin=addDays(destete,DESC);
          const proxMonta=new Date(Math.max(descFin.getTime(),TODAY.getTime()));
          const proxParto=addDays(proxMonta,GEST);
          const proxLact=addDays(proxParto,LACT);
          const ps=dPct(proxMonta),pe=dPct(proxParto),le=dPct(proxLact);
          if(pe>ps&&pe>0&&ps<100)segs.push({l:Math.max(ps,0),w:Math.min(pe,100)-Math.max(ps,0),color:"#FAC775",proj:true,title:`Gestación proyectada → ${fmtLabel(proxParto)}`});
          if(le>pe&&le>0&&pe<100)segs.push({l:Math.max(pe,0),w:Math.min(le,100)-Math.max(pe,0),color:"#EF9F27",proj:true,title:`Lactancia proyectada`});
          const xpm=dPct(proxMonta);if(xpm>=0&&xpm<=100)dots.push({x:xpm,color:"#EF9F27",title:`Monta proyectada ${fmtLabel(proxMonta)}`});
          const xpp=dPct(proxParto);if(xpp>=0&&xpp<=100)dots.push({x:xpp,color:"#E24B4A",title:`Parto proyectado ${fmtLabel(proxParto)}`});
        }
        return {c,segs,dots,lastParto};
      });

      return <div>
        {/* ── SECCIÓN 2: HISTÓRICO ── */}
        <div className="card">
          <div className="card-h">
            <h3>📅 Histórico — Cerdas Activas</h3>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {[["1m",1],["6m",6],["12m",12],["18m",18],["24m",24],["Todo",36]].map(([l,v])=>
                <button key={v} className={`btn btn-sm ${timelineMeses===v?"btn-p":"btn-o"}`}
                  onClick={()=>{setTimelinesMeses(v);setTimelineOffset(0);}}>{l}</button>)}
              <button className="btn btn-sm btn-o" onClick={()=>setTimelineOffset(o=>o-1)}>«</button>
              <button className="btn btn-sm btn-o" onClick={()=>setTimelineOffset(0)}>Hoy</button>
              <button className="btn btn-sm btn-o" onClick={()=>setTimelineOffset(o=>o+1)}>»</button>
            </div>
          </div>
          <div className="card-b" style={{padding:"12px 16px"}}>
            {/* Leyenda */}
            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:12}}>
              {[["#9FE1CB","Gestación"],["#5DCAA5","Lactancia"],["#AFA9EC","Descanso"],["#FAC775","Proy. Gestación"],["#EF9F27","Proy. Lactancia"]].map(([c,l])=>
                <div key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:G.g500}}>
                  <div style={{width:12,height:10,borderRadius:2,background:c}}></div>{l}
                </div>)}
              {[["#378ADD","Parto"],["#639922","Monta"],["#E24B4A","Parto proy."],["#EF9F27","Monta proy."]].map(([c,l])=>
                <div key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:G.g500}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:c}}></div>{l}
                </div>)}
            </div>
            {/* Eje de fechas */}
            <div style={{display:"flex",marginBottom:6,paddingLeft:88,position:"relative",height:32}}>
              {monthLabels.map((ml,i)=>(
                <div key={i} style={{position:"absolute",left:`calc(88px + ${Math.max(ml.startPct,0)}%)`,width:`${ml.widthPct}%`,top:0,height:"100%",borderLeft:`1px solid ${G.beigeD}`}}>
                  <div style={{fontSize:10,fontWeight:600,color:G.g500,paddingLeft:3,whiteSpace:"nowrap"}}>{ml.m}</div>
                  <div style={{position:"relative",height:14}}>
                    {Array.from({length:ml.daysInMonth},(_,i)=>i+1).filter(d=>d===1||d%5===0||d===ml.daysInMonth).map(d=>{
                      const dayPct=((d-1)/ml.daysInMonth)*100;
                      return <span key={d} style={{position:"absolute",left:`${dayPct}%`,transform:"translateX(-50%)",fontSize:7,color:G.g300}}>{d}</span>;
                    })}
                  </div>
                </div>
              ))}
            </div>
            {/* Filas */}
            {histRows.map(({c,segs,dots})=>(
              <div key={c.id} style={{display:"flex",alignItems:"center",marginBottom:8}}>
                <div style={{width:88,flexShrink:0,fontSize:12,fontWeight:600,color:G.deep}}>{c.nombre}</div>
                <div style={{flex:1,position:"relative",height:24,background:G.beige,borderRadius:4}}>
                  {segs.map((s,i)=>(
                    <div key={i} title={s.title} style={{position:"absolute",left:`${s.l.toFixed(1)}%`,width:`${Math.max(s.w,0.3).toFixed(1)}%`,height:"100%",background:s.color,borderRadius:3,border:s.proj?"1px dashed rgba(0,0,0,.2)":"none",cursor:"help"}}></div>
                  ))}
                  {dots.map((d,i)=>(
                    <div key={i} title={d.title} style={{position:"absolute",left:`${d.x.toFixed(1)}%`,top:"50%",width:8,height:8,borderRadius:"50%",background:d.color,border:`1.5px solid #fff`,transform:"translate(-50%,-50%)",zIndex:8,cursor:"help"}}></div>
                  ))}
                  {todayPct>=0&&todayPct<=100&&<div style={{position:"absolute",left:`${todayPct.toFixed(1)}%`,top:0,bottom:0,width:2,background:G.red,zIndex:10,borderRadius:1}}>
                    <span style={{position:"absolute",bottom:-16,left:"50%",transform:"translateX(-50%)",fontSize:8,color:"#fff",fontWeight:800,background:G.red,padding:"1px 4px",borderRadius:6,whiteSpace:"nowrap"}}>hoy</span>
                  </div>}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* ── SECCIÓN 1: ESTADO ACTUAL ── */}
        <div className="card mb4">
          <div className="card-h"><h3>📍 Estado Actual — Todas las Cerdas</h3><span style={{fontSize:12,color:G.g500}}>{new Date().toLocaleDateString("es-PA",{day:"2-digit",month:"long",year:"numeric"})}</span></div>
          <div className="card-b" style={{padding:0}}>
            {estadoActual.map(({c,estado,color,bg,pct,detalle,barStart,barEnd,barColor,esProyectado})=>(
              <div key={c.id} title={detalle} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 16px",borderBottom:`1px solid ${G.beigeD}`,opacity:c.estado!=="Activa"?0.5:1}}>
                <div style={{width:80,flexShrink:0}}>
                  <div style={{fontWeight:700,fontSize:13,color:G.deep}}>{c.nombre}</div>
                  <div style={{fontSize:10,padding:"1px 6px",borderRadius:20,background:bg,color,display:"inline-block",marginTop:2,fontWeight:600}}>{estado}</div>
                </div>
                <div style={{flex:1,position:"relative"}}>
                  <div style={{height:20,background:G.beige,borderRadius:10,overflow:"hidden",position:"relative"}}>
                    <div style={{position:"absolute",left:0,width:`${Math.min(pct,100)}%`,height:"100%",background:barColor,borderRadius:10,border:esProyectado?"2px dashed rgba(0,0,0,.15)":"none",transition:"width .3s"}}></div>
                  </div>
                  <div style={{fontSize:10,color:G.g500,marginTop:3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{detalle}</div>
                </div>
                <div style={{width:60,textAlign:"right",fontSize:11,color:G.g500,flexShrink:0}}>
                  {Math.round(pct)}%
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>;
    })()}

    {/* ── INVENTARIO ── */}
    {tab==="cerdas"&&<div key={`inv-${montas.length}-${partos.length}-${montas.map(m=>m.id).join("")}`}>
      <div className="card mb4">
        <div className="card-h"><h3>🐷 Cerdas Madres Activas</h3><span className="badge bg">{cerdas.filter(c=>c.tipo==="Madre"&&c.estado==="Activa").length}</span></div>
        <div className="tw"><table>
          <thead><tr><th>Código</th><th>Nombre</th><th>Estado</th><th>Producción</th><th className="hide-mobile">Nacimiento</th><th className="hide-mobile">Edad</th><th className="hide-mobile">Peso</th><th>Partos</th><th className="hide-mobile">Notas</th>{PERMS.eliminar(role)&&<th></th>}</tr></thead>
          <tbody key={montas.length+"-"+partos.length}>{cerdas.filter(c=>c.tipo==="Madre"&&c.estado==="Activa").map(c=><tr key={c.id}>
            <td style={{fontFamily:"monospace",fontSize:12}}>{c.codigo}</td>
            <td style={{fontWeight:700}}>{c.nombre}</td>
            <td><span className={`badge ${estadoBadge(c.estado)}`}>{c.estado}</span></td>
            <td>{(()=>{const ep=estadoProduccion(c);return <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:ep.bg,color:ep.color,fontWeight:600,whiteSpace:"nowrap"}}>{ep.label}</span>;})()}</td>
            <td className="hide-mobile" style={{fontSize:12}}>{c.fecha_nacimiento||"-"}</td>
            <td className="hide-mobile" style={{fontSize:12,fontWeight:600,color:G.deep}}>{calcEdad(c.fecha_nacimiento)}</td>
            <td className="hide-mobile">{c.peso_kg?`${c.peso_kg}kg`:"-"}</td>
            <td style={{fontWeight:600,color:G.deep}}>{partos.filter(p=>p.cerda_id===c.id).length}</td>
            <td className="hide-mobile" style={{fontSize:12,color:G.g500}}>{c.notas||"-"}</td>
            {PERMS.editarCerdas(role)&&<td><button className="btn btn-sm btn-o" onClick={()=>openEdit("cerda",c)}>✏</button></td>}
          </tr>)}</tbody>
        </table></div>
      </div>
      {cerdas.filter(c=>c.tipo==="Madre"&&c.estado!=="Activa").length>0&&<div className="card mb4">
        <div className="card-h"><h3>📋 Historial Madres</h3><span className="badge bk">{cerdas.filter(c=>c.tipo==="Madre"&&c.estado!=="Activa").length}</span></div>
        <div className="tw"><table>
          <thead><tr><th>Código</th><th>Nombre</th><th>Estado</th><th>Partos</th><th>Notas</th>{PERMS.eliminar(role)&&<th></th>}</tr></thead>
          <tbody>{cerdas.filter(c=>c.tipo==="Madre"&&c.estado!=="Activa").map(c=><tr key={c.id}>
            <td style={{fontFamily:"monospace",fontSize:12}}>{c.codigo}</td>
            <td style={{fontWeight:600,color:G.g500}}>{c.nombre}</td>
            <td><span className={`badge ${estadoBadge(c.estado)}`}>{c.estado}</span></td>
            <td>{partos.filter(p=>p.cerda_id===c.id).length}</td>
            <td style={{fontSize:12,color:G.g500}}>{c.notas||"-"}</td>
            {PERMS.editarCerdas(role)&&<td><button className="btn btn-sm btn-o" onClick={()=>openEdit("cerda",c)}>✏</button></td>}
          </tr>)}</tbody>
        </table></div>
      </div>}
      <div className="card">
        <div className="card-h"><h3>🐗 Verracos</h3></div>
        <div className="tw"><table>
          <thead><tr><th>Código</th><th>Nombre</th><th>Estado</th><th>Peso</th><th>Notas</th>{PERMS.eliminar(role)&&<th></th>}</tr></thead>
          <tbody>{cerdas.filter(c=>c.tipo==="Verraco").map(c=><tr key={c.id}>
            <td style={{fontFamily:"monospace",fontSize:12}}>{c.codigo}</td>
            <td style={{fontWeight:700}}>{c.nombre}</td>
            <td><span className={`badge ${estadoBadge(c.estado)}`}>{c.estado}</span></td>
            <td>{c.peso_kg?`${c.peso_kg}kg`:"-"}</td>
            <td style={{fontSize:12,color:G.g500}}>{c.notas||"-"}</td>
            {PERMS.editarCerdas(role)&&<td><button className="btn btn-sm btn-o" onClick={()=>openEdit("cerda",c)}>✏</button></td>}
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
            {PERMS.registrarMontas(role)&&<button className="btn btn-sm btn-p" onClick={()=>{
              const cerda=cerdas.find(c=>c.nombre===nombre);
              openNew("monta",{cerda_id:cerda?.id||"",fecha_monta:toISO(TODAY)});
            }}>+ Monta</button>}
          </div>
        </div>
        <div className="tw"><table className="montas-table">
          <thead><tr><th className="fecha-col">Fecha Monta</th><th className="fecha-col">Parto Est. (114d)</th><th className="fecha-col">Parto Real</th><th>Días restantes</th><th>Confirmado</th><th className="hide-mobile">Notas</th>{PERMS.eliminar(role)&&<th></th>}</tr></thead>
          <tbody>{mts.map(m=>{
            const fp=m.fecha_monta?toISO(addD(m.fecha_monta,GEST)):"";
            const partoReal=partos.find(p=>p.cerda_id===m.cerda_id&&Math.abs(diffD(fp,p.fecha_parto))<=30);
            const dias=fp?diffD(TODAY,fp):null;
            return <tr key={m.id}>
              <td className="fecha-col" style={{fontWeight:600}}>{fmtDisp(m.fecha_monta)}</td>
              <td className="fecha-col" style={{color:G.gold,fontWeight:600}}>{fp?fmtDisp(fp):"-"}</td>
              <td className="fecha-col" style={{fontWeight:600,color:partoReal?G.deep:G.g300}}>{partoReal?fmtDisp(partoReal.fecha_parto):"-"}</td>
              <td>{dias!==null?<span style={{fontWeight:700,color:dias<0?G.g500:dias<14?G.red:dias<30?G.gold:G.deep}}>{dias<0?partoReal?"✓ Parto":"No preñada":dias+"d"}</span>:"-"}</td>
              <td><span className={`badge ${m.confirmado?"bg":"bo"}`}>{m.confirmado?"✓ Conf":"Pend."}</span></td>
              <td className="hide-mobile" style={{fontSize:12,color:G.g500}}>{m.notas||"-"}</td>
              {PERMS.eliminar(role)&&<td style={{display:"flex",gap:4}}>
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
              {PERMS.registrarPartos(role)&&<button className="btn btn-sm btn-p" onClick={()=>openNew("parto",{cerda_id:cerda?.id||"",fecha_parto:toISO(TODAY)})}>+ Parto</button>}
            </div>
          </div>
          <div className="tw"><table>
            <thead><tr><th className="fecha-col">Fecha Parto</th><th>Vivos</th><th>Muertos</th><th>Total</th><th className="hide-mobile">Notas</th>{PERMS.eliminar(role)&&<th></th>}</tr></thead>
            <tbody>{pts.map(p=><tr key={p.id}>
              <td className="fecha-col" style={{fontWeight:600}}>{fmtDisp(p.fecha_parto)}</td>
              <td style={{fontWeight:700,color:G.deep}}>{p.lechones_vivos}</td>
              <td style={{color:p.lechones_muertos>0?G.red:G.g500}}>{p.lechones_muertos}</td>
              <td style={{fontWeight:700}}>{p.lechones_vivos+p.lechones_muertos}</td>
              <td className="hide-mobile" style={{fontSize:12,color:G.g500}}>{p.notas||"-"}</td>
              {PERMS.eliminar(role)&&<td style={{display:"flex",gap:4}}>
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
          {pts.map(p=>{
            const proto=protocolo.filter(x=>x.parto_id===p.id);
            if(!proto.length)return null;
            const pendientes=proto.filter(x=>x.estado==="pendiente").length;
            const vencidos=proto.filter(x=>x.estado==="vencido").length;
            const completados=proto.filter(x=>x.estado==="completado").length;
            return <div key={p.id} style={{padding:"14px 20px",borderTop:`1px solid ${G.beigeD}`}}>
              <div className="fb" style={{marginBottom:12}}>
                <span style={{fontWeight:700,fontSize:13,color:G.g700}}>🩺 Protocolo Sanitario — Parto {fmtDisp(p.fecha_parto)}</span>
                <div className="fl gap2">
                  {completados>0&&<span className="badge bg">{completados} completados</span>}
                  {pendientes>0&&<span className="badge bo">{pendientes} pendientes</span>}
                  {vencidos>0&&<span className="badge br">{vencidos} vencidos</span>}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:8}}>
                {proto.map(pr=>{
                  const esCompletado=pr.estado==="completado";
                  const esVencido=pr.estado==="vencido";
                  const bg=esCompletado?"#E1F5EE":esVencido?"#FEE2E2":"#FFF9EC";
                  const border=esCompletado?"#0F6E56":esVencido?G.red:G.gold;
                  const icon=esCompletado?"✅":esVencido?"⚠️":"⏳";
                  return <div key={pr.id} style={{padding:"10px 12px",background:bg,borderRadius:8,borderLeft:`3px solid ${border}`}}>
                    <div style={{fontSize:12,fontWeight:700,color:G.g700,marginBottom:4}}>{icon} {pr.procedimiento}</div>
                    <div style={{fontSize:11,color:G.g500}}>Estimado: {fmtDisp(pr.fecha_estimada)}</div>
                    {pr.fecha_real&&<div style={{fontSize:11,color:"#0F6E56",fontWeight:600}}>Real: {fmtDisp(pr.fecha_real)}</div>}
                    {PERMS.completarActCerdos(role)&&!esCompletado&&<button className="btn btn-sm" style={{marginTop:6,fontSize:10,padding:"2px 8px",background:G.deep,color:"#fff",border:"none"}}
                      onClick={async()=>{
                        const fechaReal=prompt(`Fecha real de ${pr.procedimiento} (YYYY-MM-DD):`,toISO(TODAY));
                        if(fechaReal){await supabase.from("protocolo_partos").update({fecha_real:fechaReal,estado:"completado"}).eq("id",pr.id);fetchPorcino(false);}
                      }}>Marcar ✓</button>}
                  </div>;
                })}
              </div>
            </div>;
          })}
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
              {PERMS.registrarVacunas(role)&&<button className="btn btn-sm btn-p" onClick={()=>openNew("vacuna",{cerda_id:cerda?.id||"",fecha:toISO(TODAY)})}>+ Vacuna</button>}
            </div>
          </div>
          <div className="tw"><table>
            <thead><tr><th>Vacuna</th><th className="fecha-col">Fecha</th><th className="fecha-col">Próxima Dosis</th><th>Días</th><th className="hide-mobile">Veterinario</th>{PERMS.eliminar(role)&&<th></th>}</tr></thead>
            <tbody>{vacs.map(v=>{
              const dias=v.proxima_dosis?diffD(TODAY,v.proxima_dosis):null;
              return <tr key={v.id}>
                <td><span className="badge bb">{v.vacuna}</span></td>
                <td className="fecha-col">{fmtDisp(v.fecha)}</td>
                <td className="fecha-col" style={{color:dias!==null&&dias<7?G.red:G.g700,fontWeight:dias!==null&&dias<7?700:400}}>{fmtDisp(v.proxima_dosis)}</td>
                <td>{dias!==null?<span style={{fontWeight:700,color:dias<0?G.g500:dias<7?G.red:dias<30?G.gold:G.deep}}>{dias<0?"Vencida":dias+"d"}</span>:"-"}</td>
                <td className="hide-mobile" style={{fontSize:12}}>{v.veterinario||"-"}</td>
                {PERMS.eliminar(role)&&<td style={{display:"flex",gap:4}}>
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
          const vendidos=ventas.filter(v=>v.tipo!=="transferencia"&&(v.estatus!=="Abono")).reduce((s,v)=>s+v.cantidad,0);
          return {nombre:c.nombre,nacidos:totalNacidos,partos:cPartos.length};
        }).filter(c=>c.nacidos>0);
        const totalNacidos=partos.reduce((s,p)=>s+p.lechones_vivos,0);
        const totalVendidos=ventas.filter(v=>v.tipo==="venta"||((!v.tipo||v.tipo==="Lechon")&&v.tipo!=="transferencia"&&v.estatus!=="Abono")).reduce((s,v)=>s+v.cantidad,0);
        const totalTransferidos=ventas.filter(v=>v.tipo==="transferencia").reduce((s,v)=>s+v.cantidad,0);
        const disponibles=totalNacidos-totalVendidos-totalTransferidos;
        return <div className="card mb4">
          <div className="card-h"><h3>🐷 Lechones — Resumen</h3></div>
          <div className="card-b">
          <div className="ventas-stats-grid">
              <div style={{textAlign:"center",padding:"10px 12px",background:G.pale,borderRadius:8}}>
                <div style={{fontSize:10,color:G.g500,textTransform:"uppercase",marginBottom:3,letterSpacing:".4px"}}>Total Nacidos</div>
                <div style={{fontSize:22,fontWeight:700,color:G.deep}}>{totalNacidos}</div>
              </div>
              <div style={{textAlign:"center",padding:"10px 12px",background:G.goldL,borderRadius:8}}>
                <div style={{fontSize:10,color:G.g500,textTransform:"uppercase",marginBottom:3,letterSpacing:".4px"}}>Vendidos</div>
                <div style={{fontSize:22,fontWeight:700,color:G.gold}}>{totalVendidos}</div>
              </div>
              <div style={{textAlign:"center",padding:"10px 12px",background:"#EEF2FF",borderRadius:8}}>
                <div style={{fontSize:10,color:G.g500,textTransform:"uppercase",marginBottom:3,letterSpacing:".4px"}}>Transferidos</div>
                <div style={{fontSize:22,fontWeight:700,color:"#4F46E5"}}>{totalTransferidos}</div>
              </div>
              <div style={{textAlign:"center",padding:"10px 12px",background:disponibles>0?"#E1F5EE":G.g100,borderRadius:8}}>
                <div style={{fontSize:10,color:G.g500,textTransform:"uppercase",marginBottom:3,letterSpacing:".4px"}}>Disponibles</div>
                <div style={{fontSize:22,fontWeight:700,color:disponibles>0?"#0F6E56":G.g500}}>{disponibles}</div>
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
        {PERMS.verMontos(role)&&<div className="sc grn"><span className="si">💰</span><span className="sl">Total Ingresos</span><span className="sv">{fmt$(totalVentas)}</span></div>}
        <div className="sc"><span className="si">🐷</span><span className="sl">Venta Lechones</span>
          {PERMS.verMontos(role)&&<span className="sv">{fmt$(ventas.filter(v=>!v.tipo||v.tipo==="Lechon").reduce((s,v)=>s+Number(v.total),0))}</span>}
          <span className="str">{ventas.filter(v=>v.tipo!=="transferencia"&&v.estatus!=="Abono").reduce((s,v)=>s+v.cantidad,0)} vendidos</span>
        </div>
        {PERMS.verMontos(role)&&<div className="sc"><span className="si">🐄</span><span className="sl">Venta Cerdas</span><span className="sv">{fmt$(ventas.filter(v=>v.tipo==="Cerda").reduce((s,v)=>s+Number(v.total),0))}</span></div>}
        {PERMS.verMontos(role)&&<div className="sc"><span className="si">🐗</span><span className="sl">Ingresos Monta</span><span className="sv">{fmt$(ventas.filter(v=>v.tipo==="Monta").reduce((s,v)=>s+Number(v.total),0))}</span></div>}
      </div>
        <div className="card">
        <div className="card-h"><h3>🤝 Ventas de Lechones</h3></div>
        <div className="tw"><table>
          <thead><tr><th className="fecha-col">Fecha</th><th>Tipo</th><th>Estatus</th><th>Cant.</th>{PERMS.verMontos(role)&&<th>Total</th>}<th className="hide-mobile">Comprador</th><th className="hide-mobile">Pago</th><th className="hide-mobile">Notas</th>{PERMS.eliminar(role)&&<th></th>}</tr></thead>
          <tbody>{ventas.map(v=><tr key={v.id}>
            <td className="fecha-col">{fmtDisp(v.fecha)}</td>
            <td><span className={`badge ${v.tipo==="Cerda"?"br":v.tipo==="Monta"?"bb":v.tipo==="transferencia"?"bo":"bg"}`}>{v.tipo==="transferencia"?"Transfer":v.tipo||"Lechon"}</span></td>
            <td><span className={`badge ${v.estatus==="Abono"?"bo":v.estatus==="Cancelacion"?"bg":"bk"}`}>{v.estatus||"Venta"}</span></td>
            <td style={{fontWeight:700,color:v.estatus==="Abono"?G.g500:G.deep}}>{v.estatus==="Abono"?"-":v.cantidad}</td>
            {PERMS.verMontos(role)&&<td style={{fontWeight:700,color:G.deep}}>{fmt$(v.total)}</td>}
            <td className="hide-mobile">{v.comprador||"-"}</td><td className="hide-mobile"><span className="badge bk">{v.forma_pago||"-"}</span></td>
            <td className="hide-mobile" style={{fontSize:12,color:G.g500}}>{v.notas||"-"}</td>
            {PERMS.eliminar(role)&&<td style={{display:"flex",gap:4}}>
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


// ─── GESTIÓN DE USUARIOS (solo admin) ────────────────────────────────────────
function UsuariosPage({toast,userId,userName}){
  const [perfiles,setPerfiles]=useState([]);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [editNombre,setEditNombre]=useState(null); // id del perfil editando nombre
  const [tmpNombre,setTmpNombre]=useState("");

  const fetch=async()=>{
    setLoading(true);
    try{
      const{data}=await supabase.from("perfiles").select("*").order("nombre");
      setPerfiles(data||[]);
    }catch(e){
      console.warn("Usuarios fetch error:",e.message);
    }finally{
      setLoading(false);
    }
  };
  useEffect(()=>{fetch();},[]);

  const saveRol=async(id,nuevoRol,nombrePerfil)=>{
    const prev=perfiles.find(p=>p.id===id);
    const{error}=await supabase.from("perfiles").update({rol:nuevoRol}).eq("id",id);
    if(error){toast(error.message,"error");return;}
    await logAudit({userId,userName,accion:"cambio_rol",tabla:"perfiles",registroId:id,datosPrev:{rol:prev?.rol},datosNuevos:{rol:nuevoRol}});
    toast(`Rol de ${nombrePerfil} actualizado a ${ROLES_LABEL[nuevoRol]} ✓`);
    fetch();
  };

  const saveNombre=async(id)=>{
    if(!tmpNombre.trim()){toast("El nombre no puede estar vacío","error");return;}
    setSaving(true);
    const{error,data}=await supabase.from("perfiles").update({nombre:tmpNombre.trim()}).eq("id",id).select();
    setSaving(false);
    if(error){toast(`Error: ${error.message}`,"error");return;}
    toast("Nombre actualizado ✓");
    setEditNombre(null);
    // Actualizar localmente sin esperar fetch
    setPerfiles(prev=>prev.map(p=>p.id===id?{...p,nombre:tmpNombre.trim()}:p));
  };

  const rolBadgeStyle=(r)=>({fontSize:11,padding:"2px 9px",borderRadius:20,fontWeight:700,background:r==="admin"?G.pale:r==="socio"?"#E1F5EE":r==="supervisor"?"#EEEDFE":G.goldL,color:ROLES_COLOR[r]||G.g500});

  return <div>
    <div className="sg mb4">
      <div className="sc grn"><span className="si">👥</span><span className="sl">Total Usuarios</span><span className="sv">{perfiles.length}</span></div>
      {Object.entries(ROLES_LABEL).map(([r,l])=><div key={r} className="sc"><span className="si">🔑</span><span className="sl">{l}</span><span className="sv" style={{color:ROLES_COLOR[r]}}>{perfiles.filter(p=>p.rol===r).length}</span></div>)}
    </div>

    <div className="card mb4">
      <div className="card-h">
        <h3>👥 Usuarios del Sistema</h3>
        <div style={{fontSize:12,color:G.g500}}>Usuarios se crean desde Supabase → Authentication → Invite User</div>
      </div>
      {loading?<div className="card-b" style={{textAlign:"center",padding:30,color:G.g500}}>Cargando...</div>:
      <div className="tw"><table>
        <thead><tr><th>Nombre</th><th>Rol Actual</th><th>Cambiar Rol</th><th>ID</th></tr></thead>
        <tbody>{perfiles.map(p=><tr key={p.id}>
          <td>
            {editNombre===p.id
              ?<div className="fl gap2" style={{alignItems:"center"}}>
                  <input autoFocus value={tmpNombre} onChange={e=>setTmpNombre(e.target.value)}
                    onKeyDown={e=>{if(e.key==="Enter")saveNombre(p.id);if(e.key==="Escape")setEditNombre(null);}}
                    style={{padding:"4px 8px",border:`1.5px solid ${G.mid}`,borderRadius:6,fontSize:13,width:140,fontFamily:"'DM Sans',sans-serif"}}/>
                  <button className="btn btn-p btn-sm" disabled={saving} onClick={()=>saveNombre(p.id)}>✓</button>
                  <button className="btn btn-o btn-sm" onClick={()=>setEditNombre(null)}>✕</button>
                </div>
              :<div className="fl gap2" style={{alignItems:"center"}}>
                  <span style={{fontWeight:600}}>{p.nombre||"Sin nombre"}</span>
                  <button className="btn btn-o btn-sm" style={{fontSize:10,padding:"2px 6px"}}
                    onClick={()=>{setEditNombre(p.id);setTmpNombre(p.nombre||"");}}>✏</button>
                </div>
            }
          </td>
          <td><span style={rolBadgeStyle(p.rol)}>{ROLES_LABEL[p.rol]||p.rol}</span></td>
          <td>
            <select value={p.rol||""} onChange={e=>saveRol(p.id,e.target.value,p.nombre)}
              style={{padding:"4px 8px",border:`1.5px solid ${G.g300}`,borderRadius:6,fontSize:12,fontFamily:"'DM Sans',sans-serif"}}>
              {Object.entries(ROLES_LABEL).map(([r,l])=><option key={r} value={r}>{l}</option>)}
            </select>
          </td>
          <td style={{fontSize:11,color:G.g500,fontFamily:"monospace"}}>{p.id?.substring(0,16)}...</td>
        </tr>)}</tbody>
      </table></div>}
    </div>

    <div className="card">
      <div className="card-h"><h3>📋 Permisos por Rol</h3></div>
      <div className="card-b">
        <div className="tw"><table style={{fontSize:12}}>
          <thead><tr><th>Permiso</th><th style={{textAlign:"center"}}>Admin</th><th style={{textAlign:"center"}}>Socio</th><th style={{textAlign:"center"}}>Supervisor</th><th style={{textAlign:"center"}}>Operativo</th></tr></thead>
          <tbody>
            {[
              ["Ver Dashboard / Finanzas / Reportes","✅","✅","❌","❌"],
              ["Ver montos y totales ($)","✅","✅","❌","❌"],
              ["Registrar gastos","✅","✅","✅","❌"],
              ["Registrar ingresos / Deudas","✅","✅","❌","❌"],
              ["Ver módulo Porcino y Ñame","✅","✅","✅","✅"],
              ["Registrar montas / partos / vacunas","✅","✅","✅","❌"],
              ["Completar actividades","✅","✅","✅","✅"],
              ["Editar / eliminar registros","✅","✅","❌","❌"],
              ["Gestión de usuarios","✅","❌","❌","❌"],
              ["Ver auditoría","✅","✅","❌","❌"],
            ].map(([perm,...vals])=><tr key={perm}>
              <td style={{fontWeight:500}}>{perm}</td>
              {vals.map((v,i)=><td key={i} style={{textAlign:"center",fontSize:14}}>{v}</td>)}
            </tr>)}
          </tbody>
        </table></div>
      </div>
    </div>
  </div>;
}

// ─── AUDITORÍA (admin + socio) ────────────────────────────────────────────────
function AuditoriaPage({toast}){
  const [logs,setLogs]=useState([]);
  const [loading,setLoading]=useState(true);
  const [filtro,setFiltro]=useState("todos");

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      try{
        const{data}=await supabase.from("auditoria").select("*").order("created_at",{ascending:false}).limit(200);
        setLogs(data||[]);
      }catch(e){
        console.warn("Auditoria fetch error:",e.message);
      }finally{
        setLoading(false);
      }
    })();
  },[]);

  const ACCION_LABEL={
    insertar:"➕ Registro",cambio_rol:"🔑 Cambio rol",actualizar:"✏️ Edición",
    completar_actividad:"✓ Actividad",registrar_gasto:"💸 Gasto",eliminar:"🗑️ Eliminación"
  };
  const fmtDT=d=>d?new Date(d).toLocaleString("es-PA",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}):"-";
  const tablas=[...new Set(logs.map(l=>l.tabla))];
  const filtrados=filtro==="todos"?logs:logs.filter(l=>l.tabla===filtro);

  return <div>
    <div className="card mb4">
      <div className="card-h">
        <h3>📋 Registro de Auditoría</h3>
        <div className="fl gap2">
          <select value={filtro} onChange={e=>setFiltro(e.target.value)}
            style={{padding:"5px 10px",border:`1.5px solid ${G.g300}`,borderRadius:6,fontSize:12}}>
            <option value="todos">Todas las tablas</option>
            {tablas.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <span style={{fontSize:12,color:G.g500}}>{filtrados.length} registros</span>
        </div>
      </div>
      {loading?<div className="card-b" style={{textAlign:"center",padding:30,color:G.g500}}>Cargando...</div>:
      <div className="tw"><table style={{fontSize:12}}>
        <thead><tr><th>Fecha</th><th>Usuario</th><th>Acción</th><th>Tabla</th><th>Detalle</th></tr></thead>
        <tbody>{filtrados.length===0?<tr><td colSpan={5} style={{textAlign:"center",padding:20,color:G.g500}}>Sin registros</td></tr>:
          filtrados.map((l,i)=><tr key={i}>
            <td className="fecha-col">{fmtDT(l.created_at)}</td>
            <td style={{fontWeight:600}}>{l.user_nombre||"Sistema"}</td>
            <td><span className="badge bo">{ACCION_LABEL[l.accion]||l.accion}</span></td>
            <td style={{fontFamily:"monospace",fontSize:11}}>{l.tabla}</td>
            <td style={{fontSize:11,color:G.g500,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
              {l.datos_nuevos?JSON.stringify(JSON.parse(l.datos_nuevos)).substring(0,80):"—"}
            </td>
          </tr>)}
        </tbody>
      </table></div>}
    </div>
  </div>;
}

// ─── ALERTAS PANEL (mini, para Dashboard) ─────────────────────────────────────
function AlertasPanel({alertas,onVerTodas}){
  const criticas=alertas.filter(a=>a.tipo==="critica");
  const advertencias=alertas.filter(a=>a.tipo==="advertencia");
  const infos=alertas.filter(a=>a.tipo==="info");
  if(alertas.length===0)return(
    <div className="card mb4">
      <div className="card-h"><h3>🔔 Alertas del Sistema</h3></div>
      <div className="card-b" style={{textAlign:"center",padding:"24px 0",color:G.g500}}>
        <div style={{fontSize:32,marginBottom:8}}>✅</div>
        <div style={{fontWeight:600,color:"#0F6E56"}}>Todo en orden</div>
        <div style={{fontSize:12,marginTop:4}}>Sin alertas pendientes</div>
      </div>
    </div>
  );
  const mostrar=alertas.slice(0,4);
  return(
    <div className="card mb4">
      <div className="card-h">
        <h3>🔔 Alertas del Sistema</h3>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {criticas.length>0&&<span className="badge br">🔴 {criticas.length} crítica{criticas.length>1?"s":""}</span>}
          {advertencias.length>0&&<span className="badge bo">⚠ {advertencias.length}</span>}
          {infos.length>0&&<span className="badge bb">{infos.length} info</span>}
          <button className="btn btn-o btn-sm" onClick={onVerTodas}>Ver todas →</button>
        </div>
      </div>
      <div className="card-b" style={{paddingTop:12}}>
        {mostrar.map(a=>(
          <div key={a.id} className={`alerta-item ${a.tipo}`}>
            <span className="alerta-icon">{a.icono}</span>
            <div className="alerta-body">
              <div className="alerta-titulo">{a.titulo}</div>
              <div className="alerta-sub">{a.sub}</div>
            </div>
          </div>
        ))}
        {alertas.length>4&&<div style={{textAlign:"center",paddingTop:8}}>
          <button className="btn btn-o btn-sm" onClick={onVerTodas}>Ver {alertas.length-4} más →</button>
        </div>}
      </div>
    </div>
  );
}

// ─── ALERTAS PAGE (completa) ──────────────────────────────────────────────────
function AlertasPage({alertas,onNavegar}){
  const [filtro,setFiltro]=useState("todas");
  const criticas=alertas.filter(a=>a.tipo==="critica");
  const advertencias=alertas.filter(a=>a.tipo==="advertencia");
  const infos=alertas.filter(a=>a.tipo==="info");
  const filtradas=filtro==="todas"?alertas:alertas.filter(a=>a.tipo===filtro);

  const tipoLabel={critica:"Crítica",advertencia:"Advertencia",info:"Informativa"};
  const tipoColor={critica:G.red,advertencia:G.gold,info:"#4F46E5"};

  return(
    <div>
      {/* Resumen cards */}
      <div className="sg mb4">
        <div className="sc" style={{cursor:"pointer",border:filtro==="critica"?`2px solid ${G.red}`:`1px solid ${G.beigeD}`}} onClick={()=>setFiltro(f=>f==="critica"?"todas":"critica")}>
          <span className="si">🔴</span>
          <span className="sl">Críticas</span>
          <span className="sv" style={{color:criticas.length>0?G.red:G.g500}}>{criticas.length}</span>
          <span className="str" style={{color:G.g500}}>Acción inmediata</span>
        </div>
        <div className="sc" style={{cursor:"pointer",border:filtro==="advertencia"?`2px solid ${G.gold}`:`1px solid ${G.beigeD}`}} onClick={()=>setFiltro(f=>f==="advertencia"?"todas":"advertencia")}>
          <span className="si">⚠️</span>
          <span className="sl">Advertencias</span>
          <span className="sv" style={{color:advertencias.length>0?G.gold:G.g500}}>{advertencias.length}</span>
          <span className="str" style={{color:G.g500}}>Revisar pronto</span>
        </div>
        <div className="sc" style={{cursor:"pointer",border:filtro==="info"?`2px solid #4F46E5`:`1px solid ${G.beigeD}`}} onClick={()=>setFiltro(f=>f==="info"?"todas":"info")}>
          <span className="si">ℹ️</span>
          <span className="sl">Informativas</span>
          <span className="sv" style={{color:"#4F46E5"}}>{infos.length}</span>
          <span className="str" style={{color:G.g500}}>Sin urgencia</span>
        </div>
        <div className="sc grn">
          <span className="si">🔔</span>
          <span className="sl">Total Alertas</span>
          <span className="sv">{alertas.length}</span>
          <span className="str">{alertas.length===0?"Todo en orden":"Pendientes"}</span>
        </div>
      </div>

      {/* Lista filtrada */}
      {alertas.length===0?(
        <div className="card">
          <div className="card-b" style={{textAlign:"center",padding:"48px 0"}}>
            <div style={{fontSize:48,marginBottom:12}}>✅</div>
            <div style={{fontSize:18,fontWeight:700,color:"#0F6E56",marginBottom:6}}>¡Todo en orden!</div>
            <div style={{color:G.g500,fontSize:13}}>No hay alertas activas en este momento</div>
          </div>
        </div>
      ):(
        <div className="card">
          <div className="card-h">
            <h3>📋 {filtro==="todas"?"Todas las alertas":`Alertas ${tipoLabel[filtro]}s`}</h3>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {["todas","critica","advertencia","info"].map(f=>(
                <button key={f} className={`btn btn-sm ${filtro===f?"btn-p":"btn-o"}`} onClick={()=>setFiltro(f)}>
                  {f==="todas"?"Todas":f==="critica"?"🔴 Críticas":f==="advertencia"?"⚠ Advertencias":"ℹ Info"}
                </button>
              ))}
            </div>
          </div>
          <div className="card-b" style={{paddingTop:12}}>
            {filtradas.length===0?(
              <div style={{textAlign:"center",padding:"24px 0",color:G.g500}}>Sin alertas de este tipo</div>
            ):filtradas.map(a=>(
              <div key={a.id} className={`alerta-item ${a.tipo}`} style={{cursor:a.modulo?"pointer":"default"}} onClick={()=>a.modulo&&onNavegar&&onNavegar(a.modulo)}>
                <span className="alerta-icon">{a.icono}</span>
                <div className="alerta-body">
                  <div className="alerta-titulo">{a.titulo}</div>
                  <div className="alerta-sub">{a.sub}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                  <span style={{fontSize:10,padding:"2px 7px",borderRadius:20,fontWeight:700,background:a.tipo==="critica"?G.redL:a.tipo==="advertencia"?G.goldL:"#EEF2FF",color:tipoColor[a.tipo]}}>{tipoLabel[a.tipo]}</span>
                  {a.modulo&&<span style={{fontSize:10,color:G.g500}}>→ Ver módulo</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
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
  // ── datos porcinos para alertas ──
  const [cerdas,setCerdas]=useState([]);
  const [partos,setPartos]=useState([]);
  const [montas,setMontas]=useState([]);
  const [vacunas,setVacunas]=useState([]);
  const [ventas,setVentas]=useState([]);
  // ── datos ñame para alertas ──
  const [siembras,setSiembras]=useState([]);
  const [actividadesName,setActividadesName]=useState([]);
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
    try{
      const timeout=new Promise((_,rej)=>setTimeout(()=>rej(new Error("Timeout")),15000));
      const queries=Promise.all([
        supabase.from("gastos").select("*").order("fecha",{ascending:false}),
        supabase.from("ingresos").select("*").order("fecha",{ascending:false}),
        supabase.from("deudas").select("*").order("created_at",{ascending:false}),
        supabase.from("inventario").select("*").order("categoria"),
        supabase.from("cerdas").select("*"),
        supabase.from("partos").select("*").order("fecha_parto",{ascending:false}),
        supabase.from("celos_montas").select("*").order("fecha_monta",{ascending:false}),
        supabase.from("vacunas_cerdas").select("*").order("fecha",{ascending:false}),
        supabase.from("ventas_lechones").select("*").order("fecha",{ascending:false}),
        supabase.from("siembras").select("*").order("fecha_siembra",{ascending:false}),
        supabase.from("actividades_name").select("*").order("fecha_estimada",{ascending:true}),
      ]);
      const [g,i,d,inv,c,p,m,v,vt,s,an]=await Promise.race([queries,timeout]);
      setGastos(g.data||[]);setIngresos(i.data||[]);setDeudas(d.data||[]);setInventario(inv.data||[]);
      setCerdas(c.data||[]);setPartos(p.data||[]);setMontas(m.data||[]);setVacunas(v.data||[]);setVentas(vt.data||[]);
      setSiembras(s.data||[]);setActividadesName(an.data||[]);
    }catch(e){
      console.warn("fetchAll error:",e.message);
    }finally{
      setLoading(false);
    }
  },[user?.id]);

  useEffect(()=>{fetchAll();},[fetchAll]);

  const logout=async()=>{await supabase.auth.signOut();setUser(null);};

  const role=user?.perfil?.rol||"encargado";
  const nombre=user?.perfil?.nombre||user?.email||"Usuario";
  const initials=nombre.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();

  const navAll=[
    {id:"dashboard",label:"Dashboard",icon:"◼",group:"Principal"},
    {id:"alertas",label:"Alertas",icon:"🔔",group:"Principal"},
    {id:"cerdos_m",label:"Producción Porcina",icon:"🐷",group:"Producción"},
    {id:"name_m",label:"Producción de Ñame",icon:"🌿",group:"Producción"},
    {id:"finanzas",label:"Finanzas",icon:"💰",group:"Gestión"},
    {id:"deudas",label:"Deudas",icon:"📋",group:"Gestión"},
    {id:"inventario",label:"Inventario",icon:"📦",group:"Gestión"},
    {id:"reportes",label:"Reportes",icon:"📊",group:"Análisis"},
    {id:"usuarios",label:"Usuarios",icon:"👥",group:"Administración"},
    {id:"auditoria",label:"Auditoría",icon:"📋",group:"Administración"},
  ];
  const navPermMap={
    dashboard:PERMS.verDashboard,alertas:()=>true,
    cerdos_m:PERMS.verCerdos,name_m:PERMS.verName,
    finanzas:PERMS.verFinanzas,deudas:PERMS.verDeudas,
    inventario:PERMS.verInventario,reportes:PERMS.verReportes,
    usuarios:PERMS.verUsuarios,auditoria:PERMS.verAuditoria,
  };
  const nav=navAll.filter(n=>!navPermMap[n.id]||navPermMap[n.id](role));
  const groups=[...new Set(nav.map(n=>n.group))];
  const titles={dashboard:"Dashboard General",alertas:"Alertas del Sistema",cerdos_m:"Producción Porcina",name_m:"Producción de Ñame",finanzas:"Finanzas",deudas:"Deudas & Cuentas",inventario:"Inventario",reportes:"Reportes & Análisis",usuarios:"Gestión de Usuarios",auditoria:"Auditoría del Sistema"};

  // Redirigir si el rol no tiene acceso a la página actual
  useEffect(()=>{
    if(!navPermMap)return;
    const perm=navPermMap[page];
    if(perm&&!perm(role)){
      setPage(PERMS.verCerdos(role)?"cerdos_m":"alertas");
    }
  },[role,page]);

  const alertas=calcAlertas({cerdas,partos,montas,vacunas,ventas,deudas,inventario,siembras,actividadesName});
  const alertasCriticas=alertas.filter(a=>a.tipo==="critica").length;

  const [dashAnio,setDashAnio]=useState(new Date().getFullYear());
  const totG2026=(dashAnio==="todo"?gastos:gastos.filter(g=>g.anio===dashAnio)).reduce((s,g)=>s+Number(g.monto),0);
  const totI2026=(dashAnio==="todo"?ingresos:ingresos.filter(i=>i.anio===dashAnio)).reduce((s,i)=>s+Number(i.monto),0);

  if(!user)return<><style>{CSS}</style>{!isConfigured&&<div style={{position:"fixed",top:0,left:0,right:0,zIndex:999,background:G.goldL,borderBottom:`1px solid ${G.gold}`,padding:"8px 20px",fontSize:13,color:G.gold}}><strong>⚙️ Modo demo</strong> — Configura SUPABASE_URL y SUPABASE_ANON_KEY en el código para activar la base de datos real</div>}<Login onLogin={setUser}/></>;

  return<>
    <style>{CSS}</style>
    {toast&&<Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
    <div className="app">
      {mobile&&sideOpen&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:99}} onClick={()=>setSideOpen(false)}/>}
      <nav className={`sidebar ${mobile?(sideOpen?"open":""):(sideOpen?"":"closed")}`} style={{zIndex:mobile?150:""}}>
        <div className="slogo"><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}><img src="/Logo.png" style={{width:28,height:28,objectFit:"contain"}}/><span style={{fontFamily:"'Playfair Display',serif",color:"#fff",fontSize:17,fontWeight:700}}>Gosh Investment</span></div><span style={{color:"#C9A84C",fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase"}}>Sistema GOSH · Panamá</span></div>
        <div style={{overflowY:"auto",flex:1}}>
          {groups.map(g=><div key={g} className="nav-sec">
            <div className="nav-lbl">{g}</div>
            {nav.filter(n=>n.group===g).map(n=><div key={n.id} className={`nav-item ${page===n.id?"active":""}`} onClick={()=>{setPage(n.id);if(mobile)setSideOpen(false);}}>
              <span style={{fontSize:15}}>{n.icon}</span>{n.label}
              {n.id==="alertas"&&alertas.length>0&&<span className="nav-badge">{alertasCriticas>0?alertasCriticas:alertas.length}</span>}
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
          <div className="fl gap3">
            <button style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:G.g700,padding:"4px 8px"}} onClick={()=>setSideOpen(s=>!s)}>☰</button>
            <h2 style={{fontSize:mobile?"15px":"20px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:mobile?"150px":"none"}}>{titles[page]}</h2>
          </div>
          <div className="fl gap2" style={{alignItems:"center"}}>
            {!mobile&&PERMS.verMontos(role)&&<div style={{fontSize:12,color:G.g500}}>{dashAnio==="todo"?"Total":"Balance "+dashAnio}: <span style={{fontWeight:700,color:totI2026-totG2026>=0?G.deep:G.red}}>{fmt$(totI2026-totG2026)}</span></div>}
            {mobile&&PERMS.verMontos(role)&&<div style={{fontSize:12,fontWeight:700,color:totI2026-totG2026>=0?G.deep:G.red}}>{fmt$(totI2026-totG2026)}</div>}
            {alertas.length>0&&<button className="btn btn-sm" style={{position:"relative",background:alertasCriticas>0?G.red:G.gold,color:"#fff",border:"none",padding:"5px 10px"}} onClick={()=>setPage("alertas")}>
              🔔 {alertas.length}
            </button>}
            <button className="btn btn-o btn-sm" onClick={fetchAll} disabled={loading}>{loading?"↺":"↺"}{!mobile&&" Sync"}</button>
          </div>
        </header>

        <main className="content" style={{paddingBottom:mobile?"72px":""}}>
          {!isConfigured&&<ConfigBanner/>}
          {loading&&<Loading onRetry={fetchAll}/>}
          {!loading&&<>
            {page==="dashboard"&&PERMS.verDashboard(role)&&<><AlertasPanel alertas={alertas} onVerTodas={()=>setPage("alertas")}/><Dashboard gastos={gastos} ingresos={ingresos} onAnioChange={setDashAnio}/></>}
            {page==="alertas"&&<AlertasPage alertas={alertas} onNavegar={setPage}/>}
            {page==="finanzas"&&PERMS.verFinanzas(role)&&<Finanzas gastos={gastos} ingresos={ingresos} onRefresh={fetchAll} role={role} toast={showToast} userId={user?.id} userName={nombre}/>}
            {page==="deudas"&&PERMS.verDeudas(role)&&<Deudas deudas={deudas} onRefresh={fetchAll} role={role} toast={showToast}/>}
            {page==="inventario"&&PERMS.verInventario(role)&&<Inventario inventario={inventario} onRefresh={fetchAll} role={role} toast={showToast}/>}
            {page==="reportes"&&PERMS.verReportes(role)&&<Reportes gastos={gastos} ingresos={ingresos}/>}
            {page==="cerdos_m"&&<CerdosModule role={role} toast={showToast} userId={user?.id} userName={nombre}/>}
            {page==="name_m"&&<NameModule role={role} toast={showToast} gastos={gastos} ingresos={ingresos} userId={user?.id} userName={nombre}/>}
            {page==="usuarios"&&PERMS.verUsuarios(role)&&<UsuariosPage toast={showToast} userId={user?.id} userName={nombre}/>}
            {page==="auditoria"&&PERMS.verAuditoria(role)&&<AuditoriaPage toast={showToast}/>}
            {/* Acceso denegado */}
            {!["dashboard","alertas","finanzas","deudas","inventario","reportes","cerdos_m","name_m","usuarios","auditoria"].includes(page)&&
              <div style={{textAlign:"center",padding:"60px 20px"}}>
                <div style={{fontSize:48,marginBottom:12}}>🔒</div>
                <div style={{fontSize:18,fontWeight:700,color:G.g700}}>Sin acceso</div>
                <div style={{color:G.g500,marginTop:8}}>Tu rol no tiene permisos para esta sección</div>
              </div>}
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
