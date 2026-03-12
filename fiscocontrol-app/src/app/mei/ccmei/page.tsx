"use client";

import React, { useState } from 'react';
import { FileText, CheckCircle, Search, Download } from 'lucide-react';
import axios from 'axios';

export default function CcmeiPage() {
    const [cnpj, setCnpj] = useState('');
    const [loading, setLoading] = useState(false);
    const [ccmeiData, setCcmeiData] = useState<any>(null);
    const [error, setError] = useState('');

    const handleConsultar = async () => {
        if (!cnpj || cnpj.length < 14) {
             setError("Digite um CNPJ válido");
             return;
        }

        setLoading(true);
        setError('');
        setCcmeiData(null);

        try {
             // Chama nosso proxy interno que abstrai a API do Serpro
             const res = await axios.get(`/api/integra-contador/mei/ccmei?cnpj=${cnpj.replace(/\D/g, '')}`);
             setCcmeiData(res.data);
        } catch (err: any) {
             console.error("Erro na consulta", err);
             setError(err.response?.data?.message || "Erro ao consultar CCMEI no Serpro.");
        } finally {
             setLoading(false);
        }
    }

    return (
        <div className="page-content">
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
                Home / <span style={{ color: '#3b82f6' }}>VERI MEI</span> / CCMEI
            </div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">CCMEI</h1>
                    <p className="page-sub">Certificado da Condição de Microempreendedor Individual (Integração Serpro)</p>
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

            {ccmeiData && (
                 <div className="card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
                         <div className="card-title" style={{margin: 0}}>Certificado Emitido</div>
                         <button className="btn-primary" style={{background: '#16a34a', display: 'flex', alignItems: 'center', gap: 8}}>
                            <Download size={18} /> Download PDF
                         </button>
                    </div>
                    <div style={{background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #e2e8f0'}}>
                         <div style={{marginBottom: 10}}><strong>Situação:</strong> Ativo</div>
                         <div style={{marginBottom: 10}}><strong>CNPJ:</strong> {ccmeiData.cnpj || cnpj}</div>
                         <p style={{fontSize: 14, color: 'var(--text-muted)'}}>
                            ⚠️ O PDF base64 completo e metadados adicionais estão disponíveis na resposta da API.
                         </p>
                         <pre style={{background: '#1e293b', color: '#e2e8f0', padding: 15, borderRadius: 8, fontSize: 12, overflow: 'auto', maxHeight: 300}}>
                             {JSON.stringify(ccmeiData, null, 2)}
                         </pre>
                    </div>
                 </div>
            )}
        </div>
    );
}
