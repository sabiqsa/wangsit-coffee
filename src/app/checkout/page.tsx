'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Container, Typography, Box, Card, CardContent,
  TextField, Button, Divider, Alert, CircularProgress,
} from '@mui/material';
import { VerifiedUser, ArrowForward } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { clearCart } from '@/store/slices/cartSlice';
import { createOrder, createPaymentToken } from './actions';
import CheckoutStepper from '@/components/checkout/CheckoutStepper';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import OrderSummary from '@/components/checkout/OrderSummary';
import { PaymentMethod } from '@/types';

const addressSchema = z.object({
  street: z.string().min(5, 'Masukkan alamat lengkap'),
  city: z.string().min(2, 'Masukkan kota'),
  province: z.string().min(2, 'Masukkan provinsi'),
  postalCode: z.string().min(5, 'Kode pos 5 digit').max(5),
  country: z.string(),
});

type AddressForm = z.infer<typeof addressSchema>;

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: {
        onSuccess: (result: unknown) => void;
        onPending: (result: unknown) => void;
        onError: (result: unknown) => void;
        onClose: () => void;
      }) => void;
    };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('midtrans');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: 'Indonesia' },
  });

  const subtotal = items.reduce((acc, item) => {
    const price = item.variant?.price ?? item.product.price;
    return acc + price * item.quantity;
  }, 0);
  const shippingCost = 15000;
  const total = subtotal + shippingCost;

  if (authLoading) return null;

  if (!user) {
    return (
      <Container maxWidth="sm" className="py-16 text-center">
        <Alert severity="warning" sx={{ mb: 2 }}>Anda harus masuk untuk melanjutkan pembayaran.</Alert>
        <Button variant="contained" onClick={() => router.push('/auth/login?callbackUrl=/checkout')}>Masuk</Button>
      </Container>
    );
  }

  if (items.length === 0) {
    router.replace('/cart');
    return null;
  }

  const onSubmit = async (address: AddressForm) => {
    setLoading(true);
    setError('');

    try {
      // 1. Create order — price/total are recomputed server-side by the create_order() RPC.
      const order = await createOrder({
        items: items.map((item) => ({
          product_id: item.product._id,
          quantity: item.quantity,
          variant: item.variant,
        })),
        shippingAddress: address,
        paymentMethod,
      });

      // 2. Get Midtrans token
      const { token } = await createPaymentToken(order.id);

      // 3. Open Snap popup
      if (window.snap) {
        window.snap.pay(token, {
          onSuccess: () => {
            dispatch(clearCart());
            router.push(`/profile?tab=orders`);
          },
          onPending: () => {
            dispatch(clearCart());
            router.push(`/profile?tab=orders`);
          },
          onError: () => setError('Pembayaran gagal. Silakan coba lagi.'),
          onClose: () => setError('Pembayaran dibatalkan.'),
        });
      } else {
        setError('Midtrans Snap tidak tersedia. Pastikan script dimuat.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <script
        src={process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL ?? 'https://app.sandbox.midtrans.com/snap/snap.js'}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? ''}
        async
      />
      <Container maxWidth="lg" className="py-8 md:py-12">
        <Typography variant="h4" sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, mb: 1 }}>
          Selesaikan pesanan
        </Typography>
        <CheckoutStepper current="payment" />

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-8">
            <Box className="flex flex-col gap-4">
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Alamat Pengiriman</Typography>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField
                      {...register('street')}
                      label="Alamat Lengkap"
                      fullWidth
                      className="sm:col-span-2"
                      error={!!errors.street}
                      helperText={errors.street?.message}
                      multiline
                      rows={2}
                    />
                    <TextField
                      {...register('city')}
                      label="Kota"
                      fullWidth
                      error={!!errors.city}
                      helperText={errors.city?.message}
                    />
                    <TextField
                      {...register('province')}
                      label="Provinsi"
                      fullWidth
                      error={!!errors.province}
                      helperText={errors.province?.message}
                    />
                    <TextField
                      {...register('postalCode')}
                      label="Kode Pos"
                      fullWidth
                      error={!!errors.postalCode}
                      helperText={errors.postalCode?.message}
                      slotProps={{ htmlInput: { maxLength: 5 } }}
                    />
                    <TextField {...register('country')} label="Negara" fullWidth defaultValue="Indonesia" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Metode Pembayaran</Typography>
                  <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
                </CardContent>
              </Card>

              <Box className="flex items-center gap-1.5 px-1">
                <VerifiedUser sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  Transaksi terenkripsi SSL 256-bit. Data kamu aman.
                </Typography>
              </Box>
            </Box>

            <Box>
              <OrderSummary
                items={items.map((item, i) => ({
                  key: String(i),
                  name: item.product.name,
                  variantLabel: item.variant ? [item.variant.size, item.variant.strength].filter(Boolean).join(', ') : null,
                  price: item.variant?.price ?? item.product.price,
                  quantity: item.quantity,
                }))}
                subtotal={subtotal}
                shipping={shippingCost}
                total={total}
              >
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <ArrowForward />}
                >
                  {loading ? 'Memproses...' : 'Confirm Payment & Order'}
                </Button>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                  Dengan melanjutkan, kamu menyetujui Syarat & Ketentuan kami.
                </Typography>
              </OrderSummary>
            </Box>
          </div>
        </form>
      </Container>
    </>
  );
}
