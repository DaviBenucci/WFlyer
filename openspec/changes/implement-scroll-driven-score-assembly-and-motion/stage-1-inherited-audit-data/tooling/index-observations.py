"""Audit-only normalized index. Raw records remain immutable and authoritative."""
import pathlib,json,datetime,collections
r=pathlib.Path('/home/davi-benucci/Área de trabalho/WFlyer');d=r/'openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-inherited-audit-data';m=json.load(open(d.parent/'stage-1-inherited-audit-manifest.json'));meta=json.load(open(d/'execution-metadata.json'))
def rows(name):
 p=d/name
 return [json.loads(x) for x in p.read_text().splitlines()] if p.exists() else []
records=[]
for name in ['access-key.jsonl','access-no-key.jsonl','access-visible.jsonl','lifecycle.jsonl','static.jsonl']:
 for i,x in enumerate(rows(name),1):
  observed=x.get('measurements')or{};layer=observed.get('layer')or{};root=observed.get('root')or{}
  record={'slotKey':x['slotKey'],'group':x['group'],'sourceRevision':m['historicalSource']if x['source']=='historical'else m['head'],'sourcePinsDigest':meta['sourcePinsDigest'],'engineVersion':x.get('engineVersion'),'exactInputs':x.get('exactInputs'),'readiness':observed.get('readiness',{'evidence':'See sequence mount step; no synthetic readiness PASS'}),'rawValidatorOutcome':x['rawValidatorOutcome'],'rawOutcomeScope':'Collector measurements only; full enabled source oracles, runtime errors and missing sequence substeps retain independent outcomes. OBSERVED is not acceptance PASS.','measurements':{'rawFile':name,'line':i},'evidencePaths':[name],'comparisonKey':x['comparisonKey'],'equivalenceStatus':'PENDING_MECHANICAL_JOIN','candidateStatus':root.get('data-motion-projects-capacity','NOT_APPLICABLE_OR_NOT_OBSERVED'),'runtimeDisposition':{'actualMode':root.get('data-projection-mode')or layer.get('data-score-projection')or root.get('data-review-frame-mode'),'runtimeErrorCount':len(x.get('runtimeErrors',x.get('errors',[]))),'safeFallbackAvailable':None,'qualification':'Policy selection is not proof of complete safe fallback.'},'classification':'UNCLASSIFIED / NEEDS_REVIEW','rootOrUnclassifiedClusterKey':'pending-raw-completion/'+x['group'],'startedAt':x.get('startedAt'),'completedAt':x.get('completedAt')}
  if x['group']=='access':record['subObservationFlags']={'committedState':x.get('stateCommitted'),'sourceBoundProven':(x.get('transientSourceEnvelope')or{}).get('sourceBoundProven'),'providerLimitation':x.get('providerLimitation'),'runtimeErrorsScope':x.get('runtimeErrorsScope','cumulative prior context; origin requires attribution')}
  else:record['subObservationFlags']={'stepErrors':[s['name'] for s in x.get('steps',[])if s.get('outcome')=='ERROR'],'hiddenObserved':next((s.get('value',{}).get('actualHiddenObserved')for s in x.get('steps',[])if s['name']=='actual-hide-resume'),None)}
  records.append(record)
bykey=collections.Counter(x['slotKey']for x in records)
if any(v!=1 for v in bykey.values()):raise RuntimeError('Duplicate final observation keys; preserve raw and resolve indexing before completion.')
(d/'supplemental-observation-index.jsonl').write_text(''.join(json.dumps(x)+'\n'for x in records))
(d/'supplemental-index-status.json').write_text(json.dumps({'status':'IN_PROGRESS_UNCLASSIFIED_NOT_FINAL_AUDIT_RESULT','updatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'indexedRecords':len(records),'groups':dict(collections.Counter(x['group']for x in records)),'completenessClaim':False},indent=2))
print('indexed',len(records),'unique supplemental slots; provisional only')
