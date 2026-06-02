# Salão da Jana

Site profissional + painel administrativo para o Salão da Jana.

## O que tem

- Site público rosa e dourado.
- Botão de WhatsApp.
- Lista de serviços e preços.
- Painel admin em `/admin`.
- Login com email e senha por variáveis de ambiente.
- Vendas salvas no Supabase.
- Agenda/horários salvos no Supabase.
- Bloco de notas salvo no Supabase.
- Calculadora no painel.
- Total vendido no mês, quantidade de atendimentos e serviço mais vendido.
- Exportar vendas em CSV.

## Como configurar

1. Crie o projeto no Supabase.
2. Abra o Supabase > SQL Editor.
3. Cole e execute o arquivo `supabase.sql`.
4. Na Vercel, configure as variáveis do `.env.example`.
5. Faça deploy.

## Variáveis importantes

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAIL=
ADMIN_PASSWORD=
SESSION_SECRET=
```

O `SUPABASE_SERVICE_ROLE_KEY` fica apenas no servidor. Não compartilhe essa chave.

## Login

Depois do deploy, acesse:

```txt
/admin
```


## Atualização incluída

- Favicon com `public/logo.png`.
- Logo no topo do site.
- Galeria Antes e Depois.
- Foto antes/depois de luzes.
- Avaliação da Juliana com 5 estrelas e 10/10.
