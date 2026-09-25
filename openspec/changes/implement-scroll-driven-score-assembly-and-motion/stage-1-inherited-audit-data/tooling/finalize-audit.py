"""Reconcile the frozen audit denominator and consolidate existing raw evidence.

This script performs no browser observation, product mutation, or repair.
"""
import collections, datetime, hashlib, json, pathlib, re, subprocess

D=pathlib.Path(__file__).resolve().parent.parent
C=D.parent
R=C.parents[2]
M=json.loads((C/'stage-1-inherited-audit-manifest.json').read_text())
META=json.loads((D/'execution-metadata.json').read_text())
def rows(name):
 p=D/name
 if p.exists():
  with p.open() as f:
   for i,line in enumerate(f,1):
    if line.strip():yield i,json.loads(line)
def write(path,value):path.write_text(json.dumps(value,indent=2,ensure_ascii=False)+'\n')
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
slots={}
def add(key,group,source,engine,inputs):
 if key in slots:raise ValueError('Duplicate manifest slot '+key)
 slots[key]={'slotKey':key,'group':group,'source':source,'sourceRevision':M['historicalSource'] if source=='historical' else M['head'],'sourcePinsDigest':META['sourcePinsDigest'],'engine':engine,'engineVersion':None,'exactInputs':inputs,'rawValidatorOutcome':'NOT_OBSERVED','completionStatus':'NOT_EXECUTED','reason':'No persisted observation or explicit infrastructure blocker','evidencePaths':[],'rawRecords':[],'classification':'UNCLASSIFIED / NEEDS_REVIEW','rootOrUnclassifiedClusterKey':[],'candidateStatus':'NOT_OBSERVED','runtimeDisposition':{'actualMode':None,'safeFallbackQualified':False},'equivalenceStatus':'NOT_QUALIFIED','readiness':{'qualified':False},'measurements':None}
for x in M['primary']['cases']:
 for source in ['current','historical']:add(f"primary/{x['engine']}/{x['file']}/{x['title']}/{source}",'primary',source,x['engine'],x)
for engine in M['controls']['engines']:
 for source in ['historical','current']:
  for theme in M['controls']['themes']:
   for p in M['accessEnvelope']['profiles']:
    for state in M['accessEnvelope']['states']:add(f"access/{source}/{engine}/{theme}/{p['label']}/{state['label']}",'access',source,engine,{'profile':p,'theme':theme,'state':state})
   for p in M['lifecycle']['profiles']:add(f"lifecycle/{source}/{engine}/{theme}/{p['label']}",'lifecycle',source,engine,{'profile':p,'theme':theme})
  for p in M['staticAccessibility']['profiles']:add(f"static/{source}/{engine}/{p['label']}",'static',source,engine,{'profile':p})
guards=json.loads((D/'guard-list.json').read_text())
for g in guards:add('guard/current/'+str(pathlib.Path(g['file']).relative_to(R))+'/'+g['name'].replace(' > ',' '),'guard','current','node',g)
assert len(slots)==3692, len(slots)
unknown=[];duplicates=[];rawCounts=collections.Counter();accessSmall={};primaryErrors=[]
def attach(key,file,line,raw):
 if key not in slots:unknown.append({'slotKey':key,'file':file,'line':line});return None
 s=slots[key]
 s['rawRecords'].append({'file':file,'line':line,'rawValidatorOutcome':raw})
 if len(s['rawRecords'])>1:duplicates.append(key)
 if file not in s['evidencePaths']:s['evidencePaths'].append(file)
 return s
