'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@mui/material';
import { StorefrontOutlined, Search, ShoppingBagOutlined, PersonOutlined } from '@mui/icons-material';
import classNames from 'classnames';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { useAuth } from '@/hooks/useAuth';
import styles from './MobileBottomNav.module.scss';

const ITEMS = [
  { href: '/', label: 'Beranda', icon: StorefrontOutlined },
  { href: '/products', label: 'Cari', icon: Search },
  { href: '/cart', label: 'Keranjang', icon: ShoppingBagOutlined },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const cartCount = useAppSelector((s) => s.cart.items.reduce((acc, i) => acc + i.quantity, 0));

  const items = [...ITEMS, { href: user ? '/profile' : '/auth/login', label: 'Profil', icon: PersonOutlined }];

  return (
    <nav aria-label="Navigasi bawah" className={styles.bottomNav}>
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
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
          </Link>
        );
      })}
    </nav>
  );
}
