import fetch from 'node:fetch';
import { Buffer } from 'node:buffer';

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

    const result = await response.json();
    console.log('✅ Resposta recebida:');
    console.log('- Status:', result.status);
    console.log('- Filename:', result.filename);
    console.log('- PDF Size:', result.pdf ? `${result.pdf.length} chars` : 'Não encontrado');
    console.log('- PDF Preview:', result.pdf ? result.pdf.substring(0, 100) + '...' : 'N/A');

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
        } else {
          console.log('⚠️  Header não é de PDF');
        }
      } catch (e) {
        console.error('❌ Base64 inválido:', e.message);
      }
    }

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testN8NAPI();