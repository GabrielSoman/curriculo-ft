import puppeteer from 'puppeteer';
import { CurriculumData } from '../types/curriculum';

export async function generatePDF(data: CurriculumData): Promise<Buffer> {
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    
    // Gerar HTML do currículo
    const html = generateCurriculumHTML(data);
    
    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Configurações do PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm'
      }
    });
    
    return pdfBuffer;
    
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

function generateCurriculumHTML(data: CurriculumData): string {
  const getTurnosDisponiveis = () => {
    const turnos = [];
    if (data.turnoManha) turnos.push('Manhã');
    if (data.turnoTarde) turnos.push('Tarde');
    if (data.turnoNoite) turnos.push('Noite');
    return turnos.length > 0 ? turnos.join(', ') : 'Não informado';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Currículo - ${data.nome || 'Candidato'}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 11px;
          line-height: 1.5;
          color: #333;
          background: white;
        }
        
        .curriculum-container {
          width: 210mm;
          height: 297mm;
          display: flex;
          background: white;
        }
        
        .sidebar {
          width: 33.33%;
          background: linear-gradient(135deg, #475569 0%, #032A42 50%, #0891b2 100%);
          color: white;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }
        
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
        
        .profile-section {
          text-align: center;
          margin-bottom: 24px;
          position: relative;
          z-index: 1;
        }
        
        .profile-avatar {
          width: 96px;
          height: 96px;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 255, 255, 0.1));
          border-radius: 50%;
          margin: 0 auto 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(4px);
          border: 2px solid rgba(255, 255, 255, 0.4);
          position: relative;
          overflow: hidden;
        }
        
        .profile-avatar::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255, 215, 0, 0.4);
          border-radius: 50%;
        }
        
        .geometric-pattern {
          position: relative;
          width: 64px;
          height: 64px;
        }
        
        .geometric-pattern::before,
        .geometric-pattern::after {
          content: '';
          position: absolute;
          background: rgba(255, 215, 0, 0.6);
          border-radius: 50%;
        }
        
        .geometric-pattern::before {
          width: 32px;
          height: 32px;
          top: 16px;
          left: 16px;
        }
        
        .geometric-pattern::after {
          width: 16px;
          height: 16px;
          top: 24px;
          left: 24px;
          background: rgba(255, 215, 0, 0.8);
        }
        
        .profile-name {
          font-size: 20px;
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
          border-bottom: 2px solid rgba(255, 255, 255, 0.4);
          padding-bottom: 8px;
          letter-spacing: 1.5px;
        }
        
        .contact-item {
          display: flex;
          align-items: center;
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
        }
        
        .contact-text {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .personal-data {
          background: rgba(255, 255, 255, 0.1);
          padding: 12px;
          border-radius: 8px;
          backdrop-filter: blur(4px);
        }
        
        .personal-data-item {
          margin-bottom: 8px;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .personal-data-label {
          color: #7dd3fc;
          font-weight: 600;
        }
        
        .availability {
          background: rgba(255, 255, 255, 0.1);
          padding: 12px;
          border-radius: 8px;
          backdrop-filter: blur(4px);
        }
        
        .availability-text {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
        }
        
        .main-content {
          width: 66.67%;
          padding: 24px;
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
        }
        
        .main-section {
          margin-bottom: 24px;
        }
        
        .main-title {
          font-size: 16px;
          font-weight: bold;
          color: #032A42;
          margin-bottom: 12px;
          padding-bottom: 8px;
          position: relative;
          letter-spacing: 0.5px;
        }
        
        .main-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 48px;
          height: 4px;
          background: linear-gradient(90deg, #032A42, #0891b2);
          border-radius: 2px;
        }
        
        .content-box {
          background: white;
          padding: 12px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border-left: 4px solid #032A42;
        }
        
        .content-box.education {
          border-left-color: #032A42;
        }
        
        .content-box.experience {
          border-left-color: #0891b2;
        }
        
        .content-box.courses {
          border-left-color: #3b82f6;
        }
        
        .education-degree {
          font-weight: bold;
          color: #1f2937;
          font-size: 12px;
          margin-bottom: 4px;
        }
        
        .education-institution {
          color: #6b7280;
          font-weight: 500;
        }
        
        .content-text {
          font-size: 11px;
          color: #374151;
          line-height: 1.6;
          white-space: pre-line;
        }
        
        @media print {
          body { -webkit-print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <div class="curriculum-container">
        <!-- Sidebar -->
        <div class="sidebar">
          <div class="profile-section">
            <div class="profile-avatar">
              <div class="geometric-pattern"></div>
            </div>
            <h1 class="profile-name">${data.nome || 'Seu Nome'}</h1>
          </div>

          <div class="sidebar-section">
            <h3 class="sidebar-title">CONTATO</h3>
            ${data.email ? `
              <div class="contact-item">
                <svg class="contact-icon" fill="#7dd3fc" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <span class="contact-text">${data.email}</span>
              </div>
            ` : ''}
            ${data.telefone ? `
              <div class="contact-item">
                <svg class="contact-icon" fill="#ffd700" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span class="contact-text">${data.telefone}</span>
              </div>
            ` : ''}
            ${data.endereco ? `
              <div class="contact-item">
                <svg class="contact-icon" fill="#7dd3fc" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <div class="contact-text">
                  <div>${data.endereco}</div>
                  <div>${data.cidade}, ${data.estado}</div>
                  ${data.cep ? `<div>${data.cep}</div>` : ''}
                </div>
              </div>
            ` : ''}
          </div>

          <div class="sidebar-section">
            <h3 class="sidebar-title">DADOS PESSOAIS</h3>
            <div class="personal-data">
              ${data.cpf ? `<div class="personal-data-item"><span class="personal-data-label">CPF:</span> ${data.cpf}</div>` : ''}
              ${data.rg ? `<div class="personal-data-item"><span class="personal-data-label">RG:</span> ${data.rg}</div>` : ''}
              ${data.nascimento ? `<div class="personal-data-item"><span class="personal-data-label">Nascimento:</span> ${formatDate(data.nascimento)}</div>` : ''}
            </div>
          </div>

          <div class="sidebar-section">
            <h3 class="sidebar-title">DISPONIBILIDADE</h3>
            <div class="availability">
              <div class="availability-text">${getTurnosDisponiveis()}</div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
          ${data.escolaridade ? `
            <div class="main-section">
              <h3 class="main-title">EDUCAÇÃO</h3>
              <div class="content-box education">
                <div class="education-degree">${data.escolaridade}</div>
                ${data.instituicao ? `<div class="education-institution">${data.instituicao}</div>` : ''}
              </div>
            </div>
          ` : ''}

          ${data.experiencia ? `
            <div class="main-section">
              <h3 class="main-title">EXPERIÊNCIA PROFISSIONAL</h3>
              <div class="content-box experience">
                <div class="content-text">${data.experiencia}</div>
              </div>
            </div>
          ` : ''}

          ${data.cursos ? `
            <div class="main-section">
              <h3 class="main-title">CURSOS E CERTIFICAÇÕES</h3>
              <div class="content-box courses">
                <div class="content-text">${data.cursos}</div>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    </body>
    </html>
  `;
}