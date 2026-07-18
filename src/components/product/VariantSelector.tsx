'use client';

import { Box, Typography } from '@mui/material';
import classNames from 'classnames';
import styles from './VariantSelector.module.scss';

interface VariantSelectorProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

export default function VariantSelector({ label, options, selected, onSelect }: VariantSelectorProps) {
  if (options.length === 0) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="overline"
        sx={{ display: 'block', color: 'text.secondary', mb: 1 }}
      >
        {label}
      </Typography>
      <Box className={styles.group}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={classNames(styles.segment, option === selected && styles.segmentActive)}
          >
            {option}
          </button>
        ))}
      </Box>
    </Box>
  );
}
