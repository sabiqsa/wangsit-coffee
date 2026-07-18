'use client';

import { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Alert, Skeleton,
  FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { IProduct, ICategory } from '@/types';
import { getCategories, getProducts } from '@/lib/queries';
import { createProduct, updateProduct, deleteProduct } from './actions';
import { formatRupiah } from '@/lib/format';

const emptyForm = { name: '', slug: '', description: '', price: '', stock: '', category: '', images: '' };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<IProduct | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodResult, catResult] = await Promise.all([
        getProducts({ limit: 100 }),
        getCategories(),
      ]);
      setProducts(prodResult.data);
      setCategories(catResult);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setOpen(true);
  };

  const openEdit = (product: IProduct) => {
    setEditing(product);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: typeof product.category === 'object' ? product.category._id : product.category,
      images: product.images.join('\n'),
    });
    setError('');
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus produk ini?')) return;
    await deleteProduct(id);
    fetchData();
  };

  const handleSubmit = async () => {
    setError('');
    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      category_id: form.category,
      images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
      variants: [],
    };

    try {
      if (editing) {
        await updateProduct(editing._id, payload);
      } else {
        await createProduct(payload);
      }
    } catch {
      setError('Gagal menyimpan produk');
      return;
    }
    setOpen(false);
    fetchData();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Kelola Produk</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openCreate}>Tambah Produk</Button>
      </Box>

      {loading ? (
        <Skeleton variant="rectangular" height={400} />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nama</TableCell>
                <TableCell>Kategori</TableCell>
                <TableCell>Harga</TableCell>
                <TableCell>Stok</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell align="right">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {p.images[0] && (
                        <Box
                          component="img"
                          src={p.images[0]}
                          sx={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 1 }}
                        />
                      )}
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{p.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{p.slug}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {typeof p.category === 'object' ? p.category.name : '—'}
                  </TableCell>
                  <TableCell>{formatRupiah(p.price)}</TableCell>
                  <TableCell>
                    <Chip
                      label={p.stock}
                      size="small"
                      color={p.stock === 0 ? 'error' : p.stock < 10 ? 'warning' : 'success'}
                    />
                  </TableCell>
                  <TableCell>⭐ {p.rating.toFixed(1)}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(p)}><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(p._id)}><Delete fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Produk' : 'Tambah Produk'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Nama Produk" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth />
            <TextField label="Slug (opsional)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} fullWidth />
            <TextField label="Deskripsi" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth multiline rows={3} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField label="Harga (Rp)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} fullWidth />
              <TextField label="Stok" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} fullWidth />
            </Box>
            <FormControl fullWidth>
              <InputLabel>Kategori</InputLabel>
              <Select label="Kategori" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              label="URL Gambar (satu per baris)"
              value={form.images}
              onChange={(e) => setForm({ ...form, images: e.target.value })}
              fullWidth
              multiline
              rows={3}
              helperText="Masukkan URL gambar, satu per baris"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Batal</Button>
          <Button variant="contained" onClick={handleSubmit}>Simpan</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
