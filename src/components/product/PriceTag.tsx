import { Typography, TypographyProps } from '@mui/material';
import { formatRupiah } from '@/lib/format';

interface PriceTagProps extends Omit<TypographyProps, 'children'> {
  amount: number;
}

export default function PriceTag({ amount, sx, ...props }: PriceTagProps) {
  return (
    <Typography
      {...props}
      sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em', color: 'text.primary', ...sx }}
    >
      {formatRupiah(amount)}
    </Typography>
  );
}
