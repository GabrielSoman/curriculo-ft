import React, { useState } from 'react';
import { Download, User, Mail, Phone, MapPin, GraduationCap, Briefcase, Award, Clock, FileText } from 'lucide-react';

interface FormData {
  nome: string;
  cpf: string;
  rg: string;
  telefone: string;
  nascimento: string;
  cep: string;
  endereco: string;
  cidade: string;
  estado: string;
  email: string;
  telefoneAlternativo: string;
  escolaridade: string;
  instituicao: string;
  disponibilidade: string;
  experiencia: string;
  cursos: string;
}

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: 'João Silva Santos',
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    telefone: '(11) 99999-9999',
    nascimento: '1990-05-15',
    cep: '01234-567',
    endereco: 'Rua das Flores, 123',
    cidade: 'São Paulo',
    estado: 'SP',
    email: 'joao@email.com',
    telefoneAlternativo: '(11) 88888-8888',
    escolaridade: 'Ensino Superior Completo',
    instituicao: 'Universidade de São Paulo',
    disponibilidade: 'Manhã, Tarde',
    experiencia: 'Analista de Sistemas na Empresa XYZ (2020-2024)\n• Desenvolvimento de aplicações web\n• Manutenção de sistemas legados\n• Trabalho em equipe ágil\n\nEstagiário de TI na Empresa ABC (2019-2020)\n• Suporte técnico aos usuários\n• Instalação e configuração de software',
    cursos: 'React.js Avançado - Udemy (2023)\nTypeScript Fundamentals - Coursera (2022)\nScrum Master Certification - Scrum Alliance (2021)\nInglês Intermediário - Wizard (2020)'
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:80/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `Curriculo_${formData.nome.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao gerar PDF. Verifique se a API está rodando na porta 80.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Gerador de Currículos</h1>
          <p className="text-gray-300">Crie seu currículo profissional em segundos</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Dados Pessoais */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Dados Pessoais</h3>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">CPF</label>
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">RG</label>
                    <input
                      type="text"
                      name="rg"
                      value={formData.rg}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Data de Nascimento</label>
                  <input
                    type="date"
                    name="nascimento"
                    value={formData.nascimento}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Contato */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Mail className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">Contato</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Telefone *</label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Telefone Alternativo</label>
                  <input
                    type="tel"
                    name="telefoneAlternativo"
                    value={formData.telefoneAlternativo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="w-5 h-5 text-red-400" />
                  <h3 className="text-lg font-semibold text-white">Endereço</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">CEP</label>
                  <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Endereço</label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Cidade</label>
                    <input
                      type="text"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Estado</label>
                    <input
                      type="text"
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Educação */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Educação</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Escolaridade</label>
                  <select
                    name="escolaridade"
                    value={formData.escolaridade}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione...</option>
                    <option value="Ensino Fundamental Incompleto">Ensino Fundamental Incompleto</option>
                    <option value="Ensino Fundamental Completo">Ensino Fundamental Completo</option>
                    <option value="Ensino Médio Incompleto">Ensino Médio Incompleto</option>
                    <option value="Ensino Médio Completo">Ensino Médio Completo</option>
                    <option value="Ensino Superior Incompleto">Ensino Superior Incompleto</option>
                    <option value="Ensino Superior Completo">Ensino Superior Completo</option>
                    <option value="Pós-graduação">Pós-graduação</option>
                    <option value="Mestrado">Mestrado</option>
                    <option value="Doutorado">Doutorado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Instituição</label>
                  <input
                    type="text"
                    name="instituicao"
                    value={formData.instituicao}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Disponibilidade</label>
                  <input
                    type="text"
                    name="disponibilidade"
                    value={formData.disponibilidade}
                    onChange={handleInputChange}
                    placeholder="Ex: Manhã, Tarde, Noite"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Experiência */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Briefcase className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Experiência Profissional</h3>
              </div>
              <div>
                <textarea
                  name="experiencia"
                  value={formData.experiencia}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Descreva sua experiência profissional..."
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Cursos */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Award className="w-5 h-5 text-orange-400" />
                <h3 className="text-lg font-semibold text-white">Cursos e Certificações</h3>
              </div>
              <div>
                <textarea
                  name="cursos"
                  value={formData.cursos}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Liste seus cursos e certificações..."
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Botão */}
            <div className="mt-8 text-center">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Gerando PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Gerar Currículo PDF
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;