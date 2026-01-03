"use client";
import React from 'react';
import { FormData } from '@/types';

interface Section6Props {
  formData: FormData;
  updateField: (field: keyof FormData, value: any) => void;
}

const Section6: React.FC<Section6Props> = ({ formData, updateField }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="space-y-6 bg-[#fdfbf9] p-6 rounded-3xl border border-[#eeeae5]">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em] block text-center" style={{ fontFamily: 'var(--font-poppins)' }}>
          Usual Sleep Posture
        </label>
        <div className="grid grid-cols-1 gap-2.5">
          {['On back', 'On stomach', 'Left side', 'Right side', 'Change positions'].map(opt => (
            <button
              key={opt}
              onClick={() => updateField('sleepPosition', opt)}
              className={`text-left px-5 py-3 rounded-2xl text-sm font-medium transition-all border ${formData.sleepPosition === opt
                ? 'tan-bg text-[#1a2b33] border-transparent shadow-md'
                : 'bg-white text-[#8b8780] border-[#eeeae5] hover:border-tan-bg hover:bg-[#f8f5f1]'
                }`}
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-6 bg-[#fdfbf9] p-6 rounded-3xl border border-[#eeeae5]">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em] block text-center" style={{ fontFamily: 'var(--font-poppins)' }}>
          Post-Sleep Impact
        </label>
        <div className="grid grid-cols-1 gap-2.5">
          {['Worse in morning', 'Worse at night', 'No change', 'Improves after moving'].map(opt => (
            <button
              key={opt}
              onClick={() => updateField('sleepImpact', opt)}
              className={`text-left px-5 py-3 rounded-2xl text-sm font-medium transition-all border ${formData.sleepImpact === opt
                ? 'tan-bg text-[#1a2b33] border-transparent shadow-md'
                : 'bg-white text-[#8b8780] border-[#eeeae5] hover:border-tan-bg hover:bg-[#f8f5f1]'
                }`}
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-6 bg-[#fdfbf9] p-6 rounded-3xl border border-[#eeeae5]">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em] block text-center" style={{ fontFamily: 'var(--font-poppins)' }}>
          Morning Stiffness Focus
        </label>
        <div className="grid grid-cols-1 gap-2.5">
          {['None', 'Lower back', 'Front of hips', 'Back of legs', 'Mid-back', 'Multiple areas'].map(opt => (
            <button
              key={opt}
              onClick={() => updateField('morningStiffnessArea', opt)}
              className={`text-left px-5 py-3 rounded-2xl text-sm font-medium transition-all border ${formData.morningStiffnessArea === opt
                ? 'tan-bg text-[#1a2b33] border-transparent shadow-md'
                : 'bg-white text-[#8b8780] border-[#eeeae5] hover:border-tan-bg hover:bg-[#f8f5f1]'
                }`}
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Section6;

