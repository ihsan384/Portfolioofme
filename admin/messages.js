import {
  buildShell,
  fetchMessages,
  subscribeMessages,
  supabase,
  requireAuth,
} from './admin.js';

let messages = [];
let grid, unreadCountEl;

/* =========================
   TIME FORMAT
========================= */
function formatFullTime(dateStr) {
  if (!dateStr) return 'Unknown time';

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Unknown time';

  const exact = date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const diff = Date.now() - date.getTime();
  const mins = Math.max(0, Math.floor(diff / 60000));

  let relative = '';
  if (mins < 60) relative = `${mins} min ago`;
  else if (mins < 1440) relative = `${Math.floor(mins / 60)} hr ago`;
  else relative = `${Math.floor(mins / 1440)} day ago`;

  return `${exact} • ${relative}`;
}

function isUnread(m) {
  return m?.is_read !== true;
}

/* =========================
   RENDER
========================= */
function renderMessages() {
  if (!grid) return;
  grid.innerHTML = '';

  if (!messages.length) {
    grid.innerHTML = `
      <div class="message-empty-state">
        <div class="message-empty-title">No messages</div>
        <div class="message-empty-copy">New leads will appear here</div>
      </div>
    `;
    return;
  }

  // ✅ ALWAYS SORT FIRST
  const sorted = [...messages].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  sorted.forEach(msg => {
    const card = document.createElement('div');

    // ✅ IMPORTANT: unread/read class
    card.className = `message-card ${isUnread(msg) ? 'unread' : 'read'}`;

    card.innerHTML = `
      <div class="message-body">

        <div class="message-top">
          <div class="message-sender">
            ${msg.name || 'Unknown'}
          </div>
          <div class="message-time">
            ${formatFullTime(msg.created_at)}
          </div>
        </div>

        <div class="message-meta">
          ${msg.email || 'No email'}
        </div>

        <div class="message-preview">
          ${msg.message || ''}
        </div>

      </div>

      <div class="message-actions">

        <button class="btn-sm btn-accent"
          ${!isUnread(msg) ? 'disabled' : ''}
          onclick="markAsRead(${msg.id})">
          ${isUnread(msg) ? 'Mark read' : 'Read'}
        </button>

        <button class="btn-sm btn-ghost"
          onclick="deleteMessage(${msg.id})">
          Delete
        </button>

      </div>
    `;

    grid.appendChild(card);
  });

  updateUnread();
}

/* =========================
   LOAD
========================= */
async function loadMessages() {
  const data = await fetchMessages();
  messages = Array.isArray(data) ? data : [];
  renderMessages();
}

/* =========================
   UPDATE
========================= */
async function markAsRead(id) {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('id', id);

  if (error) {
    console.error(error);
    alert("Failed to mark as read");
    return;
  }

  // 🔥 FORCE reload from DB (important)
  await loadMessages();
}

/* =========================
   DELETE
========================= */
async function deleteMessage(id) {
  if (!confirm("Delete message?")) return;

  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(error);
    return;
  }

  // 🔥 remove locally
  messages = messages.filter(m => m.id !== id);

  renderMessages();
}

/* =========================
   CSV EXPORT
========================= */
function exportCSV() {
  if (!messages.length) {
    alert("No messages");
    return;
  }

  const headers = ['Name', 'Email', 'Message', 'Date'];

  const rows = messages.map(m => [
    m.name || '',
    m.email || '',
    m.message || '',
    formatFullTime(m.created_at)
  ]);

  let csv = headers.join(',') + '\n';

  rows.forEach(row => {
    csv += row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'messages.csv';
  a.click();
}

/* =========================
   UNREAD COUNT
========================= */
function updateUnread() {
  if (!unreadCountEl) return;
  unreadCountEl.textContent =
    messages.filter(m => !m.is_read).length + ' unread';
}

/* =========================
   INIT
========================= */
document.addEventListener('DOMContentLoaded', async () => {
  await requireAuth();
  await buildShell('messages');

  grid = document.getElementById('messagesGrid');
  unreadCountEl = document.getElementById('unreadCount');

  document.getElementById('exportCSV')?.addEventListener('click', exportCSV);

  await loadMessages();

  // 🔥 REALTIME FIX (NO DUPLICATES)
  subscribeMessages(payload => {
    if (payload.eventType === 'INSERT') {

      const exists = messages.some(m => m.id === payload.new.id);
      if (exists) return;

      messages = [payload.new, ...messages];
      renderMessages();

    } else {
      loadMessages();
    }
  });
  window.markAsRead = markAsRead;
window.deleteMessage = deleteMessage;
setInterval(() => {
  renderMessages();
}, 30000); // every 1 min
});