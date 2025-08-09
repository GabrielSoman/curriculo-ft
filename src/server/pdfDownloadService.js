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
      console.log('⏳ Aguardando renderização completa - SEM LIMITE DE TEMPO...');
      
      // Aguardar elementos EXATOS do frontend - SEM TIMEOUT
      try {
        await page.waitForSelector('#curriculo-preview', { timeout: 0 });
        console.log('✅ Container principal encontrado');
        
        await page.waitForSelector('.w-24.h-24', { timeout: 0 });
        console.log('✅ Avatar geométrico encontrado');
        
        await page.waitForSelector('.flex.items-center.space-x-3', { timeout: 0 });
        console.log('✅ Items de contato encontrados');
        
        await page.waitForSelector('.w-1\\/3', { timeout: 0 });
        console.log('✅ Sidebar encontrada');
        
        await page.waitForSelector('.w-2\\/3', { timeout: 0 });
        console.log('✅ Conteúdo principal encontrado');
        
        await page.waitForSelector('.bg-yellow-400\\/40', { timeout: 0 });
        console.log('✅ Gradientes encontrados');
      } catch (error) {
        console.log('⚠️ Alguns elementos não encontrados, continuando...');
      }
      
      // Aguardar renderização Tailwind - SEM TIMEOUT
      console.log('⏳ Aguardando CSS Tailwind ser aplicado...');
      try {
        await page.waitForFunction(() => {
        const sidebar = document.querySelector('.w-1\\/3');
        const mainContent = document.querySelector('.w-2\\/3');
        const avatar = document.querySelector('.w-24.h-24');
        const contactItems = document.querySelectorAll('.flex.items-center.space-x-3');
        
        if (!sidebar || !mainContent || !avatar || contactItems.length === 0) return false;
        
        // Verificar se estilos Tailwind foram aplicados
        const sidebarStyle = window.getComputedStyle(sidebar);
        const mainStyle = window.getComputedStyle(mainContent);
        const avatarStyle = window.getComputedStyle(avatar);
        const contactStyle = window.getComputedStyle(contactItems[0]);
        
        // Verificar propriedades Tailwind
        const sidebarWidth = parseFloat(sidebarStyle.width);
        const mainWidth = parseFloat(mainStyle.width);
        const avatarSize = parseFloat(avatarStyle.width);
        const sidebarBg = sidebarStyle.background;
        
        return sidebarWidth > 200 && 
               mainWidth > 400 && 
               avatarSize >= 90 &&
               sidebarBg.includes('gradient');
        }, { timeout: 0 });
        console.log('✅ CSS Tailwind aplicado completamente');
      } catch (error) {
        console.log('⚠️ CSS Tailwind pode não estar 100% aplicado, continuando...');
      }

      // VERIFICAÇÃO FINAL DE ESTÉTICA
      console.log('🎨 Verificando estética final...');
      try {
        await page.waitForFunction(() => {
          // Verificar cores dos ícones
          const emailIcon = document.querySelector('.text-cyan-200');
          const phoneIcon = document.querySelector('.text-yellow-300');
          const locationIcon = document.querySelector('.text-cyan-300');
          
          // Verificar backgrounds translúcidos
          const contactItems = document.querySelectorAll('.bg-white\\/10');
          
          // Verificar avatar geométrico
          const avatarPatterns = document.querySelectorAll('.bg-yellow-400\\/40, .bg-yellow-400\\/30, .bg-yellow-400\\/50');
          
          // Verificar gradientes
          const sidebar = document.querySelector('.bg-gradient-to-br');
          const sidebarStyle = window.getComputedStyle(sidebar);
          
          console.log('🔍 Verificações:', {
            emailIcon: !!emailIcon,
            phoneIcon: !!phoneIcon,
            locationIcon: !!locationIcon,
            contactItems: contactItems.length,
            avatarPatterns: avatarPatterns.length,
            sidebarGradient: sidebarStyle.background.includes('gradient')
          });
          
          return emailIcon && phoneIcon && contactItems.length > 0 && avatarPatterns.length >= 3;
        }, { timeout: 0 });
        console.log('✅ Estética verificada e aplicada!');
      } catch (error) {
        console.log('⚠️ Verificação estética falhou, continuando...');
      }

      // TEMPO FINAL PARA ESTABILIZAÇÃO
      console.log('⏳ Aguardando estabilização final (10 segundos)...');
      await new Promise(resolve => setTimeout(resolve, 10000));

      console.log('✅ Sincronização e estética completas, gerando PDF...');

      
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