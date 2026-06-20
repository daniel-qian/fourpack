# session-handoff.md — fourpack（四件套）· 交接

> 2026-06-20 session 正式收尾。冷启动接手顺序：本文件 → `progress.md` → `feature_list.json` → `roles.md`。

## 一句话

**fourpack feat-001~007 全 done 并独立验收，`init.sh` 绿，已开源 PUBLIC（commit 2b7f4b2，仓库与 origin 同步无未提交），配套视频脚本 + TTS 口播稿也做好了。** 没有待做 feature。3 件老账需 Danny 手动/点头。

## ⚠️ 路径（新 session 必读）

- **本地目录计划改名 `D:\build4me` → `D:\fourpack`，但末步要 Danny 终端手动**（会话锁着，改不了自己的 cwd）。改完后**在 `D:\fourpack` 冷启动**；没改就还在 `D:\build4me`。harness 文件随文件夹搬，冷启动照常。
- GitHub：**https://github.com/daniel-qian/fourpack**（PUBLIC，main，已 push）。
- 自动记忆按路径键存：已把记忆同步复制到 `D--fourpack` 键，改名后能继承。

## 产物现状（done，别重做）

- 两份粘贴清单（中 `四件套起步清单.md` / 英 `four-pillars-starter-checklist.md`）：粘进对话框 → 生成 5 文件（四件套 + 3 人 roles.md）+ 教 grill→loop 节奏 + 末尾一段 **loop prompt 粘贴块**。
- 两个 skill：`fourpack`（搭底子）、`fourpack-loop`（自循环，用 roles 三角色出声挑错）。
- README 写清两层交付：对话框用户粘 prompt / Claude Code 用户 clone 仓库装 skill。

## 视频（Click-Reader，配套，非 fourpack 仓库内容）

- 草稿 8:10（minimax code 录的），要砍到 ~5min；脚本/口播稿/砍法稿都在 `D:\Click-Reader\marketing\video\videos\003-4packs\`（详见 `progress.md`）。
- 关键钩子 = **"两个起手式"**（① 一键装四件套 ② 以后开发随时粘），两段全文贴评论区。
- Danny 出片流程 = **口播稿直接进剪映 TTS**（记忆 [[danny-voiceover-tts-workflow]]）；**别给他 SVG**（记忆 [[danny-no-svg-use-raster]]）。

## 仍待 Danny（3 件）

1. 本地改名 build4me→fourpack（终端手动）。
2. 埋点落地（等点头）：GitHub 当免费 analytics + 一个承接位短链 + "不偷偷上报"声明，折进中英清单。需 Jason（指标）+ Bill（最简实现）拍。
3. git 历史 imaread 抹除（force-push 改写历史，破坏性，等点头）。

## 硬规则（先于一切，沿用）

- **dogfood 红线**：产出先自问守没守它要教的四件套；反长教程的工具配长 README = 自爆。
- **说人话**：技术词首次出现就解释；工程过程词（harness/grill/loop/AFK）别甩给小白。
- **反过度工程 + 生成物极简**：无后端/数据库/登录/网页（app=v2）；生成物保持最小。
- **maker ≠ checker**：写的人和验的人分开（本 session 全程独立 agent 当 checker/viewer）。
- **埋点没点头前别往产物加上报/承接位。**

## 别做（除非 Danny 点头）

- 别把生成物搞复杂；别给 app 开工；别擅自改写 git 历史 / 改本地目录名 / 加埋点。
