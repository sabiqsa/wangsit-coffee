import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import { ArrowForward } from '@mui/icons-material';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

export default function SectionHeading({ title, subtitle, viewAllHref, viewAllLabel = 'Lihat semua' }: SectionHeadingProps) {
  return (
    <Box className="flex items-end justify-between gap-6 mb-8 md:mb-10">
      <Box>
        <Typography variant="h3" component="h2" sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: '52ch' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {viewAllHref && (
        <Link href={viewAllHref} className="shrink-0 group">
          <Box
            component="span"
            className="inline-flex items-center gap-1"
            sx={{ fontWeight: 600, fontSize: '0.9rem', color: 'text.primary', '&:hover': { color: 'primary.main' } }}
          >
            {viewAllLabel}
            <ArrowForward sx={{ fontSize: 18 }} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Box>
        </Link>
      )}
    </Box>
  );
}
