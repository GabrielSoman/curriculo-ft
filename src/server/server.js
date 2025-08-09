import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import htmlPdf from 'html-pdf-node';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 80;

// Basic middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// Função para converter dados do N8N para formato interno
function convertN8NData(n8nData) {
  // Se for array, pega o primeiro item
  let data;
  
  if (Array.isArray(n8nData)) {
    data = n8nData[0]?.body || n8nData[0];
  } else if (n8nData?.body) {
    data = n8nData.body;
  } else {
    data = n8nData;
  }
  
  if (!data) {
    throw new Error('Dados não encontrados no formato esperado');
  }

  // Converter formato de data
  let nascimentoFormatado = '';
  if (data.nascimento) {
    try {
      // Verificar se a data contém '/'
      if (data.nascimento.includes('/')) {
        // Converter de DD/MM/YYYY para YYYY-MM-DD
        const [dia, mes, ano] = data.nascimento.split('/');
        if (dia && mes && ano) {
          nascimentoFormatado = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
        }
      } else {
        // Se já estiver no formato YYYY-MM-DD ou outro formato válido
        nascimentoFormatado = data.nascimento;
      }
    } catch (error) {
      console.warn('Erro ao converter data:', error);
      nascimentoFormatado = '';
    }
  }

  return {
    nome: data.nome || '',
    cpf: data.cpf || '',
    rg: data.rg || '',
    telefone: data.telefone || '',
    nascimento: nascimentoFormatado,
    cep: data.cep || '',
    endereco: data.endereco || '',
    cidade: data.cidade || '',
    estado: data.estado || '',
    email: data['e-mail'] || data.email || '',
    telefoneAlternativo: data['contato-alternativo'] || '',
    escolaridade: data.escolaridade || '',
    instituicao: data['escola-faculdade'] || '',
    disponibilidade: data['disponibilidade-turno'] || '',
    experiencia: data.experiencia || data.experiencias || '',
    cursos: data['cursos-extras'] || data.cursos || ''
  };
}

