import prisma from "@/lib/prisma";
import { CalendarioView } from "./ClientView";

export default async function CalendarioPage() {
  const obrigacoes = await prisma.obligation.findMany({
    include: {
      client: {
        select: { id: true, razaoSocial: true }
      }
    }
  });

  return (
    <CalendarioView initialObrigacoes={obrigacoes} />
  );
}
