# AGENTS.md — 单一事实来源（fourpack / 四件套）

> 这是给所有 coding agent（Codex / Claude Code）的操作手册。每次开工先读它。
> 本项目自己**就是用四件套搭的**——它既是要交付的工具，也是这套方法的活样例（dogfood）。

## Startup Workflow（开工前，按顺序）

1. 读本 `AGENTS.md`。
2. 读 `feature_list.json` —— 找当前 active 的那一个 feature（或挑下一个依赖已满足的 `not-started`）。
3. 读 `progress.md` —— 现在到哪了、卡在哪、上一轮留下的话。
4. 读 `roles.md` —— 涉及产品 / 取舍 / 命名 / UX 决策时，按圆桌人设来权衡。
5. 涉及"该不该做 X" 的战略问题时，读 `CONTEXT.md` 对齐黑话和事实。
6. 跑 `bash init.sh` 确认基线是绿的，再动任何东西。（Windows 也用 `bash init.sh`。）

## Scope（边界）

- **一次只做一个 feature**，状态写回 `feature_list.json` 且 `evidence` 字段必须有证据。
- 路过发现的问题记到 `progress.md`，**不顺手改**（除非极其 trivial）。
- 这是一个**文档 + skill 仓库**，不是 web app。没有 Jason / Bill 的明确背书，不要引入后端 / 数据库 / 登录 / 构建管线。形态默认走"最简能跑"（见 `CONTEXT.md` 的"交付形态"决策）。

## Verification（验证）

- `bash init.sh` —— 一键基线检查（四件套文件齐全、非空、关键交叉引用没断）。
- skill 落地后：在一个**真空文件夹**里跑一遍，确认它能生成出可读的四件套并通过 `init.sh`。
- 验证靠"人眼 + 简单清单"，不靠 agent 自己说"完美"。禁止自检放水。

## Definition of Done

一个 feature 算完成，当且仅当：
1. `bash init.sh` 全绿；
2. `feature_list.json` 对应条目 `evidence` 写清：日期 + 做了什么 + 怎么验证的 + gate 结果 + 下一步；
3. `progress.md` 已整体更新到"冷启动也能读懂"。

## End of Session

- 整体重写（不是追加）`progress.md`，让下一轮（你或 AI）冷启动能接上。
- 大功能跨 session 时，更新 `session-handoff.md`。
- 没干完别假装干完——把卡点和下一步写清楚比"看起来完成"重要。

## Loop（maker + checker）

- 自循环执行用 `begin-loop` / `/loop`：一个 **maker** 干活，一个**独立 checker** 挑刺打回。
- 红线：**写的人和验的人必须分开**，否则循环自我放水。
- checker 的发现写到 `.issues/<wave>/found-<时间戳>.md`，分三层（硬契约 / 疑似 / 质感）。

## 关于本项目的元特性

教小白"说人话、别被黑话吓住"的工具，自己的文档也必须说人话。任何产出先过 dogfood 红线（见 `roles.md`）：它有没有遵守它要教的四件套？自相矛盾就打回。
