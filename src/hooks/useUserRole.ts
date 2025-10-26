import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { useAuth } from '@/presentation/hooks/use-auth';
import type { UserRole, UserProfile } from '@/types/user';

export function useUserRole() {
  const { user, isLoading: authLoading } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setRole(null);
        setUserProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile;
          setUserProfile(data);
          setRole(data.role || 'cliente');
        } else {
          setRole('cliente');
          setUserProfile(null);
        }
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar role do usuário:', err);
        setError('Erro ao carregar permissões do usuário');
        setRole('cliente');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchUserRole();
    }
  }, [user, authLoading]);

  return { 
    role, 
    userProfile, 
    loading: authLoading || loading, 
    error 
  };
}
