"use client";

import React, { useState, useEffect } from 'react';

interface EmailDialogProps {
    isOpen: boolean;
    onClose: () => void;
    report: any;
    reportId?: string | null;
}

const EmailDialog: React.FC<EmailDialogProps> = ({ isOpen, onClose, report, reportId }) => {
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('Hydrawav3 Diagnostic Protocol Report');
    const [message, setMessage] = useState('Please find attached your diagnostic protocol report.');
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Pre-fill email from report when dialog opens
    useEffect(() => {
        if (isOpen) {
            const reportEmail = report?.personal_snapshot?.email || '';
            setEmail(reportEmail);
            setSubject('Hydrawav3 Diagnostic Protocol Report');
            setMessage('Please find attached your diagnostic protocol report.');
            setError(null);
            setSuccess(false);
        }
    }, [isOpen, report]);

    if (!isOpen) return null;

    const handleSend = async () => {
        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        setIsSending(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('/api/reports/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: email,
                    subject,
                    message,
                    report,
                    reportId,
                }),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Failed to send email');
            }

            setSuccess(true);
            setTimeout(() => {
                onClose();
                setEmail('');
                setSubject('Hydrawav3 Diagnostic Protocol Report');
                setMessage('Please find attached your diagnostic protocol report.');
                setSuccess(false);
            }, 2000);
        } catch (err: any) {
            console.error('Error sending email:', err);
            setError(err.message || 'Failed to send email. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl p-8 lg:p-10 max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-500">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[#1a2b33]" style={{ fontFamily: 'var(--font-poppins)' }}>
                        Send Report via Email
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[#8b8780] hover:text-[#1a2b33] transition-colors p-2 hover:bg-[#fdfbf9] rounded-xl"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {success ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-[#1a2b33] mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
                            Email Sent Successfully!
                        </h3>
                        <p className="text-[#8b8780]" style={{ fontFamily: 'var(--font-poppins)' }}>
                            The report has been sent to {email}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-[#8b8780] uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
                                Recipient Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="recipient@example.com"
                                className="w-full px-5 py-3.5 rounded-2xl border border-[#eeeae5] focus:border-[#d6b499] focus:ring-2 focus:ring-[#d6b499]/20 outline-none transition-all"
                                style={{ fontFamily: 'var(--font-poppins)' }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#8b8780] uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
                                Subject
                            </label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-5 py-3.5 rounded-2xl border border-[#eeeae5] focus:border-[#d6b499] focus:ring-2 focus:ring-[#d6b499]/20 outline-none transition-all"
                                style={{ fontFamily: 'var(--font-poppins)' }}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#8b8780] uppercase tracking-widest mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
                                Message
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={4}
                                className="w-full px-5 py-3.5 rounded-2xl border border-[#eeeae5] focus:border-[#d6b499] focus:ring-2 focus:ring-[#d6b499]/20 outline-none transition-all resize-none"
                                style={{ fontFamily: 'var(--font-poppins)' }}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                                <p className="text-red-600 text-sm" style={{ fontFamily: 'var(--font-poppins)' }}>
                                    {error}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={onClose}
                                disabled={isSending}
                                className="flex-1 px-6 py-3.5 rounded-2xl border border-[#eeeae5] text-[#8b8780] font-semibold hover:bg-[#fdfbf9] transition-all disabled:opacity-50"
                                style={{ fontFamily: 'var(--font-poppins)' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={isSending || !email}
                                className="flex-1 px-6 py-3.5 rounded-2xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                style={{ fontFamily: 'var(--font-poppins)' }}
                            >
                                {isSending ? (
                                    <>
                                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        Send Email
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailDialog;

