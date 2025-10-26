# Guia de Configuração do Sistema RBAC

## ✅ Sistema Implementado

O sistema de controle de acesso baseado em roles (RBAC) foi implementado com sucesso! Agora você tem:

### **3 Roles Disponíveis:**
1. **Cliente** - Usuários padrão que visualizam e baixam suas notas fiscais
2. **Operacional** - Funcionários que processam solicitações e anexam notas
3. **Admin** - Administrador que gerencia roles dos usuários

---

## 🚀 Primeiros Passos

### **1. Deploy das Security Rules**

As Security Rules foram criadas mas precisam ser implantadas no Firebase Console:

#### **Firestore Rules** (`firestore.rules`):
```bash
# No terminal, execute:
firebase deploy --only firestore:rules
```

Ou manualmente no Firebase Console:
1. Acesse https://console.firebase.google.com
2. Selecione seu projeto "iacontabil"
3. Vá em **Firestore Database** → **Rules**
4. Cole o conteúdo do arquivo `firestore.rules`
5. Clique em **Publicar**

#### **Storage Rules** (`storage.rules`):
```bash
# No terminal, execute:
firebase deploy --only storage:rules
```

Ou manualmente no Firebase Console:
1. Acesse https://console.firebase.google.com
2. Selecione seu projeto "iacontabil"
3. Vá em **Storage** → **Rules**
4. Cole o conteúdo do arquivo `storage.rules`
5. Clique em **Publicar**

---

### **2. Criar Primeiro Usuário Admin**

Por segurança, o primeiro usuário admin deve ser criado manualmente:

#### **Opção A: Via Firebase Console (Mais Fácil)**
1. Acesse https://console.firebase.google.com
2. Vá em **Firestore Database**
3. Navegue até a coleção `users`
4. Encontre o documento do seu usuário (use seu UID)
5. Edite o campo `role` para `"admin"`
6. Salve

#### **Opção B: Criar Novo Usuário Admin**
1. Cadastre-se no sistema normalmente em `/sign-up`
2. Copie o UID do usuário criado (aparece no console do navegador ou no Firebase Auth)
3. No Firestore Console:
   - Vá em `users/{SEU_UID}`
   - Edite `role` de `"cliente"` para `"admin"`
   - Salve

---

## 📋 Fluxo de Uso do Sistema

### **Para Admin:**
1. **Acesse:** `/admin`
2. **Funcionalidades:**
   - Visualizar todos os usuários cadastrados
   - Alterar role de qualquer usuário entre `cliente` e `operacional`
   - Acessar área operacional também

### **Para Operacional:**
1. **Acesse:** `/operacional`
2. **Funcionalidades:**
   - Ver todas as solicitações de notas fiscais
   - Fazer upload de PDFs das notas processadas
   - Mudar status de `pendente` para `processado` ao anexar arquivo
   - Não pode acessar a área do cliente

### **Para Cliente:**
1. **Acesse:** `/cliente`
2. **Funcionalidades:**
   - Ver apenas suas próprias solicitações
   - Fazer download das notas que já foram processadas
   - Criar novas solicitações
   - Não pode acessar a área operacional

---

## 🔐 Estrutura de Dados

### **Coleção `users` (Firestore)**
```json
{
  "uid": "string",
  "email": "string",
  "displayName": "string?",
  "role": "admin" | "operacional" | "cliente",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

### **Coleção `requestedNotes` (Firestore)**
```json
{
  "id": "string",
  "clienteId": "string",
  "clienteNome": "string",
  "clienteEmail": "string",
  "numeroNota": "string",
  "valor": "number",
  "status": "pendente" | "processado" | "cancelado",
  "dataSolicitacao": "ISO string",
  "dataUltimaAtualizacao": "ISO string",
  "anexoUrl": "string?",
  "observacoes": "string?"
}
```

### **Firebase Storage**
```
/requestedNotes/
  /{noteId}/
    /nota_fiscal.pdf
