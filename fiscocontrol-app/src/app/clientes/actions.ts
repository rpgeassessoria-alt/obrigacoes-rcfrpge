"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import axios from "axios";

export async function consultarCNPJ(cnpj: string) {
    try {
        const cleanCnpj = cnpj.replace(/\D/g, "");
        if (cleanCnpj.length !== 14) throw new Error("CNPJ inválido");

        const response = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
        return { success: true, data: response.data };
    } catch (error: any) {
        console.error("Erro ao consultar CNPJ:", error.response?.data || error.message);
        return { success: false, error: "Não foi possível localizar os dados deste CNPJ." };
    }
}

import { OBRIGACOES_CATALOG } from "@/lib/obrigacoesCatalog";

function calcularVencimento(dia: number, mes: number): Date {
    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth();

    if (mes === -1) {
        // Próximo mês
        return new Date(anoAtual, mesAtual + 1, dia);
    } else {
        // Mês fixo (Anual)
        const ano = mes < mesAtual ? anoAtual + 1 : anoAtual;
        return new Date(ano, mes, dia);
    }
}

export async function salvarCliente(form: any, isEdit: boolean, selectedObligationsIDs?: string[]) {
    try {
        const data: any = {
            razaoSocial: form.razaoSocial,
            cnpj: form.cnpj,
            regime: form.regime,
            cnae: form.cnae,
            inscricaoEstadual: form.inscricaoEstadual,
            inscricaoMunicipal: form.inscricaoMunicipal,
            status: form.status,
            risco: form.risco,
            responsibleId: form.responsibleId,
            economicGroupId: form.economicGroupId,
            tenantId: form.tenantId,
            nomeFantasia: form.nomeFantasia,
            email: form.eMail,
            telefone: form.telefone
        };

        const client = await prisma.$transaction(async (tx) => {
            let savedClient;
            if (isEdit && form.id) {
                savedClient = await tx.client.update({
                    where: { id: form.id },
                    data
                });
            } else {
                savedClient = await tx.client.create({
                    data
                });
            }

            // Se for novo cliente e houver obrigações selecionadas
            if (!isEdit && selectedObligationsIDs && selectedObligationsIDs.length > 0) {
                const obligationsToCreate = selectedObligationsIDs.map(id => {
                    const template = OBRIGACOES_CATALOG.find(t => t.id === id);
                    if (!template) return null;

                    return {
                        nome: template.nome,
                        identifier: template.id,
                        competencia: template.periodo === 'Anual' ? String(new Date().getFullYear()) : `${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
                        vencimento: calcularVencimento(template.dia, template.mes),
                        esfera: template.esfera,
                        status: "PENDENTE",
                        clientId: savedClient.id
                    };
                }).filter(Boolean);

                if (obligationsToCreate.length > 0) {
                    await tx.obligation.createMany({
                        data: obligationsToCreate as any
                    });
                }
            }

            return savedClient;
        });

        revalidatePath("/clientes");
        return { success: true, id: client.id };
    } catch (err: any) {
        console.error("Erro ao salvar cliente:", err);
        return { success: false, error: err.message };
    }
}

export async function excluirCliente(id: string) {
    try {
        // Deleta em cascata manualmente dentro de uma transação
        await prisma.$transaction([
            prisma.obligation.deleteMany({ where: { clientId: id } }),
            prisma.client.delete({ where: { id } })
        ]);

        revalidatePath("/clientes");
        return { success: true };
    } catch (err: any) {
        console.error("Erro ao excluir cliente:", err);
        return { success: false, error: "Não foi possível excluir o cliente. Verifique se existem dependências ativas." };
    }
}

// ── Gestão de Grupos Econômicos ──────────────────────────────────────────────

export async function getGruposEconomicos(tenantId: string) {
    return await prisma.economicGroup.findMany({
        where: { tenantId },
        include: { _count: { select: { clients: true } } },
        orderBy: { name: "asc" }
    });
}

export async function salvarGrupoEconomico(data: any, isEdit: boolean) {
    try {
        if (isEdit && data.id) {
            await prisma.economicGroup.update({
                where: { id: data.id },
                data: { name: data.name }
            });
        } else {
            await prisma.economicGroup.create({
                data: {
                    name: data.name,
                    tenantId: data.tenantId
                }
            });
        }
        revalidatePath("/clientes");
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

export async function excluirGrupoEconomico(id: string) {
    try {
        // Verifica se existem clientes vinculados
        const count = await prisma.client.count({ where: { economicGroupId: id } });
        if (count > 0) throw new Error("Não é possível excluir um grupo que possui clientes vinculados.");

        await prisma.economicGroup.delete({ where: { id } });
        revalidatePath("/clientes");
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
