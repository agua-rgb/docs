const express=require('express');
const fs=require('fs');
const path=require('path');
const app=express();
const PORT=process.env.PORT||3000;
const resultsFile=path.join(__dirname,'data','results.json');

app.use(express.json({limit:'20kb'}));
app.use(express.static(path.join(__dirname,'public')));

function clean(v,max){return typeof v==='string'?v.replace(/[\u0000-\u001F\u007F]/g,'').slice(0,max):'';}
function readRows(){try{return JSON.parse(fs.readFileSync(resultsFile,'utf8'));}catch{return [];}}
function writeRows(rows){fs.writeFileSync(resultsFile,JSON.stringify(rows,null,2),'utf8');}

app.get('/api/results',(req,res)=>{res.set('Cache-Control','no-store');res.json(readRows());});

app.post('/api/results',(req,res)=>{
  const employeeId=clean(req.body.employeeId,64);
  const email=clean(req.body.email,120);
  const accessKey=clean(req.body.accessKey,64);
  const diagnosticId=clean(req.body.diagnosticId,64);

  const accepted=
    employeeId==='-4821' &&
    email==='alex.rivera@locoto.mx' &&
    accessKey==='QA-7429' &&
    diagnosticId==='SYNTH-2030';

  const rows=readRows();
  rows.push({
    time:new Date().toISOString(),
    employeeId,email,accessKey,diagnosticId,
    status:accepted?'Accepted':'Rejected'
  });
  writeRows(rows.slice(-250));
  res.json({ok:true,accepted});
});

app.delete('/api/results',(req,res)=>{writeRows([]);res.json({ok:true});});

app.listen(PORT,'0.0.0.0',()=>console.log(`Listening on ${PORT}`));
