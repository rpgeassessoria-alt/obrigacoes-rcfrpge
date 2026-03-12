import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const amanha = new Date(hoje);
        amanha.setDate(amanha.getDate() + 1);

        // Queries paralelas para performance
        const [
            vencendoHoje,
            atrasadas,
            entregues,
            pendentes,
            clientesAtivos,
            totalObrigacoes,
            recentObligations
        ] = await Promise.all([
            // 1. Vencendo Hoje
            prisma.obligation.count({
                where: {
                    vencimento: {
                        gte: hoje,
                        lt: amanha,
                    },
                    status: "PENDENTE"
                }
            }),
            // 2. Atrasadas (vencimento < hoje e não entregue)
            prisma.obligation.count({
                where: {
                    vencimento: {
                        lt: hoje
                    },
                    status: {
                        not: "ENTREGUE"
                    }
                }
            }),
            // 3. Entregues
            prisma.obligation.count({
                where: {
                    status: "ENTREGUE"
                }
            }),
            // 4. Pendentes Totais
            prisma.obligation.count({
                where: {
                    status: "PENDENTE"
                }
            }),
            // 5. Clientes Ativos
            prisma.client.count({
                where: {
                    status: "Ativo"
                }
            }),
            // 6. Total Obrigações
            prisma.obligation.count(),
            // 7. Obrigações Recentes (Próximas a vencer ou vencidas recentemente)
            prisma.obligation.findMany({
                where: {
                    status: {
                        not: "ENTREGUE"
                    }
                },
                take: 10,
                orderBy: {
                    vencimento: 'asc'
                },
                include: {
                    client: {
                        select: {
                            razaoSocial: true
                        }
                    }
                }
            })
        ]);

        // Formatar resposta para o frontend
        const kpis = [
            { label: "Vencendo Hoje", value: vencendoHoje, icon: "⚠️", color: "var(--orange)" },
            { label: "Atrasadas", value: atrasadas, icon: "🔴", color: "var(--red)" },
            { label: "Entregues", value: entregues, icon: "✅", color: "var(--green)" },
            { label: "Pendentes", value: pendentes, icon: "📋", color: "var(--accent)" },
            { label: "Clientes Ativos", value: clientesAtivos, icon: "🏢", color: "#7c3aed" },
            { label: "Total Obrigações", value: totalObrigacoes, icon: "📊", color: "#06b6d4" },
        ];

        const formattedObligations = recentObligations.map(ob => ({
            id: ob.id,
            clienteNome: ob.client.razaoSocial,
            obrigacao: ob.nome,
            vencimento: ob.vencimento.toISOString(),
            status: ob.vencimento < hoje ? "Atrasada" : ob.status === "PENDENTE" ? "Pendente" : ob.status,
            tipo: ob.esfera
        }));

        return NextResponse.json({
            kpis,
            recentObligations: formattedObligations
        });

    } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}
