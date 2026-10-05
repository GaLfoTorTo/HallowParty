import { useState, useEffect } from 'react';
import { api } from '../services/api';

function Admin() {
  const [testamentos, setTestamentos] = useState([]);
  const [linhagem, setLinhagem] = useState('fantasma');
  const [hasCurse, setHasCurse] = useState(false);
  const [qty, setQty] = useState({ fantasma: 10, vampiro: 10, zumbi: 10 });
  const [message, setMessage] = useState('');

  async function loadTestamentos() {
    const { data } = await api.getTestamentos();
    setTestamentos(data);
  }

  useEffect(() => { loadTestamentos(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    const { data, ok } = await api.createTestamento({ linhagem, hasCurse });
    if (ok) {
      setMessage(`Testamento #${data.id} criado — senha: ${data.senha}`);
      loadTestamentos();
    } else {
      setMessage(data.message);
    }
  }

  async function handleBatch(e) {
    e.preventDefault();
    const { data, ok } = await api.generateBatch({
      fantasma: parseInt(qty.fantasma),
      vampiro: parseInt(qty.vampiro),
      zumbi: parseInt(qty.zumbi),
    });
    if (ok) {
      setMessage(`${data.total} testamentos gerados com sucesso!`);
      loadTestamentos();
    }
  }

  async function handleClear() {
    if (!window.confirm('Apagar TODOS os testamentos?')) return;
    await api.clearTestamentos();
    setMessage('Todos os testamentos removidos.');
    loadTestamentos();
  }

  const LINHAGEM_ICON = { fantasma: '👻', vampiro: '🧛', zumbi: '🧟' };

  return (
    <div className="container">
      <h1>🗂️ Painel Admin</h1>

      {message && <div className="admin-message">{message}</div>}

      <section className="admin-section">
        <h2>Criar Testamento Individual</h2>
        <form className="validate-form" onSubmit={handleCreate}>
          <label>
            Linhagem
            <select value={linhagem} onChange={e => setLinhagem(e.target.value)}>
              <option value="fantasma">👻 Fantasma</option>
              <option value="vampiro">🧛 Vampiro</option>
              <option value="zumbi">🧟 Zumbi</option>
            </select>
          </label>
          <label className="checkbox-label">
            <input type="checkbox" checked={hasCurse} onChange={e => setHasCurse(e.target.checked)} />
            Incluir Maldição
          </label>
          <button className="btn-primary" type="submit">Criar</button>
        </form>
      </section>

      <section className="admin-section">
        <h2>Gerar Lote de Testamentos</h2>
        <form className="validate-form" onSubmit={handleBatch}>
          {['fantasma', 'vampiro', 'zumbi'].map(l => (
            <label key={l}>
              {LINHAGEM_ICON[l]} {l.charAt(0).toUpperCase() + l.slice(1)}
              <input
                type="number"
                min="0"
                max="50"
                value={qty[l]}
                onChange={e => setQty(prev => ({ ...prev, [l]: e.target.value }))}
              />
            </label>
          ))}
          <button className="btn-primary" type="submit">Gerar Lote</button>
        </form>
      </section>

      <section className="admin-section">
        <div className="admin-section-header">
          <h2>Testamentos ({testamentos.length})</h2>
          <button className="btn-danger" onClick={handleClear}>Apagar Todos</button>
        </div>
        <div className="testamentos-table">
          <div className="table-header">
            <span>ID</span>
            <span>Linhagem</span>
            <span>Senha</span>
            <span>Maldição</span>
            <span>Status</span>
            <span>Convidado</span>
          </div>
          {testamentos.slice().reverse().map(t => (
            <div key={t.id} className={`table-row ${t.completed ? 'row-completed' : ''}`}>
              <span>#{t.id}</span>
              <span>{LINHAGEM_ICON[t.linhagem]} {t.linhagem}</span>
              <span className="senha-cell">{t.senha}</span>
              <span>{t.hasCurse ? '☠️' : '—'}</span>
              <span>{t.completed ? '✅' : '⏳'}</span>
              <span>{t.guestName || '—'}</span>
            </div>
          ))}
          {testamentos.length === 0 && (
            <p className="empty-state">Nenhum testamento criado ainda.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Admin;
