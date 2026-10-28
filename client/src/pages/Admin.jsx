import { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../css/admin.css';

const ADMIN_PASSWORD = 'halloween2026';
const ADMIN_BYPASS   = 'halloween';

const SESSION_KEY = 'admin_unlocked';

const LINHAGEM = ['fantasma', 'vampiro', 'zumbi'];
const LINHAGEM_ICON  = { fantasma: '👻', vampiro: '🧛', zumbi: '🧟' };
const LINHAGEM_COLOR = { fantasma: '#7b9fbf', vampiro: '#cc2244', zumbi: '#6a9944' };
const LINHAGEM_LABEL = { fantasma: 'Fantasma', vampiro: 'Vampiro', zumbi: 'Zumbi' };

const PODIUM_ICON = ['🥇', '🥈', '🥉'];

const TRILHA_AVATAR = { fantasma: '/ghost.png', vampiro: '/vamp.png', zumbi: '/zombie.png' };
const TRILHA_COLOR  = { fantasma: '#7b9fbf',    vampiro: '#cc2244',   zumbi: '#6a9944' };

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

/* ── Tela de senha ─────────────────────────────── */
function AdminLogin({ onUnlock }) {
  const [input, setInput]   = useState('');
  const [error, setError]   = useState('');
  const [shake, setShake]   = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const val = input.trim();
    if (val === ADMIN_PASSWORD || val === ADMIN_BYPASS) {
      sessionStorage.setItem(SESSION_KEY, '1');
      onUnlock();
    } else {
      setError('Senha incorreta. Tente novamente.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setInput('');
    }
  }

  return (
    <div className="flex items-center justify-center bg-page min-h-screen p-5">
      <div className={`admin-login-box paper px-8 py-10 fade${shake ? ' admin-login-shake' : ''}`}>
        <div className="blood top-10 right-10 opacity-40" />
        <div className="relative z-10">
          <div className="ornamental-line mb-6">
            <img src="/brasao.png" className="w-10 h-10 img-parchment" alt="" />
          </div>
          <h1 className="font-script text-4xl text-red-900 text-center leading-none mb-1">
            Painel do Mestre
          </h1>
          <p className="font-old text-xs text-amber-800 opacity-60 text-center tracking-widest uppercase mb-8">
            Acesso restrito
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="admin-form-field" style={{ gap: '.4rem' }}>
              <label htmlFor="admin-pw">Senha de acesso</label>
              <input
                id="admin-pw"
                type="password"
                autoFocus
                autoComplete="off"
                value={input}
                onChange={e => { setInput(e.target.value); setError(''); }}
                placeholder="••••••••"
                style={{
                  background: 'rgba(246,211,164,.55)',
                  border: '1px solid rgba(112,69,34,.45)',
                  borderRadius: 3,
                  padding: '.5rem .75rem',
                  fontFamily: 'monospace',
                  fontSize: '1rem',
                  color: '#3d2415',
                  outline: 'none',
                  letterSpacing: '.15em',
                }}
              />
            </div>
            {error && (
              <p className="font-old text-xs text-red-800 opacity-90 text-center">{error}</p>
            )}
            <button type="submit" className="admin-btn admin-btn--primary" style={{ alignSelf: 'stretch' }}>
              Entrar
            </button>
          </form>
          <div className="ornamental-line mt-6">
            <img src="/brasao.png" className="w-8 h-8 img-parchment" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Painel principal ──────────────────────────── */
function AdminPanel() {
  const [testamentos, setTestamentos]   = useState([]);
  const [stats, setStats]               = useState(null);
  const [ranking, setRanking]           = useState([]);
  const [recentUsers, setRecentUsers]   = useState([]);
  const [message, setMessage]         = useState('');
  const [resettingDb, setResettingDb] = useState(false);

  function flash(msg) {
    setMessage(msg);
    setTimeout(() => setMessage(''), 5000);
  }

  async function load() {
    const [t, s, r, u] = await Promise.all([
      api.getTestamentos(),
      api.getStats(),
      api.getRanking(),
      api.getRecentUsers(),
    ]);
    if (t.ok) setTestamentos(t.data);
    if (s.ok) setStats(s.data);
    if (r.ok) setRanking(r.data);
    if (u.ok) setRecentUsers(u.data);
  }

  useEffect(() => { load(); }, []);

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

          {/* ── Ranking ── */}
          <div className="admin-card">
            <span className="admin-card-title">Ranking — Missões Cumpridas</span>
            {ranking.length === 0 ? (
              <p className="font-old text-sm opacity-50 text-center py-2">Nenhum participante ativo ainda.</p>
            ) : (
              <div className="ranking-list">
                {ranking.map((u, i) => (
                  <div key={u.id} className={`ranking-row ranking-row--${i + 1}`}>
                    <span className="ranking-pos">{PODIUM_ICON[i]}</span>
                    <span className="ranking-name">{u.nome}</span>
                    <div className="ranking-meta">
                      <span className="ranking-missions">
                        {u.missionsDone} missão{u.missionsDone !== 1 ? 'ões' : ''}
                      </span>
                      {u.testamentosAtivos > 0 && (
                        <span className="ranking-badge-active">
                          {u.testamentosAtivos} em vigor
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Últimos ingressantes ── */}
          <div className="admin-card">
            <span className="admin-card-title">Últimos Ingressantes</span>
            {recentUsers.length === 0 ? (
              <p className="font-old text-sm opacity-50 text-center py-2">Nenhum participante cadastrado ainda.</p>
            ) : (
              <div className="newcomers-list">
                {recentUsers.map(u => (
                  <div key={u.id} className="newcomer-card">
                    <div
                      className="newcomer-avatar"
                      style={{ borderColor: TRILHA_COLOR[u.trilha] ?? 'rgba(112,69,34,.4)' }}
                    >
                      {u.trilha
                        ? <img src={TRILHA_AVATAR[u.trilha]} alt={u.trilha} />
                        : <span className="newcomer-avatar__fallback">?</span>}
                    </div>
                    <div className="newcomer-info">
                      <span className="newcomer-name">{u.nome}</span>
                      {u.trilha
                        ? <span className="newcomer-trilha" style={{ color: TRILHA_COLOR[u.trilha] }}>
                            {LINHAGEM_ICON[u.trilha]} {LINHAGEM_LABEL[u.trilha]}
                          </span>
                        : <span className="newcomer-trilha" style={{ opacity: .4 }}>sem trilha</span>}
                    </div>
                    <span className="newcomer-num">#{u.numero || u.id}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

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
                  const tot  = stats.byTrilha?.[l] ?? 0;
                  const done = stats.completedByTrilha?.[l] ?? 0;
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

/* ── Entry point ───────────────────────────────── */
function Admin() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === '1'
  );

  if (!unlocked) {
    return <AdminLogin onUnlock={() => setUnlocked(true)} />;
  }

  return <AdminPanel />;
}

export default Admin;
