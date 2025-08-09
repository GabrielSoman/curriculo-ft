// RENDERIZADOR DE PDF SEM JSDOM
// Usa o próprio frontend para renderizar e retorna via API

import { generateSyncedHTML } from './frontendExtractor.js';

export async function renderPDFViaFrontend(data) {
  console.log('🚀 RENDERIZADOR COM CSS COMPILADO: Usando CSS exato do frontend...');
  
  try {
    // Usar o extrator que usa CSS compilado do frontend
    const syncedHTML = generateSyncedHTML(data);
    
    console.log('✅ HTML gerado com CSS compilado do build frontend');
    return syncedHTML;
    
  } catch (error) {
    console.error('❌ RENDERIZADOR COM CSS COMPILADO: Erro:', error);
    throw error;
  }
}