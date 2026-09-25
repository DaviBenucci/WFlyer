import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REGISTRY_PATH = path.resolve(__dirname, '../docs/canonical-v2/00-governance/ai-model-routing-registry.yaml');
const ROOT_DIR = path.resolve(__dirname, '..');

let hasErrors = false;

function loadRegistry() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    console.error('ERROR: Registry not found at', REGISTRY_PATH);
    process.exit(1);
  }
  const yamlContent = fs.readFileSync(REGISTRY_PATH, 'utf8');
  const lines = yamlContent.split('\n');
  let currentSection = null;
  const registry = { policy: {}, routing_classes: {}, models: {} };
  let currentKey = null;
  let currentModelKey = null;

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (line.startsWith('policy:')) { currentSection = 'policy'; continue; }
    else if (line.startsWith('routing_classes:')) { currentSection = 'routing_classes'; continue; }
    else if (line.startsWith('models:')) { currentSection = 'models'; continue; }

    if (currentSection === 'policy') {
      const match = line.match(/^  (\w+):\s*(.+)$/);
      if (match) registry.policy[match[1]] = match[2];
    } else if (currentSection === 'routing_classes') {
      const matchKey = line.match(/^  (\w+):$/);
      if (matchKey) { currentKey = matchKey[1]; registry.routing_classes[currentKey] = { fallback_models: [] }; }
      else {
        const matchProp = line.match(/^    (\w+):\s*(.*)$/);
        const matchArray = line.match(/^      -\s*(.*)$/);
        if (matchProp && currentKey) {
          if (matchProp[1] !== 'fallback_models') {
            registry.routing_classes[currentKey][matchProp[1]] = matchProp[2] === 'null' ? null : matchProp[2];
          }
        } else if (matchArray && currentKey) {
          registry.routing_classes[currentKey].fallback_models.push(matchArray[1]);
        }
      }
    } else if (currentSection === 'models') {
      const matchKey = line.match(/^  (\w+):$/);
      if (matchKey) { currentModelKey = matchKey[1]; registry.models[currentModelKey] = { eligible_routing_classes: [] }; }
      else {
        const matchProp = line.match(/^    (\w+):\s*(.*)$/);
        const matchArray = line.match(/^      -\s*(.*)$/);
        if (matchProp && currentModelKey) {
          if (matchProp[1] !== 'eligible_routing_classes') {
            registry.models[currentModelKey][matchProp[1]] = matchProp[2];
          }
        } else if (matchArray && currentModelKey) {
          registry.models[currentModelKey].eligible_routing_classes.push(matchArray[1]);
        }
      }
    }
  }
  return registry;
}

function validateRegistry(registry) {
  console.log('Validating registry integrity...');
  if (!registry.policy.id || !registry.policy.version) {
    console.error('  [FAIL] Missing policy ID or version');
    hasErrors = true;
  }
  for (const [cls, props] of Object.entries(registry.routing_classes)) {
    if (props.human_authorization_required === 'true') {
      if (props.preferred_model !== null || props.reasoning_profile !== null) {
        console.error(`  [FAIL] Class ${cls} is HUMAN_DECISION but has executable model/reasoning`);
        hasErrors = true;
      }
    } else {
      const pref = props.preferred_model;
      if (!pref) {
        console.error(`  [FAIL] Class ${cls} missing preferred model`);
        hasErrors = true;
      } else if (!registry.models[pref]) {
        console.error(`  [FAIL] Class ${cls} references unknown model ${pref}`);
        hasErrors = true;
      } else if (registry.models[pref].lifecycle === 'retired') {
        console.error(`  [FAIL] Class ${cls} references retired preferred model ${pref}`);
        hasErrors = true;
      }
      for (const fallback of props.fallback_models) {
        if (!registry.models[fallback]) {
          console.error(`  [FAIL] Class ${cls} references unknown fallback model ${fallback}`);
          hasErrors = true;
        }
      }
    }
  }
  console.log('  Registry validation complete.');
}

function getFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.resolve(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (['node_modules', '.git', '.next', 'graphify-out'].includes(file)) continue;
      getFiles(fullPath, files);
    } else if (file.endsWith('.md') || file.endsWith('.txt')) {
      files.push(fullPath);
    }
  }
  return files;
}

function isNormativeDoc(filePath) {
  const normPaths = [
    'AGENTS.md',
    'AI_MODEL_ROUTING_POLICY',
    'CURRENT_HANDOFF',
    'CURRENT_AGENT_HANDOFF',
    'WFLYER_IMPLEMENTATION_PLAN.md'
  ];
  const relPath = path.relative(ROOT_DIR, filePath);
  if (relPath.includes('archive/') || relPath.includes('stage-1-hga') || relPath.includes('stage-1-projects') || relPath.includes('stage-1-inherited-audit')) return false; // historical execution evidence
  return normPaths.some(p => relPath.includes(p));
}

function isThirdPartyDoc(filePath) {
  return filePath.toLowerCase().includes('graphify') || filePath.toLowerCase().includes('openspec');
}

function validateDocs() {
  console.log('Validating documentation integrity...');
  const files = getFiles(ROOT_DIR);
  const regex = /\b(GPT-[456]|Gemini|Astra|Luna|Sol)\b/i;
  
  for (const file of files) {
    const relPath = path.relative(ROOT_DIR, file);
    if (!isNormativeDoc(file)) continue; // Only check active normative surfaces outside registry
    if (relPath === 'docs/canonical-v2/00-governance/ai-model-routing-registry.yaml') continue;
    
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      // Historical references exception logic
      if (line.match(/historical actual executor/i) || line.match(/PREVIOUS_EXECUTOR_MODEL/i)) return;
      if (line.match(/astra-vp004/i)) return;
      
      if (regex.test(line)) {
        console.error(`  [FAIL] Hardcoded model in normative doc ${relPath}:${i+1}: ${line.trim()}`);
        hasErrors = true;
      }
    });
  }
  console.log('  Documentation validation complete.');
}

function validateHandoffs() {
  console.log('Validating handoff integrity...');
  const handoffPaths = [
    'docs/.ai/CURRENT_AGENT_HANDOFF.md',
    'docs/canonical-v2/06-migration/CURRENT_HANDOFF.md'
  ];
  for (const p of handoffPaths) {
    const fullPath = path.resolve(ROOT_DIR, p);
    if (!fs.existsSync(fullPath)) continue;
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.match(/NEXT_MODEL=/i) || content.match(/next_model_class:/i) || content.match(/NEXT_REASONING=/i) || content.match(/MODEL_CHANGE_REQUIRED=/i)) {
      console.error(`  [FAIL] Handoff ${p} uses concrete model next-executor authority instead of routing class.`);
      hasErrors = true;
    }
    if (!content.match(/NEXT_ROUTING_CLASS=/i) && !content.match(/next_routing_class:/i) && !content.match(/next_action:/i)) {
      // Wait, CURRENT_HANDOFF.md has next_action. Let's ensure CURRENT_AGENT_HANDOFF has next_routing_class
      if (p.includes('CURRENT_AGENT_HANDOFF')) {
        console.error(`  [FAIL] Handoff ${p} is missing NEXT_ROUTING_CLASS or next_routing_class.`);
        hasErrors = true;
      }
    }
  }
  console.log('  Handoff validation complete.');
}

const registry = loadRegistry();
validateRegistry(registry);
validateDocs();
validateHandoffs();

if (hasErrors) {
  console.error('\nValidation FAILED.');
  process.exit(1);
} else {
  console.log('\nValidation PASSED.');
  process.exit(0);
}
