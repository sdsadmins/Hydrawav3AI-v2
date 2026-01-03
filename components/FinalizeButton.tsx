"use client";
import React, { useState } from 'react';
import { FormData } from '@/types';

interface FinalizeButtonProps {
  formData: FormData;
  isManualMode: boolean;
  manualMovement: string;
  onFinalize: () => Promise<void>;
}

const FinalizeButton: React.FC<FinalizeButtonProps> = ({
  formData,
  isManualMode,
  manualMovement,
  onFinalize
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFinalize = async () => {
    const hasHistory = formData.recordedAssessments.length > 0;
    const currentValid = (formData.selectedMovement || (isManualMode && manualMovement)) && formData.movementImpact;

    if (!hasHistory && !currentValid) {
      alert("MANDATORY: Please complete at least one Guided Movement assessment in Section 4 to initialize the diagnostic protocol.");
      return;
    }

    setIsAnalyzing(true);
    try {
      await onFinalize();
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-[#1a2b33] p-12 lg:p-20 rounded-[5rem] text-white flex flex-col items-center justify-center space-y-12 text-center shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5 shadow-inner">
          <svg className="w-10 h-10 tan-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h4 className="text-4xl font-black uppercase tracking-tight">Kinetic Synthesis Engine</h4>
        <p className="text-[#b5b0a8] text-lg max-w-2xl mx-auto font-medium leading-relaxed">
          Ready to finalize? The Hydrawav3 engine will synthesize your data into a professional recovery protocol based on movement-based kinetic chain analysis.
        </p>
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {isAnalyzing ? (
          <div className="flex flex-col items-center gap-10 py-6">
            <div className="animate-spin w-14 h-14 border-[6px] border-[#d6b499] border-t-transparent rounded-full" />
            <p className="text-sm font-black uppercase tracking-[0.5em] text-[#d6b499] animate-pulse">
              Running Kinetic Chain Diagnostics...
            </p>
          </div>
        ) : (
          <button
            onClick={handleFinalize}
            className="w-full tan-bg text-white text-muted-foreground py-7 rounded-[3rem] shadow-2xl shadow-[#d6b499]/40 uppercase tracking-[0.2em] text-base hover:scale-105 active:scale-95 transition-all"
          >
            INITIALIZE ASSESSMENT
          </button>
        )}
      </div>

      <div className="pt-8 border-t border-white/5 w-full">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#3a4e58]">
          ENCRYPTED BIOMETRIC SECURE CHANNEL — AES-4096
        </p>
      </div>
    </div>
  );
};

export default FinalizeButton;

