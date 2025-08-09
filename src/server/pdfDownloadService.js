// SUB-APLICAÇÃO INTERNA PARA GERAR PDF COMO DOWNLOAD
// Recebe HTML renderizado e retorna PDF via HTTP

import puppeteer from 'puppeteer-core';
import chromium from 'chromium';

export class PDFDownloadService {
  constructor() {
    this.browser = null;
  }

  async initialize() {
    try {
      console.log('🚀 Inicializando Puppeteer para PDF...');
      
      this.browser = await puppeteer.launch({
        executablePath: chromium.path,
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
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

      console.log('📄 Gerando PDF com Puppeteer...');
      
      const page = await this.browser.newPage();
      
      // Configurar viewport para A4
      await page.setViewport({
        width: 794,  // 210mm em pixels
        height: 1123, // 297mm em pixels
        deviceScaleFactor: 2
      });

      // Carregar HTML
      await page.setContent(htmlContent, {
        waitUntil: ['networkidle0', 'domcontentloaded']
      });

      // Aguardar scripts carregarem
      await page.waitForFunction(() => {
        return window.html2canvas && window.jspdf && window.pdfAPIReady;
      }, { timeout: 30000 });

      console.log('⏳ Aguardando renderização completa...');
      await page.waitForTimeout(3000);

      // Executar geração de PDF usando o mesmo motor do frontend
      const pdfBuffer = await page.evaluate(async () => {
        try {
          console.log('🎨 Executando geração de PDF no browser...');
          
          // Usar a função do frontend
          const pdfArrayBuffer = await window.generatePDFFromAPI();
          
          // Converter para array para retornar
          return Array.from(new Uint8Array(pdfArrayBuffer));
        } catch (error) {
          console.error('Erro na geração:', error);
          throw error;
        }
      });

      await page.close();
      
      console.log(`✅ PDF gerado! Tamanho: ${Math.round(pdfBuffer.length / 1024)}KB`);
      
      return Buffer.from(pdfBuffer);
      
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