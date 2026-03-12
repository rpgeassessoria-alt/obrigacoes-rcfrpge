"use client";

import React, { useState } from 'react';
import {
    CheckCircle,
    AlertTriangle,
    Info,
    XCircle,
    FileText,
    RefreshCw,
    Download,
    ChevronDown,
    Clock,
    BarChart3
} from 'lucide-react';

const COMPANIES = [
    { name: 'RETRO-POSTOS DE ABASTECIMENTO LTDA', cnpj: '33404894000177', regime: 'NORMAL' },
];

interface AnalysisItem {
    label: string;
    status: 'regular' | 'irregular' | 'no-prazo' | 'indisponivel';
    dueDate?: string;
    badge?: string;
}

interface SectionGroup {
    title: string;
    color: string;
    items: AnalysisItem[];
}

const ANALYSIS_DATA: SectionGroup[] = [
    {
        title: 'Situação Fiscal',
        color: '#3b82f6',
        items: [
            { label: 'Diagnóstico Fiscal', status: 'irregular' },
            { label: 'Ausência ECF', status: 'regular' },
            { label: 'Ausência DCTF WEB', status: 'regular' },
            { label: 'Ausência DCTF', status: 'regular' },
            { label: 'Ausência PGDAS', status: 'regular' },
            { label: 'Ausência DEFIS', status: 'regular' },
            { label: 'Ausência EFD', status: 'regular' },
            { label: 'Ausência DRF', status: 'regular' },
        ],
    },
    {
        title: 'Obrigações Fiscais',
        color: '#3b82f6',
        items: [
            { label: 'DCTF Web Transmissão', status: 'no-prazo', dueDate: '10/2025' },
            { label: 'DARF', status: 'no-prazo', dueDate: '11/2024' },
        ],
    },
    {
        title: 'Certidões Negativas',
        color: '#3b82f6',
        items: [
            { label: 'CND Estadual', status: 'regular', dueDate: '01/04/2025', badge: 'SP' },
            { label: 'CND Municipal', status: 'regular', dueDate: '26/03/2029', badge: 'SP' },
            { label: 'CND PGFN', status: 'irregular' },
            { label: 'CND Caixa', status: 'regular', dueDate: '07/04/2030' },
            { label: 'CND Trabalhista', status: 'regular', dueDate: '08/08/2029' },
        ],
    },
];

const TABS = [
    'Health Score Fiscal',
    'Pré-Análise Veri',
    'Pós-Análise Vera',
    'Simulador Tributário Veri',
    'Diagnóstico Veri',
];

const StatusBadge: React.FC<{ status: AnalysisItem['status'] }> = ({ status }) => {
    const map = {
        regular:      { label: 'Regular',      bg: '#dcfce7', color: '#16a34a', border: '#86efac' },
        irregular:    { label: 'Irregular',     bg: '#fee2e2', color: '#dc2626', border: '#fca5a5' },
        'no-prazo':   { label: 'No Prazo',      bg: '#eff6ff', color: '#2563eb', border: '#93c5fd' },
        indisponivel: { label: 'Indisponível',  bg: '#f3f4f6', color: '#6b7280', border: '#d1d5db' },
    };
    const s = map[status];
    return (
        <span style={{
            background: s.bg, color: s.color, border: `1px solid ${s.border}`,
            padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
        }}>{s.label}</span>
    );
};

import axios from 'axios';

