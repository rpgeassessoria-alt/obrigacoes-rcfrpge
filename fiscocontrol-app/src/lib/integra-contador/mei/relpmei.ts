import { IntegraContadorClient } from '../client';

export class RelpMeiService {
  /**
   * Consulta extrato/situação do parcelamento RELP
   */
  static async consultarExtrato(cnpj: string): Promise<any> {
    return IntegraContadorClient.request({
      endpoint: `/integra-mei/relpmei/extrato`,
      method: 'GET',
      params: { cnpj },
      cnpjConsultado: cnpj,
      cacheTTL: 3600 // 1 hora
    });
  }

  /**
   * Emite a DAS de uma parcela do RELP MEI
   */
  static async emitirParcela(cnpj: string, numeroParcela: number): Promise<any> {
    return IntegraContadorClient.request({
      endpoint: `/integra-mei/relpmei/parcela`,
      method: 'POST',
      data: { cnpj, numeroParcela },
      cnpjConsultado: cnpj
    });
  }
}
