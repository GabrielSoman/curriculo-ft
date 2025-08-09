// RENDERIZADOR QUE USA O PRÓPRIO FRONTEND
// Em vez de recriar, serve uma página que usa o sistema existente

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function renderPDFViaFrontend(data) {
  console.log('🚀 MOTOR UNIFICADO: Gerando HTML com CSS puro inline...');
  
  try {
    const distPath = path.join(__dirname, '../../dist');
    
              document.head.appendChild(script1);
            });
          }
          
          if (!window.jspdf) {
            await new Promise((resolve, reject) => {
              const script2 = document.createElement('script');
              script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    console.log('📤 PDF enviado! USANDO EXATAMENTE O SISTEMA DO FRONTEND!');
              script2.onerror = reject;
              document.head.appendChild(script2);
    console.error('❌ Erro no sistema frontend:', error.message);
          }
    console.log(`✅ PDF gerado com sistema do frontend! Tamanho: ${Math.round(pdfBuffer.length / 1024)}KB`);
          // Aguardar scripts carregarem
          await new Promise(resolve => setTimeout(resolve, 1000));
        error: 'Erro no sistema frontend de PDF', 
          // USAR EXATAMENTE O MESMO CÓDIGO DO FRONTEND
          const element = document.getElementById('curriculo-preview');
          if (!element) {
            throw new Error('Elemento curriculo-preview não encontrado');
          }
          
          console.log('📸 Capturando com html2canvas...');
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

          console.log('📄 Gerando PDF com jsPDF...');
          const imgData = canvas.toDataURL('image/png');
          const { jsPDF } = window.jspdf;
          const pdf = new jsPDF('p', 'mm', 'a4');
          
          const imgWidth = 210;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          
          console.log('✅ PDF gerado com sistema do frontend!');
          return pdf.output('arraybuffer');
        });
          }
