import React, { useState } from 'react';
import { useEffect } from 'react';
import { FileText, Download, User, Mail, Phone, MapPin, GraduationCap, Briefcase, Award, Clock } from 'lucide-react';
import CurriculumPreview from './components/CurriculumPreview';
import ApiEndpoint from './components/ApiEndpoint';
import { downloadPDF, generatePDFFromElement } from './utils/pdfGenerator';

interface FormData {
  // Dados Pessoais
  nome: string;
  cpf: string;
  rg: string;
  telefone: string;
  nascimento: string;
  
  // Endereço
  cep: string;
  endereco: string;
  cidade: string;
  estado: string;
  
  // Contatos
  email: string;
  telefoneAlternativo: string;
  
  // Educação
  escolaridade: string;
  instituicao: string;
  
  // Disponibilidade
  disponibilidade: string;
  
  // Experiência
  experiencia: string;
  
  // Cursos
  cursos: string;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    cpf: '',
    rg: '',
    telefone: '',
    nascimento: '',
    cep: '',
    endereco: '',
    cidade: '',
    estado: '',
    email: '',
    telefoneAlternativo: '',
    escolaridade: '',
    instituicao: '',
    disponibilidade: '',
    experiencia: '',
    cursos: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'api'>('form');
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Verificar status da API N8N
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          setApiStatus('online');
        } else {
          setApiStatus('offline');
        }
      } catch (error) {
        setApiStatus('offline');
      }
    };

    checkApiStatus();
    // Verificar a cada 30 segundos
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const preencherDadosExemplo = () => {
    setFormData({
      nome: 'João Silva Santos',
      cpf: '123.456.789-00',
      rg: '12.345.678-9',
      telefone: '(11) 99999-9999',
      nascimento: '1990-05-15',
      cep: '01234-567',
      endereco: 'Rua das Flores, 123 - Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      email: 'joao.silva@email.com',
      telefoneAlternativo: '(11) 88888-8888',
      escolaridade: 'Ensino Superior Completo',
      instituicao: 'Universidade de São Paulo',
      disponibilidade: 'Manhã, Tarde',
      experiencia: 'Analista de Sistemas na Empresa XYZ (2018-2023)\n• Desenvolvimento de aplicações web\n• Manutenção de sistemas legados\n• Trabalho em equipe ágil\n\nEstagiário de TI na Empresa ABC (2017-2018)\n• Suporte técnico aos usuários\n• Instalação e configuração de software',
      cursos: 'Curso de React.js - 40h (2023)\nCertificação AWS Cloud Practitioner (2022)\nCurso de TypeScript - 30h (2021)\nInglês Intermediário - CCAA (2020)'
    });
  };

  const visualizarCurriculo = () => {
    setShowPreview(true);
  };

  // Função principal para baixar PDF (usa o motor unificado)
  const baixarCurriculo = async () => {
    if (!showPreview) {
      alert('Por favor, visualize o currículo primeiro!');
      return;
    }

    if (!formData.nome) {
      alert('Por favor, preencha pelo menos o nome!');
      return;
    }

    setIsGenerating(true);
    
    try {
      const fileName = `Curriculo_${formData.nome.replace(/\s+/g, '_')}.pdf`;
      await downloadPDF('curriculo-preview', fileName);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o PDF. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-teal-800 to-cyan-600 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gerador de Currículos</h1>
                <p className="text-sm text-gray-600">Crie seu currículo profissional em minutos</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('form')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'form'
                      ? 'bg-white text-teal-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Formulário
                </button>
                <button
                  onClick={() => setActiveTab('api')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'api'
                      ? 'bg-white text-teal-800 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  API JSON
                </button>
              </div>
              <div className="flex space-x-3">
                {activeTab === 'form' && (
                  <>
                    <button
                      onClick={preencherDadosExemplo}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                    >
                      Dados de Exemplo
                    </button>
                    <button
                      onClick={visualizarCurriculo}
                      className="px-4 py-2 bg-teal-800 text-white rounded-lg hover:bg-teal-900 transition-colors duration-200 text-sm font-medium"
                    >
                      Visualizar
                    </button>
                    <button
                      onClick={baixarCurriculo}
                      disabled={isGenerating || !formData.nome || !showPreview}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-500 text-white rounded-lg hover:from-cyan-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isGenerating ? 'Gerando...' : 'Baixar PDF'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'api' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ApiEndpoint />
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Como usar a API</h3>
              <div className="text-left space-y-4 text-sm text-gray-600">
                <div>
                  <h4 className="font-medium text-gray-900">1. Prepare o JSON</h4>
                  <p>Monte um objeto JSON com os dados do currículo</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">2. Cole no campo</h4>
                  <p>Insira o JSON na área de texto ao lado</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">3. Gere o PDF</h4>
                  <p>Clique em "Gerar PDF do JSON" e o download iniciará automaticamente</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg mt-4">
                  <p className="text-blue-800 text-xs">
                    <strong>Motor Unificado:</strong> A API usa o mesmo sistema de geração que a interface web
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulário */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-5 h-5 text-teal-800" />
                  <h2 className="text-lg font-semibold text-gray-900">Dados Pessoais</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="000.000.000-00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">RG</label>
                    <input
                      type="text"
                      name="rg"
                      value={formData.rg}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="00.000.000-0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                    <input
                      type="date"
                      name="nascimento"
                      value={formData.nascimento}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Mail className="w-5 h-5 text-teal-800" />
                  <h2 className="text-lg font-semibold text-gray-900">Contato</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone Alternativo</label>
                    <input
                      type="tel"
                      name="telefoneAlternativo"
                      value={formData.telefoneAlternativo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="(11) 88888-8888"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="w-5 h-5 text-teal-800" />
                  <h2 className="text-lg font-semibold text-gray-900">Endereço</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                    <input
                      type="text"
                      name="cep"
                      value={formData.cep}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="00000-000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <input
                      type="text"
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="SP"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                    <input
                      type="text"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="São Paulo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                    <input
                      type="text"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Rua, número - bairro"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-teal-800" />
                  <h2 className="text-lg font-semibold text-gray-900">Educação</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Escolaridade</label>
                    <input
                      type="text"
                      name="escolaridade"
                      value={formData.escolaridade}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Ex: Ensino Superior Completo, Técnico em..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instituição</label>
                    <input
                      type="text"
                      name="instituicao"
                      value={formData.instituicao}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Nome da instituição"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock className="w-5 h-5 text-teal-800" />
                  <h2 className="text-lg font-semibold text-gray-900">Disponibilidade</h2>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Turnos Disponíveis</label>
                  <input
                    type="text"
                    name="disponibilidade"
                    value={formData.disponibilidade}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Ex: Manhã, Tarde, Noite, Meio Turno"
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Briefcase className="w-5 h-5 text-teal-800" />
                  <h2 className="text-lg font-semibold text-gray-900">Experiência Profissional</h2>
                </div>
                <textarea
                  name="experiencia"
                  value={formData.experiencia}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Descreva sua experiência profissional, cargos ocupados, empresas, período e principais atividades..."
                />
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Award className="w-5 h-5 text-teal-800" />
                  <h2 className="text-lg font-semibold text-gray-900">Cursos e Certificações</h2>
                </div>
                <textarea
                  name="cursos"
                  value={formData.cursos}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Liste seus cursos, certificações, workshops e outras qualificações..."
                />
              </div>
            </div>

            {/* Pré-visualização */}
            <div className="lg:sticky lg:top-8">
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="bg-gradient-to-r from-teal-800 to-cyan-600 px-6 py-4">
                  <h2 className="text-lg font-semibold text-white">Pré-visualização</h2>
                </div>
                
                {showPreview ? (
                  <div className="p-4 overflow-hidden">
                    <CurriculumPreview data={formData} />
                  </div>
                ) : (
                  <div className="p-12 text-center text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">Pré-visualização do Currículo</p>
                    <p className="text-sm">Preencha os dados e clique em "Visualizar" para ver seu currículo</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Aviso temporário do status da API N8N */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className={`px-4 py-2 text-center text-sm font-medium transition-all duration-300 ${
          apiStatus === 'online' 
            ? 'bg-green-600 text-white' 
            : apiStatus === 'offline'
            ? 'bg-red-600 text-white'
            : 'bg-yellow-600 text-white'
        }`}>
          {apiStatus === 'checking' && (
            <span className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Verificando API N8N...</span>
            </span>
          )}
          {apiStatus === 'online' && (
            <span className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span>✅ API N8N Online - Endpoint: POST /api/generate-pdf</span>
            </span>
          )}
          {apiStatus === 'offline' && (
            <span className="flex items-center justify-center space-x-2">
              <div className="w-3 h-3 bg-white rounded-full opacity-50"></div>
              <span>❌ API N8N Offline - Verifique o servidor backend</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;