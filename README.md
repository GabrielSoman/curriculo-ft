# 📄 Gerador de Currículos Automático

Sistema completo para geração automática de currículos profissionais com interface web moderna.

## 🚀 Funcionalidades

- **Interface web responsiva** para preenchimento de dados
- **Visualização em tempo real** do currículo
- **Download automático** de PDF profissional
- **Design moderno** baseado em templates profissionais
- **Tecnologia React + TypeScript**

## 🛠️ Instalação e Uso

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