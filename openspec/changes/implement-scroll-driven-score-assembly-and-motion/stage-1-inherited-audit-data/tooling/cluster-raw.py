import pathlib,json,collections,re
p=pathlib.Path('/home/davi-benucci/Área de trabalho/WFlyer/openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-inherited-audit-data');clusters={}
for source in ['current','historical']:
 f=p/f'primary-{source}.jsonl'
 if not f.exists():continue
 for r in map(json.loads,f.read_text().splitlines()):
  for e in r['errors']:
   message=re.sub(r'\x1b\[[0-9;]*m','',e.get('message',''))
   loc=e.get('location',{});signature=str(loc.get('file','')).replace('/tmp/wflyer-systematic-audit-20260913/'+source+'/','')+':'+str(loc.get('line',''))+':'+message.split('\n')[0]
   c=clusters.setdefault(signature,{'signature':signature,'kind':'MECHANICAL_ASSERTION_CLUSTER_NOT_ROOT_CLASSIFICATION','occurrences':[],'representative':{'message':message,'location':loc}});c['occurrences'].append({'source':source,'engine':r['title'][1],'caseId':r['id'],'title':r['title'][-1]})
(p/'mechanical-primary-clusters.json').write_text(json.dumps({'status':'PROVISIONAL_MECHANICAL_NO_CAUSAL_CLASSIFICATION','clusters':list(clusters.values())},indent=2));print('assertion signatures',len(clusters),'occurrences',sum(len(x['occurrences']) for x in clusters.values()))
