# POS UMKM

Aplikasi **Point of Sale (POS) berbasis web** untuk membantu UMKM mengelola produk, stok, transaksi, pengguna, dan laporan penjualan.

## Fitur Utama

- 🔐 Authentication & role **Admin / Kasir**
- 📊 Dashboard dan grafik penjualan
- 📦 Manajemen produk dan stok
- 🏷️ Manajemen kategori
- 🛒 Transaksi kasir dengan keranjang
- 💳 Pembayaran Cash, Transfer, dan QRIS
- 🧾 Detail dan struk transaksi
- 📋 Riwayat transaksi
- 📈 Laporan penjualan
- 📄 Export laporan ke PDF & Excel
- 👥 Manajemen pengguna

## Teknologi

- **Laravel 13**
- **PHP 8.4**
- **React**
- **Inertia.js**
- **Tailwind CSS**
- **Vite**
- **MySQL / MariaDB**

## Role Pengguna

| Role | Akses |
|---|---|
| **Admin** | Dashboard, Produk, Kategori, Kasir, Riwayat, Laporan, Manajemen User |
| **Kasir** | Dashboard, Kasir, Riwayat Transaksi |

## Instalasi

Clone repository:

```bash
git clone https://github.com/USERNAME/pos-umkm.git
cd pos-umkm
```

Install dependency:

```bash
composer install
npm install
```

Buat file environment:

```bash
copy .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

Atur database pada `.env`, kemudian jalankan:

```bash
php artisan migrate
```

## Menjalankan Project

Terminal 1:

```bash
php artisan serve
```

Terminal 2:

```bash
npm run dev
```

Aplikasi biasanya dapat diakses melalui:

```text
http://127.0.0.1:8000
```

## Status

Project saat ini sudah memiliki fitur utama POS dan siap digunakan sebagai **versi dasar/stabil** untuk pengembangan selanjutnya.

## Pengembangan Selanjutnya

Beberapa fitur yang dapat dikembangkan:

- Barcode scanner
- Printer thermal
- Notifikasi stok menipis
- Laporan laba/rugi
- Backup database
- Pengaturan toko
- Audit log
- Multi-cabang

---

**POS UMKM** — Sistem kasir sederhana untuk membantu operasional UMKM.
