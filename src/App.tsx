import React, { useState } from 'react';
import { FileText, Download, User, Mail, Phone, MapPin, GraduationCap, Briefcase, Award, Clock } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  turnoManha: boolean;
  turnoTarde: boolean;
  turnoNoite: boolean;
  
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
    turnoManha: false,
    turnoTarde: false,
    turnoNoite: false,
    experiencia: '',
    cursos: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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
      turnoManha: true,
      turnoTarde: true,
      turnoNoite: false,
      experiencia: 'Analista de Sistemas na Empresa XYZ (2018-2023)\n• Desenvolvimento de aplicações web\n• Manutenção de sistemas legados\n• Trabalho em equipe ágil\n\nEstagiário de TI na Empresa ABC (2017-2018)\n• Suporte técnico aos usuários\n• Instalação e configuração de software',
      cursos: 'Curso de React.js - 40h (2023)\nCertificação AWS Cloud Practitioner (2022)\nCurso de TypeScript - 30h (2021)\nInglês Intermediário - CCAA (2020)'
    });
  };

  const visualizarCurriculo = () => {
    setShowPreview(true);
  };

  const baixarCurriculo = async () => {
    if (!showPreview) {
      alert('Por favor, visualize o currículo primeiro!');
      return;
    }

    setIsGenerating(true);
    
    try {
      const element = document.getElementById('curriculo-preview');
      if (!element) {
        throw new Error('Elemento de pré-visualização não encontrado');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Adicionar apenas uma página com a imagem ajustada
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      const nomeArquivo = formData.nome ? 
        `Curriculo_${formData.nome.replace(/\s+/g, '_')}.pdf` : 
        'Curriculo.pdf';
      
      pdf.save(nomeArquivo);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o PDF. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getTurnosDisponiveis = () => {
    const turnos = [];
    if (formData.turnoManha) turnos.push('Manhã');
    if (formData.turnoTarde) turnos.push('Tarde');
    if (formData.turnoNoite) turnos.push('Noite');
    return turnos.length > 0 ? turnos.join(', ') : 'Não informado';
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
            <div className="flex space-x-3">
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
                disabled={isGenerating || !showPreview}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-500 text-white rounded-lg hover:from-cyan-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>{isGenerating ? 'Gerando...' : 'Baixar PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  <select
                    name="escolaridade"
                    value={formData.escolaridade}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    <option value="Ensino Fundamental Incompleto">Ensino Fundamental Incompleto</option>
                    <option value="Ensino Fundamental Completo">Ensino Fundamental Completo</option>
                    <option value="Ensino Médio Incompleto">Ensino Médio Incompleto</option>
                    <option value="Ensino Médio Completo">Ensino Médio Completo</option>
                    <option value="Ensino Superior Incompleto">Ensino Superior Incompleto</option>
                    <option value="Ensino Superior Completo">Ensino Superior Completo</option>
                    <option value="Pós-graduação">Pós-graduação</option>
                  </select>
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
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="turnoManha"
                    checked={formData.turnoManha}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-teal-800 focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">Manhã</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="turnoTarde"
                    checked={formData.turnoTarde}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-teal-800 focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">Tarde</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="turnoNoite"
                    checked={formData.turnoNoite}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-teal-800 focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">Noite</span>
                </label>
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
                  <div 
                    id="curriculo-preview" 
                    className="bg-white shadow-2xl mx-auto transform origin-top-left overflow-hidden"
                    style={{ 
                      width: '210mm', 
                      height: '297mm', 
                      fontSize: '11px', 
                      lineHeight: '1.5', 
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      scale: 'min(calc(100vw / 210mm), calc((100vh - 200px) / 297mm), 0.5)',
                      transformOrigin: 'top left'
                    }}
                  >
                    <div className="flex h-full">
                      {/* Sidebar */}
                      <div className="w-1/3 bg-gradient-to-br from-slate-800 via-teal-800 to-cyan-800 text-white p-6 relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
                          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
                        </div>
                        
                        <div className="text-center mb-6">
                          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400/30 to-white/10 rounded-full mx-auto mb-3 flex items-center justify-center backdrop-blur-sm border-2 border-white/40 relative overflow-hidden">
                            {/* Padrão geométrico */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 relative">
                                <div className="absolute inset-0 bg-yellow-400/40 rounded-full"></div>
                                <div className="absolute top-2 left-2 w-12 h-12 bg-yellow-400/30 rounded-full"></div>
                                <div className="absolute top-4 left-4 w-8 h-8 bg-yellow-400/50 rounded-full"></div>
                                <div className="absolute top-6 left-6 w-4 h-4 bg-yellow-400/70 rounded-full"></div>
                                <div className="absolute top-1 right-1 w-3 h-3 bg-yellow-400/60 rotate-45 rounded-sm"></div>
                                <div className="absolute bottom-1 left-1 w-3 h-3 bg-yellow-400/60 rotate-45 rounded-sm"></div>
                                <div className="absolute bottom-1 right-1 w-2 h-2 bg-yellow-400/80 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                          <h1 className="text-xl font-bold mb-2 tracking-wide">{formData.nome || 'Seu Nome'}</h1>
                        </div>

                        <div className="space-y-6 relative z-10">
                          <div>
                            <h3 className="text-xs font-bold mb-3 border-b-2 border-white/40 pb-2 tracking-widest">CONTATO</h3>
                            <div className="space-y-3 text-xs">
                              {formData.email && (
                                <div className="flex items-center space-x-3 bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                                  <Mail className="w-4 h-4 text-cyan-200" />
                                  <span className="text-white/90">{formData.email}</span>
                                </div>
                              )}
                              {formData.telefone && (
                                <div className="flex items-center space-x-3 bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                                  <Phone className="w-4 h-4 text-yellow-300" />
                                  <span className="text-white/90">{formData.telefone}</span>
                                </div>
                              )}
                              {formData.endereco && (
                                <div className="flex items-start space-x-3 bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                                  <MapPin className="w-4 h-4 mt-0.5 text-cyan-300" />
                                  <div className="text-white/90">
                                    <div className="font-medium">{formData.endereco}</div>
                                    <div>{formData.cidade}, {formData.estado}</div>
                                    <div className="text-white/70">{formData.cep}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xs font-bold mb-3 border-b-2 border-white/40 pb-2 tracking-widest">DADOS PESSOAIS</h3>
                            <div className="space-y-2 text-xs bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                              {formData.cpf && <div className="text-white/90"><strong className="text-cyan-200">CPF:</strong> {formData.cpf}</div>}
                              {formData.rg && <div className="text-white/90"><strong className="text-cyan-200">RG:</strong> {formData.rg}</div>}
                              {formData.nascimento && <div className="text-white/90"><strong className="text-cyan-200">Nascimento:</strong> {new Date(formData.nascimento).toLocaleDateString('pt-BR')}</div>}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xs font-bold mb-3 border-b-2 border-white/40 pb-2 tracking-widest">DISPONIBILIDADE</h3>
                            <div className="text-xs bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                              <div className="text-white/90 font-medium">{getTurnosDisponiveis()}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Conteúdo Principal */}
                      <div className="w-2/3 p-6 bg-gradient-to-br from-gray-50 to-white">
                        <div className="space-y-6">
                          {formData.escolaridade && (
                            <div>
                              <h3 className="text-lg font-bold text-gray-800 mb-3 pb-2 relative">
                                <span className="text-teal-800 font-extrabold tracking-wide">EDUCAÇÃO</span>
                                <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-teal-800 to-cyan-600 rounded-full"></div>
                              </h3>
                              <div className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-teal-800">
                                <div className="font-bold text-gray-800 text-sm">{formData.escolaridade}</div>
                                {formData.instituicao && <div className="text-gray-600 mt-1 font-medium">{formData.instituicao}</div>}
                              </div>
                            </div>
                          )}

                          {formData.experiencia && (
                            <div>
                              <h3 className="text-lg font-bold text-gray-800 mb-3 pb-2 relative">
                                <span className="text-teal-800 font-extrabold tracking-wide">EXPERIÊNCIA PROFISSIONAL</span>
                                <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-teal-800 to-cyan-600 rounded-full"></div>
                              </h3>
                              <div className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-cyan-600">
                                <div className="text-sm whitespace-pre-line text-gray-700 leading-relaxed">{formData.experiencia}</div>
                              </div>
                            </div>
                          )}

                          {formData.cursos && (
                            <div>
                              <h3 className="text-lg font-bold text-gray-800 mb-3 pb-2 relative">
                                <span className="text-teal-800 font-extrabold tracking-wide">CURSOS E CERTIFICAÇÕES</span>
                                <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-teal-800 to-cyan-600 rounded-full"></div>
                              </h3>
                              <div className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-blue-500">
                                <div className="text-sm whitespace-pre-line text-gray-700 leading-relaxed">{formData.cursos}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
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
      </div>
    </div>
  );
}

export default App;