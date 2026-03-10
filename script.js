/* ══ THEME SYSTEM ══ */
let curTheme = localStorage.getItem('ct_theme')||'cosmic';
let curMode  = localStorage.getItem('ct_mode')||'dark';

function setTheme(t){ curTheme=t; localStorage.setItem('ct_theme',t); applyTheme(); }
function setMode(m){ curMode=m; localStorage.setItem('ct_mode',m); applyTheme(); }

const LOGOS = {
  cosmic: '📚 TRACKER',
  amethyst: '📖 TRACKER',
  topaz: '🏆 TRACKER',
  cyber: '⚡ TRACKER',
  aurora: '🌌 TRACKER',
  ocean: '🌊 TRACKER',
  sunset: '🌅 TRACKER',
  galaxy: '🔮 TRACKER',
  neon: '🎆 TRACKER',
  forest: '🌲 TRACKER'
};

const PALETTES = {
  cosmic:  ['#6c63ff','#00d4aa','#ff6b9d','#ffd166','#ff4757','#2ed573','#1e90ff','#eccc68'],
  amethyst:['#7A3F91','#C59DD9','#F2EAF7','#9b59b6','#c084e0','#8b5cf6','#a855f7','#6d28d9'],
  topaz:   ['#E6A520','#FFD77A','#FFF8E7','#7A4A00','#d4870a','#f5c842','#b87d0a','#e8961a'],
  cyber:   ['#00ffcc','#ff0080','#ffe600','#00e5ff','#ff00ff','#39ff14','#ff6700','#0080ff'],
  aurora:  ['#00ff87','#60efff','#ff00ff','#7b2cbf','#3a86ff','#8338ec','#ff006e','#fb5607'],
  ocean:   ['#006d77','#83c5be','#edf6f9','#ffddd2','#e29578','#83c5be','#006d77','#edf6f9'],
  sunset:  ['#ff9f1c','#ffbf69','#ffffff','#cbf3f0','#2ec4b6','#ff9f1c','#ffbf69','#ffffff'],
  galaxy:  ['#7400b8','#6930c3','#5e60ce','#5390d9','#4ea8de','#48bfe3','#56cfe1','#64dfdf'],
  neon:    ['#ff00ff','#00ffff','#ffff00','#ff0080','#00ff00','#0080ff','#ff8000','#8000ff'],
  forest:  ['#2d6a4f','#40916c','#52b788','#74c69d','#95d5b2','#b7e4c2','#d8f3dc','#1b4332']
};

function applyTheme(){
  document.body.setAttribute('data-theme',curTheme);
  document.body.setAttribute('data-mode',curMode);
  document.querySelectorAll('.tswatch').forEach(s=>s.classList.toggle('active',s.dataset.theme===curTheme));
  document.getElementById('modeDark').classList.toggle('active',curMode==='dark');
  document.getElementById('modeLight').classList.toggle('active',curMode==='light');
  document.getElementById('navLogo').textContent = LOGOS[curTheme]||'📚 TRACKER';
  refreshColorPicker();
  
  // Update theme modal selections
  document.querySelectorAll('.theme-option').forEach(opt => {
    opt.classList.toggle('selected', opt.dataset.theme === curTheme);
  });
}

function showThemeModal(){
  document.getElementById('themeModal').classList.add('show');
}

function refreshColorPicker(){
  const colors = PALETTES[curTheme]||PALETTES.cosmic;
  const row = document.getElementById('colorRow'); if(!row) return;
  row.innerHTML = colors.map((c,i)=>
    `<div class="color-opt ${i===0?'selected':''}" data-color="${c}" style="background:${c};${c==='#FFF8E7'?'border:2px solid #ccc':''}"></div>`
  ).join('');
  selectedColor = colors[0];
  row.querySelectorAll('.color-opt').forEach(el=>{
    el.onclick=()=>{ row.querySelectorAll('.color-opt').forEach(x=>x.classList.remove('selected')); el.classList.add('selected'); selectedColor=el.dataset.color; };
  });
}

