"use client";

import React from 'react';
import { 
    Globe2, 
    FileText, 
    FileCheck, 
    ShieldCheck, 
    UserCheck, 
    Calculator
} from 'lucide-react';
import MenuCard from '@/components/MenuCard';

export default function ParcelamentosFederaisPage() {
    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Parcelamentos Federais</h1>
                    <p className="page-sub">Controle de débitos federais, Simples Nacional e PGFN</p>
                </div>
            </div>

            <div className="menu-grid">
                {/* Linha 1 */}
                <MenuCard 
                    title="Parcelamento SN" 
                    icon={FileText} 
                    href="/parcelamentos/federais/sn" 
                />
                <MenuCard 
                    title="Parcelamento Especial SN" 
                    icon={FileCheck} 
                    href="/parcelamentos/federais/especial-sn" 
                    badge="Novo"
                />
                <MenuCard 
                    title="PERT SN" 
                    icon={ShieldCheck} 
                    href="/parcelamentos/federais/pert-sn" 
                />
                <MenuCard 
                    title="RELP SN" 
                    icon={Calculator} 
                    href="/parcelamentos/federais/relp-sn" 
                    badge="Novo"
                />

                {/* Linha 2 */}
                <MenuCard 
                    title="Parcelamento MEI" 
                    icon={UserCheck} 
                    href="/parcelamentos/federais/mei" 
                    badge="Novo"
                />
                <MenuCard 
                    title="Parcelamento Especial MEI" 
                    icon={FileCheck} 
                    href="/parcelamentos/federais/especial-mei" 
                />
                <MenuCard 
                    title="PERT MEI" 
                    icon={ShieldCheck} 
                    href="/parcelamentos/federais/pert-mei" 
                />
                <MenuCard 
                    title="RELP MEI" 
                    icon={Calculator} 
                    href="/parcelamentos/federais/relp-mei" 
                />

                {/* Linha 3 */}
                <MenuCard 
                    title="Parcelamento PGFN Sispar" 
                    icon={Globe2} 
                    href="/parcelamentos/federais/pgfn" 
                    badge="Novo"
                />
            </div>

            <style jsx>{`
                .menu-grid {
                    display: grid;
                    grid-template-columns: repeat(1, 1fr);
                    gap: 0.75rem;
                    margin-top: 2rem;
                }
                @media (min-width: 768px) {
                    .menu-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (min-width: 1024px) {
                    .menu-grid { grid-template-columns: repeat(4, 1fr); }
                }
            `}</style>
        </div>
    );
}
