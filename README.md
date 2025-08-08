# 📄 Gerador de Currículos Automático

Sistema completo para geração automática de currículos profissionais com API REST e interface web.

## 🚀 Funcionalidades

- **API REST** para geração de currículos em PDF
- **Interface web** responsiva para preenchimento de dados
- **Visualização em tempo real** do currículo
- **Download automático** de PDF profissional
- **Design moderno** baseado em templates profissionais

## 📊 API Endpoints

### POST `/api/gerar-curriculo`
Gera um currículo em formato PDF.

**Exemplo de requisição:**
```json
{
  "nome": "João Silva",
  "cpf": "123.456.789-00",
  "rg": "1234567",
  "telefone": "+5551999999999",
  "nascimento": "03/09/1995",
  "cep": "91520-702",
  "endereco": "Rua das Flores, 123",
  "cidade": "Porto Alegre",
  "estado": "Rio Grande do Sul",
  "contato-alternativo": "5199123456789",
  "escolaridade": "Ensino Médio Completo",
  "escola-faculdade": "Instituto Federal do RS",
  "disponibilidade-turno": "Tarde, Noite",
  "experiencia": "Desenvolvedor júnior com 2 anos de experiência...",
  "cursos-extras": "JavaScript, React, Node.js"
}
```

**Resposta:** Arquivo PDF para download

### POST `/api/visualizar-curriculo`
Gera uma prévia do currículo em HTML.

**Resposta:** HTML renderizado do currículo

## 🛠️ Instalação e Uso

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Execute o servidor:**
   ```bash
   npm start
   ```

3. **Acesse a aplicação:**
   - Interface Web: `http://localhost:80`
   - API: `http://localhost:80/api/`

## 🎨 Recursos do Design

- Layout profissional com sidebar lateral
- Cores modernas e gradientes elegantes
- Tipografia otimizada para legibilidade
- Responsivo para todos os dispositivos
- Seções organizadas: Contato, Educação, Experiência, Competências

## 🔧 Tecnologias

- **Backend:** Node.js + Express
- **PDF Generation:** Puppeteer
- **Frontend:** HTML5 + CSS3 + JavaScript
- **Design:** CSS Grid + Flexbox + Gradients

## 📝 Estrutura de Dados Suportada

O sistema processa os seguintes campos:
- Dados pessoais (nome, CPF, RG, telefone, nascimento)
- Endereço completo (CEP, endereço, cidade, estado)
- Contatos alternativos
- Formação acadêmica (escolaridade, instituição)
- Disponibilidade de turnos
- Experiência profissional
- Cursos e certificações extras

## 🚀 Deploy

O servidor está configurado para rodar na **porta 80** e aceita conexões de qualquer IP (`0.0.0.0`), facilitando o deploy em servidores de produção.