'use client';

import Link from 'next/link';
import { Typography, TypographyProps } from '@mui/material';

interface AuthLinkProps extends TypographyProps {
  href: string;
  children: React.ReactNode;
}

export function AuthLink({ href, children, ...props }: AuthLinkProps) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <Typography
        component="span"
        color="primary"
        sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
        {...props}
      >
        {children}
      </Typography>
    </Link>
  );
}