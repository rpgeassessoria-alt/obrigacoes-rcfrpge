"use client";

import React from 'react';
import {
    FileText,
    TrendingUp,
    DollarSign,
    ClipboardX,
    Users,
    AlertTriangle,
    Layers,
    FileCheck,
    FileClock,
    FileSearch
} from 'lucide-react';
import Link from 'next/link';

interface MeiCard {
    title: string;
    Icon: React.ElementType;
    href: string;
    stats: { label: string; value: number }[];
}

const MEI_CARDS: MeiCard[] = [
    {
        title: 'CCMEI',
        Icon: FileText,
        href: '/mei/ccmei',
        stats: [{ label: 'Disponíveis', value: 0 }],
    },
    {
        title: 'Diagnóstico Fiscal MEI',
        Icon: TrendingUp,
        href: '/mei/diagnostico',
        stats: [
            { label: 'Pendências', value: 0 },
            { label: 'Regulares', value: 0 },
        ],
    },
    {
        title: 'DAS MEI',
        Icon: DollarSign,
        href: '/mei/das',
        stats: [
            { label: 'Pagos', value: 0 },
            { label: 'Não Pagos', value: 0 },
        ],
    },
    {
        title: 'Ausência de Declarações',
        Icon: ClipboardX,
        href: '/mei/ausencia-declaracoes',
        stats: [{ label: 'DASN SIMEI', value: 0 }],
    },
    {
        title: 'Optantes/Excluídas MEI',
        Icon: Users,
        href: '/mei/optantes-excluidas',
        stats: [
            { label: 'Optantes MEI', value: 0 },
            { label: 'Excluídas MEI', value: 1 },
        ],
    },
    {
        title: 'Dívida Ativa MEI',
        Icon: AlertTriangle,
        href: '/mei/divida-ativa',
        stats: [{ label: 'Débitos', value: 0 }],
    },
    {
        title: 'Parcelamento MEI',
        Icon: Layers,
        href: '/mei/parcelamento',
        stats: [
            { label: 'Em andamento', value: 0 },
            { label: 'Encerrados', value: 0 },
        ],
    },
    {
        title: 'Parcelamento Especial MEI',
        Icon: FileCheck,
        href: '/mei/parcelamento-especial',
        stats: [
            { label: 'Em andamento', value: 0 },
            { label: 'Encerrados', value: 0 },
        ],
    },
    {
        title: 'Parcelamento PERT MEI',
        Icon: FileClock,
        href: '/mei/parcelamento-pert',
        stats: [
            { label: 'Em andamento', value: 0 },
            { label: 'Encerrados', value: 0 },
        ],
    },
    {
        title: 'Parcelamento RELP MEI',
        Icon: FileSearch,
        href: '/mei/parcelamento-relp',
        stats: [
            { label: 'Em andamento', value: 0 },
            { label: 'Encerrados', value: 0 },
        ],
    },
];

export default function MeiPage() {
    return (
        <div className="page-content">
            {/* Breadcrumb */}
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>
                <Link href="/" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>Home</Link>
                {' / '}
                <span style={{ color: '#64748b', fontWeight: 600 }}>VERI MEI</span>
            </div>

            <div className="page-header" style={{ marginBottom: 20 }}>
                <div>
                    <h1 className="page-title">VERI MEI</h1>
                    <p className="page-sub">Gestão completa do Microempreendedor Individual</p>
                </div>
            </div>

            <div className="mei-grid">
                {MEI_CARDS.map((card) => (
                    <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
                        <div className="mei-card">
                            <div className="mei-card-header">
                                <card.Icon size={18} className="mei-icon" strokeWidth={2} />
                                <span className="mei-title">{card.title}</span>
                            </div>
                            <div className="mei-stats">
                                {card.stats.map((stat, i) => (
                                    <React.Fragment key={i}>
                                        <span className="mei-stat">
                                            <strong>{stat.value}</strong>{' '}
                                            <span>{stat.label}</span>
                                        </span>
                                        {i < card.stats.length - 1 && (
                                            <span className="mei-sep"> | </span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <style jsx>{`
                .mei-grid {
                    display: grid;
                    grid-template-columns: repeat(1, 1fr);
                    gap: 14px;
                }
                @media (min-width: 768px) {
                    .mei-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (min-width: 1024px) {
                    .mei-grid { grid-template-columns: repeat(4, 1fr); }
                }

                .mei-card {
                    background: #ffffff;
                    border: 1px solid #e8ecf0;
                    border-radius: 12px;
                    padding: 18px 20px 16px;
                    min-height: 90px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.03);
                }
                .mei-card:hover {
                    border-color: #3b82f6;
                    box-shadow: 0 4px 16px rgba(59,130,246,0.1);
                    transform: translateY(-2px);
                }

                .mei-card-header {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                }

                .mei-icon {
                    color: #3b82f6;
                    flex-shrink: 0;
                    margin-top: 1px;
                }

                .mei-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #1e293b;
                    line-height: 1.35;
                    font-family: var(--font);
                }

                .mei-stats {
                    font-size: 12px;
                    color: #3b82f6;
                    font-weight: 500;
                    padding-left: 28px;
                    font-family: var(--font);
                }

                .mei-stat strong {
                    font-weight: 700;
                    color: #2563eb;
                }

                .mei-stat span {
                    color: #3b82f6;
                }

                .mei-sep {
                    color: #cbd5e1;
                    margin: 0 3px;
                }
            `}</style>
        </div>
    );
}
