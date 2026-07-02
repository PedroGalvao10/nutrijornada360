// Dados estáticos do módulo de e-books (extraídos de Artigos.tsx)

export interface Ebook {
  id: number;
  title: string;
  imageUrl: string;
  pdfUrl: string;
}

export const EBOOKS: Ebook[] = [
  {
    id: 1,
    title: 'Guia Completo: Nutrição Descomplicada O Ano Todo',
    imageUrl: 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?auto=format&fit=crop&w=400&q=80',
    pdfUrl: '#', // placeholder
  },
  {
    id: 2,
    title: '10 Receitas Rápidas e Saudáveis',
    imageUrl: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=400&q=80',
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
