[README.md](https://github.com/user-attachments/files/28475300/README.md)
# 🥠 Mensagem do Universo

Site do biscoito da sorte diário com mensagens geradas por IA.

## Como publicar

### 1. Clonar e subir no GitHub
```bash
git init
git add .
git commit -m "primeiro commit"
git remote add origin https://github.com/SEU_USUARIO/mensagem-do-universo.git
git push -u origin main
```

### 2. Publicar no Netlify (gratuito)
1. Acesse https://netlify.com e crie uma conta
2. Clique em "Add new site" → "Import from Git"
3. Conecte seu repositório GitHub
4. Clique em "Deploy site"
5. Aponte o domínio mensagemdouniverso.com.br nas configurações

### 3. Configurar a chave da API (obrigatório)
A chave da API do Claude deve ficar em uma função serverless, nunca exposta no HTML.

No Netlify, vá em Site Settings → Environment Variables e adicione:
```
ANTHROPIC_API_KEY=sua_chave_aqui
```

Depois use a função em `/netlify/functions/mensagem.js` (incluída neste projeto).

## Estrutura
```
mensagem-do-universo/
├── index.html              # Site principal
├── netlify/
│   └── functions/
│       └── mensagem.js     # Backend serverless (chave da API protegida)
└── README.md
```
