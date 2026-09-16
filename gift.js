(() => {
  const giftSelect = document.getElementById('giftType');
  const digitalBox = document.getElementById('digitalGift');
  const physicalBox = document.getElementById('physicalGift');
  const copyButtons = document.querySelectorAll('[data-copy]');
  if (!giftSelect) return;
  giftSelect.addEventListener('change', () => {
    const value = giftSelect.value;
    digitalBox?.classList.toggle('show', value === 'digital');
    physicalBox?.classList.toggle('show', value === 'physical');
  });
  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const value = button.getAttribute('data-copy');
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        const original = button.textContent;
        button.textContent = 'Tersalin ✓';
        setTimeout(() => { button.textContent = original; }, 1400);
      } catch (_) {
        window.prompt('Silakan salin nomor berikut:', value);
      }
    });
  });
})();
