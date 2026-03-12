"use client";
import React, { useState } from "react";
import axios from "axios";

export function AlertasView() {
    const [alertas, setAlertas] = useState<any[]>([]);
    const [config, setConfig] = useState({ email: true, whatsapp: false, dias: [1, 3, 7] });
    
    // Consulta Integrador
    const [cnpj, setCnpj] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSyncCaixaPostal = async () => {
        if (!cnpj || cnpj.length < 14) {
             setError("Digite um CNPJ válido");
             return;
        }

        setLoading(true);
        setError('');

        try {
             const res = await axios.get(`/api/integra-contador/caixa-postal?cnpj=${cnpj.replace(/\D/g, '')}`);
             const sAlertas = (res.data.mensagens || []).map((m: any, idx: number) => ({
                 id: Date.now() + idx,
                 tipo: m.assunto.toLowerCase().includes('atraso') ? 'atraso' : 'documento',
                 mensagem: `${m.assunto} - ${m.remetente || 'RFB'}`,
                 data: m.dataHoraEnvio || new Date().toLocaleString(),
                 lido: Boolean(m.lida)
             }));
             
             setAlertas(sAlertas);
             if (sAlertas.length === 0) {
                 setError("Nenhuma mensagem não lida encontrada na Caixa Postal.");
             }
        } catch (err: any) {
             console.error("Erro ao sincronizar e-CAC", err);
             setError(err.response?.data?.message || "Erro ao consultar Caixa Postal no e-CAC (Serpro).");
        } finally {
             setLoading(false);
        }
    };

    const marcarLido = (id: number) => setAlertas(alertas.map(a => a.id === id ? { ...a, lido: true } : a));
    const toggleDia = (d: number) => setConfig({
        ...config,
        dias: config.dias.includes(d)
            ? config.dias.filter(x => x !== d)
            : [...config.dias, d].sort((a, b) => a - b)
    });

    const iconeTipo: Record<string, string> = { atraso: "🚨", vencendo: "⚠️", documento: "✉️", sistema: "⚙️" };

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Caixa Postal & Alertas (e-CAC)</h1>
                    <p className="page-sub">{alertas.filter(a => !a.lido).length} mensagens não lidas</p>
                </div>
            </div>
            
            <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end'}}>
                     <div style={{ flex: 1 }}>
                         <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>CNPJ do Cliente (e-CAC)</label>
                         <input 
                            type="text" 
                            value={cnpj}
                            onChange={(e) => setCnpj(e.target.value)}
                            placeholder="00.000.000/0000-00"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border-color)' }}
                         />
                     </div>
                     <button className="btn-primary" onClick={handleSyncCaixaPostal} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                         {loading ? "Sincronizando..." : "📥 Sincronizar Caixa Postal"}
                     </button>
                </div>
                {error && <div style={{ padding: 12, background: '#fef2f2', color: '#dc2626', borderRadius: 8, marginTop: 14, fontSize: 14 }}>{error}</div>}
            </div>

            <div className="dash-row">
                <div className="card" style={{ flex: 2 }}>
                    <h3 className="card-title">Caixa de Entrada e-CAC</h3>
                    {alertas.length === 0 && !loading && !error && (
                        <p style={{ color: 'var(--text-muted)', fontSize: 14, padding: 20, textAlign: 'center' }}>
                            Utilize o CNPJ acima para buscar as mensagens da Receita Federal.
                        </p>
                    )}
                    <div className="alertas-list">
                        {alertas.map((a: any) => (
                            <div key={a.id} className={`alerta-item ${!a.lido ? "alerta-unread" : ""}`}>
                                <span className="alerta-icon">{iconeTipo[a.tipo] || "📄"}</span>
                                <div className="alerta-body">
                                    <p className="alerta-msg">{a.mensagem}</p>
                                    <span className="alerta-time">{a.data}</span>
                                </div>
                                {!a.lido && <button className="btn-icon" onClick={() => marcarLido(a.id)}>✓</button>}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="card" style={{ flex: 1 }}>
                    <h3 className="card-title">⚙️ Regras de Aviso</h3>
                    <div className="config-section">
                        <h4 className="config-title">Automação de Leitura</h4>
                        <label className="toggle-label">
                            <input type="checkbox" checked={config.email} onChange={() => setConfig({ ...config, email: !config.email })} />
                            <span className="toggle-slider" />Encaminhar p/ E-mail
                        </label>
                        <label className="toggle-label">
                            <input type="checkbox" checked={config.whatsapp} onChange={() => setConfig({ ...config, whatsapp: !config.whatsapp })} />
                            <span className="toggle-slider" />Avisar no WhatsApp
                        </label>
                    </div>
                    <button className="btn-primary btn-full">Salvar Regras</button>
                </div>
            </div>
        </div>
    );
}
