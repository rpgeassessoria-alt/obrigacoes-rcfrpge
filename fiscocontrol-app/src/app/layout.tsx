import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { VeraAssistant } from "@/components/VeraAssistant";

export const metadata: Metadata = {
    title: "FiscoControl - Sistema de Gestão Fiscal",
    description: "Monitoramento e Gestão de Obrigações Fiscais RPGE",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body>
                <div className="app">
                    <Sidebar />
                    <main className="main">
                        <div className="topbar">
                            <span className="topbar-breadcrumb">FiscoControl / <strong>Painel</strong></span>
                        </div>
                        <div className="scroll-area">
                            <div className="page-content">
                                {children}
                            </div>
                        </div>
                        <VeraAssistant />
                    </main>
                </div>
            </body>
        </html>
    );
}
