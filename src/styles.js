export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=Hanken+Grotesk:wght@400;500;600;700&display=swap');
*{box-sizing:border-box; -webkit-tap-highlight-color:transparent}
:root{ --safe-top:env(safe-area-inset-top,0px); --safe-bottom:env(safe-area-inset-bottom,0px); --nav-h:74px; }
.gt{font-family:'Hanken Grotesk',system-ui,sans-serif; color:var(--text); width:100%; height:100vh; height:100dvh;
  background:var(--bg); display:flex; justify-content:center; transition:background .3s; overflow:hidden}
.shell{width:100%; max-width:480px; height:100%; background:var(--app); position:relative;
  box-shadow:0 0 80px rgba(0,0,0,.14); display:flex; flex-direction:column; transition:background .3s; overflow:hidden}
.main{flex:1; display:flex; flex-direction:column; min-width:0; min-height:0; position:relative}
.scroll{flex:1; overflow-y:auto; -webkit-overflow-scrolling:touch; overscroll-behavior:contain}
.content{padding:0 16px calc(var(--nav-h) + var(--safe-bottom) + 24px)}
.sidebar{display:none}
.topbar{display:none}
.disp{font-family:'Bricolage Grotesque',sans-serif}
h1,h2,h3{font-family:'Bricolage Grotesque',sans-serif; margin:0}

.hdr{display:flex; align-items:center; gap:11px; padding:calc(var(--safe-top) + 16px) 16px 12px; position:sticky; top:0; z-index:20;
  background:linear-gradient(180deg,var(--app) 82%,transparent)}
.avt{width:44px; height:44px; border-radius:15px; background:var(--hero); color:var(--hero-text); display:grid; place-items:center;
  font-family:'Bricolage Grotesque'; font-weight:700; font-size:16px; flex-shrink:0; overflow:hidden}
.avt.sm{width:30px; height:30px; border-radius:9px; font-size:11px}
.avt.lg{width:62px; height:62px; border-radius:20px; font-size:22px}
.hi{flex:1; min-width:0}
.hi .hello{font-size:13px; color:var(--muted); font-weight:600}
.hi .name{font-family:'Bricolage Grotesque'; font-size:22px; font-weight:700; line-height:1.05; margin-top:1px}
.ico-btn{width:44px; height:44px; border-radius:15px; background:var(--card); box-shadow:var(--shadow-sm); display:grid; place-items:center;
  color:var(--ink); cursor:pointer; position:relative; border:none; flex-shrink:0; transition:.15s}
.ico-btn:active{transform:scale(.93)}
.ico-btn.sq{width:34px; height:34px; border-radius:11px}
.ndot{position:absolute; top:-3px; right:-3px; min-width:18px; height:18px; padding:0 4px; border-radius:9px;
  background:var(--accent); color:var(--accent-ink); font-size:10px; font-weight:800; display:grid; place-items:center; border:2px solid var(--app)}

.card{background:var(--card); border-radius:22px; box-shadow:var(--shadow-sm); padding:16px}
.hero{background:var(--hero); color:var(--hero-text); border-radius:26px; padding:20px; position:relative; overflow:hidden}
.hero::after{content:''; position:absolute; right:-50px; top:-50px; width:170px; height:170px; border-radius:50%;
  background:radial-gradient(circle,color-mix(in srgb,var(--accent) 26%,transparent),transparent 70%)}
.sec-h{display:flex; align-items:center; justify-content:space-between; margin:22px 4px 12px}
.sec-h h2{font-size:17px; font-weight:700}
.sec-h .link{font-size:13px; color:var(--muted); font-weight:700; cursor:pointer; display:flex; align-items:center; gap:3px}

/* VISUALIZER */
.viz{position:relative; background:var(--hero); border-radius:26px; padding:18px 0 14px; overflow:hidden; margin-bottom:6px}
.viz::before{content:''; position:absolute; left:-40px; bottom:-60px; width:180px; height:180px; border-radius:50%;
  background:radial-gradient(circle,color-mix(in srgb,var(--accent) 16%,transparent),transparent 70%)}
