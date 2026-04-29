/* ══════════════════════════════════════════
   Analytics Page — Detailed Charts
   ══════════════════════════════════════════ */
import {
  animateCount,
  buildShell,
  configChartDefaults,
  fetchVisitors,
  icons,
  subscribeVisitors,
  requireAuth,
} from './admin.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await requireAuth();
  } catch (error) {
    console.error('Auth check failed:', error);
  }

  await buildShell('analytics');
  configChartDefaults();

  const donutLegendEl = document.getElementById('donutLegend');
  let lineChart = null;
  let donutChart = null;
  let countryChart = null;
  let updateTimer = null;

  function buildVisitorMetrics(visitors) {
    const dailyMap = {};
    const deviceMap = {};
    const countryMap = {};

    visitors.forEach(v => {
      const d = new Date(v.visited_at);
      const key = d.toISOString().slice(0, 10);
      dailyMap[key] = (dailyMap[key] || 0) + 1;
      deviceMap[v.device] = (deviceMap[v.device] || 0) + 1;
      countryMap[v.country] = (countryMap[v.country] || 0) + 1;
    });

    const dailyData = Object.entries(dailyMap).sort((a, b) => new Date(a[0]) - new Date(b[0]));
    const labels = dailyData.map(d => d[0]);
    const values = dailyData.map(d => d[1]);

    const total = visitors.length || 1;
    const deviceLabels = Object.keys(deviceMap);
    const deviceValues = deviceLabels.map(label =>
      Math.round((deviceMap[label] / total) * 100)
    );

    const countryLabels = Object.keys(countryMap);
    const countryValues = countryLabels.map(label => countryMap[label]);

    return {
      labels,
      values,
      deviceLabels,
      deviceValues,
      countryLabels,
      countryValues,
    };
  }

  function renderDonutLegend(labels, values) {
    if (!donutLegendEl) return;

    donutLegendEl.innerHTML = labels
      .map((label, i) => `
        <div style="display:flex;align-items:center;gap:8px;justify-content:center;margin-top:${i === 0 ? 16 : 6}px;">
          <span style="width:10px;height:10px;border-radius:50%;background:#6366f1;"></span>
          <span style="font-size:0.82rem;color:var(--text-secondary);">${label}</span>
          <span style="font-size:0.82rem;font-weight:700;color:var(--text-primary);">${values[i]}</span>
        </div>
      `)
      .join('');
  }

  function createLineChart(labels, values) {
    const ctx = document.getElementById('fullLineChart').getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.22)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            data: values,
            borderColor: '#818cf8',
            borderWidth: 2.5,
            backgroundColor: gradient,
            fill: true,
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          tooltip: {
            backgroundColor: 'rgba(11,13,23,0.9)',
            borderColor: 'rgba(99,102,241,0.2)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 10,
            displayColors: false,
            callbacks: {
              label: item => `${item.parsed.y.toLocaleString()} visitors`,
            },
          },
        },
        scales: {
          x: { ticks: { maxTicksLimit: 10, font: { size: 11 } } },
          y: {
            beginAtZero: false,
            ticks: { maxTicksLimit: 6, font: { size: 11 }, callback: v => v.toLocaleString() },
          },
        },
      },
    });
  }

  function createDonutChart(labels, values) {
    const ctx = document.getElementById('deviceDonut').getContext('2d');
    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: ['#6366f1', '#a855f7', '#22c55e', '#f59e0b'],
            borderColor: 'rgba(11,13,23,0.8)',
            borderWidth: 3,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: false,
        cutout: '68%',
        plugins: {
          tooltip: {
            backgroundColor: 'rgba(11,13,23,0.9)',
            borderColor: 'rgba(99,102,241,0.2)',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 10,
            callbacks: { label: item => ` ${item.label}: ${item.parsed}%` },
          },
        },
      },
    });
  }

  function createCountryChart(labels, values) {
    const ctx = document.getElementById('countryBar').getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 400, 0);
    gradient.addColorStop(0, '#6366f1');
    gradient.addColorStop(1, '#a855f7');

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: gradient,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            backgroundColor: 'rgba(11,13,23,0.9)',
            borderColor: 'rgba(99,102,241,0.2)',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 10,
            displayColors: false,
            callbacks: { label: item => ` ${item.parsed.x.toLocaleString()} visitors` },
          },
        },
        scales: {
          x: { ticks: { font: { size: 11 }, callback: v => v.toLocaleString() } },
          y: { ticks: { font: { size: 12, weight: '500' }, color: '#9395a5' } },
        },
      },
    });
  }

  async function initCharts() {
    try {
      const visitors = await fetchVisitors();
      const metrics = buildVisitorMetrics(visitors || []);

      document.getElementById('aIconAvg').innerHTML = icons.trending;
      document.getElementById('aIconBounce').innerHTML = icons.eye;
      document.getElementById('aIconPages').innerHTML = icons.dashboard;

      document.querySelectorAll('.stat-value[data-count]').forEach(el => {
        const target = parseFloat(el.dataset.count);
        animateCount(el, target);
      });

      lineChart = createLineChart(metrics.labels, metrics.values);
      donutChart = createDonutChart(metrics.deviceLabels, metrics.deviceValues);
      countryChart = createCountryChart(metrics.countryLabels, metrics.countryValues);
      renderDonutLegend(metrics.deviceLabels, metrics.deviceValues);
    } catch (error) {
      console.error('Failed to initialize analytics charts:', error);
    }
  }

  function refreshChartData(metrics) {
    if (lineChart) {
      lineChart.data.labels = metrics.labels;
      lineChart.data.datasets[0].data = metrics.values;
      lineChart.update('active');
    }

    if (donutChart) {
      donutChart.data.labels = metrics.deviceLabels;
      donutChart.data.datasets[0].data = metrics.deviceValues;
      donutChart.update('active');
      renderDonutLegend(metrics.deviceLabels, metrics.deviceValues);
    }

    if (countryChart) {
      countryChart.data.labels = metrics.countryLabels;
      countryChart.data.datasets[0].data = metrics.countryValues;
      countryChart.update('active');
    }
  }

  async function updateCharts() {
    try {
      const visitors = await fetchVisitors();
      const metrics = buildVisitorMetrics(visitors || []);
      refreshChartData(metrics);
    } catch (error) {
      console.error('Realtime analytics update failed:', error);
    }
  }

  function scheduleUpdateCharts() {
    if (updateTimer) return;

    updateTimer = window.setTimeout(async () => {
      updateTimer = null;
      await updateCharts();
    }, 250);
  }

  await initCharts();

  subscribeVisitors(() => {
    scheduleUpdateCharts();
  });
});
