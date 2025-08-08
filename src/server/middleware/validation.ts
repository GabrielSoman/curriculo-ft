import { Request, Response, NextFunction } from 'express';
import { CurriculumData } from '../types/curriculum.js';

export function validateCurriculumData(req: Request, res: Response, next: NextFunction) {
  const data: CurriculumData = req.body;
  
  // Validações básicas
  if (!data.nome || data.nome.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Nome é obrigatório',
      message: 'O campo nome deve ser preenchido'
    });
  }
  
  // Validação de email (se fornecido)
  if (data.email && !isValidEmail(data.email)) {
    return res.status(400).json({
      success: false,
      error: 'Email inválido',
      message: 'Formato de email inválido'
    });
  }
  
  // Validação de CPF (se fornecido)
  if (data.cpf && !isValidCPF(data.cpf)) {
    return res.status(400).json({
      success: false,
      error: 'CPF inválido',
      message: 'Formato de CPF inválido'
    });
  }
  
  // Sanitização dos dados
  req.body = sanitizeData(data);
  
  next();
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validação dos dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
}

function sanitizeData(data: CurriculumData): CurriculumData {
  return {
    ...data,
    nome: data.nome?.trim(),
    email: data.email?.trim().toLowerCase(),
    telefone: data.telefone?.trim(),
    telefoneAlternativo: data.telefoneAlternativo?.trim(),
    endereco: data.endereco?.trim(),
    cidade: data.cidade?.trim(),
    estado: data.estado?.trim().toUpperCase(),
    cep: data.cep?.trim(),
    cpf: data.cpf?.trim(),
    rg: data.rg?.trim(),
    escolaridade: data.escolaridade?.trim(),
    instituicao: data.instituicao?.trim(),
    experiencia: data.experiencia?.trim(),
    cursos: data.cursos?.trim()
  };
}