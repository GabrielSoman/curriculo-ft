// RENDERIZADOR DE PDF SEM JSDOM
// Usa o próprio frontend para renderizar e retorna via API

import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Função para extrair CSS compilado do build
function getCompiledCSS() {
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

export async function renderPDFViaFrontend(data) {
  console.log('🚀 RENDERIZADOR: Usando frontend para gerar PDF...');
  
  try {
    // Obter CSS compilado
    const compiledCSS = getCompiledCSS();
    console.log('📦 CSS compilado carregado:', compiledCSS ? 'OK' : 'FALLBACK');
    
    // Criar HTML que usa o MESMO componente do frontend
    const frontendHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Currículo - ${data.nome}</title>
    <!-- CSS compilado inline para Puppeteer -->
    <style>
        ${compiledCSS}
        
        /* Forçar renderização correta no Puppeteer */
        body { 
            margin: 0; 
            padding: 0; 
            background: white; 
            font-family: system-ui, -apple-system, sans-serif !important;
        }
        #pdf-container { 
            transform: scale(1); 
            transform-origin: top left;
            width: 210mm;
            height: 297mm;
            overflow: hidden;
        }
        * { 
            box-sizing: border-box; 
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
        }
        
        /* Garantir que gradientes e cores apareçam */
        .bg-gradient-to-br,
        .bg-gradient-to-r {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
        }
    </style>
</head>
<body>
    <div id="pdf-container">
        <!-- Container que será renderizado - FORÇAR ESTILOS INLINE -->
        <div id="curriculo-preview" class="bg-white shadow-2xl mx-auto transform origin-top-left overflow-hidden" style="width: 210mm !important; height: 297mm !important; font-size: 11px !important; line-height: 1.5 !important; font-family: system-ui, -apple-system, sans-serif !important; transform: scale(1) !important; transform-origin: top left !important; display: flex !important;">
          <div class="flex h-full" style="display: flex !important; height: 100% !important; width: 100% !important;">
            <!-- Sidebar -->
            <div class="w-1/3 bg-gradient-to-br from-slate-800 via-teal-800 to-cyan-800 text-white p-6 relative overflow-hidden" style="width: 264px !important; flex-shrink: 0 !important; background: linear-gradient(135deg, #1e293b 0%, #0f766e 50%, #0891b2 100%) !important; color: white !important; padding: 24px !important; position: relative !important; overflow: hidden !important;">
              <!-- Background Pattern -->
              <div class="absolute inset-0 opacity-10" style="position: absolute !important; inset: 0 !important; opacity: 0.1 !important;">
                <div class="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16" style="position: absolute !important; top: 0 !important; left: 0 !important; width: 128px !important; height: 128px !important; background: white !important; border-radius: 50% !important; transform: translate(-64px, -64px) !important;"></div>
                <div class="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12" style="position: absolute !important; bottom: 0 !important; right: 0 !important; width: 96px !important; height: 96px !important; background: white !important; border-radius: 50% !important; transform: translate(48px, 48px) !important;"></div>
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
            <div class="w-2/3 p-6 bg-gradient-to-br from-gray-50 to-white" style="width: 530px !important; flex-shrink: 0 !important; padding: 24px !important; background: linear-gradient(135deg, #f9fafb 0%, white 100%) !important;">
              <div class="space-y-6">
                ${data.escolaridade ? `
                <div>
                  <h3 class="text-lg font-bold text-gray-800 mb-3 pb-2 relative" style="font-size: 18px !important; font-weight: bold !important; color: #374151 !important; margin-bottom: 12px !important; padding-bottom: 8px !important; position: relative !important;">
                    <span class="text-teal-800 font-extrabold tracking-wide" style="color: #0f766e !important; font-weight: 800 !important; letter-spacing: 0.5px !important;">EDUCAÇÃO</span>
                    <div class="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-teal-800 to-cyan-600 rounded-full" style="position: absolute !important; bottom: 0 !important; left: 0 !important; width: 48px !important; height: 4px !important; background: linear-gradient(90deg, #0f766e 0%, #0891b2 100%) !important; border-radius: 2px !important;"></div>
                  </h3>
                  <div class="bg-white p-3 rounded-lg shadow-sm border-l-4 border-teal-800" style="background: white !important; padding: 12px !important; border-radius: 8px !important; box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important; border-left: 4px solid #0f766e !important;">
                    <div class="font-bold text-gray-800 text-sm" style="font-weight: bold !important; color: #374151 !important; font-size: 12px !important; margin-bottom: 4px !important;">${data.escolaridade}</div>
                    ${data.instituicao ? `<div class="text-gray-600 mt-1 font-medium" style="color: #6b7280 !important; font-weight: 500 !important; font-size: 11px !important;">${data.instituicao}</div>` : ''}
                  </div>
                </div>
                ` : ''}

                ${data.experiencia ? `
                <div>
                  <h3 class="text-lg font-bold text-gray-800 mb-3 pb-2 relative" style="font-size: 18px !important; font-weight: bold !important; color: #374151 !important; margin-bottom: 12px !important; padding-bottom: 8px !important; position: relative !important;">
                    <span class="text-teal-800 font-extrabold tracking-wide" style="color: #0f766e !important; font-weight: 800 !important; letter-spacing: 0.5px !important;">EXPERIÊNCIA PROFISSIONAL</span>
                    <div class="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-teal-800 to-cyan-600 rounded-full" style="position: absolute !important; bottom: 0 !important; left: 0 !important; width: 48px !important; height: 4px !important; background: linear-gradient(90deg, #0f766e 0%, #0891b2 100%) !important; border-radius: 2px !important;"></div>
                  </h3>
                  <div class="bg-white p-3 rounded-lg shadow-sm border-l-4 border-cyan-600" style="background: white !important; padding: 12px !important; border-radius: 8px !important; box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important; border-left: 4px solid #0891b2 !important;">
                    <div class="text-sm whitespace-pre-line text-gray-700 leading-relaxed" style="font-size: 11px !important; color: #374151 !important; line-height: 1.6 !important; white-space: pre-line !important; word-wrap: break-word !important;">${data.experiencia}</div>
                  </div>
                </div>
                ` : ''}

                ${data.cursos ? `
                <div>
                  <h3 class="text-lg font-bold text-gray-800 mb-3 pb-2 relative" style="font-size: 18px !important; font-weight: bold !important; color: #374151 !important; margin-bottom: 12px !important; padding-bottom: 8px !important; position: relative !important;">
                    <span class="text-teal-800 font-extrabold tracking-wide" style="color: #0f766e !important; font-weight: 800 !important; letter-spacing: 0.5px !important;">CURSOS E CERTIFICAÇÕES</span>
                    <div class="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-teal-800 to-cyan-600 rounded-full" style="position: absolute !important; bottom: 0 !important; left: 0 !important; width: 48px !important; height: 4px !important; background: linear-gradient(90deg, #0f766e 0%, #0891b2 100%) !important; border-radius: 2px !important;"></div>
                  </h3>
                  <div class="bg-white p-3 rounded-lg shadow-sm border-l-4 border-blue-500" style="background: white !important; padding: 12px !important; border-radius: 8px !important; box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important; border-left: 4px solid #3b82f6 !important;">
                    <div class="text-sm whitespace-pre-line text-gray-700 leading-relaxed" style="font-size: 11px !important; color: #374151 !important; line-height: 1.6 !important; white-space: pre-line !important; word-wrap: break-word !important;">${data.cursos}</div>
                  </div>
                </div>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
    </div>

    <!-- Scripts do frontend -->
    <script src="/assets/index.es-8302797b.js"></script>
    <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    
    <script>
        // Função para gerar PDF usando o mesmo motor do frontend
        window.generatePDFFromAPI = async function() {
            try {
                console.log('🚀 Gerando PDF via frontend...');
                
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                const element = document.getElementById('curriculo-preview');
                if (!element) {
                    throw new Error('Elemento não encontrado');
                }
                
                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff',
                    width: element.scrollWidth,
                    height: element.scrollHeight,
                    windowWidth: element.scrollWidth,
                    windowHeight: element.scrollHeight
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
        
        // Sinalizar que está pronto
        window.pdfAPIReady = true;
    </script>
</body>
</html>`;

    return frontendHTML;
    
  } catch (error) {
    console.error('❌ RENDERIZADOR: Erro:', error);
    throw error;
  }
}