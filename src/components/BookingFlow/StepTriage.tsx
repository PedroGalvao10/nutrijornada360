import { useState } from 'react';
import type { BookingFormData } from '../../context/BookingContext';
import { BfButton, BfBack } from './bfui';

// ============================================================
// STEP: Formulário de triagem — objetivos, saúde, rotina
// ============================================================

const OBJETIVOS = [
  { id: 'emagrecimento', label: 'Emagrecimento', icon: 'monitor_weight' },
  { id: 'hipertrofia', label: 'Hipertrofia', icon: 'fitness_center' },
  { id: 'saude', label: 'Saúde & Bem-estar', icon: 'favorite' },
  { id: 'outro', label: 'Outro', icon: 'more_horiz' },
];

const CONDICOES = [
  'Diabetes', 'Hipertensão', 'Colesterol Alto', 'Ansiedade/Depressão',
  'Problemas Gástricos', 'Alergias Alimentares', 'Intolerância à Lactose',
  'Doença Celíaca', 'Tireoide', 'Nenhuma',
];

interface Props {
  data: BookingFormData;
  onChange: (partial: Partial<BookingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepTriage({ data, onChange, onNext, onBack }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleCondicao = (c: string) => {
    const current = data.condicoesSaude || [];
    if (c === 'Nenhuma') {
      onChange({ condicoesSaude: current.includes('Nenhuma') ? [] : ['Nenhuma'] });
    } else {
      const filtered = current.filter(x => x !== 'Nenhuma');
      onChange({
        condicoesSaude: filtered.includes(c) ? filtered.filter(x => x !== c) : [...filtered, c]
      });
    }
  };

  const handleSubmit = () => {
    const errs: Record<string, string> = {};
    if (!data.objetivo) errs.objetivo = 'Selecione um objetivo';
    if (!data.rotinaAlimentar) errs.rotina = 'Selecione sua rotina alimentar';
    if (!data.praticaExercicio) errs.exercicio = 'Selecione sobre exercícios';
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onNext();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-4 flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <BfBack onClick={onBack} />
          <h2 className="font-headline font-medium text-2xl text-on-background dark:text-stone-100">Triagem inicial</h2>
        </div>
        <p className="text-on-surface-variant dark:text-stone-400 text-sm font-light">
          Me ajude a entender o seu momento atual para personalizar o atendimento.
        </p>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-6 pb-4">
        {/* STEP: Objetivo */}
        <div>
          <label className="block text-[0.62rem] font-extrabold text-tertiary dark:text-ouro-suave mb-2 ml-1 uppercase tracking-[0.16em]">
            Qual seu principal objetivo?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {OBJETIVOS.map(obj => (
              <button
                key={obj.id}
                type="button"
                onClick={() => onChange({ objetivo: obj.id })}
                className={`flex items-center gap-2 p-3 rounded-[16px] border transition-all text-left text-sm ${
                  data.objetivo === obj.id
                    ? 'border-ouro-suave bg-verde-nevoa/50 dark:border-ouro-suave dark:bg-emerald-900/20 text-verde-profundo dark:text-emerald-400'
                    : 'border-surface-variant dark:border-stone-700/50 hover:border-ouro-suave/60'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{obj.icon}</span>
                {obj.label}
              </button>
            ))}
          </div>
          {errors.objetivo && <p className="text-error font-semibold text-[10px] mt-1 ml-1">{errors.objetivo}</p>}
        </div>

        {/* STEP: Descrição do objetivo */}
        {data.objetivo && (
          <div>
            <label className="block text-[0.62rem] font-extrabold text-tertiary dark:text-ouro-suave mb-1.5 ml-1 uppercase tracking-[0.16em]">
              Descreva seu objetivo em poucas palavras (opcional)
            </label>
            <textarea
              value={data.descricaoObjetivo}
              onChange={(e) => onChange({ descricaoObjetivo: e.target.value })}
              placeholder="Ex: Quero perder 10kg mantendo massa muscular..."
              rows={2}
              className="w-full p-3 rounded-[14px] border border-surface-variant focus:border-ouro-suave outline-none focus:ring-2 focus:ring-ouro-suave/40 dark:bg-stone-800 dark:text-white text-sm resize-none transition-all"
            />
          </div>
        )}

        {/* STEP: Condições de saúde */}
        <div>
          <label className="block text-[0.62rem] font-extrabold text-tertiary dark:text-ouro-suave mb-2 ml-1 uppercase tracking-[0.16em]">
            Condições de saúde relevantes
          </label>
          <div className="flex flex-wrap gap-2">
            {CONDICOES.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCondicao(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  (data.condicoesSaude || []).includes(c)
                    ? 'bg-verde-nevoa/70 border-ouro-suave/50 text-verde-profundo dark:bg-emerald-900/30 dark:border-ouro-suave/50 dark:text-emerald-300'
                    : 'border-surface-variant text-on-surface-variant hover:border-ouro-suave/50'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* STEP: Medicamentos */}
        <div>
          <label className="block text-[0.62rem] font-extrabold text-tertiary dark:text-ouro-suave mb-1.5 ml-1 uppercase tracking-[0.16em]">
            Medicamentos em uso (opcional)
          </label>
          <input
            type="text"
            value={data.medicamentos}
            onChange={(e) => onChange({ medicamentos: e.target.value })}
            placeholder="Ex: Metformina, Levotiroxina..."
            className="w-full p-3 rounded-[14px] border border-surface-variant focus:border-ouro-suave outline-none focus:ring-2 focus:ring-ouro-suave/40 dark:bg-stone-800 dark:text-white text-sm transition-all"
          />
        </div>

        {/* STEP: Rotina alimentar */}
        <div>
          <label className="block text-[0.62rem] font-extrabold text-tertiary dark:text-ouro-suave mb-2 ml-1 uppercase tracking-[0.16em]">
            Como é sua rotina alimentar hoje?
          </label>
          <div className="space-y-2">
            {[
              { id: 'regular', label: 'Regular — como em horários consistentes' },
              { id: 'irregular', label: 'Irregular — pulo refeições frequentemente' },
              { id: 'restritiva', label: 'Restritiva — sigo alguma dieta específica' },
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ rotinaAlimentar: opt.id })}
                className={`w-full flex items-center gap-3 p-3 rounded-[16px] border transition-all text-left text-sm ${
                  data.rotinaAlimentar === opt.id
                    ? 'border-ouro-suave bg-verde-nevoa/50 dark:border-ouro-suave dark:bg-emerald-900/20'
                    : 'border-surface-variant dark:border-stone-700/50 hover:border-ouro-suave/60'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  data.rotinaAlimentar === opt.id ? 'border-primary' : 'border-stone-300'
                }`}>
                  {data.rotinaAlimentar === opt.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                {opt.label}
              </button>
            ))}
          </div>
          {errors.rotina && <p className="text-error font-semibold text-[10px] mt-1 ml-1">{errors.rotina}</p>}
        </div>

        {/* STEP: Exercícios */}
        <div>
          <label className="block text-[0.62rem] font-extrabold text-tertiary dark:text-ouro-suave mb-2 ml-1 uppercase tracking-[0.16em]">
            Pratica exercícios físicos?
          </label>
          <div className="space-y-2">
            {[
              { id: 'sim_regular', label: 'Sim, regularmente (3+ vezes/semana)' },
              { id: 'sim_eventual', label: 'Sim, eventualmente' },
              { id: 'nao', label: 'Não pratico atualmente' },
            ].map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ praticaExercicio: opt.id })}
                className={`w-full flex items-center gap-3 p-3 rounded-[16px] border transition-all text-left text-sm ${
                  data.praticaExercicio === opt.id
                    ? 'border-ouro-suave bg-verde-nevoa/50 dark:border-ouro-suave dark:bg-emerald-900/20'
                    : 'border-surface-variant dark:border-stone-700/50 hover:border-ouro-suave/60'
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  data.praticaExercicio === opt.id ? 'border-primary' : 'border-stone-300'
                }`}>
                  {data.praticaExercicio === opt.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                {opt.label}
              </button>
            ))}
          </div>
          {errors.exercicio && <p className="text-error font-semibold text-[10px] mt-1 ml-1">{errors.exercicio}</p>}
        </div>

        {/* STEP: Detalhes do exercício */}
        {data.praticaExercicio && data.praticaExercicio !== 'nao' && (
          <div>
            <label className="block text-[0.62rem] font-extrabold text-tertiary dark:text-ouro-suave mb-1.5 ml-1 uppercase tracking-[0.16em]">
              Quais exercícios pratica? (opcional)
            </label>
            <input
              type="text"
              value={data.detalhesExercicio}
              onChange={(e) => onChange({ detalhesExercicio: e.target.value })}
              placeholder="Ex: Musculação, corrida, pilates..."
              className="w-full p-3 rounded-[14px] border border-surface-variant focus:border-ouro-suave outline-none focus:ring-2 focus:ring-ouro-suave/40 dark:bg-stone-800 dark:text-white text-sm transition-all"
            />
          </div>
        )}
      </div>

      <div className="pt-4 flex-shrink-0 border-t border-surface-variant/60 dark:border-stone-800 mt-2">
        <BfButton type="button" onClick={handleSubmit} data-cursor="Continuar">
          Continuar para o checkout
        </BfButton>
      </div>
    </div>
  );
}
