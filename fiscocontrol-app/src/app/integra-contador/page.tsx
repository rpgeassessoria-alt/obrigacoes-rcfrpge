"use client";

import React from 'react';
import { 
    Signature, 
    BarChart3, 
    MessageSquare, 
    Building2, 
    Layers, 
    Search, 
    Calendar, 
    Folder, 
    Award, 
    User, 
    Repeat, 
    UserCheck, 
    ClipboardList, 
    Calculator
} from 'lucide-react';
import MenuCard from '@/components/MenuCard';

export default function IntegraContadorPage() {
    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Integra Contador</h1>
                    <p className="page-sub">Soluções integradas para facilitar sua rotina contábil</p>
                </div>
            </div>

            <div className="menu-grid">
                {/* Linha 1 */}
                <MenuCard 
                    title="Sign & Asaas" 
                    icon={Signature} 
                    href="/verisign" 
                />
                <MenuCard 
                    title="R.P.G.E BI" 
                    icon={BarChart3} 
                    href="/veribi" 
                    badge="Novo" 
                />
                <MenuCard 
                    title="Mensagens" 
                    icon={MessageSquare} 
                    href="/mensagens" 
                />
                <MenuCard 
                    title="Dashboard Federal" 
                    icon={Building2} 
                    href="/dashboard-federal" 
                    badge="Novo" 
                />

                {/* Linha 2 */}
                <MenuCard 
                    title="Parcelamentos" 
                    icon={Layers} 
                    href="/parcelamentos" 
                />
                <MenuCard 
                    title="Raio-X Fiscal" 
                    icon={Search} 
                    href="/raiox" 
                    badge="Novo" 
                />
                <MenuCard 
                    title="Agenda" 
                    icon={Calendar} 
                    href="/agenda" 
                    badge="Novo" 
                />
                <MenuCard 
                    title="Gerenciador de Arquivos" 
                    icon={Folder} 
                    href="/documentos" 
                />

                {/* Linha 3 */}
                <MenuCard 
                    title="Certidões e Alvarás" 
                    icon={Award} 
                    href="/certidoes" 
                />
                <MenuCard 
                    title="Dashboard Pessoa Física" 
                    icon={User} 
                    href="/pf" 
                />
                <MenuCard 
                    title="Rotinas Automáticas" 
                    icon={Repeat} 
                    href="/automacao" 
                />
                <MenuCard 
                    title="R.P.G.E MEI" 
                    icon={UserCheck} 
                    href="/mei" 
                />

                {/* Linha 4 */}
                <MenuCard 
                    title="Processos e Tarefas" 
                    icon={ClipboardList} 
                    href="/processos" 
                />
                <MenuCard 
                    title="Simulador Tributário R.P.G.E" 
                    icon={Calculator} 
                    href="/simulador" 
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
