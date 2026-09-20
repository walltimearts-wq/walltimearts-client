import api from './api';
import { ApiResponse } from '../types';

export interface ContactMessage {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export const contactService = {
    // Public: send a contact-form message (forwarded to the admin inbox via SMTP)
    sendMessage: async (data: ContactMessage): Promise<void> => {
        await api.post<ApiResponse<null>>('/contact', data);
    },
};
