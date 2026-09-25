import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REGISTRY_PATH = path.resolve(__dirname, '../docs/canonical-v2/00-governance/ai-model-routing-registry.yaml');

function loadRegistry() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    console.error('ERROR: Registry not found at', REGISTRY_PATH);
    process.exit(1);
  }
  const yamlContent = fs.readFileSync(REGISTRY_PATH, 'utf8');
  // Simple YAML parsing
  const lines = yamlContent.split('\n');
  let currentSection = null;
  const registry = { policy: {}, routing_classes: {}, models: {} };
  let currentKey = null;
  let currentModelKey = null;

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (line.startsWith('policy:')) {
      currentSection = 'policy';
      continue;
    } else if (line.startsWith('routing_classes:')) {
      currentSection = 'routing_classes';
      continue;
    } else if (line.startsWith('models:')) {
      currentSection = 'models';
      continue;
    }

    if (currentSection === 'policy') {
      const match = line.match(/^  (\w+):\s*(.+)$/);
      if (match) {
        registry.policy[match[1]] = match[2];
      }
    } else if (currentSection === 'routing_classes') {
      const matchKey = line.match(/^  (\w+):$/);
      if (matchKey) {
        currentKey = matchKey[1];
        registry.routing_classes[currentKey] = {};
      } else {
        const matchProp = line.match(/^    (\w+):\s*(.*)$/);
        if (matchProp && currentKey) {
          const val = matchProp[2] === 'null' ? null : matchProp[2];
          registry.routing_classes[currentKey][matchProp[1]] = val;
        }
      }
    } else if (currentSection === 'models') {
      const matchKey = line.match(/^  (\w+):$/);
      if (matchKey) {
        currentModelKey = matchKey[1];
        registry.models[currentModelKey] = { eligible_routing_classes: [] };
      } else {
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

function resolveRoute(routingClass) {
  const registry = loadRegistry();
  const rc = registry.routing_classes[routingClass];
  if (!rc) {
    console.error(`ERROR: Unknown routing class: ${routingClass}`);
    process.exit(1);
  }

  if (rc.human_authorization_required === 'true') {
    console.log(`ROUTING_CLASS=${routingClass}`);
    console.log(`MODEL=STOP`);
    console.log(`REASONING=STOP`);
    console.log(`POLICY=${registry.policy.id}`);
    console.log(`POLICY_VERSION=${registry.policy.version}`);
    return;
  }

  const prefModel = rc.preferred_model;
  if (!prefModel || prefModel === 'null') {
    console.error(`ERROR: Missing preferred model for ${routingClass}`);
    process.exit(1);
  }

  const modelInfo = registry.models[prefModel];
  if (!modelInfo) {
    console.error(`ERROR: Preferred model ${prefModel} not found in models catalog`);
    process.exit(1);
  }

  if (modelInfo.lifecycle === 'retired') {
    console.error(`ERROR: Preferred model ${prefModel} is retired`);
    process.exit(1);
  }

  const reasoning = rc.reasoning_profile;
  if (!reasoning || reasoning === 'null') {
    console.error(`ERROR: Missing reasoning profile for ${routingClass}`);
    process.exit(1);
  }

  console.log(`ROUTING_CLASS=${routingClass}`);
  console.log(`MODEL=${modelInfo.display_name}`);
  console.log(`REASONING=${reasoning}`);
  console.log(`POLICY=${registry.policy.id}`);
  console.log(`POLICY_VERSION=${registry.policy.version}`);
}

const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error('Usage: pnpm ai:route <ROUTING_CLASS>');
  process.exit(1);
}

resolveRoute(args[0]);

