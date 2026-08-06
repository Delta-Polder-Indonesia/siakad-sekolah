const DEFAULT_DENDA_PER_HARI = 1000;

export function getDendaConfig(): number {
  const saved = localStorage.getItem('perpus-denda-per-hari');
  return saved ? parseInt(saved, 10) : DEFAULT_DENDA_PER_HARI;
}

export function setDendaConfig(amount: number) {
  localStorage.setItem('perpus-denda-per-hari', String(amount));
}