/* ══ DATA ══ */
const SK = 'courseTracker_v4';
const DEF = [
  {id:'html1',name:'HTML Course',instructor:'ElZero School',type:'session',total:37,color:'#6c63ff',done:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],notes:[]},
  {id:'elec1',name:'Electronic Course',instructor:'',type:'session',total:36,color:'#00d4aa',done:[1,2,3,4,5,6,7],notes:[]},
  {id:'ardu1',name:'Arduino Course',instructor:'',type:'session',total:53,color:'#ffd166',done:[1,2,3,4,5,6,7],notes:[]},
  {id:'linx1',name:'Linux Basics',instructor:'JWNM3',type:'session',total:13,color:'#ff6b9d',done:[1,2,3,4,5,6,7],notes:[]},
  {id:'linx2',name:'Linux Web-Codes',instructor:'JWNM3',type:'session',total:12,color:'#ff4757',done:[1,2,3,4],notes:[]},
  {id:'cmd1',name:'Command Line',instructor:'ElZero',type:'session',total:8,color:'#1e90ff',done:[1,2,3,4],notes:[]},
  {id:'git1',name:'Git & GitHub',instructor:'ElZero',type:'session',total:20,color:'#2ed573',done:[1,2,3,4,5,6,7,8,9,10],notes:[]},
  {id:'cs50',name:'CS50 Course',instructor:'Greeb ElSnake',type:'week',total:11,color:'#eccc68',done:[1],notes:[]},
];

function loadData(){ try{const s=localStorage.getItem(SK);return s?JSON.parse(s):{courses:DEF, goals: [], settings: {}}}catch(e){return{courses:DEF, goals: [], settings: {}};} }
function saveData(d){ localStorage.setItem(SK,JSON.stringify(d)); }

let state=loadData(),curView='dashboard',curCourseId=null,selectedColor='#6c63ff',delId=null,markUpCourseId=null;

/* ══ RENDER ══ */
function render(){ renderTabs(); curView==='dashboard'?renderDash():renderCourse(); }

function renderTabs(){
  const bar=document.getElementById('tabsBar');
  let h=`<div class="tab ${curView==='dashboard'?'active':''}" data-view="dashboard">🏠 الرئيسية</div>`;
  h+=state.courses.map(c=>{
    const on=curView==='course'&&curCourseId===c.id;
    return `<div class="tab ${on?'active':''}" data-view="course" data-id="${c.id}" style="${on?`background:${c.color};border-color:${c.color}`:''}">
      ${c.name.split(' ')[0]}</div>`;
  }).join('');
  bar.innerHTML=h;
  bar.querySelectorAll('.tab').forEach(t=>t.addEventListener('click',()=>{
    if(t.dataset.view==='dashboard'){curView='dashboard';curCourseId=null;}
    else{curView='course';curCourseId=t.dataset.id;}
    render();
  }));
}

function renderDash(){
  const tot=state.courses.reduce((a,c)=>a+c.total,0);
  const don=state.courses.reduce((a,c)=>a+c.done.length,0);
  const pct=tot?Math.round(don/tot*100):0;
  const comp=state.courses.filter(c=>c.done.length===c.total).length;
  const prog=state.courses.filter(c=>c.done.length>0&&c.done.length<c.total).length;
  
  // Goals rendering
  const today = new Date().toDateString();
  const todayGoals = state.goals.filter(g => g.date === today);
  const goalsCompleted = todayGoals.filter(g => g.completed).length;
  
  document.getElementById('mainContent').innerHTML=`
    <div class="dash-grid">
      <div class="stat-card c1"><div class="stat-num">${state.courses.length}</div><div class="stat-label">📚 الكورسات</div></div>
      <div class="stat-card c2"><div class="stat-num">${don}</div><div class="stat-label">✅ مكتمل</div></div>
      <div class="stat-card c3"><div class="stat-num">${comp}</div><div class="stat-label">🏆 خلصته</div></div>
      <div class="stat-card c4"><div class="stat-num">${prog}</div><div class="stat-label">🔥 جاري</div></div>
      <div class="stat-card c1"><div class="stat-num">${goalsCompleted}</div><div class="stat-label">🎯 أهداف اليوم</div></div>
      <div class="stat-card c2"><div class="stat-num">${todayGoals.length}</div><div class="stat-label">📋 الكل</div></div>
    </div>
    <div class="overall-card">
      <div class="overall-title">📊 التقدم الكلي</div>
      <div class="big-progress"><div class="big-progress-fill" style="width:${pct}%"></div></div>
      <div class="big-progress-label">
        <span>${don} / ${tot} وحدة</span>
        <span style="color:var(--a1);font-family:var(--nf);font-size:18px">${pct}%</span>
      </div>
    </div>
    <div class="course-dash-list">
      ${state.courses.map(c=>{
        const p=c.total?Math.round(c.done.length/c.total*100):0;
        const sl=c.done.length===c.total?'🏆 مكتمل':c.done.length>0?'🔥 جاري':'⏳ لم يبدأ';
        const sc=c.done.length===c.total?c.color:c.done.length>0?'var(--a2)':'var(--muted)';
        return `<div class="course-dash-item" onclick="openCourse('${c.id}')">
          <div class="course-dash-header">
            <div class="course-dash-name">${c.name}</div>
            <div class="course-dash-pct" style="color:${c.color}">${p}%</div>
          </div>
          <div class="mini-bar"><div class="mini-bar-fill" style="width:${p}%;background:linear-gradient(90deg,${c.color},${c.color}88)"></div></div>
          <div class="course-dash-meta">
            <span>${c.done.length}/${c.total} ${tl(c.type)}</span>
            <span style="color:${sc}">${sl}</span>
            ${c.instructor?`<span>👤 ${c.instructor}</span>`:''}
          </div>
        </div>`;
      }).join('')}
      ${state.courses.length===0?`<div class="empty"><div class="empty-icon">📭</div><p>مفيش كورسات!</p><p style="font-size:13px">اضغط "+ كورس"</p></div>`:''}
    </div>`;
}

