/* store.js — persistence layer for /wiki/. Everything lives in this browser's IndexedDB.
 * The app only talks to this async API, so a server-backed store can replace it later. */
(function (g) {
  const DB = 'cocy-wiki';
  let dbp = null;

  function open() {
    if (!dbp) {
      dbp = new Promise((res, rej) => {
        const r = indexedDB.open(DB, 2);
        r.onupgradeneeded = (e) => {
          const db = r.result;
          if (e.oldVersion < 1) {
            db.createObjectStore('pages', { keyPath: 'id' });
            db.createObjectStore('files', { keyPath: 'id' }).createIndex('pageId', 'pageId');
          }
          if (!db.objectStoreNames.contains('vecs')) db.createObjectStore('vecs');
        };
        r.onsuccess = () => { const db = r.result; db.onversionchange = () => { db.close(); dbp = null; }; res(db); };
        r.onerror = () => rej(r.error);
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
    /* embedding cache for AI search: key = model|textHash -> Float32Array */
    getVecs: (keys) => { const out = new Array(keys.length); return tx('vecs', 'readonly', (t) => { const st = t.objectStore('vecs'); keys.forEach((k, i) => { st.get(k).onsuccess = (e) => { out[i] = e.target.result; }; }); }).then(() => out); },
    putVecs: (entries) => tx('vecs', 'readwrite', (t) => { const st = t.objectStore('vecs'); entries.forEach(([k, v]) => st.put(v, k)); }),
    clearVecs: () => tx('vecs', 'readwrite', (t) => { t.objectStore('vecs').clear(); }),
    deleteFiles: (ids) => tx('files', 'readwrite', (t) => { const s = t.objectStore('files'); ids.forEach((id) => s.delete(id)); }),
  };
})(window);
