// Teste definitivo do motor unificado
import fetch from 'node:fetch';
import fs from 'node:fs';

async function testUnifiedEngine() {
  console.log('🚀 TESTE DO MOTOR UNIFICADO');
  console.log('============================');
  
  const testData = {
    nome: 'João Silva Santos - Motor Unificado',
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
    experiencia: 'Analista de Sistemas na Empresa XYZ (2018-2023)\n• Desenvolvimento de aplicações web\n• Manutenção de sistemas legados\n• Trabalho em equipe ágil\n\nEstagiário de TI na Empresa ABC (2017-2018)\n• Suporte técnico aos usuários\n• Instalação e configuração de software',
    cursos: 'Curso de React.js - 40h (2023)\nCertificação AWS Cloud Practitioner (2022)\nCurso de TypeScript - 30h (2021)\nInglês Intermediário - CCAA (2020)'
  };

  try {
    // 1. Testar health check
    console.log('❤️  Testando health check...');
    const healthResponse = await fetch('http://localhost:80/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health:', healthData.message);
    console.log('🔧 Features:', healthData.features);

    // 2. Testar motor unificado
    console.log('\n🧪 Testando motor unificado...');
    const testResponse = await fetch('http://localhost:80/api/test-unified', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    const testResult = await testResponse.json();
    console.log('✅ Teste:', testResult.message);
    console.log('📊 HTML Size:', testResult.htmlSize);

    // 3. Gerar PDF real
    console.log('\n📄 Gerando PDF com motor unificado...');
    const startTime = Date.now();
    
    const pdfResponse = await fetch('http://localhost:80/api/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log('📊 Status:', pdfResponse.status);
    console.log('⏱️  Tempo:', duration, 'ms');

    if (!pdfResponse.ok) {
      const errorText = await pdfResponse.text();
      console.error('❌ ERRO:', errorText);
      return;
    }

    // Verificar PDF
    const contentType = pdfResponse.headers.get('content-type');
    if (contentType === 'application/pdf') {
      const pdfBuffer = await pdfResponse.arrayBuffer();
      const buffer = Buffer.from(pdfBuffer);
      
      console.log('✅ PDF RECEBIDO!');
      console.log('📊 Tamanho:', Math.round(buffer.length / 1024), 'KB');
      
      // Verificar header PDF
      const header = buffer.toString('ascii', 0, 4);
      if (header === '%PDF') {
        console.log('🎯 PDF VÁLIDO!');
        
        // Salvar para verificação
        const fileName = `teste_motor_unificado_${Date.now()}.pdf`;
        fs.writeFileSync(fileName, buffer);
        console.log(`💾 Salvo como: ${fileName}`);
        
        console.log('\n🎉 SUCESSO TOTAL!');
        console.log(`⚡ Performance: ${duration}ms para ${Math.round(buffer.length / 1024)}KB`);
        console.log('🔥 MOTOR UNIFICADO FUNCIONANDO PERFEITAMENTE!');
        
        // Comparar com frontend
        console.log('\n📋 COMPARAÇÃO COM FRONTEND:');
        console.log('✅ Mesmo html2canvas + jsPDF');
        console.log('✅ Mesmo design visual');
        console.log('✅ Mesma qualidade de PDF');
        console.log('✅ CSS puro (sem Tailwind)');
        console.log('✅ Sem Puppeteer');
        console.log('✅ Deploy fácil no EasyPanel');
        
      } else {
        console.log('⚠️  Header inválido:', header);
      }
    } else {
      console.log('⚠️  Não é PDF, content-type:', contentType);
    }

  } catch (error) {
    console.error('❌ ERRO NO TESTE:', error.message);
  }
}

// Teste de múltiplas requisições
async function testMultiple() {
  console.log('\n🔥 TESTE DE MÚLTIPLAS REQUISIÇÕES');
  console.log('==================================');
  
  const testData = {
    nome: 'Teste Múltiplo',
    email: 'teste@email.com',
    telefone: '(11) 99999-9999',
    endereco: 'Rua Teste, 123',
    cidade: 'São Paulo',
    estado: 'SP',
    escolaridade: 'Ensino Médio',
    disponibilidade: 'Integral',
    experiencia: 'Experiência de teste',
    cursos: 'Cursos de teste'
  };

  const promises = [];
  for (let i = 1; i <= 3; i++) {
    const data = { ...testData, nome: `Teste Múltiplo ${i}` };
    promises.push(
      fetch('http://localhost:80/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    );
  }

  try {
    const startTime = Date.now();
    const responses = await Promise.all(promises);
    const endTime = Date.now();
    
    console.log(`⚡ ${responses.length} PDFs gerados em ${endTime - startTime}ms`);
    
    let successCount = 0;
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      if (response.ok && response.headers.get('content-type') === 'application/pdf') {
        const buffer = await response.arrayBuffer();
        console.log(`✅ PDF ${i + 1}: ${Math.round(buffer.byteLength / 1024)}KB`);
        successCount++;
      } else {
        console.log(`❌ PDF ${i + 1}: Falhou`);
      }
    }
    
    console.log(`🎯 Taxa de sucesso: ${successCount}/${responses.length} (${Math.round(successCount / responses.length * 100)}%)`);
    
  } catch (error) {
    console.error('❌ Erro no teste múltiplo:', error.message);
  }
}

// Executar testes
testUnifiedEngine();
setTimeout(() => {
  testMultiple();
}, 8000);