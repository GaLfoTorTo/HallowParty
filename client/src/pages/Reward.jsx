import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession } from '../services/session';
import LoadingOverlay from '../components/LoadingOverlay';

const STAMP_DELAY = 2600;

function Reward() {
  const navigate = useNavigate();
  const session = getSession();
  const user = session?.user;

  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [stamped, setStamped] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!senha.trim() || stamped) return;
    setStamped(true);
    setLoading(true);
    setErro('');
    const t0 = Date.now();

    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, senha: senha.trim() }),
      });
      const data = await res.json();

      if (!data.valid) {
        setErro(data.message || 'Senha inválida.');
        setStamped(false);
        return;
      }

      const elapsed = Date.now() - t0;
      setTimeout(() => navigate('/congrats', { state: { nome: data.nome } }), Math.max(0, STAMP_DELAY - elapsed));
    } catch {
      setErro('Erro de conexão. Tente novamente.');
      setStamped(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <LoadingOverlay visible={loading} message="Verificando a herança..." />
    <div className="flex items-center justify-center bg-page min-h-screen p-5 md:p-10">
      <main className="paper w-full max-w-4xl px-8! py-10! md:px-20! md:py-10! overflow-hidden fade">

        <div className="blood top-16 right-60" />
        <div className="blood top-120 right-5 opacity-50" />
        <div className="blood bottom-28 left-2 opacity-40" />

        <div className="relative z-10">
          <header className="text-center">
            <div className="ornamental-line my-8">
              <img src="/brasao.png" className="w-10 h-10 img-parchment" alt="" />
            </div>
          </header>

          <section className="flex flex-col gap-7 py-5! font-old text-center text-xl!">
            <h1 className="font-script text-5xl md:text-7xl text-red-900 leading-none">
              O Testamento Maldito
            </h1>
            <div className="flex justify-between">
              <p className="font-script text-5xl text-center">Reivindicar a Herança</p>
              <button
                type="button"
                onClick={() => navigate('/tasks')}
                className="font-old text-sm uppercase tracking-widest text-amber-800 opacity-60 hover:opacity-100 cursor-pointer transition-opacity mt-2"
              >
                ← voltar às missões
              </button>
            </div>
            <p>Reúna todos os fragmentos coletados nas missões e forme a senha de reivindicação.</p>
          </section>

          <form onSubmit={handleSubmit} className="flex flex-col gap-10 mt-10!">
            <div className="flex flex-col gap-2 text-center">
              <input
                type="text"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                maxLength={20}
                placeholder="······"
                className="w-full bg-transparent border-b-2 border-[#6b4520]/60 text-center font-script text-5xl md:text-6xl text-[#3d2415] placeholder:text-[#9a7050]/40 outline-none pb-1 leading-tight caret-[#6b2119]"
              />
              <p className="font-title text-[10px] tracking-[0.4em] text-[#65421f]">SENHA DOS FRAGMENTOS</p>
            </div>

            <div className="flex flex-col items-center gap-4 mt-6!">
              <button type="submit" disabled={loading || stamped} className={`stamp-btn${stamped ? ' stamp-pressed' : ''}`}>
                <span className="stamp-inner">
                  <span className="stamp-cross">⚰</span>
                  <span className="stamp-text">{loading ? 'AGUARDE' : 'REIVINDICAR'}</span>
                  <span className="stamp-sub">a herança</span>
                </span>
              </button>
              {erro && (
                <p className="font-script text-2xl text-red-900 text-center mt-2">{erro}</p>
              )}
            </div>
          </form>

          <div className="ornamental-line my-8!">
            <img src="/brasao.png" className="w-10 h-10 img-parchment" alt="" />
          </div>
        </div>
      </main>
    </div>
    </>
  );
}

export default Reward;
