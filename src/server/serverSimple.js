import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { generatePDFPure } from './pdfGeneratorPure.js';

const app = express();
const PORT = process.env.PORT || 80;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

function convertInputData(inputData) {
  let data;
  
  if (Array.isArray(inputData)) {
    data = inputData[0]?.body || inputData[0];
  } else if (inputData?.body) {
    data = inputData.body;
  } else {
    data = inputData;
  }
  
  if (!data) {
    throw new Error('Dados não encontrados');
  }

  return {
    nome: data.nome || '',
    cpf: data.cpf || '',
    rg: data.rg || '',
    telefone: data.telefone || '',
    endereco: data.endereco || '',
    cidade: data.cidade || '',
    estado: data.estado || '',
    email: data.email || data['e-mail'] || '',
    escolaridade: data.escolaridade || '',
    disponibilidade: data.disponibilidade || data['disponibilidade-turno'] || '',
    experiencia: data.experiencia || '',
    cursos: data.cursos || data['cursos-extras'] || ''
  };
}

// ENDPOINT PRINCIPAL - SEM CSS PARSING
app.post('/api/generate-pdf', async (req, res) => {
  console.log('🚀 SERVIDOR SIMPLES: Iniciando...');
  
  try {
    const data = convertInputData(req.body);
    
    if (!data.nome) {
      return res.status(400).json({ 
        error: 'Campo "nome" é obrigatório',
        receivedData: req.body
      });
    }

    console.log('✅ Gerando PDF sem CSS parsing...');
    
    const pdfBuffer = await generatePDFPure(data);
    const fileName = `Curriculo_${data.nome.replace(/\s+/g, '_')}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    res.send(pdfBuffer);
    console.log('✅ PDF enviado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Erro ao gerar PDF simples', 
        details: error.message,
        receivedData: req.body
      });
    }
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'API Simples funcionando',
    version: '1.0.0-simple',
    features: {
      'sem_css_parsing': true,
      'html_minimo': true,
      'sem_tailwind': true,
      'sem_puppeteer': true
    }
  });
});

// Servir arquivos estáticos
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../../dist')));

app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../../dist/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Build não encontrado' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SERVIDOR SIMPLES RODANDO NA PORTA ${PORT}`);
  console.log(`🎯 API: POST http://localhost:${PORT}/api/generate-pdf`);
  console.log(`✅ SEM CSS PARSING - SEM ERROS!`);
});