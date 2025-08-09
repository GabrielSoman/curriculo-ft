import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

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

// Função para gerar HTML do currículo
function generateCurriculumHTML(data) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Currículo - ${data.nome}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            background: #f3f4f6;
            font-size: 12px;
            line-height: 1.4;
        }
        
        .curriculum-container {
            width: 210mm;
            height: 297mm;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            display: flex;
        }
        
        .sidebar {
            width: 33.333%;
            background: linear-gradient(135deg, #1e293b 0%, #0f766e 50%, #0891b2 100%);
            color: white;
            padding: 24px;
            position: relative;
            overflow: hidden;
        }
        
        .sidebar::before {
            content: '';
            position: absolute;
            top: -50px;
            left: -50px;
            width: 120px;
            height: 120px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
        }
        
        .sidebar::after {
            content: '';
            position: absolute;
            bottom: -30px;
            right: -30px;
            width: 80px;
            height: 80px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
        }
        
        .profile-section {
            text-align: center;
            margin-bottom: 24px;
            position: relative;
            z-index: 1;
        }
        
        .profile-avatar {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, rgba(251,191,36,0.3) 0%, rgba(255,255,255,0.1) 100%);
            border-radius: 50%;
            margin: 0 auto 12px;
            border: 2px solid rgba(255,255,255,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        
        .profile-avatar::before {
            content: '';
            position: absolute;
            inset: 0;
            background: rgba(251,191,36,0.4);
            border-radius: 50%;
        }
        
        .profile-name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
        }
        
        .sidebar-section {
            margin-bottom: 24px;
            position: relative;
            z-index: 1;
        }
        
        .sidebar-title {
            font-size: 10px;
            font-weight: bold;
            margin-bottom: 12px;
            border-bottom: 2px solid rgba(255,255,255,0.4);
            padding-bottom: 8px;
            letter-spacing: 1px;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            background: rgba(255,255,255,0.1);
            padding: 8px;
            border-radius: 6px;
            backdrop-filter: blur(4px);
        }
        
        .contact-icon {
            width: 16px;
            height: 16px;
            margin-right: 12px;
            flex-shrink: 0;
        }
        
        .contact-text {
            color: rgba(255,255,255,0.9);
            font-size: 10px;
        }
        
        .personal-data {
            background: rgba(255,255,255,0.1);
            padding: 12px;
            border-radius: 6px;
            backdrop-filter: blur(4px);
        }
        
        .personal-item {
            color: rgba(255,255,255,0.9);
            margin-bottom: 8px;
            font-size: 10px;
        }
        
        .personal-label {
            color: #67e8f9;
            font-weight: bold;
        }
        
        .availability-box {
            background: rgba(255,255,255,0.1);
            padding: 12px;
            border-radius: 6px;
            backdrop-filter: blur(4px);
        }
        
        .availability-text {
            color: rgba(255,255,255,0.9);
            font-weight: 500;
            font-size: 10px;
        }
        
        .main-content {
            width: 66.667%;
            padding: 24px;
            background: linear-gradient(135deg, #f9fafb 0%, white 100%);
        }
        
        .content-section {
            margin-bottom: 24px;
        }
        
        .content-title {
            font-size: 16px;
            font-weight: bold;
            color: #374151;
            margin-bottom: 12px;
            padding-bottom: 8px;
            position: relative;
        }
        
        .content-title .title-text {
            color: #0f766e;
            font-weight: 800;
            letter-spacing: 0.5px;
        }
        
        .content-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 48px;
            height: 4px;
            background: linear-gradient(90deg, #0f766e 0%, #0891b2 100%);
            border-radius: 2px;
        }
        
        .content-box {
            background: white;
            padding: 12px;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border-left: 4px solid #0f766e;
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
        
        .content-text {
            font-size: 11px;
            color: #374151;
            line-height: 1.5;
            white-space: pre-line;
        }
        
        .education-title {
            font-weight: bold;
            color: #374151;
            font-size: 12px;
            margin-bottom: 4px;
        }
        
        .education-institution {
            color: #6b7280;
            font-weight: 500;
            font-size: 11px;
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
        <!-- Sidebar -->
        <div class="sidebar">
            <div class="profile-section">
                <div class="profile-avatar"></div>
                <h1 class="profile-name">${data.nome || 'Seu Nome'}</h1>
            </div>

            <div class="sidebar-section">
                <h3 class="sidebar-title">CONTATO</h3>
                ${data.email ? `
                <div class="contact-item">
                    <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #67e8f9;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <span class="contact-text">${data.email}</span>
                </div>
                ` : ''}
                ${data.telefone ? `
                <div class="contact-item">
                    <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #fbbf24;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <span class="contact-text">${data.telefone}</span>
                </div>
                ` : ''}
                ${data.endereco ? `
                <div class="contact-item">
                    <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: #67e8f9;">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <div class="contact-text">
                        <div style="font-weight: 500;">${data.endereco}</div>
                        <div>${data.cidade}, ${data.estado}</div>
                        <div style="color: rgba(255,255,255,0.7);">${data.cep}</div>
                    </div>
                </div>
                ` : ''}
            </div>

            ${(data.cpf || data.rg || data.nascimento) ? `
            <div class="sidebar-section">
                <h3 class="sidebar-title">DADOS PESSOAIS</h3>
                <div class="personal-data">
                    ${data.cpf ? `<div class="personal-item"><span class="personal-label">CPF:</span> ${data.cpf}</div>` : ''}
                    ${data.rg ? `<div class="personal-item"><span class="personal-label">RG:</span> ${data.rg}</div>` : ''}
                    ${data.nascimento ? `<div class="personal-item"><span class="personal-label">Nascimento:</span> ${new Date(data.nascimento).toLocaleDateString('pt-BR')}</div>` : ''}
                </div>
            </div>
            ` : ''}

            ${data.disponibilidade ? `
            <div class="sidebar-section">
                <h3 class="sidebar-title">DISPONIBILIDADE</h3>
                <div class="availability-box">
                    <div class="availability-text">${data.disponibilidade}</div>
                </div>
            </div>
            ` : ''}
        </div>

        <!-- Conteúdo Principal -->
        <div class="main-content">
            ${data.escolaridade ? `
            <div class="content-section">
                <h3 class="content-title">
                    <span class="title-text">EDUCAÇÃO</span>
                </h3>
                <div class="content-box education">
                    <div class="education-title">${data.escolaridade}</div>
                    ${data.instituicao ? `<div class="education-institution">${data.instituicao}</div>` : ''}
                </div>
            </div>
            ` : ''}

            ${data.experiencia ? `
            <div class="content-section">
                <h3 class="content-title">
                    <span class="title-text">EXPERIÊNCIA PROFISSIONAL</span>
                </h3>
                <div class="content-box experience">
                    <div class="content-text">${data.experiencia}</div>
                </div>
            </div>
            ` : ''}

            ${data.cursos ? `
            <div class="content-section">
                <h3 class="content-title">
                    <span class="title-text">CURSOS E CERTIFICAÇÕES</span>
                </h3>
                <div class="content-box courses">
                    <div class="content-text">${data.cursos}</div>
                </div>
            </div>
            ` : ''}
        </div>
    </div>

    <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script>
        window.generatePDF = async function() {
            try {
                console.log('Iniciando geração de PDF...');
                
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const element = document.getElementById('curriculum');
                if (!element) {
                    throw new Error('Elemento curriculum não encontrado');
                }
                
                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff',
                    width: element.scrollWidth,
                    height: element.scrollHeight,
                    logging: false
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
    const htmlContent = generateCurriculumHTML(data);
    
    console.log('✅ HTML gerado, criando DOM virtual...');
    
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
        if (window.html2canvas && window.jspdf && window.jspdf.jsPDF) {
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

    // Aguardar renderização
    await new Promise(resolve => setTimeout(resolve, 2000));

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

    const htmlContent = generateCurriculumHTML(data);
    
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
        if (window.html2canvas && window.jspdf && window.jspdf.jsPDF) {
          resolve();
        } else if (attempts >= maxAttempts) {
          reject(new Error('Timeout ao carregar scripts'));
        } else {
          setTimeout(checkScripts, 100);
        }
      };
      checkScripts();
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    
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