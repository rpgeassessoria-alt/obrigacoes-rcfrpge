"use client";

import React, { useState } from 'react';
import { AlertTriangle, Search, FileText } from 'lucide-react';
import axios from 'axios';

export default function DividaAtivaMeiPage() {
    const [cnpj, setCnpj] = useState('');
    const [loading, setLoading] = useState(false);
    const [dividaData, setDividaData] = useState<any>(null);
    const [error, setError] = useState('');

    const handleConsultar = async () => {
        if (!cnpj || cnpj.length < 14) {
             setError("Digite um CNPJ válido");
             return;
        }

        setLoading(true);
        setError('');
        setDividaData(null);

        try {
             // Chama nosso proxy interno que abstrai a API do Serpro
             const res = await axios.get(`/api/integra-contador/mei/divida?cnpj=${cnpj.replace(/\D/g, '')}`);
             setDividaData(res.data);
        } catch (err: any) {
             setError(err.response?.data?.message || "Erro ao consultar Dívida Ativa no Serpro.");
        } finally {
             setLoading(false);
        }
    }

    return (
        <div className="page-content">
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                Home / <span style={{ color: '#3b82f6' }}>VERI MEI</span> / Dívida Ativa MEI
            </div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dívida Ativa MEI</h1>
                    <p className="page-sub">Consulta de débitos inscritos na Dívida Ativa (Integração Serpro)</p>
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

            {dividaData ? (
                 <div className="card">
                     <div className="card-title" style={{marginBottom: 20}}>Relatório de Dívida Ativa</div>
                     <pre style={{background: '#1e293b', color: '#e2e8f0', padding: 15, borderRadius: 8, fontSize: 12, overflow: 'auto', maxHeight: 400}}>
                         {JSON.stringify(dividaData, null, 2)}
                     </pre>
                 </div>
            ) : (
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '14px 20px', flex: 1, maxWidth: 220 }}>
                        <AlertTriangle size={20} color="#dc2626" />
                        <div>
                            <div style={{ fontSize: 22, fontWeight: 700, color: '#dc2626' }}>-</div>
                            <div style={{ fontSize: 12, fontWeight: 500, color: '#dc2626' }}>Aguardando Consulta</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
