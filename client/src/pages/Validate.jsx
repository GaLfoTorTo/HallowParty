import { useState } from 'react';
import { api } from '../services/api';

const LINHAGEM_ICON = { fantasma: '👻', vampiro: '🧛', zumbi: '🧟' };

function Validate() {
  const [testamentoId, setTestamentoId] = useState('');
  const [senha, setSenha] = useState('');
  const [guestName, setGuestName] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const { data } = await api.validate({ testamentoId, senha, guestName });
    setResult(data);
    setLoading(false);
  }

  return (
    <div className="container">
      <h1>🔐 Reivindicar Herança</h1>
      <p className="subtitle">
        Reúna os três fragmentos, forme a senha e apresente ao Guardião.
      </p>

      <form className="validate-form" onSubmit={handleSubmit}>
        <label>
          Número do Testamento
          <input
            type="text"
            placeholder="Ex: 001"
            value={testamentoId}
            onChange={e => setTestamentoId(e.target.value)}
            required
            maxLength={3}
          />
        </label>

        <label>
          Senha (3 fragmentos)
          <input
            type="text"
            placeholder="Ex: 739"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
            maxLength={3}
            pattern="\d{3}"
          />
        </label>

        <label>
          Seu nome (opcional)
          <input
            type="text"
            placeholder="Como você quer ser lembrado..."
            value={guestName}
            onChange={e => setGuestName(e.target.value)}
          />
        </label>

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Verificando...' : '⚰️ Reivindicar'}
        </button>
      </form>

      {result && (
        <div className={`result-box ${result.valid ? 'result-valid' : 'result-invalid'}`}>
          {result.valid ? (
            <>
              <p className="result-title">A herança é sua.</p>
              <p>{LINHAGEM_ICON[result.testamento?.linhagem]} Linhagem {result.testamento?.linhagem}</p>
              {result.testamento?.guestName && (
                <p>Reivindicada por: <strong>{result.testamento.guestName}</strong></p>
              )}
            </>
          ) : (
            <p className="result-title">{result.message}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Validate;
