import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';

const app = express();
const PORT = process.env.PORT || 80;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

// Converter dados do N8N
function convertN8NData(n8nData) {
  let data;
  
  if (Array.isArray(n8nData)) {
    data = n8nData[0]?.body || n8nData[0];
  } else if (n8nData?.body) {
    data = n8nData.body;
  } else {
    data = n8nData;
  }
  
  if (!data) {
    throw new Error('Dados não encontrados');
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

// Criar browser Puppeteer
async function createBrowser() {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const browserOptions = {
    headless: true,
    timeout: 60000,
    protocolTimeout: 60000,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      '--disable-backgrounding-occluded-windows',
      '--disable-features=TranslateUI',
      '--disable-extensions',
      '--disable-component-extensions-with-background-pages',
      '--no-first-run',
      '--no-zygote',
      '--disable-accelerated-2d-canvas',
      '--disable-ipc-flooding-protection',
      '--disable-hang-monitor',
      '--disable-client-side-phishing-detection',
      '--disable-popup-blocking',
      '--disable-prompt-on-repost',
      '--disable-sync',
      '--disable-translate',
      '--disable-default-apps',
      '--disable-background-networking',
      '--disable-background-downloads',
      '--disable-add-to-shelf',
      '--disable-breakpad',
      '--disable-component-update',
      '--disable-domain-reliability',
      '--disable-features=AudioServiceOutOfProcess',
      '--disable-print-preview',
      '--disable-speech-api',
      '--hide-scrollbars',
      '--mute-audio',
      '--no-default-browser-check',
      '--no-pings',
      '--use-mock-keychain',
      '--disable-dev-shm-usage',
      '--memory-pressure-off',
      '--max_old_space_size=4096'
    ]
  };

  if (isProduction) {
    const possiblePaths = [
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/usr/bin/google-chrome'
    ];
    
    for (const path of possiblePaths) {
      if (fs.existsSync(path)) {
        browserOptions.executablePath = path;
        console.log(`🔧 Usando Chromium: ${path}`);
        break;
      }
    }
    
    if (!browserOptions.executablePath) {
      console.error('❌ Chromium não encontrado nos caminhos padrão');
      throw new Error('Chromium não encontrado');
    }
  }

  console.log('🚀 Iniciando browser com opções:', {
    headless: browserOptions.headless,
    executablePath: browserOptions.executablePath || 'default',
    argsCount: browserOptions.args.length
  });

  let browser;
  let retries = 3;
  
  while (retries > 0) {
    try {
      browser = await puppeteer.launch(browserOptions);
      console.log('✅ Browser iniciado com sucesso');
      return browser;
    } catch (error) {
      retries--;
      console.error(`❌ Tentativa falhou (${3 - retries}/3):`, error.message);
      
      if (retries === 0) {
        throw error;
      }
      
      // Aguardar antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

// ENDPOINT PRINCIPAL - RETORNA PDF DIRETAMENTE PARA N8N
app.post('/api/generate-pdf', async (req, res) => {
  let browser = null;
  let page = null;
  
  try {
    console.log('📥 Dados recebidos via API N8N');
    
    const data = convertN8NData(req.body);
    
    if (!data.nome) {
      return res.status(400).json({ 
        error: 'Campo "nome" é obrigatório' 
      });
    }

    console.log('🚀 Iniciando geração de PDF...');
    
    // Criar browser
    console.log('🔧 Criando browser Puppeteer...');
    browser = await createBrowser();
    console.log('✅ Browser criado com sucesso');
    
    page = await browser.newPage();
    console.log('✅ Nova página criada');
    
    // Configurar viewport para A4
    await page.setViewport({ width: 1200, height: 1600 });
    console.log('✅ Viewport configurado');
    
    // Criar HTML completo com o currículo
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Currículo - ${data.nome}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .curriculum-container {
            width: 210mm;
            height: 297mm;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        @media print {
            .curriculum-container {
                box-shadow: none;
                margin: 0;
            }
        }
    </style>
</head>
<body class="bg-gray-100 p-4">
    <div class="curriculum-container">
        <div class="flex h-full">
            <!-- Sidebar -->
            <div class="w-1/3 bg-gradient-to-br from-slate-800 via-teal-800 to-cyan-800 text-white p-6 relative overflow-hidden">
                <!-- Background Pattern -->
                <div class="absolute inset-0 opacity-10">
                    <div class="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
                    <div class="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
                </div>
                
                <div class="text-center mb-6">
                    <div class="w-24 h-24 bg-gradient-to-br from-yellow-400/30 to-white/10 rounded-full mx-auto mb-3 flex items-center justify-center backdrop-blur-sm border-2 border-white/40 relative overflow-hidden">
                        <!-- Padrão geométrico -->
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="w-16 h-16 relative">
                                <div class="absolute inset-0 bg-yellow-400/40 rounded-full"></div>
                                <div class="absolute top-2 left-2 w-12 h-12 bg-yellow-400/30 rounded-full"></div>
                                <div class="absolute top-4 left-4 w-8 h-8 bg-yellow-400/50 rounded-full"></div>
                                <div class="absolute top-6 left-6 w-4 h-4 bg-yellow-400/70 rounded-full"></div>
                                <div class="absolute top-1 right-1 w-3 h-3 bg-yellow-400/60 rotate-45 rounded-sm"></div>
                                <div class="absolute bottom-1 left-1 w-3 h-3 bg-yellow-400/60 rotate-45 rounded-sm"></div>
                                <div class="absolute bottom-1 right-1 w-2 h-2 bg-yellow-400/80 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                    <h1 class="text-xl font-bold mb-2 tracking-wide">${data.nome || 'Seu Nome'}</h1>
                </div>

                <div class="space-y-6 relative z-10">
                    <div>
                        <h3 class="text-xs font-bold mb-3 border-b-2 border-white/40 pb-2 tracking-widest">CONTATO</h3>
                        <div class="space-y-3 text-xs">
                            ${data.email ? `
                            <div class="flex items-center space-x-3 bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                                <svg class="w-4 h-4 text-cyan-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                <span class="text-white/90">${data.email}</span>
                            </div>
                            ` : ''}
                            ${data.telefone ? `
                            <div class="flex items-center space-x-3 bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                                <svg class="w-4 h-4 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                </svg>
                                <span class="text-white/90">${data.telefone}</span>
                            </div>
                            ` : ''}
                            ${data.endereco ? `
                            <div class="flex items-start space-x-3 bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                                <svg class="w-4 h-4 mt-0.5 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                <div class="text-white/90">
                                    <div class="font-medium">${data.endereco}</div>
                                    <div>${data.cidade}, ${data.estado}</div>
                                    <div class="text-white/70">${data.cep}</div>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>

                    ${(data.cpf || data.rg || data.nascimento) ? `
                    <div>
                        <h3 class="text-xs font-bold mb-3 border-b-2 border-white/40 pb-2 tracking-widest">DADOS PESSOAIS</h3>
                        <div class="space-y-2 text-xs bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                            ${data.cpf ? `<div class="text-white/90"><strong class="text-cyan-200">CPF:</strong> ${data.cpf}</div>` : ''}
                            ${data.rg ? `<div class="text-white/90"><strong class="text-cyan-200">RG:</strong> ${data.rg}</div>` : ''}
                            ${data.nascimento ? `<div class="text-white/90"><strong class="text-cyan-200">Nascimento:</strong> ${new Date(data.nascimento).toLocaleDateString('pt-BR')}</div>` : ''}
                        </div>
                    </div>
                    ` : ''}

                    ${data.disponibilidade ? `
                    <div>
                        <h3 class="text-xs font-bold mb-3 border-b-2 border-white/40 pb-2 tracking-widest">DISPONIBILIDADE</h3>
                        <div class="text-xs bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                            <div class="text-white/90 font-medium">${data.disponibilidade}</div>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>

            <!-- Conteúdo Principal -->
            <div class="w-2/3 p-6 bg-gradient-to-br from-gray-50 to-white">
                <div class="space-y-6">
                    ${data.escolaridade ? `
                    <div>
                        <h3 class="text-lg font-bold text-gray-800 mb-3 pb-2 relative">
                            <span class="text-teal-800 font-extrabold tracking-wide">EDUCAÇÃO</span>
                            <div class="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-teal-800 to-cyan-600 rounded-full"></div>
                        </h3>
                        <div class="bg-white p-3 rounded-lg shadow-sm border-l-4 border-teal-800">
                            <div class="font-bold text-gray-800 text-sm">${data.escolaridade}</div>
                            ${data.instituicao ? `<div class="text-gray-600 mt-1 font-medium">${data.instituicao}</div>` : ''}
                        </div>
                    </div>
                    ` : ''}

                    ${data.experiencia ? `
                    <div>
                        <h3 class="text-lg font-bold text-gray-800 mb-3 pb-2 relative">
                            <span class="text-teal-800 font-extrabold tracking-wide">EXPERIÊNCIA PROFISSIONAL</span>
                            <div class="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-teal-800 to-cyan-600 rounded-full"></div>
                        </h3>
                        <div class="bg-white p-3 rounded-lg shadow-sm border-l-4 border-cyan-600">
                            <div class="text-sm whitespace-pre-line text-gray-700 leading-relaxed">${data.experiencia}</div>
                        </div>
                    </div>
                    ` : ''}

                    ${data.cursos ? `
                    <div>
                        <h3 class="text-lg font-bold text-gray-800 mb-3 pb-2 relative">
                            <span class="text-teal-800 font-extrabold tracking-wide">CURSOS E CERTIFICAÇÕES</span>
                            <div class="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-teal-800 to-cyan-600 rounded-full"></div>
                        </h3>
                        <div class="bg-white p-3 rounded-lg shadow-sm border-l-4 border-blue-500">
                            <div class="text-sm whitespace-pre-line text-gray-700 leading-relaxed">${data.cursos}</div>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
    
    // Carregar o HTML no Puppeteer
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    console.log('✅ HTML carregado no Puppeteer, aguardando renderização...');
    
    // Aguardar renderização completa
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('✅ Renderização completa');
    
    // Gerar PDF
    console.log('🔄 Gerando PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false,
      displayHeaderFooter: false,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm'
      }
    });
    
    console.log('✅ PDF gerado com sucesso, tamanho:', pdfBuffer.length, 'bytes');
    
    // Fechar browser
    console.log('🔄 Fechando browser...');
    await page.close();
    await browser.close();
    console.log('✅ Browser fechado');
    
    // Definir nome do arquivo
    const fileName = `Curriculo_${data.nome.replace(/\s+/g, '_')}.pdf`;
    
    // Retornar PDF diretamente para N8N
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    console.log('📤 Enviando PDF para cliente...');
    res.send(pdfBuffer);
    console.log('✅ PDF enviado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro detalhado:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause?.message
    });
    
    // Cleanup mais robusto
    try {
      if (page && !page.isClosed()) {
        await page.close();
        console.log('🧹 Página fechada no cleanup');
      }
    } catch (cleanupError) {
      console.error('⚠️ Erro ao fechar página:', cleanupError.message);
    }
    
    try {
      if (browser && browser.connected) {
        await browser.close();
        console.log('🧹 Browser fechado no cleanup');
      }
    } catch (cleanupError) {
      console.error('⚠️ Erro ao fechar browser:', cleanupError.message);
    }
    
    res.status(500).json({ 
      error: 'Erro ao gerar PDF', 
      details: error.message,
      type: error.constructor.name
    });
  }
});

// Endpoint alternativo que retorna JSON com base64 (para compatibilidade)
app.post('/api/generate-pdf-json', async (req, res) => {
  let browser = null;
  let page = null;
  
  try {
    console.log('📥 Dados recebidos via API JSON');
    
    const data = convertN8NData(req.body);
    
    if (!data.nome) {
      return res.status(400).json({ 
        error: 'Campo "nome" é obrigatório' 
      });
    }

    console.log('🚀 Iniciando geração de PDF JSON...');
    
    // Criar browser
    browser = await createBrowser();
    page = await browser.newPage();
    
    // Configurar viewport para A4
    await page.setViewport({ width: 1200, height: 1600 });
    
    // Criar HTML completo com o currículo (mesmo HTML do endpoint principal)
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Currículo - ${data.nome}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .curriculum-container {
            width: 210mm;
            height: 297mm;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        @media print {
            .curriculum-container {
                box-shadow: none;
                margin: 0;
            }
        }
    </style>
</head>
<body class="bg-gray-100 p-4">
    <div class="curriculum-container">
        <div class="flex h-full">
            <!-- Sidebar -->
            <div class="w-1/3 bg-gradient-to-br from-slate-800 via-teal-800 to-cyan-800 text-white p-6 relative overflow-hidden">
                <!-- Background Pattern -->
                <div class="absolute inset-0 opacity-10">
                    <div class="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
                    <div class="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
                </div>
                
                <div class="text-center mb-6">
                    <div class="w-24 h-24 bg-gradient-to-br from-yellow-400/30 to-white/10 rounded-full mx-auto mb-3 flex items-center justify-center backdrop-blur-sm border-2 border-white/40 relative overflow-hidden">
                        <!-- Padrão geométrico -->
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="w-16 h-16 relative">
                                <div class="absolute inset-0 bg-yellow-400/40 rounded-full"></div>
                                <div class="absolute top-2 left-2 w-12 h-12 bg-yellow-400/30 rounded-full"></div>
                                <div class="absolute top-4 left-4 w-8 h-8 bg-yellow-400/50 rounded-full"></div>
                                <div class="absolute top-6 left-6 w-4 h-4 bg-yellow-400/70 rounded-full"></div>
                                <div class="absolute top-1 right-1 w-3 h-3 bg-yellow-400/60 rotate-45 rounded-sm"></div>
                                <div class="absolute bottom-1 left-1 w-3 h-3 bg-yellow-400/60 rotate-45 rounded-sm"></div>
                                <div class="absolute bottom-1 right-1 w-2 h-2 bg-yellow-400/80 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                    <h1 class="text-xl font-bold mb-2 tracking-wide">${data.nome || 'Seu Nome'}</h1>
                </div>

                <div class="space-y-6 relative z-10">
                    <div>
                        <h3 class="text-xs font-bold mb-3 border-b-2 border-white/40 pb-2 tracking-widest">CONTATO</h3>
                        <div class="space-y-3 text-xs">
                            ${data.email ? `
                            <div class="flex items-center space-x-3 bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                                <svg class="w-4 h-4 text-cyan-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                <span class="text-white/90">${data.email}</span>
                            </div>
                            ` : ''}
                            ${data.telefone ? `
                            <div class="flex items-center space-x-3 bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                                <svg class="w-4 h-4 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                </svg>
                                <span class="text-white/90">${data.telefone}</span>
                            </div>
                            ` : ''}
                            ${data.endereco ? `
                            <div class="flex items-start space-x-3 bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                                <svg class="w-4 h-4 mt-0.5 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                <div class="text-white/90">
                                    <div class="font-medium">${data.endereco}</div>
                                    <div>${data.cidade}, ${data.estado}</div>
                                    <div class="text-white/70">${data.cep}</div>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>

                    ${(data.cpf || data.rg || data.nascimento) ? `
                    <div>
                        <h3 class="text-xs font-bold mb-3 border-b-2 border-white/40 pb-2 tracking-widest">DADOS PESSOAIS</h3>
                        <div class="space-y-2 text-xs bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                            ${data.cpf ? `<div class="text-white/90"><strong class="text-cyan-200">CPF:</strong> ${data.cpf}</div>` : ''}
                            ${data.rg ? `<div class="text-white/90"><strong class="text-cyan-200">RG:</strong> ${data.rg}</div>` : ''}
                            ${data.nascimento ? `<div class="text-white/90"><strong class="text-cyan-200">Nascimento:</strong> ${new Date(data.nascimento).toLocaleDateString('pt-BR')}</div>` : ''}
                        </div>
                    </div>
                    ` : ''}

                    ${data.disponibilidade ? `
                    <div>
                        <h3 class="text-xs font-bold mb-3 border-b-2 border-white/40 pb-2 tracking-widest">DISPONIBILIDADE</h3>
                        <div class="text-xs bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                            <div class="text-white/90 font-medium">${data.disponibilidade}</div>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>

            <!-- Conteúdo Principal -->
            <div class="w-2/3 p-6 bg-gradient-to-br from-gray-50 to-white">
                <div class="space-y-6">
                    ${data.escolaridade ? `
                    <div>
                        <h3 class="text-lg font-bold text-gray-800 mb-3 pb-2 relative">
                            <span class="text-teal-800 font-extrabold tracking-wide">EDUCAÇÃO</span>
                            <div class="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-teal-800 to-cyan-600 rounded-full"></div>
                        </h3>
                        <div class="bg-white p-3 rounded-lg shadow-sm border-l-4 border-teal-800">
                            <div class="font-bold text-gray-800 text-sm">${data.escolaridade}</div>
                            ${data.instituicao ? `<div class="text-gray-600 mt-1 font-medium">${data.instituicao}</div>` : ''}
                        </div>
                    </div>
                    ` : ''}

                    ${data.experiencia ? `
                    <div>
                        <h3 class="text-lg font-bold text-gray-800 mb-3 pb-2 relative">
                            <span class="text-teal-800 font-extrabold tracking-wide">EXPERIÊNCIA PROFISSIONAL</span>
                            <div class="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-teal-800 to-cyan-600 rounded-full"></div>
                        </h3>
                        <div class="bg-white p-3 rounded-lg shadow-sm border-l-4 border-cyan-600">
                            <div class="text-sm whitespace-pre-line text-gray-700 leading-relaxed">${data.experiencia}</div>
                        </div>
                    </div>
                    ` : ''}

                    ${data.cursos ? `
                    <div>
                        <h3 class="text-lg font-bold text-gray-800 mb-3 pb-2 relative">
                            <span class="text-teal-800 font-extrabold tracking-wide">CURSOS E CERTIFICAÇÕES</span>
                            <div class="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-teal-800 to-cyan-600 rounded-full"></div>
                        </h3>
                        <div class="bg-white p-3 rounded-lg shadow-sm border-l-4 border-blue-500">
                            <div class="text-sm whitespace-pre-line text-gray-700 leading-relaxed">${data.cursos}</div>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
    
    // Carregar o HTML no Puppeteer
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    console.log('✅ HTML carregado no Puppeteer');
    
    // Aguardar renderização completa
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Gerar PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm'
      }
    });
    
    console.log('✅ PDF gerado com sucesso');
    
    // Fechar browser
    await page.close();
    await browser.close();
    
    // Definir nome do arquivo
    const fileName = `Curriculo_${data.nome.replace(/\s+/g, '_')}.pdf`;
    
    // Retornar JSON com PDF em base64
    res.json({
      success: true,
      pdf: pdfBuffer.toString('base64'),
      filename: fileName,
      message: 'PDF gerado com sucesso'
    });
    
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

// Endpoint de teste de conversão
app.post('/api/test-conversion', (req, res) => {
  try {
    const convertedData = convertN8NData(req.body);
    res.json({
      success: true,
      originalData: req.body,
      convertedData: convertedData,
      message: 'Conversão realizada com sucesso'
    });
  } catch (error) {
    res.status(400).json({
      error: 'Erro na conversão',
      details: error.message,
      originalData: req.body
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    engine: 'Puppeteer PDF Generator',
    method: 'HTML direto para PDF com mesmo design do frontend',
    endpoints: {
      'POST /api/generate-pdf': 'Retorna PDF diretamente (recomendado para N8N)',
      'POST /api/generate-pdf-json': 'Retorna JSON com PDF em base64',
      'POST /api/test-conversion': 'Testa conversão de dados'
    }
  });
});

// Status do build
app.get('/api/status', (req, res) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distPath = path.join(__dirname, '../../dist');
  const buildExists = fs.existsSync(distPath);
  
  res.json({
    build: buildExists ? 'ok' : 'not found',
    distPath: distPath,
    server: 'running',
    api: 'active'
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
    res.status(404).json({ error: 'Build não encontrado' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🎯 API N8N: POST http://localhost:${PORT}/api/generate-pdf`);
  console.log(`📄 Retorna PDF diretamente para download`);
  console.log(`✅ Motor: Puppeteer com HTML idêntico ao frontend`);
});
