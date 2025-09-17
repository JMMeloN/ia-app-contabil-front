import { useAuthRecoil } from '@/hooks';

interface AuthInitializerProps {
  children: React.ReactNode;
}

export const AuthInitializer = ({ children }: AuthInitializerProps) => {
  // This component just needs to be rendered to initialize the auth state
  useAuthRecoil();

  return <>{children}</>;
};