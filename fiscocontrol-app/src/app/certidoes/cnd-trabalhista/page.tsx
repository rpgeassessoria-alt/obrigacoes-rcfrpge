"use client";

import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export default function CndTrabalhistaPage() {
    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">CND Trabalhista</h1>
                    <p className="page-sub">Certidão Negativa de Débitos Trabalhistas (CNDT) — Tribunal Superior do Trabalho</p>
                </div>
                <button className="btn-primary">Nova Consulta</button>
            </div>

            <div className="summary-cards">
                <div className="summary-card summary-card--regular">
                    <CheckCircle size={20} />
                    <div>
                        <span className="summary-num">38</span>
                        <span className="summary-label">Regulares</span>
                    </div>
                </div>
                <div className="summary-card summary-card--alert">
                    <AlertTriangle size={20} />
                    <div>
                        <span className="summary-num">0</span>
                        <span className="summary-label">Irregulares</span>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-title">Certidões Cadastradas</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    Nenhuma certidão cadastrada ainda. Clique em "Nova Consulta" para adicionar.
                </p>
            </div>

            <style jsx>{`
                .summary-cards { display: flex; gap: 12px; margin-bottom: 20px; }
                .summary-card { display: flex; align-items: center; gap: 10px; background: #fff; border: 1px solid var(--border); border-radius: 10px; padding: 14px 20px; flex: 1; max-width: 220px; }
                .summary-card--regular { color: #16a34a; border-color: #bbf7d0; background: #f0fdf4; }
                .summary-card--alert { color: #d97706; border-color: #fde68a; background: #fffbeb; }
                .summary-num { display: block; font-size: 22px; font-weight: 700; }
                .summary-label { display: block; font-size: 12px; font-weight: 500; }
            `}</style>
        </div>
    );
}
