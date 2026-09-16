(() => {
  document.querySelectorAll('.hero .hero-copy')[1]?.remove();
  const photoStyle = document.createElement('style');
  photoStyle.textContent = `.photo img{transform:scaleX(-1)}.gallery figure:first-child{aspect-ratio:4/5}.gallery figure:first-child img{transform:scale(1.18);transform-origin:center center}`;
  document.head.appendChild(photoStyle);

  const polishStyle = document.createElement('style');
  polishStyle.textContent = `
    .section h2{letter-spacing:-.015em}
    .intro-text,.detail small,.event p,.mapbox p{font-size:13px;line-height:1.65}
    .mapbox p strong{display:block;font-size:18px;line-height:1.35;color:#fff;margin-bottom:7px;font-weight:700}
    .hero h1{font-size:clamp(58px,15vw,88px)}
    .hero h1 small{font-size:18px;letter-spacing:.18em;margin-bottom:13px}
    .hero-name{font-size:42px;line-height:1.05}
    .gift-card{width:min(100%,590px);padding:22px 24px 19px;border-radius:24px}
    .gift-field{margin-bottom:8px}
    .gift-field label{margin:0 2px 9px;font-size:12px;line-height:1.35}
    .gift-field select{min-height:56px;padding:12px 15px;border-radius:17px}
    .gift-note{margin:13px 2px 0;font-size:14px;line-height:1.5}
    .rsvp{padding:22px 23px;border-radius:25px}
    .field{gap:7px;margin-bottom:15px}
    .field label{font-size:11px;line-height:1.35}
    .field input,.field select,.field textarea{font-size:13px;line-height:1.5;padding:12px 14px;border-radius:15px}
    .field textarea{min-height:100px;line-height:1.55}
    .rsvp .btn{margin-top:7px;min-height:50px}
    @media(max-width:420px){
      .gift-card{padding:19px 17px 16px;border-radius:22px}
      .gift-field select{min-height:54px}
      .rsvp{padding:19px 17px;border-radius:23px}
      .field{margin-bottom:14px}
      .intro-text,.detail small,.event p,.mapbox p{font-size:12px}
      .mapbox p strong{font-size:17px}
      .hero h1{font-size:56px}
      .hero h1 small{font-size:17px}
      .hero-name{font-size:40px}
      .gift-note{font-size:13px}
    }
  `;
  document.head.appendChild(polishStyle);

  const bgMusic = document.getElementById('bgMusic');
  if (bgMusic) {
    bgMusic.preload = 'auto'; bgMusic.load();
    const preload = document.createElement('link'); preload.rel = 'preload'; preload.as = 'audio'; preload.href = bgMusic.currentSrc || bgMusic.src; preload.type = 'audio/mpeg'; document.head.appendChild(preload);
  }

  const dateMain = document.querySelector('.date-main');
  if (dateMain) {
    dateMain.textContent = 'Minggu, 01 November 2026';
    const calendarStyle = document.createElement('style');
    calendarStyle.textContent = `.date-main{white-space:nowrap;font-size:24px;letter-spacing:-.01em}.calendar-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;margin-top:14px;padding:11px 20px;border:1px solid #c9aa48;border-radius:999px;background:#fff;color:#7b5e12;text-decoration:none;font-size:11px;font-weight:800;box-shadow:0 7px 18px rgba(6,22,45,.06);transition:.2s}.calendar-btn:hover{transform:translateY(-1px);box-shadow:0 10px 22px rgba(6,22,45,.09)}@media(max-width:360px){.date-main{font-size:22px}}`;
    document.head.appendChild(calendarStyle);
    const calendarTarget = document.querySelector('.countdown') || dateMain;
    if (!document.getElementById('saveCalendar')) {
      const calendarUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Tasyakuran%20Khitan%20Azfar%20%26%20Azraf&dates=20261101T050000Z%2F20261101T080000Z&details=Semoga%20kehadiran%20Bapak%2FIbu%20menjadi%20kebahagiaan%20bagi%20Azfar%20%26%20Azraf.&location=Goeboek%20Bamboe%2C%20Jl.%20Pramuka%20Raya%20No.12A%2C%20Mampang%2C%20Pancoran%20Mas%2C%20Depok%2C%20Jawa%20Barat';
      const calendarBtn = document.createElement('a'); calendarBtn.id='saveCalendar'; calendarBtn.className='calendar-btn'; calendarBtn.href=calendarUrl; calendarBtn.target='_blank'; calendarBtn.rel='noopener'; calendarBtn.innerHTML='📅 Simpan ke Kalender'; calendarTarget.insertAdjacentElement('afterend',calendarBtn);
    }
  }

  const rsvp = document.querySelector('.rsvp');
  if (rsvp && !document.getElementById('tandaKasih')) {
    const section = document.createElement('section');
    section.id='tandaKasih'; section.className='section cream center reveal';
    section.innerHTML=`
      <div class="kicker">🤍 Tanda Kasih</div>
      <p class="gift-intro">Do'a dan kehadiran Bapak/Ibu merupakan kebahagiaan yang sangat berarti bagi kami.<br>Apabila berkenan memberikan tanda kasih untuk Azfar &amp; Azraf, kami menyediakan beberapa pilihan berikut.</p>
      <div class="gift-card"><div class="field gift-field"><label for="giftType">Bentuk Tanda Kasih</label><select id="giftType"><option value="">Silakan pilih (opsional)</option><option value="presence">🤲 Do'a &amp; Kehadiran</option><option value="physical">🎁 Hadiah</option><option value="digital">💳 Tanda Kasih Digital</option></select></div>
      <div id="digitalGift" class="gift-detail"><div class="gift-account"><b>BTN — Azfar Shofwan Shaquille</b><span>17901510036241</span><button type="button" class="copy-btn" data-copy="17901510036241">Salin Rekening</button></div><div class="gift-account"><b>BTN — Azraf Tsaqif Alkhalifi</b><span>17901510036259</span><button type="button" class="copy-btn" data-copy="17901510036259">Salin Rekening</button></div></div>
      <div id="physicalGift" class="gift-detail"><div class="gift-account"><b>🎁 Alamat Pengiriman Hadiah</b><b style="margin-top:8px">Penerima:</b><span>Sony Afrizal / Sahlatul Rizqiyyah R.</span><b style="margin-top:8px">Alamat:</b><span>Perumahan Green Athaya No. A1, Jl. Moh. Mirkam RT 6 RW 1, Kel. Rangkapan Jaya, Kec. Pancoran Mas, Depok, Jawa Barat 16435</span><button type="button" class="copy-btn" data-copy="Sony Afrizal / Sahlatul Rizqiyyah R., Perumahan Green Athaya No. A1, Jl. Moh. Mirkam RT 6 RW 1, Kel. Rangkapan Jaya, Kec. Pancoran Mas, Depok, Jawa Barat 16435">Salin Alamat</button></div></div>
      <p class="gift-note">Do'a, perhatian, dan kehadiran Bapak/Ibu sudah menjadi hadiah yang sangat berharga bagi kami.</p></div>`;
    const style=document.createElement('style');
    style.textContent=`
      .gift-intro{max-width:560px;margin:0 auto;color:var(--muted);font-size:13px;line-height:1.8}
      .gift-card{width:min(100%,590px);max-width:590px;margin:28px auto 0;padding:22px 24px 19px;border:1px solid rgba(212,175,55,.32);border-radius:24px;background:#fff;box-shadow:var(--shadow);text-align:left}
      .gift-field{margin-bottom:8px}
      .gift-field label{display:block;margin:0 2px 9px;font-size:12px;line-height:1.35}
      .gift-field select{min-height:56px;padding:12px 15px;border-radius:17px}
      .gift-detail{display:none;gap:10px}
      .gift-detail.show{display:grid}
      .gift-account{padding:16px;border:1px solid #e7e3d8;border-radius:17px;background:#fbfaf6}
      .gift-account b{display:block;font-size:12px;color:var(--navy);margin-bottom:4px}
      .gift-account span{display:block;color:#536579;font-size:12px;line-height:1.55;word-break:break-word}
      .copy-btn{margin-top:10px;border:1px solid #c9aa48;background:#fff;border-radius:999px;padding:8px 13px;color:#7b5e12;font-size:10px;font-weight:800;cursor:pointer}
      .gift-note{margin:13px 2px 0;color:var(--muted);font-family:"Cormorant Garamond",Georgia,serif;font-size:14px;line-height:1.5;text-align:left}
      @media(max-width:420px){.gift-card{padding:19px 17px 16px;border-radius:22px}.gift-field select{min-height:54px}.gift-note{font-size:13px;line-height:1.45}}
    `;
    document.head.appendChild(style); rsvp.closest('.section')?.before(section);
    const giftSelect=section.querySelector('#giftType'),digitalBox=section.querySelector('#digitalGift'),physicalBox=section.querySelector('#physicalGift');
    giftSelect.addEventListener('change',()=>{digitalBox.classList.toggle('show',giftSelect.value==='digital');physicalBox.classList.toggle('show',giftSelect.value==='physical')});
    section.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{const value=button.getAttribute('data-copy');try{await navigator.clipboard.writeText(value);const original=button.textContent;button.textContent='Tersalin ✓';setTimeout(()=>button.textContent=original,1400)}catch(_){window.prompt('Silakan salin data berikut:',value)}}));
    requestAnimationFrame(()=>section.classList.add('show'));
  }

  const guestbookScript=document.createElement('script'); guestbookScript.src='guestbook.js'; guestbookScript.defer=true; document.head.appendChild(guestbookScript);

  const guest=new URLSearchParams(window.location.search).get('to'); if(!guest||!guest.trim())return;
  const style=document.createElement('style'); style.textContent=`.guest-greeting{margin:18px auto 0;padding:10px 18px;border-top:1px solid rgba(245,230,168,.18);border-bottom:1px solid rgba(245,230,168,.18);max-width:360px}.guest-greeting span{display:block;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#b8c6d6;font-weight:700}.guest-greeting strong{display:block;margin-top:2px;font-family:"Cormorant Garamond",Georgia,serif;font-size:23px;font-weight:600;color:#f5e6a8}`; document.head.appendChild(style);
  const button=document.getElementById('openInvite'); if(!button)return; const box=document.createElement('div'); box.className='guest-greeting'; box.innerHTML='<span>Kepada Yth.</span><strong></strong>'; box.querySelector('strong').textContent=guest.trim(); button.parentNode.insertBefore(box,button);
})();
