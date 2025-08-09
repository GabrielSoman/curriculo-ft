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
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process'
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
        break;
      }
    }
  }

  return await puppeteer.launch(browserOptions);
}

// ENDPOINT PRINCIPAL - USA O FRONTEND PARA GERAR PDF
app.post('/api/generate-pdf', async (req, res) => {
  let browser = null;
  let page = null;
  
  try {
    console.log('📥 Dados recebidos via API');
    
    const data = convertN8NData(req.body);
    
    if (!data.nome) {
      return res.status(400).json({ 
        error: 'Campo "nome" é obrigatório' 
      });
    }

    console.log('🚀 Abrindo frontend para gerar PDF...');
    
    // Criar browser
    browser = await createBrowser();
    page = await browser.newPage();
    
    // Abrir o próprio frontend
    await page.goto(`http://localhost:${PORT}`, {
      waitUntil: 'networkidle0'
    });
    
    console.log('✅ Frontend carregado');
    
    // Preencher os campos do formulário usando o frontend real
    await page.evaluate((formData) => {
      // Simular preenchimento dos campos
      const setInputValue = (name, value) => {
        const input = document.querySelector(`input[name="${name}"], textarea[name="${name}"]`);
        if (input) {
          input.value = value;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      };
      
      // Preencher todos os campos
      Object.entries(formData).forEach(([key, value]) => {
        setInputValue(key, value);
      });
      
    }, data);
    
    console.log('✅ Dados preenchidos no formulário');
    
    // Aguardar um pouco para React processar
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Clicar no botão de visualizar
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const visualizarBtn = buttons.find(btn => btn.textContent?.includes('Visualizar'));
      if (visualizarBtn) visualizarBtn.click();
    });
    
    console.log('✅ Preview gerado');
    
    // Aguardar preview renderizar
    await page.waitForSelector('#curriculo-preview', { timeout: 5000 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Agora usar o motor do frontend para gerar o PDF
    const pdfData = await page.evaluate(async () => {
      // Esta função roda no contexto do browser
      const element = document.getElementById('curriculo-preview');
      if (!element) throw new Error('Preview não encontrado');
      
      // Importar as funções (assumindo que estão globais ou podemos acessá-las)
      // Como estamos no contexto do frontend, html2canvas e jsPDF já estão disponíveis
      
      // Usar html2canvas (já carregado no frontend)
      const canvas = await window.html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Converter para PDF usando jsPDF (já carregado no frontend)
      const imgData = canvas.toDataURL('image/png');
      const pdf = new window.jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Retornar como base64
      return pdf.output('datauristring').split(',')[1];
    });
    
    console.log('✅ PDF gerado pelo frontend');
    
    // Fechar browser
    await page.close();
    await browser.close();
    
    // Retornar o PDF
    const fileName = `Curriculo_${data.nome.replace(/\s+/g, '_')}.pdf`;
    
    res.json({
      success: true,
      pdf: pdfData,
      filename: fileName,
      message: 'PDF gerado com sucesso usando o motor do frontend'
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    engine: 'Frontend Engine (html2canvas + jsPDF)',
    method: 'Puppeteer abre o frontend e usa o motor existente'
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
  console.log(`🎯 USANDO
