import React from 'react';

export default function ProjectList({ projects, onOpen, onDelete }) {
  if (!projects?.length) return (
    <div className="text-sm opacity-70">No saved projects yet.</div>
  );
  return (
    <ul className="space-y-2">
      {projects.map(p => (
        <li key={p.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded px-3 py-2">
          <div>
            <div className="font-medium">{p.name}</div>
            <div className="text-xs opacity-70">{new Date(p.updatedAt).toLocaleString()}</div>
          </div>
          <div className="flex gap-2">
            <button className="text-emerald-400 hover:underline" onClick={() => onOpen(p.id)}>Open</button>
            <button className="text-red-400 hover:underline" onClick={() => onDelete(p.id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}