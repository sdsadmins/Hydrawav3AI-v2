"use client";
import React from 'react';
import Image from 'next/image';

interface ReportSidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
    activeSection: string;
    sections: Array<{ id: string; title: string; icon?: string }>;
    scrollToSection: (sectionId: string) => void;
}

const ReportSidebar: React.FC<ReportSidebarProps> = ({
    isSidebarOpen,
    setIsSidebarOpen,
    activeSection,
    sections,
    scrollToSection
}) => {
    return (
        <>
            {/* Mobile Menu Button - Left Side */}
            {/* <div className="lg:hidden fixed top-4 left-4 z-[110]">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="w-11 h-11 sm:w-12 sm:h-12 tan-bg text-white rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-90"
                    aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
                >
                    {isSidebarOpen ? (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    )}
                </button>
            </div> */}

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-[90] transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside className={`fixed left-0 top-0 bottom-0 w-72 sm:w-80 sidebar-bg text-white flex flex-col p-4 sm:p-6 lg:p-8 z-[100] transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="mb-6 sm:mb-8 lg:mb-10 flex items-center justify-center gap-4">
                    <div className="w-[160px] sm:w-[180px] lg:w-[200px] h-[40px] sm:h-[45px] lg:h-[50px] relative shrink-0">
                        <Image
                            src="/logo.png"
                            width={200}
                            height={200}
                            alt="Hydrawav3AI Logo"
                            className="object-contain"
                            priority
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>
                </div>
                <nav className="flex-1 space-y-1.5 sm:space-y-2 overflow-y-auto custom-scrollbar pr-1 sm:pr-2">
                    {sections.map((section) => {
                        const isActive = activeSection === section.id;
                        return (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`w-full group flex items-center justify-between py-2.5 sm:py-3 lg:py-3.5 px-3 sm:px-4 lg:px-5 rounded-xl sm:rounded-2xl transition-all ${isActive
                                    ? 'tan-bg text-white font-semibold shadow-lg'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                                style={{ fontFamily: 'var(--font-poppins)' }}
                            >
                                <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-3.5">
                                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-500 flex-shrink-0 ${isActive
                                        ? 'bg-white active-dot'
                                        : 'bg-[#d6b499]'
                                        }`} />

                                    <span className="text-xs sm:text-sm tracking-tight font-medium truncate">{section.title}</span>
                                </div>

                            </button>
                        );
                    })}
                </nav>
                <div className="mt-6 sm:mt-8 lg:mt-10 space-y-4 sm:space-y-5">
                    <div className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 border border-white/5">
                        <div className="flex justify-between items-center mb-2 sm:mb-3">
                            <p className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-[0.15em]" style={{ fontFamily: 'var(--font-poppins)' }}>
                                Report Complete
                            </p>
                            <span className="text-xs sm:text-sm font-bold tan-text" style={{ fontFamily: 'var(--font-poppins)' }}>
                                100%
                            </span>
                        </div>
                        <div className="w-full h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full tan-bg transition-all duration-1000 ease-out rounded-full" style={{ width: '100%' }} />
                        </div>
                    </div>
                    <p className="text-[8px] sm:text-[9px] text-center text-slate-500 font-medium tracking-[0.2em] uppercase" style={{ fontFamily: 'var(--font-poppins)' }}>
                        © 2025 HW3 PRESCISION ENGINE
                    </p>
                </div>
            </aside>
        </>
    );
};

export default ReportSidebar;

