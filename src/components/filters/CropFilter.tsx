import { useState } from 'react';
import type { KeyboardEvent } from 'react';

interface CropFilterProps {
  crops: string[];
  value: string[];
  onChange: (crops: string[]) => void;
}

export default function CropFilter({ crops, value, onChange }: CropFilterProps) {
  const [search, setSearch] = useState('');
  const filtered = crops.filter(c =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (crop: string) => {
    if (value.includes(crop)) onChange(value.filter(c => c !== crop));
    else onChange([...value, crop]);
  };

  const onKey = (e: KeyboardEvent, crop: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle(crop);
    }
  };

  return (
    <div className="mb-4 w-full">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <label className="font-semibold">Crops</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onChange(crops.slice())} className="btn-primary" style={{ padding: '6px 8px', fontSize: '0.8rem' }}>Select all</button>
          <button onClick={() => onChange([])} className="" style={{ padding: '6px 8px', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: 8 }}>Clear</button>
        </div>
      </div>

      <input
        type="text"
        className="search-input"
        placeholder="Search crop..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', marginBottom: 8 }}
      />

      <div className="chip-container" style={{ maxHeight: 160, overflowY: 'auto' }} role="listbox" aria-multiselectable>
        {filtered.map(cp => (
          <button
            key={cp}
            type="button"
            onClick={() => toggle(cp)}
            onKeyDown={(e) => onKey(e, cp)}
            tabIndex={0}
            aria-pressed={value.includes(cp)}
            className={`chip ${value.includes(cp) ? 'chip--selected' : ''}`}
          >
            {cp}
          </button>
        ))}
      </div>
    </div>
  );
}
