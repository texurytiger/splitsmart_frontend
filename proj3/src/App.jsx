import { useState, useEffect, useRef } from "react";

// ════════════════════════════════════════════
//  CONFIG
// ════════════════════════════════════════════
const API_URL = "http://localhost:3000/api";
const COLORS = [
  "#FF6B6B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#FF6FC8",
  "#C77DFF",
  "#FF9A3C",
  "#00D9C0",
];
const EMOJIS = ["🍕", "🚌", "🛒", "🎬", "🏨", "⚡", "🎮", "🧾"];

// ════════════════════════════════════════════
//  GLOBAL STYLES (injected into <head>)
// ════════════════════════════════════════════
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

:root {
  --bg: #07070F;
  --surface: #0F0F1A;
  --card: #161622;
  --card2: #1D1D2E;
  --border: rgba(255,255,255,0.07);
  --border2: rgba(255,255,255,0.12);
  --accent: #BFFF00;
  --accent-dim: rgba(191,255,0,0.12);
  --accent-dark: #8FBF00;
  --purple: #9B7FFF;
  --purple-dim: rgba(155,127,255,0.15);
  --text: #EDEDF5;
  --muted: #6B6B80;
  --muted2: #9999AA;
  --danger: #FF5C72;
  --success: #00E5A0;
  --warn: #FFB347;
}

