(() => {
  const rsvp = document.querySelector('.rsvp');
  if (!rsvp || document.getElementById('guestbook')) return;

  const textarea = rsvp.querySelector('textarea');
  if (!textarea) return;

  const label = textarea.closest('.field')?.querySelector('label');
  if (label) label.textContent = 'Ucapan & Doa';
  textarea.placeholder = 'Tuliskan ucapan dan doa untuk Azfar & Azraf...';

  const style = document.createElement('style');
  style.textContent = `.guestbook-wrap{margin:18px 0 20px;padding:18px;border:1px solid rgba(212,175,55,.25);border-radius:20px;background:#fff}.guestbook-title{font-family:"Cormorant Garamond",Georgia,serif;font-size:25px;font-weight:600;color:var(--navy);margin-bottom:4px}.guestbook-sub{font-size:11px;color:var(--muted);line-height:1.6}.guestbook-list{display:grid;gap:9px;margin-top:14px;max-height:310px;overflow:auto}.guestbook-entry{padding:13px 14px;border:1px solid #e8e4da;border-radius:15px;background:#fbfaf6}.guestbook-entry b{display:block;color:var(--navy);font-size:12px}.guestbook-entry p{margin:4px 0 0;color:#536579;font-family:"Cormorant Garamond",Georgia,serif;font-size:17px;line-height:1.35}.guestbook-entry time{display:block;margin-top:5px;color:#9aa5b2;font-size:9px}.guestbook-empty{margin-top:12px;color:#9aa5b2;font-size:11px}.guestbook-status{margin-top:8px;font-size:10px;color:#9aa5b2}.guestbook-status.error{color:#a55b5b}`;
  document.head.appendChild(style);

  const field = textarea.closest('.field');
  const wrap = document.createElement('div');
  wrap.id = 'guestbook';
  wrap.className = 'guestbook-wrap';
  wrap.innerHTML = `<div class="guestbook-title">Ucapan & Doa</div><div class="guestbook-sub">Ucapan yang dikirim akan tersimpan menjadi buku doa digital dan dapat dibaca oleh tamu lainnya.</div><div class="guestbook-list" id="guestbookList"><div class="guestbook-empty">Memuat ucapan...</div></div><div class="guestbook-status" id="guestbookStatus"></div>`;
  field?.after(wrap);

  const list = wrap.querySelector('#guestbookList');
  const status = wrap.querySelector('#guestbookStatus');

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  }

  function render(entries) {
    if (!entries.length) {
      list.innerHTML = '<div class="guestbook-empty">Belum ada ucapan. Jadilah yang pertama mengirim doa. 🤍</div>';
      return;
    }
    list.innerHTML = entries.map(entry => {
      const date = entry.created_at ? new Date(entry.created_at.replace(' ', 'T') + 'Z') : null;
      const dateText = date && !Number.isNaN(date.getTime())
        ? date.toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })
        : '';
      return `<article class="guestbook-entry"><b>${escapeHtml(entry.name)}</b><p>“${escapeHtml(entry.message)}”</p>${dateText ? `<time>${dateText}</time>` : ''}</article>`;
    }).join('');
  }

  async function loadEntries() {
    try {
      const response = await fetch('/api/guestbook', { cache:'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Guestbook belum tersedia.');
      render(Array.isArray(data.entries) ? data.entries : []);
      status.textContent = '';
    } catch (error) {
      list.innerHTML = '<div class="guestbook-empty">Buku doa sedang disiapkan.</div>';
      status.textContent = error.message || '';
      status.classList.add('error');
    }
  }

  let saving = false;
  let resubmitting = false;
  const form = rsvp.tagName === 'FORM' ? rsvp : rsvp.closest('form');

  async function saveBeforeSend() {
    if (saving) return false;
    saving = true;
    status.classList.remove('error');
    status.textContent = 'Menyimpan ucapan...';
    const nameInput = rsvp.querySelector('input[type="text"], input:not([type])');
    const name = nameInput?.value.trim() || '';
    const message = textarea.value.trim();
    if (!name || !message) {
      status.textContent = 'Nama dan ucapan perlu diisi agar dapat disimpan.';
      status.classList.add('error');
      saving = false;
      return false;
    }

    try {
      const response = await fetch('/api/guestbook', {
        method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({ name, message })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Ucapan belum dapat disimpan.');
      status.textContent = 'Ucapan tersimpan. 🤍';
      await loadEntries();
      return true;
    } catch (error) {
      status.textContent = error.message || 'Ucapan belum dapat disimpan.';
      status.classList.add('error');
      return false;
    } finally {
      saving = false;
    }
  }

  if (form) {
    form.addEventListener('submit', async event => {
      if (resubmitting) return;
      event.preventDefault();
      const saved = await saveBeforeSend();
      if (!saved) return;
      resubmitting = true;
      form.requestSubmit();
    }, true);
  }

  loadEntries();
})();
