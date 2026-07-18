'use client';

import Link from 'next/link';
import { Button } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  endIcon?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export default function LinkButton({ href, children, ...props }: LinkButtonProps) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Button component={Link as any} href={href} {...props}>
      {children}
    </Button>
  );
}
