/* ==========================================================================
   Frontpage Design System — Shared Components
   Data-driven render functions for mockup pages.
   Requires tokens.css + components.css loaded first.
   ========================================================================== */

// ---------------------------------------------------------------------------
// SVG Constants
// ---------------------------------------------------------------------------

const SVG = {
  // Frontpage logo (customizable fill via argument)
  logo(size = 24, fills = ['url(#f0)', 'url(#f1)', 'url(#f2)']) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 334 334" fill="none">
      <path d="M95 225.903V101L162 62.0968V32L69 86V241L95 225.903Z" fill="${fills[0]}"/>
      <path d="M147 256.903V132L214 93.0968V63L121 117V272L147 256.903Z" fill="${fills[1]}"/>
      <path d="M266 93V129L204 165V198L266 162V198L204 234V284L173 302V147L266 93Z" fill="${fills[2]}"/>
    </svg>`;
  },

  // Logo with default gradient defs (needs unique IDs per instance)
  logoWithGradients(size = 24, prefix = 'f') {
    return `<svg width="${size}" height="${size}" viewBox="0 0 334 334" fill="none">
      <path d="M95 225.903V101L162 62.0968V32L69 86V241L95 225.903Z" fill="url(#${prefix}0)"/>
      <path d="M147 256.903V132L214 93.0968V63L121 117V272L147 256.903Z" fill="url(#${prefix}1)"/>
      <path d="M266 93V129L204 165V198L266 162V198L204 234V284L173 302V147L266 93Z" fill="url(#${prefix}2)"/>
      <defs>
        <linearGradient id="${prefix}0" x1="69" y1="84.5" x2="205.5" y2="167" gradientUnits="userSpaceOnUse"><stop stop-color="#2E05FF"/><stop offset="1" stop-color="#fff"/></linearGradient>
        <linearGradient id="${prefix}1" x1="69" y1="84.5" x2="205.5" y2="167" gradientUnits="userSpaceOnUse"><stop stop-color="#2E05FF"/><stop offset="1" stop-color="#fff"/></linearGradient>
        <linearGradient id="${prefix}2" x1="69" y1="84.5" x2="205.5" y2="167" gradientUnits="userSpaceOnUse"><stop stop-color="#2E05FF"/><stop offset="1" stop-color="#fff"/></linearGradient>
      </defs>
    </svg>`;
  },

  // White logo (for sidebar icons)
  logoWhite(size = 14) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 334 334" fill="white">
      <path d="M95 225.903V101L162 62.0968V32L69 86V241L95 225.903Z"/>
      <path d="M147 256.903V132L214 93.0968V63L121 117V272L147 256.903Z"/>
      <path d="M266 93V129L204 165V198L266 162V198L204 234V284L173 302V147L266 93Z"/>
    </svg>`;
  },

  // Heart icon for votes
  heart(size = 14) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="currentColor"><path d="M8 14s-5.5-4-5.5-7.5C2.5 4 4 2.5 5.5 2.5c1 0 1.9.6 2.5 1.5.6-.9 1.5-1.5 2.5-1.5C12 2.5 13.5 4 13.5 6.5 13.5 10 8 14 8 14z"/></svg>`;
  },
};

// ---------------------------------------------------------------------------
// Shared render helpers
// ---------------------------------------------------------------------------

function icon(name, size = 14, style = '') {
  const s = style ? ` style="${style}"` : '';
  return `<i data-lucide="${name}" style="width:${size}px;height:${size}px;${style}"></i>`;
}

// ---------------------------------------------------------------------------
// Topbar — logo + search left, actions right, no nav tabs
// ---------------------------------------------------------------------------

function renderTopbar({ logoPrefix = 'tb', avatarBg = 'linear-gradient(135deg, var(--indigo-500), var(--accent-primary))', avatarInitials = 'wc', createBtnStyle = '' } = {}) {
  return `<div class="topbar">
    <div class="topbar-left">
      <div class="topbar-logo">
        ${SVG.logoWithGradients(32, logoPrefix)}
      </div>
      <div class="topbar-search-wrapper">
        <input type="search" class="topbar-search" placeholder="Search the atmosphere\u2026" aria-label="Search">
        <div class="topbar-search-shortcut"><kbd>\u2318</kbd><kbd>K</kbd></div>
      </div>
    </div>
    <div class="topbar-actions">
      <button class="btn-create"${createBtnStyle ? ` style="${createBtnStyle}"` : ''}>${icon('plus', 14)} Create</button>
      <div class="topbar-icon">${icon('bell', 18)}</div>
      <div class="avatar" style="background: ${avatarBg};">${avatarInitials}</div>
    </div>
  </div>`;
}

// ---------------------------------------------------------------------------
// Left Sidebar — simple community list, no channels
// ---------------------------------------------------------------------------

function renderSidebarCommunityIcon(community) {
  if (community.icon) {
    return `<div class="community-icon" style="overflow: hidden; padding: 0;">
      <img src="${community.icon}" style="width:100%;height:100%;object-fit:cover;" alt="">
    </div>`;
  }
  if (community.iconGradient) {
    return `<div class="community-icon" style="background: ${community.iconGradient};">
      ${SVG.logoWhite(14)}
    </div>`;
  }
  return `<div class="community-icon" style="background: linear-gradient(135deg, var(--indigo-600), var(--indigo-800));">
    ${SVG.logoWhite(14)}
  </div>`;
}

function renderSidebarItem(community) {
  const isActive = community.active;
  const cls = isActive ? 'sidebar-item active' : 'sidebar-item';

  let badge = '';
  if (community.notif) {
    badge = `<span class="notif">${community.notif}</span>`;
  } else if (community.online) {
    badge = `<span class="online">${community.online}</span>`;
  }

  return `<div class="${cls}" tabindex="0" role="button">
    ${renderSidebarCommunityIcon(community)}
    <span class="sidebar-name">${community.name}</span>
    ${badge}
  </div>`;
}

function renderSidebar(communities) {
  return `<nav class="sidebar" aria-label="Communities">
    <div class="sidebar-label">Your Communities</div>
    ${communities.map(c => renderSidebarItem(c)).join('\n    ')}
    <div class="sidebar-divider"></div>
    <div class="sidebar-action sidebar-create" tabindex="0" role="button">${icon('plus', 16)} <span class="sidebar-action-label">Create a post</span></div>
    <div class="sidebar-action" tabindex="0" role="button">${icon('compass', 16)} <span class="sidebar-action-label">Discover communities</span></div>
    <div class="sidebar-action" tabindex="0" role="button">${icon('plus-circle', 16)} <span class="sidebar-action-label">Create a community</span></div>
    <div class="sidebar-action" tabindex="0" role="button">${icon('settings', 16)} <span class="sidebar-action-label">Settings</span></div>
  </nav>`;
}

// ---------------------------------------------------------------------------
// Community Info Card (right panel)
// ---------------------------------------------------------------------------

function renderCommunityInfoCard(banner) {
  const bgStyle = banner.bannerImage
    ? `background-image: url('${banner.bannerImage}'); background-size: cover; background-position: center;`
    : '';
  return `<div class="community-info-card">
    <div class="community-info-banner" style="${bgStyle}"></div>
    <div class="community-info-body">
      <h2 class="community-info-name">${banner.name}</h2>
      <div class="community-info-stats">
        <span>${icon('users', 12)} ${banner.members} members</span>
        <span>${icon('circle-dot', 12, 'color: var(--accent-success);')} ${banner.online} online</span>
        <span>${icon('calendar', 12)} est. ${banner.established}</span>
      </div>
      <button class="btn-joined">${icon('check', 13)} Joined</button>
    </div>
  </div>`;
}

// ---------------------------------------------------------------------------
// Feed Sort
// ---------------------------------------------------------------------------

function renderFeedSort() {
  return `<div class="feed-sort" role="tablist" aria-label="Sort posts">
    <span class="active" role="tab" tabindex="0" aria-selected="true">${icon('flame', 13)} Hot</span>
    <span role="tab" tabindex="0" aria-selected="false">${icon('clock', 13)} New</span>
    <span role="tab" tabindex="0" aria-selected="false">${icon('trending-up', 13)} Top</span>
  </div>`;
}

// ---------------------------------------------------------------------------
// Feed Post
// ---------------------------------------------------------------------------

function renderFeedPost(post) {
  let badges = '';
  if (post.badges) {
    badges = post.badges.map(b => {
      const bIcon = b.icon ? icon(b.icon, 9) : '';
      return `<span class="badge badge-${b.type}">${bIcon} ${b.label}</span>`;
    }).join(' ');
  }

  let content = '';
  if (post.image) {
    content = `<div class="feed-image">
      <img src="${post.image}" alt="${post.title}">
    </div>`;
  } else if (post.body) {
    content = `<div class="feed-body">${post.body}</div>`;
  }
  if (post.linkPreview) {
    const lp = post.linkPreview;
    content = `<div class="link-preview">
      <img src="${lp.image}" alt="${lp.title}">
      <div class="link-preview-text">
        <div class="link-preview-title">${lp.title}</div>
        <div class="link-preview-domain">${icon('external-link', 10)} ${lp.domain}</div>
      </div>
    </div>`;
  }
  if (post.video) {
    content = `<div class="feed-image" style="position: relative; cursor: pointer;">
      <img src="${post.video.thumbnail}" alt="Video thumbnail">
      <div class="video-overlay">
        <div class="video-play-btn">
          ${icon('play', 24, 'color:var(--bg-base);margin-left:3px;')}
        </div>
      </div>
    </div>`;
  }

  return `<div class="feed-post">
    <div class="feed-content">
      <div class="feed-meta">
        <div class="avatar" style="width:24px;height:24px;font-size:9px;background:${post.avatarBg};">${post.initials}</div>
        <strong style="color: var(--text-primary);">${post.author}</strong>
        ${badges}
        <span>&middot; ${post.time}</span>
      </div>
      <div class="feed-title">${post.title}</div>
      ${content}
      <div class="feed-actions">
        <span class="heart-action">${SVG.heart(16)} ${post.votes}</span>
        <span>${icon('message-circle', 16)} ${post.comments}</span>
        <span>${icon('share-2', 16)} Share</span>
        <span>${icon('bookmark', 16)} Save</span>
      </div>
    </div>
  </div>`;
}

// ---------------------------------------------------------------------------
// Right Sidebar Widgets
// ---------------------------------------------------------------------------

function renderChatWidget(messages) {
  const msgs = messages.map(m => `<div class="chat-msg"><strong>${m.author}</strong> <span>${m.text}</span></div>`).join('\n      ');
  return `<div class="panel-label">${icon('message-circle', 12)} Community Chat</div>
    <div class="chat-messages">
      ${msgs}
    </div>
    <input type="text" class="chat-input" placeholder="Type a message\u2026" aria-label="Chat message">`;
}

function renderTrendingTags(tags) {
  const tagsHtml = tags.map(t =>
    `<span class="tag" style="border-color: ${t.color}; color: ${t.color};">${t.name}</span>`
  ).join('\n      ');
  return `<div class="panel-label">${icon('trending-up', 12)} Trending</div>
    <div style="display: flex; gap: 6px; flex-wrap: wrap;">
      ${tagsHtml}
    </div>`;
}

function renderWikiLinks(links) {
  const linksHtml = links.map(l =>
    `<a href="#" style="color: var(--accent-primary); text-decoration: none;">${l}</a>`
  ).join('\n        ');
  return `<div class="panel-label">${icon('book-open', 12)} Wiki Pages</div>
    <div style="display: flex; flex-direction: column; gap: 6px; font-size: 13px;">
        ${linksHtml}
    </div>`;
}

// ---------------------------------------------------------------------------
// Mobile Components
// ---------------------------------------------------------------------------

function renderPhoneStatus() {
  return `<div class="phone-status"><span>9:41</span><span style="display:flex;gap:4px;">${icon('wifi', 12)}${icon('battery-full', 12)}</span></div>`;
}

function renderMobileHeader(communityName, { communityIcon } = {}) {
  const iconHtml = communityIcon
    ? `<img src="${communityIcon}" style="width:28px;height:28px;border-radius:var(--radius-md);object-fit:cover;" alt="${communityName}">`
    : SVG.logoWithGradients(20, 'mob');

  return `<div class="mobile-header">
    <div class="mobile-header-left">
      ${iconHtml}
      <span>${communityName}</span>
    </div>
  </div>`;
}

function renderMobileSortTabs() {
  return `<div class="mobile-sort" role="tablist" aria-label="Sort posts">
    <span class="active" role="tab" tabindex="0" aria-selected="true">Hot</span>
    <span role="tab" tabindex="0" aria-selected="false">New</span>
    <span role="tab" tabindex="0" aria-selected="false">Top</span>
  </div>`;
}

function renderMobilePost(post) {
  let content = '';
  if (post.image) {
    content = `<div class="mobile-post-image"><img src="${post.mobileImage || post.image}" alt="${post.mobileTitle || post.title}"></div>`;
  } else if (post.body) {
    content = `<div class="mobile-post-body">${post.mobileBody || post.body}</div>`;
  }

  return `<div class="mobile-post">
    <div class="mobile-post-meta">
      <div class="avatar" style="width:22px;height:22px;font-size:8px;background:${post.avatarBg};">${post.initials}</div>
      <span style="font-weight: 600; color: var(--text-primary);">${post.author}</span>
      <span>&middot; ${post.mobileTime || post.time}</span>
    </div>
    <div class="mobile-post-title">${post.mobileTitle || post.title}</div>
    ${content}
    <div class="mobile-post-actions">
      <span class="heart-action">${SVG.heart(13)} ${post.votes}</span>
      <span>&#128172; ${post.comments}</span>
      <span style="margin-left: auto;">${icon('bookmark', 14)}</span>
    </div>
  </div>`;
}

function renderBottomNav(community) {
  const bg = community?.topbar?.avatarBg || 'linear-gradient(135deg, var(--indigo-500), var(--accent-primary))';
  const initials = community?.topbar?.avatarInitials || 'wc';
  return `<div class="phone-bottomnav">
    <div class="phone-bottomnav-item active">${icon('home', 20)}<span>Home</span></div>
    <div class="phone-bottomnav-item">${icon('search', 20)}<span>Search</span></div>
    <div class="phone-bottomnav-actions" onclick="openDrawer(this)">
      <div class="actions-fab">${icon('layers', 20, 'color:white;')}</div>
      <span>Actions</span>
    </div>
    <div class="phone-bottomnav-item">${icon('bell', 20)}<span>Alerts</span></div>
    <div class="phone-bottomnav-item"><div class="avatar" style="width:22px;height:22px;font-size:9px;background:${bg};">${initials}</div><span>Profile</span></div>
  </div>`;
}

// ---------------------------------------------------------------------------
// Mobile Actions Drawer
// ---------------------------------------------------------------------------

function renderDrawer(sidebarCommunities) {
  const communityItems = sidebarCommunities.map(c => {
    const iconHtml = c.icon
      ? `<img src="${c.icon}" style="width:36px;height:36px;border-radius:var(--radius-md);object-fit:cover;" alt="">`
      : `<div style="width:36px;height:36px;border-radius:var(--radius-md);background:${c.iconGradient || 'linear-gradient(135deg, var(--indigo-600), var(--indigo-800))'};display:flex;align-items:center;justify-content:center;">${SVG.logoWhite(14)}</div>`;
    const activeClass = c.active ? ' drawer-item-active' : '';
    const badge = c.notif ? `<span class="drawer-badge">${c.notif}</span>` : '';
    const online = c.online ? `<span class="drawer-online">${c.online} online</span>` : '';
    return `<div class="drawer-item${activeClass}">
      ${iconHtml}
      <span class="drawer-item-name">${c.name}</span>
      ${badge}${online}
    </div>`;
  }).join('\n');

  const actions = [
    { icon: 'plus', label: 'Create a post', color: 'var(--accent-secondary)' },
    { icon: 'compass', label: 'Discover communities', color: 'var(--text-muted)' },
    { icon: 'plus-circle', label: 'Create a community', color: 'var(--text-muted)' },
    { icon: 'settings', label: 'Settings', color: 'var(--text-muted)' },
  ].map(a => `<div class="drawer-item">
      <div class="drawer-action-icon" style="color: ${a.color};">${icon(a.icon, 20)}</div>
      <span class="drawer-item-name">${a.label}</span>
    </div>`).join('\n');

  return `<div class="drawer-backdrop" onclick="closeDrawer(this)">
    <div class="drawer" onclick="event.stopPropagation()">
      <div class="drawer-handle"></div>
      <div class="drawer-section">
        <div class="drawer-label">Your Communities</div>
        ${communityItems}
      </div>
      <div class="drawer-divider"></div>
      <div class="drawer-section">
        <div class="drawer-label">Actions</div>
        ${actions}
      </div>
    </div>
  </div>`;
}

function toggleSidebar() {
  document.getElementById('app').classList.toggle('sidebar-expanded');
}

function openDrawer(el) {
  const backdrop = el.closest('.phone-frame').querySelector('.drawer-backdrop');
  backdrop.classList.add('open');
  // Re-render icons inside the drawer
  requestAnimationFrame(() => lucide.createIcons());
}

function closeDrawer(el) {
  el.closest('.drawer-backdrop').classList.remove('open');
}

function handleDrawerClick(e) {
  e.stopPropagation();
  const item = e.target.closest('.drawer-item[data-community]');
  if (item) {
    const app = document.getElementById('app');
    const backdrop = app.querySelector('.drawer-backdrop');
    if (backdrop) backdrop.classList.remove('open');
    app.classList.remove('drawer-open');
    switchCommunity(parseInt(item.dataset.community));
  }
}

// ---------------------------------------------------------------------------
// Full Community Mockup Renderer
// ---------------------------------------------------------------------------

function renderCommunityMockup(community) {
  const c = community;

  // Desktop posts
  const postsHtml = c.posts.map(p => renderFeedPost(p)).join('\n          ');

  // Community info card for right panel
  const communityInfoHtml = renderCommunityInfoCard(c.banner);

  // Desktop right sidebar widgets
  const rightSidebarHtml = c.rightSidebar.join('\n        ');

  // Mobile — find active community icon for header
  const activeCommunity = c.sidebar.find(s => s.active);
  const communityIcon = activeCommunity?.icon || null;

  // Mobile posts (show first 2)
  const mobilePosts = (c.mobilePosts || c.posts.slice(0, 2)).map(p => renderMobilePost(p)).join('\n      ');

  // Theme style overrides
  const themeStyle = c.theme ? Object.entries(c.theme).map(([k, v]) => `${k}: ${v};`).join('\n  ') : '';

  // Section label
  const labelHtml = c.label
    ? `<div style="padding: 32px 24px 8px; font-size: 12px; font-weight: 600; letter-spacing: 1px; color: var(--text-muted); text-transform: uppercase;">${c.label}</div>`
    : '';

  // Mobile theme style
  const mobileThemeStyle = c.theme
    ? Object.entries(c.theme).map(([k, v]) => `${k}:${v}`).join(';')
    : '';

  return `
