'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  Container, Typography, Box, Card, CardContent, Tabs, Tab,
  List, ListItem, ListItemText, Chip, Skeleton, Avatar, Divider,
} from '@mui/material';
import { Person, Receipt } from '@mui/icons-material';
import { IOrder } from '@/types';
import { getOrders } from '@/lib/queries';
import { formatRupiah } from '@/lib/format';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';
import PriceTag from '@/components/product/PriceTag';
import EmptyState from '@/components/common/EmptyState';

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfileContent />
    </Suspense>
  );
}

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile, loading } = useAuth();
  const [tab, setTab] = useState(searchParams.get('tab') === 'orders' ? 1 : 0);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/auth/login');
  }, [loading, user, router]);

  useEffect(() => {
    if (tab !== 1 || !user) return;
    setLoadingOrders(true);
    getOrders({ limit: 50 })
      .then((result) => setOrders(result.data))
      .finally(() => setLoadingOrders(false));
  }, [tab, user]);

  if (loading) {
    return (
      <Container maxWidth="lg" className="py-8 md:py-12">
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8 md:py-12">
      <Typography variant="h4" sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, mb: 3 }}>
        Profil Saya
      </Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab icon={<Person />} label="Informasi" iconPosition="start" />
        <Tab icon={<Receipt />} label="Riwayat Pesanan" iconPosition="start" />
      </Tabs>

      {tab === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
          <Card>
            <CardContent className="text-center py-8">
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', color: 'var(--mui-palette-primary-contrastText)', fontSize: '2rem', mx: 'auto', mb: 2 }}>
                {profile?.name?.[0]?.toUpperCase()}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{profile?.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
              <Chip label={profile?.role ?? 'user'} size="small" color="primary" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Detail Akun</Typography>
              <Divider sx={{ mb: 2 }} />
              <Box className="flex flex-col gap-4">
                <Box>
                  <Typography variant="caption" color="text.secondary">Nama</Typography>
                  <Typography sx={{ fontWeight: 500 }}>{profile?.name}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography sx={{ fontWeight: 500 }}>{user?.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Role</Typography>
                  <Typography sx={{ fontWeight: 500 }}>{profile?.role ?? 'user'}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 1 && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {loadingOrders ? 'Memuat...' : `${orders.length} pesanan`}
          </Typography>

          {loadingOrders ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <Card>
              <EmptyState icon={Receipt} title="Belum ada pesanan" />
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map((order) => (
                <Card key={order._id}>
                  <CardContent>
                    <Box className="flex justify-between items-start mb-1">
                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>
                          Order #{order._id.slice(-6).toUpperCase()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(order.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric',
                          })}
                        </Typography>
                      </Box>
                      <Box className="text-right">
                        <OrderStatusBadge status={order.status} />
                        <PriceTag amount={order.totalPrice} variant="body2" sx={{ mt: 0.5, display: 'block' }} />
                      </Box>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <List dense disablePadding>
                      {order.items.map((item, i) => (
                        <ListItem key={i} disablePadding>
                          <ListItemText
                            primary={`${item.name} × ${item.quantity}`}
                            secondary={formatRupiah(item.price * item.quantity)}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </Container>
  );
}
