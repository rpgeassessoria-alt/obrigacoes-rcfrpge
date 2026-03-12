import axios from 'axios';

const EVOLUTION_API_URL = process.env.WHATSAPP_API_URL || "http://localhost:8080";
const EVOLUTION_API_KEY = process.env.WHATSAPP_API_KEY || "fiscocontrol_secret_key";
const INSTANCE_NAME = "fiscocontrol_main";

export const evolutionService = {
    /**
     * Cria uma nova instância de conexão se não existir.
     */
    async createInstance() {
        try {
            const response = await axios.post(`${EVOLUTION_API_URL}/instance/create`, {
                instanceName: INSTANCE_NAME,
                token: EVOLUTION_API_KEY,
                qrcode: true
            }, {
                headers: { 'apikey': EVOLUTION_API_KEY }
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao criar instância:", error);
            throw error;
        }
    },

    /**
     * Obtém o QR Code para conectar o WhatsApp.
     */
    async getQRCode() {
        try {
            const response = await axios.get(`${EVOLUTION_API_URL}/instance/connect/${INSTANCE_NAME}`, {
                headers: { 'apikey': EVOLUTION_API_KEY }
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar QR Code:", error);
            throw error;
        }
    },

    /**
     * Envia uma mensagem de texto simples.
     */
    async sendText(to: string, text: string) {
        try {
            // Formata o número (garantindo 55 + DDD + Numero)
            const cleanNumber = to.replace(/\D/g, "");
            const formattedNumber = cleanNumber.startsWith("55") ? cleanNumber : `55${cleanNumber}`;

            const response = await axios.post(`${EVOLUTION_API_URL}/message/sendText/${INSTANCE_NAME}`, {
                number: formattedNumber,
                options: {
                    delay: 1200,
                    presence: "composing",
                    linkPreview: false
                },
                textMessage: {
                    text: text
                }
            }, {
                headers: { 'apikey': EVOLUTION_API_KEY }
            });
            return response.data;
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            throw error;
        }
    }
};
