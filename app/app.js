const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

let dirHandle=null;
let state={tareas:{actualizado:'',tareas:[]},prospectos:{actualizado:'',prospectos:[]},mensajes:{actualizado:'',mensajes:[]},clientes:{actualizado:'',clientes:[]},cotizaciones:{actualizado:'',cotizaciones:[]},finanzas:{actualizado:'',metaMes:10000,movimientos:[]},contenido:{actualizado:'',publicaciones:[]},agenda:{actualizado:'',reuniones:[]},bitacora:{actualizado:'',eventos:[]},reportes:{actualizado:'',reportes:[]}};

function normalizeState(){
  if(!state.clientes||!Array.isArray(state.clientes.clientes))state.clientes={actualizado:'',clientes:[]};
  if(!state.cotizaciones||!Array.isArray(state.cotizaciones.cotizaciones))state.cotizaciones={actualizado:'',cotizaciones:[]};
  if(!state.finanzas||!Array.isArray(state.finanzas.movimientos))state.finanzas={actualizado:'',metaMes:10000,movimientos:[]};
  if(!state.contenido||!Array.isArray(state.contenido.publicaciones))state.contenido={actualizado:'',publicaciones:[]};
  if(!state.agenda||!Array.isArray(state.agenda.reuniones))state.agenda={actualizado:'',reuniones:[]};
  if(!state.bitacora||!Array.isArray(state.bitacora.eventos))state.bitacora={actualizado:'',eventos:[]};
  if(!state.reportes||!Array.isArray(state.reportes.reportes))state.reportes={actualizado:'',reportes:[]};
  if(!state.finanzas.metaMes)state.finanzas.metaMes=10000;
  state.prospectos.prospectos.forEach(p=>{if(p.monto===undefined)p.monto=0});
  state.cotizaciones.cotizaciones.forEach(function(q){
    if(!Array.isArray(q.items)){if(q.servicio||q.precio)q.items=[{descripcion:q.servicio||'Servicio',precio:q.precio||0}];else q.items=[]}
    if(!q.folio)q.folio='COT-'+new Date().getFullYear()+'-'+(state.cotizaciones.cotizaciones.indexOf(q)+1).toString().padStart(3,'0')
  });
}

let editingTask=null,editingP=null,editingC=null,editingQ=null,editingK=null;
let toastTimer=null;

