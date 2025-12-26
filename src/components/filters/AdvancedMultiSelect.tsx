// src/components/filters/AdvancedMultiSelect.tsx
import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, X, Search } from 'lucide-react';

interface AdvancedMultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export default function AdvancedMultiSelect({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Select items...'
}: AdvancedMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  const toggleOption = (option: string) => {
    const newSelected = selected.includes(option)
      ? selected.filter(item => item !== option)
      : [...selected, option];
    onChange(newSelected);
  };

  const selectAll = () => onChange([...options]);
  const clearAll = () => onChange([]);
  const removeSelected = (option: string) => {
    onChange(selected.filter(item => item !== option));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {label}
      </label>
      
      {/* Selected items chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map(item => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200"
            >
              {item}
              <button
                onClick={() => removeSelected(item)}
                className="ml-1 hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={clearAll}
            className="text-sm text-gray-600 hover:text-gray-900 px-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Dropdown trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 text-left bg-white border-2 border-gray-300 rounded-xl hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 flex justify-between items-center transition-colors"
      >
        <span className="text-gray-700">
          {selected.length === 0 ? placeholder : `${selected.length} selected`}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-300 rounded-xl shadow-xl max-h-96 overflow-hidden">
          {/* Search bar */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                autoFocus
              />
            </div>
            
            {/* Actions */}
            <div className="flex justify-between mt-3 text-sm">
              <button
                onClick={selectAll}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Select All
              </button>
              <span className="text-gray-600">
                {filteredOptions.length} items
              </span>
            </div>
          </div>

          {/* Options list */}
          <div className="overflow-y-auto max-h-64">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No results found</div>
            ) : (
              filteredOptions.map(option => (
                <div
                  key={option}
                  onClick={() => toggleOption(option)}
                  className="flex items-center px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center transition-colors
                    ${selected.includes(option) 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {selected.includes(option) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}