import pathlib,json,subprocess
p=pathlib.Path('/tmp/wflyer-systematic-audit-20260913');d=pathlib.Path('/home/davi-benucci/Área de trabalho/WFlyer/openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-inherited-audit-data')
keys=set(json.loads((d/'collector-interruption-gap-plan.json').read_text())['affectedSlots'])
a=[json.loads(x) for x in (d/'access-key.jsonl').read_text().splitlines()]
bad=[x for x in a if x['slotKey'] in keys]
(d/'access-key-interrupted-browser-attempt.jsonl').write_text(''.join(json.dumps(x)+'\n' for x in bad))
(d/'access-key.jsonl').write_text(''.join(json.dumps(x)+'\n' for x in a if x['slotKey'] not in keys))
raise SystemExit(subprocess.call(['node',str(p/'collect.mjs'),'key']))
