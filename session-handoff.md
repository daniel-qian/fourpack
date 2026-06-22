# session-handoff.md — fourpack（四件套）· 交接

> 2026-06-22 更新。冷启动接手顺序：本文件 → `progress.md` → `feature_list.json` → `roles.md`。

## 一句话

**fourpack feat-001~008 全 done 并独立验收，`init.sh` 绿，已开源 PUBLIC；landing 已上线 app.ima-read.com 的 zh/en 路径，2026-06-22 又做了『复制完整命令块 + 可展开 + 去提示词改命令』改版并重新部署验过。本轮改动尚未 git commit。**

## ⚠️ 路径（新 session 必读）

- **本地目录计划改名 `D:\build4me` → `D:\fourpack`，但末步要 Danny 终端手动**（会话锁着，改不了自己的 cwd）。改完后**在 `D:\fourpack` 冷启动**；没改就还在 `D:\build4me`。
- GitHub：**https://github.com/daniel-qian/fourpack**（PUBLIC，main，已 push）。
- landing 本地目录：`D:\build4me\landing`
- landing 线上目录：`/srv/fourpack-landing`
- landing 线上数据：`/var/lib/fourpack-landing/copy-events.jsonl`

## 产物现状（done，别重做）

- 两份粘贴清单（中 `四件套起步清单.md` / 英 `four-pillars-starter-checklist.md`）：粘进对话框 → 生成 5 文件（四件套 + 3 人 roles.md）+ 教 grill→loop 节奏 + 末尾一段 **loop prompt 粘贴块**。
- 两个 skill：`fourpack`（搭底子）、`fourpack-loop`（自循环，用 roles 三角色出声挑错）。
- README 写清两层交付：对话框用户粘 prompt / Claude Code 用户 clone 仓库装 skill。
- landing：Node 内置 `http`、无 npm 依赖；zh/en 双语；页面显示 setup / loop 两个**命令**（每张卡可展开看完整命令块）、GitHub 链接、公开按钮点击计数器。

## feat-008 线上状态

- 线上 URL：
  - `https://app.ima-read.com/zh/fourpack`
  - `https://app.ima-read.com/en/fourpack`
- ECS：`120.55.97.151`（Danny 之前口误的 `125.55.97.151` 不通）。
- systemd：`fourpack-landing.service`，监听 `127.0.0.1:4173`。
- Nginx：`/www/server/panel/vhost/nginx/app.ima-read.com.conf`
  - 只新增 `location ~ ^/(zh|en)/fourpack(?:/.*)?$`
  - 放在 `location /` 前，避免 Next.js i18n 吃掉 fourpack 路由。
  - 不接管 `/fourpack`；该路径仍由 imaread Next.js 307 到 locale 路径，保留原语言逻辑。
- 截图 404 的根因：当时 `/zh/fourpack` 还在进现有 Next.js，Next 没有页面；现在 Nginx 已分流到 landing。
- 计数边界：只记 `target` + `createdAt`，不记 cookie / IP / UA / 用户身份。
- 当前公开计数：`setup=4 loop=3`（2026-06-22 重新部署后保留，未重置）。

### 2026-06-22 改版（已部署，详见 progress.md）

- 复制按钮：从短调用行 `fourpack：…` 改为复制**完整命令块**（zh 取自 `四件套起步清单.md`、en 取自 `four-pillars-starter-checklist.md`）；`data-copy-text` 带换行。
- 页面：每张卡加 `<details>`『展开完整命令 / Show the full command』，默认折叠。
- 文案：全面去『提示词 / prompt』改『命令』；顶部由假复制按钮改成滚动链接『看这两个命令 / See the two commands』。定位：别被当成提示词复制器，为以后扩内容留口。
- 改源：`landing/` 下 `server.mjs` / `public/index.html` / `public/styles.css` / `smoke.mjs` / `README.md`。
- 部署：`scp` 这 5 文件到 `/srv/fourpack-landing`，旧版备份在远端 `/srv/fourpack-landing/.bak-20260622/`，`systemctl restart fourpack-landing`。线上确认 OK 后那个 .bak 可删。
- ⚠️ 本地测试坑：Windows Git Bash 跑 `BASE_PATHS=/zh/...` 会被 MSYS 改写路径致 zh 404（假象）；用 `npm run smoke` 或前缀 `MSYS_NO_PATHCONV=1`。Linux 线上不受影响。

## 可复制验证命令

```bash
curl -I https://app.ima-read.com/zh/fourpack
curl -I https://app.ima-read.com/en/fourpack
curl -I https://app.ima-read.com/fourpack
curl -s https://app.ima-read.com/zh/fourpack/api/stats
```

```bash
ssh root@120.55.97.151 "systemctl status fourpack-landing --no-pager"
ssh root@120.55.97.151 "cd /srv/fourpack-landing && /root/.nvm/versions/node/v23.5.0/bin/npm run smoke"
```

重新部署 landing（改了 `landing/` 下文件后）：

```bash
cd landing
scp server.mjs smoke.mjs README.md root@120.55.97.151:/srv/fourpack-landing/
scp public/index.html public/styles.css public/app.js root@120.55.97.151:/srv/fourpack-landing/public/
ssh root@120.55.97.151 "systemctl restart fourpack-landing && cd /srv/fourpack-landing && /root/.nvm/versions/node/v23.5.0/bin/npm run smoke"
```

## 视频（Click-Reader，配套，非 fourpack 仓库内容）

- 4packs 短视频目录：`D:\build4me\4packs-marketing\video\videos\002-fourpack-short\`
- 当前已可把 landing 补进结尾 5 秒：展示 `app.ima-read.com/zh/fourpack`、两个复制按钮、计数器、GitHub/域名卡片。
- Danny 出片流程 = **口播稿直接进剪映 TTS**（记忆 [[danny-voiceover-tts-workflow]]）；**别给他 SVG**（记忆 [[danny-no-svg-use-raster]]）。

## 仍待 Danny（3 件）

1. **本轮 landing 改动尚未 commit**：工作区有 `landing/` 5 文件 + 三个 harness 文件改动。建议 `git add -A && git commit -m "feat(landing): copy full command blocks + expandable view + 去提示词改命令"`（push 与否 Danny 定）。
2. 本地改名 build4me→fourpack（终端手动）。
3. git 历史 imaread 抹除（force-push 改写历史，破坏性，等点头）。
4. 远端 `.bak-20260622/`（旧版备份）线上确认无误后可删。

## 硬规则（先于一切，沿用）

- **dogfood 红线**：产出先自问守没守它要教的四件套；反长教程的工具配长 README = 自爆。
- **说人话**：技术词首次出现就解释；工程过程词（harness/grill/loop/AFK）别甩给小白。
- **反过度工程 + 生成物极简**：核心产品仍是 prompt + skill；landing 只做营销承接和两个复制计数，不能扩成登录/后台/复杂埋点。
- **maker ≠ checker**：写的人和验的人分开。
- **计数边界**：feat-008 只记录两个复制按钮的 `target` + 时间，不记用户身份、IP、UA、cookie。

## 别做（除非 Danny 点头）

- 别把生成物搞复杂；别擅自改写 git 历史 / 改本地目录名；别把 landing 扩成用户系统或分析后台。
