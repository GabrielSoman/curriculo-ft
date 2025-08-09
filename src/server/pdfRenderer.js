// RENDERIZADOR QUE USA O PRÓPRIO FRONTEND
// Em vez de recriar, serve uma página que usa o sistema existente

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function renderPDFViaFrontend(data) {
  console.log('🚀 USANDO O PRÓPRIO FRONTEND: Servindo página com sistema existente...');
  
  try {
    const distPath = path.join(__dirname, '../../dist');
    const indexPath = path.join(distPath, 'index.html');
    
    if (!fs.existsSync(indexPath)) {
      throw new Error('Build do frontend não encontrado');
    }
    
    // Ler o index.html do build
    let htmlContent = fs.readFileSync(indexPath, 'utf8');
    
    // Verificar arquivos CSS/JS na pasta assets
    const assetsPath = path.join(distPath, 'assets');
    let cssFile, jsFile;
    
    if (fs.existsSync(assetsPath)) {
      const assetFiles = fs.readdirSync(assetsPath);
      cssFile = assetFiles.find(file => file.endsWith('.css'));
      jsFile = assetFiles.find(file => file.endsWith('.js') && !file.includes('purify'));
      console.log('✅ Arquivos encontrados:', { cssFile, jsFile });
    }
    
    // Injetar dados e script de geração automática
    const scriptInjection = `
    <script>
      // Dados do currículo injetados pelo backend
      window.CURRICULUM_DATA = ${JSON.stringify(data)};
      
      // Aguardar React carregar e gerar PDF automaticamente
      window.addEventListener('load', async function() {
        console.log('🚀 Frontend carregado, iniciando geração automática...');
        
        try {
          // Aguardar React renderizar
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Verificar se o sistema de PDF está disponível
          if (typeof window.generatePDFFromElement === 'function') {
            console.log('✅ Sistema de PDF encontrado, gerando...');
            
            // Usar o sistema existente do frontend
            await window.generatePDFFromElement('curriculo-preview', 'curriculo.pdf');
            
            // Sinalizar sucesso
            document.title = 'PDF_READY';
            console.log('✅ PDF gerado com sucesso!');
          } else {
            console.log('⚠️ Sistema de PDF não encontrado');
            document.title = 'PDF_ERROR';
          }
        } catch (error) {
          console.error('❌ Erro na geração:', error);
          document.title = 'PDF_ERROR';
        }
      });
    </script>
    `;
    
    // Injetar script antes do </body>
    htmlContent = htmlContent.replace('</body>', `${scriptInjection}</body>`);
    
    console.log('✅ HTML do frontend preparado com dados injetados');
    return htmlContent;
    
  } catch (error) {
    console.error('❌ Erro ao preparar frontend:', error);
    throw error;
  }
}