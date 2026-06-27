import { createServer } from 'node:http';
import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { extname, join, normalize, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const publicDir = resolve(__dirname, 'public');
const dataDir = resolve(__dirname, 'data');
const eventsPath = resolve(process.env.EVENTS_PATH ?? resolve(dataDir, 'copy-events.jsonl'));
const targets = new Set(['setup', 'loop']);
const locales = new Set(['zh', 'en']);

const setupCommandZh = `你现在在一个空文件夹里。先别写代码。
请帮我把这个文件夹搭成一个"你以后能稳定接手"的项目。全程用大白话。
如果非用到某个技术词不可（比如数据怎么存、用什么做），第一次出现就用一句话解释它是啥；
遇到要我拿主意的地方，先替我拍一个最简单的默认、再一句话说为啥，别直接甩术语让我在不懂的词里选。

第一步：先只问我一句——我想做的是什么项目？（一句话就行）然后停下，等我回答，别往下做。

我回答后，请在这个文件夹里建这四个文件，而且每个文件都要针对我说的这个项目来写，不要给我通用模板：
- AGENTS.md：你每次开工先读什么、这个项目的规矩、什么才算"做完"。
- CONTEXT.md：这个项目的关键名词和事实，免得你下次开新对话又忘了。
- progress.md：随手记现在做到哪了、下一步干啥、卡在哪。
- session-handoff.md：这一轮没干完时，下一轮（你或别的 AI）照着它就能接上。

再在 AGENTS.md 里加一条规矩：以后干活分成两个角色——一个负责写（maker），
另一个单独负责检查、挑错、打回（checker）；别让同一个你既写又夸自己对。

再加一条"干活的节奏"规矩：以后我每次要做一个新功能，你先别闷头写——
先像采访一样把我要的东西问清楚（一次问一两个关键问题，问到你有把握了为止），把计划跟我对齐；
计划定了，再进上面那个 maker→checker 循环：你写 → 自己换个身份挑错打回 → 改好 → 再挑，
改不动或拿不准了才回来问我。（这样我可以放手让你自己跑，不用盯着每一步。）

再多建一个文件 roles.md：给我配三个固定的"把关人"，帮我做决定时多三个视角，
别让你（或我）一个人把所有板都拍了。就三个，别多，而且都要针对我这个项目、说人话：
- 一个 PM：只问"这功能到底帮我解决什么、做完怎么知道有用"，我一时兴起想加的东西它先帮我砍。
- 一个 UI/UX：只盯"第一次用的人看不看得懂、下一步该点哪"，别做出只有功能、没人会用的东西。
- 一个 viewer：扮一个挑剔的第一次用户，30 秒扫一眼就说真话——"这我看懂了吗 / 是不是在装 / 我还想不想用"。
（上面 checker 那一步，就可以让这个 viewer 来当。）

五个文件都建好后，用大白话告诉我：这几个文件分别是干嘛的，以及我现在该对你说的下一句话是什么
（如果下一步涉及技术选择，就先帮我定个最简单的默认，别让我裸选术语）。`;

const loopCommandZh = `我要加个功能：___（一句话说你要啥）。
先别急着说"做好了"，按这个来：
1. 先把我要的问清楚（有不确定就问我一两句），再写第一版。
2. 然后换个身份，把项目里 roles.md 那三个把关人一个一个请出来挑你自己的毛病，每个都说出来：
   - PM：这功能到底有用没用、有没有跑偏？
   - UI/UX：第一次用的人看得懂吗、知道点哪吗？
   - 那个挑剔的试用员：是不是在装、卡不卡、我还想不想再用？
3. 把挑出的问题改掉，再让他们扫一遍；没毛病了再告诉我做完了。
（关键：写的你和挑错的你要分开，别自己夸自己。）`;

const setupCommandEn = `You're in an empty folder right now. Don't write any code yet.
Help me set this folder up as a project you'll be able to reliably pick back up later. Use plain language throughout.
If you absolutely must use a technical term (like how data is stored, or what it's built with),
explain what it means in one sentence the first time it shows up.
When something needs me to decide, pick the simplest sensible default for me and say why in one line —
don't just throw jargon at me and make me choose between words I don't understand.

First step: ask me only one thing — what project do I want to build? (one sentence is enough)
Then stop and wait for my answer. Don't go further.

After I answer, create these four files in this folder, and write each one specifically for the project I described —
no generic templates:
- AGENTS.md: what you read first every time you start, this project's rules, and what counts as "done."
- CONTEXT.md: the key terms and facts about this project, so you don't forget them in a new chat later.
- progress.md: a running note of where things stand, what's next, and where you're stuck.
- session-handoff.md: when a round isn't finished, the next round (you or another AI) can pick up right from this.

Then add a rule to AGENTS.md: from now on, split the work into two roles — one writes (maker),
the other separately checks, finds problems, and sends it back (checker);
don't let the one who writes also be the one who grades it.

Then add a "rhythm of working" rule: every time I want to build a new feature, don't just dive in and write —
first interview me to pin down what I actually want (ask one or two key questions at a time, until you're confident
and the plan is aligned with me); once the plan is set, go into that maker→checker loop above:
you write → switch hats and find the flaws / send it back → fix it → check again,
and only come back to me when you're stuck or unsure.
(This way I can let you run on your own without watching every step.)

Then create one more file, roles.md: give me three fixed "gatekeepers" so I get three extra angles when I decide,
instead of you (or me) making every call alone. Just three, no more, and all written for my specific project, in plain language:
- a PM: only asks "what problem does this feature actually solve for me, and how will I know it worked?" —
  and trims the stuff I add on a whim.
- a UI/UX person: only watches "will a first-time user get it, and know what to click next?" —
  so we don't build something that has features but nobody can use.
- a viewer: plays a picky first-time user who glances for 30 seconds and tells the truth —
  "do I get what this is? / is it just for show? / would I open it again?"
(That checker step above — let this viewer play it.)

Once all five files are built, tell me in plain language what each one is for,
and what the next thing I should say to you is
(if the next step involves a technical choice, set the simplest default for me first — don't make me pick raw jargon).`;

const loopCommandEn = `I want to add a feature: ___ (say what you want in one sentence).
Don't rush to say "done." Do it like this:
1. First make sure you understand what I want (ask me a question or two if unsure), then write a first version.
2. Then switch hats and bring out the three gatekeepers from this project's roles.md, one at a time,
   each saying out loud what's wrong:
   - PM: is this actually useful / did it drift off course?
   - UI/UX: will a first-time user get it / know what to click?
   - the picky tester: is it for show / is it slow / would I use it again?
3. Fix what they caught, let them sweep once more; only tell me it's done when there's nothing left.
(Key: the you that writes and the you that finds faults must be separate — don't grade your own work.)`;

const pageCopy = {
  zh: {
    htmlLang: 'zh-CN',
    title: 'Fourpack - agent project starter',
    description: 'Fourpack gives a new project four plain-language files so your coding agent knows what to do next.',
    eyebrow: 'Fourpack / 四件套',
    headline: '两个起手式，把 AI 项目搭起来。',
    lede:
      '第一个 setup 先给项目搭好四件套；第二个 loop 在每次开发、修 bug 时让 AI 先写、再挑错、再改。不用登录，不用 dashboard，不用学四十分钟。',
    primaryCta: '看这两个命令',
    githubCta: 'GitHub / daniel-qian/4packs',
    stepOne: '1. 搭底子',
    stepTwo: '2. 每次开发循环',
    stepThree: '3. 让下一轮接得上',
    copiedPrefix: '复制按钮点击：',
    copiedBetween: ' 次，',
    copiedSuffix: ' 次。',
    setupHeading: '新项目先用它',
    setupBody: '在空文件夹里粘进去。它会先问你要做什么项目，再写 AGENTS / CONTEXT / progress / handoff / roles。',
    expandLabel: '展开完整命令',
    setupCommand: setupCommandZh,
    setupButton: '复制 setup 命令',
    loopHeading: '开发和修 bug 都用它',
    loopBody: '把功能写在空格里。它会先问清楚，再动手，再让 roles.md 里的三个角色挑错，改完再交。',
    loopCommand: loopCommandZh,
    loopButton: '复制 loop 命令'
  },
  en: {
    htmlLang: 'en',
    title: 'Fourpack - agent project starter',
    description: 'Fourpack gives a new project four plain-language files so your coding agent knows what to do next.',
    eyebrow: 'Fourpack / four-file starter',
    headline: 'Two starter commands for shipping with AI agents.',
    lede:
      'Use setup once to give a new project its four plain-language files. Use loop every time you build or fix something, so the agent writes, checks, and revises before handing work back.',
    primaryCta: 'See the two commands',
    githubCta: 'GitHub / daniel-qian/4packs',
    stepOne: '1. Set the base',
    stepTwo: '2. Loop every change',
    stepThree: '3. Keep the next run warm',
    copiedPrefix: 'Copy clicks: ',
    copiedBetween: ', ',
    copiedSuffix: '.',
    setupHeading: 'Start a new project with this',
    setupBody: 'Paste it into an empty folder. It asks what you are building, then writes AGENTS / CONTEXT / progress / handoff / roles.',
    expandLabel: 'Show the full command',
    setupCommand: setupCommandEn,
    setupButton: 'Copy setup command',
    loopHeading: 'Use this for features and bugs',
    loopBody: 'Fill in the blank with the change you want. It asks first, writes, lets the three roles in roles.md critique it, then revises.',
    loopCommand: loopCommandEn,
    loopButton: 'Copy loop command'
  }
};

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8'
};

