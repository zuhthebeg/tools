/* app.js — /wiki/ local wiki notes: page tree, Markdown notes, kanban boards, image/audio attachments. */
(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const S = window.WikiStore;
  const esc = window.WikiMd.esc;

  I18n.define({
    pageTitle: ['로컬 위키 메모장 · 트리 노트 + 칸반, 사진·음성 첨부 — tool.cocy.io', 'Local Wiki Notes · tree notes + kanban, photo & voice attachments — tool.cocy.io', '本地维基笔记 · 树形笔记 + 看板，图片与语音附件 — tool.cocy.io', '本地維基筆記 · 樹狀筆記 + 看板，圖片與語音附件 — tool.cocy.io', 'Notas wiki locales · notas en árbol + kanban, fotos y voz — tool.cocy.io'],
    h1: ['로컬 위키 메모장', 'Local Wiki Notes', '本地维基笔记', '本地維基筆記', 'Notas wiki locales'],
    menu: ['데이터 · 백업', 'Data & backup', '数据与备份', '資料與備份', 'Datos y copia'],
    searchPh: ['검색 (Ctrl+K)', 'Search (Ctrl+K)', '搜索 (Ctrl+K)', '搜尋 (Ctrl+K)', 'Buscar (Ctrl+K)'],
    newNote: ['＋ 노트', '＋ Note', '＋ 笔记', '＋ 筆記', '＋ Nota'],
    newBoard: ['＋ 보드', '＋ Board', '＋ 看板', '＋ 看板', '＋ Tablero'],
    iconTip: ['아이콘 바꾸기', 'Change icon', '更换图标', '更換圖示', 'Cambiar icono'],
    untitled: ['제목 없음', 'Untitled', '无标题', '無標題', 'Sin título'],
    typeNote: ['📝 노트', '📝 Note', '📝 笔记', '📝 筆記', '📝 Nota'],
    typeBoard: ['📋 보드', '📋 Board', '📋 看板', '📋 看板', '📋 Tablero'],
    addSub: ['＋ 하위 페이지', '＋ Sub-page', '＋ 子页面', '＋ 子頁面', '＋ Subpágina'],
    moveTo: ['↪ 다른 곳으로 이동', '↪ Move to…', '↪ 移动到…', '↪ 移動到…', '↪ Mover a…'],
    dlMd: ['⬇ 마크다운(.md) 저장', '⬇ Download Markdown (.md)', '⬇ 下载 Markdown (.md)', '⬇ 下載 Markdown (.md)', '⬇ Descargar Markdown (.md)'],
    delPage: ['🗑 페이지 삭제', '🗑 Delete page', '🗑 删除页面', '🗑 刪除頁面', '🗑 Eliminar página'],
    tHeading: ['제목', 'Heading', '标题', '標題', 'Título'],
    tBold: ['굵게', 'Bold', '加粗', '粗體', 'Negrita'],
    tTask: ['체크리스트', 'Checklist', '待办清单', '待辦清單', 'Lista de tareas'],
    tLink: ['페이지 링크 [[ ]]', 'Page link [[ ]]', '页面链接 [[ ]]', '頁面連結 [[ ]]', 'Enlace a página [[ ]]'],
    tImage: ['사진 첨부', 'Attach image', '添加图片', '附加圖片', 'Adjuntar imagen'],
    tRec: ['음성 메모 녹음', 'Record voice memo', '录制语音备忘', '錄製語音備忘', 'Grabar nota de voz'],
    tFile: ['파일 첨부 (오디오·영상·문서)', 'Attach file (audio, video, docs)', '添加文件（音频、视频、文档）', '附加檔案（音訊、影片、文件）', 'Adjuntar archivo (audio, vídeo, docs)'],
    mEdit: ['편집', 'Edit', '编辑', '編輯', 'Editar'],
    mSplit: ['나란히', 'Split', '并排', '並排', 'Dividido'],
    mView: ['보기', 'View', '预览', '預覽', 'Ver'],
    edPh: ['여기에 메모를 쓰세요. 마크다운을 쓸 수 있고, 사진은 붙여넣거나 끌어다 놓으면 첨부돼요.\n\n# 제목\n- [ ] 할 일\n[[다른 페이지]]', 'Write here. Markdown works; paste or drop images to attach them.\n\n# Heading\n- [ ] To-do\n[[Another page]]', '在这里写笔记。支持 Markdown，粘贴或拖入图片即可附加。\n\n# 标题\n- [ ] 待办\n[[其他页面]]', '在這裡寫筆記。支援 Markdown，貼上或拖入圖片即可附加。\n\n# 標題\n- [ ] 待辦\n[[其他頁面]]', 'Escribe aquí. Admite Markdown; pega o arrastra imágenes para adjuntarlas.\n\n# Título\n- [ ] Tarea\n[[Otra página]]'],
    recStop: ['■ 저장', '■ Save', '■ 保存', '■ 儲存', '■ Guardar'],
    cancel: ['취소', 'Cancel', '取消', '取消', 'Cancelar'],
    cardTitlePh: ['카드 제목', 'Card title', '卡片标题', '卡片標題', 'Título de la tarjeta'],
    column: ['열', 'Column', '列', '欄', 'Columna'],
    cardHint: ['설명은 마크다운, 사진은 붙여넣기도 돼요', 'Markdown description; you can paste images too', '描述支持 Markdown，也可粘贴图片', '描述支援 Markdown，也可貼上圖片', 'Descripción en Markdown; también puedes pegar imágenes'],
    cardBodyPh: ['설명, 체크리스트, 첨부…', 'Description, checklist, attachments…', '描述、清单、附件…', '描述、清單、附件…', 'Descripción, lista, adjuntos…'],
    delCard: ['🗑 삭제', '🗑 Delete', '🗑 删除', '🗑 刪除', '🗑 Eliminar'],
    done: ['완료', 'Done', '完成', '完成', 'Listo'],
    moveTitle: ['어디로 옮길까요?', 'Move where?', '移动到哪里？', '移動到哪裡？', '¿Mover a dónde?'],
    move: ['이동', 'Move', '移动', '移動', 'Mover'],
    topLevel: ['(최상위)', '(Top level)', '（顶层）', '（頂層）', '(Nivel superior)'],
    dataTitle: ['데이터 · 백업', 'Data & backup', '数据与备份', '資料與備份', 'Datos y copia de seguridad'],
    dataNote: ['모든 페이지와 첨부는 이 브라우저(IndexedDB)에만 저장돼요. 브라우저 데이터를 지우면 함께 사라지니 가끔 백업해 두세요.', 'All pages and attachments are stored only in this browser (IndexedDB). Clearing browser data deletes them, so back up now and then.', '所有页面和附件只保存在此浏览器（IndexedDB）中。清除浏览器数据会一并删除，请定期备份。', '所有頁面和附件只儲存在此瀏覽器（IndexedDB）中。清除瀏覽器資料會一併刪除，請定期備份。', 'Todas las páginas y adjuntos se guardan solo en este navegador (IndexedDB). Si borras los datos del navegador se pierden, así que haz copias de vez en cuando.'],
    exportAll: ['⬇ 전체 백업 내보내기', '⬇ Export full backup', '⬇ 导出完整备份', '⬇ 匯出完整備份', '⬇ Exportar copia completa'],
    importAll: ['⬆ 백업 가져오기', '⬆ Import backup', '⬆ 导入备份', '⬆ 匯入備份', '⬆ Importar copia'],
    gc: ['🧹 안 쓰는 첨부 정리', '🧹 Clean unused attachments', '🧹 清理未使用的附件', '🧹 清理未使用的附件', '🧹 Limpiar adjuntos sin uso'],
    close: ['닫기', 'Close', '关闭', '關閉', 'Cerrar'],
    saving: ['저장 중…', 'Saving…', '保存中…', '儲存中…', 'Guardando…'],
    saved: ['기기에 저장됨', 'Saved on device', '已保存到本机', '已儲存到本機', 'Guardado en el dispositivo'],
    saveFail: ['저장하지 못했어요. 저장 공간을 확인해 주세요', "Couldn't save. Check your storage space", '保存失败，请检查存储空间', '儲存失敗，請檢查儲存空間', 'No se pudo guardar. Revisa el espacio de almacenamiento'],
    dbFail: ['이 브라우저에서는 저장소(IndexedDB)를 열 수 없어요. 시크릿 모드라면 일반 창에서 열어 주세요.', "This browser can't open storage (IndexedDB). If you're in private mode, try a normal window.", '此浏览器无法打开存储（IndexedDB）。如在无痕模式，请改用普通窗口。', '此瀏覽器無法開啟儲存空間（IndexedDB）。如在無痕模式，請改用一般視窗。', 'Este navegador no puede abrir el almacenamiento (IndexedDB). Si estás en modo privado, usa una ventana normal.'],
    noPages: ['페이지가 없어요. 위 버튼으로 만들어 보세요.', 'No pages yet. Create one with the buttons above.', '还没有页面，用上方按钮新建。', '還沒有頁面，用上方按鈕新增。', 'Aún no hay páginas. Crea una con los botones de arriba.'],
    noResults: ['검색 결과가 없어요', 'No results', '没有结果', '沒有結果', 'Sin resultados'],
    blank: ['왼쪽에서 페이지를 고르거나 새로 만드세요.', 'Pick a page on the left or create a new one.', '在左侧选择页面或新建一个。', '在左側選擇頁面或新增一個。', 'Elige una página a la izquierda o crea una nueva.'],
    delConfirm: ['"{t}" 페이지를 삭제할까요? 하위 페이지 {n}개와 첨부도 함께 지워져요.', 'Delete "{t}"? Its {n} sub-pages and attachments are deleted too.', '删除“{t}”？其 {n} 个子页面和附件也会一并删除。', '刪除「{t}」？其 {n} 個子頁面和附件也會一併刪除。', '¿Eliminar "{t}"? También se eliminan sus {n} subpáginas y adjuntos.'],
    delConfirm0: ['"{t}" 페이지를 삭제할까요? 첨부도 함께 지워져요.', 'Delete "{t}"? Its attachments are deleted too.', '删除“{t}”？附件也会一并删除。', '刪除「{t}」？附件也會一併刪除。', '¿Eliminar "{t}"? También se eliminan sus adjuntos.'],
    deleted: ['삭제했어요', 'Deleted', '已删除', '已刪除', 'Eliminado'],
    colTodo: ['할 일', 'To do', '待办', '待辦', 'Por hacer'],
    colDoing: ['진행 중', 'Doing', '进行中', '進行中', 'En curso'],
    colDone: ['완료', 'Done', '已完成', '已完成', 'Hecho'],
    newCol: ['새 열', 'New column', '新列', '新欄', 'Nueva columna'],
    addCard: ['카드 추가', 'Add card', '添加卡片', '新增卡片', 'Añadir tarjeta'],
    addCol: ['＋ 열 추가', '＋ Add column', '＋ 添加列', '＋ 新增欄', '＋ Añadir columna'],
    newCardPh: ['카드 내용 입력 후 Enter (여러 줄은 Shift+Enter)', 'Type and press Enter (Shift+Enter for new line)', '输入后按 Enter（Shift+Enter 换行）', '輸入後按 Enter（Shift+Enter 換行）', 'Escribe y pulsa Enter (Shift+Enter para nueva línea)'],
    colDelConfirm: ['"{t}" 열과 카드 {n}장을 삭제할까요?', 'Delete column "{t}" and its {n} cards?', '删除列“{t}”及其 {n} 张卡片？', '刪除欄「{t}」及其 {n} 張卡片？', '¿Eliminar la columna "{t}" y sus {n} tarjetas?'],
    cardDelConfirm: ['이 카드를 삭제할까요?', 'Delete this card?', '删除这张卡片？', '刪除這張卡片？', '¿Eliminar esta tarjeta?'],
    moveLeft: ['왼쪽으로', 'Move left', '左移', '左移', 'Mover a la izquierda'],
    moveRight: ['오른쪽으로', 'Move right', '右移', '右移', 'Mover a la derecha'],
    delCol: ['열 삭제', 'Delete column', '删除列', '刪除欄', 'Eliminar columna'],
    voiceMemo: ['음성 메모', 'Voice memo', '语音备忘', '語音備忘', 'Nota de voz'],
    recUnsupported: ['이 브라우저는 녹음을 지원하지 않아요', "This browser can't record audio", '此浏览器不支持录音', '此瀏覽器不支援錄音', 'Este navegador no puede grabar audio'],
    micDenied: ['마이크 권한이 필요해요', 'Microphone permission is needed', '需要麦克风权限', '需要麥克風權限', 'Se necesita permiso del micrófono'],
    attached: ['첨부했어요: {n}개', 'Attached {n} file(s)', '已附加 {n} 个文件', '已附加 {n} 個檔案', 'Adjuntado(s): {n}'],
    bigFile: ['큰 파일({s})은 저장 공간을 많이 차지해요', 'Large file ({s}) uses a lot of storage', '大文件（{s}）会占用较多空间', '大檔案（{s}）會佔用較多空間', 'Un archivo grande ({s}) ocupa mucho espacio'],
    missingFile: ['첨부를 찾을 수 없어요', 'Attachment not found', '找不到附件', '找不到附件', 'Adjunto no encontrado'],
    storeUse: ['사용 중 {u} · 사용 가능 약 {q}', 'Using {u} · about {q} available', '已用 {u} · 约可用 {q}', '已用 {u} · 約可用 {q}', 'En uso {u} · unos {q} disponibles'],
    storeStats: ['페이지 {p}개 · 첨부 {f}개', '{p} pages · {f} attachments', '{p} 个页面 · {f} 个附件', '{p} 個頁面 · {f} 個附件', '{p} páginas · {f} adjuntos'],
    persisted: ['브라우저가 자동으로 지우지 않도록 보호됨', 'Protected from automatic browser cleanup', '已防止浏览器自动清理', '已防止瀏覽器自動清理', 'Protegido de la limpieza automática del navegador'],
    notPersisted: ['저장 공간이 부족하면 브라우저가 지울 수 있어요. 백업을 권장해요', 'The browser may clear it when storage runs low. Backups recommended', '存储不足时浏览器可能清除数据，建议备份', '儲存空間不足時瀏覽器可能清除資料，建議備份', 'El navegador podría borrarlo si falta espacio. Se recomienda hacer copias'],
    exported: ['백업 파일을 저장했어요', 'Backup saved', '备份已保存', '備份已儲存', 'Copia guardada'],
    importConfirm: ['페이지 {p}개, 첨부 {f}개를 가져올까요? 같은 페이지가 있으면 백업 내용으로 덮어써요.', 'Import {p} pages and {f} attachments? Pages that already exist are overwritten by the backup.', '导入 {p} 个页面和 {f} 个附件？已存在的页面会被备份覆盖。', '匯入 {p} 個頁面和 {f} 個附件？已存在的頁面會被備份覆蓋。', '¿Importar {p} páginas y {f} adjuntos? Las páginas existentes se sobrescriben con la copia.'],
    imported: ['가져왔어요', 'Imported', '已导入', '已匯入', 'Importado'],
    badBackup: ['이 도구의 백업 파일이 아니에요', 'Not a backup file from this tool', '不是本工具的备份文件', '不是本工具的備份檔案', 'No es una copia de esta herramienta'],
    gcConfirm: ['어느 페이지에서도 쓰지 않는 첨부 {n}개({s})를 지울까요?', 'Delete {n} attachments ({s}) that no page uses?', '删除没有任何页面使用的 {n} 个附件（{s}）？', '刪除沒有任何頁面使用的 {n} 個附件（{s}）？', '¿Eliminar {n} adjuntos ({s}) que ninguna página usa?'],
    gcNone: ['정리할 첨부가 없어요', 'Nothing to clean up', '没有需要清理的附件', '沒有需要清理的附件', 'No hay nada que limpiar'],
    savedNow: ['저장했어요', 'Saved', '已保存', '已儲存', 'Guardado'],
    seedWelcome: ['시작하기', 'Getting started', '开始使用', '開始使用', 'Primeros pasos'],
    seedBoard: ['할 일 보드', 'Task board', '任务看板', '任務看板', 'Tablero de tareas'],
    seedBody: [
      '# 👋 로컬 위키 메모장\n\n- 왼쪽 트리에서 페이지를 만들고 **끌어서** 정리해요. 다른 페이지 가운데에 놓으면 하위 페이지가 돼요.\n- 페이지는 **노트**(마크다운) 또는 **보드**(칸반)로 쓸 수 있어요.\n- 🖼 사진은 붙여넣기·끌어놓기로, 🎙 버튼으로 음성 메모를 녹음해 붙여요.\n- `[[페이지 이름]]`으로 다른 페이지를 연결해요: [[{board}]]\n\n## 체크리스트\n- [x] 메모장 열어보기\n- [ ] 첫 페이지 만들기\n- [ ] ⚙ 메뉴에서 백업해 보기\n\n> 모든 내용은 이 브라우저에만 저장되고 서버로 보내지 않아요.',
      '# 👋 Local Wiki Notes\n\n- Create pages in the tree on the left and **drag** them to organise. Drop onto the middle of another page to nest it.\n- Each page is a **note** (Markdown) or a **board** (kanban).\n- 🖼 Paste or drop images, and record voice memos with 🎙.\n- Link pages with `[[Page name]]`: [[{board}]]\n\n## Checklist\n- [x] Open the notebook\n- [ ] Create your first page\n- [ ] Try a backup from the ⚙ menu\n\n> Everything stays in this browser and is never sent to a server.',
      '# 👋 本地维基笔记\n\n- 在左侧树中新建页面并**拖动**整理。拖到另一页面中间即成为子页面。\n- 每个页面可以是**笔记**（Markdown）或**看板**。\n- 🖼 粘贴或拖入图片，用 🎙 录制语音备忘。\n- 用 `[[页面名]]` 链接页面：[[{board}]]\n\n## 清单\n- [x] 打开笔记本\n- [ ] 新建第一个页面\n- [ ] 在 ⚙ 菜单中试试备份\n\n> 所有内容只保存在此浏览器，不会发送到服务器。',
      '# 👋 本地維基筆記\n\n- 在左側樹中新增頁面並**拖曳**整理。拖到另一頁面中間即成為子頁面。\n- 每個頁面可以是**筆記**（Markdown）或**看板**。\n- 🖼 貼上或拖入圖片，用 🎙 錄製語音備忘。\n- 用 `[[頁面名稱]]` 連結頁面：[[{board}]]\n\n## 清單\n- [x] 打開筆記本\n- [ ] 新增第一個頁面\n- [ ] 在 ⚙ 選單中試試備份\n\n> 所有內容只儲存在此瀏覽器，不會傳送到伺服器。',
      '# 👋 Notas wiki locales\n\n- Crea páginas en el árbol de la izquierda y **arrástralas** para ordenarlas. Suéltala en el centro de otra página para anidarla.\n- Cada página es una **nota** (Markdown) o un **tablero** (kanban).\n- 🖼 Pega o arrastra imágenes y graba notas de voz con 🎙.\n- Enlaza páginas con `[[Nombre]]`: [[{board}]]\n\n## Lista\n- [x] Abrir el cuaderno\n- [ ] Crear tu primera página\n- [ ] Probar una copia desde el menú ⚙\n\n> Todo se queda en este navegador y nunca se envía a un servidor.'],
    seedCard1: ['카드를 끌어서 다른 열로 옮겨 보세요', 'Drag a card to another column', '把卡片拖到另一列试试', '把卡片拖到另一欄試試', 'Arrastra una tarjeta a otra columna'],
    seedCard2: ['카드를 누르면 설명·사진·음성을 붙일 수 있어요', 'Click a card to add notes, photos or voice', '点击卡片可添加描述、图片或语音', '點擊卡片可加入描述、圖片或語音', 'Pulsa una tarjeta para añadir notas, fotos o voz'],
    seedCard3: ['메모장 만들기', 'Set up the notebook', '创建笔记本', '建立筆記本', 'Crear el cuaderno'],
  });
  I18n.init();
  const t = I18n.t;

  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2, 10));
  const LS = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };
  const fmtSize = (b) => (b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : b < 1073741824 ? (b / 1048576).toFixed(1) + ' MB' : (b / 1073741824).toFixed(2) + ' GB');
  const stamp = () => { const d = new Date(); const p = (n) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`; };
  const COLORS = ['', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#a855f7', '#ec4899'];
  const EMOJI = ['📄', '📝', '📋', '📒', '📌', '⭐', '💡', '✅', '🎯', '🗂️', '📅', '🧠', '🎵', '🖼️', '🔖', '💼', '🏠', '✈️', '🍳', '💰', '📚', '🛠️', '❤️', '🔥', '🌱', '🎮', '🐱', '🚀', '⚙️', '🧪', '🎙️', '📷'];

  let pages = new Map();
  let cur = null;
  let collapsed = new Set(LS.get('wiki_collapsed', []));
  let mode = LS.get('wiki_mode', 'split');
  const bc = 'BroadcastChannel' in window ? new BroadcastChannel('cocy-wiki') : null;

  /* ---------- saving ---------- */
  const dirty = new Map();
  let saveT = null;
  function setSaved(ok) { $('saveSt').textContent = ok ? '✓ ' + t('saved') : t('saving'); }
  function touch(p) {
    p.updated = Date.now();
    dirty.set(p.id, p);
    clearTimeout(saveT);
    saveT = setTimeout(flush, 400);
    setSaved(false);
  }
  async function flush() {
    clearTimeout(saveT);
    if (!dirty.size) return;
    const list = [...dirty.values()];
    dirty.clear();
    try {
      await S.putPages(list);
      setSaved(true);
      if (bc) bc.postMessage({ type: 'pages' });
      askPersist();
    } catch (e) {
      list.forEach((p) => { if (!dirty.has(p.id) && pages.has(p.id)) dirty.set(p.id, p); });
      $('saveSt').textContent = '⚠ ' + t('saveFail');
      UI.toast(t('saveFail'));
    }
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
  window.addEventListener('pagehide', flush);
  let persistAsked = false;
  function askPersist() {
    if (persistAsked || !navigator.storage || !navigator.storage.persist) return;
    persistAsked = true;
    navigator.storage.persisted().then((p) => p || navigator.storage.persist()).catch(() => {});
  }

  /* ---------- model ---------- */
  const parentOf = (p) => (p.parentId && pages.has(p.parentId) ? p.parentId : null);
  const children = (pid) => [...pages.values()].filter((p) => parentOf(p) === pid).sort((a, b) => a.order - b.order || a.created - b.created);
  function descendants(id) { const out = []; const walk = (x) => children(x).forEach((c) => { out.push(c.id); walk(c.id); }); walk(id); return out; }
  const defaultCols = () => [t('colTodo'), t('colDoing'), t('colDone')].map((title) => ({ id: uid(), title, cards: [] }));
  const iconOf = (p) => p.icon || (p.type === 'board' ? '📋' : '📄');
  const titleOf = (p) => p.title || t('untitled');
  function normalize(p) {
    return {
      id: String(p.id), parentId: p.parentId ? String(p.parentId) : null, title: String(p.title || ''), icon: String(p.icon || ''),
      type: p.type === 'board' ? 'board' : 'note', body: String(p.body || ''),
      columns: Array.isArray(p.columns) ? p.columns.map((c) => ({ id: String(c.id || uid()), title: String(c.title || ''), cards: Array.isArray(c.cards) ? c.cards.map((k) => ({ id: String(k.id || uid()), title: String(k.title || ''), body: String(k.body || ''), color: COLORS.includes(k.color) ? k.color : '' })) : [] })) : [],
      order: Number(p.order) || 0, created: Number(p.created) || Date.now(), updated: Number(p.updated) || Date.now(),
    };
  }
  function newPage({ parentId = null, type = 'note', title = '', icon = '', body = '' } = {}) {
    const sib = children(parentId);
    const p = normalize({ id: uid(), parentId, type, title, icon, body, order: sib.length ? sib[sib.length - 1].order + 1 : 0, columns: type === 'board' ? defaultCols() : [] });
    pages.set(p.id, p);
    if (parentId) { collapsed.delete(parentId); saveCollapsed(); }
    touch(p);
    return p;
  }
  const saveCollapsed = () => LS.set('wiki_collapsed', [...collapsed]);
  function pageText(p) {
    let s = (p.title || '') + '\n' + p.body;
    p.columns.forEach((c) => { s += '\n' + c.title; c.cards.forEach((k) => { s += '\n' + k.title + '\n' + k.body; }); });
    return s;
  }

  /* ---------- tree ---------- */
  let treeT = null;
  const renderTreeSoon = () => { clearTimeout(treeT); treeT = setTimeout(renderTree, 120); };
  function renderTree() {
    const box = $('tree');
    const q = $('q').value.trim();
    box.innerHTML = '';
    if (q) return renderSearch(q, box);
    const walk = (pid, depth) => {
      for (const p of children(pid)) {
        const kids = children(p.id).length > 0;
        const row = document.createElement('div');
        row.className = 'node' + (p.id === cur ? ' on' : '');
        row.style.paddingLeft = 4 + depth * 14 + 'px';
        row.draggable = true;
        row.dataset.id = p.id;
        row.setAttribute('role', 'treeitem');
        row.innerHTML = `<button class="car" tabindex="-1">${kids ? (collapsed.has(p.id) ? '▸' : '▾') : ''}</button><span class="ic">${esc(iconOf(p))}</span><span class="tt">${esc(titleOf(p))}</span><button class="add" title="${esc(t('addSub'))}">+</button>`;
        box.appendChild(row);
        if (kids && !collapsed.has(p.id)) walk(p.id, depth + 1);
      }
    };
    walk(null, 0);
    if (!pages.size) box.innerHTML = `<p class="muted empty">${esc(t('noPages'))}</p>`;
  }
  function renderSearch(q, box) {
    const ql = q.toLowerCase();
    const res = [];
    for (const p of pages.values()) {
      const text = pageText(p).replace(/!?\[([^\]]*)\]\(file:[\w-]+\)/g, '$1');
      const i = text.toLowerCase().indexOf(ql);
      if (i < 0) continue;
      const inTitle = (p.title || '').toLowerCase().includes(ql);
      res.push({ p, inTitle, snip: text.slice(Math.max(0, i - 24), i + q.length + 50).replace(/\s+/g, ' ') });
    }
    res.sort((a, b) => b.inTitle - a.inTitle || b.p.updated - a.p.updated);
    if (!res.length) { box.innerHTML = `<p class="muted empty">${esc(t('noResults'))}</p>`; return; }
    const hl = (s) => esc(s).replace(new RegExp(esc(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), (m) => `<mark>${m}</mark>`);
    res.slice(0, 100).forEach(({ p, snip }) => {
      const d = document.createElement('div');
      d.className = 'sres';
      d.dataset.id = p.id;
      d.innerHTML = `${esc(iconOf(p))} ${hl(titleOf(p))}<small>${hl(snip)}</small>`;
      box.appendChild(d);
    });
  }
  $('tree').addEventListener('click', (e) => {
    const row = e.target.closest('[data-id]');
    if (!row) return;
    const id = row.dataset.id;
    if (e.target.closest('.car')) {
      if (collapsed.has(id)) collapsed.delete(id); else collapsed.add(id);
      saveCollapsed(); renderTree(); return;
    }
    if (e.target.closest('.add')) { const p = newPage({ parentId: id }); open(p.id, true); return; }
    open(id);
  });
  let dragId = null;
  const clearDrop = () => document.querySelectorAll('.drop-in,.drop-before,.drop-after').forEach((n) => n.classList.remove('drop-in', 'drop-before', 'drop-after'));
  function dropPos(row, e) {
    const r = row.getBoundingClientRect();
    const y = (e.clientY - r.top) / r.height;
    return y < 0.28 ? 'before' : y > 0.72 ? 'after' : 'in';
  }
  $('tree').addEventListener('dragstart', (e) => {
    const row = e.target.closest('.node');
    if (!row) return;
    dragId = row.dataset.id;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', titleOf(pages.get(dragId)));
  });
  $('tree').addEventListener('dragover', (e) => {
    if (!dragId) return;
    e.preventDefault();
    clearDrop();
    const row = e.target.closest('.node');
    if (row && row.dataset.id !== dragId) row.classList.add('drop-' + dropPos(row, e));
  });
  $('tree').addEventListener('dragleave', (e) => { if (!e.relatedTarget || !$('tree').contains(e.relatedTarget)) clearDrop(); });
  $('tree').addEventListener('drop', (e) => {
    if (!dragId) return;
    e.preventDefault();
    const row = e.target.closest('.node');
    clearDrop();
    if (row) movePage(dragId, row.dataset.id, dropPos(row, e));
    else movePage(dragId, null, 'in');
    dragId = null;
  });
  $('tree').addEventListener('dragend', () => { dragId = null; clearDrop(); });

  function movePage(id, targetId, pos) {
    const p = pages.get(id);
    if (!p || targetId === id || (targetId && descendants(id).includes(targetId))) return;
    const target = targetId ? pages.get(targetId) : null;
    const np = pos === 'in' ? targetId : parentOf(target);
    const sib = children(np).filter((x) => x.id !== id);
    const idx = pos === 'in' ? sib.length : sib.indexOf(target) + (pos === 'after' ? 1 : 0);
    sib.splice(idx, 0, p);
    p.parentId = np;
    sib.forEach((s, i) => { if (s.order !== i || s === p) { s.order = i; touch(s); } });
    if (pos === 'in' && targetId) { collapsed.delete(targetId); saveCollapsed(); }
    renderTree();
    renderCrumbs();
  }

  /* ---------- page ---------- */
  function open(id, focusTitle) {
    if (!pages.has(id)) id = null;
    if (cur !== id) closeEmoji();
    cur = id;
    LS.set('wiki_cur', id);
    if (id && location.hash.slice(1) !== id) history.replaceState(null, '', '#' + id);
    if (id) { let a = parentOf(pages.get(id)); let ch = false; while (a) { if (collapsed.delete(a)) ch = true; a = parentOf(pages.get(a)); } if (ch) saveCollapsed(); }
    $('app').classList.remove('side-open');
    renderTree();
    renderMain(true);
    if (focusTitle) { $('pTitle').focus(); $('pTitle').select(); }
  }
  function renderCrumbs() {
    const p = pages.get(cur);
    const box = $('crumbs');
    box.innerHTML = '';
    if (!p) return;
    const chain = [];
    let a = parentOf(p);
    while (a) { chain.unshift(pages.get(a)); a = parentOf(pages.get(a)); }
    chain.forEach((c) => {
      const l = document.createElement('a');
      l.textContent = iconOf(c) + ' ' + titleOf(c);
      l.onclick = () => open(c.id);
      box.append(l, ' / ');
    });
  }
  function renderMain(reset) {
    const p = pages.get(cur);
    $('page').hidden = !p;
    $('blank').hidden = !!p;
    if (!p) { $('blank').textContent = t('blank'); return; }
    renderCrumbs();
    $('pIcon').textContent = iconOf(p);
    if (reset || document.activeElement !== $('pTitle')) $('pTitle').value = p.title;
    document.querySelectorAll('#typeSeg button').forEach((b) => b.classList.toggle('on', b.dataset.type === p.type));
    $('noteView').hidden = p.type !== 'note';
    $('boardView').hidden = p.type !== 'board';
    if (p.type === 'note') {
      if (reset || document.activeElement !== $('ed')) { $('ed').value = p.body; if (reset) $('ed').scrollTop = 0; }
      renderPreview();
    } else {
      renderBoard();
    }
  }
  $('pTitle').addEventListener('input', () => {
    const p = pages.get(cur);
    if (!p) return;
    p.title = $('pTitle').value;
    touch(p);
    renderTreeSoon();
  });
  $('pTitle').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); const p = pages.get(cur); if (p && p.type === 'note') $('ed').focus(); } });
  $('typeSeg').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    const p = pages.get(cur);
    if (!b || !p || p.type === b.dataset.type) return;
    p.type = b.dataset.type;
    if (p.type === 'board' && !p.columns.length) p.columns = defaultCols();
    touch(p);
    renderTree();
    renderMain(true);
  });
  $('newNote').onclick = () => open(newPage({ type: 'note' }).id, true);
  $('newBoard').onclick = () => open(newPage({ type: 'board' }).id, true);
  const closeMore = () => { $('pMore').open = false; };
  document.addEventListener('click', (e) => { if (!e.target.closest('#pMore')) closeMore(); });
  $('addSubBtn').onclick = () => { closeMore(); open(newPage({ parentId: cur }).id, true); };
  $('delBtn').onclick = async () => {
    closeMore();
    const p = pages.get(cur);
    if (!p) return;
    const desc = descendants(p.id);
    if (!confirm(desc.length ? t('delConfirm', { t: titleOf(p), n: desc.length }) : t('delConfirm0', { t: titleOf(p) }))) return;
    const ids = [p.id, ...desc];
    const next = parentOf(p) || children(null).find((x) => !ids.includes(x.id))?.id || null;
    ids.forEach((id) => { pages.delete(id); dirty.delete(id); });
    try { await S.deletePages(ids); if (bc) bc.postMessage({ type: 'pages' }); } catch (e) { UI.toast(t('saveFail')); }
    UI.toast(t('deleted'));
    open(next);
  };
  $('moveBtn').onclick = () => {
    closeMore();
    const p = pages.get(cur);
    if (!p) return;
    const bad = new Set([p.id, ...descendants(p.id)]);
    const sel = $('moveSel');
    sel.innerHTML = '';
    sel.add(new Option(t('topLevel'), ''));
    const walk = (pid, depth) => children(pid).forEach((c) => { if (bad.has(c.id)) return; sel.add(new Option('\u00a0\u00a0'.repeat(depth) + iconOf(c) + ' ' + titleOf(c), c.id)); walk(c.id, depth + 1); });
    walk(null, 1);
    sel.value = parentOf(p) || '';
    $('moveDlg').showModal();
  };
  $('moveCancel').onclick = () => $('moveDlg').close();
  $('moveOk').onclick = () => { $('moveDlg').close(); const v = $('moveSel').value; movePage(cur, v || null, 'in'); };
  $('mdBtn').onclick = () => {
    closeMore();
    const p = pages.get(cur);
    if (!p) return;
    let md = `# ${p.icon ? p.icon + ' ' : ''}${titleOf(p)}\n\n`;
    if (p.type === 'note') md += p.body;
    else p.columns.forEach((c) => { md += `## ${c.title}\n\n` + c.cards.map((k) => `- ${k.title.replace(/\n/g, ' ')}${k.body ? '\n' + k.body.split('\n').map((l) => '  ' + l).join('\n') : ''}`).join('\n') + '\n\n'; });
    download(new Blob([md], { type: 'text/markdown;charset=utf-8' }), (titleOf(p).replace(/[\\/:*?"<>|]+/g, '_').slice(0, 80) || 'page') + '.md');
  };

  /* icon picker */
  $('emojiPop').innerHTML = '<button data-e="">✕</button>' + EMOJI.map((e) => `<button data-e="${e}">${e}</button>`).join('');
  function closeEmoji() { $('emojiPop').hidden = true; }
  $('pIcon').addEventListener('click', (e) => {
    e.stopPropagation();
    const pop = $('emojiPop');
    if (!pop.hidden) return closeEmoji();
    const r = $('pIcon').getBoundingClientRect();
    pop.hidden = false;
    pop.style.left = Math.max(8, Math.min(r.left, innerWidth - pop.offsetWidth - 8)) + 'px';
    pop.style.top = r.bottom + 6 + 'px';
  });
  $('emojiPop').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    const p = pages.get(cur);
    if (!b || !p) return;
    p.icon = b.dataset.e;
    touch(p);
    closeEmoji();
    renderTree();
    renderMain();
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('#emojiPop')) closeEmoji(); });

  /* ---------- note editor ---------- */
  function applyMode() {
    $('nbody').className = 'mode-' + mode;
    document.querySelectorAll('#modeSeg button').forEach((b) => b.classList.toggle('on', b.dataset.m === mode));
  }
  $('modeSeg').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    mode = b.dataset.m;
    LS.set('wiki_mode', mode);
    applyMode();
    if (mode !== 'view') $('ed').focus();
  });
  let pvT = null;
  function renderPreview() {
    const p = pages.get(cur);
    if (!p || p.type !== 'note') return;
    $('pv').innerHTML = WikiMd.render(p.body);
    decorate($('pv'));
  }
  $('ed').addEventListener('input', () => {
    const p = pages.get(cur);
    if (!p) return;
    p.body = $('ed').value;
    touch(p);
    clearTimeout(pvT);
    pvT = setTimeout(renderPreview, 160);
  });
  function insertAt(ta, text) {
    const s = ta.selectionStart, e = ta.selectionEnd;
    ta.setRangeText(text, s, e, 'end');
    ta.dispatchEvent(new Event('input'));
    ta.focus();
  }
  function lineStart(ta) { return ta.value.lastIndexOf('\n', ta.selectionStart - 1) + 1; }
  document.querySelectorAll('[data-md]').forEach((b) => b.addEventListener('click', () => {
    const ta = $('ed');
    const s = ta.selectionStart, e = ta.selectionEnd, sel = ta.value.slice(s, e);
    const k = b.dataset.md;
    if (k === 'h' || k === 'task') {
      const ls = lineStart(ta);
      const pre = k === 'h' ? '## ' : '- [ ] ';
      ta.setRangeText(pre, ls, ls, 'end');
      ta.setSelectionRange(e + pre.length, e + pre.length);
      ta.dispatchEvent(new Event('input'));
      ta.focus();
    } else if (k === 'b') {
      insertAt(ta, `**${sel || t('tBold')}**`);
    } else if (k === 'link') {
      insertAt(ta, `[[${sel || t('untitled')}]]`);
    }
  }));

  /* shared Markdown interactions (note preview + card preview) */
  function decorate(root) {
    root.querySelectorAll('a.wl').forEach((a) => { if (!findByTitle(a.dataset.page)) a.classList.add('new'); });
    hydrate(root);
  }
  const findByTitle = (title) => { const q = title.trim().toLowerCase(); return [...pages.values()].find((p) => (p.title || '').trim().toLowerCase() === q); };
  function bindMd(root, getText, setText) {
    root.addEventListener('click', (e) => {
      const wl = e.target.closest('a.wl');
      if (wl) {
        e.preventDefault();
        const title = wl.dataset.page.trim();
        let p = findByTitle(title);
        if (!p) p = newPage({ parentId: cur, title });
        if ($('cardDlg').open) $('cardDlg').close();
        open(p.id);
        return;
      }
      const img = e.target.closest('img');
      if (img) { $('lbImg').src = img.src; $('lightbox').showModal(); }
    });
    root.addEventListener('change', (e) => {
      const cb = e.target.closest('input[type=checkbox][data-line]');
      if (!cb) return;
      const lines = getText().split('\n');
      const n = +cb.dataset.line;
      if (lines[n] == null) return;
      lines[n] = lines[n].replace(/\[([ xX])\]/, cb.checked ? '[x]' : '[ ]');
      setText(lines.join('\n'));
    });
  }
  bindMd($('pv'), () => pages.get(cur).body, (v) => { const p = pages.get(cur); p.body = v; $('ed').value = v; touch(p); renderPreview(); });
  $('lightbox').addEventListener('click', () => $('lightbox').close());

  /* ---------- attachments ---------- */
  const urls = new Map();
  async function fileInfo(id) {
    if (urls.has(id)) return urls.get(id);
    const f = await S.getFile(id).catch(() => null);
    if (!f) return null;
    const info = { url: URL.createObjectURL(f.blob), type: f.type || '', name: f.name, size: f.size };
    urls.set(id, info);
    return info;
  }
  function hydrate(root) {
    root.querySelectorAll('span.att:not([data-done])').forEach(async (sp) => {
      sp.dataset.done = '1';
      const f = await fileInfo(sp.dataset.file);
      if (!sp.isConnected) return;
      if (!f) { sp.textContent = '⚠ ' + t('missingFile'); sp.classList.add('miss'); return; }
      const label = sp.dataset.alt || f.name;
      let n;
      if (sp.dataset.thumb) {
        if (!f.type.startsWith('image/')) { sp.remove(); return; }
        n = new Image(); n.src = f.url; n.alt = label;
      } else if (f.type.startsWith('image/')) {
        n = new Image(); n.src = f.url; n.alt = label; n.className = 'att-img'; n.loading = 'lazy';
      } else if (f.type.startsWith('audio/')) {
        n = document.createElement('span');
        n.className = 'att-audio';
        n.dataset.file = sp.dataset.file;
        const cap = document.createElement('span');
        cap.textContent = '🎙 ' + label;
        const a = document.createElement('audio');
        a.controls = true; a.preload = 'metadata'; a.src = f.url;
        n.append(cap, a);
      } else if (f.type.startsWith('video/')) {
        n = document.createElement('video');
        n.controls = true; n.preload = 'metadata'; n.src = f.url;
      } else {
        n = document.createElement('a');
        n.className = 'att-file'; n.href = f.url; n.download = f.name;
        n.textContent = `📎 ${label} (${fmtSize(f.size)})`;
      }
      sp.replaceWith(n);
    });
  }
  const mdName = (s) => s.replace(/[[\]()\n]/g, ' ').trim() || 'file';
  async function attachFiles(files, ta, pageId) {
    const parts = [];
    for (const f of files) {
      if (f.size > 50 * 1048576) UI.toast(t('bigFile', { s: fmtSize(f.size) }));
      const id = uid();
      const name = f.name || (f.type.startsWith('image/') ? 'image-' + stamp().replace(/\D/g, '') + '.' + (f.type.split('/')[1] || 'png') : 'file');
      try {
        await S.putFile({ id, pageId, name, type: f.type || 'application/octet-stream', size: f.size, blob: f, created: Date.now() });
      } catch (e) { UI.toast(t('saveFail')); continue; }
      parts.push((f.type.startsWith('image/') ? '!' : '') + `[${mdName(name)}](file:${id})`);
    }
    if (!parts.length) return;
    const before = ta.value.slice(0, ta.selectionStart);
    insertAt(ta, (before && !before.endsWith('\n') ? '\n' : '') + parts.join('\n') + '\n');
    UI.toast(t('attached', { n: parts.length }));
    askPersist();
  }
  let attachTarget = null;
  function pickFiles(kind, ta) {
    attachTarget = ta;
    $('fileIn').accept = kind === 'image' ? 'image/*' : '';
    $('fileIn').value = '';
    $('fileIn').click();
  }
  $('fileIn').addEventListener('change', () => {
    const files = [...$('fileIn').files];
    if (files.length && attachTarget) attachFiles(files, attachTarget, cur);
  });
  function wireDropPaste(ta, dropHost) {
    ta.addEventListener('paste', (e) => {
      const files = [...(e.clipboardData?.files || [])];
      if (!files.length) return;
      e.preventDefault();
      attachFiles(files, ta, cur);
    });
    dropHost.addEventListener('dragover', (e) => { if ([...e.dataTransfer.types].includes('Files')) { e.preventDefault(); dropHost.classList.add('drag'); } });
    dropHost.addEventListener('dragleave', () => dropHost.classList.remove('drag'));
    dropHost.addEventListener('drop', (e) => {
      dropHost.classList.remove('drag');
      const files = [...e.dataTransfer.files];
      if (!files.length) return;
      e.preventDefault();
      if (e.target === ta && document.caretPositionFromPoint) {
        const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
        if (pos && pos.offsetNode === ta) ta.setSelectionRange(pos.offset, pos.offset);
      }
      attachFiles(files, ta, cur);
    });
  }
  wireDropPaste($('ed'), $('nbody'));
  document.querySelectorAll('[data-att]').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.att;
    if (k === 'rec') toggleRec($('ed'));
    else pickFiles(k, $('ed'));
  }));

  /* voice recording */
  let rec = null;
  async function toggleRec(ta) {
    if (rec) { rec.mr.stop(); return; }
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { UI.toast(t('recUnsupported')); return; }
    let stream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e) { UI.toast(t('micDenied')); return; }
    const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'].find((m) => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m));
    const mr = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    const chunks = [];
    const pageId = cur;
    const r = { mr, ta, cancel: false, start: Date.now() };
    mr.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    mr.onstop = async () => {
      stream.getTracks().forEach((tr) => tr.stop());
      clearInterval(r.timer);
      rec = null;
      $('recBar').hidden = true;
      $('recBtn').classList.remove('on');
      if (r.cancel || !chunks.length) return;
      const type = (mr.mimeType || chunks[0].type || 'audio/webm').split(';')[0];
      const ext = type.includes('mp4') ? 'm4a' : type.includes('ogg') ? 'ogg' : 'webm';
      const file = new File(chunks, `${t('voiceMemo')} ${stamp()}.${ext}`, { type });
      if (ta === $('ed') && pageId !== cur) {
        const p = pages.get(pageId);
        if (!p) return;
        const id = uid();
        try { await S.putFile({ id, pageId, name: file.name, type, size: file.size, blob: file, created: Date.now() }); } catch (e) { UI.toast(t('saveFail')); return; }
        p.body += (p.body && !p.body.endsWith('\n') ? '\n' : '') + `[${mdName(file.name)}](file:${id})\n`;
        touch(p);
        UI.toast(t('attached', { n: 1 }));
        return;
      }
      await attachFiles([file], ta, pageId);
    };
    const tick = () => { const s = Math.floor((Date.now() - r.start) / 1000); $('recTime').textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
    r.timer = setInterval(tick, 250);
    tick();
    rec = r;
    mr.start(1000);
    $('recBar').hidden = false;
    $('recBtn').classList.add('on');
  }
  $('recStop').onclick = () => rec && rec.mr.stop();
  $('recCancel').onclick = () => { if (rec) { rec.cancel = true; rec.mr.stop(); } };

  /* ---------- board ---------- */
  const firstImage = (s) => (/!\[[^\]]*\]\(file:([\w-]+)\)/.exec(s) || [])[1];
  function cardMeta(k) {
    const m = [];
    const all = (k.body.match(/^\s*[-*+]\s+\[[ xX]\]/gm) || []).length;
    if (all) m.push('☑ ' + (k.body.match(/^\s*[-*+]\s+\[[xX]\]/gm) || []).length + '/' + all);
    const files = (k.body.match(/\]\(file:[\w-]+\)/g) || []).length;
    if (files) m.push('📎 ' + files);
    if (k.body.trim() && !all && !files) m.push('≡');
    return m.map((x) => `<span>${esc(x)}</span>`).join('');
  }
  function renderBoard() {
    const p = pages.get(cur);
    const b = $('board');
    const sx = b.scrollLeft;
    b.innerHTML = '';
    p.columns.forEach((col, ci) => {
      const c = document.createElement('div');
      c.className = 'col';
      c.dataset.ci = ci;
      c.innerHTML = `<div class="colh"><input class="coltitle" value="${esc(col.title)}" aria-label="${esc(t('column'))}"><span class="cnt">${col.cards.length}</span><button class="ibtn cl" title="${esc(t('moveLeft'))}"${ci ? '' : ' disabled'}>‹</button><button class="ibtn cr" title="${esc(t('moveRight'))}"${ci < p.columns.length - 1 ? '' : ' disabled'}>›</button><button class="ibtn cdel" title="${esc(t('delCol'))}">✕</button></div><div class="cards"></div><button class="addcard">＋ ${esc(t('addCard'))}</button>`;
      const list = c.querySelector('.cards');
      col.cards.forEach((k, ki) => {
        const el = document.createElement('div');
        el.className = 'kcard';
        el.draggable = true;
        el.dataset.ki = ki;
        if (k.color) el.style.borderLeftColor = k.color;
        const img = firstImage(k.body);
        el.innerHTML = (img ? `<div class="kthumb"><span class="att" data-file="${img}" data-thumb="1"></span></div>` : '') + `<div class="kt">${esc(k.title || t('untitled'))}</div><div class="km">${cardMeta(k)}</div>`;
        list.appendChild(el);
      });
      b.appendChild(c);
    });
    const add = document.createElement('button');
    add.className = 'btn addcol';
    add.textContent = t('addCol');
    add.onclick = () => { p.columns.push({ id: uid(), title: t('newCol'), cards: [] }); touch(p); renderBoard(); const inp = b.querySelectorAll('.coltitle'); const last = inp[inp.length - 1]; last.focus(); last.select(); };
    b.appendChild(add);
    b.scrollLeft = sx;
    hydrate(b);
  }
  $('board').addEventListener('input', (e) => {
    if (!e.target.classList.contains('coltitle')) return;
    const p = pages.get(cur);
    p.columns[+e.target.closest('.col').dataset.ci].title = e.target.value;
    touch(p);
  });
  $('board').addEventListener('keydown', (e) => { if (e.target.classList.contains('coltitle') && e.key === 'Enter') e.target.blur(); });
  $('board').addEventListener('click', (e) => {
    const p = pages.get(cur);
    const colEl = e.target.closest('.col');
    if (!colEl) return;
    const ci = +colEl.dataset.ci;
    const col = p.columns[ci];
    if (e.target.closest('.cdel')) {
      if (col.cards.length && !confirm(t('colDelConfirm', { t: col.title, n: col.cards.length }))) return;
      p.columns.splice(ci, 1); touch(p); renderBoard(); return;
    }
    if (e.target.closest('.cl') || e.target.closest('.cr')) {
      const j = ci + (e.target.closest('.cl') ? -1 : 1);
      [p.columns[ci], p.columns[j]] = [p.columns[j], p.columns[ci]];
      touch(p); renderBoard(); return;
    }
    if (e.target.closest('.addcard')) { openNewCard(colEl, ci); return; }
    const card = e.target.closest('.kcard');
    if (card) openCard(ci, +card.dataset.ki);
  });
  function openNewCard(colEl, ci) {
    const btn = colEl.querySelector('.addcard');
    const ta = document.createElement('textarea');
    ta.className = 'newcard';
    ta.placeholder = t('newCardPh');
    btn.replaceWith(ta);
    ta.focus();
    const done = () => { if (ta.isConnected) renderBoard(); };
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { e.preventDefault(); done(); return; }
      if (e.key !== 'Enter' || e.shiftKey || e.isComposing) return;
      e.preventDefault();
      const v = ta.value.trim();
      if (!v) { done(); return; }
      const p = pages.get(cur);
      p.columns[ci].cards.push({ id: uid(), title: v, body: '', color: '' });
      touch(p);
      renderBoard();
      const again = $('board').querySelectorAll('.col')[ci];
      if (again) openNewCard(again, ci);
    });
    ta.addEventListener('blur', () => setTimeout(() => {
      const v = ta.value.trim();
      if (!ta.isConnected) return;
      if (v) { const p = pages.get(cur); p.columns[ci].cards.push({ id: uid(), title: v, body: '', color: '' }); touch(p); }
      renderBoard();
    }, 120));
  }
  /* card drag & drop */
  let dragCard = null;
  $('board').addEventListener('dragstart', (e) => {
    const el = e.target.closest('.kcard');
    if (!el) return;
    dragCard = { ci: +el.closest('.col').dataset.ci, ki: +el.dataset.ki };
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', el.textContent);
    requestAnimationFrame(() => el.classList.add('dragging'));
  });
  function cardDropIndex(list, y) {
    const cards = [...list.querySelectorAll('.kcard:not(.dragging)')];
    const i = cards.findIndex((c) => { const r = c.getBoundingClientRect(); return y < r.top + r.height / 2; });
    return { cards, i };
  }
  $('board').addEventListener('dragover', (e) => {
    if (!dragCard) return;
    const colEl = e.target.closest('.col');
    if (!colEl) return;
    e.preventDefault();
    clearDrop();
    document.querySelectorAll('.cards.drop-end').forEach((n) => n.classList.remove('drop-end'));
    const list = colEl.querySelector('.cards');
    const { cards, i } = cardDropIndex(list, e.clientY);
    if (i < 0) list.classList.add('drop-end'); else cards[i].classList.add('drop-before');
  });
  $('board').addEventListener('drop', (e) => {
    if (!dragCard) return;
    const colEl = e.target.closest('.col');
    if (!colEl) return;
    e.preventDefault();
    const p = pages.get(cur);
    const list = colEl.querySelector('.cards');
    const { cards, i } = cardDropIndex(list, e.clientY);
    const toCi = +colEl.dataset.ci;
    let toKi = i < 0 ? p.columns[toCi].cards.length : +cards[i].dataset.ki;
    const [card] = p.columns[dragCard.ci].cards.splice(dragCard.ki, 1);
    if (toCi === dragCard.ci && toKi > dragCard.ki) toKi--;
    p.columns[toCi].cards.splice(Math.max(0, toKi), 0, card);
    dragCard = null;
    touch(p);
    renderBoard();
  });
  $('board').addEventListener('dragend', () => { dragCard = null; clearDrop(); document.querySelectorAll('.drop-end,.dragging').forEach((n) => n.classList.remove('drop-end', 'dragging')); });

  /* card dialog */
  let open_card = null;
  const curCard = () => { if (!open_card) return null; const p = pages.get(open_card.pageId); if (!p) return null; for (const c of p.columns) { const k = c.cards.find((x) => x.id === open_card.id); if (k) return { p, c, k }; } return null; };
  function openCard(ci, ki) {
    const p = pages.get(cur);
    const k = p.columns[ci].cards[ki];
    open_card = { pageId: p.id, id: k.id };
    $('cTitle').value = k.title;
    $('cBody').value = k.body;
    const sel = $('cCol');
    sel.innerHTML = '';
    p.columns.forEach((c, i) => sel.add(new Option(c.title || '—', i)));
    sel.value = ci;
    renderSwatches(k.color);
    renderCardPv();
    $('cardDlg').showModal();
    $('cTitle').blur();
  }
  function renderSwatches(color) {
    $('cColors').innerHTML = COLORS.map((c) => `<button data-c="${c}" class="${c === color ? 'on' : ''}" style="background:${c || 'var(--line)'}" aria-label="${c || 'none'}"></button>`).join('');
  }
  function renderCardPv() { const x = curCard(); if (!x) return; $('cPv').innerHTML = WikiMd.render(x.k.body); decorate($('cPv')); }
  let cpvT = null;
  $('cTitle').addEventListener('input', () => { const x = curCard(); if (!x) return; x.k.title = $('cTitle').value; touch(x.p); });
  $('cBody').addEventListener('input', () => { const x = curCard(); if (!x) return; x.k.body = $('cBody').value; touch(x.p); clearTimeout(cpvT); cpvT = setTimeout(renderCardPv, 160); });
  $('cColors').addEventListener('click', (e) => { const b = e.target.closest('button'); const x = curCard(); if (!b || !x) return; x.k.color = b.dataset.c; touch(x.p); renderSwatches(x.k.color); });
  $('cCol').addEventListener('change', () => {
    const x = curCard();
    if (!x) return;
    const to = x.p.columns[+$('cCol').value];
    if (!to || to === x.c) return;
    x.c.cards.splice(x.c.cards.indexOf(x.k), 1);
    to.cards.push(x.k);
    touch(x.p);
  });
  $('cDel').onclick = () => {
    const x = curCard();
    if (!x || !confirm(t('cardDelConfirm'))) return;
    x.c.cards.splice(x.c.cards.indexOf(x.k), 1);
    touch(x.p);
    $('cardDlg').close();
  };
  $('cClose').onclick = () => $('cardDlg').close();
  $('cardDlg').addEventListener('close', () => { if (rec && rec.ta === $('cBody')) { rec.cancel = true; rec.mr.stop(); } open_card = null; if (pages.get(cur)?.type === 'board') renderBoard(); });
  $('cardDlg').addEventListener('click', (e) => { if (e.target === $('cardDlg')) $('cardDlg').close(); });
  $('cTitle').addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); $('cBody').focus(); } });
  bindMd($('cPv'), () => curCard()?.k.body || '', (v) => { const x = curCard(); if (!x) return; x.k.body = v; $('cBody').value = v; touch(x.p); renderCardPv(); });
  wireDropPaste($('cBody'), $('cBody'));
  document.querySelectorAll('[data-catt]').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.catt;
    if (k === 'rec') toggleRec($('cBody'));
    else pickFiles(k, $('cBody'));
  }));

  /* ---------- search, keys, mobile ---------- */
  $('q').addEventListener('input', renderTreeSoon);
  $('q').addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { $('q').value = ''; renderTree(); }
    if (e.key === 'Enter') { const f = $('tree').querySelector('[data-id]'); if (f) open(f.dataset.id); }
  });
  document.addEventListener('keydown', (e) => {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === 'k') { e.preventDefault(); $('app').classList.add('side-open'); $('q').focus(); $('q').select(); }
    if (mod && e.key.toLowerCase() === 's') { e.preventDefault(); flush().then(() => UI.toast(t('savedNow'))); }
  });
  $('sideBtn').onclick = () => $('app').classList.toggle('side-open');
  $('main').addEventListener('click', () => $('app').classList.remove('side-open'));
  window.addEventListener('hashchange', () => { const id = location.hash.slice(1); if (id && id !== cur && pages.has(id)) open(id); });

  /* ---------- data menu ---------- */
  function download(blob, name) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }
  const blobToDataURL = (b) => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = () => rej(r.error); r.readAsDataURL(b); });
  async function showStorage() {
    const files = await S.allFiles().catch(() => []);
    let s = t('storeStats', { p: pages.size, f: files.length });
    if (navigator.storage?.estimate) {
      const est = await navigator.storage.estimate().catch(() => null);
      if (est) s += ' · ' + t('storeUse', { u: fmtSize(est.usage || 0), q: fmtSize(Math.max(0, (est.quota || 0) - (est.usage || 0))) });
    }
    const pers = navigator.storage?.persisted ? await navigator.storage.persisted().catch(() => false) : false;
    $('storeInfo').textContent = s + '\n' + (pers ? '🔒 ' + t('persisted') : 'ℹ️ ' + t('notPersisted'));
    $('storeInfo').style.whiteSpace = 'pre-line';
  }
  $('menuBtn').onclick = () => { $('menuDlg').showModal(); showStorage(); };
  $('menuClose').onclick = () => $('menuDlg').close();
  $('expBtn').onclick = async () => {
    await flush();
    const files = await S.allFiles();
    const out = { app: 'cocy-wiki', version: 1, exported: new Date().toISOString(), pages: [...pages.values()], files: [] };
    for (const f of files) out.files.push({ id: f.id, pageId: f.pageId, name: f.name, type: f.type, size: f.size, created: f.created, data: await blobToDataURL(f.blob) });
    download(new Blob([JSON.stringify(out)], { type: 'application/json' }), `wiki-backup-${stamp().replace(/[: ]/g, '-')}.json`);
    UI.toast(t('exported'));
  };
  $('impBtn').onclick = () => { $('impIn').value = ''; $('impIn').click(); };
  $('impIn').addEventListener('change', async () => {
    const f = $('impIn').files[0];
    if (!f) return;
    let data;
    try { data = JSON.parse(await f.text()); } catch (e) { data = null; }
    if (!data || data.app !== 'cocy-wiki' || !Array.isArray(data.pages)) { UI.toast(t('badBackup')); return; }
    const files = Array.isArray(data.files) ? data.files : [];
    if (!confirm(t('importConfirm', { p: data.pages.length, f: files.length }))) return;
    try {
      await flush();
      const list = data.pages.filter((p) => p && p.id).map(normalize);
      await S.putPages(list);
      for (const x of files) {
        if (!x || !x.id || typeof x.data !== 'string' || !x.data.startsWith('data:')) continue;
        const blob = await (await fetch(x.data)).blob();
        await S.putFile({ id: String(x.id), pageId: x.pageId ? String(x.pageId) : null, name: String(x.name || 'file'), type: String(x.type || blob.type), size: blob.size, blob, created: Number(x.created) || Date.now() });
        const u = urls.get(String(x.id));
        if (u) { URL.revokeObjectURL(u.url); urls.delete(String(x.id)); }
      }
      list.forEach((p) => pages.set(p.id, p));
      if (bc) bc.postMessage({ type: 'pages' });
      $('menuDlg').close();
      UI.toast(t('imported'));
      open(cur && pages.has(cur) ? cur : children(null)[0]?.id || null);
    } catch (e) { UI.toast(t('saveFail')); }
  });
  $('gcBtn').onclick = async () => {
    await flush();
    const used = new Set();
    for (const p of pages.values()) for (const m of pageText(p).matchAll(/\(file:([\w-]+)\)/g)) used.add(m[1]);
    const files = await S.allFiles();
    const unused = files.filter((f) => !used.has(f.id));
    if (!unused.length) { UI.toast(t('gcNone')); return; }
    if (!confirm(t('gcConfirm', { n: unused.length, s: fmtSize(unused.reduce((a, f) => a + (f.size || 0), 0)) }))) return;
    await S.deleteFiles(unused.map((f) => f.id));
    unused.forEach((f) => { const u = urls.get(f.id); if (u) { URL.revokeObjectURL(u.url); urls.delete(f.id); } });
    showStorage();
  };

  /* ---------- other tabs ---------- */
  if (bc) bc.onmessage = async () => {
    const list = await S.allPages().catch(() => null);
    if (!list) return;
    const fresh = new Map(list.map((p) => [p.id, normalize(p)]));
    dirty.forEach((p, id) => fresh.set(id, p));
    pages = fresh;
    renderTree();
    const editing = ['ed', 'pTitle'].includes(document.activeElement?.id) || $('cardDlg').open || document.activeElement?.closest?.('#board');
    if (!pages.has(cur)) open(children(null)[0]?.id || null);
    else if (!editing) renderMain(true);
  };

  document.addEventListener('i18n:change', () => { renderTree(); renderMain(); setSaved(!dirty.size); });

  /* ---------- boot ---------- */
  (async () => {
    applyMode();
    let list;
    try { list = await S.allPages(); } catch (e) {
      $('page').hidden = true; $('blank').hidden = false; $('blank').textContent = t('dbFail');
      return;
    }
    list.forEach((p) => pages.set(p.id, normalize(p)));
    if (!pages.size && !LS.get('wiki_seeded', false)) {
      LS.set('wiki_seeded', true);
      const board = newPage({ type: 'board', title: t('seedBoard'), icon: '📋' });
      board.columns[0].cards.push({ id: uid(), title: t('seedCard1'), body: '', color: '#3b82f6' }, { id: uid(), title: t('seedCard2'), body: '', color: '' });
      board.columns[2].cards.push({ id: uid(), title: t('seedCard3'), body: '- [x] ' + t('seedCard3'), color: '#10b981' });
      const home = newPage({ type: 'note', title: t('seedWelcome'), icon: '👋', body: t('seedBody', { board: t('seedBoard') }) });
      home.order = -1;
      await flush();
      cur = home.id;
    }
    setSaved(true);
    const want = location.hash.slice(1) || LS.get('wiki_cur', null);
    open(pages.has(want) ? want : children(null)[0]?.id || null);
  })();
})();
