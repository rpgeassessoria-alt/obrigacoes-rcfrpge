import { IntegraContadorClient } from '../client';

export interface DarfParams {
  cnpj: string;
  codigoReceita: string;
  periodoApuracao: string; // Ex: 202501 (YYYYMM) ou 20250101 dependendo do código
  dataVencimento: string; // Ex: 2025-02-20
  valorPrincipal: number;
  valorMulta?: number;
  valorJuros?: number;
  referencia?: string;
}

export class SicalwebService {
  /**
   * Gera uma guia DARF comum via integração Serpro / Sicalcweb
   */
  static async gerarDarf(params: DarfParams): Promise<any> {
    const {
      cnpj,
      codigoReceita,
      periodoApuracao,
      dataVencimento,
      valorPrincipal,
      valorMulta = 0,
      valorJuros = 0,
      referencia = ""
    } = params;
    
    // O DARF gerado pontualmente geralmente não usa cache (já que o usuário quer um PDF na hora com valores dinâmicos), 
    // ou usaria um cache muito curto pela chave do payload
    
    // Convertendo para o payload que a API do Serpro / Sicalcweb deve esperar
    const payload = {
      cnpj,
      codigoReceita,
      periodoApuracao,
      dataVencimento,
      valorPrincipal: Number(valorPrincipal).toFixed(2),
      valorMulta: Number(valorMulta).toFixed(2),
      valorJuros: Number(valorJuros).toFixed(2),
      referencia
    };

    return IntegraContadorClient.request({
      endpoint: `/integra-darf/gerar`, // Substituir pelo endpoint correto da API Integra Contador Sicalc
      method: 'POST',
      data: payload,
      cnpjConsultado: cnpj,
    });
  }
}
