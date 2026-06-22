# progress.md — 笔记本（冷启动也能读懂）

## Current State（2026-06-22）

**fourpack 产品 feat-001~008 全部 done，`init.sh` 绿，已开源 PUBLIC；线上 landing 已做『完整命令 + 可展开 + 去提示词改命令』改版并重新部署。**

1. **feat-008：fourpack 极简 landing + 两个复制计数**
   - 本地目录：`landing/`
   - 线上地址：
     - `https://app.ima-read.com/zh/fourpack`
     - `https://app.ima-read.com/en/fourpack`
   - 线上服务：ECS `120.55.97.151`，systemd `fourpack-landing.service`，监听 `127.0.0.1:4173`。
   - Nginx：`/www/server/panel/vhost/nginx/app.ima-read.com.conf` 只代理 `^/(zh|en)/fourpack` 到 landing，不接管 `/fourpack`。
   - imaread 原有语言逻辑保留：公网 `https://app.ima-read.com/fourpack` 仍由 Next.js 307 到 `/zh/fourpack`（按浏览器/locale 逻辑走）。
   - 页面：zh/en 双语，首屏展示 setup / loop 两个命令、GitHub 链接、公开小计数器。
   - 计数：`POST /api/copy` 只接受 `setup` / `loop`；`GET /api/stats` 返回两类按钮点击次数。
   - 数据：线上写 `/var/lib/fourpack-landing/copy-events.jsonl`；只记 `target` + `createdAt`，不记 cookie / IP / UA / 用户。
   - 计数现状（部署后保留未重置）：`setup=4 loop=3`。

   **2026-06-22 改版（本轮，已部署）——为什么改：复制出来是被砍掉的一句话 + 想去掉『提示词』定位：**
   - **复制完整命令**：之前复制的是 `fourpack：…` 短调用行（只有 Claude Code 装了 skill 才有用，纯对话框粘了没反应）。改为复制清单里的**完整命令块**（中文取自 `四件套起步清单.md`、英文取自 `four-pillars-starter-checklist.md`，各一整段）。`data-copy-text` 带换行，复制出来是多行整段。
   - **页面可展开完整命令**：每张卡加 `<details>`『展开完整命令 / Show the full command』，默认折叠、`<pre>` 内可滚动，看得到要复制的全部内容。
   - **去『提示词/prompt』改『命令』**：顶部『复制两个提示词』本来只是个锚点不复制 → 改成滚动链接『看这两个命令 / See the two commands』；卡片按钮『复制 setup/loop 命令』；EN headline `Two starter prompts → Two starter commands`。目的：别让人觉得这只是个提示词复制器，给以后持续加别的内容留口。
   - 改的源文件：`landing/server.mjs`（pageCopy 内联完整命令块 + `expandLabel`）、`landing/public/index.html`（details/summary/pre）、`landing/public/styles.css`、`landing/smoke.mjs`（断言由 `Two starter prompts` 改 `Two starter commands`）、`landing/README.md`。
   - 部署方式：`scp` 5 个改动文件到 `/srv/fourpack-landing`（先备份旧版到远端 `/srv/fourpack-landing/.bak-20260622/`），`systemctl restart fourpack-landing`。
   - 之前（2026-06-21）已修的两个前端坑仍在：`type="module"` 下 `document.currentScript` 为 `null` → 用 `import.meta.url`；嵌入式浏览器拦 clipboard → 先尝试复制再记按钮点击，计数文案=“复制按钮点击”。
   - 历史坑（已修）：截图 404 根因是 `/zh/fourpack` 当时还在进 Next.js，Next 没这页；Nginx 已在 `location /` 前加更窄的 fourpack 分流。
   - 本地测试注意：Windows Git Bash 跑 `BASE_PATHS=/zh/fourpack,...` 会被 MSYS 路径转换改成 `C:/Program Files/Git/zh/...` 导致 zh 404，是测试假象不是 bug；要么前面加 `MSYS_NO_PATHCONV=1`，要么用 `npm run smoke`（走 basePaths 选项不受影响）。线上 Linux systemd 不受此影响。

2. **4packs 营销短视频 act-0003**
   - 目录：`4packs-marketing/video/videos/002-fourpack-short/`
   - Danny 已补音频 / SRT：`4packs-short/4packs-short.mp3`、`4packs-short/4packs-short.srt`
   - Remotion 第一版：`remotion/renders/fourpack-short.mp4`
   - HyperFrames 55s HTML 参考：`hyperframes/`
   - 下一步：给视频结尾补 5 秒 landing 展示（页面、两个复制按钮、计数器、GitHub/域名卡片）。