for source in ['current','historical']:
 file='primary-'+source+'.jsonl'
 for line,x in rows(file):
  title=x['title'];key=f"primary/{title[1]}/tests/e2e/{title[2]}/{' / '.join(title[3:])}/{source}"
  s=attach(key,file,line,x['status'])
  if not s:continue
  s.update(rawValidatorOutcome={'passed':'PASS','failed':'FAIL'}.get(x['status'],'ERROR'),completionStatus='COMPLETED' if x['status'] in ['passed','failed'] else 'PARTIAL_UNCLASSIFIED',reason='Original assertion outcomes retained; completed test does not imply every dependent substep ran',readiness={'evidence':'original test and attachments'},measurements={'attachments':x.get('attachments',[])},comparisonKey=key.rsplit('/',1)[0],engineVersion=META.get('versions',{}).get('playwright'))
  for a in x.get('attachments',[]):
   if a.get('evidence'):s['evidencePaths'].append(a['evidence'])
  for e in x.get('errors',[]):
   msg=re.sub(r'\x1b\[[0-9;]*m','',e.get('message',''));loc=e.get('location',{})
   primaryErrors.append({'slotKey':key,'message':msg,'file':pathlib.Path(loc.get('file','unknown')).name,'line':loc.get('line')})
for file in ['access-key.jsonl','access-no-key.jsonl','access-visible.jsonl','lifecycle.jsonl','static.jsonl']:
 for line,x in rows(file):
  rawCounts[file]+=1;s=attach(x['slotKey'],file,line,x['rawValidatorOutcome'])
  if not s:continue
  m=x.get('measurements')or{};root=m.get('root')or{};layer=m.get('layer')or{}
  s.update(rawValidatorOutcome=x['rawValidatorOutcome'],engineVersion=x.get('engineVersion'),comparisonKey=x.get('comparisonKey'),exactInputs=x.get('exactInputs'),readiness=m.get('readiness',{'evidence':'sequence mount step'}),measurements={'rawFile':file,'line':line,'overflow':m.get('overflow'),'inkMinimumClearance':(m.get('ink')or{}).get('minimumClearance')},candidateStatus=root.get('data-motion-projects-capacity','NOT_OBSERVED'),runtimeDisposition={'actualMode':root.get('data-projection-mode')or layer.get('data-score-projection')or root.get('data-review-frame-mode'),'safeFallbackQualified':False},reason='Measured outcome retained independently from stage qualification')
  if x['group']=='access':
   s['completionStatus']='COMPLETED' if x['rawValidatorOutcome'] in ['PASS','FAIL'] else 'PARTIAL_UNCLASSIFIED'
   t=x.get('transientSourceEnvelope')or{}
   if t.get('sourceBoundProven') is True:s.update(completionStatus='COMPLETED',reason='Transient state has no committed frame; source-derived envelope obligation proven in raw record; not a live-frame PASS')
   if x.get('providerLimitation'):
    s.update(completionStatus='INFRASTRUCTURE_BLOCKED',reason=x['providerLimitation'])
   s['subObservationFlags']={'stateCommitted':x.get('stateCommitted'),'sourceBoundProven':t.get('sourceBoundProven'),'providerLimitation':x.get('providerLimitation'),'errors':[e.get('message','').split('\n')[0] for e in x.get('errors',[])],'runtimeErrorsScope':x.get('runtimeErrorsScope','cumulative; do not count duplicates as roots')}
   if x['rawValidatorOutcome']=='ERROR':s['reason']='Requested state/readiness was not established; raw errors retained, cause not automatically infrastructure or product'
   accessSmall[x['slotKey']]={'profile':x['exactInputs']['profile']['label'],'state':x['exactInputs']['state']['label'],'source':x['source'],'overflow':m.get('overflow')or{},'ink':(m.get('ink')or{}).get('minimumClearance'),'runtimePageErrors':[e.get('message')for e in x.get('runtimeErrors',[])if isinstance(e,dict)and e.get('type')=='pageerror']}
  else:
   hidden=next((t.get('value',{}).get('actualHiddenObserved')for t in x.get('steps',[])if t['name']=='actual-hide-resume'),None)
   stepErrors=[{'name':t['name'],'message':(t.get('error')or{}).get('message',str(t.get('value','')))}for t in x.get('steps',[])if t.get('outcome')=='ERROR']
   s['subObservationFlags']={'stepCount':len(x.get('steps',[])),'stepErrors':stepErrors,'actualHiddenObserved':hidden}
   s.update(completionStatus='COMPLETED' if x['rawValidatorOutcome']=='OBSERVED' else 'PARTIAL_UNCLASSIFIED',reason='Partial sequence; every raw failed or unobserved substep remains blocking')
   serialized=json.dumps(x.get('errors',[]))+json.dumps(stepErrors)
   if 'Target page, context or browser has been closed' in serialized:s.update(completionStatus='INFRASTRUCTURE_BLOCKED',reason='Audit-owned browser interruption prevented sequence acquisition; attempted raw steps are retained')
   elif hidden is False:s.update(completionStatus='INFRASTRUCTURE_BLOCKED',reason='Headless engine did not deliver actual hidden-tab state; synthetic visibility is forbidden; other recorded steps retained')
   elif x['group']=='static' and x.get('steps') and all('Missing scene' in e['message'] for e in stepErrors):s.update(completionStatus='COMPLETED',reason='Actual public route inspected; absent v2 scenes are a manifest/surface contract defect, not fabricated public content loss')