<!-- ===== ${c.name.toUpperCase()} ===== -->
<div class="mockup-desktop">
${labelHtml}
<div class="mockup-frame"${themeStyle ? ` style="${themeStyle}"` : ''}>
  ${renderTopbar(c.topbar || {})}
  ${renderFeedSort()}
  <div class="app-body">
    ${renderSidebar(c.sidebar)}
    <div class="center">
      <div class="feed-container">
        ${postsHtml}
      </div>
      ${c.presenceHtml || ''}
    </div>
    <div class="right-panel">
      ${communityInfoHtml}
      <div class="panel-divider"></div>
      ${rightSidebarHtml}
    </div>
  </div>
</div>
</div>

<div class="mockup-mobile">
  <div class="phone-frame"${mobileThemeStyle ? ` style="${mobileThemeStyle}"` : ''}>
    ${renderPhoneStatus()}
    ${renderMobileHeader(c.name, { communityIcon })}
    ${renderMobileSortTabs()}
    <div style="background: var(--bg-base); padding: 12px;">
      ${mobilePosts}
    </div>
    ${renderDrawer(c.sidebar)}
    ${renderBottomNav()}
  </div>
</div>`;
}

// ---------------------------------------------------------------------------
// View Toggle
// ---------------------------------------------------------------------------

function setView(mode) {
  document.body.classList.toggle('mobile-view', mode === 'mobile');
  document.querySelectorAll('.view-toggle button').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim().toLowerCase().startsWith(mode));
  });
  lucide.createIcons();
}

// ===========================================================================
// Interactive App
// ===========================================================================

let APP_COMMUNITIES = [];
let APP_CURRENT = 0;

function initApp(communities) {
  APP_COMMUNITIES = communities;
  APP_COMMUNITIES.forEach(c => {
    c.posts.forEach(p => { p.liked = false; });
  });
  renderApp();

  document.getElementById('app').addEventListener('click', handleAppClick);
}

function handleAppClick(e) {
  const heart = e.target.closest('.heart-action');
  if (heart) { toggleHeart(heart); return; }

  const bookmark = e.target.closest('.bookmark-action');
  if (bookmark) { bookmark.classList.toggle('saved'); return; }

  const sort = e.target.closest('#app .feed-sort [role="tab"]');
  if (sort) {
    const sortType = sort.dataset.sort || sort.textContent.trim().toLowerCase();
    // Return to feed view if a secondary tab is active
    const center = sort.closest('.center');
    if (center) {
      center.querySelectorAll('.content-tab').forEach(t => t.classList.remove('active'));
      center.querySelectorAll('.content-tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === 'posts'));
    }
    switchSort(sortType);
    return;
  }

  const sidebarItem = e.target.closest('.sidebar-item[data-community]');
  if (sidebarItem) {
    switchCommunity(parseInt(sidebarItem.dataset.community));
    return;
  }

  const drawerItem = e.target.closest('.drawer-item[data-community]');
  if (drawerItem) {
    const backdrop = document.querySelector('#app > .drawer-backdrop');
    backdrop.classList.remove('open');
    switchCommunity(parseInt(drawerItem.dataset.community));
    return;
  }

  const actionsBtn = e.target.closest('.phone-bottomnav-actions');
  if (actionsBtn) {
    const backdrop = document.querySelector('#app > .drawer-backdrop');
    backdrop.classList.add('open');
    document.getElementById('app').classList.add('drawer-open');
    requestAnimationFrame(() => lucide.createIcons());
    return;
  }

  if (e.target.classList.contains('drawer-backdrop')) {
    e.target.classList.remove('open');
    document.getElementById('app').classList.remove('drawer-open');
    return;
  }

  const contentTab = e.target.closest('.content-tab[data-tab]');
  if (contentTab) {
    const tabName = contentTab.dataset.tab;
    const center = contentTab.closest('.center');
    const tabs = center.querySelector('.content-tabs');
    const isActive = contentTab.classList.contains('active');
    if (isActive) {
      contentTab.classList.remove('active');
      tabs.classList.remove('secondary-active');
      center.querySelectorAll('.content-tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === 'posts'));
      positionSortBlobs(false);
    } else {
      center.querySelectorAll('.content-tab').forEach(t => t.classList.remove('active'));
      contentTab.classList.add('active');
      tabs.classList.add('secondary-active');
      center.querySelectorAll('.content-tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === tabName));
    }
    lucide.createIcons();
    return;
  }

  // "Back to posts" button
  const backBtn = e.target.closest('[data-action="back-to-posts"]');
  if (backBtn) {
    const center = backBtn.closest('.center');
    const tabs = center.querySelector('.content-tabs');
    tabs.classList.remove('secondary-active');
    center.querySelectorAll('.content-tab').forEach(t => t.classList.remove('active'));
    center.querySelectorAll('.content-tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === 'posts'));
    positionSortBlobs(false);
    lucide.createIcons();
    return;
  }
}

function toggleHeart(el) {
  const isLiked = el.classList.toggle('liked');
  el.classList.remove('heart-pop');
  void el.offsetWidth;
  if (isLiked) {
    el.classList.add('heart-pop');
    spawnHeartParticles(el);
  }
}

function spawnHeartParticles(el) {
  const svg = el.querySelector('svg');
  const rect = svg.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const count = 7;
  const colors = [
    'oklch(60% 0.24 15)',
    'oklch(65% 0.22 350)',
    'oklch(55% 0.2 20)',
    'oklch(70% 0.18 10)',
    'oklch(58% 0.26 25)',
    'oklch(68% 0.2 340)',
    'oklch(50% 0.22 15)',
  ];

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'heart-particle';
    particle.innerHTML = SVG.heart(8 + Math.random() * 8);

    const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.6;
    const distance = 25 + Math.random() * 30;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance - 12;
    const scale = 0.3 + Math.random() * 0.7;
    const rotation = (Math.random() - 0.5) * 90;
    const duration = 0.9 + Math.random() * 0.4;

    particle.style.cssText = `
      position: fixed;
      left: ${cx}px;
      top: ${cy}px;
      pointer-events: none;
      z-index: 1000;
      color: ${colors[i % colors.length]};
      animation: heart-float ${duration}s ease-out forwards;
      --hx: ${x}px;
      --hy: ${y}px;
      --hs: ${scale};
      --hr: ${rotation}deg;
    `;

    document.body.appendChild(particle);
    particle.addEventListener('animationend', () => particle.remove());
  }
}

let APP_SORT = 'hot';

function parseVotes(v) {
  if (typeof v === 'number') return v;
  const s = String(v).toLowerCase().replace(/,/g, '');
  if (s.endsWith('k')) return parseFloat(s) * 1000;
  return parseFloat(s) || 0;
}

function parseTime(t) {
  const m = t.match(/(\d+)\s*(m|h|d)/);
  if (!m) return 0;
  const val = parseInt(m[1]);
  if (m[2] === 'm') return val;
  if (m[2] === 'h') return val * 60;
  if (m[2] === 'd') return val * 1440;
  return 0;
}

function sortPosts(posts, sortType) {
  const sorted = [...posts];
  if (sortType === 'hot') {
    // Hot = votes weighted by recency
    sorted.sort((a, b) => {
      const aScore = parseVotes(a.votes) / (1 + parseTime(a.time) / 60);
      const bScore = parseVotes(b.votes) / (1 + parseTime(b.time) / 60);
      return bScore - aScore;
    });
  } else if (sortType === 'new') {
    sorted.sort((a, b) => parseTime(a.time) - parseTime(b.time));
  } else if (sortType === 'top') {
    sorted.sort((a, b) => parseVotes(b.votes) - parseVotes(a.votes));
  }
  return sorted;
}

function switchSort(sortType) {
  const sort = document.querySelector('#app .feed-sort');
  const oldActive = sort?.querySelector('span.active');
  const newTarget = sort?.querySelector(`[data-sort="${sortType}"]`);
  const main = document.getElementById('sort-blob-main');
  const trail = document.getElementById('sort-blob-trail');

  if (!main || !trail || !sort || !oldActive || !newTarget || oldActive === newTarget) {
    APP_SORT = sortType;
    renderApp();
    return;
  }

  const sortRect = sort.getBoundingClientRect();
  const newRect = newTarget.getBoundingClientRect();
  const newLeft = (newRect.left - sortRect.left) + 'px';
  const newWidth = newRect.width + 'px';

  // Update tab text colors
  oldActive.classList.remove('active');
  newTarget.classList.add('active');

  // Go round for the goo motion
  main.classList.remove('settled');
  trail.classList.remove('settled');

  // Main blob arrives fast
  main.style.transition = 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.15s ease';
  main.style.left = newLeft;
  main.style.width = newWidth;

  // Trail blob follows slower — goo filter stretches them together
  trail.style.transition = 'left 0.5s cubic-bezier(0.2, 0, 0, 1), width 0.4s cubic-bezier(0.2, 0, 0, 1), border-radius 0.15s ease';
  trail.style.left = newLeft;
  trail.style.width = newWidth;

  APP_SORT = sortType;

  // Re-render posts immediately (blob animation continues independently)
  const feedContainer = document.querySelector('#app .feed-container');
  if (feedContainer) {
    const sorted = sortPosts(APP_COMMUNITIES[APP_CURRENT].posts, APP_SORT);
    feedContainer.innerHTML = sorted.map((p, i) => renderInteractivePost(p, i)).join('\n');
    lucide.createIcons();
  }

  // Settle blob back into button shape after animation
  setTimeout(() => {
    main.classList.add('settled');
    trail.classList.add('settled');
    main.style.transition = 'border-radius 0.25s ease';
    trail.style.transition = 'border-radius 0.25s ease';
  }, 500);
}

function switchCommunity(index) {
  if (index === APP_CURRENT) return;
  const body = document.querySelector('#app .app-body');
  if (body) {
    body.classList.add('fade-out');
    setTimeout(() => {
      APP_CURRENT = index;
      APP_SORT = 'hot';
      renderApp();
    
    }, 250);
  } else {
    APP_CURRENT = index;
    APP_SORT = 'hot';
    renderApp();
  
  }
}


// App logos as inline SVGs
const ATMO_LOGOS = {
  bluesky: (size = 14) => `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="currentColor"><path d="M3.468 1.948C5.303 3.325 7.276 6.118 8 7.616c.725-1.498 2.698-4.29 4.532-5.668C13.855.955 16 .186 16 2.632c0 .489-.28 4.105-.444 4.692-.572 2.04-2.653 2.561-4.504 2.246 3.236.551 4.06 2.375 2.281 4.2-3.376 3.464-4.852-.87-5.23-1.98-.07-.204-.103-.3-.103-.218 0-.081-.033.014-.102.218-.379 1.11-1.855 5.444-5.231 1.98-1.778-1.825-.955-3.65 2.28-4.2-1.85.315-3.932-.205-4.503-2.246C.28 6.737 0 3.12 0 2.632 0 .186 2.145.955 3.468 1.948"/></svg>`,
  whitewind: (size = 14) => `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4h12M2 8h8M2 12h10"/></svg>`,
  smokesignal: (size = 14) => `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a3 3 0 0 0-3 3c0 2 3 4 3 4s3-2 3-4a3 3 0 0 0-3-3zm0 4.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM3 10c0 0 1-1 5-1s5 1 5 1v1H3v-1zM2 12h12v2H2v-2z"/></svg>`,
};

