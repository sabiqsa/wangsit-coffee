import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import { ArrowForward } from '@mui/icons-material';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
}

export default function SectionHeading({ title, subtitle, viewAllHref }: SectionHeadingProps) {
  return (
    <Box className="flex items-end justify-between gap-4 mb-6 md:mb-8">
      <Box>
        <Typography
          variant="h4"
          sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '-0.01em' }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {viewAllHref && (
        <Link href={viewAllHref} className="shrink-0">
          <Box
            className="flex items-center gap-1"
            sx={{
              color: 'primary.main',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            View All
            <ArrowForward sx={{ fontSize: 16 }} />
          </Box>
        </Link>
      )}
    </Box>
  );
}
