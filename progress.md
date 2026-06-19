# progress.md — 笔记本（冷启动也能读懂）

## Current State（2026-06-19 深夜）

**所有已立项 feature（feat-001~006）全部 done，且每个都独立 checker 验过。** `init.sh` 绿。
唯一未闭环的是**埋点**——方向已定，但**等 Danny 点头**才折进产物（见下）。本 session 是 loop 模式连跑：feat-005 → init.sh 文档修复 → feat-006 → feat-004，每个 maker→独立 checker。

## 已交付（done）

- 名字 `fourpack`；形态 = 粘贴 prompt + skill；app=v2。
- **feat-001/002/003**：粘贴版『四件套起步清单.md』+ skill『SKILL.md』，真空 dogfood 验过。证据 `examples/water-tracker/`。
- **feat-005**：产物加第 5 个生成文件 `roles.md`（PM/UI-UX/viewer 三人）。挂 Loop 支柱下、明写"不是第五件套"不冲淡品牌；viewer=checker。真空验 6 专项线全 PASS。证据 `.check-feat005-tmp/`、`.issues/feat-005/`。
- **feat-006**：grill→loop/AFK 节奏并进现有两产物（不开新文件）。小白直面的粘贴版里 grill/loop/AFK 三词全用大白话、零裸黑话。真空验 A~H 全 PASS。证据 `.check-feat006-tmp/`、`.issues/feat-006/`。
- **feat-004**：英文版『four-pillars-starter-checklist.md』，与最终中文母版一一对应。真空跑 prompt 产出 5 文件、A~G PASS。英文**不单独 fork skill**（fourpack skill 跟用户语言走）。证据 `.issues/feat-004/`。
- **init.sh 文档修复**：头注 + `CONTEXT.md` 验收线 1 说清"`init.sh` 只验本仓库，别拿去小白文件夹跑（会一片 FAIL）"。

## 本 session 拍板（Danny）

1. 产出 roles = 3 人；**fourpack 自身 dev `roles.md` 不瘦身**（保留 6 人桌，内部对抗工具非交付物）。
2. examples/water-tracker 留作证据+usecase+视频素材。

## 唯一未闭环：埋点（等 Danny 点头才动）

方向已定（无后端 + 反 SaaS）：
- **skill/prompt 永不偷偷上报**（信任底线）。
- 分发收口到一个 GitHub repo → star/独立访客/clone 免费当 analytics。
- 清单放**一个**可计数承接位（UTM 短链 / 公众号关键词）数"领取数"当漏斗顶。
- 第二天复用率远程测不了 → 只靠软信号（star/回复/进群），不做遥测。
- **落地动作**（等点头）：粘贴版 + 英文版各加一行承接位 + 一句"本工具不偷偷上报"的信任声明。Jason（指标）+ Bill（最简实现）已在 roles.md 备注要拍。

## Next（新 session 第一件事）

读 `session-handoff.md` + 本文件。已无待做 feature。下一步要么 Danny 点头后落地埋点，要么等视频发出去看真实小白反馈再定新方向。
