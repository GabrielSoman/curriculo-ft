// SUB-APLICAÇÃO INTERNA PARA GERAR PDF COMO DOWNLOAD
// Recebe HTML renderizado e retorna PDF via HTTP

import puppeteer from 'puppeteer';

export class PDFDownloadService {
  constructor() {
    this.browser = null;
  }

  async initialize() {
    try {
      console.log('🚀 Inicializando Puppeteer para PDF...');
      
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ],
        executablePath: process.env.CHROME_BIN || null
      });
      
      console.log('✅ Puppeteer inicializado com sucesso!');
      return true;
    } catch (error) {
      console.error('❌ Erro ao inicializar Puppeteer:', error);
      return false;
    }
  }

  async generatePDFFromHTML(htmlContent, fileName = 'curriculo.pdf') {
    try {
      if (!this.browser) {
        const initialized = await this.initialize();
        if (!initialized) {
          throw new Error('Falha ao inicializar Puppeteer');
        }
      }

      console.log('📄 USANDO FRONTEND REAL: Carregando página com React...');
      
      const page = await this.browser.newPage();
      
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );
      
      await page.setViewport({
        width: 1280,
        height: 800
      });

      console.log('🌐 Carregando frontend real...');
      await page.setContent(htmlContent, {
        waitUntil: ['domcontentloaded', 'networkidle0'],
        timeout: 0
      });

      console.log('⏳ Aguardando React carregar e gerar PDF...');
      
      // Aguardar React e sistema de PDF carregarem
      try {
        await page.waitForSelector('#root', { timeout: 0 });
        console.log('✅ React carregado');
        
        // Aguardar o sistema gerar o PDF automaticamente
        await page.waitForFunction(() => {
          return document.title === 'PDF_READY' || document.title === 'PDF_ERROR';
        }, { timeout: 0 });
        
        const title = await page.title();
        if (title === 'PDF_ERROR') {
          throw new Error('Frontend falhou ao gerar PDF');
        }
        
        console.log('✅ Frontend gerou PDF com sucesso!');
      } catch (error) {
        console.log('⚠️ Erro no frontend, tentando captura direta...');
      }
      
      console.log('📸 Capturando página renderizada pelo frontend...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      
      // Gerar PDF com configurações otimizadas
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: false,
        displayHeaderFooter: false,
        margin: {
          top: '0mm',
          right: '0mm',
          bottom: '0mm',
          left: '0mm'
        },
        width: '210mm',
        height: '297mm'
      });

      await page.close();
      
      console.log(`✅ PDF gerado! Tamanho: ${Math.round(pdfBuffer.length / 1024)}KB`);
      
     // GARANTIR que retorna Buffer binário, não JSON
     if (!(pdfBuffer instanceof Buffer)) {
       console.log('⚠️ Convertendo para Buffer...');
       return Buffer.from(pdfBuffer);
     }
     
      return pdfBuffer;
      
    } catch (error) {
      console.error('❌ Erro ao gerar PDF:', error);
      throw error;
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      console.log('🔒 Puppeteer fechado');
    }
  }
}

// Instância singleton
export const pdfService = new PDFDownloadService();