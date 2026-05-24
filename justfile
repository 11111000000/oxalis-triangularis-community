set shell := ["bash", "-eu", "-o", "pipefail", "-c"]

default:
  just help

help:
  @just --list

status:
  git status --short --branch

check:
  npm run check
  node -e "const p=[String.fromCharCode(84,97,111),String.fromCharCode(116,97,111),String.fromCharCode(1044,1072,1086),String.fromCharCode(1076,1072,1086)].join('|'); const {spawnSync}=require('node:child_process'); const r=spawnSync('grep',['-RInE',p,'--exclude-dir=.git','.'],{stdio:'inherit'}); process.exit(r.status ?? 0);"
  git diff --check

serve:
  npm run serve

format:
  nixfmt flake.nix

shell:
  @echo "Run: direnv allow && nix develop"

dev:
  @echo "Use: direnv allow; just shell; just serve"
