'use client';

import { useState } from 'react';
import { Box, Container, Typography, InputBase, Button } from '@mui/material';
import Link from 'next/link';

const MENU_LINKS = [
  { href: '/products', label: 'Semua produk' },
  { href: '/products?category=biji-bubuk-kopi', label: 'Biji & bubuk kopi' },
  { href: '/products?category=kopi-botolan', label: 'Kopi botolan' },
];

// Static pages not built yet: rendered as plain text, not dead links.
const INFO_LINKS = ['Tentang kami', 'Kebijakan privasi', 'Syarat & ketentuan'];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <Box component="footer" sx={{ mt: 'auto', borderTop: 1, borderColor: 'divider' }}>
      <Container maxWidth="lg" className="pt-14 pb-10 md:pt-20 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <Typography
              component="p"
              sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: { xs: '2rem', md: '2.5rem' }, letterSpacing: '-0.035em', lineHeight: 1 }}
            >
              Wangsit<Box component="span" sx={{ color: 'primary.main' }}>Coffee</Box>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, maxWidth: 340 }}>
              Kopi dari kebun Nusantara, dipanggang per batch kecil dan dikirim ke cangkir kamu.
            </Typography>
          </div>

          <nav aria-label="Menu footer" className="md:col-span-3">
            <Typography variant="subtitle2" sx={{ mb: 2 }}>Belanja</Typography>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
              {MENU_LINKS.map((item) => (
                <li key={item.label}>
                  <Link href={item.href}>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                      sx={{ transition: 'color 160ms', '&:hover': { color: 'text.primary' } }}
                    >
                      {item.label}
                    </Typography>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Kabar roast baru</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Satu email tiap ada batch baru. Tidak lebih.
            </Typography>
            {subscribed ? (
              <Typography variant="body2" role="status" sx={{ color: 'primary.main', fontWeight: 500 }}>
                Terima kasih. Kami kabari saat batch berikutnya siap.
              </Typography>
            ) : (
              <Box component="form" onSubmit={handleSubscribe}>
                <label htmlFor="newsletter-email" className="visually-hidden">Email</label>
                <Box className="flex items-stretch gap-2">
                  <InputBase
                    id="newsletter-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    type="email"
                    required
                    sx={{
                      flex: 1,
                      px: 1.75,
                      height: 44,
                      borderRadius: 1,
                      bgcolor: 'background.paper',
                      border: 1,
                      borderColor: 'divider',
                      fontSize: '0.875rem',
                      '&.Mui-focused': { borderColor: 'primary.main' },
                    }}
                  />
                  <Button type="submit" variant="contained" sx={{ height: 44 }}>
                    Daftar
                  </Button>
                </Box>
              </Box>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-14 pt-6 border-t" style={{ borderColor: 'var(--mui-palette-divider)' }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} WangsitCoffee
          </Typography>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {INFO_LINKS.map((label) => (
              <Typography key={label} variant="caption" color="text.secondary">
                {label}
              </Typography>
            ))}
          </div>
        </div>
      </Container>
    </Box>
  );
}
