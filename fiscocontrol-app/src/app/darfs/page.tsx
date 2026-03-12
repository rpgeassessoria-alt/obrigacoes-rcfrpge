"use client";

import React, { useState } from 'react';
import { Search, FileDown, Calculator, Receipt } from 'lucide-react';
import axios from 'axios';

export default function SicalcwebPage() {
    const [formData, setFormData] = useState({
        cnpj: '',
        codigoReceita: '',
        periodoApuracao: '',
        dataVencimento: '',
        valorPrincipal: '0',
        valorMulta: '0',
        valorJuros: '0',
        referencia: ''
    });

    const [loading, setLoading] = useState(false);
    const [darfData, setDarfData] = useState<any>(null);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGerarDarf = async () => {
        if (!formData.cnpj || !formData.codigoReceita || !formData.periodoApuracao || !formData.dataVencimento || !formData.valorPrincipal) {
             setError("Preencha todos os campos obrigatórios (marcados com *)");
             return;
        }

        setLoading(true);
        setError('');
        setDarfData(null);

        try {
             const payload = {
                 ...formData,
                 cnpj: formData.cnpj.replace(/\D/g, ''),
                 valorPrincipal: parseFloat(formData.valorPrincipal.replace(',', '.')),
                 valorMulta: formData.valorMulta ? parseFloat(formData.valorMulta.replace(',', '.')) : 0,
                 valorJuros: formData.valorJuros ? parseFloat(formData.valorJuros.replace(',', '.')) : 0,
             };

             const res = await axios.post(`/api/integra-contador/darfs`, payload);
             setDarfData(res.data);
        } catch (err: any) {
             console.error("Erro na geração de DARF Sicalc", err);
             setError(err.response?.data?.message || err.response?.data?.error || "Erro ao gerar DARF na Receita Federal (Sicalc).");
        } finally {
             setLoading(false);
        }
    }

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Sicalc Web — Emissão de DARF</h1>
                    <p className="page-sub">Geração Avulsa de Documento de Arrecadação de Receitas Federais</p>
                </div>
            </div>

            <div className="dash-row">
                <div className="card" style={{ flex: 2 }}>
                    <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                        <Calculator size={20} color="var(--accent)" /> Formulário do DARF Comum
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label style={{display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600}}>CNPJ do Contribuinte *</label>
                            <input type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="00.000.000/0000-00" style={{width: '100%', padding: '10px', borderRadius: 6, border: '1px solid var(--border)'}} />
                        </div>
                        <div>
                            <label style={{display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600}}>Código da Receita *</label>
                            <input type="text" name="codigoReceita" value={formData.codigoReceita} onChange={handleChange} placeholder="Ex: 2089 (IRPJ)" style={{width: '100%', padding: '10px', borderRadius: 6, border: '1px solid var(--border)'}} />
                        </div>

                        <div>
                            <label style={{display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600}}>Período de Apuração *</label>
                            <input type="text" name="periodoApuracao" value={formData.periodoApuracao} onChange={handleChange} placeholder="MM/YYYY ou DD/MM/YYYY" style={{width: '100%', padding: '10px', borderRadius: 6, border: '1px solid var(--border)'}} />
                        </div>
                        <div>
                            <label style={{display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600}}>Data de Vencimento *</label>
                            <input type="date" name="dataVencimento" value={formData.dataVencimento} onChange={handleChange} style={{width: '100%', padding: '10px', borderRadius: 6, border: '1px solid var(--border)'}} />
                        </div>

                        <div>
                            <label style={{display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600}}>Valor Principal (R$) *</label>
                            <input type="text" name="valorPrincipal" value={formData.valorPrincipal} onChange={handleChange} placeholder="0,00" style={{width: '100%', padding: '10px', borderRadius: 6, border: '1px solid var(--border)'}} />
                        </div>
                        <div>
                            <label style={{display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600}}>Valor da Multa (R$)</label>
                            <input type="text" name="valorMulta" value={formData.valorMulta} onChange={handleChange} placeholder="0,00" style={{width: '100%', padding: '10px', borderRadius: 6, border: '1px solid var(--border)'}} />
                        </div>

                        <div>
                            <label style={{display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600}}>Valor dos Juros / Encargos (R$)</label>
                            <input type="text" name="valorJuros" value={formData.valorJuros} onChange={handleChange} placeholder="0,00" style={{width: '100%', padding: '10px', borderRadius: 6, border: '1px solid var(--border)'}} />
                        </div>
                        <div>
                            <label style={{display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600}}>Número de Referência (Opcional)</label>
                            <input type="text" name="referencia" value={formData.referencia} onChange={handleChange} placeholder="Apenas quando exigido pelo código" style={{width: '100%', padding: '10px', borderRadius: 6, border: '1px solid var(--border)'}} />
                        </div>
                    </div>

                    <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px dashed var(--border)' }}>
                        <button className="btn-primary" onClick={handleGerarDarf} disabled={loading} style={{ width: '100%', padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                            {loading ? "Processando na Receita Federal..." : <><Receipt size={20} /> Emitir DARF Oficial</>}
                        </button>
                    </div>
                    {error && <div style={{padding: 12, background: '#fef2f2', color: '#dc2626', borderRadius: 8, marginTop: 14, fontSize: 14}}>{error}</div>}

                </div>

                <div className="card" style={{ flex: 1, height: 'fit-content' }}>
                    <h3 className="card-title">Resultado da Emissão</h3>
                    {darfData ? (
                         <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                             <div style={{ background: '#ecfdf5', border: '1px solid #10b981', padding: 16, borderRadius: 8, textAlign: 'center' }}>
                                 <strong style={{ display: 'block', color: '#047857', marginBottom: 8 }}>DARF Gerado com Sucesso!</strong>
                                 <p style={{ fontSize: 12, color: '#065f46' }}>O código de barras já foi gerado pelo Sicalc e o tributo foi atrelado ao CNPJ informado.</p>
                             </div>
                             <br />
                             <button className="btn-primary" style={{ background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%' }}>
                                <FileDown size={18} /> Baixar PDF Autenticado
                             </button>
                             <div style={{background: '#f8fafc', padding: 15, borderRadius: 8, border: '1px solid #e2e8f0', marginTop: 10}}>
                                 <pre style={{background: '#1e293b', color: '#e2e8f0', padding: 10, borderRadius: 6, fontSize: 11, overflow: 'auto', maxHeight: 200}}>
                                     {JSON.stringify(darfData, null, 2)}
                                 </pre>
                             </div>
                         </div>
                    ) : (
                        <div style={{textAlign: 'center', padding: '40px 20px', opacity: 0.5}}>
                            <Receipt size={64} style={{ margin: '0 auto 20px', color: 'var(--text-muted)' }} />
                            <p style={{ fontSize: 13 }}>Nenhum DARF gerado nesta sessão. Preencha o formulário para emitir.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
