/* ══════════════════════════════════════════
   Visitors Page — Sortable Table
   ══════════════════════════════════════════ */
import { buildShell, fetchVisitors, requireAuth } from './admin.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await requireAuth();
    await buildShell('visitors');

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
  } catch (error) {
    console.error('Visitors page initialization failed:', error);
  }
});

function formatTime(dateStr) {
  if (!dateStr) return 'Unknown';

  const date = new Date(dateStr);
  const now = new Date();

  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 60) return `${mins} min ago`;
  if (hrs < 24) return `${hrs} hr ago`;

  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;

  return date.toLocaleDateString('en-IN');
}
const res = await fetch('https://ipapi.co/json/');
const data = await res.json();

country = data.country_name;
state = data.region;
city = data.city;