// Gauge SVG
const ScoreGauge: React.FC<{ score: number; loading?: boolean }> = ({ score, loading }) => {
    const radius = 60;
    const circumference = Math.PI * radius;
    const progress = (score / 100) * circumference;
    const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <svg width="160" height="90" viewBox="0 0 160 90">
                <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="#e5e7eb" strokeWidth="12" strokeLinecap="round" />
                <path
                    d="M 20 80 A 60 60 0 0 1 140 80"
                    fill="none"
                    stroke={color}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${progress} ${circumference}`}
                />
            </svg>
            <div style={{ marginTop: -72, textAlign: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#1e293b' }}>
                    {loading ? '...' : score}
                </div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>de 100</div>
            </div>
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>❤️ Health Score Fiscal</span>
                <span style={{ background: color === '#22c55e' ? '#dcfce7' : color === '#f59e0b' ? '#fef3c7' : '#fee2e2', color: color === '#22c55e' ? '#16a34a' : color === '#f59e0b' ? '#d97706' : '#dc2626', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 12 }}>
                    {score >= 70 ? 'Baixo Risco' : score >= 40 ? 'Médio Risco' : 'Alto Risco'}
                </span>
            </div>
        </div>
    );
};

export default function RaioXFiscalPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [selectedCompany] = useState(COMPANIES[0]);
    const [realScoreData, setRealScoreData] = useState<any>(null);
    const [loadingScore, setLoadingScore] = useState(false);

    React.useEffect(() => {
        const fetchScore = async () => {
            setLoadingScore(true);
            try {
                // Fetch validando todos os pilares (CCMEI, CND, etc)
                const res = await axios.get(`/api/integra-contador/raiox/score?cnpj=${selectedCompany.cnpj}`);
                setRealScoreData(res.data);
            } catch (err) {
                console.error("Erro ao buscar Score Fiscal", err);
            } finally {
                setLoadingScore(false);
            }
        }
        fetchScore();
    }, [selectedCompany.cnpj]);

    const regulares   = ANALYSIS_DATA.flatMap(g => g.items).filter(i => i.status === 'regular').length;
    const irregulares = ANALYSIS_DATA.flatMap(g => g.items).filter(i => i.status === 'irregular').length;
    const indisp      = ANALYSIS_DATA.flatMap(g => g.items).filter(i => i.status === 'indisponivel').length;
    const total       = ANALYSIS_DATA.flatMap(g => g.items).length;
    
    // Fallback para o visual mockado caso a API falhe ou carregue
    const displayScore = realScoreData ? realScoreData.score : Math.round((regulares / total) * 100);

    return (
        <div className="page-content" style={{ maxWidth: '100%' }}>
            {/* Breadcrumb */}
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                Home / <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Raio-X Fiscal</span>
            </div>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1e293b' }}>Health Score Fiscal</h1>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
                {TABS.map((tab, i) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(i)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: 8,
                            border: '1px solid',
                            borderColor: activeTab === i ? '#3b82f6' : '#e2e8f0',
                            background: activeTab === i ? '#3b82f6' : '#ffffff',
                            color: activeTab === i ? '#ffffff' : '#64748b',
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all .2s',
                            fontFamily: 'var(--font)',
                        }}
                    >{tab}</button>
                ))}
            </div>

            {/* Company Selector */}
            <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Empresa:</label>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    padding: '10px 14px',
                    cursor: 'pointer',
                }}>
                    <span style={{ fontSize: 13, color: '#1e293b', fontWeight: 500 }}>
                        {selectedCompany.name} – CNPJ {selectedCompany.cnpj}
                    </span>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <ChevronDown size={16} color="#94a3b8" />
                        <XCircle size={16} color="#94a3b8" />
                    </div>
                </div>
            </div>

            {/* Company Card */}
            <div style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                borderRadius: 12,
                padding: '16px 20px',
                marginBottom: 24,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
            }}>
                <div style={{
                    width: 40, height: 40, borderRadius: 8,
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, fontWeight: 800,
                }}>R</div>
                <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{selectedCompany.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>{selectedCompany.cnpj}</div>
                    <div style={{
                        marginTop: 6, background: 'rgba(255,255,255,0.2)',
                        display: 'inline-block', padding: '2px 10px',
                        borderRadius: 12, fontSize: 11, fontWeight: 700,
                    }}>⬤ {selectedCompany.regime}</div>
                </div>
            </div>

            {/* Score + Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '220px 1fr',
                gap: 24,
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '24px',
                marginBottom: 24,
                alignItems: 'center',
            }}>
                <ScoreGauge score={displayScore} loading={loadingScore} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                        { icon: <CheckCircle size={18} color="#16a34a" />, label: 'Regulares',           value: regulares,   color: '#16a34a' },
                        { icon: <Info size={18} color="#94a3b8" />,         label: 'Indisponíveis',       value: indisp,      color: '#6b7280' },
                        { icon: <AlertTriangle size={18} color="#f59e0b" />,label: 'Pendências',          value: irregulares, color: '#d97706' },
                        { icon: <BarChart3 size={18} color="#3b82f6" />,    label: 'Total Itens Analisados', value: total,   color: '#1e293b' },
                    ].map(stat => (
                        <div key={stat.label} style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            background: '#f8fafc', borderRadius: 10, padding: '14px 16px',
                        }}>
                            {stat.icon}
                            <div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Analysis Table */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
                {/* Table Header */}
                <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 200px 160px',
                    background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
                    padding: '10px 20px', gap: 12,
                }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Tipo</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Situação</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Ação</span>
                </div>

                {ANALYSIS_DATA.map((group, gi) => (
                    <React.Fragment key={gi}>
                        {/* Group Header */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            background: '#3b82f6', padding: '10px 20px',
                        }}>
                            <FileText size={15} color="#fff" />
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{group.title}</span>
                        </div>

                        {/* Group Items */}
                        {group.items.map((item, ii) => (
                            <div key={ii} style={{
                                display: 'grid', gridTemplateColumns: '1fr 200px 160px',
                                padding: '12px 20px', gap: 12,
                                borderBottom: '1px solid #f1f5f9',
                                alignItems: 'center',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {item.status === 'regular'   && <CheckCircle size={14} color="#16a34a" />}
                                    {item.status === 'irregular' && <AlertTriangle size={14} color="#dc2626" />}
                                    {item.status === 'no-prazo'  && <Clock size={14} color="#3b82f6" />}
                                    {item.status === 'indisponivel' && <Info size={14} color="#94a3b8" />}
                                    <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{item.label}</span>
                                    {item.badge && (
                                        <span style={{
                                            background: '#eff6ff', color: '#2563eb',
                                            fontSize: 10, fontWeight: 700,
                                            padding: '1px 6px', borderRadius: 4,
                                        }}>{item.badge}</span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <StatusBadge status={item.status} />
                                    {item.dueDate && (
                                        <span style={{
                                            background: '#f1f5f9', color: '#64748b',
                                            fontSize: 10, fontWeight: 600,
                                            padding: '2px 7px', borderRadius: 4,
                                        }}>📅 {item.dueDate}</span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {item.status === 'indisponivel' ? (
                                        <span style={{ fontSize: 12, color: '#94a3b8' }}>Sem ação disponível</span>
                                    ) : (
                                        <>
                                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', display: 'flex', alignItems: 'center' }}>
                                                <Download size={15} />
                                            </button>
                                            {item.status !== 'irregular' && (
                                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                                                    <RefreshCw size={15} />
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
