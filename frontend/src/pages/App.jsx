import React, { useMemo, useState, useEffect } from 'react';
import TemplatePicker from '../components/TemplatePicker.jsx';
import PreviewPane from '../components/PreviewPane.jsx';
import AuthModal from '../components/AuthModal.jsx';
import ProjectList from '../components/ProjectList.jsx';
import { AuthAPI, GenerateAPI, ProjectsAPI, setAuthToken } from '../api.js';
import { combineFilesToHtml, exportAsZip } from '../utils.js';
import { toast } from 'react-toastify';

const TYPES = ['Mobile App', 'Website', 'WebApp'];

export default function App() {
  const [prompt, setPrompt] = useState('A clean portfolio site for a designer with a hero, projects grid, and contact form.');
  const [appType, setAppType] = useState('Website');
  const [template, setTemplate] = useState('Portfolio');
  const [files, setFiles] = useState([]);
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);

  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState('My Generated App');
  const token = useMemo(() => localStorage.getItem('token') || '', []);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      // minimal user object stored too
      const u = localStorage.getItem('user');
      if (u) setUser(JSON.parse(u));
      refreshProjects();
    }
  }, []);

  useEffect(() => {
    setHtml(combineFilesToHtml(files));
  }, [files]);

  async function refreshProjects() {
    try {
      const list = await ProjectsAPI.list();
      setProjects(list);
    } catch {}
  }

  async function handleGenerate() {
    try {
      setLoading(true);
      const { files: generated } = await GenerateAPI.generate(prompt, appType, template);
      setFiles(generated);
      toast.success('Generated!');
    } catch (e) {
      toast.error(e?.response?.data?.error || 'Failed to generate');
    } finally {
      setLoading(false);
    }
  }

  function handleExport() {
    exportAsZip(files, projectName || 'generated-app');
  }

  async function handleSave() {
    if (!user) {
      setAuthMode('login');
      setAuthOpen(true);
      return;
    }
    try {
      const saved = await ProjectsAPI.create(projectName || 'Untitled', files);
      toast.success('Saved project');
      setProjectName(saved.name);
      refreshProjects();
    } catch (e) {
      toast.error(e?.response?.data?.error || 'Failed to save');
    }
  }

  async function openProject(id) {
    try {
      const p = await ProjectsAPI.get(id);
      setFiles(p.files);
      setProjectName(p.name);
      toast.info('Project loaded');
    } catch (e) { toast.error('Failed to open'); }
  }

  async function deleteProject(id) {
    try {
      await ProjectsAPI.remove(id);
      refreshProjects();
      toast.success('Deleted');
    } catch (e) { toast.error('Failed to delete'); }
  }

  async function onLogin({ email, password }) {
    try {
      const res = authMode === 'login' ?
        await AuthAPI.login(email, password) : await AuthAPI.register(email, password);
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setAuthToken(res.token);
      setUser(res.user);
      setAuthOpen(false);
      toast.success('Authenticated');
      refreshProjects();
    } catch (e) {
      toast.error(e?.response?.data?.error || 'Auth failed');
    }
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthToken(null);
    setUser(null);
    setProjects([]);
    toast.info('Logged out');
  }

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4 h-screen">
        <div className="flex flex-col gap-4 h-full">
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">AI App/Website Builder</h1>
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <span className="text-sm opacity-80">{user.email}</span>
                  <button className="px-3 py-1 rounded bg-white/10" onClick={logout}>Logout</button>
                </>
              ) : (
                <>
                  <button className="px-3 py-1 rounded bg-white/10" onClick={() => { setAuthMode('login'); setAuthOpen(true); }}>Login</button>
                  <button className="px-3 py-1 rounded bg-emerald-500" onClick={() => { setAuthMode('register'); setAuthOpen(true); }}>Register</button>
                </>
              )}
            </div>
          </header>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
            <div>
              <label className="block text-sm mb-1">Describe your {appType.toLowerCase()}</label>
              <textarea
                className="w-full min-h-[120px] rounded bg-white/10 border border-white/20 p-2"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Type</label>
                <select
                  className="w-full rounded bg-white/10 border border-white/20 p-2"
                  value={appType}
                  onChange={e => setAppType(e.target.value)}
                >
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Template</label>
                <TemplatePicker selected={template} onSelect={setTemplate} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                className="rounded bg-white/10 border border-white/20 p-2"
                placeholder="Project name"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex-1 rounded bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 px-3 py-2"
                >{loading ? 'Generating…' : 'Generate'}</button>
                <button onClick={handleExport} className="rounded bg-white/10 px-3 py-2">Export Code</button>
                <button onClick={handleSave} className="rounded bg-white/10 px-3 py-2">Save</button>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 overflow-auto flex-1">
            <h2 className="font-semibold mb-2">My Projects</h2>
            <ProjectList projects={projects} onOpen={openProject} onDelete={deleteProject} />
          </div>
        </div>

        <div className="bg-white rounded-xl overflow-hidden h-full border border-white/10">
          <PreviewPane html={html} />
        </div>
      </div>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSubmit={onLogin}
        mode={authMode}
      />
    </div>
  );
}