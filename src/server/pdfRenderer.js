// RENDERIZADOR DE PDF SEM JSDOM
// Usa o próprio frontend para renderizar e retorna via API

import { generateSyncedHTML } from './frontendSync.js';

export async function renderPDFViaFrontend(data) {
  console.log('🚀 RENDERIZADOR AUTOMÁTICO: Sincronização automática com React...');
  
  try {
    // Usar sincronização automática
    const syncedHTML = generateSyncedHTML(data);
    
    console.log('✅ HTML sincronizado automaticamente com React gerado');
    return syncedHTML;
    
  } catch (error) {
    console.error('❌ RENDERIZADOR AUTOMÁTICO: Erro:', error);
    throw error;
  }
}