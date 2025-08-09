// Template HTML otimizado para geração de PDF via API
// Sem Tailwind, apenas CSS inline para máxima compatibilidade

export function generateOptimizedHTML(data) {
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
            font-family: 'Arial', 'Helvetica', sans-serif;
            margin: 0;
            padding: 0;
            background: #ffffff;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
        }
        
        .curriculum-container {
            width: 794px;
            height: 1123px;
            margin: 0;
            background: white;
            display: flex;
            position: relative;
        }
        
        .sidebar {
            width: 264px;
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
            z-index: 2;
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
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(251,191,36,0.4);
            border-radius: 50%;
        }
        
        .profile-name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
            word-wrap: break-word;
        }
        
        .sidebar-section {
            margin-bottom: 24px;
            position: relative;
            z-index: 2;
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
            align-items: flex-start;
            margin-bottom: 12px;
            background: rgba(255,255,255,0.1);
            padding: 8px;
            border-radius: 6px;
        }
        
        .contact-icon {
            width: 16px;
            height: 16px;
            margin-right: 12px;
            flex-shrink: 0;
            margin-top: 2px;
        }
        
        .contact-text {
            color: rgba(255,255,255,0.9);
            font-size: 10px;
            word-wrap: break-word;
            flex: 1;
        }
        
        .personal-data {
            background: rgba(255,255,255,0.1);
            padding: 12px;
            border-radius: 6px;
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
        }
        
        .availability-text {
            color: rgba(255,255,255,0.9);
            font-weight: 500;
            font-size: 10px;
        }
        
        .main-content {
            width: 530px;
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
            word-wrap: break-word;
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

        /* Ícones SVG inline para máxima compatibilidade */
        .icon-email { fill: #67e8f9; }
        .icon-phone { fill: #fbbf24; }
        .icon-location { fill: #67e8f9; }
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

    <!-- Scripts para geração de PDF -->
    <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script>
        window.generatePDF = async function() {
            try {
                console.log('🚀 Iniciando geração de PDF otimizada...');
                
                // Aguardar renderização completa
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const element = document.getElementById('curriculum');
                if (!element) {
                    throw new Error('Elemento curriculum não encontrado');
                }
                
                console.log('📸 Capturando elemento...');
                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff',
                    width: 794,
                    height: 1123,
                    logging: false
                });

                console.log('📄 Gerando PDF...');
                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                
                const imgWidth = 210;
                const imgHeight = 297;

                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                
                console.log('✅ PDF gerado com sucesso!');
                return pdf.output('arraybuffer');
            } catch (error) {
                console.error('❌ Erro ao gerar PDF:', error);
                throw error;
            }
        };
        
        // Sinalizar que está pronto
        window.pdfReady = true;
        console.log('✅ Sistema de PDF carregado e pronto!');
    </script>
</body>
</html>`;
}