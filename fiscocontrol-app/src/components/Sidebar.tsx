"use client";

import React, { useState } from 'react';
import {
    Users,
    ClipboardList,
    Scale,
    HardHat,
    Bell,
    Calendar,
    CalendarDays,
    Folder,
    BarChart3,
    History,
    LayoutDashboard,
    Bot,
    Users2,
    Headphones,
    Menu,
    Layers,
    Award,
    ChevronLeft,
    ChevronRight,
    FileText,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface NavItem {
    id: string;
    icon: React.ReactNode;
    label: string;
    badge?: number;
    href: string;
}

export const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

    const navItems: NavItem[] = [
        { id: "dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard", href: "/" },
        { id: "clientes", icon: <Users size={18} />, label: "Clientes", href: "/clientes" },
        { id: "integra-contador", icon: <Scale size={18} />, label: "Integra Contador", href: "/integra-contador" },
        { id: "parcelamentos", icon: <Layers size={18} />, label: "Parcelamentos", href: "/parcelamentos" },
        { id: "certidoes", icon: <Award size={18} />, label: "Certidões e Alvarás", href: "/certidoes" },
        { id: "obrigacoes", icon: <ClipboardList size={18} />, label: "Obrigações", href: "/obrigacoes" },
        { id: "declaracoes", icon: <Scale size={18} />, label: "Declarações (Sintegra)", href: "/declaracoes" },
        { id: "dctfweb", icon: <FileText size={18} />, label: "DCTF Web", href: "/declaracoes/dctfweb" },
        { id: "sicalc", icon: <FileText size={18} />, label: "Emissão DARF", href: "/darfs" },
        { id: "dpessoal", icon: <HardHat size={18} />, label: "D.Pessoal/Prev.", href: "/dpessoal" },
        { id: "alertas", icon: <Bell size={18} />, label: "Caixa Postal", href: "/alertas", badge: 3 },
        { id: "procuracoes", icon: <Users2 size={18} />, label: "Procurações", href: "/procuracoes" },
        { id: "agenda", icon: <CalendarDays size={18} />, label: "Agenda Fiscal", href: "/agenda" },
        { id: "calendario", icon: <Calendar size={18} />, label: "Calendário", href: "/calendario" },
        { id: "documentos", icon: <Folder size={18} />, label: "Documentos", href: "/documentos" },
        { id: "relatorios", icon: <BarChart3 size={18} />, label: "Relatórios", href: "/relatorios" },
        { id: "historico", icon: <History size={18} />, label: "Hist. Entregas", href: "/historico" },
        { id: "botoes", icon: <Menu size={18} />, label: "Atalhos", href: "/botoes" },
        { id: "automacao", icon: <Bot size={18} />, label: "Automação WA", href: "/automacao" },
        { id: "equipe", icon: <Users2 size={18} />, label: "Equipe", href: "/equipe" },
        { id: "suporte", icon: <Headphones size={18} />, label: "Suporte", href: "/suporte" },
    ];

    return (
        <>
            <aside
                style={{
                    width: isOpen ? '265px' : '60px',
                    background: 'var(--bg-sidebar)',
                    borderRight: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    flexShrink: 0,
                    transition: 'width .3s ease',
                    zIndex: 100,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Logo */}
                <div style={{
                    padding: '20px 16px 16px',
                    borderBottom: '1px solid rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    overflow: 'hidden',
                    minHeight: '65px',
                    flexShrink: 0,
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent)',
                        fontWeight: 'bold',
                        fontSize: '18px',
                        flexShrink: 0,
                    }}>
                        R
                    </div>
                    {isOpen && (
                        <span style={{ color: 'white', fontSize: '20px', fontWeight: '800', letterSpacing: '1px', whiteSpace: 'nowrap' }}>
                            R.P.G.E
                        </span>
                    )}
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <div
                                key={item.id}
                                title={!isOpen ? item.label : undefined}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: isOpen ? '12px 16px' : '12px',
                                    justifyContent: isOpen ? 'flex-start' : 'center',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    fontSize: '14px',
                                    fontWeight: isActive ? '600' : '500',
                                    color: 'rgba(255,255,255,0.85)',
                                    background: isActive ? 'rgba(0,0,0,0.25)' : 'transparent',
                                    margin: '2px 4px',
                                    transition: 'all .2s ease',
                                }}
                                onClick={() => router.push(item.href)}
                                onMouseEnter={e => {
                                    if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.1)';
                                    (e.currentTarget as HTMLDivElement).style.color = '#fff';
                                }}
                                onMouseLeave={e => {
                                    if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                                    (e.currentTarget as HTMLDivElement).style.color = 'rgba(255,255,255,0.85)';
                                }}
                            >
                                <span style={{ flexShrink: 0, display: 'flex' }}>{item.icon}</span>
                                {isOpen && <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
                                {isOpen && item.badge && item.badge > 0 && (
                                    <span style={{
                                        marginLeft: 'auto',
                                        background: 'var(--red)',
                                        color: 'white',
                                        fontSize: '10px',
                                        fontWeight: '700',
                                        padding: '1px 6px',
                                        borderRadius: '10px',
                                        flexShrink: 0,
                                    }}>{item.badge}</span>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div style={{
                    padding: '12px 8px',
                    borderTop: '1px solid rgba(255,255,255,0.15)',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        justifyContent: isOpen ? 'flex-start' : 'center',
                    }}>
                        <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            flexShrink: 0,
                            background: 'linear-gradient(135deg, var(--accent), #7c3aed)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: '700',
                            color: 'white',
                        }}>RS</div>
                        {isOpen && (
                            <div>
                                <div style={{ fontSize: '12px', fontWeight: '600', color: 'white', whiteSpace: 'nowrap' }}>Rogério Santana</div>
                                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>Administrador</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Botão de Toggle — fixo na borda direita da sidebar */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    title={isOpen ? 'Ocultar menu' : 'Mostrar menu'}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        right: '-14px',
                        transform: 'translateY(-50%)',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 200,
                        transition: 'all .2s ease',
                        color: '#64748b',
                    }}
                >
                    {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                </button>
            </aside>
        </>
    );
};
