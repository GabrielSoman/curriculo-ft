const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');

const app = express();
const PORT = 80;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Função para gerar HTML do currículo
function generateResumeHTML(data) {
  const {
    nome = 'Nome não informado',
    cpf = '',
    rg = '',
    telefone = '',
    nascimento = '',
    cep = '',
    endereco = '',
    cidade = '',
    estado = '',
    'contato-alternativo': contatoAlternativo = '',
    escolaridade = '',
    'escolaridade-personalizada': escolaridadePersonalizada = '',
    'escola-faculdade': escolaFaculdade = '',
    'disponibilidade-turno': disponibilidadeTurno = '',
    'turno-personalizado': turnoPersonalizado = '',
    experiencia = '',
    'cursos-extras': cursosExtras = ''
  } = data;

  // Processa os dados
  const enderecoCompleto = `${endereco}, ${cidade} - ${estado}, CEP: ${cep}`.trim();
  const escolaridadeFinal = escolaridadePersonalizada || escolaridade;
  const turnoFinal = turnoPersonalizado || disponibilidadeTurno;
  
  // Separa skills básicas baseadas nos cursos extras
  const skills = cursosExtras ? cursosExtras.split(',').map(s => s.trim()).filter(s => s) : [];

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Currículo - ${nome}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background: #f5f5f5;
            color: #333;
            line-height: 1.4;
        }

        .resume-container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            display: flex;
            min-height: 100vh;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }

        .sidebar {
            width: 35%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 0;
            position: relative;
        }

        .profile-section {
            background: rgba(255,255,255,0.1);
            padding: 40px 30px;
            text-align: center;
            border-radius: 0 0 50px 0;
            position: relative;
        }

        .geometric-header {
            height: 80px;
            margin: 0 auto 30px;
            position: relative;
            overflow: hidden;
            background: rgba(255,255,255,0.1);
            border-radius: 15px;
        }

        .geometric-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: repeating-linear-gradient(
                45deg,
                rgba(255,255,255,0.1) 0px,
                rgba(255,255,255,0.1) 1px,
                transparent 1px,
                transparent 15px
            ),
            repeating-linear-gradient(
                -45deg,
                rgba(255,255,255,0.05) 0px,
                rgba(255,255,255,0.05) 1px,
                transparent 1px,
                transparent 15px
            );
        }

        .geometric-header::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            background: rgba(255,255,255,0.2);
            clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }

        .profile-name {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .profile-title {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 300;
        }

        .sidebar-section {
            padding: 30px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .sidebar-section:last-child {
            border-bottom: none;
        }

        .section-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #fff;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            font-size: 14px;
        }

        .contact-icon {
            width: 20px;
            height: 20px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            font-size: 10px;
        }

        .skill-item {
            background: rgba(255,255,255,0.1);
            padding: 8px 15px;
            border-radius: 20px;
            margin-bottom: 10px;
            font-size: 14px;
            display: inline-block;
            margin-right: 10px;
        }

        .main-content {
            width: 65%;
            padding: 40px;
            background: white;
        }

        .main-section {
            margin-bottom: 40px;
        }

        .main-section-title {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 25px;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
        }

        .education-item, .experience-item {
            margin-bottom: 25px;
            position: relative;
            padding-left: 25px;
        }

        .education-item::before, .experience-item::before {
            content: '';
            position: absolute;
            left: 0;
            top: 5px;
            width: 12px;
            height: 12px;
            background: #667eea;
            border-radius: 50%;
        }

        .item-title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }

        .item-subtitle {
            font-size: 16px;
            color: #667eea;
            font-weight: 600;
            margin-bottom: 5px;
        }

        .item-period {
            font-size: 14px;
            color: #666;
            font-style: italic;
            margin-bottom: 10px;
        }

        .item-description {
            font-size: 14px;
            color: #555;
            text-align: justify;
            line-height: 1.6;
        }

        .about-text {
            font-size: 14px;
            line-height: 1.6;
            color: rgba(255,255,255,0.9);
        }

        /* Estilos específicos para impressão A4 */
        @media print {
            body {
                background: white;
                font-size: 12px;
            }
            .resume-container {
                box-shadow: none;
                max-width: none;
                margin: 0;
                min-height: auto;
                page-break-inside: avoid;
            }
            .sidebar {
                width: 35%;
                page-break-inside: avoid;
            }
            .main-content {
                width: 65%;
                page-break-inside: avoid;
            }
            .main-section {
                page-break-inside: avoid;
                margin-bottom: 25px;
            }
            .geometric-header::before {
                background: repeating-linear-gradient(
                    45deg,
                    rgba(0,0,0,0.1) 0px,
                    rgba(0,0,0,0.1) 1px,
                    transparent 1px,
                    transparent 15px
                );
            }
        }
    </style>
