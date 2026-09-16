(() => {
  const rsvp = document.querySelector('.rsvp');
  if (!rsvp || document.getElementById('guestbook')) return;

  const textarea = rsvp.querySelector('#rsvpMsg, textarea');
  const nameInput = rsvp.querySelector('#rsvpName, input');
  const attendance = rsvp.querySelector('#rsvpAttend, select');
  const guestCount = rsvp.querySelector('#rsvpCount, select:nth-of-type(2)');
  const oldButton = rsvp.querySelector('#sendRsvp, button');
  if (!textarea || !nameInput || !attendance || !guestCount || !oldButton) return;

  const textareaField = textarea.closest('.field');
  const label = textareaField?.querySelector('label');
  if (label) label.textContent = 'Ucapan & Doa';
  textarea.placeholder = 'Tuliskan ucapan dan doa untuk Azfar & Azraf...';

  const style = document.createElement('style');
  style.textContent = `
    .guestbook-wrap{margin:28px 0 0;padding:18px;border:1px solid rgba(212,175,55,.25);border-radius:20px;background:#fff}
    .guestbook-title{font-family:"Cormorant Garamond",Georgia,serif;font-size:25px;font-weight:600;color:var(--navy);margin-bottom:4px}
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
    #tandaKasih{margin:18px 0 16px!important;padding:0!important;background:transparent!important}
    #tandaKasih .gift-card{margin:14px 0 0!important;padding:0!important;border:0!important;box-shadow:none!important}
    #tandaKasih .gift-intro{display:none}
    #tandaKasih .gift-field{margin-bottom:0}
  `;
  document.head.appendChild(style);

  // Tanda Kasih menjadi bagian dari alur RSVP, tepat setelah Ucapan & Doa dan sebelum tombol Kirim.
  const giftSection = document.getElementById('tandaKasih');
  const giftSelect = document.getElementById('giftType');
  if (giftSection) rsvp.insertBefore(giftSection, oldButton);

  // Ganti tombol lama agar listener WhatsApp dari halaman lama tidak ikut terbawa.
  const submitButton = oldButton.cloneNode(true);
  submitButton.id = 'sendRsvp';
  submitButton.innerHTML = 'Kirim RSVP & Ucapan 🤍';
  submitButton.type = 'button';
  submitButton.classList.add('guestbook-save');
  oldButton.replaceWith(submitButton);

  const success = document.createElement('div');
  success.className = 'rsvp-success';
  success.innerHTML = 'Terima kasih. RSVP dan ucapan Anda telah tersimpan. 🤍<br><small>Semoga doa baiknya menjadi kebahagiaan untuk Azfar & Azraf.</small>';
  submitButton.insertAdjacentElement('afterend', success);

  const wrap = document.createElement('div');
  wrap.id = 'guestbook';
  wrap.className = 'guestbook-wrap';
  wrap.innerHTML = `<div class="guestbook-title">📖 Ucapan & Doa</div><div class="guestbook-list" id="guestbookList"><div class="guestbook-empty">Memuat ucapan...</div></div><div class="guestbook-status" id="guestbookStatus"></div>`;
  rsvp.closest('.section')?.appendChild(wrap);

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
      const dateText = date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'}) : '';
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

  function syncAttendance() {
    const absent = /tidak\s*hadir/i.test(attendance.value || '');
    guestCount.disabled = absent;
    if (absent) guestCount.value = '0';
    else if (!Number(guestCount.value)) guestCount.value = '1';
  }
  attendance.addEventListener('change', syncAttendance);
  syncAttendance();

  let saving = false;
  submitButton.addEventListener('click', async event => {
    event.preventDefault();
    event.stopPropagation();
    if (saving) return;

    const name = nameInput.value.trim();
    const attend = attendance.value.trim();
    const message = textarea.value.trim();
    const countValue = Number(guestCount.value);
    const gift = giftSelect?.value || '';
    const isAbsent = /tidak\s*hadir/i.test(attend);
    const count = isAbsent ? 0 : (Number.isFinite(countValue) ? countValue : 1);

    status.classList.remove('error');
    success.classList.remove('show');

    if (!name) {
      status.textContent = 'Nama wajib diisi.';
      status.classList.add('error');
      nameInput.focus();
      return;
    }
    if (!attend) {
      status.textContent = 'Silakan pilih kehadiran.';
      status.classList.add('error');
      attendance.focus();
      return;
    }
    if (!message || message.length < 3) {
      status.textContent = 'Ucapan & Doa wajib diisi.';
      status.classList.add('error');
      textarea.focus();
      return;
    }
    if (!isAbsent && (count < 1 || count > 20)) {
      status.textContent = 'Jumlah tamu harus antara 1 dan 20.';
      status.classList.add('error');
      guestCount.focus();
      return;
    }

    saving = true;
    submitButton.disabled = true;
    status.textContent = 'Menyimpan RSVP...';

    try {
      const response = await fetch('/api/guestbook', {
        method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({name, attendance:attend, guest_count:count, message, gift_type:gift})
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'RSVP belum dapat disimpan.');

      success.classList.add('show');
      status.textContent = 'Tersimpan di buku tamu. 🤍';
      rsvp.querySelectorAll('input, textarea').forEach(el => { if (el !== nameInput) el.value = ''; });
      nameInput.value = '';
      guestCount.value = '1';
      attendance.value = 'Hadir';
      if (giftSelect) giftSelect.value = '';
      document.getElementById('digitalGift')?.classList.remove('show');
      document.getElementById('physicalGift')?.classList.remove('show');
      await loadEntries();
    } catch (error) {
      status.textContent = error.message || 'RSVP belum dapat disimpan.';
      status.classList.add('error');
    } finally {
      saving = false;
      submitButton.disabled = false;
    }
  });

  if (giftSelect) giftSelect.setAttribute('aria-label', 'Bentuk Tanda Kasih, opsional');
  loadEntries();
})();
