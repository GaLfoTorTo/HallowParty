import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Altere esta data para o momento exato em que o site deve abrir ──
const EVENT_DATE = new Date('2026-10-31T20:00:00');

function getTimeLeft() {
  const diff = EVENT_DATE - new Date();
  if (diff <= 0) return null;
  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);
  const navigate = useNavigate();

  useEffect(() => {
    if (!timeLeft) {
      navigate('/', { replace: true });
      return;
    }
    const id = setInterval(() => {
      const t = getTimeLeft();
      setTimeLeft(t);
      if (!t) {
        clearInterval(id);
        navigate('/', { replace: true });
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-center bg-page min-h-screen p-5 md:p-10">
      <main className="paper w-full max-w-3xl px-8! py-10! md:px-16! md:py-14! overflow-hidden fade">

        {/* Manchas de sangue */}
        <div className="blood top-10 right-40 opacity-60" />
        <div className="blood bottom-20 left-4 opacity-40" />
        <div className="blood top-1/2 right-2 opacity-30" />

        <div className="relative z-10">

          {/* Cabeçalho ornamental */}
          <header className="text-center mb-8">
            <div className="ornamental-line my-4">
              <img src="/brasao.png" className="w-10 h-10" alt="" />
            </div>
            <p className="font-title text-xs tracking-[0.5em] uppercase text-[#65421f] mt-4">
              O DESTINO SE APROXIMA
            </p>
          </header>

          {/* Título */}
          <section className="text-center mb-10">
            <h1 className="font-script text-5xl md:text-7xl text-red-900 countdown-flicker my-4!">
              O Testamento Maldito
            </h1>
            <p className="font-script text-3xl text-red-900 mt-6 opacity-80 candle my-4!">
              Em Breve
            </p>
            <p className="font-old italic text-[#55381f] mt-4 text-lg">
              O testamento ainda não está pronto para ser revelado...
            </p>
          </section>

          {/* Grid de unidades */}
          {timeLeft && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 my-10">
              {[
                { value: timeLeft.days,    label: 'DIAS' },
                { value: timeLeft.hours,   label: 'HORAS' },
                { value: timeLeft.minutes, label: 'MINUTOS' },
                { value: timeLeft.seconds, label: 'SEGUNDOS' },
              ].map(({ value, label }) => (
                <div key={label} className="countdown-unit">
                  <div className="countdown-number">
                    {String(value).padStart(2, '0')}
                  </div>
                  <div className="countdown-label">{label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Mensagem */}
          <section className="text-center mt-6">
            <p className="font-old text-[#55381f] text-base leading-relaxed max-w-xl mx-auto my-4!">
              Quando chegada a hora, as portas desta mansão se abrirão.
              Até lá, aguarde sua convocação com paciência... ou receio.
            </p>
            <p className="font-script text-3xl text-red-900 mt-6 opacity-80 candle my-4!">
              Os mortos veem tudo.
            </p>
          </section>

          {/* Separador final */}
          <div className="ornamental-line mt-10! mb-4!">
            <img src="/brasao.png" className="w-8 h-8 img-parchment" alt="" />
          </div>

        </div>
      </main>
    </div>
  );
};

export default Countdown;
