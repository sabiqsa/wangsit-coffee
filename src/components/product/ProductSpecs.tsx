import { Box, Typography } from '@mui/material';
import { IProduct } from '@/types';

interface ProductSpecsProps {
  product: IProduct;
}

export default function ProductSpecs({ product }: ProductSpecsProps) {
  const specs = [
    { label: 'Stok', value: product.stock > 0 ? `${product.stock} tersedia` : 'Habis' },
    { label: 'Rating', value: `${product.rating.toFixed(1)} dari 5` },
    { label: 'Terjual', value: `${product.sold}+` },
  ];

  return (
    <Box
      component="dl"
      className="grid grid-cols-3 py-4"
      sx={{ borderTop: 1, borderBottom: 1, borderColor: 'divider', mx: 0, my: 3 }}
    >
      {specs.map(({ label, value }, i) => (
        <Box key={label} sx={{ pl: i === 0 ? 0 : 2, borderLeft: i === 0 ? 0 : 1, borderColor: 'divider' }}>
          <Typography component="dt" variant="caption" color="text.secondary">
            {label}
          </Typography>
          <Typography component="dd" variant="body2" className="tabular" sx={{ fontWeight: 600, m: 0, mt: 0.25 }}>
            {value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