body.light-mode {
  --bg: #F0F4FF;
  --surface: #FFFFFF;
  --card: #FFFFFF;
  --card2: #EEF1FA;
  --border: rgba(30,40,80,0.10);
  --border2: rgba(30,40,80,0.18);
  --accent: #2D6A00;
  --accent-dim: rgba(45,106,0,0.10);
  --accent-dark: #1E4800;
  --purple: #5B3DBF;
  --purple-dim: rgba(91,61,191,0.10);
  --text: #0D0D1A;
  --muted: #7A7A96;
  --muted2: #44445A;
  --danger: #C0001E;
  --success: #007A50;
  --warn: #9A5000;
}
body.light-mode::before { opacity: 0.03; }
body.light-mode .orb1 { background: rgba(45,106,0,0.07); }
body.light-mode .orb2 { background: rgba(91,61,191,0.07); }
body.light-mode .topbar {
  background: rgba(240,244,255,0.95);
  border-bottom: 1px solid rgba(30,40,80,0.12);
}
body.light-mode .tabs {
  background: #FFFFFF;
  border-bottom: 1px solid rgba(30,40,80,0.10);
}
body.light-mode .modal { background: #FFFFFF; }
body.light-mode .setup-card { background: #FFFFFF; box-shadow: 0 4px 32px rgba(0,0,0,0.08); }
body.light-mode .inp {
  background: #F5F7FF;
  border-color: rgba(30,40,80,0.18);
  color: #0D0D1A;
}
body.light-mode .inp:focus {
  border-color: #2D6A00;
  box-shadow: 0 0 0 3px rgba(45,106,0,0.10);
}
body.light-mode .btn { background: #2D6A00; color: #FFFFFF; }
body.light-mode .btn:hover { box-shadow: 0 4px 18px rgba(45,106,0,0.25); }
body.light-mode .logo-title {
  background: linear-gradient(135deg, #0D0D1A 40%, #2D6A00 100%);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  padding: 0.1em 0.05em; line-height:1.2; display:inline-block;
}
body.light-mode .logo-icon {
  background: rgba(45,106,0,0.10);
  border-color: rgba(45,106,0,0.25);
}
body.light-mode .balance-card,
body.light-mode .expense-card,
body.light-mode .txn-card,
body.light-mode .member-row,
body.light-mode .admin-item { background: #FFFFFF; box-shadow: 0 1px 8px rgba(0,0,0,0.06); }
body.light-mode .member-chip { background: #F5F7FF; }
body.light-mode .settle-header { background: rgba(45,106,0,0.08); border-color: rgba(45,106,0,0.20); }
body.light-mode .settle-header .sh-text strong { color: #2D6A00; }
body.light-mode .tab.active { border-bottom-color: #2D6A00; color: #0D0D1A; }
body.light-mode .paidby-opt.selected { border-color: #2D6A00; background: rgba(45,106,0,0.10); color: #2D6A00; }
body.light-mode .split-opt.selected { border-color: #5B3DBF; background: rgba(91,61,191,0.10); color: #5B3DBF; }
body.light-mode .fab { background: linear-gradient(135deg,#2D6A00,#3A8A00); box-shadow: 0 8px 30px rgba(45,106,0,0.3); }
body.light-mode .emo-opt.selected { border-color:#2D6A00; background:rgba(45,106,0,0.10); }
body.light-mode .group-card { background: #FFFFFF; box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
body.light-mode .viewer-badge { background: rgba(91,61,191,0.10); border-color: rgba(91,61,191,0.25); color: #5B3DBF; }

.theme-toggle {
  width:38px; height:38px; border-radius:10px;
  background:var(--card); border:1px solid var(--border2);
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; font-size:17px; transition:all 0.2s; flex-shrink:0;
}
.theme-toggle:hover { border-color:var(--accent); background:var(--accent-dim); }

* { margin:0; padding:0; box-sizing:border-box; }
html, body, #root {
  width:100%; min-height:100vh;
}
body {
  background:var(--bg); color:var(--text);
  font-family:'DM Sans',sans-serif;
  min-height:100vh; overflow-x:hidden;
}
#root {
  max-width:100% !important;
  width:100% !important;
  padding:0 !important;
  margin:0 !important;
  text-align:left !important;
}
.mono { font-family:'Space Mono',monospace; }

body::before {
  content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  opacity:0.4;
}

.orb { position:fixed; border-radius:50%; filter:blur(80px); pointer-events:none; z-index:0; animation:floatOrb 8s ease-in-out infinite alternate; }
.orb1 { width:400px; height:400px; background:rgba(191,255,0,0.06); top:-100px; right:-100px; }
.orb2 { width:300px; height:300px; background:rgba(155,127,255,0.08); bottom:10%; left:-80px; animation-delay:-4s; }
@keyframes floatOrb { from{transform:translate(0,0)} to{transform:translate(20px,30px)} }

.screen { position:relative; z-index:1; }
@keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
.screen { animation:fadeUp 0.4s cubic-bezier(0.16,1,0.3,1); }

.page-wrap { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:2rem; }
.logo-wrap { text-align:center; margin-bottom:3rem; }
.logo-icon {
  width:72px; height:72px; background:var(--accent-dim); border-radius:20px;
  border:1px solid rgba(191,255,0,0.3); display:flex; align-items:center; justify-content:center;
  margin:0 auto 1.5rem; font-size:32px; animation:pulseGlow 3s ease-in-out infinite;
}
@keyframes pulseGlow { 0%,100%{box-shadow:0 0 20px rgba(191,255,0,0.15)} 50%{box-shadow:0 0 40px rgba(191,255,0,0.35)} }
.logo-title {
  font-size:clamp(2.5rem,6vw,4rem); font-weight:600; letter-spacing:-2px;
  background:linear-gradient(135deg, #FFFFFF 40%, var(--accent) 100%);
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  padding: 0.1em 0.05em; line-height:1.2; display:inline-block;
}
.logo-sub { color:var(--muted); font-size:1rem; margin-top:0.5rem; letter-spacing:0.02em; }

.setup-card {
  background:var(--surface); border:1px solid var(--border2); border-radius:20px;
  padding:2rem; width:100%; max-width:520px;
}
.setup-card h2 { font-size:1.1rem; font-weight:500; margin-bottom:1.5rem; color:var(--muted2); }
.input-row { display:flex; gap:10px; margin-bottom:1rem; }
.inp {
  flex:1; background:var(--card); border:1px solid var(--border2); border-radius:12px;
  padding:12px 16px; color:var(--text); font-family:'DM Sans',sans-serif; font-size:0.95rem;
  outline:none; transition:border-color 0.2s, box-shadow 0.2s;
}
.inp:focus { border-color:rgba(191,255,0,0.4); box-shadow:0 0 0 3px rgba(191,255,0,0.08); }
.inp::placeholder { color:var(--muted); }
.btn {
  background:var(--accent); color:#0A0A0A; border:none; border-radius:12px;
  padding:12px 20px; font-family:'DM Sans',sans-serif; font-size:0.9rem; font-weight:600;
  cursor:pointer; transition:transform 0.15s, box-shadow 0.15s; white-space:nowrap;
}
.btn:hover { transform:translateY(-1px); box-shadow:0 4px 20px rgba(191,255,0,0.25); }
.btn:active { transform:scale(0.97); }
.btn:disabled { opacity:0.35; cursor:not-allowed; transform:none; box-shadow:none; }
.btn-outline {
  background:transparent; color:var(--text); border:1px solid var(--border2); border-radius:12px;
  padding:12px 20px; font-family:'DM Sans',sans-serif; font-size:0.9rem; font-weight:500;
  cursor:pointer; transition:all 0.15s; white-space:nowrap;
}
.btn-outline:hover { border-color:var(--accent); color:var(--accent); }
.btn-danger {
  background:rgba(255,92,114,0.12); color:var(--danger); border:1px solid rgba(255,92,114,0.3);
  border-radius:12px; padding:12px 20px; font-family:'DM Sans',sans-serif; font-size:0.9rem; font-weight:600;
  cursor:pointer; transition:all 0.2s;
}
.btn-danger:hover { background:rgba(255,92,114,0.22); }
.btn-dissolve {
  background:rgba(255,92,114,0.12); color:var(--danger);
  border:1px solid rgba(255,92,114,0.3); border-radius:10px;
  padding:6px 14px; font-family:'DM Sans',sans-serif; font-size:0.8rem; font-weight:600;
  cursor:pointer; transition:all 0.2s;
}
.btn-dissolve:hover { background:rgba(255,92,114,0.22); }

.members-list { display:flex; flex-wrap:wrap; gap:8px; min-height:40px; }
.member-chip {
  display:flex; align-items:center; gap:8px; background:var(--card);
  border:1px solid var(--border2); border-radius:30px; padding:6px 12px 6px 6px;
  animation:popIn 0.25s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes popIn { from{opacity:0;transform:scale(0.7)} to{opacity:1;transform:scale(1)} }
.avatar { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600; flex-shrink:0; }
.chip-name { font-size:0.88rem; font-weight:500; }
.chip-del { background:none; border:none; color:var(--muted); cursor:pointer; font-size:16px; line-height:1; padding:0 0 0 2px; }
.chip-del:hover { color:var(--danger); }

.start-btn { width:100%; margin-top:1.5rem; padding:15px; font-size:1rem; background:linear-gradient(135deg, var(--accent) 0%, #90EE00 100%); box-shadow:0 0 30px rgba(191,255,0,0.2); }

.group-card {
  background:var(--card); border:1px solid var(--border2); border-radius:16px;
  padding:16px 20px; margin-bottom:10px; display:flex; align-items:center; gap:14px;
  cursor:pointer; transition:all 0.2s; animation:fadeUp 0.3s ease;
}
.group-card:hover { border-color:var(--accent); background:var(--accent-dim); transform:translateY(-1px); }
.group-icon { font-size:1.5rem; }
.group-name { flex:1; font-weight:500; font-size:1rem; }
.group-meta { font-size:0.78rem; color:var(--muted); }
.new-group-row { display:flex; gap:10px; margin-top:1rem; }

.viewer-badge {
  display:inline-flex; align-items:center; gap:6px; background:var(--purple-dim);
  border:1px solid rgba(155,127,255,0.3); border-radius:20px; padding:4px 12px;
  font-size:0.78rem; color:var(--purple); font-weight:600; letter-spacing:0.04em;
  margin-bottom:1.25rem;
}

#app-screen { min-height:100vh; display:flex; flex-direction:column; }
.topbar {
  padding:1.25rem 1.5rem 1rem; display:flex; align-items:center; justify-content:space-between;
  border-bottom:1px solid var(--border); backdrop-filter:blur(10px);
  position:sticky; top:0; z-index:10; background:rgba(7,7,15,0.85);
}
.topbar-left { display:flex; align-items:center; gap:12px; }
.topbar-logo { font-size:1.2rem; font-weight:700; letter-spacing:-0.5px; }
.topbar-logo span { color:var(--accent); }
.group-pill { background:var(--card); border:1px solid var(--border2); border-radius:20px; padding:5px 12px; font-size:0.8rem; color:var(--muted2); }
.topbar-right { display:flex; align-items:center; gap:10px; }
.topbar-stat { text-align:right; }
.topbar-stat .big { font-family:'Space Mono',monospace; font-size:1.1rem; font-weight:700; color:var(--accent); }
.topbar-stat .sm { font-size:0.75rem; color:var(--muted); margin-top:1px; }

.tabs { display:flex; gap:0; padding:0 1.5rem; border-bottom:1px solid var(--border); background:var(--surface); position:sticky; top:65px; z-index:9; }
.tab { flex:1; padding:14px 10px; text-align:center; font-size:0.88rem; font-weight:500; color:var(--muted); border:none; background:none; cursor:pointer; border-bottom:2px solid transparent; transition:all 0.2s; position:relative; }
.tab.active { color:var(--text); border-bottom-color:var(--accent); }
.tab-badge { position:absolute; top:10px; right:8px; background:var(--accent); color:#000; border-radius:10px; font-size:10px; font-weight:700; padding:1px 5px; min-width:16px; }

.tab-content { display:none; padding:1.5rem; flex:1; }
.tab-content.active { display:block; animation:fadeUp 0.3s ease; }

.expense-card {
  background:var(--card); border:1px solid var(--border); border-radius:16px;
  padding:16px; margin-bottom:12px; display:flex; gap:14px; align-items:flex-start;
  transition:border-color 0.2s, transform 0.2s; animation:slideIn 0.3s cubic-bezier(0.16,1,0.3,1);
}
@keyframes slideIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
.expense-card:hover { border-color:var(--border2); transform:translateX(3px); }
.exp-icon { width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; background:var(--card2); border:1px solid var(--border); }
.exp-body { flex:1; min-width:0; }
.exp-desc { font-weight:500; font-size:0.95rem; margin-bottom:4px; }
.exp-meta { font-size:0.8rem; color:var(--muted); display:flex; gap:8px; flex-wrap:wrap; }
.exp-meta .paid-by { color:var(--accent-dark); font-weight:500; }
.exp-amount { font-family:'Space Mono',monospace; font-size:1.05rem; font-weight:700; color:var(--text); flex-shrink:0; }
.exp-split-chips { display:flex; gap:4px; flex-wrap:wrap; margin-top:8px; }
.split-chip { background:var(--card2); border:1px solid var(--border); border-radius:20px; padding:2px 8px; font-size:0.72rem; color:var(--muted2); }
.exp-actions { display:flex; flex-direction:column; align-items:flex-end; gap:8px; flex-shrink:0; }
.btn-delete-exp { background:rgba(255,92,114,0.10); color:var(--danger); border:1px solid rgba(255,92,114,0.25); border-radius:8px; padding:5px 10px; font-size:0.75rem; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; }
.btn-delete-exp:hover { background:rgba(255,92,114,0.22); }

.empty-state { text-align:center; padding:4rem 2rem; color:var(--muted); }
.empty-icon { font-size:3rem; margin-bottom:1rem; }
.empty-state h3 { font-size:1.1rem; color:var(--muted2); margin-bottom:0.5rem; }

.balance-card { background:var(--card); border:1px solid var(--border); border-radius:16px; padding:18px; margin-bottom:12px; display:flex; align-items:center; gap:16px; animation:slideIn 0.3s ease; }
.bal-avatar { width:48px; height:48px; border-radius:14px; font-size:16px; flex-shrink:0; }
.bal-info { flex:1; min-width:0; }
.bal-name { font-weight:600; margin-bottom:6px; }
.bal-bar-wrap { height:6px; background:var(--card2); border-radius:3px; overflow:hidden; }
.bal-bar { height:100%; border-radius:3px; transition:width 0.8s cubic-bezier(0.16,1,0.3,1); }
.bal-amount { font-family:'Space Mono',monospace; font-size:1rem; font-weight:700; flex-shrink:0; text-align:right; }
.bal-label { font-size:0.75rem; margin-top:2px; text-align:right; }
.positive { color:var(--success); }
.negative { color:var(--danger); }
.neutral  { color:var(--muted2); }

.settle-header { background:var(--accent-dim); border:1px solid rgba(191,255,0,0.2); border-radius:14px; padding:16px; margin-bottom:1.5rem; display:flex; align-items:center; gap:12px; }
.settle-header .sh-icon { font-size:1.5rem; }
.settle-header .sh-text { font-size:0.85rem; color:var(--muted2); line-height:1.5; }
.settle-header .sh-text strong { color:var(--accent); }
.txn-card { background:var(--card); border:1px solid var(--border); border-radius:16px; padding:18px; margin-bottom:12px; display:flex; align-items:center; gap:16px; transition:all 0.3s; animation:slideIn 0.3s ease; }
.txn-from-to { flex:1; display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.txn-person { display:flex; align-items:center; gap:8px; }
.txn-person .t-name { font-weight:500; font-size:0.95rem; }
.txn-arrow { color:var(--accent); font-size:1.1rem; flex-shrink:0; }
.txn-right { text-align:right; flex-shrink:0; display:flex; flex-direction:column; gap:6px; align-items:flex-end; }
.txn-amount { font-family:'Space Mono',monospace; font-weight:700; font-size:1rem; color:var(--warn); }
.settle-btn { background:var(--success); color:#000; border:none; border-radius:10px; padding:7px 14px; font-family:'DM Sans',sans-serif; font-size:0.8rem; font-weight:600; cursor:pointer; transition:all 0.2s; }
.settle-btn:hover { transform:scale(1.05); }
.settle-btn.done { background:var(--card2); color:var(--muted); cursor:default; transform:none; }
.phonepe-btn { background:#5F259F; color:#fff; border:none; border-radius:10px; padding:7px 14px; font-family:'DM Sans',sans-serif; font-size:0.8rem; font-weight:600; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; gap:5px; }
.phonepe-btn:hover { background:#7B33BF; transform:scale(1.05); }
.all-settled { text-align:center; padding:3rem 2rem; animation:fadeUp 0.5s ease; }
.all-settled .as-icon { font-size:3rem; margin-bottom:1rem; }
.all-settled h3 { font-size:1.2rem; color:var(--success); margin-bottom:0.5rem; }
.all-settled p { color:var(--muted); font-size:0.9rem; }

.fab { position:fixed; bottom:2rem; right:2rem; width:60px; height:60px; background:linear-gradient(135deg, var(--accent), #8FEE00); color:#000; border:none; border-radius:18px; font-size:26px; cursor:pointer; box-shadow:0 8px 30px rgba(191,255,0,0.35); z-index:20; transition:transform 0.2s, box-shadow 0.2s; display:flex; align-items:center; justify-content:center; }
.fab:hover { transform:translateY(-3px) scale(1.05); box-shadow:0 12px 40px rgba(191,255,0,0.45); }
.fab:active { transform:scale(0.95); }

.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); backdrop-filter:blur(8px); z-index:50; display:flex; align-items:flex-end; justify-content:center; }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
.modal { background:var(--surface); border:1px solid var(--border2); border-radius:24px 24px 0 0; padding:2rem; width:100%; max-width:520px; max-height:90vh; overflow-y:auto; animation:slideUp 0.35s cubic-bezier(0.16,1,0.3,1); }
@keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
.modal-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; }
.modal-title { font-size:1.2rem; font-weight:600; }
.close-btn { background:var(--card); border:1px solid var(--border2); border-radius:10px; width:36px; height:36px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--muted); font-size:18px; }
.close-btn:hover { color:var(--text); }
.form-group { margin-bottom:1.25rem; }
.form-label { font-size:0.83rem; font-weight:500; color:var(--muted2); margin-bottom:8px; display:block; letter-spacing:0.03em; text-transform:uppercase; }
.amount-inp { font-family:'Space Mono',monospace; font-size:1.5rem; }
.paidby-grid { display:flex; gap:8px; flex-wrap:wrap; }
.paidby-opt { display:flex; align-items:center; gap:8px; background:var(--card); border:2px solid var(--border); border-radius:12px; padding:8px 14px; cursor:pointer; transition:all 0.15s; font-size:0.88rem; font-weight:500; }
.paidby-opt.selected { border-color:var(--accent); background:var(--accent-dim); color:var(--accent); }
.splitby-grid { display:flex; gap:8px; flex-wrap:wrap; }
.split-opt { display:flex; align-items:center; gap:8px; background:var(--card); border:2px solid var(--border); border-radius:12px; padding:8px 14px; cursor:pointer; transition:all 0.15s; font-size:0.88rem; font-weight:500; }
.split-opt.selected { border-color:var(--purple); background:var(--purple-dim); color:var(--purple); }
.split-preview { background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px 16px; font-size:0.88rem; color:var(--muted2); margin-top:8px; display:flex; justify-content:space-between; align-items:center; }
.split-preview .sp-amt { font-family:'Space Mono',monospace; color:var(--accent); font-weight:700; }
.payer-preview { background:var(--card); border:1px solid rgba(191,255,0,0.15); border-radius:12px; padding:12px 16px; font-size:0.88rem; color:var(--muted2); margin-top:6px; display:flex; justify-content:space-between; align-items:center; }
.payer-preview .sp-amt { font-family:'Space Mono',monospace; color:var(--warn); font-weight:700; }
.submit-btn { width:100%; padding:15px; font-size:1rem; margin-top:0.5rem; }
.emoji-select { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:8px; }
.emo-opt { width:40px; height:40px; background:var(--card); border:2px solid var(--border); border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; cursor:pointer; transition:all 0.15s; }
.emo-opt.selected { border-color:var(--accent); background:var(--accent-dim); }

.custom-split-section { margin-top:10px; }
.custom-toggle { display:flex; align-items:center; gap:8px; margin-bottom:10px; cursor:pointer; user-select:none; font-size:0.85rem; color:var(--muted2); }
.custom-toggle input[type=checkbox] { width:16px; height:16px; cursor:pointer; accent-color:var(--accent); }
.custom-amounts { background:var(--card); border:1px solid var(--border); border-radius:12px; padding:12px; }
.custom-amounts .ca-row { display:flex; align-items:center; gap:10px; margin-bottom:8px; }
.custom-amounts .ca-row:last-child { margin-bottom:0; }
.ca-name { font-size:0.88rem; font-weight:500; min-width:80px; }
.ca-inp { flex:1; background:var(--card2); border:1px solid var(--border2); border-radius:8px; padding:8px 12px; color:var(--text); font-family:'Space Mono',monospace; font-size:0.9rem; outline:none; }
.ca-inp:focus { border-color:var(--accent); }
.ca-total { display:flex; justify-content:space-between; padding-top:8px; border-top:1px solid var(--border); margin-top:8px; font-size:0.85rem; }
.ca-total .ok { color:var(--success); font-weight:600; }
.ca-total .err { color:var(--danger); font-weight:600; }

.admin-badge { display:inline-flex; align-items:center; gap:6px; background:rgba(191,255,0,0.1); border:1px solid rgba(191,255,0,0.25); border-radius:20px; padding:4px 12px; font-size:0.78rem; color:var(--accent); font-weight:600; letter-spacing:0.04em; margin-bottom:1.25rem; }
.login-err { color:var(--danger); font-size:0.85rem; margin-bottom:1rem; padding:10px 14px; background:rgba(255,92,114,0.1); border-radius:10px; border:1px solid rgba(255,92,114,0.2); }
.login-success { color:var(--success); font-size:0.85rem; margin-bottom:1rem; padding:10px 14px; background:rgba(0,229,160,0.1); border-radius:10px; border:1px solid rgba(0,229,160,0.2); }
.text-link { background:none; border:none; color:var(--accent); font-size:0.85rem; cursor:pointer; font-family:'DM Sans',sans-serif; font-weight:600; }
.text-link:hover { text-decoration:underline; }
.pw-hint { font-size:0.78rem; color:var(--muted); margin-top:4px; line-height:1.4; }

.admin-section { margin-top:1.5rem; padding-top:1.5rem; border-top:1px solid var(--border); }
.admin-section h2 { font-size:1rem; font-weight:500; margin-bottom:1rem; color:var(--muted2); }
.admin-list { display:flex; flex-direction:column; gap:8px; margin-bottom:1rem; }
.admin-item { display:flex; align-items:center; gap:10px; background:var(--card); border:1px solid var(--border2); border-radius:12px; padding:10px 14px; }
.admin-item .admin-email { flex:1; font-size:0.88rem; color:var(--text); }
.admin-item .admin-you { font-size:0.72rem; color:var(--accent); font-weight:600; background:var(--accent-dim); border-radius:20px; padding:2px 8px; }
.admin-item .btn-remove-admin { background:rgba(255,92,114,0.10); color:var(--danger); border:1px solid rgba(255,92,114,0.25); border-radius:8px; padding:4px 10px; font-size:0.78rem; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; }
.admin-item .btn-remove-admin:hover { background:rgba(255,92,114,0.22); }
.btn-remove-member { background:rgba(255,92,114,0.10); color:var(--danger); border:1px solid rgba(255,92,114,0.25); border-radius:8px; padding:5px 10px; font-size:0.78rem; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all 0.2s; flex-shrink:0; }
.btn-remove-member:hover { background:rgba(255,92,114,0.22); }
.member-row { display:flex; align-items:center; gap:12px; background:var(--card); border:1px solid var(--border); border-radius:14px; padding:12px 16px; margin-bottom:10px; animation:slideIn 0.3s ease; }
.member-row .m-name { flex:1; font-weight:500; font-size:0.95rem; }

.btn-switch-group { background:var(--card2); color:var(--muted2); border:1px solid var(--border2); border-radius:10px; padding:6px 12px; font-family:'DM Sans',sans-serif; font-size:0.8rem; font-weight:500; cursor:pointer; transition:all 0.2s; }
.btn-switch-group:hover { color:var(--text); border-color:var(--border2); }

::-webkit-scrollbar { width:4px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:var(--border2); border-radius:2px; }

.section-label { font-size:0.83rem; font-weight:500; color:var(--muted2); letter-spacing:0.06em; text-transform:uppercase; margin-bottom:12px; }
.divider { border:none; border-top:1px solid var(--border); margin:1.5rem 0; }
`;

// ════════════════════════════════════════════
//  THEME
// ════════════════════════════════════════════
function useTheme() {
  const [light, setLight] = useState(false);
  useEffect(() => {
    if (light) document.body.classList.add("light-mode");
    else document.body.classList.remove("light-mode");
  }, [light]);
  return [light, () => setLight((v) => !v)];
}

function ThemeToggle({ light, onToggle }) {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      title={light ? "Dark mode" : "Light mode"}
    >
      {light ? "🌙" : "☀️"}
    </button>
  );
}

// ════════════════════════════════════════════
//  API HELPER
// ════════════════════════════════════════════
async function apiFetch(method, endpoint, body = null, token = null) {
  const options = { method, headers: { "Content-Type": "application/json" } };
  if (token) options.headers["Authorization"] = "Bearer " + token;
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(API_URL + endpoint, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

// ════════════════════════════════════════════
//  PASSWORD VALIDATION
// ════════════════════════════════════════════
function validatePassword(password) {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password))
    return "Password needs at least 1 uppercase letter.";
  if (!/[0-9]/.test(password)) return "Password needs at least 1 number.";
  if (!/[!@#$%^&*()\-_=+\[\]{};:'"\\|,.<>\/?]/.test(password))
    return "Password needs at least 1 special character (e.g. !@#$%).";
  return null;
}

// ════════════════════════════════════════════
//  BALANCE CALCULATION
// ════════════════════════════════════════════
function calcBalances(members, expenses, payments) {
  const bal = {};
  members.forEach((m) => (bal[m.id] = 0));

  expenses.forEach((exp) => {
    const total = exp.amount;

    if (exp.payerAmounts && Object.keys(exp.payerAmounts).length > 0) {
      exp.payers.forEach((pid) => {
        const paidByThisPerson = exp.payerAmounts[pid] || 0;
        bal[pid] = (bal[pid] || 0) + paidByThisPerson;
      });
    } else {
      const eachPayerShare = total / exp.payers.length;
      exp.payers.forEach((pid) => {
        bal[pid] = (bal[pid] || 0) + eachPayerShare;
      });
    }

    if (exp.splitAmounts && Object.keys(exp.splitAmounts).length > 0) {
      exp.splitAmong.forEach((id) => {
        const owedByThisPerson = exp.splitAmounts[id] || 0;
        bal[id] = (bal[id] || 0) - owedByThisPerson;
      });
    } else {
      const eachPersonsShare = total / exp.splitAmong.length;
      exp.splitAmong.forEach((id) => {
        bal[id] = (bal[id] || 0) - eachPersonsShare;
      });
    }
  });

  payments.forEach((p) => {
    if (bal[p.fromId] !== undefined) bal[p.fromId] = bal[p.fromId] + p.amount;
    if (bal[p.toId] !== undefined) bal[p.toId] = bal[p.toId] - p.amount;
  });

  Object.keys(bal).forEach((id) => {
    if (Math.abs(bal[id]) < 0.01) delete bal[id];
  });

  return bal;
}

// ════════════════════════════════════════════
//  MINIMIZE TRANSACTIONS ALGORITHM
// ════════════════════════════════════════════
function minimizeTransactions(bal) {
  const creditors = [],
    debtors = [];
  Object.entries(bal).forEach(([id, amt]) => {
    if (amt > 0.01) creditors.push({ id: +id, amt });
    if (amt < -0.01) debtors.push({ id: +id, amt: -amt });
  });
  const txns = [];
  while (creditors.length && debtors.length) {
    creditors.sort((a, b) => b.amt - a.amt);
    debtors.sort((a, b) => b.amt - a.amt);
    const c = creditors[0],
      d = debtors[0];
    const settle = Math.min(c.amt, d.amt);
    txns.push({ from: d.id, to: c.id, amount: settle });
    c.amt = c.amt - settle;
    d.amt = d.amt - settle;
    if (c.amt < 0.01) creditors.shift();
    if (d.amt < 0.01) debtors.shift();
  }
  return txns;
}

function txnKey(t) {
  return `${t.from}-${t.to}-${t.amount.toFixed(2)}`;
}

// ════════════════════════════════════════════
//  LOGIN SCREEN
// ════════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const [light, toggleTheme] = useTheme();
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch("GET", "/auth/exists")
      .then(({ exists }) => {
        // Default to login if any admin exists; registration still accessible via toggle
        if (!exists) setAuthMode("register");
      })
      .catch(() =>
        setErrMsg(
          "Cannot connect to server. Make sure server.js is running on port 3000.",
        ),
      );
  }, []);

  async function doAuth() {
    setErrMsg("");
    setSuccessMsg("");
    if (!email || !password) {
      setErrMsg("Please fill in all fields.");
      return;
    }

    if (authMode === "register") {
      if (password !== confirm) {
        setErrMsg("Passwords do not match.");
        return;
      }
      const pwErr = validatePassword(password);
      if (pwErr) {
        setErrMsg(pwErr);
        return;
      }
      setLoading(true);
      try {
        await apiFetch("POST", "/auth/register", { email, password });
        setAuthMode("login");
        setPassword("");
        setConfirm("");
        setSuccessMsg("Account created! Now log in.");
      } catch (e) {
        setErrMsg(e.message);
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const result = await apiFetch("POST", "/auth/login", { email, password });
      onLogin(result.token, result.email, result.role, result.groupId);
    } catch (e) {
      setErrMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="screen">
      <div className="page-wrap">
        <div
          style={{
            position: "fixed",
            top: "1.25rem",
            right: "1.5rem",
            zIndex: 20,
          }}
        >
          <ThemeToggle light={light} onToggle={toggleTheme} />
        </div>
        <div className="logo-wrap">
          <div className="logo-icon">💸</div>
          <h1 className="logo-title">SplitSmart</h1>
          <p className="logo-sub">Settle debts in minimum transactions</p>
        </div>
        <div className="setup-card">
          <div className="admin-badge">
            {authMode === "register" ? "🔐 First Time Setup" : "🔐 Sign In"}
          </div>
          <h2>
            {authMode === "register"
              ? "Create Admin Account"
              : "Sign in to continue"}
          </h2>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="inp"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doAuth()}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="inp"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doAuth()}
            />
            {authMode === "register" && (
              <p className="pw-hint">
                Must be 8+ characters with 1 uppercase, 1 number, 1 special
                character
              </p>
            )}
          </div>
          {authMode === "register" && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                className="inp"
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doAuth()}
              />
            </div>
          )}

          {errMsg && <div className="login-err">{errMsg}</div>}
          {successMsg && <div className="login-success">{successMsg}</div>}

          <button className="btn start-btn" onClick={doAuth} disabled={loading}>
            {loading
              ? "Please wait..."
              : authMode === "register"
                ? "Register →"
                : "Login →"}
          </button>
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button
              className="text-link"
              onClick={() => {
                setAuthMode((m) => (m === "login" ? "register" : "login"));
                setErrMsg("");
                setSuccessMsg("");
              }}
            >
              {authMode === "login"
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
//  GROUP SELECTOR (admin only)
// ════════════════════════════════════════════
function GroupSelectorScreen({ token, onSelectGroup }) {
  const [light, toggleTheme] = useTheme();
  const [groups, setGroups] = useState([]);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    apiFetch("GET", "/groups", null, token)
      .then((d) => setGroups(d.groups || []))
      .catch((e) => setErr(e.message));
  }, [token]);

  async function createGroup() {
    if (!newName.trim()) return;
    setCreating(true);
    setErr("");
    try {
      const group = await apiFetch(
        "POST",
        "/groups",
        { name: newName.trim() },
        token,
      );
      setGroups((prev) => [...prev, group]);
      setNewName("");
      onSelectGroup(group.id, group.name, true);
    } catch (e) {
      setErr(e.message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="screen">
      <div className="page-wrap">
        <div
          style={{
            position: "fixed",
            top: "1.25rem",
            right: "1.5rem",
            zIndex: 20,
          }}
        >
          <ThemeToggle light={light} onToggle={toggleTheme} />
        </div>
        <div className="logo-wrap">
          <div className="logo-icon">👥</div>
          <h1 className="logo-title">Your Groups</h1>
          <p className="logo-sub">Select a group or create a new one</p>
        </div>
        <div className="setup-card">
          {groups.length > 0 && (
            <>
              <h2>Existing Groups</h2>
              {groups.map((g) => (
                <div
                  key={g.id}
                  className="group-card"
                  onClick={() => onSelectGroup(g.id, g.name, false)}
                >
                  <span className="group-icon">👥</span>
                  <span className="group-name">{g.name}</span>
                  <span className="group-meta">→</span>
                </div>
              ))}
              <hr className="divider" />
            </>
          )}
          <h2>Create New Group</h2>
          <div className="new-group-row">
            <input
              className="inp"
              placeholder="Group name (e.g. Goa Trip)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createGroup()}
            />
            <button
              className="btn"
              onClick={createGroup}
              disabled={creating || !newName.trim()}
            >
              {creating ? "..." : "Create"}
            </button>
          </div>
          {err && (
            <div className="login-err" style={{ marginTop: "8px" }}>
              {err}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
//  SETUP SCREEN (add members)
// ════════════════════════════════════════════
function SetupScreen({
  members,
  setMembers,
  token,
  groupId,
  groupName,
  onStart,
}) {
  const [light, toggleTheme] = useTheme();
  const [input, setInput] = useState("");

  async function addMember() {
    const name = input.trim();
    if (
      !name ||
      members.find((m) => m.name.toLowerCase() === name.toLowerCase())
    )
      return;
    const id = Date.now() + Math.floor(Math.random() * 1000000);
    const color = COLORS[members.length % COLORS.length];
    try {
      await apiFetch("POST", "/members", { id, name, color, groupId }, token);
      setMembers((prev) => [...prev, { id, name, color, groupId }]);
      setInput("");
    } catch (e) {
      alert("Failed to add member: " + e.message);
    }
  }

  async function removeMember(id) {
    try {
      await apiFetch("DELETE", "/members/" + id, null, token);
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      alert("Failed to remove member: " + e.message);
    }
  }

  return (
    <div className="screen">
      <div className="page-wrap">
        <div
          style={{
            position: "fixed",
            top: "1.25rem",
            right: "1.5rem",
            zIndex: 20,
          }}
        >
          <ThemeToggle light={light} onToggle={toggleTheme} />
        </div>
        <div className="logo-wrap">
          <div className="logo-icon">💸</div>
          <h1 className="logo-title">SplitSmart</h1>
          <p className="logo-sub">{groupName}</p>
        </div>
        <div className="setup-card">
          <h2>Who's in the group?</h2>
          <div className="input-row">
            <input
              className="inp"
              placeholder="Enter a name..."
              maxLength={20}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addMember()}
            />
            <button className="btn" onClick={addMember}>
              Add
            </button>
          </div>
          <div className="members-list">
            {members.map((m) => (
              <div key={m.id} className="member-chip">
                <div
                  className="avatar"
                  style={{ background: m.color + "22", color: m.color }}
                >
                  {m.name[0].toUpperCase()}
                </div>
                <span className="chip-name">{m.name}</span>
                <button className="chip-del" onClick={() => removeMember(m.id)}>
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            className="btn start-btn"
            onClick={onStart}
            disabled={members.length < 2}
          >
            Let's Split →
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
//  EXPENSE MODAL
// ════════════════════════════════════════════
function ExpenseModal({ members, token, groupId, onAdded, onClose }) {
  const [emoji, setEmoji] = useState("🍕");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [payers, setPayers] = useState(new Set([members[0]?.id]));
  const [splitAmong, setSplitAmong] = useState(
    new Set(members.map((m) => m.id)),
  );

  const [useCustomPay, setUseCustomPay] = useState(false);
  const [customPayAmts, setCustomPayAmts] = useState({});

  const [useCustomSplit, setUseCustomSplit] = useState(false);
  const [customSplitAmts, setCustomSplitAmts] = useState({});

  const descRef = useRef(null);
  useEffect(() => {
    setTimeout(() => descRef.current?.focus(), 400);
  }, []);

  const amt = parseFloat(amount) || 0;

  function togglePayer(id) {
    setPayers((prev) => {
      if (prev.has(id) && prev.size === 1) return prev;
      const next = new Set(prev);
      prev.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSplit(id) {
    setSplitAmong((prev) => {
      if (prev.has(id) && prev.size === 1) return prev;
      const next = new Set(prev);
      prev.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const customPayTotal = [...payers].reduce(
    (sum, id) => sum + (parseFloat(customPayAmts[id]) || 0),
    0,
  );
  const customSplitTotal = [...splitAmong].reduce(
    (sum, id) => sum + (parseFloat(customSplitAmts[id]) || 0),
    0,
  );

  const payRemaining = amt - customPayTotal;
  const splitRemaining = amt - customSplitTotal;

  const payValid = Math.abs(payRemaining) < 1;
  const splitValid = Math.abs(splitRemaining) < 1;

  async function submit() {
    const d = desc.trim();
    const a = parseFloat(amount);
    if (!d || !a || a <= 0 || payers.size === 0 || splitAmong.size === 0)
      return;

    if (useCustomPay && !payValid) {
      alert(
        `Payer amounts must add up to ₹${a}. Currently: ₹${customPayTotal.toFixed(2)}`,
      );
      return;
    }
    if (useCustomSplit && !splitValid) {
      alert(
        `Split amounts must add up to ₹${a}. Currently: ₹${customSplitTotal.toFixed(2)}`,
      );
      return;
    }

    let payerAmounts = {};
    if (useCustomPay) {
      [...payers].forEach((id) => {
        payerAmounts[id] = parseFloat(customPayAmts[id]) || 0;
      });
    }

    let splitAmounts = {};
    if (useCustomSplit) {
      [...splitAmong].forEach((id) => {
        splitAmounts[id] = parseFloat(customSplitAmts[id]) || 0;
      });
    }

    const expense = {
      id: Date.now(),
      desc: d,
      amount: a,
      payers: [...payers],
      splitAmong: [...splitAmong],
      emoji,
      date: new Date().toISOString(),
      groupId,
      payerAmounts,
      splitAmounts,
    };
    try {
      await apiFetch("POST", "/expenses", expense, token);
      onAdded(expense);
    } catch (e) {
      alert("Failed to add expense: " + e.message);
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Add Expense</div>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Emoji */}
        <div className="form-group">
          <label className="form-label">Category</label>
          <div className="emoji-select">
            {EMOJIS.map((e) => (
              <div
                key={e}
                className={"emo-opt" + (emoji === e ? " selected" : "")}
                onClick={() => setEmoji(e)}
              >
                {e}
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            ref={descRef}
            className="inp"
            placeholder="What was this for?"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        {/* Amount */}
        <div className="form-group">
          <label className="form-label">Total Amount (₹)</label>
          <input
            className="inp amount-inp"
            type="number"
            placeholder="0"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* PAID BY */}
        <div className="form-group">
          <label className="form-label">
            Paid by{" "}
            <span
              style={{
                color: "var(--muted)",
                textTransform: "none",
                fontSize: "0.75rem",
                fontWeight: 400,
              }}
            >
              (who paid this bill?)
            </span>
          </label>
          <div className="paidby-grid">
            {members.map((m) => (
              <div
                key={m.id}
                className={"paidby-opt" + (payers.has(m.id) ? " selected" : "")}
                onClick={() => togglePayer(m.id)}
              >
                <div
                  className="avatar"
                  style={{
                    width: "22px",
                    height: "22px",
                    fontSize: "10px",
                    background: m.color + "22",
                    color: m.color,
                  }}
                >
                  {m.name[0].toUpperCase()}
                </div>
                {m.name}
              </div>
            ))}
          </div>

          <div className="custom-split-section">
            <label className="custom-toggle">
              <input
                type="checkbox"
                checked={useCustomPay}
                onChange={(e) => setUseCustomPay(e.target.checked)}
              />
              Use custom amounts (e.g. Rahul paid ₹120, Priya paid ₹50)
            </label>

            {useCustomPay && (
              <div className="custom-amounts">
                {[...payers].map((id) => {
                  const m = members.find((m) => m.id === id);
                  if (!m) return null;
                  return (
                    <div key={id} className="ca-row">
                      <div
                        className="avatar"
                        style={{
                          width: "26px",
                          height: "26px",
                          fontSize: "11px",
                          background: m.color + "22",
                          color: m.color,
                          flexShrink: 0,
                        }}
                      >
                        {m.name[0].toUpperCase()}
                      </div>
                      <span className="ca-name">{m.name} paid</span>
                      <input
                        className="ca-inp"
                        type="number"
                        placeholder="0"
                        min="0"
                        value={customPayAmts[id] || ""}
                        onChange={(e) =>
                          setCustomPayAmts((prev) => ({
                            ...prev,
                            [id]: e.target.value,
                          }))
                        }
                      />
                    </div>
                  );
                })}
                <div className="ca-total">
                  <span>Total assigned: ₹{customPayTotal.toFixed(2)}</span>
                  {payValid ? (
                    <span className="ok">✓ Matches ₹{amt.toFixed(2)}</span>
                  ) : (
                    <span className="err">
                      Remaining: ₹{payRemaining.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            )}

            {!useCustomPay && payers.size > 1 && (
              <div className="payer-preview">
                <span>Each payer contributes equally</span>
                <span className="sp-amt">
                  ₹{(amt / payers.size).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* SPLIT AMONG */}
        <div className="form-group">
          <label className="form-label">Split among</label>
          <div className="splitby-grid">
            {members.map((m) => (
              <div
                key={m.id}
                className={
                  "split-opt" + (splitAmong.has(m.id) ? " selected" : "")
                }
                onClick={() => toggleSplit(m.id)}
              >
                <div
                  className="avatar"
                  style={{
                    width: "22px",
                    height: "22px",
                    fontSize: "10px",
                    background: m.color + "22",
                    color: m.color,
                  }}
                >
                  {m.name[0].toUpperCase()}
                </div>
                {m.name}
              </div>
            ))}
          </div>

          <div className="custom-split-section">
            <label className="custom-toggle">
              <input
                type="checkbox"
                checked={useCustomSplit}
                onChange={(e) => setUseCustomSplit(e.target.checked)}
              />
              Use custom amounts (e.g. Rahul owes ₹100, Priya owes ₹70)
            </label>

            {useCustomSplit && (
              <div className="custom-amounts">
                {[...splitAmong].map((id) => {
                  const m = members.find((m) => m.id === id);
                  if (!m) return null;
                  return (
                    <div key={id} className="ca-row">
                      <div
                        className="avatar"
                        style={{
                          width: "26px",
                          height: "26px",
                          fontSize: "11px",
                          background: m.color + "22",
                          color: m.color,
                          flexShrink: 0,
                        }}
                      >
                        {m.name[0].toUpperCase()}
                      </div>
                      <span className="ca-name">{m.name} owes</span>
                      <input
                        className="ca-inp"
                        type="number"
                        placeholder="0"
                        min="0"
                        value={customSplitAmts[id] || ""}
                        onChange={(e) =>
                          setCustomSplitAmts((prev) => ({
                            ...prev,
                            [id]: e.target.value,
                          }))
                        }
                      />
                    </div>
                  );
                })}
                <div className="ca-total">
                  <span>Total assigned: ₹{customSplitTotal.toFixed(2)}</span>
                  {splitValid ? (
                    <span className="ok">✓ Matches ₹{amt.toFixed(2)}</span>
                  ) : (
                    <span className="err">
                      Remaining: ₹{splitRemaining.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            )}

            {!useCustomSplit && (
              <div className="split-preview">
                <span>Each person owes equally</span>
                <span className="sp-amt">
                  ₹
                  {splitAmong.size > 0
                    ? (amt / splitAmong.size).toFixed(2)
                    : "0.00"}
                </span>
              </div>
            )}
          </div>
        </div>

        <button className="btn submit-btn" onClick={submit}>
          Add Expense
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
//  EXPENSES TAB
// ════════════════════════════════════════════
function ExpensesTab({ expenses, members, token, setExpenses, isViewer }) {
  const memberById = (id) => members.find((m) => m.id === id);

  async function deleteExpense(expId) {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await apiFetch("DELETE", "/expenses/" + expId, null, token);
      setExpenses((prev) => prev.filter((e) => e.id !== expId));
    } catch (e) {
      alert("Failed to delete expense: " + e.message);
    }
  }

  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🧾</div>
        <h3>No expenses yet</h3>
        <p
          style={{
            color: "var(--muted)",
            fontSize: "0.9rem",
            marginTop: "0.5rem",
          }}
        >
          {isViewer
            ? "No expenses have been added to this group yet."
            : "Tap the + button to add your first expense"}
        </p>
      </div>
    );
  }

  return (
    <div>
      {[...expenses].reverse().map((exp) => {
        const payerNames = exp.payers
          .map((id) => memberById(id)?.name || "")
          .filter(Boolean)
          .join(" & ");
        const splitNames = exp.splitAmong
          .map((id) => memberById(id)?.name || "")
          .filter(Boolean);

        const hasCustomPay =
          exp.payerAmounts && Object.keys(exp.payerAmounts).length > 0;
        const hasCustomSplit =
          exp.splitAmounts && Object.keys(exp.splitAmounts).length > 0;

        return (
          <div key={exp.id} className="expense-card">
            <div className="exp-icon">{exp.emoji}</div>
            <div className="exp-body">
              <div className="exp-desc">{exp.desc}</div>
              <div className="exp-meta">
                <span>
                  Paid by{" "}
                  <span className="paid-by">
                    {hasCustomPay
                      ? exp.payers
                          .map((id) => {
                            const m = memberById(id);
                            return m
                              ? `${m.name} (₹${exp.payerAmounts[id]})`
                              : "";
                          })
                          .filter(Boolean)
                          .join(" & ")
                      : payerNames}
                  </span>
                </span>
                <span>·</span>
                <span>
                  {new Date(exp.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
              <div className="exp-split-chips">
                {hasCustomSplit
                  ? exp.splitAmong.map((id) => {
                      const m = memberById(id);
                      return m ? (
                        <span key={id} className="split-chip">
                          {m.name} ₹{exp.splitAmounts[id]}
                        </span>
                      ) : null;
                    })
                  : splitNames.map((n, i) => (
                      <span key={i} className="split-chip">
                        {n}
                      </span>
                    ))}
              </div>
            </div>
            <div className="exp-actions">
              <div className="exp-amount">
                ₹{exp.amount.toLocaleString("en-IN")}
              </div>
              {!isViewer && (
                <button
                  className="btn-delete-exp"
                  onClick={() => deleteExpense(exp.id)}
                >
                  🗑 Delete
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════
//  BALANCES TAB
// ════════════════════════════════════════════
function BalancesTab({ members, expenses, payments }) {
  const bal = calcBalances(members, expenses, payments);
  const vals = Object.values(bal);
  const maxAbs = Math.max(...vals.map(Math.abs), 1);

  return (
    <div>
      {members
        .filter((m) => bal[m.id] !== undefined)
        .map((m) => {
          const b = bal[m.id] || 0;
          const pct = (Math.abs(b) / maxAbs) * 100;
          const cls =
            b > 0.01 ? "positive" : b < -0.01 ? "negative" : "neutral";
          const label = b > 0.01 ? "gets back" : b < -0.01 ? "owes" : "settled";
          const barColor =
            b > 0.01
              ? "var(--success)"
              : b < -0.01
                ? "var(--danger)"
                : "var(--muted)";
          return (
            <div key={m.id} className="balance-card">
              <div
                className="avatar bal-avatar"
                style={{ background: m.color + "22", color: m.color }}
              >
                {m.name[0].toUpperCase()}
              </div>
              <div className="bal-info">
                <div className="bal-name">{m.name}</div>
                <div className="bal-bar-wrap">
                  <div
                    className="bal-bar"
                    style={{ width: `${pct}%`, background: barColor }}
                  />
                </div>
              </div>
              <div>
                <div className={"bal-amount " + cls}>
                  ₹{Math.abs(b).toFixed(0)}
                </div>
                <div className={"bal-label " + cls}>{label}</div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

// ════════════════════════════════════════════
//  SETTLE TAB
// ════════════════════════════════════════════
function SettleTab({
  members,
  expenses,
  payments,
  setPayments,
  token,
  groupId,
  setExpenses,
  isViewer,
}) {
  const [settling, setSettling] = useState(null);
  const bal = calcBalances(members, expenses, payments);
  const txns = minimizeTransactions(bal);
  const memberById = (id) => members.find((m) => m.id === id);

  async function markSettled(t) {
    if (isViewer) {
      alert("Viewers cannot record payments.");
      return;
    }
    const key = txnKey(t);
    if (settling === key) return;
    setSettling(key);
    try {
      await apiFetch(
        "POST",
        "/settled",
        { fromId: t.from, toId: t.to, amount: t.amount, groupId },
        token,
      );
      const newPayments = [
        ...payments,
        { fromId: t.from, toId: t.to, amount: t.amount },
      ];
      setPayments(newPayments);
    } catch (e) {
      alert("Failed to mark as settled: " + e.message);
    } finally {
      setSettling(null);
    }
  }

  if (txns.length === 0) {
    return (
      <div className="all-settled">
        <div className="as-icon">🎉</div>
        <h3>Everyone's settled!</h3>
        <p>
          No pending transactions. Add some expenses to calculate settlements.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="settle-header">
        <div className="sh-icon">⚡</div>
        <div className="sh-text">
          Optimized to{" "}
          <strong>
            {txns.length} transaction{txns.length > 1 ? "s" : ""}
          </strong>{" "}
          using minimum cash flow algorithm.
        </div>
      </div>
      {txns.map((t) => {
        const from = memberById(t.from);
        const to = memberById(t.to);
        const key = txnKey(t);
        const busy = settling === key;
        return (
          <div key={key} className="txn-card">
            <div className="txn-from-to">
              <div className="txn-person">
                <div
                  className="avatar"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    background: from.color + "22",
                    color: from.color,
                  }}
                >
                  {from.name[0].toUpperCase()}
                </div>
                <span className="t-name">{from.name}</span>
              </div>
              <span className="txn-arrow">→</span>
              <div className="txn-person">
                <div
                  className="avatar"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    background: to.color + "22",
                    color: to.color,
                  }}
                >
                  {to.name[0].toUpperCase()}
                </div>
                <span className="t-name">{to.name}</span>
              </div>
            </div>
            <div className="txn-right">
              <div className="txn-amount">₹{t.amount.toFixed(0)}</div>
              {!isViewer && (
                <>
                  <button
                    className="phonepe-btn"
                    onClick={() =>
                      window.open("https://www.phonepe.com", "_blank")
                    }
                  >
                    💜 PhonePe
                  </button>
                  <button
                    className={"settle-btn" + (busy ? " done" : "")}
                    onClick={() => !busy && markSettled(t)}
                  >
                    {busy ? "⏳" : "Mark done"}
                  </button>
                </>
              )}
              {isViewer && (
                <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                  Pending
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════
//  MEMBERS TAB
// ════════════════════════════════════════════
function MembersTab({
  members,
  setMembers,
  token,
  groupId,
  admins,
  setAdmins,
  currentAdminEmail,
  isViewer,
  expenses,
  payments,
}) {
  const [addInput, setAddInput] = useState("");
  const [adminInput, setAdminInput] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminErr, setAdminErr] = useState("");
  const [adminOk, setAdminOk] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);

  const [viewerEmail, setViewerEmail] = useState("");
  const [viewerPass, setViewerPass] = useState("");
  const [viewerErr, setViewerErr] = useState("");
  const [viewerOk, setViewerOk] = useState("");
  const [addingViewer, setAddingViewer] = useState(false);
  const [viewers, setViewers] = useState([]);

  // Promote member to admin
  const [promoteModal, setPromoteModal] = useState(null); // { memberId, memberName }
  const [promoteEmail, setPromoteEmail] = useState("");
  const [promotePass, setPromotePass] = useState("");
  const [promoteErr, setPromoteErr] = useState("");
  const [promoting, setPromoting] = useState(false);

  useEffect(() => {
    if (!isViewer) {
      apiFetch("GET", "/viewers/" + groupId, null, token)
        .then((d) => setViewers(d.viewers || []))
        .catch(() => {});
    }
  }, [groupId, token, isViewer]);

  async function addMember() {
    const name = addInput.trim();
    if (
      !name ||
      members.find((m) => m.name.toLowerCase() === name.toLowerCase())
    )
      return;
    const id = Date.now() + Math.floor(Math.random() * 1000000);
    const color = COLORS[members.length % COLORS.length];
    try {
      await apiFetch("POST", "/members", { id, name, color, groupId }, token);
      setMembers((prev) => [...prev, { id, name, color, groupId }]);
      setAddInput("");
    } catch (e) {
      alert("Failed to add member: " + e.message);
    }
  }

  async function removeMember(id) {
    // Block removal if member is involved in any expense
    const hasPendingExpense = expenses.some(
      (e) => e.payers.includes(id) || e.splitAmong.includes(id),
    );
    if (hasPendingExpense) {
      alert(
        "Cannot remove this member — they are involved in one or more expenses. Delete those expenses first.",
      );
      return;
    }
    // Also block if member has unsettled balance
    const bal = calcBalances(members, expenses, payments);
    if (bal[id] !== undefined && Math.abs(bal[id]) > 0.01) {
      alert(
        "Cannot remove this member — they have an unsettled balance. Settle up first.",
      );
      return;
    }
    if (!window.confirm("Remove this member from the group?")) return;
    try {
      await apiFetch("DELETE", "/members/" + id, null, token);
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      alert("Failed to remove member: " + e.message);
    }
  }

  async function addAdmin() {
    setAdminErr("");
    setAdminOk("");
    if (!adminInput || !adminPass) {
      setAdminErr("Email and password are required.");
      return;
    }
    const pwErr = validatePassword(adminPass);
    if (pwErr) {
      setAdminErr(pwErr);
      return;
    }
    setAddingAdmin(true);
    try {
      await apiFetch(
        "POST",
        "/auth/register",
        { email: adminInput, password: adminPass },
        token,
      );
      const fresh = await apiFetch("GET", "/admins", null, token);
      setAdmins(fresh.admins || []);
      setAdminInput("");
      setAdminPass("");
      setAdminOk("Admin added successfully!");
    } catch (e) {
      setAdminErr(e.message);
    } finally {
      setAddingAdmin(false);
    }
  }

  async function removeAdmin(id) {
    if (!window.confirm("Remove this admin account?")) return;
    try {
      await apiFetch("DELETE", "/admins/" + id, null, token);
      const fresh = await apiFetch("GET", "/admins", null, token);
      setAdmins(fresh.admins || []);
    } catch (e) {
      alert("Failed to remove admin: " + e.message);
    }
  }

  async function addViewer() {
    setViewerErr("");
    setViewerOk("");
    if (!viewerEmail || !viewerPass) {
      setViewerErr("Email and password are required.");
      return;
    }
    const pwErr = validatePassword(viewerPass);
    if (pwErr) {
      setViewerErr(pwErr);
      return;
    }
    setAddingViewer(true);
    try {
      await apiFetch(
        "POST",
        "/auth/register-viewer",
        { email: viewerEmail, password: viewerPass, groupId },
        token,
      );
      const fresh = await apiFetch("GET", "/viewers/" + groupId, null, token);
      setViewers(fresh.viewers || []);
      setViewerEmail("");
      setViewerPass("");
      setViewerOk("Viewer added! They can now log in and view this group.");
    } catch (e) {
      setViewerErr(e.message);
    } finally {
      setAddingViewer(false);
    }
  }

  async function removeViewer(id) {
    if (!window.confirm("Remove this viewer account?")) return;
    try {
      await apiFetch("DELETE", "/viewers/" + id, null, token);
      const fresh = await apiFetch("GET", "/viewers/" + groupId, null, token);
      setViewers(fresh.viewers || []);
    } catch (e) {
      alert("Failed to remove viewer: " + e.message);
    }
  }

  async function promoteToAdmin() {
    setPromoteErr("");
    if (!promoteEmail || !promotePass) {
      setPromoteErr("Email and password are required.");
      return;
    }
    const pwErr = validatePassword(promotePass);
    if (pwErr) { setPromoteErr(pwErr); return; }
    setPromoting(true);
    try {
      await apiFetch(
        "POST",
        "/members/" + promoteModal.memberId + "/promote",
        { email: promoteEmail, password: promotePass },
        token,
      );
      const fresh = await apiFetch("GET", "/admins", null, token);
      setAdmins(fresh.admins || []);
      setPromoteModal(null);
      setPromoteEmail("");
      setPromotePass("");
    } catch (e) {
      setPromoteErr(e.message);
    } finally {
      setPromoting(false);
    }
  }

  return (
    <div>
      {/* Group Members */}
      <h3 className="section-label">Group Members</h3>
      {members.map((m) => (
        <div key={m.id} className="member-row">
          <div
            className="avatar"
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              fontSize: "14px",
              background: m.color + "22",
              color: m.color,
            }}
          >
            {m.name[0].toUpperCase()}
          </div>
          <span className="m-name">{m.name}</span>
          {!isViewer && (
            <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
              <button
                className="btn-outline"
                style={{ padding: "5px 10px", fontSize: "0.75rem", borderRadius: "8px" }}
                onClick={() => {
                  setPromoteModal({ memberId: m.id, memberName: m.name });
                  setPromoteEmail("");
                  setPromotePass("");
                  setPromoteErr("");
                }}
                title="Give this member admin access"
              >
                ⬆ Admin
              </button>
              <button
                className="btn-remove-member"
                onClick={() => removeMember(m.id)}
              >
                ✕ Remove
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Promote to Admin Modal */}
      {promoteModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setPromoteModal(null)}>
          <div className="modal" style={{ borderRadius: "20px" }}>
            <div className="modal-header">
              <div className="modal-title">Promote {promoteModal.memberName} to Admin</div>
              <button className="close-btn" onClick={() => setPromoteModal(null)}>✕</button>
            </div>
            <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginBottom: "1.25rem", lineHeight: 1.5 }}>
              Create admin credentials for <strong style={{ color: "var(--text)" }}>{promoteModal.memberName}</strong>.
              They will be able to log in and manage all groups.
            </p>
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <input
                className="inp"
                type="email"
                placeholder="their@email.com"
                value={promoteEmail}
                onChange={(e) => setPromoteEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="inp"
                type="password"
                placeholder="8+ chars, uppercase, number, special"
                value={promotePass}
                onChange={(e) => setPromotePass(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && promoteToAdmin()}
              />
              <p className="pw-hint">Min 8 chars · 1 uppercase · 1 number · 1 special character</p>
            </div>
            {promoteErr && <div className="login-err">{promoteErr}</div>}
            <div style={{ display: "flex", gap: "10px", marginTop: "0.5rem" }}>
              <button className="btn-outline" onClick={() => setPromoteModal(null)} style={{ flex: 1 }}>Cancel</button>
              <button className="btn" onClick={promoteToAdmin} disabled={promoting} style={{ flex: 2 }}>
                {promoting ? "Promoting..." : `⬆ Make ${promoteModal.memberName} an Admin`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add member (admin only) */}
      {!isViewer && (
        <div className="input-row" style={{ marginTop: "12px" }}>
          <input
            className="inp"
            placeholder="Add a new member..."
            maxLength={20}
            value={addInput}
            onChange={(e) => setAddInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addMember()}
          />
          <button className="btn" onClick={addMember}>
            Add
          </button>
        </div>
      )}

      {/* Viewers (admin only) */}
      {!isViewer && (
        <div className="admin-section">
          <h2>
            👁 Viewer Accounts{" "}
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--muted)",
                fontWeight: 400,
              }}
            >
              — read-only access to this group
            </span>
          </h2>
          {viewers.length > 0 && (
            <div className="admin-list">
              {viewers.map((v) => (
                <div key={v.id} className="admin-item">
                  <span style={{ fontSize: "16px" }}>👁</span>
                  <span className="admin-email">{v.email}</span>
                  <button
                    className="btn-remove-admin"
                    onClick={() => removeViewer(v.id)}
                  >
                    ✕ Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="form-group" style={{ marginBottom: "10px" }}>
            <input
              className="inp"
              type="email"
              placeholder="Viewer email"
              value={viewerEmail}
              onChange={(e) => setViewerEmail(e.target.value)}
            />
          </div>
          <div className="input-row">
            <input
              className="inp"
              type="password"
              placeholder="Password (8+ chars, 1 uppercase, 1 number, 1 special)"
              value={viewerPass}
              onChange={(e) => setViewerPass(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addViewer()}
            />
            <button className="btn" onClick={addViewer} disabled={addingViewer}>
              {addingViewer ? "..." : "Add"}
            </button>
          </div>
          {viewerErr && (
            <div className="login-err" style={{ marginTop: "8px" }}>
              {viewerErr}
            </div>
          )}
          {viewerOk && (
            <div className="login-success" style={{ marginTop: "8px" }}>
              {viewerOk}
            </div>
          )}
        </div>
      )}

      {/* Admin Management (admin only) */}
      {!isViewer && (
        <div className="admin-section">
          <h2>Admin Accounts</h2>
          <div className="admin-list">
            {admins.map((a) => (
              <div key={a.id} className="admin-item">
                <span style={{ fontSize: "16px" }}>🔐</span>
                <span className="admin-email">{a.email}</span>
                {a.email === currentAdminEmail ? (
                  <span className="admin-you">You</span>
                ) : (
                  <button
                    className="btn-remove-admin"
                    onClick={() => removeAdmin(a.id)}
                  >
                    ✕ Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="form-group" style={{ marginBottom: "10px" }}>
            <input
              className="inp"
              type="email"
              placeholder="New admin email"
              value={adminInput}
              onChange={(e) => setAdminInput(e.target.value)}
            />
          </div>
          <div className="input-row">
            <input
              className="inp"
              type="password"
              placeholder="Password (8+ chars, 1 uppercase, 1 number, 1 special)"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addAdmin()}
            />
            <button className="btn" onClick={addAdmin} disabled={addingAdmin}>
              {addingAdmin ? "..." : "Add"}
            </button>
          </div>
          {adminErr && (
            <div className="login-err" style={{ marginTop: "8px" }}>
              {adminErr}
            </div>
          )}
          {adminOk && (
            <div className="login-success" style={{ marginTop: "8px" }}>
              {adminOk}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════
//  APP SCREEN (main dashboard)
// ════════════════════════════════════════════
function AppScreen({
  members,
  setMembers,
  expenses,
  setExpenses,
  payments,
  setPayments,
  token,
  groupId,
  groupName,
  onDissolve,
  onSwitchGroup,
  admins,
  setAdmins,
  currentAdminEmail,
  isViewer,
}) {
  const [light, toggleTheme] = useTheme();
  const [activeTab, setActiveTab] = useState("expenses");
  const [modalOpen, setModalOpen] = useState(false);

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const bal = calcBalances(members, expenses, payments);
  const txns = minimizeTransactions(bal);

  function handleAdded(expense) {
    setExpenses((prev) => [...prev, expense]);
    setModalOpen(false);
  }

  return (
    <div id="app-screen" className="screen">
      {/* Topbar */}
      <div className="topbar">
        <div className="topbar-left">
          <div className="topbar-logo">
            Split<span>Smart</span>
          </div>
          <div className="group-pill">
            {groupName} · {members.length} people
          </div>
          {isViewer && <div className="viewer-badge">👁 Viewer</div>}
        </div>
        <div className="topbar-right">
          <div className="topbar-stat">
            <div className="big">₹{total.toLocaleString("en-IN")}</div>
            <div className="sm">total expenses</div>
          </div>
          <ThemeToggle light={light} onToggle={toggleTheme} />
          {!isViewer && (
            <>
              <button className="btn-switch-group" onClick={onSwitchGroup}>
                ⇄ Groups
              </button>
              <button className="btn-dissolve" onClick={onDissolve}>
                🗑 Dissolve
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {[
          {
            id: "expenses",
            label: "Expenses",
            badge: expenses.length,
            badgeColor: "var(--accent)",
          },
          { id: "balances", label: "Balances" },
          {
            id: "settle",
            label: "Settle Up",
            badge: txns.length,
            badgeColor: "var(--warn)",
          },
          { id: "members", label: "Members" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={"tab" + (activeTab === tab.id ? " active" : "")}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.badge > 0 && (
              <span
                className="tab-badge"
                style={{ background: tab.badgeColor }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        className={"tab-content" + (activeTab === "expenses" ? " active" : "")}
      >
        <ExpensesTab
          expenses={expenses}
          members={members}
          token={token}
          setExpenses={setExpenses}
          isViewer={isViewer}
        />
      </div>
      <div
        className={"tab-content" + (activeTab === "balances" ? " active" : "")}
      >
        <BalancesTab
          members={members}
          expenses={expenses}
          payments={payments}
        />
      </div>
      <div
        className={"tab-content" + (activeTab === "settle" ? " active" : "")}
      >
        <SettleTab
          members={members}
          expenses={expenses}
          payments={payments}
          setPayments={setPayments}
          token={token}
          groupId={groupId}
          setExpenses={setExpenses}
          isViewer={isViewer}
        />
      </div>
      <div
        className={"tab-content" + (activeTab === "members" ? " active" : "")}
      >
        <MembersTab
          members={members}
          setMembers={setMembers}
          token={token}
          groupId={groupId}
          admins={admins}
          setAdmins={setAdmins}
          currentAdminEmail={currentAdminEmail}
          isViewer={isViewer}
          expenses={expenses}
          payments={payments}
        />
      </div>

      {/* FAB */}
      {!isViewer && (
        <button
          className="fab"
          onClick={() => setModalOpen(true)}
          title="Add Expense"
        >
          +
        </button>
      )}

      {/* Modal */}
      {modalOpen && (
        <ExpenseModal
          members={members}
          token={token}
          groupId={groupId}
          onAdded={handleAdded}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════
//  ROOT APP
// ════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("login");
  const [token, setToken] = useState(null);
  const [role, setRole] = useState("admin");
  const [groupId, setGroupId] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [currentAdminEmail, setCurrentAdminEmail] = useState("");

  // Inject global CSS once
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Inject orbs once
  useEffect(() => {
    const orb1 = document.createElement("div");
    orb1.className = "orb orb1";
    const orb2 = document.createElement("div");
    orb2.className = "orb orb2";
    document.body.prepend(orb2);
    document.body.prepend(orb1);
    return () => {
      orb1.remove();
      orb2.remove();
    };
  }, []);

  async function afterLogin(tok, email, userRole, viewerGroupId) {
    setToken(tok);
    setRole(userRole);
    setCurrentAdminEmail(email || "");

    try {
      if (userRole === "viewer") {
        const [dashboard] = await Promise.all([
          apiFetch("GET", "/dashboard?groupId=" + viewerGroupId, null, tok),
        ]);
        setGroupId(viewerGroupId);
        setGroupName("Group");
        setMembers(dashboard.members);
        setExpenses(dashboard.expenses);
        setPayments(dashboard.payments || []);
        setScreen("app");
      } else {
        setScreen("groups");
      }
    } catch (e) {
      alert("Failed to load data: " + e.message);
    }
  }

  async function selectGroup(gid, gname, isNew) {
    setGroupId(gid);
    setGroupName(gname);
    try {
      const [dashboard, adminData] = await Promise.all([
        apiFetch("GET", "/dashboard?groupId=" + gid, null, token),
        apiFetch("GET", "/admins", null, token),
      ]);
      setMembers(dashboard.members);
      setExpenses(dashboard.expenses);
      setPayments(dashboard.payments || []);
      setAdmins(adminData.admins || []);

      if (dashboard.members.length >= 2) {
        setScreen("app");
      } else {
        setScreen("setup");
      }
    } catch (e) {
      alert("Failed to load group: " + e.message);
    }
  }

  async function startApp() {
    const dashboard = await apiFetch(
      "GET",
      "/dashboard?groupId=" + groupId,
      null,
      token,
    );
    setExpenses(dashboard.expenses);
    setPayments(dashboard.payments || []);
    setScreen("app");
  }

  async function dissolveGroup() {
    if (
      !window.confirm(
        `Dissolve "${groupName}"? This will permanently delete all members and expenses.`,
      )
    )
      return;
    try {
      await apiFetch("DELETE", "/group/" + groupId, null, token);
      setMembers([]);
      setExpenses([]);
      setPayments([]);
      setGroupId(null);
      setGroupName("");
      setScreen("groups");
    } catch (e) {
      alert("Failed to dissolve group: " + e.message);
    }
  }

  const isViewer = role === "viewer";

  if (screen === "login") return <LoginScreen onLogin={afterLogin} />;
  if (screen === "groups")
    return <GroupSelectorScreen token={token} onSelectGroup={selectGroup} />;
  if (screen === "setup")
    return (
      <SetupScreen
        members={members}
        setMembers={setMembers}
        token={token}
        groupId={groupId}
        groupName={groupName}
        onStart={startApp}
      />
    );
  return (
    <AppScreen
      members={members}
      setMembers={setMembers}
      expenses={expenses}
      setExpenses={setExpenses}
      payments={payments}
      setPayments={setPayments}
      token={token}
      groupId={groupId}
      groupName={groupName}
      onDissolve={dissolveGroup}
      onSwitchGroup={() => setScreen("groups")}
      admins={admins}
      setAdmins={setAdmins}
      currentAdminEmail={currentAdminEmail}
      isViewer={isViewer}
    />
  );
}
