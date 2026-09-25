import { chromium } from '/home/davi-benucci/Área de trabalho/WFlyer/node_modules/@playwright/test/index.mjs';
import {writeFile} from 'node:fs/promises';
const [base,out,network='live',matrix='one']=process.argv.slice(2);
const browser=await chromium.launch({headless:true});
const cases=matrix==='one'?[['organic-soft','vertical-wide','light',1340,820]]:[['organic-soft','vertical-wide','light',1340,820],['organic-soft','vertical-compact','light',430,844],['organic-flowing','vertical-wide','light',1340,820],['organic-flowing','vertical-compact','light',430,844]];
const results=[];
for(const [candidate,mode,theme,width,height] of cases){
 const context=await browser.newContext({viewport:{width,height},locale:'pt-BR',colorScheme:'light',reducedMotion:'no-preference'});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 if(network==='blocked')await page.route('https://challenges.cloudflare.com/**',r=>r.abort());
 const response=await page.goto(`${base}/__visual-lab/story/score-paths/preview?candidate=${candidate}&mode=${mode}&theme=${theme}`,{waitUntil:'domcontentloaded'});
 await page.locator('main[data-phase-9-task-33-review]').waitFor();
 await page.evaluate(()=>document.fonts.ready);
 const sample=()=>page.evaluate(()=>{
  const rect=e=>e?.getBoundingClientRect().toJSON();
  const fields=['display','position','height','width','minHeight','boxSizing','paddingTop','paddingBottom','borderTopWidth','borderBottomWidth','rowGap','gridTemplateColumns','gridTemplateRows','fontFamily','fontSize','lineHeight','overflowX','overflowY','transform'];
  const describe=e=>e?{tag:e.tagName,class:e.className,rect:rect(e),clientHeight:e.clientHeight,scrollHeight:e.scrollHeight,clientWidth:e.clientWidth,scrollWidth:e.scrollWidth,style:Object.fromEntries(fields.map(k=>[k,getComputedStyle(e)[k]])),text:e.children.length?undefined:e.textContent}:null;
  const envelope=document.querySelector('[data-review-content-envelope="application-access"]');
  const chapter=envelope.closest('[data-review-chapter-id]'),scene=envelope.querySelector('[data-application-scene]'),form=envelope.querySelector('form');
  return {viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},rootAttributes:Object.fromEntries([...document.querySelector('main[data-phase-9-task-33-review]').attributes].map(a=>[a.name,a.value])),fonts:{status:document.fonts.status,faces:[...document.fonts].map(f=>({family:f.family,status:f.status,weight:f.weight}))},readyState:document.readyState,branch:envelope.closest('[data-review-branch]')?.getAttribute('data-review-branch'),chapter:describe(chapter),reservationVariables:chapter.getAttribute('style'),envelope:describe(envelope),scene:describe(scene),form:describe(form),formState:form?.getAttribute('data-app-launch-interest-state'),formChildren:[...form.querySelectorAll('fieldset,legend,label,button,p,[data-app-launch-turnstile]')].map(describe),verification:describe(form.querySelector('[data-app-launch-turnstile]')?.parentElement),sceneChildren:[...scene.children].map(describe),ancestors:[...function*(e){while(e){yield e;e=e.parentElement}}(chapter.parentElement)].map(describe),overflow:{vertical:envelope.scrollHeight-envelope.clientHeight,horizontal:envelope.scrollWidth-envelope.clientWidth},tokens:{control:getComputedStyle(form).getPropertyValue('--wf-control-min-size'),gap:getComputedStyle(form).getPropertyValue('--wf-space-3')},stage1Owners:{motion:document.querySelectorAll('[data-story-motion-lab]').length,capacity:document.querySelectorAll('[data-projects-capacity-candidate]').length},scripts:[...document.scripts].filter(s=>s.src.includes('cloudflare')).map(s=>s.src)};
 });
 const immediate=await sample();await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));const framed=await sample();
 await page.waitForTimeout(1200);const settled=await sample();
 results.push({candidate,mode,theme,status:response.status(),network,immediate,framed,settled,errors});
 console.log(JSON.stringify({candidate,mode,network,overflow:immediate.overflow,settled:settled.overflow,state:settled.formState,formHeight:settled.form.rect.height,verification:settled.verification?.rect.height,reservation:settled.reservationVariables}));
 await context.close();
}
await browser.close();await writeFile(out,JSON.stringify({browser:browser.version(),base,results},null,2)+'\n');
