import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Envelope = () => {
  const [phase, setPhase] = useState('entering');
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setPhase('idle'), 1000);
    return () => clearTimeout(t);
  }, []);

  const openEnvelope = () => {
    if (phase !== 'idle') return;
    setPhase('cracking');
    setTimeout(() => setPhase('opening'), 700);
    setTimeout(() => setPhase('rising'), 2100);
    setTimeout(() => setPhase('leaving'), 3600);
    setTimeout(() => navigate('/home'), 4400);
  };

  const isOpen    = phase === 'opening' || phase === 'rising' || phase === 'leaving';
  const isRising  = phase === 'rising'  || phase === 'leaving';
  const isLeaving = phase === 'leaving';

  return (
    <div className={`env-scene${isLeaving ? ' env-scene--out' : ''}`}>
      <div
        className={`env-stage${phase === 'entering' ? ' env-stage--in' : ''}`}
        onClick={openEnvelope}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && openEnvelope()}
        aria-label="Abrir envelope"
      >
        {/* Letter — starts inside the envelope (z-index below body), rises above it */}
        <div className={`env-letter${isRising ? ' env-letter--up' : ''}`}>
          <div className="flex flex-col justify-center items-center env-letter-content">
            <img src="/brasao.png" className="w-12 h-12 mx-auto" alt="" />
            <div className="ornamental-line my-3">
              <span className="text-[#5a351b] text-xs">✦</span>
            </div>
            <p className="font-script text-4xl text-center text-red-900 leading-tight">
              Testamento Maldito
            </p>
            <p className="font-old text-xs italic text-center text-[#6b4520]/65 mt-3">
              Você foi escolhido...
            </p>
          </div>
        </div>

        {/* Envelope body */}
        <div className="env-body">
          {/* Fold decoration lines */}
          <div className="env-folds" />

          {/* Flap wrapper (sets 3-D perspective) */}
          <div className="env-flap-persp">
            <div className={`env-flap${isOpen ? ' env-flap--open' : ''}`}>
              {/* Wax seal */}
              <div
                className={[
                  'env-wax',
                  phase === 'cracking' ? 'env-wax--shake' : '',
                  isOpen             ? 'env-wax--gone'  : '',
                ].join(' ')}
              >
                <div className="env-wax-ring" />
                <span className="font-gothic text-xl text-[#e8c08a] relative z-10">✠</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {phase === 'idle' && (
        <p className="font-old text-[#9a7050]/50 text-xs tracking-[0.5em] uppercase mt-10 animate-pulse select-none">
          toque para abrir
        </p>
      )}
    </div>
  );
};

export default Envelope;
