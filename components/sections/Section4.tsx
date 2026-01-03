"use client";
import React, { useState, useMemo, useEffect } from 'react';
import BodyMap from '../BodyMap';
import { FormData, MovementAssessment } from '@/types';
import HumanBodyViewerInteractive from '../humabn-body-interactive';

interface Section4Props {
  formData: FormData;
  updateField: (field: keyof FormData, value: any) => void;
  toggleMultiSelect: (field: keyof FormData, value: string) => void;
  isManualMode: boolean;
  manualMovement: string;
  setIsManualMode: (value: boolean) => void;
  setManualMovement: (value: string) => void;
}

const PRIMARY_MOVEMENTS = [
  'Squat / Sit-to-Stand', 'Hip Hinge', 'Lunge / Split Stance', 'Overhead Reach / Shoulder Elevation', 'Forward Bend (Toe Touch)'
];

const SECONDARY_MOVEMENTS = [
  'Single-Leg Balance', 'Trunk Rotation', 'Step-Down', 'Arm Raise (Single Arm)'
];

const Section4: React.FC<Section4Props> = ({
  formData,
  updateField,
  toggleMultiSelect,
  isManualMode,
  manualMovement,
  setIsManualMode,
  setManualMovement
}) => {
  const [showMoreMovements, setShowMoreMovements] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [selectedTravelArea, setSelectedTravelArea] = useState<string | null>(formData.sensationTravelArea || null);
  const [allSelectedParts, setAllSelectedParts] = useState<string[]>(formData.movementTightnessAreas || []);

  // Sync allSelectedParts with formData.movementTightnessAreas
  useEffect(() => {
    setAllSelectedParts(formData.movementTightnessAreas || []);
  }, [formData.movementTightnessAreas]);

  // Handle body part selection for movement tightness areas - add to movementTightnessAreas
  const handleBodyPartSelect = (partName: string | null) => {
    if (partName) {
      // Toggle the body part in movementTightnessAreas
      toggleMultiSelect('movementTightnessAreas', partName);
      setSelectedBodyPart(partName);
    } else {
      setSelectedBodyPart(null);
    }
  };

  // Handle body part selection for sensation travel area
  const handleTravelAreaSelect = (partName: string | null) => {
    setSelectedTravelArea(partName);
    updateField('sensationTravelArea', partName || '');
  };

  const handleMovementSelect = (opt: string) => {
    setIsManualMode(false);
    updateField('selectedMovement', opt);
  };

  const toggleManualMode = () => {
    setIsManualMode(!isManualMode);
    updateField('selectedMovement', '');
  };

  const archiveAndAddNewEntry = () => {
    const movementName = isManualMode ? manualMovement : formData.selectedMovement;

    if (!movementName || !formData.movementImpact) {
      alert("Please ensure movement and impact are selected before starting a new entry.");
      return;
    }

    const currentAssessment: MovementAssessment = {
      movementName: movementName,
      impact: formData.movementImpact,
      tightnessAreas: [...formData.movementTightnessAreas],
      sensations: [...formData.sensationDescription]
    };

    updateField('recordedAssessments', [...formData.recordedAssessments, currentAssessment]);
    updateField('selectedMovement', '');
    updateField('movementImpact', '');
    updateField('movementTightnessAreas', []);
    updateField('sensationDescription', []);
    setManualMovement('');
    setIsManualMode(false);
  };

  const removeRecordedAssessment = (index: number) => {
    updateField('recordedAssessments', formData.recordedAssessments.filter((_, i) => i !== index));
  };

  const allAssessmentsToDisplay = useMemo(() => {
    const history = [...formData.recordedAssessments];
    const movementName = isManualMode ? manualMovement : formData.selectedMovement;

    if (movementName && formData.movementImpact) {
      history.push({
        movementName: movementName,
        impact: formData.movementImpact,
        tightnessAreas: formData.movementTightnessAreas,
        sensations: formData.sensationDescription
      });
    }
    return history;
  }, [formData.recordedAssessments, formData.selectedMovement, formData.movementImpact, formData.movementTightnessAreas, formData.sensationDescription, isManualMode, manualMovement]);

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <div className="flex items-center gap-3 flex-wrap">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em]" style={{ fontFamily: 'var(--font-poppins)' }}>
            Guided Movement (Select to begin test)
          </label>
          <span className="text-[10px] font-semibold text-red-400 uppercase tracking-[0.1em] bg-red-400/10 px-3 py-1 rounded-lg border border-red-400/20" style={{ fontFamily: 'var(--font-poppins)' }}>
            Mandatory for Protocol
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {PRIMARY_MOVEMENTS.map(opt => (
            <button
              key={opt}
              onClick={() => handleMovementSelect(opt)}
              className={`px-5 py-3.5 rounded-2xl text-sm font-medium transition-all border ${formData.selectedMovement === opt && !isManualMode
                ? 'tan-bg text-[#1a2b33] border-transparent shadow-lg'
                : 'bg-[#fdfbf9] text-[#8b8780] border-[#eeeae5] hover:border-tan-bg hover:bg-[#f8f5f1]'
                }`}
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {opt}
            </button>
          ))}

          {showMoreMovements && SECONDARY_MOVEMENTS.map(opt => (
            <button
              key={opt}
              onClick={() => handleMovementSelect(opt)}
              className={`px-5 py-3.5 rounded-2xl text-sm font-medium transition-all border animate-in fade-in zoom-in-95 duration-300 ${formData.selectedMovement === opt && !isManualMode
                ? 'tan-bg text-[#1a2b33] border-transparent shadow-lg'
                : 'bg-[#fdfbf9] text-[#8b8780] border-[#eeeae5] hover:border-tan-bg hover:bg-[#f8f5f1]'
                }`}
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              {opt}
            </button>
          ))}
          {showMoreMovements && (
            <button
              onClick={toggleManualMode}
              className={`px-5 py-3.5 rounded-2xl text-sm font-medium transition-all border animate-in fade-in zoom-in-95 duration-300 ${isManualMode
                ? 'tan-bg text-[#1a2b33] border-transparent shadow-lg'
                : 'bg-[#fdfbf9] text-[#8b8780] border-[#eeeae5] hover:border-tan-bg hover:bg-[#f8f5f1]'
                }`}
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Manual Entry
            </button>
          )}
          <button
            onClick={() => setShowMoreMovements(!showMoreMovements)}
            className="px-5 py-3.5 rounded-2xl text-sm font-medium transition-all border-2 border-dashed border-[#d6b499] text-[#d6b499] hover:bg-[#d6b499]/10"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            {showMoreMovements ? 'Less Options' : 'More Options'}
          </button>
        </div>
        {isManualMode && (
          <div className="mt-6 animate-in slide-in-from-top-4 duration-300">
            <label className="text-xs font-semibold text-[#b5b0a8] uppercase tracking-[0.1em] block mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
              Custom Guided Movement
            </label>
            <input
              type="text"
              placeholder="Describe movement..."
              value={manualMovement}
              onChange={(e) => setManualMovement(e.target.value)}
              className="w-full compact-input rounded-2xl px-5 py-3.5 text-sm font-medium"
              style={{ fontFamily: 'var(--font-poppins)' }}
            />
          </div>
        )}
      </div>

      {(formData.selectedMovement || (isManualMode && manualMovement)) && (
        <div className="animate-in fade-in slide-in-from-top-8 duration-500 space-y-12">
          <div className="bg-[#fdfbf9] p-8 rounded-3xl border border-[#eeeae5] space-y-6">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em] block text-center" style={{ fontFamily: 'var(--font-poppins)' }}>
              Active Assessment: During {isManualMode ? manualMovement : formData.selectedMovement}, what happens to your primary discomfort?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {['Feels worse', 'Feels the same', 'Feels limited', 'Feels uneven side to side'].map(opt => (
                <button
                  key={opt}
                  onClick={() => updateField('movementImpact', opt)}
                  className={`py-4 px-4 rounded-2xl text-sm font-medium border transition-all ${formData.movementImpact === opt
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start pt-8 border-t border-[#eeeae5]">
            <div className="space-y-6">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em] block mb-6 text-center lg:text-left" style={{ fontFamily: 'var(--font-poppins)' }}>
                Where do you feel sensations during {isManualMode ? manualMovement : formData.selectedMovement}?
              </label>
              <div className='grid grid-cols-1'>

                <div className="flex flex-col h-full">
                  <HumanBodyViewerInteractive
                    selectedPart={selectedBodyPart}
                    onPartSelect={handleBodyPartSelect}
                    allSelectedParts={allSelectedParts}
                  // focusRegions={reportData?.at_home_mobility_focus?.focus_regions || []}
                  />
                  <div className="mt-auto pt-4 flex justify-center flex-wrap gap-2">
                    {allSelectedParts.length > 0 ? (
                      allSelectedParts.map((part, idx) => (
                        <p
                          key={idx}
                          className="text-sm text-center font-medium text-white px-6 py-2 rounded-2xl bg-orange-600 antialiased tracking-wide"
                          style={{ fontFamily: 'var(--font-poppins)' }}
                        >
                          {part}
                        </p>
                      ))
                    ) : selectedBodyPart ? (
                      <p
                        className="text-sm text-center font-medium text-white px-6 py-2 rounded-2xl bg-orange-600 antialiased tracking-wide"
                        style={{ fontFamily: 'var(--font-poppins)' }}
                      >
                        {selectedBodyPart}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em] block" style={{ fontFamily: 'var(--font-poppins)' }}>
                Sensation Quality:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Tight', 'Stiff', 'Achy', 'Heavy or fatigued', 'Sharp', 'Burning', 'Tingling', 'Numb'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => toggleMultiSelect('sensationDescription', opt)}
                    className={`py-4 rounded-2xl text-sm font-medium border transition-all ${formData.sensationDescription.includes(opt)
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
        </div>
      )}

      {allAssessmentsToDisplay.length > 0 && (
        <div className="space-y-6 pt-12 border-t border-[#eeeae5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl tan-bg flex items-center justify-center text-white text-sm font-bold shadow-md" style={{ fontFamily: 'var(--font-poppins)' }}>
              ✓
            </div>
            <h5 className="text-base font-semibold uppercase tracking-[0.1em] text-[#1a2b33]" style={{ fontFamily: 'var(--font-poppins)' }}>
              Protocol Recorded History
            </h5>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {allAssessmentsToDisplay.map((entry, idx) => {
              const isLiveEntry = idx === allAssessmentsToDisplay.length - 1 && (formData.selectedMovement || (isManualMode && manualMovement));
              return (
                <div
                  key={idx}
                  className={`border rounded-3xl p-6 relative overflow-hidden group shadow-sm transition-all hover:shadow-lg hover:border-tan-bg/30 ${isLiveEntry
                    ? 'bg-white border-tan-bg/40 ring-2 ring-tan-bg/20'
                    : 'bg-[#fdfbf9] border-[#eeeae5]'
                    }`}
                >
                  {idx < formData.recordedAssessments.length && (
                    <button
                      onClick={() => removeRecordedAssessment(idx)}
                      className="absolute top-4 right-4 text-[#b5b0a8] hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                      style={{ fontFamily: 'var(--font-poppins)' }}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  {isLiveEntry && (
                    <div className="absolute top-4 left-4">
                      <span className="text-[10px] font-semibold text-white tan-bg px-3 py-1.5 rounded-lg uppercase tracking-[0.1em] animate-pulse shadow-md" style={{ fontFamily: 'var(--font-poppins)' }}>
                        Live Updating
                      </span>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5 pr-8">
                    <div>
                      <p className="text-[10px] font-semibold text-[#b5b0a8] uppercase tracking-[0.1em] mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
                        Assessment 0{idx + 1}
                      </p>
                      <p className="text-sm font-semibold text-[#1a2b33] leading-relaxed" style={{ fontFamily: 'var(--font-poppins)' }}>
                        {entry.movementName}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-[#b5b0a8] uppercase tracking-[0.1em] mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
                        Response Quality
                      </p>
                      <p className="text-sm font-semibold text-tan-text" style={{ fontFamily: 'var(--font-poppins)' }}>
                        {entry.impact}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-[10px] font-semibold text-[#b5b0a8] uppercase tracking-[0.1em] mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
                        Mapped Dysfunctions
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {entry.tightnessAreas.length === 0 && entry.sensations.length === 0 ? (
                          <span className="text-xs font-medium text-[#b5b0a8] italic" style={{ fontFamily: 'var(--font-poppins)' }}>
                            No dysfunctions mapped
                          </span>
                        ) : (
                          <>
                            {entry.tightnessAreas.map(t => (
                              <span key={t} className="text-xs font-medium px-3 py-1.5 bg-[#1a2b33]/5 text-[#1a2b33] rounded-lg border border-[#1a2b33]/10" style={{ fontFamily: 'var(--font-poppins)' }}>
                                {t}
                              </span>
                            ))}
                            {entry.sensations.map(s => (
                              <span key={s} className="text-xs font-medium px-3 py-1.5 bg-tan-bg/10 text-tan-text rounded-lg border border-tan-bg/30" style={{ fontFamily: 'var(--font-poppins)' }}>
                                {s}
                              </span>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {(formData.selectedMovement || (isManualMode && manualMovement)) && (
            <div className="flex justify-center mt-6 relative z-10 animate-in slide-in-from-bottom-4 duration-500">
              <button
                onClick={archiveAndAddNewEntry}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold uppercase tracking-[0.1em] text-sm shadow-lg border transition-all ${formData.movementImpact
                  ? 'bg-white text-[#1a2b33] border-[#eeeae5] hover:scale-105 active:scale-95 hover:shadow-xl'
                  : 'bg-[#eeeae5] text-[#b5b0a8] border-transparent opacity-50 cursor-not-allowed'
                  }`}
                disabled={!formData.movementImpact}
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Add New Entry
              </button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start pt-12 border-t border-[#eeeae5]">
        <div className="space-y-6">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em] block" style={{ fontFamily: 'var(--font-poppins)' }}>
            Does sensation spread beyond the start point?
          </label>
          <div className="flex gap-3 mb-6">
            {['No', 'Yes'].map(opt => (
              <button
                key={opt}
                onClick={() => updateField('sensationTravels', opt)}
                className={`flex-1 py-4 rounded-2xl text-sm font-medium border transition-all ${formData.sensationTravels === opt
                  ? 'tan-bg text-[#1a2b33] border-transparent shadow-lg'
                  : 'bg-white text-[#8b8780] border-[#eeeae5] hover:border-tan-bg hover:bg-[#f8f5f1]'
                  }`}
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                {opt}
              </button>
            ))}
          </div>
          {formData.sensationTravels === 'Yes' && (
            <div className="animate-in zoom-in duration-500 bg-[#fdfbf9] p-6 rounded-3xl border border-[#eeeae5] shadow-inner">
              <p className="text-xs font-semibold text-[#b5b0a8] mb-6 uppercase text-center tracking-[0.1em]" style={{ fontFamily: 'var(--font-poppins)' }}>
                Map Sensation Termination
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-12 items-start">

                <div className="flex flex-col h-full">
                  <HumanBodyViewerInteractive
                    selectedPart={selectedTravelArea}
                    onPartSelect={handleTravelAreaSelect}
                    allSelectedParts={selectedTravelArea ? [selectedTravelArea] : []}
                  // focusRegions={reportData?.at_home_mobility_focus?.focus_regions || []}
                  />
                  <div className="mt-auto pt-4 flex justify-center">
                    {selectedTravelArea && (
                      <p
                        className="text-sm text-center font-medium text-white px-6 py-2 rounded-2xl bg-orange-600 antialiased tracking-wide"
                        style={{ fontFamily: 'var(--font-poppins)' }}
                      >
                        {selectedTravelArea}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-6 bg-[#fdfbf9] p-8 rounded-3xl border border-[#eeeae5] shadow-sm">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em] block leading-relaxed" style={{ fontFamily: 'var(--font-poppins)' }}>
            During movement or standing, do you feel tightness or restriction in the front of your hips?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {['No', 'Yes — right', 'Yes — left', 'Yes — both'].map(opt => (
              <button
                key={opt}
                onClick={() => updateField('frontHipTightness', opt)}
                className={`py-4 rounded-2xl text-sm font-medium border transition-all ${formData.frontHipTightness === opt
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
    </div>
  );
};

export default Section4;

