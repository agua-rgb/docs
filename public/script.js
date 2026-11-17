(() => {
  const tabs=[...document.querySelectorAll('.tab-btn')];
  const panels=[...document.querySelectorAll('.task-panel')];

  function show(name){
    tabs.forEach(t=>t.classList.toggle('active',t.dataset.task===name));
    panels.forEach(p=>p.hidden=p.id!==`task-${name}`);
    if(name==='results') loadResults();
  }
  tabs.forEach(t=>t.addEventListener('click',()=>show(t.dataset.task)));

  async function submit(){
    const payload={
      employeeId:document.getElementById('employeeId').value.trim(),
      email:document.getElementById('email').value.trim(),
      accessKey:document.getElementById('accessKey').value.trim(),
      diagnosticId:document.getElementById('diagnosticId').value.trim()
    };
    const status=document.getElementById('challengeStatus');
    status.textContent='Submitting...';
    try{
      const r=await fetch('/api/results',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const d=await r.json();
      status.textContent=d.accepted?'Challenge unlocked.':'Submitted values were not accepted.';
    }catch{status.textContent='Submission failed.'}
  }

  async function loadResults(){
    const body=document.getElementById('resultsBody');
    const empty=document.getElementById('emptyResults');
    const wrap=document.getElementById('resultsWrap');
    try{
      const r=await fetch('/api/results',{cache:'no-store'});
      const rows=await r.json();
      body.innerHTML='';
      if(!rows.length){empty.hidden=false;wrap.hidden=true;return;}
      empty.hidden=true;wrap.hidden=false;
      rows.slice().reverse().forEach(row=>{
        const tr=document.createElement('tr');
        [new Date(row.time).toLocaleString(),row.employeeId,row.email,row.accessKey,row.diagnosticId,row.status].forEach(v=>{
          const td=document.createElement('td');td.textContent=v||'';tr.appendChild(td);
        });
        body.appendChild(tr);
      });
    }catch{empty.hidden=false;empty.textContent='Could not load results.';wrap.hidden=true;}
  }

  async function clearResults(){
    await fetch('/api/results',{method:'DELETE'});
    loadResults();
  }

  document.getElementById('unlockBtn').addEventListener('click',submit);
  document.getElementById('refreshResults').addEventListener('click',loadResults);
  document.getElementById('clearResults').addEventListener('click',clearResults);
})();