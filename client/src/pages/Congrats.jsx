import { useLocation, useNavigate } from 'react-router-dom';

function Congrats() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const nome = state?.nome ?? 'Herdeiro';

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

          <section className="flex flex-col gap-7 py-5! font-old text-(--text) text-xl text-justify!">
            <h1 className="font-script text-center text-5xl md:text-7xl text-red-900 leading-none">
              O Testamento Maldito
            </h1>

            <p className="font-script text-4xl md:text-5xl text-center mt-4">
              A herança é sua.
            </p>

            <div className="text-center my-6">
              <span className="text-6xl opacity-70">☩</span>
            </div>

            <p className="text-center">
              <span className="font-script text-3xl text-red-900">{nome}</span>
            </p>

            <p className="text-center">
              Provou ser digno de carregar o que os mortos deixaram para trás.
              O testamento foi selado em seu nome — a herança, finalmente, encontrou seu dono.
            </p>

            <p className="font-script text-3xl text-center text-red-900 my-6">
              Que os ancestrais vejam e se aquietem.
            </p>
            <p className="font-script text-3xl text-center text-red-900 my-6">
              Procure o Guardião, ele lhe considera o que é seu por direito!
            </p>
          </section>

          <div className="flex justify-center mt-8!">
            <button
              onClick={() => navigate('/tasks')}
              className="font-old text-xs uppercase tracking-widest text-(--text) opacity-50 hover:opacity-80 transition-opacity underline underline-offset-2 cursor-pointer bg-transparent border-none"
            >
              ← voltar às missões
            </button>
          </div>

          <div className="ornamental-line my-8!">
            <img src="/brasao.png" className="w-10 h-10 img-parchment" alt="" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Congrats;
