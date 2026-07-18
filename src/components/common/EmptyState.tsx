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
      <Icon sx={{ fontSize: 56, color: 'text.secondary', mb: 2, opacity: 0.6 }} />
      <Typography variant="h6" sx={{ fontWeight: 600, mb: description ? 0.5 : 2 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 360 }}>
          {description}
        </Typography>
      )}
      {action}
    </Box>
  );
}
