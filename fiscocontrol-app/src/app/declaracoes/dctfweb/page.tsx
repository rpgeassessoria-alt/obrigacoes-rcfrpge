"use client";

import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Search, FileText } from 'lucide-react';
import axios from 'axios';

export default function DctfWebPage() {
    const [cnpj, setCnpj] = useState('');
    const [periodo, setPeriodo] = useState('');
    const [loading, setLoading] = useState(false);
    const [declaracaoData, setDeclaracaoData] = useState<any>(null);
    const [error, setError] = useState('');

    const handleConsultar = async () => {
        if (!cnpj || cnpj.length < 14) {
             setError("Digite um CNPJ válido");
             return;
        }
        if (!periodo || periodo.length !== 6) {
             setError("Digite o período no formato YYYYMM");
             return;
        }

        setLoading(true);
        setError('');
        setDeclaracaoData(null);

        try {
             const res = await axios.get(`/api/integra-contador/declaracoes/dctfweb?cnpj=${cnpj.replace(/\D/g, '')}&periodo=${periodo}`);
             setDeclaracaoData(res.data);
        } catch (err: any) {
             console.error("Erro na consulta DCTFWeb", err);
             setError(err.response?.data?.message || "Erro ao consultar declaração no e-CAC (Serpro).");
        } finally {
             setLoading(false);
        }
    }

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">DCTFWeb</h1>
                    <p className="page-sub">Consulta de Recibos e Transmissões DCTFWeb via Serpro</p>
                </div>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-title">Consultar Declaração</div>
                <div style={{display: 'flex', gap: 10, alignItems: 'flex-end', marginTop: 15, flexWrap: 'wrap'}}>
                     <div style={{flex: 1, minWidth: 200}}>
                         <label style={{display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500}}>CNPJ da Empresa</label>
                         <input 
                            type="text" 
                            value={cnpj}
                            onChange={(e) => setCnpj(e.target.value)}
                            placeholder="00.000.000/0000-00"
                            style={{width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-color)'}}
                         />
                     </div>
                     <div style={{flex: 1, minWidth: 200}}>
                         <label style={{display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500}}>Período de Apuração</label>
                         <input 
                            type="text" 
                            value={periodo}
                            onChange={(e) => setPeriodo(e.target.value)}
                            placeholder="YYYYMM (Ex: 202501)"
                            style={{width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-color)'}}
                         />
                     </div>
                     <button className="btn-primary" onClick={handleConsultar} disabled={loading} style={{display: 'flex', alignItems: 'center', gap: 8, height: 42}}>
                         {loading ? "Consultando..." : <><Search size={18} /> Consultar Serpro</>}
                     </button>
                </div>
                {error && <div style={{padding: 12, background: '#fef2f2', color: '#dc2626', borderRadius: 8, marginTop: 14, fontSize: 14}}>{error}</div>}
            </div>

            {declaracaoData ? (
                 <div className="card">
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
                         <div className="card-title" style={{margin: 0}}>Detalhes da Declaração</div>
                         <div style={{display: 'flex', gap: 8}}>
                             <button className="btn-primary" style={{background: '#16a34a', display: 'flex', alignItems: 'center', gap: 8}}>
                                ✔️ Emitir Recibo PDF
                             </button>
                             <button className="btn-primary" style={{background: '#3b82f6', display: 'flex', alignItems: 'center', gap: 8}}>
                                🧾 Gerar DARF Pelo Sicalc
                             </button>
                         </div>
                    </div>
                    <div style={{background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #e2e8f0'}}>
                         <pre style={{background: '#1e293b', color: '#e2e8f0', padding: 15, borderRadius: 8, fontSize: 12, overflow: 'auto', maxHeight: 300}}>
                             {JSON.stringify(declaracaoData, null, 2)}
                         </pre>
                    </div>
                 </div>
            ) : (
                <div className="card">
                    <div className="card-title">Histórico de Transmissões</div>
                    <div style={{textAlign: 'center', padding: '40px 0'}}>
                        <FileText size={48} color="var(--border)" style={{margin: '0 auto 15px'}} />
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                            Utilize o formulário acima para baixar detalhes da DCTFWeb do CNPJ especificado.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
