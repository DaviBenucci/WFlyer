import pathlib,json
r=pathlib.Path('/home/davi-benucci/Área de trabalho/WFlyer');d=r/'openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-inherited-audit-data';m=json.load(open(d.parent/'stage-1-inherited-audit-manifest.json'))
def rows(f):
 p=d/f
 return [json.loads(x) for x in p.read_text().splitlines()] if p.exists() else []
runtime=rows('shared-runtime.jsonl');pure=rows('shared-pure.jsonl');out=[]
for c in m['primary']['cases']:
 if '/assembly-stage1-' not in c['file']:continue
 key=f"primary/{c['engine']}/{c['file']}/{c['title']}/historical"
 selected=[];kind='shared-runtime';limits=[]
 if c['file'].endswith('hydration.spec.ts') and 'identical to Node' in c['title']:
  selected=[x for x in pure if x['source']=='historical' and x['engine']==c['engine']];kind='shared-pure'
  limits=['Historical source rendered with current toolchain. New event-safe metadata absent in historical source is not a failed historical contract. Actual complete-model/SVG equality is recorded per mode, never copied from source literal true flags.']
 else:
  profiles=m['accessEnvelope']['profiles'];label=None
  if c['file'].endswith('geometry.spec.ts'):
   for p in profiles:
    if p['route'].endswith('/motion') and f"{p['viewport']['width']}x{p['viewport']['height']} {p['requestedMode']}" in c['title']:label=p['label'];break
  elif '1100x640' in c['title']:label='integrated-capacity-selected-1100x640'
  elif 'complete Projects candidate' in c['title']:
   label='integrated-capacity-selected-'+c['title'].split()[-1]
  elif c['file'].endswith('capacity.spec.ts'):label='integrated-capacity-selected-1536x900'
  else:label='integrated-capacity-selected-1440x900'
  selected=[x for x in runtime if x['source']=='historical' and x['engine']==c['engine'] and x['profile']['label']==label]
  limits=['Shared historical DOM, explicit same-input constructors and existing focus/rebuild behavior only. Historical source has no successor candidate probe/read-order/generation or Home/event-safe acceptance telemetry; absence is not manufactured historical FAIL.']
  if c['file'].endswith('hydration.spec.ts'):limits.append('SSR metadata and actual runtime errors/settled projection are collected. A settled DOM snapshot is not proof of exact first-client serialization; that historical sub-observation remains unqualified unless separately demonstrated.')
 out.append({'slotKey':key,'case':c,'rawValidatorOutcome':'NOT_OBSERVED' if not selected else 'ERROR' if any(x.get('outcome')=='ERROR' for x in selected) else 'OBSERVED_SHARED_CONTRACT','evidence':kind+'.jsonl','recordSelectors':[{'source':x['source'],'engine':x['engine'],'profile':x.get('profile',{}).get('label'),'mode':x.get('mode')} for x in selected],'historicalLimits':limits,'qualifiedAsAcceptancePass':False,'missingEvidence':not bool(selected)})
(d/'shared-historical-obligations.json').write_text(json.dumps({'status':'OBSERVABLE_MAPPING_NOT_HISTORICAL_AGGREGATE_PASS','obligations':out},indent=2))
print('historical shared obligations',len(out),'missing',sum(x['missingEvidence'] for x in out))
