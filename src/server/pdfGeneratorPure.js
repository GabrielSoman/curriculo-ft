// GERADOR DE PDF PURO - SEM CSS PARSING NO JSDOM
// Usa apenas JavaScript para criar o PDF, eliminando problemas de CSS

import { JSDOM } from 'jsdom';

export async function generatePDFPure(data) {
  console.log('🚀 GERADOR PURO: Iniciando sem CSS parsing...');
  
  try {
    // HTML mínimo SEM CSS complexo
    const minimalHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Currículo - ${data.nome}</title>
    <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        .container { width: 794px; height: 1123px; background: white; }
    </style>
</head>
<body>
    <div class="container" id="curriculum">
        <div style="padding: 20px;">
            <h1>${data.nome || 'Nome'}</h1>
            <p>Email: ${data.email || ''}</p>
            <p>Telefone: ${data.telefone || ''}</p>
            <p>Endereço: ${data.endereco || ''}</p>
            <p>Cidade: ${data.cidade || ''}, ${data.estado || ''}</p>
            <p>Escolaridade: ${data.escolaridade || ''}</p>
            <p>Disponibilidade: ${data.disponibilidade || ''}</p>
            <div>
                <h3>Experiência:</h3>
                <p style="white-space: pre-line;">${data.experiencia || ''}</p>
            </div>
            <div>
                <h3>Cursos:</h3>
                <p style="white-space: pre-line;">${data.cursos || ''}</p>
            </div>
        </div>
    </div>

    <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script>
        window.generatePDF = async function() {
            try {
                console.log('📄 Gerando PDF simples...');
                
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const element = document.getElementById('curriculum');
                const canvas = await html2canvas(element, {
                    scale: 2,
                    backgroundColor: '#ffffff',
                    width: 794,
                    height: 1123
                });

                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                
                pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
                
                return pdf.output('arraybuffer');
            } catch (error) {
                console.error('Erro:', error);
                throw error;
            }
        };
        
        window.pdfReady = true;
    </script>
</body>
</html>`;

    // JSDOM com configuração mínima
    const dom = new JSDOM(minimalHTML, {
      runScripts: 'dangerously',
      resources: 'usable',
      pretendToBeVisual: true
    });

    const window = dom.window;
    
    // Aguardar scripts
    await new Promise((resolve, reject) => {
      let attempts = 0;
      const check = () => {
        attempts++;
        if (window.pdfReady && window.html2canvas && window.jspdf) {
          resolve();
        } else if (attempts > 100) {
          reject(new Error('Timeout'));
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const pdfArrayBuffer = await window.generatePDF();
    return Buffer.from(pdfArrayBuffer);
    
  } catch (error) {
    console.error('❌ GERADOR PURO: Erro:', error);
    throw error;
  }
}