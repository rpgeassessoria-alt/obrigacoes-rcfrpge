import prisma from "@/lib/prisma";
import { AgendaView } from "./ClientView";

export default async function AgendaPage() {
  // Buscar obrigações não entregues (Pendente ou Atrasada)
  const obrigacoes = await prisma.obligation.findMany({
    where: {
      status: { in: ["PENDENTE", "Pendente", "ATRASADA", "Atrasada"] }
    },
    include: {
      client: {
        select: { id: true, razaoSocial: true, regime: true }
      }
    },
    orderBy: {
      vencimento: "asc"
    }
  });

  const clientes = await prisma.client.findMany({
    where: { status: "Ativo" },
    select: { id: true, razaoSocial: true },
    orderBy: { razaoSocial: "asc" }
  });

  return (
    <AgendaView
      initialObrigacoes={obrigacoes}
      clientes={clientes}
    />
  );
}
