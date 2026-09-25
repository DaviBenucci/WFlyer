import pathlib,json,collections,hashlib
p=pathlib.Path('/home/davi-benucci/Área de trabalho/WFlyer/openspec/changes/implement-scroll-driven-score-assembly-and-motion/stage-1-inherited-audit-data')
raw=[]
for name in ['access-key.jsonl','access-no-key.jsonl','access-visible.jsonl']:
 f=p/name
 if f.exists():
  for r in map(json.loads,f.read_text().splitlines()):r['_rawFile']=name;raw.append(r)
pairs={}
for r in raw:pairs.setdefault(r['comparisonKey'],{})[r['source']]=r
output=[]
def selected(m):
 root=m.get('root') or {}; branch=m.get('branch') or {};layer=m.get('layer')or{}
 return root.get('data-projection-mode') or layer.get('data-score-projection')or root.get('data-review-frame-mode')or 'explicit-review'
def metrics(m):
 return {'actualMode':selected(m),'formState':m.get('formState'),'overflow':m.get('overflow'),'formHeight':((m.get('form')or{}).get('rect')or{}).get('height'),'verificationHeight':((m.get('verification')or{}).get('rect')or{}).get('height'),'statusText':m.get('statusText'),'inkClearance':(m.get('ink')or{}).get('minimumClearance'),'reservationStyle':m.get('reservationStyle'),'readiness':m.get('readiness')}
for key,pair in pairs.items():
 h=pair.get('historical');c=pair.get('current');item={'comparisonKey':key,'current':c and c['slotKey'],'historical':h and h['slotKey']}
 if not h or not c:item['equivalenceStatus']='MISSING_PAIR';output.append(item);continue
 hm=h.get('measurements') or {};cm=c.get('measurements')or{}; reasons=[]
 if h['exactInputs']!=c['exactInputs']:reasons.append('DECLARED_INPUT_DIFFERENCE')
 if selected(hm)!=selected(cm):reasons.append('DIFFERENT_ACTUAL_MODES')
 if not hm or not cm:reasons.append('MISSING_MEASUREMENTS')
 if hm.get('formState')!=cm.get('formState'):reasons.append('DIFFERENT_ACTUAL_FORM_STATES')
 if hm.get('viewport')!=cm.get('viewport'):reasons.append('DIFFERENT_OBSERVED_VIEWPORT_DPR')
 if hm.get('theme')!=cm.get('theme'):reasons.append('DIFFERENT_OBSERVED_THEME')
 expected=h['exactInputs']['state']['uiState']
 if h['exactInputs']['state']['label']!='VALIDATING' and (hm.get('formState')!=expected or cm.get('formState')!=expected):reasons.append('REQUESTED_STATE_NOT_ESTABLISHED')
 def fingerprint(m):
  b=m.get('branch')or{}
  return b.get('data-score-semantic-fingerprint')or b.get('data-review-semantic-fingerprint')
 item['observedInputProof']={'historicalViewport':hm.get('viewport'),'currentViewport':cm.get('viewport'),'historicalTheme':hm.get('theme'),'currentTheme':cm.get('theme'),'historicalBranchFingerprint':fingerprint(hm),'currentBranchFingerprint':fingerprint(cm),'requiredState':expected}
 if not fingerprint(hm) or not fingerprint(cm):reasons.append('BRANCH_SEMANTIC_FINGERPRINT_NOT_OBSERVED')
 elif fingerprint(hm)!=fingerprint(cm):reasons.append('DIFFERENT_OBSERVED_COMPOSITION_FINGERPRINT')
 if h.get('providerLimitation')or c.get('providerLimitation'):reasons.append('PROVIDER_QUALIFICATION_LIMIT')
 def product_faces(m):return [f for f in (m.get('readiness')or{}).get('faces',[]) if not f['family'].startswith('__nextjs-')]
 def loaded_product(m):return all(any(f['family']==family and f['status']=='loaded' for f in product_faces(m)) for family in ['manrope','cormorantGaramond'])
 if not loaded_product(hm)or not loaded_product(cm):reasons.append('PRODUCT_FONT_READINESS_NOT_PROVEN')
 if h.get('sourceObligation')or c.get('sourceObligation'):reasons.append('TRANSIENT_SOURCE_OBLIGATION_NO_LIVE_FRAME')
 hf=(hm.get('readiness')or{}).get('faces');cf=(cm.get('readiness')or{}).get('faces')
 def primary_faces(m):return [f for f in product_faces(m) if f['family']in ['manrope','cormorantGaramond']]
 if primary_faces(hm)!=primary_faces(cm):reasons.append('PRIMARY_PRODUCT_FONT_FACE_STATE_DIFFERENCE')
 item['fontEquivalenceProof']={'productFacesHistorical':product_faces(hm),'productFacesCurrent':product_faces(cm),'primaryFacesLoaded':loaded_product(hm)and loaded_product(cm),'sameAssetBytes':'execution-metadata.json fontHashes/historicalFontHashes','devtoolsFaceStateDiffers':hf!=cf,'excludedFamilies':'__nextjs-* are development UI fonts. Local Fallback-face unloaded/error cache state is auxiliary when the preceding actual Manrope/Cormorant face is loaded in both sources; source asset hashes and computed font-family order are checked. Primary-face differences remain unqualified. Every original all-face/readiness value is retained','computedFormFamilyHistorical':((hm.get('form')or{}).get('style')or{}).get('fontFamily'),'computedFormFamilyCurrent':((cm.get('form')or{}).get('style')or{}).get('fontFamily')}
 if item['fontEquivalenceProof']['computedFormFamilyHistorical']!=item['fontEquivalenceProof']['computedFormFamilyCurrent']:reasons.append('DIFFERENT_COMPUTED_PRODUCT_FONT')
 item.update({'equivalenceStatus':'EQUIVALENT_DECLARED_AND_OBSERVED_INPUTS' if not reasons else 'NOT_QUALIFIED','equivalenceLimitations':reasons,'historicalMetrics':metrics(hm),'currentMetrics':metrics(cm),'sameBoxMetrics':metrics(hm)==metrics(cm),'delta':{k:((cm.get('overflow')or{}).get(k,0)-(hm.get('overflow')or{}).get(k,0)) for k in ['horizontal','vertical']},'rawOutcomes':{'historical':h['rawValidatorOutcome'],'current':c['rawValidatorOutcome']},'evidence':[h['_rawFile'],c['_rawFile']]});output.append(item)
(p/'access-paired-comparisons.json').write_text(json.dumps({'status':'MECHANICAL_COMPARISON_NO_ROOT_CLASSIFICATION','rawCount':len(raw),'pairs':output},indent=2));print('Access raw',len(raw),'pair keys',len(pairs),'equivalence',dict(collections.Counter(x['equivalenceStatus']for x in output)))
