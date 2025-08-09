import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';

const app = express();
const PORT = process.env.PORT || 80;

// Basic middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// Log middleware para debug
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

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
      if (data.nascimento.includes('/')) {
        const [dia, mes, ano] = data.nascimento.split('/');
        if (dia && mes && ano) {
          nascimentoFormatado = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
        }
      } else {
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
    telefoneAlternativo: data['contato-alternativo'] || data.telefoneAlternativo || '',
    escolaridade: data.escolaridade || '',
    instituicao: data['escola-faculdade'] || data.instituicao || '',
    disponibilidade: data['disponibilidade-turno'] || data.disponibilidade || '',
    experiencia: data.experiencia || data.experiencias || '',
    cursos: data['cursos-extras'] || data.cursos || ''
  };
}

// Função para gerar HTML do currículo
function generateCurriculumHTML(data) {
  // Escapar caracteres especiais HTML
  const escapeHtml = (text) => {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            width: 210mm; 
            height: 297mm; 
            font-size: 12px; 
            line-height: 1.6; 
            background: white;
            display: flex;
            color: #333;
            margin: 0;
            padding: 0;
        }
        
        .sidebar {
            width: 35%; 
            background: linear-gradient(135deg, #1e3a8a 0%, #0f766e 50%, #0891b2 100%); 
            color: white; 
            padding: 30px 25px;
            position: relative; 
            overflow: hidden;
        }
        
        .sidebar::before {
            content: '';
            position: absolute;
            top: -50px;
            left: -50px;
            width: 150px;
            height: 150px;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 50%;
        }
        
        .sidebar::after {
            content: '';
            position: absolute;
            bottom: -40px;
            right: -40px;
            width: 120px;
            height: 120px;
            background: rgba(255, 255, 255, 0.06);
            border-radius: 50%;
        }
        
        .profile {
            text-align: center;
            margin-bottom: 30px;
            position: relative;
            z-index: 10;
        }
        
        .profile-pic {
            width: 100px;
            height: 100px;
            background: linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(255, 255, 255, 0.2));
            border-radius: 50%;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid rgba(255, 255, 255, 0.3);
            position: relative;
            overflow: hidden;
        }
        
        .profile-pic::before {
            content: '';
            position: absolute;
            width: 60%;
            height: 60%;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 50%;
        }
        
        .profile h1 {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .section {
            margin-bottom: 25px;
            position: relative;
            z-index: 10;
        }
        
        .section h3 {
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 15px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.3);
            padding-bottom: 8px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        
        .contact-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12px;
            background: rgba(255, 255, 255, 0.1);
            padding: 10px;
            border-radius: 8px;
            border-left: 3px solid rgba(255, 255, 255, 0.4);
        }
        
        .contact-icon {
            margin-right: 12px;
            width: 18px;
            font-size: 16px;
            text-align: center;
            opacity: 0.9;
        }
        
        .main-content {
            width: 65%;
            padding: 30px;
            background: linear-gradient(135deg, #fafafa 0%, white 100%);
        }
        
        .main-section {
            margin-bottom: 30px;
        }
        
        .main-section h3 {
            font-size: 18px;
            font-weight: 700;
            color: #1e3a8a;
            margin-bottom: 15px;
            padding-bottom: 10px;
            position: relative;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .main-section h3::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 60px;
            height: 3px;
            background: linear-gradient(90deg, #1e3a8a, #0891b2);
            border-radius: 2px;
        }
        
        .content-box {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            border-left: 4px solid #1e3a8a;
            position: relative;
        }
        
        .content-box.education {
            border-left-color: #0f766e;
        }
        
        .content-box.experience {
            border-left-color: #0891b2;
        }
        
        .content-box.courses {
            border-left-color: #3b82f6;
        }
        
        .education-title {
            font-weight: 700;
            color: #1e3a8a;
            font-size: 16px;
            margin-bottom: 5px;
        }
        
        .education-institution {
            color: #666;
            font-style: italic;
            font-size: 14px;
        }
        
        .data-box {
            background: rgba(255, 255, 255, 0.15);
            padding: 15px;
            border-radius: 8px;
            border-left: 3px solid rgba(255, 255, 255, 0.4);
        }
        
        .data-item {
            color: rgba(255, 255, 255, 0.95);
            margin-bottom: 8px;
            font-size: 13px;
        }
        
        .data-label {
            color: #bfdbfe;
            font-weight: 600;
        }
        
        .availability-box {
            background: rgba(255, 255, 255, 0.15);
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            border-left: 3px solid rgba(255, 255, 255, 0.4);
        }
        
        .availability-text {
            color: rgba(255, 255, 255, 0.95);
            font-weight: 600;
            font-size: 14px;
        }
        
        pre {
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: inherit;
            font-size: 14px;
            line-height: 1.7;
            color: #444;
            margin: 0;
        }

        .experience-text {
            color: #444;
            line-height: 1.8;
            font-size: 14px;
        }

        .courses-text {
            color: #444;
            line-height: 1.8;
            font-size: 14px;
        }
        
        @page {
            size: A4;
            margin: 0;
        }
    </style>
</head>
<body>
    <div class="sidebar">
        <div class="profile">
            <div class="profile-pic"></div>
            <h1>${escapeHtml(data.nome || 'Seu Nome')}</h1>
        </div>

        ${data.email || data.telefone || data.endereco ? `
        <div class="section">
            <h3>Contato</h3>
            ${data.email ? `
            <div class="contact-item">
                <span class="contact-icon">✉</span>
                <span>${escapeHtml(data.email)}</span>
            </div>
            ` : ''}
            ${data.telefone ? `
            <div class="contact-item">
                <span class="contact-icon">📞</span>
                <span>${escapeHtml(data.telefone)}</span>
            </div>
            ` : ''}
            ${data.telefoneAlternativo ? `
            <div class="contact-item">
                <span class="contact-icon">📱</span>
                <span>${escapeHtml(data.telefoneAlternativo)}</span>
            </div>
            ` : ''}
            ${data.endereco ? `
            <div class="contact-item">
                <span class="contact-icon">📍</span>
                <div>
                    <div style="font-weight: 600;">${escapeHtml(data.endereco)}</div>
                    ${data.cidade && data.estado ? `<div>${escapeHtml(data.cidade)}, ${escapeHtml(data.estado)}</div>` : ''}
                    ${data.cep ? `<div style="opacity: 0.8; font-size: 11px;">${escapeHtml(data.cep)}</div>` : ''}
                </div>
            </div>
            ` : ''}
        </div>
        ` : ''}

        ${data.cpf || data.rg || data.nascimento ? `
        <div class="section">
            <h3>Dados Pessoais</h3>
            <div class="data-box">
                ${data.cpf ? `<div class="data-item"><span class="data-label">CPF:</span> ${escapeHtml(data.cpf)}</div>` : ''}
                ${data.rg ? `<div class="data-item"><span class="data-label">RG:</span> ${escapeHtml(data.rg)}</div>` : ''}
                ${data.nascimento ? `<div class="data-item"><span class="data-label">Nascimento:</span> ${new Date(data.nascimento).toLocaleDateString('pt-BR')}</div>` : ''}
            </div>
        </div>
        ` : ''}

        <div class="section">
            <h3>Disponibilidade</h3>
            <div class="availability-box">
                <div class="availability-text">${escapeHtml(data.disponibilidade || 'A combinar')}</div>
            </div>
        </div>
    </div>

    <div class="main-content">
        ${data.escolaridade ? `
        <div class="main-section">
            <h3>Educação</h3>
            <div class="content-box education">
                <div class="education-title">${escapeHtml(data.escolaridade)}</div>
                ${data.instituicao ? `<div class="education-institution">${escapeHtml(data.instituicao)}</div>` : ''}
            </div>
        </div>
        ` : ''}

        ${data.experiencia ? `
        <div class="main-section">
            <h3>Experiência Profissional</h3>
            <div class="content-box experience">
                <div class="experience-text">
                    <pre>${escapeHtml(data.experiencia)}</pre>
                </div>
            </div>
        </div>
        ` : ''}

        ${data.cursos ? `
        <div class="main-section">
            <h3>Cursos e Certificações</h3>
            <div class="content-box courses">
                <div class="courses-text">
                    <pre>${escapeHtml(data.cursos)}</pre>
                </div>
            </div>
        </div>
        ` : ''}
    </div>
</body>
</html>
  `;
}

// Configuração do Puppeteer para produção
async function createBrowser() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const browserOptions = {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--single-process'
    ],
    ignoreDefaultArgs: ['--disable-extensions']
  };

  if (isProduction) {
    browserOptions.executablePath = '/usr/bin/chromium-browser';
  }

  console.log('🔧 Configurações do browser:', {
    isProduction,
    executablePath: browserOptions.executablePath || 'default'
  });

  try {
    const browser = await puppeteer.launch(browserOptions);
    console.log('✅ Browser criado com sucesso');
    return browser;
  } catch (error) {
    console.error('❌ Erro ao criar browser:', error.message);
    throw error;
  }
}

// Endpoint principal para gerar PDF
app.post('/api/generate-pdf', async (req, res) => {
  let browser = null;
  let page = null;
  
  try {
    console.log('📥 Dados recebidos para PDF:', JSON.stringify(req.body, null, 2));
    
    // Converter dados do N8N para formato interno
    const data = convertN8NData(req.body);
    console.log('🔄 Dados convertidos:', JSON.stringify(data, null, 2));
    
    // Validação básica
    if (!data.nome) {
      return res.status(400).json({ 
        error: 'Campo "nome" é obrigatório',
        received: data 
      });
    }

    console.log('🚀 Iniciando geração do PDF...');
    
    // Criar browser
    browser = await createBrowser();
    page = await browser.newPage();
    console.log('✅ Página criada');
    
    // Configurar viewport para A4
    await page.setViewport({ 
      width: 794,  // ~210mm em 96dpi
      height: 1123, // ~297mm em 96dpi
      deviceScaleFactor: 2 
    });
    
    // Configurar timeouts
    page.setDefaultTimeout(60000);
    page.setDefaultNavigationTimeout(60000);
    
    // Gerar HTML
    const html = generateCurriculumHTML(data);
    console.log('✅ HTML gerado (tamanho:', html.length, 'caracteres)');
    
    // Definir conteúdo
    await page.setContent(html, { 
      waitUntil: ['networkidle0', 'load', 'domcontentloaded'],
      timeout: 60000 
    });
    console.log('✅ Conteúdo definido na página');
    
    // Aguardar renderização completa
    await page.evaluateHandle('document.fonts.ready');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('✅ Aguardou renderização');
    
    // Gerar PDF com configurações corretas
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm'
      },
      displayHeaderFooter: false,
      scale: 1,
      timeout: 60000
    });
    
    console.log('✅ PDF gerado, tamanho:', pdfBuffer.length, 'bytes');
    
    // Verificar se é um PDF válido
    const pdfHeader = pdfBuffer.toString('ascii', 0, 5);
    if (!pdfHeader.startsWith('%PDF')) {
      throw new Error('Buffer gerado não é um PDF válido');
    }
    console.log('✅ PDF validado (header:', pdfHeader, ')');
    
    // Fechar página e browser
    if (page) await page.close();
    if (browser) await browser.close();
    
    // Converter para base64
    const pdfBase64 = pdfBuffer.toString('base64');
    
    // Verificar conversão base64
    if (!pdfBase64 || pdfBase64.length === 0) {
      throw new Error('Erro ao converter PDF para base64');
    }
    
    console.log('✅ PDF convertido para base64:', {
      originalSize: pdfBuffer.length,
      base64Length: pdfBase64.length,
      ratio: (pdfBase64.length / pdfBuffer.length).toFixed(2)
    });
    
    // Resposta para N8N
    const fileName = `Curriculo_${data.nome.replace(/\s+/g, '_')}.pdf`;
    
    res.json({
      success: true,
      pdf: pdfBase64,
      filename: fileName,
      size: pdfBuffer.length,
      message: 'PDF gerado com sucesso'
    });
    
    console.log('✅ Resposta enviada com sucesso');

  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error);
    console.error('Stack:', error.stack);
    
    // Limpar recursos
    if (page) {
      try {
        await page.close();
      } catch (e) {
        console.error('Erro ao fechar página:', e);
      }
    }
    
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        console.error('Erro ao fechar browser:', e);
      }
    }
    
    res.status(500).json({ 
      error: 'Erro ao gerar PDF', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Endpoint para download direto do PDF
app.post('/api/download-pdf', async (req, res) => {
  let browser = null;
  let page = null;
  
  try {
    console.log('📥 Dados recebidos para download PDF');
    
    const data = convertN8NData(req.body);
    
    if (!data.nome) {
      return res.status(400).json({ 
        error: 'Campo "nome" é obrigatório'
      });
    }

    browser = await createBrowser();
    page = await browser.newPage();
    
    await page.setViewport({ 
      width: 794,
      height: 1123,
      deviceScaleFactor: 2 
    });
    
    const html = generateCurriculumHTML(data);
    
    await page.setContent(html, { 
      waitUntil: ['networkidle0', 'load', 'domcontentloaded']
    });
    
    await page.evaluateHandle('document.fonts.ready');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });
    
    if (page) await page.close();
    if (browser) await browser.close();
    
    const fileName = `Curriculo_${data.nome.replace(/\s+/g, '_')}.pdf`;
    
    // Headers para download direto
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Enviar o buffer diretamente
    res.end(pdfBuffer);
    
    console.log('✅ PDF enviado como download');

  } catch (error) {
    console.error('❌ Erro:', error);
    
    if (page) await page.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
    
    res.status(500).json({ 
      error: 'Erro ao gerar PDF', 
      details: error.message
    });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    engine: 'puppeteer'
  });
});

// Teste de conversão
app.post('/api/test-conversion', (req, res) => {
  try {
    const convertedData = convertN8NData(req.body);
    res.json({
      success: true,
      original: req.body,
      converted: convertedData
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Status
app.get('/api/status', (req, res) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distPath = path.join(__dirname, '../../dist');
  
  res.json({
    buildExists: fs.existsSync(distPath),
    engine: 'puppeteer',
    node_env: process.env.NODE_ENV,
    port: PORT
  });
});

// Servir arquivos estáticos
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../../dist')));

// Fallback para SPA
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../../dist/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ 
      error: 'Build não encontrado. Execute npm run build primeiro.'
    });
  }
});

// Tratamento de erros global
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📄 Interface: http://localhost:${PORT}`);
  console.log(`🔗 API: POST http://localhost:${PORT}/api/generate-pdf`);
  console.log(`📥 Download: POST http://localhost:${PORT}/api/download-pdf`);
  console.log(`🧪 Teste: POST http://localhost:${PORT}/api/test-conversion`);
  console.log(`⚡ Health: GET http://localhost:${PORT}/api/health`);
  console.log(`🎯 Motor: Puppeteer + Chromium`);
  console.log(`🐳 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
