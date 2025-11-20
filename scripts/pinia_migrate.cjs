
// pinia_migrate.cjs
// Usage:
//   node .\scripts\pinia_migrate.cjs --root .\src         # dry run
//   node .\scripts\pinia_migrate.cjs --root .\src --apply  # write changes
//
// What it does (safe):
// - Comments lines: `import { useStore } from 'vuex'`  → adds `import { useLayoutStore } ...` below
// - Comments lines: `const store = useStore()`        → adds `const layoutStore = useLayoutStore()` below
// - For any line containing store.getters / store.state / store.dispatch:
//     - comments the entire original line
//     - appends a new line with replacements:
//         store.getters.X            → layoutStore.X
//         store.state.X              → layoutStore.X
//         store.dispatch('act', a)   → layoutStore.act(a)
// - Writes .bak backups next to modified files
//
// It won't modify node_modules, dist, build, .git.
// It only touches .ts, .js, .tsx, .vue files.
const fs = require('node:fs');
const path = require('node:path');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { root: 'src', apply: false };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--apply') out.apply = true;
    else if (a === '--root' && i + 1 < args.length) out.root = args[++i];
  }
  return out;
}

const IMPORT_VUEX = /^\s*import\s*\{\s*useStore\s*\}\s*from\s*['"]vuex['"]\s*;?\s*$/;
const CONST_STORE = /^\s*const\s+store\s*=\s*useStore\s*\(\s*\)\s*;?\s*$/;
const DISPATCH = /store\.dispatch\(\s*['"]([A-Za-z0-9_]+)['"]\s*(?:,\s*([^)]+))?\)/g;
const GETTERS = /store\.getters\.([A-Za-z0-9_]+)/g;
const STATE   = /store\.state\.([A-Za-z0-9_]+)/g;

function shouldSkipDir(p) {
  const low = p.replace(/\\/g,'/').toLowerCase();
  return low.includes('/node_modules/') || low.includes('/dist/') || low.includes('/build/') || low.includes('/.git/');
}

function listFiles(root) {
  const results = [];
  function walk(dir) {
    if (shouldSkipDir(dir + '/')) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(ts|js|tsx|vue)$/.test(e.name)) results.push(p);
    }
  }
  walk(root);
  return results;
}

function hasLayoutImport(lines) {
  return lines.some(l => l.includes("from '@/stores/layout'") || l.includes('from "@/stores/layout"'));
}

function ensureNewline(s) { return s.endsWith('\n') ? s : s + '\n'; }

function transformFile(p, apply) {
  const buf = fs.readFileSync(p, 'utf8');
  const eol = buf.includes('\r\n') ? '\r\n' : '\n';
  const lines = buf.split(/\r?\n/);

  const out = [];
  let changed = false;
  let addedImport = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // import { useStore } from 'vuex'
    if (IMPORT_VUEX.test(line)) {
      out.push('// ' + line);
      if (!hasLayoutImport(lines) && !addedImport) {
        out.push("import { useLayoutStore } from '@/stores/layout'");
        addedImport = true;
      }
      changed = true;
      continue;
    }

    // const store = useStore()
    if (CONST_STORE.test(line)) {
      out.push('// ' + line);
      out.push('const layoutStore = useLayoutStore()');
      changed = true;
      continue;
    }

    // lines containing store.getters / store.state / store.dispatch
    if (line.includes('store.')) {
      let replaced = line;
      let touched = false;

      replaced = replaced.replace(DISPATCH, (_m, act, args) => {
        touched = true;
        const a = (args || '').trim();
        return `layoutStore.${act}(${a})`;
      });
      replaced = replaced.replace(GETTERS, (_m, key) => { touched = true; return `layoutStore.${key}`; });
      replaced = replaced.replace(STATE,   (_m, key) => { touched = true; return `layoutStore.${key}`; });

      if (touched) {
        out.push('// ' + line);
        out.push(replaced);
        changed = true;
        continue;
      }
    }

    out.push(line);
  }

  if (changed && apply) {
    fs.writeFileSync(p + '.bak', buf, 'utf8');
    fs.writeFileSync(p, out.join(eol) + eol, 'utf8');
  }
  return changed;
}

function main() {
  const { root, apply } = parseArgs();
  if (!fs.existsSync(root)) {
    console.error(`[ERROR] Root not found: ${root}`);
    process.exit(1);
  }
  const files = listFiles(root);
  const changed = [];
  for (const f of files) {
    try {
      if (transformFile(f, apply)) changed.push(f);
    } catch (e) {
      console.error('[ERROR]', f, e.message);
    }
  }
  console.log((apply ? 'Changed' : 'Would change'), changed.length, 'files');
  for (const f of changed) console.log(' -', f);
}

if (require.main === module) main();
