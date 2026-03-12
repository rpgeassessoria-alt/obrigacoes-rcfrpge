"use client";

import React from 'react';
import { Building } from 'lucide-react';
import MenuCard from '@/components/MenuCard';

export default function ParcelamentosMunicipaisPage() {
    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Parcelamentos Municipais</h1>
                    <p className="page-sub">Controle de débitos junto às prefeituras</p>
                </div>
            </div>

            <div className="menu-grid">
                <MenuCard 
                    title="ISS Parcelamento" 
                    icon={Building} 
                    href="/parcelamentos/municipais/iss" 
                />
                <MenuCard 
                    title="Taxas Municipais" 
                    icon={Building} 
                    href="/parcelamentos/municipais/taxas" 
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
