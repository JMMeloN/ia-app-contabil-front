import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

let authListenerInitialized = false;

export const initializeAuthListener = (
  onAuthChange: (user: User | null) => void
) => {
  if (authListenerInitialized) {
    return () => {};
  }

  authListenerInitialized = true;

  const unsubscribe = onAuthStateChanged(auth, onAuthChange);

  return unsubscribe;
};