```

---

## 🛡️ Segurança Implementada

### **Firestore Rules:**
- ✅ Clientes só leem suas próprias notas (`clienteId == uid`)
- ✅ Operacional lê e atualiza todas as notas
- ✅ Admin tem acesso total
- ✅ Apenas admin pode alterar roles de usuários

### **Storage Rules:**
- ✅ Clientes só baixam anexos de suas próprias notas
- ✅ Operacional faz upload e download de todos os anexos
- ✅ Admin tem acesso total aos arquivos

### **Frontend Routes:**
- ✅ `/admin` - Apenas role `admin`
- ✅ `/operacional` - Apenas roles `operacional` e `admin`
- ✅ `/cliente` - Apenas role `cliente`
- ✅ Redirecionamento automático se role não permitido

---

## 🧪 Como Testar

### **Teste 1: Cadastro de Novo Usuário**
1. Acesse `/sign-up`
2. Crie uma conta
3. Verifique que o role padrão é `cliente`
4. Você deve ser redirecionado para `/cliente` após login

### **Teste 2: Mudança de Role (Como Admin)**
1. Acesse `/admin` com usuário admin
2. Encontre um usuário cliente
3. Mude o role para `operacional`
4. Faça logout e login com esse usuário
5. Verifique que agora ele acessa `/operacional`

### **Teste 3: Upload e Download**
1. Como Operacional:
   - Acesse `/operacional`
   - Selecione uma solicitação pendente
   - Faça upload de um PDF
   - Verifique que o status muda para "Processado"

2. Como Cliente (dono da nota):
   - Acesse `/cliente`
   - Veja a nota com status "Processado"
   - Clique em "Download"
   - Verifique que o PDF baixa corretamente

### **Teste 4: Isolamento de Acesso**
1. Como Cliente:
   - Tente acessar `/operacional`
   - Deve ser redirecionado automaticamente

2. Como Operacional:
   - Tente acessar `/cliente`
   - Deve ser redirecionado automaticamente

---

## 🔄 Migrando Dados Existentes

Se você já tem dados em `users/{uid}/notes`, será necessário migrar para a nova estrutura `requestedNotes`.

**Script de Migração Sugerido:**
```javascript
// Execute no Firebase Console ou em um script Node.js
const migrateNotes = async () => {
  const usersSnapshot = await db.collection('users').get();
  
  for (const userDoc of usersSnapshot.docs) {
    const notesSnapshot = await db
      .collection(`users/${userDoc.id}/notes`)
      .get();
    
    for (const noteDoc of notesSnapshot.docs) {
      const noteData = noteDoc.data();
      
      await db.collection('requestedNotes').add({
        clienteId: userDoc.id,
        clienteNome: noteData.razao_social || 'Cliente',
        clienteEmail: noteData.email || userDoc.data().email,
        numeroNota: noteDoc.id.slice(-8).toUpperCase(),
        valor: noteData.valor_nota || 0,
        status: noteData.status === 'Emitida' ? 'processado' : 'pendente',
        dataSolicitacao: noteData.created_at?.toDate?.().toISOString() || new Date().toISOString(),
        dataUltimaAtualizacao: noteData.updated_at?.toDate?.().toISOString() || new Date().toISOString(),
        observacoes: noteData.observacoes || '',
      });
    }
  }
  
  console.log('Migração concluída!');
};
```

---

## 📝 Notas Importantes

1. **Backup**: Faça backup do Firestore antes de fazer deploy das rules
2. **Teste em Staging**: Se possível, teste as rules em um projeto de testes primeiro
3. **Primeiro Admin**: O primeiro usuário admin deve ser criado manualmente
4. **Security Rules**: São críticas para a segurança - revise antes de publicar
5. **Navegação**: O menu lateral muda automaticamente baseado no role

---

## ❓ Troubleshooting

### **Erro: "Permission denied" ao acessar notas**
- Verifique se as Security Rules foram publicadas
- Confirme que o campo `role` está correto no documento do usuário
- Limpe o cache e faça logout/login

### **Upload não funciona**
- Verifique as Storage Rules foram publicadas
- Confirme que o usuário tem role `operacional` ou `admin`
- Verifique permissões do Storage no Firebase Console

### **Redirecionamento infinito**
- Verifique se o role do usuário existe no Firestore
- Confirme que as rotas estão configuradas corretamente
- Faça hard refresh (Ctrl+Shift+R)

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do console do navegador (F12)
2. Verifique os logs do Firestore Debug Mode
3. Confirme que todas as dependências estão instaladas
4. Verifique se as Security Rules estão publicadas

---

**Sistema desenvolvido em:** Outubro 2025  
**Versão:** 1.0.0