g=json.loads((D/'guards-current.json').read_text())
for f in g['testResults']:
 for a in f['assertionResults']:
  key='guard/current/'+str(pathlib.Path(f['name']).relative_to(R))+'/'+a['fullName'];s=attach(key,'guards-current.json',None,a['status'])
  if s:s.update(rawValidatorOutcome='PASS' if a['status']=='passed' else 'FAIL',completionStatus='COMPLETED',reason='Pinned deterministic test case executed',comparisonKey=key,readiness={'sourcePinned':True},engineVersion=META['versions']['node'])
mapping=D/'shared-historical-obligations.json'
if mapping.exists():
 for x in json.loads(mapping.read_text())['obligations']:
  s=attach(x['slotKey'],mapping.name,None,x['rawValidatorOutcome'])
  if not s:continue
  s.update(rawValidatorOutcome=x['rawValidatorOutcome'],measurements={'recordSelectors':x['recordSelectors']},reason='; '.join(x['historicalLimits']),completionStatus='COMPLETED' if not x['missingEvidence'] and x['rawValidatorOutcome']=='OBSERVED_SHARED_CONTRACT' else 'PARTIAL_UNCLASSIFIED',equivalenceStatus='EXPLICIT_COMMON_INPUT_WHERE_RECORDED',comparisonKey=x['slotKey'].rsplit('/',1)[0])
  if 'hydration.spec.ts' in x['case']['file'] and 'identical to Node' not in x['case']['title']:s['completionStatus']='PARTIAL_UNCLASSIFIED'
for _,x in rows('infrastructure-blocked.jsonl'):
 s=slots.get(x['slotKey'])
 if s:
  s.update(completionStatus='INFRASTRUCTURE_BLOCKED',reason=x['reason'])
  s['evidencePaths'].append('infrastructure-blocked.jsonl')
  s['notExecutedAfterFamilyBlock']=x.get('notExecuted',False)
# One accidental overlapping sequence must not be counted as valid serial evidence.
overlap='lifecycle/historical/webkit/light/enhanced-or-fallback-pointer-keyboard'
if len(slots[overlap]['rawRecords'])>1:slots[overlap].update(completionStatus='INFRASTRUCTURE_BLOCKED',reason='Two overlapping audit workers recorded this key during SIGTERM-resistant shutdown; both raw records preserved; serial provenance unqualified')
pairFile=D/'access-paired-comparisons.json';pairs=json.loads(pairFile.read_text())['pairs'] if pairFile.exists() else []
for p in pairs:
 for source in ['current','historical']:
  if p.get(source) in slots:
   s=slots[p[source]];s['equivalenceStatus']=p['equivalenceStatus'];s['equivalenceLimitations']=p.get('equivalenceLimitations',[])
   s['pairedComparisonEvidence']={'file':pairFile.name,'comparisonKey':p['comparisonKey']}
   if any(p.get('delta',{}).values()):s['equivalenceLimitations'].append('NONZERO_DELTA_REQUIRES_CAUSAL_REVIEW; mechanical input join alone does not establish root lineage')
assert not unknown,unknown

