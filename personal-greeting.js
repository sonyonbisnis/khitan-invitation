(() => {
  // Hero sudah menampilkan tanggal di bagian lain undangan.
  // Hapus tanggal/jam dari hero agar halaman pembuka lebih bersih.
  document.querySelectorAll('.hero .hero-copy')[1]?.remove();

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
