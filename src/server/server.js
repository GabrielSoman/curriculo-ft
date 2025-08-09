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
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
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
            white-space: pre-line;
            font-family: inherit;
            font-size: 14px;
            line-height: 1.7;
            color: #444;
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
            <h3>Contato</h3>
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
            ${data.telefoneAlternativo ? `
            <div class="contact-item">
                <span class="contact-icon">📱</span>
                <span>${data.telefoneAlternativo}</span>
            </div>
            ` : ''}
            ${data.endereco ? `
            <div class="contact-item">
                <span class="contact-icon">📍</span>
                <div>
                    <div style="font-weight: 600;">${data.endereco}</div>
                    ${data.cidade && data.estado ? `<div>${data.cidade}, ${data.estado}</div>` : ''}
                    ${data.cep ? `<div style="opacity: 0.8; font-size: 11px;">${data.cep}</div>` : ''}
                </div>
            </div>
            ` : ''}
        </div>
        ` : ''}

        ${data.cpf || data.rg || data.nascimento ? `
        <div class="section">
            <h3>Dados Pessoais</h3>
            <div class="data-box">
                ${data.cpf ? `<div class="data-item"><span class="data-label">CPF:</span> ${data.cpf}</div>` : ''}
                ${data.rg ? `<div class="data-item"><span class="data-label">RG:</span> ${data.rg}</div>` : ''}
                ${data.nascimento ? `<div class="data-item"><span class="data-label">Nascimento:</span> ${new Date(data.nascimento).toLocaleDateString('pt-BR')}</div>` : ''}
            </div>
        </div>
        ` : ''}

        <div class="section">
            <h3>Disponibilidade</h3>
            <div class="availability-box">
                <div class="availability-text">${data.disponibilidade || 'A combinar'}</div>
            </div>
        </div>
    </div>

    <div class="main-content">
        ${data.escolaridade ? `
        <div class="main-section">
            <h3>Educação</h3>
            <div class="content-box education">
                <div class="education-title">${data.escolaridade}</div>
                ${data.instituicao ? `<div class="education-institution">${data.instituicao}</div>` : ''}
            </div>
        </div>
        ` : ''}

        ${data.experiencia ? `
        <div class="main-section">
            <h3>Experiência Profissional</h3>
            <div class="content-box experience">
                <div class="experience-text">
                    <pre>${data.experiencia}</pre>
                </div>
            </div>
        </div>
        ` : ''}

        ${data.cursos ? `
        <div class="main-section">
            <h3>Cursos e Certificações</h3>
            <div class="content-box courses">
                <div class="courses-text">
                    <pre>${data.cursos}</pre>
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
    headless: 'new',
    timeout: 60000,
    protocolTimeout: 240000,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-gpu-sandbox',
      '--disable-software-rasterizer',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      '--disable-backgrounding-occluded-windows',
      '--disable-features=TranslateUI,VizDisplayCompositor',
      '--disable-extensions',
      '--disable-component-extensions-with-background-pages',
      '--disable-default-apps',
      '--mute-audio',
      '--no-default-browser-check',
      '--disable-background-networking',
      '--disable-sync',
      '--disable-translate',
      '--hide-scrollbars',
      '--disable-web-security',
      '--disable-features=site-per-process',
      '--flag-switches-begin',
      '--disable-ipc-flooding-protection',
      '--flag-switches-end',
      '--single-process',
      '--memory-pressure-off',
      '--max_old_space_size=4096'
    ],
    ignoreDefaultArgs: ['--disable-extensions']
  };

  if (isProduction) {
    browserOptions.executablePath = '/usr/bin/chromium-browser';
  }

  console.log('🔧 Configurações do browser:', {
    isProduction,
    executablePath: browserOptions.executablePath || 'default',
    argsCount: browserOptions.args.length
  });

  try {
    const browser = await puppeteer.launch(browserOptions);
    console.log('✅ Browser criado com sucesso');
    return browser;
  } catch (error) {
    console.error('❌ Erro ao criar browser:', error.message);
    
    // Tentar configuração de fallback
    console.log('🔄 Tentando configuração de fallback...');
    const fallbackOptions = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process'
      ]
    };
    
    if (isProduction) {
      fallbackOptions.executablePath = '/usr/bin/chromium-browser';
    }
    
    return await puppeteer.launch(fallbackOptions);
  }
}

