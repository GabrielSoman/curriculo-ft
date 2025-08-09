// Teste simples e direto da API
import fetch from 'node:fetch';
import fs from 'node:fs';

async function testAPI() {
  console.log('🧪 TESTE SIMPLES DA API');
  console.log('========================');
  
  const testData = {
    nome: 'João Silva Santos',
    email: 'joao@email.com',
    telefone: '(11) 99999-9999',
    endereco: 'Rua das Flores, 123',
    cidade: 'São Paulo',
    estado: 'SP',
    escolaridade: 'Ensino Superior Completo',
    disponibilidade: 'Manhã, Tarde',
    experiencia: 'Analista de Sistemas na Empresa XYZ (2018-2023)\n• Desenvolvimento de aplicações web\n• Manutenção de sistemas legados',
    cursos: 'React.js, TypeScript, AWS'
  };

  try {
    console.log('📡 Enviando POST para /api/generate-pdf...');
    console.log('📋 Dados:', JSON.stringify(testData, null, 2));
    
    const response = await fetch('http://localhost:80/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    console.log('📊 Status da resposta:', response.status);
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
      
      // Verificar header PDF
      const header = buffer.toString('ascii', 0, 4);
      if (header === '%PDF') {
        console.log('🎯 PDF VÁLIDO!');
        
        // Salvar para teste
        const fileName = `teste_api_${Date.now()}.pdf`;
        fs.writeFileSync(fileName, buffer);
        console.log(`💾 Salvo como: ${fileName}`);
        console.log('🎉 SUCESSO TOTAL!');
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
  }
}

// Testar também o health check
async function testHealth() {
  try {
    console.log('\n❤️  TESTANDO HEALTH CHECK...');
    const response = await fetch('http://localhost:80/api/health');
    const result = await response.json();
    console.log('✅ Health OK:', result);
  } catch (error) {
    console.error('❌ Health falhou:', error.message);
  }
}

// Executar testes
testHealth();
setTimeout(testAPI, 1000);