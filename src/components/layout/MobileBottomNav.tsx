'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Box, Badge } from '@mui/material';
import { Storefront, Search, ShoppingBag, Person } from '@mui/icons-material';
import classNames from 'classnames';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { useAuth } from '@/hooks/useAuth';
import styles from './MobileBottomNav.module.scss';

const ITEMS = [
  { href: '/', label: 'Shop', icon: Storefront },
  { href: '/products', label: 'Search', icon: Search },
  { href: '/cart', label: 'Cart', icon: ShoppingBag },
];

export default function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const cartCount = useAppSelector((s) => s.cart.items.reduce((acc, i) => acc + i.quantity, 0));

  const profileHref = user ? '/profile' : '/auth/login';

  return (
    <Box component="nav" className={styles.bottomNav}>
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <button
            key={href}
            type="button"
            onClick={() => router.push(href)}
            className={classNames(styles.navItem, active && styles.active)}
          >
            {href === '/cart' ? (
              <Badge badgeContent={cartCount} color="primary" overlap="circular">
                <Icon fontSize="small" />
              </Badge>
            ) : (
              <Icon fontSize="small" />
            )}
            <span className={styles.label}>{label}</span>
          </button>
        );
      })}
      <button
        type="button"
        onClick={() => router.push(profileHref)}
        className={classNames(styles.navItem, pathname === profileHref && styles.active)}
      >
        <Person fontSize="small" />
        <span className={styles.label}>Profil</span>
      </button>
    </Box>
  );
}
