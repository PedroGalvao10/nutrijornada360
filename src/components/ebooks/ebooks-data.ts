// Dados estáticos do módulo de e-books (extraídos de Artigos.tsx)

export interface Ebook {
  id: number;
  title: string;
  pdfUrl: string;
}

export const EBOOKS: Ebook[] = [
  {
    id: 1,
    title: 'Guia Completo: Nutrição Descomplicada O Ano Todo',
    pdfUrl: '#', // placeholder
  },
  {
    id: 2,
    title: '10 Receitas Rápidas e Saudáveis',
    pdfUrl: '#', // placeholder
  },
];

export const GOAL_OPTIONS = [
  'Perda de peso',
  'Ganho de massa muscular',
  'Melhora do sono',
  'Saúde intestinal',
  'Equilíbrio hormonal',
  'Redução do estresse',
  'Alimentação saudável',
  'Outro',
];

export interface EbookLeadFormData {
  name: string;
  email: string;
  goals: string[];
  consentMarketing: boolean;
  consentNewsletter: boolean;
}

export const EMPTY_LEAD_FORM: EbookLeadFormData = {
  name: '',
  email: '',
  goals: [],
  consentMarketing: false,
  consentNewsletter: false,
};
