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
        
        /* SINCRONIZAÇÃO PERFEITA COM FRONTEND */
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
            background: white !important;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
            margin: 0 auto !important;
            overflow: hidden !important;
        }
        
        /* LAYOUT FLEX - CRÍTICO! */
        .curriculum-flex {
            display: flex !important;
            height: 100% !important;
        }
        
        /* SIDEBAR - 1/3 DA LARGURA */
        .sidebar {
            width: 33.333333% !important;
            background: linear-gradient(135deg, #1e293b 0%, #0f766e 50%, #0891b2 100%) !important;
            color: white !important;
            padding: 24px !important;
            position: relative !important;
            overflow: hidden !important;
        }
        
        /* PADRÕES DE FUNDO DA SIDEBAR */
        .sidebar::before {
            content: '' !important;
            position: absolute !important;
            top: -64px !important;
            left: -64px !important;
            width: 128px !important;
            height: 128px !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border-radius: 50% !important;
        }
        
        .sidebar::after {
            content: '' !important;
            position: absolute !important;
            bottom: -48px !important;
            right: -48px !important;
            width: 96px !important;
            height: 96px !important;
            background: rgba(255, 255, 255, 0.1) !important;
            border-radius: 50% !important;
        }
        
        /* SEÇÃO DO PERFIL */
        .profile-section {
            text-align: center !important;
            margin-bottom: 24px !important;
            position: relative !important;
            z-index: 2 !important;
        }
        
        /* AVATAR GEOMÉTRICO - EXATO DO FRONTEND */
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
        
        /* PADRÃO GEOMÉTRICO INTERNO - EXATO */
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
        
        /* NOME */
        .profile-name {
            font-size: 20px !important;
            font-weight: bold !important;
            margin-bottom: 8px !important;
            letter-spacing: 0.5px !important;
            word-wrap: break-word !important;
            color: white !important;
        }
        
        /* SEÇÕES DA SIDEBAR */
        .sidebar-section {
            margin-bottom: 24px !important;
            position: relative !important;
            z-index: 2 !important;
        }
        
        .sidebar-title {
            font-size: 10px !important;
            font-weight: bold !important;
            margin-bottom: 12px !important;
            border-bottom: 2px solid rgba(255, 255, 255, 0.4) !important;
            padding-bottom: 8px !important;
            letter-spacing: 1.5px !important;
            color: white !important;
        }
        
        /* ITEMS DE CONTATO - EXATOS DO FRONTEND */
        .contact-item {
            display: flex !important;
            align-items: flex-start !important;
            margin-bottom: 12px !important;
            background: rgba(255, 255, 255, 0.1) !important;
            padding: 8px !important;
            border-radius: 8px !important;
            backdrop-filter: blur(4px) !important;
        }
        
        .contact-icon {
            width: 16px !important;
            height: 16px !important;
            margin-right: 12px !important;
            flex-shrink: 0 !important;
            margin-top: 2px !important;
        }
        
        .contact-text {
            color: rgba(255, 255, 255, 0.9) !important;
            font-size: 10px !important;
            word-wrap: break-word !important;
            flex: 1 !important;
        }
        
        .contact-address {
            color: rgba(255, 255, 255, 0.9) !important;
            font-size: 10px !important;
        }
        
        .address-main {
            font-weight: 500 !important;
        }
        
        .address-secondary {
            color: rgba(255, 255, 255, 0.7) !important;
        }
        
        /* DADOS PESSOAIS */
        .personal-data {
            background: rgba(255, 255, 255, 0.1) !important;
            padding: 12px !important;
            border-radius: 8px !important;
            backdrop-filter: blur(4px) !important;
        }
        
        .personal-item {
            color: rgba(255, 255, 255, 0.9) !important;
            margin-bottom: 8px !important;
            font-size: 10px !important;
        }
        
        .personal-label {
            color: #67e8f9 !important;
            font-weight: bold !important;
        }
        
        /* DISPONIBILIDADE */
        .availability-box {
            background: rgba(255, 255, 255, 0.1) !important;
            padding: 12px !important;
            border-radius: 8px !important;
            backdrop-filter: blur(4px) !important;
        }
        
        .availability-text {
            color: rgba(255, 255, 255, 0.9) !important;
            font-weight: 500 !important;
            font-size: 10px !important;
        }
        
        /* CONTEÚDO PRINCIPAL - 2/3 DA LARGURA */
        .main-content {
            width: 66.666667% !important;
            padding: 24px !important;
            background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%) !important;
        }
        
        .content-section {
            margin-bottom: 24px !important;
        }
        
        /* TÍTULOS DAS SEÇÕES */
        .content-title {
            font-size: 18px !important;
            font-weight: bold !important;
            color: #374151 !important;
            margin-bottom: 12px !important;
            padding-bottom: 8px !important;
            position: relative !important;
        }
        
        .title-text {
            color: #0f766e !important;
            font-weight: 800 !important;
            letter-spacing: 0.5px !important;
        }
        
        .content-title::after {
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
        .content-box {
            background: white !important;
            padding: 12px !important;
            border-radius: 8px !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
            border-left: 4px solid #0f766e !important;
        }
        
        .content-box.education {
            border-left-color: #0f766e !important;
        }
        
        .content-box.experience {
            border-left-color: #0891b2 !important;
        }
        
        .content-box.courses {
            border-left-color: #3b82f6 !important;
        }
        
        /* TEXTOS */
        .content-text {
            font-size: 11px !important;
            color: #374151 !important;
            line-height: 1.6 !important;
            white-space: pre-line !important;
            word-wrap: break-word !important;
        }
        
        .education-title {
            font-weight: bold !important;
            color: #374151 !important;
            font-size: 12px !important;
            margin-bottom: 4px !important;
        }
        
        .education-institution {
            color: #6b7280 !important;
            font-weight: 500 !important;
            font-size: 11px !important;
        }

        /* CORES DOS ÍCONES - EXATAS DO FRONTEND */
        .icon-email { 
            stroke: #67e8f9 !important; 
            fill: none !important;
        }
        .icon-phone { 
            stroke: #fde047 !important; 
            fill: none !important;
        }
        .icon-location { 
            stroke: #67e8f9 !important; 
            fill: none !important;
        }
        
        /* ESPAÇAMENTOS - EXATOS */
        .space-y-6 > * + * {
            margin-top: 24px !important;
        }
        
        .space-y-3 > * + * {
            margin-top: 12px !important;
        }
        
        .space-y-2 > * + * {
            margin-top: 8px !important;
        }
    </style>
</head>
<body>
    <!-- REPLICA EXATA DO CurriculumPreview.tsx -->
    <div id="curriculo-preview">
      <div class="curriculum-flex">
        <!-- Sidebar -->
        <div class="sidebar">
          <div class="profile-section">
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
            <h1 class="profile-name">${data.nome || 'Seu Nome'}</h1>
          </div>

          <div class="space-y-6">
            <div class="sidebar-section">
              <h3 class="sidebar-title">CONTATO</h3>
              <div class="space-y-3">
                ${data.email ? `
                <div class="contact-item">
                  <svg class="contact-icon icon-email" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span class="contact-text">${data.email}</span>
                </div>
                ` : ''}
                ${data.telefone ? `
                <div class="contact-item">
                  <svg class="contact-icon icon-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span class="contact-text">${data.telefone}</span>
                </div>
                ` : ''}
                ${data.endereco ? `
                <div class="contact-item">
                  <svg class="contact-icon icon-location" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <div class="contact-address">
                    <div class="address-main">${data.endereco}</div>
                    <div>${data.cidade}, ${data.estado}</div>
                    <div class="address-secondary">${data.cep}</div>
                  </div>
                </div>
                ` : ''}
              </div>
            </div>

            ${(data.cpf || data.rg || data.nascimento) ? `
            <div class="sidebar-section">
              <h3 class="sidebar-title">DADOS PESSOAIS</h3>
              <div class="personal-data">
                <div class="space-y-2">
                  ${data.cpf ? `<div class="personal-item"><span class="personal-label">CPF:</span> ${data.cpf}</div>` : ''}
                  ${data.rg ? `<div class="personal-item"><span class="personal-label">RG:</span> ${data.rg}</div>` : ''}
                  ${data.nascimento ? `<div class="personal-item"><span class="personal-label">Nascimento:</span> ${new Date(data.nascimento).toLocaleDateString('pt-BR')}</div>` : ''}
                </div>
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
        </div>

        <!-- Conteúdo Principal -->
        <div class="main-content">
          <div class="space-y-6">
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
      </div>
    </div>
</body>
</html>`;
}