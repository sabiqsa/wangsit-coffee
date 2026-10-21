import { Box, Typography } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface EmptyStateProps {
  icon: SvgIconComponent;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Box className="flex flex-col items-center text-center py-16 px-4">
      <Box
        className="flex items-center justify-center mb-5"
        sx={{ width: 64, height: 64, borderRadius: '16px', bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}
      >
        <Icon sx={{ fontSize: 28, color: 'primary.main' }} />
      </Box>
      <Typography variant="h5" component="h2" sx={{ mb: description ? 1 : 3 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 360 }}>
          {description}
        </Typography>
      )}
      {action}
    </Box>
  );
}
