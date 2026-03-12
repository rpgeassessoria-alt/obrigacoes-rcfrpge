import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { EquipeView } from "./ClientView";

export default async function EquipePage() {
    const session = await getServerSession(authOptions);
    const isMaster = session?.user?.role === "MASTER";

    if (!isMaster && !session?.user?.tenantId) return <div className="p-8">Acesso negado.</div>;

    const tenantId = session?.user?.tenantId;
    const filter: any = isMaster ? {} : { tenantId };

    const [usuarios, clientes, grupos] = await Promise.all([
        prisma.user.findMany({
            where: filter,
            include: {
                clients: { select: { id: true, razaoSocial: true } },
                allowedGroups: { select: { id: true, name: true } }
            },
            orderBy: { name: "asc" }
        }),
        prisma.client.findMany({
            where: filter,
            select: { id: true, razaoSocial: true }
        }),
        prisma.economicGroup.findMany({
            where: filter,
            select: { id: true, name: true },
            orderBy: { name: "asc" }
        })
    ]);

    return (
        <EquipeView
            usuarios={usuarios}
            clientes={clientes}
            gruposEconomicos={grupos}
            tenantId={tenantId as any}
        />
    );
}
