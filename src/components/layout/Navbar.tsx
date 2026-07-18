'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  AppBar, Toolbar, IconButton, Badge, Avatar, Menu, MenuItem,
  Divider, InputBase, Box, Tooltip,
} from '@mui/material';
import {
  ShoppingCart, Search, AccountCircle, AdminPanelSettings, Logout, Person,
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
  const mode = useAppSelector((s) => s.theme.mode);
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

  return (
    <AppBar position="sticky" className={styles.navbar} elevation={0}>
      <Toolbar className="gap-2 md:gap-4">
        <Box className={styles.logo} onClick={() => router.push('/')}>
          Wangsit<span className={classNames(mode === 'light' && styles.logoAccentLight)}>Coffee</span>
        </Box>

        <Box component="nav" className="hidden md:flex items-center gap-1 ml-2">
          {NAV_LINKS.map((link) => (
            <Box
              key={link.href}
              onClick={() => router.push(link.href)}
              className={classNames(styles.navLink, pathname === link.href && styles.navLinkActive)}
            >
              {link.label}
            </Box>
          ))}
        </Box>

        <Box className={styles.searchBar} component="form" onSubmit={handleSearch}>
          <InputBase
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari produk kopi..."
            startAdornment={<Search sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />}
            className={styles.searchInput}
          />
        </Box>

        <Box sx={{ flex: 1 }} />

        <Box className={styles.navActions}>
          <ThemeToggle />

          <Tooltip title="Keranjang">
            <IconButton sx={{ color: 'text.primary' }} onClick={() => router.push('/cart')}>
              <Badge badgeContent={cartCount} color="primary">
                <ShoppingCart fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {user ? (
            <>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', color: 'var(--mui-palette-primary-contrastText)', fontSize: '0.875rem' }}>
                  {profile?.name?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem disabled sx={{ opacity: 1 }}>
                  <Box>
                    <Box sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{profile?.name}</Box>
                    <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{user.email}</Box>
                  </Box>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => { router.push('/profile'); setAnchorEl(null); }}>
                  <Person fontSize="small" sx={{ mr: 1 }} /> Profil Saya
                </MenuItem>
                {profile?.role === 'admin' && (
                  <MenuItem onClick={() => { router.push('/admin'); setAnchorEl(null); }}>
                    <AdminPanelSettings fontSize="small" sx={{ mr: 1 }} /> Admin Dashboard
                  </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={handleSignOut}>
                  <Logout fontSize="small" sx={{ mr: 1 }} /> Keluar
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Tooltip title="Login">
              <IconButton sx={{ color: 'text.primary' }} onClick={() => router.push('/auth/login')}>
                <AccountCircle fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
