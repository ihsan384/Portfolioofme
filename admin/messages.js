/* ══════════════════════════════════════════
   Messages Page — Realtime Inbox
   ══════════════════════════════════════════ */
import { requireAuth } from './admin.js';

document.addEventListener('DOMContentLoaded', async () => {
  await requireAuth();
});
   import {
  buildShell,
  fetchMessages,
  formatTime,
  subscribeMessages,
  supabase,
} from './admin.js';

document.addEventListener('DOMContentLoaded', async () => {
  buildShell('messages');

  const grid = document.getElementById('messagesGrid');
  const unreadCountEl = document.getElementById('unreadCount');

  let messages = [];
  let isLoading = false;
  let pendingReload = false;

  function isUnread(message) {
    return message?.is_read !== true;
  }

  function getMessageTime(message) {
    if (!message?.created_at) return 'Unknown time';
    return formatTime(message.created_at);
  }

  function updateUnreadCount() {
    const unreadCount = messages.filter(isUnread).length;
    unreadCountEl.textContent = `${unreadCount} unread`;
  }

  function renderEmptyState() {
    grid.innerHTML = `
      <div class="message-empty-state">
        <div class="message-empty-title">No messages yet</div>
        <div class="message-empty-copy">New leads will appear here — messages will arrive in real time.</div>
      </div>
    `;
  }

  function renderMessages() {
    grid.innerHTML = '';

    if (!messages.length) {
      renderEmptyState();
      updateUnreadCount();
      return;
    }

    messages.forEach(message => {
      const card = document.createElement('article');
      const sender = document.createElement('div');
      const meta = document.createElement('div');
      const preview = document.createElement('div');
      const actions = document.createElement('div');
      const readButton = document.createElement('button');

      card.className = `message-card ${isUnread(message) ? 'unread' : 'read'}`;

      sender.className = 'message-sender';
      sender.textContent = message.name || 'Unknown sender';

      meta.className = 'message-meta';
      meta.textContent = `${message.email || 'No email'} · ${getMessageTime(message)}`;

      preview.className = 'message-preview';
      preview.textContent = message.message || '';

      actions.className = 'message-actions';

      readButton.type = 'button';
      readButton.className = `btn-sm ${isUnread(message) ? 'btn-accent' : 'btn-ghost'}`;
      readButton.textContent = isUnread(message) ? 'Mark as read' : 'Read';
      readButton.disabled = !isUnread(message);
      readButton.addEventListener('click', () => markAsRead(message.id));

      actions.appendChild(readButton);
      card.append(sender, meta, preview, actions);
      grid.appendChild(card);
    });

    updateUnreadCount();
  }

  async function loadMessages() {
    if (isLoading) {
      pendingReload = true;
      return;
    }

    isLoading = true;

    try {
      const data = await fetchMessages();

      messages = Array.isArray(data)
        ? data.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
        : [];

      renderMessages();
    } catch (error) {
      console.error('Load messages failed:', error);
      messages = [];
      renderMessages();
    } finally {
      isLoading = false;

      if (pendingReload) {
        pendingReload = false;
        await loadMessages();
      }
    }
  }

  async function markAsRead(id) {
    if (!id) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', id);

      if (error) {
        console.error('Mark message as read error:', error);
        return;
      }

      messages = messages.map(message =>
        String(message.id) === String(id)
          ? { ...message, is_read: true }
          : message
      );

      renderMessages();
    } catch (error) {
      console.error('Mark message as read failed:', error);
    }
  }

  try {
    await loadMessages();

    subscribeMessages(async () => {
      await loadMessages();
    });
  } catch (error) {
    console.error('Messages inbox initialization failed:', error);
  }
});
