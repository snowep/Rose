import { LoginTemplate } from '@/components/templates/LoginTemplate';

export default function AuthGroupLayout({ children }: { children: React.ReactNode }) {
  return <LoginTemplate>{children}</LoginTemplate>;
}