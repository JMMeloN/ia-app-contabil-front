import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/firebase';
import type { UserRole, UserProfile } from '@/types/user';

export function useUserRole() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        setRole(null);
        setUserProfile(null);
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        
        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile;
          setUserProfile(data);
          setRole(data.role || 'cliente');
        } else {
          setRole('cliente');
          setUserProfile(null);
        }
      } catch (err) {
        console.error('Erro ao buscar role do usuário:', err);
        setError('Erro ao carregar permissões do usuário');
        setRole('cliente');
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged(() => {
      fetchUserRole();
    });

    return () => unsubscribe();
  }, []);

  return { role, userProfile, loading, error };
}
