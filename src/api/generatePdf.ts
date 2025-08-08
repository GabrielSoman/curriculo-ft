import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface CurriculumData {
  // Dados Pessoais
  nome: string;
  cpf?: string;
  rg?: string;
  telefone?: string;
  nascimento?: string;
  
  // Endereço
  cep?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  
  // Contatos
  email?: string;
  telefoneAlternativo?: string;
  
  // Educação
  escolaridade?: string;
  instituicao?: string;
  
  // Disponibilidade
  turnoManha?: boolean;
  turnoTarde?: boolean;
  turnoNoite?: boolean;
  
  // Experiência
  experiencia?: string;
  
  // Cursos
  cursos?: string;
}

export const generatePdfFromJson = async (data: CurriculumData): Promise<Blob> => {
  // Criar elemento temporário para renderizar o currículo
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '-9999px';
  tempContainer.style.width = '210mm';
  tempContainer.style.height = '297mm';
  
  // Função para obter turnos disponíveis
  const getTurnosDisponiveis = () => {
    const turnos = [];
    if (data.turnoManha) turnos.push('Manhã');
    if (data.turnoTarde) turnos.push('Tarde');
    if (data.turnoNoite) turnos.push('Noite');
    return turnos.length > 0 ? turnos.join(', ') : 'Não informado';
  };

  // HTML do currículo
  tempContainer.innerHTML = `
    <div style="
      width: 210mm; 
      height: 297mm; 
      font-size: 11px; 
      line-height: 1.5; 
      font-family: system-ui, -apple-system, sans-serif;
      background: white;
      display: flex;
    ">
      <!-- Sidebar -->
      <div style="
        width: 33.33%; 
        background: linear-gradient(135deg, #1e293b 0%, #0f766e 50%, #0891b2 100%); 
        color: white; 
        padding: 24px; 
        position: relative; 
        overflow: hidden;
      ">
        <!-- Background Pattern -->
        <div style="position: absolute; inset: 0; opacity: 0.1;">
          <div style="position: absolute; top: 0; left: 0; width: 128px; height: 128px; background: white; border-radius: 50%; transform: translate(-64px, -64px);"></div>
          <div style="position: absolute; bottom: 0; right: 0; width: 96px; height: 96px; background: white; border-radius: 50%; transform: translate(48px, 48px);"></div>
        </div>
        
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="
            width: 96px; 
            height: 96px; 
            background: linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(255, 255, 255, 0.1)); 
            border-radius: 50%; 
            margin: 0 auto 12px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            backdrop-filter: blur(4px); 
            border: 2px solid rgba(255, 255, 255, 0.4); 
            position: relative; 
            overflow: hidden;
          ">
            <!-- Padrão geométrico -->
            <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;">
              <div style="width: 64px; height: 64px; position: relative;">
                <div style="position: absolute; inset: 0; background: rgba(251, 191, 36, 0.4); border-radius: 50%;"></div>
                <div style="position: absolute; top: 8px; left: 8px; width: 48px; height: 48px; background: rgba(251, 191, 36, 0.3); border-radius: 50%;"></div>
                <div style="position: absolute; top: 16px; left: 16px; width: 32px; height: 32px; background: rgba(251, 191, 36, 0.5); border-radius: 50%;"></div>
                <div style="position: absolute; top: 24px; left: 24px; width: 16px; height: 16px; background: rgba(251, 191, 36, 0.7); border-radius: 50%;"></div>
                <div style="position: absolute; top: 4px; right: 4px; width: 12px; height: 12px; background: rgba(251, 191, 36, 0.6); transform: rotate(45deg); border-radius: 2px;"></div>
                <div style="position: absolute; bottom: 4px; left: 4px; width: 12px; height: 12px; background: rgba(251, 191, 36, 0.6); transform: rotate(45deg); border-radius: 2px;"></div>
                <div style="position: absolute; bottom: 4px; right: 4px; width: 8px; height: 8px; background: rgba(251, 191, 36, 0.8); border-radius: 50%;"></div>
              </div>
            </div>
          </div>
          <h1 style="font-size: 20px; font-weight: bold; margin-bottom: 8px; letter-spacing: 0.05em;">${data.nome || 'Seu Nome'}</h1>
        </div>

        <div style="position: relative; z-index: 10;">
          ${data.email || data.telefone || data.endereco ? `
          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 12px; font-weight: bold; margin-bottom: 12px; border-bottom: 2px solid rgba(255, 255, 255, 0.4); padding-bottom: 8px; letter-spacing: 0.1em;">CONTATO</h3>
            <div style="font-size: 12px;">
              ${data.email ? `
              <div style="display: flex; align-items: center; margin-bottom: 12px; background: rgba(255, 255, 255, 0.1); padding: 8px; border-radius: 8px; backdrop-filter: blur(4px);">
                <span style="color: #a7f3d0; margin-right: 12px;">✉</span>
                <span style="color: rgba(255, 255, 255, 0.9);">${data.email}</span>
              </div>
              ` : ''}
              ${data.telefone ? `
              <div style="display: flex; align-items: center; margin-bottom: 12px; background: rgba(255, 255, 255, 0.1); padding: 8px; border-radius: 8px; backdrop-filter: blur(4px);">
                <span style="color: #fde047; margin-right: 12px;">📞</span>
                <span style="color: rgba(255, 255, 255, 0.9);">${data.telefone}</span>
              </div>
              ` : ''}
              ${data.endereco ? `
              <div style="display: flex; align-items: flex-start; margin-bottom: 12px; background: rgba(255, 255, 255, 0.1); padding: 8px; border-radius: 8px; backdrop-filter: blur(4px);">
                <span style="color: #67e8f9; margin-right: 12px; margin-top: 2px;">📍</span>
                <div style="color: rgba(255, 255, 255, 0.9);">
                  <div style="font-weight: 500;">${data.endereco}</div>
                  <div>${data.cidade}, ${data.estado}</div>
                  <div style="color: rgba(255, 255, 255, 0.7);">${data.cep}</div>
                </div>
              </div>
              ` : ''}
            </div>
          </div>
          ` : ''}

          ${data.cpf || data.rg || data.nascimento ? `
          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 12px; font-weight: bold; margin-bottom: 12px; border-bottom: 2px solid rgba(255, 255, 255, 0.4); padding-bottom: 8px; letter-spacing: 0.1em;">DADOS PESSOAIS</h3>
            <div style="font-size: 12px; background: rgba(255, 255, 255, 0.1); padding: 12px; border-radius: 8px; backdrop-filter: blur(4px);">
              ${data.cpf ? `<div style="color: rgba(255, 255, 255, 0.9); margin-bottom: 8px;"><strong style="color: #a7f3d0;">CPF:</strong> ${data.cpf}</div>` : ''}
              ${data.rg ? `<div style="color: rgba(255, 255, 255, 0.9); margin-bottom: 8px;"><strong style="color: #a7f3d0;">RG:</strong> ${data.rg}</div>` : ''}
              ${data.nascimento ? `<div style="color: rgba(255, 255, 255, 0.9);"><strong style="color: #a7f3d0;">Nascimento:</strong> ${new Date(data.nascimento).toLocaleDateString('pt-BR')}</div>` : ''}
            </div>
          </div>
          ` : ''}

          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 12px; font-weight: bold; margin-bottom: 12px; border-bottom: 2px solid rgba(255, 255, 255, 0.4); padding-bottom: 8px; letter-spacing: 0.1em;">DISPONIBILIDADE</h3>
            <div style="font-size: 12px; background: rgba(255, 255, 255, 0.1); padding: 12px; border-radius: 8px; backdrop-filter: blur(4px);">
              <div style="color: rgba(255, 255, 255, 0.9); font-weight: 500;">${getTurnosDisponiveis()}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Conteúdo Principal -->
      <div style="width: 66.67%; padding: 24px; background: linear-gradient(135deg, #f9fafb 0%, white 100%);">
        <div>
          ${data.escolaridade ? `
          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 18px; font-weight: bold; color: #374151; margin-bottom: 12px; padding-bottom: 8px; position: relative;">
              <span style="color: #0f766e; font-weight: 800; letter-spacing: 0.05em;">EDUCAÇÃO</span>
              <div style="position: absolute; bottom: 0; left: 0; width: 48px; height: 4px; background: linear-gradient(90deg, #0f766e, #0891b2); border-radius: 2px;"></div>
            </h3>
            <div style="background: white; padding: 12px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); border-left: 4px solid #0f766e;">
              <div style="font-weight: bold; color: #374151; font-size: 14px;">${data.escolaridade}</div>
              ${data.instituicao ? `<div style="color: #6b7280; margin-top: 4px; font-weight: 500;">${data.instituicao}</div>` : ''}
            </div>
          </div>
          ` : ''}

          ${data.experiencia ? `
          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 18px; font-weight: bold; color: #374151; margin-bottom: 12px; padding-bottom: 8px; position: relative;">
              <span style="color: #0f766e; font-weight: 800; letter-spacing: 0.05em;">EXPERIÊNCIA PROFISSIONAL</span>
              <div style="position: absolute; bottom: 0; left: 0; width: 48px; height: 4px; background: linear-gradient(90deg, #0f766e, #0891b2); border-radius: 2px;"></div>
            </h3>
            <div style="background: white; padding: 12px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); border-left: 4px solid #0891b2;">
              <div style="font-size: 14px; white-space: pre-line; color: #374151; line-height: 1.6;">${data.experiencia}</div>
            </div>
          </div>
          ` : ''}

          ${data.cursos ? `
          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 18px; font-weight: bold; color: #374151; margin-bottom: 12px; padding-bottom: 8px; position: relative;">
              <span style="color: #0f766e; font-weight: 800; letter-spacing: 0.05em;">CURSOS E CERTIFICAÇÕES</span>
              <div style="position: absolute; bottom: 0; left: 0; width: 48px; height: 4px; background: linear-gradient(90deg, #0f766e, #0891b2); border-radius: 2px;"></div>
            </h3>
            <div style="background: white; padding: 12px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); border-left: 4px solid #3b82f6;">
              <div style="font-size: 14px; white-space: pre-line; color: #374151; line-height: 1.6;">${data.cursos}</div>
            </div>
          </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(tempContainer);

  try {
    const canvas = await html2canvas(tempContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    return pdf.output('blob');
  } finally {
    document.body.removeChild(tempContainer);
  }
};