// Shared source attribution — one place to change for all atmosphere cards
const ATMO_SOURCES = {
  bluesky:     { logo: ATMO_LOGOS.bluesky,     color: 'oklch(60% 0.15 220)', name: 'Bluesky',      domain: 'bsky.app' },
  whitewind:   { logo: ATMO_LOGOS.whitewind,    color: 'oklch(55% 0.12 220)', name: 'WhiteWind',    domain: 'whtwnd.com' },
  smokesignal: { logo: () => icon('flame', 11), color: 'oklch(60% 0.15 25)',  name: 'Smoke Signal', domain: 'smokesignal.events' },
};

function atmoSourceTag(appKey) {
  const s = ATMO_SOURCES[appKey];
  return `<div class="atmo-source-tag"><span class="atmo-source-logo" style="color:${s.color};">${s.logo(12)}</span><span class="atmo-source-name">${s.name}</span></div>`;
}

function renderAtmoBluesky(a, i, featured) {
  const cls = featured ? 'atmo-item-wrap atmo-card-bsky atmo-featured' : 'atmo-item-wrap atmo-card-bsky';
  return `<div class="${cls}" style="animation-delay:${i * 0.06}s">
    <div class="atmo-bsky">
      <div class="atmo-bsky-top">
        ${atmoSourceTag('bluesky')}
        <span class="atmo-bsky-time">${a.time}</span>
      </div>
      <div class="atmo-bsky-content">
        <div class="atmo-bsky-text">${a.text}</div>
      </div>
      <div class="atmo-bsky-footer">
        <div class="atmo-bsky-author">
          <div class="avatar" style="width:20px;height:20px;font-size:9px;background:${a.avatarBg};">${a.avatar}</div>
          <span class="atmo-bsky-name">${a.displayName}</span>
          <span class="atmo-bsky-handle">${a.handle}</span>
        </div>
        <div class="atmo-bsky-stats">
          <span>${icon('heart', 13)} ${a.likes}</span>
          <span>${icon('repeat-2', 13)} ${a.reposts}</span>
          <span>${icon('message-circle', 13)} ${a.replies}</span>
        </div>
      </div>
    </div>
  </div>`;
}

