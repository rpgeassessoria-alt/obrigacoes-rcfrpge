"use client";

import React, { useState, useEffect } from "react";
import { getWhatsAppStatus, conectarWhatsApp, enviarMensagemTeste } from "./actions";

export function AutomacaoView() {
    const [statusAtivo, setStatusAtivo] = useState(false);
    const [loading, setLoading] = useState(false);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [telefoneTeste, setTelefoneTeste] = useState("");
    const [mensagemTeste, setMensagemTeste] = useState("Teste de conexão FiscoControl");

    // Dados mockados para exibição de histórico de mensagens (pode ser expandido depois)
    const historicoMensagens = [
        { id: 1, cliente: "Tech Solutions Ltda", telefone: "5511999999999", status: "Enviado", data: new Date().toISOString() },
        { id: 2, cliente: "Comercial Silva", telefone: "5511888888888", status: "Enviado", data: new Date(Date.now() - 3600000).toISOString() },
        { id: 3, cliente: "Indústria ABC", telefone: "5511777777777", status: "Falha", data: new Date(Date.now() - 7200000).toISOString() }
    ];

    const checkStatus = async () => {
        const res = await getWhatsAppStatus();
        if (res.success && res.data?.status === "connected") {
            setStatusAtivo(true);
            setQrCode(null);
        } else {
            setStatusAtivo(false);
        }
    };

    useEffect(() => {
        checkStatus();
        const timer = setInterval(checkStatus, 15000); // Check status every 15s
        return () => clearInterval(timer);
    }, []);

    const handleConectar = async () => {
        setLoading(true);
        const res = await conectarWhatsApp();
        setLoading(false);

        if (res.success) {
            if (res.data?.base64) {
                setQrCode(res.data.base64);
            } else if (res.data?.qrcode) {
                setQrCode(res.data.qrcode);
            }
        } else {
            alert("Erro ao conectar: " + res.error);
        }
    };

    const handleEnviarTeste = async () => {
        if (!telefoneTeste) return alert("Informe um telefone.");
        setLoading(true);
        const res = await enviarMensagemTeste(telefoneTeste, mensagemTeste);
        setLoading(false);
        if (res.success) {
            alert("✅ Mensagem enviada com sucesso!");
        } else {
            alert("❌ Falha no envio: " + res.error);
        }
    };

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Automação WhatsApp</h1>
                    <p className="page-sub">Gerenciamento da integração com a Evolution API</p>
                </div>
            </div>

            <div className="dashboard-grid" style={{ gridTemplateColumns: "1fr 2fr" }}>
                <div className="card">
                    <h3 style={{ marginBottom: "20px" }}>Status da Conexão</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center", padding: "10px 0" }}>

                        {!qrCode ? (
                            <div style={{
                                width: "100px", height: "100px", borderRadius: "50%",
                                backgroundColor: statusAtivo ? "var(--success)" : "#1e3248",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "white", fontSize: "3rem", boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                            }}>
                                {statusAtivo ? "📱" : "📴"}
                            </div>
                        ) : (
                            <div style={{ padding: 10, background: "white", borderRadius: 8 }}>
                                <img src={qrCode} alt="WhatsApp QR Code" style={{ width: 180, height: 180 }} />
                                <p style={{ color: "#000", fontSize: 10, textAlign: "center", marginTop: 8 }}>Escaneie para conectar</p>
                            </div>
                        )}

                        <div style={{ textAlign: "center" }}>
                            <h2 style={{ color: statusAtivo ? "var(--success)" : "var(--text2)" }}>
                                {statusAtivo ? "Conectado" : "Aguardando Conexão"}
                            </h2>
                            <p style={{ color: "var(--text3)", marginTop: 4, fontSize: 12 }}>Instância: fiscocontrol_main</p>
                        </div>

                        <div style={{ display: "flex", gap: "10px", width: "100%", marginTop: "10px" }}>
                            {!statusAtivo ? (
                                <button className="btn-primary" style={{ flex: 1 }} onClick={handleConectar} disabled={loading}>
                                    {loading ? "Iniciando..." : qrCode ? "Atualizar QR" : "Conectar WhatsApp"}
                                </button>
                            ) : (
                                <button className="btn-primary" style={{ flex: 1, backgroundColor: "var(--danger)" }} onClick={() => setStatusAtivo(false)}>
                                    Desconectar
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: "20px" }}>Disparos Recentes</h3>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Telefone</th>
                                <th>Data/Hora</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historicoMensagens.map(msg => (
                                <tr key={msg.id}>
                                    <td><strong>{msg.cliente}</strong></td>
                                    <td className="mono">{msg.telefone}</td>
                                    <td>{new Date(msg.data).toLocaleString("pt-BR")}</td>
                                    <td>
                                        <span className={`badge ${msg.status === "Enviado" ? "badge-done" : "badge-late"}`}>
                                            {msg.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ padding: "20px", textAlign: "center", color: "var(--text3)", borderTop: "1px solid var(--border)", fontSize: "0.85rem" }}>
                        O serviço em background (Worker) verifica obrigações próximas ao vencimento todos os dias às 08:00h.
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginTop: "24px" }}>
                <h3 style={{ marginBottom: "16px" }}>Testar Disparo Manual</h3>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Telefone (ex: 5511999999999)"
                        style={{ flex: 1 }}
                        value={telefoneTeste}
                        onChange={e => setTelefoneTeste(e.target.value)}
                    />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Mensagem de teste..."
                        style={{ flex: 2 }}
                        value={mensagemTeste}
                        onChange={e => setMensagemTeste(e.target.value)}
                    />
                    <button className="btn-primary" disabled={!statusAtivo || loading} onClick={handleEnviarTeste}>
                        {loading ? "Enviando..." : "Enviar Teste"}
                    </button>
                </div>
            </div>
        </div>
    );
}
