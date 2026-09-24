import React, { useEffect, useRef, useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

interface GoogleAuthButtonProps {
    /** Called with the Google ID token (credential) once the user signs in */
    onSuccess: (credential: string) => void;
    onError?: (message?: string) => void;
    /** Google button copy, e.g. 'continue_with' or 'signup_with' */
    text?: 'signin_with' | 'signup_with' | 'continue_with';
    disabled?: boolean;
}

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

/**
 * Renders the official "Continue with Google" button.
 * Must be used inside a <GoogleOAuthProvider> (see App.tsx).
 */
export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
    onSuccess,
    onError,
    text = 'continue_with',
    disabled = false,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(320);

    // Google renders its button in a fixed-width iframe, so size it to the container.
    useEffect(() => {
        const measure = () => {
            const containerWidth = containerRef.current?.offsetWidth;
            if (containerWidth) {
                setWidth(Math.min(Math.max(Math.floor(containerWidth), 200), 400));
            }
        };
        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, []);

    if (!GOOGLE_CLIENT_ID) {
        return (
            <div className="w-full text-center text-xs text-gray-400 py-2">
                Google sign-in is not configured.
            </div>
        );
    }

    return (
        <div ref={containerRef} className="w-full flex justify-center">
            <div style={{ opacity: disabled ? 0.6 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
                <GoogleLogin
                    onSuccess={(response: CredentialResponse) => {
                        if (response.credential) {
                            onSuccess(response.credential);
                        } else {
                            onError?.('Google did not return a credential');
                        }
                    }}
                    onError={() => onError?.('Google sign-in failed')}
                    theme="outline"
                    size="large"
                    text={text}
                    shape="rectangular"
                    logo_alignment="center"
                    width={width}
                />
            </div>
        </div>
    );
};

export default GoogleAuthButton;
