"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, Lock } from "lucide-react";
import "./login.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [keepConnected, setKeepConnected] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            setError("Credenciais inválidas ou acesso negado ao terminal.");
        } else {
            router.push("/");
        }
        setLoading(false);
    };

    return (
        <div className="login-page-wrapper">
            {/* Lado Esquerdo - Painel Azul Escuro (Terminal) */}
            <div className="login-left-panel">
                {/* Dotted Grid Background */}
                <div className="login-grid-bg"></div>

                <div className="login-left-content">
                    {/* Logotipo Diamante */}
                    <div className="login-logo-container">
                        <svg width="100" height="100" viewBox="0 0 100 100">
                            <polygon points="50,15 85,50 50,85 15,50" fill="#007BFF" />
                            <polygon points="36,36 64,36 50,50" fill="#040812" />
                        </svg>
                    </div>

                    {/* Títulos principais perfeitamente alinhados e italicizados */}
                    <div className="login-titles">
                        <h1 className="login-title-main">
                            CONTROLE DE OBRIGAÇÕES
                        </h1>
                        <h2 className="login-title-sub">
                            R.P.G.E
                        </h2>
                    </div>

                    <p className="login-description">
                        Sistema Avançado de Gestão e Monitoramento de<br />
                        Obrigações Profissionais em Tempo Real.
                    </p>

                    {/* Painel Gráfico (Cilindro com grid) */}
                    <div className="login-graphic-panel">
                        <div className="login-graphic-grid"></div>

                        <div className="login-graphic-badge">
                            LINK_SISTEMA: FLUXO_OBRIGAÇÕES_ATIVO
                        </div>

                        {/* Imagem / "Cilindro" principal no centro */}
                        <div className="login-graphic-center">
                            <div className="login-graphic-triangle"></div>
                            <div className="login-graphic-cylinder"></div>
                        </div>

                        {/* Elementos de "Piso / Circuito" */}
                        <div className="login-graphic-floor">
                            <div className="login-graphic-floor-pattern"></div>
                        </div>

                        {/* Barrinha/Dots azuis no canto inferior esquerdo */}
                        <div className="login-graphic-dots">
                            <div className="login-graphic-dot-large"></div>
                            <div className="login-graphic-dot-small"></div>
                            <div className="login-graphic-dot-small"></div>
                        </div>
                    </div>
                </div>

                {/* Footer Esquerdo */}
                <div className="login-left-footer">
                    <span>PROTOCOLO V2.4.0</span>
                    <span>NÓ SEGURO: 0X82A</span>
                </div>
            </div>

            {/* Lado Direito - Input Form */}
            <div className="login-right-panel">
                <div className="login-auth-header">
                    <h2 className="login-auth-title">Autenticação</h2>
                    <p className="login-auth-sub">Insira suas credenciais de acesso ao terminal.</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {/* USUÁRIO */}
                    <div className="login-form-group">
                        <label className="login-label">
                            USUÁRIO
                        </label>
                        <div className="login-input-wrapper">
                            <div className="login-input-corner-tl"></div>
                            <div className="login-input-corner-br"></div>

                            <input
                                type="text"
                                required
                                className="login-input login-input-user"
                                placeholder="ID_OPERADOR"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <User className="login-input-icon" />
                        </div>
                    </div>

                    {/* SENHA */}
                    <div className="login-form-group" style={{ marginTop: '0.5rem' }}>
                        <div className="login-form-label-row">
                            <label className="login-label">
                                SENHA
                            </label>
                            <a href="#" className="login-forgot-link">
                                ESQUECI A SENHA
                            </a>
                        </div>
                        <div className="login-input-wrapper">
                            <div className="login-input-corner-tl"></div>
                            <div className="login-input-corner-br"></div>

                            <input
                                type="password"
                                required
                                className="login-input login-input-pass"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Lock className="login-input-icon" />
                        </div>
                    </div>

                    {/* Checkbox */}
                    <div className="login-checkbox-row">
                        <label className="login-checkbox-label">
                            <div className="login-checkbox-box">
                                <input
                                    type="checkbox"
                                    className="login-checkbox-input"
                                    checked={keepConnected}
                                    onChange={() => setKeepConnected(!keepConnected)}
                                />
                                {keepConnected && <div className="login-checkbox-checked"></div>}
                            </div>
                            <span className="login-checkbox-text">
                                Manter conexão ativa nesta estação
                            </span>
                        </label>
                    </div>

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    {/* Botão de Entrar */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="login-submit-btn"
                    >
                        {loading ? "PROCESSANDO..." : "ENTRAR"}
                        {!loading && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="login-submit-icon">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                <polyline points="10 17 15 12 10 7" />
                                <line x1="15" y1="12" x2="3" y2="12" />
                            </svg>
                        )}
                    </button>

                    {/* Texto informativo */}
                    <div className="login-info-text">
                        <p>
                            Acesso restrito a pessoal autorizado.<br />
                            Todas as atividades estão sendo monitoradas e<br />registradas.
                        </p>
                    </div>
                </form>

                {/* Footer Lateral Direito */}
                <div className="login-right-footer">
                    <a href="#">PORTAL</a>
                    <a href="#">SUPORTE TÉCNICO</a>
                    <a href="#">LGPD</a>
                </div>
            </div>
        </div>
    );
}
