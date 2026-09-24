import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Truck,
    RotateCcw,
    RefreshCw,
    Shield,
    FileText,
    PhoneCall,
    Mail,
    Clock,
    HelpCircle,
    ChevronRight,
    CheckCircle2,
    ArrowRight,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { getLenis } from '../components/common/SmoothScroll';
import { TranslationKey } from '../translations';

/** Customer service contact details, kept in one place for reuse. */
const SERVICE_PHONE = '+92 0307 9261677';
const SERVICE_PHONE_HREF = 'tel:+923079261677';
const SERVICE_EMAIL = 'walltimearts@gmail.com';

interface NavSection {
    id: string;
    label: TranslationKey;
    icon: React.ElementType;
}

const NAV_SECTIONS: NavSection[] = [
    { id: 'shipping', label: 'policies.navShipping', icon: Truck },
    { id: 'returns', label: 'policies.navReturns', icon: RotateCcw },
    { id: 'refunds', label: 'policies.navRefunds', icon: RefreshCw },
    { id: 'privacy', label: 'policies.navPrivacy', icon: Shield },
    { id: 'terms', label: 'policies.navTerms', icon: FileText },
    { id: 'service', label: 'policies.navService', icon: PhoneCall },
];

const Policies: React.FC = () => {
    const { t } = useLanguage();
    const location = useLocation();
    usePageMeta({ title: 'Policies' });
    const [activeSection, setActiveSection] = useState<string>('shipping');

    const scrollToSection = useCallback((id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        setActiveSection(id);
        const lenis = getLenis();
        if (lenis) {
            lenis.scrollTo(el, { offset: -120, duration: 1 });
        } else {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    // Deep links such as /#/policies#refunds land on the right section.
    useEffect(() => {
        const hash = location.hash.replace('#', '');
        if (!hash) return;
        const timer = window.setTimeout(() => scrollToSection(hash), 150);
        return () => window.clearTimeout(timer);
    }, [location.hash, scrollToSection]);

    // Highlight the section currently in view.
    useEffect(() => {
        const handleScroll = () => {
            const offset = 160;
            let current = NAV_SECTIONS[0].id;
            for (const section of NAV_SECTIONS) {
                const el = document.getElementById(section.id);
                if (el && el.getBoundingClientRect().top - offset <= 0) {
                    current = section.id;
                }
            }
            setActiveSection(current);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const effectiveDate = new Date().toLocaleDateString();

    return (
        <div className="bg-sand min-h-screen">
            {/* Hero */}
            <section className="bg-sage/10 py-16 md:py-20 px-6">
                <div className="container mx-auto max-w-5xl text-center">
                    <h1 className="text-4xl md:text-6xl font-serif text-primary mb-5">
                        {t('policies.heroTitle')}
                    </h1>
                    <p className="text-lg text-primary/70 max-w-2xl mx-auto">
                        {t('policies.heroSubtitle')}
                    </p>
                    <p className="mt-5 text-xs uppercase tracking-[0.25em] text-primary/50">
                        {t('policies.lastUpdated')}: {effectiveDate}
                    </p>
                </div>
            </section>

            <section className="py-12 md:py-16 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-14">
                        {/* Sticky in-page nav */}
                        <aside className="lg:sticky lg:top-32 h-max">
                            <p className="hidden lg:block text-xs uppercase tracking-[0.25em] text-primary/50 mb-4">
                                {t('policies.onThisPage')}
                            </p>
                            <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-1 px-1">
                                {NAV_SECTIONS.map(({ id, label, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => scrollToSection(id)}
                                        className={`flex items-center gap-3 whitespace-nowrap rounded-full lg:rounded-sm px-4 py-2.5 text-sm font-medium transition-colors border ${
                                            activeSection === id
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-white text-primary/70 border-primary/10 hover:border-sage/40 hover:text-primary'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4 flex-shrink-0" />
                                        {t(label)}
                                    </button>
                                ))}
                            </nav>
                        </aside>

                        {/* Content */}
                        <div className="space-y-10 min-w-0">
                            {/* Shipping Policy */}
                            <article id="shipping" className="scroll-mt-32 bg-white p-8 md:p-12 rounded-lg shadow-sm">
                                <SectionHeading icon={Truck} title={t('shipping.policyTitle')} />

                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xl font-serif text-primary mb-3">{t('shipping.domesticTitle')}</h3>
                                        <ul className="space-y-2 text-primary/70">
                                            <li>• <strong>{t('shipping.standard')}:</strong> 5-7 business days - Rs 9.95 (FREE on orders over Rs 150)</li>
                                            <li>• <strong>{t('shipping.express')}:</strong> 2-3 business days - Rs 24.95</li>
                                            <li>• <strong>{t('shipping.nextDay')}:</strong> 1 business day - Rs 39.95</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-serif text-primary mb-3">{t('shipping.intlTitle')}</h3>
                                        <ul className="space-y-2 text-primary/70">
                                            <li>• <strong>Canada:</strong> 7-10 business days - Starting at Rs 19.95</li>
                                            <li>• <strong>Europe:</strong> 10-15 business days - Starting at Rs 29.95</li>
                                            <li>• <strong>Rest of World:</strong> 12-20 business days - Starting at Rs 39.95</li>
                                            <li className="mt-3 text-sm italic">
                                                * International orders may be subject to import duties and taxes, which are the responsibility of the recipient.
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-serif text-primary mb-3">{t('shipping.processingTitle')}</h3>
                                        <p className="text-primary/70 leading-relaxed">
                                            {t('shipping.processingDesc')}
                                        </p>
                                    </div>

                                    <div className="bg-sage/10 p-6 rounded-lg">
                                        <h4 className="font-serif font-medium text-primary mb-2">{t('footer.trackOrder')}</h4>
                                        <p className="text-sm text-primary/70">
                                            Every order ships with tracking. Use the{' '}
                                            <Link to="/track-order" className="text-sage underline hover:text-primary transition-colors">
                                                {t('footer.trackOrder')}
                                            </Link>{' '}
                                            page to follow your parcel from dispatch to delivery.
                                        </p>
                                    </div>
                                </div>
                            </article>

                            {/* Return Policy */}
                            <article id="returns" className="scroll-mt-32 bg-white p-8 md:p-12 rounded-lg shadow-sm">
                                <SectionHeading icon={RotateCcw} title={t('shipping.returnTitle')} />

                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xl font-serif text-primary mb-3">{t('shipping.guaranteeTitle')}</h3>
                                        <p className="text-primary/70 leading-relaxed">{t('shipping.guaranteeDesc')}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-serif text-primary mb-3">{t('shipping.howToReturnTitle')}</h3>
                                        <ol className="space-y-3 text-primary/70">
                                            {[
                                                t('shipping.howToReturnStep1'),
                                                t('shipping.howToReturnStep2'),
                                                t('shipping.howToReturnStep3'),
                                                t('shipping.howToReturnStep4'),
                                                t('shipping.howToReturnStep5'),
                                                t('shipping.howToReturnStep6'),
                                            ].map((step, i) => (
                                                <li key={i} className="flex gap-3">
                                                    <CheckCircle2 className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
                                                    <span>{step}</span>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-serif text-primary mb-3">{t('shipping.notesTitle')}</h3>
                                        <ul className="space-y-2 text-primary/70">
                                            <li>• {t('shipping.note1')}</li>
                                            <li>• {t('shipping.note2')}</li>
                                            <li>• {t('shipping.note3')}</li>
                                            <li>• {t('shipping.note4')}</li>
                                            <li>• {t('shipping.note5')}</li>
                                        </ul>
                                    </div>

                                    <div className="bg-sage/10 p-6 rounded-lg">
                                        <h4 className="font-serif font-medium text-primary mb-2">{t('shipping.damagedTitle')}</h4>
                                        <p className="text-sm text-primary/70">{t('shipping.damagedDesc')}</p>
                                    </div>
                                </div>
                            </article>

                            {/* Refund Policy */}
                            <article id="refunds" className="scroll-mt-32 bg-white p-8 md:p-12 rounded-lg shadow-sm">
                                <SectionHeading icon={RefreshCw} title={t('refund.title')} />

                                <div className="space-y-8">
                                    <p className="text-primary/70 leading-relaxed">{t('refund.intro')}</p>

                                    <div>
                                        <h3 className="text-xl font-serif text-primary mb-3">{t('refund.timelineTitle')}</h3>
                                        <p className="text-primary/70 leading-relaxed">{t('refund.timelineDesc')}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-serif text-primary mb-3">{t('refund.methodTitle')}</h3>
                                        <p className="text-primary/70 leading-relaxed">{t('refund.methodDesc')}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-serif text-primary mb-3">{t('refund.partialTitle')}</h3>
                                        <p className="text-primary/70 leading-relaxed">{t('refund.partialDesc')}</p>
                                    </div>

                                    <div className="bg-sage/10 p-6 rounded-lg">
                                        <h4 className="font-serif font-medium text-primary mb-2">{t('refund.lateTitle')}</h4>
                                        <p className="text-sm text-primary/70">{t('refund.lateDesc')}</p>
                                    </div>
                                </div>
                            </article>

                            {/* Privacy Policy */}
                            <article id="privacy" className="scroll-mt-32 bg-white p-8 md:p-12 rounded-lg shadow-sm">
                                <SectionHeading icon={Shield} title={t('privacy.title')} />

                                <div className="space-y-8 text-primary/70 leading-relaxed">
                                    <p>{t('privacy.fallbackDesc')}</p>
                                    <div>
                                        <h3 className="text-xl font-serif text-primary mb-3">{t('privacy.fallbackSection1')}</h3>
                                        <p>{t('privacy.fallbackSection1Desc')}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-serif text-primary mb-3">{t('privacy.fallbackSection2')}</h3>
                                        <p>{t('privacy.fallbackSection2Desc')}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-serif text-primary mb-3">{t('privacy.fallbackSection3')}</h3>
                                        <p>{t('privacy.fallbackSection3Desc')}</p>
                                    </div>
                                </div>

                                <p className="mt-8 text-sm text-primary/50">
                                    {t('policies.helpDesc')}{' '}
                                    <a href={`mailto:${SERVICE_EMAIL}`} className="text-sage underline hover:text-primary transition-colors">
                                        {SERVICE_EMAIL}
                                    </a>
                                </p>
                            </article>

                            {/* Terms & Conditions */}
                            <article id="terms" className="scroll-mt-32 bg-white p-8 md:p-12 rounded-lg shadow-sm">
                                <SectionHeading icon={FileText} title={t('policies.navTerms')} />

                                <div className="space-y-8 text-primary/70 leading-relaxed">
                                    <p>{t('terms.fallbackDesc')}</p>
                                    <div>
                                        <h3 className="text-xl font-serif text-primary mb-3">{t('terms.fallbackSection1')}</h3>
                                        <p>{t('terms.fallbackSection1Desc')}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-serif text-primary mb-3">{t('terms.fallbackSection2')}</h3>
                                        <p>{t('terms.fallbackSection2Desc')}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-serif text-primary mb-3">{t('terms.fallbackSection3')}</h3>
                                        <p>{t('terms.fallbackSection3Desc')}</p>
                                    </div>
                                </div>
                            </article>

                            {/* Customer Service */}
                            <article id="service" className="scroll-mt-32 bg-white p-8 md:p-12 rounded-lg shadow-sm">
                                <SectionHeading icon={PhoneCall} title={t('service.title')} />
                                <p className="text-primary/70 leading-relaxed mb-8">{t('service.desc')}</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="border border-primary/10 rounded-lg p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                <PhoneCall className="w-5 h-5 text-sage" />
                                            </div>
                                            <h3 className="font-serif font-medium text-primary">{t('service.phoneLabel')}</h3>
                                        </div>
                                        <a href={SERVICE_PHONE_HREF} className="text-lg text-primary hover:text-sage transition-colors font-medium">
                                            {SERVICE_PHONE}
                                        </a>
                                    </div>

                                    <div className="border border-primary/10 rounded-lg p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Mail className="w-5 h-5 text-sage" />
                                            </div>
                                            <h3 className="font-serif font-medium text-primary">{t('service.emailLabel')}</h3>
                                        </div>
                                        <a href={`mailto:${SERVICE_EMAIL}`} className="text-primary hover:text-sage transition-colors font-medium break-all">
                                            {SERVICE_EMAIL}
                                        </a>
                                    </div>

                                    <div className="border border-primary/10 rounded-lg p-6 sm:col-span-2">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Clock className="w-5 h-5 text-sage" />
                                            </div>
                                            <h3 className="font-serif font-medium text-primary">{t('service.hoursLabel')}</h3>
                                        </div>
                                        <p className="text-primary/70">{t('service.hoursValue')}</p>
                                    </div>
                                </div>

                                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                    <a
                                        href={SERVICE_PHONE_HREF}
                                        className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3.5 text-sm uppercase tracking-widest font-bold hover:bg-sage transition-colors"
                                    >
                                        <PhoneCall className="w-4 h-4" />
                                        {t('service.call')}
                                    </a>
                                    <a
                                        href={`mailto:${SERVICE_EMAIL}`}
                                        className="inline-flex items-center justify-center gap-2 border border-primary/20 text-primary px-8 py-3.5 text-sm uppercase tracking-widest font-bold hover:border-sage hover:text-sage transition-colors"
                                    >
                                        <Mail className="w-4 h-4" />
                                        {t('service.email')}
                                    </a>
                                </div>
                            </article>

                            {/* FAQ + Contact CTAs */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col">
                                    <HelpCircle className="w-8 h-8 text-sage mb-4" />
                                    <h3 className="text-2xl font-serif text-primary mb-2">{t('policies.faqTitle')}</h3>
                                    <p className="text-primary/70 mb-6 flex-grow">{t('policies.faqDesc')}</p>
                                    <Link
                                        to="/faq"
                                        className="inline-flex items-center gap-2 text-sm uppercase tracking-widest font-bold text-primary hover:text-sage transition-colors"
                                    >
                                        {t('policies.faqBtn')}
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>

                                <div className="bg-primary text-white p-8 rounded-lg shadow-sm flex flex-col">
                                    <PhoneCall className="w-8 h-8 text-sage mb-4" />
                                    <h3 className="text-2xl font-serif mb-2">{t('policies.helpTitle')}</h3>
                                    <p className="text-white/70 mb-6 flex-grow">{t('policies.helpDesc')}</p>
                                    <Link
                                        to="/contact"
                                        className="inline-flex items-center gap-2 text-sm uppercase tracking-widest font-bold hover:text-sage transition-colors"
                                    >
                                        {t('footer.contactUs')}
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

const SectionHeading: React.FC<{ icon: React.ElementType; title: string }> = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-4 mb-8 border-b border-sage/10 pb-6">
        <div className="bg-sage/10 p-3.5 rounded-full text-sage flex-shrink-0">
            <Icon className="w-7 h-7" />
        </div>
        <h2 className="text-3xl md:text-4xl font-serif text-primary">{title}</h2>
    </div>
);

export default Policies;
