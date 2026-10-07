import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, clearSession } from '../services/session';
import { api } from '../services/api';
import '../css/tasks.css';

const trilhas = [
  {
    key: 'fantasma',
    img: '/ghost.png',
    nome: 'Fantasma',
    subtitulo: 'Almas Perdidas',
    descricao: 'Espíritos do mistério. Investigam, buscam, decifram o que os vivos ignoram.',
    lore: 'Vagam entre os dois mundos, colhendo segredos que nenhum mortal ousaria tocar.',
    habilidades: ['Investigação', 'Disfarce', 'Comunicação'],
    elemento: 'Névoa',
    accentVar: '--fantasma',
    accentHex: '#7b9fbf',
    bgClass: 'card-fantasma',
  },
  {
    key: 'vampiro',
    img: '/vamp.png',
    nome: 'Vampiro',
    subtitulo: 'Senhores da Noite',
    descricao: 'Senhores da sedução. Dominam os salões, os cálices e as alianças da noite.',
    lore: 'Eternos e implacáveis, tecem conspirações à luz de velas enquanto os mortais dormem.',
    habilidades: ['Sedução', 'Negociação', 'Furtividade'],
    elemento: 'Sangue',
    accentVar: '--vampiro',
    accentHex: '#cc2244',
    bgClass: 'card-vampiro',
  },
  {
    key: 'zumbi',
    img: '/zombie.png',
    nome: 'Zumbi',
    subtitulo: 'Filhos do Caos',
    descricao: 'Filhos do caos. Onde pisam, a festa irrompe — e os ossos não param de dançar.',
    lore: 'Imparáveis e imprevisíveis, transformam qualquer salão numa dança macabra e gloriosa.',
    habilidades: ['Força', 'Resistência', 'Intimidação'],
    elemento: 'Podridão',
    accentVar: '--zumbi',
    accentHex: '#6a9944',
    bgClass: 'card-zumbi',
  },
];

const CATEGORIA_LABEL = {
  investigacao: 'Investigação',
  observacao: 'Observação',
  pessoas: 'Pessoas',
  enigmas: 'Enigmas',
  bebidas: 'Bebidas',
  comidas: 'Comidas',
  comida: 'Comidas',
  interacao: 'Interação',
  social: 'Social',
  desafios: 'Desafios',
  musica: 'Música',
};