function tl(t){return{session:'session',week:'week',video:'video',lecture:'lecture'}[t]||'unit';}
function openCourse(id){curCourseId=id;curView='course';render();}

function renderCourse(){
  const c=state.courses.find(x=>x.id===curCourseId);
  if(!c){curView='dashboard';render();return;}
  const p=c.total?Math.round(c.done.length/c.total*100):0;
  const cpH=Array.from({length:c.total},(_,i)=>i+1).map(n=>{
    const d=c.done.includes(n);
    return `<div class="cp ${d?'done':''}" onclick="toggleCP('${c.id}',${n})">
      <span class="cp-num">${n}</span>
      <span class="cp-type">${tl(c.type).charAt(0).toUpperCase()}</span>
    </div>`;
  }).join('');
  
  // Notes rendering
  const notesHtml = c.notes && c.notes.length > 0 ? `
    <div class="checkpoint-section">
      <div class="checkpoint-title"><span>📝 ملاحظات</span><span style="color:var(--a2)">${c.notes.length}</span></div>
      <div class="notes-list">
        ${c.notes.map((note, idx) => `
          <div class="note-item">
            <div class="note-content">${note.text}</div>
            <div class="note-meta">${note.date}
              <button onclick="deleteNote('${c.id}', ${idx})" style="margin-right: 10px; color: #ef476f; background: none; border: none; cursor: pointer; font-size: 12px;">
                🗑️
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';
  
  document.getElementById('mainContent').innerHTML=`
    <button class="back-btn" onclick="curView='dashboard';curCourseId=null;render()">← رجوع</button>
    <div class="course-header">
      <div class="course-header-bg">📖</div>
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div class="course-title" style="color:${c.color}">${c.name}</div>
          <div class="course-subtitle">${c.instructor||'&nbsp;'}</div>
        </div>
        <button onclick="confirmDel('${c.id}')" style="background:rgba(239,71,111,.15);border:1px solid rgba(239,71,111,.3);color:#ef476f;border-radius:8px;padding:6px 12px;cursor:pointer;font-size:12px;font-family:Cairo,sans-serif">🗑️ حذف</button>
      </div>
      <div class="course-stats-row">
        <div class="cstat"><div class="cstat-num" style="color:${c.color}">${p}%</div><div class="cstat-lbl">مكتمل</div></div>
        <div class="cstat"><div class="cstat-num" style="color:var(--a2)">${c.done.length}</div><div class="cstat-lbl">تم</div></div>
        <div class="cstat"><div class="cstat-num" style="color:var(--muted)">${c.total-c.done.length}</div><div class="cstat-lbl">متبقي</div></div>
        <div class="cstat"><div class="cstat-num" style="color:var(--a1)">${c.total}</div><div class="cstat-lbl">إجمالي</div></div>
      </div>
      <div class="course-progress-bar">
        <div class="course-progress-fill" style="width:${p}%;background:linear-gradient(90deg,${c.color},${c.color}88);box-shadow:0 0 8px ${c.color}66"></div>
      </div>
    </div>
    <div class="checkpoint-section">
      <div class="checkpoint-title"><span>Checkpoints</span><span style="color:var(--a2)">${c.done.length}/${c.total}</span></div>
      <div class="cp-actions">
        <button class="cp-action-btn" onclick="markAll('${c.id}')">✅ الكل</button>
        <button class="cp-action-btn" onclick="clearAll('${c.id}')">🔄 مسح</button>
        <button class="cp-action-btn" onclick="markUpTo('${c.id}')">📌 حتى رقم</button>
        <button class="cp-action-btn" onclick="addNote('${c.id}')">📝 ملاحظة</button>
      </div>
      <div class="cp-grid">${cpH}</div>
    </div>
    ${notesHtml}
  `;
}

