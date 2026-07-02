// STEP: Identidade anônima do dispositivo para as ferramentas de nutrição.
// Um UUID por navegador (localStorage) enviado no header X-Device-Id —
// substitui a identificação por IP, que vazava dados entre usuários
// atrás do mesmo NAT (rede corporativa, 4G compartilhado).

const STORAGE_KEY = 'nutri_device_id';

export function getDeviceId(): string {
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    // localStorage indisponível (modo privado restrito): sessão efêmera
    return crypto.randomUUID();
  }
}

/** Headers padrão para chamadas às APIs de nutrição */
export function deviceHeaders(): Record<string, string> {
  return { 'X-Device-Id': getDeviceId() };
}
