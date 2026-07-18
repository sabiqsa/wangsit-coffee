import { Box, Typography } from '@mui/material';
import { CreditCard, QrCode2 } from '@mui/icons-material';
import classNames from 'classnames';
import { PaymentMethod } from '@/types';
import styles from './PaymentMethodSelector.module.scss';

const OPTIONS: { value: PaymentMethod; label: string; desc: string; icon: typeof CreditCard }[] = [
  { value: 'midtrans', label: 'Kartu / E-Wallet', desc: 'Kartu Kredit, Transfer Bank, GoPay, ShopeePay', icon: CreditCard },
  { value: 'qris', label: 'QRIS', desc: 'Scan & bayar dari aplikasi bank/e-wallet apa saja', icon: QrCode2 },
];

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

export default function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <Box className="flex flex-col gap-2">
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const active = value === opt.value;
        return (
          <Box
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={classNames(styles.card, active && styles.cardActive)}
          >
            <Icon sx={{ color: active ? 'primary.main' : 'text.secondary' }} />
            <Box className="flex-1">
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{opt.label}</Typography>
              <Typography variant="caption" color="text.secondary">{opt.desc}</Typography>
            </Box>
            <Box className={classNames(styles.radio, active && styles.radioActive)} />
          </Box>
        );
      })}
    </Box>
  );
}
