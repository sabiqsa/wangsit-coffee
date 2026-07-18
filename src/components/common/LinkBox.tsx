'use client';

import Link from 'next/link';
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

interface LinkBoxProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
}

export default function LinkBox({ href, children, ...props }: LinkBoxProps) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Box component={Link as any} href={href} {...props}>
      {children}
    </Box>
  );
}
