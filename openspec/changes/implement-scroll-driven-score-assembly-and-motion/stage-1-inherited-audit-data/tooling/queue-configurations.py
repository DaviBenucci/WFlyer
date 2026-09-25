import pathlib,subprocess,time,json,os,signal,urllib.request,datetime
p=pathlib.Path('/tmp/wflyer-systematic-audit-20260913');root=pathlib.Path('/home/davi-benucci/Área de trabalho/WFlyer');historical=pathlib.Path('/tmp/wflyer-access-history-x6dvq4ay')
while pathlib.Path('/proc/614509').exists():time.sleep(5)
def record(x):
 with open(p/'queue-results.jsonl','a') as f:f.write(json.dumps(x)+'\n')
# Only the two server processes created and recorded by this audit.
for pid in [590211,590212]:
 try:
  cmd=pathlib.Path(f'/proc/{pid}/cmdline').read_bytes()
  if b'next-server' not in cmd:raise RuntimeError(f'Owned server identity changed: {pid}')
  os.kill(pid,signal.SIGTERM)
 except FileNotFoundError:pass
for phase,key in [('no-key',''),('visible','3x00000000000000000000FF')]:
 servers=[]
 try:
  for source,cwd,port in [('current',root,3100),('historical',historical,3101)]:
   env={**os.environ,'NEXT_TELEMETRY_DISABLED':'1','NEXT_PUBLIC_TURNSTILE_SITE_KEY':key}
   log=open(p/f'{source}-server-{phase}.log','w');child=subprocess.Popen(['node','node_modules/next/dist/bin/next','dev','--webpack','--port',str(port),'--hostname','127.0.0.1'],cwd=cwd,env=env,stdout=log,stderr=subprocess.STDOUT,start_new_session=True);servers.append(child)
   deadline=time.time()+120
   while True:
    if child.poll() is not None:raise RuntimeError(f'{source} server exited {child.returncode}')
    try:
     with urllib.request.urlopen(f'http://127.0.0.1:{port}/__visual-lab/story/score-paths/preview?candidate=organic-soft&mode=vertical-wide&theme=light',timeout=5) as r:
      if r.status==200:break
    except Exception as e:
     if time.time()>deadline:raise RuntimeError(f'{source} startup failed: {e}')
     time.sleep(1)
   record({'job':'server-start','phase':phase,'source':source,'port':port,'publicSiteKey':key or 'absent','pid':child.pid,'time':datetime.datetime.now(datetime.timezone.utc).isoformat()})
  with open(p/f'access-{phase}.log','w') as f:r=subprocess.run(['node',str(p/'collect.mjs'),phase],cwd=root,stdout=f,stderr=subprocess.STDOUT)
  record({'job':f'access-{phase}','exit':r.returncode})
 finally:
  for child in servers:
   if child.poll() is None:
    os.killpg(child.pid,signal.SIGTERM)
    try:child.wait(timeout=15)
    except subprocess.TimeoutExpired:record({'job':'server-stop','pid':child.pid,'error':'process did not terminate within15s; no forced kill'})
  time.sleep(2)
