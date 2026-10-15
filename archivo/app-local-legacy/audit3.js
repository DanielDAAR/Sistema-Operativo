const fs=require('fs');
const files=['prospectos','clientes','cotizaciones','finanzas','contenido','agenda','bitacora','reportes','mensajes'];
files.forEach(function(f){
  try{
    var j=JSON.parse(fs.readFileSync('app/data/'+f+'.json','utf8'));
    var fields=Object.keys(j);
    var emptyFields=fields.filter(function(k){return j[k]===undefined||j[k]===null||j[k]===''});
    console.log(f+'.json: keys='+fields.join(',')+' empty='+emptyFields.join(',')+' hasActualizado='+('actualizado' in j));
    // Check nested objects for empty actualizado
    if(j.actualizado==='') console.log('  WARNING: actualizado is empty string');
  }catch(e){
    console.log(f+'.json: ERROR '+e.message);
  }
});
