import Link from 'next/link';
import { Box, Container, Typography } from '@mui/material';
import { ArrowForward, ArrowOutward } from '@mui/icons-material';
import classNames from 'classnames';
import { createClient } from '@/lib/supabase/server';
import { mapProduct } from '@/lib/mappers';
import ProductGrid from '@/components/product/ProductGrid';
import SectionHeading from '@/components/common/SectionHeading';
import LinkButton from '@/components/common/LinkButton';
import styles from './Home.module.scss';

const unsplash = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

const CATEGORIES = [
  {
    slug: 'biji-bubuk-kopi',
    label: 'Biji & bubuk kopi',
    desc: 'Single origin untuk diseduh sendiri di rumah.',
    image: unsplash('photo-1587734195503-904fca47e0e9', 1200, 1400),
    className: styles.tileTall,
  },
  {
    slug: 'minuman-kopi',
    label: 'Minuman kopi',
    desc: 'Dari espresso sampai es kopi susu gula aren.',
    image: unsplash('photo-1495474472287-4d71bcdd2085', 1000, 640),
    className: styles.tileWide,
  },
  {
    slug: 'kopi-botolan',
    label: 'Kopi botolan',
    desc: 'Cold brew siap minum, tahan di kulkas.',
    image: unsplash('photo-1461023058943-07fcbe16d735', 1000, 640),
    className: styles.tileWide,
  },
];

const ORIGINS = [
  { name: 'Gayo', region: 'Aceh', notes: 'Floral, fruity, acidity medium', slug: 'biji-arabika-gayo-200g' },
  { name: 'Toraja', region: 'Sulawesi Selatan', notes: 'Earthy, aftertaste coklat gelap', slug: 'biji-toraja-200g' },
  { name: 'Mandailing', region: 'Sumatera Utara', notes: 'Full body, acidity rendah', slug: 'kopi-bubuk-mandailing-250g' },
  { name: 'Lampung', region: 'Lampung', notes: 'Robusta tebal, pahit yang bersih', slug: 'biji-robusta-lampung-250g' },
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select('*, categories(*)')
    .order('rating', { ascending: false })
    .limit(4);

  const featuredProducts = (data ?? []).map(mapProduct);

  return (
    <Box>
      {/* Hero: asymmetric split, copy left, layered photography right */}
      <Container maxWidth="lg" component="section" aria-labelledby="hero-title" className="pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-center md:min-h-[calc(100dvh-64px-8rem)]">
          <div className="md:col-span-6 lg:col-span-7">
            <Typography
              id="hero-title"
              variant="h1"
              className="reveal"
              sx={{ fontSize: { xs: '2.75rem', sm: '3.25rem', lg: '4.25rem' }, mb: 3 }}
            >
              Kopi Nusantara, langsung dari kebun.
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              className="reveal"
              style={{ '--i': 1 } as React.CSSProperties}
              sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, maxWidth: '42ch', mb: 5 }}
            >
              Biji single-origin dari Gayo, Toraja, Lampung, dan Mandailing. Dipanggang per batch kecil, siap diseduh di rumah.
            </Typography>
            <div className="reveal flex flex-wrap items-center gap-x-6 gap-y-4" style={{ '--i': 2 } as React.CSSProperties}>
              <LinkButton href="/products" variant="contained" size="large" endIcon={<ArrowForward />}>
                Belanja sekarang
              </LinkButton>
              <Link href="/products?category=biji-bubuk-kopi" className={styles.textLink}>
                Lihat biji kopi
              </Link>
            </div>
          </div>

          <div className="md:col-span-6 lg:col-span-5 relative reveal" style={{ '--i': 1 } as React.CSSProperties}>
            <div className={styles.heroMain}>
              <img
                src={unsplash('photo-1442512595331-e89e73853f31', 1200, 1400)}
                alt="Secangkir kopi hitam di samping biji kopi sangrai"
                fetchPriority="high"
              />
            </div>
            <div className={styles.heroInset} aria-hidden="true">
              <img src={unsplash('photo-1447933601403-0c6688de566e', 600, 600)} alt="" loading="lazy" />
            </div>
          </div>
        </div>
      </Container>

      {/* Categories: 3-cell bento, one tall + two wide */}
      <Container maxWidth="lg" component="section" aria-labelledby="cat-title" className="pb-20 md:pb-28">
        <Typography id="cat-title" variant="h3" component="h2" sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' }, mb: { xs: 4, md: 5 } }}>
          Pilih cara ngopimu
        </Typography>
        <div className={styles.bento}>
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={`/products?category=${cat.slug}`} className={classNames(styles.tile, cat.className)}>
              <img src={cat.image} alt="" loading="lazy" className={styles.tileImage} />
              <span className={styles.tileScrim} aria-hidden="true" />
              <span className={styles.tileBody}>
                <span className={styles.tileTitle}>
                  {cat.label}
                  <ArrowOutward className={styles.tileArrow} />
                </span>
                <span className={styles.tileDesc}>{cat.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </Container>

      {/* Featured products */}
      {featuredProducts.length > 0 && (
        <Container maxWidth="lg" component="section" className="pb-20 md:pb-28">
          <SectionHeading title="Paling disukai" viewAllHref="/products" />
          <ProductGrid products={featuredProducts} />
        </Container>
      )}

      {/* Origins: sticky photo + typographic index */}
      <Box component="section" aria-labelledby="origin-title" sx={{ bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg" className="py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
            <div className="md:col-span-5">
              <div className="md:sticky md:top-24">
                <Typography id="origin-title" variant="h3" component="h2" sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' }, mb: 2 }}>
                  Kenali asal kopimu
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '40ch', mb: 5 }}>
                  Tiap daerah punya karakter rasa sendiri. Mulai dari yang paling cocok dengan seleramu.
                </Typography>
                <div className={styles.originPhoto}>
                  <img
                    src={unsplash('photo-1511537190424-bbbab87ac5eb', 900, 700)}
                    alt="Biji kopi sangrai di atas permukaan kayu"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            <ol className="md:col-span-7 list-none m-0 p-0">
              {ORIGINS.map((o) => (
                <li key={o.slug}>
                  <Link href={`/products/${o.slug}`} className={styles.originRow}>
                    <span className="min-w-0">
                      <span className={styles.originName}>{o.name}</span>
                      <span className={styles.originMeta}>
                        {o.region}. {o.notes}
                      </span>
                    </span>
                    <ArrowForward className={styles.originArrow} />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Box>
    </Box>
  );
}
