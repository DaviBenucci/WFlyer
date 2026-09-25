import os,time,subprocess,pathlib,json
p=pathlib.Path('/tmp/wflyer-systematic-audit-20260913')
while pathlib.Path('/proc/594183').exists():time.sleep(5)
for name,cmd in [('primary-historical',['node','node_modules/@playwright/test/cli.js','test','-c',str(p/'historical/config.cjs'),'phase09-score-']),('access-key',['node',str(p/'collect.mjs'),'key'])]:
 with open(p/(name+'.log'),'w') as f:r=subprocess.run(cmd,stdout=f,stderr=subprocess.STDOUT)
 with open(p/'queue-results.jsonl','a') as f:f.write(json.dumps({'job':name,'exit':r.returncode})+'\n')
