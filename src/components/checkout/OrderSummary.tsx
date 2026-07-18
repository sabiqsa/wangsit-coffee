import { Box, Card, CardContent, Typography, Divider } from '@mui/material';
import PriceTag from '@/components/product/PriceTag';
import { formatRupiah } from '@/lib/format';

export interface SummaryLineItem {
  key: string;
  name: string;
  variantLabel?: string | null;
  price: number;
  quantity: number;
}

interface OrderSummaryProps {
  items: SummaryLineItem[];
  subtotal: number;
  shipping: number;
  total: number;
  children?: React.ReactNode;
}

export default function OrderSummary({ items, subtotal, shipping, total, children }: OrderSummaryProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, mb: 2 }}>
          Ringkasan Pesanan
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box className="flex flex-col gap-1.5 mb-3">
          {items.map((item) => (
            <Box key={item.key} className="flex justify-between gap-2">
              <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                {item.name} × {item.quantity}
                {item.variantLabel && (
                  <Typography component="span" variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {item.variantLabel}
                  </Typography>
                )}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                {formatRupiah(item.price * item.quantity)}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ mb: 2 }} />
        <Box className="flex justify-between mb-1">
          <Typography color="text.secondary">Subtotal</Typography>
          <Typography sx={{ fontWeight: 600 }}>{formatRupiah(subtotal)}</Typography>
        </Box>
        <Box className="flex justify-between mb-2">
          <Typography color="text.secondary">Ongkos Kirim</Typography>
          <Typography sx={{ fontWeight: 600 }}>{formatRupiah(shipping)}</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box className="flex justify-between items-center mb-3">
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
          <PriceTag amount={total} variant="h6" />
        </Box>

        {children}
      </CardContent>
    </Card>
  );
}
