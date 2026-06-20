# fourpack（四件套）

> 从一个空文件夹开始，复制一段话粘进 AI 对话框，就把"AI 能稳定接手你项目"的工程化底子搭好。不用学四十分钟。

## 想直接用？（小白看这里）

打开下面这页，把里面灰框那段复制粘贴进你的 AI（codex / Claude / 任意国内 agent 平台都行）：

- 中文：**[四件套起步清单.md](四件套起步清单.md)**
- English: **[four-pillars-starter-checklist.md](four-pillars-starter-checklist.md)**

它会先问你"想做啥项目"，然后在空文件夹里替你生成 **5 个文件**：四件套（AGENTS / CONTEXT / progress / session-handoff）+ 一个三人小圆桌 `roles.md`，并教你"先 grill 访谈、再进 maker→checker 循环"的干活节奏。想让它**自己写、自己挑错**，清单末尾还有一段可粘贴的 loop prompt。

## 用 Claude Code？把这两个技能装上

清单里那些"粘一段话"的动作，在 Claude Code 里都包成了**技能**，触发一下就行，不用每次粘：

- `fourpack` —— 一句话给空文件夹搭好底子（生成那 5 个文件）。
- `fourpack-loop` —— 触发 + 一句功能需求，它就自己写、用 `roles.md` 三个把关人挑错、再改（写完先过三关）。

**最简装法：clone 整个仓库**，`.claude/skills/` 里两个技能现成可用，还顺带把清单和示例都拿到：

```bash
git clone https://github.com/daniel-qian/fourpack.git
```

（只想要技能、不想要整仓库？把 `.claude/skills/fourpack` 和 `.claude/skills/fourpack-loop` 两个文件夹拷进你自己项目的 `.claude/skills/`，或拷到 `~/.claude/skills/` 全局可用。）

> 纯对话框用户（minimax / codex / claude.ai 等）不吃 `.claude/skills/`——你照清单**粘 prompt** 就行，效果一样。

---

> 下面是**开发仓库**的 README（给做这个工具的人看）。

## 这个仓库在做什么

把"从空文件夹开始、给 AI 搭好工程化底子"这件事，对只用过对话框的小白**一步到位**。核心是 Danny 技术号视频里的**四件套**（说人话版）：

1. **Prompt** — 让 AI 帮你改提示词
2. **Context** — `AGENTS.md` + `CONTEXT.md` 两个文件，治失忆
3. **Harness** — `progress.md` 笔记本 + `session-handoff.md` 交接，活不丢
4. **Loop** — maker + 独立 checker，别让 AI 自己审自己

## 自我示范（dogfood）

这个仓库自己就是用四件套搭的——它既是要交付的工具，也是方法的活样例。你现在看到的 `AGENTS.md` / `CONTEXT.md` / `progress.md` / `session-handoff.md` / `feature_list.json` / `roles.md` 就是四件套本体。

## 怎么开工

```bash
bash init.sh   # 先确认基线全绿
```

然后按 `AGENTS.md` 的 Startup Workflow 走。产品决策走 `roles.md` 的圆桌。

## 现在在哪一步

MVP 闭环可交付：feat-001~007 全 done（粘贴清单中英双版 + `fourpack` / `fourpack-loop` 两个技能 + 3 人 roles.md + grill→loop 节奏 + loop prompt 粘贴块），`init.sh` 绿，真空 dogfood + viewer 裁决验过。已开源 PUBLIC。详见 `progress.md` / `session-handoff.md`。
