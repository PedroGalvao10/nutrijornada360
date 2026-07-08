import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import type { BookingFormData } from '../../context/BookingContext';
import { BfField, BfButton, BfBack } from './bfui';

// ============================================================
// STEP: Formulário de dados pessoais expandido
// Nome, Email, WhatsApp, CPF, Data de Nascimento
// (validação e máscaras intactas — apenas a pele migrou para
// o kit bfui / Editorial Orgânico)
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
          <BfBack onClick={onBack} />
          <h2 className="font-headline font-medium text-2xl text-on-background dark:text-stone-100">Seus dados</h2>
        </div>
        <p className="text-on-surface-variant dark:text-stone-400 text-sm font-light">Preencha os seus dados pessoais para o contrato.</p>
      </div>

      {selectedPlan && (
        <div className="bg-verde-nevoa/50 dark:bg-emerald-900/20 p-3.5 rounded-[16px] mb-4 border border-ouro-suave/30 flex-shrink-0">
          <p className="text-[0.6rem] font-extrabold text-tertiary dark:text-ouro-suave uppercase tracking-[0.18em] mb-1">Plano selecionado</p>
          <p className="font-headline font-medium text-on-background dark:text-stone-100">{selectedPlan.title} — {selectedPlan.price}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-3 pb-2">
          <BfField
            label="Nome completo"
            type="text"
            value={data.nome}
            onChange={(e) => onChange({ nome: e.target.value })}
            placeholder="Seu nome completo"
            error={errors.nome}
          />

          <BfField
            label="E-mail"
            type="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="exemplo@email.com"
            error={errors.email}
          />

          <BfField
            label="WhatsApp"
            type="text"
            value={data.whatsapp}
            onChange={(e) => onChange({ whatsapp: maskPhone(e.target.value) })}
            placeholder="(11) 99999-9999"
            error={errors.whatsapp}
          />

          <BfField
            label="CPF"
            type="text"
            value={data.cpf}
            onChange={(e) => onChange({ cpf: maskCPF(e.target.value) })}
            placeholder="000.000.000-00"
            maxLength={14}
            error={errors.cpf}
          />

          <BfField
            label="Data de nascimento (opcional)"
            type="date"
            value={data.dataNascimento}
            onChange={(e) => onChange({ dataNascimento: e.target.value })}
          />
        </div>

        <div className="pt-4 flex-shrink-0 border-t border-surface-variant/60 dark:border-stone-800 mt-2">
          <BfButton type="submit" data-cursor="Continuar">
            Continuar para a triagem
          </BfButton>
        </div>
      </form>
    </div>
  );
}
