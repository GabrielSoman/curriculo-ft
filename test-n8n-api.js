import fetch from 'node:fetch';
import { Buffer } from 'node:buffer';
import fs from 'node:fs';

async function testN8NAPI() {
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
    console.log('🧪 Testando API N8N PDF...');
    console.log('📡 URL:', 'http://localhost:80/api/generate-pdf');
    console.log('📋 Dados:', JSON.stringify(testData, null, 2));

    const response = await fetch('http://localhost:80/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    console.log('📊 Status:', response.status);
    console.log('📋 Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na resposta:', errorText);
      return;
    }

    // Verificar se a resposta é um PDF
    const contentType = response.headers.get('content-type');
    console.log('📄 Content-Type:', contentType);
    
    if (contentType === 'application/pdf') {
      const pdfBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(pdfBuffer);
      
      console.log('✅ PDF recebido diretamente');
      console.log('📊 Tamanho do PDF:', buffer.length, 'bytes');
      
      // Verificar header PDF
      const header = buffer.toString('ascii', 0, 4);
      console.log('📄 Header do arquivo:', header);
      
      if (header === '%PDF') {
        console.log('🎯 PDF válido detectado!');
        
        // Salvar PDF para teste
        const fileName = `teste_curriculo_${Date.now()}.pdf`;
        fs.writeFileSync(fileName, buffer);
        console.log(`💾 PDF salvo como: ${fileName}`);
      } else {
        console.log('⚠️  Header não é de PDF');
      }
    } else {
      // Tentar como JSON (fallback)
      const result = await response.json();
      console.log('✅ Resposta JSON recebida:');
      console.log('- Success:', result.success);
      console.log('- Filename:', result.filename);
      console.log('- Message:', result.message);
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

// Testar também o endpoint JSON
async function testN8NAPIJson() {
  const testData = {
    nome: 'Maria Santos Silva',
    email: 'maria@email.com',
    telefone: '(11) 88888-8888',
    endereco: 'Av. Paulista, 1000',
    cidade: 'São Paulo',
    estado: 'SP',
    escolaridade: 'Ensino Médio Completo',
    disponibilidade: 'Tarde, Noite',
    experiencia: 'Vendedora na Loja ABC (2020-2023)\n• Atendimento ao cliente\n• Organização do estoque',
    cursos: 'Curso de Vendas - 20h (2023)\nInformática Básica - 40h (2022)'
  };

  try {
    console.log('\n🧪 Testando API N8N JSON...');
    console.log('📡 URL:', 'http://localhost:80/api/generate-pdf-json');

    const response = await fetch('http://localhost:80/api/generate-pdf-json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    console.log('📊 Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na resposta:', errorText);
      return;
    }

    const result = await response.json();
    console.log('✅ Resposta JSON recebida:');
    console.log('- Success:', result.success);
    console.log('- Filename:', result.filename);
    console.log('- PDF Size:', result.pdf ? `${result.pdf.length} chars` : 'Não encontrado');

    // Verificar se é base64 válido
    if (result.pdf) {
      try {
        const buffer = Buffer.from(result.pdf, 'base64');
        console.log('✅ Base64 válido, tamanho do buffer:', buffer.length, 'bytes');
        
        // Verificar se começa com header PDF
        const header = buffer.toString('ascii', 0, 4);
        console.log('📄 Header do arquivo:', header);
        
        if (header === '%PDF') {
          console.log('🎯 PDF válido detectado!');
          
          // Salvar PDF para teste
          const fileName = `teste_curriculo_json_${Date.now()}.pdf`;
          fs.writeFileSync(fileName, buffer);
          console.log(`💾 PDF salvo como: ${fileName}`);
        } else {
          console.log('⚠️  Header não é de PDF');
        }
      } catch (e) {
        console.error('❌ Base64 inválido:', e.message);
      }
    }

  } catch (error) {
    console.error('❌ Erro no teste JSON:', error.message);
  }
}

// Executar ambos os testes
testN8NAPI();
setTimeout(() => {
  testN8NAPIJson();
}, 2000);