import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession } from '../services/session';

function Reward() {
  const navigate = useNavigate();
  const session = getSession();
  const user = session?.user;

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

            <p className="font-script text-5xl text-center ">Reivindicar a Herança</p>

            <p>Reúna todos os fragmentos coletados nas missões e forme a senha de "reivindicação de herança".</p>
            <p>Apresente a senha coletada ao Guardião da herança e responda seu enigma para reivindicar o que lhes pertence por direito.</p>
          </section>


          <form onSubmit={handleSubmit} className="flex flex-col gap-10 mt-10!">

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

          <div className="ornamental-line my-8!">
            <img src="/brasao.png" className="w-10 h-10 img-parchment" alt="" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Reward;
