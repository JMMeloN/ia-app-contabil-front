# Exemplos de Uso da Arquitetura

## Como usar nos Hooks React

### Exemplo 1: Login
```typescript
import { useState } from 'react';
import { makeLogin } from '@/main/factories';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const loginUseCase = makeLogin();
      const authData = await loginUseCase.execute({ email, password });

      // Salvar token
      localStorage.setItem('access_token', authData.accessToken);
      if (authData.refreshToken) {
        localStorage.setItem('refresh_token', authData.refreshToken);
      }

      return authData;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
```

### Exemplo 2: Buscar Empresas
```typescript
import { useState, useEffect } from 'react';
import { makeGetCompanies } from '@/main/factories';
import type { Company } from '@/types';

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const getCompaniesUseCase = makeGetCompanies();
      const data = await getCompaniesUseCase.execute();
      setCompanies(data);
    } catch (error) {
      console.error('Erro ao buscar empresas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return { companies, loading, fetchCompanies };
}
```

### Exemplo 3: Criar Nota Fiscal
```typescript
import { useState } from 'react';
import { makeCreateNote } from '@/main/factories';
import type { CreateNoteParams } from '@/domain/usecases/notes/create-note';

export function useCreateNote() {
  const [loading, setLoading] = useState(false);

  const createNote = async (params: CreateNoteParams) => {
    setLoading(true);
    try {
      const createNoteUseCase = makeCreateNote();
      const nota = await createNoteUseCase.execute(params);
      return nota;
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { createNote, loading };
}
```

## Fluxo Completo

```
1. Component/Hook
   ↓
2. Factory (makeLogin, makeGetCompanies, etc)
   ↓
3. UseCase (RemoteLogin, RemoteGetCompanies, etc)
   ↓
4. HttpClient (AxiosHttpClient - authenticated ou public)
   ↓
5. API Backend
```

## Estrutura de Pastas

```
src/
├── domain/                  # Interfaces puras (contratos)
│   ├── models/             # Modelos de domínio
│   └── usecases/           # Interfaces dos casos de uso
│       ├── auth/
│       ├── companies/
│       └── notes/
│
├── data/                   # Implementações
│   ├── protocols/         # Protocolos HTTP
│   │   └── http/
│   └── usecases/          # Implementações dos casos de uso
│       ├── auth/
│       ├── companies/
│       └── notes/
│
├── infra/                 # Infraestrutura
│   └── http/             # Cliente HTTP (Axios)
│
└── main/                  # Composição e configuração
    ├── config/           # Configurações (API URLs, etc)
    └── factories/        # Factories para criar instâncias
        ├── http/
        └── usecases/
```

## Benefícios

1. **Desacoplamento**: Domain não conhece implementação
2. **Testabilidade**: Fácil criar mocks das interfaces
3. **Manutenibilidade**: Mudanças isoladas em cada camada
4. **Escalabilidade**: Fácil adicionar novos casos de uso
5. **Inversão de Dependência**: Dependemos de abstrações
