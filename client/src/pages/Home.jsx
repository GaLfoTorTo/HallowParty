import { Link } from 'react-router-dom';

const LINHAGENS = [
  { key: 'fantasma', emoji: '👻', nome: 'Fantasma', desc: 'Mistério · Busca e Investigação' },
  { key: 'vampiro',  emoji: '🧛', nome: 'Vampiro',  desc: 'Sangue · Socialização e Bebidas' },
  { key: 'zumbi',   emoji: '🧟', nome: 'Zumbi',    desc: 'Caos · Dança e Diversão' },
];

function Home() {
  return (
    <div className="container">
      <header className="hero">
        <h1>🎃 O Testamento Maldito</h1>
        <p className="tagline">Uma herança deixada pelos mortos. Três linhagens. Nove provas. Uma recompensa.</p>
      </header>

      <section className="linhagens">
        {LINHAGENS.map(l => (
          <div key={l.key} className={`linhagem-card linhagem-${l.key}`}>
            <span className="linhagem-emoji">{l.emoji}</span>
            <h2>{l.nome}</h2>
            <p>{l.desc}</p>
          </div>
        ))}
      </section>

      <section className="actions">
        <Link to="/validar" className="btn-primary">
          🔐 Reivindicar Herança
        </Link>
        <Link to="/guardiao" className="btn-secondary">
          ⚰️ Painel do Guardião
        </Link>
      </section>

      <blockquote className="quote">
        "Os mortos deixaram uma herança. Você terá coragem de reivindicá-la?"
      </blockquote>
    </div>
  );
}

export default Home;
