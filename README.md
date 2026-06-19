# fourpack（四件套）

> 从一个空文件夹开始，复制一段话粘进 AI 对话框，就把"AI 能稳定接手你项目"的工程化底子搭好。不用学四十分钟。

## 想直接用？（小白看这里）

打开下面这页，把里面灰框那段复制粘贴进你的 AI（codex / Claude / 任意国内 agent 平台都行）：

- 中文：**[四件套起步清单.md](四件套起步清单.md)**
- English: **[four-pillars-starter-checklist.md](four-pillars-starter-checklist.md)**

它会先问你"想做啥项目"，然后在空文件夹里替你生成 **5 个文件**：四件套（AGENTS / CONTEXT / progress / session-handoff）+ 一个三人小圆桌 `roles.md`，并教你"先 grill 访谈、再进 maker→checker 循环"的干活节奏。

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

MVP 闭环可交付：feat-001~006 全 done（粘贴清单中英双版 + skill + 3 人 roles.md + grill→loop 节奏），`init.sh` 绿，真空 dogfood 验过。详见 `progress.md` / `session-handoff.md`。
