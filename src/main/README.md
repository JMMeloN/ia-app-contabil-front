# Arquitetura de Integração com APIs

## 📋 Visão Geral

Esta é uma implementação de **Clean Architecture** para integração com APIs REST, seguindo os princípios SOLID e separação de responsabilidades.

## 🏗️ Estrutura das Camadas

### 1. **Domain** (`src/domain/`)
Camada de domínio - **interfaces puras** (contratos)

```
domain/
├── models/           # Modelos de domínio
│   └── auth-model.ts
└── usecases/         # Interfaces dos casos de uso
    ├── auth/
    │   ├── login.ts
    │   ├── register.ts
    │   └── get-current-user.ts
    ├── companies/
    │   ├── get-companies.ts
    │   └── create-company.ts
    └── notes/
        ├── get-notes.ts
        └── create-note.ts
```

**Responsabilidade**: Definir contratos (interfaces) que o resto da aplicação deve seguir.

### 2. **Data** (`src/data/`)
Camada de dados - **implementações dos casos de uso**

```
data/
├── protocols/        # Protocolos de comunicação
│   └── http/
│       └── http-client.ts
└── usecases/         # Implementações concretas
    ├── auth/
    │   ├── remote-login.ts
    │   ├── remote-register.ts
    │   └── remote-get-current-user.ts
    ├── companies/
    │   ├── remote-get-companies.ts
    │   └── remote-create-company.ts
    └── notes/
        ├── remote-get-notes.ts
        └── remote-create-note.ts
```

**Responsabilidade**: Implementar as interfaces do Domain usando os protocolos HTTP.

### 3. **Infra** (`src/infra/`)
Camada de infraestrutura - **implementação de tecnologias específicas**

```
infra/
└── http/
    └── axios-http-client.ts  # Implementação HTTP com Axios
```

**Responsabilidade**: Implementar detalhes técnicos (Axios, Fetch, etc).

### 4. **Main** (`src/main/`)
Camada principal - **composição e configuração**

```
main/
├── config/
│   └── api-config.ts         # URLs e endpoints
├── factories/
│   ├── http/
│   │   └── http-client-factory.ts
│   ├── usecases/
│   │   ├── auth/
│   │   │   ├── login-factory.ts
│   │   │   ├── register-factory.ts
│   │   │   └── get-current-user-factory.ts
│   │   ├── companies/
│   │   │   ├── get-companies-factory.ts
│   │   │   └── create-company-factory.ts
│   │   └── notes/
│   │       ├── get-notes-factory.ts
│   │       └── create-note-factory.ts
│   └── index.ts              # Exporta todas as factories
└── examples/
    └── usage-example.md      # Exemplos de uso
```

**Responsabilidade**: Criar instâncias com dependências injetadas.

## 🔄 Fluxo de Dados

```
Component/Hook
    ↓
Factory (makeLogin, makeGetCompanies)
    ↓
UseCase (RemoteLogin, RemoteGetCompanies)
    ↓
HttpClient (AxiosHttpClient)
    ↓
API Backend
```

## 🚀 Como Usar

### 1. Autenticação (Login)

```typescript
import { makeLogin } from '@/main/factories';

// No seu hook ou component
const login = async (email: string, password: string) => {
  const loginUseCase = makeLogin();
  const authData = await loginUseCase.execute({ email, password });

  localStorage.setItem('access_token', authData.accessToken);
  return authData;
};
```

### 2. Buscar Empresas

```typescript
import { makeGetCompanies } from '@/main/factories';

const fetchCompanies = async () => {
  const getCompaniesUseCase = makeGetCompanies();
  const companies = await getCompaniesUseCase.execute();
  return companies;
};
```

### 3. Criar Nota Fiscal

```typescript
import { makeCreateNote } from '@/main/factories';

const createNote = async (noteData) => {
  const createNoteUseCase = makeCreateNote();
  const nota = await createNoteUseCase.execute(noteData);
  return nota;
};
```

## 🔐 HttpClient - Auth vs Public

### Público (sem autenticação)
```typescript
HttpClientFactory.makePublicHttpClient()
```
Usado para: Login, Registro, endpoints públicos

### Autenticado (com JWT)
```typescript
HttpClientFactory.makeAuthenticatedHttpClient()
```
Usado para: Buscar dados do usuário, CRUD de empresas, notas, etc.

## 📝 Adicionando Novo Caso de Uso

### 1. Criar Interface no Domain
```typescript
// src/domain/usecases/users/get-users.ts
export interface GetUsers {
  execute(): Promise<User[]>;
}
```

### 2. Implementar em Data
```typescript
// src/data/usecases/users/remote-get-users.ts
export class RemoteGetUsers implements GetUsers {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<User[]>
  ) {}

  async execute(): Promise<User[]> {
    const response = await this.httpClient.request({
      url: this.url,
      method: 'get',
    });
    return response.body || [];
  }
}
```

### 3. Criar Factory em Main
```typescript
// src/main/factories/usecases/users/get-users-factory.ts
export const makeGetUsers = (): GetUsers => {
  const httpClient = HttpClientFactory.makeAuthenticatedHttpClient();
  return new RemoteGetUsers('/users', httpClient);
};
```

### 4. Usar no Hook/Component
```typescript
import { makeGetUsers } from '@/main/factories';

const users = await makeGetUsers().execute();
```

## ✅ Benefícios

1. **Testabilidade**: Fácil mockar interfaces
2. **Manutenibilidade**: Mudanças isoladas
3. **Escalabilidade**: Fácil adicionar features
4. **Desacoplamento**: Camadas independentes
5. **Inversão de Dependência**: Depende de abstrações

## 🔧 Configuração

1. Copiar `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configurar URL da API:
```env
VITE_API_URL=http://localhost:4000/api
```

## 📚 Mais Informações

Ver `src/main/examples/usage-example.md` para exemplos completos de integração.
