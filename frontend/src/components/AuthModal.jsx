import React, { useState } from 'react';

export default function AuthModal({ isOpen, onClose, onSubmit, mode = 'login' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 text-white w-full max-w-sm rounded-xl p-6 border border-white/10">
        <h2 className="text-xl font-semibold mb-4">{mode === 'login' ? 'Login' : 'Register'}</h2>
        <div className="space-y-3">
          <input
            className="w-full rounded bg-white/10 border border-white/20 px-3 py-2"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full rounded bg-white/10 border border-white/20 px-3 py-2"
            placeholder="Password (min 6)"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <button className="px-3 py-2 rounded bg-white/10" onClick={onClose}>Cancel</button>
            <button
              className="px-3 py-2 rounded bg-emerald-500 hover:bg-emerald-600"
              onClick={() => onSubmit({ email, password })}
            >
              {mode === 'login' ? 'Login' : 'Create account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}