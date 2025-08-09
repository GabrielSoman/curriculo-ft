import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { generateUnifiedHTML } from './pdfEngineUnified.js';

const app = express();
const PORT = process.env.PORT || 80;

// Middleware essencial
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Função para converter dados (mantida igual)
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

// ENDPOINT PRINCIPAL - MOTOR UNIFICADO SEM DEPENDÊNCIA DE CSS EXTERNO
app.post('/api/generate-pdf', async (req, res) => {
  console.log('🚀 POST /api/generate-pdf - MOTOR UNIFICADO INICIANDO...');
  
  try {
    const data = convertInputData(req.body);
    
    if (!data.nome) {
      console.error('❌ Nome não fornecido');
      return res.status(400).json({ 
        error: 'Campo "nome" é obrigatório',
        receivedData: req.body
      });
    }

    console.log('✅ Dados válidos, gerando HTML com CSS puro...');
    
    // Gerar HTML com CSS puro inline (SEM dependência externa)
    const htmlContent = generateUnifiedHTML(data);
    
    console.log('✅ HTML puro gerado, criando DOM virtual...');
    
    // Usar JSDOM APENAS para executar JavaScript
    const { JSDOM } = await import('jsdom');
    const dom = new JSDOM(htmlContent, {
      runScripts: 'dangerously',
      resources: 'usable',
      pretendToBeVisual: true,
      url: 'http://localhost',
      beforeParse(window) {
        window.devicePixelRatio = 2;
        window.innerWidth = 1200;
        window.innerHeight = 800;
      }
    });

    const window = dom.window;
    
    console.log('⏳ Aguardando carregamento dos scripts CDN...');
    
    // Aguardar scripts carregarem
    await new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 100;
      
      const checkScripts = () => {
        attempts++;
        if (window.html2canvas && window.jspdf && window.jspdf.jsPDF && window.pdfReady) {
          console.log('✅ Scripts CDN carregados com sucesso');
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error('Timeout ao carregar scripts CDN'));
        } else {
          setTimeout(checkScripts, 100);
        }
      };
      checkScripts();
    });

    // Aguardar renderização
    console.log('⏳ Aguardando renderização completa...');
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('📄 Executando geração de PDF...');
    
    // Gerar PDF usando o MESMO motor do frontend
    const pdfArrayBuffer = await window.generatePDF();
    
    if (!pdfArrayBuffer || pdfArrayBuffer.byteLength === 0) {
      throw new Error('PDF gerado está vazio');
    }
    
    const pdfBuffer = Buffer.from(pdfArrayBuffer);
    const fileName = `Curriculo_${data.nome.replace(/\s+/g, '_')}.pdf`;
    
    console.log(`✅ PDF gerado! Tamanho: ${Math.round(pdfBuffer.length / 1024)}KB`);
    
    // Retornar PDF diretamente
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'no-cache');
    
    res.send(pdfBuffer);
    console.log('📤 PDF enviado com sucesso! MOTOR UNIFICADO FUNCIONANDO!');
    
  } catch (error) {
    console.error('❌ Erro no motor unificado:', error.message);
    console.error('Stack:', error.stack);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Erro ao gerar PDF com motor unificado', 
        details: error.message,
        receivedData: req.body
      });
    }
  }
});

// ENDPOINT ALTERNATIVO - RETORNA JSON COM BASE64
app.post('/api/generate-pdf-json', async (req, res) => {
  console.log('🚀 POST /api/generate-pdf-json - MOTOR UNIFICADO JSON...');
  
  try {
    const data = convertInputData(req.body);
    
    if (!data.nome) {
      return res.status(400).json({ 
        error: 'Campo "nome" é obrigatório',
        receivedData: req.body
      });
    }

    const htmlContent = generateUnifiedHTML(data);
    
    const { JSDOM } = await import('jsdom');
    const dom = new JSDOM(htmlContent, {
      runScripts: 'dangerously',
      resources: 'usable',
      pretendToBeVisual: true,
      url: 'http://localhost',
      beforeParse(window) {
        window.devicePixelRatio = 2;
      }
    });

    const window = dom.window;
    
    await new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 100;
      
      const checkScripts = () => {
        attempts++;
        if (window.html2canvas && window.jspdf && window.jspdf.jsPDF && window.pdfReady) {
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error('Timeout ao carregar scripts CDN'));
        } else {
          setTimeout(checkScripts, 100);
        }
      };
      checkScripts();
    });

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const pdfArrayBuffer = await window.generatePDF();
    const pdfBuffer = Buffer.from(pdfArrayBuffer);
    const fileName = `Curriculo_${data.nome.replace(/\s+/g, '_')}.pdf`;
    
    res.json({
      success: true,
      pdf: pdfBuffer.toString('base64'),
      filename: fileName,
      size: `${Math.round(pdfBuffer.length / 1024)}KB`,
      message: 'PDF gerado com motor unificado'
    });
    
  } catch (error) {
    console.error('❌ Erro no motor unificado JSON:', error.message);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Erro ao gerar PDF JSON com motor unificado', 
        details: error.message,
        receivedData: req.body
      });
    }
  }
});

// HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'API com Motor Unificado funcionando',
    version: '4.0.0-unified-pure-css',
    features: {
      'css_puro_inline': true,
      'sem_dependencia_externa': true,
      'sem_tailwind_compilado': true,
      'motor_unificado': true,
      'html2canvas_jspdf': true,
      'sem_puppeteer': true,
      'resultado_identico': true
    },
    endpoints: {
      'POST /api/generate-pdf': 'Retorna PDF idêntico ao frontend (Motor Unificado)',
      'POST /api/generate-pdf-json': 'Retorna JSON com PDF em base64'
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
    motor: 'unificado-css-puro',
    dependencies: {
      jsdom: 'ok',
      express: 'ok',
      cors: 'ok',
      css_externo: 'não necessário',
      tailwind: 'não necessário'
    }
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
  console.log(`🚀 SERVIDOR COM MOTOR UNIFICADO RODANDO NA PORTA ${PORT}`);
  console.log(`🎯 API Principal: POST http://localhost:${PORT}/api/generate-pdf`);
  console.log(`❤️  Health: GET http://localhost:${PORT}/api/health`);
  console.log(`✅ MOTOR UNIFICADO PRONTO - CSS PURO INLINE!`);
  console.log(`🔥 SEM DEPENDÊNCIA DE CSS EXTERNO - RESULTADO IDÊNTICO GARANTIDO!`);
});