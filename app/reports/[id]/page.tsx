"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ReportViewer from '@/components/ReportViewer';

export default function ReportPage() {
    const params = useParams();
    const reportId = params?.id as string;
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!reportId) {
            setError('Invalid report ID');
            setLoading(false);
            return;
        }

        const fetchReport = async () => {
            try {
                const response = await fetch(`/api/reports/${reportId}`);
                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.error || 'Failed to fetch report');
                }

                setReport(result.data);
            } catch (err: any) {
                console.error('Error fetching report:', err);
                setError(err.message || 'Failed to load report');
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [reportId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfbf9]">
                <div className="text-center space-y-4">
                    <div className="animate-spin w-12 h-12 border-4 border-[#d6b499] border-t-transparent rounded-full mx-auto" />
                    <p className="text-[#8b8780] font-medium" style={{ fontFamily: 'var(--font-poppins)' }}>
                        Loading report...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfbf9]">
                <div className="text-center space-y-4 max-w-md mx-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-[#1a2b33]" style={{ fontFamily: 'var(--font-poppins)' }}>
                        Report Not Found
                    </h2>
                    <p className="text-[#8b8780]" style={{ fontFamily: 'var(--font-poppins)' }}>
                        {error || 'The report you are looking for does not exist.'}
                    </p>
                    <a
                        href="/"
                        className="inline-block mt-6 px-6 py-3 tan-bg text-white rounded-2xl font-semibold hover:opacity-90 transition-opacity"
                        style={{ fontFamily: 'var(--font-poppins)' }}
                    >
                        Return to Intake Form
                    </a>
                </div>
            </div>
        );
    }

    return <ReportViewer report={report} reportId={reportId} />;
}

