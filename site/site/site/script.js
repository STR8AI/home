// Replace WEBHOOK_URL with your CRM webhook URL or leave '#' to disable real sends
const WEBHOOK_URL = '#';

// Form handling
const form = document.getElementById('crmForm');
const statusEl = document.getElementById('status');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');

clearBtn.addEventListener('click', () => form.reset());

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.textContent = '';
  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending...';

  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    message: form.message.value.trim()
  };

  if (WEBHOOK_URL === '#') {
    statusEl.textContent = 'Webhook not configured — replace WEBHOOK_URL in script.js';
    sendBtn.disabled = false;
    sendBtn.textContent = 'Send to CRM';
    return;
  }

  try {
    // Try JSON webhook by default
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      mode: 'cors'
    });

    if (res.ok) {
      statusEl.textContent = 'Sent — check your CRM.';
      form.reset();
    } else {
      // fallback: if server returns 405 or rejects, try standard form-encoded POST
      const text = await res.text();
      statusEl.textContent = `Webhook responded ${res.status}: ${text}`;
    }
  } catch (err) {
    statusEl.textContent = 'Network or CORS error: ' + (err.message || err);
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = 'Send to CRM';
  }
});
