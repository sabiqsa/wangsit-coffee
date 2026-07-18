'use client';

import { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Alert, Skeleton,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { ICategory } from '@/types';
import { getCategories } from '@/lib/queries';
import { createCategory, updateCategory, deleteCategory } from './actions';

const emptyForm = { name: '', slug: '', image: '' };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ICategory | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      setCategories(await getCategories());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(''); setOpen(true); };
  const openEdit = (c: ICategory) => { setEditing(c); setForm({ name: c.name, slug: c.slug, image: c.image }); setError(''); setOpen(true); };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus kategori ini?')) return;
    await deleteCategory(id);
    fetchData();
  };

  const handleSubmit = async () => {
    setError('');
    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
      image: form.image,
    };
    try {
      if (editing) {
        await updateCategory(editing._id, payload);
      } else {
        await createCategory(payload);
      }
    } catch {
      setError('Gagal menyimpan kategori');
      return;
    }
    setOpen(false);
    fetchData();
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Kelola Kategori</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openCreate}>Tambah Kategori</Button>
      </Box>

      {loading ? <Skeleton variant="rectangular" height={300} /> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nama</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell align="right">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((c) => (
                <TableRow key={c._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {c.image && (
                        <Box component="img" src={c.image} sx={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 1 }} />
                      )}
                      <Typography sx={{ fontWeight: 600 }}>{c.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{c.slug}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(c)}><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(c._id)}><Delete fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Kategori' : 'Tambah Kategori'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} fullWidth />
            <TextField label="Slug (opsional)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} fullWidth />
            <TextField label="URL Gambar" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} fullWidth />
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
