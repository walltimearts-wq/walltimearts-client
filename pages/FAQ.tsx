import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';

interface FAQItem {
    question: string;
    answer: string;
}

const FAQ: React.FC = () => {
    const { t } = useLanguage();
    usePageMeta({ title: 'FAQ' });
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs: FAQItem[] = [
        {
            question: t('faq.q1'),
            answer: t('faq.a1')
        },
        {
            question: t('faq.q2'),
            answer: t('faq.a2')
        },
        {
            question: t('faq.q3'),
            answer: t('faq.a3')
        },
        {
            question: t('faq.q4'),
            answer: t('faq.a4')
        },
        {
            question: t('faq.q5'),
            answer: t('faq.a5')
        },
        {
            question: t('faq.q6'),
            answer: t('faq.a6')
        },
        {
            question: t('faq.q7'),
            answer: t('faq.a7')
        },
        {
            question: t('faq.q8'),
            answer: t('faq.a8')
        }
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="bg-sand min-h-screen">
            {/* Hero Section */}
            <section className="bg-sage/10 py-20 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-5xl md:text-6xl font-serif text-primary mb-6">
                        {t('faq.heroTitle')}
                    </h1>
                    <p className="text-lg text-primary/70">
                        {t('faq.heroSubtitle')}
                    </p>
                </div>
            </section>

            {/* FAQ List */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-3xl">
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-stone-50 transition-colors"
                                >
                                    <h3 className="text-lg font-serif font-medium text-primary pr-4">
                                        {faq.question}
                                    </h3>
                                    <ChevronDown
                                        className={`w-5 h-5 text-sage flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'
                                        }`}
                                >
                                    <div className="px-8 pb-6 pt-2">
                                        <p className="text-primary/70 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact CTA */}
                    <div className="mt-16 text-center p-8 bg-sage/10 rounded-lg">
                        <h3 className="text-2xl font-serif text-primary mb-4">
                            {t('faq.stillQuestions')}
                        </h3>
                        <p className="text-primary/70 mb-6">
                            {t('faq.stillQuestionsDesc')}
                        </p>
                        <a
                            href="/#/contact"
                            className="inline-block bg-primary text-white px-8 py-3 text-sm uppercase tracking-widest font-bold hover:bg-sage transition-colors"
                        >
                            {t('faq.contactUs')}
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQ;
