# Four Pillars Starter Checklist (fourpack)

You've only ever written code by chatting with an AI, never set up any "engineering" scaffolding around it — that's fine.
This one page takes you **from an empty folder** to a setup where the AI can reliably pick your project back up: you copy one block of text, paste it in, done. No forty-minute tutorial.

## How to use it (3 steps)

1. Make a new empty folder and open your AI inside it (codex / Claude / any chat that can read and write files).
2. Copy the **whole block in the gray box** below and paste it in.
3. It'll first ask you "what project do you want to build?" — answer in **one sentence**. That's it.

---

```text
You're in an empty folder right now. Don't write any code yet.
Help me set this folder up as a project you'll be able to reliably pick back up later. Use plain language throughout.
If you absolutely must use a technical term (like how data is stored, or what it's built with),
explain what it means in one sentence the first time it shows up.
When something needs me to decide, pick the simplest sensible default for me and say why in one line —
don't just throw jargon at me and make me choose between words I don't understand.

First step: ask me only one thing — what project do I want to build? (one sentence is enough)
Then stop and wait for my answer. Don't go further.

After I answer, create these four files in this folder, and write each one **specifically for the project I described** —
no generic templates:
- AGENTS.md: what you read first every time you start, this project's rules, and what counts as "done."
- CONTEXT.md: the key terms and facts about this project, so you don't forget them in a new chat later.
- progress.md: a running note of where things stand, what's next, and where you're stuck.
- session-handoff.md: when a round isn't finished, the next round (you or another AI) can pick up right from this.

Then add a rule to AGENTS.md: from now on, split the work into two roles — one writes (maker),
the other separately checks, finds problems, and sends it back (checker);
don't let the one who writes also be the one who grades it.

Then add a "rhythm of working" rule: every time I want to build a new feature, **don't just dive in and write** —
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
(if the next step involves a technical choice, set the simplest default for me first — don't make me pick raw jargon).
```

---

## After it's set up, your folder will have a few new files

The four pillars (the core — they cure forgetfulness, keep continuity, and stop work from getting lost):

- **AGENTS.md** —— the AI's "onboarding sheet": what to read first each time, the rules, what counts as done.
- **CONTEXT.md** —— the project's "glossary + facts": cures the AI forgetting everything in a new chat.
- **progress.md** —— a "running ledger": where you are, what's next, where you're stuck.
- **session-handoff.md** —— a "handoff note": this round isn't done, next round picks up seamlessly.

Plus one small roundtable on the side:

- **roles.md** —— three fixed gatekeepers (PM / UI/UX / viewer) so you get three extra angles when you decide, instead of calling every shot alone.

From here on you just say "I want to add an XX feature," and the AI reads these files first before doing anything — no forgetting, picks right up, nothing lost.

## One sentence to remember while you work

When you want to add a feature, don't let the AI dive straight into writing. Just say this:

```text
Don't write code yet. First interview me to pin down what I actually want (one or two questions at a time,
until you're confident), align on the plan with me, then start; then you write, switch hats to find the
flaws and fix them, and only come back to me when you're stuck.
```

This way it **interviews you first, then writes and checks its own work** — and you don't have to watch every step.

## Want it to write, then catch its own mistakes? Paste this too (loop)

The line above is the lightweight version. If you want it to **pass three checks before handing it back** — using the three gatekeepers in the `roles.md` it just generated — paste this in (swap the first line for the feature you actually want):

```text
I want to add a feature: ___ (say what you want in one sentence).
Don't rush to say "done." Do it like this:
1. First make sure you understand what I want (ask me a question or two if unsure), then write a first version.
2. Then switch hats and bring out the three gatekeepers from this project's roles.md, one at a time,
   each saying out loud what's wrong:
   - PM: is this actually useful / did it drift off course?
   - UI/UX: will a first-time user get it / know what to click?
   - the picky tester: is it for show / is it slow / would I use it again?
3. Fix what they caught, let them sweep once more; only tell me it's done when there's nothing left.
(Key: the you that writes and the you that finds faults must be separate — don't grade your own work.)
```

> On Claude Code this is already packaged as the `fourpack-loop` skill, so you don't paste it each time — see GitHub: github.com/daniel-qian/fourpack.

> This checklist itself was made with this exact method. Not a slide deck — it's actually running.
