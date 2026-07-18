import { Box, Typography } from '@mui/material';
import { Category, Inventory2, Star, LocalFireDepartment } from '@mui/icons-material';
import { IProduct } from '@/types';

interface ProductSpecsProps {
  product: IProduct;
}

export default function ProductSpecs({ product }: ProductSpecsProps) {
  const categoryLabel = typeof product.category === 'object' ? product.category.name : '—';

  const specs = [
    { icon: Category, label: 'Kategori', value: categoryLabel },
    { icon: Inventory2, label: 'Stok', value: product.stock > 0 ? `${product.stock} tersedia` : 'Habis' },
    { icon: Star, label: 'Rating', value: `${product.rating.toFixed(1)} / 5.0` },
    { icon: LocalFireDepartment, label: 'Terjual', value: `${product.sold}+` },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 my-4">
      {specs.map(({ icon: Icon, label, value }) => (
        <Box
          key={label}
          className="flex items-center gap-2 rounded-md p-3"
          sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}
        >
          <Icon sx={{ color: 'primary.main', fontSize: 20 }} />
          <Box>
            <Typography
              sx={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'text.secondary',
              }}
            >
              {label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {value}
            </Typography>
          </Box>
        </Box>
      ))}
    </div>
  );
}
