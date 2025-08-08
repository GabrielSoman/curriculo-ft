import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

interface CurriculumData {
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

interface CurriculumPreviewProps {
  data: CurriculumData;
}

const CurriculumPreview: React.FC<CurriculumPreviewProps> = ({ data }) => {
  return (
    <div 
      id="curriculo-preview" 
      className="bg-white shadow-2xl mx-auto transform origin-top-left overflow-hidden"
      style={{ 
        width: '210mm', 
        height: '297mm', 
        fontSize: '11px', 
        lineHeight: '1.5', 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        transform: 'scale(min(calc(100vw / 210mm), calc((100vh - 200px) / 297mm), 0.5))',
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
            <h1 className="text-xl font-bold mb-2 tracking-wide">{data.nome || 'Seu Nome'}</h1>
          </div>

          <div className="space-y-6 relative z-10">
            <div>
              <h3 className="text-xs font-bold mb-3 border-b-2 border-white/40 pb-2 tracking-widest">CONTATO</h3>
              <div className="space-y-3 text-xs">
                {data.email && (
                  <div className="flex items-center space-x-3 bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                    <Mail className="w-4 h-4 text-cyan-200" />
                    <span className="text-white/90">{data.email}</span>
                  </div>
                )}
                {data.telefone && (
                  <div className="flex items-center space-x-3 bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                    <Phone className="w-4 h-4 text-yellow-300" />
                    <span className="text-white/90">{data.telefone}</span>
                  </div>
                )}
                {data.endereco && (
                  <div className="flex items-start space-x-3 bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                    <MapPin className="w-4 h-4 mt-0.5 text-cyan-300" />
                    <div className="text-white/90">
                      <div className="font-medium">{data.endereco}</div>
                      <div>{data.cidade}, {data.estado}</div>
                      <div className="text-white/70">{data.cep}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold mb-3 border-b-2 border-white/40 pb-2 tracking-widest">DADOS PESSOAIS</h3>
              <div className="space-y-2 text-xs bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                {data.cpf && <div className="text-white/90"><strong className="text-cyan-200">CPF:</strong> {data.cpf}</div>}
                {data.rg && <div className="text-white/90"><strong className="text-cyan-200">RG:</strong> {data.rg}</div>}
                {data.nascimento && <div className="text-white/90"><strong className="text-cyan-200">Nascimento:</strong> {new Date(data.nascimento).toLocaleDateString('pt-BR')}</div>}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold mb-3 border-b-2 border-white/40 pb-2 tracking-widest">DISPONIBILIDADE</h3>
              <div className="text-xs bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <div className="text-white/90 font-medium">{data.disponibilidade || 'Não informado'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="w-2/3 p-6 bg-gradient-to-br from-gray-50 to-white">
          <div className="space-y-6">
            {data.escolaridade && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 pb-2 relative">
                  <span className="text-teal-800 font-extrabold tracking-wide">EDUCAÇÃO</span>
                  <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-teal-800 to-cyan-600 rounded-full"></div>
                </h3>
                <div className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-teal-800">
                  <div className="font-bold text-gray-800 text-sm">{data.escolaridade}</div>
                  {data.instituicao && <div className="text-gray-600 mt-1 font-medium">{data.instituicao}</div>}
                </div>
              </div>
            )}

            {data.experiencia && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 pb-2 relative">
                  <span className="text-teal-800 font-extrabold tracking-wide">EXPERIÊNCIA PROFISSIONAL</span>
                  <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-teal-800 to-cyan-600 rounded-full"></div>
                </h3>
                <div className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-cyan-600">
                  <div className="text-sm whitespace-pre-line text-gray-700 leading-relaxed">{data.experiencia}</div>
                </div>
              </div>
            )}

            {data.cursos && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3 pb-2 relative">
                  <span className="text-teal-800 font-extrabold tracking-wide">CURSOS E CERTIFICAÇÕES</span>
                  <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-teal-800 to-cyan-600 rounded-full"></div>
                </h3>
                <div className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-blue-500">
                  <div className="text-sm whitespace-pre-line text-gray-700 leading-relaxed">{data.cursos}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumPreview;