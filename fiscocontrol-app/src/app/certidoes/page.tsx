"use client";

import React from 'react';
import {
    Award,
    Briefcase,
    Building2,
    ClipboardCheck,
    FileCheck2,
    Flame,
    Fuel,
    MapPin,
    ShieldCheck,
    Stethoscope,
    Truck
} from 'lucide-react';
import MenuCard from '@/components/MenuCard';

export default function CertidoesPage() {
    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Certidões, Alvarás e Licenças</h1>
                    <p className="page-sub">Gerencie certidões negativas, alvarás e licenças de funcionamento</p>
                </div>
                <a href="/certidoes/relatorio" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' }}>
                    Relatório Unificado de Certidões
                </a>
            </div>

            <div className="menu-grid">
                {/* CNDs */}
                <MenuCard
                    title="CND Estadual"
                    icon={Building2}
                    href="/certidoes/cnd-estadual"
                />
                <MenuCard
                    title="CND Trabalhista"
                    icon={Briefcase}
                    href="/certidoes/cnd-trabalhista"
                />
                <MenuCard
                    title="CND FGTS"
                    icon={ShieldCheck}
                    href="/certidoes/cnd-fgts"
                />
                <MenuCard
                    title="CND RFB/PGFN"
                    icon={Award}
                    href="/certidoes/cnd-rfb-pgfn"
                />
                <MenuCard
                    title="CND Municipal"
                    icon={MapPin}
                    href="/certidoes/cnd-municipal"
                />

                {/* Alvarás e Licenças */}
                <MenuCard
                    title="Alvará Sanitário"
                    icon={Stethoscope}
                    href="/certidoes/alvara-sanitario"
                />
                <MenuCard
                    title="Uso de Solo"
                    icon={MapPin}
                    href="/certidoes/uso-de-solo"
                />
                <MenuCard
                    title="Alvará de Localização e Funcionamento"
                    icon={ClipboardCheck}
                    href="/certidoes/alvara-localizacao"
                />
                <MenuCard
                    title="Cercom (Bombeiros)"
                    icon={Flame}
                    href="/certidoes/cercom"
                />
                <MenuCard
                    title="ANP"
                    icon={Fuel}
                    href="/certidoes/anp"
                />
                <MenuCard
                    title="ANTT"
                    icon={Truck}
                    href="/certidoes/antt"
                />
            </div>

            <style jsx>{`
                .menu-grid {
                    display: grid;
                    grid-template-columns: repeat(1, 1fr);
                    gap: 0.75rem;
                    margin-top: 1rem;
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
