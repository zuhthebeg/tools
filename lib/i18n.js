/* i18n.js — tiny runtime i18n for tool.cocy.io tools.
 * Pages call I18n.define({ key: [ko, en, zh-CN, zh-TW, es] }) then I18n.init().
 * Static markup: data-i18n="key" (textContent), data-i18n-attr="placeholder:key;title:key2".
 * Dynamic text: I18n.t('key', { n: 3 }) with {n} placeholders; listen for 'i18n:change' to re-render. */
(function (g) {
  const LANGS = ['ko', 'en', 'zh-CN', 'zh-TW', 'es'];
  const NAMES = { ko: '한국어', en: 'English', 'zh-CN': '简体中文', 'zh-TW': '繁體中文', es: 'Español' };
  const KEY = 'preferred_language';
  const dict = {};

  function normalize(l) {
    if (!l) return null;
    l = String(l).toLowerCase();
    if (l.startsWith('zh')) return /tw|hk|mo|hant/.test(l) ? 'zh-TW' : 'zh-CN';
    const base = l.split('-')[0];
    return LANGS.includes(base) ? base : null;
  }
  function detect() {
    const q = normalize(new URLSearchParams(location.search).get('lang'));
    if (q) return q;
    let stored = null;
    try { stored = localStorage.getItem(KEY); } catch (e) {}
    if (LANGS.includes(stored)) return stored;
    for (const l of navigator.languages || [navigator.language]) { const n = normalize(l); if (n) return n; }
    return 'en';
  }
  let lang = detect();

  function define(rows) { Object.assign(dict, rows); }
  function t(key, vars) {
    const row = dict[key];
    let s = row ? (row[LANGS.indexOf(lang)] ?? row[1] ?? row[0]) : key;
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
    return s;
  }
  function apply(root) {
    root = root || document;
    root.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      el.dataset.i18nAttr.split(';').forEach((pair) => {
        const [attr, key] = pair.split(':').map((s) => s && s.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });
    document.documentElement.lang = lang;
    if (dict.pageTitle) document.title = t('pageTitle');
  }
  function set(l) {
    if (!LANGS.includes(l) || l === lang) return;
    lang = l;
    try { localStorage.setItem(KEY, l); } catch (e) {}
    apply();
    document.querySelectorAll('.lang-sel').forEach((s) => { s.value = l; });
    document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang: l } }));
  }
  function mountSwitcher() {
    const host = document.querySelector('[data-lang-host]') || document.querySelector('footer.site');
    if (!host || host.querySelector('.lang-sel')) return;
    const sel = document.createElement('select');
    sel.className = 'lang-sel';
    sel.setAttribute('aria-label', 'Language');
    LANGS.forEach((l) => sel.add(new Option(NAMES[l], l)));
    sel.value = lang;
    sel.addEventListener('change', () => set(sel.value));
    host.append(host.textContent.trim() ? ' · 🌐 ' : '🌐 ', sel);
  }
  function setTitle() { if (dict.pageTitle) document.title = t('pageTitle'); }
  function init() {
    apply();
    mountSwitcher();
    document.addEventListener('DOMContentLoaded', setTitle);
    window.addEventListener('load', setTitle);
  }

  define({
    copied: ['복사했어요', 'Copied', '已复制', '已複製', 'Copiado'],
    allTools: ['모든 도구', 'All tools', '全部工具', '全部工具', 'Todas las herramientas'],
  });
  g.I18n = { t, set, define, apply, init, LANGS, get lang() { return lang; } };
})(window);
