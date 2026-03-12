"use client";

import React, { useState } from 'react';
import { CheckCircle, XCircle, Search, Printer } from 'lucide-react';
import axios from 'axios';

export default function DasMeiPage() {
    const [cnpj, setCnpj] = useState('');
    const [competencia, setCompetencia] = useState('');
    const [loading, setLoading] = useState(false);
    const [dasData, setDasData] = useState<any>(null);
    const [error, setError] = useState('');

    const handleGerarDAS = async () => {
        if (!cnpj || !competencia) {
             setError("Preencha CNPJ e Competência");
             return;
        }

        setLoading(true);
        setError('');
        setDasData(null);

        try {
             const res = await axios.post(`/api/integra-contador/mei/das`, {
                 cnpj: cnpj.replace(/\D/g, ''),
                 periodoApuracao: competencia.replace(/\D/g, '') // Espera MMAAAA
             });
             setDasData(res.data);
        } catch (err: any) {
             console.error("Erro ao gerar DAS", err);
             setError(err.response?.data?.message || "Erro ao gerar DAS no Serpro.");
        } finally {
             setLoading(false);
        }
    }

    return (
        <div className="page-content">
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                Home / <span style={{ color: '#3b82f6' }}>VERI MEI</span> / DAS MEI
            </div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">DAS MEI</h1>
                    <p className="page-sub">Geração do Documento de Arrecadação (Integração Serpro)</p>
                </div>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
                <div style={{display: 'flex', gap: 10, alignItems: 'flex-end'}}>
                     <div style={{flex: 1}}>
                         <label style={{display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500}}>CNPJ</label>
                         <input 
                            type="text" 
                            value={cnpj}
                            onChange={(e) => setCnpj(e.target.value)}
                            placeholder="00.000.000/0000-00"
                            style={{width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-color)'}}
                         />
                     </div>
                     <div style={{flex: 1}}>
                         <label style={{display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500}}>Competência (MMAAAA)</label>
                         <input 
                            type="text" 
                            value={competencia}
                            onChange={(e) => setCompetencia(e.target.value)}
                            placeholder="Ex: 012024"
                            style={{width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-color)'}}
                         />
                     </div>
                     <button className="btn-primary" onClick={handleGerarDAS} disabled={loading} style={{display: 'flex', alignItems: 'center', gap: 8}}>
                         {loading ? "Gerando..." : <><Search size={18} /> Gerar DAS no Serpro</>}
                     </button>
                </div>
                {error && <div style={{padding: 12, background: '#fef2f2', color: '#dc2626', borderRadius: 8, marginTop: 14, fontSize: 14}}>{error}</div>}
            </div>

            {dasData && (
                <div className="card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
                         <div className="card-title" style={{margin: 0}}>DAS Gerado com Sucesso</div>
                         <button className="btn-primary" style={{background: '#16a34a', display: 'flex', alignItems: 'center', gap: 8}}>
                            <Printer size={18} /> Imprimir Guia
                         </button>
                    </div>
                    <div style={{background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #e2e8f0'}}>
                         <p style={{fontSize: 14, color: 'var(--text-muted)', marginBottom: 12}}>
                            ⚠️ O PDF base64 completo e o código de barras estão disponíveis na resposta da API.
                         </p>
                         <pre style={{background: '#1e293b', color: '#e2e8f0', padding: 15, borderRadius: 8, fontSize: 12, overflow: 'auto', maxHeight: 300}}>
                             {JSON.stringify(dasData, null, 2)}
                         </pre>
                    </div>
                 </div>
            )}
        </div>
    );
}