function renderAtmoWhiteWind(a, i) {
  return `<div class="atmo-item-wrap atmo-card-ww" style="animation-delay:${i * 0.06}s">
    <div class="atmo-ww">
      <div class="atmo-ww-top">
        ${atmoSourceTag('whitewind')}
        <span class="atmo-ww-read">${a.readTime}</span>
      </div>
      <div class="atmo-ww-body">
        <div class="atmo-ww-title">${a.title}</div>
        ${a.subtitle ? `<div class="atmo-ww-subtitle">${a.subtitle}</div>` : ''}
      </div>
      <div class="atmo-ww-footer">
        <div class="atmo-ww-author">
          <div class="avatar" style="width:20px;height:20px;font-size:9px;background:${a.avatarBg};">${a.avatar}</div>
          <span>${a.displayName}</span>
        </div>
        <span class="atmo-ww-date">${a.date}</span>
      </div>
    </div>
  </div>`;
}

function renderAtmoSmokeSignal(a, i) {
  const goingClass = a.going ? ' atmo-ss-going' : '';
  return `<div class="atmo-item-wrap atmo-card-ss atmo-wide" style="animation-delay:${i * 0.06}s">
    <div class="atmo-ss">
      <div class="atmo-ss-left">
        <div class="atmo-ss-date-block">
          <div class="atmo-ss-month">${a.date.split(' ')[0]}</div>
          <div class="atmo-ss-day">${a.date.split(' ')[1].replace(',', '')}</div>
        </div>
      </div>
      <div class="atmo-ss-body">
        <div class="atmo-ss-top">
          ${atmoSourceTag('smokesignal')}
        </div>
        <div class="atmo-ss-title">${a.title}</div>
        <div class="atmo-ss-details">
          <span>${icon('clock', 12)} ${a.time}</span>
          <span>${icon('map-pin', 12)} ${a.location}</span>
        </div>
        <div class="atmo-ss-bottom">
          <span class="atmo-ss-rsvp-count">${icon('users', 12)} ${a.rsvps} going</span>
          <button class="atmo-ss-rsvp${goingClass}">${a.going ? icon('check', 12) + ' Going' : 'RSVP'}</button>
        </div>
      </div>
    </div>
  </div>`;
}

