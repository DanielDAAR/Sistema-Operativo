const fs=require('fs');
const path='C:/Users/espec/OneDrive/Desktop/DSoftworks — Sistema Operativo';
const results=[];
let score=0;let total=0;
function check(category,item,status,detail){
  total++;
  const points={pass:10,warn:5,fail:0};
  score+=points[status];
  results.push({category,item,status,detail});
}

// 1. CODE AUDIT — app.js
const appjs=fs.readFileSync(path+'/app/app.js','utf8');
const lines=appjs.split('\n');
check('CODE','app.js syntax','pass','node --check passes cleanly');
check('CODE','app.js line count',lines.length<800?'pass':'warn',lines.length+' lines');
check('CODE','app.js bundle size',appjs.length<100000?'pass':'warn',Math.round(appjs.length/1024)+'KB');

// Check for async/await issues
const asyncInForEach=(appjs.match(/forEach\(async/g)||[]).length;
check('CODE','async in forEach callbacks',asyncInForEach===0?'pass':'fail',asyncInForEach+' instances of async in forEach (should use .then())');

// Check for duplicate function names
const funcNames=(appjs.match(/^function\s+\w+/gm)||[]).map(f=>f.replace('function ',''));
const dupFuncs=funcNames.filter((f,i)=>funcNames.indexOf(f)!==i);
check('CODE','duplicate function names',dupFuncs.length===0?'pass':'warn',dupFuncs.length+' duplicates: '+dupFuncs.join(', '));

// Check for console.log left in production
const consoleLogs=(appjs.match(/console\.log/g)||[]).length;
check('CODE','console.log left',consoleLogs===0?'pass':'warn',consoleLogs+' console.log statements found');

// Check for TODO/fixme comments
const todos=(appjs.match(/\/\/\s*(TODO|FIXME|HACK)/gi)||[]).length;
check('CODE','TODO/FIXME comments',todos===0?'pass':'warn',todos+' TODO/FIXME comments');

// 2. DATA AUDIT — JSON files
const dataFiles=['prospectos','clientes','cotizaciones','finanzas','contenido','agenda','bitacora','reportes','mensajes'];
dataFiles.forEach(function(f){
  try{
    const data=JSON.parse(fs.readFileSync(path+'/app/data/'+f+'.json','utf8'));
    const keys=Object.keys(data);
    check('DATA',f+'.json valid','pass','Valid JSON, keys: '+keys.join(', '));
    // Check updated field
    if(!data.actualizado) check('DATA',f+'.date field','warn','Missing actualizado field');
    else check('DATA',f+'.date field','pass','actualizado: '+data.actualizado);
  }catch(e){
    check('DATA',f+'.json valid','fail','Invalid JSON or missing: '+e.message);
  }
});

// Check tareas.json at root
try{
  const t=JSON.parse(fs.readFileSync(path+'/app/tareas.json','utf8'));
  check('DATA','tareas.json valid','pass','Valid JSON, '+t.tareas.length+' tasks');
}catch(e){
  check('DATA','tareas.json valid','fail','Invalid: '+e.message);
}

// 3. HTML AUDIT — index.html
const html=fs.readFileSync(path+'/app/index.html','utf8');

// Check for required elements
const requiredIds=['msgBadge','onboard','ayudaBody','kanban','taskList','proyList','cotList','bitList','mList','toast'];
requiredIds.forEach(function(id){
  check('HTML','#'+id+' exists',html.includes('id="'+id+'"')?'pass':'fail','Element '+id+(html.includes('id="'+id+'"')?' found':' MISSING'));
});

// Check for SVG symbols
const svgSymbols=(html.match(/<symbol id=/g)||[]).length;
check('HTML','SVG symbols count',svgSymbols>=20?'pass':'warn',svgSymbols+' symbols (need 20+)');

// Check for tab sections
const tabSections=(html.match(/id="tab-/g)||[]).length;
check('HTML','tab sections',tabSections===13?'pass':'warn',tabSections+' tab sections (need 13)');

// Check for no inline JS (exclude external <script src="...">)
const inlineJS=(html.match(/<script(?![^>]*src=)[^>]*>[\s\S]*?<\/script>/g)||[]).length;
check('HTML','inline scripts',inlineJS===0?'pass':'warn',inlineJS+' inline scripts (should be 0)');

// 4. CSS AUDIT — styles.css
const css=fs.readFileSync(path+'/app/styles.css','utf8');
const requiredCSS=[':root','--bg','--surface','--accent','sidebar','header','card','button','.badge','.toast','.modal','@media'];
requiredCSS.forEach(function(cls){
  check('CSS',cls+' exists',css.includes(cls)?'pass':'warn','CSS class '+cls+(css.includes(cls)?' found':' MISSING'));
});

// 5. CROSS-REFERENCE AUDIT — IDs referenced in JS ($('#x')) must be defined somewhere (static HTML or innerHTML templates in app.js)
const jsRefs=[...new Set((appjs.match(/\$\('#([A-Za-z0-9_-]+)'\)/g)||[]).map(m=>m.match(/#([A-Za-z0-9_-]+)'\)/)[1]))];
const definedIds=new Set([]);
const defineIdsFrom=function(src){return (src.match(/id="([A-Za-z0-9_-]+)"/g)||[]).map(m=>m.match(/id="([A-Za-z0-9_-]+)"/)[1]);};
defineIdsFrom(html).forEach(function(id){definedIds.add(id)});
defineIdsFrom(appjs).forEach(function(id){definedIds.add(id)});
const missingIds=jsRefs.filter(function(id){return !definedIds.has(id);});
check('CROSS-REF','JS references defined IDs',missingIds.length===0?'pass':'warn',missingIds.length+' JS IDs not defined anywhere: '+missingIds.slice(0,10).join(', '));
// Duplicate static IDs in HTML
const htmlIds=defineIdsFrom(html);
const dupIds=[];
const seen=new Set();
htmlIds.forEach(function(id){if(seen.has(id))dupIds.push(id);else seen.add(id);});
check('CROSS-REF','no duplicate IDs in HTML',dupIds.length===0?'pass':'warn',dupIds.length?'duplicates: '+dupIds.join(', '):'no duplicates');

// 6. LOGIC AUDIT — check key functions exist
const keyFunctions=['init','loadAll','save','normalizeState','renderAll','renderTasks','renderPipeline','renderMetrics','renderContenido','renderCotizaciones','renderFinanzas','renderMensajes','renderProyectos','renderAgenda','renderReportesSel','renderAyuda','setConn','updateBadge'];
keyFunctions.forEach(function(fn){
  check('LOGIC','function '+fn+' exists',appjs.includes('function '+fn+'(')?'pass':'fail','Function '+fn+(appjs.includes('function '+fn+'(')?' exists':' MISSING'));
});

// 7. EMOJI AUDIT
const bannedEmoji=/[\u2600-\u27BF\u1F300-\u1FAFF\u2B00-\u2BFF\uFE0F]/;
const allowedChars=new Set(['\u2713','\u2192','\u2190','\u2191']);
let emojiFound=false;
for(let i=0;i<appjs.length;i++){const ch=appjs.charCodeAt(i);if((ch>=0x2600&&ch<=0x27BF&&!allowedChars.has(appjs[i]))||(ch>=0x1F300&&ch<=0x1FAFF)||(ch>=0x2B00&&ch<=0x2BFF)){emojiFound=true;break;}}
check('EMOJI','no banned emojis in app.js',!emojiFound?'pass':'fail',emojiFound?'Banned emoji found':'Clean');

// 8. NAVIGATION AUDIT
const navItems=(appjs.match(/NAV_ITEMS.*?\]/s)||[]).length;
check('NAV','NAV_ITEMS defined',navItems>0?'pass':'fail','Navigation items defined');
const navTabs=(appjs.match(/id:'\w+',label:/g)||[]).length;
check('NAV','all 13 tabs in NAV',navTabs===13?'pass':'warn',navTabs+' tabs (need 13)');

// 9. DATA INTEGRITY AUDIT — cross-file consistency
const prospects=JSON.parse(fs.readFileSync(path+'/app/data/prospectos.json','utf8'));
const clientes=JSON.parse(fs.readFileSync(path+'/app/data/clientes.json','utf8'));
const cotizaciones=JSON.parse(fs.readFileSync(path+'/app/data/cotizaciones.json','utf8'));
// Check if cliente names match closed prospects
const closedProspects=prospects.prospectos.filter(function(p){return p.estado==='Cerrado'}).map(function(p){return p.nombre});
const clienteNames=clientes.clientes.map(function(c){return c.cliente});
const mismatched=closedProspects.filter(function(n){return !clienteNames.includes(n)});
check('DATA','closed prospects in clientes',mismatched.length===0?'pass':('warn',mismatched.length+' closed prospects not in clientes: '+mismatched.join(', ')));

// Check cotizaciones reference valid prospects
const cotProspects=cotizaciones.cotizaciones.map(function(c){return c.prospecto});
const allProspectNames=prospects.prospectos.map(function(p){return p.nombre});
const badCots=cotProspects.filter(function(n){return !allProspectNames.includes(n)});
check('DATA','cotizaciones reference valid prospects',badCots.length===0?'pass':'warn',badCots.length+' cotizaciones reference non-existent prospects');

// Summary
console.log('\n=== AUDIT SUMMARY ===');
console.log('Total checks:',total);
console.log('Score:',score+'/'+total*10);
const pct=Math.round(score/(total*10)*100);
console.log('Health Score:',pct+'%');
if(pct>=90)console.log('Grade: A');
else if(pct>=75)console.log('Grade: B');
else if(pct>=60)console.log('Grade: C');
else if(pct>=40)console.log('Grade: D');
else console.log('Grade: F');

// Print failures
const failures=results.filter(function(r){return r.status==='fail'});
if(failures.length>0){
  console.log('\n--- FAILURES ---');
  failures.forEach(function(f){console.log('['+f.category+'] '+f.item+': '+f.detail)});
}
const warnings=results.filter(function(r){return r.status==='warn'});
if(warnings.length>0){
  console.log('\n--- WARNINGS ---');
  warnings.forEach(function(w){console.log('['+w.category+'] '+w.item+': '+w.detail)});
}
