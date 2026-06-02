# Passo a passo

## 1. Supabase

Abra seu projeto Supabase e vá em:

SQL Editor > New Query

Cole o conteúdo do arquivo `supabase.sql` e clique em **Run**.

## 2. Vercel

Vá no projeto da Vercel:

Settings > Environment Variables

Crie:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
ADMIN_EMAIL=email_que_voce_quiser
ADMIN_PASSWORD=senha_que_voce_quiser
SESSION_SECRET=qualquer_texto_grande_aleatorio
```

Depois clique em **Redeploy**.

## 3. Painel

Acesse:

```txt
https://seusite.vercel.app/admin
```

## 4. Segurança

Não envie `SUPABASE_SERVICE_ROLE_KEY` para ninguém.
Não coloque `NEXT_PUBLIC_` na service role key.
