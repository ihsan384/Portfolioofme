/* ══════════════════════════════════════════
   ADMIN DASHBOARD — Shared JavaScript
   Sidebar, Navbar, Mock Data, Utilities
   ══════════════════════════════════════════ */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
export const supabase = createClient('https://jjhhwabwdujwmobfkidd.supabase.co', 'sb_publishable_jktUaZSFiWECHOlm2dU-HQ_fj_EBsf7');
// ─── Supabase Config (placeholder) ───
const SUPABASE_URL = 'https://jjhhwabwdujwmobfkidd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_jktUaZSFiWECHOlm2dU-HQ_fj_EBsf7';
// const supabase = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── SVG Icons ───
export const icons = {
  dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
  visitors: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  messages: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M22 7l-10 6L2 7"/></svg>`,
  analytics: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  trending: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M22 7l-10 6L2 7"/></svg>`,
  target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
};

// ─── Sidebar + Navbar Injection ───
const ADMIN_EMAIL = "ihsan.anas8281@gmail.com";
export async function buildShell(activePage) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: icons.dashboard, href: 'dashboard.html' },
    { id: 'visitors', label: 'Visitors', icon: icons.visitors, href: 'visitors.html' },
    { id: 'messages', label: 'Messages', icon: icons.messages, href: 'messages.html' },
    { id: 'analytics', label: 'Analytics', icon: icons.analytics, href: 'analytics.html' },
  ];

  const pageTitle = document.querySelector('[data-page-title]')?.dataset.pageTitle || 'Dashboard';

  // Sidebar
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = `
    <div class="sidebar-header">
      <a href="dashboard.html" class="sidebar-logo">
        <div class="logo-icon">P</div>
        <span>Portfolio Admin</span>
      </a>
    </div>
    <nav class="sidebar-nav">
      ${navItems.map(n => `
        <a href="${n.href}" class="nav-item ${n.id === activePage ? 'active' : ''}" id="nav-${n.id}">
          ${n.icon}
          ${n.label}
        </a>
      `).join('')}
    </nav>
    <div class="sidebar-footer">
      © 2026 Portfolio Admin
    </div>
  `;

  // Navbar
  const navbar = document.getElementById('navbar');
  navbar.innerHTML = `
    <div class="navbar-left">
      <button class="menu-toggle" id="menuToggle" aria-label="Toggle menu">
        ${icons.menu}
      </button>
      <h1 class="page-title">${pageTitle}</h1>
    </div>
    <div class="navbar-right">
      <div class="search-box">
        ${icons.search}
        <input type="text" placeholder="Search..." id="globalSearch" />
      </div>
      <div class="admin-profile-dropdown" id="adminProfile">
        <button class="admin-profile admin-profile-trigger" id="profileTrigger" type="button" aria-haspopup="true" aria-expanded="false">
          <div class="admin-avatar">IA</div>
          <span class="admin-name">Ihsan A</span>
        </button>
        <div class="profile-dropdown hidden" id="profileDropdown" role="menu" aria-label="Profile menu">
          <div class="profile-email" id="profileEmail">Loading...</div>
          <button class="btn-sm btn-ghost profile-logout" id="logoutButton" type="button">Logout</button>
        </div>
      </div>
    </div>
  `;

  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.id = 'sidebarOverlay';
  document.body.appendChild(overlay);

  const toggle = document.getElementById('menuToggle');
  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    }
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  });

  const profileTrigger = document.getElementById('profileTrigger');
  const profileDropdown = document.getElementById('profileDropdown');
  const profileEmail = document.getElementById('profileEmail');
  const logoutButton = document.getElementById('logoutButton');

  async function loadProfile() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Load profile failed:', error);
        profileEmail.textContent = 'Unable to load user';
        return;
      }
      const userEmail = data?.user?.email || 'No email';
      profileEmail.textContent = userEmail;
      profileTrigger.setAttribute('aria-label', `Profile menu for ${userEmail}`);
    } catch (error) {
      console.error('Profile fetch failed:', error);
      profileEmail.textContent = 'Unable to load user';
    }
  }

  function closeDropdown() {
    profileDropdown.classList.add('hidden');
    profileDropdown.classList.remove('visible');
    profileTrigger.setAttribute('aria-expanded', 'false');
  }

  function openDropdown() {
    profileDropdown.classList.remove('hidden');
    profileDropdown.classList.add('visible');
    profileTrigger.setAttribute('aria-expanded', 'true');
  }

  function toggleDropdown() {
    if (profileDropdown.classList.contains('hidden')) {
      openDropdown();
    } else {
      closeDropdown();
    }
  }

  async function signOut() {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      window.location.href = '/admin/index.html';
    }
  }

  profileTrigger.addEventListener('click', event => {
    event.stopPropagation();
    toggleDropdown();
  });

  logoutButton.addEventListener('click', async () => {
    await signOut();
  });

  document.addEventListener('click', event => {
    if (!profileDropdown.contains(event.target) && !profileTrigger.contains(event.target)) {
      closeDropdown();
    }
  });

  await loadProfile();
}