function Tasks() {
  const navigate = useNavigate();
  const [resetting, setResetting] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const session = getSession();
  const missions = session?.missions ?? [];
  const user = session?.user;
  const trilha = trilhas.find(i => i.key == session?.trilha);
  const total = missions.length;
  const done = missions.filter((m) => m.completed).length;

  const byCategoria = missions.reduce((acc, m) => {
    const cat = m.categoria ?? 'outros';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(m);
    return acc;
  }, {});

  async function confirmReset() {
    setShowResetModal(false);
    setResetting(true);
    try {
      if (user?.id) await api.resetUser(user.id);
    } finally {
      clearSession();
      navigate('/home');
    }
  }

  function handleMissionClick(mission) {
    if (mission.completed) return;
    navigate('/validar', { state: { mission } });
  }

  return (
    <div className="flex items-center justify-center bg-page min-h-screen p-5 md:p-10">
      <main className="paper w-full max-w-4xl px-8! py-10! md:px-20! md:py-10! overflow-hidden fade">

        {/* Manchas de sangue */}
        <div className="blood top-16 right-60" />
        <div className="blood top-120 right-5 opacity-50" />
        <div className="blood bottom-28 left-2 opacity-40" />

        <div className="relative z-10">
          <header className="text-center">
            <div className="ornamental-line my-8">
              <img src="/brasao.png" className="w-10 h-10 img-parchment" alt="" />
            </div>
          </header>

          <section className="flex flex-col gap-7 py-5! font-old text-(--text) text-xl text-justify!">
            <h1 className="font-script text-center text-5xl md:text-7xl text-red-900 leading-none">
              O Testamento Maldito
            </h1>

            {/* Saudação */}
            {user && (
              <p className="font-script text-4xl text-(--text)">
                Olá, <span>{user.nome}</span>
              </p>
            )}

            {/* Trilha escolhida */}
            {trilha && (
              <div
                className={`flex justify-between items-center gap-4 border rounded-lg p-4! mt-2 testamento-card ${trilha.bgClass}`}
              >
                <div className="flex gap-4">
                  <img src={trilha.img} alt={trilha.nome} className="w-20 h-20 object-contain img-parchment" />
                  <div className="flex flex-col">
                    <span className="font-old text-sm uppercase tracking-widest" style={{ color: trilha.cor }}>Sua Trilha</span>
                    <span className="font-script text-3xl" style={{ color: trilha.accentHex }}>{trilha.nome}</span>
                    <span className="font-old text-base text-(--text) opacity-70">{trilha.subtitulo}</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowResetModal(true)}
                  disabled={resetting}
                  className="reset-btn reset-btn--rect"
                >
                  <span className="reset-inner">
                    <span className="reset-text">Reiniciar</span>
                  </span>
                </button>
              </div>
            )}

            <p className="font-old text-base text-(--text) opacity-80">
              Reúna os fragmentos, forme a senha e apresente ao Guardião.
              Apenas os dignos poderão reivindicar o que lhes pertence por direito de sangue.
            </p>

            {/* Missões */}
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-baseline justify-between">
                <p className="font-script text-4xl md:text-5xl">Missões</p>
                {total > 0 && (
                  <span className="font-old text-base text-(--text) opacity-70">
                    {done} / {total} concluídas
                  </span>
                )}
              </div>

              {/* Barra de progresso */}
              {total > 0 && (
                <div className="w-full h-2 rounded-full bg-amber-900/20 overflow-hidden mt-1 mb-4">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(done / total) * 100}%`,
                      background: trilha?.cor ?? '#704522',
                    }}
                  />
                </div>
              )}

              {missions.length === 0 ? (
                <p className="font-old text-base opacity-60 text-center py-4">
                  Nenhuma missão encontrada.
                </p>
              ) : (
                <div className="flex flex-col gap-6">
                  {Object.entries(byCategoria).map(([cat, items]) => (
                    <div key={cat}>
                      <p className="font-old text-sm uppercase tracking-widest text-amber-800 mb-2 border-b border-amber-900/30 pb-1">
                        {CATEGORIA_LABEL[cat] ?? cat}
                      </p>
                      <ul className="flex flex-col gap-2">
                        {items.map((m) => (
                          <li key={m.id}>
                            <div
                              role={m.completed ? undefined : 'button'}
                              tabIndex={m.completed ? undefined : 0}
                              onClick={() => handleMissionClick(m)}
                              onKeyDown={(e) => e.key === 'Enter' && handleMissionClick(m)}
                              className="flex items-start gap-3"
                              style={{ cursor: m.completed ? 'default' : 'pointer' }}
                              aria-label={m.completed ? undefined : `Completar missão: ${m.titulo}`}
                            >
                              {/* Indicador de estado */}
                              <span
                                className="mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center"
                                style={{
                                  borderColor: m.completed ? (trilha?.cor ?? '#704522') : '#704522aa',
                                  background: m.completed ? (trilha?.cor ?? '#704522') : 'transparent',
                                }}
                              >
                                {m.completed && (
                                  <svg viewBox="0 0 12 10" className="w-3 h-3 fill-none stroke-white stroke-2">
                                    <polyline points="1,5 4.5,9 11,1" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                              </span>

                              <div className="flex flex-col">
                                <span
                                  className="font-old text-lg leading-snug"
                                  style={{
                                    color: m.completed ? '#70452288' : 'var(--text, #392514)',
                                    textDecoration: m.completed ? 'line-through' : 'none',
                                  }}
                                >
                                  {m.titulo}
                                  {!m.completed && (
                                    <span
                                      className="ml-2 font-old text-xs uppercase tracking-widest opacity-50"
                                      style={{ color: trilha?.cor ?? '#704522' }}
                                    >
                                      → validar
                                    </span>
                                  )}
                                </span>
                                {m.descricao && (
                                  <span
                                    className="font-old text-sm mt-0.5 leading-snug"
                                    style={{ opacity: m.completed ? 0.4 : 0.65 }}
                                  >
                                    {m.descricao}
                                  </span>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <div className="ornamental-line my-8!">
            <img src="/brasao.png" className="w-10 h-10 img-parchment" alt="" />
          </div>
        </div>
      </main>
      {showResetModal && (
        <div className="reset-modal-overlay" onClick={() => setShowResetModal(false)}>
          <div className="reset-modal" onClick={e => e.stopPropagation()}>
            <div className="text-5xl text-red-900">☠</div>
            <h2 className="font-script text-5xl text-red-950">Reiniciar Trilha</h2>
            <p className="text-center">
              Seu progresso, missões e testamento serão liberados e você poderá escolher uma nova trilha.
            </p>
            <div className="reset-modal-actions">
              <button className="reset-btn reset-btn--rect" onClick={confirmReset}>
                <span className="reset-inner">
                  <span className="reset-text">CONFIRMAR</span>
                </span>
              </button>
              <button className="text-amber-800 cursor-pointer" onClick={() => setShowResetModal(false)}>
                cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
