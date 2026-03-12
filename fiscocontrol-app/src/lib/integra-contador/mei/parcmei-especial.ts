import { IntegraContadorClient } from '../client';

export class ParcMeiEspecialService {
  /**
   * Consulta extrato/situação do parcelamento Especial
   */
  static async consultarExtrato(cnpj: string): Promise<any> {
    return IntegraContadorClient.request({
      endpoint: `/integra-mei/parcmei-especial/extrato`,
      method: 'GET',
      params: { cnpj },
      cnpjConsultado: cnpj,
      cacheTTL: 3600 // 1 hora
    });
  }

  /**
   * Emite a DAS de uma parcela do PARCMEI Especial
   */
  static async emitirParcela(cnpj: string, numeroParcela: number): Promise<any> {
    return IntegraContadorClient.request({
      endpoint: `/integra-mei/parcmei-especial/parcela`,
      method: 'POST',
      data: { cnpj, numeroParcela },
      cnpjConsultado: cnpj
    });
  }
}
