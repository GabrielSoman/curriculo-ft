import React, { useState } from 'react';
import { Code, Download, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { generatePDFFromElement } from '../utils/pdfGenerator';
import CurriculumPreview from './CurriculumPreview';

export interface CurriculumData {
  nome: string;
  cpf?: string;
  rg?: string;
  telefone?: string;
  nascimento?: string;
  cep?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  email?: string;
  telefoneAlternativo?: string;
  escolaridade?: string;
  instituicao?: string;
  disponibilidade?: string;
  experiencia?: string;
  cursos?: string;
}

const ApiEndpoint: React.FC = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [previewData, setPreviewData] = useState<CurriculumData | null>(null);

  const exampleJson: CurriculumData = {
    nome: 'Maria Silva Santos',
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    telefone: '(11) 99999-9999',
    nascimento: '1990-05-15',
    cep: '01234-567',
    endereco: 'Rua das Flores, 123 - Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    email: 'maria.silva@email.com',
    telefoneAlternativo: '(11) 88888-8888',
    escolaridade: 'Ensino Superior Completo',
    instituicao: 'Universidade de São Paulo',
    disponibilidade: 'Manhã, Tarde',
    experiencia: 'Analista de Sistemas na Empresa XYZ (2018-2023)\n• Desenvolvimento de aplicações web\n• Manutenção de sistemas legados\n• Trabalho em equipe ágil\n\nEstagiário de TI na Empresa ABC (2017-2018)\n• Suporte técnico aos usuários\n• Instalação e configuração de software',
    cursos: 'Curso de React.js - 40h (2023)\nCertificação AWS Cloud Practitioner (2022)\nCurso de TypeScript - 30h (2021)\nInglês Intermediário - CCAA (2020)'
  };

  const handleGeneratePdf = async () => {
    if (!jsonInput.trim()) {
      setResult({ type: 'error', message: 'Por favor, insira um JSON válido' });
      return;
    }

    setIsGenerating(true);
    setResult(null);

    try {
      const data: CurriculumData = JSON.parse(jsonInput);
      
      if (!data.nome) {
        throw new Error('Campo "nome" é obrigatório');
      }

      // Definir dados para preview
      setPreviewData(data);

      // Aguardar um pouco para o DOM ser atualizado
      await new Promise(resolve => setTimeout(resolve, 100));

      // Gerar PDF usando o motor unificado
      const fileName = `Curriculo_${data.nome.replace(/\s+/g, '_')}.pdf`;
      const blob = await generatePDFFromElement('api-curriculo-preview', fileName);
      
      // Baixar o PDF
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setResult({ type: 'success', message: 'PDF gerado e baixado com sucesso!' });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      setResult({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Erro ao processar JSON ou gerar PDF' 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const loadExample = () => {
    setJsonInput(JSON.stringify(exampleJson, null, 2));
    setResult(null);
    setPreviewData(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Code className="w-5 h-5 text-teal-800" />
          <h2 className="text-lg font-semibold text-gray-900">API - Motor Unificado</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">JSON do Currículo</label>
              <button
                onClick={loadExample}
                className="text-sm text-teal-800 hover:text-teal-900 font-medium"
              >
                Carregar Exemplo
              </button>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm"
              placeholder="Cole aqui o JSON com os dados do currículo..."
            />
          </div>

          {result && (
            <div className={`p-3 rounded-lg flex items-center space-x-2 ${
              result.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {result.type === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="text-sm">{result.message}</span>
            </div>
          )}

          <button
            onClick={handleGeneratePdf}
            disabled={isGenerating || !jsonInput.trim()}
            className="w-full px-4 py-2 bg-gradient-to-r from-teal-800 to-cyan-600 text-white rounded-lg hover:from-teal-900 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Gerando PDF...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Gerar PDF do JSON</span>
              </>
            )}
          </button>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Campos Disponíveis:</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <div><code className="bg-white px-1 rounded">nome</code> (obrigatório) - Nome completo</div>
              <div><code className="bg-white px-1 rounded">email, telefone</code> - Contatos</div>
              <div><code className="bg-white px-1 rounded">endereco, cidade, estado, cep</code> - Endereço</div>
              <div><code className="bg-white px-1 rounded">cpf, rg, nascimento</code> - Dados pessoais</div>
              <div><code className="bg-white px-1 rounded">escolaridade, instituicao</code> - Educação</div>
              <div><code className="bg-white px-1 rounded">disponibilidade</code> - Turnos disponíveis</div>
              <div><code className="bg-white px-1 rounded">experiencia, cursos</code> - Textos longos</div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Motor Unificado:</h3>
            <div className="text-xs text-blue-800 space-y-1">
              <div><strong>✅ Mesmo resultado</strong> que a interface web</div>
              <div><strong>✅ html2canvas + jsPDF</strong> para máxima qualidade</div>
              <div><strong>✅ Consistência total</strong> entre API e frontend</div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview oculto para geração de PDF */}
      {previewData && (
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <div id="api-curriculo-preview">
            <CurriculumPreview data={previewData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiEndpoint;