## Database Schema (MongoDB / Mongoose)

- **User**: name, email, password (hashed), role, address[], createdAt
- **Product**: name, slug, description, price, stock, category, images[] (dynamic source/URL), variants[] (size/strength), rating, sold
- **Category**: name, slug, image
- **Order**: userId, items[], totalPrice, status, paymentMethod (`midtrans` / `qris`), midtransTransactionId, shippingAddress, createdAt

## Sample Data — 20 Produk Awal

Seed minimal 20 produk kopi untuk development, kategori campuran minuman & biji kopi. Contoh daftar (boleh disesuaikan harga & deskripsi):

1. Americano
2. Espresso Single Shot
3. Espresso Double Shot
4. Cappuccino
5. Cafe Latte
6. Flat White
7. Mocha
8. Macchiato
9. Affogato
10. Cold Brew
11. Vietnam Drip
12. V60 Manual Brew
13. Kopi Tubruk
14. Es Kopi Susu Gula Aren
15. Biji Kopi Arabika Gayo 200g
16. Biji Kopi Robusta Lampung 250g
17. Biji Kopi Toraja 200g
18. Kopi Bubuk Mandailing 250g
19. Decaf Coffee Beans 200g
20. Cold Brew Bottle 500ml (RTD)

Setiap produk: `images` berupa array URL **dynamic source** (placeholder service seperti `https://source.unsplash.com/...` atau CDN sendiri, supaya mudah diganti tanpa hardcode file lokal).

## Core Features

1. **Auth** — NextAuth, proteksi route, session-aware navbar
2. **Product Catalog** — filter, search, pagination
3. **Product Detail dengan Image Zoom**
   - Komponen `ProductImageZoom`: support **zoom in/out** (scroll wheel di desktop, pinch di mobile, atau tombol +/-)
   - Rekomendasi library: `react-medium-image-zoom` atau custom pakai CSS `transform: scale()` + state level zoom
   - Gambar dari `dynamic source` (URL dari DB, bukan static import)
4. **Cart** — Redux `cartSlice`, persist localStorage
5. **Checkout & Payment (Midtrans)**
   - Integrasi Midtrans Snap untuk pembayaran kartu & e-wallet
   - Support **QRIS** sebagai salah satu payment channel via Midtrans Core API
   - Webhook `/api/payment/notification` untuk update status order otomatis
6. **Dark Mode** — toggle navbar, `themeSlice`, MUI `ThemeProvider` dengan lilac palette (light & dark variant)
7. **Admin Dashboard** — CRUD produk, kategori, kelola status pesanan & pembayaran
8. **Profil User** — riwayat pesanan, edit data diri

## Styling Conventions

- Komponen MUI tetap jadi base (Button, Card, Grid, AppBar, dll)
- SCSS Module dipakai untuk: custom layout grid, animasi/transisi, styling spesifik yang sulit di-handle lewat MUI `sx` prop
- Penamaan file: `ComponentName.module.scss`
- Variabel warna lilac didefinisikan juga di SCSS (`_variables.scss`) agar konsisten dengan MUI theme

## Conventions

- TypeScript strict mode
- Redux Toolkit slices per domain
- `react-hook-form` + `zod` untuk validasi form
- Mongoose schema wajib untuk semua query MongoDB

## Non-Goals (fase awal)

- Tidak perlu multi-bahasa (i18n)
- Payment channel selain Midtrans (kartu, e-wallet, QRIS) belum perlu

## Instructions for Claude

- Gunakan struktur folder di atas
- Setiap komponen baru harus responsive dan support dark mode (lilac palette, jangan hardcode warna — ambil dari theme atau SCSS variable)
- Image produk selalu pakai dynamic source (dari field `images` di DB), bukan static asset
- Implementasi zoom gambar harus smooth dan jalan di mobile (touch) maupun desktop (scroll/click)
- Integrasi Midtrans harus pisahkan server key (backend only) dan client key (frontend), jangan expose server key
- Webhook Midtrans harus verifikasi signature sebelum update status order
