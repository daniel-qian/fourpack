# session-handoff.md — fourpack（四件套）· 交接

> 2026-06-19 深夜。冷启动接手顺序：本文件 → `progress.md` → `feature_list.json` → `roles.md`。

## 一句话

**feat-001~006 全部 done 并独立验收过，`init.sh` 绿，没有待做 feature。** 唯一悬着的是埋点——方向已定，等 Danny 点头才折进产物。

## 已交付（done，别重做）

- 名字 = `fourpack`；形态 = 粘贴 prompt（中文 `四件套起步清单.md` + 英文 `four-pillars-starter-checklist.md`）+ skill（`.claude/skills/fourpack/SKILL.md`）；app=v2。
- 产物现在生成 **5 个文件**：四件套（AGENTS/CONTEXT/progress/session-handoff）+ 顺带附的 `roles.md`（PM/UI-UX/viewer 三人小圆桌，明写"不是第五件套"，viewer=checker）。
- 产物里教了 **grill→loop/AFK 节奏**：做新功能前先 grill 访谈对齐计划，再进 maker→checker 循环。小白直面文案里 grill/loop/AFK 全用大白话、零裸黑话。
- 英文版 = 中文母版的忠实镜像。英文**不单独 fork skill**（skill 跟用户语言走）。
- `init.sh` 头注 + `CONTEXT.md` 验收线 1 已说清"init.sh 只验本仓库自己"。

## 本 session 拍板（Danny）

- 产出 roles = 3 人；fourpack 自身 dev `roles.md` **不瘦身**（保留 6 人桌）。
- examples/water-tracker 留作证据 + usecase + 视频素材。

## 唯一待办：埋点（等 Danny 点头）

无后端 + 反 SaaS → **skill/prompt 永不偷偷上报**。方案：①分发收口一个 GitHub repo（star/独立访客/clone 当免费 analytics）②清单加一个可计数承接位（UTM 短链 / 公众号关键词）数"领取数"③第二天复用率只靠软信号、不做遥测。**点头后的动作**：中英两版清单各加一行承接位 + 一句"不偷偷上报"信任声明。需 Jason（指标）+ Bill（最简实现）拍。

## 硬规则（先于一切，沿用）

- **dogfood 红线**：产出先自问守没守它要教的四件套；反长教程的工具配长 README = 自爆。
- **说人话**：技术词首次出现就解释；工程过程词（harness/grill/loop/AFK 等）别甩给小白。
- **反过度工程 + 生成物极简**：无后端/数据库/登录/网页（app=v2）；生成物保持最小（roles 只 3 人）。
- **maker ≠ checker**：写的人和验的人必须分开（本 session 全程独立 agent 当 checker）。

## 别做（除非 Danny 点头）

- 别把生成物搞复杂；别给 app 开工；埋点没点头前别往产物里加上报/承接位。

## 临时产物（可清理）

`.check-feat005-tmp/`、`.check-feat006-tmp/` 是真空验收留底，留着当证据；不需要时可删，不影响 `init.sh`。
