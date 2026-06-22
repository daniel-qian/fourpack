const basePath = new URL(import.meta.url).pathname.replace(/\/app\.js$/, '');
const counts = {
  setup: document.querySelector('#setup-count'),
  loop: document.querySelector('#loop-count')
};

function updateCounts(stats) {
  counts.setup.textContent = stats.setup ?? 0;
  counts.loop.textContent = stats.loop ?? 0;
}

async function refreshStats() {
  const response = await fetch(`${basePath}/api/stats`);
  if (!response.ok) {
    return;
  }
  updateCounts(await response.json());
}

async function recordCopy(target) {
  const response = await fetch(`${basePath}/api/copy`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ target })
  });
  if (response.ok) {
    const payload = await response.json();
    updateCounts(payload.stats);
  }
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall back below. Some embedded browsers block the async clipboard API.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  if (!copied) {
    throw new Error('copy failed');
  }
}

for (const button of document.querySelectorAll('[data-copy-target]')) {
  button.addEventListener('click', async () => {
    const originalLabel = button.textContent;
    let copied = false;
    try {
      await copyText(button.dataset.copyText);
      copied = true;
    } catch {
      // Count the click even if this browser blocks clipboard writes.
    }

    try {
      await recordCopy(button.dataset.copyTarget);
      button.textContent = copied ? 'Copied' : 'Copy blocked';
      button.classList.add('copied');
      setTimeout(() => {
        button.textContent = originalLabel;
        button.classList.remove('copied');
      }, 1400);
    } catch {
      button.textContent = copied ? 'Copied, count failed' : 'Copy failed';
      setTimeout(() => {
        button.textContent = originalLabel;
      }, 1800);
    }
  });
}

refreshStats();
