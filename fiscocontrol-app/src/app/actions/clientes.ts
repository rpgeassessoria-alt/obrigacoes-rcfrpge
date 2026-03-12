"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createClient(formData: FormData) {
    const razaoSocial = formData.get("razaoSocial") as string;
    const cnpj = (formData.get("cnpj") as string || "").replace(/\D/g, "");
    const regime = formData.get("regime") as string || "SIMPLES_NACIONAL";
    const cnae = formData.get("cnae") as string || "";
    const risco = formData.get("risco") as string || "Baixo";

    if (!razaoSocial || !cnpj) {
        throw new Error("Razão Social e CNPJ são obrigatórios.");
    }

    // Busca de forma robusta os dados iniciais, mas não trava se não achar
    // pois o schema permite tenantId e economicGroupId nulos
    const tenant = await prisma.tenant.findFirst({ where: { slug: "matriz" } }) || await prisma.tenant.findFirst();
    const group = await prisma.economicGroup.findFirst({ where: { tenantId: tenant?.id } }) || await prisma.economicGroup.findFirst();
    const admin = await prisma.user.findFirst({ where: { role: "ADMINISTRADOR" } }) || await prisma.user.findFirst();

    try {
        await prisma.client.create({
            data: {
                razaoSocial,
                cnpj,
                regime,
                cnae,
                status: "Ativo",
                risco,
                tenantId: tenant?.id || null,
                economicGroupId: group?.id || null,
                responsibleId: admin?.id || null
            }
        });
    } catch (error: any) {
        console.error("Erro Prisma ao criar cliente:", error);
        // Se o erro for de CNPJ duplicado (código P2002 do Prisma)
        if (error.code === 'P2002') {
             throw new Error("Este CNPJ já está cadastrado.");
        }
        throw new Error("Erro técnico ao salvar no banco. Verifique os logs do servidor.");
    }

    // Sucesso
    revalidatePath("/clientes");
    redirect("/clientes");
}
