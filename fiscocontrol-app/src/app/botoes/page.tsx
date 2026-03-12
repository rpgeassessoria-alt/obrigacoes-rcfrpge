"use client";

import React from 'react';
import { 
    Users, 
    ClipboardList, 
    Scale, 
    HardHat, 
    Bell, 
    Calendar, 
    Folder, 
    BarChart3, 
    History, 
    Bot, 
    Users2, 
    Headphones,
    LayoutDashboard,
    PlusCircle,
    FileText,
    Settings
} from 'lucide-react';
import MenuCard from '@/components/MenuCard';

export default function BotoesPage() {
    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Configurações e Atalhos</h1>
                    <p className="page-sub">Acesse rapidamente todas as funcionalidades do sistema</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn-secondary">Exportar Dados</button>
                    <button className="btn-primary flex items-center gap-2">
                        <PlusCircle size={18} />
                        Novo Registro
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                <MenuCard 
                    title="Dashboard Principal" 
                    description="Visão geral de todas as métricas" 
                    icon={LayoutDashboard} 
                    href="/" 
                />
                <MenuCard 
                    title="Gestão de Clientes" 
                    description="Cadastrar e editar clientes" 
                    icon={Users} 
                    href="/clientes" 
                />
                <MenuCard 
                    title="Obrigações Fiscais" 
                    description="Controle de vencimentos e prazos" 
                    icon={ClipboardList} 
                    href="/obrigacoes" 
                    badge="12"
                    badgeVariant="orange"
                />
                <MenuCard 
                    title="Declarações" 
                    description="Status de envio de declarações" 
                    icon={Scale} 
                    href="/declaracoes" 
                />
                <MenuCard 
                    title="Departamento Pessoal" 
                    description="Rotinas previdenciárias e trabalhistas" 
                    icon={HardHat} 
                    href="/dpessoal" 
                />
                <MenuCard 
                    title="Centro de Alertas" 
                    description="Notificações críticas do sistema" 
                    icon={Bell} 
                    href="/alertas" 
                    badge="3"
                    badgeVariant="red"
                />
                <MenuCard 
                    title="Calendário Fiscal" 
                    description="Agenda completa de obrigações" 
                    icon={Calendar} 
                    href="/calendario" 
                />
                <MenuCard 
                    title="Gestão de Documentos" 
                    description="Armazenamento e organização de arquivos" 
                    icon={Folder} 
                    href="/documentos" 
                />
                <MenuCard 
                    title="Relatórios" 
                    description="Análise de produtividade e financeira" 
                    icon={BarChart3} 
                    href="/relatorios" 
                />
                <MenuCard 
                    title="Histórico de Entregas" 
                    description="Protocolos e recibos de envio" 
                    icon={History} 
                    href="/historico" 
                />
                <MenuCard 
                    title="Automação WhatsApp" 
                    description="Envio automático de guias e alertas" 
                    icon={Bot} 
                    href="/automacao" 
                    badge="ON"
                    badgeVariant="green"
                />
                <MenuCard 
                    title="Minha Equipe" 
                    description="Gestão de usuários e permissões" 
                    icon={Users2} 
                    href="/equipe" 
                />
                <MenuCard 
                    title="Suporte Técnico" 
                    description="Fale com nosso time de atendimento" 
                    icon={Headphones} 
                    href="/suporte" 
                />
                <MenuCard 
                    title="Gerador de Documentos" 
                    description="Criar novos documentos a partir de templates" 
                    icon={FileText} 
                    href="/documentos/novo" 
                />
                <MenuCard 
                    title="Configurações" 
                    description="Ajustes de sistema e integrações" 
                    icon={Settings} 
                    href="/configuracoes" 
                />
            </div>

            <style jsx>{`
                .grid {
                    display: grid;
                }
                @media (min-width: 768px) {
                    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                }
                @media (min-width: 1024px) {
                    .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
                }
                @media (min-width: 1280px) {
                    .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
                }
                .gap-6 { gap: 1.5rem; }
                .mt-8 { margin-top: 2rem; }
                .flex { display: flex; }
                .items-center { align-items: center; }
                .gap-2 { gap: 0.5rem; }
            `}</style>
        </div>
    );
}
