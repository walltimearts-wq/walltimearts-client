import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';


const ForgotPassword: React.FC = () => {
    const { t } = useLanguage();
    usePageMeta({ title: 'Forgot Password' });
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await authService.forgotPassword(email);
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-10 text-center">
                {success ? (
                    <>
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} className="text-green-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('auth.checkInboxTitle')}</h1>
                        <p className="text-gray-500 text-sm mb-2">
                            {t('auth.accountExistsNote')}
                        </p>
                        <p className="font-semibold text-purple-700 text-sm bg-purple-50 px-3 py-1.5 rounded-lg inline-block mb-4">
                            {email}
                        </p>
                        <p className="text-gray-500 text-sm mb-8">
                            {t('auth.resetLinkSent')}
                        </p>
                        <Link
                            to="/"
                            className="inline-block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            {t('auth.backToHome')}
                        </Link>
                    </>
                ) : (
                    <>
                        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Mail size={36} className="text-purple-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('auth.forgotPasswordTitle')}</h1>
                        <p className="text-gray-500 text-sm mb-8">
                            {t('auth.forgotPasswordDesc')}
                        </p>

                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-sm mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="text-left space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('auth.emailAddress')}</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={t('auth.emailPlaceholder')}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                {loading ? t('auth.sending') : t('auth.sendResetLink')}
                            </button>
                        </form>

                        <Link to="/" className="inline-flex items-center gap-1.5 mt-6 text-sm text-gray-400 hover:text-gray-600">
                            <ArrowLeft size={14} /> {t('auth.backToHome')}
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
