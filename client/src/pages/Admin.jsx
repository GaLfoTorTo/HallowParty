import { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../css/admin.css';

const LINHAGEM = ['fantasma', 'vampiro', 'zumbi'];
const LINHAGEM_ICON  = { fantasma: '👻', vampiro: '🧛', zumbi: '🧟' };
const LINHAGEM_COLOR = { fantasma: '#7b9fbf', vampiro: '#cc2244', zumbi: '#6a9944' };
const LINHAGEM_LABEL = { fantasma: 'Fantasma', vampiro: 'Vampiro', zumbi: 'Zumbi' };

function fmt(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function Toast({ msg }) {
  if (!msg) return null;
  const isOk = msg.startsWith('✅');
  const isErr = msg.startsWith('❌');
  return (
    <div className={`admin-toast${isOk ? ' admin-toast--ok' : isErr ? ' admin-toast--err' : ''}`}>
      {msg}
    </div>
  );
}

function Admin() {
  const [testamentos, setTestamentos] = useState([]);
  const [stats, setStats]             = useState(null);
  const [linhagem, setLinhagem]       = useState('fantasma');
  const [hasCurse, setHasCurse]       = useState(false);
  const [qty, setQty]                 = useState({ fantasma: 10, vampiro: 10, zumbi: 10 });
  const [message, setMessage]         = useState('');
  const [resettingDb, setResettingDb] = useState(false);

  function flash(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(''), 5000);
  }

  async function load() {
    const [t, s] = await Promise.all([api.getTestamentos(), api.getStats()]);
    if (t.ok) setTestamentos(t.data);
    if (s.ok) setStats(s.data);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    const { data, ok } = await api.createTestamento({ linhagem, hasCurse });
    if (ok) { flash(`✅ Testamento #${data.id} criado — senha: ${data.senha}`); load(); }
    else flash(`❌ ${data.message}`);
  }

  async function handleBatch(e) {
    e.preventDefault();
    const { data, ok } = await api.generateBatch({
      fantasma: parseInt(qty.fantasma),
      vampiro:  parseInt(qty.vampiro),
      zumbi:    parseInt(qty.zumbi),
    });
    if (ok) { flash(`✅ ${data.total} testamentos gerados.`); load(); }
  }

  async function handleClear() {
    if (!window.confirm('Apagar TODOS os testamentos?')) return;
    await api.clearTestamentos();
    flash('✅ Todos os testamentos removidos.');
    load();
  }

  async function handleResetDb() {
    if (!window.confirm('⚠️ Isso vai APAGAR TODOS os dados e recriar do zero.\n\nTem certeza?')) return;
    if (!window.confirm('Confirme novamente: RESET TOTAL do banco de dados?')) return;
    setResettingDb(true);
    setMessage('');
    const { ok, data } = await api.resetDb();
    setResettingDb(false);
    flash(ok ? `✅ ${data.message}` : `❌ ${data.message}`);
    if (ok) load();
  }

  const total     = stats?.totalTestamentos ?? 0;
  const completed = stats?.completed ?? 0;
  const pending   = stats?.pending ?? 0;
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex items-center justify-center bg-page min-h-screen p-5 md:p-10">
      <main className="paper w-full max-w-4xl px-8! py-10! md:px-16! md:py-10! overflow-hidden fade">

        <div className="blood top-16 right-60" />
        <div className="blood bottom-28 left-2 opacity-40" />

        <div className="relative z-10 admin-wrap">

          {/* Header */}
          <header className="text-center">
            <div className="ornamental-line my-8">
              <img src="/brasao.png" className="w-10 h-10 img-parchment" alt="" />
            </div>
            <h1 className="font-script text-5xl md:text-7xl text-red-900 leading-none">Painel do Mestre</h1>
            <p className="font-old text-sm text-amber-800 opacity-70 mt-2 tracking-widest uppercase">Controle geral da aplicação</p>
          </header>

          <Toast msg={message} />

          {/* ── Stats ── */}
          {stats && (
            <div className="admin-card">
              <span className="admin-card-title">Visão Geral</span>

              <div className="stats-grid">
                <div className="stat-tile">
                  <span className="stat-tile__value">{total}</span>
                  <span className="stat-tile__label">Testamentos</span>
                </div>
                <div className="stat-tile">
                  <span className="stat-tile__value">{completed}</span>
                  <span className="stat-tile__label">Concluídos</span>
                </div>
                <div className="stat-tile">
                  <span className="stat-tile__value">{pending}</span>
                  <span className="stat-tile__label">Pendentes</span>
                </div>
                <div className="stat-tile">
                  <span className="stat-tile__value">{pct}%</span>
                  <span className="stat-tile__label">Aproveitamento</span>
                </div>
              </div>

              {/* Barras por linhagem */}
              <div className="linhagem-bars">
                {LINHAGEM.map(l => {
                  const tot  = stats.byLinhagem?.[l] ?? 0;
                  const done = stats.completedByLinhagem?.[l] ?? 0;
                  const w    = tot > 0 ? (done / tot) * 100 : 0;
                  return (
                    <div key={l} className="linhagem-bar-row">
                      <span className="linhagem-bar-label">{LINHAGEM_ICON[l]} {LINHAGEM_LABEL[l]}</span>
                      <div className="linhagem-bar-track">
                        <div className="linhagem-bar-fill" style={{ width: `${w}%`, background: LINHAGEM_COLOR[l] }} />
                      </div>
                      <span className="linhagem-bar-count">{done}/{tot}</span>
                    </div>
                  );
                })}
              </div>

              {/* Recentes */}
              {stats.recentCompletions?.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="admin-card-title">Últimas Conclusões</span>
                  <div className="recent-list">
                    {stats.recentCompletions.map(r => (
                      <div key={r.id} className="recent-item">
                        <span>{LINHAGEM_ICON[r.linhagem]}</span>
                        <span className="recent-item__name">{r.guestName || '—'}</span>
                        <span className="recent-item__time">{fmt(r.completedAt)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Criar testamento ── */}
          <div className="admin-card">
            <span className="admin-card-title">Criar Testamento Individual</span>
            <form className="admin-form" onSubmit={handleCreate}>
              <div className="admin-form-field">
                <label>Linhagem</label>
                <select value={linhagem} onChange={e => setLinhagem(e.target.value)}>
                  {LINHAGEM.map(l => (
                    <option key={l} value={l}>{LINHAGEM_ICON[l]} {LINHAGEM_LABEL[l]}</option>
                  ))}
                </select>
              </div>
              <label className="admin-checkbox-row" style={{ paddingBottom: '.35rem' }}>
                <input type="checkbox" checked={hasCurse} onChange={e => setHasCurse(e.target.checked)} />
                Incluir Maldição ☠️
              </label>
              <button className="admin-btn admin-btn--primary" type="submit">Criar</button>
            </form>
          </div>

          {/* ── Lote ── */}
          <div className="admin-card">
            <span className="admin-card-title">Gerar Lote de Testamentos</span>
            <form className="admin-form" onSubmit={handleBatch}>
              {LINHAGEM.map(l => (
                <div key={l} className="admin-form-field">
                  <label>{LINHAGEM_ICON[l]} {LINHAGEM_LABEL[l]}</label>
                  <input
                    type="number" min="0" max="50"
                    value={qty[l]}
                    onChange={e => setQty(prev => ({ ...prev, [l]: e.target.value }))}
                  />
                </div>
              ))}
              <button className="admin-btn admin-btn--primary" type="submit" style={{ alignSelf: 'flex-end' }}>
                Gerar Lote
              </button>
            </form>
          </div>

          {/* ── Tabela de testamentos ── */}
          <div className="admin-card">
            <div className="admin-card-header">
              <span className="admin-card-title">Testamentos ({testamentos.length})</span>
              <button className="admin-btn admin-btn--ghost" onClick={handleClear}>Apagar Todos</button>
            </div>
            {testamentos.length === 0 ? (
              <p className="font-old text-sm opacity-50 text-center py-4">Nenhum testamento criado ainda.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Linhagem</th>
                      <th>Senha</th>
                      <th>Maldição</th>
                      <th>Status</th>
                      <th>Convidado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testamentos.slice().reverse().map(t => (
                      <tr key={t.id} className={t.completed ? 'row-done' : ''}>
                        <td>#{t.id}</td>
                        <td>{LINHAGEM_ICON[t.linhagem]} {LINHAGEM_LABEL[t.linhagem] ?? t.linhagem}</td>
                        <td><code style={{ fontFamily: 'monospace', letterSpacing: '.08em' }}>{t.senha}</code></td>
                        <td>{t.hasCurse ? <span className="badge badge--curse">☠ Maldito</span> : <span style={{ opacity: .35 }}>—</span>}</td>
                        <td>
                          {t.completed
                            ? <span className="badge badge--done">✓ Concluído</span>
                            : <span className="badge badge--pend">⏳ Pendente</span>}
                        </td>
                        <td style={{ fontStyle: t.guestName ? 'normal' : 'italic', opacity: t.guestName ? 1 : .4 }}>
                          {t.guestName || 'não reivindicado'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Zona de perigo ── */}
          <div className="admin-card admin-card--danger">
            <span className="admin-card-title" style={{ color: '#8b1a1a' }}>⚠ Zona de Perigo</span>
            <p className="danger-desc">
              Apaga todos os dados do banco (usuários, missões, testamentos) e recria do zero
              a partir dos arquivos de seed. Essa ação é irreversível.
            </p>
            <div>
              <button
                className="admin-btn admin-btn--danger"
                onClick={handleResetDb}
                disabled={resettingDb}
              >
                {resettingDb ? '⏳ Resetando...' : '💀 Reset Total do Banco'}
              </button>
            </div>
          </div>

          <div className="ornamental-line my-4!">
            <img src="/brasao.png" className="w-10 h-10 img-parchment" alt="" />
          </div>

        </div>
      </main>
    </div>
  );
}

export default Admin;
