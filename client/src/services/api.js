const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

export const api = {
  // Missions
  getMissions: (linhagem) =>
    request(`/missions${linhagem ? `?linhagem=${linhagem}` : ''}`),

  // Testamentos
  getTestamentos: () => request('/testamentos'),
  getTestamento: (id) => request(`/testamentos/${id}`),
  createTestamento: (body) => request('/testamentos', { method: 'POST', body }),
  generateBatch: (quantidades) => request('/testamentos/batch/generate', { method: 'POST', body: { quantidades } }),
  clearTestamentos: () => request('/testamentos/batch/all', { method: 'DELETE' }),

  // Validate
  validate: (body) => request('/validate', { method: 'POST', body }),
  checkSenha: (body) => request('/validate/check', { method: 'POST', body }),

  // Users
  resetUser: (id) => request(`/users/${id}`, { method: 'DELETE' }),

  // Admin
  getStats: () => request('/admin/stats'),
  resetDb: () => request('/admin/reset', { method: 'POST' }),
};
