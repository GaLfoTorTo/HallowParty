const SESSION_KEY = 'hallowparty_session';

/** Lê a sessão atual do localStorage. Retorna null se não existir. */
export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

/** Faz merge parcial na sessão salva (não sobrescreve campos existentes). */
export function saveSession(data) {
  try {
    const current = getSession() || {};
    localStorage.setItem(SESSION_KEY, JSON.stringify({ ...current, ...data }));
  } catch {}
}

/** Remove a sessão completamente. */
export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}

/** Substitui a lista de missões na sessão e retorna a sessão atualizada. */
export function updateSessionMissions(missions) {
  const current = getSession() || {};
  const next = { ...current, missions };
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(next));
  } catch {}
  return next;
}

/**
 * Chamado ao final da etapa 2 (trilha confirmada).
 * Envia para o banco primeiro e, com a resposta, salva localmente.
 * Retorna os dados completos { user, testamento, missions }.
 */
export async function registerSession(nome, trilha) {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, trilha }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Falha ao registrar sessão');
  }

  const data = await res.json();

  saveSession({
    user: data.user,
    trilha,
    testamento: data.testamento,
    missions: data.missions,
  });

  return data;
}
