import React from 'react';

interface YearRangeProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (range: [number, number]) => void;
}

export default function YearRange({ min, max, value, onChange }: YearRangeProps) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold">Year Range</label>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={e => onChange([Number(e.target.value), value[1]])}
          className="w-24"
        />
        <span>{value[0]}</span>
        <span>-</span>
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={e => onChange([value[0], Number(e.target.value)])}
          className="w-24"
        />
        <span>{value[1]}</span>
      </div>
    </div>
  );
}
