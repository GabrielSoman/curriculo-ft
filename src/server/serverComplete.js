import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { renderPDFViaFrontend } from './pdfRenderer.js';
import { pdfService } from './pdfDownloadService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Tratamento de sinais como no projeto que funcionou
process.on('SIGTERM', () => {
  console.log('⚠️ Processo recebeu SIGTERM (foi encerrado pelo sistema)');
  pdfService.close();
});

const app = express();
const PORT = process.env.PORT || 80;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Função para converter dados
function convertInputData(inputData) {
  console.log('📥 Dados recebidos:', JSON.stringify(inputData, null, 2));
  
  let data;
  
  if (Array.isArray(inputData)) {
    data = inputData[0]?.body || inputData[0];
  } else if (inputData?.body) {
    data = inputData.body;
  } else {
    data = inputData;
  }
  
  if (!data) {
    throw new Error('Dados não encontrados no request');
  }

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

  const convertedData = {
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

  console.log('✅ Dados convertidos:', JSON.stringify(convertedData, null, 2));
  return convertedData;
}

// ENDPOINT PRINCIPAL - GERA PDF COMO DOWNLOAD DIRETO
app.post('/api/generate-pdf', async (req, res) => {
  console.log('🚀 GERADOR COMPLETO: Iniciando processo completo...');
  
  try {
    const data = convertInputData(req.body);
    
    if (!data.nome) {
      return res.status(400).json({ 
        error: 'Campo "nome" é obrigatório',
        receivedData: req.body
      });
    }

    console.log('✅ Dados válidos, gerando HTML com frontend...');
    
    // ETAPA 1: Gerar HTML com frontend real
    const htmlContent = await renderPDFViaFrontend(data);
    
    console.log('✅ HTML gerado, iniciando sub-aplicação PDF...');
    
    // ETAPA 2: Sub-aplicação gera PDF
    const pdfBuffer = await pdfService.generatePDFFromHTML(htmlContent);
    
   // VERIFICAR se é Buffer binário válido
   if (!Buffer.isBuffer(pdfBuffer)) {
     console.error('❌ PDF não é um Buffer válido:', typeof pdfBuffer);
     throw new Error('PDF gerado não é um Buffer binário válido');
   }
   
   // VERIFICAR se começa com header PDF
   const header = pdfBuffer.toString('ascii', 0, 4);
   if (header !== '%PDF') {
     console.error('❌ PDF não tem header válido:', header);
     throw new Error('PDF gerado não tem header válido');
   }
   
    const fileName = `Curriculo_${data.nome.replace(/\s+/g, '_')}.pdf`;
    
    console.log(`✅ PDF completo gerado! Tamanho: ${Math.round(pdfBuffer.length / 1024)}KB`);
    
    // ETAPA 3: Retornar PDF como download
    res.setHeader('Content-Type', 'application/pdf');
   res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'no-cache');
    
   // ENVIAR BINÁRIO - NÃO JSON!
    res.send(pdfBuffer);
    console.log('📤 PDF enviado como download! PROCESSO COMPLETO!');
    
  } catch (error) {
    console.error('❌ Erro no processo completo:', error.message);
    console.error('Stack:', error.stack);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Erro no gerador completo de PDF', 
        details: error.message,
        receivedData: req.body
      });
    }
  }
});

// ENDPOINT PARA VISUALIZAR HTML (debug)
app.post('/api/render-pdf', async (req, res) => {
  console.log('🎨 RENDERIZADOR: Gerando HTML para visualização...');
  
  try {
    const data = convertInputData(req.body);
    
    if (!data.nome) {
      return res.status(400).json({ 
        error: 'Campo "nome" é obrigatório',
        receivedData: req.body
      });
    }

    const htmlContent = await renderPDFViaFrontend(data);
    
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
    
    console.log('✅ HTML enviado para visualização!');
    
  } catch (error) {
    console.error('❌ Erro no renderizador:', error.message);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Erro no renderizador', 
        details: error.message,
        receivedData: req.body
      });
    }
  }
});

// HEALTH CHECK
app.get('/api/health', async (req, res) => {
  // Testar se Puppeteer está funcionando
  let puppeteerStatus = 'unknown';
  try {
    if (!pdfService.browser) {
      await pdfService.initialize();
    }
    puppeteerStatus = pdfService.browser ? 'ok' : 'failed';
  } catch (error) {
    puppeteerStatus = 'error';
  }

  res.json({ 
    status: 'ok',
    message: 'API Completa com Sub-aplicação PDF funcionando',
    version: '6.0.0-complete-pdf-service',
    features: {
      'frontend_renderer': true,
      'puppeteer_pdf_service': true,
      'download_direto': true,
      'resultado_identico': true,
      'sem_jsdom_css_parsing': true
    },
    services: {
      'puppeteer': puppeteerStatus,
      'frontend_renderer': 'ok',
      'pdf_download': 'ok'
    },
    endpoints: {
      'POST /api/generate-pdf': 'Retorna PDF como download direto',
      'POST /api/render-pdf': 'Visualizar HTML renderizado (debug)'
    }
  });
});

// STATUS
app.get('/api/status', (req, res) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distPath = path.join(__dirname, '../../dist');
  const buildExists = fs.existsSync(distPath);
  
  res.json({
    build: buildExists ? 'ok' : 'not found',
    server: 'running',
    api: 'active',
    architecture: 'frontend-renderer + puppeteer-pdf-service',
    process: {
      step1: 'Gerar HTML com frontend real',
      step2: 'Sub-aplicação Puppeteer gera PDF',
      step3: 'Retornar PDF como download HTTP'
    }
  });
});

// Inicializar Puppeteer na inicialização
pdfService.initialize().then(() => {
  console.log('🎯 Sub-aplicação PDF inicializada!');
}).catch(error => {
  console.error('⚠️ Aviso: Sub-aplicação PDF não inicializada:', error.message);
});

// Cleanup ao fechar
process.on('SIGTERM', async () => {
  console.log('🔒 Fechando sub-aplicação PDF...');
  await pdfService.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔒 Fechando sub-aplicação PDF...');
  await pdfService.close();
  process.exit(0);
});

// Servir arquivos estáticos
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
  console.log(`🚀 SERVIDOR COMPLETO COM SUB-APLICAÇÃO PDF RODANDO NA PORTA ${PORT}`);
  console.log(`🎯 API Principal: POST http://localhost:${PORT}/api/generate-pdf`);
  console.log(`🎨 Renderizador: POST http://localhost:${PORT}/api/render-pdf`);
  console.log(`❤️  Health: GET http://localhost:${PORT}/api/health`);
  console.log(`✅ PROCESSO COMPLETO: HTML FRONTEND → SUB-APLICAÇÃO → PDF DOWNLOAD!`);
});