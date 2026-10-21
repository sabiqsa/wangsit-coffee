'use client';

import Link from 'next/link';
import { Typography, Box, IconButton, Tooltip } from '@mui/material';
import { Add, Star } from '@mui/icons-material';
import { IProduct } from '@/types';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addToCart } from '@/store/slices/cartSlice';
import PriceTag from './PriceTag';
import styles from './ProductCard.module.scss';

interface Props {
  product: IProduct;
}

export default function ProductCard({ product }: Props) {
  const dispatch = useAppDispatch();

  const categoryLabel = typeof product.category === 'object' ? product.category.name : null;
  const soldOut = product.stock === 0;
  const href = `/products/${product.slug}`;

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <Link href={href} tabIndex={-1} aria-hidden="true">
          <img
            src={product.images[0] ?? `https://picsum.photos/seed/${product.slug}/600/750`}
            alt=""
            loading="lazy"
            className={styles.image}
          />
        </Link>
        <Tooltip title={soldOut ? 'Stok habis' : 'Tambah ke keranjang'}>
          <span className={styles.addWrap}>
            <IconButton
              onClick={() => dispatch(addToCart({ product, quantity: 1 }))}
              disabled={soldOut}
              aria-label={`Tambah ${product.name} ke keranjang`}
              className={styles.addBtn}
            >
              <Add fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </div>

      <Box className="flex flex-col gap-1 pt-3">
        {categoryLabel && (
          <Typography variant="caption" color="text.secondary">
            {categoryLabel}
          </Typography>
        )}
        <Link href={href} className={styles.title}>
          <Typography
            component="h3"
            sx={{
              fontWeight: 600,
              fontSize: { xs: '0.9rem', md: '0.975rem' },
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.name}
          </Typography>
        </Link>

        <Box className="flex items-center justify-between gap-2 mt-1">
          <PriceTag amount={product.price} sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }} />
          {soldOut ? (
            <Typography variant="caption" color="error">Stok habis</Typography>
          ) : (
            <Typography variant="caption" color="text.secondary" className="tabular inline-flex items-center gap-0.5">
              <Star sx={{ fontSize: 14, color: 'primary.main' }} aria-hidden />
              {product.rating.toFixed(1)}
              <span className="hidden sm:inline">&nbsp;({product.sold})</span>
            </Typography>
          )}
        </Box>
      </Box>
    </article>
  );
}
