# La Ta Dhore POS - Kasir Kedai Kopi & Croissant

Aplikasi Point of Sale (POS) berbasis React, Tailwind CSS, dan DaisyUI untuk operasional kasir kedai kopi dan croissant **La Ta Dhore**.

## Fitur Utama

- **Katalog Menu & Filter Real-Time**: Pencarian berdasarkan nama/deskripsi, filter kategori (`Semua Menu`, `Signature`, `Croissant`, `Waffle`, `Coffee`, `Ice cream`), dan pengurutan harga/nama.
- **Manajemen Pesanan Aktif (Current Order)**: Penambahan item langsung dari katalog, pengaturan kuantitas (`+`/`-`), pengosongan pesanan, serta sinkronisasi otomatis ke `localStorage`.
- **Kalkulasi Pembayaran & Kembalian**: Modal pembayaran dengan pilihan nominal uang cepat (`Uang Pas`, `Rp 20.000`, `Rp 50.000`, `Rp 100.000`), validasi nominal kurang bayar, rincian kembalian, dan tombol penyelesaian transaksi untuk pesanan baru.
- **Mode Terang & Gelap (Light/Dark Mode)**: Sakelar tema yang bekerja penuh di seluruh komponen dengan rasio kontras memenuhi standar WCAG AA.
- **UI States Lengkap**: Menangani kondisi *loading*, *error* (dengan tombol muat ulang), dan *empty state* (baik pada katalog maupun daftar pesanan).

## Catatan Desain (R-31 & R-37)

- **Status Arah Desain**: *Draft without direction* (Dial: `ENERGY 1 / RHYTHM 1 / MOTION 1`).
- **Warna**: Permukaan netral *warm stone* (`stone-50`/`stone-100` pada mode terang, `stone-900`/`stone-950` pada mode gelap) dipadukan dengan aksen *roasted amber* (`amber-800` / `#92400e` pada mode terang dan `amber-500` pada mode gelap) untuk merepresentasikan karakter hangat bakery serta menjaga kontras teks di atas 4.5:1.
- **Tata Letak (Layout)**: Pemisahan dua kolom pada layar desktop (katalog produk di kiri dan tiket pesanan aktif yang *sticky* di kanan) serta bertumpuk (*stacked*) secara responsif pada perangkat seluler agar alur kerja kasir dari memilih produk hingga membayar berjalan satu arah.
- **Tipografi**: *System sans-serif* demi keterbacaan cepat di layar kasir, dilengkapi `tabular-nums` pada seluruh angka harga, kuantitas, dan kembalian agar digit mata uang sejajar vertikal.
- **Spasi (Spacing)**: Ritme seragam (`RHYTHM 1`) dengan jarak grid `gap-4` (16px) dan ruang dalam panel `p-5`/`p-6` agar posisi kontrol mudah diprediksi oleh operator kasir.
- **Kartu Produk (Cards)**: Kartu berbingkai tegas (`border-stone-300`, `rounded-lg`) tanpa bayangan melayang berlebih (`MOTION 1`), mengelompokkan foto rasio 4:3, nama, deskripsi, harga, dan tombol tambah (target sentuh minimum 44px).
- **Ikon**: Ikon dipilih sesuai kategori produk nyata (`LuCroissant`, `GiCroissant`, `FaStroopwafel`, `PiCoffee`, `LuIceCream2`) dan fungsi kontrol kasir (`MagnifyingGlassIcon`, `TrashIcon`, `ShoppingCartIcon`, `SunIcon`/`MoonIcon`).

## Menjalankan Proyek

```bash
npm install
npm start
```

## Pengujian & Build Produksi

```bash
npm test
npm run build
```

