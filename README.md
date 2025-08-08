# 📄 Gerador de Currículos Automático

Sistema completo para geração automática de currículos profissionais com interface web moderna e API REST.

## 🚀 Funcionalidades

### Interface Web
- **Formulário interativo** para preenchimento de dados
- **Visualização em tempo real** do currículo
- **Download automático** de PDF profissional
- **Design responsivo** e moderno
- **Comunicação com API** integrada

### API REST
- **Geração de PDF via POST** para integração com N8N e outros sistemas
- **Múltiplos formatos de entrada** suportados
- **Validação robusta** de dados
- **Logs detalhados** para debug

## 🔗 API Endpoints

### Gerar PDF via POST
```bash
POST /api/generate-pdf
Content-Type: application/json

{
  "nome": "João Silva Santos",
  "email": "joao@email.com",
  "telefone": "(11) 99999-9999",
  "endereco": "Rua das Flores, 123",
  "cidade": "São Paulo",
  "estado": "SP",
  "escolaridade": "Ensino Superior Completo",
  "disponibilidade": "Manhã, Tarde",
  "experiencia": "Analista de Sistemas...",
  "cursos": "React.js, TypeScript..."
}
```

### Testar conversão de dados
```bash
POST /api/test-conversion
```

### Health Check
```bash
GET /api/health
```

### Status do Build
```bash
GET /api/status
```

## 🛠️ Instalação e Uso

### Desenvolvimento Local

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Execute o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acesse a aplicação:**
   - Interface Web: `http://localhost:5173`

### Produção

1. **Build da aplicação:**
   ```bash
   npm run build
   ```

2. **Inicie o servidor:**
   ```bash
   npm start
   ```

3. **Para EasyPanel (build + start):**
   ```bash
   npm run easypanel
   ```

4. **Acesse em produção:**
   - Interface Web: `http://localhost:80`
   - API: `http://localhost:80/api/generate-pdf`

## 🐳 Docker

### Build da imagem:
```bash
docker build -t resume-generator .
```

### Executar container:
```bash
docker run -p 80:80 resume-generator
```

## 🎨 Recursos do Design

- **Layout profissional** com sidebar lateral
- **Cores modernas** e gradientes elegantes
- **Tipografia otimizada** para legibilidade
- **Responsivo** para todos os dispositivos
- **Seções organizadas:** Contato, Educação, Experiência, Competências
- **Comunicação frontend-backend** integrada

## 🔧 Tecnologias

### Frontend
- **React** + **TypeScript** + **Vite**
- **Tailwind CSS** para styling
- **Lucide React** para ícones
- **html2canvas** + **jsPDF** (fallback local)

### Backend
- **Node.js** + **Express**
- **Puppeteer** para geração de PDF
- **CORS** configurado para produção

### DevOps
- **Docker** multi-stage build
- **EasyPanel** ready
- **GitHub** integration

## 📝 Estrutura de Dados Suportada

O sistema processa os seguintes campos:

### Obrigatórios
- `nome` - Nome completo

### Opcionais
- **Dados pessoais:** `cpf`, `rg`, `telefone`, `nascimento`
- **Endereço:** `cep`, `endereco`, `cidade`, `estado`
- **Contatos:** `email`, `telefoneAlternativo`
- **Educação:** `escolaridade`, `instituicao`
- **Disponibilidade:** `disponibilidade`
- **Experiência:** `experiencia`
- **Cursos:** `cursos`

## 🚀 Integração com N8N

### Configuração do Webhook:
1. **URL:** `https://seu-dominio.com/api/generate-pdf`
2. **Method:** `POST`
3. **Headers:** `Content-Type: application/json`
4. **Body:** JSON com dados do formulário
5. **Response:** PDF binário para download

### Exemplo de uso:
```javascript
// N8N HTTP Request Node
{
  "method": "POST",
  "url": "https://seu-dominio.com/api/generate-pdf",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "nome": "{{$json.nome}}",
    "email": "{{$json.email}}",
    // ... outros campos
  }
}
```

## 📊 Monitoramento

### Health Check
```bash
curl https://seu-dominio.com/api/health
```

### Status do Build
```bash
curl https://seu-dominio.com/api/status
```

## 🔒 Segurança

- **CORS** configurado para produção
- **Validação** de entrada robusta
- **Sanitização** de dados
- **Rate limiting** (recomendado para produção)

## 🚀 Deploy

### EasyPanel
1. Conecte seu repositório GitHub
2. Configure as variáveis de ambiente (se necessário)
3. Deploy automático via `npm run easypanel`

### Outras plataformas
- **Heroku:** Suporte nativo ao Node.js
- **Railway:** Deploy direto do GitHub
- **DigitalOcean:** App Platform
- **AWS:** Elastic Beanstalk

## 📈 Performance

- **Build otimizado** com Vite
- **Minificação** com Terser
- **Puppeteer** otimizado para containers
- **Multi-stage Docker** build
- **Caching** de dependências

## 🐛 Troubleshooting

### Erro de build no Docker:
```bash
# Limpar cache do Docker
docker system prune -a

# Rebuild sem cache
docker build --no-cache -t resume-generator .
```

### Puppeteer não funciona:
- Verifique se o Chromium está instalado
- Configure as flags corretas no container
- Use `--no-sandbox` em ambientes containerizados

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do container
2. Teste os endpoints de health check
3. Valide o JSON de entrada
4. Consulte a documentação da API

---

**Sistema 100% funcional para produção!** 🎯