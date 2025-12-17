export type AuthModel = {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    displayName?: string;
    role: 'admin' | 'operacional' | 'cliente';
  };
};

export type UserModel = {
  id: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'operacional' | 'cliente';
  createdAt: string;
  updatedAt: string;
};
