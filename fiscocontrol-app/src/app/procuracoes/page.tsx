"use client";

import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Search, Lock } from 'lucide-react';
import axios from 'axios';

export default function ProcuracoesPage() {
    const [cnpj, setCnpj] = useState('');
    const [loading, setLoading] = useState(false);
    const [procuracoesData, setProcuracoesData] = useState<any>(null);
    const [error, setError] = useState('');

    const handleConsultar = async () => {
        if (!cnpj || cnpj.length < 14) {
             setError("Digite um CNPJ válido");
             return;
        }

        setLoading(true);
        setError('');
        setProcuracoesData(null);

        try {
             const res = await axios.get(`/api/integra-contador/procuracoes?cnpj=${cnpj.replace(/\D/g, '')}`);
             setProcuracoesData(res.data);
        } catch (err: any) {
             console.error("Erro na consulta Procurações", err);
             setError(err.response?.data?.message || "Erro ao consultar procurações no e-CAC (Serpro).");
        } finally {
             setLoading(false);
        }
    }

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Procurações Eletrônicas</h1>
                    <p className="page-sub">Consulta de Procurações Ativas Cadastradas na RFB</p>
                </div>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
                <div style={{display: 'flex', gap: 10, alignItems: 'flex-end'}}>
                     <div style={{flex: 1}}>
                         <label style={{display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500}}>CNPJ do Outorgante/Outorgado</label>
                         <input 
                            type="text" 
                            value={cnpj}
                            onChange={(e) => setCnpj(e.target.value)}
                            placeholder="00.000.000/0000-00"
                            style={{width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-color)'}}
                         />
                     </div>
                     <button className="btn-primary" onClick={handleConsultar} disabled={loading} style={{display: 'flex', alignItems: 'center', gap: 8}}>
                         {loading ? "Consultando..." : <><Search size={18} /> Buscar no Serpro</>}
                     </button>
                </div>
                {error && <div style={{padding: 12, background: '#fef2f2', color: '#dc2626', borderRadius: 8, marginTop: 14, fontSize: 14}}>{error}</div>}
            </div>

            {procuracoesData ? (
                 <div className="card">
                    <div className="card-title" style={{marginBottom: 20}}>Status da Procuração</div>
                    <div style={{background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #e2e8f0'}}>
                         <pre style={{background: '#1e293b', color: '#e2e8f0', padding: 15, borderRadius: 8, fontSize: 12, overflow: 'auto', maxHeight: 300}}>
                             {JSON.stringify(procuracoesData, null, 2)}
                         </pre>
                    </div>
                 </div>
            ) : (
                <div className="card">
                    <div style={{textAlign: 'center', padding: '40px 0'}}>
                        <Lock size={48} color="var(--border)" style={{margin: '0 auto 15px'}} />
                        <h3 className="card-title" style={{marginBottom: 8}}>Suas Procurações Seguras</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                            Verifique se o cliente concedeu os acessos necessários para emitir guias e ler mensagens na Caixa Postal.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
