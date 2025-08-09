// RENDERIZADOR QUE USA O PRÓPRIO FRONTEND
// Em vez de recriar, serve uma página que usa o sistema existente

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function renderPDFViaFrontend(data) {
  console.log('🚀 USANDO O PRÓPRIO FRONTEND: Servindo página com sistema existente...');
  
  try {
    // Ler o index.html do build
    const distPath = path.join(__dirname, '../../dist');
    const indexPath = path.join(distPath, 'index.html');
    let htmlContent = fs.readFileSync(indexPath, 'utf8');
    
    // Encontrar arquivos CSS e JS
    const files = fs.readdirSync(distPath);
    const cssFile = files.find(file => file.endsWith('.css'));
    const jsFile = files.find(file => file.endsWith('.js') && !file.includes('purify'));
    
    console.log('✅ Arquivos encontrados:', { cssFile, jsFile });
    
    if (!cssFile || !jsFile) {
      console.error('❌ Arquivos CSS/JS não encontrados no build!');
      console.log('📁 Arquivos disponíveis:', files);
      throw new Error('Build incompleto - arquivos CSS/JS não encontrados');
    }
    
    // Injetar dados e script de geração automática
    const dataScript = `
    <script>
      // Dados injetados do backend
      window.CURRICULUM_DATA = ${JSON.stringify(data)};
      
      console.log('📋 Dados injetados:', window.CURRICULUM_DATA);
      
      // Função para gerar PDF automaticamente
      window.generatePDFFromAPI = async function() {
        console.log('🚀 Gerando PDF com dados da API...');
        
        try {
          // Aguardar React carregar (com timeout)
          await new Promise((resolve, reject) => {
            let attempts = 0;
            const checkReact = () => {
              attempts++;
              if (document.getElementById('root') && document.querySelector('.bg-white')) {
                console.log('✅ React e componentes carregados');
                resolve();
              } else if (attempts > 100) {
                reject(new Error('Timeout aguardando React'));
              } else {
                setTimeout(checkReact, 100);
              }
            };
            checkReact();
          });
        
          // Aguardar componente renderizar
          await new Promise(resolve => setTimeout(resolve, 2000));
        
          // Simular clique no botão de visualizar (se existir)
          const visualizarBtn = document.querySelector('button');
          if (visualizarBtn && visualizarBtn.textContent.includes('Visualizar')) {
            console.log('🖱️ Clicando em visualizar...');
            visualizarBtn.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        
          // Verificar se preview existe
          const previewElement = document.getElementById('curriculo-preview');
          if (!previewElement) {
            throw new Error('Elemento de preview não encontrado');
          }
          
          console.log('📄 Elemento de preview encontrado, gerando PDF...');
        
          // Usar html2canvas e jsPDF diretamente (sem import)
          if (window.html2canvas && window.jspdf) {
            const canvas = await window.html2canvas(previewElement, {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            
            // Salvar PDF
            pdf.save('curriculo_api.pdf');
          } else {
            throw new Error('html2canvas ou jsPDF não carregados');
          }
          
          console.log('✅ PDF gerado com sucesso!');
          
          // Sinalizar conclusão
          document.body.style.backgroundColor = '#00ff00';
          document.title = 'PDF_READY';
        } catch (error) {
          console.error('❌ Erro ao gerar PDF:', error);
          document.body.style.backgroundColor = '#ff0000';
          document.title = 'PDF_ERROR';
          throw error;
        }
      };
      
      // Executar automaticamente quando página carregar
      window.addEventListener('load', () => {
        console.log('🌐 Página carregada, iniciando geração...');
        setTimeout(() => {
          window.generatePDFFromAPI().catch(error => {
            console.error('❌ Erro na geração automática:', error);
            document.title = 'PDF_ERROR';
            document.body.style.backgroundColor = '#ff0000';
          });
        }, 2000);
      });
    </script>
    
    <!-- Carregar html2canvas e jsPDF -->
    <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    `;
    
    // Injetar script antes do </body>
    htmlContent = htmlContent.replace('</body>', `${dataScript}</body>`);
    
    // Injetar dados no HTML também (fallback)
    const dataDiv = `<div id="api-data" style="display:none;">${JSON.stringify(data)}</div>`;
    htmlContent = htmlContent.replace('<div id="root"></div>', `<div id="root"></div>${dataDiv}`);
    
    console.log('✅ HTML do frontend preparado com dados injetados');
    return htmlContent;
    
  } catch (error) {
    console.error('❌ Erro ao preparar frontend:', error);
    throw error;
  }
}