function hideToast(){$('#toast').classList.remove('show')}
function toast(t,kind,action){
  const e=$('#toast');e.className='toast';e.innerHTML='';
  const span=document.createElement('span');span.textContent=t;e.appendChild(span);
  if(kind==='err')e.classList.add('err');
  if(action){
    const b=document.createElement('button');b.className='btn ghost small';b.textContent=action.label;
    b.addEventListener('click',function(){hideToast();action.fn()});
    e.appendChild(b);
  }
  e.classList.add('show');
  clearTimeout(toastTimer);toastTimer=setTimeout(hideToast,action?6000:2600);
}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function fmtDate(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function today(){return fmtDate(new Date())}
function weekStart(){var d=new Date();var day=(d.getDay()+6)%7;d.setDate(d.getDate()-day);return fmtDate(d)}
function esc(s){return String(s??'').replace(/[&<>"']/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])})}
function stamp(){var d=new Date();return fmtDate(d)+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')}
function seenIds(){try{return new Set(JSON.parse(localStorage.getItem('dsw-seen-msgs')||'[]'))}catch(e){return new Set()}}
function unseenCount(){var s=seenIds();return state.mensajes.mensajes.filter(function(m){return m.estado==='atendido'&&m.respuesta&&!s.has(m.id)}).length}
function markSeen(){var s=seenIds();var ch=false;state.mensajes.mensajes.forEach(function(m){if(m.estado==='atendido'&&m.respuesta&&!s.has(m.id)){s.add(m.id);ch=true}});if(ch)localStorage.setItem('dsw-seen-msgs',JSON.stringify(Array.from(s)));updateBadge()}
function updateBadge(){var n=unseenCount(),b=$('#msgBadge');b.textContent=n;b.classList.toggle('hidden',!n)}
function mxn(n){return '$'+Number(n||0).toLocaleString('es-MX')}
function goTab(name){var b=document.querySelector('nav button[data-tab="'+name+'"]');if(b)b.click()}
function resetDateDefaults(){['cInicio','cEntrega','qFecha','kFecha','fFecha'].forEach(function(id){var el=document.getElementById(id);if(el&&!el.value)el.value=today()})}

async function idbOpen(){return new Promise(function(res,rej){var r=indexedDB.open('dsw-os',1);r.onupgradeneeded=function(){r.result.createObjectStore('kv')};r.onsuccess=function(){res(r.result)};r.onerror=function(){rej(r.error)}})}
async function idbSet(k,v){var db=await idbOpen();return new Promise(function(res,rej){var tx=db.transaction('kv','readwrite');tx.objectStore('kv').put(v,k);tx.oncomplete=function(){res()};tx.onerror=function(){rej(tx.error)}})}
async function idbGet(k){var db=await idbOpen();return new Promise(function(res,rej){var tx=db.transaction('kv','readonly');var q=tx.objectStore('kv').get(k);q.onsuccess=function(){res(q.result)};q.onerror=function(){rej(q.error)}})}

function setConn(mode){var dot=$('#connDot'),txt=$('#connTxt');dot.className='dot'+(mode==='file'?' on':mode==='local'?' local':'');txt.textContent=mode==='file'?'Conectado a app/':mode==='local'?'Modo local (solo navegador)':mode==='err'?'Error al guardar en disco':'Sin conexion a archivos'}

async function readJSON(name,sub){
  try{var h=dirHandle;if(sub)h=await h.getDirectoryHandle(sub);var fh=await h.getFileHandle(name);var f=await fh.getFile();var txt=await f.text();try{return JSON.parse(txt)}catch(e){toast(name+' tiene JSON invalido','err');return null}}catch(e){return null}
}
async function writeJSON(name,obj,sub){
  if(!dirHandle)return false;try{var h=dirHandle;if(sub)h=await h.getDirectoryHandle(sub,{create:true});var fh=await h.getFileHandle(name,{create:true});var w=await fh.createWritable();await w.write(JSON.stringify(obj,null,2));await w.close();return true}catch(e){console.error(e);return false}
}

async function save(which){
  var targets=[];
  if(which==='tareas'||!which){state.tareas.actualizado=stamp();targets.push(['tareas.json',state.tareas,null])}
  if(which==='prospectos'||!which){state.prospectos.actualizado=stamp();targets.push(['prospectos.json',state.prospectos,'data'])}
  if(which==='mensajes'||!which){state.mensajes.actualizado=stamp();targets.push(['mensajes.json',state.mensajes,'data'])}
  if(which==='clientes'||!which){state.clientes.actualizado=stamp();targets.push(['clientes.json',state.clientes,'data'])}
  if(which==='cotizaciones'||!which){state.cotizaciones.actualizado=stamp();targets.push(['cotizaciones.json',state.cotizaciones,'data'])}
  if(which==='finanzas'||!which){state.finanzas.actualizado=stamp();targets.push(['finanzas.json',state.finanzas,'data'])}
  if(which==='contenido'||!which){state.contenido.actualizado=stamp();targets.push(['contenido.json',state.contenido,'data'])}
  if(which==='agenda'||!which){state.agenda.actualizado=stamp();targets.push(['agenda.json',state.agenda,'data'])}
  if(which==='bitacora'||!which){state.bitacora.actualizado=stamp();targets.push(['bitacora.json',state.bitacora,'data'])}
  if(which==='reportes'||!which){state.reportes.actualizado=stamp();targets.push(['reportes.json',state.reportes,'data'])}
  normalizeState();
  localStorage.setItem('dsw-state',JSON.stringify(state));
  if(!dirHandle)return true;
  var ok=true;
  for(var i=0;i<targets.length;i++){var n=targets[i][0],o=targets[i][1],s=targets[i][2];if(!await writeJSON(n,o,s))ok=false}
  if(!ok){setConn('err');toast('No pude guardar en disco. Tus cambios estan solo en el navegador; reconecta la carpeta.','err')}
  else setConn('file');
  return ok;
}

async function loadAll(){
  var cache=localStorage.getItem('dsw-state');
  if(cache){try{state=JSON.parse(cache)}catch(e){}}
  normalizeState();
if(dirHandle){
    var t=await readJSON('tareas.json');
    var p=await readJSON('prospectos.json','data');
    var m=await readJSON('mensajes.json','data');
    var cl=await readJSON('clientes.json','data');
    var co=await readJSON('cotizaciones.json','data');
    var fi=await readJSON('finanzas.json','data');
    var ct=await readJSON('contenido.json','data');
    var ag=await readJSON('agenda.json','data');
    var bc=await readJSON('bitacora.json','data');
    var rp=await readJSON('reportes.json','data');
    if(t)state.tareas=t;if(p)state.prospectos=p;if(m)state.mensajes=m;if(cl)state.clientes=cl;if(co)state.cotizaciones=co;if(fi)state.finanzas=fi;if(ct)state.contenido=ct;if(ag)state.agenda=ag;if(bc)state.bitacora=bc;if(rp)state.reportes=rp;
    normalizeState();localStorage.setItem('dsw-state',JSON.stringify(state));
  }else{
    try{
      var t=await fetch('app/data/tareas.json').then(function(r){return r.json()}).catch(function(){});
      var p=await fetch('app/data/prospectos.json').then(function(r){return r.json()}).catch(function(){});
      var m=await fetch('app/data/mensajes.json').then(function(r){return r.json()}).catch(function(){});
      var cl=await fetch('app/data/clientes.json').then(function(r){return r.json()}).catch(function(){});
      var co=await fetch('app/data/cotizaciones.json').then(function(r){return r.json()}).catch(function(){});
      var fi=await fetch('app/data/finanzas.json').then(function(r){return r.json()}).catch(function(){});
      var ct=await fetch('app/data/contenido.json').then(function(r){return r.json()}).catch(function(){});
      var ag=await fetch('app/data/agenda.json').then(function(r){return r.json()}).catch(function(){});
      var bc=await fetch('app/data/bitacora.json').then(function(r){return r.json()}).catch(function(){});
      var rp=await fetch('app/data/reportes.json').then(function(r){return r.json()}).catch(function(){});
      if(t)state.tareas=t;if(p)state.prospectos=p;if(m)state.mensajes=m;if(cl)state.clientes=cl;if(co)state.cotizaciones=co;if(fi)state.finanzas=fi;if(ct)state.contenido=ct;if(ag)state.agenda=ag;if(bc)state.bitacora=bc;if(rp)state.reportes=rp;
      if(!t&&typeof window.SEED_DATA!=='undefined'){state.tareas=window.SEED_DATA.tareas;state.prospectos=window.SEED_DATA.prospectos;state.mensajes=window.SEED_DATA.mensajes;state.clientes=window.SEED_DATA.clientes;state.cotizaciones=window.SEED_DATA.cotizaciones;state.finanzas=window.SEED_DATA.finanzas;state.contenido=window.SEED_DATA.contenido;state.agenda=window.SEED_DATA.agenda;state.bitacora=window.SEED_DATA.bitacora;state.reportes=window.SEED_DATA.reportes}
      normalizeState();localStorage.setItem('dsw-state',JSON.stringify(state));
    }catch(e){
      try{if(typeof window.SEED_DATA!=='undefined'){state.tareas=window.SEED_DATA.tareas;state.prospectos=window.SEED_DATA.prospectos;state.mensajes=window.SEED_DATA.mensajes;state.clientes=window.SEED_DATA.clientes;state.cotizaciones=window.SEED_DATA.cotizaciones;state.finanzas=window.SEED_DATA.finanzas;state.contenido=window.SEED_DATA.contenido;state.agenda=window.SEED_DATA.agenda;state.bitacora=window.SEED_DATA.bitacora;state.reportes=window.SEED_DATA.reportes}state=JSON.parse(localStorage.getItem('dsw-state')||'{}')}catch(e2){}
    }
  }
  renderAll();
}

async function connect(){
  if(location.protocol==='file:'){toast('Abre la app desde un servidor local para conectar carpeta: doble click en serve.bat','err');return}
  if(!window.showDirectoryPicker){toast('Tu navegador no soporta acceso a archivos. Usa Edge o Chrome.','err');return}
  try{dirHandle=await window.showDirectoryPicker({mode:'readwrite'});var app=dirHandle;try{app=await dirHandle.getDirectoryHandle('app')}catch(e){}var probe=null;try{probe=await app.getFileHandle('tareas.json')}catch(e){}if(probe)dirHandle=app;await idbSet('handle',dirHandle);await loadAll();setConn('file');$('#onboard').classList.add('hidden');localStorage.setItem('dsw-onboard','1');toast('Carpeta conectada. Todo se guarda en los JSON.')}catch(e){toast('Conexión cancelada. La app funciona perfectamente sin carpeta — datos guardados en el navegador.','err')}
}
async function restore(){
  if(location.protocol==='file:'&&!window.showDirectoryPicker){setConn('local');return}
  if(location.protocol==='file:'){setConn('local');return}
  if(!window.showDirectoryPicker){setConn('local');return}
  try{var h=await idbGet('handle');if(!h){setConn('none');return}var q=await h.queryPermission({mode:'readwrite'});if(q==='granted'){dirHandle=h;setConn('file')}else{setConn('none')}}catch(e){setConn('none')}
}

var NAV_ITEMS=[
  {id:'dashboard',label:'Dashboard',icon:'i-dash'},
  {id:'pipeline',label:'Pipeline',icon:'i-funnel'},
  {id:'proyectos',label:'Proyectos',icon:'i-briefcase'},
  {id:'agenda',label:'Agenda',icon:'i-calendar'},
  {id:'cotizaciones',label:'Cotizaciones',icon:'i-file'},
  {id:'finanzas',label:'Finanzas',icon:'i-wallet'},
  {id:'contenido',label:'Contenido',icon:'i-image'},
  {id:'metricas',label:'Metricas',icon:'i-chart'},
  {id:'tareas',label:'Tareas',icon:'i-check'},
  {id:'mensajes',label:'Mensajes',icon:'i-mail'},
  {id:'bitacora',label:'Bitacora',icon:'i-timeline'},
  {id:'reportes',label:'Reportes',icon:'i-report'},
  {id:'ayuda',label:'Ayuda',icon:'i-help'}
];

function buildNav(){
  var nav=document.getElementById('sidebarNav');
  var html='';
  NAV_ITEMS.forEach(function(item){
    html+='<button role="tab" data-tab="'+item.id+'" aria-controls="tab-'+item.id+'" aria-selected="false"><svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><use href="#'+item.icon+'"/></svg><span class="nav-label">'+item.label+'</span></button>';
  });
  nav.innerHTML=html;
  var dnav=document.getElementById('drawerNav');
  var dhtml='';
  NAV_ITEMS.forEach(function(item){
    dhtml+='<button role="tab" data-tab="'+item.id+'" aria-controls="tab-'+item.id+'" aria-selected="false"><svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><use href="#'+item.icon+'"/></svg><span class="nav-label">'+item.label+'</span></button>';
  });
  dnav.innerHTML=dhtml;
  $$('nav button[data-tab]').forEach(function(b){b.addEventListener('click',function(){switchTab(b.dataset.tab)})});
}

function switchTab(name){
  $$('nav button').forEach(function(x){x.classList.remove('active');x.setAttribute('aria-selected','false')});
  $$('.tab-panel').forEach(function(x){x.classList.remove('active')});
  var b=document.querySelector('nav button[data-tab="'+name+'"]');
  if(b){b.classList.add('active');b.setAttribute('aria-selected','true')}
  var panel=document.getElementById('tab-'+name);
  if(panel)panel.classList.add('active');
  if(name==='dashboard')renderDashboard();
  if(name==='pipeline')renderPipeline();
  if(name==='agenda')renderAgenda();
  if(name==='bitacora')renderBitacora();
  if(name==='reportes')renderReportesSel();
  if(name==='tareas')renderTasks();
  if(name==='proyectos')renderProyectos();
  if(name==='cotizaciones')renderCotizaciones();
  if(name==='finanzas')renderFinanzas();
  if(name==='contenido')renderContenido();
  if(name==='metricas')renderMetrics();
  if(name==='ayuda')renderAyuda();
  closeDrawer();
}

function openDrawer(){document.getElementById('drawerPanel').classList.add('open');document.getElementById('drawerOverlay').classList.add('open')}
function closeDrawer(){document.getElementById('drawerPanel').classList.remove('open');document.getElementById('drawerOverlay').classList.remove('open')}

function log(tipo,titulo,detalle,monto){
  state.bitacora.eventos.push({id:uid(),fecha:stamp(),tipo,titulo,detalle,monto:Number(monto||0),origen:'app',actualizado:stamp()});
  if(state.bitacora.eventos.length>500)state.bitacora.eventos=state.bitacora.eventos.slice(-500);
  state.bitacora.actualizado=stamp();
  save('bitacora');
}
function renderBitacora(){
  var arr=[].concat(state.bitacora.eventos).reverse();
  var el=$('#bitList');
  var first=arr.length?arr[arr.length-1].fecha:'';
  $('#bitDesde').textContent=arr.length?'Operando desde '+first:'';
  $('#bitCount').textContent=arr.length+' evento(s)';
  if(!arr.length){el.innerHTML='<div class="card" style="color:var(--muted)">Sin eventos. Cada accion quedara registrada aqui.</div>';return}
  var html='';
  arr.forEach(function(e){
    var dotCls=e.tipo==='cobro'?'cobro':e.tipo==='egreso'?'egreso':e.tipo==='sistema'?'sistema':'';
    html+='<div class="timeline-item"><div class="tl-dot '+dotCls+'"></div><div class="tl-content"><div class="tl-title">'+esc(e.titulo)+'</div><div class="tl-detail">'+esc(e.detalle)+'</div><div class="tl-date">'+esc(e.fecha)+'</div></div></div>';
  });
  el.innerHTML=html;
}

function renderAgenda(){
  renderAgendaForm();
  var arr=[].concat(state.agenda.reuniones).sort(function(a,b){var da=a.estado==='Próximamente'?0:1;var db=b.estado==='Próximamente'?0:1;if(da!==db)return da-db;return(a.fecha||'')<(b.fecha||'')?-1:1});
  var el=$('#agendaList');
  if(!arr.length){el.innerHTML='<div class="card" style="color:var(--muted)">Sin reuniones. Agrega la primera arriba.</div>';return}
  var html='';
  arr.forEach(function(a){
    var estCls=a.estado==='Próximamente'?'proximamente':a.estado==='Realizada'?'realizada':'cancelada';
    var btn=a.estado==='Próximamente'?'<button class="btn ghost small" data-amarca="'+esc(a.id)+'">Marcar Realizada</button>':'';
    html+='<div class="agenda-item"><div class="ag-time">'+esc(a.fecha)+' '+esc(a.hora)+'</div><div class="agenda-info" style="flex:1"><div class="ag-title">'+esc(a.titulo)+'</div><div class="ag-detail">'+esc(a.tipo)+' · '+esc(a.participante)+' · '+esc(a.notas||'')+'</div><span class="chip '+estCls+'">'+esc(a.estado)+'</span>'+btn+'</div></div>';
  });
  el.innerHTML=html;
  $$('[data-amarca]').forEach(function(b){
    b.addEventListener('click',async function(){
      var r=state.agenda.reuniones.find(function(x){return x.id===b.dataset.amarca});if(!r)return;
      r.estado='Realizada';
      var res=prompt('Escribe el resultado de la reunion (obligatorio):','');
      if(res===null)return;
      if(!res.trim()){toast('El resultado es obligatorio','err');return}
      r.resultado=res.trim();r.actualizado=stamp();
      await save('agenda');renderAgenda();
      log('reunion','Reunion realizada',r.titulo+' - '+r.resultado);
      toast('Reunion marcada como realizada');
    });
  });
}
function renderAgendaForm(){
  var card=$('#agendaFormCard');
  card.innerHTML='<h3>Agregar reunion</h3><div class="form-row"><div><label for="aTitulo">Titulo</label><input id="aTitulo" placeholder="Reunion semanal de socios"></div><div><label for="aTipo">Tipo</label><select id="aTipo"><option>Diagnostico</option><option>Entrega</option><option selected>Socios</option><option>Otro</option></select></div></div><div class="form-row"><div><label for="aFecha">Fecha</label><input type="date" id="aFecha"></div><div><label for="aHora">Hora</label><input type="time" id="aHora" value="10:00"></div></div><div class="form-row"><div><label for="aDur">Duracion (min)</label><input type="number" id="aDur" value="30" min="5"></div><div><label for="aPart">Participante</label><input id="aPart" placeholder="Daniel + companero"></div></div><div class="form-row one"><div><label for="aNotas">Notas</label><input id="aNotas" placeholder="Métricas, proyectos, próxima semana"></div></div><div style="display:flex;align-items:flex-end"><button class="btn" id="addAgenda">+ Agregar reunion</button></div>';
  $('#addAgenda').addEventListener('click',async function(){
    var t=$('#aTitulo').value.trim(),tp=$('#aTipo').value,f=$('#aFecha').value,h=$('#aHora').value,dur=$('#aDur').value,pa=$('#aPart').value,no=$('#aNotas').value.trim();
    if(!t){toast('Escribe el titulo','err');return}
    var n=state.agenda.reuniones.find(function(x){return x.fecha===f&&x.hora===h&&x.titulo===t});
    if(n){toast('Esa reunion ya existe','err');return}
    state.agenda.reuniones.push({id:uid(),titulo:t,tipo:tp,fecha:f,hora:h,duracionMin:parseInt(dur)||30,participante:pa,notas:no,estado:'Próximamente',resultado:'',actualizado:stamp()});
    await save('agenda');renderAgenda();toast('Reunion agregada');log('reunion','Reunion agregada',t);
  });
}

function renderDashboard(){
  var ps=state.prospectos.prospectos;
  var mk=today().slice(0,7);
  var ing=(state.finanzas.movimientos||[]).filter(function(m){return(m.fecha||'').slice(0,7)===mk&&m.tipo==='ingreso'}).reduce(function(s,m){return s+Number(m.monto||0)},0);
  var meta=Number(state.finanzas.metaMes||0);
  var prob={Nuevo:.10,Contactado:.20,Respondió:.40,Reunión:.60,Cotizado:.80,Cerrado:1,'Sin respuesta':.05};
  var pipelineW=ps.reduce(function(s,p){return s+(Number(p.monto||0)*prob[p.estado]||0)},0);
  var pipelineBruto=ps.reduce(function(s,p){return s+Number(p.monto||0)},0);
  var cerrados=ps.filter(function(p){return p.estado==='Cerrado'&&p.fechaCierre&&p.fechaCierre.slice(0,7)===mk}).length;
  var totalPs=ps.length;var respuestos=ps.filter(function(p){return['Respondió','Reunión','Cotizado','Cerrado'].includes(p.estado)}).length;var tasaResp=totalPs?Math.round(respuestos/totalPs*100):0;
  var porCobrar=(state.clientes.clientes||[]).filter(function(c){return c.estado!=='Entregado'}).reduce(function(s,c){return s+Math.max(0,Number(c.precio||0)-Number(c.anticipo||0))},0);
  var todayTasks=[].concat(state.tareas.tareas).filter(function(t){return!t.hecha&&t.vence&&t.vence<=today()}).slice(0,5);

  var kpis=[
    {label:'Ingresos del mes',val:mxn(ing),sub:'meta: '+mxn(meta),pct:meta?Math.min(100,ing/meta*100):0},
    {label:'Pipeline ponderado',val:mxn(Math.round(pipelineW)),sub:'bruto: '+mxn(pipelineBruto)},
    {label:'Cierres del mes',val:cerrados.toString(),sub:'meta: 3',cls:cerrados>=3?'ok':'danger'},
    {label:'Tasa de respuesta',val:tasaResp+'%',sub:respuestos+' de '+totalPs,cls:tasaResp>=20?'ok':'danger'},
    {label:'Por cobrar',val:mxn(porCobrar),sub:porCobrar>0?'Esperando pago':'Al dia',cls:porCobrar>0?'danger':''},
    {label:'Tareas hoy',val:todayTasks.length.toString(),sub:'vencidas + hoy',cls:todayTasks.length>0?'warn':''}
  ];
  var kpiHtml='';
  kpis.forEach(function(k){
    kpiHtml+='<div class="kpi-tile '+(k.cls||'')+'"><div class="kpi-val">'+k.val+'</div><div class="kpi-label">'+k.label+'</div><div class="kpi-sub">'+k.sub+'</div>'+(k.pct>0?'<div class="kpi-bar"><i style="width:'+k.pct+'%"></i></div>':'')+'</div>';
  });
  $('#dashKPIs').innerHTML=kpiHtml;

  var todayTasksHtml=todayTasks.map(function(t){return'<div class="task" style="margin-bottom:6px"><div class="body"><div class="title">'+esc(t.titulo)+'</div>'+(t.categoria?'<span class="cat">'+esc(t.categoria)+'</span>':'')+'</div></div>';}).join('');
  $('#dashPriorities').innerHTML='<h3>Prioridades de hoy</h3>'+(todayTasksHtml?todayTasksHtml:'<div style="color:var(--muted);font-size:13px">Sin tareas vencidas hoy.</div>')+'<div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn small" id="dashCTA1">Enviar 10 contactos</button><button class="btn ghost small" id="dashCTA2">Publicar hoy</button><button class="btn ghost small" id="dashCTA3">Seguimientos</button></div>';
  $('#dashCTA1').addEventListener('click',function(){goTab('pipeline')});
  $('#dashCTA2').addEventListener('click',function(){goTab('contenido')});
  $('#dashCTA3').addEventListener('click',function(){goTab('pipeline')});

  var embudoEstados=['Nuevo','Contactado','Respondió','Reunión','Cotizado','Cerrado','Sin respuesta'];
  var embudoCounts=embudoEstados.map(function(e){return ps.filter(function(p){return p.estado===e}).length});
  var embHtml='<h3>Embudo</h3>';
  embudoEstados.forEach(function(e,i){
    var cnt=embudoCounts[i];
    var pct=i>0?(embudoCounts[i-1]>0?Math.round(cnt/embudoCounts[i-1]*100):0):100;
    embHtml+='<div class="embudo-col"><span class="embudo-label">'+e+'</span><div class="embudo-bar"><i style="width:'+Math.max(cnt,totalPs>0?cnt/totalPs*100:0)+'%"></i></div><span class="embudo-count">'+cnt+'</span><span class="embudo-pct">'+(i>0?pct+'%':'')+'</span></div>';
  });
  $('#dashEmbudo').innerHTML=embHtml;

  var rules=checkRules();
  var ruleHtml='<h3>Motor de reglas ('+rules.length+' alerta(s))</h3>';
  if(!rules.length){ruleHtml+='<div class="all-clear"><div>Sistema al dia — nada urgente</div></div>'}
  else{rules.forEach(function(r){
    ruleHtml+='<div class="rule-item"><span class="rule-sev '+r.sev+'">'+r.sev+'</span><div class="rule-body"><div class="rule-text">'+esc(r.text)+'</div><div class="rule-cta"><button class="btn ghost small" data-rulecta="'+r.tab+'"'+(r.filter?' data-filter="'+esc(r.filter)+'"':'')+'>'+r.cta+'</button></div></div></div>';
  })}
  $('#dashEngine').innerHTML=ruleHtml;
  $$('[data-rulecta]').forEach(function(b){b.addEventListener('click',function(){var ff=$('#filterEstado');if(ff&&b.dataset.filter){ff.value=b.dataset.filter;renderPipeline()}goTab(b.dataset.rulecta)})});

  var prox=[].concat(state.agenda.reuniones).filter(function(r){return r.estado==='Próximamente'}).sort(function(a,b){return(a.fecha||'')<(b.fecha||'')?-1:1}).slice(0,3);
  var agHtml='<h3>Proximas reuniones</h3>';
  if(prox.length){prox.forEach(function(r){agHtml+='<div class="agenda-item"><div class="ag-time">'+esc(r.fecha)+' '+esc(r.hora)+'</div><div class="agenda-info"><div class="ag-title">'+esc(r.titulo)+'</div><div class="ag-detail">'+esc(r.participante)+'</div></div></div>'});}
  else{agHtml+='<div style="color:var(--muted);font-size:13px">Sin proximas reuniones.</div>'}
  $('#dashAgenda').innerHTML=agHtml;

  var movs=[].concat(state.finanzas.movimientos).sort(function(a,b){return(b.fecha||'')<(a.fecha||'')?-1:1}).slice(0,5);
  var movHtml='<h3>Ultimos movimientos</h3>';
  if(movs.length){movs.forEach(function(m){movHtml+='<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);font-size:13px"><span style="color:'+(m.tipo==='ingreso'?'var(--ok)':'#ff8a8a')+'">'+(m.tipo==='ingreso'?'+':'−')+mxn(m.monto)+'</span><span style="color:var(--muted)">'+esc(m.concepto)+'</span><span style="font-family:ui-monospace,Consolas,monospace;font-size:11px">'+esc((m.fecha||'').slice(0,10))+'</span></div>'});}
  else{movHtml+='<div style="color:var(--muted);font-size:13px">Sin movimientos.</div>'}
  $('#dashMovimientos').innerHTML=movHtml;

  var primero=state.bitacora.eventos.length?state.bitacora.eventos[state.bitacora.eventos.length-1].fecha:'—';
  var pend=state.mensajes.mensajes.filter(function(m){return m.estado==='pendiente'}).length;
  var ultSync=localStorage.getItem('dsw-state')?new Date().toLocaleString('es-MX'):'—';
  $('#dashSistema').innerHTML='<h3>Estado del sistema</h3><div style="display:flex;flex-direction:column;gap:8px;font-size:13px"><div><b>Conexion:</b> '+(dirHandle?'Archivos':'Local')+'</div><div><b>Ultima sincronizacion:</b> '+ultSync+'</div><div><b>Mensajes pendientes:</b> '+pend+'</div><div><b>Operando desde:</b> '+primero+'</div></div>';
}

function checkRules(){
  var rules=[];
  var ps=state.prospectos.prospectos;var mk=today().slice(0,7);var meta=Number(state.finanzas.metaMes||0);var d=new Date();var day=d.getDate();
  state.cotizaciones.cotizaciones.forEach(function(q){if(q.respuesta==='Pendiente'&&q.fechaEnvio){var dEnv=new Date(q.fechaEnvio+'T00:00:00');var diff=Math.floor((new Date()-dEnv)/(86400000));if(diff>=3)rules.push({sev:'warn',text:'Cotización de '+q.prospecto+' sin respuesta desde hace '+diff+' días',cta:'Enviar seguimiento',tab:'cotizaciones'})}});
  ps.filter(function(p){return p.estado==='Contactado'}).forEach(function(p){var dC=new Date((p.fecha||'').replace(' ','T'));var diff=Math.floor((new Date()-dC)/(86400000));if(diff>=2)rules.push({sev:'warn',text:p.nombre+' contactado hace '+diff+' días sin seguimiento',cta:'Ver contactados',tab:'pipeline',filter:'Contactado'})});
  if(day>=20){var ing=(state.finanzas.movimientos||[]).filter(function(m){return(m.fecha||'').slice(0,7)===mk&&m.tipo==='ingreso'}).reduce(function(s,m){return s+Number(m.monto||0)},0);if(meta&&ing/meta<0.4)rules.push({sev:'danger',text:'Vas en '+Math.round(ing/meta*100)+'% de la meta con '+(30-day)+' días del mes',cta:'Abrir Finanzas',tab:'finanzas'})};
  state.contenido.publicaciones.forEach(function(k){if(k.estado==='Pendiente'&&k.fecha&&k.fecha<=today())rules.push({sev:'warn',text:'Publicación de hoy pendiente: '+k.titulo,cta:'Abrir Contenido',tab:'contenido'})});
  (state.clientes.clientes||[]).filter(function(c){return c.estado==='Esperando pago'}).forEach(function(c){var sal=Math.max(0,Number(c.precio||0)-Number(c.anticipo||0));if(sal>0)rules.push({sev:'danger',text:'Saldo por cobrar '+mxn(sal)+' en '+c.negocio,cta:'Abrir Proyectos',tab:'proyectos'})});
  var hoy=today();var man=new Date();man.setDate(man.getDate()+1);var manStr=fmtDate(man);
  state.agenda.reuniones.filter(function(r){return r.estado==='Próximamente'}).forEach(function(r){if(r.fecha===hoy||r.fecha===manStr)rules.push({sev:'info',text:'Mañana: '+r.titulo+' con '+r.participante,cta:'Abrir Agenda',tab:'agenda'})});
  var msgPend=state.mensajes.mensajes.filter(function(m){return m.estado==='pendiente'}).length;var tareasVen=[].concat(state.tareas.tareas).filter(function(t){return!t.hecha&&t.vence&&t.vence<today()}).length;
  if(msgPend===0&&state.mensajes.mensajes.some(function(m){return m.estado==='atendido'&&m.respuesta})&&tareasVen>=3)rules.push({sev:'info',text:'Hay '+tareasVen+' tareas vencidas; pide apoyo al cerebro',cta:'Abrir Mensajes',tab:'mensajes'});
  return rules;
}

var ESTADOS=['Nuevo','Contactado','Respondió','Reunión','Cotizado','Cerrado','Sin respuesta'];
var PROB={'Nuevo':.10,'Contactado':.20,'Respondió':.40,'Reunión':.60,'Cotizado':.80,'Cerrado':1,'Sin respuesta':.05};
var EST_CLS={'Nuevo':'nuevo','Contactado':'contactado','Respondió':'respondio','Reunión':'reunion','Cotizado':'cotizado','Cerrado':'cerrado','Sin respuesta':'sinrep'};
function waNum(p){var d=String(p.telefono||'').replace(/\D/g,'');if(d.slice(0,2)==='52')d=d.slice(2);return d.length===10?('521'+d):(d.length?('52'+d):'')}
var msgDirty=false;
function offerLine(m,neg){
  var t=String(neg||'').toLowerCase();m=Number(m||0);
  var alta=/\b(financiera|empresa|consultor|asesor|inmobiliaria|projal)\b/.test(t)||/\b(sistema|portal|plataforma|sucursal|app|tienda)\b/.test(t);
  if(alta||m>=4500)return 'Puedo desarrollarles un sistema a la medida (citas, gestión o portal) que centralice todo y les ahorre trabajo manual.';
  if(/clin|dent|odontolog|doctor|medic/.test(t))return 'Puedo hacerles una web profesional con sistema de citas en línea y recordatorios automáticos para sus pacientes.';
  if(/restaurant|restaurante|comida|bar|cafe|café|matera|alcalde/.test(t))return 'Puedo hacerles un sistema de reservaciones en línea y menú digital para que sus clientes reserven y pidan directo.';
  if(/tienda|boutique|estetica|salon|salón|shop|store/.test(t))return 'Puedo hacerles un catálogo o tienda en línea profesional, fácil de administrar.';
  return m>=2500?'Puedo hacerles una web profesional y a la medida de lo que necesitan.':'Puedo ayudarles con una presencia digital profesional para su negocio.';
}
function parseNota(s){
  s=String(s||'');
  var prop=(s.match(/[Pp]ropuesta\s*:\s*([^.]+)/)||[])[1];
  var det=s.replace(/\s*(?:WhatsApp|Tel(?:\.|éfono))[^.]*\.?/gi,'').replace(/\.?\s*[Pp]ropuesta[^.]*\.?/g,'').replace(/\.{2,}/g,'.').trim();
  return {det:det,prop:prop?prop.trim():''};
}
function buildMsg(p){
  var n=(p.nombre||'').trim();var neg=(p.negocio||'').trim();
  var generico=n&&!/^(gerencia|equipo)/i.test(n)&&!/encontrar/i.test(n);
  var hola=generico?('Hola '+n+', soy Daniel de D.Softworks, un equipo de ingenieros de software en Guadalajara.'):'Hola, buenas tardes. Soy Daniel de D.Softworks, un equipo de ingenieros de software en Guadalajara.';
  var t=parseNota(p.notas);
  var lineas=[hola];
  if(t.det){
    var d=t.det.replace(/^[.\s]+/,'').replace(/[.\s]+$/,'');
    d=d.replace(/^web en\s+/i,'su web está en ').replace(/^web\s+/i,'su web es ').replace(/^sin web propia\s*/i,'no tienen web propia').replace(/^sin web\s*/i,'no tienen web').replace(/^empresa\b/i,'su empresa').replace(/^clínica\b|^clinica\b/i,'su clínica').replace(/^financiera\b/i,'son una financiera').replace(/^restaurante\b|^restaurant\b/i,'su restaurante').replace(/^agencia\b/i,'su agencia');
    lineas.push('Detecté que '+d.replace(/^([A-Z])/,function(c){return c.toLowerCase()})+'.');
  }else if(neg){
    lineas.push('Vi '+neg+' en Guadalajara y creo que pueden aprovechar mucho mejor el mundo digital.');
  }
  lineas.push(offerLine(p.monto,neg));
  if(t.prop)lineas.push('En concreto les ayudaría con: '+t.prop+'.');
  lineas.push('¿Podemos platicar 10 minutos? Sin compromiso.');
  return lineas.join('\n\n');
}
function syncMsg(){if(msgDirty)return;var el=$('#pMensaje');if(!el)return;el.value=buildMsg({nombre:$('#pNombre')?$('#pNombre').value:'',negocio:$('#pNegocio')?$('#pNegocio').value:'',monto:Number($('#pMonto')?$('#pMonto').value:0),notas:$('#pNotas')?$('#pNotas').value:''})}
function waMsg(p){return p.mensaje||buildMsg(p)}
function waLink(p){var n=waNum(p);return n?('https://wa.me/'+n+'?text='+encodeURIComponent(waMsg(p))):''}
function renderPipeline(){
  var f=$('#filterEstado')?$('#filterEstado').value:'';
  var ps=state.prospectos.prospectos;
  var total=ps.length;
  var bruto=ps.reduce(function(s,p){return s+Number(p.monto||0)},0);
  var ponderado=ps.reduce(function(s,p){return s+(Number(p.monto||0)*PROB[p.estado]||0)},0);
  $('#pipeSub').textContent=total+' en total · bruto '+mxn(bruto)+' · ponderado '+mxn(Math.round(ponderado));
  $('#pipeKPIs').innerHTML='<div class="kpi-tile"><div class="kpi-val">'+total+'</div><div class="kpi-label">Prospectos</div></div><div class="kpi-tile"><div class="kpi-val">'+mxn(bruto)+'</div><div class="kpi-label">Pipeline bruto</div></div><div class="kpi-tile"><div class="kpi-val">'+mxn(Math.round(ponderado))+'</div><div class="kpi-label">Pipeline ponderado</div></div>';
  renderProspectForm();
  var fuentes=[].concat(new Set(ps.map(function(p){return p.fuente||'Otro'})));
  var ff=$('#pipeFilterFuente');ff.innerHTML='<option value="">Todas las fuentes</option>'+fuentes.map(function(f){return'<option>'+esc(f)+'</option>'}).join('');
  var el=$('#kanban');
  var filtered=ps.filter(function(p){return!f||p.estado===f});
  var cols=ESTADOS.map(function(est){
    var items=filtered.filter(function(p){return p.estado===est});
    var colHtml='';
    items.forEach(function(p){
      var montoCls=!p.monto?'sin-monto':'';
      var montoText=p.monto?mxn(p.monto):'sin monto';
      colHtml+='<div class="kanban-card" draggable="true" data-pid="'+esc(p.id)+'"><div class="card-name">'+esc(p.nombre)+'</div><div class="card-biz">'+esc(p.negocio)+'</div><div class="card-monto '+montoCls+'">'+montoText+'</div><div class="card-meta"><span class="chip '+EST_CLS[est]+'">'+esc(est)+'</span><span class="card-days">'+(p.fecha||'').slice(0,10)+'</span></div>'+(p.telefono?'<div class="card-wa"><button class="btn wa small" data-wa="'+esc(p.id)+'" title="Enviar mensaje personalizado">WhatsApp</button><button class="btn ghost small" data-wacopy="'+esc(p.id)+'" title="Copiar mensaje">Copiar</button></div>':'<div class="card-wa none"><span class="wa-none">Sin teléfono</span></div>')+'<div class="card-actions"><button class="btn ghost small" data-pedit="'+esc(p.id)+'">Editar</button><button class="btn ghost small" data-pdel="'+esc(p.id)+'">Eliminar</button></div></div>';
    });
    return'<div class="kanban-col" data-estado="'+esc(est)+'"><div class="col-header">'+esc(est)+' <span class="count">'+items.length+'</span></div><div class="col-body" data-drop="'+esc(est)+'">'+colHtml+'</div></div>';
  });
  el.innerHTML=cols.join('');
  setupDragDrop();
  $$('[data-pedit]').forEach(function(b){b.addEventListener('click',function(){editingP=b.dataset.pedit;renderPipeline()})});
  $$('[data-pdel]').forEach(function(b){b.addEventListener('click',function(){delProspect(b.dataset.pdel)})});
  $$('[data-wa]').forEach(function(b){b.addEventListener('click',function(){var p=state.prospectos.prospectos.find(function(x){return x.id===b.dataset.wa});if(!p)return;var url=waLink(p);if(!url){toast('Falta el teléfono de '+p.nombre,'err');return}window.open(url,'_blank')})});
  $$('[data-wacopy]').forEach(function(b){b.addEventListener('click',function(){var p=state.prospectos.prospectos.find(function(x){return x.id===b.dataset.wacopy});if(!p)return;navigator.clipboard.writeText(waMsg(p)).then(function(){toast('Mensaje copiado, pégalo en WhatsApp'+(p.telefono?' ('+p.telefono+')':''))}).catch(function(){toast('No se pudo copiar','err')})})});
  $$('[data-drop]').forEach(function(zone){
    zone.addEventListener('dragover',function(e){e.preventDefault();zone.classList.add('drag-over')});
    zone.addEventListener('dragleave',function(){zone.classList.remove('drag-over')});
    zone.addEventListener('drop',function(e){
      e.preventDefault();zone.classList.remove('drag-over');
      var pid=e.dataTransfer.getData('text/plain');
      var p=state.prospectos.prospectos.find(function(x){return x.id===pid});if(!p)return;
      var newEst=zone.dataset.drop;p.estado=newEst;p.actualizado=stamp();
      if(newEst==='Cerrado'){p.fechaCierre=today();log('prospecto-cerrado','Prospecto cerrado',p.nombre+' - '+p.negocio,p.monto)}
      save('prospectos');renderPipeline();renderMetrics();
    });
  });
  $$('.kanban-card').forEach(function(card){
    card.addEventListener('dragstart',function(e){e.dataTransfer.setData('text/plain',card.dataset.pid)});
    card.addEventListener('dragend',function(){$$('.col-body').forEach(function(z){z.classList.remove('drag-over')})});
  });
}
function setupDragDrop(){$$('.kanban-card').forEach(function(card){card.setAttribute('draggable','true')})}
function renderProspectForm(){
  var card=$('#prospectFormCard');if(!card)return;
  var isEdit=!!editingP;
  card.innerHTML='<h3>'+(isEdit?'Editar prospecto':'Agregar prospecto')+'</h3><div class="form-row"><div><label for="pNombre" id="pNombreLbl">Nombre *</label><input id="pNombre" placeholder="Juan Pérez"></div><div><label for="pNegocio" id="pNegocioLbl">Negocio *</label><input id="pNegocio" placeholder="Barbería El Corte"></div></div><div class="form-row"><div><label for="pTel">Teléfono</label><input id="pTel" placeholder="+52 33 1234 5678"></div><div><label for="pFuente">Fuente</label><select id="pFuente"><option>Instagram</option><option>Facebook</option><option>WhatsApp</option><option>Google</option><option>Email</option><option>Referido</option><option>Otro</option></select></div><div><label for="pMonto">Monto potencial (MXN)</label><input type="number" id="pMonto" min="0" placeholder="1500"></div><div style="display:flex;align-items:flex-end"><button class="btn" id="addProspect">'+(isEdit?'Guardar cambios':'+ Agregar prospecto')+'</button>'+(isEdit?'<button class="btn ghost" id="cancelPEdit" style="margin-left:8px">Cancelar</button>':'')+'</div></div><div class="form-row one"><div><label for="pNotas">Notas</label><input id="pNotas" placeholder="Qué quiere, presupuesto, urgencia"></div></div><div class="form-row one"><div><label for="pMensaje">Mensaje personalizado (se envía con el botón WhatsApp)</label><textarea id="pMensaje" rows="4" placeholder="Se genera automáticamente según nombre, negocio, monto y notas..."></textarea><div style="margin-top:6px;display:flex;gap:8px;align-items:center"><button class="btn ghost small" id="regenMsg" type="button">Regenerar sugerencia</button><span style="font-size:11px;color:var(--muted)">Se personaliza solo con nombre, negocio, monto y notas</span></div></div></div>';
  if(isEdit){var p=state.prospectos.prospectos.find(function(x){return x.id===editingP});if(p){$('#pNombre').value=p.nombre;$('#pNegocio').value=p.negocio;$('#pTel').value=p.telefono||'';[...$('#pFuente').options].some(function(o){return o.value===p.fuente})&&($('#pFuente').value=p.fuente);$('#pMonto').value=p.monto??'';$('#pNotas').value=p.notas||'';$('#pMensaje').value=p.mensaje||''}}
  msgDirty=isEdit;
  $('#regenMsg').addEventListener('click',function(){msgDirty=false;syncMsg()});
  if(!isEdit){['pNombre','pNegocio','pMonto','pNotas'].forEach(function(id){$('#'+id).addEventListener('input',syncMsg)});$('#pMensaje').addEventListener('input',function(){msgDirty=true});syncMsg()}
  var ce=$('#cancelPEdit');if(ce)ce.addEventListener('click',endPEdit);
  $('#addProspect').addEventListener('click',async function(){
    var n=$('#pNombre').value.trim(),neg=$('#pNegocio').value.trim();
    if(!n||!neg){toast('Nombre y negocio son obligatorios','err');return}
    if(editingP){
      var p=state.prospectos.prospectos.find(function(x){return x.id===editingP});
      if(p){p.nombre=n;p.negocio=neg;p.telefono=$('#pTel').value.trim();p.fuente=$('#pFuente').value;p.monto=Number($('#pMonto').value||0);p.notas=$('#pNotas').value.trim();p.mensaje=$('#pMensaje').value.trim();p.actualizado=stamp()}
      endPEdit();await save('prospectos');renderPipeline();renderMetrics();toast('Prospecto actualizado');return;
    }
    state.prospectos.prospectos.push({id:uid(),nombre:n,negocio:neg,telefono:$('#pTel').value.trim(),fuente:$('#pFuente').value,monto:Number($('#pMonto').value||0),notas:$('#pNotas').value.trim(),mensaje:$('#pMensaje').value.trim(),estado:'Nuevo',fecha:stamp(),actualizado:stamp()});
    ['pNombre','pNegocio','pTel','pMonto','pNotas','pMensaje'].forEach(function(i){$('#'+i).value=''});msgDirty=false;
    await save('prospectos');renderPipeline();renderMetrics();toast('Prospecto agregado');
  });
}
function endPEdit(){editingP=null;renderPipeline()}
function bindPipelineStatic(){
  $('#filterEstado').addEventListener('change',renderPipeline);
  $('#pipeFilterFuente').addEventListener('change',renderPipeline);
  $('#copyTsv').addEventListener('click',function(){
    var f=$('#filterEstado').value;
    var arr=[].concat(state.prospectos.prospectos).filter(function(p){return!f||p.estado===f}).reverse();
    var rows=[['Nombre','Negocio','Telefono','Fuente','Estado','Monto','Fecha','Notas']];
    arr.forEach(function(p){rows.push([p.nombre,p.negocio,p.telefono||'',p.fuente,p.estado,p.monto||0,(p.fecha||'').slice(0,10),p.notas||''])});
    var tsv=rows.map(function(r){return r.map(function(c){return String(c).replace(/\t|\n/g,' ')}).join('\t')}).join('\n');
    navigator.clipboard.writeText(tsv).then(function(){toast('Copiado ('+arr.length+'). Pega en Google Sheets')}).catch(function(){toast('No se pudo copiar','err')});
  });
}
async function delProspect(id){var arr=state.prospectos.prospectos;var i=arr.findIndex(function(x){return x.id===id});if(i<0)return;var p=arr[i];if(!confirm('¿Eliminar a '+p.nombre+' — '+p.negocio+'?'))return;var rm=arr.splice(i,1)[0];await save('prospectos');renderPipeline();renderMetrics();toast('Prospecto eliminado','',{label:'Deshacer',fn:async function(){arr.splice(i,0,rm);await save('prospectos');renderPipeline();renderMetrics();toast('Prospecto restaurado')}})}

var CL_EST={'En desarrollo':'contactado','En revisión':'cotizado','Esperando pago':'reunion','Entregado':'cerrado'};
function renderProyectos(){
  var arr=[].concat(state.clientes.clientes).reverse();var total=arr.length;var facturado=arr.reduce(function(s,c){return s+Number(c.precio||0)},0);var porCobrar=arr.filter(function(c){return c.estado!=='Entregado'}).reduce(function(s,c){return s+Math.max(0,Number(c.precio||0)-Number(c.anticipo||0))},0);
  $('#proySub').textContent=total+' proyecto(s) · facturado '+mxn(facturado)+' · por cobrar '+mxn(porCobrar);
  $('#proyKPIs').innerHTML='<div class="kpi-tile"><div class="kpi-val">'+mxn(facturado)+'</div><div class="kpi-label">Facturado</div></div><div class="kpi-tile '+(porCobrar>0?'danger':'')+'"><div class="kpi-val">'+mxn(porCobrar)+'</div><div class="kpi-label">Por cobrar</div></div>';
  var formCard=$('#proyFormCard');
  var isEdit=!!editingC;
  formCard.innerHTML='<h3>'+(isEdit?'Editar proyecto':'Nuevo cliente')+'</h3><div class="grid two"><div><label for="cCliente">Cliente *</label><input id="cCliente" placeholder="María López"></div><div><label for="cNegocio">Negocio *</label><input id="cNegocio" placeholder="Café El Grano"></div></div><div class="grid two"><div><label for="cServicio">Servicio</label><select id="cServicio"><option>Página web básica</option><option>Landing page</option><option>Catálogo digital</option><option>Paquete web + catálogo</option><option>Paquete completo</option><option>Tienda en línea</option><option>Sistema a medida</option><option>App móvil</option><option>Configuración de redes</option><option>Mantenimiento</option><option>Consultoría</option></select></div><div><label for="cPrecio">Precio total (MXN)</label><input type="number" id="cPrecio" placeholder="1500" min="0"></div></div><div class="grid two"><div><label for="cAnticipo">Anticipo recibido (MXN)</label><input type="number" id="cAnticipo" placeholder="750" min="0"></div><div><label for="cEstado">Estado</label><select id="cEstado"><option>En desarrollo</option><option>En revisión</option><option>Esperando pago</option><option>Entregado</option></select></div></div><div class="grid two"><div><label for="cInicio">Fecha inicio</label><input type="date" id="cInicio"></div><div><label for="cEntrega">Fecha entrega</label><input type="date" id="cEntrega"></div></div><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end"><button class="btn" id="addCliente">'+(isEdit?'Guardar cambios':'+ Agregar cliente')+'</button>'+(isEdit?'<button class="btn ghost" id="cancelCEdit">Cancelar</button>':'')+'</div>';
  if(isEdit){var c=state.clientes.clientes.find(function(x){return x.id===editingC});if(c){$('#cCliente').value=c.cliente;$('#cNegocio').value=c.negocio;[...$('#cServicio').options].some(function(o){return o.value===c.servicio})&&($('#cServicio').value=c.servicio);$('#cPrecio').value=c.precio??'';$('#cAnticipo').value=c.anticipo??'';[...$('#cEstado').options].some(function(o){return o.value===c.estado})&&($('#cEstado').value=c.estado);$('#cInicio').value=c.fechaInicio||'';$('#cEntrega').value=c.fechaEntrega||''}}
  $('#cancelCEdit').addEventListener('click',endCEdit);
  $('#addCliente').addEventListener('click',async function(){
    var cl=$('#cCliente').value.trim(),neg=$('#cNegocio').value.trim();
    if(!cl||!neg){toast('Cliente y negocio son obligatorios','err');return}
    var precio=Number($('#cPrecio').value||0),anticipo=Number($('#cAnticipo').value||0);
    if(editingC){var c=state.clientes.clientes.find(function(x){return x.id===editingC});if(c){c.cliente=cl;c.negocio=neg;c.servicio=$('#cServicio').value;c.precio=precio;c.anticipo=anticipo;c.estado=$('#cEstado').value;c.fechaInicio=$('#cInicio').value;c.fechaEntrega=$('#cEntrega').value;c.actualizado=stamp();endCEdit()}await save('clientes');renderProyectos();renderMetrics();toast('Proyecto actualizado');return}
    state.clientes.clientes.push({id:uid(),cliente:cl,negocio:neg,servicio:$('#cServicio').value,precio:precio,anticipo:anticipo,estado:$('#cEstado').value,fechaInicio:$('#cInicio').value,fechaEntrega:$('#cEntrega').value,notas:'',fecha:stamp(),actualizado:stamp()});
    ['cCliente','cNegocio','cPrecio','cAnticipo'].forEach(function(i){$('#'+i).value=''});$('#cEntrega').value='';
    await save('clientes');renderProyectos();renderMetrics();toast(anticipo>0?'Cliente agregado — anticipo registrado':'Cliente agregado — recuerda cobrar el anticipo 50%')
  });
  renderClientesList();
}
function endCEdit(){editingC=null;renderProyectos()}
async function delCliente(id){var arr=state.clientes.clientes;var i=arr.findIndex(function(x){return x.id===id});if(i<0)return;var c=arr[i];if(!confirm('¿Eliminar el proyecto de '+c.cliente+' — '+c.negocio+'?'))return;var rm=arr.splice(i,1)[0];await save('clientes');renderProyectos();renderMetrics();toast('Cliente eliminado','',{label:'Deshacer',fn:async function(){arr.splice(i,0,rm);await save('clientes');renderProyectos();renderMetrics();toast('Cliente restaurado')}})}
function renderClientesList(){
  var arr=[].concat(state.clientes.clientes).reverse();var el=$('#proyList');
  if(!arr.length){el.innerHTML='<div class="card" style="color:var(--muted)">Sin clientes aún. Cuando un prospecto quede en Cerrado, pásalo aquí.</div>';return}
  var html='';
  arr.forEach(function(c){
    var sal=Math.max(0,Number(c.precio||0)-Number(c.anticipo||0));
    html+='<div class="p-item"><div class="info"><div class="neg">'+esc(c.cliente)+' — '+esc(c.negocio)+'</div><div class="sub">'+esc(c.servicio||'—')+' · Total '+mxn(c.precio)+' · Anticipo '+mxn(c.anticipo)+' · Saldo '+mxn(sal)+(c.fechaEntrega?' · Entrega '+esc(c.fechaEntrega):'')+'</div></div><span class="chip '+CL_EST[c.estado]+'">'+esc(c.estado)+'</span><select data-cstate="'+esc(c.id)+'">'+['En desarrollo','En revisión','Esperando pago','Entregado'].map(function(e){return'<option'+(e===c.estado?' selected':'')+'>'+e+'</option>'}).join('')+'</select><button class="btn ghost small" data-cedit="'+esc(c.id)+'">Editar</button><button class="btn ghost small" data-cdel="'+esc(c.id)+'">Eliminar</button></div>';
  });
  el.innerHTML=html;
  $$('[data-cstate]').forEach(function(s){
    s.addEventListener('change',function(){
      var c=state.clientes.clientes.find(function(x){return x.id===s.dataset.cstate});
      if(c){
        c.estado=s.value;c.actualizado=stamp();
        save('clientes').then(function(){renderProyectos();renderMetrics()});
        if(s.value==='Entregado'){log('cliente-estado','Proyecto entregado',c.cliente+' — '+c.negocio,c.precio);toast('Proyecto entregado — cobra el saldo y pide testimonio')}
        else{toast('Estado actualizado')}
      }
    });
  });
  $$('[data-cedit]').forEach(function(b){b.addEventListener('click',function(){editingC=b.dataset.cedit;renderProyectos()})});
  $$('[data-cdel]').forEach(function(b){b.addEventListener('click',function(){delCliente(b.dataset.cdel)})});
}

var Q_EST={'Pendiente':'cotizado','Aceptada':'cerrado','Rechazada':'sinrep','Sin respuesta':'sinrep'};
function renderCotizaciones(){
  var arr=[].concat(state.cotizaciones.cotizaciones).sort(function(a,b){return(b.fechaEnvio||'')<(a.fechaEnvio||'')?-1:1});var total=arr.length;var acept=arr.filter(function(q){return q.respuesta==='Aceptada'});var pend=arr.filter(function(q){return q.respuesta==='Pendiente'});var monto=acept.reduce(function(s,q){return s+Number(q.precio||0)},0);
  $('#qTotal').textContent=total;$('#qAcept').textContent=total?Math.round(acept.length/total*100)+'%':'0%';$('#qMonto').textContent=mxn(monto);$('#qPend').textContent=pend.length;
  renderCotForm();
  var el=$('#cotList');
  if(!arr.length){el.innerHTML='<div class="card" style="color:var(--muted)">Sin cotizaciones. Registra cada una que envies.</div>';return}
  var cotHtml='';
  arr.forEach(function(q){
    cotHtml+='<div class="p-item"><div class="info"><div class="neg">'+esc(q.prospecto)+' — '+mxn(q.precio)+'</div><div class="sub">'+esc(q.servicio||'—')+' · enviada '+esc(q.fechaEnvio||'—')+(q.seguimiento?' · seguimiento '+esc(q.seguimiento):'')+'</div></div><span class="chip '+Q_EST[q.respuesta]+'">'+esc(q.respuesta)+'</span><select data-qstate="'+esc(q.id)+'">'+['Pendiente','Aceptada','Rechazada','Sin respuesta'].map(function(e){return'<option'+(e===q.respuesta?' selected':'')+'>'+e+'</option>'}).join('')+'</select><button class="btn ghost small" data-qdoc="'+esc(q.id)+'" title="Ver documento">Doc</button><button class="btn ghost small" data-qedit="'+esc(q.id)+'" title="Editar">Editar</button><button class="btn ghost small" data-qdel="'+esc(q.id)+'" title="Eliminar">Eliminar</button></div>';
  });
  el.innerHTML=cotHtml;
  $$('[data-qstate]').forEach(function(s){
    s.addEventListener('change',async function(){
      var q=state.cotizaciones.cotizaciones.find(function(x){return x.id===s.dataset.qstate});if(q){
        var antes=q.respuesta;q.respuesta=s.value;q.actualizado=stamp();
        await save('cotizaciones');renderCotizaciones();renderMetrics();
        if(s.value==='Aceptada'&&antes!=='Aceptada'){log('cotizacion-aceptada','Cotización aceptada',q.prospecto+' — '+mxn(q.precio),q.precio);toast('Cotización aceptada — cobra el anticipo del 50% y pásala a Proyectos')}
        else toast('Estado actualizado');
      }
    });
  });
  $$('[data-qedit]').forEach(function(b){
    b.addEventListener('click',function(){
      var q=state.cotizaciones.cotizaciones.find(function(x){return x.id===b.dataset.qedit});if(q){
        editingQ=q.id;$('#qProspecto').value=q.prospecto;$('#qServicio').value=q.servicio||'';$('#qPrecio').value=q.precio??'';$('#qFecha').value=q.fechaEnvio||'';$('#qSeg').value=q.seguimiento||'';[...$('#qRespuesta').options].some(function(o){return o.value===q.respuesta})&&($('#qRespuesta').value=q.respuesta);$('#qProspectoLbl').textContent='Prospecto / cliente * (editando)';$('#addCot').textContent='Guardar cambios';$('#cancelQEdit').classList.remove('hidden');$('#qProspecto').focus();
      }
    });
  });
  $$('[data-qdel]').forEach(function(b){
    b.addEventListener('click',async function(){
      var arr=state.cotizaciones.cotizaciones;var i=arr.findIndex(function(x){return x.id===b.dataset.qdel});if(i<0)return;var q=arr[i];if(!confirm('¿Eliminar la cotización de '+q.prospecto+'?'))return;var rm=arr.splice(i,1)[0];await save('cotizaciones');renderCotizaciones();renderMetrics();toast('Cotización eliminada','',{label:'Deshacer',fn:async function(){arr.splice(i,0,rm);await save('cotizaciones');renderCotizaciones();renderMetrics();toast('Cotización restaurada')}});
    });
  });
  $$('[data-qdoc]').forEach(function(b){b.addEventListener('click',function(){var q=state.cotizaciones.cotizaciones.find(function(x){return x.id===b.dataset.qdoc});if(q)showCotDoc(q)})});
}
function renderCotForm(){
  var card=$('#cotFormCard');var isEdit=!!editingQ;
  card.innerHTML='<h3>'+(isEdit?'Editar cotización':'Nueva cotización')+'</h3><div class="grid two"><div><label for="qProspecto" id="qProspectoLbl">Prospecto / cliente *</label><input id="qProspecto" placeholder="Barbería El Corte"></div><div><label for="qServicio">Servicio</label><input id="qServicio" placeholder="Landing page + WhatsApp"></div></div><div class="grid two"><div><label for="qPrecio">Precio (MXN)</label><input type="number" id="qPrecio" placeholder="1500" min="0"></div><div><label for="qFecha">Fecha de envío</label><input type="date" id="qFecha"></div></div><div class="grid two"><div><label for="qRespuesta">Respuesta</label><select id="qRespuesta"><option>Pendiente</option><option>Aceptada</option><option>Rechazada</option><option>Sin respuesta</option></select></div><div><label for="qSeg">Seguimiento</label><input type="date" id="qSeg"></div></div><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end"><button class="btn" id="addCot">'+(isEdit?'Guardar cambios':'+ Registrar cotización')+'</button>'+(isEdit?'<button class="btn ghost" id="cancelQEdit">Cancelar</button>':'')+'</div>';
  if(isEdit){var q=state.cotizaciones.cotizaciones.find(function(x){return x.id===editingQ});if(q){$('#qProspecto').value=q.prospecto;$('#qServicio').value=q.servicio||'';$('#qPrecio').value=q.precio??'';$('#qFecha').value=q.fechaEnvio||'';$('#qSeg').value=q.seguimiento||'';[...$('#qRespuesta').options].some(function(o){return o.value===q.respuesta})&&($('#qRespuesta').value=q.respuesta)}}
  $('#cancelQEdit').addEventListener('click',endQEdit);
  $('#addCot').addEventListener('click',async function(){
    var pr=$('#qProspecto').value.trim();if(!pr){toast('Escribe el prospecto o cliente','err');return}
    var precio=Number($('#qPrecio').value||0);
    if(editingQ){var q=state.cotizaciones.cotizaciones.find(function(x){return x.id===editingQ});if(q){q.prospecto=pr;q.servicio=$('#qServicio').value.trim();q.precio=precio;q.fechaEnvio=$('#qFecha').value;q.respuesta=$('#qRespuesta').value;q.seguimiento=$('#qSeg').value;q.actualizado=stamp();endQEdit()}await save('cotizaciones');renderCotizaciones();renderMetrics();toast('Cotización actualizada');return}
    state.cotizaciones.cotizaciones.push({id:uid(),prospecto:pr,servicio:$('#qServicio').value.trim(),precio:precio,fechaEnvio:$('#qFecha').value||today(),respuesta:$('#qRespuesta').value,seguimiento:$('#qSeg').value,items:[{descripcion:$('#qServicio').value.trim()||'Servicio',precio}],folio:'COT-'+new Date().getFullYear()+'-'+(state.cotizaciones.cotizaciones.length+1).toString().padStart(3,'0'),fecha:stamp(),actualizado:stamp()});
    ['qProspecto','qServicio','qPrecio','qSeg'].forEach(function(i){$('#'+i).value=''});await save('cotizaciones');renderCotizaciones();renderMetrics();toast('Cotización registrada — válida 15 días')
  });
}
function endQEdit(){editingQ=null;renderCotizaciones()}
function showCotDoc(q){
  var itemsHtml=(q.items||[]).map(function(i){return'<tr><td>'+esc(i.descripcion)+'</td><td class="num">'+mxn(i.precio)+'</td></tr>'}).join('');
  var total=(q.items||[]).reduce(function(s,i){return s+Number(i.precio)},0);
  var printIcon='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>';
  var doc='<div class="cot-doc"><div class="doc-header"><div><div class="company">D<span>.Softworks</span> OS</div><div style="font-size:12px;color:#555">D.Softworks · Guadalajara, Jalisco<br>WhatsApp +52 1 33 5051 9325 · danielsoftworks.netlify.app</div></div><div class="contact-info"><div style="font-size:20px;font-weight:700;color:#0d121c">COTIZACIÓN '+(q.folio||'COT-2026-001')+'</div><div style="font-size:12px;color:#555">Fecha: '+esc(q.fechaEnvio||today())+' · Válida 15 días</div></div></div><div class="client-block"><b>Cliente:</b> '+esc(q.prospecto)+'<br>'+esc(q.servicio||'—')+'</div><table><thead><tr><th>Concepto</th><th style="text-align:right">Precio MXN</th></tr></thead><tbody>'+itemsHtml+'<tr class="total-row"><td>TOTAL</td><td class="num">'+mxn(total)+'</td></tr></tbody></table><div class="conditions"><b>Condiciones:</b><br>1. Anticipo 50% · saldo contra entrega<br>2. Transferencia o efectivo (no tarjeta)<br>3. 2 rondas de cambios (web/landing), 1 (catálogo)<br>4. No incluye: hosting renovación, cambios fuera de alcance<br><br><b>Para confirmar, responde este documento.</b></div><div style="margin-top:16px;display:flex;gap:10px"><button class="btn" onclick="window.print()" style="background:#0d121c;color:#fff">'+printIcon+' Imprimir / PDF</button><button class="btn ghost" id="copyCotText">Copiar texto (WhatsApp)</button></div><button class="close-btn" onclick="document.getElementById(\'cotDocModal\').classList.remove(\'open\')" style="position:absolute;top:16px;right:16px">Cerrar</button></div>';
  var modal=$('#cotDocModal');modal.classList.add('open');var content=modal.querySelector('.modal');content.innerHTML=doc;$('#copyCotText').addEventListener('click',function(){var txt='COTIZACIÓN '+(q.folio||'COT-2026-001')+'\nCliente: '+q.prospecto+'\nServicio: '+q.servicio+'\n'+(q.items||[]).map(function(i){return'- '+i.descripcion+': '+mxn(i.precio)}).join('\n')+'\nTOTAL: '+mxn(total)+'\nCondiciones: anticipo 50%, saldo contra entrega. Transferencia o efectivo.\nVálida 15 días.\nD.Softworks · Guadalajara, Jalisco · WhatsApp +52 1 33 5051 9325';navigator.clipboard.writeText(txt).then(function(){toast('Texto copiado para WhatsApp')}).catch(function(){toast('No se pudo copiar','err')})});
}
$('#cotDocModal').addEventListener('click',function(e){if(e.target===$('#cotDocModal'))$('#cotDocModal').classList.remove('open')});

function renderFinanzas(){
  var mk=today().slice(0,7);var mes=(state.finanzas.movimientos||[]).filter(function(m){return(m.fecha||'').slice(0,7)===mk});var ing=mes.filter(function(m){return m.tipo==='ingreso'}).reduce(function(s,m){return s+Number(m.monto||0)},0);var egr=mes.filter(function(m){return m.tipo==='egreso'}).reduce(function(s,m){return s+Number(m.monto||0)},0);var meta=Number(state.finanzas.metaMes||0);var pct=meta?Math.round(ing/meta*100):0;
  $('#fIngresos').textContent=mxn(ing);$('#fEgresos').textContent=mxn(egr);$('#fNeto').textContent=mxn(ing-egr);$('#fMeta').textContent=mxn(meta);$('#fPct').textContent=pct+'%';$('#fBar').style.transform='scaleX('+(meta?Math.min(1,ing/meta):0)+')';$('#fMetaInput').value=meta;
  renderMovForm();
  var arr=[].concat(state.finanzas.movimientos).sort(function(a,b){return(b.fecha||'')<(a.fecha||'')?-1:1});var el=$('#fList');
  if(!arr.length){el.innerHTML='<div class="card" style="color:var(--muted)">Sin movimientos.</div>';return}
  var html='';
  arr.forEach(function(m){
    html+='<div class="p-item"><div class="info"><div class="neg" style="color:'+(m.tipo==='ingreso'?'var(--ok)':'#ff8a8a')+'">'+(m.tipo==='ingreso'?'+':'−')+mxn(m.monto)+' · '+esc(m.concepto)+'</div><div class="sub">'+esc(m.fecha||'')+' · '+esc(m.categoria||'Otro')+(m.fecha.slice(0,7)===mk?' · este mes':'')+'</div></div><span class="chip '+(m.tipo==='ingreso'?'cerrado':'sinrep')+'">'+(m.tipo==='ingreso'?'Ingreso':'Egreso')+'</span><button class="btn ghost small" data-fdel="'+esc(m.id)+'">Eliminar</button></div>';
  });
  el.innerHTML=html;
  $$('[data-fdel]').forEach(function(b){b.addEventListener('click',function(){delMov(b.dataset.fdel)})});
}
function renderMovForm(){
  var card=$('#movFormCard');
  card.innerHTML='<h3>Registrar movimiento</h3><div class="grid two"><div><label for="fFecha">Fecha</label><input type="date" id="fFecha"></div><div><label for="fTipo">Tipo</label><select id="fTipo"><option value="ingreso">Ingreso</option><option value="egreso">Egreso</option></select></div></div><div class="grid two"><div><label for="fConcepto">Concepto *</label><input id="fConcepto" placeholder="Anticipo web Café El Grano"></div><div><label for="fMonto">Monto (MXN) *</label><input type="number" id="fMonto" placeholder="750" min="0"></div></div><div class="grid two"><div><label for="fCat">Categoría</label><select id="fCat"><option>Anticipo</option><option>Saldo final</option><option>Mantenimiento</option><option>Proyecto extra</option><option>Dominio/hosting</option><option>Herramientas</option><option>Otro</option></select></div><div style="display:flex;align-items:flex-end"><button class="btn" id="addMov">+ Registrar movimiento</button></div></div>';
  $('#addMov').addEventListener('click',async function(){
    var concepto=$('#fConcepto').value.trim(),monto=Number($('#fMonto').value||0);
    if(!concepto||monto<=0){toast('Concepto y monto son obligatorios','err');return}
    state.finanzas.movimientos.push({id:uid(),fecha:$('#fFecha').value||today(),tipo:$('#fTipo').value,concepto:concepto,monto:monto,categoria:$('#fCat').value,fechaReg:stamp(),actualizado:stamp()});
    $('#fConcepto').value='';$('#fMonto').value='';await save('finanzas');renderFinanzas();renderMetrics();log(monto>0?'cobro':'egreso',monto>0?'Cobro registrado':'Egreso registrado',concepto,monto);toast('Movimiento registrado')
  });
}
$('#saveMeta').addEventListener('click',async function(){var v=Number($('#fMetaInput').value||0);if(v<0){toast('Meta inválida','err');return}state.finanzas.metaMes=v;await save('finanzas');renderFinanzas();renderMetrics();log('sistema','Meta actualizada','Meta mensual: '+mxn(v));toast('Meta del mes: '+mxn(v))});

var K_EST={'Pendiente':'cotizado','Publicada':'cerrado'};
function renderContenido(){
  var arr=[].concat(state.contenido.publicaciones).sort(function(a,b){return(a.fecha||'9999')<(b.fecha||'9999')?-1:1});var next=arr.filter(function(k){return k.estado==='Pendiente'}).sort(function(a,b){return(a.fecha||'9999')<(b.fecha||'9999')?-1:1})[0];$('#nextPost').innerHTML=next?'<b>Proxima publicacion:</b> '+esc(next.titulo)+' — <b>'+esc(next.fecha||'sin fecha')+'</b> · '+esc(next.tipo||'')+' · fuente: <code>'+esc(next.archivo||'—')+'</code><br>Regla: 1 cada 2 dias en Facebook e Instagram.':'No hay publicaciones pendientes.';
  renderContForm();
  var el=$('#kList');if(!arr.length){el.innerHTML='<div class="card" style="color:var(--muted)">Calendario vacío.</div>';return}
  var html='';
  arr.forEach(function(k){
    html+='<div class="p-item"><div class="info"><div class="neg">'+esc(k.titulo)+'</div><div class="sub">'+esc(k.tipo||'—')+' · '+esc(k.fecha||'—')+(k.archivo?' · <code>'+esc(k.archivo)+'</code>':'')+(k.enlace?' · <a href="'+esc(k.enlace)+'" target="_blank" rel="noopener" style="color:var(--accent)">ver publicación</a>':'')+'</div></div><span class="chip '+K_EST[k.estado]+'">'+esc(k.estado||'Pendiente')+'</span><select data-kstate="'+esc(k.id)+'">'+['Pendiente','Publicada'].map(function(e){return'<option'+(e===k.estado?' selected':'')+'>'+e+'</option>'}).join('')+'</select><button class="btn ghost small" data-kedit="'+esc(k.id)+'">Editar</button><button class="btn ghost small" data-kdel="'+esc(k.id)+'">Eliminar</button></div>';
  });
  el.innerHTML=html;
  $$('[data-kstate]').forEach(function(s){
    s.addEventListener('change',async function(){
      var k=state.contenido.publicaciones.find(function(x){return x.id===s.dataset.kstate});if(k){k.estado=s.value;k.actualizado=stamp();if(s.value==='Publicada'&&!k.enlace){var u=prompt('Pega el enlace de la publicación (opcional):','');if(u!==null)k.enlace=u.trim()}await save('contenido');renderContenido();log('publicacion','Publicación marcada como publicada',k.titulo);toast(s.value==='Publicada'?'Publicación marcada como hecha':'Estado actualizado')}
    });
  });
  $$('[data-kedit]').forEach(function(b){
    b.addEventListener('click',function(){
      var k=state.contenido.publicaciones.find(function(x){return x.id===b.dataset.kedit});if(k){editingK=k.id;$('#kTitulo').value=k.titulo;$('#kTipo').value=k.tipo||'Portafolio';$('#kFecha').value=k.fecha||'';$('#kEnlace').value=k.enlace||'';$('#kArchivo').value=k.archivo||'';$('#kTituloLbl').textContent='Título * (editando)';$('#addPost').textContent='Guardar cambios';$('#cancelKEdit').classList.remove('hidden');$('#kTitulo').focus()}
    });
  });
  $$('[data-kdel]').forEach(function(b){
    b.addEventListener('click',async function(){
      var arr=state.contenido.publicaciones;var i=arr.findIndex(function(x){return x.id===b.dataset.kdel});if(i<0)return;var k=arr[i];if(!confirm('¿Eliminar "'+k.titulo+'" del calendario?'))return;var rm=arr.splice(i,1)[0];await save('contenido');renderContenido();toast('Publicación eliminada','',{label:'Deshacer',fn:async function(){arr.splice(i,0,rm);await save('contenido');renderContenido();toast('Publicación restaurada')}});
    });
  });
}
function renderContForm(){
  var card=$('#contFormCard');var isEdit=!!editingK;
  card.innerHTML='<h3>'+(isEdit?'Editar publicación':'Nueva publicación')+'</h3><div class="grid two"><div><label for="kTitulo" id="kTituloLbl">Título *</label><input id="kTitulo" placeholder="Portafolio — Café El Grano"></div><div><label for="kTipo">Tipo</label><select id="kTipo"><option>Portafolio</option><option>Educativo</option><option>Oferta</option><option>Detrás de escena</option></select></div></div><div class="grid two"><div><label for="kFecha">Fecha de publicación</label><input type="date" id="kFecha"></div><div><label for="kEnlace">Enlace</label><input id="kEnlace" placeholder="https://facebook.com/..."></div></div><div class="grid one"><div><label for="kArchivo">Archivo / texto fuente</label><input id="kArchivo" placeholder="07-Marketing/Publicaciones/Portafolio-01-GMFire.md"></div></div><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end"><button class="btn" id="addPost">'+(isEdit?'Guardar cambios':'+ Agregar publicación')+'</button>'+(isEdit?'<button class="btn ghost" id="cancelKEdit">Cancelar</button>':'')+'</div>';
  if(isEdit){var k=state.contenido.publicaciones.find(function(x){return x.id===editingK});if(k){$('#kTitulo').value=k.titulo;$('#kTipo').value=k.tipo||'Portafolio';$('#kFecha').value=k.fecha||'';$('#kEnlace').value=k.enlace||'';$('#kArchivo').value=k.archivo||''}}
  $('#cancelKEdit').addEventListener('click',endKEdit);
  $('#addPost').addEventListener('click',async function(){
    var t=$('#kTitulo').value.trim();if(!t){toast('Escribe el título','err');return}
    if(editingK){var k=state.contenido.publicaciones.find(function(x){return x.id===editingK});if(k){k.titulo=t;k.tipo=$('#kTipo').value;k.fecha=$('#kFecha').value;k.enlace=$('#kEnlace').value.trim();k.archivo=$('#kArchivo').value.trim();k.actualizado=stamp();endKEdit()}await save('contenido');renderContenido();toast('Publicación actualizada');return}
    state.contenido.publicaciones.push({id:uid(),titulo:t,tipo:$('#kTipo').value,fecha:$('#kFecha').value||today(),enlace:$('#kEnlace').value.trim(),archivo:$('#kArchivo').value.trim(),estado:'Pendiente',creado:stamp(),actualizado:stamp()});
    ['kTitulo','kEnlace','kArchivo'].forEach(function(i){$('#'+i).value=''});await save('contenido');renderContenido();toast('Publicación agregada al calendario');log('publicacion','Publicación agregada',t)
  });
}
function endKEdit(){editingK=null;renderContenido()}

function renderMensajes(){
  var el=$('#mList');var s=seenIds();var arr=[].concat(state.mensajes.mensajes).reverse();
  if(!arr.length){el.innerHTML='<div class="card" style="color:var(--muted)">No has enviado mensajes al cerebro todavía.</div>';updateBadge();return}
  var html='';
  arr.forEach(function(m){
    var unseen=m.estado==='atendido'&&m.respuesta&&!s.has(m.id);
    var statusText=m.estado==='atendido'?'Atendido':'Pendiente';
    html+='<div class="msg'+(unseen?' new':'')+'"><div class="head"><span>'+esc(m.fecha||'')+'</span><span class="st '+(m.estado==='atendido'?'listo':'pend')+'">'+statusText+'</span></div><div class="txt">'+esc(m.texto)+'</div>'+(m.respuesta?'<div class="resp"><b>Cerebro:</b><br>'+esc(m.respuesta)+'</div>':'')+'</div>';
  });
  el.innerHTML=html;updateBadge();
  $$('[data-askbrain]').forEach(function(b){b.addEventListener('click',async function(){var m=state.mensajes.mensajes.find(function(x){return x.id===b.dataset.askbrain});if(!m)return;toast('Pide al cerebro: revisa la app o ya terminé');b.textContent='Enviado...';b.disabled=true})});
}
$('#sendMsg').addEventListener('click',async function(){var t=$('#mInput').value.trim();if(!t){toast('Escribe tu mensaje primero','err');return}state.mensajes.mensajes.push({id:uid(),texto:t,fecha:stamp(),estado:'pendiente',respuesta:''});$('#mInput').value='';await save('mensajes');renderMensajes();toast('Mensaje enviado. Dime revisa la app o ya terminé cuando quieras que lo atienda')});

function startTaskEdit(id){var t=state.tareas.tareas.find(function(x){return x.id===id});if(!t)return;editingTask=id;$('#newTask').value=t.titulo;$('#newTaskDue').value=t.vence||'';$('#addTask').textContent='Guardar cambios';$('#cancelTaskEdit').classList.remove('hidden');$('#newTask').focus()}
function endTaskEdit(){editingTask=null;$('#newTask').value='';$('#newTaskDue').value='';$('#addTask').textContent='+ Agregar tarea';$('#cancelTaskEdit').classList.add('hidden')}
function delTask(id){var arr=state.tareas.tareas;var i=arr.findIndex(function(x){return x.id===id});if(i<0)return;var t=arr[i];if(!confirm('¿Eliminar la tarea "'+t.titulo+'"?'))return;var rm=arr.splice(i,1)[0];save('tareas');renderTasks();toast('Tarea eliminada','',{label:'Deshacer',fn:function(){arr.splice(i,0,rm);save('tareas');renderTasks();toast('Tarea restaurada')}})}
function renderTasks(){
  var list=$('#taskList');
  var arr=[].concat(state.tareas.tareas).sort(function(a,b){if(a.hecha!==b.hecha)return a.hecha?1:-1;return(a.vence||'9999')<(b.vence||'9999')?-1:1});
  if(!arr.length){list.innerHTML='<div class="card" style="color:var(--muted)">Sin tareas. El cerebro las agregará en tareas.json.</div>'}
  else{
    var taskHtml='';
    arr.forEach(function(t){
      var doneCls=t.hecha?' done':'';
      var checked=t.hecha?' checked':'';
      var catHtml=t.categoria?'<span class="cat">'+esc(t.categoria)+'</span>':'';
      var venceHtml=t.vence?dueChip(t.vence):'';
      var origenHtml=t.origen==='cerebro'?'<span class="cat">del cerebro</span>':'';
      taskHtml+='<div class="task'+doneCls+'"><input type="checkbox" data-task="'+esc(t.id)+'"'+checked+' aria-label="Completar '+esc(t.titulo)+'"><div class="body"><div class="title">'+esc(t.titulo)+'</div>'+(t.detalle?'<div class="detail">'+esc(t.detalle)+'</div>':'')+'<div class="meta">'+catHtml+venceHtml+origenHtml+'<span style="flex:1"></span><button class="btn ghost small" data-tedit="'+esc(t.id)+'">Editar</button><button class="btn ghost small" data-tdel="'+esc(t.id)+'">Eliminar</button></div></div></div>';
    });
    list.innerHTML=taskHtml;
  }
  var total=arr.length,done=arr.filter(function(t){return t.hecha}).length;var pend=total-done;var hoy=arr.filter(function(t){return!t.hecha&&t.vence===today()}).length;var over=arr.filter(function(t){return!t.hecha&&t.vence&&t.vence<today()}).length;
  $('#progTxt').textContent=done+' de '+total+' completadas';$('#progPct').textContent=total?Math.round(done/total*100)+'%':'0%';$('#progBar').style.transform='scaleX('+(total?done/total:0)+')';$('#countToday').textContent='Vencen hoy: '+hoy;$('#countOver').textContent='Vencidas: '+over;$('#countPend').textContent='Pendientes: '+pend;var mT=$('#mTasks');if(mT)mT.textContent=total?Math.round(done/total*100)+'%':'0%';
  $$('[data-task]').forEach(function(cb){
    cb.addEventListener('change',function(){
      var t=state.tareas.tareas.find(function(x){return x.id===cb.dataset.task});
      if(t){t.hecha=cb.checked;t.hechoFecha=cb.checked?stamp():'';save('tareas');renderTasks();if(cb.checked&&t.categoria!=='Personal')log('tarea-hecha','Tarea completada',t.titulo);toast(cb.checked?'Tarea completada':'Tarea reabierta')}
    });
  });
  $$('[data-tedit]').forEach(function(b){b.addEventListener('click',function(){startTaskEdit(b.dataset.tedit)})});
  $$('[data-tdel]').forEach(function(b){b.addEventListener('click',function(){delTask(b.dataset.tdel)})});
}
$('#addTask').addEventListener('click',function(){
  var v=$('#newTask').value.trim();
  if(!v){toast('Escribe la tarea primero','err');return}
  if(editingTask){var t=state.tareas.tareas.find(function(x){return x.id===editingTask});if(t){t.titulo=v;t.vence=$('#newTaskDue').value}endTaskEdit();save('tareas');renderTasks();toast('Tarea actualizada');return}
  state.tareas.tareas.push({id:uid(),titulo:v,detalle:'',categoria:'Personal',vence:$('#newTaskDue').value||today(),hecha:false,origen:'tu'});
  $('#newTask').value='';$('#newTaskDue').value='';save('tareas');renderTasks();toast('Tarea agregada')
});
$('#newTask').addEventListener('keydown',function(e){if(e.key==='Enter')$('#addTask').click()});
$('#cancelTaskEdit').addEventListener('click',endTaskEdit);

function renderMetrics(){
  var ps=state.prospectos.prospectos;var ws=weekStart();var week=ps.filter(function(p){return(p.fecha||'').slice(0,10)>=ws}).length;var byEst={};ESTADOS.forEach(function(e){byEst[e]=0});ps.forEach(function(p){byEst[p.estado]=(byEst[p.estado]||0)+1});var byF={};ps.forEach(function(p){var f=p.fuente||'Otro';byF[f]=(byF[f]||0)+1});var resp=(byEst['Respondió']||0)+(byEst['Reunión']||0)+(byEst['Cotizado']||0)+(byEst['Cerrado']||0);
  $('#mWeek').textContent=week;$('#mTotal').textContent=ps.length;$('#mResp').textContent=resp;$('#mRespPct').textContent=(ps.length?Math.round(resp/ps.length*100):0)+'% de contacto';$('#mCot').textContent=(byEst['Cotizado']||0)+(byEst['Cerrado']||0);$('#mCierre').textContent=byEst['Cerrado']||0;$('#estadoBars').innerHTML=bars(byEst);$('#fuenteBars').innerHTML=Object.keys(byF).length?bars(byF):'<span style="color:var(--muted);font-size:13px">Sin datos todavia.</span>';var activos=(state.clientes.clientes||[]).filter(function(c){return c.estado!=='Entregado'}).length;$('#mClientes').textContent=activos;var mk=today().slice(0,7);var ing=(state.finanzas.movimientos||[]).filter(function(m){return(m.fecha||'').slice(0,7)===mk&&m.tipo==='ingreso'}).reduce(function(s,m){return s+Number(m.monto||0)},0);$('#mMes').textContent=mxn(ing);$('#mMetaPct').textContent='meta: '+mxn(state.finanzas.metaMes||0);renderSparkline();
}
function bars(data,total){var max=Math.max.apply(null,Object.values(data).concat([1]));var html='';Object.entries(data).forEach(function(entry){var k=entry[0],v=entry[1];html+='<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px"><span style="width:130px;font-size:13px">'+esc(k)+'</span><div style="flex:1;height:14px;background:var(--bg);border-radius:7px;overflow:hidden"><i style="display:block;height:100%;width:'+Math.round(v/max*100)+'%;background:var(--accent);border-radius:7px"></i></div><span style="width:40px;text-align:right;font-size:13px;font-weight:700">'+v+'</span></div>';});return html;}
function renderSparkline(){
  var months=[''];for(var i=5;i>=0;i--){var d=new Date();d.setMonth(d.getMonth()-i);months[i]=d.getFullYear()+'-'+(d.getMonth()+1).toString().padStart(2,'0')}
  var vals=months.map(function(m){var mk=m;return(state.finanzas.movimientos||[]).filter(function(x){return(x.fecha||'').slice(0,7)===mk&&x.tipo==='ingreso'}).reduce(function(s,x){return s+Number(x.monto||0)},0)});
  var max=Math.max.apply(null,vals.concat([1]));var w=280,h=60;var pts=vals.map(function(v,i){return((i/(vals.length-1||1))*w)+','+((1-v/max)*h)}).join(' ');var area=vals.map(function(v,i){var base=(i/(vals.length-1||1))*w;return base+','+h+' '+((i===0)?('0,'+h):(base+','+((1-v/max)*h)))}).join(' ');
  var sparkHtml='<h3>Ingresos por mes (ultimos 6)</h3><svg width="100%" viewBox="0 0 '+w+' '+h+'" style="margin-top:8px"><polygon points="'+area+'" fill="rgba(99,207,228,.15)" /><polyline points="'+pts+'" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round"/><circle cx="0" cy="'+(h-(vals[0]/max)*h)+'" r="3" fill="var(--accent)"/><circle cx="'+w+'" cy="'+(h-(vals[vals.length-1]/max)*h)+'" r="3" fill="var(--accent)"/></svg><div style="display:flex;justify-content:space-between;margin-top:4px;font-size:11px;color:var(--muted)">';
  months.forEach(function(m,i){sparkHtml+='<span>'+m+': '+mxn(vals[i])+'</span>'});sparkHtml+='</div>';$('#sparklineCard').innerHTML=sparkHtml;
}

function renderReportesSel(){
  var sel=$('#reporteWeek');if(!sel)return;sel.innerHTML='';var weeks=[''];var d=new Date();for(var i=4;i>=0;i--){var dd=new Date(d);dd.setDate(dd.getDate()-i*7);var weekNum=Math.ceil(((dd.getDate()+6-(dd.getDay()||7))%7+1)/7);var y=dd.getFullYear();weeks.unshift(y+'-W'+String(Math.ceil((dd.getDate()+(6-dd.getDay()))/7)).padStart(2,'0'))}weeks.forEach(function(w){sel.innerHTML+='<option>'+w+'</option>'});
  var rep=state.reportes.reportes.find(function(r){return r.semana===sel.value});
  if(rep)renderReporteCard(rep);else{$('#reporteActual').innerHTML='<div class="card" style="color:var(--muted)">Selecciona una semana para ver el reporte, o genera uno nuevo.</div>';renderReportesHist()}
}
function genReporte(){
  var sel=$('#reporteWeek').value;if(!sel){toast('Selecciona una semana','err');return}
  var ps=state.prospectos.prospectos;var ws=weekStart();var mk=today().slice(0,7);
  var byEst={};ESTADOS.forEach(function(e){byEst[e]=0});ps.forEach(function(p){byEst[p.estado]=(byEst[p.estado]||0)+1});
  var weekPs=ps.filter(function(p){return(p.fecha||'').slice(0,10)>=ws});
  var contactos=weekPs.length;var resp=(byEst['Respondió']||0)+(byEst['Reunión']||0)+(byEst['Cotizado']||0)+(byEst['Cerrado']||0);var reuniones=byEst['Reunión'];var cotizaciones=(byEst['Cotizado']||0)+(byEst['Cerrado']||0);var cierres=byEst['Cerrado'];var ing=(state.finanzas.movimientos||[]).filter(function(m){return(m.fecha||'').slice(0,7)===mk&&m.tipo==='ingreso'}).reduce(function(s,m){return s+Number(m.monto||0)},0);var meta=Number(state.finanzas.metaMes||0);var pub=(state.contenido.publicaciones||[]).filter(function(p){return p.estado==='Publicada'&&p.fecha&&p.fecha>=ws}).length;var ponderado=ps.reduce(function(s,p){return s+(Number(p.monto||0)*PROB[p.estado]||0)},0);
  var reporte={semana:sel,rango:ws+' a '+today(),generado:stamp(),kpis:{contactos:contactos,contactosMeta:50,respuestas:resp,tasaRespuesta:ps.length?Math.round(resp/ps.length*100):0,reuniones:reuniones,cotizaciones:cotizaciones,cierres:cierres,ingresos:ing,metaMes:meta,pipelinePonderado:ponderado,publicaciones:pub},analisis:'',planSemana:[],origen:'app'};
  var existing=state.reportes.reportes.findIndex(function(r){return r.semana===sel});
  if(existing>=0&&state.reportes.reportes[existing].origen==='cerebro'){toast('Este reporte ya fue completado por el cerebro. No se sobreescribe.','err');return}
  if(existing>=0)state.reportes.reportes[existing]=reporte;else state.reportes.reportes.push(reporte);
  state.reportes.actualizado=stamp();save('reportes');renderReporteCard(reporte);toast('Reporte generado');log('reporte','Reporte generado','Semana '+sel+' · '+contactos+' contactos, '+cierres+' cierres')
}
function renderReporteCard(rep){
  var k=rep.kpis;var html='<div class="card"><h3>Reporte '+rep.semana+' ('+rep.rango+')</h3><div class="grid two" style="margin-top:12px">';
  [{l:'Contactos',v:k.contactos,m:50},{l:'Tasa de respuesta',v:k.tasaRespuesta+'%',m:20},{l:'Reuniones',v:k.reuniones,m:0},{l:'Cotizaciones',v:k.cotizaciones,m:0},{l:'Cierres',v:k.cierres,m:3},{l:'Ingresos',v:mxn(k.ingresos),m:k.metaMes},{l:'Pipeline ponderado',v:mxn(Math.round(k.pipelinePonderado)),m:0},{l:'Publicaciones',v:k.publicaciones,m:0}].forEach(function(x){html+='<div style="text-align:center;padding:8px"><b>'+x.v+'</b><div style="font-size:11px;color:var(--muted)">'+x.l+'</div></div>'});
  html+='</div>';
  if(rep.analisis){html+='<div style="margin-top:14px;padding:12px;background:var(--surface-2);border-radius:8px"><b>Analisis del cerebro:</b><br>'+esc(rep.analisis)+'</div>'}
  html+='<div style="margin-top:10px;font-size:13px;color:var(--muted)">'+(rep.origen==='cerebro'?'Completado por el cerebro':'Generado por la app — pendiente de analisis')+'</div>';
  if(!rep.analisis){html+='<div style="margin-top:8px"><button class="btn ghost small" id="askBrainReporte">Dile al cerebro: revisa la app</button></div>'}
  html+='</div>';
  $('#reporteActual').innerHTML=html;
  $('#askBrainReporte').addEventListener('click',function(){toast('Dile al cerebro: revisa la app para completar este reporte')});
  renderReportesHist();
}
function renderReportesHist(){
  var el=$('#reportesList');var html='';
  (state.reportes.reportes||[]).reverse().forEach(function(r){html+='<div class="card" style="margin-bottom:8px;padding:12px"><b>'+r.semana+'</b> · '+r.rango+' · '+(r.generado||'—')+' · '+(r.origen==='cerebro'?'Completado por cerebro':'Generado por app')+' · '+(r.kpis?r.kpis.contactos:0)+' contactos</div>'});
  el.innerHTML=html;
}
$('#genReporte').addEventListener('click',genReporte);

$$('[data-rut]').forEach(function(cb){var key='dsw-rut-'+today()+'-'+cb.dataset.rut;if(localStorage.getItem(key))cb.checked=true;cb.addEventListener('change',function(){cb.checked?localStorage.setItem(key,'1'):localStorage.removeItem(key)})});

function renderAll(){renderTasks();renderPipeline();renderMensajes();renderMetrics();renderProyectos();renderCotizaciones();renderFinanzas();renderContenido();updateBadge()}

function dueChip(d){if(!d)return'';var t=today();if(d<t)return'<span class="due over">Vencida '+esc(d)+'</span>';if(d===t)return'<span class="due">Vence hoy</span>';return'<span class="due ok">'+esc(d)+'</span>'}

function renderAyuda(){var el=$('#ayudaBody');if(!el)return;el.innerHTML='<div class="card" style="line-height:1.9;font-size:14px"><b style="color:var(--accent)">1. El cerebro (IA) escribe</b> → actualiza app/tareas.json con lo que debe hacer hoy.<br><b style="color:var(--accent)">2. Tú ejecutas</b> → marcas tareas, agregas prospectos, escribes mensajes.<br><b style="color:var(--accent)">3. Guardas</b> → con la carpeta conectada, todo se guarda en los JSON.<br><b style="color:var(--accent)">4. El cerebro lee</b> → cuando me dices "revisa la app" o "ya terminé", leo los JSON y te doy el siguiente paso.<br><br><b>Tablero (Dashboard):</b> KPIs en vivo, embudo, reglas, proximas reuniones, ultimos movimientos.<br><b>Pipeline:</b> Kanban con arrastrar-soltar, montos en MXN, probabilidad por etapa.<br><b>Proyectos:</b> clientes con anticipo, saldo y entrega. Al Entregar → aviso de cobro.<br><b>Agenda:</b> reuniones con resultado obligatorio al marcar Realizada.<br><b>Cotizaciones:</b> documento imprimible, copiar texto para WhatsApp.<br><b>Motor de reglas:</b> alertas que no dejan escapar dinero.<br><b>Bitácora:</b> cada acción queda registrada para la historia.<br><b>Reportes:</b> genero el de la semana con KPIs vs meta.<br><br><b>Sincronizar:</b> vuelve a leer los archivos por si el cerebro los actualizó desde fuera.<br><b>Conectar carpeta:</b> selecciona app/ una sola vez; el navegador recuerda el permiso.<br><b>Sin conexión a archivos:</b> la app funciona en modo local (navegador) pero el cerebro NO vera los cambios.<br><br><b>Metodologías:</b> ritua diario 60 min y meta $10k/mes, pipeline Nuevo→Contactado→Respondió→Reunión→Cotizado→Cerrado, 50 contactos/semana, anticipo 50% obligatorio.</div>'}

function applyTheme(t){document.documentElement.setAttribute('data-theme',t);try{localStorage.setItem('dsw-theme',t)}catch(e){}var lb=$('#themeLabel');if(lb)lb.textContent=t==='dark'?'Oscuro':'Claro'}
function initTheme(){var saved='light';try{saved=localStorage.getItem('dsw-theme')||'light'}catch(e){}applyTheme(saved==='dark'?'dark':'light');var btn=$('#btnTheme');if(btn)btn.addEventListener('click',function(){applyTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark')})}

async function init(){
  buildNav();
  bindPipelineStatic();
  initTheme();
  if(localStorage.getItem('dsw-onboard'))$('#onboard').classList.add('hidden');
  await restore();await loadAll();resetDateDefaults();if(!dirHandle)setConn(localStorage.getItem('dsw-state')?'local':'none');
  renderDashboard();setupMobileMenu();
}
function setupMobileMenu(){$('#mobileMenuBtn').addEventListener('click',openDrawer);$('#closeDrawer').addEventListener('click',closeDrawer);$('#drawerOverlay').addEventListener('click',closeDrawer)}
$('#dismissOnboard').addEventListener('click',function(){localStorage.setItem('dsw-onboard','1');$('#onboard').classList.add('hidden')});
$('#btnConnect').addEventListener('click',connect);
$('#btnSync').addEventListener('click',async function(){
  if(!dirHandle){toast('Sin carpeta conectada: datos locales');return}
  var bm=JSON.stringify(state.mensajes),bt=JSON.stringify(state.tareas),bx=JSON.stringify([state.clientes,state.cotizaciones,state.finanzas,state.contenido,state.agenda,state.bitacora,state.reportes]);
  await loadAll();var parts=[];
  if(JSON.stringify(state.mensajes)!==bm)parts.push('respuestas nuevas');
  if(JSON.stringify(state.tareas)!==bt)parts.push('tareas nuevas');
  if(JSON.stringify([state.clientes,state.cotizaciones,state.finanzas,state.contenido,state.agenda,state.bitacora,state.reportes])!==bx)parts.push('actualizaciones');
  toast(parts.length?'Sincronizado: '+parts.join(' + '):'Sincronizado, sin cambios');
});
window.addEventListener('focus',async function(){
  if(!dirHandle)return;
  var before={t:JSON.stringify(state.tareas),p:JSON.stringify(state.prospectos),m:JSON.stringify(state.mensajes),x:JSON.stringify([state.clientes,state.cotizaciones,state.finanzas,state.contenido,state.agenda,state.bitacora,state.reportes])};
  await loadAll();var parts=[];
  if(JSON.stringify(state.tareas)!==before.t)parts.push('tareas actualizadas');
  if(JSON.stringify(state.mensajes)!==before.m)parts.push('respuestas del cerebro');
  if(JSON.stringify(state.prospectos)!==before.p)parts.push('prospectos cambiaron');
  if(JSON.stringify([state.clientes,state.cotizaciones,state.finanzas,state.contenido,state.agenda,state.bitacora,state.reportes])!==before.x)parts.push('clientes/finanzas/contenido cambiaron');
  if(parts.length)toast('Cambios del cerebro: '+parts.join(' · ')+'');
  updateBadge();
});
window.addEventListener('beforeunload',function(){localStorage.setItem('dsw-state',JSON.stringify(state))});

init();
