'use client';

import { Layout } from '@/components/organisms/Layout';
import { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return <Layout>{children}</Layout>;
}