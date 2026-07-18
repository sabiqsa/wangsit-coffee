'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Container, Typography, Box, InputBase, Select, MenuItem,
  FormControl, Pagination, Skeleton, Chip, Button, Radio,
} from '@mui/material';
import { Search, SearchOff } from '@mui/icons-material';
import ProductGrid from '@/components/product/ProductGrid';
import EmptyState from '@/components/common/EmptyState';
import { IProduct, ICategory } from '@/types';
import { getCategories, getProducts } from '@/lib/queries';

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Terbaru' },
  { value: 'price-asc', label: 'Harga: Rendah ke Tinggi' },
  { value: 'price-desc', label: 'Harga: Tinggi ke Rendah' },
  { value: 'rating-desc', label: 'Rating Tertinggi' },
  { value: 'sold-desc', label: 'Paling Laris' },
];

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');

  const page = parseInt(searchParams.get('page') ?? '1');
  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? '';
  const sort = searchParams.get('sort') ?? 'createdAt-desc';

  const [sortField, sortOrder] = sort.split('-');

  const updateParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  }, [router, searchParams]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await getProducts({
          page,
          limit: 12,
          search,
          categorySlug: category,
          sortField,
          sortOrder: sortOrder === 'asc' ? 'asc' : 'desc',
        });
        setProducts(result.data);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, search, category, sortField, sortOrder]);

  const selectedCategory = categories.find((c) => c.slug === category);

  return (
    <Container maxWidth="lg" className="py-8 md:py-12">
      <Typography
        variant="h4"
        sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, mb: 1 }}
      >
        {selectedCategory ? selectedCategory.name : 'Semua Produk'}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {loading ? 'Memuat...' : `${total} produk ditemukan`}
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
        {/* Filter sidebar */}
        <Box component="aside" className="flex flex-col gap-6">
          <Box
            component="form"
            onSubmit={(e) => { e.preventDefault(); updateParam('search', searchInput); }}
          >
            <InputBase
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari produk..."
              startAdornment={<Search fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />}
              sx={{
                width: '100%',
                px: 1.5,
                py: 0.75,
                borderRadius: 1,
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                fontSize: '0.875rem',
              }}
            />
          </Box>

          <Box>
            <Typography variant="overline" sx={{ display: 'block', color: 'text.secondary', mb: 1 }}>
              Kategori
            </Typography>
            <Box className="flex flex-col gap-0.5">
              <Box
                onClick={() => updateParam('category', '')}
                className="flex items-center gap-1 cursor-pointer"
                sx={{ color: !category ? 'primary.main' : 'text.primary' }}
              >
                <Radio checked={!category} size="small" sx={{ p: 0.5 }} />
                <Typography variant="body2">Semua</Typography>
              </Box>
              {categories.map((c) => (
                <Box
                  key={c._id}
                  onClick={() => updateParam('category', c.slug)}
                  className="flex items-center gap-1 cursor-pointer"
                  sx={{ color: category === c.slug ? 'primary.main' : 'text.primary' }}
                >
                  <Radio checked={category === c.slug} size="small" sx={{ p: 0.5 }} />
                  <Typography variant="body2">{c.name}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ display: 'block', color: 'text.secondary', mb: 1 }}>
              Urutkan
            </Typography>
            <FormControl size="small" fullWidth>
              <Select value={sort} onChange={(e) => updateParam('sort', e.target.value)}>
                {SORT_OPTIONS.map((o) => (
                  <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {(search || category) && (
            <Box className="flex flex-wrap gap-1">
              {search && <Chip label={`"${search}"`} onDelete={() => updateParam('search', '')} size="small" />}
              {selectedCategory && (
                <Chip label={selectedCategory.name} onDelete={() => updateParam('category', '')} size="small" color="primary" />
              )}
            </Box>
          )}
        </Box>

        {/* Product grid */}
        <Box>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} variant="rectangular" sx={{ borderRadius: 2, aspectRatio: '3/4' }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={SearchOff}
              title="Produk tidak ditemukan"
              description="Coba ubah kata kunci pencarian atau filter kategori."
              action={<Button variant="outlined" onClick={() => router.push('/products')}>Reset Filter</Button>}
            />
          ) : (
            <ProductGrid products={products} />
          )}

          {totalPages > 1 && (
            <Box className="flex justify-center mt-8">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, p) => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set('page', p.toString());
                  router.push(`/products?${params.toString()}`);
                }}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </Box>
      </div>
    </Container>
  );
}
