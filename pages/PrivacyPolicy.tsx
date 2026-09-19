import React, { useState, useEffect } from 'react';
import { contentService } from '../services/contentService';
import Loader from '../components/common/Loader';
import { Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';

const PrivacyPolicy: React.FC = () => {
    const { t } = useLanguage();
    usePageMeta({ title: 'Privacy Policy' });
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const data = await contentService.getContent('privacy_policy');
                setContent(data);
            } catch (err) {
                console.error('Failed to fetch Privacy Policy');
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    if (loading) return <Loader fullPage color="#2B2118" />;

    return (
        <div className="bg-sand min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 rounded-sm shadow-sm">
                <div className="flex items-center space-x-4 mb-10 border-b border-sage/10 pb-8">
                    <div className="bg-sage/10 p-4 rounded-full text-sage">
                        <Shield className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-serif text-primary">{t('privacy.title')}</h1>
                        <p className="text-primary/50 text-sm mt-1 uppercase tracking-widest">{t('privacy.effectiveDate')}: {content?.effectiveDate || new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="prose prose-sage max-w-none prose-headings:font-serif prose-headings:font-medium prose-p:text-primary/70 prose-p:leading-relaxed">
                    {content?.body ? (
                        <div dangerouslySetInnerHTML={{ __html: content.body }} />
                    ) : (
                        <div className="space-y-8">
                            <p>{t('privacy.fallbackDesc')}</p>
                            <h2 className="text-2xl font-serif text-primary mt-8">{t('privacy.fallbackSection1')}</h2>
                            <p>{t('privacy.fallbackSection1Desc')}</p>
                            <h2 className="text-2xl font-serif text-primary mt-8">{t('privacy.fallbackSection2')}</h2>
                            <p>{t('privacy.fallbackSection2Desc')}</p>
                            <h2 className="text-2xl font-serif text-primary mt-8">{t('privacy.fallbackSection3')}</h2>
                            <p>{t('privacy.fallbackSection3Desc')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
