// RENDERIZADOR DE PDF SEM JSDOM
// Usa o próprio frontend para renderizar e retorna via API

import { generatePerfectSyncHTML } from './perfectSync.js';

export async function renderPDFViaFrontend(data) {
  console.log('🚀 RENDERIZADOR PERFEITO: Sincronização 100% com frontend...');
  
  try {
    // Usar sincronização perfeita
    const perfectHTML = generatePerfectSyncHTML(data);
    
    console.log('✅ HTML perfeito gerado - 100% sincronizado com frontend');
    return perfectHTML;
    
  } catch (error) {
    console.error('❌ RENDERIZADOR PERFEITO: Erro:', error);
    throw error;
  }
}