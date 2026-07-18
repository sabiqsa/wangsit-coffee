# Wangsit Coffee

E-commerce kopi Nusantara — katalog produk, keranjang, checkout dengan Midtrans (kartu/e-wallet & QRIS), akun pengguna, dan dashboard admin. Dibangun dengan Next.js App Router dan Supabase, bertema **Premium Roast Collective**: dark mode gold-tan/olive-drab dengan sentuhan glassmorphic.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components & Server Actions), React 19, TypeScript strict
- **Database & Auth**: Supabase (Postgres + Row Level Security, Supabase Auth)
- **State**: Redux Toolkit (`cart`, `theme`) dengan `redux-persist`
- **Styling**: MUI (base komponen) + Tailwind CSS v4 (layout utility) + SCSS Modules (custom/animasi) + `classnames`
- **Forms**: `react-hook-form` + `zod`
- **Payment**: Midtrans Snap (kartu, e-wallet, QRIS)

## Fitur

- Katalog produk dengan pencarian, filter kategori, dan sorting
- Detail produk dengan image zoom (klik, scroll, pinch) dan varian (ukuran/kekuatan roast)
- Keranjang & checkout dengan alamat pengiriman dan pemilihan metode pembayaran
- Autentikasi (login/register) via Supabase Auth, role `user`/`admin`
- Dashboard admin: kelola produk, kategori, dan status pesanan
- Dark/light mode (default dark, sesuai desain)
- Webhook Midtrans dengan verifikasi signature untuk update status pesanan otomatis

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Salin `.env.local` dan isi kredensial berikut:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   MIDTRANS_SERVER_KEY=
   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
   NEXT_PUBLIC_MIDTRANS_SNAP_URL=
   ```

3. Apply database schema ke project Supabase kamu:

   ```bash
   npx supabase link --project-ref <project-ref>
   npx supabase db push
   ```

4. Seed data awal (kategori, produk, akun demo):

   ```bash
   npm run seed
   ```

5. Jalankan development server:

   ```bash
   npm run dev
   ```

   Buka [http://localhost:3000](http://localhost:3000).

## Struktur Proyek

- `src/app/` — routes (App Router), termasuk Server Actions per fitur (`checkout/actions.ts`, `admin/*/actions.ts`)
- `src/components/` — komponen UI per domain (`product/`, `checkout/`, `layout/`, `admin/`, `common/`)
- `src/lib/supabase/` — Supabase client factories (browser, server, middleware, admin/service-role)
- `src/lib/tokens.ts` — design token tunggal (warna, tipografi, radius) yang dipakai tema MUI & Tailwind
- `supabase/migrations/` — schema, RLS policy, dan RPC function Postgres
- `scripts/seed.ts` — seed data demo ke Supabase

## Keamanan

Otorisasi utama ditegakkan lewat Postgres Row Level Security (RLS), bukan cek di application layer saja — read publik untuk katalog, write dibatasi role `admin`, dan setiap user hanya bisa melihat pesanan miliknya sendiri. Total pesanan dihitung ulang di server (RPC `create_order`) sehingga tidak bisa dimanipulasi dari client. Webhook Midtrans memverifikasi signature sebelum mengubah status pesanan.
