import { IntegraContadorClient } from '../client';

export class ParcMeiService {
  /**
   * Consulta extrato/situação do parcelamento padrão (PARCMEI)
   */
  static async consultarExtrato(cnpj: string): Promise<any> {
    return IntegraContadorClient.request({
      endpoint: `/integra-mei/parcmei/extrato`,
      method: 'GET',
      params: { cnpj },
      cnpjConsultado: cnpj,
      cacheTTL: 3600 // 1 hora
    });
  }

  /**
   * Emite a DAS de uma parcela do PARCMEI
   */
  static async emitirParcela(cnpj: string, numeroParcela: number): Promise<any> {
    return IntegraContadorClient.request({
      endpoint: `/integra-mei/parcmei/parcela`,
      method: 'POST',
      data: { cnpj, numeroParcela },
      cnpjConsultado: cnpj
    });
  }
}
