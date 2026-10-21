'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container, Typography, Box, Button, Rating, Skeleton, Alert,
  Breadcrumbs, Link as MuiLink, TextField,
} from '@mui/material';
import { ShoppingCart, ArrowBack, SearchOff } from '@mui/icons-material';
import ProductImageZoom from '@/components/product/ProductImageZoom';
import ProductSpecs from '@/components/product/ProductSpecs';
import VariantSelector from '@/components/product/VariantSelector';
import PriceTag from '@/components/product/PriceTag';
import ProductGrid from '@/components/product/ProductGrid';
import SectionHeading from '@/components/common/SectionHeading';
import EmptyState from '@/components/common/EmptyState';
import { IProduct, IProductVariant } from '@/types';
import { getProductBySlug, getRelatedProducts } from '@/lib/queries';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addToCart } from '@/store/slices/cartSlice';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [related, setRelated] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setSelectedVariant(0);
    getProductBySlug(slug)
      .then(async (p) => {
        setProduct(p);
        if (p && typeof p.category === 'object') {
          const relatedProducts = await getRelatedProducts(p.category._id, p._id);
          setRelated(relatedProducts);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const variant = product?.variants[selectedVariant];
  const price = variant?.price ?? product?.price ?? 0;
  const variantLabel = (v: IProductVariant) => [v.size, v.strength].filter(Boolean).join(' / ');

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({ product, quantity, variant: variant ?? undefined }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" className="py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton variant="rectangular" sx={{ borderRadius: 2, aspectRatio: '1/1' }} />
          <Box>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" height={40} />
            <Skeleton variant="rectangular" height={120} sx={{ mt: 2, borderRadius: 2 }} />
          </Box>
        </div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" className="py-8 md:py-12">
        <EmptyState
          icon={SearchOff}
          title="Produk tidak ditemukan"
          action={
            <Button startIcon={<ArrowBack />} onClick={() => router.push('/products')} variant="outlined">
              Kembali ke katalog
            </Button>
          }
        />
      </Container>
    );
  }

  const category = typeof product.category === 'object' ? product.category : null;

  return (
    <Container maxWidth="lg" className="py-8 md:py-12">
      <Breadcrumbs sx={{ mb: { xs: 3, md: 5 }, fontSize: '0.875rem' }}>
        <MuiLink component="button" onClick={() => router.push('/')} underline="hover" color="inherit">
          Beranda
        </MuiLink>
        <MuiLink component="button" onClick={() => router.push('/products')} underline="hover" color="inherit">
          Produk
        </MuiLink>
        {category && (
          <MuiLink
            component="button"
            onClick={() => router.push(`/products?category=${category.slug}`)}
            underline="hover"
            color="inherit"
          >
            {category.name}
          </MuiLink>
        )}
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        <ProductImageZoom images={product.images} alt={product.name} />

        <div>
          {category && (
            <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600, mb: 1 }}>
              {category.name}
            </Typography>
          )}

          <Typography variant="h2" component="h1" sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, mb: 1.5 }}>
            {product.name}
          </Typography>

          <Box className="flex items-center gap-1.5 mb-5">
            <Rating value={product.rating} precision={0.5} readOnly size="small" />
            <Typography variant="body2" color="text.secondary" className="tabular">
              {product.rating.toFixed(1)}, {product.sold} terjual
            </Typography>
          </Box>

          <PriceTag amount={price} sx={{ fontSize: { xs: '1.75rem', md: '2rem' }, fontWeight: 600, mb: 3 }} />

          <Typography variant="body1" color="text.secondary" sx={{ mb: 1, maxWidth: '60ch' }}>
            {product.description}
          </Typography>

          <ProductSpecs product={product} />

          {product.variants.length > 0 && (
            <VariantSelector
              label="Varian"
              options={product.variants.map(variantLabel)}
              selected={variantLabel(product.variants[selectedVariant])}
              onSelect={(label) => {
                const idx = product.variants.findIndex((v) => variantLabel(v) === label);
                if (idx >= 0) setSelectedVariant(idx);
              }}
            />
          )}

          <Box className="flex items-center gap-2 mb-3">
            <Typography variant="body2" color="text.secondary">Jumlah:</Typography>
            <TextField
              type="number"
              size="small"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
              slotProps={{ htmlInput: { min: 1, max: product.stock } }}
              sx={{ width: 80 }}
            />
            <Typography variant="body2" color="text.secondary">Stok: {product.stock}</Typography>
          </Box>

          {added && <Alert severity="success" sx={{ mb: 2 }}>Ditambahkan ke keranjang.</Alert>}

          <Box className="flex gap-2">
            <Button
              variant="outlined"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              fullWidth
            >
              {product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={() => { handleAddToCart(); router.push('/cart'); }}
              disabled={product.stock === 0}
              fullWidth
              sx={{ whiteSpace: 'nowrap' }}
            >
              Beli Sekarang
            </Button>
          </Box>
        </div>
      </div>

      {related.length > 0 && (
        <Box component="section" className="mt-20 md:mt-28">
          <SectionHeading title="Cocok juga dengan ini" subtitle="Dari kategori yang sama." />
          <ProductGrid products={related} />
        </Box>
      )}
    </Container>
  );
}
