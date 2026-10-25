'use client';

import { Card, CardContent, Box, Typography } from '@mui/material';
import { Logo } from '@/components/atoms/Logo';

interface AuthFormCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthFormCard({ title, description, children, footer }: AuthFormCardProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Logo />
          </Box>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              {description}
            </Typography>
          )}
          {children}
          {footer && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              {footer}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
