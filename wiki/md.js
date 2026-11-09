/* md.js — small, safe Markdown renderer for /wiki/.
 * Escapes all HTML first. Supports headings, lists, task lists (data-line), quotes, code, tables, hr,
 * **bold**, *italic*, ~~strike~~, `code`, [link](url), ![img](url), [[Wiki link]].
 * file:ID targets become <span class="att" data-file="ID"> placeholders that the app hydrates. */
(function (g) {
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ESC[c]);
  const okUrl = (u) => /^(https?:|mailto:|#)/i.test(u);

  function target(label, url, isImg) {
    const f = /^file:([\w-]+)$/.exec(url);
    if (f) return `<span class="att" data-file="${f[1]}" data-alt="${label}"></span>`;
    if (!okUrl(url)) return null;
    if (isImg) return `<img src="${url}" alt="${label}" loading="lazy">`;
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  }

  function inline(src) {
    const keep = [];
    const hold = (h) => '\u0000' + (keep.push(h) - 1) + '\u0000';
    let h = String(src).split(/(`[^`]+`)/).map((p) =>
      /^`[^`]+`$/.test(p) ? hold('<code>' + esc(p.slice(1, -1)) + '</code>') : esc(p)).join('');
    h = h.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, a, u) => { const r = target(a, u, true); return r ? hold(r) : m; });
    h = h.replace(/\[\[([^\]\n]+?)\]\]/g, (m, tt) => hold(`<a href="#" class="wl" data-page="${tt}">${tt}</a>`));
    h = h.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, a, u) => { const r = target(a, u, false); return r ? hold(r) : m; });
    h = h.replace(/(^|[\s(])(https?:\/\/[^\s<]+[^\s<.,;:!?)])/g, (m, pre, u) => pre + hold(`<a href="${u}" target="_blank" rel="noopener noreferrer">${u}</a>`));
    h = h.replace(/\*\*(?=\S)([^*]+?)\*\*/g, '<strong>$1</strong>')
      .replace(/~~(?=\S)([^~]+?)~~/g, '<del>$1</del>')
      .replace(/(^|[^\w*])\*(?=\S)([^*]+?)\*(?!\w)/g, '$1<em>$2</em>')
      .replace(/(^|[^\w])_(?=\S)([^_]+?)_(?!\w)/g, '$1<em>$2</em>');
    return h.replace(/\u0000(\d+)\u0000/g, (m, i) => keep[+i]);
  }

  const cells = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());

  function render(text) {
    const L = String(text || '').replace(/\r\n?/g, '\n').split('\n');
    const out = [];
    let para = [];
    const endPara = () => { if (para.length) { out.push('<p>' + para.map(inline).join('<br>') + '</p>'); para = []; } };
    for (let i = 0; i < L.length; i++) {
      const l = L[i];
      let m;
      if (/^```/.test(l)) {
        endPara();
        const buf = [];
        while (++i < L.length && !/^```/.test(L[i])) buf.push(L[i]);
        out.push('<pre><code>' + esc(buf.join('\n')) + '</code></pre>');
      } else if ((m = /^(#{1,4})\s+(.*)$/.exec(l))) {
        endPara();
        const n = m[1].length;
        out.push(`<h${n}>${inline(m[2])}</h${n}>`);
      } else if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(l)) {
        endPara(); out.push('<hr>');
      } else if (/^\s*([-*+]|\d+[.)])\s+/.test(l)) {
        endPara();
        const ordered = /^\s*\d/.test(l);
        const items = [];
        for (; i < L.length && (m = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(L[i])); i++) {
          const depth = Math.min(6, Math.floor(m[1].replace(/\t/g, '  ').length / 2));
          const tk = /^\[([ xX])\]\s?(.*)$/.exec(m[3]);
          const body = tk
            ? `<label class="task"><input type="checkbox" data-line="${i}"${tk[1] === ' ' ? '' : ' checked'}><span>${inline(tk[2])}</span></label>`
            : inline(m[3]);
          items.push(`<li${depth ? ` style="margin-left:${depth * 1.4}em"` : ''}${tk ? ' class="tli"' : ''}>${body}</li>`);
        }
        i--;
        out.push(ordered ? '<ol>' + items.join('') + '</ol>' : '<ul>' + items.join('') + '</ul>');
      } else if (/^>\s?/.test(l)) {
        endPara();
        const buf = [];
        for (; i < L.length && /^>\s?/.test(L[i]); i++) buf.push(L[i].replace(/^>\s?/, ''));
        i--;
        out.push('<blockquote>' + render(buf.join('\n')) + '</blockquote>');
      } else if (/^\s*\|.*\|\s*$/.test(l) && i + 1 < L.length && /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(L[i + 1])) {
        endPara();
        const head = cells(l);
        let rows = '';
        for (i += 2; i < L.length && /^\s*\|.*\|\s*$/.test(L[i]); i++) rows += '<tr>' + cells(L[i]).map((c) => '<td>' + inline(c) + '</td>').join('') + '</tr>';
        i--;
        out.push('<div class="tblw"><table><thead><tr>' + head.map((c) => '<th>' + inline(c) + '</th>').join('') + '</tr></thead><tbody>' + rows + '</tbody></table></div>');
      } else if (!l.trim()) {
        endPara();
      } else {
        para.push(l);
      }
    }
    endPara();
    return out.join('\n');
  }

  g.WikiMd = { render, esc };
})(window);
