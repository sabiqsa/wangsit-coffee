'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Container, Typography, Box, InputBase, Select, MenuItem,
  FormControl, Pagination, Skeleton, Chip, Button,
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
      <Typography variant="h2" component="h1" sx={{ fontSize: { xs: '2.25rem', md: '3.25rem' }, mb: 1 }}>
        {selectedCategory ? selectedCategory.name : 'Semua produk'}
      </Typography>
      <Typography variant="body2" color="text.secondary" className="tabular" sx={{ mb: { xs: 4, md: 6 } }} aria-live="polite">
        {loading ? 'Memuat produk...' : `${total} produk`}
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 md:gap-12">
        {/* Filter sidebar */}
        <Box component="aside" className="flex flex-col gap-6">
          <Box
            component="form"
            onSubmit={(e) => { e.preventDefault(); updateParam('search', searchInput); }}
          >
            <InputBase
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari produk"
              inputProps={{ 'aria-label': 'Cari produk' }}
              startAdornment={<Search fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />}
              sx={{
                width: '100%',
                px: 1.5,
                height: 42,
                borderRadius: 1,
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                fontSize: '0.875rem',
              }}
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" component="h2" sx={{ mb: 1.5 }}>
              Kategori
            </Typography>
            <Box className="flex flex-row flex-wrap md:flex-col gap-1.5" role="radiogroup" aria-label="Kategori">
              {[{ slug: '', name: 'Semua' }, ...categories].map((c) => {
                const active = category === c.slug;
                return (
                  <Box
                    key={c.slug || 'all'}
                    component="button"
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => updateParam('category', c.slug)}
                    sx={{
                      textAlign: 'left',
                      font: 'inherit',
                      fontSize: '0.9rem',
                      fontWeight: active ? 600 : 500,
                      cursor: 'pointer',
                      px: 1.5,
                      py: 1,
                      borderRadius: 1,
                      border: 1,
                      borderColor: active ? 'primary.main' : { xs: 'divider', md: 'transparent' },
                      bgcolor: active ? 'color-mix(in srgb, var(--mui-palette-primary-main) 14%, transparent)' : 'transparent',
                      color: active ? 'text.primary' : 'text.secondary',
                      transition: 'background-color 160ms, color 160ms, border-color 160ms',
                      '&:hover': { color: 'text.primary' },
                    }}
                  >
                    {c.name}
                  </Box>
                );
              })}
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" component="h2" sx={{ mb: 1.5 }}>
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
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10" aria-hidden="true">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i}>
                  <Skeleton variant="rectangular" sx={{ aspectRatio: '4/5', height: 'auto' }} />
                  <Skeleton variant="text" width="40%" sx={{ mt: 1.5 }} />
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="50%" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={SearchOff}
              title="Produk tidak ditemukan"
              description="Coba ubah kata kunci pencarian atau filter kategori."
              action={<Button variant="outlined" onClick={() => router.push('/products')}>Reset filter</Button>}
            />
          ) : (
            <ProductGrid products={products} columns={3} />
          )}

          {totalPages > 1 && (
            <Box className="flex justify-center mt-12">
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
