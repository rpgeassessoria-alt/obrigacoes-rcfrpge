/**
 * Simulação de um worker que verifica obrigações próximas do vencimento
 * e envia notificações via Evolution API (WhatsApp Não Oficial).
 */
import { evolutionService } from '../services/evolution';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function checkAndSendReminders() {
  console.log("🚀 Iniciando verificação de lembretes WhatsApp...");

  try {
    const today = new Date();
    const inThreeDays = new Date();
    inThreeDays.setDate(today.getDate() + 3);

    // Busca obrigações pendentes que vencem nos próximos 3 dias
    const pendingObligations = await prisma.obligation.findMany({
      where: {
        status: 'PENDENTE',
        vencimento: {
          lte: inThreeDays,
          gte: today,
        }
      },
      include: {
        client: true
      }
    });

    console.log(`📌 Encontradas ${pendingObligations.length} obrigações próximas do vencimento.`);

    for (const ob of pendingObligations) {
      if (ob.client.responsibleId) { // Ou usar um campo de telefone no cliente
        const message = `⚠️ *Lembrete FiscoControl*\n\nPrezada *${ob.client.razaoSocial}*,\n\nA obrigação *${ob.nome}* vence em *${ob.vencimento.toLocaleDateString('pt-BR')}*.\n\nPor favor, envie os documentos pendentes o quanto antes para evitarmos multas. 🚀`;

        // Simulação de número — na vida real viria do cadastro do cliente
        const phone = "5511999999999";

        await evolutionService.sendText(phone, message);
        console.log(`✅ Lembrete enviado para ${ob.client.razaoSocial} via WhatsApp.`);
      }
    }
  } catch (error) {
    console.error("❌ Erro no worker de lembretes:", error);
  }
}
