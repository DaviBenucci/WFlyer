import pathlib,subprocess,time,json
p=pathlib.Path('/tmp/wflyer-systematic-audit-20260913')
def alive(pid):
 try:return pathlib.Path(f'/proc/{pid}/stat').read_text().split()[2]!='Z'
 except FileNotFoundError:return False
while alive(883195):time.sleep(5)
for name,cmd in [('lifecycle-corrected',['node',str(p/'lifecycle.mjs')]),('shared',['node',str(p/'shared-probe.mjs')]),('configurations',['python3',str(p/'queue-configurations-corrected.py')]),('full-ink-oracle',['node',str(p/'check-ink.mjs')]),('mechanical-access',['python3',str(p/'compare-access.py')])]:
 with open(p/(name+'.log'),'w') as f:r=subprocess.run(cmd,stdout=f,stderr=subprocess.STDOUT)
 with open(p/'queue-results.jsonl','a') as f:f.write(json.dumps({'job':name,'exit':r.returncode})+'\n')
