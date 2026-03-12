"use client";

import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Search, Download } from 'lucide-react';
import axios from 'axios';

export default function CndFgtsPage() {
    const [cnpj, setCnpj] = useState('');
    const [loading, setLoading] = useState(false);
    const [certData, setCertData] = useState<any>(null);
    const [error, setError] = useState('');

    const handleConsultar = async () => {
        if (!cnpj || cnpj.length < 14) {
             setError("Digite um CNPJ válido");
             return;
        }

        setLoading(true);
        setError('');
        setCertData(null);

        try {
             const res = await axios.get(`/api/integra-contador/certidoes/cnd-fgts?cnpj=${cnpj.replace(/\D/g, '')}`);
             setCertData(res.data);
        } catch (err: any) {
             console.error("Erro na consulta CND FGTS", err);
             setError(err.response?.data?.message || "Erro ao consultar CRF na Caixa Econômica (Serpro).");
        } finally {
             setLoading(false);
        }
    }

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">CND FGTS</h1>
                    <p className="page-sub">Certificado de Regularidade do FGTS — Caixa Econômica Federal</p>
                </div>
            </div>

            <div className="summary-cards">
                <div className="summary-card summary-card--regular">
                    <CheckCircle size={20} />
                    <div>
                        <span className="summary-num">31</span>
                        <span className="summary-label">Regulares (Geral)</span>
                    </div>
                </div>
                <div className="summary-card summary-card--error">
                    <AlertTriangle size={20} />
                    <div>
                        <span className="summary-num">1</span>
                        <span className="summary-label">Irregulares (Geral)</span>
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-title">Consultar CRF Individual</div>
                <div style={{display: 'flex', gap: 10, alignItems: 'flex-end', marginTop: 15}}>
                     <div style={{flex: 1}}>
                         <label style={{display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500}}>CNPJ da Empresa</label>
                         <input 
                            type="text" 
                            value={cnpj}
                            onChange={(e) => setCnpj(e.target.value)}
                            placeholder="00.000.000/0000-00"
                            style={{width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-color)'}}
                         />
                     </div>
                     <button className="btn-primary" onClick={handleConsultar} disabled={loading} style={{display: 'flex', alignItems: 'center', gap: 8}}>
                         {loading ? "Consultando..." : <><Search size={18} /> Emitir CRF (Serpro)</>}
                     </button>
                </div>
                {error && <div style={{padding: 12, background: '#fef2f2', color: '#dc2626', borderRadius: 8, marginTop: 14, fontSize: 14}}>{error}</div>}
            </div>

            {certData ? (
                 <div className="card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
                         <div className="card-title" style={{margin: 0}}>Certidão Obtida</div>
                         <button className="btn-primary" style={{background: '#16a34a', display: 'flex', alignItems: 'center', gap: 8}}>
                            <Download size={18} /> Download PDF
                         </button>
                    </div>
                    <div style={{background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #e2e8f0'}}>
                         <pre style={{background: '#1e293b', color: '#e2e8f0', padding: 15, borderRadius: 8, fontSize: 12, overflow: 'auto', maxHeight: 300}}>
                             {JSON.stringify(certData, null, 2)}
                         </pre>
                    </div>
                 </div>
            ) : (
                <div className="card">
                    <div className="card-title">Histórico / Últimas Emitidas</div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                        Utilize o campo acima para emitir um novo CRF via Integra Contador.
                    </p>
                </div>
            )}

            <style jsx>{`
                .summary-cards { display: flex; gap: 12px; margin-bottom: 20px; }
                .summary-card { display: flex; align-items: center; gap: 10px; background: #fff; border: 1px solid var(--border); border-radius: 10px; padding: 14px 20px; flex: 1; max-width: 220px; }
                .summary-card--regular { color: #16a34a; border-color: #bbf7d0; background: #f0fdf4; }
                .summary-card--error { color: #dc2626; border-color: #fecaca; background: #fef2f2; }
                .summary-num { display: block; font-size: 22px; font-weight: 700; }
                .summary-label { display: block; font-size: 12px; font-weight: 500; }
            `}</style>
        </div>
    );
}