// Endpoint principal para gerar PDF
app.post('/api/generate-pdf', async (req, res) => {
  let browser = null;
  
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
    
    // Criar navegador com retry
    let pdfBuffer = null;
    let page = null;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts && !browser) {
      attempts++;
      try {
        console.log(`🔄 Tentativa ${attempts}/${maxAttempts} de criar browser...`);
        browser = await createBrowser();
        break;
      } catch (error) {
        console.error(`❌ Tentativa ${attempts} falhou:`, error.message);
        if (attempts === maxAttempts) {
          throw new Error(`Falha ao criar browser após ${maxAttempts} tentativas: ${error.message}`);
        }
        // Aguardar antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    try {
      page = await browser.newPage();
      console.log('✅ Página criada');
      
      // Configurar viewport
      await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
      
      // Configurar timeouts
      page.setDefaultTimeout(30000);
      page.setDefaultNavigationTimeout(30000);
      
      // Gerar HTML
      const html = generateCurriculumHTML(data);
      console.log('✅ HTML gerado');
      
      // Definir conteúdo com timeout
      await page.setContent(html, { 
        waitUntil: ['networkidle0', 'domcontentloaded'],
        timeout: 30000 
      });
      console.log('✅ Conteúdo definido na página');
      
      // Aguardar renderização
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log('✅ Aguardou renderização');
      
      // Gerar PDF
      pdfBuffer = await page.pdf({
        format: 'A4',
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        printBackground: true,
        preferCSSPageSize: true,
        timeout: 30000
      });
      
      console.log('✅ PDF gerado, tamanho:', pdfBuffer.length, 'bytes');
      
      // Fechar página primeiro
      await page.close();
      page = null;
      
    } catch (pageError) {
      console.error('❌ Erro na página:', pageError.message);
      if (page) {
        try {
          await page.close();
        } catch (closeError) {
          console.error('❌ Erro ao fechar página:', closeError.message);
        }
      }
      throw pageError;
    }
    
    // Fechar browser
    await browser.close();
    browser = null;
    
    // Verificar se PDF foi gerado
    if (!pdfBuffer) {
      throw new Error('PDF não foi gerado');
    }
    
    // Converter para base64
    const pdfBase64 = pdfBuffer.toString('base64');
    
    // Resposta para N8N
    const fileName = `Curriculo_${data.nome.replace(/\s+/g, '_')}.pdf`;
    
    res.json({
      success: true,
      pdf: pdfBase64,
      filename: fileName,
      size: pdfBuffer.length,
      message: 'PDF gerado com sucesso'
    });
    
    console.log('✅ Resposta enviada para N8N');

  } catch (error) {
    console.error('❌ Erro ao gerar PDF:', error);
    
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('❌ Erro ao fechar browser:', closeError);
      }
    }
    
    res.status(500).json({ 
      error: 'Erro ao gerar PDF', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Endpoint de health check mais robusto
app.get('/api/health', async (req, res) => {
  try {
    // Testar se o Puppeteer consegue criar um browser
    const healthBrowser = await createBrowser();
    await healthBrowser.close();
    
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      engine: 'puppeteer + chromium',
      puppeteer: 'working'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      engine: 'puppeteer + chromium',
      puppeteer: 'failed',
      error: error.message
    });
  }
});

// Endpoint para teste de conversão
app.post('/api/test-conversion', (req, res) => {
  try {
    console.log('🧪 Dados recebidos para teste:', JSON.stringify(req.body, null, 2));
    const convertedData = convertN8NData(req.body);
    console.log('🔄 Dados convertidos:', JSON.stringify(convertedData, null, 2));
    res.json({
      success: true,
      original: req.body,
      converted: convertedData
    });
  } catch (error) {
    console.error('❌ Erro na conversão:', error);
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Endpoint de status
app.get('/api/status', (req, res) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distPath = path.join(__dirname, '../../dist');
  const buildExists = fs.existsSync(distPath);
  
  res.json({
    buildExists,
    distPath,
    files: buildExists ? fs.readdirSync(distPath) : [],
    engine: 'puppeteer + chromium unified',
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
      error: 'Build não encontrado. Execute npm run build primeiro.',
      path: indexPath
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📄 Interface: http://localhost:${PORT}`);
  console.log(`🔗 API: POST http://localhost:${PORT}/api/generate-pdf`);
  console.log(`🧪 Teste: POST http://localhost:${PORT}/api/test-conversion`);
  console.log(`⚡ Health: GET http://localhost:${PORT}/api/health`);
  console.log(`🎯 Motor: Puppeteer + Chromium`);
  console.log(`🐳 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
