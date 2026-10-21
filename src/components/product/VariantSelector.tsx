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
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" sx={{ mb: 1.25 }}>
        {label}
      </Typography>
      <Box className={styles.group} role="radiogroup" aria-label={label}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={option === selected}
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
