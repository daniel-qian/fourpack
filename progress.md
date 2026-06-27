# progress.md — 笔记本（冷启动也能读懂）

## Current State（2026-06-27）

**fourpack feat-001~009 全 done，`init.sh` 绿，已开源 PUBLIC。当前本地路径是 `D:\4packs`；GitHub repo slug 同步为 `daniel-qian/4packs`，产品名和 skill 名仍是 `fourpack`。landing 双部署:国内权威(ECS)+ 海外镜像(Vercel),计数代理回国内,一个计数器。**

### 本轮(2026-06-27)做的事:本地路径 + GitHub repo 改名同步

- 本地 checkout 顶层确认是 `D:\4packs`，基线 `bash init.sh` PASS。
- GitHub 旧 repo `daniel-qian/fourpack` 改名为 `daniel-qian/4packs`（PUBLIC，main 不变）。
- 本地 `origin` 改到 `https://github.com/daniel-qian/4packs.git`。
- 面向用户的 GitHub CTA / clone URL 已同步到 `github.com/daniel-qian/4packs`。
- 保留 `fourpack` 作为产品名和 Claude Code skill 名；不把 `.claude/skills/fourpack` / `.claude/skills/fourpack-loop` 改名，避免破坏已发布用法。
- 注意：GitHub 会保留旧仓库 URL redirect，但新文档和新 clone URL 统一用 `4packs`。

### 本轮(2026-06-22)做的事:海外 Vercel 部署(feat-009)

- **线上地址(海外镜像):** https://fourpack.vercel.app （`/` → 307 `/zh`,英文 `/en`）。
- **为什么:** 国内 ECS(`app.ima-read.com`)国外访问慢;要一份海外节点快速访问,且保持无登录、不新增数据库。
- **Vercel 项目:** `kks-projects-84cf18eb/fourpack`,root directory = `landing`,已 `vercel git connect` 到 `daniel-qian/4packs`,生产分支 `main`。**→ 之后 push main 自动部署。** rootDirectory 是建项目后用 Vercel REST API `PATCH` 设上的(`vercel link` 默认没设,会导致 git 部署从仓库根构建失败)。
- **代码改动(都在 `landing/`,已 commit `1b5947f`):**
  - `server.mjs`:抽出 `createRequestListener(options)`(store 可注入,调用改 `await`,支持异步 store);`createApp` 包它,smoke 行为不变;`readBody` 兼容 serverless 已解析的 `req.body`。
  - `api/index.mjs`:Vercel serverless 函数,复用同一套 zh/en 模板(`createRequestListener`)。
  - `api/_store.mjs`:计数器**服务端代理 store**——读/写都 `fetch` 转发到 `FOURPACK_UPSTREAM`(默认 `https://app.ima-read.com/zh/fourpack`)。Vercel 文件系统是临时的,落不了文件;又不想新增数据库(AGENTS.md scope)。所以一个计数器、真实数字;上游不可达(4s 超时)时优雅降级为 0、丢弃 copy 事件而不报错。
  - `vercel.json`:`framework:null`;`/` 重定向 `/zh`;`/(.*)` rewrite 到 `/api`(函数也负责静态);`includeFiles: public/**`。
- **验证:**
  - `bash init.sh`:PASS。`npm run smoke`:PASS(重构 + readBody 改动后两次都绿)。
  - 本地代理函数自检:zh/en 页 + 静态 + 代理读到上游 setup/loop + 写穿透使上游真实 +1。
  - 线上 curl:`/` 307→`/zh`;`/zh` 200;`/en` 200;`/zh/styles.css`+`/app.js` 200;`/zh/api/stats` 读到国内真实数;线上 `POST /en/api/copy setup` 使**国内权威计数 setup 5→6 实时同步**。
  - 结论:rewrite 后函数 `req.url` 保留原始路径 ✓;海外 iad1 节点可达国内 API ✓;无 Vercel 部署保护拦截 ✓。

### 国内权威部署(feat-008,沿用,是权威计数源)

- URL:`https://app.ima-read.com/zh/fourpack` 和 `/en/fourpack`;`/fourpack` 仍由 imaread Next.js 307 到 locale。
- ECS `120.55.97.151`,systemd `fourpack-landing.service` 监听 `127.0.0.1:4173`;Nginx 只代理 `^/(zh|en)/fourpack`。
- 数据:`/var/lib/fourpack-landing/copy-events.jsonl`,只记 `target`+`createdAt`,不记 cookie/IP/UA/用户。
- 当前计数:`setup=6 loop=5`(被本轮海外端到端测试各 +1 过)。

## Product 已交付（done）

- 名字 `fourpack`;形态 = 粘贴 prompt(中 `四件套起步清单.md` / 英 `four-pillars-starter-checklist.md`)+ 两个 skill + 极简 landing(国内权威 + 海外 Vercel 镜像)。
- feat-001/002/003:粘贴清单 + `fourpack` 设置 skill + 真空 dogfood 验收。
- feat-004:英文版清单。
- feat-005:产物加 `roles.md` 三人小圆桌(PM / UI-UX / viewer)。
- feat-006:grill→loop/AFK 节奏并进产物。
- feat-007:`.claude/skills/fourpack-loop` 自循环技能。
- feat-008:国内 landing + zh/en + 两个按钮点击计数。
- feat-009:海外 Vercel 镜像(push 自动部署 + 计数代理回国内)。
- 已开源:https://github.com/daniel-qian/4packs（PUBLIC）。

## 可复制验证命令

海外镜像(从国内需带代理,curl 走系统 `HTTPS_PROXY`):
```bash
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" https://fourpack.vercel.app/
curl -s https://fourpack.vercel.app/zh/api/stats
```
国内权威:
```bash
curl -s https://app.ima-read.com/zh/fourpack/api/stats
```
Vercel CLI(国内必须带代理 flag):
```bash
NODE_USE_ENV_PROXY=1 vercel ls --scope kks-projects-84cf18eb
```

## Next（这一轮已收尾,以下是后续可选）

1. **验证 push 自动部署:** 本轮收尾这次 push 会触发一次 git 自动部署(rootDirectory=landing);可在 https://vercel.com/kks-projects-84cf18eb/fourpack 看 Deployments,或 `NODE_USE_ENV_PROXY=1 vercel ls --scope kks-projects-84cf18eb` 确认最新一条是 GitHub 来源、状态 Ready。
2. 给短视频结尾补 5 秒 landing 展示(可用 fourpack.vercel.app,海外录屏更快)。

## 仍待 Danny（产品老账,需手动或点头）

1. **git 历史里的 imaread**(首提交):彻底抹除需 force-push 改写历史(破坏性),等点头。
2. 远端 `/srv/fourpack-landing/.bak-20260622/`(旧版备份)确认线上没问题后可删。
3. 海外计数依赖国内 API 可达;若哪天想让海外独立计数,需 Danny 点头才考虑引入数据存储(当前 scope 不允许擅自加)。
