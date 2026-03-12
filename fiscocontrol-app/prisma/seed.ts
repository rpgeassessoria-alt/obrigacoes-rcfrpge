/**
 * Script de Seed (Migração de Dados)
 * Popula o banco de dados com:
 *  1. Usuários iniciais (admin, contadores, assistentes)
 *  2. Clientes (ex-mock)
 *  3. Obrigações geradas automaticamente pelo regime tributário
 *
 * Executar: npx ts-node prisma/seed.ts
 * Ou adicione "seed" no package.json:
 *   "prisma": { "seed": "ts-node prisma/seed.ts" }
 * E rode: npx prisma db seed
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient();


// ── Catálogo de obrigações por regime ─────────────────────────────────────────
const OBRIGACOES_POR_REGIME: Record<string, { id: string; nome: string; esfera: string; dia: number; mes: number }[]> = {
    SIMPLES_NACIONAL: [
        { id: "PGDAS-D", nome: "PGDAS-D — Apuração Mensal Simples Nacional", esfera: "Federal", dia: 20, mes: -1 },
        { id: "DEFIS", nome: "DEFIS — Informações Socioeconômicas e Fiscais", esfera: "Federal", dia: 31, mes: 2 },
        { id: "DeSTDA", nome: "DeSTDA — ST, Difal e Antecipação", esfera: "Estadual", dia: 20, mes: -1 },
        { id: "NFS-e", nome: "NFS-e — Nota Fiscal de Serviços Eletrônica", esfera: "Municipal", dia: 10, mes: -1 },
        { id: "DMS", nome: "DMS — Declaração Mensal de Serviços", esfera: "Municipal", dia: 10, mes: -1 },
        { id: "eSocial", nome: "eSocial — Obrigações Trabalhistas", esfera: "Federal", dia: 7, mes: -1 },
        { id: "EFD-Reinf", nome: "EFD-Reinf — Retenções e Informações Fiscais", esfera: "Federal", dia: 15, mes: -1 },
        { id: "ISSRetido", nome: "Declaração de ISS Retido na Fonte", esfera: "Municipal", dia: 10, mes: -1 },
    ],
    LUCRO_PRESUMIDO: [
        { id: "ECD", nome: "ECD — Escrituração Contábil Digital", esfera: "Federal", dia: 31, mes: 5 },
        { id: "ECF", nome: "ECF — Escrituração Contábil Fiscal", esfera: "Federal", dia: 31, mes: 7 },
        { id: "EFD-Contrib", nome: "EFD-Contribuições (PIS/COFINS)", esfera: "Federal", dia: 13, mes: -1 },
        { id: "DCTF", nome: "DCTF — Débitos e Créditos Tributários", esfera: "Federal", dia: 25, mes: -1 },
        { id: "DCTFWeb", nome: "DCTFWeb — Versão Digital", esfera: "Federal", dia: 15, mes: -1 },
        { id: "EFD-Reinf", nome: "EFD-Reinf", esfera: "Federal", dia: 15, mes: -1 },
        { id: "eSocial", nome: "eSocial", esfera: "Federal", dia: 7, mes: -1 },
        { id: "DIRF", nome: "DIRF — Imposto de Renda Retido na Fonte", esfera: "Federal", dia: 28, mes: 1 },
        { id: "NFS-e", nome: "NFS-e", esfera: "Municipal", dia: 10, mes: -1 },
        { id: "GIA", nome: "GIA — Guia de Informação e Apuração do ICMS", esfera: "Estadual", dia: 10, mes: -1 },
        { id: "EFD-ICMS", nome: "EFD ICMS/IPI — SPED Fiscal", esfera: "Estadual", dia: 15, mes: -1 },
        { id: "DMS", nome: "DMS — Declaração Mensal de Serviços", esfera: "Municipal", dia: 10, mes: -1 },
        { id: "ISSRetido", nome: "ISS Retido na Fonte", esfera: "Municipal", dia: 10, mes: -1 },
        { id: "DCTFWebPrev", nome: "DCTFWeb Previdenciária", esfera: "Federal", dia: 15, mes: -1 },
    ],
    LUCRO_REAL: [
        { id: "ECD", nome: "ECD — Escrituração Contábil Digital", esfera: "Federal", dia: 31, mes: 5 },
        { id: "ECF", nome: "ECF — Escrituração Contábil Fiscal", esfera: "Federal", dia: 31, mes: 7 },
        { id: "EFD-Contrib", nome: "EFD-Contribuições (PIS/COFINS)", esfera: "Federal", dia: 13, mes: -1 },
        { id: "EFD-ICMS", nome: "EFD ICMS/IPI — SPED Fiscal", esfera: "Estadual", dia: 15, mes: -1 },
        { id: "DCTF", nome: "DCTF", esfera: "Federal", dia: 25, mes: -1 },
        { id: "DCTFWeb", nome: "DCTFWeb", esfera: "Federal", dia: 15, mes: -1 },
        { id: "eSocial", nome: "eSocial", esfera: "Federal", dia: 7, mes: -1 },
        { id: "EFD-Reinf", nome: "EFD-Reinf", esfera: "Federal", dia: 15, mes: -1 },
        { id: "DIRF", nome: "DIRF", esfera: "Federal", dia: 28, mes: 1 },
        { id: "NFS-e", nome: "NFS-e", esfera: "Municipal", dia: 10, mes: -1 },
        { id: "GIA", nome: "GIA", esfera: "Estadual", dia: 10, mes: -1 },
        { id: "GIA-ST", nome: "GIA-ST — Substituição Tributária", esfera: "Estadual", dia: 10, mes: -1 },
        { id: "CIAP", nome: "CIAP — Crédito de ICMS do Ativo Permanente", esfera: "Estadual", dia: 15, mes: -1 },
        { id: "ISSRetido", nome: "ISS Retido na Fonte", esfera: "Municipal", dia: 10, mes: -1 },
        { id: "DCTFWebPrev", nome: "DCTFWeb Previdenciária", esfera: "Federal", dia: 15, mes: -1 },
    ],
    MEI: [
        { id: "DASN-SIMEI", nome: "DASN-SIMEI — Declaração Anual do MEI", esfera: "Federal", dia: 31, mes: 4 },
        { id: "NFS-e", nome: "NFS-e", esfera: "Municipal", dia: 10, mes: -1 },
        { id: "eSocial", nome: "eSocial", esfera: "Federal", dia: 7, mes: -1 },
    ],
};

function calcularVencimento(dia: number, mes: number): Date {
    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth();

    if (mes === -1) {
        // próximo mês
        return new Date(anoAtual, mesAtual + 1, dia);
    } else {
        // mês fixo: se já passou neste ano, empurra para o próximo
        const ano = mes < mesAtual ? anoAtual + 1 : anoAtual;
        return new Date(ano, mes, dia);
    }
}

async function main() {
    console.log("🌱 Iniciando seed do banco de dados (Modo Multi-tenant)...");

    // ── 0. Tenant (Escritório) ──────────────────────────────────────────────────
    const tenant = await prisma.tenant.upsert({
        where: { slug: "matriz" },
        update: {},
        create: {
            name: "FiscoControl Matriz",
            slug: "matriz",
        },
    });

    // ── 1. Grupos Econômicos ────────────────────────────────────────────────────
    const grupoA = await prisma.economicGroup.upsert({
        where: { id: "grupo-a" },
        update: {},
        create: {
            id: "grupo-a",
            name: "Grupo Alfa (Holding)",
            tenantId: tenant.id
        }
    });

    const grupoB = await prisma.economicGroup.upsert({
        where: { id: "grupo-b" },
        update: {},
        create: {
            id: "grupo-b",
            name: "Grupo Beta (Serviços)",
            tenantId: tenant.id
        }
    });

    // ── 2. Usuários ────────────────────────────────────────────────────────────
    const senha = await bcrypt.hash("Admin@123", 12);

    // USUÁRIO MASTER (GLOBAL)
    const masterUser = await prisma.user.upsert({
        where: { email: "master@fiscocontrol.com.br" },
        update: { tenantId: null, role: "MASTER" },
        create: {
            name: "Master Administrativo",
            email: "master@fiscocontrol.com.br",
            password: senha,
            role: "MASTER",
            cargo: "Diretor de TI",
            telefone: "(11) 99999-0000",
            active: true,
            tenantId: null // Acesso total/global
        }
    });

    const adminUser = await prisma.user.upsert({
        where: { email: "admin@fiscocontrol.com.br" },
        update: { tenantId: tenant.id },
        create: {
            name: "Rogério Santana",
            email: "admin@fiscocontrol.com.br",
            password: senha,
            role: "ADMINISTRADOR",
            cargo: "Sócio-Contador",
            telefone: "(11) 99999-0001",
            active: true,
            tenantId: tenant.id
        },
    });

    const contador1 = await prisma.user.upsert({
        where: { email: "carlos@fiscocontrol.com.br" },
        update: {
            tenantId: tenant.id,
            allowedGroups: { connect: [{ id: grupoA.id }] }
        },
        create: {
            name: "Carlos Souza",
            email: "carlos@fiscocontrol.com.br",
            password: await bcrypt.hash("Fiscal@123", 12),
            role: "CONTADOR",
            cargo: "Contador Sênior",
            telefone: "(11) 99999-0002",
            active: true,
            tenantId: tenant.id,
            allowedGroups: { connect: [{ id: grupoA.id }] }
        },
    });

    const assistente = await prisma.user.upsert({
        where: { email: "pedro@fiscocontrol.com.br" },
        update: {
            tenantId: tenant.id,
            allowedGroups: { connect: [{ id: grupoB.id }] }
        },
        create: {
            name: "Pedro Costa",
            email: "pedro@fiscocontrol.com.br",
            password: await bcrypt.hash("Pedro@123", 12),
            role: "ASSISTENTE",
            cargo: "Assistente Fiscal",
            telefone: "(11) 99999-0003",
            active: true,
            tenantId: tenant.id,
            allowedGroups: { connect: [{ id: grupoB.id }] }
        },
    });

    console.log(`✅ ${3} usuários criados/atualizados e vinculados ao Tenant.`);

    // ── 3. Clientes ───────────────────────────────────────────────────────────
    const clientesMock = [
        { razaoSocial: "Tech Solutions Ltda", cnpj: "12345678000190", regime: "LUCRO_REAL", cnae: "6201-5/01", responsibleId: adminUser.id, status: "Ativo", risco: "Alto", groupId: grupoA.id },
        { razaoSocial: "Padaria Pão Quente ME", cnpj: "98765432000110", regime: "SIMPLES_NACIONAL", cnae: "1091-1/01", responsibleId: contador1.id, status: "Ativo", risco: "Baixo", groupId: grupoA.id },
        { razaoSocial: "Consultoria ABC S/A", cnpj: "11222333000144", regime: "LUCRO_PRESUMIDO", cnae: "7020-4/00", responsibleId: adminUser.id, status: "Ativo", risco: "Médio", groupId: grupoB.id },
        { razaoSocial: "Indústria Metalúrgica XYZ", cnpj: "44555666000177", regime: "LUCRO_REAL", cnae: "2512-8/00", responsibleId: assistente.id, status: "Ativo", risco: "Alto", groupId: grupoB.id },
        { razaoSocial: "Farmácia Saúde Total", cnpj: "55666777000188", regime: "LUCRO_PRESUMIDO", cnae: "4771-7/01", responsibleId: contador1.id, status: "Suspenso", risco: "Médio", groupId: grupoA.id },
    ];

    let totalObrigacoes = 0;

    for (const mock of clientesMock) {
        const client = await prisma.client.upsert({
            where: { cnpj: mock.cnpj },
            update: {
                tenantId: tenant.id,
                economicGroupId: mock.groupId
            },
            create: {
                razaoSocial: mock.razaoSocial,
                cnpj: mock.cnpj,
                regime: mock.regime,
                cnae: mock.cnae,
                responsibleId: mock.responsibleId,
                status: mock.status,
                risco: mock.risco,
                tenantId: tenant.id,
                economicGroupId: mock.groupId
            },
        });

        // ── 4. Gerar obrigações para o cliente ────────────────────────────────────
        const obrigacoes = OBRIGACOES_POR_REGIME[mock.regime] || [];
        const mesAtual = new Date().getMonth() + 1;
        const anoAtual = new Date().getFullYear();
        const competencia = `${String(mesAtual).padStart(2, "0")}/${anoAtual}`;

        for (const ob of obrigacoes) {
            const vencimento = calcularVencimento(ob.dia, ob.mes);
            const hoje = new Date();
            const status: string = vencimento < hoje ? "ATRASADA" : "PENDENTE";

            await prisma.obligation.upsert({
                where: {
                    id: `${client.id}-${ob.id}-${competencia}`.substring(0, 25),
                },
                update: {},
                create: {
                    id: `${client.id}-${ob.id}-${competencia}`.substring(0, 25),
                    nome: ob.nome,
                    identifier: ob.id,
                    competencia,
                    vencimento,
                    status,
                    esfera: ob.esfera,
                    clientId: client.id,
                },
            });
            totalObrigacoes++;
        }

        console.log(`  📌 ${mock.razaoSocial} (Grupo: ${mock.groupId}): ${obrigacoes.length} obrigações geradas.`);
    }

    console.log(`\n   🔑 Login admin: admin@fiscocontrol.com.br / Admin@123`);
}

main()
    .catch((e) => {
        console.error("❌ Erro no seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
