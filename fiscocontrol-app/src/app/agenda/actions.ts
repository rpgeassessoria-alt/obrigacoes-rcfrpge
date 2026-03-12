"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function marcarComoEntregueAgenda(id: string) {
    try {
        await prisma.obligation.update({
            where: { id },
            data: { status: "Entregue" }
        });
        revalidatePath("/agenda");
        // Também invalidamos a rota de obrigações para manter a consistência
        revalidatePath("/obrigacoes");
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
