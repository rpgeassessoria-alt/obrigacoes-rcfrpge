"use client";
import React, { useState } from "react";

export function DocumentosView({ clientes }: { clientes: any[] }) {
    const [dragOver, setDragOver] = useState(false);
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    const docs = [
        { id: 1, clienteId: "1", nome: "DCTF_Jan2026_Recibo.pdf", tipo: "PDF", tamanho: "245 KB", data: "15/01/2026", obrigacao: "DCTF" },
        { id: 2, clienteId: "3", nome: "ECF_2025_Transmissão.pdf", tipo: "PDF", tamanho: "1.2 MB", data: "31/07/2025", obrigacao: "ECF" },
        { id: 3, clienteId: "2", nome: "PGDAS-D_Dez2025.pdf", tipo: "PDF", tamanho: "189 KB", data: "20/12/2025", obrigacao: "PGDAS-D" },
        { id: 4, clienteId: "4", nome: "EFD_ICMS_IPI_Out2025.txt", tipo: "TXT", tamanho: "8.9 MB", data: "10/11/2025", obrigacao: "EFD ICMS/IPI" }
    ];

    const iconeDoc = (n: string) => n.endsWith(".pdf") ? "📄" : n.endsWith(".xml") ? "📋" : n.endsWith(".txt") ? "📝" : "📁";

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Gestão Documental</h1>
                    <p className="page-sub">Armazenamento organizado por cliente e competência</p>
                </div>
            </div>
            <div className="dash-row">
                <div className="card" style={{ flex: 2 }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Arquivo</th>
                                <th>Cliente</th>
                                <th>Obrigação</th>
                                <th>Tipo</th>
                                <th>Tamanho</th>
                                <th>Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {docs.map(d => {
                                const c = clientes.find(x => x.id === d.clienteId);
                                return (
                                    <tr key={d.id}>
                                        <td>
                                            {iconeDoc(d.nome)} <span className="doc-nome">{d.nome}</span>
                                        </td>
                                        <td>{c?.razaoSocial.split(" ").slice(0, 2).join(" ") || "Cliente Demo"}</td>
                                        <td><strong>{d.obrigacao}</strong></td>
                                        <td><span className="tipo-tag tipo-federal">{d.tipo}</span></td>
                                        <td className="mono">{d.tamanho}</td>
                                        <td className="mono">{d.data}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="card" style={{ flex: 1 }}>
                    <h3 className="card-title">Upload de Documento</h3>
                    <div
                        className={`upload-zone-lg ${dragOver ? "upload-drag" : ""}`}
                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={e => { e.preventDefault(); setDragOver(false); }}
                    >
                        <div className="upload-icon">☁️</div>
                        <p className="upload-title">Arraste arquivos aqui</p>
                        <p className="upload-sub">ou clique para selecionar</p>
                        <p className="upload-types">PDF, XML, TXT, ZIP • Máx. 50MB</p>
                    </div>
                    <div className="form-group" style={{ marginTop: 14 }}>
                        <label>Cliente</label>
                        <select>
                            <option value="">Selecione um cliente...</option>
                            {clientes.map(c => <option key={c.id} value={c.id}>{c.razaoSocial.split(" ").slice(0, 3).join(" ")}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Competência</label>
                        <input type="month" defaultValue={`${anoAtual}-${String(mesAtual + 1).padStart(2, "0")}`} />
                    </div>
                    <button className="btn-primary btn-full">📤 Fazer Upload</button>
                </div>
            </div>
        </div>
    );
}
