import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5001',
});

export function setAuthToken(token) {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
}

export const AuthAPI = {
  async register(email, password) {
    const { data } = await api.post('/api/auth/register', { email, password });
    return data;
  },
  async login(email, password) {
    const { data } = await api.post('/api/auth/login', { email, password });
    return data;
  },
};

export const GenerateAPI = {
  async generate(prompt, appType, template) {
    const { data } = await api.post('/api/generate', { prompt, appType, template });
    return data;
  },
};

export const ProjectsAPI = {
  async list() {
    const { data } = await api.get('/api/projects');
    return data;
  },
  async create(name, files) {
    const { data } = await api.post('/api/projects', { name, files });
    return data;
  },
  async update(id, name, files) {
    const { data } = await api.put(`/api/projects/${id}`, { name, files });
    return data;
  },
  async get(id) {
    const { data } = await api.get(`/api/projects/${id}`);
    return data;
  },
  async remove(id) {
    const { data } = await api.delete(`/api/projects/${id}`);
    return data;
  },
};

export default api;