import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import type { Database } from '../src/types/supabase';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
}

const supabase = createClient<Database>(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// source.unsplash.com (the old "Unsplash Source" redirector API) was shut
// down in 2023 and now returns 503 for every request. These are real,
// verified-live photo IDs served directly from images.unsplash.com instead.
const COFFEE_PHOTOS = [
  '1495474472287-4d71bcdd2085',
  '1509042239860-f550ce710b93',
  '1447933601403-0c6688de566e',
  '1517256064527-09c73fc73e38',
  '1442512595331-e89e73853f31',
  '1500530855697-b586d89ba3ee',
  '1461023058943-07fcbe16d735',
  '1522992319-0365e5f11656',
  '1587734195503-904fca47e0e9',
  '1524350876685-274059332603',
  '1541167760496-1628856ab772',
  '1587049352846-4a222e784d38',
  '1521123845560-14093637aa7d',
  '1580933073521-dc49ac0d4e6a',
  '1610632380989-680fe40816c6',
];

const unsplashCoffee = (_keyword: string, id: number) =>
  `https://images.unsplash.com/photo-${COFFEE_PHOTOS[id % COFFEE_PHOTOS.length]}?w=400&h=400&fit=crop`;

type SeedProduct = {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  categorySlug: 'minuman-kopi' | 'biji-bubuk-kopi' | 'kopi-botolan';
  images: string[];
  variants: { size?: string; strength?: string; price?: number }[];
  rating: number;
  sold: number;
};

const products: SeedProduct[] = [
  // Minuman
  { name: 'Americano', slug: 'americano', description: 'Espresso panas yang diencerkan dengan air panas. Rasa kopi yang kuat namun ringan.', price: 22000, stock: 50, categorySlug: 'minuman-kopi', images: [unsplashCoffee('americano', 10), unsplashCoffee('black-coffee', 11)], variants: [{ size: 'Regular' }, { size: 'Large', price: 27000 }], rating: 4.5, sold: 120 },
  { name: 'Espresso Single Shot', slug: 'espresso-single-shot', description: 'Espresso pekat satu shot, fondasi dari semua minuman kopi.', price: 18000, stock: 40, categorySlug: 'minuman-kopi', images: [unsplashCoffee('espresso', 12)], variants: [], rating: 4.7, sold: 95 },
  { name: 'Espresso Double Shot', slug: 'espresso-double-shot', description: 'Dua shot espresso untuk yang butuh dorongan energi ekstra.', price: 25000, stock: 40, categorySlug: 'minuman-kopi', images: [unsplashCoffee('double-espresso', 13)], variants: [], rating: 4.8, sold: 88 },
  { name: 'Cappuccino', slug: 'cappuccino', description: 'Perpaduan sempurna espresso, susu kukus, dan busa susu yang lembut.', price: 28000, stock: 45, categorySlug: 'minuman-kopi', images: [unsplashCoffee('cappuccino', 14), unsplashCoffee('foam', 15)], variants: [{ size: 'Regular' }, { size: 'Large', price: 33000 }], rating: 4.6, sold: 210 },
  { name: 'Cafe Latte', slug: 'cafe-latte', description: 'Espresso dengan banyak susu kukus dan sedikit busa. Lembut dan creamy.', price: 30000, stock: 45, categorySlug: 'minuman-kopi', images: [unsplashCoffee('latte', 16)], variants: [{ size: 'Regular' }, { size: 'Large', price: 35000 }], rating: 4.7, sold: 185 },
  { name: 'Flat White', slug: 'flat-white', description: 'Espresso dengan microfoam susu yang padat. Lebih kuat dari latte.', price: 30000, stock: 35, categorySlug: 'minuman-kopi', images: [unsplashCoffee('flat-white', 17)], variants: [], rating: 4.5, sold: 76 },
  { name: 'Mocha', slug: 'mocha', description: 'Perpaduan espresso, coklat, dan susu. Manis dengan sentuhan kopi.', price: 32000, stock: 40, categorySlug: 'minuman-kopi', images: [unsplashCoffee('mocha', 18)], variants: [{ size: 'Regular' }, { size: 'Large', price: 37000 }], rating: 4.4, sold: 142 },
  { name: 'Macchiato', slug: 'macchiato', description: 'Espresso dengan sedikit susu kukus. Untuk pecinta kopi sejati.', price: 27000, stock: 30, categorySlug: 'minuman-kopi', images: [unsplashCoffee('macchiato', 19)], variants: [], rating: 4.3, sold: 60 },
  { name: 'Affogato', slug: 'affogato', description: 'Es krim vanilla yang "ditenggelamkan" dalam espresso panas. Dessert sekaligus kopi.', price: 35000, stock: 25, categorySlug: 'minuman-kopi', images: [unsplashCoffee('affogato', 20)], variants: [], rating: 4.9, sold: 55 },
  { name: 'Cold Brew', slug: 'cold-brew', description: 'Kopi yang diseduh dingin selama 12 jam. Rasa halus tanpa keasaman.', price: 28000, stock: 30, categorySlug: 'minuman-kopi', images: [unsplashCoffee('cold-brew', 21)], variants: [{ size: 'Regular' }, { size: 'Large', price: 33000 }], rating: 4.6, sold: 98 },
  { name: 'Vietnam Drip', slug: 'vietnam-drip', description: 'Kopi tetes Vietnam yang kental disajikan dengan susu kental manis.', price: 25000, stock: 35, categorySlug: 'minuman-kopi', images: [unsplashCoffee('vietnam', 22)], variants: [], rating: 4.5, sold: 112 },
  { name: 'V60 Manual Brew', slug: 'v60-manual-brew', description: 'Single origin diseduh manual dengan V60. Aroma dan rasa terbaik biji pilihan.', price: 38000, stock: 20, categorySlug: 'minuman-kopi', images: [unsplashCoffee('v60', 23)], variants: [{ strength: 'Light Roast' }, { strength: 'Medium Roast' }, { strength: 'Dark Roast' }], rating: 4.8, sold: 45 },
  { name: 'Kopi Tubruk', slug: 'kopi-tubruk', description: 'Kopi tradisional Indonesia. Bubuk kopi langsung diseduh dengan air mendidih.', price: 15000, stock: 50, categorySlug: 'minuman-kopi', images: [unsplashCoffee('traditional', 24)], variants: [], rating: 4.4, sold: 130 },
  { name: 'Es Kopi Susu Gula Aren', slug: 'es-kopi-susu-gula-aren', description: 'Espresso dingin dengan susu segar dan gula aren asli. Trend favorit semua kalangan.', price: 28000, stock: 50, categorySlug: 'minuman-kopi', images: [unsplashCoffee('iced-coffee', 25), unsplashCoffee('milk-coffee', 26)], variants: [{ size: 'Regular' }, { size: 'Large', price: 33000 }], rating: 4.9, sold: 320 },
  // Biji & Bubuk
  { name: 'Biji Kopi Arabika Gayo 200g', slug: 'biji-arabika-gayo-200g', description: 'Arabika premium dari dataran tinggi Gayo, Aceh. Rasa floral, fruity, acidity medium.', price: 75000, stock: 30, categorySlug: 'biji-bubuk-kopi', images: [unsplashCoffee('arabica-beans', 30)], variants: [{ strength: 'Light Roast' }, { strength: 'Medium Roast' }], rating: 4.8, sold: 65 },
  { name: 'Biji Kopi Robusta Lampung 250g', slug: 'biji-robusta-lampung-250g', description: 'Robusta kuat dari Lampung. Rasa earthy, pahit, cocok untuk espresso dan kopi tubruk.', price: 55000, stock: 35, categorySlug: 'biji-bubuk-kopi', images: [unsplashCoffee('robusta-beans', 31)], variants: [{ strength: 'Medium Roast' }, { strength: 'Dark Roast' }], rating: 4.5, sold: 48 },
  { name: 'Biji Kopi Toraja 200g', slug: 'biji-toraja-200g', description: 'Single origin Toraja dengan rasa earthy yang kompleks dan aftertaste coklat gelap.', price: 85000, stock: 20, categorySlug: 'biji-bubuk-kopi', images: [unsplashCoffee('toraja-coffee', 32)], variants: [{ strength: 'Medium Roast' }, { strength: 'Dark Roast' }], rating: 4.7, sold: 38 },
  { name: 'Kopi Bubuk Mandailing 250g', slug: 'kopi-bubuk-mandailing-250g', description: 'Kopi bubuk halus dari Mandailing Natal. Rasa full-body dengan low acidity.', price: 60000, stock: 40, categorySlug: 'biji-bubuk-kopi', images: [unsplashCoffee('ground-coffee', 33)], variants: [], rating: 4.6, sold: 72 },
  { name: 'Decaf Coffee Beans 200g', slug: 'decaf-coffee-beans-200g', description: 'Biji kopi tanpa kafein proses Swiss Water. Nikmati kopi kapan saja tanpa khawatir.', price: 90000, stock: 15, categorySlug: 'biji-bubuk-kopi', images: [unsplashCoffee('decaf', 34)], variants: [{ strength: 'Light Roast' }, { strength: 'Medium Roast' }], rating: 4.3, sold: 22 },
  // Botolan
  { name: 'Cold Brew Bottle 500ml', slug: 'cold-brew-bottle-500ml', description: 'Cold brew siap minum dalam botol 500ml. Praktis dibawa kemana saja.', price: 45000, stock: 25, categorySlug: 'kopi-botolan', images: [unsplashCoffee('cold-brew-bottle', 40), unsplashCoffee('coffee-bottle', 41)], variants: [{ strength: 'Original' }, { strength: 'Oat Milk' }], rating: 4.7, sold: 115 },
];

async function seed() {
  console.log('Wiping existing categories/products (orders/order_items cascade or block via FK)...');
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const { data: categories, error: catError } = await supabase
    .from('categories')
    .insert([
      { name: 'Minuman Kopi', slug: 'minuman-kopi', image: unsplashCoffee('drink', 1) },
      { name: 'Biji & Bubuk Kopi', slug: 'biji-bubuk-kopi', image: unsplashCoffee('beans', 2) },
      { name: 'Kopi Botolan', slug: 'kopi-botolan', image: unsplashCoffee('bottle', 3) },
    ])
    .select();
  if (catError) throw catError;

  const categoryIdBySlug = new Map(categories.map((c) => [c.slug, c.id]));

  const { error: prodError } = await supabase.from('products').insert(
    products.map((p) => ({
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      stock: p.stock,
      category_id: categoryIdBySlug.get(p.categorySlug)!,
      images: p.images,
      variants: p.variants,
      rating: p.rating,
      sold: p.sold,
    }))
  );
  if (prodError) throw prodError;

  console.log('Seeding users (admin@wangsit.com / user@wangsit.com)...');
  const seedUsers = [
    { name: 'Admin Wangsit', email: 'admin@wangsit.com', password: 'admin123', role: 'admin' as const },
    { name: 'Test User', email: 'user@wangsit.com', password: 'user123', role: 'user' as const },
  ];

  for (const u of seedUsers) {
    const { data: existing } = await supabase.auth.admin.listUsers();
    let userId = existing.users.find((x) => x.email === u.email)?.id;

    if (userId) {
      console.log(`  ${u.email} already exists, skipping create`);
    } else {
      const { data: created, error: userError } = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: { name: u.name },
      });
      if (userError) throw userError;
      userId = created.user.id;
    }

    if (u.role === 'admin') {
      // handle_new_user trigger defaults every new profile to role='user'.
      // The service-role client bypasses RLS/column grants entirely, so a
      // direct update is fine here (app code must go through set_user_role() instead).
      const { error: roleError } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', userId);
      if (roleError) throw roleError;
    }
  }

  console.log(`Seeded ${products.length} products, ${categories.length} categories, 2 users`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