// ─── Number Counter Animation ───
export function animateCount(el, target, duration = 1200) {
  const isFloat = String(target).includes('.');
  const start = 0;
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (target - start) * eased;

    if (isFloat) {
      el.textContent = current.toFixed(2) + '%';
    } else {
      el.textContent = Math.floor(current).toLocaleString();
    }

    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// ─── Mock Data ───

// Visitors (last 30 days — daily)
const visitorsDailyData = (() => {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      count: Math.floor(280 + Math.random() * 200 + Math.sin(i / 3) * 80),
    });
  }
  return data;
})();

// Device breakdown
export const deviceData = {
  labels: ['Mobile', 'Desktop', 'Tablet'],
  values: [62, 33, 5],
  colors: ['#a855f7', '#6366f1', '#22d3ee'],
};

// Country breakdown
const countryData = [
  { country: 'India', visitors: 5840, code: 'IN' },
  { country: 'United States', visitors: 2340, code: 'US' },
  { country: 'United Kingdom', visitors: 1120, code: 'GB' },
  { country: 'Germany', visitors: 890, code: 'DE' },
  { country: 'Canada', visitors: 670, code: 'CA' },
  { country: 'Australia', visitors: 540, code: 'AU' },
  { country: 'France', visitors: 420, code: 'FR' },
  { country: 'Japan', visitors: 380, code: 'JP' },
];

// Visitors table rows
const visitorsTable = [
  { device: 'Mobile', browser: 'Chrome', country: 'India', state: 'Kerala', city: 'Kochi', time: '2 min ago' },
  { device: 'Desktop', browser: 'Firefox', country: 'United States', state: 'California', city: 'San Francisco', time: '5 min ago' },
  { device: 'Mobile', browser: 'Safari', country: 'United Kingdom', state: 'England', city: 'London', time: '8 min ago' },
  { device: 'Desktop', browser: 'Chrome', country: 'Germany', state: 'Bavaria', city: 'Munich', time: '12 min ago' },
  { device: 'Tablet', browser: 'Safari', country: 'Australia', state: 'NSW', city: 'Sydney', time: '15 min ago' },
  { device: 'Mobile', browser: 'Chrome', country: 'India', state: 'Karnataka', city: 'Bangalore', time: '18 min ago' },
  { device: 'Desktop', browser: 'Edge', country: 'Canada', state: 'Ontario', city: 'Toronto', time: '22 min ago' },
  { device: 'Mobile', browser: 'Chrome', country: 'India', state: 'Tamil Nadu', city: 'Chennai', time: '25 min ago' },
  { device: 'Desktop', browser: 'Chrome', country: 'United States', state: 'New York', city: 'New York', time: '30 min ago' },
  { device: 'Mobile', browser: 'Samsung', country: 'India', state: 'Maharashtra', city: 'Mumbai', time: '35 min ago' },
  { device: 'Desktop', browser: 'Firefox', country: 'France', state: 'Île-de-France', city: 'Paris', time: '40 min ago' },
  { device: 'Mobile', browser: 'Chrome', country: 'Japan', state: 'Tokyo', city: 'Tokyo', time: '45 min ago' },
  { device: 'Tablet', browser: 'Chrome', country: 'United States', state: 'Texas', city: 'Austin', time: '50 min ago' },
  { device: 'Mobile', browser: 'Safari', country: 'India', state: 'Delhi', city: 'New Delhi', time: '55 min ago' },
  { device: 'Desktop', browser: 'Chrome', country: 'United Kingdom', state: 'Scotland', city: 'Edinburgh', time: '1 hr ago' },
  { device: 'Mobile', browser: 'Chrome', country: 'India', state: 'Gujarat', city: 'Ahmedabad', time: '1.2 hr ago' },
  { device: 'Desktop', browser: 'Brave', country: 'Canada', state: 'BC', city: 'Vancouver', time: '1.5 hr ago' },
  { device: 'Mobile', browser: 'Firefox', country: 'Germany', state: 'Berlin', city: 'Berlin', time: '2 hr ago' },
  { device: 'Desktop', browser: 'Chrome', country: 'Australia', state: 'Victoria', city: 'Melbourne', time: '2.5 hr ago' },
  { device: 'Mobile', browser: 'Chrome', country: 'India', state: 'Rajasthan', city: 'Jaipur', time: '3 hr ago' },
];

