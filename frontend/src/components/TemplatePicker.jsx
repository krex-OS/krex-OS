import React from 'react';
import classNames from 'classnames';

const TEMPLATES = ['Portfolio', 'Business', 'Blog', 'E-Commerce'];

export default function TemplatePicker({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {TEMPLATES.map(t => (
        <button
          key={t}
          type="button"
          onClick={() => onSelect(t)}
          className={classNames(
            'rounded border px-3 py-2 text-sm hover:bg-white/10',
            selected === t ? 'border-white bg-white/10' : 'border-white/30'
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}