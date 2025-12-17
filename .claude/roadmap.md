# Roadmap de Desenvolvimento - IAContabil

## 🎯 Objetivo Atual
Desenvolver backend Node.js para substituir completamente o Firebase.

---

## ✅ Fase 1: Limpeza (CONCLUÍDA - 15/12/2024)
- [x] Remover Firebase do projeto
- [x] Remover configurações do Replit
- [x] Criar hooks placeholder
- [x] Garantir build funcionando
- [x] Manter Recoil para state management

---

## ✅ Fase 2: Arquitetura Frontend (CONCLUÍDA - 15/12/2024)

### Status: CONCLUÍDO

### O que foi feito
- [x] Implementada Clean Architecture
- [x] Camada Domain (interfaces)
- [x] Camada Data (implementações)
- [x] Camada Infra (Axios)
- [x] Camada Main (factories)
- [x] HttpClient com auth/public
- [x] Exemplos de integração
- [x] Documentação completa
- [x] Build funcionando

### Entregáveis
- [x] Arquitetura pronta para consumir API
- [x] `src/main/README.md` completo
- [x] Hook exemplo `useAuthIntegrated`

---

## 🚧 Fase 3: Planejamento do Backend (PRÓXIMA)

### Status: PRÓXIMO PASSO

### Decisões Pendentes
- [ ] Definir arquitetura do backend (Express, Fastify, NestJS?)
- [ ] Escolher banco de dados (PostgreSQL, MongoDB, MySQL?)
- [ ] Definir estrutura de autenticação (JWT com refresh token)
- [ ] Definir estrutura de pastas do backend
- [ ] Escolher ORM/Query Builder (Prisma, TypeORM, Knex?)

### Entregáveis
- [ ] Documento de arquitetura
- [ ] Estrutura de pastas definida
- [ ] Stack tecnológica escolhida

---

## 📋 Fase 3: Setup Inicial do Backend (PRÓXIMA)

### Tarefas
- [ ] Criar projeto Node.js + TypeScript
- [ ] Configurar ESLint e Prettier
- [ ] Setup do banco de dados
- [ ] Configurar variáveis de ambiente
- [ ] Estrutura base de pastas

### Entregáveis
- [ ] Backend rodando em desenvolvimento
- [ ] Conexão com banco de dados funcionando
- [ ] Health check endpoint

---

## 🔐 Fase 4: Autenticação e Autorização

### Tarefas
- [ ] Implementar registro de usuário
- [ ] Implementar login (email/senha)
- [ ] Implementar login com Google (OAuth)
- [ ] Sistema de JWT/Sessions
- [ ] Middleware de autenticação
- [ ] Sistema de roles (admin, operacional, cliente)
- [ ] Proteção de rotas por role

### Entregáveis
- [ ] API de autenticação completa
- [ ] Sistema de roles funcionando
- [ ] Documentação de endpoints

---

## 👤 Fase 5: Módulo de Usuários

### Tarefas
- [ ] CRUD de usuários
- [ ] Perfil do usuário
- [ ] Atualização de dados
- [ ] Painel admin (listar/editar usuários)

### Entregáveis
- [ ] Endpoints de usuários
- [ ] Integração com frontend

---

## 🏢 Fase 6: Módulo de Empresas

### Tarefas
- [ ] CRUD de empresas
- [ ] Validação de CNPJ
- [ ] Associação empresa-usuário
- [ ] Listagem e busca

### Entregáveis
- [ ] Endpoints de empresas
- [ ] Integração com frontend

---

## 📄 Fase 7: Módulo de Notas Fiscais

### Tarefas
- [ ] CRUD de notas fiscais
- [ ] Upload de arquivos/anexos
- [ ] Sistema de status (Processando, Emitida)
- [ ] Listagem e filtros
- [ ] Dashboard com estatísticas

### Entregáveis
- [ ] Endpoints de notas fiscais
- [ ] Sistema de anexos
- [ ] Integração com frontend

---

## 📊 Fase 8: Módulo de Notas Solicitadas

### Tarefas
- [ ] CRUD de notas solicitadas
- [ ] Sistema de prioridades
- [ ] Sistema de anexos
- [ ] Histórico de alterações
- [ ] Sistema de comentários
- [ ] Filtros avançados

### Entregáveis
- [ ] Endpoints completos
- [ ] Integração com frontend

---

## 🎨 Fase 9: Melhorias no Frontend

### Tarefas
- [ ] Conectar todos os hooks com API
- [ ] Implementar loading states
- [ ] Implementar error handling
- [ ] Melhorar UX/UI
- [ ] Adicionar validações

### Entregáveis
- [ ] Frontend totalmente integrado
- [ ] Experiência de usuário melhorada

---

## 🚀 Fase 10: Deploy e Produção

### Tarefas
- [ ] Setup de CI/CD
- [ ] Configurar ambiente de produção
- [ ] Deploy do backend
- [ ] Deploy do frontend
- [ ] Monitoramento e logs
- [ ] Backups do banco de dados

### Entregáveis
- [ ] Sistema em produção
- [ ] Documentação completa

---

## 📝 Notas de Desenvolvimento

### Última Sessão (15/12/2024)
- Removido Firebase completamente
- **Criada arquitetura de integração com APIs (Clean Architecture)**
- Implementadas 4 camadas: Domain, Data, Infra, Main
- HttpClient com autenticação automática
- Factories de injeção de dependência
- Documentação completa em `src/main/README.md`
- Build funcionando sem erros

### Próxima Sessão
- Definir stack do backend Node.js
- Criar estrutura do projeto backend
- Implementar primeiro endpoint (login)
- Conectar frontend com backend

---

## 🔖 Lembretes
- Sempre manter o build funcionando
- Documentar decisões importantes
- Testar cada módulo antes de integrar
- Manter README atualizado
