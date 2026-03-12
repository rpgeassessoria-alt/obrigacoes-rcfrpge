"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function marcarComoEntregue(id: string) {
    try {
        await prisma.obligation.update({
            where: { id },
            data: { status: "Entregue" } // Or "ENTREGUE" based on schema preference, let's keep case-sensitive standard but adapt to what is seen in original
        });
        revalidatePath("/obrigacoes");
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
