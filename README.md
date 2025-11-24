# Dokumentasi Weather Info App / Info KU

Sebuah aplikasi desktop yang digunakan untuk mengambil data kualitas udara dari database server, menghitung statistik untuk rentang waktu yang dipilih, lalu menghasilkan dan menampilkan preview gambar informasi kualitas udara yang siap diunduh dan dibagikan

## Teknologi

- Node.js >= 18
- NPM atau Yarn
- Sistem operasi: Windows / macOS / Linux

* Electron
* Vite
* Vue 3
* TailwindCSS
* Node.js
* ChartJs
* DayJs
* Lodash
* Pinia

## Struktur

```
/weather-info-app
├─ /src
│  ├─ /assets
│  ├─ /renderer             # kode frontend (Vue/React)
│  │   ├─ /src              # utama frontend
│  │   │   ├─ /views        # Setiap file = satu halaman
│  │   │   ├─ /components   # Komponen kecil dan reusable
│  │   │   ├─ /stores       # State management menggunakan Pinia.
│  │   │   ├─ /router       # Vue Router
│  │   │   ├─ /composables  # Reusable logic
│  │   │   ├─ /types        # TypeScript types/types definition
│  │   │   ├─ /services     # Logic yang berhubungan dengan layanan aplikasi
│  │   │   │
│  │   │   └─ App.vue       # Root component aplikasi Vue.
│  │   └─ main.ts           # Entry point renderer (createApp, mount Vue).
│  ├─ /main            # kode Electron main process
│  ├─ /shared          # modul utilitas bersama
│  ├─ /preload         # kode penghubung FE dan Electron
│  └─ index.html
├─ package.json
└─ vite.config.js
```

---

## Setup & Running (local)

### Clone repo

```bash
$ git clone <repo-url>
$ cd weather-info-app
```

### Install dependencies

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

## Development

### Konvensi Penamaan Page & Component (Vue)

Untuk menjaga konsistensi dan keteraturan struktur project, berikut konvensi yang digunakan:

#### **1. Penamaan Folder**

- Semua pages disimpan di folder: `src/renderer/views`
- Semua reusable components disimpan di folder: `src/renderer/components`

#### **2. Penamaan File Vue**

- Gunakan **PascalCase** untuk semua file Vue:
  - Contoh Page: `DashboardPage.vue`, `GenerateImagePage.vue`
  - Contoh Component: `DatePicker.vue`, `PreviewCard.vue`, `AirQualityChart.vue`

#### **3. Page vs Component**

- **Page**: mewakili satu layar lengkap dalam aplikasi. Biasanya berisi layout utama dan memanggil beberapa komponen.
  - Contoh isi page: header, form input tanggal, tombol generate, preview.

- **Component**: bagian UI kecil yang bisa dipakai ulang.
  - Contoh: card, chart kecil, tombol share, loader.

#### **4. Penamaan Props & Emit**

- Props: gunakan **camelCase**
  - `averagePm25`, `locationName`

- Emit event: gunakan **kebab-case**
  - `@generate-image`, `@date-changed`

#### **5. Penamaan Variabel & Function di Script**

- Gunakan camelCase: `loadData()`, `generateImage()`, `airQualityValue`

#### **6. Penamaan File Typescript**

- Gunakan kebab-case: `generate-image.ts`, `date-changed.ts`

## Future Enhancements (ide)

- Integrasi otomatis ke Web
- Fitur jadwalkan auto‑upload ke server
- Generate Infografis PM2.5
- Generate Infografis PM10
