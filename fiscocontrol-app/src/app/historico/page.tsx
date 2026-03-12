import prisma from "@/lib/prisma";
import { HistoricoView } from "./ClientView";

export default async function HistoricoPage() {
  const entregas = await prisma.obligation.findMany({
    where: {
      status: { in: ["ENTREGUE", "Entregue"] }
    },
    include: {
      client: {
        select: { id: true, razaoSocial: true }
      }
    },
    orderBy: { updatedAt: "desc" }
  });

  const clientes = await prisma.client.findMany({
    where: { status: "Ativo" },
    select: { id: true, razaoSocial: true },
    orderBy: { razaoSocial: "asc" }
  });

  return <HistoricoView initialEntregas={entregas} clientes={clientes} />;
}
