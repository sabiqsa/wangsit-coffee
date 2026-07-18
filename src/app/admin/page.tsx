'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  Container, Typography, Grid, Card, CardContent, Box,
  List, ListItem, ListItemText, Skeleton,
} from '@mui/material';
import { ShoppingBag, Category, Receipt, People } from '@mui/icons-material';
import { createClient } from '@/lib/supabase/client';
import { getOrders } from '@/lib/queries';
import { formatRupiah } from '@/lib/format';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';
import { OrderStatus } from '@/types';

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalCategories: number;
  recentOrders: { _id: string; totalPrice: number; status: string; createdAt: string }[];
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { profile, loading } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();
      const [productCount, categoryCount, orderResult] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        getOrders({ limit: 5 }),
      ]);
      setStats({
        totalProducts: productCount.count ?? 0,
        totalOrders: orderResult.total,
        totalCategories: categoryCount.count ?? 0,
        recentOrders: orderResult.data.map((o) => ({
          _id: o._id,
          totalPrice: o.totalPrice,
          status: o.status,
          createdAt: o.createdAt,
        })),
      });
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="text" height={50} width={300} />
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  const statCards = [
    { label: 'Total Produk', value: stats.totalProducts, icon: <ShoppingBag />, color: 'primary.main', href: '/admin/products' },
    { label: 'Total Kategori', value: stats.totalCategories, icon: <Category />, color: 'secondary.main', href: '/admin/categories' },
    { label: 'Total Pesanan', value: stats.totalOrders, icon: <Receipt />, color: 'success.main', href: '/admin/orders' },
    { label: 'Akun', value: '—', icon: <People />, color: 'warning.main', href: '#' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontFamily: 'var(--font-display)', fontWeight: 700 }} gutterBottom>Admin Dashboard</Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>Selamat datang, {profile?.name}</Typography>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        {statCards.map((s) => (
          <Grid key={s.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 }, transition: 'box-shadow 0.2s' }}
              onClick={() => router.push(s.href)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ color: s.color, '& svg': { fontSize: 36 } }}>{s.icon}</Box>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>{s.value}</Typography>
                <Typography variant="body2" color="text.secondary">{s.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>Pesanan Terbaru</Typography>
      <Card>
        <List disablePadding>
          {stats.recentOrders.length === 0 && (
            <ListItem><ListItemText primary="Belum ada pesanan" /></ListItem>
          )}
          {stats.recentOrders.map((order, i) => (
            <ListItem
              key={order._id}
              divider={i < stats.recentOrders.length - 1}
              sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
              onClick={() => router.push('/admin/orders')}
            >
              <ListItemText
                primary={`Order #${order._id.slice(-6).toUpperCase()}`}
                secondary={new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontWeight: 600 }}>{formatRupiah(order.totalPrice)}</Typography>
                <OrderStatusBadge status={order.status as OrderStatus} />
              </Box>
            </ListItem>
          ))}
        </List>
      </Card>
    </Container>
  );
}
