// SINCRONIZADOR FRONTEND-BACKEND
// Extrai e replica EXATAMENTE o componente CurriculumPreview.tsx

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Função para extrair CSS compilado
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
    console.warn('CSS compilado não encontrado');
  }
  return '';
}

// Função para extrair o componente React e converter para HTML
export function generateSyncedHTML(data) {
  const compiledCSS = getCompiledCSS();
  
  // HTML que REPLICA EXATAMENTE o CurriculumPreview.tsx
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Currículo - ${data.nome}</title>
    <style>
        ${compiledCSS}
        
        /* FORÇAR RENDERIZAÇÃO IDÊNTICA AO FRONTEND */
        * {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
        }
        
        body { 
            margin: 0 !important; 
            padding: 0 !important; 
            background: white !important; 
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
        }
        
        /* CONTAINER PRINCIPAL - EXATO COMO FRONTEND */
        #curriculo-preview {
            width: 210mm !important;
            height: 297mm !important;
            font-size: 11px !important;
            line-height: 1.5 !important;
            font-family: system-ui, -apple-system, sans-serif !important;
            transform: scale(1) !important;
            transform-origin: top left !important;
        }
        
        /* GARANTIR GRADIENTES E CORES */
        .bg-gradient-to-br {
            background: linear-gradient(135deg, var(--tw-gradient-stops)) !important;
        }
        
        .from-slate-800 { --tw-gradient-from: #1e293b !important; }
        .via-teal-800 { --tw-gradient-via: #0f766e !important; }
        .to-cyan-800 { --tw-gradient-to: #0891b2 !important; }
        .from-gray-50 { --tw-gradient-from: #f9fafb !important; }
        .to-white { --tw-gradient-to: #ffffff !important; }
        .from-yellow-400\/30 { --tw-gradient-from: rgba(251, 191, 36, 0.3) !important; }
        .to-white\/10 { --tw-gradient-to: rgba(255, 255, 255, 0.1) !important; }
        
        /* AVATAR GEOMÉTRICO - CRÍTICO! */
        .profile-avatar {
            width: 96px !important;
            height: 96px !important;
            background: linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%) !important;
            border-radius: 50% !important;
            margin: 0 auto 12px !important;
            border: 2px solid rgba(255, 255, 255, 0.4) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            position: relative !important;
            overflow: hidden !important;
            backdrop-filter: blur(4px) !important;
        }
        
        /* PADRÃO GEOMÉTRICO INTERNO - EXATO DO FRONTEND */
        .avatar-pattern { 
            width: 64px !important; 
            height: 64px !important; 
            position: relative !important; 
        }
        .pattern-circle-1 { 
            position: absolute !important; 
            top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
            background: rgba(251, 191, 36, 0.4) !important; 
            border-radius: 50% !important; 
        }
        .pattern-circle-2 { 
            position: absolute !important; 
            top: 8px !important; left: 8px !important; 
            width: 48px !important; height: 48px !important; 
            background: rgba(251, 191, 36, 0.3) !important; 
            border-radius: 50% !important; 
        }
        .pattern-circle-3 { 
            position: absolute !important; 
            top: 16px !important; left: 16px !important; 
            width: 32px !important; height: 32px !important; 
            background: rgba(251, 191, 36, 0.5) !important; 
            border-radius: 50% !important; 
        }
        .pattern-circle-4 { 
            position: absolute !important; 
            top: 24px !important; left: 24px !important; 
            width: 16px !important; height: 16px !important; 
            background: rgba(251, 191, 36, 0.7) !important; 
            border-radius: 50% !important; 
        }
        .pattern-square-1 { 
            position: absolute !important; 
            top: 4px !important; right: 4px !important; 
            width: 12px !important; height: 12px !important; 
            background: rgba(251, 191, 36, 0.6) !important; 
            border-radius: 2px !important; 
            transform: rotate(45deg) !important; 
        }
        .pattern-square-2 { 
            position: absolute !important; 
            bottom: 4px !important; left: 4px !important; 
            width: 12px !important; height: 12px !important; 
            background: rgba(251, 191, 36, 0.6) !important; 
            border-radius: 2px !important; 
            transform: rotate(45deg) !important; 
        }
        .pattern-dot { 
            position: absolute !important; 
            bottom: 4px !important; right: 4px !important; 
            width: 8px !important; height: 8px !important; 
            background: rgba(251, 191, 36, 0.8) !important; 
            border-radius: 50% !important; 
        }
    </style>
</head>
<body>
    <!-- REPLICA EXATA DO CurriculumPreview.tsx -->
    <div id="curriculo-preview" class="bg-white shadow-2xl mx-auto transform origin-top-left overflow-hidden">
      <div class="flex h-full">
        <!-- Sidebar -->
        <div class="w-1/3 bg-gradient-to-br from-slate-800 via-teal-800 to-cyan-800 text-white p-6 relative overflow-hidden">
          <!-- Background Pattern -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            <div class="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
          </div>
          
          <div class="text-center mb-6">
            <!-- AVATAR GEOMÉTRICO - CRÍTICO! -->
            <div class="profile-avatar">
              <div class="avatar-pattern">
                <div class="pattern-circle-1"></div>
                <div class="pattern-circle-2"></div>
                <div class="pattern-circle-3"></div>
                <div class="pattern-circle-4"></div>
                <div class="pattern-square-1"></div>
                <div class="pattern-square-2"></div>
                <div class="pattern-dot"></div>
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
</body>
</html>`;
}