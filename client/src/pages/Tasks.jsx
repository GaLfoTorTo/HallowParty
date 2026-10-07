import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, clearSession } from '../services/session';
import { api } from '../services/api';
import LoadingOverlay from '../components/LoadingOverlay';
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

  //FUNÇÃO DE RESET
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

  //FUNÇÃO DE NAVEGAÇÃO PARA MISSÃO
  function handleMissionClick(mission) {
    navigate('/mission', { state: { mission } });
  }

  return (
    <>
    <LoadingOverlay visible={resetting} message="Libertando sua alma..." />
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
                  className="reset-btn"
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
                      <ul className="flex flex-col gap-2">
                        {items.map((m) => (
                          <li key={m.id}>
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => handleMissionClick(m)}
                              onKeyDown={(e) => e.key === 'Enter' && handleMissionClick(m)}
                              className="flex items-start gap-3 border-t border-amber-900/30 pt-3!"
                              style={{ cursor: 'pointer' }}
                              aria-label={m.completed ? `Editar fragmento: ${m.titulo}` : `Completar missão: ${m.titulo}`}
                            >
                              <span
                                className="mt-1 shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center"
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
                              <div className="flex flex-col flex-1">
                                <span className={`font-old text-2xl leading-snug ${m.completed ? 'text-amber-700 line-through' : 'text-amber-950'}`}>{m.titulo}</span>
                                <p className={`font-old text-sm uppercase mb-2 pb-1`} style={{ color: trilha.accentHex }}>{m.categoria}</p>
                                <span className={`font-old text-sm mt-0.5 leading-snug ${m.completed ? 'opacity-30' : ''}`}>{m.descricao}</span>
                              </div>
                              {m.completed && m.fragment && (
                                <span className="font-old text-xs uppercase tracking-widest mt-2 text-amber-700">
                                  fragmento:{' '}
                                  <span className="font-script font-semibold text-2xl opacity-100 text-amber-950">{m.fragment}</span>
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              {/* Botão de recompensa quando todas as missões estão concluídas */}
              {done === total && total > 0 && (
                <button onClick={() => navigate('/reward')} className="reset-btn reward-btn mt-4!">
                  <span className="reset-inner">
                    <span className="reset-text">☠ Reivindicar Recompensa ☠</span>
                  </span>
                </button>
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
            <div className="text-5xl opacity-65 text-red-900">☠</div>
            <h2 className="font-script text-4xl text-red-950 text-center leading-tight">Reiniciar Trilha</h2>
            <p className="font-old text-sm text-center text-(--text) opacity-80 leading-relaxed">
              Seu progresso, missões e testamento serão liberados.<br />
              Você poderá escolher uma nova trilha.
            </p>
            <div className="reset-modal-actions">
              <button className="reset-btn" onClick={confirmReset} disabled={resetting}>
                <span className="reset-inner">
                  <span className="reset-text">{resetting ? 'AGUARDE' : 'CONFIRMAR'}</span>
                </span>
              </button>
              <button
                onClick={() => setShowResetModal(false)}
                className="font-old text-xs tracking-widest text-(--text) opacity-50 hover:opacity-80 transition-opacity underline underline-offset-2 cursor-pointer bg-transparent border-none"
              >
                cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default Tasks;