# Causal findings are curated separately; unresolved clusters never receive invented root IDs.
analysis=json.loads((D/'root-analysis.json').read_text());roots=analysis['confirmedRoots'];clusters=analysis['unclassifiedClusters']
occ={x['id']:set()for x in roots+clusters}
for key,x in accessSmall.items():
 s=slots[key]
 if x['overflow'].get('vertical',0)>0:occ['ASM-CR-001'].add(key)
 if x['overflow'].get('horizontal',0)>0:occ['UNCLASSIFIED-ACCESS-INLINE'].add(key)
 if x['ink'] is not None and x['ink']<12:occ['UNCLASSIFIED-INK-CLEARANCE'].add(key)
 if x['runtimePageErrors'] or s['rawValidatorOutcome']=='ERROR':occ['UNCLASSIFIED-RUNTIME-READINESS'].add(key)
 if s['equivalenceStatus']!='EQUIVALENT_DECLARED_AND_OBSERVED_INPUTS':occ['UNCLASSIFIED-EQUIVALENCE'].add(key)
 if x['state']=='VALIDATING' and not s['subObservationFlags']['sourceBoundProven']:occ['UNCLASSIFIED-TRANSIENT-ENVELOPE'].add(key)
 if s['subObservationFlags']['providerLimitation']:occ['UNCLASSIFIED-PROVIDER-ENVELOPE'].add(key)
for p in pairs:
 if p.get('equivalenceStatus')=='EQUIVALENT_DECLARED_AND_OBSERVED_INPUTS' and any(p.get('delta',{}).values()):
  for source in ['current','historical']:occ['UNCLASSIFIED-ACCESS-INLINE'].add(p[source])
for s in slots.values():
 key=s['slotKey']
 if s['group']=='static':occ['ASM-AUD-002'].add(key)
 if s['completionStatus']=='INFRASTRUCTURE_BLOCKED':occ['ASM-AUD-003'].add(key)
 if s['group']=='lifecycle' and s['completionStatus']!='COMPLETED':occ['UNCLASSIFIED-LIFECYCLE'].add(key)
 if s['group']=='primary' and s['completionStatus']!='COMPLETED':occ['UNCLASSIFIED-EQUIVALENCE'].add(key)
for e in primaryErrors:
 key=e['slotKey'];msg=e['message'];line=e['line'];f=e['file']
 if f=='phase09-score-path-review.spec.ts' and line in [257,469,666,751]:occ['ASM-CR-001'].add(key)
 elif f=='phase09-score-path-review.spec.ts' and line in [464,472,555,698,712]:occ['UNCLASSIFIED-COMPACT-LAYOUT'].add(key)
 elif 'COLLISION' in msg:occ['UNCLASSIFIED-INK-CLEARANCE'].add(key)
 elif 'horizontal-enhanced' in msg and 'vertical-wide' in msg:occ['ASM-AUD-001'].add(key)
 else:occ['UNCLASSIFIED-PRIMARY-ASSERTIONS'].add(key)
for _,x in rows('shared-runtime.jsonl'):
 if x.get('renderedStaffIntersections',0):
  # Source pairing proves observations, not causal root grouping.
  for s in slots.values():
   if s['group']=='primary' and s['source']==x['source'] and s['engine']==x['engine']:occ['UNCLASSIFIED-GEOMETRY-LINEAGE'].add(s['slotKey'])
for item in roots+clusters:
 item['occurrenceSlotKeys']=sorted(occ[item['id']]);item['occurrenceSlotCount']=len(occ[item['id']]);item['stageDisposition']='BLOCK_STAGE';item['dispositionApproval']=None
 for key in occ[item['id']]:slots[key]['rootOrUnclassifiedClusterKey'].append(item['id'])
for s in slots.values():
 refs=s['rootOrUnclassifiedClusterKey'];confirmed=[r for r in roots if r['id'] in refs]
 s['classification']=confirmed[0]['classification'] if confirmed else 'PASS' if s['rawValidatorOutcome']=='PASS' and not refs else 'UNCLASSIFIED / NEEDS_REVIEW'
 if not refs and s['classification']!='PASS':s['rootOrUnclassifiedClusterKey']=['UNCLASSIFIED-PRIMARY-ASSERTIONS']

