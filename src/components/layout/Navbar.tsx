'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppBar, Toolbar, IconButton, Badge, Avatar, Menu, MenuItem,
  Divider, InputBase, Box, Tooltip,
} from '@mui/material';
import {
  ShoppingBagOutlined, Search, PersonOutlined, AdminPanelSettings, Logout, Person,
} from '@mui/icons-material';
import classNames from 'classnames';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import ThemeToggle from './ThemeToggle';
import styles from './Navbar.module.scss';

const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/products', label: 'Produk' },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile } = useAuth();
  const cartCount = useAppSelector((s) => s.cart.items.reduce((acc, i) => acc + i.quantity, 0));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSignOut = async () => {
    await createClient().auth.signOut();
    setAnchorEl(null);
    router.push('/');
    router.refresh();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <AppBar position="sticky" className={styles.navbar} elevation={0}>
      <Toolbar className={styles.toolbar} disableGutters>
        <Link href="/" className={styles.logo} aria-label="WangsitCoffee, ke beranda">
          Wangsit<span>Coffee</span>
        </Link>

        <Box component="nav" aria-label="Navigasi utama" className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={classNames(styles.navLink, isActive(link.href) && styles.navLinkActive)}
            >
              {link.label}
            </Link>
          ))}
        </Box>

        <Box className={styles.searchBar} component="form" role="search" onSubmit={handleSearch}>
          <InputBase
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kopi, misal Gayo"
            inputProps={{ 'aria-label': 'Cari produk' }}
            startAdornment={<Search sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />}
            className={styles.searchInput}
          />
        </Box>

        <Box className={styles.navActions}>
          <ThemeToggle />

          <Tooltip title="Keranjang">
            <IconButton component={Link} href="/cart" aria-label={`Keranjang, ${cartCount} item`} sx={{ color: 'text.primary' }}>
              <Badge badgeContent={cartCount} color="primary">
                <ShoppingBagOutlined fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {user ? (
            <>
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                size="small"
                aria-label="Menu akun"
                aria-haspopup="menu"
                aria-expanded={Boolean(anchorEl)}
              >
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  {profile?.name?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                slotProps={{ paper: { sx: { mt: 1, minWidth: 220 } } }}
              >
                <Box sx={{ px: 2, py: 1.25 }}>
                  <Box sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{profile?.name}</Box>
                  <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{user.email}</Box>
                </Box>
                <Divider />
                <MenuItem onClick={() => { router.push('/profile'); setAnchorEl(null); }}>
                  <Person fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} /> Profil saya
                </MenuItem>
                {profile?.role === 'admin' && (
                  <MenuItem onClick={() => { router.push('/admin'); setAnchorEl(null); }}>
                    <AdminPanelSettings fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} /> Admin dashboard
                  </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={handleSignOut}>
                  <Logout fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} /> Keluar
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Link href="/auth/login" className={styles.loginLink}>
              <PersonOutlined sx={{ fontSize: 18 }} />
              <span>Masuk</span>
            </Link>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
