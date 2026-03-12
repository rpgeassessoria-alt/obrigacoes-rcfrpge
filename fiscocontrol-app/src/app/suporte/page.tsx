"use client";

import React from 'react';
import { Headphones, MessageCircle, Mail, FileText, ExternalLink } from 'lucide-react';

export default function SuportePage() {
  // Número do suporte (Exemplo: adicione o seu número com DDI e DDD, apenas números)
  const whatsappNumber = "5511999999999";
  const whatsappMessage = "Olá, estou utilizando o FiscoControl e preciso de suporte.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="flex-1 overflow-auto bg-[#080d14] text-slate-300">
      {/* Topbar/Header da Página */}
      <div className="h-14 border-b border-[#1e3248] flex items-center px-6 bg-[#0d1520] sticky top-0 z-10 w-full shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <Headphones className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-200">Central de Suporte</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">ASSISTÊNCIA R.P.G.E TÉCNICA</p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 max-w-5xl mx-auto">
        {/* Hero Section Suporte */}
        <div className="mb-10 text-center relative overflow-hidden rounded-2xl bg-[#0d1520] border border-[#1e3248] p-10 lg:p-14">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              <Headphones className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Como podemos ajudar?</h2>
            <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed">
              Nossa equipe técnica está pronta para auxiliar você com qualquer dúvida ou problema no uso da plataforma FiscoControl.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">

          {/* Card WhatsApp Principal */}
          <div className="bg-[#0d1520] border border-[#1e3248] rounded-xl p-6 relative group overflow-hidden transition-all hover:border-[#22c55e]/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)]">
            {/* Glow effect green */}
            <div className="absolute -inset-2 bg-gradient-to-r from-[#22c55e]/0 via-[#22c55e]/5 to-[#22c55e]/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-[#22c55e]/10 flex items-center justify-center border border-[#22c55e]/20 text-[#22c55e]">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-[#22c55e]/10 text-[#22c55e] px-2 py-1 rounded">Recomendado</span>
              </div>

              <h3 className="text-lg font-bold text-slate-200 mb-2">Atendimento via WhatsApp</h3>
              <p className="text-sm text-slate-400 mb-6 min-h-[40px]">
                Resposta rápida pela nossa equipe de especialistas diretamente no seu celular.
              </p>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 flex items-center justify-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold rounded-lg transition-colors shadow-[0_0_15px_rgba(34,197,94,0.2)] text-sm"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                Iniciar Conversa
                <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-70" />
              </a>
            </div>
          </div>

          {/* Card Email Alternativo */}
          <div className="bg-[#0d1520] border border-[#1e3248] rounded-xl p-6 relative group overflow-hidden transition-all hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400">
                  <Mail className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-200 mb-2">Suporte por E-mail</h3>
              <p className="text-sm text-slate-400 mb-6 min-h-[40px]">
                Para requisições detalhadas, envio de logs ou anexos técnicos maiores.
              </p>

              <a
                href="mailto:suporte@fiscocontrol.com.br"
                className="w-full h-11 flex items-center justify-center gap-2 bg-[#162236] hover:bg-[#1e3248] border border-[#243b56] text-slate-300 hover:text-white font-semibold rounded-lg transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                suporte@fiscocontrol.com.br
              </a>
            </div>
          </div>

          {/* Card Manual */}
          <div className="bg-[#0d1520] border border-[#1e3248] rounded-xl p-6 relative group overflow-hidden transition-all md:col-span-2 mt-2">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 shrink-0 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-200">Base de Conhecimento e Manuais</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Consulte protocolos, respostas a erros comuns (R.P.G.E) e guias de uso do sistema.
                  </p>
                </div>
              </div>

              <button className="shrink-0 w-full sm:w-auto px-6 h-10 flex items-center justify-center gap-2 bg-transparent border border-[#1e3248] hover:border-slate-500 text-slate-300 hover:text-white font-medium rounded-lg transition-colors text-xs whitespace-nowrap">
                Acessar Documentação
                <ChevronRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Rodapé Interno Suporte */}
        <div className="mt-12 text-center pb-8 border-t border-[#1e3248] pt-8 max-w-4xl mx-auto">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
            Atendimento: Segunda a Sexta, 08h às 18h (Horário de Brasília)
          </p>
        </div>
      </div>
    </div>
  );
}

// Icon Helper
function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