function renderAtmosphereFeed(community) {
  let firstBsky = true;
  const items = (community.atmosphere || []).map((a, i) => {
    if (a.app === 'Bluesky') {
      const featured = firstBsky;
      firstBsky = false;
      return renderAtmoBluesky(a, i, featured);
    }
    if (a.app === 'WhiteWind') return renderAtmoWhiteWind(a, i);
    if (a.app === 'Smoke Signal') return renderAtmoSmokeSignal(a, i);
    return '';
  }).join('\n');

  return `<div class="atmo-feed">
    <div class="atmo-feed-items">
      ${items}
    </div>
  </div>`;
}

function renderWikiPage(community) {
  const c = community;
  const w = c.wiki || {};
  const banner = c.banner;

  const rulesHtml = (w.rules || []).map((r, i) =>
    `<li><span class="wiki-rule-num">${i + 1}</span>${r}</li>`
  ).join('\n');

  const linksHtml = (w.links || []).map(l =>
    `<a href="#" class="wiki-link-item">${icon('file-text', 14)} ${l}</a>`
  ).join('\n');

  const tagsHtml = (w.tags || []).map(t =>
    `<span class="tag" style="border-color: ${t.color}; color: ${t.color};">${t.name}</span>`
  ).join('\n');

  const modsHtml = (w.mods || []).map(m =>
    `<div class="wiki-mod">
      <div class="avatar" style="width:28px;height:28px;font-size:10px;background:${m.bg};">${m.initials}</div>
      <span>${m.name}</span>
    </div>`
  ).join('\n');

  const bannerBg = banner.bannerImage
    ? `background-image: url('${banner.bannerImage}'); background-size: cover; background-position: center;`
    : '';

  return `<div class="wiki-page">
    <div class="wiki-hero" style="${bannerBg}">
      <div class="wiki-hero-overlay">
        <div>
          <h1 class="wiki-hero-title">${banner.name}</h1>
          <div class="wiki-hero-stats">
            ${icon('users', 14)} ${banner.members} members
            <span class="wiki-hero-sep">&middot;</span>
            ${icon('circle-dot', 14, 'color: var(--accent-success);')} ${banner.online} online
            <span class="wiki-hero-sep">&middot;</span>
            ${icon('calendar', 14)} est. ${banner.established}
          </div>
        </div>
        <div class="wiki-hero-actions">
          <button class="btn-joined">${icon('check', 13)} Joined</button>
        </div>
      </div>
    </div>
    <div class="wiki-body">
      <div class="wiki-main">
        <section class="wiki-section">
          <h2 class="wiki-section-title">${icon('info', 16)} About</h2>
          <p class="wiki-about">${w.about || ''}</p>
        </section>
        <section class="wiki-section">
          <h2 class="wiki-section-title">${icon('scroll', 16)} Rules</h2>
          <ol class="wiki-rules">${rulesHtml}</ol>
        </section>
        <section class="wiki-section">
          <h2 class="wiki-section-title">${icon('book-open', 16)} Pages</h2>
          <div class="wiki-links">${linksHtml}</div>
        </section>
      </div>
      <div class="wiki-aside">
        <section class="wiki-section">
          <h2 class="wiki-section-title">${icon('shield', 16)} Moderators</h2>
          <div class="wiki-mods">${modsHtml}</div>
        </section>
        <section class="wiki-section">
          <h2 class="wiki-section-title">${icon('hash', 16)} Tags</h2>
          <div class="wiki-tags">${tagsHtml}</div>
        </section>
      </div>
    </div>
  </div>`;
}

