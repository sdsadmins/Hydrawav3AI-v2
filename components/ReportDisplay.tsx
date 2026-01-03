"use client";
import React, { useState } from 'react';

interface ReportDisplayProps {
  report: string | null;
  reportId: string | null;
  isAnalyzing: boolean;
  onReProcess: () => Promise<void>;
  formData: any;
  isManualMode: boolean;
  manualMovement: string;
  onFinalize: () => Promise<void>;
}

const ReportDisplay: React.FC<ReportDisplayProps> = ({ 
  report, 
  reportId,
  isAnalyzing, 
  onReProcess,
  formData,
  isManualMode,
  manualMovement,
  onFinalize
}) => {
  const [showReport, setShowReport] = useState(false);

  const handleEmailReport = () => {
    if (!report) return;
    const subject = encodeURIComponent("Hydrawav3 Diagnostic Protocol Summary");
    const body = encodeURIComponent(report);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleInitialFinalize = async () => {
    const hasHistory = formData.recordedAssessments.length > 0;
    const currentValid = (formData.selectedMovement || (isManualMode && manualMovement)) && formData.movementImpact;
    
    if (!hasHistory && !currentValid) {
      alert("MANDATORY: Please complete at least one Guided Movement assessment in Section 4 to initialize the diagnostic protocol.");
      return;
    }
    await onFinalize();
  };

  if (!report && !isAnalyzing) {
    return (
      <div className="bg-[#1a2b33] p-12 lg:p-20 rounded-[5rem] text-white flex flex-col items-center justify-center space-y-12 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5 shadow-inner">
            <svg className="w-10 h-10 tan-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z"/>
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
              onClick={handleInitialFinalize} 
              className="w-full tan-bg text-white font-black py-7 rounded-[3rem] shadow-2xl shadow-[#d6b499]/40 uppercase tracking-[0.2em] text-base hover:scale-105 active:scale-95 transition-all"
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
  }

  return (
    <div className="bg-[#1a2b33] p-12 lg:p-20 rounded-[5rem] text-white flex flex-col items-center justify-center space-y-12 text-center shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
      
      <div className="relative z-10 space-y-6">
        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5 shadow-inner">
          <svg className="w-10 h-10 tan-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z"/>
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
          <div className="flex flex-col gap-6">
            <button 
              onClick={onReProcess} 
              className="w-full tan-bg text-white font-black py-7 rounded-[3rem] shadow-2xl shadow-[#d6b499]/40 uppercase tracking-[0.2em] text-base hover:scale-105 active:scale-95 transition-all"
            >
              RE-PROCESS PROTOCOL
            </button>
            
            {report && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in zoom-in duration-700">
                <button 
                  onClick={() => setShowReport(!showReport)} 
                  className="bg-white/10 hover:bg-white/20 text-white font-black py-6 rounded-[2rem] uppercase tracking-widest text-[11px] border border-white/5 transition-all flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  {showReport ? "HIDE" : "VIEW"}
                </button>
                {reportId && (
                  <a
                    href={`/reports/${reportId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#d6b499] hover:bg-[#c5a488] text-white font-black py-6 rounded-[2rem] uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3 shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    FULL REPORT
                  </a>
                )}
                <button 
                  onClick={handleEmailReport}
                  className="bg-white text-[#1a2b33] hover:bg-slate-100 font-black py-6 rounded-[2rem] uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  EMAIL
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {report && showReport && (
        <div className="mt-16 p-10 md:p-16 bg-white rounded-[4rem] text-left w-full animate-in zoom-in-95 duration-1000 shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-white/10">
          <div className="flex justify-between items-start mb-12 border-b border-[#eeeae5] pb-10">
            <div>
              <h5 className="text-[#1a2b33] font-black uppercase text-2xl tracking-tight">Diagnostic Protocol Summary</h5>
              <div className="flex gap-4 mt-3">
                <p className="text-[10px] font-black text-tan-text uppercase tracking-widest bg-tan-bg/10 px-3 py-1 rounded-full border border-tan-bg/20">
                  Version 2.5 Analysis
                </p>
                <p className="text-[10px] font-bold text-[#b5b0a8] uppercase tracking-widest mt-1">
                  Movement-Based Kinetic Profiling
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowReport(false)} 
              className="text-[#b5b0a8] hover:text-tan-text transition-all p-3 hover:bg-[#fdfbf9] rounded-2xl"
            >
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div className="text-base text-[#3a4e58] whitespace-pre-wrap leading-[2] max-h-[600px] overflow-y-auto pr-8 custom-scrollbar font-medium">
            {report}
          </div>
        </div>
      )}
      
      <div className="pt-8 border-t border-white/5 w-full">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#3a4e58]">
          ENCRYPTED BIOMETRIC SECURE CHANNEL — AES-4096
        </p>
      </div>
    </div>
  );
};

export default ReportDisplay;