counts=collections.Counter(s['completionStatus']for s in slots.values())
baseCases=len({(x['file'],x['title'])for x in M['primary']['cases']})
logical={'primary':baseCases,'access':len(M['accessEnvelope']['profiles'])*len(M['accessEnvelope']['states'])*len(M['controls']['themes']),'lifecycle':len(M['lifecycle']['profiles'])*len(M['controls']['themes']),'static':len(M['staticAccessibility']['profiles']),'guards':len(guards)}
assert logical=={'primary':50,'access':540,'lifecycle':8,'static':4,'guards':80},logical
expanded={'primary':300,'access':3240,'lifecycle':48,'static':24,'guards':80}
classificationCounts=collections.Counter(x['classification']for x in roots)
summary={'AUDIT_COMPLETE':False,'COLLECTION_ACCOUNTED_FOR':all(s['completionStatus']!='NOT_EXECUTED' for s in slots.values()),'MANIFEST_LOGICAL_CASES':sum(logical.values()),'EXPANDED_OBSERVATIONS':len(slots),'COMPLETED_OBSERVATIONS':counts['COMPLETED'],'INFRASTRUCTURE_BLOCKED':counts['INFRASTRUCTURE_BLOCKED'],'NOT_EXECUTED_OR_PARTIAL':counts['NOT_EXECUTED']+counts['PARTIAL_UNCLASSIFIED'],'UNIQUE_ROOT_CAUSES':len(roots),'CURRENT_REGRESSIONS':classificationCounts['CURRENT_REGRESSION'],'INHERITED_CRITICAL':classificationCounts['INHERITED_CRITICAL'],'INHERITED_NONBLOCKING':classificationCounts['INHERITED_NONBLOCKING'],'VALIDATION_PIPELINE_DEFECTS':classificationCounts['VALIDATION_PIPELINE_DEFECT'],'UNCLASSIFIED':len(clusters),'OUT_OF_AUDIT_SCOPE':len(analysis['outOfAuditScope']),'BLOCKING_ROOTS':[r['id']for r in roots],'POTENTIAL_DEFER_ROOTS':[],'AUDIT_REPORT_PATH':str((C/'stage-1-inherited-audit-report.md').relative_to(R)),'AUDIT_RESULTS_PATH':str((C/'stage-1-inherited-audit-inventory.json').relative_to(R))}
assert summary['COMPLETED_OBSERVATIONS']+summary['INFRASTRUCTURE_BLOCKED']+summary['NOT_EXECUTED_OR_PARTIAL']==3692
coverage={'definition':'Logical means engine/source-independent scenario, preserving profile, theme, state and all existing guard parameter cases. The manifest names 50 per-engine primary cases and 80 expanded current guard cases. No selector or source dimension was added.','logicalByGroup':logical,'expansion':'(50 + 540 + 8 + 4) * 3 engines * 2 revisions + 80 current guards = 3692','expandedByGroup':expanded,'manifestExplicitBrowserSlots':3612,'guardSelectors':9,'guardExecutableCases':80,'historicalGuardLineageOnly':34,'statusCounts':dict(counts),'notCompleted':[{'slotKey':s['slotKey'],'completionStatus':s['completionStatus'],'reason':s['reason'],'evidencePaths':s['evidencePaths']}for s in slots.values()if s['completionStatus']!='COMPLETED'],'duplicateRawKeys':sorted(set(duplicates)),'unmappedKeys':unknown,'supportingArtifactsDoNotAddObservationSlots':['shared-pure.jsonl','shared-runtime.jsonl','complete-ink-oracle.jsonl','full-center-replay.jsonl','guards-historical.json']}
pin=json.loads((C/'stage-1-inherited-audit-source-pins.json').read_text());drift=[p for p,h in pin['currentFiles'].items()if not (R/p).exists()or sha(R/p)!=h]
integrity=json.loads((D/'audit-input-integrity.json').read_text());integrity['liveSourcePinsChecked']=len(pin['currentFiles']);integrity['liveSourcePinDrift']=drift;integrity['knownExternalGovernanceAddition']='external-routing-policy-addition.json';integrity['allInitialFilesUnchanged']=False
assert not drift,drift
assert sha(C/'stage-1-inherited-audit-manifest.json')=='78c04b22d05831a8581b06723bfa12abbde8132ea104f477097024ebf68883a4'
inventory={'format':'wflyer-stage1-inherited-audit-inventory/v1','updatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'status':'BLOCKED_OWNER_BATCH_DISPOSITION_AUDIT_EVIDENCE_INCOMPLETE','summary':summary,'coverageReconciliation':coverage,'confirmedRoots':roots,'unclassifiedClusters':clusters,'rootCountRule':'UNIQUE_ROOT_CAUSES counts only causally supported roots. UNCLASSIFIED counts unresolved clusters, not confirmed unique roots; the two values must not be summed as a proved defect count. Zero confirmed regressions is not evidence of no regressions.','outOfAuditScope':analysis['outOfAuditScope'],'observations':list(slots.values()),'sourceIntegrity':integrity,'limitations':analysis['limitations'],'ownerDecisionRequired':True,'repairAuthorized':False,'humanGeometryApproval':False}
write(C/'stage-1-inherited-audit-inventory.json',inventory)
write(D/'final-coverage-ledger.json',coverage)
write(D/'final-summary.json',summary)
report=['# Stage-1 inherited-defect audit — consolidated owner batch','', 'Collection is closed at the owner-requested bounded stop. **AUDIT_COMPLETE=false**: required infrastructure, observation and causal-classification gaps remain. This report is not geometry approval, a repair authorization or a historical aggregate PASS.','', '## Count reconciliation','',coverage['definition'],'', '| Group | Logical cases | Expanded observations |','| --- | ---: | ---: |']
report += [f"| {k} | {logical[k]} | {expanded[k]} |"for k in logical]
report += ['',coverage['expansion'],'',f"Completed: {summary['COMPLETED_OBSERVATIONS']}; infrastructure-blocked: {summary['INFRASTRUCTURE_BLOCKED']}; not executed or partially observed: {summary['NOT_EXECUTED_OR_PARTIAL']}. These categories are disjoint and sum to 3,692. Completed observations include recorded FAILs and proven source-only transient envelopes, never an implied PASS.",'','Every incomplete key and reason is recorded in `stage-1-inherited-audit-data/final-coverage-ledger.json`. Raw attempts, duplicated keys and partial substeps remain linked in the single inventory. Supporting constructor/oracle records and the 34 historical guard cases do not increase the denominator.','','## Confirmed causal roots','','| ID | Classification | Mechanism / impact |','| --- | --- | --- |']
report += [f"| {x['id']} | {x['classification']} | {x['title']} |"for x in roots]
report += ['', 'The inventory separates root lineage from associated symptom slots. A linked symptom does not prove that all its failures share that root. Each confirmed root includes ownership, minimum proposed repair/recovery boundary and evidence. No finding is automatically deferred.','','## Unresolved clusters','']
report += [f"- **{x['id']}**: {x['title']} {x['limitation']}"for x in clusters]
report += ['','These are explicit unresolved grouping candidates, not fabricated diagnostic root identities. Their coverage/classification gaps block qualification. `CURRENT_REGRESSIONS` reports confirmed taxonomy entries only; it does not clear unexplained current failures.','','## Preservation and limitations','']
report += ['- '+x for x in analysis['limitations']]
report += ['',f"Source pins: {len(pin['currentFiles'])} checked, {len(drift)} mismatches. Four historical seals and 64 payloads retain their recorded checks. The initial-file check intentionally remains FAIL for the one previously recorded external routing-policy addition; it is not relabeled as all-files-unchanged.",'','## Single owner decision','', 'Review this whole batch, including evidence gaps and unresolved clusters, before authorizing any repair or further recovery scope. No potential DEFER root is supported by complete equivalent-not-worse and noncritical evidence. Geometry/production-pipeline repairs remain paused. Stage 2+, refreeze, commit, push, deploy and Human Geometry Approval were not performed.','', '```text']
report += [k+'='+('true' if v is True else 'false' if v is False else ','.join(v) if isinstance(v,list) else str(v))for k,v in summary.items()]
report += ['```','']
(C/'stage-1-inherited-audit-report.md').write_text('\n'.join(report))
print(json.dumps(summary,indent=2));print('Denominator reconciled; raw evidence preserved; no product repair.')
