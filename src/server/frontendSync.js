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
        
        /* FORÇAR LAYOUT FLEX - CRÍTICO! */
        .flex {
            display: flex !important;
        }
        
        .h-full {
            height: 100% !important;
        }
        
        .w-1\\/3 {
            width: 33.333333% !important;
            flex: none !important;
        }
        
        .w-2\\/3 {
            width: 66.666667% !important;
            flex: none !important;
        }
        
        /* SIDEBAR - FORÇAR ESTILO COMPLETO */
        .bg-gradient-to-br.from-slate-800.via-teal-800.to-cyan-800 {
            background: linear-gradient(135deg, #1e293b 0%, #0f766e 50%, #0891b2 100%) !important;
        }
        
        .text-white {
            color: white !important;
        }
        
        .p-6 {
            padding: 1.5rem !important;
        }
        
        .relative {
            position: relative !important;
        }
        
        .overflow-hidden {
            overflow: hidden !important;
        }
        
        /* MAIN CONTENT - FORÇAR ESTILO */
        .bg-gradient-to-br.from-gray-50.to-white {
            background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%) !important;
        }
        
        /* ESPAÇAMENTOS */
        .space-y-6 > * + * {
            margin-top: 1.5rem !important;
        }
        
        .space-y-3 > * + * {
            margin-top: 0.75rem !important;
        }
        
        .mb-6 {
            margin-bottom: 1.5rem !important;
        }
        
        .mb-3 {
            margin-bottom: 0.75rem !important;
        }
        
        .mb-2 {
            margin-bottom: 0.5rem !important;
        }
        
        /* TEXTOS */
        .text-xl {
            font-size: 1.25rem !important;
            line-height: 1.75rem !important;
        }
        
        .text-lg {
            font-size: 1.125rem !important;
            line-height: 1.75rem !important;
        }
        
        .text-sm {
            font-size: 0.875rem !important;
            line-height: 1.25rem !important;
        }
        
        .text-xs {
            font-size: 0.75rem !important;
            line-height: 1rem !important;
        }
        
        .font-bold {
            font-weight: 700 !important;
        }
        
        .font-extrabold {
            font-weight: 800 !important;
        }
        
        .font-medium {
            font-weight: 500 !important;
        }
        
        /* CORES DE TEXTO */
        .text-gray-800 {
            color: #1f2937 !important;
        }
        
        .text-gray-700 {
            color: #374151 !important;
        }
        
        .text-gray-600 {
            color: #4b5563 !important;
        }
        
        .text-teal-800 {
            color: #0f766e !important;
        }
        
        .text-cyan-200 {
            color: #a5f3fc !important;
        }
        
        .text-yellow-300 {
            color: #fde047 !important;
        }
        
        .text-cyan-300 {
            color: #67e8f9 !important;
        }
        
        /* BACKGROUNDS */
        .bg-white {
            background-color: white !important;
        }
        
        .bg-white\\/10 {
            background-color: rgba(255, 255, 255, 0.1) !important;
        }
        
        /* BORDAS E CANTOS */
        .rounded-lg {
            border-radius: 0.5rem !important;
        }
        
        .rounded-full {
            border-radius: 9999px !important;
        }
        
        .border-l-4 {
            border-left-width: 4px !important;
        }
        
        .border-teal-800 {
            border-color: #0f766e !important;
        }
        
        .border-cyan-600 {
            border-color: #0891b2 !important;
        }
        
        .border-blue-500 {
            border-color: #3b82f6 !important;
        }
        
        /* SOMBRAS */
        .shadow-sm {
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
        }
        
        .shadow-2xl {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        }
        
        /* POSICIONAMENTO */
        .absolute {
            position: absolute !important;
        }
        
        .inset-0 {
            top: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
        }
        
        .z-10 {
            z-index: 10 !important;
        }
        
        /* FLEXBOX */
        .flex {
            display: flex !important;
        }
        
        .items-center {
            align-items: center !important;
        }
        
        .items-start {
            align-items: flex-start !important;
        }
        
        .justify-center {
            justify-content: center !important;
        }
        
        .text-center {
            text-align: center !important;
        }
        
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