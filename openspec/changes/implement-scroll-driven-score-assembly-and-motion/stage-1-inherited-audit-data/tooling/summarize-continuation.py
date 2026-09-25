"""Read-only, streaming summaries of persisted audit observations."""
import json, pathlib, collections, re
D=pathlib.Path(__file__).resolve().parent.parent
for name in ['access-key.jsonl','access-no-key.jsonl','access-visible.jsonl']:
 p=D/name
 if not p.exists():continue
 counts=collections.Counter(); errors=collections.Counter(); samples={}; limits=collections.Counter(); over=collections.defaultdict(list)
 for line in p.open():
  x=json.loads(line); m=x.get('measurements') or {};o=m.get('overflow') or {}
  counts[(x['source'],x['engine'],x['rawValidatorOutcome'])]+=1
  if o.get('horizontal',0)>0 or o.get('vertical',0)>0:over[(x['source'],x['exactInputs']['profile']['label'])].append((o.get('horizontal',0),o.get('vertical',0)))
  for e in x.get('runtimeErrors',[])+x.get('errors',[]):
   s=e if isinstance(e,str)else e.get('message','');s=re.sub(r'\x1b\[[0-9;]*m','',s)
   key=s.split('\n')[0][:230]; errors[key]+=1;samples.setdefault(key,{'slot':x['slotKey'],'message':s[:600]})
  if x.get('providerLimitation'):limits[x['providerLimitation']]+=1
 print(name,dict(counts));print('errors',[(k,n,samples[k])for k,n in errors.most_common(12)]);print('limits',dict(limits));print('overflow',[(k,len(v),max(x[0]for x in v),max(x[1]for x in v))for k,v in over.items()])
for name in ['lifecycle.jsonl','static.jsonl']:
 p=D/name
 if not p.exists():continue
 stats=collections.Counter();errs=collections.Counter();examples={};keys=collections.Counter()
 for line in p.open():
  x=json.loads(line);keys[x['slotKey']]+=1;stats[(x['engine'],x['source'],x['rawValidatorOutcome'])]+=1
  for s in x['steps']:
   if s.get('outcome')=='ERROR':
    msg=(s.get('error')or{}).get('message',str(s.get('value'))).split('\n')[0];k=(s['name'],msg);errs[k]+=1;examples.setdefault(k,x['slotKey'])
 print(name,'counts',dict(stats),'duplicates',[k for k,v in keys.items()if v>1]);print('step errors',[(k,n,examples[k])for k,n in errs.most_common(20)])
