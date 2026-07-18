import { Chip, ChipProps } from '@mui/material';
import { OrderStatus } from '@/types';

const STATUS_COLORS: Record<OrderStatus, ChipProps['color']> = {
  pending: 'warning',
  paid: 'success',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'error',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Menunggu Pembayaran',
  paid: 'Sudah Dibayar',
  processing: 'Diproses',
  shipped: 'Dikirim',
  delivered: 'Diterima',
  cancelled: 'Dibatalkan',
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: ChipProps['size'];
}

export default function OrderStatusBadge({ status, size = 'small' }: OrderStatusBadgeProps) {
  return <Chip label={STATUS_LABELS[status]} size={size} color={STATUS_COLORS[status] ?? 'default'} />;
}
