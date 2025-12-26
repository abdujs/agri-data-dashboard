// src/components/filters/CountryFilter.tsx
import type { KeyboardEvent } from 'react';

interface CountryFilterProps {
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  countries: string[];
}

export default function CountryFilter({ 
  selectedCountry, 
  onCountryChange,
  countries 
}: CountryFilterProps) {
  const onKey = (e: KeyboardEvent, country: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onCountryChange(country);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-base font-bold" id="country-filter-label">
        Country
      </label>

      <div
        role="listbox"
        aria-labelledby="country-filter-label"
        className="chip-container"
      >
        {countries.map(country => {
          const selected = country === selectedCountry;
          return (
            <button
              key={country}
              type="button"
              role="option"
              aria-selected={selected}
              tabIndex={0}
              onClick={() => onCountryChange(country)}
              onKeyDown={(e) => onKey(e, country)}
              className={`chip ${selected ? 'chip--selected' : ''}`}
            >
              {country}
            </button>
          );
        })}
      </div>

      <p className="text-xs" style={{ color: 'var(--color-muted-400)' }}>
        Showing data for <span style={{ fontWeight: 700, color: 'var(--color-primary-500)' }}>{selectedCountry}</span>
      </p>
    </div>
  );
}