function createStore(path = eventsPath) {
  mkdirSync(resolve(path, '..'), { recursive: true });

  return {
    record(target) {
      const event = {
        target,
        createdAt: new Date().toISOString()
      };
      appendFileSync(path, `${JSON.stringify(event)}\n`, 'utf8');
    },
    stats() {
      const counts = { setup: 0, loop: 0 };
      if (!existsSync(path)) {
        return counts;
      }

      const lines = readFileSync(path, 'utf8').split('\n');
      for (const line of lines) {
        if (!line.trim()) {
          continue;
        }

        try {
          const event = JSON.parse(line);
          if (targets.has(event.target)) {
            counts[event.target] += 1;
          }
        } catch {
          // Ignore a broken trailing/manual line; the counter should keep working.
        }
      }
      return counts;
    },
    close() {}
  };
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  });
  res.end(JSON.stringify(payload));
}

function normalizeBasePath(value) {
  if (!value || value === '/') {
    return '';
  }

  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`;
  return withLeadingSlash.replace(/\/+$/, '');
}

function normalizeBasePaths(options = {}) {
  const explicitPaths =
    options.basePaths ??
    process.env.BASE_PATHS?.split(',') ??
    (options.basePath || process.env.BASE_PATH ? [options.basePath ?? process.env.BASE_PATH] : ['']);

  return [...new Set(explicitPaths.map(normalizeBasePath))].sort((a, b) => b.length - a.length);
}

function localeFromMountPath(mountPath) {
  const segment = mountPath.split('/').filter(Boolean)[0];
  return locales.has(segment) ? segment : 'zh';
}

function stripBasePath(pathname, mountPaths) {
  for (const mountPath of mountPaths) {
    if (!mountPath) {
      return { pathname, mountPath: '', locale: 'zh' };
    }

    if (pathname === mountPath) {
      return { pathname: '/', mountPath, locale: localeFromMountPath(mountPath) };
    }

    if (pathname.startsWith(`${mountPath}/`)) {
      return {
        pathname: pathname.slice(mountPath.length),
        mountPath,
        locale: localeFromMountPath(mountPath)
      };
    }
  }

  return null;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function readBody(req, limit = 4096) {
  // Some serverless runtimes (e.g. Vercel) parse and consume the request
  // stream before our handler runs, exposing it as req.body. Use that when
  // present; the plain Node http server leaves req.body undefined and falls
  // through to reading the stream.
  if (req.body !== undefined && req.body !== null && req.body !== '') {
    const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    return Promise.resolve(raw);
  }

  return new Promise((resolveBody, rejectBody) => {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', chunk => {
      body += chunk;
      if (body.length > limit) {
        rejectBody(Object.assign(new Error('Body too large'), { statusCode: 413 }));
        req.destroy();
      }
    });
    req.on('end', () => resolveBody(body));
    req.on('error', rejectBody);
  });
}

function staticFilePath(urlPath) {
  const requestedPath = urlPath === '/' ? '/index.html' : urlPath;
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(requestedPath);
  } catch {
    return null;
  }
  const fullPath = normalize(join(publicDir, decodedPath));
  const pathInsidePublic = !relative(publicDir, fullPath).startsWith('..');
  return pathInsidePublic ? fullPath : null;
}

// Returns a plain (req, res) handler usable by both Node's http.createServer
// (the boring China deploy) and a Vercel serverless function (the overseas
// mirror). The store is injectable and may be sync (filesystem) or async
// (a proxy that forwards to the authoritative deploy) — that's why the two
// store calls below are awaited.
export function createRequestListener(options = {}) {
  const store = options.store ?? createStore(options.eventsPath ?? eventsPath);
  const mountPaths = normalizeBasePaths(options);

  const listener = async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const route = stripBasePath(url.pathname, mountPaths);

    if (!route) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      return res.end('Not found');
    }

    const { pathname, mountPath, locale } = route;

    if (req.method === 'GET' && pathname === '/api/stats') {
      return sendJson(res, 200, await store.stats());
    }

    if (req.method === 'POST' && pathname === '/api/copy') {
      try {
        const payload = JSON.parse(await readBody(req));
        if (!targets.has(payload.target)) {
          return sendJson(res, 400, { error: 'target must be "setup" or "loop"' });
        }
        await store.record(payload.target);
        return sendJson(res, 200, { ok: true, stats: await store.stats() });
      } catch (error) {
        return sendJson(res, error.statusCode ?? 400, { error: 'invalid json body' });
      }
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return sendJson(res, 405, { error: 'method not allowed' });
    }

    const filePath = staticFilePath(pathname);
    if (!filePath) {
      res.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' });
      return res.end('Bad request');
    }

    try {
      let body = readFileSync(filePath);
      if (extname(filePath) === '.html') {
        let html = body.toString('utf8').replaceAll('%BASE_PATH%', mountPath);
        for (const [key, value] of Object.entries(pageCopy[locale])) {
          html = html.replaceAll(`%${key.toUpperCase()}%`, escapeHtml(value));
        }
        body = Buffer.from(html, 'utf8');
      }
      res.writeHead(200, {
        'content-type': mimeTypes[extname(filePath)] ?? 'application/octet-stream',
        'cache-control': 'no-store'
      });
      return req.method === 'HEAD' ? res.end() : res.end(body);
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      return res.end('Not found');
    }
  };

  listener.store = store;
  return listener;
}

export function createApp(options = {}) {
  const listener = createRequestListener(options);
  const server = createServer(listener);
  server.on('close', () => listener.store.close());
  return server;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT ?? 4173);
  const host = process.env.HOST ?? '127.0.0.1';
  const server = createApp();

  server.listen(port, host, () => {
    const address = server.address();
    console.log(`fourpack landing running at http://${address.address}:${address.port}`);
  });
}
