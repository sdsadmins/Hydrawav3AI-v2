"use client";
import React from 'react';
import MultiSelectDropdown from '../MultiSelectDropdown';
import { FormData } from '@/types';

interface Section7Props {
  formData: FormData;
  toggleMultiSelect: (field: keyof FormData, value: string) => void;
  updateField: (field: keyof FormData, value: any) => void;
}

const WORSENING_OPTIONS = [
  'Sitting >30 min', 'Standing >30 min', 'Getting up from sitting', 'Walking', 'Stairs',
  'Bending backward', 'Twisting', 'Reaching', 'Morning', 'End of day',
  'During exercise', 'After exercise', 'None', 'Not sure'
];

const IMPROVING_OPTIONS = [
  'Sitting', 'Standing and moving', 'Walking', 'Stretching', 'Knees-to-chest',
  'Heat', 'Cold', 'Gentle movement', 'Massage', 'Changing positions',
  'Rest', 'Exercise', 'Nothing yet'
];

const Section7: React.FC<Section7Props> = ({ formData, toggleMultiSelect, updateField }) => {
  return (
    <div className="space-y-12 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-muted-foreground">
        <MultiSelectDropdown
          label="Which situations make symptoms worse?"
          options={WORSENING_OPTIONS}
          selected={formData.worseningSituations}
          onToggle={(val) => toggleMultiSelect('worseningSituations', val)}
        />
        <MultiSelectDropdown
          label="Which situations make symptoms feel better?"
          options={IMPROVING_OPTIONS}
          selected={formData.improvingSituations}
          onToggle={(val) => toggleMultiSelect('improvingSituations', val)}
        />
      </div>

      <div className="bg-[#fdfbf9] p-8 rounded-3xl border border-[#eeeae5] shadow-sm space-y-6">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em] block text-center" style={{ fontFamily: 'var(--font-poppins)' }}>
          Which position is harder to tolerate overall?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {['Standing', 'Sitting', 'Both', 'Neither'].map(opt => (
            <button
              key={opt}
              onClick={() => updateField('harderPosition', opt)}
              className={`py-4 rounded-2xl text-sm font-medium border transition-all ${formData.harderPosition === opt
                ? 'tan-bg text-[#1a2b33] border-transparent shadow-lg'
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

export default Section7;

