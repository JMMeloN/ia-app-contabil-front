import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserRole } from '@/types/user';

/**
 * Componente temporário para desenvolvimento
 * Permite alternar entre perfis de usuário
 * REMOVER EM PRODUÇÃO
 */
export function DevRoleSwitcher() {
  const [currentRole, setCurrentRole] = useState<UserRole>('cliente');

  useEffect(() => {
    const savedRole = localStorage.getItem('mock_user_role') as UserRole;
    if (savedRole) {
      setCurrentRole(savedRole);
    }
  }, []);

  const handleRoleChange = (newRole: string) => {
    localStorage.setItem('mock_user_role', newRole);
    setCurrentRole(newRole as UserRole);
    window.location.reload();
  };

  // Só mostrar em desenvolvimento
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background border-2 border-primary rounded-lg shadow-lg p-4">
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          DEV - Perfil Atual
        </p>
        <Select value={currentRole} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cliente">👤 Cliente</SelectItem>
            <SelectItem value="operacional">⚙️ Operacional</SelectItem>
            <SelectItem value="admin">👑 Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
