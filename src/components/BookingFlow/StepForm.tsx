import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';

export function StepForm({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { selectedPlan, setQualified } = useBooking();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskPhone(e.target.value);
    setFormData({ ...formData, whatsapp: masked });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!validateEmail(formData.email)) newErrors.email = 'E-mail inválido';
    if (formData.whatsapp.length < 14) newErrors.whatsapp = 'WhatsApp inválido';

    if (Object.keys(newErrors).length === 0) {
      setQualified(true);
      onNext();
    } else {
      setErrors(newErrors);
    }
  };

  const whatsappMessage = encodeURIComponent(`Olá Mariana! Tenho interesse no ${selectedPlan?.title} e gostaria de tirar algumas dúvidas antes de agendar.`);
  const whatsappLink = `https://wa.me/5511956007142?text=${whatsappMessage}`;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-6 flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <button onClick={onBack} className="p-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>
          <h2 className="text-2xl font-bold font-headline text-on-surface dark:text-stone-100">Quase lá!</h2>
        </div>
        <p className="text-on-surface-variant dark:text-stone-400 text-sm">Preencha seus dados para habilitar o agendamento.</p>
      </div>

      <div className="bg-white/10 dark:bg-black/20 p-3 rounded-lg mb-6 border border-white/10 dark:border-white/5 flex-shrink-0">
        <p className="text-xs font-semibold text-primary dark:text-emerald-400 uppercase tracking-wider mb-1">Plano Selecionado</p>
        <p className="font-bold text-on-surface dark:text-stone-100">{selectedPlan?.title}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-4 pb-2">
          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1 ml-1 uppercase">Nome Completo</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Seu nome aqui"
              className={`w-full p-4 rounded-xl border transition-all dark:bg-stone-800 dark:text-white ${
                errors.nome ? 'border-red-500 bg-red-50/30' : 'border-outline/20 focus:border-primary'
              }`}
            />
            {errors.nome && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.nome}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1 ml-1 uppercase">E-mail</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="exemplo@email.com"
              className={`w-full p-4 rounded-xl border transition-all dark:bg-stone-800 dark:text-white ${
                errors.email ? 'border-red-500 bg-red-50/30' : 'border-outline/20 focus:border-primary'
              }`}
            />
            {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 mb-1 ml-1 uppercase">WhatsApp</label>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={handlePhoneChange}
              placeholder="(11) 99999-9999"
              className={`w-full p-4 rounded-xl border transition-all dark:bg-stone-800 dark:text-white ${
                errors.whatsapp ? 'border-red-500 bg-red-50/30' : 'border-outline/20 focus:border-primary'
              }`}
            />
            {errors.whatsapp && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.whatsapp}</p>}
          </div>
        </div>

        <div className="pt-4 space-y-3 flex-shrink-0 border-t border-outline/5 dark:border-stone-800 mt-2">
          <button
            type="submit"
            className="w-full py-4 bg-primary dark:bg-emerald-600 text-on-primary dark:text-white rounded-xl font-bold hover:bg-primary/90 dark:hover:bg-emerald-500 transition-all shadow-md active:scale-[0.98]"
          >
            Habilitar Agendamento
          </button>
          
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 text-primary dark:text-emerald-400 font-bold text-sm bg-transparent border-2 border-primary/20 dark:border-emerald-500/20 rounded-xl hover:bg-primary/5 dark:hover:bg-emerald-500/5 transition-all"
          >
            <span className="material-symbols-outlined text-lg">chat</span>
            Tirar dúvidas no WhatsApp
          </a>
        </div>
      </form>
    </div>
  );
}
