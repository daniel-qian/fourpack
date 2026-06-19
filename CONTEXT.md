# CONTEXT.md — 黑话与事实（四件套起步器）

> 不是操作手册（那是 `AGENTS.md`）。这里只放**词汇表、事实、已定方向、待定决策**。

## 这个项目是什么

把 Danny 每次开新项目都做的「agent-engineering 起步仪式」，对**小白一步到位**地自动化——做成一个工具 + 一份**只有自然语言的超简单 README**。目标用户是只在对话框里 "vibe coding"、还没碰过工程化的人。

## 词汇表

- **四件套 / 四根支柱（Four Pillars）**：Danny 技术分身号视频的核心品牌，把 AI engineering 拆成四样说人话的东西。本工具就是这条视频里 CTA 说的"起步清单"的**可执行版**。视频脚本：`D:\Click-Reader\marketing\video\drafts\four-pillars-5min-script.md`。
  1. **Prompt Engineering** = 让 AI 帮你改提示词（"先别写代码，把这句改成结构化 prompt，缺信息先反问我"）。
  2. **Context Engineering** = `AGENTS.md`（怎么干活）+ `CONTEXT.md`（黑话和事实）两个文件，治 AI 的失忆。
  3. **Harness Engineering** = `progress.md`（笔记本）+ `session-handoff.md`（交接），让活换对话 / 换机器不丢。
  4. **Loop Engineering** = maker + 独立 checker（`/loop`），别让 AI 自己审自己。
- **vibe coder / 小白**：只用过 AI 对话框、没接触过 agent 工程化的人。**不是笨，是没被接触过、或被几十分钟的长教程吓跑**。这是产品的整个出发点。
- **harness（线束 / 脚手架）**：让 agent 能开工、守边界、能验证、能跨 session 续上的那套文件 + 规矩。本工具生成的就是一个最小 harness。
- **maker / checker**：循环里的两个角色，写的人和验的人**必须分开**。
- **dogfood**：本 repo 自己就用四件套搭，是工具的活样例（呼应视频的 self-demo 收尾）。
- **AI 味 / 套壳味**：generic、模板感、emoji 轰炸、GPT 体文案、随手起的名字。Kristen 把关的头号敌人（见 `roles.md`）。
- **母版**：`D:\Click-Reader\roles.md` 和它的 harness 是这套仪式的成熟样例，本项目的 harness 照它的约定写。

## 已定方向

- 用户是被长教程吓跑的小白；**任何产出说人话、零黑话、能一口气读完**。
- 反 SaaS / 反过度工程：最简能跑的形态优先。
- self-demo / dogfood 是真实可验证的护城河，不是 PPT。
- **正式名 = `fourpack`（中文「四件套」）**（2026-06-19 圆桌锁定）。接 Danny 技术号视频品牌，看完视频搜「四件套」的人能对上 → 视频→产品闭环。`build4me` 被否（外包气味 + 跟品牌脱节）。
- **交付形态 = 粘贴版 prompt 打底 + 包成 skill**（2026-06-19 锁定）。Layer 0 = `四件套起步清单.md`（粘进任意对话框零安装可用，兼 README + 视频引流清单）；Layer 1 = `.claude/skills/fourpack/SKILL.md`。**service app = v2，不进 MVP。**

## MVP 验收线（feat-003 三条）

> 这三条是**验 fourpack 工具本身**（真空 dogfood 测）用的，不是要小白去跑。

1. **fourpack 本仓库 `init.sh` 仍绿**（验工具自己没被改坏，机器可查）。**注意：`init.sh` 只验本仓库**，验的是本仓库独有的文件；小白照清单产出的是 5 个文件，**别拿 `init.sh` 去小白的文件夹跑**。小白产出物"文件齐没齐"靠人眼/清单核对。
2. 生成的文件里**出现用户项目的真实名词**、非占位符（反套壳闸）。
3. 小白**只看生成的文件 / 收尾说明就能说出"下一步干嘛"**（可学性闸）。

## README 形态（已定）

只有自然语言、一屏读完、粘贴块为主。**红线：不许自相矛盾变成又一篇长教程。**
