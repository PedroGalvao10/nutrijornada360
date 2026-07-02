import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import type { BookingFormData } from '../../context/BookingContext';

// ============================================================
// STEP: Formulário de dados pessoais expandido
// Nome, Email, WhatsApp, CPF, Data de Nascimento
// ============================================================

interface Props {
  data: BookingFormData;
  onChange: (partial: Partial<BookingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepForm({ data, onChange, onNext, onBack }: Props) {
  const { selectedPlan } = useBooking();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!data.nome.trim()) errs.nome = 'Nome é obrigatório';
    if (!validateEmail(data.email)) errs.email = 'E-mail inválido';
    if (data.whatsapp.length < 14) errs.whatsapp = 'WhatsApp inválido';
    if (data.cpf.length < 14) errs.cpf = 'CPF inválido';

    if (Object.keys(errs).length === 0) {
      onNext();
    } else {
      setErrors(errs);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-4 flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <button onClick={onBack} className="p-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>
          <h2 className="text-2xl font-bold font-headline text-on-surface dark:text-stone-100">Seus Dados</h2>
        </div>
        <p className="text-on-surface-variant dark:text-stone-400 text-sm">Preencha seus dados pessoais para o contrato.</p>
      </div>

      {selectedPlan && (
        <div className="bg-white/10 dark:bg-black/20 p-3 rounded-lg mb-4 border border-white/10 dark:border-white/5 flex-shrink-0">
          <p className="text-xs font-semibold text-primary dark:text-emerald-400 uppercase tracking-wider mb-1">Plano Selecionado</p>
          <p className="font-bold text-on-surface dark:text-stone-100">{selectedPlan.title} — {selectedPlan.price}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-3 pb-2">
          {/* Nome */}
          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1 ml-1 uppercase">Nome Completo</label>
            <input type="text" value={data.nome}
              onChange={(e) => onChange({ nome: e.target.value })}
              placeholder="Seu nome completo"
              className={`w-full p-3.5 rounded-xl border transition-all dark:bg-stone-800 dark:text-white text-sm ${errors.nome ? 'border-red-500 bg-red-50/30' : 'border-outline/20 focus:border-primary'}`}
            />
            {errors.nome && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.nome}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1 ml-1 uppercase">E-mail</label>
            <input type="email" value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="exemplo@email.com"
              className={`w-full p-3.5 rounded-xl border transition-all dark:bg-stone-800 dark:text-white text-sm ${errors.email ? 'border-red-500 bg-red-50/30' : 'border-outline/20 focus:border-primary'}`}
            />
            {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.email}</p>}
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1 ml-1 uppercase">WhatsApp</label>
            <input type="text" value={data.whatsapp}
              onChange={(e) => onChange({ whatsapp: maskPhone(e.target.value) })}
              placeholder="(11) 99999-9999"
              className={`w-full p-3.5 rounded-xl border transition-all dark:bg-stone-800 dark:text-white text-sm ${errors.whatsapp ? 'border-red-500 bg-red-50/30' : 'border-outline/20 focus:border-primary'}`}
            />
            {errors.whatsapp && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.whatsapp}</p>}
          </div>

          {/* CPF */}
          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1 ml-1 uppercase">CPF</label>
            <input type="text" value={data.cpf}
              onChange={(e) => onChange({ cpf: maskCPF(e.target.value) })}
              placeholder="000.000.000-00"
              maxLength={14}
              className={`w-full p-3.5 rounded-xl border transition-all dark:bg-stone-800 dark:text-white text-sm ${errors.cpf ? 'border-red-500 bg-red-50/30' : 'border-outline/20 focus:border-primary'}`}
            />
            {errors.cpf && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.cpf}</p>}
          </div>

          {/* Data de Nascimento */}
          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1 ml-1 uppercase">Data de Nascimento (opcional)</label>
            <input type="date" value={data.dataNascimento}
              onChange={(e) => onChange({ dataNascimento: e.target.value })}
              className="w-full p-3.5 rounded-xl border border-outline/20 focus:border-primary transition-all dark:bg-stone-800 dark:text-white text-sm"
            />
          </div>
        </div>

        <div className="pt-4 flex-shrink-0 border-t border-outline/5 dark:border-stone-800 mt-2">
          <button type="submit"
            className="w-full py-4 bg-primary dark:bg-emerald-600 text-on-primary dark:text-white rounded-xl font-bold hover:bg-primary/90 dark:hover:bg-emerald-500 transition-all shadow-md active:scale-[0.98]"
          >
            Continuar para Triagem
          </button>
        </div>
      </form>
    </div>
  );
}
