import { Box, Container, Typography } from '@mui/material';
import { ArrowForward, Thermostat, PrecisionManufacturing } from '@mui/icons-material';
import { createClient } from '@/lib/supabase/server';
import { mapProduct } from '@/lib/mappers';
import ProductGrid from '@/components/product/ProductGrid';
import SectionHeading from '@/components/common/SectionHeading';
import LinkButton from '@/components/common/LinkButton';
import LinkBox from '@/components/common/LinkBox';

const PROMO_CATEGORIES = [
  {
    slug: 'biji-bubuk-kopi',
    label: 'Biji & Bubuk Kopi',
    desc: 'Single origin dari Gayo, Toraja, hingga Mandailing — diseduh sendiri di rumah.',
    cta: 'Lihat Biji Kopi',
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=800&h=600&fit=crop',
  },
  {
    slug: 'kopi-botolan',
    label: 'Kopi Botolan',
    desc: 'Cold brew siap minum, praktis dibawa ke mana saja.',
    cta: 'Pesan Sekarang',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=600&fit=crop',
  },
];

const FEATURES = [
  { icon: PrecisionManufacturing, label: 'Precision Grinding', desc: 'Gilingan presisi untuk setiap metode seduh.' },
  { icon: Thermostat, label: 'Thermal Control', desc: 'Suhu air terjaga untuk ekstraksi rasa optimal.' },
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
      {/* Hero */}
      <Box
        className="relative flex items-center min-h-[60vh] md:min-h-[70vh]"
        sx={{
          backgroundImage:
            'linear-gradient(to top, rgba(18,18,18,0.95), rgba(18,18,18,0.55)), url(https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1600&h=1000&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="lg" className="py-16">
          <Box className="max-w-xl">
            <Typography
              variant="overline"
              sx={{ color: 'primary.main', display: 'block', mb: 2 }}
            >
              Kopi Nusantara Terbaik
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                lineHeight: 1.15,
                color: '#eae1db',
                mb: 3,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Menjelajahi Dunia di Secangkir Kopi
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(234,225,219,0.75)', fontWeight: 400, mb: 4 }}>
              Dari Gayo, Toraja, hingga Lampung — biji kopi single-origin pilihan, dipanggang dengan presisi.
            </Typography>
            <LinkButton
              href="/products"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{ px: 4, py: 1.5 }}
            >
              Belanja Sekarang
            </LinkButton>
          </Box>
        </Container>
      </Box>

      {/* Promo categories */}
      <Container maxWidth="lg" className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROMO_CATEGORIES.map((promo) => (
            <LinkBox
              key={promo.slug}
              href={`/products?category=${promo.slug}`}
              className="relative flex flex-col justify-end overflow-hidden rounded-lg h-64 md:h-80"
              sx={{
                backgroundImage: `linear-gradient(to top, rgba(18,18,18,0.9), rgba(18,18,18,0.15)), url(${promo.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <Box className="p-6">
                <Typography variant="overline" sx={{ color: 'primary.main' }}>
                  {promo.label}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(234,225,219,0.8)', mb: 2, maxWidth: 320 }}>
                  {promo.desc}
                </Typography>
                <Typography
                  variant="button"
                  sx={{ color: '#eae1db', display: 'inline-flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}
                >
                  {promo.cta} <ArrowForward sx={{ fontSize: 16 }} />
                </Typography>
              </Box>
            </LinkBox>
          ))}
        </div>
      </Container>

      {/* Featured products */}
      {featuredProducts.length > 0 && (
        <Container maxWidth="lg" className="pb-12 md:pb-16">
          <SectionHeading
            title="Dipilih Langsung dari Nusantara"
            subtitle="Sourced globally, roasted locally"
            viewAllHref="/products"
          />
          <ProductGrid products={featuredProducts} />
        </Container>
      )}

      {/* Education / brand story */}
      <Box sx={{ bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg" className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Typography
                variant="h4"
                sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, mb: 2 }}
              >
                Kuasai Seni Menyeduh Kopi
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Rasa terbaik lahir dari presisi — mulai dari gilingan, suhu air, hingga waktu ekstraksi.
                Kami bagikan panduan brewing di setiap halaman produk.
              </Typography>
              <LinkButton href="/products" variant="outlined" size="large" endIcon={<ArrowForward />}>
                Jelajahi Produk
              </LinkButton>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {FEATURES.map(({ icon: Icon, label, desc }) => (
                <Box
                  key={label}
                  className="rounded-lg p-5"
                  sx={{ bgcolor: 'background.default', border: 1, borderColor: 'divider' }}
                >
                  <Icon sx={{ color: 'primary.main', fontSize: 32, mb: 1.5 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {desc}
                  </Typography>
                </Box>
              ))}
            </div>
          </div>
        </Container>
      </Box>
    </Box>
  );
}
