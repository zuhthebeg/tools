/**
 * tool-nav.js — Global tool navigation for tool.cocy.io
 * Usage: <script src="/lib/tool-nav.js"></script>
 * Injects a floating toggle button + slide-in drawer on the right side.
 */
(function () {
  'use strict';

  const useEn = () => !!(window.I18n && window.I18n.lang !== 'ko');
  const labelOf = (tool) => (useEn() && tool.en) || tool.label;

  const TOOLS = [
    { id: 'tokenizer',  emoji: '🤖', label: 'LLM 토큰',    en: 'LLM Tokens', url: '/tokenizer/' },
    { id: 'aicheck',    emoji: '🧠', label: 'AI 체커',     en: 'AI Checker', url: '/aicheck/' },
    { id: 'vtest',      emoji: '🔬', label: 'AI 비전',     en: 'AI Vision', url: '/vtest/' },
    { id: 'json',       emoji: '{ }', label: 'JSON',       url: '/json/' },
    { id: 'bgremove',   emoji: '✂️', label: '배경 제거',   en: 'BG Remover', url: '/bgremove/' },
    { id: 'jwt',        emoji: '🔑', label: 'JWT',         url: '/jwt/' },
    { id: 'base64',     emoji: '🔐', label: 'Base64',      url: '/base64/' },
    { id: 'url',        emoji: '🔗', label: 'URL',         url: '/url/' },
    { id: 'unicodedec', emoji: '🔣', label: '유니코드',    en: 'Unicode', url: '/unicodedec/' },
    { id: 'qr',         emoji: '📷', label: 'QR코드',      en: 'QR Code', url: '/qr/' },
    { id: 'color',      emoji: '🎨', label: '색상',        en: 'Color', url: '/color/' },
    { id: 'net',        emoji: '📡', label: 'IP/DNS',      url: '/net/' },
    { id: 'cidr',       emoji: '🌐', label: 'CIDR',        url: '/cidr/' },
    { id: 'count',      emoji: '📝', label: '글자수',      en: 'Char Count', url: '/count/' },
    { id: 'calc',       emoji: '🧮', label: '계산기',      en: 'Calculator', url: '/calc/' },
    { id: 'calendar',   emoji: '📅', label: '캘린더',      en: 'Calendar', url: '/calendar/' },
    { id: 'dday',       emoji: '⏳', label: 'D-Day',       url: '/dday/' },
    { id: 'lotto',      emoji: '🎰', label: '로또번호',    en: 'Lotto', url: '/lotto/' },
    { id: 'neon',       emoji: '✨', label: '네온사인',    en: 'Neon Sign', url: '/neon/' },
    { id: 'feellyrics', emoji: '🎤', label: '느낌가사',    en: 'Feel Lyrics', url: '/feellyrics/' },
    { id: 'hair',       emoji: '💇', label: 'AI 헤어',     en: 'AI Hair', url: '/hair/' },
    { id: 'chu',        emoji: '🐱', label: '궁금증 츄크', en: 'Chu Q&A', url: '/chu/' },
  ];

  const CSS = `
    #tnav-btn {
      position: fixed;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      z-index: 99990;
      background: #1a1a2e;
      border: 1px solid #2e2e5e;
      border-right: none;
      border-radius: 8px 0 0 8px;
      padding: 10px 7px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      color: #a0a8ff;
      font-size: 18px;
      box-shadow: -2px 0 12px rgba(0,0,0,0.4);
      transition: background 0.2s, color 0.2s;
      user-select: none;
    }
    #tnav-btn:hover { background: #22224a; color: #c8cfff; }
    #tnav-btn .tnav-dots {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    #tnav-btn .tnav-dots span {
      display: block;
      width: 4px;
      height: 4px;
      background: currentColor;
      border-radius: 50%;
    }
    #tnav-label {
      font-size: 9px;
      letter-spacing: 0.08em;
      color: inherit;
      writing-mode: vertical-rl;
      text-orientation: mixed;
      transform: rotate(180deg);
      margin-top: 6px;
      font-family: system-ui, sans-serif;
      font-weight: 600;
    }

    #tnav-overlay {
      position: fixed;
      inset: 0;
      z-index: 99991;
      background: rgba(0,0,0,0);
      pointer-events: none;
      transition: background 0.25s;
    }
    #tnav-overlay.open {
      background: rgba(0,0,0,0.42);
      pointer-events: all;
    }

    #tnav-drawer {
      position: fixed;
      top: 0;
      right: 0;
      height: 100%;
      width: 264px;
      max-width: 85vw;
      z-index: 99992;
      background: #111122;
      border-left: 1px solid #2a2a4a;
      box-shadow: -4px 0 24px rgba(0,0,0,0.55);
      transform: translateX(100%);
      transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    #tnav-drawer.open { transform: translateX(0); }

    #tnav-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px 12px;
      border-bottom: 1px solid #1e1e3a;
      flex-shrink: 0;
    }
    #tnav-header a {
      text-decoration: none;
      color: #c8cfff;
      font-size: 15px;
      font-weight: 700;
      font-family: system-ui, sans-serif;
      letter-spacing: 0.04em;
    }
    #tnav-header a:hover { color: #e0e8ff; }
    #tnav-close {
      background: none;
      border: none;
      color: #666699;
      font-size: 22px;
      cursor: pointer;
      line-height: 1;
      padding: 2px 6px;
      border-radius: 4px;
    }
    #tnav-close:hover { background: #1e1e3a; color: #a0a8ff; }

    #tnav-portal {
      display: block;
      margin: 10px 12px 6px;
      padding: 8px 12px;
      background: #1a1a3a;
      border: 1px solid #2a2a5a;
      border-radius: 8px;
      text-decoration: none;
      color: #8888cc;
      font-size: 12px;
      font-family: system-ui, sans-serif;
      text-align: center;
      flex-shrink: 0;
      transition: background 0.18s, color 0.18s;
    }
    #tnav-portal:hover { background: #22225a; color: #b0b8ff; }

    #tnav-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      padding: 8px 12px 16px;
      overflow-y: auto;
      flex: 1;
    }
    #tnav-grid::-webkit-scrollbar { width: 4px; }
    #tnav-grid::-webkit-scrollbar-track { background: transparent; }
    #tnav-grid::-webkit-scrollbar-thumb { background: #2a2a4a; border-radius: 2px; }

    .tnav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
      padding: 10px 4px;
      background: #16162c;
      border: 1px solid #2a2a44;
      border-radius: 10px;
      text-decoration: none;
      color: #9999cc;
      font-size: 11px;
      font-family: system-ui, sans-serif;
      font-weight: 500;
      text-align: center;
      transition: background 0.18s, border-color 0.18s, color 0.18s;
      cursor: pointer;
      min-height: 68px;
    }
    .tnav-item:hover {
      background: #1e1e3e;
      border-color: #4444aa;
      color: #c8cfff;
    }
    .tnav-item.active {
      background: #1a1a4a;
      border-color: #6666cc;
      color: #d0d8ff;
    }
    .tnav-item .tnav-emoji {
      font-size: 22px;
      line-height: 1;
    }
    .tnav-item .tnav-name {
      line-height: 1.2;
      word-break: keep-all;
    }
  `;

  function getCurrentId() {
    const first = window.location.pathname.split('/').filter(Boolean)[0];
    return TOOLS.some((t) => t.id === first) ? first : null;
  }

  function inject() {
    // Styles
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    // Toggle button (tab on right edge)
    const btn = document.createElement('div');
    btn.id = 'tnav-btn';
    btn.setAttribute('role', 'button');
    btn.setAttribute('aria-label', 'Open tool navigation');
    btn.innerHTML = `
      <div class="tnav-dots">
        <span></span><span></span><span></span>
        <span></span><span></span><span></span>
      </div>
      <div id="tnav-label">TOOLS</div>
    `;
    document.body.appendChild(btn);

    // Overlay (dim background)
    const overlay = document.createElement('div');
    overlay.id = 'tnav-overlay';
    document.body.appendChild(overlay);

    // Drawer
    const drawer = document.createElement('div');
    drawer.id = 'tnav-drawer';
    drawer.setAttribute('role', 'navigation');
    drawer.setAttribute('aria-label', 'Tool navigation');

    const currentId = getCurrentId();

    // Header
    const header = document.createElement('div');
    header.id = 'tnav-header';
    header.innerHTML = `
      <a href="https://tool.cocy.io/" title="All Tools">🔧 COCY TOOLS</a>
      <button id="tnav-close" aria-label="Close">✕</button>
    `;
    drawer.appendChild(header);

    // Portal link
    const portalLink = document.createElement('a');
    portalLink.id = 'tnav-portal';
    portalLink.href = 'https://cocy.io';
    portalLink.textContent = useEn() ? '← Go to cocy.io' : '← cocy.io 포털로 이동';
    drawer.appendChild(portalLink);

    // Grid of tools
    const grid = document.createElement('div');
    grid.id = 'tnav-grid';

    for (const tool of TOOLS) {
      const item = document.createElement('a');
      item.className = 'tnav-item' + (tool.id === currentId ? ' active' : '');
      item.href = tool.url;
      item.title = labelOf(tool);
      item.dataset.tool = tool.id;
      item.innerHTML = `
        <span class="tnav-emoji">${tool.emoji}</span>
        <span class="tnav-name">${labelOf(tool)}</span>
      `;
      grid.appendChild(item);
    }
    drawer.appendChild(grid);
    document.body.appendChild(drawer);

    document.addEventListener('i18n:change', () => {
      portalLink.textContent = useEn() ? '← Go to cocy.io' : '← cocy.io 포털로 이동';
      grid.querySelectorAll('.tnav-item').forEach((el) => {
        const tool = TOOLS.find((x) => x.id === el.dataset.tool);
        el.title = labelOf(tool);
        el.querySelector('.tnav-name').textContent = labelOf(tool);
      });
    });

    // Open / close logic
    let isOpen = false;
    function open() {
      isOpen = true;
      drawer.classList.add('open');
      overlay.classList.add('open');
      btn.style.opacity = '0';
      btn.style.pointerEvents = 'none';
    }
    function close() {
      isOpen = false;
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      btn.style.opacity = '';
      btn.style.pointerEvents = '';
    }

    btn.addEventListener('click', open);
    overlay.addEventListener('click', close);
    document.getElementById('tnav-close').addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen) close(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
