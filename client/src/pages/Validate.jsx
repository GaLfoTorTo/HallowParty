import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSession, updateSessionMissions } from '../services/session';

// ── Modo missão ────────────────────────────────────────────────────────────────

const STAMP_DELAY = 2600;

function MissionValidate({ mission, user, onBack }) {
  const [fragmento, setFragmento] = useState('');
  const [loading, setLoading] = useState(false);
  const [stamped, setStamped] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!fragmento.trim() || stamped) return;
    setStamped(true);
    setLoading(true);
    setErro('');
    const t0 = Date.now();

    try {
      const res = await fetch(`/api/missions/${mission.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErro(data.message || 'Não foi possível concluir a missão.');
        setStamped(false);
        return;
      }

      updateSessionMissions(data.missions);
      const elapsed = Date.now() - t0;
      setTimeout(() => navigate('/tasks'), Math.max(0, STAMP_DELAY - elapsed));
    } catch {
      setErro('Erro de conexão. Tente novamente.');
      setStamped(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="flex flex-col gap-7 py-5! font-old text-(--text) text-xl text-justify!">
        <h1 className="font-script text-center text-5xl md:text-7xl text-red-900 leading-none">
          O Testamento Maldito
        </h1>

        <p className="font-script text-4xl md:text-5xl">Concluir Missão</p>

        {/* Descrição da missão */}
        <div className="border border-amber-900/40 rounded-lg px-5 py-4 bg-amber-950/10 flex flex-col gap-1">
          <span className="font-old text-sm uppercase tracking-widest text-amber-800">
            Sua Missão
          </span>
          <p className="font-script text-3xl text-red-900">{mission.titulo}</p>
          {mission.descricao && (
            <p className="font-old text-base text-(--text) opacity-80 mt-1">{mission.descricao}</p>
          )}
        </div>

        <p>
          Insira o fragmento coletado para provar que a missão foi cumprida.
          Os mortos não mentem — o fragmento não perdoa os impostores.
        </p>

        {user && (
          <p className="font-semibold text-center uppercase tracking-widest text-(--text)">
            Bem-vindo, <span className="font-script text-3xl normal-case">{user.nome}</span>
          </p>
        )}
      </section>

      <form onSubmit={handleSubmit} className="flex flex-col gap-10 mt-10!">
        <div className="flex flex-col gap-2 text-center">
          <input
            type="text"
            value={fragmento}
            onChange={(e) => setFragmento(e.target.value)}
            required
            maxLength={20}
            placeholder="· fragmento ·"
            className="w-full bg-transparent border-b-2 border-[#6b4520]/60 text-center font-script text-5xl md:text-6xl text-[#3d2415] placeholder:text-[#9a7050]/40 outline-none pb-1 leading-tight caret-[#6b2119]"
          />
          <p className="font-title text-[10px] tracking-[0.4em] text-[#65421f]">FRAGMENTO DA MISSÃO</p>
        </div>

        <div className="flex flex-col items-center gap-4 mt-6!">
          <button type="submit" disabled={loading || stamped} className={`stamp-btn${stamped ? ' stamp-pressed' : ''}`}>
            <span className="stamp-inner">
              <span className="stamp-cross">⚰</span>
              <span className="stamp-text">{loading ? 'AGUARDE' : 'CONFIRMAR'}</span>
              <span className="stamp-sub">missão cumprida</span>
            </span>
          </button>

          {erro && <p className="font-old text-red-800 text-center">{erro}</p>}

          <button
            type="button"
            onClick={onBack}
            className="font-old text-sm uppercase tracking-widest text-amber-800 opacity-60 hover:opacity-100 transition-opacity mt-2"
          >
            ← voltar às missões
          </button>
        </div>
      </form>
    </>
  );
}

// ── Modo testamento (fluxo original) ──────────────────────────────────────────

function TestamentoValidate({ user }) {
  const [testamentoId, setTestamentoId] = useState('');
  const [senha, setSenha] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testamentoId, senha, guestName: user?.nome }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ valid: false, message: 'Erro de conexão.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="flex flex-col gap-7 py-5! font-old text-(--text) text-xl text-justify!">
        <h1 className="font-script text-center text-5xl md:text-7xl text-red-900 leading-none">
          O Testamento Maldito
        </h1>

        <p className="font-script text-4xl md:text-5xl">Reivindicar a Herança</p>

        <p>
          Reúna os fragmentos, forme a senha e apresente ao Guardião.
          Apenas os dignos poderão reivindicar o que lhes pertence por direito de sangue.
        </p>

        {user && (
          <p className="font-semibold text-center uppercase tracking-widest text-(--text)">
            Bem-vindo, <span className="font-script text-3xl normal-case">{user.nome}</span>
          </p>
        )}
      </section>

      <form onSubmit={handleSubmit} className="flex flex-col gap-10 mt-10!">
        <div className="flex flex-col gap-2 text-center">
          <input
            type="text"
            value={testamentoId}
            onChange={(e) => setTestamentoId(e.target.value)}
            required
            maxLength={3}
            placeholder="000"
            className="w-full bg-transparent border-b-2 border-[#6b4520]/60 text-center font-script text-5xl md:text-6xl text-[#3d2415] placeholder:text-[#9a7050]/40 outline-none pb-1 leading-tight caret-[#6b2119]"
          />
          <p className="font-title text-[10px] tracking-[0.4em] text-[#65421f]">NÚMERO DO TESTAMENTO</p>
        </div>

        <div className="flex flex-col gap-2 text-center">
          <input
            type="text"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            maxLength={6}
            placeholder="······"
            className="w-full bg-transparent border-b-2 border-[#6b4520]/60 text-center font-script text-5xl md:text-6xl text-[#3d2415] placeholder:text-[#9a7050]/40 outline-none pb-1 leading-tight caret-[#6b2119]"
          />
          <p className="font-title text-[10px] tracking-[0.4em] text-[#65421f]">SENHA DOS FRAGMENTOS</p>
        </div>

        <div className="flex justify-center mt-6!">
          <button type="submit" disabled={loading} className="stamp-btn">
            <span className="stamp-inner">
              <span className="stamp-cross">⚰</span>
              <span className="stamp-text">{loading ? 'AGUARDE' : 'REIVINDICAR'}</span>
              <span className="stamp-sub">a herança</span>
            </span>
          </button>
        </div>
      </form>

      {result && (
        <div className={`mt-12! text-center font-old text-xl ${result.valid ? 'text-[#3d2415]' : 'text-red-900'}`}>
          <div className="ornamental-line my-6">
            <span className="text-[#5a351b]">✦</span>
          </div>
          {result.valid ? (
            <>
              <p className="font-script text-4xl md:text-5xl text-[#3d2415]">A herança é sua.</p>
              {result.testamento?.guestName && (
                <p className="mt-4 italic">Reivindicada por: <strong>{result.testamento.guestName}</strong></p>
              )}
            </>
          ) : (
            <p className="font-script text-3xl md:text-4xl">{result.message}</p>
          )}
        </div>
      )}
    </>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────

function Validate() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const session = getSession();
  const user = session?.user;

  const mission = state?.mission ?? null;

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

          {mission ? (
            <MissionValidate
              mission={mission}
              user={user}
              onBack={() => navigate('/tasks')}
            />
          ) : (
            <TestamentoValidate user={user} />
          )}

          <div className="ornamental-line my-8!">
            <img src="/brasao.png" className="w-10 h-10 img-parchment" alt="" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Validate;