3. **跨项目营销资源 + scaffold skill**
   - 公共资源根：`D:\marketing-resource`
   - skill：`C:\Users\86139\.agents\skills\marketing-scaffold`
   - 脚本：`D:\marketing-resource\scripts\scaffold-marketing.ps1`
   - 同步脚本：`D:\marketing-resource\scripts\sync-shared-links.ps1`
   - `D:\TeamMaster-Prototype-2.0\marketing` 已搭脚手架。
   - 各项目 `<产品资料>\_shared` 指向 `D:\marketing-resource\common`；同盘文件用 hardlink 兜底。

## Product 已交付（done）

- 名字 `fourpack`；形态 = 粘贴 prompt（中 `四件套起步清单.md` / 英 `four-pillars-starter-checklist.md`）+ 两个 skill + 极简 landing。
- **feat-001/002/003**：粘贴清单 + `fourpack` 设置 skill + 真空 dogfood 验收。
- **feat-004**：英文版清单。
- **feat-005**：产物加 `roles.md` 三人小圆桌（PM / UI-UX / viewer）。
- **feat-006**：grill→loop/AFK 节奏并进产物。
- **feat-007**：`.claude/skills/fourpack-loop` 自循环技能。
- **feat-008**：线上 landing + zh/en + 两个按钮点击计数。
- **已开源**：https://github.com/daniel-qian/fourpack（PUBLIC）。

## Verification（2026-06-22 本轮 landing 改版 + 重新部署）

- `bash init.sh`：PASS。
- `feature_list.json`：JSON parse PASS。
- `landing` 本地：
  - `npm run smoke`：PASS（首页、公开计数器、copy setup、copy loop、stats、畸形 URL 400、`/zh/fourpack` + `/en/fourpack` 子路径挂载）。
  - Node 内联渲染检查：zh/en 各 2 张可展开卡、完整命令块在页内、`data-copy-text` 带换行、0 处『提示词/prompt』残留、CTA 已改『看这两个命令 / See the two commands』。
- `landing` 部署 + 线上：
  - `scp` 5 文件到 `/srv/fourpack-landing`，远端文件 `wc -c` 与本地逐字节一致；旧版已备份到远端 `.bak-20260622/`。
  - `systemctl restart fourpack-landing` → `active`。
  - 远端 `npm run smoke`：PASS。
  - 公网 curl：`/zh/fourpack` 200；`/en/fourpack` 200；`/fourpack` 仍 307；live HTML 确认完整命令块（`session-handoff.md` 在 `<pre>`+`data-copy-text` 各出现）、`展开完整命令` x2、`看这两个命令`、`Two starter commands`、0 处『提示词/prompt』。
  - 计数 `setup=4 loop=3`，部署后保留未被重置。
- Remotion 短版：之前已 `npx tsc --noEmit` PASS、`npm run render` PASS、`ffprobe` 确认 1080x1920 / 55.0s / h264+aac。
- HyperFrames 短版：之前已 lint 0 errors 2 warnings、validate PASS、inspect PASS。

## Next

1. 本轮 landing 改动**尚未 git commit**（工作区有改动：`landing/` 5 文件 + `progress.md` / `session-handoff.md` / `feature_list.json`）。Danny 醒后在 `main` 上收尾提交即可，建议：
   `git add -A && git commit -m "feat(landing): copy full command blocks + expandable view + 去提示词改命令"`（要不要 push 由 Danny 定）。
2. 给短视频结尾补 5 秒 landing 展示：打开 `app.ima-read.com/zh/fourpack`，展示两张卡的『展开完整命令』+ 复制按钮、公开计数器、GitHub 卡片。
3. Danny 从第一条视频抽 3-5 秒高光，放到 `4packs-marketing/video/videos/002-fourpack-short/assets/old-demo-clip.mp4`，再替换短视频里的模拟终端 slot。

## 仍待 Danny（产品老账，需手动或点头）

1. **本地目录 `D:\build4me → D:\fourpack`**：会话锁着改不了。关会话后终端跑 `Rename-Item -Path 'D:\build4me' -NewName 'fourpack'`，下次在 `D:\fourpack` 冷启动。
2. **git 历史里的 imaread**（首提交）：彻底抹除需 force-push 改写历史（破坏性），等点头。
3. 远端 `/srv/fourpack-landing/.bak-20260622/`（本轮部署的旧版备份）确认线上没问题后可删。
