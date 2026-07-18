'use client';

import { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Chip, Select, MenuItem,
  Skeleton, Pagination,
} from '@mui/material';
import { IOrder, OrderStatus } from '@/types';
import { getOrders } from '@/lib/queries';
import { updateOrderStatus } from './actions';
import { formatRupiah } from '@/lib/format';
import OrderStatusBadge from '@/components/order/OrderStatusBadge';

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (p: number) => {
    setLoading(true);
    try {
      const result = await getOrders({ page: p, limit: 20 });
      setOrders(result.data);
      setTotal(result.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(page); }, [page]);

  const updateStatus = async (id: string, status: OrderStatus) => {
    await updateOrderStatus({ orderId: id, status });
    fetchOrders(page);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontFamily: 'var(--font-display)', fontWeight: 700 }} gutterBottom>Kelola Pesanan</Typography>

      {loading ? (
        <Skeleton variant="rectangular" height={400} />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Pelanggan</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Pembayaran</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Tanggal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                const user = typeof order.userId === 'object' ? order.userId : null;
                return (
                  <TableRow key={order._id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        #{order._id.slice(-6).toUpperCase()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {user ? (
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                        </Box>
                      ) : '—'}
                    </TableCell>
                    <TableCell>{formatRupiah(order.totalPrice)}</TableCell>
                    <TableCell>
                      <Chip label={order.paymentMethod.toUpperCase()} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        size="small"
                        onChange={(e) => updateStatus(order._id, e.target.value as OrderStatus)}
                        renderValue={(v) => <OrderStatusBadge status={v as OrderStatus} />}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {new Date(order.createdAt).toLocaleDateString('id-ID')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {total > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination count={total} page={page} onChange={(_, p) => setPage(p)} color="primary" />
        </Box>
      )}
    </Container>
  );
}
