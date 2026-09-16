(() => {
  const rsvp = document.querySelector('.rsvp');
  if (!rsvp || document.getElementById('guestbook')) return;

  const form = rsvp.tagName === 'FORM' ? rsvp : rsvp.closest('form');
  const textarea = rsvp.querySelector('textarea');
  if (!form || !textarea) return;

  const fields = [...rsvp.querySelectorAll('.field')];
  const nameField = fields.find(f => /nama/i.test(f.querySelector('label')?.textContent || '')) || fields[0];
  const attendanceField = fields.find(f => /kehadiran/i.test(f.querySelector('label')?.textContent || ''));
  const countField = fields.find(f => /jumlah\s*tamu/i.test(f.querySelector('label')?.textContent || ''));
  const nameInput = nameField?.querySelector('input');
  const attendance = attendanceField?.querySelector('select');
  const guestCount = countField?.querySelector('select, input');
  const textareaField = textarea.closest('.field');

  const label = textareaField?.querySelector('label');
  if (label) label.textContent = 'Ucapan & Doa';
  textarea.placeholder = 'Tuliskan ucapan dan doa untuk Azfar & Azraf...';

  const style = document.createElement('style');
  style.textContent = `
    .guestbook-wrap{margin:18px 0 20px;padding:18px;border:1px solid rgba(212,175,55,.25);border-radius:20px;background:#fff}
    .guestbook-title{font-family:"Cormorant Garamond",Georgia,serif;font-size:25px;font-weight:600;color:var(--navy);margin-bottom:4px}
    .guestbook-sub{font-size:11px;color:var(--muted);line-height:1.6}
    .guestbook-list{display:grid;gap:9px;margin-top:14px;max-height:310px;overflow:auto}
    .guestbook-entry{padding:13px 14px;border:1px solid #e8e4da;border-radius:15px;background:#fbfaf6}
    .guestbook-entry b{display:block;color:var(--navy);font-size:12px}
    .guestbook-entry p{margin:4px 0 0;color:#536579;font-family:"Cormorant Garamond",Georgia,serif;font-size:17px;line-height:1.35}
    .guestbook-entry time{display:block;margin-top:5px;color:#9aa5b2;font-size:9px}
    .guestbook-empty{margin-top:12px;color:#9aa5b2;font-size:11px}
    .guestbook-status{margin-top:8px;font-size:10px;color:#9aa5b2}
    .guestbook-status.error{color:#a55b5b}
    .rsvp-success{display:none;margin-top:14px;padding:14px 15px;border-radius:16px;background:#fbf8ef;border:1px solid rgba(212,175,55,.35);color:var(--navy);font-size:12px;text-align:center;line-height:1.6}
    .rsvp-success.show{display:block}
    #tandaKasih{margin:20px 0 16px;padding:0!important;background:transparent!important}
    #tandaKasih .gift-card{margin:14px 0 0!important}
    .guestbook-save{margin-top:8px!important}
  `;
  document.head.appendChild(style);

  // Tanda Kasih menjadi bagian dari alur RSVP: setelah Ucapan & Doa, sebelum tombol Kirim.
  const giftSection = document.getElementById('tandaKasih');
  if (giftSection) {
    form.insertBefore(giftSection, form.querySelector('button[type="submit"], input[type="submit"]') || null);
  }

  const giftSelect = document.getElementById('giftType');
  const giftTypeNames = {
    presence: 'Doa & Kehadiran',
    physical: 'Hadiah',
    digital: 'Tanda Kasih Digital'
  };

  // Ambil tombol submit yang sudah ada dan ubah fungsinya menjadi simpan ke D1.
  const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
  if (submitButton) {
    if (submitButton.tagName === 'INPUT') submitButton.value = 'Kirim RSVP & Ucapan 🤍';
    else submitButton.innerHTML = 'Kirim RSVP & Ucapan 🤍';
    submitButton.classList.add('guestbook-save');
  }

  // Status hasil submit ditempatkan tepat setelah tombol.
  const success = document.createElement('div');
  success.className = 'rsvp-success';
  success.innerHTML = 'Terima kasih. RSVP dan ucapan Anda telah tersimpan. 🤍<br><small>Semoga doa baiknya menjadi kebahagiaan untuk Azfar & Azraf.</small>';
  submitButton?.insertAdjacentElement('afterend', success);

  const wrap = document.createElement('div');
  wrap.id = 'guestbook';
  wrap.className = 'guestbook-wrap';
  wrap.innerHTML = `<div class="guestbook-title">📖 Ucapan & Doa</div><div class="guestbook-sub">Ucapan yang disetujui akan tersimpan menjadi buku doa digital dan dapat dibaca oleh tamu lainnya.</div><div class="guestbook-list" id="guestbookList"><div class="guestbook-empty">Memuat ucapan...</div></div><div class="guestbook-status" id="guestbookStatus"></div>`;
  form.closest('.section')?.appendChild(wrap);

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
        ? date.toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})
        : '';
      return `<article class="guestbook-entry"><b>${escapeHtml(entry.name)}</b><p>“${escapeHtml(entry.message)}”</p>${dateText ? `<time>${dateText}</time>` : ''}</article>`;
    }).join('');
  }

  async function loadEntries() {
    try {
      const response = await fetch('/api/guestbook', {cache:'no-store'});
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Buku doa belum tersedia.');
      render(Array.isArray(data.entries) ? data.entries : []);
      status.textContent = '';
      status.classList.remove('error');
    } catch (error) {
      list.innerHTML = '<div class="guestbook-empty">Buku doa sedang disiapkan.</div>';
      status.textContent = error.message || '';
      status.classList.add('error');
    }
  }

  function getGuestCount() {
    if (!guestCount) return 1;
    const value = Number(guestCount.value);
    return Number.isFinite(value) ? Math.max(0, Math.min(20, value)) : 1;
  }

  function syncAttendance() {
    if (!attendance || !guestCount) return;
    const absent = /tidak\s*hadir/i.test(attendance.value || '');
    guestCount.disabled = absent;
    if (absent) guestCount.value = '0';
    else if (!Number(guestCount.value)) guestCount.value = '1';
  }
  attendance?.addEventListener('change', syncAttendance);
  syncAttendance();

  let saving = false;
  form.addEventListener('submit', async event => {
    // Capture phase + stopImmediatePropagation memastikan handler submit lama yang mengarah ke WhatsApp tidak berjalan.
    event.preventDefault();
    event.stopImmediatePropagation();
    if (saving) return;

    const name = nameInput?.value.trim() || '';
    const attend = attendance?.value.trim() || '';
    const message = textarea.value.trim();
    const count = getGuestCount();
    const gift = giftSelect?.value || '';

    status.classList.remove('error');
    success.classList.remove('show');

    if (!name) {
      status.textContent = 'Nama wajib diisi.';
      status.classList.add('error');
      nameInput?.focus();
      return;
    }
    if (!attend) {
      status.textContent = 'Silakan pilih kehadiran.';
      status.classList.add('error');
      attendance?.focus();
      return;
    }
    if (!message || message.length < 3) {
      status.textContent = 'Ucapan & Doa wajib diisi.';
      status.classList.add('error');
      textarea.focus();
      return;
    }
    if (/hadir/i.test(attend) && count < 1) {
      status.textContent = 'Jumlah tamu minimal 1 untuk kehadiran Hadir.';
      status.classList.add('error');
      guestCount?.focus();
      return;
    }

    saving = true;
    if (submitButton) submitButton.disabled = true;
    status.textContent = 'Menyimpan RSVP...';

    try {
      const response = await fetch('/api/guestbook', {
        method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({
          name,
          attendance: attend,
          guest_count: /tidak\s*hadir/i.test(attend) ? 0 : count,
          message,
          gift_type: gift
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'RSVP belum dapat disimpan.');

      success.classList.add('show');
      status.textContent = 'Tersimpan di buku tamu. 🤍';
      form.reset();
      syncAttendance();
      if (giftSelect) {
        document.getElementById('digitalGift')?.classList.remove('show');
        document.getElementById('physicalGift')?.classList.remove('show');
      }
      await loadEntries();
    } catch (error) {
      status.textContent = error.message || 'RSVP belum dapat disimpan.';
      status.classList.add('error');
    } finally {
      saving = false;
      if (submitButton) submitButton.disabled = false;
    }
  }, true);

  // Pastikan label pilihan Tanda Kasih tetap jelas.
  if (giftSelect) {
    giftSelect.setAttribute('aria-label', 'Bentuk Tanda Kasih, opsional');
  }

  loadEntries();
})();
