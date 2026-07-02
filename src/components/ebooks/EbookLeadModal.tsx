import type { FormEvent } from 'react';
import { MagneticButton } from '../ui/MagneticButton';
import { GOAL_OPTIONS, type Ebook, type EbookLeadFormData } from './ebooks-data';

interface Props {
  isOpen: boolean;
  ebook: Ebook | null;
  formData: EbookLeadFormData;
  setFormData: (data: EbookLeadFormData) => void;
  isSubmitting: boolean;
  successMessage: string;
  isValidForm: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  onGoalToggle: (goal: string) => void;
}

// Modal de captura de lead para download de e-book (extraído de Artigos.tsx)
export function EbookLeadModal({
  isOpen, ebook, formData, setFormData, isSubmitting,
  successMessage, isValidForm, onClose, onSubmit, onGoalToggle,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => !isSubmitting && onClose()}></div>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ebook-modal-title"
        className="bg-surface dark:bg-stone-900 relative z-10 w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden border border-outline/10 dark:border-stone-800 flex flex-col max-h-[90vh]"
      >
        <div className="bg-primary/5 dark:bg-emerald-500/10 px-8 pt-8 pb-4 border-b border-outline/10 dark:border-stone-800 relative shrink-0">
          <button onClick={() => !isSubmitting && onClose()} aria-label="Fechar formulário de e-book" className="absolute top-6 right-6 text-on-surface-variant dark:text-stone-400 hover:text-primary dark:hover:text-emerald-400 transition-colors focus:outline-none">
            <span className="material-symbols-outlined">close</span>
          </button>
          <h3 id="ebook-modal-title" className="text-2xl font-headline font-bold text-on-surface dark:text-stone-100 mb-2 leading-tight">Garantir acesso ao E-book</h3>
          <p className="text-on-surface-variant dark:text-stone-300 text-sm flex items-center gap-2"><span className="material-symbols-outlined text-primary dark:text-emerald-400 text-[16px]">check_circle</span> "{ebook?.title}"</p>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar">
          {successMessage ? (
            <div className="flex flex-col items-center justify-center text-center py-8">
              <div className="w-16 h-16 bg-primary/20 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl text-primary dark:text-emerald-400">task_alt</span>
              </div>
              <h4 className="text-xl font-bold text-on-surface dark:text-stone-100 mb-2">Quase lá!</h4>
              <p className="text-on-surface-variant dark:text-stone-300">{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-on-surface dark:text-stone-200 ml-1">Nome Completo *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-surface-container/50 border border-outline/30 px-4 py-3 rounded-xl text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm dark:bg-stone-950 dark:border-stone-700 dark:text-stone-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400" placeholder="Ex: Maria de Souza" required disabled={isSubmitting} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-on-surface dark:text-stone-200 ml-1">E-mail de preferência *</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-surface-container/50 border border-outline/30 px-4 py-3 rounded-xl text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm dark:bg-stone-950 dark:border-stone-700 dark:text-stone-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-400" placeholder="seu@email.com" required disabled={isSubmitting} />
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-sm font-semibold text-on-surface dark:text-stone-200 ml-1">Quais são seus Objetivos de Saúde? *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {GOAL_OPTIONS.map(goal => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => onGoalToggle(goal)}
                      disabled={isSubmitting}
                      className={`text-left px-4 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                        formData.goals.includes(goal)
                          ? 'bg-primary/10 border-primary text-primary shadow-sm dark:bg-emerald-500/20 dark:border-emerald-400 dark:text-emerald-400'
                          : 'bg-surface-container/30 border-outline/20 text-on-surface-variant hover:border-primary/40 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300 dark:hover:border-emerald-400/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">
                          {formData.goals.includes(goal) ? 'check_box' : 'check_box_outline_blank'}
                        </span>
                        {goal}
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-on-surface-variant/70 dark:text-stone-400/70 italic ml-1">* Selecione pelo menos uma opção</p>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center mt-0.5">
                    <input type="checkbox" checked={formData.consentMarketing} onChange={(e) => setFormData({ ...formData, consentMarketing: e.target.checked })} className="peer w-5 h-5 appearance-none border-2 border-outline rounded-md checked:bg-primary checked:border-primary transition-colors cursor-pointer dark:border-stone-600 dark:checked:bg-emerald-500 dark:checked:border-emerald-500" required disabled={isSubmitting} />
                    <span className="material-symbols-outlined absolute inset-0 text-white dark:text-stone-900 opacity-0 peer-checked:opacity-100 pointer-events-none text-xl leading-[1.2]">check</span>
                  </div>
                  <span className="text-xs text-on-surface-variant dark:text-stone-300 leading-relaxed">
                    Concordo em receber e-mails com conteúdos, novidades e comunicações de marketing. *
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center mt-0.5">
                    <input type="checkbox" checked={formData.consentNewsletter} onChange={(e) => setFormData({ ...formData, consentNewsletter: e.target.checked })} className="peer w-5 h-5 appearance-none border-2 border-outline rounded-md checked:bg-primary checked:border-primary transition-colors cursor-pointer dark:border-stone-600 dark:checked:bg-emerald-500 dark:checked:border-emerald-500" disabled={isSubmitting} />
                    <span className="material-symbols-outlined absolute inset-0 text-white dark:text-stone-900 opacity-0 peer-checked:opacity-100 pointer-events-none text-xl leading-[1.2]">check</span>
                  </div>
                  <span className="text-xs text-on-surface-variant dark:text-stone-300 leading-relaxed">
                    Gostaria de me inscrever na Newsletter para receber novos artigos e materiais (opcional).
                  </span>
                </label>
              </div>

              <MagneticButton as="div" className="mt-4">
                <button type="submit" disabled={!isValidForm || isSubmitting} className="w-full bg-primary text-on-primary dark:bg-emerald-500 dark:text-stone-950 font-bold py-4 rounded-xl shadow-md transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  ) : (
                    <>Confirmar e Liberar Download <span className="material-symbols-outlined text-[18px]">download</span></>
                  )}
                </button>
              </MagneticButton>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
