import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

export const generatePDFFromElement = async (elementId: string, fileName: string): Promise<Blob> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Elemento de pré-visualização não encontrado');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    width: element.scrollWidth,
    height: element.scrollHeight,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

  return pdf.output('blob');
};

export const downloadPDF = async (elementId: string, fileName: string): Promise<void> => {
  try {
    const blob = await generatePDFFromElement(elementId, fileName);
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  }
};