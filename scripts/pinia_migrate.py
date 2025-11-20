#!/usr/bin/env python3

"""
pinia_migrate.py — codemod to migrate Vuex usage to Pinia (layout store) safely.

- Comments out old Vuex import and `const store = useStore()` lines.
- Inserts Pinia import `useLayoutStore` and `const layoutStore = useLayoutStore()`.
- Rewrites `store.getters.X` -> `layoutStore.X` (entire line commented first).
- Rewrites `store.state.X` -> `layoutStore.X` (entire line commented first).
- Rewrites `store.dispatch("updateX", value)` -> `layoutStore.updateX(value)` (entire line commented first).
- Skips vendor folders like node_modules and src/assets/libs.
- Creates .bak backups next to changed files.
- Dry-run by default; pass `--apply` to write changes.

Usage:
  python3 scripts/pinia_migrate.py --root /path/to/project/Admin/src --apply
"""
import os, re, argparse, io, sys

IMPORT_REGEX = re.compile(r'^\s*import\s*\{\s*useStore\s*\}\s*from\s*[\'"]vuex[\'"]\s*;?\s*$')
CONST_STORE_REGEX = re.compile(r'^\s*const\s+store\s*=\s*useStore\s*\(\s*\)\s*;?\s*$')
DISPATCH_REGEX = re.compile(r'store\.dispatch\(\s*[\'"]([A-Za-z0-9_]+)[\'"]\s*(?:,\s*([^)]+))?\)')
GETTERS_REGEX = re.compile(r'store\.getters\.([A-Za-z0-9_]+)')
STATE_REGEX = re.compile(r'store\.state\.([A-Za-z0-9_]+)')

PINIA_IMPORT = "import { useLayoutStore } from '@/stores/layout'"
PINIA_CONST = "const layoutStore = useLayoutStore()"

def process_file(path, apply=False):
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()

    changed = False
    new_lines = []
    for line in lines:
        # 1) Replace Vuex import line
        if IMPORT_REGEX.match(line):
            new_lines.append("// " + line.rstrip() + "\n")
            new_lines.append(PINIA_IMPORT + "\n")
            changed = True
            continue

        # 2) Replace const store = useStore();
        if CONST_STORE_REGEX.match(line):
            new_lines.append("// " + line.rstrip() + "\n")
            new_lines.append(PINIA_CONST + "\n")
            changed = True
            continue

        # 3) Replace inline usage of getters/state/dispatch. Comment old full line, then write replaced line.
        replaced = line
        dispatch_matches = list(DISPATCH_REGEX.finditer(line))
        getters_matches = list(GETTERS_REGEX.finditer(line))
        state_matches = list(STATE_REGEX.finditer(line))

        if dispatch_matches or getters_matches or state_matches:
            # Comment old line
            new_lines.append("// " + line.rstrip() + "\n")

            # Perform replacements on a copy
            def dispatch_repl(m):
                action = m.group(1)
                args = m.group(2).strip() if m.group(2) else ""
                return f"layoutStore.{action}({args})"

            replaced = DISPATCH_REGEX.sub(dispatch_repl, replaced)
            replaced = GETTERS_REGEX.sub(r'layoutStore.\1', replaced)
            replaced = STATE_REGEX.sub(r'layoutStore.\1', replaced)
            # Ensure we don't duplicate comments
            if not replaced.strip().startswith("//"):
                new_lines.append(replaced)
            else:
                new_lines.append(replaced + ("\n" if not replaced.endswith("\n") else ""))
            changed = True
            continue

        # default: keep line as-is
        new_lines.append(line)

    if changed and apply:
        backup = path + ".bak"
        with open(backup, 'w', encoding='utf-8') as bf:
            bf.writelines(lines)
        with open(path, 'w', encoding='utf-8') as wf:
            wf.writelines(new_lines)

    return changed

def should_skip(path):
    lowered = path.replace("\\", "/").lower()
    skip_dirs = ["node_modules/", "src/assets/libs/", "dist/", "build/", ".git/"]
    return any(s in lowered for s in skip_dirs)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", required=True, help="Path to the project src root (e.g., Admin/src)")
    ap.add_argument("--apply", action="store_true", help="Apply changes (otherwise dry-run)")
    args = ap.parse_args()

    changed_files = []
    for dirpath, dirnames, filenames in os.walk(args.root):
        if should_skip(dirpath + "/"):
            continue
        for fn in filenames:
            if not fn.endswith((".ts", ".js", ".vue")):
                continue
            path = os.path.join(dirpath, fn)
            try:
                if process_file(path, apply=args.apply):
                    changed_files.append(path)
            except Exception as e:
                print(f"[ERROR] {path}: {e}", file=sys.stderr)

    if changed_files:
        print(("Would change" if not args.apply else "Changed") + f" {len(changed_files)} files:")
        for p in changed_files:
            print(" - " + p)
    else:
        print("No changes needed.")

if __name__ == "__main__":
    main()
