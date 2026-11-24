const DEFAULT_ENDPOINT="https://script.google.com/macros/s/AKfycbwif_LGB7tKlxKmRY3t-EhudFltsk6sH6rRlBLSrbO6SB4Oop3p6_NXiFtn2Qfl72QLuA/exec";
const WORDS="藍色正方形.藍色三角形.數字5.數字4.數字3.數字2.數字1.綠色圓形.綠色三角形.摸頭髮.摸膝蓋.摸肩膀.摸耳朵.摸脖子.摸肚子.滅火器.黃色圓形.黃色星星.釘書機.紅色星星.紅色正方形.長頸鹿.羽毛球.向日葵.冰淇淋.北極熊.仙人掌".split(".");
const DRIVE_IDS={藍色正方形:"1-0smTDCDOchlRP0qKmUuJbDGpOVmWmki",藍色三角形:"1tOzHLWKYIZlTIvH36LhL2KjKRvY0vR-C",數字5:"1rcNt_Ivdpjj3t44FJlW8GEPMCXWQTmb3",數字4:"1f8QlvqGDarERzp8C7xkmOtjdLFv_zQN-",數字3:"1dS8am-LOhay7uWkU-RooEjYq5uN981RO",數字2:"1pjNR2KUfd1_TcvDDnNjVDlv_h7pPywNx",數字1:"1YvH95wuLlTU2Fr3ippJWJvgqDvPBzZjO",綠色圓形:"1z_Yj4I2LRB9_r4axHG6vMtQRFpri9gm5",綠色三角形:"1N6Pax2algGm6L470Mvy-QI1mH5SVWKPd",摸頭髮:"10R2wyjUDv4pxG3DVe4C3p-A6ia7D0WR3",摸膝蓋:"1yVkqnKi8ZEcsKa3xgb8obdR7mqCNYaxw",摸肩膀:"1IvxewC1RgnWyY8mKM-cEn_3E6ZY4xfXz",摸耳朵:"12t0AdGHpyWC9-N76bXefkiN7_PrM8tMe",摸脖子:"1luVmM6bOAKybFtVUCji9_Ep2O7ouQWXh",摸肚子:"1yKMV71f_zv_xxQ8qeD3gxBauq4LbFgqM",滅火器:"1eJ06S-t86o1533_EPJTDhRXP6JU1IN8X",黃色圓形:"1S2U9Gmn9FkhpfTdBURaJNRxgemk2AVr4",黃色星星:"1qJ1dd028kW4WWIxULXiEFvUWv1Il-lJy",釘書機:"18abWu43r9HdoYAz6U2dmHi9eaTKmvpm7",紅色星星:"1z2GLVw0Xz8rnh2GDMSSOsK_CTc1TafCi",紅色正方形:"1noY-7YgWPrMBnrq0Fn5XvIGKKTlAmTdm",長頸鹿:"1L_g3KLiCt9hW_aB3ah9fbpN0kBiXBsDA",羽毛球:"1F93MZ5daLjxsJ7vSo8R3BcpDjtEr3EX8",向日葵:"1jsiuCrBoUF1v7XZ1sdH9Rvgg10zNngea",冰淇淋:"1pKH63VsV3UebTQnYlXDf9QOskO-tghle",北極熊:"1EBOYB6Y6ryCTf5CiA1B-zdECVggFnayI",仙人掌:"1qR01J7tghKu9lUtXjZwapHBm56_9Bnum"};
const SEAT_QUESTIONS=[["摸肩膀","羽毛球"],["綠色圓形","滅火器"],["摸膝蓋","向日葵"],["黃色星星","長頸鹿"],["數字3","數字2","冰淇淋"],["藍色三角形","仙人掌"],["數字5","釘書機"],["紅色正方形","數字4","北極熊"],["摸耳朵","釘書機"],["黃色圓形","數字4","北極熊"],["摸脖子","數字2","冰淇淋"],["紅色星星","仙人掌"],["數字2","滅火器"],["藍色三角形","長頸鹿"],["數字1","羽毛球"],["綠色圓形","向日葵"],["摸頭髮","向日葵"],["綠色三角形","羽毛球"],["摸肚子","長頸鹿"],["黃色圓形","滅火器"],["數字5","仙人掌"],["紅色星星","冰淇淋"],["數字2","北極熊"],["藍色正方形","釘書機"],["摸肩膀","黃色星星"],["數字1","紅色正方形"],["摸膝蓋","綠色三角形"],["數字3","藍色正方形"],["摸膝蓋","向日葵"],["黃色星星","長頸鹿"]];
const cardSrc=(word,tier=0)=>tier===0?`https://drive.google.com/thumbnail?id=${DRIVE_IDS[word]}&sz=w1200`:`${tier===1?"https://raw.githubusercontent.com/genikid/imagecard/refs/heads/main/images/":"https://cdn.jsdelivr.net/gh/genikid/imagecard@main/images/"}${encodeURIComponent(word)}.png`;

