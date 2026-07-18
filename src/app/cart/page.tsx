'use client';

import { useRouter } from 'next/navigation';
import {
  Container, Typography, Box, Card, CardContent,
  IconButton, Button, TextField, Chip,
} from '@mui/material';
import { Delete, Add, Remove, ShoppingBag } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { removeFromCart, updateQuantity, clearCart } from '@/store/slices/cartSlice';
import { IProductVariant } from '@/types';
import { formatRupiah } from '@/lib/format';
import EmptyState from '@/components/common/EmptyState';
import OrderSummary from '@/components/checkout/OrderSummary';

export default function CartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);

  const subtotal = items.reduce((acc, item) => {
    const price = item.variant?.price ?? item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const shippingCost = subtotal > 0 ? 15000 : 0;
  const total = subtotal + shippingCost;

  const handleRemove = (productId: string, variant?: IProductVariant) => {
    dispatch(removeFromCart({ productId, variant }));
  };

  const handleQty = (productId: string, quantity: number, variant?: IProductVariant) => {
    dispatch(updateQuantity({ productId, quantity, variant }));
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="sm" className="py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Keranjang Kosong"
          description="Belum ada produk di keranjang kamu."
          action={<Button variant="contained" onClick={() => router.push('/products')}>Mulai Belanja</Button>}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8 md:py-12">
      <Typography variant="h4" sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, mb: 4 }}>
        Keranjang Belanja
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-8">
        <Box>
          <Box className="flex justify-between items-center mb-3">
            <Typography variant="body2" color="text.secondary">{items.length} item</Typography>
            <Button size="small" color="error" onClick={() => dispatch(clearCart())}>
              Kosongkan Keranjang
            </Button>
          </Box>

          <div className="flex flex-col gap-3">
            {items.map((item, idx) => {
              const price = item.variant?.price ?? item.product.price;
              const variantLabel = item.variant
                ? [item.variant.size, item.variant.strength].filter(Boolean).join(', ')
                : null;

              return (
                <Card key={idx}>
                  <CardContent>
                    <div className="grid grid-cols-[64px_1fr] sm:grid-cols-[80px_1fr_auto] gap-3 items-center">
                      <Box
                        component="img"
                        src={item.product.images[0] ?? 'https://placehold.co/80x80?text=Kopi'}
                        alt={item.product.name}
                        className="w-full aspect-square object-cover rounded"
                      />
                      <Box className="col-span-2 sm:col-span-1">
                        <Typography sx={{ fontWeight: 600 }}>{item.product.name}</Typography>
                        {variantLabel && (
                          <Chip label={variantLabel} size="small" variant="outlined" sx={{ mt: 0.5 }} />
                        )}
                        <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 700, color: 'primary.main' }}>
                          {formatRupiah(price)}
                        </Typography>
                      </Box>
                      <Box className="col-span-2 sm:col-span-1 flex flex-col items-end gap-1">
                        <Box className="flex items-center gap-1">
                          <IconButton
                            size="small"
                            onClick={() => handleQty(item.product._id, item.quantity - 1, item.variant)}
                            disabled={item.quantity <= 1}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <TextField
                            value={item.quantity}
                            size="small"
                            slotProps={{ htmlInput: { style: { textAlign: 'center', width: 32 }, min: 1 } }}
                            onChange={(e) => handleQty(item.product._id, parseInt(e.target.value) || 1, item.variant)}
                            variant="outlined"
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleQty(item.product._id, item.quantity + 1, item.variant)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemove(item.product._id, item.variant)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {formatRupiah(price * item.quantity)}
                        </Typography>
                      </Box>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Box>

        <Box>
          <OrderSummary
            items={items.map((item, idx) => ({
              key: String(idx),
              name: item.product.name,
              variantLabel: item.variant ? [item.variant.size, item.variant.strength].filter(Boolean).join(', ') : null,
              price: item.variant?.price ?? item.product.price,
              quantity: item.quantity,
            }))}
            subtotal={subtotal}
            shipping={shippingCost}
            total={total}
          >
            <Button variant="contained" fullWidth size="large" onClick={() => router.push('/checkout')}>
              Lanjut ke Checkout
            </Button>
            <Button variant="text" fullWidth onClick={() => router.push('/products')} sx={{ mt: 1 }}>
              Lanjut Belanja
            </Button>
          </OrderSummary>
        </Box>
      </div>
    </Container>
  );
}