// Função para gerar HTML unificado com CSS puro inline
function generateUnifiedHTML(data) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Currículo - ${data.nome}</title>
    <style>
        /* RESET E BASE */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
        }
        
        body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            background: #ffffff;
            font-size: 11px;
            line-height: 1.5;
            color: #333333;
        }
        
        /* CONTAINER PRINCIPAL */
        #curriculum {
            width: 794px;  /* 210mm */
            height: 1123px; /* 297mm */
            margin: 0;
            background: white;
            display: flex;
            position: relative;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            transform-origin: top left;
        }
        
        /* SIDEBAR */
        .sidebar {
            width: 264px; /* 1/3 de 794px */
            background: linear-gradient(135deg, #1e293b 0%, #0f766e 50%, #0891b2 100%);
            color: white;
            padding: 24px;
            position: relative;
            overflow: hidden;
        }
        
        /* PADRÕES DE FUNDO */
        .sidebar::before {
            content: '';
            position: absolute;
            top: -64px;
            left: -64px;
            width: 128px;
            height: 128px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
        }
        
        .sidebar::after {
            content: '';
            position: absolute;
            bottom: -48px;
            right: -48px;
            width: 96px;
            height: 96px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
        }
        
        /* SEÇÃO DO PERFIL */
        .profile-section {
            text-align: center;
            margin-bottom: 24px;
            position: relative;
            z-index: 2;
        }
        
        /* AVATAR COM PADRÃO GEOMÉTRICO */
        .profile-avatar {
            width: 96px;
            height: 96px;
            background: linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%);
            border-radius: 50%;
            margin: 0 auto 12px;
            border: 2px solid rgba(255, 255, 255, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            backdrop-filter: blur(4px);
        }
        
        /* PADRÕES GEOMÉTRICOS */
        .avatar-pattern { width: 64px; height: 64px; position: relative; }
        .pattern-1 { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(251, 191, 36, 0.4); border-radius: 50%; }
        .pattern-2 { position: absolute; top: 8px; left: 8px; width: 48px; height: 48px; background: rgba(251, 191, 36, 0.3); border-radius: 50%; }
        .pattern-3 { position: absolute; top: 16px; left: 16px; width: 32px; height: 32px; background: rgba(251, 191, 36, 0.5); border-radius: 50%; }
        .pattern-4 { position: absolute; top: 24px; left: 24px; width: 16px; height: 16px; background: rgba(251, 191, 36, 0.7); border-radius: 50%; }
        .pattern-5 { position: absolute; top: 4px; right: 4px; width: 12px; height: 12px; background: rgba(251, 191, 36, 0.6); border-radius: 2px; transform: rotate(45deg); }
        .pattern-6 { position: absolute; bottom: 4px; left: 4px; width: 12px; height: 12px; background: rgba(251, 191, 36, 0.6); border-radius: 2px; transform: rotate(45deg); }
        .pattern-7 { position: absolute; bottom: 4px; right: 4px; width: 8px; height: 8px; background: rgba(251, 191, 36, 0.8); border-radius: 50%; }
        
        /* NOME */
        .profile-name {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
            color: white;
        }
        
        /* SEÇÕES DA SIDEBAR */
        .sidebar-section {
            margin-bottom: 24px;
            position: relative;
            z-index: 2;
        }
        
        .sidebar-title {
            font-size: 10px;
            font-weight: bold;
            margin-bottom: 12px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.4);
            padding-bottom: 8px;
            letter-spacing: 1.5px;
            color: white;
        }
        
        /* ITEMS DE CONTATO */
        .contact-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12px;
            background: rgba(255, 255, 255, 0.1);
            padding: 8px;
            border-radius: 8px;
            backdrop-filter: blur(4px);
        }
        
        .contact-icon {
            width: 16px;
            height: 16px;
            margin-right: 12px;
            flex-shrink: 0;
            margin-top: 2px;
        }
        
        .contact-text {
            color: rgba(255, 255, 255, 0.9);
            font-size: 10px;
            flex: 1;
        }
        
        /* CORES DOS ÍCONES */
        .icon-email { stroke: #67e8f9; }
        .icon-phone { stroke: #fde047; }
        .icon-location { stroke: #67e8f9; }
        
        /* DADOS PESSOAIS */
        .personal-data {
            background: rgba(255, 255, 255, 0.1);
            padding: 12px;
            border-radius: 8px;
            backdrop-filter: blur(4px);
        }
        
        .personal-item {
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 8px;
            font-size: 10px;
        }
        
        .personal-label {
            color: #67e8f9;
            font-weight: bold;
        }
        
        /* DISPONIBILIDADE */
        .availability-box {
            background: rgba(255, 255, 255, 0.1);
            padding: 12px;
            border-radius: 8px;
            backdrop-filter: blur(4px);
        }
        
        .availability-text {
            color: rgba(255, 255, 255, 0.9);
            font-weight: 500;
            font-size: 10px;
        }
        
        /* CONTEÚDO PRINCIPAL */
        .main-content {
            width: 530px; /* 2/3 de 794px */
            padding: 24px;
            background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
        }
        
        .content-section {
            margin-bottom: 24px;
        }
        
        /* TÍTULOS DAS SEÇÕES */
        .content-title {
            font-size: 18px;
            font-weight: bold;
            color: #374151;
            margin-bottom: 12px;
            padding-bottom: 8px;
            position: relative;
        }
        
        .title-text {
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
        
        /* CAIXAS DE CONTEÚDO */
        .content-box {
            background: white;
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border-left: 4px solid #0f766e;
        }
        
        .content-box.education { border-left-color: #0f766e; }
        .content-box.experience { border-left-color: #0891b2; }
        .content-box.courses { border-left-color: #3b82f6; }
        
        /* TEXTOS */
        .content-text {
            font-size: 11px;
            color: #374151;
            line-height: 1.6;
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
    </style>
</head>
<body>
    <div id="curriculum">
        <!-- Sidebar -->
        <div class="sidebar">
            <div class="profile-section">
                <div class="profile-avatar">
                    <div class="avatar-pattern">
                        <div class="pattern-1"></div>
                        <div class="pattern-2"></div>
                        <div class="pattern-3"></div>
                        <div class="pattern-4"></div>
                        <div class="pattern-5"></div>
                        <div class="pattern-6"></div>
            <div class="sidebar-section">
                <h3 class="sidebar-title">CONTATO</h3>
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
                    <div class="contact-text">
                        <div style="font-weight: 500;">${data.endereco}</div>
                        <div>${data.cidade}, ${data.estado}</div>
                        <div style="color: rgba(255,255,255,0.7);">${data.cep}</div>
                    </div>
                </div>
                ` : ''}
            </div>
                        <div class="pattern-7"></div>
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
                    </div>
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
                <h1 class="profile-name">${data.nome || 'Seu Nome'}</h1>
            ${data.experiencia ? `
            <div class="content-section">
                <h3 class="content-title">
                    <span class="title-text">EXPERIÊNCIA PROFISSIONAL</span>
                </h3>
                <div class="content-box experience">
                    <div class="content-text">${data.experiencia}</div>
                </div>
            </div>
        console.log('✅ PDF gerado usando EXATAMENTE o sistema do frontend!');
        return Buffer.from(pdfArrayBuffer);
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
</body>
</html>`;
}