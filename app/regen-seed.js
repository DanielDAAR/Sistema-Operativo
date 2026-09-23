const fs=require('fs');
const path='app/data';
const tareas=JSON.parse(fs.readFileSync('app/tareas.json','utf8'));
const data={tareas:tareas};
const files=['prospectos','clientes','cotizaciones','finanzas','contenido','agenda','bitacora','reportes','mensajes'];
files.forEach(function(f){
  data[f]=JSON.parse(fs.readFileSync('app/data/'+f+'.json','utf8'));
});
var seed='var SEED_DATA='+JSON.stringify(data)+';\nlocalStorage.setItem("dsw-seed",JSON.stringify(SEED_DATA));\nwindow.SEED_DATA=SEED_DATA;\n';
fs.writeFileSync('app/seed.js',seed);
console.log('seed.js regenerated. Size:',Math.round(Buffer.byteLength(seed)/1024)+'KB');
console.log('Keys:',Object.keys(data).join(', '));
