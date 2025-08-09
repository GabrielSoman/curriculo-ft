// MOTOR HÍBRIDO - CSS COMPILADO + ESTILOS CRÍTICOS INLINE
// Garante sincronização com frontend E renderização perfeita no Puppeteer

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Extrair CSS compilado do build
function getCompiledCSS() {
  try {
    const distPath = path.join(__dirname, '../../dist');
    const files = fs.readdirSync(distPath);
    const cssFile = files.find(file => file.endsWith('.css'));
    
    if (cssFile) {
      const cssPath = path.join(distPath, cssFile);
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      console.log('✅ CSS compilado extraído:', cssFile, `(${Math.round(cssContent.length / 1024)}KB)`);
      return cssContent;
    }
  } catch (error) {
    console.warn('⚠️ CSS compilado não encontrado:', error.message);
  }
  return '';
}

// Gerar HTML híbrido - CSS compilado + estilos críticos inline
export function generateHybridHTML(data) {
  const compiledCSS = getCompiledCSS();
  
  console.log('🔄 Gerando HTML híbrido - CSS compilado + estilos críticos...');
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Currículo - ${data.nome}</title>
    <style>
        /* CSS COMPILADO DO FRONTEND */
        ${compiledCSS}
        
        /* ESTILOS CRÍTICOS INLINE - GARANTEM RENDERIZAÇÃO */
        * {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
        }
        
        body { 
            margin: 0 !important; 
            padding: 0 !important; 
            background: white !important; 
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        
        /* CONTAINER PRINCIPAL - FORÇADO */
        #curriculo-preview {
            width: 210mm !important;
            height: 297mm !important;
            font-size: 11px !important;
            line-height: 1.5 !important;
            background: white !important;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
            margin: 0 auto !important;
            overflow: hidden !important;
            transform: scale(1) !important;
            transform-origin: top left !important;
        }
        
        /* LAYOUT FLEX - CRÍTICO */
        .curriculum-flex {
            display: flex !important;
            height: 100% !important;
        }
        
        /* SIDEBAR - FORÇADA */
        .sidebar-forced {
            width: 33.333333% !important;
            background: linear-gradient(135deg, #1e293b 0%, #0f766e 50%, #0891b2 100%) !important;
            color: white !important;
            padding: 24px !important;
            position: relative !important;
            overflow: hidden !important;
        }
        
        /* PADRÕES DE FUNDO */
        .sidebar-forced::before {
            content: '' !important;
            position: absolute !important;
            top: -64px !important;
            left: -64px !important;
            width: 128px !important;
            height: 128px !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border-radius: 50% !important;
        }
        
        .sidebar-forced::after {
            content: '' !important;
            position: absolute !important;
            bottom: -48px !important;
            right: -48px !important;
            width: 96px !important;
            height: 96px !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border-radius: 50% !important;
        }
        
        /* AVATAR GEOMÉTRICO - FORÇADO */
        .avatar-forced {
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
        
        /* PADRÕES GEOMÉTRICOS */
        .pattern-1 { position: absolute !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; background: rgba(251, 191, 36, 0.4) !important; border-radius: 50% !important; }
        .pattern-2 { position: absolute !important; top: 8px !important; left: 8px !important; width: 48px !important; height: 48px !important; background: rgba(251, 191, 36, 0.3) !important; border-radius: 50% !important; }
        .pattern-3 { position: absolute !important; top: 16px !important; left: 16px !important; width: 32px !important; height: 32px !important; background: rgba(251, 191, 36, 0.5) !important; border-radius: 50% !important; }
        .pattern-4 { position: absolute !important; top: 24px !important; left: 24px !important; width: 16px !important; height: 16px !important; background: rgba(251, 191, 36, 0.7) !important; border-radius: 50% !important; }
        .pattern-5 { position: absolute !important; top: 4px !important; right: 4px !important; width: 12px !important; height: 12px !important; background: rgba(251, 191, 36, 0.6) !important; border-radius: 2px !important; transform: rotate(45deg) !important; }
        .pattern-6 { position: absolute !important; bottom: 4px !important; left: 4px !important; width: 12px !important; height: 12px !important; background: rgba(251, 191, 36, 0.6) !important; border-radius: 2px !important; transform: rotate(45deg) !important; }
        .pattern-7 { position: absolute !important; bottom: 4px !important; right: 4px !important; width: 8px !important; height: 8px !important; background: rgba(251, 191, 36, 0.8) !important; border-radius: 50% !important; }
        
        /* NOME */
        .name-forced {
            font-size: 20px !important;
            font-weight: bold !important;
            margin-bottom: 8px !important;
            letter-spacing: 0.5px !important;
            color: white !important;
            text-align: center !important;
        }
        
        /* TÍTULOS DA SIDEBAR */
        .sidebar-title-forced {
            font-size: 10px !important;
            font-weight: bold !important;
            margin-bottom: 12px !important;
            border-bottom: 2px solid rgba(255, 255, 255, 0.4) !important;
            padding-bottom: 8px !important;
            letter-spacing: 1.5px !important;
            color: white !important;
        }
        
        /* ITEMS DE CONTATO - FORÇADOS */
        .contact-item-forced {
            display: flex !important;
            align-items: flex-start !important;
            margin-bottom: 12px !important;
            background: rgba(255, 255, 255, 0.1) !important;
            padding: 8px !important;
            border-radius: 8px !important;
            backdrop-filter: blur(4px) !important;
        }
        
        .contact-icon-forced {
            width: 16px !important;
            height: 16px !important;
            margin-right: 12px !important;
            flex-shrink: 0 !important;
            margin-top: 2px !important;
        }
        
        .contact-text-forced {
            color: rgba(255, 255, 255, 0.9) !important;
            font-size: 10px !important;
            flex: 1 !important;
        }
        
        /* CORES DOS ÍCONES - EXATAS */
        .icon-email-forced { stroke: #67e8f9 !important; fill: none !important; }
        .icon-phone-forced { stroke: #fde047 !important; fill: none !important; }
        .icon-location-forced { stroke: #67e8f9 !important; fill: none !important; }
        
        /* DADOS PESSOAIS */
        .personal-data-forced {
            background: rgba(255, 255, 255, 0.1) !important;
            padding: 12px !important;
            border-radius: 8px !important;
            backdrop-filter: blur(4px) !important;
            font-size: 10px !important;
            color: rgba(255, 255, 255, 0.9) !important;
        }
        
        .personal-label-forced {
            color: #67e8f9 !important;
            font-weight: bold !important;
        }
        
        /* DISPONIBILIDADE */
        .availability-forced {
            background: rgba(255, 255, 255, 0.1) !important;
            padding: 12px !important;
            border-radius: 8px !important;
            backdrop-filter: blur(4px) !important;
            font-size: 10px !important;
            color: rgba(255, 255, 255, 0.9) !important;
            font-weight: 500 !important;
        }
        
        /* CONTEÚDO PRINCIPAL - FORÇADO */
        .main-content-forced {
            width: 66.666667% !important;
            padding: 24px !important;
            background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%) !important;
        }
        
        /* TÍTULOS DAS SEÇÕES */
        .content-title-forced {
            font-size: 18px !important;
            font-weight: bold !important;
            color: #374151 !important;
            margin-bottom: 12px !important;
            padding-bottom: 8px !important;
            position: relative !important;
        }
        
        .title-text-forced {
            color: #0f766e !important;
            font-weight: 800 !important;
            letter-spacing: 0.5px !important;
        }
        
        .content-title-forced::after {
            content: '' !important;
            position: absolute !important;
            bottom: 0 !important;
            left: 0 !important;
            width: 48px !important;
            height: 4px !important;
            background: linear-gradient(90deg, #0f766e 0%, #0891b2 100%) !important;
            border-radius: 2px !important;
        }
        
        /* CAIXAS DE CONTEÚDO */
        .content-box-forced {
            background: white !important;
            padding: 12px !important;
            border-radius: 8px !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
            border-left: 4px solid #0f766e !important;
            margin-bottom: 24px !important;
        }
        
        .content-box-experience { border-left-color: #0891b2 !important; }
        .content-box-courses { border-left-color: #3b82f6 !important; }
        
        /* TEXTOS */
        .content-text-forced {
            font-size: 11px !important;
            color: #374151 !important;
            line-height: 1.6 !important;
            white-space: pre-line !important;
        }
        
        .education-title-forced {
            font-weight: bold !important;
            color: #374151 !important;
            font-size: 12px !important;
            margin-bottom: 4px !important;
        }
        
        .education-institution-forced {
            color: #6b7280 !important;
            font-weight: 500 !important;
            font-size: 11px !important;
        }
        
        /* ESPAÇAMENTOS */
        .space-y-6-forced > * + * { margin-top: 24px !important; }
        .space-y-3-forced > * + * { margin-top: 12px !important; }
        .space-y-2-forced > * + * { margin-top: 8px !important; }
    </style>
</head>
<body>
    <!-- HTML HÍBRIDO - CLASSES TAILWIND + CLASSES FORÇADAS -->
    <div id="curriculo-preview" class="bg-white shadow-2xl mx-auto transform origin-top-left overflow-hidden">
      <div class="curriculum-flex flex h-full">
        <!-- Sidebar -->
        <div class="sidebar-forced w-1/3 bg-gradient-to-br from-slate-800 via-teal-800 to-cyan-800 text-white p-6 relative overflow-hidden">
          <div class="text-center mb-6 relative z-10">
            <!-- Avatar geométrico -->
            <div class="avatar-forced w-24 h-24 bg-gradient-to-br from-yellow-400/30 to-white/10 rounded-full mx-auto mb-3 flex items-center justify-center backdrop-blur-sm border-2 border-white/40 relative overflow-hidden">
              <div class="w-16 h-16 relative">
                <div class="pattern-1"></div>
                <div class="pattern-2"></div>
                <div class="pattern-3"></div>
                <div class="pattern-4"></div>
                <div class="pattern-5"></div>
                <div class="pattern-6"></div>
                <div class="pattern-7"></div>
              </div>
            </div>
            <h1 class="name-forced text-xl font-bold mb-2 tracking-wide">${data.nome || 'Seu Nome'}</h1>
          </div>

          <div class="space-y-6-forced space-y-6 relative z-10">
            <div>
              <h3 class="sidebar-title-forced text-xs font-bold mb-3 border-b-2 border-white/40 pb-2 tracking-widest">CONTATO</h3>
              <div class="space-y-3-forced space-y-3 text-xs">
                ${data.email ? `
                <div class="contact-item-forced flex items-center space-x-3 bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                  <svg class="contact-icon-forced icon-email-forced w-4 h-4 text-cyan-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span class="contact-text-forced text-white/90">${data.email}</span>
                </div>
                ` : ''}
                ${data.telefone ? `
                <div class="contact-item-forced flex items-center space-x-3 bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                  <svg class="contact-icon-forced icon-phone-forced w-4 h-4 text-yellow-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span class="contact-text-forced text-white/90">${data.telefone}</span>
                </div>
                ` : ''}
                ${data.endereco ? `
                <div class="contact-item-forced flex items-start space-x-3 bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                  <svg class="contact-icon-forced icon-location-forced w-4 h-4 mt-0.5 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <div class="contact-text-forced text-white/90">
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
              <h3 class="sidebar-title-forced text-xs font-bold mb-3 border-b-2 border-white/40 pb-2 tracking-widest">DADOS PESSOAIS</h3>
              <div class="personal-data-forced space-y-2 text-xs bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                ${data.cpf ? `<div class="text-white/90"><span class="personal-label-forced">CPF:</span> ${data.cpf}</div>` : ''}
                ${data.rg ? `<div class="text-white/90"><span class="personal-label-forced">RG:</span> ${data.rg}</div>` : ''}
                ${data.nascimento ? `<div class="text-white/90"><span class="personal-label-forced">Nascimento:</span> ${new Date(data.nascimento).toLocaleDateString('pt-BR')}</div>` : ''}
              </div>
            </div>
            ` : ''}

            ${data.disponibilidade ? `
            <div>
              <h3 class="sidebar-title-forced text-xs font-bold mb-3 border-b-2 border-white/40 pb-2 tracking-widest">DISPONIBILIDADE</h3>
              <div class="availability-forced text-xs bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                ${data.disponibilidade}
              </div>
            </div>
            ` : ''}
          </div>
        </div>

        <!-- Conteúdo Principal -->
        <div class="main-content-forced w-2/3 p-6 bg-gradient-to-br from-gray-50 to-white">
          <div class="space-y-6-forced space-y-6">
            ${data.escolaridade ? `
            <div>
              <h3 class="content-title-forced text-lg font-bold text-gray-800 mb-3 pb-2 relative">
                <span class="title-text-forced text-teal-800 font-extrabold tracking-wide">EDUCAÇÃO</span>
              </h3>
              <div class="content-box-forced bg-white p-3 rounded-lg shadow-sm border-l-4 border-teal-800">
                <div class="education-title-forced font-bold text-gray-800 text-sm">${data.escolaridade}</div>
                ${data.instituicao ? `<div class="education-institution-forced text-gray-600 mt-1 font-medium">${data.instituicao}</div>` : ''}
              </div>
            </div>
            ` : ''}

            ${data.experiencia ? `
            <div>
              <h3 class="content-title-forced text-lg font-bold text-gray-800 mb-3 pb-2 relative">
                <span class="title-text-forced text-teal-800 font-extrabold tracking-wide">EXPERIÊNCIA PROFISSIONAL</span>
              </h3>
              <div class="content-box-forced content-box-experience bg-white p-3 rounded-lg shadow-sm border-l-4 border-cyan-600">
                <div class="content-text-forced text-sm whitespace-pre-line text-gray-700 leading-relaxed">${data.experiencia}</div>
              </div>
            </div>
            ` : ''}

            ${data.cursos ? `
            <div>
              <h3 class="content-title-forced text-lg font-bold text-gray-800 mb-3 pb-2 relative">
                <span class="title-text-forced text-teal-800 font-extrabold tracking-wide">CURSOS E CERTIFICAÇÕES</span>
              </h3>
              <div class="content-box-forced content-box-courses bg-white p-3 rounded-lg shadow-sm border-l-4 border-blue-500">
                <div class="content-text-forced text-sm whitespace-pre-line text-gray-700 leading-relaxed">${data.cursos}</div>
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