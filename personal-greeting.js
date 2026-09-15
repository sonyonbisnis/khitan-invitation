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
