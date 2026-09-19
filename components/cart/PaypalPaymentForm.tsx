import React from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Lock, ShieldCheck } from 'lucide-react';
import { paymentService } from '../../services/paymentService';

interface PaypalPaymentFormProps {
    total: number;
    orderId: string;
    onSuccess: (paymentData: any) => Promise<void>;
    onError: (message: string) => void;
    clientId: string;
}

const PaypalPaymentForm: React.FC<PaypalPaymentFormProps> = ({
    total,
    orderId,
    onSuccess,
    onError,
    clientId
}) => {
    return (
        <div className="space-y-6">
            <div className="bg-gray-50/50 p-4 md:p-6 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2 uppercase tracking-tight">
                        <Lock className="h-4 w-4 text-[#0070ba]" />
                        <span>Secure PayPal Payment</span>
                    </h4>
                </div>

                <div className="p-4 md:p-8 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <PayPalScriptProvider options={{ 
                        clientId: clientId,
                        currency: "USD",
                        intent: "capture",
                        vault: false
                    }}>
                        <PayPalButtons
                            style={{ 
                                layout: "vertical", 
                                color: "gold", 
                                shape: "rect", 
                                label: "paypal"
                            }}
                            forceReRender={[total, clientId]}
                            createOrder={async () => {
                                try {
                                    const { orderId: paypalOrderId } = await paymentService.createPaypalOrder(total, orderId);
                                    if (!paypalOrderId) {
                                        throw new Error('Order identification missing from response');
                                    }
                                    return paypalOrderId;
                                } catch (err: any) {
                                    const errorMsg = err.response?.data?.message || err.message || 'Initialization failed';
                                    onError(`PayPal Order Error: ${errorMsg}`);
                                    return '';
                                }
                            }}
                            onApprove={async (data) => {
                                try {
                                    const captureData = await paymentService.capturePaypalOrder(data.orderID);
                                    await onSuccess(captureData);
                                } catch (err: any) {
                                    const errorMsg = err.response?.data?.message || err.message || 'Capture failed';
                                    onError(`PayPal Capture Error: ${errorMsg}`);
                                }
                            }}
                            onError={(err) => {
                                console.error('PayPal SDK Error:', err);
                                onError('PayPal SDK reported an error. This can happen if the browser blocks popups or if the payment configuration is invalid.');
                            }}
                            onCancel={() => {
                                console.log('PayPal payment cancelled by user');
                            }}
                        />
                    </PayPalScriptProvider>
                </div>

                <p className="mt-6 text-[10px] text-gray-400 font-medium text-center italic">
                    Payments are highly secured by PayPal Encrypted Protocols
                </p>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-[#0070ba]">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Safe & Secure Checkout</span>
                </div>
            </div>
        </div>
    );
};

export default PaypalPaymentForm;
