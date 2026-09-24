import React, { useEffect, useState } from 'react';
import { Package, Truck, RotateCcw, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { shippingService, ShippingSettings } from '../services/shippingService';

const ShippingReturns: React.FC = () => {
    const { t } = useLanguage();
    usePageMeta({ title: 'Shipping & Returns' });
    const [shippingSettings, setShippingSettings] = useState<ShippingSettings | null>(null);

    // Keep the wording in sync with the delivery fee used at checkout.
    useEffect(() => {
        shippingService.getSettings()
            .then(setShippingSettings)
            .catch(() => { /* show delivery info without exact fees */ });
    }, []);

    return (
        <div className="bg-sand min-h-screen">
            {/* Hero Section */}
            <section className="bg-sage/10 py-20 px-6">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-5xl md:text-6xl font-serif text-primary mb-6">
                        {t('shipping.heroTitle')}
                    </h1>
                    <p className="text-lg text-primary/70">
                        {t('shipping.heroSubtitle')}
                    </p>
                </div>
            </section>

            {/* Quick Info Cards */}
            <section className="py-16 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-lg text-center shadow-sm">
                            <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Truck className="w-8 h-8 text-sage" />
                            </div>
                            <h3 className="font-serif font-medium text-primary mb-2">{t('shipping.freeShipping')}</h3>
                            <p className="text-sm text-primary/60">{t('shipping.freeShippingDesc')}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg text-center shadow-sm">
                            <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="w-8 h-8 text-sage" />
                            </div>
                            <h3 className="font-serif font-medium text-primary mb-2">{t('shipping.fastProcessing')}</h3>
                            <p className="text-sm text-primary/60">{t('shipping.fastProcessingDesc')}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg text-center shadow-sm">
                            <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <RotateCcw className="w-8 h-8 text-sage" />
                            </div>
                            <h3 className="font-serif font-medium text-primary mb-2">{t('shipping.returns30Day')}</h3>
                            <p className="text-sm text-primary/60">{t('shipping.returns30DayDesc')}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg text-center shadow-sm">
                            <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-sage" />
                            </div>
                            <h3 className="font-serif font-medium text-primary mb-2">{t('shipping.securePack')}</h3>
                            <p className="text-sm text-primary/60">{t('shipping.securePackDesc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Information */}
            <section className="py-16 px-6">
                <div className="container mx-auto max-w-4xl">
                    <div className="space-y-12">
                        {/* Shipping Policy */}
                        <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm">
                            <h2 className="text-3xl font-serif text-primary mb-6">{t('shipping.policyTitle')}</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-serif text-primary mb-3">{t('shipping.domesticTitle')}</h3>
                                    <ul className="space-y-2 text-primary/70">
                                        <li>• <strong>{t('shipping.standard')}:</strong> {t('shipping.standardTime')}</li>
                                        <li>• <strong>{t('shipping.express')}:</strong> {t('shipping.expressTime')}</li>
                                        <li>• <strong>{t('shipping.nextDay')}:</strong> {t('shipping.nextDayTime')}</li>
                                        {shippingSettings && (
                                            <li>
                                                • <strong>{t('shipping.deliveryFee')}:</strong> Rs {shippingSettings.shippingFee} - {t('shipping.freeDeliveryOver')} Rs {shippingSettings.freeShippingThreshold}
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-serif text-primary mb-3">{t('shipping.coverageTitle')}</h3>
                                    <p className="text-primary/70 leading-relaxed">{t('shipping.coverageDesc')}</p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-serif text-primary mb-3">{t('shipping.couriersTitle')}</h3>
                                    <p className="text-primary/70 leading-relaxed">{t('shipping.couriersDesc')}</p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-serif text-primary mb-3">{t('shipping.codTitle')}</h3>
                                    <p className="text-primary/70 leading-relaxed">{t('shipping.codDesc')}</p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-serif text-primary mb-3">{t('shipping.processingTitle')}</h3>
                                    <p className="text-primary/70 leading-relaxed">
                                        {t('shipping.processingDesc')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Return Policy */}
                        <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm">
                            <h2 className="text-3xl font-serif text-primary mb-6">{t('shipping.returnTitle')}</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-serif text-primary mb-3">{t('shipping.guaranteeTitle')}</h3>
                                    <p className="text-primary/70 leading-relaxed mb-4">
                                        {t('shipping.guaranteeDesc')}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-serif text-primary mb-3">{t('shipping.howToReturnTitle')}</h3>
                                    <ol className="space-y-2 text-primary/70 list-decimal list-inside">
                                        <li>{t('shipping.howToReturnStep1')}</li>
                                        <li>{t('shipping.howToReturnStep2')}</li>
                                        <li>{t('shipping.howToReturnStep3')}</li>
                                        <li>{t('shipping.howToReturnStep4')}</li>
                                        <li>{t('shipping.howToReturnStep5')}</li>
                                        <li>{t('shipping.howToReturnStep6')}</li>
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

                                <div className="bg-sage/10 p-6 rounded-lg mt-6">
                                    <h4 className="font-serif font-medium text-primary mb-2">{t('shipping.damagedTitle')}</h4>
                                    <p className="text-sm text-primary/70">
                                        {t('shipping.damagedDesc')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact CTA */}
                        <div className="text-center p-8 bg-sage/10 rounded-lg">
                            <h3 className="text-2xl font-serif text-primary mb-4">
                                {t('shipping.questionsTitle')}
                            </h3>
                            <p className="text-primary/70 mb-6">
                                {t('shipping.questionsDesc')}
                            </p>
                            <a
                                href="/#/contact"
                                className="inline-block bg-primary text-white px-8 py-3 text-sm uppercase tracking-widest font-bold hover:bg-sage transition-colors"
                            >
                                {t('shipping.contactSupport')}
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ShippingReturns;