/* ══ ACTIONS ══ */
function toggleCP(id,n){
  const c=state.courses.find(x=>x.id===id);if(!c)return;
  const was=c.done.length===c.total;
  if(c.done.includes(n))c.done=c.done.filter(x=>x!==n);
  else{c.done.push(n);c.done.sort((a,b)=>a-b);showToast(`✅ ${tl(c.type)} ${n} مكتملة!`);}
  if(!was&&c.done.length===c.total)setTimeout(celebrate,300);
  saveData(state);render();
}
function markAll(id){const c=state.courses.find(x=>x.id===id);if(!c)return;c.done=Array.from({length:c.total},(_,i)=>i+1);saveData(state);celebrate();render();}
function clearAll(id){const c=state.courses.find(x=>x.id===id);if(!c)return;c.done=[];saveData(state);render();showToast('🔄 تم مسح التقدم');}
function markUpTo(id){
  markUpCourseId = id;
  document.getElementById('markUpToNum').value = '';
  document.getElementById('markUpModal').classList.add('show');
}

function confirmMarkUp(){
  const n = document.getElementById('markUpToNum').value;
  if(!n||isNaN(n)){
    showToast('❌ اكتب رقم صحيح');
    return;
  }
  const c = state.courses.find(x=>x.id===markUpCourseId);if(!c)return;
  const mx=Math.min(parseInt(n),c.total);
  c.done=Array.from({length:mx},(_,i)=>i+1);
  saveData(state);
  document.getElementById('markUpModal').classList.remove('show');
  render();
  showToast(`📌 تم تحديد ${mx} ${tl(c.type)}`);
}
function confirmDel(id){delId=id;document.getElementById('deleteModal').classList.add('show');}
document.getElementById('deleteCancelBtn').onclick=()=>{document.getElementById('deleteModal').classList.remove('show');delId=null;};
document.getElementById('deleteConfirmBtn').onclick=()=>{
  if(delId){state.courses=state.courses.filter(c=>c.id!==delId);saveData(state);curView='dashboard';curCourseId=null;document.getElementById('deleteModal').classList.remove('show');delId=null;render();showToast('🗑️ تم الحذف');}
};

document.getElementById('addCourseBtn').onclick=()=>document.getElementById('modal').classList.add('show');
document.getElementById('modalCancel').onclick=()=>document.getElementById('modal').classList.remove('show');

document.getElementById('colorRow').querySelectorAll('.color-opt').forEach(el=>{
  el.onclick=()=>{document.querySelectorAll('#colorRow .color-opt').forEach(x=>x.classList.remove('selected'));el.classList.add('selected');selectedColor=el.dataset.color;};
});

document.getElementById('modalSave').onclick=()=>{
  const name=document.getElementById('mName').value.trim();
  const instr=document.getElementById('mInstructor').value.trim();
  const link=document.getElementById('mLink').value.trim();
  const type=document.getElementById('mType').value;
  const total=parseInt(document.getElementById('mCount').value);
  if(!name||!total||total<1){showToast('❌ اكمل البيانات');return;}
  state.courses.push({id:'c_'+Date.now(),name,instructor:instr,link:link,type,total,color:selectedColor,done:[],notes:[]});
  saveData(state);document.getElementById('modal').classList.remove('show');
  document.getElementById('mName').value='';document.getElementById('mInstructor').value='';document.getElementById('mLink').value='';document.getElementById('mCount').value='';
  render();showToast('🎉 تم إضافة الكورس!');
};

