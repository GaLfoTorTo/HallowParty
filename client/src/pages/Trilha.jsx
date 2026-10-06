import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const trilhas = [
  {
    key: 'fantasma',
    img: '/ghost.png',
    nome: 'Fantasma',
    epiteto: 'Espíritos do Além',
    desc: 'Espíritos do mistério. Investigam, buscam, decifram o que os vivos ignoram.',
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
    epiteto: 'Senhores da Noite',
    desc: 'Senhores da sedução. Dominam os salões, os cálices e as alianças da noite.',
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
    epiteto: 'Filhos do Caos',
    desc: 'Filhos do caos. Onde pisam, a festa irrompe — e os ossos não param de dançar.',
    lore: 'Imparáveis e imprevisíveis, transformam qualquer salão numa dança macabra e gloriosa.',
    habilidades: ['Força', 'Resistência', 'Intimidação'],
    elemento: 'Podridão',
    accentVar: '--zumbi',
    accentHex: '#6a9944',
    bgClass: 'card-zumbi',
  },
];

const TrilhaCard = ({ item, selected, onSelect }) => {
  const isSelected = selected === item.key;

  return (
    <button
      className={`trilha-card ${item.bgClass} ${isSelected ? 'trilha-card--selected' : ''}`}
      onClick={() => onSelect(item.key)}
      aria-pressed={isSelected}
      aria-label={`Escolher trilha ${item.nome}`}
      style={{ '--accent': item.accentHex }}
    >
      {/* Brilho de seleção */}
      <div className="trilha-card__glow" />

      {/* Imagem */}
      <div className="trilha-card__img-wrap">
        <img src={item.img} alt={item.nome} className="trilha-card__img" />
      </div>

      {/* Conteúdo */}
      <div className="trilha-card__body">
        <p className="trilha-card__epiteto">{item.epiteto}</p>
        <h2 className="trilha-card__nome">{item.nome}</h2>

        <div className="trilha-card__divider" />

        <p className="trilha-card__desc">{item.desc}</p>
        <p className="trilha-card__lore">{item.lore}</p>

        <div className="trilha-card__divider" />

        {/* Habilidades */}
        <ul className="trilha-card__habs">
          {item.habilidades.map((h) => (
            <li key={h} className="trilha-card__hab">{h}</li>
          ))}
        </ul>

        {/* Elemento */}
        <p className="trilha-card__elemento">
          <span>Elemento:</span> {item.elemento}
        </p>
      </div>

      {/* Badge de selecionado */}
      {isSelected && (
        <div className="trilha-card__badge">✦ Escolhida ✦</div>
      )}
    </button>
  );
};

const Trilha = () => {
  const [trilha, setTrilha] = useState('');
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center bg-page min-h-screen p-5 md:p-10">
      <main className="paper w-full max-w-5xl px-8! py-10! md:px-20! md:py-10! overflow-hidden fade">

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

            <p className="font-script text-4xl md:text-5xl">Escolha sua trilha</p>

            <p>
              Três linhagens de criaturas das trevas foram convocadas aqui hoje
              afim de reivindicar sua herança — mas apenas 1 único ser de cada espécie sairá com seu prêmio.
            </p>

            <p className="font-semibold text-center uppercase tracking-widest text-(--text) mt-6">
              Identifique-se, herdeiro misterioso.
            </p>
          </section>

          {/* Cards de trilha */}
          <section className="trilha-grid mt-8">
            {trilhas.map((item) => (
              <TrilhaCard
                key={item.key}
                item={item}
                selected={trilha}
                onSelect={setTrilha}
              />
            ))}
          </section>

          {/* Botão de confirmação */}
          {trilha && (
            <div className="flex justify-center mt-10">
              <button
                className="stamp-btn"
                onClick={() => navigate('/home', { state: { trilha } })}
                aria-label="Confirmar trilha escolhida"
              >
                <span className="stamp-inner">
                  <span className="stamp-cross">✦</span>
                  <span className="stamp-text">CONFIRMAR</span>
                  <span className="stamp-sub">sua trilha</span>
                </span>
              </button>
            </div>
          )}

          <div className="ornamental-line my-8!">
            <img src="/brasao.png" className="w-10 h-10 img-parchment" alt="" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Trilha;