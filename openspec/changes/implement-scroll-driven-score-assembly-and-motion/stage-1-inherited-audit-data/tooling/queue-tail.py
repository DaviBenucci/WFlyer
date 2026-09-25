import pathlib,subprocess,time,json
p=pathlib.Path('/tmp/wflyer-systematic-audit-20260913')
while pathlib.Path('/proc/600578').exists(): time.sleep(5)
for name,cmd in [('lifecycle',['node',str(p/'lifecycle.mjs')]),('shared',['node',str(p/'shared-probe.mjs')])]:
 with open(p/(name+'.log'),'w') as f:r=subprocess.run(cmd,stdout=f,stderr=subprocess.STDOUT)
 with open(p/'queue-results.jsonl','a') as f:f.write(json.dumps({'job':name,'exit':r.returncode})+'\n')
