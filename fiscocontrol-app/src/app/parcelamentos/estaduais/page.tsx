"use client";

import React from 'react';
import { Landmark } from 'lucide-react';
import MenuCard from '@/components/MenuCard';

export default function ParcelamentosEstaduaisPage() {
    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Parcelamentos Estaduais</h1>
                    <p className="page-sub">Controle de débitos junto às secretarias estaduais</p>
                </div>
            </div>

            <div className="menu-grid">
                <MenuCard 
                    title="ICMS Parcelamento" 
                    icon={Landmark} 
                    href="/parcelamentos/estaduais/icms" 
                    badge="Novo"
                />
                <MenuCard 
                    title="IPVA Parcelamento" 
                    icon={Landmark} 
                    href="/parcelamentos/estaduais/ipva" 
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
