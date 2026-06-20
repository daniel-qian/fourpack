#!/usr/bin/env bash
# init.sh — 一键基线检查（只验 fourpack 本仓库自己没被改坏）
# 注意：这是给 fourpack 这个工具的开发者用的，验的是本仓库独有的文件
#       （清单 / SKILL.md / CLAUDE.md 等）。它【不是】给小白产出物用的——
#       小白照粘贴版清单产出的是 5 个文件，别拿这个脚本去他的文件夹跑，会一片 FAIL。
# Windows 也用：bash init.sh
set -u

fail=0

# 1) 四件套核心文件必须存在且非空
required=(
  "AGENTS.md"
  "CLAUDE.md"
  "CONTEXT.md"
  "progress.md"
  "session-handoff.md"
  "feature_list.json"
  "roles.md"
  "四件套起步清单.md"
  ".claude/skills/fourpack/SKILL.md"
  ".claude/skills/fourpack-loop/SKILL.md"
)
for f in "${required[@]}"; do
  if [ ! -s "$f" ]; then
    echo "FAIL  缺文件或为空: $f"
    fail=1
  else
    echo "ok    $f"
  fi
done

# 2) feature_list.json 必须是合法 JSON（有 node 就校验，没有就跳过）
if command -v node >/dev/null 2>&1; then
  if node -e "JSON.parse(require('fs').readFileSync('feature_list.json','utf8'))" 2>/dev/null; then
    echo "ok    feature_list.json 是合法 JSON"
  else
    echo "FAIL  feature_list.json 不是合法 JSON"
    fail=1
  fi
fi

# 3) CLAUDE.md 必须把 AGENTS.md 作为单一事实来源 import 进来
if grep -q "@AGENTS.md" CLAUDE.md; then
  echo "ok    CLAUDE.md 已 import AGENTS.md"
else
  echo "FAIL  CLAUDE.md 没有 @AGENTS.md（单一事实来源断了）"
  fail=1
fi

echo "---"
if [ "$fail" -eq 0 ]; then
  echo "PASS  基线全绿。"
else
  echo "RED   有失败项，先修上面 FAIL 再动别的。"
fi
exit "$fail"
