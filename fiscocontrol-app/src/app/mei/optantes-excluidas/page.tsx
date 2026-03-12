"use client";

import React, { useState } from 'react';
import { CheckCircle, UserMinus, Search } from 'lucide-react';
import axios from 'axios';

export default function OptantesExcluidas() {
    const [cnpj, setCnpj] = useState('');
    const [loading, setLoading] = useState(false);
    const [optanteData, setOptanteData] = useState<any>(null);
    const [error, setError] = useState('');

    const handleConsultar = async () => {
        if (!cnpj || cnpj.length < 14) {
             setError("Digite um CNPJ válido");
             return;
        }

        setLoading(true);
        setError('');
        setOptanteData(null);

        try {
             const res = await axios.get(`/api/integra-contador/mei/optantes?cnpj=${cnpj.replace(/\D/g, '')}`);
             setOptanteData(res.data);
        } catch (err: any) {
             setError(err.response?.data?.message || "Erro ao consultar Situação de Optante/Excluída no Serpro.");
        } finally {
             setLoading(false);
        }
    }

    return (
        <div className="page-content">
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                Home / <span style={{ color: '#3b82f6' }}>VERI MEI</span> / Optantes e Excluídas MEI
            </div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Optantes e Excluídas MEI</h1>
                    <p className="page-sub">Consulta de empresas optantes e excluídas do regime MEI (Integração Serpro)</p>
                </div>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
                <div style={{display: 'flex', gap: 10, alignItems: 'flex-end'}}>
                     <div style={{flex: 1}}>
                         <label style={{display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500}}>CNPJ do MEI</label>
                         <input 
                            type="text" 
                            value={cnpj}
                            onChange={(e) => setCnpj(e.target.value)}
                            placeholder="00.000.000/0000-00"
                            style={{width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-color)'}}
                         />
                     </div>
                     <button className="btn-primary" onClick={handleConsultar} disabled={loading} style={{display: 'flex', alignItems: 'center', gap: 8}}>
                         {loading ? "Consultando..." : <><Search size={18} /> Consultar Serpro</>}
                     </button>
                </div>
                {error && <div style={{padding: 12, background: '#fef2f2', color: '#dc2626', borderRadius: 8, marginTop: 14, fontSize: 14}}>{error}</div>}
            </div>

            {optanteData ? (
                 <div className="card">
                     <div className="card-title" style={{marginBottom: 20}}>Situação da Empresa</div>
                     <pre style={{background: '#1e293b', color: '#e2e8f0', padding: 15, borderRadius: 8, fontSize: 12, overflow: 'auto', maxHeight: 400}}>
                         {JSON.stringify(optanteData, null, 2)}
                     </pre>
                 </div>
            ) : (
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '14px 20px', flex: 1, maxWidth: 220 }}>
                        <CheckCircle size={20} color="#16a34a" />
                        <div>
                            <div style={{ fontSize: 22, fontWeight: 700, color: '#16a34a' }}>-</div>
                            <div style={{ fontSize: 12, fontWeight: 500, color: '#16a34a' }}>Optantes MEI</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
