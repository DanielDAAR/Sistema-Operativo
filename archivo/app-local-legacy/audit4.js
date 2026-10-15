const fs=require('fs');
const files=[{f:'tareas',p:'app/tareas.json'},{f:'prospectos',p:'app/data/prospectos.json'},{f:'clientes',p:'app/data/clientes.json'},{f:'cotizaciones',p:'app/data/cotizaciones.json'},{f:'finanzas',p:'app/data/finanzas.json'},{f:'contenido',p:'app/data/contenido.json'},{f:'agenda',p:'app/data/agenda.json'},{f:'bitacora',p:'app/data/bitacora.json'},{f:'reportes',p:'app/data/reportes.json'},{f:'mensajes',p:'app/data/mensajes.json'}];
files.forEach(function(item){
  var j=JSON.parse(fs.readFileSync(item.p,'utf8'));
  var empty=[];
  Object.keys(j).forEach(function(k){if(j[k]===''||j[k]===undefined)empty.push(k)});
  console.log(item.f+': actualizado='+(j.actualizado||'MISSING')+' emptyFields=['+empty.join(',')+']');
});
console.log('\n--- seed.js check ---');
var seed=fs.readFileSync('app/seed.js','utf8');
var sd=JSON.parse(seed.match(/SEED_DATA=(\{[\s\S]*\});/)[1]);
var keys=Object.keys(sd);
console.log('seed keys:',keys.join(', '));
keys.forEach(function(k){
  if(sd[k].actualizado==='')console.log('WARNING: seed.'+k+'.actualizado is EMPTY');
  else console.log('seed.'+k+'.actualizado='+sd[k].actualizado);
});
console.log('\n--- All clean! ---');
