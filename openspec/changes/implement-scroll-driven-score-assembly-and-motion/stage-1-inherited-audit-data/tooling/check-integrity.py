import pathlib,json,hashlib,subprocess,datetime
r=pathlib.Path('/home/davi-benucci/Área de trabalho/WFlyer');d=r/'openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-inherited-audit-data';start=json.load(open(d/'start-state.json'));historical=json.load(open(d.parent/'stage-1-inherited-audit-governance-validation.json'))['historicalAndProtectedIntegrity']
def sha(path):
 p=r/path
 return hashlib.sha256(p.read_bytes()).hexdigest()if p.exists()else None
changed=[{'path':p,'expected':h,'actual':sha(p)}for p,h in start['hashes'].items()if sha(p)!=h]
protected={kind:[{'path':x['path'],'expected':x['sha256'],'actual':sha(x['path']),'unchanged':sha(x['path'])==x['sha256']}for x in historical[kind]]for kind in ['seals','payloads']}
head=subprocess.check_output(['git','rev-parse','HEAD'],cwd=r,text=True).strip();diff=subprocess.run(['git','diff','--check'],cwd=r,text=True,capture_output=True)
out={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'expectedHead':start['head'],'actualHead':head,'originalFileCount':len(start['hashes']),'changedOriginalFiles':changed,'historical':protected,'gitDiffCheck':{'exit':diff.returncode,'output':diff.stdout+diff.stderr},'result':'PASS'if head==start['head']and not changed and all(x['unchanged']for a in protected.values()for x in a)and diff.returncode==0 else'FAIL','auditCompletionClaim':False}
(d/'audit-input-integrity.json').write_text(json.dumps(out,indent=2));print(out['result'],'original files',len(start['hashes']),'changed',len(changed),'seals',len(protected['seals']),'payloads',len(protected['payloads']),'diff',diff.returncode)
