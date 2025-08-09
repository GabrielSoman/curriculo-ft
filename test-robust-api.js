// Teste da nova API robusta sem Puppeteer
import fetch from 'node:fetch';
import fs from 'node:fs';

async function testRobustAPI() {
  console.log('🚀 TESTANDO NOVA API ROBUSTA');
  console.log('============================');
  
  const testData = {
    nome: 'João Silva Santos',
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
    console.log('📡 Enviando POST para /api/generate-pdf...');
    console.log('📋 Dados completos:', JSON.stringify(testData, null, 2));
    
    const startTime = Date.now();
    
    const response = await fetch('http://localhost:80/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log('📊 Status da resposta:', response.status);
    console.log('⏱️  Tempo de resposta:', duration, 'ms');
    console.log('📋 Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ ERRO:', errorText);
      return;
    }

    // Verificar se é PDF
    const contentType = response.headers.get('content-type');
    if (contentType === 'application/pdf') {
      const pdfBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(pdfBuffer);
      
      console.log('✅ PDF RECEBIDO!');
      console.log('📊 Tamanho:', buffer.length, 'bytes');
      console.log('📊 Tamanho em KB:', Math.round(buffer.length / 1024), 'KB');
      
      // Verificar header PDF
      const header = buffer.toString('ascii', 0, 4);
      if (header === '%PDF') {
        console.log('🎯 PDF VÁLIDO!');
        
        // Salvar para teste
        const fileName = `teste_robusto_${Date.now()}.pdf`;
        fs.writeFileSync(fileName, buffer);
        console.log(`💾 Salvo como: ${fileName}`);
        
        // Verificar versão do PDF
        const version = buffer.toString('ascii', 0, 8);
        console.log('📄 Versão do PDF:', version);
        
        console.log('🎉 SUCESSO TOTAL!');
        console.log(`⚡ Performance: ${duration}ms para gerar PDF de ${Math.round(buffer.length / 1024)}KB`);
      } else {
        console.log('⚠️  Header inválido:', header);
      }
    } else {
      console.log('⚠️  Não é PDF, content-type:', contentType);
      const text = await response.text();
      console.log('📄 Resposta:', text);
    }

  } catch (error) {
    console.error('❌ ERRO NO TESTE:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Teste de stress - múltiplas requisições
async function testStress() {
  console.log('\n🔥 TESTE DE STRESS - 3 REQUISIÇÕES SIMULTÂNEAS');
  console.log('===============================================');
  
  const testData = {
    nome: 'Teste Stress',
    email: 'teste@email.com',
    telefone: '(11) 99999-9999',
    endereco: 'Rua Teste, 123',
    cidade: 'São Paulo',
    estado: 'SP',
    escolaridade: 'Ensino Médio',
    disponibilidade: 'Integral',
    experiencia: 'Experiência de teste para verificar performance da API',
    cursos: 'Cursos de teste'
  };

  const promises = [];
  for (let i = 1; i <= 3; i++) {
    const data = { ...testData, nome: `Teste Stress ${i}` };
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
    
    console.log(`⚡ ${responses.length} requisições processadas em ${endTime - startTime}ms`);
    
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
    console.error('❌ Erro no teste de stress:', error.message);
  }
}

// Executar testes
testRobustAPI();
setTimeout(() => {
  testStress();
}, 5000);