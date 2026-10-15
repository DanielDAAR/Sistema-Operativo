const fs=require('fs');
const appjs=fs.readFileSync('app/app.js','utf8');
const html=fs.readFileSync('app/index.html','utf8');
const jsIds=(appjs.match(/document\.getElementById\(['"](\w+)['"]\)/g)||[]).map(m=>m.match(/['"](\w+)['"]/)[1]);
const htmlIds=new Set((html.match(/id=['"](\w+)['"]/g)||[]).map(m=>m.match(/id=['"](\w+)['"]/)[1]));
const missing=jsIds.filter(id=>!htmlIds.has(id));
console.log('JS getElementById calls:',jsIds.length);
console.log('HTML IDs:',htmlIds.size);
console.log('Missing IDs:',[...new Set(missing)].join(', '));
// Also check jQuery-style references
const jqIds=(appjs.match(/\$\(['"](\w+)['"]\)/g)||[]).map(m=>m.match(/['"](\w+)['"]/)[1]);
const jqMissing=jqIds.filter(id=>!htmlIds.has(id));
console.log('\njQuery refs:',jqIds.length);
console.log('Missing jQuery:',[...new Set(jqMissing)].join(', '));
// Also check innerHTML assignments
const innerHTMLIds=(appjs.match(/\.innerHTML\s*=\s*['`"]/g)||[]).length;
console.log('\ninnerHTML with literal strings:',innerHTMLIds);
// Check data attributes
const dataAttrs=(html.match(/data-(\w+)=/g)||[]).length;
console.log('data-* attributes in HTML:',dataAttrs);
// Check what IDs HTML actually has
const allHtmlIds=[...htmlIds];
console.log('\nAll HTML IDs:',allHtmlIds.slice(0,50).join(', '));
console.log('... total:',allHtmlIds.length);
// Check what JS is actually trying to find
const relevant=['msgBadge','onboard','ayudaBody','kanban','taskList','proyList','cotList','bitList','mList','toast','navTab','container','sidebar','topbar','header','footer'];
relevant.forEach(function(id){
  console.log(id+': html='+htmlIds.has(id)+' js='+jsIds.includes(id));
});
