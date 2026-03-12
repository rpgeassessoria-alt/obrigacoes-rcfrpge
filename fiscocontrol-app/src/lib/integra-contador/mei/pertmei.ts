import { IntegraContadorClient } from '../client';

export class PertMeiService {
  /**
   * Consulta extrato/situação do parcelamento PERT
   */
  static async consultarExtrato(cnpj: string): Promise<any> {
    return IntegraContadorClient.request({
      endpoint: `/integra-mei/pertmei/extrato`,
      method: 'GET',
      params: { cnpj },
      cnpjConsultado: cnpj,
      cacheTTL: 3600 // 1 hora
    });
  }

  /**
   * Emite a DAS de uma parcela do PERT MEI
   */
  static async emitirParcela(cnpj: string, numeroParcela: number): Promise<any> {
    return IntegraContadorClient.request({
      endpoint: `/integra-mei/pertmei/parcela`,
      method: 'POST',
      data: { cnpj, numeroParcela },
      cnpjConsultado: cnpj
    });
  }
}
