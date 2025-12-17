# IAContabil - Contexto do Projeto

## Sobre o Projeto
Sistema de gerenciamento de contabilidade focado em notas fiscais.

## Stack Tecnológica

### Frontend (Atual)
- **Framework**: React 18 + TypeScript + Vite
- **Routing**: React Router DOM v6
- **UI**: shadcn/ui + Tailwind CSS + Radix UI
- **State Management**: Recoil
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Date Handling**: date-fns

### Backend (Em Desenvolvimento)
- **Framework**: Node.js (a ser implementado)
- **Objetivo**: Substituir completamente o Firebase

## Histórico Importante

### ✅ Concluído
1. **Remoção do Firebase** (15/12/2024)
   - Removidas todas as dependências do Firebase
   - Removidas configurações do Replit
   - Criados hooks placeholder para futura integração com backend Node.js
   - Build funcionando sem erros

2. **Arquitetura de Integração com APIs** (15/12/2024)
   - Implementada Clean Architecture com separação de camadas
   - Criada camada Domain (interfaces puras)
   - Criada camada Data (implementações de useCases)
   - Criada camada Infra (HttpClient com Axios)
   - Criada camada Main (factories e config)
   - Sistema de autenticação (public vs authenticated)
   - Documentação completa em `src/main/README.md`

### 📁 Estrutura do Projeto

```
src/
├── domain/              # ⭐ Camada Domain - Interfaces puras
│   ├── models/          # Modelos de domínio
│   └── usecases/        # Contratos dos casos de uso
│       ├── auth/
│       ├── companies/
│       └── notes/
│
├── data/                # ⭐ Camada Data - Implementações
│   ├── protocols/       # Protocolos HTTP
│   └── usecases/        # Implementações dos casos de uso
│       ├── auth/
│       ├── companies/
│       └── notes/
│
├── infra/               # ⭐ Camada Infra - Tecnologias específicas
│   └── http/            # Cliente HTTP (Axios)
│
├── main/                # ⭐ Camada Main - Composição
│   ├── config/          # Configurações (URLs, endpoints)
│   ├── factories/       # Factories de injeção de dependência
│   │   ├── http/
│   │   └── usecases/
│   └── examples/        # Documentação de uso
│
├── components/
│   ├── ui/              # Componentes shadcn/ui
│   ├── business/        # Componentes de negócio
│   └── requested-notes/ # Componentes de notas solicitadas
│
├── presentation/
│   ├── pages/           # Páginas da aplicação
│   ├── components/      # Layout interno
│   ├── hooks/           # Hooks de apresentação
│   └── routes/          # Configuração de rotas
│
├── hooks/               # Hooks globais
├── types/               # Definições TypeScript
└── lib/                 # Utilitários

```

## 🏗️ Arquitetura de Integração

### Fluxo de Dados
```
Component/Hook → Factory → UseCase → HttpClient → API
```

### Camadas (Clean Architecture)

1. **Domain**: Interfaces puras (contratos)
2. **Data**: Implementações dos casos de uso
3. **Infra**: Detalhes técnicos (Axios, etc)
4. **Main**: Composição e injeção de dependências

### Exemplo de Uso
```typescript
import { makeLogin } from '@/main/factories';

const authData = await makeLogin().execute({ email, password });
```

Documentação completa: `src/main/README.md`

## Hooks Preparados para Backend

Todos os hooks abaixo estão implementados com estruturas vazias, prontos para receber integração com API:

### `src/hooks/useAuthRecoil.ts`
- `useAuth()` - Autenticação do usuário
- Retorna: `{ user, isLoading, isAuthenticated }`

### `src/hooks/useUserRole.ts`
- `useUserRole()` - Permissões do usuário
- Retorna: `{ role, userProfile, loading, error }`
- Roles: 'admin' | 'operacional' | 'cliente'

### `src/hooks/useBusinessRecoil.ts`
- `useNotas()` - Gerenciamento de notas fiscais
- `useCompanies()` - Gerenciamento de empresas
- `useDashboard()` - Dados do dashboard

### `src/hooks/useRequestedNotes.ts`
- `useRequestedNotes()` - Notas solicitadas
- `useRequestedNotesAttachments()` - Anexos
- `useRequestedNotesHistory()` - Histórico e comentários

## Páginas Atuais (Placeholder)

Todas as páginas abaixo mostram mensagem de "Backend em desenvolvimento":

**Públicas:**
- `/sign-in` - Login
- `/sign-up` - Cadastro

**Internas:**
- `/dashboard` - Dashboard principal
- `/admin` - Painel administrativo
- `/list-notes` - Lista de notas fiscais
- `/create-note` - Criar nota fiscal
- `/company-management` - Gerenciar empresas
- `/requested-notes` - Notas solicitadas

## Tipos Principais

### User & Auth
```typescript
interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole; // 'admin' | 'operacional' | 'cliente'
  createdAt: string;
  updatedAt: string;
}
```

### Business
```typescript
interface NotaFiscal {
  id: string;
  razao_social: string;
  valor_nota: number;
  status: 'Emitida' | 'Processando';
  // ... outros campos
}

interface Company {
  id: string;
  razao_social: string;
  cnpj: string;
  // ... outros campos
}
```

## Scripts Disponíveis
```bash
npm run dev      # Servidor de desenvolvimento (porta 3000)
npm run build    # Build de produção
npm run preview  # Preview do build
npm run lint     # ESLint
```

## Próximos Passos
Ver arquivo `.claude/roadmap.md` para plano de desenvolvimento detalhado.

## Observações Importantes
- ⚠️ **Recoil deve ser mantido** - Usado para state management
- ⚠️ **Não criar arquivos desnecessários** - Sempre preferir editar arquivos existentes
- ✅ **Build funcionando** - O projeto compila sem erros TypeScript
