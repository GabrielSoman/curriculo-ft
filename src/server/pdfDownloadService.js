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

      console.log('📄 Gerando PDF com Puppeteer...');
      
      const page = await this.browser.newPage();
      
      // Configuração que funcionou no EasyPanel
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );
      
      // Configurar viewport para A4
      await page.setViewport({
        width: 1280,
        height: 800
      });

      // Carregar HTML
      await page.setContent(htmlContent, {
        waitUntil: ['domcontentloaded', 'networkidle0'],
        timeout: 60000
      });

      // Aguardar renderização completa do CSS
      // Aguardar elementos básicos renderizarem
      // AGUARDAR RENDERIZAÇÃO COMPLETA DO CSS TAILWIND
      console.log('⏳ Aguardando CSS Tailwind renderizar completamente...');
      
      // Aguardar elementos críticos
      await page.waitForSelector('#curriculo-preview', { timeout: 10000 });
      await page.waitForSelector('.profile-avatar', { timeout: 10000 });
      
      // Aguardar CSS ser aplicado completamente
      await page.waitForFunction(() => {
        const sidebar = document.querySelector('.w-1\\/3');
        const mainContent = document.querySelector('.w-2\\/3');
        const avatar = document.querySelector('.profile-avatar');
        
        if (!sidebar || !mainContent || !avatar) return false;
        
        // Verificar se CSS foi aplicado
        const sidebarStyle = window.getComputedStyle(sidebar);
        const mainStyle = window.getComputedStyle(mainContent);
        const avatarStyle = window.getComputedStyle(avatar);
        
        return sidebarStyle.width !== 'auto' && 
               mainStyle.width !== 'auto' && 
               avatarStyle.borderRadius === '50%';
      }, { timeout: 15000 });

      // TEMPO EXTRA PARA GARANTIR RENDERIZAÇÃO COMPLETA
      console.log('⏳ Aguardando renderização final...');
      await new Promise(resolve => setTimeout(resolve, 8000));

      console.log('⏳ Aguardando renderização completa...');

      
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