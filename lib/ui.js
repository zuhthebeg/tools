/* ui.js — tiny helpers shared by tool.cocy.io tools */
(function (global) {
  let toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1600);
  }
  async function copy(text, msg) {
    let ok = true;
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      ta.remove();
    }
    const I = global.I18n;
    if (!ok) toast(I ? I.t('copyFail') : '복사하지 못했어요. 직접 선택해서 복사해 주세요');
    else toast(msg || (I ? I.t('copied') : '복사했어요'));
    return ok;
  }
  global.UI = { toast, copy };
})(window);