const DEFAULT_YEAR="115學年度",DEFAULT_SCHOOL="管理中心",DEFAULT_CLASS="測試班";
const app=document.querySelector("#app");
const shuffle=a=>[...a].sort(()=>Math.random()-.5);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const normClass=c=>c.trim()?c.trim().replace(/班$/,"")+"班":"";

const state={
  screen:"home",year:DEFAULT_YEAR,park:DEFAULT_SCHOOL,className:DEFAULT_CLASS,
  records:[],seat:0,round:0,cards:[],answers:[],feedback:null,
  unlockActive:false,usedUnlock:false,unlockHelpOpen:false,
  endpoint:DEFAULT_ENDPOINT,syncStatus:"loading",
  config:{years:[DEFAULT_YEAR],roster:{[DEFAULT_YEAR]:{[DEFAULT_SCHOOL]:[DEFAULT_CLASS]}},loading:true,error:""},
  advanceTimer:null
};

/* =========================================================
   Storybook Baby Owl Watercolor Mascot (5 Contextual Poses)
   ========================================================= */
const OWL_ART={
  wave:"assets/mascot-owl.png",
  cheer:"assets/mascot-owl-cheer.png",
  think:"assets/mascot-owl-think.png",
  encourage:"assets/mascot-owl-encourage.png",
  trophy:"assets/mascot-owl-trophy.png"
};
function owlImg(pose="wave"){
  const src=OWL_ART[pose]||OWL_ART.wave;
  return `<img src="${src}" alt="小貓頭鷹星際領航員" />`;
}

/* =========================================================
   Class Data Helpers (100% Preserved Scoring & API)
   ========================================================= */
