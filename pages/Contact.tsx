import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { contactService } from '../services/contactService';


const Contact: React.FC = () => {
    const { t } = useLanguage();
    usePageMeta({ title: 'Contact Us' });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (sending) return;
        setSending(true);
        try {
            await contactService.sendMessage(formData);
            toast.success(t('contact.successMsg'));
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to send your message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="bg-sand min-h-screen">
            {/* Hero Section */}
            <section className="bg-sage/10 py-12 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-5xl md:text-6xl font-serif text-primary mb-6">
                        {t('contact.heroTitle')}
                    </h1>
                    <p className="text-lg text-primary/70">
                        {t('contact.heroSubtitle')}
                    </p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm">
                            <h2 className="text-3xl font-serif text-primary mb-6">{t('contact.sendAMessage')}</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">
                                        {t('contact.yourName')} *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-sage"
                                        placeholder={t('contact.namePlaceholder')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">
                                        {t('auth.emailAddress')} *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-sage"
                                        placeholder={t('auth.emailPlaceholder')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">
                                        {t('contact.subject')} *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-3 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-sage"
                                        placeholder={t('contact.subjectPlaceholder')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">
                                        {t('contact.message')} *
                                    </label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 border border-stone-200 rounded focus:outline-none focus:ring-2 focus:ring-sage resize-none"
                                        placeholder={t('contact.messagePlaceholder')}
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="w-full bg-primary text-white px-8 py-4 text-sm uppercase tracking-widest font-bold hover:bg-sage transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <Send className={`w-4 h-4 ${sending ? 'animate-pulse' : ''}`} />
                                    {sending ? 'Sending...' : t('contact.sendMessage')}
                                </button>
                            </form>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-serif text-primary mb-6">{t('contact.contactInfo')}</h2>
                                <p className="text-primary/70 leading-relaxed mb-8">
                                    {t('contact.contactInfoDesc')}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-sage/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5 text-sage" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif font-medium text-primary mb-1">{t('contact.email')}</h3>
                                        <p className="text-primary/70">walltimearts@gmail.com</p>
                                        <p className="text-sm text-primary/50 mt-1">{t('contact.responseTime')}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-sage/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-5 h-5 text-sage" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif font-medium text-primary mb-1">{t('contact.phone')}</h3>
                                        <p className="text-primary/70">+92 0307 9261677</p>
                                        <p className="text-sm text-primary/50 mt-1">{t('contact.phoneHours')}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-sage/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-sage" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif font-medium text-primary mb-1">{t('contact.address')}</h3>
                                        <p className="text-primary/70">
                                            Ali Steel Enginnering<br />
                                            Ring Road Duranpur <br />
                                            Faqir Colony Peshawar
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Business Hours */}
                            <div className="bg-sage/10 p-6 rounded-lg mt-8">
                                <h3 className="font-serif font-medium text-primary mb-4">{t('contact.businessHours')}</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-primary/70">{t('contact.monFri')}</span>
                                        <span className="text-primary font-medium">9:00 AM - 10:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-primary/70">{t('contact.sat')}</span>
                                        <span className="text-primary font-medium">10:00 AM - 10:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-primary/70">{t('contact.sun')}</span>
                                        <span className="text-primary font-medium">{t('contact.closed')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
