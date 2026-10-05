import { useState, useEffect } from 'react';
import { api } from '../services/api';

const LINHAGEM_ICON = { fantasma: '👻', vampiro: '🧛', zumbi: '🧟' };

function Guardian() {
  const [stats, setStats] = useState(null);
  const [checkId, setCheckId] = useState('');
  const [checkSenha, setCheckSenha] = useState('');
  const [checkResult, setCheckResult] = useState(null);

  useEffect(() => {
    api.getStats().then(({ data }) => setStats(data));
  }, []);

  async function handleCheck(e) {
    e.preventDefault();
    const { data } = await api.checkSenha({ testamentoId: checkId, senha: checkSenha });
    setCheckResult(data);
  }

  return (
    <div className="container">
      <h1>⚰️ Painel do Guardião</h1>
      <p className="subtitle">Verifique senhas e acompanhe o progresso da dinâmica.</p>

      <section className="guardian-check">
        <h2>Verificar Senha</h2>
        <form className="validate-form" onSubmit={handleCheck}>
          <label>
            Nº do Testamento
            <input
              type="text"
              placeholder="001"
              value={checkId}
              onChange={e => setCheckId(e.target.value)}
              required maxLength={3}
            />
          </label>
          <label>
            Senha
            <input
              type="text"
              placeholder="739"
              value={checkSenha}
              onChange={e => setCheckSenha(e.target.value)}
              required maxLength={3}
            />
          </label>
          <button className="btn-secondary" type="submit">Verificar</button>
        </form>

        {checkResult && (
          <div className={`result-box ${checkResult.valid ? 'result-valid' : 'result-invalid'}`}>
            <p className="result-title">
              {checkResult.valid ? '✅ Senha Correta' : '❌ Senha Incorreta'}
            </p>
            {checkResult.completed && <p>⚠️ Este testamento já foi validado.</p>}
            {checkResult.linhagem && (
              <p>Linhagem: {LINHAGEM_ICON[checkResult.linhagem]} {checkResult.linhagem}</p>
            )}
          </div>
        )}
      </section>

      {stats && (
        <section className="stats">
          <h2>Progresso da Festa</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{stats.totalTestamentos}</span>
              <span>Testamentos</span>
            </div>
            <div className="stat-card stat-success">
              <span className="stat-number">{stats.completed}</span>
              <span>Concluídos</span>
            </div>
            <div className="stat-card stat-pending">
              <span className="stat-number">{stats.pending}</span>
              <span>Pendentes</span>
            </div>
          </div>

          <div className="linhagem-stats">
            {['fantasma', 'vampiro', 'zumbi'].map(l => (
              <div key={l} className={`linhagem-stat linhagem-${l}`}>
                <span>{LINHAGEM_ICON[l]} {l}</span>
                <span>{stats.completedByLinhagem[l]}/{stats.byLinhagem[l]}</span>
              </div>
            ))}
          </div>

          {stats.recentCompletions.length > 0 && (
            <div className="recent-list">
              <h3>Últimas Heranças Reivindicadas</h3>
              {stats.recentCompletions.map(t => (
                <div key={t.id} className="recent-item">
                  <span>{LINHAGEM_ICON[t.linhagem]} #{t.id}</span>
                  <span>{t.guestName || 'Anônimo'}</span>
                  <span className="recent-time">
                    {new Date(t.completedAt).toLocaleTimeString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default Guardian;
