// RENDERIZADOR DE PDF SEM JSDOM
// Usa o próprio frontend para renderizar e retorna via API

import { generateHybridHTML } from './hybridRenderer.js';

export async function renderPDFViaFrontend(data) {
  console.log('🚀 RENDERIZADOR HÍBRIDO: CSS compilado + estilos críticos...');
  
  try {
    // Usar o renderizador híbrido
    const hybridHTML = generateHybridHTML(data);
    
    console.log('✅ HTML híbrido gerado - CSS compilado + estilos críticos');
    return hybridHTML;
    
  } catch (error) {
    console.error('❌ RENDERIZADOR HÍBRIDO: Erro:', error);
    throw error;
  }
}