"use client";
import React, { useState } from 'react';
import { FormData } from '@/types';

interface Section5Props {
  formData: FormData;
  updateField: (field: keyof FormData, value: any) => void;
}

const ACTIVITY_POOL = [
  'Office / desk work',
  'Standing work',
  'Manual work',
  'Sports / training',
  'Yoga / mobility',
  'Running / cycling',
  'Prolonged driving'
];

const Section5: React.FC<Section5Props> = ({ formData, updateField }) => {
  const [isManualActivityMode, setIsManualActivityMode] = useState(false);
  const [manualActivityInput, setManualActivityInput] = useState('');

  const toggleActivitySelection = (activity: string) => {
    const currentRanks = { ...formData.activityRanks };
    if (currentRanks[activity]) {
      const oldRank = currentRanks[activity];
      delete currentRanks[activity];
      Object.keys(currentRanks).forEach(key => {
        if (currentRanks[key] > oldRank) currentRanks[key] -= 1;
      });
    } else {
      const nextRank = Object.keys(currentRanks).length + 1;
      currentRanks[activity] = nextRank;
    }
    updateField('activityRanks', currentRanks);
  };

  const handleManualActivitySubmit = () => {
    if (!manualActivityInput.trim()) return;
    toggleActivitySelection(manualActivityInput.trim());
    setManualActivityInput('');
    setIsManualActivityMode(false);
  };

  const sortedActivities = (Object.entries(formData.activityRanks) as [string, number][])
    .sort(([, a], [, b]) => a - b)
    .map(([name]) => name);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      <div className="space-y-8">
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em] mb-6 block" style={{ fontFamily: 'var(--font-poppins)' }}>
            Prioritize activities from most time spent to least:
          </label>
          <div className="flex flex-wrap gap-3">
            {ACTIVITY_POOL.map(activity => (
              <button
                key={activity}
                onClick={() => toggleActivitySelection(activity)}
                className={`px-5 py-3.5 rounded-2xl text-sm font-medium border transition-all ${formData.activityRanks[activity]
                  ? 'tan-bg text-gray-600 border-transparent  shadow-inner cursor-not-allowed'
                  : 'bg-[#fdfbf9] text-[#1a2b33] border-[#eeeae5] hover:border-tan-bg hover:bg-[#f8f5f1]'
                  }`}
                disabled={!!formData.activityRanks[activity]}
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                {activity}
              </button>
            ))}

            {isManualActivityMode ? (
              <div className="w-full flex gap-2 animate-in slide-in-from-left-4 duration-300">
                <input
                  type="text"
                  placeholder="Type activity..."
                  autoFocus
                  value={manualActivityInput}
                  onChange={(e) => setManualActivityInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleManualActivitySubmit()}
                  className="flex-1 compact-input rounded-2xl px-5 py-3.5 text-sm font-medium"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                />
                <button
                  onClick={handleManualActivitySubmit}
                  className="tan-bg text-white px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all hover:shadow-lg"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  Add
                </button>
                <button
                  onClick={() => setIsManualActivityMode(false)}
                  className="bg-[#1a2b33]/5 text-[#b5b0a8] px-4 py-3.5 rounded-2xl font-semibold text-sm transition-all hover:bg-[#1a2b33]/10"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsManualActivityMode(true)}
                className="px-5 py-3.5 rounded-2xl text-sm font-medium transition-all border-2 border-dashed border-[#d6b499] text-[#d6b499] hover:bg-[#d6b499]/10"
                style={{ fontFamily: 'var(--font-poppins)' }}
              >
                Manual Entry
              </button>
            )}
          </div>
        </div>
        <div className="space-y-3 min-h-[200px] p-6 bg-[#faf8f5] rounded-3xl border-2 border-dashed border-[#d8d1c9] shadow-inner">
          {sortedActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-[#b5b0a8] opacity-40 text-center">
              <svg className="w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xs font-semibold uppercase tracking-[0.1em]" style={{ fontFamily: 'var(--font-poppins)' }}>
                No items ranked
              </p>
            </div>
          ) : (
            sortedActivities.map((activity, index) => (
              <div
                key={activity}
                className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#eeeae5] shadow-sm hover:shadow-md transition-all animate-in slide-in-from-left-6 duration-300"
              >
                <div className="flex items-center gap-4">
                  <span className="w-9 h-9 rounded-xl tan-bg text-white text-sm font-bold flex items-center justify-center shadow-md" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-[#1a2b33]" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {activity}
                  </span>
                </div>
                <button
                  onClick={() => toggleActivitySelection(activity)}
                  className="text-[#b5b0a8] hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="bg-[#fdfbf9] p-8 rounded-3xl space-y-6 border border-[#eeeae5] shadow-sm">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.1em] block leading-relaxed text-center" style={{ fontFamily: 'var(--font-poppins)' }}>
          Typical Day-End Fatigue/Heaviness localization:
        </label>
        <div className="grid grid-cols-1 gap-3">
          {['None', 'Lower back', 'Hips / glutes', 'Back of legs', 'Mid-back', 'Neck / shoulders'].map(opt => (
            <button
              key={opt}
              onClick={() => updateField('endOfDayFatigueArea', opt)}
              className={`text-left px-5 py-3.5 rounded-2xl text-sm font-medium border transition-all ${formData.endOfDayFatigueArea === opt
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

export default Section5;

