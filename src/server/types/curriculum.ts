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

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}