// Notes functions
function addNote(courseId){
  const text = prompt('اكتب ملاحظتك:');
  if(text && text.trim()){
    const course = state.courses.find(c => c.id === courseId);
    if(!course.notes) course.notes = [];
    course.notes.push({
      text: text.trim(),
      date: new Date().toLocaleDateString('ar-EG')
    });
    saveData(state);
    render();
    showToast('📝 تم إضافة الملاحظة');
  }
}

function deleteNote(courseId, noteIndex){
  const course = state.courses.find(c => c.id === courseId);
  if(course && course.notes && course.notes[noteIndex]){
    if(confirm('هل أنت متأكد من حذف هذه الملاحظة؟')){
      course.notes.splice(noteIndex, 1);
      saveData(state);
      render();
      showToast('🗑️ تم حذف الملاحظة');
    }
  }
}

// Export/Import Data Functions
function exportData(){
  const dataStr = JSON.stringify(state, null, 2);
  const blob = new Blob([dataStr], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'course-tracker-backup-' + new Date().toISOString().split('T')[0] + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('💾 تم تصدير البيانات!');
}

function importData(event){
  const file = event.target.files[0];
  if(!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e){
    try{
      const importedData = JSON.parse(e.target.result);
      if(importedData.courses && Array.isArray(importedData.courses)){
        state = importedData;
        saveData(state);
        render();
        showToast('📥 تم استيراد البيانات!');
      } else {
        showToast('❌ ملف غير صالح');
      }
    } catch(err){
      showToast('❌ خطأ في قراءة الملف');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

// Goals functions
function addGoal(){
  const goal = prompt('أضف هدفاً جديداً:');
  if(goal && goal.trim()){
    state.goals.push({
      id: 'g_' + Date.now(),
      text: goal.trim(),
      date: new Date().toDateString(),
      completed: false
    });
    saveData(state);
    render();
    showToast('🎯 تم إضافة الهدف');
  }
}

function toggleGoal(goalId){
  const goal = state.goals.find(g => g.id === goalId);
  if(goal){
    goal.completed = !goal.completed;
    saveData(state);
    render();
    showToast(goal.completed ? '✅ تم إنجاز الهدف!' : '🔄 تم إعادة الهدف');
  }
}

/* ══ HELPERS ══ */
function showToast(msg){
  const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');
  clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),2500);
}
function celebrate(){
  const P={
    cosmic:['#6c63ff','#00d4aa','#ff6b9d','#ffd166'],
    amethyst:['#7A3F91','#C59DD9','#F2EAF7','#c084e0'],
    topaz:['#E6A520','#FFD77A','#FFF8E7','#d4870a'],
    cyber:['#00ffcc','#ff0080','#ffe600','#00e5ff'],
    aurora:['#00ff87','#60efff','#ff00ff','#7b2cbf'],
    ocean:['#006d77','#83c5be','#edf6f9','#e29578'],
    sunset:['#ff9f1c','#ffbf69','#ffffff','#2ec4b6'],
    galaxy:['#7400b8','#6930c3','#5e60ce','#48bfe3'],
    neon:['#ff00ff','#00ffff','#ffff00','#ff0080'],
    forest:['#2d6a4f','#40916c','#52b788','#74c69d']
  };
  const cl=P[curTheme]||P.cosmic;
  for(let i=0;i<45;i++)setTimeout(()=>{
    const el=document.createElement('div');el.className='confetti';
    el.style.cssText=`left:${Math.random()*100}vw;top:-10px;background:${cl[Math.floor(Math.random()*cl.length)]};width:${Math.random()*10+4}px;height:${Math.random()*10+4}px;border-radius:${Math.random()>.5?'50%':'2px'};animation-duration:${Math.random()*1+1}s;animation-delay:${Math.random()*.5}s;`;
    document.body.appendChild(el);setTimeout(()=>el.remove(),2000);
  },i*30);
  showToast('🎉 كورس مكتمل! أنت نجم!');
}

document.querySelectorAll('.modal-overlay').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('show')}));

/* ══ INIT ══ */
applyTheme();
render();
