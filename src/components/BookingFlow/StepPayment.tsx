import { useState, useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';

// ============================================================
// STEP: Pagamento PIX — QR Code + Chave + Countdown 2h
// ============================================================

const PIX_KEY = '11956007142';
const PIX_KEY_DISPLAY = '(11) 95600-7142';
const WHATSAPP_NUMBER = '5511956007142';

/**
 * STEP: Gera payload PIX simplificado (chave + valor)
 * Para QR Code estático com chave de telefone
 */
function generatePixPayload(key: string, amount: number, name: string): string {
  // Formato simplificado — payload EMV para PIX
  const formatField = (id: string, value: string) => {
    return `${id}${value.length.toString().padStart(2, '0')}${value}`;
  };

  const gui = formatField('00', 'br.gov.bcb.pix');
  const chave = formatField('01', '+55' + key);
  const merchantAccount = formatField('26', gui + chave);

  let payload = '';
  payload += formatField('00', '01'); // Format Indicator
  payload += merchantAccount;
  payload += formatField('52', '0000'); // MCC
  payload += formatField('53', '986'); // BRL
  if (amount > 0) {
    payload += formatField('54', (amount / 100).toFixed(2));
  }
  payload += formatField('58', 'BR');
  payload += formatField('59', name.substring(0, 25));
  payload += formatField('60', 'SAO PAULO');
  payload += formatField('62', formatField('05', '***'));

  // STEP: CRC16 (CCITT-FALSE)
  payload += '6304';
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) crc = (crc << 1) ^ 0x1021;
      else crc <<= 1;
      crc &= 0xFFFF;
    }
  }
  return payload + crc.toString(16).toUpperCase().padStart(4, '0');
}

interface Props {
  onComplete: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function StepPayment(_props: Props) {
  const { selectedPlan, paymentDeadline, activeBookingToken } = useBooking();
  const [timeLeft, setTimeLeft] = useState('');
  const [copied, setCopied] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  // STEP: Countdown timer
  useEffect(() => {
    if (!paymentDeadline) return;

    const tick = () => {
      const now = new Date().getTime();
      const deadline = new Date(paymentDeadline).getTime();
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft('Expirado');
        setIsExpired(true);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [paymentDeadline]);

  const copyKey = async () => {
    await navigator.clipboard.writeText(PIX_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!selectedPlan) return null;

  const pixPayload = generatePixPayload(PIX_KEY, selectedPlan.priceCents, 'MARIANA BERMUDES');
  const whatsappMsg = encodeURIComponent(
    `Olá Mariana! Acabei de realizar o pagamento PIX do plano ${selectedPlan.title}. Segue meu comprovante.`
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="mb-3 flex-shrink-0">
        <h2 className="text-2xl font-bold font-headline text-on-surface dark:text-stone-100 mb-2">
          Contrato Aprovado! 🎉
        </h2>
        <p className="text-on-surface-variant dark:text-stone-400 text-sm">
          Sua vaga foi reservada. Realize o pagamento para confirmar.
        </p>
      </div>

      <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-4 pb-4">
        {/* STEP: Countdown */}
        <div className={`text-center p-3 rounded-xl border ${
          isExpired 
            ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20'
            : 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20'
        }`}>
          <p className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">Tempo restante</p>
          <p className={`text-2xl font-mono font-bold ${
            isExpired ? 'text-red-500' : 'text-amber-600 dark:text-amber-400'
          }`}>
            {timeLeft}
          </p>
        </div>

        {/* STEP: QR Code PIX */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center p-5 bg-white dark:bg-stone-900 rounded-2xl border border-outline/10 dark:border-stone-700/20"
        >
          <div className="bg-white p-3 rounded-xl mb-3">
            <QRCodeSVG
              value={pixPayload}
              size={180}
              level="M"
              includeMargin={false}
            />
          </div>
          <p className="text-xs text-stone-500 mb-2">Escaneie com o app do seu banco</p>
          <p className="text-2xl font-bold text-primary dark:text-emerald-400">{selectedPlan.price}</p>
        </motion.div>

        {/* STEP: Chave PIX para cópia */}
        <div className="flex items-center gap-2 bg-stone-50 dark:bg-stone-800/50 p-3 rounded-xl">
          <div className="flex-grow">
            <p className="text-[10px] text-stone-400 uppercase tracking-wider">Chave PIX (Telefone)</p>
            <p className="font-mono font-bold text-on-surface dark:text-stone-100">{PIX_KEY_DISPLAY}</p>
          </div>
          <button
            onClick={copyKey}
            className="px-3 py-2 bg-primary/10 dark:bg-emerald-500/10 text-primary dark:text-emerald-400 rounded-lg text-xs font-bold hover:bg-primary/20 transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">
              {copied ? 'check' : 'content_copy'}
            </span>
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>

        {/* STEP: Enviar comprovante via WhatsApp */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-4 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#20BD5A] transition-all shadow-md active:scale-[0.98]"
        >
          <span className="material-symbols-outlined">chat</span>
          Enviar Comprovante via WhatsApp
        </a>

        {/* STEP: Download do contrato */}
        {activeBookingToken && (
          <a
            href={`/api/booking/contract-pdf/${activeBookingToken}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 text-primary dark:text-emerald-400 border-2 border-primary/20 dark:border-emerald-500/20 rounded-xl font-bold text-sm hover:bg-primary/5 dark:hover:bg-emerald-500/5 transition-all"
          >
            <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
            Baixar Contrato Aprovado (PDF)
          </a>
        )}
      </div>
    </div>
  );
}
