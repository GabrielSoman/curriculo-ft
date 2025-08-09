import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { generateOptimizedHTML } from './pdfTemplate.js';

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

// Função para converter dados do N8N/JSON para formato interno
function convertInputData(inputData) {
  console.log('📥 Dados recebidos:', JSON.stringify(inputData, null, 2));
  
  let data;
  
  // Tratar diferentes formatos de entrada
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

  // Converter formato de data se necessário
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

  // Mapear todos os campos possíveis
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

// ENDPOINT PRINCIPAL - GERA PDF DIRETAMENTE
app.post('/api/generate-pdf', async (req, res) => {
  console.log('🚀 POST /api/generate-pdf - Iniciando...');
  
  try {
    // Converter dados de entrada
    const data = convertInputData(req.body);
    
    if (!data.nome) {
      console.error('❌ Nome não fornecido');
      return res.status(400).json({ 
        error: 'Campo "nome" é obrigatório',
        receivedData: req.body
      });
    }

    console.log('✅ Dados válidos, gerando HTML...');
    
    // Gerar HTML
    const htmlContent = generateOptimizedHTML(data);
    
    console.log('✅ HTML otimizado gerado, criando DOM virtual...');
    
    // Usar JSDOM para processar
    const { JSDOM } = await import('jsdom');
    const dom = new JSDOM(htmlContent, {
      runScripts: 'dangerously',
      resources: 'usable',
      pretendToBeVisual: true,
      url: 'http://localhost'
    });

    const window = dom.window;
    
    console.log('⏳ Aguardando carregamento dos scripts...');
    
    // Aguardar scripts carregarem
    await new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 50;
      
      const checkScripts = () => {
        attempts++;
        if (window.html2canvas && window.jspdf && window.jspdf.jsPDF && window.pdfReady) {
          console.log('✅ Scripts carregados');
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error('Timeout ao carregar scripts'));
        } else {
          setTimeout(checkScripts, 100);
        }
      };
      checkScripts();
    });

    // Aguardar renderização (tempo reduzido)
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('📄 Gerando PDF...');
    
    // Gerar PDF
    const pdfArrayBuffer = await window.generatePDF();
    
    if (!pdfArrayBuffer || pdfArrayBuffer.byteLength === 0) {
      throw new Error('PDF gerado está vazio');
    }
    
    const pdfBuffer = Buffer.from(pdfArrayBuffer);
    const fileName = `Curriculo_${data.nome.replace(/\s+/g, '_')}.pdf`;
    
    console.log(`✅ PDF gerado! Tamanho: ${pdfBuffer.length} bytes`);
    
    // Retornar PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    res.send(pdfBuffer);
    console.log('📤 PDF enviado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('Stack:', error.stack);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Erro ao gerar PDF', 
        details: error.message,
        receivedData: req.body
      });
    }
  }
});

// ENDPOINT ALTERNATIVO - RETORNA JSON COM BASE64
app.post('/api/generate-pdf-json', async (req, res) => {
  console.log('🚀 POST /api/generate-pdf-json - Iniciando...');
  
  try {
    const data = convertInputData(req.body);
    
    if (!data.nome) {
      return res.status(400).json({ 
        error: 'Campo "nome" é obrigatório',
        receivedData: req.body
      });
    }

    const htmlContent = generateOptimizedHTML(data);
    
    const { JSDOM } = await import('jsdom');
    const dom = new JSDOM(htmlContent, {
      runScripts: 'dangerously',
      resources: 'usable',
      pretendToBeVisual: true,
      url: 'http://localhost'
    });

    const window = dom.window;
    
    await new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 50;
      
      const checkScripts = () => {
        attempts++;
        if (window.html2canvas && window.jspdf && window.jspdf.jsPDF && window.pdfReady) {
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error('Timeout ao carregar scripts'));
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
      message: 'PDF gerado com sucesso'
    });
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Erro ao gerar PDF', 
        details: error.message,
        receivedData: req.body
      });
    }
  }
});

// ENDPOINT DE TESTE
app.post('/api/test-conversion', (req, res) => {
  try {
    console.log('🧪 Testando conversão de dados...');
    const convertedData = convertInputData(req.body);
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

// HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'API funcionando',
    endpoints: {
      'POST /api/generate-pdf': 'Retorna PDF diretamente',
      'POST /api/generate-pdf-json': 'Retorna JSON com PDF em base64',
      'POST /api/test-conversion': 'Testa conversão de dados'
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
  console.log(`🎯 API Principal: POST http://localhost:${PORT}/api/generate-pdf`);
  console.log(`📋 Teste: POST http://localhost:${PORT}/api/test-conversion`);
  console.log(`❤️  Health: GET http://localhost:${PORT}/api/health`);
  console.log(`✅ PRONTO PARA RECEBER REQUESTS HTTP!`);
});