</head>
<body>
    <div class="resume-container">
        <div class="sidebar">
            <div class="profile-section">
                <div class="geometric-header"></div>
                <div class="profile-name">${nome}</div>
                <div class="profile-title">Profissional</div>
            </div>

            <div class="sidebar-section">
                <h3 class="section-title">Sobre Mim</h3>
                <div class="about-text">
                    Profissional dedicado e comprometido, sempre em busca de novos desafios e oportunidades de crescimento.
                    ${escolaridadeFinal ? `Formação em ${escolaridadeFinal}.` : ''}
                    ${turnoFinal ? `Disponibilidade para trabalhar no(s) turno(s): ${turnoFinal}.` : ''}
                </div>
            </div>

            <div class="sidebar-section">
                <h3 class="section-title">Contato</h3>
                ${telefone ? `
                <div class="contact-item">
                    <div class="contact-icon">📞</div>
                    <span>${telefone}</span>
                </div>
                ` : ''}
                ${contatoAlternativo ? `
                <div class="contact-item">
                    <div class="contact-icon">📱</div>
                    <span>${contatoAlternativo}</span>
                </div>
                ` : ''}
                ${enderecoCompleto !== ', , CEP:' ? `
                <div class="contact-item">
                    <div class="contact-icon">📍</div>
                    <span>${enderecoCompleto}</span>
                </div>
                ` : ''}
                ${nascimento ? `
                <div class="contact-item">
                    <div class="contact-icon">🎂</div>
                    <span>${nascimento}</span>
                </div>
                ` : ''}
                ${cpf ? `
                <div class="contact-item">
                    <div class="contact-icon">🆔</div>
                    <span>CPF: ${cpf}</span>
                </div>
                ` : ''}
                ${rg ? `
                <div class="contact-item">
                    <div class="contact-icon">📄</div>
                    <span>RG: ${rg}</span>
                </div>
                ` : ''}
            </div>

            ${skills.length > 0 ? `
            <div class="sidebar-section">
                <h3 class="section-title">Competências</h3>
                ${skills.map(skill => `<div class="skill-item">${skill}</div>`).join('')}
            </div>
            ` : ''}
        </div>

        <div class="main-content">
            ${escolaFaculdade ? `
            <div class="main-section">
                <h2 class="main-section-title">Educação</h2>
                <div class="education-item">
                    <div class="item-title">${escolaridadeFinal}</div>
                    <div class="item-subtitle">${escolaFaculdade}</div>
                    <div class="item-description">
                        Formação acadêmica concluída com dedicação e excelência.
                    </div>
                </div>
            </div>
            ` : ''}

            ${experiencia ? `
            <div class="main-section">
                <h2 class="main-section-title">Experiência Profissional</h2>
                <div class="experience-item">
                    <div class="item-title">Experiência Profissional</div>
                    <div class="item-description">${experiencia}</div>
                </div>
            </div>
            ` : ''}

            ${cursosExtras ? `
            <div class="main-section">
                <h2 class="main-section-title">Cursos e Certificações</h2>
                <div class="experience-item">
                    <div class="item-title">Cursos Complementares</div>
                    <div class="item-description">${cursosExtras}</div>
                </div>
            </div>
            ` : ''}

            ${turnoFinal ? `
            <div class="main-section">
                <h2 class="main-section-title">Disponibilidade</h2>
                <div class="experience-item">
                    <div class="item-title">Turnos Disponíveis</div>
                    <div class="item-description">${turnoFinal}</div>
                </div>
            </div>
            ` : ''}
        </div>
    </div>
</body>
</html>
  `;
}

// API endpoint para gerar currículo
app.post('/api/gerar-curriculo', async (req, res) => {
  try {
    const data = req.body.body || req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'Dados não fornecidos' });
    }

    const html = generateResumeHTML(data);
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false,
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm'
      },
      displayHeaderFooter: false
      preferCSSPageSize: false,
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm'
      },
      displayHeaderFooter: false
    });
    
    await browser.close();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="curriculo-${data.nome || 'usuario'}.pdf"`);
    res.send(pdf);
    
  } catch (error) {
    console.error('Erro ao gerar currículo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para visualizar o currículo em HTML
app.post('/api/visualizar-curriculo', async (req, res) => {
  try {
    const data = req.body.body || req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'Dados não fornecidos' });
    }

    const html = generateResumeHTML(data);
    res.send(html);
    
  } catch (error) {
    console.error('Erro ao visualizar currículo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});