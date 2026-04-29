/* ══════════════════════════════════════════
   Dashboard Page — Charts + Stats Init
   ══════════════════════════════════════════ */
import {
  animateCount,
  buildShell,
  configChartDefaults,
  deviceData,
  fetchMessages,
  fetchVisitors,
  formatTime,
  icons,
  requireAuth,
  subscribeVisitors,
} from './admin.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await requireAuth();
    await buildShell('dashboard');
    configChartDefaults();

    // Inject stat icons
    document.getElementById('iconVisitors').innerHTML = icons.eye;
    document.getElementById('iconToday').innerHTML = icons.trending;
    document.getElementById('iconMessages').innerHTML = icons.mail;
    document.getElementById('iconConversion').innerHTML = icons.target;
    
    // Animate counters
    document.querySelectorAll('.stat-value[data-count]').forEach(el => {
      const target = parseFloat(el.dataset.count);
      animateCount(el, target);
    });

    const visitors = await fetchVisitors();
    const messages = await fetchMessages();

    const totalVisitors = visitors.length;

    const todayVisitors = visitors.filter(v => {
      const today = new Date().toDateString();
      return new Date(v.visited_at).toDateString() === today;
    }).length;

    const totalMessages = messages.length;

    const conversionRate = ((totalMessages / totalVisitors) * 100).toFixed(2);

    document.getElementById('totalVisitors').textContent = totalVisitors;
    document.getElementById('todayVisitors').textContent = todayVisitors;
    document.getElementById('totalMessages').textContent = totalMessages;
    document.getElementById('conversionRate').textContent = conversionRate + '%';

    const deviceMap = {};
    visitors.forEach(v => {
      deviceMap[v.device] = (deviceMap[v.device] || 0) + 1;
    });

    const deviceLabels = Object.keys(deviceMap);
    const deviceValues = Object.values(deviceMap);

    // ─── Visitors Line Chart ───
    const lineCtx = document.getElementById('visitorsChart').getContext('2d');
    const gradient = lineCtx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
    
    const dailyMap = {};
    visitors.forEach(v => {
      const d = new Date(v.visited_at);
      const key = d.toISOString().slice(0, 10);
      dailyMap[key] = (dailyMap[key] || 0) + 1;
    });

    const dailyData = Object.entries(dailyMap).sort((a, b) => new Date(a[0]) - new Date(b[0]));
    const labels = dailyData.map(d => d[0]);
    const values = dailyData.map(d => d[1]);

    new Chart(lineCtx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: values,
          borderColor: '#818cf8',
          borderWidth: 2.5,
          backgroundColor: gradient,
          fill: true,
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          tooltip: {
            backgroundColor: 'rgba(11, 13, 23, 0.9)',
            borderColor: 'rgba(99,102,241,0.2)',
            borderWidth: 1,
            padding: 12,
            titleFont: { weight: '600' },
            cornerRadius: 10,
            displayColors: false,
            callbacks: {
              title: items => items[0].label,
              label: item => `${item.parsed.y.toLocaleString()} visitors`,
            },
          },
        },
        scales: {
          x: { ticks: { maxTicksLimit: 8, font: { size: 11 } } },
          y: {
            beginAtZero: false,
            ticks: { maxTicksLimit: 5, font: { size: 11 }, callback: v => v.toLocaleString() },
          },
        },
      },
    });

    // ─── Device Donut Chart ───
    const donutCtx = document.getElementById('deviceChart').getContext('2d');
    new Chart(donutCtx, {
      type: 'doughnut',
      data: {
        labels: deviceLabels,
        datasets: [{
          data: deviceValues,
          backgroundColor: ['#6366f1', '#a855f7', '#22c55e', '#f59e0b'],
          borderColor: 'rgba(11,13,23,0.8)',
          borderWidth: 3,
          hoverOffset: 6,
        }],
      },
      options: {
        responsive: false,
        cutout: '68%',
        plugins: {
          tooltip: {
            backgroundColor: 'rgba(11, 13, 23, 0.9)',
            borderColor: 'rgba(99,102,241,0.2)',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 10,
            callbacks: {
              label: item => ` ${item.label}: ${item.parsed}%`,
            },
          },
        },
      },
    });

    // Device legend
    const legendEl = document.getElementById('deviceLegend');
    if (legendEl) {
      legendEl.innerHTML = deviceData.labels.map((label, i) => `
        <div style="display:flex;align-items:center;gap:8px;justify-content:center;margin-top:${i === 0 ? 16 : 6}px;">
          <span style="width:10px;height:10px;border-radius:50%;background:${deviceData.colors[i]};display:inline-block;"></span>
          <span style="font-size:0.82rem;color:var(--text-secondary);">${label}</span>
          <span style="font-size:0.82rem;font-weight:700;color:var(--text-primary);">${deviceData.values[i]}%</span>
        </div>
      `).join('');
    }

    // ─── Recent Visitors Table (top 8) ───
    const tbody = document.getElementById('recentTableBody');
    visitors.slice(0, 8).forEach(row => {
      const deviceClass = row.device.toLowerCase();
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="device-badge ${deviceClass}">${row.device}</span></td>
        <td>${row.browser}</td>
        <td>${row.country}</td>
        <td>${row.city}</td>
        <td>${formatTime(row.visited_at)}</td>
      `;
      tbody.appendChild(tr);
    });

    // ─── Period toggle (visual only for now) ───
    document.querySelectorAll('.chart-period button').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // ─── Realtime subscriber ───
    subscribeVisitors(async () => {
      const freshVisitors = await fetchVisitors();
      const freshTotal = freshVisitors.length;
      document.getElementById('totalVisitors').textContent = freshTotal;
    });
  } catch (error) {
    console.error('Dashboard initialization failed:', error);
  }
});
