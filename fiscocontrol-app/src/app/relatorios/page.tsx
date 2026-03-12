import prisma from "@/lib/prisma";
import { RelatoriosView } from "./ClientView";

export default async function RelatoriosPage() {
  const [clientes, obrigacoes] = await Promise.all([
    prisma.client.findMany({
      select: { id: true, razaoSocial: true, regime: true, status: true },
      orderBy: { razaoSocial: "asc" }
    }),
    prisma.obligation.findMany({
      select: { id: true, clientId: true, status: true, esfera: true }
    })
  ]);

  return <RelatoriosView clientes={clientes} obrigacoes={obrigacoes} />;
}
