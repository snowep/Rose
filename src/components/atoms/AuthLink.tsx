'use client';

import Link from 'next/link';
import { Typography, TypographyProps } from '@mui/material';

interface AuthLinkProps extends TypographyProps {
  href: string;
  children: React.ReactNode;
}

export function AuthLink({ href, children, ...props }: AuthLinkProps) {
  return (
    <Link href={href}>
      <Typography
        color="primary"
        sx={{ cursor: 'pointer', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        {...props}
      >
        {children}
      </Typography>
    </Link>
  );
}