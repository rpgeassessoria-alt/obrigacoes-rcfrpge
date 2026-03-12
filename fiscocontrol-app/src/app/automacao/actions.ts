"use server";

import { evolutionService } from "@/services/evolution";
import { revalidatePath } from "next/cache";

export async function getWhatsAppStatus() {
    try {
        // Tenta buscar o QR Code ou status da instância
        // Nota: A Evolution API retorna erro se não estiver conectada ao tentar buscar status
        const status = await evolutionService.getQRCode();
        return { success: true, data: status };
    } catch (err: any) {
        console.error("Erro ao buscar status do WhatsApp:", err.message);
        return { success: false, error: err.message };
    }
}

export async function conectarWhatsApp() {
    try {
        // Garante que a instância existe
        await evolutionService.createInstance();
        // Busca o QR Code
        const data = await evolutionService.getQRCode();
        return { success: true, data };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function enviarMensagemTeste(telefone: string, mensagem: string) {
    try {
        const res = await evolutionService.sendText(telefone, mensagem);
        return { success: true, data: res };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
