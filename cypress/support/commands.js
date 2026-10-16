// Ambil harga pertama "$1,234.56" dari teks, kembalikan digit satuan saja -> 1234
export const wholePrice = (text) => {
  const m = String(text).match(/\$\s?([\d,]+)/);
  return m ? parseInt(m[1].replace(/,/g, ''), 10) : NaN;
};

// Ambil semua jam "HH:MM" dari teks, mis. "CGK 04:15 SIN 10:15" -> ['04:15', '10:15']
// textContent menempelkan span ("CGK 04:15SIN 10:15"), jadi batasnya non-digit, bukan \b
export const clockTimes = (text) => String(text).match(/(?<!\d)\d{2}:\d{2}(?!\d)/g) || [];

// Total harga di price breakdown Agoda; tunggu sampai elemennya berisi angka (awalnya kosong)
export const totalPrice = () =>
  cy
    .get('[data-component="mob-flight-price-total-desc"]', { timeout: 60000 })
    .filter((_, el) => /\d/.test(el.textContent))
    .first()
    .invoke('text')
    .then((t) => t.trim());
