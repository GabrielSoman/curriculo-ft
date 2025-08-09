import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { renderPDFViaFrontend } from './pdfRenderer.js';

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

// ENDPOINT ESPECIAL - RENDERIZAR VIA FRONTEND
app.post('/api/render-pdf', async (req, res) => {
  console.log('🚀 RENDERIZADOR FRONTEND: Iniciando...');
  
  try {
    const data = convertInputData(req.body);
    
    if (!data.nome) {
      return res.status(400).json({ 
        error: 'Campo "nome" é obrigatório',
        receivedData: req.body
      });
    }

    console.log('✅ Gerando HTML com frontend...');
    
    const htmlContent = await renderPDFViaFrontend(data);
    
    // Retornar HTML que será renderizado pelo browser
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
    
    console.log('✅ HTML enviado para renderização!');
    
  } catch (error) {
    console.error('❌ Erro no renderizador:', error.message);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Erro no renderizador frontend', 
        details: error.message,
        receivedData: req.body
      });
    }
  }
});

// ENDPOINT PRINCIPAL - SEM JSDOM
app.post('/api/generate-pdf', async (req, res) => {
  console.log('🚀 GERADOR SEM JSDOM: Redirecionando para renderizador...');
  
  try {
    const data = convertInputData(req.body);
    
    if (!data.nome) {
      return res.status(400).json({ 
        error: 'Campo "nome" é obrigatório',
        receivedData: req.body
      });
    }

    // Retornar instruções para usar o renderizador
    res.json({
      message: 'Use o endpoint /api/render-pdf para gerar o PDF',
      instructions: 'Faça uma requisição GET para /api/render-pdf com os dados no body',
      renderUrl: '/api/render-pdf',
      data: data
    });
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Erro no gerador', 
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
    message: 'API Frontend Renderer funcionando',
    version: '5.0.0-frontend-renderer',
    features: {
      'sem_jsdom': true,
      'usa_frontend_real': true,
      'css_tailwind_nativo': true,
      'resultado_identico': true,
      'sem_parsing_css': true
    },
    endpoints: {
      'POST /api/render-pdf': 'Retorna HTML para renderização no browser',
      'POST /api/generate-pdf': 'Instruções para usar o renderizador'
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
  console.log(`🚀 SERVIDOR FRONTEND RENDERER RODANDO NA PORTA ${PORT}`);
  console.log(`🎯 Renderizador: POST http://localhost:${PORT}/api/render-pdf`);
  console.log(`❤️  Health: GET http://localhost:${PORT}/api/health`);
  console.log(`✅ SEM JSDOM - USA O FRONTEND REAL PARA RENDERIZAR!`);
});