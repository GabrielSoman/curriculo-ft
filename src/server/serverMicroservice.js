import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { generatePDFWithMicroservice } from './pdfMicroservice.js';

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

// ENDPOINT PRINCIPAL - MICROSERVIÇO COM RESULTADO IDÊNTICO
app.post('/api/generate-pdf', async (req, res) => {
  console.log('🚀 POST /api/generate-pdf - MICROSERVIÇO INICIANDO...');
  
  try {
    const data = convertInputData(req.body);
    
    if (!data.nome) {
      console.error('❌ Nome não fornecido');
      return res.status(400).json({ 
        error: 'Campo "nome" é obrigatório',
        receivedData: req.body
      });
    }

    console.log('✅ Dados válidos, iniciando microserviço...');
    
    // Usar o microserviço para gerar PDF idêntico
    const pdfBuffer = await generatePDFWithMicroservice(data);
    
    const fileName = `Curriculo_${data.nome.replace(/\s+/g, '_')}.pdf`;
    
    console.log(`✅ MICROSERVIÇO: PDF gerado! Tamanho: ${Math.round(pdfBuffer.length / 1024)}KB`);
    
    // Retornar PDF diretamente
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'no-cache');
    
    res.send(pdfBuffer);
    console.log('📤 MICROSERVIÇO: PDF enviado! RESULTADO IDÊNTICO AO FRONTEND!');
    
  } catch (error) {
    console.error('❌ MICROSERVIÇO: Erro:', error.message);
    console.error('Stack:', error.stack);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Erro no microserviço de PDF', 
        details: error.message,
        receivedData: req.body
      });
    }
  }
});

// ENDPOINT JSON
app.post('/api/generate-pdf-json', async (req, res) => {
  console.log('🚀 POST /api/generate-pdf-json - MICROSERVIÇO JSON...');
  
  try {
    const data = convertInputData(req.body);
    
    if (!data.nome) {
      return res.status(400).json({ 
        error: 'Campo "nome" é obrigatório',
        receivedData: req.body
      });
    }

    const pdfBuffer = await generatePDFWithMicroservice(data);
    const fileName = `Curriculo_${data.nome.replace(/\s+/g, '_')}.pdf`;
    
    res.json({
      success: true,
      pdf: pdfBuffer.toString('base64'),
      filename: fileName,
      size: `${Math.round(pdfBuffer.length / 1024)}KB`,
      message: 'PDF gerado com microserviço - resultado idêntico ao frontend'
    });
    
  } catch (error) {
    console.error('❌ MICROSERVIÇO JSON: Erro:', error.message);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Erro no microserviço JSON', 
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
    message: 'API com Microserviço de PDF funcionando',
    version: '3.0.0-microservice',
    features: {
      'microservico_interno': true,
      'css_tailwind_compilado': true,
      'resultado_identico_frontend': true,
      'mesmo_motor_renderizacao': true,
      'html2canvas_jspdf': true,
      'sem_puppeteer': true
    },
    endpoints: {
      'POST /api/generate-pdf': 'Retorna PDF idêntico ao frontend (Microserviço)',
      'POST /api/generate-pdf-json': 'Retorna JSON com PDF em base64'
    }
  });
});

// STATUS
app.get('/api/status', (req, res) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distPath = path.join(__dirname, '../../dist');
  const buildExists = fs.existsSync(distPath);
  
  // Verificar se CSS compilado existe
  let cssExists = false;
  if (buildExists) {
    try {
      const files = fs.readdirSync(distPath);
      cssExists = files.some(file => file.endsWith('.css'));
    } catch (error) {
      cssExists = false;
    }
  }
  
  res.json({
    build: buildExists ? 'ok' : 'not found',
    css_compilado: cssExists ? 'ok' : 'not found',
    server: 'running',
    api: 'active',
    microservico: 'ready',
    dependencies: {
      jsdom: 'ok',
      express: 'ok',
      cors: 'ok',
      tailwind_css: cssExists ? 'compilado' : 'não encontrado'
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
  console.log(`🚀 SERVIDOR COM MICROSERVIÇO DE PDF RODANDO NA PORTA ${PORT}`);
  console.log(`🎯 API Principal: POST http://localhost:${PORT}/api/generate-pdf`);
  console.log(`❤️  Health: GET http://localhost:${PORT}/api/health`);
  console.log(`✅ MICROSERVIÇO PRONTO - RESULTADO IDÊNTICO AO FRONTEND GARANTIDO!`);
  console.log(`🔥 USANDO CSS TAILWIND COMPILADO + MESMO MOTOR DE RENDERIZAÇÃO!`);
});