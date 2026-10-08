import Envelope from './Envelope';
import Countdown from './Countdown';

// Mesma data definida em Countdown.jsx — mantenha sincronizadas
const EVENT_DATE = new Date('2026-10-31T17:00:00');

// Acesso antecipado: /?pass=SENHA_AQUI
const BYPASS_KEY = 'halloween2026';

const EventGate = () => {
  const params = new URLSearchParams(window.location.search);
  const bypass = params.get('pass') === BYPASS_KEY;

  if (bypass || new Date() >= EVENT_DATE) return <Envelope />;
  return <Countdown />;
};

export default EventGate;
