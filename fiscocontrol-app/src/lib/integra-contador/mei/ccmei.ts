import { IntegraContadorClient } from '../client';

export class CCMEIService {
  /**
   * Obtém o Certificado da Condição de Microempreendedor Individual (CCMEI)
   * PDF retornado em base64.
   */
  static async getCertificado(cnpj: string): Promise<any> {
    return IntegraContadorClient.request({
      endpoint: `/integra-mei/ccmei`,
      method: 'GET',
      params: { cnpj },
      cnpjConsultado: cnpj,
      cacheTTL: 86400 // 24 horas
    });
  }
}