function seatMap(){
  const m=new Map(),cls=normClass(state.className);
  state.records.filter(r=>r.academicYear===state.year&&r.park===state.park&&r.className===cls).forEach(r=>m.set(Number(r.seat),r));
  return m;
}
function calcTotalScore(r){
  if(Number.isFinite(r.totalScore))return r.totalScore;
  const ok=(r.answers||[]).filter(a=>a.ok).length;
  return Math.round((ok*5+(20-(r.paperWrong||0))*5)/1.1*10)/10;
}
function wrongWordsSummary(){
  const list=[...seatMap().values()];
  return WORDS.map(word=>({
    word,
    wrong:list.reduce((acc,r)=>acc+((r.answers||[]).some(a=>a.word===word&&!a.ok)?1:0),0)
  })).filter(x=>x.wrong>0).sort((a,b)=>b.wrong-a.wrong);
}
function saveLocal(next){
  state.records=next;
  try{localStorage.setItem("word-code-results-v2",JSON.stringify(next))}catch{}
}
async function postAction(action,data){
  if(!state.endpoint)return;
  try{await fetch(state.endpoint,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain"},body:JSON.stringify({action,data})})}catch{}
}

/* =========================================================
   Storybook Poster JPG Exporter (ONLY 待加強語詞 + Same Watercolor Owl, NO numbers/copyright)
   ========================================================= */
function safeFilePart(v){return String(v||"").replace(/[\\/:*?"<>|]/g,"-").trim()}
function roundedRect(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function drawFluffyCloud(ctx,cx,cy,s,color){ctx.save();ctx.fillStyle=color;ctx.beginPath();ctx.arc(cx,cy,28*s,0,Math.PI*2);ctx.arc(cx-26*s,cy+9*s,20*s,0,Math.PI*2);ctx.arc(cx+28*s,cy+9*s,22*s,0,Math.PI*2);ctx.fill();ctx.restore()}
function drawSparkleStar(ctx,cx,cy,r,color){ctx.save();ctx.fillStyle=color;ctx.beginPath();for(let i=0;i<10;i++){const rad=i%2===0?r:r*.45,a=-Math.PI/2+i*Math.PI/5;ctx[i?"lineTo":"moveTo"](cx+Math.cos(a)*rad,cy+Math.sin(a)*rad)}ctx.closePath();ctx.fill();ctx.restore()}
function loadDataImage(src){
  return new Promise(resolve=>{
    if(!src){resolve(null);return}
    const img=new Image();
    img.onload=()=>resolve(img);
    img.onerror=()=>resolve(null);
    img.src=src;
  });
}

async function downloadReportJpg(){
  try{if(document.fonts&&document.fonts.ready)await document.fonts.ready}catch{}
  const list=[...seatMap().values()];
  const review=wrongWordsSummary();
  const mascots=window.REPORT_MASCOTS||{};
  const owlPic=await loadDataImage(review.length?mascots.encourage:(list.length?mascots.trophy:mascots.encourage));
  const font='"Chiron GoRound TC","Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif';
  const cols=4,rowCount=review.length?Math.ceil(review.length/cols):1;
  const width=1600;
  const boardH=review.length?146+rowCount*136+42:290;
  const height=Math.max(920,330+boardH+120);
  const canvas=document.createElement("canvas"),ctx=canvas.getContext("2d");
  canvas.width=width;canvas.height=height;

  const sky=ctx.createLinearGradient(0,0,0,height);
  sky.addColorStop(0,"#e6dfff");
  sky.addColorStop(0.5,"#fffdf7");
  sky.addColorStop(1,"#ece6ff");
  ctx.fillStyle=sky;ctx.fillRect(0,0,width,height);

  // Smiling crescent moon top right & pastel clouds
  ctx.fillStyle="#ffe57f";ctx.beginPath();ctx.arc(1476,88,52,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#e9e3ff";ctx.beginPath();ctx.arc(1454,76,44,0,Math.PI*2);ctx.fill();
  drawFluffyCloud(ctx,160,96,1.35,"rgba(255,255,255,.9)");
  drawFluffyCloud(ctx,975,78,1.0,"rgba(255,255,255,.84)");
  drawSparkleStar(ctx,645,112,15,"#ffd04d");
  drawSparkleStar(ctx,965,160,12,"#ff9f78");
  drawSparkleStar(ctx,102,290,11,"#b49ef5");

  // Fluffy lavender-cream clouds at bottom
  ctx.fillStyle="rgba(214,202,252,.65)";
  for(let x=60;x<width+80;x+=150){ctx.beginPath();ctx.arc(x,height-52,110,0,Math.PI*2);ctx.fill()}
  ctx.fillStyle="rgba(255,255,255,.9)";
  for(let x=0;x<width+100;x+=135){ctx.beginPath();ctx.arc(x,height-18,92,0,Math.PI*2);ctx.fill()}

  ctx.strokeStyle="rgba(186,170,242,.9)";ctx.lineWidth=8;
  roundedRect(ctx,28,28,width-56,height-56,42);ctx.stroke();

  ctx.fillStyle="#6c4cd6";roundedRect(ctx,96,76,286,52,26);ctx.fill();
  ctx.strokeStyle="#fffef7";ctx.lineWidth=4;roundedRect(ctx,96,76,286,52,26);ctx.stroke();
  ctx.fillStyle="#ffffff";ctx.font=`800 25px ${font}`;ctx.textAlign="center";
  ctx.fillText("文字密碼・大下",239,111);

  ctx.textAlign="left";ctx.fillStyle="#3d2278";ctx.font=`800 66px ${font}`;
  ctx.fillText("班級待加強語詞",96,212);
  ctx.fillStyle="#6e5f94";ctx.font=`700 24px ${font}`;
  ctx.fillText("提供老師日常複習與個別引導參考",98,254);

  ctx.fillStyle="#fffdf7";roundedRect(ctx,1054,84,448,158,32);ctx.fill();
  ctx.strokeStyle="#f3c55e";ctx.lineWidth=5;roundedRect(ctx,1054,84,448,158,32);ctx.stroke();
  ctx.fillStyle="#f9e9b8";ctx.beginPath();ctx.arc(1084,114,9,0,Math.PI*2);ctx.arc(1472,114,9,0,Math.PI*2);ctx.fill();
  ctx.textAlign="center";ctx.fillStyle="#5a3bc2";ctx.font=`800 34px ${font}`;
  ctx.fillText(state.year||"—",1278,150);
  ctx.fillStyle="#33205e";ctx.font=`800 38px ${font}`;
  ctx.fillText(`${state.park||""}・${normClass(state.className)||""}`,1278,208);

  const boardX=96,boardY=316,boardW=width-192;
  ctx.fillStyle="rgba(78,52,168,.13)";roundedRect(ctx,boardX,boardY+12,boardW,boardH,38);ctx.fill();
  ctx.fillStyle="#fffef9";roundedRect(ctx,boardX,boardY,boardW,boardH,38);ctx.fill();
  ctx.strokeStyle="#c4b5f5";ctx.lineWidth=5;roundedRect(ctx,boardX,boardY,boardW,boardH,38);ctx.stroke();
  ctx.save();ctx.setLineDash([12,10]);ctx.strokeStyle="#ddd4fa";ctx.lineWidth=3;
  roundedRect(ctx,boardX+18,boardY+18,boardW-36,boardH-36,28);ctx.stroke();ctx.restore();

  if(owlPic){
    const mSize=316,mx=width/2-mSize/2,my=38;
    ctx.save();
    ctx.shadowColor="rgba(72,46,148,.22)";
    ctx.shadowBlur=18;
    ctx.shadowOffsetY=8;
    ctx.drawImage(owlPic,mx,my,mSize,mSize);
    ctx.restore();
  }

  ctx.textAlign="center";ctx.fillStyle="#5034b0";ctx.font=`800 34px ${font}`;
  ctx.fillText("建議複習的語詞清單",width/2,boardY+92);

  if(review.length){
    const gapX=24,gapY=24,padX=54;
    const cardW=(boardW-padX*2-gapX*(cols-1))/cols,cardH=112;
    const palette=[
      {bg:"#f3eeff",bd:"#bfb0f5",lip:"#d5cbf7"},
      {bg:"#fff6dc",bd:"#f3ca68",lip:"#f4da93"},
      {bg:"#eaf6ff",bd:"#9fd0f2",lip:"#bedff5"},
      {bg:"#ffefe8",bd:"#f5b79c",lip:"#f4cbb8"}
    ];
    review.forEach((item,idx)=>{
      const col=idx%cols,row=Math.floor(idx/cols);
      const x=boardX+padX+col*(cardW+gapX),y=boardY+132+row*(cardH+gapY);
      const p=palette[idx%palette.length];
      ctx.fillStyle=p.lip;roundedRect(ctx,x,y+7,cardW,cardH,28);ctx.fill();
      ctx.fillStyle=p.bg;roundedRect(ctx,x,y,cardW,cardH,28);ctx.fill();
      ctx.strokeStyle=p.bd;ctx.lineWidth=4;roundedRect(ctx,x,y,cardW,cardH,28);ctx.stroke();
      ctx.fillStyle="#33205e";ctx.textAlign="center";ctx.font=`800 ${item.word.length>3?40:48}px ${font}`;
      ctx.fillText(item.word,x+cardW/2,y+74);
    });
  }else{
    ctx.fillStyle="#f4f0ff";roundedRect(ctx,boardX+90,boardY+136,boardW-180,104,28);ctx.fill();
    ctx.strokeStyle="#c5b6f5";ctx.lineWidth=3;roundedRect(ctx,boardX+90,boardY+136,boardW-180,104,28);ctx.stroke();
    ctx.textAlign="center";ctx.fillStyle=list.length?"#2c7c4c":"#6d5f91";ctx.font=`800 36px ${font}`;
    ctx.fillText(list.length?"本班目前沒有待加強的語詞，大家表現都很棒喔！":"完成闖關後，這裡會整理本班待加強的語詞",width/2,boardY+200);
  }

  canvas.toBlob(blob=>{
    if(!blob)return;
    const url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;
    a.download=`${safeFilePart(state.year||"大班")}_${safeFilePart(state.park)}_${safeFilePart(normClass(state.className))}_大下待加強語詞.jpg`;
    a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  },"image/jpeg",.94);
}

/* =========================================================
   Storybook UI Rendering
   ========================================================= */
function confettiHtml(count=24){
  return `<div class="confetti-layer" aria-hidden="true">${Array.from({length:count},(_,i)=>`<i style="left:${(i*17+4)%96}%;animation-delay:${(i%7)*0.09}s;animation-duration:${1.1+(i%4)*0.22}s"></i>`).join("")}</div>`;
}
function updateFullscreenButton(){const b=document.querySelector("#fullscreenToggle");if(!b)return;const active=!!document.fullscreenElement;b.setAttribute("aria-label",active?"離開全螢幕":"切換全螢幕");b.title=active?"離開全螢幕":"全螢幕";b.classList.toggle("is-active",active)}
async function toggleFullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch(e){console.warn("無法切換全螢幕",e)}}
document.addEventListener("fullscreenchange",updateFullscreenButton);

function owlHomeMessage(){
  if(state.className)return "準備好了嗎？直接點選你的座號徽章，立刻出發解開文字密碼！";
  if(state.config.loading)return "小貓頭鷹正在載入星際班級名單，稍等一下喔！";
  return "嗨！先選好大班班級，跟小貓頭鷹一起解開文字密碼吧！";
}

function home(){
  const map=seatMap();
  const parks=Object.keys(state.config.roster[state.year]||{});
  const classes=(state.config.roster[state.year]||{})[state.park]||[];
  const syncText=state.syncStatus==="loading"?"正在同步雲端紀錄…":state.syncStatus==="synced"?"✓ 已同步 Google 試算表":"暫時無法同步，仍可使用本機紀錄";

  return `<section class="sb-home">
    <aside class="home-left">
      <div class="home-header-badge">
        <span class="ribbon-pill">幼兒注音語文闖關・大下</span>
        <h1 class="home-title">文字密碼</h1>
        <p class="home-subtitle">小貓頭鷹的夢幻星光解碼站</p>
      </div>
      <div class="mascot-stage">
        <div class="speech-bubble">${esc(owlHomeMessage())}</div>
        <div class="mascot-medallion">${owlImg(state.className?"cheer":"wave")}</div>
      </div>
      <div class="home-left-foot">
        <div class="left-btn-row">
          <button class="btn-wood" id="toResults" ${!state.className?"disabled":""}>📋 查看全班成果</button>
        </div>
        <p class="home-copyright">© 傑尼爾教育文化事業集團 版權所有</p>
      </div>
    </aside>

    <div class="home-notebook">
      <div class="notebook-tabs">
        <span class="notebook-heading">🚀 星光任務出發站</span>
        <span class="notebook-dots" aria-hidden="true"><i></i><i></i><i></i></span>
      </div>

      <div class="identity-bar">
        <label>學年度
          <select id="yearSel" ${state.config.loading||state.config.error?"disabled":""}>
            <option value="">${state.config.loading?"讀取學年度中…":"請選擇學年度"}</option>
            ${state.config.years.map(y=>`<option value="${esc(y)}" ${state.year===y?"selected":""}>${esc(y)}</option>`).join("")}
          </select>
        </label>
        <label>園所
          <select id="parkSel" ${state.config.loading||!state.year||state.config.error?"disabled":""}>
            <option value="">${state.year?"請選擇園所":"請先選擇學年度"}</option>
            ${parks.map(p=>`<option value="${esc(p)}" ${state.park===p?"selected":""}>${esc(p)}</option>`).join("")}
          </select>
        </label>
        <label>班級
          <select id="classSel" ${state.config.loading||!state.park||state.config.error?"disabled":""}>
            <option value="">${state.park?"請選擇班級":"請先選擇園所"}</option>
            ${classes.map(c=>`<option value="${esc(c)}" ${state.className===c?"selected":""}>${esc(c)}</option>`).join("")}
          </select>
        </label>
      </div>

      <div class="seat-board">
        ${state.config.loading?`
          <div class="seat-placeholder"><span>🌟</span><div>正在讀取班級座號徽章…</div></div>
        `:state.className?`
          <div class="seat-board-head">
            <h2>點選座號立即開始闖關</h2>
            <span class="seat-legend">✓ 灰色勾勾表示已完成</span>
          </div>
          <div class="seat-grid">
            ${Array.from({length:30},(_,i)=>i+1).map(n=>{
              const done=map.has(n);
              return `<button class="seat ${done?"done":""}" data-seat="${n}" ${done?"disabled":""} aria-label="${n} 號${done?"，已完成":""}">${String(n).padStart(2,"0")}</button>`;
            }).join("")}
          </div>
        `:`
          <div class="seat-placeholder"><span>🌟</span><div>${esc(state.config.error||"請先在上方選擇學年度、園所與大班班級")}<br>點選座號就會直接進入文字密碼關卡！</div></div>
        `}
      </div>

      <div class="notebook-footer">
        <span class="sync-pill">${esc(syncText)}</span>
        <span class="sync-pill">${state.year?`${esc(state.year)}・大班`:""}</span>
      </div>
    </div>
  </section>`;
}

function game(){
  const owlPose=state.feedback?(state.feedback.ok?"cheer":"encourage"):state.unlockActive?"encourage":"think";
  const tip=state.feedback?(state.feedback.ok?"太棒了！成功解開文字密碼！":"沒關係，我們一起看看答案喔！"):state.unlockActive?"小貓頭鷹提示開啟！一起找找圖卡，之後再多複習這張密碼吧！":`仔細找一找，任務(${state.round+1})是哪一張圖卡呢？`;
  return `<section class="sb-game">
    ${state.feedback?`<div class="feedback-pop"><div class="feedback-badge ${state.feedback.ok?"ok":"no"}" aria-label="${state.feedback.ok?"答對":"答錯"}">${state.feedback.ok?"○":"×"}</div></div>`:""}
    <header class="journey-bar">
      <div class="journey-left">
        <button class="btn-back-pill" id="backHome">← 返回重選</button>
        <span class="seat-chip">${String(state.seat).padStart(2,"0")} 號</span>
        <div class="unlock-wrap ${state.unlockHelpOpen?"is-open":""}" id="unlockWrap">
          <button class="btn-unlock ${state.unlockActive?"active":""}" id="unlockBtn" aria-pressed="${state.unlockActive}">${state.unlockActive?"🔓 取消解鎖":"🔒 任務解鎖"}</button>
          <button class="btn-unlock-help" id="unlockHelpBtn" type="button" aria-label="任務解鎖說明" aria-expanded="${state.unlockHelpOpen}" title="任務解鎖說明">?</button>
          <div class="unlock-popover" role="tooltip">
            <strong>🦉 任務解鎖小說明</strong>
            <p>小幫手提示模式：陪孩子一起找答案，後台會幫忙記下來多練習喔！</p>
            <small>開啟後選對圖卡一樣會給予鼓勵，本題將自動列入班級待加強語詞。</small>
          </div>
        </div>
      </div>
      <div class="journey-trail" aria-label="闖關進度">
        <div class="trail-steps">
          ${[0,1].map(i=>{
            const a=state.answers[i],cls=a?(a.ok?"pass":"fail"):i===state.round?"now":"todo";
            return `<span class="code-step ${cls}" aria-label="第 ${i+1} 題">${i+1}</span>`;
          }).join("")}
        </div>
      </div>
    </header>

    <div class="decode-stage">
      <aside class="owl-sidebar">
        <div class="owl-guide-ring">${owlImg(owlPose)}</div>
        <div class="owl-tip-bubble ${state.unlockActive&&!state.feedback?"is-unlock":""}">${esc(tip)}</div>
      </aside>
      <div class="cards-wrap">
        <div class="cards">
          ${state.cards.map(w=>`<button class="card ${state.feedback&&state.feedback.correct===w?"correct-card":""}" data-pick="${esc(w)}" aria-label="${esc(w)}"><img src="${cardSrc(w,0)}" data-word="${esc(w)}" data-source="0" alt="" /></button>`).join("")}
        </div>
      </div>
    </div>
  </section>`;
}

function finish(){
  const rec=seatMap().get(state.seat);
  const okCount=(rec?rec.answers:state.answers).filter(a=>a.ok).length;
  const pose=okCount===2?"trophy":okCount===1?"cheer":"encourage";
  const msg=okCount===2?"恭喜過關！表現超讚！❤️":okCount===1?"闖關完成！回家記得多複習拼音喔！🌟":"繼續加油！多練習會越來越棒！💪";
  return `<section class="sb-finish">
    ${confettiHtml(28)}
    <div class="finish-card">
      <div class="finish-mascot">${owlImg(pose)}</div>
      <h1>${msg}</h1>
      <p>${String(state.seat).padStart(2,"0")} 號完成兩道文字密碼</p>
      <div class="finish-actions">
        <button class="btn-wood" id="toResults">📋 查看全班成果</button>
        <button class="btn-launch" id="backHome">回到座號選擇 🏡</button>
      </div>
    </div>
  </section>`;
}

function report(){
  const list=[...seatMap().values()].sort((a,b)=>a.seat-b.seat);
  const avg=list.length?Math.round(list.reduce((s,r)=>s+calcTotalScore(r),0)/list.length*10)/10:0;
  const topWrong=wrongWordsSummary().slice(0,5);
  return `<section class="sb-report">
    <div class="report-card">
      <header class="report-head">
        <div>
          <span class="ribbon-pill">老師檢視・全班成果</span>
          <h1>${esc(state.year)}・${esc(state.park)}・${esc(normClass(state.className))}</h1>
        </div>
        <div class="report-actions">
          <button class="btn-launch" id="downloadJpg" style="padding:11px 24px;font-size:1rem;">下載待加強語詞 JPG</button>
          <button class="btn-lav" id="backHome">← 回首頁</button>
        </div>
      </header>

      <div class="summary">
        <div><strong>${list.length} 人</strong><span>已闖關人數</span></div>
        <div><strong>${avg} 分</strong><span>全班平均成績</span></div>
      </div>

      <section class="analysis-box">
        <h2>📌 AI 學習分析（下載 JPG 僅保留待加強語詞，不含次數與分數）</h2>
        <p>${topWrong.length?`全班目前較需要複習：${topWrong.map(w=>`${w.word}（錯 ${w.wrong} 次）`).join("、")}。`:"完成更多闖關後，這裡會整理班級待加強的語詞。"}</p>
      </section>

      <div class="table-wrap">
        <table>
          <thead><tr><th>座號</th><th>闖關</th><th>紙筆錯題數</th><th>總成績</th><th>操作</th></tr></thead>
          <tbody>
            ${list.length?list.map(r=>{
              const pass=(r.answers||[]).every(a=>a.ok);
              return `<tr>
                <td><strong>${String(r.seat).padStart(2,"0")} 號</strong></td>
                <td><span class="status-pill ${pass?"pass":"fail"}">${pass?"過關":"未過關"}</span></td>
                <td><input type="number" min="0" max="20" value="${r.paperWrong||0}" data-paper-seat="${r.seat}" aria-label="${r.seat}號紙筆錯題數" /></td>
                <td><strong>${calcTotalScore(r)} 分</strong></td>
                <td><button class="btn-danger" style="padding:6px 14px;font-size:.88rem;" data-del-seat="${r.seat}">刪除</button></td>
              </tr>`;
            }).join(""):`<tr><td colspan="5" style="padding:36px;color:#6c5d91;font-weight:700;">目前尚無完成紀錄</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  </section>`;
}

function render(){
  const view=state.screen==="home"?home():state.screen==="game"?game():state.screen==="finish"?finish():report();
  app.innerHTML=`<button class="fullscreen-toggle" id="fullscreenToggle" type="button" aria-label="切換全螢幕" title="全螢幕"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/></svg></button><div class="sb-stage">${view}</div>`;
  bind();
  document.querySelector("#fullscreenToggle").onclick=toggleFullscreen;
  updateFullscreenButton();
}

function buildCardsFor(seat,round){
  const [w1,w2,extra]=SEAT_QUESTIONS[seat-1];
  const must=[round?w2:w1];
  if(extra)must.push(extra);
  const rest=shuffle(WORDS.filter(w=>!must.includes(w))).slice(0,8-must.length);
  state.cards=shuffle([...new Set([...must,...rest])]);
}
function startSeat(seat){
  state.seat=seat;state.round=0;state.answers=[];state.unlockActive=false;state.usedUnlock=false;state.unlockHelpOpen=false;state.feedback=null;
  buildCardsFor(seat,0);
  state.screen="game";
  render();
}
function pickWord(word){
  if(state.feedback)return;
  state.unlockHelpOpen=false;
  const target=SEAT_QUESTIONS[state.seat-1][state.round];
  const matched=word===target;
  const ok=matched&&!state.unlockActive;
  if(state.unlockActive)state.usedUnlock=true;
  const nextAns=[...state.answers,{word:target,ok}];
  state.answers=nextAns;
  state.feedback={ok:matched,correct:target};
  render();
  if(state.advanceTimer)clearTimeout(state.advanceTimer);
  state.advanceTimer=setTimeout(()=>{
    state.advanceTimer=null;
    if(state.round===0){
      state.round=1;state.unlockActive=false;state.unlockHelpOpen=false;state.feedback=null;
      buildCardsFor(state.seat,1);
      render();
    }else{
      const rec={
        id:crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2)}`,
        academicYear:state.year,park:state.park,className:normClass(state.className),
        seat:state.seat,answers:nextAns,unlocked:state.usedUnlock||state.unlockActive,
        paperWrong:0,createdAt:new Date().toISOString()
      };
      saveLocal([...state.records,rec]);
      postAction("save",rec);
      state.feedback=null;
      state.screen="finish";
      render();
    }
  },950);
}
function goHome(){
  if(state.advanceTimer)clearTimeout(state.advanceTimer);
  state.advanceTimer=null;state.seat=0;state.answers=[];state.feedback=null;state.unlockActive=false;state.usedUnlock=false;state.unlockHelpOpen=false;
  state.screen="home";render();
}
document.addEventListener("click",e=>{
  if(!state.unlockHelpOpen)return;
  if(!e.target.closest("#unlockWrap")){state.unlockHelpOpen=false;render()}
});

function bind(){
  const $=s=>document.querySelector(s);
  if(state.screen==="home"){
    $("#yearSel").onchange=e=>{state.year=e.target.value;state.park="";state.className="";render()};
    $("#parkSel").onchange=e=>{state.park=e.target.value;state.className="";render()};
    $("#classSel").onchange=e=>{state.className=e.target.value;render()};
    document.querySelectorAll("[data-seat]").forEach(b=>b.onclick=()=>startSeat(Number(b.dataset.seat)));
    $("#toResults").onclick=()=>{state.screen="report";render()};
  }else if(state.screen==="game"){
    $("#backHome").onclick=goHome;
    $("#unlockBtn").onclick=()=>{state.unlockActive=!state.unlockActive;state.unlockHelpOpen=false;render()};
    $("#unlockHelpBtn").onclick=e=>{e.stopPropagation();state.unlockHelpOpen=!state.unlockHelpOpen;render()};
    document.querySelectorAll("[data-pick]").forEach(b=>b.onclick=()=>pickWord(b.dataset.pick));
    document.querySelectorAll(".card img").forEach(img=>{
      img.onerror=()=>{
        const tier=Number(img.dataset.source||"0")+1;
        if(tier<=2){img.dataset.source=String(tier);img.src=cardSrc(img.dataset.word,tier)}
      };
    });
  }else if(state.screen==="finish"){
    $("#backHome").onclick=goHome;
    $("#toResults").onclick=()=>{state.screen="report";render()};
  }else{
    $("#backHome").onclick=goHome;
    $("#downloadJpg").onclick=downloadReportJpg;
    document.querySelectorAll("[data-paper-seat]").forEach(inp=>{
      inp.onchange=e=>{
        const seat=Number(inp.dataset.paperSeat),rec=seatMap().get(seat);
        if(!rec)return;
        const val=Math.max(0,Math.min(20,Number(e.target.value)||0));
        saveLocal(state.records.map(r=>r.id===rec.id?{...r,paperWrong:val,totalScore:undefined}:r));
        postAction("paper",{id:rec.id,paperWrong:val});
        render();
      };
    });
    document.querySelectorAll("[data-del-seat]").forEach(b=>{
      b.onclick=()=>{
        const seat=Number(b.dataset.delSeat),rec=seatMap().get(seat);
        if(!rec)return;
        saveLocal(state.records.filter(r=>r.id!==rec.id));
        postAction("delete",{id:rec.id,park:state.park,className:normClass(state.className),seat});
        render();
      };
    });
  }
}

async function init(){
  try{
    state.records=JSON.parse(localStorage.getItem("word-code-results-v2")||"[]");
    state.endpoint=localStorage.getItem("word-code-endpoint-v2")||DEFAULT_ENDPOINT;
  }catch{}
  render();
  fetch(`${DEFAULT_ENDPOINT}?action=config&t=${Date.now()}`,{cache:"no-store"})
    .then(r=>r.json())
    .then(data=>{
      if(!data.ok||!Array.isArray(data.years)||!data.roster)throw Error("config failed");
      state.config={years:data.years,roster:data.roster,loading:false,error:""};
      if(data.years.includes(DEFAULT_YEAR)){
        state.year=DEFAULT_YEAR;
        const parks=Object.keys(data.roster[DEFAULT_YEAR]||{});
        if(parks.includes(DEFAULT_SCHOOL)){
          state.park=DEFAULT_SCHOOL;
          const classes=data.roster[DEFAULT_YEAR][DEFAULT_SCHOOL]||[];
          state.className=classes.find(c=>c===DEFAULT_CLASS||normClass(c)===DEFAULT_CLASS)||"";
        }else{
          state.park="";state.className="";
        }
      }else{
        state.year="";state.park="";state.className="";
      }
      render();
    })
    .catch(()=>{
      state.config={years:[],roster:{},loading:false,error:"學年度、園所與班級名單暫時無法讀取"};
      state.year="";state.park="";state.className="";
      render();
    });
  try{
    const res=await fetch(`${state.endpoint}?action=list&t=${Date.now()}`,{cache:"no-store"});
    const data=await res.json();
    if(!res.ok||!data.ok||!Array.isArray(data.results))throw Error("sync failed");
    const sorted=[...data.results].sort((a,b)=>new Date(a.createdAt).getTime()-new Date(b.createdAt).getTime());
    saveLocal(sorted);
    state.syncStatus="synced";
  }catch{
    state.syncStatus="error";
  }
  render();
}
init();
