// Teste do renderizador frontend
import fetch from 'node:fetch';

async function testFrontendRenderer() {
  console.log('🚀 TESTE DO RENDERIZADOR FRONTEND');
  console.log('=================================');
  
  const testData = {
    nome: 'João Silva Santos - Frontend Renderer',
    email: 'joao@email.com',
    telefone: '(11) 99999-9999',
    endereco: 'Rua das Flores, 123',
    cidade: 'São Paulo',
    estado: 'SP',
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    nascimento: '1990-05-15',
    escolaridade: 'Ensino Superior Completo',
    instituicao: 'Universidade de São Paulo',
    disponibilidade: 'Manhã, Tarde',
    experiencia: 'Analista de Sistemas na Empresa XYZ (2018-2023)\n• Desenvolvimento de aplicações web\n• Manutenção de sistemas legados',
    cursos: 'Curso de React.js - 40h (2023)\nCertificação AWS Cloud Practitioner (2022)'
  };

  try {
    // 1. Testar health check
    console.log('❤️  Testando health check...');
    const healthResponse = await fetch('http://localhost:80/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health:', healthData.message);
    console.log('🔧 Features:', healthData.features);

    // 2. Testar renderizador
    console.log('\n🎨 Testando renderizador frontend...');
    const renderResponse = await fetch('http://localhost:80/api/render-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });

    console.log('📊 Status:', renderResponse.status);
    console.log('📋 Content-Type:', renderResponse.headers.get('content-type'));

    if (!renderResponse.ok) {
      const errorText = await renderResponse.text();
      console.error('❌ ERRO:', errorText);
      return;
    }

    const htmlContent = await renderResponse.text();
    console.log('✅ HTML RECEBIDO!');
    console.log('📊 Tamanho do HTML:', Math.round(htmlContent.length / 1024), 'KB');
    
    // Verificar se contém os elementos esperados
    const hasCSS = htmlContent.includes('index-a9e3430a.css');
    const hasJS = htmlContent.includes('index.es-8302797b.js');
    const hasData = htmlContent.includes(testData.nome);
    const hasPDFScript = htmlContent.includes('generatePDFFromAPI');
    
    console.log('🔍 Verificações:');
    console.log('  ✅ CSS Tailwind:', hasCSS ? 'OK' : 'FALTANDO');
    console.log('  ✅ JavaScript:', hasJS ? 'OK' : 'FALTANDO');
    console.log('  ✅ Dados:', hasData ? 'OK' : 'FALTANDO');
    console.log('  ✅ Script PDF:', hasPDFScript ? 'OK' : 'FALTANDO');
    
    if (hasCSS && hasJS && hasData && hasPDFScript) {
      console.log('\n🎉 SUCESSO TOTAL!');
      console.log('🔥 RENDERIZADOR FRONTEND FUNCIONANDO!');
      console.log('📋 PRÓXIMO PASSO: Abrir a URL no browser para gerar o PDF');
      console.log('🌐 URL: http://localhost:80/api/render-pdf');
    } else {
      console.log('\n⚠️  Alguns elementos estão faltando');
    }

  } catch (error) {
    console.error('❌ ERRO NO TESTE:', error.message);
  }
}

// Executar teste
testFrontendRenderer();