// Endpoint para renderizar HTML do currículo (usado pela API)
app.post('/api/render-html', (req, res) => {
  try {
    console.log('Dados recebidos para renderização:', JSON.stringify(req.body, null, 2));
    
    // Converter dados do N8N para formato interno
    const data = convertN8NData(req.body);
    
    console.log('Dados convertidos:', JSON.stringify(data, null, 2));
    
    // Validação básica
    if (!data.nome) {
      return res.status(400).json({ error: 'Campo "nome" é obrigatório' });
    }

    // Retornar HTML renderizado que será usado pelo frontend
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: system-ui, -apple-system, sans-serif;
            width: 210mm; 
            height: 297mm; 
            font-size: 11px; 
            line-height: 1.5; 
            background: white;
            display: flex;
          }
          .sidebar {
            width: 33.33%; 
            background: linear-gradient(135deg, #1e293b 0%, #0f766e 50%, #0891b2 100%); 
            color: white; 
            padding: 24px; 
            position: relative; 
            overflow: hidden;
          }
          .sidebar::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 128px;
            height: 128px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            transform: translate(-64px, -64px);
          }
          .sidebar::after {
            content: '';
            position: absolute;
            bottom: 0;
            right: 0;
            width: 96px;
            height: 96px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            transform: translate(48px, 48px);
          }
          .profile {
            text-align: center;
            margin-bottom: 24px;
            position: relative;
            z-index: 10;
          }
          .profile-pic {
            width: 96px;
            height: 96px;
            background: linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(255, 255, 255, 0.1));
            border-radius: 50%;
            margin: 0 auto 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(4px);
            border: 2px solid rgba(255, 255, 255, 0.4);
            position: relative;
            overflow: hidden;
          }
          .profile h1 {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 8px;
            letter-spacing: 0.05em;
          }
          .section {
            margin-bottom: 24px;
            position: relative;
            z-index: 10;
          }
          .section h3 {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 12px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.4);
            padding-bottom: 8px;
            letter-spacing: 0.1em;
          }
          .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            background: rgba(255, 255, 255, 0.1);
            padding: 8px;
            border-radius: 8px;
            backdrop-filter: blur(4px);
          }
          .contact-icon {
            margin-right: 12px;
            width: 16px;
          }
          .main-content {
            width: 66.67%;
            padding: 24px;
            background: linear-gradient(135deg, #f9fafb 0%, white 100%);
          }
          .main-section {
            margin-bottom: 24px;
          }
          .main-section h3 {
            font-size: 18px;
            font-weight: bold;
            color: #374151;
            margin-bottom: 12px;
            padding-bottom: 8px;
            position: relative;
          }
          .main-section h3 span {
            color: #0f766e;
            font-weight: 800;
            letter-spacing: 0.05em;
          }
          .main-section h3::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 48px;
            height: 4px;
            background: linear-gradient(90deg, #0f766e, #0891b2);
            border-radius: 2px;
          }
          .content-box {
            background: white;
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border-left: 4px solid #0f766e;
          }
          .content-box.experience {
            border-left-color: #0891b2;
          }
          .content-box.courses {
            border-left-color: #3b82f6;
          }
          .data-box {
            background: rgba(255, 255, 255, 0.1);
            padding: 12px;
            border-radius: 8px;
            backdrop-filter: blur(4px);
          }
          .data-item {
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 8px;
          }
          .data-label {
            color: #a7f3d0;
            font-weight: bold;
          }
          pre {
            white-space: pre-line;
            font-family: inherit;
          }
        </style>
      </head>
      <body>
        <div class="sidebar">
          <div class="profile">
            <div class="profile-pic"></div>
            <h1>${data.nome || 'Seu Nome'}</h1>
          </div>

          ${data.email || data.telefone || data.endereco ? `
          <div class="section">
            <h3>CONTATO</h3>
            ${data.email ? `
            <div class="contact-item">
              <span class="contact-icon">✉</span>
              <span>${data.email}</span>
            </div>
            ` : ''}
            ${data.telefone ? `
            <div class="contact-item">
              <span class="contact-icon">📞</span>
              <span>${data.telefone}</span>
            </div>
            ` : ''}
            ${data.endereco ? `
            <div class="contact-item">
              <span class="contact-icon">📍</span>
              <div>
                <div style="font-weight: 500;">${data.endereco}</div>
                <div>${data.cidade}, ${data.estado}</div>
                <div style="color: rgba(255, 255, 255, 0.7);">${data.cep}</div>
              </div>
            </div>
            ` : ''}
          </div>
          ` : ''}

          ${data.cpf || data.rg || data.nascimento ? `
          <div class="section">
            <h3>DADOS PESSOAIS</h3>
            <div class="data-box">
              ${data.cpf ? `<div class="data-item"><span class="data-label">CPF:</span> ${data.cpf}</div>` : ''}
              ${data.rg ? `<div class="data-item"><span class="data-label">RG:</span> ${data.rg}</div>` : ''}
              ${data.nascimento ? `<div class="data-item"><span class="data-label">Nascimento:</span> ${new Date(data.nascimento).toLocaleDateString('pt-BR')}</div>` : ''}
            </div>
          </div>
          ` : ''}

          <div class="section">
            <h3>DISPONIBILIDADE</h3>
            <div class="data-box">
              <div style="color: rgba(255, 255, 255, 0.9); font-weight: 500;">${data.disponibilidade || 'Não informado'}</div>
            </div>
          </div>
        </div>

        <div class="main-content">
          ${data.escolaridade ? `
          <div class="main-section">
            <h3><span>EDUCAÇÃO</span></h3>
            <div class="content-box">
              <div style="font-weight: bold; color: #374151; font-size: 14px;">${data.escolaridade}</div>
              ${data.instituicao ? `<div style="color: #6b7280; margin-top: 4px; font-weight: 500;">${data.instituicao}</div>` : ''}
            </div>
          </div>
          ` : ''}

          ${data.experiencia ? `
          <div class="main-section">
            <h3><span>EXPERIÊNCIA PROFISSIONAL</span></h3>
            <div class="content-box experience">
              <pre style="font-size: 14px; color: #374151; line-height: 1.6;">${data.experiencia}</pre>
            </div>
          </div>
          ` : ''}

          ${data.cursos ? `
          <div class="main-section">
            <h3><span>CURSOS E CERTIFICAÇÕES</span></h3>
            <div class="content-box courses">
              <pre style="font-size: 14px; color: #374151; line-height: 1.6;">${data.cursos}</pre>
            </div>
          </div>
          ` : ''}
        </div>
      </body>
      </html>
    `;

    res.json({ 
      html,
      data,
      fileName: `Curriculo_${data.nome.replace(/\s+/g, '_')}.pdf`
    });

  } catch (error) {
    console.error('Erro ao renderizar HTML:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Endpoint para gerar PDF via POST (agora usa o motor unificado)
app.post('/api/generate-pdf', async (req, res) => {
  try {
    console.log('Dados recebidos para PDF:', JSON.stringify(req.body, null, 2));
    
    // Converter dados do N8N para formato interno
    const data = convertN8NData(req.body);
    
    console.log('Dados convertidos para PDF:', JSON.stringify(data, null, 2));
    
    // Validação básica
    if (!data.nome) {
      return res.status(400).json({ error: 'Campo "nome" é obrigatório' });
    }

    // Gerar HTML do currículo
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: system-ui, -apple-system, sans-serif;
            width: 210mm; 
            height: 297mm; 
            font-size: 11px; 
            line-height: 1.5; 
            background: white;
            display: flex;
          }
          .sidebar {
            width: 33.33%; 
            background: linear-gradient(135deg, #1e293b 0%, #0f766e 50%, #0891b2 100%); 
            color: white; 
            padding: 24px; 
            position: relative; 
            overflow: hidden;
          }
          .profile {
            text-align: center;
            margin-bottom: 24px;
            position: relative;
            z-index: 10;
          }
          .profile h1 {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 8px;
            letter-spacing: 0.05em;
          }
          .section {
            margin-bottom: 24px;
            position: relative;
            z-index: 10;
          }
          .section h3 {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 12px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.4);
            padding-bottom: 8px;
            letter-spacing: 0.1em;
          }
          .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            background: rgba(255, 255, 255, 0.1);
            padding: 8px;
            border-radius: 8px;
          }
          .main-content {
            width: 66.67%;
            padding: 24px;
            background: linear-gradient(135deg, #f9fafb 0%, white 100%);
          }
          .main-section {
            margin-bottom: 24px;
          }
          .main-section h3 {
            font-size: 18px;
            font-weight: bold;
            color: #0f766e;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 3px solid #0f766e;
          }
          .content-box {
            background: white;
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border-left: 4px solid #0f766e;
          }
          pre {
            white-space: pre-line;
            font-family: inherit;
          }
        </style>
      </head>
      <body>
        <div class="sidebar">
          <div class="profile">
            <h1>${data.nome || 'Seu Nome'}</h1>
          </div>

          ${data.email || data.telefone || data.endereco ? `
          <div class="section">
            <h3>CONTATO</h3>
            ${data.email ? `<div class="contact-item">✉ ${data.email}</div>` : ''}
            ${data.telefone ? `<div class="contact-item">📞 ${data.telefone}</div>` : ''}
            ${data.endereco ? `<div class="contact-item">📍 ${data.endereco}, ${data.cidade}, ${data.estado}</div>` : ''}
          </div>
          ` : ''}

          ${data.disponibilidade ? `
          <div class="section">
            <h3>DISPONIBILIDADE</h3>
            <div style="background: rgba(255, 255, 255, 0.1); padding: 12px; border-radius: 8px;">
              ${data.disponibilidade}
            </div>
          </div>
          ` : ''}
        </div>

        <div class="main-content">
          ${data.escolaridade ? `
          <div class="main-section">
            <h3>EDUCAÇÃO</h3>
            <div class="content-box">
              <div style="font-weight: bold;">${data.escolaridade}</div>
              ${data.instituicao ? `<div style="color: #666; margin-top: 4px;">${data.instituicao}</div>` : ''}
            </div>
          </div>
          ` : ''}

          ${data.experiencia ? `
          <div class="main-section">
            <h3>EXPERIÊNCIA PROFISSIONAL</h3>
            <div class="content-box">
              <pre>${data.experiencia}</pre>
            </div>
          </div>
          ` : ''}

          ${data.cursos ? `
          <div class="main-section">
            <h3>CURSOS E CERTIFICAÇÕES</h3>
            <div class="content-box">
              <pre>${data.cursos}</pre>
            </div>
          </div>
          ` : ''}
        </div>
      </body>
      </html>
    `;

    // Configurações do PDF
    const options = { 
      format: 'A4',
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      printBackground: true
    };

    try {
      // Gerar PDF real
      const file = { content: html };
      const options = { 
        format: 'A4',
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
        printBackground: true
      };
      const pdfBuffer = await htmlPdf.generatePdf(file, options);
      const pdfBase64 = pdfBuffer.toString('base64');
      
      res.json({
        pdf: pdfBase64,
        message: 'PDF gerado com sucesso',
        size: pdfBuffer.length
      });
      
    } catch (pdfError) {
      console.error('❌ Erro ao gerar PDF:', pdfError);
      res.status(500).json({ 
        error: 'Erro ao gerar PDF', 
        details: pdfError.message 
      });
    }

  } catch (error) {
    console.error('Erro ao processar dados para PDF:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Endpoint de teste para verificar conversão
app.post('/api/test-conversion', (req, res) => {
  try {
    console.log('Dados recebidos para teste:', JSON.stringify(req.body, null, 2));
    const convertedData = convertN8NData(req.body);
    console.log('Dados convertidos:', JSON.stringify(convertedData, null, 2));
    res.json({
      original: req.body,
      converted: convertedData
    });
  } catch (error) {
    console.error('Erro na conversão:', error);
    res.status(400).json({ error: error.message });
  }
});

// Endpoint de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    engine: 'html2canvas + jsPDF'
  });
});

// Endpoint para verificar se o build existe
app.get('/api/status', (req, res) => {
  const distPath = path.join(__dirname, '../../dist');
  const buildExists = fs.existsSync(distPath);
  
  res.json({
    buildExists,
    distPath,
    files: buildExists ? fs.readdirSync(distPath) : [],
    engine: 'html2canvas + jsPDF unified'
  });
});

// Static files middleware (after API routes)
app.use(express.static(path.join(__dirname, '../../dist')));

// Servir arquivos estáticos do React
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../../dist/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Build não encontrado. Execute npm run build primeiro.' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📄 Interface: http://localhost:${PORT}`);
  console.log(`🔗 API: POST http://localhost:${PORT}/api/generate-pdf`);
  console.log(`🧪 Teste: POST http://localhost:${PORT}/api/test-conversion`);
  console.log(`⚙️  Motor: html2canvas + jsPDF unificado`);
});