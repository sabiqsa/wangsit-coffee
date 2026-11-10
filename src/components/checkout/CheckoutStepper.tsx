import { Box, Typography } from '@mui/material';
import { CheckCircle, RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';
import classNames from 'classnames';
import styles from './CheckoutStepper.module.scss';

export type CheckoutStep = 'shipping' | 'payment' | 'review';

const STEPS: { id: CheckoutStep; label: string }[] = [
  { id: 'shipping', label: 'Pengiriman' },
  { id: 'payment', label: 'Pembayaran' },
  { id: 'review', label: 'Konfirmasi' },
];

export default function CheckoutStepper({ current }: { current: CheckoutStep }) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);

  return (
    <Box className={styles.stepper}>
      {STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <Box key={step.id} className={classNames(styles.step, (done || active) && styles.stepActive)}>
            {done ? (
              <CheckCircle fontSize="small" />
            ) : active ? (
              <RadioButtonChecked fontSize="small" />
            ) : (
              <RadioButtonUnchecked fontSize="small" />
            )}
            <Typography component="span" className={styles.stepLabel}>
              {step.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
