"use client";
import React, { useState } from "react";
import { salvarUsuario, excluirUsuario } from "./actions";

function StatusBadge({ status }: { status: string }) {
    const map: any = { Ativo: "badge-done", Suspenso: "badge-pending", Inativo: "badge-late" };
    return <span className={`badge ${map[status] || "badge-pending"}`}>{status}</span>;
}

export function EquipeView({ usuarios, clientes, gruposEconomicos, tenantId }: { usuarios: any[], clientes: any[], gruposEconomicos: any[], tenantId: string | null }) {
    const [modal, setModal] = useState(false);
    const [editando, setEditando] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [msgSalvo, setMsgSalvo] = useState("");
    const [confirmExcluir, setConfirmExcluir] = useState<any>(null);

    const [form, setForm] = useState({
        id: "",
        name: "",
        email: "",
        password: "",
        role: "ASSISTENTE",
        cargo: "",
        telefone: "",
        active: "Ativo",
        allowedGroups: [] as string[],
        tenantId: tenantId
    });

    const abrirNovo = () => {
        setEditando(null);
        setForm({
            id: "",
            name: "",
            email: "",
            password: "",
            role: "ASSISTENTE",
            cargo: "",
            telefone: "",
            active: "Ativo",
            allowedGroups: [],
            tenantId: tenantId
        });
        setModal(true);
    };

    const abrirEditar = (u: any) => {
        setEditando(u);
        setForm({
            id: u.id,
            name: u.name || "",
            email: u.email || "",
            password: "",
            role: u.role || "ASSISTENTE",
            cargo: u.cargo || "",
            telefone: u.telefone || "",
            active: u.active ? "Ativo" : "Inativo",
            allowedGroups: u.allowedGroups?.map((g: any) => g.id) || [],
            tenantId: tenantId
        });
        setModal(true);
    };

    const handleSalvar = async () => {
        if (!form.name || !form.email) {
            alert("Nome e e-mail são obrigatórios.");
            return;
        }
        setLoading(true);
        const res = await salvarUsuario(form, !!editando);
        setLoading(false);

        if (res.success) {
            setModal(false);
            setMsgSalvo(editando ? "✅ Usuário atualizado!" : "✅ Usuário cadastrado!");
            setTimeout(() => setMsgSalvo(""), 3500);
        } else {
            alert("Erro ao salvar: " + res.error);
        }
    };

    const handleExcluir = async () => {
        if (!confirmExcluir) return;
        setLoading(true);
        const res = await excluirUsuario(confirmExcluir.id);
        setLoading(false);

        if (res.success) {
            setConfirmExcluir(null);
            setMsgSalvo("🗑️ Usuário removido!");
            setTimeout(() => setMsgSalvo(""), 3500);
        } else {
            alert("Erro ao excluir: " + res.error);
        }
    };

    const toggleGroup = (groupId: string) => {
        setForm(prev => {
            const current = prev.allowedGroups;
            if (current.includes(groupId)) {
                return { ...prev, allowedGroups: current.filter(id => id !== groupId) };
            } else {
                return { ...prev, allowedGroups: [...current, groupId] };
            }
        });
    };

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Gestão de Equipe</h1>
                    <p className="page-sub">{usuarios.filter(u => u.active).length} usuários / {gruposEconomicos.length} grupos ativos</p>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    {msgSalvo && <span className="badge badge-done">{msgSalvo}</span>}
                    <button className="btn-primary" onClick={abrirNovo}>+ Novo Usuário</button>
                </div>
            </div>

            <div className="card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Colaborador</th>
                            <th>Perfil / Cargo</th>
                            <th>Grupos Permitidos</th>
                            <th>Status</th>
                            <th style={{ textAlign: "center" }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(u => (
                            <tr key={u.id}>
                                <td>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <div className="avatar-sm" style={{ background: "var(--primary-dim)", color: "var(--primary)" }}>{(u.name || "US").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}</div>
                                        <div>
                                            <div style={{ fontWeight: 700 }}>{u.name}</div>
                                            <div style={{ fontSize: 11, color: "var(--text3)" }}>{u.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className={`perfil-tag perfil-${u.role.toLowerCase()}`} style={{ display: "inline-block", marginBottom: 4 }}>{u.role}</div>
                                    <div style={{ fontSize: 11, color: "var(--text3)" }}>{u.cargo || "-"}</div>
                                </td>
                                <td>
                                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                                        {u.allowedGroups?.length === 0 ? <span className="text-muted" style={{ fontSize: 10 }}>Todos os grupos</span>
                                            : u.allowedGroups?.map((g: any) => <span key={g.id} className="badge badge-pending" style={{ fontSize: 9 }}>{g.name}</span>)}
                                    </div>
                                </td>
                                <td><StatusBadge status={u.active ? "Ativo" : "Inativo"} /></td>
                                <td style={{ textAlign: "center" }}>
                                    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                                        <button className="btn-icon" onClick={() => abrirEditar(u)}>✏️</button>
                                        <button className="btn-icon" style={{ color: "var(--red)" }} onClick={() => setConfirmExcluir(u)}>🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modal && (
                <div className="modal-overlay" onClick={() => setModal(false)}>
                    <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editando ? "Editar Usuário" : "Novo Usuário"}</h2>
                            <button className="modal-close" onClick={() => setModal(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group span-2">
                                    <label>Nome Completo *</label>
                                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>E-mail *</label>
                                    <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Perfil</label>
                                    <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                                        <option value="ADMIN">Administrador</option>
                                        <option value="CONTADOR">Contador</option>
                                        <option value="ASSISTENTE">Assistente</option>
                                    </select>
                                </div>
                                <div className="form-group span-2">
                                    <label>Grupos Econômicos Permitidos (Vazio = Todos)</label>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: 10, background: "var(--bg2)", borderRadius: 8 }}>
                                        {gruposEconomicos.map(g => (
                                            <label key={g.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
                                                <input type="checkbox" checked={form.allowedGroups.includes(g.id)} onChange={() => toggleGroup(g.id)} />
                                                {g.name}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Senha {editando && "(Opcional)"}</label>
                                    <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Status</label>
                                    <select value={form.active} onChange={e => setForm({ ...form, active: e.target.value })}>
                                        <option value="Ativo">Ativo</option>
                                        <option value="Inativo">Inativo</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
                            <button className="btn-primary" onClick={handleSalvar} disabled={loading}>
                                {loading ? "Salvando..." : "Confirmar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {confirmExcluir && (
                <div className="modal-overlay" onClick={() => setConfirmExcluir(null)}>
                    <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Excluir Usuário?</h2>
                        </div>
                        <div className="modal-body">
                            Tem certeza que deseja remover <strong>{confirmExcluir.name}</strong>?
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setConfirmExcluir(null)}>Não</button>
                            <button className="btn-primary" style={{ background: "var(--red)" }} onClick={handleExcluir}>Sim, Excluir</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