.viz-top{display:flex; align-items:center; justify-content:space-between; padding:0 18px 14px}
.viz-sel{color:var(--hero-text)}
.viz-sel .lab{font-family:'Bricolage Grotesque'; font-size:18px; font-weight:700; line-height:1}
.viz-sel .cnt{font-size:12.5px; color:rgba(255,255,255,.55); font-weight:600; margin-top:3px}
.seg-modes{display:flex; gap:4px; background:rgba(255,255,255,.08); border-radius:12px; padding:3px}
.seg-modes button{border:none; background:none; color:rgba(255,255,255,.6); font-family:'Hanken Grotesk'; font-weight:700; font-size:12px;
  padding:6px 11px; border-radius:9px; cursor:pointer; transition:.15s}
.seg-modes button.on{background:var(--accent); color:var(--accent-ink)}
.bars{display:flex; align-items:flex-end; height:118px; overflow-x:auto; scroll-snap-type:x mandatory; padding:0 calc(50% - 17px);
  scrollbar-width:none; position:relative; z-index:2}
.bars::-webkit-scrollbar{display:none}
.barwrap{flex:0 0 34px; scroll-snap-align:center; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; height:100%; cursor:pointer}
.bar{width:18px; border-radius:6px 6px 4px 4px; background:var(--olive); transition:height .35s,background .25s,width .2s; min-height:6px}
.bar.on{background:var(--accent)}
.bar.sel{width:24px; box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 22%,transparent)}
.bar-n{font-family:'Bricolage Grotesque'; font-size:10px; font-weight:700; color:rgba(255,255,255,.4); margin-bottom:4px; height:12px}
.bar-n.show{color:var(--hero-text)}
.bar-x{font-size:9.5px; font-weight:700; color:rgba(255,255,255,.35); margin-top:7px; text-align:center; line-height:1.15; height:22px}
.bar-x.sel{color:var(--hero-text)}
.viz-mid{position:absolute; left:50%; top:46px; bottom:34px; width:2px; transform:translateX(-50%); z-index:1;
  background:linear-gradient(180deg,transparent,color-mix(in srgb,var(--accent) 50%,transparent),transparent)}
.viz-mid::after{content:''; position:absolute; bottom:-6px; left:50%; transform:translateX(-50%); width:6px; height:6px; border-radius:50%; background:var(--accent)}

.pillrow{display:flex; gap:10px; overflow-x:auto; padding:2px 0 4px; scrollbar-width:none; margin-bottom:4px}
.pillrow::-webkit-scrollbar{display:none}
.spill{flex:0 0 auto; background:var(--card); box-shadow:var(--shadow-sm); border-radius:18px; padding:13px 17px; display:flex; align-items:center; gap:11px; cursor:pointer; transition:.15s}
.spill:active{transform:scale(.97)}
.spill.accent{background:var(--accent)} .spill.accent .k{color:color-mix(in srgb,var(--accent-ink) 70%,transparent)} .spill.accent .v,.spill.accent .ic2{color:var(--accent-ink)}
.spill.olive{background:var(--olive)} .spill.olive .k{color:color-mix(in srgb,var(--olive-text) 65%,transparent)} .spill.olive .v,.spill.olive .ic2{color:var(--olive-text)}
.spill .v{font-family:'Bricolage Grotesque'; font-size:26px; font-weight:700; line-height:1}
.spill .k{font-size:12px; font-weight:600; color:var(--muted); white-space:nowrap}

.chip{font-size:11px; font-weight:700; padding:4px 10px; border-radius:999px; white-space:nowrap; display:inline-flex; align-items:center; gap:5px;
  color:var(--cc); background:color-mix(in srgb,var(--cc) 15%,transparent)}
