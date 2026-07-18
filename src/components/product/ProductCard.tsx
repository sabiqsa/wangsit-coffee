'use client';

import { useRouter } from 'next/navigation';
import { Card, CardActionArea, Typography, Box, Rating, Chip, IconButton, Tooltip } from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';
import { IProduct } from '@/types';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addToCart } from '@/store/slices/cartSlice';
import PriceTag from './PriceTag';

interface Props {
  product: IProduct;
}

export default function ProductCard({ product }: Props) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const categoryLabel = typeof product.category === 'object' ? product.category.name : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <CardActionArea onClick={() => router.push(`/products/${product.slug}`)} className="flex! flex-col! items-stretch! h-full">
        <Box className="relative w-full aspect-square overflow-hidden">
          <Box
            component="img"
            src={product.images[0] ?? `https://placehold.co/400x400?text=${encodeURIComponent(product.name)}`}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <Box className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          {categoryLabel && (
            <Chip
              label={categoryLabel}
              size="small"
              className="absolute! top-2 left-2"
              sx={{
                bgcolor: 'rgba(18,18,18,0.7)',
                color: 'var(--mui-palette-primary-main)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                height: 22,
              }}
            />
          )}
          {product.stock === 0 && (
            <Chip label="Habis" size="small" color="error" className="absolute! top-2 right-2" />
          )}
        </Box>

        <Box className="flex flex-col gap-1 p-3 flex-1 w-full">
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.name}
          </Typography>

          <Box className="flex items-center gap-1">
            <Rating value={product.rating} precision={0.5} size="small" readOnly />
            <Typography variant="caption" color="text.secondary">
              ({product.sold} terjual)
            </Typography>
          </Box>

          <PriceTag amount={product.price} variant="subtitle1" sx={{ mt: 0.5 }} />
        </Box>
      </CardActionArea>

      <Tooltip title="Tambah ke keranjang">
        <IconButton
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            bgcolor: 'primary.main',
            color: 'var(--mui-palette-primary-contrastText)',
            '&:hover': { bgcolor: 'primary.main', opacity: 0.9 },
            width: 34,
            height: 34,
          }}
        >
          <AddShoppingCart fontSize="small" />
        </IconButton>
      </Tooltip>
    </Card>
  );
}
