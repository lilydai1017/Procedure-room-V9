/* Quick health check: node scripts/check.js
   - every <script src> and <link href> in index.html exists
   - every JavaScript file parses (no syntax errors)
   - each room in rooms/ registers itself in ROOMS */
const fs=require("fs"), path=require("path"), vm=require("vm");
const root=path.join(__dirname,"..");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
let bad=0;
const refs=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).concat([...html.matchAll(/<link rel="stylesheet" href="(?!http)([^"]+)"/g)].map(m=>m[1]));
for(const r of refs){ const p=path.join(root,r); if(!fs.existsSync(p)){ console.log("MISSING  "+r); bad++; continue; }
  if(r.endsWith(".js")){ try{ new vm.Script(fs.readFileSync(p,"utf8"),{filename:r}); console.log("ok       "+r); } catch(e){ console.log("SYNTAX   "+r+"\n         "+e.message); bad++; } } else console.log("ok       "+r); }
for(const d of fs.readdirSync(path.join(root,"rooms"))){ if(d.startsWith("_")) continue; const rj=path.join(root,"rooms",d,"room.js");
  if(!fs.existsSync(rj)||!fs.readFileSync(rj,"utf8").includes("ROOMS."+d)){ console.log("ROOM     rooms/"+d+"/room.js must contain ROOMS."+d+" = {...}"); bad++; }
  if(!html.includes(`rooms/${d}/room.js`)){ console.log("NOTE     rooms/"+d+" is not loaded by index.html yet"); } }
console.log(bad? `\n${bad} problem(s) found.` : "\nAll checks passed.");
process.exit(bad?1:0);