function renderApp() {
  const c = APP_COMMUNITIES[APP_CURRENT];
  const app = document.getElementById('app');

  // Apply or reset theme
  const themeProps = ['--bg-base','--bg-surface','--bg-elevated','--bg-overlay','--bg-interactive',
    '--text-primary','--text-secondary','--text-muted','--accent-primary','--accent-secondary'];
  if (c.theme) {
    Object.entries(c.theme).forEach(([k, v]) => app.style.setProperty(k, v));
  } else {
    themeProps.forEach(p => app.style.removeProperty(p));
  }

  // Active community icon
  const communityIcon = c.icon || null;

  // Build sidebar from all communities — collapsible icon rail
  const sidebarItems = APP_COMMUNITIES.map((comm, i) => {
    const isActive = i === APP_CURRENT;
    const cls = isActive ? 'sidebar-item active' : 'sidebar-item';
    const iconUrl = comm.icon;
    const iconHtml = iconUrl
      ? `<div class="community-icon" style="overflow:hidden;padding:0;"><img src="${iconUrl}" style="width:100%;height:100%;object-fit:cover;" alt=""></div>`
      : `<div class="community-icon" style="background:linear-gradient(135deg, var(--indigo-600), var(--indigo-800));">${SVG.logoWhite(14)}</div>`;
    const badge = comm.notif ? `<span class="notif">${comm.notif}</span>` : '';
    return `<div class="${cls}" tabindex="0" role="button" data-community="${i}" data-tooltip="${comm.name}">
      ${iconHtml}
      <span class="sidebar-name">${comm.name}</span>
      ${badge}
    </div>`;
  }).join('\n');

  const sidebarHtml = `<nav class="sidebar" aria-label="Communities">
    <div class="sidebar-toggle" tabindex="0" role="button" onclick="toggleSidebar()" data-tooltip="Toggle sidebar">${icon('chevron-right', 16)}</div>
    <div class="sidebar-label">Your Communities</div>
    ${sidebarItems}
    <div class="sidebar-divider"></div>
    <div class="sidebar-action sidebar-create" tabindex="0" role="button" data-tooltip="Create a post">${icon('plus', 20)} <span class="sidebar-action-label">Create a post</span></div>
    <div class="sidebar-action" tabindex="0" role="button" data-tooltip="Discover">${icon('compass', 20)} <span class="sidebar-action-label">Discover communities</span></div>
    <div class="sidebar-action" tabindex="0" role="button" data-tooltip="Create community">${icon('plus-circle', 20)} <span class="sidebar-action-label">Create a community</span></div>
    <div class="sidebar-action" tabindex="0" role="button" data-tooltip="Settings">${icon('settings', 20)} <span class="sidebar-action-label">Settings</span></div>
    <div class="sidebar-spacer"></div>
    <div class="sidebar-action" tabindex="0" role="button" data-tooltip="Notifications">${icon('bell', 20)} <span class="sidebar-action-label">Notifications</span></div>
    <div class="sidebar-action sidebar-profile" tabindex="0" role="button" data-tooltip="Profile">
      <div class="avatar" style="width:32px;height:32px;font-size:12px;background:${c.topbar?.avatarBg || 'linear-gradient(135deg, var(--indigo-500), var(--accent-primary))'};">${c.topbar?.avatarInitials || 'wc'}</div>
      <span class="sidebar-action-label">Profile</span>
    </div>
  </nav>`;

  // Posts (sorted)
  const sorted = sortPosts(c.posts, APP_SORT);
  const postsHtml = sorted.map((p, i) => renderInteractivePost(p, i)).join('\n');

  // Wiki + atmosphere content
  const wikiHtml = renderWikiPage(c);
  const atmoHtml = renderAtmosphereFeed(c);

  // Drawer communities
  const drawerItems = APP_COMMUNITIES.map((comm, i) => {
    const iconUrl = comm.icon;
    const iconHtml = iconUrl
      ? `<img src="${iconUrl}" style="width:36px;height:36px;border-radius:var(--radius-md);object-fit:cover;" alt="">`
      : `<div style="width:36px;height:36px;border-radius:var(--radius-md);background:linear-gradient(135deg,var(--indigo-600),var(--indigo-800));display:flex;align-items:center;justify-content:center;">${SVG.logoWhite(14)}</div>`;
    const activeClass = i === APP_CURRENT ? ' drawer-item-active' : '';
    return `<div class="drawer-item${activeClass}" data-community="${i}">
      ${iconHtml}
      <span class="drawer-item-name">${comm.name}</span>
    </div>`;
  }).join('\n');

  const drawerActions = [
    { ic: 'plus', label: 'Create a post', color: 'var(--accent-secondary)' },
    { ic: 'compass', label: 'Discover communities', color: 'var(--text-muted)' },
    { ic: 'plus-circle', label: 'Create a community', color: 'var(--text-muted)' },
    { ic: 'settings', label: 'Settings', color: 'var(--text-muted)' },
  ].map(a => `<div class="drawer-item">
    <div class="drawer-action-icon" style="color:${a.color};">${icon(a.ic, 20)}</div>
    <span class="drawer-item-name">${a.label}</span>
  </div>`).join('\n');

  app.innerHTML = `
    <div class="mobile-header">
      <div class="mobile-header-left">
        ${communityIcon ? `<img src="${communityIcon}" style="width:28px;height:28px;border-radius:var(--radius-md);object-fit:cover;" alt="${c.name}">` : SVG.logoWithGradients(20, 'mob')}
        <span>${c.name}</span>
      </div>
    </div>

    <div class="app-logo">${SVG.logoWithGradients(28, 'app')}</div>
    <div class="sidebar-scrim" onclick="toggleSidebar()"></div>
    <div class="app-body">
      ${sidebarHtml}
      <main class="center">
        <div class="content-tabs">
          <div class="content-tabs-back" data-action="back-to-posts">${icon('arrow-left', 14)} Posts</div>
          <div class="feed-sort" role="tablist" aria-label="Sort posts">
            <div class="feed-sort-goo">
              <div class="feed-sort-blob settled" id="sort-blob-main"></div>
              <div class="feed-sort-blob settled" id="sort-blob-trail"></div>
            </div>
            <span class="${APP_SORT === 'hot' ? 'active' : ''}" role="tab" tabindex="0" aria-selected="${APP_SORT === 'hot'}" data-sort="hot">${icon('flame', 14)} Hot</span>
            <span class="${APP_SORT === 'new' ? 'active' : ''}" role="tab" tabindex="0" aria-selected="${APP_SORT === 'new'}" data-sort="new">${icon('clock', 14)} New</span>
            <span class="${APP_SORT === 'top' ? 'active' : ''}" role="tab" tabindex="0" aria-selected="${APP_SORT === 'top'}" data-sort="top">${icon('trending-up', 14)} Top</span>
          </div>
          <div class="content-tabs-secondary">
            <div class="content-tab" data-tab="atmo" title="Atmosphere">${icon('at-sign', 18)}</div>
            <div class="content-tab" data-tab="wiki" title="Wiki">${icon('book-open', 18)}</div>
            <div class="feed-search-wrapper">
              <input type="search" class="feed-search" placeholder="Search\u2026" aria-label="Search">
              <div class="feed-search-shortcut"><kbd>\u2318</kbd><kbd>K</kbd></div>
            </div>
          </div>
        </div>
        <div class="content-tab-panel active" data-panel="posts">
          <div class="feed-container">
            ${postsHtml}
          </div>
        </div>
        <div class="content-tab-panel" data-panel="atmo">
          ${atmoHtml}
        </div>
        <div class="content-tab-panel" data-panel="wiki">
          ${wikiHtml}
        </div>
      </main>
    </div>

    <div class="drawer-backdrop">
      <div class="drawer" onclick="handleDrawerClick(event)">
        <div class="drawer-handle"></div>
        <div class="drawer-section">
          <div class="drawer-label">Your Communities</div>
          ${drawerItems}
        </div>
        <div class="drawer-divider"></div>
        <div class="drawer-section">
          <div class="drawer-label">Actions</div>
          ${drawerActions}
        </div>
      </div>
    </div>

    <div class="phone-bottomnav">
      <div class="phone-bottomnav-item active">${icon('home', 20)}<span>Home</span></div>
      <div class="phone-bottomnav-item">${icon('search', 20)}<span>Search</span></div>
      <div class="phone-bottomnav-actions">
        <div class="actions-fab">${icon('layers', 20, 'color:white;')}</div>
        <span>Actions</span>
      </div>
      <div class="phone-bottomnav-item">${icon('bell', 20)}<span>Alerts</span></div>
      <div class="phone-bottomnav-item"><div class="avatar" style="width:22px;height:22px;font-size:9px;background:${c.topbar?.avatarBg || 'linear-gradient(135deg, var(--indigo-500), var(--accent-primary))'};">${c.topbar?.avatarInitials || 'wc'}</div><span>Profile</span></div>
    </div>
  `;

  lucide.createIcons();
  positionSortBlobs(false);
}

