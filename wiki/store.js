/* store.js — persistence layer for /wiki/. Everything lives in this browser's IndexedDB.
 * The app only talks to this async API, so a server-backed store can replace it later. */
(function (g) {
  const DB = 'cocy-wiki';
  let dbp = null;

  function open() {
    if (!dbp) {
      dbp = new Promise((res, rej) => {
        const r = indexedDB.open(DB, 1);
        r.onupgradeneeded = () => {
          const db = r.result;
          db.createObjectStore('pages', { keyPath: 'id' });
          db.createObjectStore('files', { keyPath: 'id' }).createIndex('pageId', 'pageId');
        };
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
        r.onblocked = () => rej(new Error('IndexedDB blocked'));
      });
      dbp.catch(() => { dbp = null; });
    }
    return dbp;
  }

  function tx(stores, mode, fn) {
    return open().then((db) => new Promise((res, rej) => {
      const t = db.transaction(stores, mode);
      let out;
      const r = fn(t);
      if (r && 'onsuccess' in r) r.onsuccess = () => { out = r.result; };
      t.oncomplete = () => res(out);
      t.onerror = () => rej(t.error);
      t.onabort = () => rej(t.error || new Error('aborted'));
    }));
  }

  g.WikiStore = {
    allPages: () => tx('pages', 'readonly', (t) => t.objectStore('pages').getAll()),
    putPages: (list) => tx('pages', 'readwrite', (t) => { const s = t.objectStore('pages'); list.forEach((p) => s.put(p)); }),
    deletePages: (ids) => tx(['pages', 'files'], 'readwrite', (t) => {
      const ps = t.objectStore('pages');
      const fs = t.objectStore('files');
      ids.forEach((id) => {
        ps.delete(id);
        fs.index('pageId').getAllKeys(id).onsuccess = (e) => e.target.result.forEach((k) => fs.delete(k));
      });
    }),
    putFile: (f) => tx('files', 'readwrite', (t) => { t.objectStore('files').put(f); }),
    getFile: (id) => tx('files', 'readonly', (t) => t.objectStore('files').get(id)),
    allFiles: () => tx('files', 'readonly', (t) => t.objectStore('files').getAll()),
    deleteFiles: (ids) => tx('files', 'readwrite', (t) => { const s = t.objectStore('files'); ids.forEach((id) => s.delete(id)); }),
  };
})(window);
