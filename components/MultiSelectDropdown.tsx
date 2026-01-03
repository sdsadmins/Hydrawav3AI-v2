"use client";
import React, { useState, useRef, useEffect } from 'react';

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  options,
  selected,
  onToggle
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleManualAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!manualInput.trim()) return;
    if (!selected.includes(manualInput.trim())) {
      onToggle(manualInput.trim());
    }
    setManualInput('');
  };

  const allVisibleOptions = Array.from(new Set([...options, ...selected]));

  return (
    <div className="relative space-y-3" ref={containerRef}>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em] block" style={{ fontFamily: 'var(--font-poppins)' }}>
        {label}
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#fdfbf9] border border-[#eeeae5] rounded-2xl px-5 py-4 cursor-pointer flex justify-between items-center transition-all hover:border-tan-bg group min-h-[60px]"
      >
        <div className="flex flex-wrap gap-2 overflow-hidden">
          {selected.length === 0 ? (
            <span className="text-sm text-[#8b8780] italic" style={{ fontFamily: 'var(--font-poppins)' }}>Select factors...</span>
          ) : (
            selected.map(s => (
              <span key={s} className="bg-tan-bg/10 text-tan-text text-xs font-semibold uppercase px-3 py-1.5 rounded-lg border border-tan-bg/20 animate-in fade-in zoom-in-95" style={{ fontFamily: 'var(--font-poppins)' }}>
                {s}
              </span>
            ))
          )}
        </div>
        <svg className={`w-5 h-5 text-[#b5b0a8] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 bg-white border border-[#eeeae5] rounded-[8px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-72 overflow-y-auto p-2 grid grid-cols-1 gap-0.5 custom-scrollbar">
            {allVisibleOptions.map(opt => (
              <button
                key={opt}
                onClick={(e) => { e.stopPropagation(); onToggle(opt); }}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between gap-3 ${selected.includes(opt) ? 'tan-bg text-[#1a2b33]' : 'hover:bg-[#f9f6f1] text-[#1a2b33]'}`}
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                <span className="flex-1">{opt}</span>
                {selected.includes(opt) && (
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          <div className="p-4 bg-[#fdfbf9] border-t border-[#eeeae5]">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Manual entry..."
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualAdd()}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 text-sm font-medium bg-white border border-[#eeeae5] rounded-xl px-4 py-2.5 focus:border-tan-bg outline-none transition-all"
                style={{ fontFamily: 'var(--font-poppins)' }}
              />
              <button
                onClick={(e) => { e.stopPropagation(); handleManualAdd(); }}
                className="tan-bg text-white text-xs font-semibold uppercase tracking-[0.1em] px-5 py-2.5 rounded-xl transition-transform active:scale-95"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;

