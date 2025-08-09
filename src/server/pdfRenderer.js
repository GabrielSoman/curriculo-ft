// RENDERIZADOR DE PDF SEM JSDOM
// Usa o próprio frontend para renderizar e retorna via API

import { generateSyncedHTML } from './frontendSync.js';

export async function renderPDFViaFrontend(data) {
  console.log('🚀 RENDERIZADOR SINCRONIZADO: Usando frontend para gerar PDF...');
  
  try {
    // Usar o sincronizador que replica EXATAMENTE o frontend
    const syncedHTML = generateSyncedHTML(data);
    
    console.log('✅ HTML sincronizado gerado com avatar geométrico e font system-ui');
    return syncedHTML;
    
  } catch (error) {
    console.error('❌ RENDERIZADOR SINCRONIZADO: Erro:', error);
    throw error;
  }
}