(() => {
  // Hero: hapus tanggal/jam dari pembuka agar lebih bersih.
  document.querySelectorAll('.hero .hero-copy')[1]?.remove();

  // Mirror foto Azfar & Azraf secara horizontal.
  const photoStyle = document.createElement('style');
  photoStyle.textContent = `.photo img{transform:scaleX(-1)}.gallery figure:first-child{aspect-ratio:4/5}.gallery figure:first-child img{transform:scale(1.18);transform-origin:center center}`;
  document.head.appendChild(photoStyle);

  // Siapkan backsound sejak halaman dibuka agar klik "Buka Undangan" terasa lebih instan.
  const bgMusic = document.getElementById('bgMusic');
  if (bgMusic) {
    bgMusic.preload = 'auto';
    bgMusic.load();
    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.as = 'audio';
    preload.href = bgMusic.currentSrc || bgMusic.src;
    preload.type = 'audio/mpeg';
    document.head.appendChild(preload);
  }

  // Tanda kasih: ditampilkan sebagai bagian opsional dengan bahasa yang halus.
  const rsvp = document.querySelector('.rsvp');
  if (rsvp && !document.getElementById('tandaKasih')) {
    const section = document.createElement('section');
    section.id = 'tandaKasih';
    section.className = 'section cream center reveal';
    section.innerHTML = `
      <div class="kicker">Tanda Kasih</div>
      <h2>Seuntai Perhatian</h2>
      <p class="gift-intro">Doa dan kehadiran Bapak/Ibu/Saudara/i merupakan kebahagiaan yang sangat berarti bagi kami. Apabila berkenan memberikan tanda kasih untuk Azfar &amp; Azraf, kami sediakan beberapa pilihan berikut.</p>
      <div class="gift-card">
        <div class="field gift-field">
          <label for="giftType">Bentuk Tanda Kasih</label>
          <select id="giftType">
            <option value="">Silakan pilih (opsional)</option>
            <option value="digital">Tanda kasih secara digital</option>
            <option value="physical">Hadiah</option>
          </select>
        </div>
        <div id="digitalGift" class="gift-detail">
          <div class="gift-account"><b>BTN — Azfar Shofwan Shaquille</b><span>17901510036241</span><button type="button" class="copy-btn" data-copy="17901510036241">Salin Nomor</button></div>
          <div class="gift-account"><b>BTN — Azraf Tsaqif Alkhalifi</b><span>17901510036259</span><button type="button" class="copy-btn" data-copy="17901510036259">Salin Nomor</button></div>
        </div>
        <div id="physicalGift" class="gift-detail">
          <div class="gift-account"><b>Penerima</b><span>Sony Afrizal / Sahlatul Rizqiyyah R.</span></div>
          <div class="gift-account"><b>Alamat Pengiriman Hadiah</b><span>Perumahan Green Athaya No. A1, Jl. Moh. Mirkam RT 6 RW 1, Kel. Rangkapan Jaya, Kec. Pancoran Mas, Depok, Jawa Barat 16435</span><button type="button" class="copy-btn" data-copy="Sony Afrizal / Sahlatul Rizqiyyah R., Perumahan Green Athaya No. A1, Jl. Moh. Mirkam RT 6 RW 1, Kel. Rangkapan Jaya, Kec. Pancoran Mas, Depok, Jawa Barat 16435">Salin Alamat</button></div>
        </div>
        <p class="gift-note">Namun demikian, tidak ada kewajiban dalam bentuk apa pun. Doa, perhatian, dan kehadiran Bapak/Ibu/Saudara/i sudah menjadi hadiah yang sangat berharga bagi kami. 🤍</p>
      </div>`;

    const style = document.createElement('style');
    style.textContent = `.gift-intro{max-width:560px;margin:0 auto;color:var(--muted);font-size:13px}.gift-card{max-width:590px;margin:28px auto 0;padding:23px;border:1px solid rgba(212,175,55,.32);border-radius:27px;background:#fff;box-shadow:var(--shadow);text-align:left}.gift-field{margin-bottom:16px}.gift-detail{display:none;gap:10px}.gift-detail.show{display:grid}.gift-account{padding:16px;border:1px solid #e7e3d8;border-radius:17px;background:#fbfaf6}.gift-account b{display:block;font-size:12px;color:var(--navy);margin-bottom:4px}.gift-account span{display:block;color:#536579;font-size:12px;line-height:1.55;word-break:break-word}.copy-btn{margin-top:10px;border:1px solid #c9aa48;background:#fff;border-radius:999px;padding:8px 13px;color:#7b5e12;font-size:10px;font-weight:800;cursor:pointer}.gift-note{margin:18px 4px 0;color:var(--muted);font-family:"Cormorant Garamond",Georgia,serif;font-size:18px;line-height:1.45;text-align:center}`;
    document.head.appendChild(style);
    rsvp.closest('.section')?.before(section);
    const giftSelect = section.querySelector('#giftType');
    const digitalBox = section.querySelector('#digitalGift');
    const physicalBox = section.querySelector('#physicalGift');
    giftSelect.addEventListener('change', () => {
      digitalBox.classList.toggle('show', giftSelect.value === 'digital');
      physicalBox.classList.toggle('show', giftSelect.value === 'physical');
    });
    section.querySelectorAll('[data-copy]').forEach(button => {
      button.addEventListener('click', async () => {
        const value = button.getAttribute('data-copy');
        try {
          await navigator.clipboard.writeText(value);
          const original = button.textContent;
          button.textContent = 'Tersalin ✓';
          setTimeout(() => { button.textContent = original; }, 1400);
        } catch (_) {
          window.prompt('Silakan salin data berikut:', value);
        }
      });
    });
    requestAnimationFrame(() => section.classList.add('show'));
  }

  const guest = new URLSearchParams(window.location.search).get('to');
  if (!guest || !guest.trim()) return;

  const style = document.createElement('style');
  style.textContent = `.guest-greeting{margin:18px auto 0;padding:10px 18px;border-top:1px solid rgba(245,230,168,.18);border-bottom:1px solid rgba(245,230,168,.18);max-width:360px}.guest-greeting span{display:block;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#b8c6d6;font-weight:700}.guest-greeting strong{display:block;margin-top:2px;font-family:"Cormorant Garamond",Georgia,serif;font-size:23px;font-weight:600;color:#f5e6a8}`;
  document.head.appendChild(style);

  const button = document.getElementById('openInvite');
  if (!button) return;

  const box = document.createElement('div');
  box.className = 'guest-greeting';
  box.innerHTML = '<span>Kepada Yth.</span><strong></strong>';
  box.querySelector('strong').textContent = guest.trim();
  button.parentNode.insertBefore(box, button);
})();
