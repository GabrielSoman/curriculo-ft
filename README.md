# 📄 Gerador de Currículos Automático

Sistema completo para geração automática de currículos profissionais com interface web moderna e API REST.

## 🚀 Funcionalidades

- **Interface web responsiva** para preenchimento de dados
- **Visualização em tempo real** do currículo
## 🔗 API Endpoints
- **Download automático** de PDF profissional
### Gerar PDF via POST
```bash
POST /api/generate-pdf
Content-Type: application/json
- **API REST** para integração com N8N e outros sistemas
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
- **Design moderno** baseado em templates profissionais
### Testar conversão de dados
```bash
POST /api/test-conversion
```
- **Tecnologia React + TypeScript**
### Health Check
```bash
GET /api/health
```

## 🛠️ Instalação e Uso

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Execute o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Para produção:**
   ```bash
   npm run build
   npm start
   ```

4. **Para EasyPanel:**
   ```bash
   npm run easypanel
   ```

5. **Acesse a aplicação:**
   - Interface Web: `http://localhost:5173`
   - API: `http://localhost:80/api/generate-pdf`

## 🎨 Recursos do Design

- Layout profissional com sidebar lateral
- Cores modernas e gradientes elegantes
- Tipografia otimizada para legibilidade
- Responsivo para todos os dispositivos
- Seções organizadas: Contato, Educação, Experiência, Competências

## 🔧 Tecnologias

- **Frontend:** React + TypeScript + Vite
- **PDF Generation:** html2canvas + jsPDF
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

## 📝 Estrutura de Dados Suportada

O sistema processa os seguintes campos:
- Dados pessoais (nome, CPF, RG, telefone, nascimento)
- Endereço completo (CEP, endereço, cidade, estado)
- Contatos alternativos
- Formação acadêmica (escolaridade, instituição)
- Disponibilidade de turnos
- Experiência profissional
- Cursos e certificações extras

## 🚀 Build para Produção

```bash
npm run build
```

O build será gerado na pasta `dist/` pronto para deploy.