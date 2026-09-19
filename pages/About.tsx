import React from 'react';
import { Leaf, Heart, Users, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { usePageMeta } from '../hooks/usePageMeta';

const CLOCK_HERO_IMG =
    'https://images.unsplash.com/photo-1508963493744-76fce69379c0?q=80&w=2400&auto=format&fit=crop';
const CLOCK_MISSION_IMG =
    'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?q=80&w=1600&auto=format&fit=crop';
const CLOCK_STORY_IMG =
    'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&w=1600&auto=format&fit=crop';

const About: React.FC = () => {
    const { t } = useLanguage();
    const { siteSettings } = useSiteSettings();
    const siteName = siteSettings.siteName;
    usePageMeta({ title: 'Our Story' });

    const values = [
        { icon: Leaf, title: t('about.sustainability'), desc: t('about.sustainabilityDesc') },
        { icon: Heart, title: t('about.quality'), desc: t('about.qualityDesc') },
        { icon: Users, title: t('about.ethics'), desc: t('about.ethicsDesc') },
        { icon: Award, title: t('about.transparency'), desc: t('about.transparencyDesc') },
    ];

    return (
        <div className="bg-sand min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[65vh] md:h-[75vh] overflow-hidden">
                <img
                    src={CLOCK_HERO_IMG}
                    alt="About WallTimeArts"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60 flex items-center justify-center">
                    <div className="text-center text-white px-6 max-w-3xl animate-in fade-in duration-700">
                        <span className="inline-block text-[10px] md:text-xs font-bold uppercase tracking-[0.35em] mb-6 border border-white/40 bg-white/10 backdrop-blur-sm rounded-full px-5 py-1.5">
                            {siteName}
                        </span>
                        <h1 className="text-4xl md:text-7xl font-serif mb-4 leading-tight">
                            {t('about.heroTitle')}
                        </h1>
                        <p className="text-lg md:text-2xl tracking-wide text-white/90">
                            {t('about.heroSubtitle')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission Statement — split layout with image */}
            <section className="py-20 md:py-28 px-6">
                <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div>
                        <p className="text-sage text-xs font-bold uppercase tracking-[0.3em] mb-4">
                            {t('about.heroSubtitle')}
                        </p>
                        <h2 className="text-3xl md:text-5xl font-serif text-primary mb-8 leading-tight">
                            {t('about.missionTitle')}
                        </h2>
                        <p className="text-lg text-primary/70 leading-relaxed">
                            {t('about.missionDesc')}
                        </p>
                    </div>
                    <div className="relative">
                        <div className="absolute -top-4 -left-4 w-full h-full border-2 border-sage/30 rounded-lg pointer-events-none" />
                        <img
                            src={CLOCK_MISSION_IMG}
                            alt="WallTimeArts wall clock"
                            className="relative w-full h-[320px] md:h-[440px] object-cover rounded-lg shadow-xl"
                        />
                        <div className="absolute -bottom-6 -right-2 md:-right-6 bg-white shadow-lg rounded-lg px-6 py-4 border border-primary/5">
                            <p className="text-2xl font-serif text-sage font-bold">2020</p>
                            <p className="text-[10px] uppercase tracking-widest text-primary/50 font-bold">
                                Est.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="py-16 md:py-24 px-6 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl md:text-4xl font-serif text-primary text-center mb-14">
                        {t('about.valuesTitle')}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map(({ icon: Icon, title, desc }) => (
                            <div
                                key={title}
                                className="text-center group bg-sand/60 rounded-2xl p-8 hover-lift border border-transparent hover:border-sage/20 transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-sage group-hover:scale-105 transition-all duration-300">
                                    <Icon className="w-8 h-8 text-sage group-hover:text-white transition-colors duration-300" />
                                </div>
                                <h3 className="text-xl font-serif text-primary mb-3">{title}</h3>
                                <p className="text-primary/60 text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section — alternating image / text rows */}
            <section className="py-20 md:py-28 px-6">
                <div className="container mx-auto max-w-6xl space-y-20 md:space-y-28">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
                        <div className="order-2 md:order-1">
                            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-6">
                                {t('about.startedTitle')}
                            </h2>
                            <p className="text-primary/70 leading-relaxed mb-4">
                                {t('about.startedDesc1')}
                            </p>
                            <p className="text-primary/70 leading-relaxed">
                                {t('about.startedDesc2')}
                            </p>
                        </div>
                        <div className="order-1 md:order-2">
                            <img
                                src={CLOCK_STORY_IMG}
                                alt="WallTimeArts craftsmanship"
                                className="w-full h-[300px] md:h-[400px] object-cover rounded-lg shadow-lg hover-lift"
                            />
                        </div>
                    </div>

                    <div>
                        <h2 className="text-3xl md:text-4xl font-serif text-primary mb-6">
                            {t('about.commitmentTitle')}
                        </h2>
                        <p className="text-primary/70 leading-relaxed mb-4 max-w-4xl">
                            {t('about.commitmentDesc1')}
                        </p>
                        <p className="text-primary/70 leading-relaxed max-w-4xl">
                            {t('about.commitmentDesc2')}
                        </p>
                    </div>

                    {/* Impact Stats */}
                    <div className="bg-white rounded-2xl p-8 md:p-14 shadow-sm border border-primary/5">
                        <h3 className="text-2xl md:text-3xl font-serif text-primary mb-10 text-center">
                            {t('about.impactTitle')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                            <div>
                                <div className="text-4xl md:text-5xl font-serif text-sage mb-2">50,000+</div>
                                <p className="text-primary/60 text-xs uppercase tracking-widest font-bold">
                                    {t('about.happyCustomers')}
                                </p>
                            </div>
                            <div>
                                <div className="text-4xl md:text-5xl font-serif text-sage mb-2">100%</div>
                                <p className="text-primary/60 text-xs uppercase tracking-widest font-bold">
                                    {t('about.organicMaterials')}
                                </p>
                            </div>
                            <div>
                                <div className="text-4xl md:text-5xl font-serif text-sage mb-2">
                                    {t('about.carbonNeutral')}
                                </div>
                                <p className="text-primary/60 text-xs uppercase tracking-widest font-bold">
                                    {t('about.carbonNeutralSince')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 md:py-24 px-6 bg-primary text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
                    <span className="text-[28rem] font-serif leading-none select-none">⏱</span>
                </div>
                <div className="container mx-auto max-w-3xl text-center relative">
                    <h2 className="text-3xl md:text-4xl font-serif mb-6">{t('about.ctaTitle')}</h2>
                    <p className="text-white/80 mb-10 leading-relaxed">{t('about.ctaDesc')}</p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-3 bg-white text-primary px-8 py-3.5 text-sm uppercase tracking-widest font-bold hover:bg-sand transition-colors group"
                    >
                        {t('about.shopCollection')}
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default About;
