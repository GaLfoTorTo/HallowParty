import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [nome, setNome] = useState('');
  const [stamped, setStamped] = useState(false);
  const navigate = useNavigate();

  function handleStamp() {
    setStamped(true);
    setTimeout(() => navigate('/trilha', { state: { nome } }), 2600);
  }
  return (
    <div className="flex items-center justify-center bg-page min-h-screen p-5 md:p-10">
      {/* Documento — pergaminho */}
      <main className="paper w-full max-w-4xl px-8! py-10! md:px-20! md:py-10! overflow-hidden fade">

        {/* Manchas de sangue */}
        <div className="blood top-16 right-60" />
        <div className="blood top-120 right-5 opacity-50" />
        <div className="blood bottom-28 left-2 opacity-40" />

        {/* Pergaminho */}
        <div className="relative z-10">
          {/* Cabeçalho */}
          <header className="text-center">
            {/* Separador */}
            <div className="ornamental-line my-8">
              <img src="/brasao.png" className="w-10 h-10" alt="" />
            </div>
          </header>

          {/* Corpo do testamento */}
          <section className="flex flex-col gap-7 py-5! font-old text-(--text) text-xl text-justify!">

            <p className="font-script text-4xl md:text-5xl">
              Você foi escolhido!
            </p>

            <p>
              Se estás lendo estas palavras, 
              então já é tarde demais... aquilo que mais temi
              infelizmente aconteceu.
            </p>

            <p>
              Por gerações, este testamento permaneceu escondido entre paredes que ninguém ousaria procurar, 
              protegido por uma promessa feita quando ainda acreditava-se que algumas coisas poderiam permanecer esquecidas. 
              Mas ao que parece, certas heranças não podem ser recusadas. 
              O tempo, impiedoso como sempre, trouxe consigo a hora de revelar aquilo que deveria dicar para sempre enterrado.
            </p>

            <p className="font-script text-4xl md:text-5xl text-center text-red-900 my-10">
              O passado sempre encontra um caminho de volta e os mortos veem tudo.
            </p>

            <p>
              Existe uma herança aqui —
              real, tangível, aguardando. Mas ela não será simplesmente entregue de mão beijada. 
              A fortuna pertencerá àqueles que provarem ser dignos de carregá-la.
            </p>

            <p>
              Três linhagens foram convocadas a esta noite. Cada uma carrega em
              seu sangue — ou na falta dele — uma natureza que não pode ser
              escondida. Reconheçam a si mesmos:
            </p>

            <p>
              Apenas a linhagem que cumprir seu destino antes das outras herdará
              o que lhes é devido.
            </p>

            <p className="font-semibold text-center uppercase tracking-widest text-(--text) mt-6">
              Deseja encarar o seu destino?
            </p>
            <h1 className="font-script text-center text-5xl md:text-7xl text-red-900 leading-none">
              O Testamento Maldito
            </h1>
          </section>

          {/* Assinatura do padrinho */}
          <section className="mt-16!">
            <div className="flex flex-col gap-4 text-center w-full">
              <div className="flex justify-center mt-4 w-full">
                <input
                  type="text"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  maxLength={40}
                  className="w-full bg-transparent border-b-2 border-[#6b4520]/60 text-center font-script text-5xl md:text-6xl text-[#3d2415] placeholder:text-[#9a7050]/40 outline-none pb-1 leading-tight caret-[#6b2119]"
                />
              </div>
              <p className="font-title text-[10px] tracking-[0.4em] mt-3 text-[#65421f]">ASSINATURA</p>
              <p className="font-old italic text-[#55381f]">Escrito e selado na véspera do pesar, quando a última testemunha ainda habitava este mundo.</p>
              {/* Selos */}
              <div className="mt-16 flex justify-center items-center gap-10">
                {/* Botão carimbo — só aparece quando o nome foi preenchido */}
                {nome.trim() 
                  ? (
                      <button
                        onClick={handleStamp}
                        disabled={stamped}
                        className={[
                          'stamp-btn',
                          stamped ? 'stamp-pressed' : '',
                        ].join(' ')}
                        title="Aceitar o destino"
                      >
                        <span className="stamp-inner">
                          <span className="stamp-cross">☩</span>
                          <span className="stamp-text">ACEITO</span>
                          <span className="stamp-sub">meu destino</span>
                        </span>
                      </button>
                    )
                  : (
                    <div className="w-24 h-24 rounded-full border-4 border-[#6b2119]/70 flex items-center justify-center rotate-[-8deg] shadow-inner">
                      <div className="w-16 h-16 rounded-full border border-[#6b2119]/60 flex items-center justify-center font-gothic text-3xl text-[#6b2119]">
                        ✠
                      </div>
                    </div>
                    )
                }
              </div>
            </div>
          </section>
          {/* Separador */}
          <div className="ornamental-line my-8!">
            <img src="/brasao.png" className="w-10 h-10 img-parchment" alt="" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
