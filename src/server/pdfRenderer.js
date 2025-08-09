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
    const jsFile = files.find(file => file.endsWith('.js') && file.includes('index'));
    
    console.log('✅ Arquivos encontrados:', { cssFile, jsFile });
    
    // Injetar dados e script de geração automática
    const dataScript = `
    <script>
      // Dados injetados do backend
      window.CURRICULUM_DATA = ${JSON.stringify(data)};
      
      // Função para gerar PDF automaticamente
      window.generatePDFFromAPI = async function() {
        console.log('🚀 Gerando PDF com dados da API...');
        
        // Aguardar React carregar
        await new Promise(resolve => {
          const checkReact = () => {
            if (window.React && document.getElementById('root')) {
              resolve();
            } else {
              setTimeout(checkReact, 100);
            }
          };
          checkReact();
        });
        
        // Aguardar componente renderizar
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Usar o sistema existente do frontend
        const { downloadPDF } = await import('./assets/${jsFile}');
        
        // Simular preenchimento do formulário (se necessário)
        if (window.CURRICULUM_DATA) {
          // Preencher dados no componente React
          const event = new CustomEvent('fillFormData', { 
            detail: window.CURRICULUM_DATA 
          });
          document.dispatchEvent(event);
          
          // Aguardar preenchimento
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Gerar PDF usando o sistema existente
        try {
          await downloadPDF('curriculo-preview', 'curriculo_api.pdf');
          console.log('✅ PDF gerado com sucesso!');
          
          // Sinalizar conclusão
          document.body.style.backgroundColor = '#00ff00';
          document.title = 'PDF_READY';
        } catch (error) {
          console.error('❌ Erro ao gerar PDF:', error);
          document.body.style.backgroundColor = '#ff0000';
          document.title = 'PDF_ERROR';
        }
      };
      
      // Executar automaticamente quando página carregar
      window.addEventListener('load', () => {
        setTimeout(window.generatePDFFromAPI, 1000);
      });
    </script>
    `;
    
    // Injetar script antes do </body>
    htmlContent = htmlContent.replace('</body>', `${dataScript}</body>`);
    
    console.log('✅ HTML do frontend preparado com dados injetados');
    return htmlContent;
    
  } catch (error) {
    console.error('❌ Erro ao preparar frontend:', error);
    throw error;
  }
}