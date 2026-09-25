import pathlib,json,collections,datetime
r=pathlib.Path('/home/davi-benucci/Área de trabalho/WFlyer');d=r/'openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-inherited-audit-data';m=json.load(open(d.parent/'stage-1-inherited-audit-manifest.json'))
def rows(name):
 p=d/name
 if not p.exists():return []
 return [json.loads(l) for l in p.read_text().splitlines() if l]
slots=[]
for c in m['primary']['cases']:
 for source in ['current','historical']:slots.append({'slotKey':f"primary/{c['engine']}/{c['file']}/{c['title']}/{source}",'group':'primary','source':source,'engine':c['engine'],'file':c['file'],'title':c['title']})
for engine in m['controls']['engines']:
 for source in ['current','historical']:
  for theme in m['controls']['themes']:
   for p in m['accessEnvelope']['profiles']:
    for s in m['accessEnvelope']['states']:slots.append({'slotKey':f"access/{source}/{engine}/{theme}/{p['label']}/{s['label']}",'group':'access','source':source})
   for p in m['lifecycle']['profiles']:slots.append({'slotKey':f"lifecycle/{source}/{engine}/{theme}/{p['label']}",'group':'lifecycle','source':source})
  for p in m['staticAccessibility']['profiles']:slots.append({'slotKey':f"static/{source}/{engine}/{p['label']}",'group':'static','source':source})
guards=json.load(open(d/'guard-list.json'))
for g in guards:slots.append({'slotKey':'guard/current/'+str(pathlib.Path(g['file']).relative_to(r))+'/'+g['name'].replace(' > ',' '),'group':'guard','source':'current'})
seen={}
for source in ['current','historical']:
 for row in rows(f'primary-{source}.jsonl'):
  title=row['title'];name=' / '.join(title[3:]);file='tests/e2e/'+title[2];key=f'primary/{title[1]}/{file}/{name}/{source}';seen[key]={'status':row['status'],'evidence':f'primary-{source}.jsonl','id':row['id']}
for name in ['access-key.jsonl','access-no-key.jsonl','access-visible.jsonl','lifecycle.jsonl','static.jsonl']:
 for row in rows(name):seen[row['slotKey']]={'status':row['rawValidatorOutcome'],'evidence':name,'errors':len(row.get('errors',[]))}
g=json.load(open(d/'guards-current.json'))
for f in g['testResults']:
 for a in f['assertionResults']:
  key='guard/current/'+str(pathlib.Path(f['name']).relative_to(r))+'/'+a['fullName'];seen[key]={'status':a['status'],'evidence':'guards-current.json'}
mapping=d/'shared-historical-obligations.json'
if mapping.exists():
 for item in json.loads(mapping.read_text())['obligations']:
  if not item['missingEvidence']:seen[item['slotKey']]={'status':item['rawValidatorOutcome'],'evidence':'shared-historical-obligations.json','limitations':item['historicalLimits'],'acceptancePassClaim':False}
for s in slots:s.update(seen.get(s['slotKey'],{'status':'PENDING','evidence':None}))
unknown=[x for x in seen if x not in {s['slotKey'] for s in slots}]
result={'status':'IN_PROGRESS_NOT_AUDIT_COMPLETION','updatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'manifestObservations':len(slots),'countDefinition':'300 primary current/historical + 3240 Access + 48 lifecycle + 24 static + 80 expanded current guard cases. 34 historical guard tests are lineage evidence supporting guard obligations, not added audit surface.','terminalRecords':sum(s['status']!='PENDING' for s in slots),'pending':sum(s['status']=='PENDING' for s in slots),'groups':dict(collections.Counter(s['group'] for s in slots)),'unmappedRawRecords':unknown,'observations':slots}
(d/'coverage-progress.json').write_text(json.dumps(result,indent=2));print({k:v for k,v in result.items() if k not in ['observations','unmappedRawRecords']},'unmapped',len(unknown))
