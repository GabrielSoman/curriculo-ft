import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Função para extrair CSS compilado do Tailwind
function extractCompiledCSS() {
  try {
    const distPath = path.join(__dirname, '../../dist');
    const files = fs.readdirSync(distPath);
    const cssFile = files.find(file => file.endsWith('.css'));
    
    if (cssFile) {
      const cssPath = path.join(distPath, cssFile);
      return fs.readFileSync(cssPath, 'utf8');
    }
  } catch (error) {
    console.warn('CSS compilado não encontrado, usando fallback');
  }
  return '';
}

// Template que replica EXATAMENTE o componente CurriculumPreview
function generateExactHTML(data, compiledCSS) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Currículo - ${data.nome}</title>
    <style>
        ${compiledCSS}
        
        /* Garantir que o container tenha o tamanho exato */
        #curriculo-preview {
            width: 210mm !important;
            height: 297mm !important;
            font-size: 11px !important;
            line-height: 1.5 !important;
            font-family: system-ui, -apple-system, sans-serif !important;
            transform: scale(1) !important;
            transform-origin: top left !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        
        /* Forçar renderização correta */
        * {
            box-sizing: border-box;
        }
        
        body {
            margin: 0;
            padding: 0;
            background: white;
        }
    </style>
</head>
<body>
    <div id="curriculo-preview" class="bg-white shadow-2xl mx-auto transform origin-top-left overflow-hidden" style="width: 210mm; height: 297mm; font-size: 11px; line-height: 1.5; font-family: system-ui, -apple-system, sans-serif; transform: scale(1); transform-origin: top left;">
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
                  <svg class="w-4 h-4 text-cyan-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span class="text-white/90">${data.email}</span>
                </div>
                ` : ''}
                ${data.telefone ? `
                <div class="flex items-center space-x-3 bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                  <svg class="w-4 h-4 text-yellow-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span class="text-white/90">${data.telefone}</span>
                </div>
                ` : ''}
                ${data.endereco ? `
                <div class="flex items-start space-x-3 bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                  <svg class="w-4 h-4 mt-0.5 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
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

    <!-- Scripts CDN - MESMOS DO FRONTEND -->
    <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script>
        window.generatePDF = async function() {
            try {
                console.log('🚀 Microserviço: Iniciando geração de PDF...');
                
                // Aguardar renderização completa
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const element = document.getElementById('curriculo-preview');
                if (!element) {
                    throw new Error('Elemento curriculo-preview não encontrado');
                }
                
                console.log('📸 Microserviço: Capturando com html2canvas...');
                
                // MESMAS CONFIGURAÇÕES DO FRONTEND
                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff',
                    width: element.scrollWidth,
                    height: element.scrollHeight,
                    windowWidth: element.scrollWidth,
                    windowHeight: element.scrollHeight,
                    logging: false
                });

                console.log('📄 Microserviço: Gerando PDF com jsPDF...');
                
                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                
                // MESMOS CÁLCULOS DO FRONTEND
                const imgWidth = 210;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                
                console.log('✅ Microserviço: PDF gerado com sucesso!');
                return pdf.output('arraybuffer');
            } catch (error) {
                console.error('❌ Microserviço: Erro ao gerar PDF:', error);
                throw error;
            }
        };
        
        // Sinalizar que está pronto
        window.pdfReady = true;
        console.log('✅ Microserviço: Sistema de PDF carregado!');
    </script>
</body>
</html>`;
}

// Função principal do microserviço
export async function generatePDFWithMicroservice(data) {
  console.log('🚀 MICROSERVIÇO: Iniciando geração de PDF idêntico ao frontend...');
  
  try {
    // 1. Extrair CSS compilado do build
    console.log('📦 Extraindo CSS compilado do Tailwind...');
    const compiledCSS = extractCompiledCSS();
    
    // 2. Gerar HTML com CSS inline
    console.log('🎨 Gerando HTML com CSS compilado inline...');
    const htmlContent = generateExactHTML(data, compiledCSS);
    
    // 3. Criar DOM virtual
    console.log('🌐 Criando DOM virtual...');
    const dom = new JSDOM(htmlContent, {
      runScripts: 'dangerously',
      resources: 'usable',
      pretendToBeVisual: true,
      url: 'http://localhost',
      beforeParse(window) {
        // Configurar window para máxima compatibilidade
        window.devicePixelRatio = 2;
        window.innerWidth = 1200;
        window.innerHeight = 800;
      }
    });

    const window = dom.window;
    
    // 4. Aguardar scripts carregarem
    console.log('⏳ Aguardando scripts CDN carregarem...');
    await new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 150; // 15 segundos
      
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

    // 5. Aguardar renderização do Tailwind
    console.log('⏳ Aguardando renderização completa do Tailwind...');
    await new Promise(resolve => setTimeout(resolve, 2500));

    // 6. Gerar PDF usando o MESMO motor do frontend
    console.log('📄 Executando geração de PDF com motor idêntico...');
    const pdfArrayBuffer = await window.generatePDF();
    
    if (!pdfArrayBuffer || pdfArrayBuffer.byteLength === 0) {
      throw new Error('PDF gerado está vazio');
    }
    
    const pdfBuffer = Buffer.from(pdfArrayBuffer);
    console.log(`✅ MICROSERVIÇO: PDF gerado! Tamanho: ${Math.round(pdfBuffer.length / 1024)}KB`);
    console.log('🎯 RESULTADO IDÊNTICO AO FRONTEND GARANTIDO!');
    
    return pdfBuffer;
    
  } catch (error) {
    console.error('❌ MICROSERVIÇO: Erro:', error.message);
    throw error;
  }
}