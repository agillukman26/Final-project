# Final Project Bootcamp Cypress AfterOffice Batch #1

E2E automation dengan **Cypress** + **Page Object Model (POM)** + **environment variable** untuk tiga flow: Agoda (pesan tiket pesawat), Amazon (cari barang), dan YouTube (video trending Gaming).

---

## Skenario & Assertion

### 1. Agoda — Flight Jakarta → Singapura (`cypress/e2e/agoda.cy.js`)

1. Cari penerbangan one-way Jakarta → Singapore untuk **besok** (tanggal dihitung otomatis: hari ini + 1).
2. Filter maskapai **Malaysia Airlines**, lalu pilih penerbangan dengan jam berangkat **paling awal**.
3. Isi data kontak & penumpang di halaman **Passenger Details**, tolak add-on (travel protection & upsell support).
4. Lanjut ke halaman **pemilihan pembayaran** (tanpa melakukan pembayaran).

Assertion:

- Total price di halaman pembayaran = total price di halaman Passenger Details
- Nama kontak & nama penumpang di halaman pembayaran = data yang diisi; nomor paspor ikut tampil
- Departure & arrival time di halaman Passenger Details dan pembayaran = jam penerbangan yang dipilih

### 2. Amazon — Search `chair` (`cypress/e2e/amazon.cy.js`)

1. Viewport 1920x1080, set alamat kirim ke ZIP US (dari luar US harga disembunyikan).
2. Search `chair`, urutkan **Price: High to Low**.
3. Pilih item **paling kanan di baris pertama yang bukan sponsored**.

Assertion:

- Nama barang di halaman detail = nama di search page
- Harga (sampai digit satuan, tanpa sen) di halaman detail = harga di search page

### 3. YouTube — Trending Gaming (`cypress/e2e/youtube.cy.js`)

1. Klik menu **Gaming** di sidebar.
2. Klik **View all** di bagian Trending videos.
3. Buka video trending **nomor 3**.

Assertion:

- Title di halaman video = title di halaman trending
- Nama channel di halaman video = nama channel di halaman trending

---

## Teknologi

| Komponen | Keterangan |
|---|---|
| Cypress 15 | Framework E2E testing |
| JavaScript | Bahasa test |
| Page Object Model | Struktur test (`cypress/pages`) |
| Mochawesome | HTML report |
| Cypress Video | Rekaman eksekusi test |
| GitHub Actions | CI/CD |

---

## Struktur Proyek

```
.
├── .github/workflows/cypress.yml   # pipeline CI/CD
├── cypress/
│   ├── e2e/
│   │   ├── agoda.cy.js
│   │   ├── amazon.cy.js
│   │   └── youtube.cy.js
│   ├── fixtures/
│   │   └── passenger.json          # data paspor, tanggal lahir, kewarganegaraan
│   ├── pages/                      # Page Object Model
│   │   ├── agoda/    HomePage, FlightSearchPage, PassengerDetailPage, PaymentPage
│   │   ├── amazon/   HomePage, SearchResultPage, ProductPage
│   │   └── youtube/  HomePage, GamingPage, TrendingPage, VideoPage
│   ├── support/
│   │   ├── commands.js             # helper: parsing harga & jam
│   │   └── e2e.js                  # blok iklan/tracker, abaikan error JS pihak ketiga
│   ├── videos/                     # hasil rekaman (otomatis)
│   └── reports/                    # HTML report (otomatis)
├── cypress.config.js
├── cypress.env.json                # environment variable
└── package.json
```

---

## Instalasi

Prasyarat: Node.js (LTS) dan npm.

```bash
git clone <url-repository>
cd <folder-repository>
npm install
```

---

## Environment Variable

URL dan data uji dibaca dari `cypress.env.json` lewat `Cypress.env(...)`:

```json
{
  "AGODA_URL": "https://www.agoda.com",
  "AMAZON_URL": "https://www.amazon.com",
  "YOUTUBE_URL": "https://www.youtube.com",

  "ORIGIN": "Jakarta",
  "DESTINATION": "Singapore",
  "AIRLINE": "Malaysia Airlines",

  "SEARCH_KEYWORD": "chair",
  "AMAZON_ZIP": "10001",

  "PASSENGER_FIRST_NAME": "Budi",
  "PASSENGER_LAST_NAME": "Santoso",
  "PASSENGER_EMAIL": "budi@example.com",
  "PASSENGER_PHONE": "81234567890"
}
```

Data penumpang di atas adalah data dummy. Data identitas tambahan (paspor, tanggal lahir) ada di `cypress/fixtures/passenger.json`.

Di CI, nilai bisa di-override lewat GitHub Secrets dengan prefix `CYPRESS_` (mis. `CYPRESS_AGODA_URL`).

---

## Menjalankan Test

```bash
npm run cy:open          # mode interaktif
npm run cy:run           # semua spec, headless
npm run cy:run:agoda     # satu flow
npm run cy:run:amazon
npm run cy:run:youtube
npm run report           # gabungkan report jadi cypress/reports/index.html
```

---

## Dokumentasi Hasil

- **Video**: `cypress/videos/<spec>.cy.js.mp4` (aktif via `video: true` di `cypress.config.js`)
- **HTML report**: jalankan `npm run report` setelah `npm run cy:run`, lalu buka `cypress/reports/index.html`

---

## CI/CD (GitHub Actions)

Workflow `.github/workflows/cypress.yml` jalan saat push/PR ke `main` atau manual (`workflow_dispatch`):

1. Jalankan semua spec di Chrome
2. Gabungkan HTML report
3. Upload `cypress/videos` dan `cypress/reports` sebagai artifact

---

## Catatan Teknis

- **Agoda**: currency dipaksa **IDR**, karena halaman pembayaran selalu menampilkan Rupiah. Kalau halaman Passenger Details memakai USD, total price tidak bisa dibandingkan.
- **Agoda**: dropdown (nationality, bulan, negara) adalah komponen custom dengan list virtual, jadi dipilih lewat popup + kotak search, bukan `cy.select`.
- **Agoda**: setelah klik *Continue to payment* muncul modal upsell; test klik **No, thanks**.
- **Amazon**: sort memakai parameter URL `s=price-desc-rank`, karena dropdown sort sering berubah atau tersembunyi.
- **YouTube**: stream video (`googlevideo.com`) diblok dan klik link dipaksa full page load, karena navigasi SPA YouTube membuat renderer browser crash. Dengan ini flow sudah lolos sampai halaman Trending, tetapi **renderer masih crash saat membuka halaman video** (kemungkinan dari video player), jadi spec YouTube saat ini gagal. Spec ini pernah lolos sebelum YouTube berubah.

## Status Terakhir

| Spec | Hasil |
|---|---|
| agoda.cy.js | ✔ Pass |
| amazon.cy.js | ✔ Pass |
| youtube.cy.js | ✖ Renderer crash di halaman video |
- Harga, jadwal, dan daftar trending bersifat dinamis, jadi assertion **membandingkan nilai antar halaman**, bukan nilai tetap.
- Situs pihak ketiga bisa menampilkan CAPTCHA, pop-up, atau mengubah struktur elemen sewaktu-waktu; selector mungkin perlu disesuaikan.

---

## Pengumpul

- **Nama:** _isi nama_
- **Batch:** Bootcamp Cypress AfterOffice Batch #1
- **Repository:** _isi link GitHub_
