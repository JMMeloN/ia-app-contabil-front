import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  FileText,
  PlusCircle,
  Building2,
  User,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { USER_ROUTES } from '@/presentation/routes/route-paths';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import logo from '@/assets/logotipo-mono.png';
import logoWhite from '@/assets/logo-white.png';

const menuItems = [
  {
    title: 'Dashboard',
    icon: Home,
    path: USER_ROUTES.DASHBOARD,
  },
  {
    title: 'Minhas Solicitações',
    icon: FileText,
    path: USER_ROUTES.MY_REQUESTS,
  },
  {
    title: 'Nova Solicitação',
    icon: PlusCircle,
    path: USER_ROUTES.NEW_REQUEST,
  },
  {
    title: 'Minhas Empresas',
    icon: Building2,
    path: USER_ROUTES.MY_COMPANIES,
  },
  {
    title: 'Perfil',
    icon: User,
    path: USER_ROUTES.PROFILE,
  },
];

export function SidebarUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Limpar dados do localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('mock_user_role');

    // Redirecionar para login
    navigate('/sign-in');
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b z-50 flex items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>

        <div className="ml-4 flex items-center gap-2">
          <img src={logo} className="h-8 dark:hidden" alt="Logo" />
          <img src={logoWhite} className="h-8 hidden dark:block" alt="Logo" />
          <span className="font-bold text-lg">IAContabil</span>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full bg-background border-r transition-transform duration-300 z-50',
          'w-64 flex flex-col',
          // Mobile
          'lg:translate-x-0',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="h-16 border-b flex items-center px-6">
          <img src={logo} className="h-8 dark:hidden" alt="Logo" />
          <img src={logoWhite} className="h-8 hidden dark:block" alt="Logo" />
          <span className="ml-2 font-bold text-lg">IAContabil</span>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                    'hover:bg-accent',
                    isActive && 'bg-accent text-accent-foreground font-medium'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Info */}
        <div className="border-t p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Usuário</p>
              <p className="text-xs text-muted-foreground truncate">
                usuario@email.com
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>
    </>
  );
}
