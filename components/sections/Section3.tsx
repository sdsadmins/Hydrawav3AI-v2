"use client";
import React, { useState, useEffect, useRef } from 'react';
import BodyMap from '../BodyMap';
import { FormData } from '@/types';
import HumanBodyViewerInteractive from '../humabn-body-interactive';

interface Section3Props {
  formData: FormData;
  updateField: (field: keyof FormData, value: any) => void;
}

const Section3: React.FC<Section3Props> = ({ formData, updateField }) => {
  // Keep local state for body part selection (for UI display)
  // Only sync to formData when secondaryBehavior is selected
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(
    formData.secondaryBehavior && formData.secondaryDiscomfortArea ? formData.secondaryDiscomfortArea : null
  );
  const [allSelectedParts, setAllSelectedParts] = useState<string[]>(
    formData.secondaryBehavior && formData.secondaryDiscomfortArea ? [formData.secondaryDiscomfortArea] : []
  );

  // Update allSelectedParts when selectedBodyPart changes
  useEffect(() => {
    setAllSelectedParts(selectedBodyPart ? [selectedBodyPart] : []);
  }, [selectedBodyPart]);

  // Sync to formData only when behavior is selected
  // This ensures secondaryDiscomfortArea is only saved after behavior is selected
  useEffect(() => {
    if (formData.secondaryBehavior) {
      // Behavior is selected - save/update body part in formData
      const currentArea = formData.secondaryDiscomfortArea || '';
      if (selectedBodyPart !== currentArea) {
        updateField('secondaryDiscomfortArea', selectedBodyPart || '');
      }
    } else {
      // Behavior is not selected - ensure formData is cleared
      if (formData.secondaryDiscomfortArea) {
        updateField('secondaryDiscomfortArea', '');
      }
    }
  }, [selectedBodyPart, formData.secondaryBehavior, formData.secondaryDiscomfortArea, updateField]);

  // Reset selection when user selects "No" for hasOtherDiscomfort
  useEffect(() => {
    if (formData.hasOtherDiscomfort === 'No') {
      setSelectedBodyPart(null);
      setAllSelectedParts([]);
      updateField('secondaryDiscomfortArea', '');
      updateField('secondaryBehavior', '');
    }
  }, [formData.hasOtherDiscomfort, updateField]);

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-6 bg-[#fdfbf9] p-6 rounded-3xl border border-[#eeeae5] w-fit shadow-sm">
        <span className="text-xs font-semibold text-[#8b8780] uppercase tracking-[0.1em] px-4" style={{ fontFamily: 'var(--font-poppins)' }}>
          Identify Secondary Discomfort?
        </span>
        <div className="flex gap-3">
          {['No', 'Yes'].map(opt => (
            <button
              key={opt}
              onClick={() => updateField('hasOtherDiscomfort', opt)}
              className={`px-8 py-3.5 rounded-2xl text-sm font-medium transition-all border ${formData.hasOtherDiscomfort === opt
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
      {formData.hasOtherDiscomfort === 'Yes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start pt-8 border-t border-[#eeeae5] animate-in fade-in slide-in-from-top-4 duration-700">
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
              <label className="block text-xs font-semibold text-[#8b8780] uppercase tracking-[0.1em] mb-6" style={{ fontFamily: 'var(--font-poppins)' }}>
                Intensity Factor: <span className="tan-text ml-3 text-4xl font-bold" style={{ fontFamily: 'var(--font-poppins)' }}>{formData.secondaryIntensity}</span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={formData.secondaryIntensity}
                onChange={(e) => updateField('secondaryIntensity', parseInt(e.target.value))}
                className="w-full h-2 bg-[#eeeae5] rounded-full accent-[#d6b499] cursor-pointer"
              />
              <div className="flex justify-between mt-5 text-[10px] font-semibold text-[#b5b0a8] tracking-[0.15em]" style={{ fontFamily: 'var(--font-poppins)' }}>
                <span>MILD</span><span>MODERATE</span><span>SEVERE</span>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-xs font-semibold text-[#b5b0a8] uppercase tracking-[0.1em] block" style={{ fontFamily: 'var(--font-poppins)' }}>
                Duration Profile
              </label>
              <div className="grid grid-cols-1 gap-3">
                {['Less than 6 weeks', '6 weeks to 3 months', '3 to 6 months', '6 months to 1 year', 'More than 1 year'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => updateField('secondaryDuration', opt)}
                    className={`text-left px-5 py-3.5 rounded-2xl text-sm font-medium transition-all border ${formData.secondaryDuration === opt
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
                    onClick={() => updateField('secondaryBehavior', opt)}
                    className={`text-left px-5 py-3.5 rounded-2xl text-sm font-medium transition-all border ${formData.secondaryBehavior === opt
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
      )}
    </div>
  );
};

export default Section3;

