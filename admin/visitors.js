/* ══════════════════════════════════════════
   Visitors Page — Sortable Table
   ══════════════════════════════════════════ */
import { requireAuth } from './admin.js';

document.addEventListener('DOMContentLoaded', async () => {
  await requireAuth();
});
   import { buildShell, fetchVisitors } from './admin.js';
document.addEventListener('DOMContentLoaded', () => {
  buildShell('visitors');

  let data = [];

    async function init() {
      data = await fetchVisitors();
      render(data);
    }

    init();
  let sortKey = null;
  let sortAsc = true;

  const tbody = document.getElementById('visitorsTableBody');
  const countEl = document.getElementById('tableCount');

  function render(rows) {
    tbody.innerHTML = '';
    rows.forEach(row => {
      const deviceClass = row.device.toLowerCase();
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="device-badge ${deviceClass}">${row.device}</span></td>
        <td>${row.browser}</td>
        <td>${row.country}</td>
        <td>${row.state}</td>
        <td>${row.city}</td>
        <td>${formatTime(row.visited_at)}</td>
      `;
      tbody.appendChild(tr);
    });
    if (countEl) countEl.textContent = `${rows.length} visitors`;
  }

  // Sort
  document.querySelectorAll('#visitorsFullTable th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;

      // Toggle
      if (sortKey === key) {
        sortAsc = !sortAsc;
      } else {
        sortKey = key;
        sortAsc = true;
      }

      // Visual
      document.querySelectorAll('#visitorsFullTable th').forEach(h => h.classList.remove('sorted'));
      th.classList.add('sorted');
      th.querySelector('.sort-icon').textContent = sortAsc ? '▲' : '▼';

      // Sort data
      data.sort((a, b) => {
        const va = (a[key] || '').toString().toLowerCase();
        const vb = (b[key] || '').toString().toLowerCase();
        if (va < vb) return sortAsc ? -1 : 1;
        if (va > vb) return sortAsc ? 1 : -1;
        return 0;
      });

      render(data);
    });
  });

  // Initial render
  render(data);
});
function formatTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;

  return `${Math.floor(hrs / 24)} day ago`;
}
