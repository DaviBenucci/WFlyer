import pathlib,json,shutil,hashlib
root=pathlib.Path.cwd(); out=pathlib.Path('/tmp/wflyer-systematic-audit-20260913'); m=json.loads((root/'openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-inherited-audit-manifest.json').read_text()); audit=root/'openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-inherited-audit-data'
for source in ['current','historical']:
 d=out/source; d.mkdir(exist_ok=True)
 for target,link in [(root/'node_modules','node_modules'),(root/'src','src')]:
  if not (d/link).exists():(d/link).symlink_to(target,target_is_directory=True)
 shutil.copytree(root/'tests/e2e/helpers',d/'tests/e2e/helpers',dirs_exist_ok=True)
 shutil.copytree(root/'tests/helpers',d/'tests/helpers',dirs_exist_ok=True)
 for f in m['primary']['sourceFiles']:
  p=d/f['path']; p.parent.mkdir(parents=True,exist_ok=True); text=(root/f['path']).read_text().replace('import { expect,','import { expect as auditExpect,',1)
  idx=text.index('\n');text=text[:idx]+ '\nconst expect = auditExpect.configure({ soft: true });'+text[idx:]
  if p.name=='phase09-score-refinement.spec.ts':
   start=text.index('      const screenshotName =');end=text.index('\n    }',start);text=text[:start]+ '      // Audit-only: image artifact side effects omitted; traversal and all assertions retained.\n'+text[end:]
   start=text.index('    const screenshotPath =');end=text.index('\n\n    expect(audit.visits)',start);text=text[:start]+ '    // Audit-only: no final visual captures.\n'+text[end:]
  if p.name=='assembly-stage1-geometry.spec.ts':
   text=text.replace('requireCleanRuntime(runtime.snapshot());','expect(() => requireCleanRuntime(runtime.snapshot()), "runtime errors retained independently").not.toThrow();').replace('requireCleanRuntime(runtimeBeforeGeometry);','expect(() => requireCleanRuntime(runtimeBeforeGeometry)).not.toThrow();').replace('requireCleanRuntime(runtimeAfterGeometry);','expect(() => requireCleanRuntime(runtimeAfterGeometry)).not.toThrow();')
  p.write_text(text)
 (d/'tsconfig.json').write_text(json.dumps({'compilerOptions':{'paths':{'@/*':[str(root/'src/*')]}}}))
 config="""const lib='/tmp/wflyer-webkit-libs.4SYy8e/root/usr/lib/x86_64-linux-gnu';
module.exports={testDir:'./tests/e2e',timeout:180000,expect:{timeout:5000},workers:1,retries:0,maxFailures:0,fullyParallel:false,outputDir:__dirname+'/output',reporter:[[__dirname+'/reporter.cjs']],use:{baseURL:BASE,locale:'pt-BR',timezoneId:'America/Sao_Paulo',deviceScaleFactor:1,colorScheme:'light',reducedMotion:'no-preference',screenshot:'off',trace:'off',video:'off'},projects:['chromium','firefox','webkit'].map(name=>({name,use:{browserName:name,...(name==='webkit'?{launchOptions:{env:{...process.env,LD_LIBRARY_PATH:lib,LD_PRELOAD:['libevent-2.1.so.7','libavif.so.16','libmanette-0.2.so.0','libgav1.so.2','libhidapi-hidraw.so.0'].map(x=>lib+'/'+x).join(':')}}}:{})}}))};""".replace('BASE',json.dumps('http://127.0.0.1:'+('3100' if source=='current' else '3101')))
 (d/'config.cjs').write_text(config)
 reporter="""const fs=require('node:fs');const path=require('node:path');const out=OUT;fs.mkdirSync(out,{recursive:true});module.exports=class{onBegin(c,s){fs.writeFileSync(path.join(out,'collection-SOURCE.json'),JSON.stringify(s.allTests().map(t=>({id:t.id,title:t.titlePath(),location:t.location})),null,2))}onTestEnd(t,r){const attachments=r.attachments.map((a,i)=>{let body=a.body;if(!body&&a.path&&fs.existsSync(a.path))body=fs.readFileSync(a.path);let p;if(body&&a.contentType==='application/json'){p='SOURCE-'+t.id.replace(/[^a-zA-Z0-9]/g,'')+'-'+i+'.json';fs.writeFileSync(path.join(out,p),body)}return {name:a.name,contentType:a.contentType,evidence:p}});fs.appendFileSync(path.join(out,'primary-SOURCE.jsonl'),JSON.stringify({id:t.id,title:t.titlePath(),location:t.location,status:r.status,duration:r.duration,errors:r.errors,attachments})+'\\n');process.stdout.write(r.status+' '+t.title+'\\n')}onError(e){fs.appendFileSync(path.join(out,'runner-SOURCE-errors.jsonl'),JSON.stringify(e)+'\\n')}};""".replace('OUT',json.dumps(str(audit))).replace('SOURCE',source)
 (d/'reporter.cjs').write_text(reporter)
(audit/'primary-tooling-contract.json').write_text(json.dumps({'originalTestsUnchanged':True,'assertions':'same matchers and thresholds; soft assertion reporting retains failed test outcome and permits independent statements','runtimeGuard':'same requireCleanRuntime predicate recorded by soft not.toThrow','captures':'explicit image-only artifact calls omitted in scratch; source traversal and JSON attachments retained','historical':'Current probes against frozen runtime; successor-only metadata failures require shared-observable attribution, never automatic product failure','limitations':'control-flow-dependent literal equality flags in source attachments are not accepted as evidence when assertions fail; thrown dependency errors retained and missing subobservations need companion coverage'},indent=2))
print('prepared')
