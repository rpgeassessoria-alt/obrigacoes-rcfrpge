import prisma from "@/lib/prisma";
import { DocumentosView } from "./ClientView";

export default async function DocumentosPage() {
  const clientes = await prisma.client.findMany({
    select: { id: true, razaoSocial: true },
    orderBy: { razaoSocial: "asc" }
  });

  return <DocumentosView clientes={clientes} />;
}