.dept-dot{width:8px; height:8px; border-radius:50%; flex-shrink:0}
.prio{font-size:10.5px; font-weight:700; padding:3px 8px; border-radius:7px; color:var(--muted); background:var(--line)}
.prio.Urgent{color:#dc2626; background:color-mix(in srgb,#ef4444 13%,transparent)}
.prio.High{color:#c2740a; background:color-mix(in srgb,#f4a52a 15%,transparent)}
.pill-tabs{display:flex; gap:7px; overflow-x:auto; padding-bottom:2px; scrollbar-width:none; margin-bottom:14px}
.pill-tabs::-webkit-scrollbar{display:none}
.ptab{flex:0 0 auto; padding:9px 16px; border-radius:999px; font-size:13px; font-weight:700; cursor:pointer;
  background:var(--card); box-shadow:var(--shadow-sm); color:var(--muted); transition:.15s; display:flex; align-items:center; gap:6px}
.ptab.on{background:var(--hero); color:var(--hero-text)}
.ptab .tb{font-size:10px; padding:1px 6px; border-radius:8px; background:var(--accent); color:var(--accent-ink)}

.jc{background:var(--card); border-radius:20px; box-shadow:var(--shadow-sm); padding:15px; margin-bottom:11px; animation:rise .3s ease both}
@keyframes rise{from{opacity:0; transform:translateY(7px)}to{opacity:1; transform:none}}
.jc .r1{display:flex; align-items:center; gap:8px; margin-bottom:9px}
.jno{font-family:'Bricolage Grotesque'; font-weight:700; font-size:13px; color:var(--muted)}
.jc .ttl{font-family:'Bricolage Grotesque'; font-size:16.5px; font-weight:700; line-height:1.18}
.jc .sub{font-size:12.5px; color:var(--muted); margin-top:2px}
.pjtag{font-size:10.5px; font-weight:700; padding:2px 8px; border-radius:7px; display:inline-flex; align-items:center; gap:4px; margin-top:8px;
  color:var(--cc); background:color-mix(in srgb,var(--cc) 13%,transparent)}
.jc .meta{display:flex; flex-wrap:wrap; gap:14px; margin-top:11px; padding-top:11px; border-top:1px solid var(--line)}
.jc .meta .it{display:flex; flex-direction:column; gap:1px}
.jc .meta .lab{font-size:10px; text-transform:uppercase; letter-spacing:.04em; color:var(--faint); font-weight:700}
.jc .meta .val{font-size:13px; font-weight:600}
.assignee{display:inline-flex; align-items:center; gap:6px; font-size:12.5px; font-weight:600; color:var(--text)}

.acts{display:flex; flex-wrap:wrap; gap:8px; margin-top:12px}
.btn{display:inline-flex; align-items:center; justify-content:center; gap:7px; padding:10px 15px; border-radius:14px;
  font-family:'Hanken Grotesk'; font-weight:700; font-size:13.5px; cursor:pointer; border:none; background:var(--line); color:var(--text); transition:.15s}
.btn:active{transform:scale(.97)} .btn:disabled{opacity:.45}
.btn.primary{background:var(--accent); color:var(--accent-ink)}
.btn.dark{background:var(--hero); color:var(--hero-text)}
.btn.go{background:color-mix(in srgb,#f4a52a 16%,transparent); color:#b9740a}
.btn.ok{background:color-mix(in srgb,#5fa83a 17%,transparent); color:#3f7d22}
.btn.info{background:color-mix(in srgb,#3b82f6 14%,transparent); color:#2563eb}
.btn.danger{background:color-mix(in srgb,#ef4444 13%,transparent); color:#dc2626}
.btn.ghost{background:transparent; box-shadow:inset 0 0 0 1.5px var(--line2)}
.btn.sm{padding:8px 12px; font-size:12.5px; border-radius:11px}
.btn.block{width:100%}

.bnav{position:absolute; bottom:0; left:0; right:0; min-height:var(--nav-h); padding:0 4px calc(var(--safe-bottom) + 8px); background:var(--card);
  border-top:1px solid var(--line); display:flex; align-items:center; justify-content:space-around; z-index:24; box-shadow:0 -4px 20px rgba(0,0,0,.05)}
.bn{flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; padding:10px 0 4px; color:var(--faint); cursor:pointer;
  font-size:10px; font-weight:700; background:none; border:none; transition:.15s; position:relative; min-width:0}
.bn.on{color:var(--ink)}
.bn .bdot{position:absolute; top:5px; right:calc(50% - 16px); width:7px; height:7px; border-radius:50%; background:var(--accent); border:1.5px solid var(--card)}
.bn-fab{flex:0 0 auto; width:58px; height:58px; margin:0 6px -14px; border-radius:50%; background:var(--accent); color:var(--accent-ink);
  border:4px solid var(--app); display:grid; place-items:center; cursor:pointer; box-shadow:0 8px 22px color-mix(in srgb,var(--accent) 55%,transparent); transition:.15s}
.bn-fab:active{transform:scale(.9)}

.empty{text-align:center; padding:38px 16px; color:var(--faint)}
.empty .e-ic{width:54px; height:54px; border-radius:18px; background:var(--card); box-shadow:var(--shadow-sm); display:grid; place-items:center; margin:0 auto 12px; color:var(--faint)}
.attn{display:flex; align-items:center; gap:12px; padding:13px 14px; background:var(--card); border-radius:17px; box-shadow:var(--shadow-sm); margin-bottom:10px; cursor:pointer; transition:.15s}
.attn:active{transform:scale(.99)}
.attn .a-ic{width:38px; height:38px; border-radius:12px; display:grid; place-items:center; flex-shrink:0}
.attn .a-t{font-size:13.5px; font-weight:700}
.attn .a-s{font-size:11.5px; color:var(--muted); margin-top:1px}

.lds{display:flex; flex-direction:column; gap:13px}
.ld{display:flex; align-items:center; gap:11px}
.ld .nm{width:84px; font-size:12.5px; font-weight:700; display:flex; align-items:center; gap:6px}
.ld .track{flex:1; height:9px; border-radius:999px; background:var(--line); overflow:hidden}
.ld .fill{height:100%; border-radius:999px; transition:width .5s}
.ld .ct{font-family:'Bricolage Grotesque'; font-size:13px; font-weight:700; width:20px; text-align:right}
.ring{position:relative; width:84px; height:84px; flex-shrink:0}
.ring .pct{position:absolute; inset:0; display:grid; place-items:center; font-family:'Bricolage Grotesque'; font-weight:700; font-size:19px}
.heromet{display:flex; gap:22px; margin-top:4px}
.heromet .m .mv{font-family:'Bricolage Grotesque'; font-size:22px; font-weight:700}
.heromet .m .mk{font-size:11.5px; color:rgba(255,255,255,.55); font-weight:600}
.legend{display:flex; flex-wrap:wrap; gap:8px 14px; margin-top:8px; justify-content:center}
.lg{display:flex; align-items:center; gap:6px; font-size:11.5px; font-weight:600; color:var(--muted)}
.lg .sw{width:9px; height:9px; border-radius:3px}

.inv{background:var(--card); border-radius:18px; box-shadow:var(--shadow-sm); padding:14px; margin-bottom:10px}
.inv .nm{font-family:'Bricolage Grotesque'; font-size:15px; font-weight:700}
.inv .qb{display:flex; align-items:baseline; gap:5px; margin-top:2px}
.inv .q{font-family:'Bricolage Grotesque'; font-size:24px; font-weight:700}
.inv .u{font-size:12px; color:var(--muted); font-weight:600}
.low{font-size:10.5px; font-weight:700; color:#dc2626; background:color-mix(in srgb,#ef4444 12%,transparent); padding:3px 8px; border-radius:7px}
.trow{display:flex; align-items:center; gap:12px; background:var(--card); border-radius:17px; box-shadow:var(--shadow-sm); padding:13px 14px; margin-bottom:9px}
.trow .nm{font-family:'Bricolage Grotesque'; font-size:15px; font-weight:700}
.trow .un{font-size:12px; color:var(--muted)}
.tag{font-size:10px; font-weight:700; padding:2px 8px; border-radius:7px; background:var(--line); color:var(--muted)}
.tag.off{background:color-mix(in srgb,#ef4444 12%,transparent); color:#dc2626}
.tag.accent{background:color-mix(in srgb,var(--accent) 38%,transparent); color:color-mix(in srgb,var(--accent-ink) 80%,var(--text))}

.pjcard{border-radius:22px; box-shadow:var(--shadow-sm); padding:18px; margin-bottom:12px; cursor:pointer; transition:.15s; position:relative; overflow:hidden}
.pjcard:active{transform:scale(.985)}
.pjcard.f-white{background:var(--card)} .pjcard.f-accent{background:var(--accent); color:var(--accent-ink)} .pjcard.f-olive{background:var(--olive); color:var(--olive-text)}
.pjcard .cl{font-size:12.5px; font-weight:600; opacity:.7}
.pjcard .nm{font-family:'Bricolage Grotesque'; font-size:20px; font-weight:700; line-height:1.1; margin-top:2px}
.pjcard .big{font-family:'Bricolage Grotesque'; font-size:46px; font-weight:700; line-height:.9}

.field{margin-bottom:14px}
.field label{display:block; font-size:12px; font-weight:700; color:var(--muted); margin-bottom:6px}
.in,.sel{width:100%; padding:12px 14px; border-radius:14px; border:1.5px solid var(--line2); background:var(--card2);
  font-family:'Hanken Grotesk'; font-size:14.5px; color:var(--text); outline:none; transition:.15s}
.in:focus,.sel:focus{border-color:var(--accent); box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 30%,transparent)}
.in::placeholder{color:var(--faint)}
.f2{display:grid; grid-template-columns:1fr 1fr; gap:11px}
.seg{display:flex; gap:7px; flex-wrap:wrap}
.seg .o{flex:1; min-width:62px; text-align:center; padding:11px 6px; border-radius:12px; border:1.5px solid var(--line2);
  background:var(--card2); cursor:pointer; font-weight:700; font-size:13px; color:var(--muted); transition:.15s}
.seg .o.on{background:var(--hero); color:var(--hero-text); border-color:var(--hero)}
.toggle{width:50px; height:30px; border-radius:999px; background:var(--line2); position:relative; cursor:pointer; transition:.2s; flex-shrink:0}
.toggle.on{background:var(--accent)}
.toggle::after{content:''; position:absolute; top:3px; left:3px; width:24px; height:24px; border-radius:50%; background:#fff; transition:.2s; box-shadow:0 1px 3px rgba(0,0,0,.2)}
.toggle.on::after{left:23px}
.row-between{display:flex; align-items:center; justify-content:space-between; padding:14px 16px; background:var(--card); border-radius:16px; box-shadow:var(--shadow-sm); margin-bottom:10px}

.scrim{position:fixed; inset:0; background:rgba(10,11,9,.5); z-index:60; display:flex; align-items:flex-end; justify-content:center; animation:fade .2s}
@keyframes fade{from{opacity:0}to{opacity:1}}
.sheet{width:100%; max-width:480px; max-height:92vh; overflow-y:auto; background:var(--app); border-radius:28px 28px 0 0; padding:20px 18px 28px; animation:up .28s cubic-bezier(.2,.8,.2,1)}
@keyframes up{from{transform:translateY(40px); opacity:.6}to{transform:none; opacity:1}}
.sh-h{display:flex; align-items:center; justify-content:space-between; margin-bottom:18px}
.sh-h h3{font-size:19px; font-weight:700}
.grip{width:38px; height:4px; border-radius:99px; background:var(--line2); margin:0 auto 14px}
.pscrim{position:fixed; inset:0; background:rgba(10,11,9,.5); z-index:60; display:flex; justify-content:flex-end; animation:fade .2s}
.panel{width:360px; max-width:88vw; height:100%; background:var(--app); padding:18px; overflow-y:auto; animation:slide .25s ease}
@keyframes slide{from{transform:translateX(24px)}to{transform:none}}
.notif{display:flex; gap:11px; padding:13px; border-radius:15px; background:var(--card); box-shadow:var(--shadow-sm); margin-bottom:9px}
.notif.un{box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--accent) 45%,transparent),var(--shadow-sm)}
.n-ic{width:34px; height:34px; border-radius:11px; display:grid; place-items:center; flex-shrink:0}
.notif .nt{font-size:13px; font-weight:600; line-height:1.4}
.notif .nm{font-size:11px; color:var(--faint); margin-top:3px}

.cal-grid{display:grid; grid-template-columns:repeat(7,1fr); gap:4px}
.cal-wd{text-align:center; font-size:10.5px; font-weight:700; color:var(--faint); padding:4px 0}
.cal-d{aspect-ratio:1; border-radius:12px; display:flex; align-items:center; justify-content:center; cursor:pointer;
  font-family:'Bricolage Grotesque'; font-weight:700; font-size:14px; position:relative; background:var(--card); box-shadow:var(--shadow-sm)}
.cal-d.out{background:transparent; box-shadow:none; color:var(--faint); opacity:.4}
.cal-d.on{background:var(--hero); color:var(--hero-text)}
.cal-d.today:not(.on){box-shadow:inset 0 0 0 1.5px var(--accent)}
.cal-d .cd{position:absolute; bottom:5px; font-size:8.5px; font-weight:700; padding:0 4px; border-radius:6px; background:var(--accent); color:var(--accent-ink)}

.login{min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:30px 26px; text-align:center}
.lmark{width:66px; height:66px; border-radius:21px; background:var(--hero); display:grid; place-items:center; margin-bottom:20px; box-shadow:var(--shadow)}
.login h1{font-size:30px; font-weight:800; letter-spacing:.04em}
.login .tag{color:var(--muted); font-size:13px; margin-top:6px; margin-bottom:30px; font-weight:600; letter-spacing:.02em}
.pins{display:flex; gap:13px; margin-bottom:26px}
.pd{width:15px; height:15px; border-radius:50%; background:var(--line2); transition:.15s}
.pd.f{background:var(--hero); transform:scale(1.12)}
.kp{display:grid; grid-template-columns:repeat(3,72px); gap:13px}
.k{height:62px; border-radius:18px; background:var(--card); box-shadow:var(--shadow-sm); border:none; font-family:'Bricolage Grotesque';
  font-size:23px; font-weight:700; color:var(--ink); cursor:pointer; transition:.1s}
.k:active{transform:scale(.93); background:var(--accent); color:var(--accent-ink)}
.k.fn{color:var(--muted); font-size:16px}
.lerr{color:#dc2626; font-size:13px; font-weight:600; margin-top:16px; min-height:18px}
.lhint{margin-top:24px; padding:14px 16px; border-radius:16px; background:var(--card); box-shadow:var(--shadow-sm); font-size:11.5px; color:var(--muted); text-align:left; line-height:1.7; max-width:340px}
.lhint b{color:var(--text)} .lhint code{font-weight:700; color:var(--text); background:var(--line); padding:1px 6px; border-radius:6px}
.tlink{margin-top:20px; font-size:13.5px; font-weight:700; color:var(--ink); cursor:pointer; text-decoration:underline; text-underline-offset:3px}
.foot{text-align:center; color:var(--faint); font-size:11px; padding:16px 0 4px; line-height:1.6}

.logobars{display:flex; align-items:flex-end; gap:2.5px}
.logobars i{width:4px; border-radius:2px; background:var(--accent); display:block}

/* ═══════════════ RESPONSIVE ═══════════════ */

/* TABLET (portrait) — widen the column, keep bottom nav */
@media (min-width: 768px) {
  .shell{ max-width: 760px; }
  .content{ padding-left: 28px; padding-right: 28px; }
  .hdr{ padding-left: 28px; padding-right: 28px; }
  /* two-up grids on tablet */
  .grid-2{ display:grid; grid-template-columns:1fr 1fr; gap:14px; align-items:start; }
  .grid-2 > .sec-h{ grid-column:1 / -1; }
}

/* DESKTOP / iPad landscape — sidebar + multi-column, no bottom nav */
@media (min-width: 1024px) {
  .gt{ justify-content:stretch; }
  .shell{ max-width:none; flex-direction:row; box-shadow:none; }

  .sidebar{ display:flex; flex-direction:column; width:248px; flex-shrink:0; height:100%;
    background:var(--card); border-right:1px solid var(--line); padding:22px 16px calc(var(--safe-bottom) + 16px); gap:6px; }
  .sb-brand{ display:flex; align-items:center; gap:10px; padding:6px 10px 18px; }
  .sb-word{ font-family:'Bricolage Grotesque'; font-weight:800; font-size:22px; letter-spacing:.04em; }
  .sb-new{ display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:13px; margin-bottom:14px;
    border:none; border-radius:15px; background:var(--accent); color:var(--accent-ink); font-family:'Hanken Grotesk'; font-weight:700; font-size:14.5px; cursor:pointer; transition:.15s; }
  .sb-new:active{ transform:scale(.98); }
  .sb-nav{ display:flex; flex-direction:column; gap:3px; }
  .sb-item{ display:flex; align-items:center; gap:12px; width:100%; padding:11px 13px; border:none; background:none; cursor:pointer;
    border-radius:13px; font-family:'Hanken Grotesk'; font-weight:600; font-size:14.5px; color:var(--muted); transition:.15s; position:relative; text-align:left; }
  .sb-item:hover{ background:var(--card2); color:var(--text); }
  .sb-item.on{ background:var(--hero); color:var(--hero-text); }
  .sb-item .sb-dot{ position:absolute; left:28px; top:10px; width:7px; height:7px; border-radius:50%; background:var(--accent); }
  .sb-item > span{ flex:1; }
  .sb-foot{ margin-top:auto; display:flex; flex-direction:column; gap:6px; padding-top:12px; border-top:1px solid var(--line); }
  .sb-user{ display:flex; align-items:center; gap:10px; width:100%; padding:8px; border:none; background:none; cursor:pointer; border-radius:13px; transition:.15s; }
  .sb-user:hover{ background:var(--card2); }
  .sb-user-meta{ flex:1; min-width:0; text-align:left; }
  .sb-user-name{ font-weight:700; font-size:13.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .sb-user-role{ font-size:11.5px; color:var(--muted); }

  .main{ background:var(--app); }
  .hdr{ display:none; }
  .bnav{ display:none; }
  .topbar{ display:flex; align-items:center; gap:12px; padding:22px 32px 14px; position:sticky; top:0; z-index:20;
    background:linear-gradient(180deg,var(--app) 82%,transparent); }
  .tb-title{ font-family:'Bricolage Grotesque'; font-weight:700; font-size:26px; }

  .scroll{ display:flex; justify-content:center; }
  .content{ width:100%; max-width:1080px; padding:4px 32px 48px; }

  /* desktop dashboard: two-column masonry-ish using columns where marked */
  .dash-grid{ display:grid; grid-template-columns:1.6fr 1fr; gap:20px; align-items:start; }
  .dash-grid > .sec-h{ grid-column:auto; }
  .dash-wide{ grid-column:1 / -1; }

  /* cards/lists get a touch more breathing room */
  .jc{ padding:17px; }
  .pjcard{ padding:20px; }

  /* projects & stock lists become two columns on wide screens */
  .col-2{ display:grid; grid-template-columns:1fr 1fr; gap:12px; align-items:start; }
  .col-2 > .sec-h, .col-2 > .pill-tabs, .col-2 > .empty{ grid-column:1 / -1; }
}

/* LARGE DESKTOP — allow three-column lists */
@media (min-width: 1440px) {
  .content{ max-width:1240px; }
  .col-3{ display:grid; grid-template-columns:repeat(3,1fr); gap:12px; align-items:start; }
  .col-3 > .sec-h, .col-3 > .pill-tabs, .col-3 > .empty{ grid-column:1 / -1; }
}
`;
