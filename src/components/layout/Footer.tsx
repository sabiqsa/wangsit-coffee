'use client';

import { useState } from 'react';
import { Box, Container, Typography, InputBase, IconButton, Divider } from '@mui/material';
import { Send } from '@mui/icons-material';
import Link from 'next/link';

const MENU_LINKS = [
  { href: '/products', label: 'Semua Produk' },
  { href: '/products?category=biji-bubuk-kopi', label: 'Biji & Bubuk Kopi' },
  { href: '/products?category=kopi-botolan', label: 'Kopi Botolan' },
];

const INFO_LINKS = [
  { href: '#', label: 'Tentang Kami' },
  { href: '#', label: 'Kebijakan Privasi' },
  { href: '#', label: 'Syarat & Ketentuan' },
];

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
    <Box
      component="footer"
      sx={{ bgcolor: 'background.default', mt: 'auto', borderTop: 1, borderColor: 'divider' }}
    >
      <Container maxWidth="lg" className="py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
          <div className="md:col-span-2">
            <Typography
              variant="h6"
              sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, mb: 1.5 }}
            >
              Wangsit<span style={{ color: 'var(--mui-palette-primary-main)' }}>Coffee</span>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
              Meracik ritual kopi lewat sourcing yang teliti dan roasting artisanal —
              dari kebun Nusantara langsung ke cangkir kamu.
            </Typography>
          </div>

          <div>
            <Typography
              variant="overline"
              sx={{ display: 'block', color: 'text.secondary', mb: 1.5 }}
            >
              Menu
            </Typography>
            {MENU_LINKS.map((item) => (
              <Link key={item.label} href={item.href} className="block mb-2">
                <Typography variant="body2" color="text.secondary" sx={{ '&:hover': { color: 'primary.main' } }}>
                  {item.label}
                </Typography>
              </Link>
            ))}
          </div>

          <div>
            <Typography
              variant="overline"
              sx={{ display: 'block', color: 'text.secondary', mb: 1.5 }}
            >
              Newsletter
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              Info roast baru & promo langsung ke email kamu.
            </Typography>
            {subscribed ? (
              <Typography variant="body2" sx={{ color: 'primary.main' }}>
                Terima kasih sudah berlangganan!
              </Typography>
            ) : (
              <Box component="form" onSubmit={handleSubscribe} className="flex items-center gap-1">
                <InputBase
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email kamu"
                  type="email"
                  sx={{
                    flex: 1,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                    border: 1,
                    borderColor: 'divider',
                    fontSize: '0.875rem',
                  }}
                />
                <IconButton type="submit" size="small" sx={{ bgcolor: 'primary.main', color: 'var(--mui-palette-primary-contrastText)', '&:hover': { bgcolor: 'primary.main', opacity: 0.9 } }}>
                  <Send fontSize="small" />
                </IconButton>
              </Box>
            )}
          </div>
        </div>

        <Divider sx={{ my: 4 }} />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} WangsitCoffee. Meticulously Sourced.
          </Typography>
          <div className="flex gap-4">
            {INFO_LINKS.map((item) => (
              <Typography key={item.label} variant="body2" color="text.secondary">
                {item.label}
              </Typography>
            ))}
          </div>
        </div>
      </Container>
    </Box>
  );
}
