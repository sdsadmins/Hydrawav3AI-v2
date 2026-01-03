"use client";
import React, { useState, useEffect, useRef } from 'react';
import BodyMap from '../BodyMap';
import { FormData } from '@/types';
import HumanBodyViewerInteractive from '../humabn-body-interactive';

interface Section2Props {
  formData: FormData;
  updateField: (field: keyof FormData, value: any) => void;
}

const Section2: React.FC<Section2Props> = ({ formData, updateField }) => {
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(formData.primaryDiscomfortArea || null);
  const [allSelectedParts, setAllSelectedParts] = useState<string[]>(formData.primaryDiscomfortArea ? [formData.primaryDiscomfortArea] : []);
  const lastSyncedValue = useRef<string | null>(formData.primaryDiscomfortArea || null);

  // Sync local state to formData when selection changes (user interaction)
  useEffect(() => {
    if (selectedBodyPart !== lastSyncedValue.current) {
      lastSyncedValue.current = selectedBodyPart;
      updateField('primaryDiscomfortArea', selectedBodyPart || '');
      setAllSelectedParts(selectedBodyPart ? [selectedBodyPart] : []);
    }
  }, [selectedBodyPart, updateField]);

  // Initialize from formData when formData changes externally (but not from our own updates)
  useEffect(() => {
    if (formData.primaryDiscomfortArea !== lastSyncedValue.current) {
      lastSyncedValue.current = formData.primaryDiscomfortArea || null;
      setSelectedBodyPart(formData.primaryDiscomfortArea || null);
      setAllSelectedParts(formData.primaryDiscomfortArea ? [formData.primaryDiscomfortArea] : []);
    }
  }, [formData.primaryDiscomfortArea]);

  // const [reportData, setReportData] = useState<ReportData | null>(null);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

      <div className="flex flex-col h-full">
        <HumanBodyViewerInteractive
          selectedPart={selectedBodyPart}
          onPartSelect={setSelectedBodyPart}
          allSelectedParts={allSelectedParts}
        // focusRegions={reportData?.at_home_mobility_focus?.focus_regions || []}
        />
        <div className="mt-auto pt-4 flex justify-center">
          {selectedBodyPart && (
            <p
              className="text-sm text-center font-medium text-white px-6 py-2 rounded-2xl bg-orange-600 antialiased tracking-wide"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {selectedBodyPart}
            </p>
          )}
        </div>
      </div>



      <div className="space-y-8">
        <div className="bg-[#fdfbf9] p-8 rounded-3xl border border-[#eeeae5]">
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em] mb-6" style={{ fontFamily: 'var(--font-poppins)' }}>
            Intensity Threshold: <span className="ml-3 text-4xl font-bold" style={{ fontFamily: 'var(--font-poppins)' }}>{formData.primaryIntensity}</span>
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={formData.primaryIntensity}
            onChange={(e) => updateField('primaryIntensity', parseInt(e.target.value))}
            className="w-full h-2 bg-[#eeeae5] rounded-full accent-[#d6b499] cursor-pointer"
          />
          <div className="flex justify-between mt-5 text-[10px] font-semibold text-[#b5b0a8] tracking-[0.15em]" style={{ fontFamily: 'var(--font-poppins)' }}>
            <span>MILD</span><span>MODERATE</span><span>SEVERE</span>
          </div>
        </div>
        <div className="space-y-4">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em] block" style={{ fontFamily: 'var(--font-poppins)' }}>
            Temporal Duration
          </label>
          <div className="grid grid-cols-1 gap-3">
            {['Less than 6 weeks', '6 weeks to 3 months', '3 to 6 months', '6 months to 1 year', 'More than 1 year'].map(opt => (
              <button
                key={opt}
                onClick={() => updateField('primaryDuration', opt)}
                className={`text-left px-5 py-3.5 rounded-2xl text-sm font-medium transition-all border ${formData.primaryDuration === opt
                  ? 'tan-bg text-[#1a2b33] border-transparent shadow-lg'
                  : 'bg-[#fdfbf9] text-[#8b8780] border-[#eeeae5] hover:border-tan-bg hover:bg-[#f8f5f1]'
                  }`}
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <label className="text-xs font-semibold text-[#b5b0a8] uppercase tracking-[0.1em] block" style={{ fontFamily: 'var(--font-poppins)' }}>
            Discomfort Behavior
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {['Always present', 'Comes and goes', 'Only with certain activities', 'Varies day to day'].map(opt => (
              <button
                key={opt}
                onClick={() => updateField('primaryBehavior', opt)}
                className={`text-left px-5 py-3.5 rounded-2xl text-sm font-medium transition-all border ${formData.primaryBehavior === opt
                  ? 'tan-bg text-[#1a2b33] border-transparent shadow-lg'
                  : 'bg-[#fdfbf9] text-[#8b8780] border-[#eeeae5] hover:border-tan-bg hover:bg-[#f8f5f1]'
                  }`}
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section2;

