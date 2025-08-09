import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

// Configurações globais
const MAX_CONCURRENT_REQUESTS = 5;
const REQUEST_TIMEOUT = 60000; // 1 minuto
let activeRequests = 0;

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

// Gerar PDF usando JSDOM (fallback robusto)
async function generatePDFWithJSDOM(data) {
  console.log('🔄 Gerando PDF com JSDOM...');
  
  const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Currículo - ${data.nome}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; background: #f3f4f6; }
        .curriculum-container {
            width: 210mm;
            height: 297mm;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            transform-origin: top left;
        }
        @media print {
            .curriculum-container {
                box-shadow: none;
                margin: 0;
            }
        }
    </style>
</head>
<body>
    <div id="curriculum" class="curriculum-container">
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

    <script>
        window.generatePDF = async function() {
            try {
                const element = document.getElementById('curriculum');
                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff',
                    width: element.scrollWidth,
                    height: element.scrollHeight
                });

                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                
                const imgWidth = 210;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                
                return pdf.output('arraybuffer');
            } catch (error) {
                console.error('Erro ao gerar PDF:', error);
                throw error;
            }
        };
    </script>
</body>
</html>`;

  // Criar DOM virtual
  const dom = new JSDOM(htmlContent, {
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true
  });

  const window = dom.window;
  const document = window.document;

  // Aguardar carregamento dos scripts
  await new Promise((resolve) => {
    const checkScripts = () => {
      if (window.html2canvas && window.jspdf) {
        resolve();
      } else {
        setTimeout(checkScripts, 100);
      }
    };
    checkScripts();
  });

  console.log('✅ Scripts carregados no JSDOM');

  // Aguardar renderização
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Gerar PDF
  const pdfArrayBuffer = await window.generatePDF();
  const pdfBuffer = Buffer.from(pdfArrayBuffer);

  console.log('✅ PDF gerado com JSDOM, tamanho:', pdfBuffer.length, 'bytes');

  return pdfBuffer;
}

// Middleware para limitar requisições concorrentes
const rateLimitMiddleware = (req, res, next) => {
  if (activeRequests >= MAX_CONCURRENT_REQUESTS) {
    return res.status(429).json({
      error: 'Muitas requisições simultâneas',
      message: 'Tente novamente em alguns segundos',
      activeRequests: activeRequests,
      maxConcurrent: MAX_CONCURRENT_REQUESTS
    });
  }
  
  activeRequests++;
  console.log(`📊 Requisições ativas: ${activeRequests}/${MAX_CONCURRENT_REQUESTS}`);
  
  const cleanup = () => {
    activeRequests--;
    console.log(`📊 Requisições ativas: ${activeRequests}/${MAX_CONCURRENT_REQUESTS}`);
  };
  
  res.on('finish', cleanup);
  res.on('close', cleanup);
  res.on('error', cleanup);
  
  next();
};

// ENDPOINT PRINCIPAL - RETORNA PDF DIRETAMENTE
app.post('/api/generate-pdf', rateLimitMiddleware, async (req, res) => {
  const timeoutId = setTimeout(() => {
    console.error('⏰ Timeout da requisição após 1 minuto');
    if (!res.headersSent) {
      res.status(408).json({ error: 'Timeout na geração do PDF' });
    }
  }, REQUEST_TIMEOUT);
  
  try {
    console.log('📥 Dados recebidos via API');
    
    const data = convertN8NData(req.body);
    
    if (!data.nome) {
      return res.status(400).json({ 
        error: 'Campo "nome" é obrigatório' 
      });
    }

    console.log('🚀 Iniciando geração de PDF com JSDOM...');
    
    // Gerar PDF usando JSDOM
    const pdfBuffer = await generatePDFWithJSDOM(data);
    
    // Definir nome do arquivo
    const fileName = `Curriculo_${data.nome.replace(/\s+/g, '_')}.pdf`;
    
    // Retornar PDF diretamente
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    console.log('📤 Enviando PDF para cliente...');
    res.send(pdfBuffer);
    console.log('✅ PDF enviado com sucesso!');
    
    clearTimeout(timeoutId);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    
    clearTimeout(timeoutId);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Erro ao gerar PDF', 
        details: error.message
      });
    }
  }
});

// Endpoint alternativo que retorna JSON com base64
app.post('/api/generate-pdf-json', rateLimitMiddleware, async (req, res) => {
  const timeoutId = setTimeout(() => {
    console.error('⏰ Timeout da requisição JSON após 1 minuto');
    if (!res.headersSent) {
      res.status(408).json({ error: 'Timeout na geração do PDF' });
    }
  }, REQUEST_TIMEOUT);
  
  try {
    console.log('📥 Dados recebidos via API JSON');
    
    const data = convertN8NData(req.body);
    
    if (!data.nome) {
      return res.status(400).json({ 
        error: 'Campo "nome" é obrigatório' 
      });
    }

    console.log('🚀 Iniciando geração de PDF JSON com JSDOM...');
    
    // Gerar PDF usando JSDOM
    const pdfBuffer = await generatePDFWithJSDOM(data);
    
    // Definir nome do arquivo
    const fileName = `Curriculo_${data.nome.replace(/\s+/g, '_')}.pdf`;
    
    // Retornar JSON com PDF em base64
    res.json({
      success: true,
      pdf: pdfBuffer.toString('base64'),
      filename: fileName,
      message: 'PDF gerado com sucesso'
    });
    
    clearTimeout(timeoutId);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    
    clearTimeout(timeoutId);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Erro ao gerar PDF', 
        details: error.message 
      });
    }
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
    activeRequests: activeRequests,
    maxConcurrent: MAX_CONCURRENT_REQUESTS,
    engine: 'JSDOM + html2canvas + jsPDF',
    method: 'Mesmo motor do frontend, sem Puppeteer',
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
    api: 'active',
    engine: 'JSDOM (sem Puppeteer)'
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

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Recebido SIGTERM, finalizando servidor...');
  console.log('👋 Servidor finalizado');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Recebido SIGINT, finalizando servidor...');
  console.log('👋 Servidor finalizado');
  process.exit(0);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🎯 API: POST http://localhost:${PORT}/api/generate-pdf`);
  console.log(`📄 Retorna PDF diretamente para download`);
  console.log(`✅ Motor: JSDOM + html2canvas + jsPDF (sem Puppeteer)`);
  console.log(`⚙️ Configurações: ${MAX_CONCURRENT_REQUESTS} req simultâneas, timeout ${REQUEST_TIMEOUT/1000}s`);
  console.log(`🔧 Solução robusta sem dependências de Chromium`);
});