// Messages
const messagesData = [
  { name: 'Arjun Nair', email: 'arjun@startup.io', message: 'Hi Ihsan, we loved your portfolio design. Would you be available for a 3-page business website for our SaaS product? Budget is flexible.', time: '10 min ago', read: false },
  { name: 'Sarah Mitchell', email: 'sarah.m@gmail.com', message: 'I need a modern portfolio website with dark theme, animations, and contact form. Can you share your pricing details?', time: '2 hours ago', read: false },
  { name: 'Rahul Sharma', email: 'rahul@techfirm.co', message: 'Great work on the cafe website! We are looking for someone to redesign our company landing page. Are you interested?', time: '5 hours ago', read: false },
  { name: 'Emily Chen', email: 'emily.c@design.co', message: 'Saw your work on Netlify. Clean and professional. Would love to discuss a collaboration on an interior design studio site.', time: '1 day ago', read: true },
  { name: 'Mohammed Ali', email: 'mali@enterprise.ae', message: 'We need an e-commerce front-end for our clothing brand. React + Tailwind preferred. Can you handle the full frontend?', time: '1 day ago', read: true },
  { name: 'Priya Menon', email: 'priya.m@agency.in', message: 'Looking for a developer to build a restaurant website with online ordering. Your cafe project is exactly what we need.', time: '2 days ago', read: true },
  { name: 'James Wilson', email: 'jwilson@corp.uk', message: 'Quick question — do you offer website maintenance packages after the initial build? We need ongoing support.', time: '3 days ago', read: true },
  { name: 'Ananya Reddy', email: 'ananya@freelance.dev', message: 'Fellow developer here. Would you be open to subcontracting on a larger project? Need help with responsive layouts.', time: '4 days ago', read: true },
  { name: 'David Kim', email: 'dkim@studio.kr', message: 'Your admin dashboard UI is impressive. Can you build something similar for our analytics platform? Need a custom dashboard.', time: '5 days ago', read: true },
  { name: 'Fatima Al-Hassan', email: 'fatima@boutique.sa', message: 'I run a boutique fashion brand and need an elegant website. Love the aesthetic of your portfolio. Let us talk!', time: '1 week ago', read: true },
];

// ─── Chart.js Global Config ───
export function configChartDefaults() {
  if (!window.Chart) return;
  Chart.defaults.color = '#5c5e6e';
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.plugins.legend.display = false;
  Chart.defaults.scale.grid = { color: 'rgba(255,255,255,0.04)', drawBorder: false };
  Chart.defaults.scale.border = { display: false };
  Chart.defaults.elements.point.radius = 0;
  Chart.defaults.elements.point.hoverRadius = 5;
  Chart.defaults.elements.point.hoverBackgroundColor = '#818cf8';
  Chart.defaults.elements.line.tension = 0.35;
}

export function formatTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;

  return `${Math.floor(hrs / 24)} day ago`;
}

export async function fetchVisitors() {
  const { data, error } = await supabase
    .from('visitors')
    .select('*')
    .order('visited_at', { ascending: false });

  if (error) {
    console.error('Fetch visitors error:', error);
    return [];
  }

  return data;
}

export function subscribeVisitors(callback) {
  const handleChange = payload => {
    console.log('Visitor change:', payload);
    callback(payload);
  };

  return supabase
    .channel('visitors-realtime')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'visitors',
      },
      handleChange
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'visitors',
      },
      handleChange
    )
    .subscribe();
}

export async function fetchMessages() {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch messages error:', error);
    return [];
  }

  return data;
}

export function subscribeMessages(callback) {
  const handleChange = payload => {
    console.log('Message change:', payload);
    callback(payload);
  };

  return supabase
    .channel('messages-realtime')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      },
      handleChange
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
      },
      handleChange
    )
    .subscribe();
}
export async function requireAuth() {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Require auth session error:', sessionError);
    }

    const session = sessionData?.session;
    if (!session) {
      await supabase.auth.signOut();
      window.location.href = '/admin/index.html';
      return null;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Require auth user error:', userError);
      await supabase.auth.signOut();
      window.location.href = '/admin/index.html';
      return null;
    }

    const user = userData?.user;
    const email = user?.email;
    if (!email || email !== ADMIN_EMAIL) {
      await supabase.auth.signOut();
      alert('Access denied');
      window.location.href = '/admin/index.html';
      return null;
    }

    return user;
  } catch (error) {
    console.error('Require auth failed:', error);
    await supabase.auth.signOut();
    window.location.href = '/admin/index.html';
    return null;
  }
}