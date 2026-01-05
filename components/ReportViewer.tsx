"use client";

import React, { useState, useRef, useEffect, useMemo, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import ReportSidebar from './ReportSidebar';
import EmailDialog from './EmailDialog';
import HumanBodyViewerInteractive from './humabn-body-interactive';

interface ReportViewerProps {
    report: any;
    reportId?: string | null;
}

const REPORT_SECTIONS = [
    { id: 'personal', title: 'Personal Snapshot', icon: '👤' },
    { id: 'clinical', title: 'Clinical Insights', icon: '🔬' },
    { id: 'movement', title: 'Movement Observations', icon: '🏃' },
    { id: 'hypothesis', title: 'Hypotheses', icon: '💡' },
    { id: 'load', title: 'Load & Recovery', icon: '⚖️' },
    { id: 'lifestyle', title: 'Lifestyle Factors', icon: '🏠' },
    { id: 'mobility', title: 'Mobility Focus', icon: '🧘' },
    { id: 'pattern', title: 'Pattern Analysis', icon: '📊' },
    { id: 'questions', title: 'Questions', icon: '❓' },
    { id: 'practitioner', title: 'Practitioner Notes', icon: '👨‍⚕️' },
    { id: 'next-steps', title: 'Next Steps', icon: '🎯' },
];

const ReportViewer: React.FC<ReportViewerProps> = ({ report, reportId }) => {
    // Filter sections to only show those that exist in the report
    const availableSections = REPORT_SECTIONS.filter(section => {
        const sectionMap: { [key: string]: string } = {
            'personal': 'personal_snapshot',
            'clinical': 'clinical_insight_snapshot',
            'movement': 'movement_observations',
            'hypothesis': 'kinetic_chain_hypothesis_a',
            'load': 'load_vs_recovery_overview',
            'lifestyle': 'lifestyle_and_postural_contributors',
            'mobility': 'at_home_mobility_focus',
            'pattern': 'why_this_pattern_matters',
            'questions': 'questions_to_ask_your_practitioner',
            'practitioner': 'practitioner_hand_off_summary',
            'next-steps': 'next_steps_and_recovery_tools',
        };
        const reportKey = sectionMap[section.id];
        return reportKey && report[reportKey];
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string>(availableSections[0]?.id || 'personal');
    const [showEmailDialog, setShowEmailDialog] = useState(false);
    const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
    const reportContentRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Extract body parts from report data
    const bodyPartsFromReport = useMemo(() => {
        const parts: string[] = [];

        // Extract from primary concern
        if (report.personal_snapshot?.primary_concern) {
            const concern = report.personal_snapshot.primary_concern.toLowerCase();
            // Common body part mappings
            const bodyPartMap: { [key: string]: string } = {
                'lower back': 'lower_back',
                'low back': 'lower_back',
                'lumbar': 'lower_back',
                'hip': 'hip',
                'hips': 'hip',
                'shoulder': 'shoulder',
                'shoulders': 'shoulder',
                'neck': 'neck',
                'knee': 'knee',
                'knees': 'knee',
                'ankle': 'ankle',
                'ankles': 'ankle',
                'wrist': 'wrist',
                'elbow': 'elbow',
                'upper back': 'upper_back',
                'mid back': 'mid_back',
                'thoracic': 'mid_back',
            };

            for (const [key, value] of Object.entries(bodyPartMap)) {
                if (concern.includes(key)) {
                    parts.push(value);
                    break;
                }
            }
        }

        // Extract from focus regions
        if (report.at_home_mobility_focus?.focus_regions) {
            report.at_home_mobility_focus.focus_regions.forEach((region: string) => {
                const normalized = region.toLowerCase().replace(/\s+/g, '_');
                if (!parts.includes(normalized)) {
                    parts.push(normalized);
                }
            });
        }

        // Extract from kinetic chain pathways
        if (report.kinetic_chain_hypothesis_a?.kinetic_chain_pathway) {
            report.kinetic_chain_hypothesis_a.kinetic_chain_pathway.forEach((path: string) => {
                const normalized = path.toLowerCase().replace(/\s+/g, '_');
                if (!parts.includes(normalized)) {
                    parts.push(normalized);
                }
            });
        }

        if (report.kinetic_chain_hypothesis_b?.kinetic_chain_pathway) {
            report.kinetic_chain_hypothesis_b.kinetic_chain_pathway.forEach((path: string) => {
                const normalized = path.toLowerCase().replace(/\s+/g, '_');
                if (!parts.includes(normalized)) {
                    parts.push(normalized);
                }
            });
        }

        return parts;
    }, [report]);

    const scrollToSection = (sectionId: string) => {
        const element = sectionRefs.current[sectionId];
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveSection(sectionId);
            setIsSidebarOpen(false);
        }
    };

    // Track active section on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.getAttribute('data-section-id');
                        if (sectionId) {
                            setActiveSection(sectionId);
                        }
                    }
                });
            },
            { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
        );

        Object.values(sectionRefs.current).forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    const handleDownloadPDF = async () => {
        try {
            // Show loading state
            setIsGeneratingPDF(true);

            // Call API to generate PDF
            const response = await fetch('/api/reports/generate-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ report }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate PDF');
            }

            // Get PDF blob
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // Create download link
            const a = document.createElement('a');
            a.href = url;
            a.download = `Hydrawav3_Report_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();

            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            // Restore button state
            setIsGeneratingPDF(false);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert(error instanceof Error ? error.message : 'Failed to download PDF. Please try again.');

            // Restore button state on error
            setIsGeneratingPDF(false);
        }
    };

    const handleSendEmail = () => {
        // Open the email dialog
        setShowEmailDialog(true);
    };
    const renderSection = (title: string, content: any, icon?: React.ReactNode) => (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-12 border border-[#eeeae5] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-[#eeeae5]">
                {icon && <div className="text-muted-foreground w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">{icon}</div>}
                <h2 className="text-xl sm:text-2xl font-bold text-[#1a2b33]" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {title}
                </h2>
            </div>
            <div className="space-y-3 sm:space-y-4">
                {typeof content === 'string' ? (
                    <p className="text-sm sm:text-base text-[#3a4e58] leading-relaxed" style={{ fontFamily: 'var(--font-poppins)' }}>
                        {content}
                    </p>
                ) : Array.isArray(content) ? (
                    <ul className="space-y-2 sm:space-y-3">
                        {content.map((item: any, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 sm:gap-3">
                                <span className="text-[#d6b499] mt-1.5 flex-shrink-0">•</span>
                                <span className="text-sm sm:text-base text-[#3a4e58] leading-relaxed flex-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                                    {typeof item === 'string' ? item : JSON.stringify(item)}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : typeof content === 'object' && content !== null ? (
                    <div className="space-y-3 sm:space-y-4">
                        {Object.entries(content).map(([key, value]: [string, any]) => (
                            <div key={key} className="pl-3 sm:pl-4 border-l-2 border-[#d6b499]/20">
                                <h3 className="text-sm sm:text-base font-semibold text-[#1a2b33] mb-1.5 sm:mb-2 capitalize" style={{ fontFamily: 'var(--font-poppins)' }}>
                                    {key.replace(/_/g, ' ')}
                                </h3>
                                {typeof value === 'string' ? (
                                    <p className="text-sm sm:text-base text-[#3a4e58] leading-relaxed" style={{ fontFamily: 'var(--font-poppins)' }}>
                                        {value}
                                    </p>
                                ) : Array.isArray(value) ? (
                                    <ul className="space-y-1.5 sm:space-y-2">
                                        {value.map((item: any, idx: number) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-[#d6b499] mt-1 flex-shrink-0">-</span>
                                                <span className="text-sm sm:text-base text-[#3a4e58] flex-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                                                    {item}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <pre className="text-xs sm:text-sm text-[#3a4e58] whitespace-pre-wrap overflow-x-auto" style={{ fontFamily: 'var(--font-poppins)' }}>
                                        {JSON.stringify(value, null, 2)}
                                    </pre>
                                )}
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    );

    const renderHypothesis = (hypothesis: any, label: string) => (
        <div className="bg-gradient-to-br from-[#fdfbf9] to-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-12 border-2 border-[#d6b499]/30 shadow-lg">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl tan-bg flex items-center justify-center text-white font-bold text-lg sm:text-xl flex-shrink-0" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {label}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#1a2b33]" style={{ fontFamily: 'var(--font-poppins)' }}>
                    {hypothesis.hypothesis_label}
                </h3>
            </div>
            <div className="space-y-4 sm:space-y-6">
                <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-[#8b8780] uppercase tracking-widest mb-1.5 sm:mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
                        Initiating Region
                    </h4>
                    <p className="text-sm sm:text-base text-[#1a2b33] font-medium" style={{ fontFamily: 'var(--font-poppins)' }}>
                        {hypothesis.initiating_region}
                    </p>
                </div>
                {hypothesis.kinetic_chain_pathway && (
                    <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-[#8b8780] uppercase tracking-widest mb-2 sm:mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
                            Kinetic Chain Pathway
                        </h4>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {hypothesis.kinetic_chain_pathway.map((region: string, idx: number) => (
                                <React.Fragment key={idx}>
                                    <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#d6b499]/10 text-[#1a2b33] rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium border border-[#d6b499]/20" style={{ fontFamily: 'var(--font-poppins)' }}>
                                        {region}
                                    </span>
                                    {idx < hypothesis.kinetic_chain_pathway.length - 1 && (
                                        <span className="text-[#d6b499] self-center text-sm sm:text-base">→</span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                )}
                <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-[#8b8780] uppercase tracking-widest mb-1.5 sm:mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
                        Biomechanical Explanation
                    </h4>
                    <p className="text-sm sm:text-base text-[#3a4e58] leading-relaxed" style={{ fontFamily: 'var(--font-poppins)' }}>
                        {hypothesis.biomechanical_explanation}
                    </p>
                </div>
                {hypothesis.supporting_findings && (
                    <div>
                        <h4 className="text-xs sm:text-sm font-semibold text-[#8b8780] uppercase tracking-widest mb-2 sm:mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
                            Supporting Findings
                        </h4>
                        <ul className="space-y-1.5 sm:space-y-2">
                            {hypothesis.supporting_findings.map((finding: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2 sm:gap-3">
                                    <span className="text-[#d6b499] mt-1 flex-shrink-0">✓</span>
                                    <span className="text-sm sm:text-base text-[#3a4e58] flex-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                                        {finding}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center relative bg-[#fdfbf9]">
            <ReportSidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                activeSection={activeSection}
                sections={availableSections}
                scrollToSection={scrollToSection}
            />

            <main className="flex-1 lg:ml-80 min-h-screen px-4 sm:px-6 py-8 sm:py-12 lg:px-24 lg:py-16 space-y-8 sm:space-y-12 lg:space-y-16 max-w-7xl transition-all relative w-full">
                {/* Top Right Action Buttons - Responsive */}
                <div className="fixed top-4 right-4 sm:top-6 sm:right-6 lg:right-24 z-50 flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                        data-pdf-button
                        onClick={handleDownloadPDF}
                        disabled={isGeneratingPDF}
                        className="flex items-center justify-center gap-2 px-3 py-2 sm:px-5 sm:py-3 bg-orange-600 text-white rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ fontFamily: 'var(--font-poppins)' }}
                    >
                        {isGeneratingPDF ? (
                            <>
                                <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                <span className="hidden sm:inline">Generating PDF...</span>
                                <span className="sm:hidden">Generating...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="hidden sm:inline">Download PDF</span>
                                <span className="sm:hidden">PDF</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleSendEmail}
                        className="flex items-center justify-center gap-2 px-3 py-2 sm:px-5 sm:py-3 bg-green-600 text-white rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:opacity-90"
                        style={{ fontFamily: 'var(--font-poppins)' }}
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="hidden sm:inline">Send Email</span>
                        <span className="sm:hidden">Email</span>
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center justify-center gap-2 px-3 py-2 sm:px-5 sm:py-3 bg-blue-600 text-white rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                        style={{ fontFamily: 'var(--font-poppins)' }}
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="hidden sm:inline">Back to Intake</span>
                        <span className="sm:hidden">Back</span>
                    </button>
                </div>

                <div ref={reportContentRef} className="space-y-8 sm:space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4 sm:space-y-6 pb-6 sm:pb-8 border-b border-[#eeeae5] pt-4 sm:pt-0">
                        <div className="inline-block px-4 py-1.5 sm:px-6 sm:py-2 bg-[#d6b499]/10 rounded-full border border-[#d6b499]/20">
                            <span className="text-xs sm:text-sm font-semibold text-[#d6b499] uppercase tracking-widest" style={{ fontFamily: 'var(--font-poppins)' }}>
                                {report.report_type?.replace(/_/g, ' ').toUpperCase()}
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a2b33] tracking-tight px-2" style={{ fontFamily: 'var(--font-poppins)' }}>
                            Diagnostic Protocol Report
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-[#8b8780] max-w-2xl mx-auto px-4" style={{ fontFamily: 'var(--font-poppins)' }}>
                            Movement-based kinetic chain analysis for precision recovery
                        </p>
                    </div>

                    {/* Human Body Viewer Section */}
                    {bodyPartsFromReport.length > 0 && (
                        <div
                            ref={(el) => { sectionRefs.current['body-viewer'] = el; }}
                            data-section-id="body-viewer"
                            className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-[#eeeae5] shadow-sm"
                        >
                            <h2 className="text-xl sm:text-2xl font-bold text-[#1a2b33] mb-4 sm:mb-6" style={{ fontFamily: 'var(--font-poppins)' }}>
                                Affected Body Regions
                            </h2>
                            {/* <div className="w-full h-[400px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50">
                                <Suspense
                                    fallback={
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                                                <p className="text-sm text-gray-600 font-medium" style={{ fontFamily: 'var(--font-poppins)' }}>
                                                    Loading 3D Model...
                                                </p>
                                            </div>
                                        </div>
                                    }
                                >
                                    <HumanBodyViewerInteractive
                                        key={`body-viewer-${bodyPartsFromReport.join('-')}`}
                                        allSelectedParts={bodyPartsFromReport}
                                        focusRegions={bodyPartsFromReport}
                                        selectedPart={selectedBodyPart}
                                        onPartSelect={setSelectedBodyPart}
                                        clickable={true}
                                    />
                                </Suspense>
                            </div> */}
                            {bodyPartsFromReport.length > 0 && (
                                <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
                                    {bodyPartsFromReport.map((part, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#d6b499]/10 text-[#1a2b33] rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium border border-[#d6b499]/20"
                                            style={{ fontFamily: 'var(--font-poppins)' }}
                                        >
                                            {part.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Personal Snapshot */}
                    {report.personal_snapshot && (
                        <div
                            ref={(el) => { sectionRefs.current['personal'] = el; }}
                            data-section-id="personal"
                            className="bg-gradient-to-br from-[#1a2b33] to-[#2a3b43] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-12 text-white shadow-xl"
                        >
                            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{ fontFamily: 'var(--font-poppins)' }}>
                                Personal Snapshot
                            </h2>
                            <div className="space-y-4 sm:space-y-6">
                                {/* Contact Information */}
                                {(report.personal_snapshot.name || report.personal_snapshot.email || report.personal_snapshot.phoneNumber) && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-white/10">
                                        {report.personal_snapshot.name && (
                                            <div>
                                                <div className="text-xs sm:text-sm font-semibold text-white/70 uppercase tracking-widest mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                                                    Name
                                                </div>
                                                <div className="text-base sm:text-sm font-medium break-words" style={{ fontFamily: 'var(--font-poppins)' }}>
                                                    {report.personal_snapshot.name}
                                                </div>
                                            </div>
                                        )}
                                        {report.personal_snapshot.email && (
                                            <div>
                                                <div className="text-xs sm:text-sm font-semibold text-white/70 uppercase tracking-widest mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                                                    Email
                                                </div>
                                                <div className="text-sm sm:text-sm font-medium break-all" style={{ fontFamily: 'var(--font-poppins)' }}>
                                                    {report.personal_snapshot.email}
                                                </div>
                                            </div>
                                        )}
                                        {report.personal_snapshot.phoneNumber && (
                                            <div>
                                                <div className="text-xs sm:text-sm font-semibold text-white/70 uppercase tracking-widest mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                                                    Phone
                                                </div>
                                                <div className="text-base sm:text-sm font-medium" style={{ fontFamily: 'var(--font-poppins)' }}>
                                                    {report.personal_snapshot.phoneNumber}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/* Age and Primary Concern */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                    {report.personal_snapshot.age && (
                                        <div>
                                            <div className="text-xs sm:text-sm font-semibold text-white/70 uppercase tracking-widest mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                                                Age
                                            </div>
                                            <div className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-poppins)' }}>
                                                {report.personal_snapshot.age}
                                            </div>
                                        </div>
                                    )}
                                    {report.personal_snapshot.primary_concern && (
                                        <div className="sm:col-span-2 lg:col-span-3">
                                            <div className="text-xs sm:text-sm font-semibold text-white/70 uppercase tracking-widest mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                                                Primary Concern
                                            </div>
                                            <div className="text-base sm:text-base font-medium" style={{ fontFamily: 'var(--font-poppins)' }}>
                                                {report.personal_snapshot.primary_concern}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Clinical Insight Snapshot */}
                    {report.clinical_insight_snapshot && (
                        <div
                            ref={(el) => { sectionRefs.current['clinical'] = el; }}
                            data-section-id="clinical"
                        >
                            {renderSection(
                                'Clinical Insight Snapshot',
                                report.clinical_insight_snapshot,
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                        </div>
                    )}

                    {/* Movement Observations */}
                    {report.movement_observations && (
                        <div
                            ref={(el) => { sectionRefs.current['movement'] = el; }}
                            data-section-id="movement"
                        >
                            {renderSection(
                                'Movement Observations',
                                report.movement_observations,
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            )}
                        </div>
                    )}

                    {/* Hypotheses */}
                    <div
                        ref={(el) => { sectionRefs.current['hypothesis'] = el; }}
                        data-section-id="hypothesis"
                        className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8"
                    >
                        {report.kinetic_chain_hypothesis_a && renderHypothesis(report.kinetic_chain_hypothesis_a, 'A')}
                        {report.kinetic_chain_hypothesis_b && renderHypothesis(report.kinetic_chain_hypothesis_b, 'B')}
                    </div>

                    {/* Load vs Recovery */}
                    {report.load_vs_recovery_overview && (
                        <div
                            ref={(el) => { sectionRefs.current['load'] = el; }}
                            data-section-id="load"
                        >
                            {renderSection(
                                'Load vs Recovery Overview',
                                report.load_vs_recovery_overview
                            )}
                        </div>
                    )}

                    {/* Lifestyle & Postural Contributors */}
                    {report.lifestyle_and_postural_contributors && (
                        <div
                            ref={(el) => { sectionRefs.current['lifestyle'] = el; }}
                            data-section-id="lifestyle"
                        >
                            {renderSection(
                                'Lifestyle & Postural Contributors',
                                report.lifestyle_and_postural_contributors
                            )}
                        </div>
                    )}

                    {/* At Home Mobility Focus */}
                    {report.at_home_mobility_focus && (
                        <div
                            ref={(el) => { sectionRefs.current['mobility'] = el; }}
                            data-section-id="mobility"
                            className="bg-gradient-to-br from-[#d6b499]/5 to-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-12 border-2 border-[#d6b499]/30"
                        >
                            <h2 className="text-xl sm:text-2xl font-bold text-[#1a2b33] mb-4 sm:mb-6" style={{ fontFamily: 'var(--font-poppins)' }}>
                                At-Home Mobility Focus
                            </h2>
                            {report.at_home_mobility_focus.focus_regions && (
                                <div className="mb-4 sm:mb-6">
                                    <h3 className="text-xs sm:text-sm font-semibold text-[#8b8780] uppercase tracking-widest mb-2 sm:mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
                                        Focus Regions
                                    </h3>
                                    <div className="flex flex-wrap gap-2 sm:gap-3">
                                        {report.at_home_mobility_focus.focus_regions.map((region: string, idx: number) => (
                                            <span key={idx} className="px-3 py-1.5 sm:px-5 sm:py-2.5 bg-[#d6b499] text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-medium" style={{ fontFamily: 'var(--font-poppins)' }}>
                                                {region}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {report.at_home_mobility_focus.mobility_themes && (
                                <div>
                                    <h3 className="text-xs sm:text-sm font-semibold text-[#8b8780] uppercase tracking-widest mb-2 sm:mb-3" style={{ fontFamily: 'var(--font-poppins)' }}>
                                        Mobility Themes
                                    </h3>
                                    <ul className="space-y-1.5 sm:space-y-2">
                                        {report.at_home_mobility_focus.mobility_themes.map((theme: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-2 sm:gap-3">
                                                <span className="text-[#d6b499] mt-1 flex-shrink-0">→</span>
                                                <span className="text-sm sm:text-base text-[#3a4e58] flex-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                                                    {theme}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Why This Pattern Matters */}
                    {report.why_this_pattern_matters && (
                        <div
                            ref={(el) => { sectionRefs.current['pattern'] = el; }}
                            data-section-id="pattern"
                        >
                            {renderSection(
                                'Why This Pattern Matters',
                                report.why_this_pattern_matters
                            )}
                        </div>
                    )}

                    {/* Questions for Practitioner */}
                    {report.questions_to_ask_your_practitioner && (
                        <div
                            ref={(el) => { sectionRefs.current['questions'] = el; }}
                            data-section-id="questions"
                            className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-12 border border-[#eeeae5] shadow-sm"
                        >
                            <h2 className="text-xl sm:text-2xl font-bold text-[#1a2b33] mb-4 sm:mb-6" style={{ fontFamily: 'var(--font-poppins)' }}>
                                Questions to Ask Your Practitioner
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                {report.questions_to_ask_your_practitioner.map((question: string, idx: number) => (
                                    <div key={idx} className="p-3 sm:p-4 lg:p-5 bg-[#fdfbf9] rounded-xl sm:rounded-2xl border border-[#eeeae5] hover:border-[#d6b499] transition-colors">
                                        <div className="flex items-start gap-2 sm:gap-3">
                                            <span className="text-xl sm:text-2xl font-bold text-[#d6b499] mt-0.5 flex-shrink-0" style={{ fontFamily: 'var(--font-poppins)' }}>
                                                {idx + 1}
                                            </span>
                                            <p className="text-sm sm:text-base text-[#3a4e58] leading-relaxed flex-1" style={{ fontFamily: 'var(--font-poppins)' }}>
                                                {question}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Practitioner Hand-Off Summary */}
                    {report.practitioner_hand_off_summary && (
                        <div
                            ref={(el) => { sectionRefs.current['practitioner'] = el; }}
                            data-section-id="practitioner"
                        >
                            {renderSection(
                                'Practitioner Hand-Off Summary',
                                report.practitioner_hand_off_summary
                            )}
                        </div>
                    )}

                    {/* Practitioner Notes */}
                    {report.practitioner_notes && (
                        <div
                            ref={(el) => { sectionRefs.current['practitioner-notes'] = el; }}
                            data-section-id="practitioner-notes"
                        >
                            {renderSection(
                                'Practitioner Notes',
                                report.practitioner_notes
                            )}
                        </div>
                    )}

                    {/* Next Steps & Recovery Tools */}
                    {report.next_steps_and_recovery_tools && (
                        <div
                            ref={(el) => { sectionRefs.current['next-steps'] = el; }}
                            data-section-id="next-steps"
                        >
                            {renderSection(
                                'Next Steps & Recovery Tools',
                                report.next_steps_and_recovery_tools
                            )}
                        </div>
                    )}

                    {/* Disclaimer */}
                    {report.disclaimer && (
                        <div className="bg-[#fff8f0] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-12 border-2 border-[#d6b499]/20">
                            <div className="flex items-start gap-3 sm:gap-4">
                                <div className="text-[#d6b499] mt-1 flex-shrink-0">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <p className="text-xs sm:text-sm text-[#8b8780] leading-relaxed italic" style={{ fontFamily: 'var(--font-poppins)' }}>
                                    {report.disclaimer}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Back Button */}
                    <div className="text-center pt-6 sm:pt-8">
                        <a
                            href="/"
                            className="inline-flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 tan-bg text-white rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold hover:opacity-90 transition-opacity shadow-lg"
                            style={{ fontFamily: 'var(--font-poppins)' }}
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="hidden sm:inline">Return to Intake Form</span>
                            <span className="sm:hidden">Back</span>
                        </a>
                    </div>
                </div>
            </main>

            <EmailDialog
                isOpen={showEmailDialog}
                onClose={() => setShowEmailDialog(false)}
                report={report}
                reportId={reportId}
            />
        </div>
    );
};

export default ReportViewer;

