"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function salvarUsuario(data: any, isEdit: boolean) {
    try {
        const { id, name, email, password, role, cargo, telefone, active, tenantId, allowedGroups } = data;

        if (isEdit) {
            const updateData: any = {
                name,
                email,
                role,
                cargo,
                telefone,
                tenantId,
                active: active === "Ativo" || active === true,
                allowedGroups: {
                    set: allowedGroups?.map((gid: string) => ({ id: gid })) || []
                }
            };

            // Só atualiza a senha se ela for enviada (não vazia)
            if (password && password.trim() !== "") {
                updateData.password = await bcrypt.hash(password, 10);
            }

            await prisma.user.update({
                where: { id },
                data: updateData
            });
        } else {
            // Novo Usuário
            if (!password) throw new Error("Senha é obrigatória para novos usuários.");

            const hashedPassword = await bcrypt.hash(password, 10);

            await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role,
                    cargo,
                    telefone,
                    tenantId,
                    active: active === "Ativo" || active === true,
                    allowedGroups: {
                        connect: allowedGroups?.map((gid: string) => ({ id: gid })) || []
                    }
                }
            });
        }

        revalidatePath("/equipe");
        return { success: true };
    } catch (err: any) {
        console.error("Erro ao salvar usuário:", err);
        return { success: false, error: err.message };
    }
}

export async function excluirUsuario(id: string) {
    try {
        // Verificar se o usuário tem clientes vinculados
        const user = await prisma.user.findUnique({
            where: { id },
            include: { _count: { select: { clients: true } } }
        });

        if (user?._count.clients && user._count.clients > 0) {
            throw new Error("Não é possível excluir um usuário que possui clientes vinculados. Remova os vínculos primeiro.");
        }

        await prisma.user.delete({
            where: { id }
        });

        revalidatePath("/equipe");
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