function positionSortBlobs(animate = true) {
  const sort = document.querySelector('#app .feed-sort');
  const active = sort?.querySelector('span.active');
  const main = document.getElementById('sort-blob-main');
  const trail = document.getElementById('sort-blob-trail');
  if (!sort || !active || !main || !trail) return;

  const sortRect = sort.getBoundingClientRect();
  const activeRect = active.getBoundingClientRect();
  const left = (activeRect.left - sortRect.left) + 'px';
  const width = activeRect.width + 'px';

  if (!animate) {
    main.style.transition = 'none';
    trail.style.transition = 'none';
  }
  main.style.left = left;
  main.style.width = width;
  trail.style.left = left;
  trail.style.width = width;
  if (!animate) {
    requestAnimationFrame(() => {
      main.style.transition = '';
      trail.style.transition = '';
    });
  }
}

function renderInteractivePost(post, index) {
  let badges = '';
  if (post.badges) {
    badges = post.badges.map(b => {
      const bIcon = b.icon ? icon(b.icon, 9) : '';
      return `<span class="badge badge-${b.type}">${bIcon} ${b.label}</span>`;
    }).join(' ');
  }

  let content = '';
  if (post.image) {
    content = `<div class="feed-image"><img src="${post.image}" alt="${post.title}"></div>`;
  } else if (post.body) {
    content = `<div class="feed-body">${post.body}</div>`;
  }
  if (post.linkPreview) {
    const lp = post.linkPreview;
    content = `<div class="link-preview">
      <img src="${lp.image}" alt="${lp.title}">
      <div class="link-preview-text">
        <div class="link-preview-title">${lp.title}</div>
        <div class="link-preview-domain">${icon('external-link', 10)} ${lp.domain}</div>
      </div>
    </div>`;
  }
  if (post.video) {
    content = `<div class="feed-image" style="position:relative;cursor:pointer;">
      <img src="${post.video.thumbnail}" alt="Video thumbnail">
      <div class="video-overlay">
        <div class="video-play-btn">${icon('play', 24, 'color:var(--bg-base);margin-left:3px;')}</div>
      </div>
    </div>`;
  }

  const likedClass = post.liked ? ' liked' : '';
  const delay = typeof index === 'number' ? ` style="animation-delay:${index * 0.12}s"` : '';

  return `<div class="feed-post"${delay}>
    <div class="feed-content">
      <div class="feed-meta">
        <div class="avatar" style="width:24px;height:24px;font-size:9px;background:${post.avatarBg};">${post.initials}</div>
        <strong style="color:var(--text-primary);">${post.author}</strong>
        ${badges}
        <span>&middot; ${post.time}</span>
      </div>
      <div class="feed-title">${post.title}</div>
      ${content}
      <div class="feed-actions">
        <span class="heart-action${likedClass}">${SVG.heart(16)} <span class="heart-count">${post.votes}</span></span>
        <span>${icon('message-circle', 16)} ${post.comments}</span>
        <span>${icon('share-2', 16)} Share</span>
        <span class="bookmark-action">${icon('bookmark', 16)} Save</span>
      </div>
    </div>
  </div>`;
}
