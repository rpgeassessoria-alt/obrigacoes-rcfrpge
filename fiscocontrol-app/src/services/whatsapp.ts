import axios from 'axios';

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY;

export const whatsappService = {
    async sendMessage(to: string, message: string) {
        if (!WHATSAPP_API_URL || !WHATSAPP_API_KEY) {
            console.warn("WhatsApp API não configurada.");
            return null;
        }

        try {
            const response = await axios.post(`${WHATSAPP_API_URL}/message/sendText`, {
                number: to,
                text: message,
            }, {
                headers: {
                    'apikey': WHATSAPP_API_KEY,
                }
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao enviar mensagem WhatsApp:", error);
            throw error;
        }
    },

    async sendReminder(clientName: string, obligationName: string, dueDate: string, phone: string) {
        const message = `Olá ${clientName}! 📝\n\nLembrete FiscoControl: A obrigação *${obligationName}* vence em *${dueDate}*.\n\nPor favor, garanta o envio dos documentos necessários.`;
        return this.sendMessage(phone, message);
    }
};
