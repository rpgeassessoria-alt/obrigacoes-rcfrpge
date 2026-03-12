"use client";

import React from 'react';
import { 
    Building, 
    Landmark, 
    Globe2 
} from 'lucide-react';
import MenuCard from '@/components/MenuCard';

export default function ParcelamentosHubPage() {
    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Parcelamentos</h1>
                    <p className="page-sub">Gerencie parcelamentos em diferentes esferas governamentais</p>
                </div>
            </div>

            <div className="menu-grid">
                <MenuCard 
                    title="Parcelamentos Municipais" 
                    icon={Building} 
                    href="/parcelamentos/municipais" 
                />
                <MenuCard 
                    title="Parcelamentos Estaduais" 
                    icon={Landmark} 
                    href="/parcelamentos/estaduais" 
                />
                <MenuCard 
                    title="Parcelamentos Federais" 
                    icon={Globe2} 
                    href="/parcelamentos/federais" 
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
