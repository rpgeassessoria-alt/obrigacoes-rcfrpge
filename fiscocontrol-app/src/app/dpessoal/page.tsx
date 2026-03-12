import prisma from "@/lib/prisma";
import { DPessoalView } from "./ClientView";

export default async function DPessoalPage() {
  const clientes = await prisma.client.findMany({
    select: { id: true, razaoSocial: true, regime: true, status: true },
    orderBy: { razaoSocial: "asc" }
  });

  return <DPessoalView clientes={clientes} />;
}
