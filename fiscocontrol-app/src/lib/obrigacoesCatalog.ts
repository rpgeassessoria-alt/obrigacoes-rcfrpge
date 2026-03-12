export interface ObligationTemplate {
    id: string;
    nome: string;
    subtitulo?: string;
    categoria: string;
    esfera: 'Federal' | 'Estadual' | 'Municipal' | 'Previdenciária';
    periodo: 'Mensal' | 'Anual' | 'Trimestral' | 'Eventual';
    dia: number;
    mes: number; // -1 para mensal
    descricao?: string;
}

export const OBRIGACOES_CATALOG: ObligationTemplate[] = [
    // FEDERAL - SPED
    { id: "ECD", nome: "ECD — Escrituração Contábil Digital", subtitulo: "IN RFB 1.420/2013", categoria: "SPED / Escrituração Digital", esfera: "Federal", periodo: "Anual", dia: 31, mes: 4 },
    { id: "ECF", nome: "ECF — Escrituração Contábil Fiscal", subtitulo: "IN RFB 1.422/2013", categoria: "SPED / Escrituração Digital", esfera: "Federal", periodo: "Anual", dia: 31, mes: 6 },
    { id: "EFD-CONTRIB", nome: "EFD-Contribuições (PIS/COFINS)", subtitulo: "IN RFB 1.252/2012", categoria: "SPED / Escrituração Digital", esfera: "Federal", periodo: "Mensal", dia: 15, mes: -1 },
    { id: "EFD-ICMS-IPI", nome: "EFD ICMS/IPI — SPED Fiscal", subtitulo: "Ajuste SINIEF 02/2009", categoria: "SPED / Escrituração Digital", esfera: "Federal", periodo: "Mensal", dia: 20, mes: -1 },
    { id: "EFD-REINF", nome: "EFD-Reinf — Retenções e Informações Fiscais", subtitulo: "IN RFB 1.701/2017", categoria: "SPED / Escrituração Digital", esfera: "Federal", periodo: "Mensal", dia: 15, mes: -1 },
    { id: "EFD-PIS-IMP", nome: "EFD PIS/COFINS Importação", subtitulo: "Portaria Conjunta RFB", categoria: "SPED / Escrituração Digital", esfera: "Federal", periodo: "Mensal", dia: 15, mes: -1 },

    // FEDERAL - DECLARAÇÕES
    { id: "DCTF", nome: "DCTF — Débitos e Créditos Tributários", subtitulo: "IN RFB 1.599/2015", categoria: "Declarações", esfera: "Federal", periodo: "Mensal", dia: 15, mes: -1 },
    { id: "DIRF", nome: "DIRF — Imposto de Renda Retido na Fonte", subtitulo: "IN RFB 1.915/2019", categoria: "Declarações", esfera: "Federal", periodo: "Anual", dia: 28, mes: 1 },
    { id: "PERDCOMP", nome: "PER/DCOMP — Ressarcimento e Compensação", subtitulo: "IN RFB 1.717/2017", categoria: "Declarações", esfera: "Federal", periodo: "Eventual", dia: 30, mes: -1 },
    { id: "DIMOB", nome: "DIMOB — Atividades Imobiliárias", subtitulo: "IN RFB 1.115/2010", categoria: "Declarações", esfera: "Federal", periodo: "Anual", dia: 28, mes: 1 },

    // PREVIDENCIÁRIA
    { id: "ESOCIAL", nome: "eSocial — Obrigações Trabalhista e Previdenciárias", subtitulo: "Dec. 8.373/2014", categoria: "Previdenciárias e Trabalhistas", esfera: "Previdenciária", periodo: "Mensal", dia: 15, mes: -1 },
    { id: "DCTFWEB", nome: "DCTFWeb Previdenciária", subtitulo: "IN RFB 1.787/2018", categoria: "Previdenciárias e Trabalhistas", esfera: "Previdenciária", periodo: "Mensal", dia: 15, mes: -1 },
    { id: "GFIP", nome: "GFIP/SEFIP — Casos Residuais", subtitulo: "Lei 9.802/1999", categoria: "Previdenciárias e Trabalhistas", esfera: "Previdenciária", periodo: "Mensal", dia: 7, mes: -1 },

    // ESTADUAL
    { id: "GIA", nome: "GIA — Guia de Informação e Apuração do ICMS", subtitulo: "Legislação estadual (SEFAZ)", categoria: "ICMS", esfera: "Estadual", periodo: "Mensal", dia: 10, mes: -1 },
    { id: "GIA-ST", nome: "GIA-ST — Substituição Tributária Interestadual", subtitulo: "Legislação estadual", categoria: "ICMS", esfera: "Estadual", periodo: "Mensal", dia: 10, mes: -1 },
    { id: "SINTEGRA", nome: "SINTEGRA — Operações Interestaduais", subtitulo: "Conv. ICMS 57/1995", categoria: "ICMS", esfera: "Estadual", periodo: "Mensal", dia: 15, mes: -1 },
    { id: "DESTDA", nome: "DeSTDA — ST, Difal e Antecipação (Simples Nac.)", subtitulo: "Conv. ICMS 93/2015", categoria: "ICMS", esfera: "Estadual", periodo: "Mensal", dia: 20, mes: -1 },
    { id: "DIME", nome: "DIME — Informação ICMS e Mov. Econômico (SC)", subtitulo: "Portaria SEF/SC", categoria: "ICMS", esfera: "Estadual", periodo: "Mensal", dia: 10, mes: -1 },
    { id: "DAPI", nome: "DAPI — Apuração e Informação ICMS (MG)", subtitulo: "RICMS/MG", categoria: "ICMS", esfera: "Estadual", periodo: "Mensal", dia: 15, mes: -1 },
    { id: "DIEF", nome: "DIEF — Informações Econômico-Fiscais (PI/outros)", subtitulo: "Legislação estadual", categoria: "ICMS", esfera: "Estadual", periodo: "Mensal", dia: 15, mes: -1 },

    // MUNICIPAL
    { id: "DES", nome: "DES — Declaração Eletrônica de Serviços", subtitulo: "Legislação municipal", categoria: "ISS", esfera: "Municipal", periodo: "Mensal", dia: 10, mes: -1 },
    { id: "DMS", nome: "DMS — Declaração Mensal de Serviços", subtitulo: "Legislação municipal", categoria: "ISS", esfera: "Municipal", periodo: "Mensal", dia: 10, mes: -1 },
    { id: "NFSE", nome: "NFS-e — Nota Fiscal de Serviços Eletrônica", subtitulo: "LC 116/2003", categoria: "ISS", esfera: "Municipal", periodo: "Eventual", dia: 1, mes: -1 },
    { id: "ISS-RET", nome: "Declaração de ISS Retido na Fonte", subtitulo: "Legislação municipal", categoria: "ISS", esfera: "Municipal", periodo: "Mensal", dia: 15, mes: -1 },
    { id: "LIVRO-ISS", nome: "Livro Eletrônico do ISS", subtitulo: "Legislação municipal", categoria: "ISS", esfera: "Municipal", periodo: "Mensal", dia: 20, mes: -1 },
    { id: "DES-IF", nome: "DES-IF — Declaração de Instituições Financeiras", subtitulo: "Legislação municipal", categoria: "ISS", esfera: "Municipal", periodo: "Mensal", dia: 15, mes: -1 },
    { id: "DECL-CART", nome: "Declaração de Cartórios", subtitulo: "Legislação municipal", categoria: "ISS", esfera: "Municipal", periodo: "Mensal", dia: 15, mes: -1 },
];

export const SUGGESTIONS_BY_REGIME: Record<string, string[]> = {
    "Simples Nacional": ["DESTDA", "NFSE", "ESOCIAL", "DCTFWEB", "ISS-RET"],
    "Lucro Presumido": ["EFD-CONTRIB", "DCTF", "EFD-REINF", "ESOCIAL", "DCTFWEB", "GIA", "NFSE"],
    "Lucro Real": ["ECD", "ECF", "EFD-CONTRIB", "EFD-ICMS-IPI", "EFD-REINF", "ESOCIAL", "DCTFWEB", "GIA", "NFSE"],
    "MEI": ["NFSE", "ESOCIAL"]
};
